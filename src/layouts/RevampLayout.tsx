import { useEffect, useState } from "react";
import Footer from "@/components/layout/Footer";
import RevampHeader from "@/components/Revamp/RevampHeader";
import RevampBreadcrumbs from "@/components/Revamp/RevampBreadcrumbs";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { LoginCard } from "@/components/cards/LoginCard";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "@/store/AuthStore";
import { useChatStore } from "@/store/ChatStore";
import Chatbot from "@/components/chatbot/Chatbot";
import Lottie from "lottie-react";
import EnquiryPopup from "@/components/Revamp/shared/EnquiryPopup";
import InfoModal from "@/components/counselor-signup/InfoModal";
import CounselorSignupModal from "@/components/counselor-signup/CounselorSignupModal.tsx";
import OnboardingCard from "@/components/cards/OnboardingCard";
import EditProfileModal from "@/components/student-dashboard/EditProfileModal";
import VoiceChat from "@/components/chatbot/VoiceChat";
import LiveStreamView from "@/components/live/userView";
import AppInstallBanner from "@/components/shared/AppInstallBanner";
import { useVoiceChatStore } from "@/store/VoiceChatStore";
import { useLiveStreamStore } from "@/store/LiveStreamStore";
import { updateUserProfile } from "@/api/user";

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

    const shouldHideBanner =
        location.pathname.includes('/test-info') ||
        location.pathname.includes('/test-result') ||
        location.pathname.includes('/t/');

    const isPromoPage = ['/promo', '/testSeries/pcsat', '/testSeries/kurukshetra', '/testSeries/grand-mock-test'].includes(location.pathname);

    const shouldShowOnboarding =
        isAuthenticated && (role === "student" || role === "user") && needsOnboarding;

    useEffect(() => {
        let isMounted = true;

        fetch("/chatbot.json")
            .then((response) => response.json())
            .then((data) => {
                if (isMounted) {
                    setChatbotAnimation(data);
                }
            })
            .catch(() => {
                if (isMounted) {
                    setChatbotAnimation(null);
                }
            });

        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        if (isAuthenticated && needsProfileCompletion && !needsOnboarding) {
            toggleProfileCompletion();
        }
    }, [isAuthenticated, needsProfileCompletion, needsOnboarding]);

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

    const handleProfileUpdate = async (updatedData: { firstName: string; lastName: string; email: string }) => {
        try {
            const token = typeof window !== "undefined" ? localStorage.getItem("jwt") : null;
            const uid = typeof window !== "undefined" ? localStorage.getItem("phone") : null;
            if (!uid || !token) return;
            await updateUserProfile(uid, updatedData, token);
            if (refreshUser) await refreshUser(true);
            setNeedsProfileCompletion(false);
            setIsProfileCompletionOpen(false);
            const store = useAuthStore.getState();
            if (store.pendingAction) {
                try { store.pendingAction(); } catch {}
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
            return;
        }

        if (role === 'proBuddy') {
            const isAllowedPath =
                location.pathname.startsWith('/community') ||
                location.pathname === '/pro-buddies/dashboard';

            if (!isAllowedPath) {
                navigate('/community', { replace: true });
                return;
            }

            return;
        }

        if (role === 'counselor') {
            const isAllowedPath =
                location.pathname.startsWith('/community') ||
                location.pathname === '/counsellor-dashboard';

            if (!isAllowedPath) {
                navigate('/community', { replace: true });
            }
        }
    }, [isAuthenticated, role, location.pathname, navigate]);

    const isRestrictedRole =
        isAuthenticated && (role === 'proBuddy' || role === 'counselor');

    return <div className="flex flex-col min-h-screen relative">
        {!shouldHideBanner && <AppInstallBanner />}
        <RevampHeader />
        <RevampBreadcrumbs />
        <div className="flex-1">
            <Outlet />
        </div>
        {!isRestrictedRole && !isPromoPage && <Footer />}
        {!isRestrictedRole && <EnquiryPopup />}

        {isLoginToggle && <LoginCard />}
        <InfoModal />
        <CounselorSignupModal />

        {shouldShowOnboarding && (
            <OnboardingCard onComplete={handleOnboardingComplete} />
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

        <Toaster
            position="top-center"
            toastOptions={{
                duration: 3000,
                style: {
                    background: "#363636",
                    color: "#fff",
                },
            }}
        />

        {!isRestrictedRole && !isPromoPage && (
            <button
                onClick={toggleChatbot}
                className="fixed right-0 md:right-6 bottom-1 md:bottom-6 z-50 flex h-32 w-32 cursor-pointer items-center justify-center transition-transform duration-300 hover:scale-110"
                aria-label="Toggle Chatbot"
            >
                {chatbotAnimation ? (
                    <Lottie animationData={chatbotAnimation} loop autoplay className="h-full w-full" />
                ) : (
                    <div className="h-16 w-16 rounded-full bg-[#0E1629]" />
                )}
            </button>
        )}

        {!isRestrictedRole && !isPromoPage && isChatbotOpen && <Chatbot />}
        {isVoiceChatOpen && <VoiceChat />}
        {isStreamActive && <LiveStreamView />}
    </div>
}
