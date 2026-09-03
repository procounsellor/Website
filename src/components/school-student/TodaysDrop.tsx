import { Link } from 'react-router-dom';
import GameMark from '@/components/school-student/GameMark';
import { TONE, toneFor } from '@/components/school-student/gameTones';
import { duration, scoringLabel } from '@/api/schoolGames';
import { useLongDate } from '@/lib/useSchoolGames';
import { gameActivityCount } from '@/components/school-student/gameShape';
import { getPlay } from '@/lib/schoolPlays';
import type { TodayDrop } from '@/lib/useSchoolGames';

/**
 * What is on the mountain today.
 *
 * Everything here is the schedule the backend published for THIS date and THIS
 * grade — the set, its size, its points, its clock. Nothing falls back to a
 * plausible-looking default: no schedule means the empty state, not a made-up
 * quiz.
 *
 * The action is "Play" for a day that is open and "Opens <date>" for one that
 * is not, and the two are different elements rather than one styled button —
 * a disabled-looking control that is actually a link, or vice versa, is the
 * kind of thing you only find out about by tapping it.
 */

const Chip = ({ label, value, ink }: { label: string; value: string; ink: string }) => (
  <div className="rounded-[12px] border border-[var(--card-border)] px-3 py-2">
    <p className="ss-eyebrow text-[var(--neutral-400)]">{label}</p>
    <p className="ss-data mt-1 text-[14px]" style={{ color: ink }}>
      {value}
    </p>
  </div>
);

/** The shimmer that stands in while the schedule is in flight. */
export const DropSkeleton = ({ compact = false }: { compact?: boolean }) => (
  <div className="ss-panel p-5" aria-busy="true" aria-live="polite">
    <span className="sr-only">Loading today&apos;s game</span>
    <div className="flex items-center gap-4">
      <div className="h-[52px] w-[52px] shrink-0 animate-pulse rounded-[14px] bg-[#EEF0F6]" />
      <div className="min-w-0 flex-1 space-y-2">
        <div className="h-4 w-2/5 animate-pulse rounded bg-[#EEF0F6]" />
        <div className="h-3 w-3/5 animate-pulse rounded bg-[#F3F5F9]" />
      </div>
    </div>
    {!compact && (
      <div className="mt-5 grid grid-cols-3 gap-2.5">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-[58px] animate-pulse rounded-[12px] bg-[#F3F5F9]" />
        ))}
      </div>
    )}
  </div>
);

/** Shown when the backend has no game scheduled for this date. */
export const NoDropToday = ({ compact = false }: { compact?: boolean }) => (
  <div className="ss-panel flex items-center gap-4 p-5">
    <span className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[14px] border border-[var(--card-border)] bg-[var(--slate-surface)] text-[22px]">
      <span aria-hidden>🌤️</span>
    </span>
    <div className="min-w-0">
      <h3 className="ss-display text-[17px] text-[var(--ink)]">No game today</h3>
      <p className="mt-1 font-[Poppins] text-[12.5px] leading-relaxed text-[var(--neutral-500)]">
        Nothing is scheduled for your class today.{' '}
        {compact ? (
          <Link
            to="/school-student/games"
            className="font-semibold text-[var(--brand-purple-700)] underline underline-offset-2"
          >
            See every game
          </Link>
        ) : (
          'Check back tomorrow — the rack below is always open.'
        )}
      </p>
    </div>
  </div>
);

