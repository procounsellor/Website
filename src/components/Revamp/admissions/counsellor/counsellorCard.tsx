import { Star, Briefcase, MapPin } from "lucide-react";
import { useState } from "react";

export default function FancyCard() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="relative w-[244px] h-[367px] cursor-pointer group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 244 367"
        fill="none"
      >
        <path
          d="M234.615 0C239.798 5.03664e-06 244 5.83355 244 13.0296V300C244 306.627 238.627 312 232 312H203.381C197.421 312 192.364 316.375 191.506 322.273L186.494 356.727C185.636 362.625 180.579 367 174.619 367H9.38461C4.20164 367 6.61314e-08 361.166 0 353.97V13.0296C1.66273e-06 5.83355 4.20164 2.62325e-07 9.38461 0H234.615Z"
          fill="white"
        />
      </svg>

      <div className="w-full relative h-full p-3 flex flex-col">
        {/* Rating Badge */}
        <div className="absolute top-[20px] left-[20px] flex items-center gap-1 z-10">
          <Star size={16} fill="#0E1629" className="text-[#0E1629]" />
          <p className="font-[Poppins] font-medium text-[14px] text-[#0E1629] tracking-[0.28px]">
            4.0
          </p>
        </div>

        {/* Counsellor Image */}
        <img 
          src="/review3.jpeg" 
          alt="counsellor_image" 
          className="w-[220px] h-[208px] rounded-[10px] object-cover" 
        />
        
        {/* Counsellor Name */}
        <div className="mt-2">
          <p className="font-[Poppins] font-medium text-[18px] text-[#0E1629] leading-normal">
            Dr. Subhash Ghai
          </p>
        </div>

        {/* Details */}
        <div className="flex flex-col gap-1 mt-3">
          <div className="flex items-center gap-1">
            <Briefcase size={20} className="text-[#6B7280]" strokeWidth={1.5} />
            <p className="font-[Poppins] font-normal text-[14px] text-[#6B7280]">
              8+ years of experience
            </p>
          </div>
          <div className="flex items-center gap-1">
            <MapPin size={20} className="text-[#6B7280]" strokeWidth={1.5} />
            <p className="font-[Poppins] font-normal text-[14px] text-[#6B7280]">
              Banglore
            </p>
          </div>
        </div>

        {/* ProCoins */}
        <div className="flex items-center gap-1 mt-3">
          <div className="w-[32px] h-[32px] flex items-center justify-center">
            <img src="/coin.svg" alt="procoin_icon" className="w-full h-full" />
          </div>
          <p className="font-[Poppins] font-medium text-[16px] text-[#0E1629]">
            1000 ProCoins
          </p>
        </div>
      </div>

      {/* Arrow Button */}
      <div className="absolute right-[-1px] bottom-[1.5px] overflow-hidden">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="53"
          height="50"
          viewBox="0 0 52 50"
          fill="none"
          className="transition-all duration-300"
        >
          <path
            d="M4.1 7.05536C4.57855 3.03083 7.99114 0 12.044 0H43.9934C48.4117 0 51.9934 3.58172 51.9934 8V42C51.9934 46.4183 48.4117 50 43.9934 50H8.00107C3.20833 50 -0.508886 45.8146 0.0570345 41.0554L4.1 7.05536Z"
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
  );
}
