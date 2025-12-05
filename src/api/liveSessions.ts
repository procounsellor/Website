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

export interface LiveChatMessage {
    messageId: string;
    userId: string;
    fullName: string;
    message: string;
    timestamp: number;
}

interface SendMessageResponse {
    success: boolean;
    message: string;
}

export async function getLiveChatsOfSession(liveSessionId: string): Promise<LiveChatMessage[]> {
    const { userId } = useAuthStore.getState();
    const token = localStorage.getItem('jwt');

    if (!userId || !token) {
        console.error("Authentication check failed: userId or token missing.");
        return [];
    }

    const url = `${API_CONFIG.baseUrl}/api/counsellorLiveSession/getLiveChatsOfASession?userId=${userId}&liveSessionId=${liveSessionId}`;
    
    console.log('Fetching chats:', { url, userId, liveSessionId });
    
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        console.log('Fetch chats response:', response.status, response.ok);

        if (!response.ok) {
            const errorBody = await response.text();
            console.error('Fetch chats error:', errorBody);
            throw new Error(`HTTP ${response.status}: Failed to fetch chats. Details: ${errorBody}`);
        }
        
        const data = await response.json();
        console.log('Fetch chats success:', data);

        // API returns array directly
        if (Array.isArray(data)) {
            return data as LiveChatMessage[];
        } else if (data.success && data.data) {
            return data.data;
        } else {
            return [];
        }

    } catch (error) {
        console.error("Error fetching live chats:", error);
        return [];
    }
}

export async function sendMessageInLiveSession(liveSessionId: string, message: string): Promise<boolean> {
    const { userId } = useAuthStore.getState();
    const token = localStorage.getItem('jwt');

    if (!userId || !token) {
        console.error("Authentication check failed: userId or token missing.");
        return false;
    }

    const url = `${API_CONFIG.baseUrl}/api/counsellorLiveSession/sendMessageInLiveSession?userId=${userId}&liveSessionId=${liveSessionId}`;
    
    console.log('Sending message:', { url, message, userId, liveSessionId });
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message }),
        });

        console.log('Send message response:', response.status, response.ok);

        if (!response.ok) {
            const errorBody = await response.text();
            console.error('Send message error:', errorBody);
            throw new Error(`HTTP ${response.status}: Failed to send message. Details: ${errorBody}`);
        }
        
        const data: SendMessageResponse = await response.json();
        console.log('Send message success:', data);
        return data.success;

    } catch (error) {
        console.error("Error sending message:", error);
        return false;
    }
}