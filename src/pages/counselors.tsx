import { CounselorCard, type CounselorCardData } from "@/components/cards/CounselorListingCard";
import { useAllCounselors } from "@/hooks/useCounselors";
import type { AllCounselor } from "@/types/academic";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectGroup, SelectLabel } from "@/components/ui/select";
import { ChevronDown, ChevronRight, Search, X } from "lucide-react";
import { useState, useEffect, useMemo, useRef } from "react";
import Pagination from "@/components/ui/Pagination";
import { useAuthStore } from "@/store/AuthStore";
import { addFav } from "@/api/counsellor";
import toast from "react-hot-toast";

function adaptApiDataToCardData(apiCounselor: AllCounselor): CounselorCardData {
  const firstName = apiCounselor.firstName || 'Unknown';
  const lastName = apiCounselor.lastName || 'Counselor';
  const fullName = `${firstName} ${lastName}`;
  
  const imageUrl = apiCounselor.photoUrlSmall || `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=6B7280&color=ffffff&size=400`;
  

  const dayMapping: Record<string, string> = {
    'Monday': 'Mon',
    'Tuesday': 'Tue', 
    'Wednesday': 'Wed',
    'Thursday': 'Thu',
    'Friday': 'Fri',
    'Saturday': 'Sat',
    'Sunday': 'Sun'
  };
  
  const workingDays = apiCounselor.workingDays || [];
  const availability = workingDays.map(day => dayMapping[day] || day);
  

  const languages = apiCounselor.languagesKnow || ['English'];
  

  const experience = apiCounselor.experience || '0';
  const experienceText = experience && experience !== '0' ? `${experience} Years Experience` : 'Entry Level';
  const languageText = languages.slice(0, 2).join(' | ');
  const specialization = [experienceText, languageText].filter(Boolean).join(' • ') || 'General Counselor';

  const baseRate = apiCounselor.ratePerYear || 5000;
  

  const location = apiCounselor.city || "Location not specified";
  
  const rating = apiCounselor.rating || 4.0;
  const reviews = parseInt(apiCounselor.numberOfRatings || "0");
  
  return {
    id: apiCounselor.counsellorId || `temp-${Date.now()}`,
    name: fullName,
    imageUrl: imageUrl,
    rating: rating,
    reviews: reviews,
    verified: true,
    specialization: specialization,
    location: location,
    languages: languages,
    availability: availability.length > 0 ? availability : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    pricing: {
      plus: baseRate,
      pro: baseRate * 2,
      elite: baseRate * 5,
    },
  };
}

