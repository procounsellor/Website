import React, { useEffect, useState } from 'react';
import { getQuestionsList } from '@/api/community';
import { useAuthStore } from '@/store/AuthStore';
import type { CommunityQuestion } from '@/types/community';
import AnswerFeedCard from './AnswerFeedCard';

const QuestionList: React.FC = () => {
  const [questions, setQuestions] = useState<CommunityQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { userId } = useAuthStore();
  const token = localStorage.getItem('jwt');

  useEffect(() => {
    if (!userId || !token) {
      setError('You must be logged in to see questions.');
      setIsLoading(false);
      return;
    }

    const fetchQuestions = async () => {
      try {
        setIsLoading(true);
        const response = await getQuestionsList(userId, token);
        
        if (response.status === 'Success') {
          setQuestions(response.data);
        } else {
          setError('Failed to load questions.');
        }
      } catch (err) {
        console.error(err);
        setError('An error occurred while fetching questions.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, [userId, token]);

  if (isLoading) {
    return (
      <div className="w-full max-w-[900px] p-20 bg-white rounded-lg text-center">
        Loading questions...
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-[900px] p-20 bg-white rounded-lg text-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="w-full max-w-[900px] bg-white rounded-lg p-5">
      <div className="flex flex-col gap-5">
        {questions.length > 0 ? (
          questions.map((question) => (
            <AnswerFeedCard key={question.questionId} question={question} />
          ))
        ) : (
          <div className="p-10 text-center text-gray-500">
            No questions found. Be the first to ask!
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionList;