import { Star, ChevronRight, Info } from 'lucide-react';
import React, { useState } from 'react';
import type { CounselorReview } from '@/types/counselorReview';
import toast from 'react-hot-toast';

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

interface CounselorReviewsProps {
  reviews: CounselorReview[];
  isSubscribed: boolean;
  counsellorId: string;
  onSubmitReview: (reviewText: string, rating: number) => Promise<void>;
}

export function CounselorReviews({ reviews,isSubscribed, onSubmitReview }: CounselorReviewsProps) {
  const [userRating, setUserRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleLocalSubmit = async () => {
    if (userRating === 0) {
      toast.error("Please select a rating (1-5 stars).");
      return;
    }
    if (!reviewText.trim()) {
      toast.error("Please write a review before submitting.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmitReview(reviewText, userRating);
      setUserRating(0);
      setReviewText('');
    } catch (error) {
      console.error("Submission failed in component:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-xl font-bold text-[#343C6A]">Write a Review</h2>
          {isSubscribed ? (
          <div className="mt-4 flex flex-col gap-4">
            <StarRating
              rating={userRating}
              interactive={true}
              onRatingChange={setUserRating}
            />
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
              rows={4}
              placeholder="Share your experience with this counsellor..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              disabled={isSubmitting}
            />
            <button 
              className="self-start px-6 py-2 bg-[#13097D] text-white font-semibold rounded-lg hover:bg-opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleLocalSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        ) : (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg flex items-center gap-3">
            <Info className="w-6 h-6 text-blue-500 flex-shrink-0" />
            <p className="text-sm text-blue-800">
              You must be subscribed to this counsellor to write a review.
              {/* <Link to={`/subscribe/${counsellorId}`} className="font-semibold underline ml-1 hover:text-blue-600">
                Subscribe Now
              </Link> */}
            </p>
          </div>
        )}
          {/* <a href="#" className="text-[#FA660F] text-lg font-medium underline">
              Add Review
          </a> */}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-[#343C6A]">Recent Reviews</h2>
              <a href="#" className="flex items-center gap-1 text-sm font-semibold text-[#343C6A] hover:underline">
                  See All <ChevronRight className="w-4 h-4" />
              </a>
          </div>

          <div className="mt-4">
              {reviews && reviews.length > 0 ? (
            reviews.sort((a, b) => b.timestamp.seconds - a.timestamp.seconds)
             .map((review, index) => (
              <React.Fragment key={review.reviewId}>
                {index > 0 && <hr className="my-4 border-gray-200" />}
                <div className="py-2">
                  <div className="flex justify-between items-center">
                    <StarRating rating={review.rating} />
                    <p className="text-sm text-[#343C6A]">{formatTimeAgo(review.timestamp)}</p>
                  </div>
                  <h4 className="font-semibold text-[#343C6A] mt-2">{review.userFullName}</h4>
                  <p className="text-[#232323] text-sm font-medium mt-1">{review.reviewText}</p>
                </div>
              </React.Fragment>
            ))
          ) : (
            <p className="text-sm text-gray-500 mt-4">No reviews for this counsellor yet.</p>
          )}
          </div>
      </div>
    </div>
  );
}