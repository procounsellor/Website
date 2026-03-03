import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import FancyCard from "./counsellorCard";
import { SeeAllButton } from "../../components/LeftRightButton";
import { academicApi } from "@/api/academic";
import type { AllCounselor } from "@/types/academic";
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export default function CounsellorSection() {
    const navigate = useNavigate();
    const [activeFilter, setActiveFilter] = useState("all programme");
    const hasAnimated = useRef(false);

    const filters = [
        "all programme",
        "Mental",
        "Psychometric",
        "Admission",
        "Upskilling"
    ];

    const { data: counsellors = [], isLoading, isError, isFetching } = useQuery({
        queryKey: ['revamp-counsellors'],
        queryFn: () => academicApi.getLoggedOutCounsellors(),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });

    const isFromCache = !isLoading && !isFetching && counsellors.length > 0;
    const shouldAnimate = !hasAnimated.current;
    if (isFromCache && !hasAnimated.current) {
        hasAnimated.current = true;
    }

    const filteredCounsellors = activeFilter === "all programme"
        ? counsellors
        : counsellors.filter((c: AllCounselor) =>
            c.expertise?.some(e => e.toLowerCase().includes(activeFilter.toLowerCase()))
        );

    const displayCounsellors = filteredCounsellors.slice(0, 5);

    const getExperienceText = (experience?: string | null) => {
        if (!experience || experience === "0") return "Entry Level";
        if (experience.toLowerCase().includes("year")) return experience;
        return `${experience}+ years of experience`;
    };

    const getImageUrl = (c: AllCounselor) => {
        return c.photoUrlSmall ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(`${c.firstName} ${c.lastName}`)}&background=6B7280&color=ffffff&size=400`;
    };

    const containerVariants = shouldAnimate ? {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.05 }
        },
    } : {
        hidden: { opacity: 1 },
        visible: { opacity: 1 },
    };

    const cardVariants = shouldAnimate ? {
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        visible: { opacity: 1, y: 0, scale: 1 },
    } : {
        hidden: { opacity: 1, y: 0, scale: 1 },
        visible: { opacity: 1, y: 0, scale: 1 },
    };

    return (
        <div className="bg-[#C6DDF040] w-full py-10">
            <div className="max-w-[1440px] mx-auto px-[60px]">
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

                <div className="flex gap-[60px] mb-10 px-7">
                    {filters.map((filter) => (
                        <motion.button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            transition={{ duration: 0.2 }}
                            className={`px-5 py-2.5 rounded-[5px] w-[200px] hover:cursor-pointer font-[Poppins] font-medium text-[14px] capitalize transition-all duration-300 ${activeFilter === filter
                                    ? "bg-[#0E1629] text-white"
                                    : "border border-[rgba(14,22,41,0.25)] text-[#0E1629] hover:border-[#0E1629]"
                                }`}
                        >
                            {filter}
                        </motion.button>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {isLoading ? (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex gap-[25px] justify-center mb-6 min-h-[367px] items-center"
                        >
                            <div className="flex flex-col items-center gap-3">
                                <Loader2 className="animate-spin h-8 w-8 text-[#0E1629]" />
                                <p className="font-[Poppins] text-[14px] text-[#6B7280]">Loading counsellors...</p>
                            </div>
                        </motion.div>
                    ) : isError ? (
                        <motion.div
                            key="error"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex justify-center mb-6 min-h-[367px] items-center"
                        >
                            <p className="font-[Poppins] text-[14px] text-red-500">Failed to load counsellors</p>
                        </motion.div>
                    ) : displayCounsellors.length === 0 ? (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex justify-center mb-6 min-h-[367px] items-center"
                        >
                            <p className="font-[Poppins] text-[14px] text-[#6B7280]">No counsellors found for this category</p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key={activeFilter}
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="flex gap-[25px] justify-center mb-6 min-h-[367px] items-start"
                        >
                            {displayCounsellors.map((c: AllCounselor) => (
                                <motion.div key={c.counsellorId} variants={cardVariants}>
                                    <FancyCard
                                        counsellorId={c.counsellorId}
                                        name={`${c.firstName} ${c.lastName}`}
                                        imageUrl={getImageUrl(c)}
                                        rating={c.rating || 4.0}
                                        experience={getExperienceText(c.experience)}
                                        city={c.city || "Not specified"}
                                        proCoins={c.plusAmount}
                                    />
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="flex justify-end">
                    <SeeAllButton
                        text="See all"
                        onClick={() => navigate('/counsellors')}
                    />
                </div>
            </div>
        </div>
    );
}