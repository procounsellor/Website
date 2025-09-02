import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {  Star, MapPin } from "lucide-react";
import { TbBriefcase2 } from "react-icons/tb";

export type AllCounselor = {
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

export function AllCounselorCards({ counselor }: CounselorCardProps) {
  return (  
    <Card className="group flex h-full w-full flex-col p-4 rounded-3xl cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:scale-[1.02] bg-white">
      <div className="overflow-hidden rounded-2xl mb-4">
        <img
          src={counselor.imageUrl}
          alt={`Photo of ${counselor.name}`}
          className="aspect-square w-full object-cover rounded-2xl transition-transform duration-300 group-hover:scale-110"
        />
      </div>

      <div className="flex flex-col gap-3 flex-grow -mt-7">
        <CardHeader className="p-0 gap-1">
          <CardTitle className="font-semibold text-xl lg:text-2xl text-[#343C6A] tracking-wider leading-tight">{counselor.name}</CardTitle>
          <CardDescription className="text-[#718EBF] text-base lg:text-lg tracking-wider">{counselor.description}</CardDescription>
          <div className="flex items-center gap-1 text-[#718EBF]">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">{counselor.location}</span>
          </div>
        </CardHeader>
        
        <div className="flex items-center justify-between text-sm mt-auto">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-yellow-500">
              <Star className="h-4 w-4 fill-current" />
              <span className=" text-[#343C6A]  font-medium text-sm">{counselor.rating.toFixed(1)}</span>
            </div>
            <span className="text-gray-500">|</span>
            <span className="text-[#343C6A] font-medium text-sm ">{counselor.reviews}</span>
            <span className="text-gray-500"> </span>
            <div className="flex items-center gap-2 text-[#4471FF]">
              <TbBriefcase2 className="h-4 w-4" />
              <span className="text-[#343C6A] font-medium text-sm">{counselor.experience}</span>
            </div>
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
        
        <CardFooter className="flex p-0 -mt-2 -ml-4">
          <div className="flex items-center gap-2  py-2 px-4 rounded-full font-semibold text-sm w-full">
            <img 
              src="/Procoin.jpg"
              alt="ProCoins icon" 
              className="h-10 w-10" 
            />
             <span  className="text-black font-semibold lg:text-xl ">
              {counselor.rate.split('/')[0]}
              <span className="text-black text-xs font-bold ">/Hour</span>
            </span>
          </div>
        </CardFooter>
      </div>
    </Card>
  );
}