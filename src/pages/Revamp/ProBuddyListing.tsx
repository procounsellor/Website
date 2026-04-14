import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, ChevronRight, Info } from "lucide-react";

import { probuddiesApi } from "@/api/pro-buddies";
import ListingShell from "@/components/Revamp/listing/ListingShell";
import ProBuddyCard, { ProbuddyPhoneListinCard } from "@/components/Revamp/probuddies/ProBuddyCard";
import { useAuthStore } from "@/store/AuthStore";
import type { ListingProBudddy } from "@/types/probuddies";

const sortOptions = [
  { value: "recommended", label: "Recommended" },
  { value: "rating", label: "Rating: High to Low" },
  { value: "coins-low", label: "ProCoins: Low to High" },
  { value: "coins-high", label: "ProCoins: High to Low" },
];

const getCoins = (item: ListingProBudddy): number => Number(item.ratePerMinute ?? 0);

type OpenSection = "profile" | "language" | "coins" | "rating" | null;

export default function ProBuddyListing() {
  const { userId } = useAuthStore();
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("recommended");

  const [stateFilter, setStateFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [languageFilter, setLanguageFilter] = useState("");
  const [workingDayFilter, setWorkingDayFilter] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [maxRating, setMaxRating] = useState(5);
  const [coinsRange, setCoinsRange] = useState<[number, number]>([0, 500]);
  const [showCoinsTooltip, setShowCoinsTooltip] = useState(false);
  const [openSection, setOpenSection] = useState<OpenSection>("profile");

  const sortMapping = useMemo(() => {
    if (sortBy === "coins-low") {
      return { sortBy: "ratePerMinute", sortOrder: "asc" as const };
    }
    if (sortBy === "coins-high") {
      return { sortBy: "ratePerMinute", sortOrder: "desc" as const };
    }
    return { sortBy: "rating", sortOrder: "desc" as const };
  }, [sortBy]);

  const { data: probuddies = [], isLoading } = useQuery({
    queryKey: [
      "pro-buddies-listing",
      userId ?? "guest",
      stateFilter,
      cityFilter,
      courseFilter,
      languageFilter,
      workingDayFilter,
      minRating,
      maxRating,
      coinsRange[0],
      coinsRange[1],
      sortMapping.sortBy,
      sortMapping.sortOrder,
    ],
    queryFn: () =>
      probuddiesApi.listing(userId ?? null, {
        state: stateFilter,
        city: cityFilter,
        course: courseFilter,
        languagesKnow: languageFilter,
        workingDays: workingDayFilter,
        minRatePerMinute: coinsRange[0],
        maxRatePerMinute: coinsRange[1],
        minRating,
        maxRating,
        sortBy: sortMapping.sortBy,
        sortOrder: sortMapping.sortOrder,
        page: 0,
        pageSize: 10,
      }),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const cityOptions = useMemo(
    () => Array.from(new Set(probuddies.map((item) => item.city).filter(Boolean) as string[])).sort(),
    [probuddies]
  );

  const filteredBuddies = useMemo(() => {
    let items = probuddies.filter((item) => {
      const name = `${item.firstName ?? ""} ${item.lastName ?? ""}`.trim().toLowerCase();
      const searchText = search.toLowerCase();
      const city = (item.city ?? "Not specified").toLowerCase();
      const coins = getCoins(item);

      const matchesSearch =
        name.includes(searchText) ||
        (item.collegeName ?? "").toLowerCase().includes(searchText) ||
        (item.course ?? "").toLowerCase().includes(searchText) ||
        city.includes(searchText);

      const matchesCoins = coins >= coinsRange[0] && coins <= coinsRange[1];

      return matchesSearch && matchesCoins;
    });

    if (sortBy === "rating") {
      items = [...items].sort((a, b) => Number(b.rating ?? 0) - Number(a.rating ?? 0));
    } else if (sortBy === "coins-low") {
      items = [...items].sort((a, b) => getCoins(a) - getCoins(b));
    } else if (sortBy === "coins-high") {
      items = [...items].sort((a, b) => getCoins(b) - getCoins(a));
    }

    return items;
  }, [coinsRange, probuddies, search, sortBy]);

  const isCoinsChanged = coinsRange[0] > 0 || coinsRange[1] < 500;
  const activeFilterCount =
    (stateFilter ? 1 : 0) +
    (cityFilter ? 1 : 0) +
    (courseFilter ? 1 : 0) +
    (languageFilter ? 1 : 0) +
    (workingDayFilter ? 1 : 0) +
    (minRating > 0 || maxRating < 5 ? 1 : 0) +
    (isCoinsChanged ? 1 : 0);

  const toggleSection = (section: Exclude<OpenSection, null>) => {
    setOpenSection((prev) => (prev === section ? null : section));
  };

  const resetFilters = () => {
    setStateFilter("");
    setCityFilter("");
    setCourseFilter("");
    setLanguageFilter("");
    setWorkingDayFilter("");
    setMinRating(0);
    setMaxRating(5);
    setCoinsRange([0, 500]);
  };

  const sidebar = (
    <div className="w-full">
      <div className="box-border flex flex-row justify-between items-center px-5 py-4 w-full h-[64px] bg-white border border-[#E6E6E6] rounded-[8px]">
        <div className="flex flex-row justify-center items-center gap-[12px]">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0E1629" strokeWidth="1.5" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
            <circle cx="8" cy="6" r="2" fill="white" />
            <circle cx="16" cy="12" r="2" fill="white" />
            <circle cx="11" cy="18" r="2" fill="white" />
          </svg>
          <span className="font-[Poppins] font-semibold text-[16px] text-[#0E1629]">Filters</span>
        </div>
        {activeFilterCount > 0 && (
          <div className="flex flex-col justify-center items-center px-[10px] py-[6px] w-[28px] h-[28px] bg-[#0E1629] rounded-[4px]">
            <span className="font-[Arial] font-semibold text-[12px] text-white">{activeFilterCount}</span>
          </div>
        )}
      </div>

      <div className={`box-border flex flex-col items-start mt-[12px] w-full bg-white border border-[#E6E6E6] rounded-[8px] ${openSection === "profile" ? "pb-[16px]" : "pb-0"}`}>
        <button type="button" onClick={() => toggleSection("profile")} className="box-border flex flex-row justify-between items-center px-[20px] py-[20px] w-full border-b border-[#E6E6E6] rounded-t-[8px] cursor-pointer">
          <h3 className="font-[Poppins] font-medium text-[16px] text-[#242645]">Location & Profile</h3>
          {openSection === "profile" ? <ChevronDown className="h-5 w-5 text-[#242645]" /> : <ChevronRight className="h-5 w-5 text-[#242645]" />}
        </button>
        {openSection === "profile" && (
          <div className="w-full px-5 flex flex-col gap-[10px]">
            <input
              type="text"
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              placeholder="State"
              className="h-[40px] w-full rounded-[12px] border border-[#EFEFEF] bg-white px-[12px] text-[14px] font-[Poppins]"
            />
            <input
              type="text"
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              placeholder="City"
              list="probuddy-city-options"
              className="h-[40px] w-full rounded-[12px] border border-[#EFEFEF] bg-white px-[12px] text-[14px] font-[Poppins]"
            />
            <datalist id="probuddy-city-options">
              {cityOptions.map((city) => (
                <option key={city} value={city} />
              ))}
            </datalist>
            <input
              type="text"
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              placeholder="Course"
              className="h-[40px] w-full rounded-[12px] border border-[#EFEFEF] bg-white px-[12px] text-[14px] font-[Poppins]"
            />
          </div>
        )}
      </div>

      <div className={`box-border flex flex-col items-start mt-[12px] w-full bg-white border border-[#E6E6E6] rounded-[8px] ${openSection === "language" ? "pb-[16px]" : "pb-0"}`}>
        <button type="button" onClick={() => toggleSection("language")} className="box-border flex flex-row justify-between items-center px-[20px] py-[20px] w-full border-b border-[#E6E6E6] rounded-t-[8px] cursor-pointer">
          <h3 className="font-[Poppins] font-medium text-[16px] text-[#242645]">Language & Day</h3>
          {openSection === "language" ? <ChevronDown className="h-5 w-5 text-[#242645]" /> : <ChevronRight className="h-5 w-5 text-[#242645]" />}
        </button>
        {openSection === "language" && (
          <div className="w-full px-5 flex flex-col gap-[10px]">
            <input
              type="text"
              value={languageFilter}
              onChange={(e) => setLanguageFilter(e.target.value)}
              placeholder="Language"
              className="h-[40px] w-full rounded-[12px] border border-[#EFEFEF] bg-white px-[12px] text-[14px] font-[Poppins]"
            />
            <select
              value={workingDayFilter}
              onChange={(e) => setWorkingDayFilter(e.target.value)}
              className="h-[40px] w-full rounded-[12px] border border-[#EFEFEF] bg-white px-[12px] text-[14px] font-[Poppins]"
            >
              <option value="">Any day</option>
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
              <option value="Saturday">Saturday</option>
              <option value="Sunday">Sunday</option>
            </select>
          </div>
        )}
      </div>

      <div className={`box-border flex flex-col items-start mt-[12px] w-full bg-white border border-[#E6E6E6] rounded-[8px] ${openSection === "coins" ? "pb-[16px] gap-[16px]" : "pb-0 gap-0"}`}>
        <button type="button" onClick={() => toggleSection("coins")} className="box-border flex flex-row justify-between items-center px-[20px] py-[20px] w-full border-b border-[#E6E6E6] rounded-t-[8px] cursor-pointer">
          <span className="flex items-center gap-2 font-[Poppins] font-medium text-[16px] text-[#242645]">
            ProCoins
            <span className="relative group inline-flex">
              <Info
                className="w-4 h-4 text-[#9CA3AF] cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowCoinsTooltip((prev) => !prev);
                }}
              />
              <span className={`absolute left-1/2 -translate-x-1/2 top-full mt-1 ${showCoinsTooltip ? "flex" : "hidden"} lg:group-hover:flex items-center justify-center min-w-[84px] gap-1.5 bg-[#0E1629] text-white text-[12px] leading-none rounded px-2.5 py-1.5 whitespace-nowrap z-20 shadow-[0_6px_18px_rgba(0,0,0,0.25)]`}>
                <img src="/coin.svg" alt="coin" className="w-3 h-3" />
                <span className="font-semibold">1 = ₹1</span>
              </span>
            </span>
          </span>
          {openSection === "coins" ? <ChevronDown className="h-5 w-5 text-[#242645]" /> : <ChevronRight className="h-5 w-5 text-[#242645]" />}
        </button>
        {openSection === "coins" && (
          <div className="w-full px-5 flex flex-row justify-between gap-4">
            <div className="flex flex-col gap-[5px] flex-1">
              <span className="font-[Poppins] font-medium text-[12px] text-[#232323]">Min Coins</span>
              <div className="box-border w-full h-[36px] bg-white border border-[#EFEFEF] rounded-[12px] flex items-center px-[12px]">
                <img src="/coin.svg" alt="coin" className="w-3.5 h-3.5 shrink-0 opacity-70" />
                <input
                  type="number"
                  value={coinsRange[0]}
                  onChange={(e) => setCoinsRange([Number(e.target.value || 0), coinsRange[1]])}
                  className="w-full h-full bg-transparent outline-none font-[Poppins] font-semibold text-[14px] text-[#6B7280] ml-1"
                />
              </div>
            </div>
            <div className="flex flex-col gap-[5px] flex-1">
              <span className="font-[Poppins] font-medium text-[12px] text-[#232323]">Max Coins</span>
              <div className="box-border w-full h-[36px] bg-white border border-[#EFEFEF] rounded-[12px] flex items-center px-[12px]">
                <img src="/coin.svg" alt="coin" className="w-3.5 h-3.5 shrink-0 opacity-70" />
                <input
                  type="number"
                  value={coinsRange[1]}
                  onChange={(e) => setCoinsRange([coinsRange[0], Number(e.target.value || 0)])}
                  className="w-full h-full bg-transparent outline-none font-[Poppins] font-semibold text-[14px] text-[#6B7280] ml-1"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className={`box-border flex flex-col items-start mt-[12px] w-full bg-white border border-[#E6E6E6] rounded-[8px] ${openSection === "rating" ? "pb-[16px]" : "pb-0"}`}>
        <button type="button" onClick={() => toggleSection("rating")} className="box-border flex flex-row justify-between items-center px-[20px] py-[20px] w-full border-b border-[#E6E6E6] rounded-t-[8px] cursor-pointer">
          <h3 className="font-[Poppins] font-medium text-[16px] text-[#242645]">Rating Range</h3>
          {openSection === "rating" ? <ChevronDown className="h-5 w-5 text-[#242645]" /> : <ChevronRight className="h-5 w-5 text-[#242645]" />}
        </button>
        {openSection === "rating" && (
          <div className="w-full px-5 grid grid-cols-2 gap-3">
            <select
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
              className="h-[40px] rounded-[12px] border border-[#EFEFEF] bg-white px-[12px] text-[14px] font-[Poppins]"
            >
              <option value={0}>Min 0</option>
              <option value={1}>Min 1</option>
              <option value={2}>Min 2</option>
              <option value={3}>Min 3</option>
              <option value={4}>Min 4</option>
              <option value={5}>Min 5</option>
            </select>

            <select
              value={maxRating}
              onChange={(e) => setMaxRating(Number(e.target.value))}
              className="h-[40px] rounded-[12px] border border-[#EFEFEF] bg-white px-[12px] text-[14px] font-[Poppins]"
            >
              <option value={0}>Max 0</option>
              <option value={1}>Max 1</option>
              <option value={2}>Max 2</option>
              <option value={3}>Max 3</option>
              <option value={4}>Max 4</option>
              <option value={5}>Max 5</option>
            </select>
          </div>
        )}
      </div>

      <div className="hidden lg:block w-full mt-4 mb-[70px]">
        <button
          onClick={resetFilters}
          disabled={activeFilterCount === 0}
          className={`w-full h-[48px] rounded-[8px] font-[Poppins] font-medium text-[16px] transition-all border outline-none ${
            activeFilterCount > 0
              ? "bg-white border-[#0E1629] text-[#0E1629] hover:bg-[#F8F9FA] cursor-pointer"
              : "bg-[#F9F9F9] border-[#E6E6E6] text-[#A0A0A0] cursor-not-allowed"
          }`}
        >
          Clear Filters
        </button>
      </div>
    </div>
  );

  const content = isLoading ? (
    <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-6">
      {Array.from({ length: 6 }).map((_, idx) => (
        <div key={`probuddy-skeleton-${idx}`} className="h-66.5 rounded-xl bg-white/90 animate-pulse md:h-91.75" />
      ))}
    </div>
  ) : (
    <>
      <p className="mb-4 text-sm text-[#6B7280]">{filteredBuddies.length} results found</p>

      {filteredBuddies.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#D1D5DB] p-8 text-center text-[#6B7280]">
          No ProBuddies match the selected filters.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-6">
          {filteredBuddies.map((buddy, idx) => {
            const name = `${buddy.firstName ?? ""} ${buddy.lastName ?? ""}`.trim();
            const identifier = buddy.proBuddyId || "";
            return (
              <div key={`${identifier}-${idx}`} className="w-full">
                <div className="md:hidden">
                  <ProbuddyPhoneListinCard
                    id={buddy.proBuddyId ?? String(idx)}
                    name={name}
                    imageUrl={buddy.photoUrl ?? ""}
                    rating={Number(buddy.rating ?? 0)}
                    yearLabel={buddy.collegeName ?? ""}
                    city={buddy.city ?? ""}
                    proCoins={getCoins(buddy)}
                  />
                </div>
                <div className="hidden md:block">
                  <ProBuddyCard
                    id={buddy.proBuddyId ?? String(idx)}
                    name={name}
                    imageUrl={buddy.photoUrl ?? ""}
                    rating={Number(buddy.rating ?? 0)}
                    yearLabel={buddy.collegeName ?? ""}
                    city={buddy.city ?? ""}
                    proCoins={getCoins(buddy)}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );

  return (
    <ListingShell
      title=""
      searchValue={search}
      onSearchChange={setSearch}
      searchPlaceholder="Search ProBuddies"
      sortValue={sortBy}
      onSortChange={setSortBy}
      sortOptions={sortOptions}
      sidebar={sidebar}
      content={content}
    />
  );
}
