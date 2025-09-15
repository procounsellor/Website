import { 
  AllCounselorSection,
  CollegeSection, 
  CounselorSection,
  CourseSection,
  DiscoverSection,
  ExamSection,
  Hero, 
} from "@/components";
import AppInstallCard from "@/components/cards/AppInstallCard";

export default function Home(){
    return (
        <>
        <Hero/>
        <CounselorSection/>
        <DiscoverSection/>
        <AllCounselorSection/>
        <CourseSection/>
        <ExamSection/>
        <CollegeSection/>
        <AppInstallCard/>
        </>
    );
}