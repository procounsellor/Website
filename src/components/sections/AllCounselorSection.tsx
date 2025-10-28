import * as React from "react";
import type { EmblaCarouselType } from 'embla-carousel';
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

import { AllCounselorCard } from "../homecards/AllCounselorCard";
import { Button } from "@/components/ui/button";
import { useAllCounselors } from "../../hooks/useCounselors";
import { AllCounselorCardSkeleton } from "../skeletons/CounselorSkeletons";
import { useNavigate, Link } from "react-router-dom";

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

export function AllCounselorSection() {
  const navigate = useNavigate();
  const { data: counselors, loading, error, refetch } = useAllCounselors(8);

  const autoplay = React.useRef(
    Autoplay({ 
      delay: 3000, 
      stopOnInteraction: false, 
      stopOnMouseEnter: true,
      stopOnLastSnap: false
    })
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
  const updateSelectedIndex = React.useCallback((emblaApi: EmblaCarouselType) => {
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, []);

  React.useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", updateSelectedIndex);
    const removeTrackpadScrolling = addTrackpadScrolling(emblaApi);
    
    return () => {
      emblaApi.off("select", updateSelectedIndex);
      removeTrackpadScrolling();
    };
  }, [emblaApi, updateSelectedIndex]);
    
  if (loading) {
    return (
      <section 
        className="w-full py-16 px-4"
        style={{
          background: '#F5F5F7',
          minHeight: '589px'
        }}
      >
        <div className="max-w-[1200px] mx-auto">
          <div className="mb-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
                Counsellors
              </h2>
            </div>
            <Button 
              variant="outline" 
              className="font-semibold border-2 border-black/50 text-black/80 hover:bg-black hover:text-white transition-all duration-300 px-6 py-3 text-base whitespace-nowrap"
              onClick={() => navigate('/counselors')}
            >
              See All <img src="/seeAll.svg" className="h-6"/>
            </Button>
          </div>

          <div className="relative">
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
        className="w-full py-16 px-4"
        style={{
          background: '#F5F5F7',
          minHeight: '589px'
        }}
      >
        <div className="max-w-[1200px] mx-auto flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button 
              onClick={() => refetch()} 
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
      className="w-full py-6"
      style={{ background: "#F5F5F7" }}
    >
      <div className="max-w-[1200px] mx-auto pl-5  lg:px-0">
        <div className="mb-8 flex items-center pr-5 justify-between">
            <h2 className="font-semibold text-[16px] lg:text-[28px]">
              Counsellors
            </h2>
            <a className="flex gap-2 lg:hidden cursor-pointer" onClick={() => navigate('/counselors')}>See All <img src="/seeAll.svg" className="h-5"/></a>

             <Button 
              variant="outline" 
              className="group hidden lg:flex hover:cursor-pointer font-semibold border-2 border-black/50 text-black/80 hover:bg-black hover:text-white transition-all duration-300 px-6 py-3 text-base whitespace-nowrap"
              onClick={() => navigate('/counselors')}
            >
              See All <img src="/seeAll.svg" className="h-6 ml-2 group-hover:filter group-hover:invert"/>
            </Button>
        </div>

        <div className="relative">
          <div className="overflow-x-hidden py-4 px-0.5" ref={emblaRef}>
            <div className="flex gap-3 px-3 lg:px-6 lg:gap-6">
              {counselors.map((counselor) => (
                <div
                  key={counselor.counsellorId}
                  className="flex-shrink-0 w-[170px] lg:w-[282px]"
                >
                  <Link to={`/counselors/profile`} state={{ id: counselor.counsellorId }} className="block">
                    <AllCounselorCard counselor={counselor} />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>


        <div className="flex justify-center mt-6 gap-2">
          {Array.from(
            { length: Math.ceil((counselors?.length || 0) / 2) },
            (_, index) => (
              <button
                key={index}
                onClick={() => emblaApi && emblaApi.scrollTo(index * 2)}
                className={`h-2 rounded-full transition-all duration-300 ${
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