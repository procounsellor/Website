
import { Suspense, lazy } from 'react';
import MainLayout from "@/layouts/MainLayout";
import Home from "@/pages/Home";
import { Routes, Route } from "react-router-dom";
import AboutPage from "@/pages/About";
import ContactPage from "@/pages/Contact";
import PrivacyPolicyPage from "@/pages/PrivacyPolicy";
import TermsPage from "@/pages/Terms";
import SitemapPage from "@/pages/Sitemap";
import CancellationRefundPage from "@/pages/CancellationRefund";
import ShippingExchangePage from "@/pages/ShippingExchange";
import AddCollegePage from "@/pages/AddCollege";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import ExternalPrivacyPage from "@/pages/external/Privacy";
import ExternalTermsPage from "@/pages/external/Terms";
import { Toaster } from 'react-hot-toast';
import { SubscriptionPage } from '@/pages/SubscriptionPage';
import RechargeWallet from '@/pages/RechargeWallet';
import CounselorDashboard from '@/pages/CounselorDashboard';
import CounselorSignupPage from '@/pages/CounselorSignupPage';
import CollegeDetailsPage from '@/pages/CollegeDetails';
import CourseDetailsPage from '@/pages/CourseDetails';
const CollegesListingPage = lazy(() => import('@/pages/colleges'));
const CounselorListingPage = lazy(() => import('@/pages/counselors'));
const CoursesListingPage = lazy(() => import('@/pages/courses'));
const ExamsListingPage = lazy(() => import('@/pages/exams'));
const CounselorDetailsPage = lazy(() => import('@/pages/CounselorDetailsPage'));
const ExamDetailsPage = lazy(() => import('@/pages/ExamDetailsPage'));
const StudentDashboardPage = lazy(() => import('@/pages/StudentDashboardPage'));




export default function AppRoutes(){
    return(
        <>
        <Toaster 
                position="top-center"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: '#363636',
                        color: '#fff',
                    },
                }}
            />
                 <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
                     <Routes>
                        <Route path="/privacy1" element={<ExternalPrivacyPage/>} />
                        <Route path="/term1" element={<ExternalTermsPage/>} />
                        <Route element={<MainLayout/>}>
                                <Route path="/" element={<Home/>}/>
                                <Route path="/counsellors" element={<CounselorListingPage/>} />
                                <Route path="/counsellor-profile" element={<CounselorDetailsPage/>} />
                                <Route path="/courses" element={<CoursesListingPage/>} />
                                <Route path="/courses/:id" element={<CourseDetailsPage/>} />
                                <Route path="/colleges" element={<CollegesListingPage />} />
                                <Route path="/colleges/:id" element={<CollegeDetailsPage/>} />
                                <Route path="/exams" element={<ExamsListingPage />} />
                                <Route path="/about" element={<AboutPage/>} />
                                <Route path="/contact" element={<ContactPage/>} />
                                <Route path="/privacy-policy" element={<PrivacyPolicyPage/>} />
                                <Route path="/terms" element={<TermsPage/>} />
                                <Route path="/cancellation-refund" element={<CancellationRefundPage/>} />
                                <Route path="/shipping-exchange" element={<ShippingExchangePage/>} />
                                <Route path="/sitemap" element={<SitemapPage/>} />
                                <Route path="/add-college" element={<AddCollegePage/>} />
                                <Route path="/exams/:id" element={<ExamDetailsPage />} />
                                <Route path='/subscribe' element={<SubscriptionPage/>}/>
                                <Route path='/counsellor-dashboard' element={<CounselorDashboard/>}/>
                                <Route element={<ProtectedRoute/>}>
                                <Route path='/dashboard-student' element={<StudentDashboardPage/>}/>
                                <Route path='/wallet' element={<RechargeWallet/>}/>
                                </Route>
                         </Route>
                     </Routes>
                 </Suspense>
        </>
    );
}