import { useState } from "react";

interface DeadlinesCardProps {
  examName: string;
  deadline: string;
  details: string;
  isWhite?: boolean;
}

export default function DeadlinesCard({ examName, deadline, details, isWhite = false }: DeadlinesCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="relative cursor-pointer"
      style={{ width: "312px", height: "322px" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <svg
        className="absolute inset-0 transition-all duration-300"
        xmlns="http://www.w3.org/2000/svg"
        width="312"
        height="322"
        viewBox="0 0 312 322"
        fill="none"
      >
        <path
          d="M300 0C306.627 4.41907e-06 312 5.11826 312 11.432V249.03C312 255.657 306.627 261.03 300 261.03H260.406C254.371 261.03 249.275 265.511 248.504 271.497L243.348 311.533C242.577 317.518 237.481 322 231.446 322H12C5.37259 322 8.45615e-08 316.882 0 310.568V11.432C2.12611e-06 5.11826 5.37258 2.3016e-07 12 0H300Z"
          fill={isWhite ? "white" : "rgba(159, 168, 184, 0.6)"}
          className="transition-colors duration-300"
        />
      </svg>

      <div className="absolute inset-0 p-[0.75rem] flex flex-col gap-[1.5rem]">
        <div className="flex justify-between items-center">
             <div className={`w-fit flex items-center justify-center rounded-[6px] gap-2 ${isWhite ? "bg-[#EDEDED]": "bg-white"} py-1 px-3`}>
            <div className="bg-[#0E1629] h-4 w-4"></div>

            <p className={`text-(--text-main) font-semibold text-[0.875rem]`}>
              {examName}
            </p>
          </div>

          <p className={`text-right font-normal text-[0.875rem] ${isWhite ? "text-(--text-muted)" : "text-(--text-main)"}`}>{deadline}</p>
        </div>


        <p
        className={`text-left ${isWhite ? "text-(--text-main)": "text-white"} text-[1.125rem]`}
        >{details}</p>
      </div>

      <div className="absolute right-[1.5px] bottom-[1.5px] overflow-hidden">
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
            fill={isHovered ? (isWhite ? "white" : "rgba(159, 168, 184, 0.6)") : "#0E1629"}
            className="transition-colors duration-300"
          />
        </svg>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[20px] h-[20px]">
          {/* Arrow going out to right */}
          <img 
            src="/arrow.svg" 
            alt="arrow" 
            className={`absolute inset-0 w-full h-full transition-all duration-600 ${
              isHovered 
                ? 'translate-x-[30px] opacity-0' 
                : 'translate-x-0 opacity-100'
            }`}
            style={{ filter: isHovered ? 'brightness(0)' : 'brightness(0) invert(1)' }}
          />
          {/* Arrow coming in from left */}
          <img 
            src="/arrow.svg" 
            alt="arrow" 
            className={`absolute inset-0 w-full h-full transition-all duration-600 ${
              isHovered 
                ? 'translate-x-0 opacity-100' 
                : '-translate-x-[30px] opacity-0'
            }`}
            style={{ filter: isHovered ? 'brightness(0)' : 'brightness(0) invert(1)' }}
          />
        </div>
      </div>
    </div>
  );
}

