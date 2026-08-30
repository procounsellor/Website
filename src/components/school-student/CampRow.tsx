import { Icon } from '@/components/school-student/assets';
import type { QuarterView } from '@/lib/schoolStudentProgress';

/**
 * The four camps, in daylight.
 *
 * These are the legend for the markers on the ridge above — same codes, same
 * hues, same order — so the scene stays decorative and the card carries the
 * detail. The quarter hue appears in exactly two places on each card: the 3px
 * rule across the top and the code. Filling the card with a tint is what made
 * the earlier pass look washed out, and it is not repeated here.
 */

const HUE: Record<string, string> = {
  green: '#22C55E',
  purple: '#7A5AF5',
  blue: '#3B82F6',
  gold: '#F59E0B',
};

export default function CampRow({ quarters }: { quarters: QuarterView[] }) {
  return (
    <ol className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {quarters.map((quarter) => {
        const hue = HUE[quarter.accent] ?? '#7A5AF5';
        const locked = quarter.status === 'locked';
        const current = quarter.status === 'current';

        return (
          <li
            key={quarter.id}
            className="ss-camp flex h-full flex-col p-4"
            data-state={quarter.status}
            style={{ ['--camp-accent' as string]: locked ? '#CBD3E3' : hue }}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p
                  className="ss-data text-[22px] leading-none"
                  style={{ color: locked ? '#94A3B8' : hue }}
                >
                  {quarter.code}
                </p>
                <h3
                  className="ss-display mt-1.5 text-[17px] leading-tight"
                  style={{ color: locked ? '#7C879B' : 'var(--ink)' }}
                >
                  {quarter.title}
                </h3>
              </div>

              <span className="flex h-11 w-11 shrink-0 items-center justify-center">
                {locked ? (
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#DDE3EE]">
                    <Icon name="lock" className="h-5 w-5 opacity-70" />
                  </span>
                ) : (
                  <Icon name={quarter.icon} className="h-11 w-11" />
                )}
              </span>
            </div>

            <p
              className="mt-2 font-[Poppins] text-[12px] leading-[1.5]"
              style={{ color: locked ? '#8A94A6' : 'var(--neutral-500)' }}
            >
              {quarter.tagline}
            </p>

            <p
              className="ss-data mt-3 text-[11px]"
              style={{ color: current ? hue : locked ? '#98A2B6' : 'var(--neutral-400)' }}
            >
              {current
                ? `${quarter.completed} / ${quarter.total} TASKS DONE`
                : `${quarter.total} ${quarter.total === 1 ? 'TASK' : 'TASKS'}`}
            </p>

            <div className="mt-auto flex items-center justify-between gap-3 pt-2.5">
              <span className="ss-eyebrow text-[var(--neutral-400)]">{quarter.window}</span>
              {current ? (
                <span
                  className="ss-eyebrow rounded-full px-2.5 py-1 text-white"
                  style={{ background: hue }}
                >
                  Current
                </span>
              ) : locked ? (
                <span className="ss-eyebrow flex items-center gap-1.5 rounded-full bg-[#DDE3EE] px-2.5 py-1 text-[var(--slate-ink)]">
                  <Icon name="lock" className="h-2.5 w-2.5 opacity-70" />
                  Locked
                </span>
              ) : (
                <span className="ss-eyebrow flex items-center gap-1.5 rounded-full bg-[#DCFCE7] px-2.5 py-1 text-[var(--green-600)]">
                  <Icon name="completedCheck" muted className="h-2.5 w-2.5" />
                  Complete
                </span>
              )}
            </div>

            {/*
             * Progress rides the card's bottom edge rather than sitting inside
             * it. As a block it made the current card taller than the three
             * beside it, and a row of cards with one long leg reads as a
             * layout bug. Absolute, so it costs no height and every camp stays
             * level; it mirrors the 3px hue rule at the top, which is identity
             * — this one is progress.
             */}
            {current && (
              <span
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-[4px]"
                style={{ background: '#EEF0F6' }}
              >
                <span
                  className="block h-full"
                  style={{
                    width: `${quarter.percent}%`,
                    background: hue,
                    transition: 'width var(--motion-slow) var(--motion-ease)',
                  }}
                />
              </span>
            )}

          </li>
        );
      })}
    </ol>
  );
}
