import { Header } from "@/components";
import Footer from "@/components/layout/Footer";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { LoginCard } from "@/components/cards/LoginCard";
import OnboardingCard from "@/components/cards/OnboardingCard";
import { useAuthStore } from "@/store/AuthStore";
import { Toaster } from "react-hot-toast";
import { useChatStore } from "@/store/ChatStore";
import Chatbot from "@/components/chatbot/Chatbot";
import { useVoiceChatStore } from "@/store/VoiceChatStore";
import VoiceChat from "@/components/chatbot/VoiceChat";
import InfoModal from "@/components/counselor-signup/InfoModal";
import CounselorSignupModal from "@/components/counselor-signup/CounselorSignupModal.tsx";
import AppInstallBanner from "@/components/shared/AppInstallBanner";
import EditProfileModal from "@/components/student-dashboard/EditProfileModal";
import { useEffect, useState } from "react";
import { updateUserProfile } from "@/api/user";
import { useLiveStreamStore } from "@/store/LiveStreamStore";
import LiveStreamView from "@/components/live/userView";

// --- NEW: Internal Icon Components (Bypasses Cache) ---
const BotIconOpen = () => (
  <svg width="100%" height="100%" viewBox="0 0 181 155" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M90.5 0C66.4979 0 43.4789 8.16515 26.5068 22.6992C9.5348 37.2333 0 56.9457 0 77.4999C0 89.884 3.39723 101.608 9.44913 112.013C10.4145 113.682 10.5073 116.17 9.40272 120.041C8.8178 121.997 8.13651 123.93 7.36067 125.836L7.08221 126.52C6.39533 128.268 5.65277 130.176 5.09585 131.949C1.5501 143.291 13.6725 153.672 26.9087 150.636C28.9878 150.159 31.2063 149.523 33.2576 148.935L34.0558 148.697C36.2816 148.032 38.5391 147.449 40.8225 146.948C45.3428 145.994 48.2481 146.073 50.1973 146.908C62.7153 152.249 76.5142 155.02 90.5 155C140.484 155 181 120.304 181 77.4999C181 34.6961 140.484 0 90.5 0Z" fill="#FA660F"/>
    <path d="M115.253 72.4766C115.148 81.6181 106.66 89 96.2041 89C85.7481 88.9999 77.2613 81.6181 77.1562 72.4766H115.253Z" fill="white"/>
    <ellipse cx="51" cy="71.5" rx="16" ry="6.5" fill="white"/>
    <ellipse cx="140" cy="71.5" rx="16" ry="6.5" fill="white"/>
  </svg>
);

const BotIconClosed = () => (
  <svg width="100%" height="100%" viewBox="0 0 189 163" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M94.5 0C70.4979 0 47.4789 8.16515 30.5068 22.6992C13.5348 37.2333 4 56.9457 4 77.4999C4 89.884 7.39723 101.608 13.4491 112.013C14.4145 113.682 14.5073 116.17 13.4027 120.041C12.8178 121.997 12.1365 123.93 11.3607 125.836L11.0822 126.52C10.3953 128.268 9.65277 130.176 9.09585 131.949C5.5501 143.291 17.6725 153.672 30.9087 150.636C32.9878 150.159 35.2063 149.523 37.2576 148.935L38.0558 148.697C40.2816 148.032 42.5391 147.449 44.8225 146.948C49.3428 145.994 52.2481 146.073 54.1973 146.908C66.7153 152.249 80.5142 155.02 94.5 155C144.484 155 185 120.304 185 77.4999C185 34.6961 144.484 0 94.5 0Z" fill="#FA660F"/>
    <path d="M119.253 73.4775C119.148 90.3637 110.66 104 100.204 104C89.7483 104 81.2615 90.3636 81.1562 73.4775H119.253Z" fill="white"/>
    <ellipse cx="56" cy="73.5" rx="16" ry="15.5" fill="white"/>
    <ellipse cx="145" cy="73.5" rx="16" ry="15.5" fill="white"/>
  </svg>
);
// ----------------------------------------------------

export default function MainLayout() {
  const {
    isLoginToggle,
    isAuthenticated,
    needsOnboarding,
    needsProfileCompletion,
    isProfileCompletionOpen,
    toggleProfileCompletion,
    setIsProfileCompletionOpen,
    user,
    role,
    setNeedsOnboarding,
    setNeedsProfileCompletion,
    returnToPath,
    setReturnToPath,
    clearOnLoginSuccess,
  } = useAuthStore();
  const { refreshUser } = useAuthStore();
  const { isChatbotOpen, toggleChatbot } = useChatStore();
  const { isVoiceChatOpen } = useVoiceChatStore();
  const { isStreamActive } = useLiveStreamStore();
  const navigate = useNavigate();
  const location = useLocation();

  const [showFirstIcon, setShowFirstIcon] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowFirstIcon((prev) => !prev);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isAuthenticated && role === "counselor" && location.pathname === "/") {
      navigate("/counsellor-dashboard");
    }
  }, [isAuthenticated, role, location.pathname, navigate]);

  const shouldShowOnboarding =
    isAuthenticated &&
    (role === "student" || role === "user") &&
    needsOnboarding;

  useEffect(() => {
    if (isAuthenticated && needsProfileCompletion && !needsOnboarding) {
      toggleProfileCompletion();
    }
  }, [isAuthenticated, needsProfileCompletion, needsOnboarding]);

  const handleProfileUpdate = async (updatedData: {
    firstName: string;
    lastName: string;
    email: string;
  }) => {
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("jwt") : null;
      const uid =
        typeof window !== "undefined" ? localStorage.getItem("phone") : null;

      if (!uid || !token) {
        return;
      }

      await updateUserProfile(uid, updatedData, token);
      if (refreshUser) await refreshUser(true);

      setNeedsProfileCompletion(false);
      setIsProfileCompletionOpen(false);

      const store = useAuthStore.getState();

      if (store.pendingAction) {
        try {
          store.pendingAction();
        } catch (err) {
          console.error(
            "Failed executing pendingAction after profile update",
            err
          );
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
      console.error("❌ MainLayout: failed to update profile", err);
    }
  };

  const handleOnboardingComplete = () => {
    setNeedsOnboarding(false);

    if (user && (!user.firstName || !user.email)) {
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

  return (
    <div>
      <AppInstallBanner />
      <nav>
        <Header />
      </nav>

      <main>
        <Outlet />
      </main>

      <footer className="bottom-0 left-0 right-0">
        <Footer />
      </footer>

      {isLoginToggle && <LoginCard />}
      <InfoModal />
      <CounselorSignupModal />

      {shouldShowOnboarding && (
        <>
          <OnboardingCard onComplete={handleOnboardingComplete} />
        </>
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

      {/* Chatbot Toggle Button */}
      {!isStreamActive && location.pathname !== '/promo' && (
        <button
          onClick={toggleChatbot}
          // REMOVED 'bg-white' just in case it was there implicitly
          className="fixed bottom-6 right-6 z-50 flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95 bg-transparent"
          aria-label="Toggle Chatbot"
        >
          <div className="w-16 h-16 transition-opacity duration-200">
             {/* Using Inline Components Here */}
             {showFirstIcon ? <BotIconOpen /> : <BotIconClosed />}
          </div>
        </button>
      )}
      {isChatbotOpen && location.pathname !== '/promo' && <Chatbot />}
      {isVoiceChatOpen && <VoiceChat />}

      {isStreamActive && <LiveStreamView />}
    </div>
  );
}