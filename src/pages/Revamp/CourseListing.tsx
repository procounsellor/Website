import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import MobileCourseBottomNav from "@/components/Revamp/courses/MobileCourseBottomNav";
import CourseCard from "@/components/Revamp/courses/CourseCard";
import ListingShell from "@/components/Revamp/listing/ListingShell";
import {
  getAllCounsellorCoursesForGuest,
  getAllCounsellorCoursesForUser,
} from "@/api/course";
import type { CourseType } from "@/types/course";

type CourseListItem = {
  course: CourseType;
  soldCount: number;
  purchased: boolean;
};

const normalizeCourses = (response: any): CourseListItem[] => {
  const list = Array.isArray(response?.data) ? response.data : [];
  return list.map((item: any, index: number) => ({
    course: {
      id: String(item?.courseId ?? `course-${index}`),
      name: String(item?.courseName ?? "Course"),
      image: String(item?.courseThumbnailUrl ?? "/course/2.png"),
      subject: String(item?.category ?? "General"),
      price: `₹${Number(item?.coursePriceAfterDiscount ?? item?.coursePrice ?? 0).toLocaleString("en-IN")}`,
      rating: String(Number(item?.rating ?? 0).toFixed(1)),
      courseTimeHours: Number(item?.courseTimeHours ?? 0),
      courseTimeMinutes: Number(item?.courseTimeMinutes ?? 0),
    },
    soldCount: Number(item?.soldCount ?? 0),
    purchased: Boolean(item?.purchasedByMe ?? false),
  }));
};

