import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuthStore } from '@/store/AuthStore';
import { getAllAnswersForSpecificQuestion } from '@/api/community';
import type { QuestionDetailData, CommunityQuestion } from '@/types/community';
import QuestionCard from '@/components/community/QuestionCard';
import AnswerCard from '@/components/community/AnswerCard';
import CategorySidebar from '@/components/community/CategorySidebar';
import RightSideAds from '@/components/community/RightSideAds';

export default function QuestionDetailPage() {
  const { questionId } = useParams<{ questionId: string }>();
  const { userId, user } = useAuthStore();
  const token = localStorage.getItem('jwt');

  const [details, setDetails] = useState<QuestionDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDetails = async () => {
    if (!questionId || !userId || !token) {
      setError('Missing required information to load this page.');
      setIsLoading(false);
      return;
    }

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

  useEffect(() => {
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
    <div className="bg-gray-50 min-h-screen p-4 md:p-8">
      {/* Main Layout Container */}
      <div className="max-w-[1440px] mx-auto flex justify-center gap-3">
        
        {/* Left Column: Sidebar */}
        <div className="hidden lg:block w-[191px] shrink-0">
          <CategorySidebar />
        </div>

        {/* Center Column: Content */}
        <div className="flex flex-col mt-15 w-[800px] shrink-0">
          
          {/* White Card Wrapper matches DashboardFeed style */}
          <div className="w-full bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            
            {isLoading && (
              <div className="p-20 text-center">Loading details...</div>
            )}

            {error && (
              <div className="p-20 text-center text-red-500">{error}</div>
            )}

            {details && questionForCard && (
              // Added flex-col and gap-5 for proper spacing between Question and Answers
              <div className="flex flex-col gap-5">
                <QuestionCard questionData={details} />

                {details.answerStructure.length > 0 ? (
                  details.answerStructure.map((answer) => (
                    <AnswerCard key={answer.answerId} answer={answer} onAnswerUpdated={fetchDetails} />
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

        {/* Right Column: Ads */}
        <div className="hidden xl:block w-[250px] shrink-0">
          <RightSideAds />
        </div>

      </div>
    </div>
  );
}