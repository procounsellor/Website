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
    <Card 
      className="group flex flex-col cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:scale-[1.02] bg-white mx-auto"
      style={{
        width: '100%',
        maxWidth: '320px', // Reduced from 380px
        height: 'auto',
        minHeight: '380px', // Reduced from 451px
        borderRadius: '24px',
        border: '1px solid #EFEFEF',
        boxShadow: '0px 0px 4px 0px #2323231F',
        background: '#FFFFFF',
        opacity: 1,
        boxSizing: 'border-box',
        padding: 0
      }}
    >
      {/* Image container with exact positioning */}
      <div 
        className="relative overflow-hidden px-4 sm:px-0"
        style={{
          width: '100%',
          maxWidth: '290px', // Reduced from 351px
          height: 'auto',
          aspectRatio: '290/240', // Adjusted aspect ratio
          borderRadius: '20px',
          opacity: 1,
          margin: '12px auto 0 auto', // Reduced top margin
          position: 'relative'
        }}
      >
        <img
          src={counselor.imageUrl}
          alt={`Photo of ${counselor.name}`}
          className="w-full h-full object-cover"
          style={{
            borderRadius: '20px'
          }}
        />
      </div>

      {/* Content container */}
      <div className="flex flex-col gap-3 flex-grow px-4 py-3">
        <CardHeader className="p-0 gap-1 text-center">
          <CardTitle 
            className="font-medium text-[#343C6A] leading-tight"
            style={{
              maxWidth: '200px', // Reduced from 235px
              height: 'auto',
              minHeight: '28px', // Reduced from 35px
              fontFamily: 'Montserrat',
              fontWeight: '500',
              fontSize: 'clamp(18px, 4vw, 24px)', // Reduced from 28px max
              lineHeight: '125%',
              textAlign: 'center',
              opacity: 1,
              margin: '0 auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {counselor.name}
          </CardTitle>
          <CardDescription className="text-[#718EBF] text-base lg:text-lg tracking-wider text-center">{counselor.description}</CardDescription>
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