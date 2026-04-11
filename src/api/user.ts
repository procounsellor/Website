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
  referralCode?: string;
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
export async function uploadUserPhoto(
  userId: string,
  photo: File,
  token: string
): Promise<{ photoUrl: string }> {
  const formData = new FormData();
  formData.append('photo', photo);

  try {
    const response = await fetch(`${baseUrl}/api/user/uploadPhoto?userId=${userId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`HTTP ${response.status}: Failed to upload photo. Server responded with: ${errorBody}`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      return data;
    } else {
      const responseText = await response.text();
      console.log('Photo upload successful, but the server sent a non-JSON response:', responseText);
      return { photoUrl: '' };
    }

  } catch (error) {
    console.error('Upload User Photo Error:', error);
    throw error;
  }
}