import { API_CONFIG } from './config';
import type { Review } from '@/types/review';

interface ReviewsApiResponse {
  data: Review[];
  message: string;
  status: string;
}

interface UpdateReviewPayload {
  reviewId: string;
  userId: string;
  counsellorId: string;
  reviewText: string;
  rating: number;
}

interface UpdateReviewResponse {
  status: string;
  message: string;
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
      if (response.status === 404) {
        return [];
      }
      throw new Error(`HTTP ${response.status}: Failed to fetch user reviews.`);
    }

    const result: ReviewsApiResponse = await response.json();
    
    if (result.status !== 'success' || !Array.isArray(result.data)) {
      if(result.status === 'success' && result.data === null) {
        return [];
      }
      throw new Error('Invalid API response structure for reviews.');
    }
    return result.data;
  } catch (error) {
    console.error('Get User Reviews Error:', error);
    throw error;
  }
}

export async function updateUserReview(payload: UpdateReviewPayload, token: string): Promise<UpdateReviewResponse> {
  try {
    const response = await fetch(`${baseUrl}/api/user/updateReview`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const result: UpdateReviewResponse = await response.json();

    if (!response.ok) {
      throw new Error(result.message || `HTTP ${response.status}: Failed to update review.`);
    }

    if (result.status !== 'success') {
      throw new Error(result.message || 'Failed to update review.');
    }

    return result;

  } catch (error) {
    console.error('Update User Review Error:', error);
    throw error;
  }
}