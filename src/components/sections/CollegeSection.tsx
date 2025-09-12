import * as React from "react";
import type { EmblaCarouselType } from 'embla-carousel';
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { CollegeCard } from "../cards/CollegeCard";
import { Button } from "@/components/ui/button";
import { useColleges } from "../../hooks/useColleges";

export function CollegeSection() {
  const { colleges, loading, error } = useColleges(6); 
  
  const autoplay = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true, stopOnMouseEnter: true })
  );

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    slidesToScroll: 2, // Always 2 cards on both mobile and desktop 
  }, [autoplay.current]);

  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const updateSelectedIndex = React.useCallback(
    (emblaApi: EmblaCarouselType) => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    },
    []
  );

  React.useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", updateSelectedIndex);
    return () => {
      emblaApi.off("select", updateSelectedIndex);
    };
  }, [emblaApi, updateSelectedIndex]);

  const handleCollegeClick = (collegeId: string) => {
    console.log('College clicked:', collegeId);
  };

  if (loading) {
    return (
      <section className="w-full bg-white pt-16 pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FA660F] mx-auto mb-4"></div>
              <p className="text-gray-600">Loading colleges...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full bg-white pt-16 pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-red-600">Error loading colleges: {error}</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-white py-6 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
            <h2 className="font-semibold text-[16px] lg:text-[28px]">
              Colleges
            </h2>
            <a className="flex gap-2 lg:hidden">See All <img src="/seeAll.svg" className="h-5"/></a>
            <Button 
              variant="outline" 
              className="hidden lg:flex font-semibold border-2 border-black/50 text-black/80 hover:bg-black hover:text-white transition-all duration-300 px-6 py-3 text-base whitespace-nowrap"
            >
              See All <img src="/seeAll.svg" className="h-6"/>
            </Button>
        </div>

        {colleges.length > 0 ? (
          <div className="relative">
            <div className="overflow-hidden -mx-2" ref={emblaRef}>
              <div className="flex">
                {colleges.map((college) => (
                  <div
                    key={college.id}
                    className="min-w-0 flex-shrink-0 flex-grow-0 basis-[54%] px-2 sm:basis-[48%] md:basis-[35%] lg:basis-[30%]"
                  >
                    <CollegeCard 
                      collegeName={college.name}
                      city={college.city}
                      state={college.state}
                      logoUrl={college.logoUrl}
                      type={college.type}
                      onClick={() => handleCollegeClick(college.id)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">No colleges available</p>
          </div>
        )}

        {/* LoginCard-style 3 dots pattern */}
        <div className="flex justify-center mt-8 gap-2">
          {Array.from({ length: Math.min(3, Math.ceil(Math.min(6, colleges.length) / 2)) }, (_, index) => (
            <button
              key={index}
              onClick={() => emblaApi && emblaApi.scrollTo(index * 2)}
              className={`h-2 rounded-full transition-all duration-300 ${
                Math.floor(selectedIndex / 2) === index ? 'w-6 bg-[#13097D]' : 'w-2 bg-gray-400'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}