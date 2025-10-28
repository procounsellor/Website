import { useState, useEffect, useMemo } from 'react';
import type { Appointment } from '@/types/appointment';
import { useAuthStore } from '@/store/AuthStore';
import { getUserAppointments, getUpcomingAppointments, cancelAppointment } from '@/api/appointment';
import AppointmentCard from './AppointmentCard';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import AppointmentDetailsModal from './AppointmentDetailsModal';
import CancelAppointmentModal from './CancelAppointmentModal';
import RescheduleModalWrapper from './RescheduleModalWrapper';

type AppointmentFilter = 'All' | 'Upcoming' | 'Completed' | 'Cancelled';

const AppointmentsTab: React.FC = () => {
  const { userId } = useAuthStore();
  const token = localStorage.getItem('jwt');
  const navigate = useNavigate();
  
  const [allAppointments, setAllAppointments] = useState<Appointment[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [activeFilter, setActiveFilter] = useState<AppointmentFilter>('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [cancelModalAppt, setCancelModalAppt] = useState<Appointment | null>(null);
  const [rescheduleModalAppt, setRescheduleModalAppt] = useState<Appointment | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchAppointments = async (showLoading = true) => {
    if (!userId || !token) {
      setError("User not authenticated.");
      if (showLoading) setLoading(false);
      return;
    }
    try {
      if (showLoading) setLoading(true);
      const [allData, upcomingData] = await Promise.all([
        getUserAppointments(userId, token),
        getUpcomingAppointments(userId, token)
      ]);
      
      setAllAppointments(allData);
      setUpcomingAppointments(upcomingData);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch appointments.');
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments(true);
  }, [userId, token]);

  const filteredAppointments = useMemo(() => {
    switch (activeFilter) {
      case 'Upcoming':
        return upcomingAppointments.filter(app => app.status === 'booked' || app.status === 'rescheduled');
      case 'Completed':
        return allAppointments.filter(app => app.status === 'completed');
      case 'Cancelled':
        return allAppointments.filter(app => app.status === 'cancelled');
      case 'All':
      default:
        return allAppointments;
    }
  }, [activeFilter, allAppointments, upcomingAppointments]);

  const handleCardClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
  };

  const handleNavigateToCounselor = (counselorId: string) => {
    navigate('/counselors/profile', { state: { id: counselorId } });
    setSelectedAppointment(null);
  };
  
  const handleCancelConfirm = async (reason: string) => {
    if (!cancelModalAppt || !userId || !token) return;

    setIsSubmitting(true);
    const toastId = toast.loading('Cancelling appointment...');
    
    try {
      const payload = {
        userId: userId,
        appointmentId: cancelModalAppt.appointmentId,
        receiverFcmToken: cancelModalAppt.counsellorFCMToken || null,
        reason: reason,
      };
      
      await cancelAppointment(payload, token); 
      
      toast.success('Appointment cancelled.', { id: toastId });
      setCancelModalAppt(null);
      await fetchAppointments(false);
      
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to cancel appointment.', { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleRescheduleFromCancel = () => {
    setRescheduleModalAppt(cancelModalAppt);
    setCancelModalAppt(null);
  };

  const handleRescheduleSuccess = () => {
    setRescheduleModalAppt(null);
    fetchAppointments(false);
  };

  const TABS: AppointmentFilter[] = ['All', 'Upcoming', 'Completed', 'Cancelled'];

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[#13097D]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16 bg-white rounded-xl border border-red-200">
        <h3 className="text-lg font-semibold text-red-600">Error</h3>
        <p className="text-gray-500 mt-2">{error}</p>
      </div>
    );
  }

  return (
    <div className="md:bg-white md:p-6 md:rounded-2xl md:border md:border-[#EFEFEF]">
      <div className="bg-white p-4 rounded-2xl border border-[#EFEFEF] mb-4 md:bg-transparent md:p-0 md:border-none md:mb-6">
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-4 py-2 text-sm md:text-base font-medium rounded-full transition-colors duration-200 ${
                activeFilter === tab 
                ? 'bg-[#E8E7F2] text-[#13097D]' 
                : 'bg-transparent text-[#8C8CA1] md:text-[#13097D] hover:text-[#13097D]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      
      {filteredAppointments.length > 0 ? (
        <div className="flex flex-col gap-4 md:block md:gap-0 md:divide-y md:divide-gray-200 md:-mt-6">
          {filteredAppointments.map((appointment) => (
            <AppointmentCard 
              key={appointment.appointmentId} 
              appointment={appointment} 
              onCardClick={handleCardClick}
              onCancel={setCancelModalAppt}
              onReschedule={setRescheduleModalAppt}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl">
          <h3 className="text-lg font-semibold text-gray-700">No Appointments Found</h3>
          <p className="text-gray-500 mt-2">There are no {activeFilter.toLowerCase()} appointments.</p>
        </div>
      )}

      <AppointmentDetailsModal
        isOpen={!!selectedAppointment}
        appointment={selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
        onNavigateToCounselor={handleNavigateToCounselor}
      />

      <CancelAppointmentModal
        isOpen={!!cancelModalAppt}
        onClose={() => setCancelModalAppt(null)}
        onConfirm={handleCancelConfirm}
        onReschedule={handleRescheduleFromCancel}
        isSubmitting={isSubmitting}
      />

      <RescheduleModalWrapper
        appointment={rescheduleModalAppt}
        onClose={() => setRescheduleModalAppt(null)}
        onRescheduleSuccess={handleRescheduleSuccess}
      />

    </div>
  );
};

export default AppointmentsTab;