import { useQuery } from '@tanstack/react-query';
import { academicApi } from '../api/academic';
import type { CourseApiResponse, Course } from '../types/academic';


export const useCourses = (limit?: number) => {
  const {
    data: courses,
    isLoading: loading,
    isError,
    error: queryError,
  } = useQuery({
    queryKey: ['courses'],
    queryFn: academicApi.getCourses,

    select: (data) => {
      const transformedCourses: Course[] = data.map((course: CourseApiResponse) => ({
        id: course.courseId,
        name: course.courseName,
        type: course.courseType,
        level: course.streamLevel,
        photoUrl: course.coursePhotoUrl,
        duration: course.duration,
        popularity: course.popularityCount,
        iconUrl: course.courseIconUrl
      }));
  
      return limit ? transformedCourses.slice(0, limit) : transformedCourses;
    }
  });

  const error = isError
    ? (queryError as Error)?.message || 'Failed to fetch courses'
    : null;

  return { courses, loading, error };
};