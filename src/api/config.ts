export const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'https://procounsellor-backend-1000407154647.asia-south1.run.app',
  endpoints: {
    getCounsellors: '/api/shared/getAllCounsellors',
    getExams: '/api/exams/all',
    getCourses: '/api/courses/all',
    getColleges: '/api/colleges/all',

  },
  defaultTimeout: 10000,
} as const;
