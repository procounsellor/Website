import { Icon } from '@/components/school-student/assets';
import type { QuarterView } from '@/lib/schoolStudentProgress';

/**
 * The four-quarter rail.
 *
 * The mountain sits behind the cards on the right of the band and runs off the
 * bottom, so the cards overlap the slope — that overlap is what gives the top
 * of the dashboard depth. It is inline SVG rather than an illustration file: a
 * hero image here would be the heaviest thing on the page and would shift
 * layout while it loaded; this costs under a kilobyte and paints on the first
 * frame.
 */
/**
 * The summit the journey climbs.
 *
 * Neither supplied pack ships a mountain, so this is drawn here: layered peaks
 * with a snow cap, pines at the treeline, the dashed climb and the flag. Inline
 * SVG rather than an illustration file — a hero image here would be the
 * heaviest thing on the page and would shift layout while it loaded; this costs
 * under a kilobyte, paints on the first frame and scales to any width.
 *
 * It sits above the quarter cards rather than behind them, so the peak, the
 * path and the flag are all fully visible. Hidden on small screens, where there
 * is no room for it and it is purely decorative.
 */
const Scene = () => (
  <svg
    viewBox="0 0 560 220"
    aria-hidden
    className="pointer-events-none absolute top-0 right-0 hidden h-[196px] w-[480px] max-w-[46%] md:block"
    preserveAspectRatio="xMaxYMax meet"
  >
    <defs>
      <linearGradient id="jt-front" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#A78BFA" />
        <stop offset="100%" stopColor="#D6CCFF" />
      </linearGradient>
      <linearGradient id="jt-back" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#CFC4FF" />
        <stop offset="100%" stopColor="#EFEBFF" />
      </linearGradient>
    </defs>

    {/* Clouds */}
    <g fill="#FFFFFF">
      <ellipse cx="76" cy="52" rx="30" ry="12" />
      <ellipse cx="100" cy="45" rx="22" ry="16" />
      <ellipse cx="452" cy="40" rx="26" ry="11" />
      <ellipse cx="470" cy="34" rx="19" ry="14" />
    </g>

    {/* Birds */}
    <g stroke="#8B6CF8" strokeWidth="2.4" fill="none" strokeLinecap="round">
      <path d="M168 46 q8 -8 16 0" />
      <path d="M184 46 q8 -8 16 0" />
      <path d="M126 88 q6 -6 12 0" />
    </g>

    {/* Back range */}
    <path d="M40 220 L170 78 L300 220 Z" fill="url(#jt-back)" />
    <path d="M380 220 L470 100 L560 220 Z" fill="url(#jt-back)" />

    {/* Front peak */}
    <path d="M150 220 L330 30 L520 220 Z" fill="url(#jt-front)" />
    {/* Snow cap, with the jagged lower edge that makes it read as snow */}
    <path
      d="M330 30 L390 92 L372 84 L358 98 L344 86 L330 100 L316 86 L302 98 L288 84 L272 92 Z"
      fill="#FFFFFF"
    />

    {/* Treeline */}
    <g>
      <path d="M108 208 L120 178 L132 208 Z" fill="#4ADE80" />
      <path d="M112 214 L120 194 L128 214 Z" fill="#22C55E" />
      <path d="M462 212 L472 186 L482 212 Z" fill="#4ADE80" />
      <path d="M466 218 L472 200 L478 218 Z" fill="#22C55E" />
    </g>

    {/* The climb */}
    <path
      d="M248 216 C 280 190 248 174 284 152 C 314 132 290 112 318 92 L328 44"
      fill="none"
      stroke="#F59E0B"
      strokeWidth="4.5"
      strokeLinecap="round"
      strokeDasharray="10 9"
    />

    {/* Flag */}
    <path d="M330 42 L330 12" stroke="#475569" strokeWidth="4" strokeLinecap="round" />
    <path d="M330 12 L364 22 L330 32 Z" fill="#F97316" />
  </svg>
);

/** Dashed hop between two quarter cards, with the lock that gates it. */
const Connector = ({ unlocked }: { unlocked: boolean }) => (
  <li aria-hidden className="hidden items-center justify-center xl:flex">
    <span className="relative flex w-full items-center">
      <span
        className="h-px flex-1 border-t-2 border-dashed"
        style={{ borderColor: unlocked ? '#BBF7D0' : '#CFD6E4' }}
      />
      <span
        className="absolute left-1/2 flex h-7 w-7 -translate-x-1/2 items-center justify-center rounded-full"
        style={{
          background: unlocked ? '#FFFFFF' : '#64748B',
          border: unlocked ? '1px solid #BBF7D0' : 'none',
          boxShadow: '0 2px 6px rgba(17,24,39,0.10)',
        }}
      >
        {unlocked ? (
          <span className="font-[Poppins] text-[12px] font-bold text-[#16A34A]">✓</span>
        ) : (
          <Icon name="lock" className="h-3.5 w-3.5 brightness-0 invert" />
        )}
      </span>
    </span>
  </li>
);

