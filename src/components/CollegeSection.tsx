import * as React from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CircleArrowRight } from "lucide-react"
import { CollegeCard, type College } from "./CollegeCard";
import { Button } from "@/components/ui/button";

const colleges: College[] = [
  {
    name: "Indian Institute of Technology Delhi",
    courseCount: "24 Courses",
    location: "New Delhi",
    imageUrl: "/imageCounselor.jpg",
    badge: "TOP",
  },
  {
    name: "Indian Institute of Science",
    courseCount: "18 Courses", 
    location: "Bangalore",
    imageUrl: "/imageCounselor.jpg",
    badge: "FEATURED",
  },
  {
    name: "All India Institute of Medical Sciences",
    courseCount: "12 Courses",
    location: "New Delhi", 
    imageUrl: "/imageCounselor.jpg",
    badge: "TOP",
  },
  {
    name: "Indian Institute of Management Ahmedabad",
    courseCount: "8 Courses",
    location: "Ahmedabad",
    imageUrl: "/imageCounselor.jpg",
  },
  {
    name: "Indian Statistical Institute",
    courseCount: "15 Courses",
    location: "Kolkata",
    imageUrl: "/imageCounselor.jpg",
  },
  {
    name: "National Law School of India University",
    courseCount: "6 Courses",
    location: "Bangalore", 
    imageUrl: "/imageCounselor.jpg",
    badge: "FEATURED",
  }
];

export function CollegeSection() {
  const autoplay = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true, stopOnMouseEnter: true })
  );

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    slidesToScroll: 1, // Always scroll one card at a time
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

  const handleCollegeClick = (college: College) => {
    // You can update this later to navigate to college page
    console.log(`Clicked on ${college.name}`);
    if (college.href) {
      window.location.href = college.href;
    }
  };

  return (
    <section 
      className="w-full py-16 px-4"
      style={{
        background: '#FFFFFF',
        minHeight: '633px'
      }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
              Colleges
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
              {colleges.map((college, index) => (
                <div
                  key={index}
                  className="min-w-0 flex-shrink-0 flex-grow-0 basis-[85%] pl-4 sm:pl-6 sm:basis-1/2 lg:basis-1/3 flex justify-center"
                >
                  <CollegeCard 
                    college={college}
                    onClick={() => handleCollegeClick(college)}
                  />
                </div>
              ))}
            </div>
          </div>

          <button
            className="group absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white p-3 shadow-xl transition-all hover:scale-110 hover:bg-[#FA660F] hidden sm:block z-10"
            onClick={scrollPrev}
            aria-label="Previous college"
          >
            <ChevronLeft className="h-6 w-6 text-gray-800 transition-colors group-hover:text-white" />
          </button>
          <button
            className="group absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 rounded-full bg-white p-3 shadow-xl transition-all hover:scale-110 hover:bg-[#FA660F] hidden sm:block z-10"
            onClick={scrollNext}
            aria-label="Next college"
          >
            <ChevronRight className="h-6 w-6 text-gray-800 transition-colors group-hover:text-white" />
          </button>
        </div>

        <div className="flex justify-center mt-8 gap-2 sm:hidden">
          {colleges.map((_, index) => (
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
