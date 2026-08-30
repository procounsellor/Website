import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  conflicts,
  givenMask,
  isSolved,
  parsePuzzle,
  solve,
  type Grid,
} from '@/lib/sudoku';
import type { GameItem } from '@/lib/gameItems';
import { useSessionState } from '@/lib/useSessionState';

/**
 * Number Grid.
 *
 * Thumb-first: the grid sits above a fixed number pad, both sized so the whole
 * game fits one phone screen with no scrolling during play. Every control is at
 * least 44px, which is the smallest thing a thumb hits reliably.
 *
 * This board really marks itself — see `lib/sudoku` for why that is honest here
 * and nowhere else on the programme.
 */
export default function SudokuBoard({
  item,
  hintPenalty,
  sessionKey,
  onFinish,
}: {
  item: GameItem;
  hintPenalty: number;
  /** Identifies this run, so a reload resumes the same grid. */
  sessionKey: string;
  onFinish: (result: { solved: boolean; seconds: number; hints: number }) => void;
}) {
  const size = item.content.size ?? 9;
  const boxRows = item.content.boxRows ?? 3;
  const boxCols = item.content.boxCols ?? 3;
  const puzzle = item.content.puzzle ?? '';

  const start = useMemo(() => parsePuzzle(puzzle, size), [puzzle, size]);
  const given = useMemo(() => givenMask(start), [start]);
  const solution = useMemo(() => solve(start, size, boxRows, boxCols), [start, size, boxRows, boxCols]);

  /* Half a Sudoku is a lot of work to lose to a stray back tap. */
  const [run, setRun, clearRun] = useSessionState(sessionKey, {
    grid: start as Grid,
    hints: 0,
    seconds: 0,
  });
  const grid = run.grid;
  const hints = run.hints;
  const [selected, setSelected] = useState<number | null>(null);
  const [seconds, setSeconds] = useState(run.seconds);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (done) return;
    const tick = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(tick);
  }, [done]);

  // Persisted every few seconds, not every tick.
  useEffect(() => {
    if (done || seconds % 5 !== 0) return;
    setRun((r) => (r.seconds === seconds ? r : { ...r, seconds }));
  }, [seconds, done, setRun]);

  const bad = useMemo(() => conflicts(grid, size, boxRows, boxCols), [grid, size, boxRows, boxCols]);

  // Finishing is detected from the board, not from a "submit" the student has
  // to remember to press: the moment the grid is right, the game is over.
  useEffect(() => {
    if (done) return;
    if (isSolved(grid, size, boxRows, boxCols)) {
      setDone(true);
      clearRun();
      onFinish({ solved: true, seconds, hints });
    }
  }, [grid, done, size, boxRows, boxCols, onFinish, seconds, hints, clearRun]);

  // Writes through `setRun` rather than a local wrapper: `setRun` is stable, so
  // this callback can actually be memoised.
  const place = useCallback(
    (value: number | null) => {
      if (selected === null || given[selected] || done) return;
      setRun((r) => {
        const next = [...r.grid];
        next[selected] = value;
        return { ...r, grid: next };
      });
    },
    [selected, given, done, setRun],
  );

  const takeHint = () => {
    if (!solution || selected === null || given[selected] || done) return;
    setRun((r) => {
      const next = [...r.grid];
      next[selected] = solution[selected];
      return { ...r, grid: next, hints: r.hints + 1 };
    });
  };

  const remaining = grid.filter((c) => c === null).length;
  const selectedValue = selected !== null ? grid[selected] : null;

  return (
    <div className="mx-auto w-full max-w-[440px]">
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="ss-eyebrow text-[var(--neutral-400)]">
          {remaining} left
        </span>
        <span className="ss-data text-[15px] text-[var(--ink)]">
          {String(Math.floor(seconds / 60)).padStart(2, '0')}:
          {String(seconds % 60).padStart(2, '0')}
        </span>
      </div>

      <div
        className="grid overflow-hidden rounded-[14px] border-2"
        style={{
          gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
          borderColor: 'var(--ink)',
          background: 'var(--ink)',
          gap: 1,
        }}
      >
        {grid.map((value, index) => {
          const row = Math.floor(index / size);
          const col = index % size;
          const isGiven = given[index];
          const isSelected = selected === index;
          const sameValue = value !== null && value === selectedValue;
          const clash = bad.has(index);
          // A heavier line every box, so the 3x3 regions are readable at phone size.
          const boxEdgeRight = (col + 1) % boxCols === 0 && col + 1 !== size;
          const boxEdgeBottom = (row + 1) % boxRows === 0 && row + 1 !== size;

          return (
            <button
              key={index}
              type="button"
              onClick={() => setSelected(index)}
              aria-label={`Row ${row + 1} column ${col + 1}${value ? `, ${value}` : ', empty'}`}
              className="ss-data flex aspect-square items-center justify-center text-[clamp(15px,4.6vw,22px)] transition-colors"
              style={{
                background: clash
                  ? '#FFE4E4'
                  : isSelected
                    ? '#FFE9B8'
                    : sameValue
                      ? '#EFEAFF'
                      : isGiven
                        ? '#F1F3F8'
                        : '#FFFFFF',
                color: clash ? '#B91C1C' : isGiven ? 'var(--ink)' : '#5A38E8',
                fontWeight: isGiven ? 700 : 500,
                marginRight: boxEdgeRight ? 2 : 0,
                marginBottom: boxEdgeBottom ? 2 : 0,
              }}
            >
              {value ?? ''}
            </button>
          );
        })}
      </div>

      <div className="mt-4 grid grid-cols-5 gap-2 sm:grid-cols-10">
        {Array.from({ length: size }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => place(n)}
            className="ss-data flex h-12 items-center justify-center rounded-[12px] border border-[var(--card-border)] bg-white text-[18px] text-[var(--ink)] transition-transform active:scale-95"
          >
            {n}
          </button>
        ))}
        <button
          type="button"
          onClick={() => place(null)}
          aria-label="Erase"
          className="col-span-5 flex h-12 items-center justify-center rounded-[12px] border border-[var(--card-border)] bg-white text-[15px] font-semibold text-[var(--neutral-500)] transition-transform active:scale-95 sm:col-span-2"
        >
          Erase
        </button>
      </div>

      <button
        type="button"
        onClick={takeHint}
        disabled={!solution || selected === null || (selected !== null && given[selected])}
        className="ss-go mt-3 h-12 w-full text-[14px]"
        data-tone="summit"
      >
        Reveal this square{hintPenalty ? ` · −${hintPenalty} pt` : ''}
      </button>
      {hints > 0 && (
        <p className="mt-2 text-center font-[Poppins] text-[12px] text-[var(--neutral-500)]">
          {hints} {hints === 1 ? 'square' : 'squares'} revealed.
        </p>
      )}
    </div>
  );
}
