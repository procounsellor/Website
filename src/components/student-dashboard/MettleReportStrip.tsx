import { Link } from 'react-router-dom';
import { ArrowRight, Download } from 'lucide-react';
import { downloadReport } from '@/api/psychometric';
import type { User } from '@/types/user';

/**
 * Mettle career test entry point for the phone dashboard.
 *
 * It sits above the tabs rather than inside "My Info" so it is visible on
 * every tab — the phone layout is the only profile students on mobile ever
 * see, and the report is easy to miss otherwise.
 *
 * The link is read off the profile the dashboard already fetched, so this
 * costs no extra request.
 */
export default function MettleReportStrip({ user }: { user: User }) {
  const reportLink = user.pyschometricReportPdfLink;

  return (
    <div
      className="relative overflow-hidden rounded-xl mb-4 md:mb-6 px-4 py-4 md:px-6 md:py-5"
      style={{ background: 'linear-gradient(125deg, #2B1D6E 0%, #4F46E5 48%, #7C3AED 100%)' }}
    >
      <div
        className="pointer-events-none absolute -top-16 -right-10 w-48 h-48 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(219,39,119,0.40) 0%, transparent 65%)' }}
      />

      <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <p className="text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.14em] text-white/70">
            Mettle · AI Career Test
          </p>
          <h3 className="mt-1 text-base md:text-lg font-semibold text-white">
            {reportLink ? 'Your career report is ready' : 'Discover the career you were built for'}
          </h3>
          <p className="mt-1 text-[12px] md:text-[13px] font-medium text-white/75">
            {reportLink
              ? 'Saved to your profile — download it any time.'
              : 'AI-scored career report · ₹2,000'}
          </p>
        </div>

        {reportLink ? (
          // Download is the job here; viewing in a tab is the quieter fallback.
          <div className="flex shrink-0 items-center gap-4">
            <button
              type="button"
              onClick={() => void downloadReport(reportLink)}
              className="flex flex-1 md:flex-none items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#3730A3] shadow-[0_6px_18px_rgba(15,10,60,0.28)] transition-transform hover:-translate-y-px active:translate-y-0 whitespace-nowrap"
            >
              <Download className="w-4 h-4" strokeWidth={2.5} /> Download PDF
            </button>
            <a
              href={reportLink}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 text-[12.5px] font-medium text-white/75 underline-offset-4 transition-colors hover:text-white hover:underline whitespace-nowrap"
            >
              View
            </a>
          </div>
        ) : (
          <Link
            to="/mettle"
            className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#3730A3] shadow-[0_6px_18px_rgba(15,10,60,0.28)] transition-transform hover:-translate-y-px whitespace-nowrap"
          >
            Take the test <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
          </Link>
        )}
      </div>
    </div>
  );
}
