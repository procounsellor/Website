import axios from "axios";

/**
 * Procounsel NEET Counselling API (v1).
 *
 * Base URL comes from `VITE_NEET_COUNSELLING_API_URL`. The API sends
 * `Access-Control-Allow-Origin: *`, so the browser can call it directly in
 * production; in dev we route through the Vite proxy (`/neet-v1`, see
 * vite.config.ts) so requests stay same-origin.
 *
 * This supersedes `src/api/neetV2.ts`. The shape is different enough that the
 * two are not interchangeable — this one returns richer college records
 * (fee tracks, round-wise closing ranks, official state cutoff provenance) and
 * a single `POST /predict` replaces the old rank + college + probability trio.
 *
 * Everything the API returns about cutoffs and fees is scraped from public
 * sources and carries a `detail` string naming that source. Show it. The data
 * is explicitly "verify before use", and presenting it as authoritative would
 * be worse than not showing it at all.
 */

const BASE_URL: string = import.meta.env.DEV
  ? "/neet-v1"
  : (import.meta.env.VITE_NEET_COUNSELLING_API_URL as string | undefined) ?? "";

if (!import.meta.env.DEV && !BASE_URL) {
  console.warn(
    "[ProCounsel] VITE_NEET_COUNSELLING_API_URL is not set; NEET predictor requests will fail.",
  );
}

const client = axios.create({ baseURL: `${BASE_URL}/api/v1`, timeout: 45000 });

/* ------------------------------------------------------------------ */
/*  Types — mirrored from live responses; the OpenAPI spec leaves      */
/*  response schemas empty, so these were derived by calling the API.  */
/* ------------------------------------------------------------------ */

export interface NEETFeeTrack {
  label: string;
  annual: number | null;
  total: number | null;
  approx: boolean;
  formatted_total: string;
}

/** A college row as returned by /colleges and, extended, by /predict. */
export interface NEETCollege {
  name: string;
  state: string;
  city: string;
  /** "Government" | "Private" | "Deemed" | "Official state cutoff" | ... */
  type: string;
  seats: string;
  established: string;
  closing_rank: number | null;
  fees: string;
  fee_tracks: NEETFeeTrack[];
  /** Round-wise closing ranks, e.g. { R1: 37586, R2: 39178 }. */
  rounds: Record<string, number> | null;
  /** Free-text provenance — always ends with the source. Always display it. */
  detail: string;
}

export interface NEETOfficialCutoff {
  exam: string;
  year: number;
  authority: string;
  state: string;
  counsellingType: string;
  round: string;
  quota: string;
  collegeCode: string;
  collegeName: string;
  course: string;
  category: string;
  openingRank: number | null;
  closingRank: number | null;
  allottedRows: number;
  sourceUrl: string;
}

/** Verdict tones the API has been observed to return. */
export type NEETChanceTone = "mint" | "lime" | "yellow" | "orange" | "red" | "danger";

export interface NEETPredictedCollege extends NEETCollege {
  /** "High chance" | "Good chance" | "Borderline" | ... */
  chance: string;
  tone: NEETChanceTone | string;
  fit_percent: number;
  cheapest_track: NEETFeeTrack | null;
  /** One-line explanation, e.g. "AIR 52,339 vs closing rank 39,256." */
  why: string;
  official_cutoff?: NEETOfficialCutoff;
}

export interface NEETCollegesResponse {
  total: number;
  limit: number;
  offset: number;
  items: NEETCollege[];
}

export type NEETCounsellingType = "State quota" | "Deemed counselling" | "All types";
export type NEETTargetType = "All types" | "Government" | "Private" | "Deemed";
export type NEETGender = "Female" | "Male";

export interface NEETPredictRequest {
  /** More accurate than a score when the student has their rank. */
  neet_air?: number | null;
  /** Used to estimate the AIR when `neet_air` is absent. */
  neet_score?: number | null;
  domicile?: string;
  category?: string;
  gender?: NEETGender;
  /** Free text the API parses, e.g. "60L", "80 lakh", "1 Cr". */
  budget?: string | null;
  counselling?: NEETCounsellingType;
  target_type?: NEETTargetType;
  limit?: number;
}

export interface NEETPredictResponse {
  input: NEETPredictRequest;
  rank_used: number;
  /** "AIR" when the rank was given, otherwise the estimate's label. */
  rank_label: string;
  budget_rupees: number | null;
  ranked_pool: number;
  unranked_pool: number;
  official_state_cutoff_pool: number;
  excluded_by_budget: number;
  category_warning: string | null;
  items: NEETPredictedCollege[];
}

export interface NEETScoreRankResponse {
  score: number;
  estimated_air: number;
  source: string;
  built_at: string;
}

/* ------------------------------------------------------------------ */
/*  Calls                                                              */
/* ------------------------------------------------------------------ */

/** Every state the college directory has records for. */
export async function getNEETStates(): Promise<string[]> {
  const { data } = await client.get<{ states: string[] }>("/states");
  return data?.states ?? [];
}

/**
 * College directory. Public — this is the half of the page that does not sit
 * behind the login gate, so a visitor can browse a state before committing.
 */
export async function getNEETColleges(params: {
  state?: string;
  college_type?: string;
  q?: string;
  limit?: number;
  offset?: number;
}): Promise<NEETCollegesResponse> {
  const { data } = await client.get<NEETCollegesResponse>("/colleges", {
    params: {
      state: params.state || undefined,
      college_type: params.college_type || undefined,
      q: params.q || undefined,
      limit: params.limit ?? 50,
      offset: params.offset ?? 0,
    },
  });
  return {
    total: data?.total ?? 0,
    limit: data?.limit ?? 0,
    offset: data?.offset ?? 0,
    items: data?.items ?? [],
  };
}

