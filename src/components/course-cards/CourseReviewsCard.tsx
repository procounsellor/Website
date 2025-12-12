import { Star, ChevronRight, Info, X, ChevronLeft } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { addCourseReview } from '@/api/course';
import { useAuthStore } from '@/store/AuthStore';
import toast from 'react-hot-toast';

interface CourseReview {
  reviewId: string;
  userId: string;
  userFullName: string;
  userPhotoUrl?: string;
  rating: number;
  reviewText: string;
  timestamp: {
    seconds: number;
    nanos: number;
  };
  helpful: number;
}

const StarRating = ({
  rating,
  interactive = false,
  onRatingChange,
}: {
  rating: number;
  interactive?: boolean;
  onRatingChange?: (newRating: number) => void;
}) => {
  const [hoverRating, setHoverRating] = useState(0);
  const displayRating = hoverRating || rating;

  const handleMouseEnter = (starIndex: number) => {
    if (interactive) {
      setHoverRating(starIndex);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(0);
    }
  };

  const handleClick = (starIndex: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(starIndex);
    }
  };

  return (
    <div
      className={`flex gap-3 ${interactive ? 'cursor-pointer' : ''}`}
      onMouseLeave={handleMouseLeave}
    >
      {[1, 2, 3, 4, 5].map((starIndex) => (
        <Star
          key={starIndex}
          className={`w-6 h-6 transition-colors ${
            starIndex <= displayRating
              ? 'text-yellow-400 fill-current'
              : 'text-gray-300'
          }`}
          onMouseEnter={() => handleMouseEnter(starIndex)}
          onClick={() => handleClick(starIndex)}
        />
      ))}
    </div>
  );
};

