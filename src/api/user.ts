import { API_CONFIG } from './config';
import type { User } from '@/types/user';

const { baseUrl } = API_CONFIG;

export async function getUserProfile(userId: string, token: string): Promise<User> {
  try {
    const response = await fetch(`${baseUrl}/api/user/${userId}`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`HTTP ${response.status}: Failed to fetch user profile. Details: ${errorBody}`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Get User Profile Error:', error);
    throw error;
  }
}

interface UpdateUserPayload {
  firstName?: string;
  lastName?: string;
  email?: string;
}

export async function updateUserProfile(
  userId: string,
  userData: UpdateUserPayload,
  token: string
): Promise<User> {
  try {
    const response = await fetch(`${baseUrl}/api/user/${userId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`HTTP ${response.status}: Failed to update profile. Server responded with: ${errorBody}`);
    }
    
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
        return await response.json();
    } else {
        console.log("Profile updated successfully, server sent no content in response.");
        return { ...userData } as User;
    }

  } catch (error) {
    console.error('Update User Profile Error:', error);
    throw error;
  }
}