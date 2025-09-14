import { CircleCheckBig } from "lucide-react";
import { TbBriefcase2 } from "react-icons/tb";
import type { Counselor } from "@/types";



type CounselorCardProps = {
  counselor: Counselor;
};

export function CounselorCard({ counselor }: CounselorCardProps) {
  return (
    <div 
    className="flex flex-col gap-3  w-[170px] lg:w-[380px] h-[222px]
    lg:h-[451px] p-3 transition-all duration-300 hover:translate-y-1 hover:shadow:xl
     bg-white shadow-[0px_0px_4px_0px_#23232340] rounded-[12px] lg:rounded-3xl"
     >
  <img 
  src={counselor.imageUrl}
  alt={counselor.name}
  className="w-full max-w-[146px] lg:max-w-[351px] h-[124px] lg:h-[299px] object-cover rounded-[4px]
  lg:rounded-[20px]" 
   />

       <div className="flex flex-col">
  <h1 className="text-[14px] lg:text-[28px] font-medium text-[#343C6A]">
          {counselor.name}
        </h1>

  <span className="font-medium text-xs lg:text-2xl text-[#718EBF]">
          {counselor.description}
        </span>

        <hr className="h-px text-[#E3E3E3] my-1.5"/>

        <div className="flex justify-between text-xs lg:text-[18px]">
          <div
          className={`flex gap-x-1 lg:gap-2 ${counselor.verified? 'text-[#7EE655]':'text-gray-50'} `}
          >
            <CircleCheckBig
            className="w-4 h-4 lg:w-5 lg:h-5"/>
            <span className="text-[#3D3D3D]">{counselor.verified?'Verified':'Pending'}</span>
          </div>
          <div className="flex gap-x-1 lg:gap-2">
            <TbBriefcase2
            className="w-4 h-4 lg:w-5 lg:h-5 text-[#4471FF]"/>
            {counselor.experience}
            </div>
        </div>

       </div>

    </div>
  )
}




