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