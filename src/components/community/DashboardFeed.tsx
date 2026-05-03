import React, { useRef, useCallback } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { searchCommunityQuestions } from '@/api/community';
import type { CommunityDashboardItem } from '@/types/community';
import DashboardCard from './DashboardCard';
import { Loader2 } from 'lucide-react';

interface DashboardFeedProps {
  selectedCategory?: string | null;
}

const PAGE_SIZE = 10;

const DashboardFeed: React.FC<DashboardFeedProps> = ({ selectedCategory }) => {
  const observer = useRef<IntersectionObserver | null>(null);

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['communityFeed'],
    queryFn: ({ pageParam = 0 }) =>
      searchCommunityQuestions('', {
        sortBy: 'rating',
        sortOrder: 'desc',
        page: pageParam as number,
        pageSize: PAGE_SIZE,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.data.length < PAGE_SIZE) return undefined;
      return allPages.length;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const lastElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoading || !hasNextPage) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasNextPage, isFetchingNextPage, fetchNextPage]
  );

  const allItems: CommunityDashboardItem[] = data?.pages.flatMap((p) => p.data) ?? [];

  const displayedItems = selectedCategory
    ? allItems.filter((item) => {
        const subject = item.subject || '';
        const mainCategories = ['Colleges', 'Courses', 'Exams'];
        if (selectedCategory === 'Other') {
          return !mainCategories.includes(subject);
        }
        return subject === selectedCategory;
      })
    : allItems;

  if (isLoading) {
    return (
      <div className="w-full max-w-225 p-20 bg-white rounded-lg text-center border border-gray-200 shadow-sm">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-[#13097D]" />
        Loading feed...
      </div>
    );
  }

  if (isError && allItems.length === 0) {
    return (
      <div className="w-full max-w-225 p-20 bg-white rounded-lg text-center text-red-500 border border-gray-200 shadow-sm">
        An error occurred while fetching the feed.
      </div>
    );
  }

  return (
    <>
      <div className="w-full md:max-w-225 bg-white rounded-lg p-4 md:p-5 border border-gray-200 shadow-sm">
        <div className="flex flex-col space-y-5">
          {displayedItems.length > 0 ? (
            displayedItems.map((item) => (
              <DashboardCard key={item.questionId} item={item} />
            ))
          ) : (
            <div className="p-10 text-center text-gray-500">
              {allItems.length === 0
                ? 'No items found in the community feed.'
                : `No items found for category "${selectedCategory}".`}
            </div>
          )}
        </div>
      </div>

      <div className="w-full md:max-w-225 flex flex-col items-center mt-4">
        {hasNextPage && (
          <div ref={lastElementRef} className="h-16 flex justify-center items-center">
            {isFetchingNextPage && (
              <Loader2 className="w-5 h-5 animate-spin text-[#13097D]" />
            )}
          </div>
        )}

        {!hasNextPage && allItems.length > 0 && (
          <div className="h-16 flex justify-center items-center">
            <p className="text-sm text-gray-400">You have reached the end</p>
          </div>
        )}
      </div>
    </>
  );
};

export default DashboardFeed;
