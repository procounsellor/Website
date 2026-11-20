/**
 * Everything the home page says about MBA, NEET and JEE lives here, so the
 * season strip, the free-tools section and the daily cards stay in sync and a
 * date change is a one-line edit.
 *
 * Dates: only CAT 2026 (29 Nov 2026) is confirmed in our data (mbaSnapshot).
 * NEET UG 2027 and JEE Main 2027 dates are not announced yet — leave them null
 * and the UI says so instead of guessing.
 */

export type ExamKey = "mba" | "neet" | "jee";

export const EXAM_KEYS: ExamKey[] = ["mba", "neet", "jee"];

export const EXAM_LABEL: Record<ExamKey, string> = { mba: "MBA", neet: "NEET", jee: "JEE" };

/** ISO date (YYYY-MM-DD) of the next exam, or null if not announced. */
export const NEXT_EXAM: Record<ExamKey, { name: string; date: string | null }> = {
  mba: { name: "CAT 2026", date: "2026-11-29" },
  neet: { name: "NEET UG 2027", date: null },
  jee: { name: "JEE Main 2027", date: null },
};

/** When EXAM_DATES was last checked against the official exam websites. */
export const EXAM_DATES_CHECKED = { iso: "2026-11-14", label: "14 Nov 2026" };

export interface ExamDate {
  name: string;
  stream: ExamKey;
  /** Short form for the hero card ("Sun, 29 Nov"). */
  short: string;
  /** Full form for the dates table ("Sunday, 29 November 2026"). */
  long: string;
  /** ISO dates. start null = a testing window or not announced yet. */
  start: string | null;
  end: string | null;
  body: string;
  site: string;
  to: string;
}

/**
 * Entrance exam dates, from the ProCounsel Admissions 2026–27 brochure and the
 * official exam websites (checked on EXAM_DATES_CHECKED). Drives the hero's
 * "Upcoming exams" card, the home dates table and its Event structured data,
 * so a date change is a one-line edit here. Never guess a date: leave start
 * null and say "awaited" until it is official.
 */
export const EXAM_DATES: ExamDate[] = [
  { name: "CAT 2026", stream: "mba", short: "Sun, 29 Nov", long: "Sunday, 29 November 2026", start: "2026-11-29", end: "2026-11-29", body: "IIMs (conducted by IIM Indore)", site: "https://iimcat.ac.in", to: "/mba-entrance-exams/cat" },
  { name: "NMAT", stream: "mba", short: "Window till Dec", long: "Testing window open till December 2026", start: null, end: "2026-12-31", body: "GMAC", site: "https://www.mba.com/exams/nmat", to: "/mba-entrance-exams/nmat" },
  { name: "SNAP 2026", stream: "mba", short: "13, 19 & 26 Dec", long: "13, 19 and 26 December 2026", start: "2026-12-13", end: "2026-12-26", body: "Symbiosis International University", site: "https://www.snaptest.org/", to: "/mba-entrance-exams/snap" },
  { name: "XAT 2027", stream: "mba", short: "Sun, 3 Jan", long: "Sunday, 3 January 2027", start: "2027-01-03", end: "2027-01-03", body: "XLRI Jamshedpur", site: "https://xatonline.in/", to: "/mba-entrance-exams/xat" },
  { name: "CMAT 2027", stream: "mba", short: "Dates awaited", long: "Not announced yet", start: null, end: null, body: "National Testing Agency (NTA)", site: "https://cmat.nta.nic.in/", to: "/mba-entrance-exams/cmat" },
  { name: "JEE Main 2027", stream: "jee", short: "Dates awaited", long: "Not announced yet", start: null, end: null, body: "National Testing Agency (NTA)", site: "https://jeemain.nta.nic.in/", to: "/jee-rank-predictor" },
  { name: "NEET UG 2027", stream: "neet", short: "Dates awaited", long: "Not announced yet", start: null, end: null, body: "National Testing Agency (NTA)", site: "https://neet.nta.nic.in/", to: "/neet-counselling" },
];

/** Upcoming MBA entrance tests for the hero card. `date` (ISO) drives hiding past entries. */
export const UPCOMING_MBA_EXAMS: { name: string; when: string; date: string | null; to: string }[] = EXAM_DATES
  .filter((e) => e.stream === "mba")
  .map((e) => ({ name: e.name, when: e.short, date: e.end ?? e.start, to: e.to }));

