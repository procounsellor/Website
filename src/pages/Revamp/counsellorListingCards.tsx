import React, { useState } from 'react';
import { Search, ChevronDown, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { encodeCounselorId } from "@/lib/utils"; 

interface CardProps {
    counsellors: any[];
    isLoading: boolean;
    isFetchingMore: boolean;
    lastElementRef: (node: HTMLDivElement | null) => void;
    hasMore: boolean;
    searchInput: string;
    setSearchInput: React.Dispatch<React.SetStateAction<string>>;
}

const CounselorCardItem = ({ counsellor, isLast, lastElementRef }: { counsellor: any, isLast: boolean, lastElementRef: any }) => {
    const [isHovered, setIsHovered] = useState(false);
    const navigate = useNavigate();

    return (
        <div 
            ref={isLast ? lastElementRef : null}
            onClick={() => navigate(`/counsellor/${encodeCounselorId(counsellor.id)}`)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="w-full h-[250px] sm:h-[420px] relative cursor-pointer group shrink-0 transition-transform duration-300 hover:-translate-y-1"
            style={{ filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.12))' }}
        >
            <svg
                className="absolute inset-0 w-full h-full"
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
            <div className="absolute inset-0 p-2 sm:p-[12px] flex flex-col z-10">
                <div className="relative w-full h-[125px] sm:h-[220px] bg-[#F5F5F7] rounded-[8px] overflow-hidden shrink-0">
                    {counsellor.imageUrl && (
                        <img src={counsellor.imageUrl} alt={counsellor.name} className="w-full h-full object-cover" />
                    )}
                    <div className="absolute left-1.5 sm:left-[10px] top-1.5 sm:top-[10px] flex flex-row items-center px-1.5 py-0.5 sm:py-1 gap-[2px] min-w-[36px] sm:min-w-[48px] h-[20px] sm:h-[24px] rounded-full bg-white/20 backdrop-blur-md shadow-sm">
                        <Star className="w-3 h-3 sm:w-[15px] sm:h-[14px] text-white fill-[#0E1629] shrink-0" />
                        <span className="font-['Poppins'] font-medium text-[11px] sm:text-[14px] text-[#0E1629] whitespace-nowrap">{counsellor.rating}</span>
                    </div>
                </div>

                {/* Info Section */}
                <div className="flex flex-col items-start w-full mt-1.5 sm:mt-[12px]">
                    {counsellor.verified && (
                        <div className="flex flex-row items-center gap-1 mb-0.5 sm:mb-1">
                            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="w-3 h-3 sm:w-4 sm:h-4"><circle cx="8" cy="8" r="8" fill="#3AAF3C"/><path d="M5 8L7 10L11 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            <span className="font-['Poppins'] font-medium text-[9px] sm:text-[10px] leading-[12px] sm:leading-[15px] capitalize text-[#3AAF3C]">Verified</span>
                        </div>
                    )}
                    <h3 className="font-['Poppins'] font-medium text-[13px] sm:text-[18px] leading-[18px] sm:leading-[27px] text-[#0E1629] m-0 w-full whitespace-nowrap overflow-hidden text-ellipsis">
                        {counsellor.name}
                    </h3>
                </div>

                {/* Details Line */}
                <div className="flex flex-col items-start gap-0.5 sm:gap-1 w-full mt-0.5 sm:mt-[6px]">
                    <div className="flex flex-row items-center w-full">
                        <span className="font-['Poppins'] font-normal text-[10px] sm:text-[14px] leading-[14px] sm:leading-[21px] capitalize text-[#6B7280] truncate">
                            {counsellor.course} | {counsellor.experience}
                        </span>
                    </div>
                    <div className="flex flex-row items-center w-full">
                        <span className="font-['Poppins'] font-normal text-[10px] sm:text-[14px] leading-[14px] sm:leading-[21px] text-[#6B7280] truncate">
                            {counsellor.location}
                        </span>
                    </div>
                </div>

                {/* Bottom Action Area */}
                <div className="flex flex-row items-center justify-between w-full mt-auto pt-1.5 sm:pt-2">
                    <div className="flex flex-row items-center gap-1 sm:gap-2 flex-1 pr-[25%]">
                        <div className="box-border flex flex-col justify-center items-center py-0.5 flex-1 max-w-[72px] h-[32px] sm:h-[44px] bg-[linear-gradient(266.79deg,rgba(222,237,255,0.4)_0.46%,rgba(126,136,211,0.4)_130.49%)] rounded-md sm:rounded-xl">
                            <span className="font-['Poppins'] font-normal text-[9px] sm:text-[12px] text-[#1447E7]">Plus</span>
                            <span className="font-['Poppins'] font-medium text-[9px] sm:text-[12px] text-[#1447E7]">₹{counsellor.plans.plus}</span>
                        </div>
                        <div className="box-border flex flex-col justify-center items-center py-0.5 flex-1 max-w-[72px] h-[32px] sm:h-[44px] bg-[linear-gradient(257.67deg,rgba(244,232,255,0.4)_1.56%,rgba(250,244,255,0.4)_100%)] rounded-md sm:rounded-xl">
                            <span className="font-['Poppins'] font-normal text-[9px] sm:text-[12px] text-[#8200DA]">Pro</span>
                            <span className="font-['Poppins'] font-medium text-[9px] sm:text-[12px] text-[#8200DA]">₹{counsellor.plans.pro}</span>
                        </div>
                        <div className="box-border flex flex-col justify-center items-center py-0.5 flex-1 max-w-[72px] h-[32px] sm:h-[44px] bg-[linear-gradient(257.67deg,rgba(255,245,206,0.4)_1.56%,rgba(255,250,230,0.4)_100%)] rounded-md sm:rounded-xl">
                            <span className="font-['Poppins'] font-normal text-[9px] sm:text-[12px] text-[#B94C00]">Elite</span>
                            <span className="font-['Poppins'] font-medium text-[9px] sm:text-[12px] text-[#B94C00]">₹{counsellor.plans.elite}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="absolute right-[-1px] bottom-[-1px] overflow-hidden w-[24%] h-[16.5%] z-20">
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
                <div className="absolute top-1/2 left-[55%] -translate-x-1/2 -translate-y-1/2 w-[14px] sm:w-[24px] h-[14px] sm:h-[24px]">
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
    counsellors, isLoading, isFetchingMore, lastElementRef, hasMore, searchInput, setSearchInput 
}) => {
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

                        <div className="flex flex-row justify-between sm:justify-center items-center gap-[12px]">
                            <span className="font-['Poppins'] font-medium text-[14px] text-[#525055]">Sort by:</span>
                            <div className="box-border flex flex-row justify-between items-center px-2 py-3 gap-[24px] h-[48px] bg-white rounded-lg border border-transparent hover:border-gray-200 cursor-pointer transition-colors">
                                <span className="font-['Poppins'] font-medium text-[14px] md:text-[16px] text-[#525055]">Recommended</span>
                                <ChevronDown className="w-4 h-4 text-[#242645]" strokeWidth={1.5} />
                            </div>
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
                    <div className="flex flex-row justify-between items-center gap-[12px]">
                        <span className="font-['Poppins'] font-medium text-[13px] text-[#525055]">Sort by:</span>
                        <div className="box-border flex flex-row justify-between items-center px-2 py-2 gap-[8px] h-[36px] bg-white rounded-lg border border-gray-200 cursor-pointer">
                            <span className="font-['Poppins'] font-medium text-[13px] text-[#525055]">Recommended</span>
                            <ChevronDown className="w-4 h-4 text-[#242645]" strokeWidth={1.5} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Loading State / Empty State */}
            {isLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-[24px] pb-[40px] w-full animate-pulse">
                    {Array.from({ length: 6 }).map((_, idx) => (
                        <div key={`c-listing-skeleton-${idx}`} className="w-full h-[235px] sm:h-[420px] rounded-xl bg-white shadow-sm" />
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
                            />
                        ))}
                    </div>

                    {/* Loading Spinner for Infinite Scroll */}
                    {isFetchingMore && (
                        <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-[24px] py-6 w-full pb-20 animate-pulse">
                            {Array.from({ length: 3 }).map((_, idx) => (
                                <div key={`c-listing-more-skeleton-${idx}`} className="w-full h-[235px] sm:h-[420px] rounded-xl bg-white shadow-sm" />
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