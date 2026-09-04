import { useEffect, useMemo, useRef, useState } from 'react';
import type { GameItem } from '@/lib/gameItems';
import { checkWord, letterAt } from '@/lib/schoolMarking';
import { useSessionState } from '@/lib/useSessionState';

/**
 * Career Word.
 *
 * The item gives the SHAPE of the word — its length, which letters are already
 * revealed, three hints and a wrong-guess budget — but never the word itself.
 * That constraint shaped this board, and getting it wrong the first time was
 * instructive: it had an A-Z keypad AND a separate answer box. Tapping a letter
 * could not reveal anything, so the keypad silently did nothing, and the box
 * then asked for the same answer a second way. Two mechanics, neither working.
 *
 * Now there is one: you type into the word itself. The revealed letters are
 * fixed, the blanks are yours to fill, and a hidden input drives them so a
 * phone opens its own keyboard on tap.
 *
 * ─── What changed once the word became knowable ──────────────────────────────
 *
 * `content.maxWrongGuesses` is 6 on every item and nothing read it, because
 * nothing could tell a wrong guess from a right one — so "Submit answer" ended
 * the game whatever you typed, and the game had no losing condition, no tension
 * and no second try. With `checkWord` (see lib/schoolMarking) a wrong guess is
 * now a wrong guess: it costs one of six, the word stays on the board, and you
 * go again. That is the game the item was always describing.
 *
 * Guesses live in the same resumable store as every other board, so closing the
 * tab three letters in does not cost the attempt.
 */