export interface ExamTool {
  label: string;
  desc: string;
  to: string;
  free: boolean;
  /** Lives in the signed-in MBA app: signed-out visitors are sent through login first. */
  mbaApp?: boolean;
}

export const EXAM_TOOLS: Record<ExamKey, ExamTool[]> = {
  mba: [
    { label: "CAT college predictor", desc: "Which IIMs your percentile clears", to: "/cat-college-predictor", free: true },
    { label: "CAT score calculator", desc: "Your score from the response sheet", to: "/cat-score-calculator", free: true },
    { label: "Free CAT mocks", desc: "Full-length, timed (free sign-in)", to: "/free-cat-mock-test", free: true },
    { label: "CAT past papers", desc: "Previous years' papers, every slot", to: "/cat-previous-year-papers", free: true },
    { label: "IIM cut-offs", desc: "Official minimum percentiles", to: "/mba-colleges/iim-cutoffs", free: true },
    { label: "Live AI mock interview", desc: "An AI panel that follows up, like the real one (free sign-in)", to: "/mba/gdpi/live", free: true, mbaApp: true },
  ],
  neet: [
    { label: "NEET college predictor", desc: "MBBS & BDS colleges for your rank", to: "/neet-college-predictor", free: true },
    { label: "NEET rank predictor", desc: "Your expected All-India rank", to: "/neet-rank-predictor", free: true },
    { label: "NEET cut-offs", desc: "Closing ranks, round by round", to: "/neet-cutoffs", free: true },
    { label: "State counselling guide", desc: "Rules, rounds and documents", to: "/neet-counselling", free: true },
    { label: "MBBS colleges", desc: "Browse medical colleges", to: "/mbbs-colleges", free: true },
    { label: "All free predictors", desc: "NEET, JEE, MHT-CET and CAT", to: "/predictors", free: true },
  ],
  jee: [
    { label: "JEE college predictor", desc: "NITs, IIITs & GFTIs for your percentile", to: "/jee-college-predictor", free: true },
    { label: "JEE rank predictor", desc: "Your expected rank from percentile", to: "/jee-rank-predictor", free: true },
    { label: "MHT-CET college predictor", desc: "Maharashtra colleges for your score", to: "/mhtcet-college-predictor", free: true },
    { label: "Engineering colleges", desc: "Browse verified college profiles", to: "/colleges", free: true },
    { label: "All free predictors", desc: "NEET, JEE, MHT-CET and CAT", to: "/predictors", free: true },
    { label: "Talk to a JEE counsellor", desc: "JoSAA & CAP choice filling", to: "/counsellor-listing", free: false },
  ],
};

export const QUICK_LINKS: Record<ExamKey, { label: string; to: string }[]> = {
  mba: [
    { label: "MBA admission guide 2027", to: "/mba-admission-2027" },
    { label: "MAH-MBA/MMS CET & CAP", to: "/mba-entrance-exams/mah-mba-cet" },
    { label: "MBA without CAT", to: "/mba-without-cat" },
    { label: "XAT, SNAP & NMAT", to: "/mba-entrance-exams" },
    { label: "Compare MBA colleges", to: "/mba-colleges/compare" },
    { label: "Fees & ROI calculator", to: "/mba-fees-roi-calculator" },
    { label: "MBA deadlines", to: "/mba-admission-deadlines" },
  ],
  neet: [
    { label: "NEET cut-offs", to: "/neet-cutoffs" },
    { label: "State counselling", to: "/neet-counselling" },
    { label: "MBBS colleges", to: "/mbbs-colleges" },
    { label: "Admission deadlines", to: "/admissions/deadlines" },
  ],
  jee: [
    { label: "MHT-CET predictor", to: "/mhtcet-college-predictor" },
    { label: "JEE rank predictor", to: "/jee-rank-predictor" },
    { label: "JoSAA & CAP help", to: "/counsellor-listing" },
    { label: "Admission deadlines", to: "/admissions/deadlines" },
  ],
};

/** The "check your college" box: one input per exam, passed to the predictor's existing URL prefill. */
export const QUICK_CHECK: Record<
  ExamKey,
  { label: string; placeholder: string; param: string; to: string; min: number; max: number; integer: boolean }
