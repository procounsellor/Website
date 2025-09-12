import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { CircleCheckBig } from "lucide-react";
import { TbBriefcase2 } from "react-icons/tb";
import type { Counselor } from "@/types";



type CounselorCardProps = {
  counselor: Counselor;
};

export function CounselorCard({ counselor }: CounselorCardProps) {
  return (  
    <Card 
      className="group flex h-full w-full flex-col cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white p-4 shadow-md rounded-2xl lg:rounded-[24px] lg:w-[380px] lg:h-[451px]"
    >
      <div 
        className="relative w-full aspect-[290/240] overflow-hidden rounded-xl lg:aspect-auto lg:max-w-[351px] lg:h-[299px] lg:rounded-[20px] lg:mx-auto"
      >
        <img
          src={counselor.imageUrl}
          alt={`Photo of ${counselor.name}`}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/imageCounselor.jpg";
          }}
        />
      </div>


      <div className="flex flex-col gap-3 flex-grow py-3">
        <CardHeader className="p-0 gap-1 text-center lg:text-center">
          <CardTitle 
            className="font-medium text-[14px] leading-[125%] text-center truncate text-[#343C6A] lg:text-[24px] lg:leading-[125%]"
            style={{
              fontFamily: 'Montserrat',
              fontWeight: '500'
            }}
          >
            {counselor.name}
          </CardTitle>
          <CardDescription 
            className="text-[#718EBF] text-[12px] leading-[125%] text-center lg:text-[28px] lg:leading-[125%]"
            style={{
              fontFamily: 'Montserrat',
              fontWeight: '500'
            }}
          >
            {counselor.description}
          </CardDescription>
        </CardHeader>
        
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
        
        <CardFooter className="flex justify-between p-0 text-sm mt-auto gap-1 lg:gap-2">
          <div className="flex items-center gap-1 lg:gap-2">
            <CircleCheckBig className={`h-4 w-4 ${counselor.verified ? 'text-[#7EE655]' : 'text-gray-400'}`} />
            <span className={`font-medium text-[12px] lg:text-[18px] lg:leading-[125%] ${counselor.verified ? 'text-[#7EE655]' : 'text-gray-400'}`} style={{fontFamily: 'Montserrat', fontWeight: '400'}}>
              {counselor.verified ? 'Verified' : 'Pending'}
            </span>
          </div>
          <div className="flex items-center gap-1 lg:gap-2 text-[#4471FF]">
            <TbBriefcase2 className="h-4 w-4" />
            <span className="text-[#343C6A] font-medium text-[12px] lg:text-[18px] lg:leading-[125%]" style={{fontFamily: 'Montserrat', fontWeight: '400'}}>{counselor.experience}</span>
          </div>
        </CardFooter>
      </div>
    </Card>
  );
}