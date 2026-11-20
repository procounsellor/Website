import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { procounselApi } from "@/api/procounselApi";
import { mbaStatus } from "@/api/mba";
import type { Background, Delivery, FeedbackScores } from "@/api/mbaGdpi";

/**
 * Live AI mock interview: an AI "panel" asks one question at a time and writes
 * each follow-up from the student's profile and previous answers. No feedback
 * during the interview (like a real one); a report at the end.
 *
 * Contract: procounsel-neet-api/docs/mba-api.md "Live AI interview". All endpoints are 🔒 mbaStudent.
 */

// procounselApi's baseURL already ends in /api/v1 (same as mbaGdpi.ts).
const MBA = "/mba";

export type LiveBand = "ready" | "almost" | "needs_work";

export interface LiveTurn {
  number: number;
  question: string;
  questionType: string;
  askedAt: string;
  answerText: string | null;
  mode: "text" | "voice" | null;
  delivery: Delivery | null;
  scores: FeedbackScores | null;
  note: string | null;
  answeredAt: string | null;
}

export interface LiveReport {
  overall: number | null;
  scores: FeedbackScores | null;
  band: LiveBand | null;
  summary: string;
  strengths: string[];
  improvements: string[];
  fallback: boolean;
}

export interface LiveInterview {
  id: string;
  status: "in_progress" | "completed";
  profile: { background: Background | null; workMonths: number; target: string | null };
  totalQuestions: number;
  turns: LiveTurn[];
  report: LiveReport | null;
  startedAt: string;
  completedAt: string | null;
}

export interface LiveInterviewSummary {
  id: string;
  status: "in_progress" | "completed";
  answered: number;
  totalQuestions: number;
  overall: number | null;
  startedAt: string;
  completedAt: string | null;
}

export interface LiveInterviewInput {
  background?: Background;
  workMonths?: number;
  target?: string;
  about?: string;
  questions?: number;
}

export interface LiveTurnResponse {
  interview: LiveInterview;
  remainingToday: number;
}

export const LIVE_MIN_CHARS = 20;
export const LIVE_MAX_CHARS = 2000;

const path = (id: string) => `${MBA}/me/live-interviews/${encodeURIComponent(id)}`;

export const liveInterviewApi = {
  create: (body: LiveInterviewInput) =>
    procounselApi.post<LiveInterview>(`${MBA}/me/live-interviews`, body).then((r) => r.data),
  list: () =>
    procounselApi.get<{ interviews: LiveInterviewSummary[] }>(`${MBA}/me/live-interviews`).then((r) => r.data),
  get: (id: string) => procounselApi.get<LiveInterview>(path(id)).then((r) => r.data),
  answer: (id: string, answerText: string) =>
    procounselApi.post<LiveTurnResponse>(`${path(id)}/answers`, { answerText }, { timeout: 60_000 }).then((r) => r.data),
  /** Raw recording as the body; the server transcribes it and discards the audio. */
  answerVoice: (id: string, audio: Blob, durationSeconds: number) =>
    procounselApi
      .post<LiveTurnResponse>(`${path(id)}/answers/voice`, audio, {
        params: { durationSeconds: Math.round(durationSeconds * 10) / 10 },
        headers: { "Content-Type": audio.type || "audio/webm" },
        timeout: 120_000,
      })
      .then((r) => r.data),
  finish: (id: string) => procounselApi.post<LiveTurnResponse>(`${path(id)}/finish`).then((r) => r.data),
};

export const liveKeys = {
  list: ["mba", "live-interview", "list"] as const,
  one: (id: string) => ["mba", "live-interview", id] as const,
};

const retry = (count: number, err: unknown) => {
  const status = mbaStatus(err);
  if (status !== null && status >= 400 && status < 500) return false;
  return count < 1;
};

export const useLiveInterviews = () =>
  useQuery({ queryKey: liveKeys.list, queryFn: liveInterviewApi.list, retry, staleTime: 0 });

export const useLiveInterview = (id: string | null | undefined) =>
  useQuery({
    queryKey: liveKeys.one(id ?? ""),
    queryFn: () => liveInterviewApi.get(id as string),
    retry,
    enabled: !!id,
    staleTime: 0,
  });

function useStore() {
  const qc = useQueryClient();
  return (interview: LiveInterview) => {
    qc.setQueryData(liveKeys.one(interview.id), interview);
    void qc.invalidateQueries({ queryKey: liveKeys.list });
  };
}

export const useCreateLiveInterview = () => {
  const store = useStore();
  return useMutation({ mutationFn: liveInterviewApi.create, onSuccess: store });
};

export const useLiveAnswer = () => {
  const store = useStore();
  return useMutation({
    mutationFn: ({ id, answerText }: { id: string; answerText: string }) => liveInterviewApi.answer(id, answerText),
    onSuccess: (res) => store(res.interview),
  });
};

export const useLiveVoiceAnswer = () => {
  const store = useStore();
  return useMutation({
    mutationFn: ({ id, audio, durationSeconds }: { id: string; audio: Blob; durationSeconds: number }) =>
      liveInterviewApi.answerVoice(id, audio, durationSeconds),
    onSuccess: (res) => store(res.interview),
  });
};

export const useFinishLiveInterview = () => {
  const store = useStore();
  return useMutation({ mutationFn: (id: string) => liveInterviewApi.finish(id), onSuccess: (res) => store(res.interview) });
};

/** Copy for API errors in the live interview. */
export function liveErrorMessage(err: unknown, fallback: string): string {
  switch (mbaStatus(err)) {
    case 429:
      return "You've used today's AI limit (shared with practice hints and feedback). It resets at midnight IST.";
    case 503:
      return "The AI interviewer is unavailable right now. Please try again in a little while.";
    case 409:
      return "This question was already answered (perhaps in another tab). Reload to continue.";
    case 404:
      return "The live AI interview isn't switched on yet. Please try again a little later.";
    case 422:
      return "Give a fuller answer — at least a sentence or two — so the panel has something to go on.";
    default:
      return fallback;
  }
}
