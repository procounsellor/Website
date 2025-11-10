import { StarIcon, Bookmark, BadgeCheck, Briefcase, MapPin, Languages } from "lucide-react";
import { Link } from "react-router-dom";

export type CounselorCardData = {
  id: string;
  name: string;
  imageUrl: string;
  rating: number;
  reviews: number;
  verified: boolean;
  specialization: string;
  location: string;
  languages: string[];
  availability: string[];
  pricing: {
    plus: number;
    pro: number;
    elite: number;
  };
};

type CounselorCardProps = {
  counselor: CounselorCardData;
  isFavourite: boolean;
  onToggleFavourite: (counsellorId: string) => void;
};

export function CounselorCard({ counselor, isFavourite, onToggleFavourite }: CounselorCardProps) {
  const handleBookmarkClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleFavourite(counselor.id);
  };

  return (
  <Link to={`/counsellor-profile`} state={{ id: counselor.id }} className="flex h-full">
    <div className="flex w-full max-w-sm flex-col overflow-hidden rounded-lg cursor-pointer border border-gray-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-lg">
      <div className="relative">
        <img
          src={counselor.imageUrl}
          alt={`Photo of ${counselor.name}`}
          className="h-60 w-full object-cover"
        />

        <div className="absolute left-4 top-4 flex h-[38px] w-auto items-center justify-center gap-1.5 rounded-full bg-[#0C111F57] px-3 py-1 text-sm text-white shadow-[inset_7px_0px_20px_0px_rgba(255,255,255,0.15)]">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FFB700]">
                <StarIcon className="h-4 w-4 text-white" fill="white" />
            </div>
            <span className="font-semibold whitespace-nowrap">{counselor.rating.toFixed(1)}</span>
        </div>
        
        <button
          onClick={handleBookmarkClick}
          aria-label="Save counselor"
          className="absolute right-4 top-4 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-black/30 backdrop-blur-md transition-colors hover:bg-black/50"
        >
          <Bookmark className={`h-4 w-4 text-white transition-colors ${isFavourite ? 'fill-current' : ''}`} />
        </button>
      </div>

      <div className="flex flex-grow flex-col gap-3 p-4 pt-3">
        <div className="flex flex-col gap-1.5">
          {counselor.verified && (
            <div className="flex items-center gap-2 font-medium text-[#3AAF3C]">
              <BadgeCheck className="h-5 w-5" />
              <span className="text-sm">Verified</span>
            </div>
          )}
          <h3 className="text-lg font-bold text-gray-800">{counselor.name}</h3>
        </div>

        <div className="flex flex-col gap-2 text-sm text-[#8C8CA1]">
          <div className="flex items-center gap-3">
            <Briefcase className="h-4 w-4 flex-shrink-0 text-[#8C8CA1]"/>
            <span>{counselor.specialization}</span>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="h-4 w-4 flex-shrink-0 text-[#8C8CA1]"/>
            <span>{counselor.location}</span>
          </div>
          <div className="flex items-center gap-3">
            <Languages className="h-4 w-4 flex-shrink-0 text-[#8C8CA1]"/>
            <span className="truncate">{counselor.languages.join(" | ")}</span>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="my-2 h-px w-full bg-gray-200"/>
          <span className="rounded-xs bg-[#EAF4FF] py-1.5 px-4 text-sm text-nowrap font-medium text-[#0077FF]">
            {counselor.availability.join(", ")}
          </span>
          <div className="my-2 h-px w-full bg-gray-200"/>
        </div>
      </div>
      
      <div className="mt-auto flex items-center justify-center gap-3 p-4 pt-0">
        <button className="flex h-[50px] flex-1 cursor-pointer flex-col items-center justify-center rounded-xl border border-transparent bg-gradient-to-r from-[rgba(222,237,255,0.4)] to-[rgba(126,136,211,0.4)] shadow-sm transition-all duration-200">
          <span className="font-semibold text-sm text-[#1447E7]">Plus</span>
          <div className="flex items-center gap-1 text-[#1447E7] text-sm">
            <img src="/coin.svg" alt="coin" className="w-3.5 h-3.5" />
            <span>{counselor.pricing.plus.toLocaleString("en-IN")}</span>
          </div>
        </button>

        <button className="flex h-[50px] flex-1 cursor-pointer flex-col items-center justify-center rounded-xl border border-transparent bg-gradient-to-r from-[rgba(244,232,255,0.4)] to-[rgba(250,244,255,0.4)] shadow-sm transition-all duration-200">
          <span className="font-semibold text-[#8200DA] text-sm">Pro</span>
          <div className="flex items-center gap-1 text-[#8200DA] text-sm">
            <img src="/coin.svg" alt="coin" className="w-3.5 h-3.5" />
            <span>{counselor.pricing.pro.toLocaleString("en-IN")}</span>
          </div>
        </button>

        <button className="flex h-[50px] flex-1 cursor-pointer flex-col items-center justify-center rounded-xl border border-transparent bg-gradient-to-r from-[rgba(255,245,206,0.4)] to-[rgba(255,250,230,0.4)] shadow-sm transition-all duration-200">
          <span className="font-semibold text-[#B94C00] text-sm">Elite</span>
          <div className="flex items-center gap-1 text-[#B94C00] text-sm">
            <img src="/coin.svg" alt="coin" className="w-3.5 h-3.5" />
            <span>{counselor.pricing.elite.toLocaleString("en-IN")}</span>
          </div>
        </button>
      </div>
    </div>
    </Link>
  );
}