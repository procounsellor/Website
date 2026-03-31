import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { academicApi } from "@/api/academic";
import { useAuthStore } from "@/store/AuthStore";
import type { AllCounselor } from "@/types/academic";
import CounsellorListing from "./counsellorListing";
import CounsellorListingCards from "./counsellorListingCards";

function adaptApiDataToCardData(apiCounselor: AllCounselor) {
    const firstName = apiCounselor.firstName || "Unknown";
    const lastName = apiCounselor.lastName || "Counselor";
    const fullName = `${firstName} ${lastName}`;

    const imageUrl =
        apiCounselor.photoUrlSmall ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=0E1629&color=ffffff&size=400`;

    const experience = apiCounselor.experience || "0";
    let experienceText = experience === "0" ? "Entry Level" : experience.toLowerCase().includes("year") ? experience : `${experience} Years`;

    return {
        id: apiCounselor.counsellorId || `temp-${Date.now()}`,
        name: fullName,
        imageUrl: imageUrl,
        rating: apiCounselor.rating || 4.0,
        reviews: parseInt(apiCounselor.numberOfRatings || "0"),
        verified: true,
        course: "Counselling",
        experience: experienceText,
        location: apiCounselor.city || "Location not specified",
        plans: {
            plus: apiCounselor.plusAmount || 0,
            pro: apiCounselor.proAmount || 0,
            elite: apiCounselor.eliteAmount || 0,
        },
    };
}

const CounsellorsPage: React.FC = () => {
    const { userId } = useAuthStore();

    // --- Filter States ---
    const [selectedExperience, setSelectedExperience] = useState<string[]>([]);
    const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
    const [selectedCities, setSelectedCities] = useState<string[]>([]);
    const [selectedDays, setSelectedDays] = useState<string[]>([]);
    const [minPriceInput, setMinPriceInput] = useState<number | "">(100);
    const [maxPriceInput, setMaxPriceInput] = useState<number | "">(10000);
    
    // --- Search State ---
    const [searchInput, setSearchInput] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    // Debounced States for API calls
    const [minPrice, setMinPrice] = useState<string>("100");
    const [maxPrice, setMaxPrice] = useState<string>("10000");

    // --- API & Pagination States ---
    const [counselors, setCounselors] = useState<AllCounselor[]>([]);
    const [loading, setLoading] = useState(false);
    const [fetchingMore, setFetchingMore] = useState(false);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const ITEMS_PER_PAGE = 9;

    const observer = useRef<IntersectionObserver | null>(null);

    // Debounce inputs (Price & Search)
    useEffect(() => {
        const timer = setTimeout(() => setMinPrice(minPriceInput.toString()), 800);
        return () => clearTimeout(timer);
    }, [minPriceInput]);

    useEffect(() => {
        const timer = setTimeout(() => setMaxPrice(maxPriceInput.toString()), 800);
        return () => clearTimeout(timer);
    }, [maxPriceInput]);

    useEffect(() => {
        const timer = setTimeout(() => setSearchTerm(searchInput), 800);
        return () => clearTimeout(timer);
    }, [searchInput]);

    useEffect(() => {
        setPage(0);
        setHasMore(true);
    }, [selectedExperience, selectedLanguages, selectedCities, selectedDays, minPrice, maxPrice, searchTerm]);

    // Handle Clear Filters
    const handleClearFilters = useCallback(() => {
        setSelectedExperience([]);
        setSelectedLanguages([]);
        setSelectedCities([]);
        setSelectedDays([]);
        setMinPriceInput(100);
        setMaxPriceInput(10000);
    }, []);

    const generateSeniorYears = () => Array.from({ length: 37 }, (_, i) => i + 4).join(",");

    // Fetch Data Logic
    const fetchCounselors = useCallback(async (isLoadMore: boolean) => {
        if (isLoadMore) setFetchingMore(true);
        else setLoading(true);

        try {
            const dayMapping: Record<string, string> = { Mon: "Monday", Tue: "Tuesday", Wed: "Wednesday", Thu: "Thursday", Fri: "Friday", Sat: "Saturday", Sun: "Sunday" };
            const apiDays = selectedDays.map(d => dayMapping[d] || d).join(",");

            let apiExperience = "";
            const selectedExp = [];
            if (selectedExperience.includes("entry")) selectedExp.push("0,1");
            if (selectedExperience.includes("junior")) selectedExp.push("1,2,3");
            if (selectedExperience.includes("senior")) selectedExp.push(generateSeniorYears());
            apiExperience = selectedExp.join(",");

            const commonFilters = {
                city: selectedCities.join(","),
                languagesKnow: selectedLanguages.join(","),
                workingDays: apiDays,
                experience: apiExperience,
                minPrice: minPrice,
                maxPrice: maxPrice,
                search: searchTerm,
            };

            let response;
            if (userId) {
                response = await academicApi.searchCounsellors(userId, commonFilters, page, ITEMS_PER_PAGE);
            } else {
                response = await academicApi.searchAllLoggedOutCounsellors(commonFilters, page, ITEMS_PER_PAGE);
            }

            const newCounselors: AllCounselor[] = response.counsellors || [];
            const totalItems = response.total || 0;

            setCounselors(prev => {
                if (isLoadMore) {
                    const existingIds = new Set(prev.map(c => c.counsellorId));
                    const uniqueNew = newCounselors.filter(c => !existingIds.has(c.counsellorId));
                    return [...prev, ...uniqueNew];
                }
                return newCounselors;
            });

            if (newCounselors.length < ITEMS_PER_PAGE || (page + 1) * ITEMS_PER_PAGE >= totalItems) {
                setHasMore(false);
            } else {
                setHasMore(true);
            }
        } catch (err) {
            console.error("Search Error:", err);
        } finally {
            setLoading(false);
            setFetchingMore(false);
        }
    }, [userId, page, selectedDays, selectedExperience, selectedCities, selectedLanguages, minPrice, maxPrice, searchTerm]);

    // Trigger Fetch
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchCounselors(page > 0);
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

    const cardData = useMemo(() => counselors.map(adaptApiDataToCardData), [counselors]);

    return (
        <div className="max-w-[1440px] mx-auto pt-8 px-[60px]">
            {/* Breadcrumbs */}
            <div className="flex flex-row items-center p-0 gap-[8px] mb-[24px]">
                <span className="font-[Poppins] font-normal text-[16px] leading-[21px] text-[#6B7280] cursor-pointer hover:text-[#0E1629]">
                    Counsellor
                </span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 12L10 8L6 4" stroke="#6B7280" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="font-[Poppins] font-medium text-[16px] leading-[21px] text-[#0E1629]">
                    List of Counsellors
                </span>
            </div>

            {/* Layout Container */}
            <div className="flex flex-row items-start gap-[64px] relative">
                

                <div className="w-[312px] flex-shrink-0 sticky top-6 max-h-[calc(100vh-48px)] overflow-y-auto overflow-x-hidden custom-scrollbar pb-4">
                    <CounsellorListing
                        selectedExperience={selectedExperience} setSelectedExperience={setSelectedExperience}
                        selectedLanguages={selectedLanguages} setSelectedLanguages={setSelectedLanguages}
                        selectedCities={selectedCities} setSelectedCities={setSelectedCities}
                        selectedDays={selectedDays} setSelectedDays={setSelectedDays}
                        minPrice={minPriceInput} setMinPrice={setMinPriceInput}
                        maxPrice={maxPriceInput} setMaxPrice={setMaxPriceInput}
                        onClearFilters={handleClearFilters}
                    />
                </div>

                {/* Main Grid */}
                <div className="flex-grow">
                    <CounsellorListingCards
                        counsellors={cardData}
                        isLoading={loading}
                        isFetchingMore={fetchingMore}
                        lastElementRef={lastCounselorRef}
                        hasMore={hasMore}
                        searchInput={searchInput}
                        setSearchInput={setSearchInput}
                    />
                </div>
            </div>
        </div>
    );
};

export default CounsellorsPage;