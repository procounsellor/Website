import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Where a half-finished run is kept.
 *
 * `localStorage`, not `sessionStorage`, and the difference is the whole point.
 * The Number Grid is scheduled with a thirty-minute clock; a student plays it
 * on a phone, between other things, and closing the tab is not a decision to
 * throw the grid away. sessionStorage dies with the tab and did exactly that.
 *
 * Two things make localStorage safe here where it would otherwise leak:
 *
 *  - The key carries the date and the set (see `runKey` in SchoolPlay), so a
 *    resumed run can only ever belong to the game it came from.
 *  - `pruneRuns` drops every run key that is not for the day being played, on
 *    every mount. Yesterday's abandoned board cannot come back weeks later,
 *    which is the failure mode that made sessionStorage look like the safer
 *    choice in the first place.
 *
 * Every access is guarded. Private mode, disabled storage and a full quota all
 * throw on read or write, and a game must keep working through any of them — it
 * just stops remembering.
 */

const RUN_PREFIX = 'procounsel:school-run:';

/**
 * Drop scratch copies of runs for any other day.
 *
 * Called by the play page on mount. Runs are keyed
 * `procounsel:school-run:<date>:<setId>`, so keeping only `keepDate` leaves the
 * board being played and nothing else.
 */
export function pruneRuns(keepDate: string): void {
  try {
    const doomed: string[] = [];
    for (let i = 0; i < localStorage.length; i += 1) {
      const key = localStorage.key(i);
      if (!key?.startsWith(RUN_PREFIX)) continue;
      if (!key.startsWith(`${RUN_PREFIX}${keepDate}:`)) doomed.push(key);
    }
    doomed.forEach((key) => localStorage.removeItem(key));
  } catch {
    // Storage unavailable. Nothing was stored either, so nothing to prune.
  }
}

export function useSessionState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });

  // The key is derived from the day and the set, so it changes when the game
  // does; re-reading on that change is what stops yesterday's answers bleeding
  // into today's board.
  const lastKey = useRef(key);
  useEffect(() => {
    if (lastKey.current === key) return;
    lastKey.current = key;
    try {
      const raw = localStorage.getItem(key);
      setValue(raw ? (JSON.parse(raw) as T) : initial);
    } catch {
      setValue(initial);
    }
    // `initial` is intentionally not a dependency: it is a seed, not a signal.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage unavailable. The run continues from memory.
    }
  }, [key, value]);

  const clear = useCallback(() => {
    try {
      localStorage.removeItem(key);
    } catch {
      // Nothing to do; the value is dropped from memory either way.
    }
    setValue(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return [value, setValue, clear] as const;
}
