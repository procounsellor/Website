import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { liveInterviewApi, type LiveInterview, type LiveTurn } from "@/api/mbaLiveInterview";
import MbaLiveInterview from "@/pages/mba/MbaLiveInterview";

/** Live AI mock interview: setup → room (one question at a time, AI follow-ups) → report. */

const turn = (n: number, over: Partial<LiveTurn> = {}): LiveTurn => ({
  number: n,
  question: n === 1 ? "Please introduce yourself, and tell us why you want to do an MBA now." : `Follow-up ${n}: why exactly audit?`,
  questionType: "personal",
  askedAt: "2026-11-19T06:00:00.000Z",
  answerText: null,
  mode: null,
  delivery: null,
  scores: null,
  note: null,
  answeredAt: null,
  ...over,
});

const interview = (over: Partial<LiveInterview> = {}): LiveInterview => ({
  id: "iv1",
  status: "in_progress",
  profile: { background: "commerce", workMonths: 18, target: "IIM, finance" },
  totalQuestions: 3,
  turns: [turn(1)],
  report: null,
  startedAt: "2026-11-19T06:00:00.000Z",
  completedAt: null,
  ...over,
});

const ANSWER = "I am a commerce graduate who spent two years in audit, and I want to move into corporate finance.";

function renderAt(path: string) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/mba/gdpi/live" element={<MbaLiveInterview />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

beforeEach(() => {
  vi.restoreAllMocks();
  sessionStorage.clear();
});

describe("live interview API paths", () => {
  it("calls /api/v1/mba/me/live-interviews (the client's baseURL already has /api/v1)", async () => {
    const { procounselApi } = await import("@/api/procounselApi");
    const post = vi.spyOn(procounselApi, "post").mockResolvedValue({ data: interview() });
    const get = vi.spyOn(procounselApi, "get").mockResolvedValue({ data: interview() });
    await liveInterviewApi.create({ questions: 5 });
    await liveInterviewApi.get("iv1");
    await liveInterviewApi.answer("iv1", "An answer that is long enough.");
    await liveInterviewApi.finish("iv1");
    expect(procounselApi.defaults.baseURL).toMatch(/\/api\/v1$/);
    expect(post.mock.calls.map((c) => c[0])).toEqual([
      "/mba/me/live-interviews",
      "/mba/me/live-interviews/iv1/answers",
      "/mba/me/live-interviews/iv1/finish",
    ]);
    expect(get.mock.calls[0][0]).toBe("/mba/me/live-interviews/iv1");
  });
});

