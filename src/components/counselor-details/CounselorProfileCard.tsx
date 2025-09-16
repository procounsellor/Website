import type { AllCounselor } from '@/types/academic';
import { Bookmark, Briefcase, Languages, Lock } from 'lucide-react';

type Props = {
  counselor: AllCounselor;
};

export function CounselorProfileCard({ counselor }: Props) {
  const fullName = `${counselor.firstName} ${counselor.lastName}`;
  const imageUrl = counselor.photoUrlSmall || `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=E0E7FF&color=4F46E5&size=128`;
  const basePrice = counselor.ratePerYear || 5000;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row gap-6">
        <img src={imageUrl} alt={fullName} className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white shadow-md mx-auto sm:mx-0" />
        <div className="flex-1 text-center sm:text-left">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-[#343C6A]">{fullName}</h1>
              <p className="text-md text-[#718EBF] mt-1">{counselor.city || "Location not specified"}</p>
            </div>
            <button className="p-2 text-blue-600 hover:text-blue-800">
              <Bookmark className="w-6 h-6" />
            </button>
          </div>
          <div className="mt-4 flex items-center justify-center sm:justify-start gap-x-8 gap-y-4 text-gray-700">
            {/* Experience Block */}
            <div className="flex items-center gap-3">
              <Briefcase className="w-8 h-8 text-blue-500" />
              <div>
                <span className="font-semibold block">{counselor.experience || 'N/A'} Years</span>
                <span className="text-sm text-gray-500">of experience</span>
              </div>
            </div>
            {/* Languages Known Block */}
            <div className="flex items-center gap-3">
              <Languages className="w-8 h-8 text-blue-500" />
              <div>
                <span className="font-semibold block">Languages Known</span>
                <span className="text-sm text-gray-500">{counselor.languagesKnow?.join(', ') || 'English'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <hr className="my-6 border-gray-200" />
      <div className="mt-6">
        <h3 className="font-semibold text-gray-700">Subscription Plans</h3>
        <div className="mt-3 flex flex-col sm:flex-row gap-3">
            <button className="flex h-[50px] flex-1 cursor-pointer flex-col items-center justify-center rounded-xl border border-transparent bg-gradient-to-r from-[rgba(222,237,255,0.4)] to-[rgba(126,136,211,0.4)] shadow-sm transition-all duration-200 hover:border-[#4B65B5] hover:shadow-md hover:-translate-y-0.5">
              <span className="font-semibold text-sm text-[#1447E7]">Plus</span>
              <span className="text-[#1447E7] text-sm font-bold">₹{basePrice.toLocaleString("en-IN")}</span>
            </button>
            <button className="flex h-[50px] flex-1 cursor-pointer flex-col items-center justify-center rounded-xl border border-transparent bg-gradient-to-r from-[rgba(244,232,255,0.4)] to-[rgba(250,244,255,0.4)] shadow-sm transition-all duration-200 hover:border-[#8A4DBF] hover:shadow-md hover:-translate-y-0.5">
              <span className="font-semibold text-[#8200DA] text-sm">Pro</span>
              <span className="text-[#8200DA] text-sm font-bold">₹{(basePrice * 5).toLocaleString("en-IN")}</span>
            </button>
            <button className="flex h-[50px] flex-1 cursor-pointer flex-col items-center justify-center rounded-xl border border-transparent bg-gradient-to-r from-[rgba(255,245,206,0.4)] to-[rgba(255,250,230,0.4)] shadow-sm transition-all duration-200 hover:border-[#D4AF37] hover:shadow-md hover:-translate-y-0.5">
              <span className="font-semibold text-[#B94C00] text-sm">Elite</span>
              <span className="text-[#B94C00] text-sm font-bold">₹{(basePrice * 20).toLocaleString("en-IN")}</span>
            </button>
        </div>
      </div>
      <div className="mt-6 flex flex-col sm:flex-row gap-3 items-center">
        <button disabled className="w-full sm:w-auto flex items-center justify-center border gap-2 px-14 py-3 text-[#B2B9C5] bg-[#F9FAFC] rounded-lg cursor-not-allowed">
          <Lock className="w-4 h-4 text-[#B2B9C5]"/> Chat
        </button>
        <button disabled className="w-full sm:w-auto flex items-center justify-center border gap-2 px-14 py-3 text-[#B2B9C5] bg-[#F9FAFC] rounded-lg cursor-not-allowed">
          <Lock className="w-4 h-4 text-[#B2B9C5]"/> Call
        </button>
        <button className="w-full sm:flex-1 bg-[#3537B4] text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors">
          Subscribe Now
        </button>
      </div>
      <p className="mt-3 text-xs text-center text-[#232323] flex items-center justify-center gap-1">
        <Lock className="w-3 h-3" /> Subscribe to unlock chat and call features
      </p>
    </div>
  );
}