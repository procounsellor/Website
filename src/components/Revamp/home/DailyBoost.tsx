import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { revealProps } from "./reveal";
import { Link } from "react-router-dom";
import { Bell, CheckCircle2, Circle, XCircle, Flame, ClipboardCheck, Lightbulb, X } from "lucide-react";
import QuickLeadForm from "@/components/leads/QuickLeadForm";
import LeadDialog from "./LeadDialog";
import SectionLabel from "./SectionLabel";
import {
  DAILY_QUESTIONS,
  EXAM_LABEL,
  MYTHS,
  NEXT_EXAM,
  WHATSAPP_CHAT_ENABLED,
  whatsappHref,
  dayIndex,
  daysUntil,
  type ExamKey,
} from "@/data/homeExams";
import { trackEvent } from "@/lib/analytics";

const card =
  "relative bg-white border border-[#E3E7F0] rounded-[20px] p-5 md:p-6 flex flex-col shadow-[0_1px_2px_rgba(14,22,41,0.04)] transition-shadow hover:shadow-[0_18px_40px_-18px_rgba(14,22,41,0.25)]";

/** A tiny confetti pop for a correct answer (CSS only; hidden for reduced motion). */
function Burst() {
  const colors = ["#2F43F2", "#FA660F", "#146C43", "#FDBA74", "#6D28D9"];
  return (
    <span aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2">
      {Array.from({ length: 14 }, (_, i) => {
        const angle = (i / 14) * Math.PI * 2;
        const dist = 60 + (i % 3) * 22;
        return (
          <span
            key={i}
            className="home-burst absolute h-2 w-2 rounded-[2px]"
            style={{
              background: colors[i % colors.length],
              ["--dx" as string]: `${Math.cos(angle) * dist}px`,
              ["--dy" as string]: `${Math.sin(angle) * dist}px`,
            }}
          />
        );
      })}
    </span>
  );
}
const eyebrow = "font-[Poppins] text-[12px] font-semibold uppercase tracking-wider";

/* ------------------------------------------------------------------ */
/* Question of the day                                                 */
/* ------------------------------------------------------------------ */

const ANSWER_KEY = "home-qotd-answers"; // { "2026-11-19:mba": 2 }
const STREAK_KEY = "home-qotd-streak"; // { last: "2026-11-19", count: 3 }

function todayKey(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage blocked: the answer just isn't remembered
  }
}

