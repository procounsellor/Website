import { ExamCard, type ExamCardData } from "@/components/cards/ExamListingCard";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectGroup, SelectLabel } from "@/components/ui/select";
import { ChevronDown, ChevronRight, Search, X, Loader2 } from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";
import { academicApi } from "@/api/academic";

function adaptApiDataToCardData(apiExam: any): ExamCardData {
  return {
    id: apiExam.examId || apiExam.id, 
    name: apiExam.examName || apiExam.name,
    imageUrl: apiExam.iconUrl, 
    level: apiExam.examLevel || apiExam.level,
    description: "Official exam details, syllabus and important dates where available.", 
  };
}

export default function ExamsListingPage() {
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingMore, setFetchingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);
  
  const ITEMS_PER_PAGE = 9;

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [filterCount, setFilterCount] = useState(0);
  const [selectedSort, setSelectedSort] = useState("popularity");
  
  const [examSearch, setExamSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(""); 

  const [levelFilters, setLevelFilters] = useState<string[]>([]);
  const [typeFilters, setTypeFilters] = useState<string[]>([]);

  const [levelToggle, setLevelToggle] = useState(true);
  const [typeToggle, setTypeToggle] = useState(true);
  const [examToggle, setExamToggle] = useState(true);

  const levelOptions = ['National', 'State', 'University', 'Institute', 'International'];
  const typeOptions = [
    'Undergraduate Entrance Exam', 
    'Postgraduate Entrance Exam', 
    'Undergraduate and Postgraduate Entrance Exam',
    'Diploma Entrance Exam'
  ];

  const sortOptions = [
    {label:'Most Popular', value:'popularity'},
    {label:'Name: A to Z', value:'name-asc'},
    {label:'Name: Z to A', value:'name-desc'},
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(examSearch);
    }, 800);
    return () => clearTimeout(timer);
  }, [examSearch]);

  useEffect(() => {
    setPage(0);
    setHasMore(true);
    setExams([]); 
  }, [debouncedSearch, levelFilters, typeFilters, selectedSort]);

  // --- API FETCH ---
  const fetchExams = useCallback(async (isLoadMore: boolean) => {
    if (isLoadMore) {
      setFetchingMore(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      let sortBy = 'popularityCount';
      let sortOrder = 'desc';

      if (selectedSort === 'name-asc') {
        sortBy = 'examName';
        sortOrder = 'asc';
      } else if (selectedSort === 'name-desc') {
        sortBy = 'examName';
        sortOrder = 'desc';
      }

      const filters = {
        search: debouncedSearch,
        level: levelFilters.join(','),
        type: typeFilters.join(','),
        sortBy,
        sortOrder
      };

      const response = await academicApi.searchExams(filters, page, ITEMS_PER_PAGE);
      
      const newExams = response.exams || [];
      const totalItems = response.total || 0;

      setExams(prev => {
        if (isLoadMore) {
          const existingIds = new Set(prev.map(e => e.examId || e.id));
          const uniqueNew = newExams.filter((e: any) => !existingIds.has(e.examId || e.id));
          return [...prev, ...uniqueNew];
        } else {
          return newExams;
        }
      });

      if (newExams.length < ITEMS_PER_PAGE || (page + 1) * ITEMS_PER_PAGE >= totalItems) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }

    } catch (err) {
      console.error("Exam search error:", err);
      setError("Failed to load exams. Please try again.");
    } finally {
      setLoading(false);
      setFetchingMore(false);
    }
  }, [page, debouncedSearch, levelFilters, typeFilters, selectedSort]);

  useEffect(() => {
    const isLoadMore = page > 0;
    fetchExams(isLoadMore);
  }, [fetchExams, page]);

  const lastExamRef = useCallback((node: HTMLDivElement | null) => {
    if (loading || fetchingMore) return;
    
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    
    if (node) observer.current.observe(node);
  }, [loading, fetchingMore, hasMore]);

  useEffect(() => {
    const count = levelFilters.length + typeFilters.length + (debouncedSearch ? 1 : 0);
    setFilterCount(count);
  }, [levelFilters, typeFilters, debouncedSearch]);

  const toggleLevelFilter = (level: string) => {
    setLevelFilters(prev => 
      prev.includes(level) ? prev.filter(l => l !== level) : [...prev, level]
    )
  }

  const toggleTypeFilter = (type: string) => {
    setTypeFilters(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    )
  }

  const clearAllFilters = () => {
    setLevelFilters([])
    setTypeFilters([])
    setExamSearch("")
    setDebouncedSearch("")
    setPage(0)
  }

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin h-8 w-8 text-[#13097D]" />
        </div>
      );
    }

    if (error) {
      return <div className="text-center text-red-500 py-10">{error}</div>;
    }

    if (exams.length === 0) {
      return <p className="text-center text-gray-500 py-10">No exams found matching your filters.</p>;
    }

    return (
      <>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {exams.map((exam, index) => {
            if (index === exams.length - 1) {
              return (
                <div key={exam.examId || exam.id} ref={lastExamRef}>
                  <ExamCard exam={adaptApiDataToCardData(exam)} />
                </div>
              );
            }
            return (
              <ExamCard key={exam.examId || exam.id} exam={adaptApiDataToCardData(exam)} />
            );
          })}
        </div>

        {fetchingMore && (
           <div className="flex justify-center py-6 w-full">
             <Loader2 className="animate-spin h-6 w-6 text-[#13097D]" />
           </div>
        )}
        
        {!hasMore && exams.length > 0 && (
            <div className="text-center py-8 text-gray-500 font-medium">
              You have reached the end
            </div>
        )}
      </>
    );
  };

  const renderFilters = () => (
    <>
      {/* Search Filter */}
      <div className="flex flex-col gap-4 bg-white p-5 w-full rounded-xl border border-[#E6E6E6]">
        <div className="flex justify-between text-[#242645] cursor-pointer" onClick={() => setExamToggle(!examToggle)}>
          <div className="flex items-center gap-2">
            <p>Search Exams</p>
            {examSearch && <div className="w-2 h-2 bg-[#13097D] rounded-full"></div>}
          </div>
          {examToggle ? <ChevronDown className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
        </div>
        {examToggle && (
          <div className="flex flex-col gap-4 text-[#232323]">
            <hr className="h-px"/>
            <div className="flex items-center gap-2 px-3 rounded-md w-full h-10 border border-[#efefef] bg-white">
              <Search size={15} className="text-[#343C6A]"/>
              <input
                type="text"
                placeholder="Search by name..."
                value={examSearch}
                onChange={(e) => setExamSearch(e.target.value)}
                className="w-full h-full text-sm outline-none bg-transparent placeholder:text-[#232323]"
              />
            </div>
          </div>
        )}
      </div>

      {/* Level Filter */}
      <div className="flex flex-col gap-4 bg-white p-5 w-full rounded-xl border border-[#E6E6E6]">
        <div className="flex justify-between text-[#242645] cursor-pointer" onClick={() => setLevelToggle(!levelToggle)}>
          <div className="flex items-center gap-2">
            <p>Level</p>
            {levelFilters.length > 0 && <div className="w-2 h-2 bg-[#13097D] rounded-full"></div>}
          </div>
          {levelToggle ? <ChevronDown className="w-6 h-6"/> : <ChevronRight className="w-6 h-6"/>}
        </div>
        {levelToggle && (
          <div className="flex flex-col gap-4 text-[#232323]">
            <hr className="h-px"/>
            {levelOptions.map((level) => (
              <div key={level} className="flex gap-2 items-center cursor-pointer" onClick={() => toggleLevelFilter(level)}>
                <input 
                  type="checkbox" 
                  checked={levelFilters.includes(level)}
                  readOnly
                  className="w-5 h-5 pointer-events-none"
                />
                <p className="font-medium text-[14px]">{level}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Type Filter */}
      <div className="flex flex-col gap-4 bg-white p-5 w-full rounded-xl border border-[#E6E6E6]">
        <div className="flex justify-between text-[#242645] cursor-pointer" onClick={() => setTypeToggle(!typeToggle)}>
          <div className="flex items-center gap-2">
            <p>Type</p>
            {typeFilters.length > 0 && <div className="w-2 h-2 bg-[#13097D] rounded-full"></div>}
          </div>
          {typeToggle ? <ChevronDown className="w-6 h-6"/> : <ChevronRight className="w-6 h-6"/>}
        </div>
        {typeToggle && (
          <div className="flex flex-col gap-4 text-[#232323]">
            <hr className="h-px"/>
            {typeOptions.map((type) => (
              <div key={type} className="flex gap-2 items-center cursor-pointer" onClick={() => toggleTypeFilter(type)}>
                <input 
                  type="checkbox" 
                  checked={typeFilters.includes(type)}
                  readOnly
                  className="w-5 h-5 pointer-events-none"
                />
                <p className="font-medium text-[14px]">{type}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );

  return (
    <div className="bg-gray-50 pt-20 min-h-screen">
      <main className="container mx-auto px-4 py-4">
        <div className="flex flex-col lg:flex-row gap-8 lg:items-start">
          
          {/* SIDEBAR (Desktop) */}
          <aside className="lg:w-[312px] lg:shrink-0 lg:sticky lg:top-24 lg:self-start hidden lg:block">
            <div className="flex flex-col gap-6 w-full max-h-[calc(100vh-7rem)] overflow-y-auto scrollbar-hide">
              <div className="flex justify-between w-full h-full max-w-[312px] max-h-[88px] p-5 bg-white border border-[#E6E6E6] rounded-xl">
                <h2 className="flex gap-2">
                  <img src="./filter.svg" alt="filter_icon" className="w-6 h-6 text-[#13097D]" />
                  Filters
                </h2>
                <div className="bg-[#13097D] text-white w-7 h-7 flex items-center justify-center rounded-lg">{filterCount}</div>
              </div>
              
              {renderFilters()}

              <button
                onClick={clearAllFilters}
                className="w-full max-w-[312px] py-3 border border-gray-300 rounded-lg text-center font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                Clear All Filters
              </button>
            </div>
          </aside>

          {/* MOBILE FILTER HEADER & MODAL */}
          <div className="lg:hidden">
            <div className="flex justify-center gap-6 items-center px-4 h-14 w-full">
              <div className="text-[#13097D] text-[16px] flex items-center gap-2">
                <img src="./filter.svg" alt="filter_icon" className="w-6 h-6" />
                <button onClick={() => setMobileFilterOpen(true)}>
                  Sort & Filters
                  {filterCount > 0 && (
                    <span className="ml-2 bg-[#13097D] text-white text-xs px-2 py-1 rounded-full">
                      {filterCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {mobileFilterOpen && (
              <div className="fixed inset-0 z-50 bg-gray-50">
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-[#232323]">Sort & Filters</h2>
                  <button onClick={() => setMobileFilterOpen(false)} className="p-2 rounded-full hover:bg-gray-100">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 pb-20 h-[calc(100vh-140px)]">
                  <div className="flex flex-col gap-4 bg-white p-5 w-full rounded-xl mb-3">
                    <h3 className="text-[#242645] font-medium">Sort By</h3>
                    <Select value={selectedSort} onValueChange={setSelectedSort}>
                      <SelectTrigger className="w-full h-11 border border-[#efefef] bg-white rounded-xl px-3">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {sortOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex flex-col gap-4">
                    {renderFilters()}
                  </div>
                </div>

                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
                  <div className="flex gap-3">
                    <button onClick={clearAllFilters} className="flex-1 py-3 border border-gray-300 rounded-lg text-center font-medium text-gray-700 hover:bg-gray-50">
                      Clear All
                    </button>
                    <button onClick={() => setMobileFilterOpen(false)} className="flex-1 py-3 bg-[#13097D] text-white rounded-lg text-center font-medium hover:bg-[#13097D]/90">
                      Apply ({filterCount})
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* MAIN CONTENT AREA */}
          <section className="flex-1 lg:min-w-0">
            <div className="flex justify-between">
              <h1 className="flex flex-col gap-2 mb-6 text-[16px] text-2xl font-bold">Explore entrance exams across India.
                  <span className="text-[#8C8CA1] font-medium text-[14px] lg:text-[20px]">Compare levels, types and preparation resources to plan effectively.</span>
                </h1>

              <div className="hidden sm:flex items-center gap-3">
                <p className="font-medium text-[16px] text-[#525055]">Sort By:</p>
                <Select value={selectedSort} onValueChange={setSelectedSort}>
                  <SelectTrigger className="w-[220px] h-11 border border-[#efefef] bg-white rounded-xl px-3 text-[16px] text-[#333] justify-between hover:cursor-pointer">
                    <SelectValue placeholder="Popularity" className="text-[#525055] text-[16px]"/>
                  </SelectTrigger>
                  <SelectContent className="w-[220px] bg-white border border-[#efefef] rounded-xl shadow-lg z-100 max-h-[200px] overflow-y-auto">
                    <SelectGroup className="hover:cursor-pointer">
                      <SelectLabel className="px-3 py-1 text-xs text-gray-400">Sort Options</SelectLabel>
                      {sortOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value} className="cursor-pointer">
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {renderContent()}
          </section>
        </div>
      </main>
    </div>
  );
}