export default function JourneyTrack({ quarters }: { quarters: QuarterView[] }) {
  return (
    <section className="relative">
      <Scene />

      <div className="relative px-1 pt-1 pb-2">
        <div className="flex items-start gap-2.5">
          <span className="mt-0.5 text-[22px]" aria-hidden>
            📖
          </span>
          <div>
            <h2 className="font-[Poppins] text-[19px] font-bold text-[#111827] md:text-[20px]">
              Your Journey
            </h2>
            <p className="mt-0.5 font-[Poppins] text-[12.5px] text-[#6B7280]">
              Complete each quarter to unlock the next and level up!
            </p>
          </div>
        </div>

        <ol className="mt-6 grid grid-cols-1 md:mt-[152px] gap-4 sm:grid-cols-2 xl:grid-cols-[1fr_40px_1fr_40px_1fr_40px_1fr] xl:items-stretch xl:gap-0">
          {quarters.map((q, index) => {
            const isCurrent = q.status === 'current';
            const isComplete = q.status === 'complete';
            const isLocked = !isCurrent && !isComplete;

            return [
              index > 0 ? (
                <Connector key={`c${q.id}`} unlocked={quarters[index - 1].status === 'complete'} />
              ) : null,
              <li
                key={q.id}
                className="relative flex flex-col items-center rounded-[16px] border p-4 pt-6 text-center xl:mx-2"
                style={{
                  background: isCurrent
                    ? 'linear-gradient(180deg,#F0FDF4 0%,#FFFFFF 72%)'
                    : isLocked
                      ? '#EBEEF4'
                      : '#FFFFFF',
                  borderColor: isCurrent ? '#22C55E' : isLocked ? '#CFD6E4' : '#E8E5F2',
                  borderWidth: isCurrent ? 2 : 1,
                  boxShadow: isCurrent
                    ? '0 0 0 4px rgba(34,197,94,0.10), 0 8px 24px rgba(76,47,211,0.08)'
                    : isLocked
                      ? 'none'
                      : '0 8px 24px rgba(76,47,211,0.08)',
                }}
              >
                {isCurrent && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-[#22C55E] px-3 py-[3px] font-[Poppins] text-[9.5px] leading-none font-bold tracking-[0.08em] text-white uppercase">
                    Current
                  </span>
                )}
                {isLocked && (
                  <span
                    className="absolute -top-3.5 left-1/2 flex h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full border-[3px] border-white"
                    style={{ background: '#64748B' }}
                  >
                    <Icon name="lock" className="h-4 w-4 brightness-0 invert" />
                  </span>
                )}

                <p
                  className="font-[Poppins] text-[26px] leading-none font-bold"
                  style={{ color: isCurrent ? '#16A34A' : isLocked ? '#94A3B8' : '#111827' }}
                >
                  {q.code}
                </p>
                <p
                  className="mt-1.5 font-[Poppins] text-[12.5px] font-semibold"
                  style={{ color: isLocked ? '#7C879B' : '#4B5563' }}
                >
                  {q.title}
                </p>

                {/* A locked quarter shows a padlock, not its own illustration:
                    a greyed sprout still reads as "a sprout", a padlock reads
                    as "you cannot open this yet". */}
                <span className="my-3.5 flex h-[54px] w-[54px] items-center justify-center">
                  {isLocked ? (
                    <span
                      className="flex h-[52px] w-[52px] items-center justify-center rounded-2xl"
                      style={{ background: '#D5DBE7' }}
                    >
                      <Icon name="lock" className="h-7 w-7 opacity-70" />
                    </span>
                  ) : (
                    <Icon name={q.icon} className="h-[54px] w-[54px]" />
                  )}
                </span>

                <p
                  className="mt-auto font-[Poppins] text-[10.5px]"
                  style={{ color: isLocked ? '#94A3B8' : '#9CA3AF' }}
                >
                  {q.window}
                </p>

                {isCurrent ? (
                  <div className="mt-2.5 w-full">
                    <div className="h-2 w-full overflow-hidden rounded-full bg-[#DCFCE7]">
                      <div
                        className="h-full rounded-full bg-[#22C55E]"
                        style={{
                          width: `${q.percent}%`,
                          transition: 'width var(--motion-slow) var(--motion-ease)',
                        }}
                      />
                    </div>
                    <p className="mt-1.5 font-[Poppins] text-[10.5px] font-semibold text-[#16A34A]">
                      {q.percent}% Complete
                    </p>
                  </div>
                ) : isComplete ? (
                  <p className="mt-2.5 flex items-center justify-center gap-1.5 font-[Poppins] text-[10.5px] font-semibold text-[#16A34A]">
                    <Icon name="completedCheck" muted className="h-3.5 w-3.5" />
                    Complete
                  </p>
                ) : (
                  <span
                    className="mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-full py-1.5 font-[Poppins] text-[10px] font-bold tracking-[0.08em] text-white uppercase"
                    style={{ background: '#64748B' }}
                  >
                    <Icon name="lock" className="h-3 w-3 brightness-0 invert" />
                    Locked
                  </span>
                )}
              </li>,
            ];
          })}
        </ol>
      </div>
    </section>
  );
}
