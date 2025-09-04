import { API_CONFIG } from "./config";
import type { CollegeApiResponse, ExamApiResponse, CourseApiResponse, CounsellorApiResponse } from "../types/academic";

async function fetcher<T>(endpoint: string): Promise<T> {
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
  getCourses: () => fetcher<CourseApiResponse[]>(API_CONFIG.endpoints.getCourses),
  getCounsellors: () => fetcher<CounsellorApiResponse[]>(API_CONFIG.endpoints.getCounsellors),
};
