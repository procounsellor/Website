import type { ReactNode } from 'react';

/**
 * The short version of the ridge, for every page that is not the dashboard.
 *
 * Same sky, same rock, a fraction of the height — so a student always knows
 * they are still inside the expedition, and no page has to invent its own
 * header treatment. The dashboard keeps the full scene; nothing else competes
 * with it.
 */
export default function SkyBanner({
  eyebrow,
  title,
  lead,
  aside,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  /** Optional readout pinned to the right — a date, a count, a state. */
  aside?: ReactNode;
}) {
  return (
    <section className="ss-sky relative isolate overflow-hidden">
      <svg
        viewBox="0 0 1200 220"
        preserveAspectRatio="xMidYMax slice"
        aria-hidden
        className="absolute inset-0 h-full w-full"
      >
        <defs>
          <radialGradient id="ss-banner-sun" cx="0.72" cy="0.95" r="0.6">
            <stop offset="0%" stopColor="#FFD9A0" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#F7B267" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect x="0" y="40" width="1200" height="180" fill="url(#ss-banner-sun)" />
        <path
          d="M0 220 L110 150 L200 186 L300 128 L400 178 L500 140 L620 196 L740 132 L860 184 L980 142 L1090 190 L1200 156 L1200 220 Z"
          fill="#4A2F9E"
          opacity="0.55"
        />
        <path
          d="M0 220 L150 168 L260 206 L380 150 L520 200 L640 162 L780 212 L900 158 L1040 202 L1160 166 L1200 184 L1200 220 Z"
          fill="#1C0F4A"
          opacity="0.85"
        />
      </svg>

      <div className="relative flex flex-wrap items-end justify-between gap-4 p-5 sm:p-7">
        <div className="max-w-[34rem]">
          <p className="ss-eyebrow text-white/60">{eyebrow}</p>
          <h1 className="ss-display mt-2 text-[26px] leading-[1.06] text-white sm:text-[34px]">
            {title}
          </h1>
          {lead && (
            <p className="mt-2 font-[Poppins] text-[13px] leading-relaxed text-white/70">{lead}</p>
          )}
        </div>
        {aside}
      </div>
    </section>
  );
}
