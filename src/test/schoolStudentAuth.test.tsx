import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import OnboardingCard from "@/components/cards/OnboardingCard";
import { schoolStudentSignup } from "@/api/auth";
import { useAuthStore } from "@/store/AuthStore";
import { getToken } from "@/lib/tokenManager";

/**
 * The fifth role — schoolStudent — end to end, from the OTP response through
 * the new onboarding fork to the signup call and the resulting session.
 *
 * Half of this file is deliberately about what must NOT change: a returning
 * user, a brand-new user, a counsellor and a ProBuddy all have to come out of
 * `verifyOtp` exactly as they did before the new role existed. The school
 * student path is only safe if those four are provably untouched.
 *
 * Nothing is stubbed above the API layer: the real store calls the real API
 * modules, and only `fetch` is faked — so a wrong URL, a wrong body or a
 * mis-read response fails the test.
 */

// ── Fake server ───────────────────────────────────────────────────────────────
const json = (body: unknown, status = 200) =>
  ({
    ok: status >= 200 && status < 300,
    status,
    statusText: status === 200 ? "OK" : "Error",
    headers: {
      get: (key: string) =>
        key.toLowerCase() === "content-type" ? "application/json" : null,
    },
    json: async () => body,
    text: async () => JSON.stringify(body),
  } as unknown as Response);

type ServerConfig = {
  verifyOtp: Record<string, unknown>;
  isUserDetailsNull: boolean;
  userProfile: Record<string, unknown>;
  counsellorProfile: Record<string, unknown> | null;
  schoolSignup: { status: number; body: unknown };
  courses: Record<string, unknown>[];
};

let server: ServerConfig;
let calls: string[];

const fakeFetch = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
  const url = String(input);
  calls.push(url);

  if (url.includes("/api/auth/verifyAndUserSignup")) return json(server.verifyOtp);
  if (url.includes("/api/auth/isUserDetailsNull")) return json(server.isUserDetailsNull);
  if (url.includes("/api/auth/schoolStudentSignup")) {
    // Record the outgoing body so the payload contract can be asserted.
    lastSignupBody = init?.body ? JSON.parse(String(init.body)) : null;
    return json(server.schoolSignup.body, server.schoolSignup.status);
  }
  if (url.includes("/api/counsellor/getCounsellorById")) {
    return server.counsellorProfile
      ? json(server.counsellorProfile)
      : json({ message: "not found" }, 404);
  }
  if (url.includes("/api/user/")) return json(server.userProfile);
  if (url.includes("/all-courses")) {
    // Mirrors the live payload, including the detail that matters: the real SSC
    // course ships imageStorage: null, so the grid has to draw its own mark.
    return json(server.courses);
  }
  if (url.includes("/all-states")) {
    return json([{ name: "Maharashtra", imageStorage: "" }]);
  }
  // Leads capture, chatbot animation, anything else — harmless 200.
  return json({});
});

const LIVE_COURSES = [
  {
    courseId: "engineering",
    name: "Engineering",
    duration: "4 years",
    tagline: "Build the future.",
    imageStorage: "https://storage.example/engineering.png",
  },
  {
    courseId: "ssc_ththth",
    name: "SSC (8th/9th/10th)",
    duration: "3 years",
    tagline: "Foundation for education.",
    imageStorage: null,
  },
];

let lastSignupBody: Record<string, unknown> | null = null;

const SCHOOL_STUDENT_LOGIN = {
  role: "schoolStudent",
  isUser: false,
  userId: "7004675426",
  jwtToken: "school-jwt",
  firebaseCustomToken: "school-firebase",
  message: "Phone number already exists. User logged in successfully.",
  status: "OK",
};

const SIGNUP_SUCCESS = {
  role: "schoolStudent",
  isUser: false,
  userId: "8105163484",
  jwtToken: "new-school-jwt",
  firebaseCustomToken: "new-school-firebase",
  message: "Sign up successful! schoolStudent ID: 8105163484",
  statusCode: "CREATED",
};

