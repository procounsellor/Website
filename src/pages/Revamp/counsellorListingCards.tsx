import React, { useState } from 'react';
import { Search, Star, Bookmark, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { encodeCounselorId } from "@/lib/utils"; 
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
    SelectGroup,
} from "@/components/ui/select";
import { CounselorCardSkeleton } from '@/components/skeletons/CounselorSkeletons';

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

const CounselorCardItem = ({ counsellor, isLast, lastElementRef, onToggleFavourite }: { counsellor: any, isLast: boolean, lastElementRef: any, onToggleFavourite?: (id: string) => void }) => {
    const [isHovered, setIsHovered] = useState(false);
    const navigate = useNavigate();

    const handleBookmarkClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (onToggleFavourite) {
            onToggleFavourite(counsellor.id);
        } else {
            console.warn("onToggleFavourite is not passed to the card component.");
        }
    };

    return (
    <div 
        ref={isLast ? lastElementRef : null}
        onClick={() => navigate(`/counsellor-details/${encodeCounselorId(counsellor.id)}`)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="w-full h-[250px] sm:w-full sm:max-w-[340px] sm:h-[387px] mx-auto relative cursor-pointer group shrink-0 transition-transform duration-300 hover:-translate-y-1"
        style={{ filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.12))' }}
    >
            {/* Main Background SVG */}
            <svg
                className="absolute inset-0 w-full h-full z-0"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 244 367"
                preserveAspectRatio="none"
                fill="none"
            >
                <path
                    d="M234.615 0C239.798 5.03664e-06 244 5.83355 244 13.0296V300C244 306.627 238.627 312 232 312H203.381C197.421 312 192.364 316.375 191.506 322.273L186.494 356.727C185.636 362.625 180.579 367 174.619 367H9.38461C4.20164 367 6.61314e-08 361.166 0 353.97V13.0296C1.66273e-06 5.83355 4.20164 2.62325e-07 9.38461 0H234.615Z"
                    fill="white"
                />
            </svg>

            {/* Content Overlay */}
            <div className="absolute inset-0 p-2 sm:p-[12px] flex flex-col z-10 box-border">
                
                {/* Image Container */}
                <div className="relative w-full h-[125px] sm:h-[200px] bg-[#F5F5F7] rounded-[8px] overflow-hidden shrink-0">
                    {counsellor.imageUrl && (
                        <img src={counsellor.imageUrl} alt={counsellor.name} className="w-full h-full object-cover" />
                    )}
                    
                    {/* Rating Badge */}
                    <div className="absolute left-1.5 sm:left-[8px] top-1.5 sm:top-[8px] flex flex-row items-center justify-center p-1 sm:p-[4px] gap-[2px] sm:gap-[8px] min-w-[36px] sm:w-[48px] h-[20px] sm:h-[24px] rounded-[100px] bg-[#FFFFFF4D] backdrop-blur-[15px] shadow-sm pointer-events-none">
                        <Star className="w-3 h-3 sm:w-[16px] sm:h-[16px] text-[#0E1629] fill-[#0E1629] shrink-0" />
                        <span className="font-['Poppins'] font-medium text-[11px] sm:text-[14px] text-[#0E1629] whitespace-nowrap leading-none">{counsellor.rating}</span>
                    </div>

                    {/* Bookmark Badge */}
                    <button
                        type="button"
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={handleBookmarkClick}
                        aria-label="Save counselor"
                        className="absolute right-1.5 sm:right-[8px] top-1.5 sm:top-[8px] flex items-center justify-center px-1 sm:px-[8px] py-1 sm:py-[4px] min-w-[24px] sm:w-[32px] h-[20px] sm:h-[24px] rounded-[100px] bg-[#FFFFFF4D] backdrop-blur-[15px] transition-colors hover:bg-white/40 cursor-pointer shadow-sm z-50 pointer-events-auto"
                    >
                        <Bookmark className={`w-3 h-3 sm:w-[16px] sm:h-[16px] text-[#0E1629] pointer-events-none transition-colors ${counsellor.isFavourite ? 'fill-current' : ''}`} />
                    </button>
                </div>

                {/* Info Section */}
                <div className="flex flex-col items-start w-full mt-1.5 sm:mt-[12px]">
                    {counsellor.verified && (
                        <div className="flex flex-row items-center gap-1 sm:gap-[4px] mb-0.5 sm:mb-[4px]">
                            <img 
                                src="/verified.svg" 
                                alt="Verified" 
                                className="w-3 h-3 sm:w-[16px] sm:h-[16px] shrink-0" 
                            />
                            <span className="font-['Poppins'] font-medium text-[9px] sm:text-[10px] leading-[12px] sm:leading-none capitalize text-[#3AAF3C]">Verified</span>
                        </div>
                    )}
                    <h3 className="font-['Poppins'] font-medium text-[13px] sm:text-[18px] leading-[18px] sm:leading-[27px] text-[#0E1629] m-0 w-full whitespace-nowrap overflow-hidden text-ellipsis">
                        {counsellor.name}
                    </h3>
                </div>

                {/* Details Line */}
                <div className="flex flex-col items-start gap-0.5 sm:gap-[8px] w-full mt-0.5 sm:mt-[8px]">
                    <div className="flex flex-row items-center gap-[4px] sm:gap-[8px] w-full">
                        <img src="/stream.svg" alt="stream" className="w-3 h-3 sm:w-[16px] sm:h-[16px] shrink-0" />
                        <span className="font-['Poppins'] font-normal text-[10px] sm:text-[14px] leading-[14px] sm:leading-none capitalize text-[#6B7280] truncate">
                            {counsellor.course} | {counsellor.experience}
                        </span>
                    </div>
                    <div className="flex flex-row items-center gap-[4px] sm:gap-[8px] w-full mt-0">
                        <MapPin className="w-3 h-3 sm:w-[16px] sm:h-[16px] text-[#6B7280] shrink-0" />
                        <span className="font-['Poppins'] font-normal text-[10px] sm:text-[14px] leading-[14px] sm:leading-none text-[#6B7280] truncate">
                            {counsellor.location}
                        </span>
                    </div>
                </div>

                {/* Bottom Action Area / Badges */}
                <div className="flex flex-row items-center gap-1 sm:gap-[6px] w-full mt-auto pt-1.5 sm:pt-[12px] pb-[2px] pr-[25%] sm:pr-[65px]">
                    <div className="box-border flex flex-col justify-center items-center py-0.5 sm:py-[2px] px-0.5 sm:px-[2px] flex-1 min-w-0 sm:min-w-[57px] max-w-[72px] h-[32px] sm:h-[40px] bg-[linear-gradient(266.79deg,rgba(222,237,255,0.4)_0.46%,rgba(126,136,211,0.4)_130.49%)] border border-[rgba(113,142,191,0.4)] rounded-md sm:rounded-[12px]">
                        <span className="font-['Poppins'] font-normal text-[8px] sm:text-[11px] text-[#1447E7] leading-tight truncate w-full text-center">Plus</span>
                        <span className="font-['Poppins'] font-medium text-[8px] sm:text-[11px] text-[#1447E7] leading-tight truncate w-full text-center">₹{counsellor.plans?.plus || 0}</span>
                    </div>
                    <div className="box-border flex flex-col justify-center items-center py-0.5 sm:py-[2px] px-0.5 sm:px-[2px] flex-1 min-w-0 sm:min-w-[64px] max-w-[72px] h-[32px] sm:h-[40px] bg-[linear-gradient(257.67deg,rgba(244,232,255,0.4)_1.56%,rgba(250,244,255,0.4)_100%)] border border-[rgba(232,212,255,0.4)] rounded-md sm:rounded-[12px]">
                        <span className="font-['Poppins'] font-normal text-[8px] sm:text-[11px] text-[#8200DA] leading-tight truncate w-full text-center">Pro</span>
                        <span className="font-['Poppins'] font-medium text-[8px] sm:text-[11px] text-[#8200DA] leading-tight truncate w-full text-center">₹{counsellor.plans?.pro || 0}</span>
                    </div>
                    <div className="box-border flex flex-col justify-center items-center py-0.5 sm:py-[2px] px-0.5 sm:px-[2px] flex-1 min-w-0 sm:min-w-[64px] max-w-[72px] h-[32px] sm:h-[40px] bg-[linear-gradient(257.67deg,rgba(255,245,206,0.4)_1.56%,rgba(255,250,230,0.4)_100%)] border border-[rgba(234,197,145,0.4)] rounded-md sm:rounded-[12px]">
                        <span className="font-['Poppins'] font-normal text-[8px] sm:text-[11px] text-[#B94C00] leading-tight truncate w-full text-center">Elite</span>
                        <span className="font-['Poppins'] font-medium text-[8px] sm:text-[11px] text-[#B94C00] leading-tight truncate w-full text-center">₹{counsellor.plans?.elite || 0}</span>
                    </div>
                </div>
            </div>

            {/* Bottom Right Arrow SVG Block */}
            <div className="absolute right-[0px] bottom-[0px] overflow-hidden w-[24%] sm:w-[53px] h-[16.5%] sm:h-[50px] z-20 rounded-br-[8px] rounded-tl-[8px]">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 52 50"
                    preserveAspectRatio="none"
                    fill="none"
                    className="w-full h-full transition-all duration-300"
                >
                    <path
                        d="M4.1 7.05536C4.57855 3.03083 7.99114 0 12.044 0H43.9934C48.4117 0 51.9934 3.58172 51.9934 8V42C51.9934 46.4183 48.4117 50 43.9934 50H8.00107C3.20833 50 -0.508886 45.8146 0.0570345 41.0554L4.1 7.05536Z"
                        fill={isHovered ? "white" : "#0E1629"}
                        className="transition-colors duration-300"
                    />
                </svg>
                {/* 14x14 mobile, 32x32 desktop */}
                <div className="absolute top-1/2 left-[55%] -translate-x-1/2 -translate-y-1/2 w-[14px] sm:w-[32px] h-[14px] sm:h-[32px]">
                    <img
                        src="/arrow.svg"
                        alt="arrow"
                        className={`absolute inset-0 w-full h-full transition-all duration-500 ${isHovered ? 'translate-x-[30px] opacity-0' : 'translate-x-0 opacity-100'}`}
                        style={{ filter: 'brightness(0) invert(1)' }}
                    />
                    <img
                        src="/arrow.svg"
                        alt="arrow"
                        className={`absolute inset-0 w-full h-full transition-all duration-500 ${isHovered ? 'translate-x-0 opacity-100' : '-translate-x-[30px] opacity-0'}`}
                        style={{ filter: 'brightness(0)' }}
                    />
                </div>
            </div>
        </div>
    );
};

