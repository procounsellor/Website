import { useState } from "react";

interface CollegeCardProps {
  name: string;
  description: string;
  logoUrl?: string;
}

export default function CollegeCard({ name, description, logoUrl }: CollegeCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="relative group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center gap-[6.19rem] max-w-[1320px]">

        <img src={logoUrl} alt={name} className="w-[7.5rem] h-[5.8125rem] rounded-[0.5rem]" />

        <h1
        className="max-w-[20rem] font-medium text-[1.125rem] text-(--text-main) overflow-clip"
        >{name}</h1>

        <p
        className="max-w-[32.5rem] text-(--text-main) font-normal text-[0.875rem]"
        >{description}</p>

        {/* Arrow Button */}
        <div className="relative overflow-hidden ml-auto">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="63"
            height="57"
            viewBox="0 0 63 57"
            fill="none"
            className="transition-all duration-300"
          >
            <path
              d="M5.22808 7.00026C5.73192 3.00014 9.13365 0 13.1654 0H54.9303C59.3486 0 62.9303 3.58172 62.9303 8V49C62.9303 53.4183 59.3486 57 54.9303 57H8.00116C3.18615 57 -0.537853 52.7775 0.0638728 48.0002L5.22808 7.00026Z"
              fill={isHovered ? "white" : "#0E1629"}
              className="transition-colors duration-300"
            />
          </svg>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[20px] h-[20px]">
            {/* Arrow going out to right - white arrow on blue bg (default) */}
            <img 
              src="/arrow.svg" 
              alt="arrow" 
              className={`absolute inset-0 w-full h-full transition-all duration-600 ${
                isHovered 
                  ? 'translate-x-[30px] opacity-0' 
                  : 'translate-x-0 opacity-100'
              }`}
              style={{ filter: 'brightness(0) invert(1)' }}
            />
            {/* Arrow coming in from left - blue arrow on white bg (hover) */}
            <img 
              src="/arrow.svg" 
              alt="arrow" 
              className={`absolute inset-0 w-full h-full transition-all duration-600 ${
                isHovered 
                  ? 'translate-x-0 opacity-100' 
                  : '-translate-x-[30px] opacity-0'
              }`}
              style={{ filter: 'brightness(0)' }}
            />
          </div>
        </div>

      </div>
    </div>
  );
}
