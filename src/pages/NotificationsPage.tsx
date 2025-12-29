import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/AuthStore';
import SmartImage from '@/components/ui/SmartImage';
import { getRelativeTime } from '@/utils/dateUtils';
import { getAppointmentById } from '@/api/appointment';
import type { ActivityLog } from '@/types/user';
import toast from 'react-hot-toast';
import AppointmentDetailsModal from '@/components/student-dashboard/AppointmentDetailsModal';

const NotificationsPage = () => {
  const { user, isAuthenticated, toggleLogin, role, userId } = useAuthStore();
  const token = localStorage.getItem('jwt');
  const navigate = useNavigate();

  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      setTimeout(() => {
        toggleLogin();
      }, 100);
    }
  }, [isAuthenticated, navigate, toggleLogin]);

  if (!isAuthenticated || !user) {
    return null; 
  }

  const handleNotificationClick = async (notif: ActivityLog) => {
      if (role === 'counselor') return;
      const type = notif.activityType?.toLowerCase();
  
      if (type === 'subscription' || type === 'subscribe') {
        navigate('/counsellor-profile', { 
          state: { id: notif.activitySenderId } 
        });
      }
  
      else if (type === 'appointment') {
        if (!userId || !token) return;
  
        try {
          const appointmentId = notif.id;
          const toastId = toast.loading("Opening details...");
          
          const appointmentData = await getAppointmentById(userId, appointmentId, token);
          
          toast.dismiss(toastId);
          
          if (appointmentData) {
              setSelectedAppointment(appointmentData);
              setIsAppointmentModalOpen(true);
          }
        } catch (error) {
          console.error("Failed to fetch appointment", error);
          toast.error("Could not load appointment details");
        }
      }
  };

  const sortedNotifications = [...(user.activityLog || [])].sort((a, b) => {
    const timeA = a.timestamp.seconds;
    const timeB = b.timestamp.seconds;
    return timeB - timeA;
  });

  return (
    <div className="min-h-screen bg-gray-50 mt-15 py-8 px-4 md:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        
        <div className="px-6 py-4 border-b border-gray-100">
          <h1 className="text-xl font-semibold text-[#13097D] font-poppins">
            Notifications
          </h1>
        </div>

        <div className="divide-y divide-gray-100">
          {sortedNotifications.length === 0 ? (
            <div className="p-12 text-center text-gray-500 font-mulish">
              No notifications yet.
            </div>
          ) : (
            sortedNotifications.map((notif) => {
              const fallbackImage = 'https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg';

              return (
                <div 
                  key={notif.id || notif.timestamp.nanos}
                  onClick={() => handleNotificationClick(notif)}
                  className="flex items-start gap-4 p-6 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                >
                  <div className="shrink-0 w-12 h-12 rounded-full overflow-hidden border border-gray-100 shadow-sm">
                    <SmartImage
                      src={notif.photo && notif.photo !== "" ? notif.photo : fallbackImage}
                      alt="Sender"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 flex flex-col gap-1.5 pt-0.5">
                    <p className="text-[#6C6969] text-[15px] leading-relaxed font-medium font-mulish">
                      {notif.activity}
                    </p>
                    <span className="text-[#888888] text-xs font-medium font-mulish">
                      {getRelativeTime(notif.timestamp)}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {selectedAppointment && (
        <AppointmentDetailsModal
            isOpen={isAppointmentModalOpen}
            onClose={() => {
                setIsAppointmentModalOpen(false);
                setSelectedAppointment(null);
            }}
            appointment={selectedAppointment}
            onNavigateToCounselor={(counselorId) => {
                navigate('/counsellor-profile', { 
                  state: { id: counselorId } 
                });
                setIsAppointmentModalOpen(false);
            }}
        />
      )}
    </div>
  );
};

export default NotificationsPage;