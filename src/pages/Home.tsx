import { 
  AllCounselorSection,
  CollegeSection, 
  CounselorSection,
  CourseExamSection,
  DiscoverSection,
  ExamSection,
  Hero, 
  LoginCard
} from "@/components";
import AppInstallCard from "@/components/cards/AppInstallCard";
import { useAuthStore } from "@/store/AuthStore";

export default function Home(){
  const {isLoginToggle}= useAuthStore()
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
        {isLoginToggle && <LoginCard/>}
        </>
    );
}