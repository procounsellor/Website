import * as React from "react";
import type { EmblaCarouselType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useNavigate } from "react-router-dom";

import { CounselorCard } from "../homecards/CounselorCard";
import { Button } from "@/components/ui/button";
import { useAllCounselors } from "../../hooks/useCounselors";
import { AllCounselorCardSkeleton } from "../skeletons/CounselorSkeletons";

export function CounselorSection() {
  const { data: counselors = [], loading } = useAllCounselors(8);
  const navigate = useNavigate();

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

  const updateSelectedIndex = React.useCallback((api: EmblaCarouselType) => {
    setSelectedIndex(api.selectedScrollSnap());
  }, []);

  React.useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", updateSelectedIndex);
    return () => {
      emblaApi?.off("select", updateSelectedIndex);
    };
  }, [emblaApi, updateSelectedIndex]);

  return (
    <section className="bg-[#F5F5F7] py-6">
      <div className="max-w-[1200px] mx-auto pl-5 lg:px-0">
        <div className="flex justify-between items-center pr-5">
          <p className="font-semibold text-[16px] lg:text-[28px]">
            Get Started Today
            <span className="inline lg:hidden">
              <br />
            </span>
            <span className="hidden lg:inline"> - </span>
            <span className="text-[#FF660F]">Book An Appointment Now</span>
          </p>

          <Button
            variant="outline"
            className="group hidden lg:flex hover:cursor-pointer font-semibold border-2 border-black/50 text-black/80 hover:bg-black hover:text-white transition-all duration-300 px-6 py-3 text-base whitespace-nowrap"
            onClick={() => navigate("/counselors")}
          >
            See All
            <img
              src="/seeAll.svg"
              className="h-6 ml-2 group-hover:filter group-hover:invert"
            />
          </Button>

          <a
            className="flex gap-2 lg:hidden items-center cursor-pointer"
            onClick={() => navigate("/counselors")}
          >
            See All
            <img src="/seeAll.svg" className="h-5" />
          </a>
        </div>


        <div className="relative mt-8">
          <div className="overflow-x-hidden" ref={emblaRef}>
          <div className="flex px-3 gap-3 lg:gap-6 lg:px-6 ">
          {loading ?
          [...Array(6)].map((_, idx )=>(
            <div key={idx}>
              <AllCounselorCardSkeleton/>
            </div>
          )):
          counselors?.map((counselor) => (
            <div key={counselor.counsellorId}
            className="flex-shrink-0 w-[170px] lg:w-[282px] ">
              <CounselorCard counselor={counselor}/>
            </div>
          ))
          }
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