const CounsellorListingCards: React.FC<CardProps> = ({ 
    counsellors, isLoading, isFetchingMore, lastElementRef, hasMore, searchInput, setSearchInput, onToggleFavourite, selectedSort, setSelectedSort
}) => {
    const sortTypes = [
        { label: "Popularity", value: "popularity" },
        { label: "Price: Low-High", value: "price-low" },
        { label: "Price: High-Low", value: "price-high" },
    ];
    return (
        <div className="w-full">
            {/* Top Actions Box */}
            <div className="box-border flex flex-col md:flex-row items-stretch md:items-center p-3 md:p-2 bg-white rounded-lg w-full min-h-[64px] shadow-[0px_2px_8px_rgba(0,0,0,0.15)] mb-[24px] gap-3 md:gap-0">
                <div className="flex flex-row justify-between items-center w-full px-2 md:px-4 h-[48px]">
                    <div className="flex flex-row justify-center items-center gap-[10px]">
                        <h2 className="font-['Poppins'] font-semibold text-[16px] leading-[20px] tracking-[-0.01em] text-[#242645] m-0">
                            Counsellors
                        </h2>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-[24px] w-full md:w-auto mt-3 md:mt-0 px-1 md:px-0 hidden md:flex">
                        <div className="box-border flex flex-row items-center px-3 py-1.5 gap-[10px] w-full md:w-[284px] h-[36px] border border-[rgba(107,114,128,0.4)] rounded-xl">
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
                        <div className="flex flex-row justify-between sm:justify-center items-center gap-[12px]">
                            <span className="font-['Poppins'] font-medium text-[14px] text-[#525055]">Sort by:</span>
                            <Select value={selectedSort} onValueChange={setSelectedSort}>
                                <SelectTrigger className="w-[160px] h-[48px] bg-white rounded-lg border border-transparent hover:border-gray-200 outline-none focus:ring-0 font-['Poppins'] font-medium text-[14px] md:text-[16px] text-[#525055] shadow-none">
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
                    <div className="box-border flex flex-row items-center px-3 py-1.5 gap-[10px] w-full h-[40px] border border-[rgba(107,114,128,0.4)] rounded-xl">
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
                    <div className="flex flex-row justify-between items-center gap-[12px]">
                        <span className="font-['Poppins'] font-medium text-[13px] text-[#525055]">Sort by:</span>
                        <Select value={selectedSort} onValueChange={setSelectedSort}>
                            <SelectTrigger className="w-[150px] h-[36px] bg-white rounded-lg border border-gray-200 outline-none focus:ring-0 font-['Poppins'] font-medium text-[13px] text-[#525055] shadow-none">
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
                <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-[24px] pb-[40px] w-full">
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
                    <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-[24px] pb-[40px]">
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
                        <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-[24px] py-6 w-full pb-20">
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