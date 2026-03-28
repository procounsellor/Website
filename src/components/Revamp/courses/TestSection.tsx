import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { CourseType } from "@/types/course";
import TestGroupCard from "./TestGroupCard";
import { SeeAllButton } from "../components/LeftRightButton";

type TestTab = "my-tests" | "trending" | "all-tests";

interface TestWithMeta extends CourseType {
  description: string;
  isPurchased: boolean;
  isTrending: boolean;
}

const testImages = ["/course/2.png", "/course/3.png"];

const testsData: TestWithMeta[] = [
  {
    id: "test-1",
    image: testImages[0],
    rating: "4.8",
    name: "Foundations of Mental Wellness",
    subject: "Mental",
    description:
      "Build calm focus, emotional resilience, and practical coping skills with guided weekly practice sets.",
    price: "INR 4,999",
    courseTimeHours: 12,
    courseTimeMinutes: 0,
    isPurchased: true,
    isTrending: true,
  },
  {
    id: "test-2",
    image: testImages[1],
    rating: "4.6",
    name: "Psychometric Test Mastery",
    subject: "Psychometric",
    description:
      "Master aptitude and personality sections through timed mocks, analysis reports, and smart improvement paths.",
    price: "INR 3,499",
    courseTimeHours: 9,
    courseTimeMinutes: 30,
    isPurchased: false,
    isTrending: true,
  },
  {
    id: "test-3",
    image: testImages[0],
    rating: "4.7",
    name: "Admission Strategy Blueprint",
    subject: "Admission",
    description:
      "Plan your complete admission journey with deadline tracking, profile strength mapping, and interview drills.",
    price: "INR 5,299",
    courseTimeHours: 14,
    courseTimeMinutes: 15,
    isPurchased: true,
    isTrending: false,
  },
  {
    id: "test-4",
    image: testImages[1],
    rating: "4.5",
    name: "Career Upskilling Essentials",
    subject: "Upskilling",
    description:
      "Strengthen core career skills with topic-wise assessments, revision tracks, and benchmark performance goals.",
    price: "INR 2,999",
    courseTimeHours: 8,
    courseTimeMinutes: 45,
    isPurchased: false,
    isTrending: true,
  },
  {
    id: "test-5",
    image: testImages[1],
    rating: "4.9",
    name: "Personal Growth Lab",
    subject: "Mental",
    description:
      "Improve confidence, consistency, and mindset through structured reflection tests and actionable progress plans.",
    price: "INR 3,999",
    courseTimeHours: 10,
    courseTimeMinutes: 0,
    isPurchased: true,
    isTrending: false,
  },
  {
    id: "test-6",
    image: testImages[0],
    rating: "4.4",
    name: "College Readiness Bootcamp",
    subject: "Admission",
    description:
      "Get college-ready with preparation tests covering academics, communication, and transition readiness milestones.",
    price: "INR 2,499",
    courseTimeHours: 7,
    courseTimeMinutes: 20,
    isPurchased: false,
    isTrending: true,
  },
  {
    id: "test-7",
    image: testImages[0],
    rating: "4.8",
    name: "Student Success Mindset",
    subject: "Mental",
    description:
      "Develop high-performance study habits using weekly challenge tests, feedback loops, and clarity checkpoints.",
    price: "INR 3,799",
    courseTimeHours: 11,
    courseTimeMinutes: 10,
    isPurchased: true,
    isTrending: false,
  },
  {
    id: "test-8",
    image: testImages[1],
    rating: "4.7",
    name: "Scholarship Interview Accelerator",
    subject: "Admission",
    description:
      "Prepare for scholarship rounds with scenario-based tests, response frameworks, and confidence-building practice.",
    price: "INR 3,299",
    courseTimeHours: 9,
    courseTimeMinutes: 50,
    isPurchased: false,
    isTrending: true,
  },
];

const tabOptions: { id: TestTab; label: string }[] = [
  { id: "my-tests", label: "My Tests" },
  { id: "trending", label: "Trending" },
];

