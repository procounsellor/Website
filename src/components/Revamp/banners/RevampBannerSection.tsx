import { useState, useEffect } from 'react';
import AdityaBanner from './AdityaBanner';
import GyanDhanBanner from './GyanDhanBanner';

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
    if (activeIndex === 2) {
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

          {/* Desktop View */}
          <div className="hidden md:flex w-full flex-wrap justify-center gap-6">
            <GyanDhanBanner />
            <AdityaBanner />
          </div>

          {/* Mobile View */}
          <div className="md:hidden relative w-full max-w-[335px] mx-auto overflow-hidden rounded-[12px] hover:cursor-pointer">
            <div 
              className={`flex w-[300%] ${isTransitioning ? 'transition-transform duration-700 ease-in-out' : ''}`}
              style={{ transform: `translateX(-${activeIndex * (100 / 3)}%)` }}
              onTransitionEnd={handleTransitionEnd}
            >
              <div className="w-1/3 flex justify-center">
                <GyanDhanBanner />
              </div>
              <div className="w-1/3 flex justify-center">
                <AdityaBanner />
              </div>
              <div className="w-1/3 flex justify-center">
                <GyanDhanBanner />
              </div>
            </div>
          </div>

          <div className="md:hidden flex gap-2 mx-auto mt-2">
            <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${activeIndex === 0 || activeIndex === 2 ? 'bg-[#0E1629]' : 'bg-gray-300'}`} />
            <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${activeIndex === 1 ? 'bg-[#0E1629]' : 'bg-gray-300'}`} />
          </div>

        </div>
      </div>
    </section>
  );
};

export default RevampBannerSection;