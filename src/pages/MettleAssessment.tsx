import { useState, useEffect, useRef } from "react";
import PageSEO from "@/components/SEO/PageSEO";
import { useAuthStore } from "@/store/AuthStore";
import { LoginCard } from "@/components/cards/LoginCard";
import startRecharge from "@/api/wallet";
import { getLoggedInPhone, formatPhoneForRazorpay } from "@/lib/phone";
import { getToken } from "@/lib/tokenManager";
import { registerOptionForm, payOptionFormFromWallet } from "@/api/optionForm";
import { uploadPsychometricReport, downloadReport } from "@/api/psychometric";
import { updateUserProfile } from "@/api/user";
import { buildReportPdf, type Report } from "@/lib/mettleReportPdf";

type RazorpayConstructor = new (opts: unknown) => { open: () => void };

const API = "https://college-search-api.vercel.app";

// Price of the Mettle career assessment (INR). Payment is NOT wired yet —
// see the backend API contract in METTLE_PAYMENT_TODO below.
// Price of the Mettle career assessment (INR). The start card, the "You pay"
// row, the button label, the cost FAQ and the Service schema all read from
// here. MettleBanner.tsx carries its own copy of this figure — keep them in sync.
const METTLE_PRICE = 2000;

/**
 * Discount codes, as percentages off METTLE_PRICE.
 *
 * ⚠️ These ship inside the JavaScript bundle — anyone who opens devtools can
 * read them, so treat PC100 as public the moment it is used in front of an
 * audience. Move validation to the backend before relying on them commercially.
 */
const METTLE_COUPONS: Record<string, number> = {
  PC50: 50,
  PC100: 100,
};

/*
 * ─── PAYMENT TO BE WIRED LATER (backend endpoints required) ──────────────────
 * Build these two endpoints on the main wallet backend (API_CONFIG.baseUrl),
 * then gate `start()` behind them:
 *
 *   GET  /api/mettle/access?userId=<userName>
 *        → { "hasPaid": boolean }            // unlock instantly on return
 *
 *   POST /api/mettle/pay
 *        body: { userId, mode: "wallet" | "razorpay", paymentId?, amount }
 *        → { "status": boolean }             // mode=wallet deducts ₹2000 from
 *                                            // proCoins; mode=razorpay records
 *                                            // a verified Razorpay payment.
 *                                            // Either way marks the user paid.
 *
 * Frontend flow once live: open /mettle → check access → if unpaid show paywall
 *   → if wallet balance ≥ ₹2000 "Pay from Wallet" else Razorpay (reuse
 *   startRecharge + getLoggedInPhone/formatPhoneForRazorpay from src/lib/phone)
 *   → on success call /api/mettle/pay → unlock the assessment.
 * ─────────────────────────────────────────────────────────────────────────────
 */

// SEO structured data so /mettle can rank for career-test queries.
const METTLE_SEO_TITLE =
  "Career Test for Students — AI Career Assessment & Report | Mettle by ProCounsel";
const METTLE_SEO_DESC =
  "Take ProCounsel's Mettle career assessment: 100 questions across 9 skill areas, scored by AI into your top career matches, strengths and a personalised roadmap. Get a downloadable career report.";
const METTLE_JSONLD = [
  {
    // Modelled as a Service (a paid online career assessment), NOT a retail
    // Product. Product markup makes Google's product-snippet parser expect
    // aggregateRating/review — and we won't fabricate reviews. Service keeps the
    // price via `offers` and is the accurate type. When real customer reviews
    // exist (after payment goes live), add a genuine aggregateRating here.
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "AI career assessment",
    name: "Mettle AI Career Assessment",
    provider: {
      "@type": "Organization",
      name: "ProCounsel",
      url: "https://procounsel.co.in",
    },
    areaServed: { "@type": "Country", name: "India" },
    description: METTLE_SEO_DESC,
    category: "Career Assessment",
    url: "https://procounsel.co.in/mettle",
    offers: {
      "@type": "Offer",
      price: String(METTLE_PRICE),
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      url: "https://procounsel.co.in/mettle",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is the Mettle career assessment?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Mettle is ProCounsel's AI-powered career assessment. You answer 100 statements across 9 skill areas, and AI maps your natural strengths to the careers best suited to you, with fit-scores and a step-by-step roadmap.",
        },
      },
      {
        "@type": "Question",
        name: "How long does the Mettle test take?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "About 20 minutes. There are 100 short statements you rate on a 5-point scale, after which your personalised career report is generated instantly.",
        },
      },
      {
        "@type": "Question",
        name: "What do I get after completing the assessment?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A full career report: your personality type and profile, your top 3 career matches with AI fit-scores, a scored breakdown of your strengths, development areas with tips, and a roadmap for each recommended career — all downloadable as a PDF.",
        },
      },
      {
        "@type": "Question",
        name: "How much does the Mettle assessment cost?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `The Mettle career assessment is a one-time ₹${METTLE_PRICE.toLocaleString("en-IN")} and includes your complete AI-generated career report.`,
        },
      },
      {
        "@type": "Question",
        name: "Which career test is best for students after 10th or 12th?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The most useful career test is one that measures several distinct abilities rather than sorting you into a single label. Mettle scores you across 9 areas — analytical thinking, creative expression, social and empathy, leadership, technical aptitude, nature and environment, organisation, communication and social impact — so a student choosing a stream after 10th or a degree after 12th can see which fields genuinely match their strengths.",
        },
      },
      {
        "@type": "Question",
        name: "Is an online career test accurate?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A career test is a mirror, not a verdict. Mettle's accuracy comes from breadth — 100 statements across 9 skill areas, rated on a 5-point scale — and from answering honestly rather than as the person you think you should be. Use the report to narrow your options and then talk it through with a counsellor before deciding.",
        },
      },
      {
        "@type": "Question",
        name: "Do I need to create an account to take the career test?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. You sign in with your phone number and a one-time OTP so your report is saved against your name and you can return to it. Your name is taken from your ProCounsel profile; if you are new and have not added one yet, you enter it once before the test starts.",
        },
      },
    ],
  },
];

// Shown on the start screen, before anyone pays. Deliberately answers the
// awkward questions (what exactly do I get, is it accurate, can I get a refund)
// rather than only the flattering ones.
const START_FAQS: { q: string; a: string }[] = [
  {
    q: "What exactly do I get at the end?",
    a: "A full career report: your personality profile, your top 3 career matches with AI fit-scores, all 9 skill areas scored out of 100, your development areas with practical tips, and a step-by-step roadmap for each recommended career. You can download the whole thing as a PDF.",
  },
  {
    q: "How long does it take?",
    a: "About 20 minutes. There are 100 short statements, grouped into 9 sections, and you rate each one from Strongly Disagree to Strongly Agree. Your report is generated straight after the last question.",
  },
  {
    q: "How is this different from the free career quizzes online?",
    a: "Most free quizzes ask 10–20 questions and hand you a personality label. Mettle rates you on 100 statements across 9 distinct skill areas and uses AI to turn that profile into specific careers with fit-scores, required skills and a roadmap — and you can take the result to a counsellor who works in that field.",
  },
  {
    q: "Is the result accurate?",
    a: "It reflects how you answer, so answer as the person you are rather than the person you think you should be. It is a mirror, not a verdict — treat the report as a shortlist to discuss with a counsellor, not a final decision.",
  },
  {
    q: "Do I have to pay before taking it?",
    a: "Yes, it is a one-time payment that includes your complete AI-generated report. You can pay from your ProCounsel wallet, or by UPI, card or netbanking if your wallet is short.",
  },
  {
    q: "What if I want to discuss my report with someone?",
    a: "That's the point of it. Once you know which fields fit you, book a session with a ProCounsel counsellor who specialises in that domain — they can turn the report into an actual plan for exams, colleges and admissions.",
  },
];

// ── Categories ────────────────────────────────────────────────────────────────
const CATS = [
  { key: "Analytical",    name: "Analytical Thinking",     emoji: "🧠", color: "#4f46e5", light: "#eef2ff", mid: "#c7d2fe", catBg: "linear-gradient(135deg,#eef2ff 0%,#e0e7ff 100%)" },
  { key: "Creative",      name: "Creative Expression",      emoji: "🎨", color: "#ea580c", light: "#fff7ed", mid: "#fed7aa", catBg: "linear-gradient(135deg,#fff7ed 0%,#ffedd5 100%)" },
  { key: "Social",        name: "Social & Empathy",         emoji: "🤝", color: "#0284c7", light: "#f0f9ff", mid: "#bae6fd", catBg: "linear-gradient(135deg,#f0f9ff 0%,#e0f2fe 100%)" },
  { key: "Leadership",    name: "Leadership",               emoji: "🚀", color: "#d97706", light: "#fffbeb", mid: "#fde68a", catBg: "linear-gradient(135deg,#fffbeb 0%,#fef3c7 100%)" },
  { key: "Technical",     name: "Technical Aptitude",       emoji: "⚙️",  color: "#059669", light: "#ecfdf5", mid: "#a7f3d0", catBg: "linear-gradient(135deg,#ecfdf5 0%,#d1fae5 100%)" },
  { key: "Nature",        name: "Nature & Environment",     emoji: "🌿", color: "#16a34a", light: "#f0fdf4", mid: "#bbf7d0", catBg: "linear-gradient(135deg,#f0fdf4 0%,#dcfce7 100%)" },
  { key: "Organized",     name: "Organization & Structure", emoji: "📋", color: "#475569", light: "#f8fafc", mid: "#e2e8f0", catBg: "linear-gradient(135deg,#f8fafc 0%,#f1f5f9 100%)" },
  { key: "Communication", name: "Communication",            emoji: "💬", color: "#db2777", light: "#fdf2f8", mid: "#fbcfe8", catBg: "linear-gradient(135deg,#fdf2f8 0%,#fce7f3 100%)" },
  { key: "Social Impact", name: "Social Impact",            emoji: "🌍", color: "#7c3aed", light: "#f5f3ff", mid: "#ddd6fe", catBg: "linear-gradient(135deg,#f5f3ff 0%,#ede9fe 100%)" },
];

