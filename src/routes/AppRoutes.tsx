import MainLayout from "@/layouts/MainLayout";
import Home from "@/pages/Home";
import CollegesListingPage from "@/pages/colleges";
import CounselorListingPage from "@/pages/counselors";
import CoursesListingPage from "@/pages/courses";
import ExamsListingPage from "@/pages/exams";
import { Routes, Route } from "react-router-dom";
import CounselorDetailsPage from "@/pages/CounselorDetailsPage";
import AboutPage from "@/pages/About";
import ContactPage from "@/pages/Contact";
import PrivacyPolicyPage from "@/pages/PrivacyPolicy";
import TermsPage from "@/pages/Terms";
import SitemapPage from "@/pages/Sitemap";
import AddCollegePage from "@/pages/AddCollege";
import StudentDashboardPage from "@/pages/StudentDashboardPage";



const CollegeDetail = () => <div className="p-8 text-center">College profile coming soon — full listing and admission details will appear here.</div>;
const CourseDetail = () => <div className="p-8 text-center">Course overview coming soon — syllabus, duration and career outcomes will appear here.</div>;

import ExamDetailsPage from "@/pages/ExamDetailsPage"

export default function AppRoutes(){
    return(
         <Routes>
         <Route element={<MainLayout/>}>
            <Route path="/" element={<Home/>}/>
            <Route path="/counselors" element={<CounselorListingPage/>} />
            {/*<Route path="/counselors/:id" element={<CounselorDetail/>} /> */}
            <Route path="/counselors/:id" element={<CounselorDetailsPage/>} />
            <Route path="/courses" element={<CoursesListingPage/>} />
            <Route path="/courses/:id" element={<CourseDetail/>} />
            <Route path="/colleges" element={<CollegesListingPage />} />
            <Route path="/colleges/:id" element={<CollegeDetail/>} />
            <Route path="/exams" element={<ExamsListingPage />} />
            <Route path="/about" element={<AboutPage/>} />
            <Route path="/contact" element={<ContactPage/>} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage/>} />
            <Route path="/terms" element={<TermsPage/>} />
            <Route path="/sitemap" element={<SitemapPage/>} />
            <Route path="/add-college" element={<AddCollegePage/>} />
            <Route path="/exams/:id" element={<ExamDetailsPage />} />
            <Route path="/dashboard/student" element={<StudentDashboardPage />} />

         </Route>
          </Routes>
    );
}