function QuestionOfTheDay({ exam }: { exam: ExamKey }) {
  const list = DAILY_QUESTIONS[exam];
  // Prerender and first client render: question 0, nothing answered. After
  // mount: today's question and this device's saved answers. The answer for
  // the current exam is derived from the map, so switching exam never shows
  // the previous exam's answer, even for one frame.
  const [mounted, setMounted] = useState(false);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    setMounted(true);
    setAnswers(readJson<Record<string, number>>(ANSWER_KEY, {}));
    // A streak only counts if the last answer was today or yesterday.
    const s = readJson<{ last: string; count: number }>(STREAK_KEY, { last: "", count: 0 });
    const y = new Date();
    y.setDate(y.getDate() - 1);
    setStreak(s.last === todayKey() || s.last === todayKey(y) ? s.count : 0);
  }, []);

  const index = mounted ? dayIndex(list.length) : 0;
  const saved = mounted ? answers[`${todayKey()}:${exam}`] : undefined;
  const picked = typeof saved === "number" ? saved : null;
  const q = list[index];

  const answer = (opt: number) => {
    if (picked !== null) return;
    const today = todayKey();
    const nextAnswers = { ...readJson<Record<string, number>>(ANSWER_KEY, {}), [`${today}:${exam}`]: opt };
    writeJson(ANSWER_KEY, nextAnswers);
    setAnswers(nextAnswers);

    const s = readJson<{ last: string; count: number }>(STREAK_KEY, { last: "", count: 0 });
    const y = new Date();
    y.setDate(y.getDate() - 1);
    const next = s.last === today ? s : { last: today, count: s.last === todayKey(y) ? s.count + 1 : 1 };
    writeJson(STREAK_KEY, next);
    setStreak(next.count);
    trackEvent("home_daily_question", { exam, correct: opt === q.answer });
  };

  return (
    <div className={card}>
      <div className="flex items-center justify-between gap-2">
        <p className={`${eyebrow} text-[#2F43F2]`}>{EXAM_LABEL[exam]} question of the day</p>
        {streak > 0 && (
          <span className="inline-flex items-center gap-1 font-[Poppins] text-[12px] font-semibold text-[#C2410C] bg-[#FFF1E6] rounded-full px-2 py-0.5">
            <Flame className="w-3.5 h-3.5" aria-hidden="true" />
            {streak}-day streak
          </span>
        )}
      </div>
      <p className="font-[Poppins] font-semibold text-[16px] md:text-[17px] text-[#0E1629] mt-3 leading-snug">{q.q}</p>
      <div className="grid grid-cols-2 gap-2 mt-4" role="group" aria-label="Answer options">
        {q.options.map((o, i) => {
          const isAnswer = i === q.answer;
          const isPicked = i === picked;
          const done = picked !== null;
          let tone = "border-[#E3E7F0] hover:border-[#2F43F2] text-[#0E1629]";
          if (done && isAnswer) tone = "border-[#146C43] bg-[#E8F7EE] text-[#146C43]";
          else if (done && isPicked) tone = "border-[#B42318] bg-[#FDECEC] text-[#B42318]";
          else if (done) tone = "border-[#E3E7F0] text-[#6B7280]";
          return (
            <button
              key={o}
              type="button"
              onClick={() => answer(i)}
              aria-disabled={done || undefined}
              aria-pressed={isPicked}
              className={`min-h-11 rounded-[12px] border px-3 py-2 font-[Poppins] text-[14px] font-medium text-left transition-colors ${tone} ${done ? "cursor-default" : "cursor-pointer"}`}
            >
              {o}
            </button>
          );
        })}
      </div>
      {picked !== null && picked === q.answer && <Burst key={`${exam}-${index}`} />}
      {picked !== null && (
        <div role="status" className="mt-3 font-[Poppins] text-[13px] text-[#374151] leading-snug">
          <p className={`inline-flex items-center gap-1.5 font-semibold ${picked === q.answer ? "text-[#146C43]" : "text-[#B42318]"}`}>
            {picked === q.answer ? <CheckCircle2 className="w-4 h-4" aria-hidden="true" /> : <XCircle className="w-4 h-4" aria-hidden="true" />}
            {picked === q.answer ? "Correct!" : `Answer: ${q.options[q.answer]}`}
          </p>
          <p className="mt-1">{q.why} Come back tomorrow for a new one.</p>
        </div>
      )}
      <p className="font-[Poppins] text-[11px] text-[#6B7280] mt-auto pt-3">Practice question, not from a past paper.</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Season card: CAT exam-day checklist / after-CAT steps / dates      */
/* ------------------------------------------------------------------ */

const CAT_BEFORE = [
  "Print your admit card. Check your slot, reporting time and test centre on it.",
  "Carry a valid original photo ID, as your admit card specifies.",
  "Visit or map the centre the day before. Plan to arrive well before reporting time.",
  "Leave phones, watches and calculators. An on-screen calculator and rough sheets are provided.",
  "Last few days: take a mock in your slot's time, revise your error log, sleep at your exam-day time.",
];

const CAT_AFTER = [
  { text: "Download your response sheet when the IIMs release it.", to: undefined },
  { text: "Work out your score with the CAT score calculator.", to: "/cat-score-calculator" },
  { text: "Check which IIMs' minimum percentiles you clear.", to: "/cat-college-predictor" },
  { text: "Apply to B-schools whose deadlines are still open.", to: "/mba-admission-deadlines" },
];

function SeasonCard({ exam, onReadiness }: { exam: ExamKey; onReadiness: () => void }) {
  const [days, setDays] = useState<number | null>(null);
  const [ticked, setTicked] = useState<number[]>([]);
  const [remind, setRemind] = useState(false);
  useEffect(() => {
    const iso = NEXT_EXAM.mba.date;
    setDays(iso ? daysUntil(iso) : null);
  }, []);

  // Outside CAT season (more than 60 days after the exam) the MBA card falls
  // back to the same "next big date" card as NEET/JEE.
  const catOver = exam === "mba" && days !== null && days < -60;
  if (exam !== "mba" || catOver) {
    const next = catOver ? { name: "Next MBA entrance exams" } : NEXT_EXAM[exam];
    return (
      <div className={card}>
        <p className={`${eyebrow} text-[#2F43F2]`}>Next big date</p>
        <p className="font-[Poppins] font-semibold text-[18px] text-[#0E1629] mt-3">{next.name}</p>
        <p className="font-[Poppins] text-[14px] text-[#4B5563] mt-1 leading-snug">
          The official dates aren't out yet. Leave your number and our team will let you know when they're announced —
          and help you plan registration.
        </p>
        <div className="mt-auto pt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setRemind(true)}
            className="inline-flex items-center justify-center gap-2 rounded-[12px] bg-[#2F43F2] hover:bg-[#2437d1] px-4 h-11 font-[Poppins] font-semibold text-[14px] text-white cursor-pointer"
          >
            <Bell className="w-4 h-4" aria-hidden="true" />
            Remind me when dates are out
          </button>
          <a href={whatsappHref(exam)} target="_blank" rel="noopener noreferrer" className="font-[Poppins] text-[14px] font-semibold text-[#146C43] hover:underline">
            {WHATSAPP_CHAT_ENABLED ? "or ask on WhatsApp" : "or follow on WhatsApp"}
          </a>
        </div>
        {remind && (
          <LeadDialog
            title={`Get ${next.name} date alerts`}
            subheading="Leave your number and a ProCounsel counsellor will let you know when the official dates are out, and help you plan registration. Free, no login needed."
            intent={`Exam date reminder: ${next.name}`}
            formId="home_exam_date_reminder"
            course={exam === "mba" ? "MBA" : exam === "neet" ? "Medical" : "Engineering"}
            exam={exam === "mba" ? "CAT" : EXAM_LABEL[exam]}
            onClose={() => setRemind(false)}
          />
        )}
      </div>
    );
  }

  const after = days !== null && days < 0;
  return (
    <div className={card}>
      <p className={`${eyebrow} text-[#C2410C] inline-flex items-center gap-1.5`}>
        <ClipboardCheck className="w-4 h-4" aria-hidden="true" />
        {after ? "After CAT: what to do next" : "CAT 2026 exam-day checklist"}
      </p>
      {after ? (
        <ol className="mt-3 space-y-2.5 font-[Poppins] text-[14px] text-[#0E1629]">
          {CAT_AFTER.map((s, i) => (
            <li key={s.text} className="flex gap-2.5">
              <span className="shrink-0 w-6 h-6 rounded-full bg-[#0E1629] text-white text-[12px] font-semibold flex items-center justify-center">{i + 1}</span>
              {s.to ? <Link to={s.to} className="underline underline-offset-2 hover:text-[#2F43F2]">{s.text}</Link> : <span>{s.text}</span>}
            </li>
          ))}
        </ol>
      ) : (
        <>
        <ul className="mt-3 space-y-1.5 font-[Poppins] text-[14px] text-[#0E1629]">
          {/* Tickable for this visit: the icons used to look like checkboxes but did nothing. */}
          {CAT_BEFORE.map((s, i) => {
            const done = ticked.includes(i);
            return (
              <li key={s}>
                <button
                  type="button"
                  aria-pressed={done}
                  onClick={() => setTicked((t) => (t.includes(i) ? t.filter((x) => x !== i) : [...t, i]))}
                  className="w-full flex gap-2.5 text-left leading-snug rounded-[10px] px-1.5 py-1 -mx-1.5 hover:bg-[#F5F7FB] cursor-pointer"
                >
                  {done ? (
                    <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-[#146C43]" aria-hidden="true" />
                  ) : (
                    <Circle className="w-5 h-5 shrink-0 mt-0.5 text-[#9CA3AF]" aria-hidden="true" />
                  )}
                  <span className={done ? "text-[#6B7280] line-through" : ""}>{s}</span>
                </button>
              </li>
            );
          })}
        </ul>
        <p className="font-[Poppins] text-[12px] text-[#4B5563] mt-2" aria-live="polite">
          {ticked.length} of {CAT_BEFORE.length} done
        </p>
        </>
      )}
      {!after && (
        <button
          type="button"
          onClick={onReadiness}
          className="mt-auto pt-4 w-full cursor-pointer"
        >
          <span className="flex items-center justify-center rounded-[12px] bg-[#2F43F2] hover:bg-[#2437d1] h-11 font-[Poppins] font-semibold text-[14px] text-white">
            Am I on track? Take the 1-minute check
          </span>
        </button>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Myth vs fact                                                        */
/* ------------------------------------------------------------------ */

function MythCard({ exam }: { exam: ExamKey }) {
  const list = MYTHS[exam];
  const [i, setI] = useState(0);
  useEffect(() => setI(dayIndex(list.length)), [exam, list.length]);
  const m = list[i % list.length];
  return (
    <div className={card}>
      <div className="flex items-center justify-between gap-2">
        <p className={`${eyebrow} text-[#2F43F2] inline-flex items-center gap-1.5`}>
          <Lightbulb className="w-4 h-4" aria-hidden="true" />
          Myth vs fact
        </p>
        {list.length > 1 && (
          <span className="font-[Poppins] text-[12px] text-[#4B5563]">
            {(i % list.length) + 1} of {list.length}
          </span>
        )}
      </div>
      <p className="font-[Poppins] text-[15px] text-[#B42318] mt-3 leading-snug">
        <span className="font-semibold">Myth:</span> <span className="line-through decoration-[#B42318]/50">{m.myth}</span>
      </p>
      <p className="font-[Poppins] text-[15px] text-[#0E1629] mt-2 leading-snug">
        <span className="font-semibold text-[#146C43]">Fact:</span> {m.fact}
      </p>
      <div className="mt-auto pt-4 flex items-center justify-between gap-3">
        {m.to ? (
          <Link to={m.to} className="font-[Poppins] text-[14px] font-semibold text-[#2F43F2] hover:underline">
            {m.link} →
          </Link>
        ) : (
          <span />
        )}
        {list.length > 1 && (
          <button
            type="button"
            onClick={() => setI((v) => (v + 1) % list.length)}
            className="font-[Poppins] text-[13px] font-medium text-[#0E1629] border border-[#E3E7F0] hover:border-[#2F43F2] rounded-full px-4 min-h-[40px] cursor-pointer"
          >
            Next myth
          </button>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* "Am I on track?" — CAT readiness check (runs in the browser only)   */
/* ------------------------------------------------------------------ */

const READINESS = [
  { q: "How many full-length CAT mocks have you taken?", options: ["None yet", "1–5", "6–15", "More than 15"], score: [0, 1, 2, 3] },
  { q: "Do you review each mock afterwards (mistakes, time per question)?", options: ["Rarely", "Sometimes", "Every time"], score: [0, 1, 2] },
  { q: "Which section worries you most?", options: ["VARC", "DILR", "Quant", "Not sure"], score: [0, 0, 0, 0] },
];

const SECTION_TIP: Record<string, string> = {
  VARC: "VARC: read one RC passage daily and attempt only the questions you're sure of — accuracy beats attempts.",
  DILR: "DILR: in the exam, spend the first few minutes picking the 2–3 easiest sets before solving any.",
  Quant: "Quant: revise your formula sheet and redo the questions you got wrong in mocks — don't start new topics now.",
  "Not sure": "Look at your last 3 mocks: the section with the lowest accuracy is the one to revise.",
};

function ReadinessCheck({ onClose }: { onClose: () => void }) {
  const [answers, setAnswers] = useState<(number | null)[]>([null, null, null]);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const resultRef = useRef<HTMLParagraphElement>(null);
  // Latest onClose without re-running the dialog effect (which would re-lock
  // scrolling and move focus) every time the parent re-renders.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);
  const done = answers.every((a) => a !== null);
  const total = done ? READINESS.reduce((sum, r, i) => sum + r.score[answers[i] as number], 0) : 0;
  const band = total >= 4 ? "On track" : total >= 2 ? "Almost there" : "Needs a plan";
  const section = done ? READINESS[2].options[answers[2] as number] : "";
  const noMocksYet = answers[0] === 0;

  useEffect(() => {
    if (done) trackEvent("home_readiness_check", { band });
  }, [done, band]);

  // Dialog behaviour: focus inside on open, Esc closes, Tab stays inside,
  // the page behind doesn't scroll, and focus returns to the opener on close.
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCloseRef.current();
        return;
      }
      if (e.key !== "Tab" || !dialogRef.current) return;
      const items = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      );
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      opener?.focus?.();
    };
  }, []);

  // When the result replaces the questions, move focus to it so it's announced.
  useEffect(() => {
    if (done) resultRef.current?.focus();
  }, [done]);

  const bandTip =
    band === "On track"
      ? "Keep your routine. One more full mock in your slot's time, then rest the day before."
      : band === "Almost there"
        ? "Take 2–3 more mocks before the exam and review each one properly — that's where the marks are."
        : "Don't panic — there's still time to improve. Take a free mock today and talk to a counsellor for a day-by-day plan.";

  // Portalled to <body>: the home section around it uses content-visibility,
  // whose paint containment would otherwise clip a full-screen overlay.
  return createPortal(
    <div className="fixed inset-0 z-[1000] bg-black/50 flex items-end md:items-center justify-center p-0 md:p-4" onClick={onClose}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="readiness-title"
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full md:max-w-[520px] rounded-t-[20px] md:rounded-[20px] p-5 md:p-7 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-start justify-between gap-3">
          <h3 id="readiness-title" className="font-[Poppins] font-semibold text-[20px] text-[#0E1629]">Am I on track for CAT?</h3>
          <button ref={closeRef} type="button" onClick={onClose} aria-label="Close" className="w-9 h-9 -mr-2 -mt-1 rounded-full hover:bg-[#F5F7FB] flex items-center justify-center cursor-pointer">
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {!done ? (
          <div className="mt-4 space-y-5">
            {READINESS.map((r, qi) => (
              <fieldset key={r.q}>
                <legend className="font-[Poppins] font-medium text-[15px] text-[#0E1629] mb-2">{qi + 1}. {r.q}</legend>
                <div className="flex flex-wrap gap-2">
                  {r.options.map((o, oi) => (
                    <button
                      key={o}
                      type="button"
                      aria-pressed={answers[qi] === oi}
                      onClick={() => setAnswers((prev) => prev.map((v, k) => (k === qi ? oi : v)))}
                      className={`min-h-10 rounded-full border px-4 font-[Poppins] text-[14px] cursor-pointer transition-colors ${
                        answers[qi] === oi ? "bg-[#0E1629] border-[#0E1629] text-white" : "border-[#E3E7F0] hover:border-[#2F43F2] text-[#0E1629]"
                      }`}
                    >
                      {o}
                    </button>
                  ))}
                </div>
              </fieldset>
            ))}
          </div>
        ) : (
          <div className="mt-4" role="status">
            <p className="font-[Poppins] text-[13px] text-[#4B5563]">Your result</p>
            <p ref={resultRef} tabIndex={-1} className={`font-[Poppins] font-bold text-[26px] outline-none ${band === "On track" ? "text-[#146C43]" : band === "Almost there" ? "text-[#2F43F2]" : "text-[#C2410C]"}`}>{band}</p>
            <ul className="mt-3 space-y-2 font-[Poppins] text-[14px] text-[#0E1629] leading-snug">
              <li className="flex gap-2"><CheckCircle2 className="w-4.5 h-4.5 shrink-0 mt-0.5 text-[#2F43F2]" aria-hidden="true" />{bandTip}</li>
              <li className="flex gap-2"><CheckCircle2 className="w-4.5 h-4.5 shrink-0 mt-0.5 text-[#2F43F2]" aria-hidden="true" />{noMocksYet && section === "Not sure"
                ? "Take one full mock first — your weakest section will show up there, and that's the one to revise."
                : SECTION_TIP[section]}</li>
            </ul>
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Link to="/free-cat-mock-test" onClick={onClose} className="h-11 rounded-[12px] bg-[#2F43F2] hover:bg-[#2437d1] text-white font-[Poppins] font-semibold text-[14px] flex items-center justify-center">
                Take a free mock
              </Link>
              <Link to="/counsellor-listing" onClick={onClose} className="h-11 rounded-[12px] border border-[#0E1629] text-[#0E1629] font-[Poppins] font-semibold text-[14px] flex items-center justify-center">
                Get a plan from a counsellor
              </Link>
            </div>
            {/* The moment a student hears "Needs a plan" is the best time to offer a call. */}
            <QuickLeadForm
              heading="Get a free day-by-day CAT plan"
              subheading="Leave your number and a ProCounsel MBA counsellor will call you with a plan for the days left before CAT. Free, no login needed."
              intent={`CAT readiness check: ${band}; weakest section: ${section}`}
              formId="home_readiness_check"
              course="MBA"
              exam="CAT"
              className="mt-5 border border-[#E3E7F0] shadow-none p-5"
            />
            <button type="button" onClick={() => setAnswers([null, null, null])} className="mt-3 font-[Poppins] text-[13px] text-[#4B5563] underline cursor-pointer">
              Start again
            </button>
          </div>
        )}
        <p className="font-[Poppins] text-[11px] text-[#6B7280] mt-5">Your answers stay on this device. Nothing is sent or saved.</p>
      </div>
    </div>,
    document.body,
  );
}

/* ------------------------------------------------------------------ */

export default function DailyBoost({ exam }: { exam: ExamKey }) {
  const [readinessOpen, setReadinessOpen] = useState(false);
  return (
    <section id="daily-boost" aria-labelledby="daily-boost-heading" className="w-full bg-white py-8 md:py-12 scroll-mt-28">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <SectionLabel className="mb-4 border border-[#E3E7F0]">Daily boost</SectionLabel>
        <h2 id="daily-boost-heading" className="font-[Poppins] font-bold text-[22px] md:text-[30px] text-[#0E1629] leading-tight mb-4 md:mb-6">
          Your daily {EXAM_LABEL[exam]} boost
        </h2>
        <motion.div {...revealProps} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <QuestionOfTheDay exam={exam} />
          <SeasonCard exam={exam} onReadiness={() => setReadinessOpen(true)} />
          <MythCard exam={exam} />
        </motion.div>
      </div>
      {readinessOpen && <ReadinessCheck onClose={() => setReadinessOpen(false)} />}
    </section>
  );
}
