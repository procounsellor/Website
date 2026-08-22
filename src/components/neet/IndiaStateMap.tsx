import { useMemo } from "react";
import mapSvg from "@/assets/india-states.svg?raw";

/**
 * Clickable India map, one <path> per state, laid out like the reference build.
 *
 * Three deliberate choices, all of them performance:
 *
 *  1. The SVG is imported with `?raw`, so it is in the bundle and present on the
 *     very first render. Fetching it at runtime meant a visible delay, and the
 *     freshly injected paths had no fill for a frame — SVG defaults to black,
 *     which is what caused the flash on every mount.
 *  2. Fills, cursors and selection are pure CSS driven off `data-state` and one
 *     `data-selected` attribute on the host. Nothing walks the 36 paths writing
 *     inline styles, so changing state is a single attribute write.
 *  3. The generated stylesheet is memoised on `availableStates`, which only
 *     changes once, so selecting a state does not rebuild it.
 *
 * Each path carries `data-state` holding the state name exactly as
 * /api/v1/states spells it, so the caller passes it straight back to
 * `getNEETColleges({ state })` with no mapping table in between.
 *
 * The asset must depict India's official boundaries. Global datasets (Natural
 * Earth, OSM) draw the Line of Control instead, which omits PoK and Aksai Chin
 * — publishing that version is not legal in India.
 */

interface IndiaStateMapProps {
  /** States the API has colleges for. Others render muted and inert. */
  availableStates: string[];
  selected: string | null;
  onSelect: (state: string) => void;
  /** Optional per-state college counts, shown under the state name. */
  counts?: Record<string, number>;
  className?: string;
}

/**
 * Soft pastels cycled across states, matching the reference build. Assigned by
 * a stable hash of the state name rather than array position, so a state keeps
 * its colour even if the API reorders or adds one.
 */
const PALETTE = [
  "#f2a8a0",
  "#f3b8d0",
  "#a5d4c5",
  "#f6c48d",
  "#d8cba4",
  "#a9c8ea",
  "#f5e08e",
  "#b8dfe6",
  "#c9b6e4",
  "#b7dba1",
];

function stateColor(name: string): string {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return PALETTE[h % PALETTE.length];
}

/** State names are plain text, but never build a selector without escaping. */
const esc = (s: string) => s.replace(/["\\]/g, "\\$&");

export default function IndiaStateMap({
  availableStates,
  selected,
  onSelect,
  counts,
  className = "",
}: IndiaStateMapProps) {
  // Base sheet: one fill rule per state. Rebuilt only when the state list does.
  const baseCss = useMemo(
    () =>
      [
        ".pc-map path[data-state]{fill:#e6ecea;stroke:#fff;stroke-width:.7;outline:none;transition:opacity .16s ease,stroke-width .16s ease}",
        ".pc-map .state-code{fill:#42615a;font-weight:700;font-family:inherit;pointer-events:none;transition:opacity .16s ease}",
        ...availableStates.map(
          (s) =>
            `.pc-map path[data-state="${esc(s)}"]{fill:${stateColor(s)};cursor:pointer}`,
        ),
      ].join(""),
    [availableStates],
  );

  // Selection sheet: two rules, so picking a state is one small text update
  // rather than 36 inline-style writes.
  const selectedCss = useMemo(() => {
    if (!selected) return "";
    const s = esc(selected);
    return (
      `.pc-map[data-selected] path[data-state],.pc-map[data-selected] .state-code{opacity:.42}` +
      `.pc-map[data-selected] path[data-state="${s}"]{opacity:1;stroke-width:2.4}` +
      `.pc-map[data-selected] .state-code[data-state-label="${s}"]{opacity:1}`
    );
  }, [selected]);

  const onActivate = (target: EventTarget | null) => {
    const el = target as Element | null;
    if (!el || typeof el.closest !== "function") return;
    const name = (el.closest("[data-state]") as SVGPathElement | null)?.dataset?.state;
    if (name && availableStates.includes(name)) onSelect(name);
  };

  return (
    <div
      className={`relative min-h-[350px] overflow-hidden rounded-[22px] bg-[#eff7f3] p-3 sm:p-5 ${className}`}
    >
      <style>{baseCss + selectedCss}</style>

      {/* Caption, top-left — as on the reference build. */}
      <div className="pointer-events-none absolute left-5 top-5 z-10">
        <div className="text-[10px] font-bold uppercase tracking-[.16em] text-[#6e9990]">
          India · state view
        </div>
        <div className="mt-1 text-xs text-[#91aaa5]">Select a state to inspect colleges</div>
      </div>

      {/* One delegated listener; the SVG markup itself never changes. */}
      <div
        className="pc-map [&>svg]:mx-auto [&>svg]:mt-10 [&>svg]:h-[420px] [&>svg]:w-full [&>svg]:max-w-[430px]"
        data-selected={selected || undefined}
        onClick={(e) => onActivate(e.target)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onActivate(e.target);
          }
        }}
        dangerouslySetInnerHTML={{ __html: mapSvg }}
      />

      {/* Which state the directory is showing — bottom-left of the card. */}
      {selected && (
        <div className="pointer-events-none absolute bottom-5 left-5 z-10">
          <span className="block text-[10px] font-bold uppercase tracking-[.16em] text-[#6e9990]">
            Showing
          </span>
          <span className="block text-[18px] font-bold leading-tight text-[#1c403c]">
            {selected}
          </span>
          {counts?.[selected] ? (
            <span className="block text-xs text-[#6d8782]">{counts[selected]} colleges</span>
          ) : null}
        </div>
      )}

      {/* Real controls for keyboard and crawlers; the map is the visual UI.
          Also the only route to a state the map has no path for. */}
      <div className="sr-only">
        <h3>Select a state</h3>
        {[...availableStates]
          .sort((a, b) => a.localeCompare(b))
          .map((state) => (
            <button key={state} type="button" onClick={() => onSelect(state)}>
              {state}
            </button>
          ))}
      </div>
    </div>
  );
}
