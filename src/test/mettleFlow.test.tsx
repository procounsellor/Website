import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { create } from "zustand";
import { cacheTokenInMemory, getToken, setToken } from "@/lib/tokenManager";

/**
 * The /mettle new-user journey, end to end:
 *
 *   sign in → OTP for a brand-new number → signup finished → name entered →
 *   payment (Razorpay only when the wallet cannot cover it) → assessment starts
 *
 * Everything the page talks to is faked, so what is under test is the page's
 * own ordering and guards — the parts that kept breaking:
 *   • is the signup actually completed BEFORE any money moves?
 *   • is a nameless account stopped at the name field?
 *   • does Razorpay open only on a shortfall, and with the right amount?
 *   • does a cancelled payment leave a clean, resumable state?
 */

// ── Fake auth store ───────────────────────────────────────────────────────────
type FakeUser = {
  userName: string; firstName: string; lastName: string; email: string;
  walletAmount: number; pyschometricReportPdfLink?: string | null;
};

const NEW_USER: FakeUser = {
  userName: "9876543210", firstName: "", lastName: "", email: "", walletAmount: 0,
};

const makeStore = () =>
  create<Record<string, unknown>>((set, get) => ({
    user: null as FakeUser | null,
    userId: null as string | null,
    isAuthenticated: false,
    isLoginToggle: false,
    needsOnboarding: false,
    tempJwt: null as string | null,
    tempPhone: null as string | null,
    onLoginSuccess: null as (() => void) | null,

    toggleLogin: (onSuccess?: () => void) =>
      set((s) => ({ isLoginToggle: !s.isLoginToggle, onLoginSuccess: s.isLoginToggle ? null : onSuccess ?? null })),

    refreshUser: vi.fn(async () => (get().user as FakeUser | null)),

    /** Mirrors the real store: promotes the in-memory JWT to storage. */
    completeOnboarding: vi.fn(() => {
      const { tempJwt, tempPhone } = get() as { tempJwt: string | null; tempPhone: string | null };
      if (tempJwt && tempPhone) {
        setToken(tempJwt, tempPhone);
        set({ tempJwt: null, tempPhone: null, needsOnboarding: false });
      }
    }),
  }));

let store: ReturnType<typeof makeStore>;

vi.mock("@/store/AuthStore", () => ({
  get useAuthStore() { return store; },
}));

// ── Fake login card: one button that "verifies the OTP" for a NEW number ──────
vi.mock("@/components/cards/LoginCard", () => ({
  LoginCard: () => (
    <button
      onClick={() => {
        // Exactly what AuthStore.verifyOtp does for a number it has not seen:
        // profile exists but is empty, JWT is cached in memory ONLY.
        cacheTokenInMemory("new-user-jwt");
        store.setState({
          user: { ...NEW_USER }, userId: "9876543210", isAuthenticated: true,
          isLoginToggle: false, needsOnboarding: true,
          tempJwt: "new-user-jwt", tempPhone: "9876543210",
        });
      }}
    >
      fake-verify-otp
    </button>
  ),
}));

// ── Fake APIs ─────────────────────────────────────────────────────────────────
const updateUserProfile = vi.fn(async () => ({}));
const registerOptionForm = vi.fn(async () => ({ success: true }));
const payOptionFormFromWallet = vi.fn(async () => ({ success: true }));
const startRecharge = vi.fn(async () => ({ orderId: "order_1", keyId: "key_1", amount: 200000, currency: "INR" }));

vi.mock("@/api/user", () => ({ updateUserProfile: (...a: unknown[]) => updateUserProfile(...(a as [])) }));
vi.mock("@/api/optionForm", () => ({
  registerOptionForm: (...a: unknown[]) => registerOptionForm(...(a as [])),
  payOptionFormFromWallet: (...a: unknown[]) => payOptionFormFromWallet(...(a as [])),
}));
vi.mock("@/api/wallet", () => ({ default: (...a: unknown[]) => startRecharge(...(a as [])) }));
vi.mock("@/api/psychometric", () => ({ uploadPsychometricReport: vi.fn(), downloadReport: vi.fn() }));
vi.mock("@/components/SEO/PageSEO", () => ({ default: () => null }));

import MettleAssessment from "@/pages/MettleAssessment";

// ── Razorpay double ───────────────────────────────────────────────────────────
type RzOpts = { amount: number; handler: () => void; modal: { ondismiss: () => void } };
let lastRzOpts: RzOpts | null = null;

/** `outcome` decides what the student does in the payment window. */
function installRazorpay(outcome: "pay" | "dismiss") {
  lastRzOpts = null;
  (window as unknown as { Razorpay: unknown }).Razorpay = class {
    opts: RzOpts;
    constructor(opts: RzOpts) { this.opts = opts; lastRzOpts = opts; }
    open() {
      if (outcome === "pay") {
        // The webhook credits the wallet, then the page polls for it.
        const u = store.getState().user as FakeUser;
        store.setState({ user: { ...u, walletAmount: 2000 } });
        this.opts.handler();
      } else {
        this.opts.modal.ondismiss();
      }
    }
  };
}

beforeEach(() => {
  store = makeStore();
  updateUserProfile.mockClear(); registerOptionForm.mockClear();
  payOptionFormFromWallet.mockClear(); startRecharge.mockClear();
  Element.prototype.scrollIntoView = vi.fn();
  installRazorpay("pay");
});

const startCardButton = () => screen.getByRole("button", { name: /Start Assessment|Pay ₹|Sign in & Start/ });

/**
 * The category-intro heading, which only exists once the test has started.
 * Matched by role — "Analytical Thinking" also appears as a chip on the start
 * card, so a plain text query would pass before anyone had paid.
 */
