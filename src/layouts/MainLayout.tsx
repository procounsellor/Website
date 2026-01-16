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
import { useEffect } from "react";
import { updateUserProfile } from "@/api/user";
import { useLiveStreamStore } from "@/store/LiveStreamStore";
import LiveStreamView from "@/components/live/userView";
import { MessageSquare } from "lucide-react";

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
  const authUser = useAuthStore(s => s.user)
  const { refreshUser } = useAuthStore();
  const { isChatbotOpen, toggleChatbot } = useChatStore();
  const { isVoiceChatOpen } = useVoiceChatStore();
  const { isStreamActive } = useLiveStreamStore();
  const navigate = useNavigate();
  const location = useLocation();

  const isCollegeDetailsPage = location.pathname.includes('/colleges-details');

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
        { location.pathname == '/t' && (<Footer />) 
        }
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
      {!isStreamActive && location.pathname !== '/promo' || location.pathname !== '/t' &&  (authUser?.role.trim().toLowerCase() == 'counsellor' ? authUser?.verified: true) && (
        <button
          onClick={toggleChatbot}
          className={`fixed right-6 cursor-pointer bg-[#FA660F] text-white w-16 h-16 flex items-center justify-center rounded-full shadow-lg z-50 hover:bg-orange-600 transition-all duration-300 transform hover:scale-110 
            ${isCollegeDetailsPage ? 'bottom-18 md:bottom-6' : 'bottom-6'}`}
          aria-label="Toggle Chatbot"
        >
           <MessageSquare size={32} />
        </button>
      )}
      {isChatbotOpen && location.pathname !== '/promo' && <Chatbot />}
      {isVoiceChatOpen && <VoiceChat />}

      {isStreamActive && <LiveStreamView />}
    </div>
  );
}