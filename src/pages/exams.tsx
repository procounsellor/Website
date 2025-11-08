import { ExamCard, type ExamCardData } from "@/components/cards/ExamListingCard";
import { useExams } from "@/hooks/useExams";
import type { Exam } from "@/types/academic";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectGroup, SelectLabel } from "@/components/ui/select";
import { ChevronDown, ChevronRight, Search, X } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import Pagination from "@/components/ui/Pagination";

function adaptApiDataToCardData(apiExam: Exam): ExamCardData {
  return {
    id: apiExam.id,
    name: apiExam.name,
    imageUrl: apiExam.iconUrl, 
    level: apiExam.level,
    description: "Official exam details, syllabus and important dates where available.", 
  };
}

export default function ExamsListingPage() {
  const ismobile = window.matchMedia("(max:width:1024px)")
  const { exams, loading, error } = useExams();
  
  // Session storage key
  const STORAGE_KEY = 'exams_filters';
  
  // Load initial state from session storage
  const loadFromStorage = () => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error loading from session storage:', e);
    }
    return null;
  };

  const savedState = loadFromStorage();
  
  const [currentPage, setCurrentPage] = useState(savedState?.currentPage || 1);
  const ITEMS_PER_PAGE = ismobile?8:9;

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [filterCount, setFilterCount] = useState(0);
  const [selectedSort, setSelectedSort] = useState(savedState?.selectedSort || "popularity");
  const [examSearch, setExamSearch] = useState("");

  const [levelFilters, setLevelFilters] = useState<string[]>(savedState?.levelFilters || []);
  const [typeFilters, setTypeFilters] = useState<string[]>(savedState?.typeFilters || []);
  const [examFilters, setExamFilters] = useState<string[]>(savedState?.examFilters || []);

  const [levelToggle, setLevelToggle] = useState(false);
  const [typeToggle, setTypeToggle] = useState(false);
  const [examToggle, setExamToggle] = useState(false);

  // Save to session storage whenever filters or pagination changes
  useEffect(() => {
    const stateToSave = {
      currentPage,
      selectedSort,
      levelFilters,
      typeFilters,
      examFilters
    };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
  }, [currentPage, selectedSort, levelFilters, typeFilters, examFilters]);

  const sortOptions = [
    {label:'Most Popular', value:'popularity'},
    {label:'Name: A to Z', value:'name-asc'},
    {label:'Name: Z to A', value:'name-desc'},
    {label:'Level: Undergraduate First', value:'level-undergraduate'},
    {label:'Level: Postgraduate First', value:'level-postgraduate'},
  ]

  const examOptions = useMemo(() => {
    if (!exams) return ['JEE Main', 'SRMJEE', 'WBJEE', 'GATE', 'NEET', 'SUAT']
    const allExams = exams.map(c => c.name).filter(Boolean) as string[]
    return [...new Set(allExams)].sort()
  }, [exams])

  const levelOptions = useMemo(() => {
    if (!exams) return ['Undergraduate', 'Postgraduate']
    const allLevels = exams.map(c => c.level).filter(Boolean) as string[]
    
    
    const normalizedLevels = allLevels.map(level => {
      const lowerLevel = level.toLowerCase()
      if (lowerLevel.includes('under') || lowerLevel.includes('bachelor') || lowerLevel.includes('ug')) {
        return 'Undergraduate'
      }
      if (lowerLevel.includes('post') || lowerLevel.includes('master') || lowerLevel.includes('pg')) {
        return 'Postgraduate'
      }
      return level
    })
    return [...new Set(normalizedLevels)].sort()
  }, [exams])

  const typeOptions = useMemo(() => {
    if (!exams) return ['University', 'State', 'National']
    const allTypes = exams.map(c => c.type).filter(Boolean) as string[]
    
    
    const normalizedTypes = allTypes.map(type => {
      const lowerType = type.toLowerCase()
      if (lowerType.includes('university') || lowerType.includes('varsity')) {
        return 'University'
      }
      if (lowerType.includes('state')) {
        return 'State'
      }
      if (lowerType.includes('national')) {
        return 'National'
      }
      return type
    })
    return [...new Set(normalizedTypes)].sort()
  }, [exams])

  useEffect(() => {
    setCurrentPage(1);
  }, [levelFilters, typeFilters, examFilters]);

  useEffect(() => {
    const count = levelFilters.length + typeFilters.length + examFilters.length
    setFilterCount(count)
  }, [levelFilters, typeFilters, examFilters])

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const toggleLevelFilter = (level: string) => {
    setLevelFilters(prev => 
      prev.includes(level) 
        ? prev.filter(l => l !== level)
        : [...prev, level]
    )
  }

  const toggleTypeFilter = (type: string) => {
    setTypeFilters(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    )
  }

  const toggleExamFilter = (exam: string) => {
    setExamFilters(prev => 
      prev.includes(exam) 
        ? prev.filter(e => e !== exam)
        : [...prev, exam]
    )
  }

  const clearAllFilters = () => {
    setLevelFilters([])
    setTypeFilters([])
    setExamFilters([])
    setExamSearch("")
  }

  const getFilteredAndSortedExams = () => {
    if (!exams) return []

    const filtered = exams.filter(exam => {
      
      if (levelFilters.length > 0) {
        const examLevel = exam.level?.toLowerCase() || ''
        
        const matchesLevel = levelFilters.some(filter => {
          const filterLower = filter.toLowerCase()
          if (filterLower === 'undergraduate') {
            return examLevel.includes('under') || examLevel.includes('bachelor') || examLevel.includes('ug')
          }
          if (filterLower === 'postgraduate') {
            return examLevel.includes('post') || examLevel.includes('master') || examLevel.includes('pg')
          }
          return examLevel.includes(filterLower)
        })
        
        if (!matchesLevel) return false
      }

      
      if (typeFilters.length > 0) {
        const examType = exam.type?.toLowerCase() || ''
        
        const matchesType = typeFilters.some(filter => {
          const filterLower = filter.toLowerCase()
          if (filterLower === 'university') {
            return examType.includes('university') || examType.includes('varsity')
          }
          if (filterLower === 'state') {
            return examType.includes('state')
          }
          if (filterLower === 'national') {
            return examType.includes('national')
          }
          return examType.includes(filterLower)
        })
        
        if (!matchesType) return false
      }

      if (examFilters.length > 0) {
        if (!examFilters.includes(exam.name)) return false
      }

      if (examSearch) {
        if (!exam.name.toLowerCase().includes(examSearch.toLowerCase())) return false
      }

      return true
    })

    const sorted = [...filtered]
    switch (selectedSort) {
      case 'name-asc':
        sorted.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'name-desc':
        sorted.sort((a, b) => b.name.localeCompare(a.name))
        break
      case 'level-undergraduate':
        sorted.sort((a, b) => {
          const getOrder = (exam: Exam) => {
            const level = exam.level?.toLowerCase() || ''
            if (level.includes('under') || level.includes('bachelor') || level.includes('ug')) return 0
            if (level.includes('post') || level.includes('master') || level.includes('pg')) return 1
            return 2
          }
          return getOrder(a) - getOrder(b)
        })
        break
      case 'level-postgraduate':
        sorted.sort((a, b) => {
          const getOrder = (exam: Exam) => {
            const level = exam.level?.toLowerCase() || ''
            if (level.includes('post') || level.includes('master') || level.includes('pg')) return 0
            if (level.includes('under') || level.includes('bachelor') || level.includes('ug')) return 1
            return 2
          }
          return getOrder(a) - getOrder(b)
        })
        break
      case 'type-national':
        sorted.sort((a, b) => {
          const getOrder = (exam: Exam) => {
            const type = exam.type?.toLowerCase() || ''
            if (type.includes('national')) return 0
            if (type.includes('state')) return 1
            if (type.includes('university')) return 2
            return 3
          }
          return getOrder(a) - getOrder(b)
        })
        break
      case 'type-state':
        sorted.sort((a, b) => {
          const getOrder = (exam: Exam) => {
            const type = exam.type?.toLowerCase() || ''
            if (type.includes('state')) return 0
            if (type.includes('national')) return 1
            if (type.includes('university')) return 2
            return 3
          }
          return getOrder(a) - getOrder(b)
        })
        break
      case 'type-university':
        sorted.sort((a, b) => {
          const getOrder = (exam: Exam) => {
            const type = exam.type?.toLowerCase() || ''
            if (type.includes('university')) return 0
            if (type.includes('state')) return 1
            if (type.includes('national')) return 2
            return 3
          }
          return getOrder(a) - getOrder(b)
        })
        break
      case 'popularity':
      default:
        sorted.sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
        break
    }

    return sorted
  }

  const renderContent = () => {
    if (loading) {
      return <div className="text-center text-gray-500">Loading exams...</div>;
    }

    if (error) {
      return <div className="text-center text-red-500">Error: {error}</div>;
    }

    const filteredExams = getFilteredAndSortedExams()

    if (filteredExams.length === 0) {
      return <p>No exams found matching your filters.</p>;
    }

    const totalPages = Math.ceil(filteredExams.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedExams = filteredExams.slice(startIndex, endIndex);

    return (
      <>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {paginatedExams.map((exam) => (
            <ExamCard
              key={exam.id}
              exam={adaptApiDataToCardData(exam)}
            />
          ))}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </>
    );
  };

  return (
    <div className="bg-gray-50 pt-20 min-h-screen">
      <main className="container mx-auto px-4 py-4">
        <div className="flex flex-col lg:flex-row gap-8 lg:items-start">
          <aside className="lg:w-[312px] lg:flex-shrink-0 lg:sticky lg:top-24 lg:self-start">
            <div className="flex justify-center gap-6 items-center px-4 h-14 w-full sm:hidden">
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
              <div className="fixed inset-0 z-50 bg-gray-50 sm:hidden">
                
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-[#232323]">Sort & Filters</h2>
                  <button
                    onClick={() => setMobileFilterOpen(false)}
                    className="p-2 rounded-full hover:bg-gray-100"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                
                <div className="flex-1 overflow-y-auto p-4 pb-20">
                  
                  <div className="flex flex-col gap-[16px] bg-white p-5 w-full rounded-[8px] mb-3">
                    <h3 className="text-[#242645] font-medium">Sort By</h3>
                    <Select value={selectedSort} onValueChange={setSelectedSort}>
                      <SelectTrigger className="w-full h-[44px] border border-[#efefef] bg-white rounded-[8px] px-3">
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

                  <div className="space-y-4">
                    
                    <div className="flex flex-col gap-[16px] bg-white p-5 w-full rounded-[8px]">
                      <div className="flex justify-between text-[#242645]">
                        <p>Level</p>
                        <button onClick={() => setLevelToggle(!levelToggle)}>
                          {levelToggle ? <ChevronDown className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
                        </button>
                      </div>
                      {levelToggle && (
                        <div className="flex flex-col gap-[16px] text-[#232323]">
                          <hr className="h-px"/>
                          {levelOptions.slice(0, 7).map((level) => (
                            <div key={level} className="flex gap-2 items-center">
                              <input
                                type="checkbox"
                                checked={levelFilters.includes(level)}
                                onChange={() => toggleLevelFilter(level)}
                                className="w-5 h-5"
                              />
                              <p className="font-medium text-[14px]">{level}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    
                    <div className="flex flex-col gap-[16px] bg-white p-5 w-full rounded-[8px]">
                      <div className="flex justify-between text-[#242645]">
                        <p>Type</p>
                        <button onClick={() => setTypeToggle(!typeToggle)}>
                          {typeToggle ? <ChevronDown className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
                        </button>
                      </div>
                      {typeToggle && (
                        <div className="flex flex-col gap-[16px] text-[#232323]">
                          <hr className="h-px"/>
                          {typeOptions.slice(0, 7).map((type) => (
                            <div key={type} className="flex gap-2 items-center">
                              <input
                                type="checkbox"
                                checked={typeFilters.includes(type)}
                                onChange={() => toggleTypeFilter(type)}
                                className="w-5 h-5"
                              />
                              <p className="font-medium text-[14px]">{type}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    
                    <div className="flex flex-col gap-[16px] bg-white p-5 w-full rounded-[8px]">
                      <div className="flex justify-between text-[#242645]">
                        <p>Exams</p>
                        <button onClick={() => setExamToggle(!examToggle)}>
                          {examToggle ? <ChevronDown className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
                        </button>
                      </div>
                      {examToggle && (
                        <div className="flex flex-col gap-[16px] text-[#232323]">
                          <hr className="h-px"/>
                          <div className="flex items-center gap-2 px-3 rounded-md w-full h-[40px] border border-[#efefef] bg-white">
                            <Search size={15} className="text-[#343C6A]"/>
                            <input
                              type="text"
                              placeholder="Search Exams"
                              value={examSearch}
                              onChange={(e) => setExamSearch(e.target.value)}
                              className="w-full h-full text-sm outline-none bg-transparent placeholder:text-[#232323]"
                            />
                          </div>
                          {examOptions
                            .filter((exam: string) => exam && exam.toLowerCase().includes(examSearch.toLowerCase()))
                            .slice(0, examSearch ? examOptions.length : 7)
                            .map((exam: string) => (
                            <div key={exam} className="flex gap-2 items-center">
                              <input
                                type="checkbox"
                                checked={examFilters.includes(exam)}
                                onChange={() => toggleExamFilter(exam)}
                                className="w-5 h-5"
                              />
                              <p className="font-medium text-[14px]">{exam}</p>
                            </div>
                          ))}
                          <hr className="h-px"/>
                          <p className="font-normal text-[14px]">{examOptions.length} Exams</p>
                          {!examSearch && examOptions.length > 7 && (
                            <p className="font-normal text-[12px] text-gray-500">Search to see more options</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
                  <div className="flex gap-3">
                    <button
                      onClick={clearAllFilters}
                      className="flex-1 py-3 border border-gray-300 rounded-lg text-center font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Clear All
                    </button>
                    <button
                      onClick={() => setMobileFilterOpen(false)}
                      className="flex-1 py-3 bg-[#13097D] text-white rounded-lg text-center font-medium hover:bg-[#13097D]/90"
                    >
                      Apply ({filterCount})
                    </button>
                  </div>
                </div>
              </div>
            )}

            
            <div className={`${mobileFilterOpen ? 'flex' : 'hidden'} lg:flex flex-col gap-6 w-full max-h-[calc(100vh-7rem)] overflow-y-auto scrollbar-hide`}>
              <div className="flex justify-between w-full h-full max-w-[312px] max-h-[88px] 
                p-5 bg-white border-[1px] border-[#E6E6E6] rounded-[8px]"
              >
                <h2 className="flex gap-2">
                  <img src="./filter.svg" alt="filter_icon" 
                  className="w-6 h-6 text-[#13097D]"
                  />
                  Filters
                </h2>
                <div className="bg-[#13097D] text-white w-7 h-7 flex items-center justify-center rounded-[4px]">{filterCount}</div>
              </div>

              
              <div className="flex flex-col gap-[16px] bg-white p-5 w-full max-w-[312px] rounded-[8px] border-[1px] border-[#E6E6E6]">
                <div 
                  className="flex justify-between text-[#242645] cursor-pointer"
                  onClick={() => setLevelToggle(!levelToggle)}
                >
                  <div className="flex items-center gap-2">
                    <p>Level</p>
                    {levelFilters.length > 0 && (
                      <div className="w-2 h-2 bg-[#13097D] rounded-full"></div>
                    )}
                  </div>
                  {levelToggle ? <ChevronDown className="w-6 h-6"/> 
                  : <ChevronRight className="w-6 h-6"/>}
                </div>
                {levelToggle && (
                  <div className="flex flex-col gap-[16px] text-[#232323]">
                    <hr className="h-px"/>
                    {levelOptions.slice(0, 7).map((level) => (
                      <div key={level} className="flex gap-2 items-center">
                        <input 
                          type="checkbox" 
                          checked={levelFilters.includes(level)}
                          onChange={() => toggleLevelFilter(level)}
                          className="w-5 h-5 cursor-pointer"
                        />
                        <p className="font-medium text-[14px]">{level}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              
              <div className="flex flex-col gap-[16px] bg-white p-5 w-full max-w-[312px] rounded-[8px] border-[1px] border-[#E6E6E6]">
                <div 
                  className="flex justify-between text-[#242645] cursor-pointer"
                  onClick={() => setTypeToggle(!typeToggle)}
                >
                  <div className="flex items-center gap-2">
                    <p>Type</p>
                    {typeFilters.length > 0 && (
                      <div className="w-2 h-2 bg-[#13097D] rounded-full"></div>
                    )}
                  </div>
                  {typeToggle ? <ChevronDown className="w-6 h-6"/> 
                  : <ChevronRight className="w-6 h-6"/>}
                </div>
                {typeToggle && (
                  <div className="flex flex-col gap-[16px] text-[#232323]">
                    <hr className="h-px"/>
                    {typeOptions.slice(0, 7).map((type) => (
                      <div key={type} className="flex gap-2 items-center">
                        <input 
                          type="checkbox" 
                          checked={typeFilters.includes(type)}
                          onChange={() => toggleTypeFilter(type)}
                          className="w-5 h-5 cursor-pointer"
                        />
                        <p className="font-medium text-[14px] truncate max-w-[14.5rem]">{type}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              
              <div className="flex flex-col gap-[16px] bg-white p-5 w-full max-w-[312px] rounded-[8px] border-[1px] border-[#E6E6E6]">
                <div 
                  className="flex justify-between text-[#242645] cursor-pointer"
                  onClick={() => setExamToggle(!examToggle)}
                >
                  <div className="flex items-center gap-2">
                    <p>Exams</p>
                    {examFilters.length > 0 && (
                      <div className="w-2 h-2 bg-[#13097D] rounded-full"></div>
                    )}
                  </div>
                  {examToggle ? <ChevronDown className="w-6 h-6"/> 
                  : <ChevronRight className="w-6 h-6"/>}
                </div>
                {examToggle && (
                  <div className="flex flex-col gap-[16px] text-[#232323]">
                    <hr className="h-px"/>
                    <div className="flex items-center gap-2 px-3 rounded-md w-[272px] h-[40px] border border-[#efefef] bg-white">
                      <Search size={15} className="text-[#343C6A]"/>
                      <input
                        type="text"
                        placeholder="Search Exams"
                        value={examSearch}
                        onChange={(e) => setExamSearch(e.target.value)}
                        className="w-full h-full text-sm outline-none bg-transparent placeholder:text-[#232323]"
                      />
                    </div>
                    {examOptions
                      .filter((exam: string) => exam && exam.toLowerCase().includes(examSearch.toLowerCase()))
                      .slice(0, examSearch ? examOptions.length : 7)
                      .map((exam: string) => (
                      <div key={exam} className="flex gap-2 items-center">
                        <input 
                          type="checkbox" 
                          checked={examFilters.includes(exam)}
                          onChange={() => toggleExamFilter(exam)}
                          className="w-5 h-5 cursor-pointer"
                        />
                        <p className="font-medium text-[14px]">{exam}</p>
                      </div>
                    ))}
                    <hr className="h-px"/>
                    <p className="font-normal text-[14px]">{examOptions.length} Exams</p>
                    {!examSearch && examOptions.length > 7 && (
                      <p className="font-normal text-[12px] text-gray-500">Search to see more options</p>
                    )}
                  </div>
                )}
              </div>

              
              <button
                onClick={clearAllFilters}
                className="w-full max-w-[312px] py-3 border border-gray-300 rounded-lg text-center font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                Clear All Filters
              </button>
            </div>
          </aside>

          <section className="flex-1 lg:min-w-0">
            <div className="flex justify-between">
              <h1 className="flex flex-col gap-2 mb-6 text-[16px] text-2xl font-bold">Explore entrance exams across India.
                  <span className="text-[#8C8CA1] font-medium text-[14px] lg:text-[20px]">Compare levels, types and preparation resources to plan effectively.</span>
                </h1>

              
              <div className="hidden sm:flex items-center gap-3">
                <p className="font-medium text-[16px] text-[#525055]">Sort By:</p>
                <Select value={selectedSort} onValueChange={setSelectedSort}>
                  <SelectTrigger className="w-[220px] h-[44px] border border-[#efefef] bg-white rounded-[8px] px-3 text-[16px] text-[#333] justify-between">
                    <SelectValue placeholder="Popularity" className="text-[#525055] text-[16px]"/>
                  </SelectTrigger>
                  <SelectContent
                    className="w-[220px] bg-white border border-[#efefef] rounded-[8px] shadow-lg z-[100] max-h-[200px] overflow-y-auto"
                    position="popper"
                    sideOffset={4}
                  >
                    <SelectGroup>
                      <SelectLabel className="px-3 py-1 text-xs text-gray-400">
                        Sort Options
                      </SelectLabel>
                      {sortOptions.map((option) => (
                        <SelectItem
                          key={option.value}
                          value={option.value} 
                          className="flex justify-between items-center gap-6 px-3 py-2 text-[16px] text-[#525055] cursor-pointer focus:bg-gray-100 hover:bg-gray-50"
                        >
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