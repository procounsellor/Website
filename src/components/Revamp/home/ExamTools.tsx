import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Mic,
  BookOpenCheck,
  Building2,
  Calculator,
  ClipboardList,
  FileText,
  GraduationCap,
  History,
  IndianRupee,
  Map as MapIcon,
  Search,
  Sparkles,
  Stethoscope,
  Target,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react";
import {
  EXAM_KEYS,
  EXAM_LABEL,
  EXAM_TOOLS,
  QUICK_CHECK,
  QUICK_LINKS,
  loadRecentTools,
  rememberTool,
  type ExamKey,
  type RecentTool,
} from "@/data/homeExams";
import { trackEvent } from "@/lib/analytics";
import { isMbaStudentRole, useAuthStore } from "@/store/AuthStore";
import { rememberIntendedCourse } from "@/lib/mbaCourse";
import toast from "react-hot-toast";
import SectionLabel from "./SectionLabel";

interface ExamToolsProps {
  exam: ExamKey;
  onExamChange: (exam: ExamKey) => void;
}

const TAB_HINT: Record<ExamKey, string> = {
  mba: "CAT · XAT · SNAP",
  neet: "MBBS · BDS",
  jee: "Main · MHT-CET",
};

// One icon per tool page (falls back to a sparkle).
const TOOL_ICON: Record<string, LucideIcon> = {
  "/cat-college-predictor": Target,
  "/cat-score-calculator": Calculator,
  "/free-cat-mock-test": BookOpenCheck,
  "/cat-previous-year-papers": FileText,
  "/mba-colleges/iim-cutoffs": BarChart3,
  "/mba-fees-roi-calculator": IndianRupee,
  "/neet-college-predictor": Target,
  "/neet-rank-predictor": TrendingUp,
  "/neet-cutoffs": BarChart3,
  "/neet-counselling": MapIcon,
  "/mbbs-colleges": Stethoscope,
  "/predictors": Sparkles,
  "/jee-college-predictor": Target,
  "/jee-rank-predictor": TrendingUp,
  "/mhtcet-college-predictor": ClipboardList,
  "/colleges": Building2,
  "/counsellor-listing": Users,
  "/mba/gdpi/live": Mic,
};

// Soft tint per position so the grid doesn't read as one flat block.
const TINTS = [
  "bg-[#EEF0FE] text-[#2F43F2]",
  "bg-[#FFF1E6] text-[#C2410C]",
  "bg-[#E8F7EE] text-[#146C43]",
  "bg-[#F3EEFF] text-[#6D28D9]",
  "bg-[#E6F4FB] text-[#0B6A94]",
  "bg-[#FDECF3] text-[#B4235F]",
];

/**
 * "Free tools for your exam": one place where every MBA, NEET and JEE tool is
 * visible, with a one-box college check that hands the score to the existing
 * predictor (they already read ?percentile= / ?rank= — see lib/predictorPrefill).
 */
