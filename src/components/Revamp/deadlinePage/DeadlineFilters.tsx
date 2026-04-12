import React from "react";

interface FilterProps {
  selectedTypes: string[];
  setSelectedTypes: React.Dispatch<React.SetStateAction<string[]>>;
  feesRange: number;
  setFeesRange: React.Dispatch<React.SetStateAction<number>>;
  onClearFilters: () => void;
}

export default function DeadlineFilters({
  selectedTypes,
  setSelectedTypes,
  feesRange,
  onClearFilters,
}: FilterProps) {
  
  const deadlineTypes = [
    { id: "exam", label: "Exam" },
    { id: "event", label: "Event" },
    { id: "deadline", label: "Deadline" },
    { id: "application", label: "Application" },
  ];

  const toggleType = (typeId: string) => {
    if (selectedTypes.includes(typeId)) {
      setSelectedTypes(selectedTypes.filter((id) => id !== typeId));
    } else {
      setSelectedTypes([...selectedTypes, typeId]);
    }
  };

  const activeFilterCount = selectedTypes.length + (feesRange > 0 ? 1 : 0);

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Header */}
      <div className="box-border flex flex-row justify-between items-center px-5 py-4 w-full h-[64px] bg-white border border-[#E6E6E6] rounded-[8px]">
        <div className="flex flex-row justify-center items-center gap-[12px]">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0E1629" strokeWidth="1.5" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
            <circle cx="8" cy="6" r="2" fill="white" />
            <circle cx="16" cy="12" r="2" fill="white" />
            <circle cx="11" cy="18" r="2" fill="white" />
          </svg>
          <span className="font-[Poppins] font-semibold text-[16px] text-[#0E1629]">Filters</span>
        </div>
        {activeFilterCount > 0 && (
          <div className="flex flex-col justify-center items-center w-[24px] h-[24px] bg-[#0E1629] rounded-[4px]">
            <span className="font-[Arial] font-semibold text-[12px] text-white">{activeFilterCount}</span>
          </div>
        )}
      </div>

      {/* Deadline Type Section */}
      <div className="box-border flex flex-col items-start pb-[16px] w-full bg-white border border-[#E6E6E6] rounded-[8px]">
        <div className="box-border flex flex-row items-center px-5 py-4 w-full border-b border-[#E6E6E6] mb-4">
          <span className="font-[Poppins] font-medium text-[16px] text-[#242645]">Deadline Type</span>
        </div>
        <div className="flex flex-col gap-[14px] w-full px-5">
          {deadlineTypes.map((type) => {
            const isChecked = selectedTypes.includes(type.id);
            return (
              <div 
                key={type.id} 
                className="flex flex-row items-center gap-[12px] cursor-pointer" 
                onClick={() => toggleType(type.id)}
              >
                <div className={`box-border w-[18px] h-[18px] flex justify-center items-center rounded-[2px] transition-colors ${isChecked ? 'bg-[#0E1629] border-[#0E1629]' : 'bg-white border border-[#CED1D9]'}`}>
                  {isChecked && (
                    <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
                      <path d="M2.5 7L5.5 10L11.5 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span className={`font-[Poppins] text-[14px] leading-none ${isChecked ? 'font-medium text-[#0E1629]' : 'font-normal text-[#6B7280]'}`}>
                  {type.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Fees Section */}
      <div className="box-border flex flex-col items-start pb-[20px] w-full bg-white border border-[#E6E6E6] rounded-[8px]">
        <div className="box-border flex flex-row items-center px-5 py-4 w-full border-b border-[#E6E6E6] mb-6">
          <span className="font-[Poppins] font-medium text-[16px] text-[#242645]">Fees</span>
        </div>
        <div className="w-full px-5 flex flex-col gap-2">
          <div className="relative w-full h-[4px] bg-[#E5E7EB] rounded-full mt-2">
             <div className="absolute left-[10%] right-[30%] h-full bg-[#0E1629] rounded-full"></div>
             <div className="absolute left-[10%] top-1/2 -translate-y-1/2 -translate-x-1/2 w-[16px] h-[16px] bg-[#0E1629] rounded-full border-2 border-white shadow-sm cursor-pointer"></div>
             <div className="absolute right-[30%] top-1/2 -translate-y-1/2 translate-x-1/2 w-[16px] h-[16px] bg-[#0E1629] rounded-full border-2 border-white shadow-sm cursor-pointer"></div>
          </div>
          {/* Labels */}
          <div className="flex justify-between w-full mt-2">
             <span className="font-[Poppins] text-[12px] font-medium text-[#6B7280]">10L</span>
             <span className="font-[Poppins] text-[12px] font-medium text-[#6B7280]">24L</span>
          </div>
        </div>
      </div>

      <div className="w-full mt-2 hidden lg:block">
        <button
          onClick={onClearFilters}
          disabled={activeFilterCount === 0}
          className={`w-full h-[48px] rounded-[8px] font-[Poppins] font-medium text-[16px] transition-all border outline-none ${
            activeFilterCount > 0
              ? 'bg-white border-[#0E1629] text-[#0E1629] hover:bg-[#F8F9FA]'
              : 'bg-[#F9F9F9] border-[#E6E6E6] text-[#A0A0A0] cursor-not-allowed'
          }`}
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
}