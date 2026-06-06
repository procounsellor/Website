// Persists the visitor's first-touch source (referrer / UTM) so it can be
// attached to the lead captured at login time (POST /api/leads/captureLead).

const SOURCE_KEY = "pc_lead_source";
const LANDING_KEY = "pc_lead_landing";
const CAPTURED_KEY = "pc_lead_captured"; // phone numbers already sent as leads

export interface TrackedSource {
  source: string; // e.g. GOOGLE, INSTAGRAM, TWITTER, DIRECT, REFERRAL
  landingPage: string;
}

/**
 * Save the detected source on first visit only (first-touch attribution).
 * Subsequent visits never overwrite it.
 */
export function persistVisitSource(source: string, utmSource: string, landingPage: string) {
  try {
    // utm_source wins over referrer-derived source
    const raw = (utmSource || source || "direct").trim();
    const normalized = normalizeSource(raw);

    const existing = localStorage.getItem(SOURCE_KEY);
    // Keep the first meaningful touch. A stored DIRECT can be upgraded by a
    // later visit that has a real source (e.g. first visited directly, then
    // came back via a Quora/Instagram campaign link).
    if (existing && existing !== "DIRECT") return;
    if (existing === "DIRECT" && normalized === "DIRECT") return;

    localStorage.setItem(SOURCE_KEY, normalized);
    localStorage.setItem(LANDING_KEY, landingPage || "/");
    console.log("[ProCounsel] Lead source persisted:", normalized);
  } catch {
    // storage unavailable (private mode) — ignore
  }
}

/** Map tracked values to the backend's uppercase source enum style (QUORA, INSTAGRAM, TWITTER, ...). */
function normalizeSource(raw: string): string {
  const s = raw.toLowerCase();
  if (s.includes("twitter") || s === "x" || s.includes("x.com")) return "TWITTER";
  if (s.includes("instagram") || s === "ig") return "INSTAGRAM";
  if (s.includes("facebook") || s === "fb") return "FACEBOOK";
  if (s.includes("quora")) return "QUORA";
  if (s.includes("google")) return "GOOGLE";
  if (s.includes("youtube")) return "YOUTUBE";
  if (s.includes("linkedin")) return "LINKEDIN";
  if (s.includes("whatsapp")) return "WHATSAPP";
  if (s === "direct") return "DIRECT";
  // anything else (bing, yahoo, custom utm values, plain referral)
  return raw.toUpperCase().replace(/[^A-Z0-9]+/g, "_").replace(/^_+|_+$/g, "") || "DIRECT";
}

export function getTrackedSource(): TrackedSource {
  try {
    return {
      source: localStorage.getItem(SOURCE_KEY) || "DIRECT",
      landingPage: localStorage.getItem(LANDING_KEY) || "/",
    };
  } catch {
    return { source: "DIRECT", landingPage: "/" };
  }
}

/** Has a lead already been captured for this phone number on this device? */
export function isLeadCaptured(phone: string): boolean {
  try {
    const list: string[] = JSON.parse(localStorage.getItem(CAPTURED_KEY) || "[]");
    return list.includes(phone);
  } catch {
    return false;
  }
}

export function markLeadCaptured(phone: string) {
  try {
    const list: string[] = JSON.parse(localStorage.getItem(CAPTURED_KEY) || "[]");
    if (!list.includes(phone)) {
      list.push(phone);
      localStorage.setItem(CAPTURED_KEY, JSON.stringify(list));
    }
  } catch {
    // ignore
  }
}
