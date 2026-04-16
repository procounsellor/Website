import type { ListingProBudddy, PostReview, ProBuddyReviewForUser, ProBuddyUserSide } from "@/types/probuddies";
import { API_CONFIG } from "./config";

export type FeaturedCollegeInIndia = {
  country: string;
  domains: string[];
  "state-province": string;
  name: string;
  alpha_two_code: string;
  web_pages: string[];
};

export type ProBuddyListingFilters = {
  state?: string;
  city?: string;
  course?: string;
  languagesKnow?: string;
  workingDays?: string;
  minRatePerMinute?: number;
  maxRatePerMinute?: number;
  minRating?: number;
  maxRating?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  pageSize?: number;
};

export type CreateProBuddyCallRequestPayload = {
  proBuddyId: string;
  userId: string;
  scheduledTime: string;
  scheduledDate: string;
};

const getAuthToken = () => localStorage.getItem("jwt") || "";
const getStoredUserId = () => localStorage.getItem("phone") || "";

const getAuthHeaders = (): HeadersInit => {
  const token = getAuthToken();
  if (!token) {
    return {};
  }

  return {
    Authorization: `Bearer ${token}`,
  };
};

const appendQueryParam = (params: URLSearchParams, key: string, value: unknown) => {
  if (value === undefined || value === null || value === "") {
    return;
  }
  params.append(key, String(value));
};

const normalizeProBuddyListResponse = (data: any): ListingProBudddy[] => {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.proBuddies)) {
    return data.proBuddies;
  }

  if (Array.isArray(data?.data)) {
    return data.data;
  }

  if (Array.isArray(data?.result)) {
    return data.result;
  }

  return [];
};

const normalizeProBuddyReviewsResponse = (data: any): ProBuddyReviewForUser[] => {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.data)) {
    return data.data;
  }

  if (Array.isArray(data?.reviews)) {
    return data.reviews;
  }

  return [];
};

const normalizeFeaturedCollegesResponse = (data: any): FeaturedCollegeInIndia[] => {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.data)) {
    return data.data;
  }

  if (Array.isArray(data?.colleges)) {
    return data.colleges;
  }

  if (Array.isArray(data?.result)) {
    return data.result;
  }

  return [];
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

export const getAllCollegesListInIndia = async (): Promise<FeaturedCollegeInIndia[]> => {
  const response = await fetch(`${API_CONFIG.baseUrl}/api/featured_colleges/getAllCollegesListInIndia`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    redirect: "follow",
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || data.error || "Failed to get colleges list");
  }

  return normalizeFeaturedCollegesResponse(data);
};





