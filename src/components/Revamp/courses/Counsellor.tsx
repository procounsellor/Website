import { useNavigate } from "react-router-dom";
import FancyCard from "../admissions/counsellor/counsellorCard";
import { SeeAllButton } from "../components/LeftRightButton";
import { academicApi } from "@/api/academic";
import type { AllCounselor } from "@/types/academic";
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export default function CounsellorSection() {
    const navigate = useNavigate();

    // Reuse the same cached query as the Admissions CounsellorSection
    const { data: counsellors = [], isLoading, isError } = useQuery({
        queryKey: ['revamp-counsellors'],
        queryFn: () => academicApi.getLoggedOutCounsellors(),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });

    const displayCounsellors = counsellors.slice(0, 5);

    const getExperienceText = (experience?: string | null) => {
        if (!experience || experience === "0") return "Entry Level";
        if (experience.toLowerCase().includes("year")) return experience;
        return `${experience}+ years of experience`;
    };

    const getImageUrl = (c: AllCounselor) => {
        return c.photoUrlSmall ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(`${c.firstName} ${c.lastName}`)}&background=6B7280&color=ffffff&size=400`;
    };

    return (
        <div className="w-full py-10">
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

                {/* Cards */}
                <div className="flex gap-[25px] justify-center mb-6 min-h-[367px] items-start">
                    {isLoading ? (
                        <div className="flex flex-col items-center gap-3 self-center">
                            <Loader2 className="animate-spin h-8 w-8 text-[#0E1629]" />
                            <p className="font-[Poppins] text-[14px] text-[#6B7280]">Loading counsellors...</p>
                        </div>
                    ) : isError ? (
                        <p className="font-[Poppins] text-[14px] text-red-500 self-center">Failed to load counsellors</p>
                    ) : displayCounsellors.length === 0 ? (
                        <p className="font-[Poppins] text-[14px] text-[#6B7280] self-center">No counsellors found</p>
                    ) : (
                        displayCounsellors.map((c: AllCounselor) => (
                            <FancyCard
                                key={c.counsellorId}
                                counsellorId={c.counsellorId}
                                name={`${c.firstName} ${c.lastName}`}
                                imageUrl={getImageUrl(c)}
                                rating={c.rating || 4.0}
                                experience={getExperienceText(c.experience)}
                                city={c.city || "Not specified"}
                                proCoins={c.plusAmount}
                            />
                        ))
                    )}
                </div>

                {/* See All button */}
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