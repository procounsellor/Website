import { formatRank, yearWiseRounds, type NEETCollege } from "@/api/neetCounselling";

/**
 * Closing ranks for one college, read from `year_wise_rounds`.
 *
 * A single closing rank is the wrong unit for this decision — it is only ever
 * the *last* round's number, and a student choosing between colleges needs to
 * see the whole slide from R1 down. So the round strip is the primary display
 * and there is no separate headline rank.
 *
 * Only about a quarter of the directory has a round breakdown today; another
 * 40% has one bare closing rank. Both shapes render as the same strip — year
 * chip, then labelled cells — so a list mixing them reads as one table rather
 * than two different components.
 *
 * Provenance is deliberately not spelled out per round: labelling every figure
 * "Reference" buried the numbers. Verified ranks (parsed from a counselling
 * authority's own document) are simply set in emerald with the source on hover.
 */

interface Cell {
  label: string;
  rank: number | null;
  verified: boolean;
  title?: string;
}

export default function NEETRoundCutoffs({
  college,
  className = "",
}: {
  college: NEETCollege;
  className?: string;
}) {
  const years = yearWiseRounds(college);

  const rows: { year: string; cells: Cell[] }[] = years.length
    ? years.map((yr) => ({
        year: yr.year,
        cells: yr.rounds.map((r) => ({
          label: r.round,
          rank: r.closingRank,
          verified: r.verified,
          title: r.sourceLabel ?? undefined,
        })),
      }))
    : college.closing_rank === null || college.closing_rank === undefined
      ? []
      : [
          {
            year: String(college.cutoff_year ?? ""),
            // No round breakdown at all — one cell, labelled for what it is.
            cells: [{ label: "Closing", rank: college.closing_rank, verified: false }],
          },
        ];

  if (!rows.length) return null;

  return (
    <div className={className}>
      <p className="text-[10.5px] font-semibold uppercase tracking-wide text-slate-500">
        {years.length ? "Closing rank by round" : "Closing rank"}
      </p>

      <div className="mt-1.5 space-y-1.5">
        {rows.map((row) => (
          <div
            key={row.year}
            className="flex items-stretch gap-1.5 rounded-lg bg-slate-50 p-1 ring-1 ring-slate-200/70"
          >
            {row.year && (
              <span
                title={`${row.year} counselling`}
                className="grid shrink-0 place-items-center rounded-md bg-white px-2 text-[11px] font-bold tabular-nums text-slate-700 ring-1 ring-slate-300"
              >
                {row.year}
              </span>
            )}
            <div className="flex min-w-0 flex-1 divide-x divide-slate-200">
              {row.cells.map((c) => (
                <div
                  key={c.label}
                  title={c.title}
                  // A lone cell must not stretch across the whole strip — it
                  // reads as a missing column. Two or more split the width.
                  className={`min-w-0 px-1.5 text-center ${
                    row.cells.length > 1 ? "flex-1 basis-0" : "w-24"
                  }`}
                >
                  <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                    {c.label}
                  </div>
                  <div
                    className={`truncate text-[12.5px] font-semibold tabular-nums ${
                      c.verified ? "text-emerald-700" : "text-slate-800"
                    }`}
                  >
                    {formatRank(c.rank)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
