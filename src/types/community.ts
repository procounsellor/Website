export interface FirebaseTimestamp {
  seconds: number;
  nanos: number;
}

export interface CommunityQuestion {
  questionId: string;
  question: string;
  userIdQuestionAsked: string;
  timestamp: FirebaseTimestamp;
  myQuestion: boolean;
}

export interface GetQuestionsListResponse {
  data: CommunityQuestion[];
  nextPageToken: string | null;
  status: string;
}