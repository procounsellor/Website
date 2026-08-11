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
 * Creates the student's option-form registration.
 *
 * The backend rejects a second register for the same phone, so a retry after a
 * failed payment used to die here with "already exists" while the money sat in
 * the wallet. A duplicate is therefore treated as success: the row is present,
 * which is all the payment needs.
 */
export async function registerOptionForm(payload: OptionFormRegistrationPayload) {
  const response = await fetch(`${baseUrl}/api/optionFormRegistration/register`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });

  const body = await readBody(response);
  if (!response.ok || failedOf(body)) {
    const message = messageOf(body);
    if (isDuplicateRegistration(message)) return body;
    throw new Error(message || "Could not save your registration. Please try again.");
  }
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
