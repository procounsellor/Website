import { useEffect, useMemo, useRef, useState } from 'react';
import GyanDhanBanner from './GyanDhanBanner';
import PredictorBanner from './PredictorBanner';
import ScalerBanner from './ScalerBanner';

const RevampBannerSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const desktopTrackRef = useRef<HTMLDivElement | null>(null);
  const mobileTrackRef = useRef<HTMLDivElement | null>(null);

  const desktopSlides = useMemo(
    () => [
      {
        id: 'desktop-1',
        left: <GyanDhanBanner />,
        right: <PredictorBanner variant="rank" />,
      },
      {
        id: 'desktop-2',
        left: <PredictorBanner variant="college" />,
        right: <PredictorBanner variant="mhtcet" />,
      },
      {
        id: 'desktop-3',
        left: <ScalerBanner />,
        right: <PredictorBanner variant="rank" />,
      },
      {
        id: 'desktop-4',
        left: <PredictorBanner variant="mhtcet" />,
        right: <GyanDhanBanner />,
      },
    ],
    []
  );

  const mobileSlides = useMemo(
    () => [
      { id: 'mobile-1', content: <GyanDhanBanner /> },
      { id: 'mobile-2', content: <ScalerBanner /> },
      { id: 'mobile-3', content: <PredictorBanner variant="rank" /> },
      { id: 'mobile-4', content: <PredictorBanner variant="college" /> },
      { id: 'mobile-5', content: <PredictorBanner variant="mhtcet" /> },
    ],
    []
  );

  const totalSlides = isMobile ? mobileSlides.length : desktopSlides.length;

  const syncViewportMode = () => {
    if (typeof window === 'undefined') return;
    setIsMobile(window.innerWidth < 768);
  };

  useEffect(() => {
    syncViewportMode();
    window.addEventListener('resize', syncViewportMode);
    return () => window.removeEventListener('resize', syncViewportMode);
  }, []);

  const scrollToSlide = (index: number) => {
    const track = isMobile ? mobileTrackRef.current : desktopTrackRef.current;
    if (!track) return;
    const boundedIndex = Math.max(0, Math.min(index, totalSlides - 1));
    const left = boundedIndex * track.clientWidth;
    track.scrollTo({ left, behavior: 'smooth' });
    setActiveIndex(boundedIndex);
  };

  useEffect(() => {
    const track = isMobile ? mobileTrackRef.current : desktopTrackRef.current;
    if (!track) return;

    const onScroll = () => {
      const width = track.clientWidth || 1;
      const idx = Math.round(track.scrollLeft / width);
      const bounded = Math.max(0, Math.min(idx, totalSlides - 1));
      setActiveIndex(bounded);
    };

    track.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => track.removeEventListener('scroll', onScroll);
  }, [isMobile, totalSlides]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (isPaused || totalSlides <= 1) return;
      const nextIndex = (activeIndex + 1) % totalSlides;
      scrollToSlide(nextIndex);
    }, 4500);

    return () => window.clearInterval(timer);
  }, [activeIndex, isPaused, totalSlides, isMobile]);

  useEffect(() => {
    if (activeIndex >= totalSlides) {
      setActiveIndex(0);
      scrollToSlide(0);
    }
  }, [activeIndex, totalSlides, isMobile]);

  return (
    <section className="w-full bg-[#C6DDF040] overflow-hidden">
      <div className="max-w-7xl mx-auto py-10 md:py-8 px-4 md:px-8 flex flex-col items-center">
        <div className="flex flex-col items-start md:items-center gap-6 md:gap-8 w-full">

          <div className="self-start box-border flex items-center gap-2 bg-white border border-gray-100 rounded-[6px] px-3 py-1 shadow-sm md:ml-0">
            <div className="w-4 h-4 bg-[#0E1629] shrink-0" />
            <span className="font-poppins font-semibold text-[14px] leading-none tracking-[0.07em] text-[#0E1629] uppercase">
              Partners
            </span>
          </div>

          <div className="hidden md:block w-full">
            <div
              className="relative w-full max-w-[1320px] mx-auto overflow-hidden rounded-2xl"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <div
                ref={desktopTrackRef}
                className="flex w-full overflow-x-auto snap-x snap-mandatory scroll-smooth gap-0 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]"
              >
                {desktopSlides.map((slide) => (
                  <div key={slide.id} className="w-full shrink-0 snap-start grid grid-cols-2 gap-4 lg:gap-6">
                    <div className="w-full min-w-0">{slide.left}</div>
                    <div className="w-full min-w-0">{slide.right}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="md:hidden w-full flex items-center justify-start">
            <div
              className="relative w-full max-w-[320px] overflow-hidden rounded-[12px]"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <div
                ref={mobileTrackRef}
                className="flex w-full overflow-x-auto snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden [scrollbar-width:none]"
              >
                {mobileSlides.map((slide) => (
                  <div key={slide.id} className="w-full shrink-0 snap-start flex justify-center">
                    {slide.content}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="w-full flex justify-start mt-2">
            <div className="flex gap-2">
            {Array.from({ length: totalSlides }, (_, index) => {
              return (
                <button
                  key={index}
                  onClick={() => scrollToSlide(index)}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${activeIndex === index ? 'w-10 bg-[#0E1629]' : 'w-5 bg-[#0E16294D]'}`}
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