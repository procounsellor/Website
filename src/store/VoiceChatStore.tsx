import { create } from "zustand";
import { transformCounselorData } from "@/api/chatbot";
import type { AllCounselor } from "@/types/academic";
import { API_CONFIG } from "@/api/config";

export interface VoiceMessage {
  text: string;
  isUser: boolean;
  counsellors?: AllCounselor[];
  followup?: string;
}

// Optimized Splitter: Splits on long pauses or commas if text is long
const splitIntoSentences = (text: string): { sentence: string; remaining: string } | null => {
  const sentenceMatch = text.match(/^(.+?([.?!]+["')\]]*))(\s+|$)/);
  if (sentenceMatch) {
    return { sentence: sentenceMatch[1].trim(), remaining: text.slice(sentenceMatch[0].length) };
  }
  
  // If chunk is getting huge (>60 chars) and has a comma, split there for speed
  if (text.length > 60) {
    const commaMatch = text.match(/^(.+?([,]+))(\s+|$)/);
    if (commaMatch) {
        return { sentence: commaMatch[1].trim(), remaining: text.slice(commaMatch[0].length) };
    }
  }
  return null;
};

type VoiceChatState = {
  messages: VoiceMessage[];
  isListening: boolean;
  isSpeaking: boolean;
  isVoiceChatOpen: boolean;
  
  // --- Audio State ---
  audioQueue: Promise<string>[]; 
  isPlayingQueue: boolean; // Acts as "Buffering/Loading" state
  currentAudio: HTMLAudioElement | null;
  
  // --- Abort Controllers ---
  currentChatStreamController: AbortController | null;

  // --- Actions ---
  toggleVoiceChat: () => void;
  startListening: () => void;
  stopListening: () => void;
  stopSpeaking: () => void;
  processUserTranscript: (transcript: string) => Promise<void>;
  
  // --- Internal Helpers ---
  queueAudio: (text: string) => void;
  processAudioQueue: () => Promise<void>;
};

export const useVoiceChatStore = create<VoiceChatState>((set, get) => ({
  messages: [],
  isListening: false,
  isSpeaking: false,
  isVoiceChatOpen: false,
  
  audioQueue: [],
  isPlayingQueue: false,
  currentAudio: null,
  currentChatStreamController: null,

  toggleVoiceChat: () => {
    get().stopSpeaking();
    set((state) => ({
      isVoiceChatOpen: !state.isVoiceChatOpen,
      messages: !state.isVoiceChatOpen ? [] : state.messages,
    }));
  },

  startListening: () => set({ isListening: true }),
  stopListening: () => set({ isListening: false }),

  stopSpeaking: () => {
    const { currentAudio, currentChatStreamController } = get();
    if (currentChatStreamController) currentChatStreamController.abort();
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }
    set({
      isSpeaking: false,
      isPlayingQueue: false,
      audioQueue: [],
      currentAudio: null,
      currentChatStreamController: null,
    });
  },

  queueAudio: (text: string) => {
    // Filter noise
    if (!text || !/[a-zA-Z0-9]/.test(text)) return;

    // Prefetch audio immediately
    const audioPromise = (async () => {
      try {
        const response = await fetch(`${API_CONFIG.chatbotUrl}/synthesize`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        });

        if (!response.ok) throw new Error("TTS Failed");
        const blob = await response.blob();
        return URL.createObjectURL(new Blob([blob], { type: "audio/mpeg" }));
      } catch (e) {
        console.error("TTS Error:", e);
        return ""; 
      }
    })();

    set((state) => ({ audioQueue: [...state.audioQueue, audioPromise] }));
    
    // Only trigger processor if it's idle
    if (!get().isPlayingQueue) {
      get().processAudioQueue();
    }
  },

  processAudioQueue: async () => {
    // Set PlayingQueue to TRUE to indicate "We are busy/buffering"
    // But do NOT set isSpeaking yet. This keeps UI in "Thinking" mode.
    set({ isPlayingQueue: true });

    while (get().audioQueue.length > 0) {
      const nextAudioPromise = get().audioQueue[0];
      
      try {
        const audioUrl = await nextAudioPromise;
        set((state) => ({ audioQueue: state.audioQueue.slice(1) }));

        if (audioUrl) {
          await new Promise<void>((resolve) => {
            const audio = new Audio(audioUrl);
            set({ currentAudio: audio });
            
            // Gapless Hack: Start downloading the NEXT file while this one plays
            const nextInLine = get().audioQueue[0];
            if (nextInLine) {
                 nextInLine.then(url => { if(url) new Audio(url); });
            }

            audio.onended = () => {
              URL.revokeObjectURL(audioUrl); 
              resolve();
            };
            
            audio.onerror = () => {
              URL.revokeObjectURL(audioUrl);
              resolve(); 
            };

            // CRITICAL: Only show "AI Speaking" when sound ACTUALLY starts
            audio.onplay = () => {
                 set({ isSpeaking: true });
            };

            const playPromise = audio.play();
            if (playPromise !== undefined) {
              playPromise.catch(() => resolve());
            }
          });
        }
      } catch (e) {
        console.error("Queue processing error:", e);
        set((state) => ({ audioQueue: state.audioQueue.slice(1) }));
      }
      
      if (!get().isPlayingQueue) break; 
    }

    set({ isPlayingQueue: false, isSpeaking: false, currentAudio: null });
  },

  processUserTranscript: async (transcript: string) => {
    if (!transcript) return;
    get().stopSpeaking();

    const userMessage: VoiceMessage = { text: transcript, isUser: true };
    set((state) => ({ messages: [...state.messages, userMessage] }));

    const currentHistory = get().messages.map((msg) => ({
      role: msg.isUser ? "user" : "assistant",
      content: msg.text + (msg.followup ? " " + msg.followup : ""),
    }));

    const chatController = new AbortController();
    set({ currentChatStreamController: chatController });

    let sentenceBuffer = ""; 

    try {
      const payload = {
        formattedHistory: currentHistory,
        userId: "user_temp", 
        sessionId: "session_temp", 
        userType: "visitor", 
        source: "voice_chat"
      };

      const response = await fetch(`${API_CONFIG.chatbotUrl}/ask?question=${encodeURIComponent(transcript)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: chatController.signal,
      });

      const botMessageId = get().messages.length;
      set((state) => ({
        messages: [...state.messages, { text: "", isUser: false, followup: "", counsellors: [] }],
      }));

      if (!response.body) throw new Error("No body");
      const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const lines = value.split("\n\n").filter((line) => line.startsWith("data: "));

        for (const line of lines) {
          try {
            const event = JSON.parse(line.substring(5));

            set((state) => {
              const messages = [...state.messages];
              const target = messages[botMessageId];
              if (!target) return { messages };

              if (event.type === "text_chunk") {
                target.text += event.content;
                sentenceBuffer += event.content;
                
                let extraction;
                while ((extraction = splitIntoSentences(sentenceBuffer))) {
                  if (extraction.sentence.trim().length > 0) { 
                      get().queueAudio(extraction.sentence);
                  }
                  sentenceBuffer = extraction.remaining;
                }
              } else if (event.type === "followup") {
                target.followup = event.data;
                get().queueAudio(event.data);
              } else if (event.type === "counsellors") {
                target.counsellors = event.data.map(transformCounselorData);
              }
              return { messages };
            });
          } catch (e) { /* ignore */ }
        }
      }

      if (sentenceBuffer.trim()) {
        get().queueAudio(sentenceBuffer);
      }

    } catch (err: any) {
      if (err.name !== 'AbortError') {
        set((state) => ({ messages: [...state.messages, { text: "Error occurred.", isUser: false }] }));
      }
    } finally {
      set({ currentChatStreamController: null });
    }
  },
}));