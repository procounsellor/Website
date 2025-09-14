import MainLayout from "@/layouts/MainLayout";
import Home from "@/pages/Home";
import CollegesListingPage from "@/pages/colleges";
import CounselorListingPage from "@/pages/counselors";
import CoursesListingPage from "@/pages/courses";
import ExamsListingPage from "@/pages/exams";
import { Routes, Route } from "react-router-dom";

export default function AppRoutes(){
    return(
         <Routes>
         <Route element={<MainLayout/>}>
            <Route path="/" element={<Home/>}/>
            <Route path="/counselors" element={<CounselorListingPage/>} />
            <Route path="/courses" element={<CoursesListingPage/>} />
            <Route path="/colleges" element={<CollegesListingPage />} />
            <Route path="/exams" element={<ExamsListingPage />} />
         </Route>
          </Routes>
    );
}