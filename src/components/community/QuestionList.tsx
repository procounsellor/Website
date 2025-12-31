// src/components/community/QuestionList.tsx
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { getQuestionsList } from '@/api/community';
import { useAuthStore } from '@/store/AuthStore';
import type { CommunityQuestion } from '@/types/community';
import AnswerFeedCard from './AnswerFeedCard';
import { Loader2 } from 'lucide-react';

interface QuestionListProps {
  selectedCategory?: string | null;
}

const QuestionList: React.FC<QuestionListProps> = ({ selectedCategory }) => {
  const [questions, setQuestions] = useState<CommunityQuestion[]>([]);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  
  // Loading states
  const [isLoading, setIsLoading] = useState(true); // For initial load
  const [isMoreLoading, setIsMoreLoading] = useState(false); // For pagination
  const [error, setError] = useState<string | null>(null);

  const { userId } = useAuthStore();
  const token = localStorage.getItem('jwt');

  // Observer for infinite scroll
  const observer = useRef<IntersectionObserver | null>(null);

  const lastElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoading || isMoreLoading) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && nextPageToken) {
          handleLoadMore();
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoading, isMoreLoading, nextPageToken]
  );

  // Initial Fetch
  useEffect(() => {
    if (!userId || !token) {
      setError('You must be logged in to see questions.');
      setIsLoading(false);
      return;
    }

    const fetchQuestions = async () => {
      try {
        setIsLoading(true);
        setError(null);
        // Pass undefined for pageToken on initial load
        const response = await getQuestionsList(userId, token);
        
        if (response.status === 'Success') {
          setQuestions(response.data);
          setNextPageToken(response.nextPageToken);
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

  // Load More Function
  const handleLoadMore = async () => {
    if (!userId || !token || !nextPageToken || isMoreLoading) return;

    try {
      setIsMoreLoading(true);
      const response = await getQuestionsList(userId, token, nextPageToken);

      if (response.status === 'Success') {
        // Append new questions to the existing list
        setQuestions((prev) => [...prev, ...response.data]);
        setNextPageToken(response.nextPageToken);
      } else {
        // If fail, stop trying to paginate
        setNextPageToken(null);
      }
    } catch (err) {
      console.error('Pagination error:', err);
      // Optional: don't show full error UI, just stop pagination
      setNextPageToken(null);
    } finally {
      setIsMoreLoading(false);
    }
  };

  // Filter logic (Client side)
  const displayedQuestions = selectedCategory
    ? questions.filter((q) => {
        const category = (q as any).subject; 
        return category === selectedCategory;
      })
    : questions;

  if (isLoading) {
    return (
      <div className="w-full max-w-[900px] p-20 bg-white rounded-lg text-center flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#13097D] mb-4" />
        <p>Loading questions...</p>
      </div>
    );
  }

  if (error && questions.length === 0) {
    return (
      <div className="w-full max-w-[900px] p-20 bg-white rounded-lg text-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="w-full max-w-[900px]">
      <div className="bg-white rounded-lg p-5 flex flex-col gap-5">
        {displayedQuestions.length > 0 ? (
          displayedQuestions.map((question) => (
            <AnswerFeedCard key={question.questionId} question={question} />
          ))
        ) : (
          <div className="p-10 text-center text-gray-500">
            {questions.length === 0 
               ? "No questions found. Be the first to ask!"
               : `No questions found for category "${selectedCategory}".`
            }
          </div>
        )}
      </div>

      {/* Pagination Loading & End Message Section */}
      <div className="flex flex-col items-center mt-4 pb-8">
        {nextPageToken && (
          <div ref={lastElementRef} className="h-16 flex justify-center items-center w-full">
            {isMoreLoading && (
              <Loader2 className="w-6 h-6 animate-spin text-[#13097D]" />
            )}
          </div>
        )}

        {!nextPageToken && questions.length > 0 && (
          <div className="h-16 flex justify-center items-center">
            <p className="text-sm text-gray-400">You have reached the end</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionList;