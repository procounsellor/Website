import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FancyCard from "./counsellorCard";
import { SeeAllButton } from "../../components/LeftRightButton";

export default function CounsellorSection(){
    const [activeFilter, setActiveFilter] = useState("all programme");
    
    const filters = [
        "all programme",
        "Mental",
        "Psychometric",
        "Admission",
        "Upskilling"
    ];

    return (
        <div className="bg-[#C6DDF040] w-full py-10">
            <div className="max-w-[1440px] mx-auto px-[60px]">
                {/* Header Section */}
                <div className="flex justify-between items-start mb-10">
                    <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-md">
                        <div className="w-4 h-4 bg-[#0E1629]" />
                        <p className="font-[Poppins] font-semibold text-[14px] text-[#0E1629] uppercase tracking-wider">
                            COUNSELLORS
                        </p>
                    </div>
                    
                    <p className="font-[Poppins] font-medium text-[24px] text-[#0E1629] max-w-[682px] leading-normal">
                        Discover curated programs across mental wellness, assessments, admissions, and upskilling led by experienced professionals, built around your needs.
                    </p>
                </div>

                {/* Filters */}
                <div className="flex gap-[60px] mb-10 px-7">
                    {filters.map((filter) => (
                        <motion.button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            transition={{ duration: 0.2 }}
                            className={`px-5 py-2.5 rounded-[5px] w-[200px] hover:cursor-pointer font-[Poppins] font-medium text-[14px] capitalize transition-all duration-300 ${
                                activeFilter === filter
                                    ? "bg-[#0E1629] text-white"
                                    : "border border-[rgba(14,22,41,0.25)] text-[#0E1629] hover:border-[#0E1629]"
                            }`}
                        >
                            {filter}
                        </motion.button>
                    ))}
                </div>

                {/* Cards */}
                <AnimatePresence mode="wait">
                    <motion.div 
                        key={activeFilter}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="flex gap-[25px] justify-center mb-6"
                    >
                        <FancyCard/>
                        <FancyCard/>
                        <FancyCard/>
                        <FancyCard/>
                        <FancyCard/>
                    </motion.div>
                </AnimatePresence>

                {/* See All button - Right aligned */}
                <div className="flex justify-end">
                    <SeeAllButton 
                        text="See all"
                        onClick={() => console.log('see all')}
                    />
                </div>
            </div>
        </div>
    );
}