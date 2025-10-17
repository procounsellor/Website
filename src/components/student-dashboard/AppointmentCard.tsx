import { MoreVertical, Calendar, Clock } from 'lucide-react';
import type { Appointment } from '@/types/appointment';

interface AppointmentCardProps {
  appointment: Appointment;
  onClick?: () => void;
}

const formatDate = (dateString: string) => {
    const date = new Date(`${dateString}T00:00:00`);
    const day = new Intl.DateTimeFormat('en-GB', { day: 'numeric' }).format(date);
    const month = new Intl.DateTimeFormat('en-GB', { month: 'short' }).format(date);
    const weekday = new Intl.DateTimeFormat('en-GB', { weekday: 'long' }).format(date);
    return `${day} ${month}, ${weekday}`;
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
};

const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointment, onClick }) => {
  const { counsellorFullName, counsellorPhootoSmall, date, startTime, endTime, status } = appointment;

  const getStatusContent = (currentStatus: Appointment['status']) => {
    // const baseButtonClasses = "px-4 py-2 text-sm font-semibold rounded-lg transition-colors";
    const statusChipClasses = "px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap";

    switch (currentStatus) {
        case 'completed':
            return (
                <>
                    {/* <button className={`${baseButtonClasses} bg-[#655E95] text-white hover:bg-indigo-800`}>
                        Rate Now
                    </button> */}
                    <div className={`${statusChipClasses} bg-green-100 text-[#28A745]`}>Completed</div>
                </>
            );
        case 'cancelled':
            return (
                <>
                    {/* <button className={`${baseButtonClasses} bg-[#655E95] text-white hover:bg-indigo-800`}>
                        Re-Book
                    </button> */}
                    <div className={`${statusChipClasses} bg-red-100 text-[#EE1C1F]`}>Cancelled</div>
                </>
            );
        default: // 'booked' and 'rescheduled'
            return <div className={`${statusChipClasses} bg-[#E8E7F2] text-[#13097D]`}>Upcoming</div>;
    }
  }

  return (
    <>
      {/*Mobile View*/}
      <div 
        className="block md:hidden bg-white border border-gray-200 rounded-2xl p-4 space-y-4 shadow-sm"
        onClick={onClick}
      >
        <div className="flex justify-between items-center">
          <p className="text-sm font-medium text-gray-500">Counselling</p>
          <div className="flex items-center gap-2">
            {getStatusContent(status)}
            <button className="text-gray-400" onClick={(e) => e.stopPropagation()}>
              <MoreVertical size={20} />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-lg bg-gray-200 overflow-hidden flex-shrink-0">
            <img
              src={counsellorPhootoSmall || `https://ui-avatars.com/api/?name=${counsellorFullName}&background=random`}
              alt={counsellorFullName}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h4 className="font-semibold text-base text-[#242645]">{counsellorFullName}</h4>
            <p className="text-sm font-medium text-gray-500">Engineering Counsellor</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 border-t pt-4">
          <div className="flex items-center gap-2">
            <div className="bg-gray-100 p-1.5 rounded-xl">
              <Calendar className="text-gray-500" size={16} />
            </div>
            <div>
              <p className="text-xs text-[#232323]">Date</p>
              <p className="text-xs font-medium text-[#232323]">{formatDate(date)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-gray-100 p-1.5 rounded-xl">
              <Clock className="text-gray-500" size={16} />
            </div>
            <div>
              <p className="text-xs text-[#232323]">Time</p>
              <p className="text-xs font-medium text-[#232323] text-nowrap">{`${formatTime(startTime)} - ${formatTime(endTime)}`}</p>
            </div>
          </div>
        </div>
      </div>

      {/*Desktop View*/}
      <div className="hidden md:block py-6 cursor-pointer transition-colors rounded-lg -mx-6 px-6"
          onClick={onClick}
      >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              <div className="md:col-span-4 flex items-center gap-4">
                  <div className="w-20 h-20 rounded-lg bg-gray-200 overflow-hidden flex-shrink-0">
                      <img
                          src={counsellorPhootoSmall || `https://ui-avatars.com/api/?name=${counsellorFullName}&background=random`}
                          alt={counsellorFullName}
                          className="w-full h-full object-cover"
                      />
                  </div>
                  <div>
                      <h4 className="font-semibold text-xl text-[#242645]">{counsellorFullName}</h4>
                      <p className="text-base font-medium text-[#8C8CA1]">Engineering Counselling Session</p>
                  </div>
              </div>

              <div className="md:col-span-4 flex justify-start md:justify-center items-center gap-8">
                  <div>
                      <p className="text-xl font-semibold text-[#242645]">Date</p>
                      <p className="font-medium text-base text-[#8C8CA1] whitespace-nowrap">{formatDate(date)}</p>
                  </div>
                  <div>
                      <p className="text-xl font-semibold text-[#242645]">Time</p>
                      <p className="font-medium text-base text-[#8C8CA1] whitespace-nowrap">{`${formatTime(startTime)} - ${formatTime(endTime)}`}</p>
                  </div>
              </div>

              <div className="md:col-span-4 flex items-center justify-end gap-4">
                  {getStatusContent(status)}
                  <button className="text-black p-2 rounded-full"
                      onClick={(e) => e.stopPropagation()}
                  >
                      <MoreVertical size={24} />
                  </button>
              </div>
          </div>
      </div>
    </>
  );
};

export default AppointmentCard;