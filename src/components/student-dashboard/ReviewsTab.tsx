import { useState } from 'react';
import { useAuthStore } from '@/store/AuthStore';
import { getUserReviews, updateUserReview } from '@/api/review';
import type { Review } from '@/types/review';
import ReviewCard from './ReviewCard';
import EditReviewModal from './EditReviewModal';
import { Loader2, MessageSquareOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const ReviewsTab: React.FC = () => {
  const { userId } = useAuthStore();
  const token = localStorage.getItem('jwt');
  const queryClient = useQueryClient();

  const [editingReview, setEditingReview] = useState<Review | null>(null);

  const {
    data: reviews = [],
    isLoading: loading,
    error: queryError,
  } = useQuery({
    queryKey: ['userReviews', userId],
    queryFn: async () => {
      const userReviews = await getUserReviews(userId!, token!);
      userReviews.sort((a, b) => b.timestamp.seconds - a.timestamp.seconds);
      return userReviews;
    },
    enabled: !!userId && !!token,
  });

  const { mutate: updateReviewMutation, isPending: isUpdating } = useMutation({
    mutationFn: (updatedData: { reviewText: string; rating: number }) => {
      if (!editingReview || !token || !userId) {
        throw new Error("Cannot update review. Missing data.");
      }
      const payload = {
        ...updatedData,
        reviewId: editingReview.reviewId,
        userId: userId,
        counsellorId: editingReview.counsellorName,
      };
      return updateUserReview(payload, token);
    },
    onSuccess: () => {
      toast.success("Review updated successfully!");
      setEditingReview(null);
      queryClient.invalidateQueries({ queryKey: ['userReviews', userId] });
    },
    onError: (err) => {
      if (! (err instanceof Error && (err.message.includes("rating") || err.message.includes("text")))) {
        toast.error(err instanceof Error ? err.message : "Failed to update review.");
      }
    }
  });


  const handleEditClick = (review: Review) => {
    setEditingReview(review);
  };

  const handleUpdateReview = async (updatedData: { reviewText: string; rating: number }) => {
    return new Promise<void>((resolve, reject) => {
        updateReviewMutation(updatedData, {
            onSuccess: () => resolve(),
            onError: (err) => reject(err),
        });
    });
  };

  const error = queryError ? (queryError as Error).message : null;

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
            <div className="text-center py-16 bg-white rounded-xl border border-gray-200 flex flex-col items-center">
              <MessageSquareOff className="w-16 h-16 text-gray-400 mb-4" />
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
          isSubmitting={isUpdating}
        />
      )}
    </div>
  );
};

export default ReviewsTab;