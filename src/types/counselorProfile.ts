import type { ActivityLog } from "@/types/user";
import type { Transaction } from "@/types/earnings";
export interface FullOfficeAddress {
  role: string | null;
  officeNameFloorBuildingAndArea: string | null;
  city: string | null;
  state: string | null;
  pinCode: string | null;
  latCoordinate: number | null;
  longCoordinate: number | null;
}

export interface CounselorProfileData {
  userName: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  phoneOtpVerified: boolean;
  emailOtpVerified: boolean;
  expertise: string[];
  stateOfCounsellor: string[];
  role: string;
  description: string;
  organisationName: string;
  fullOfficeAddress: FullOfficeAddress;
  workingDays: string[];
  officeStartTime: string;
  officeEndTime: string;
  experience: string;
  photoUrl: string;
  languagesKnow: string[];
  plusAmount: number;
  proAmount: number;
  eliteAmount: number;
  plusSeats: string;
  proSeats: string;
  eliteSeats: string;
  verified: boolean;
  photoUrlSmall: string;
  walletAmount: number;
  transactions: Transaction[];
  offlineTransactions: Transaction[];
  activityLog: ActivityLog[];
}