import { MoreVertical, Calendar, Clock } from 'lucide-react';
import type { CounselorAppointment } from '@/types/appointments';

interface AppointmentCardProps {
  appointment: CounselorAppointment;
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

const getStatusContent = (currentStatus: CounselorAppointment['status']) => {
    const statusChipClasses = "px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap";
    switch (currentStatus) {
        case 'completed':
            return <div className={`${statusChipClasses} bg-green-100 text-[#28A745]`}>Completed</div>;
        case 'cancelled':
            return <div className={`${statusChipClasses} bg-red-100 text-[#EE1C1F]`}>Cancelled</div>;
        case 'booked':
        case 'rescheduled':
        default:
            return <div className={`${statusChipClasses} bg-[#E8E7F2] text-[#13097D]`}>Upcoming</div>;
    }
};

export default function AppointmentCard({ appointment }: AppointmentCardProps) {
  const { userFullName, userPhootoSmall, userCourse, date, startTime, endTime, status } = appointment;
  const imageUrl = userPhootoSmall && userPhootoSmall !== 'NA' 
    ? userPhootoSmall 
    : `https://ui-avatars.com/api/?name=${userFullName}&background=random`;

  return (
    <>
      <div className="block md:hidden bg-white border border-gray-200 rounded-2xl p-4 space-y-4 shadow-sm">
        <div className="flex justify-between items-center">
          <p className="text-sm font-medium text-[#343C6A]">Appointment with</p>
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
              src={imageUrl}
              alt={userFullName}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h4 className="font-semibold text-base text-[#343C6A]">{userFullName}</h4>
            <p className="text-sm font-medium text-[#718EBF]">{userCourse}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 border-t border-gray-200 pt-4">
          <div className="flex items-center gap-2">
            <div className="bg-gray-100 p-1.5 rounded-xl">
              <Calendar className="text-gray-500" size={16} />
            </div>
            <div>
              <p className="text-xs text-gray-500">Date</p>
              <p className="text-xs font-medium text-gray-800">{formatDate(date)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-gray-100 p-1.5 rounded-xl">
              <Clock className="text-gray-500" size={16} />
            </div>
            <div>
              <p className="text-xs text-gray-500">Time</p>
              <p className="text-xs font-medium text-gray-800">{`${formatTime(startTime)} - ${formatTime(endTime)}`}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden md:block py-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              <div className="md:col-span-4 flex items-center gap-4">
                  <div className="w-20 h-20 rounded-lg bg-gray-200 overflow-hidden flex-shrink-0">
                      <img
                          src={imageUrl}
                          alt={userFullName}
                          className="w-full h-full object-cover"
                      />
                  </div>
                  <div>
                      <h4 className="font-semibold text-xl text-[#242645]">{userFullName}</h4>
                      <p className="text-base font-medium text-[#8C8CA1]">{userCourse}</p>
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
                  <button className="text-gray-500 p-2 rounded-full hover:bg-gray-100"
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