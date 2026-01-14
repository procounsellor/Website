import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuthStore } from '@/store/AuthStore';
import {
  getMyQuestions,
  getMyBookmarkedQuestions,
  getMyAnswers
} from '@/api/community';
import { Loader2, Search } from 'lucide-react';
import MyActivityQuestionCard from '@/components/community/MyActivityQuestionCard';
import MyActivityAnswerCard from '@/components/community/MyActivityAnswerCard';
import CategorySidebar from '@/components/community/CategorySidebar';
// import RightSideAds from '@/components/community/RightSideAds';
import CommunityBreadcrumbs from "@/components/community/CommunityBreadcrumbs";

import type {
  CommunityDashboardItem,
  MyAnswerItem
} from '@/types/community';

type TabType = 'My Questions' | 'My Answers' | 'Bookmarked Questions';

export default function MyActivityPage() {
  const { userId } = useAuthStore();
  const token = localStorage.getItem("jwt");
  const [activeTab, setActiveTab] = useState<TabType>('My Questions');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
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

        const tokenToPass = isNextPage ? nextPageTokenRef.current : null;
        
        const response = await getMyQuestions(
          userId,
          token,
          tokenToPass
        );

        if (response.status === "Success") {
          if (isNextPage) {
            setMyQuestions(prev => [...prev, ...response.data]);
          } else {
            setMyQuestions(response.data);
          }

          const newToken = response.nextPageToken || null;
          setNextPageToken(newToken);
          nextPageTokenRef.current = newToken;
        }

      } catch (err) {
        console.error('Fetch questions error:', err);
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

      if (activeTab === "Bookmarked Questions") {
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
    setSelectedCategory(null);
    setSearchQuery('');
  }, [activeTab]);

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

  const filterData = <T extends { subject?: string, question?: string }>(data: T[]) => {
    return data.filter(item => {
      let matchesCategory = true;
      
      if (selectedCategory) {
        const subject = item.subject || '';
        const mainCategories = ['Colleges', 'Courses', 'Exams'];

        if (selectedCategory === 'Other') {
          matchesCategory = !mainCategories.includes(subject);
        } else {
          matchesCategory = subject === selectedCategory;
        }
      }

      const matchesSearch = searchQuery 
        ? item.question?.toLowerCase().includes(searchQuery.toLowerCase())
        : true;

      return matchesCategory && matchesSearch;
    });
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="w-full bg-white rounded-lg p-20 text-center border border-gray-200 shadow-sm">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-[#13097D]" />
          Loading...
        </div>
      );
    }

    if (error) {
      return (
        <div className="w-full bg-white rounded-lg p-20 text-center text-red-500 border border-gray-200 shadow-sm">
          {error}
        </div>
      );
    }

    if (activeTab === "My Questions") {
      const filteredQuestions = filterData(myQuestions);

      return (
        <>
          <div className="w-full bg-white rounded-lg p-4 md:p-5 border border-gray-200 shadow-sm">
            <div className="flex flex-col space-y-4 md:space-y-5">
              {filteredQuestions.length > 0 ? (
                filteredQuestions.map(q => (
                  <MyActivityQuestionCard 
                    key={q.questionId} 
                    question={q} 
                    onQuestionUpdated={() => fetchQuestions(false)}
                  />
                ))
              ) : (
                <div className="text-center py-10 text-gray-500">
                  {selectedCategory ? `No questions found in "${selectedCategory}"` : "You haven't asked any questions yet."}
                </div>
              )}
            </div>
          </div>

          <div ref={bottomRef} className="h-16 flex justify-center items-center mt-4">
            {isFetchingMore && (
              <Loader2 className="w-5 h-5 animate-spin text-[#13097D]" />
            )}
            {!nextPageToken && myQuestions.length > 0 && (
              <p className="text-sm text-gray-400">You have reached the end</p>
            )}
          </div>
        </>
      );
    }

    if (activeTab === "My Answers") {
      const filteredAnswers = filterData(myAnswers);

      return (
        <div className="w-full bg-white rounded-lg p-4 md:p-5 border border-gray-200 shadow-sm">
          <div className="flex flex-col space-y-4 md:space-y-5">
             {filteredAnswers.length > 0 ? (
                filteredAnswers.map(answerItem => (
                  <MyActivityAnswerCard
                    key={answerItem.myAnswerId}
                    answerItem={answerItem}
                    onAnswerUpdated={fetchOtherTabs}
                  />
                ))
             ) : (
                <div className="text-center py-10 text-gray-500">
                   {selectedCategory ? `No answers found in "${selectedCategory}"` : "You haven't answered any questions yet."}
                </div>
             )}
          </div>
        </div>
      );
    }

    if (activeTab === "Bookmarked Questions") {
      const filteredBookmarks = filterData(bookmarkedQuestions);

      return (
        <div className="w-full bg-white rounded-lg p-4 md:p-5 border border-gray-200 shadow-sm">
          <div className="flex flex-col space-y-4 md:space-y-5">
             {filteredBookmarks.length > 0 ? (
               filteredBookmarks.map((q: any) => (
                 <MyActivityQuestionCard 
                   key={q.questionId} 
                   question={q}
                   onQuestionUpdated={fetchOtherTabs} 
                   isBookmarkView={true}
                 />
               ))
             ) : (
               <div className="text-center py-10 text-gray-500">
                 {selectedCategory ? `No bookmarks found in "${selectedCategory}"` : "No bookmarked questions found."}
               </div>
             )}
          </div>
        </div>
      );
    }
  };

  const Separator = () => (
    <div className="md:w-px md:h-[31px] md:bg-[#13097D33]" />
  );

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-8">
      <div className="max-w-[1440px] mx-auto flex justify-center gap-3">
        
        <div className="hidden lg:block w-[191px] shrink-0">
          <CategorySidebar 
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>

        <div className="flex flex-col w-full md:w-[860px] shrink-0">
          <CommunityBreadcrumbs 
            paths={[
              { name: "Community Dashboard", link: "/community" },
              { name: "My Activity" }
            ]} 
            showMobileBack={true} 
          />
          
          <div className="w-full bg-white rounded-lg mb-4 p-4 md:p-5 shadow-sm border border-gray-200 flex flex-col gap-4 md:gap-5">
            <div className="flex items-center gap-3">
              <Search size={24} className="text-[#343C6A] shrink-0" />
              <input
                type="text"
                placeholder="Search questions"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#F5F5F7] rounded-md p-2.5 md:p-3 text-[11px] md:text-sm placeholder-[#2F43F2] border border-transparent focus:outline-none focus:ring-2 focus:ring-[#13097D] focus:border-transparent"
              />
            </div>

            <div className="flex items-center justify-center pt-1">
              <div className="w-full grid grid-cols-3 gap-2 md:flex md:w-auto md:gap-[60px] items-center">
                {['My Questions', 'My Answers', 'Bookmarked Questions'].map((tab, index, arr) => (
                  <div key={tab} className="flex items-center">
                    <button
                      onClick={() => setActiveTab(tab as TabType)}
                      className={`pb-0.5 text-[12px] md:text-sm font-semibold cursor-pointer transition-all ${
                        activeTab === tab
                          ? "text-[#2F43F2] border-b-2 border-[#2F43F2]"
                          : "text-[#6B7280] hover:text-indigo-900 border-b-2 border-transparent"
                      }`}
                    >
                      {tab}
                    </button>
                    
                    {index < arr.length - 1 && (
                      <div className="ml-[60px]">
                        <Separator />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="w-full md:w-[860px] shrink-0">
            {renderContent()}
          </div>
          
        </div>

        <div className="hidden xl:block w-[250px] shrink-0">
          {/* <RightSideAds /> */}
        </div>
        
      </div>
    </div>
  );
}