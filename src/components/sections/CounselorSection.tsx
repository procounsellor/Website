import * as React from "react";
import type { EmblaCarouselType } from 'embla-carousel';
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

import { CounselorCard } from "../cards/CounselorCard";
import { Button } from "@/components/ui/button";
import { useAllCounselors } from "../../hooks/useCounselors";
import { AllCounselorCardSkeleton } from "../skeletons/CounselorSkeletons";

export function CounselorSection() {
  const { data: counselors, loading, error, refetch } = useAllCounselors(6);

  const autoplay = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true, stopOnMouseEnter: true })
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      slidesToScroll: 2, // Always 2 cards on both mobile and desktop
    },
    [autoplay.current]
  );
  
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const updateSelectedIndex = React.useCallback((emblaApi: EmblaCarouselType) => {
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, []);

  React.useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", updateSelectedIndex);
    
    return () => {
      emblaApi.off("select", updateSelectedIndex);
    };
  }, [emblaApi, updateSelectedIndex]);
    
  if (loading) {
    return (
      <section 
        className="bg-[#F5F5F7] py-6 px-4 relative z-10"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between">
            <p className="font-semibold text-[16px] lg:text-[28px]">Get Started Today
            <span className="inline lg:hidden"><br /></span>
            <span className="hidden lg:inline"> - </span>
             <span className="text-[#FF660F]">Book An Appointment Now</span></p>
             <a className="flex gap-2 lg:hidden">See All <img src="/seeAll.svg" className="h-5"/></a>
             <Button 
               variant="outline" 
               className="hidden lg:flex font-semibold border-2 border-black/50 text-black/80 hover:bg-black hover:text-white transition-all duration-300 px-6 py-3 text-base whitespace-nowrap"
             >See All
              <img src="/seeAll.svg" className="h-6"/>
             </Button>
          </div>

          <div className="relative mt-8">
            <div className="overflow-hidden">
              <div className="flex -ml-4">
                {[...Array(6)].map((_, index) => (
                  <div
                    key={index}
                    className="min-w-0 flex-shrink-0 flex-grow-0 basis-[54%] pl-4 sm:basis-[48%] md:basis-[35%] lg:basis-[30%]"
                  >
                    <AllCounselorCardSkeleton />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section 
        className="bg-[#F5F5F7] py-6 px-4 relative z-10"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button 
              onClick={refetch} 
              className="bg-[#FA660F] hover:bg-[#e55a0d]"
            >
              Try Again
            </Button>
          </div>
        </div>
      </section>
    );
  }

  if (!counselors || counselors.length === 0) {
     return (
      <section 
        className="bg-[#F5F5F7] py-6 px-4 relative z-10"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-center">
          <p className="text-gray-600">No counselors available at the moment.</p>
        </div>
      </section>
    );
  }

  return (
    <section
      className="bg-[#F5F5F7] py-6 px-4 relative z-10"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between">
          <p className="font-semibold text-[16px] lg:text-[28px]">Get Started Today
          <span className="inline lg:hidden"><br /></span>
          <span className="hidden lg:inline"> - </span>
           <span className="text-[#FF660F]">Book An Appointment Now</span></p>
           <a className="flex gap-2 lg:hidden">See All <img src="/seeAll.svg" className="h-5"/></a>
           <Button 
             variant="outline" 
             className="hidden lg:flex font-semibold border-2 border-black/50 text-black/80 hover:bg-black hover:text-white transition-all duration-300 px-6 py-3 text-base whitespace-nowrap"
           >See All
            <img src="/seeAll.svg" className="h-6"/>
           </Button>
        </div>

        <div className="relative mt-8">
          <div className="overflow-hidden -mx-2" ref={emblaRef}>
            <div className="flex">
              {counselors.map((counselor) => (
                <div
                  key={counselor.id}
                  className="min-w-0 flex-shrink-0 flex-grow-0 basis-[54%] px-2 sm:basis-[48%] md:basis-[35%] lg:basis-[30%]"
                >
                  <CounselorCard counselor={{...counselor, verified: true}} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* LoginCard-style 3 dots pattern */}
        <div className="flex justify-center mt-8 gap-2">
          {Array.from({ length: Math.min(3, Math.ceil(Math.min(6, counselors.length) / 2)) }, (_, index) => (
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