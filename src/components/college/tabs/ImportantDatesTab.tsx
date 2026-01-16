import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const DATES_DATA = [
  {
    title: "JEE Advanced 2026 Registration Starts",
    description: "Online registration for JEE (Advanced) 2026 begins. Candidates who have qualified JEE (Main) 2026 and meet the eligibility criteria can apply through the official portal."
  },
  {
    title: "JEE Advanced 2026 Admit Card Release",
    description: "Admit cards will be available for download from the official website. Candidates must carry a printed copy of the admit card along with a valid photo ID to the examination center."
  },
  {
    title: "JEE Advanced 2026 Examination Date",
    description: "The examination consists of two papers (Paper 1 and Paper 2) of three hours duration each. Both papers are compulsory. The exam will be held in computer-based test (CBT) mode."
  },
  {
    title: "Declaration of Results",
    description: "Results will be declared on the official website. Category-wise All India Ranks (AIR) will be available, and text messages will be sent to the registered mobile numbers of candidates."
  },
  {
    title: "JoSAA 2026 Counselling Begins",
    description: "Joint Seat Allocation Authority (JoSAA) counselling process starts. Candidates must fill their choices of courses and institutes in order of preference."
  }
];

const ImportantDatesTab = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const handleToggle = (index: number) => {
    setOpenIndex(prevIndex => (prevIndex === index ? null : index));
  };

  return (
    <div className="flex flex-col gap-4 md:gap-6 w-full">
      {DATES_DATA.map((item, index) => {
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
              <div className="px-3 pb-4 md:px-4 md:pb-6 border-t border-transparent">
                <p 
                  className="text-[#718EBF] font-medium text-[14px] md:text-[16px] leading-[150%]"
                  style={{ fontFamily: 'Poppins' }}
                >
                  {item.description}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ImportantDatesTab;