export interface Transaction {
  type: 'credit' | 'debit';
  amount: number;
  timestamp: number;
  description: string;
  paymentId: string;
  counsellorId: string;
  userId: string;
  method: string;
  status: string;
}

export interface ActivityLog {
  activity: string;
  timestamp: {
    seconds: number;
    nanos: number;
  };
  id: string;
  photo: string | null;
  activityType: 'subscribe' | 'appointment' | 'cancel' | 'reschedule';
  activitySenderId: string;
  activitySenderRole: string;
}

export interface User {
  userName: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  walletAmount: number;
  transactions: Transaction[];
  activityLog: ActivityLog[]; 
  role: string;
  photo: string | null;
  photoSmall: string | null;
  userInterestedStateOfCounsellors: string[] | null;
  interestedCourse: string | null;
  subscribedCounsellors: Subscription[] | null;
}

export interface Subscription {
  counsellorId: string;
  plan: string;
  subscriptionMode: string;
}