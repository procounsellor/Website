import { useState, useEffect } from "react";

const CSS = `
  .mettle-body { background:#f5f7fb; min-height:100vh; font-family:Arial,sans-serif; overflow-x:hidden; position:relative; }
  .mettle-body::before {
    content:""; position:fixed; inset:0;
    background:url('/logo.png') center center no-repeat;
    background-size:350px; opacity:0.04; z-index:-1; pointer-events:none;
  }
  .m-nav { width:100%; background:#0d1b4c; color:white; padding:15px 30px; display:flex; align-items:center; gap:15px; box-shadow:0 2px 10px rgba(0,0,0,.1); }
  .m-nav img { width:35px; height:35px; object-fit:contain; }
  .m-nav h1  { font-size:24px; font-weight:bold; color:white; margin:0; }
  .m-dev-bar { background:#fef3c7; border-bottom:2px solid #f59e0b; padding:8px 30px; display:flex; align-items:center; gap:12px; font-size:13px; color:#92400e; }
  .m-dev-badge { font-weight:bold; background:#f59e0b; color:white; padding:2px 8px; border-radius:4px; font-size:11px; letter-spacing:.5px; }
  .m-dev-bar a { color:#b45309; font-weight:bold; text-decoration:underline; cursor:pointer; }
  .m-con { max-width:860px; margin:40px auto; background:white; padding:35px; border-radius:14px; box-shadow:0 8px 30px rgba(0,0,0,.08); }

  /* start */
  .m-start { text-align:center; padding:40px 20px; }
  .m-start h2 { font-size:28px; color:#0d1b4c; margin-bottom:12px; }
  .m-start p  { font-size:16px; color:#555; max-width:560px; margin:0 auto 30px; line-height:1.7; }
  .m-nin { width:100%; max-width:420px; padding:14px 18px; font-size:16px; border:2px solid #dfe3ea; border-radius:10px; outline:none; display:block; margin:0 auto 20px; font-family:Arial,sans-serif; transition:border-color .2s; }
  .m-nin:focus { border-color:#0d1b4c; }
  .m-nin.err   { border-color:#ef4444; }
  .m-sbtn { background:#0d1b4c; color:white; padding:14px 40px; border:none; border-radius:10px; font-size:17px; font-weight:bold; cursor:pointer; font-family:Arial,sans-serif; }
  .m-sbtn:hover { opacity:.88; }

  /* questions */
  .m-qc { display:inline-block; background:#0d1b4c; color:white; padding:10px 18px; border-radius:8px; font-size:18px; font-weight:bold; margin-bottom:25px; }
  .m-q  { font-size:24px; line-height:1.5; color:#1c1c1c; margin-bottom:35px; font-weight:600; }
  .m-opts { display:flex; flex-direction:column; gap:15px; }
  .m-opt { padding:16px 18px; border:2px solid #dfe3ea; border-radius:10px; cursor:pointer; transition:.2s; font-size:16px; background:#fff; font-family:Arial,sans-serif; }
  .m-opt:hover    { border-color:#0d1b4c; background:#f4f7ff; }
  .m-opt.sel { border-color:#0d1b4c; background:#eaf0ff; font-weight:bold; }
  .m-btns { margin-top:35px; display:flex; justify-content:space-between; gap:15px; }
  .m-btn  { padding:14px 24px; border:none; border-radius:8px; font-size:16px; cursor:pointer; font-weight:bold; font-family:Arial,sans-serif; }
  .m-btn:disabled { opacity:.45; cursor:not-allowed; }
  .m-prev   { background:#d9dce4; color:#222; }
  .m-next   { background:#0d1b4c; color:white; }
  .m-submit { background:#1d8b38; color:white; }

  /* report */
  .m-rw { padding:10px 0 20px; }
  .m-rc { border:1.5px solid #e2e8f0; border-radius:16px; overflow:hidden; background:white; box-shadow:0 4px 24px rgba(13,27,76,.08); }
  .m-rtop { background:linear-gradient(135deg,#0d1b4c,#1a3580); padding:26px 34px; display:flex; align-items:center; gap:18px; }
  .m-rtop img { width:48px; height:48px; background:white; border-radius:10px; padding:6px; object-fit:contain; }
  .m-rtop h2  { color:white; font-size:20px; font-weight:700; margin:0; }
  .m-rtop p   { color:rgba(255,255,255,.65); font-size:13px; margin-top:2px; }
  .m-rbody { padding:26px 34px; }

  .m-meta { display:flex; gap:24px; flex-wrap:wrap; margin-bottom:20px; }
  .m-mi   { font-size:12px; color:#64748b; }
  .m-mi strong { color:#1e293b; display:block; font-size:14px; margin-top:2px; }
  .m-rdiv { height:1px; background:#e2e8f0; margin:0 0 22px; }

  /* slim career strip */
  .m-cstrip { display:flex; align-items:center; justify-content:space-between; gap:12px; flex-wrap:wrap; background:#f0f4ff; border:1px solid #c7d2fe; border-radius:12px; padding:14px 20px; margin-bottom:26px; }
  .m-csl .m-csl-lbl { font-size:11px; font-weight:700; letter-spacing:1.2px; color:#4f46e5; text-transform:uppercase; }
  .m-csl .m-csl-val { font-size:17px; font-weight:800; color:#0d1b4c; margin-top:3px; }
  .m-csl .m-csl-sub { font-size:12px; color:#64748b; margin-top:2px; }
  .m-cbadge { background:#0d1b4c; color:white; padding:6px 16px; border-radius:20px; font-size:13px; font-weight:700; white-space:nowrap; }

  /* section */
  .m-sec { margin-bottom:20px; border-radius:12px; overflow:hidden; border:1px solid #e2e8f0; }
  .m-sec:last-child { margin-bottom:0; }
  .m-sechd { padding:14px 18px; display:flex; align-items:center; gap:12px; }
  .m-secico { width:40px; height:40px; border-radius:8px; flex-shrink:0; display:flex; align-items:center; justify-content:center; font-size:20px; }
  .m-seclbl { font-size:14px; font-weight:800; }
  .m-secsub { font-size:12px; margin-top:2px; opacity:.75; }
  .m-trow { display:grid; grid-template-columns:1fr 1fr; gap:0; border-top:1px solid rgba(0,0,0,.06); }
  .m-tc { padding:22px 18px; text-align:center; border-right:1px solid rgba(0,0,0,.06); background:white; }
  .m-tc:last-child { border-right:none; }
  .m-tname { font-size:14px; font-weight:800; margin-top:12px; }
  .m-tdesc { font-size:11.5px; color:#64748b; margin-top:6px; line-height:1.55; }

  .m-rfooter { background:#f8fafc; border-top:1px solid #e2e8f0; padding:18px 28px; display:flex; align-items:center; justify-content:space-between; gap:14px; flex-wrap:wrap; }
  .m-rbrand  { font-size:12px; color:#64748b; }
  .m-rbrand strong { color:#0d1b4c; }
  .m-facts   { display:flex; gap:10px; flex-wrap:wrap; }
  .m-dlbtn { background:#0d1b4c; color:white; padding:11px 22px; border:none; border-radius:8px; font-size:14px; font-weight:bold; cursor:pointer; font-family:Arial,sans-serif; }
  .m-dlbtn:hover { opacity:.88; }
  .m-rkbtn { background:none; border:1.5px solid #cbd5e1; color:#475569; padding:11px 18px; border-radius:8px; font-size:14px; cursor:pointer; font-family:Arial,sans-serif; }
  .m-rkbtn:hover { border-color:#0d1b4c; color:#0d1b4c; }

  @media print {
    .m-nav,.m-dev-bar,.m-dlbtn,.m-rkbtn { display:none !important; }
    .m-con { margin:0; padding:0; box-shadow:none; max-width:100%; border-radius:0; }
    .m-rw  { padding:0; }
    .m-rc  { box-shadow:none; border:none; }
  }
  @media(max-width:768px) {
    .m-con { margin:16px; padding:20px; }
    .m-q   { font-size:20px; }
    .m-rtop,.m-rbody { padding:18px 20px; }
    .m-trow { grid-template-columns:1fr; }
    .m-tc   { border-right:none; border-bottom:1px solid rgba(0,0,0,.06); }
    .m-tc:last-child { border-bottom:none; }
    .m-rfooter { flex-direction:column; padding:16px 20px; }
    .m-facts   { width:100%; }
    .m-dlbtn,.m-rkbtn { width:100%; }
    .m-cstrip  { flex-direction:column; align-items:flex-start; }
  }
`;

