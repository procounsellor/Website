import {
  Card,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type College = {
  name: string;
  courseCount: string; // e.g., "24 Courses"
  location: string; // e.g., "Hyderabad"
  imageUrl: string;
  badge?: string; // e.g., "TOP", "FEATURED"
  href?: string; // Link to college page
};

type CollegeCardProps = {
  college: College;
  className?: string;
  onClick?: () => void;
};

export function CollegeCard({ college, className, onClick }: CollegeCardProps) {
  return (
    <Card 
      className={cn(
        "group flex flex-col cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:scale-[1.02] bg-white mx-auto",
        className
      )}
      style={{
        width: '100%',
        maxWidth: '320px', // Reduced from 380px
        height: 'auto',
        minHeight: '380px', // Reduced from 451px
        borderRadius: '21.51px',
        background: '#FFFFFF',
        boxShadow: '0px 0px 4px 0px #23232340',
        opacity: 1,
        boxSizing: 'border-box',
        padding: 0
      }}
      onClick={onClick}
    >
      {/* Image container with exact positioning */}
      <div 
        className="relative overflow-hidden px-4 sm:px-0"
        style={{
          width: '100%',
          maxWidth: '290px', // Reduced from 349px
          height: 'auto',
          aspectRatio: '290/240', // Adjusted aspect ratio
          borderRadius: '20px',
          opacity: 1,
          margin: '12px auto 0 auto', // Reduced top margin
          position: 'relative'
        }}
      >
        <img
          src={college.imageUrl || "/imageCounselor.jpg"}
          alt={`${college.name} campus`}
          className="w-full h-full object-cover"
          style={{
            borderRadius: '20px'
          }}
        />
        {college.badge && (
          <Badge 
            className="absolute right-6 top-2 sm:right-3 sm:top-3 bg-[#2C2C2C] hover:bg-[#E55A0E] text-white text-xs font-medium z-10"
          >
            {college.badge}
          </Badge>
        )}
      </div>

      {/* Content container */}
      <div 
        className="flex flex-col items-center text-center flex-1 justify-center"
        style={{ 
          padding: '20px 14px 14px 14px' // More space from image, equal sides and bottom
        }}
      >
        <h3 
          className="font-medium mb-2" 
          style={{
            fontFamily: 'Montserrat',
            fontSize: 'clamp(18px, 4vw, 24px)', // Reduced from 28px max
            fontWeight: '500',
            lineHeight: '125%',
            textAlign: 'center',
            margin: '0 0 8px 0', // Reduced margin
            color: '#343C6A'
          }}
        >
          {college.name}
        </h3>
        
        {/* Course Count with exact Figma specs */}
        <div 
          className="hover:opacity-80 transition-all mb-2"
          style={{
            width: '110px', // Reduced from 133px
            height: '24px', // Reduced from 30px
            fontFamily: 'Montserrat',
            fontSize: 'clamp(16px, 3vw, 20px)', // Reduced from 24px max
            fontWeight: '500',
            lineHeight: '125%',
            textDecoration: 'underline',
            textDecorationStyle: 'solid',
            color: '#718EBF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {college.courseCount}
        </div>

        {/* Location with exact Figma specs */}
        <div 
          style={{
            width: '110px', // Reduced from 133px
            height: '24px', // Reduced from 30px
            fontFamily: 'Montserrat',
            fontSize: 'clamp(16px, 3vw, 20px)', // Reduced from 24px max
            fontWeight: '400',
            lineHeight: '125%',
            color: '#718EBF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {college.location}
        </div>
      </div>
    </Card>
  );
}
