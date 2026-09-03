import { useCallback, useEffect, useMemo, useState } from 'react';
import { hintOf, imageOf, promptOf, type GameItem } from '@/lib/gameItems';
import { TONE, toneFor } from '@/components/school-student/gameTones';
import { useSessionState } from '@/lib/useSessionState';
import type { Game } from '@/api/schoolGames';

/**
 * One card at a time: Career Quiz, Flag Dash and Myth or Fact.
 *
 * All three ask the same kind of question, so they share a board. What they do
 * NOT share is field names — quiz puts the question in `content.question`,
 * flags in `content.prompt`, myth/fact in `content.statement` — and reading the
 * wrong one renders an empty card rather than throwing, which is exactly how
 * the quiz shipped with no visible question. `promptOf` and friends in
 * lib/gameItems own that mapping now; nothing here reaches into `content`.
 *
 * **No explanation is shown during play.** An earlier version revealed the
 * item's `explanation` the moment an option was tapped, which was wrong twice
 * over: it gives the answer away without ever marking it, so a student reads
 * "Auditors examine financial statements independently…" and knows instantly
 * they picked wrong — and it teaches at the one moment they are least able to
 * take it in. Explanations are review material. They belong on the results
 * screen, next to what was chosen.
 *
 * **This board does not mark answers, and that is deliberate.** Marking happens
 * once, at the end, in lib/schoolMarking — not per tap. Turning an option green
 * the instant it is chosen turns a ten-question set into ten separate
 * one-question sets: you cannot go back and change your mind, the explanation
 * has to fire immediately, and the run has no shape. The review screen marks
 * everything at once, next to what was chosen and why.
 *
 * ─── Two ways this board used to trap a student ──────────────────────────────
 *
 *  - **"Next" was disabled until an option was picked.** A question you cannot
 *    answer therefore ended the run — no skip, no come-back-to-it, and the only
 *    exit was the browser's back button, which discarded everything. Questions
 *    can now be skipped and returned to, and the progress bar distinguishes
 *    answered from seen-and-skipped.
 *  - **The countdown reached 00:00 and nothing happened.** The clock ran to
 *    zero and then kept sitting there, so a timed set was not actually timed
 *    and the number at the top was decoration. Time-up now finishes the run
 *    with whatever has been answered.
 */
