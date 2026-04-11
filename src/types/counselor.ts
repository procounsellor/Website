export interface CounselorPageInfo {
  "Why Join?": string[];
  "Become a Counsellor on ProCounsel": string[];
  "What Happens When You Switch": string[];
  "Steps to Get Started": string[];
}

export interface CounselorPageApiResponse {
  points: CounselorPageInfo;
}

export interface CounselorFormData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  password: string;
  organisation: string;
  city: string;
  languagesKnown: string[];
  workingDays: string[];
  officeStartTime: string;
  officeEndTime: string;
  phoneOtpVerified: boolean;
  emailOtpVerified: boolean;
  expertise: string[];
  stateOfCounsellor: string[];
}