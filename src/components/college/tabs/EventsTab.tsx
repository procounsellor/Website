import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { CollegeEvent } from '@/types/academic';

interface EventsTabProps {
  events?: CollegeEvent[];
}

// Real per-college events from getCollegeById. Previously hard-coded, so every
// college page listed the same two fictional festivals.
const EventsTab = ({ events = [] }: EventsTabProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const handleToggle = (index: number) => {
    setOpenIndex(prevIndex => (prevIndex === index ? null : index));
  };

  const items = events
    .map((event) => ({
      title: event.eventHeading?.trim() || '',
      sections: [
        { heading: 'Organizing Department', text: event.organizingDepartment },
        { heading: 'Frequency', text: event.frequency },
        { heading: 'Full Description', text: event.eventFullDescription },
      ].filter((section) => Boolean(section.text?.trim())),
    }))
    .filter((item) => item.title && item.sections.length > 0);

  if (items.length === 0) {
    return (
      <div className="p-4 min-h-[200px] rounded-lg flex items-center justify-center text-center text-[#718EBF] font-medium">
        Campus events for this college have not been published yet.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 md:gap-6 w-full">
      {items.map((event, index) => {
        const isOpen = openIndex === index;

        return (
          <div
            key={index}
            className="bg-white rounded-2xl border border-[#EFEFEF] shadow-[0px_0px_4px_0px_#23232326] overflow-hidden transition-all duration-300"
          >
            <button
              onClick={() => handleToggle(index)}
              className="w-full flex justify-between items-center p-3 md:p-4 bg-white text-left"
            >
              <span
                className="text-[#343C6A] font-semibold text-[16px] md:text-[20px] leading-[125%]"
                style={{ fontFamily: 'Montserrat' }}
              >
                {event.title}
              </span>
              {isOpen ? (
                <ChevronUp className="text-[#343C6A] w-5 h-5 md:w-6 md:h-6" />
              ) : (
                <ChevronDown className="text-[#343C6A] w-5 h-5 md:w-6 md:h-6" />
              )}
            </button>

            {isOpen && (
              <div className="px-3 pb-4 md:px-4 md:pb-6 flex flex-col gap-3 md:gap-4">
                {event.sections.map((section, secIndex) => (
                  <div key={secIndex} className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                       <span className="w-1.5 h-1.5 rounded-full bg-[#343C6A] mt-1 shrink-0"></span>
                       <span
                        className="text-[#343C6A] font-semibold text-[14px] md:text-[16px] leading-[125%]"
                        style={{ fontFamily: 'Montserrat' }}
                      >
                        {section.heading}
                      </span>
                    </div>

                    <p
                      className="text-[#718EBF] font-medium text-[14px] md:text-[16px] leading-[125%] pl-3.5"
                      style={{ fontFamily: 'Montserrat' }}
                    >
                      {section.text}
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

export default EventsTab;
