import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight, ChevronDown, ChevronRight, MapPin } from "lucide-react";
import ListingShell from "@/components/Revamp/listing/ListingShell";
import PageSEO from "@/components/SEO/PageSEO";
import ErrorState from "@/components/common/ErrorState";
import { academicApi } from "@/api/academic";
import { COLLEGES_SNAPSHOT } from "@/data/contentSnapshot";
import type { CollegeApiResponse } from "@/types/academic";

// Same build-time seed the home page section uses. The API is blocked during
// prerender, so without it this page would ship as filter chrome with no
// colleges — and, worse, with no <a> to any /college-details/:id.
const SNAPSHOT = COLLEGES_SNAPSHOT as unknown as CollegeApiResponse[];

const sortOptions = [
  { value: "recommended", label: "Recommended" },
  { value: "name", label: "Name: A to Z" },
  { value: "established-new", label: "Established: Newest" },
  { value: "established-old", label: "Established: Oldest" },
];

const fallbackLogo = (name: string) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=F3F4F6&color=374151&size=400`;

function CollegeGridCard({ college }: { college: CollegeApiResponse }) {
  const location = [college.collegesLocationCity, college.collegesLocationState]
    .filter(Boolean)
    .join(", ");

  return (
    <article className="group relative flex h-full flex-col rounded-2xl border border-[#E6E6E6] bg-white p-4 transition-all duration-200 hover:border-[#0E1629] hover:shadow-[0_6px_24px_rgba(14,22,41,0.08)] md:p-5">
      <div className="flex items-start gap-3 md:gap-4">
        <img
          loading="lazy"
          decoding="async"
          src={college.logoUrl || fallbackLogo(college.collegeName)}
          alt=""
          className="h-14 w-14 shrink-0 rounded-xl object-cover md:h-16 md:w-16"
        />
        <div className="min-w-0 flex-1">
          <h2 className="font-[Poppins] text-[14px] leading-snug font-medium text-[#0E1629] md:text-[16px]">
            {/* A real href — the crawl path to every college detail page runs
                through this listing now, not through the home page reveal. */}
            <Link
              to={`/college-details/${college.collegeId}`}
              className="line-clamp-2 after:absolute after:inset-0 after:content-[''] hover:underline"
            >
              {college.collegeName}
            </Link>
          </h2>
          {location && (
            <p className="mt-1.5 flex items-center gap-1 font-[Poppins] text-[12px] text-[#6B7280] md:text-[13px]">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span className="line-clamp-1">{location}</span>
            </p>
          )}
        </div>
        <ArrowUpRight className="h-5 w-5 shrink-0 text-[#D1D5DB] transition-colors group-hover:text-[#0E1629]" />
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {college.collegeType && (
          <span className="rounded-full bg-[#F3F4F6] px-2.5 py-1 font-[Poppins] text-[11px] font-medium text-[#0E1629] md:text-[12px]">
            {college.collegeType}
          </span>
        )}
        {college.establishedYear && (
          <span className="rounded-full bg-[#F3F4F6] px-2.5 py-1 font-[Poppins] text-[11px] font-medium text-[#6B7280] md:text-[12px]">
            Est. {college.establishedYear}
          </span>
        )}
        {college.accreditation && (
          <span className="rounded-full bg-[#F3F4F6] px-2.5 py-1 font-[Poppins] text-[11px] font-medium text-[#6B7280] md:text-[12px]">
            {college.accreditation}
          </span>
        )}
      </div>
    </article>
  );
}

export default function CollegesPage() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("recommended");
  const [stateFilter, setStateFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [openSection, setOpenSection] = useState<"location" | "type" | null>("location");

  const { data: colleges = [], isLoading, isError, refetch } = useQuery({
    queryKey: ["colleges-listing"],
    queryFn: () => academicApi.getColleges(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    initialData: SNAPSHOT.length ? SNAPSHOT : undefined,
    initialDataUpdatedAt: 0,
    placeholderData: (previous) => previous,
  });

  const collegeTypes = useMemo(
    () =>
      Array.from(
        new Set(colleges.map((c) => (c.collegeType || "").trim()).filter(Boolean)),
      ).sort(),
    [colleges],
  );

  const filteredColleges = useMemo(() => {
    const query = search.trim().toLowerCase();
    const place = stateFilter.trim().toLowerCase();

    let items = colleges.filter((college) => {
      const matchesSearch =
        !query ||
        college.collegeName.toLowerCase().includes(query) ||
        (college.collegesLocationCity ?? "").toLowerCase().includes(query) ||
        (college.collegesLocationState ?? "").toLowerCase().includes(query);
      const matchesPlace =
        !place ||
        (college.collegesLocationCity ?? "").toLowerCase().includes(place) ||
        (college.collegesLocationState ?? "").toLowerCase().includes(place);
      const matchesType = !typeFilter || college.collegeType === typeFilter;
      return matchesSearch && matchesPlace && matchesType;
    });

    const year = (c: CollegeApiResponse) => Number(c.establishedYear) || 0;
    if (sortBy === "name") {
      items = [...items].sort((a, b) => a.collegeName.localeCompare(b.collegeName));
    } else if (sortBy === "established-new") {
      items = [...items].sort((a, b) => year(b) - year(a));
    } else if (sortBy === "established-old") {
      items = [...items].sort((a, b) => year(a) - year(b));
    } else {
      items = [...items].sort(
        (a, b) => (b.popularityCount ?? 0) - (a.popularityCount ?? 0),
      );
    }

    return items;
  }, [colleges, search, stateFilter, typeFilter, sortBy]);

  const activeFilterCount = (stateFilter ? 1 : 0) + (typeFilter ? 1 : 0);
  const toggleSection = (section: "location" | "type") =>
    setOpenSection((prev) => (prev === section ? null : section));

  const sidebar = (
    <div className="w-full">
      <div className="box-border flex h-[64px] w-full flex-row items-center justify-between rounded-[8px] border border-[#E6E6E6] bg-white px-5 py-4">
        <span className="font-[Poppins] text-[16px] font-semibold text-[#0E1629]">Filters</span>
        {activeFilterCount > 0 && (
          <span className="flex h-[28px] w-[28px] items-center justify-center rounded-[4px] bg-[#0E1629] text-[12px] font-semibold text-white">
            {activeFilterCount}
          </span>
        )}
      </div>

      <div className="mt-[12px] w-full rounded-[8px] border border-[#E6E6E6] bg-white">
        <button
          type="button"
          onClick={() => toggleSection("location")}
          className="flex w-full cursor-pointer flex-row items-center justify-between border-b border-[#E6E6E6] px-5 py-5"
        >
          <h3 className="font-[Poppins] text-[16px] font-medium text-[#242645]">Location</h3>
          {openSection === "location" ? (
            <ChevronDown className="h-5 w-5 text-[#242645]" />
          ) : (
            <ChevronRight className="h-5 w-5 text-[#242645]" />
          )}
        </button>
        {openSection === "location" && (
          <div className="w-full px-5 py-4">
            <input
              type="text"
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              placeholder="City or State"
              className="h-[40px] w-full rounded-[12px] border border-[#EFEFEF] bg-white px-[12px] font-[Poppins] text-[14px] outline-none focus:border-[#0E1629]"
            />
          </div>
        )}
      </div>

      {collegeTypes.length > 0 && (
        <div className="mt-[12px] w-full rounded-[8px] border border-[#E6E6E6] bg-white">
          <button
            type="button"
            onClick={() => toggleSection("type")}
            className="flex w-full cursor-pointer flex-row items-center justify-between border-b border-[#E6E6E6] px-5 py-5"
          >
            <h3 className="font-[Poppins] text-[16px] font-medium text-[#242645]">College type</h3>
            {openSection === "type" ? (
              <ChevronDown className="h-5 w-5 text-[#242645]" />
            ) : (
              <ChevronRight className="h-5 w-5 text-[#242645]" />
            )}
          </button>
          {openSection === "type" && (
            <div className="flex w-full flex-wrap gap-2 px-5 py-4">
              {collegeTypes.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setTypeFilter((prev) => (prev === type ? "" : type))}
                  className={`cursor-pointer rounded-full border px-3 py-1.5 font-[Poppins] text-[12px] transition-colors ${
                    typeFilter === type
                      ? "border-[#0E1629] bg-[#0E1629] text-white"
                      : "border-[#E6E6E6] bg-white text-[#242645] hover:border-[#0E1629]"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="mt-4 mb-[70px] hidden w-full lg:block">
        <button
          type="button"
          onClick={() => {
            setStateFilter("");
            setTypeFilter("");
          }}
          disabled={activeFilterCount === 0}
          className={`h-[48px] w-full rounded-[8px] border font-[Poppins] text-[16px] font-medium transition-all outline-none ${
            activeFilterCount > 0
              ? "cursor-pointer border-[#0E1629] bg-white text-[#0E1629] hover:bg-[#F8F9FA]"
              : "cursor-not-allowed border-[#E6E6E6] bg-[#F9F9F9] text-[#A0A0A0]"
          }`}
        >
          Clear Filters
        </button>
      </div>
    </div>
  );

  // The heading sits outside the loading/error branches so the page always has
  // exactly one <h1>, prerendered or not.
  const header = (
    <>
      <h1 className="mb-2 font-[Poppins] text-[20px] font-semibold text-[#0E1629] md:text-[26px]">
        Colleges on ProCounsel
      </h1>
      <p className="mb-5 max-w-3xl font-[Poppins] text-[13px] leading-relaxed text-[#6B7280] md:text-[15px]">
        Browse verified college profiles, compare location and program fit, and
        shortlist the right institutes for your admission goals.
      </p>
    </>
  );

  const body =
    isError && colleges.length === 0 ? (
      <ErrorState
        variant="inline"
        title="Couldn't load colleges"
        message="We couldn't reach the college directory. Please try again in a moment."
        onRetry={() => refetch()}
        showBack={false}
      />
    ) : isLoading ? (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-5 xl:grid-cols-3">
        {Array.from({ length: 9 }).map((_, idx) => (
          <div
            key={`college-skeleton-${idx}`}
            className="h-[160px] animate-pulse rounded-2xl bg-white/90"
          />
        ))}
      </div>
    ) : (
      <>
        <p className="mb-4 text-sm text-[#6B7280]">
          {filteredColleges.length} {filteredColleges.length === 1 ? "college" : "colleges"} found
        </p>

        {filteredColleges.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#D1D5DB] p-8 text-center text-[#6B7280]">
            No colleges match the selected filters.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-5 xl:grid-cols-3">
            {filteredColleges.map((college) => (
              <CollegeGridCard key={college.collegeId} college={college} />
            ))}
          </div>
        )}
      </>
    );

  const content = (
    <>
      {header}
      {body}
    </>
  );

  return (
    <>
      <PageSEO
        title="Colleges in India — Verified Profiles, Courses & Admissions | ProCounsel"
        description="Browse verified college profiles on ProCounsel. Compare location, college type, courses offered and admission details to shortlist the right institute."
        canonical="/colleges"
      />
      {/* No `title` prop: ListingShell renders it as its own <h1>, and the page
          already has one in the content column. */}
      <ListingShell
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search colleges, city or state"
        sortValue={sortBy}
        onSortChange={setSortBy}
        sortOptions={sortOptions}
        sidebar={sidebar}
        content={content}
      />
    </>
  );
}
