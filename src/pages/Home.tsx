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
import { useEffect } from "react";

export default function Home(){
    useEffect(() => {
      sessionStorage.setItem('page_referrer', '/');
    }, []);

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