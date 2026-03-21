import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { CourseType } from "@/types/course";
import CourseCard from "./CourseCard";
import { SeeAllButton } from "../components/LeftRightButton";

type CourseTab = "my-courses" | "trending" | "all-courses";

interface CourseWithMeta extends CourseType {
    isPurchased: boolean;
    isTrending: boolean;
}

const courseImages = ["/course/2.png", "/course/3.png"];

const coursesData: CourseWithMeta[] = [
    {
        id: "course-1",
        image: courseImages[0],
        rating: "4.8",
        name: "Foundations of Mental Wellness",
        subject: "Mental",
        price: "INR 4,999",
        courseTimeHours: 12,
        courseTimeMinutes: 0,
        isPurchased: true,
        isTrending: true,
    },
    {
        id: "course-2",
        image: courseImages[1],
        rating: "4.6",
        name: "Psychometric Test Mastery",
        subject: "Psychometric",
        price: "INR 3,499",
        courseTimeHours: 9,
        courseTimeMinutes: 30,
        isPurchased: false,
        isTrending: true,
    },
    {
        id: "course-3",
        image: courseImages[0],
        rating: "4.7",
        name: "Admission Strategy Blueprint",
        subject: "Admission",
        price: "INR 5,299",
        courseTimeHours: 14,
        courseTimeMinutes: 15,
        isPurchased: true,
        isTrending: false,
    },
    {
        id: "course-4",
        image: courseImages[1],
        rating: "4.5",
        name: "Career Upskilling Essentials",
        subject: "Upskilling",
        price: "INR 2,999",
        courseTimeHours: 8,
        courseTimeMinutes: 45,
        isPurchased: false,
        isTrending: true,
    },
    {
        id: "course-5",
        image: courseImages[1],
        rating: "4.9",
        name: "Personal Growth Lab",
        subject: "Mental",
        price: "INR 3,999",
        courseTimeHours: 10,
        courseTimeMinutes: 0,
        isPurchased: true,
        isTrending: false,
    },
    {
        id: "course-6",
        image: courseImages[0],
        rating: "4.4",
        name: "College Readiness Bootcamp",
        subject: "Admission",
        price: "INR 2,499",
        courseTimeHours: 7,
        courseTimeMinutes: 20,
        isPurchased: false,
        isTrending: true,
    },
    {
        id: "course-7",
        image: courseImages[0],
        rating: "4.8",
        name: "Student Success Mindset",
        subject: "Mental",
        price: "INR 3,799",
        courseTimeHours: 11,
        courseTimeMinutes: 10,
        isPurchased: true,
        isTrending: false,
    },
    {
        id: "course-8",
        image: courseImages[1],
        rating: "4.7",
        name: "Scholarship Interview Accelerator",
        subject: "Admission",
        price: "INR 3,299",
        courseTimeHours: 9,
        courseTimeMinutes: 50,
        isPurchased: false,
        isTrending: true,
    },
];

const tabOptions: { id: CourseTab; label: string }[] = [
    { id: "my-courses", label: "My Course" },
    { id: "trending", label: "Trending" },
    { id: "all-courses", label: "All Courses" },
];