> = {
  mba: { label: "Your CAT percentile", placeholder: "e.g. 92.4", param: "percentile", to: "/cat-college-predictor", min: 0, max: 100, integer: false },
  neet: { label: "Your NEET rank (AIR)", placeholder: "e.g. 18500", param: "rank", to: "/neet-college-predictor", min: 1, max: 2500000, integer: true },
  jee: { label: "Your JEE Main percentile", placeholder: "e.g. 97.8", param: "percentile", to: "/jee-college-predictor", min: 0, max: 100, integer: false },
};

export interface DailyQuestion {
  q: string;
  options: string[];
  answer: number;
  why: string;
}

/** Practice questions (written for this page, not past-paper questions). One is shown per day. */
export const DAILY_QUESTIONS: Record<ExamKey, DailyQuestion[]> = {
  mba: [
    { q: "If x + 1/x = 3, what is x² + 1/x²?", options: ["5", "7", "9", "11"], answer: 1, why: "(x + 1/x)² = x² + 2 + 1/x², so x² + 1/x² = 9 − 2 = 7." },
    { q: "A can finish a job in 12 days and B in 18 days. Working together, how long do they take?", options: ["6 days", "7.2 days", "7.5 days", "15 days"], answer: 1, why: "Together they do 1/12 + 1/18 = 5/36 of the job a day, so they need 36/5 = 7.2 days." },
    { q: "On ₹10,000 at 10% a year for 2 years, how much more is compound interest than simple interest?", options: ["₹50", "₹100", "₹110", "₹200"], answer: 1, why: "CI = ₹2,100 and SI = ₹2,000. The extra ₹100 is 10% interest on the first year's ₹1,000." },
    { q: "How many three-digit numbers are divisible by 7?", options: ["126", "127", "128", "129"], answer: 2, why: "The first is 105 (7 × 15) and the last is 994 (7 × 142), so there are 142 − 15 + 1 = 128." },
    { q: "A shopkeeper marks goods 40% above cost and then gives a 20% discount. What is the profit?", options: ["10%", "12%", "20%", "8%"], answer: 1, why: "1.4 × 0.8 = 1.12 of the cost price, which is a 12% profit." },
    { q: "A 150 m train at 54 km/h crosses a 300 m platform. How long does it take?", options: ["20 s", "25 s", "30 s", "45 s"], answer: 2, why: "54 km/h = 15 m/s. It must cover 150 + 300 = 450 m, so 450 ÷ 15 = 30 seconds." },
    { q: "The average of five consecutive odd numbers is 27. What is the largest of them?", options: ["29", "31", "33", "35"], answer: 1, why: "The middle number equals the average, so the numbers are 23, 25, 27, 29 and 31." },
  ],
  neet: [
    { q: "Which of these is NOT a function of the liver?", options: ["Bile production", "Glycogen storage", "Insulin secretion", "Detoxification"], answer: 2, why: "Insulin is secreted by the beta cells of the pancreas, not by the liver." },
    { q: "What is the phenotypic ratio in the F2 generation of Mendel's dihybrid cross?", options: ["3 : 1", "1 : 2 : 1", "9 : 3 : 3 : 1", "1 : 1 : 1 : 1"], answer: 2, why: "Two independently assorting genes give 9 : 3 : 3 : 1 in the F2 generation." },
    { q: "Which blood vessel carries oxygenated blood from the lungs to the heart?", options: ["Pulmonary artery", "Pulmonary vein", "Vena cava", "Aorta"], answer: 1, why: "The pulmonary veins bring oxygenated blood from the lungs to the left atrium." },
    { q: "What is the net gain of ATP from glycolysis of one glucose molecule?", options: ["2", "4", "36", "38"], answer: 0, why: "Glycolysis makes 4 ATP but uses 2, so the net gain is 2 ATP." },
    { q: "A 2 kg body moves at 3 m/s. What is its kinetic energy?", options: ["3 J", "6 J", "9 J", "18 J"], answer: 2, why: "KE = ½mv² = ½ × 2 × 3² = 9 J." },
    { q: "What is the pH of a 0.01 M HCl solution?", options: ["1", "2", "3", "12"], answer: 1, why: "HCl dissociates fully, so [H⁺] = 10⁻² M and pH = 2." },
    { q: "What is the SI unit of magnetic flux?", options: ["Tesla", "Weber", "Henry", "Gauss"], answer: 1, why: "Magnetic flux is measured in webers (Wb). The tesla is the unit of magnetic field (flux density)." },
  ],
  jee: [
    { q: "What is the value of ∫₀¹ x² dx?", options: ["1/2", "1/3", "1/4", "1"], answer: 1, why: "∫x² dx = x³/3, which is 1/3 between 0 and 1." },
    { q: "f(x) = x³ − 3x has a local maximum at x = ?", options: ["−1", "0", "1", "3"], answer: 0, why: "f′(x) = 3x² − 3 = 0 gives x = ±1, and f″(−1) = −6 < 0, so x = −1 is a local maximum." },
    { q: "What is lim (x → 0) of sin(3x)/x?", options: ["0", "1", "3", "1/3"], answer: 2, why: "sin(3x)/x = 3 · sin(3x)/(3x), which tends to 3 × 1 = 3." },
    { q: "In how many ways can 3 people be chosen from 7?", options: ["21", "35", "42", "210"], answer: 1, why: "⁷C₃ = 7 × 6 × 5 ÷ (3 × 2 × 1) = 35." },
    { q: "What is the sum of the infinite series 1 + 1/2 + 1/4 + 1/8 + …?", options: ["1.5", "2", "3", "Infinite"], answer: 1, why: "It is a geometric series with a = 1 and r = 1/2, so the sum is 1 ÷ (1 − 1/2) = 2." },
    { q: "Ignoring air resistance, at what launch angle is a projectile's range greatest?", options: ["30°", "45°", "60°", "90°"], answer: 1, why: "Range = u² sin 2θ / g, which is largest when sin 2θ = 1, that is θ = 45°." },
    { q: "What is the hybridisation of each carbon atom in ethyne (C₂H₂)?", options: ["sp", "sp²", "sp³", "sp³d"], answer: 0, why: "Each carbon forms a triple bond and one single bond, using two sp hybrid orbitals in a linear shape." },
  ],
};

