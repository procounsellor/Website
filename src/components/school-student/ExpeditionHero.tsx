import { useEffect, useState } from 'react';
import type { DashboardView } from '@/lib/schoolStudentProgress';

/**
 * The sky follows the student's own clock.
 *
 * Four phases, picked from the local hour. It costs nothing — the same scene,
 * different stops — and it is the single cheapest thing that makes the page
 * feel alive to a fourteen-year-old: the mountain they open before school does
 * not look like the one they open after dinner.
 *
 * Each phase carries its own rock tint as well as its own sky, because a
 * mountain lit by a low sun is warm and the same mountain at midnight is not.
 * `light` is where the sun or moon sits, and every shading gradient points away
 * from it.
 */
type SkyPhase = {
  id: 'dawn' | 'day' | 'dusk' | 'night';
  label: string;
  sky: [string, string, string, string];
  /** Sun or moon: position, radius, fill, and the size of its halo. */
  light: { x: number; y: number; r: number; fill: string; halo: string; haloR: number };
  /** How visible the stars are, 0–1. */
  stars: number;
  rock: [string, string, string];
  /** The outline colour. Every silhouette is stroked with it. */
  ink: string;
  far: [string, string];
  mid: [string, string];
  mist: string;
  snow: string;
  /** How brightly the constellation route reads against this sky, 0–1. */
  route: number;
};

const PHASES: Record<SkyPhase['id'], SkyPhase> = {
  dawn: {
    id: 'dawn',
    label: 'Dawn',
    sky: ['#241A5E', '#4E3A92', '#9E6FA8', '#F3B489'],
    light: { x: 1010, y: 104, r: 28, fill: '#FFE7D6', halo: '#FF9E8A', haloR: 70 },
    stars: 0.3,
    rock: ['#5B4C9E', '#3E3272', '#2A2050'],
    ink: '#1A1140',
    far: ['#A896DE', '#8272BC'],
    mid: ['#7461B0', '#54448A'],
    mist: '#F6EEFF',
    snow: '#FFEFE2',
    /** How brightly the route reads against this sky. */
    route: 0.9,
  },
  day: {
    id: 'day',
    label: 'Daylight',
    sky: ['#2A72BE', '#5AA0D8', '#9BCBEC', '#DCEFF9'],
    light: { x: 980, y: 90, r: 30, fill: '#FFFBE8', halo: '#FFE9A8', haloR: 82 },
    stars: 0,
    /*
     * Blue-grey at the summits, green in the foothills. An alpine slope in
     * daylight is not one flat value, and the green is what stops the range
     * reading as a night silhouette somebody forgot to relight — which is
     * exactly what it was: these palettes were tuned for the night direction
     * and never brought back up when the scene went alpine.
     */
    rock: ['#6E9BBE', '#4E7E86', '#3A6B58'],
    ink: '#123448',
    far: ['#B6D0E6', '#96B6D4'],
    mid: ['#7EA6C2', '#5E86A4'],
    mist: '#FFFFFF',
    snow: '#FFFFFF',
    route: 1,
  },
  dusk: {
    id: 'dusk',
    label: 'Sunset',
    sky: ['#2A1046', '#6E2668', '#C4506A', '#F5A264'],
    light: { x: 1016, y: 112, r: 32, fill: '#FFE2C6', halo: '#FF7A47', haloR: 86 },
    stars: 0.22,
    rock: ['#7A4276', '#54265A', '#3A183E'],
    ink: '#2A0E30',
    far: ['#D298B4', '#AE7694'],
    mid: ['#9A5286', '#743A64'],
    mist: '#FFE6D4',
    snow: '#FFEADA',
    route: 0.95,
  },
  night: {
    id: 'night',
    label: 'Night',
    sky: ['#050320', '#0E0B34', '#1C1652', '#332876'],
    light: { x: 1010, y: 96, r: 30, fill: '#EEF2FF', halo: '#A9B6FF', haloR: 66 },
    stars: 1,
    rock: ['#2A2168', '#1A1348', '#0B0726'],
    ink: '#050220',
    far: ['#6A5EA6', '#4C4382'],
    mid: ['#3E3480', '#2A2360'],
    mist: '#C6BBF2',
    snow: '#DDE4FF',
    route: 1,
  },
};


