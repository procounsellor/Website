import { useState, useEffect } from "react";
import axios from "axios";

const COLLEGE_API = import.meta.env.VITE_COLLEGE_SEARCH_API_URL || "http://localhost:3000";

// ── Question bank ─────────────────────────────────────────────────────────────
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

const OPTIONS = [
  { label: "Strongly Agree", score: 5, color: "#1d8b38" },
  { label: "Agree", score: 4, color: "#0d9488" },
  { label: "Neutral", score: 3, color: "#64748b" },
  { label: "Disagree", score: 2, color: "#ea580c" },
  { label: "Strongly Disagree", score: 1, color: "#dc2626" },
];

const CATEGORY_COLORS: Record<string, string> = {
  Analytical: "#7c3aed",
  Creative: "#db2777",
  Social: "#0891b2",
  Leadership: "#ea580c",
  Technical: "#059669",
  Nature: "#16a34a",
  Organized: "#0d1b4c",
  Communication: "#b45309",
  "Social Impact": "#7c3aed",
};

// ── Types ─────────────────────────────────────────────────────────────────────
interface CareerPath {
  title: string;
  field: string;
  fitScore: number;
  description: string;
  whyYouFit: string;
  keySkills: string[];
  steps: string[];
}
interface Strength {
  name: string;
  score: number;
  description: string;
}
interface DevArea {
  name: string;
  tip: string;
}
interface AssessmentReport {
  personalityType: string;
  personalityTagline: string;
  overallProfile: string;
  topCareers: CareerPath[];
  strengths: Strength[];
  developmentAreas: DevArea[];
  nextSteps: string[];
}

// ── Inline print + special styles ─────────────────────────────────────────────
const PRINT_CSS = `
  @media print {
    .no-print { display: none !important; }
    body { background: white !important; }
    .print-page { box-shadow: none !important; border-radius: 0 !important; margin: 0 !important; max-width: 100% !important; }
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
  .fade-up { animation: fadeUp 0.5s ease both; }
  .spinner { animation: spin 1s linear infinite; }
  .pulse-text { animation: pulse 2s ease infinite; }
`;

const DEV =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    new URLSearchParams(window.location.search).get("dev") === "true");

// ── Score ring (SVG donut) ────────────────────────────────────────────────────
function ScoreRing({ score, color, size = 80 }: { score: number; color: string; size?: number }) {
  const r = size * 0.38;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const cx = size / 2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={cx} cy={cx} r={r} fill="none" stroke={color} strokeWidth={size * 0.09} strokeOpacity="0.15" />
      <circle
        cx={cx} cy={cx} r={r}
        fill="none" stroke={color} strokeWidth={size * 0.09}
        strokeDasharray={`${dash.toFixed(2)} ${circ.toFixed(2)}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cx})`}
      />
      <text x={cx} y={cx - 3} textAnchor="middle" fontSize={size * 0.22} fontWeight="900" fill={color}>{score}%</text>
      <text x={cx} y={cx + size * 0.16} textAnchor="middle" fontSize={size * 0.11} fill="#94a3b8">fit</text>
    </svg>
  );
}

