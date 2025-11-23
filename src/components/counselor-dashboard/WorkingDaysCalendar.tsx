import { useState } from "react";
import { Calendar } from "../ui/calendar";

const dayNumberToName: { [key: number]: string } = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
};

interface WorkingDaysCalendarProps {
  selected: Date | null;
  onSelect: (date: Date) => void;
  workingDays: string[];
  fromDate?: Date;
}

export default function WorkingDaysCalendar({
  selected,
  onSelect,
  workingDays,
  fromDate,
}: WorkingDaysCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(
    selected || fromDate || new Date()
  );

  const workingDaysSet = new Set(workingDays.map((s) => s.toLowerCase()));

  const isWorkingDay = (d: Date) => {
    if (!workingDays || workingDays.length === 0) return true;
    return workingDaysSet.has(dayNumberToName[d.getDay()].toLowerCase());
  };

  const isDayUnavailable = (date: Date) => {
    return !isWorkingDay(date);
  };

  return (
    <div onMouseDown={(e) => e.stopPropagation()}>
    <Calendar
      mode="single"
      selected={selected || undefined}
      onSelect={(d) => {
        if (d) {
          onSelect(d);
        }
      }}
      month={currentMonth}
      onMonthChange={setCurrentMonth}
      fromDate={fromDate || new Date()}
      isDayUnavailable={isDayUnavailable}
      className="p-3"
      classNames={{
        day_disabled:
          "text-gray-400 opacity-70 line-through",
        day_selected:
          "bg-[#FA660F] text-white hover:bg-[#FA660F] focus:bg-[#FA660F]",
      }}
    />
    </div>
  );
}