/** Zustand stores are module singletons — reset every field the tests touch. */
const resetStore = () =>
  useAuthStore.setState({
    user: null,
    userId: null,
    role: null,
    isAuthenticated: false,
    isLoginToggle: false,
    userExist: false,
    loading: false,
    needsOnboarding: false,
    needsProfileCompletion: false,
    isProfileCompletionOpen: false,
    skipOnboardingForPromo: false,
    isCounselorSignupFlow: false,
    returnToPath: null,
    onLoginSuccess: null,
    pendingAction: null,
    tempJwt: null,
    tempPhone: null,
    schoolStudent: null,
  });

beforeEach(() => {
  calls = [];
  lastSignupBody = null;
  server = {
    verifyOtp: {},
    isUserDetailsNull: false,
    userProfile: {
      userName: "9876543210",
      firstName: "Asha",
      lastName: "Kumar",
      email: "asha@example.com",
      role: "user",
      interestedCourse: "Engineering",
    },
    counsellorProfile: null,
    schoolSignup: { status: 200, body: SIGNUP_SUCCESS },
    courses: LIVE_COURSES,
  };
  vi.stubGlobal("fetch", fakeFetch);
  resetStore();
});

afterEach(() => {
  resetStore();
});

// ── Regression: the four existing roles must be untouched ─────────────────────
describe("existing roles are unaffected by the new one", () => {
  it("logs a returning user in as a student, as before", async () => {
    server.verifyOtp = { isUser: true, jwtToken: "user-jwt", userId: "9876543210" };
    server.isUserDetailsNull = false;

    await useAuthStore.getState().verifyOtp("9876543210", "1234");

    const state = useAuthStore.getState();
    expect(state.role).toBe("user");
    expect(state.isAuthenticated).toBe(true);
    expect(state.needsOnboarding).toBe(false);
    expect(state.schoolStudent).toBeNull();
    expect(localStorage.getItem("jwt")).toBe("user-jwt");
    expect(calls.some((u) => u.includes("/api/user/9876543210"))).toBe(true);
  });

  it("keeps a brand-new number on the onboarding path with the JWT in memory only", async () => {
    server.verifyOtp = { isUser: true, jwtToken: "new-jwt", userId: "9000000001" };
    server.isUserDetailsNull = true;
    server.userProfile = {
      userName: "9000000001", firstName: "", lastName: "", email: "",
      role: "user", interestedCourse: null,
    };

    await useAuthStore.getState().verifyOtp("9000000001", "1234");

    const state = useAuthStore.getState();
    expect(state.needsOnboarding).toBe(true);
    expect(state.tempJwt).toBe("new-jwt");
    expect(localStorage.getItem("jwt")).toBeNull();
    expect(getToken()).toBe("new-jwt");
  });

  it("still logs a counsellor in as a counsellor", async () => {
    server.verifyOtp = { isUser: false, jwtToken: "c-jwt", userId: "9111111111" };
    server.counsellorProfile = {
      userName: "9111111111", firstName: "Ravi", lastName: "S", phoneNumber: "9111111111",
      email: "ravi@example.com", role: "counsellor", verified: true, languagesKnow: [],
    };

    await useAuthStore.getState().verifyOtp("9111111111", "1234");

    expect(useAuthStore.getState().role).toBe("counselor");
    expect(calls.some((u) => u.includes("getCounsellorById"))).toBe(true);
  });

  it("still logs a ProBuddy in as a ProBuddy", async () => {
    server.verifyOtp = { role: "proBuddy", isUser: false, jwtToken: "pb-jwt", userId: "9222222222" };

    await useAuthStore.getState().verifyOtp("9222222222", "1234");

    const state = useAuthStore.getState();
    expect(state.role).toBe("proBuddy");
    expect(localStorage.getItem("role")).toBe("proBuddy");
    expect(localStorage.getItem("jwt")).toBe("pb-jwt");
  });
});

