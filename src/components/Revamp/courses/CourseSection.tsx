import CourseCard from "./CourseCard";
import { SeeAllButton } from "../components/LeftRightButton";

export default function CourseSection(){
    return (
        <div className="w-full py-10">
            <div className="max-w-[1440px] mx-auto px-[60px]">
                <div className="flex justify-between items-start mb-10">
                    <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-md">
                        <div className="w-4 h-4 bg-[#0E1629]" />
                        <p className="font-[Poppins] font-semibold text-[14px] text-[#0E1629] uppercase tracking-wider">
                            COURSES
                        </p>
                    </div>

                    <p className="font-[Poppins] font-medium text-[24px] text-[#0E1629] max-w-[682px] leading-normal">
                        Discover curated programs across mental wellness, assessments, admissions, and upskilling led by experienced professionals, built around your needs.
                    </p>
                </div>
                <div className="flex gap-[25px] justify-center mb-6">
                    <CourseCard/>
                    <CourseCard/>
                    <CourseCard/>
                    <CourseCard/>
                </div>

                <div className="flex justify-end">
                    <SeeAllButton
                        text="See all"
                        onClick={() => console.log('see all')}
                    />
                </div>
            </div>
        </div>
    );
}