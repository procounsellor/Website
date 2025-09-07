import * as React from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CircleArrowRight } from "lucide-react"
import { CatalogCard } from "../cards/CourseExamCard";
import { Button } from "@/components/ui/button";
import { useCourses } from "../../hooks/useCourses";

export function CourseExamSection() {
  const { courses, loading, error } = useCourses(6); 
  
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

  const handleCourseClick = (courseId: string) => {
    console.log('Course clicked:', courseId);
    // TODO: Navigate to course details page
  };

  if (loading) {
    return (
      <section 
        className="w-full py-16 px-4"
        style={{
          background: '#FFFFFF',
          minHeight: '589px'
        }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FA660F] mx-auto mb-4"></div>
              <p className="text-gray-600">Loading courses...</p>
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
          background: '#FFFFFF',
          minHeight: '589px'
        }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-red-600">Error loading courses: {error}</p>
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
        background: '#FFFFFF',
        minHeight: '589px'
      }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
              Courses
            </h2>
          </div>
          <Button 
            variant="outline" 
            className="font-semibold border-2 border-[#FA660F] text-[#FA660F] hover:bg-[#FA660F] hover:text-white transition-all duration-300 px-6 py-3 text-base whitespace-nowrap"
          >
            Explore All <CircleArrowRight className="size-5 ml-2"/>
          </Button>
        </div>

        {courses.length > 0 ? (
          <div className="relative">
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex -ml-4 sm:-ml-6">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    className="min-w-0 flex-shrink-0 flex-grow-0 basis-[300px] pl-4 sm:pl-6 sm:basis-[340px] md:basis-[340px] lg:basis-[340px] xl:basis-[340px] flex justify-center"
                  >
                    <div onClick={() => handleCourseClick(course.id)}>
                      <CatalogCard
                        imageAlt={`${course.name} course`}
                        imageSrc={course.photoUrl || course.iconUrl || "/discover-courses.jpg"}
                        title={course.name}
                        badge={course.type}
                        ctaLabel="View Course"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              className="group absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white p-3 shadow-xl transition-all hover:scale-110 hover:bg-[#FA660F] hidden sm:block z-10"
              onClick={scrollPrev}
              aria-label="Previous course"
            >
              <ChevronLeft className="h-6 w-6 text-gray-800 transition-colors group-hover:text-white" />
            </button>
            <button
              className="group absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 rounded-full bg-white p-3 shadow-xl transition-all hover:scale-110 hover:bg-[#FA660F] hidden sm:block z-10"
              onClick={scrollNext}
              aria-label="Next course"
            >
              <ChevronRight className="h-6 w-6 text-gray-800 transition-colors group-hover:text-white" />
            </button>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">No courses available</p>
          </div>
        )}

        <div className="flex justify-center mt-8 gap-2 sm:hidden">
          {courses.slice(0, 5).map((course) => (
            <div
              key={course.id}
              className="w-2 h-2 rounded-full bg-gray-300 transition-colors duration-200"
            />
          ))}
        </div>
      </div>
    </section>
  );
}