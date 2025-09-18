import { CollegeCard, type CollegeCardData } from "@/components/cards/CollegeListingCard";
import { useColleges } from "@/hooks/useColleges";
import type { College } from "@/types/academic";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectGroup, SelectLabel } from "@/components/ui/select";
import { ChevronDown, ChevronRight, Search, X } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import Pagination from "@/components/ui/Pagination";

function adaptApiDataToCardData(apiCollege: College): CollegeCardData {
  return {
    id: apiCollege.id,
    name: apiCollege.name,
    imageUrl: apiCollege.logoUrl, 
    city: apiCollege.city,
    type: apiCollege.type,
  };
}

export default function CollegesListingPage() {
  const { colleges, loading, error } = useColleges();
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 9;

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)
  const [filterCount, setFilterCount] = useState(0)
  const [selectedSort, setSelectedSort] = useState("popularity")
  const [citySearch, setCitySearch] = useState("")
  const [stateSearch, setStateSearch] = useState("")

  const [cityFilters, setCityFilters] = useState<string[]>([])
  const [stateFilters, setStateFilters] = useState<string[]>([])
  const [typeFilters, setTypeFilters] = useState<string[]>([])

  const [cityToggle, setCityToggle] = useState(false)
  const [stateToggle, setStateToggle] = useState(false)
  const [typeToggle, setTypeToggle] = useState(false)

  const sortTypes = [
    {label:'Popularity', value:'popularity'},
    {label:'Name: A-Z', value:'name-asc'},
    {label:'Name: Z-A', value:'name-desc'},
    {label:'Established: Newest', value:'year-desc'},
    {label:'Established: Oldest', value:'year-asc'}
  ]

  const cityOptions = useMemo(() => {
    if (!colleges) return ['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Pune', 'Hyderabad']
    const allCities = colleges.map(c => c.city).filter(Boolean) as string[]
    return [...new Set(allCities)].sort()
  }, [colleges])

  const stateOptions = useMemo(() => {
    if (!colleges) return ['Delhi', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Telangana']
    const allStates = colleges.map(c => c.state).filter(Boolean) as string[]
    return [...new Set(allStates)].sort()
  }, [colleges])

  const typeOptions = useMemo(() => {
    if (!colleges) return ['Private', 'Government', 'Deemed']
    const allTypes = colleges.map(c => c.type).filter(Boolean) as string[]
    return [...new Set(allTypes)].sort()
  }, [colleges])

  useEffect(() => {
    setCurrentPage(1);
  }, [cityFilters, stateFilters, typeFilters]);

  useEffect(() => {
    const count = cityFilters.length + stateFilters.length + typeFilters.length
    setFilterCount(count)
  }, [cityFilters, stateFilters, typeFilters])

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const toggleCityFilter = (city: string) => {
    setCityFilters(prev => 
      prev.includes(city) 
        ? prev.filter(c => c !== city)
        : [...prev, city]
    )
  }

  const toggleStateFilter = (state: string) => {
    setStateFilters(prev => 
      prev.includes(state) 
        ? prev.filter(s => s !== state)
        : [...prev, state]
    )
  }

  const toggleTypeFilter = (type: string) => {
    setTypeFilters(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    )
  }

  const clearAllFilters = () => {
    setCityFilters([])
    setStateFilters([])
    setTypeFilters([])
    setCitySearch("")
    setStateSearch("")
  }

  const getFilteredAndSortedColleges = () => {
    if (!colleges) return []

    const filtered = colleges.filter(college => {
      if (cityFilters.length > 0) {
        if (!cityFilters.includes(college.city)) return false
      }

      if (stateFilters.length > 0) {
        if (!stateFilters.includes(college.state)) return false
      }

      if (typeFilters.length > 0) {
        if (!typeFilters.includes(college.type)) return false
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
      case 'year-desc':
        sorted.sort((a, b) => parseInt(b.establishedYear || '0') - parseInt(a.establishedYear || '0'))
        break
      case 'year-asc':
        sorted.sort((a, b) => parseInt(a.establishedYear || '0') - parseInt(b.establishedYear || '0'))
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
      return <div className="text-center text-gray-500">Loading colleges...</div>;
    }

    if (error) {
      return <div className="text-center text-red-500">Error: {error}</div>;
    }

    const filteredColleges = getFilteredAndSortedColleges()

    if (filteredColleges.length === 0) {
      return <p>No colleges found matching your filters.</p>;
    }

    const totalPages = Math.ceil(filteredColleges.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedColleges = filteredColleges.slice(startIndex, endIndex);

    return (
      <>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {paginatedColleges.map((college) => (
            <CollegeCard
              key={college.id}
              college={adaptApiDataToCardData(college)}
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
                    {/* City Filter */}
                    <div className="flex flex-col gap-[16px] bg-white p-5 w-full rounded-[8px]">
                      <div className="flex justify-between text-[#242645]">
                        <p>City</p>
                        <button onClick={() => setCityToggle(!cityToggle)}>
                          {cityToggle ? <ChevronDown className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
                        </button>
                      </div>
                      {cityToggle && (
                        <div className="flex flex-col gap-[16px] text-[#232323]">
                          <hr className="h-px"/>
                          <div className="flex items-center gap-2 px-3 rounded-md w-full h-[40px] border border-[#efefef] bg-white">
                            <Search size={15} className="text-[#343C6A]"/>
                            <input
                              type="text"
                              placeholder="Search Cities"
                              value={citySearch}
                              onChange={(e) => setCitySearch(e.target.value)}
                              className="w-full h-full text-sm outline-none bg-transparent placeholder:text-[#232323]"
                            />
                          </div>
                          {cityOptions
                            .filter(city => city && city.toLowerCase().includes(citySearch.toLowerCase()))
                            .slice(0, citySearch ? cityOptions.length : 7)
                            .map((city) => (
                            <div key={city} className="flex gap-2 items-center">
                              <input
                                type="checkbox"
                                checked={cityFilters.includes(city)}
                                onChange={() => toggleCityFilter(city)}
                                className="w-5 h-5"
                              />
                              <p className="font-medium text-[14px]">{city}</p>
                            </div>
                          ))}
                          <hr className="h-px"/>
                          <p className="font-normal text-[14px]">{cityOptions.length} Cities</p>
                          {!citySearch && cityOptions.length > 7 && (
                            <p className="font-normal text-[12px] text-gray-500">Search to see more options</p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* State Filter */}
                    <div className="flex flex-col gap-[16px] bg-white p-5 w-full rounded-[8px]">
                      <div className="flex justify-between text-[#242645]">
                        <p>State</p>
                        <button onClick={() => setStateToggle(!stateToggle)}>
                          {stateToggle ? <ChevronDown className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
                        </button>
                      </div>
                      {stateToggle && (
                        <div className="flex flex-col gap-[16px] text-[#232323]">
                          <hr className="h-px"/>
                          <div className="flex items-center gap-2 px-3 rounded-md w-full h-[40px] border border-[#efefef] bg-white">
                            <Search size={15} className="text-[#343C6A]"/>
                            <input
                              type="text"
                              placeholder="Search States"
                              value={stateSearch}
                              onChange={(e) => setStateSearch(e.target.value)}
                              className="w-full h-full text-sm outline-none bg-transparent placeholder:text-[#232323]"
                            />
                          </div>
                          {stateOptions
                            .filter(state => state && state.toLowerCase().includes(stateSearch.toLowerCase()))
                            .slice(0, stateSearch ? stateOptions.length : 7)
                            .map((state) => (
                            <div key={state} className="flex gap-2 items-center">
                              <input
                                type="checkbox"
                                checked={stateFilters.includes(state)}
                                onChange={() => toggleStateFilter(state)}
                                className="w-5 h-5"
                              />
                              <p className="font-medium text-[14px]">{state}</p>
                            </div>
                          ))}
                          <hr className="h-px"/>
                          <p className="font-normal text-[14px]">{stateOptions.length} States</p>
                          {!stateSearch && stateOptions.length > 7 && (
                            <p className="font-normal text-[12px] text-gray-500">Search to see more options</p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Type Filter */}
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
                  <p>City</p>
                  {cityToggle ? <ChevronDown className="w-6 h-6" onClick={() => setCityToggle(!cityToggle)}/> 
                  : <ChevronRight className="w-6 h-6" onClick={() => setCityToggle(!cityToggle)}/>}
                </div>
                {cityToggle && (
                  <div className="flex flex-col gap-[16px] text-[#232323]">
                    <hr className="h-px"/>
                    <div className="flex items-center gap-2 px-3 rounded-md w-[272px] h-[40px] border border-[#efefef] bg-white">
                      <Search size={15} className="text-[#343C6A]"/>
                      <input
                        type="text"
                        placeholder="Search Cities"
                        value={citySearch}
                        onChange={(e) => setCitySearch(e.target.value)}
                        className="w-full h-full text-sm outline-none bg-transparent placeholder:text-[#232323]"
                      />
                    </div>
                    {cityOptions
                      .filter(city => city && city.toLowerCase().includes(citySearch.toLowerCase()))
                      .slice(0, citySearch ? cityOptions.length : 7)
                      .map((city) => (
                      <div key={city} className="flex gap-2 items-center">
                        <input 
                          type="checkbox" 
                          checked={cityFilters.includes(city)}
                          onChange={() => toggleCityFilter(city)}
                          className="w-5 h-5"
                        />
                        <p className="font-medium text-[14px]">{city}</p>
                      </div>
                    ))}
                    <hr className="h-px"/>
                    <p className="font-normal text-[14px]">{cityOptions.length} Cities</p>
                    {!citySearch && cityOptions.length > 7 && (
                      <p className="font-normal text-[12px] text-gray-500">Search to see more options</p>
                    )}
                  </div>
                )}
              </div>

              
              <div className="flex flex-col gap-[16px] bg-white p-5 w-full max-w-[312px] rounded-[8px]">
                <div className="flex justify-between text-[#242645]">
                  <p>State</p>
                  {stateToggle ? <ChevronDown className="w-6 h-6" onClick={() => setStateToggle(!stateToggle)}/> 
                  : <ChevronRight className="w-6 h-6" onClick={() => setStateToggle(!stateToggle)}/>}
                </div>
                {stateToggle && (
                  <div className="flex flex-col gap-[16px] text-[#232323]">
                    <hr className="h-px"/>
                    <div className="flex items-center gap-2 px-3 rounded-md w-[272px] h-[40px] border border-[#efefef] bg-white">
                      <Search size={15} className="text-[#343C6A]"/>
                      <input
                        type="text"
                        placeholder="Search States"
                        value={stateSearch}
                        onChange={(e) => setStateSearch(e.target.value)}
                        className="w-full h-full text-sm outline-none bg-transparent placeholder:text-[#232323]"
                      />
                    </div>
                    {stateOptions
                      .filter(state => state && state.toLowerCase().includes(stateSearch.toLowerCase()))
                      .slice(0, stateSearch ? stateOptions.length : 7)
                      .map((state) => (
                      <div key={state} className="flex gap-2 items-center">
                        <input 
                          type="checkbox" 
                          checked={stateFilters.includes(state)}
                          onChange={() => toggleStateFilter(state)}
                          className="w-5 h-5"
                        />
                        <p className="font-medium text-[14px]">{state}</p>
                      </div>
                    ))}
                    <hr className="h-px"/>
                    <p className="font-normal text-[14px]">{stateOptions.length} States</p>
                    {!stateSearch && stateOptions.length > 7 && (
                      <p className="font-normal text-[12px] text-gray-500">Search to see more options</p>
                    )}
                  </div>
                )}
              </div>

              
              <div className="flex flex-col gap-[16px] bg-white p-5 w-full max-w-[312px] rounded-[8px]">
                <div className="flex justify-between text-[#242645]">
                  <p>Type</p>
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
                <span className="text-[#8C8CA1] font-medium text-[14px] lg:text-[20px]">Filter colleges based on your needs.</span>
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