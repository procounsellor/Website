import * as React from "react";
import type { EmblaCarouselType } from 'embla-carousel';
import useEmblaCarousel from "embla-carousel-react";    
import Autoplay from "embla-carousel-autoplay"; 
import { CircleArrowRight } from "lucide-react";
import { CatalogCard } from "../cards/CourseExamCard";
import { Button } from "@/components/ui/button";
import { useCourses } from "../../hooks/useCourses";

export function CourseExamSection() {
  const { courses, loading, error } = useCourses(6);
  const autoplay = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true, stopOnMouseEnter: true })
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      slidesToScroll: 1,
    },
    [autoplay.current] 
  );

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

  const handleCourseClick = (courseId: string) => {
    console.log("Course clicked:", courseId);
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
      className="w-full py-6 px-4"
      style={{ background: "#FFFFFF" }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl lg:text-4xl font-bold">
            Courses
          </h2>
          <Button 
            variant="link" 
            className="font-semibold text-black/80 hover:text-black transition-all duration-300 text-base"
          >
            Explore All <CircleArrowRight className="size-5"/>
          </Button>
        </div>

        {courses.length > 0 ? (
          <div className="relative">
            <div className="overflow-hidden -mx-2" ref={emblaRef}>
              <div className="flex">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    className="min-w-0 flex-shrink-0 flex-grow-0 basis-[54%] px-2 sm:basis-[48%] md:basis-[32%] lg:basis-[24%]"
                  >
                    <div onClick={() => handleCourseClick(course.id)}>
                      <CatalogCard
                        imageAlt={`${course.name} course`}
                        imageSrc={course.iconUrl || "/discover-courses.jpg"}
                        title={course.name}
                        badge={course.type}
                        ctaLabel="View Course"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">No courses available</p>
          </div>
        )}
        <div className="flex justify-center mt-8 gap-3">
          {courses.map((_, index) => (
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