import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import MobileCourseBottomNav from "@/components/Revamp/courses/MobileCourseBottomNav";
import ListingShell from "@/components/Revamp/listing/ListingShell";
import TestGroupCard from "@/components/Revamp/courses/TestGroupCard";
import {
  getAllTestGroupsForGuest,
  getAllTestGroupsForLoggedInUser,
} from "@/api/testGroup";

type TestListItem = {
  id: string;
  image: string;
  rating: string;
  title: string;
  description: string;
  totalTests: number;
  totalStudents: number;
  price: string;
  isPurchased: boolean;
};

const normalizeTests = (response: any): TestListItem[] => {
  const rawList = Array.isArray(response)
    ? response
    : Array.isArray(response?.data)
      ? response.data
      : Array.isArray(response?.testGroups)
        ? response.testGroups
        : [];

  return rawList.map((item: any, index: number) => {
    const tg = item?.testGroup ?? item;
    const soldCount = Number(tg?.soldCount ?? item?.soldCount ?? 0);
    const totalTests = Number(
      item?.attachedTests?.length ??
      tg?.attachedTests?.length ??
      item?.totalTests ??
      item?.testSeriesCount ??
      0
    );

    return {
      id: String(tg?.testGroupId ?? item?.testGroupId ?? item?.id ?? `test-${index}`),
      image: String(
        tg?.bannerImagUrl ??
        tg?.bannerImageUrl ??
        item?.bannerImagUrl ??
        item?.bannerImageUrl ??
        "/course/2.png"
      ),
      rating: String(tg?.rating ?? item?.rating ?? "0.0"),
      title: String(tg?.testGroupName ?? item?.testGroupName ?? item?.name ?? "Test Group"),
      description: String(
        tg?.testGroupDescription ?? item?.testGroupDescription ?? item?.description ?? ""
      ),
      totalTests: totalTests > 0 ? totalTests : 1,
      totalStudents: soldCount,
      price:
        String(tg?.priceType ?? item?.priceType ?? "").toUpperCase() === "FREE"
          ? "Free"
          : `₹${Number(tg?.price ?? item?.price ?? 0).toLocaleString("en-IN")}`,
      isPurchased: Boolean(item?.bought ?? item?.purchasedByMe ?? item?.isPurchased ?? false),
    };
  });
};

const sortOptions = [
  { value: "recommended", label: "Recommended" },
  { value: "rating", label: "Rating: High to Low" },
  { value: "students", label: "Most Students" },
  { value: "tests", label: "Most Tests" },
];

export default function TestListing() {
  const userId = localStorage.getItem("phone") || "";
  const token = localStorage.getItem("jwt") || "";
  const isUserLoggedIn = Boolean(userId && token);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("recommended");
  const [selectedPriceType, setSelectedPriceType] = useState("all");
  const [minRating, setMinRating] = useState(0);
  const [minStudents, setMinStudents] = useState(0);

  const { data, isLoading } = useQuery({
    queryKey: ["test-listing", isUserLoggedIn ? userId : "guest"],
    queryFn: () =>
      isUserLoggedIn ? getAllTestGroupsForLoggedInUser(userId) : getAllTestGroupsForGuest(),
    enabled: !isUserLoggedIn || Boolean(userId),
  });

  const tests = useMemo(() => normalizeTests(data), [data]);

  const filteredTests = useMemo(() => {
    let items = tests.filter((test) => {
      const matchesSearch = test.title.toLowerCase().includes(search.toLowerCase());
      const isFree = test.price.toLowerCase() === "free";
      const matchesPrice =
        selectedPriceType === "all" ||
        (selectedPriceType === "free" && isFree) ||
        (selectedPriceType === "paid" && !isFree);
      const matchesRating = Number(test.rating) >= minRating;
      const matchesStudents = test.totalStudents >= minStudents;
      return matchesSearch && matchesPrice && matchesRating && matchesStudents;
    });

    if (sortBy === "rating") {
      items = [...items].sort((a, b) => Number(b.rating) - Number(a.rating));
    } else if (sortBy === "students") {
      items = [...items].sort((a, b) => b.totalStudents - a.totalStudents);
    } else if (sortBy === "tests") {
      items = [...items].sort((a, b) => b.totalTests - a.totalTests);
    } else {
      items = [...items].sort((a, b) => b.totalStudents - a.totalStudents);
    }

    return items;
  }, [minRating, minStudents, search, selectedPriceType, sortBy, tests]);

  const sidebar = (
    <div className="space-y-3">
      <div className="flex items-center justify-between rounded-lg border border-[#D6DCE5] bg-white px-3 py-2">
        <h2 className="text-sm font-semibold text-(--text-main)">Filters</h2>
        <button
          onClick={() => {
            setSelectedPriceType("all");
            setMinRating(0);
            setMinStudents(0);
          }}
          className="text-xs font-medium text-[#2F43F2]"
        >
          Reset
        </button>
      </div>

      <div className="rounded-lg border border-[#D6DCE5] bg-white p-3">
        <h3 className="mb-2 text-sm font-semibold text-(--text-main)">Price Type</h3>
        <select
          value={selectedPriceType}
          onChange={(e) => setSelectedPriceType(e.target.value)}
          className="h-9 w-full rounded-lg border border-[#E5E7EB] bg-white px-2 text-sm"
        >
          <option value="all">All</option>
          <option value="free">Free</option>
          <option value="paid">Paid</option>
        </select>
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

      <div className="rounded-lg border border-[#D6DCE5] bg-white p-3">
        <h3 className="mb-2 text-sm font-semibold text-(--text-main)">Minimum Students</h3>
        <input
          type="number"
          value={minStudents}
          onChange={(e) => setMinStudents(Number(e.target.value || 0))}
          className="h-9 w-full rounded-lg border border-[#E5E7EB] bg-white px-2 text-sm"
        />
      </div>
    </div>
  );

  const content = isLoading ? (
    <div className="flex flex-wrap gap-4">
      {Array.from({ length: 6 }).map((_, idx) => (
        <div key={`test-skeleton-${idx}`} className="h-112 w-[18rem] animate-pulse rounded-2xl bg-[#E5E7EB]" />
      ))}
    </div>
  ) : (
    <>
      <p className="mb-4 text-sm text-[#6B7280]">{filteredTests.length} results found</p>
      {filteredTests.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#D1D5DB] p-8 text-center text-[#6B7280]">
          No tests match the selected filters.
        </div>
      ) : (
        <div className="flex flex-wrap gap-4">
          {filteredTests.map((test) => (
            <TestGroupCard
              key={test.id}
              testGroupId={test.id}
              image={test.image}
              rating={test.rating}
              price={test.price}
              title={test.title}
              description={test.description}
              totalTests={test.totalTests}
              totalStudents={test.totalStudents}
              isBaught={test.isPurchased}
              isMyTestsCard={false}
            />
          ))}
        </div>
      )}
    </>
  );

  return (
    <>
      <ListingShell
        title="Test Listing"
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search tests"
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
