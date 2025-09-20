import { API_CONFIG } from "./config";
import type { CollegeApiResponse, ExamApiResponse, CourseApiResponse, CounsellorApiResponse, AllCounselor, CounselorDetails } from "../types/academic";

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

export const academicApi = {
  getColleges: () => fetcher<CollegeApiResponse[]>(API_CONFIG.endpoints.getColleges),
  getExams: () => fetcher<ExamApiResponse[]>(API_CONFIG.endpoints.getExams),
  getExamById: (id: string) => fetcher<any>(`/api/exams/getExamById?examId=${id}`),
  getCourses: () => fetcher<CourseApiResponse[]>(API_CONFIG.endpoints.getCourses),
  getCounsellors: () => fetcher<CounsellorApiResponse[]>(API_CONFIG.endpoints.getCounsellors),
  getAllCounsellors: () => fetcher<AllCounselor[]>(API_CONFIG.endpoints.getCounsellors), // Use same endpoint but expect new format
  getCounselorById: (id: string) => fetcher<CounselorDetails>(`${API_CONFIG.endpoints.getCounsellorById}?counsellorId=${id}`),
};
