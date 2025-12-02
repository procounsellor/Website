import { 
  AllCounselorSection,
  // CollegeSection, 
  CounselorSection,
  // CourseSection,
  DiscoverSection,
  ExamSection,
  Hero, 
} from "@/components";
import AppInstallCard from "@/components/cards/AppInstallCard";
import CourseBannerSection from "@/components/sections/CourseBannerSection";
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
        <CourseBannerSection/>
        {/* <CourseSection/> */}
        <ExamSection/>
        {/* <CollegeSection/> */}
        <AppInstallCard/>
        </>
    );
}