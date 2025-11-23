import { useState, useMemo } from 'react';
import { Loader2 } from 'lucide-react';
import { getCounselorAppointments, cancelAppointment } from '@/api/counselor-Dashboard';
import type { CounselorAppointment, CancelAppointmentPayload } from '@/types/appointments';
import type { User } from '@/types/user';
import AppointmentCard from '../cards/AppointmentCard';
import toast from 'react-hot-toast';
import CounselorAppointmentDetailsModal from '../modals/CounselorAppointmentDetailsModal';
import CancelAppointmentModal from '../modals/CancelAppointmentModal';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

type AppointmentFilter = 'All' | 'Upcoming' | 'Completed' | 'Cancelled';

interface Props {
  user: User;
  token: string;
}

export default function AppointmentsTab({ user, token }: Props) {
  const [activeFilter, setActiveFilter] = useState<AppointmentFilter>('All');
  const [detailsModalAppt, setDetailsModalAppt] = useState<CounselorAppointment | null>(null);
  const [cancelModalAppt, setCancelModalAppt] = useState<CounselorAppointment | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const {
    data: appointments = [],
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ['counselorAppointments', user.userName],
    queryFn: () => getCounselorAppointments(user.userName, token),
    enabled: !!user.userName && !!token,
  });

  const filteredAppointments = useMemo(() => {
    switch (activeFilter) {
      case 'Upcoming':
        return appointments.filter(a => a.status === 'booked' || a.status === 'rescheduled');
      case 'Completed':
        return appointments.filter(a => a.status === 'completed');
      case 'Cancelled':
        return appointments.filter(a => a.status === 'cancelled');
      case 'All':
      default:
        return appointments;
    }
  }, [activeFilter, appointments]);

  const { mutate: cancelMutation, isPending: isSubmitting } = useMutation({
    mutationFn: (reason: string) => {
      if (!cancelModalAppt) throw new Error("No appointment selected for cancellation.");
      const payload: CancelAppointmentPayload = {
        userId: user.userName,
        appointmentId: cancelModalAppt.appointmentId,
        receiverFcmToken: cancelModalAppt.userFCMToken || null,
        reason: reason,
      };
      return cancelAppointment(payload, token);
    },
    onSuccess: () => {
      toast.success('Appointment cancelled.');
      setCancelModalAppt(null);
      queryClient.invalidateQueries({ queryKey: ['counselorAppointments', user.userName] });
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : 'Failed to cancel appointment.');
    }
  });

  const handleMenuToggle = (appointmentId: string) => {
    setOpenMenuId(prevId => (prevId === appointmentId ? null : appointmentId));
  };

  const handleCardClick = (appointment: CounselorAppointment) => {
    setDetailsModalAppt(appointment);
    setOpenMenuId(null);
  };

  const handleCancelClick = (appointment: CounselorAppointment) => {
    setCancelModalAppt(appointment);
    setOpenMenuId(null);
  };

  const handleCancelConfirm = (reason: string) => {
    if (!reason.trim()) {
        toast.error("Please provide a reason for cancellation.");
        return;
    }
    cancelMutation(reason);
  };

  const TABS: AppointmentFilter[] = ['All', 'Upcoming', 'Completed', 'Cancelled'];

  return (
    <div
      className="md:bg-white md:p-6 md:rounded-2xl md:border md:border-[#EFEFEF]"
      onClick={() => setOpenMenuId(null)}
    >
      <div className="bg-white p-4 rounded-2xl border border-[#EFEFEF] mb-4 md:bg-transparent md:p-0 md:border-none md:mb-6">
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex items-center gap-2 sm:gap-4 w-max">
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={`px-4 py-2 text-sm md:text-base font-medium rounded-full transition-colors duration-200 whitespace-nowrap ${
                  activeFilter === tab
                  ? 'bg-[#E8E7F2] text-[#13097D]'
                  : 'bg-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#13097D]" /></div>
      ) : error ? (
        <div className="text-center py-16 text-red-500">{(error as Error).message}</div>
      ) : (
        <div
          className="flex flex-col gap-4 md:block md:gap-0 md:divide-y md:divide-gray-200"
          onClick={(e) => e.stopPropagation()}
        >
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map(app =>
            <AppointmentCard
              key={app.appointmentId}
              appointment={app}
              onCardClick={handleCardClick}
              onCancel={handleCancelClick}
              isMenuOpen={openMenuId === app.appointmentId}
              onMenuToggle={() => handleMenuToggle(app.appointmentId)}
            />)
          ) : (
            <div className="text-center py-16 text-gray-500 bg-white rounded-2xl">
                No {activeFilter.toLowerCase()} appointments found.
            </div>
          )}
        </div>
      )}

      <CounselorAppointmentDetailsModal
        isOpen={!!detailsModalAppt}
        appointment={detailsModalAppt}
        onClose={() => setDetailsModalAppt(null)}
        counsellorId={user.userName}
        token={token}
      />

      <CancelAppointmentModal
        isOpen={!!cancelModalAppt}
        onClose={() => setCancelModalAppt(null)}
        onConfirm={handleCancelConfirm}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}