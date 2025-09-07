import { useState, useEffect } from 'react';
import { academicApi } from '../api/academic';
import type { CourseApiResponse, Course } from '../types/academic';


export const useCourses = (limit?: number) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const data = await academicApi.getCourses();
        
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
    
        const finalCourses = limit ? transformedCourses.slice(0, limit) : transformedCourses;
        
        setCourses(finalCourses);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch courses');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [limit]);

  return { courses, loading, error };
};
