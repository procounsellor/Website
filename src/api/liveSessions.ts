import { API_CONFIG } from './config';
import { useAuthStore } from '@/store/AuthStore';

export interface LiveSession {
    liveSessionId: string;
    counsellorId: string;
    counsellorFullName: string;
    counsellorPhotoUrl: string | null;
    liveSince: string | null;
    title: string;
    description: string;
    playbackId: string;
    forWhom: 'COURSE' | 'GENERAL' | 'OTHER';
}

interface OngoingSessionsResponse {
    success: boolean;
    message: string;
    data: LiveSession[];
}

export async function getAllOngoingLiveSessions(): Promise<LiveSession[]> {
    const { userId } = useAuthStore.getState();
    const token = localStorage.getItem('jwt');

    if (!userId || !token) {
        console.error("Authentication check failed: userId or token missing.");
        return [];
    }

    const url = `${API_CONFIG.baseUrl}/api/counsellorLiveSession/getAllOngoingCourseLiveSessionsForUser?userId=${userId}`;
    
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json', 
                'Authorization': `Bearer ${token}`,
                'Content-Type' : 'application/json',
            },
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`HTTP ${response.status}: Failed to fetch live sessions. Details: ${errorBody}`);
        }
        
        const data: OngoingSessionsResponse = await response.json();

        if (data.success && data.data) {
            return data.data;
        } else {
            throw new Error(data.message || "Failed to fetch ongoing live sessions.");
        }

    } catch (error) {
        console.error("Error fetching ongoing sessions:", error);
        return [];
    }
}