import { useCallback, useEffect, useState } from 'react';
import { uploadPsychometricReport } from '@/api/psychometric';
import { getSchoolStudent, postPsychometricReport } from '@/api/schoolStudentApi';
import { registerOptionForm, payOptionFormFromWallet } from '@/api/optionForm';
import startRecharge from '@/api/wallet';
import { getToken } from '@/lib/tokenManager';
import { getLoggedInPhone, formatPhoneForRazorpay } from '@/lib/phone';
import { updateUserProfile } from '@/api/user';
import { useAuthStore } from '@/store/AuthStore';

/**
 * The two ways through /mettle.
 *
 * ─── Why this file exists ────────────────────────────────────────────────────
 *
 * A school student and a paying student take the same test and receive the same
 * report, and almost nothing else about their journeys is the same. One is
 * charged ₹2,000, has a wallet, can hold a coupon, and lives in the `users`
 * table. The other is free, has no wallet, and lives in a different collection
 * entirely — `schoolStudentSignup` DELETES their `users` row, so every
 * `/api/user/:id` call on that path answers 404 and their report has to be
 * written to a different endpoint to be readable at all.
 *
 * The page used to hold both journeys at once and re-decide between them
 * fifteen separate times with `isSchoolStudentRole(role)` — on the price, the
 * name, the coupon box, the button, the back-link, the save. Fifteen chances to
 * get it wrong, and each one silent. That is not a hypothetical: a school
 * student's report link is never on `user`, so the "you already have a report"
 * check read `undefined` for all of them and offered the test again forever.
 *
 * The role is known the instant OTP resolves. So it is decided ONCE, here, and
 * what comes back is a flow that knows its own price, its own identity, its own
 * payment and its own storage. Nothing downstream asks about roles again.
 *
 * ─── What is shared, and what is not ─────────────────────────────────────────
 *
 * Shared: the 100 questions, the AI call, the report, the PDF, and the page
 * itself. Both flows render the same component — a school student sees the same
 * layout with "Free · school plan" where the price is.
 *
 * Not shared: everything in `MettleFlow` below. If a difference between the two
 * journeys is not expressible here, that is the signal it belongs here rather
 * than as another branch in the page.
 */

/** Full price of the assessment, before any coupon. */
export const METTLE_PRICE = 2000;

/**
 * Discount codes, as percentages off METTLE_PRICE.
 *
 * Paid flow only — a school student is already free, and offering them a
 * discount box is offering to take 20% off nothing.
 *
 * ⚠️ These ship inside the JavaScript bundle — anyone who opens devtools can
 * read them, so treat PC100 as public the moment it is used in front of an
 * audience. Move validation to the backend before relying on them commercially.
 */
export const METTLE_COUPONS: Record<string, number> = {
  PC50: 50,
  PC100: 100,
  DISCOUNT20: 20,
};

/** Raised when a flow cannot continue until the student logs in again. */
export type NeedLogin = (reason: string) => Error;

export type PayContext = {
  /** What is actually owed, after any coupon. Never called with 0. */
  amount: number;
  /** The phone the wallet is keyed on. */
  walletId: string;
  /** Name to register the transaction against. */
  name: string;
  onNeedLogin: NeedLogin;
};

export type PrepareContext = {
  /** What the student typed on the start card, when their profile had no name. */
  nameInput: string;
  setNameErr: (message: string) => void;
  setNameBusy: (busy: boolean) => void;
};

export type MettleFlow = {
  kind: 'school' | 'paid';

  /** Price before coupons. 0 means this flow never charges. */
  price: number;
  couponsAllowed: boolean;
  /** Whether OnboardingCard (course + state) applies to this role. */
  usesOnboarding: boolean;
  /**
   * Whether this flow can take a name typed on the start card.
   *
   * The paid flow can: a brand-new account arrives with only a phone number,
   * and `prepare` writes what they type to their profile. The school flow
   * cannot — the name belongs to their school record, which they do not edit
   * here — so showing them the field would be a box they can type into that
   * unblocks nothing. That was the behaviour: `blocked` stayed true for a free
   * flow with no name no matter what was entered.
   */
  collectsName: boolean;
  /** What the price badge reads: "Free" / "₹2,000". */
  priceLabel: string;
  /** The small print under it: "school plan" / "one-time". */
  priceNote: string;

  /** Where "back" goes, and what it is called. */
  homeHref: string;
  homeLabel: string;

  /** The student's name, from wherever this flow's identity actually lives. */
  profileName: string;
  /** True while that name is still in flight. Blocks Start rather than
   *  starting a report titled "Student". */
  loadingProfile: boolean;
  /** A report they already own, so they are not charged for a second one. */
  savedReportLink: string | null;
  /** 0 for a role that has no wallet. */
  walletBalance: number;
  /** Whether the auth store should re-read the profile after a save. */
  refreshAfterSave: boolean;

  /**
   * Everything that must be true before the test starts — a real name on file,
   * the account out of any half-created state. False means stop; the flow has
   * already put the reason on screen.
   */
  prepare: (ctx: PrepareContext) => Promise<boolean>;

  /** Take payment. A no-op on a free flow, so callers need no branch. */
  pay: (ctx: PayContext) => Promise<void>;

  /** Write the finished report where THIS flow's record can read it back. */
  save: (userId: string, file: File, token: string) => Promise<unknown>;
};

