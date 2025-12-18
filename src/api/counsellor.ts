import { API_CONFIG } from './config';
import type { Counsellor } from '@/types/counsellor';
import type { CounselorReview } from '@/types/counselorReview';
import type { ApiClient, Client } from '@/types/client';
import type { ApiReviewReceived } from '@/types/counselorDashboard';

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

export const getReviewsForCounselor = async (counsellorId: string, token: string): Promise<ApiReviewReceived[]> => {
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

    return data
};

export async function postReview(reviewData: {
  userId: string;
  counsellorId: string;
  reviewText: string;
  rating: number;
  receiverFcmToken: null;
  token: string;
}) {
  const { token, ...body } = reviewData; 
  try {
    const response = await fetch(`${baseUrl}/api/user/postReview`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(body)
    });
    const result = await response.json(); 
    if (!response.ok) {
      throw new Error(result.message || `Failed to post review. Status: ${response.status}`);
    }
    return result;
  } catch (error) {
    console.error("Post Review Error:", error);
    throw error;
  }
}