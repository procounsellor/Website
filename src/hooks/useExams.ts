import { useQuery } from '@tanstack/react-query';
import { academicApi } from '../api/academic';
import type { ExamApiResponse, Exam } from '../types/academic';

export const useExams = (limit?: number) => {
  const {
    data: exams,
    isLoading: loading,
    isError,
    error: queryError,
  } = useQuery({
    queryKey: ['exams'],
    queryFn: academicApi.getExams,

    select: (data) => {
      const transformedExams: Exam[] = data.map((exam: ExamApiResponse) => ({
        id: exam.examId,
        name: exam.examName,
        level: exam.examLevel,
        type: exam.examType,
        iconUrl: exam.iconUrl,
        bannerUrl: exam.bannerUrl,
        popularity: exam.popularityCount
      }));

      const sortedExams = transformedExams.sort((a, b) => b.popularity - a.popularity);
      
      return limit ? sortedExams.slice(0, limit) : sortedExams;
    }
  });

  const error = isError
    ? (queryError as Error)?.message || 'Failed to fetch exams'
    : null;
  
  return { exams, loading, error };
};

export const useExamById = (examId: string) => {
  const {
    data: exam,
    isLoading: loading,
    isError,
    error: queryError,
  } = useQuery({
    queryKey: ['exam', examId],
    queryFn: () => academicApi.getExamById(examId),
    enabled: !!examId, 
  });

  const error = isError
    ? (queryError as Error)?.message || 'Failed to fetch exam details'
    : null;

  return { exam, loading, error };
};