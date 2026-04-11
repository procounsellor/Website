export interface Counsellor {
  counsellorId: string;
  firstName: string;
  lastName: string;
  photoUrlSmall: string | null;
  rating: number;
  ratePerYear: number;
  experience: string;
  languagesKnow: string[] | null;
  city: string | null;
  workingDays: string[] | null;
  plan: string | null;
  subscriptionMode: string | null;
  numberOfRatings: string;
  states: string[] | null;
}