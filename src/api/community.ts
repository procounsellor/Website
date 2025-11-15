import { API_CONFIG } from './config';
import type { GetQuestionsListResponse } from '@/types/community';

const { baseUrl } = API_CONFIG;

export async function getQuestionsList(
  loggedInUserId: string,
  token: string
): Promise<GetQuestionsListResponse> {
  try {
    const response = await fetch(
      `${baseUrl}${API_CONFIG.endpoints.getQuestionsList}?loggedInUserId=${loggedInUserId}`,
      {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(
        `HTTP ${response.status}: Failed to fetch questions. Details: ${errorBody}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Get Questions List Error:', error);
    throw error;
  }
}