// ── The new role: login ───────────────────────────────────────────────────────
describe("school student login", () => {
  it("is recognised from the OTP response and never treated as a counsellor", async () => {
    server.verifyOtp = SCHOOL_STUDENT_LOGIN;

    await useAuthStore.getState().verifyOtp("7004675426", "1234");

    const state = useAuthStore.getState();
    expect(state.role).toBe("schoolStudent");
    expect(state.isAuthenticated).toBe(true);
    expect(state.userId).toBe("7004675426");
    expect(state.needsOnboarding).toBe(false);
    expect(state.needsProfileCompletion).toBe(false);
    expect(localStorage.getItem("role")).toBe("schoolStudent");
    expect(localStorage.getItem("jwt")).toBe("school-jwt");

    // The two lookups that would 404 for this role must not be attempted.
    expect(calls.some((u) => u.includes("getCounsellorById"))).toBe(false);
    expect(calls.some((u) => u.includes("/api/user/"))).toBe(false);
    expect(calls.some((u) => u.includes("isUserDetailsNull"))).toBe(false);
  });

  it("tolerates a padded / differently-cased role string", async () => {
    server.verifyOtp = { ...SCHOOL_STUDENT_LOGIN, role: " SchoolStudent " };

    await useAuthStore.getState().verifyOtp("7004675426", "1234");

    expect(useAuthStore.getState().role).toBe("schoolStudent");
  });

  it("restores the saved school details when the same student returns", async () => {
    useAuthStore.setState({
      schoolStudent: {
        phoneNumber: "7004675426", firstName: "Asha", lastName: "Kumar",
        school: "Delhi Public School", className: "10",
      },
    });
    server.verifyOtp = SCHOOL_STUDENT_LOGIN;

    await useAuthStore.getState().verifyOtp("7004675426", "1234");

    const state = useAuthStore.getState();
    expect(state.schoolStudent?.school).toBe("Delhi Public School");
    expect(state.user?.firstName).toBe("Asha");
  });

  it("does not hand a different phone the previous student's details", async () => {
    useAuthStore.setState({
      schoolStudent: {
        phoneNumber: "9999999999", firstName: "Asha", lastName: "Kumar",
        school: "Delhi Public School", className: "10",
      },
    });
    server.verifyOtp = { ...SCHOOL_STUDENT_LOGIN, userId: "7004675426" };

    await useAuthStore.getState().verifyOtp("7004675426", "1234");

    expect(useAuthStore.getState().schoolStudent).toBeNull();
    expect(useAuthStore.getState().user?.firstName).not.toBe("Asha");
  });

  it("refreshes without calling the user profile endpoint (there is none)", async () => {
    server.verifyOtp = SCHOOL_STUDENT_LOGIN;
    await useAuthStore.getState().verifyOtp("7004675426", "1234");
    calls = [];

    const refreshed = await useAuthStore.getState().refreshUser(true);

    expect(refreshed?.role).toBe("schoolStudent");
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    expect(calls.some((u) => u.includes("/api/user/"))).toBe(false);
  });

  it("clears the saved school profile on logout", async () => {
    server.verifyOtp = SCHOOL_STUDENT_LOGIN;
    await useAuthStore.getState().verifyOtp("7004675426", "1234");

    useAuthStore.getState().logout();

    const state = useAuthStore.getState();
    expect(state.schoolStudent).toBeNull();
    expect(state.role).toBeNull();
    expect(localStorage.getItem("jwt")).toBeNull();
  });
});

// ── The new role: the signup API contract ─────────────────────────────────────
describe("schoolStudentSignup API", () => {
  const payload = {
    phoneNumber: "8105163484", firstName: "Asha", lastName: "Kumar",
    school: "Delhi Public School", className: "10",
  };

  it("posts the documented body and returns the session", async () => {
    const data = await schoolStudentSignup(payload);

    expect(calls.some((u) => u.endsWith("/api/auth/schoolStudentSignup"))).toBe(true);
    expect(lastSignupBody).toEqual(payload);
    expect(data.jwtToken).toBe("new-school-jwt");
  });

  it("throws the server's message when a business error arrives as HTTP 200", async () => {
    server.schoolSignup = {
      status: 200,
      body: { message: "This phone number is already registered as a user.", statusCode: "CONFLICT" },
    };

    await expect(schoolStudentSignup(payload)).rejects.toThrow(
      "This phone number is already registered as a user."
    );
  });

  it("throws on the HTTP 400 thrown-exception shape too", async () => {
    server.schoolSignup = {
      status: 400,
      body: { message: "Please verify your phone number first." },
    };

    await expect(schoolStudentSignup(payload)).rejects.toThrow(
      "Please verify your phone number first."
    );
  });

  it("rejects a 200 that is missing the role or the token", async () => {
    server.schoolSignup = { status: 200, body: { role: "schoolStudent" } };

    await expect(schoolStudentSignup(payload)).rejects.toThrow();
  });
});

