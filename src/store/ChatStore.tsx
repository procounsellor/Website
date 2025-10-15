import { create } from "zustand";
import { askQuestion, transformCounselorData } from "@/api/chatbot";
import type { AllCounselor } from "@/types/academic";

export interface Message {
  text: string;
  isUser: boolean;
  counsellors?: AllCounselor[];
  followup?: string;
}

type ChatState = {
  messages: Message[];
  isChatbotOpen: boolean;
  loading: boolean;
  toggleChatbot: () => void;
  sendMessage: (question: string) => Promise<void>;
  loadMessages: (messages: Message[]) => void;
  clearMessages: () => void;
};

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  isChatbotOpen: false,
  loading: false,

  toggleChatbot: () => {
    set((state) => ({ isChatbotOpen: !state.isChatbotOpen }));
  },

  loadMessages: (messages: Message[]) => {
    set({ messages });
  },

  clearMessages: () => {
    set({ messages: [] });
  },

  sendMessage: async (question: string) => {
    const userMessage: Message = { text: question, isUser: true};
    
    // Get the current conversation history *before* adding the new user message
    const currentHistory = get().messages;

    set((state) => ({
      messages: [...state.messages, userMessage],
      loading: true,
    }));

    try {
      // Pass the history to the askQuestion function
      const response = await askQuestion(question, currentHistory);
      const transformedCounsellors = response.counsellors.map(transformCounselorData);
      const botMessage: Message = {
        text: response.answer,
        isUser: false,
        counsellors: transformedCounsellors,
        followup: response.followup,
      };

      set((state) => ({
        messages: [...state.messages, botMessage],
      }));
    } catch (err) {
      const errorMessage: Message = {
        text: "Sorry, I encountered an error.",
        isUser: false,
      };
      set((state) => ({ messages: [...state.messages, errorMessage] }));
    } finally {
      set({ loading: false });
    }
  },
}));