import { CalendarDays, Clock3, EllipsisVertical } from "lucide-react";
import type { OutOfOffice } from "@/types/appointments";

interface OutOfOfficeCardProps {
  outOfOffice: OutOfOffice;
}

export function OutOfOfficeCard({ outOfOffice }: OutOfOfficeCardProps) {
    const isActive = () => {
        const now = new Date();
        const currentDate = now.toISOString().split('T')[0];
        const currentTime = now.toTimeString().slice(0, 5);

        const startDateTime = new Date(`${outOfOffice.startDate}T${outOfOffice.startTime}`);
        const endDateTime = new Date(`${outOfOffice.endDate}T${outOfOffice.endTime}`);
        const nowDateTime = new Date(`${currentDate}T${currentTime}`);

        return nowDateTime >= startDateTime && nowDateTime <= endDateTime;
    };

    const active = isActive();
    const badgeColor = active ? '#FA660F' : '#28A745';
    const badgeBgColor = active ? '#FA660F26' : '#28A74526';
    const badgeText = active ? 'Active' : 'Upcoming';
    const badgeFontWeight = active ? 600 : 700;

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const options: Intl.DateTimeFormatOptions = { month: 'short', day: '2-digit', year: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    };

    const formatTime = (timeStr: string) => {
        const [hours, minutes] = timeStr.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
    };

    return <div className="bg-white h-[188px] w-[400px] border border-[#EFEFEF] shadow-md rounded-[16px] p-4">
        <div className="flex justify-between">
            <div
                style={{
                    backgroundColor: badgeBgColor,
                    color: badgeColor,
                    fontWeight: badgeFontWeight,
                    fontSize: '12px',
                    padding: '4px 8px',
                    borderRadius: '4px',
                }}
            >
                {badgeText}
            </div>
            <EllipsisVertical size={18}/>
        </div>

        <div className="flex justify-between text-[16px] text-[#13097D] py-2.5">
            <div className="flex flex-col items-start gap-1.5">
                <p className="text-[14px] font-normal text-[#718EBF]">Starting on</p>
                <p className="flex gap-1 items-center font-medium"><CalendarDays size={20}/>{formatDate(outOfOffice.startDate)}</p>
                <p className="flex gap-1 items-center font-normal"><Clock3 size={16}/>{formatTime(outOfOffice.startTime)}</p>
            </div>
            <div className="flex flex-col items-start gap-1.5">
                <p className="text-[14px] font-normal text-[#718EBF]">Ends on</p>
                <p className="flex gap-1 items-center font-medium"><CalendarDays  size={20}/>{formatDate(outOfOffice.endDate)}</p>
                <p className="flex gap-1 items-center font-normal"><Clock3 size={16}/>{formatTime(outOfOffice.endTime)}</p>
            </div>
        </div>

        <div className="w-[368px] h-9 bg-[#F9FAFB] border border-[#F5F5F5] rounded-[10px] px-4 flex items-center text-[#232323] text-[14px] font-normal truncate">
            {outOfOffice.reason || 'No Reason'}
        </div>
    </div>
}