// ── The new question in the onboarding card ───────────────────────────────────
describe("onboarding fork", () => {
  /** State the store is in right after OTP for a not-yet-onboarded number. */
  const asNewUser = () =>
    useAuthStore.setState({
      userId: "8105163484",
      tempPhone: "8105163484",
      tempJwt: "temp-jwt",
      isAuthenticated: true,
      role: "user",
      needsOnboarding: true,
    });

  it("offers SSC in the course grid, alongside the real courses", async () => {
    asNewUser();
    render(<OnboardingCard />);

    // No yes/no question any more: the fork lives where the student was already
    // looking, so the school path costs zero extra taps.
    expect(await screen.findByText("SSC (8th/9th/10th)")).toBeInTheDocument();
    expect(screen.getByText("Engineering")).toBeInTheDocument();
    expect(screen.queryByText("Are you a school student?")).not.toBeInTheDocument();
  });

  it("leaves the existing course flow untouched", async () => {
    asNewUser();
    render(<OnboardingCard />);

    expect(await screen.findByText("Select Course")).toBeInTheDocument();
    expect(await screen.findByText("Engineering")).toBeInTheDocument();
    // No school-student call is made on the old path.
    expect(calls.some((u) => u.includes("schoolStudentSignup"))).toBe(false);
  });

  it("picking SSC collects the details and signs the student up", async () => {
    asNewUser();
    const onSchoolStudentComplete = vi.fn();
    render(<OnboardingCard onSchoolStudentComplete={onSchoolStudentComplete} />);

    await userEvent.click(await screen.findByText("SSC (8th/9th/10th)"));

    const submit = screen.getByRole("button", { name: "Start my journey →" });
    expect(submit).toBeDisabled();

    await userEvent.type(screen.getByLabelText("First name"), "Asha");
    await userEvent.type(screen.getByLabelText("Last name"), "Kumar");
    await userEvent.type(screen.getByLabelText("School name"), "Delhi Public School");
    await userEvent.click(screen.getByRole("button", { name: "10" }));

    expect(submit).toBeEnabled();
    await userEvent.click(submit);

    await waitFor(() => expect(onSchoolStudentComplete).toHaveBeenCalled());

    expect(lastSignupBody).toEqual({
      phoneNumber: "8105163484", firstName: "Asha", lastName: "Kumar",
      school: "Delhi Public School", className: "10",
    });

    const state = useAuthStore.getState();
    expect(state.role).toBe("schoolStudent");
    expect(state.isAuthenticated).toBe(true);
    expect(state.needsOnboarding).toBe(false);
    expect(state.schoolStudent).toEqual({
      phoneNumber: "8105163484", firstName: "Asha", lastName: "Kumar",
      school: "Delhi Public School", className: "10",
    });
    // OTP is already done, so the token is promoted out of the temp slot.
    expect(state.tempJwt).toBeNull();
    expect(localStorage.getItem("jwt")).toBe("new-school-jwt");
    expect(localStorage.getItem("role")).toBe("schoolStudent");
  });

  it("keeps the student on the form and unchanged when the backend refuses", async () => {
    asNewUser();
    const onSchoolStudentComplete = vi.fn();
    server.schoolSignup = {
      status: 200,
      body: { message: "This phone number is already registered as a counsellor." },
    };
    render(<OnboardingCard onSchoolStudentComplete={onSchoolStudentComplete} />);

    await userEvent.click(await screen.findByText("SSC (8th/9th/10th)"));
    await userEvent.type(screen.getByLabelText("First name"), "Asha");
    await userEvent.type(screen.getByLabelText("Last name"), "Kumar");
    await userEvent.type(screen.getByLabelText("School name"), "DPS");
    await userEvent.click(screen.getByRole("button", { name: "9" }));
    await userEvent.click(screen.getByRole("button", { name: "Start my journey →" }));

    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Start my journey →" })).toBeEnabled()
    );

    expect(onSchoolStudentComplete).not.toHaveBeenCalled();
    const state = useAuthStore.getState();
    expect(state.role).toBe("user");
    expect(state.schoolStudent).toBeNull();
    expect(localStorage.getItem("jwt")).toBeNull();
    // Still on the details form, nothing lost.
    expect(screen.getByLabelText("First name")).toHaveValue("Asha");
  });

  it("never asks a school student for a state — SSC skips that step entirely", async () => {
    asNewUser();
    render(<OnboardingCard />);

    await userEvent.click(await screen.findByText("SSC (8th/9th/10th)"));

    // The states step is for counsellor matching: which states a user wants
    // counsellors from. A Class 6-12 student is not choosing a counsellor at
    // signup, so the SSC tile forks straight to their own form and the states
    // step is never mounted. This is the guarantee, pinned.
    expect(screen.getByText("Let's set up your account")).toBeInTheDocument();
    expect(screen.queryByText(/select state/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/preferred state/i)).not.toBeInTheDocument();
    expect(screen.queryByPlaceholderText(/search state/i)).not.toBeInTheDocument();

    // And nothing state-related is ever sent: signup takes five fields.
    await userEvent.type(screen.getByLabelText("First name"), "Asha");
    await userEvent.type(screen.getByLabelText("Last name"), "Kumar");
    await userEvent.type(screen.getByLabelText("School name"), "DPS");
    await userEvent.click(screen.getByRole("button", { name: "8" }));
    await userEvent.click(screen.getByRole("button", { name: "Start my journey →" }));

    await waitFor(() => expect(lastSignupBody).not.toBeNull());
    expect(Object.keys(lastSignupBody ?? {}).sort()).toEqual([
      "className",
      "firstName",
      "lastName",
      "phoneNumber",
      "school",
    ]);
    // The generic user update — the call that carries states — never happens.
    expect(calls.some((u) => u.includes("updateUser") || u.includes("/api/user/"))).toBe(false);
  });

  it("forks on the course id, so renaming the course cannot break it", async () => {
    // The backend owns the display name and may retitle it at any time; the id
    // is the stable contract. Same row, different label — still the school path.
    asNewUser();
    server.courses = [
      { ...LIVE_COURSES[0] },
      { ...LIVE_COURSES[1], name: "Secondary School (Class 8-10)" },
    ];
    render(<OnboardingCard />);

    await userEvent.click(await screen.findByText("Secondary School (Class 8-10)"));

    expect(screen.getByText("Let's set up your account")).toBeInTheDocument();
  });

  it("offers classes 6 to 10 only — 11 and 12 are the HSC track", async () => {
    asNewUser();
    render(<OnboardingCard />);

    await userEvent.click(await screen.findByText("SSC (8th/9th/10th)"));

    for (const cls of ["6", "7", "8", "9", "10"]) {
      expect(screen.getByRole("button", { name: cls })).toBeInTheDocument();
    }
    expect(screen.queryByRole("button", { name: "11" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "12" })).not.toBeInTheDocument();
  });

  it("does not print the student's phone number back at them", async () => {
    asNewUser();
    render(<OnboardingCard />);

    await userEvent.click(await screen.findByText("SSC (8th/9th/10th)"));

    // It is already verified by the time this form opens, so showing it only
    // puts a personal detail on a child's screen for no benefit.
    expect(screen.getByText("Phone verified")).toBeInTheDocument();
    expect(screen.queryByText(/8105163484/)).not.toBeInTheDocument();
  });

  it("goes back from the details form to the question", async () => {
    asNewUser();
    render(<OnboardingCard />);

    await userEvent.click(await screen.findByText("SSC (8th/9th/10th)"));
    expect(screen.getByText("Let's set up your account")).toBeInTheDocument();

    await userEvent.click(screen.getByText("Back"));

    expect(await screen.findByText("Select Course")).toBeInTheDocument();
  });
});
