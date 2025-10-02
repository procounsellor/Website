import { Star } from "lucide-react";
import { TbBriefcase2 } from "react-icons/tb";
import type { Counsellor } from "@/types/counsellor";

interface CounselorCardProps {
  counselor: Counsellor;
}

export function DashboardCounselorCard({ counselor }: CounselorCardProps){
  const fullName = `${counselor.firstName} ${counselor.lastName}`;
  const imageUrl = counselor.photoUrlSmall || `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=random`;
  const languages = counselor.languagesKnow || [];
  const description = languages.slice(0, 2).join(' | ');

  return (
    <>
      <img
       src={imageUrl}
       alt={fullName}
       className="w-full aspect-square object-cover rounded-lg mb-3"
       onError={(e) => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=random`; }}
      />
      <div className="flex flex-col">
        <h4 className="font-semibold text-lg text-[#242645] truncate">{fullName}</h4>
        <p className="text-sm text-[#8C8CA1] truncate">{description}</p>
        <p className="text-sm text-[#8C8CA1] truncate">{counselor.city}</p>
        <div className="flex items-center text-sm text-gray-600 gap-4 my-2">
            <span className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500" fill="currentColor"/>
                {counselor.rating ?? 'N/A'} | {counselor.numberOfRatings}
            </span>
            <span className="flex items-center gap-1">
                <TbBriefcase2 className="w-4 h-4 text-blue-500"/>
                {counselor.experience ?? 'N/A'}+ Yrs
            </span>
        </div>
        <hr className="my-1"/>
        <div className="flex items-center gap-2 mt-1">
          <img src='/Procoin.jpg' alt="procoin_icon" className="w-6 h-6"/>
          <span className="text-sm font-semibold text-[#343c6a]">
            {counselor.ratePerYear?.toLocaleString('en-IN') ?? 'N/A'} ProCoins/Hour
          </span>
        </div>
      </div>
    </>
  );
}