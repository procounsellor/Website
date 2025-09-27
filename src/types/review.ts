export interface Review {
  reviewId: string;
  counsellorFullName: string;
  counsellorPhotoUrl: string;
  reviewText: string;
  rating: number;
  timestamp: {
    seconds: number;
    nanos: number;
  };
}