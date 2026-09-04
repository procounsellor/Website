import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import SchoolStudentDashboard from "@/pages/SchoolStudentDashboard";
import SchoolStudentLayout from "@/layouts/SchoolStudentLayout";
import DashboardSidebar from "@/components/school-student/DashboardSidebar";
import {
  buildDashboardView,
  emptyProgress,
  readProgress,
  recordVisit,
  withServerRecord,
  writeProgress,
  QUESTS,
} from "@/lib/schoolStudentProgress";
import type { SchoolStudent } from "@/api/schoolStudentApi";
import { useAuthStore } from "@/store/AuthStore";
import type { User } from "@/types/user";

/**
 * The gamified school-student dashboard.
 *
 * The thing worth guarding here is honesty. A points-and-streak page is very
 * easy to ship with sample numbers baked in, and a real student would read
 * "1,250 points" as their own. So: a brand-new student must see zeros
 * everywhere, empty states instead of flat-zero charts, and no link to a
 * feature that has not been built.
 *
 * The second guard is the backend this role does NOT have: there is still no
 * /api/user/:id record for a school student, so a profile fetch is a bug. The
 * dashboard does now read one thing from the network — the day's game schedule
 * at /api/schoolStudent — and that call has to stay the only one.
 */

const PHONE = "8000000000";

const asSchoolStudent = (): User =>
  ({
    userName: PHONE,
    firstName: "Aarav",
    lastName: "Kumar",
    phoneNumber: PHONE,
    email: "",
    role: "schoolStudent",
    verified: false,
    walletAmount: 0,
    transactions: [],
    offlineTransactions: [],
    activityLog: [],
    userInterestedStateOfCounsellors: null,
    interestedCourse: null,
  } as unknown as User);

/**
 * The games schedule, answered the way the live backend answers a day with
 * nothing on it. Every dashboard test stubs this: without it the component
 * would reach the real API, and the assertions here are about what the page
 * renders, not about what is scheduled today.
 */
