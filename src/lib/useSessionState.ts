import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * State that survives a reload, but not the tab.
 *
 * A half-finished game is exactly this kind of state. Losing eight answers to a
 * mis-tapped back button is infuriating; carrying them across to tomorrow would
 * be wrong, because the whole point of a daily game is that it is one sitting.
 * `sessionStorage` draws that line for us — it clears when the tab closes.
 *
 * Deliberately not `localStorage`: that is where the programme's own progress
 * lives (see `schoolStudentProgress`), and mixing a scratch pad for one run in
 * with it invites a stale board coming back weeks later.
 *
 * Every access is guarded. Private mode, disabled storage and a quota-full tab
 * all throw on read or write, and a game must keep working through any of them
 * — it just stops remembering.
 */
export function useSessionState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = sessionStorage.getItem(key);
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
      const raw = sessionStorage.getItem(key);
      setValue(raw ? (JSON.parse(raw) as T) : initial);
    } catch {
      setValue(initial);
    }
    // `initial` is intentionally not a dependency: it is a seed, not a signal.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage unavailable. The run continues from memory.
    }
  }, [key, value]);

  const clear = useCallback(() => {
    try {
      sessionStorage.removeItem(key);
    } catch {
      // Nothing to do; the value is dropped from memory either way.
    }
    setValue(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return [value, setValue, clear] as const;
}
