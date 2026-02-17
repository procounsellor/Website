import {
  AllCounselorSection,
  // CollegeSection, 
  CounselorSection,
  // CourseSection,
  // DiscoverSection,
  ExamSection,
  FreeCoursesSection,
  Hero,
  JEEPredictorSection,
} from "@/components";
import AppInstallCard from "@/components/cards/AppInstallCard";
import CourseBannerSection from "@/components/sections/CourseBannerSection";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    sessionStorage.setItem('page_referrer', '/');
  }, []);

  return (
    <>
      <Hero />
      <CounselorSection />
      {/* <DiscoverSection/> */}
      <CourseBannerSection />
      <JEEPredictorSection />
      <FreeCoursesSection />
      <AllCounselorSection />

      {/* <CourseSection/> */}
      <ExamSection />
      {/* <CollegeSection/> */}
      <AppInstallCard />
    </>
  );
}