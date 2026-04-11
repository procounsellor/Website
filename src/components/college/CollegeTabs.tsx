import React from 'react';

const TABS = [
  "Info", "Counsellors"
];

interface CollegeTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const CollegeTabs: React.FC<CollegeTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="w-full border-b border-[#E0E0E0] mt-6 md:mt-8 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <div className="flex gap-4 md:gap-6 min-w-max px-1">
        {TABS.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className="relative flex flex-col cursor-pointer items-center pb-2 transition-colors duration-200"
            >
              <span
                className={`${
                  isActive ? "text-[#FA660F] font-semibold" : "text-[#232323] font-normal"
                } text-[14px] md:text-[20px]`}
                style={{
                  fontFamily: "Poppins",
                  lineHeight: "125%",
                }}
              >
                {tab}
              </span>
              
              {isActive && (
                <div className="absolute bottom-0 w-full h-0.5 bg-[#FA660F] rounded-t-sm z-10" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CollegeTabs;