import { API_CONFIG } from './config';
import type { CounsellorApiResponse } from '../types/counselor';
import type { ExamApiResponse, CourseApiResponse, CollegeApiResponse } from '../types/academic';

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }
}

export class AcademicApiService {
  private client: ApiClient;

  constructor() {
    this.client = new ApiClient(API_CONFIG.baseUrl);
  }

  async getAllCounsellors(): Promise<CounsellorApiResponse[]> {
    return this.client.get<CounsellorApiResponse[]>(API_CONFIG.endpoints.getAllCounsellors);
  }

  async getAllExams(): Promise<ExamApiResponse[]> {
    return this.client.get<ExamApiResponse[]>(API_CONFIG.endpoints.getAllExams);
  }

  async getAllCourses(): Promise<CourseApiResponse[]> {
    return this.client.get<CourseApiResponse[]>(API_CONFIG.endpoints.getAllCourses);
  }

  async getAllColleges(): Promise<CollegeApiResponse[]> {
    return this.client.get<CollegeApiResponse[]>(API_CONFIG.endpoints.getAllColleges);
  }
}

export class CounselorApiService extends AcademicApiService {}

export const academicApi = new AcademicApiService();
export const counselorApi = new CounselorApiService();
