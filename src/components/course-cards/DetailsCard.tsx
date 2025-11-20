import type { CourseType } from "@/types/course";


export default function ({role, courseId, course}:{role:string, courseId:string, course:CourseType}){
    return <div className="max-w-7xl mx-auto">
        <div className="flex gap-3 items-center">
            <img src="/mockCourse.svg" alt="" className="max-w-[7.5rem]"/>
            <div className="flex flex-col gap-1">
                <p className="text-[#8C8CA1] text-[1rem] font-medium">{course.subject}</p>
                <h1 className="text-[#343C6A] text-[1.25rem] font-semibold">{course.name}</h1>
                <div className="flex gap-2 items-center ">
                    <img src="/coin.svg" alt=""/>
                    <h3 className="text-[#07B02E] text-[1rem] font-medium">{course.price}</h3>
                </div>

                {role === 'counselor' && <CounsellorData totalBaught="100+" duration="1h 27min" moneyEarned="1k+"/>}
            </div>
        </div>
        
        
    </div>
}


function CounsellorData({totalBaught, duration, moneyEarned}:{totalBaught:string, duration:string, moneyEarned:string}){
    return <div className="flex gap-5">
        <p className="bg-[#FDEFE2] rounded-[12px] p-1 flex items-center justify-center max-h-7.5 font-medium text-[#EF7F21] text-center"><img src="/orangeRuppe.svg" alt="" />{moneyEarned} money earned</p>
         <p className="bg-[#E1EDFA]rounded-[12px] p-1 flex items-center justify-center max-h-7.5 font-medium text-[#226CBD]"><img src="/people.svg" alt="" />{totalBaught} courses bought</p>
        <p className="bg-[#E7FAF9] rounded-[12px] p-1 flex items-center justify-center max-h-7.5 font-medium text-[#058C91]"><img src="/greenClock.svg" alt="" />{duration}</p>
    </div>
}

