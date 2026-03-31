import { Star } from "lucide-react";

interface RatingBadgeProps {
  rating?: string | number;
}

export default function RatingBadge({ rating = "4.8" }: RatingBadgeProps) {
  const numericRating = Number(rating);
  const displayRating = Number.isFinite(numericRating)
    ? numericRating.toFixed(1)
    : "0.0";

  return (
    <div className="absolute top-2 left-2 bg-white/90 rounded-full px-2 py-1 flex items-center gap-1 shadow-[0_8px_20px_-14px_rgba(14,22,41,0.65)]">
      <Star className="w-3.5 h-3.5 text-[#F59E0B] fill-[#F59E0B]" />
      <p className="text-[12px] font-medium text-[#0E1629]">{displayRating}</p>
    </div>
  );
}
