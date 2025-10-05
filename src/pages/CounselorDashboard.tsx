import CustomCalendar from "@/components/Calendar";


export default function CounselorDashboard() {
    return (
        <div className="w-full bg-[#F5F5F7] px-32
         mt-20 flex flex-col items-center">

            <div className="w-[1200px] flex justify-between items-center py-7">
               <div className="flex items-center gap-4">
                 <img src="/counselor.png" alt="" />
                 <h1 className="flex flex-col gap-2 font-semibold text-2xl text-[#343C6A]">
                    Ashutosh Kumar
                    <span className="text-[#718EBF] text-lg font-medium">
                        Career Counselor, 5+ years of experience
                    </span>
                 </h1>
               </div>


               <button className="h-full bg-white py-2.5 px-4 border border-[#343c6a] rounded-[12px] text-[16px] font-medium">
                View profile
               </button>
            </div>
            

            <div>
                <ul className="flex gap-6 text-[16px] font-semibold text-[#8C8CA1]">
                    <li className="text-[#13097D] flex flex-col items-center">
                          My Calendar
                        <div className="h-[3px] w-[128px] bg-[#13097D] rounded-t-[2px]">
                          
                        </div>
                    </li>
                    <li>
                        My Earnings
                    </li>
                    <li>
                        Appointments
                    </li>
                    <li>
                        Reviews
                    </li>
                    <li>Clients</li>
                </ul>
                <hr className="w-[1200px] bg-[#E5E5E5] h-px mb-5"/>
            </div>



            <div className="w-[1221px] bg-white h-[658px] rounded-[16px] grid grid-cols-[351px_870px] border border-[#EFEFEF]">

                <div className="border-r border-r-[#EDEDED] p-4">

                    <h1 className="font-semiBold text-[20px] text-[#13097D]">Calendar</h1>

                    <div>
                        <CustomCalendar/>
                    </div>

                </div>

                <div>

                </div>

            </div>
        </div>
    );
}