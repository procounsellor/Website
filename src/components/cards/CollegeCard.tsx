import {
  Card,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type CollegeCardProps = {
  collegeName: string;
  city: string;
  state: string;
  logoUrl: string;
  type: string;
  className?: string;
  onClick?: () => void;
};

export function CollegeCard({
  collegeName,
  city,
  state,
  logoUrl,
  type,
  className,
  onClick,
}: CollegeCardProps) {
  const getTypeColor = () => {
    return 'bg-[#2C2C2C] hover:bg-[#E55A0E] text-white';
  };

  const getTypeLabel = (collegeType: string) => {
    switch (collegeType.toLowerCase()) {
      case 'govt':
        return 'Government';
      case 'pvt':
        return 'Private';
      case 'private':
        return 'Private';
      case 'deemed':
        return 'Deemed';
      default:
        return collegeType;
    }
  };

  return (
    <Card 
      className={cn(
        "group flex flex-col cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:scale-[1.02] bg-white mx-auto",
        className
      )}
      onClick={onClick}
      style={{
        width: '100%',
        maxWidth: '320px',
        height: 'auto',
        minHeight: '380px',
        borderRadius: '21.51px',
        background: '#FFFFFF',
        boxShadow: '0px 0px 4px 0px #23232340',
        opacity: 1,
        boxSizing: 'border-box',
        padding: 0
      }}
    >
      <div 
        className="relative overflow-hidden px-4 sm:px-0 flex items-center justify-center bg-gray-50"
        style={{
          width: '100%',
          maxWidth: '290px',
          height: '200px',
          borderRadius: '20px',
          opacity: 1,
          margin: '12px auto 0 auto',
          position: 'relative'
        }}
      >
        <img
          src={logoUrl || "/logo.svg"}
          alt={`${collegeName} logo`}
          className="max-w-full max-h-full object-contain"
          style={{
            borderRadius: '20px',
            maxWidth: '100%',
            maxHeight: '100%',
            width: 'auto',
            height: 'auto'
          }}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/logo.svg";
          }}
        />
        <Badge 
          className={`absolute right-6 top-2 sm:right-3 sm:top-3 ${getTypeColor()} text-white text-xs font-medium z-10`}
        >
          {getTypeLabel(type)}
        </Badge>
      </div>

      <div 
        className="flex flex-col items-center text-center flex-1 justify-between"
        style={{ 
          padding: '20px 14px 14px 14px'
        }}
      >
        <div>
          <h3 
            className="font-medium mb-2" 
            style={{
              fontFamily: 'Montserrat',
              fontSize: 'clamp(16px, 3.5vw, 20px)',
              fontWeight: '500',
              lineHeight: '125%',
              textAlign: 'center',
              margin: '0 0 8px 0',
              color: '#343C6A'
            }}
          >
            {collegeName}
          </h3>
          <p 
            className="text-gray-600 mb-4"
            style={{
              fontFamily: 'Montserrat',
              fontSize: 'clamp(12px, 2.5vw, 14px)',
              fontWeight: '400',
              textAlign: 'center',
              margin: '0 0 16px 0',
            }}
          >
            {city}, {state}
          </p>
        </div>
        
        <a 
          href="#"
          className="hover:opacity-80 transition-all"
          onClick={(e) => {
            e.preventDefault();
            onClick?.();
          }}
          style={{
            fontFamily: 'Montserrat',
            fontSize: 'clamp(14px, 2.5vw, 16px)',
            fontWeight: '400',
            textDecoration: 'underline',
            maxWidth: '120px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#718EBF'
          }}
        >
          View College
        </a>
      </div>
    </Card>
  );
}
