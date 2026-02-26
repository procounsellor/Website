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
  status: 'booked' | 'rescheduled' | 'completed' | 'cancelled';
  counsellorFCMToken: string;
}

export interface AppointmentDetails extends Appointment {
  notes: string | null;
  counsellorRemarks: string | null;
  createdAt: { seconds: number; nanos: number; };
  updatedAt: { seconds: number; nanos: number; };
  userAttended: boolean;
  userRating: number | null;
  userFeedback: string | null;
  zoomMeetingLink: string | null;
}