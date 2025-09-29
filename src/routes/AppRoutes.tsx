
import { Suspense, lazy } from 'react';
import MainLayout from "@/layouts/MainLayout";
import Home from "@/pages/Home";
import { Routes, Route } from "react-router-dom";
import AboutPage from "@/pages/About";
import ContactPage from "@/pages/Contact";
import PrivacyPolicyPage from "@/pages/PrivacyPolicy";
import TermsPage from "@/pages/Terms";
import SitemapPage from "@/pages/Sitemap";
import AddCollegePage from "@/pages/AddCollege";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import ExternalPrivacyPage from "@/pages/external/Privacy";
import ExternalTermsPage from "@/pages/external/Terms";
import { SubscriptionPage } from '@/pages/SubscriptionPage';
import RechargeWallet from '@/pages/RechargeWallet';
const CollegesListingPage = lazy(() => import('@/pages/colleges'));
const CounselorListingPage = lazy(() => import('@/pages/counselors'));
const CoursesListingPage = lazy(() => import('@/pages/courses'));
const ExamsListingPage = lazy(() => import('@/pages/exams'));
const CounselorDetailsPage = lazy(() => import('@/pages/CounselorDetailsPage'));
const ExamDetailsPage = lazy(() => import('@/pages/ExamDetailsPage'));
const StudentDashboardPage = lazy(() => import('@/pages/StudentDashboardPage'));




const CollegeDetail = () => <div className="p-8 text-center">College profile coming soon — full listing and admission details will appear here.</div>;
const CourseDetail = () => <div className="p-8 text-center">Course overview coming soon — syllabus, duration and career outcomes will appear here.</div>;

export default function AppRoutes(){
    return(
                 <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
                     <Routes>
                        <Route path="/privacy1" element={<ExternalPrivacyPage/>} />
                        <Route path="/term1" element={<ExternalTermsPage/>} />
                        <Route element={<MainLayout/>}>
                                <Route path="/" element={<Home/>}/>
                                <Route path="/counselors" element={<CounselorListingPage/>} />
                                <Route path="/counselors/profile" element={<CounselorDetailsPage/>} />
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
                                <Route element={<ProtectedRoute/>}>
                                <Route path='/dashboard/student' element={<StudentDashboardPage/>}/>
                                <Route path='/subscribe' element={<SubscriptionPage/>}/>
                                <Route path='/wallet' element={<RechargeWallet/>}/>
                                </Route>
                         </Route>
                     </Routes>
                 </Suspense>
    );
}