const QUESTIONS: { text: string; category: string }[] = [
  { text: "I enjoy working through complex problems step by step.", category: "Analytical" },
  { text: "I often see possibilities and ideas that others overlook.", category: "Creative" },
  { text: "I find genuine satisfaction in helping others work through their problems.", category: "Social" },
  { text: "I enjoy taking charge of a group and guiding it toward a shared goal.", category: "Leadership" },
  { text: "Understanding exactly how machines or technology works fascinates me.", category: "Technical" },
  { text: "Finding patterns in data or numbers comes naturally to me.", category: "Analytical" },
  { text: "Expressing ideas through visual, written, or artistic mediums excites me.", category: "Creative" },
  { text: "I can often sense how someone is feeling even before they say it.", category: "Social" },
  { text: "Making important decisions under uncertainty is something I can handle well.", category: "Leadership" },
  { text: "Hands-on experimentation — building, testing, and fixing — appeals to me greatly.", category: "Technical" },
  { text: "I feel most alive and at ease when I am outdoors or in natural settings.", category: "Nature" },
  { text: "When I face a challenge, I naturally map out all possibilities before deciding.", category: "Analytical" },
  { text: "I am drawn to work where no two days are the same and creativity is needed.", category: "Creative" },
  { text: "Spending time working with and for people gives me energy rather than draining me.", category: "Social" },
  { text: "Turning an idea into a real, tangible outcome is highly motivating for me.", category: "Leadership" },
  { text: "I am comfortable picking up new technical tools, software, or methods on my own.", category: "Technical" },
  { text: "I am comfortable managing large amounts of detailed information and documents.", category: "Organized" },
  { text: "I express my ideas clearly, whether speaking or writing.", category: "Communication" },
  { text: "Mathematics or logical reasoning energizes rather than tires me.", category: "Analytical" },
  { text: "I can easily picture how something will look, sound, or feel before it is made.", category: "Creative" },
  { text: "I have patience for people who are learning slowly or struggling.", category: "Social" },
  { text: "I naturally spot opportunities where others see only obstacles.", category: "Leadership" },
  { text: "I am drawn to scientific investigation and finding evidence-based answers.", category: "Technical" },
  { text: "I care deeply about environmental sustainability and conservation.", category: "Nature" },
  { text: "I prefer answers that are precise and verifiable over rough approximations.", category: "Analytical" },
  { text: "Telling stories — in any form — is something I genuinely enjoy.", category: "Creative" },
  { text: "Teaching or explaining things to others is something I enjoy deeply.", category: "Social" },
  { text: "Persuading others through reason and conviction is a skill I have.", category: "Leadership" },
  { text: "Precision and accuracy in technical work give me a deep sense of satisfaction.", category: "Technical" },
  { text: "I naturally create systems and routines to keep things organized and on track.", category: "Organized" },
  { text: "I enjoy debates and the challenge of making a well-reasoned argument.", category: "Communication" },
  { text: "I would rather spend time analyzing a situation deeply than react quickly.", category: "Analytical" },
  { text: "I prefer creating something new over improving something existing.", category: "Creative" },
  { text: "I am comfortable in emotionally sensitive or difficult conversations.", category: "Social" },
  { text: "I tend to take initiative rather than wait for instructions.", category: "Leadership" },
  { text: "Technology that solves real-world problems genuinely excites me.", category: "Technical" },
  { text: "Working with animals, plants, or natural ecosystems appeals to me deeply.", category: "Nature" },
  { text: "Following rules and structured procedures carefully gives me confidence and focus.", category: "Organized" },
  { text: "Writing — whether creative, analytical, or professional — is something I do well.", category: "Communication" },
  { text: "Building or understanding systems and how their parts connect interests me greatly.", category: "Analytical" },
  { text: "I find beauty and meaning in art, design, or music.", category: "Creative" },
  { text: "Understanding why people behave the way they do genuinely interests me.", category: "Social" },
  { text: "Thinking about long-term strategy and planning comes naturally to me.", category: "Leadership" },
  { text: "I enjoy the challenge of diagnosing why something is failing and fixing it.", category: "Technical" },
  { text: "I am curious about how living systems in nature interact and sustain themselves.", category: "Nature" },
  { text: "I find detail-oriented, structured work fulfilling rather than tedious.", category: "Organized" },
  { text: "I enjoy researching and investigating topics or stories in depth.", category: "Communication" },
  { text: "I am motivated by the idea of making a meaningful difference in society.", category: "Social Impact" },
  { text: "Presenting ideas to an audience, large or small, does not make me nervous.", category: "Communication" },
  { text: "I find work that serves communities or the public sector genuinely fulfilling.", category: "Social Impact" },

  // ── Second half ────────────────────────────────────────────────────────────
  // Added to deepen the signal per skill area. The original set was lopsided —
  // Social Impact had only 2 statements against Analytical's 7, so a whole
  // category was being scored off almost nothing. This levels every area to 11+.
  { text: "I like to test my assumptions before I accept a conclusion.", category: "Analytical" },
  { text: "Breaking a large problem into smaller parts is how I naturally start.", category: "Analytical" },
  { text: "I enjoy working out why something failed, not just fixing it.", category: "Analytical" },
  { text: "I trust decisions backed by evidence more than decisions backed by instinct.", category: "Analytical" },

  { text: "I often improve things that already work, simply because I can picture them better.", category: "Creative" },
  { text: "Unconventional approaches appeal to me more than proven ones.", category: "Creative" },
  { text: "I collect ideas I want to try someday, even with no plan for them yet.", category: "Creative" },
  { text: "Being told exactly how to do something takes the enjoyment out of it for me.", category: "Creative" },

  { text: "People tend to come to me when they need someone to listen.", category: "Social" },
  { text: "I adjust how I explain something depending on who I am talking to.", category: "Social" },
  { text: "I am good at settling a disagreement between two people.", category: "Social" },
  { text: "I notice when someone in a group has been left out.", category: "Social" },

  { text: "I would rather be responsible for an outcome than be told what to do.", category: "Leadership" },
  { text: "I can give someone honest feedback they may not want to hear.", category: "Leadership" },
  { text: "When a plan falls apart, I am usually the one who suggests what to do next.", category: "Leadership" },
  { text: "Setting goals for a team and keeping everyone on track energises me.", category: "Leadership" },

  { text: "I would rather understand how a system works than simply use it.", category: "Technical" },
  { text: "Troubleshooting something stubborn is satisfying rather than frustrating.", category: "Technical" },
  { text: "I enjoy learning the precise vocabulary of a technical field.", category: "Technical" },
  { text: "Given instructions and time, I am confident I could assemble or repair most things.", category: "Technical" },

  { text: "Working indoors all day would slowly wear me down.", category: "Nature" },
  { text: "I think about how my everyday choices affect the environment.", category: "Nature" },
  { text: "Learning about animals, plants or ecosystems holds my attention.", category: "Nature" },
  { text: "I would enjoy fieldwork more than desk work.", category: "Nature" },
  { text: "Physical activity outdoors clears my head better than resting does.", category: "Nature" },
  { text: "I notice changes in the weather, seasons and landscape around me.", category: "Nature" },
  { text: "A career connected to agriculture, wildlife or the environment appeals to me.", category: "Nature" },

  { text: "I make lists, and I genuinely use them.", category: "Organized" },
  { text: "Clear deadlines help me more than they pressure me.", category: "Organized" },
  { text: "I dislike leaving a task unfinished at the end of the day.", category: "Organized" },
  { text: "I keep my notes and belongings in a system that makes sense to me.", category: "Organized" },
  { text: "Following a well-defined process gives me confidence rather than boredom.", category: "Organized" },
  { text: "I plan my week rather than take it as it comes.", category: "Organized" },
  { text: "Spotting an error others missed gives me quiet satisfaction.", category: "Organized" },

  { text: "I enjoy explaining a complicated idea until someone finally gets it.", category: "Communication" },
  { text: "Writing helps me think, not just record what I already thought.", category: "Communication" },
  { text: "I am comfortable speaking on behalf of a group.", category: "Communication" },
  { text: "I read the room and adjust my tone accordingly.", category: "Communication" },
  { text: "Debating an idea with someone who disagrees is enjoyable rather than stressful.", category: "Communication" },
  { text: "I would enjoy teaching, training or mentoring as part of my work.", category: "Communication" },

  { text: "I would accept a smaller salary for work that clearly helps people.", category: "Social Impact" },
  { text: "Unfairness bothers me even when it does not affect me personally.", category: "Social Impact" },
  { text: "I have volunteered for a cause I believe in, or I want to.", category: "Social Impact" },
  { text: "I follow social issues closely enough to form my own view.", category: "Social Impact" },
  { text: "I would rather solve a problem for many people than for one client.", category: "Social Impact" },
  { text: "Working for a government body, NGO or public institution appeals to me.", category: "Social Impact" },
  { text: "I believe my work should leave things better than I found them.", category: "Social Impact" },
  { text: "Problems like education, health or poverty draw my attention.", category: "Social Impact" },
  { text: "Seeing someone's life improve through my work would matter more to me than recognition.", category: "Social Impact" },
  { text: "I would speak up about something wrong at work even if it were uncomfortable.", category: "Social Impact" },
];

