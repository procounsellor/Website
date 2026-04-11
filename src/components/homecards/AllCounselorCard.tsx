import { Star, Briefcase } from "lucide-react";
import type { AllCounselor } from "@/types/academic";
import SmartImage from "@/components/ui/SmartImage";

type CounselorCardProps = {
  counselor: AllCounselor;
};

const capitalizeName = (name: string) => {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export function AllCounselorCard({ counselor }: CounselorCardProps){
  const firstName = capitalizeName(counselor.firstName || 'Unknown');
  const lastName = capitalizeName(counselor.lastName || 'Counselor');
  const fullName = `${firstName} ${lastName}`;
  const imageUrl = counselor.photoUrlSmall || `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=6B7280&color=ffffff&size=400`;
  const languages = counselor.languagesKnow || ['English'];
  const languagesText = languages.slice(0, 2).join(' | ');
  const experience = counselor.experience ? `${counselor.experience}+ Yrs` : 'Entry Level';
  const rating = counselor.rating || 4.0;
  const rateText = counselor.ratePerYear ? `${counselor.ratePerYear.toLocaleString('en-IN')} ProCoins` : '5,000 ProCoins';
  const location = counselor.city || 'Location not specified';

  return (
    <div
      className="relative w-[170px] h-[250px] lg:w-[296px] lg:h-[496px] 
                 bg-white rounded-xl shadow-[0_0_4px_0_rgba(35,35,35,0.25)] 
                 overflow-hidden font-['Poppins'] transition-all duration-300 hover:shadow-lg"
    >
      <div className="w-full h-[134px] lg:h-[296px] bg-[#F5F5F7]">
        <SmartImage
          src={imageUrl}
          alt={fullName}
          className="w-full h-full object-cover rounded-t-xl"
          width={296}
          height={296}
          onError={(e: React.SyntheticEvent<HTMLImageElement, Event>)=>{
            const target = e.currentTarget as HTMLImageElement
            target.onerror = null
            target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=6B7280&color=ffffff&size=400`
          }}
        />
      </div>

      <div
        className="hidden lg:flex absolute top-[276px] left-1/2 -translate-x-1/2 w-[248px] h-10 rounded-[40px]
                   items-center justify-center p-1 px-2
                   shadow-md text-center z-10"
        style={{
          backgroundColor: '#F4F3FA',
          boxShadow: '0 0 10px rgba(19, 9, 125, 0.08)',
          border: '1px solid rgba(19, 9, 125, 0.08)'
        }}
      >
        <span className="font-medium text-[20px] leading-[18px] text-[#13097D] truncate max-w-full">
          {fullName}
        </span>
      </div>

      <div className="p-2 lg:p-3 lg:pt-8"> 
        
        <h2 className="lg:hidden text-[14px] font-semibold text-[#242645] truncate">
          {fullName}
        </h2>

        <div className="font-medium text-xs lg:text-[18px] leading-[125%] text-[#787878] mt-1 lg:mt-1 truncate" title={languagesText}>
          {languagesText}
        </div>

        <div className="hidden lg:block font-medium text-[18px] leading-[125%] text-[#787878] mt-1 ml-1 truncate">
          {location}
        </div>

        <div className="flex items-center gap-2 lg:gap-6 mt-1 lg:mt-3 ml-0 lg:ml-1">
          <span className="flex items-center gap-1 text-[#787878] text-[12px] lg:text-[16px] font-medium">
            <Star className="w-3 h-3 lg:w-5 lg:h-5 text-[#FFD700] fill-current" />
            {rating.toFixed(1)}
          </span>

          <span className="flex items-center gap-1 text-[#787878] text-[12px] lg:text-[16px] font-medium">
            <Briefcase className="w-3 h-3 lg:w-5 lg:h-5 text-[#4471FF]" />
            {experience}
          </span>
        </div>

        <hr className="hidden lg:block my-4 border-t border-[#f0f0f0]" />
        <hr className="block lg:hidden my-2 border-t border-[#f0f0f0]" />

        <div className="flex items-center gap-2 mt-0 lg:-mt-1">
          <SmartImage
            src='./Procoin.jpg'
            alt="procoin_icon"
            className="w-5 h-5 lg:w-10 lg:h-10 object-contain rounded-full"
            width={40}
            height={40}
          />

          <span className="text-sm lg:text-lg font-semibold text-[#343C6A]">
            {rateText}
          </span>
        </div>
      </div>
    </div>
  )
}