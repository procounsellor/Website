import { describe, it, expect } from "vitest";
import { conflicts, givenMask, isSolved, parsePuzzle, solve } from "@/lib/sudoku";
import { hintOf, imageOf, noteOf, promptOf, type GameItem } from "@/lib/gameItems";
import { MCQ_ANSWERS } from "@/data/schoolGameAnswers";
import { answerFor, checkWord, markMcq } from "@/lib/schoolMarking";

/**
 * The two things about the game engines that are easy to break silently.
 *
 * 1. **Per-engine field names.** quiz puts the question in `content.question`,
 *    flags in `content.prompt`, myth/fact in `content.statement`. Reading the
 *    wrong one does not throw — it renders an empty card, which is exactly how
 *    the quiz shipped with no visible question. These are the real shapes,
 *    copied from live responses.
 * 2. **Sudoku marking.** This is the only engine scored in the browser, so the
 *    solver has to be right. The puzzle below is the live `itm_sd_01`.
 */

const REAL_PUZZLE =
  ".1.423.96.697......3...68...9.21..5417..3....3.5.6..279813..4.5723.4...8.5..987..";

describe("sudoku — the one engine that marks itself", () => {
  it("parses the API's 81-character grid, blanks and all", () => {
    const grid = parsePuzzle(REAL_PUZZLE);

    expect(grid).toHaveLength(81);
    expect(grid[0]).toBeNull();
    expect(grid[1]).toBe(1);
    // The set says 40 givens; the string has to agree.
    expect(givenMask(grid).filter(Boolean)).toHaveLength(40);
  });

  it("solves it, and the solution keeps every given in place", () => {
    const grid = parsePuzzle(REAL_PUZZLE);
    const solution = solve(grid);

    expect(solution).not.toBeNull();
    expect(isSolved(solution!)).toBe(true);
    // A solver that "solves" by overwriting the puzzle is no solver at all.
    grid.forEach((value, i) => {
      if (value !== null) expect(solution![i]).toBe(value);
    });
  });

  it("marks an unfinished grid as unfinished", () => {
    expect(isSolved(parsePuzzle(REAL_PUZZLE))).toBe(false);
  });

  it("catches a duplicate in a row, a column and a box", () => {
    const grid = parsePuzzle(REAL_PUZZLE);
    // Row 0 already holds a 1 at index 1; putting another at index 0 clashes.
    grid[0] = 1;
    const bad = conflicts(grid);

    expect(bad.has(0)).toBe(true);
    expect(bad.has(1)).toBe(true);
  });

  it("refuses an unsolvable grid rather than inventing an answer", () => {
    const grid = parsePuzzle(REAL_PUZZLE);
    // Two 5s in the same row makes it impossible.
    grid[0] = 5;
    grid[2] = 5;
    expect(solve(grid)).toBeNull();
  });
});

/** Content exactly as the three engines return it. */
const item = (content: Record<string, unknown>): GameItem =>
  ({
    itemId: "x",
    gameId: "g",
    setId: "s",
    order: 10,
    content,
  }) as unknown as GameItem;

describe("the three engines name their fields differently", () => {
  const quiz = item({
    question: "Who checks a company's accounts?",
    questionImageUrl: null,
    hint: "Not an employee.",
    explanation: "Auditors report independently.",
    options: [{ id: "a", text: "Auditor" }],
  });

  const mythFact = item({
    statement: "Only Science pays well.",
    explanation: "Income tracks skill, not stream.",
    options: [{ id: "myth", text: "Myth" }],
  });

  const flag = item({
    prompt: "Which country's flag is this?",
    imageUrl: "gs://procounsel-games/flags/india.svg",
    funFact: "The Ashoka Chakra has 24 spokes.",
    options: [{ id: "a", text: "India" }],
  });

  it("finds the question whichever field holds it", () => {
    expect(promptOf(quiz)).toBe("Who checks a company's accounts?");
    expect(promptOf(mythFact)).toBe("Only Science pays well.");
    expect(promptOf(flag)).toBe("Which country's flag is this?");
  });

  it("never returns an empty question for a well-formed item", () => {
    // The bug this guards: reading `prompt` on a quiz item returned undefined
    // and rendered a blank card instead of failing loudly.
    for (const it of [quiz, mythFact, flag]) {
      expect(promptOf(it).length).toBeGreaterThan(0);
    }
  });

  it("finds the note, whether it is called explanation or funFact", () => {
    expect(noteOf(quiz)).toContain("Auditors");
    expect(noteOf(mythFact)).toContain("Income tracks skill");
    expect(noteOf(flag)).toContain("Ashoka Chakra");
  });

  it("offers a hint only where the engine has one", () => {
    expect(hintOf(quiz)).toBe("Not an employee.");
    expect(hintOf(mythFact)).toBeNull();
    expect(hintOf(flag)).toBeNull();
  });

  it("rewrites gs:// image paths, which a browser cannot load", () => {
    expect(imageOf(flag)).toBe("/school-games/flags/india.svg");
    expect(imageOf(quiz)).toBeNull();
    expect(imageOf(mythFact)).toBeNull();
  });
});

/**
 * The answer key.
 *
 * Temporary — it goes when the backend can mark an attempt — but while it is
 * here it decides whether a fourteen-year-old is told they got something wrong,
 * so it gets the same scrutiny as anything else. These pin its shape and its
 * scoring behaviour; the entries themselves were read from the live payloads
 * one at a time (see the header of data/schoolGameAnswers for why by hand).
 */
