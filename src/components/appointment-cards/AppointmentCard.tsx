import { CalendarDays, ChevronLeft, Star } from "lucide-react";
import { Button } from "../ui";
import { useState, useEffect, useCallback, type JSX } from "react";
import type { AllCounselor, CounselorDetails } from "@/types/academic";
import MorningSlots from "./MorningSlots";
import AfterNoonSlots from "./AfterNoonSlots";
import EveningSlots from "./EveningSlots";
import { Calendar } from "../ui/calendar";
import { useAuthStore } from '@/store/AuthStore';
import { academicApi } from '@/api/academic';
import { useNavigate } from 'react-router-dom';

interface Props {
  counselor: AllCounselor | CounselorDetails;
}

export default function AppointmentCard({ counselor }: Props): JSX.Element {
  const fullName = counselor.firstName + "" + counselor.lastName;
  const imageUrl =
    counselor.photoUrlSmall ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      fullName
    )}&background=E0E7FF&color=4F46E5&size=128`;
  const rating = counselor.rating;


  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [openSection, setOpenSection] = useState<"morning" | "afternoon" | "evening" | null>("morning");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [calendarOpen, setCalendarOpen] = useState<boolean>(false);
  const { userId } = useAuthStore();

  // non-availability map: YYYY-MM-DD -> Set of slot start minutes (minutes since midnight)
  const [nonAvailabilityMap, setNonAvailabilityMap] = useState<Record<string, Set<number>>>({});
  const [unavailableDays, setUnavailableDays] = useState<Set<string>>(new Set());

  // helper: get full weekday name from Date
  const weekdayName = (d: Date) =>
    d.toLocaleDateString(undefined, { weekday: "long" });

  // counselor.workingDays may be present on either type
  const counselorWorkingDays: string[] = (
    counselor && 'workingDays' in counselor && Array.isArray(counselor.workingDays)
  )
    ? (counselor.workingDays as string[])
    : [];
  const workingDaysSet = new Set(counselorWorkingDays.map((s) => s));

  const isWorkingDay = (d: Date) => {
    if (!counselorWorkingDays || counselorWorkingDays.length === 0) return true; // assume all days if not provided
    return workingDaysSet.has(weekdayName(d));
  };

  // get next N working dates starting at base (inclusive)
  const getNextNWorkingDates = (base: Date, n: number) => {
    const out: Date[] = [];
    const cursor = new Date(base);
    while (out.length < n) {
      if (isWorkingDay(cursor)) out.push(new Date(cursor));
      cursor.setDate(cursor.getDate() + 1);
    }
    return out;
  };

  // parse time strings like '9:00', '09:00', '9:00 AM' into a Date on given base
  const parseTimeOnDate = (base: Date, timeStr: string) => {
    if (!timeStr) return null;
    const t = timeStr.trim();
    const ampmMatch = t.match(/(am|pm)$/i);
  const hhmm = t.replace(/(am|pm)$/i, "").trim();
  const parts = hhmm.split(/[:.]/).map((p) => parseInt(p, 10));
    if (parts.length < 1 || isNaN(parts[0])) return null;
    let hours = parts[0];
    const minutes = parts[1] || 0;
    if (ampmMatch) {
      const ampm = ampmMatch[1].toLowerCase();
      if (ampm === "pm" && hours < 12) hours += 12;
      if (ampm === "am" && hours === 12) hours = 0;
    }
    const date = new Date(base);
    date.setHours(hours, minutes, 0, 0);
    return date;
  };

  // helper: date key
  const dateKey = (d: Date) => `${d.getFullYear()}-${(d.getMonth()+1).toString().padStart(2,'0')}-${d.getDate().toString().padStart(2,'0')}`;

  const formatTimeLabel = (d: Date) => {
    // small hour:minute without leading zero hour
    const h = d.getHours();
    const m = d.getMinutes().toString().padStart(2, '0');
    return `${h}:${m}`;
  };

  // Generate 30-min slots (start times) between start and end on given date
  const generateSlotsForDate = useCallback((date: Date) => {
    // defaults if counselor doesn't have office times
    const defaultStart = '09:00';
    const defaultEnd = '18:00';

    let startStr = defaultStart;
    let endStr = defaultEnd;
    if ('officeStartTime' in counselor && typeof (counselor as unknown as CounselorDetails).officeStartTime === 'string') {
      startStr = (counselor as unknown as CounselorDetails).officeStartTime;
    }
    if ('officeEndTime' in counselor && typeof (counselor as unknown as CounselorDetails).officeEndTime === 'string') {
      endStr = (counselor as unknown as CounselorDetails).officeEndTime;
    }

    const start = parseTimeOnDate(date, startStr) || parseTimeOnDate(date, defaultStart)!;
    const end = parseTimeOnDate(date, endStr) || parseTimeOnDate(date, defaultEnd)!;

    const slotsArr: string[] = [];
    let cur = new Date(start);
    const slotMs = 30 * 60 * 1000;
    while (cur.getTime() + slotMs <= end.getTime()) {
      const next = new Date(cur.getTime() + slotMs);
      slotsArr.push(`${formatTimeLabel(cur)}-${formatTimeLabel(next)}`);
      cur = next;
    }
    return slotsArr;
  }, [counselor]);

  // fetch counselor non-availability and build maps
  useEffect(() => {
    let mounted = true;
    async function loadNonAvailability() {
      if (!userId) return;
        // get counselor id tolerant
        const c = counselor as unknown as { counsellorId?: string; id?: string; userName?: string };
        const counsellorId = c.counsellorId || c.id || c.userName;
      if (!counsellorId) return;
      try {
        const data = await academicApi.getCounselorNonAvailability(userId, counsellorId);
        // tolerant parsing
        const map: Record<string, Set<number>> = {};
        if (Array.isArray(data)) {
          for (const entry of data) {
            // entry might be { date: 'YYYY-MM-DD', slots: ['9:00','9:30'...] } or { date: '2025-09-19', slots: ['9:00-9:30'] }
            const dt = entry.date || entry.day || entry.dateString;
            if (!dt) continue;
            const dstr = dt.toString();
            map[dstr] = map[dstr] || new Set<number>();
            const slots = entry.slots || entry.times || entry.nonAvailableSlots || [];
            for (const s of slots) {
              if (typeof s !== 'string') continue;
              // if format contains '-', take start part
              const start = s.includes('-') ? s.split('-')[0].trim() : s.trim();
              const parsed = parseTimeOnDate(new Date(dstr), start);
              if (parsed) {
                const minutes = parsed.getHours() * 60 + parsed.getMinutes();
                map[dstr].add(minutes);
              }
            }
          }
        } else if (data && typeof data === 'object') {
          // maybe object mapping
          for (const [k, v] of Object.entries(data)) {
            map[k] = new Set<number>();
            let arr: unknown[] = [];
            if (Array.isArray(v)) arr = v as unknown[];
            else if (v && typeof v === 'object') {
              const maybe = (v as Record<string, unknown>)['slots'] ?? (v as Record<string, unknown>)['times'] ?? [];
              if (Array.isArray(maybe)) arr = maybe as unknown[];
            }
            for (const s of arr) {
              if (typeof s !== 'string') continue;
              const start = s.includes('-') ? s.split('-')[0].trim() : s.trim();
              const parsed = parseTimeOnDate(new Date(k), start);
              if (parsed) map[k].add(parsed.getHours()*60 + parsed.getMinutes());
            }
          }
        }

        if (!mounted) return;
        setNonAvailabilityMap(map);

        // compute unavailable days where all generated slots are unavailable OR in the past
        const unavail = new Set<string>();
        const now = new Date();
        for (const [k, sset] of Object.entries(map)) {
          const d = new Date(k);
          const availableSlots: string[] = generateSlotsForDate(d) || [];
          if (!availableSlots || availableSlots.length === 0) {
            unavail.add(k);
            continue;
          }
          // if every slot is either marked unavailable by API OR its start is before now (for that date)
          const allBlockedOrPast = availableSlots.every((lab) => {
            const start = lab.split('-')[0];
            const parsed = parseTimeOnDate(d, start);
            if (!parsed) return false;
            const minutes = parsed.getHours()*60 + parsed.getMinutes();
            const isBlocked = sset.has(minutes);
            const isPast = d.toDateString() === now.toDateString() ? parsed.getTime() < now.getTime() : false;
            return isBlocked || isPast;
          });
          if (allBlockedOrPast) unavail.add(k);
        }
        setUnavailableDays(unavail);
      } catch (err) {
        console.error('Failed to load non-availability', err);
      }
    }
    loadNonAvailability();
    return () => { mounted = false; };
  }, [counselor, userId, generateSlotsForDate]);

  // compute base quick dates strictly from actual today
  const today = new Date();
  const firstWorkingFromToday = isWorkingDay(today) ? today : getNextNWorkingDates(today, 1)[0];
  const baseQuickDates = getNextNWorkingDates(firstWorkingFromToday, 3);

  // Decide displayed quick dates: the base three are fixed. If selectedDate is among them, highlight it.
  // If selectedDate exists but is not among them, display selectedDate in the first card while keeping the other two as baseQuickDates[1..2].
  const isSelectedInBase = selectedDate
    ? baseQuickDates.some((b) => b.toDateString() === selectedDate.toDateString())
    : false;

  const quickDates = isSelectedInBase || !selectedDate
    ? baseQuickDates
    : [new Date(selectedDate), baseQuickDates[1], baseQuickDates[2]];

  // default selection: on mount, select the first base quick date
  useEffect(() => {
    if (!selectedDate && baseQuickDates && baseQuickDates.length > 0) {
      setSelectedDate(new Date(baseQuickDates[0]));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Determine base date for slots: if selectedDate is present and a working day, use it; otherwise use firstWorkingFromToday
  const slotBaseDate = selectedDate && isWorkingDay(selectedDate) ? selectedDate : firstWorkingFromToday;
  const slotsForSelectedDate = isWorkingDay(slotBaseDate) && !unavailableDays.has(dateKey(slotBaseDate)) ? generateSlotsForDate(slotBaseDate) : [];
  // split into sections
  const splitSlots = (list: string[]) => {
    const morning: string[] = [];
    const afternoon: string[] = [];
    const evening: string[] = [];
    for (const s of list) {
      // slot format: 'HH:MM-HH:MM' - use start part
      const start = s.split('-')[0];
      const [h, m] = start.split(':').map(Number);
  const d = new Date(slotBaseDate);
      d.setHours(h, m, 0, 0);
      const hr = d.getHours();
      if (hr < 12) morning.push(s);
      else if (hr < 18) afternoon.push(s);
      else evening.push(s);
    }
    return { morning, afternoon, evening };
  };

  const { morning: morningSlots, afternoon: afternoonSlots, evening: eveningSlots } = splitSlots(slotsForSelectedDate);

  // close evening section if no evening slots
  useEffect(() => {
    if ((openSection === 'evening') && (!eveningSlots || eveningSlots.length === 0)) {
      setOpenSection(null);
    }
  }, [eveningSlots, openSection]);

  // disabled slot ids for slotBaseDate
  const disabledSlotIds = new Set<string>();
  const nap = nonAvailabilityMap[dateKey(slotBaseDate)];
  if (nap && nap.size > 0) {
    for (const s of [...morningSlots, ...afternoonSlots, ...eveningSlots]) {
      const start = s.split('-')[0];
      const parsed = parseTimeOnDate(slotBaseDate, start);
      if (!parsed) continue;
      const minutes = parsed.getHours()*60 + parsed.getMinutes();
      if (nap.has(minutes)) {
        const id = `slot-${s.replace(/[:\s-]/g, "")}`;
        disabledSlotIds.add(id);
      }
    }
  }
  // also disable slots that are in the past for today's date
  const now = new Date();
  if (slotBaseDate.toDateString() === now.toDateString()) {
    for (const s of [...morningSlots, ...afternoonSlots, ...eveningSlots]) {
      const start = s.split('-')[0];
      const parsed = parseTimeOnDate(slotBaseDate, start);
      if (!parsed) continue;
      if (parsed.getTime() < now.getTime()) {
        const id = `slot-${s.replace(/[:\s-]/g, "")}`;
        disabledSlotIds.add(id);
      }
    }
  }

  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + 90);

  const isReadyToBook = selectedDate !== null && selectedSlot !== null;
  const navigate = useNavigate();
  const [booking, setBooking] = useState(false);

  const handleBook = async () => {
    if (!isReadyToBook || !selectedDate || !selectedSlot) return;
  // better: we used slots array to find the matching slot label
    const allSlots = [...morningSlots, ...afternoonSlots, ...eveningSlots];
    const slotLabel = allSlots.find((s) => `slot-${s.replace(/[:\s-]/g, '')}` === selectedSlot);
    const startTime = slotLabel ? slotLabel.split('-')[0] : '';

    const c = counselor as unknown as { counsellorId?: string; id?: string; userName?: string; photoUrlSmall?: string; firstName?: string; lastName?: string };
    const payload = {
      userId: userId ?? '',
      counsellorId: c.counsellorId || c.id || c.userName || '',
      date: `${selectedDate.getFullYear()}-${(selectedDate.getMonth()+1).toString().padStart(2,'0')}-${selectedDate.getDate().toString().padStart(2,'0')}`,
      startTime: startTime,
      mode: 'offline' as const,
      notes: undefined as string | undefined,
      receiverFcmToken: null as string | null,
    };

    try {
      setBooking(true);
      const res = await academicApi.bookAppointment(payload);
      // navigate to confirmation page with details
      navigate('/booking/confirmation', {
        state: {
          counselorName: `${c.firstName || ''} ${c.lastName || ''}`,
          counselorPhoto: c.photoUrlSmall,
          appointmentDate: payload.date,
          appointmentTime: startTime,
          appointmentId: res.bookingId ?? undefined,
        }
      });
    } catch (err) {
      console.error('Booking failed', err);
    } finally {
      setBooking(false);
    }
  };

  return (
    <div className="fixed inset-0  bg-[#232323]/50 backdrop-blur-sm flex items-center justify-center p-4 z-100">
  <div className="bg-[#F5F7FA] w-full flex flex-col max-w-[747px] max-h-[667px] rounded-[16px] relative p-[42px] pb-[86px] gap-6 overflow-hidden">
        <style>{`
          .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: #CBD5E0; border-radius: 8px; }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #A0AEC0; }
        `}</style>
        <div className="flex gap-2 text-[#343C6A]">
          <ChevronLeft className="w-7 h-7" />
          <p className="text-2xl font-semibold">Book Appointment</p>
        </div>

  <div className="bg-white w-[663px] max-h-[598px] p-4 pb-[100px] rounded-2xl custom-scrollbar overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: '#CBD5E0 transparent' }}>
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
            <div className="flex justify-between items-center">
              <h1 className="text-[#232323] font-semibold text-[18px]">
                Available This Week
              </h1>
              <div className="relative">
                <button
                  onClick={() => setCalendarOpen((v) => !v)}
                  aria-expanded={calendarOpen}
                  className=" "
                >
                  <CalendarDays className="h-5 w-5 text-[#fa660a]" />
                </button>
                {calendarOpen && (
                  <div className="absolute right-0 mt-2 z-40 w-[320px] bg-white border border-[#e6e6e6] rounded-md shadow-lg p-3">
                    <Calendar
                      mode="single"
                      selected={selectedDate ?? undefined}
                      onSelect={(d) => {
                        if (d instanceof Date) {
                          // normalize to start of day
                          const picked = new Date(d.getFullYear(), d.getMonth(), d.getDate());
                          const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                          const end = new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate());
                          if (picked.getTime() < start.getTime() || picked.getTime() > end.getTime()) {
                            // ignore out-of-range picks
                            return;
                          }
                          setSelectedDate(picked);
                          setCalendarOpen(false);
                        }
                      }}
                      fromDate={today}
                      toDate={maxDate}
                      isDayUnavailable={(date: Date) => {
                        const key = dateKey(new Date(date.getFullYear(), date.getMonth(), date.getDate()));
                        return !isWorkingDay(date) || unavailableDays.has(key);
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-4">
              {quickDates.map((d, idx) => {
                const activeDate = selectedDate ?? quickDates[0];
                const isSelected = activeDate.toDateString() === d.toDateString();
                const startOf = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
                const diff = Math.floor((startOf(d) - startOf(new Date())) / (24 * 60 * 60 * 1000));
                const label = diff === 0 ? 'Today' : diff === 1 ? 'Tomorrow' : d.toLocaleString(undefined, { weekday: 'short' });
                const pretty = `${d.getDate()} ${d.toLocaleString(undefined, { month: 'short' })}`;

                return (
                  <div
                    key={idx}
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      setSelectedDate(new Date(d));
                      setCalendarOpen(false);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedDate(new Date(d));
                        setCalendarOpen(false);
                      }
                    }}
                    className={`w-[200px] h-[59px] rounded-[12px] shadow-xs flex items-center justify-center cursor-pointer border-[1px] transition-all duration-150 ${
                      isSelected
                        ? "bg-[#fa660a] border-transparent text-white"
                        : "bg-white border-[#f5f5f5] text-[#232323]"
                    }`}
                  >
                    <p className="h-full flex flex-col items-center justify-center text-[14px] font-normal">
                      <span className="text-[13px]">{label}</span>
                      <span className="text-[16px] font-semibold">{pretty}</span>
                    </p>
                  </div>
                );
              })}
            </div>

            <MorningSlots
              slots={morningSlots}
              selectedSlot={selectedSlot}
              onSelectSlot={(s) => setSelectedSlot(s)}
              isOpen={openSection === "morning"}
              onToggle={() => setOpenSection((v) => (v === "morning" ? null : "morning"))}
              disabledSlotIds={disabledSlotIds}
            />
            <AfterNoonSlots
              slots={afternoonSlots}
              selectedSlot={selectedSlot}
              onSelectSlot={(s) => setSelectedSlot(s)}
              isOpen={openSection === "afternoon"}
              onToggle={() => setOpenSection((v) => (v === "afternoon" ? null : "afternoon"))}
              disabledSlotIds={disabledSlotIds}
            />
            {eveningSlots && eveningSlots.length > 0 && (
              <EveningSlots
                slots={eveningSlots}
                selectedSlot={selectedSlot}
                onSelectSlot={(s) => setSelectedSlot(s)}
                isOpen={openSection === "evening"}
                onToggle={() => setOpenSection((v) => (v === "evening" ? null : "evening"))}
                disabledSlotIds={disabledSlotIds}
              />
            )}
          </div>
        </div>
        <div className="absolute left-0 right-0 bottom-0 h-[67px] z-50 bg-white border-t border-[#f5f5f5] flex items-center justify-center rounded-b-[16px] shadow-xs">
          <div className="w-full max-w-[663px] px-4 flex justify-center">
            <Button
              variant={"default"}
              disabled={!isReadyToBook || booking}
              aria-disabled={!isReadyToBook || booking}
              onClick={handleBook}
              className={`${isReadyToBook ? "bg-[#fa660a]" : "bg-[#ACACAC]"} text-[16px] text-white w-full max-w-md disabled:opacity-60 disabled:cursor-not-allowed`}
            >
              Book Appointment Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
