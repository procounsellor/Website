import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import SchoolGames from "@/pages/school/SchoolGames";
import SchoolStudentLayout from "@/layouts/SchoolStudentLayout";
import { useAuthStore } from "@/store/AuthStore";

/**
 * Games & Quests, against the shapes the live backend actually returns.
 *
 * Two things here are worth a test more than the markup is:
 *
 *   1. **The Accept header.** /api/schoolStudent content-negotiates and its
 *      DEFAULT is XML. Send the request without `Accept: application/json` and
 *      `getAllGames` answers `<List><item>…`, which is not an error and not
 *      JSON — the rack would simply render empty with nothing in the console.
 *      That regression is invisible by eye, so it is pinned here.
 *   2. **`{ success: false }` is not a crash.** "No game scheduled for
 *      2026-08-29" comes back as HTTP 200 with that body. It has to read as an
 *      ordinary quiet day, not as an outage.
 */

const PHONE = "8000000000";

const GAMES = [
  {
    gameId: "quiz",
    name: "Career Quiz",
    description: "Ten questions. Sixty seconds each.",
    engine: "quiz_mcq_v1",
    isActive: true,
    sortOrder: 10,
    defaultTimeLimitSecs: 600,
    pointsPerCorrect: 1,
    solvePoints: null,
    passingPercent: 60,
    speedBonus: 2,
    noMistakeBonus: 0,
    supportsHints: true,
    hintPenalty: 1,
    oneAttemptPerDay: true,
  },
  {
    gameId: "sudoku",
    name: "Number Grid",
    description: "Fill the 9x9 grid. Logic only, no guessing.",
    engine: "sudoku_v1",
    isActive: true,
    sortOrder: 20,
    defaultTimeLimitSecs: 1800,
    pointsPerCorrect: null,
    solvePoints: 5,
    passingPercent: 100,
    speedBonus: 3,
    noMistakeBonus: 0,
    supportsHints: true,
    hintPenalty: 1,
    oneAttemptPerDay: true,
  },
  {
    gameId: "retired",
    name: "Retired Game",
    description: "Should never reach the rack.",
    engine: "quiz_mcq_v1",
    isActive: false,
    sortOrder: 99,
    defaultTimeLimitSecs: 60,
    pointsPerCorrect: 1,
    solvePoints: null,
    passingPercent: 60,
    speedBonus: 0,
    noMistakeBonus: 0,
    supportsHints: false,
    hintPenalty: 1,
    oneAttemptPerDay: true,
  },
];

const SCHEDULED = {
  date: "2026-09-01",
  gameId: "quiz",
  itemId: null,
  setId: "quiz_careers_s1",
  title: "Set 1 — Know Your Careers",
  status: "scheduled",
};

const SET = {
  setId: "quiz_careers_s1",
  gameId: "quiz",
  title: "Set 1 — Know Your Careers",
  status: "published",
  isActive: true,
  grades: [8, 9, 10],
  itemCount: 10,
  points: 10,
  // Deliberately different from the game's 600s default: the set overrides it.
  timeLimitSecs: 480,
  mode: "fixed",
  passTier: "free",
  setNumber: 1,
  quarter: null,
  plays: 0,
  avgPercent: 0,
  cycleId: "default",
};

const NOT_FOUND = { success: false, message: "Game session not found" };

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

/** A body the live service returns under a non-200 status. */
type WithStatus = { __status: number; body: unknown };
const withStatus = (body: unknown, status: number): WithStatus => ({ __status: status, body });
const isWithStatus = (value: unknown): value is WithStatus =>
  typeof value === "object" && value !== null && "__status" in value;

/** Routes a stubbed fetch by path, the way the real backend would. */
const stubApi = (overrides: Record<string, unknown> = {}) => {
  const spy = vi.fn(async (url: string | URL, init?: RequestInit) => {
    void init;
    const path = String(url);
    for (const [fragment, body] of Object.entries(overrides)) {
      if (path.includes(fragment)) {
        if (body instanceof Error) throw body;
        if (isWithStatus(body)) return json(body.body, body.__status);
        return json(body);
      }
    }
    if (path.includes("getAllGames")) return json(GAMES);
    if (path.includes("getTodayGameByGrade")) return json(SCHEDULED);
    if (path.includes("getGameById")) return json(GAMES[0]);
    if (path.includes("getGameSetById")) return json(SET);
    if (path.includes("getGameSession")) return json(NOT_FOUND);
    return json(NOT_FOUND);
  });
  vi.stubGlobal("fetch", spy);
  return spy;
};

