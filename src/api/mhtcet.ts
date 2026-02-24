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

export async function predictMHTCETColleges(
  data: MHTCETCollegePredictionRequest
): Promise<MHTCETCollegePredictionResponse> {
  try {
    const endpoint = `${PREDICTOR_BASE_URL}/mah-cet/predict-colleges`;

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
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 422) {
        const detail = error.response.data?.detail;
        if (Array.isArray(detail) && detail.length > 0) {
          const errorMsg = detail
            .map((err: { msg?: string }) => err.msg || "Validation error")
            .join(", ");
          throw new Error(errorMsg);
        }
      }
      throw new Error(
        error.response?.data?.detail ||
          error.message ||
          "Failed to predict colleges"
      );
    }
    throw new Error("Failed to predict colleges");
  }
}
