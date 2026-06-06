import { useEffect, useState } from "react";
import { X, GraduationCap, Users, CalendarCheck } from "lucide-react";
import { useAuthStore } from "@/store/AuthStore";

const LOGIN_PROMPT_SHOWN_KEY = "revamp-login-prompt-shown";
const SHOW_DELAY_MS = 25000; // after the enquiry popup (14s) so they never overlap

export default function LoginPromptPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const { isAuthenticated, isLoginToggle, toggleLogin } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) return;

    const hasShown = sessionStorage.getItem(LOGIN_PROMPT_SHOWN_KEY) === "true";
    if (hasShown) return;

    const timerId = window.setTimeout(() => {
      setIsVisible(true);
      sessionStorage.setItem(LOGIN_PROMPT_SHOWN_KEY, "true");
    }, SHOW_DELAY_MS);

    return () => window.clearTimeout(timerId);
  }, [isAuthenticated]);

  // Never show over the login card or once logged in
  if (!isVisible || isAuthenticated || isLoginToggle) return null;

  const handleClose = () => setIsVisible(false);

  const handleLogin = () => {
    setIsVisible(false);
    toggleLogin();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0E1629]/35 backdrop-blur-[2px] p-4">
      <div className="w-full max-w-[430px] rounded-2xl border border-[#DDE3F0] bg-white shadow-[0_24px_54px_rgba(14,22,41,0.25)] overflow-hidden">
        <div className="flex items-center justify-between bg-[#0E1629] px-5 py-4">
          <h3 className="font-poppins text-[17px] font-semibold text-white">
            Get Free Counselling
          </h3>
          <button
            type="button"
            onClick={handleClose}
            className="cursor-pointer rounded-full p-1 text-white/80 hover:bg-white/10 hover:text-white"
            aria-label="Close login prompt"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-col gap-4 p-5">
          <p className="font-poppins text-[14px] text-[#6B7280]">
            Login to unlock personalised guidance for your admission journey — it
            takes less than a minute.
          </p>

          <div className="flex flex-col gap-2.5">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EEF1FE] text-[#2F43F2]">
                <Users className="h-4.5 w-4.5" />
              </span>
              <span className="font-poppins text-[13.5px] text-[#374151]">
                Talk to verified counsellors &amp; ProBuddies
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EEF1FE] text-[#2F43F2]">
                <GraduationCap className="h-4.5 w-4.5" />
              </span>
              <span className="font-poppins text-[13.5px] text-[#374151]">
                Personalised college &amp; course recommendations
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EEF1FE] text-[#2F43F2]">
                <CalendarCheck className="h-4.5 w-4.5" />
              </span>
              <span className="font-poppins text-[13.5px] text-[#374151]">
                Never miss an exam or admission deadline
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogin}
            className="mt-1 h-12 cursor-pointer rounded-xl bg-[#2F43F2] font-poppins text-[15px] font-semibold text-white transition-colors hover:bg-[#2437d1]"
          >
            Login / Sign Up
          </button>

          <button
            type="button"
            onClick={handleClose}
            className="cursor-pointer font-poppins text-[13px] text-[#6B7280] hover:text-[#374151]"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
