import { Star} from "lucide-react";
import { TbBriefcase2 } from "react-icons/tb";

export type AllCounselor = {
  id: string;
  name: string;
  description: string;
  experience: string;
  imageUrl: string;
  location: string;
  rating: number;
  reviews: number;
  rate: string;
};

type CounselorCardProps = {
  counselor: AllCounselor;
};

export function AllCounselorCard({ counselor }: CounselorCardProps){
  return (
    <div
    className="flex flex-col w-[170px] lg:w-[380px] h-[270px] lg:h-[553px] bg-white shadow-[0px_0px_4px _px_#23232340] rounded-[12px] 
    lg:rounded-3xl p-3 gap-1"
    >
      <img
       src={counselor.imageUrl}
       alt={counselor.name}
       className="w-[146px] lg:w-[351px] h-[124px] lg:h-[299px] object-cover rounded-[4px] lg:rounded-[20px]"
       />

       <div>
        <div className="text-[#343C6A] text-[14px] lg:text-[28px] font-medium">
          {counselor.name}
        </div>

        <div className=" flex flex-col text-[#718EBF] text-[12px] lg:text-[24px] font-medium">
          {counselor.description}
          <span>{counselor.location}</span>
        </div>

        <div className="border-t-[1px] border-b-[1px] py-2 mt-2">
          <div className="flex items-center justify-between text-[#3D3D3D] text-[12px] lg:text-[18px] font-normal">
            <span className="flex gap-2 lg:gap">
              <Star className="w-4 h-4 lg:w-6 lg:h-6 text-[#FFD700] " fill="currentColor"/>
            {counselor.rating} | {counselor.reviews}
            </span>
            <span className="flex gap-2">
              <TbBriefcase2 className="w-4 h-4 lg:w-6 lg:h-6 text-[#4471FF]"/>
              {counselor.experience}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-1 ">
          <img 
          src='./Procoin.jpg' 
          alt="procoin_icon" 
          className="w-[18px] h-[18px] lg:w-11 lg:h-11"
          />
          <span className="text-[12px] lg:text-[24px] text-[#232323] text-center">{counselor.rate}</span>
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
