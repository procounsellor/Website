import { useEffect, useState } from "react";
import { IS_PRERENDER } from "@/lib/clientReady";
import { Link } from "react-router-dom";
import { NEXT_EXAM, daysUntil, formatExamDay, type ExamKey } from "@/data/homeExams";

interface StripContent {
  text: string;
  /** Short highlighted badge, e.g. "10 days to go". */
  badge?: string;
  links: { label: string; to: string }[];
}

const CAT_ISO = NEXT_EXAM.mba.date ?? "";
const CHECKLIST = { label: "Exam-day checklist", to: "/?exam=mba#daily-boost" };

/** The pre-exam strip without the day count: identical in the prerender and the first client render. */
const BEFORE: StripContent = {
  text: CAT_ISO ? `${NEXT_EXAM.mba.name} · ${formatExamDay(CAT_ISO)}` : NEXT_EXAM.mba.name,
  links: [
    { label: "Free mocks", to: "/free-cat-mock-test" },
    { label: "Past papers", to: "/cat-previous-year-papers" },
    CHECKLIST,
  ],
};

/**
 * What the CAT strip says on a given day: a countdown before the exam, good
 * luck on the day, and the score calculator for 60 days after it. Outside that
 * window the strip is not shown.
 */
function catStrip(now: Date): StripContent | null {
  if (!CAT_ISO) return null;
  const d = daysUntil(CAT_ISO, now);
  if (d > 1) return { ...BEFORE, badge: `${d} days to go` };
  if (d === 1) return { text: `${NEXT_EXAM.mba.name} is tomorrow. You've got this.`, badge: "Tomorrow", links: [CHECKLIST] };
  if (d === 0) return { text: `All the best for ${NEXT_EXAM.mba.name} today!`, badge: "Today", links: [CHECKLIST] };
  if (d >= -60) {
    return {
      text: "CAT done? Work out your score from your response sheet",
      links: [
        { label: "CAT score calculator", to: "/cat-score-calculator" },
        { label: "Which IIMs can I get?", to: "/cat-college-predictor" },
      ],
    };
  }
  return null;
}

/** NEET/JEE: dates not announced yet, so the strip points at their tools instead of a countdown. */
const OTHER: Record<"neet" | "jee", StripContent> = {
  neet: {
    text: `${NEXT_EXAM.neet.name} · dates not announced yet`,
    links: [
      { label: "NEET college predictor", to: "/neet-college-predictor" },
      { label: "Round-wise cut-offs", to: "/neet-cutoffs" },
    ],
  },
  jee: {
    text: `${NEXT_EXAM.jee.name} · dates not announced yet`,
    links: [
      { label: "JEE college predictor", to: "/jee-college-predictor" },
      { label: "MHT-CET predictor", to: "/mhtcet-college-predictor" },
    ],
  },
};

/**
 * Thin strip at the top of the home page. The prerendered HTML and the first
 * client render show the date-independent pre-exam text (no hydration
 * mismatch); the day count — or the after-exam message — is filled in after
 * mount. Height is reserved for the wrapped mobile layout so the badge
 * arriving doesn't push the page down.
 */
export default function ExamSeasonStrip({ exam = "mba" }: { exam?: ExamKey }) {
  const [catContent, setCatContent] = useState<StripContent | null>(CAT_ISO ? BEFORE : null);

  useEffect(() => {
    // Prerender keeps the date-independent first render (see lib/clientReady).
    if (IS_PRERENDER) return;
    setCatContent(catStrip(new Date()));
  }, []);

  // Follows the exam the student picked (MBA by default, which is also what the prerender shows).
  const content = exam === "mba" ? catContent : OTHER[exam];

  if (!content) return null;

  return (
    <div className="w-full bg-gradient-to-r from-[#0E1629] via-[#18205A] to-[#0E1629] text-white" role="region" aria-label="Exam season">
      <div className="max-w-7xl mx-auto px-4 md:px-8 min-h-[72px] md:min-h-[44px] py-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 font-[Poppins] text-[13px] md:text-[14px]">
        <span className="inline-flex items-center gap-2 font-medium">
          <span className="relative flex h-2 w-2" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full rounded-full bg-[#FA660F] opacity-75 motion-safe:animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#FA660F]" />
          </span>
          {content.text}
          {content.badge && (
            <span className="ml-1 rounded-full bg-gradient-to-r from-[#FA660F] to-[#FF8A3D] px-2.5 py-0.5 text-[12px] font-semibold text-white shadow-[0_4px_12px_-4px_rgba(250,102,15,0.8)]">
              {content.badge}
            </span>
          )}
        </span>
        <span className="inline-flex flex-wrap items-center gap-x-3 gap-y-1">
          {content.links.map((l) => (
            <Link
              key={l.label}
              to={l.to}
              className="text-[#FDBA74] underline underline-offset-4 decoration-[#FDBA74]/40 hover:decoration-[#FDBA74] font-medium"
            >
              {l.label} →
            </Link>
          ))}
        </span>
      </div>
    </div>
  );
}
