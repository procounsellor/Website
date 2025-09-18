import { CourseCard, type CourseCardData } from "@/components/cards/CourseListingCard";
import { useCourses } from "@/hooks/useCourses";
import type { Course } from "@/types/academic";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectGroup, SelectLabel } from "@/components/ui/select";
import { ChevronDown, ChevronRight, Search, X } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import Pagination from "@/components/ui/Pagination";

function adaptApiDataToCardData(apiCourse: Course): CourseCardData {
  return {
    id: apiCourse.id,
    name: apiCourse.name,
    imageUrl: apiCourse.photoUrl,
    type: apiCourse.type,
    duration: `${apiCourse.duration}`,
  };
}

export default function CoursesListingPage() {
  const { courses, loading, error } = useCourses();
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 9;

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)
  const [filterCount, setFilterCount] = useState(0)
  const [selectedSort, setSelectedSort] = useState("popularity")
  const [courseSearch, setCourseSearch] = useState("")

  const [durationFilters, setDurationFilters] = useState<string[]>([])
  const [typeFilters, setTypeFilters] = useState<string[]>([])
  const [levelFilters, setLevelFilters] = useState<string[]>([])
  const [courseFilters, setCourseFilters] = useState<string[]>([])

  const [durationToggle, setDurationToggle] = useState(false)
  const [typeToggle, setTypeToggle] = useState(false)
  const [levelToggle, setLevelToggle] = useState(false)
  const [courseToggle, setCourseToggle] = useState(false)

  const sortTypes = [
    {label:'Popularity', value:'popularity'},
    {label:'Name: A-Z', value:'name-asc'},
    {label:'Name: Z-A', value:'name-desc'},
    {label:'Duration: Short to Long', value:'duration-asc'},
    {label:'Duration: Long to Short', value:'duration-desc'}
  ]

  const durationOptions = useMemo(() => {
    if (!courses) return ['1 Year', '2 Years', '3 Years', '4 Years', '5 Years']
    const allDurations = courses.map(c => c.duration).filter(Boolean) as string[]
    return [...new Set(allDurations)].sort()
  }, [courses])

  const typeOptions = useMemo(() => {
    if (!courses) return ['Engineering', 'Medical', 'Management', 'Arts', 'Science']
    const allTypes = courses.map(c => c.type).filter(Boolean) as string[]
    return [...new Set(allTypes)].sort()
  }, [courses])

  const levelOptions = useMemo(() => {
    if (!courses) return ['Undergraduate', 'Postgraduate', 'Doctorate', 'Diploma']
    const allLevels = courses.map(c => c.level).filter(Boolean) as string[]
    // Normalize level names to avoid duplicates
    const normalizedLevels = allLevels.map(level => {
      if (level.toLowerCase().includes('under') || level.toLowerCase().includes('bachelor') || level.toLowerCase().includes('ug')) {
        return 'Undergraduate'
      }
      if (level.toLowerCase().includes('post') || level.toLowerCase().includes('master') || level.toLowerCase().includes('pg')) {
        return 'Postgraduate'
      }
      if (level.toLowerCase().includes('doctor') || level.toLowerCase().includes('phd')) {
        return 'Doctorate'
      }
      if (level.toLowerCase().includes('diploma') || level.toLowerCase().includes('certificate')) {
        return 'Diploma'
      }
      return level
    })
    return [...new Set(normalizedLevels)].sort()
  }, [courses])

  const courseOptions = useMemo(() => {
    if (!courses) return ['B.Tech', 'M.Tech', 'MBA', 'MBBS', 'B.Com', 'M.Com']
    const allCourses = courses.map(c => c.name).filter(Boolean) as string[]
    return [...new Set(allCourses)].sort()
  }, [courses])

  useEffect(() => {
    setCurrentPage(1);
  }, [durationFilters, typeFilters, levelFilters, courseFilters]);

  useEffect(() => {
    const count = durationFilters.length + typeFilters.length + levelFilters.length + courseFilters.length
    setFilterCount(count)
  }, [durationFilters, typeFilters, levelFilters, courseFilters])

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const toggleDurationFilter = (duration: string) => {
    setDurationFilters(prev => 
      prev.includes(duration) 
        ? prev.filter(d => d !== duration)
        : [...prev, duration]
    )
  }

  const toggleTypeFilter = (type: string) => {
    setTypeFilters(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    )
  }

  const toggleLevelFilter = (level: string) => {
    setLevelFilters(prev => 
      prev.includes(level) 
        ? prev.filter(l => l !== level)
        : [...prev, level]
    )
  }

  const toggleCourseFilter = (course: string) => {
    setCourseFilters(prev => 
      prev.includes(course) 
        ? prev.filter(c => c !== course)
        : [...prev, course]
    )
  }

  const clearAllFilters = () => {
    setDurationFilters([])
    setTypeFilters([])
    setLevelFilters([])
    setCourseFilters([])
    setCourseSearch("")
  }

  const getFilteredAndSortedCourses = () => {
    if (!courses) return []

    const filtered = courses.filter(course => {
      if (durationFilters.length > 0) {
        if (!durationFilters.includes(course.duration)) return false
      }

      if (typeFilters.length > 0) {
        if (!typeFilters.includes(course.type)) return false
      }

      if (levelFilters.length > 0) {
        if (!levelFilters.includes(course.level)) return false
      }

      if (courseFilters.length > 0) {
        if (!courseFilters.includes(course.name)) return false
      }

      if (courseSearch) {
        if (!course.name.toLowerCase().includes(courseSearch.toLowerCase())) return false
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
      case 'duration-asc':
        sorted.sort((a, b) => {
          const aDuration = parseInt(a.duration?.replace(/\D/g, '') || '0')
          const bDuration = parseInt(b.duration?.replace(/\D/g, '') || '0')
          return aDuration - bDuration
        })
        break
      case 'duration-desc':
        sorted.sort((a, b) => {
          const aDuration = parseInt(a.duration?.replace(/\D/g, '') || '0')
          const bDuration = parseInt(b.duration?.replace(/\D/g, '') || '0')
          return bDuration - aDuration
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
      return <div className="text-center text-gray-500">Loading courses...</div>;
    }

    if (error) {
      return <div className="text-center text-red-500">Error: {error}</div>;
    }

    const filteredCourses = getFilteredAndSortedCourses()

    if (filteredCourses.length === 0) {
      return <p>No courses found matching your filters.</p>;
    }

    const totalPages = Math.ceil(filteredCourses.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedCourses = filteredCourses.slice(startIndex, endIndex);

    return (
      <>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {paginatedCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={adaptApiDataToCardData(course)}
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
    <div className="bg-gray-50 pt-20 min-h-screen overflow-x-auto">
      <main className="container mx-auto px-4 py-4">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          <aside className="flex lg:block">
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
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-[#232323]">Sort & Filters</h2>
                  <button
                    onClick={() => setMobileFilterOpen(false)}
                    className="p-2 rounded-full hover:bg-gray-100"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 pb-20">
                  {/* Sort Section */}
                  <div className="flex flex-col gap-[16px] bg-white p-5 w-full rounded-[8px] mb-3">
                    <h3 className="text-[#242645] font-medium">Sort By</h3>
                    <Select value={selectedSort} onValueChange={setSelectedSort}>
                      <SelectTrigger className="w-full h-[44px] border border-[#efefef] bg-white rounded-[8px] px-3">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {sortTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    {/* Duration Filter */}
                    <div className="flex flex-col gap-[16px] bg-white p-5 w-full rounded-[8px]">
                      <div className="flex justify-between text-[#242645]">
                        <p>Duration</p>
                        <button onClick={() => setDurationToggle(!durationToggle)}>
                          {durationToggle ? <ChevronDown className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
                        </button>
                      </div>
                      {durationToggle && (
                        <div className="flex flex-col gap-[16px] text-[#232323]">
                          <hr className="h-px"/>
                          {durationOptions.slice(0, 7).map((duration) => (
                            <div key={duration} className="flex gap-2 items-center">
                              <input
                                type="checkbox"
                                checked={durationFilters.includes(duration)}
                                onChange={() => toggleDurationFilter(duration)}
                                className="w-5 h-5"
                              />
                              <p className="font-medium text-[14px]">{duration}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Stream/Type Filter */}
                    <div className="flex flex-col gap-[16px] bg-white p-5 w-full rounded-[8px]">
                      <div className="flex justify-between text-[#242645]">
                        <p>Stream</p>
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

                    {/* Level Filter */}
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

                    {/* Course Name Filter */}
                    <div className="flex flex-col gap-[16px] bg-white p-5 w-full rounded-[8px]">
                      <div className="flex justify-between text-[#242645]">
                        <p>Courses</p>
                        <button onClick={() => setCourseToggle(!courseToggle)}>
                          {courseToggle ? <ChevronDown className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
                        </button>
                      </div>
                      {courseToggle && (
                        <div className="flex flex-col gap-[16px] text-[#232323]">
                          <hr className="h-px"/>
                          <div className="flex items-center gap-2 px-3 rounded-md w-full h-[40px] border border-[#efefef] bg-white">
                            <Search size={15} className="text-[#343C6A]"/>
                            <input
                              type="text"
                              placeholder="Search Courses"
                              value={courseSearch}
                              onChange={(e) => setCourseSearch(e.target.value)}
                              className="w-full h-full text-sm outline-none bg-transparent placeholder:text-[#232323]"
                            />
                          </div>
                          {courseOptions
                            .filter(course => course && course.toLowerCase().includes(courseSearch.toLowerCase()))
                            .slice(0, courseSearch ? courseOptions.length : 7)
                            .map((course) => (
                            <div key={course} className="flex gap-2 items-center">
                              <input
                                type="checkbox"
                                checked={courseFilters.includes(course)}
                                onChange={() => toggleCourseFilter(course)}
                                className="w-5 h-5"
                              />
                              <p className="font-medium text-[14px]">{course}</p>
                            </div>
                          ))}
                          <hr className="h-px"/>
                          <p className="font-normal text-[14px]">{courseOptions.length} Courses</p>
                          {!courseSearch && courseOptions.length > 7 && (
                            <p className="font-normal text-[12px] text-gray-500">Search to see more options</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer */}
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

            
            <div className={`${mobileFilterOpen ? 'flex' : 'hidden'} lg:flex flex-col gap-6`}>
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

              
              <div className="flex flex-col gap-[16px] bg-white p-5 w-full max-w-[312px] rounded-[8px]">
                <div className="flex justify-between text-[#242645]">
                  <p>Duration</p>
                  {durationToggle ? <ChevronDown className="w-6 h-6" onClick={() => setDurationToggle(!durationToggle)}/> 
                  : <ChevronRight className="w-6 h-6" onClick={() => setDurationToggle(!durationToggle)}/>}
                </div>
                {durationToggle && (
                  <div className="flex flex-col gap-[16px] text-[#232323]">
                    <hr className="h-px"/>
                    {durationOptions.slice(0, 7).map((duration) => (
                      <div key={duration} className="flex gap-2 items-center">
                        <input 
                          type="checkbox" 
                          checked={durationFilters.includes(duration)}
                          onChange={() => toggleDurationFilter(duration)}
                          className="w-5 h-5"
                        />
                        <p className="font-medium text-[14px]">{duration}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              
              <div className="flex flex-col gap-[16px] bg-white p-5 w-full max-w-[312px] rounded-[8px]">
                <div className="flex justify-between text-[#242645]">
                  <p>Stream</p>
                  {typeToggle ? <ChevronDown className="w-6 h-6" onClick={() => setTypeToggle(!typeToggle)}/> 
                  : <ChevronRight className="w-6 h-6" onClick={() => setTypeToggle(!typeToggle)}/>}
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

              
              <div className="flex flex-col gap-[16px] bg-white p-5 w-full max-w-[312px] rounded-[8px]">
                <div className="flex justify-between text-[#242645]">
                  <p>Level</p>
                  {levelToggle ? <ChevronDown className="w-6 h-6" onClick={() => setLevelToggle(!levelToggle)}/> 
                  : <ChevronRight className="w-6 h-6" onClick={() => setLevelToggle(!levelToggle)}/>}
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

              
              <div className="flex flex-col gap-[16px] bg-white p-5 w-full max-w-[312px] rounded-[8px]">
                <div className="flex justify-between text-[#242645]">
                  <p>Courses</p>
                  {courseToggle ? <ChevronDown className="w-6 h-6" onClick={() => setCourseToggle(!courseToggle)}/> 
                  : <ChevronRight className="w-6 h-6" onClick={() => setCourseToggle(!courseToggle)}/>}
                </div>
                {courseToggle && (
                  <div className="flex flex-col gap-[16px] text-[#232323]">
                    <hr className="h-px"/>
                    <div className="flex items-center gap-2 px-3 rounded-md w-[272px] h-[40px] border border-[#efefef] bg-white">
                      <Search size={15} className="text-[#343C6A]"/>
                      <input
                        type="text"
                        placeholder="Search Courses"
                        value={courseSearch}
                        onChange={(e) => setCourseSearch(e.target.value)}
                        className="w-full h-full text-sm outline-none bg-transparent placeholder:text-[#232323]"
                      />
                    </div>
                    {courseOptions
                      .filter(course => course && course.toLowerCase().includes(courseSearch.toLowerCase()))
                      .slice(0, courseSearch ? courseOptions.length : 7)
                      .map((course) => (
                      <div key={course} className="flex gap-2 items-center">
                        <input 
                          type="checkbox" 
                          checked={courseFilters.includes(course)}
                          onChange={() => toggleCourseFilter(course)}
                          className="w-5 h-5"
                        />
                        <p className="font-medium text-[14px]">{course}</p>
                      </div>
                    ))}
                    <hr className="h-px"/>
                    <p className="font-normal text-[14px]">{courseOptions.length} Courses</p>
                    {!courseSearch && courseOptions.length > 7 && (
                      <p className="font-normal text-[12px] text-gray-500">Search to see more options</p>
                    )}
                  </div>
                )}
              </div>

              
              <button
                onClick={clearAllFilters}
                className="w-full max-w-[312px] py-3 border border-gray-300 rounded-lg text-center font-medium text-gray-700 hover:bg-gray-50"
              >
                Clear All Filters
              </button>
            </div>
          </aside>

          <section className="col-span-1 lg:col-span-3">
            <div className="flex justify-between">
              <h1 className="flex flex-col gap-2 mb-6 text-[16px] text-2xl font-bold">Lorem ipsum dolor sit amet.
                <span className="text-[#8C8CA1] font-medium text-[14px] lg:text-[20px]">Filter courses based on your needs.</span>
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
                      {sortTypes.map((type) => (
                        <SelectItem
                          key={type.value}
                          value={type.value} 
                          className="flex justify-between items-center gap-6 px-3 py-2 text-[16px] text-[#525055] cursor-pointer focus:bg-gray-100 hover:bg-gray-50"
                        >
                          {type.label}
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