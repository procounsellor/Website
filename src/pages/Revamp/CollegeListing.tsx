import ListingShell from "@/components/Revamp/listing/ListingShell";
import CollegeCard, { CollegeListingCard } from "@/components/Revamp/probuddies/CollegeCard";
import { useMemo, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

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
  const [openSection, setOpenSection] = useState<"city" | "courses" | null>("city");
  const [citySearch, setCitySearch] = useState("");

  const cityOptions = useMemo(
    () => Array.from(new Set(mockColleges.map((item) => item.city))).sort(),
    []
  );

  const filteredCityOptions = useMemo(
    () => cityOptions.filter((city) => city.toLowerCase().includes(citySearch.toLowerCase())),
    [cityOptions, citySearch]
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

  const toggleSection = (section: "city" | "courses") => {
    setOpenSection((prev) => (prev === section ? null : section));
  };

  const activeFilterCount = selectedCities.length + (minCourses > 0 ? 1 : 0);

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

      <div className={`box-border flex flex-col items-start mt-[12px] w-full bg-white border border-[#E6E6E6] rounded-[8px] ${openSection === "city" ? "pb-[16px]" : "pb-0"}`}>
        <button type="button" onClick={() => toggleSection("city")} className="box-border flex flex-row justify-between items-center px-[20px] py-[20px] w-full border-b border-[#E6E6E6] rounded-t-[8px] cursor-pointer">
          <h3 className="font-[Poppins] font-medium text-[16px] text-[#242645]">City</h3>
          {openSection === "city" ? <ChevronDown className="h-5 w-5 text-[#242645]" /> : <ChevronRight className="h-5 w-5 text-[#242645]" />}
        </button>
        {openSection === "city" && <div className="w-full px-5 flex flex-col gap-[16px]">
          <input
            type="text"
            value={citySearch}
            onChange={(e) => setCitySearch(e.target.value)}
            placeholder="Search city"
            className="h-[40px] w-full rounded-[12px] border border-[#EFEFEF] bg-white px-[12px] text-[14px] font-[Poppins]"
          />
          <div className="flex flex-col gap-[10px] max-h-[220px] overflow-y-auto scrollbar-hide">
          {filteredCityOptions.map((city) => (
            <div key={city} className="flex flex-row items-center gap-[12px] cursor-pointer" onClick={() => toggleCity(city)}>
              <div className={`box-border w-[18px] h-[18px] flex justify-center items-center ${selectedCities.includes(city) ? "bg-[#0E1629]" : "bg-white border border-[#CED1D9]"}`}>
                {selectedCities.includes(city) && <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2.5 7L5.5 10L11.5 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
              </div>
              <span className={`font-[Poppins] text-[14px] leading-[21px] ${selectedCities.includes(city) ? "font-medium text-[#0E1629]" : "font-normal text-[#6B7280]"}`}>{city}</span>
            </div>
          ))}
          </div>
        </div>}
      </div>

      <div className={`box-border flex flex-col items-start mt-[12px] w-full bg-white border border-[#E6E6E6] rounded-[8px] ${openSection === "courses" ? "pb-[16px]" : "pb-0"}`}>
        <button type="button" onClick={() => toggleSection("courses")} className="box-border flex flex-row justify-between items-center px-[20px] py-[20px] w-full border-b border-[#E6E6E6] rounded-t-[8px] cursor-pointer">
          <h3 className="font-[Poppins] font-medium text-[16px] text-[#242645]">Minimum Courses</h3>
          {openSection === "courses" ? <ChevronDown className="h-5 w-5 text-[#242645]" /> : <ChevronRight className="h-5 w-5 text-[#242645]" />}
        </button>
        {openSection === "courses" && <div className="w-full px-5"><input
          type="number"
          value={minCourses}
          onChange={(e) => setMinCourses(Number(e.target.value || 0))}
          className="h-[40px] w-full rounded-[12px] border border-[#EFEFEF] bg-white px-[12px] text-[14px] font-[Poppins]"
        /></div>}
      </div>

      <div className="hidden lg:block w-full mt-4 mb-[70px]">
        <button
          onClick={() => {
            setSelectedCities([]);
            setMinCourses(0);
          }}
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
