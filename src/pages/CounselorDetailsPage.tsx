import { useParams, useLocation } from 'react-router-dom';
import { useCounselorById } from '@/hooks/useCounselors';

import { CounselorProfileCard } from '@/components/counselor-details/CounselorProfileCard';
import { AboutCounselorCard } from '@/components/counselor-details/AboutCounselorCard';
import { CounselorReviews } from '@/components/counselor-details/CounselorReviews';
import { FreeCareerAssessmentCard } from '@/components/shared/FreeCareerAssessmentCard';
import { FeaturedCollegesCard } from '@/components/shared/FeaturedCollegesCard';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/AuthStore';
import { getSubscribedCounsellors, getReviewsByCounselorId } from '@/api/counsellor';
import type { CounselorReview } from '@/types/counselorReview';


export default function CounselorDetailsPage() {
  const { id: paramId } = useParams<{ id: string }>();
  const location = useLocation();
  type LocationState = { id?: string } | undefined;
  const state = location.state as LocationState;
  const computedId = paramId || state?.id;
  const { counselor, loading, error } = useCounselorById(computedId ?? '');
  const { userId } = useAuthStore();
  const token = localStorage.getItem('jwt');

  const [isSubscribed, setIsSubscribed] = useState(false);
  const [reviews, setReviews] = useState<CounselorReview[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!computedId || !userId || !token) {
      setLoadingData(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoadingData(true);
        const results = await Promise.allSettled([
          getSubscribedCounsellors(userId, token),
          getReviewsByCounselorId(userId, computedId, token)
        ]);
        
        if (results[0].status === 'fulfilled') {
          const subscribedList = results[0].value;
          const subscriptionCheck = subscribedList.some(c => c.counsellorId === computedId);
          setIsSubscribed(subscriptionCheck);
        } else {
          console.error("Failed to fetch subscription status:", results[0].reason);
        }

        if (results[1].status === 'fulfilled') {
          const fetchedReviews = results[1].value;
          setReviews(fetchedReviews);
        } else {
          console.error("Failed to fetch reviews (this may be expected if none exist):", results[1].reason);
          setReviews([]);
        }

      } catch (err) {
        console.error("An unexpected error occurred in fetchData:", err);
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, [userId, token, computedId]);

  if (!computedId) {
    return <div className="p-8 text-center text-red-500">Error: Counselor ID is missing.</div>;
  }

  if (loading || loadingData) {
    return <div className="flex h-screen items-center justify-center">Loading Counselor Profile...</div>;
  }

  if (error || !counselor) {
    return <div className="flex h-screen items-center justify-center text-red-500">{error || "Counselor not found."}</div>;
  }

  return (
    <div className="bg-gray-50 pt-28 pb-8 px-4">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      <div className="max-w-7xl mx-auto mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Counselor Profile</h1>
        <p className="text-gray-500">Discover their expertise and find the right guidance for your future</p>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          <CounselorProfileCard counselor={counselor} />
          <AboutCounselorCard counselor={counselor} />
          <CounselorReviews 
              reviews={reviews}
              isSubscribed={isSubscribed}
              counsellorId={computedId} 
            />
        </div>

        {/* Right Column */}
        <div className="lg:col-span-1 flex flex-col gap-8">
          <FreeCareerAssessmentCard  counselor={counselor}/>
          <FeaturedCollegesCard />
        </div>

      </div>
      </main>
    </div>
  );
}