export default function McqBoard({
  items,
  game,
  timeLimitSecs,
  sessionKey,
  onFinish,
}: {
  items: GameItem[];
  game: Game | null;
  timeLimitSecs?: number | null;
  /** Identifies this run, so a reload resumes it. */
  sessionKey: string;
  onFinish: (result: {
    answers: Record<string, string>;
    hintsUsed: number;
    seconds: number;
  }) => void;
}) {
  const gameId = game?.gameId ?? 'quiz';
  const tone = TONE[toneFor(gameId)];

  /*
   * The run is stored, so a mis-tapped back button or an accidental reload does
   * not throw away eight answers. See lib/useSessionState for why that store is
   * localStorage keyed by day, and what prunes it.
   */
  const [run, setRun, clearRun] = useSessionState(sessionKey, {
    index: 0,
    answers: {} as Record<string, string>,
    hints: [] as string[],
    seconds: 0,
  });
  const { index, answers, hints: hintsUsed } = run;
  const setIndex = (next: number) => setRun((r) => ({ ...r, index: next }));
  const [seconds, setSeconds] = useState(run.seconds);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (done) return;
    const tick = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(tick);
  }, [done]);

  // Persist the clock about once every five seconds rather than every tick —
  // a write per second for a ten-minute quiz is 600 needless writes.
  useEffect(() => {
    if (done || seconds % 5 !== 0) return;
    setRun((r) => (r.seconds === seconds ? r : { ...r, seconds }));
  }, [seconds, done, setRun]);

  /*
   * Ending the run.
   *
   * `done` guards it because there are now three ways in — the Finish button,
   * the last question, and the clock hitting zero — and two of them can fire in
   * the same tick. Without the guard, finishing on the final question exactly as
   * time ran out submitted twice and awarded the points twice.
   */
  const finish = useCallback(() => {
    setDone(true);
    clearRun();
    onFinish({ answers: { ...run.answers }, hintsUsed: run.hints.length, seconds });
  }, [clearRun, onFinish, run.answers, run.hints, seconds]);

  // Time up. Whatever is answered is what gets marked — a timed set that
  // silently keeps running is not timed.
  useEffect(() => {
    if (done || !timeLimitSecs) return;
    if (seconds >= timeLimitSecs) finish();
  }, [seconds, timeLimitSecs, done, finish]);

  const item = items[index];
  const picked = item ? answers[item.itemId] : undefined;
  const [imageFailed, setImageFailed] = useState(false);
  useEffect(() => setImageFailed(false), [item?.itemId]);

  const image = useMemo(() => (item ? imageOf(item) : null), [item]);
  const answeredCount = items.filter((it) => answers[it.itemId]).length;
  if (!item) return null;

  const prompt = promptOf(item);
  const hint = hintOf(item);
  const hintShown = hintsUsed.includes(item.itemId);
  const isLast = index === items.length - 1;
  const unanswered = items.length - answeredCount;

  // A countdown is a game clock; a stopwatch is a stopwatch. The set carries the
  // real limit, so use it when there is one.
  const left = timeLimitSecs ? Math.max(0, timeLimitSecs - seconds) : null;
  const clock = left ?? seconds;

  return (
    <div className="mx-auto w-full max-w-[560px]">
      <div className="mb-3 flex items-center gap-3">
        <div className="flex flex-1 gap-1">
          {/* Tapping a segment jumps to that question — with skipping allowed,
              "go back to the two I left" has to be one gesture, not eight. */}
          {items.map((it, i) => (
            <button
              key={it.itemId}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Question ${i + 1}${answers[it.itemId] ? ', answered' : ', not answered'}`}
              aria-current={i === index}
              className="h-4 flex-1 py-[5px]"
            >
              <span
                className="block h-1.5 w-full rounded-full transition-colors"
                style={{
                  background: answers[it.itemId] ? tone.ink : i === index ? tone.edge : '#E4E7F0',
                }}
              />
            </button>
          ))}
        </div>
        <span
          className="ss-data shrink-0 text-[13px]"
          style={{ color: left !== null && left < 60 ? '#DC2626' : 'var(--neutral-500)' }}
        >
          {String(Math.floor(clock / 60)).padStart(2, '0')}:{String(clock % 60).padStart(2, '0')}
        </span>
      </div>

      <div className="ss-panel overflow-hidden">
        <div className="p-5" style={{ background: tone.tint }}>
          <div className="mb-2 flex items-center justify-between gap-3">
            <span className="ss-eyebrow" style={{ color: tone.ink }}>
              Question {index + 1} of {items.length}
            </span>
            {item.difficulty && (
              <span className="ss-eyebrow rounded-full bg-white/70 px-2.5 py-1 text-[var(--neutral-500)]">
                {item.difficulty}
              </span>
            )}
          </div>

          {image && !imageFailed && (
            <img
              src={image}
              alt=""
              onError={() => setImageFailed(true)}
              className="mx-auto mb-3 h-28 w-auto rounded-[10px] object-contain"
            />
          )}
          {image && imageFailed && (
            // Flags resolve to our own /public copies now, so this should not
            // fire — but an image that fails to load must still not leave a
            // question unanswerable behind a broken icon.
            <p className="mb-3 rounded-[10px] bg-white/70 px-3 py-2 text-center font-[Poppins] text-[12px] text-[var(--neutral-500)]">
              This picture didn&apos;t load. You can still answer from the options.
            </p>
          )}

          <h2 className="ss-display text-[19px] leading-snug text-[var(--ink)] sm:text-[21px]">
            {prompt}
          </h2>
        </div>

        <ul className="space-y-2.5 p-4">
          {item.content.options?.map((option) => {
            const chosen = picked === option.id;
            return (
              <li key={option.id}>
                <button
                  type="button"
                  onClick={() =>
                    setRun((r) => ({ ...r, answers: { ...r.answers, [item.itemId]: option.id } }))
                  }
                  className="flex min-h-[54px] w-full items-center gap-3 rounded-[13px] border-2 px-4 py-3 text-left font-[Poppins] text-[15px] transition-all active:scale-[0.99]"
                  style={{
                    borderColor: chosen ? tone.ink : 'var(--card-border)',
                    background: chosen ? tone.tint : '#FFFFFF',
                    color: 'var(--ink)',
                    fontWeight: chosen ? 600 : 400,
                  }}
                >
                  <span
                    className="ss-data flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[12px]"
                    style={{
                      background: chosen ? tone.ink : '#F1F3F8',
                      color: chosen ? '#FFFFFF' : 'var(--neutral-500)',
                    }}
                  >
                    {option.id.toUpperCase().slice(0, 1)}
                  </span>
                  {option.text}
                </button>
              </li>
            );
          })}
        </ul>

        {/* A hint costs points, so it is a decision rather than a freebie. */}
        {hint && game?.supportsHints && (
          <div className="px-4 pb-4">
            {hintShown ? (
              <p className="rounded-[12px] border border-[#F8E3A3] bg-[#FFFBEB] px-4 py-3 font-[Poppins] text-[13px] leading-relaxed text-[#7A5A00]">
                <span aria-hidden>💡 </span>
                {hint}
              </p>
            ) : (
              <button
                type="button"
                onClick={() => setRun((r) => ({ ...r, hints: [...r.hints, item.itemId] }))}
                className="ss-eyebrow w-full rounded-[12px] bg-[#FFF3D9] py-3 text-[#B45309]"
              >
                Need a hint?{game.hintPenalty ? ` · −${game.hintPenalty} pt` : ''}
              </button>
            )}
          </div>
        )}

      </div>

      <div className="mt-4 flex gap-2.5">
        {index > 0 && (
          <button
            type="button"
            onClick={() => setIndex(index - 1)}
            className="h-13 rounded-[12px] border border-[var(--card-border)] bg-white px-5 py-3.5 font-[Poppins] text-[14px] font-semibold text-[var(--neutral-600)]"
          >
            Back
          </button>
        )}
        <button
          type="button"
          onClick={() => {
            if (isLast) {
              finish();
              return;
            }
            setIndex(index + 1);
          }}
          className="ss-go h-13 flex-1 py-3.5 text-[15px]"
        >
          {/* Never disabled. A question nobody can answer used to end the run,
              because "Next" was the only way forward and it was greyed out. */}
          {isLast ? 'Finish' : picked ? 'Next question' : 'Skip for now'}
          <span aria-hidden>→</span>
        </button>
      </div>

      {/*
        Finish early, from anywhere in the set.
        Answer three, decide that is enough, hand in three. Held back until at
        least one answer exists, so it cannot be the first thing a student taps.
      */}
      {!isLast && answeredCount > 0 && (
        <p className="mt-4 text-center font-[Poppins] text-[12.5px] text-[var(--neutral-500)]">
          <button
            type="button"
            onClick={finish}
            className="font-semibold underline underline-offset-2"
          >
            Finish now
          </button>{' '}
          with {answeredCount} of {items.length} answered
        </p>
      )}

      {isLast && unanswered > 0 && (
        <p className="mt-4 rounded-[12px] border border-[#F8E3A3] bg-[#FFFBEB] px-4 py-3 text-center font-[Poppins] text-[12.5px] text-[#7A5A00]">
          {unanswered} question{unanswered === 1 ? '' : 's'} still unanswered. Tap a segment at the
          top to go back, or finish and they count as wrong.
        </p>
      )}
    </div>
  );
}