const stubGamesApi = () => {
  const fetchSpy = vi.fn(async (url: string | URL, init?: RequestInit) => {
    void url;
    void init;
    return new Response(JSON.stringify({ success: false, message: "No game scheduled" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  });
  vi.stubGlobal("fetch", fetchSpy);
  return fetchSpy;
};

const signInAsSchoolStudent = () => {
  localStorage.setItem("jwt", "jwt-test");
  useAuthStore.setState({
    user: asSchoolStudent(),
    userId: PHONE,
    role: "schoolStudent",
    isAuthenticated: true,
    schoolStudent: {
      phoneNumber: PHONE,
      firstName: "Aarav",
      lastName: "Kumar",
      school: "Delhi Public School",
      className: "9",
    },
  });
};

/** Mounted inside its real shell — the layout owns access, progress and the rail. */
const renderDashboard = () =>
  render(
    <MemoryRouter initialEntries={["/school-student/dashboard"]}>
      <Routes>
        <Route path="/school-student" element={<SchoolStudentLayout />}>
          <Route path="dashboard" element={<SchoolStudentDashboard />} />
        </Route>
        <Route path="/" element={<div>home page</div>} />
      </Routes>
    </MemoryRouter>,
  );

const iso = (offsetDays: number) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

beforeEach(() => {
  stubGamesApi();
  useAuthStore.setState({
    user: null,
    userId: null,
    role: null,
    isAuthenticated: false,
    schoolStudent: null,
  });
});

describe("dashboard — a brand-new student sees no invented numbers", () => {
  beforeEach(signInAsSchoolStudent);

  it("starts at zero points and level 1", () => {
    renderDashboard();

    // The top bar's counters and the progress panel, all at zero.
    expect(screen.getByText("Points")).toBeInTheDocument();
    expect(screen.getByText("Level 1 Starter")).toBeInTheDocument();
    expect(screen.getByText(`0 / ${QUESTS.length}`)).toBeInTheDocument();
    // The progress panel's readout. The hero's altimeter shows the same figure
    // but splits it across elements, so it is not one text node.
    expect(screen.getByText("0 / 3,000")).toBeInTheDocument();
  });

  it("greets the student from what signup persisted", () => {
    renderDashboard();

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Welcome back, Aarav!");
    // The account chip in the top bar names the student too.
    expect(screen.getByText("Hi, Aarav!")).toBeInTheDocument();
  });

  it("asks for the day's game and nothing else — this role has no profile endpoint", async () => {
    const fetchSpy = stubGamesApi();

    renderDashboard();
    await screen.findByText("No game today");

    const urls = fetchSpy.mock.calls.map(([url]) => String(url));
    expect(urls.every((url) => url.includes("/api/schoolStudent/"))).toBe(true);
    expect(urls.some((url) => url.includes("/api/user/"))).toBe(false);
  });

  it("sends the student's class to the schedule, so they get their own set", async () => {
    const fetchSpy = stubGamesApi();

    renderDashboard();
    await screen.findByText("No game today");

    // Signup persisted class 9; the graded route is the only one that can name
    // the pack this student opens.
    const urls = fetchSpy.mock.calls.map(([url]) => String(url));
    expect(urls.some((url) => url.includes("getTodayGameByGrade") && url.includes("grade=9"))).toBe(
      true,
    );
  });

  it("says so plainly when the backend has nothing scheduled", async () => {
    renderDashboard();

    expect(await screen.findByText("No game today")).toBeInTheDocument();
  });
});

describe("dashboard — nothing dead-ends", () => {
  beforeEach(signInAsSchoolStudent);

  it("links the quests that are built — the test and the games page", () => {
    renderDashboard();

    const hrefs = screen.getAllByRole("link").map((el) => el.getAttribute("href"));
    expect(hrefs).toContain("/mettle");
    expect(hrefs).toContain("/school-student/games");
  });

  it("renders unbuilt quests as labels, never as links", () => {
    renderDashboard();

    expect(screen.getByText("Daily Games & Quizzes")).toBeInTheDocument();
    expect(screen.getByText("Book a Counselling Session")).toBeInTheDocument();

    const linkText = screen.getAllByRole("link").map((el) => el.textContent ?? "");
    expect(linkText.some((t) => t.includes("Book a Counselling Session"))).toBe(false);
  });

  it("points every rail entry at a route that exists", () => {
    renderDashboard();

    const hrefs = screen.getAllByRole("link").map((el) => el.getAttribute("href"));
    expect(hrefs).toContain("/school-student/dashboard");
    expect(hrefs).toContain("/school-student/probuddies");
    expect(hrefs).toContain("/school-student/games");
    expect(hrefs).toContain("/school-student/leaderboard");
    expect(hrefs).toContain("/school-student/profile");
    // The rail never links out to the site's own routes — a school student
    // lives entirely inside this shell.
    expect(hrefs.every((href) => href?.startsWith("/school-student/") || href === "/mettle")).toBe(
      true,
    );
  });

  it("does not show the panels that were cut from the dashboard", () => {
    renderDashboard();

    // Weekly Activity, Recent Achievements and the rail's level card were all
    // removed on request. They came back once already; this keeps them out.
    expect(screen.queryByText("Weekly Activity")).not.toBeInTheDocument();
    expect(screen.queryByText("Recent Achievements")).not.toBeInTheDocument();
    expect(screen.queryByText("This Week")).not.toBeInTheDocument();
    expect(screen.queryByText(/XP$/)).not.toBeInTheDocument();
  });

  it("shows the daily goal as a count out of one", () => {
    renderDashboard();

    expect(screen.getByText("Daily Goal")).toBeInTheDocument();
    expect(screen.getByText("Complete 1 activity")).toBeInTheDocument();
    expect(screen.getByText("0 / 1")).toBeInTheDocument();
  });

  it("caps completed activities at the daily target", () => {
    render(
      <MemoryRouter>
        <DashboardSidebar dailyGoalDone={3} dailyGoalTarget={1} />
      </MemoryRouter>,
    );

    expect(screen.getByText("1 / 1")).toBeInTheDocument();
    expect(screen.queryByText("3 / 1")).not.toBeInTheDocument();
  });

  it("does not offer the sections that were cut from the rail", () => {
    renderDashboard();

    expect(screen.queryByText("Rewards Store")).not.toBeInTheDocument();
    expect(screen.queryByText("Calendar")).not.toBeInTheDocument();
    expect(screen.queryByText("Help & Support")).not.toBeInTheDocument();
    // Profile survives, pinned to the foot of the rail; ProBuddies was added.
    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByText("ProBuddies")).toBeInTheDocument();
  });

  it("shows Q1 as current and the rest locked", () => {
    renderDashboard();

    expect(screen.getByText("Current")).toBeInTheDocument();
    // Twice: the station on the hero's route, and the camp card below it. Bare
    // digits were unreadable at that size, so the station spells the code out.
    expect(screen.getAllByText("Q1").length).toBe(2);
    // Q2, Q3 and Q4.
    expect(screen.getAllByText("Locked").length).toBe(3);
  });
});

describe("streak — the one mechanic that works without a backend", () => {
  beforeEach(signInAsSchoolStudent);

  it("counts a first visit as day one", () => {
    renderDashboard();

    expect(screen.getByText("Day Streak")).toBeInTheDocument();
    expect(screen.getByText("1 Day")).toBeInTheDocument();
  });

  it("advances when yesterday was the last visit", () => {
    writeProgress(PHONE, { ...emptyProgress(), streakDays: 6, lastActiveOn: iso(-1) });

    renderDashboard();

    expect(screen.getByText("7 Days")).toBeInTheDocument();
  });

  it("resets after a missed day", () => {
    const stored = { ...emptyProgress(), streakDays: 9, lastActiveOn: iso(-3) };
    expect(recordVisit(stored).streakDays).toBe(1);
  });

  it("does not double-count two visits on the same day", () => {
    const today = iso(0);
    const stored = { ...emptyProgress(), streakDays: 4, lastActiveOn: today };
    expect(recordVisit(stored, today)).toBe(stored);
  });
});

describe("progress storage", () => {
  it("keeps two students on one device apart", () => {
    writeProgress("1111111111", { ...emptyProgress(), points: 400 });

    expect(readProgress("2222222222").points).toBe(0);
    expect(readProgress("1111111111").points).toBe(400);
  });

  it("degrades to zeros rather than throwing on corrupt storage", () => {
    localStorage.setItem("procounsel:school-progress:v1:3333333333", "{not json");
    expect(readProgress("3333333333").points).toBe(0);
  });

  it("ignores a payload written by an older schema version", () => {
    localStorage.setItem(
      "procounsel:school-progress:v1:4444444444",
      JSON.stringify({ version: 0, points: 9999 }),
    );
    expect(readProgress("4444444444").points).toBe(0);
  });
});

describe("the programme model", () => {
  it("unlocks the next quarter only when the current one is finished", () => {
    const q1 = QUESTS.filter((q) => q.quarter === 1).map((q) => q.key);

    const before = buildDashboardView(emptyProgress());
    expect(before.currentQuarter.id).toBe(1);
    expect(before.quarters[1].status).toBe("locked");

    const after = buildDashboardView({ ...emptyProgress(), completedQuests: q1 });
    expect(after.quarters[0].status).toBe("complete");
    expect(after.currentQuarter.id).toBe(2);
  });

  it("levels up on the published thresholds", () => {
    expect(buildDashboardView({ ...emptyProgress(), points: 0 }).level.level).toBe(1);
    expect(buildDashboardView({ ...emptyProgress(), points: 249 }).level.level).toBe(1);
    expect(buildDashboardView({ ...emptyProgress(), points: 250 }).level.level).toBe(2);
    expect(buildDashboardView({ ...emptyProgress(), points: 1000 }).level.level).toBe(4);
  });

  it("never reports progress a student has not made", () => {
    const view = buildDashboardView(emptyProgress());
    expect(view.points).toBe(0);
    expect(view.overallPercent).toBe(0);
    expect(view.currentQuarter.percent).toBe(0);
    expect(view.tasksCompleted).toBe(0);
  });
});

/**
 * The psychometric quest has no completion endpoint of its own.
 *
 * The only durable signal that a student has taken the test is a non-null
 * `pyschometricReportPdfLink` on their record — the backend's own spelling. So
 * the whole quest hangs off that one field, and these pin it: a link means
 * done, no link means not done, and "done" has to flow all the way through to
 * the counters the dashboard actually renders.
 */
const recordWith = (reportLink: string | null): SchoolStudent =>
  ({
    schoolStudentId: PHONE,
    phoneNumber: PHONE,
    firstName: "Aarav",
    lastName: "Kumar",
    className: "9",
    schoolName: "Delhi Public School",
    pyschometricReportPdfLink: reportLink,
    totalPoints: 0,
    currentStreak: 0,
    lastActiveDate: null,
    deleted: false,
  }) as unknown as SchoolStudent;

describe("the psychometric quest follows the report link", () => {
  it("counts as done when the record carries a report link", () => {
    const merged = withServerRecord(emptyProgress(), recordWith("https://files/report.pdf"));
    const view = buildDashboardView(merged);

    expect(merged.completedQuests).toContain("mettle");
    expect(view.tasksCompleted).toBe(1);
    expect(view.quests.find((q) => q.key === "mettle")?.status).toBe("done");
  });

  it("moves the quarter's own counter, not just the total", () => {
    const view = buildDashboardView(
      withServerRecord(emptyProgress(), recordWith("https://files/report.pdf")),
    );

    // Q1 holds three quests; the psychometric test is one of them.
    expect(view.currentQuarter.id).toBe(1);
    expect(view.currentQuarter.completed).toBe(1);
    expect(view.currentQuarter.total).toBe(3);
    expect(view.overallPercent).toBeGreaterThan(0);
  });

  it("stays not-done while the link is null", () => {
    const merged = withServerRecord(emptyProgress(), recordWith(null));
    const view = buildDashboardView(merged);

    expect(merged.completedQuests).not.toContain("mettle");
    expect(view.tasksCompleted).toBe(0);
    expect(view.quests.find((q) => q.key === "mettle")?.status).toBe("available");
  });

  it("leaves the rest of the programme alone", () => {
    const view = buildDashboardView(
      withServerRecord(emptyProgress(), recordWith("https://files/report.pdf")),
    );

    // One task done must not quietly complete the quarter or unlock Q2.
    expect(view.quarters[0].status).toBe("current");
    expect(view.quarters[1].status).toBe("locked");
  });
});

describe("who can reach the dashboard", () => {
  it("turns a logged-out visitor away", () => {
    renderDashboard();
    expect(screen.getByText("home page")).toBeInTheDocument();
  });

  it("turns another signed-in role away", () => {
    localStorage.setItem("jwt", "jwt-test");
    useAuthStore.setState({
      user: { firstName: "Asha", role: "user" } as never,
      userId: "7000000000",
      role: "user",
      isAuthenticated: true,
    });

    renderDashboard();
    expect(screen.getByText("home page")).toBeInTheDocument();
  });
});
