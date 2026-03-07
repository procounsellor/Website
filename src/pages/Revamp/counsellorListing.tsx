import React, { useState, useMemo } from "react";

const CounsellorListing: React.FC = () => {
    // --- State Management ---
    const [selectedExperience, setSelectedExperience] = useState<string[]>([]);
    const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
    const [selectedCities, setSelectedCities] = useState<string[]>([]);
    const [selectedDays, setSelectedDays] = useState<string[]>([]);
    const [citySearch, setCitySearch] = useState("");
    const [minPrice, setMinPrice] = useState<number | "">(100);
    const [maxPrice, setMaxPrice] = useState<number | "">(1000);

    // --- Data Definitions ---
    const experienceLevels = [
        { label: "Entry Level", sub: "0-1 years", value: "entry" },
        { label: "Junior Level", sub: "1-3 years", value: "junior" },
        { label: "Senior Level", sub: "3+ years", value: "senior" },
    ];

    const languages = ["Hindi", "English", "Telugu", "Marathi"];

    const allCities = ["Patna", "Mumbai", "Delhi", "Hyderabad"];
    const filteredCities = useMemo(() =>
        allCities.filter(city => city.toLowerCase().includes(citySearch.toLowerCase())),
        [citySearch]
    );

    const workingDays = [
        { row: ["Mon", "Tue", "Wed", "Thu", "Fri"], widths: ["51px", "46px", "53px", "47px", "37px"] },
        { row: ["Sun", "Sat"], widths: ["47px", "44px"] }
    ];

    // --- Toggle Logic ---
    const toggleFilter = (list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, item: string) => {
        if (list.includes(item)) {
            setList(list.filter(i => i !== item));
        } else {
            setList([...list, item]);
        }
    };

    // Calculate total active filters
    const isPriceChanged = minPrice !== 1 || maxPrice !== 100000;
    const activeFilterCount = selectedExperience.length + selectedLanguages.length + selectedCities.length + selectedDays.length + (isPriceChanged ? 1 : 0);

    return (
        <div className="mt-8 ml-[60px]">
            {/* Breadcrumb Navigation */}
            <div className="flex flex-row items-center p-0 gap-[8px] mb-[24px]">
                <span className="font-[Poppins] font-normal text-[16px] leading-[21px] text-[#6B7280] cursor-pointer hover:text-[#0E1629]">
                    Probuddy
                </span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_1_196)">
                        <path d="M3.33594 8H12.6693" stroke="#6B7280" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M8.66406 12L12.6641 8" stroke="#6B7280" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M8.66406 4L12.6641 8" stroke="#6B7280" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
                    </g>
                    <defs>
                        <clipPath id="clip0_1_196">
                            <rect width="16" height="16" fill="white" />
                        </clipPath>
                    </defs>
                </svg>
                <span className="font-[Poppins] font-medium text-[16px] leading-[21px] text-[#0E1629]">
                    List of Probuddy
                </span>
            </div>

            {/* Heading */}
            <div className="box-border flex flex-row justify-between items-center px-5 py-4 w-[312px] h-[64px] bg-white border border-[#E6E6E6] rounded-[8px] flex-none order-0 grow-0">
                <div className="flex flex-row justify-center items-center p-0 gap-[12px] w-[84px] h-[24px]">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[24px] h-[24px]">
                        <line x1="3" y1="6" x2="21" y2="6" stroke="#0E1629" strokeWidth="1.5" strokeLinecap="round" />
                        <line x1="3" y1="12" x2="21" y2="12" stroke="#0E1629" strokeWidth="1.5" strokeLinecap="round" />
                        <line x1="3" y1="18" x2="21" y2="18" stroke="#0E1629" strokeWidth="1.5" strokeLinecap="round" />
                        <circle cx="8" cy="6" r="2" fill="white" stroke="#0E1629" strokeWidth="1.5" />
                        <circle cx="16" cy="12" r="2" fill="white" stroke="#0E1629" strokeWidth="1.5" />
                        <circle cx="11" cy="18" r="2" fill="white" stroke="#0E1629" strokeWidth="1.5" />
                    </svg>
                    <span className="font-[Poppins] font-semibold text-[16px] leading-[24px] tracking-[-0.008em] capitalize text-[#0E1629]">
                        Filters
                    </span>
                </div>
                <div className="flex flex-col justify-center items-center px-[10px] py-[6px] w-[28px] h-[28px] bg-[#0E1629] rounded-[4px]">
                    <span className="font-[Arial] font-semibold text-[12px] leading-[16px] text-center text-white">
                        {activeFilterCount}
                    </span>
                </div>
            </div>

            {/* ── Experience Section ── */}
            <div className="box-border flex flex-col items-center pb-[16px] gap-[16px] mt-[12px] w-[312px] bg-white border border-[#E6E6E6] rounded-[8px]">
                <div className="box-border flex flex-row items-center px-5 py-5 w-full h-[67px] bg-white border-b border-[#E6E6E6] rounded-t-[8px]">
                    <span className="font-[Poppins] font-medium text-[18px] leading-[27px] capitalize text-[#242645]">
                        Experience
                    </span>
                </div>
                <div className="flex flex-col gap-[10px] w-[272px]">
                    {experienceLevels.map((lvl) => (
                        <div key={lvl.value} className="flex flex-row items-center gap-[12px] cursor-pointer" onClick={() => toggleFilter(selectedExperience, setSelectedExperience, lvl.value)}>
                            <div className={`box-border w-[18px] h-[18px] flex justify-center items-center ${selectedExperience.includes(lvl.value) ? 'bg-[#0E1629]' : 'bg-white border border-[#CED1D9]'}`}>
                                {selectedExperience.includes(lvl.value) && (
                                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2.5 7L5.5 10L11.5 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                )}
                            </div>
                            <div className="flex flex-col">
                                <span className={`font-[Poppins] text-[14px] leading-[21px] ${selectedExperience.includes(lvl.value) ? 'font-medium' : 'font-normal'} text-[#0E1629]`}>{lvl.label}</span>
                                <span className="font-[Poppins] font-normal text-[12px] leading-[18px] text-[#0E1629]">{lvl.sub}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Language Section ── */}
            <div className="flex flex-col items-center pb-[16px] gap-[16px] w-[312px] bg-white border border-[#E6E6E6] rounded-[8px] mt-[12px]">
                <div className="box-border flex flex-row items-center px-[20px] py-[20px] w-full h-[62px] border-b border-[#E6E6E6] rounded-t-[8px]">
                    <span className="font-[Poppins] font-medium text-[18px] leading-[22px] capitalize text-[#242645]">
                        Language
                    </span>
                </div>
                <div className="flex flex-col gap-[10px] w-[272px]">
                    {languages.map(lang => (
                        <div key={lang} className="flex flex-row items-center gap-[12px] cursor-pointer" onClick={() => toggleFilter(selectedLanguages, setSelectedLanguages, lang)}>
                            <div className={`box-border w-[18px] h-[18px] flex justify-center items-center ${selectedLanguages.includes(lang) ? 'bg-[#0E1629]' : 'bg-white border border-[#CED1D9]'}`}>
                                {selectedLanguages.includes(lang) && (
                                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2.5 7L5.5 10L11.5 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                )}
                            </div>
                            <span className={`font-[Poppins] text-[14px] leading-[21px] ${selectedLanguages.includes(lang) ? 'font-medium' : 'font-normal'} text-[#0E1629]`}>{lang}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── City Section ── */}
            <div className="box-border flex flex-col items-center pb-[16px] gap-[16px] w-[312px] bg-white border border-[#E6E6E6] rounded-[8px] mt-[12px]">
                <div className="box-border flex flex-row items-center px-[20px] py-[20px] w-full h-[67px] border-b border-[#E6E6E6] rounded-t-[8px]">
                    <span className="font-[Poppins] font-medium text-[18px] leading-[27px] text-[#242645]">City</span>
                </div>
                <div className="w-[272px] flex flex-col gap-[16px]">
                    <div className="relative w-[272px] h-[40px] bg-white border border-[#EFEFEF] rounded-[12px] flex items-center px-[12px]">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="#343C6A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M21 21L16.65 16.65" stroke="#343C6A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search Cities"
                            value={citySearch}
                            onChange={(e) => setCitySearch(e.target.value)}
                            className="ml-[8px] w-full h-full bg-transparent outline-none font-medium font-[Poppins] text-[14px] text-[#232323] placeholder:text-[#232323]"
                        />
                    </div>
                    <div className="flex flex-col gap-[10px]">
                        {filteredCities.map(city => (
                            <div key={city} className="flex flex-row items-center gap-[12px] cursor-pointer" onClick={() => toggleFilter(selectedCities, setSelectedCities, city)}>
                                <div className={`w-[20px] h-[20px] border-2 ${selectedCities.includes(city) ? 'bg-[#0E1629] border-[#0E1629]' : 'bg-white border-[#232323]'} flex justify-center items-center`}>
                                    {selectedCities.includes(city) && (
                                        <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M2.5 7L5.5 10L11.5 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                    )}
                                </div>
                                <span className="font-[Poppins] font-medium text-[14px] leading-[21px] text-[#0E1629]">{city}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Price Section ── */}
            <div className="box-border flex flex-col items-center pb-[16px] gap-[16px] w-[312px] bg-white border border-[#E6E6E6] rounded-[8px] mt-[12px]">
                <div className="box-border flex flex-row items-center px-[20px] py-[20px] w-full h-[67px] bg-white border-b border-[#E6E6E6] rounded-t-[8px]">
                    <span className="font-[Poppins] font-medium text-[18px] leading-[27px] text-[#242645]">Price</span>
                </div>
                <div className="flex flex-row justify-between w-[272px]">
                    <div className="flex flex-col gap-[5px] w-[128px]">
                        <span className="font-[Poppins] font-medium text-[12px] leading-[18px] text-[#232323]">Min Price</span>
                        <div className="box-border w-[128px] h-[36px] bg-white border border-[#EFEFEF] rounded-[12px] flex items-center px-[12px]">
                            <span className="font-[Poppins] font-semibold text-[14px] leading-[21px] text-[#6B7280]">₹</span>
                            <input
                                type="number"
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value === "" ? "" : Number(e.target.value))}
                                className="w-full h-full bg-transparent outline-none font-[Poppins] font-semibold text-[14px] leading-[21px] text-[#6B7280]"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-[5px] w-[128px]">
                        <span className="font-[Poppins] font-medium text-[12px] leading-[18px] text-[#232323]">Max Price</span>
                        <div className="box-border w-[128px] h-[36px] bg-white border border-[#EFEFEF] rounded-[12px] flex items-center px-[12px]">
                            <span className="font-[Poppins] font-semibold text-[14px] leading-[21px] text-[#6B7280]">₹</span>
                            <input
                                type="number"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value === "" ? "" : Number(e.target.value))}
                                className="w-full h-full bg-transparent outline-none font-[Poppins] font-semibold text-[14px] leading-[21px] text-[#6B7280]"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Working Days Section ── */}
            <div className="box-border flex flex-col items-center pb-[16px] gap-[16px] w-[312px] bg-white border border-[#E6E6E6] rounded-[8px] mt-[12px] mb-[70px]">
                <div className="box-border flex flex-row items-center px-[20px] py-[20px] w-full h-[67px] bg-white border-b border-[#E6E6E6] rounded-t-[8px]">
                    <span className="font-[Poppins] font-medium text-[18px] leading-[27px] text-[#242645]">Working Days</span>
                </div>
                <div className="flex flex-col gap-[10px] w-[272px]">
                    {workingDays.map((group, idx) => (
                        <div key={idx} className="flex flex-row gap-[8px]">
                            {group.row.map((day, dIdx) => (
                                <div
                                    key={day}
                                    className={`box-border flex justify-center items-center py-[8px] rounded-[10px] cursor-pointer transition-colors border ${selectedDays.includes(day) ? 'bg-[#0E1629] border-[#0E1629] text-white' : 'bg-white border-[#EFEFEF] text-[#232323]'}`}
                                    style={{ width: group.widths[dIdx] }}
                                    onClick={() => toggleFilter(selectedDays, setSelectedDays, day)}
                                >
                                    <span className="font-[Poppins] font-medium text-[14px] leading-[21px]">{day}</span>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default CounsellorListing;