const assessmentHeading = () => screen.findByRole("heading", { name: "Analytical Thinking" });

describe("Mettle — brand-new user journey", () => {
  it("signs in, forces a name, finishes the signup, pays, and starts the test", async () => {
    const user = userEvent.setup();
    render(<MettleAssessment />);

    // 1. Logged out.
    await user.click(screen.getByRole("button", { name: /Sign in & Start/ }));

    // 2. OTP verified for a new number.
    await user.click(await screen.findByText("fake-verify-otp"));

    // 3. The account has no name, so the required field is shown and the
    //    payment button is locked.
    const nameField = await screen.findByLabelText(/Your full name/i);
    expect(nameField).toBeRequired();
    expect(startCardButton()).toBeDisabled();

    // 4. A junk name does not unlock it.
    await user.type(nameField, "A");
    expect(startCardButton()).toBeDisabled();

    // 5. A real name does.
    await user.clear(nameField);
    await user.type(nameField, "Ananya Sharma");
    expect(startCardButton()).toBeEnabled();

    await user.click(startCardButton());

    // 6. The assessment started — so the whole chain ran.
    expect(await assessmentHeading()).toBeInTheDocument();

    // The name reached the profile, split into first + last.
    expect(updateUserProfile).toHaveBeenCalledWith(
      "9876543210", { firstName: "Ananya", lastName: "Sharma" }, "new-user-jwt"
    );

    // The signup was completed BEFORE the money moved: the JWT is out of
    // memory and into storage, and onboarding is closed.
    expect(store.getState().completeOnboarding).toHaveBeenCalled();
    expect(localStorage.getItem("jwt")).toBe("new-user-jwt");
    expect(store.getState().needsOnboarding).toBe(false);

    // Registration ran once, under METTLE, with the login phone.
    expect(registerOptionForm).toHaveBeenCalledTimes(1);
    expect(registerOptionForm).toHaveBeenCalledWith(
      expect.objectContaining({ phoneNumber: "9876543210", optionFormRequirement: "METTLE", name: "Ananya Sharma" })
    );

    // Empty wallet → Razorpay for the full ₹2000 → then the debit.
    expect(startRecharge).toHaveBeenCalledWith("9876543210", 2000);
    expect(payOptionFormFromWallet).toHaveBeenCalledWith("9876543210", 2000);
  });

  it("never charges twice: a cancelled payment leaves nothing debited and is resumable", async () => {
    installRazorpay("dismiss");
    const user = userEvent.setup();
    render(<MettleAssessment />);

    await user.click(screen.getByRole("button", { name: /Sign in & Start/ }));
    await user.click(await screen.findByText("fake-verify-otp"));
    await user.type(await screen.findByLabelText(/Your full name/i), "Ananya Sharma");
    await user.click(startCardButton());

    expect(await screen.findByText(/Payment cancelled/i)).toBeInTheDocument();
    expect(payOptionFormFromWallet).not.toHaveBeenCalled();
    expect(screen.queryByRole("heading", { name: "Analytical Thinking" })).not.toBeInTheDocument();

    // Retry — the name is on the profile now, so it goes straight to paying.
    installRazorpay("pay");
    await user.click(startCardButton());

    expect(await assessmentHeading()).toBeInTheDocument();
    expect(payOptionFormFromWallet).toHaveBeenCalledTimes(1);
  });
});

describe("Mettle — payment routing", () => {
  it("skips Razorpay entirely when the wallet already covers the price", async () => {
    const user = userEvent.setup();
    render(<MettleAssessment />);

    await user.click(screen.getByRole("button", { name: /Sign in & Start/ }));
    await user.click(await screen.findByText("fake-verify-otp"));
    // Funded wallet + a name already on the profile.
    store.setState({ user: { ...NEW_USER, firstName: "Ananya", lastName: "Sharma", walletAmount: 5000 } });

    await user.click(startCardButton());

    expect(await assessmentHeading()).toBeInTheDocument();
    expect(startRecharge).not.toHaveBeenCalled();
    expect(payOptionFormFromWallet).toHaveBeenCalledWith("9876543210", 2000);
  });

  it("tops up only the shortfall, not the whole price", async () => {
    const user = userEvent.setup();
    render(<MettleAssessment />);

    await user.click(screen.getByRole("button", { name: /Sign in & Start/ }));
    await user.click(await screen.findByText("fake-verify-otp"));
    store.setState({ user: { ...NEW_USER, firstName: "Ananya", lastName: "Sharma", walletAmount: 1500 } });

    await user.click(startCardButton());

    await waitFor(() => expect(startRecharge).toHaveBeenCalledWith("9876543210", 500));
    expect(lastRzOpts?.amount).toBe(200000);
  });

  it("opens the login card instead of a dead-end message when the token is unreadable", async () => {
    startRecharge.mockResolvedValueOnce("auth token not found." as never);
    const user = userEvent.setup();
    render(<MettleAssessment />);

    await user.click(screen.getByRole("button", { name: /Sign in & Start/ }));
    await user.click(await screen.findByText("fake-verify-otp"));
    store.setState({ user: { ...NEW_USER, firstName: "Ananya", lastName: "Sharma" } });

    await user.click(startCardButton());

    expect(await screen.findByText("fake-verify-otp")).toBeInTheDocument();
    expect(store.getState().isLoginToggle).toBe(true);
    expect(payOptionFormFromWallet).not.toHaveBeenCalled();
  });
});

describe("token plumbing the payment depends on", () => {
  it("a mid-onboarding JWT is readable by getToken() even with empty localStorage", () => {
    cacheTokenInMemory("new-user-jwt");
    expect(localStorage.getItem("jwt")).toBeNull();
    expect(getToken()).toBe("new-user-jwt");
  });
});
