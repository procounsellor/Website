import { CalendarDays, Clock3, EllipsisVertical } from "lucide-react";
import type { OutOfOffice } from "@/types/appointments";

interface OutOfOfficeCardProps {
  outOfOffice: OutOfOffice;
  isMenuOpen: boolean;
  onMenuToggle: () => void;
  onReschedule: (ooo: OutOfOffice) => void;
  onCancel: (ooo: OutOfOffice) => void;
}

export function OutOfOfficeCard({
  outOfOffice,
  isMenuOpen,
  onMenuToggle,
  onReschedule,
  onCancel,
}: OutOfOfficeCardProps) {
  const getOooStatus = (): "Active" | "Past" | "Upcoming" => {
    const now = new Date();
    const startDateTime = new Date(
      `${outOfOffice.startDate}T${outOfOffice.startTime}`
    );
    const endDateTime = new Date(
      `${outOfOffice.endDate}T${outOfOffice.endTime}`
    );

    if (now > endDateTime) {
      return "Past";
    }
    if (now >= startDateTime && now <= endDateTime) {
      return "Active";
    }
    return "Upcoming";
  };

  const status = getOooStatus();
  const showMenu = status === "Active" || status === "Upcoming";

  let badgeColor: string;
  let badgeBgColor: string;
  let badgeText: string;
  let badgeFontWeight: number;

  switch (status) {
    case "Active":
      badgeColor = "#FA660F";
      badgeBgColor = "#FA660F26";
      badgeText = "Active";
      badgeFontWeight = 600;
      break;
    case "Past":
      badgeColor = "#6C757D";
      badgeBgColor = "#6C757D26";
      badgeText = "Past";
      badgeFontWeight = 600;
      break;
    default:
      badgeColor = "#28A745";
      badgeBgColor = "#28A74526";
      badgeText = "Upcoming";
      badgeFontWeight = 700;
      break;
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "2-digit",
      year: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onMenuToggle();
  };

  return (
    <div className="bg-white h-[188px] w-full border border-[#EFEFEF] shadow-md rounded-2xl p-4 relative">
      <div className="flex justify-between">
        <div
          style={{
            backgroundColor: badgeBgColor,
            color: badgeColor,
            fontWeight: badgeFontWeight,
            fontSize: "12px",
            padding: "4px 8px",
            borderRadius: "4px",
          }}
        >
          {badgeText}
        </div>
        {showMenu && (
          <button
            onClick={handleMenuClick}
            className="p-1 rounded-full hover:cursor-pointer hover:bg-gray-100"
          >
            <EllipsisVertical size={18} />
          </button>
        )}
      </div>

      {isMenuOpen && showMenu && (
        <div className="absolute right-4 top-12 w-48 bg-white rounded-lg shadow-lg border border-gray-100 z-30">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onReschedule(outOfOffice);
            }}
            className="block w-full text-left hover:cursor-pointer px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-t-lg"
          >
            Reschedule
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCancel(outOfOffice);
            }}
            className="block w-full text-left hover:cursor-pointer px-4 py-3 text-sm text-red-600 hover:bg-gray-50 rounded-b-lg"
          >
            Cancel
          </button>
        </div>
      )}

      <div className="flex justify-between text-[16px] text-[#13097D] py-2.5">
        <div className="flex flex-col items-start gap-1.5">
          <p className="text-[14px] font-normal text-[#718EBF]">Starting on</p>
          <p className="flex gap-1 items-center font-medium">
            <CalendarDays size={20} />
            {formatDate(outOfOffice.startDate)}
          </p>
          <p className="flex gap-1 items-center font-normal">
            <Clock3 size={16} />
            {formatTime(outOfOffice.startTime)}
          </p>
        </div>
        <div className="flex flex-col items-start gap-1.5">
          <p className="text-[14px] font-normal text-[#718EBF]">Ends on</p>
          <p className="flex gap-1 items-center font-medium">
            <CalendarDays size={20} />
            {formatDate(outOfOffice.endDate)}
          </p>
          <p className="flex gap-1 items-center font-normal">
            <Clock3 size={16} />
            {formatTime(outOfOffice.endTime)}
          </p>
        </div>
      </div>

      <div className="w-full h-9 bg-[#F9FAFB] border border-[#F5F5F5] rounded-[10px] px-4 flex items-center text-[#232323] text-[14px] font-normal truncate">
        {outOfOffice.reason || "No Reason"}
      </div>
    </div>
  );
}