import { useEffect, useMemo, useState } from "react";
import { useAuthStore } from "@/store/AuthStore";
import { getAllAppointments, getOutOfOffice, getCounselorProfileById } from "@/api/counselor-Dashboard";
import CustomCalendar from "@/components/Calendar";
import {
  OutOfOfficeDrawer,
  AppointmentPopup,
  OutOfOfficeCard,
  MyEarningsTab,
  ClientsTab,
  ReviewsTab,
} from "@/components/counselor-dashboard";
import type { Appointment } from "@/types/appointments";
import { SquareChevronLeft, SquareChevronRight, ChevronLeft, ChevronRight, Loader2, Clock, SquarePen, ChevronDown, ChevronUp, Plus } from "lucide-react";
import AppointmentsTab from "@/components/counselor-dashboard/AppointmentsTab";
import CounselorProfile from "@/components/counselor-dashboard/CounselorProfile";
import { useQuery } from "@tanstack/react-query";

type MainTab = "calendar" | "earnings" | "appointments" | "reviews" | "clients";

const TABS: { key: MainTab; name: string }[] = [
  { key: "calendar", name: "My Calendar" },
  { key: "earnings", name: "My Earnings" },
  { key: "appointments", name: "Appointments" },
  { key: "reviews", name: "Reviews" },
  { key: "clients", name: "Clients" },
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
      <h1 className="text-3xl font-bold text-yellow-800 mb-2">
        Application Under Review
      </h1>
      <p className="text-lg text-yellow-700 text-center">
        Thank you for your submission. Our team is currently reviewing your
        details. You will be notified once the verification process is complete.
      </p>
    </div>
  </div>
);

