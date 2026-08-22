import { Link } from "react-router-dom";
import MobileCourseBottomNav from "@/components/Revamp/courses/MobileCourseBottomNav";
import PageSEO from "@/components/SEO/PageSEO";

// Live sessions are driven entirely by Firebase Realtime Database state and are
// only meaningful to a signed-in user, so there is nothing crawlable here. The
// page stays reachable for users but is noindex'd and kept out of the sitemap
// rather than shipping an "under construction" page to search engines.
export default function SessionListing() {
  return (
    <div className="min-h-screen bg-[#F5F5F7] pb-24">
      <PageSEO
        title="Live Sessions — Book Counselling Sessions"
        description="Join live one-on-one counselling and mentorship sessions with verified experts on ProCounsel."
        noIndex
      />
      <div className="px-5 pt-8 md:px-12 max-w-3xl">
        <h1 className="text-2xl font-semibold text-[#0E1629]">Live sessions</h1>
        <p className="mt-3 text-sm text-[#6B7280] leading-relaxed">
          Live sessions run inside your ProCounsel account. Sign in to see which counsellors are
          broadcasting right now, join an ongoing session, or book a one-on-one slot.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/live-sessions"
            className="rounded-xl bg-[#0E1629] px-5 py-2.5 text-sm font-semibold text-white"
          >
            Go to live sessions
          </Link>
          <Link
            to="/courses"
            className="rounded-xl border border-[#0E1629] px-5 py-2.5 text-sm font-semibold text-[#0E1629]"
          >
            Browse courses
          </Link>
          <Link
            to="/counsellor-listing"
            className="rounded-xl border border-[#0E1629] px-5 py-2.5 text-sm font-semibold text-[#0E1629]"
          >
            Find a counsellor
          </Link>
        </div>
      </div>

      <MobileCourseBottomNav />
    </div>
  );
}
