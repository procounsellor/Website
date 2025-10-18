export interface ApiClient {
    userId: string;
    firstName: string;
    lastName: string;
    course: string;
    userInterestedStateOfCounsellors: string[];
    photoSmall: string | null;
    plan: string;
    manualSubscriptionRequestId?: string; 
}
export interface ApiPendingRequest {
  manualSubscriptionRequestId: string;
  userId: string;
  userFullName: string;
  userSmallPhotoUrl: string | null;
  userInterestedCourse: string;
}

export interface Client {
  id: string;
  name: string;
  imageUrl: string;
  course: string;
  preferredStates: string[];
  manualSubscriptionRequestId?: string;
}