export default function TodaysDrop({
  drop,
  studentId,
  compact = false,
  onShowRules,
}: {
  drop: TodayDrop;
  /** Whose play history to read. Null simply means "no local record". */
  studentId?: string | null;
  /** The dashboard's version: the headline facts and a way through, nothing else. */
  compact?: boolean;
  /** Scroll to this game's card in the rack and open its rules. */
  onShowRules?: (gameId: string) => void;
}) {
  const tone = TONE[toneFor(drop.gameId)];
  const game = drop.game;
  const set = drop.set;
  /*
   * "Have they played?" has two possible sources and only one of them answers.
   * `drop.session` is the real one and is always null — getGameSession has no
   * session to find, because nothing creates one. The local ledger fills that
   * gap so this card, the daily goal and the dashboard's quiz count cannot
   * disagree about the same fact. See lib/schoolPlays.
   */
  const localPlay = getPlay(studentId, drop.date);
  const played = Boolean(drop.session) || Boolean(localPlay);
  const savedScore = drop.session?.score ?? localPlay?.points;
  const activityCount = gameActivityCount(game?.engine, set?.itemCount);
  const title = set?.title || drop.title || game?.name || 'Today’s game';
  const when = useLongDate(drop.date);

  return (
    <article
      className="ss-panel relative overflow-hidden p-5 sm:p-6"
      style={{ borderColor: tone.edge }}
    >
      {/* A single hue rule down the left edge: this card belongs to today's game
          without the card itself being tinted. */}
      <span
        aria-hidden
        className="absolute inset-y-0 left-0 w-1"
        style={{ background: tone.ink }}
      />

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-4">
          <GameMark gameId={drop.gameId} engine={game?.engine} size={56} />
          <div className="min-w-0">
            <p className="ss-eyebrow" style={{ color: drop.isToday ? tone.ink : 'var(--neutral-400)' }}>
              {drop.isToday ? (game?.name ?? drop.gameId.replace(/_/g, ' ')) : 'Coming up next'}
            </p>
            <h3 className="ss-display mt-1.5 text-[21px] leading-tight text-[var(--ink)] sm:text-[24px]">
              {title}
            </h3>
            {game?.description && (
              <p className="mt-1.5 max-w-[30rem] font-[Poppins] text-[12.5px] leading-[1.55] text-[var(--neutral-500)]">
                {game.description}
              </p>
            )}
          </div>
        </div>

        <span
          className="ss-eyebrow shrink-0 rounded-full px-3 py-1.5"
          style={
            !drop.isToday
              ? { background: '#EEF0F6', color: 'var(--slate-ink)' }
              : played
                ? { background: '#DCFCE7', color: '#16A34A' }
                : { background: tone.tint, color: tone.ink }
          }
        >
          {!drop.isToday
            ? when
            : played
              ? drop.session
                ? `Played · ${savedScore ?? 0} pts`
                : localPlay?.total
                ? `Played · ${localPlay.correct}/${localPlay.total}`
                : localPlay?.solved === true
                  ? 'Played · solved'
                  : 'Played today'
              : 'Not played yet'}
        </span>
      </div>

      {!compact && (
        <div className="mt-5 grid grid-cols-3 gap-2.5">
          <Chip
            label={activityCount === 1 ? 'Activity' : 'Questions'}
            value={activityCount ? String(activityCount) : '—'}
            ink={tone.ink}
          />
          <Chip
            label="Points"
            value={set?.points ? String(set.points) : (game ? scoringLabel(game) : '—')}
            ink={tone.ink}
          />
          <Chip
            label="Clock"
            value={duration(set?.timeLimitSecs ?? game?.defaultTimeLimitSecs)}
            ink={tone.ink}
          />
        </div>
      )}

      {!drop.isToday && (
        <p className="mt-4 rounded-[12px] bg-[#F5F6FA] px-3.5 py-2.5 font-[Poppins] text-[12px] leading-relaxed text-[var(--neutral-600)]">
          Nothing is scheduled for your class today. This is what&apos;s next — it opens on{' '}
          <strong className="font-semibold text-[var(--ink)]">{when}</strong>.
        </p>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-3">
        {compact ? (
          <Link
            to={drop.isToday ? '/school-student/play' : '/school-student/games'}
            className="ss-go px-5 py-2.5 text-[13.5px]"
          >
            {drop.isToday ? (played ? 'View result' : 'Play now') : 'See what is coming'}
            <span aria-hidden>→</span>
          </Link>
        ) : (
          <>
            {drop.isToday ? (
              <Link to="/school-student/play" className="ss-go px-5 py-2.5 text-[13.5px]">
                {played ? 'View result' : 'Play now'}
                <span aria-hidden>→</span>
              </Link>
            ) : (
              <span className="ss-go px-5 py-2.5 text-[13.5px]" aria-disabled="true">
                Opens {when}
              </span>
            )}
            {/* Opens the game's own card in the rack and scrolls to it — an
                anchor alone jumped to a collapsed <details> and looked like
                nothing had happened. */}
            <button
              type="button"
              onClick={() => onShowRules?.(drop.gameId)}
              className="cursor-pointer font-[Poppins] text-[12.5px] font-semibold text-[var(--brand-purple-700)] underline underline-offset-2"
            >
              Rules
            </button>
          </>
        )}
      </div>
    </article>
  );
}
