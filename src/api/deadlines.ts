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