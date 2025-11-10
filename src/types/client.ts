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
  counsellorId: string;
  plan: string;
  amount: number;
  status: string;
  createdAt: {
    seconds: number;
    nanos: number;
  };
  subscriptionType: string;
}

export interface Client {
  id: string;
  name: string;
  imageUrl: string;
  course: string;
  plan?: string;
  amount?: number;
  createdAt?: Date;
  interestedStates?: string[];
  manualSubscriptionRequestId?: string;
}