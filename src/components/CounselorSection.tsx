import * as React from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TbCircleArrowUpRight } from "react-icons/tb"

import { CounselorCard, type Counselor } from "./CounselorCard";
import { Button } from "@/components/ui/button"; 

const counselors: Counselor[] = [
  {
    name: "Dr. Sumant Ghai",
    description: "Engineering",
    experience: "8+ Yrs",
    imageUrl: "/imageCounselor.jpg", 
    verified: true,
  },
  {
    name: "Dr. Sumant Ghai",
    description: "Engineering",
    experience: "12+ Yrs",
    imageUrl: "/imageCounselor.jpg", 
    verified: true,
  },
  {
    name: "Dr. Sumant Ghai",
    description: "Engineering",
    experience: "10+ Yrs",
    imageUrl: "/imageCounselor.jpg", 
    verified: true,
  },
  {
    name: "Dr. Sumant Ghai",
    description: "Engineering",
    experience: "9+ Yrs",
    imageUrl: "/imageCounselor.jpg", 
    verified: false,
  },
];


export function CounselorSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
  });

  const scrollPrev = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <section className="w-full py-12 px-4 bg-[#F5F5F7]">
      <div className="max-w-5xl mx-auto px-4 -mt-5">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl md:text-2xl font-bold">
          Get Started Today - <span className="text-[#FA660F]">Book An Appointment Now</span>
        </h2>
        <Button variant="outline" className="font-bold border-black" >
          Explore All <TbCircleArrowUpRight className="size-6"/>
        </Button>
      </div>
      

      <div className="relative -mt-3">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex -ml-6">
            {counselors.map((counselor, index) => (
                <div
                key={index}
                className="min-w-0 flex-shrink-0 flex-grow-0 basis-full pl-6 sm:basis-1/2 md:basis-1/3"
              >
                <CounselorCard key={index} counselor={counselor} />
                </div>
            ))}
          </div>
        </div>

        <button
          className="group absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white p-3 shadow-lg transition-all hover:scale-110 hover:bg-[#FA660F]"
          onClick={scrollPrev}
        >
          <ChevronLeft className="h-5 w-5 text-gray-800 transition-colors group-hover:text-white" />
        </button>
        <button
          className="group absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 rounded-full bg-white p-3 shadow-lg transition-all hover:scale-110 hover:bg-[#FA660F]"
          onClick={scrollNext}
        >
          <ChevronRight className="h-5 w-5 text-gray-800 transition-colors group-hover:text-white" />
        </button>
      </div>
      </div>
    </section>
  );
}