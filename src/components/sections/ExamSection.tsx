import * as React from "react";
import type { EmblaCarouselType } from 'embla-carousel';
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useNavigate } from "react-router-dom";
import { AcademicCard } from "../homecards/AcademicCard";
import { Button } from "@/components/ui/button";
import { useExams } from "../../hooks/useExams";

const addTrackpadScrolling = (emblaApi: EmblaCarouselType) => {
  const SCROLL_COOLDOWN_MS = 300; 
  let isThrottled = false;

  const wheelListener = (event: WheelEvent) => {
    if (isThrottled) return;

    if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
      event.preventDefault();
      
      isThrottled = true;
      
      if (event.deltaX > 0) {
        emblaApi.scrollNext();
      } else {
        emblaApi.scrollPrev();
      }
      setTimeout(() => {
        isThrottled = false;
      }, SCROLL_COOLDOWN_MS);
    }
  };

  const containerNode = emblaApi.containerNode();
  containerNode.addEventListener("wheel", wheelListener);

  return () => containerNode.removeEventListener("wheel", wheelListener);
};

export function ExamSection() {
  const { exams, loading, error } = useExams(8); 
  const navigate = useNavigate();
  
  const autoplay = React.useRef(
    Autoplay({ 
      delay: 3000, 
      stopOnInteraction: false, 
      stopOnMouseEnter: true,
      stopOnLastSnap: false
    })
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
    const removeTrackpadScrolling = addTrackpadScrolling(emblaApi)
    return () => {
      emblaApi.off("select", updateSelectedIndex);
      removeTrackpadScrolling();
    };
  }, [emblaApi, updateSelectedIndex]);


  const handleExamClick = (examId: string) => {
    // console.log('Exam clicked:', examId);
    navigate(`/exams/${examId}`);
  };

  if (loading) {
    return (
      <section className="w-full bg-[#F5F5F7] py-16 px-4">
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
      <section className="w-full bg-[#F5F5F7] py-16 px-4">
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
    <section className="w-full bg-[#F5F5F7] py-6">
      <div className="max-w-[1200px] mx-auto pl-5  lg:px-0">
        <div className="mb-8 flex items-center pr-5 justify-between">
          <h2 className="font-semibold text-[16px] lg:text-[28px]">
            Exams
          </h2>
          <a className="flex gap-2 lg:hidden cursor-pointer" onClick={() => navigate('/exams')}>See All <img src="/seeAll.svg" className="h-5"/></a>
          <Button 
            variant="outline" 
            className="group hidden lg:flex hover:cursor-pointer font-semibold border-2 border-black/50 text-black/80 hover:bg-black hover:text-white transition-all duration-300 px-6 py-3 text-base whitespace-nowrap"
            onClick={() => navigate('/exams')}
          >
            See All <img src="/seeAll.svg" className="h-6 ml-2 group-hover:filter group-hover:invert"/>
          </Button>
        </div>


        <div className="relative mt-2 lg:mt-8">
          <div className="overflow-x-hidden px-0.5 py-4" ref={emblaRef}>
            <div className="flex gap-3 px-3 lg:px-6 lg:gap-6">
              {exams?.map((exam)=>(
                <div key={exam.id}
                className="shrink-0 w-[170px] lg:w-[282px] cursor-pointer"
                onClick={()=> handleExamClick(exam.id)}
                >
                  <AcademicCard
                  imageAlt={exam.name}
                  imageSrc={exam.bannerUrl || exam.iconUrl}
                  title={exam.name}
                  badge={exam.level}
                  ctaLabel="View Exam"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-6 gap-2">
          {Array.from(
            { length: Math.ceil((exams?.length || 0) / 2) },
            (_, index) => (
              <button
                key={index}
                onClick={() => emblaApi && emblaApi.scrollTo(index * 2)}
                className={`h-2 rounded-full transition-all duration-300 hover:cursor-pointer ${
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