import axios from "axios";

// In dev we route through the Vite proxy (/neet-api) so requests are same-origin
// and don't hit CORS. In production the API itself must send CORS headers.
const NEET_PREDICTOR_BASE_URL = import.meta.env.DEV
  ? "/neet-api"
  : "https://neet-rank-predictor-two.vercel.app";

/* ------------------------------------------------------------------ */
/*  Rank Predictor                                                     */
/* ------------------------------------------------------------------ */

export interface NEETRankPredictionResponse {
  marks: number;
  year: number;
  predicted_rank: number;
  rank_range: string;
  rank_min: number;
  rank_max: number;
}

export async function predictNEETRank(params: {
  marks: number;
  year?: number;
}): Promise<NEETRankPredictionResponse> {
  try {
    const response = await axios.get<NEETRankPredictionResponse>(
      `${NEET_PREDICTOR_BASE_URL}/api/predict-rank`,
      {
        params: { marks: params.marks, year: params.year ?? 2025 },
        timeout: 30000,
      },
    );
    return response.data;
  } catch (error) {
    throw normalizeNEETError(error, "Failed to predict rank");
  }
}

/* ------------------------------------------------------------------ */
/*  College Predictor                                                  */
/* ------------------------------------------------------------------ */

export interface NEETCollege {
  college: string;
  state: string;
  type: string;
  quota: string;
  category: string;
  year: number;
  closing_rank: number;
  seats: number;
  closing_score: number;
  diff: number;
  probability: number;
  chance: string;
  url: string;
}

export interface NEETCollegePredictionResponse {
  rank: number;
  category: string;
  quota: string;
  state: string;
  count: number;
  colleges: NEETCollege[];
}

export async function predictNEETColleges(params: {
  rank: number;
  category?: string;
  quota?: string;
  state?: string;
  limit?: number;
}): Promise<NEETCollegePredictionResponse> {
  try {
    const response = await axios.get<NEETCollegePredictionResponse>(
      `${NEET_PREDICTOR_BASE_URL}/api/predict-colleges`,
      {
        params: {
          rank: params.rank,
          category: params.category ?? "GN",
          quota: params.quota ?? "AIQ",
          state: params.state ?? "All",
          limit: params.limit ?? 100,
        },
        timeout: 30000,
      },
    );
    return response.data;
  } catch (error) {
    throw normalizeNEETError(error, "Failed to predict colleges");
  }
}

/* ------------------------------------------------------------------ */
/*  Dropdown option sets                                               */
/*  (stable values mirrored from GET /api/options)                    */
/* ------------------------------------------------------------------ */

export const NEET_CATEGORIES: { value: string; label: string }[] = [
  { value: "GN", label: "General" },
  { value: "EWS", label: "EWS" },
  { value: "OBC", label: "OBC" },
  { value: "SC", label: "SC" },
  { value: "ST", label: "ST" },
  { value: "GN-PH", label: "General (PwD)" },
  { value: "EWS-PH", label: "EWS (PwD)" },
  { value: "OBC-PH", label: "OBC (PwD)" },
  { value: "SC-PH", label: "SC (PwD)" },
  { value: "ST-PH", label: "ST (PwD)" },
];

export const NEET_QUOTAS: { value: string; label: string }[] = [
  { value: "AIQ", label: "All India Quota" },
  { value: "SQ", label: "State Quota" },
  { value: "MQ", label: "Management Quota" },
  { value: "MNQ", label: "Management / NRI Quota" },
  { value: "NRI", label: "NRI Quota" },
  { value: "AMQ", label: "AMU Quota" },
  { value: "AMU", label: "AMU Internal" },
  { value: "OPMQ", label: "Open Management Quota" },
  { value: "OPQ", label: "Open Quota" },
];

export const NEET_STATES: string[] = [
  "All",
  "Andaman",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Dadra Nagar",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "JammuKashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function normalizeNEETError(error: unknown, fallback: string): Error {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 422) {
      const detail = error.response.data?.detail;
      if (Array.isArray(detail) && detail.length > 0) {
        return new Error(
          detail.map((err: any) => err.msg || "Validation error").join(", "),
        );
      }
    }
    return new Error(
      error.response?.data?.detail || error.message || fallback,
    );
  }
  return new Error(fallback);
}

/**
 * Rough offline estimate of NEET rank from marks (out of 720).
 * Used only for the blurred, non-authenticated preview so real
 * cutoff data stays behind login.
 */
export function estimateNEETRank(marks: number): number {
  const clamped = Math.max(0, Math.min(720, marks));
  // Piecewise approximation loosely based on NEET 2024/25 marks-vs-rank trends.
  const points: [number, number][] = [
    [720, 1],
    [700, 25],
    [680, 200],
    [650, 1500],
    [600, 12000],
    [550, 40000],
    [500, 90000],
    [450, 170000],
    [400, 300000],
    [300, 700000],
    [200, 1100000],
    [0, 2000000],
  ];
  for (let i = 0; i < points.length - 1; i++) {
    const [m1, r1] = points[i];
    const [m2, r2] = points[i + 1];
    if (clamped <= m1 && clamped >= m2) {
      const t = (m1 - clamped) / (m1 - m2 || 1);
      return Math.max(1, Math.round(r1 + (r2 - r1) * t));
    }
  }
  return 1000000;
}
