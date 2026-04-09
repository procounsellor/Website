import { probuddiesApi } from "@/api/pro-buddies";
import ListingShell from "@/components/Revamp/listing/ListingShell";
import ProBuddyCard, { ProbuddyPhoneListinCard } from "@/components/Revamp/probuddies/ProBuddyCard";
import { useAuthStore } from "@/store/AuthStore";
import type { ListingProBudddy } from "@/types/probuddies";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";

const sortOptions = [
  { value: "recommended", label: "Recommended" },
  { value: "rating", label: "Rating: High to Low" },
  { value: "coins-low", label: "ProCoins: Low to High" },
  { value: "coins-high", label: "ProCoins: High to Low" },
];

const getCoins = (item: ListingProBudddy): number => Number(item.ratePerMinute ?? 0);

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

  const sidebar = (
    <div className="space-y-3">
      <div className="flex items-center justify-between rounded-lg border border-[#D6DCE5] bg-white px-3 py-2">
        <h2 className="text-sm font-semibold text-(--text-main)">Filters</h2>
        <button
          onClick={() => {
            setStateFilter("");
            setCityFilter("");
            setCourseFilter("");
            setLanguageFilter("");
            setWorkingDayFilter("");
            setMinRating(0);
            setMaxRating(5);
            setCoinsRange([0, 500]);
          }}
          className="text-xs font-medium text-[#2F43F2]"
        >
          Reset
        </button>
      </div>

      <div className="rounded-lg border border-[#D6DCE5] bg-white p-3 space-y-2">
        <h3 className="text-sm font-semibold text-(--text-main)">Location & Profile</h3>
        <input
          type="text"
          value={stateFilter}
          onChange={(e) => setStateFilter(e.target.value)}
          placeholder="State (e.g. Maharashtra)"
          className="h-9 w-full rounded-lg border border-[#E5E7EB] bg-white px-2 text-sm"
        />
        <input
          type="text"
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
          placeholder="City (e.g. Mumbai)"
          list="probuddy-city-options"
          className="h-9 w-full rounded-lg border border-[#E5E7EB] bg-white px-2 text-sm"
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
          placeholder="Course (e.g. B.Tech)"
          className="h-9 w-full rounded-lg border border-[#E5E7EB] bg-white px-2 text-sm"
        />
      </div>

      <div className="rounded-lg border border-[#D6DCE5] bg-white p-3 space-y-2">
        <h3 className="text-sm font-semibold text-(--text-main)">Language & Day</h3>
        <input
          type="text"
          value={languageFilter}
          onChange={(e) => setLanguageFilter(e.target.value)}
          placeholder="Language (e.g. English)"
          className="h-9 w-full rounded-lg border border-[#E5E7EB] bg-white px-2 text-sm"
        />
        <select
          value={workingDayFilter}
          onChange={(e) => setWorkingDayFilter(e.target.value)}
          className="h-9 w-full rounded-lg border border-[#E5E7EB] bg-white px-2 text-sm"
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

      <div className="rounded-lg border border-[#D6DCE5] bg-white p-3">
        <h3 className="mb-2 text-sm font-semibold text-(--text-main)">ProCoins</h3>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            value={coinsRange[0]}
            onChange={(e) => setCoinsRange([Number(e.target.value || 0), coinsRange[1]])}
            className="h-9 rounded-lg border border-[#E5E7EB] bg-white px-2 text-sm"
          />
          <input
            type="number"
            value={coinsRange[1]}
            onChange={(e) => setCoinsRange([coinsRange[0], Number(e.target.value || 0)])}
            className="h-9 rounded-lg border border-[#E5E7EB] bg-white px-2 text-sm"
          />
        </div>
      </div>

      <div className="rounded-lg border border-[#D6DCE5] bg-white p-3">
        <h3 className="mb-2 text-sm font-semibold text-(--text-main)">Rating Range</h3>
        <div className="grid grid-cols-2 gap-2">
          <select
            value={minRating}
            onChange={(e) => setMinRating(Number(e.target.value))}
            className="h-9 rounded-lg border border-[#E5E7EB] bg-white px-2 text-sm"
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
            className="h-9 rounded-lg border border-[#E5E7EB] bg-white px-2 text-sm"
          >
            <option value={0}>Max 0</option>
            <option value={1}>Max 1</option>
            <option value={2}>Max 2</option>
            <option value={3}>Max 3</option>
            <option value={4}>Max 4</option>
            <option value={5}>Max 5</option>
          </select>
        </div>
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
            return (
              <div key={`${buddy.proBuddyId ?? "probuddy"}-${idx}`} className="w-full">
                <div className="md:hidden">
                  <ProbuddyPhoneListinCard
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
