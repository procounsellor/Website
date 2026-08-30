import GameMark from '@/components/school-student/GameMark';
import { TONE, toneFor } from '@/components/school-student/gameTones';
import { duration, scoringLabel, type Game } from '@/api/schoolGames';

/**
 * One game on the rack.
 *
 * Every value on this card comes off the API record — time limit, scoring,
 * pass mark, bonuses, hint penalty, attempts. None of it is written into the
 * front end, so retuning a game on the backend retunes what a student is told
 * here, and the two can never drift apart.
 *
 * The readout rows borrow the altimeter's voice: label in the mono caps face,
 * value in mono. A game's rules are numbers with units, and they are set like
 * numbers with units.
 */

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="ss-readout">
    <span className="ss-eyebrow text-[var(--neutral-400)]">{label}</span>
    <span className="ss-data text-[12.5px] text-[var(--ink)]">{value}</span>
  </div>
);

export default function GameCard({
  game,
  isToday = false,
  open = false,
  onToggle,
}: {
  game: Game;
  /** Marks the one game that is scheduled for today. */
  isToday?: boolean;
  /** Controlled by the page so "Rules" on today's card can open this one. */
  open?: boolean;
  onToggle?: (open: boolean) => void;
}) {
  const tone = TONE[toneFor(game.gameId)];

  const bonuses = [
    game.speedBonus ? `+${game.speedBonus} for finishing fast` : null,
    game.noMistakeBonus ? `+${game.noMistakeBonus} for a clean run` : null,
  ].filter(Boolean) as string[];

  /** What the game is worth, as a badge rather than a sentence. */
  const worth = game.pointsPerCorrect
    ? `+${game.pointsPerCorrect}/ANS`
    : game.solvePoints
      ? `+${game.solvePoints}`
      : null;

  return (
    <article
      id={`game-${game.gameId}`}
      className="ss-panel ss-lift relative flex h-full flex-col overflow-hidden scroll-mt-6"
      style={isToday ? { borderColor: tone.edge, boxShadow: `0 0 0 3px ${tone.tint}` } : undefined}
    >
      {/* A tinted head, so a rack of five reads as five games rather than five
          spec sheets. The tint is the only place the game's hue fills an area. */}
      <div
        className="relative flex items-start gap-3.5 p-5"
        style={{ background: tone.tint, borderBottom: `1px solid ${tone.edge}` }}
      >
        <GameMark gameId={game.gameId} engine={game.engine} size={54} surface="#FFFFFF" />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="ss-display text-[19px] leading-tight text-[var(--ink)]">{game.name}</h3>
            {worth && (
              <span
                className="ss-data shrink-0 rounded-full px-2.5 py-1 text-[11px] text-white"
                style={{ background: tone.ink }}
              >
                {worth}
              </span>
            )}
          </div>
          <p className="mt-1.5 font-[Poppins] text-[12.5px] leading-[1.55] text-[var(--neutral-600)]">
            {game.description}
          </p>
        </div>

        {isToday && (
          <span
            className="ss-eyebrow absolute top-0 right-0 rounded-bl-[12px] px-3 py-1.5 text-white"
            style={{ background: tone.ink }}
          >
            Today
          </span>
        )}
      </div>

      <div className="px-5 pt-3">
        <Row label="Time limit" value={duration(game.defaultTimeLimitSecs)} />
        <Row label="Scoring" value={scoringLabel(game)} />
        <Row label="To pass" value={`${game.passingPercent}%`} />
        <Row label="Attempts" value={game.oneAttemptPerDay ? 'Once a day' : 'Unlimited'} />
      </div>

      <details
        className="group mt-auto p-5 pt-4"
        open={open}
        onToggle={(event) => onToggle?.((event.currentTarget as HTMLDetailsElement).open)}
      >
        <summary
          className="ss-eyebrow flex cursor-pointer list-none items-center justify-between rounded-[10px] px-3 py-2.5 transition-colors"
          style={{ background: tone.tint, color: tone.ink }}
        >
          Full rules
          <span aria-hidden className="transition-transform group-open:rotate-180">
            ▾
          </span>
        </summary>

        <ul className="mt-3 space-y-2 font-[Poppins] text-[12px] leading-[1.55] text-[var(--neutral-600)]">
          <li className="flex gap-2">
            <span aria-hidden style={{ color: tone.ink }}>
              •
            </span>
            {scoringLabel(game)}.
          </li>
          {bonuses.map((bonus) => (
            <li key={bonus} className="flex gap-2">
              <span aria-hidden style={{ color: tone.ink }}>
                •
              </span>
              {bonus}.
            </li>
          ))}
          <li className="flex gap-2">
            <span aria-hidden style={{ color: tone.ink }}>
              •
            </span>
            {game.supportsHints
              ? `Hints are available, and each one costs ${game.hintPenalty} point${game.hintPenalty === 1 ? '' : 's'}.`
              : 'No hints — this one is on you.'}
          </li>
          <li className="flex gap-2">
            <span aria-hidden style={{ color: tone.ink }}>
              •
            </span>
            Score {game.passingPercent}% or more to pass{' '}
            {game.oneAttemptPerDay ? ', and you get one attempt a day' : ''}.
          </li>
        </ul>
      </details>
    </article>
  );
}
