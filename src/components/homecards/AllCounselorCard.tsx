import { Star} from "lucide-react";
import { TbBriefcase2 } from "react-icons/tb";
import type { AllCounselor } from "@/types/academic";

type CounselorCardProps = {
  counselor: AllCounselor;
};

export function AllCounselorCard({ counselor }: CounselorCardProps){
  const fullName = `${counselor.firstName || 'Unknown'} ${counselor.lastName || 'Counselor'}`;
  const imageUrl = counselor.photoUrlSmall || `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=6B7280&color=ffffff&size=400`;
  const languages = counselor.languagesKnow || ['English'];
  const experience = counselor.experience ? `${counselor.experience} Years` : 'Entry Level';
  const rating = counselor.rating || 4.0;
  const reviews = parseInt(counselor.numberOfRatings || "0");
  const rateText = counselor.ratePerYear ? `${counselor.ratePerYear.toLocaleString('en-IN')} ProCoins` : '5,000 ProCoins';
  const location = counselor.city || 'Location not specified';
  const description = languages.slice(0, 2).join(' | ');

  return (
    <div
    className="flex flex-col w-[170px] lg:w-[282px] h-[267px] lg:h-[444px] hover:shadow-lg transition-all duration-300 bg-white shadow-[0px_0px_4px _px_#23232340] rounded-[12px] 
    lg:rounded-[20px] p-[10px]"
    >
      <img
       src={imageUrl}
       alt={fullName}
       className="w-[150px] lg:w-[262px] h-[124px] lg:h-[248px] object-cover rounded-[10px]"
       onError={(e)=>{
        e.currentTarget.onerror = null
        e.currentTarget.src =`https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=6B7280&color=ffffff&size=400`
       }}
       />

       <div className="mt-2 mb-1">
        <div className="text-[#242645] text-[14px] lg:text-[20px] font-medium lg:font-semibold">
          {fullName}
        </div>

        <div className=" flex flex-col text-[#8C8CA1] text-[12px] lg:text-[18px] font-medium ">
          {description}
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
          <img 
          src='./Procoin.jpg' 
          alt="procoin_icon" 
          className="w-[18px] h-[18px] lg:w-11 lg:h-11"
          />
          <span className="text-[12px] lg:font-semibold text-[#343c6a] text-center">{rateText}<span>/Hour</span></span>
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
