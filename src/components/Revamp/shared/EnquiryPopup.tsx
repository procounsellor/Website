import { useEffect, useState } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";
import { API_CONFIG } from "@/api/config";
import { captureLead } from "@/api/leads";
import { trackEvent } from "@/lib/analytics";
import { getTrackedSource, markLeadCaptured } from "@/lib/leadSource";
import { getPredictorSearch } from "@/lib/predictorIntent";
import { buildQuickLeadPayload, normalizeIndianMobile } from "@/lib/quickLead";
import { canonicalPath } from "@/lib/siteUrl.mjs";
import { useAuthStore } from "@/store/AuthStore";

const ENQUIRY_AUTO_SHOWN_KEY = "revamp-enquiry-auto-shown";
const SHOW_DELAY_MS = 14000;

export default function EnquiryPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const hasAutoShown = sessionStorage.getItem(ENQUIRY_AUTO_SHOWN_KEY) === "true";
    if (hasAutoShown) return;

    let timerId = 0;
    const show = () => {
      // Never on top of the login dialog, and not for someone signed in: they
      // are already a known lead. Checked when the timer fires, so logging in
      // during the wait also counts. (The side "Enquiry" tab still works.)
      const { isAuthenticated, isLoginToggle } = useAuthStore.getState();
      if (isAuthenticated || isLoginToggle) return;
      // Not while they are typing into a calculator or form: it stole the
      // click on "Calculate my score". Try again a little later instead.
      const active = document.activeElement;
      if ((active && /^(INPUT|TEXTAREA|SELECT)$/.test(active.tagName)) || document.querySelector("[data-login-prompt]")) {
        timerId = window.setTimeout(show, 10000);
        return;
      }
      setIsVisible(true);
      sessionStorage.setItem(ENQUIRY_AUTO_SHOWN_KEY, "true");
    };
    timerId = window.setTimeout(show, SHOW_DELAY_MS);

    return () => window.clearTimeout(timerId);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const mobile = normalizeIndianMobile(phone);

    if (!trimmedName || !trimmedEmail || !mobile) {
      toast.error("Please enter valid name, number, and email.");
      return;
    }

    // Two places, so neither depends on the other: the enquiry list this
    // popup always wrote to, and the CRM lead every other form on the site
    // files (with page, source and exam, retried and kept if the backend is
    // down). Before, a desktop enquiry reached the team with none of that.
    const { source, landingPage } = getTrackedSource();
    const pagePath = canonicalPath(pathname);
    const exam = getPredictorSearch()?.exam;
    const lead = buildQuickLeadPayload(
      { name: trimmedName, phone: mobile },
      { pagePath, intent: "Desktop enquiry popup", source, landingPage, exam },
    );
    lead.email = trimmedEmail;

    setIsSubmitting(true);
    const [enquiry, crm] = await Promise.allSettled([
      fetch(`${API_CONFIG.baseUrl}/api/shared/submitEnquiry`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ name: trimmedName, email: trimmedEmail, contact: mobile }),
      }).then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
      }),
      captureLead(lead),
    ]);
    setIsSubmitting(false);

    if (enquiry.status === "fulfilled" || crm.status === "fulfilled") {
      if (crm.status === "fulfilled") markLeadCaptured(mobile);
      trackEvent("generate_lead", { form_id: "enquiry_popup", page_path: pagePath, exam, lead_source: source || "direct" });
      toast.success("Thanks for your enquiry. We will contact you soon.");
      setIsVisible(false);
      setName("");
      setPhone("");
      setEmail("");
    } else {
      // The CRM lead is kept on this device and re-sent on the next visit.
      toast.error("Our server didn't respond. We've saved your details; for a call back now, phone +91 70047 89484.", { duration: 8000 });
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsVisible(true)}
        className="hidden md:flex fixed right-0 top-1/2 -translate-y-1/2 z-40 h-40 w-12 items-center justify-center rounded-l-2xl bg-[#0E1629] text-white font-poppins text-[13px] font-semibold tracking-[0.08em] cursor-pointer shadow-[-10px_10px_25px_rgba(14,22,41,0.3)] transition-colors hover:bg-[#1a2645]"
      >
        <span className="rotate-270 whitespace-nowrap">Enquiry</span>
      </button>

      {isVisible && (
        <div data-enquiry-popup="" className="hidden md:flex fixed inset-0 z-50 items-center justify-center bg-[#0E1629]/35 backdrop-blur-[2px]">
          <div className="w-107.5 rounded-2xl border border-[#DDE3F0] bg-white shadow-[0_24px_54px_rgba(14,22,41,0.25)] overflow-hidden">
            <div className="flex items-center justify-between bg-[#0E1629] px-5 py-4">
              <h3 className="font-poppins text-[17px] font-semibold text-white">
                Quick Enquiry
              </h3>
              <button
                type="button"
                onClick={handleClose}
                className="cursor-pointer rounded-full p-1 text-white/80 hover:bg-white/10 hover:text-white"
                aria-label="Close enquiry form"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-5">
              <p className="font-poppins text-[14px] text-[#6B7280]">
                Share your details and our team will contact you shortly.
              </p>

              <input
                type="text"
                name="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your name"
                className="h-12 rounded-xl border border-[#E5E7EB] px-4 font-poppins text-[14px] outline-none focus:border-[#2F43F2]"
              />

              <input
                type="tel"
                name="phone"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="Phone number"
                className="h-12 rounded-xl border border-[#E5E7EB] px-4 font-poppins text-[14px] outline-none focus:border-[#2F43F2]"
              />

              <input
                type="email"
                name="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Email address"
                className="h-12 rounded-xl border border-[#E5E7EB] px-4 font-poppins text-[14px] outline-none focus:border-[#2F43F2]"
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-1 h-12 cursor-pointer rounded-xl bg-[#2F43F2] font-poppins text-[15px] font-semibold text-white transition-colors hover:bg-[#2437d1] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
