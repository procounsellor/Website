import type { AllCounselor } from "@/types/academic";
import { Star } from "lucide-react";

interface ChatbotCounselorCardProps {
  counselor: AllCounselor;
}

export function ChatbotCounselorCard({ counselor }: ChatbotCounselorCardProps) {
  return (
    <div className="bg-white rounded-lg w-[250px] shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 ">
      <div className="flex items-center p-3">
        <img
          src={counselor.photoUrlSmall || '/default-avatar.jpg'}
          alt={`${counselor.firstName} ${counselor.lastName}`}
          className="w-16 h-16 rounded-full object-cover mr-4"
        />
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800">
            {counselor.firstName} {counselor.lastName}
          </h3>
          <p className="text-sm text-gray-500">{counselor.city}</p>
          <div className="flex items-center mt-1 text-xs text-gray-600">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
            <span>{counselor.rating}</span>
            <span className="mx-2">|</span>
            <span>{counselor.experience} Yrs Exp</span>
          </div>
        </div>
      </div>
    </div>
  );
}