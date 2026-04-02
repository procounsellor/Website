import { useNavigate } from "react-router-dom";

export default function ProBuddiesComingSoon() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] bg-[#F5F5F7] px-4 py-12 md:px-[60px] md:py-16">
      <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-sm">
        <div className="relative px-6 py-12 md:px-12 md:py-16">
          <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#0E1629]/5 blur-2xl" />
          <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-[#2F43F2]/10 blur-2xl" />

          <div className="relative z-10 text-center">
            <p className="inline-flex items-center rounded-full border border-[#D1D5DB] bg-[#F9FAFB] px-3 py-1 text-xs font-semibold tracking-wide text-(--text-main)">
              SOMETHING SPECIAL
            </p>
            <h1 className="mt-4 text-3xl font-bold text-(--text-main) md:text-5xl">
              ProBuddies Coming Soon
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-[#6B7280] md:text-base">
              Something exciting is on the way. Stay tuned for ProBuddies.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                onClick={() => navigate("/admissions")}
                className="rounded-lg bg-[#0E1629] px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                Back to Home
              </button>
              <button
                onClick={() => navigate("/courses")}
                className="rounded-lg border border-[#0E1629] px-5 py-2.5 text-sm font-semibold text-[#0E1629] transition-colors hover:bg-[#0E1629] hover:text-white"
              >
                Explore Courses
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
