import axios from "axios";
import { API_CONFIG } from "@/api/config";
import type { AllCounselor } from "@/types/academic";
import type { SessionData } from "@/lib/sessionManager";

export interface CounsellorFromAPI {
  counsellorId: string;
  photo?: string;
  fullName?: string;
  languagesKnown?: string;
  city?: string;
  state?: string;
  rating?: number;
  reviewCount?: number;
  plusAmount?: number;
  experience?: number;
  verified?: boolean;
}

export interface AskResponse {
  answer: string;
  counsellors: CounsellorFromAPI[];
  followup?: string;
}

interface FrontendMessage {
  text: string;
  isUser: boolean;
  followup?: string;
}

// Session types
export interface ChatSession {
  sessionId: string;
  title: string;
  isBookmarked?: boolean;
}

export interface ChatSessionsResponse {
  userId: string;
  sessions: ChatSession[];
}

export interface ChatHistoryMessage {
  content: string;
  role: "user" | "ai";
  timestamp: string;
  messageId: string;
}

export interface ChatHistoryResponse {
  sessionId: string;
  userId: string;
  messages: ChatHistoryMessage[];
}

export const askQuestion = async (
  question: string,
  history: FrontendMessage[],
  sessionData: SessionData
): Promise<AskResponse> => {
  const formattedHistory = history.map((msg) => ({
    role: msg.isUser ? "user" : "assistant",
    content: msg.text + " " + msg.followup,
  }));

  const response = await axios.post<AskResponse>(
    `${API_CONFIG.chatbotUrl}/ask?question=${encodeURIComponent(question)}`,
    {
      formattedHistory,
      sessionId: sessionData.sessionId,
      userId: sessionData.userId,
      userType: sessionData.userType,
      source: sessionData.source,
    } 
  );
  return response.data;
};

// Fetch user's chat sessions
export const fetchChatSessions = async (userId: string): Promise<ChatSession[]> => {
  try {
    const response = await axios.get<ChatSessionsResponse>(
      `${API_CONFIG.chatbotUrl}/sessions/${userId}`
    );
    return response.data.sessions;
  } catch (error) {
    console.error("Failed to fetch chat sessions:", error);
    return [];
  }
};

// Fetch chat history for a specific session
export const fetchChatHistory = async (sessionId: string): Promise<ChatHistoryMessage[]> => {
  try {
    const response = await axios.get<ChatHistoryResponse>(
      `${API_CONFIG.chatbotUrl}/chat/${sessionId}`
    );
    return response.data.messages;
  } catch (error) {
    console.error("Failed to fetch chat history:", error);
    return [];
  }
};

// The translator function remains the same
export const transformCounselorData = (apiCounselor: CounsellorFromAPI): AllCounselor => {
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

//1. Rename
export const renameSession = async (
  userId: string,
  sessionId: string,
  newTitle: string
): Promise<boolean> => {
  try {
    await axios.patch(
      `${API_CONFIG.chatbotUrl}/sessions/${userId}/${sessionId}/rename`,
      { title: newTitle }
    );
    return true;
  } catch (error) {
    console.error("Failed to rename session:", error);
    return false;
  }
};

// 2. Delete
export const deleteSession = async (
  userId: string,
  sessionId: string
): Promise<boolean> => {
  try {
    await axios.patch(
      `${API_CONFIG.chatbotUrl}/sessions/${userId}/${sessionId}/delete`
    );
    return true;
  } catch (error) {
    console.error("Failed to delete session:", error);
    return false;
  }
};

// 3. Bookmark
export const bookmarkSession = async (
  userId: string,
  sessionId: string,
  bookmarked: boolean
): Promise<boolean> => {
  try {
    const queryParam = bookmarked ? "" : "?bookmarked=false";
    await axios.patch(
      `${API_CONFIG.chatbotUrl}/sessions/${userId}/${sessionId}/bookmark${queryParam}`
    );
    
    return true;
  } catch (error) {
    console.error("Failed to bookmark session:", error);
    return false;
  }
};