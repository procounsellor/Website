/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  DEMO MODE — TEMPORARY. DELETE THIS FILE AFTER THE PRESENTATION.
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Everything the demo needs that the real product must not ship lives here, so
 * turning it off is one flag and removing it is one file plus its imports.
 * `grep -rn "demoMode"` finds every call site.
 *
 * What it changes, and why each one is a lie the real app must not tell:
 *
 *  1. **A fixed date.** The games section behaves as though it is always
 *     `date`, so the same quiz appears tomorrow as today. Really the schedule
 *     is per-day and today (30 Aug) has no game at all.
 *  2. **A local answer key.** The backend deliberately withholds the correct
 *     option — otherwise the answer key ships to every browser — and has no
 *     endpoint to submit an attempt. So scoring cannot honestly happen on the
 *     client. For the demo the key below is transcribed BY HAND from each
 *     item's own `explanation`, verified one by one against the live payload of
 *     `quiz_careers_s1`. It is exact for that set and that set only; a
 *     heuristic over the explanation text scored just 62% across all sets,
 *     which is nowhere near good enough to tell a fourteen-year-old they got
 *     something wrong.
 *  3. **Progress in localStorage.** So points and finished tasks survive to
 *     tomorrow. In the real product the run is sessionStorage (one sitting) and
 *     the totals belong to the server.
 *
 * When the backend ships `submitGameSession`, all three go away together: the
 * server returns the score, the key and the awarded points.
 */

export const DEMO_MODE = true;

/** The date the games section pretends it is. */
export const DEMO_DATE = '2026-09-01';

/**
 * itemId → correct option id.
 *
 * Transcribed by hand from each item's own payload, so every entry is checkable
 * against the live API rather than guessed:
 *
 *   quiz  — from `explanation`. itm_q1_01 reads "Architects must register with
 *           the Council of Architecture to practise under that title", so the
 *           answer is (b) Architect.
 *   myth  — from `explanation`. One that opens "True." confirms its statement;
 *           the rest refute theirs.
 *   flags — from `imageUrl`. `…/flags/india.svg` is India.
 *
 * Covers the three sets a demo can land on. Sudoku needs no key (it marks
 * itself) and Career Word has none (the API never sends the word).
 */
export const DEMO_ANSWER_KEY: Record<string, string> = {
  // ── flags_world: read off each item's own imageUrl (…/india.svg → India) ──
  itm_fg_01: 'a', // india
  itm_fg_02: 'b', // japan
  itm_fg_03: 'a', // brazil
  itm_fg_04: 'a', // canada
  itm_fg_05: 'b', // nepal
  itm_fg_06: 'b', // switzerland
  itm_fg_07: 'b', // south africa
  itm_fg_08: 'a', // bhutan
  itm_fg_09: 'a', // sri lanka
  itm_fg_10: 'b', // argentina

  // ── mythfact_s1: an explanation opening "True." marks a fact; the rest
  //    refute their statement and are therefore myths.
  itm_mf_01: 'myth',
  itm_mf_02: 'myth',
  itm_mf_03: 'fact', // "True. The title is legally protected in India"
  itm_mf_04: 'myth',
  itm_mf_05: 'myth',
  itm_mf_06: 'fact', // "True. It is the single qualifying exam"
  itm_mf_07: 'myth',
  itm_mf_08: 'myth',
  itm_mf_09: 'fact', // "True. Diploma holders can enter the second year"
  itm_mf_10: 'myth',

  // ── quiz_careers_s1 ──
  itm_q1_01: 'b', // Architect — must register with the Council of Architecture
  itm_q1_02: 'a', // ICAI — licenses Chartered Accountants
  itm_q1_03: 'b', // NEET — the qualifying exam for MBBS
  itm_q1_04: 'b', // Weather and atmosphere — not meteors
  itm_q1_05: 'b', // Interior designer — plans internal spaces
  itm_q1_06: 'a', // Mechanical engineering — machines and moving systems
  itm_q1_07: 'b', // Life in oceans and seas
  itm_q1_08: 'b', // Journalist — the one that is not lab-based
  itm_q1_09: 'b', // Preparing and dispensing medicines
  itm_q1_10: 'a', // Animator — drawing plus software
};

/** The date the school area should treat as today. */
export const demoToday = (real: string): string => (DEMO_MODE ? DEMO_DATE : real);

/**
 * Marks an attempt, where the demo has a key for it.
 *
 * Returns null when there is no key, and callers must then show no score at all
 * rather than a guessed one — which is exactly what the real product does for
 * every set until the server can mark them.
 */
export function scoreWithDemoKey(
  answers: Record<string, string>,
  itemIds: string[],
): { correct: number; total: number; byItem: Record<string, boolean> } | null {
  if (!DEMO_MODE) return null;

  const known = itemIds.filter((id) => DEMO_ANSWER_KEY[id]);
  if (known.length === 0) return null;

  const byItem: Record<string, boolean> = {};
  let correct = 0;
  for (const id of known) {
    const right = answers[id] === DEMO_ANSWER_KEY[id];
    byItem[id] = right;
    if (right) correct += 1;
  }

  return { correct, total: known.length, byItem };
}

// ── Whether today's game has been played ─────────────────────────────────────

/**
 * The record of a finished run.
 *
 * `getGameSession` is the real answer to "has this student played today", and
 * it cannot be: it 500s because no session exists, and nothing can create one
 * without `submitGameSession`. So the card said "Not played yet" even with the
 * daily goal already ticked and a quiz counted on the dashboard — three
 * surfaces disagreeing about the same fact.
 *
 * This keeps that one fact locally so the demo is self-consistent. It is the
 * first thing to delete when sessions are real.
 */
export type DemoPlay = { date: string; correct: number | null; total: number | null };

const PLAY_KEY = 'procounsel:demo-play:v1';

const readPlays = (): Record<string, DemoPlay> => {
  if (!DEMO_MODE) return {};
  try {
    return JSON.parse(localStorage.getItem(PLAY_KEY) ?? '{}') as Record<string, DemoPlay>;
  } catch {
    return {};
  }
};

export function recordDemoPlay(date: string, correct: number | null, total: number | null): void {
  if (!DEMO_MODE) return;
  try {
    const all = readPlays();
    all[date] = { date, correct, total };
    localStorage.setItem(PLAY_KEY, JSON.stringify(all));
  } catch {
    // Storage unavailable. The run still finished; it just is not remembered.
  }
}

export const getDemoPlay = (date: string): DemoPlay | null => readPlays()[date] ?? null;
