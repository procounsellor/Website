import { Star, ChevronRight } from 'lucide-react';
import React, { useState } from 'react';

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

const mockReviews = [
  { name: 'Rahul Singh', time: '1 week ago', rating: 5, text: 'Very insightful session — explained admission options clearly and suggested practical next steps that I could follow.' },
    { name: 'Priya Sharma', time: '2 weeks ago', rating: 4, text: 'Very helpful and provided clear guidance for my career path. Highly recommended!' },
];

export function CounselorReviews() {
  const [userRating, setUserRating] = useState(0);

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-xl font-bold text-[#343C6A]">Write a Review</h2>
          <div className="mt-2 mb-2">
              <StarRating
                rating={userRating}
                interactive={true}
                onRatingChange={setUserRating}
              />
          </div>
          <a href="#" className="text-[#FA660F] text-lg font-medium underline">
              Add Review
          </a>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-[#343C6A]">Recent Reviews</h2>
              <a href="#" className="flex items-center gap-1 text-sm font-semibold text-[#343C6A] hover:underline">
                  See All <ChevronRight className="w-4 h-4" />
              </a>
          </div>

          <div className="mt-4">
              {mockReviews.map((review, index) => (
                <React.Fragment key={index}>
                  {index > 0 && <hr className="my-4 border-gray-200" />}
                  <div className="py-2">
                      <div className="flex justify-between items-center">
                          <StarRating rating={review.rating} />
                          <p className="text-sm text-[#343C6A]">{review.time}</p>
                      </div>
                      <h4 className="font-semibold text-[#343C6A] mt-2">{review.name}</h4>
                      <p className="text-[#232323] text-sm font-medium mt-1">{review.text}</p>
                  </div>
                </React.Fragment>
              ))}
          </div>
      </div>
    </div>
  );
}