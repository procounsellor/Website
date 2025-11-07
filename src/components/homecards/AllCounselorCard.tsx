import { Star} from "lucide-react";
import { TbBriefcase2 } from "react-icons/tb";
import type { AllCounselor } from "@/types/academic";
import SmartImage from "@/components/ui/SmartImage";

type CounselorCardProps = {
  counselor: AllCounselor;
};

// Helper function to capitalize first letter of each name part
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
  const languagesText = languages.join(' | ');
  const experience = counselor.experience ? `${counselor.experience} Years` : 'Entry Level';
  const rating = counselor.rating || 4.0;
  const reviews = parseInt(counselor.numberOfRatings || "0");
  const rateText = counselor.ratePerYear ? `${counselor.ratePerYear.toLocaleString('en-IN')} ProCoins` : '5,000 ProCoins';
  const location = counselor.city || 'Location not specified';

  return (
    <div
    className="flex flex-col w-[170px] lg:w-[282px] h-[267px] lg:h-[444px] hover:shadow-lg transition-all duration-300 bg-white shadow-[0px_0px_4px _px_#23232340] rounded-[12px] 
    lg:rounded-[20px] p-[10px]"
    >
  <SmartImage
   src={imageUrl}
   alt={fullName}
   className="w-[150px] lg:w-[262px] h-[124px] lg:h-[248px] object-cover rounded-[10px]"
   width={262}
   height={248}
  onError={(e: React.SyntheticEvent<HTMLImageElement, Event>)=>{
   const target = e.currentTarget as HTMLImageElement
   target.onerror = null
   target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=6B7280&color=ffffff&size=400`
  }}
   />

       <div className="mt-2 mb-1">
        <div className="text-[#242645] text-[14px] lg:text-[20px] font-medium lg:font-semibold">
          {fullName}
        </div>

        <div className=" flex flex-col text-[#8C8CA1] text-[12px] lg:text-[18px] font-medium ">
          <span className="truncate" title={languagesText}>{languagesText}</span>
          <span>{location}</span>
        </div>

        <div className="my-1">
          <div className="flex items-center justify-between lg:justify-start lg:gap-3 text-[#696969] text-[12px] lg:text-[16px] font-medium">
            <span className="flex gap-2 lg:gap">
              <Star className="w-4 h-4 lg:w-5 lg:h-5 text-[#FFD700] " fill="currentColor"/>
            {rating} | {reviews}
            </span>
            <span className="flex gap-2">
              <TbBriefcase2 className="w-4 h-4 lg:w-5 lg:h-5 text-[#4471FF]"/>
              {experience}
            </span>
          </div>
        </div>

        <hr className="flex justify-center h-px text-[#f5f5f5]" />

        <div className="flex items-center gap-2 mt-2">
          <SmartImage
          src='./Procoin.jpg'
          alt="procoin_icon"
          className="w-[18px] h-[18px] lg:w-11 lg:h-11 object-contain"
          width={44}
          height={44}
          />
          <span className="text-xs lg:font-semibold text-[#343c6a] text-center">{rateText}</span>
        </div>
       </div>
    </div>
  )
}

// width: 380;
// height: 553;
// top: 2182px;
// left: 125px;
// angle: 0 deg;
// opacity: 1;
// border-radius: 24px;
