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
import LoginModal from "@/components/cards/LoginModal";

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
        <LoginModal/>
        </>
    );
}