// ── The school-student flow ───────────────────────────────────────────────────

/**
 * Free, and identified from the school-student record.
 *
 * The name and the existing-report link both come from
 * `getSchoolStudentById`, which is the only endpoint that serves this role.
 * Reading them off `user` — as the shared page used to — cannot work:
 * `mapSchoolStudentToUser` builds that object from what signup persisted and
 * carries no report link at all.
 */
export function useSchoolMettleFlow(): MettleFlow {
  const schoolStudent = useAuthStore((s) => s.schoolStudent);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const phone = schoolStudent?.phoneNumber;

  const [profileName, setProfileName] = useState('');
  const [reportLink, setReportLink] = useState<string | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setProfileName('');
      setReportLink(null);
      setLoadingProfile(false);
      return;
    }
    const id = phone || useAuthStore.getState().userId;
    if (!id) return;

    let ignore = false;
    setLoadingProfile(true);
    void getSchoolStudent(id, true)
      .then((profile) => {
        if (ignore) return;
        // `schoolGet` resolves to null for the service's "nothing here"
        // envelope, which it returns with an HTTP 500 — see schoolStudentApi.
        // A student with no record yet is not an error.
        setProfileName(`${profile?.firstName ?? ''} ${profile?.lastName ?? ''}`.trim());
        // The backend's spelling. A non-null value is the only reliable signal
        // that this student has already finished the test.
        setReportLink(profile?.pyschometricReportPdfLink ?? null);
      })
      .catch((cause) => console.error('Could not load the school student profile:', cause))
      .finally(() => {
        if (!ignore) setLoadingProfile(false);
      });

    return () => {
      ignore = true;
    };
  }, [isAuthenticated, phone]);

  // What signup persisted, used until the live record answers — so the start
  // card is not blocked on a network round trip for a name we already have.
  const stored = `${schoolStudent?.firstName ?? ''} ${schoolStudent?.lastName ?? ''}`.trim();
  const name = profileName || stored;

  const prepare = useCallback(async () => {
    // Nothing to write and nothing to pay. The only precondition is knowing
    // who the report is for, and a school student always has a name from
    // signup — so this is a guard against starting mid-fetch, not a form.
    return !loadingProfile && !!name;
  }, [loadingProfile, name]);

  const pay = useCallback(async () => {
    // Free. Deliberately a no-op rather than an absent method, so the page
    // calls `flow.pay()` unconditionally and never asks which flow it is in.
  }, []);

  return {
    kind: 'school',
    price: 0,
    couponsAllowed: false,
    usesOnboarding: false,
    priceLabel: 'Free',
    priceNote: 'school plan',
    collectsName: false,
    homeHref: '/school-student/dashboard',
    homeLabel: 'Dashboard',
    profileName: name,
    loadingProfile,
    savedReportLink: reportLink,
    walletBalance: 0,
    // No /api/user record to re-read. The school shell re-reads the school
    // record on its next mount, which is the navigation straight after this.
    refreshAfterSave: false,
    prepare,
    pay,
    /*
     * `/api/schoolStudent/postPsychometricReport`, NOT the shared one.
     *
     * The shared endpoint takes `userId` and writes onto the `users` row, which
     * this role does not have. It would answer 200 and store the report where
     * nothing this student can open will ever read it, and their psychometric
     * quest would stay incomplete however many times they took the test.
     */
    save: postPsychometricReport,
  };
}

// ── The paying-student flow ───────────────────────────────────────────────────

/**
 * ₹2,000, wallet first and Razorpay for the shortfall.
 *
 * The name is written to the profile before a rupee is touched: the report is
 * titled with it, and a brand-new account can reach this page with nothing but
 * a phone number.
 */
