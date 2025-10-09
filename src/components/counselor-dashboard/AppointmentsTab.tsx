import { useState, useEffect, useMemo, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/AuthStore';
import { getCounselorAppointments } from '@/api/counselor-Dashboard';
import type { CounselorAppointment } from '@/types/appointments';
import AppointmentCard from './AppointmentCard';

type AppointmentFilter = 'All' | 'Upcoming' | 'Completed' | 'Cancelled';

export default function AppointmentsTab() {
  const { userId } = useAuthStore();
  const [appointments, setAppointments] = useState<CounselorAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<AppointmentFilter>('All');

  const fetchAppointments = useCallback(async () => {
    const counselorId = '9470988669';
    try {
      setLoading(true);
      setError(null);
      const data = await getCounselorAppointments(counselorId);
      // data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setAppointments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load appointments.');
    } finally {
      setLoading(false);
    }
  }, [userId]);

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

  const TABS: AppointmentFilter[] = ['All', 'Upcoming', 'Completed', 'Cancelled'];

  return (
    <div className="bg-white p-6 rounded-2xl border border-[#EFEFEF]">
      <div className="flex items-center gap-4 mb-6">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={`px-4 py-2 text-base font-medium rounded-full transition-colors duration-200 ${
              activeFilter === tab 
              ? 'bg-[#E8E7F2] text-[#13097D]' 
              : 'bg-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#13097D]" /></div>
      ) : error ? (
        <div className="text-center py-16 text-red-500">{error}</div>
      ) : (
        <div className="divide-y divide-gray-200">
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map(app => <AppointmentCard key={app.appointmentId} appointment={app} />)
          ) : (
            <div className="text-center py-16 text-gray-500">No {activeFilter.toLowerCase()} appointments found.</div>
          )}
        </div>
      )}
    </div>
  );
}