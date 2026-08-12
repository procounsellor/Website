import { API_CONFIG } from "./config";
import { getToken } from "@/lib/tokenManager";

const { baseUrl } = API_CONFIG;

/**
 * MHT-CET option form filling service.
 *
 * Backend contract (option-form-registration-controller):
 *   POST  /api/optionFormRegistration/register
 *   PATCH /api/optionFormRegistration/markPaymentCompleted?userId=
 *
 * Neither endpoint touches money, so the wallet debit is a separate call to the
 * existing ProCoins transfer (see `debitWalletForOptionForm`). Order matters:
 * register → debit → markPaymentCompleted. If the debit fails we never mark the
 * registration paid, so the worst case is an unpaid registration an admin can
 * see and chase — never a paid-but-not-charged one.
 */

/**
 * Price in ProCoins (₹1 = 1 ProCoin).
 *
 * Every price shown on the page reads from here, so these two numbers are the
 * only edit needed to change what students pay. Keep REQUIREMENT_PRICE in the
 * admin panel (Admin/src/lib/optionFormApi.ts) in sync — it drives the
 * collected total on the registrations page.
 */
export const OPTION_FORM_PRICE = {
  NEW: 1999,
  REVISED: 1499,
} as const;

export type OptionFormRequirement = keyof typeof OPTION_FORM_PRICE;

export interface OptionFormRegistrationPayload {
  name: string;
  marks: number;
  stateDomicile: string;
  phoneNumber: string;
  /**
   * "METTLE" is not an option-form product. The Mettle career test is paid for
   * through this same registration + transferProCoinsToProCounsel pair because
   * that is the only wallet-debit endpoint available, so its payments land in
   * this table too — the requirement is what tells them apart in the admin list.
   */
  optionFormRequirement: OptionFormRequirement | "METTLE";
}

const authHeaders = (): Record<string, string> => {
  const token = getToken();
  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

/** Parses a response body that may be JSON or a bare string message. */
const readBody = async (response: Response): Promise<unknown> => {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

/**
 * The controller answers `{ success, message, data }` and uses `success:false`
 * for business failures — so a 200 is not on its own proof that anything worked.
 */
const failedOf = (body: unknown): boolean =>
  !!body && typeof body === "object" && (body as Record<string, unknown>).success === false;

const messageOf = (body: unknown): string => {
  if (typeof body === "string") return body;
  if (body && typeof body === "object") {
    const record = body as Record<string, unknown>;
    for (const key of ["message", "error", "msg", "detail"]) {
      if (typeof record[key] === "string") return record[key] as string;
    }
  }
  return "";
};

/**
 * True when register was refused only because this phone is already registered.
 * That is not a payment failure — the row the payment needs already exists.
 */
const isDuplicateRegistration = (message: string) =>
  /already|exist|duplicate|registered/i.test(message);

/**
 * Phones this browser has already registered, kept as `{ "9876543210": "NEW" }`.
 *
 * The backend keeps ONE row per phone and refuses a second create, so once a row
 * exists every retry must go straight to paying. Stored rather than held in
 * state so it survives a reload or a browser restart mid-payment.
 */
const REGISTERED_KEY = "optionForm:registered";

const readRegistered = (): Record<string, string> => {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(REGISTERED_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === "object" ? (parsed as Record<string, string>) : {};
  } catch {
    return {};
  }
};

const rememberRegistered = (phone: string, requirement: string) => {
  if (typeof window === "undefined" || !phone) return;
  try {
    const all = readRegistered();
    all[phone] = requirement;
    window.localStorage.setItem(REGISTERED_KEY, JSON.stringify(all));
  } catch {
    // Private mode / quota — the duplicate-tolerant branch below covers us.
  }
};

/** True when this browser has already created the row for this phone + product. */
export const isOptionFormRegistered = (phone: string, requirement: OptionFormRequirement | "METTLE") =>
  !!phone && readRegistered()[phone] === requirement;

/**
 * Creates the student's option-form registration — once.
 *
 * Two guards, because the row must exist exactly once per phone:
 *
 *  1. Already registered from this browser → no request at all. A retry after a
 *     cancelled or failed payment resumes at the payment step, which is where
 *     it belongs; asking the backend to reject the create was pointless noise.
 *  2. The backend says "already exists" anyway (retry from another device, or
 *     after clearing site data) → treated as success and remembered, so the
 *     next attempt takes guard 1. The row is present, which is all the payment
 *     needs.
 */
export async function registerOptionForm(payload: OptionFormRegistrationPayload) {
  const { phoneNumber, optionFormRequirement } = payload;

  if (isOptionFormRegistered(phoneNumber, optionFormRequirement)) {
    return { success: true, message: "Registration already exists for this phone number.", skipped: true };
  }

  const response = await fetch(`${baseUrl}/api/optionFormRegistration/register`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });

  const body = await readBody(response);
  if (!response.ok || failedOf(body)) {
    const message = messageOf(body);
    if (isDuplicateRegistration(message)) { rememberRegistered(phoneNumber, optionFormRequirement); return body; }
    throw new Error(message || "Could not save your registration. Please try again.");
  }
  rememberRegistered(phoneNumber, optionFormRequirement);
  return body;
}

/**
 * Takes the fee out of the student's wallet and marks the registration paid —
 * both in one backend call, so a payment can no longer half-succeed.
 *
 * `userId` is the same id the registration was created under, because the
 * backend uses it to find both the wallet and the registration row.
 *
 * The endpoint can answer 200 with a failure message (e.g. insufficient
 * balance), so a bare `response.ok` is not proof of payment — anything that
 * looks like a failure throws.
 */
export async function payOptionFormFromWallet(userId: string, amount: number) {
  const query = new URLSearchParams({ userId, amount: String(amount) });

  const response = await fetch(
    `${baseUrl}/api/optionFormRegistration/transferProCoinsToProCounsel?${query}`,
    {
      method: "POST",
      headers: authHeaders(),
    }
  );

  const body = await readBody(response);
  const message = messageOf(body);

  if (!response.ok || failedOf(body)) {
    throw new Error(message || "Payment failed. No ProCoins were deducted.");
  }
  if (body && typeof body === "object" && (body as Record<string, unknown>).status === false) {
    throw new Error(message || "Payment failed. No ProCoins were deducted.");
  }
  if (/insufficient|not enough|fail|error|invalid/i.test(message)) {
    throw new Error(message);
  }
  return body;
}