/** Myth-busters for the daily cards. `question` is the same point asked the way students search it (home FAQ). */
export const MYTHS: Record<ExamKey, { myth: string; question: string; lead: string; fact: string; to?: string; link?: string }[]> = {
  mba: [
    { myth: "Only engineers crack CAT.", question: "Can non-engineers crack CAT?", lead: "Yes.", fact: "CAT is open to any graduate with at least 50% marks or equivalent CGPA (45% for SC, ST and PwD), and final-year students can apply. Students from every stream make it to top B-schools." },
    { myth: "CAT is the only way into a good MBA.", question: "Is CAT the only way to get into a good MBA college?", lead: "No.", fact: "XAT, SNAP, NMAT, CMAT and others are accepted by many well-known B-schools.", to: "/mba-without-cat", link: "MBA without CAT" },
    { myth: "You need 99 percentile for a good MBA.", question: "Do you need 99 percentile in CAT for a good MBA college?", lead: "No.", fact: "Cut-offs vary a lot. Many good B-schools shortlist well below 99 — check each one's published numbers.", to: "/mba-colleges/iim-cutoffs", link: "See IIM cut-offs" },
  ],
  neet: [
    { myth: "You have to choose between MCC and your state counselling.", question: "Can I register for both MCC and state NEET counselling?", lead: "Yes.", fact: "You can register for both. MCC fills the 15% All-India Quota and deemed seats; your state fills its state-quota seats.", to: "/neet-counselling", link: "State counselling guide" },
    { myth: "If you miss Round 1, it's over.", question: "Can I still get a NEET seat if I miss Round 1 of counselling?", lead: "Yes.", fact: "Later rounds and the stray vacancy round still fill seats. Plan every round in advance.", to: "/neet-cutoffs", link: "Round-wise cut-offs" },
  ],
  jee: [
    { myth: "JEE Main is only for NITs.", question: "Is JEE Main only for NITs?", lead: "No.", fact: "JEE Main also decides who can write JEE Advanced (for IITs), and is used for IIITs and GFTIs through JoSAA." },
    { myth: "If you write JEE, MHT-CET doesn't matter.", question: "Should I write MHT-CET if I am already writing JEE Main?", lead: "Yes, if you want a Maharashtra state seat.", fact: "Most Maharashtra state seats are filled through MHT-CET, so many students write both.", to: "/mhtcet-college-predictor", link: "MHT-CET predictor" },
  ],
};

