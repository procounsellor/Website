import { API_CONFIG } from './config';
import type { Review } from '@/types/review';

interface ReviewsApiResponse {
  data: Review[];
  message: string;
  status: string;
}

const { baseUrl } = API_CONFIG;

export async function getUserReviews(userId: string, token: string): Promise<Review[]> {
  try {
    const response = await fetch(`${baseUrl}/api/user/getAllReviewsGivenByUser?userId=${userId}`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: Failed to fetch user reviews.`);
    }

    const result: ReviewsApiResponse = await response.json();
    
    if (result.status !== 'success' || !Array.isArray(result.data)) {
        throw new Error('Invalid API response structure for reviews.');
    }

    return result.data;

  } catch (error) {
    console.error('Get User Reviews Error:', error);
    throw error;
  }
}