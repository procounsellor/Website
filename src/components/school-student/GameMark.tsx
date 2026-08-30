import { TONE, toneFor } from '@/components/school-student/gameTones';

/**
 * One drawn mark per game.
 *
 * The supplied icon pack has a single controller glyph, so a rack built from it
 * is five identical cards with five different captions. These are drawn instead
 * — each one shows what the game actually asks you to do: pick an option, fill
 * a grid, uncover letters, name a flag, judge a claim. That is the difference
 * between a list and a shelf you want to reach into.
 *
 * Keyed by gameId first (the catalogue is small and named), then by engine, so
 * a new game the backend adds still gets a sensible mark rather than a blank.
 */

const marks: Record<string, (ink: string) => React.ReactNode> = {
  // Pick one of four — the answer rows, with the third one chosen.
  quiz: (ink) => (
    <>
      <rect x="8" y="10" width="32" height="7" rx="3.5" fill={ink} opacity="0.25" />
      <rect x="8" y="21" width="32" height="7" rx="3.5" fill={ink} opacity="0.25" />
      <rect x="8" y="32" width="32" height="7" rx="3.5" fill={ink} />
      <path
        d="M13 35.5 L16 38.5 L22 32.5"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
  // Nine cells, four of them already placed.
  sudoku: (ink) => (
    <>
      {[0, 1, 2].map((row) =>
        [0, 1, 2].map((col) => (
          <rect
            key={`${row}-${col}`}
            x={9 + col * 11}
            y={9 + row * 11}
            width="9"
            height="9"
            rx="2"
            fill={ink}
            opacity={[0, 4, 5, 8].includes(row * 3 + col) ? 1 : 0.22}
          />
        )),
      )}
    </>
  ),
  // Letter tiles, two revealed and two still blank.
  word_guess: (ink) => (
    <>
      <rect x="6" y="16" width="15" height="16" rx="3" fill={ink} />
      <rect x="24" y="16" width="15" height="16" rx="3" fill={ink} opacity="0.25" />
      <path d="M10.5 27 L13.5 20 L16.5 27 M11.4 25 h4.2" stroke="#FFFFFF" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path d="M28.5 26.5 h6" stroke={ink} strokeWidth="2.2" strokeLinecap="round" />
      <path d="M6 36 h33" stroke={ink} strokeWidth="2.4" strokeLinecap="round" opacity="0.45" />
    </>
  ),
  // Myth on the left, fact on the right — a cross and a tick.
  myth_fact: (ink) => (
    <>
      <rect x="5" y="12" width="17" height="23" rx="4" fill={ink} opacity="0.25" />
      <rect x="26" y="12" width="17" height="23" rx="4" fill={ink} />
      <path d="M10 19 l7 9 M17 19 l-7 9" stroke={ink} strokeWidth="2.4" strokeLinecap="round" />
      <path
        d="M30 24 l3.5 3.5 L40 20"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
  // A flag, mid-snap.
  flag_guess: (ink) => (
    <>
      <path d="M13 8 v33" stroke={ink} strokeWidth="3" strokeLinecap="round" />
      <path d="M13 11 h24 q-4 6 0 12 h-24 z" fill={ink} />
      <circle cx="13" cy="7" r="2.6" fill={ink} opacity="0.5" />
    </>
  ),
};

const byEngine: Record<string, string> = {
  quiz_mcq_v1: 'quiz',
  binary_card_v1: 'myth_fact',
  sudoku_v1: 'sudoku',
  word_guess_v1: 'word_guess',
};

export default function GameMark({
  gameId,
  engine,
  size = 48,
  className = '',
  surface,
}: {
  gameId: string;
  engine?: string;
  size?: number;
  className?: string;
  /** Override the tile's fill — the mark's own tint vanishes on a tinted head. */
  surface?: string;
}) {
  const tone = TONE[toneFor(gameId)];
  const key = marks[gameId] ? gameId : (byEngine[engine ?? ''] ?? 'quiz');

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-[14px] border ${className}`}
      style={{
        width: size,
        height: size,
        background: surface ?? tone.tint,
        borderColor: tone.edge,
      }}
    >
      <svg
        viewBox="0 0 48 48"
        aria-hidden
        style={{ width: size * 0.72, height: size * 0.72 }}
      >
        {marks[key](tone.ink)}
      </svg>
    </span>
  );
}
