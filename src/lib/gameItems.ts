import { schoolGet } from '@/api/schoolStudentApi';

/**
 * Fetching the questions for a day's game.
 *
 * The correct call is `getItemsBySetId`, and it is tried first. It currently
 * answers HTTP 500 with a Firestore error — the `gameItems` collection group is
 * missing a composite index on (setId ASC, order ASC) — so until that index is
 * created there is a development fallback that walks `itm_<prefix>_NN` one id at
 * a time through `getGameItemById`, which does work.
 *
 * The fallback is deliberately loud about itself: callers get `source: 'probe'`
 * and surface it, because guessing ids by convention is a stopgap for checking
 * the flow, not a way to ship. The moment the index exists the first call
 * succeeds and this path is never taken again.
 */

export type ItemOption = { id: string; text: string };

/**
 * quiz_mcq_v1, binary_card_v1 and flag_guess.
 *
 * The three engines ask the same kind of question and name the fields
 * differently, which is not obvious and is worth writing down because reading
 * the wrong one renders a blank card rather than an error:
 *
 *   quiz        → `question`, `questionImageUrl`, `hint`, `explanation`
 *   myth_fact   → `statement`, `explanation`
 *   flag_guess  → `prompt`, `imageUrl`, `funFact`
 *
 * `promptOf`, `imageOf` and `noteOf` below are the only places that should know
 * this; components ask them rather than reaching into `content`.
 */
export type McqContent = {
  question?: string;
  prompt?: string;
  statement?: string;
  options: ItemOption[];
  questionImageUrl?: string | null;
  imageUrl?: string | null;
  hint?: string;
  funFact?: string;
  explanation?: string;
  multiSelect?: boolean;
};

/** sudoku_v1: an 81-character grid, '.' for a blank. */
export type SudokuContent = {
  size: number;
  puzzle: string;
  boxRows: number;
  boxCols: number;
  givenCount?: number;
  estimatedMins?: number;
};

/** word_guess_v1: a masked word, its hints, and a wrong-guess budget. */
export type WordContent = {
  length: number;
  displayPattern: string;
  revealedIndices: number[];
  hints: string[];
  maxWrongGuesses: number;
  category?: string;
};

export type GameItem = {
  itemId: string;
  gameId: string;
  setId: string;
  order: number;
  difficulty?: string;
  topic?: string;
  isActive?: boolean;
  content: McqContent & Partial<SudokuContent> & Partial<WordContent>;
};

export const getItem = (itemId: string, fresh = false) =>
  schoolGet<GameItem>(`/getGameItemById?itemId=${encodeURIComponent(itemId)}`, { fresh });

/**
 * Item-id prefixes, per game.
 *
 * Only used by the fallback. A game absent from here simply has no fallback —
 * `quiz` is absent because its ids do not follow a guessable pattern, so a quiz
 * set shows the honest "pack unavailable" state rather than a wrong guess.
 */
const ID_PREFIX: Record<string, string> = {
  flag_guess: 'itm_fg',
  myth_fact: 'itm_mf',
  sudoku: 'itm_sd',
  word_guess: 'itm_wg',
};

export type ItemsResult = {
  items: GameItem[];
  /** 'api' when the proper endpoint answered; 'probe' when ids were walked. */
  source: 'api' | 'probe' | 'none';
};

/** Ask the proper endpoint, then fall back to walking ids. */
export async function loadItems(
  setId: string,
  gameId: string,
  limit = 12,
): Promise<ItemsResult> {
  try {
    const items = await schoolGet<GameItem[]>(
      `/getItemsBySetId?setId=${encodeURIComponent(setId)}`,
    );
    if (Array.isArray(items) && items.length) {
      return { items: [...items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)), source: 'api' };
    }
  } catch {
    // Falls through to the probe. The endpoint's own failure is expected today.
  }

  const prefix = ID_PREFIX[gameId];
  if (!prefix) return { items: [], source: 'none' };

  /*
   * Fetched as ONE batch, not a chain.
   *
   * Walking ids one at a time cost ten round trips — measured at 1,165ms before
   * a ten-question set could render, which is exactly long enough to read as
   * the app hanging. The set already tells us how many items it has, so every
   * id can be asked for at once and the answers reassembled after.
   *
   * The contiguous prefix is still what counts: ids run 01, 02, 03…, so the
   * first gap ends the set even if a later id happens to exist.
   */
  const ids = Array.from(
    { length: Math.max(1, Math.min(limit, 40)) },
    (_, n) => `${prefix}_${String(n + 1).padStart(2, '0')}`,
  );

  const fetched = await Promise.all(
    ids.map((id) => getItem(id).catch(() => null)),
  );

  const found: GameItem[] = [];
  for (const item of fetched) {
    if (!item) break;
    if (item.setId === setId) found.push(item);
  }

  return {
    items: found.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    source: found.length ? 'probe' : 'none',
  };
}

/** The question, whichever field this engine happens to put it in. */
export const promptOf = (item: GameItem): string =>
  item.content.question ?? item.content.prompt ?? item.content.statement ?? '';

/** The picture, if the engine has one. */
export const imageOf = (item: GameItem): string | null =>
  imageUrlFor(item.content.questionImageUrl ?? item.content.imageUrl);

/** What is shown after answering — the teaching bit. */
export const noteOf = (item: GameItem): string | null =>
  item.content.explanation ?? item.content.funFact ?? null;

/** The clue a student can buy, where the engine offers one. */
export const hintOf = (item: GameItem): string | null => item.content.hint ?? null;

/**
 * Google Cloud Storage paths are not browser URLs.
 *
 * Items carry `gs://bucket/path`, which an `<img>` cannot load. This rewrites
 * it to the public HTTPS form. Note that the flag bucket currently 404s even
 * when rewritten — the assets are not uploaded or not public — so callers must
 * still handle a failed image.
 */
export function imageUrlFor(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const gs = raw.match(/^gs:\/\/([^/]+)\/(.+)$/);
  if (!gs) return raw;
  return `https://storage.googleapis.com/${gs[1]}/${gs[2]}`;
}
