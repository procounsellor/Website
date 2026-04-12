import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getDeadlines, type EventItem } from "@/api/deadlines";
import { useNavigate } from "react-router-dom";
import { Search, ChevronDown, SlidersHorizontal, X } from "lucide-react";

import DeadlinesCard from "@/components/Revamp/admissions/DeadlinesCard"; 
import DeadlineFilters from "@/components/Revamp/deadlinePage/DeadlineFilters";

export default function DeadlinesPage() {
  const navigate = useNavigate();

  // Filter & Search States (UI Only for now)
  const [searchInput, setSearchInput] = useState("");
  const [selectedSort, _setSelectedSort] = useState("Recommended");
  const [selectedTypes, setSelectedTypes] = useState<string[]>(["exam"]);
  const [feesRange, setFeesRange] = useState<number>(0);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

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
    return new Date(dateString).toLocaleDateString('en-US', options).toUpperCase();
  };

  const handleClearFilters = () => {
    setSelectedTypes([]);
    setFeesRange(0);
  };

  return (
    <div className="min-h-screen bg-[#F3F7FF] font-[Poppins]">
      {/* Top breadcrumb */}
      <div className="w-full border-b border-[#E3E8F4] bg-white">
        <div className="max-w-[1440px] mx-auto px-5 md:px-[60px] py-4">
          <p className="text-[0.875rem] text-[#6B7280] font-medium flex items-center">
            <button
              type="button"
              onClick={() => navigate("/admissions")}
              className="hover:text-[#0E1629] transition-colors cursor-pointer"
            >
              Admission
            </button>
            <span className="mx-3">{">"}</span>{" "}
            <span className="text-[#0E1629] font-semibold">Deadlines</span>
          </p>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-3 sm:px-5 md:px-[60px] py-6 sm:py-8">
        
        {/* Mobile Filter Button */}
        <div 
            className="lg:hidden flex flex-row items-center justify-between mb-4 bg-white p-3 rounded-lg shadow-sm border border-[#E3E8F4] cursor-pointer" 
            onClick={() => setIsMobileFilterOpen(true)}
        >
            <div className="flex items-center gap-2 text-[#0E1629] font-medium text-[15px]">
                <SlidersHorizontal size={20} className="text-[#0E1629]" />
                Filters
            </div>
            {(selectedTypes.length > 0 || feesRange > 0) && (
                <div className="bg-[#0E1629] text-white text-[12px] font-semibold px-2 py-0.5 rounded-[4px] font-[Arial]">
                    {selectedTypes.length + (feesRange > 0 ? 1 : 0)}
                </div>
            )}
        </div>

        <div className="flex flex-col lg:flex-row items-start gap-6 lg:gap-8 relative">
          
          {/* Left Sidebar - Filters (Desktop) */}
          <div className="hidden lg:block w-[280px] xl:w-[312px] flex-shrink-0 sticky top-6">
             <DeadlineFilters 
                selectedTypes={selectedTypes}
                setSelectedTypes={setSelectedTypes}
                feesRange={feesRange}
                setFeesRange={setFeesRange}
                onClearFilters={handleClearFilters}
             />
          </div>

          {/* Main Content Area */}
          <div className="flex-grow w-full lg:min-w-0 flex flex-col gap-6">
             
             {/* Top Action Bar */}
             <div className="w-full bg-white border border-[#E3E8F4] rounded-[8px] px-5 h-[72px] flex items-center justify-between shadow-sm">
                <h1 className="text-[20px] font-semibold text-[#0E1629] hidden sm:block">
                  Deadlines
                </h1>
                
                <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                   {/* Search Input */}
                   <div className="flex items-center gap-2 border border-[#E3E8F4] rounded-full px-4 py-2 w-full sm:w-[260px] lg:w-[320px] bg-white transition-colors focus-within:border-[#0E1629]">
                      <Search className="w-4 h-4 text-[#6B7280]" />
                      <input 
                         type="text" 
                         placeholder="Search for deadlines"
                         value={searchInput}
                         onChange={(e) => setSearchInput(e.target.value)}
                         className="bg-transparent outline-none text-[14px] text-[#0E1629] placeholder-[#6B7280] w-full"
                      />
                   </div>

                   {/* Sort Dropdown */}
                   <div className="hidden md:flex items-center gap-2 cursor-pointer">
                      <span className="text-[14px] font-medium text-[#6B7280]">Sort by:</span>
                      <div className="flex items-center gap-1">
                         <span className="text-[14px] font-medium text-[#0E1629]">{selectedSort}</span>
                         <ChevronDown className="w-4 h-4 text-[#0E1629]" />
                      </div>
                   </div>
                </div>
             </div>

             {/* States: Loading, Error, Empty */}
             {isLoading && (
              <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-6 animate-pulse">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <div key={`dl-skeleton-${idx}`} className="h-[220px] md:h-[322px] w-full rounded-[16px] bg-white/80" />
                ))}
              </div>
            )}
            
            {isError && (
              <div className="text-center py-12 space-y-3 bg-white rounded-[8px] border border-[#E3E8F4]">
                <p className="text-red-600 text-[14px] font-medium">
                  {(error as Error)?.message ?? "Could not load deadlines."}
                </p>
                <button
                  type="button"
                  onClick={() => refetch()}
                  className="text-[14px] font-semibold text-[#0E1629] underline cursor-pointer"
                >
                  Try again
                </button>
              </div>
            )}
            
            {!isLoading && !isError && activeEvents.length === 0 && (
              <div className="text-center py-12 bg-white rounded-[8px] border border-[#E3E8F4]">
                 <p className="text-[#6B7280] text-[14px] font-medium">
                   No active deadlines found at the moment.
                 </p>
              </div>
            )}

            {/* Grid of Cards (Exactly 3 columns on large screens, 2 on mobile) */}
            {!isLoading && !isError && activeEvents.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-6 w-full">
                {activeEvents.map((event: EventItem, index: number) => (
                  <div key={event.id} className="w-full flex justify-center">
                     <DeadlinesCard
                        id={event.id}
                        examName={event.title}
                        deadline={formatDate(event.endDate)}
                        details={event.description}
                        isWhite={index % 2 === 0} // Matches the white/gray alternating pattern
                     />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Modal */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-[100] bg-gray-50 lg:hidden flex flex-col">
            <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200 shadow-sm z-10">
                <h2 className="text-[18px] font-semibold text-[#0E1629] font-[Poppins]">Sort & Filters</h2>
                <button onClick={() => setIsMobileFilterOpen(false)} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <X className="h-6 w-6 text-[#242645]" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 pb-28">
               <DeadlineFilters 
                  selectedTypes={selectedTypes}
                  setSelectedTypes={setSelectedTypes}
                  feesRange={feesRange}
                  setFeesRange={setFeesRange}
                  onClearFilters={handleClearFilters}
               />
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 flex gap-3 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-10">
                <button 
                    onClick={handleClearFilters} 
                    disabled={selectedTypes.length === 0 && feesRange === 0}
                    className={`flex-1 py-3 rounded-[8px] font-[Poppins] font-medium transition-colors border ${selectedTypes.length > 0 || feesRange > 0 ? 'bg-white border-[#0E1629] text-[#0E1629]' : 'bg-[#F9F9F9] border-[#E6E6E6] text-[#A0A0A0]'}`}
                >
                    Clear All
                </button>
                <button 
                    onClick={() => setIsMobileFilterOpen(false)} 
                    className="flex-1 py-3 bg-[#0E1629] text-white rounded-[8px] font-[Poppins] font-medium"
                >
                    Apply Filters
                </button>
            </div>
        </div>
      )}
    </div>
  );
}