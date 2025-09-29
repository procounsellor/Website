import { API_CONFIG } from './config';
import type { Counsellor } from '@/types/counsellor';

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