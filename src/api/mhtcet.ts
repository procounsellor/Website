import axios from "axios";

const PREDICTOR_BASE_URL = "https://chatbot-backend-364445951625.asia-south1.run.app";

export interface MHTCETCollegePredictionRequest {
  marks?: number;
  percentile?: number;
  rank?: number;
  category: string;
  branch: string;
  top_n: number;
}

export interface MHTCETCollegeItem {
  college: string;
  branches: string[];
  best_closing_rank: number;
  best_closing_percentile: number;
  chance: string;
}

export interface MHTCETCollegePredictionResponse {
  estimated_rank: number;
  colleges: MHTCETCollegeItem[];
}

const TRANSIENT_STATUSES = [429, 500, 502, 503, 504];
const MAX_RETRIES = 2;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// A 503/502/504 from Cloud Run (cold start / overload) comes back with NO CORS
// header, so the browser surfaces it as a network error with no `response`.
// Treat both "no response" and transient status codes as retryable.
function isTransient(error: unknown): boolean {
  if (!axios.isAxiosError(error)) return false;
  if (!error.response) return true; // network / CORS-blocked / timeout
  return TRANSIENT_STATUSES.includes(error.response.status);
}

function toFriendlyError(error: unknown): Error {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 422) {
      const detail = error.response.data?.detail;
      if (Array.isArray(detail) && detail.length > 0) {
        return new Error(
          detail
            .map((err: { msg?: string }) => err.msg || "Validation error")
            .join(", ")
        );
      }
    }
    if (error.code === "ECONNABORTED") {
      return new Error("The request timed out. Please try again.");
    }
    if (error.response?.status === 429) {
      return new Error(
        "Too many requests right now. Please wait a moment and try again."
      );
    }
    // No response (network/CORS) or 5xx => server is busy/unreachable.
    if (!error.response || error.response.status >= 500) {
      return new Error(
        "Our prediction server is busy right now. Please try again in a few seconds."
      );
    }
    return new Error(
      error.response?.data?.detail ||
        error.message ||
        "Failed to predict colleges"
    );
  }
  return new Error("Failed to predict colleges");
}

export async function predictMHTCETColleges(
  data: MHTCETCollegePredictionRequest
): Promise<MHTCETCollegePredictionResponse> {
  const endpoint = `${PREDICTOR_BASE_URL}/mah-cet/predict-colleges`;
  let lastError: unknown;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await axios.post<MHTCETCollegePredictionResponse>(
        endpoint,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 30000,
        }
      );
      return response.data;
    } catch (error) {
      lastError = error;
      // Don't retry validation/client errors, and stop after the last attempt.
      if (!isTransient(error) || attempt === MAX_RETRIES) break;
      // Exponential backoff: ~700ms, then ~1400ms, with a little jitter.
      await sleep(700 * Math.pow(2, attempt) + Math.floor(Math.random() * 300));
    }
  }

  throw toFriendlyError(lastError);
}
