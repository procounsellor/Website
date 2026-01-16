import { useParams, useLocation, useSearchParams } from 'react-router-dom';
import { useCounselorById } from '@/hooks/useCounselors';

import { CounselorProfileCard } from '@/components/counselor-details/CounselorProfileCard';
import { AboutCounselorCard } from '@/components/counselor-details/AboutCounselorCard';
import { CounselorReviews } from '@/components/counselor-details/CounselorReviews';
import CounselorCoursesCard from '@/components/counselor-details/CounselorCoursesCard';
// import { CounselorTestGroupsCard } from '@/components/counselor-details/CounselorTestGroupsCard';
import { FreeCareerAssessmentCard } from '@/components/shared/FreeCareerAssessmentCard';
// import { FeaturedCollegesCard } from '@/components/shared/FeaturedCollegesCard';
// import { LiveSessionCard } from '@/components/counselor-details/LiveSessionCard';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/AuthStore';
import { getSubscribedCounsellors, addFav, postReview, getReviewsByCounselorId } from '@/api/counsellor';
import { updateUserReview } from '@/api/review';
import toast from 'react-hot-toast';
import type { CounselorReview } from '@/types/counselorReview';
import type { SubscribedCounsellor } from '@/types/user';
import EditProfileModal from '@/components/student-dashboard/EditProfileModal';
import { updateUserProfile } from '@/api/user';
import { unlockScroll } from '@/lib/scrollLock';

type ApiSubscribedCounselor = {
  counsellorId: string;
  plan: string | null;
  subscriptionMode: string | null;
};