/** 5–8 dawn, 8–16 day, 16–19 dusk, otherwise night. */
function phaseForHour(hour: number): SkyPhase {
  if (hour >= 5 && hour < 8) return PHASES.dawn;
  if (hour >= 8 && hour < 16) return PHASES.day;
  if (hour >= 16 && hour < 19) return PHASES.dusk;
  return PHASES.night;
}

/** Quarter hue, matching the accent each quarter already carries. */
const HUE: Record<string, string> = {
  green: '#22C55E',
  purple: '#A78BFA',
  blue: '#60A5FA',
  gold: '#FBBF24',
};




/* ── The range ────────────────────────────────────────────────────────────────
 * An alpine range that STEPS UP, not a lone peak.
 *
 * Two things this fixes. First, curves: every ridge is a smooth path through
 * control points rather than a polyline, because sharp vertices read as folded
 * paper no matter how they are coloured. Second, structure: a range gains
 * height across several summits with saddles between them, so the eye climbs
 * it. A single peak in the middle of the frame has nowhere to climb from — it
 * just stands there.
 *
 * The four stations sit on the four successive summits, which means "one
 * quarter, one peak" is literally true on the drawing.
 */

/**
 * A smooth path through a list of points (Catmull-Rom, expressed as cubics).
 *
 * Hand-guessing Bézier control points to hit a specific ridge silhouette is
 * where the earlier passes went wrong — the shapes were whatever the handles
 * happened to produce. This takes the peaks and saddles as plain coordinates,
 * which are reviewable, and derives the curve from them.
 */
