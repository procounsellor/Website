import { API_CONFIG } from './config';

export interface CounsellorCourse {
  courseId: string;
  courseName: string;
  courseThumbnailUrl: string;
  category: string;
  rating: number | null;
  coursePrice: number;
  discount: number;
  coursePriceAfterDiscount: number;
}

export interface CounsellorCoursesResponse {
  message: string;
  data: CounsellorCourse[];
}

export async function getCoursesByCounsellorId(
  counsellorId: string,
  token: string
): Promise<CounsellorCourse[]> {
  const response = await fetch(
    `${API_CONFIG.baseUrl}/api/counsellorCourses/getCoursesForCounsellorByCounsellorId?counsellorId=${counsellorId}`,
    {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch courses');
  }

  const result: CounsellorCoursesResponse = await response.json();
  return result.data;
}
