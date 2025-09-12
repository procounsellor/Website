import { Card } from "@/components/ui/card";
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
        "group flex h-full w-full flex-col cursor-pointer p-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white shadow-md rounded-2xl lg:rounded-[24px] lg:w-[380px] lg:h-[451px]",
        className
      )}
      onClick={onClick}
    >
      <div className="relative mb-3 w-full overflow-hidden rounded-xl lg:rounded-[20px] bg-gray-50 aspect-[3/2] lg:aspect-auto lg:w-[351px] lg:h-[299px] flex items-center justify-center">
        <img
          src={logoUrl || "/logo.svg"}
          alt={`${collegeName} logo`}
          className="max-h-full max-w-full object-contain p-2"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/logo.svg";
          }}
        />
        <Badge 
          className={cn("absolute right-2 top-2 z-10 text-xs font-medium", getTypeColor())}
        >
          {getTypeLabel(type)}
        </Badge>
      </div>

      <div className="flex flex-grow flex-col items-center justify-between gap-3 text-center">
        <div className="w-full">
          <h3 
            className="font-medium text-[#343C6A] text-lg h-14 overflow-hidden -mt-5"
            style={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                textOverflow: 'ellipsis'
            }}
            title={collegeName}
          >
            {collegeName}
          </h3>
          <p className="text-sm text-gray-500 truncate">
            {city}, {state}
          </p>
        </div>
        
        <a 
          href="#"
          className="text-sm text-[#718EBF] underline hover:opacity-80 transition-all"
          onClick={(e) => {
            e.preventDefault();
            onClick?.();
          }}
        >
          View College
        </a>
      </div>
    </Card>
  );
}