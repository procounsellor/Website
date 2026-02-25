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
  const [showIntro, setShowIntro] = useState(true);
  const [showLogo, setShowLogo] = useState(false);
  const [showName, setShowName] = useState(false);
  const [nameLetters, setNameLetters] = useState<string[]>([]);

  const name = "ProCounsel";

  useEffect(() => {
    // Check if user has visited before
    const hasVisited = sessionStorage.getItem("admissions-visited");

    if (hasVisited) {
      setShowIntro(true);
      return;
    }

    const logoTimer = setTimeout(() => setShowLogo(true), 300);
    const nameTimer = setTimeout(() => setShowName(true), 1200);

    if (showName) {
      name.split("").forEach((letter, index) => {
        setTimeout(() => {
          setNameLetters(prev => [...prev, letter]);
        }, index * 100);
      });
    }

    const hideIntroTimer = setTimeout(() => {
      setShowIntro(false);
      sessionStorage.setItem("admissions-visited", "true");
    }, 1200 + name.length * 100 + 800);

    return () => {
      clearTimeout(logoTimer);
      clearTimeout(nameTimer);
      clearTimeout(hideIntroTimer);
    };
  }, [showName]);

  return (
    <div className="min-h-screen">
      <section className="relative w-full h-[600px] bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center overflow-hidden">
        <AnimatePresence>
          {showIntro && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 z-10 bg-white flex items-center justify-center"
            >
              <div className="flex items-center gap-4">
                <AnimatePresence>
                  {showLogo && (
                    <motion.img
                      src="/logo.svg"
                      alt="ProCounsel Logo"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 20
                      }}
                      className="h-[120px] w-[117px]"
                    />
                  )}
                </AnimatePresence>

                {showName && (
                  <div className="flex">
                    {nameLetters.map((letter, index) => (
                      <motion.span
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          duration: 0.2,
                          ease: "easeOut"
                        }}
                        className="text-6xl font-semibold text-[#232323]"
                      >
                        {letter}
                      </motion.span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>


        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: showIntro ? 0 : 1 }}
          transition={{ duration: 0.5 }}
          className="text-center px-4"
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Admissions
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            More design will come here afterwards
          </p>
        </motion.div>
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
