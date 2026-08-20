import { useQuery } from "@tanstack/react-query";
import CollegeCard from "./CollegeCard";
import { ChevronDown } from "lucide-react";
import { academicApi } from "@/api/academic";
import type { CollegeApiResponse } from "@/types/academic";
import { COLLEGES_SNAPSHOT } from "@/data/contentSnapshot";

// Build-time snapshot seeds the list so the prerendered HTML ships real
// colleges. The API is blocked during prerender and cold-starts in production,
// which is what used to bake "No colleges found" into the crawlable home page.
const SNAPSHOT = COLLEGES_SNAPSHOT as unknown as CollegeApiResponse[];

export default function College() {
  const { data: allColleges = [], isLoading } = useQuery({
    queryKey: ['revamp-colleges'],
    queryFn: () => academicApi.getColleges(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    // initialDataUpdatedAt: 0 marks the seed stale so the client still refetches.
    initialData: SNAPSHOT.length ? SNAPSHOT : undefined,
    initialDataUpdatedAt: 0,
    placeholderData: (previous) => previous,
  });

  const displayColleges = allColleges.slice(0, 4);
  const remainingColleges = allColleges.slice(4);

  // Nothing to show and nothing on the way — render no section at all rather
  // than an empty band. An empty placeholder reads as thin content to crawlers.
  if (!isLoading && displayColleges.length === 0) return null;

  return (
    <div className="bg-[#C6DDF040] w-full py-6 md:py-[60px]">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Header */}
        <div className="flex items-center justify-start gap-[8px] md:gap-2 bg-white px-[12px] md:px-3 py-[4px] md:py-1 rounded-[4px] md:rounded-md mb-6 w-[125px] md:w-fit shrink-0">
          <div className="w-[16px] h-[16px] min-w-[16px] min-h-[16px] md:w-4 md:h-4 bg-[#0E1629] shrink-0" />
          <p className="font-[Poppins] font-semibold text-[12px] md:text-[14px] text-[#0E1629] uppercase tracking-[0.07em] md:tracking-wider leading-none md:leading-normal">
            COLLEGES
          </p>
        </div>
        <p className="font-[Poppins] font-medium text-[12px] md:text-[24px] text-[#0E1629] max-w-[350px] md:max-w-[682px] h-[54px] md:h-auto leading-none md:leading-normal mb-6">
          Browse verified college profiles, compare location and program fit, and shortlist the right institutes for your admission goals.
        </p>

        {isLoading ? (
          <div className="flex flex-col gap-4 md:gap-6 w-full animate-pulse">
            {Array.from({ length: 4 }).map((_, idx) => (
            <div key={`college-skeleton-${idx}`} className="w-full h-[120px] md:h-[144px] rounded-2xl bg-white/80" />
            ))}
          </div>
        ) : (
            <div className="flex flex-col gap-4 md:gap-6 items-center md:items-stretch w-full">
              {displayColleges.map((college: CollegeApiResponse) => (
                <CollegeCard
                  key={college.collegeId}
                  id={college.collegeId}
                  name={college.collegeName}
                  description={`${college.collegeType || 'Institution'} • ${college.collegesLocationCity || 'City'}, ${college.collegesLocationState || 'State'}`}
                  logoUrl={college.logoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(college.collegeName)}&background=F3F4F6&color=374151&size=400`}
                />
              ))}
            </div>
        )}

        {/* "See all" reveals the remaining colleges as the same CollegeCard,
            rather than a separate list in a different visual language.
            <details> keeps every card in the DOM while collapsed, so all the
            college URLs still have an inbound internal link — without it only
            the first four did, and the rest sat in "Discovered - not indexed". */}
        {!isLoading && remainingColleges.length > 0 && (
          <details className="group mt-4 md:mt-6">
            <summary className="flex cursor-pointer list-none items-center justify-center gap-2 rounded-[8px] bg-[#0E1629] px-6 py-3 font-[Poppins] text-[13px] md:text-[14px] font-medium text-white transition-opacity hover:opacity-90 w-fit mx-auto md:mx-0 [&::-webkit-details-marker]:hidden">
              <span className="group-open:hidden">See all {allColleges.length} colleges</span>
              <span className="hidden group-open:inline">Show fewer colleges</span>
              <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
            </summary>
            <div className="flex flex-col gap-4 md:gap-6 items-center md:items-stretch w-full mt-4 md:mt-6">
              {remainingColleges.map((college: CollegeApiResponse) => (
                <CollegeCard
                  key={college.collegeId}
                  id={college.collegeId}
                  name={college.collegeName}
                  description={`${college.collegeType || 'Institution'} • ${college.collegesLocationCity || 'City'}, ${college.collegesLocationState || 'State'}`}
                  logoUrl={college.logoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(college.collegeName)}&background=F3F4F6&color=374151&size=400`}
                />
              ))}
            </div>
          </details>
        )}
      </div>
    </div>
  );
}