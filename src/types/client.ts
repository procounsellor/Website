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

export interface Client {
  id: string;
  name: string;
  imageUrl: string;
  course: string;
  preferredStates: string[];
  manualSubscriptionRequestId?: string;
}