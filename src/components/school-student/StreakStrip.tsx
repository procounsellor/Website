import { Icon } from '@/components/school-student/assets';

/**
 * The last seven days, and which of them the student showed up.
 *
 * Derived, not stored: the backend keeps `currentStreak` and `lastActiveDate`
 * but no per-day log, and a streak of N ending on a known date IS the last N
 * days — so the strip is exact rather than approximated. Where `lastActiveDate`
 * is missing or unparseable the run is anchored to today, which is the only
 * other thing the data supports.
 *
 * It deliberately does not draw a "longest streak" or a monthly grid. Both
 * would need history the API does not expose, and inventing them is how a
 * progress widget starts telling a student something that is not true.
 */

const DAY_INITIAL = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

const parseAnchor = (lastActiveDate: string | null): Date => {
  if (lastActiveDate) {
    const parsed = new Date(
      /^\d{4}-\d{2}-\d{2}$/.test(lastActiveDate) ? `${lastActiveDate}T00:00:00` : lastActiveDate,
    );
    if (!Number.isNaN(parsed.getTime())) return startOfDay(parsed);
  }
  return startOfDay(new Date());
};

export default function StreakStrip({
  streakDays,
  lastActiveDate,
}: {
  streakDays: number;
  lastActiveDate: string | null;
}) {
  const today = startOfDay(new Date());
  const anchor = parseAnchor(lastActiveDate);

  // The run covers `streakDays` days ending on the anchor, inclusive.
  const runEnd = anchor.getTime();
  const runStart = runEnd - Math.max(0, streakDays - 1) * 86_400_000;

  const days = Array.from({ length: 7 }, (_, offset) => {
    const date = new Date(today);
    date.setDate(date.getDate() - (6 - offset));
    const stamp = startOfDay(date).getTime();
    return {
      key: stamp,
      initial: DAY_INITIAL[date.getDay()],
      active: streakDays > 0 && stamp >= runStart && stamp <= runEnd,
      isToday: stamp === today.getTime(),
    };
  });

  const activeToday = days[6].active;

  return (
    <section className="ss-panel p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="ss-display text-[17px] text-[var(--ink)]">Your streak</h2>
          <p className="mt-1 font-[Poppins] text-[12px] text-[var(--neutral-500)]">
            {streakDays > 0
              ? activeToday
                ? "Today is counted. Come back tomorrow to keep it."
                : 'Do one activity today to keep the run going.'
              : 'Finish one activity to start a run.'}
          </p>
        </div>
        <span className="flex shrink-0 items-center gap-1.5">
          <Icon name="flameStreak" className="h-6 w-6" />
          <span className="ss-data text-[22px] leading-none text-[var(--ink)]">{streakDays}</span>
        </span>
      </div>

      <ol className="mt-4 flex justify-between gap-1.5">
        {days.map((day) => (
          <li key={day.key} className="flex flex-1 flex-col items-center gap-1.5">
            <span
              className="flex h-9 w-full items-center justify-center rounded-[10px] border text-[13px]"
              style={
                day.active
                  ? {
                      background: 'linear-gradient(135deg,#FBBF24 0%,#F59E0B 100%)',
                      borderColor: '#F59E0B',
                      color: '#fff',
                    }
                  : {
                      background: '#F5F6FA',
                      borderColor: day.isToday ? 'var(--brand-purple-300)' : 'transparent',
                      color: '#C2C7D4',
                    }
              }
              aria-hidden
            >
              {day.active ? '✓' : '·'}
            </span>
            <span
              className="ss-eyebrow"
              style={{ color: day.isToday ? 'var(--ink)' : 'var(--neutral-400)' }}
            >
              {day.initial}
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
