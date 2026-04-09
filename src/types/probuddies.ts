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

  links: string[] | null;

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
  reviewId?: string;
  userId?: string;
  userName?: string | null;
  reviewText?: string | null;
  rating?: number | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  [key: string]: unknown;
}

export interface AboutMe {
  heading: string;
  subHeading: string;
  aboutMe: string;
}

export interface Offerings {
  Attendance: number;
  "Campus Vibe": number;
  "Mess Food": number;
  "Faculty Quality": number;
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