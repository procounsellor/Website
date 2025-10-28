export interface ApiReviewReceived {
    reviewId: string;
    userName: string;
    counsellorName: string;
    userFullName: string;
    userPhotoUrl: string | null;
    reviewText: string;
    rating: number;
    timestamp: {
        seconds: number;
        nanos: number;
    };
}

export interface ReviewReceived {
  id: string;
  userFullName: string;
  userImageUrl: string;
  rating: number;
  reviewText: string;
  timeAgo: string;
}