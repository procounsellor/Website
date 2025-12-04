import { API_CONFIG } from './config';

export interface LiveSessionItem {
  liveSessionId: string;
  counsellorId: string;
  counsellorFullName: string;
  counsellorPhotoUrl: string | null;
  date: string | null;
  startTime: string | null;
  endTime: string | null;
  title: string;
  forWhom: string;
  courseId: string | null;
  description: string;
  playbackId: string | null;
  streamKey: string | null;
}

export interface LiveSessionDetail {
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
  updatedAt: {
    seconds: number;
    nanos: number;
  } | null;
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
}

export interface LiveSessionsResponse {
  success: boolean;
  message: string;
  data: LiveSessionItem[];
}

export interface LiveSessionDetailResponse {
  success: boolean;
  message: string;
  data: LiveSessionDetail;
}

export const getAllLiveSessions = async (
  counsellorId: string,
  token: string
): Promise<LiveSessionsResponse> => {
  const response = await fetch(
    `${API_CONFIG.baseUrl}/api/counsellorLiveSession/getAllLiveSessionsOfCounsellor?counsellorId=${counsellorId}`,
    {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch live sessions');
  }

  return response.json();
};

export const getUpcomingLiveSessions = async (
  counsellorId: string,
  token: string
): Promise<LiveSessionsResponse> => {
  const response = await fetch(
    `${API_CONFIG.baseUrl}/api/counsellorLiveSession/getUpcomingLiveSessionsOfCounsellor?counsellorId=${counsellorId}`,
    {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch upcoming live sessions');
  }

  return response.json();
};

export const getLiveSessionById = async (
  counsellorId: string,
  liveSessionId: string,
  token: string
): Promise<LiveSessionDetailResponse> => {
  const response = await fetch(
    `${API_CONFIG.baseUrl}/api/counsellorLiveSession/getLiveSessionById?counsellorId=${counsellorId}&liveSessionId=${liveSessionId}`,
    {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch live session details');
  }

  return response.json();
};

export const startScheduledLive = async (
  counsellorId: string,
  liveSessionId: string,
  token: string
): Promise<{ success: boolean; message: string }> => {
  const response = await fetch(
    `${API_CONFIG.baseUrl}/api/counsellorLiveSession/startScheduledLive?counsellorId=${counsellorId}&liveSessionId=${liveSessionId}`,
    {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to start scheduled live session');
  }

  return response.json();
};

export interface UpdateSessionPayload {
  counsellorId: string;
  liveSessionId: string;
  date: string;
  startTime: string;
  endTime: string;
}

export const updateLiveSession = async (
  payload: UpdateSessionPayload,
  token: string
): Promise<{ success: boolean; message: string }> => {
  const response = await fetch(
    `${API_CONFIG.baseUrl}/api/counsellorLiveSession/updateSchedule`,
    {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to update live session');
  }

  return response.json();
};

export const cancelLiveSession = async (
  counsellorId: string,
  liveSessionId: string,
  token: string
): Promise<{ success: boolean; message: string }> => {
  const response = await fetch(
    `${API_CONFIG.baseUrl}/api/counsellorLiveSession/cancel?counsellorId=${counsellorId}&liveSessionId=${liveSessionId}`,
    {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to cancel live session');
  }

  return response.json();
};
