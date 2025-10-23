import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/AuthStore';
import { getUserReviews, updateUserReview } from '@/api/review';
import type { Review } from '@/types/review';
import ReviewCard from './ReviewCard';
import EditReviewModal from './EditReviewModal';
import { Loader2, MessageSquareOff } from 'lucide-react';
import toast from 'react-hot-toast';

const ReviewsTab: React.FC = () => {
  const { userId } = useAuthStore();
  const token = localStorage.getItem('jwt');
  
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingReview, setEditingReview] = useState<Review | null>(null);

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

  const handleEditClick = (review: Review) => {
    setEditingReview(review);
  };

  const handleUpdateReview = async (updatedData: { reviewText: string; rating: number }) => {
    if (!editingReview || !token || !userId) {
      toast.error("An error occurred. Please try again.");
      return;
    }

    const payload = {
      ...updatedData,
      reviewId: editingReview.reviewId,
      userId: userId,
      counsellorId: editingReview.counsellorName,
    };

    const loadingToastId = toast.loading("Updating review...");

    try {
      await updateUserReview(payload, token);
        setReviews(prevReviews =>
        prevReviews.map(r =>
          r.reviewId === editingReview.reviewId
            ? { ...r, ...updatedData }
            : r
        )
      );
      
      toast.dismiss(loadingToastId);
      toast.success("Review updated successfully!");
      setEditingReview(null);
    } catch (err) {
      toast.dismiss(loadingToastId);
      toast.error(err instanceof Error ? err.message : "Failed to update review.");
      throw err;
    }
  };

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
                    <ReviewCard key={review.reviewId} review={review} onEdit={handleEditClick}/>
                ))}
            </div>
        ) : (
            <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
              <MessageSquareOff className="w-16 h-16" />
              <h3 className="text-lg font-semibold text-gray-700">No Reviews Found</h3>
               <p className="text-gray-500 mt-2">You haven't written any reviews yet.</p>
            </div>
        )}
        {editingReview && (
        <EditReviewModal
          isOpen={!!editingReview}
          review={editingReview}
          onClose={() => setEditingReview(null)}
          onUpdate={handleUpdateReview}
        />
      )}
    </div>
  );
};

export default ReviewsTab;