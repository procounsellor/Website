export const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_BASE_URL,
  authUrl: import.meta.env.VITE_API_AUTH_URL,
  endpoints: {
    getCounsellors: '/api/shared/getAllCounsellors',
    getCounsellorById: '/api/shared/getCounsellorById',
    getExams: '/api/exams/all',
    getCourses: '/api/courses/all',
    getColleges: '/api/colleges/all',
  },
  defaultTimeout: 10000,
} as const;
