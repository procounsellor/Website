import { useState, useEffect } from 'react';
import { academicApi } from '../api/counselorService';
import type { CollegeApiResponse, College } from '../types/academic';

export const useColleges = (limit?: number) => {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        setLoading(true);
        const data = await academicApi.getAllColleges();
        
        const transformedColleges: College[] = data.map((college: CollegeApiResponse) => ({
          id: college.collegeId,
          name: college.collegeName,
          city: college.collegesLocationCity,
          state: college.collegesLocationState,
          logoUrl: college.logoUrl,
          establishedYear: college.establishedYear,
          accreditation: college.accreditation,
          type: college.collegeType,
          popularity: college.popularityCount,
          coursesOffered: college.coursesOffered
        }));

        const sortedColleges = transformedColleges.sort((a, b) => b.popularity - a.popularity);

        const finalColleges = limit ? sortedColleges.slice(0, limit) : sortedColleges;
        
        setColleges(finalColleges);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch colleges');
      } finally {
        setLoading(false);
      }
    };

    fetchColleges();
  }, [limit]);

  return { colleges, loading, error };
};
