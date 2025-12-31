import React, { useEffect, useState, useRef, useCallback } from 'react';
import { getCommunityDashboard } from '@/api/community';
import { useAuthStore } from '@/store/AuthStore';
import type { CommunityDashboardItem } from '@/types/community';
import DashboardCard from './DashboardCard';
import { Loader2 } from 'lucide-react'; 

interface DashboardFeedProps {
  selectedCategory?: string | null;
}

const DashboardFeed: React.FC<DashboardFeedProps> = ({ selectedCategory }) => {
  const [items, setItems] = useState<CommunityDashboardItem[]>([]);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMoreLoading, setIsMoreLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { userId } = useAuthStore();
  const token = localStorage.getItem('jwt');

  const observer = useRef<IntersectionObserver | null>(null);

  const lastElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoading) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (
          entries[0].isIntersecting &&
          nextPageToken &&
          !isMoreLoading
        ) {
          handleLoadMore();
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoading, isMoreLoading, nextPageToken]
  );

  useEffect(() => {
    if (!userId || !token) {
      setError('You must be logged in to see the feed.');
      setIsLoading(false);
      return;
    }

    const fetchFeed = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await getCommunityDashboard(userId, token);
        
        if (response.status === 'Success') {
          setItems(response.data);
          setNextPageToken(response.nextPageToken);
        } else {
          setError('Failed to load feed.');
        }
      } catch (err) {
        console.error(err);
        setError('An error occurred while fetching the feed.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeed();
  }, [userId, token]);

  const handleLoadMore = useCallback(async () => {
    if (!userId || !token || !nextPageToken || isMoreLoading) return;

    try {
      setIsMoreLoading(true);
      setError(null);

      const response = await getCommunityDashboard(
        userId,
        token,
        nextPageToken
      );

      if (response.status === "Success") {
        setItems((prevItems) => [...prevItems, ...response.data]);
        setNextPageToken(response.nextPageToken);
      } else {
        setError("Failed to load more items.");
        setNextPageToken(null);
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while loading more items.");
      setNextPageToken(null);
    } finally {
      setIsMoreLoading(false);
    }
  }, [userId, token, nextPageToken, isMoreLoading]);

  const displayedItems = selectedCategory
    ? items.filter((item) => item.interestedCourse === selectedCategory)
    : items;

  if (isLoading) {
    return (
      <div className="w-full max-w-[900px] p-20 bg-white rounded-lg text-center border border-gray-200 shadow-sm">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-[#13097D]" />
        Loading feed...
      </div>
    );
  }

  if (error && !isMoreLoading && items.length === 0) {
    return (
      <div className="w-full max-w-[900px] p-20 bg-white rounded-lg text-center text-red-500 border border-gray-200 shadow-sm">
        {error}
      </div>
    );
  }

  return (
    <>
      <div className="w-full max-w-[900px] bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
        <div className="flex flex-col space-y-5">
          {displayedItems.length > 0 ? (
            displayedItems.map((item) => (
              <DashboardCard key={item.questionId} item={item} />
            ))
          ) : (
            <div className="p-10 text-center text-gray-500">
              {items.length === 0 
                ? "No items found in the community feed." 
                : `No items found for category "${selectedCategory}".`}
            </div>
          )}
        </div>
      </div>

      <div className="w-full max-w-[900px] flex flex-col items-center mt-4">
        {nextPageToken && (
          <div ref={lastElementRef} className="h-16 flex justify-center items-center">
            {isMoreLoading && (
              <Loader2 className="w-5 h-5 animate-spin text-[#13097D]" />
            )}
          </div>
        )}

        {!nextPageToken && items.length > 0 && (
          <div className="h-16 flex justify-center items-center">
            <p className="text-sm text-gray-400">You have reached the end</p>
          </div>
        )}

        {error && isMoreLoading && (
          <div className="mt-4 text-center text-red-500">{error}</div>
        )}
      </div>
    </>
  );
};

export default DashboardFeed;