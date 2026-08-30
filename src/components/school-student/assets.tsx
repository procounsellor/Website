import { NEUTRAL_ICONS, SCHOOL_ICONS, type NeutralIcon, type SchoolIcon } from './icons';

/** Decorative by default — these illustrations never carry meaning alone. */
export function Icon({
  name,
  className = 'h-5 w-5',
  alt = '',
  muted = false,
}: {
  name: SchoolIcon | NeutralIcon;
  className?: string;
  alt?: string;
  /** Prefer the grey version where one exists — the rail's resting state. */
  muted?: boolean;
}) {
  // Prefer the coloured pack; fall back to the neutral one for the glyphs only
  // the quiz kit ships (completed check, reward chest, quiz clipboard…).
  const src =
    (muted && name in NEUTRAL_ICONS) || !(name in SCHOOL_ICONS)
      ? NEUTRAL_ICONS[name as NeutralIcon]
      : SCHOOL_ICONS[name as SchoolIcon];

  return (
    <img
      src={src}
      alt={alt}
      aria-hidden={alt === '' ? true : undefined}
      className={className}
      draggable={false}
    />
  );
}
