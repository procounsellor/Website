import * as React from "react";
import { useState } from "react";
import type { EmblaCarouselType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { CourseFeatureCard } from "./CourseFeatureCard";
import { ChevronDown, CircleCheck  } from "lucide-react";

const COURSE_FEATURES = [
  {
    title: "Live + Recorded Lectures",
    description: "Get a combination of Live strategy/doubt sessions and Recorded detailed lectures for fast understanding. Recorded videos allow you to learn anytime, anywhere, while live classes help you clear doubts instantly and stay on track.",
  },
  {
    title: "Full-Length Mock Tests",
    description: "Take CET-pattern full-length mock tests designed to match the real exam difficulty, timing, and marking scheme. These tests help improve speed, accuracy, time management, and exam stamina for both Attempt 1 and Attempt 2.",
  },
  {
    title: "Chapterwise PYQs (Topic-wise)",
    description: "Access chapter-wise and topic-wise Previous Year Questions so you can understand exactly which concepts repeat every year. This helps you focus only on high-scoring areas and avoid unnecessary study load.",
  },
  {
    title: "Practice Questions & Speed Drills",
    description: "Solve targeted practice sets and speed drills created specifically to improve your question-solving time. These drills boost accuracy, strengthen concepts, and help you master CET’s fast-paced exam pattern.",
  },
  {
    title: "Notes & Formula Sheets",
    description: "Get crisp short notes, summary charts, and ready-to-revise formula sheets for every chapter. These PDFs are designed for last-minute revision and help you recall concepts instantly during the exam.",
  },
  {
    title: "High-Weightage Important Topics",
    description: "We highlight the most important, most repeated, and high-weightage chapters from Physics, Chemistry, and Mathematics. This ensures your preparation is smart and focused, not time-wasting.",
  },
  {
    title: "Attempt 1 & Attempt 2 Revision Plans",
    description: "The course includes separate revision plans for both exam attempts. You’ll know exactly what to study, how much to practice, and how to revise between Attempt 1 and Attempt 2 for maximum percentile boost.",
  },
  {
    title: "Doubt-Solving Support:",
    description: "Get access to a dedicated WhatsApp/Telegram doubt group where you can ask questions anytime. Our faculty and mentors respond regularly to help you clear doubts quickly.",
  },
  {
    title: "Strategy Classes for Everyone",
    description: "Attend special Strategy Sessions by Aaditya Bhaiya that cover percentile planning, time management, exam-day approach, guessing strategy, accuracy improvement, and chapter prioritisation for scoring higher.",
  },
  {
    title: "Mentorship by COEPians",
    description: "Learn under the guidance of top performers and COEP students who have cracked CET with high percentiles. They share insider tips, subject strategies, and personalized mentorship to keep you motivated and consistent.",
  },
];

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

const MobileFeatureList = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div
      className="mx-auto mt-6 p-3"
      style={{
        width: '335px',
        borderRadius: '16px',
        background: '#FFFFFF',
        border: '1px solid #EFEFEF',
      }}
    >
      <h2
        className="text-left mb-2 px-3"
        style={{
          color: '#13097D',
          fontFamily: 'Poppins',
          fontWeight: 600,
          fontSize: '16px',
          lineHeight: '125%',
          paddingTop: '12px',
        }}
      >
        What you'll get
      </h2>

      <div className="flex flex-col">
        {COURSE_FEATURES.map((feature, index) => (
          <div key={index}>
            <button
              onClick={() => toggleItem(index)}
              className="flex justify-between items-center w-full text-left py-3 px-3 focus:outline-none"
            >
              <div className="flex items-center font-medium space-x-2">
                <CircleCheck  size={18} className="text-[#13097D]" />
                <span
                  style={{
                    fontFamily: 'Poppins',
                    fontWeight: 500,
                    fontSize: '14px',
                    lineHeight: '125%',
                    color: '#232323',
                  }}
                >
                  {feature.title}
                </span>
              </div>
              <ChevronDown
                size={20}
                className={`text-gray-500 transition-transform duration-300 ${
                  openIndex === index ? 'rotate-180' : 'rotate-0'
                }`}
              />
            </button>
            
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <p className="px-5 pb-3 text-sm text-gray-600">
                {feature.description}
              </p>
            </div>

             {index !== COURSE_FEATURES.length - 1 && (
                <div
                    style={{
                        width: '100%',
                        height: '0px',
                        borderTop: '1px solid #F5F5F5',
                        margin: '0 auto',
                    }}
                    className="px-3"
                />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export const Carousel = () => {
  const totalFeatures = COURSE_FEATURES.length;
  
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
      slidesToScroll: 3,
      dragFree: false,
      containScroll: 'keepSnaps',
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
    emblaApi.on("reInit", updateSelectedIndex);

    const removeTrackpadScrolling = addTrackpadScrolling(emblaApi);
    
    return () => {
      emblaApi?.off("select", updateSelectedIndex);
      emblaApi?.off("reInit", updateSelectedIndex);
      removeTrackpadScrolling();
    };
  }, [emblaApi, updateSelectedIndex]);

  const dotCount = Math.ceil(totalFeatures / 3);
  const activeDotIndex = Math.floor(selectedIndex / 3); 


  return (
    <section className="py-12">
      <div className="lg:hidden">
        <MobileFeatureList />
      </div>

      {/*desktop*/}
      <div className="hidden lg:block" style={{ maxWidth: '1324px', margin: '0 auto' }}>
      
        <h2
          className="text-center mx-auto mb-8"
          style={{
            width: '306px',
            height: '60px',
            fontFamily: 'Poppins',
            fontWeight: 600,
            fontSize: '40px',
            lineHeight: '100%',
            color: '#13097D',
          }}
        >
          What you'll get
        </h2>

        <div className="relative mt-8" style={{ marginTop: '32px' }}> 
          <div className="overflow-hidden px-0.5 py-4" ref={emblaRef}>
            <div className="flex" style={{ gap: '32px', padding: '0 16px' }}> 
              {COURSE_FEATURES.map((feature, index) => (
                <div 
                  key={index}
                  className="flex-shrink-0"
                  style={{
                      minWidth: `calc((100% / 3) - (32px * 2 / 3))`, 
                  }}
                >
                  <CourseFeatureCard feature={feature} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-6 gap-2">
          {Array.from({ length: dotCount }, (_, index) => (
            <button
              key={index}
              onClick={() => emblaApi && emblaApi.scrollTo(index * 3)}
              className={`h-2 rounded-full transition-all duration-300 ${
                activeDotIndex === index
                  ? "w-6 bg-[#13097D]"
                  : "w-2 bg-gray-400"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};