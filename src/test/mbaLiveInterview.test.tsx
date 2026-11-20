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

    expect(answer).toHaveBeenCalledWith("iv1", ANSWER);
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

  it("explains the daily AI limit when the backend says 429", async () => {
    vi.spyOn(liveInterviewApi, "create").mockRejectedValue({ isAxiosError: true, response: { status: 429 } });
    const user = userEvent.setup();
    renderAt("/mba/gdpi/live");
    await user.click(screen.getByRole("button", { name: "Start the interview" }));
    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent(/today's AI limit/));
  });
});