const smoothPath = (points: readonly (readonly [number, number])[]): string => {
  let d = `M${points[0][0]} ${points[0][1]}`;
  for (let i = 0; i < points.length - 1; i += 1) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2[0]} ${p2[1]}`;
  }
  return d;
};

const closed = (points: readonly (readonly [number, number])[]): string =>
  `${smoothPath(points)} L1260 340 L-40 340 Z`;

/** Summits at 470, 620, 760 and 880 — each higher than the last. */
const NEAR_POINTS = [
  [-40, 336], [90, 308], [210, 290], [330, 272], [400, 258],
  [470, 224], [540, 252], [620, 196], [690, 224], [760, 158],
  [820, 186], [880, 96], [940, 152], [1010, 216], [1100, 268],
  [1190, 306], [1270, 336],
] as const;

const MID_POINTS = [
  [-40, 336], [110, 300], [240, 276], [360, 250], [470, 274],
  [580, 236], [700, 262], [820, 218], [930, 250], [1040, 226],
  [1150, 262], [1270, 240],
] as const;

const FAR_POINTS = [
  [-40, 320], [120, 268], [260, 292], [400, 240], [540, 268],
  [690, 224], [830, 256], [960, 208], [1090, 244], [1200, 206],
  [1270, 232],
] as const;

const BAND_NEAR = closed(NEAR_POINTS);
const BAND_MID = closed(MID_POINTS);
const BAND_FAR = closed(FAR_POINTS);

/**
 * A soft, waving snow line, closed upward off the top of the frame.
 *
 * Clipped to a ridge this gives snow the range's own shape — and at y=190 only
 * the top two summits break through it, which is what a snow line does.
 */
const smoothLine = (y: number, offsets: readonly number[]): string => {
  const step = 1300 / (offsets.length - 1);
  const points = offsets.map(
    (d, i) => [Math.round(-40 + i * step), Math.round(y + d)] as const,
  );
  return `${smoothPath(points)} L1260 -80 L-40 -80 Z`;
};

const NEAR_SNOW = [10, 0, 13, -4, 8, 0, 11, -6, 4, -2, 9, 4, 13, 0, 9, 5, 13];

/** The route traverses the ridge, just below the crest. */
const TRAIL_POINTS = [
  [400, 270], [470, 236], [540, 262], [620, 208], [690, 236],
  [760, 170], [820, 198], [880, 108],
] as const;

const BAND_TRAIL = smoothPath(TRAIL_POINTS);

/** One station per summit. */
const BAND_CAMPS: readonly (readonly [number, number])[] = [
  [470, 228],
  [620, 200],
  [760, 162],
  [880, 100],
];

const BAND_STARS = [
  [86, 44, 1.4], [206, 70, 1.1], [318, 36, 1.6], [420, 66, 1.2],
  [536, 30, 1.5], [660, 56, 1.3], [790, 34, 1.4], [920, 48, 1.2],
  [1050, 30, 1.3], [1160, 62, 1.5], [146, 104, 1], [700, 108, 1.1],
  [1010, 96, 1.1], [268, 132, 1],
] as const;

/**
 * A drifting cloud.
 *
 * `transform-box: view-box` (in the stylesheet) is what lets it cross the whole
 * sky: a percentage transform on an SVG group resolves against that group's own
 * bounding box, so a 120-unit cloud would travel 120 units and stop.
 */
const Cloud = ({
  y,
  scale,
  opacity,
  seconds,
  delay,
}: {
  y: number;
  scale: number;
  opacity: number;
  seconds: number;
  delay: number;
}) => (
  <g className="ss-cloud" style={{ animationDuration: `${seconds}s`, animationDelay: `-${delay}s` }}>
    <g transform={`translate(0 ${y}) scale(${scale})`} fill="#FFFFFF" opacity={opacity}>
      <ellipse cx="64" cy="30" rx="66" ry="17" />
      <ellipse cx="36" cy="22" rx="26" ry="20" />
      <ellipse cx="66" cy="14" rx="34" ry="25" />
      <ellipse cx="100" cy="24" rx="24" ry="17" />
    </g>
  </g>
);

export default function ExpeditionHero({
  view,
  firstName,
  grade,
}: {
  view: DashboardView;
  firstName: string;
  /** The student's class, shown as the expedition's label. Null when unknown. */
  grade: string | null;
}) {
  // The sky follows the clock, and re-checks every few minutes so a tab left
  // open through sunset actually gets dark.
  const [phase, setPhase] = useState(() => phaseForHour(new Date().getHours()));
  useEffect(() => {
    const tick = setInterval(() => setPhase(phaseForHour(new Date().getHours())), 5 * 60_000);
    return () => clearInterval(tick);
  }, []);

  const percent = Math.max(0, Math.min(100, view.overallPercent));
  const nextCamp = view.quarters.find((q) => q.status !== 'complete');

  return (
    /*
     * A band, not a landscape.
     *
     * Earlier passes made the mountain the whole hero — full-bleed, 470px tall,
     * with the copy floating on top of it. That put an illustration in the one
     * position on the page that should belong to the student's own name and
     * their next action, and it meant every flaw in the drawing was rendered at
     * poster size.
     *
     * The reference this was built from had it right: a small range sitting
     * behind the content, doing its job at a size where it reads as a motif
     * rather than as artwork. The four camps still sit on it, so the metaphor
     * survives; it just stops shouting. The quarter cards below carry the real
     * detail.
     */
    <section
      className="relative isolate min-h-[320px] overflow-hidden rounded-[24px] sm:min-h-[340px] lg:min-h-[360px]"
      data-phase={phase.id}
      style={{
        background: `linear-gradient(115deg, ${phase.sky[0]} 0%, ${phase.sky[1]} 46%, ${phase.sky[2]} 82%, ${phase.sky[3]} 100%)`,
        transition: 'background var(--motion-slow) var(--motion-ease)',
        boxShadow: '0 18px 44px -26px rgba(11,5,38,0.8)',
      }}
    >
      <svg
        viewBox="0 0 1200 320"
        preserveAspectRatio="xMaxYMax slice"
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full"
      >
        <defs>
          <linearGradient id="ss-b-far" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={phase.far[0]} />
            <stop offset="100%" stopColor={phase.far[1]} />
          </linearGradient>
          <linearGradient id="ss-b-mid" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={phase.mid[0]} />
            <stop offset="100%" stopColor={phase.mid[1]} />
          </linearGradient>
          <linearGradient id="ss-b-near" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={phase.rock[0]} />
            <stop offset="62%" stopColor={phase.rock[1]} />
            <stop offset="100%" stopColor={phase.rock[2]} />
          </linearGradient>
          {/* One light direction across the whole massif, as a gradient rather
              than as facet polygons — facets leave a hard seam running down from
              the summit, which reads as a rendering fault rather than as rock. */}
          <linearGradient id="ss-b-light" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#000000" stopOpacity="0.3" />
            <stop offset="52%" stopColor="#000000" stopOpacity="0.06" />
            <stop offset="78%" stopColor="#FFFFFF" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.12" />
          </linearGradient>
          <filter id="ss-b-haze" x="-20%" y="-300%" width="140%" height="700%">
            <feGaussianBlur stdDeviation="9" />
          </filter>
          <clipPath id="ss-b-clip-near">
            <path d={BAND_NEAR} />
          </clipPath>
        </defs>

        {/* Moon or sun, low and behind the ranges so they occlude it — that
            occlusion is most of what reads as depth. */}
        <circle cx="1168" cy="48" r="26" fill={phase.light.halo} opacity="0.2" />
        <circle cx="1168" cy="48" r="15" fill={phase.light.fill} opacity="0.9" />

        <g fill="#FFFFFF" opacity={phase.stars}>
          {BAND_STARS.map(([x, y, r]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r={r} opacity="0.8" />
          ))}
        </g>

        <Cloud y={34} scale={0.9} opacity={0.13} seconds={150} delay={0} />
        <Cloud y={82} scale={0.6} opacity={0.1} seconds={104} delay={58} />
        <Cloud y={16} scale={0.42} opacity={0.16} seconds={186} delay={120} />

        {/* Far range — low contrast is what makes it read as distance. */}
        <path d={BAND_FAR} fill="url(#ss-b-far)" opacity="0.8" />

        {/* Valley mist in the range gaps: the cheapest depth cue there is, and
            the one that stops the ridges looking like stickers. */}
        <ellipse cx="850" cy="240" rx="340" ry="12" fill={phase.mist} opacity="0.22" filter="url(#ss-b-haze)" />

        <path d={BAND_MID} fill="url(#ss-b-mid)" opacity="0.92" />

        <ellipse cx="620" cy="262" rx="420" ry="9" fill={phase.mist} opacity="0.12" filter="url(#ss-b-haze)" />

        {/* The massif the stations climb. */}
        <path d={BAND_NEAR} fill="url(#ss-b-near)" />
        <g clipPath="url(#ss-b-clip-near)">
          <rect x="-20" y="-40" width="1260" height="340" fill="url(#ss-b-light)" />
          <path d={smoothLine(158, NEAR_SNOW)} fill={phase.snow} opacity="0.94" />
        </g>
        {/* Rim light. The sun is up and to the right, so the ridge line catches
            it while the face stays dark — one stroke does more for "this is a
            mountain" than any amount of fill shading. */}
        <path
          d={BAND_NEAR}
          fill="none"
          stroke={phase.light.fill}
          strokeOpacity="0.3"
          strokeWidth="1.8"
        />

        {/* The route, and the four camps on it. */}
        <path
          d={BAND_TRAIL}
          pathLength={100}
          fill="none"
          stroke="#FFFFFF"
          strokeOpacity="0.72"
          strokeWidth="3.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="3 5"
        />
        {percent > 0 && (
          <path
            className="ss-trail-progress"
            d={BAND_TRAIL}
            pathLength={100}
            fill="none"
            stroke="#FBBF24"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="100"
            style={
              {
                '--dash-from': '100',
                '--dash-to': String(100 - percent),
                strokeDashoffset: 100 - percent,
              } as React.CSSProperties
            }
          />
        )}

        {view.quarters.map((quarter, index) => {
          const point = BAND_CAMPS[index];
          const hue = HUE[quarter.accent] ?? '#A78BFA';
          const locked = quarter.status === 'locked';
          const live = quarter.status === 'current';
          const done = quarter.status === 'complete';
          return (
            <g key={quarter.id} transform={`translate(${point[0]} ${point[1]})`}>
              {/*
               * The stations were 10px dots in the quarter's own hue, sitting on
               * dark rock — a green dot on a navy mountain is not a legible
               * marker, and the locked ones were near-invisible. So: every
               * station is a WHITE disc with the hue as a ring, which reads
               * against any phase of the sky, and the code is spelled out rather
               * than abbreviated to a bare digit.
               */}
              {live && <circle className="ss-beacon" r="19" fill={hue} />}
              <circle r="16" fill="#0B0628" fillOpacity="0.55" />
              <circle
                r="15"
                fill={locked ? '#E7EAF3' : '#FFFFFF'}
                stroke={locked ? '#94A3B8' : hue}
                strokeWidth={live ? 4 : 3}
              />
              <text
                textAnchor="middle"
                y="4.5"
                fontSize="12.5"
                fill={locked ? '#64748B' : '#141033'}
                style={{ fontFamily: 'var(--font-data)', fontWeight: 700 }}
              >
                {quarter.code}
              </text>

              {/* State, as a badge on the shoulder — a tick when it is behind
                  you, a padlock when it is not open yet. */}
              {(done || locked) && (
                <g transform="translate(11 -11)">
                  <circle r="7" fill={done ? '#16A34A' : '#64748B'} stroke="#FFFFFF" strokeWidth="2" />
                  {done ? (
                    <path
                      d="M-3 0.2 L-0.8 2.5 L3.2 -2.2"
                      fill="none"
                      stroke="#FFFFFF"
                      strokeWidth="1.9"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  ) : (
                    <>
                      <path
                        d="M-2.2 -0.9 v-1.3 a2.2 2.2 0 0 1 4.4 0 v1.3"
                        fill="none"
                        stroke="#FFFFFF"
                        strokeWidth="1.3"
                        strokeLinecap="round"
                      />
                      <rect x="-2.9" y="-0.9" width="5.8" height="4.4" rx="1.2" fill="#FFFFFF" />
                    </>
                  )}
                </g>
              )}
            </g>
          );
        })}

      </svg>

      {/*
       * The scrim darkens both edges and leaves the middle alone, because the
       * content now sits on both sides with the peak between them. A one-sided
       * wash would have left the readout floating on bare sky.
       */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(90deg, rgba(6,3,20,0.82) 0%, rgba(6,3,20,0.55) 26%, rgba(6,3,20,0) 46%, rgba(6,3,20,0) 58%, rgba(6,3,20,0.5) 78%, rgba(6,3,20,0.78) 100%)',
        }}
      />

      <div className="relative flex flex-wrap items-start justify-between gap-6 p-5 sm:p-7">
        <div className="max-w-[23rem]">
          <p className="ss-eyebrow text-white/60">
            {grade ? `Class ${grade} expedition` : 'Your expedition'}
          </p>
          <h1 className="ss-display mt-2 text-[26px] leading-[1.05] text-white sm:text-[32px]">
            Welcome back, {firstName}!
          </h1>
          <p className="mt-2 max-w-[20rem] font-[Poppins] text-[13px] leading-relaxed text-white/70">
            {nextCamp
              ? `Next up is ${nextCamp.code} — ${nextCamp.title.toLowerCase()}.`
              : 'Every camp is behind you. The summit is yours.'}
          </p>

          <ul className="mt-4 flex flex-wrap gap-2">
            {[
              { glyph: '🛡️', label: `Level ${view.level.level}`, value: view.level.name },
              {
                glyph: '🔥',
                label: 'Streak',
                value: `${view.streakDays} ${view.streakDays === 1 ? 'day' : 'days'}`,
              },
            ].map((chip) => (
              <li
                key={chip.label}
                className="flex items-center gap-2 rounded-full border border-white/20 py-1.5 pr-3.5 pl-2.5 backdrop-blur-md"
                style={{ background: 'rgba(10, 5, 30, 0.55)' }}
              >
                <span aria-hidden className="text-[13px]">
                  {chip.glyph}
                </span>
                <span className="ss-eyebrow text-white/50">{chip.label}</span>
                <span className="ss-data text-[12px] text-white">{chip.value}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* The altimeter, on the far side of the peak. */}
        <div
          className="w-full min-w-[16.5rem] max-w-[20rem] rounded-2xl border border-white/20 p-4.5 backdrop-blur-md sm:w-auto"
          style={{ background: 'rgba(10, 5, 30, 0.55)' }}
        >
          <p className="ss-eyebrow text-white/55">Altitude</p>
          <p className="ss-data mt-1.5 text-[24px] leading-none text-white">
            {view.points.toLocaleString('en-IN')}
            <span className="ml-1 text-[12px] text-white/50">
              / {view.pointsTarget.toLocaleString('en-IN')}
            </span>
          </p>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/15">
            <div
              className="h-full rounded-full bg-[#FBBF24]"
              style={{
                width: `${Math.min(100, Math.round((view.points / view.pointsTarget) * 100))}%`,
                transition: 'width var(--motion-slow) var(--motion-ease)',
              }}
            />
          </div>

          {view.nextLevel ? (
            <>
              <div className="mt-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <span className="ss-eyebrow text-white/45">Level {view.nextLevel.level}</span>
                <span className="ss-data text-[11px] text-white/70">
                  {(view.nextLevel.minPoints - view.points).toLocaleString('en-IN')} to go
                </span>
              </div>
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-white/15">
                <div
                  className="h-full rounded-full bg-[#4ADE80]"
                  style={{
                    width: `${view.levelPercent}%`,
                    transition: 'width var(--motion-slow) var(--motion-ease)',
                  }}
                />
              </div>
            </>
          ) : (
            <p className="mt-3 font-[Poppins] text-[11.5px] text-white/65">
              Top level reached — {view.level.name}.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