const CAT_QS = CATS.map(c => ({ ...c, qs: QUESTIONS.filter(q => q.category === c.key) }));

function gIdx(ci: number, qi: number) {
  let n = 0; for (let i = 0; i < ci; i++) n += CAT_QS[i].qs.length; return n + qi;
}

const SCALE_LABELS = ["", "Strongly\nDisagree", "Disagree", "Neutral", "Agree", "Strongly\nAgree"];


// ── Shared styles ─────────────────────────────────────────────────────────────
const F   = "'Inter','Poppins',system-ui,sans-serif";
const GLASS = (opacity = 0.7, blur = 20) => ({
  background: `rgba(255,255,255,${opacity})`,
  backdropFilter: `blur(${blur}px) saturate(160%)`,
  WebkitBackdropFilter: `blur(${blur}px) saturate(160%)`,
  border: "1px solid rgba(255,255,255,0.9)",
  boxShadow: "0 4px 24px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.95)",
} as React.CSSProperties);

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
  .ma { font-family:${F}; -webkit-font-smoothing:antialiased; }
  @keyframes maUp  { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
  @keyframes maIn  { from{opacity:0;transform:scale(.95)}       to{opacity:1;transform:scale(1)}     }
  @keyframes maSpin{ to{transform:rotate(360deg)} }
  @keyframes maPop { 0%,100%{opacity:1} 50%{opacity:.5} }
  @keyframes maBar { from{width:0} }
  .ma-up  { animation:maUp  .45s cubic-bezier(.22,1,.36,1) both }
  .ma-in  { animation:maIn  .38s cubic-bezier(.22,1,.36,1) both }
  .ma-spin{ animation:maSpin 1s linear infinite }
  .ma-pop { animation:maPop 2s ease infinite }
  .ma-bar { animation:maBar .9s cubic-bezier(.22,1,.36,1) both }
  .ma-btn { transition:all .15s cubic-bezier(.22,1,.36,1); cursor:pointer; }
  .ma-btn:hover { transform:translateY(-1px); }
  .ma-card{ transition:transform .18s ease, box-shadow .18s ease; }
  .ma-card:hover{ transform:translateY(-3px); box-shadow:0 16px 40px rgba(0,0,0,0.1) !important; }
  @media print{
    .ma-np{display:none!important;}
    .ma{background:white!important;}
    *{box-shadow:none!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important;}
  }
`;

const DEV = typeof window !== "undefined" && (window.location.hostname === "localhost" || new URLSearchParams(window.location.search).get("dev") === "true");

// ── Score ring ────────────────────────────────────────────────────────────────
function Ring({ pct, color, size = 72 }: { pct: number; color: string; size?: number }) {
  const r = size * .37, cx = size / 2, c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ flexShrink: 0 }}>
      <circle cx={cx} cy={cx} r={r} fill="none" stroke={color} strokeWidth={size*.09} strokeOpacity=".12" />
      <circle cx={cx} cy={cx} r={r} fill="none" stroke={color} strokeWidth={size*.09}
        strokeDasharray={`${((pct/100)*c).toFixed(1)} ${c.toFixed(1)}`} strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cx})`} />
      <text x={cx} y={cx+2} textAnchor="middle" fontSize={size*.22} fontWeight="800" fill={color} fontFamily={F}>{pct}%</text>
      <text x={cx} y={cx+size*.18} textAnchor="middle" fontSize={size*.12} fill="#94a3b8" fontFamily={F}>fit</text>
    </svg>
  );
}

// ── Progress dots ─────────────────────────────────────────────────────────────
function Dots({ ci }: { ci: number }) {
  return (
    <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
      {CAT_QS.map((c, i) => (
        <div key={i} style={{ height: 6, width: i === ci ? 18 : 6, borderRadius: 99, background: i < ci ? c.color : i === ci ? c.color : "#e2e8f0", transition: "all .3s ease", opacity: i > ci ? .4 : 1 }} />
      ))}
    </div>
  );
}

type Screen = "start" | "cat-intro" | "quiz" | "loading" | "report" | "error";

const cleanName = (raw: string) => raw.trim().replace(/\s+/g, " ");