describe("client scoring", () => {
  it("marks only the items it actually has a key for", () => {
    const scored = markMcq(
      [
        item({ options: [{ id: "a", text: "A" }, { id: "b", text: "B" }] }),
        { ...item({ options: [{ id: "a", text: "A" }, { id: "c", text: "C" }] }), itemId: "itm_q1_02" },
        { ...item({ options: [{ id: "a", text: "A" }] }), itemId: "unknown_item" },
      ].map((row, index) => index === 0 ? { ...row, itemId: "itm_q1_01" } : row),
      { itm_q1_01: "b", itm_q1_02: "c", unknown_item: "a" },
    );

    // Two known, one not — the unknown one is excluded rather than guessed.
    expect(scored).not.toBeNull();
    expect(scored!.total).toBe(2);
    expect(scored!.correct).toBe(1);
    expect(scored!.byItem.find((row) => row.itemId === "itm_q1_01")?.isRight).toBe(true);
    expect(scored!.byItem.find((row) => row.itemId === "itm_q1_02")?.isRight).toBe(false);
    expect(scored!.byItem.find((row) => row.itemId === "unknown_item")?.isRight).toBeNull();
  });

  it("returns null when it knows none of them, so no score is shown", () => {
    // Career Word has no key and never will: the API does not send the word.
    expect(markMcq([{ ...item({ options: [] }), itemId: "unknown" }], {})).toBeNull();
  });

  it("only ever points at an option the item actually offers", () => {
    // A key entry naming an option id that does not exist would mark every
    // student wrong forever, and would do it silently.
    const ids = new Set(["a", "b", "c", "d", "myth", "fact"]);
    for (const [itemId, optionId] of Object.entries(MCQ_ANSWERS)) {
      expect(ids.has(optionId), `${itemId} → ${optionId}`).toBe(true);
    }
  });

  it("covers whole sets, not a scattering of items", () => {
    const setSize = (prefix: string) =>
      Object.keys(MCQ_ANSWERS).filter((id) => id.startsWith(prefix)).length;

    expect(setSize("itm_q1_")).toBe(10);
    expect(setSize("itm_q2_")).toBe(10);
    expect(setSize("itm_q4_")).toBe(10);
    expect(setSize("itm_mf_")).toBe(10);
  });
});

/**
 * Answers the key does not hold.
 *
 * Two engines are marked without a key entry, and both matter: flags because
 * the item already carries its own answer, sudoku because the rules are the
 * answer. Getting either wrong would either mark a correct student wrong or
 * silently stop marking at all, and neither shows up as an error.
 */
describe("answers derived from the item rather than the key", () => {
  const flagItem = (file: string, options: { id: string; text: string }[]): GameItem => ({
    itemId: "itm_fg_99",
    gameId: "flag_guess",
    setId: "flags_world",
    order: 10,
    content: { prompt: "Which country's flag is this?", imageUrl: `gs://procounsel-games/flags/${file}`, options },
  });

  it("reads the country off the item's own image path", () => {
    expect(
      answerFor(flagItem("japan.svg", [
        { id: "a", text: "China" },
        { id: "b", text: "Japan" },
      ])),
    ).toBe("b");
  });

  it("handles the underscored filenames, which are the ones that break", () => {
    // `south_africa.svg` has to reach the option spelled "South Africa".
    expect(
      answerFor(flagItem("south_africa.svg", [
        { id: "a", text: "Kenya" },
        { id: "b", text: "South Africa" },
      ])),
    ).toBe("b");
  });

  it("marks nothing when the filename matches no option", () => {
    // A country spelled differently in the file and the options must go
    // unmarked. Half-guessing a flag is how you tell someone Nepal is Bhutan.
    expect(
      answerFor(flagItem("burkina_faso.svg", [
        { id: "a", text: "Ghana" },
        { id: "b", text: "Mali" },
      ])),
    ).toBeNull();
  });
});

describe("career word", () => {
  const wordItem = (over: Partial<GameItem["content"]> = {}): GameItem => ({
    itemId: "itm_wg_01",
    gameId: "word_guess",
    setId: "wordguess_daily",
    order: 10,
    content: {
      options: [],
      length: 9,
      displayPattern: "A_______T",
      revealedIndices: [0, 8],
      hints: [],
      maxWrongGuesses: 6,
      ...over,
    },
  });

  it("marks the right word right and a wrong one wrong", () => {
    expect(checkWord(wordItem(), "ARCHITECT").isRight).toBe(true);
    expect(checkWord(wordItem(), "ACCOUNTANT").isRight).toBe(false);
  });

  it("is case- and space-insensitive about what was typed", () => {
    expect(checkWord(wordItem(), "  architect ").isRight).toBe(true);
  });

  it("refuses to mark when the key no longer fits the item", () => {
    // The set was re-authored: same item id, different word shape. Marking on
    // a stale key would fail a student who answered the NEW word correctly, so
    // both guards return "unmarked" instead.
    expect(checkWord(wordItem({ length: 7 }), "ARCHITECT").isRight).toBeNull();
    expect(checkWord(wordItem({ displayPattern: "B_______T" }), "ARCHITECT").isRight).toBeNull();
  });

  it("keeps the word hidden until the run is marked", () => {
    // `answer` is what the summary reveals; an item with no key must not
    // invent one.
    expect(checkWord({ ...wordItem(), itemId: "itm_wg_unknown" }, "ANYTHING").answer).toBeNull();
  });
});
