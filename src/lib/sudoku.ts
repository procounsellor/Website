/**
 * Sudoku, solved and checked in the browser.
 *
 * This is the one game on the programme that can be marked without the server:
 * a well-formed Sudoku has exactly one solution, and that solution is derivable
 * from the puzzle itself. So the rules ARE the answer key, and scoring a Number
 * Grid attempt locally is arithmetic rather than a guess — unlike the quizzes,
 * where the correct option is deliberately withheld and any client-side mark
 * would be invented.
 */

export type Grid = (number | null)[];

/** '.'-delimited 81-character puzzle → a flat array of 81 cells. */
export function parsePuzzle(puzzle: string, size = 9): Grid {
  const cells: Grid = [];
  for (let i = 0; i < size * size; i += 1) {
    const ch = puzzle[i];
    const n = ch && ch >= '1' && ch <= '9' ? Number(ch) : null;
    cells.push(n);
  }
  return cells;
}

/** Which cells came from the puzzle and so cannot be edited. */
export const givenMask = (grid: Grid): boolean[] => grid.map((c) => c !== null);

const peersOf = (index: number, size: number, boxRows: number, boxCols: number): number[] => {
  const row = Math.floor(index / size);
  const col = index % size;
  const peers = new Set<number>();
  for (let c = 0; c < size; c += 1) peers.add(row * size + c);
  for (let r = 0; r < size; r += 1) peers.add(r * size + col);
  const r0 = Math.floor(row / boxRows) * boxRows;
  const c0 = Math.floor(col / boxCols) * boxCols;
  for (let r = r0; r < r0 + boxRows; r += 1) {
    for (let c = c0; c < c0 + boxCols; c += 1) peers.add(r * size + c);
  }
  peers.delete(index);
  return [...peers];
};

/** True when `value` may legally go in `index`. */
export function isLegal(
  grid: Grid,
  index: number,
  value: number,
  size = 9,
  boxRows = 3,
  boxCols = 3,
): boolean {
  return peersOf(index, size, boxRows, boxCols).every((p) => grid[p] !== value);
}

/** Every cell that clashes with one of its peers. Drives the red highlights. */
export function conflicts(grid: Grid, size = 9, boxRows = 3, boxCols = 3): Set<number> {
  const bad = new Set<number>();
  grid.forEach((value, index) => {
    if (value === null) return;
    for (const p of peersOf(index, size, boxRows, boxCols)) {
      if (grid[p] === value) {
        bad.add(index);
        bad.add(p);
      }
    }
  });
  return bad;
}

/**
 * Backtracking solver, most-constrained cell first.
 *
 * Fast enough to run on the main thread for a 9x9 — the ordering heuristic
 * keeps a normal puzzle under a millisecond — and it is what powers both the
 * hint button and the final mark.
 */
export function solve(grid: Grid, size = 9, boxRows = 3, boxCols = 3): Grid | null {
  const work = [...grid];

  const candidates = (index: number): number[] => {
    const used = new Set(peersOf(index, size, boxRows, boxCols).map((p) => work[p]));
    const out: number[] = [];
    for (let v = 1; v <= size; v += 1) if (!used.has(v)) out.push(v);
    return out;
  };

  const step = (): boolean => {
    let best = -1;
    let bestOptions: number[] = [];
    for (let i = 0; i < work.length; i += 1) {
      if (work[i] !== null) continue;
      const options = candidates(i);
      if (options.length === 0) return false;
      if (best === -1 || options.length < bestOptions.length) {
        best = i;
        bestOptions = options;
        if (options.length === 1) break;
      }
    }
    if (best === -1) return true;

    for (const value of bestOptions) {
      work[best] = value;
      if (step()) return true;
      work[best] = null;
    }
    return false;
  };

  return step() ? work : null;
}

export const isComplete = (grid: Grid): boolean => grid.every((c) => c !== null);

/** Correct when it is full and nothing clashes. */
export const isSolved = (grid: Grid, size = 9, boxRows = 3, boxCols = 3): boolean =>
  isComplete(grid) && conflicts(grid, size, boxRows, boxCols).size === 0;
