// src/pages/Revamp/DeadlinesPage.tsx
import { useQuery } from "@tanstack/react-query";
import { getDeadlines, type EventItem } from "@/api/deadlines";
import DeadlinePageCard from "@/components/Revamp/deadlinePage/DeadlinePageCard";

export default function DeadlinesPage() {
  const { data: allEvents = [], isLoading, isError, error, refetch } = useQuery({
    queryKey: ['revamp-deadlines'],
    queryFn: () => getDeadlines(),
    staleTime: 5 * 60 * 1000,
  });

  const activeEvents = allEvents.filter((event: EventItem) => !event.isDeleted);

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background: "linear-gradient(0deg, rgba(198, 221, 240, 0.25), rgba(198, 221, 240, 0.25))",
      }}
    >
      {/* Top breadcrumb */}
      <div className="w-full border-b border-[#E3E8F4] bg-white">
        <div className="max-w-[1440px] mx-auto px-5 md:px-[60px] pt-3 pb-3">
          <p className="text-[0.875rem] text-(--text-muted) font-medium">
            Admission <span className="mx-1">{">"}</span>{" "}
            <span className="text-(--text-main)">Deadlines</span>
          </p>
        </div>
      </div>

      <div className="bg-[#F3F7FF] w-full min-h-screen">
        <div className="max-w-[1440px] mx-auto px-5 md:px-[60px] py-6 sm:py-10">
          
          <h1 className="text-2xl md:text-3xl font-semibold text-[#0E1629] mb-8">
            Upcoming Deadlines
          </h1>

          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 animate-pulse">
              {Array.from({ length: 8 }).map((_, idx) => (
                <div key={`dl-skeleton-${idx}`} className="h-[160px] md:h-[331px] rounded-[16px] bg-white/80" />
              ))}
            </div>
          )}
          
          {isError && (
            <div className="text-center py-12 space-y-3">
              <p className="text-red-600 text-[0.875rem]">
                {(error as Error)?.message ?? "Could not load deadlines."}
              </p>
              <button
                type="button"
                onClick={() => refetch()}
                className="text-[0.875rem] font-medium text-[#0E1629] underline cursor-pointer"
              >
                Try again
              </button>
            </div>
          )}
          
          {!isLoading && !isError && activeEvents.length === 0 && (
            <p className="text-center text-(--text-muted) py-12 text-[0.875rem]">
              No active deadlines found at the moment.
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {!isLoading && !isError && activeEvents.map((event: EventItem) => (
              <DeadlinePageCard
                key={event.id}
                id={event.id}
                title={event.title}
                deadline={formatDate(event.endDate)}
                description={event.description}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}