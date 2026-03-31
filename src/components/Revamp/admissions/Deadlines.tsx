import FancyCard from "./DeadlinesCard";
import { SeeAllButton } from "../components/LeftRightButton";

export default function CollegeSection() {
  const deadlines = [
    {
      examName: "JEE Main",
      deadline: "March 15, 2026",
      details: "Joint Entrance Examination for admission to engineering colleges across India."
    },
    {
      examName: "NEET UG",
      deadline: "May 5, 2026",
      details: "National Eligibility cum Entrance Test for medical and dental courses."
    },
    {
      examName: "CAT",
      deadline: "November 28, 2026",
      details: "Common Admission Test for admission to MBA programs in IIMs and other B-schools."
    },
    {
      examName: "GATE",
      deadline: "February 10, 2026",
      details: "Graduate Aptitude Test in Engineering for postgraduate programs in engineering."
    }
  ];

  return (
    <div className="bg-[#C6DDF040] w-full py-6 md:py-[60px]">
      <div className="max-w-[1440px] mx-auto px-4 md:px-[60px]">
        
        {/* Mobile*/}
        <div className="md:hidden flex flex-col items-start justify-start gap-[12px] mb-6">
          <div className="flex items-center justify-center gap-[8px] bg-white px-[12px] py-[4px] rounded-[4px] w-[125px] h-[26px] shrink-0">
            <div className="w-[16px] h-[16px] min-w-[16px] min-h-[16px] bg-[#0E1629] shrink-0" />
            <p className="font-[Poppins] font-semibold text-[12px] text-[#0E1629] uppercase tracking-[0.07em] leading-none">
              DEADLINES
            </p>
          </div>
          <p className="font-[Poppins] font-medium text-[12px] text-[#0E1629] max-w-[350px] h-[54px] leading-none">
            Discover curated programs across mental wellness, assessments,
            admissions, and upskilling led by experienced professionals, built
            around your needs.
          </p>
        </div>

        <div className="hidden md:flex justify-between mb-8">
          <div className="flex items-start">
            <img src="/deadlines.svg" alt="icon_avg" className="items-start" />
          </div>

          <h1 className="text-(--text-main) text-2xl font-medium max-w-[682px]">
            Discover curated programs across mental wellness, assessments,
            admissions, and upskilling led by experienced professionals, built
            around your needs.
          </h1>
        </div>

        <div className="flex gap-[12px] md:gap-6 mb-6 md:mb-8 overflow-x-auto flex-nowrap md:flex-wrap md:overflow-visible justify-start md:justify-center [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-2">
          {deadlines.map((deadline, index) => (
            <div key={index} className="shrink-0">
                <FancyCard
                examName={deadline.examName}
                deadline={deadline.deadline}
                details={deadline.details}
                isWhite={index % 2 === 0}
                />
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-4 md:mt-0 pb-4 md:pb-0 w-full">
          <div className="scale-[0.85] md:scale-100 origin-center md:origin-right">
            <SeeAllButton
              text="See all"
              onClick={() => console.log('see all')}
            />
          </div>
        </div>

      </div>
    </div>
  );
}