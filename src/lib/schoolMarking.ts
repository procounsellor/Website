/**
 * Marking a school-game attempt.
 *
 * One module owns "was this right and what is it worth", so the boards, the
 * results screen and the progress ledger can never disagree about a run — which
 * they did while each of them worked it out for itself.
 *
 * Every engine has a source of truth and they are not the same source:
 *
 *   sudoku_v1      the puzzle's own solution (lib/sudoku)
 *   flag_guess     the item's own imageUrl — `…/flags/japan.svg` is Japan
 *   quiz_mcq_v1    the reviewed key in data/schoolGameAnswers
 *   binary_card_v1 the same key
 *   word_guess_v1  the same key, re-checked against length and pattern
 *
 * `answerFor` returns null when nothing can be established, and every caller
 * must then show no verdict at all rather than a guessed one. That path is not
 * theoretical: a set published tomorrow has no key entry until someone adds
 * one, and "we can't mark this yet" is the honest thing to say about it.
 */

import { MCQ_ANSWERS, WORD_ANSWERS } from '@/data/schoolGameAnswers';
import type { GameItem } from '@/lib/gameItems';

/** "south_africa.svg" → "south africa". Also strips a gs:// or https:// path. */
const countryFromImage = (url: string | null | undefined): string | null => {
  if (!url) return null;
  const file = url.split('/').pop();
  if (!file) return null;
  return file
    .replace(/\.[a-z0-9]+$/i, '')
    .replace(/[_-]+/g, ' ')
    .trim()
    .toLowerCase();
};

const normalise = (text: string): string => text.trim().toLowerCase().replace(/\s+/g, ' ');

/**
 * The correct option id for an MCQ-shaped item, or null if it cannot be known.
 *
 * Flags are resolved from the item itself rather than from the key, so a new
 * flag set works the day it is published with nothing to maintain. The lookup
 * is exact against the option text — a filename with no matching option (a
 * typo, a country spelled differently) yields null and the item goes unmarked,
 * which is right: half-guessing a flag is how you tell someone Nepal is Bhutan.
 */
export function answerFor(item: GameItem): string | null {
  if (item.gameId === 'flag_guess') {
    const country = countryFromImage(item.content.imageUrl);
    const match = item.content.options?.find((o) => normalise(o.text) === country);
    if (match) return match.id;
    // Falls through: a keyed entry still wins if someone added one.
  }

  const keyed = MCQ_ANSWERS[item.itemId];
  if (!keyed) return null;

  // An id that no longer exists on the item means the set was re-authored and
  // the key is stale. Unmarked beats wrongly marked.
  const exists = item.content.options?.some((o) => o.id === keyed);
  return exists ? keyed : null;
}

export type MarkedItem = {
  itemId: string;
  /** What the student picked. Undefined when they skipped it. */
  chosenId?: string;
  /** The right answer, or null when this item cannot be marked. */
  correctId: string | null;
  /** null when unmarkable or unanswered — never guessed. */
  isRight: boolean | null;
};

export type Mark = {
  /** Items that could be marked AND were answered. */
  correct: number;
  /** The denominator: items that could be marked at all. */
  total: number;
  /** Items with no key, excluded from the score entirely. */
  unmarkable: number;
  percent: number;
  byItem: MarkedItem[];
};

/**
 * Marks an MCQ, flag or myth/fact run.
 *
 * Unanswered items count against the student (they are in `total` and not in
 * `correct`) because skipping is a choice. Unmarkable items do not, because
 * that is our gap, not theirs — a set with no key scores out of however many
 * items we can actually mark, and `unmarkable` lets the summary say so.
 *
 * Returns null when NOTHING in the run can be marked, which is the signal for
 * the results screen to show no score rather than a meaningless 0/0.
 */
export function markMcq(items: GameItem[], answers: Record<string, string>): Mark | null {
  const byItem: MarkedItem[] = items.map((item) => {
    const correctId = answerFor(item);
    const chosenId = answers[item.itemId];
    return {
      itemId: item.itemId,
      chosenId,
      correctId,
      isRight: correctId === null ? null : chosenId === correctId,
    };
  });

  const markable = byItem.filter((row) => row.correctId !== null);
  if (markable.length === 0) return null;

  const correct = markable.filter((row) => row.isRight).length;
  return {
    correct,
    total: markable.length,
    unmarkable: byItem.length - markable.length,
    percent: Math.round((correct / markable.length) * 100),
    byItem,
  };
}

