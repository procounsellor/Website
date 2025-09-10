import * as React from "react";
import type { EmblaCarouselType } from 'embla-carousel';
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { CircleArrowRight } from "lucide-react";
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
    slidesToScroll: 1, 
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
            <h2 className="text-3xl lg:text-4xl font-bold">
              Colleges
            </h2>
            <Button 
              variant="link" 
              className="font-semibold text-black/80 hover:text-black transition-all duration-300 text-base"
            >
              Explore All <CircleArrowRight className="size-5"/>
            </Button>
        </div>

        {colleges.length > 0 ? (
          <div className="relative">
            <div className="overflow-hidden -mx-2" ref={emblaRef}>
              <div className="flex">
                {colleges.map((college) => (
                  <div
                    key={college.id}
                    className="min-w-0 flex-shrink-0 flex-grow-0 basis-[54%] px-2 sm:basis-[48%] md:basis-[32%] lg:basis-[24%]"
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

        <div className="flex justify-center mt-8 gap-3">
          {colleges.map((_, index) => (
            <button
              key={index}
              onClick={() => emblaApi && emblaApi.scrollTo(index)}
              className={`w-6 h-1.5 rounded-full transition-all duration-300 ${
                index === selectedIndex ? "bg-blue-700" : "bg-gray-300"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}