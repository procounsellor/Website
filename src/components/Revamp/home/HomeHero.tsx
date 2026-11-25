import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Bell,
  Briefcase,
  CalendarClock,
  Cog,
  Globe2,
  GraduationCap,
  HeartPulse,
  Search,
  Users,
  UserRoundCheck,
  type LucideIcon,
} from "lucide-react";
import { useSearchStore } from "@/store/SearchStore";
import { SearchResults } from "@/components/layout/SearchResults";
import { UPCOMING_MBA_EXAMS, daysUntil } from "@/data/homeExams";
import { trackEvent } from "@/lib/analytics";
import LeadDialog from "./LeadDialog";

/** "Explore by stream" — also carries the links the old tile hero had (MBA, colleges, study abroad, ProBuddies, deadlines). */
const STREAMS: { label: string; hint: string; to: string; icon: LucideIcon; tint: string }[] = [
  { label: "MBA", hint: "CAT · XAT · SNAP", to: "/mba-admission-2027", icon: Briefcase, tint: "bg-[#EEF0FE] text-[#2F43F2]" },
  { label: "Engineering", hint: "JEE · MHT-CET", to: "/?exam=jee#exam-tools", icon: Cog, tint: "bg-[#E6F4FB] text-[#0B6A94]" },
  { label: "Medical", hint: "NEET · MBBS", to: "/neet-counselling", icon: HeartPulse, tint: "bg-[#FDECF3] text-[#B4235F]" },
  { label: "Colleges", hint: "Verified profiles", to: "/colleges", icon: GraduationCap, tint: "bg-[#E8F7EE] text-[#146C43]" },
  { label: "Study abroad", hint: "Universities, visas", to: "/study-abroad", icon: Globe2, tint: "bg-[#F3EEFF] text-[#6D28D9]" },
  { label: "Counsellors", hint: "Book a session", to: "/counsellor-listing", icon: UserRoundCheck, tint: "bg-[#FFF1E6] text-[#C2410C]" },
  { label: "ProBuddies", hint: "Talk to seniors", to: "/pro-buddies", icon: Users, tint: "bg-[#EEF0FE] text-[#2F43F2]" },
  { label: "Deadlines", hint: "Exam & form dates", to: "/admissions/deadlines", icon: CalendarClock, tint: "bg-[#FFF4E5] text-[#9A4A00]" },
];

const POPULAR = [
  { label: "CAT college predictor", to: "/cat-college-predictor" },
  { label: "Free CAT mocks", to: "/free-cat-mock-test" },
  { label: "CAT past papers", to: "/cat-previous-year-papers" },
  { label: "NEET cut-offs", to: "/neet-cutoffs" },
  { label: "MHT-CET predictor", to: "/mhtcet-college-predictor" },
  { label: "MBA without CAT", to: "/mba-without-cat" },
];

/** NEET and JEE dates are not announced yet; shown as such rather than guessed. */
const OTHER_UPDATES = [
  { name: "NEET UG 2027", when: "Dates awaited", to: "/neet-counselling" },
  { name: "JEE Main 2027", when: "Dates awaited", to: "/jee-college-predictor" },
];

