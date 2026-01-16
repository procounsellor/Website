import { API_CONFIG } from "./config";
import type { CollegeApiResponse, ExamApiResponse, CourseApiResponse, CounsellorApiResponse, AllCounselor, CounselorDetails } from "../types/academic";

interface BookingRequest {
  userId: string;
  counsellorId: string;
  date: string;
  startTime: string;
  mode: "offline" | "online";
  notes?: string;
  receiverFcmToken?: string | null;
}

interface BookingResponse {
  success: boolean;
  message: string;
  bookingId?: string;
}

// interface SearchResponse {
//   counsellors: AllCounselor[];
//   total: number;
//   totalPages: number;
//   currentPage: number;
// }

async function fetcher<T>(endpoint: string): Promise<T> {
  if (!API_CONFIG.baseUrl) {
    throw new Error('API base URL not configured. Please check environment variables.');
  }
  
  const res = await fetch(`${API_CONFIG.baseUrl}${endpoint}`,{
    headers:{
        'Accept':'application/json'
    }
  });
  if (!res.ok) throw new Error("API error");
  return res.json();
}

async function authFetcher<T>(endpoint: string, token: string): Promise<T> {
  if (!API_CONFIG.baseUrl) {
    throw new Error('API base URL not configured.');
  }
  
  const res = await fetch(`${API_CONFIG.baseUrl}${endpoint}`, {
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  if (!res.ok) throw new Error("API error");
  return res.json();
}

export const academicApi = {
  getColleges: () => fetcher<CollegeApiResponse[]>(API_CONFIG.endpoints.getColleges),
  getExams: () => fetcher<ExamApiResponse[]>(API_CONFIG.endpoints.getExams),
  getExamById: (id: string) => fetcher<any>(`/api/exams/getExamById?examId=${id}`),
  getCourses: () => fetcher<CourseApiResponse[]>(API_CONFIG.endpoints.getCourses),
  getCounsellors: () => fetcher<CounsellorApiResponse[]>(API_CONFIG.endpoints.getCounsellors),
  getLoggedOutCounsellors: () => fetcher<AllCounselor[]>(`/api/shared/getAllCounsellors`),
  getLoggedInCounsellors: (userId: string, token: string) => authFetcher<AllCounselor[]>(`/api/user/counsellorsAccordingToInterestedCourse/all?userName=${userId}`, token),
  getCounselorById: (id: string) => fetcher<CounselorDetails>(`${API_CONFIG.endpoints.getCounsellorById}?counsellorId=${id}`),
  getCounselorNonAvailability: async (userId: string, counsellorId: string) => {
  const token = localStorage.getItem('jwt');
    if (!token) {
      throw new Error('Authentication token not found');
    }
    
    const res = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.getCounsellorNonAvailability}?userId=${userId}&counsellorId=${counsellorId}`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!res.ok) throw new Error("Failed to fetch counselor availability");
    
    const data = await res.json();
    return data;
  },
  
  bookAppointment: async (bookingData: BookingRequest): Promise<BookingResponse> => {
  const token = localStorage.getItem('jwt');
    if (!token) {
      throw new Error('Authentication token not found');
    }
    
    const res = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.bookAppointment}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(bookingData)
    });
    
    if (!res.ok) throw new Error("Failed to book appointment");
    return res.json();
  },

  searchCounsellors: async (
    userName: string, 
    city: string, 
    page: number = 0, 
    pageSize: number = 15,
  ) => {
    const token = localStorage.getItem('jwt');
    if (!token) throw new Error('Authentication token not found');

    const params = new URLSearchParams({
      userName: userName,
      city: city,
      page: page.toString(),
      pageSize: pageSize.toString(),
      sortBy: 'rating', 
      sortOrder: 'desc'
    });

    const endpoint = `${API_CONFIG.endpoints.searchCounsellors}?${params.toString()}`;
    
    const res = await fetch(`${API_CONFIG.baseUrl}${endpoint}`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!res.ok) throw new Error("Failed to search counselors");
    return res.json();
  },
};
