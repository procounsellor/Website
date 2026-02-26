import { useEffect, useState, useRef } from "react";

interface TimelineItemProps {
  month: string;
  title: string;
  iconUrl: string;
  subtitle?: string;
  position: "top" | "bottom";
}

const TimelineItem = ({
  month,
  title,
  iconUrl,
  subtitle,
  position,
}: TimelineItemProps) => {
  if (position === "bottom") {
    return (
      <div className="flex flex-col gap-[40px] items-center justify-center w-[151px] relative">
        <p className="font-bold not-italic text-[#2f43f2] text-[20px] text-center whitespace-pre-wrap leading-normal min-w-full w-[min-content] shrink-0">
          {month}
        </p>
        <div className="flex flex-col gap-[12px] items-center w-full shrink-0">
          <div className="flex items-center justify-center shrink-0">
            <img src="/line-bottom.svg" alt="line" className="h-[52px] w-[6px] block" />
          </div>
          <div className="flex flex-col min-h-[48px] justify-end text-center text-[#2a2b2a] text-[15px] w-full shrink-0">
            {subtitle ? (
              <p className="whitespace-pre-wrap leading-[24.75px]">
                <span className="text-[#2a2b2a]">
                  {title}
                  <br aria-hidden="true" />
                </span>
                <span className="text-[#6b7280]">{subtitle}</span>
              </p>
            ) : (
              <p className="whitespace-pre-wrap leading-[24.75px]">{title}</p>
            )}
          </div>
        </div>
        <div className="-translate-x-1/2 absolute h-[32px] left-[calc(50%-0.5px)] top-[32px] w-[37.689px] z-30">
          <div className="absolute bg-white left-0 size-[32px] top-0" />
          <img src={iconUrl} alt={title} className="absolute left-[3.33px] size-[27.378px] top-[2.13px] max-w-none object-cover pointer-events-none" />
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex flex-col gap-[40px] items-center justify-center w-[151px] relative">
        <div className="flex flex-col gap-[12px] items-center w-full shrink-0">
          <div className="flex flex-col min-h-[48px] justify-end text-center text-[#2a2b2a] text-[15px] w-full shrink-0">
            {subtitle ? (
              <p className="whitespace-pre-wrap leading-[24.75px]">
                <span className="text-[#6b7280]">
                  {subtitle}
                  <br aria-hidden="true" />
                </span>
                <span className="text-[#2a2b2a]">{title}</span>
              </p>
            ) : (
              <p className="whitespace-pre-wrap leading-[24.75px]">{title}</p>
            )}
          </div>
          <div className="flex items-center justify-center shrink-0">
            <img src="/line-top.svg" alt="line" className="h-[52px] w-[6px] block" />
          </div>
        </div>
        <p className="font-bold not-italic text-[#2f43f2] text-[20px] text-center whitespace-pre-wrap leading-normal min-w-full w-[min-content] shrink-0">
          {month}
        </p>
        <div className="-translate-x-1/2 absolute bottom-[32px] h-[32px] left-[calc(50%-0.5px)] w-[30.588px] z-30">
          <div className="absolute bg-white h-[32px] left-[-0.12px] top-0 w-[30.588px]" />
          <img src={iconUrl} alt={title} className="absolute left-[2.16px] size-[28px] top-[2px] max-w-none object-cover pointer-events-none" />
        </div>
      </div>
    );
  }
};

export default function Timeline() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );

    const el = sectionRef.current;
    if (el) {
      observer.observe(el);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const timelineData = [
    {
      month: "Dec-Jan",
      title: "Exam Preps & \nPre Boards",
      iconUrl: "/timeline-icons/exam-time.png",
      position: "bottom" as const,
    },
    {
      month: "Feb-Mar",
      title: "Board Exams",
      iconUrl: "/timeline-icons/evaluation.png",
      position: "top" as const,
    },
    {
      month: "Mar-Apr",
      title: "Entrance Exam",
      subtitle: "(JEE, NEET)",
      iconUrl: "/timeline-icons/exam-time.png",
      position: "bottom" as const,
    },
    {
      month: "May-Jun",
      title: "Registration",
      iconUrl: "/timeline-icons/application.png",
      position: "top" as const,
    },
    {
      month: "Jun-Jul",
      title: "Document verification",
      iconUrl: "/timeline-icons/registration.png",
      position: "bottom" as const,
    },
    {
      month: "Jul-Aug",
      title: "Seat Allotment/CAP",
      iconUrl: "/timeline-icons/immigration.png",
      position: "top" as const,
    },
    {
      month: "Aug-Sep",
      title: "Non CAP/ SPOT/IL Rounds",
      iconUrl: "/timeline-icons/non-cap.png",
      position: "bottom" as const,
    },
    {
      month: "Sep-Oct",
      title: "Start of Academic year",
      iconUrl: "/timeline-icons/college.png",
      position: "top" as const,
    },
    {
      month: "Aug-Sep",
      title:
        "Assistance with hostel, loans, internships, placements, and further studies",
      iconUrl: "/timeline-icons/assistance.png",
      position: "bottom" as const,
    },
  ];

  return (
    <div ref={sectionRef} className="relative w-full bg-[#C6DDF040] pt-[40px] pb-16">
      {/* Section Heading */}
      <h2 className="text-[#0E1629] text-[24px] font-bold text-center mb-4 break-words" style={{ fontFamily: 'Poppins' }}>
        Procounsel Role in your Journey
      </h2>

      {/* Timeline Container */}
      <div className="relative h-[600px] w-full">
        <div className="absolute h-0 left-0 top-[264px] w-full z-20">
        <div className="absolute inset-[-1px_0_0_0]" style={{
          background: "linear-gradient(90deg, #FF6B35 0%, #F7931E 50%, #FF6B35 100%)",
          height: "1px"
        }} />
      </div>

      <div className="relative h-full w-full max-w-[1440px] mx-auto">
        {timelineData.map((item, index) => {
          const delays = [0, 250, 500, 750, 1000, 1250, 1500, 1750, 2000];
          return (
            <div
              key={index}
              className="absolute"
              style={{
                left: `${16 + index * ((1440 - 32 - 151) / (timelineData.length - 1))}px`,
                top: item.position === "bottom" ? "220px" : "129px",
                width: "151px",
                opacity: isVisible ? 1 : 0,
                transition: `opacity 800ms cubic-bezier(0.4, 0, 0.2, 1) ${delays[index]}ms`
              }}
            >
              <TimelineItem {...item} />
            </div>
          );
        })}
      </div>
      </div>
    </div>
  );
}