export default function ExamTools({ exam, onExamChange }: ExamToolsProps) {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const [score, setScore] = useState("");
  const [error, setError] = useState("");
  const [recent, setRecent] = useState<RecentTool[]>([]);
  const check = QUICK_CHECK[exam];

  const inputRef = useRef<HTMLInputElement>(null);
  const tabRefs = useRef<Record<ExamKey, HTMLButtonElement | null>>({ mba: null, neet: null, jee: null });

  // Upcoming exam dates and their reminders now live in the hero.
  useEffect(() => {
    setRecent(loadRecentTools());
  }, []);

  // A new exam (tab, header link or saved choice) starts with an empty box.
  useEffect(() => {
    setScore("");
    setError("");
  }, [exam]);

  const { isAuthenticated, role, toggleLogin, setReturnToPath } = useAuthStore();

  // Tools inside the signed-in MBA app: a signed-out visitor would be bounced
  // to "/" by the app layout, so open the login and come back to the tool.
  const openAppTool = (e: React.MouseEvent, to: string) => {
    if (isAuthenticated && isMbaStudentRole(role)) return; // the Link navigates
    e.preventDefault();
    if (isAuthenticated) {
      toast("This is part of CAT prep, for accounts registered for MBA. Talk to a counsellor to switch your course.");
      return;
    }
    rememberIntendedCourse("MBA");
    setReturnToPath(to);
    toggleLogin();
  };

  const openTool = (label: string, to: string, location: string) => {
    // App pages need sign-in, so they don't go in the "pick up where you left off" row.
    if (!to.startsWith("/mba/")) rememberTool({ label, to, exam });
    trackEvent("home_tool_click", { exam, tool: label, location });
  };

  const selectExam = (next: ExamKey) => {
    if (next === exam) return;
    onExamChange(next);
    trackEvent("home_exam_selected", { exam: next, location: "exam_tools" });
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    let raw = score.trim();
    // Percentiles: "92,4" is a decimal comma. Ranks: "18,500" is a thousands separator.
    raw = !check.integer && /^\d{1,3},\d+$/.test(raw) ? raw.replace(",", ".") : raw.replace(/,/g, "");
    if (!raw) {
      trackEvent("home_quick_check", { exam, has_score: false });
      navigate(check.to);
      return;
    }
    const value = Number(raw);
    const valid =
      Number.isFinite(value) &&
      value >= check.min &&
      value <= check.max &&
      (!check.integer || Number.isInteger(value));
    if (!valid) {
      setError(
        check.integer
          ? `Enter a whole number between ${check.min.toLocaleString("en-IN")} and ${check.max.toLocaleString("en-IN")}.`
          : `Enter a number between ${check.min} and ${check.max}.`
      );
      inputRef.current?.focus();
      return;
    }
    trackEvent("home_quick_check", { exam, has_score: true });
    navigate(`${check.to}?${check.param}=${encodeURIComponent(String(value))}`);
  };

  const panelMotion = reduceMotion
    ? {}
    : { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -6 }, transition: { duration: 0.22, ease: "easeOut" as const } };

  return (
    <section
      id="exam-tools"
      aria-labelledby="exam-tools-heading"
      className="relative w-full overflow-hidden bg-white py-8 md:py-14 scroll-mt-28"
    >
      {/* Soft background glow — decoration only */}
      <div aria-hidden="true" className="pointer-events-none absolute -top-40 -right-40 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(47,67,242,0.12),transparent_65%)]" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-48 -left-40 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(250,102,15,0.10),transparent_65%)]" />

      <div className="relative max-w-7xl mx-auto px-4 md:px-8">
        <SectionLabel className="mb-4 border border-[#E3E7F0]">Free tools</SectionLabel>

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6 md:mb-8">
          <div>
            <h2 id="exam-tools-heading" className="font-[Poppins] font-bold text-[22px] md:text-[30px] text-[#0E1629] leading-tight">
              Free tools for your exam
            </h2>
            <p className="font-[Poppins] text-[14px] md:text-[16px] text-[#4B5563] mt-2">
              Predictors, cut-offs, mocks and guides — pick your exam.
            </p>
          </div>

          {/* Segmented control with a sliding highlight */}
          <div role="tablist" aria-label="Choose your exam" className="relative grid grid-cols-3 gap-1 bg-white border border-[#E3E7F0] rounded-[16px] p-1 w-full md:w-[440px] shadow-sm">
            {EXAM_KEYS.map((k) => {
              const active = k === exam;
              return (
                <button
                  key={k}
                  ref={(el) => {
                    tabRefs.current[k] = el;
                  }}
                  id={`exam-tab-${k}`}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-controls="exam-tools-panel"
                  tabIndex={active ? 0 : -1}
                  onClick={() => selectExam(k)}
                  onKeyDown={(e) => {
                    // Arrow keys move between exams (WAI-ARIA tabs pattern).
                    const i = EXAM_KEYS.indexOf(k);
                    let next: ExamKey | null = null;
                    if (e.key === "ArrowRight") next = EXAM_KEYS[(i + 1) % EXAM_KEYS.length];
                    if (e.key === "ArrowLeft") next = EXAM_KEYS[(i - 1 + EXAM_KEYS.length) % EXAM_KEYS.length];
                    if (e.key === "Home") next = EXAM_KEYS[0];
                    if (e.key === "End") next = EXAM_KEYS[EXAM_KEYS.length - 1];
                    if (!next) return;
                    e.preventDefault();
                    selectExam(next);
                    tabRefs.current[next]?.focus();
                  }}
                  className="relative font-[Poppins] rounded-[12px] px-2 py-2.5 text-center cursor-pointer"
                >
                  {active && (
                    <motion.span
                      layoutId={reduceMotion ? undefined : "exam-tab-pill"}
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                      className="absolute inset-0 rounded-[12px] bg-[#0E1629] shadow-[0_8px_20px_rgba(14,22,41,0.25)]"
                      aria-hidden="true"
                    />
                  )}
                  <span className={`relative block font-semibold text-[15px] md:text-[16px] leading-tight ${active ? "text-white" : "text-[#0E1629]"}`}>
                    {EXAM_LABEL[k]}
                  </span>
                  <span className={`relative block text-[10px] md:text-[11px] leading-tight mt-0.5 ${active ? "text-white/70" : "text-[#6B7280]"}`}>
                    {TAB_HINT[k]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {recent.length > 0 && (
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 font-[Poppins] text-[13px] font-medium text-[#4B5563] mr-1">
              <History className="w-4 h-4" aria-hidden="true" /> Pick up where you left off:
            </span>
            {recent.map((t) => (
              <Link
                key={t.to}
                to={t.to}
                onClick={() => trackEvent("home_tool_click", { exam: t.exam, tool: t.label, location: "recent" })}
                className="font-[Poppins] text-[13px] font-medium text-[#2F43F2] bg-[#EEF0FE] hover:bg-[#E0E4FD] rounded-full px-3.5 min-h-[40px] inline-flex items-center transition-colors"
              >
                {t.label} →
              </Link>
            ))}
          </div>
        )}

        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={exam} id="exam-tools-panel" role="tabpanel" aria-labelledby={`exam-tab-${exam}`} {...panelMotion}>
            {/* One-box college check */}
            <form
              onSubmit={submit}
              noValidate
              className="relative overflow-hidden rounded-[22px] p-5 md:p-7 flex flex-col lg:flex-row lg:items-end gap-4 bg-[#0E1629] shadow-[0_24px_60px_-20px_rgba(14,22,41,0.55)]"
            >
              <div aria-hidden="true" className="pointer-events-none absolute -top-24 right-10 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(47,67,242,0.55),transparent_65%)]" />
              <div aria-hidden="true" className="pointer-events-none absolute -bottom-28 left-0 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(250,102,15,0.30),transparent_65%)]" />
              <div className="relative lg:flex-1">
                <p className="font-[Poppins] font-semibold text-white text-[19px] md:text-[24px] leading-tight">
                  Which colleges can you get?
                </p>
                <p className="font-[Poppins] text-[#C3CBDD] text-[13px] md:text-[14px] mt-1">
                  Free, in 30 seconds · based on official cut-offs
                </p>
              </div>
              <label className="relative lg:w-[280px] flex flex-col gap-1.5">
                <span className="font-[Poppins] text-[12px] text-[#C3CBDD]">{check.label}</span>
                <span className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" aria-hidden="true" />
                  <input
                    ref={inputRef}
                    type="text"
                    inputMode={check.integer ? "numeric" : "decimal"}
                    value={score}
                    onChange={(e) => {
                      setScore(e.target.value);
                      if (error) setError("");
                    }}
                    placeholder={check.placeholder}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={error ? "quick-check-error" : undefined}
                    className="w-full h-12 rounded-[14px] bg-white pl-10 pr-4 font-[Poppins] text-[16px] text-[#0E1629] outline-none ring-2 ring-transparent focus-visible:ring-[#FDBA74] transition"
                  />
                </span>
              </label>
              <button
                type="submit"
                className="relative h-12 rounded-[14px] bg-gradient-to-r from-[#2F43F2] to-[#4F5FF7] hover:from-[#2437d1] hover:to-[#3F50EE] px-6 font-[Poppins] font-semibold text-[15px] text-white inline-flex items-center justify-center gap-2 cursor-pointer shadow-[0_10px_24px_-8px_rgba(47,67,242,0.8)] transition-all active:scale-[0.98]"
              >
                Check my colleges <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
              {error && (
                <p id="quick-check-error" role="alert" className="relative lg:absolute lg:left-7 lg:bottom-1.5 font-[Poppins] text-[13px] font-medium text-[#FDBA74]">
                  {error}
                </p>
              )}
            </form>

            {/* Tools */}
            <ul className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mt-4 md:mt-5">
              {EXAM_TOOLS[exam].map((t, i) => {
                const Icon = TOOL_ICON[t.to] ?? (t.to.includes("college") ? GraduationCap : Sparkles);
                return (
                  <li key={t.to + t.label}>
                    <Link
                      to={t.to}
                      onClick={(e) => {
                        openTool(t.label, t.to, "exam_tools");
                        if (t.mbaApp) openAppTool(e, t.to);
                      }}
                      className="group relative h-full bg-white/90 backdrop-blur border border-[#E3E7F0] rounded-[18px] p-4 md:p-5 flex flex-col gap-2 transition-all duration-200 hover:-translate-y-1 hover:border-transparent hover:shadow-[0_18px_40px_-14px_rgba(47,67,242,0.35)] hover:ring-2 hover:ring-[#2F43F2]/60 motion-reduce:hover:translate-y-0"
                    >
                      <span className="flex items-start justify-between gap-2">
                        <span className={`inline-flex h-10 w-10 md:h-11 md:w-11 items-center justify-center rounded-[12px] ${TINTS[i % TINTS.length]}`}>
                          <Icon className="w-5 h-5" aria-hidden="true" />
                        </span>
                        {/* Only the exception gets a badge; the section already says the tools are free. */}
                        {!t.free && (
                          <span className="font-[Poppins] text-[11px] md:text-[12px] font-semibold rounded-full px-2 py-0.5 bg-[#FFF4E5] text-[#9A4A00]">
                            Expert help
                          </span>
                        )}
                      </span>
                      <span className="font-[Poppins] font-semibold text-[14px] md:text-[16px] text-[#0E1629] leading-snug mt-1">
                        {t.label}
                      </span>
                      <span className="font-[Poppins] text-[12px] md:text-[14px] text-[#4B5563] leading-snug">{t.desc}</span>
                      <span className="mt-auto pt-1 inline-flex items-center gap-1 font-[Poppins] text-[13px] font-semibold text-[#2F43F2]">
                        Open
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Quick links */}
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <span className="font-[Poppins] text-[13px] text-[#4B5563] mr-1">Quick links:</span>
              {QUICK_LINKS[exam].map((l) => (
                <Link
                  key={l.to + l.label}
                  to={l.to}
                  onClick={() => openTool(l.label, l.to, "quick_links")}
                  className="font-[Poppins] text-[13px] font-medium text-[#0E1629] bg-white border border-[#E3E7F0] hover:border-[#2F43F2] hover:text-[#2F43F2] rounded-full px-3.5 min-h-[40px] inline-flex items-center transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