const sortOptions = [
  { value: "recommended", label: "Recommended" },
  { value: "rating", label: "Rating: High to Low" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
];

const PAGE_SIZE = 6;

export default function CourseListing() {
  const userId = localStorage.getItem("phone") || "";
  const token = localStorage.getItem("jwt") || "";
  const isUserLoggedIn = Boolean(userId && token);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("recommended");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [minRating, setMinRating] = useState(0);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const { data, isLoading } = useQuery({
    queryKey: ["course-listing", isUserLoggedIn ? userId : "guest"],
    queryFn: () =>
      isUserLoggedIn
        ? getAllCounsellorCoursesForUser(userId)
        : getAllCounsellorCoursesForGuest(),
    enabled: !isUserLoggedIn || Boolean(userId),
  });

  const courses = useMemo(() => normalizeCourses(data), [data]);

  const categoryOptions = useMemo(
    () => Array.from(new Set(courses.map((item) => item.course.subject))).sort(),
    [courses]
  );

  const filteredCourses = useMemo(() => {
    let items = courses.filter((course) => {
      const numericPrice = Number(String(course.course.price).replace(/[^0-9.]/g, "") || 0);
      const numericRating = Number(course.course.rating ?? 0);

      const matchesSearch = course.course.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        selectedCategories.length === 0 || selectedCategories.includes(course.course.subject);
      const matchesPrice = numericPrice >= priceRange[0] && numericPrice <= priceRange[1];
      const matchesRating = numericRating >= minRating;

      return matchesSearch && matchesCategory && matchesPrice && matchesRating;
    });

    if (sortBy === "rating") {
      items = [...items].sort((a, b) => Number(b.course.rating ?? 0) - Number(a.course.rating ?? 0));
    } else if (sortBy === "price-low") {
      items = [...items].sort(
        (a, b) =>
          Number(String(a.course.price).replace(/[^0-9.]/g, "") || 0) -
          Number(String(b.course.price).replace(/[^0-9.]/g, "") || 0)
      );
    } else if (sortBy === "price-high") {
      items = [...items].sort(
        (a, b) =>
          Number(String(b.course.price).replace(/[^0-9.]/g, "") || 0) -
          Number(String(a.course.price).replace(/[^0-9.]/g, "") || 0)
      );
    } else {
      items = [...items].sort((a, b) => b.soldCount - a.soldCount);
    }

    return items;
  }, [courses, minRating, priceRange, search, selectedCategories, sortBy]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [search, sortBy, selectedCategories, priceRange, minRating]);

  const visibleCourses = useMemo(
    () => filteredCourses.slice(0, visibleCount),
    [filteredCourses, visibleCount]
  );
  const hasMoreCourses = visibleCount < filteredCourses.length;

  const toggleCategory = (value: string) => {
    setSelectedCategories((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  const sidebar = (
    <div className="space-y-3">
      <div className="flex items-center justify-between rounded-lg border border-[#D6DCE5] bg-white px-3 py-2">
        <h2 className="text-sm font-semibold text-(--text-main)">Filters</h2>
        <button
          onClick={() => {
            setSelectedCategories([]);
            setPriceRange([0, 100000]);
            setMinRating(0);
          }}
          className="text-xs font-medium text-[#2F43F2]"
        >
          Reset
        </button>
      </div>

      <div className="rounded-lg border border-[#D6DCE5] bg-white p-3">
        <h3 className="mb-2 text-sm font-semibold text-(--text-main)">Category</h3>
        <div className="space-y-2">
          {categoryOptions.map((option) => (
            <label key={option} className="flex items-center gap-2 text-sm text-(--text-main)">
              <input
                type="checkbox"
                checked={selectedCategories.includes(option)}
                onChange={() => toggleCategory(option)}
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-[#D6DCE5] bg-white p-3">
        <h3 className="mb-2 text-sm font-semibold text-(--text-main)">Price Range</h3>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            value={priceRange[0]}
            onChange={(e) => setPriceRange([Number(e.target.value || 0), priceRange[1]])}
            className="h-9 rounded-lg border border-[#E5E7EB] bg-white px-2 text-sm"
          />
          <input
            type="number"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value || 0)])}
            className="h-9 rounded-lg border border-[#E5E7EB] bg-white px-2 text-sm"
          />
        </div>

        <div className="mt-3 space-y-2">
          <input
            type="range"
            min={0}
            max={100000}
            step={500}
            value={priceRange[1]}
            onChange={(e) => {
              const nextMax = Number(e.target.value);
              setPriceRange([priceRange[0], Math.max(nextMax, priceRange[0])]);
            }}
            className="w-full accent-(--text-main)"
          />
          <div className="flex items-center justify-between text-[11px] text-[#6B7280]">
            <span>Min: ₹{priceRange[0].toLocaleString("en-IN")}</span>
            <span>Max: ₹{priceRange[1].toLocaleString("en-IN")}</span>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-[#D6DCE5] bg-white p-3">
        <h3 className="mb-2 text-sm font-semibold text-(--text-main)">Minimum Rating</h3>
        <select
          value={minRating}
          onChange={(e) => setMinRating(Number(e.target.value))}
          className="h-9 w-full rounded-lg border border-[#E5E7EB] bg-white px-2 text-sm"
        >
          <option value={0}>Any</option>
          <option value={3}>3.0+</option>
          <option value={4}>4.0+</option>
          <option value={4.5}>4.5+</option>
        </select>
      </div>
    </div>
  );

  const content = isLoading ? (
    <div className="flex flex-col md:flex-row md:flex-wrap gap-4">
      {Array.from({ length: 6 }).map((_, idx) => (
        <div key={`course-skeleton-${idx}`} className="w-full md:w-auto">
          <CourseCard
            isBaught={false}
            isLoading={true}
            useListingMobileCard={true}
          />
        </div>
      ))}
    </div>
  ) : (
    <>
      <p className="mb-4 text-sm text-[#6B7280]">{filteredCourses.length} results found</p>
      {filteredCourses.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#D1D5DB] p-8 text-center text-[#6B7280]">
          No courses match the selected filters.
        </div>
      ) : (
        <div className="flex flex-col md:flex-row md:flex-wrap gap-4">
          {visibleCourses.map((item) => (
            <div key={item.course.id} className="w-full md:w-auto">
              <CourseCard
                course={item.course}
                isBaught={item.purchased}
                isLoading={false}
                useListingMobileCard={true}
              />
            </div>
          ))}
        </div>
      )}
      {filteredCourses.length > 0 && hasMoreCourses && (
        <div className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
            className="text-(--text-main) text-sm font-medium hover:underline"
          >
            See more
          </button>
        </div>
      )}
    </>
  );

  return (
    <>
      <ListingShell
        title="Course Listing"
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search courses"
        sortValue={sortBy}
        onSortChange={setSortBy}
        sortOptions={sortOptions}
        sidebar={sidebar}
        content={content}
      />
      <MobileCourseBottomNav />
    </>
  );
}
