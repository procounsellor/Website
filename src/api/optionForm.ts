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
 * ⚠️ TEMPORARY TEST PRICING — ₹2 / ₹1 so the wallet flow can be run end to end
 * with real money. Restore the live prices before launch:
 *     NEW: 1999, REVISED: 1499
 * Every price shown on the page reads from here, so changing these two numbers
 * is the only edit needed. Keep REQUIREMENT_PRICE in the admin panel
 * (Admin/src/lib/optionFormApi.ts) in sync — it drives the collected total.
 */
export const OPTION_FORM_PRICE = {
  NEW: 2,
  REVISED: 1,
} as const;

export type OptionFormRequirement = keyof typeof OPTION_FORM_PRICE;

/**
 * ProCounsel's own counsellor account that receives option-form payments.
 * The transfer endpoint moves ProCoins user → counsellor, so the service fee
 * lands in the house account registered with the support number.
 */
export const OPTION_FORM_RECEIVER_ID = "7004789484";

export interface OptionFormRegistrationPayload {
  name: string;
  marks: number;
  stateDomicile: string;
  phoneNumber: string;
  optionFormRequirement: OptionFormRequirement;
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

/** Creates (or updates) the student's option-form registration. */
export async function registerOptionForm(payload: OptionFormRegistrationPayload) {
  const response = await fetch(`${baseUrl}/api/optionFormRegistration/register`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });

  const body = await readBody(response);
  if (!response.ok || failedOf(body)) {
    throw new Error(messageOf(body) || "Could not save your registration. Please try again.");
  }
  return body;
}

/**
 * Moves the fee out of the student's wallet into the ProCounsel account.
 *
 * The transfer endpoint can answer 200 with a failure message (e.g. insufficient
 * balance), so a bare `response.ok` is not proof of payment — anything that
 * looks like a failure throws, which stops the caller before it marks the
 * registration paid.
 */
export async function debitWalletForOptionForm(userId: string, amount: number) {
  const query = new URLSearchParams({
    userId,
    counsellorId: OPTION_FORM_RECEIVER_ID,
    amount: String(amount),
  });

  const response = await fetch(`${baseUrl}/api/proCoins/transferProCoins?${query}`, {
    method: "POST",
    headers: authHeaders(),
  });

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

/** Marks the registration paid. Call this only after the wallet debit succeeds. */
export async function markOptionFormPaymentCompleted(userId: string) {
  const response = await fetch(
    `${baseUrl}/api/optionFormRegistration/markPaymentCompleted?userId=${encodeURIComponent(userId)}`,
    {
      method: "PATCH",
      headers: authHeaders(),
    }
  );

  const body = await readBody(response);
  if (!response.ok || failedOf(body)) {
    throw new Error(messageOf(body) || "Payment went through but we could not confirm it. Contact support.");
  }
  return body;
}
