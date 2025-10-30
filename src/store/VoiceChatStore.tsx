import { create } from "zustand";
// askQuestion is no longer needed, as we handle the stream directly
import { transformCounselorData } from "@/api/chatbot";
import type { AllCounselor } from "@/types/academic";
import { API_CONFIG } from "@/api/config";

export interface VoiceMessage {
  text: string;
  isUser: boolean;
  counsellors?: AllCounselor[];
  followup?: string;
}

type VoiceChatState = {
  messages: VoiceMessage[];
  isListening: boolean;
  isSpeaking: boolean;
  isVoiceChatOpen: boolean;
  currentAudio: HTMLAudioElement | null;
  currentMediaSource: MediaSource | null;
  currentStreamReader: ReadableStreamDefaultReader<Uint8Array> | null;
  // --- NEW: AbortController to stop the /ask stream ---
  currentChatStreamController: AbortController | null;
  toggleVoiceChat: () => void;
  startListening: () => void;
  stopListening: () => void;
  stopSpeaking: () => void;
  processUserTranscript: (transcript: string) => Promise<void>;
  // --- NEW: Helper function to play audio ---
  playAudioStream: (text: string) => Promise<void>;
};

export const useVoiceChatStore = create<VoiceChatState>((set, get) => ({
  messages: [],
  isListening: false,
  isSpeaking: false,
  isVoiceChatOpen: false,
  currentAudio: null,
  currentMediaSource: null,
  currentStreamReader: null,
  currentChatStreamController: null,

  toggleVoiceChat: () => {
    get().stopSpeaking(); // This stops both audio and text streams
    set((state) => ({
      isVoiceChatOpen: !state.isVoiceChatOpen,
      messages: !state.isVoiceChatOpen ? [] : state.messages,
    }));
  },

  startListening: () => set({ isListening: true }),
  stopListening: () => set({ isListening: false }),

  stopSpeaking: () => {
    const {
      currentAudio,
      currentStreamReader,
      currentMediaSource,
      currentChatStreamController,
    } = get();

    // 1. Cancel the /ask network request
    if (currentChatStreamController) {
      currentChatStreamController.abort();
    }

    // 2. Cancel the /synthesize network request
    if (currentStreamReader) {
      currentStreamReader.cancel().catch(() => {});
    }

    // 3. Pause the audio element
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.src = "";
    }

    // 4. Clean up the MediaSource
    if (currentMediaSource && currentMediaSource.readyState === "open") {
      try {
        currentMediaSource.endOfStream();
      } catch (e) {
        console.warn("Error ending MediaSource stream:", e);
      }
    }

    // 5. Reset the state
    set({
      currentAudio: null,
      currentMediaSource: null,
      currentStreamReader: null,
      currentChatStreamController: null,
      isSpeaking: false, // Ensure speaking is set to false
    });
  },

  // --- NEW: Helper function to stream audio ---
  // This contains the MediaSource logic from the previous step
  playAudioStream: async (text: string) => {
    if (!text.trim()) {
      console.warn("Skipping audio playback for empty text.");
      return;
    }

    try {
      const audioResponse = await fetch(`${API_CONFIG.chatbotUrl}/synthesize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!audioResponse.ok || !audioResponse.body) {
        throw new Error("Failed to fetch TTS audio stream.");
      }

      const audio = new Audio();
      const mediaSource = new MediaSource();
      const reader = audioResponse.body.getReader();

      audio.src = URL.createObjectURL(mediaSource);

      set({
        currentAudio: audio,
        currentMediaSource: mediaSource,
        currentStreamReader: reader,
        isSpeaking: true,
      });

      audio.play().catch((e) => console.error("Audio play failed:", e));

      mediaSource.addEventListener("sourceopen", async () => {
        const sourceBuffer = mediaSource.addSourceBuffer("audio/mpeg");

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            sourceBuffer.appendBuffer(value);
            await new Promise((resolve) => {
              sourceBuffer.onupdateend = resolve;
            });
          }
        } catch (e) {
          console.log("Audio stream stopped or encountered an error:", e);
        } finally {
          if (mediaSource.readyState === "open") {
            mediaSource.endOfStream();
          }
        }
      });

      audio.onended = () => get().stopSpeaking();
      audio.onerror = () => {
        console.error("Error playing audio.");
        get().stopSpeaking();
      };
    } catch (err) {
      console.error("Error in audio playback:", err);
      set({ isSpeaking: false });
    }
  },

  // --- COMPLETELY REWRITTEN: processUserTranscript ---
  processUserTranscript: async (transcript: string) => {
    if (!transcript) return;

    // Stop any currently playing audio/streams
    get().stopSpeaking();

    const userMessage: VoiceMessage = { text: transcript, isUser: true };
    set((state) => ({ messages: [...state.messages, userMessage] }));

    // Format history for the backend
    const currentHistory = get().messages.map((msg) => ({
      role: msg.isUser ? "user" : "assistant",
      content: msg.text + (msg.followup ? " " + msg.followup : ""),
    }));

    // Create a new AbortController for this request
    const chatController = new AbortController();
    set({ currentChatStreamController: chatController });

    try {
      // 1. --- Handle the /ask SSE Stream ---
      const response = await fetch(
        `${API_CONFIG.chatbotUrl}/ask?question=${encodeURIComponent(
          transcript
        )}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(currentHistory), // Send history in the body
          signal: chatController.signal, // Pass the abort signal
        }
      );

      if (!response.ok || !response.body) {
        throw new Error("Failed to fetch chat response.");
      }

      // Add a new, empty bot message to the state
      const botMessageId = get().messages.length;
      const initialBotMessage: VoiceMessage = {
        text: "",
        isUser: false,
        followup: "",
        counsellors: [],
      };
      set((state) => ({
        messages: [...state.messages, initialBotMessage],
      }));

      // Variables to accumulate the full response
      let fullAnswer = "";
      let fullFollowup = "";

      // Read the SSE stream
      const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        // The stream sends data in the format: "data: { ... }\n\n"
        // We need to parse this
        const lines = value
          .split("\n\n")
          .filter((line) => line.startsWith("data: "));

        for (const line of lines) {
          try {
            const rawData = line.substring(5); // Remove "data: "
            const event = JSON.parse(rawData);

            // Update the state based on the event type
            set((state) => {
              const messages = [...state.messages];
              const targetMessage = messages[botMessageId];
              if (!targetMessage) return { messages };

              switch (event.type) {
                case "text_chunk":
                  targetMessage.text += event.content;
                  fullAnswer += event.content; // Keep accumulating for TTS
                  break;
                case "followup":
                  targetMessage.followup = event.data;
                  fullFollowup = event.data; // Save for TTS
                  break;
                case "counsellors":
                  targetMessage.counsellors = event.data.map(
                    transformCounselorData
                  );
                  break;
                case "done":
                  // This case is handled by the loop finishing
                  break;
              }
              return { messages };
            });
          } catch (e) {
            console.error("Error parsing SSE event:", e, "Data:", line);
          }
        }
      }

      // 2. --- Stream is done, start audio playback ---
      set({ currentChatStreamController: null }); // Clear the controller
      const textToSpeak = fullAnswer + " " + fullFollowup;
      await get().playAudioStream(textToSpeak);
      
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.log("Chat stream aborted by user.");
        return; // This is expected, not an error
      }
      
      console.error("Error in conversation flow:", err);
      const errorMessage: VoiceMessage = {
        text: "Sorry, an error occurred.",
        isUser: false,
      };
      set((state) => ({
        messages: [...state.messages, errorMessage],
        isSpeaking: false,
        currentChatStreamController: null,
      }));
    }
  },
}));