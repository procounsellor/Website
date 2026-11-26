import { useEffect, useRef, useState, lazy, Suspense } from "react";
import Footer from "@/components/layout/Footer";
import SeoFooterLinks from "@/components/layout/SeoFooterLinks";
import RevampHeader from "@/components/Revamp/RevampHeader";
import RevampBreadcrumbs from "@/components/Revamp/RevampBreadcrumbs";
import { Navigate, Outlet, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Bot } from "lucide-react";
import { IS_PRERENDER } from "@/lib/clientReady";
import { useAuthStore } from "@/store/AuthStore";
import { useChatStore } from "@/store/ChatStore";
import EnquiryPopup from "@/components/Revamp/shared/EnquiryPopup";
import LoginPromptPopup from "@/components/Revamp/shared/LoginPromptPopup";
import InfoModal from "@/components/counselor-signup/InfoModal";
import CounselorSignupModal from "@/components/counselor-signup/CounselorSignupModal.tsx";
import AppInstallBanner from "@/components/shared/AppInstallBanner";

// Interaction-gated / conditional heavy components — lazy so they stay out of
// the main bundle that hydrates on every page load (Chatbot pulls in
// react-markdown; Lottie is a large animation lib; etc.).
const Lottie = lazy(() => import("lottie-react"));
const Chatbot = lazy(() => import("@/components/chatbot/Chatbot"));
const VoiceChat = lazy(() => import("@/components/chatbot/VoiceChat"));
const LiveStreamView = lazy(() => import("@/components/live/userView"));
const LoginCard = lazy(() => import("@/components/cards/LoginCard").then((m) => ({ default: m.LoginCard })));
const OnboardingCard = lazy(() => import("@/components/cards/OnboardingCard"));
const EditProfileModal = lazy(() => import("@/components/student-dashboard/EditProfileModal"));
import { useVoiceChatStore } from "@/store/VoiceChatStore";
import { useLiveStreamStore } from "@/store/LiveStreamStore";
import { updateUserProfile } from "@/api/user";
import { captureLeadFromUser } from "@/api/leads";

