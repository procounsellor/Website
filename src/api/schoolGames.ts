/**
 * The games half of /api/schoolStudent.
 *
 * Transport, the Accept header and the "500 means nothing here" rule all live
 * in schoolStudentApi — read that file's header before touching this one.
 */

import { schoolGet } from '@/api/schoolStudentApi';

// ── Shapes, as the live API actually returns them ────────────────────────────

/** How a game is played. Drives which board the player page opens. */
export type GameEngine =
  | 'quiz_mcq_v1'
  | 'binary_card_v1'
  | 'sudoku_v1'
  | 'word_guess_v1'
  | (string & {});

export type Game = {
  gameId: string;
  name: string;
  description: string;
  engine: GameEngine;
  isActive: boolean;
  sortOrder: number;
  defaultTimeLimitSecs: number;
  /** Set for per-answer scoring (quiz, flags); null for solve-or-nothing games. */
  pointsPerCorrect: number | null;
  /** Set for solve-or-nothing games (sudoku, word); null for per-answer ones. */
  solvePoints: number | null;
  passingPercent: number;
  speedBonus: number;
  noMistakeBonus: number;
  supportsHints: boolean;
  hintPenalty: number;
  oneAttemptPerDay: boolean;
};

/** What is scheduled for one date, for one grade. */
export type TodayGame = {
  date: string;
  gameId: string;
  setId: string | null;
  itemId: string | null;
  title: string | null;
  status: string;
};

/** The same schedule row before it is narrowed to a grade. */
export type TodaySchedule = {
  date: string;
  gameId: string;
  title: string | null;
  status: string;
  plays: number;
  avgPercent: number;
  linkedTaskId: string | null;
  byGrade: Record<string, { setId: string | null; itemId: string | null }> | null;
};

/** A pack of questions: the unit a day's game is actually drawn from. */
export type GameSet = {
  setId: string;
  gameId: string;
  title: string;
  status: string;
  isActive: boolean;
  grades: number[];
  itemCount: number;
  points: number;
  timeLimitSecs: number;
  mode: string;
  /** "free" or a paid tier — what it costs to open the set. */
  passTier: string;
  setNumber: number | null;
  quarter: number | null;
  plays: number;
  avgPercent: number;
  cycleId: string;
};

export type GameSession = {
  studentId?: string;
  date?: string;
  gameId?: string;
  setId?: string;
  status?: string;
  score?: number;
  percent?: number;
  correct?: number;
  total?: number;
  completedAt?: string;
};

// ── Calls ─────────────────────────────────────────────────────────────────────

/** Every game in the catalogue, already ordered the way the backend wants. */
export async function listGames(fresh = false): Promise<Game[]> {
  const games = await schoolGet<Game[]>('/getAllGames', { fresh });
  if (!Array.isArray(games)) return [];
  return [...games].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
}

export const getGame = (gameId: string, fresh = false) =>
  schoolGet<Game>(`/getGameById?gameId=${encodeURIComponent(gameId)}`, { fresh });

/**
 * The game scheduled for a date, narrowed to the student's grade.
 *
 * A grade is required to know WHICH set a student opens — the same day can
 * point class 8 and class 10 at different packs. Callers without a usable grade
 * fall back to `schedule()`, which reports the day's game but not the set.
 */
export const getTodayGameByGrade = (date: string, grade: number, fresh = false) =>
  schoolGet<TodayGame>(
    `/getTodayGameByGrade?date=${encodeURIComponent(date)}&grade=${grade}`,
    { fresh },
  );

export const getSchedule = (date: string, fresh = false) =>
  schoolGet<TodaySchedule>(`/getTodayGame?date=${encodeURIComponent(date)}`, { fresh });

export const getSet = (setId: string, fresh = false) =>
  schoolGet<GameSet>(`/getGameSetById?setId=${encodeURIComponent(setId)}`, { fresh });

export const getSession = (studentId: string, date: string, fresh = false) =>
  schoolGet<GameSession>(
    `/getGameSession?studentId=${encodeURIComponent(studentId)}&date=${encodeURIComponent(date)}`,
    { fresh },
  );

// ── Small helpers the game surfaces share ────────────────────────────────────

export { today, parseGrade } from '@/api/schoolStudentApi';

/** 120 → "2 min", 90 → "1 min 30 s", 45 → "45 s". */
export function duration(seconds: number | null | undefined): string {
  if (!seconds || seconds <= 0) return '\u2014';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (!mins) return `${secs} s`;
  if (!secs) return `${mins} min`;
  return `${mins} min ${secs} s`;
}

/** What a student earns, phrased from the scoring fields the game carries. */
export function scoringLabel(game: Game): string {
  if (game.pointsPerCorrect) {
    return `${game.pointsPerCorrect} point${game.pointsPerCorrect === 1 ? '' : 's'} per correct answer`;
  }
  if (game.solvePoints) return `${game.solvePoints} points for solving it`;
  return 'Points on completion';
}