export default function CounselorDetailsPage() {
  const { id: paramId } = useParams<{ id: string }>();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  type LocationState = { id?: string } | undefined;
  const state = location.state as LocationState;
  const queryId = searchParams.get('id');
  const computedId = paramId || queryId || state?.id;
  const { counselor, loading, error } = useCounselorById(computedId ?? '');
  const { user, userId, refreshUser, role } = useAuthStore();
  const token = localStorage.getItem('jwt');

  const [subscriptionDetails, setSubscriptionDetails] = useState<SubscribedCounsellor | null>(null);
  const [reviews, setReviews] = useState<CounselorReview[]>([]);
  const [userReview, setUserReview] = useState<CounselorReview | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [isFavourite, setIsFavourite] = useState(false);
  const [isTogglingFavourite, setIsTogglingFavourite] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);


  useEffect(() => {
    unlockScroll();
  }, []);

  useEffect(() => {
    if (user && computedId) {
      const favIds = user.favouriteCounsellorIds || [];
      setIsFavourite(favIds.includes(computedId));
    }
  }, [user, computedId]);

  const fetchReviews = async () => {
    if (!userId || !computedId || !token) return;
    try {
      const fetchedReviews = await getReviewsByCounselorId(userId, computedId, token);
      setReviews(fetchedReviews);
      if (userId && role !== "counselor") {
        const foundReview = fetchedReviews.find(r => r.userName === userId);
        setUserReview(foundReview || null);
      } else {
        setUserReview(null);
      }
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
      setReviews([]);
      setUserReview(null);
    }
  };

  useEffect(() => {
  if (!computedId || !userId || !token) {
    setLoadingData(false);
    return;
  }

  const fetchData = async () => {
    try {
      setLoadingData(true);

      if (role === "counselor") {
        console.log("Skipping subscription and review fetch for counselor login");
        setSubscriptionDetails(null);
        setReviews([]);
        return;
      }

      const results = await Promise.allSettled([
        getSubscribedCounsellors(userId, token),
        getReviewsByCounselorId(userId, computedId, token)
      ]);

      if (results[0].status === "fulfilled") {
        const subscribedList: ApiSubscribedCounselor[] = results[0].value;
        const currentApiSubscription = subscribedList.find(c => c.counsellorId === computedId);

        if (currentApiSubscription && currentApiSubscription.plan) {
          const formattedSubscription: SubscribedCounsellor = {
            counsellorId: currentApiSubscription.counsellorId,
            plan: currentApiSubscription.plan,
            subscriptionMode: currentApiSubscription.subscriptionMode ?? "unknown",
          };
          setSubscriptionDetails(formattedSubscription);
        } else {
          setSubscriptionDetails(null);
        }
      } else {
        console.error("Failed to fetch subscription status:", results[0].reason);
      }

      if (results[1].status === "fulfilled") {
        const fetchedReviews = results[1].value;
        setReviews(fetchedReviews);
        if (userId && (role as string) !== "counselor") {
            const foundReview = fetchedReviews.find(r => r.userName === userId); 
            setUserReview(foundReview || null);
          } else {
            setUserReview(null);
          }
      } else {
        console.error("Failed to fetch reviews (this may be expected if none exist):", results[1].reason);
        setReviews([]);
        setUserReview(null);
      }

    } catch (err) {
      console.error("An unexpected error occurred in fetchData:", err);
    } finally {
      setLoadingData(false);
    }
  };

  fetchData();
}, [userId, token, computedId, role]);

  const handleProfileIncomplete = (action: () => void) =>{
    setPendingAction(() => action);
    setIsEditProfileModalOpen(true);
  };

  const handleUpdateProfile = async (updatedData: { firstName: string; lastName: string; email: string }) => {
    if(!userId || !token){
      throw new Error("User not authenticated");
    }
    await updateUserProfile(userId, updatedData, token);
    await refreshUser(true);
    if(pendingAction){
      pendingAction();
      setPendingAction(null);
    }
  };
  const handleCloseModal = () => {
    setIsEditProfileModalOpen(false);
    setPendingAction(null);
  }
  const handleSubmitReview = async (reviewText: string, rating: number) => {
    if (!userId || !computedId || !token || !user) {
      toast.error("You must be logged in to post a review.", { duration: 2000 });
      return;
    }
    const optimisticReview: CounselorReview = {
      reviewId: `temp-${Date.now()}`,
      userFullName: String(user.fullName || "Your Name"), 
      userPhotoUrl: user.photoSmall || `https://ui-avatars.com/api/?name=${user.fullName || 'U'}`,
      reviewText,
      rating,
      timestamp: {
        seconds: Math.floor(Date.now() / 1000),
        nanos: 0,
      },
      userName: userId,
    };
    setReviews(prevReviews => [optimisticReview, ...prevReviews]);
    const loadingToastId = toast.loading("Submitting review...");
    try {
      const reviewData = {
        userId,
        counsellorId: computedId,
        reviewText,
        rating,
        receiverFcmToken: null,
      };
      
      const response = await postReview({ ...reviewData, token });
      toast.dismiss(loadingToastId);
      if (response.status === 'success') {
        toast.success(response.message || "Review posted successfully!", { duration: 2000 });
        await fetchReviews();
      } else {
        throw new Error(response.message || "Failed to post review.");
      }

    } catch (err) {
      toast.dismiss(loadingToastId);
      toast.error((err as Error).message || "Could not post review.", { duration: 2000 });
      setReviews(prevReviews => prevReviews.filter(r => r.reviewId !== optimisticReview.reviewId));
      console.error("Submit Review Error:", err);
    }
  };

  const handleUpdateReview = async (reviewText: string, rating: number) => {
    if (!userId || !computedId || !token || !userReview) {
      toast.error("You must be logged in to update a review.", { duration: 2000 });
      return;
    }

    if (!userReview.reviewId) {
      toast.error("Could not find review ID to update.", { duration: 2000 });
      return;
    }

    const loadingToastId = toast.loading("Updating review...");
    try {
      const payload = {
        reviewId: userReview.reviewId,
        userId,
        counsellorId: computedId,
        reviewText,
        rating,
      };

      await updateUserReview(payload, token);
      
      toast.dismiss(loadingToastId);
      toast.success("Review updated successfully!", { duration: 2000 });

      await fetchReviews();

    } catch (err) {
      toast.dismiss(loadingToastId);
      toast.error((err as Error).message || "Could not update review.", { duration: 2000 });
      console.error("Update Review Error:", err);
    }
  };

  const handleToggleFavourite = async () => {
    const { isAuthenticated, toggleLogin } = useAuthStore.getState();
    
    const toggleFavAction = async () => {
      const freshUserId = localStorage.getItem('phone');
      const freshToken = localStorage.getItem('jwt');
      
      if (!freshUserId || !computedId || !freshToken) {
        toast.error("Could not get user ID after login. Please try again.", { duration: 2000 });
        return;
      }

      setIsTogglingFavourite(true);
      setIsFavourite(prevState => !prevState); 

      try {
        await addFav(freshUserId, computedId);
        await refreshUser(true); 
        toast.success("Favourite status updated!", { duration: 2000 });
      } catch (err) {
        setIsFavourite(prevState => !prevState); 
        toast.error("Could not update favourite status.", { duration: 2000 });
      } finally {
        setIsTogglingFavourite(false);
      }
    };

    // Check authentication first
    if (!isAuthenticated) {
      toggleLogin(toggleFavAction);
      return;
    }

    // Check profile completion
    if (!user?.firstName || !user?.email) {
      handleProfileIncomplete(toggleFavAction);
      return;
    }

    // If all checks pass, execute the action
    await toggleFavAction();
  };

  if (!computedId) {
    return <div className="p-8 text-center text-red-500">Error: Counsellor ID is missing.</div>;
  }

  if (loading || loadingData) {
    return <div className="flex h-screen items-center justify-center">Loading Counsellor Profile...</div>;
  }

  if (error || !counselor) {
    return <div className="flex h-screen items-center justify-center text-red-500">{error || "Counsellor not found."}</div>;
  }

  return (
    <div className="bg-gray-50 pt-20 md:pt-28 pb-8 px-4">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      <div className="max-w-7xl mx-auto mb-6 hidden md:block">
        <h1 className="text-2xl font-bold text-gray-800">Counsellor Profile</h1>
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
            user={user}
            onProfileIncomplete={handleProfileIncomplete}
          />
          <AboutCounselorCard counselor={counselor} />
          <CounselorReviews 
              reviews={reviews}
              isSubscribed={!!subscriptionDetails}
              counsellorId={computedId}
              onSubmitReview={handleSubmitReview}
              userReview={userReview}
              onUpdateReview={handleUpdateReview}
            />
        </div>

        {/* Right Column */}
        <div className="lg:col-span-1 flex flex-col gap-8">
          {/* <LiveSessionCard counselorName={`${counselor.firstName} ${counselor.lastName}`} /> */}
          <FreeCareerAssessmentCard  counselor={counselor} user={user} onProfileIncomplete={handleProfileIncomplete}/>
          <CounselorCoursesCard counsellorId={computedId} userRole={role || "user"} />
          {/* <FeaturedCollegesCard /> */}
        </div>

      </div>
      </main>
      {user && (
        <EditProfileModal
          isOpen={isEditProfileModalOpen}
          onClose={handleCloseModal}
          user={user}
          onUpdate={handleUpdateProfile}
          onUploadComplete={() => {}} 
        />
      )}
    </div>
  );
}