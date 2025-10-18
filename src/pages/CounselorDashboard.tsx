import { useEffect, useMemo, useState } from "react";
import { useAuthStore } from "@/store/AuthStore";
import { getAllAppointments, getOutOfOffice } from "@/api/counselor-Dashboard";
import CustomCalendar from "@/components/Calendar";
import { 
  OutOfOfficeDrawer, 
  AppointmentPopup, 
  OutOfOfficeCard,
  MyEarningsTab,
  ClientsTab,
  ReviewsTab
} from "@/components/counselor-dashboard";
import type { GroupedAppointments, OutOfOffice, Appointment } from "@/types/appointments";
import { ChevronLeft, ChevronRight, Loader2, Clock, SquarePen } from "lucide-react";
import AppointmentsTab from "@/components/counselor-dashboard/AppointmentsTab";
import CounselorProfile from "@/components/counselor-dashboard/CounselorProfile";

type MainTab = 'calendar' | 'earnings' | 'appointments' | 'reviews' | 'clients';

const TABS: { key: MainTab, name: string }[] = [
    { key: 'calendar', name: 'My Calendar' },
    { key: 'earnings', name: 'My Earnings' },
    { key: 'appointments', name: 'Appointments' },
    { key: 'reviews', name: 'Reviews' },
    { key: 'clients', name: 'Clients' },
];

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

const PendingReviewScreen = () => (
  <div className="flex items-center justify-center h-screen p-4">
    <div className="flex flex-col items-center justify-center p-8 bg-yellow-50 rounded-lg max-w-lg">
        <Clock className="w-16 h-16 text-yellow-500 mb-4" />
        <h1 className="text-3xl font-bold text-yellow-800 mb-2">Application Under Review</h1>
        <p className="text-lg text-yellow-700 text-center">
        Thank you for your submission. Our team is currently reviewing your details. You will be notified once the verification process is complete.
        </p>
    </div>
  </div>
);

