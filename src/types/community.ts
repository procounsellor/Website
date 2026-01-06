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
  questionBookmarkedByMe?: boolean;
  userFullName: string;
  userPhotoUrl: string | null;
}

export interface GetQuestionsListResponse {
  data: CommunityQuestion[];
  nextPageToken: string | null;
  status: string;
}

export interface CommunityDashboardItem {
  userId: string;
  role: string;
  fullName: string;
  photoUrl: string | null;
  interestedCourse: string;
  questionId: string;
  questionTimestamp: FirebaseTimestamp;
  question: string;
  questionViews: number;
  answerCount: number;
  topAnswerId: string | null;
  topAnswer: string | null;
  likesCountOnAnswer: number;
  commentCountOnAnswer: number;
  answerPhotoUrl: string | null;
  commentIdsList: string[];
  myAnswer: boolean;
  answerLikedByMe: boolean;
  myQuestion: boolean;
  questionBookmarkedByMe: boolean;
  subject: string;
  questionUpdatedTimestamp: FirebaseTimestamp;
  questionUpdated: boolean;
}

export interface GetCommunityDashboardResponse {
  data: CommunityDashboardItem[];
  nextPageToken: string | null;
  status: string;
}

export interface Answer {
  answerId: string;
  answer: string;
  answerPhotoUrlList: string[];
  likesCountOnAnswer: number;
  commentCountOnAnswer: number;
  answerTimestamp: FirebaseTimestamp;
  updatedAnswerTimestamp: FirebaseTimestamp;
  userIdAnswered: string;
  userFullName: string;
  userPhotoUrl: string | null;
  userInterestedCourse: string;
  myAnswer: boolean;
  answerLikedByMe: boolean;
  answerUpdated: boolean;
}

export interface QuestionDetailData {
  questionAskeduserId: string;
  questionAskedFullName: string;
  questionAskedInterestedCourse: string;
  questionAskedPhotoUrl: string | null;
  loggedInUserId: string;
  loggedInUserFirstName: string;
  loggedInUserPhotoUrl: string | null;
  role: string;
  questionId: string;
  question: string;
  answerStructure: Answer[];
  timestamp: FirebaseTimestamp;
  questionBookmarkedByMe?: boolean;
  updatedTimestamp: FirebaseTimestamp;
  updated: boolean;
}

export interface GetAllAnswersResponse {
  status: string;
  data: QuestionDetailData;
}

export interface AskQuestionResponse {
  questionId: string;
  subject: string;
  question: string;
  userId: string;
  role: string;
  listOfAnswersId: string[];
  answerCount: number;
  questionTimestamp: FirebaseTimestamp;
  questionTimestampUpdated: FirebaseTimestamp;
  views: number;
  bookmarkCount: number;
  questionIsDeleted: boolean;
  questionDeletedOn: FirebaseTimestamp | null;
  flaggedReason: string | null;
  flaggedBy: string | null;
  answered: boolean;
  anonymous: boolean;
  flagged: boolean;
}

export interface PostAnswerResponse {
  answerId: string;
  answer: string;
  answerPhotoUrlList: string[];
  likesCountOnAnswer: number;
  commentCountOnAnswer: number;
  answerTimestamp: FirebaseTimestamp;
  userIdAnswered: string;
  userFullName: string;
  userPhotoUrl: string | null;
  userInterestedCourse: string;
  myAnswer: boolean;
  answerLikedByMe: boolean;
}

export interface CommentReply {
  replyId: string;
  userIdReplied: string;
  userFullName: string;
  userPhotoUrl: string | null;
  replyText: string;
  likesCount: number;
  replyTo: string;
  myReply: boolean;
  replyLikedByMe: boolean;
  timestamp: FirebaseTimestamp;
  updatedTimestamp: FirebaseTimestamp;
  updated: boolean;
}

export interface Comment {
  commentId: string;
  userIdCommented: string;
  userFullName: string;
  userPhotoUrl: string | null;
  commentText: string;
  likesCount: number;
  commentLikedByMe: boolean;
  myComment: boolean;
  replyCount: number;
  commentTimestamp: FirebaseTimestamp;
  updatedCommentTimestamp: FirebaseTimestamp;
  updated: boolean;
}

export interface GetCommentsResponse {
  data: {
    answerId: string;
    comments: Comment[];
  };
  nextPageToken: string | null;
  status: string;
}

export interface GetRepliesResponse {
  data: {
    commentId: string;
    replies: CommentReply[];
  };
  nextPageToken: string | null;
  status: string;
}

export interface MyAnswerItem {
  userId: string;
  role: string;
  fullName: string;
  photoUrl: string | null;
  interestedCourse: string;
  question: string;
  questionId: string;
  questionTimestamp: FirebaseTimestamp;
  questionViews: number;
  answerCount: number;
  myAnswerId: string;
  myAnswer: string;
  likesCountOnAnswer: number;
  commentCountOnAnswer: number;
  answerPhotoUrl: string | null;
  commentIdsList: string[];
  answerLikedByMe: boolean;
  answerTimestamp: FirebaseTimestamp;
  answerUpdatedTimestamp: FirebaseTimestamp;
  answerUpdated: boolean;
}

export interface GetMyAnswersResponse {
  data: MyAnswerItem[];
  nextPageToken: string | null;
  status: string;
}