/** Score -> estimated All India Rank. Approximate; the response says so. */
export async function getEstimatedAIR(score: number): Promise<NEETScoreRankResponse> {
  const { data } = await client.get<NEETScoreRankResponse>("/score-rank", {
    params: { score },
  });
  return data;
}

/** The prediction itself. Login-gated at the call site, not here. */
export async function predictNEETColleges(
  body: NEETPredictRequest,
): Promise<NEETPredictResponse> {
  const { data } = await client.post<NEETPredictResponse>("/predict", {
    neet_air: body.neet_air ?? null,
    neet_score: body.neet_score ?? null,
    domicile: body.domicile || "All India",
    category: body.category || "General",
    gender: body.gender || "Female",
    budget: body.budget || null,
    counselling: body.counselling || "State quota",
    target_type: body.target_type || "All types",
    limit: body.limit ?? 24,
  });
  return data;
}

/**
 * Result of checking one specific college against a rank. `matched: false`
 * means the name did not resolve, and everything else is absent — always
 * branch on it before reading the college fields.
 *
 * `verdict` is "High chance" | "Good chance" | "Borderline" | "Low chance", or
 * "Verify" when the college has no imported closing rank at all. That last case
 * is not a failure: it means we genuinely do not know, and saying so is the
 * honest answer.
 */
export type NEETTargetCheckResponse =
  | { matched: false; message: string; suggestions?: string[] }
  | (NEETCollege & {
      matched: true;
      verdict: string;
      tone?: NEETChanceTone | string;
      message: string;
    });

export interface NEETTargetCheckRequest {
  college_name: string;
  target_state?: string | null;
  neet_air?: number | null;
  neet_score?: number | null;
  domicile?: string;
  category?: string;
  gender?: NEETGender;
  budget?: string | null;
  counselling?: NEETCounsellingType;
  target_type?: NEETTargetType;
}

/** "Can I get into this specific college?" — the dream-college check. */
export async function checkTargetCollege(
  body: NEETTargetCheckRequest,
): Promise<NEETTargetCheckResponse> {
  const { data } = await client.post<NEETTargetCheckResponse>("/target-college-check", {
    college_name: body.college_name,
    target_state: body.target_state || null,
    neet_air: body.neet_air ?? null,
    neet_score: body.neet_score ?? null,
    domicile: body.domicile || "All India",
    category: body.category || "General",
    gender: body.gender || "Female",
    budget: body.budget || null,
    counselling: body.counselling || "State quota",
    target_type: body.target_type || "All types",
  });
  return data;
}

/* ------------------------------------------------------------------ */
/*  Option values — enums from the OpenAPI spec, kept in one place     */
/* ------------------------------------------------------------------ */

export const NEET_CATEGORIES = ["General", "OBC", "SC", "ST", "EWS"] as const;

export const NEET_COUNSELLING_TYPES: NEETCounsellingType[] = [
  "State quota",
  "Deemed counselling",
  "All types",
];

export const NEET_TARGET_TYPES: NEETTargetType[] = [
  "All types",
  "Government",
  "Private",
  "Deemed",
];

export const NEET_GENDERS: NEETGender[] = ["Female", "Male"];

/** College-type filter values for the public directory. */
export const NEET_COLLEGE_TYPES = ["All types", "Government", "Private", "Deemed"] as const;

/* ------------------------------------------------------------------ */
/*  Presentation helpers                                               */
/* ------------------------------------------------------------------ */

/**
 * Tailwind classes per verdict tone. Unknown tones fall back to slate rather
 * than rendering an unstyled chip — the API owns this vocabulary and may add
 * to it.
 */
export function chanceToneClasses(tone: string): string {
  switch (tone) {
    case "mint":
      return "bg-emerald-50 text-emerald-700 ring-emerald-200";
    case "lime":
      return "bg-lime-50 text-lime-800 ring-lime-200";
    case "yellow":
      return "bg-amber-50 text-amber-800 ring-amber-200";
    case "orange":
      return "bg-orange-50 text-orange-800 ring-orange-200";
    case "red":
    case "danger":
      return "bg-rose-50 text-rose-700 ring-rose-200";
    default:
      return "bg-slate-100 text-slate-700 ring-slate-200";
  }
}

/** Indian-format rank, e.g. 52339 -> "52,339". */
export function formatRank(n: number | null | undefined): string {
  if (n === null || n === undefined || Number.isNaN(n)) return "—";
  return n.toLocaleString("en-IN");
}

/**
 * The fee a student would actually pay first, preferring the API's own
 * `cheapest_track` and falling back to the lowest annual track present.
 */
export function cheapestFee(college: NEETCollege | NEETPredictedCollege): NEETFeeTrack | null {
  const preset = (college as NEETPredictedCollege).cheapest_track;
  if (preset) return preset;
  const withTotals = college.fee_tracks.filter((t) => typeof t.total === "number");
  if (!withTotals.length) return null;
  return withTotals.reduce((a, b) => ((a.total ?? 0) <= (b.total ?? 0) ? a : b));
}

/**
 * The API appends "Source: ..." to `detail`. Split it so the card can show the
 * descriptive half prominently and the provenance quietly, without ever
 * dropping the provenance.
 */
export function splitDetail(detail: string): { body: string; source: string | null } {
  const idx = detail.indexOf("Source:");
  if (idx === -1) return { body: detail.trim(), source: null };
  return {
    body: detail.slice(0, idx).replace(/[·\s]+$/, "").trim(),
    source: detail.slice(idx).trim(),
  };
}