const QUESTIONS = [
  "I enjoy thinking through a problem from multiple angles before deciding.",
  "When two people in a group disagree, I try to understand both sides before forming my view.",
  "Solving problems step by step comes naturally to me.",
  "I find it easy to read and take in detailed written material.",
  "People who know me would say I speak confidently in front of others.",
  "Even in simple tasks, I tend to notice small details others might miss.",
  "I enjoy having in-depth conversations about how things work in the world.",
  "When I am under pressure, I can still maintain focus and produce accurate work.",
  "I ask a lot of questions when I want to fully understand something.",
  "I work best in environments that are organized and have clear structure.",
  "Exchanging different points of view in a respectful way is something I enjoy.",
  "When two people are at odds, I can usually see where each of them is coming from.",
  "I believe gathering enough information before making a decision leads to better outcomes.",
  "I enjoy tasks that require careful and precise observation.",
  "I prefer drawing conclusions from facts rather than guessing.",
  "People often tell me I explain things in a clear and easy-to-follow way.",
  "I enjoy reading about how different communities and organizations solve their challenges.",
  "In difficult or tense conversations, I am able to stay patient and keep listening.",
  "I find it satisfying to understand exactly how a process or system works.",
  "I feel confident when I am trusted with important responsibilities.",
  "When a situation is complicated, I enjoy taking the time to work through it carefully.",
  "I can stay focused and concentrated on a task for long stretches of time.",
  "Getting things right matters more to me than getting them done quickly.",
  "Writing out my thoughts and opinions is something I genuinely enjoy.",
  "I am curious about the way organizations and teams are structured and function.",
  "When someone points out a mistake I made, I take it seriously without getting defensive.",
  "If two people are confused or at odds with each other, I naturally step in to help sort it out.",
  "I prefer work that challenges me to think analytically and reason through problems.",
  "I feel comfortable holding and defending a point of view in front of others.",
  "In difficult moments, I tend to stay calm rather than react impulsively.",
  "I enjoy reading text carefully to understand what is actually being said, not just the surface meaning.",
  "When I hear someone describe a situation, I often notice things that do not quite add up.",
  "Discussions about right, wrong, and what is fair genuinely interest me.",
  "I manage my time well and rarely miss deadlines.",
  "I find it interesting to learn how processes and workflows are structured behind the scenes.",
  "Before reacting to something, I take a moment to think it through.",
  "When I need to make a choice, I rely more on reasoning than on instinct alone.",
  "I am able to get things done on my own without needing constant direction.",
  "I enjoy the challenge of putting together a compelling and well-supported point.",
  "When I assess a situation, I make a conscious effort to look at it from all sides.",
  "I enjoy going deep into a subject and understanding it thoroughly.",
  "When I receive instructions, I read through all of them before I start.",
  "I handle changes in plans or priorities without getting stressed out.",
  "I try not to act until I have enough information to make a well-considered decision.",
  "When there is a conflict, I would rather talk it through than avoid it.",
  "I feel comfortable expressing myself clearly when speaking to someone senior or in authority.",
  "I like to keep up with what is happening in the world and stay generally informed.",
  "In discussions, I try to stay neutral and not let personal preferences color my views.",
  "I am good at going through a large amount of information and picking out what matters.",
  "Situations that require thinking ahead and planning out a strategy suit me well.",
  "Even when I strongly disagree with someone, I stay respectful and measured in my response.",
  "I can take a set of ideas and present them in a clear and logical order.",
  "Dense or complex written material does not put me off — I work through it carefully.",
  "I think treating everyone fairly is an important part of making good decisions.",
  "I find that hearing different perspectives in a group discussion improves my own thinking.",
  "When a problem is complicated and the stakes are high, I am still able to think clearly.",
  "I prefer to double-check information before acting on it.",
  "I plan out my approach before diving into a task.",
  "I am thoughtful about how I speak to others, especially in sensitive situations.",
  "I enjoy understanding how large systems — whether in business, society, or elsewhere — are put together.",
  "I try to evaluate situations based on what I observe, not what I assume.",
  "Problems that require genuine thinking and reasoning are the kind I enjoy most.",
  "I aim for clarity every time I speak or write — I want people to actually understand me.",
  "I am good at bringing people around to my point of view through reason and evidence.",
  "I find conversations more productive when they follow a structured, focused format.",
  "When a task demands attention to detail over a long period, I stay engaged throughout.",
  "I can handle several different responsibilities at the same time without dropping the ball.",
  "I enjoy understanding how different types of organizations and teams are built.",
  "When I analyze a problem, I look for concrete information rather than going on impressions.",
  "I can sit and listen for a long time without interrupting, even in frustrating conversations.",
  "I tend to express myself more clearly through writing than most people I know.",
  "My first instinct when I see a problem is to look for a practical, real-world solution.",
  "What is right and what is fair are questions I think about often.",
  "I pay attention to whether information I come across is trustworthy and well-supported.",
  "I enjoy conversations where ideas are challenged and tested with reasoning.",
  "Even in high-stakes situations, I find a way to stay calm and think clearly.",
  "I tend to catch important details in documents or conversations before others do.",
  "I prefer working things out through conversation rather than letting conflicts sit unresolved.",
  "When I take on a task, I see it through to the end without needing someone to check on me.",
  "I actively enjoy hearing views that are different from my own.",
  "I am good at taking something complicated and making it easy for others to understand.",
  "Finding a middle ground that works for everyone is a skill I feel I have.",
  "I take time to weigh the available evidence before forming a conclusion.",
  "I can follow a detailed, multi-step process without losing track.",
  "Going through long documents and pulling out the key points is something I do well.",
  "When feelings run high in a situation, I try not to let them cloud my thinking.",
  "I carry myself professionally even when things get difficult or frustrating.",
  "I enjoy meaningful conversations and tend to contribute actively in group discussions.",
  "My first instinct in a difficult situation is to think it through, not react immediately.",
  "Understanding how complex systems are structured and how they operate genuinely interests me.",
  "High-pressure situations bring out a focused, determined side of me.",
  "I am comfortable taking a pile of information and organizing it into something coherent.",
  "Conversations that push me to think hard and reason carefully are the ones I enjoy most.",
  "I can hold a position confidently when questioned, while still listening to the other side.",
  "Working through a problem step by step, using logic and evidence, is satisfying to me.",
  "Once I decide to pursue something, I stay committed and do not easily lose focus.",
  "Understanding what people and organizations owe to each other is something I find meaningful.",
  "When accuracy matters and the workload is heavy, I step up rather than cut corners.",
  "I believe that using solid evidence as the basis for decisions leads to better results.",
];

