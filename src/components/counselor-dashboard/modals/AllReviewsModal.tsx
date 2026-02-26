import { X } from "lucide-react";
import ReviewCard from "../cards/ReviewCard";
import type { ApiReviewReceived } from "@/types/counselorDashboard";

interface AllReviewsModalProps {
  open: boolean;
  onClose: () => void;
  reviews: ApiReviewReceived[];
}

export default function AllReviewsModal({
  open,
  onClose,
  reviews,
}: AllReviewsModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-auto flex items-center justify-center p-4">
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-200"
        onClick={onClose}
      />

      <div 
        className="relative bg-white rounded-2xl border border-[#EFEFEF] w-full max-w-md lg:max-w-lg max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-5 border-b border-[#EFEFEF] shrink-0">
          <h3 className="font-semibold text-lg text-[#343C6A]">
            All Reviews ({reviews.length})
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black hover:cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
          <div className="flex flex-col gap-4">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <ReviewCard key={review.reviewId} review={review} />
              ))
            ) : (
              <p className="text-center text-gray-500 py-10">No reviews found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}