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
    <Card className="group flex flex-col cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:scale-[1.02] bg-white mx-auto"
      style={{
        width: '100%',
        maxWidth: '320px',
        height: 'auto',
        minHeight: '420px', // Slightly taller than other cards due to more content
        borderRadius: '24px',
        border: '1px solid #EFEFEF',
        boxShadow: '0px 0px 4px 0px #2323231F',
        background: '#FFFFFF',
        opacity: 1,
        boxSizing: 'border-box',
        padding: '16px'
      }}
    >
      <div className="overflow-hidden rounded-2xl mb-3"
        style={{
          width: '100%',
          height: 'auto',
          aspectRatio: '1/1', // Square aspect ratio for counselor photos
        }}
      >
        <img
          src={counselor.imageUrl}
          alt={`Photo of ${counselor.name}`}
          className="w-full h-full object-cover rounded-2xl transition-transform duration-300 group-hover:scale-110"
        />
      </div>

      <div className="flex flex-col gap-2 flex-grow">
        <CardHeader className="p-0 gap-1">
          <CardTitle 
            className="font-semibold text-[#343C6A] leading-tight"
            style={{
              fontSize: 'clamp(16px, 3vw, 20px)', // Responsive font size
              lineHeight: '1.2',
              marginBottom: '4px'
            }}
          >
            {counselor.name}
          </CardTitle>
          <CardDescription 
            className="text-[#718EBF]"
            style={{
              fontSize: 'clamp(14px, 2.5vw, 16px)',
              lineHeight: '1.3',
              marginBottom: '4px'
            }}
          >
            {counselor.description}
          </CardDescription>
          <div className="flex items-center gap-1 text-[#718EBF] mb-2">
            <MapPin className="h-3 w-3" />
            <span 
              style={{
                fontSize: 'clamp(12px, 2vw, 14px)'
              }}
            >
              {counselor.location}
            </span>
          </div>
        </CardHeader>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-yellow-500">
              <Star className="h-3 w-3 fill-current" />
              <span className="text-[#343C6A] font-medium text-xs">{counselor.rating.toFixed(1)}</span>
            </div>
            <span className="text-gray-500 text-xs">|</span>
            <span className="text-[#343C6A] font-medium text-xs">{counselor.reviews}</span>
            <div className="flex items-center gap-1 text-[#4471FF] ml-2">
              <TbBriefcase2 className="h-3 w-3" />
              <span className="text-[#343C6A] font-medium text-xs">{counselor.experience}</span>
            </div>
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-2" />
        
        <CardFooter className="flex p-0 items-center">
          <div className="flex items-center gap-2 w-full">
            <img 
              src="/Procoin.jpg"
              alt="ProCoins icon" 
              className="h-8 w-8" 
            />
            <span 
              className="text-black font-semibold"
              style={{
                fontSize: 'clamp(14px, 3vw, 18px)'
              }}
            >
              {counselor.rate.split('/')[0]}
              <span className="text-black text-xs font-bold">/Hour</span>
            </span>
          </div>
        </CardFooter>
      </div>
    </Card>
  );
}