const OPTS = ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"];

const SECTIONS = [
  {
    color: "#7c3aed", bg: "rgba(124,58,237,0.08)", emoji: "🧠",
    label: "Reasoning",
    sub: "How you approach problems and process information",
    traits: [
      { name: "Analytical",        score: 9,  desc: "Breaks down complex problems step by step, building a sound logical case before concluding." },
      { name: "Critical Thinking", score: 8,  desc: "Questions assumptions, spots inconsistencies, and rigorously stress-tests arguments." },
    ],
  },
  {
    color: "#ea580c", bg: "rgba(234,88,12,0.07)", emoji: "🗣️",
    label: "Communication",
    sub: "How you express and advocate your ideas",
    traits: [
      { name: "Articulate", score: 9, desc: "Conveys ideas with clarity and precision — written and spoken — making complex points easy to follow." },
      { name: "Assertive",  score: 8, desc: "Holds and defends positions with calm confidence, even under pressure or challenge." },
    ],
  },
  {
    color: "#0d9488", bg: "rgba(13,148,136,0.07)", emoji: "⚖️",
    label: "Professional Conduct",
    sub: "How you operate under responsibility and structure",
    traits: [
      { name: "Ethical",    score: 10, desc: "Applies a consistent framework of fairness and moral reasoning to every decision and interaction." },
      { name: "Systematic", score: 9,  desc: "Follows structured processes precisely, maintaining quality even when workload is high." },
    ],
  },
];

