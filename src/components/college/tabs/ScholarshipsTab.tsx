import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const SCHOLARSHIP_DATA = [
  {
    title: "Prof. M.S. Pillai Memorial Award",
    sections: [
      {
        heading: "Scholarship Amount",
        text: "The exact amount is announced annually"
      },
      {
        heading: "Eligibility Criteria",
        text: "This is a merit-based scholarship awarded to the top-ranking students in the first year of the MBA program. The selection is based on their academic performance (CGPA) and overall conduct during the first two semesters."
      },
      {
        heading: "Application Process",
        text: "The college automatically reviews the academic records (like CGPA) of all students after their first year. The top-performing students are then identified and given the award"
      }
    ]
  },
  {
    title: "Defence & Para-Military Personnel Dependents",
    sections: [
      {
        heading: "Scholarship Benefits",
        text: "50% waiver on tuition fees for the entire duration of the course, applicable to all undergraduate programs."
      },
      {
        heading: "Eligibility Criteria",
        text: "Wards of serving or retired personnel from the Army, Navy, Air Force, or Para-Military forces. A valid service certificate or pension payment order is required for verification."
      },
      {
        heading: "Application Process",
        text: "Candidates must submit the required documents during the admission process. Renewal depends on maintaining a minimum CGPA of 6.5 in subsequent semesters."
      }
    ]
  },
  {
    title: "Scholarships for Other Meritorious Students",
    sections: [
      {
        heading: "Scholarship Amount",
        text: "Up to 100% tuition fee waiver for top rankers in JEE Advanced and GATE examinations."
      },
      {
        heading: "Eligibility Criteria",
        text: "Students securing a rank within the top 500 in national level entrance exams. Additionally, students must demonstrate financial need with family income below 5 Lakhs per annum."
      },
      {
        heading: "Application Process",
        text: "Apply through the official scholarship portal at the start of the academic year. Shortlisted candidates will be called for a personal interview with the Dean of Student Affairs."
      }
    ]
  }
];

const ScholarshipsTab = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const handleToggle = (index: number) => {
    setOpenIndex(prevIndex => (prevIndex === index ? null : index));
  };

  return (
    <div className="flex flex-col gap-4 md:gap-6 w-full">
      {SCHOLARSHIP_DATA.map((item, index) => {
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
                {item.title}
              </span>
              {isOpen ? (
                <ChevronUp className="text-[#343C6A] w-5 h-5 md:w-6 md:h-6" />
              ) : (
                <ChevronDown className="text-[#343C6A] w-5 h-5 md:w-6 md:h-6" />
              )}
            </button>

            {isOpen && (
              <div className="px-3 pb-4 md:px-4 md:pb-6 flex flex-col gap-3 md:gap-4">
                {item.sections.map((section, secIndex) => (
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

export default ScholarshipsTab;