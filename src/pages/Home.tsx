import { 
  AllCounselorSection,
  CollegeSection, 
  CounselorSection,
  CourseExamSection,
  DiscoverSection,
  ExamSection,
  Hero 
} from "@/components";
import AppInstallCard from "@/components/cards/AppInstallCard";

export default function Home(){
    return (
        <>
        <Hero/>
        <CounselorSection/>
        <DiscoverSection/>
        <AllCounselorSection/>
        <CourseExamSection/>
        <ExamSection/>
        <CollegeSection/>
        <AppInstallCard/>
        </>
    );
}