/** The report is titled with this, so a blank or junk name is not accepted. */
function validateName(raw: string): string | null {
  const n = cleanName(raw);
  if (n.length < 2) return "Please enter your full name.";
  if (!/^[\p{L}][\p{L}\s.'-]*$/u.test(n)) return "Please use letters only — no numbers or symbols.";
  return null;
}

export default function MettleAssessment() {
  const [screen, setScreen] = useState<Screen>("start");
  const [name, setName]     = useState("");
  const [ci, setCi]         = useState(0);
  const [qi, setQi]         = useState(0);
  const [ans, setAns]       = useState<Record<number, number>>({});
  const [report, setReport] = useState<Report | null>(null);
  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [payBusy, setPayBusy] = useState(false);
  const [payErr, setPayErr] = useState("");
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "failed" | "skipped">("idle");
  // Filled in on the start card by students whose profile carries no name.
  const [nameInput, setNameInput] = useState("");
  const [nameErr, setNameErr] = useState("");
  const [nameBusy, setNameBusy] = useState(false);
  const savedRef = useRef(false);
  const [err, setErr]       = useState("");
  const top = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  // Login is mandatory and the report is titled with the student's name. That
  // normally comes from their profile — but a brand-new account can reach this
  // page with nothing but a phone number, so when the profile has no name we
  // ask for one here and it is required before the test can start.
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoginToggle = useAuthStore((s) => s.isLoginToggle);
  const profileName = `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim();
  const needsName = isAuthenticated && !!user && !profileName;

  // Login persists for months, so the stored profile can be from long before the
  // report existed. Ask the profile API once on arrival — the answer decides
  // whether they are offered a download or the test, and whether they get
  // charged, so it is never read from a cached copy.
  const refreshUser = useAuthStore((s) => s.refreshUser);
  useEffect(() => {
    if (isAuthenticated) void refreshUser(true);
  }, [isAuthenticated, refreshUser]);

  useEffect(() => {
    const el = document.createElement("style"); el.textContent = CSS; document.head.appendChild(el);
    return () => { document.head.removeChild(el); };
  }, []);

  useEffect(() => { top.current?.scrollIntoView({ behavior: "smooth" }); }, [screen, ci, qi]);

  const discount = appliedCoupon ? METTLE_COUPONS[appliedCoupon] ?? 0 : 0;
  const payable = Math.max(0, Math.round((METTLE_PRICE * (100 - discount)) / 100));
  const walletBalance = user?.walletAmount ?? 0;
  // Came in with the login/profile response — a link here means they already
  // own a report and should not be charged for another.
  const savedReportLink = user?.pyschometricReportPdfLink;

  const cat  = CAT_QS[ci];
  const date = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

  function beginAssessment() {
    const u = useAuthStore.getState().user;
    // Profile name first; the name typed on the start card is the fallback for
    // accounts that have none (and for the rare case the profile write failed).
    const n = `${u?.firstName ?? ""} ${u?.lastName ?? ""}`.trim() || cleanName(nameInput) || "Student";
    setName(n);
    setCi(0); setQi(0); setAns({}); setScreen("cat-intro");
  }

  /**
   * Finishes the student's signup before a rupee is touched: a real name on the
   * profile, and the account out of the half-created onboarding state.
   *
   * /mettle is a standalone route — it sits outside RevampLayout, so the
   * OnboardingCard that normally closes out a new signup never renders here. A
   * user who signs up on this page would otherwise stay mid-onboarding for the
   * whole session, with their JWT held in memory only, and every authenticated
   * call after that (payment included) made on a half-built account.
   *
   * Returns false when the student still has to type a name — the field is on
   * the start card and the error is shown there.
   */
  async function ensureSignupComplete(): Promise<boolean> {
    const s = useAuthStore.getState();
    const u = s.user;
    const hasName = !!`${u?.firstName ?? ""} ${u?.lastName ?? ""}`.trim();

    if (!hasName) {
      const problem = validateName(nameInput);
      if (problem) { setNameErr(problem); return false; }
    }

    setNameBusy(true); setNameErr("");
    try {
      if (!hasName) {
        const full = cleanName(nameInput);
        const [firstName, ...rest] = full.split(" ");
        const lastName = rest.join(" ");
        // getToken(), not localStorage — a just-signed-up user's JWT is still
        // in-memory only, and reading localStorage here would skip the save.
        const uid = getLoggedInPhone() || s.userId;
        const token = getToken();
        if (uid && token) {
          await updateUserProfile(uid, { firstName, lastName }, token);
        }
      }

      // Promotes the in-memory JWT to storage and clears needsOnboarding, so
      // from here on this is an ordinary signed-in account. No-op once done.
      if (s.needsOnboarding || s.tempJwt) s.completeOnboarding();

      await useAuthStore.getState().refreshUser(true);
    } catch (e) {
      // The name still titles this report even if the profile write failed.
      console.error("Could not finish the signup:", e instanceof Error ? e.message : String(e));
    } finally {
      setNameBusy(false);
    }
    return true;
  }

  function applyCoupon() {
    const code = coupon.trim().toUpperCase();
    if (!code) return;
    if (!(code in METTLE_COUPONS)) { setPayErr("That code isn't valid."); return; }
    setAppliedCoupon(code); setPayErr("");
  }

  /** Charges the shortfall on Razorpay and waits for the wallet to show it. */
  async function topUpWallet(walletId: string, amount: number, target: number) {
    const order = await startRecharge(walletId, amount);
    // startRecharge answers with a bare string when it refuses (e.g. no auth
    // token) — that used to surface as a flat "try again" with no clue why.
    if (typeof order === "string") {
      throw /token|auth/i.test(order)
        ? openLogin("We couldn't read your login on this device. Log in again and press Start.")
        : new Error(order);
    }
    if (!order || !order.orderId) {
      throw new Error("Could not start the payment. Please try again.");
    }
    if (typeof (window as unknown as { Razorpay?: unknown }).Razorpay !== "function") {
      throw new Error("The payment window could not load. Check your connection or any ad-blocker, then press Start again.");
    }
    await new Promise<void>((resolve, reject) => {
      const u = useAuthStore.getState().user;
      const options = {
        key: order.keyId, amount: order.amount, currency: order.currency, order_id: order.orderId,
        name: "ProCounsel", description: "Mettle career assessment",
        prefill: {
          contact: formatPhoneForRazorpay(getLoggedInPhone()),
          email: u?.email || "",
          name: `${u?.firstName || ""} ${u?.lastName || ""}`.trim(),
        },
        notes: { userId: walletId, service: "mettle" },
        handler: () => {
          void (async () => {
            // The wallet is credited by the payment webhook, so poll rather than
            // failing on the first read.
            for (let i = 0; i < 8; i += 1) {
              const fresh = await useAuthStore.getState().refreshUser(true);
              if (!fresh) { reject(openLogin("Payment went through but we lost your login on this device. Log in again — the money is in your wallet, you won't be charged twice.")); return; }
              if ((fresh.walletAmount ?? 0) >= target) { resolve(); return; }
              await new Promise(r => setTimeout(r, 1200));
            }
            reject(new Error("Payment went through but your balance hasn't updated yet. Give it a minute and press Start again — you won't be charged twice."));
          })();
        },
        modal: { ondismiss: () => reject(new Error("Payment cancelled.")) },
        theme: { color: "#4f46e5" },
      };
      const RZ = (window as unknown as { Razorpay: RazorpayConstructor }).Razorpay;
      new RZ(options).open();
    });
  }

  async function payAndBegin() {
    // A 100% coupon skips money entirely — no wallet call, no Razorpay.
    if (payable === 0) { beginAssessment(); return; }

    const s = useAuthStore.getState();
    const walletId = getLoggedInPhone() || s.userId;
    if (!walletId) { setPayErr(openLogin("We couldn't read your account. Log in again to continue.").message); return; }

    setPayBusy(true); setPayErr("");
    try {
      // Mettle rides the option-form registration + transfer pair — the only
      // wallet-debit endpoint available. The call is idempotent: once the row
      // exists for this phone it makes no request, so a retry after a cancelled
      // payment goes straight to the debit instead of re-registering.
      const u = s.user;
      await registerOptionForm({
        name: `${u?.firstName ?? ""} ${u?.lastName ?? ""}`.trim() || cleanName(nameInput) || "Student",
        marks: 0,
        stateDomicile: "-",
        phoneNumber: walletId,
        optionFormRequirement: "METTLE",
      });

      const fresh = await s.refreshUser(true);
      if (!fresh) throw openLogin("We couldn't read your account just now. Log in again and press Start.");

      // Razorpay only opens if the wallet can't cover it.
      const shortfall = payable - (fresh.walletAmount ?? 0);
      if (shortfall > 0) await topUpWallet(walletId, shortfall, payable);

      await payOptionFormFromWallet(walletId, payable);
      await s.refreshUser(true);
      beginAssessment();
    } catch (e) {
      setPayErr(e instanceof Error ? e.message : "Payment failed. Please try again.");
    } finally {
      setPayBusy(false);
    }
  }

  /**
   * Opens the login card rather than leaving the student reading "please log in
   * again" with no way to do it. Returns the error to throw, so the caller reads
   * `throw openLogin("…")` and the reason still lands on the start card behind
   * the login sheet.
   */
  function openLogin(reason: string): Error {
    const s = useAuthStore.getState();
    if (!s.isLoginToggle) s.toggleLogin(() => { void afterLogin(); });
    return new Error(reason);
  }

  async function start() {
    const s = useAuthStore.getState();
    // Mandatory login — open the login flow and resume once signed in.
    if (!s.isAuthenticated || !s.user) {
      s.toggleLogin(() => { void afterLogin(); });
      return;
    }
    if (!(await ensureSignupComplete())) return;
    await payAndBegin();
  }

  /**
   * Resumes after the login card closes. A freshly created account often has
   * nothing but a phone number, so we stop at the start card with the name
   * field waiting rather than charging them for a report titled "Student".
   *
   * Note this only fires for accounts the store considers complete — AuthStore
   * holds the callback back for users who still need onboarding and hands it to
   * RevampLayout, which /mettle does not sit under. That is fine: the start card
   * re-renders signed-in either way, so a new user simply presses Start again
   * after typing their name.
   */
  async function afterLogin() {
    const fresh = await useAuthStore.getState().refreshUser(true);
    if (!`${fresh?.firstName ?? ""} ${fresh?.lastName ?? ""}`.trim()) {
      setNameErr("");
      setTimeout(() => nameRef.current?.focus(), 150);
      return;
    }
    await payAndBegin();
  }

  function pick(s: number) { setAns(a => ({ ...a, [gIdx(ci, qi)]: s })); }

  function goNext() {
    if (!ans[gIdx(ci, qi)]) return;
    if (qi === cat.qs.length - 1 && ci === CAT_QS.length - 1) { submit(); return; }
    if (qi === cat.qs.length - 1) { setCi(c => c + 1); setQi(0); setScreen("cat-intro"); return; }
    setQi(q => q + 1);
  }

  function goPrev() {
    if (qi > 0) { setQi(q => q - 1); return; }
    if (ci > 0) { setCi(c => c - 1); setQi(CAT_QS[ci - 1].qs.length - 1); setScreen("quiz"); }
  }

  async function submit() {
    setScreen("loading");
    // Answers are keyed by gIdx(), which indexes the CATEGORY-GROUPED order the
    // quiz walks through — NOT the interleaved order of QUESTIONS. Mapping over
    // QUESTIONS here attached every answer to the wrong statement, so the AI was
    // scoring a scrambled test. Build the payload from the same grouped order.
    const asked = CAT_QS.flatMap((c) => c.qs);
    const payload = asked.map((q, i) => ({
      question: q.text, category: q.category,
      answer: SCALE_LABELS[ans[i] ?? 3].replace("\n", " "),
      score: ans[i] ?? 3,
    }));
    try {
      const res = await fetch(`${API}/assess`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), answers: payload }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || "Server error"); }
      setReport(await res.json()); setScreen("report");
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Could not reach the assessment server.");
      setScreen("error");
    }
  }

  function retake() { setName(""); setAns({}); setCi(0); setQi(0); setReport(null); setErr(""); setScreen("start"); }

  /**
   * Renders the finished report to a PDF and saves it against the student, so a
   * paid report is not lost the moment they close the tab. The PDF libraries are
   * imported on demand — they are large, and only this one screen needs them.
   */
  async function saveReportPdf() {
    const uid = getLoggedInPhone() || useAuthStore.getState().userId;
    if (!uid) { setSaveState("skipped"); return; }
    if (!report) { setSaveState("failed"); return; }

    setSaveState("saving");
    try {
      const { jsPDF } = await import("jspdf");
      const pdf = buildReportPdf(new jsPDF({ unit: "pt", format: "a4" }), report, name);
      const blob = pdf.output("blob");
      const file = new File([blob], `mettle-report-${uid}.pdf`, { type: "application/pdf" });
      await uploadPsychometricReport(uid, file);
      setSaveState("saved");
      // Pull the profile again so the store carries the new link — that is what
      // the dashboard and profile read to offer the download.
      void useAuthStore.getState().refreshUser(true);
    } catch (e) {
      console.error("Could not save the report PDF:", e instanceof Error ? `${e.name}: ${e.message}` : String(e));
      setSaveState("failed");
    }
  }

  /**
   * Downloads the exact same document that gets saved to their profile.
   *
   * This used to be window.print(), which printed the styled page — so the copy
   * they downloaded and the copy on their profile were two different-looking
   * files. One generator now, one look.
   */
  async function downloadReportPdf() {
    if (!report) return;
    const { jsPDF } = await import("jspdf");
    const pdf = buildReportPdf(new jsPDF({ unit: "pt", format: "a4" }), report, name);
    pdf.save(`Mettle-Career-Report-${(name || "Student").replace(/\s+/g, "-")}.pdf`);
  }

  // Fires once, after the report screen has painted.
  useEffect(() => {
    if (screen !== "report" || !report || savedRef.current) return;
    savedRef.current = true;
    const timer = setTimeout(() => { void saveReportPdf(); }, 1200);
    return () => clearTimeout(timer);
    // saveReportPdf is deliberately not a dependency — savedRef makes this
    // run exactly once per report, and re-running it would upload twice.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen, report]);

  async function devSkip() {
    const n = name.trim() || "Test User"; setName(n); setScreen("loading");
    try {
      const res = await fetch(`${API}/assess`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: n, answers: QUESTIONS.map(q => ({ question: q.text, category: q.category, answer: "Strongly Agree", score: 5 })) }),
      });
      setReport(await res.json()); setScreen("report");
    } catch { setErr("Dev skip error"); setScreen("error"); }
  }

  // ────────────────────────────────── START ──────────────────────────────────
  if (screen === "start") return (
    <div ref={top} className="ma" style={{ minHeight: "100vh", background: "linear-gradient(145deg, #f0f4ff 0%, #fdf4ff 45%, #fff8f0 100%)", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <PageSEO
        title={METTLE_SEO_TITLE}
        description={METTLE_SEO_DESC}
        canonical="/mettle"
        keywords="career test, online career test, free career test, career assessment test, AI career test, career test for students, career test after 10th, career test after 12th, psychometric test India, aptitude test for career, which career is right for me, career guidance test, personality and career test, career counselling online, ProCounsel Mettle"
        jsonLd={METTLE_JSONLD}
      />
      {/* Soft orbs */}
      <div style={{ position: "absolute", top: -80, right: -80, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(167,139,250,.22) 0%, transparent 65%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: -60, left: -60, width: 350, height: 350, borderRadius: "50%", background: "radial-gradient(circle, rgba(56,189,248,.18) 0%, transparent 65%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "45%", left: "35%", width: 250, height: 250, borderRadius: "50%", background: "radial-gradient(circle, rgba(251,146,60,.14) 0%, transparent 65%)", pointerEvents: "none" }} />

      <nav style={{ padding: "18px 28px", display: "flex", alignItems: "center", gap: 10 }} className="ma-np">
        <img loading="lazy" decoding="async" src="/logo.svg" alt="" style={{ width: 30, height: 30 }} />
        <span style={{ color: "#1e1b4b", fontWeight: 700, fontSize: 16, fontFamily: F }}>ProCounsel</span>
      </nav>

      {DEV && (
        <div style={{ margin: "0 28px 8px", background: "rgba(251,191,36,.15)", border: "1px solid rgba(251,191,36,.4)", borderRadius: 8, padding: "7px 14px", fontSize: 13, color: "#92400e", display: "flex", gap: 10, alignItems: "center" }} className="ma-np">
          <span style={{ background: "#fbbf24", color: "#000", padding: "1px 8px", borderRadius: 4, fontWeight: 700, fontSize: 11 }}>DEV</span>
          <button onClick={devSkip} style={{ background: "none", border: "none", cursor: "pointer", color: "#b45309", fontWeight: 600, textDecoration: "underline", fontFamily: F }}>Skip → AI Report</button>
        </div>
      )}

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "28px 20px 48px" }}>
        <div className="ma-in" style={{ width: "100%", maxWidth: 980, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(310px, 1fr))", gap: 28, alignItems: "center", textAlign: "left" }}>

          {/* ── Left: pitch ───────────────────────────────────────────── */}
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, ...GLASS(0.7, 16), borderRadius: 99, padding: "7px 18px", marginBottom: 18 }}>
              <span style={{ fontSize: 14 }}>✨</span>
              <span style={{ color: "#4f46e5", fontSize: 12, fontWeight: 700, letterSpacing: .6, fontFamily: F }}>AI-Powered Career Assessment</span>
            </div>

            <h1 style={{ fontSize: "clamp(28px,5vw,42px)", fontWeight: 900, color: "#1e1b4b", lineHeight: 1.1, margin: "0 0 14px", letterSpacing: "-1.5px", fontFamily: F }}>
              Find Your Perfect{" "}
              <span style={{ background: "linear-gradient(90deg,#4f46e5,#7c3aed,#db2777)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Career Path</span>
            </h1>

            <p style={{ fontSize: 14.5, color: "#64748b", lineHeight: 1.7, margin: "0 0 20px", fontFamily: F }}>
              100 thoughtful statements across 9 skill areas. Answer honestly — our AI maps your natural strengths to careers built for you.
            </p>

            {/* Stats */}
            <div style={{ display: "flex", ...GLASS(0.65, 16), borderRadius: 16, overflow: "hidden", marginBottom: 18 }}>
              {[["9", "Sections"], [String(QUESTIONS.length), "Questions"], ["~20m", "Duration"]].map(([v, l], i) => (
                <div key={l} style={{ flex: 1, padding: "12px 8px", borderRight: i < 2 ? "1px solid rgba(0,0,0,.05)" : "none", textAlign: "center" }}>
                  <div style={{ fontSize: 19, fontWeight: 800, color: "#1e1b4b", fontFamily: F }}>{v}</div>
                  <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: .8, fontFamily: F }}>{l}</div>
                </div>
              ))}
            </div>

            {/* Category chips */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {CATS.map(c => (
                <div key={c.key} style={{ ...GLASS(0.6, 12), borderRadius: 99, padding: "5px 12px", display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ fontSize: 12 }}>{c.emoji}</span>
                  <span style={{ fontSize: 10, color: "#64748b", fontWeight: 600, fontFamily: F }}>{c.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: what you get + start ─────────────────────────────── */}
          <div>
            {/* What you'll get */}
            <div style={{ ...GLASS(0.7, 18), borderRadius: 18, padding: "18px 20px", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 14 }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: "#1e1b4b", textTransform: "uppercase", letterSpacing: 1, fontFamily: F }}>What you'll get</span>
                <span style={{ display: "inline-flex", alignItems: "baseline", gap: 5, background: "linear-gradient(135deg,#4f46e5,#7c3aed)", color: "white", borderRadius: 99, padding: "5px 13px", boxShadow: "0 4px 14px rgba(79,70,229,.35)" }}>
                  <span style={{ fontSize: 15, fontWeight: 900, fontFamily: F }}>₹{METTLE_PRICE.toLocaleString("en-IN")}</span>
                  <span style={{ fontSize: 9, fontWeight: 600, opacity: .85, fontFamily: F }}>one-time</span>
                </span>
              </div>
              {[
                ["✦", "Your personality type and how you think and work"],
                ["🎯", "Top 3 career matches with AI fit-scores"],
                ["📊", "Your strongest skill areas, scored out of 100"],
                ["🌱", "Development areas with practical tips"],
                ["🗺️", "A step-by-step roadmap into each career"],
                ["📄", "A polished report you can download as PDF"],
              ].map(([icon, text], i, arr) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: i < arr.length - 1 ? 9 : 0 }}>
                  <span style={{ fontSize: 13, lineHeight: 1.45, flexShrink: 0 }}>{icon}</span>
                  <span style={{ fontSize: 12, color: "#475569", lineHeight: 1.5, fontFamily: F }}>{text}</span>
                </div>
              ))}
            </div>

            {/* Start card — login mandatory, then payment (skipped by a 100% coupon). */}
            <div style={{ ...GLASS(0.75, 20), borderRadius: 20, padding: "20px 22px 18px" }}>
              {isAuthenticated && user ? (
                <>
                  {needsName ? (
                    <div style={{ marginBottom: 14 }}>
                      <label htmlFor="mettle-name" style={{ display: "block", fontSize: 13, color: "#475569", marginBottom: 7, fontFamily: F }}>
                        Your full name <span style={{ color: "#dc2626" }}>*</span>
                        <span style={{ display: "block", fontSize: 11.5, color: "#94a3b8", marginTop: 2 }}>
                          Required — your report is generated and saved under this name.
                        </span>
                      </label>
                      <input
                        id="mettle-name"
                        ref={nameRef}
                        value={nameInput}
                        onChange={e => { setNameInput(e.target.value); if (nameErr) setNameErr(""); }}
                        onKeyDown={e => { if (e.key === "Enter") void start(); }}
                        placeholder="e.g. Ananya Sharma"
                        autoComplete="name"
                        aria-required="true"
                        aria-invalid={!!nameErr}
                        style={{
                          width: "100%", height: 44, borderRadius: 10, background: "white",
                          border: `1px solid ${nameErr ? "#fca5a5" : "rgba(0,0,0,.1)"}`,
                          padding: "0 12px", fontSize: 14, fontFamily: F, color: "#1e1b4b", outline: "none",
                        }}
                      />
                      {nameErr && (
                        <div style={{ fontSize: 12, color: "#b91c1c", marginTop: 6, fontFamily: F }}>{nameErr}</div>
                      )}
                    </div>
                  ) : (
                    <div style={{ fontSize: 13, color: "#475569", marginBottom: 14, fontFamily: F }}>
                      Signed in as{" "}
                      <strong style={{ color: "#1e1b4b" }}>{profileName}</strong>. Your report will be generated under this name.
                    </div>
                  )}

                  {/* Already taken it — their paid report is one tap away, and
                      a retake is a fresh purchase. */}
                  {savedReportLink && (
                    <div style={{ background: "#ecfdf5", border: "1px solid #a7f3d0", borderRadius: 12, padding: "12px 14px", marginBottom: 12 }}>
                      <div style={{ fontSize: 12.5, fontWeight: 700, color: "#065f46", fontFamily: F }}>
                        You already have a report on your profile
                      </div>
                      <div style={{ fontSize: 11.5, color: "#047857", lineHeight: 1.6, margin: "4px 0 10px", fontFamily: F }}>
                        Open it any time from your profile — no need to take the test again. Starting over is a fresh assessment and a new payment.
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                        <button
                          type="button"
                          onClick={() => void downloadReport(savedReportLink)}
                          style={{ background: "#059669", color: "white", border: "none", borderRadius: 9, padding: "8px 14px", fontSize: 12.5, fontWeight: 700, cursor: "pointer", fontFamily: F }}
                        >
                          ↓ Download my report
                        </button>
                        <a
                          href={savedReportLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ display: "inline-block", background: "white", color: "#047857", border: "1px solid #a7f3d0", borderRadius: 9, padding: "8px 14px", fontSize: 12.5, fontWeight: 700, textDecoration: "none", fontFamily: F }}
                        >
                          View ↗
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Coupon */}
                  {appliedCoupon ? (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, background: "#ecfdf5", border: "1px solid #a7f3d0", borderRadius: 10, padding: "8px 12px", marginBottom: 12 }}>
                      <span style={{ fontSize: 12, color: "#065f46", fontWeight: 700, fontFamily: F }}>
                        {appliedCoupon} applied · {discount}% off
                      </span>
                      <button
                        onClick={() => { setAppliedCoupon(null); setCoupon(""); }}
                        style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, color: "#047857", textDecoration: "underline", fontFamily: F }}
                      >Remove</button>
                    </div>
                  ) : (
                    <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                      <input
                        value={coupon}
                        onChange={e => { setCoupon(e.target.value.toUpperCase()); setPayErr(""); }}
                        onKeyDown={e => { if (e.key === "Enter") applyCoupon(); }}
                        placeholder="Coupon code (optional)"
                        style={{ flex: 1, minWidth: 0, height: 40, borderRadius: 10, border: "1px solid rgba(0,0,0,.1)", background: "white", padding: "0 12px", fontSize: 13, fontFamily: F, color: "#1e1b4b", outline: "none" }}
                      />
                      <button
                        onClick={applyCoupon}
                        disabled={!coupon.trim()}
                        style={{ height: 40, padding: "0 16px", borderRadius: 10, border: "1px solid #c7d2fe", background: "#eef2ff", color: "#4f46e5", fontSize: 13, fontWeight: 700, cursor: coupon.trim() ? "pointer" : "not-allowed", opacity: coupon.trim() ? 1 : .5, fontFamily: F }}
                      >Apply</button>
                    </div>
                  )}

                  {/* What they'll actually be charged */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 13, color: "#475569", marginBottom: 4, fontFamily: F }}>
                    <span>You pay</span>
                    <span style={{ fontWeight: 800, color: "#1e1b4b" }}>
                      {discount > 0 && (
                        <span style={{ textDecoration: "line-through", color: "#94a3b8", fontWeight: 600, marginRight: 6 }}>
                          ₹{METTLE_PRICE.toLocaleString("en-IN")}
                        </span>
                      )}
                      {payable === 0 ? "Free" : `₹${payable.toLocaleString("en-IN")}`}
                    </span>
                  </div>
                  {payable > 0 && (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 11.5, color: "#94a3b8", marginBottom: 12, fontFamily: F }}>
                      <span>Wallet balance</span>
                      <span style={{ color: walletBalance >= payable ? "#059669" : "#d97706", fontWeight: 700 }}>
                        ₹{walletBalance.toLocaleString("en-IN")}
                        {walletBalance >= payable ? " · covers it" : " · you'll pay the rest online"}
                      </span>
                    </div>
                  )}

                  {payErr && (
                    <div style={{ fontSize: 12, color: "#b91c1c", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "8px 10px", marginBottom: 10, fontFamily: F }}>
                      {payErr}
                    </div>
                  )}

                  {(() => {
                    // No name, no test — the button stays locked until the
                    // required field holds something usable.
                    const blocked = needsName && !!validateName(nameInput);
                    const busy = payBusy || nameBusy;
                    return (
                      <button onClick={() => void start()} disabled={busy || blocked} className="ma-btn" style={{
                        width: "100%", padding: "14px", fontSize: 15, fontWeight: 700, fontFamily: F,
                        background: busy ? "#a5b4fc" : "linear-gradient(135deg, #4f46e5, #7c3aed)", color: "white",
                        border: "none", borderRadius: 12, cursor: busy || blocked ? "not-allowed" : "pointer",
                        opacity: blocked ? .55 : 1,
                        boxShadow: "0 4px 20px rgba(79,70,229,.35), inset 0 1px 0 rgba(255,255,255,.15)",
                      }}>
                        {busy ? "Processing…" : payable === 0 ? "Start Assessment →" : `Pay ₹${payable.toLocaleString("en-IN")} & Start →`}
                      </button>
                    );
                  })()}
                </>
              ) : (
                <>
                  <div style={{ fontSize: 13, color: "#475569", marginBottom: 14, fontFamily: F }}>
                    Sign in to begin. We'll use the name on your profile — if you're new, we'll ask for it here.
                  </div>
                  <button onClick={() => void start()} className="ma-btn" style={{
                    width: "100%", padding: "14px", fontSize: 15, fontWeight: 700, fontFamily: F,
                    background: "linear-gradient(135deg, #4f46e5, #7c3aed)", color: "white",
                    border: "none", borderRadius: 12, cursor: "pointer",
                    boxShadow: "0 4px 20px rgba(79,70,229,.35), inset 0 1px 0 rgba(255,255,255,.15)",
                  }}>Sign in & Start →</button>
                </>
              )}
              <p style={{ fontSize: 11, color: "#94a3b8", margin: "10px 0 0", textAlign: "center", fontFamily: F }}>Personalised AI report · Instant results · Downloadable PDF</p>
            </div>
          </div>
        </div>
      </div>

      {/* Everything below stacks down the page — it sits OUTSIDE the centring
          flex row above, which would otherwise lay these out as extra columns
          beside the hero. */}
      <div style={{ padding: "0 20px 56px" }}>
        {/* ── What happens after the report ─────────────────────────────────
            A report on its own doesn't change anything. This says plainly what
            the next step is, before they pay. */}
        <div style={{ maxWidth: 980, margin: "40px auto 0", padding: "0 4px" }}>
          <h2 style={{ fontSize: "clamp(20px,3vw,26px)", fontWeight: 800, color: "#1e1b4b", letterSpacing: "-0.5px", margin: "0 0 6px", fontFamily: F }}>
            What happens after your report
          </h2>
          <p style={{ fontSize: 13.5, color: "#64748b", lineHeight: 1.7, margin: "0 0 18px", maxWidth: 640, fontFamily: F }}>
            The report tells you which fields fit you. The harder question is what to do about it — which
            exam, which college, which branch. That's the part a counsellor answers, and your results tell
            you which kind of counsellor you actually need.
          </p>
          <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))" }}>
            {[
              ["🎯", "You learn where you fit", "Nine skill areas scored out of 100, so you can see your strengths ranked instead of guessing."],
              ["🧭", "You get three real options", "Top career matches with fit-scores and a step-by-step roadmap for each — not a one-word label."],
              ["👤", "You talk to the right expert", "Take your report to a ProCounsel counsellor who works in that field — engineering, medical, design, management — instead of starting the conversation from scratch."],
            ].map(([icon, title, body]) => (
              <div key={title} style={{ ...GLASS(0.7, 18), borderRadius: 16, padding: "16px 18px" }}>
                <div style={{ fontSize: 20, marginBottom: 8 }}>{icon}</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#1e1b4b", marginBottom: 6, fontFamily: F }}>{title}</div>
                <div style={{ fontSize: 12.5, color: "#64748b", lineHeight: 1.6, fontFamily: F }}>{body}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── FAQ ───────────────────────────────────────────────────────── */}
        <div style={{ maxWidth: 980, margin: "36px auto 8px", padding: "0 4px" }}>
          <h2 style={{ fontSize: "clamp(20px,3vw,26px)", fontWeight: 800, color: "#1e1b4b", letterSpacing: "-0.5px", margin: "0 0 16px", fontFamily: F }}>
            Before you start
          </h2>
          <div style={{ ...GLASS(0.7, 18), borderRadius: 16, padding: "4px 18px" }}>
            {START_FAQS.map((f, i) => (
              <details key={f.q} style={{ borderTop: i === 0 ? "none" : "1px solid rgba(0,0,0,.06)", padding: "14px 0" }}>
                <summary style={{ cursor: "pointer", listStyle: "none", fontSize: 13.5, fontWeight: 700, color: "#1e1b4b", display: "flex", justifyContent: "space-between", gap: 16, fontFamily: F }}>
                  {f.q}
                  <span style={{ color: "#7c3aed", flexShrink: 0 }}>+</span>
                </summary>
                <p style={{ fontSize: 12.5, color: "#64748b", lineHeight: 1.7, margin: "10px 0 0", fontFamily: F }}>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
      {isLoginToggle && <LoginCard />}
    </div>
  );

  // ─────────────────────────────── CATEGORY INTRO ────────────────────────────
  if (screen === "cat-intro") return (
    <div ref={top} className="ma" style={{ minHeight: "100vh", background: cat.catBg, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <div style={{ position: "absolute", top: -60, right: -60, width: 360, height: 360, borderRadius: "50%", background: `radial-gradient(circle, ${cat.color}22 0%, transparent 65%)`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: -40, left: -40, width: 280, height: 280, borderRadius: "50%", background: `radial-gradient(circle, ${cat.color}14 0%, transparent 65%)`, pointerEvents: "none" }} />

      <nav style={{ padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }} className="ma-np">
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <img loading="lazy" decoding="async" src="/logo.svg" alt="" style={{ width: 24, height: 24, opacity: .5 }} />
          <span style={{ color: "#64748b", fontWeight: 600, fontSize: 13, fontFamily: F }}>ProCounsel</span>
        </div>
        <Dots ci={ci} />
      </nav>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "32px 20px" }}>
        <div className="ma-in" style={{ maxWidth: 400, textAlign: "center", width: "100%" }}>
          <div style={{ fontSize: 72, marginBottom: 20, filter: `drop-shadow(0 4px 16px ${cat.color}40)` }}>{cat.emoji}</div>

          <div style={{ display: "inline-block", background: `${cat.color}14`, border: `1px solid ${cat.color}30`, borderRadius: 99, padding: "5px 16px", marginBottom: 14 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: cat.color, letterSpacing: 1.5, textTransform: "uppercase", fontFamily: F }}>Section {ci + 1} of {CATS.length}</span>
          </div>

          <h2 style={{ fontSize: "clamp(26px,6vw,36px)", fontWeight: 900, color: "#1e1b4b", margin: "0 0 12px", letterSpacing: "-0.8px", lineHeight: 1.15, fontFamily: F }}>{cat.name}</h2>
          <p style={{ fontSize: 15, color: "#64748b", lineHeight: 1.8, margin: "0 0 28px", fontFamily: F }}>{cat.qs.length} statements about your {cat.name.toLowerCase()} aptitude.</p>

          <div style={{ display: "flex", gap: 6, justifyContent: "center", marginBottom: 28 }}>
            {cat.qs.map((_, i) => <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: `${cat.color}30`, border: `1px solid ${cat.color}40` }} />)}
          </div>

          <button onClick={() => setScreen("quiz")} className="ma-btn" style={{
            padding: "14px 44px", fontSize: 15, fontWeight: 700, fontFamily: F,
            background: cat.color, color: "white", border: "none", borderRadius: 14, cursor: "pointer",
            boxShadow: `0 6px 24px ${cat.color}40, inset 0 1px 0 rgba(255,255,255,.2)`,
          }}>Start Section →</button>

          {ci > 0 && <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 14, fontFamily: F }}>{Object.keys(ans).length} of {QUESTIONS.length} answered so far</p>}
        </div>
      </div>
    </div>
  );

  // ──────────────────────────────── QUIZ ─────────────────────────────────────
  if (screen === "quiz") {
    const gi   = gIdx(ci, qi);
    const sel  = ans[gi];
    const last = ci === CAT_QS.length - 1 && qi === cat.qs.length - 1;
    const first = ci === 0 && qi === 0;
    const catPct = ((qi + 1) / cat.qs.length) * 100;

    return (
      <div ref={top} className="ma" style={{ minHeight: "100vh", background: cat.catBg, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 300, height: 300, borderRadius: "50%", background: `radial-gradient(circle, ${cat.color}18 0%, transparent 65%)`, pointerEvents: "none" }} />

        {/* Header */}
        <div className="ma-np">
          <div style={{ padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <span style={{ fontSize: 16 }}>{cat.emoji}</span>
              <span style={{ color: cat.color, fontWeight: 700, fontSize: 13, fontFamily: F }}>{cat.name}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ color: "#94a3b8", fontSize: 12, fontWeight: 600, fontFamily: F }}>{qi + 1}/{cat.qs.length}</span>
              <Dots ci={ci} />
            </div>
          </div>
          <div style={{ height: 3, background: "rgba(0,0,0,.06)", margin: "0 20px" }}>
            <div style={{ height: "100%", width: `${catPct}%`, background: cat.color, borderRadius: 99, transition: "width .3s ease" }} />
          </div>
        </div>

        {/* Card */}
        <div style={{ flex: 1, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "24px 16px 48px" }}>
          <div className="ma-in" style={{ width: "100%", maxWidth: 560 }}>
            <div style={{ ...GLASS(0.78, 22), borderRadius: 22, padding: "30px 26px 26px" }}>

              <div style={{ fontSize: 11, fontWeight: 700, color: cat.color, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 14, fontFamily: F }}>
                Question {qi + 1} of {cat.qs.length}
              </div>

              <p style={{ fontSize: "clamp(17px,3.5vw,20px)", fontWeight: 700, color: "#1e1b4b", lineHeight: 1.65, margin: "0 0 30px", fontFamily: F }}>
                {cat.qs[qi].text}
              </p>

              {/* Scale */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                  <span style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600, fontFamily: F }}>Strongly Disagree</span>
                  <span style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600, fontFamily: F }}>Strongly Agree</span>
                </div>
                <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                  {[1, 2, 3, 4, 5].map(s => {
                    const on = sel === s;
                    return (
                      <div key={s} className="ma-btn" onClick={() => pick(s)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 7, flex: 1 }}>
                        <div style={{
                          width: "100%", maxWidth: 56, aspectRatio: "1", borderRadius: "50%",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 16, fontWeight: 800, fontFamily: F,
                          background: on ? cat.color : "rgba(255,255,255,.85)",
                          border: `2px solid ${on ? cat.color : "rgba(0,0,0,.08)"}`,
                          color: on ? "white" : "#94a3b8",
                          boxShadow: on ? `0 4px 16px ${cat.color}45` : "0 1px 4px rgba(0,0,0,.06)",
                          transition: "all .15s ease",
                        }}>{s}</div>
                        <span style={{ fontSize: 9, color: on ? cat.color : "#94a3b8", textAlign: "center", lineHeight: 1.3, fontWeight: on ? 700 : 500, fontFamily: F, whiteSpace: "pre-line" }}>
                          {SCALE_LABELS[s]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: "flex", gap: 10, marginTop: 26 }}>
                <button onClick={goPrev} disabled={first} className="ma-btn" style={{
                  padding: "12px 20px", borderRadius: 12, fontFamily: F, fontSize: 14, fontWeight: 600,
                  background: "rgba(255,255,255,.6)", border: "1.5px solid rgba(0,0,0,.08)", color: "#64748b",
                  cursor: first ? "not-allowed" : "pointer", opacity: first ? .4 : 1,
                }}>← Back</button>
                <button onClick={goNext} disabled={!sel} className="ma-btn" style={{
                  flex: 1, padding: "12px 20px", borderRadius: 12, fontFamily: F, fontSize: 14, fontWeight: 700,
                  background: sel ? cat.color : "rgba(0,0,0,.06)",
                  color: sel ? "white" : "#94a3b8", border: "none", cursor: sel ? "pointer" : "not-allowed",
                  boxShadow: sel ? `0 4px 16px ${cat.color}40` : "none", transition: "all .2s",
                }}>{last ? "Submit & Get Report →" : "Next →"}</button>
              </div>
            </div>

            {/* Overall progress */}
            <div style={{ marginTop: 14, padding: "0 4px" }}>
              <div style={{ height: 4, background: "rgba(0,0,0,.07)", borderRadius: 99, overflow: "hidden" }}>
                <div className="ma-bar" style={{ height: "100%", width: `${(Object.keys(ans).length / QUESTIONS.length) * 100}%`, background: `linear-gradient(90deg,#4f46e5,${cat.color})`, transition: "width .3s ease" }} />
              </div>
              <p style={{ fontSize: 10, color: "#94a3b8", marginTop: 5, textAlign: "center", fontFamily: F }}>{Object.keys(ans).length} of {QUESTIONS.length} answered</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────── LOADING ──────────────────────────────────
  if (screen === "loading") return (
    <div ref={top} className="ma" style={{ minHeight: "100vh", background: "linear-gradient(145deg,#f0f4ff 0%,#fdf4ff 50%,#fff8f0 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40 }}>
      <div style={{ position: "relative", width: 88, height: 88, margin: "0 auto 28px" }}>
        <div className="ma-spin" style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "3px solid #e0e7ff", borderTop: "3px solid #4f46e5" }} />
        <div className="ma-spin" style={{ position: "absolute", inset: 12, borderRadius: "50%", border: "2px solid #fce7f3", borderTop: "2px solid #db2777", animationDirection: "reverse", animationDuration: "1.4s" }} />
        <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>🧠</span>
      </div>
      <h2 style={{ color: "#1e1b4b", fontSize: 22, fontWeight: 800, margin: "0 0 10px", fontFamily: F, textAlign: "center" }}>Analyzing your profile…</h2>
      <p className="ma-pop" style={{ color: "#64748b", fontSize: 14, maxWidth: 320, lineHeight: 1.8, fontFamily: F, textAlign: "center" }}>We're reviewing your {QUESTIONS.length} answers and matching them to career paths built around your strengths.</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginTop: 24 }}>
        {["Mapping aptitudes", "Matching careers", "Writing report"].map((s, i) => (
          <div key={i} style={{ ...GLASS(0.65, 12), borderRadius: 99, padding: "6px 14px", fontSize: 11, color: "#64748b", fontFamily: F }}>{s}</div>
        ))}
      </div>
    </div>
  );

  // ──────────────────────────────── ERROR ────────────────────────────────────
  if (screen === "error") return (
    <div ref={top} className="ma" style={{ minHeight: "100vh", background: "linear-gradient(145deg,#fff5f5 0%,#fef2f2 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div className="ma-in" style={{ ...GLASS(0.8, 20), borderRadius: 22, padding: "44px 32px", maxWidth: 400, width: "100%", textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: "#1e1b4b", margin: "0 0 10px", fontFamily: F }}>Something went wrong</h2>
        <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.75, marginBottom: 24, fontFamily: F }}>{err}</p>
        <button onClick={retake} className="ma-btn" style={{ background: "#1e1b4b", color: "white", border: "none", borderRadius: 12, padding: "12px 28px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: F }}>Try Again</button>
      </div>
    </div>
  );

  // ─────────────────────────────── REPORT ───────────────────────────────────
  if (screen === "report" && report) {
    const FC: Record<string, string> = { Technology:"#4f46e5",Engineering:"#6366f1",Healthcare:"#059669",Business:"#d97706",Arts:"#db2777",Law:"#0284c7",Education:"#0ea5e9",Environment:"#16a34a",Science:"#0d9488",Media:"#db2777",Finance:"#d97706",Design:"#9333ea" };
    const fc = (f: string) => FC[f] || "#475569";

    return (
      <div id="mettle-report" ref={top} className="ma" style={{ minHeight: "100vh", background: "linear-gradient(160deg,#f0f4ff 0%,#fdf4ff 45%,#fff8f0 100%)" }}>
        {/* Nav */}
        <div style={{ padding: "14px 24px", display: "flex", alignItems: "center", gap: 10, ...GLASS(0.8, 16), borderBottom: "1px solid rgba(0,0,0,.06)", position: "sticky", top: 0, zIndex: 10 }} className="ma-np">
          <img loading="lazy" decoding="async" src="/logo.svg" alt="" style={{ width: 26, height: 26 }} />
          <span style={{ color: "#1e1b4b", fontWeight: 700, fontSize: 15, fontFamily: F }}>ProCounsel</span>
          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            <button onClick={retake} className="ma-btn" style={{ ...GLASS(0.6, 12), borderRadius: 9, padding: "7px 16px", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: F, color: "#64748b", border: "1.5px solid rgba(0,0,0,.08)" }}>Retake</button>
            <button onClick={() => void downloadReportPdf()} className="ma-btn" style={{ background: "linear-gradient(135deg,#4f46e5,#7c3aed)", color: "white", border: "none", borderRadius: 9, padding: "7px 16px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: F, boxShadow: "0 4px 14px rgba(79,70,229,.35)" }}>↓ Download PDF</button>
          </div>
        </div>

        <div style={{ maxWidth: 880, margin: "0 auto", padding: "24px 16px 60px" }}>

          {/* Hero card */}
          <div className="ma-up" style={{ ...GLASS(0.82, 24), borderRadius: 22, padding: "30px 34px", marginBottom: 18, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(79,70,229,.1), transparent 65%)", pointerEvents: "none" }} />
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", gap: 14, marginBottom: 18 }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: "linear-gradient(135deg,#4f46e5,#7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>🧠</div>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: "#94a3b8", textTransform: "uppercase", marginBottom: 2, fontFamily: F }}>ProCounsel · Mettle Assessment</div>
                <h1 style={{ color: "#1e1b4b", fontSize: 20, fontWeight: 800, margin: 0, fontFamily: F }}>{name}</h1>
                <div style={{ color: "#94a3b8", fontSize: 11, marginTop: 2, fontFamily: F }}>{date} · {QUESTIONS.length} questions · procounsel.co.in</div>
              </div>
            </div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#eef2ff", border: "1px solid #c7d2fe", borderRadius: 10, padding: "9px 16px", marginBottom: 12 }}>
              <span style={{ fontSize: 16 }}>✦</span>
              <span style={{ color: "#4f46e5", fontWeight: 800, fontSize: 15, fontFamily: F }}>{report.personalityType}</span>
            </div>
            <p style={{ color: "#64748b", fontSize: 13, margin: "0 0 14px", fontStyle: "italic", lineHeight: 1.6, fontFamily: F }}>"{report.personalityTagline}"</p>
            <p style={{ color: "#374151", fontSize: 13, lineHeight: 1.8, margin: 0, padding: "14px 16px", background: "#eef2ff", borderRadius: 10, border: "1px solid #c7d2fe", borderLeft: "3px solid #4f46e5", fontFamily: F }}>
              {report.overallProfile}
            </p>
          </div>

          <Label>Top Career Matches</Label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 14, marginBottom: 18 }}>
            {report.topCareers.map((c, i) => {
              const color = fc(c.field);
              return (
                <div key={i} className="ma-card" style={{ ...GLASS(0.8, 20), borderRadius: 18, overflow: "hidden", border: `1px solid ${color}20` }}>
                  <div style={{ padding: "18px 20px 14px", background: `linear-gradient(135deg,${color}10,${color}06)`, borderBottom: `1px solid ${color}15` }}>
                    {i === 0 && <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1.5, color, textTransform: "uppercase", marginBottom: 7, fontFamily: F, background: `${color}14`, display: "inline-block", padding: "2px 8px", borderRadius: 99 }}>Best Match</div>}
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
                      <div>
                        <h3 style={{ color: "#1e1b4b", fontWeight: 800, fontSize: 15, margin: "0 0 3px", fontFamily: F, lineHeight: 1.3 }}>{c.title}</h3>
                        <div style={{ fontSize: 11, color, fontWeight: 700, fontFamily: F }}>{c.field}</div>
                      </div>
                      <Ring pct={c.fitScore} color={color} size={64} />
                    </div>
                  </div>
                  <div style={{ padding: "16px 20px" }}>
                    <p style={{ fontSize: 12, color: "#475569", lineHeight: 1.7, margin: "0 0 12px", fontFamily: F }}>{c.description}</p>
                    <div style={{ background: `${color}08`, border: `1px solid ${color}18`, borderRadius: 8, padding: "10px 12px", marginBottom: 12 }}>
                      <div style={{ fontSize: 9, fontWeight: 700, color, textTransform: "uppercase", letterSpacing: .8, marginBottom: 4, fontFamily: F }}>Why You Fit</div>
                      <p style={{ fontSize: 11, color: "#374151", lineHeight: 1.65, margin: 0, fontFamily: F }}>{c.whyYouFit}</p>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 12 }}>
                      {c.keySkills.map((sk, j) => <span key={j} style={{ background: `${color}10`, color, padding: "3px 10px", borderRadius: 99, fontSize: 10, fontWeight: 700, fontFamily: F, border: `1px solid ${color}20` }}>{sk}</span>)}
                    </div>
                    <div style={{ borderTop: "1px solid rgba(0,0,0,.05)", paddingTop: 12 }}>
                      <div style={{ fontSize: 9, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: .8, marginBottom: 8, fontFamily: F }}>Path to Get There</div>
                      {c.steps.map((step, j) => (
                        <div key={j} style={{ display: "flex", gap: 8, marginBottom: 6, alignItems: "flex-start" }}>
                          <div style={{ width: 18, height: 18, borderRadius: "50%", background: color, color: "white", fontSize: 10, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>{j + 1}</div>
                          <span style={{ fontSize: 11, color: "#374151", lineHeight: 1.6, fontFamily: F }}>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <Label>Your Key Strengths</Label>
          <div style={{ ...GLASS(0.8, 20), borderRadius: 18, padding: "24px 28px", marginBottom: 18 }}>
            {report.strengths.map((s, i) => {
              const sc = CATS[i % CATS.length].color;
              return (
                <div key={i} style={{ marginBottom: i < report.strengths.length - 1 ? 20 : 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontWeight: 700, fontSize: 13, color: "#1e1b4b", fontFamily: F }}>{s.name}</span>
                    <span style={{ fontWeight: 800, fontSize: 13, color: sc, fontFamily: F }}>{s.score}%</span>
                  </div>
                  <div style={{ height: 7, background: "rgba(0,0,0,.06)", borderRadius: 99, overflow: "hidden", marginBottom: 5 }}>
                    <div className="ma-bar" style={{ height: "100%", width: `${s.score}%`, background: `linear-gradient(90deg,${sc},${sc}bb)`, borderRadius: 99 }} />
                  </div>
                  <p style={{ fontSize: 11, color: "#64748b", lineHeight: 1.6, margin: 0, fontFamily: F }}>{s.description}</p>
                </div>
              );
            })}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 14, marginBottom: 18 }}>
            <div>
              <Label>Areas to Develop</Label>
              <div style={{ ...GLASS(0.78, 18), borderRadius: 18, padding: "20px 22px" }}>
                {report.developmentAreas.map((d, i) => (
                  <div key={i} style={{ marginBottom: i < report.developmentAreas.length - 1 ? 16 : 0, paddingBottom: i < report.developmentAreas.length - 1 ? 16 : 0, borderBottom: i < report.developmentAreas.length - 1 ? "1px solid rgba(0,0,0,.05)" : "none" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 4 }}>
                      <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#f59e0b", flexShrink: 0 }} />
                      <span style={{ fontWeight: 700, fontSize: 13, color: "#1e1b4b", fontFamily: F }}>{d.name}</span>
                    </div>
                    <p style={{ fontSize: 12, color: "#64748b", lineHeight: 1.7, margin: "0 0 0 14px", fontFamily: F }}>{d.tip}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Label>Your Next Steps</Label>
              <div style={{ ...GLASS(0.78, 18), borderRadius: 18, padding: "20px 22px" }}>
                {report.nextSteps.map((step, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, marginBottom: i < report.nextSteps.length - 1 ? 14 : 0, alignItems: "flex-start" }}>
                    <div style={{ width: 24, height: 24, borderRadius: 7, background: "linear-gradient(135deg,#4f46e5,#7c3aed)", color: "white", fontSize: 11, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 2px 8px rgba(79,70,229,.3)" }}>{i + 1}</div>
                    <p style={{ fontSize: 12, color: "#374151", lineHeight: 1.7, margin: 0, fontFamily: F }}>{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="ma-np" style={{ ...GLASS(0.75, 16), borderRadius: 16, padding: "15px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
            <span style={{ fontSize: 11, color: "#94a3b8", fontFamily: F }}><strong style={{ color: "#1e1b4b" }}>ProCounsel</strong> · AI-generated career report · procounsel.co.in
              {saveState !== "idle" && (
                <span style={{ marginLeft: 8, color: saveState === "saved" ? "#059669" : saveState === "failed" ? "#b91c1c" : "#94a3b8" }} data-html2canvas-ignore="true">
                  ·{" "}
                  {saveState === "saving" ? "Saving your report…"
                    : saveState === "saved" ? "Saved to your profile"
                    : saveState === "skipped" ? "Sign in to save this report"
                    : "Couldn't save — you can still download it"}
                </span>
              )}
            </span>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={retake} className="ma-btn" style={{ ...GLASS(0.6, 12), borderRadius: 9, padding: "8px 16px", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: F, color: "#64748b", border: "1.5px solid rgba(0,0,0,.08)" }}>Retake</button>
              <button onClick={() => void downloadReportPdf()} className="ma-btn" style={{ background: "linear-gradient(135deg,#4f46e5,#7c3aed)", color: "white", border: "none", borderRadius: 9, padding: "8px 16px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: F, boxShadow: "0 4px 12px rgba(79,70,229,.35)" }}>↓ Download PDF</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return null;
}

function Label({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 10, fontFamily: "'Inter','Poppins',system-ui,sans-serif" }}>{children}</div>;
}
