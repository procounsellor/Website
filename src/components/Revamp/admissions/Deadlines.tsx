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
    <div className="bg-[#C6DDF040] w-full py-[60px]">
      <div className="max-w-[1440px] mx-auto px-[60px]">
        <div className="flex justify-between mb-8">
          <div className="flex items-start">
            <img src="/deadlines.svg" alt="icon_avg" className="items-start" />
          </div>

          <h1 className="text-(--text-main) text-2xl font-medium max-w-[682px]">
            Discover curated programs across mental wellness, assessments,
            admissions, and upskilling led by experienced professionals, built
            around your needs.
          </h1>
        </div>

        <div className="flex gap-6 mb-8 flex-wrap justify-center">
          {deadlines.map((deadline, index) => (
            <FancyCard
              key={index}
              examName={deadline.examName}
              deadline={deadline.deadline}
              details={deadline.details}
              isWhite={index % 2 === 0}
            />
          ))}
        </div>

        <div className="flex justify-end">
          <SeeAllButton
            text="See all"
            onClick={() => console.log('see all')}
          />
        </div>
      </div>
    </div>
  );
}
