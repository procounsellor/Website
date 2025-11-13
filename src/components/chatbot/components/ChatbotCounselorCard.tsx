import type { AllCounselor } from "@/types/academic";
import { Star } from "lucide-react";

interface ChatbotCounselorCardProps {
  counselor: AllCounselor;
}

export function ChatbotCounselorCard({ counselor }: ChatbotCounselorCardProps) {
  return (
    <div className="bg-[#2a2a2a] rounded-lg w-full md:w-[250px] shadow-md border border-[#404040] overflow-hidden hover:shadow-xl hover:border-[#FF660F]/50 transition-all duration-300">
      <div className="flex items-center p-2 md:p-4">
        <img
          src={counselor.photoUrlSmall || '/default-avatar.jpg'}
          alt={`${counselor.firstName} ${counselor.lastName}`}
          className="w-10 h-10 md:w-16 md:h-16 rounded-full object-cover mr-2 md:mr-4 ring-2 ring-[#404040] flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white text-xs md:text-base truncate leading-tight">
            {counselor.firstName} {counselor.lastName}
          </h3>
          <p className="text-[10px] md:text-sm text-gray-400 truncate whitespace-nowrap overflow-hidden text-ellipsis leading-tight">{counselor.city}</p>
          <div className="flex items-center mt-0.5 md:mt-1 text-[10px] md:text-xs text-gray-400 whitespace-nowrap">
            <Star className="w-2.5 h-2.5 md:w-4 md:h-4 text-yellow-400 fill-yellow-400 mr-0.5 md:mr-1 flex-shrink-0" />
            <span className="truncate">{counselor.rating}</span>
            <span className="mx-1">|</span>
            <span className="truncate">{counselor.experience} Yrs</span>
          </div>
        </div>
      </div>
    </div>
  );
}