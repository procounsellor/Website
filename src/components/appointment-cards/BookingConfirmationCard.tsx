import { X } from "lucide-react";

interface Props {
  counselorName?: string;
  appointmentDate?: string; // expected YYYY-MM-DD
  appointmentTime?: string; // expected HH:MM (24h)
  onClose?: () => void;
}

function formatDate(iso?: string) {
  if (!iso) return '03 Sept, 2025';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatTime(hhmm?: string) {
  if (!hhmm) return '10:30-11:00 AM';
  const parts = hhmm.split(':').map((p) => parseInt(p, 10));
  if (parts.length < 1 || isNaN(parts[0])) return hhmm;
  const hours = parts[0];
  const minutes = parts[1] || 0;
  
  // Format start time in 24-hour format
  const startTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  
  // Add 30 minutes for end time
  const endMinutes = minutes + 30;
  const endHours = hours + Math.floor(endMinutes / 60);
  const finalMinutes = endMinutes % 60;
  const endTime = `${endHours.toString().padStart(2, '0')}:${finalMinutes.toString().padStart(2, '0')}`;
  
  // Determine AM/PM based on the end time
  const ampm = endHours >= 12 ? 'PM' : 'AM';
  
  return `${startTime}-${endTime} ${ampm}`;
}

export default function BookingConfirmationCard({ counselorName = 'Ashutosh Kumar', appointmentDate, appointmentTime, onClose }: Props){

  return (
    <div className="fixed inset-0  bg-[#232323]/50 backdrop-blur-sm flex items-center justify-center p-4 z-100" onClick={() => onClose?.()}>
      <div onClick={(e) => e.stopPropagation()} className="bg-[#F5F7FA] w-full flex flex-col max-w-[747px] max-h-[667px] rounded-[16px] relative p-[42px] pb-[86px] gap-6 overflow-y-auto custom-scrollbar">
        <style>{`
          .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 8px; }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #CBD5E0; }
          .custom-scrollbar::-webkit-scrollbar-corner { background: transparent; }
          .custom-scrollbar { 
            border-radius: 16px;
            -webkit-mask: linear-gradient(white 0 0);
            mask: linear-gradient(white 0 0);
          }
        `}</style>
        <div className="flex items-center gap-2 text-[#343C6A]">
          <p className="text-2xl font-semibold">Appointment Confirmation</p>
            <button 
            onClick={() => onClose?.()}
            className="absolute top-4 right-4 z-10 p-1.5 rounded-full transition-colors duration-200 hover:bg-black group"
          >
            <X className="h-5 w-5 text-gray-500 transition-colors duration-200 group-hover:text-white" />
          </button>
        </div>



        <div className="flex flex-col items-center gap-6">
          <div className="flex flex-col items-center max-w-[450px] gap-4">
          <img src="/greentick.svg" alt="" className="w-[62px] h-[62px]"/>
          <h1 className="text-2xl text-[#3537b4] font-semibold">Appointment Confirmed</h1>
          <p className="text-[16px] text-[#718ebf] font-medium text-center">Thank you for booking! Your subscription has been activated.</p>
        </div>

        <div className="flex flex-col gap-4 bg-white w-[482px] h-[331px] border-[1px] border-[#f5f5f5] rounded-[12px] p-4">

          <div className="flex gap-2 items-center">
            <img src="/discover-imageCounselor2.jpg" alt="" className="w-16 h-16 rounded-[10px]" />
            <p className="flex flex-col gap-0 text-[18px] text-[#343c6a] font-semibold">Counselling Session<span className="text-[16px] text-[#718ebf] font-medium">with {counselorName}</span></p>
          </div>

          <div className="flex justify-between bg-[#f5f5f5] w-[450px] h-[66px] items-center px-10 rounded-[12px]">

            <div className="flex gap-2 h-10.5 items-center">
              <div className="bg-[#c3f9d966]/40 h-8 w-8 flex items-center justify-center rounded-full">
              <img src="/calander.svg" alt="" className="h-[22px] w-[22px]"/>
              </div>
              <p className="flex flex-col text-[#8C8CA1] font-normal text-[14px]">Date <span className="text-[#232323] text-[16px] font-medium">{formatDate(appointmentDate)}</span></p>
            </div>

            <div className="flex gap-2 h-10.5 items-center">
              <div className="bg-[#C3F9D966]/40 h-8 w-8 flex items-center justify-center rounded-full">
              <img src="/calander.svg" alt="" className="h-[22px] w-[22px]"/>

              </div>
              <p className="flex flex-col text-[#8c8ca1] text-[14px] font-normal">Timing <span className="text-[#232323] text-[16px] font-medium">{formatTime(appointmentTime)}</span></p>
            </div>

          </div>

            <div className="flex w-[450px] h-[117px] rounded-[12px] justify-start p-4 bg-[#F9FAFC] border border-[#f5f5f5] ">

              <p className="flex flex-col gap-2 text-[#343c6a] font-semibold text-[18px]">
                Session Details
                <span className="flex items-center gap-2 text-[#718ebf] text-[16px] font-normal">
                  <img src="/clock.svg" alt="clock" className="h-5 w-5" />
                  Duration: 30 Minutes

                </span>
                <span className="flex items-center gap-2 text-[#718ebf] text-[16px] font-normal">
                  <img src="/map.svg" alt="map" className="w-5 h-5"/>
                  Format: In-Person
                </span>
              </p>
            </div>

        </div>

        <div className="flex flex-col gap-4 items-center">

          <div className="bg-[#ffffff] shadow-[#232323]/15 w-14 h-[56px] flex justify-center items-center rounded-[12px]">
          <img src="/text.svg" alt="text" className="w-10 h-10" />
          </div>

          <p className="flex flex-col items-center gap-2 text-[#232323] font-semibold text-[16px]">Need Help
            <span className="text-[#718ebf] text-[14px] font-medium">Our team is here to assist you any questions</span>
          </p>

          <div className="flex justify-between gap-10">

            <div className="flex gap-2 items-center">
              <img src="/phone.svg" alt="phone" className="h-10 w-10" />
              7893453245
            </div>

            <div className="flex gap-2 items-center">
              <img src="/email.png" alt="email" className="h-7 w-7" />
              support@procounsel.co.in
            </div>


          </div>

        </div>

        </div>

      </div>
    </div>
  );
}
