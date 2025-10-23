// Single appointment type
export type Appointment = {
  appointmentId: string;
  userId: string;
  counsellorId: string;
  userFullName: string;
  userPhootoSmall: string;
  userCourse: string;
  date: string;       // "yyyy-MM-dd"
  startTime: string;  // "HH:mm"
  endTime: string;    // "HH:mm"
  mode: "offline" | "online";
  status: "booked" | "rescheduled" | "cancelled";
  userFCMToken: string;
};

// Hour key type: "HH:00"
export type HourKey = string;

// Day key type: "yyyy-MM-dd"
export type DayKey = string;

// Grouped appointments: day → hour → appointments array
export type GroupedAppointments = Record<DayKey, Record<HourKey, Appointment[]>>;

// Out of Office type
export type OutOfOffice = {
  id: string;
  counsellorId: string;
  reason: string;
  startDate: string;  // "yyyy-MM-dd"
  endDate: string;    // "yyyy-MM-dd"
  startTime: string;  // "HH:mm"
  endTime: string;    // "HH:mm"
  createdAt: {
    seconds: number;
    nanos: number;
  };
};

export interface OutOfOfficePayload {
  counsellorId: string;
  reason: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
};

export type CounselorAppointment = {
  appointmentId: string;
  userId: string;
  counsellorId: string;
  userFullName: string;
  userPhootoSmall: string;
  userCourse: string;         
  date: string;
  startTime: string;
  endTime: string;
  mode: "offline" | "online";
  status: "booked" | "rescheduled" | "cancelled" | "completed";
  userFCMToken: string;
};

export interface CancelAppointmentPayload {
  userId: string;
  appointmentId: string;
  receiverFcmToken: string | null;
  reason: string;
}
