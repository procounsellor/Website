import { create } from "zustand";
import { askQuestion, transformCounselorData } from "@/components/chatbot/api";
import type { AllCounselor } from "@/types/academic";
import { API_CONFIG } from "@/api/config";
export interface VoiceMessage {
  text: string;
  isUser: boolean;
  counsellors?: AllCounselor[];
}

type VoiceChatState = {
  messages: VoiceMessage[];
  isListening: boolean;
  isSpeaking: boolean;
  isVoiceChatOpen: boolean;
  currentAudio: HTMLAudioElement | null;
  toggleVoiceChat: () => void;
  startListening: () => void;
  stopListening: () => void;
  stopSpeaking: () => void;
  processUserTranscript: (transcript: string) => Promise<void>;
};

export const useVoiceChatStore = create<VoiceChatState>((set, get) => ({
  messages: [],
  isListening: false,
  isSpeaking: false,
  isVoiceChatOpen: false,
  currentAudio: null,

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
    const audio = get().currentAudio;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      set({ currentAudio: null, isSpeaking: false });
    }
  },

  processUserTranscript: async (transcript: string) => {
    if (!transcript) return;

    const userMessage: VoiceMessage = { text: transcript, isUser: true };
    set((state) => ({ messages: [...state.messages, userMessage] }));

    const currentHistory = get().messages.map((msg) => ({
      text: msg.text,
      isUser: msg.isUser,
    }));

    try {
      const response = await askQuestion(transcript, currentHistory);
      const transformedCounsellors = response.counsellors.map(
        transformCounselorData
      );
      const botMessage: VoiceMessage = {
        text: response.answer,
        isUser: false,
        counsellors: transformedCounsellors,
      };

      set((state) => ({ messages: [...state.messages, botMessage] }));

      const audioResponse = await fetch(`${API_CONFIG.chatbotUrl}/synthesize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: response.answer }),
      });

      if (audioResponse.ok) {
        const audioBlob = await audioResponse.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);

        set({ currentAudio: audio, isSpeaking: true });
        audio.play();
        audio.onended = () => {
          set({ isSpeaking: false, currentAudio: null });
        };
        audio.onerror = () => {
          console.error("Error playing audio.");
          set({ isSpeaking: false, currentAudio: null });
        };
      } else {
        console.error("Failed to fetch TTS audio.");
        set({ isSpeaking: false });
      }
    } catch (err) {
      console.error("Error in conversation flow:", err);
      const errorMessage: VoiceMessage = { text: "Sorry, an error occurred.", isUser: false };
      set((state) => ({ messages: [...state.messages, errorMessage], isSpeaking: false }));
    }
  },
}));