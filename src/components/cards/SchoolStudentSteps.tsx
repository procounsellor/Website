import { useState } from "react";
import { Check, ChevronLeft, Loader2, School, User, X } from "lucide-react";
import type { SchoolStudentSignupPayload } from "@/api/auth";

/**
 * The classes this programme takes.
 *
 * Stops at 10: the fork into this form is the SSC course, and a student past
 * 10th is on the HSC track, which is the normal counsellor flow rather than
 * this one. The backend will accept 6-12, so the narrower list is a product
 * decision enforced here.
 */
const SCHOOL_CLASSES = ["6", "7", "8", "9", "10"] as const;

interface SchoolStudentDetailsStepProps {
  phoneNumber: string;
  onBack: () => void;
  onClose: () => void;
  onSubmit: (payload: SchoolStudentSignupPayload) => Promise<void>;
  isSubmitting: boolean;
}

/**
 * The one form in the school-student signup.
 *
 * Reached by picking the SSC tile in the course grid, so the student has
 * already told us what they are — this asks only for what the backend needs and
 * nothing more. The purple treatment matches the dashboard they land on, so the
 * signup and the app read as one product.
 */
export const SchoolStudentDetailsStep = ({
  phoneNumber,
  onBack,
  onClose,
  onSubmit,
  isSubmitting,
}: SchoolStudentDetailsStepProps) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [school, setSchool] = useState("");
  const [className, setClassName] = useState("");

  const isComplete =
    firstName.trim() !== "" &&
    lastName.trim() !== "" &&
    school.trim() !== "" &&
    className !== "";

  const handleSubmit = () => {
    if (!isComplete || isSubmitting) return;
    onSubmit({
      phoneNumber,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      school: school.trim(),
      className,
    });
  };

  const field =
    "h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-[15px] text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-[#6C4CF1] focus:ring-4 focus:ring-[#6C4CF1]/12";
  const label = "mb-1.5 block text-[12.5px] font-semibold text-gray-600";

  return (
    <form
      className="flex flex-col"
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      {/* Purple header band — the same gradient the dashboard hero uses. */}
      <div
        className="relative -mx-5 -mt-5 overflow-hidden rounded-t-2xl px-5 pt-5 pb-6 text-white md:-mx-7 md:-mt-7 md:px-7 md:pt-6"
        style={{ background: "linear-gradient(135deg, #7A5AF5 0%, #4C2FD3 100%)" }}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(80% 120% at 100% 0%, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 60%)",
          }}
        />
        <div className="relative flex items-start justify-between gap-4">
          <div className="min-w-0">
            <button
              type="button"
              onClick={onBack}
              disabled={isSubmitting}
              className="-ml-1 flex cursor-pointer items-center gap-1 text-[13px] font-medium text-white/70 transition-colors hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </button>
            <h1 className="mt-2 text-[22px] leading-tight font-extrabold md:text-[26px]">
              Let&apos;s set up your account
            </h1>
            <p className="mt-1 text-[13px] text-white/70">
              Just four things and you&apos;re in.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="-mt-1 -mr-1 shrink-0 cursor-pointer rounded-full p-2 text-white/70 transition-colors hover:bg-white/15 hover:text-white"
            aria-label="Close onboarding"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* The number itself is not shown. It is already verified by the time
            this form opens, so printing it back only puts a personal detail on
            screen — over a child's shoulder, in a screenshot, in a screen share
            — without telling them anything they did not just type in. The
            reassurance is what matters, so say that instead. */}
        {phoneNumber && (
          <p className="relative mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-[12px] font-semibold">
            <Check className="h-3.5 w-3.5" />
            Phone verified
          </p>
        )}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="ss-first-name" className={label}>
            First name
          </label>
          <div className="relative">
            <User className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              id="ss-first-name"
              type="text"
              autoComplete="given-name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Asha"
              className={`${field} pl-10`}
            />
          </div>
        </div>

        <div>
          <label htmlFor="ss-last-name" className={label}>
            Last name
          </label>
          <input
            id="ss-last-name"
            type="text"
            autoComplete="family-name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Kumar"
            className={field}
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="ss-school" className={label}>
            School name
          </label>
          <div className="relative">
            <School className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              id="ss-school"
              type="text"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              placeholder="Delhi Public School"
              className={`${field} pl-10`}
            />
          </div>
        </div>

        <div className="sm:col-span-2">
          <span className={label}>Which class are you in?</span>
          <div className="grid grid-cols-7 gap-2">
            {SCHOOL_CLASSES.map((option) => {
              const selected = className === option;
              return (
                <button
                  key={option}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setClassName(option)}
                  className={`h-12 cursor-pointer rounded-xl border-2 text-[15px] font-bold transition-all ${
                    selected
                      ? "border-transparent text-white shadow-[0_8px_18px_-8px_rgba(76,47,211,0.9)]"
                      : "border-gray-200 bg-white text-gray-600 hover:border-[#8B6CF8] hover:text-[#4C2FD3]"
                  }`}
                  style={
                    selected
                      ? { background: "linear-gradient(135deg, #7A5AF5 0%, #4C2FD3 100%)" }
                      : undefined
                  }
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={!isComplete || isSubmitting}
        className="mt-6 h-13 w-full cursor-pointer rounded-xl text-[15px] font-bold text-white transition-all disabled:cursor-not-allowed disabled:opacity-45"
        style={{
          height: 52,
          background: "linear-gradient(135deg, #7A5AF5 0%, #4C2FD3 100%)",
          boxShadow: isComplete ? "0 12px 26px -12px rgba(76,47,211,0.95)" : "none",
        }}
      >
        {isSubmitting ? <Loader2 className="mx-auto h-5 w-5 animate-spin" /> : "Start my journey →"}
      </button>
    </form>
  );
};
