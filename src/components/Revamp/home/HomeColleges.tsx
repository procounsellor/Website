import { useMemo, useState } from "react";
import { IS_PRERENDER } from "@/lib/clientReady";
import { Link } from "react-router-dom";
import { ArrowRight, MapPin } from "lucide-react";
import { COLLEGES_SNAPSHOT } from "@/data/contentSnapshot";
import { trackEvent } from "@/lib/analytics";
import { mbaProfilePathFor } from "@/lib/collegeProfileAlias.mjs";
import SectionLabel from "./SectionLabel";

type Stream = "all" | "mba" | "engineering";

// IIMN_MUMBAI is stored with the wrong city and founding year (IIM Nagpur opened
// in 2015, in Nagpur). Kept off the home page until the record is fixed; its
// own page is unchanged.
const HIDDEN = new Set(["IIMN_MUMBAI"]);

const TYPE_LABEL: Record<string, string> = { Govt: "Government", Pvt: "Private", Deemed: "Deemed university" };

const COLLEGES = COLLEGES_SNAPSHOT.filter((c) => c.logoUrl && !HIDDEN.has(c.collegeId))
  .map((c) => {
    const courses = (c.coursesOffered ?? []).map((x) => x.courseName).join(" ");
    const exams = [...new Set((c.coursesOffered ?? []).flatMap((x) => (x.examsAccepted ?? []).map((e) => e.examName.trim())).filter(Boolean))];
    const stream: Exclude<Stream, "all"> = /engineering|b\.?tech|m\.?tech/i.test(courses) ? "engineering" : "mba";
    return {
      id: c.collegeId,
      name: c.collegeName,
      city: c.collegesLocationCity,
      state: c.collegesLocationState,
      logo: c.logoUrl,
      type: TYPE_LABEL[c.collegeType] ?? c.collegeType,
      exams: exams.slice(0, 3),
      moreExams: Math.max(0, exams.length - 3),
      stream,
      popularity: c.popularityCount ?? 0,
    };
  })
  .sort((a, b) => b.popularity - a.popularity);

const TABS: { key: Stream; label: string }[] = [
  { key: "all", label: "All" },
  { key: "mba", label: "MBA" },
  { key: "engineering", label: "Engineering" },
];

/**
 * Shiksha-style college block: tabs + information-dense cards (city, type,
 * exams accepted). Built from the build-time snapshot, so it is in the
 * prerendered HTML and links every college page for crawlers.
 */
export default function HomeColleges() {
  const [tab, setTab] = useState<Stream>("all");
  const shown = useMemo(() => (tab === "all" ? COLLEGES : COLLEGES.filter((c) => c.stream === tab)).slice(0, 8), [tab]);
  if (COLLEGES.length === 0) return null;

  return (
    <section id="partner-colleges" aria-labelledby="home-colleges-heading" className="w-full bg-[#C6DDF040] py-8 md:py-14 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <SectionLabel>Colleges</SectionLabel>
        <div className="mt-4 flex flex-col md:flex-row md:items-end md:justify-between gap-3">
          <div>
            <h2 id="home-colleges-heading" className="font-[Poppins] font-bold text-[22px] md:text-[30px] text-[#0E1629] leading-tight">
              Explore colleges on ProCounsel
            </h2>
            <p className="mt-1 font-[Poppins] text-[14px] md:text-[16px] text-[#4B5563]">
              Programs, location and the exams each one accepts. A listing is not a ranking.
            </p>
          </div>
          <div role="tablist" aria-label="College stream" className="flex gap-1 rounded-full border border-[#E3E7F0] bg-white p-1 w-fit">
            {TABS.map((t) => (
              <button
                key={t.key}
                type="button"
                role="tab"
                aria-selected={tab === t.key}
                onClick={() => setTab(t.key)}
                className={`min-h-[36px] rounded-full px-4 font-[Poppins] text-[13px] md:text-[14px] font-medium cursor-pointer transition-colors ${
                  tab === t.key ? "bg-[#0E1629] text-white" : "text-[#0E1629] hover:bg-[#F5F7FB]"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <ul className="mt-6 flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-2 md:overflow-visible lg:grid-cols-4 md:gap-4">
          {shown.map((c) => (
            <li key={c.id} className="w-[78%] shrink-0 md:w-auto">
              <Link
                to={mbaProfilePathFor(c.id) ?? `/college-details/${c.id}`}
                onClick={() => trackEvent("home_tool_click", { exam: c.stream, tool: c.id, location: "home_colleges" })}
                className="group flex h-full flex-col rounded-[18px] border border-[#E3E7F0] bg-white p-4 md:p-5 transition-all hover:-translate-y-1 hover:shadow-[0_18px_40px_-16px_rgba(14,22,41,0.25)] motion-reduce:hover:translate-y-0"
              >
                <div className="flex items-start gap-3">
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-[12px] border border-[#EEF0F5] bg-white p-1.5">
                    <CollegeLogo src={c.logo} name={c.name} />
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-[Poppins] text-[15px] font-semibold leading-snug text-[#0E1629] line-clamp-2 group-hover:text-[#2F43F2]">{c.name}</h3>
                    <p className="mt-1 inline-flex items-center gap-1 font-[Poppins] text-[12.5px] text-[#4B5563]">
                      <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      {c.city}, {c.state}
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <span className="rounded-full bg-[#F5F7FB] px-2.5 py-1 font-[Poppins] text-[11.5px] font-medium text-[#0E1629]">{c.stream === "mba" ? "MBA / PGDM" : "Engineering"}</span>
                  {c.type && <span className="rounded-full bg-[#F5F7FB] px-2.5 py-1 font-[Poppins] text-[11.5px] font-medium text-[#0E1629]">{c.type}</span>}
                </div>
                {c.exams.length > 0 && (
                  <p className="mt-3 font-[Poppins] text-[12.5px] text-[#4B5563]">
                    <span className="font-semibold text-[#0E1629]">Exams:</span> {c.exams.join(", ")}
                    {c.moreExams > 0 && ` +${c.moreExams}`}
                  </p>
                )}
                <span className="mt-auto pt-3 inline-flex items-center gap-1 font-[Poppins] text-[13px] font-semibold text-[#2F43F2]">
                  View college <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-5 flex justify-center md:justify-end">
          <Link to="/colleges" className="inline-flex min-h-[40px] items-center gap-2 font-[Poppins] text-[14px] font-semibold text-[#0E1629] hover:underline">
            View all colleges <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/** College logo, or the college's initials if the image can't be loaded (e.g. a 403 from storage). */
function CollegeLogo({ src, name }: { src: string; name: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    const initials = name
      .split(/[s.]+/)
      .filter((w) => w && !/^(of|and|the|for|&)$/i.test(w))
      .map((w) => w[0])
      .join("")
      .slice(0, 4)
      .toUpperCase();
    return (
      <span aria-hidden="true" className="font-[Poppins] text-[13px] font-bold tracking-wide text-[#13097D]">
        {initials}
      </span>
    );
  }
  return (
    <img src={src} alt="" loading="lazy" decoding="async" onError={() => { if (!IS_PRERENDER) setFailed(true); }} className="max-h-full max-w-full object-contain" />
  );
}
