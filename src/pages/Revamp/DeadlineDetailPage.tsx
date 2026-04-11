import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getDeadlines, type EventItem } from "@/api/deadlines";

export default function DeadlineDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const { data: allEvents = [], isLoading, isError } = useQuery({
    queryKey: ['revamp-deadlines'],
    queryFn: () => getDeadlines(),
    staleTime: 5 * 60 * 1000,
  });

  const deadlineEvent = allEvents.find((event: EventItem) => event.id?.toString() === id);

  const bodyBlocks = useMemo(() => {
    if (!deadlineEvent?.description) return [];
    return deadlineEvent.description.trim().split(/\n\s*\n/).map((p: string) => p.trim()).filter(Boolean);
  }, [deadlineEvent?.description]);

  const breadcrumbTitle = deadlineEvent && deadlineEvent.title.length > 42
      ? `${deadlineEvent.title.slice(0, 42)}…`
      : deadlineEvent?.title ?? "Deadline Details";

  const mobileTitle = deadlineEvent && deadlineEvent.title.length > 28
      ? `${deadlineEvent.title.slice(0, 28)}…`
      : deadlineEvent?.title ?? "Deadline Details";

  const formattedDate = deadlineEvent ? new Date(deadlineEvent.endDate).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
  }) : "";

  return (
    <div
      className="min-h-screen"
      style={{
        background: "linear-gradient(0deg, rgba(198, 221, 240, 0.25), rgba(198, 221, 240, 0.25))",
      }}
    >
      {/* Mobile header */}
      <div className="sm:hidden w-full bg-white border-b border-[#E3E8F4]">
        <div className="flex items-center gap-2 px-4 py-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-(--text-main) cursor-pointer text-[16px] font-semibold"
          >
            {"<"}
          </button>
          <span className="text-[16px] font-semibold text-(--text-main) truncate">
            {isLoading ? "Loading…" : mobileTitle}
          </span>
        </div>
      </div>

      {/* Desktop breadcrumb */}
      <div className="hidden sm:block w-full border-b border-[#E3E8F4] bg-white">
        <div className="max-w-[1440px] mx-auto px-5 md:px-[60px] pt-3 pb-3 text-[0.875rem] text-(--text-muted) font-medium">
          <button type="button" onClick={() => navigate("/admissions")} className="hover:underline cursor-pointer">
            Admission
          </button>
          <span className="mx-1">{">"}</span>
          <button type="button" onClick={() => navigate("/admissions/deadlines")} className="hover:underline cursor-pointer">
            Deadlines
          </button>
          <span className="mx-1">{">"}</span>
          <span className="text-(--text-main)">{breadcrumbTitle}</span>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-[60px] py-6 sm:py-10">
        {isLoading && <p className="text-(--text-muted)">Loading details…</p>}
        {isError && <p className="text-red-600">Could not load this deadline.</p>}
        {!isLoading && !isError && !deadlineEvent && (
          <p className="text-(--text-muted)">This deadline could not be found.</p>
        )}

        {deadlineEvent && (
          <div className="bg-white rounded-[20px] p-6 sm:p-10 shadow-sm">
            <div className="inline-flex items-center px-3 py-1 mb-4 rounded-[999px] bg-[#0E1629] text-[12px] font-medium text-white">
              Target Date: {formattedDate}
            </div>
            
            <h1 className="text-[24px] sm:text-[40px] font-semibold text-[#0E1629] leading-snug">
              {deadlineEvent.title}
            </h1>

            <div className="mt-6 sm:mt-8 space-y-4 sm:space-y-6 text-[14px] sm:text-[18px] font-medium leading-relaxed text-[#6B7280]">
              {bodyBlocks.map((block: string, i: number) => (
                <p key={i} className="whitespace-pre-line">
                  {block}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}