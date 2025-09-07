import * as React from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CircleArrowRight } from "lucide-react"
import { CatalogCard } from "../cards/CourseExamCard";
import { Button } from "@/components/ui/button";
import { useExams } from "../../hooks/useExams";

export function ExamSection() {
  const { exams, loading, error } = useExams(6); 
  
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

  const handleExamClick = (examId: string) => {
    console.log('Exam clicked:', examId);
    // TODO: Navigate to exam details page
  };

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
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FA660F] mx-auto mb-4"></div>
              <p className="text-gray-600">Loading exams...</p>
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
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-red-600">Error loading exams: {error}</p>
            </div>
          </div>
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

        {exams.length > 0 ? (
          <div className="relative">
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex -ml-4 sm:-ml-6">
                {exams.map((exam) => (
                  <div
                    key={exam.id}
                    className="min-w-0 flex-shrink-0 flex-grow-0 basis-[85%] pl-4 sm:pl-6 sm:basis-[48%] md:basis-[32%] lg:basis-[30%] xl:basis-[28%] flex justify-center"
                  >
                    <div onClick={() => handleExamClick(exam.id)}>
                      <CatalogCard
                        imageAlt={`${exam.name} exam`}
                        imageSrc={exam.bannerUrl || exam.iconUrl || "/discover-exam.jpg"}
                        title={exam.name}
                        badge={exam.level}
                        ctaLabel="View Exam"
                      />
                    </div>
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
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">No exams available</p>
          </div>
        )}

        <div className="flex justify-center mt-8 gap-2 sm:hidden">
          {exams.slice(0, 5).map((exam) => (
            <div
              key={exam.id}
              className="w-2 h-2 rounded-full bg-gray-300 transition-colors duration-200"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