export function usePaidMettleFlow(): MettleFlow {
  const user = useAuthStore((s) => s.user);
  const profileName = `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim();

  /**
   * Saves the student's real name before payment.
   *
   * Course and state are collected by OnboardingCard, which this flow renders;
   * `prepare` refuses to run while that is still outstanding, so payment can
   * never be reached on a half-built account. That ordering is the whole fix
   * for accounts that ended up with a phone number and nothing else.
   */
  const prepare = useCallback(
    async ({ nameInput, setNameErr, setNameBusy }: PrepareContext) => {
      const s = useAuthStore.getState();
      if (s.needsOnboarding || s.tempJwt) return false;

      const u = s.user;
      const hasName = !!`${u?.firstName ?? ''} ${u?.lastName ?? ''}`.trim();
      if (hasName) return true;

      const full = nameInput.trim().replace(/\s+/g, ' ');
      const [firstName, ...rest] = full.split(' ');
      const lastName = rest.join(' ');

      setNameBusy(true);
      setNameErr('');
      try {
        // getToken(), not localStorage — a just-signed-up user's JWT is still
        // in-memory only, and reading localStorage here would skip the save.
        const uid = getLoggedInPhone() || s.userId;
        const token = getToken();
        if (uid && token) await updateUserProfile(uid, { firstName, lastName }, token);
        await useAuthStore.getState().refreshUser(true);
      } catch (cause) {
        // Failing loudly matters here. This used to be caught and swallowed,
        // returning true anyway — so a failed name write went straight on to
        // charge ₹2,000 for a report titled "Student".
        console.error('Could not save the name:', cause instanceof Error ? cause.message : String(cause));
        setNameErr("We couldn't save your name. Please try again.");
        return false;
      } finally {
        setNameBusy(false);
      }
      return true;
    },
    [],
  );

  /**
   * Wallet first, Razorpay only for what the wallet cannot cover.
   *
   * Mettle rides the option-form registration + transfer pair, which is the
   * only wallet-debit endpoint available. Registration is idempotent: once the
   * row exists for this phone it makes no request, so a retry after a cancelled
   * payment goes straight to the debit instead of re-registering.
   */
  const pay = useCallback(async ({ amount, walletId, name, onNeedLogin }: PayContext) => {
    await registerOptionForm({
      name,
      marks: 0,
      stateDomicile: '-',
      phoneNumber: walletId,
      optionFormRequirement: 'METTLE',
    });

    const fresh = await useAuthStore.getState().refreshUser(true);
    if (!fresh) throw onNeedLogin("We couldn't read your account just now. Log in again and press Start.");

    const shortfall = amount - (fresh.walletAmount ?? 0);
    if (shortfall > 0) await topUpWallet(walletId, shortfall, amount, onNeedLogin);

    await payOptionFormFromWallet(walletId, amount);
    await useAuthStore.getState().refreshUser(true);
  }, []);

  return {
    kind: 'paid',
    price: METTLE_PRICE,
    couponsAllowed: true,
    usesOnboarding: true,
    priceLabel: `₹${METTLE_PRICE.toLocaleString('en-IN')}`,
    priceNote: 'one-time',
    collectsName: true,
    homeHref: '/',
    homeLabel: 'Admissions',
    profileName,
    loadingProfile: false,
    // Came in with the login/profile response — a link here means they already
    // own a report and must not be charged for another.
    savedReportLink: user?.pyschometricReportPdfLink ?? null,
    walletBalance: user?.walletAmount ?? 0,
    refreshAfterSave: true,
    prepare,
    pay,
    save: (userId, file) => uploadPsychometricReport(userId, file),
  };
}

// ── Razorpay ──────────────────────────────────────────────────────────────────

type RazorpayConstructor = new (opts: unknown) => { open: () => void };

/** Charges the shortfall on Razorpay and waits for the wallet to show it. */
async function topUpWallet(
  walletId: string,
  amount: number,
  target: number,
  onNeedLogin: NeedLogin,
): Promise<void> {
  const order = await startRecharge(walletId, amount);

  // startRecharge answers with a bare string when it refuses (e.g. no auth
  // token) — that used to surface as a flat "try again" with no clue why.
  if (typeof order === 'string') {
    throw /token|auth/i.test(order)
      ? onNeedLogin("We couldn't read your login on this device. Log in again and press Start.")
      : new Error(order);
  }
  if (!order || !order.orderId) {
    throw new Error('Could not start the payment. Please try again.');
  }
  if (typeof (window as unknown as { Razorpay?: unknown }).Razorpay !== 'function') {
    throw new Error(
      'The payment window could not load. Check your connection or any ad-blocker, then press Start again.',
    );
  }

  await new Promise<void>((resolve, reject) => {
    const u = useAuthStore.getState().user;
    const options = {
      key: order.keyId,
      amount: order.amount,
      currency: order.currency,
      order_id: order.orderId,
      name: 'ProCounsel',
      description: 'Mettle career assessment',
      prefill: {
        // Always the logged-in phone, never the profile's own number — see
        // lib/phone for why those two drift apart.
        contact: formatPhoneForRazorpay(getLoggedInPhone()),
        email: u?.email || '',
        name: `${u?.firstName || ''} ${u?.lastName || ''}`.trim(),
      },
      notes: { userId: walletId, service: 'mettle' },
      handler: () => {
        void (async () => {
          // The wallet is credited by the payment webhook, so poll rather than
          // failing on the first read.
          for (let i = 0; i < 8; i += 1) {
            const fresh = await useAuthStore.getState().refreshUser(true);
            if (!fresh) {
              reject(
                onNeedLogin(
                  "Payment went through but we lost your login on this device. Log in again — the money is in your wallet, you won't be charged twice.",
                ),
              );
              return;
            }
            if ((fresh.walletAmount ?? 0) >= target) {
              resolve();
              return;
            }
            await new Promise((r) => setTimeout(r, 1200));
          }
          reject(
            new Error(
              "Payment went through but your balance hasn't updated yet. Give it a minute and press Start again — you won't be charged twice.",
            ),
          );
        })();
      },
      modal: { ondismiss: () => reject(new Error('Payment cancelled.')) },
      theme: { color: '#4f46e5' },
    };
    const RZ = (window as unknown as { Razorpay: RazorpayConstructor }).Razorpay;
    new RZ(options).open();
  });
}