// ── Strength bar ──────────────────────────────────────────────────────────────
function StrengthBar({ name, score, description, color }: { name: string; score: number; description: string; color: string }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <span style={{ fontWeight: 700, fontSize: 14, color: "#1e293b" }}>{name}</span>
        <span style={{ fontWeight: 800, fontSize: 14, color }}>{score}%</span>
      </div>
      <div style={{ height: 8, background: "#f1f5f9", borderRadius: 99, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${score}%`, background: color, borderRadius: 99, transition: "width 1s ease" }} />
      </div>
      <p style={{ fontSize: 12, color: "#64748b", marginTop: 5, lineHeight: 1.5 }}>{description}</p>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
type Screen = "start" | "questions" | "loading" | "report" | "error";

export default function MettleAssessment() {
  const [screen, setScreen] = useState<Screen>("start");
  const [name, setName] = useState("");
  const [nameErr, setNameErr] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [report, setReport] = useState<AssessmentReport | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = PRINT_CSS;
    document.head.appendChild(el);
    return () => { document.head.removeChild(el); };
  }, []);

  const dateStr = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  const progress = Math.round(((currentQ + (answers[currentQ] != null ? 1 : 0)) / QUESTIONS.length) * 100);

  function startTest() {
    if (!name.trim()) { setNameErr(true); return; }
    setNameErr(false); setCurrentQ(0); setAnswers({}); setScreen("questions");
  }

  function pick(optionIndex: number) {
    setAnswers(a => ({ ...a, [currentQ]: optionIndex }));
  }

  function nextQ() {
    if (answers[currentQ] == null) return;
    setCurrentQ(q => q + 1);
  }

  function prevQ() { setCurrentQ(q => q - 1); }

  async function submit() {
    if (answers[currentQ] == null) return;
    setScreen("loading");

    const payload = QUESTIONS.map((q, i) => ({
      question: q.text,
      category: q.category,
      answer: OPTIONS[answers[i] ?? 2].label,
      score: OPTIONS[answers[i] ?? 2].score,
    }));

    try {
      const { data } = await axios.post<AssessmentReport>(`${COLLEGE_API}/assess`, {
        name: name.trim(),
        answers: payload,
      });
      setReport(data);
      setScreen("report");
    } catch (err: unknown) {
      const msg =
        axios.isAxiosError(err) && err.response?.data?.error
          ? err.response.data.error
          : "Could not connect to the assessment server. Make sure the college-search-api is running.";
      setErrorMsg(msg);
      setScreen("error");
    }
  }

  function retake() {
    setName(""); setAnswers({}); setCurrentQ(0); setReport(null); setErrorMsg(""); setScreen("start");
  }

  function skipToResult() {
    if (!name.trim()) setName("Test User");
    setAnswers(Object.fromEntries(QUESTIONS.map((_, i) => [i, 0])));
    setScreen("loading");
    axios.post<AssessmentReport>(`${COLLEGE_API}/assess`, {
      name: name.trim() || "Test User",
      answers: QUESTIONS.map(q => ({ question: q.text, category: q.category, answer: "Strongly Agree", score: 5 })),
    }).then(({ data }) => { setReport(data); setScreen("report"); })
      .catch(() => { setErrorMsg("API error in dev skip."); setScreen("error"); });
  }

  // ── NAV ───────────────────────────────────────────────────────────────────
  const Nav = () => (
    <div style={{ width: "100%", background: "#0d1b4c", padding: "14px 28px", display: "flex", alignItems: "center", gap: 14, boxShadow: "0 2px 12px rgba(0,0,0,.15)" }} className="no-print">
      <img src="/logo.svg" alt="ProCounsel" style={{ width: 34, height: 34, objectFit: "contain" }} />
      <span style={{ color: "white", fontWeight: 800, fontSize: 20, letterSpacing: "-0.3px" }}>ProCounsel</span>
      <span style={{ marginLeft: "auto", color: "rgba(255,255,255,.5)", fontSize: 13 }}>Mettle Assessment</span>
    </div>
  );

  // ── START ──────────────────────────────────────────────────────────────────
  if (screen === "start") return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0d1b4c 0%, #1a3580 50%, #0d1b4c 100%)", fontFamily: "'Poppins', Arial, sans-serif", display: "flex", flexDirection: "column" }}>
      <Nav />
      {DEV && (
        <div style={{ background: "#fef3c7", borderBottom: "2px solid #f59e0b", padding: "8px 28px", fontSize: 13, color: "#92400e", display: "flex", gap: 12, alignItems: "center" }} className="no-print">
          <span style={{ background: "#f59e0b", color: "white", padding: "2px 8px", borderRadius: 4, fontWeight: 700, fontSize: 11 }}>DEV</span>
          <button onClick={skipToResult} style={{ background: "none", border: "none", cursor: "pointer", color: "#b45309", fontWeight: 700, textDecoration: "underline" }}>Skip all → AI Report</button>
        </div>
      )}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
        <div className="fade-up" style={{ background: "white", borderRadius: 20, padding: "48px 44px", maxWidth: 520, width: "100%", boxShadow: "0 24px 64px rgba(0,0,0,.25)", textAlign: "center" }}>
          <div style={{ width: 72, height: 72, background: "linear-gradient(135deg, #0d1b4c, #4f46e5)", borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", boxShadow: "0 8px 24px rgba(13,27,76,.3)" }}>
            <img src="/logo.svg" alt="" style={{ width: 44, height: 44, filter: "brightness(0) invert(1)" }} />
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#0d1b4c", margin: "0 0 8px", letterSpacing: "-0.5px" }}>Mettle Assessment</h1>
          <p style={{ fontSize: 14, color: "#7c3aed", fontWeight: 600, margin: "0 0 16px", textTransform: "uppercase", letterSpacing: 1 }}>by ProCounsel</p>
          <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.75, margin: "0 0 32px" }}>
            Answer 50 honest statements about yourself. There are no right or wrong answers —
            your unique responses will power an AI analysis to reveal your ideal career paths.
          </p>
          <div style={{ display: "flex", gap: 20, justifyContent: "center", marginBottom: 32 }}>
            {[["50", "Questions"], ["~10", "Minutes"], ["AI", "Powered"]].map(([val, lbl]) => (
              <div key={lbl} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: "#0d1b4c" }}>{val}</div>
                <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>{lbl}</div>
              </div>
            ))}
          </div>
          <input
            type="text"
            placeholder={nameErr ? "Please enter your name to continue" : "Enter your full name to begin"}
            value={name}
            autoFocus
            onChange={e => { setName(e.target.value); setNameErr(false); }}
            onKeyDown={e => { if (e.key === "Enter") startTest(); }}
            style={{
              width: "100%", boxSizing: "border-box", padding: "14px 18px", fontSize: 15,
              border: `2px solid ${nameErr ? "#ef4444" : "#e2e8f0"}`, borderRadius: 12, outline: "none",
              fontFamily: "inherit", color: "#1e293b", marginBottom: 14, transition: "border-color .2s",
            }}
          />
          <button
            onClick={startTest}
            style={{ width: "100%", background: "linear-gradient(135deg, #0d1b4c, #1a3580)", color: "white", border: "none", borderRadius: 12, padding: "15px 0", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 6px 20px rgba(13,27,76,.3)", letterSpacing: 0.3 }}
          >
            Begin Assessment →
          </button>
          <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 16 }}>Free · No login required · Results powered by Claude AI</p>
        </div>
      </div>
    </div>
  );

  // ── QUESTIONS ──────────────────────────────────────────────────────────────
  if (screen === "questions") {
    const q = QUESTIONS[currentQ];
    const catColor = CATEGORY_COLORS[q.category] || "#0d1b4c";
    const isLast = currentQ === QUESTIONS.length - 1;
    const answered = answers[currentQ] != null;
    return (
      <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "'Poppins', Arial, sans-serif", display: "flex", flexDirection: "column" }}>
        <Nav />
        {/* Progress bar */}
        <div style={{ width: "100%", height: 4, background: "#e2e8f0" }} className="no-print">
          <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg, #7c3aed, #0d1b4c)", transition: "width 0.4s ease", borderRadius: 99 }} />
        </div>
        <div style={{ flex: 1, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "32px 20px 60px" }}>
          <div className="fade-up" style={{ background: "white", borderRadius: 20, padding: "36px 40px", maxWidth: 680, width: "100%", boxShadow: "0 8px 32px rgba(0,0,0,.07)" }}>
            {/* Header row */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ background: catColor, color: "white", fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 99, letterSpacing: 0.8, textTransform: "uppercase" }}>{q.category}</span>
              </div>
              <span style={{ fontSize: 13, color: "#94a3b8", fontWeight: 600 }}>{currentQ + 1} / {QUESTIONS.length}</span>
            </div>
            {/* Question */}
            <p style={{ fontSize: 20, fontWeight: 700, color: "#0f172a", lineHeight: 1.6, marginBottom: 32 }}>{q.text}</p>
            {/* Options */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {OPTIONS.map((opt, i) => {
                const selected = answers[currentQ] === i;
                return (
                  <button
                    key={i}
                    onClick={() => pick(i)}
                    style={{
                      padding: "14px 20px", borderRadius: 12, cursor: "pointer", fontFamily: "inherit",
                      fontSize: 15, fontWeight: selected ? 700 : 500, textAlign: "left", transition: "all .15s",
                      border: selected ? `2px solid ${opt.color}` : "2px solid #e2e8f0",
                      background: selected ? `${opt.color}12` : "white",
                      color: selected ? opt.color : "#374151",
                      boxShadow: selected ? `0 2px 12px ${opt.color}22` : "none",
                    }}
                  >
                    <span style={{ display: "inline-block", width: 20, height: 20, borderRadius: "50%", border: `2px solid ${selected ? opt.color : "#cbd5e1"}`, background: selected ? opt.color : "white", marginRight: 12, verticalAlign: "middle", flexShrink: 0, transition: "all .15s" }} />
                    {opt.label}
                  </button>
                );
              })}
            </div>
            {/* Nav buttons */}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 32, gap: 12 }}>
              <button
                onClick={prevQ} disabled={currentQ === 0}
                style={{ padding: "13px 28px", borderRadius: 10, border: "2px solid #e2e8f0", background: "white", color: "#64748b", fontWeight: 600, fontFamily: "inherit", fontSize: 15, cursor: currentQ === 0 ? "not-allowed" : "pointer", opacity: currentQ === 0 ? 0.4 : 1 }}
              >
                ← Previous
              </button>
              {isLast ? (
                <button
                  onClick={submit} disabled={!answered}
                  style={{ padding: "13px 32px", borderRadius: 10, border: "none", background: answered ? "linear-gradient(135deg, #059669, #0d9488)" : "#e2e8f0", color: answered ? "white" : "#94a3b8", fontWeight: 700, fontFamily: "inherit", fontSize: 15, cursor: answered ? "pointer" : "not-allowed", boxShadow: answered ? "0 4px 16px rgba(5,150,105,.3)" : "none" }}
                >
                  Submit & Get Report →
                </button>
              ) : (
                <button
                  onClick={nextQ} disabled={!answered}
                  style={{ padding: "13px 32px", borderRadius: 10, border: "none", background: answered ? "linear-gradient(135deg, #0d1b4c, #1a3580)" : "#e2e8f0", color: answered ? "white" : "#94a3b8", fontWeight: 700, fontFamily: "inherit", fontSize: 15, cursor: answered ? "pointer" : "not-allowed", boxShadow: answered ? "0 4px 16px rgba(13,27,76,.25)" : "none" }}
                >
                  Next →
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── LOADING ────────────────────────────────────────────────────────────────
  if (screen === "loading") return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0d1b4c 0%, #1a3580 100%)", fontFamily: "'Poppins', Arial, sans-serif", display: "flex", flexDirection: "column" }}>
      <Nav />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40 }}>
        <div style={{ width: 72, height: 72, borderRadius: "50%", border: "6px solid rgba(255,255,255,.15)", borderTop: "6px solid white", marginBottom: 32 }} className="spinner" />
        <h2 style={{ color: "white", fontSize: 22, fontWeight: 700, margin: "0 0 12px" }}>Analyzing your responses…</h2>
        <p className="pulse-text" style={{ color: "rgba(255,255,255,.6)", fontSize: 15, textAlign: "center", maxWidth: 380, lineHeight: 1.7 }}>
          Claude AI is reviewing your 50 answers and building your personalized career roadmap. This usually takes 10–20 seconds.
        </p>
        <div style={{ display: "flex", gap: 8, marginTop: 32 }}>
          {["Mapping aptitudes", "Identifying careers", "Building report"].map((step, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,.1)", padding: "6px 14px", borderRadius: 99, fontSize: 12, color: "rgba(255,255,255,.7)", fontWeight: 500 }}>{step}</div>
          ))}
        </div>
      </div>
    </div>
  );

  // ── ERROR ──────────────────────────────────────────────────────────────────
  if (screen === "error") return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "'Poppins', Arial, sans-serif", display: "flex", flexDirection: "column" }}>
      <Nav />
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 40 }}>
        <div style={{ background: "white", borderRadius: 20, padding: "48px 44px", maxWidth: 480, width: "100%", textAlign: "center", boxShadow: "0 8px 32px rgba(0,0,0,.07)" }}>
          <div style={{ fontSize: 48, marginBottom: 20 }}>⚠️</div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", margin: "0 0 12px" }}>Something went wrong</h2>
          <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.7, marginBottom: 28 }}>{errorMsg}</p>
          <button onClick={retake} style={{ background: "#0d1b4c", color: "white", border: "none", borderRadius: 10, padding: "13px 28px", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Try Again</button>
        </div>
      </div>
    </div>
  );

  // ── REPORT ─────────────────────────────────────────────────────────────────
  if (screen === "report" && report) {
    const fieldColors: Record<string, string> = {
      Technology: "#7c3aed", Healthcare: "#059669", Business: "#ea580c",
      Arts: "#db2777", Law: "#1e40af", Education: "#0891b2",
      Environment: "#16a34a", Engineering: "#7c3aed", Science: "#0d9488",
    };
    return (
      <div style={{ minHeight: "100vh", background: "#f1f5f9", fontFamily: "'Poppins', Arial, sans-serif" }}>
        <Nav />
        <div style={{ maxWidth: 860, margin: "32px auto", padding: "0 16px 60px" }}>

          {/* ── Hero card ── */}
          <div className="fade-up print-page" style={{ background: "linear-gradient(135deg, #0d1b4c 0%, #1e3a8a 50%, #0d1b4c 100%)", borderRadius: 20, padding: "36px 40px", marginBottom: 20, color: "white", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,.04)" }} />
            <div style={{ display: "flex", alignItems: "flex-start", gap: 20, flexWrap: "wrap" }}>
              <img src="/logo.svg" alt="ProCounsel" style={{ width: 48, height: 48, background: "rgba(255,255,255,.1)", borderRadius: 12, padding: 8, objectFit: "contain" }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: "rgba(255,255,255,.5)", textTransform: "uppercase", marginBottom: 4 }}>ProCounsel · Mettle Assessment Report</div>
                <h1 style={{ fontSize: 24, fontWeight: 800, margin: "0 0 4px", letterSpacing: "-0.3px" }}>{name}</h1>
                <p style={{ color: "rgba(255,255,255,.6)", fontSize: 13, margin: 0 }}>{dateStr} · {QUESTIONS.length} questions completed · procounsel.co.in</p>
              </div>
            </div>
            <div style={{ marginTop: 28, display: "flex", alignItems: "flex-start", gap: 20, flexWrap: "wrap" }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: "rgba(255,255,255,.45)", textTransform: "uppercase", marginBottom: 6 }}>Personality Type</div>
                <div style={{ display: "inline-block", background: "rgba(255,255,255,.12)", border: "1px solid rgba(255,255,255,.2)", borderRadius: 10, padding: "8px 18px", fontSize: 16, fontWeight: 800, letterSpacing: "-0.2px" }}>{report.personalityType}</div>
              </div>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: "rgba(255,255,255,.45)", textTransform: "uppercase", marginBottom: 6 }}>Tagline</div>
                <p style={{ margin: 0, fontSize: 14, color: "rgba(255,255,255,.8)", lineHeight: 1.6, fontStyle: "italic" }}>"{report.personalityTagline}"</p>
              </div>
            </div>
            <div style={{ marginTop: 20, padding: "16px 20px", background: "rgba(255,255,255,.06)", borderRadius: 12, borderLeft: "3px solid rgba(255,255,255,.25)" }}>
              <p style={{ margin: 0, fontSize: 14, color: "rgba(255,255,255,.75)", lineHeight: 1.75 }}>{report.overallProfile}</p>
            </div>
          </div>

          {/* ── Top career paths ── */}
          <SectionHeading>Top Career Matches</SectionHeading>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16, marginBottom: 20 }}>
            {report.topCareers.map((career, i) => {
              const accentColor = fieldColors[career.field] || "#0d1b4c";
              return (
                <div key={i} className="fade-up" style={{ background: "white", borderRadius: 16, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,.06)", border: `1px solid ${accentColor}22`, animationDelay: `${i * 0.1}s` }}>
                  <div style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`, padding: "20px 22px", display: "flex", alignItems: "flex-start", gap: 16 }}>
                    <div style={{ flex: 1 }}>
                      {i === 0 && <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, color: "rgba(255,255,255,.65)", marginBottom: 4, textTransform: "uppercase" }}>Best Match</div>}
                      <h3 style={{ color: "white", fontWeight: 800, fontSize: 16, margin: "0 0 2px" }}>{career.title}</h3>
                      <div style={{ fontSize: 12, color: "rgba(255,255,255,.7)", fontWeight: 500 }}>{career.field}</div>
                    </div>
                    <ScoreRing score={career.fitScore} color="white" size={72} />
                  </div>
                  <div style={{ padding: "18px 22px" }}>
                    <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.65, margin: "0 0 12px" }}>{career.description}</p>
                    <div style={{ background: `${accentColor}08`, border: `1px solid ${accentColor}20`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: accentColor, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 4 }}>Why You Fit</div>
                      <p style={{ fontSize: 12, color: "#374151", lineHeight: 1.6, margin: 0 }}>{career.whyYouFit}</p>
                    </div>
                    <div style={{ marginBottom: 14 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>Key Skills</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {career.keySkills.map((sk, j) => (
                          <span key={j} style={{ background: `${accentColor}10`, color: accentColor, padding: "3px 10px", borderRadius: 99, fontSize: 11, fontWeight: 600 }}>{sk}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>Path to Get There</div>
                      {career.steps.map((step, j) => (
                        <div key={j} style={{ display: "flex", gap: 10, marginBottom: 6, alignItems: "flex-start" }}>
                          <div style={{ width: 20, height: 20, borderRadius: "50%", background: accentColor, color: "white", fontSize: 11, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>{j + 1}</div>
                          <span style={{ fontSize: 12, color: "#374151", lineHeight: 1.55 }}>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Strengths ── */}
          <SectionHeading>Your Key Strengths</SectionHeading>
          <div className="fade-up" style={{ background: "white", borderRadius: 16, padding: "28px 32px", marginBottom: 20, boxShadow: "0 4px 20px rgba(0,0,0,.06)" }}>
            {report.strengths.map((s, i) => (
              <StrengthBar key={i} name={s.name} score={s.score} description={s.description} color={Object.values(CATEGORY_COLORS)[i % Object.keys(CATEGORY_COLORS).length]} />
            ))}
          </div>

          {/* ── Development + Next steps ── */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16, marginBottom: 20 }}>
            <div>
              <SectionHeading>Development Areas</SectionHeading>
              <div className="fade-up" style={{ background: "white", borderRadius: 16, padding: "24px 28px", boxShadow: "0 4px 20px rgba(0,0,0,.06)" }}>
                {report.developmentAreas.map((d, i) => (
                  <div key={i} style={{ marginBottom: i < report.developmentAreas.length - 1 ? 18 : 0, paddingBottom: i < report.developmentAreas.length - 1 ? 18 : 0, borderBottom: i < report.developmentAreas.length - 1 ? "1px solid #f1f5f9" : "none" }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: "#0f172a", marginBottom: 4 }}>{d.name}</div>
                    <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6, margin: 0 }}>{d.tip}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <SectionHeading>Next Steps</SectionHeading>
              <div className="fade-up" style={{ background: "white", borderRadius: 16, padding: "24px 28px", boxShadow: "0 4px 20px rgba(0,0,0,.06)" }}>
                {report.nextSteps.map((step, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, marginBottom: i < report.nextSteps.length - 1 ? 16 : 0, alignItems: "flex-start" }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: "#0d1b4c", color: "white", fontSize: 13, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i + 1}</div>
                    <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.6, margin: 0 }}>{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Footer / actions ── */}
          <div className="no-print fade-up" style={{ background: "white", borderRadius: 16, padding: "20px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 14, boxShadow: "0 4px 20px rgba(0,0,0,.06)" }}>
            <div style={{ fontSize: 13, color: "#64748b" }}>
              <strong style={{ color: "#0d1b4c" }}>ProCounsel</strong> · Generated by Claude AI · procounsel.co.in
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={retake} style={{ background: "white", border: "2px solid #e2e8f0", color: "#475569", padding: "10px 20px", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Retake Test</button>
              <button onClick={() => window.print()} style={{ background: "linear-gradient(135deg, #0d1b4c, #1a3580)", color: "white", border: "none", padding: "10px 22px", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 4px 14px rgba(13,27,76,.3)" }}>↓ Download PDF</button>
            </div>
          </div>

        </div>
      </div>
    );
  }

  return null;
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 style={{ fontSize: 14, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 12, marginTop: 0 }}>{children}</h2>
  );
}
