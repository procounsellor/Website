import MettleAssessment from '@/pages/MettleAssessment';
import { useSchoolMettleFlow, usePaidMettleFlow, type MettleFlow } from '@/lib/mettleFlow';
import { isSchoolStudentRole, useAuthStore } from '@/store/AuthStore';

/**
 * /mettle — the fork.
 *
 * One URL, two journeys. This is the only place in the app that asks which one
 * a visitor is on; everything below it is handed a flow and never asks again.
 * See lib/mettleFlow for what the two flows actually differ on and why.
 *
 * ─── Why the fork is here and not inside the page ────────────────────────────
 *
 * The role is known the instant OTP resolves, and it does not change again
 * while the page is open. Deciding once, at the top, is what stops a school
 * student's journey and a paying student's journey leaking into each other
 * halfway down a thousand-line component — which is exactly what was happening.
 *
 * ─── Logged out ──────────────────────────────────────────────────────────────
 *
 * Nobody's role is known before they authenticate, so a logged-out visitor gets
 * the paid flow: the ₹2,000 marketing page with its FAQ schema, which is the
 * page that has to rank. The moment login resolves a school student, this
 * re-renders into the free flow. Guessing earlier is not possible — there is no
 * signal on the frontend before OTP — and guessing wrong would either show a
 * school price to the public or a ₹2,000 price to a child who is not paying it.
 *
 * ─── Why two components rather than one with a conditional hook ──────────────
 *
 * Each flow is a hook, and a hook cannot be called conditionally. `SchoolFlow`
 * and `PaidFlow` each call exactly one, unconditionally, and this component
 * chooses between the two components instead. Switching roles unmounts one and
 * mounts the other, which also throws away any state the previous flow held —
 * the correct behaviour, since none of it applies to the new one.
 */
export default function MettleRoute() {
  const role = useAuthStore((s) => s.role);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return isAuthenticated && isSchoolStudentRole(role) ? <SchoolFlow /> : <PaidFlow />;
}

/** Free, identified from the school-student record, saved to it. */
function SchoolFlow() {
  const flow: MettleFlow = useSchoolMettleFlow();
  return <MettleAssessment flow={flow} />;
}

/** ₹2,000, wallet then Razorpay, saved onto the `users` row. */
function PaidFlow() {
  const flow: MettleFlow = usePaidMettleFlow();
  return <MettleAssessment flow={flow} />;
}