const formatTimeAgo = (timestamp: { seconds: number; nanos: number }) => {
  const date = new Date(timestamp.seconds * 1000);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const years = Math.floor(diffInSeconds / 31536000);
  if (years > 0) return `${years} year${years > 1 ? 's' : ''} ago`;
  
  const months = Math.floor(diffInSeconds / 2592000);
  if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago`;

  const days = Math.floor(diffInSeconds / 86400);
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  
  const hours = Math.floor(diffInSeconds / 3600);
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;

  return 'just now';
};



interface CourseReviewsCardProps {
  courseId: string;
  isPurchased?: boolean;
  role?: 'user'| 'student' | 'counselor';
  reviews?: any[];
  rating?: number | null;
  onReviewSubmitted?: () => void;
}

export default function CourseReviewsCard({ 
  courseId,
  isPurchased = false,
  role,
  reviews: propReviews = [],
  rating: courseRating,
  onReviewSubmitted
}: CourseReviewsCardProps) {
  const [userRating, setUserRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAllReviewsModal, setShowAllReviewsModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [userHasReviewed, setUserHasReviewed] = useState(false);
  const [helpfulReviews, setHelpfulReviews] = useState<Set<string>>(new Set());
  const reviewsPerPage = 10;

  const reviews = propReviews.length > 0 ? propReviews : [];
  const { userId } = useAuthStore();

  // Check if user already reviewed this course
  useEffect(() => {
    if (userId && reviews.length > 0) {
      const existingReview = reviews.find(r => r.userId === userId);
      if (existingReview) {
        setUserHasReviewed(true);
        setUserRating(existingReview.rating);
        setReviewText(existingReview.reviewText);
      }
    }
  }, [userId, reviews]);

  const handleSubmitReview = async () => {
    if (userRating === 0) {
      toast.error('Please select a rating (1-5 stars)');
      return;
    }
    if (!reviewText.trim()) {
      toast.error('Please write a review before submitting');
      return;
    }

    if (!userId) {
      toast.error('Please sign in to submit a review');
      return;
    }

    setIsSubmitting(true);
    try {
      await addCourseReview({
        userId,
        courseId,
        rating: userRating,
        reviewText: reviewText.trim(),
      });
      
      toast.success('Review submitted successfully!');
      setUserHasReviewed(true);
      
      // Refresh reviews
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
    } catch (error) {
      console.error('Failed to submit review:', error);
      toast.error((error as Error).message || 'Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleHelpful = (reviewId: string) => {
    setHelpfulReviews(prev => {
      const newSet = new Set(prev);
      if (newSet.has(reviewId)) {
        newSet.delete(reviewId);
      } else {
        newSet.add(reviewId);
      }
      return newSet;
    });
  };

  const renderReviewForm = () => {
    // Counsellors cannot write reviews
    if (role === 'counselor') {
      return (
        <div className="mt-4 p-4 bg-amber-50 rounded-lg flex items-center gap-3">
          <Info className="w-6 h-6 text-amber-500 shrink-0" />
          <p className="text-sm text-amber-800">
            Counsellors cannot write reviews for courses.
          </p>
        </div>
      );
    }

    if (!isPurchased) {
      return (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg flex items-center gap-3">
          <Info className="w-6 h-6 text-blue-500 shrink-0" />
          <p className="text-sm text-blue-800">
            You must purchase this course to write a review.
          </p>
        </div>
      );
    }

    if (userHasReviewed) {
      return (
        <div className="mt-4 flex flex-col gap-4">
          <StarRating rating={userRating} interactive={false} />
          <p className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg min-h-[100px] text-gray-800">
            {reviewText}
          </p>
          <button
            className="self-start px-6 py-2 bg-[#13097D] text-white font-semibold rounded-lg hover:bg-gray-700 transition"
            onClick={() => setUserHasReviewed(false)}
          >
            Edit Review
          </button>
        </div>
      );
    }

    return (
      <div className="mt-4 flex flex-col gap-4">
        <StarRating
          rating={userRating}
          interactive={true}
          onRatingChange={setUserRating}
        />
        <textarea
          className="w-full p-3 border border-gray-300 rounded-lg transition focus:ring-2 focus:ring-[#13097D] focus:border-transparent"
          rows={4}
          placeholder="Share your experience with this course..."
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          disabled={isSubmitting}
        />
        <button
          className="self-start px-6 py-2 bg-[#13097D] text-white font-semibold rounded-lg hover:cursor-pointer hover:bg-opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleSubmitReview}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </div>
    );
  };

  const displayedReviews = reviews.slice(0, 5);
  
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);
  const startIndex = (currentPage - 1) * reviewsPerPage;
  const paginatedReviews = reviews.slice(startIndex, startIndex + reviewsPerPage);

  const renderReviewItem = (review: CourseReview, index: number, showDivider: boolean) => (
    <React.Fragment key={review.reviewId}>
      {showDivider && index > 0 && <hr className="my-4 border-gray-200" />}
      <div className="py-2">
        <div className="flex items-start gap-3">
          <img 
            src={review.userPhotoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.userFullName)}&background=13097D&color=fff&size=128`} 
            alt={review.userFullName} 
            className="w-12 h-12 rounded-full object-cover shrink-0 border-2 border-gray-200"
          />
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start gap-2 mb-2">
              <h4 className="font-semibold text-[#343C6A] text-base">
                {review.userFullName}
              </h4>
              <p className="text-xs text-gray-500 whitespace-nowrap">{formatTimeAgo(review.timestamp)}</p>
            </div>
            <StarRating rating={review.rating} />
            <p className="text-[#232323] text-sm font-normal mt-2 leading-relaxed">{review.reviewText}</p>
            {role !== 'counselor' && (
              <div className="mt-3 flex items-center gap-4">
                <button
                  onClick={() => handleHelpful(review.reviewId)}
                  className={`text-xs font-medium transition-colors ${
                    helpfulReviews.has(review.reviewId)
                      ? 'text-[#13097D]'
                      : 'text-gray-500 hover:text-[#13097D]'
                  }`}
                >
                  👍 Helpful ({review.helpful + (helpfulReviews.has(review.reviewId) ? 1 : 0)})
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </React.Fragment>
  );

  // Calculate average rating
  const averageRating = courseRating !== null && courseRating !== undefined
    ? courseRating.toFixed(1)
    : reviews.length > 0 
      ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
      : '0.0';

  // Calculate rating distribution
  const ratingDistribution = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length,
    percentage: reviews.length > 0 
      ? Math.round((reviews.filter(r => r.rating === star).length / reviews.length) * 100)
      : 0,
  }));

  return (
    <div className="flex flex-col gap-8">
      {/* Rating Summary */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-xl font-bold text-[#343C6A] mb-4">Course Rating</h2>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex flex-col items-center justify-center p-6 bg-linear-to-br from-[#13097D] to-[#1a0fa3] rounded-xl text-white">
            <div className="text-5xl font-bold mb-2">{averageRating}</div>
            <StarRating rating={parseFloat(averageRating)} />
            <p className="text-sm mt-2 opacity-90">{reviews.length} reviews</p>
          </div>
          <div className="flex-1 space-y-2">
            {ratingDistribution.map(({ star, count, percentage }) => (
              <div key={star} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-16">
                  <span className="text-sm font-medium text-gray-700">{star}</span>
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                </div>
                <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-yellow-400 transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 w-12 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Write Review Section - Hidden for counsellors */}
      {role !== 'counselor' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-xl font-bold text-[#343C6A]">
            {userHasReviewed ? 'Your Review' : 'Write a Review'}
          </h2>
          {renderReviewForm()}
        </div>
      )}

      {/* Recent Reviews */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-[#343C6A]">Recent Reviews</h2>
          <button 
            onClick={() => setShowAllReviewsModal(true)}
            className="flex items-center gap-1 text-sm font-semibold text-[#343C6A] hover:underline hover:cursor-pointer"
          >
            See All <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-4">
          {displayedReviews && displayedReviews.length > 0 ? (
            displayedReviews.map((review, index) => renderReviewItem(review, index, true))
          ) : (
            <p className="text-sm text-gray-500 mt-4">
              No reviews for this course yet. Be the first to review!
            </p>
          )}
        </div>
      </div>

      {/* All Reviews Modal */}
      {showAllReviewsModal && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-md z-50 flex items-center justify-center p-4"
          onClick={() => {
            setShowAllReviewsModal(false);
            setCurrentPage(1);
          }}
        >
          <div 
            className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 md:p-6 border-b border-gray-200">
              <h2 className="text-xl md:text-2xl font-bold text-[#343C6A]">All Reviews ({reviews.length})</h2>
              <button 
                onClick={() => {
                  setShowAllReviewsModal(false);
                  setCurrentPage(1);
                }}
                className="text-gray-500 hover:text-gray-700 transition hover:cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body - Scrollable */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6">
              {paginatedReviews
                .sort((a, b) => b.timestamp.seconds - a.timestamp.seconds)
                .map((review, index) => renderReviewItem(review, index, true))
              }
            </div>

            {/* Modal Footer - Pagination */}
            {totalPages > 1 && (
              <div className="border-t border-gray-200 p-4 md:p-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-sm text-gray-600">
                    Showing {startIndex + 1} to {Math.min(startIndex + reviewsPerPage, reviews.length)} of {reviews.length} reviews
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-1"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span className="hidden sm:inline">Previous</span>
                    </button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                            currentPage === page
                              ? 'bg-[#13097D] text-white'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-1"
                    >
                      <span className="hidden sm:inline">Next</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}