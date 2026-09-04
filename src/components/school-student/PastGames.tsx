import { useState } from 'react';
import { Link } from 'react-router-dom';
import GameMark from '@/components/school-student/GameMark';
import { TONE, toneFor } from '@/components/school-student/gameTones';
import { getPlay } from '@/lib/schoolPlays';
import type { ScheduledDay } from '@/lib/useSchoolGames';

/**
 * The days behind today.
 *
 * The week strip shows three days back and no further, which is the right size
 * for a glance and the wrong size for "I joined in September, what have I
 * missed?". This is the full list: every past date that had a game scheduled
 * for this student's class, newest first, each one a link into the same board
 * today's game opens.
 *
 * ─── Why it shows misses as well as plays ────────────────────────────────────
 *
 * The obvious version lists only what was played, as a trophy shelf. That gets
 * the incentive backwards: the value of an archive on a daily-game programme is
 * that a missed day is recoverable, so the missed days are the ones that have
 * to be visible and tappable. A played day is shown too, with its score, but it
 * is the quieter of the two states.
 *
 * Collapsed to a week by default. Twenty-one rows below the fold is a wall; the
 * three or four a student actually cares about are always the newest.
 */

const WHEN = { weekday: 'short', day: 'numeric', month: 'short' } as const;

export default function PastGames({
  days,
  loading,
  studentId,
}: {
  days: ScheduledDay[];
  loading: boolean;
  /** Whose play history to read. Null simply means "no local record". */
  studentId?: string | null;
}) {
  const [expanded, setExpanded] = useState(false);

  if (loading) {
    return (
      <ul className="space-y-2.5" aria-busy>
        {[0, 1, 2].map((i) => (
          <li key={i} className="h-[72px] animate-pulse rounded-[14px] bg-[#F3F5F9]" />
        ))}
      </ul>
    );
  }

  if (days.length === 0) {
    return (
      <div className="ss-panel p-6 text-center">
        <p className="ss-display text-[16px] text-[var(--ink)]">Nothing behind you yet</p>
        <p className="mt-1.5 font-[Poppins] text-[12.5px] leading-relaxed text-[var(--neutral-500)]">
          Once you have a few days on the programme, every game you missed shows up
          here and stays playable.
        </p>
      </div>
    );
  }

  const shown = expanded ? days : days.slice(0, 7);
  const missed = days.filter((day) => !getPlay(studentId, day.date) && !day.session).length;

  return (
    <>
      {missed > 0 && (
        <p className="mb-3 rounded-[12px] border border-[var(--card-border)] bg-[#F7F8FC] px-4 py-3 font-[Poppins] text-[12.5px] leading-relaxed text-[var(--neutral-600)]">
          <strong className="font-semibold text-[var(--ink)]">
            {missed} game{missed === 1 ? '' : 's'} still open.
          </strong>{' '}
          Catching up scores exactly the same as playing on the day.
        </p>
      )}

      <ul className="space-y-2.5">
        {shown.map((day) => {
          const tone = TONE[toneFor(day.gameId ?? 'quiz')];
          const play = getPlay(studentId, day.date);
          const played = Boolean(play) || Boolean(day.session);
          const date = new Date(`${day.date}T00:00:00`);
          const when = Number.isNaN(date.getTime())
            ? day.date
            : date.toLocaleDateString('en-IN', WHEN);

          /*
           * What the run came to, in the shape that engine actually scores in:
           * a quiz has a mark out of a total, a Sudoku and a word either came
           * out or did not. Reading "8/10" off a Number Grid would be nonsense.
           */
          const result = play?.total
            ? `${play.correct}/${play.total}`
            : play?.solved === true
              ? 'Solved'
              : play?.solved === false
                ? 'Not solved'
                : played
                  ? 'Played'
                  : null;

          return (
            <li key={day.date}>
              <Link
                to={`/school-student/play/${day.date}`}
                className="ss-panel flex items-center gap-3.5 p-3.5 transition-transform active:scale-[0.99]"
                style={{
                  // A played day recedes; an open one keeps its game's colour on
                  // the edge so the list reads as "these are still waiting".
                  borderColor: played ? 'var(--card-border)' : tone.edge,
                  opacity: played ? 0.82 : 1,
                }}
              >
                <GameMark gameId={day.gameId!} size={44} surface="#FFFFFF" />

                <div className="min-w-0 flex-1">
                  <p className="ss-eyebrow text-[var(--neutral-400)]">{when}</p>
                  <p className="ss-display truncate text-[15px] text-[var(--ink)]">
                    {day.title ?? day.gameId?.replace(/_/g, ' ')}
                  </p>
                </div>

                <span
                  className="ss-eyebrow shrink-0 rounded-full px-3 py-1.5"
                  style={
                    played
                      ? { background: '#DCFCE7', color: '#16A34A' }
                      : { background: tone.tint, color: tone.ink }
                  }
                >
                  {result ?? 'Play'}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      {days.length > 7 && (
        <button
          type="button"
          onClick={() => setExpanded((open) => !open)}
          className="ss-eyebrow mt-3 w-full rounded-[12px] border border-[var(--card-border)] bg-white py-3 text-[var(--neutral-600)]"
        >
          {expanded ? 'Show less' : `Show all ${days.length} days`}
        </button>
      )}
    </>
  );
}
