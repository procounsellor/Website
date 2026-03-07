import { Suspense, lazy } from 'react';
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
import CollegeDetailsPage from '@/pages/CollegeDetails';
import CourseDetailsPage from '@/pages/CourseDetails';
import CommunityPage from '@/pages/CommunityPage';
import AnswerPage from '@/pages/AnswerPage';
import QuestionDetailPage from '@/pages/QuestionDetailPage';
import CoursePage from '@/pages/CoursePage';
import MyActivityPage from '@/pages/MyActivityPage';
import LandingPage from '@/pages/AdityaLandingPage';
import PromoPage from '@/pages/PromoPage';
import TestSeriesPromo from '@/pages/TestSeriesPromo';
import ClientProfilePage from '@/pages/ClientProfilePage';
import { CreateTest } from '@/pages/test/counsellor/CreateTest';
import { AddQuestion } from '@/pages/test/counsellor/AddQuestion';
import { TestInfo } from '@/pages/test/user/TestInfo';
import { TakeTest } from '@/pages/test/user/TakeTest';
import { TestResult } from '@/pages/test/user/TestResult';
import { TestAnalysisPage } from '@/pages/test/user/TestAnalysisPage';
import { CreateEditTestGroup } from '@/pages/test/counsellor/CreateEditTestGroup';
import { TestGroupDetails } from '@/pages/test/counsellor/TestGroupDetails';
import TestGroupDetailsPage from '@/pages/test/user/TestGroupDetailsPage';
import CollegeDetailsPageNew from '@/pages/CollegeDetailsPage';
import RevampLayout from '@/layouts/RevampLayout';
import ProBuddies from '@/pages/Revamp/ProBuddies';
import RevampAbout from '@/components/Revamp/about/RevampAbout';
import Admissions from '@/pages/Revamp/Admissions';
import Courses from '@/pages/Revamp/Courses';
import ProBuddiesRegistration from '@/pages/Revamp/ProBuddiesRegistration';
import CounsellorListingRevamp from '@/pages/Revamp/counsellorListing';
import CounsellorListingCards from '@/pages/Revamp/counsellorListingCards';

const CounselorListingPage = lazy(() => import('@/pages/counselors'));
const ExamsListingPage = lazy(() => import('@/pages/exams'));
const CounselorDetailsPage = lazy(() => import('@/pages/CounselorDetailsPage'));
const ExamDetailsPage = lazy(() => import('@/pages/ExamDetailsPage'));
const StudentDashboardPage = lazy(() => import('@/pages/StudentDashboardPage'));
const LiveSessionsPage = lazy(() => import('@/pages/LiveSessionsPage'));
const NotificationsPage = lazy(() => import('@/pages/NotificationsPage'));
const ProBuddyProfilePage = lazy(() => import('@/pages/ProBuddyProfilePage'));

export default function AppRoutes() {
    return (
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
                    {/* Standalone pages (no layout) */}
                    <Route path="/privacy1" element={<ExternalPrivacyPage />} />
                    <Route path="/term1" element={<ExternalTermsPage />} />
                    <Route path='/take-test/:testId' element={<TakeTest />} />
                    <Route path='/t/analysis/:testId/:attemptId' element={<TestAnalysisPage />} />

                    {/* All pages under RevampLayout */}
                    <Route element={<RevampLayout />}>
                        {/* Core Revamp Pages */}
                        <Route path="/" element={<Home />} />
                        <Route path='/admissions' element={<Admissions />} />
                        <Route path='/pro-buddies' element={<ProBuddies />} />
                        <Route path="/probuddy/profile/:id" element={<ProBuddyProfilePage />} />
                        <Route path='/revamp-courses' element={<Courses />} />
                        <Route path='/revamp-about' element={<RevampAbout />} />
                        <Route path='/pro-buddies/registration' element={<ProBuddiesRegistration />} />
                        <Route path='/counsellor-listing' element={<CounsellorListingRevamp />} />
                        <Route path='/counsellor-listing-cards' element={<CounsellorListingCards />} />

                        {/* Community */}
                        <Route path="/community" element={<CommunityPage />} />
                        <Route path="/community/question/:questionId" element={<QuestionDetailPage />} />
                        <Route path="/community/answer" element={<AnswerPage />} />
                        <Route path="/community/my-activity" element={<MyActivityPage />} />

                        {/* Counsellor */}
                        <Route path="/counsellors" element={<CounselorListingPage />} />
                        <Route path="/counsellor/:id" element={<CounselorDetailsPage />} />
                        <Route path="/counsellor-profile" element={<CounselorDetailsPage />} />

                        {/* Courses & Colleges */}
                        <Route path="/courses/:id" element={<CourseDetailsPage />} />
                        <Route path="/colleges/:id" element={<CollegeDetailsPage />} />
                        <Route path="/college-details/:id" element={<CollegeDetailsPageNew />} />
                        <Route path='/detail/:courseId/:role' element={<CoursePage />} />

                        {/* Exams */}
                        <Route path="/exams" element={<ExamsListingPage />} />
                        <Route path="/exams/:id" element={<ExamDetailsPage />} />

                        {/* Info / Static Pages */}
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/contact" element={<ContactPage />} />
                        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                        <Route path="/terms" element={<TermsPage />} />
                        <Route path="/cancellation-refund" element={<CancellationRefundPage />} />
                        <Route path="/shipping-exchange" element={<ShippingExchangePage />} />
                        <Route path="/sitemap" element={<SitemapPage />} />
                        <Route path="/add-college" element={<AddCollegePage />} />

                        {/* Landing / Promo */}
                        <Route path='/gurucool' element={<LandingPage />} />
                        <Route path='/promo' element={<PromoPage />} />
                        <Route path='/testSeries/pcsat' element={<TestSeriesPromo />} />

                        {/* Subscription / Notifications */}
                        <Route path='/subscribe' element={<SubscriptionPage />} />
                        <Route path="/notifications" element={<NotificationsPage />} />

                        {/* Counselor Dashboard */}
                        <Route path='/counsellor-dashboard' element={<CounselorDashboard />} />
                        <Route path='/counselor-dashboard/client-profile' element={<ClientProfilePage />} />

                        {/* Test Routes */}
                        <Route path='/create-test' element={<CreateTest />} />
                        <Route path='/add-question/:testId' element={<AddQuestion />} />
                        <Route path='/test-info/:testId' element={<TestInfo />} />
                        <Route path='/test-result/:testId' element={<TestResult />} />
                        <Route path='/t/result/:testId' element={<TestResult />} />

                        {/* Test Group Routes */}
                        <Route path='/counselor/test-groups/create' element={<CreateEditTestGroup />} />
                        <Route path='/counselor/test-groups/edit/:testGroupId' element={<CreateEditTestGroup />} />
                        <Route path='/counselor/test-groups/:testGroupId' element={<TestGroupDetails />} />
                        <Route path='/counselor/test-groups/:testGroupId/create-test' element={<CreateTest />} />
                        <Route path='/test-group/:testGroupId' element={<TestGroupDetailsPage />} />

                        {/* Protected Routes */}
                        <Route element={<ProtectedRoute />}>
                            <Route path='/dashboard-student' element={<StudentDashboardPage />} />
                            <Route path='/live-sessions' element={<LiveSessionsPage />} />
                            <Route path='/wallet' element={<RechargeWallet />} />
                        </Route>
                    </Route>
                </Routes>
            </Suspense>
        </>
    );
}