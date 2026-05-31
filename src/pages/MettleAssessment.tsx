import { useState, useEffect, useRef } from "react";
import axios from "axios";

const COLLEGE_API = "https://college-search-api.vercel.app";

// ── Category definitions ──────────────────────────────────────────────────────
const CATEGORIES = [
  {
    key: "Analytical", name: "Analytical Thinking", emoji: "🧠",
    color: "#7c3aed", light: "#f5f3ff", dark: "#4c1d95",
    bg: "linear-gradient(135deg, #2d1b69 0%, #7c3aed 100%)",
    desc: "How you approach complex problems, reason through evidence, and build logical conclusions.",
  },
  {
    key: "Creative", name: "Creative Expression", emoji: "🎨",
    color: "#e11d78", light: "#fdf2f8", dark: "#9d174d",
    bg: "linear-gradient(135deg, #6b0f3a 0%, #e11d78 100%)",
    desc: "Your capacity for original thinking, imagination, and expressing ideas in new ways.",
  },
  {
    key: "Social", name: "Social & Empathy", emoji: "🤝",
    color: "#0284c7", light: "#f0f9ff", dark: "#075985",
    bg: "linear-gradient(135deg, #0c3453 0%, #0284c7 100%)",
    desc: "How naturally you connect with people, read emotions, and build meaningful relationships.",
  },
  {
    key: "Leadership", name: "Leadership", emoji: "🚀",
    color: "#ea580c", light: "#fff7ed", dark: "#9a3412",
    bg: "linear-gradient(135deg, #5c1a04 0%, #ea580c 100%)",
    desc: "Your drive to lead, take initiative, persuade others, and turn vision into results.",
  },
  {
    key: "Technical", name: "Technical Aptitude", emoji: "⚙️",
    color: "#059669", light: "#ecfdf5", dark: "#065f46",
    bg: "linear-gradient(135deg, #022c22 0%, #059669 100%)",
    desc: "Your affinity for technology, science, precision, and hands-on problem solving.",
  },
  {
    key: "Nature", name: "Nature & Environment", emoji: "🌿",
    color: "#16a34a", light: "#f0fdf4", dark: "#14532d",
    bg: "linear-gradient(135deg, #052e16 0%, #16a34a 100%)",
    desc: "Your connection to the natural world, living systems, and environmental stewardship.",
  },
  {
    key: "Organized", name: "Organization & Structure", emoji: "📋",
    color: "#475569", light: "#f8fafc", dark: "#1e293b",
    bg: "linear-gradient(135deg, #0f172a 0%, #475569 100%)",
    desc: "How well you manage detail, build systems, follow procedures, and maintain order.",
  },
  {
    key: "Communication", name: "Communication", emoji: "💬",
    color: "#b45309", light: "#fffbeb", dark: "#78350f",
    bg: "linear-gradient(135deg, #3d1a02 0%, #b45309 100%)",
    desc: "How effectively you express ideas, argue positions, write, and engage through language.",
  },
  {
    key: "Social Impact", name: "Social Impact", emoji: "🌍",
    color: "#6d28d9", light: "#f5f3ff", dark: "#4c1d95",
    bg: "linear-gradient(135deg, #2e1065 0%, #6d28d9 100%)",
    desc: "Your motivation to serve communities, drive change, and make society a better place.",
  },
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
];

// Build category → questions map in CATEGORIES order
const CAT_QUESTIONS = CATEGORIES.map(cat => ({
  ...cat,
  qs: QUESTIONS.filter(q => q.category === cat.key),
}));

// Global index for a question (catIdx, qInCat)
function gIdx(catIdx: number, qInCat: number) {
  let n = 0;
  for (let i = 0; i < catIdx; i++) n += CAT_QUESTIONS[i].qs.length;
  return n + qInCat;
}

const SCALE = [
  { score: 1, label: "Strongly\nDisagree" },
  { score: 2, label: "Disagree" },
  { score: 3, label: "Neutral" },
  { score: 4, label: "Agree" },
  { score: 5, label: "Strongly\nAgree" },
];

// ── Types ─────────────────────────────────────────────────────────────────────
interface CareerPath { title: string; field: string; fitScore: number; description: string; whyYouFit: string; keySkills: string[]; steps: string[]; }
interface Strength { name: string; score: number; description: string; }
interface DevArea { name: string; tip: string; }
interface AssessmentReport { personalityType: string; personalityTagline: string; overallProfile: string; topCareers: CareerPath[]; strengths: Strength[]; developmentAreas: DevArea[]; nextSteps: string[]; }

