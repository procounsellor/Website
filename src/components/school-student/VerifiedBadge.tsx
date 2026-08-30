/**
 * The verified mark.
 *
 * Drawn, not an emoji. `✅` renders as the platform's own green tick — the same
 * glyph people put in social-media display names — so it read as clout rather
 * than as a check ProCounsel actually performed. This is a quiet
 * check-in-a-disc that sits on the avatar's corner, which is where a credential
 * belongs: attached to the person, not appended to their name.
 *
 * Muted blue rather than green: green is the programme's "you completed
 * something" colour, and a buddy being verified is not the student's
 * achievement.
 */
export default function VerifiedBadge({
  size = 18,
  className = '',
}: {
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full ${className}`}
      style={{ width: size, height: size, background: '#FFFFFF' }}
      title="Verified by ProCounsel"
      aria-label="Verified"
      role="img"
    >
      <svg viewBox="0 0 24 24" style={{ width: size - 2, height: size - 2 }} aria-hidden>
        <circle cx="12" cy="12" r="11" fill="#2563EB" />
        <path
          d="M7.4 12.4 L10.4 15.3 L16.7 9"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
