import { getAllAppointments, getOutOfOffice } from "@/api/counselor-Dashboard";
import CustomCalendar from "@/components/Calendar";
import OutOfOfficeDrawer from "@/components/counselor-dashboard/OutOfOfficeDrawer";
import AppointmentPopup from "@/components/counselor-dashboard/AppointmentPopup";
import type { GroupedAppointments, OutOfOffice, Appointment } from "@/types/appointments";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { OutOfOfficeCard } from "@/components/counselor-dashboard/OutOfOfficeCard";

export default function CounselorDashboard() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [hours, setHours] = useState<number[]>([]);
  const [appointments, setAppointments] = useState<GroupedAppointments>({});
  const [outOfOfficeData, setOutOfOfficeData] = useState<OutOfOffice[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<{
    data: Appointment;
    position: { x: number; y: number; centerY: number };
  } | null>(null);
  
  const GRID_CONFIG = {
    visibleDays: 4,
    timeColumnWidth: 84,
    dayColumnMinWidth: 189,
    headerHeight: 48,
    slotHeight: 80,
    appointmentWidth: 157,
    appointmentHeight: 56,
    appointmentPaddingHorizontal: 16,
    appointmentPaddingVertical: 12,
  };

  const [currentDateOffset, setCurrentDateOffset] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'meetings' | 'other'>('meetings');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  useEffect(() => {
    async function fetchData() {
      try {
        const [fetchedAppointments, fetchedOutOfOffice] = await Promise.all([
          getAllAppointments("9470988669"),
          getOutOfOffice("9470988669")
        ]);
        setAppointments(fetchedAppointments ?? {});
        setOutOfOfficeData(fetchedOutOfOffice ?? []);
      } catch (err) {
        console.error(err);
      }
    }

    const HOUR = Array.from({ length: 12 }, (_, i) => 9 + i);
    setHours(HOUR);

    fetchData();
  }, []);

  const formatDateLocal = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const visibleDates = useMemo(() => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + currentDateOffset);
    
    const dates: string[] = [];
    for (let i = 0; i < GRID_CONFIG.visibleDays; i++) {
      const date = new Date(targetDate);
      date.setDate(date.getDate() + i);
      dates.push(formatDateLocal(date));
    }
    return dates;
  }, [currentDateOffset, GRID_CONFIG.visibleDays]);

  const targetDate = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + currentDateOffset);
    return date;
  }, [currentDateOffset]);

  const getDateLabel = () => {
    if (currentDateOffset === 0) return "Today";
    if (currentDateOffset === -1) return "Yesterday";
    if (currentDateOffset === 1) return "Tomorrow";
    return targetDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const formatTime24 = (hour: number): string => {
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:00 ${ampm}`;
  };

  const goToPreviousDay = () => setCurrentDateOffset(prev => prev - 1);
  const goToNextDay = () => setCurrentDateOffset(prev => prev + 1);

  useEffect(() => {
    const newDate = new Date();
    newDate.setDate(newDate.getDate() + currentDateOffset);
    setSelectedDate(newDate);
  }, [currentDateOffset]);

  const maxApptsPerHour: Record<string, number> = {};
  visibleDates.forEach((date) => {
    hours.forEach((h) => {
      const hourKey = h.toString().padStart(2, "0") + ":00";
      const count = (appointments[date]?.[hourKey] || []).length;
      maxApptsPerHour[hourKey] = Math.max(maxApptsPerHour[hourKey] || 0, count);
    });
  });

  return (
    <div className="w-full bg-[#F5F5F7] px-32 mt-20 flex flex-col items-center pb-20">
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
            <div className="h-[3px] w-[128px] bg-[#13097D] rounded-t-[2px]"></div>
          </li>
          <li>My Earnings</li>
          <li>Appointments</li>
          <li>Reviews</li>
          <li>Clients</li>
        </ul>
        <hr className="w-[1200px] bg-[#E5E5E5] h-px mb-5" />
      </div>

      <div className="w-[1221px] bg-white h-[658px] rounded-[16px] grid grid-cols-[351px_870px] border border-[#EFEFEF]">
        <div className="border-r border-r-[#EDEDED] p-4 flex flex-col">
          <h1 className="font-semiBold text-[20px] text-[#13097D] mb-2">Calendar</h1>
          <div className="flex-shrink-0">
            <CustomCalendar value={selectedDate} onChange={(date: Date) => {
              setSelectedDate(date);
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              const selected = new Date(date);
              selected.setHours(0, 0, 0, 0);
              const diffDays = Math.floor((selected.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
              setCurrentDateOffset(diffDays);
            }} />
          </div>
          <div className="mt-4">
            <hr className="w-[311px] bg-[#f5f5f7] h-px" />
          </div>
          <div onClick={() => setDrawerOpen(true)}  className="flex cursor-pointer justify-between mt-4">
            <div  className="flex gap-2">
              <img src="/cup.svg" alt="" />
              <h1 className="text-[16px] text-[#13097D] font-semibold">Add Out of Office</h1>
            </div>
            <ChevronRight size={24} className="text-[#13097D] cursor-pointer"/>
          </div>
        </div>

        <div className="flex flex-col overflow-hidden">
          <div className="flex py-4 px-4 items-center gap-6 flex-shrink-0">
            <h1 className="text-[#13097D] font-semibold text-[16px]">{getDateLabel()}</h1>
            <div className="flex items-center gap-2">
              <button
                onClick={goToPreviousDay}
                className="p-1.5 rounded-lg hover:bg-[#F9FAFB] transition-colors cursor-pointer"
              >
                <ChevronLeft size={18} className="text-[#718EBF]" />
              </button>
              <button
                onClick={goToNextDay}
                className="p-1.5 rounded-lg hover:bg-[#F9FAFB] transition-colors cursor-pointer"
              >
                <ChevronRight size={18} className="text-[#ff660a]" />
              </button>
            </div>
            
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveTab('meetings')}
                className={`px-4 py-2 text-sm font-medium transition-all relative ${
                  activeTab === 'meetings'
                    ? 'text-[#13097D]'
                    : 'text-[#718EBF] hover:text-[#343C6A]'
                }`}
              >
                Meetings
                {activeTab === 'meetings' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#13097D]" />
                )}
              </button>
              <button
                onClick={() => setActiveTab('other')}
                className={`px-4 py-2 text-sm font-medium transition-all relative ${
                  activeTab === 'other'
                    ? 'text-[#13097D]'
                    : 'text-[#718EBF] hover:text-[#343C6A]'
                }`}
              >
                Out of office
                {activeTab === 'other' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#13097D]" />
                )}
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto overflow-x-auto scrollbar-hide">
            {activeTab === 'meetings' ? (
              <>
                <div 
                  className="border-b border-[#EDEDED]" 
                  style={{ marginRight: '16px' }}
                />
                
                <div className="flex" style={{ paddingRight: '16px' }}>
                <div 
                  className="border-r border-[#EDEDED] flex-shrink-0"
                  style={{ width: GRID_CONFIG.timeColumnWidth }}
                >
                  <div style={{ height: GRID_CONFIG.headerHeight }} className="border-b border-[#EDEDED]"></div>
                  {hours.map((h) => {
                    const hourKey = h.toString().padStart(2, "0") + ":00";
                    const rowHeight = GRID_CONFIG.slotHeight * Math.max(1, maxApptsPerHour[hourKey]);
                    return (
                      <div
                        key={h}
                        className="border-b border-[#EDEDED] relative text-xs text-[#13097D] font-medium flex items-start justify-end"
                        style={{ height: rowHeight, paddingRight: '18px', paddingTop: '25px' }}
                      >
                        {formatTime24(h)}
                      </div>
                    );
                  })}
                </div>

                {visibleDates.map((date, dateIndex) => (
                  <div 
                    key={date} 
                    className="flex-1 border-l border-[#EDEDED]"
                    style={{ minWidth: GRID_CONFIG.dayColumnMinWidth }}
                  >
                    <div 
                      className={`border-b border-[#EDEDED] flex flex-col items-center justify-center ${dateIndex === 0 ? 'bg-[#13097D1A]' : ''}`}
                      style={{ height: GRID_CONFIG.headerHeight }}
                    >
                      <span className="text-xs text-[#718EBF] font-medium">
                        {new Date(date).toLocaleDateString("en-US", { weekday: "short" })}
                      </span>
                      <span className="text-base font-medium text-[#13097D]">
                        {new Date(date).toLocaleDateString("en-US", { day: "2-digit" })}
                      </span>
                    </div>

                    {hours.map((h) => {
                      const hourKey = h.toString().padStart(2, "0") + ":00";
                      const appts = appointments[date]?.[hourKey] || [];
                      const rowHeight = GRID_CONFIG.slotHeight * Math.max(1, maxApptsPerHour[hourKey]);

                      return (
                        <div 
                          key={h} 
                          className="relative border-b border-[#EDEDED]" 
                          style={{ height: rowHeight }}
                        >
                          {appts.map((a, i) => (
                            <div 
                              key={a.appointmentId} 
                              className="relative" 
                              style={{ height: GRID_CONFIG.slotHeight }}
                            >
                              {i > 0 && dateIndex === 0 && (
                                <div 
                                  className="absolute top-0 z-10" 
                                  style={{ 
                                    left: -GRID_CONFIG.timeColumnWidth,
                                    width: `calc(${GRID_CONFIG.timeColumnWidth}px + ${GRID_CONFIG.dayColumnMinWidth * visibleDates.length}px + 16px)`,
                                    borderTop: '2px dashed #EDEDED',
                                    backgroundImage: 'repeating-linear-gradient(to right, #EDEDED 0px, #EDEDED 14px, transparent 14px, transparent 28px)',
                                    backgroundSize: '28px 2px',
                                    backgroundPosition: 'top',
                                    backgroundRepeat: 'repeat-x',
                                    height: '2px',
                                  }}
                                />
                              )}
                              
                              <div 
                                onClick={(e) => {
                                  const rect = e.currentTarget.getBoundingClientRect();
                                  setSelectedAppointment({
                                    data: a,
                                    position: {
                                      x: rect.left,
                                      y: rect.top,
                                      centerY: rect.top + rect.height / 2,
                                    }
                                  });
                                }}
                                className="absolute bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col justify-center px-4 cursor-pointer hover:shadow-md transition-shadow"
                                style={{
                                  width: GRID_CONFIG.appointmentWidth,
                                  height: GRID_CONFIG.appointmentHeight,
                                  left: GRID_CONFIG.appointmentPaddingHorizontal,
                                  top: GRID_CONFIG.appointmentPaddingVertical,
                                  border: '1px solid #3537B4',
                                  borderLeft: '6px solid #3537B4',
                                  borderRadius: '16px',
                                }}
                              >
                                <div className="text-sm font-medium text-black truncate">
                                  {a.userFullName}
                                </div>
                                <div className="text-xs font-normal text-[#718EBF] mt-0.5">
                                  {a.userCourse}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
              </>
            ) : (
              <div className="p-4 space-y-4 max-h-[calc(4*120px)] overflow-y-auto scrollbar-hide">
                {outOfOfficeData.slice(0, 4).map((ooo) => (
                  <OutOfOfficeCard key={ooo.id} outOfOffice={ooo} />
                ))}
                {outOfOfficeData.length === 0 && (
                  <div className="text-center text-[#6C6969] text-sm py-8">
                    No out of office periods scheduled
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <OutOfOfficeDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} counselor={"id_here"} />

      {selectedAppointment && (
        <AppointmentPopup 
          appointment={selectedAppointment.data}
          position={selectedAppointment.position}
          onClose={() => setSelectedAppointment(null)}
        />
      )}
    </div>
  );
}
