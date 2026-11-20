import { useEffect, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { updateUser } from "@/api/auth";
import { getToken } from "@/lib/tokenManager";
import { trackEvent } from "@/lib/analytics";
import { HELPLINE } from "@/data/homeExams";
import { useAuthStore } from "@/store/AuthStore";
import { canSwitchToMba } from "@/lib/mbaCourse";
import DialogShell from "./DialogShell";
import LeadDialog from "./LeadDialog";

const ROLE_NAME: Record<string, string> = {
  counselor: "a counsellor",
  proBuddy: "a ProBuddy",
  schoolStudent: "a school student",
};

interface SwitchToMbaDialogProps {
  /** The MBA page to open once the account is MBA, e.g. "/mba/gdpi/live". */
  to: string;
  /** What the student clicked, for the heading and analytics. */
  tool: string;
  /** Analytics placement, e.g. "home_exam_tools". */
  location: string;
  /** Defaults to "<tool> is part of CAT prep". */
  heading?: string;
  onClose: () => void;
}

/**
 * Shown when a logged-in account that is not registered for MBA opens a CAT
 * prep tool. Students can switch their course to MBA right here (the same
 * PATCH /api/user the profile's "Edit preferences" makes) and carry on to the
 * tool; other roles get a plain explanation. Replaces a toast that told
 * students to "talk to a counsellor" without any way to do it.
 */
export default function SwitchToMbaDialog({ to, tool, location, heading, onClose }: SwitchToMbaDialogProps) {
  const title = heading ?? `${tool} is part of CAT prep`;
  const { role, user, userId } = useAuthStore();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [askCounsellor, setAskCounsellor] = useState(false);
  const roleName = role ?? "unknown";
  const student = canSwitchToMba(role);

  useEffect(() => {
    trackEvent("mba_switch_prompt", { location, tool, role: roleName, action: "shown" });
  }, [location, tool, roleName]);

  const switchCourse = async () => {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const store = useAuthStore.getState();
      // Keep the states they chose; refresh first if the profile isn't loaded.
      const current = store.user ?? (await store.refreshUser(true));
      const id = userId ?? current?.userName ?? null;
      if (!id) throw new Error("not signed in");
      await updateUser(
        id,
        { interestedCourse: "MBA", userInterestedStateOfCounsellors: current?.userInterestedStateOfCounsellors ?? [] },
        getToken(),
      );
      trackEvent("mba_switch_prompt", { location, tool, role: roleName, action: "switched" });
      // RevampLayout sends MBA students to returnToPath (or onboarding first,
      // which then comes back here), so set the target before the role flips.
      store.setReturnToPath(to);
      store.becomeMbaStudent();
    } catch {
      trackEvent("mba_switch_prompt", { location, tool, role: roleName, action: "failed" });
      setError(`We couldn't switch your course just now. Please try again, or call ${HELPLINE.display}.`);
      setBusy(false);
    }
  };

  if (askCounsellor) {
    return (
      <LeadDialog
        title="Talk to an MBA counsellor"
        subheading="Leave your number and an MBA counsellor will call you back about CAT prep and interviews."
        intent={`Wants ${tool} (free CAT prep), account not registered for MBA`}
        formId="mba_switch_counsellor"
        course="MBA"
        exam="CAT"
        onClose={onClose}
      />
    );
  }

  return (
    <DialogShell label={title} onClose={onClose}>
      <div className="p-5 pt-6 md:p-7 font-[Poppins]">
        <p className="text-[12px] font-semibold uppercase tracking-[0.07em] text-[#2F43F2]">Free CAT prep</p>
        <h2 className="mt-1 pr-10 text-[20px] md:text-[22px] font-bold leading-tight text-[#0E1629]">
          {title}
        </h2>

        {student ? (
          <>
            <p className="mt-2 text-[14px] leading-relaxed text-[#4B5563]">
              Your account is set up for {user?.interestedCourse ? <strong>{user.interestedCourse}</strong> : "another course"}.
              Free mock interviews, GD and WAT practice, CAT mocks and the study plan are in the MBA section.
            </p>
            <p className="mt-4 text-[14px] font-semibold text-[#0E1629]">If you switch your course to MBA:</p>
            <ul className="mt-2 space-y-1.5 text-[14px] text-[#374151]">
              {[
                "You get every free CAT prep tool: mock interviews, mocks, past papers and more",
                "After login you'll land on your CAT prep dashboard",
                "Counsellor suggestions will be for MBA",
              ].map((t) => (
                <li key={t} className="flex gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#16A34A]" aria-hidden="true" />
                  {t}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[12.5px] text-[#6B7280]">
              Preparing for NEET or JEE as well? Switching back is done by our team: call{" "}
              <a href={`tel:${HELPLINE.tel}`} className="font-medium text-[#13097D] underline">{HELPLINE.display}</a>.
            </p>

            {error && (
              <p role="alert" className="mt-3 rounded-lg bg-[#FEF2F2] px-3 py-2 text-[13px] text-[#B91C1C]">
                {error}
              </p>
            )}

            <div className="mt-5 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={switchCourse}
                disabled={busy}
                className="inline-flex min-h-[48px] cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#2F43F2] px-5 text-[15px] font-semibold text-white hover:bg-[#2335d0] disabled:cursor-wait disabled:opacity-70"
              >
                {busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
                {busy ? "Switching…" : "Switch to MBA and continue"}
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => {
                  trackEvent("mba_switch_prompt", { location, tool, role: roleName, action: "counsellor" });
                  setAskCounsellor(true);
                }}
                className="min-h-[48px] cursor-pointer rounded-xl border border-[#D7DCE8] px-5 text-[15px] font-semibold text-[#0E1629] hover:bg-[#F5F7FB] disabled:opacity-60"
              >
                Talk to a counsellor instead
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="mt-2 text-[14px] leading-relaxed text-[#4B5563]">
              CAT prep tools are for student accounts preparing for MBA. You&apos;re signed in as{" "}
              {ROLE_NAME[roleName] ?? "a non-student account"}, so they aren&apos;t available here. To try them, log in with a
              student&apos;s phone number.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-5 min-h-[48px] w-full cursor-pointer rounded-xl bg-[#0E1629] px-5 text-[15px] font-semibold text-white"
            >
              OK
            </button>
          </>
        )}
      </div>
    </DialogShell>
  );
}