export default function CounselorListingPage() {
  const { data: counselors, loading, error } = useAllCounselors();
  const { user, userId, refreshUser, role } = useAuthStore();
  
  // Session storage keys
  const STORAGE_KEY = 'counselors_filters';
  
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
  const ITEMS_PER_PAGE = 9;
  const [favouriteIds, setFavouriteIds] = useState<Set<string>>(new Set());

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [filterCount, setFilterCount] = useState(0);
  const [selected, setSelected] = useState<string[]>(savedState?.selected || []);
  const [selectedSort, setSelectedSort] = useState(savedState?.selectedSort || "popularity");
  const [citySearch, setCitySearch] = useState("");

  const [experienceFilters, setExperienceFilters] = useState<string[]>(savedState?.experienceFilters || []);
  const [languageFilters, setLanguageFilters] = useState<string[]>(savedState?.languageFilters || []);
  const [cityFilters, setCityFilters] = useState<string[]>(savedState?.cityFilters || []);
  const [minPrice, setMinPrice] = useState(savedState?.minPrice || "");
  const [maxPrice, setMaxPrice] = useState(savedState?.maxPrice || "");

  const [experienceToggle, setExperienceToggle] = useState(false);
  const [languageToggle, setLanguageToggle] = useState(false);
  const [cityToggle, setCityToggle] = useState(false);
  const [priceToggle, setPriceToggle] = useState(false);
  const [workingDaysToggle, setWorkingDaysToggle] = useState(false);

  const isMounted = useRef(false);

  // Save to session storage whenever filters or pagination changes
  useEffect(() => {
    const stateToSave = {
      currentPage,
      selected,
      selectedSort,
      experienceFilters,
      languageFilters,
      cityFilters,
      minPrice,
      maxPrice
    };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
  }, [currentPage, selected, selectedSort, experienceFilters, languageFilters, cityFilters, minPrice, maxPrice]);

  // Load user's favourite counselors
  useEffect(() => {
    if (user?.favouriteCounsellorIds) {
      setFavouriteIds(new Set(user.favouriteCounsellorIds));
    }
  }, [user]);

  const handleToggleFavourite = async (counsellorId: string) => {
    if (role === 'counselor') {
      toast.error("Counselors cannot add other counselors to favourites.");
      return;
    }
    if (!userId) return;
    const newFavouriteIds = new Set(favouriteIds);
    if (newFavouriteIds.has(counsellorId)) {
      newFavouriteIds.delete(counsellorId);
    } else {
      newFavouriteIds.add(counsellorId);
    }
    setFavouriteIds(newFavouriteIds);

    try {
      await addFav(userId, counsellorId);
      await refreshUser(true);
      toast.success("Favourite status updated!");
    } catch (err) {
      toast.error("Could not update favourite status.");
      setFavouriteIds(new Set(user?.favouriteCounsellorIds || []));
    }
  };

  const sortTypes = [
    {label:'Popularity', value:'popularity'},
    {label:'Price: Low-High', value:'price-low'},
    {label:'Price: High-Low', value:'price-high'}
  ]

  const experienceOptions = [
    { id: 'entry', label: 'Entry Level', description: '0-1 years' },
    { id: 'junior', label: 'Junior Level', description: '1-3 years' },
    { id: 'senior', label: 'Senior Level', description: '3+ years' }
  ]

  const languageOptions = useMemo(() => {
    if (!counselors) return ['Hindi', 'English', 'Marathi', 'Kannada', 'Telugu', 'Tamil']
    const allLanguages = counselors.flatMap(c => c.languagesKnow || [])
    return [...new Set(allLanguages)].sort()
  }, [counselors])
  
  const cityOptions = useMemo(() => {
    if (!counselors) return ['Greater Noida', 'Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Pune']
    const allCities = counselors.map(c => c.city).filter(Boolean) as string[]
    return [...new Set(allCities)].sort()
  }, [counselors])
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']


  useEffect(() => {
    const count = experienceFilters.length + 
                  languageFilters.length + 
                  cityFilters.length + 
                  selected.length + 
                  (minPrice ? 1 : 0) + 
                  (maxPrice ? 1 : 0)
    setFilterCount(count);
    if (isMounted.current) {
    setCurrentPage((prev: number) => prev);
  } else {
    isMounted.current = true;
  }
  }, [experienceFilters, languageFilters, cityFilters, selected, minPrice, maxPrice])

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const toggleExperienceFilter = (experience: string) => {
    setExperienceFilters(prev => 
      prev.includes(experience) 
        ? prev.filter(e => e !== experience)
        : [...prev, experience]
    )
  }

  const toggleLanguageFilter = (language: string) => {
    setLanguageFilters(prev => 
      prev.includes(language) 
        ? prev.filter(l => l !== language)
        : [...prev, language]
    )
  }

  const toggleCityFilter = (city: string) => {
    setCityFilters(prev => 
      prev.includes(city) 
        ? prev.filter(c => c !== city)
        : [...prev, city]
    )
  }

  const toggleDay = (day: string) => {
    setSelected(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    )
  }

  const clearAllFilters = () => {
    setExperienceFilters([])
    setLanguageFilters([])
    setCityFilters([])
    setSelected([])
    setMinPrice("")
    setMaxPrice("")
    setCitySearch("")
  }


  const getFilteredAndSortedCounselors = () => {
    if (!counselors) return []

    const filtered = counselors.filter(counselor => {
      // Filter out the logged-in counselor from the list
      if (role === 'counselor' && userId && counselor.counsellorId === userId) {
        return false;
      }

      if (experienceFilters.length > 0) {
        const experience = parseInt(counselor.experience || '0')
        const matchesExperience = experienceFilters.some(filter => {
          if (filter === 'entry') return experience >= 0 && experience <= 1
          if (filter === 'junior') return experience > 1 && experience <= 3
          if (filter === 'senior') return experience > 3
          return false
        })
        if (!matchesExperience) return false
      }

     
      if (languageFilters.length > 0) {
        const counselorLanguages = counselor.languagesKnow || ['English']
        if (!languageFilters.some(lang => counselorLanguages.includes(lang))) return false
      }

  
      if (cityFilters.length > 0) {
        const counselorCity = counselor.city || ''
        if (!cityFilters.includes(counselorCity) && counselorCity !== '') return false
      }


      const counselorRate = counselor.ratePerYear || 5000
      if (minPrice && counselorRate < parseInt(minPrice)) return false
      if (maxPrice && counselorRate > parseInt(maxPrice)) return false


      if (selected.length > 0) {
        const counselorDays = counselor.workingDays || []
        const dayMapping: Record<string, string> = {
          'Mon': 'Monday', 'Tue': 'Tuesday', 'Wed': 'Wednesday',
          'Thu': 'Thursday', 'Fri': 'Friday', 'Sat': 'Saturday', 'Sun': 'Sunday'
        }
        
        const selectedFullDays = selected.map(day => dayMapping[day] || day)
        if (!selectedFullDays.some(day => counselorDays.includes(day))) return false
      }

      return true
    })

    const sorted = [...filtered]
    switch (selectedSort) {
      case 'price-low':
        sorted.sort((a, b) => ((a.rating || 0) * 1000 + 2000) - ((b.rating || 0) * 1000 + 2000))
        break
      case 'price-high':
        sorted.sort((a, b) => ((b.rating || 0) * 1000 + 2000) - ((a.rating || 0) * 1000 + 2000))
        break
      case 'popularity':
      default:
        sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0))
        break
    }

    return sorted
  }





  const renderContent = () => {
    if (loading) {
      return <div className="text-center text-gray-500">Loading counselors...</div>;
    }

    if (error) {
      return <div className="text-center text-red-500">Error: {error}</div>;
    }

    const filteredCounselors = getFilteredAndSortedCounselors()

    if (filteredCounselors.length === 0) {
      return <p>No counselors found matching your filters.</p>;
    }

    const totalPages = Math.ceil(filteredCounselors.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedCounselors = filteredCounselors.slice(startIndex, endIndex);

    return (
    <>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {paginatedCounselors.map((counselor) => {
          const cardData = adaptApiDataToCardData(counselor);
          const isFavourite = favouriteIds.has(cardData.id);
          return (
            <CounselorCard
              key={counselor.counsellorId}
              counselor={cardData}
              isFavourite={isFavourite}
              onToggleFavourite={handleToggleFavourite}
            />
          );
        })}
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
          <aside className="lg:w-[312px] lg:flex-shrink-0 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)]">
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
                
                <div className="flex flex-col gap-[16px] bg-white p-5 w-full rounded-[8px]">
                  <div className="flex justify-between text-[#242645]">
                    <p>Experience</p>
                    <button onClick={() => setExperienceToggle(!experienceToggle)}>
                      {experienceToggle ? <ChevronDown className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
                    </button>
                  </div>
                  {experienceToggle && (
                    <div className="flex flex-col gap-[16px] text-[#232323]">
                      <hr className="h-px"/>
                      {experienceOptions.slice(0, 7).map((option) => (
                        <div key={option.id} className="flex gap-2 items-center">
                          <input
                            type="checkbox"
                            checked={experienceFilters.includes(option.id)}
                            onChange={() => toggleExperienceFilter(option.id)}
                            className="w-5 h-5"
                          />
                          <p className="flex flex-col font-medium text-[14px]">
                            {option.label} 
                            <span className="font-normal text-[12px]">{option.description}</span>
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                
                <div className="flex flex-col gap-[16px] bg-white p-5 w-full rounded-[8px]">
                  <div className="flex justify-between text-[#242645]">
                    <p>Languages</p>
                    <button onClick={() => setLanguageToggle(!languageToggle)}>
                      {languageToggle ? <ChevronDown className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
                    </button>
                  </div>
                  {languageToggle && (
                    <div className="flex flex-col gap-[16px] text-[#232323]">
                      <hr className="h-px"/>
                      {languageOptions.slice(0, 7).map((language) => (
                        <div key={language} className="flex gap-2 items-center">
                          <input
                            type="checkbox"
                            checked={languageFilters.includes(language)}
                            onChange={() => toggleLanguageFilter(language)}
                            className="w-5 h-5"
                          />
                          <p className="font-medium text-[14px]">{language}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                
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

                
                <div className="flex flex-col gap-[16px] bg-white p-5 w-full rounded-[8px]">
                  <div className="flex justify-between text-[#242645]">
                    <p>Price</p>
                    <button onClick={() => setPriceToggle(!priceToggle)}>
                      {priceToggle ? <ChevronDown className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
                    </button>
                  </div>
                  {priceToggle && (
                    <div className="flex flex-col gap-[16px] text-[#232323]">
                      <hr className="h-px"/>
                      <div className="flex gap-3">
                        <div className="flex flex-col gap-2">
                          <p className="font-medium text-[14px]">Min Price</p>
                          <div className="rounded-[12px] flex-1 h-[36px] border border-[#efefef] bg-white">
                            <input 
                              type="text" 
                              placeholder="100"
                              value={minPrice}
                              onChange={(e) => setMinPrice(e.target.value)}
                              className="px-3 w-full h-full text-sm outline-none bg-transparent placeholder:text-[#718EBF]/80 placeholder:font-semibold" 
                            />
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <p className="text-[14px] font-medium">Max Price</p>
                          <div className="rounded-[12px] flex-1 h-[36px] border border-[#efefef] bg-white">
                            <input 
                              type="text" 
                              placeholder="10000"
                              value={maxPrice}
                              onChange={(e) => setMaxPrice(e.target.value)}
                              className="px-3 w-full h-full text-sm outline-none bg-transparent placeholder:text-[#718EBF]/80 placeholder:font-semibold" 
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                
                <div className="flex flex-col gap-[16px] bg-white p-5 w-full rounded-[8px]">
                  <div className="flex justify-between text-[#242645]">
                    <p>Working Days</p>
                    <button onClick={() => setWorkingDaysToggle(!workingDaysToggle)}>
                      {workingDaysToggle ? <ChevronDown className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
                    </button>
                  </div>
                  {workingDaysToggle && (
                    <div className="flex flex-col gap-[16px] text-[#232323]">
                      <hr className="h-px"/>
                      <div className="flex flex-wrap gap-[10px]">
                        {days.map((day) => {
                          const isSelected = selected.includes(day);
                          return (
                            <button
                              key={day}
                              onClick={() => toggleDay(day)}
                              className={`cursor-pointer px-2.5 py-2 rounded-[10px] border text-sm font-medium transition-colors ${
                                isSelected
                                  ? "bg-[#232323] text-white border-[#232323]"
                                  : "bg-white text-[#232323] border-[#E6E6E6] hover:bg-gray-100"
                              }`}
                            >
                              {day}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
                </div>
              </div>

              
              <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
                <div className="flex gap-3">
                  <button
                    onClick={clearAllFilters}
                    className="flex-1 py-3 border border-gray-300 rounded-lg text-center font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
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

          {/* Desktop Filters - Sticky Sidebar */}
          <div className={`${mobileFilterOpen? 'flex': 'hidden'} lg:flex flex-col gap-6 overflow-y-auto scrollbar-thin w-full`}>

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
               onClick={() => setExperienceToggle(!experienceToggle)}
             >
              <p>Experience</p>
              {experienceToggle?<ChevronDown className="w-6 h-6"/>
              : <ChevronRight className="w-6 h-6"/>}
             </div>

             {experienceToggle && 
             <div className="flex flex-col gap-[16px] text-[#232323]">
              <hr  className="h-px"/>
              {experienceOptions.slice(0, 7).map((option) => (
                <div key={option.id} className="flex gap-2 items-center">
                  <input 
                    type="checkbox" 
                    checked={experienceFilters.includes(option.id)}
                    onChange={() => toggleExperienceFilter(option.id)}
                    className="w-5 h-5"
                  />
                  <p className="flex flex-col font-medium text-[14px]">
                    {option.label} 
                    <span className="font-normal text-[12px]">{option.description}</span>
                  </p>
                </div>
              ))}
             </div>
             }
            </div>

            
            <div className="flex flex-col gap-[16px] bg-white p-5 w-full max-w-[312px] rounded-[8px] border-[1px] border-[#E6E6E6]">
             <div 
               className="flex justify-between text-[#242645] cursor-pointer" 
               onClick={() => setLanguageToggle(!languageToggle)}
             >
              <p>Languages</p>
              {languageToggle?<ChevronDown className="w-6 h-6"/>
              : <ChevronRight className="w-6 h-6"/>}
             </div>

             {languageToggle && 
             <div className="flex flex-col gap-[16px] text-[#232323]">
              <hr  className="h-px"/>
              {languageOptions.slice(0, 7).map((language) => (
                <div key={language} className="flex gap-2 items-center">
                  <input 
                    type="checkbox" 
                    checked={languageFilters.includes(language)}
                    onChange={() => toggleLanguageFilter(language)}
                    className="w-5 h-5"
                  />
                  <p className="font-medium text-[14px]">{language}</p>
                </div>
              ))}
             </div>
             }
            </div>

            
            <div className="flex flex-col gap-[16px] bg-white p-5 w-full max-w-[312px] rounded-[8px] border-[1px] border-[#E6E6E6]">
             <div 
               className="flex justify-between text-[#242645] cursor-pointer" 
               onClick={() => setCityToggle(!cityToggle)}
             >
              <p>City</p>
              {cityToggle?<ChevronDown className="w-6 h-6"/>
              : <ChevronRight className="w-6 h-6"/>}
             </div>

             {cityToggle && 
             <div className="flex flex-col gap-[16px] text-[#232323]">
              <hr  className="h-px"/>

              <div className="flex items-center gap-2 px-3 rounded-md w-[272px] h-[40px] border border-[#efefef] bg-white">
              <Search size={15} className="text-[#343C6A]"/>
                <input
                type="text"
                placeholder="Search Cities"
                value={citySearch}
                onChange={(e) => setCitySearch(e.target.value)}
                className="w-full h-full text-sm outline-none bg-transparent placeholder:text-[#232323] "
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
             }
            </div>

            
            <div className="flex flex-col gap-[16px] bg-white p-5 w-full max-w-[312px] rounded-[8px] border-[1px] border-[#E6E6E6]">
             <div 
               className="flex justify-between text-[#242645] cursor-pointer" 
               onClick={() => setPriceToggle(!priceToggle)}
             >
              <p>Price</p>
              {priceToggle?<ChevronDown className="w-6 h-6"/>
              : <ChevronRight className="w-6 h-6"/>}
             </div>

             {priceToggle && 
             <div className="flex flex-col gap-[16px] text-[#232323]">
              <hr  className="h-px"/>

              <div className="flex gap-3">
               <div className="flex flex-col gap-2">
                <p className="font-medium text-[14px]">Min Price</p>
                <div className="rounded-[12px] w-[128px] h-[36px] border border-[#efefef] bg-white">
                  <input 
                  type="text" 
                  placeholder="100"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className=" px-3 w-full h-full text-sm outline-none bg-transparent placeholder:text-[#718EBF]/80 placeholder:font-semibold" 
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-[14px] font-medium">Max Price</p>
                <div className="rounded-[12px] w-[128px] h-[36px] border border-[#efefef] bg-white">
                  <input 
                  type="text" 
                  placeholder="10000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="px-3 w-full h-full text-sm outline-none bg-transparent placeholder:text-[#718EBF]/80 placeholder:font-semibold" 
                  />
                </div>
              </div>
              </div>
             </div>
             }
            </div>

            
            <div className="flex flex-col gap-[16px] bg-white p-5 w-full max-w-[312px] rounded-[8px] border-[1px] border-[#E6E6E6]">
             <div 
               className="flex justify-between text-[#242645] cursor-pointer" 
               onClick={() => setWorkingDaysToggle(!workingDaysToggle)}
             >
              <p>Working Days</p>
              {workingDaysToggle?<ChevronDown className="w-6 h-6"/>
              : <ChevronRight className="w-6 h-6"/>}
             </div>

             {workingDaysToggle && 
             <div className="flex flex-col gap-[16px] text-[#232323]">
              <hr  className="h-px"/>

             <div className="flex flex-wrap gap-[10px]">
                {days.map((day) => {
                  const isSelected = selected.includes(day);
                  return (
                    <div
                      key={day}
                      onClick={() => toggleDay(day)}
                      className={`cursor-pointer px-2.5 py-2 rounded-[10px] border text-sm font-medium transition-colors ${
                        isSelected
                          ? "bg-[#232323] text-white border-[#232323]"
                          : "bg-white text-[#232323] border-[#E6E6E6] hover:bg-gray-100"
                      }`}
                    >
                      {day}
                    </div>
                  );
                })}
              </div>

             </div>
             }
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
              <h1 className="flex flex-col gap-2 mb-6 text-[16px] text-2xl font-bold">Find experienced education counsellors.
                <span className="text-[#8C8CA1] font-medium text-[14px] lg:text-[20px]">Filter by expertise, language, availability, and pricing.</span>
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