export const getAllProBudddiesUser = async (
  userId: string | null,
  filters: ProBuddyListingFilters = {}
): Promise<ListingProBudddy[]> => {
  const token = getAuthToken();
  const effectiveUserId = userId || getStoredUserId();
  const isLoggedInUser = Boolean(effectiveUserId && token);
  const endpoint = isLoggedInUser ? "/api/user/getAllProBuddies" : "/api/shared/getAllProBuddies";

  const queryParams = new URLSearchParams();
  if (isLoggedInUser) {
    appendQueryParam(queryParams, "userId", effectiveUserId);
  }

  appendQueryParam(queryParams, "state", filters.state);
  appendQueryParam(queryParams, "city", filters.city);
  appendQueryParam(queryParams, "course", filters.course);
  appendQueryParam(queryParams, "languagesKnow", filters.languagesKnow);
  appendQueryParam(queryParams, "workingDays", filters.workingDays);
  appendQueryParam(queryParams, "minRatePerMinute", filters.minRatePerMinute);
  appendQueryParam(queryParams, "maxRatePerMinute", filters.maxRatePerMinute);
  appendQueryParam(queryParams, "minRating", filters.minRating);
  appendQueryParam(queryParams, "maxRating", filters.maxRating);
  appendQueryParam(queryParams, "sortBy", filters.sortBy ?? "rating");
  appendQueryParam(queryParams, "sortOrder", filters.sortOrder ?? "desc");
  appendQueryParam(queryParams, "page", filters.page ?? 0);
  appendQueryParam(queryParams, "pageSize", filters.pageSize ?? 10);

  const response = await fetch(`${API_CONFIG.baseUrl}${endpoint}?${queryParams.toString()}`, {
    method: "GET",
    headers: {
      ...(isLoggedInUser ? getAuthHeaders() : {}),
      Accept: "application/json",
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || data.error || "Failed to get probuddies");
  }

  return normalizeProBuddyListResponse(data);
};


export const getProBuddyForUser = async (userId: string | null, proBuddyId: string): Promise<ProBuddyUserSide> => {
  const token = getAuthToken();
  const effectiveUserId = userId || getStoredUserId();

  const reviewsPromise = getAllReviewsReceivedByAProBuddyForUser(proBuddyId).catch(() => [] as ProBuddyReviewForUser[]);

  if (!effectiveUserId || !token) {
    // // call non jwt api here and return the profile
    // const data: ProBuddyUserSide = {
    //   "proBuddyId": "2400000000",
    //   "role": "proBuddy",
    //   "firstName": "Ashutosh",
    //   "lastName": "Kumar",
    //   "phoneNumber": "2400000000",
    //   "email": "ar216589.5@gmail.com",
    //   "photoUrl": null,
    //   "collegeName": "Sharda University",
    //   "currentYear": "3",
    //   "course": "Btech Information Technology",
    //   "noOfRatingsReceived": null,
    //   "rating": null,
    //   "city": "Greater  Noida",
    //   "state": "Greater  Noida",
    //   "languagesKnow": [
    //     "Hindi",
    //     "English"
    //   ],
    //   "aboutMe": {
    //     "heading": "Deep learning",
    //     "subHeading": "Btech ",
    //     "aboutMe": "I've helped 850+ aspiring students navigate their college journey at IIT Delhi. Passionate about making the admission process less stressful and sharing real college insights that matter. Currently in 3rd year, been through it all - exams, placements, hostel life, branch selection"
    //   },
    //   "whoShouldConnect": "Connect with me if you want real, unfiltered advice about IIT admission, competitive exam preparation, and actual college life (not just the Instagram version!)",
    //   "links": null,
    //   "offerings": {
    //     "Attendance": 5,
    //     "Campus Vibe": 5,
    //     "Mess Food": 5,
    //     "Faculty Quality": 5
    //   },
    //   "ratePerMinute": 150,
    //   "workingDays": [
    //     "Monday",
    //     "Tuesday",
    //     "Wednesday",
    //     "Thursday",
    //     "Friday"
    //   ],
    //   "officeStartTime": "09:00",
    //   "officeEndTime": "18:00",
    //   "walletAmount": 0,
    //   "fcmToken": null,
    //   "voipToken": null,
    //   "verified": false
    // }

    const response = await fetch(`${API_CONFIG.baseUrl}/api/shared/getProBuddyByIdForUser?proBuddyId=${proBuddyId}`, {
      headers: {
        Accept: 'application/json'
      }
    })

    const data = await response.json()
    if (!response.ok) throw new Error(data.message || data.error || "Failed to get profile details")

    const reviews = await reviewsPromise;
    const backendCount = Number(data?.noOfRatingsReceived ?? 0);
    const resolvedCount = reviews.length > 0 ? reviews.length : backendCount;

    return {
      ...data,
      noOfRatingsReceived: resolvedCount > 0 ? resolvedCount : null,
      reviewsReceivedForUser: reviews,
      reviewsCountForUser: resolvedCount,
    };

  } else {
    const response = await fetch(`${API_CONFIG.baseUrl}/api/user/getProBuddyByIdForUser?userId=${effectiveUserId}&proBuddyId=${proBuddyId}`,
      {
        headers: {
          ...getAuthHeaders(),
          Accept: 'application/json'
        }
      }
    )
    const data = await response.json()
    if (!response.ok) throw new Error(data.message || data.error || "Failed to get profile details")

    const reviews = await reviewsPromise;
    const backendCount = Number(data?.noOfRatingsReceived ?? 0);
    const resolvedCount = reviews.length > 0 ? reviews.length : backendCount;

    return {
      ...data,
      noOfRatingsReceived: resolvedCount > 0 ? resolvedCount : null,
      reviewsReceivedForUser: reviews,
      reviewsCountForUser: resolvedCount,
    }
  }
}


export const getAllReviewsReceivedByAProBuddyForUser = async (proBuddyId: string): Promise<ProBuddyReviewForUser[]> => {
  const response = await fetch(
    `${API_CONFIG.baseUrl}/api/shared/getAllReviewsReceivedByAProBuddyForUser?proBuddyId=${proBuddyId}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    }
  );

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || data.error || "Failed to get ProBuddy reviews");
  }

  return normalizeProBuddyReviewsResponse(data);
};



export const postReview = async (params: PostReview) => {
  if (!getAuthToken()) {
    throw new Error("Please login to post a review")
  }
  if (!params.proBuddyId || !params.userId || params.rating === null || params.rating === undefined) {
    throw new Error("Some required fields are missing for review")
  }
  const response = await fetch(`${API_CONFIG.baseUrl}/api/proBuddy/postReviewToProBuddy`, {
    method: "POST",
    headers: {
      ...getAuthHeaders(),
      Accept: 'application/json',
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params)
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.message || data.error || "Failed to post review")
  return data
}

export const getProBuddyByIdForProBuddy = async (proBuddyId: string) => {
  if (!proBuddyId) {
    throw new Error("proBuddyId is required");
  }

  const response = await fetch(
    `${API_CONFIG.baseUrl}/api/proBuddy/getProBuddyByIdForProBuddy?proBuddyId=${encodeURIComponent(proBuddyId)}`,
    {
      method: "GET",
      headers: {
        ...getAuthHeaders(),
        Accept: "application/json",
      },
    }
  );

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || data.error || "Failed to get ProBuddy profile details");
  }

  return data;
}

export const getRequestsReceivedByProBuddy = async (proBuddyId: string) => {
  if (!proBuddyId) {
    throw new Error("proBuddyId is required");
  }

  const response = await fetch(
    `${API_CONFIG.baseUrl}/api/proBuddy/getRequestsReceivedByProBuddy?proBuddyId=${encodeURIComponent(proBuddyId)}`,
    {
      method: "GET",
      headers: {
        ...getAuthHeaders(),
        Accept: "application/json",
      },
    }
  );

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || data.error || "Failed to get requests received by ProBuddy");
  }

  return data;
};

export const createProBuddyCallRequest = async (payload: CreateProBuddyCallRequestPayload) => {
  const response = await fetch(`${API_CONFIG.baseUrl}/api/proBuddy/createProBuddyCallRequest`, {
    method: "POST",
    headers: {
      ...getAuthHeaders(),
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || data.error || "Failed to create ProBuddy call request");
  }

  return data;
};

export const getAllReviewsReceivedByAProBuddyForProBuddy = async (proBuddyId: string) => {
  if (!proBuddyId) {
    throw new Error("proBuddyId is required");
  }

  const response = await fetch(
    `${API_CONFIG.baseUrl}/api/proBuddy/getAllReviewsReceivedByAProBuddyForProBuddy?proBuddyId=${encodeURIComponent(proBuddyId)}`,
    {
      method: "GET",
      headers: {
        ...getAuthHeaders(),
        Accept: "application/json",
      },
    }
  );

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || data.error || "Failed to get ProBuddy reviews for ProBuddy");
  }

  return data;
};






export const probuddiesApi = {
  listing: (userId: string | null, filters?: ProBuddyListingFilters) => getAllProBudddiesUser(userId, filters),
  profileUser: (userId: string | null, proBudddyId: string) => getProBuddyForUser(userId, proBudddyId),
  reviewsForUser: (proBuddyId: string) => getAllReviewsReceivedByAProBuddyForUser(proBuddyId),
  postReview: (params: PostReview) => postReview(params),
  profileForProBuddy: (proBuddyId: string) => getProBuddyByIdForProBuddy(proBuddyId),
  requestsReceivedByProBuddy: (proBuddyId: string) => getRequestsReceivedByProBuddy(proBuddyId),
  createCallRequest: (payload: CreateProBuddyCallRequestPayload) => createProBuddyCallRequest(payload),
  reviewsForProBuddy: (proBuddyId: string) => getAllReviewsReceivedByAProBuddyForProBuddy(proBuddyId)
}