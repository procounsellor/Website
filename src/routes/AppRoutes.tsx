import MainLayout from "@/layouts/MainLayout";
import Home from "@/pages/Home";
import CollegesListingPage from "@/pages/colleges";
import CounselorListingPage from "@/pages/counselors";
import CoursesListingPage from "@/pages/courses";
import ExamsListingPage from "@/pages/exams";
import { Routes, Route } from "react-router-dom";
import CounselorDetailsPage from "@/pages/CounselorDetailsPage";
import BookingConfirmationPage from '@/pages/BookingConfirmationPage';

// Placeholder components for detail pages
const ExamDetail = () => <div className="p-8 text-center">Exam Detail Page - Coming Soon</div>;
const CollegeDetail = () => <div className="p-8 text-center">College Detail Page - Coming Soon</div>;
const CourseDetail = () => <div className="p-8 text-center">Course Detail Page - Coming Soon</div>;
{/*const CounselorDetail = () => <div className="p-8 text-center">Counselor Detail Page - Coming Soon</div>;*/}


export default function AppRoutes(){
    return(
         <Routes>
         <Route element={<MainLayout/>}>
            <Route path="/" element={<Home/>}/>
            <Route path="/counselors" element={<CounselorListingPage/>} />
            {/*<Route path="/counselors/:id" element={<CounselorDetail/>} /> */}
            <Route path="/counselors/:id" element={<CounselorDetailsPage/>} />
            <Route path="/booking/confirmation" element={<BookingConfirmationPage/>} />
            <Route path="/courses" element={<CoursesListingPage/>} />
            <Route path="/courses/:id" element={<CourseDetail/>} />
            <Route path="/colleges" element={<CollegesListingPage />} />
            <Route path="/colleges/:id" element={<CollegeDetail/>} />
            <Route path="/exams" element={<ExamsListingPage />} />
            <Route path="/exams/:id" element={<ExamDetail/>} />
         </Route>
          </Routes>
    );
}