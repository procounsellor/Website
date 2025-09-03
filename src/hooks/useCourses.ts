import { useState, useEffect } from 'react';
import { academicApi } from '../api/counselorService';
import type { CourseApiResponse, Course } from '../types/academic';

export const useCourses = (limit?: number) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const data = await academicApi.getAllCourses();
        
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

        const sortedCourses = transformedCourses.sort((a, b) => b.popularity - a.popularity);
    
        const finalCourses = limit ? sortedCourses.slice(0, limit) : sortedCourses;
        
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