const signIn = () => {
  localStorage.setItem("jwt", "jwt-test");
  useAuthStore.setState({
    user: { firstName: "Aarav", role: "schoolStudent" } as never,
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

const renderGames = () =>
  render(
    <MemoryRouter initialEntries={["/school-student/games"]}>
      <Routes>
        <Route path="/school-student" element={<SchoolStudentLayout />}>
          <Route path="games" element={<SchoolGames />} />
        </Route>
        <Route path="/" element={<div>home page</div>} />
      </Routes>
    </MemoryRouter>,
  );

beforeEach(() => {
  // Default wiring for every test; a test that wants a different answer calls
  // stubApi again with an override.
  stubApi();
  signIn();
});

describe("the request itself", () => {
  it("asks for JSON — without the header this backend answers XML", async () => {
    const spy = stubApi();

    renderGames();
    await screen.findAllByText("Career Quiz");

    for (const [, init] of spy.mock.calls) {
      const headers = (init as RequestInit | undefined)?.headers as
        | Record<string, string>
        | undefined;
      expect(headers?.Accept).toBe("application/json");
    }
  });

  it("narrows the schedule to the student's own class", async () => {
    const spy = stubApi();

    renderGames();
    await screen.findAllByText("Career Quiz");

    const urls = spy.mock.calls.map(([url]) => String(url));
    expect(urls.some((url) => url.includes("getTodayGameByGrade") && url.includes("grade=9"))).toBe(
      true,
    );
  });
});

describe("today's game", () => {
  it("names the set the backend scheduled, not the game's generic name", async () => {
    renderGames();

    const heading = await screen.findByText("Set 1 — Know Your Careers");
    // The set's own numbers, straight off getGameSetById — read from the card
    // that owns the heading, since the rack repeats the game's own clock.
    const drop = heading.closest("article") as HTMLElement;
    // The set's clock, not the game's 600s default — proof the set won.
    expect(within(drop).getByText("8 min")).toBeInTheDocument();
    expect(within(drop).getByText("Free")).toBeInTheDocument();
  });

  it("reports an unplayed day as unplayed rather than inventing a score", async () => {
    renderGames();

    expect(await screen.findByText("Not played yet")).toBeInTheDocument();
    expect(screen.queryByText("Played today")).not.toBeInTheDocument();
  });

  it("treats an empty schedule as a quiet day, not a failure", async () => {
    // Exactly what the live service sends for a date with nothing on it: the
    // failure envelope, under an HTTP 500. Trusting the status code here is
    // what would turn a quiet Saturday into a red error on the dashboard.
    stubApi({
      getTodayGameByGrade: withStatus(
        { success: false, message: "No game scheduled for: 2026-08-29" },
        500,
      ),
    });

    renderGames();

    expect(await screen.findByText("No game today")).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("still reports a genuine fault — a 500 with no envelope is an error", async () => {
    stubApi({ getTodayGameByGrade: withStatus({ oops: true }, 500) });

    renderGames();

    expect(await screen.findByText("Today's game didn't load")).toBeInTheDocument();
  });
});

describe("the rack", () => {
  it("lists the active games and drops the retired one", async () => {
    renderGames();
    await screen.findAllByText("Career Quiz");

    const rack = screen.getByRole("region", { name: "Every game" });
    expect(within(rack).getByText("Career Quiz")).toBeInTheDocument();
    expect(within(rack).getByText("Number Grid")).toBeInTheDocument();
    expect(screen.queryByText("Retired Game")).not.toBeInTheDocument();
    expect(screen.getByText("2 games")).toBeInTheDocument();
  });

  it("states each game's own rules, not one shared blurb", async () => {
    renderGames();
    await screen.findAllByText("Career Quiz");

    const rack = screen.getByRole("region", { name: "Every game" });
    // Per-answer scoring for the quiz, solve-or-nothing for the grid.
    expect(within(rack).getAllByText("1 point per correct answer").length).toBeGreaterThan(0);
    expect(within(rack).getAllByText("5 points for solving it").length).toBeGreaterThan(0);
    expect(within(rack).getByText("30 min")).toBeInTheDocument();
  });

  it("marks the scheduled game as today's", async () => {
    renderGames();
    await screen.findAllByText("Career Quiz");

    // Scoped to the rack: the week strip also labels its first tile "Today".
    const rack = screen.getByRole("region", { name: "Every game" });
    expect(within(rack).getByText("Today")).toBeInTheDocument();
  });

  it("offers a retry when the catalogue fails", async () => {
    stubApi({ getAllGames: new Error("network down") });

    renderGames();

    expect(await screen.findByText("The games didn't load")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /try again/i })).toBeInTheDocument();
  });
});

describe("who can reach it", () => {
  it("turns away anyone who is not a school student", async () => {
    stubApi();
    useAuthStore.setState({ role: "user" as never });

    renderGames();

    expect(await screen.findByText("home page")).toBeInTheDocument();
  });
});