export default function RevampLayout() {
    const {
        isLoginToggle, role, isAuthenticated,
        needsOnboarding, needsProfileCompletion,
        isProfileCompletionOpen, toggleProfileCompletion,
        setIsProfileCompletionOpen, user, setNeedsOnboarding,
        setNeedsProfileCompletion, returnToPath, setReturnToPath,
        clearOnLoginSuccess, refreshUser,
    } = useAuthStore();
    const { isChatbotOpen, toggleChatbot } = useChatStore();
    const { isVoiceChatOpen } = useVoiceChatStore();
    const { isStreamActive } = useLiveStreamStore();
    const navigate = useNavigate();
    const location = useLocation();
    const [chatbotAnimation, setChatbotAnimation] = useState<object | null>(null);
    const prevAuthenticatedRef = useRef(false);
    const isFocusedPredictorPage = location.pathname === '/study-abroad/university-predictor';

    const shouldHideBanner =
        isFocusedPredictorPage ||
        location.pathname.includes('/test-info') ||
        location.pathname.includes('/test-result') ||
        location.pathname.includes('/t/');

    const isPromoPage = ['/promo', '/testSeries/pcsat', '/testSeries/kurukshetra', '/testSeries/grand-mock-test'].includes(location.pathname);

    const shouldShowOnboarding =
        isAuthenticated && (role === "student" || role === "user") && needsOnboarding;
    const isRestrictedDashboardRoute =
        location.pathname.startsWith('/pro-buddies/dashboard') ||
        location.pathname.startsWith('/counsellor-dashboard') ||
        location.pathname === '/about' ||
        location.pathname === '/contact' ||
        location.pathname === '/privacy-policy' ||
        location.pathname === '/terms' ||
        location.pathname === '/cancellation-refund' ||
        location.pathname === '/shipping-exchange';

    // The robot animation (chatbot.json + lottie-web, ~85 KB compressed) is
    // decoration: fetch it once the page has loaded and the browser is idle,
    // so it never competes with the page itself on a slow phone. Visitors who
    // ask for reduced motion keep the static icon.
    useEffect(() => {
        let isMounted = true;
        // Never during prerender: the saved HTML must show the static icon the
        // browser renders first (see lib/clientReady).
        if (IS_PRERENDER) return;
        if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
        let timer = 0;
        let idleId = 0;
        const load = () => {
            fetch("/chatbot.json")
                .then((response) => response.json())
                .then((data) => {
                    if (isMounted) setChatbotAnimation(data);
                })
                .catch(() => {
                    if (isMounted) setChatbotAnimation(null);
                });
        };
        const whenIdle = () => {
            timer = window.setTimeout(() => {
                if ('requestIdleCallback' in window) idleId = window.requestIdleCallback(load, { timeout: 4000 });
                else load();
            }, 2500);
        };
        if (document.readyState === 'complete') whenIdle();
        else window.addEventListener('load', whenIdle, { once: true });

        return () => {
            isMounted = false;
            window.removeEventListener('load', whenIdle);
            window.clearTimeout(timer);
            if (idleId && 'cancelIdleCallback' in window) window.cancelIdleCallback(idleId);
        };
    }, []);

    useEffect(() => {
        if (isAuthenticated && needsProfileCompletion && !needsOnboarding) {
            toggleProfileCompletion();
        }
    }, [isAuthenticated, needsProfileCompletion, needsOnboarding, toggleProfileCompletion]);

    const handleOnboardingComplete = () => {
        setNeedsOnboarding(false);
        if (user && !user.firstName) {
            setNeedsProfileCompletion(true);
            return;
        }
        const store = useAuthStore.getState();
        if (store.onLoginSuccess) {
            store.onLoginSuccess();
            clearOnLoginSuccess();
        } else if (returnToPath) {
            navigate(returnToPath);
            setReturnToPath(null);
        }
    };

    // A finished school-student signup resumes exactly like a finished course/
    // states onboarding: whatever the visitor was trying to do before the login
    // card interrupted them. `completeSchoolStudentSignup` has already fired and
    // cleared `onLoginSuccess`, so this only has to cover the returnToPath case.
    const handleSchoolStudentComplete = () => {
        setNeedsOnboarding(false);
        // Unlike a normal signup there is nothing to resume: whatever the
        // visitor was doing on the main site is not part of this role's app.
        clearOnLoginSuccess();
        setReturnToPath(null);
        navigate('/school-student/dashboard', { replace: true });
    };

    const handleProfileUpdate = async (updatedData: { firstName: string; lastName: string; email: string }) => {
        try {
            const token = typeof window !== "undefined" ? localStorage.getItem("jwt") : null;
            const uid = typeof window !== "undefined" ? localStorage.getItem("phone") : null;
            if (!uid || !token) return;
            await updateUserProfile(uid, updatedData, token);
            if (refreshUser) await refreshUser(true);

            // Enrich the captured lead with the completed profile (backend upserts by phone)
            captureLeadFromUser(useAuthStore.getState().user, uid, {
                update: true,
                extra: updatedData,
            });
            setNeedsProfileCompletion(false);
            setIsProfileCompletionOpen(false);
            const store = useAuthStore.getState();
            if (store.pendingAction) {
                try { store.pendingAction(); } catch (error) {
                    console.error("Pending action failed", error);
                }
                store.setPendingAction(null);
                return;
            }
            if (store.onLoginSuccess) {
                store.onLoginSuccess();
                clearOnLoginSuccess();
            } else if (returnToPath) {
                navigate(returnToPath);
                setReturnToPath(null);
            }
        } catch (err) {
            console.error("Failed to update profile", err);
        }
    };

    useEffect(() => {
        if (!isAuthenticated) {
            prevAuthenticatedRef.current = false;
            return;
        }

        const justLoggedIn = !prevAuthenticatedRef.current;
        prevAuthenticatedRef.current = true;

        // School students browse the app freely — they are not forced onto a
        // landing page the way a ProBuddy is. The exception is the handful of
        // pages served by /api/user/:id, which has no row for this role: those
        // would render an error state, so they land on the school-student
        // dashboard instead.
        if (role === 'schoolStudent' || role === 'mbaStudent') {
            // Handled by the render-time redirect below, which sends them to
            // their own shell without ever painting the site header.
            return;
        }

        if (role === 'proBuddy') {
            if (justLoggedIn) {
                navigate('/pro-buddies/dashboard', { replace: true });
                return;
            }
            const isAllowedPath =
                location.pathname === '/pro-buddies/dashboard' ||
                location.pathname.startsWith('/community') ||
                location.pathname === '/about' ||
                location.pathname === '/contact' ||
                location.pathname === '/privacy-policy' ||
                location.pathname === '/terms' ||
                location.pathname === '/cancellation-refund' ||
                location.pathname === '/shipping-exchange';
            if (!isAllowedPath) {
                navigate('/pro-buddies/dashboard', { replace: true });
            }
            return;
        }

        if (role === 'counselor') {
            if (justLoggedIn) {
                navigate('/counsellor-dashboard', { replace: true });
                return;
            }
            const isAllowedPath =
                location.pathname === '/counsellor-dashboard' ||
                location.pathname.startsWith('/counsellor-dashboard/') ||
                location.pathname.startsWith('/counselor-dashboard/') ||
                location.pathname.startsWith('/community') ||
                location.pathname.startsWith('/courses/detail/') ||
                location.pathname.startsWith('/detail/') ||
                location.pathname.startsWith('/counselor/test-groups') ||
                location.pathname.startsWith('/create-test') ||
                location.pathname.startsWith('/add-question/') ||
                location.pathname === '/about' ||
                location.pathname === '/contact' ||
                location.pathname === '/privacy-policy' ||
                location.pathname === '/terms' ||
                location.pathname === '/cancellation-refund' ||
                location.pathname === '/shipping-exchange';
            if (!isAllowedPath) {
                navigate('/counsellor-dashboard', { replace: true });
            }
        }
    }, [isAuthenticated, role, location.pathname, navigate]);

    const isRestrictedRole =
        isAuthenticated && (role === 'proBuddy' || role === 'counselor');

    const shouldShowFooter = !isPromoPage && (!isRestrictedRole || isRestrictedDashboardRoute);

    // School students do not live in this layout at all — they get their own
    // shell (SchoolStudentLayout), mounted on a sibling route. Redirecting at
    // render time rather than in an effect means the site header and footer are
    // never painted for them, not even for a frame.
    //
    // /mettle sits outside this layout, so the psychometric test — the one live
    // quest on their dashboard — stays reachable.
    if (isAuthenticated && role === 'schoolStudent') {
        return <Navigate to="/school-student/dashboard" replace />;
    }

    // MBA students likewise live in their own shell (MbaStudentLayout). If they
    // were on their way to an MBA tool (the home page's "Live AI mock
    // interview", or a course switch to MBA), take them there instead of the
    // dashboard; MbaStudentLayout clears returnToPath once it has mounted.
    if (isAuthenticated && role === 'mbaStudent') {
        const mbaTarget = returnToPath?.startsWith('/mba/') ? returnToPath : '/mba/dashboard';
        return <Navigate to={mbaTarget} replace />;
    }

    return <div className="flex flex-col min-h-screen relative">
        {!shouldHideBanner && <AppInstallBanner />}
        <RevampHeader />
        <RevampBreadcrumbs />
        <div className="flex-1">
            <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
                <Outlet />
            </motion.div>
        </div>
        {shouldShowFooter && <SeoFooterLinks />}
        {shouldShowFooter && <Footer />}
        {!isRestrictedRole && !isFocusedPredictorPage && <EnquiryPopup />}
        {!isAuthenticated && <LoginPromptPopup />}

        <Suspense fallback={null}>
        {isLoginToggle && <LoginCard />}
        <InfoModal />
        <CounselorSignupModal />

        {shouldShowOnboarding && (
            <OnboardingCard
                onComplete={handleOnboardingComplete}
                onSchoolStudentComplete={handleSchoolStudentComplete}
            />
        )}

        {isProfileCompletionOpen && user && (
            <EditProfileModal
                isOpen={isProfileCompletionOpen}
                onClose={() => {
                    setIsProfileCompletionOpen(false);
                    setNeedsProfileCompletion(false);
                }}
                user={user}
                onUpdate={handleProfileUpdate}
                onUploadComplete={() => {}}
            />
        )}

        {!isRestrictedRole && !isPromoPage && !isFocusedPredictorPage && (
            <button
                onClick={toggleChatbot}
                // The tap area is just the visible robot (64px). It used to be a
                // 128px box whose invisible edges caught taps meant for buttons
                // behind it (e.g. "Check my colleges" on small phones). The
                // animation is scaled up visually and ignores the pointer.
                className="fixed right-2 md:right-10 bottom-3 md:bottom-10 z-50 flex h-16 w-16 cursor-pointer items-center justify-center rounded-full transition-transform duration-300 hover:scale-110"
                aria-label="Toggle Chatbot"
            >
                {chatbotAnimation ? (
                    <Suspense fallback={<ChatbotIcon />}>
                        {/* A few loops to draw the eye, then it rests: an endless
                            animation keeps the phone repainting for as long as the
                            page is open. */}
                        <Lottie animationData={chatbotAnimation} loop={3} autoplay className="pointer-events-none h-full w-full scale-[2]" />
                    </Suspense>
                ) : (
                    <ChatbotIcon />
                )}
            </button>
        )}

        {!isRestrictedRole && !isPromoPage && !isFocusedPredictorPage && isChatbotOpen && <Chatbot />}
        {isVoiceChatOpen && <VoiceChat />}
        {isStreamActive && <LiveStreamView />}
        </Suspense>
    </div>
}

/** Shown until (or instead of) the robot animation. */
function ChatbotIcon() {
    return (
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#0E1629] text-white shadow-lg ring-4 ring-[#FA660F]/30">
            <Bot className="h-7 w-7" aria-hidden="true" />
        </span>
    );
}
