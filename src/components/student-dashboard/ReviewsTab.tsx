import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/AuthStore';
import { getUserReviews } from '@/api/review';
import type { Review } from '@/types/review';
import ReviewCard from './ReviewCard';
import { Loader2 } from 'lucide-react';

const ReviewsTab: React.FC = () => {
  const { userId } = useAuthStore();
  const token = localStorage.getItem('jwt');
  
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!userId || !token) {
        setError("User not authenticated.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const userReviews = await getUserReviews(userId, token);
        userReviews.sort((a, b) => b.timestamp.seconds - a.timestamp.seconds);
        setReviews(userReviews);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch reviews.');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [userId, token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[#13097D]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16 bg-white rounded-xl border border-red-200">
        <h3 className="text-lg font-semibold text-red-600">Error</h3>
        <p className="text-gray-500 mt-2">{error}</p>
      </div>
    );
  }

  return (
    <div>
        <h2 className="text-base font-medium text-[#13097D] mb-4">My Reviews</h2>
        {reviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reviews.map((review) => (
                    <ReviewCard key={review.reviewId} review={review} />
                ))}
            </div>
        ) : (
            <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-700">No Reviews Found</h3>
                <p className="text-gray-500 mt-2">You haven't written any reviews yet.</p>
            </div>
        )}
    </div>
  );
};

export default ReviewsTab;