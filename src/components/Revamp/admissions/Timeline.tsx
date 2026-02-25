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
    // Bottom items: flex-col with month, icon, line, content
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
    // Top items: flex-col with content, month, icon
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
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const timelineData = [
    {
      month: "Dec-Jan",
      title: "Exam Preps & \nPre Boards",
      iconUrl:
        "https://www.figma.com/api/mcp/asset/9aaaa4e9-cf3f-4429-96f0-693f23e229ac",
      position: "bottom" as const,
    },
    {
      month: "Feb-Mar",
      title: "Board Exams",
      iconUrl:
        "https://www.figma.com/api/mcp/asset/c459ce51-b194-4bc7-b4af-6cbae7fd7fa7",
      position: "top" as const,
    },
    {
      month: "Mar-Apr",
      title: "Entrance Exam",
      subtitle: "(JEE, NEET)",
      iconUrl:
        "https://www.figma.com/api/mcp/asset/9aaaa4e9-cf3f-4429-96f0-693f23e229ac",
      position: "bottom" as const,
    },
    {
      month: "May-Jun",
      title: "Registration",
      iconUrl:
        "https://www.figma.com/api/mcp/asset/27bb2bd5-77bb-4499-b5ea-15ab73e1a51d",
      position: "top" as const,
    },
    {
      month: "Jun-Jul",
      title: "Document verification",
      iconUrl:
        "https://www.figma.com/api/mcp/asset/c6f15257-00bc-4097-8eb8-f0d6e362a03d",
      position: "bottom" as const,
    },
    {
      month: "Jul-Aug",
      title: "Seat Allotment/CAP",
      iconUrl:
        "https://www.figma.com/api/mcp/asset/448e9867-e3a5-433e-8a8a-83b47c28acd7",
      position: "top" as const,
    },
    {
      month: "Aug-Sep",
      title: "Non CAP/ SPOT/IL Rounds",
      iconUrl:
        "https://www.figma.com/api/mcp/asset/4b04085f-f603-4b8e-a055-6da4f7479550",
      position: "bottom" as const,
    },
    {
      month: "Sep-Oct",
      title: "Start of Academic year",
      iconUrl:
        "https://www.figma.com/api/mcp/asset/0e2d865a-1345-421b-aab5-ed35cb2c8d08",
      position: "top" as const,
    },
    {
      month: "Aug-Sep",
      title:
        "Assistance with hostel, loans, internships, placements, and further studies",
      iconUrl:
        "https://www.figma.com/api/mcp/asset/04ccbbf4-202e-4c06-9b33-04509df9465a",
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
        {/* Horizontal line at 264px - full width */}
        <div className="absolute h-0 left-0 top-[264px] w-full z-20">
        <div className="absolute inset-[-1px_0_0_0]" style={{
          background: "linear-gradient(90deg, #FF6B35 0%, #F7931E 50%, #FF6B35 100%)",
          height: "2px"
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
