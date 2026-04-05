import type { ListingProBudddy, PostReview, ProBuddyUserSide } from "@/types/probuddies";
import { API_CONFIG } from "./config";

const getAuthHeaders = () => {
  const token = localStorage.getItem("jwt");
  return {
    Authorization: `Bearer ${token}`,
  };
};

export const registerProBuddy = async (payload: any) => {
  const response = await fetch(`${API_CONFIG.baseUrl}/api/auth/proBuddySignup`, {
    method: "POST",
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || data.error || "Failed to register ProBuddy");
  return data;
};

export const uploadProBuddyPhoto = async (proBuddyId: string, photo: File) => {
  const formData = new FormData();
  formData.append("proBuddyId", proBuddyId);
  formData.append("photo", photo);

  const response = await fetch(`${API_CONFIG.baseUrl}/api/proBuddy/uploadPhoto`, {
    method: "POST",
    headers: {
      ...getAuthHeaders(),
    },
    body: formData,
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || data.error || "Failed to upload photo");
  return data;
};

export const uploadProBuddyIdCardPhoto = async (proBuddyId: string, photo: File) => {
  const formData = new FormData();
  formData.append("proBuddyId", proBuddyId);
  formData.append("photo", photo);

  const response = await fetch(`${API_CONFIG.baseUrl}/api/proBuddy/uploadIdCardPhoto`, {
    method: "POST",
    headers: {
      ...getAuthHeaders(),
      "Accept": "application/json"
    },
    body: formData,
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || data.error || "Failed to upload ID Card");
  return data;
};





export const getAllProBudddiesUser = async (userId:string | null):Promise<ListingProBudddy[]>=>{
  if(!userId || !getAuthHeaders()){
    const response = await fetch(`${API_CONFIG.baseUrl}`)

    const data = await response.json();
    if(!response.ok) throw new Error(data.message || data.error || "Failed to get probuddies")
    return data; 


  }else{
    const response = await fetch(`${API_CONFIG.baseUrl}/api/user/getAllProBuddies?userId=${userId}`, 
      {
        headers:{
          ...getAuthHeaders(),
          "Accept":'application/json'
        }
      }

    )

    const data = await response.json();
    if(!response.ok) throw new Error(data.message || data.error || "Failed to get probuddies")
    return data;  

  }

}


export const getProBuddyForUser = async (userId:string | null, proBuddyId:string | null):Promise<ProBuddyUserSide> => {
  if(!userId || !getAuthHeaders()){
    // call non jwt api here and return the profile
    const data: ProBuddyUserSide = {
    "proBuddyId": "2400000000",
    "role": "proBuddy",
    "firstName": "Ashutosh",
    "lastName": "Kumar",
    "phoneNumber": "2400000000",
    "email": "ar216589.5@gmail.com",
    "photoUrl": null,
    "collegeName": "Sharda University",
    "currentYear": "3",
    "course": "Btech Information Technology",
    "noOfRatingsReceived": null,
    "rating": null,
    "city": "Greater  Noida",
    "state": "Greater  Noida",
    "languagesKnow": [
        "Hindi",
        "English"
    ],
    "aboutMe": {
        "heading": "Deep learning",
        "subHeading": "Btech ",
        "aboutMe": "nothign just a  test"
    },
    "whoShouldConnect": "if ",
    "links": null,
    "offerings": {
        "Attendance": 5,
        "Campus Vibe": 5,
        "Mess Food": 5,
        "Faculty Quality": 5
    },
    "ratePerMinute": null,
    "workingDays": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday"
    ],
    "officeStartTime": "09:00",
    "officeEndTime": "18:00",
    "walletAmount": 0,
    "fcmToken": null,
    "voipToken": null,
    "verified": false
}
    return data
  }else{
    const response = await fetch(`${API_CONFIG.baseUrl}/api/user/getProBuddyByIdForUser?userId=${userId}&proBuddyId=${proBuddyId}`,
      {
        headers:{
          ...getAuthHeaders(),
          Accept:'application/json'
        }
      }
    )
    const data = await response.json()
    if(!response.ok) throw new Error(data.message || data.error || "Failed to get profile details")
    return data  
  }
}



export const postReview = async(params:PostReview)=>{
  if(!getAuthHeaders()){
    console.log('auth heeaders missing')
    return
  }
  if(!params.proBuddyId || !params.userId || !params.rating){
    console.log("some fields are missing", params)
    return
  }
  const response = await fetch(`${API_CONFIG.baseUrl}/api/proBuddy/postReviewToProBuddy`, {
    method:"POST",
    headers:{
      ...getAuthHeaders(),
      Accept:'application/json'
    },
    body:JSON.stringify(params)
  })
  const data = await response.json()
  return data
}






export const probuddiesApi = {
  listing:(userId:string | null)=> getAllProBudddiesUser(userId),
  profileUser:(userId:string | null, proBudddyId:string | null) => getProBuddyForUser(userId, proBudddyId),
  postReview: (params:PostReview) => postReview(params)
}