import { X } from "lucide-react";
import { Input } from "../ui";
import { useState, useRef, useEffect } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { Dayjs } from "dayjs";
import { setOutOfOffice } from "@/api/counselor-Dashboard";
// import { useAuthStore } from "@/store/AuthStore";
import toast from "react-hot-toast";

export default function OutOfOfficeDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
  counselor?: string;
}) {
  // const { userId } = useAuthStore();
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('18:00');
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [showEndCalendar, setShowEndCalendar] = useState(false);
  const startCalendarRef = useRef<HTMLDivElement>(null);
  const endCalendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      if (target.closest('.MuiPickersCalendarHeader-root') || 
          target.closest('.MuiYearCalendar-root') || 
          target.closest('.MuiMonthCalendar-root') ||
          target.closest('.MuiDayCalendar-root')) {
        return;
      }
      
      if (startCalendarRef.current && !startCalendarRef.current.contains(event.target as Node)) {
        setShowStartCalendar(false);
      }
      if (endCalendarRef.current && !endCalendarRef.current.contains(event.target as Node)) {
        setShowEndCalendar(false);
      }
    };

    if (showStartCalendar || showEndCalendar) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showStartCalendar, showEndCalendar]);

  const handleSubmit = async () => {
    const counselorId = '9470988669';

    if (!startDate || !endDate || !startTime || !endTime || !reason.trim()) {
        toast.error("Please fill in all fields before scheduling.");
        return;
    }

    const payload = {
        counsellorId: counselorId,
        reason,
        startDate: startDate.format('YYYY-MM-DD'),
        endDate: endDate.format('YYYY-MM-DD'),
        startTime: startTime,
        endTime: endTime,
    };

    setIsSubmitting(true);
    try {
        await setOutOfOffice(payload);
        setStartDate(null);
        setEndDate(null);
        setReason("");
        onClose();
    } catch (error) {
        console.error("Submission failed");
    } finally {
        setIsSubmitting(false);
    }
  };

  const isFormIncomplete = !startDate || !endDate || !startTime || !endTime || !reason.trim();

  if(!open) return null

  return (
    <div className="fixed inset-0 z-50 pointer-events-auto">
      <div
        className={`absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-200`}
        onClick={onClose}
      />

      <aside className={`absolute right-0 top-0 bottom-0 w-[460px] bg-[#f5f5f7] shadow-xl transform transition-all duration-300 `}>
        <div className="h-full flex flex-col">
          <div className="flex justify-between items-center h-[4.25rem] bg-white p-7">
            <h1 className="flex gap-2 text-[16px] font-semibold text-[#343C6A]">
              <span>
                <img src="/cal.svg" alt="" /></span> Schedule out of office
            </h1>
            <button
              className="flex items-center cursor-pointer justify-center group hover:bg-[#232323] rounded-full w-6 h-6"
              onClick={onClose}
              aria-label="Close"
            >
              <X className="group-hover:text-white text-gray-500" size={17} />
            </button>
          </div>

          <div className="h-[377px] w-[412px] my-5 mx-auto rounded-[16px] p-4 bg-white border border-[#EFEFEF] flex flex-col gap-4">
            <div className="flex flex-col gap-2">
                <label className="label" htmlFor="dates">Date</label>
                <div className="flex gap-4">
                    <div className="relative w-[182px]" ref={startCalendarRef}>
                      <div 
                        onClick={() => setShowStartCalendar(!showStartCalendar)}
                        className="w-full h-9 rounded-md border border-[#E5E5E5] bg-white px-[8px] cursor-pointer hover:border-[#FA660F] transition-colors flex items-center gap-2"
                      >
                        <img src="/cal.svg" alt="" className="w-4 h-4 flex-shrink-0" />
                        <span 
                          className="text-[14px] font-medium"
                          style={{ 
                            color: startDate ? '#232323' : '#6C696980',
                          }}
                        >
                          {startDate ? startDate.format('MMM D, YYYY') : 'Start Date'}
                        </span>
                      </div>
                      
                      {showStartCalendar && (
                        <div className="absolute top-full left-0 mt-1 z-50 bg-white rounded-lg shadow-lg border border-[#E5E5E5]">
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateCalendar
                              value={startDate}
                              onChange={(newValue) => {
                                setStartDate(newValue);
                                setShowStartCalendar(false);
                              }}
                              views={['month', 'day']}
                              sx={{
                                '& .MuiPickersCalendarHeader-label': {
                                  fontSize: '1rem',
                                },
                                '& .MuiPickersDay-root.Mui-selected': {
                                  backgroundColor: '#FA660F',
                                  '&:hover': {
                                    backgroundColor: '#FA660F',
                                  },
                                },
                                '& .MuiPickersDay-root.Mui-selected:focus': {
                                  backgroundColor: '#FA660F',
                                },
                                '& .MuiPickersMonth-root.Mui-selected': {
                                  backgroundColor: '#FA660F',
                                  color: '#ffffff',
                                  '&:hover': {
                                    backgroundColor: '#FA660F',
                                  },
                                },
                                '& .MuiPickersMonth-monthButton.Mui-selected': {
                                  backgroundColor: '#FA660F !important',
                                  color: '#ffffff !important',
                                },
                              }}
                            />
                          </LocalizationProvider>
                        </div>
                      )}
                    </div>
                    
                    <div className="relative w-[182px]" ref={endCalendarRef}>
                      <div 
                        onClick={() => setShowEndCalendar(!showEndCalendar)}
                        className="w-full h-9 rounded-md border border-[#E5E5E5] bg-white px-[8px] cursor-pointer hover:border-[#FA660F] transition-colors flex items-center gap-2"
                      >
                        <img src="/cal.svg" alt="" className="w-4 h-4 flex-shrink-0" />
                        <span 
                          className="text-[14px] font-medium"
                          style={{ 
                            color: endDate ? '#232323' : '#6C696980',
                          }}
                        >
                          {endDate ? endDate.format('MMM D, YYYY') : 'End Date'}
                        </span>
                      </div>
                      
                      {showEndCalendar && (
                        <div className="absolute top-full right-0 mt-1 z-50 bg-white rounded-lg shadow-lg border border-[#E5E5E5]">
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateCalendar
                              value={endDate}
                              onChange={(newValue) => {
                                setEndDate(newValue);
                                setShowEndCalendar(false);
                              }}
                              views={['month', 'day']}
                              sx={{
                                '& .MuiPickersCalendarHeader-label': {
                                  fontSize: '1rem',
                                },
                                '& .MuiPickersDay-root.Mui-selected': {
                                  backgroundColor: '#FA660F',
                                  '&:hover': {
                                    backgroundColor: '#FA660F',
                                  },
                                },
                                '& .MuiPickersDay-root.Mui-selected:focus': {
                                  backgroundColor: '#FA660F',
                                },
                                '& .MuiPickersMonth-root.Mui-selected': {
                                  backgroundColor: '#FA660F',
                                  color: '#ffffff',
                                  '&:hover': {
                                    backgroundColor: '#FA660F',
                                  },
                                },
                                '& .MuiPickersMonth-monthButton.Mui-selected': {
                                  backgroundColor: '#FA660F !important',
                                  color: '#ffffff !important',
                                },
                              }}
                            />
                          </LocalizationProvider>
                        </div>
                      )}
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <label className="label" htmlFor="times">Time</label>
                <div className="flex gap-4">
                    <div className="w-[182px]">
                        <Input 
                            type="time" 
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                        />
                    </div>
                    <div className="w-[182px]">
                        <Input 
                            type="time" 
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <label className="label" htmlFor="reason">Reason </label>
                <Input 
                    type="text" 
                    placeholder="e.g., Annual vacation"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                />
            </div>

            {/* <div className="flex flex-col gap-2">
                <label htmlFor="auto">Auto-Reply Message</label>
                <Textarea placeholder="unwell" className="h-[83px]"/>
            </div> */}

            <div className="flex gap-4">
               <button 
                  onClick={onClose}
                  className="w-[182px] h-[42px] border border-[#FA660F] text-[#FA660F] font-semibold text-[14px] rounded-[12px]"
                >
                    Cancel
                </button>
               <button 
                  onClick={handleSubmit}
                  disabled={isSubmitting || isFormIncomplete}
                  className="w-[182px] h-[42px] bg-[#FA660F] text-white font-semibold text-[14px] rounded-[12px] disabled:bg-orange-300 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Scheduling...' : 'Schedule Now'}
               </button>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}