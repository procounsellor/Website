// counselors.tsx
import {
  CounselorCard,
  type CounselorCardData,
} from "@/components/cards/CounselorListingCard";
import type { AllCounselor } from "@/types/academic";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
} from "@/components/ui/select";
import { ChevronDown, ChevronRight, Search, X, Info, Loader2 } from "lucide-react";
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useAuthStore } from "@/store/AuthStore";
import { addFav } from "@/api/counsellor";
import { academicApi } from "@/api/academic";
import toast from "react-hot-toast";
import EditProfileModal from "@/components/student-dashboard/EditProfileModal";
import { updateUserProfile } from "@/api/user";

function adaptApiDataToCardData(apiCounselor: AllCounselor): CounselorCardData {
  const firstName = apiCounselor.firstName || "Unknown";
  const lastName = apiCounselor.lastName || "Counselor";
  const fullName = `${firstName} ${lastName}`;

  const imageUrl =
    apiCounselor.photoUrlSmall ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      fullName
    )}&background=6B7280&color=ffffff&size=400`;

  const dayMapping: Record<string, string> = {
    Monday: "Mon",
    Tuesday: "Tue",
    Wednesday: "Wed",
    Thursday: "Thu",
    Friday: "Fri",
    Saturday: "Sat",
    Sunday: "Sun",
  };

  const workingDays = apiCounselor.workingDays || [];
  const availability = workingDays.map((day) => dayMapping[day] || day);
  const languages = apiCounselor.languagesKnow || ["English"];
  const experience = apiCounselor.experience || "0";
  
  let experienceText: string;
  if (experience === "0" || !experience) {
    experienceText = "Entry Level";
  } else if (experience.toLowerCase().includes("year")) {
    experienceText = experience;
  } else {
    experienceText = `${experience} Years Experience`;
  }

  const languageText = languages.slice(0, 2).join(" | ");
  const specialization =
    [experienceText, languageText].filter(Boolean).join(" • ") ||
    "General Counselor";
  const location = apiCounselor.city || "Location not specified";

  return {
    id: apiCounselor.counsellorId || `temp-${Date.now()}`,
    name: fullName,
    imageUrl: imageUrl,
    rating: apiCounselor.rating || 4.0,
    reviews: parseInt(apiCounselor.numberOfRatings || "0"),
    verified: true,
    specialization: specialization,
    location: location,
    languages: languages,
    availability: availability.length > 0 ? availability : ["Mon", "Fri"],
    pricing: {
      plus: apiCounselor.plusAmount || 0,
      pro: apiCounselor.proAmount || 0,
      elite: apiCounselor.eliteAmount || 0,
    },
  };
}

export default function CounselorListingPage() {
  const { user, userId, refreshUser } = useAuthStore();
  
  // --- STATE MANAGEMENT ---
  const [counselors, setCounselors] = useState<AllCounselor[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingMore, setFetchingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Infinite Scroll State
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);
  
  // Ref to store all fetched data for logged out users to enable client-side pagination
  const allLoggedOutDataRef = useRef<AllCounselor[]>([]);
  
  const ITEMS_PER_PAGE = 9;

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [filterCount, setFilterCount] = useState(0);
  
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedSort, setSelectedSort] = useState("popularity"); 
  const [citySearch, setCitySearch] = useState("");
  
  const [experienceFilters, setExperienceFilters] = useState<string[]>([]);
  const [languageFilters, setLanguageFilters] = useState<string[]>([]);
  const [cityFilters, setCityFilters] = useState<string[]>([]);

  // --- PRICE FILTER STATE ---
  const [minPriceInput, setMinPriceInput] = useState("");
  const [maxPriceInput, setMaxPriceInput] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [experienceToggle, setExperienceToggle] = useState(false);
  const [languageToggle, setLanguageToggle] = useState(false);
  const [cityToggle, setCityToggle] = useState(false);
  const [priceToggle, setPriceToggle] = useState(false);
  const [workingDaysToggle, setWorkingDaysToggle] = useState(false);

  const [favouriteIds, setFavouriteIds] = useState<Set<string>>(new Set());

  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const sortTypes = [
    { label: "Popularity", value: "popularity" },
    { label: "Price: Low-High", value: "price-low" },
    { label: "Price: High-Low", value: "price-high" },
  ];

  const experienceOptions = [
    { id: "entry", label: "Entry Level", description: "0-1 years" },
    { id: "junior", label: "Junior Level", description: "1-3 years" },
    { id: "senior", label: "Senior Level", description: "3+ years" },
  ];

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  
  const languageOptions = ["Hindi", "English", "Marathi", "Kannada", "Telugu", "Tamil", "Malayalam", "Gujarati", "Bengali"];
  
  const cityOptions = ["Pune", "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Noida"];

  const filteredCityOptions = useMemo(() => {
    return cityOptions.filter((city) =>
      city.toLowerCase().includes(citySearch.toLowerCase())
    );
  }, [citySearch]);


  const generateSeniorYears = () => {
    return Array.from({ length: 37 }, (_, i) => i + 4).join(",");
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setMinPrice(minPriceInput);
    }, 800);
    return () => clearTimeout(timer);
  }, [minPriceInput]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMaxPrice(maxPriceInput);
    }, 800);
    return () => clearTimeout(timer);
  }, [maxPriceInput]);

  useEffect(() => {
    setPage(0);
    setHasMore(true);
    allLoggedOutDataRef.current = [];
  }, [
    experienceFilters, 
    languageFilters, 
    cityFilters, 
    selectedDays, 
    minPrice, 
    maxPrice,
    selectedSort
  ]);

  // --- FETCH DATA ---
  const fetchCounselors = useCallback(async (isLoadMore: boolean) => {
    if (isLoadMore) {
      setFetchingMore(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const dayMapping: Record<string, string> = {
        Mon: "Monday", Tue: "Tuesday", Wed: "Wednesday", Thu: "Thursday",
        Fri: "Friday", Sat: "Saturday", Sun: "Sunday",
      };
      const apiDays = selectedDays.map(d => dayMapping[d] || d).join(",");

      let apiExperience = "";
      const selectedExp = [];
      if (experienceFilters.includes("entry")) selectedExp.push("0,1");
      if (experienceFilters.includes("junior")) selectedExp.push("1,2,3");
      if (experienceFilters.includes("senior")) selectedExp.push(generateSeniorYears());
      apiExperience = selectedExp.join(",");

      const apiCities = cityFilters.join(",");
      const apiLanguages = languageFilters.join(",");

      const commonFilters = {
        city: apiCities,
        languagesKnow: apiLanguages,
        workingDays: apiDays,
        experience: apiExperience,
        minPrice: minPrice, 
        maxPrice: maxPrice, 
      };

      let response;

      if (userId) {
        // LOGGED IN: Interested Course API
        response = await academicApi.searchCounsellors(
          userId,
          commonFilters,
          page, 
          ITEMS_PER_PAGE
        );
      } else {
        // LOGGED OUT: Get All Counsellors API
        response = await academicApi.searchAllLoggedOutCounsellors(
          commonFilters,
          page,
          ITEMS_PER_PAGE
        );
      }

      const newCounselors: AllCounselor[] = response.counsellors || [];
      const totalItems = response.total || 0;

      setCounselors(prev => {
        if (isLoadMore) {
          const existingIds = new Set(prev.map(c => c.counsellorId));
          const uniqueNew = newCounselors.filter(c => !existingIds.has(c.counsellorId));
          return [...prev, ...uniqueNew];
        } else {
          return newCounselors;
        }
      });

      // Calculate if we have more pages based on server total
      if (newCounselors.length < ITEMS_PER_PAGE || (page + 1) * ITEMS_PER_PAGE >= totalItems) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }

    } catch (err: any) {
      console.error("Search Error:", err);
      setError("Failed to load counselors. Please try again.");
    } finally {
      setLoading(false);
      setFetchingMore(false);
    }
  }, [
    userId, 
    page,
    selectedDays, 
    experienceFilters, 
    cityFilters, 
    languageFilters, 
    minPrice, 
    maxPrice
  ]);

  useEffect(() => {
    const isLoadMore = page > 0;
    const timeoutId = setTimeout(() => {
      fetchCounselors(isLoadMore);
    }, 300); 

    return () => clearTimeout(timeoutId);
  }, [fetchCounselors, page]);

  const lastCounselorRef = useCallback((node: HTMLDivElement | null) => {
    if (loading || fetchingMore) return;
    
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    
    if (node) observer.current.observe(node);
  }, [loading, fetchingMore, hasMore]);


  // Update Filter Count
  useEffect(() => {
    const count =
      experienceFilters.length +
      languageFilters.length +
      cityFilters.length +
      selectedDays.length +
      (minPriceInput ? 1 : 0) +
      (maxPriceInput ? 1 : 0);
    setFilterCount(count);
  }, [
    experienceFilters,
    languageFilters,
    cityFilters,
    selectedDays,
    minPriceInput,
    maxPriceInput,
  ]);

  // --- EVENT HANDLERS ---
  const toggleExperienceFilter = (experience: string) => {
    setExperienceFilters((prev) =>
      prev.includes(experience) ? prev.filter((e) => e !== experience) : [...prev, experience]
    );
  };

  const toggleLanguageFilter = (language: string) => {
    setLanguageFilters((prev) =>
      prev.includes(language) ? prev.filter((l) => l !== language) : [...prev, language]
    );
  };

  const toggleCityFilter = (city: string) => {
    setCityFilters((prev) =>
      prev.includes(city) ? prev.filter((c) => c !== city) : [...prev, city]
    );
  };

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const clearAllFilters = () => {
    setExperienceFilters([]);
    setLanguageFilters([]);
    setCityFilters([]);
    setSelectedDays([]);
    setMinPriceInput("");
    setMaxPriceInput("");
    setMinPrice("");
    setMaxPrice("");
    setCitySearch("");
    setPage(0);
  };

  useEffect(() => {
    if (user?.favouriteCounsellorIds) {
      setFavouriteIds(new Set(user.favouriteCounsellorIds));
    }
  }, [user]);

  const handleToggleFavourite = async (counsellorId: string) => {
     const { isAuthenticated, toggleLogin } = useAuthStore.getState();
     const toggleFavAction = async () => {
       const freshUserId = localStorage.getItem('phone');
       if (!freshUserId || !counsellorId) return;
 
       const newFavouriteIds = new Set(favouriteIds);
       if (newFavouriteIds.has(counsellorId)) newFavouriteIds.delete(counsellorId);
       else newFavouriteIds.add(counsellorId);
       setFavouriteIds(newFavouriteIds);
 
       try {
         await addFav(freshUserId, counsellorId);
         await refreshUser(true);
         toast.success("Favourite status updated!", { duration: 2000 });
       } catch (err) {
         toast.error("Could not update favourite status.", { duration: 2000 });
         setFavouriteIds(new Set(user?.favouriteCounsellorIds || []));
       }
     };
 
     if (!isAuthenticated) {
       toggleLogin(toggleFavAction);
       return;
     }
     if (!user?.firstName || !user?.email) {
       handleProfileIncomplete(toggleFavAction);
       return;
     }
     await toggleFavAction();
  };

  const handleProfileIncomplete = (action: () => void) => {
    setPendingAction(() => action);
    setIsEditProfileModalOpen(true);
  };

  const handleUpdateProfile = async (updatedData: { firstName: string; lastName: string; email: string }) => {
    if (!userId) throw new Error("User not authenticated");
    const token = localStorage.getItem('jwt');
    if(token) await updateUserProfile(userId, updatedData, token);
    await refreshUser(true);
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  };

  const handleCloseModal = () => {
    setIsEditProfileModalOpen(false);
    setPendingAction(null);
  };

  const filterContent = (
    <>
      {/* Experience */}
      <div className="flex flex-col gap-4 bg-white p-5 w-full max-w-[312px] rounded-xl border border-[#E6E6E6]">
        <div className="flex justify-between text-[#242645] cursor-pointer" onClick={() => setExperienceToggle(!experienceToggle)}>
          <div className="flex items-center gap-2">
            <p>Experience</p>
            {experienceFilters.length > 0 && <div className="w-2 h-2 bg-[#13097D] rounded-full"></div>}
          </div>
          {experienceToggle ? <ChevronDown className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
        </div>
        {experienceToggle && (
          <div className="flex flex-col gap-4 text-[#232323]">
            <hr className="h-px" />
            {experienceOptions.map((option) => (
              <div key={option.id} className="flex gap-2 items-center cursor-pointer" onClick={() => toggleExperienceFilter(option.id)}>
                <input type="checkbox" checked={experienceFilters.includes(option.id)} readOnly className="w-5 h-5 pointer-events-none" />
                <p className="flex flex-col font-medium text-[14px]">
                  {option.label}
                  <span className="font-normal text-[12px]">{option.description}</span>
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Languages */}
      <div className="flex flex-col gap-4 bg-white p-5 w-full max-w-[312px] rounded-xl border border-[#E6E6E6]">
        <div className="flex justify-between text-[#242645] cursor-pointer" onClick={() => setLanguageToggle(!languageToggle)}>
          <div className="flex items-center gap-2">
            <p>Languages</p>
            {languageFilters.length > 0 && <div className="w-2 h-2 bg-[#13097D] rounded-full"></div>}
          </div>
          {languageToggle ? <ChevronDown className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
        </div>
        {languageToggle && (
          <div className="flex flex-col gap-4 text-[#232323]">
            <hr className="h-px" />
            {languageOptions.map((language) => (
              <div key={language} className="flex gap-2 items-center cursor-pointer" onClick={() => toggleLanguageFilter(language)}>
                <input type="checkbox" checked={languageFilters.includes(language)} readOnly className="w-5 h-5 pointer-events-none" />
                <p className="font-medium text-[14px]">{language}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* City */}
      <div className="flex flex-col gap-4 bg-white p-5 w-full max-w-[312px] rounded-xl border border-[#E6E6E6]">
        <div className="flex justify-between text-[#242645] cursor-pointer" onClick={() => setCityToggle(!cityToggle)}>
          <div className="flex items-center gap-2">
            <p>City</p>
            {cityFilters.length > 0 && <div className="w-2 h-2 bg-[#13097D] rounded-full"></div>}
          </div>
          {cityToggle ? <ChevronDown className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
        </div>
        {cityToggle && (
          <div className="flex flex-col gap-4 text-[#232323]">
            <hr className="h-px" />
            <div className="flex items-center gap-2 px-3 rounded-md w-full h-10 border border-[#efefef] bg-white">
              <Search size={15} className="text-[#343C6A]" />
              <input type="text" placeholder="Search Cities" value={citySearch} onChange={(e) => setCitySearch(e.target.value)} className="w-full h-full text-sm outline-none bg-transparent" />
            </div>
            {filteredCityOptions.slice(0, 7).map((city) => (
              <div key={city} className="flex gap-2 items-center cursor-pointer" onClick={() => toggleCityFilter(city)}>
                <input type="checkbox" checked={cityFilters.includes(city)} readOnly className="w-5 h-5 pointer-events-none" />
                <p className="font-medium text-[14px]">{city}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Price */}
      <div className="flex flex-col gap-4 bg-white p-5 w-full max-w-[312px] rounded-xl border border-[#E6E6E6]">
        <div className="flex justify-between text-[#242645] cursor-pointer" onClick={() => setPriceToggle(!priceToggle)}>
          <div className="flex items-center gap-2">
            <p>Price</p>
            <div className="relative group">
              <Info className="w-3.5 h-3.5 text-gray-400 cursor-help" />
              <div className="absolute left-0 top-full mt-1 hidden group-hover:flex items-center gap-1.5 bg-gray-800 text-white text-xs rounded px-2.5 py-1.5 whitespace-nowrap z-10">
                <span className="flex items-center gap-0.5">
                  <img src="/coin.svg" alt="coin" className="w-3 h-3 shrink-0" />
                  1 = ₹1
                </span>
              </div>
            </div>
            {(minPriceInput || maxPriceInput) && <div className="w-2 h-2 bg-[#13097D] rounded-full"></div>}
          </div>
          {priceToggle ? <ChevronDown className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
        </div>
        {priceToggle && (
          <div className="flex flex-col gap-4 text-[#232323]">
            <hr className="h-px" />
            <div className="flex gap-3">
              <div className="flex flex-col gap-2">
                <p className="font-medium text-[14px]">Min Price</p>
                <div className="rounded-xl flex-1 h-11 border border-[#efefef] bg-white flex items-center px-3 gap-1.5 transition-all focus-within:border-[#13097D]/30">
                  <img src="/coin.svg" alt="coin" className="w-3.5 h-3.5 shrink-0 opacity-60" />
                  <input
                    type="text"
                    placeholder="100"
                    value={minPriceInput} 
                    onChange={(e) => setMinPriceInput(e.target.value)}
                    className="w-full h-full text-sm outline-none bg-transparent placeholder:text-[#718EBF]/80 placeholder:font-semibold"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-[14px] font-medium">Max Price</p>
                <div className="rounded-xl flex-1 h-11 border border-[#efefef] bg-white flex items-center px-3 gap-1.5 transition-all focus-within:border-[#13097D]/30">
                  <img src="/coin.svg" alt="coin" className="w-3.5 h-3.5 shrink-0 opacity-60" />
                  <input
                    type="text"
                    placeholder="10000"
                    value={maxPriceInput} 
                    onChange={(e) => setMaxPriceInput(e.target.value)}
                    className="w-full h-full text-sm outline-none bg-transparent placeholder:text-[#718EBF]/80 placeholder:font-semibold"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

       {/* Working Days */}
       <div className="flex flex-col gap-4 bg-white p-5 w-full max-w-[312px] rounded-xl border border-[#E6E6E6]">
        <div className="flex justify-between text-[#242645] cursor-pointer" onClick={() => setWorkingDaysToggle(!workingDaysToggle)}>
          <div className="flex items-center gap-2">
            <p>Working Days</p>
            {selectedDays.length > 0 && <div className="w-2 h-2 bg-[#13097D] rounded-full"></div>}
          </div>
          {workingDaysToggle ? <ChevronDown className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
        </div>
        {workingDaysToggle && (
          <div className="flex flex-col gap-4 text-[#232323]">
            <hr className="h-px" />
            <div className="flex flex-wrap gap-2.5">
              {days.map((day) => {
                const isSelected = selectedDays.includes(day);
                return (
                  <div key={day} onClick={() => toggleDay(day)} className={`cursor-pointer px-2.5 py-2 rounded-[10px] border text-sm font-medium transition-colors ${isSelected ? "bg-[#232323] text-white" : "bg-white hover:bg-gray-100"}`}>
                    {day}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );

  return (
    <div className="bg-gray-50 pt-20 min-h-screen">
      <main className="container mx-auto px-4 py-4">
        <div className="flex flex-col lg:flex-row gap-8 lg:items-start">
          
          <aside className="lg:w-[312px] lg:shrink-0 lg:sticky lg:top-24 lg:self-start">
            
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
                  <button onClick={() => setMobileFilterOpen(false)} className="p-2 rounded-full hover:bg-gray-100">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 pb-20">
                   <div className="flex flex-col gap-4 bg-white p-5 w-full rounded-xl mb-3">
                    <h3 className="text-[#242645] font-medium">Sort By</h3>
                    <Select value={selectedSort} onValueChange={setSelectedSort}>
                      <SelectTrigger className="w-full h-11 border border-[#efefef] bg-white rounded-xl px-3">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {sortTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex flex-col gap-3">
                    {filterContent}
                  </div>
                   
                   <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
                    <div className="flex gap-3">
                        <button onClick={clearAllFilters} className="flex-1 py-3 border border-gray-300 rounded-lg text-center font-medium">Clear All</button>
                        <button onClick={() => setMobileFilterOpen(false)} className="flex-1 py-3 bg-[#13097D] text-white rounded-lg font-medium">Apply</button>
                    </div>
                   </div>
                </div>
              </div>
            )}

            <div className={`hidden lg:flex flex-col gap-6 w-full max-h-[calc(100vh-7rem)] overflow-y-auto scrollbar-hide`}>
              <div className="flex justify-between w-full p-5 bg-white border border-[#E6E6E6] rounded-xl">
                <h2 className="flex gap-2"><img src="./filter.svg" alt="filter" className="w-6 h-6 text-[#13097D]" /> Filters</h2>
                <div className="bg-[#13097D] text-white w-7 h-7 flex items-center justify-center rounded-lg">{filterCount}</div>
              </div>

              {filterContent}

              <button onClick={clearAllFilters} className="w-full max-w-[312px] py-3 border border-gray-300 rounded-lg text-center font-medium hover:bg-gray-50">Clear All Filters</button>
            </div>
          </aside>

          <section className="flex-1 lg:min-w-0">
            <div className="flex justify-between">
              <h1 className="flex flex-col gap-2 mb-6 text-[16px] text-2xl font-bold">
                Find experienced education counsellors.
                <span className="text-[#8C8CA1] font-medium text-[14px] lg:text-[20px]">
                  Filter by expertise, language, availability, and pricing.
                </span>
              </h1>
              
              <div className="hidden sm:flex items-center gap-3">
                <p className="font-medium text-[16px] text-[#525055]">Sort By:</p>
                <Select value={selectedSort} onValueChange={setSelectedSort}>
                   <SelectTrigger className="w-[220px] h-11 border border-[#efefef] bg-white rounded-xl px-3 text-[16px] text-[#333]"><SelectValue placeholder="Popularity" /></SelectTrigger>
                   <SelectContent>
                      {sortTypes.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                   </SelectContent>
                </Select>
              </div>
            </div>

            {loading ? (
               <div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-4 border-[#13097D] border-t-transparent rounded-full"></div></div>
            ) : error ? (
               <div className="text-center text-red-500 py-10">{error}</div>
            ) : counselors.length === 0 ? (
               <div className="text-center text-gray-500 py-10">No counselors found matching your filters.</div>
            ) : (
               <>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 pb-8">
                  {counselors.map((counselor, index) => {
                    const cardData = adaptApiDataToCardData(counselor);
                    const isFavourite = favouriteIds.has(cardData.id);
                    // Attach the ref to the last element
                    if (index === counselors.length - 1) {
                        return (
                           <div key={counselor.counsellorId} ref={lastCounselorRef}>
                              <CounselorCard
                                counselor={cardData}
                                isFavourite={isFavourite}
                                onToggleFavourite={handleToggleFavourite}
                              />
                           </div>
                        )
                    }
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
                
                {fetchingMore && (
                  <div className="flex justify-center py-6 w-full">
                    <Loader2 className="animate-spin h-6 w-6 text-[#13097D]" />
                  </div>
                )}
                
                {!hasMore && counselors.length > 0 && (
                   <div className="text-center py-8 text-gray-500 font-medium">
                      You have reached the end
                   </div>
                )}
               </>
            )}
          </section>
        </div>
      </main>
      
      {user && (
        <EditProfileModal
          isOpen={isEditProfileModalOpen}
          onClose={handleCloseModal}
          user={user}
          onUpdate={handleUpdateProfile}
          onUploadComplete={() => {}}
        />
      )}
    </div>
  );
}