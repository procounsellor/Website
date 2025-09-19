import { CalendarDays, ChevronLeft, Star } from "lucide-react";
import { Button } from "../ui";
import { useEffect, useState, type JSX } from "react";
import type { AllCounselor, CounselorDetails } from "@/types/academic";

interface Props {
  counselor: AllCounselor | CounselorDetails;
  /** optional callback invoked when a day is selected */
  onDaySelect?: (day: days | null) => void;
}

interface days{
    day:number,
    dayName:string,
    monthName:string
}

export default function AppointmentCard({ counselor, onDaySelect }: Props): JSX.Element {
  const fullName = counselor.firstName + "" + counselor.lastName;
  const imageUrl =
    counselor.photoUrlSmall ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      fullName
    )}&background=E0E7FF&color=4F46E5&size=128`;
  const rating = counselor.rating;
  
  // Handle different counselor types to get the ID
  const getCounselorId = (counselor: AllCounselor | CounselorDetails): string => {
    if ('counsellorId' in counselor) {
      return counselor.counsellorId;
    } else {
      return counselor.userName; // CounselorDetails uses userName as identifier
    }
  };
  
  // stable storage key base for this counselor (used for localStorage)
  const storageKeyBase = getCounselorId(counselor);


  const [days, setDays] = useState<days[]>([])
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);








useEffect(()=>{

    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];


    function getDaysWithNames() {
    const today = new Date();
    const result = [];

    for (let i = 0; i < 3; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        const dayName = daysOfWeek[date.getDay()];
        const monthName = months[date.getMonth()];
        const day = date.getDate();

        result.push({
            dayName:dayName,
            monthName:monthName,
            day:day
        });
    }

    return result;
}
    const daysArray = getDaysWithNames();
    setDays(daysArray);
    // load persisted selection (index) for this counselor if available
    try {
      const storageKey = `appointment_selected_${storageKeyBase}`;
      const saved = window.localStorage.getItem(storageKey);
      if (saved !== null) {
        const idx = Number(saved);
        if (!Number.isNaN(idx) && idx >= 0 && idx < daysArray.length) {
          setSelectedIndex(idx);
          // notify parent if needed
          if (onDaySelect) onDaySelect(daysArray[idx]);
        }
      }
    } catch {
      /* ignore localStorage errors */
    }
}, [storageKeyBase, onDaySelect])

  return (
    <div className="fixed inset-0  bg-[#232323]/50 backdrop-blur-sm flex items-center justify-center p-4 z-100">
      <div className="bg-[#F5F7FA] w-full flex flex-col max-w-[747px] max-h-[667px] rounded-[16px] relative p-[42px] gap-6 overflow-y-scroll overflow-x-hidden">
        <div className="flex gap-2 text-[#343C6A]">
          <ChevronLeft className="w-7 h-7" />
          <p className="text-2xl font-semibold">Book Appointment</p>
        </div>

        <div className="bg-white w-[663px] h-full  max-h-[598px] p-4 rounded-2xl">
          <div className="flex flex-col gap-4">
            {/* top name and image section starts */}
            <div className="flex justify-between">
              <div className="flex gap-4">
                <img
                  src={imageUrl}
                  alt={fullName}
                  className="w-[100px] h-[100px] rounded-[8px]"
                />
                <h1 className="text-[#343C6A] font-semibold text-[20px] flex flex-col gap-1.5">
                  {fullName}{" "}
                  <span className="text-[#718EBF] font-normal text-[16px]">
                    Mumbai
                  </span>
                </h1>
              </div>

              <div className="flex gap-3">
                <Star className="h-6 w-6 text-[#ffd700]" fill="currentColor" />
                <div className="font-semibold text-[16px] text-[#718ebf]">
                  {rating} <span className="text-[13px] font-normal">(1)</span>
                </div>
              </div>
            </div>

            {/* name image section ends with reviews as well */}

            {/* selection starts */}
            <div className="flex justify-between">
              <h1 className="text-[#232323] font-semibold text-[18px]">
                Available This Week
              </h1>
              <CalendarDays className="h-6 w-6 text-[#fa660a]" />
            </div>


          <div className="flex gap-4">
            {days.map((d, i) => {
              const isSelected = selectedIndex === i;
              const storageKey = `appointment_selected_${storageKeyBase}`;

              const onSelect = () => {
                setSelectedIndex(i);
                try {
                  window.localStorage.setItem(storageKey, String(i));
                } catch {
                  /* ignore */
                }
                if (onDaySelect) onDaySelect(d);
              };

              return (
                <div
                  key={i}
                  role="button"
                  tabIndex={0}
                  onClick={() => onSelect()}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelect();
                    }
                  }}
                  className={`w-[200px] h-[59px] rounded-[12px] shadow-xs flex items-center justify-center cursor-pointer border-[1px] transition-all duration-150 ${
                    isSelected
                      ? 'bg-[#3537b4] border-transparent text-white'
                      : 'bg-white border-[#f5f5f5] text-[#232323]'
                  }`}
                >
                  <p className="h-full flex flex-col items-center justify-center text-[14px] font-normal">
                    <span className="text-[13px]">
                      {i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.dayName}
                    </span>
                    <span className="text-[16px] font-semibold">{`${d.day} ${d.monthName}`}</span>
                  </p>
                </div>
              );
            })}
          </div>



          {/* here the slot selection */}
          <div className="w-full h-[60px] border-[1px] border-[#f5f5f5] shadow-xs rounded-[12px]">


          </div>
          <div>

          </div>


          <div>

          </div>



          </div>


        </div>
      </div>
      <Button
        variant={"default"}
        className="bg-[#ACACAC] text-[16px] text-white"
      >
        Book Now
      </Button>
    </div>
  );
}
