import { useState, useEffect } from 'react';
import type { Review } from '@/types/review';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';

const StarRatingInput = ({
  rating,
  onRatingChange,
}: {
  rating: number;
  onRatingChange: (newRating: number) => void;
}) => {
  const [hoverRating, setHoverRating] = useState(0);
  const displayRating = hoverRating || rating;

  return (
    <div
      className="flex justify-center gap-3"
      onMouseLeave={() => setHoverRating(0)}
    >
      {[1, 2, 3, 4, 5].map((starIndex) => (
        <svg
          key={starIndex}
          onClick={() => onRatingChange(starIndex)}
          onMouseEnter={() => setHoverRating(starIndex)}
          className={`w-[32px] h-[32px] cursor-pointer transition-colors`}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M16 23.1818L6.11111 29.3333L9.22222 18.0606L0.333334 10.6667L11.7222 10.0505L16 0L20.2778 10.0505L31.6667 10.6667L22.7778 18.0606L25.8889 29.3333L16 23.1818Z"
            fill={starIndex <= displayRating ? "#FFC107" : "#E0E0E0"}
            stroke="#000000"
            strokeWidth="1"
          />
        </svg>
      ))}
    </div>
  );
};

interface EditReviewModalProps {
  review: Review;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedData: { reviewText: string; rating: number }) => Promise<void>;
}

const EditReviewModal: React.FC<EditReviewModalProps> = ({ review, isOpen, onClose, onUpdate }) => {
  const [rating, setRating] = useState(review.rating);
  const [reviewText, setReviewText] = useState(review.reviewText);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setRating(review.rating);
    setReviewText(review.reviewText);
  }, [review]);

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("Please select a rating.");
      return;
    }
    if (!reviewText.trim()) {
      toast.error("Please enter your review text.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onUpdate({ reviewText, rating });
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;
  const isButtonEnabled = rating > 0 && reviewText.trim().length > 0 && !isSubmitting;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#232323]/50 backdrop-blur-[35px]"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl border border-[#EFEFEF] shadow-xl w-[632px] h-[440px] p-6 relative flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-transparent text-black flex items-center justify-center transition-colors hover:bg-black hover:text-white"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-semibold text-[#343C6A] mt-8">
          Tap to rate
        </h2>

        <div className="mt-5">
          <StarRatingInput rating={rating} onRatingChange={setRating} />
        </div>

        <p className="mt-3.5 text-base font-medium text-[#232323]">
          Rate out of 5
        </p>

        <h3 className="mt-3.5 text-base font-semibold text-[#343C6A]">
          Tell us more
        </h3>

        <textarea
          className="w-[548px] h-[132px] mt-4 p-4 bg-[#F5F5F5] border border-[#EFEFEF] rounded-2xl placeholder-[#23232380] text-base font-semibold focus:outline-none focus:ring-2 focus:ring-[#13097D]"
          placeholder="Write your review..."
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          disabled={isSubmitting}
        />

        <button
          onClick={handleSubmit}
          disabled={!isButtonEnabled}
          className={`w-[548px] h-12 mt-5 rounded-xl font-semibold text-white text-base transition-colors
            ${isButtonEnabled
              ? 'bg-[#13097D] hover:bg-opacity-90'
              : 'bg-[#ACACAC] cursor-not-allowed'
            }`}
        >
          {isSubmitting ? "Saving..." : "Submit Review"}
        </button>
      </div>
    </div>
  );
};

export default EditReviewModal;

