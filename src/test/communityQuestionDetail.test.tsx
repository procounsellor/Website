import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import QuestionDetailPage from "@/pages/QuestionDetailPage";
import { getAllAnswersForSpecificQuestion, QuestionNotFoundError } from "@/api/community";
import { getCommunityRole } from "@/lib/communityRole";
import { useAuthStore } from "@/store/AuthStore";
import type { FirebaseTimestamp, QuestionDetailData } from "@/types/community";

/**
 * Opening a community question used to fail for anyone the backend would not
 * authenticate — a logged-out visitor most of all.
 *
 * Every /api/community/** route sits behind the JWT filter and answers 401 to
 * an anonymous request. The backend does expose ONE unauthenticated twin,
 * POST /api/shared/getAllAnswersForSpecificQuestion, verified against the live
 * service: a route that does not exist answers "No endpoint POST ...", while
 * that one answers {"status":"Failure","message":"Question not found"} for a
 * made-up id. These tests pin the client to that twin whenever there is no
 * token, and pin the two ways it reports failure.
 *
 * Only `fetch` is faked, so a wrong URL, a stray Authorization header or a body
 * the shared endpoint rejects fails the test.
 */

const TS: FirebaseTimestamp = { seconds: 1_700_000_000, nanos: 0 } as unknown as FirebaseTimestamp;

const questionFixture = (): QuestionDetailData => ({
  questionAskeduserId: "9990001111",
  questionAskedFullName: "Riya Sharma",
  questionAskedInterestedCourse: "Engineering",
  questionAskedPhotoUrl: null,
  loggedInUserId: "",
  loggedInUserFirstName: "",
  loggedInUserPhotoUrl: null,
  role: "user",
  questionId: "q-123",
  question: "How do I pick between VJTI and SPIT?",
  answerStructure: [],
  timestamp: TS,
  questionBookmarkedByMe: false,
  updatedTimestamp: TS,
  updated: false,
});

type Call = { url: string; init?: RequestInit };
let calls: Call[];

const respond = (body: unknown, status = 200) =>
  ({
    ok: status >= 200 && status < 300,
    status,
    statusText: status === 200 ? "OK" : "Error",
    headers: { get: () => "application/json" },
    json: async () => body,
    text: async () => JSON.stringify(body),
  } as unknown as Response);

let handler: (url: string, init?: RequestInit) => Response | Promise<Response>;

const fakeFetch = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
  const url = String(input);
  calls.push({ url, init });
  return handler(url, init);
});

const bodyOf = (call: Call) => JSON.parse(String(call.init?.body ?? "{}"));
const authOf = (call: Call) =>
  (call.init?.headers as Record<string, string> | undefined)?.Authorization;

const detailCall = () =>
  calls.find((c) => c.url.includes("getAllAnswersForSpecificQuestion"));

const renderPage = () =>
  render(
    <MemoryRouter initialEntries={["/community/question/q-123"]}>
      <Routes>
        <Route path="/community/question/:questionId" element={<QuestionDetailPage />} />
      </Routes>
    </MemoryRouter>,
  );

beforeEach(() => {
  calls = [];
  handler = () => respond({ status: "Success", data: questionFixture() });
  vi.stubGlobal("fetch", fakeFetch);
  useAuthStore.setState({
    user: null,
    userId: null,
    role: null,
    isAuthenticated: false,
  });
});

describe("community question detail — logged-out visitor", () => {
  it("reads the question through the unauthenticated endpoint", async () => {
    renderPage();

    await screen.findByText("How do I pick between VJTI and SPIT?");

    const call = detailCall();
    expect(call).toBeDefined();
    expect(call!.url).toBe("https://api.test/api/shared/getAllAnswersForSpecificQuestion");
    expect(call!.url).not.toContain("/api/community/");
  });

  it("sends no Authorization header and no loggedInUserId", async () => {
    renderPage();
    await screen.findByText("How do I pick between VJTI and SPIT?");

    const call = detailCall()!;
    expect(authOf(call)).toBeUndefined();
    expect(bodyOf(call)).toEqual({ questionId: "q-123", role: "user" });
  });

  it("never falls back to the 401-guarded community route", async () => {
    renderPage();
    await screen.findByText("How do I pick between VJTI and SPIT?");

    expect(calls.some((c) => c.url.includes("/api/community/dashboard/"))).toBe(false);
  });
});

