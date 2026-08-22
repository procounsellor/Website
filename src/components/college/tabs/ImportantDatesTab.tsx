import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { ImportantDate } from '@/types/academic';

interface ImportantDatesTabProps {
  importantDates?: ImportantDate[];
}

// Real admission timeline for this college. Previously a hard-coded JEE
// Advanced schedule that was shown on every college page regardless of exam.
const ImportantDatesTab = ({ importantDates = [] }: ImportantDatesTabProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const handleToggle = (index: number) => {
    setOpenIndex(prevIndex => (prevIndex === index ? null : index));
  };

  const items = importantDates
    .map((entry) => ({
      title: entry.event?.trim() || '',
      details: (entry.details || []).filter((d) => d?.stage?.trim() || d?.date?.trim()),
    }))
    .filter((item) => item.title && item.details.length > 0);

  if (items.length === 0) {
    return (
      <div className="p-4 min-h-[200px] rounded-lg flex items-center justify-center text-center text-[#718EBF] font-medium">
        Admission dates for this college have not been announced yet. Check the
        <span className="px-1" />
        <a href="/admissions/deadlines" className="underline">exam deadline tracker</a>
        <span className="px-1" />
        for the latest schedule.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 md:gap-6 w-full">
      {items.map((item, index) => {
        const isOpen = openIndex === index;

        return (
          <div
            key={index}
            className="bg-white rounded-2xl border border-[#EFEFEF] shadow-[0px_0px_4px_0px_#23232326] overflow-hidden transition-all duration-300"
          >
            <button
              onClick={() => handleToggle(index)}
              className="w-full flex justify-between items-center p-3 md:p-4 bg-white text-left cursor-pointer"
            >
              <span
                className="text-[#343C6A] font-semibold text-[16px] md:text-[20px] leading-[125%] pr-4"
                style={{ fontFamily: 'Poppins' }}
              >
                {item.title}
              </span>
              {isOpen ? (
                <ChevronUp className="text-[#343C6A] w-5 h-5 md:w-6 md:h-6 shrink-0" />
              ) : (
                <ChevronDown className="text-[#343C6A] w-5 h-5 md:w-6 md:h-6 shrink-0" />
              )}
            </button>

            {isOpen && (
              <div className="px-3 pb-4 md:px-4 md:pb-6 flex flex-col gap-2 md:gap-3">
                {item.details.map((detail, detailIndex) => (
                  <div key={detailIndex} className="flex items-baseline gap-3">
                    <span
                      className="text-[#343C6A] font-semibold text-[14px] md:text-[16px] leading-[150%] min-w-[110px] md:min-w-[150px] shrink-0"
                      style={{ fontFamily: 'Poppins' }}
                    >
                      {detail.date}
                    </span>
                    <p
                      className="text-[#718EBF] font-medium text-[14px] md:text-[16px] leading-[150%]"
                      style={{ fontFamily: 'Poppins' }}
                    >
                      {detail.stage}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ImportantDatesTab;
