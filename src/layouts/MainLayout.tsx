import { Header } from "@/components";
import Footer from "@/components/layout/Footer";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { LoginCard } from "@/components/cards/LoginCard";
import OnboardingCard from "@/components/cards/OnboardingCard";
import { useAuthStore } from "@/store/AuthStore";
import { Toaster } from "react-hot-toast";
import { useChatStore } from "@/store/ChatStore";
import Chatbot from "@/components/chatbot/Chatbot";
import { MessageSquare } from "lucide-react";
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
    // Only show profile completion after onboarding is done
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
        // still close the modal to avoid blocking the user, but keep the flag so they can retry
        return;
      }

      // call API and wait for it to complete
      await updateUserProfile(uid, updatedData, token);

      // refresh user in the store so UI reflects latest profile
      if (refreshUser) await refreshUser(true);

      // close profile completion flow only after successful update
      setNeedsProfileCompletion(false);
      setIsProfileCompletionOpen(false);

      // Now execute the pending action (booking/subscription) if any
      const store = useAuthStore.getState();

      // Prefer executing a stored pendingAction (explicit action set by pages/components)
      if (store.pendingAction) {
        try {
          store.pendingAction();
        } catch (err) {
          console.error(
            "Failed executing pendingAction after profile update",
            err
          );
        }
        // clear the pending action
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

    // Check if we need profile completion
    if (user && (!user.firstName || !user.email)) {
      setNeedsProfileCompletion(true);
      // Don't execute onLoginSuccess yet, wait for profile completion
      return;
    }

    // If no profile completion needed, execute pending action
    const store = useAuthStore.getState();
    if (store.onLoginSuccess) {
      store.onLoginSuccess();
      // store.toggleLogin(); // Clear the callback
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
            // console.log('🚪 MainLayout: Closing profile modal via X button');
            // // Only allow closing if not mandatory or if profile is complete
            // if (!user.firstName || !user.email) {
            //   console.log('⚠️ Profile completion is mandatory, cannot close');
            //   return;
            // }
            setIsProfileCompletionOpen(false);
            setNeedsProfileCompletion(false);
          }}
          user={user}
          onUpdate={handleProfileUpdate}
          onUploadComplete={() => {}}
          // isMandatory={needsProfileCompletion}
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

      {/* Chatbot Toggle Button - Hidden on PromoPage */}
      {!isStreamActive && location.pathname !== '/promo' && (
        <button
          onClick={toggleChatbot}
          className="fixed bottom-6 right-6 bg-[#13097D] text-white p-4 rounded-full shadow-lg hover:bg-[#0d0659] transition-all duration-300 z-50 flex items-center justify-center"
          aria-label="Toggle Chatbot"
        >
          <MessageSquare className="w-6 h-6" />
        </button>
      )}
      {isChatbotOpen && location.pathname !== '/promo' && <Chatbot />}
      {isVoiceChatOpen && <VoiceChat />}

      {isStreamActive && <LiveStreamView />}
    </div>
  );
}
