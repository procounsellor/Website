import { Suspense, lazy } from 'react';
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
import RoleBasedRoute from "@/components/auth/RoleBasedRoute";
import ExternalPrivacyPage from "@/pages/external/Privacy";
import ExternalTermsPage from "@/pages/external/Terms";
import { Toaster } from 'react-hot-toast';
import { SubscriptionPage } from '@/pages/SubscriptionPage';
import RechargeWallet from '@/pages/RechargeWallet';
import CounselorDashboard from '@/pages/CounselorDashboard';
import CollegeDetailsPage from '@/pages/CollegeDetails';
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
import CollegeDetailsPageNew from '@/pages/CollegeDetailsPage';
import RevampLayout from '@/layouts/RevampLayout';
import TestGroupCardDetails from '@/components/Revamp/courses/TestGroupDetails';
import RevampAbout from '@/components/Revamp/about/RevampAbout';
import Admissions from '@/pages/Revamp/Admissions';
import Courses from '@/pages/Revamp/Courses';
import BlogsPage from '@/pages/Revamp/BlogsPage';
import BlogDetailPage from '@/pages/Revamp/BlogDetailPage';
import BlogCreatePage from '@/pages/Revamp/BlogCreatePage';
import BlogEditPage from '@/pages/Revamp/BlogEditPage';
import CounsellorsPage from '@/pages/Revamp/CounsellorsPage';
import UserProfile from '@/pages/Revamp/UserProfile';
import CourseListing from '@/pages/Revamp/CourseListing';
import TestListing from '@/pages/Revamp/TestListing';
import SessionListing from '@/pages/Revamp/SessionListing';
import ProBuddiesComingSoon from '@/pages/Revamp/ProBuddiesComingSoon';
import ProBuddiesRegistration from '@/pages/Revamp/ProBuddiesRegistration';
import ProBuddiesDashboard from '@/pages/Revamp/ProBuddiesDashboard';
import DeadlinesPage from '@/pages/Revamp/DeadlinesPage';
import DeadlineDetailPage from '@/pages/Revamp/DeadlineDetailPage';

const CounselorListingPage = lazy(() => import('@/pages/counselors'));
const ExamsListingPage = lazy(() => import('@/pages/exams'));
const CounselorDetailsPage = lazy(() => import('@/pages/CounselorDetailsPage'));
const RevampCounselorDetailsPage = lazy(() => import('@/pages/Revamp/RevampCounselorDetailsPage'));
const ExamDetailsPage = lazy(() => import('@/pages/ExamDetailsPage'));
const StudentDashboardPage = lazy(() => import('@/pages/StudentDashboardPage'));
const LiveSessionsPage = lazy(() => import('@/pages/LiveSessionsPage'));
const NotificationsPage = lazy(() => import('@/pages/NotificationsPage'));
const JEERankPredictorPage = lazy(() => import('@/pages/JEERankPredictor'));
const JEECollegePredictorPage = lazy(() => import('@/pages/JEECollegePredictor'));
const MHTCETCollegePredictorPage = lazy(() => import('@/pages/MHTCETCollegePredictor'));

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
                        <Route path="/" element={<Admissions />} />
                        <Route path='/admissions' element={<Admissions />} />
                        <Route path='/admissions/blogs' element={<BlogsPage />} />
                        <Route path='/admissions/blogs/new' element={<BlogCreatePage />} />
                        <Route path='/admissions/blogs/:id/edit' element={<BlogEditPage />} />
                        <Route path='/admissions/blogs/:id' element={<BlogDetailPage />} />
                        <Route path='/courses' element={<Courses />} />
                        <Route path='/courses/course-listing' element={<CourseListing />} />
                        <Route path='/courses/test-listing' element={<TestListing />} />
                        <Route path='/courses/session-listing' element={<SessionListing />} />
                        <Route path='/revamp-courses' element={<Courses />} />
                        <Route path='/revamp-courses/course-listing' element={<CourseListing />} />
                        <Route path='/revamp-courses/test-listing' element={<TestListing />} />
                        <Route path='/revamp-courses/session-listing' element={<SessionListing />} />
                        <Route path='/revamp-about' element={<RevampAbout />} />
                      
                        <Route path='/counsellor-listing' element={<CounsellorsPage />} />
                        <Route path='/counsellor-listing-cards' element={<CounsellorsPage />} />
                        <Route path="/counsellor-details/:id" element={<RevampCounselorDetailsPage />} />

                        <Route path='/admissions/deadlines' element={<DeadlinesPage />} />
                        <Route path='/admissions/deadlines/:id' element={<DeadlineDetailPage />} />

                        {/* probuddies pages  */}
                        <Route path='/pro-buddies/register' element={<ProBuddiesRegistration />} />
                        <Route path='/pro-buddies' element={<ProBuddiesComingSoon />} />
                        <Route path='/pro-buddies/listing' element={<ProBuddiesComingSoon />} />
                        <Route path='/pro-buddies/college-listing' element={<ProBuddiesComingSoon />} />
                        <Route path='/pro-buddies/dashboard' element={<ProBuddiesDashboard />} />
                        <Route path="/pro-buddies/profile/:id" element={<ProBuddiesComingSoon />} />


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
                        {/* <Route path="/courses/:id" element={<CourseDetailsPage />} /> */}
                        <Route path="/colleges/:id" element={<CollegeDetailsPage />} />
                        <Route path="/college-details/:id" element={<CollegeDetailsPageNew />} />
                        <Route path='/courses/detail/:courseId/:role' element={<CoursePage />} />
                        <Route path='/detail/:courseId/:role' element={<CoursePage />} />
                        <Route path='/jee-rank-predictor' element={<JEERankPredictorPage />} />
                        <Route path='/jee-college-predictor' element={<JEECollegePredictorPage />} />
                        <Route path='/mhtcet-college-predictor' element={<MHTCETCollegePredictorPage />} />

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
                        <Route element={<RoleBasedRoute allowedRoles={['counselor']} />}>
                          <Route path='/create-test' element={<CreateTest />} />
                          <Route path='/add-question/:testId' element={<AddQuestion />} />
                          <Route path='/counselor/test-groups/create' element={<CreateEditTestGroup />} />
                          <Route path='/counselor/test-groups/edit/:testGroupId' element={<CreateEditTestGroup />} />
                          <Route path='/counselor/test-groups/:testGroupId' element={<TestGroupDetails />} />
                          <Route path='/counselor/test-groups/:testGroupId/create-test' element={<CreateTest />} />
                        </Route>

                        {/* User Test Routes */}
                        <Route path='/test-info/:testId' element={<TestInfo />} />
                        <Route path='/test-result/:testId' element={<TestResult />} />
                        <Route path='/t/result/:testId' element={<TestResult />} />
                        <Route path='/courses/test-group/:testGroupId' element={<TestGroupCardDetails />} />
                        <Route path='/courses/test-groups/:testGroupId' element={<TestGroupCardDetails />} />
                        <Route path='/test-group/:testGroupId' element={<TestGroupCardDetails />} />
                        <Route path='/test-groups/:testGroupId' element={<TestGroupCardDetails />} />

                        {/* Protected Routes */}
                        <Route element={<ProtectedRoute />}>
                            <Route path='/dashboard-student' element={<StudentDashboardPage />} />
                            <Route path='/profile' element={<UserProfile/>}/>
                            <Route path='/live-sessions' element={<LiveSessionsPage />} />
                            <Route path='/wallet' element={<RechargeWallet />} />
                        </Route>
                    </Route>
                </Routes>
            </Suspense>
        </>
    );
}