// useChatStore.ts

import { create } from "zustand";
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
  abortController: AbortController | null; // ✨ ADD THIS: To hold the controller
  loading: boolean;
  toggleChatbot: () => void;
  sendMessage: (question: string) => Promise<void>;
  stopGenerating: () => void; // ✨ ADD THIS: The new stop function
  loadMessages: (messages: Message[]) => void; // ✨ ADD THIS LINE
  clearMessages: () => void; // ✨ ADD THIS LINE
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
  abortController: null, // ✨ ADD THIS: Initial state
  messages: [],
  isChatbotOpen: false,
  loading: false,

  toggleChatbot: () => {
    set((state) => ({ isChatbotOpen: !state.isChatbotOpen }));
  },
  stopGenerating: () => {
    const { abortController } = get();
    if (abortController) {
      abortController.abort(); // Abort the fetch request
      set({ loading: false, abortController: null });
    }
  },
  loadMessages: (newMessages: Message[]) => {
    set({ messages: newMessages });
  },

  clearMessages: () => {
    set({ messages: [] });
  },

  sendMessage: async (question: string) => {
    get().abortController?.abort();
    const userMessage: Message = { text: question, isUser: true };
    const currentHistory = get().messages;
    const controller = new AbortController(); // ✨ CREATE a new controller for this request
    const botPlaceholder: Message = { text: "", isUser: false, counsellors: [], followup: "" };
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
        `http://127.0.0.1:8000/ask?question=${encodeURIComponent(question)}`, // IMPORTANT: Update with your backend URL
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formattedHistory),
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