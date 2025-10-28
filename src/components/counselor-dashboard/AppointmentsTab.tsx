import { useState, useEffect, useMemo, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import { getCounselorAppointments, cancelAppointment } from '@/api/counselor-Dashboard';
import type { CounselorAppointment, CancelAppointmentPayload } from '@/types/appointments';
import type { User } from '@/types/user';
import AppointmentCard from './AppointmentCard';
import toast from 'react-hot-toast';
import CounselorAppointmentDetailsModal from './CounselorAppointmentDetailsModal';
import CancelAppointmentModal from './CancelAppointmentModal';

type AppointmentFilter = 'All' | 'Upcoming' | 'Completed' | 'Cancelled';

interface Props {
  user: User;
  token: string;
}

export default function AppointmentsTab({ user, token }: Props) {
  const [appointments, setAppointments] = useState<CounselorAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<AppointmentFilter>('All');
  const [detailsModalAppt, setDetailsModalAppt] = useState<CounselorAppointment | null>(null);
  const [cancelModalAppt, setCancelModalAppt] = useState<CounselorAppointment | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const fetchAppointments = useCallback(async (showLoading = true) => {
    const counselorId = user.userName;
    if (!counselorId || !token) return;

    try {
      if (showLoading) setLoading(true);
      setError(null);
      const data = await getCounselorAppointments(counselorId, token);
      setAppointments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load appointments.');
    } finally {
      if (showLoading) setLoading(false);
    }
  }, [user, token]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

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

  const handleCancelConfirm = async (reason: string) => {
    if (!cancelModalAppt) return;

    setIsSubmitting(true);
    const toastId = toast.loading('Cancelling appointment...');

    try {
      const payload: CancelAppointmentPayload = {
        userId: user.userName,
        appointmentId: cancelModalAppt.appointmentId,
        receiverFcmToken: cancelModalAppt.userFCMToken || null,
        reason: reason,
      };

      await cancelAppointment(payload, token);
      
      toast.success('Appointment cancelled.', { id: toastId });
      setCancelModalAppt(null);
      await fetchAppointments(false);
      
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to cancel.', { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
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
        <div className="text-center py-16 text-red-500">{error}</div>
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