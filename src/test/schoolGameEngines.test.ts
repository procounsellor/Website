import { describe, it, expect } from "vitest";
import { conflicts, givenMask, isSolved, parsePuzzle, solve } from "@/lib/sudoku";
import { hintOf, imageOf, noteOf, promptOf, type GameItem } from "@/lib/gameItems";

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
    expect(imageOf(flag)).toBe(
      "https://storage.googleapis.com/procounsel-games/flags/india.svg",
    );
    expect(imageOf(quiz)).toBeNull();
    expect(imageOf(mythFact)).toBeNull();
  });
});