export default function WordBoard({
  item,
  hintPenalty,
  sessionKey,
  onFinish,
}: {
  item: GameItem;
  hintPenalty: number;
  sessionKey: string;
  onFinish: (result: {
    guess: string;
    gaveUp: boolean;
    hintsUsed: number;
    seconds: number;
  }) => void;
}) {
  const pattern = (item.content.displayPattern ?? '').toUpperCase();
  const length = item.content.length ?? pattern.length;
  const hints = item.content.hints ?? [];
  const maxWrong = item.content.maxWrongGuesses ?? 6;

  const [run, setRun, clearRun] = useSessionState(sessionKey, {
    /** Wrong words already tried, so the board can show them and not repeat. */
    wrong: [] as string[],
    /** Slots bought with the "reveal a letter" hint. */
    revealed: [] as number[],
    hintsShown: 1,
    seconds: 0,
  });
  const { wrong, revealed, hintsShown } = run;

  const [typed, setTyped] = useState('');
  const [seconds, setSeconds] = useState(run.seconds);
  const [focused, setFocused] = useState(false);
  const [shake, setShake] = useState(false);
  const [done, setDone] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (done) return;
    const tick = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(tick);
  }, [done]);

  useEffect(() => {
    if (done || seconds % 5 !== 0) return;
    setRun((r) => (r.seconds === seconds ? r : { ...r, seconds }));
  }, [seconds, done, setRun]);

  /** Which slots the student actually fills — the rest are given or bought. */
  const blanks = useMemo(
    () =>
      pattern
        .split('')
        .map((ch, i) => (ch === '_' && !revealed.includes(i) ? i : -1))
        .filter((i) => i >= 0),
    [pattern, revealed],
  );

  /** The full word as it stands: givens, bought letters, and what was typed. */
  const letters = useMemo(() => {
    const out = pattern.split('');
    revealed.forEach((slot) => {
      const ch = letterAt(item, slot);
      if (ch) out[slot] = ch;
    });
    blanks.forEach((slot, n) => {
      out[slot] = typed[n] ?? '_';
    });
    return out;
  }, [pattern, blanks, typed, revealed, item]);

  const complete = typed.length === blanks.length;
  const caret = focused ? Math.min(typed.length, Math.max(0, blanks.length - 1)) : -1;
  const triesLeft = Math.max(0, maxWrong - wrong.length);
  const outOfTries = triesLeft === 0;

  /** Is there a key for this word at all? Drives whether guessing can be marked. */
  const markable = checkWord(item, '').isRight !== null;

  /** A slot the "reveal a letter" hint can still buy. */
  const nextReveal = blanks.find((slot) => letterAt(item, slot) !== null) ?? null;

  const finish = (gaveUp: boolean, guess: string) => {
    setDone(true);
    clearRun();
    onFinish({ guess, gaveUp, hintsUsed: hintsShown - 1 + revealed.length, seconds });
  };

  const submit = () => {
    if (done) return;
    const guess = letters.join('');

    // Nothing to check against: the old behaviour, one submission and out.
    if (!markable) {
      finish(false, guess);
      return;
    }

    if (checkWord(item, guess).isRight) {
      finish(false, guess);
      return;
    }

    // Wrong. Spend a try, keep the board, and say so — the shake is the only
    // feedback fast enough to read as "that was the answer being rejected".
    const spent = [...wrong, guess];
    setRun((r) => ({ ...r, wrong: spent }));
    setTyped('');
    setShake(true);
    setTimeout(() => setShake(false), 420);

    if (spent.length >= maxWrong) finish(false, guess);
  };

  return (
    <div className="mx-auto w-full max-w-[520px]">
      <div className="flex items-center justify-between gap-3">
        <p className="ss-eyebrow text-[var(--neutral-400)]">
          {item.content.category ?? 'Word'} · {length} letters
        </p>
        <p className="ss-data text-[13px] text-[var(--neutral-500)]">
          {String(Math.floor(seconds / 60)).padStart(2, '0')}:{String(seconds % 60).padStart(2, '0')}
        </p>
      </div>

      {/* Tries left, as pips. A number would be read once; six dots going out
          one at a time is the pressure the wrong-guess budget was written for. */}
      {markable && (
        <div className="mt-3 flex items-center justify-center gap-1.5" aria-label={`${triesLeft} of ${maxWrong} tries left`}>
          {Array.from({ length: maxWrong }, (_, i) => (
            <span
              key={i}
              className="h-2 w-6 rounded-full transition-colors"
              style={{ background: i < triesLeft ? '#5A38E8' : '#E4E7F0' }}
            />
          ))}
        </div>
      )}

      {/* The word IS the input. Tapping anywhere on it focuses the hidden field,
          which is what opens the keyboard on a phone. */}
      <button
        type="button"
        onClick={() => inputRef.current?.focus()}
        aria-label="Type your answer"
        className="mt-4 grid w-full justify-center gap-1 sm:gap-1.5"
        style={{
          gridTemplateColumns: `repeat(${length}, minmax(0, 1fr))`,
          animation: shake ? 'ss-word-shake 0.4s' : undefined,
        }}
      >
        {letters.map((ch, i) => {
          const given = pattern[i] !== '_';
          const bought = revealed.includes(i);
          const slot = blanks.indexOf(i);
          const isCaret = slot === caret && !given && !bought;
          const filled = ch !== '_';
          return (
            <span
              key={i}
              className="ss-data flex aspect-[3/4] items-center justify-center rounded-[9px] border-2 text-[clamp(13px,4.4vw,22px)] transition-colors"
              style={{
                borderColor: given || bought
                  ? '#5A38E8'
                  : isCaret
                    ? '#F59E0B'
                    : filled
                      ? '#8B6CF8'
                      : 'var(--card-border)',
                background: given ? '#EFEAFF' : bought ? '#FFF7E6' : isCaret ? '#FFF7E6' : '#FFFFFF',
                color: given ? '#5A38E8' : bought ? '#B45309' : 'var(--ink)',
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
        onKeyDown={(e) => {
          if (e.key === 'Enter' && complete) {
            e.preventDefault();
            submit();
          }
        }}
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

      {wrong.length > 0 && (
        <p className="mt-2 text-center font-[Poppins] text-[12px] text-[var(--neutral-500)]">
          Already tried:{' '}
          <span className="font-semibold text-[#B91C1C]">{wrong.join(', ')}</span>
        </p>
      )}

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

        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {hintsShown < hints.length && (
            <button
              type="button"
              onClick={() => setRun((r) => ({ ...r, hintsShown: r.hintsShown + 1 }))}
              className="ss-eyebrow rounded-[10px] bg-[#FFF3D9] py-3 text-[#B45309]"
            >
              Another hint ({hints.length - hintsShown} left)
            </button>
          )}
          {/* Only offered when there is a letter to give. Without a key this
              button could not do anything, and a dead control is worse than an
              absent one. */}
          {nextReveal !== null && (
            <button
              type="button"
              onClick={() => {
                setRun((r) => ({ ...r, revealed: [...r.revealed, nextReveal] }));
                setTyped('');
              }}
              className="ss-eyebrow rounded-[10px] border border-[#F8E3A3] bg-white py-3 text-[#B45309]"
            >
              Reveal a letter{hintPenalty ? ` · −${hintPenalty} pt` : ''}
            </button>
          )}
        </div>
      </div>

      {outOfTries && !done && (
        <p className="mt-4 rounded-[12px] bg-[#FEE2E2] px-4 py-3 text-center font-[Poppins] text-[13px] text-[#B91C1C]">
          Out of tries.
        </p>
      )}

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
          onClick={submit}
          disabled={!complete || done}
          className="ss-go h-13 flex-1 py-3.5 text-[15px]"
        >
          {markable && wrong.length > 0 ? `Try again (${triesLeft} left)` : 'Submit answer'}
          <span aria-hidden>→</span>
        </button>
      </div>

      {/* The exit. A word you cannot get must not hold you on the page. */}
      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={() => finish(true, letters.join(''))}
          className="font-[Poppins] text-[12.5px] font-semibold text-[var(--neutral-500)] underline underline-offset-2"
        >
          Give up and see the word
        </button>
      </div>

      <style>{`@keyframes ss-word-shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-7px)}40%{transform:translateX(7px)}60%{transform:translateX(-4px)}80%{transform:translateX(4px)}}`}</style>
    </div>
  );
}
