import { useState, useEffect } from 'react';
import type { Appointment } from '@/types/appointment';
import { useAuthStore } from '@/store/AuthStore';
import { getUserAppointments } from '@/api/appointment';
import AppointmentCard from './AppointmentCard';
import { Loader2 } from 'lucide-react';

const AppointmentsTab: React.FC = () => {
  const { userId } = useAuthStore();
  const token = localStorage.getItem('jwt');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
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
        const data = await getUserAppointments(userId, token);
        // Sort by date, most recent first
        data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setAppointments(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch appointments.');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [userId, token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-blue-800" />
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
    <div>
      {appointments.length > 0 ? (
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <AppointmentCard key={appointment.appointmentId} appointment={appointment} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl border border-[#EFEFEF]">
          <h3 className="text-lg font-semibold text-gray-700">No Appointments Found</h3>
          <p className="text-gray-500 mt-2">You have not booked any appointments yet.</p>
        </div>
      )}
    </div>
  );
};

export default AppointmentsTab;