const DEV =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    new URLSearchParams(window.location.search).get("dev") === "true");

/* Percentage donut — the main visual of the report */
function PctCircle({ score, color }: { score: number; color: string }) {
  const pct  = score * 10;
  const r    = 36;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg width="96" height="96" viewBox="0 0 96 96">
      <circle cx="48" cy="48" r={r} fill="none" stroke={color} strokeWidth="9" strokeOpacity="0.15" />
      <circle
        cx="48" cy="48" r={r}
        fill="none" stroke={color} strokeWidth="9"
        strokeDasharray={`${dash.toFixed(2)} ${circ.toFixed(2)}`}
        strokeLinecap="round"
        transform="rotate(-90 48 48)"
      />
      <text x="48" y="44" textAnchor="middle" fontSize="20" fontWeight="900" fill={color}>{pct}%</text>
      <text x="48" y="60" textAnchor="middle" fontSize="11" fill="#94a3b8">{score} / 10</text>
    </svg>
  );
}

type Screen = "start" | "questions" | "report";

export default function MettleAssessment() {
  const [screen, setScreen]     = useState<Screen>("start");
  const [name, setName]         = useState("");
  const [nameErr, setNameErr]   = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers]   = useState<Record<number, number>>({});

  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = CSS;
    document.head.appendChild(el);
    return () => { document.head.removeChild(el); };
  }, []);

  const dateStr    = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  const displayName = name.trim() || "Assessment Candidate";

  function startTest() {
    if (!name.trim()) { setNameErr(true); return; }
    setNameErr(false); setCurrentQ(0); setAnswers({}); setScreen("questions");
  }
  function pick(i: number) { setAnswers(a => ({ ...a, [currentQ]: i })); }
  function nextQ() { if (answers[currentQ] == null) { alert("Please select an option."); return; } setCurrentQ(q => q + 1); }
  function prevQ() { setCurrentQ(q => q - 1); }
  function submit() { if (answers[currentQ] == null) { alert("Please select an option."); return; } setScreen("report"); }
  function skipToResult() { if (!name.trim()) setName("Test User"); setScreen("report"); }
  function retake() { setName(""); setAnswers({}); setCurrentQ(0); setScreen("start"); }

  return (
    <div className="mettle-body">
      <div className="m-nav">
        <img src="/logo.svg" alt="ProCounsel" />
        <h1>ProCounsel</h1>
      </div>

      {DEV && (
        <div className="m-dev-bar">
          <span className="m-dev-badge">DEV</span>
          Development mode — <a onClick={skipToResult}>Skip all questions → Result</a>
        </div>
      )}

      <div className="m-con">

        {/* ── Start ── */}
        {screen === "start" && (
          <div className="m-start">
            <h2>ProCounsel Mettle Assessment</h2>
            <p>
              Answer {QUESTIONS.length} short statements honestly — there are no right or wrong answers.
              Your responses identify the career path that best fits your natural strengths.
            </p>
            <input
              className={`m-nin${nameErr ? " err" : ""}`}
              type="text"
              placeholder={nameErr ? "Please enter your name to continue" : "Enter your full name to begin"}
              value={name}
              autoFocus
              onChange={e => { setName(e.target.value); setNameErr(false); }}
              onKeyDown={e => { if (e.key === "Enter") startTest(); }}
            />
            <button className="m-sbtn" onClick={startTest}>Begin Assessment</button>
          </div>
        )}

        {/* ── Questions ── */}
        {screen === "questions" && (
          <div>
            <div className="m-qc">Question {currentQ + 1} of {QUESTIONS.length}</div>
            <div className="m-q">{QUESTIONS[currentQ]}</div>
            <div className="m-opts">
              {OPTS.map((opt, i) => (
                <div key={i} className={`m-opt${answers[currentQ] === i ? " sel" : ""}`} onClick={() => pick(i)}>
                  {opt}
                </div>
              ))}
            </div>
            <div className="m-btns">
              <button className="m-btn m-prev" onClick={prevQ} disabled={currentQ === 0}>Previous</button>
              {currentQ === QUESTIONS.length - 1
                ? <button className="m-btn m-submit" onClick={submit}>Submit Test</button>
                : <button className="m-btn m-next" onClick={nextQ}>Next</button>
              }
            </div>
          </div>
        )}

        {/* ── Report ── */}
        {screen === "report" && (
          <div className="m-rw">
            <div className="m-rc">

              <div className="m-rtop">
                <img src="/logo.svg" alt="ProCounsel" />
                <div>
                  <h2>ProCounsel Mettle Assessment</h2>
                  <p>Official Career Aptitude Report · Confidential</p>
                </div>
              </div>

              <div className="m-rbody">
                <div className="m-meta">
                  <div className="m-mi">Candidate<strong>{displayName}</strong></div>
                  <div className="m-mi">Date<strong>{dateStr}</strong></div>
                  <div className="m-mi">Statements completed<strong>{QUESTIONS.length}</strong></div>
                  <div className="m-mi">Issued by<strong>procounsel.co.in</strong></div>
                </div>

                <div className="m-rdiv" />

                {/* Sections */}
                {SECTIONS.map((sec, si) => (
                  <div key={si} className="m-sec">
                    <div className="m-sechd" style={{ background: sec.bg }}>
                      <div className="m-secico" style={{ background: `${sec.color}22`, color: sec.color }}>
                        {sec.emoji}
                      </div>
                      <div>
                        <div className="m-seclbl" style={{ color: sec.color }}>{sec.label}</div>
                        <div className="m-secsub" style={{ color: sec.color }}>{sec.sub}</div>
                      </div>
                    </div>
                    <div className="m-trow">
                      {sec.traits.map((t, ti) => (
                        <div key={ti} className="m-tc">
                          <PctCircle score={t.score} color={sec.color} />
                          <div className="m-tname" style={{ color: sec.color }}>{t.name}</div>
                          <div className="m-tdesc">{t.desc}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="m-rfooter">
                <div className="m-rbrand">
                  <strong>ProCounsel</strong> &nbsp;·&nbsp; procounsel.co.in
                  &nbsp;·&nbsp; Generated by a psychometric tool for career guidance.
                </div>
                <div className="m-facts">
                  <button className="m-rkbtn" onClick={retake}>Retake Test</button>
                  <button className="m-dlbtn" onClick={() => window.print()}>↓ Download PDF</button>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
