import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const EVENTS_DATA = [
  {
    title: "Aiyaswamy Cultural Competition",
    sections: [
      {
        heading: "Organizing Department",
        text: "Computer Science Department"
      },
      {
        heading: "Frequency",
        text: "Annual"
      },
      {
        heading: "Full Description",
        text: "A long running tradition at Sri Balaji University, the Aiyaswamy Cultural Competition, is held every year at the end of the induction period in the spacious Ranganathan Auditorium. The Aiyaswamy Cultural Competition was first introduced in the year 2015 before which it was known as the fresher's party. Except for the name, nothing much changed."
      }
    ]
  },
  {
    title: "Drishti",
    sections: [
      {
        heading: "Organizing Department",
        text: "Student Council & Tech Club"
      },
      {
        heading: "Frequency",
        text: "Bi-Annual"
      },
      {
        heading: "Full Description",
        text: "Drishti is the flagship technical festival that brings together the brightest minds from colleges across the country. It features hackathons, robotics challenges, coding competitions, and guest lectures from industry leaders. It provides a platform for students to showcase their technical prowess and innovation."
      }
    ]
  }
];

const EventsTab = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const handleToggle = (index: number) => {
    setOpenIndex(prevIndex => (prevIndex === index ? null : index));
  };

  return (
    <div className="flex flex-col gap-4 md:gap-6 w-full">
      {EVENTS_DATA.map((event, index) => {
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