describe("community question detail — signed-in visitor", () => {
  beforeEach(() => {
    localStorage.setItem("jwt", "jwt-abc");
    useAuthStore.setState({
      user: { firstName: "Asha", role: "user" } as never,
      userId: "7000000000",
      role: "user",
      isAuthenticated: true,
    });
  });

  it("uses the authenticated route, with the token and the caller's id", async () => {
    renderPage();
    await screen.findByText("How do I pick between VJTI and SPIT?");

    const call = detailCall()!;
    expect(call.url).toBe(
      "https://api.test/api/community/dashboard/getAllAnswersForSpecificQuestion",
    );
    expect(authOf(call)).toBe("Bearer jwt-abc");
    expect(bodyOf(call)).toEqual({
      questionId: "q-123",
      role: "user",
      loggedInUserId: "7000000000",
    });
  });
});

describe("community question detail — failure states", () => {
  it("shows 'Question not found' for the backend's 500-with-Failure body", async () => {
    // The live service really does answer HTTP 500 here, with the verdict in
    // the body — so `response.ok` must not be what decides success.
    handler = () => respond({ status: "Failure", message: "Question not found" }, 500);

    renderPage();

    expect(await screen.findByText("Question not found")).toBeInTheDocument();
    expect(screen.queryByText("Loading details...")).not.toBeInTheDocument();
  });

  it("shows a retryable error — not a stuck loader — when the request throws", async () => {
    handler = () => {
      throw new Error("network down");
    };

    renderPage();

    expect(await screen.findByText("Couldn't load this question")).toBeInTheDocument();
    expect(screen.queryByText("Loading details...")).not.toBeInTheDocument();

    handler = () => respond({ status: "Success", data: questionFixture() });
    await userEvent.click(screen.getByRole("button", { name: /try again/i }));

    await screen.findByText("How do I pick between VJTI and SPIT?");
  });

  it("distinguishes a deleted question from a transient failure at the API layer", async () => {
    handler = () => respond({ status: "Failure", message: "Question not found" }, 500);
    await expect(getAllAnswersForSpecificQuestion("q-123")).rejects.toBeInstanceOf(
      QuestionNotFoundError,
    );

    handler = () => respond({ status: "Failure", message: "Internal error" }, 500);
    const err = await getAllAnswersForSpecificQuestion("q-123").catch((e) => e);
    expect(err).toBeInstanceOf(Error);
    expect(err).not.toBeInstanceOf(QuestionNotFoundError);
  });
});

describe("community role mapping", () => {
  it("posts as 'user' for a school student — the service knows no such role", () => {
    expect(getCommunityRole({ role: "schoolStudent" })).toBe("user");
  });

  it("leaves the four real roles alone", () => {
    expect(getCommunityRole({ role: "user" })).toBe("user");
    expect(getCommunityRole({ role: "student" })).toBe("student");
    expect(getCommunityRole({ role: "counselor" })).toBe("counselor");
    expect(getCommunityRole({ role: "proBuddy", verified: true })).toBe("proBuddy");
    expect(getCommunityRole({ role: "proBuddy", verified: false })).toBe("user");
    expect(getCommunityRole(null)).toBe("user");
  });

  it("sends role 'user' on the wire for a signed-in school student", async () => {
    localStorage.setItem("jwt", "jwt-school");
    useAuthStore.setState({
      user: { firstName: "Aarav", role: "schoolStudent" } as never,
      userId: "8000000000",
      role: "schoolStudent",
      isAuthenticated: true,
    });

    renderPage();
    await screen.findByText("How do I pick between VJTI and SPIT?");

    expect(bodyOf(detailCall()!).role).toBe("user");
  });
});

describe("what must not change", () => {
  it("still renders the empty-answers prompt", async () => {
    renderPage();
    await waitFor(() =>
      expect(screen.getByText("Be the first to answer this question!")).toBeInTheDocument(),
    );
  });
});
