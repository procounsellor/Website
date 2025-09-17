import * as React from "react";
import type { EmblaCarouselType } from 'embla-carousel';
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useNavigate } from "react-router-dom";
import { AcademicCard } from "../homecards/AcademicCard";
import { Button } from "@/components/ui/button";
import { useColleges } from "../../hooks/useColleges";

export function CollegeSection() {
  const { colleges, loading, error } = useColleges(8); 
  const navigate = useNavigate();
  
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

  if (loading) {
    return (
      <section className="w-full bg-white pt-16 pb-8 px-4">
        <div className="max-w-[1200px] mx-auto">
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
    <section className="w-full bg-white py-6">
      <div className="max-w-[1200px] mx-auto pl-5 lg:px-0">
        <div className="mb-3 lg:mb-8 flex items-center pr-5 justify-between">
            <h2 className="font-semibold text-[16px] lg:text-[28px]">
              Colleges
            </h2>
            <a className="flex gap-2 lg:hidden cursor-pointer" onClick={() => navigate('/colleges')}>See All <img src="/seeAll.svg" className="h-5"/></a>
            <Button 
              variant="outline" 
              className="group hidden lg:flex font-semibold border-2 border-black/50 text-black/80 hover:bg-black hover:text-white transition-all duration-300 px-6 py-3 text-base whitespace-nowrap"
              onClick={() => navigate('/colleges')}
            >
              See All <img src="/seeAll.svg" className="h-6 ml-2 group-hover:filter group-hover:invert"/>
            </Button>
        </div>

        <div className="relative mt-2 lg:mt-8 ">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-3 px-3 lg:px-6 lg:gap-6 py-1">
              {colleges.map((college)=>(
                <div key={college.id}
                className="flex-shrink-0 w-[170px] lg:w-[282px]"
                onClick={()=> console.log(college.id)}
                >
                  <AcademicCard
                  imageAlt={college.name}
                  imageSrc={college.logoUrl}
                  title={college.name}
                  badge={college.type}
                  ctaLabel="View College"
                  city={college.city}
                  mh="h-230px"
                  dh="h-[382px]"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-6 gap-2">
          {Array.from(
            { length: Math.ceil((colleges?.length || 0) / 2) },
            (_, index) => (
              <button
                key={index}
                onClick={() => emblaApi && emblaApi.scrollTo(index * 2)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  Math.floor(selectedIndex / 2) === index
                    ? "w-6 bg-[#13097D]"
                    : "w-2 bg-gray-400"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            )
          )}
        </div>
      </div>
    </section>
  );
}