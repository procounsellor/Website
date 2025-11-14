// useChatStore.ts

import { create } from "zustand";
import type { AllCounselor } from "@/types/academic";
import { API_CONFIG } from "@/api/config";
import {
  getSessionData,
  createNewSession,
  type SessionData,
} from "@/lib/sessionManager";
import { fetchChatSessions, fetchChatHistory, type ChatSession } from "@/api/chatbot";

export interface Message {
  text: string;
  isUser: boolean;
  counsellors?: AllCounselor[];
  followup?: string;
}

type ChatState = {
  messages: Message[];
  isChatbotOpen: boolean;
  abortController: AbortController | null;
  loading: boolean;
  currentSessionId: string | null;
  chatSessions: ChatSession[];
  visitorMessageCount: number; // Track messages for visitors
  isLoginOpenFromChatbot: boolean; // Track if login was opened from chatbot
  toggleChatbot: () => void;
  sendMessage: (question: string, userId?: string | null, userRole?: string | null) => Promise<void>;
  stopGenerating: () => void;
  loadMessages: (messages: Message[]) => void;
  clearMessages: () => void;
  startNewChat: () => void;
  loadChatSessions: (userId: string) => Promise<void>;
  loadChatHistoryBySessionId: (sessionId: string) => Promise<void>;
  setCurrentSessionId: (sessionId: string | null) => void;
  incrementVisitorMessageCount: () => number;
  resetVisitorMessageCount: () => void;
  setLoginOpenFromChatbot: (isOpen: boolean) => void;
};

// This helper function is moved from your api.ts file
// because it's only used here now.
const transformCounselorData = (apiCounselor: any): AllCounselor => {
  const [firstName, ...lastName] = (apiCounselor.fullName || "N/A").split(" ");
  return {
    counsellorId: apiCounselor.counsellorId,
    firstName: firstName,
    lastName: lastName.join(" "),
    photoUrlSmall: apiCounselor.photo || "/default-avatar.jpg",
    rating: apiCounselor.rating || 0,
    ratePerYear: apiCounselor.plusAmount || 5000,
    experience: `${apiCounselor.experience || 0}`,
    languagesKnow: (apiCounselor.languagesKnown || "English").split(", "),
    city: apiCounselor.city || apiCounselor.state || "N/A",
    numberOfRatings: `${apiCounselor.reviewCount || 0}`,
  };
};


