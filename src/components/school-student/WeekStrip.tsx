import { Link } from 'react-router-dom';
import GameMark from '@/components/school-student/GameMark';
import { Icon } from '@/components/school-student/assets';
import { TONE, toneFor } from '@/components/school-student/gameTones';
import type { ScheduledDay } from '@/lib/useSchoolGames';

const DAY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/**
 * Warm the play route's chunk.
 *
 * Every day tile leads to the same lazily-loaded page, so the download can
 * start while the student is still looking at the strip instead of after they
 * tap. Fired once, on hover or first touch — not on mount, which would make the
 * strip cost a chunk nobody asked for.
 */
let warmed = false;
const warmPlayRoute = () => {
  if (warmed) return;
  warmed = true;
  import('@/pages/school/SchoolPlay').catch(() => {
    warmed = false;
  });
};

/**
 * The week ahead, as a row of days.
 *
 * It answers "what's on, and when" without opening anything, which is most of
 * what a daily game needs to be habit-forming — you can see Thursday is the
 * Number Grid and look forward to it.
 *
 * Only TODAY is playable. The rest are a preview: a daily game you can run
 * ahead on is not a daily game, and a tile that looks tappable but is not would
 * be worse than one that plainly is not.
 *
 * Horizontally scrollable, because seven 84px tiles do not fit a phone and
 * squeezing them until they do makes every one of them too small to tap.
 */
export default function WeekStrip({
  days,
  loading,
}: {
  days: ScheduledDay[];
  loading: boolean;
}) {
  if (loading) {
    return (
      <div className="flex gap-2.5 overflow-x-auto pb-1" aria-busy>
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-[104px] w-[84px] shrink-0 animate-pulse rounded-[14px] bg-[#EEF0F6]" />
        ))}
      </div>
    );
  }

  return (
    <ol className="-mx-1 flex gap-2.5 overflow-x-auto px-1 pb-2">
      {days.map((day, index) => {
        const date = new Date(`${day.date}T00:00:00`);
        const tone = TONE[toneFor(day.gameId ?? 'quiz')];
        const isToday = index === 0;
        const has = Boolean(day.gameId);
        const playable = isToday && has;

        const inner = (
          <>
            <span className="ss-eyebrow" style={{ color: isToday ? tone.ink : 'var(--neutral-400)' }}>
              {isToday ? 'Today' : DAY[date.getDay()]}
            </span>
            <span className="ss-data mt-0.5 text-[17px] text-[var(--ink)]">{date.getDate()}</span>
            <span className="relative mt-2 flex h-9 items-center justify-center">
              {has ? (
                <GameMark gameId={day.gameId!} size={34} surface="#FFFFFF" />
              ) : (
                <span className="text-[18px] opacity-40" aria-hidden>
                  💤
                </span>
              )}
              {/* A padlock on the days that are not today. Without it the tile
                  simply did not respond, which reads as broken rather than as
                  "not yet". */}
              {has && !isToday && (
                <span
                  className="absolute -right-2 -bottom-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white"
                  style={{ background: 'var(--slate-ink)' }}
                >
                  <Icon name="lock" className="h-2.5 w-2.5 brightness-0 invert" />
                </span>
              )}
            </span>
          </>
        );

        const shell =
          'flex h-[104px] w-[84px] shrink-0 flex-col items-center justify-center rounded-[14px] border px-2 transition-transform active:scale-95';

        return (
          <li key={day.date}>
            {playable ? (
              <Link
                to="/school-student/play"
                onMouseEnter={warmPlayRoute}
                onTouchStart={warmPlayRoute}
                onFocus={warmPlayRoute}
                className={shell}
                style={{
                  background: isToday ? tone.tint : '#FFFFFF',
                  borderColor: isToday ? tone.edge : 'var(--card-border)',
                  boxShadow: isToday ? `0 0 0 2px ${tone.tint}` : undefined,
                }}
                aria-label={`${day.title ?? 'Game'} on ${date.toDateString()}`}
              >
                {inner}
              </Link>
            ) : (
              <div
                className={shell}
                // A day with a game coming is a preview, not a locked door: it
                // keeps a white card and just does not respond to a tap. Only a
                // genuine rest day gets the slate treatment.
                style={
                  has
                    ? { background: '#FFFFFF', borderColor: 'var(--card-border)', opacity: 0.72 }
                    : { background: 'var(--slate-surface)', borderColor: 'var(--slate-border)' }
                }
                aria-disabled="true"
                title={has ? `${day.title ?? 'Game'} — unlocks on the day` : 'Rest day'}
              >
                {inner}
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}