export type WordVerdict = {
  /** null when there is no key for this word — show no verdict. */
  isRight: boolean | null;
  /** The word, revealed only once the run is over. */
  answer: string | null;
};

/**
 * Checks a Career Word guess.
 *
 * The key entry is validated against the item before it is trusted: the word
 * must be the length the item declares and must fit its `displayPattern`. A key
 * that has drifted out of step with a re-authored item therefore marks nothing
 * instead of failing a correct guess.
 */
export function checkWord(item: GameItem, guess: string): WordVerdict {
  const word = WORD_ANSWERS[item.itemId]?.toUpperCase();
  if (!word) return { isRight: null, answer: null };

  const length = item.content.length ?? word.length;
  const pattern = (item.content.displayPattern ?? '').toUpperCase();

  if (word.length !== length) return { isRight: null, answer: null };
  if (pattern.length === length) {
    const fits = [...pattern].every((ch, i) => ch === '_' || ch === word[i]);
    if (!fits) return { isRight: null, answer: null };
  }

  return { isRight: guess.trim().toUpperCase() === word, answer: word };
}

/** The letter behind one slot, for the word board's "reveal a letter" hint. */
export function letterAt(item: GameItem, index: number): string | null {
  const word = WORD_ANSWERS[item.itemId]?.toUpperCase();
  if (!word) return null;
  if ((item.content.length ?? word.length) !== word.length) return null;
  return word[index] ?? null;
}

// ── What a run is worth ───────────────────────────────────────────────────────

export type RunPoints = {
  points: number;
  /** Plain-language lines for the summary: "8 correct · 8 pts", "−2 hints". */
  breakdown: { label: string; value: string }[];
};

type Scoring = {
  pointsPerCorrect?: number | null;
  solvePoints?: number | null;
  hintPenalty?: number | null;
  noMistakeBonus?: number | null;
  passingPercent?: number | null;
};

/**
 * Points for a marked MCQ run, using the game's own scoring fields.
 *
 * Deliberately never negative: a hint penalty that outruns the score would hand
 * a student a debt for asking for help.
 */
export function pointsForMcq(game: Scoring | null, mark: Mark | null, hintsUsed: number): RunPoints {
  if (!game || !mark) return { points: 0, breakdown: [] };

  const per = game.pointsPerCorrect ?? 0;
  const base = mark.correct * per;
  const penalty = hintsUsed * (game.hintPenalty ?? 0);
  const perfect = mark.correct === mark.total && mark.total > 0 ? (game.noMistakeBonus ?? 0) : 0;

  const breakdown = [
    { label: `${mark.correct} correct`, value: `+${base}` },
    ...(perfect ? [{ label: 'No mistakes', value: `+${perfect}` }] : []),
    ...(penalty ? [{ label: `${hintsUsed} ${hintsUsed === 1 ? 'hint' : 'hints'}`, value: `−${penalty}` }] : []),
  ];

  return { points: Math.max(0, base + perfect - penalty), breakdown };
}

/** Points for a solve-or-nothing run: sudoku and word. */
export function pointsForSolve(
  game: Scoring | null,
  solved: boolean,
  hintsUsed: number,
): RunPoints {
  if (!game || !solved) return { points: 0, breakdown: [] };

  const base = game.solvePoints ?? 0;
  const penalty = hintsUsed * (game.hintPenalty ?? 0);
  const perfect = hintsUsed === 0 ? (game.noMistakeBonus ?? 0) : 0;

  const breakdown = [
    { label: 'Solved', value: `+${base}` },
    ...(perfect ? [{ label: 'No hints', value: `+${perfect}` }] : []),
    ...(penalty ? [{ label: `${hintsUsed} ${hintsUsed === 1 ? 'hint' : 'hints'}`, value: `−${penalty}` }] : []),
  ];

  return { points: Math.max(0, base + perfect - penalty), breakdown };
}
