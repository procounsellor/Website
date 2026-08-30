import { useEffect, useMemo, useRef, useState } from 'react';
import type { GameItem } from '@/lib/gameItems';

/**
 * Career Word.
 *
 * The item gives the SHAPE of the word — its length, which letters are already
 * revealed, and three hints — but never the word itself. That constraint is
 * what this board is designed around, and getting it wrong the first time is
 * instructive: it had an A–Z keypad AND a separate answer box. Tapping a letter
 * could not reveal anything (nothing here knows which letters are in the word),
 * so the keypad silently did nothing, and the box then asked for the same
 * answer a second way. Two mechanics, neither working.
 *
 * Now there is one: you type into the word itself. The revealed letters are
 * fixed, the blanks are yours to fill, and a hidden input drives them so a
 * phone opens its own keyboard on tap. No dead controls.
 */
export default function WordBoard({
  item,
  onFinish,
}: {
  item: GameItem;
  onFinish: (result: { guess: string; hintsUsed: number; seconds: number }) => void;
}) {
  const pattern = (item.content.displayPattern ?? '').toUpperCase();
  const length = item.content.length ?? pattern.length;
  const hints = item.content.hints ?? [];

  const [typed, setTyped] = useState('');
  const [hintsShown, setHintsShown] = useState(1);
  const [seconds, setSeconds] = useState(0);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const tick = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(tick);
  }, []);

  /** Which slots the student actually fills — the rest are given. */
  const blanks = useMemo(
    () =>
      pattern
        .split('')
        .map((ch, i) => (ch === '_' ? i : -1))
        .filter((i) => i >= 0),
    [pattern],
  );

  /** The full word as it currently stands: givens, plus what has been typed. */
  const letters = useMemo(() => {
    const out = pattern.split('');
    blanks.forEach((slot, n) => {
      out[slot] = typed[n] ?? '_';
    });
    return out;
  }, [pattern, blanks, typed]);

  const complete = typed.length === blanks.length;
  const caret = focused ? Math.min(typed.length, blanks.length - 1) : -1;

  return (
    <div className="mx-auto w-full max-w-[520px]">
      <p className="ss-eyebrow text-center text-[var(--neutral-400)]">
        {item.content.category ?? 'Word'} · {length} letters ·{' '}
        {String(Math.floor(seconds / 60)).padStart(2, '0')}:{String(seconds % 60).padStart(2, '0')}
      </p>

      {/* The word IS the input. Tapping anywhere on it focuses the hidden field,
          which is what opens the keyboard on a phone. */}
      <button
        type="button"
        onClick={() => inputRef.current?.focus()}
        aria-label="Type your answer"
        className="mt-4 grid w-full justify-center gap-1 sm:gap-1.5"
        style={{ gridTemplateColumns: `repeat(${length}, minmax(0, 1fr))` }}
      >
        {letters.map((ch, i) => {
          const given = pattern[i] !== '_';
          const slot = blanks.indexOf(i);
          const isCaret = slot === caret && !given;
          const filled = ch !== '_';
          return (
            <span
              key={i}
              className="ss-data flex aspect-[3/4] items-center justify-center rounded-[9px] border-2 text-[clamp(13px,4.4vw,22px)] transition-colors"
              style={{
                borderColor: given
                  ? '#5A38E8'
                  : isCaret
                    ? '#F59E0B'
                    : filled
                      ? '#8B6CF8'
                      : 'var(--card-border)',
                background: given ? '#EFEAFF' : isCaret ? '#FFF7E6' : '#FFFFFF',
                color: given ? '#5A38E8' : 'var(--ink)',
              }}
            >
              {filled ? ch : ''}
            </span>
          );
        })}
      </button>

      <input
        ref={inputRef}
        value={typed}
        onChange={(e) =>
          setTyped(
            e.target.value
              .toUpperCase()
              .replace(/[^A-Z]/g, '')
              .slice(0, blanks.length),
          )
        }
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        inputMode="text"
        autoCapitalize="characters"
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        aria-label={`Your answer, ${blanks.length} letters`}
        // Off-screen rather than display:none — a hidden field cannot be
        // focused, and focus is the whole point.
        className="absolute -left-[9999px] h-px w-px opacity-0"
      />

      <p className="mt-3 text-center font-[Poppins] text-[12px] text-[var(--neutral-500)]">
        {complete ? 'Looks full — send it.' : 'Tap the word and type your answer.'}
      </p>

      {/* Hints, one at a time: taking all three at once throws the game away. */}
      <div className="ss-panel mt-5 p-4">
        <ul className="space-y-2.5">
          {hints.slice(0, hintsShown).map((hint, i) => (
            <li
              key={hint}
              className="flex gap-2.5 font-[Poppins] text-[13.5px] leading-relaxed text-[var(--neutral-600)]"
            >
              <span className="ss-data shrink-0 text-[12px] text-[#B45309]">{i + 1}</span>
              {hint}
            </li>
          ))}
        </ul>
        {hintsShown < hints.length && (
          <button
            type="button"
            onClick={() => setHintsShown((n) => n + 1)}
            className="ss-eyebrow mt-3 w-full rounded-[10px] bg-[#FFF3D9] py-3 text-[#B45309]"
          >
            Another hint ({hints.length - hintsShown} left)
          </button>
        )}
      </div>

      <div className="mt-4 flex gap-2.5">
        <button
          type="button"
          onClick={() => setTyped('')}
          disabled={!typed}
          className="h-13 rounded-[12px] border border-[var(--card-border)] bg-white px-5 py-3.5 font-[Poppins] text-[14px] font-semibold text-[var(--neutral-600)] disabled:opacity-40"
        >
          Clear
        </button>
        <button
          type="button"
          onClick={() =>
            onFinish({ guess: letters.join(''), hintsUsed: hintsShown, seconds })
          }
          disabled={!complete}
          className="ss-go h-13 flex-1 py-3.5 text-[15px]"
        >
          Submit answer
          <span aria-hidden>→</span>
        </button>
      </div>
    </div>
  );
}
