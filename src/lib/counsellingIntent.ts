// Persists which category counselling page a visitor asked for counselling
// from, so the lead captured at login (POST /api/leads/captureLead) says what
// they actually wanted rather than just "website login".
//
// Same shape and lifetime as predictorIntent.ts: last-touch, because the most
// recent thing someone asked about is the most useful thing to call them about.
// Distinct from leadSource.ts, which is first-touch attribution.

const INTENT_KEY = "pc_counselling_intent";

export interface CounsellingIntent {
  /** Category slug, e.g. "mba-counselling". */
  slug: string;
  /** Display name, e.g. "MBA Counselling" — used in the lead remark. */
  name: string;
  /** Counsellor expertise values the visitor was filtered to. */
  expertise: string[];
  /** The page the request came from, e.g. "/mba-counselling". */
  fromPath: string;
  /** Set when they clicked a specific counsellor rather than the generic CTA. */
  counsellorName?: string;
  /** Encoded id of that counsellor, so the caller can open the same profile. */
  counsellorId?: string;
}

export function persistCounsellingIntent(intent: CounsellingIntent) {
  try {
    localStorage.setItem(INTENT_KEY, JSON.stringify(intent));
  } catch {
    // storage unavailable (private mode) — ignore
  }
}

export function getCounsellingIntent(): CounsellingIntent | null {
  try {
    const raw = localStorage.getItem(INTENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.slug) return null;
    return parsed as CounsellingIntent;
  } catch {
    return null;
  }
}

/** Compact one-liner for the lead's remarks field. */
export function formatCounsellingRemark(intent: CounsellingIntent): string {
  const base = `Requested ${intent.name} from ${intent.fromPath}`;
  // Naming the counsellor they clicked makes the follow-up call specific:
  // "you were looking at <name>" converts better than a generic callback.
  return intent.counsellorName
    ? `${base} — opened ${intent.counsellorName}'s profile`
    : base;
}
