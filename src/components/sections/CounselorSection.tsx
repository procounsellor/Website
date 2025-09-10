import { Button } from "../ui/button";

export function CounselorSection(){

  return (
    <section
    className="bg-[#F5F5F7] h-[316px] lg:h-[589px] py-2.5 px-5"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between">
        <p className="font-semibold text-[16px] lg:text-[28px]">Get Started Today
        <span className="inline lg:hidden"><br /></span>
        <span className="hidden lg:inline"> - </span>
         <span className="text-[#FF660F]">Book An Appointment Now</span></p>
         <a className="flex gap-2 lg:hidden">See All <img src="/seeAll.svg" className="h-5"/></a>
         <Button variant={'outline'} className=" border-[#000000] text-[#000000] font-semibold text-[16px]
         hover:bg-[#000000] hover:text-[#FFFFFF]
         ">See All
          <img src="/seeAll.svg" className="h-6"/>
         </Button>
      </div>

      </div>
      {/* {counselor && counselor.map((c, idx) => (
        <CounselorCard key={idx} counselor={c} />
      ))} */}

    </section>
  )
}