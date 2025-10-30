import { useQuery } from '@tanstack/react-query';
import { academicApi } from '@/api/academic';
import type { CollegeApiResponse, College } from '@/types/academic';

export const useColleges = (limit?: number) => {
  const {
    data: colleges,
    isLoading: loading,
    isError,
    error: queryError,
  } = useQuery({
    queryKey: ['colleges'], 
    queryFn: academicApi.getColleges,

    select: (data) => {
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

      return limit ? sortedColleges.slice(0, limit) : sortedColleges;
    }
  });

  const error = isError
    ? (queryError as Error)?.message || 'Failed to fetch colleges'
    : null;

  return { colleges, loading, error };
};