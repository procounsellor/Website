import { useAuthStore } from "@/store/AuthStore";
import { getStoredPhone } from "@/lib/tokenManager";

/**
 * Returns the phone number the user is LOGGED IN with.
 *
 * In this app login is via phone OTP, so the login phone is the user's
 * identity: it is stored in `localStorage("phone")` (by tokenManager on
 * login), mirrored as the auth-store `userId`, and is also the `userName`.
 *
 * The editable profile field `user.phoneNumber` can differ from the login
 * number (e.g. a parent's number, an old number, or an unedited default), so
 * it is used ONLY as a last resort and must never override the login number.
 * This is what fixes Razorpay sometimes pre-filling the wrong contact.
 */
export function getLoggedInPhone(): string | null {
  const { userId, tempPhone, user } = useAuthStore.getState();
  return (
    getStoredPhone() || // localStorage("phone") — the actual login number
    userId || // auth identity (set to the OTP phone on login)
    user?.userName || // userName === login phone for students
    tempPhone || // onboarding flow, before localStorage is written
    user?.phoneNumber || // editable profile field — last resort only
    null
  );
}

/**
 * Formats an Indian phone number for Razorpay's `prefill.contact`.
 * Razorpay expects digits only with the country code, e.g. 919876543210.
 */
export function formatPhoneForRazorpay(
  phone: string | null | undefined
): string {
  if (!phone) return "";
  let p = phone.replace(/\D/g, "");
  if (p.length === 10) p = "91" + p;
  return p;
}