export default function CounselorDashboard() {
  const { user, refreshUser, loading } = useAuthStore();
  const token = localStorage.getItem('jwt') ?? '';
  
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [hours, setHours] = useState<number[]>([]);
  const [appointments, setAppointments] = useState<GroupedAppointments>({});
  const [outOfOfficeData, setOutOfOfficeData] = useState<OutOfOffice[]>([]);
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<{ data: Appointment; position: { x: number; y: number; centerY: number }; } | null>(null);
  const [mainTab, setMainTab] = useState<MainTab>('calendar');
  const [currentDateOffset, setCurrentDateOffset] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'meetings' | 'other'>('meetings');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  useEffect(() => {
    refreshUser(true);
}, []);

  const fetchData = async () => {
    const counsellorId = user?.userName;
    if (!counsellorId || !token) return;

    try {
      const [fetchedAppointments, fetchedOutOfOffice] = await Promise.all([
        getAllAppointments(counsellorId, token),
        getOutOfOffice(counsellorId, token)
      ]);
      setAppointments(fetchedAppointments ?? {});
      setOutOfOfficeData(fetchedOutOfOffice ?? []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const HOUR = Array.from({ length: 12 }, (_, i) => 9 + i);
    setHours(HOUR);
    
    if (user?.role?.trim() === 'counsellor') {
      fetchData();
    }
  }, [user]);

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

  const maxApptsPerHour: Record<string, number> = useMemo(() => {
    const maxCounts: Record<string, number> = {};
    visibleDates.forEach((date) => {
        hours.forEach((h) => {
            const hourKey = h.toString().padStart(2, "0") + ":00";
            const count = (appointments[date]?.[hourKey] || []).length;
            maxCounts[hourKey] = Math.max(maxCounts[hourKey] || 0, count);
        });
    });
    return maxCounts;
  }, [appointments, visibleDates, hours]);
  

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-orange-500" />
      </div>
    );
  }

  if (user.role?.trim() !== 'counsellor' || !user.verified) {
    return <PendingReviewScreen />;
  }  
  return (
    <div className="w-full bg-[#F5F5F7] px-4 sm:px-6 lg:px-8 mt-16 sm:mt-20 flex flex-col items-center">
      <div className="w-full max-w-[1200px] rounded-xl">
  <div className="h-32 md:h-56 bg-gray-200 rounded-t-xl">
    <img
      src="https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=2070&auto.format&fit=crop"
      alt="University Banner"
      className="w-full h-full object-cover rounded-t-xl"
    />
  </div>

  <div className="px-4 md:px-10 pb-6">
    <div className="relative flex flex-col items-center md:flex-row md:justify-between md:items-start">
      <div className="flex flex-col md:flex-row items-center md:items-start w-full">
        <div className="flex-shrink-0 w-32 h-32 md:w-48 md:h-48 rounded-full border-[4px] border-white bg-gray-300 overflow-hidden shadow-lg -mt-16 md:-mt-24">
          <img
            src={user.photo || `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=EBF4FF&color=0D47A1`}
            alt={`${user.firstName} ${user.lastName}`}
            className="w-full h-full object-cover"
            onError={(e) => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=EBF4FF&color=0D47A1`; }}
          />
        </div>
        
        <div className="mt-4 md:mt-0 md:ml-6 md:pt-6 flex flex-col items-center md:items-start">
          <h1 className="text-xl md:text-2xl font-semibold text-[#343C6A] leading-tight">
            {user.firstName} {user.lastName}
          </h1>
          <p className="text-sm md:text-lg text-[#718EBF] font-medium">
            Career Counselor
          </p>
        </div>
      </div>

      <div className="mt-4 md:mt-0 md:pt-6">
        <button 
          onClick={() => setProfileModalOpen(true)}
          className="flex items-center justify-center gap-2 py-2.5 px-4 bg-white border border-[#343C6A] rounded-xl text-[#343C6A] font-medium text-base hover:bg-gray-100 transition-colors shadow-sm whitespace-nowrap"
        >
          <SquarePen size={20} />
          <span>View Profile</span>
        </button>
      </div>
    </div>
  </div>
</div>

      <div className="w-full max-w-[1200px]">
        <div className="border-b border-gray-200">
          <div className="overflow-x-auto scrollbar-hide">
            <nav className="flex space-x-4 sm:space-x-8 -mb-px" aria-label="Tabs">
                {TABS.map((tab) => (
                <button
                    key={tab.key}
                    onClick={() => setMainTab(tab.key)}
                    className={`${
                    mainTab === tab.key
                        ? 'border-[#13097D] text-[#13097D]'
                        : 'border-transparent text-[#8C8CA1] hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-semibold text-lg transition-colors`}
                >
                    {tab.name}
                </button>
                ))}
            </nav>
            </div>
        </div>
      </div>

      <div className="w-full max-w-[1200px] mt-8 mb-16">
        <div>
          {mainTab === 'calendar' && (
              <div className="w-full bg-white h-auto rounded-[16px] grid grid-cols-1 lg:grid-cols-[351px_1fr] border border-[#EFEFEF]">
                  <div className="border-b lg:border-b-0 lg:border-r border-[#EDEDED] p-4 flex flex-col">
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
                      <div className="flex justify-between mt-4">
                          <div className="flex gap-2">
                          <img src="/cup.svg" alt="" />
                          <h1 className="text-[16px] text-[#13097D] font-semibold">Add Out of Office</h1>
                          </div>
                          <ChevronRight size={24} className="text-[#13097D] cursor-pointer" onClick={() => setDrawerOpen(true)} />
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
                          <div className="p-4 grid grid-cols-2 gap-4">
                              {outOfOfficeData.map((ooo) => (
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
          )}
          {mainTab === 'earnings' && <MyEarningsTab user={user} token={token}/>}
          {mainTab === 'appointments' && <AppointmentsTab user={user} token={token}/>}
          {mainTab === 'reviews' && <ReviewsTab user={user} token={token}/>}
          {mainTab === 'clients' && <ClientsTab user={user} token={token}/>}
        </div>
      </div>

      <OutOfOfficeDrawer 
  open={drawerOpen} 
  onClose={() => {
    setDrawerOpen(false);
    fetchData();
  }} 
  user={user} 
  token={token}
/>

      {selectedAppointment && (
        <AppointmentPopup 
          appointment={selectedAppointment.data}
          position={selectedAppointment.position}
          onClose={() => setSelectedAppointment(null)}
          onAppointmentUpdate={fetchData}
          user={user} 
          token={token}
        />
      )}

      {isProfileModalOpen && user.userName && (
        <CounselorProfile 
          isOpen={isProfileModalOpen}
          onClose={() => setProfileModalOpen(false)}
          user={user}
          token={token}
        />
      )}
    </div>
  );
}