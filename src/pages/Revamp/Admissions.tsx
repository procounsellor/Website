import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import Stories from "@/components/Revamp/probuddies/Stories";
import Faq from "@/components/Revamp/admissions/Faq";
import Blogs from "@/components/Revamp/admissions/Blogs";
import College from "@/components/Revamp/admissions/College";
import Deadlines from "@/components/Revamp/admissions/Deadlines";
import CounsellorSection from "@/components/Revamp/admissions/counsellor/CounsellorSection";
import Timeline from "@/components/Revamp/admissions/Timeline";
import RevampBannerSection from "@/components/Revamp/banners/RevampBannerSection";
import PageSEO from "@/components/SEO/PageSEO";

export default function Admissions() {
  const navigate = useNavigate();
  const location = useLocation();
  const hasSeenSplash = sessionStorage.getItem('admissions-splash-seen') === 'true';
  const tabPaths = ['/admissions', '/courses', '/community', '/pro-buddies', '/revamp-about'];

  const navigateWithTabTransition = (path: string) => {
    if (location.pathname === path) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const currentIndex = tabPaths.indexOf(location.pathname);
    const nextIndex = tabPaths.indexOf(path);
    const direction =
      currentIndex >= 0 && nextIndex >= 0 && nextIndex < currentIndex
        ? 'right-to-left'
        : 'left-to-right';

    sessionStorage.setItem('revamp-tab-direction', direction);

    const viewTransitionDoc = document as Document & {
      startViewTransition?: (callback: () => void) => void;
    };

    if (viewTransitionDoc.startViewTransition) {
      viewTransitionDoc.startViewTransition(() => navigate(path));
      return;
    }

    navigate(path);
  };
  const admissionsStories = [
    {
      name: "Ashutosh",
      role: "Student",
      rating: 4,
      text: "The course planning was clear and easy to follow. Weekly targets and mock tests kept me focused and helped me prepare with confidence.",
      image: "/review1.jpeg",
    },
    {
      name: "Ananya",
      role: "Student",
      rating: 5,
      text: "Topic-wise lessons and regular doubt sessions made preparation smooth. The structure helped me stay disciplined and improve consistently.",
      image: "/review2.jpeg",
    },
    {
      name: "Shubham",
      role: "Student",
      rating: 4.5,
      text: "Math and Chemistry sessions were practical and exam-focused. Shortcuts plus regular practice improved my speed, accuracy, and confidence.",
      image: "/review3.jpeg",
    },
  ];

  const [splashPhase, setSplashPhase] = useState(hasSeenSplash ? 3 : 0);
  const animationPhase = 4;

  useEffect(() => {
    if (hasSeenSplash) return; // Skip animation if already seen this session

    const timers = [
      setTimeout(() => setSplashPhase(1), 800),
      setTimeout(() => setSplashPhase(2), 1400),
      setTimeout(() => setSplashPhase(3), 3000),
      setTimeout(() => {
        sessionStorage.setItem('admissions-splash-seen', 'true');
      }, 4900),
    ];

    return () => timers.forEach(clearTimeout);
  }, [hasSeenSplash]);

  const cardAnimate = splashPhase >= 3 && animationPhase >= 4 ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 10, scale: 0.98 };
  const cardTransition = { duration: 0.55, ease: "easeOut" as const };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "ProCounsel",
    "url": "https://www.procounsel.co.in",
    "description": "India's leading platform for college admissions guidance, career counseling, JEE/NEET preparation, and study abroad support.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://www.procounsel.co.in/admissions/blogs?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "ProCounsel",
    "url": "https://www.procounsel.co.in",
    "logo": "https://www.procounsel.co.in/favicon.png",
    "sameAs": [],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer support",
      "url": "https://www.procounsel.co.in/contact"
    }
  };

  return (
    <>
      <PageSEO
        title="ProCounsel – College Admissions, Counseling & Exam Prep"
        description="ProCounsel helps Indian students with college admissions guidance, JEE/NEET preparation, study abroad counseling, expert counsellors, and peer mentorship (ProBuddies)."
        canonical="/admissions"
        keywords="college admissions India, JEE counseling, NEET guidance, study abroad, career counseling, ProCounsel"
        jsonLd={[websiteSchema, organizationSchema]}
      />
    <div className="min-h-screen">
      <section className="hidden md:flex relative w-full h-[567px] flex items-center justify-center overflow-hidden">
        {/* Splash Screen */}
        <AnimatePresence>
          {splashPhase < 3 && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 z-20 bg-white flex items-center justify-center"
            >
              {/* Both logo and text are stacked in center, then separate */}
              <div className="relative flex items-center justify-center">
                {/* Logo - starts centered, then shifts left */}
                <motion.img
                  src="/logo.svg"
                  alt="ProCounsel Logo"
                  className="w-[118px] h-[120px] relative z-10"
                  initial={{ scale: 0, opacity: 0, x: 0 }}
                  animate={
                    splashPhase === 0
                      ? { scale: 1.2, opacity: 1, x: 0 }
                      : splashPhase === 1
                        ? { scale: 0.75, opacity: 1, x: 0 }
                        : { scale: 0.75, opacity: 1, x: -175 }
                  }
                  transition={
                    splashPhase === 0
                      ? { type: "spring", stiffness: 200, damping: 20, delay: 0.2 }
                      : splashPhase === 1
                        ? { duration: 0.5, ease: "easeInOut" }
                        : { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }
                  }
                />

                {/* ProCounsel Text - hidden behind logo, then shifts right */}
                <motion.span
                  className="absolute text-[60px] font-semibold font-['Poppins'] leading-none whitespace-nowrap"
                  initial={{ opacity: 0, x: 0 }}
                  animate={
                    splashPhase >= 2
                      ? { opacity: 1, x: 80 }
                      : { opacity: 0, x: 0 }
                  }
                  transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
                  style={{
                    backgroundImage: "linear-gradient(to right, #FA660F, #2F43F2)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  ProCounsel
                </motion.span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hero Section */}
        <div
          className="text-center xl-px-4 w-full h-[567px] bg-[#0e1629] flex items-center justify-center"
        >
          <div className="w-7xl h-full relative">
            {/* Header Text */}
            <div className="absolute left-1/2 -translate-x-1/2 top-[36px] max-w-[818px] w-full px-4">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={splashPhase >= 3 && animationPhase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="text-white text-[40px] font-extrabold font-['Poppins'] mb-4 leading-tight"
              >
                Your personal Admission Expert
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={splashPhase >= 3 && animationPhase >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="text-[#f5f5f5] text-[16px] font-medium font-['Poppins'] max-w-[753px] mx-auto"
              >
                Find trusted guidance, personalised course matches, and clear admissions support to help you choose the right path.
              </motion.p>
            </div>

            {/* CTA Button */}
            <motion.button
              onClick={() => navigateWithTabTransition("/counsellor-listing")}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={splashPhase >= 3 && animationPhase >= 3 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="absolute z-30 left-1/2 hover:cursor-pointer -translate-x-1/2 top-[180px] bg-[#2f43f2] hover:bg-[#2437d1] transition-colors text-white px-8 py-3 rounded-[48px] text-[16px] font-medium font-['Poppins']"
            >
              Book Admission Counselling
            </motion.button>

            {/* Grid Cards */}
            <div className="absolute inset-0">
              {/* Admissions Card */}
              <motion.div
                onClick={() => navigateWithTabTransition('/admissions')}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={cardAnimate}
                transition={{ ...cardTransition, delay: 0 }}
                className="absolute left-16 top-42.75 w-53 h-53.75 bg-[#ffc8af] rounded-[28px] overflow-hidden cursor-pointer"
              >
                <img
                  src="/admissions/admission.svg"
                  alt="Student"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(179.04deg, rgba(14, 22, 41, 0) 24.07%, rgba(14, 22, 41, 0.7) 69.84%)",
                  }}
                />
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center text-white w-[195px]">
                  <p className="text-[24px] font-semibold font-['Poppins'] mb-2">Admissions</p>
                  <p className="text-[14px] font-['Poppins']">
                    <span className="font-semibold">10,000+</span> Students Guided | <span className="font-semibold">95%</span> Success Rate
                  </p>
                </div>
              </motion.div>

              {/* About Us Card */}
              <motion.div
                onClick={() => navigateWithTabTransition('/revamp-about')}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={cardAnimate}
                transition={{ ...cardTransition, delay: 0.08 }}
                className="absolute left-16 top-102.5 w-53 h-35.25 bg-[#343C6A] rounded-[28px] cursor-pointer"
              >
                <div className="flex flex-col items-center justify-center h-full px-6">
                  <p className="text-[#FFFFFF] text-[24px] font-semibold font-['Poppins'] mb-2">About Us</p>
                  <p className="text-[#FFFFFF] text-[14px] font-['Poppins'] text-center">
                    <span className="font-semibold">15+ Years</span> of Excellence | Trusted by <span className="font-semibold">50,000+ Families</span>
                  </p>
                </div>
              </motion.div>

              {/* Courses Card */}
              <motion.div
                onClick={() => navigateWithTabTransition('/courses')}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={cardAnimate}
                transition={{ ...cardTransition, delay: 0.14 }}
                className="absolute left-74.5 top-66 w-53 h-71.75 rounded-[28px] overflow-hidden bg-gray-700 cursor-pointer"
              >
                <img
                  src="/admissions/course.jpg"
                  alt="Courses"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(179.04deg, rgba(14, 22, 41, 0) 24.07%, rgba(14, 22, 41, 0.7) 69.84%)",
                  }}
                />
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center text-white w-[195px]">
                  <p className="text-[24px] font-semibold font-['Poppins'] mb-2">Courses</p>
                  <p className="text-[14px] font-['Poppins']">
                    <span className="font-semibold">500+</span> Courses Available | <span className="font-semibold">25,000+</span> Active Learners
                  </p>
                </div>
              </motion.div>

              {/* Community Card */}
              <motion.div
                onClick={() => navigateWithTabTransition('/community')}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={cardAnimate}
                transition={{ ...cardTransition, delay: 0.22 }}
                className="absolute left-133.5 top-71.75 w-53 h-66 bg-[#10335e] rounded-[28px] cursor-pointer"
              >
                <div className="flex flex-col items-center justify-center h-full px-6">
                  <p className="text-white text-[24px] font-semibold font-['Poppins'] mb-2">Community</p>
                  <p className="text-white text-[14px] font-['Poppins'] text-center">
                    <span className="font-semibold">120+</span> Members | <span className="font-semibold">20+</span> Monthly Events
                  </p>

                </div>
              </motion.div>

              {/* ProBuddies Card */}
              <motion.div
                onClick={() => navigateWithTabTransition('/pro-buddies')}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={cardAnimate}
                transition={{ ...cardTransition, delay: 0.3 }}
                className="absolute left-192.5 top-66 w-53 h-71.75 rounded-[28px] overflow-hidden bg-gray-700 cursor-pointer"
              >
                <img
                  src="/admissions/pro.jpg"
                  alt="ProBuddies"
                  className="absolute inset-0 w-full h-full object-fit"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(179.04deg, rgba(14, 22, 41, 0) 24.07%, rgba(14, 22, 41, 0.7) 69.84%)",
                  }}
                />
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center text-white w-[195px]">
                  <p className="text-[24px] font-semibold font-['Poppins'] mb-2">ProBuddies</p>
                  <p className="text-[14px] font-['Poppins']">
                    <span className="font-semibold">300+</span> Mentors | <span className="font-semibold">850+</span> Mentees Connected
                  </p>
                </div>
              </motion.div>

              {/* Rank Predictor Card */}
              <motion.div
                onClick={() => navigate('/jee-rank-predictor')}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={cardAnimate}
                transition={{ ...cardTransition, delay: 0.38 }}
                className="absolute lg:right-0 xl:right-16 top-42.75 w-53 h-53.75 bg-[#68aab8] rounded-[28px] overflow-hidden cursor-pointer"
              >
                <img
                  src="/ranking-1.png"
                  alt="Rank Predictor"
                  className="absolute inset-0 w-full h-full object-fit"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(179.04deg, rgba(14, 22, 41, 0) 24.07%, rgba(14, 22, 41, 0.7) 69.84%)",
                  }}
                />
                <div className="absolute top-6 left-1/2 -translate-x-1/2 text-center text-white w-[195px]">
                  <p className="text-[24px] font-semibold font-['Poppins'] mb-2">Rank Predictor</p>
                  <p className="text-[14px] font-['Poppins']">
                    Estimate your JEE rank and plan the next step with confidence.
                  </p>
                </div>
              </motion.div>

              {/* Bottom Right White Card */}
              <motion.div
                onClick={() => navigate('/admissions/deadlines')}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={cardAnimate}
                transition={{ ...cardTransition, delay: 0.46 }}
                className="absolute lg:right-0 xl:right-16 top-102.5 w-53 h-35.25 rounded-[28px] overflow-hidden bg-gray-700 cursor-pointer"
              >
                <img
                  src="/admissions/deadline.svg"
                  alt="Deadlines"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(179.04deg, rgba(14, 22, 41, 0) 24.07%, rgba(14, 22, 41, 0.7) 69.84%)",
                  }}
                />

                <div className="relative z-10 flex flex-col items-center justify-center h-full px-4">
                  <p className="text-[#FFFFFF] text-[24px] font-semibold font-['Poppins'] mb-1">
                    Deadlines
                  </p>
                  <p className="text-[#FFFFFF] text-[13px] leading-[1.3] font-['Poppins'] text-center">
                    Discover their expertise and find the right guidance for your future
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      
      <CounsellorSection />
      <div className="hidden md:block">
        <Timeline />
      </div>
      <RevampBannerSection />
      <College />
      <Deadlines />
      <Stories stories={admissionsStories} />
      <Blogs />
      <Faq />
    </div>
    </>
  );
}
