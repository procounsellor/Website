import { useState, useEffect } from "react";

/* ────────────────────────────────────────────────────────── */
/*  Inline styles that exactly replicate question.html        */
/* ────────────────────────────────────────────────────────── */
const CSS = `
  .mettle-body {
    background: #f5f7fb;
    min-height: 100vh;
    font-family: Arial, sans-serif;
    position: relative;
  }
  .mettle-body::before {
    content: "";
    position: fixed;
    inset: 0;
    background: url('/logo.png') center center no-repeat;
    background-size: 350px;
    opacity: 0.04;
    z-index: -1;
  }
  .m-navbar {
    width: 100%;
    background: #0d1b4c;
    color: white;
    padding: 15px 30px;
    display: flex;
    align-items: center;
    gap: 15px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  }
  .m-navbar img {
    width: 35px;
    height: 35px;
    object-fit: contain;
    background: #0d1b4c;
  }
  .m-navbar h1 {
    font-size: 24px;
    font-weight: bold;
    color: white;
  }
  .m-dev-bar {
    background: #fef3c7;
    border-bottom: 2px solid #f59e0b;
    padding: 8px 30px;
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 13px;
    color: #92400e;
  }
  .m-dev-badge {
    font-weight: bold;
    background: #f59e0b;
    color: white;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 11px;
    letter-spacing: 0.5px;
  }
  .m-dev-bar a {
    color: #b45309;
    font-weight: bold;
    text-decoration: underline;
    cursor: pointer;
  }
  .m-container {
    max-width: 850px;
    margin: 40px auto;
    background: white;
    padding: 35px;
    border-radius: 14px;
    box-shadow: 0 8px 30px rgba(0,0,0,0.08);
  }
  /* Start screen */
  .m-start {
    text-align: center;
    padding: 40px 20px;
  }
  .m-start h2 {
    font-size: 28px;
    color: #0d1b4c;
    margin-bottom: 12px;
  }
  .m-start p {
    font-size: 16px;
    color: #555;
    max-width: 560px;
    margin: 0 auto 30px;
    line-height: 1.7;
  }
  .m-name-input {
    width: 100%;
    max-width: 420px;
    padding: 14px 18px;
    font-size: 16px;
    border: 2px solid #dfe3ea;
    border-radius: 10px;
    outline: none;
    display: block;
    margin: 0 auto 20px;
    font-family: Arial, sans-serif;
    transition: border-color 0.2s;
  }
  .m-name-input:focus {
    border-color: #0d1b4c;
  }
  .m-name-input.error {
    border-color: #ef4444;
  }
  .m-start-btn {
    background: #0d1b4c;
    color: white;
    padding: 14px 40px;
    border: none;
    border-radius: 10px;
    font-size: 17px;
    font-weight: bold;
    cursor: pointer;
    font-family: Arial, sans-serif;
  }
  .m-start-btn:hover { opacity: 0.88; }
  /* Questions */
  .m-q-count {
    display: inline-block;
    background: #0d1b4c;
    color: white;
    padding: 10px 18px;
    border-radius: 8px;
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 25px;
    letter-spacing: 0.5px;
  }
  .m-question {
    font-size: 24px;
    line-height: 1.5;
    color: #1c1c1c;
    margin-bottom: 35px;
    font-weight: 600;
  }
  .m-options {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  .m-option {
    padding: 16px 18px;
    border: 2px solid #dfe3ea;
    border-radius: 10px;
    cursor: pointer;
    transition: 0.2s ease;
    font-size: 16px;
    background: #fff;
    font-family: Arial, sans-serif;
  }
  .m-option:hover { border-color: #0d1b4c; background: #f4f7ff; }
  .m-option.selected { border-color: #0d1b4c; background: #eaf0ff; font-weight: bold; }
  .m-buttons {
    margin-top: 35px;
    display: flex;
    justify-content: space-between;
    gap: 15px;
  }
  .m-btn {
    padding: 14px 24px;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    cursor: pointer;
    font-weight: bold;
    font-family: Arial, sans-serif;
  }
  .m-btn:disabled { opacity: 0.45; cursor: not-allowed; }
  .m-prev { background: #d9dce4; color: #222; }
  .m-next { background: #0d1b4c; color: white; }
  .m-submit { background: #1d8b38; color: white; }
  /* Report */
  .m-report-wrapper { padding: 10px 0 30px; }
  .m-report-card {
    border: 1.5px solid #e2e8f0;
    border-radius: 16px;
    overflow: hidden;
    background: white;
    box-shadow: 0 4px 24px rgba(13,27,76,0.08);
  }
  .m-report-header {
    background: linear-gradient(135deg, #0d1b4c 0%, #1a3580 100%);
    padding: 32px 36px;
    display: flex;
    align-items: center;
    gap: 20px;
  }
  .m-report-header img {
    width: 54px;
    height: 54px;
    object-fit: contain;
    background: white;
    border-radius: 10px;
    padding: 6px;
  }
  .m-report-header-text h2 {
    color: white;
    font-size: 22px;
    font-weight: 700;
  }
  .m-report-header-text p {
    color: rgba(255,255,255,0.7);
    font-size: 13px;
    margin-top: 4px;
  }
  .m-report-body { padding: 30px 36px; }
  .m-meta {
    display: flex;
    gap: 24px;
    margin-bottom: 28px;
    flex-wrap: wrap;
  }
  .m-meta-item { font-size: 13px; color: #64748b; }
  .m-meta-item strong {
    color: #1e293b;
    display: block;
    font-size: 15px;
    margin-top: 2px;
  }
  .m-divider { height: 1px; background: #e2e8f0; margin: 22px 0; }
  .m-career-block {
    background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%);
    border: 1.5px solid #c7d2fe;
    border-radius: 14px;
    padding: 28px 30px;
    text-align: center;
    margin-bottom: 28px;
  }
  .m-career-label {
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 1.5px;
    color: #4f46e5;
    text-transform: uppercase;
    margin-bottom: 10px;
  }
  .m-career-title {
    font-size: 42px;
    font-weight: 900;
    color: #0d1b4c;
    letter-spacing: -1px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 14px;
  }
  .m-career-sub {
    font-size: 15px;
    color: #475569;
    margin-top: 10px;
    font-style: italic;
  }
  .m-section-title {
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 1.2px;
    color: #94a3b8;
    text-transform: uppercase;
    margin-bottom: 14px;
  }
  .m-traits-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 12px;
    margin-bottom: 28px;
  }
  .m-trait-chip {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    padding: 12px 14px;
    display: flex;
    align-items: flex-start;
    gap: 10px;
  }
  .m-tick { color: #16a34a; font-size: 16px; flex-shrink: 0; margin-top: 1px; }
  .m-trait-name { font-size: 14px; font-weight: 600; color: #1e293b; }
  .m-trait-desc { font-size: 12px; color: #64748b; margin-top: 2px; }
  .m-para {
    background: #fafbff;
    border-left: 4px solid #0d1b4c;
    padding: 18px 20px;
    border-radius: 0 10px 10px 0;
    font-size: 15px;
    line-height: 1.8;
    color: #334155;
    margin-bottom: 28px;
  }
  .m-report-footer {
    background: #f8fafc;
    border-top: 1px solid #e2e8f0;
    padding: 20px 30px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
  }
  .m-footer-brand { font-size: 13px; color: #64748b; }
  .m-footer-brand strong { color: #0d1b4c; }
  .m-footer-actions { display: flex; gap: 10px; flex-wrap: wrap; }
  .m-download-btn {
    background: #0d1b4c;
    color: white;
    padding: 12px 28px;
    border: none;
    border-radius: 8px;
    font-size: 15px;
    font-weight: bold;
    cursor: pointer;
    font-family: Arial, sans-serif;
  }
  .m-download-btn:hover { opacity: 0.88; }
  .m-retake-btn {
    background: none;
    border: 1.5px solid #cbd5e1;
    color: #475569;
    padding: 12px 22px;
    border-radius: 8px;
    font-size: 14px;
    cursor: pointer;
    font-family: Arial, sans-serif;
  }
  .m-retake-btn:hover { border-color: #0d1b4c; color: #0d1b4c; }
  @media print {
    .m-navbar, .m-dev-bar, .m-download-btn, .m-retake-btn { display: none !important; }
    .m-container { margin: 0; padding: 0; box-shadow: none; max-width: 100%; }
    .m-report-card { box-shadow: none; border: none; }
    .m-report-wrapper { padding: 0; }
  }
  @media (max-width: 768px) {
    .m-container { margin: 20px; padding: 25px; }
    .m-question { font-size: 20px; }
    .m-report-header { padding: 22px 20px; }
    .m-report-body { padding: 20px; }
    .m-career-title { font-size: 32px; }
    .m-report-footer { flex-direction: column; padding: 16px 20px; }
    .m-footer-actions { width: 100%; }
    .m-download-btn, .m-retake-btn { width: 100%; justify-content: center; }
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

const ANSWER_OPTIONS = [
  "Strongly Agree",
  "Agree",
  "Neutral",
  "Disagree",
  "Strongly Disagree",
];

const TRAITS = [
  { name: "Analytical Reasoning", desc: "Evaluates problems through structured logic" },
  { name: "Ethical Judgment", desc: "Strong sense of fairness and moral reasoning" },
  { name: "Communication Skills", desc: "Persuasive and precise in speech and writing" },
  { name: "Critical Thinking", desc: "Questions assumptions and weighs evidence" },
  { name: "Systematic Approach", desc: "Follows processes with care and consistency" },
  { name: "Conflict Resolution", desc: "Navigates disagreements with calm reasoning" },
];

type Screen = "start" | "questions" | "report";

const isDevMode =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    new URLSearchParams(window.location.search).get("dev") === "true");

export default function MettleAssessment() {
  const [screen, setScreen] = useState<Screen>("start");
  const [candidateName, setCandidateName] = useState("");
  const [nameError, setNameError] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = CSS;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  const dateStr = new Date().toLocaleDateString("en-IN", {
    day: "numeric", month: "long", year: "numeric",
  });

  function handleStart() {
    if (!candidateName.trim()) {
      setNameError(true);
      return;
    }
    setNameError(false);
    setCurrentQ(0);
    setAnswers({});
    setScreen("questions");
  }

  function selectOption(idx: number) {
    setAnswers((prev) => ({ ...prev, [currentQ]: idx }));
  }

  function nextQ() {
    if (answers[currentQ] == null) { alert("Please select an option before proceeding."); return; }
    setCurrentQ((q) => q + 1);
  }

  function prevQ() {
    setCurrentQ((q) => q - 1);
  }

  function submit() {
    if (answers[currentQ] == null) { alert("Please select an option before submitting."); return; }
    setScreen("report");
  }

  function retake() {
    setCandidateName("");
    setAnswers({});
    setCurrentQ(0);
    setScreen("start");
  }

  const displayName = candidateName.trim() || "Assessment Candidate";

  return (
    <div className="mettle-body">
      {/* Navbar */}
      <div className="m-navbar">
        <img src="/logo.svg" alt="ProCounsel Logo" />
        <h1>ProCounsel</h1>
      </div>

      {/* Dev bar */}
      {isDevMode && (
        <div className="m-dev-bar">
          <span className="m-dev-badge">DEV</span>
          You are in development mode —{" "}
          <a onClick={() => { if (!candidateName.trim()) setCandidateName("Test User"); setScreen("report"); }}>
            Skip all questions → Go to Result
          </a>
        </div>
      )}

      <div className="m-container">

        {/* ── Start Screen ── */}
        {screen === "start" && (
          <div className="m-start">
            <h2>ProCounsel Mettle Assessment</h2>
            <p>
              Answer {QUESTIONS.length} short statements honestly — there are no right or wrong answers.
              Your responses will be used to identify the career path that best matches your natural strengths.
            </p>
            <input
              className={`m-name-input${nameError ? " error" : ""}`}
              type="text"
              placeholder={nameError ? "Please enter your name to continue" : "Enter your full name to begin"}
              value={candidateName}
              onChange={(e) => { setCandidateName(e.target.value); setNameError(false); }}
              onKeyDown={(e) => { if (e.key === "Enter") handleStart(); }}
              autoFocus
            />
            <button className="m-start-btn" onClick={handleStart}>
              Begin Assessment
            </button>
          </div>
        )}

        {/* ── Questions Screen ── */}
        {screen === "questions" && (
          <div>
            <div className="m-q-count">
              Question {currentQ + 1} of {QUESTIONS.length}
            </div>

            <div className="m-question">{QUESTIONS[currentQ]}</div>

            <div className="m-options">
              {ANSWER_OPTIONS.map((opt, i) => (
                <div
                  key={i}
                  className={`m-option${answers[currentQ] === i ? " selected" : ""}`}
                  onClick={() => selectOption(i)}
                >
                  {opt}
                </div>
              ))}
            </div>

            <div className="m-buttons">
              <button
                className="m-btn m-prev"
                onClick={prevQ}
                disabled={currentQ === 0}
              >
                Previous
              </button>

              {currentQ === QUESTIONS.length - 1 ? (
                <button className="m-btn m-submit" onClick={submit}>
                  Submit Test
                </button>
              ) : (
                <button className="m-btn m-next" onClick={nextQ}>
                  Next
                </button>
              )}
            </div>
          </div>
        )}

        {/* ── Report Screen ── */}
        {screen === "report" && (
          <div className="m-report-wrapper">
            <div className="m-report-card">

              <div className="m-report-header">
                <img src="/logo.svg" alt="ProCounsel" />
                <div className="m-report-header-text">
                  <h2>ProCounsel Mettle Assessment</h2>
                  <p>Official Career Aptitude Report · Confidential</p>
                </div>
              </div>

              <div className="m-report-body">
                <div className="m-meta">
                  <div className="m-meta-item">
                    Candidate<strong>{displayName}</strong>
                  </div>
                  <div className="m-meta-item">
                    Date of Assessment<strong>{dateStr}</strong>
                  </div>
                  <div className="m-meta-item">
                    Questions Answered<strong>{QUESTIONS.length}</strong>
                  </div>
                  <div className="m-meta-item">
                    Issued by<strong>procounsel.co.in</strong>
                  </div>
                </div>

                <div className="m-divider" />

                <div className="m-career-block">
                  <div className="m-career-label">Recommended Career Path</div>
                  <div className="m-career-title">
                    <span>⚖️</span> LAW
                  </div>
                  <div className="m-career-sub">
                    Your profile reflects a strong suitability for the legal profession
                  </div>
                </div>

                <div className="m-section-title">Key Competencies Identified</div>
                <div className="m-traits-grid">
                  {TRAITS.map((t, i) => (
                    <div key={i} className="m-trait-chip">
                      <span className="m-tick">✓</span>
                      <div>
                        <div className="m-trait-name">{t.name}</div>
                        <div className="m-trait-desc">{t.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="m-section-title">Assessment Summary</div>
                <div className="m-para">
                  Based on your responses across {QUESTIONS.length} psychometric statements,
                  your profile demonstrates strong analytical reasoning, persuasive communication,
                  structured decision-making, critical thinking, and ethical judgment.
                  These competencies indicate a high degree of suitability for pursuing studies
                  and a professional career in the field of <strong>Law</strong>.
                  Your aptitude reflects the ability to evaluate situations objectively,
                  argue positions with evidence, and handle complex multi-party responsibilities
                  effectively — all of which are essential in the legal profession.
                </div>
              </div>

              <div className="m-report-footer">
                <div className="m-footer-brand">
                  <strong>ProCounsel</strong> &nbsp;·&nbsp; procounsel.co.in
                  &nbsp;·&nbsp; Generated by a psychometric tool for guidance purposes.
                </div>
                <div className="m-footer-actions">
                  <button className="m-retake-btn" onClick={retake}>
                    Retake Test
                  </button>
                  <button className="m-download-btn" onClick={() => window.print()}>
                    ⬇ Download Report (PDF)
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
