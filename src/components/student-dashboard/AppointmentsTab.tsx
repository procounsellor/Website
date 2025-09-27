import { useState, useEffect, useMemo } from 'react';
import type { Appointment } from '@/types/appointment';
import { useAuthStore } from '@/store/AuthStore';
import { getUserAppointments, getUpcomingAppointments } from '@/api/appointment';
import AppointmentCard from './AppointmentCard';
import { Loader2 } from 'lucide-react';

type AppointmentFilter = 'All' | 'Upcoming' | 'Completed' | 'Cancelled';

const AppointmentsTab: React.FC = () => {
  const { userId } = useAuthStore();
  const token = localStorage.getItem('jwt');
  
  const [allAppointments, setAllAppointments] = useState<Appointment[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [activeFilter, setActiveFilter] = useState<AppointmentFilter>('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!userId || !token) {
        setError("User not authenticated.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const [allData, upcomingData] = await Promise.all([
          getUserAppointments(userId, token),
          getUpcomingAppointments(userId, token)
        ]);
        
        allData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        upcomingData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        setAllAppointments(allData);
        setUpcomingAppointments(upcomingData);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch appointments.');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [userId, token]);

  const filteredAppointments = useMemo(() => {
    switch (activeFilter) {
      case 'Upcoming':
        return upcomingAppointments;
      case 'Completed':
        return allAppointments.filter(app => app.status === 'completed');
      case 'Cancelled':
        return allAppointments.filter(app => app.status === 'cancelled');
      case 'All':
      default:
        return allAppointments;
    }
  }, [activeFilter, allAppointments, upcomingAppointments]);

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
    <div className="bg-white p-6 rounded-2xl border border-[#EFEFEF]">
      <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-6">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={`px-4 py-2 text-base font-medium rounded-full transition-colors duration-200 ${
              activeFilter === tab 
              ? 'bg-[#E8E7F2] text-[#13097D]' 
              : 'bg-transparent text-[#13097D]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className='-mt-6'>
      {filteredAppointments.length > 0 ? (
        <div className="divide-y divide-gray-200">
          {filteredAppointments.map((appointment) => (
            <AppointmentCard key={appointment.appointmentId} appointment={appointment} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <h3 className="text-lg font-semibold text-gray-700">No Appointments Found</h3>
          <p className="text-gray-500 mt-2">There are no {activeFilter.toLowerCase()} appointments.</p>
        </div>
      )}
      </div>
    </div>
  );
};

export default AppointmentsTab;