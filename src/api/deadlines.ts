import { API_CONFIG } from "./config";

// Type definition matching the JSON response
export interface EventItem {
  id: string;
  title: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  associatedCourseId: string[];
  description: string;
  associatedExamsIds: string[];
  photoUrl: string;
  priority: number;
  applicationUrl: string;
  typeOfEvent: string;
  isDeleted: boolean;
  createdAt: { seconds: number; nanos: number };
  updatedAt: { seconds: number; nanos: number };
}

export const getDeadlines = async (): Promise<EventItem[]> => {
  // Update this endpoint to whatever route your backend actually uses
  const response = await fetch(`${API_CONFIG.baseUrl.replace(/\/$/, '')}/api/shared/getAllEventDeadlines`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || data.error || "Failed to fetch deadlines");
  }

  return data; 
};

export const getEventById = async (eventId: string): Promise<EventItem> => {
  const token = typeof window !== "undefined" ? localStorage.getItem("jwt") : null;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "Accept": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_CONFIG.baseUrl.replace(/\/$/, '')}/api/shared/getEventById?eventId=${eventId}`, {
    method: "GET",
    headers:{
      Accept:'application/json'
    }
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || data.error || "Failed to fetch event details");
  }

  return data;
};