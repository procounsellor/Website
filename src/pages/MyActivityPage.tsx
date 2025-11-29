import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuthStore } from '@/store/AuthStore';
import {
  getMyQuestions,
  getMyBookmarkedQuestions,
  getMyAnswers
} from '@/api/community';
import { Loader2 } from 'lucide-react';
import MyActivityQuestionCard from '../components/community/MyActivityQuestionCard';
import MyActivityAnswerCard from '../components/community/MyActivityAnswerCard';

import type {
  CommunityDashboardItem,
  MyAnswerItem
} from '@/types/community';

type TabType = 'My Questions' | 'My Answers' | 'Pinned Questions';

export default function MyActivityPage() {
  const { userId } = useAuthStore();
  const token = localStorage.getItem("jwt");
  const [activeTab, setActiveTab] = useState<TabType>('My Questions');
  const [myQuestions, setMyQuestions] = useState<CommunityDashboardItem[]>([]);
  const [myAnswers, setMyAnswers] = useState<MyAnswerItem[]>([]);
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState<any[]>([]);

  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const nextPageTokenRef = useRef<string | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  const fetchQuestions = useCallback(
    async (isNextPage = false) => {
      if (!userId || !token) return;

      try {
        if (!isNextPage) {
          setIsLoading(true);
          setError(null);
        } else {
          if (!nextPageTokenRef.current) return;
          setIsFetchingMore(true);
        }

        const response = await getMyQuestions(
          userId,
          token,
          isNextPage ? nextPageTokenRef.current : ""
        );

        if (response.status === "Success") {
          if (isNextPage) {
            setMyQuestions(prev => [...prev, ...response.data]);
          } else {
            setMyQuestions(response.data);
          }

          setNextPageToken(response.nextPageToken || null);
          nextPageTokenRef.current = response.nextPageToken || null;
        }

      } catch {
        setError("Failed to load questions");
      }

      setIsLoading(false);
      setIsFetchingMore(false);
    },
    [userId, token]
  );

  const fetchOtherTabs = useCallback(async () => {
    if (!userId || !token) return;

    setIsLoading(true);
    setError(null);

    try {
      if (activeTab === "My Answers") {
        const res = await getMyAnswers(userId, token);
        if (res.status === "Success") setMyAnswers(res.data);
      }

      if (activeTab === "Pinned Questions") {
        const res = await getMyBookmarkedQuestions(userId, token);
        if (res.status === "Success") {
          setBookmarkedQuestions(res.data);
        }
      }
    } catch {
      setError("Failed to load data");
    }

    setIsLoading(false);
  }, [activeTab, userId, token]);

  useEffect(() => {
    if (activeTab === "My Questions") {
      setMyQuestions([]);
      setNextPageToken(null);
      nextPageTokenRef.current = null;

      fetchQuestions(false);
    } else {
      fetchOtherTabs();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab !== "My Questions") return;
    if (!bottomRef.current) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          if (nextPageTokenRef.current) {
            fetchQuestions(true);
          }
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(bottomRef.current);
    return () => observer.disconnect();
  }, [activeTab, fetchQuestions]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="w-full max-w-[900px] p-20 bg-white rounded-lg text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-[#13097D]" />
          Loading...
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

    if (activeTab === "My Questions") {
      return (
        <>
          <div className="w-full max-w-[900px] bg-white rounded-lg p-5">
            {myQuestions.map(q => (
              <MyActivityQuestionCard key={q.questionId} question={q} />
            ))}
          </div>

          <div ref={bottomRef} className="h-16 flex justify-center items-center mt-4">
            {isFetchingMore && (
              <Loader2 className="w-5 h-5 animate-spin text-[#13097D]" />
            )}
            {!nextPageToken && (
              <p className="text-sm text-gray-400">You have reached the end</p>
            )}
          </div>
        </>
      );
    }

    if (activeTab === "My Answers") {
      return (
        <div className="w-full max-w-[900px] bg-white rounded-lg p-5">
          {myAnswers.map(answerItem => (
            <MyActivityAnswerCard
              key={answerItem.myAnswerId}
              answerItem={answerItem}
              onAnswerUpdated={fetchOtherTabs}
            />
          ))}
        </div>
      );
    }

    if (activeTab === "Pinned Questions") {
      return (
        <div className="w-full max-w-[900px] bg-white rounded-lg p-5">
          {bookmarkedQuestions.map((q: any) => (
            <MyActivityQuestionCard key={q.questionId} question={q} />
          ))}
        </div>
      );
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen mt-18 p-4 md:p-8">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <div className="w-full max-w-[900px] bg-white rounded-lg mb-4">
          <div className="flex border-b">
            {['My Questions', 'My Answers', 'Pinned Questions'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as TabType)}
                className={`flex-1 py-4 text-center font-medium ${
                  activeTab === tab
                    ? "text-[#13097D] border-b-2 border-[#13097D]"
                    : "text-gray-500"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {renderContent()}
      </div>
    </div>
  );
}
