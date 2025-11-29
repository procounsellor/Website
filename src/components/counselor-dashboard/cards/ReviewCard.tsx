import { Star } from 'lucide-react';
import type { ReviewReceived } from '@/types/counselorDashboard';

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        size={24}
        className={star <= rating ? 'text-[#FFD700] fill-current' : 'text-gray-300'}
      />
    ))}
  </div>
);

interface ReviewCardProps {
  review: ReviewReceived;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="bg-[#F9FAFB] rounded-2xl p-4 shadow-[0px_0px_4px_0px_#23232326] h-[170px] flex flex-col">
      <div className="flex items-start gap-4">
        <img 
          src={review.userImageUrl ||  `https://ui-avatars.com/api/?name=${review.userFullName}`} 
          alt={review.userFullName}
          className="w-[55px] h-[55px] rounded-full object-cover"
        />
        <div>
          <h4 className="font-semibold text-xl text-[#343C6A]">{review.userFullName}</h4>
          <div className="mt-1">
            <StarRating rating={review.rating} />
          </div>
        </div>
      </div>
      <p className="mt-4 text-sm text-[#232323] font-medium leading-tight flex-grow">
        {review.reviewText}
      </p>
      <p className="mt-auto text-xs text-[#C3C3C3] font-medium">{review.timeAgo}</p>
    </div>
  );
}