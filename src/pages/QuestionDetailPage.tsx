import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuthStore } from '@/store/AuthStore';
import { getAllAnswersForSpecificQuestion } from '@/api/community';
import type { QuestionDetailData, CommunityQuestion } from '@/types/community';
import QuestionCard from '@/components/community/QuestionCard';
import AnswerCard from '@/components/community/AnswerCard';

export default function QuestionDetailPage() {
  const { questionId } = useParams<{ questionId: string }>();
  const { userId, user } = useAuthStore();
  const token = localStorage.getItem('jwt');

  const [details, setDetails] = useState<QuestionDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!questionId || !userId || !token) {
      setError('Missing required information to load this page.');
      setIsLoading(false);
      return;
    }

    const fetchDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await getAllAnswersForSpecificQuestion(
          questionId,
          userId,
          token,
          user?.role || 'user'
        );

        if (response.status === 'Success') {
          setDetails(response.data);
        } else {
          setError('Failed to load question details.');
        }
      } catch (err) {
        console.error(err);
        setError('An error occurred while fetching question details.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [questionId, userId, token, user]);

  const questionForCard: CommunityQuestion | null = details
    ? {
        questionId: details.questionId,
        question: details.question,
        userIdQuestionAsked: details.questionAskeduserId,
        timestamp: details.timestamp,
        myQuestion: details.loggedInUserId === details.questionAskeduserId,
      }
    : null;

  return (
    <div className="bg-gray-50 min-h-screen p-4 mt-20 md:p-8">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <div className="w-full max-w-[900px] bg-white rounded-lg p-5">
          {isLoading && (
            <div className="p-20 text-center">Loading details...</div>
          )}

          {error && (
            <div className="p-20 text-center text-red-500">{error}</div>
          )}

          {details && questionForCard && (
            <div className="flex flex-col gap-5">
              <QuestionCard questionData={details} />

              {details.answerStructure.length > 0 ? (
                details.answerStructure.map((answer) => (
                  <AnswerCard key={answer.answerId} answer={answer} />
                ))
              ) : (
                <div className="p-10 text-center text-gray-500">
                  Be the first to answer this question!
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}