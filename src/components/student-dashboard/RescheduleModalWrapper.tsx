import { useState, useEffect } from 'react';
import type { Appointment } from '@/types/appointment';
import type { CounselorDetails } from '@/types/academic';
import { academicApi } from '@/api/academic';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import AppointmentBookingModal from '@/components/appointment-cards/AppointmentCard';

interface Props {
  appointment: Appointment | null;
  onClose: () => void;
  onRescheduleSuccess: () => void;
}

export default function RescheduleModalWrapper({ 
  appointment, 
  onClose, 
  onRescheduleSuccess 
}: Props) {
  const [counselor, setCounselor] = useState<CounselorDetails | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (appointment) {
      setLoading(true);
      academicApi.getCounselorById(appointment.counsellorId)
        .then(details => {
          setCounselor(details);
        })
        .catch(err => {
          console.error("Failed to fetch counselor details for reschedule:", err);
          toast.error("Could not load counselor details. Please try again.");
          onClose();
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setCounselor(null);
    }
  }, [appointment, onClose]);

  if (!appointment) return null;

  if (loading) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-centers bg-opacity-50 backdrop-blur-sm">
        <Loader2 className="w-12 h-12 animate-spin text-white" />
      </div>
    );
  }

  if (!counselor) {
    return null; 
  }

  return (
    <AppointmentBookingModal 
      counselor={counselor}
      onClose={onClose}
      isReschedule={true}
      appointmentToReschedule={appointment}
      onRescheduleSuccess={onRescheduleSuccess}
    />
  );
}