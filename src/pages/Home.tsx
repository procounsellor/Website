import { 
  AllCounselorSection,
  CollegeSection, 
  CounselorSection,
  CourseSection,
  DiscoverSection,
  ExamSection,
  Hero, 
  LoginCard
} from "@/components";
import AppInstallCard from "@/components/cards/AppInstallCard";
import { useAuthStore } from "@/store/AuthStore";
import OnboardingCard from '@/components/cards/OnboardingCard'; 

export default function Home(){
  const {isLoginToggle, isAuthenticated, userExist}= useAuthStore()
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
        {isLoginToggle && <LoginCard/>}
        {isAuthenticated && userExist && isLoginToggle &&  <OnboardingCard/>}
        </>
    );
}