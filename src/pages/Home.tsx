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
// import Login from "./Login";

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
        {/* <Login/> */}

        </>
    );
}