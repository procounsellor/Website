import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import FancyCard from "./DeadlinesCard";
import { SeeAllButton } from "../components/LeftRightButton";
import { getDeadlines, type EventItem } from "@/api/deadlines"; // Adjust path as needed

export default function CollegeSection() {
  // Fetch deadlines using TanStack Query
  const { data: allEvents = [], isLoading, isError } = useQuery({
    queryKey: ['revamp-deadlines'],
    queryFn: () => getDeadlines(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  // Filter out any items marked as deleted
  const activeEvents = allEvents.filter((event: EventItem) => !event.isDeleted);
  
  // ONLY GRAB THE FIRST 4 EVENTS
  const displayEvents = activeEvents.slice(0, 4);

  // Helper function to format "YYYY-MM-DD" into "Month DD, YYYY"
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', // Changed to short to save space based on your screenshot
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="bg-[#C6DDF040] w-full py-6 md:py-[60px]">
      <div className="max-w-[1440px] mx-auto px-4 md:px-[60px]">
        
        {/* Mobile Header */}
        <div className="md:hidden flex flex-col items-start justify-start gap-[12px] mb-6">
          <div className="flex items-center justify-center gap-[8px] bg-white px-[12px] py-[4px] rounded-[4px] w-[125px] h-[26px] shrink-0">
            <div className="w-[16px] h-[16px] min-w-[16px] min-h-[16px] bg-[#0E1629] shrink-0" />
            <p className="font-[Poppins] font-semibold text-[12px] text-[#0E1629] uppercase tracking-[0.07em] leading-none">
              DEADLINES
            </p>
          </div>
          <p className="font-[Poppins] font-medium text-[12px] text-[#0E1629] max-w-[350px] h-[54px] leading-none">
            Discover curated programs across mental wellness, assessments,
            admissions, and upskilling led by experienced professionals, built
            around your needs.
          </p>
        </div>

        {/* Desktop Header */}
        <div className="hidden md:flex justify-between mb-8">
          <div className="flex items-start">
            <img src="/deadlines.svg" alt="icon_avg" className="items-start" />
          </div>

          <h1 className="text-(--text-main) text-2xl font-medium max-w-[682px]">
            Discover curated programs across mental wellness, assessments,
            admissions, and upskilling led by experienced professionals, built
            around your needs.
          </h1>
        </div>

        {/* Loading, Error, and Empty States */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[300px] gap-3">
            <Loader2 className="animate-spin h-8 w-8 text-[#0E1629]" />
            <p className="font-[Poppins] text-[14px] text-[#6B7280]">Loading deadlines...</p>
          </div>
        ) : isError ? (
          <div className="flex justify-center min-h-[300px] items-center">
            <p className="font-[Poppins] text-[14px] text-red-500">Failed to load deadlines</p>
          </div>
        ) : displayEvents.length === 0 ? (
          <div className="flex justify-center min-h-[300px] items-center">
            <p className="font-[Poppins] text-[14px] text-[#6B7280]">No active deadlines found</p>
          </div>
        ) : (
          /* Dynamic Data Render */
          <div className="flex gap-[12px] md:gap-6 mb-6 md:mb-8 overflow-x-auto flex-nowrap md:flex-wrap md:overflow-visible justify-start md:justify-center [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-2">
            {displayEvents.map((event: EventItem, index: number) => (
              <div key={event.id} className="shrink-0">
                <FancyCard
                  examName={event.title}
                  deadline={formatDate(event.endDate)} // Using endDate as the deadline display
                  details={event.description}
                  isWhite={index % 2 === 0}
                />
              </div>
            ))}
          </div>
        )}

        {/* See All Button */}
        <div className="flex justify-end mt-4 md:mt-0 pb-4 md:pb-0 w-full">
          <div className="scale-[0.85] md:scale-100 origin-center md:origin-right">
            <SeeAllButton
              text="See all"
              onClick={() => console.log('see all')}
            />
          </div>
        </div>

      </div>
    </div>
  );
}