export const useChatStore = create<ChatState>((set, get) => ({
  abortController: null,
  messages: [],
  isChatbotOpen: false,
  loading: false,
  currentSessionId: null,
  chatSessions: [],
  visitorMessageCount: 0,
  isLoginOpenFromChatbot: false,

  toggleChatbot: () => {
    set((state) => ({ isChatbotOpen: !state.isChatbotOpen }));
  },

  setLoginOpenFromChatbot: (isOpen: boolean) => {
    set({ isLoginOpenFromChatbot: isOpen });
  },
  
  stopGenerating: () => {
    const { abortController } = get();
    if (abortController) {
      abortController.abort();
      set({ loading: false, abortController: null });
    }
  },
  
  loadMessages: (newMessages: Message[]) => {
    set({ messages: newMessages });
  },

  clearMessages: () => {
    set({ messages: [] });
  },
  
  startNewChat: () => {
    const newSessionId = createNewSession();
    set({ messages: [], currentSessionId: newSessionId });
    console.log("🆕 New chat session started:", newSessionId);
  },

  setCurrentSessionId: (sessionId: string | null) => {
    set({ currentSessionId: sessionId });
  },

  // Load chat sessions for authenticated user
  loadChatSessions: async (userId: string) => {
    try {
      const sessions = await fetchChatSessions(userId);
      set({ chatSessions: sessions });
      console.log("📋 Loaded chat sessions:", sessions);
    } catch (error) {
      console.error("Failed to load chat sessions:", error);
      set({ chatSessions: [] });
    }
  },

  // Load chat history for a specific session
  loadChatHistoryBySessionId: async (sessionId: string) => {
    try {
      const history = await fetchChatHistory(sessionId);
      
      // Transform API messages to our Message format
      const transformedMessages: Message[] = history.map((msg) => ({
        text: msg.content,
        isUser: msg.role === "user",
        counsellors: undefined,
        followup: undefined,
      }));
      
      set({ 
        messages: transformedMessages, 
        currentSessionId: sessionId 
      });
      console.log("💬 Loaded chat history for session:", sessionId);
    } catch (error) {
      console.error("Failed to load chat history:", error);
      set({ messages: [] });
    }
  },

  incrementVisitorMessageCount: () => {
    const newCount = get().visitorMessageCount + 1;
    set({ visitorMessageCount: newCount });
    return newCount;
  },

  resetVisitorMessageCount: () => {
    set({ visitorMessageCount: 0 });
  },

  sendMessage: async (question: string, userId?: string | null, userRole?: string | null) => {
    get().abortController?.abort();
    const userMessage: Message = { text: question, isUser: true };
    const currentHistory = get().messages;
    const controller = new AbortController(); // ✨ CREATE a new controller for this request
    const botPlaceholder: Message = { text: "", isUser: false, counsellors: [], followup: "" };
    
    // ✨ Get session data
    const sessionData: SessionData = getSessionData(userId, userRole);
    
    // ✨ Update current session ID if it's a new chat
    if (!get().currentSessionId) {
      set({ currentSessionId: sessionData.sessionId });
    }
    
    console.log("📤 Sending message with session data:", {
      sessionId: sessionData.sessionId,
      userId: sessionData.userId,
      userType: sessionData.userType,
      source: sessionData.source,
    });
    
    set((state) => ({
      messages: [...state.messages, userMessage, botPlaceholder],
      loading: true,
      abortController: controller,
    }));

    try {
      const historyForAPI = [...currentHistory, userMessage];

      // FIX 2: Correctly combine text and followup for assistant messages.
      const formattedHistory = historyForAPI.map((msg) => {
        let content = msg.text;
        // If the message is from the assistant and has a followup, combine them.
        if (!msg.isUser && msg.followup) {
          content = `${msg.text} ${msg.followup}`.trim();
        }
        return {
          role: msg.isUser ? 'user' : 'assistant',
          content: content,
        };
      });

      // Use the native fetch API for streaming
      const response = await fetch(
        `${API_CONFIG.chatbotUrl}/ask?question=${encodeURIComponent(question)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            formattedHistory,
            sessionId: sessionData.sessionId,
            userId: sessionData.userId,
            userType: sessionData.userType,
            source: sessionData.source,
          }),
          signal: controller.signal, // ✨ PASS the signal to fetch
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      if (!response.body) {
        throw new Error("Response body is null");
      }
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        if (get().abortController?.signal.aborted) {
            console.log("Stream reading stopped by abort signal.");
            break;
        }
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || ""; // Keep the last, possibly incomplete line

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const jsonString = line.substring(6);
            try {
              const eventData = JSON.parse(jsonString);

              // Add a small delay for smoother streaming (mimics ChatGPT)
              await new Promise(resolve => setTimeout(resolve, 10));

              set((state) => {
                const lastMessageIndex = state.messages.length - 1;
                const newMessages = JSON.parse(JSON.stringify(state.messages)); // Deep copy to ensure re-render

                switch (eventData.type) {
                  case "text_chunk":
  // ensure placeholder has streamingRaw buffer
  if (!(newMessages[lastMessageIndex] as any).streamingRaw) {
    (newMessages[lastMessageIndex] as any).streamingRaw = "";
  }
  (newMessages[lastMessageIndex] as any).streamingRaw += eventData.content;
  // expose raw buffer as visible text
  newMessages[lastMessageIndex].text = (newMessages[lastMessageIndex] as any).streamingRaw;
  break;

                  case "counsellors":
                    newMessages[lastMessageIndex].counsellors = eventData.data.map(transformCounselorData);
                    break;
                  case "followup":
                    newMessages[lastMessageIndex].followup = eventData.data;
                    break;
                  case "error":
                    newMessages[lastMessageIndex].text = eventData.content;
                    break;
                }
                return { messages: newMessages };
              });
            } catch (e) {
              console.error("Failed to parse stream JSON:", jsonString);
            }
          }
        }
      }
    } catch (err: any) {
      // ✨ Gracefully handle the user-triggered abort action
      if (err.name === 'AbortError') {
        console.log("Fetch aborted by user.");
        // We remove the placeholder message that was waiting for a response
        // set(state => ({ messages: state.messages.slice(0, -1) }));
      } else {
        console.error("Streaming failed:", err);
        const errorMessage: Message = { text: "Sorry, I couldn't connect to the server.", isUser: false };
        set((state) => ({
          messages: [...state.messages.slice(0, -1), errorMessage],
        }));
      }
    } finally {
      // ✨ Clean up the controller and loading state
      set({ loading: false, abortController: null });
    }
  },
}));