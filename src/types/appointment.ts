export interface Appointment {
  appointmentId: string;
  userId: string;
  counsellorId: string;
  counsellorFullName: string;
  counsellorPhootoSmall: string | null;
  date: string; 
  startTime: string;
  endTime: string;
  mode: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  counsellorFCMToken: string;
}