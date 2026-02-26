import AdvantageSection from "../probuddies/AdvantageSection";
import CounsellorSection from "./Counsellor";
import CoursePageBanner from "./CoursePageBanner";
import CourseSection from "./CourseSection";

export default function Banner() {
    return (
        <div className="">
        <div className="w-full h-[520px] bg-[url('/probuddiesbg.jpg')] bg-cover bg-center">
      <div className="flex flex-col gap-8 items-center justify-center w-full h-full bg-[#0E1629A6]/95">

      <div className="flex flex-col gap-6 items-center justify-center">
        <h1 className="text-white font-bold text-[3.75rem]">Courses</h1>
        <p
          className="bg-gradient-to-r text-transparent bg-clip-text from-[#6B7280] to-[#ffffff]/50 font-medium text-[1.5rem] text-center max-w-[753px]"
        >
          Lorem ipsum dolor sit amet consectetur. Senectus arcu cras at risus a tortor ut quam in. Lorem ipsum dolor.
        </p>
      </div>

      <div className="flex gap-6">
        <div className="flex w-[200px] h-[58px] gap-2  border-r border-(--text-muted) justify-start items-center">
            <img src="/onne.svg" alt="firstone" />
            <p className="flex flex-col text-[#FFC107] leading-8 font-medium text-[1.5rem]">100+<span className="leading-[22px] text-[1rem]">courses</span></p>
        </div>
       
       <div className="flex w-[200px] h-[58px] gap-2  border-r border-(--text-muted) justify-start items-center">
            <img src="/twoo.svg" alt="firstone" />
            <p className="flex flex-col text-[#DC3545] leading-8 font-medium text-[1.5rem]">200+<span className="leading-[22px] text-[1rem]">Live Sessions</span></p>
        </div>

         <div className="flex w-[200px] h-[58px] gap-2  justify-start items-center">
            <img src="/threee.svg" alt="firstone" />
            <p className="flex flex-col text-[#198754] leading-8 font-medium text-[1.5rem]">1260+<span className="leading-[22px] text-[1rem]">Students</span></p>
        </div>

        
      </div>
       
      </div>
    </div>

    <div className=" bg-[#C6DDF040] flex flex-col pb-20">
      <CourseSection/>
      <CounsellorSection/>
        <AdvantageSection/>
        <CoursePageBanner/>
    
    </div>

    </div>

    );
}