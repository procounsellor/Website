import { Flame } from 'lucide-react';

export function FreeCareerAssessmentCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2">
            <h3 className="text-lg font-bold text-[#343C6A]">Free Career Assessment</h3>
            <span className="flex items-center gap-1 bg-[#FFF9D9] text-[#232323] text-xs font-semibold px-1 py-0.5 rounded-full">
                <Flame className="w-3 h-3 text-[#FFB70E]" /> Trending
            </span>
        </div>
        <p className="text-[#232323] mt-1 font-medium text-sm text-left">30-minute discovery session</p>
        <button className="mt-4 w-full bg-[#FA660F] text-white font-semibold py-2.5 rounded-lg hover:bg-orange-600 transition-colors">
            Book Appointment Now
        </button>
        <p className="text-xs text-[#3537B4] mt-2">Discover the approach to a brighter future</p>
    </div>
  );
}