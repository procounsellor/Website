import * as React from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CircleArrowRight } from "lucide-react"

import { CounselorCard } from "../cards/CounselorCard";
import { Button } from "@/components/ui/button";
import { useCounselors } from "../../hooks/useCounselors";
import { CounselorCardSkeleton } from "../skeletons/CounselorSkeletons";


export function CounselorSection() {
  const { data: counselors, loading, error, refetch } = useCounselors(15);

  const autoplay = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true, stopOnMouseEnter: true })
  );

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    slidesToScroll: 1, 
    breakpoints: {
      '(min-width: 768px)': { slidesToScroll: 1 },
      '(min-width: 1024px)': { slidesToScroll: 1 }
    }
  }, [autoplay.current]);

  const scrollPrev = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  if (loading) {
    return (
      <section 
        className="w-full py-16 px-4"
        style={{
          background: '#F5F5F7',
          minHeight: '589px'
        }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 flex flex-col sm:flex-row items-center sm:items-center justify-between gap-6">
            <div className="text-center sm:text-left">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
                Get Started Today - <br className="sm:hidden" />
                <span className="text-[#FA660F]">Book An Appointment Now</span>
              </h2>
              <p className="text-gray-600 mt-2 text-sm sm:text-base">
                Connect with verified counselors and get personalized guidance
              </p>
            </div>
            <Button 
              variant="outline" 
              className="font-semibold border-2 border-[#FA660F] text-[#FA660F] hover:bg-[#FA660F] hover:text-white transition-all duration-300 px-6 py-3 text-base whitespace-nowrap"
            >
              Explore All <CircleArrowRight className="size-5 ml-2"/>
            </Button>
          </div>

          <div className="relative">
            <div className="overflow-hidden">
              <div className="flex -ml-4 sm:-ml-6">
                {[...Array(15)].map((_, index) => (
                  <div
                    key={index}
                    className="min-w-0 flex-shrink-0 flex-grow-0 basis-[85%] pl-4 sm:pl-6 sm:basis-[48%] md:basis-[32%] lg:basis-[30%] xl:basis-[28%] flex justify-center"
                  >
                    <CounselorCardSkeleton />
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
        className="w-full py-16 px-4"
        style={{
          background: '#F5F5F7',
          minHeight: '589px'
        }}
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

  // No data state
  if (!counselors || counselors.length === 0) {
    return (
      <section 
        className="w-full py-16 px-4"
        style={{
          background: '#F5F5F7',
          minHeight: '589px'
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-center">
          <p className="text-gray-600">No counselors available at the moment.</p>
        </div>
      </section>
    );
  }

  return (
    <section 
      className="w-full py-16 px-4"
      style={{
        background: '#F5F5F7',
        minHeight: '589px'
      }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 flex flex-col sm:flex-row items-center sm:items-center justify-between gap-6">
          <div className="text-center sm:text-left">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
              Get Started Today - <br className="sm:hidden" />
              <span className="text-[#FA660F]">Book An Appointment Now</span>
            </h2>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">
              Connect with verified counselors and get personalized guidance
            </p>
          </div>
          <Button 
            variant="outline" 
            className="font-semibold border-2 border-[#FA660F] text-[#FA660F] hover:bg-[#FA660F] hover:text-white transition-all duration-300 px-6 py-3 text-base whitespace-nowrap"
          >
            Explore All <CircleArrowRight className="size-5 ml-2"/>
          </Button>
        </div>

        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex -ml-4 sm:-ml-6">
              {counselors.map((counselor) => (
                <div
                  key={counselor.id}
                  className="min-w-0 flex-shrink-0 flex-grow-0 basis-[85%] pl-4 sm:pl-6 sm:basis-[48%] md:basis-[32%] lg:basis-[30%] xl:basis-[28%] flex justify-center"
                >
                  <CounselorCard counselor={counselor} />
                </div>
              ))}
            </div>
          </div>

          <button
            className="group absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white p-3 shadow-xl transition-all hover:scale-110 hover:bg-[#FA660F] hidden sm:block z-10"
            onClick={scrollPrev}
            aria-label="Previous counselor"
          >
            <ChevronLeft className="h-6 w-6 text-gray-800 transition-colors group-hover:text-white" />
          </button>
          <button
            className="group absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 rounded-full bg-white p-3 shadow-xl transition-all hover:scale-110 hover:bg-[#FA660F] hidden sm:block z-10"
            onClick={scrollNext}
            aria-label="Next counselor"
          >
            <ChevronRight className="h-6 w-6 text-gray-800 transition-colors group-hover:text-white" />
          </button>
        </div>

        <div className="flex justify-center mt-8 gap-2 sm:hidden">
          {counselors.map((_, index) => (
            <div
              key={index}
              className="w-2 h-2 rounded-full bg-gray-300 transition-colors duration-200"
            />
          ))}
        </div>
      </div>
    </section>
  );
}