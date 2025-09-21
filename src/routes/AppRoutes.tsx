import MainLayout from "@/layouts/MainLayout";
import Home from "@/pages/Home";
import CollegesListingPage from "@/pages/colleges";
import CounselorListingPage from "@/pages/counselors";
import CoursesListingPage from "@/pages/courses";
import ExamsListingPage from "@/pages/exams";
import { Routes, Route } from "react-router-dom";
import CounselorDetailsPage from "@/pages/CounselorDetailsPage";
<<<<<<< HEAD
import AboutPage from "@/pages/About";
import ContactPage from "@/pages/Contact";
import PrivacyPolicyPage from "@/pages/PrivacyPolicy";
import TermsPage from "@/pages/Terms";
import SitemapPage from "@/pages/Sitemap";
import AddCollegePage from "@/pages/AddCollege";


// Placeholder components for detail pages
const ExamDetail = () => <div className="p-8 text-center">Exam detail coming soon — detailed syllabus and dates will appear here.</div>;
const CollegeDetail = () => <div className="p-8 text-center">College profile coming soon — full listing and admission details will appear here.</div>;
const CourseDetail = () => <div className="p-8 text-center">Course overview coming soon — syllabus, duration and career outcomes will appear here.</div>;
=======
import ExamDetailsPage from "@/pages/ExamDetailsPage"


// Placeholder components for detail pages
// const ExamDetail = () => <div className="p-8 text-center">Exam Detail Page - Coming Soon</div>;
const CollegeDetail = () => <div className="p-8 text-center">College Detail Page - Coming Soon</div>;
const CourseDetail = () => <div className="p-8 text-center">Course Detail Page - Coming Soon</div>;
>>>>>>> 6c864f0e34fc39e8ddc4e9db29b45d5f262c3187
{/*const CounselorDetail = () => <div className="p-8 text-center">Counselor Detail Page - Coming Soon</div>;*/}


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
<<<<<<< HEAD
            <Route path="/exams/:id" element={<ExamDetail/>} />
            <Route path="/about" element={<AboutPage/>} />
            <Route path="/contact" element={<ContactPage/>} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage/>} />
            <Route path="/terms" element={<TermsPage/>} />
            <Route path="/sitemap" element={<SitemapPage/>} />
            <Route path="/add-college" element={<AddCollegePage/>} />
=======
            <Route path="/exams/:id" element={<ExamDetailsPage />} />
>>>>>>> 6c864f0e34fc39e8ddc4e9db29b45d5f262c3187
         </Route>
          </Routes>
    );
}