/** Exam-date and myth-buster questions for the home FAQ (visible list + FAQPage schema). */
export function examFaqs(): { question: string; answer: string }[] {
  const mba = EXAM_DATES.filter((e) => e.stream === "mba");
  const cat = mba[0];
  const host = cat.site.replace(/^https?:\/\//, "").replace(/\/$/, "");
  return [
    {
      question: `When is ${cat.name}?`,
      answer: `${cat.name} is on ${cat.long}. It is run by the ${cat.body}; admit cards and slot timings are on ${host}.`,
    },
    {
      question: "What are the MBA entrance exam dates for 2026–27?",
      answer: `${mba.map((e) => `${e.name}: ${e.long}`).join(". ")}. Dates were last checked on ${EXAM_DATES_CHECKED.label} against the official websites; always confirm on the exam's own site.`,
    },
    ...EXAM_KEYS.flatMap((k) => MYTHS[k].map((m) => ({ question: m.question, answer: `${m.lead} ${m.fact}` }))),
  ];
}

/** Whole days from today (local) to an ISO date. Negative once the date has passed. */
export function daysUntil(iso: string, now: Date = new Date()): number {
  const [y, m, d] = iso.split("-").map(Number);
  const target = new Date(y, m - 1, d).getTime();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  return Math.round((target - today) / 86_400_000);
}

/** Index for "one per day": stable for a calendar day, changes at midnight. */
export function dayIndex(length: number, now: Date = new Date()): number {
  const days = Math.floor(new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() / 86_400_000);
  return ((days % length) + length) % length;
}

const STORAGE_KEY = "home-exam";

export function loadSavedExam(): ExamKey | null {
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    return v === "mba" || v === "neet" || v === "jee" ? v : null;
  } catch {
    return null;
  }
}

export function saveExam(exam: ExamKey): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, exam);
  } catch {
    // private mode / blocked storage: the choice just isn't remembered
  }
}

/** Tools this student opened from the home page, newest first (max 3), for "Pick up where you left off". */
export interface RecentTool {
  label: string;
  to: string;
  exam: ExamKey;
}

const RECENT_KEY = "home-recent-tools";

export function loadRecentTools(): RecentTool[] {
  try {
    const raw = window.localStorage.getItem(RECENT_KEY);
    const list = raw ? (JSON.parse(raw) as RecentTool[]) : [];
    // Only same-site paths: the href comes from storage, so never trust it to be a URL.
    return Array.isArray(list)
      ? list
          .filter((t) => t && typeof t.to === "string" && t.to.startsWith("/") && !t.to.startsWith("//") && typeof t.label === "string")
          .slice(0, 3)
      : [];
  } catch {
    return [];
  }
}

export function rememberTool(tool: RecentTool): void {
  try {
    const next = [tool, ...loadRecentTools().filter((t) => t.to !== tool.to)].slice(0, 3);
    window.localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch {
    // storage blocked: nothing to remember
  }
}

/** ProCounsel helpline (from the Admissions 2026–27 brochure). */
export const HELPLINE = { display: "+91 70047 89484", tel: "+917004789484" };

/** "Sunday, 29 Nov" from an ISO date, without locale differences between prerender and browser. */
export function formatExamDay(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const day = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][new Date(y, m - 1, d).getDay()];
  const mon = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][m - 1];
  return `${day}, ${d} ${mon}`;
}

/** ProCounsel's WhatsApp updates channel (same link the Grand Mock Test page uses). */
export const WHATSAPP_CHANNEL = "https://whatsapp.com/channel/0029Vb7l9UmJ93wNDFVyaa0B";

/**
 * Direct WhatsApp chat with the counselling desk. Set VITE_WHATSAPP_NUMBER
 * (digits with country code, e.g. 91XXXXXXXXXX) to turn it on: every chat then
 * arrives with the student's number, which the anonymous channel never gives.
 * Unset, the WhatsApp buttons keep pointing at the channel.
 */
const WHATSAPP_NUMBER = ((import.meta.env.VITE_WHATSAPP_NUMBER as string | undefined) ?? "").replace(/\D/g, "");

export const WHATSAPP_CHAT_ENABLED = WHATSAPP_NUMBER.length >= 10;

/** Chat link with a pre-filled first message, or the channel when no number is configured. */
export function whatsappHref(exam?: ExamKey): string {
  if (!WHATSAPP_CHAT_ENABLED) return WHATSAPP_CHANNEL;
  const about = exam ? ` I'm preparing for ${exam === "mba" ? "CAT / MBA" : EXAM_LABEL[exam]}.` : "";
  const text = `Hi ProCounsel,${about} I'd like some help with my admission.`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}
