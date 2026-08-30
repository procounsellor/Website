import { Link } from 'react-router-dom';
import { Icon } from '@/components/school-student/assets';
import type { QuestView } from '@/lib/schoolStudentProgress';

/**
 * One quest.
 *
 * Same anatomy as a camp card, one level down: white surface, a 3px hue rule
 * across the top, and the accent used nowhere else except the action. The
 * previous pass tinted the whole card, the icon tile, the title and the button
 * in the quest's colour, which is what made three cards in a row read as three
 * unrelated adverts.
 *
 * A card is only ever a link when its quest has a real destination — a locked
 * or unbuilt quest renders as a <div>, so it can never send a student to a
 * route that does not exist yet.
 */

const HUE: Record<string, string> = {
  green: '#16A34A',
  blue: '#2563EB',
  purple: '#5A38E8',
  gold: '#B45309',
};

export default function QuestCard({ quest }: { quest: QuestView }) {
  const hue = HUE[quest.accent] ?? '#5A38E8';
  const isOpen = quest.status === 'available' && Boolean(quest.to);
  const isDone = quest.status === 'done';
  const isBlocked = quest.status === 'locked' || quest.status === 'soon';

  const chipLabel = isDone
    ? 'COMPLETED'
    : isBlocked
      ? quest.status === 'soon'
        ? 'COMING SOON'
        : 'LOCKED'
      : 'UNLOCKED';

  const body = (
    <>
      <div className="flex items-start justify-between gap-3">
        <span
          className="relative flex h-12 w-12 items-center justify-center rounded-[13px] border"
          style={{
            background: isBlocked ? '#E4E8F0' : '#FFFFFF',
            borderColor: isBlocked ? '#D3D9E4' : 'var(--card-border)',
          }}
        >
          <Icon
            name={quest.icon}
            className={`h-7 w-7 ${isBlocked ? 'opacity-35 grayscale' : ''}`}
          />
          {isBlocked && (
            <span
              className="absolute -right-1.5 -bottom-1.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white"
              style={{ background: 'var(--slate-ink)' }}
            >
              <Icon name="lock" className="h-3 w-3 brightness-0 invert" />
            </span>
          )}
        </span>

        <span
          className="ss-eyebrow flex items-center gap-1 rounded-full px-2.5 py-1"
          style={
            isBlocked
              ? { background: 'var(--slate-ink)', color: '#FFFFFF' }
              : isDone
                ? { background: '#DCFCE7', color: '#16A34A' }
                : { background: '#F2EFFF', color: hue }
          }
        >
          {isBlocked && <Icon name="lock" className="h-2.5 w-2.5 brightness-0 invert" />}
          {chipLabel}
        </span>
      </div>

      <h3
        className="ss-display mt-4 text-[17px] leading-tight"
        style={{ color: isBlocked ? '#7C879B' : 'var(--ink)' }}
      >
        {quest.title}
      </h3>
      <p
        className="mt-1.5 font-[Poppins] text-[12.5px] leading-[1.55]"
        style={{ color: isBlocked ? '#8A94A6' : 'var(--neutral-500)' }}
      >
        {quest.description}
      </p>

      <div className="mt-auto">
        {!isBlocked ? (
          <>
            <div className="ss-readout mt-4">
              <span className="ss-eyebrow text-[var(--neutral-400)]">Reward</span>
              <span className="ss-data text-[12.5px]" style={{ color: hue }}>
                +{quest.points} PTS
              </span>
            </div>

            {quest.percent > 0 && (
              <div className="mt-3">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#EEF0F6]">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${quest.percent}%`,
                      background: hue,
                      transition: 'width var(--motion-slow) var(--motion-ease)',
                    }}
                  />
                </div>
                <p className="ss-data mt-1.5 text-[10.5px]" style={{ color: hue }}>
                  {quest.percent}% DONE
                </p>
              </div>
            )}

            <span
              className="ss-go mt-4 h-11 w-full text-[13.5px]"
              style={isDone ? { background: 'linear-gradient(135deg,#16A34A 0%,#15803D 100%)' } : undefined}
            >
              {isDone ? 'Completed' : (quest.cta ?? 'Start')}
              {!isDone && <span aria-hidden>→</span>}
            </span>
          </>
        ) : (
          <div className="mt-5 flex flex-col items-center gap-2.5 rounded-[12px] bg-[#E4E8F0] px-3 py-4 text-center">
            <span
              className="flex h-11 w-11 items-center justify-center rounded-full"
              style={{ background: 'var(--slate-ink)' }}
            >
              <Icon name="lock" className="h-5 w-5 brightness-0 invert" />
            </span>
            <p className="font-[Poppins] text-[11.5px] leading-[1.5] font-medium text-[#5A6678]">
              {quest.status === 'soon'
                ? "We're building this one — it'll appear here when it's ready."
                : (quest.lockedHint ?? `Finish more of Q${quest.quarter} to unlock this.`)}
            </p>
          </div>
        )}
      </div>
    </>
  );

  const shell = 'ss-panel relative flex h-full flex-col overflow-hidden p-5';
  const rule = (
    <span
      aria-hidden
      className="absolute inset-x-0 top-0 h-[3px]"
      style={{ background: isBlocked ? '#CBD3E3' : hue }}
    />
  );

  if (!isOpen) {
    return (
      <div
        className={shell}
        style={
          isBlocked
            ? { background: 'var(--slate-surface)', borderColor: 'var(--slate-border)', boxShadow: 'none' }
            : undefined
        }
      >
        {rule}
        {body}
      </div>
    );
  }

  return (
    <Link to={quest.to!} className={`${shell} ss-lift`}>
      {rule}
      {body}
    </Link>
  );
}
