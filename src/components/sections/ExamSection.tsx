import * as React from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CircleArrowRight } from "lucide-react"
import { CatalogCard } from "../cards/CourseExamCard";
import { Button } from "@/components/ui/button";

export type CatalogCardProps = {
  imageSrc: string;
  imageAlt: string;
  title: string;
  ctaLabel: string;
  href?: string;
  badge?: string; 
  meta?: string; 
  submeta?: string; 
  className?: string;
};


const mockdata:CatalogCardProps[] = [
    {
        imageSrc:'/imageCounselor.jpg',
        imageAlt:'Engineering Exam',
        ctaLabel:'View Exam',
        title:'JEE Main & Advanced Preparation',
        badge:'UG',
    },
     {
        imageSrc:'/imageCounselor.jpg',
        imageAlt:'Medical Exam',
        ctaLabel:'View Exam',
        title:'NEET & AIIMS Entrance Preparation',
        badge:'UG',
    },
     {
        imageSrc:'/imageCounselor.jpg',
        imageAlt:'Management Exam',
        ctaLabel:'View Exam',
        title:'CAT & XAT MBA Entrance',
        badge:'PG',
    },
     {
        imageSrc:'/imageCounselor.jpg',
        imageAlt:'Law Exam',
        ctaLabel:'View Exam',
        title:'CLAT & LSAT Law Entrance',
        badge:'UG',
    },
     {
        imageSrc:'/imageCounselor.jpg',
        imageAlt:'Civil Services Exam',
        ctaLabel:'View Exam',
        title:'UPSC & State PSC Preparation',
        badge:'GOV',
    },
     {
        imageSrc:'/imageCounselor.jpg',
        imageAlt:'Banking Exam',
        ctaLabel:'View Exam',
        title:'SBI & IBPS Banking Exams',
        badge:'GOV',
    }
]



export function ExamSection() {
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

  return (
    <section 
      className="w-full py-16 px-4"
      style={{
        background: '#F5F5F7',
        minHeight: '589px'
      }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
              Exams
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
              {mockdata.map((data, index) => (
                <div
                  key={index}
                  className="min-w-0 flex-shrink-0 flex-grow-0 basis-[85%] pl-4 sm:pl-6 sm:basis-[48%] md:basis-[32%] lg:basis-[30%] xl:basis-[28%] flex justify-center"
                >
                  <CatalogCard
                  imageAlt={data.imageAlt}
                  imageSrc={data.imageSrc}
                  title={data.title}
                  badge={data.badge}
                  ctaLabel={data.ctaLabel}
                  />
                </div>
              ))}
            </div>
          </div>

          <button
            className="group absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white p-3 shadow-xl transition-all hover:scale-110 hover:bg-[#FA660F] hidden sm:block z-10"
            onClick={scrollPrev}
            aria-label="Previous exam"
          >
            <ChevronLeft className="h-6 w-6 text-gray-800 transition-colors group-hover:text-white" />
          </button>
          <button
            className="group absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 rounded-full bg-white p-3 shadow-xl transition-all hover:scale-110 hover:bg-[#FA660F] hidden sm:block z-10"
            onClick={scrollNext}
            aria-label="Next exam"
          >
            <ChevronRight className="h-6 w-6 text-gray-800 transition-colors group-hover:text-white" />
          </button>
        </div>

        <div className="flex justify-center mt-8 gap-2 sm:hidden">
          {mockdata.map((_data, index) => (
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
