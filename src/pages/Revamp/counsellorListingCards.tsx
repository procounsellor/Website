import React from 'react';
import { Search, ChevronDown, Star, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { encodeCounselorId } from "@/lib/utils"; // Added missing import

interface CardProps {
    counsellors: any[];
    isLoading: boolean;
    isFetchingMore: boolean;
    lastElementRef: (node: HTMLDivElement | null) => void;
    hasMore: boolean;
    searchInput: string;
    setSearchInput: React.Dispatch<React.SetStateAction<string>>;
}

const CounsellorListingCards: React.FC<CardProps> = ({ 
    counsellors, isLoading, isFetchingMore, lastElementRef, hasMore, searchInput, setSearchInput 
}) => {
    const navigate = useNavigate();

    return (
        <div className="w-full">
            {/* Top Actions Box */}
            <div className="box-border flex flex-row items-center p-2 bg-white rounded-lg w-full h-[64px] shadow-[0px_2px_8px_rgba(0,0,0,0.15)] mb-[24px]">
                <div className="flex flex-row justify-between items-center w-full px-4 h-[48px]">
                    <div className="flex flex-row justify-center items-center gap-[10px]">
                        <h2 className="font-['Poppins'] font-semibold text-[16px] leading-[20px] tracking-[-0.01em] text-[#242645] m-0">
                            Counsellors
                        </h2>
                    </div>

                    <div className="flex flex-row items-center gap-[24px]">
                        <div className="box-border flex flex-row items-center px-3 py-1.5 gap-[10px] w-[284px] h-[36px] border border-[rgba(107,114,128,0.4)] rounded-xl">
                            <Search className="w-5 h-5 text-[#6B7280]" strokeWidth={2} />
                            <input 
                                type="text" 
                                placeholder="Search for counsellors" 
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                className="w-full bg-transparent outline-none font-['Poppins'] font-medium text-[14px] text-[#6B7280] placeholder-[#6B7280]" 
                            />
                        </div>

                        <div className="flex flex-row justify-center items-center gap-[12px]">
                            <span className="font-['Poppins'] font-medium text-[14px] text-[#525055]">Sort by:</span>
                            <div className="box-border flex flex-row justify-between items-center px-2 py-3 gap-[24px] h-[48px] bg-white rounded-lg border border-transparent hover:border-gray-200 cursor-pointer transition-colors">
                                <span className="font-['Poppins'] font-medium text-[16px] text-[#525055]">Recommended</span>
                                <ChevronDown className="w-4 h-4 text-[#242645]" strokeWidth={1.5} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Loading State / Empty State */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[24px] pb-[40px] w-full animate-pulse">
                    {Array.from({ length: 6 }).map((_, idx) => (
                        <div key={`c-listing-skeleton-${idx}`} className="w-full max-w-[308px] h-[367px] rounded-xl bg-white" />
                    ))}
                </div>
            ) : counsellors.length === 0 ? (
                <div className="flex justify-center py-20 w-full text-gray-500 font-[Poppins] text-[18px]">
                    No Counsellor found matching your criteria.
                </div>
            ) : (
                <>
                    {/* Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[24px] pb-[40px]">
                        {counsellors.map((counsellor, index) => {
                            const isLast = index === counsellors.length - 1;
                            return (
                                <div 
                                    key={counsellor.id} 
                                    ref={isLast ? lastElementRef : null}
                                    onClick={() => navigate(`/counsellor/${encodeCounselorId(counsellor.id)}`)} // Applied encodeCounselorId here
                                    className="relative w-full max-w-[308px] h-[367px] bg-white rounded-xl shadow-[0px_2px_8px_rgba(0,0,0,0.2)] hover:-translate-y-1 transition-transform cursor-pointer"
                                >
                                    {/* Image Frame */}
                                    <div className="absolute left-[12px] top-[12px] w-[calc(100%-24px)] h-[200px] bg-[#F5F5F7] rounded-[8px] overflow-hidden">
                                        {counsellor.imageUrl && (
                                            <img src={counsellor.imageUrl} alt={counsellor.name} className="w-full h-full object-cover" />
                                        )}
                                        <div className="absolute left-[10px] top-[10px] flex flex-row items-center px-1.5 py-1 gap-[2px] min-w-[48px] h-[24px] rounded-full">
                                            <Star style={{ width: '15.34px', height: '14.67px' }} className="text-white fill-[#0E1629] shrink-0" />
                                            <span className="font-['Poppins'] font-medium text-[14px] text-[#0E1629] whitespace-nowrap">{counsellor.rating}</span>
                                        </div>
                                    </div>

                                    {/* Info Section */}
                                    <div className="absolute left-[12px] top-[220px] flex flex-col items-start w-[calc(100%-24px)]">
                                        {counsellor.verified && (
                                            <div className="flex flex-row items-center gap-1 w-[59px] h-[16px] mb-0.5">
                                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="8" fill="#3AAF3C"/><path d="M5 8L7 10L11 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                                <span className="font-['Poppins'] font-medium text-[10px] leading-[15px] capitalize text-[#3AAF3C]">Verified</span>
                                            </div>
                                        )}
                                        <h3 className="font-['Poppins'] font-medium text-[18px] leading-[27px] text-[#0E1629] m-0 w-full whitespace-nowrap overflow-hidden text-ellipsis">
                                            {counsellor.name}
                                        </h3>
                                    </div>

                                    {/* Details Line */}
                                    <div className="absolute left-[12px] top-[267px] flex flex-col items-start gap-1 w-[220px] h-[46px]">
                                        <div className="flex flex-row items-center gap-2 h-[21px]">
                                            <span className="font-['Poppins'] font-normal text-[14px] leading-[21px] capitalize text-[#6B7280]">
                                                {counsellor.course} | {counsellor.experience}
                                            </span>
                                        </div>
                                        <div className="flex flex-row items-center gap-1 h-[21px]">
                                            <span className="font-['Poppins'] font-normal text-[14px] leading-[21px] text-[#6B7280]">
                                                {counsellor.location}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Pricing Plans */}
                                    <div className="absolute left-[12px] top-[320px] flex flex-row items-center gap-2 w-[209px] h-[40px]">
                                        <div className="box-border flex flex-col justify-center items-center py-0.5 w-[57px] h-[40px] bg-[linear-gradient(266.79deg,rgba(222,237,255,0.4)_0.46%,rgba(126,136,211,0.4)_130.49%)] rounded-xl">
                                            <span className="font-['Poppins'] font-normal text-[12px] text-[#1447E7]">Plus</span>
                                            <span className="font-['Poppins'] font-medium text-[12px] text-[#1447E7]">₹{counsellor.plans.plus}</span>
                                        </div>
                                        <div className="box-border flex flex-col justify-center items-center py-0.5 w-[64px] h-[40px] bg-[linear-gradient(257.67deg,rgba(244,232,255,0.4)_1.56%,rgba(250,244,255,0.4)_100%)] rounded-xl">
                                            <span className="font-['Poppins'] font-normal text-[12px] text-[#8200DA]">Pro</span>
                                            <span className="font-['Poppins'] font-medium text-[12px] text-[#8200DA]">₹{counsellor.plans.pro}</span>
                                        </div>
                                        <div className="box-border flex flex-col justify-center items-center py-0.5 w-[72px] h-[40px] bg-[linear-gradient(257.67deg,rgba(255,245,206,0.4)_1.56%,rgba(255,250,230,0.4)_100%)] rounded-xl">
                                            <span className="font-['Poppins'] font-normal text-[12px] text-[#B94C00]">Elite</span>
                                            <span className="font-['Poppins'] font-medium text-[12px] text-[#B94C00]">₹{counsellor.plans.elite}</span>
                                        </div>
                                    </div>

                                    {/* Arrow Action Button */}
                                    <div 
                                        className="absolute right-[12px] top-[305px] w-[53px] h-[50px] bg-[#0E1629] rounded-lg cursor-pointer hover:bg-[#1f2d4f] transition-colors flex justify-center items-center"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/counsellor/${encodeCounselorId(counsellor.id)}`); // Applied encodeCounselorId here too
                                        }}
                                    >
                                        <ArrowRight className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Loading Spinner for Infinite Scroll */}
                    {isFetchingMore && (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[24px] py-6 w-full pb-20 animate-pulse">
                            {Array.from({ length: 3 }).map((_, idx) => (
                                <div key={`c-listing-more-skeleton-${idx}`} className="w-full max-w-[308px] h-[367px] rounded-xl bg-white" />
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