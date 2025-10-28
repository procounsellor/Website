import { useMemo } from 'react';
import { Star, Loader2 } from 'lucide-react';
import { getReviewsForCounselor } from '@/api/counselor-Dashboard';
import type { User } from '@/types/user';
import ReviewCard from './ReviewCard';
import { useQuery } from '@tanstack/react-query';

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
}

export default function ReviewsTab({ user, token }: Props) {
  const { 
    data: reviews = [],
    isLoading: loading, 
    error 
  } = useQuery({
    queryKey: ['counselorReviews', user.userName],
    queryFn: () => getReviewsForCounselor(user.userName, token),
    enabled: !!user.userName && !!token,
  });

  const { overallRating, totalReviews } = useMemo(() => {
    if (!reviews || reviews.length === 0) {
      return { overallRating: 0, totalReviews: 0 };
    }
    const total = reviews.reduce((acc, review) => acc + review.rating, 0);
    return {
      overallRating: total / reviews.length,
      totalReviews: reviews.length,
    };
  }, [reviews]);

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
    <div className="bg-white p-6 rounded-2xl border border-[#EFEFEF]">
      <div className="flex justify-between items-center">
        <h3 className="ml-7 font-medium text-lg text-[#13097D]">My Reviews</h3>
      </div>

      <div className="mt-5 ml-7 flex items-center gap-2">
        <p className="font-semibold text-lg text-[#FFD700]">{overallRating.toFixed(1)}</p>
        <StarRatingSummary rating={overallRating} />
      </div>
      <p className="ml-7 text-sm font-medium text-[#232323]">{totalReviews} reviews</p>

      <div className="mt-8">
        {reviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reviews.map(review => (
                    <ReviewCard key={review.id} review={review} />
                ))}
            </div>
        ) : (
            <div className="text-center py-16 text-gray-500">No reviews found yet.</div>
        )}
      </div>
    </div>
  );
}