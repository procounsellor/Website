import ListingShell from "@/components/Revamp/listing/ListingShell";
import CollegeCard, { CollegeListingCard } from "@/components/Revamp/probuddies/CollegeCard";
import { useMemo, useState } from "react";

type CollegeItem = {
  id: number;
  name: string;
  city: string;
  category: string;
  courses: number;
};

const sortOptions = [
  { value: "recommended", label: "Recommended" },
  { value: "courses-high", label: "Courses: High to Low" },
  { value: "courses-low", label: "Courses: Low to High" },
  { value: "name", label: "Name: A to Z" },
];

const mockColleges: CollegeItem[] = [
  { id: 1, name: "IIT Bombay", city: "Mumbai", category: "engineering", courses: 62 },
  { id: 2, name: "AIIMS Delhi", city: "Delhi", category: "medical", courses: 38 },
  { id: 3, name: "IIM Ahmedabad", city: "Ahmedabad", category: "management", courses: 24 },
  { id: 4, name: "NLSIU Bengaluru", city: "Bengaluru", category: "law", courses: 15 },
  { id: 5, name: "BITS Pilani", city: "Pilani", category: "engineering", courses: 44 },
  { id: 6, name: "JIPMER", city: "Puducherry", category: "medical", courses: 21 },
  { id: 7, name: "XLRI", city: "Jamshedpur", category: "management", courses: 19 },
  { id: 8, name: "NLU Jodhpur", city: "Jodhpur", category: "law", courses: 17 },
];

export default function CollegeListing() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("recommended");
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [minCourses, setMinCourses] = useState(0);

  const cityOptions = useMemo(
    () => Array.from(new Set(mockColleges.map((item) => item.city))).sort(),
    []
  );

  const filteredColleges = useMemo(() => {
    let items = mockColleges.filter((item) => {
      const searchText = search.toLowerCase();
      const matchesSearch =
        item.name.toLowerCase().includes(searchText) ||
        item.city.toLowerCase().includes(searchText) ||
        item.category.toLowerCase().includes(searchText);
      const matchesCity = selectedCities.length === 0 || selectedCities.includes(item.city);
      const matchesCourses = item.courses >= minCourses;

      return matchesSearch && matchesCity && matchesCourses;
    });

    if (sortBy === "courses-high") {
      items = [...items].sort((a, b) => b.courses - a.courses);
    } else if (sortBy === "courses-low") {
      items = [...items].sort((a, b) => a.courses - b.courses);
    } else if (sortBy === "name") {
      items = [...items].sort((a, b) => a.name.localeCompare(b.name));
    }

    return items;
  }, [minCourses, search, selectedCities, sortBy]);

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
            setMinCourses(0);
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
        <h3 className="mb-2 text-sm font-semibold text-(--text-main)">Minimum Courses</h3>
        <input
          type="number"
          value={minCourses}
          onChange={(e) => setMinCourses(Number(e.target.value || 0))}
          className="h-9 w-full rounded-lg border border-[#E5E7EB] bg-white px-2 text-sm"
        />
      </div>
    </div>
  );

  const content = (
    <>
      <p className="mb-4 text-sm text-[#6B7280]">{filteredColleges.length} results found</p>

      {filteredColleges.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#D1D5DB] p-8 text-center text-[#6B7280]">
          No colleges match the selected filters.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-6">
          {filteredColleges.map((college) => (
            <div key={college.id} className="w-full">
              <div className="md:hidden">
                <CollegeListingCard />
              </div>
              <div className="hidden md:block">
                <CollegeCard />
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );

  return (
    <ListingShell
      title=""
      searchValue={search}
      onSearchChange={setSearch}
      searchPlaceholder="Search colleges"
      sortValue={sortBy}
      onSortChange={setSortBy}
      sortOptions={sortOptions}
      sidebar={sidebar}
      content={content}
    />
  );
}
