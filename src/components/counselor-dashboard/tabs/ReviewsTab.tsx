import { useState } from 'react';
import { Star, Loader2, ChevronRight } from 'lucide-react';
import { getReviewsForCounselor } from '@/api/counselor-Dashboard';
import type { User } from '@/types/user';
import ReviewCard from '../cards/ReviewCard';
import { useQuery } from '@tanstack/react-query';
import AllReviewsModal from './../modals/AllReviewsModal';

const StarRatingSummary = ({ rating }: { rating: number }) => (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={20}
          className={star <= Math.round(rating) ? 'text-[#FFD700] fill-current' : 'text-gray-300'}
        />
      ))}
    </div>
);

interface Props {
  user: User;
  token: string;
  counselorRating: number;
}

export default function ReviewsTab({ user, token, counselorRating }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { 
    data: reviews = [],
    isLoading: loading, 
    error 
  } = useQuery({
    queryKey: ['counselorReviews', user.userName],
    queryFn: () => getReviewsForCounselor(user.userName, token),
    enabled: !!user.userName && !!token,
  });

  const totalReviews = reviews.length;
  const overallRating = counselorRating || 0;

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 bg-white rounded-2xl">
        <Loader2 className="w-8 h-8 animate-spin text-[#13097D]" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-16 text-red-500 bg-white rounded-2xl">{(error as Error).message}</div>;
  }

  return (
    <>
      <div className="bg-white p-6 rounded-2xl border border-[#EFEFEF]">
        <div className="flex justify-between items-center">
          <h3 className="ml-7 font-medium text-lg text-[#13097D]">My Reviews</h3>
            <button 
            onClick={() => setIsModalOpen(true)}
            disabled={totalReviews === 0}
            className="mr-7 text-sm font-medium hover:cursor-pointer text-[#FA660F] hover:underline flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>See All</span>
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="mt-5 ml-7 flex items-center gap-2">
          <p className="font-semibold text-lg text-[#FFD700]">{overallRating.toFixed(1)}</p>
          <StarRatingSummary rating={overallRating} />
        </div>
        <p className="ml-7 text-sm font-medium text-[#232323]">{totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}</p>

        <div className="mt-8">
          {reviews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {reviews.slice(0, 6).map(review => (
                      <ReviewCard key={review.reviewId} review={review} />
                  ))}
              </div>
          ) : (
              <div className="text-center py-16 text-gray-500">No reviews found yet.</div>
          )}
        </div>
      </div>

      <AllReviewsModal 
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        reviews={reviews}
      />
    </>
  );
}