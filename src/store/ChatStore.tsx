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
  visitorMessageCount: number; 
  isLoginOpenFromChatbot: boolean; 
  isLoadingSessions: boolean; 
  isLoadingHistory: boolean; 
  sessionsFetched: boolean; 
  toggleChatbot: () => void;
  sendMessage: (question: string, userId?: string | null, userRole?: string | null) => Promise<void>;
  stopGenerating: () => void;
  loadMessages: (messages: Message[]) => void;
  clearMessages: () => void;
  startNewChat: () => void;
  loadChatSessions: (userId: string, force?: boolean) => Promise<void>;
  loadChatHistoryBySessionId: (sessionId: string) => Promise<void>;
  setCurrentSessionId: (sessionId: string | null) => void;
  incrementVisitorMessageCount: () => number;
  resetVisitorMessageCount: () => void;
  setLoginOpenFromChatbot: (isOpen: boolean) => void;
  resetChatState: () => void;
  updateSessionTitle: (sessionId: string, title: string) => void;
};

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
  isLoadingSessions: false,
  isLoadingHistory: false,
  sessionsFetched: false,

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
    
    get().updateSessionTitle(newSessionId, "New Chat");
    
    console.log("New chat session started:", newSessionId);
  },

  setCurrentSessionId: (sessionId: string | null) => {
    set({ currentSessionId: sessionId });
  },


  loadChatSessions: async (userId: string, force: boolean = false) => {
    if (get().sessionsFetched && !force) {
      console.log("Using cached chat sessions");
      return;
    }
    
    set({ isLoadingSessions: true });
    try {
      const sessions = await fetchChatSessions(userId);
      set({ chatSessions: sessions, isLoadingSessions: false, sessionsFetched: true });
      console.log("Loaded chat sessions:", sessions);
    } catch (error) {
      console.error("Failed to load chat sessions:", error);
      set({ chatSessions: [], isLoadingSessions: false });
    }
  },

  updateSessionTitle: (sessionId: string, title: string) => {
    set((state) => {
      const existingSession = state.chatSessions.find(s => s.sessionId === sessionId);
      
      if (existingSession) {
        return {
          chatSessions: state.chatSessions.map(s =>
            s.sessionId === sessionId ? { ...s, title } : s
          )
        };
      } else {
        // Add new session at the top
        return {
          chatSessions: [
            { sessionId, title, updatedAt: new Date().toISOString() },
            ...state.chatSessions
          ]
        };
      }
    });
  },


  loadChatHistoryBySessionId: async (sessionId: string) => {
    set({ isLoadingHistory: true });
    try {
      const history = await fetchChatHistory(sessionId);
      
      
      const transformedMessages: Message[] = history.map((msg) => ({
        text: msg.content,
        isUser: msg.role === "user",
        counsellors: undefined,
        followup: undefined,
      }));
      
      set({ 
        messages: transformedMessages, 
        currentSessionId: sessionId,
        isLoadingHistory: false
      });
      console.log("Loaded chat history for session:", sessionId);
    } catch (error) {
      console.error("Failed to load chat history:", error);
      set({ messages: [], isLoadingHistory: false });
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

 
  resetChatState: () => {
    get().abortController?.abort();
    set({
      messages: [],
      currentSessionId: null,
      chatSessions: [],
      visitorMessageCount: 0,
      loading: false,
      abortController: null,
      isLoadingSessions: false,
      isLoadingHistory: false,
      sessionsFetched: false,
    });
    console.log("Chat state reset");
  },

  sendMessage: async (question: string, userId?: string | null, userRole?: string | null) => {
    get().abortController?.abort();
    const userMessage: Message = { text: question, isUser: true };
    const currentHistory = get().messages;
    const controller = new AbortController(); 
    const botPlaceholder: Message = { text: "", isUser: false, counsellors: [], followup: "" };
    
   
    let sessionId = get().currentSessionId;
    let sessionData: SessionData;
    
    if (sessionId) {
      const sessionDataTemp = getSessionData(userId, userRole);
      sessionData = {
        ...sessionDataTemp,
        sessionId: sessionId  // Override with existing session ID
      };
      console.log("Using existing session ID:", sessionId);
    } else {
      sessionData = getSessionData(userId, userRole);
      sessionId = sessionData.sessionId;
      set({ currentSessionId: sessionId });
      console.log(" Created new session ID:", sessionId);
    }
    
   
    const isFirstMessageInSession = currentHistory.length === 0;
    
    console.log("Sending message with session data:", {
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

      const formattedHistory = historyForAPI.map((msg) => {
        let content = msg.text;
        
        if (!msg.isUser && msg.followup) {
          content = `${msg.text} ${msg.followup}`.trim();
        }
        
        // Build the message object with counsellors data 
        const messageObj: any = {
          role: msg.isUser ? 'user' : 'assistant',
          content: content,
        };
        
        if (!msg.isUser && msg.counsellors && msg.counsellors.length > 0) {
          messageObj.counsellors = msg.counsellors;
        }
        
        return messageObj;
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
          signal: controller.signal, 
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
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const jsonString = line.substring(6);
            try {
              const eventData = JSON.parse(jsonString);

              await new Promise(resolve => setTimeout(resolve, 10));

              set((state) => {
                const lastMessageIndex = state.messages.length - 1;
                const newMessages = JSON.parse(JSON.stringify(state.messages)); 
                switch (eventData.type) {
                  case "text_chunk":
  if (!(newMessages[lastMessageIndex] as any).streamingRaw) {
    (newMessages[lastMessageIndex] as any).streamingRaw = "";
  }
  (newMessages[lastMessageIndex] as any).streamingRaw += eventData.content;
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
      if (err.name === 'AbortError') {
        console.log("Fetch aborted by user.");
      } else {
        console.error("Streaming failed:", err);
        const errorMessage: Message = { text: "Sorry, I couldn't connect to the server.", isUser: false };
        set((state) => ({
          messages: [...state.messages.slice(0, -1), errorMessage],
        }));
      }
    } finally {
      set({ loading: false, abortController: null });
      
      if (isFirstMessageInSession && sessionData.sessionId) {
        const title = question.length > 50 ? question.substring(0, 50) + "..." : question;
        console.log("Updating session title from 'New Chat' to:", title);
        get().updateSessionTitle(sessionData.sessionId, title);
      }
    }
  },
}));