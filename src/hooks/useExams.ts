import { useState, useEffect } from 'react';
import { academicApi } from '../api/academic';
import type { ExamApiResponse, Exam } from '../types/academic';

export const useExams = (limit?: number) => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        setLoading(true);
        const data = await academicApi.getExams();
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
        
        const finalExams = limit ? sortedExams.slice(0, limit) : sortedExams;
        
        setExams(finalExams);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch exams');
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, [limit]);

  return { exams, loading, error };
};

export const useExamById = (examId: string) => {
  const [exam, setExam] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!examId) return;
    const fetchExam = async () => {
      try {
        setLoading(true);
        const data = await academicApi.getExamById(examId);
        setExam(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch exam details');
      } finally {
        setLoading(false);
      }
    };

    fetchExam();
  }, [examId]);

  return { exam, loading, error };
};