export default function CourseSection() {
    // Hardcoded toggles for now; later this can come from auth/session and API loading state.
    const isUserLoggedIn = true;
    const isLoadingCourses = false;

    const [activeTab, setActiveTab] = useState<CourseTab>("my-courses");
    const [startIndex, setStartIndex] = useState(0);

    const filteredCourses = useMemo(() => {
        if (!isUserLoggedIn) return coursesData;

        if (activeTab === "my-courses") {
            return coursesData.filter((course) => course.isPurchased);
        }

        if (activeTab === "trending") {
            return coursesData.filter((course) => course.isTrending && !course.isPurchased);
        }

        return coursesData.filter((course) => !course.isPurchased);
    }, [activeTab, isUserLoggedIn]);

    const visibleCount = 4;
    const maxStartIndex = Math.max(filteredCourses.length - visibleCount, 0);
    const safeStartIndex = Math.min(startIndex, maxStartIndex);
    const visibleCourses = filteredCourses.slice(safeStartIndex, safeStartIndex + visibleCount);

    const handleTabChange = (tab: CourseTab) => {
        setActiveTab(tab);
        setStartIndex(0);
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.12,
                delayChildren: 0.08,
                duration: 0.6,
            },
        },
        exit: {
            opacity: 0,
            transition: {
                staggerChildren: 0.05,
                staggerDirection: -1,
            },
        },
    };

    const cardVariants = {
        hidden: {
            opacity: 0,
            y: 60,
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring" as const,
                stiffness: 80,
                damping: 12,
                mass: 1,
            },
        },
        exit: {
            opacity: 0,
            y: -30,
            transition: {
                duration: 0.3,
            },
        },
    };

    return (
        <div className="w-full py-10">
            <div className="max-w-[1440px] h-full mx-auto px-[60px]">
                <div className="flex justify-between items-start mb-10">
                    <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-md">
                        <div className="w-4 h-4 bg-[#0E1629]" />
                        <p className="font-[Poppins] font-semibold text-[14px] text-[#0E1629] uppercase tracking-wider">
                            COURSES
                        </p>
                    </div>

                    <p className="font-[Poppins] font-medium text-[24px] text-[#0E1629] max-w-[682px] leading-normal">
                        Discover curated programs across mental wellness, assessments, admissions, and upskilling led by experienced professionals, built around your needs.
                    </p>
                </div>

                {isUserLoggedIn && (
                    <div className="flex justify-center gap-[60px] mb-10">
                        {tabOptions.map((tab) => (
                            <motion.button
                                key={tab.id}
                                onClick={() => handleTabChange(tab.id)}
                                whileHover={{ scale: 1.03, y: -2 }}
                                whileTap={{ scale: 0.96 }}
                                transition={{ type: "spring" as const, stiffness: 300, damping: 20 }}
                                className={`px-5 py-2.5 rounded-[5px] w-[200px] hover:cursor-pointer font-[Poppins] font-medium text-[14px] capitalize transition-all duration-300 ${
                                    activeTab === tab.id
                                        ? "bg-[#0E1629] text-white shadow-lg"
                                        : "border border-[rgba(14,22,41,0.25)] text-[#0E1629] hover:border-[#0E1629] hover:shadow-md"
                                }`}
                            >
                                {tab.label}
                            </motion.button>
                        ))}
                    </div>
                )}

                <AnimatePresence mode="wait">
                    {isLoadingCourses ? (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ type: "spring" as const, damping: 20 }}
                            className="flex gap-[25px] justify-center mb-6 min-h-[451px] items-start"
                        >
                            {Array.from({ length: 4 }).map((_, idx) => (
                                <motion.div
                                    key={`skeleton-${idx}`}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        type: "spring" as const,
                                        stiffness: 100,
                                        damping: 12,
                                        delay: idx * 0.1,
                                    }}
                                >
                                    <CourseCard isBaught={false} isLoading={true} />
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : visibleCourses.length > 0 ? (
                        <motion.div
                            key={activeTab}
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="flex gap-[25px] justify-center mb-6 min-h-[451px] items-start"
                        >
                            {visibleCourses.map((course) => (
                                <motion.div key={course.id} variants={cardVariants}>
                                    <CourseCard
                                        course={course}
                                        isBaught={course.isPurchased}
                                        isLoading={false}
                                    />
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ type: "spring" as const, damping: 20 }}
                            className="flex justify-center mb-6 min-h-[451px] items-center"
                        >
                            <p className="font-[Poppins] text-[14px] text-[#6B7280] self-center">
                                No courses found for this tab.
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>

                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div className="w-[262px] h-1 bg-[#EDEDED] rounded-[48px] overflow-hidden">
                                <div
                                    className="h-full bg-[#0E1629] rounded-[48px] transition-all duration-300"
                                    style={{ width: `${40}%` }}
                                />
                            </div>
                        </div>

                        <SeeAllButton text="See all" onClick={() => console.log("see all")} />
                    </div>
            </div>
        </div>
    );
}