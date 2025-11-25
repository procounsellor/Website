import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/AuthStore';
import { getMyQuestions, getMyBookmarkedQuestions, getMyAnswers } from '@/api/community';
import { Loader2 } from 'lucide-react';
import MyActivityQuestionCard from '../components/community/MyActivityQuestionCard';
import MyActivityAnswerCard from '../components/community/MyActivityAnswerCard';
import type { CommunityDashboardItem, MyAnswerItem } from '@/types/community';

type TabType = 'My Questions' | 'My Answers' | 'Pinned Questions';

export default function MyActivityPage() {
  const [activeTab, setActiveTab] = useState<TabType>('My Questions');
  const [myQuestions, setMyQuestions] = useState<CommunityDashboardItem[]>([]);
  const [myAnswers, setMyAnswers] = useState<MyAnswerItem[]>([]);
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState<CommunityDashboardItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { userId } = useAuthStore();
  const token = localStorage.getItem('jwt');
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    if (!userId || !token) {
      setError('You must be logged in to view your activity.');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      if (activeTab === 'My Questions') {
        const response = await getMyQuestions(userId, token);
        if (response.status === 'Success') {
          setMyQuestions(response.data);
        } else {
          setError('Failed to load your questions.');
        }
      } else if (activeTab === 'My Answers') {
        const response = await getMyAnswers(userId, token);
        if (response.status === 'Success') {
          setMyAnswers(response.data);
        } else {
          setError('Failed to load your answers.');
        }
      } else if (activeTab === 'Pinned Questions') {
        const response = await getMyBookmarkedQuestions(userId, token);
        if (response.status === 'Success') {
          // The API might return CommunityDashboardItem[] or CommunityQuestion[]
          // Handle both cases
          const questions = response.data as any[];
          setBookmarkedQuestions(questions);
        } else {
          setError('Failed to load bookmarked questions.');
        }
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while fetching data.');
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, userId, token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const tabs: TabType[] = ['My Questions', 'My Answers', 'Pinned Questions'];

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="w-full max-w-[900px] p-20 bg-white rounded-lg text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#13097D] mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
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

    if (activeTab === 'My Questions') {
      if (myQuestions.length === 0) {
        return (
          <div className="w-full max-w-[900px] p-20 bg-white rounded-lg text-center text-gray-500">
            You haven't asked any questions yet.
          </div>
        );
      }
      return (
        <div className="w-full max-w-[900px] bg-white rounded-lg p-5">
          <div className="flex flex-col gap-5">
            {myQuestions.map((question) => (
              <MyActivityQuestionCard key={question.questionId} question={question} />
            ))}
          </div>
        </div>
      );
    }

    if (activeTab === 'My Answers') {
      if (myAnswers.length === 0) {
        return (
          <div className="w-full max-w-[900px] p-20 bg-white rounded-lg text-center text-gray-500">
            You haven't answered any questions yet.
          </div>
        );
      }
      const answerCards = myAnswers.map((answerItem) => (
        <MyActivityAnswerCard 
          key={answerItem.myAnswerId} 
          answerItem={answerItem}
          onAnswerUpdated={fetchData}
        />
      ));

      if (answerCards.length === 0) {
        return (
          <div className="w-full max-w-[900px] p-20 bg-white rounded-lg text-center text-gray-500">
            You haven't answered any questions yet.
          </div>
        );
      }

      return (
        <div className="w-full max-w-[900px] bg-white rounded-lg p-5">
          <div className="flex flex-col gap-5">
            {answerCards}
          </div>
        </div>
      );
    }

    if (activeTab === 'Pinned Questions') {
      if (bookmarkedQuestions.length === 0) {
        return (
          <div className="w-full max-w-[900px] p-20 bg-white rounded-lg text-center text-gray-500">
            You haven't bookmarked any questions yet.
          </div>
        );
      }
      return (
        <div className="w-full max-w-[900px] bg-white rounded-lg p-5">
          <div className="flex flex-col gap-5">
            {bookmarkedQuestions.map((question) => (
              <MyActivityQuestionCard key={question.questionId} question={question} />
            ))}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        {/* Breadcrumbs */}
        <div className="w-full max-w-[900px] mb-4 mt-14">
          <nav className="text-sm text-gray-600 font-normal">
            <span 
              className="hover:text-[#13097D] cursor-pointer"
              onClick={() => navigate('/')}
            >
              Home
            </span>
            <span className="mx-2">→</span>
            <span 
              className="hover:text-[#13097D] cursor-pointer"
              onClick={() => navigate('/community')}
            >
              Community
            </span>
            <span className="mx-2">→</span>
            <span className="text-[#13097D] font-semibold">My Activity</span>
          </nav>
        </div>

        {/* Tabs */}
        <div className="w-full max-w-[900px] bg-white rounded-lg mb-4">
          <div className="flex border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                  activeTab === tab
                    ? 'text-[#13097D] border-b-2 border-[#13097D]'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {renderContent()}
      </div>
    </div>
  );
}

