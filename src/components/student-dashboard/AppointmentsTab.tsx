import { useState, useMemo, useEffect } from 'react';
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
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

type AppointmentFilter = 'All' | 'Upcoming' | 'Completed' | 'Cancelled';

const AppointmentsTab: React.FC = () => {
  const { userId, user, refreshUser } = useAuthStore();
  const token = localStorage.getItem('jwt');
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [activeFilter, setActiveFilter] = useState<AppointmentFilter>('All');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [cancelModalAppt, setCancelModalAppt] = useState<Appointment | null>(null);
  const [rescheduleModalAppt, setRescheduleModalAppt] = useState<Appointment | null>(null);

  // Refresh user data when component mounts to get latest interestedCourse
  useEffect(() => {
    if (userId && token) {
      refreshUser(true);
    }
  }, [userId, token, refreshUser]);

  const allAppointmentsQuery = useQuery({
    queryKey: ['appointments', 'all', { userId }],
    queryFn: () => getUserAppointments(userId!, token!),
    enabled: !!userId && !!token,
  });

  const upcomingAppointmentsQuery = useQuery({
    queryKey: ['appointments', 'upcoming', { userId }],
    queryFn: () => getUpcomingAppointments(userId!, token!),
    enabled: !!userId && !!token,
  });

  const { data: allAppointments = [] } = allAppointmentsQuery;
  const { data: upcomingAppointments = [] } = upcomingAppointmentsQuery;
  const loading = allAppointmentsQuery.isLoading || upcomingAppointmentsQuery.isLoading;
  const error = allAppointmentsQuery.error || upcomingAppointmentsQuery.error;

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

  const { mutate: cancelAppointmentMutation, isPending: isSubmitting } = useMutation({
    mutationFn: (reason: string) => {
      if (!cancelModalAppt || !userId || !token) {
        throw new Error('Could not cancel appointment. Missing data.');
      }
      const payload = {
        userId: userId,
        appointmentId: cancelModalAppt.appointmentId,
        receiverFcmToken: cancelModalAppt.counsellorFCMToken || null,
        reason: reason,
      };
      return cancelAppointment(payload, token);
    },
    onSuccess: () => {
      toast.success('Appointment cancelled.');
      setCancelModalAppt(null);
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : 'Failed to cancel appointment.');
    }
  });

  const handleCardClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
  };

  const handleNavigateToCounselor = (counselorId: string) => {
    navigate('/counsellor-profile', { state: { id: counselorId } });
    setSelectedAppointment(null);
  };
  
  const handleCancelConfirm = (reason: string) => {
    cancelAppointmentMutation(reason || 'No reason provided');
  };
  
  const handleRescheduleFromCancel = () => {
    setRescheduleModalAppt(cancelModalAppt);
    setCancelModalAppt(null);
  };

  const handleRescheduleSuccess = () => {
    setRescheduleModalAppt(null);
    queryClient.invalidateQueries({ queryKey: ['appointments'] });
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
        <p className="text-gray-500 mt-2">{(error as Error).message}</p>
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
              className={`px-4 py-2 text-sm md:text-base font-medium rounded-full transition-colors duration-200 hover:cursor-pointer ${
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
              interestedCourse={user?.interestedCourse}
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