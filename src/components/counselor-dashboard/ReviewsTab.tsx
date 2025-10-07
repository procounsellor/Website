import { Star } from 'lucide-react';
import type { ReviewReceived } from '@/types/counselorDashboard';
import ReviewCard from './ReviewCard';

const dummyReviews: ReviewReceived[] = [
    { id: '1', userName: 'Sarah Khan', userImageUrl: '/profile2.jpg', rating: 5, text: 'Lorem ipsum dolor sit amet consectetur. Lectus quam egestas ut odio.', timeAgo: '1 week ago' },
    { id: '2', userName: 'Shubhash Ghai', userImageUrl: '/profile1.jpg', rating: 4, text: 'Condimentum rutrum a tem por netus volutpat. Duis laoreet commodo venena.', timeAgo: '2 weeks ago' },
    { id: '3', userName: 'Priya Sharma', userImageUrl: '/profile2.jpg', rating: 5, text: 'Very insightful and helpful session.', timeAgo: '3 weeks ago' },
    { id: '4', userName: 'Amit Singh', userImageUrl: '/profile1.jpg', rating: 5, text: 'Lorem ipsum dolor sit amet consectetur. Lectus quam egestas ut odio.', timeAgo: '1 month ago' },
    { id: '5', userName: 'Jennifer', userImageUrl: '/profile2.jpg', rating: 4, text: 'Condimentum rutrum a tem por netus volutpat. Duis laoreet commodo venena.', timeAgo: '1 month ago' },
    { id: '6', userName: 'Chris Nolan', userImageUrl: '/profile1.jpg', rating: 5, text: 'Excellent guidance, highly recommend.', timeAgo: '2 months ago' },
];

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

export default function ReviewsTab() {
  const overallRating = 4.0;
  const totalReviews = 24;

  return (
    <div className="bg-white p-6 rounded-2xl border border-[#EFEFEF]">
      <div className="flex justify-between items-center">
        <h3 className="ml-7 font-medium text-lg text-[#13097D]">My Reviews</h3>
        <button className="font-medium text-sm text-[#FA660F]">See All</button>
      </div>

      <div className="mt-5 ml-7 flex items-center gap-2">
        <p className="font-semibold text-lg text-[#FFD700]">{overallRating.toFixed(1)}</p>
        <StarRatingSummary rating={overallRating} />
      </div>
      <p className="ml-7 text-sm font-medium text-[#232323]">{totalReviews} reviews</p>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dummyReviews.map(review => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
}