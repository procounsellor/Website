import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Stories from "@/components/Revamp/probuddies/Stories";
import Faq from "@/components/Revamp/admissions/Faq";
import Blogs from "@/components/Revamp/admissions/Blogs";
import College from "@/components/Revamp/admissions/College";
import Deadlines from "@/components/Revamp/admissions/Deadlines";
import CounsellorSection from "@/components/Revamp/admissions/counsellor/CounsellorSection";
import Timeline from "@/components/Revamp/admissions/Timeline";
import RevampBannerSection from "@/components/Revamp/banners/RevampBannerSection";

export default function Admissions() {
  const [splashPhase, setSplashPhase] = useState(0);
  // Splash Phase 0: Logo appears centered (scale in)
  // Splash Phase 1: Logo shrinks back (goes "into" screen)
  // Splash Phase 2: Logo shifts left, text slides in from right
  // Splash Phase 3: Splash fades out, hero revealed

  const [animationPhase, setAnimationPhase] = useState(0);
  // Phase 1: Heading appears
  // Phase 2: Subtitle appears
  // Phase 3: Button appears
  // Phase 4: Cards rise up

  useEffect(() => {
    const timers = [
      setTimeout(() => setSplashPhase(1), 800),    // logo shrinks back
      setTimeout(() => setSplashPhase(2), 1400),   // logo shifts left + text appears
      setTimeout(() => setSplashPhase(3), 3000),   // splash fades out
      // Hero content starts after splash fade
      setTimeout(() => setAnimationPhase(1), 3600),   // heading
      setTimeout(() => setAnimationPhase(2), 4100),   // subtitle
      setTimeout(() => setAnimationPhase(3), 4500),   // button
      setTimeout(() => setAnimationPhase(4), 4900),   // cards
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="min-h-screen">
      <section className="relative w-full h-[600px] flex items-center justify-center overflow-hidden">
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
                  src="https://www.figma.com/api/mcp/asset/4a796561-f87a-428a-ae09-a0ef94eeca93"
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
          className="text-center px-4 w-full h-[600px] bg-[#0e1629] flex items-center justify-center"
        >
          <div className="max-w-[1440px] w-full h-full relative">
            {/* Header Text */}
            <div className="absolute left-1/2 -translate-x-1/2 top-[42px] max-w-[818px] w-full px-4">
              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={animationPhase >= 1 ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="text-white text-[40px] font-extrabold font-['Poppins'] mb-4 leading-tight"
              >
                Your personal Admission Expert
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={animationPhase >= 2 ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="text-[#f5f5f5] text-[16px] font-medium font-['Poppins'] max-w-[753px] mx-auto"
              >
                Find trusted guidance, personalised course matches, and clear admissions support to help you choose the right path.
              </motion.p>
            </div>

            {/* CTA Button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={animationPhase >= 3 ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="absolute left-1/2 -translate-x-1/2 top-[186px] bg-[#2f43f2] hover:bg-[#2437d1] transition-colors text-white px-8 py-3 rounded-[48px] text-[16px] font-medium font-['Poppins']"
            >
              Book Admission Counselling
            </motion.button>

            {/* Grid Cards */}
            <div className="absolute inset-0 top-[174px] px-16">
              {/* Admissions Card */}
              <motion.div
                initial={{ opacity: 0, y: 120 }}
                animate={animationPhase >= 4 ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0, ease: "easeOut" }}
                className="absolute left-16 top-0 w-[243px] h-[245px] bg-[#ffc8af] rounded-[28px] overflow-hidden"
              >
                <img 
                  src="https://www.figma.com/api/mcp/asset/ac2e860d-8957-4a4d-9eb2-a8dd1ba74368" 
                  alt="Student" 
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[rgba(14,22,41,0.7)]" />
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center text-white w-[195px]">
                  <p className="text-[24px] font-semibold font-['Poppins'] mb-2">Admissions</p>
                  <p className="text-[14px] font-['Poppins']">
                    <span className="font-semibold">10,000+</span> Students Guided | <span className="font-semibold">95%</span> Success Rate
                  </p>
                </div>
              </motion.div>

              {/* About Us Card */}
              <motion.div
                initial={{ opacity: 0, y: 120 }}
                animate={animationPhase >= 4 ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
                className="absolute left-16 top-[269px] w-[243px] h-[141px] bg-white rounded-[28px]"
              >
                <div className="flex flex-col items-center justify-center h-full px-6">
                  <p className="text-[#0e1629] text-[24px] font-semibold font-['Poppins'] mb-2">About Us</p>
                  <p className="text-[#6b7280] text-[14px] font-['Poppins'] text-center">
                    <span className="font-semibold">15+ Years</span> of Excellence | Trusted by <span className="font-semibold">50,000+ Families</span>
                  </p>
                </div>
              </motion.div>

              {/* Courses Card */}
              <motion.div
                initial={{ opacity: 0, y: 120 }}
                animate={animationPhase >= 4 ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
                className="absolute left-[331px] top-[80px] w-[243px] h-[330px] rounded-[28px] overflow-hidden bg-gray-700"
              >
                <img 
                  src="https://www.figma.com/api/mcp/asset/d48e6154-5b62-4bb7-9861-ed29f4b1034a" 
                  alt="Courses" 
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[rgba(14,22,41,0.7)]" />
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center text-white w-[195px]">
                  <p className="text-[24px] font-semibold font-['Poppins'] mb-2">Courses</p>
                  <p className="text-[14px] font-['Poppins']">
                    <span className="font-semibold">500+</span> Courses Available | <span className="font-semibold">25,000+</span> Active Learners
                  </p>
                </div>
              </motion.div>

              {/* Community Card */}
              <motion.div
                initial={{ opacity: 0, y: 120 }}
                animate={animationPhase >= 4 ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.25, ease: "easeOut" }}
                className="absolute left-[598px] top-[146px] w-[243px] h-[264px] bg-[#10335e] rounded-[28px]"
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
                initial={{ opacity: 0, y: 120 }}
                animate={animationPhase >= 4 ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.35, ease: "easeOut" }}
                className="absolute left-[865px] top-[80px] w-[243px] h-[330px] rounded-[28px] overflow-hidden bg-gray-700"
              >
                <img 
                  src="https://www.figma.com/api/mcp/asset/5444efa2-6311-4862-be75-6146c9cb7754" 
                  alt="ProBuddies" 
                  className="absolute inset-0 w-full h-full object-fit"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[rgba(14,22,41,0.7)]" />
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center text-white w-[195px]">
                  <p className="text-[24px] font-semibold font-['Poppins'] mb-2">ProBuddies</p>
                  <p className="text-[14px] font-['Poppins']">
                    <span className="font-semibold">300+</span> Mentors | <span className="font-semibold">850+</span> Mentees Connected
                  </p>
                </div>
              </motion.div>

              {/* Scholarships Card */}
              <motion.div
                initial={{ opacity: 0, y: 120 }}
                animate={animationPhase >= 4 ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.45, ease: "easeOut" }}
                className="absolute right-16 top-[8px] w-[243px] h-[245px] bg-[#68aab8] rounded-[28px] overflow-hidden"
              >
                <img 
                  src="https://www.figma.com/api/mcp/asset/4acbf56a-e5d4-416a-8c98-ccc41915373b" 
                  alt="Scholarships" 
                  className="absolute inset-0 w-full h-full object-fit"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[rgba(14,22,41,0.1)] to-[rgba(14,22,41,0.2)]" />
                <div className="absolute top-6 left-1/2 -translate-x-1/2 text-center text-white w-[195px]">
                  <p className="text-[24px] font-semibold font-['Poppins'] mb-2">Scholarships</p>
                  <p className="text-[14px] font-['Poppins']">
                    Up to <span className="font-semibold">100% tuition</span> coverage available based on merit and need.
                  </p>
                </div>
              </motion.div>

              {/* Bottom Right White Card */}
              <motion.div
                initial={{ opacity: 0, y: 120 }}
                animate={animationPhase >= 4 ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.55, ease: "easeOut" }}
                className="absolute right-16 top-[269px] w-[243px] h-[141px] bg-white rounded-[28px]"
              />
            </div>
          </div>
        </div>
      </section>
      <Timeline/>
      <CounsellorSection/>
      <RevampBannerSection/>
      <College/>
      <Deadlines/>
      <Stories />
      <Blogs/>
      <Faq/>
    </div>
  );
}
