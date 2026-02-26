export interface CounselorReview {
  reviewId: string;
  userFullName: string;
  userPhotoUrl: string;
  reviewText: string;
  rating: number;
  timestamp: {
    seconds: number;
    nanos: number;
  };
  userName: string;
}