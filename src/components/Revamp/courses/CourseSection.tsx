import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { CourseType } from "@/types/course";
import CourseCard from "./CourseCard";
import { SeeAllButton } from "../components/LeftRightButton";
import { getBoughtCourses } from "@/api/course";
import { useNavigate } from "react-router-dom";

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
    price: "₹149",
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
    price: "₹299",
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
    price: "₹499",
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
    price: "₹699",
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
    price: "₹799",
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
    price: "₹899",
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
    price: "₹599",
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
    price: "₹949",
    courseTimeHours: 9,
    courseTimeMinutes: 50,
    isPurchased: false,
    isTrending: true,
  },
];

const tabOptions: { id: CourseTab; label: string }[] = [
  { id: "my-courses", label: "My Course" },
  { id: "trending", label: "Trending" },
];

const formatRatingToOneDecimal = (rating: unknown) => {
  const numeric = Number(rating);
  return Number.isFinite(numeric) ? numeric.toFixed(1) : "0.0";
};

export default function CourseSection() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("phone") || "";
  const token = localStorage.getItem("jwt") || "";
  const isUserLoggedIn = Boolean(userId && token);
  const [isLoadingCourses, setIsLoadingCourses] = useState(false);
  const [myCoursesData, setMyCoursesData] = useState<CourseWithMeta[]>([]);

  const [activeTab, setActiveTab] = useState<CourseTab>("my-courses");

  useEffect(() => {
    const loadMyCourses = async () => {
      if (!isUserLoggedIn) {
        setMyCoursesData([]);
        return;
      }

      try {
        setIsLoadingCourses(true);
        const response = await getBoughtCourses(userId);
        const list = Array.isArray(response?.data) ? response.data : [];
        const normalized: CourseWithMeta[] = list.map((course: any) => ({
          id: String(course?.courseId || ""),
          image: String(course?.courseThumbnailUrl || "/course/2.png"),
          rating: formatRatingToOneDecimal(course?.rating),
          name: String(course?.courseName || "Course"),
          subject: String(course?.category || "General"),
          price: `₹${Number(course?.coursePriceAfterDiscount ?? course?.coursePrice ?? 0).toLocaleString("en-IN")}`,
          courseTimeHours: 0,
          courseTimeMinutes: 0,
          isPurchased: true,
          isTrending: false,
        }));
        setMyCoursesData(normalized);
      } catch (error) {
        console.error("Failed to load bought courses:", error);
        setMyCoursesData([]);
      } finally {
        setIsLoadingCourses(false);
      }
    };

    loadMyCourses();
  }, [isUserLoggedIn, userId]);

  const filteredCourses = useMemo(() => {
    if (!isUserLoggedIn) return coursesData;

    if (activeTab === "my-courses") {
      return myCoursesData;
    }

    if (activeTab === "trending") {
      return coursesData.filter(
        (course) => course.isTrending && !course.isPurchased,
      );
    }

    return coursesData.filter((course) => !course.isPurchased);
  }, [activeTab, isUserLoggedIn, myCoursesData]);

  const handleTabChange = (tab: CourseTab) => {
    setActiveTab(tab);
  };

  const shouldShowInlineCourseUpsell =
    isUserLoggedIn && activeTab === "my-courses" && filteredCourses.length <= 1 && !isLoadingCourses;

  const handleSingleCardCta = () => {
    if (isUserLoggedIn && activeTab === "my-courses") {
      handleTabChange("trending");
      return;
    }
    navigate("/revamp-courses");
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
    <div>
      <div className="block py-[15px] pl-5 bg-[#F5F5F7] md:hidden">
        <div className="flex flex-col  justify-start items-start gap-3 pr-0">
          <div className="flex items-center gap-2 bg-white px-3 py-1 ">
            <div className="w-4 h-4 bg-[#0E1629]" />
            <p className="font-[Poppins] font-semibold text-xs text-[#0E1629] uppercase tracking-wider">
              COURSES
            </p>
          </div>

          <p className="font-[Poppins] font-medium  text-xs text-start text-[#0E1629] max-w-[682px] leading-normal">
            Discover curated programs across mental wellness, assessments,
            admissions, and upskilling led by experienced professionals, built
            around your needs.
          </p>

          <div className="flex gap-2.5 pt-2">
            {tabOptions.map((tab) => (
              <div
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`border border-(--text-main) py-1.5 px-3 rounded-[5px] text-xs font-medium cursor-pointer ${activeTab === tab.id ? "bg-(--text-main) text-white" : "text-(--text-main) bg-none"}`}
              >
                {tab.label}
              </div>
            ))}
          </div>

          <div className="w-full">
            <div
              className="flex justify-start gap-3 overflow-x-auto scrollbar-hide pb-2 snap-x snap-mandatory scroll-smooth [touch-action:pan-x]"
            >
              {filteredCourses.map((course) => (
                <div key={course.id} className="shrink-0 snap-start">
                  <CourseCard
                    course={course}
                    isBaught={course.isPurchased}
                    isLoading={false}
                  />
                </div>
              ))}

              {shouldShowInlineCourseUpsell && (
                <div className="self-center shrink-0 snap-start w-[250px] h-[150px] rounded-2xl p-3 flex items-center justify-center text-center">
                  <div className="w-full flex flex-col items-center gap-3">
                    <div>
                      <p className="text-sm font-semibold text-[#0E1629]">Keep the momentum going</p>
                      <p className="mt-2 text-xs text-[#6B7280]">
                        Add more courses to build consistency and better outcomes.
                      </p>
                    </div>
                    <button
                      onClick={handleSingleCardCta}
                      className="w-full rounded-lg bg-[#0E1629] px-3 py-2 text-xs font-semibold text-white hover:opacity-90"
                    >
                      Explore Trending
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="hidden md:block w-full py-10">
        <div className="max-w-[90rem] h-full mx-auto px-[3.75rem]">
          <div className="flex justify-between items-start mb-10">
            <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-md">
              <div className="w-4 h-4 bg-[#0E1629]" />
              <p className="font-[Poppins] font-semibold text-xs md:text-[14px] text-[#0E1629] uppercase tracking-wider">
                COURSES
              </p>
            </div>

            <p className="font-[Poppins] font-medium  text-xs md:text-[24px] text-[#0E1629] max-w-[682px] leading-normal">
              Discover curated programs across mental wellness, assessments,
              admissions, and upskilling led by experienced professionals, built
              around your needs.
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
                  transition={{
                    type: "spring" as const,
                    stiffness: 300,
                    damping: 20,
                  }}
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
            ) : filteredCourses.length > 0 || shouldShowInlineCourseUpsell ? (
              <>
                <motion.div
                  key={activeTab}
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="flex justify-start gap-[25px] mb-6 min-h-[451px] items-start overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth [touch-action:pan-x]"
                >
                  {filteredCourses.map((course) => (
                    <motion.div key={course.id} variants={cardVariants} className="shrink-0 snap-start">
                      <CourseCard
                        course={course}
                        isBaught={course.isPurchased}
                        isLoading={false}
                      />
                    </motion.div>
                  ))}

                  {shouldShowInlineCourseUpsell && (
                    <motion.div
                      className="self-center shrink-0 snap-start w-[24rem] h-[12.5rem] rounded-2xl p-5 flex items-center justify-center text-center"
                      variants={cardVariants}
                    >
                      <div className="w-full flex flex-col items-center gap-4">
                        <div>
                          <p className="text-lg font-semibold text-[#0E1629]">Keep your streak active</p>
                          <p className="mt-2 text-sm text-[#6B7280] leading-relaxed max-w-[20rem] mx-auto">
                            You are off to a great start. Add more courses to unlock better outcomes.
                          </p>
                        </div>
                        <button
                          onClick={handleSingleCardCta}
                          className="rounded-xl bg-[#0E1629] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
                        >
                          Explore Trending
                        </button>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              </>
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
            <div />

            <SeeAllButton
              text="See all"
              onClick={() => console.log("see all")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
