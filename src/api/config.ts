export const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_BASE_URL,
  authUrl: import.meta.env.VITE_API_AUTH_URL,
  chatbotUrl: import.meta.env.VITE_CHATBOT_API_URL,
  endpoints: {
    getCounsellors: '/api/shared/getAllCounsellors',
    getCounsellorById: '/api/shared/getCounsellorById',
    getCounsellorNonAvailability: '/api/user/counsellorNonAvailability',
    bookAppointment: '/api/user/book',
    getExams: '/api/exams/all',
    getCourses: '/api/courses/all',
    getColleges: '/api/colleges/all',
    getQuestionsList: '/api/community/dashboard/getQuestionsList'
  },
  defaultTimeout: 10000,
} as const;
