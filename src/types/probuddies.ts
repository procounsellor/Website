export interface ListingProBudddy {
    proBuddyId: string | null;
    firstName: string | null;
    lastName: string | null;
    photoUrl: string | null;
    collegeName: string | null;
    currentYear: string | null;
    course: string | null;
    noOfRatingsReceived: string | null;
    rating: string | null;
    city: string | null;
    state: string | null;
    ratePerMinute: string | null;
    verified?: boolean;
}


export interface ProBuddyUserSide {
  proBuddyId: string;
  role: "proBuddy";

  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;

  photoUrl: string | null;

  collegeName: string;
  currentYear: string;
  course: string;

  noOfRatingsReceived: number | null;
  rating: number | null;

  city: string;
  state: string;

  languagesKnow: string[];

  aboutMe: AboutMe;

  whoShouldConnect: string;

  links: Array<ProBuddyLink | string> | null;

  offerings: Offerings;

  ratePerMinute: number | null;

  workingDays: WorkingDay[];
  officeStartTime: string; // "HH:mm"
  officeEndTime: string;   // "HH:mm"

  walletAmount: number;

  fcmToken: string | null;
  voipToken: string | null;

  verified: boolean;

  // Appended in frontend by profile API wrapper for profile page consumption.
  reviewsReceivedForUser?: ProBuddyReviewForUser[];
  reviewsCountForUser?: number;
}

export interface ProBuddyReviewForUser {
  reviewId: string;
  userId: string;
  userFullName: string | null;
  imageUrl: string | null;
  proBuddyId: string;
  proBuddyFullName: string | null;
  proBuddyImageUrl: string | null;
  reviewText: string | null;
  rating: number | null;
  timestamp: {
    seconds: number;
    nanos: number;
  } | null;
  timestampUpdated: {
    seconds: number;
    nanos: number;
  } | null;
  [key: string]: unknown;
}

export interface AboutMe {
  heading: string;
  subHeading: string;
  aboutMe: string;
}

export interface ProBuddyLink {
  type: string;
  url: string;
  title: string;
  thumbnailUrl: string | null;
}

export interface Offerings {
  [key: string]: number;
}

export type WorkingDay =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";



export interface PostReview{
    userId:string,
    proBuddyId:string,
    reviewText:string| null,
    rating:number
}

export interface ProBuddyProfileForProBuddy extends ProBuddyUserSide {
  priority: string | number | null;
  dateCreated?: {
    seconds: number;
    nanos: number;
  } | null;
  lastDateAndTimeModified?: {
    seconds: number;
    nanos: number;
  } | null;
  lastLoginDateAndTime?: {
    seconds: number;
    nanos: number;
  } | null;
  referralCode?: string | null;
  t3ReferralCode?: string | null;
  photoUrlSmall?: string | null;
  idCardPhotoUrl?: string | null;
  phoneOtpVerified?: boolean;
  emailOtpVerified?: boolean;
  collegeId?: string | null;
  platform?: string | null;
}
