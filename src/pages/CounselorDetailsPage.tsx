import { useParams, useLocation } from 'react-router-dom';
import { useCounselorById } from '@/hooks/useCounselors';

import { CounselorProfileCard } from '@/components/counselor-details/CounselorProfileCard';
import { AboutCounselorCard } from '@/components/counselor-details/AboutCounselorCard';
import { CounselorReviews } from '@/components/counselor-details/CounselorReviews';
import { FreeCareerAssessmentCard } from '@/components/shared/FreeCareerAssessmentCard';
import { FeaturedCollegesCard } from '@/components/shared/FeaturedCollegesCard';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/AuthStore';
import { getSubscribedCounsellors, getReviewsByCounselorId, addFav } from '@/api/counsellor';
import toast from 'react-hot-toast';
import type { CounselorReview } from '@/types/counselorReview';
import type { SubscribedCounsellor } from '@/types/user';

type ApiSubscribedCounselor = {
  counsellorId: string;
  plan: string | null;
  subscriptionMode: string | null;
};


export default function CounselorDetailsPage() {
  const { id: paramId } = useParams<{ id: string }>();
  const location = useLocation();
  type LocationState = { id?: string } | undefined;
  const state = location.state as LocationState;
  const computedId = paramId || state?.id;
  const { counselor, loading, error } = useCounselorById(computedId ?? '');
  const { user, userId, refreshUser } = useAuthStore();
  const token = localStorage.getItem('jwt');

  const [subscriptionDetails, setSubscriptionDetails] = useState<SubscribedCounsellor | null>(null);
  const [reviews, setReviews] = useState<CounselorReview[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [isFavourite, setIsFavourite] = useState(false);
  const [isTogglingFavourite, setIsTogglingFavourite] = useState(false);

  useEffect(() => {
    if (user && computedId) {
      const favIds = user.favouriteCounsellorIds || [];
      setIsFavourite(favIds.includes(computedId));
    }
  }, [user, computedId]);

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
          const subscribedList: ApiSubscribedCounselor[] = results[0].value;
          
          const currentApiSubscription = subscribedList.find(c => c.counsellorId === computedId);
          if (currentApiSubscription && currentApiSubscription.plan) {
            const formattedSubscription: SubscribedCounsellor = {
              counsellorId: currentApiSubscription.counsellorId,
              plan: currentApiSubscription.plan,
              subscriptionMode: currentApiSubscription.subscriptionMode ?? "unknown",
            };
            setSubscriptionDetails(formattedSubscription);
          }
            else {
            setSubscriptionDetails(null);
          }
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

  const handleToggleFavourite = async () => {
    if (!userId || !computedId || !token) {
      toast.error("You must be logged in to add favourites.");
      return;
    }

    setIsTogglingFavourite(true);
    setIsFavourite(prevState => !prevState); 

    try {
      await addFav(userId, computedId);
      await refreshUser(true); 
      toast.success("Favourite status updated!");
    } catch (err) {
      setIsFavourite(prevState => !prevState); 
      toast.error("Could not update favourite status.");
    } finally {
      setIsTogglingFavourite(false);
    }
  };

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
    <div className="bg-gray-50 pt-20 md:pt-28 pb-8 px-4">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      <div className="max-w-7xl mx-auto mb-6 hidden md:block">
        <h1 className="text-2xl font-bold text-gray-800">Counselor Profile</h1>
        <p className="text-gray-500">Discover their expertise and find the right guidance for your future</p>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          <CounselorProfileCard 
            counselor={counselor} 
            subscription={subscriptionDetails} 
            isFavourite={isFavourite}
            onToggleFavourite={handleToggleFavourite}
            isTogglingFavourite={isTogglingFavourite}  
          />
          <AboutCounselorCard counselor={counselor} />
          <CounselorReviews 
              reviews={reviews}
              isSubscribed={!!subscriptionDetails}
              counsellorId={computedId} 
            />
        </div>

        {/* Right Column */}
        <div className="lg:col-span-1 flex flex-col gap-8">
          <FreeCareerAssessmentCard  counselor={counselor} user={user}/>
          <FeaturedCollegesCard />
        </div>

      </div>
      </main>
    </div>
  );
}