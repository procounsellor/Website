import { API_CONFIG } from './config';
import type { Counsellor } from '@/types/counsellor';
import type { CounselorReview } from '@/types/counselorReview';
import type { ApiClient, Client } from '@/types/client';
import type { ApiReviewReceived, ReviewReceived } from '@/types/counselorDashboard';

const { baseUrl } = API_CONFIG;

export async function getFavouriteCounsellors(userId: string, token: string): Promise<Counsellor[]> {
  try {
    const response = await fetch(`${baseUrl}/api/user/getCounsellorsMadeFavouriteByUser?userId=${userId}`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch favourite counsellors');
    const data = await response.json();
    return data.favouriteCounsellors || [];
  } catch (error) {
    console.error("Get Favourite Counsellors Error:", error);
    throw error;
  }
}

export async function getSubscribedCounsellors(userId: string, token: string): Promise<Counsellor[]> {
  try {
    const response = await fetch(`${baseUrl}/api/user/counsellorsSubscribedByUser?userId=${userId}`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch subscribed counsellors');
    const data = await response.json();
    return data.counsellors || [];
  } catch (error) {
    console.error("Get Subscribed Counsellors Error:", error);
    throw error;
  }
}

export async function getReviewsByCounselorId(userId: string, counsellorId: string, token: string): Promise<CounselorReview[]> {
  try {
    const response = await fetch(`${baseUrl}/api/user/getAllReviewsReceivedByCounsellor?userId=${userId}&counsellorId=${counsellorId}`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch counselor reviews');
    }
    const result = await response.json();
    if (result.status === 'success' && Array.isArray(result.data)) {
      return result.data;
    } else {
      throw new Error(result.message || 'Invalid API response structure.');
    }
  } catch (error) {
    console.error("Get Reviews by Counselor ID Error:", error);
    throw error;
  }
}
export async function isManualSubscriptionRequest(userId:string, counselorId:string){
  if(!counselorId || !userId){
    console.error('Counselor or userid not provided', counselorId, userId)
    return 
  }
  const token = localStorage.getItem('jwt')
  try{
    const response = await fetch(`${baseUrl}/api/user/isManualSubscriptionRequestApproved?userId=${userId}&counsellorId=${counselorId}`,
      {
        headers:{
          Accept:'application/json',
          'Authorization':`Bearer ${token}`
        }
      })

      if(!response.ok){
        console.error('request failed ', response.statusText)
        return
      }

      const result = await response.json()
      return result
    
  }catch(err){
    console.error(err)
  }
}


export async function addFav(userId:string, counselorId:string){
  if(!counselorId || !userId){
    console.error('Counselor or userid not provided', counselorId, userId)
    return 
  }
  const token = localStorage.getItem('jwt')
  try{
    const response = await fetch(`${baseUrl}/api/user/makeUnmakeCounsellorFavourite?userId=${userId}&counsellorId=${counselorId}`,
      {
        method:'POST',
        headers:{
          Accept:'application/json',
          'Authorization':`Bearer ${token}`
        }
      })

      if(!response.ok){
        console.error('request failed ', response.statusText)
        return
      }

      const result = await response.json()
      return result
    
  }catch(err){
    console.error(err)
  }
}

export const getSubscribedClients = async (counsellorId: string, token: string): Promise<Client[]> => {
    const response = await fetch(`/api/counsellor/getSubscribedClients?counsellorId=${counsellorId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch subscribed clients');
    }

    const data: ApiClient[] = await response.json();

    const mappedClients = data.map(apiClient => ({
        id: apiClient.userId,
        name: `${apiClient.firstName} ${apiClient.lastName}`,
        imageUrl: apiClient.photoSmall || `https://ui-avatars.com/api/?name=${apiClient.firstName}+${apiClient.lastName}`,
        course: apiClient.course,
        preferredStates: apiClient.userInterestedStateOfCounsellors,
    }));

    return mappedClients;
};

const formatTimeAgo = (timestamp: { seconds: number; nanos: number }): string => {
  const date = new Date(timestamp.seconds * 1000);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const years = Math.floor(diffInSeconds / 31536000);
  if (years > 0) return `${years} year${years > 1 ? 's' : ''} ago`;
  
  const months = Math.floor(diffInSeconds / 2592000);
  if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago`;

  const days = Math.floor(diffInSeconds / 86400);
  if (days > 1) return `${days} days ago`;
  if (days === 1) return `1 day ago`;
  
  const hours = Math.floor(diffInSeconds / 3600);
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;

  return 'just now';
};

export const getReviewsForCounselor = async (counsellorId: string, token: string): Promise<ReviewReceived[]> => {
    const response = await fetch(`${baseUrl}/api/counsellor/getAllReviewsReceivedByCounsellor?counsellorId=${counsellorId}`, {
        headers: {
            Accept: 'application/json',
            authorization: `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch reviews');
    }

    const data: ApiReviewReceived[] = await response.json();

    return data.map(apiReview => ({
        id: apiReview.reviewId,
        userName: apiReview.userFullName,
        userImageUrl: apiReview.userPhotoUrl || `https://ui-avatars.com/api/?name=${apiReview.userFullName}`,
        rating: apiReview.rating,
        text: apiReview.reviewText,
        timeAgo: formatTimeAgo(apiReview.timestamp),
    }));
};