export interface CounsellorApiResponse {
  counsellorId: string;
  firstName: string;
  lastName: string;
  photoUrlSmall: string | null;
  rating: number | null;
  ratePerYear: number | null;
  experience: string | null;
  languagesKnow: string[];
  city: string;
  workingDays: string[];
  plan: string | null;
  numberOfRatings: string;
}


export interface Counselor {
  id: string;
  name: string;
  description: string;
  experience: string;
  imageUrl: string;
  verified: boolean;
}


export interface AllCounselor {
  id: string;
  name: string;
  description: string;
  experience: string;
  imageUrl: string;
  location: string;
  rating: number;
  reviews: number;
  rate: string;
}
