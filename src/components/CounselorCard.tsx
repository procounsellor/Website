import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { CircleCheckBig } from "lucide-react";
import { TbBriefcase2 } from "react-icons/tb";


export type Counselor = {
  name: string;
  description: string;
  experience: string;
  imageUrl: string;
  verified: boolean;
};

type CounselorCardProps = {
  counselor: Counselor;
};

export function CounselorCard({ counselor }: CounselorCardProps) {
  return (  
    <Card className="group flex h-full w-full flex-col p-4 rounded-3xl cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:scale-[1.02] bg-white">
      <div className="overflow-hidden rounded-2xl mb-4">
        <img
          src={counselor.imageUrl}
          alt={`Photo of ${counselor.name}`}
          className="aspect-square w-full object-cover rounded-2xl transition-transform duration-300 group-hover:scale-110"
        />
      </div>

      <div className="flex flex-col gap-3 flex-grow">
        <CardHeader className="p-0 gap-1">
          <CardTitle className="font-semibold text-xl lg:text-2xl text-[#343C6A] tracking-wider leading-tight">{counselor.name}</CardTitle>
          <CardDescription className="text-[#718EBF] text-base lg:text-lg tracking-wider">{counselor.description}</CardDescription>
        </CardHeader>
        
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
        
        <CardFooter className="flex justify-between p-0 text-sm mt-auto">
          <div className="flex items-center gap-2">
            <CircleCheckBig className={`h-4 w-4 ${counselor.verified ? 'text-[#7EE655]' : 'text-gray-400'}`} />
            <span className={`font-medium text-sm ${counselor.verified ? 'text-[#7EE655]' : 'text-gray-400'}`}>
              {counselor.verified ? 'Verified' : 'Pending'}
            </span>
          </div>
          <div className="flex items-center gap-2 text-[#4471FF]">
            <TbBriefcase2 className="h-4 w-4" />
            <span className="text-[#343C6A] font-medium text-sm">{counselor.experience}</span>
          </div>
        </CardFooter>
      </div>
    </Card>
  );
}