export default function HomeHero() {
  const { query, setQuery, setSearchOpen, clearResults } = useSearchStore();
  const [searchOpen, setOpen] = useState(false);
  const [reminders, setReminders] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  // Past exams drop off after mount, so the prerendered HTML is stable.
  const [upcoming, setUpcoming] = useState(UPCOMING_MBA_EXAMS.slice(0, 4));
  useEffect(() => {
    setUpcoming(UPCOMING_MBA_EXAMS.filter((e) => !e.date || daysUntil(e.date) >= 0).slice(0, 4));
  }, []);

  // The header's search effect already runs the search when the shared query changes;
  // this box only types into it and shows the same results.
  useEffect(() => {
    if (!searchOpen) return;
    const onClick = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [searchOpen]);

  return (
    <section aria-labelledby="home-hero-heading" className="relative overflow-hidden bg-[#0E1629] text-white">
      {/* Decoration: soft glows + dot grid */}
      <div aria-hidden="true" className="pointer-events-none absolute -top-40 right-[-10%] h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(47,67,242,0.45),transparent_65%)]" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-48 -left-40 h-[460px] w-[460px] rounded-full bg-[radial-gradient(circle,rgba(250,102,15,0.22),transparent_65%)]" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="relative max-w-7xl mx-auto px-4 md:px-8 pt-8 pb-10 md:pt-14 md:pb-16 grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-12 items-center">
        {/* Left: headline, search, popular */}
        <div className="min-w-0">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 font-[Poppins] text-[12px] md:text-[13px] font-medium text-[#C3CBDD]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#FA660F]" aria-hidden="true" />
            Admissions 2026–27 · MBA · Engineering · Medical
          </p>
          <h1 id="home-hero-heading" className="mt-4 font-[Poppins] font-bold text-[32px] leading-[1.1] md:text-[50px] tracking-[-0.02em]">
            Find the{" "}
            <span className="relative whitespace-nowrap text-[#FDBA74]">
              right college
              <svg aria-hidden="true" viewBox="0 0 200 12" preserveAspectRatio="none" className="absolute -bottom-1.5 left-0 h-2.5 w-full">
                <path d="M2 9C50 3 120 2 198 6" fill="none" stroke="#FA660F" strokeWidth="4" strokeLinecap="round" />
              </svg>
            </span>
            {/* Non-breaking space on purpose: the prerender's html-minifier drops an
                ordinary space after a span that ends in an <svg> ("collegefor"). */}
            {"\u00A0for your MBA, NEET or JEE score"}
          </h1>
          <p className="mt-4 max-w-[560px] font-[Poppins] text-[15px] md:text-[17px] leading-relaxed text-[#C3CBDD]">
            Free predictors, verified college profiles, cut-offs and exam dates — and a counsellor when you need one.
          </p>

          {/* Big search */}
          <div ref={boxRef} className="relative mt-6 max-w-[620px]">
            <form
              role="search"
              onSubmit={(e) => {
                e.preventDefault();
                setOpen(true);
                setSearchOpen(true);
                trackEvent("home_tool_click", { exam: "all", tool: "hero_search", location: "hero" });
              }}
              className="flex items-center gap-2 rounded-[16px] bg-white p-1.5 pl-4 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.6)]"
            >
              <Search className="h-5 w-5 shrink-0 text-[#6B7280]" aria-hidden="true" />
              <input
                type="search"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  if (!e.target.value) clearResults();
                }}
                onFocus={() => {
                  setOpen(true);
                  setSearchOpen(true);
                }}
                aria-label="Search colleges and counsellors"
                placeholder="Search colleges, e.g. VJTI, SPJIMR, COEP"
                className="min-w-0 flex-1 bg-transparent py-3 font-[Poppins] text-[15px] md:text-[16px] text-[#0E1629] outline-none placeholder:text-[#9CA3AF]"
              />
              <button type="submit" className="shrink-0 rounded-[12px] bg-[#2F43F2] hover:bg-[#2437d1] px-4 md:px-6 py-3 font-[Poppins] font-semibold text-[14px] md:text-[15px] text-white cursor-pointer transition-colors">
                Search
              </button>
            </form>
            {searchOpen && query.trim() && (
              <div className="absolute left-0 right-0 top-full z-40 mt-2 max-h-96 overflow-hidden rounded-[14px] border border-gray-200 bg-white text-[#0E1629] shadow-2xl">
                <SearchResults
                  onResultClick={() => {
                    setOpen(false);
                    setSearchOpen(false);
                  }}
                />
              </div>
            )}
          </div>

          <div className="mt-4 -mx-4 flex items-center gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:flex-wrap md:overflow-visible md:px-0">
            <span className="shrink-0 font-[Poppins] text-[13px] text-[#A9B3C9]">Popular:</span>
            {POPULAR.map((p) => (
              <Link
                key={p.to}
                to={p.to}
                onClick={() => trackEvent("home_tool_click", { exam: "all", tool: p.label, location: "hero_popular" })}
                className="inline-flex min-h-[36px] shrink-0 items-center rounded-full border border-white/15 bg-white/5 px-3 font-[Poppins] text-[13px] text-white hover:bg-white/15 transition-colors"
              >
                {p.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Right: photo + live updates card */}
        <div className="relative min-w-0">
          <div className="relative overflow-hidden rounded-[24px] ring-1 ring-white/10">
            <img
              src="/probuddiesbg-1024.webp"
              // Shown at most ~600 px wide: phones get 640/1024 px copies
              // (32-58 KB) instead of the 1920 px original (164 KB).
              srcSet="/probuddiesbg-640.webp 640w, /probuddiesbg-1024.webp 1024w"
              sizes="(min-width: 1024px) 600px, calc(100vw - 32px)"
              alt="Students planning their admissions together"
              width={640}
              height={420}
              fetchPriority="high"
              className="h-[220px] w-full object-cover md:h-[300px] lg:h-[330px]"
            />
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#0E1629]/70 via-transparent to-transparent" />
          </div>

          <div className="relative -mt-10 mx-3 md:mx-5 rounded-[18px] bg-white p-4 md:p-5 text-[#0E1629] shadow-[0_24px_60px_-24px_rgba(0,0,0,0.6)]">
            <div className="flex items-center justify-between gap-2">
              <p className="font-[Poppins] text-[12px] font-semibold uppercase tracking-wider text-[#2F43F2]">Upcoming exams</p>
              <button
                type="button"
                onClick={() => setReminders(true)}
                className="inline-flex min-h-[36px] items-center gap-1.5 rounded-full bg-[#0E1629] hover:bg-[#1B2440] px-3 font-[Poppins] text-[12px] font-semibold text-white cursor-pointer"
              >
                <Bell className="h-3.5 w-3.5" aria-hidden="true" /> Remind me
              </button>
            </div>
            <ul className="mt-2 divide-y divide-[#EEF0F5]">
              {[...upcoming.map((e) => ({ name: e.name, when: e.when, to: e.to })), ...OTHER_UPDATES].slice(0, 5).map((e) => (
                <li key={e.name}>
                  <Link
                    to={e.to}
                    onClick={() => trackEvent("home_tool_click", { exam: "all", tool: e.name, location: "hero_updates" })}
                    className="group flex items-center justify-between gap-3 py-2.5 font-[Poppins] text-[14px]"
                  >
                    <span className="font-semibold group-hover:text-[#2F43F2]">{e.name}</span>
                    <span className="inline-flex items-center gap-1 text-[13px] text-[#4B5563]">
                      {e.when}
                      <ArrowRight className="h-3.5 w-3.5 text-[#2F43F2] transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-1 font-[Poppins] text-[11px] text-[#6B7280]">Dates from official sources, checked 14 Nov 2026.</p>
          </div>
        </div>
      </div>

      {/* Explore by stream */}
      <div className="relative border-t border-white/10 bg-[#0B1222]/60">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-5 md:py-6">
          <p className="mb-3 font-[Poppins] text-[13px] font-semibold uppercase tracking-wider text-[#A9B3C9]">Explore by stream</p>
          <ul className="grid grid-cols-4 gap-2 md:gap-3 lg:grid-cols-8">
            {STREAMS.map((s) => (
              <li key={s.label}>
                <Link
                  to={s.to}
                  onClick={() => trackEvent("home_tool_click", { exam: "all", tool: s.label, location: "hero_streams" })}
                  className="group flex h-full flex-col items-center gap-2 rounded-[16px] bg-white/[0.06] p-3 md:p-4 text-center ring-1 ring-white/10 transition-all hover:-translate-y-0.5 hover:bg-white/[0.12] motion-reduce:hover:translate-y-0"
                >
                  <span className={`flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-[14px] ${s.tint}`}>
                    <s.icon className="h-5 w-5 md:h-6 md:w-6" aria-hidden="true" />
                  </span>
                  <span className="font-[Poppins] text-[12px] md:text-[14px] font-semibold leading-tight text-white">{s.label}</span>
                  <span className="hidden md:block font-[Poppins] text-[11px] leading-tight text-[#A9B3C9]">{s.hint}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {reminders && (
        <LeadDialog
          title="Get exam date reminders"
          subheading="Leave your number and a ProCounsel counsellor will remind you before your exam dates — and help you plan applications. Free, no login needed."
          intent={`Exam date reminders (hero): ${upcoming.map((e) => `${e.name} (${e.when})`).join(", ")}`}
          formId="home_hero_reminders"
          onClose={() => setReminders(false)}
        />
      )}
    </section>
  );
}
