import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import { EXAM_DATES, EXAM_DATES_CHECKED, EXAM_LABEL, daysUntil } from "@/data/homeExams";
import SectionLabel from "./SectionLabel";

const hostOf = (url: string) => url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/.*$/, "");

/**
 * A plain, crawlable table of entrance exam dates with the conducting body,
 * the official website and the date the data was last checked — the kind of
 * answer students (and answer engines) look for. Same data as the hero card
 * and the Event structured data (EXAM_DATES), so they never disagree.
 *
 * The table text is fixed at build time; the "Over" tag is added after mount
 * so the prerendered HTML and the first client render match.
 */
export default function ExamDates() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => setNow(new Date()), []);

  const isOver = (end: string | null) => (now && end ? daysUntil(end, now) < 0 : false);

  return (
    <section id="exam-dates" aria-labelledby="home-exam-dates-heading" className="w-full bg-white py-8 md:py-14 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <SectionLabel className="border border-[#E3E7F0]">Exam dates</SectionLabel>
        <h2 id="home-exam-dates-heading" className="mt-4 font-[Poppins] font-bold text-[22px] md:text-[30px] text-[#0E1629] leading-tight">
          Entrance exam dates 2026–27
        </h2>
        <p className="mt-1 font-[Poppins] text-[14px] md:text-[16px] text-[#4B5563]">
          MBA, JEE and NEET exams, who conducts them and where to check the official notice.
        </p>

        <div className="mt-5 overflow-hidden rounded-[16px] border border-[#E3E7F0]">
          <table className="w-full border-collapse text-left font-[Poppins]">
            <caption className="sr-only">
              Entrance exam dates for 2026–27, last checked on {EXAM_DATES_CHECKED.label}
            </caption>
            <thead className="bg-[#F5F7FB] text-[12px] md:text-[13px] uppercase tracking-[0.05em] text-[#4B5563]">
              <tr>
                <th scope="col" className="px-3 md:px-5 py-3 font-semibold">Exam</th>
                <th scope="col" className="px-3 md:px-5 py-3 font-semibold">Date</th>
                <th scope="col" className="hidden md:table-cell px-5 py-3 font-semibold">Conducted by</th>
                <th scope="col" className="hidden sm:table-cell px-3 md:px-5 py-3 font-semibold">Official website</th>
              </tr>
            </thead>
            <tbody className="text-[13px] md:text-[15px] text-[#0E1629]">
              {EXAM_DATES.map((e) => {
                const over = isOver(e.end);
                return (
                  <tr key={e.name} className="border-t border-[#EEF0F5] align-top">
                    <th scope="row" className="px-3 md:px-5 py-3 font-semibold">
                      <Link to={e.to} className="text-[#13097D] hover:underline">
                        {e.name}
                      </Link>
                      <span className="ml-2 rounded-full bg-[#EEF2FF] px-2 py-0.5 text-[11px] font-semibold text-[#3730A3]">
                        {EXAM_LABEL[e.stream]}
                      </span>
                      <span className="mt-0.5 block text-[12px] font-normal text-[#6B7280] md:hidden">{e.body}</span>
                    </th>
                    <td className={`px-3 md:px-5 py-3 ${e.start || e.end ? "" : "text-[#6B7280]"}`}>
                      {e.long}
                      {over && (
                        <span className="ml-2 rounded-full bg-[#F3F4F6] px-2 py-0.5 text-[11px] font-semibold text-[#4B5563]">Over</span>
                      )}
                    </td>
                    <td className="hidden md:table-cell px-5 py-3 text-[#374151]">{e.body}</td>
                    <td className="hidden sm:table-cell px-3 md:px-5 py-3">
                      <a
                        href={e.site}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[#13097D] hover:underline"
                      >
                        {hostOf(e.site)}
                        <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                        <span className="sr-only">(opens in a new tab)</span>
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-3 font-[Poppins] text-[12px] md:text-[13px] text-[#6B7280]">
          Last checked on <time dateTime={EXAM_DATES_CHECKED.iso}>{EXAM_DATES_CHECKED.label}</time> against the official
          websites and the ProCounsel Admissions 2026–27 brochure. Dates can change, so always confirm on the exam's own site.
        </p>
      </div>
    </section>
  );
}
