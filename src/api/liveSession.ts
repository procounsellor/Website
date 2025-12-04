import { API_CONFIG } from './config';

export interface CreateLiveSessionRequest {
  counsellorId: string;
  type: 'DIRECT_LIVE' | 'SCHEDULED_LIVE';
  date?: string | null;
  startTime?: string | null;
  endTime?: string | null;
  title: string;
  forWhom: 'ALL_STUDENTS' | 'SUBSCRIBERS' | 'COURSE';
  courseId?: string | null;
  description: string;
}

export interface LiveSessionResponse {
  success: boolean;
  message: string;
  data?: {
    streamKey: string;
    playbackId: string;
    liveSessionId: string;
    sessionData: {
      liveSessionId: string;
      counsellorId: string;
      type: string;
      date: string | null;
      startTime: string | null;
      endTime: string | null;
      createdAt: {
        seconds: number;
        nanos: number;
      };
      updatedAt: null | {
        seconds: number;
        nanos: number;
      };
      title: string;
      forWhom: string;
      courseId: string | null;
      description: string;
      broadcastId: string | null;
      streamId: string | null;
      youtubeVideoId: string | null;
      ingestionAddress: string | null;
      streamName: string | null;
      fullRtmpUrl: string | null;
      youtubeWatchUrl: string | null;
      playbackId: string;
      streamKey: string;
      userIdsJoined: string[];
      cancelled: boolean;
    };
  };
}

export async function createLiveSession(
  data: CreateLiveSessionRequest,
  token: string
): Promise<LiveSessionResponse> {
  const response = await fetch(
    `${API_CONFIG.baseUrl}/api/counsellorLiveSession/createLiveSession`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to create live session');
  }

  return response.json();
}
