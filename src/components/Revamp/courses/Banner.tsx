import { useEffect, useState } from "react";
import CoursePageBanner from "./CoursePageBanner";
import CourseSection from "./CourseSection";
import LiveSection from "./LiveSessions";
import TestSection from "./TestSection";
import { listenToLiveSessionsStatus } from "@/lib/firebase";

export default function Banner() {
  const [liveSessionsCount, setLiveSessionsCount] = useState(0);

  useEffect(() => {
    const unsubscribe = listenToLiveSessionsStatus((allLives) => {
      const count = Object.values(allLives || {}).filter(
        (session: any) => Boolean(session?.isLive)
      ).length;
      setLiveSessionsCount(count);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>

      {/* phone design */}
      <div className="block relative md:hidden">

        <div className="w-full h-[210px] bg-[url('/probuddiesbg.jpg')] bg-cover bg-center">
          <div className="w-full h-full bg-[#0E1629A6]/95 px-5 pt-6 text-white">
            <div className="flex flex-col gap-3">
              <h1 className="text-[1.625rem] font-bold leading-tight">Courses</h1>
              <p className="text-xs text-white/85 leading-relaxed max-w-[330px]">
                Learn from curated courses, discover practical test series, and join
                live sessions in one place to stay consistent with your goals.
              </p>

              <div className="flex items-center gap-3 pt-1">
                <div className="flex items-center gap-1.5">
                  <img src="/onne.svg" alt="courses" className="w-5 h-5" />
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">100+</span>
                    <span className="text-[10px] text-white/75">Courses</span>
                  </div>
                </div>

                <div className="h-7 w-px bg-white/30" />

                <div className="flex items-center gap-1.5">
                  <img src="/twoo.svg" alt="live sessions" className="w-5 h-5" />
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">{liveSessionsCount} Live</span>
                    <span className="text-[10px] text-white/75">Sessions now</span>
                  </div>
                </div>

                <div className="h-7 w-px bg-white/30" />

                <div className="flex items-center gap-1.5">
                  <img src="/threee.svg" alt="students" className="w-5 h-5" />
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">1260+</span>
                    <span className="text-[10px] text-white/75">Students</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <CourseSection/>
          <TestSection/>
        </div>

      </div>






      {/* laptops and desktops view */}
      <div className="hidden md:block">
      <div className="w-full h-[520px] bg-[url('/probuddiesbg.jpg')] bg-cover bg-center">
        <div className="flex flex-col gap-8 items-center justify-center w-full h-full bg-[#0E1629A6]/95">
          <div className="flex flex-col gap-6 items-center justify-center">
            <h1 className="text-white font-bold text-[3.75rem]">Courses</h1>
            <p className="bg-gradient-to-r text-transparent bg-clip-text from-[#6B7280] to-[#ffffff]/50 font-medium text-[1.5rem] text-center max-w-[753px]">
              Lorem ipsum dolor sit amet consectetur. Senectus arcu cras at
              risus a tortor ut quam in. Lorem ipsum dolor.
            </p>
          </div>

          <div className="flex gap-6">
            <div className="flex w-[200px] h-[58px] gap-2  border-r border-(--text-muted) justify-start items-center">
              <img src="/onne.svg" alt="firstone" />
              <p className="flex flex-col text-[#FFC107] leading-8 font-medium text-[1.5rem]">
                100+<span className="leading-[22px] text-[1rem]">courses</span>
              </p>
            </div>

            <div className="flex w-[200px] h-[58px] gap-2  border-r border-(--text-muted) justify-start items-center">
              <img src="/twoo.svg" alt="firstone" />
              <p className="flex flex-col text-[#DC3545] leading-8 font-medium text-[1.5rem]">
                200+
                <span className="leading-[22px] text-[1rem]">
                  Live Sessions
                </span>
              </p>
            </div>

            <div className="flex w-[200px] h-[58px] gap-2  justify-start items-center">
              <img src="/threee.svg" alt="firstone" />
              <p className="flex flex-col text-[#198754] leading-8 font-medium text-[1.5rem]">
                1260+
                <span className="leading-[22px] text-[1rem]">Students</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#F5F5F7] flex flex-col pb-20">
        <CourseSection />
        <CoursePageBanner />
        <TestSection />
        <LiveSection />
      </div>
    </div>
    </div>
  );
}
