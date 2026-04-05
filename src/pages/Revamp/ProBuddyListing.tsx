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
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [coinsRange, setCoinsRange] = useState<[number, number]>([0, 500]);

  const { data: probuddies = [], isLoading } = useQuery({
    queryKey: ["pro-buddies-listing", userId],
    queryFn: () => probuddiesApi.listing((userId as string) ?? ""),
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

      const matchesCity = selectedCities.length === 0 || selectedCities.includes(item.city ?? "Not specified");
      const matchesCoins = coins >= coinsRange[0] && coins <= coinsRange[1];

      return matchesSearch && matchesCity && matchesCoins;
    });

    if (sortBy === "rating") {
      items = [...items].sort((a, b) => Number(b.rating ?? 0) - Number(a.rating ?? 0));
    } else if (sortBy === "coins-low") {
      items = [...items].sort((a, b) => getCoins(a) - getCoins(b));
    } else if (sortBy === "coins-high") {
      items = [...items].sort((a, b) => getCoins(b) - getCoins(a));
    }

    return items;
  }, [coinsRange, probuddies, search, selectedCities, sortBy]);

  const toggleCity = (city: string) => {
    setSelectedCities((prev) =>
      prev.includes(city) ? prev.filter((item) => item !== city) : [...prev, city]
    );
  };

  const sidebar = (
    <div className="space-y-3">
      <div className="flex items-center justify-between rounded-lg border border-[#D6DCE5] bg-white px-3 py-2">
        <h2 className="text-sm font-semibold text-(--text-main)">Filters</h2>
        <button
          onClick={() => {
            setSelectedCities([]);
            setCoinsRange([0, 500]);
          }}
          className="text-xs font-medium text-[#2F43F2]"
        >
          Reset
        </button>
      </div>

      <div className="rounded-lg border border-[#D6DCE5] bg-white p-3">
        <h3 className="mb-2 text-sm font-semibold text-(--text-main)">City</h3>
        <div className="space-y-2">
          {cityOptions.map((city) => (
            <label key={city} className="flex items-center gap-2 text-sm text-(--text-main)">
              <input
                type="checkbox"
                checked={selectedCities.includes(city)}
                onChange={() => toggleCity(city)}
              />
              <span>{city}</span>
            </label>
          ))}
        </div>
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