// ── CSS ───────────────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
  .ma-root { font-family: 'Inter', 'Poppins', system-ui, sans-serif; }
  @keyframes maFadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
  @keyframes maSpin { to { transform:rotate(360deg); } }
  @keyframes maPulse { 0%,100%{opacity:1} 50%{opacity:.45} }
  @keyframes maScaleIn { from{opacity:0;transform:scale(.92)} to{opacity:1;transform:scale(1)} }
  @keyframes maSweep { from{width:0} }
  .ma-fade-up { animation: maFadeUp .45s cubic-bezier(.22,1,.36,1) both; }
  .ma-scale-in { animation: maScaleIn .35s cubic-bezier(.22,1,.36,1) both; }
  .ma-spinner { animation: maSpin 1s linear infinite; }
  .ma-pulse { animation: maPulse 1.8s ease infinite; }
  .ma-bar-fill { animation: maSweep 1.2s cubic-bezier(.22,1,.36,1) both; }
  .ma-opt:hover { filter: brightness(1.06); transform: translateY(-1px); }
  .ma-opt { transition: all .15s cubic-bezier(.22,1,.36,1); }
  .ma-card-hover:hover { transform: translateY(-3px); box-shadow: 0 20px 48px rgba(0,0,0,.12) !important; }
  .ma-card-hover { transition: all .2s ease; }
  @media print {
    .ma-no-print { display:none!important; }
    .ma-root { background: white!important; }
  }
  @media(max-width:640px) {
    .ma-scale-row { gap: 8px!important; }
    .ma-scale-circle { width: 48px!important; height: 48px!important; font-size: 14px!important; }
    .ma-career-grid { grid-template-columns: 1fr!important; }
  }
`;

// ── Helpers ───────────────────────────────────────────────────────────────────
function ScoreRing({ score, color, size = 84 }: { score: number; color: string; size?: number }) {
  const r = size * 0.36, cx = size / 2, circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ flexShrink: 0 }}>
      <circle cx={cx} cy={cx} r={r} fill="none" stroke={color} strokeWidth={size * 0.1} strokeOpacity=".15" />
      <circle cx={cx} cy={cx} r={r} fill="none" stroke={color} strokeWidth={size * 0.1}
        strokeDasharray={`${dash.toFixed(1)} ${circ.toFixed(1)}`} strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cx})`} />
      <text x={cx} y={cx + 1} textAnchor="middle" fontSize={size * 0.23} fontWeight="800" fill={color} fontFamily="Inter,system-ui">{score}%</text>
      <text x={cx} y={cx + size * 0.17} textAnchor="middle" fontSize={size * 0.12} fill="#94a3b8" fontFamily="Inter,system-ui">fit</text>
    </svg>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
type Screen = "start" | "cat-intro" | "quiz" | "loading" | "report" | "error";

const DEV = typeof window !== "undefined" && (window.location.hostname === "localhost" || new URLSearchParams(window.location.search).get("dev") === "true");