export default function TestSection() {
  const isUserLoggedIn = true;
  const isLoadingTests = false;

  const [activeTab, setActiveTab] = useState<TestTab>("my-tests");
  const [startIndex, setStartIndex] = useState(0);

  const filteredTests = useMemo(() => {
    if (!isUserLoggedIn) return testsData;

    if (activeTab === "my-tests") {
      return testsData.filter((test) => test.isPurchased);
    }

    if (activeTab === "trending") {
      return testsData.filter(
        (test) => test.isTrending && !test.isPurchased,
      );
    }

    return testsData.filter((test) => !test.isPurchased);
  }, [activeTab, isUserLoggedIn]);

  const visibleCount = 4;
  const maxStartIndex = Math.max(filteredTests.length - visibleCount, 0);
  const safeStartIndex = Math.min(startIndex, maxStartIndex);
  const visibleTests = filteredTests.slice(
    safeStartIndex,
    safeStartIndex + visibleCount,
  );

  const handleTabChange = (tab: TestTab) => {
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
    <div>
      {/* phone view */}

      <div className="block py-[15px] pl-5  bg-[#C6DDF040] md:hidden">
        <div className="flex flex-col  justify-start items-start gap-3 pr-0">
          <div className="flex items-center gap-2 bg-white px-3 py-1 ">
            <div className="w-4 h-4 bg-[#0E1629]" />
            <p className="font-[Poppins] font-semibold text-xs text-[#0E1629] uppercase tracking-wider">
              Tests
            </p>
          </div>

          <p className="font-[Poppins] font-medium  text-xs text-start text-[#0E1629] max-w-[682px] leading-normal">
            Discover curated tests across mental wellness, assessments,
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
              className="flex gap-3 overflow-x-auto scrollbar-hide pb-2"
            >
              {filteredTests.map((test, index) => (
                <div key={test.id} className="shrink-0">
                  <TestGroupCard
                    image={test.image}
                    rating={test.rating ?? "0.0"}
                    title={test.name}
                    description={test.description}
                    totalTests={2 + (index % 4)}
                    totalStudents={24 + index * 3}
                    isBaught={activeTab === "trending" ? false : true}
                    isMyTestsCard={activeTab === "my-tests"}
                  />
                </div>
              ))}
            </div>

            <div className="mt-2 h-1 w-20 bg-[#EDEDED] rounded-[48px] overflow-hidden">
              <div
                className="h-full bg-[#0E1629] rounded-[48px] transition-all duration-200"
                style={{ width: `${78}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* laptopp desktop view */}
      <div className="hidden md:block w-full py-10">
        <div className="max-w-[1440px] h-full mx-auto px-[60px]">
          <div className="flex justify-between items-start mb-10">
            <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-md">
              <div className="w-4 h-4 bg-[#0E1629]" />
              <p className="font-[Poppins] font-semibold text-[14px] text-[#0E1629] uppercase tracking-wider">
                TESTS
              </p>
            </div>

            <p className="font-[Poppins] font-medium text-[24px] text-[#0E1629] max-w-[682px] leading-normal">
              Discover curated tests across mental wellness, assessments,
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
            {isLoadingTests ? (
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
                    className="w-[312px] h-[420px] rounded-2xl bg-[#F3F4F6] animate-pulse"
                  />
                ))}
              </motion.div>
            ) : visibleTests.length > 0 ? (
              <motion.div
                key={activeTab}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="flex gap-[25px] justify-center mb-6 min-h-[451px] items-start"
              >
                {visibleTests.map((test, index) => (
                  <motion.div key={test.id} variants={cardVariants}>
                    <TestGroupCard
                      image={test.image}
                      rating={test.rating ?? "0.0"}
                      title={test.name}
                      description={test.description}
                      totalTests={2 + ((safeStartIndex + index) % 4)}
                      totalStudents={24 + (safeStartIndex + index) * 3}
                      isBaught={activeTab === "trending" ? false : true}
                      isMyTestsCard={activeTab === "my-tests"}
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
                  No tests found for this tab.
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
