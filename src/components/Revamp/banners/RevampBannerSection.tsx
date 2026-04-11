import { useState, useEffect } from 'react';
import GyanDhanBanner from './GyanDhanBanner';
import PredictorBanner from './PredictorBanner';

const TOTAL_SLIDES = 3;

const RevampBannerSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsTransitioning(true);
      setActiveIndex((prev) => prev + 1);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const handleTransitionEnd = () => {
    if (activeIndex === TOTAL_SLIDES) {
      setIsTransitioning(false);
      setActiveIndex(0);
    }
  };

  return (
    <section className="w-full bg-[#C6DDF040] overflow-hidden">
      <div className="max-w-[1440px] mx-auto py-10 md:py-20 px-4 md:px-[60px] flex flex-col items-center">
        <div className="flex flex-col items-start md:items-center gap-6 md:gap-8 w-full">

          <div className="self-start box-border flex items-center gap-2 bg-white border border-gray-100 rounded-[6px] px-3 py-1 shadow-sm md:ml-0">
            <div className="w-4 h-4 bg-[#0E1629] shrink-0" />
            <span className="font-poppins font-semibold text-[14px] leading-none tracking-[0.07em] text-[#0E1629] uppercase">
              Partners
            </span>
          </div>

          <div className="hidden md:block w-full">
            <div className="relative w-full max-w-[1320px] mx-auto overflow-hidden rounded-2xl hover:cursor-pointer">
              <div
                className={`flex w-[400%] ${isTransitioning ? 'transition-transform duration-700 ease-in-out' : ''}`}
                style={{ transform: `translateX(-${activeIndex * 25}%)` }}
                onTransitionEnd={handleTransitionEnd}
              >
                <div className="w-1/4 flex justify-center gap-6">
                  <div className="w-full max-w-[648px] shrink-0">
                    <GyanDhanBanner />
                  </div>
                  <div className="w-full max-w-[648px] shrink-0">
                    <PredictorBanner variant="rank" />
                  </div>
                </div>
                <div className="w-1/4 flex justify-center gap-6">
                  <div className="w-full max-w-[648px] shrink-0">
                    <PredictorBanner variant="rank" />
                  </div>
                  <div className="w-full max-w-[648px] shrink-0">
                    <PredictorBanner variant="match" />
                  </div>
                </div>
                <div className="w-1/4 flex justify-center gap-6">
                  <div className="w-full max-w-[648px] shrink-0">
                    <PredictorBanner variant="match" />
                  </div>
                  <div className="w-full max-w-[648px] shrink-0">
                    <GyanDhanBanner />
                  </div>
                </div>
                <div className="w-1/4 flex justify-center gap-6">
                  <div className="w-full max-w-[648px] shrink-0">
                    <GyanDhanBanner />
                  </div>
                  <div className="w-full max-w-[648px] shrink-0">
                    <PredictorBanner variant="rank" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="md:hidden w-full flex items-center justify-center">
            <div className="relative w-full max-w-[335px] mx-auto overflow-hidden rounded-[12px] hover:cursor-pointer">
              <div
                className={`flex w-[400%] ${isTransitioning ? 'transition-transform duration-700 ease-in-out' : ''}`}
                style={{ transform: `translateX(-${activeIndex * 25}%)` }}
                onTransitionEnd={handleTransitionEnd}
              >
                <div className="w-1/4 flex justify-center">
                  <GyanDhanBanner />
                </div>
                <div className="w-1/4 flex justify-center">
                  <PredictorBanner variant="rank" />
                </div>
                <div className="w-1/4 flex justify-center">
                  <PredictorBanner variant="match" />
                </div>
                <div className="w-1/4 flex justify-center">
                  <GyanDhanBanner />
                </div>
              </div>
            </div>
          </div>

          <div className="w-full flex justify-start mt-2">
            <div className="flex gap-2">
            {[0, 1, 2].map((index) => {
              const current = activeIndex === TOTAL_SLIDES ? 0 : activeIndex;
              return (
                <button
                  key={index}
                  onClick={() => {
                    setIsTransitioning(true);
                    setActiveIndex(index);
                  }}
                  className={`h-1.5 rounded-full transition-all duration-300 ${current === index ? 'w-10 bg-[#0E1629]' : 'w-5 bg-[#0E16294D]'}`}
                  aria-label={`Go to banner slide ${index + 1}`}
                />
              );
            })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default RevampBannerSection;