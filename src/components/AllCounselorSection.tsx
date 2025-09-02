import * as React from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CircleArrowRight } from "lucide-react";

import { AllCounselorCards, type AllCounselor } from "./AllCounselorCards";
import { Button } from "@/components/ui/button"; 

const counselors: AllCounselor[] = [
  {
    name: "Dr. Sumant Ghai",
    description: "Engineering",
    experience: "8+ Yrs",
    imageUrl: "/imageCounselor.jpg",
    location: "Mumbai, Maharashtra",
    rating: 4.0,
    reviews: 12,
    rate: "1000 ProCoins/Hour",
  },
  {
    name: "Dr. Sumant Ghai",
    description: "Engineering",
    experience: "8+ Yrs",
    imageUrl: "/imageCounselor.jpg",
    location: "Mumbai, Maharashtra",
    rating: 4.0,
    reviews: 12,
    rate: "1000 ProCoins/Hour",
  },
  {
    name: "Dr. Sumant Ghai",
    description: "Engineering",
    experience: "8+ Yrs",
    imageUrl: "/imageCounselor.jpg",
    location: "Mumbai, Maharashtra",
    rating: 4.0,
    reviews: 12,
    rate: "1000 ProCoins/Hour",
  },
  {
    name: "Dr. Sumant Ghai",
    description: "Engineering",
    experience: "8+ Yrs",
    imageUrl: "/imageCounselor.jpg",
    location: "Mumbai, Maharashtra",
    rating: 4.0,
    reviews: 12,
    rate: "1000 ProCoins/Hour",
  },
  {
    name: "Dr. Sumant Ghai",
    description: "Engineering",
    experience: "8+ Yrs",
    imageUrl: "/imageCounselor.jpg",
    location: "Mumbai, Maharashtra",
    rating: 4.0,
    reviews: 12,
    rate: "1000 ProCoins/Hour",
  },
];


export function AllCounselorSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    slidesToScroll: 1,
    breakpoints: {
      '(min-width: 768px)': { slidesToScroll: 2 },
      '(min-width: 1024px)': { slidesToScroll: 3 }
    }
  });

  const scrollPrev = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <section className="w-full py-16 px-4  bg-gradient-to-b from-[#F5F5F7] to-[#EEEEF0]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
              Counsellors
            </h2>
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
              {counselors.map((counselor, index) => (
                <div
                  key={index}
                  className="min-w-0 flex-shrink-0 flex-grow-0 basis-[85%] pl-4 sm:pl-6 sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                >
                  <AllCounselorCards counselor={counselor} />
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