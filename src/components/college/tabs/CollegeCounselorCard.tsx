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

export function CollegeCounselorCard({ counselor }: CounselorCardProps) {
  const firstName = capitalizeName(counselor.firstName || 'Unknown');
  const lastName = capitalizeName(counselor.lastName || 'Counselor');
  const fullName = `${firstName} ${lastName}`;
  
  const imageUrl = counselor.photoUrlSmall || `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=6B7280&color=ffffff&size=400`;
  
  const languages = counselor.languagesKnow || ['English'];
  const languagesText = languages.slice(0, 3).join(' | ');
  
  const experience = counselor.experience ? `${counselor.experience}+ Yrs` : 'Entry Level';
  const rating = counselor.rating || 4.0;
  
  const rateText = counselor.ratePerYear 
    ? `${counselor.ratePerYear.toLocaleString('en-IN')} ProCoins` 
    : '5,000 ProCoins';
    
  const location = counselor.city || 'Location not specified';

  return (
    <div
      className="relative transition-all duration-300 hover:shadow-lg bg-white overflow-hidden
        w-[170px] h-[250px] rounded-xl shadow-[0_0_4px_0_rgba(35,35,35,0.25)]
        lg:w-[320px] lg:h-[444px] lg:rounded-[20px] lg:shadow-[0_0_4px_0_rgba(35,35,35,0.25)]"
    >
      <div className="hidden lg:block w-full h-full relative font-['Poppins']">
        <div className="absolute top-2.5 left-2.5 w-[300px] h-[248px] bg-[#F5F5F7] rounded-[10px] overflow-hidden">
          <SmartImage
            src={imageUrl}
            alt={fullName}
            className="w-full h-full object-cover"
            width={300}
            height={248}
            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
              const target = e.currentTarget as HTMLImageElement;
              target.onerror = null;
              target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=6B7280&color=ffffff&size=400`;
            }}
          />
        </div>

        <div className="absolute top-[266px] left-2.5 w-[300px] px-1">
          <h2 className="font-semibold text-[20px] leading-[125%] text-[#242645] truncate">
            {fullName}
          </h2>
        </div>

        <div className="absolute top-[295px] left-2.5 w-[300px] px-1">
          <p className="font-medium text-[18px] leading-[125%] text-[#8C8CA1] truncate">
            {languagesText}
          </p>
        </div>

        <div className="absolute top-[322px] left-2.5 w-[300px] px-1">
          <p className="font-medium text-[18px] leading-[125%] text-[#8C8CA1] truncate">
            {location}
          </p>
        </div>

        <div className="absolute top-[355px] left-2.5 flex items-center gap-6">
           <span className="flex items-center gap-1 text-[#242645] text-[16px] font-medium">
             <Star className="w-5 h-5 text-[#FFD700] fill-current" />
             {rating.toFixed(1)}
           </span>
           <span className="flex items-center gap-1 text-[#242645] text-[16px] font-medium">
             <Briefcase className="w-5 h-5 text-[#4471FF]" />
             {experience}
           </span>
        </div>

        <hr className="absolute top-[390px] left-0 w-full border-t border-[#f0f0f0]" />

        <div className="absolute top-[404px] left-2.5 flex items-center gap-2">
          <SmartImage
             src='/Procoin.jpg'
             alt="procoin_icon"
             className="w-8 h-8 object-contain rounded-full"
          />
          <span className="text-[18px] font-semibold text-[#343C6A]">
             {rateText}
          </span>
        </div>
      </div>


      <div className="lg:hidden h-full flex flex-col font-['Poppins']">
        <div className="w-full h-[134px] bg-[#F5F5F7]">
          <SmartImage
            src={imageUrl}
            alt={fullName}
            className="w-full h-full object-cover rounded-t-xl"
            width={170}
            height={134}
             onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
              const target = e.currentTarget as HTMLImageElement;
              target.onerror = null;
              target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=6B7280&color=ffffff&size=400`;
            }}
          />
        </div>

        <div className="p-2 flex-1 flex flex-col justify-between"> 
          <div>
            <h2 className="text-[14px] font-semibold text-[#242645] truncate">
              {fullName}
            </h2>
            <div className="font-medium text-xs text-[#787878] mt-1 truncate">
              {languages.slice(0, 2).join(' | ')}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="flex items-center gap-1 text-[#787878] text-[12px] font-medium">
                <Star className="w-3 h-3 text-[#FFD700] fill-current" />
                {rating.toFixed(1)}
              </span>
              <span className="flex items-center gap-1 text-[#787878] text-[12px] font-medium">
                <Briefcase className="w-3 h-3 text-[#4471FF]" />
                {experience.split('+')[0]} Yrs
              </span>
            </div>
          </div>

          <div>
             <hr className="my-2 border-t border-[#f0f0f0]" />
             <div className="flex items-center gap-1">
                <SmartImage
                    src='/Procoin.jpg'
                    alt="procoin_icon"
                    className="w-5 h-5 object-contain rounded-full"
                />
                <span className="text-sm font-semibold text-[#343C6A]">
                    {rateText}
                </span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}