export default function CounselorDashboard() {
  const authUser = useAuthStore((s) => s.user);
  const authLoading = useAuthStore((s) => s.loading);
  const refreshUser = useAuthStore((s) => s.refreshUser);

  const [initialized, setInitialized] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [hours, setHours] = useState<number[]>([]);
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<{
    data: Appointment;
    position: { x: number; y: number; centerY: number };
  } | null>(null);
  const [mainTab, setMainTab] = useState<MainTab>("calendar");
  const [currentDateOffset, setCurrentDateOffset] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<"meetings" | "other">("meetings");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  useEffect(() => {
    const HOUR = Array.from({ length: 12 }, (_, i) => 9 + i); // 9AM–8PM
    setHours(HOUR);
  }, []);

  const token = localStorage.getItem("jwt") ?? "";
  const counsellorId = authUser?.userName || localStorage.getItem("phone") || "";

  useEffect(() => {
    if (!initialized) {
      refreshUser()
        .catch((err) => console.error("Error refreshing user:", err))
        .finally(() => setInitialized(true));
    }
  }, [initialized, refreshUser]);

  const {
    data: counselor,
    isLoading: profileLoading,
    isError: profileError,
  } = useQuery({
    queryKey: ["counselorProfile", counsellorId],
    queryFn: () => getCounselorProfileById(counsellorId!, token),
    enabled: Boolean(counsellorId && token),
  });

  const {
    data: groupedAppointments = {},
    isLoading: appointmentsLoading,
    isError: appointmentsError,
  } = useQuery({
    queryKey: ["counselorAppointmentsGrouped", counsellorId],
    queryFn: () => getAllAppointments(counsellorId!, token),
    enabled: Boolean(counsellorId && token),
  });

  const {
    data: outOfOfficeData = [],
    isLoading: outOfOfficeLoading,
    isError: outOfOfficeError,
  } = useQuery({
    queryKey: ["counselorOutOfOffice", counsellorId],
    queryFn: () => getOutOfOffice(counsellorId!, token),
    enabled: Boolean(counsellorId && token),
  });

  const queriesLoading =
    profileLoading || appointmentsLoading || outOfOfficeLoading;

  const formatDateLocal = (date: Date): string => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const targetDate = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + currentDateOffset);
    return date;
  }, [currentDateOffset]);

  const visibleDates = useMemo(() => {
    const start = new Date();
    start.setDate(start.getDate() + currentDateOffset);
    const dates: string[] = [];
    for (let i = 0; i < GRID_CONFIG.visibleDays; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      dates.push(formatDateLocal(d));
    }
    return dates;
  }, [currentDateOffset]);

  const getDateLabel = () => {
    if (currentDateOffset === 0) return "Today";
    if (currentDateOffset === -1) return "Yesterday";
    if (currentDateOffset === 1) return "Tomorrow";
    return targetDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const formatTime24 = (hour: number): string => {
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:00 ${ampm}`;
  };

  const goToPreviousDay = () => setCurrentDateOffset((p) => p - 1);
  const goToNextDay = () => setCurrentDateOffset((p) => p + 1);

  useEffect(() => {
    const newDate = new Date();
    newDate.setDate(newDate.getDate() + currentDateOffset);
    setSelectedDate(newDate);
  }, [currentDateOffset]);

  const maxApptsPerHour: Record<string, number> = useMemo(() => {
    const maxCounts: Record<string, number> = {};
    visibleDates.forEach((date) => {
      hours.forEach((h) => {
        const key = h.toString().padStart(2, "0") + ":00";
        const appts = (groupedAppointments as any)[date]?.[key] || [];
        maxCounts[key] = Math.max(maxCounts[key] || 0, appts.length);
      });
    });
    return maxCounts;
  }, [groupedAppointments, visibleDates, hours]);

  if (!initialized || authLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-orange-500" />
      </div>
    );
  }

  if (!authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500 text-lg">
          Authentication session ended. Please log in again.
        </p>
      </div>
    );
  }

  if (
    authUser.role?.trim().toLowerCase() !== "counsellor" ||
    !authUser.verified
  ) {
    return <PendingReviewScreen />;
  }

  if (queriesLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-orange-500" />
      </div>
    );
  }

  if (profileError || appointmentsError || outOfOfficeError || !counselor) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500 text-lg">
          Failed to load counselor dashboard. Please try again later.
        </p>
      </div>
    );
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
                  src={
                    counselor.photoUrl ||
                    `https://ui-avatars.com/api/?name=${counselor.firstName}+${counselor.lastName}&background=EBF4FF&color=0D47A1`
                  }
                  alt={`${counselor.firstName} ${counselor.lastName}`}
                  onError={(e) => {
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${counselor.firstName}+${counselor.lastName}&background=EBF4FF&color=0D47A1`;
                  }}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 mt-4 md:mt-0 md:ml-6 md:pt-6 flex flex-col items-center md:items-start">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl md:text-2xl font-semibold text-[#343C6A] leading-tight">
                    {counselor.firstName} {counselor.lastName}
                  </h1>
                  <button
                    onClick={() => setProfileModalOpen(true)}
                    className="text-[#343C6A] hover:text-blue-800 transition-colors md:hidden"
                  >
                    <SquarePen size={20} />
                  </button>
                </div>

                <p className="text-sm md:text-lg text-[#718EBF] font-medium">
                  Career Counselor
                </p>
              </div>
            </div>

            <div className="mt-4 md:mt-0 md:pt-6">
              <button
                onClick={() => setProfileModalOpen(true)}
                className="hidden md:flex items-center justify-center gap-2 py-2.5 px-4 bg-white border border-[#343C6A] rounded-xl text-[#343C6A] font-medium text-base hover:bg-gray-100 transition-colors shadow-sm whitespace-nowrap"
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
            <nav className="flex space-x-6 -mb-px" aria-label="Tabs">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setMainTab(tab.key)}
                  className={`${
                    mainTab === tab.key
                      ? "border-[#13097D] text-[#13097D]"
                      : "border-transparent text-[#8C8CA1] hover:text-gray-700 hover:border-gray-300"
                  } whitespace-nowrap py-3 px-2 border-b-[3px] font-semibold text-[12px] md:text-sm transition-colors flex-shrink-0`}
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
          {mainTab === "calendar" && (
            <>
              <div className="w-full bg-white h-auto lg:h-[658px] rounded-[16px] hidden lg:grid grid-cols-1 lg:grid-cols-[351px_1fr] border border-[#EFEFEF]">
                <div className="border-b lg:border-b-0 lg:border-r border-[#EDEDED] p-4 flex flex-col">
                  <h1 className="font-semiBold text-[20px] text-[#13097D] mb-2">
                    Calendar
                  </h1>
                  <div className="flex-shrink-0">
                    <CustomCalendar
                      value={selectedDate}
                      onChange={(date: Date) => {
                        setSelectedDate(date);
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        const selected = new Date(date);
                        selected.setHours(0, 0, 0, 0);
                        const diffDays = Math.floor(
                          (selected.getTime() - today.getTime()) /
                            (1000 * 60 * 60 * 24)
                        );
                        setCurrentDateOffset(diffDays);
                      }}
                    />
                  </div>
                  <div className="mt-4">
                    <hr className="w-[311px] bg-[#f5f5f7] h-px" />
                  </div>
                  <div className="flex justify-between mt-4">
                    <div className="flex gap-2">
                      <img src="/cup.svg" alt="" />
                      <h1 className="text-[16px] text-[#13097D] font-semibold">
                        Add Out of Office
                      </h1>
                    </div>
                    <ChevronRight
                      size={24}
                      className="text-[#13097D] cursor-pointer"
                      onClick={() => setDrawerOpen(true)}
                    />
                  </div>
                </div>

                <div className="flex flex-col overflow-hidden h-[600px] lg:h-auto">
                  <div className="flex py-4 px-4 items-center gap-6 flex-shrink-0">
                    <h1 className="text-[#13097D] font-semibold text-[16px]">
                      {getDateLabel()}
                    </h1>
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
                        onClick={() => setActiveTab("meetings")}
                        className={`px-4 py-2 text-sm font-medium transition-all relative ${
                          activeTab === "meetings"
                            ? "text-[#13097D]"
                            : "text-[#718EBF] hover:text-[#343C6A]"
                        }`}
                      >
                        Meetings
                        {activeTab === "meetings" && (
                          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#13097D]" />
                        )}
                      </button>
                      <button
                        onClick={() => setActiveTab("other")}
                        className={`px-4 py-2 text-sm font-medium transition-all relative ${
                          activeTab === "other"
                            ? "text-[#13097D]"
                            : "text-[#718EBF] hover:text-[#343C6A]"
                        }`}
                      >
                        Out of office
                        {activeTab === "other" && (
                          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#13097D]" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto overflow-x-auto scrollbar-hide">
                    {activeTab === "meetings" ? (
                      <>
                        <div
                          className="border-b border-[#EDEDED]"
                          style={{ marginRight: "16px" }}
                        />
                        <div className="flex" style={{ paddingRight: "16px" }}>
                          <div
                            className="border-r border-[#EDEDED] flex-shrink-0"
                            style={{ width: GRID_CONFIG.timeColumnWidth }}
                          >
                            <div
                              style={{ height: GRID_CONFIG.headerHeight }}
                              className="border-b border-[#EDEDED]"
                            ></div>
                            {hours.map((h) => {
                              const hourKey =
                                h.toString().padStart(2, "0") + ":00";
                              const rowHeight =
                                GRID_CONFIG.slotHeight *
                                Math.max(1, maxApptsPerHour[hourKey]);
                              return (
                                <div
                                  key={h}
                                  className="border-b border-[#EDEDED] relative text-xs text-[#13097D] font-medium flex items-start justify-end"
                                  style={{
                                    height: rowHeight,
                                    paddingRight: "18px",
                                    paddingTop: "25px",
                                  }}
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
                              style={{
                                minWidth: GRID_CONFIG.dayColumnMinWidth,
                              }}
                            >
                              <div
                                className={`border-b border-[#EDEDED] flex flex-col items-center justify-center ${
                                  dateIndex === 0 ? "bg-[#13097D1A]" : ""
                                }`}
                                style={{ height: GRID_CONFIG.headerHeight }}
                              >
                                <span className="text-xs text-[#718EBF] font-medium">
                                  {new Date(date).toLocaleDateString("en-US", {
                                    weekday: "short",
                                  })}
                                </span>
                                <span className="text-base font-medium text-[#13097D]">
                                  {new Date(date).toLocaleDateString("en-US", {
                                    day: "2-digit",
                                  })}
                                </span>
                              </div>

                              {hours.map((h) => {
                                const hourKey =
                                  h.toString().padStart(2, "0") + ":00";
                                const appts: Appointment[] =
                                  groupedAppointments[date]?.[hourKey] || [];
                                const rowHeight =
                                  GRID_CONFIG.slotHeight *
                                  Math.max(1, maxApptsPerHour[hourKey]);

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
                                        style={{
                                          height: GRID_CONFIG.slotHeight,
                                        }}
                                      >
                                        {i > 0 && dateIndex === 0 && (
                                          <div
                                            className="absolute top-0 z-10"
                                            style={{
                                              left: -GRID_CONFIG.timeColumnWidth,
                                              width: `calc(${
                                                GRID_CONFIG.timeColumnWidth
                                              }px + ${
                                                GRID_CONFIG.dayColumnMinWidth *
                                                visibleDates.length
                                              }px + 16px)`,
                                              borderTop: "2px dashed #EDEDED",
                                            }}
                                          />
                                        )}

                                        <div
                                          onClick={(e) => {
                                            const rect =
                                              e.currentTarget.getBoundingClientRect();
                                            setSelectedAppointment({
                                              data: a,
                                              position: {
                                                x: rect.left,
                                                y: rect.top,
                                                centerY:
                                                  rect.top + rect.height / 2,
                                              },
                                            });
                                          }}
                                          className="absolute bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col justify-center px-4 cursor-pointer hover:shadow-md transition-shadow"
                                          style={{
                                            width:
                                              GRID_CONFIG.appointmentWidth,
                                            height:
                                              GRID_CONFIG.appointmentHeight,
                                            left: GRID_CONFIG.appointmentPaddingHorizontal,
                                            top: GRID_CONFIG.appointmentPaddingVertical,
                                            border: "1px solid #3537B4",
                                            borderLeft: "6px solid #3537B4",
                                            borderRadius: "16px",
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
                      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
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

              {/* mobile view*/}
              <div className="block lg:hidden w-full relative">
                <div className="w-full max-w-[335px] h-[39px] mx-auto p-1 bg-white rounded-[16px] flex items-center justify-around shadow">
                  <button
                    onClick={() => setActiveTab("meetings")}
                    className={`flex-1 rounded-[24px] py-1 px-4 text-center text-[12px] transition-all ${
                      activeTab === "meetings"
                        ? "bg-[#E8E7F2] text-[#13097D] font-semibold"
                        : "bg-transparent text-[#8C8CA1] font-medium"
                    }`}
                  >
                    Meetings
                  </button>
                  <button
                    onClick={() => setActiveTab("other")}
                    className={`flex-1 rounded-[24px] py-1 px-4 text-center text-[12px] transition-all ${
                      activeTab === "other"
                        ? "bg-[#E8E7F2] text-[#13097D] font-semibold"
                        : "bg-transparent text-[#8C8CA1] font-medium"
                    }`}
                  >
                    Out of office
                  </button>
                </div>

                <div className="mt-6">
                  {activeTab === "meetings" ? (
                    <MobileMeetingsView
                      selectedDate={selectedDate}
                      setSelectedDate={setSelectedDate}
                      setCurrentDateOffset={setCurrentDateOffset}
                      groupedAppointments={groupedAppointments}
                      onAppointmentClick={(appt) => {
                        setSelectedAppointment({
                          data: appt,
                          position: { x: 0, y: 0, centerY: 0 }, 
                        });
                      }}
                    />
                  ) : (
                    <div className="p-1 space-y-4">
                      {outOfOfficeData.map((ooo) => (
                        <OutOfOfficeCard key={ooo.id} outOfOffice={ooo} />
                      ))}
                      {outOfOfficeData.length === 0 && (
                        <div className="text-center text-[#6C6969] text-sm py-8 bg-white rounded-lg p-4">
                          No out of office periods scheduled
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setDrawerOpen(true)}
                  className="fixed bottom-24 right-6 w-14 h-14 bg-[#13097D] rounded-full flex items-center justify-center shadow-lg z-40"
                >
                  <Plus size={28} className="text-white" />
                </button>
              </div>
            </>
          )}

          {mainTab === "earnings" && (
            <MyEarningsTab user={authUser} token={token} />
          )}
          {mainTab === "appointments" && (
            <AppointmentsTab user={authUser} token={token} />
          )}
          {mainTab === "reviews" && <ReviewsTab user={authUser} token={token} />}
          {mainTab === "clients" && (
            <ClientsTab user={authUser} token={token} />
          )}
        </div>
      </div>

      <OutOfOfficeDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        user={authUser}
        token={token}
      />

      {selectedAppointment && (
        <AppointmentPopup
          appointment={selectedAppointment.data}
          position={selectedAppointment.position}
          onClose={() => setSelectedAppointment(null)}
          user={authUser}
          token={token}
        />
      )}

      {isProfileModalOpen && authUser.userName && (
        <CounselorProfile
          isOpen={isProfileModalOpen}
          onClose={() => setProfileModalOpen(false)}
          user={authUser}
          token={token}
        />
      )}
    </div>
  );
}

const getWeekDays = (startDate: Date) => {
  const days = [];
  const start = new Date(startDate);
  start.setDate(start.getDate() - start.getDay());
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    days.push(d);
  }
  return days;
};
const dayLabels = ["S", "M", "T", "W", "T", "F", "S"];

const MobileMeetingsView = ({
  selectedDate,
  setSelectedDate,
  setCurrentDateOffset,
  groupedAppointments,
  onAppointmentClick,
}: {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  setCurrentDateOffset: (offset: number | ((prev: number) => number)) => void;
  groupedAppointments: Record<string, Record<string, Appointment[]>>;
  onAppointmentClick: (appointment: Appointment) => void;
}) => {
  const [isMonthViewOpen, setIsMonthViewOpen] = useState(false);

  const currentWeekStart = useMemo(() => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() - date.getDay());
    return date;
  }, [selectedDate]);

  const weekDays = getWeekDays(currentWeekStart);

  const selectedDateString = selectedDate.toISOString().split("T")[0];
  const appointmentsForDay: Appointment[] = groupedAppointments[
    selectedDateString
  ]
    ? Object.values(groupedAppointments[selectedDateString]).flat()
    : [];

  const changeWeek = (direction: "prev" | "next") => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + (direction === "prev" ? -7 : 7));
    handleDateSelect(newDate);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selected = new Date(date);
    selected.setHours(0, 0, 0, 0);
    const diffDays = Math.floor(
      (selected.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
    setCurrentDateOffset(diffDays);
  };

  const formatTime = (timeStr: string) => {
  if (!timeStr || !timeStr.includes(':')) {
    return "Invalid Time";
  }

  const [hours, minutes] = timeStr.split(':');
  const hour = parseInt(hours, 10);

  if (isNaN(hour) || isNaN(parseInt(minutes, 10))) {
      return "Invalid Time";
  }

  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;

  return `${displayHour}:${minutes} ${ampm}`;
};

  return (
    <div className="w-full bg-white rounded-[16px] p-4 border border-[#EFEFEF] shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-base text-[#13097D]">This Week</h3>
        <div className="flex items-center gap-2">
          <button
          onClick={() => changeWeek("prev")}
          className="rounded-lg"
        >
          <SquareChevronLeft 
            size={24} 
            fill="#A49E9B"
            color="white"
            strokeWidth={2}
          />
        </button>
          <button
          onClick={() => changeWeek("next")}
          className="rounded-lg"
        >
          <SquareChevronRight 
            size={24} 
            fill="#FA660F"
            color="white"
            strokeWidth={2}
          />
        </button>
        </div>
      </div>

      {isMonthViewOpen ? (
        <div className="mt-0">
          <CustomCalendar
            value={selectedDate}
            onChange={(date: Date) => {
              handleDateSelect(date);
              setIsMonthViewOpen(false);
            }}
          />
        </div>
      ) : (
        <div className="flex justify-between mb-4">
          {weekDays.map((day, index) => {
            const isSelected =
              day.toDateString() === selectedDate.toDateString();
            return (
              <div key={index} className="flex flex-col items-center gap-2">
                <span className="text-xs font-medium text-gray-500">
                  {dayLabels[index]}
                </span>
                <button
                  onClick={() => handleDateSelect(day)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm
                    ${
                      isSelected
                        ? "bg-[#FA660F] text-white"
                        : "bg-transparent text-gray-800 hover:bg-gray-100"
                    }
                  `}
                >
                  {day.getDate()}
                </button>
              </div>
            );
          })}
        </div>
      )}

      <div
        className="w-full p-2 h-7 bg-[#F9FAFB] border border-[#EFEFEF] rounded-[8px] flex justify-center items-center cursor-pointer"
        onClick={() => setIsMonthViewOpen(!isMonthViewOpen)}
      >
        {isMonthViewOpen ? (
          <ChevronUp size={20} className="text-[#13097D]" />
        ) : (
          <ChevronDown size={20} className="text-[#13097D]" />
        )}
      </div>

      <div className="mt-4 space-y-2">
        {appointmentsForDay.length > 0 ? (
          appointmentsForDay.map((appt) => (
            <div
              key={appt.appointmentId}
              className="w-full h-10 bg-[#F9FAFB] rounded-[8px] px-3 py-2 flex items-center justify-between cursor-pointer"
              onClick={() => onAppointmentClick(appt)}
            >
              <div className="flex items-center gap-3">
                <div className="flex flex-col text-left">
                  <span className="text-[10px] text-gray-700 font-medium">
                    {formatTime(appt.startTime)}
                  </span>
                  <span className="text-[8px] text-gray-500">30 min</span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {appt.userFullName}
                </span>
              </div>
              <ChevronRight size={16} className="text-[#FA660F]" />
            </div>
          ))
        ) : (
          <p className="text-center text-sm text-gray-500 pt-4">
            No meetings scheduled for this day.
          </p>
        )}
      </div>
    </div>
  );
};