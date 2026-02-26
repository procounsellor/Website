import { API_CONFIG } from "./config";

const getAuthHeaders = () => {
  const token = localStorage.getItem("jwt");
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
    "Content-Type": "application/json",
  };
};

export const getAllQuestionsUserOfAllSection = async (
  userId: string,
  testSeriesId: string
) => {
  const response = await fetch(
    `${API_CONFIG.baseUrl}/api/userTestSeries/getAllQuestionsUserOfAllSection?userId=${userId}&testSeriesId=${testSeriesId}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );
  return response.json();
};

export const getTestSeriesByIdForUser = async (
  userId: string,
  testSeriesId: string
) => {
  const response = await fetch(
    `${API_CONFIG.baseUrl}/api/userTestSeries/getTestSeriesByIdForUser?userId=${userId}&testSeriesId=${testSeriesId}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );
  return response.json();
};

export const startTest = async (userId: string, testSeriesId: string) => {
  const response = await fetch(
    `${API_CONFIG.baseUrl}/api/userTestSeries/startTest`,
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ userId, testSeriesId }),
    }
  );
  return response.json();
};

export const saveOrMarkForReviewAnswer = async (payload: {
  attemptId: string;
  userId: string;
  sectionName: string;
  questionId: string;
  answerIds: string[];
  status: "ATTEMPTED" | "MARKED_FOR_REVIEW";
  elapsedTime: number; // Time spent on question in seconds
}) => {
  const response = await fetch(
    `${API_CONFIG.baseUrl}/api/userTestSeries/saveOrMarkForReviewAnswer`,
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    }
  );
  return response.json();
};

export const submitTestAndCalculateScore = async (
  userId: string,
  attemptId: string
) => {
  const response = await fetch(
    `${API_CONFIG.baseUrl}/api/userTestSeries/submitTestAndCalculateScore`,
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ userId, attemptId }),
    }
  );
  return response.json();
};

export const resumeTest = async (userId: string, attemptId: string) => {
  const response = await fetch(
    `${API_CONFIG.baseUrl}/api/userTestSeries/resumeTest`,
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ userId, attemptId }),
    }
  );
  return response.json();
};

export const compareAnswers = async (userId: string, attemptId: string) => {
  const response = await fetch(
    `${API_CONFIG.baseUrl}/api/userTestSeries/compareAnswers`,
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ userId, attemptId }),
    }
  );
  return response.json();
};

export const resetAnswer = async (
  userId: string,
  questionId: string,
  attemptId: string,
  sectionName: string
) => {
  const response = await fetch(
    `${API_CONFIG.baseUrl}/api/userTestSeries/resetAnswer`,
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ userId, questionId, attemptId, sectionName }),
    }
  );
  return response.json();
};