export default function MettleAssessment() {
  const [screen, setScreen] = useState<Screen>("start");
  const [name, setName] = useState("");
  const [nameErr, setNameErr] = useState(false);
  const [catIdx, setCatIdx] = useState(0);
  const [qInCat, setQInCat] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({}); // globalIdx → score 1-5
  const [report, setReport] = useState<AssessmentReport | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = CSS;
    document.head.appendChild(el);
    return () => { document.head.removeChild(el); };
  }, []);

  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [screen, catIdx, qInCat]);

  const cat = CAT_QUESTIONS[catIdx];
  const totalAnswered = Object.keys(answers).length;
  const totalQ = QUESTIONS.length;
  const dateStr = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

  function startTest() {
    if (!name.trim()) { setNameErr(true); return; }
    setCatIdx(0); setQInCat(0); setAnswers({});
    setScreen("cat-intro");
  }

  function beginCategory() { setScreen("quiz"); }

  function pickAnswer(score: number) {
    const gi = gIdx(catIdx, qInCat);
    setAnswers(a => ({ ...a, [gi]: score }));
  }

  function goNext() {
    const gi = gIdx(catIdx, qInCat);
    if (!answers[gi]) return;
    const isLastInCat = qInCat === cat.qs.length - 1;
    const isLastCat = catIdx === CAT_QUESTIONS.length - 1;
    if (isLastInCat && isLastCat) { submitAssessment(); return; }
    if (isLastInCat) { setCatIdx(c => c + 1); setQInCat(0); setScreen("cat-intro"); return; }
    setQInCat(q => q + 1);
  }

  function goPrev() {
    if (qInCat > 0) { setQInCat(q => q - 1); return; }
    if (catIdx > 0) { setCatIdx(c => c - 1); setQInCat(CAT_QUESTIONS[catIdx - 1].qs.length - 1); setScreen("quiz"); }
  }

  async function submitAssessment() {
    setScreen("loading");
    const payload = QUESTIONS.map((q, i) => {
      const score = answers[i] ?? 3;
      return { question: q.text, category: q.category, answer: SCALE.find(s => s.score === score)?.label.replace("\n", " ") ?? "Neutral", score };
    });
    try {
      const { data } = await axios.post<AssessmentReport>(`${COLLEGE_API}/assess`, { name: name.trim(), answers: payload });
      setReport(data);
      setScreen("report");
    } catch (err: unknown) {
      setErrorMsg(axios.isAxiosError(err) && err.response?.data?.error ? err.response.data.error : "Could not reach the assessment server.");
      setScreen("error");
    }
  }

  function retake() { setName(""); setAnswers({}); setCatIdx(0); setQInCat(0); setReport(null); setErrorMsg(""); setScreen("start"); }

  function devSkip() {
    const n = name.trim() || "Test User";
    setName(n);
    const a: Record<number, number> = {};
    QUESTIONS.forEach((_, i) => { a[i] = [5, 4, 5, 3, 2][i % 5]; });
    setAnswers(a);
    setScreen("loading");
    axios.post<AssessmentReport>(`${COLLEGE_API}/assess`, {
      name: n,
      answers: QUESTIONS.map((q, i) => ({ question: q.text, category: q.category, answer: "Strongly Agree", score: 5 })),
    }).then(({ data }) => { setReport(data); setScreen("report"); })
      .catch(() => { setErrorMsg("Dev skip API error"); setScreen("error"); });
  }

  // ── Category progress dots ────────────────────────────────────────────────
  const CatDots = () => (
    <div style={{ display: "flex", gap: 6, alignItems: "center", justifyContent: "center" }}>
      {CAT_QUESTIONS.map((c, i) => {
        const done = i < catIdx || (i === catIdx && screen === "report");
        const active = i === catIdx;
        return (
          <div key={i} style={{
            width: active ? 28 : 8, height: 8, borderRadius: 99,
            background: done ? c.color : active ? c.color : "rgba(255,255,255,.25)",
            opacity: done ? 1 : active ? 1 : .5,
            transition: "all .3s ease",
          }} />
        );
      })}
    </div>
  );

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // START SCREEN
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  if (screen === "start") return (
    <div ref={topRef} className="ma-root" style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0a0f1e 0%, #1a1040 40%, #0a1628 100%)", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
      {/* Decorative blobs */}
      <div style={{ position: "absolute", top: -100, right: -100, width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,.2) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: -80, left: -80, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(2,132,199,.15) 0%, transparent 70%)", pointerEvents: "none" }} />

      {/* Nav */}
      <div style={{ padding: "18px 32px", display: "flex", alignItems: "center", gap: 12 }} className="ma-no-print">
        <img src="/logo.svg" alt="ProCounsel" style={{ width: 32, height: 32, filter: "brightness(0) invert(1)" }} />
        <span style={{ color: "white", fontWeight: 700, fontSize: 17, letterSpacing: "-0.3px" }}>ProCounsel</span>
      </div>

      {DEV && (
        <div style={{ background: "#fef3c7", padding: "8px 32px", fontSize: 13, color: "#92400e", display: "flex", gap: 10 }} className="ma-no-print">
          <span style={{ background: "#f59e0b", color: "white", padding: "2px 8px", borderRadius: 4, fontWeight: 700, fontSize: 11 }}>DEV</span>
          <button onClick={devSkip} style={{ background: "none", border: "none", cursor: "pointer", color: "#b45309", fontWeight: 700, textDecoration: "underline" }}>Skip to AI Report</button>
        </div>
      )}

      {/* Hero */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
        <div className="ma-scale-in" style={{ width: "100%", maxWidth: 480, textAlign: "center" }}>

          {/* Badge */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(124,58,237,.25)", border: "1px solid rgba(124,58,237,.5)", borderRadius: 99, padding: "6px 16px", marginBottom: 28 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#7c3aed" }} />
            <span style={{ color: "#c4b5fd", fontSize: 13, fontWeight: 600, letterSpacing: .5 }}>AI-Powered Career Assessment</span>
          </div>

          <h1 style={{ fontSize: "clamp(32px,7vw,52px)", fontWeight: 900, color: "white", lineHeight: 1.1, margin: "0 0 16px", letterSpacing: "-1.5px" }}>
            Discover Your<br /><span style={{ background: "linear-gradient(90deg,#a78bfa,#38bdf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Ideal Career Path</span>
          </h1>

          <p style={{ fontSize: 16, color: "rgba(255,255,255,.6)", lineHeight: 1.75, margin: "0 0 36px", maxWidth: 380, marginLeft: "auto", marginRight: "auto" }}>
            Answer 50 honest statements across 9 skill areas. Our AI analyzes your unique profile and reveals career paths built for you.
          </p>

          {/* Stats row */}
          <div style={{ display: "flex", justifyContent: "center", gap: 28, marginBottom: 36 }}>
            {[["9", "Sections"], ["50", "Questions"], ["~10", "Minutes"]].map(([v, l]) => (
              <div key={l}>
                <div style={{ fontSize: 22, fontWeight: 800, color: "white" }}>{v}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,.4)", fontWeight: 600, textTransform: "uppercase", letterSpacing: .8 }}>{l}</div>
              </div>
            ))}
          </div>

          {/* Input + CTA */}
          <div style={{ background: "rgba(255,255,255,.06)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,.12)", borderRadius: 20, padding: "28px 28px 24px" }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,.5)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8, textAlign: "left" }}>Your Name</label>
            <input
              type="text"
              value={name}
              autoFocus
              placeholder={nameErr ? "Please enter your name" : "Enter your full name"}
              onChange={e => { setName(e.target.value); setNameErr(false); }}
              onKeyDown={e => e.key === "Enter" && startTest()}
              style={{
                width: "100%", boxSizing: "border-box", padding: "14px 16px", fontSize: 16,
                background: nameErr ? "rgba(239,68,68,.08)" : "rgba(255,255,255,.08)",
                border: `1.5px solid ${nameErr ? "#ef4444" : "rgba(255,255,255,.15)"}`,
                borderRadius: 12, color: "white", outline: "none", fontFamily: "inherit",
                marginBottom: 16, transition: "border-color .2s",
              }}
            />
            <button
              onClick={startTest}
              style={{
                width: "100%", padding: "15px", fontSize: 16, fontWeight: 700, fontFamily: "inherit",
                background: "linear-gradient(135deg, #7c3aed, #2563eb)", color: "white",
                border: "none", borderRadius: 12, cursor: "pointer",
                boxShadow: "0 8px 32px rgba(124,58,237,.4)", letterSpacing: .2,
              }}
            >
              Begin Assessment →
            </button>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,.3)", margin: "14px 0 0", lineHeight: 1.5 }}>
              Free · No account needed · Powered by GPT-4o
            </p>
          </div>

          {/* Category previews */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginTop: 28 }}>
            {CATEGORIES.map(c => (
              <div key={c.key} style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 99, padding: "5px 12px" }}>
                <span style={{ fontSize: 13 }}>{c.emoji}</span>
                <span style={{ fontSize: 11, color: "rgba(255,255,255,.5)", fontWeight: 500 }}>{c.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // CATEGORY INTRO
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  if (screen === "cat-intro") return (
    <div ref={topRef} className="ma-root" style={{ minHeight: "100vh", background: cat.bg, display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 70% 30%, rgba(255,255,255,.06) 0%, transparent 60%)", pointerEvents: "none" }} />
      <div style={{ padding: "18px 32px", display: "flex", alignItems: "center", gap: 12 }} className="ma-no-print">
        <img src="/logo.svg" alt="ProCounsel" style={{ width: 28, height: 28, filter: "brightness(0) invert(1)", opacity: .7 }} />
        <span style={{ color: "rgba(255,255,255,.6)", fontWeight: 600, fontSize: 15 }}>ProCounsel</span>
        <div style={{ marginLeft: "auto" }}>
          <CatDots />
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
        <div className="ma-scale-in" style={{ maxWidth: 440, textAlign: "center" }}>
          <div style={{ fontSize: 72, marginBottom: 20, filter: "drop-shadow(0 8px 24px rgba(0,0,0,.3))" }}>{cat.emoji}</div>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, color: "rgba(255,255,255,.5)", textTransform: "uppercase", marginBottom: 10 }}>
            Section {catIdx + 1} of {CATEGORIES.length}
          </div>
          <h2 style={{ fontSize: "clamp(28px,6vw,42px)", fontWeight: 900, color: "white", margin: "0 0 16px", letterSpacing: "-0.8px", lineHeight: 1.15 }}>{cat.name}</h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,.65)", lineHeight: 1.75, margin: "0 0 36px" }}>{cat.desc}</p>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 36 }}>
            {cat.qs.map((_, i) => (
              <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: "rgba(255,255,255,.35)" }} />
            ))}
          </div>
          <button
            onClick={beginCategory}
            style={{
              padding: "15px 44px", fontSize: 16, fontWeight: 700, fontFamily: "inherit",
              background: "white", color: cat.color, border: "none", borderRadius: 14, cursor: "pointer",
              boxShadow: "0 8px 32px rgba(0,0,0,.25)", letterSpacing: .2,
            }}
          >
            Start Section →
          </button>
          {catIdx > 0 && (
            <p style={{ fontSize: 13, color: "rgba(255,255,255,.35)", marginTop: 16 }}>
              {totalAnswered} of {totalQ} questions answered so far
            </p>
          )}
        </div>
      </div>
    </div>
  );

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // QUIZ SCREEN
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  if (screen === "quiz") {
    const question = cat.qs[qInCat];
    const gi = gIdx(catIdx, qInCat);
    const selected = answers[gi];
    const isFirstQ = catIdx === 0 && qInCat === 0;
    const isLastQ = catIdx === CAT_QUESTIONS.length - 1 && qInCat === cat.qs.length - 1;
    const catProgress = ((qInCat + 1) / cat.qs.length) * 100;

    return (
      <div ref={topRef} className="ma-root" style={{ minHeight: "100vh", background: cat.light, display: "flex", flexDirection: "column" }}>
        {/* Top bar */}
        <div style={{ background: cat.bg, padding: "0 0 0" }} className="ma-no-print">
          {/* Nav row */}
          <div style={{ padding: "14px 24px 0", display: "flex", alignItems: "center", gap: 12 }}>
            <img src="/logo.svg" alt="ProCounsel" style={{ width: 26, height: 26, filter: "brightness(0) invert(1)", opacity: .8 }} />
            <span style={{ color: "rgba(255,255,255,.7)", fontWeight: 600, fontSize: 14 }}>ProCounsel</span>
            <div style={{ marginLeft: "auto" }}>
              <CatDots />
            </div>
          </div>
          {/* Category label + progress */}
          <div style={{ padding: "12px 24px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 18 }}>{cat.emoji}</span>
              <span style={{ color: "rgba(255,255,255,.9)", fontWeight: 700, fontSize: 15 }}>{cat.name}</span>
            </div>
            <span style={{ color: "rgba(255,255,255,.55)", fontSize: 13, fontWeight: 600 }}>{qInCat + 1} / {cat.qs.length}</span>
          </div>
          {/* Progress bar */}
          <div style={{ height: 3, background: "rgba(255,255,255,.15)" }}>
            <div style={{ height: "100%", width: `${catProgress}%`, background: "rgba(255,255,255,.8)", transition: "width .3s ease" }} />
          </div>
        </div>

        {/* Question card */}
        <div style={{ flex: 1, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "28px 16px 48px" }}>
          <div className="ma-scale-in" style={{ width: "100%", maxWidth: 580 }}>

            {/* Q number */}
            <div style={{ fontSize: 12, fontWeight: 700, color: cat.color, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 14, opacity: .7 }}>
              Question {qInCat + 1} of {cat.qs.length}
            </div>

            {/* Question text */}
            <h2 style={{ fontSize: "clamp(18px,3.5vw,22px)", fontWeight: 700, color: "#0f172a", lineHeight: 1.6, margin: "0 0 36px", letterSpacing: "-0.2px" }}>
              {question.text}
            </h2>

            {/* Scale */}
            <div style={{ marginBottom: 36 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>Strongly Disagree</span>
                <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>Strongly Agree</span>
              </div>
              <div className="ma-scale-row" style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                {SCALE.map(s => {
                  const isSelected = selected === s.score;
                  return (
                    <div key={s.score} className="ma-opt" onClick={() => pickAnswer(s.score)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, cursor: "pointer", flex: 1 }}>
                      <div
                        className="ma-scale-circle"
                        style={{
                          width: 56, height: 56, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 18, fontWeight: 800, fontFamily: "inherit",
                          background: isSelected ? cat.color : "white",
                          color: isSelected ? "white" : "#94a3b8",
                          border: `2px solid ${isSelected ? cat.color : "#e2e8f0"}`,
                          boxShadow: isSelected ? `0 4px 20px ${cat.color}40` : "0 2px 8px rgba(0,0,0,.04)",
                          transition: "all .15s cubic-bezier(.22,1,.36,1)",
                        }}
                      >
                        {s.score}
                      </div>
                      <span style={{ fontSize: 10, fontWeight: 600, color: isSelected ? cat.color : "#cbd5e1", textAlign: "center", lineHeight: 1.3 }}>
                        {s.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Instruction hint */}
            {!selected && (
              <p style={{ textAlign: "center", fontSize: 13, color: "#94a3b8", marginBottom: 24 }}>
                Tap a number to select your answer
              </p>
            )}

            {/* Navigation */}
            <div style={{ display: "flex", gap: 12, justifyContent: "space-between" }}>
              <button
                onClick={goPrev} disabled={isFirstQ}
                style={{
                  padding: "13px 22px", borderRadius: 12, border: "1.5px solid #e2e8f0",
                  background: "white", color: "#64748b", fontWeight: 600, fontFamily: "inherit",
                  fontSize: 14, cursor: isFirstQ ? "not-allowed" : "pointer", opacity: isFirstQ ? .35 : 1,
                }}
              >
                ← Back
              </button>
              <button
                onClick={goNext} disabled={!selected}
                style={{
                  flex: 1, padding: "13px 22px", borderRadius: 12, border: "none",
                  background: selected ? cat.color : "#e2e8f0",
                  color: selected ? "white" : "#94a3b8",
                  fontWeight: 700, fontFamily: "inherit", fontSize: 14,
                  cursor: selected ? "pointer" : "not-allowed",
                  boxShadow: selected ? `0 4px 20px ${cat.color}40` : "none",
                  transition: "all .15s ease",
                }}
              >
                {isLastQ ? "Submit & Get Report →" : "Next →"}
              </button>
            </div>

            {/* Overall progress */}
            <div style={{ marginTop: 20, textAlign: "center" }}>
              <div style={{ height: 4, background: "#e2e8f0", borderRadius: 99, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${Math.round((totalAnswered / totalQ) * 100)}%`, background: `linear-gradient(90deg, ${cat.color}, ${cat.color}aa)`, transition: "width .3s ease" }} />
              </div>
              <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 6 }}>{totalAnswered} of {totalQ} total questions answered</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // LOADING
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  if (screen === "loading") return (
    <div ref={topRef} className="ma-root" style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0a0f1e 0%, #1a1040 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40 }}>
      <div style={{ position: "relative", width: 88, height: 88, marginBottom: 36 }}>
        <div className="ma-spinner" style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "4px solid rgba(124,58,237,.2)", borderTop: "4px solid #7c3aed" }} />
        <div style={{ position: "absolute", inset: 10, borderRadius: "50%", border: "3px solid rgba(56,189,248,.15)", borderTop: "3px solid #38bdf8", animation: "maSpin 1.4s linear infinite reverse" }} className="ma-spinner" />
        <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>🧠</span>
      </div>
      <h2 style={{ color: "white", fontSize: 24, fontWeight: 800, margin: "0 0 12px", letterSpacing: "-0.4px" }}>Building your career report…</h2>
      <p className="ma-pulse" style={{ color: "rgba(255,255,255,.5)", fontSize: 15, textAlign: "center", maxWidth: 360, lineHeight: 1.75 }}>
        GPT-4o is analyzing your {totalQ} responses across 9 aptitude areas. This takes 10–20 seconds.
      </p>
      <div style={{ display: "flex", gap: 8, marginTop: 32, flexWrap: "wrap", justifyContent: "center" }}>
        {["Mapping aptitudes", "Matching careers", "Writing your profile"].map((s, i) => (
          <div key={i} style={{ background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.08)", padding: "6px 14px", borderRadius: 99, fontSize: 12, color: "rgba(255,255,255,.5)" }}>{s}</div>
        ))}
      </div>
    </div>
  );

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ERROR
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  if (screen === "error") return (
    <div ref={topRef} className="ma-root" style={{ minHeight: "100vh", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ background: "white", borderRadius: 20, padding: "48px 36px", maxWidth: 420, width: "100%", textAlign: "center", boxShadow: "0 8px 40px rgba(0,0,0,.07)" }}>
        <div style={{ fontSize: 52, marginBottom: 20 }}>⚠️</div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", margin: "0 0 12px" }}>Something went wrong</h2>
        <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.7, marginBottom: 28 }}>{errorMsg}</p>
        <button onClick={retake} style={{ background: "#0f172a", color: "white", border: "none", borderRadius: 12, padding: "13px 28px", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Try Again</button>
      </div>
    </div>
  );

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // REPORT
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  if (screen === "report" && report) {
    const fieldColor: Record<string, string> = {
      Technology: "#7c3aed", Engineering: "#6d28d9", Healthcare: "#059669",
      Business: "#ea580c", Arts: "#e11d78", Law: "#1e40af",
      Education: "#0284c7", Environment: "#16a34a", Science: "#0d9488",
      Media: "#be185d", Finance: "#ca8a04", Design: "#db2777",
    };
    const getFC = (field: string) => fieldColor[field] || "#334155";

    return (
      <div ref={topRef} className="ma-root" style={{ minHeight: "100vh", background: "#f1f5f9" }}>

        {/* Nav */}
        <div style={{ background: "#0a0f1e", padding: "14px 28px", display: "flex", alignItems: "center", gap: 12 }} className="ma-no-print">
          <img src="/logo.svg" alt="ProCounsel" style={{ width: 28, height: 28, filter: "brightness(0) invert(1)" }} />
          <span style={{ color: "white", fontWeight: 700, fontSize: 16 }}>ProCounsel</span>
          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            <button onClick={retake} style={{ background: "rgba(255,255,255,.1)", border: "1px solid rgba(255,255,255,.15)", color: "rgba(255,255,255,.8)", padding: "7px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Retake</button>
            <button onClick={() => window.print()} style={{ background: "linear-gradient(135deg,#7c3aed,#2563eb)", color: "white", border: "none", padding: "7px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>↓ Download PDF</button>
          </div>
        </div>

        <div style={{ maxWidth: 880, margin: "0 auto", padding: "28px 16px 60px" }}>

          {/* ── Hero section ── */}
          <div className="ma-fade-up" style={{ background: "linear-gradient(135deg, #0a0f1e 0%, #1a1040 50%, #0c2340 100%)", borderRadius: 20, padding: "36px 40px", marginBottom: 20, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -60, right: -60, width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,.2), transparent 70%)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: -40, left: -40, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(56,189,248,.1), transparent 70%)", pointerEvents: "none" }} />

            {/* Candidate info */}
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", gap: 16, marginBottom: 24 }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: "linear-gradient(135deg,#7c3aed,#2563eb)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>🧠</div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: "rgba(255,255,255,.4)", textTransform: "uppercase", marginBottom: 3 }}>ProCounsel · Mettle Assessment Report</div>
                <h1 style={{ color: "white", fontSize: 22, fontWeight: 800, margin: 0, letterSpacing: "-0.3px" }}>{name}</h1>
                <div style={{ color: "rgba(255,255,255,.45)", fontSize: 12, marginTop: 3 }}>{dateStr} · 50 questions · procounsel.co.in</div>
              </div>
            </div>

            {/* Personality type */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.14)", borderRadius: 12, padding: "10px 18px", marginBottom: 16 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#a78bfa" }} />
              <span style={{ color: "white", fontWeight: 800, fontSize: 16, letterSpacing: "-0.2px" }}>{report.personalityType}</span>
            </div>

            <p style={{ color: "rgba(255,255,255,.55)", fontSize: 14, lineHeight: 1.6, margin: "0 0 18px", fontStyle: "italic" }}>"{report.personalityTagline}"</p>
            <p style={{ color: "rgba(255,255,255,.7)", fontSize: 14, lineHeight: 1.8, margin: 0, padding: "16px 20px", background: "rgba(255,255,255,.05)", borderRadius: 10, borderLeft: "3px solid rgba(167,139,250,.6)" }}>
              {report.overallProfile}
            </p>
          </div>

          {/* ── Career matches ── */}
          <SLabel>Top Career Matches</SLabel>
          <div className="ma-career-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 20 }}>
            {report.topCareers.map((c, i) => {
              const fc = getFC(c.field);
              return (
                <div key={i} className="ma-card-hover ma-fade-up" style={{ background: "white", borderRadius: 16, overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,.06)", border: `1px solid ${fc}18`, animationDelay: `${i * .08}s` }}>
                  {/* Card top */}
                  <div style={{ background: fc, padding: "20px 20px 16px", position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,.08)", pointerEvents: "none" }} />
                    {i === 0 && (
                      <div style={{ display: "inline-block", background: "rgba(255,255,255,.2)", border: "1px solid rgba(255,255,255,.3)", borderRadius: 99, padding: "2px 10px", fontSize: 10, fontWeight: 700, color: "white", letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>Best Match</div>
                    )}
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                      <div>
                        <h3 style={{ color: "white", fontWeight: 800, fontSize: 15, margin: "0 0 4px", lineHeight: 1.3 }}>{c.title}</h3>
                        <div style={{ fontSize: 11, color: "rgba(255,255,255,.7)", fontWeight: 600 }}>{c.field}</div>
                      </div>
                      <ScoreRing score={c.fitScore} color="white" size={64} />
                    </div>
                  </div>
                  {/* Card body */}
                  <div style={{ padding: "16px 18px" }}>
                    <p style={{ fontSize: 12, color: "#475569", lineHeight: 1.65, margin: "0 0 12px" }}>{c.description}</p>
                    <div style={{ background: `${fc}08`, border: `1px solid ${fc}1a`, borderRadius: 8, padding: "10px 12px", marginBottom: 12 }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: fc, textTransform: "uppercase", letterSpacing: .8, marginBottom: 4 }}>Why You Fit</div>
                      <p style={{ fontSize: 11.5, color: "#374151", lineHeight: 1.6, margin: 0 }}>{c.whyYouFit}</p>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 12 }}>
                      {c.keySkills.map((sk, j) => (
                        <span key={j} style={{ background: `${fc}10`, color: fc, padding: "3px 10px", borderRadius: 99, fontSize: 11, fontWeight: 600 }}>{sk}</span>
                      ))}
                    </div>
                    <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: 12 }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: .8, marginBottom: 8 }}>Path to Get There</div>
                      {c.steps.map((step, j) => (
                        <div key={j} style={{ display: "flex", gap: 8, marginBottom: 6, alignItems: "flex-start" }}>
                          <div style={{ width: 18, height: 18, borderRadius: "50%", background: fc, color: "white", fontSize: 10, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>{j + 1}</div>
                          <span style={{ fontSize: 11.5, color: "#374151", lineHeight: 1.55 }}>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Strengths ── */}
          <SLabel>Your Key Strengths</SLabel>
          <div className="ma-fade-up" style={{ background: "white", borderRadius: 16, padding: "28px 32px", marginBottom: 20, boxShadow: "0 4px 24px rgba(0,0,0,.05)" }}>
            {report.strengths.map((s, i) => {
              const barColor = CATEGORIES[i % CATEGORIES.length].color;
              return (
                <div key={i} style={{ marginBottom: i < report.strengths.length - 1 ? 22 : 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>{s.name}</span>
                    <span style={{ fontWeight: 800, fontSize: 14, color: barColor }}>{s.score}%</span>
                  </div>
                  <div style={{ height: 8, background: "#f1f5f9", borderRadius: 99, overflow: "hidden", marginBottom: 5 }}>
                    <div className="ma-bar-fill" style={{ height: "100%", width: `${s.score}%`, background: `linear-gradient(90deg, ${barColor}, ${barColor}cc)`, borderRadius: 99, animationDelay: `${i * .1}s` }} />
                  </div>
                  <p style={{ fontSize: 12, color: "#64748b", lineHeight: 1.55, margin: 0 }}>{s.description}</p>
                </div>
              );
            })}
          </div>

          {/* ── Dev areas + next steps ── */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 14, marginBottom: 20 }}>
            <div>
              <SLabel>Areas to Develop</SLabel>
              <div className="ma-fade-up" style={{ background: "white", borderRadius: 16, padding: "22px 26px", boxShadow: "0 4px 24px rgba(0,0,0,.05)" }}>
                {report.developmentAreas.map((d, i) => (
                  <div key={i} style={{ marginBottom: i < report.developmentAreas.length - 1 ? 18 : 0, paddingBottom: i < report.developmentAreas.length - 1 ? 18 : 0, borderBottom: i < report.developmentAreas.length - 1 ? "1px solid #f1f5f9" : "none" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#f59e0b", flexShrink: 0 }} />
                      <span style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>{d.name}</span>
                    </div>
                    <p style={{ fontSize: 12.5, color: "#64748b", lineHeight: 1.65, margin: "0 0 0 16px" }}>{d.tip}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <SLabel>Your Next Steps</SLabel>
              <div className="ma-fade-up" style={{ background: "white", borderRadius: 16, padding: "22px 26px", boxShadow: "0 4px 24px rgba(0,0,0,.05)" }}>
                {report.nextSteps.map((step, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, marginBottom: i < report.nextSteps.length - 1 ? 16 : 0, alignItems: "flex-start" }}>
                    <div style={{ width: 26, height: 26, borderRadius: 8, background: "linear-gradient(135deg,#7c3aed,#2563eb)", color: "white", fontSize: 12, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i + 1}</div>
                    <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.65, margin: 0 }}>{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Footer ── */}
          <div className="ma-no-print" style={{ background: "white", borderRadius: 16, padding: "18px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, boxShadow: "0 4px 24px rgba(0,0,0,.05)" }}>
            <span style={{ fontSize: 13, color: "#94a3b8" }}><strong style={{ color: "#0f172a" }}>ProCounsel</strong> · Powered by GPT-4o · procounsel.co.in</span>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={retake} style={{ background: "white", border: "1.5px solid #e2e8f0", color: "#475569", padding: "9px 18px", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Retake</button>
              <button onClick={() => window.print()} style={{ background: "linear-gradient(135deg,#7c3aed,#2563eb)", color: "white", border: "none", padding: "9px 18px", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>↓ Download PDF</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

function SLabel({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 10 }}>{children}</div>;
}
