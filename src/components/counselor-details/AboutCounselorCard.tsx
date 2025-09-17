import type { AllCounselor } from '@/types/academic';
import { Star } from 'lucide-react';

type Props = {
  counselor: AllCounselor;
};

const specializations = [ "Career Guidance", "College Admission", "Study Abroad", "Profile Building", "Exam Strategy", "Interview Prep" ];

export function AboutCounselorCard({ counselor }: Props) {
  const rating = counselor.rating || 0;
  const reviewCount = parseInt(counselor.numberOfRatings || '0');

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-[#343C6A]">About {counselor.firstName}</h2>
            <div className="flex items-center gap-1 text-yellow-500 px-2 py-1 rounded-full">
                <Star className="w-4 h-4 fill-current" />
                <span className="font-bold text-sm">{rating.toFixed(1)}</span>
                <span className="text-xs text-yellow-700">({reviewCount})</span>
            </div>
        </div>
        <p className="text-[#718EBF] mt-2">From XYZ Organisation, {counselor.city} Office</p>
        <p className="mt-4 text-[#232323] font-medium leading-relaxed">
            Lorem ipsum dolor sit amet consectetur. Lectus q uam egestas ut odio. Condimentum rutrum a tempor netus volutpat. Duis laoreet commodo venena. This is placeholder text about the counselor's background and expertise.
        </p>

        <div className="mt-6 bg-[#F5F5F5] p-4 rounded-lg">
            <h3 className="font-semibold text-[#343C6A]">Career Specialisation</h3>
            <div className="flex flex-wrap gap-2 mt-3">
                {specializations.map(spec => (
                    <span key={spec} className="px-3 py-1 text-sm font-medium bg-white text-[#343C6A] border border-gray-200 rounded-md">
                        {spec}
                    </span>
                ))}
            </div>
        </div>
    </div>
  );
}