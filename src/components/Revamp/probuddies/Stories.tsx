import { useState, useEffect, useRef } from "react";
import StoriesCard from "./StoriesCard";

export default function Stories() {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [_activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            if (window.innerWidth < 768 && scrollRef.current) {
                setActiveIndex((prev) => {
                    const nextIndex = (prev + 1) % 3;
                    const cardWidth = 290 + 16;
                    scrollRef.current?.scrollTo({
                        left: nextIndex * cardWidth,
                        behavior: 'smooth'
                    });
                    return nextIndex;
                });
            }
        }, 4500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full md:h-[557px] py-6 md:py-10 pb-6 md:pb-[95px] px-4 md:px-[60px] flex flex-col items-start md:items-center gap-6 md:gap-8 overflow-hidden">

            <div className="md:hidden flex items-center justify-start gap-[8px] bg-white px-[12px] py-[4px] rounded-[4px] w-fit shrink-0">
                <div className="w-[16px] h-[16px] min-w-[16px] min-h-[16px] bg-[#0E1629] shrink-0" />
                <p className="font-[Poppins] font-semibold text-[12px] text-[#0E1629] uppercase tracking-[0.07em] leading-none whitespace-nowrap">
                    SUCCESS STORIES
                </p>
            </div>

            {/* Desktop Heading (Original) */}
            <h1 className="hidden md:block text-(--text-main) font-bold text-2xl">
                Success Stories
            </h1>

            <div 
                ref={scrollRef}
                className="flex gap-4 md:gap-10 items-start md:items-end justify-start md:justify-center w-full overflow-x-auto snap-x snap-mandatory md:overflow-visible [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-4 md:pb-0"
            >
                <div className="snap-center shrink-0">
                    <StoriesCard active={false}/>
                </div>
                <div className="snap-center shrink-0">
                    <StoriesCard active={true}/>
                </div>
                <div className="snap-center shrink-0 pr-4 md:pr-0">
                    <StoriesCard active={false}/>
                </div>
            </div>

        </div>
    );
}