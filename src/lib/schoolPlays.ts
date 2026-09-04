/**
 * What this student has played, per day.
 *
 * ─── Why a local ledger at all ───────────────────────────────────────────────
 *
 * Completed runs are now sent to `createGameSession`. This ledger remains the
 * immediate, offline-safe view while that request is in flight or unavailable.
 *
 * Without a local record, three surfaces that describe the same fact disagreed
 * the moment a game finished: the day tile said "not played", the dashboard's
 * daily goal ticked, and the points went back to zero on the next reload.
 *
 * ─── What it is and is not ──────────────────────────────────────────────────
 *
 * It is a per-device cache of runs this browser saw, keyed by student and date.
 * It is NOT the score of record. Every read is layered UNDER the server's
 * numbers (see `withServerRecord`), so the day the backend starts awarding
 * points, the server's total overtakes this and this stops mattering — no
 * migration, no double-count.
 *
 * Deliberately separate from `schoolStudentProgress`: that file models the
 * programme (quests, quarters, levels) and is rewritten wholesale on every
 * update. Runs are append-only facts about specific days and must survive that.
 */

const KEY_PREFIX = 'procounsel:school-plays:v1:';

/** How many days of history to keep. Well past what any surface displays. */
const KEEP_DAYS = 120;

export type Play = {
  date: string;
  gameId: string;
  setId: string | null;
  /** Null for engines whose run is not out of a number (sudoku, word). */
  correct: number | null;
  total: number | null;
  /** True/false for solve-or-nothing games; null for a quiz. */
  solved: boolean | null;
  points: number;
  seconds: number;
  /** ms epoch, so a replay of the same day can be told apart from the first. */
  at: number;
};

type Ledger = Record<string, Play>;

const keyFor = (studentId: string) => `${KEY_PREFIX}${studentId}`;

const read = (studentId: string | null | undefined): Ledger => {
  if (!studentId) return {};
  try {
    const raw = localStorage.getItem(keyFor(studentId));
    const parsed = raw ? (JSON.parse(raw) as unknown) : null;
    // Anything that is not a plain object — an older shape, a truncated write —
    // means "no history", never a throw on a page that is only reading.
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? (parsed as Ledger) : {};
  } catch {
    return {};
  }
};

const write = (studentId: string, ledger: Ledger): void => {
  try {
    localStorage.setItem(keyFor(studentId), JSON.stringify(ledger));
  } catch {
    // Private mode or a full quota. The run still happened and still shows on
    // this screen; it just is not remembered for tomorrow.
  }
};

/** Every run this device knows about, newest first. */
export function listPlays(studentId: string | null | undefined): Play[] {
  return Object.values(read(studentId)).sort((a, b) => b.date.localeCompare(a.date));
}

/** The run for one date, or null. */
export function getPlay(studentId: string | null | undefined, date: string): Play | null {
  return read(studentId)[date] ?? null;
}

/**
 * Record a finished run.
 *
 * A replay of the same day overwrites the earlier attempt rather than adding to
 * it — every game on the programme is `oneAttemptPerDay`, so a second run is a
 * practice go, and letting practice compound the day's points would let anyone
 * farm the leaderboard by refreshing.
 *
 * Returns the points this run ADDS to the student's total: the full amount for
 * a first attempt that day, and the improvement (never negative) for a replay.
 */
export function recordPlay(studentId: string | null | undefined, play: Omit<Play, 'at'>): number {
  if (!studentId) return 0;

  const ledger = read(studentId);
  const previous = ledger[play.date];
  const delta = previous ? Math.max(0, play.points - previous.points) : play.points;

  ledger[play.date] = { ...play, points: Math.max(play.points, previous?.points ?? 0), at: Date.now() };

  // Trim on write rather than on read: reads happen on every render of the
  // games page, writes once a day at most.
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - KEEP_DAYS);
  const oldest = cutoff.toISOString().slice(0, 10);
  for (const date of Object.keys(ledger)) if (date < oldest) delete ledger[date];

  write(studentId, ledger);
  return delta;
}

/** Total points this device has seen earned. Layered under the server's total. */
export const localPoints = (studentId: string | null | undefined): number =>
  listPlays(studentId).reduce((sum, play) => sum + (play.points || 0), 0);

/** Distinct days played — what the dashboard's "quizzes played" counts. */
export const playCount = (studentId: string | null | undefined): number =>
  listPlays(studentId).length;
