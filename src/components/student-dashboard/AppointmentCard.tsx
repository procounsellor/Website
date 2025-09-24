import { MoreVertical } from 'lucide-react';
import type { Appointment } from '@/types/appointment';

interface AppointmentCardProps {
  appointment: Appointment;
}

const formatDate = (dateString: string) => {
    const date = new Date(`${dateString}T00:00:00`);
    return new Intl.DateTimeFormat('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(date);
};

const formatTime = (time: string) => {
    const [hour, minute] = time.split(':');
    const date = new Date();
    date.setHours(parseInt(hour, 10), parseInt(minute, 10));
    return new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
    }).format(date);
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointment }) => {
  const { counsellorFullName, counsellorPhootoSmall, date, startTime, endTime, status } = appointment;

  const getStatusChip = (currentStatus: Appointment['status']) => {
    switch (currentStatus) {
        case 'upcoming':
            return <div className="bg-[#EBF5FF] text-[#007BFF] text-sm font-semibold px-3 py-1 rounded-full whitespace-nowrap">Upcoming</div>;
        case 'completed':
             return <div className="bg-[#F3F4F6] text-[#4B5563] text-sm font-semibold px-3 py-1 rounded-full whitespace-nowrap">Completed</div>;
        case 'cancelled':
            return <div className="bg-[#FFEBEB] text-[#DC3545] text-sm font-semibold px-3 py-1 rounded-full whitespace-nowrap">Cancelled</div>;
    }
  }

  return (
    <div className="bg-white p-4 rounded-2xl border border-[#EFEFEF] grid grid-cols-12 gap-4 items-center">

      <div className="col-span-12 sm:col-span-4 flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
          <img
            src={counsellorPhootoSmall || `https://ui-avatars.com/api/?name=${counsellorFullName}&background=random`}
            alt={counsellorFullName}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h4 className="font-semibold text-xl text-[#242645]">{counsellorFullName}</h4>
          <p className="text-base font-medium text-[#8C8CA1]">Counselling Session</p>
        </div>
      </div>

      <div className="hidden sm:col-span-5 sm:flex justify-center items-center gap-8">
        <div>
          <p className="text-xl font-semibold text-[#242645]">Date</p>
          <p className="font-medium text-base text-[#8C8CA1] whitespace-nowrap">{formatDate(date)}</p>
        </div>
        <div>
          <p className="text-xl font-semibold text-[#242645]">Time</p>
          <p className="font-medium text-base text-[#8C8CA1] whitespace-nowrap">{`${formatTime(startTime)} - ${formatTime(endTime)}`}</p>
        </div>
      </div>

      <div className="col-span-12 sm:col-span-3 flex items-center justify-end gap-4">
        {getStatusChip(status)}
        <button className="text-gray-500 hover:text-gray-800">
          <MoreVertical size={20} />
        </button>
      </div>
    </div>
  );
};

export default AppointmentCard;