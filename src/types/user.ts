export interface Transaction {
  type: 'credit' | 'debit';
  amount: number;
  timestamp: number;
  description: string;
  paymentId: string;
  counsellorId: string | null;
  userId: string;
  method: string; 
  status: string;
}

export interface TimestampObject {
  seconds: number;
  nanos: number;
}

export type ActivityType = 'subscribe' | 'appointment' | 'cancel' | 'reschedule' | string;

export interface ActivityLog {
  activity: string;
  timestamp: TimestampObject;
  id: string;
  photo: string | null;
  activityType: ActivityType;
  activitySenderId: string;
  activitySenderRole: string;
}

export interface SubscribedCounsellor {
  counsellorId: string;
  plan: 'plus' | 'pro' | 'elite' | string;
  subscriptionMode: 'online' | 'offline' | string;
}

export interface ChatId {
  user1: string;
  user2: string;
  chatId: string;
}

export interface BankDetails {
  name?: string | null;
  accountNumber?: string | null;
  ifsc?: string | null;
  [key: string]: unknown;
}

export interface User {
  userName: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  password?: string | null;
  walletAmount: number;
  transactions: Transaction[];
  offlineTransactions: Transaction[];
  bankDetails?: BankDetails | null;
  role: string;
  verified?: boolean;
  activityLog: ActivityLog[];
  callHistory?: unknown | null;
  photo: string | null;
  photoSmall: string | null;
  userInterestedStateOfCounsellors: string[] | null;
  interestedCourse: string | null;
  subscribedCounsellors?: SubscribedCounsellor[] | null;
  followedCounsellorsIds?: string[] | null;
  friendIds?: string[] | null;
  interestedColleges?: unknown[] | null;
  favouriteColleges?: unknown[] | null;
  interestedLocationsForCollege?: unknown[] | null;
  userReviewIds?: unknown[] | null;
  chatIdsCreatedForUser?: ChatId[] | null;
  languagesKnow?: string[] | null;
  fcmToken?: string | null;
  voipToken?: string | null;
  platform?: string | null;
  currectCallUUID?: string | null;
  appointmentIds?: string[] | null;
  favouriteCounsellorIds?: string[];
  verifiedEmail?: boolean;
  referralCode?: string | null;
  dateCreated?: TimestampObject | number | null;
  lastDateAndTimeModified?: TimestampObject | null;
  lastLoginDateAndTime?: TimestampObject | null;
  [key: string]: unknown;
}

export interface Subscription {
  counsellorId: string;
  plan: string;
  subscriptionMode: string;
}

export interface PlanDetailsResponse {
  plus: string[];
  pro: string[];
  elite: string[];
  desc: { plus: string; pro: string; elite: string; };
  prices: { plus: string; pro: string; elite: string; };
  seats: { plus: string; pro: string; elite: string; };
  benefits: Array<{ name: string; plus: string; pro: string; elite: string; }>;
}