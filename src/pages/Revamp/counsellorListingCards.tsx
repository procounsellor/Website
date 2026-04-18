import React from 'react';
import { Search } from 'lucide-react';
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
    SelectGroup,
} from "@/components/ui/select";
import { CounselorCardSkeleton } from '@/components/skeletons/CounselorSkeletons';
import FancyCard from '@/components/Revamp/admissions/counsellor/counsellorCard';

interface CardProps {
    counsellors: any[];
    isLoading: boolean;
    isFetchingMore: boolean;
    lastElementRef: (node: HTMLDivElement | null) => void;
    hasMore: boolean;
    searchInput: string;
    setSearchInput: React.Dispatch<React.SetStateAction<string>>;
    onToggleFavourite?: (counsellorId: string) => void;
    selectedSort: string;
    setSelectedSort: React.Dispatch<React.SetStateAction<string>>;
}

const CounselorCardItem = ({ counsellor, isLast, lastElementRef, onToggleFavourite }: { counsellor: any, isLast: boolean, lastElementRef: any, onToggleFavourite?: (counsellorId: string) => void }) => {
    return (
        <div ref={isLast ? lastElementRef : null} className="shrink-0 snap-start w-50 md:w-61">
            <FancyCard
                counsellorId={counsellor.id}
                name={counsellor.name}
                imageUrl={counsellor.imageUrl}
                rating={counsellor.rating}
                experience={counsellor.experience}
                city={counsellor.location}
                proCoins={counsellor.plans?.plus || 0}
                showBookmark
                isBookmarked={Boolean(counsellor.isFavourite)}
                onBookmarkClick={() => onToggleFavourite?.(counsellor.id)}
            />
        </div>
    );
};

const CounsellorListingCards: React.FC<CardProps> = ({ 
    counsellors, isLoading, isFetchingMore, lastElementRef, hasMore, searchInput, setSearchInput, onToggleFavourite, selectedSort, setSelectedSort
}) => {
    const sortTypes = [
        { label: "Experience: High to Low", value: "experience" },
        { label: "Popularity", value: "popularity" },
        { label: "Price: Low-High", value: "price-low" },
        { label: "Price: High-Low", value: "price-high" },
    ];
    return (
        <div className="w-full">
            {/* Top Actions Box */}
            <div className="box-border flex flex-col md:flex-row items-stretch md:items-center p-3 md:p-2 bg-white rounded-lg w-full min-h-16 shadow-[0px_2px_8px_rgba(0,0,0,0.15)] mb-6 gap-3 md:gap-0">
                <div className="flex flex-row justify-between items-center w-full px-2 md:px-4 h-12">
                    <div className="flex flex-row justify-center items-center gap-2.5">
                        <h2 className="font-['Poppins'] font-semibold text-[16px] leading-5 tracking-[-0.01em] text-[#242645] m-0">
                            Counsellors
                        </h2>
                    </div>

                    <div className="hidden md:flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-6 w-full md:w-auto mt-3 md:mt-0 px-1 md:px-0">
                        <div className="box-border flex flex-row items-center px-3 py-1.5 gap-2.5 w-full md:w-71 h-9 border border-[rgba(107,114,128,0.4)] rounded-xl">
                            <Search className="w-5 h-5 text-[#6B7280]" strokeWidth={2} />
                            <input 
                                type="text" 
                                placeholder="Search for counsellors" 
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                className="w-full bg-transparent outline-none font-['Poppins'] font-medium text-[14px] text-[#6B7280] placeholder-[#6B7280]" 
                            />
                        </div>

                        {/* DESKTOP SORT UI */}
                        <div className="flex flex-row justify-between sm:justify-center items-center gap-3">
                            <span className="font-['Poppins'] font-medium text-[14px] text-[#525055]">Sort by:</span>
                            <Select value={selectedSort} onValueChange={setSelectedSort}>
                                <SelectTrigger className="w-40 h-12 bg-white rounded-lg border border-transparent hover:border-gray-200 outline-none focus:ring-0 font-['Poppins'] font-medium text-[14px] md:text-[16px] text-[#525055] shadow-none">
                                    <SelectValue placeholder="Popularity" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {sortTypes.map((type) => (
                                            <SelectItem key={type.value} value={type.value} className="font-['Poppins']">
                                                {type.label}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row md:hidden items-stretch sm:items-center gap-3 w-full px-2">
                    <div className="box-border flex flex-row items-center px-3 py-1.5 gap-2.5 w-full h-10 border border-[rgba(107,114,128,0.4)] rounded-xl">
                        <Search className="w-5 h-5 text-[#6B7280]" strokeWidth={2} />
                        <input 
                            type="text" 
                            placeholder="Search for counsellors" 
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="w-full bg-transparent outline-none font-['Poppins'] font-medium text-[14px] text-[#6B7280] placeholder-[#6B7280]" 
                        />
                    </div>
                    
                    {/* MOBILE SORT UI */}
                    <div className="flex flex-row justify-between items-center gap-3">
                        <span className="font-['Poppins'] font-medium text-[13px] text-[#525055]">Sort by:</span>
                        <Select value={selectedSort} onValueChange={setSelectedSort}>
                            <SelectTrigger className="w-37.5 h-9 bg-white rounded-lg border border-gray-200 outline-none focus:ring-0 font-['Poppins'] font-medium text-[13px] text-[#525055] shadow-none">
                                <SelectValue placeholder="Popularity" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {sortTypes.map((type) => (
                                        <SelectItem key={type.value} value={type.value} className="font-['Poppins'] text-[13px]">
                                            {type.label}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* Loading State / Empty State */}
            {isLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-6 pb-10 w-full">
                    {Array.from({ length: 6 }).map((_, idx) => (
                        <div key={`c-listing-skeleton-${idx}`} className="w-full flex justify-center">
                            <CounselorCardSkeleton />
                        </div>
                    ))}
                </div>
            ) : counsellors.length === 0 ? (
                <div className="flex justify-center py-20 w-full text-gray-500 font-[Poppins] text-[15px] md:text-[18px]">
                    No Counsellor found matching your criteria.
                </div>
            ) : (
                <>
                    {/* Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-6 pb-10">
                        {counsellors.map((counsellor, index) => (
                            <CounselorCardItem 
                                key={counsellor.id}
                                counsellor={counsellor}
                                isLast={index === counsellors.length - 1}
                                lastElementRef={lastElementRef}
                                onToggleFavourite={onToggleFavourite}
                            />
                        ))}
                    </div>

                    {/* Loading Spinner for Infinite Scroll */}
                    {isFetchingMore && (
                        <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-6 py-6 w-full pb-20">
                            {Array.from({ length: 3 }).map((_, idx) => (
                                <div key={`c-listing-more-skeleton-${idx}`} className="w-full flex justify-center">
                                    <CounselorCardSkeleton />
                                </div>
                            ))}
                        </div>
                    )}
                    
                    {!hasMore && counsellors.length > 0 && (
                        <div className="text-center py-8 pb-20 text-gray-500 font-medium">
                            You have reached the end of the list.
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default CounsellorListingCards;