describe("/mba/gdpi/live", () => {
  it("sends the profile and starts the interview with the first question", async () => {
    const create = vi.spyOn(liveInterviewApi, "create").mockResolvedValue(interview());
    vi.spyOn(liveInterviewApi, "get").mockResolvedValue(interview());
    const user = userEvent.setup();
    renderAt("/mba/gdpi/live");

    await user.click(screen.getByRole("button", { name: "Commerce" }));
    await user.click(screen.getByRole("button", { name: "1–2 years" }));
    await user.type(screen.getByPlaceholderText(/IIMs, finance/), "IIM, finance");
    await user.click(screen.getByRole("button", { name: "Quick · 5 questions" }));
    await user.click(screen.getByRole("button", { name: "Start the interview" }));

    // React Query passes its own context as a second argument; check the request body only.
    expect(create.mock.calls[0][0]).toEqual({ background: "commerce", workMonths: 18, target: "IIM, finance", about: undefined, questions: 5 });
    expect(await screen.findByRole("heading", { name: /introduce yourself/ })).toBeInTheDocument();
    expect(screen.getByText(/Question 1 of 3/)).toBeInTheDocument();
  });

  it("takes a typed answer and shows the panel's follow-up (no feedback during the interview)", async () => {
    vi.spyOn(liveInterviewApi, "get").mockResolvedValue(interview());
    const answer = vi.spyOn(liveInterviewApi, "answer").mockResolvedValue({
      interview: interview({
        turns: [turn(1, { answerText: ANSWER, mode: "text", note: "Add a number.", scores: { structure: 3, clarity: 4, relevance: 4, completeness: 2 } }), turn(2)],
      }),
      remainingToday: 28,
    });
    const user = userEvent.setup();
    renderAt("/mba/gdpi/live?interview=iv1");

    await screen.findByRole("heading", { name: /introduce yourself/ });
    await user.click(screen.getByRole("button", { name: /Type/ }));
    const send = screen.getByRole("button", { name: "Send answer" });
    expect(send).toBeDisabled();
    await user.type(screen.getByLabelText("Your answer"), ANSWER);
    await user.click(send);

    // Camera off: no body-language numbers go with the answer.
    expect(answer).toHaveBeenCalledWith("iv1", ANSWER, null);
    expect(await screen.findByRole("heading", { name: /Follow-up 2/ })).toBeInTheDocument();
    expect(screen.getByText(/Question 2 of 3/)).toBeInTheDocument();
    // Like a real panel: the coaching note waits for the report.
    expect(screen.queryByText("Add a number.")).not.toBeInTheDocument();
  });

  it("can end early after two answers and shows the report with the transcript", async () => {
    const answered = [
      turn(1, { answerText: ANSWER, mode: "text", note: "Lead with your point." }),
      turn(2, { answerText: ANSWER, mode: "text", note: "Add a number." }),
      turn(3),
    ];
    vi.spyOn(liveInterviewApi, "get").mockResolvedValue(interview({ turns: answered }));
    const finish = vi.spyOn(liveInterviewApi, "finish").mockResolvedValue({
      interview: interview({
        status: "completed",
        totalQuestions: 2,
        turns: answered.slice(0, 2),
        completedAt: "2026-11-19T06:20:00.000Z",
        report: {
          overall: 3.5,
          scores: { structure: 4, clarity: 3, relevance: 4, completeness: 3 },
          band: "almost",
          summary: "You give clear reasons for an MBA, but your examples need numbers.",
          strengths: ["Clear motivation"],
          improvements: ["Quantify your impact"],
          fallback: false,
        },
      }),
      remainingToday: 27,
    });
    const user = userEvent.setup();
    renderAt("/mba/gdpi/live?interview=iv1");

    await user.click(await screen.findByRole("button", { name: /End interview/ }));
    expect(finish).toHaveBeenCalledWith("iv1");
    expect(await screen.findByRole("heading", { name: "3.5 / 5 overall" })).toBeInTheDocument();
    expect(screen.getByText("Almost there")).toBeInTheDocument();
    expect(screen.getByText("Quantify your impact")).toBeInTheDocument();
    expect(screen.getByText("Lead with your point.")).toBeInTheDocument();
    expect(screen.getByText(/does not predict shortlisting or admission/)).toBeInTheDocument();
  });

  it("shows the detailed report: score out of 100, mistakes, communication, knowledge, body language, next steps", async () => {
    const cam = { durationSeconds: 60, samples: 240, faceVisiblePct: 96, eyeContactPct: 72, lookAwayCount: 3, smilePct: 18, steadiness: 81 };
    vi.spyOn(liveInterviewApi, "get").mockResolvedValue(
      interview({
        status: "completed",
        totalQuestions: 1,
        turns: [turn(1, { answerText: ANSWER, mode: "text", presence: cam })],
        completedAt: "2026-11-28T10:00:00.000Z",
        report: {
          overall: 3.5,
          score100: 71,
          scores: { structure: 4, clarity: 3, relevance: 4, completeness: 3 },
          band: "almost",
          summary: "Solid base.",
          strengths: ["Specific numbers"],
          mistakes: ["You said 'many things' without one example."],
          improvements: ["Quantify your impact"],
          communication: { score: 4, notes: ["Steady and clear."] },
          knowledge: { score: 3, notes: ["Thin on finance basics."] },
          bodyLanguage: { score: 4, notes: ["Good eye contact overall."] },
          nextSteps: ["Record two answers a day and replay them."],
          voice: null,
          camera: { answers: 1, faceVisiblePct: 96, eyeContactPct: 72, lookAwaysPerMinute: 3, smilePct: 18, steadiness: 81 },
          fallback: false,
        },
      }),
    );
    renderAt("/mba/gdpi/live?interview=iv1");

    expect(await screen.findByRole("heading", { name: "71 / 100 overall" })).toBeInTheDocument();
    expect(screen.getByText("Mistakes the panel would notice")).toBeInTheDocument();
    expect(screen.getByText("You said 'many things' without one example.")).toBeInTheDocument();
    expect(screen.getByText("Communication & confidence")).toBeInTheDocument();
    expect(screen.getByText("Thin on finance basics.")).toBeInTheDocument();
    expect(screen.getByText("Body language & eye contact")).toBeInTheDocument();
    expect(screen.getByText(/Eye contact 72% · in frame 96%/)).toBeInTheDocument();
    expect(screen.getByText("Record two answers a day and replay them.")).toBeInTheDocument();
  });

  it("asks for the camera next time when the interview had no camera numbers", async () => {
    vi.spyOn(liveInterviewApi, "get").mockResolvedValue(
      interview({
        status: "completed",
        totalQuestions: 1,
        turns: [turn(1, { answerText: ANSWER, mode: "text" })],
        report: {
          overall: 3, score100: 60, scores: { structure: 3, clarity: 3, relevance: 3, completeness: 3 }, band: "almost",
          summary: "s", strengths: [], improvements: ["x"], bodyLanguage: null, camera: null, fallback: false,
        },
      }),
    );
    renderAt("/mba/gdpi/live?interview=iv1");
    expect(await screen.findByText(/Turn on your camera next time/)).toBeInTheDocument();
  });

  it("explains the daily AI limit when the backend says 429", async () => {
    vi.spyOn(liveInterviewApi, "create").mockRejectedValue({ isAxiosError: true, response: { status: 429 } });
    const user = userEvent.setup();
    renderAt("/mba/gdpi/live");
    await user.click(screen.getByRole("button", { name: "Start the interview" }));
    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent(/today's AI limit/));
  });
});
