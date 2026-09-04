import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
 *
 * ─── What was missing, and why each one mattered ─────────────────────────────
 *
 * The first version was a grid, a keypad and a hint button, and it could trap
 * you. Four things fix that, and none of them is decoration:
 *
 *  - **A way to stop.** There was no finish button. The run ended only when the
 *    grid was correct, so a student who could not solve it had no exit except
 *    the browser's back arrow, which threw the attempt away and recorded
 *    nothing. Thirty minutes with no way to hand in your paper.
 *  - **Undo.** A misread digit propagates: you place it, build on it, and ten
 *    moves later the grid is wrong with no way back but erasing by hand. The
 *    history is the placements themselves, so undo is exact rather than a
 *    guess at what you meant.
 *  - **Pencil marks.** Sudoku above the easiest level is unplayable without
 *    somewhere to park candidates, and a nine-year-old asked to hold six of
 *    them in their head simply stops.
 *  - **A keyboard.** On a laptop the digits 1-9, arrows, backspace and Escape
 *    all do what a Sudoku player's fingers already expect them to do.
 */

type Move = { index: number; from: number | null; to: number | null };

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
  onFinish: (result: { solved: boolean; gaveUp: boolean; seconds: number; hints: number }) => void;
}) {
  const size = item.content.size ?? 9;
  const boxRows = item.content.boxRows ?? 3;
  const boxCols = item.content.boxCols ?? 3;
  const puzzle = item.content.puzzle ?? '';

  const start = useMemo(() => parsePuzzle(puzzle, size), [puzzle, size]);
  const given = useMemo(() => givenMask(start), [start]);

  /*
   * The solution is computed once, off the puzzle, and never off the student's
   * grid. Solving the live grid would "solve" whatever wrong digits they had
   * already placed, so the hint would confirm their mistake back to them.
   */
  const solution = useMemo(() => solve(start, size, boxRows, boxCols), [start, size, boxRows, boxCols]);

  /* Half a Sudoku is a lot of work to lose to a stray back tap. */
  const [run, setRun, clearRun] = useSessionState(sessionKey, {
    grid: start as Grid,
    /** index → the candidate digits pencilled into that cell. */
    notes: {} as Record<number, number[]>,
    history: [] as Move[],
    hints: 0,
    seconds: 0,
  });
  const { grid, notes, history, hints } = run;

  const [selected, setSelected] = useState<number | null>(null);
  const [pencil, setPencil] = useState(false);
  const [seconds, setSeconds] = useState(run.seconds);
  const [done, setDone] = useState(false);
  const [confirmGiveUp, setConfirmGiveUp] = useState(false);
  const boardRef = useRef<HTMLDivElement>(null);

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
      onFinish({ solved: true, gaveUp: false, seconds, hints });
    }
  }, [grid, done, size, boxRows, boxCols, onFinish, seconds, hints, clearRun]);

  /**
   * Place a digit, or erase with null.
   *
   * Writing a digit clears that cell's own pencil marks (they were candidates
   * FOR this cell and are now answered) and every matching mark in its row,
   * column and box — which is the bookkeeping a player would otherwise do by
   * hand, and the reason pencil marks are worth having at all.
   */
  const place = useCallback(
    (value: number | null) => {
      if (selected === null || given[selected] || done) return;

      setRun((r) => {
        if (pencil && value !== null) {
          // A pencil mark on a cell that already holds a digit would be
          // invisible, so writing one clears the digit first.
          const current = r.notes[selected] ?? [];
          const next = current.includes(value)
            ? current.filter((n) => n !== value)
            : [...current, value].sort((a, b) => a - b);
          const grid2 = [...r.grid];
          const from = grid2[selected];
          grid2[selected] = null;
          return {
            ...r,
            grid: grid2,
            notes: { ...r.notes, [selected]: next },
            history: from === null ? r.history : [...r.history, { index: selected, from, to: null }],
          };
        }

        const nextGrid = [...r.grid];
        const from = nextGrid[selected];
        if (from === value) return r;
        nextGrid[selected] = value;

        const nextNotes = { ...r.notes };
        delete nextNotes[selected];
        if (value !== null) {
          const row = Math.floor(selected / size);
          const col = selected % size;
          const r0 = Math.floor(row / boxRows) * boxRows;
          const c0 = Math.floor(col / boxCols) * boxCols;
          for (const [key, marks] of Object.entries(nextNotes)) {
            const i = Number(key);
            const sameRow = Math.floor(i / size) === row;
            const sameCol = i % size === col;
            const sameBox =
              Math.floor(Math.floor(i / size) / boxRows) * boxRows === r0 &&
              Math.floor((i % size) / boxCols) * boxCols === c0;
            if (!sameRow && !sameCol && !sameBox) continue;
            const pruned = marks.filter((n) => n !== value);
            if (pruned.length) nextNotes[i] = pruned;
            else delete nextNotes[i];
          }
        }

        return {
          ...r,
          grid: nextGrid,
          notes: nextNotes,
          history: [...r.history, { index: selected, from, to: value }],
        };
      });
    },
    [selected, given, done, pencil, setRun, size, boxRows, boxCols],
  );

  const undo = useCallback(() => {
    if (done) return;
    setRun((r) => {
      const last = r.history[r.history.length - 1];
      if (!last) return r;
      const nextGrid = [...r.grid];
      nextGrid[last.index] = last.from;
      return { ...r, grid: nextGrid, history: r.history.slice(0, -1) };
    });
  }, [done, setRun]);

  const takeHint = useCallback(() => {
    if (!solution || selected === null || given[selected] || done) return;
    setRun((r) => {
      const next = [...r.grid];
      const from = next[selected];
      next[selected] = solution[selected];
      const nextNotes = { ...r.notes };
      delete nextNotes[selected];
      return {
        ...r,
        grid: next,
        notes: nextNotes,
        hints: r.hints + 1,
        history: [...r.history, { index: selected, from, to: solution[selected] }],
      };
    });
  }, [solution, selected, given, done, setRun]);

  /** Hand in an unfinished grid. Marked honestly: unsolved is unsolved. */
  const giveUp = () => {
    if (done) return;
    setDone(true);
    clearRun();
    onFinish({ solved: false, gaveUp: true, seconds, hints });
  };

  /*
   * The keyboard, on desktop.
   *
   * Bound to the board rather than to `window` so a Sudoku cannot swallow the
   * digits someone is typing into a field elsewhere on the page.
   */
  const onKeyDown = (event: React.KeyboardEvent) => {
    if (done) return;
    const { key } = event;

    if (/^[1-9]$/.test(key)) {
      place(Number(key));
      event.preventDefault();
      return;
    }
    if (key === 'Backspace' || key === 'Delete' || key === '0') {
      place(null);
      event.preventDefault();
      return;
    }
    if (key === 'n' || key === 'N') {
      setPencil((p) => !p);
      event.preventDefault();
      return;
    }
    if ((key === 'z' || key === 'Z') && (event.ctrlKey || event.metaKey)) {
      undo();
      event.preventDefault();
      return;
    }
    if (key === 'Escape') {
      setSelected(null);
      return;
    }

    const step: Record<string, number> = {
      ArrowLeft: -1,
      ArrowRight: 1,
      ArrowUp: -size,
      ArrowDown: size,
    };
    if (key in step) {
      event.preventDefault();
      setSelected((current) => {
        const from = current ?? 0;
        const next = from + step[key];
        if (next < 0 || next >= size * size) return current;
        // Left/right must not wrap onto the next row — that reads as the
        // selection teleporting across the board.
        if ((key === 'ArrowLeft' || key === 'ArrowRight') && Math.floor(next / size) !== Math.floor(from / size)) {
          return current;
        }
        return next;
      });
    }
  };

  const remaining = grid.filter((c) => c === null).length;
  const selectedValue = selected !== null ? grid[selected] : null;

  /** How many of each digit are already placed — a full one is greyed out. */
  const placed = useMemo(() => {
    const counts = new Map<number, number>();
    grid.forEach((v) => {
      if (v !== null) counts.set(v, (counts.get(v) ?? 0) + 1);
    });
    return counts;
  }, [grid]);

  return (
    <div className="mx-auto w-full max-w-[440px]">
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="ss-eyebrow text-[var(--neutral-400)]">
          {remaining} left
          {bad.size > 0 && <span className="ml-2 text-[#B91C1C]">· {bad.size} clashing</span>}
        </span>
        <span className="ss-data text-[15px] text-[var(--ink)]">
          {String(Math.floor(seconds / 60)).padStart(2, '0')}:
          {String(seconds % 60).padStart(2, '0')}
        </span>
      </div>

      <div
        ref={boardRef}
        role="grid"
        tabIndex={0}
        onKeyDown={onKeyDown}
        aria-label="Sudoku grid. Use the arrow keys to move and 1 to 9 to place a digit."
        className="grid overflow-hidden rounded-[14px] border-2 outline-none focus-visible:ring-2 focus-visible:ring-[#5A38E8]"
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
          const marks = notes[index];
          // The row, column and box the cursor is in, tinted — this is how a
          // player scans, and doing it for them halves the work of looking.
          const inScope =
            selected !== null &&
            (Math.floor(selected / size) === row ||
              selected % size === col ||
              (Math.floor(Math.floor(selected / size) / boxRows) === Math.floor(row / boxRows) &&
                Math.floor((selected % size) / boxCols) === Math.floor(col / boxCols)));
          // A heavier line every box, so the 3x3 regions are readable at phone size.
          const boxEdgeRight = (col + 1) % boxCols === 0 && col + 1 !== size;
          const boxEdgeBottom = (row + 1) % boxRows === 0 && row + 1 !== size;

          return (
            <button
              key={index}
              type="button"
              role="gridcell"
              onClick={() => {
                setSelected(index);
                boardRef.current?.focus();
              }}
              aria-label={`Row ${row + 1} column ${col + 1}${value ? `, ${value}` : ', empty'}`}
              className="ss-data relative flex aspect-square items-center justify-center text-[clamp(15px,4.6vw,22px)] transition-colors"
              style={{
                background: clash
                  ? '#FFE4E4'
                  : isSelected
                    ? '#FFE9B8'
                    : sameValue
                      ? '#EFEAFF'
                      : inScope
                        ? '#F7F5FF'
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
              {value === null && marks?.length ? (
                <span
                  className="pointer-events-none absolute inset-0 grid p-[1px] text-[clamp(6px,1.7vw,9px)] leading-none font-medium text-[var(--neutral-400)]"
                  style={{ gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'repeat(3, 1fr)' }}
                  aria-hidden
                >
                  {Array.from({ length: 9 }, (_, n) => (
                    <span key={n} className="flex items-center justify-center">
                      {marks.includes(n + 1) ? n + 1 : ''}
                    </span>
                  ))}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {/* Notes / undo / erase. One row, above the pad, because all three are
          modifiers on what the pad does next. */}
      <div className="mt-3 grid grid-cols-3 gap-2">
        <button
          type="button"
          onClick={() => setPencil((p) => !p)}
          aria-pressed={pencil}
          className="flex h-12 items-center justify-center gap-2 rounded-[12px] border-2 font-[Poppins] text-[13.5px] font-semibold transition-colors"
          style={{
            borderColor: pencil ? '#5A38E8' : 'var(--card-border)',
            background: pencil ? '#EFEAFF' : '#FFFFFF',
            color: pencil ? '#5A38E8' : 'var(--neutral-600)',
          }}
        >
          <span aria-hidden>✏️</span> Notes {pencil ? 'on' : 'off'}
        </button>
        <button
          type="button"
          onClick={undo}
          disabled={history.length === 0}
          className="flex h-12 items-center justify-center gap-2 rounded-[12px] border border-[var(--card-border)] bg-white font-[Poppins] text-[13.5px] font-semibold text-[var(--neutral-600)] disabled:opacity-40"
        >
          <span aria-hidden>↶</span> Undo
        </button>
        <button
          type="button"
          onClick={() => place(null)}
          disabled={selected === null || given[selected]}
          className="flex h-12 items-center justify-center gap-2 rounded-[12px] border border-[var(--card-border)] bg-white font-[Poppins] text-[13.5px] font-semibold text-[var(--neutral-600)] disabled:opacity-40"
        >
          <span aria-hidden>⌫</span> Erase
        </button>
      </div>

      <div className="mt-2 grid grid-cols-9 gap-1.5">
        {Array.from({ length: size }, (_, i) => i + 1).map((n) => {
          const full = (placed.get(n) ?? 0) >= size;
          return (
            <button
              key={n}
              type="button"
              onClick={() => place(n)}
              // A digit that is already placed nine times cannot be needed
              // again, and dimming it removes nine wrong taps from the game.
              className="ss-data flex h-13 items-center justify-center rounded-[12px] border text-[19px] transition-transform active:scale-95"
              style={{
                borderColor: pencil ? '#C9BCFB' : 'var(--card-border)',
                background: full ? '#F1F3F8' : '#FFFFFF',
                color: full ? 'var(--neutral-400)' : pencil ? '#5A38E8' : 'var(--ink)',
              }}
            >
              {n}
            </button>
          );
        })}
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

      {/* The exit. Two taps, because a mis-hit here ends a thirty-minute run. */}
      <div className="mt-4 text-center">
        {confirmGiveUp ? (
          <div className="ss-panel p-4">
            <p className="font-[Poppins] text-[13px] text-[var(--neutral-600)]">
              Finish now with {remaining} {remaining === 1 ? 'square' : 'squares'} empty? It will be
              recorded as unsolved.
            </p>
            <div className="mt-3 flex gap-2.5">
              <button
                type="button"
                onClick={() => setConfirmGiveUp(false)}
                className="h-11 flex-1 rounded-[12px] border border-[var(--card-border)] bg-white font-[Poppins] text-[13.5px] font-semibold text-[var(--neutral-600)]"
              >
                Keep playing
              </button>
              <button
                type="button"
                onClick={giveUp}
                className="h-11 flex-1 rounded-[12px] bg-[var(--ink)] font-[Poppins] text-[13.5px] font-semibold text-white"
              >
                Finish anyway
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmGiveUp(true)}
            className="font-[Poppins] text-[12.5px] font-semibold text-[var(--neutral-500)] underline underline-offset-2"
          >
            I&apos;m stuck — finish this run
          </button>
        )}
      </div>
    </div>
  );
}
