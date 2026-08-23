import { Building2, MapPin, Users, CalendarDays, IndianRupee } from "lucide-react";
import {
  chanceToneClasses,
  cheapestFee,
  formatRank,
  splitDetail,
  type NEETCollege,
  type NEETPredictedCollege,
} from "@/api/neetCounselling";

/**
 * One college, used by both the public state directory and the (login-gated)
 * prediction results. The prediction variant adds the verdict chip, the fit
 * bar and the "why" line; everything else renders identically so the two
 * lists read as one product.
 *
 * The `detail` string always ends with the data's source and is always shown.
 * These are scraped cutoffs the API itself labels "verify before use", so
 * presenting them without provenance would overstate what we know.
 */

const TYPE_STYLES: Record<string, string> = {
  Government: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Private: "bg-indigo-50 text-indigo-700 ring-indigo-200",
  Deemed: "bg-violet-50 text-violet-700 ring-violet-200",
};

function isPredicted(c: NEETCollege | NEETPredictedCollege): c is NEETPredictedCollege {
  return typeof (c as NEETPredictedCollege).chance === "string";
}

export default function NEETCollegeCard({
  college,
}: {
  college: NEETCollege | NEETPredictedCollege;
}) {
  const predicted = isPredicted(college) ? college : null;
  const fee = cheapestFee(college);
  const { body, source } = splitDetail(college.detail || "");
  const rounds = college.rounds ? Object.entries(college.rounds) : [];
  const typeClass = TYPE_STYLES[college.type] ?? "bg-slate-100 text-slate-600 ring-slate-200";

  return (
    <article className="rounded-xl border border-slate-200 bg-white px-3.5 py-3 shadow-sm transition-shadow hover:shadow-md">
      {/* Title row */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-[14px] font-semibold leading-snug text-slate-900">
            {college.name}
          </h3>
          {(college.city || college.state) && (
            <p className="mt-0.5 flex items-center gap-1.5 text-[12px] text-slate-500">
              <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
              <span className="truncate">
                {[college.city, college.state].filter(Boolean).join(", ")}
              </span>
            </p>
          )}
        </div>

        {predicted && (
          <span
            className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ${chanceToneClasses(
              predicted.tone,
            )}`}
          >
            {predicted.chance}
          </span>
        )}
      </div>

      {/* Fit bar — only meaningful on a prediction */}
      {predicted && typeof predicted.fit_percent === "number" && (
        <div className="mt-2 flex items-center gap-2">
          <span className="text-[11px] font-medium text-slate-400">Fit</span>
          <div
            className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100"
            role="progressbar"
            aria-valuenow={predicted.fit_percent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Fit for ${college.name}`}
          >
            <div
              className="h-full rounded-full bg-emerald-500"
              style={{ width: `${Math.max(0, Math.min(100, predicted.fit_percent))}%` }}
            />
          </div>
          <span className="text-[11px] font-semibold tabular-nums text-slate-500">
            {predicted.fit_percent}%
          </span>
        </div>
      )}

      {/* Facts */}
      <dl className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px]">
        <div className="flex items-center gap-1.5">
          <Building2 className="h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden />
          <dt className="sr-only">Type</dt>
          <dd>
            <span className={`rounded px-1.5 py-0.5 text-[11px] font-medium ring-1 ${typeClass}`}>
              {college.type || "—"}
            </span>
          </dd>
        </div>

        {college.seats && (
          <div className="flex items-center gap-1.5 text-slate-600">
            <Users className="h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden />
            <dt className="sr-only">Seats</dt>
            <dd className="tabular-nums">{college.seats} seats</dd>
          </div>
        )}

        {college.established && (
          <div className="flex items-center gap-1.5 text-slate-600">
            <CalendarDays className="h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden />
            <dt className="sr-only">Established</dt>
            <dd className="tabular-nums">Estd {college.established}</dd>
          </div>
        )}

        {fee?.formatted_total && (
          <div className="flex items-center gap-1.5 text-slate-600">
            <IndianRupee className="h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden />
            <dt className="sr-only">Fees</dt>
            <dd>
              {fee.formatted_total}
              <span className="text-slate-400"> {fee.label.toLowerCase()}</span>
              {fee.approx && <span className="text-slate-400"> approx</span>}
            </dd>
          </div>
        )}
      </dl>

      {/* Cutoffs */}
      {(college.closing_rank !== null || rounds.length > 0) && (
        <div className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          {college.closing_rank !== null && (
            <p className="text-[12px] text-slate-700">
              Closing rank{" "}
              <span className="font-semibold tabular-nums">
                {formatRank(college.closing_rank)}
              </span>
            </p>
          )}
          {rounds.length > 0 && (
            <ul className="flex flex-wrap gap-x-2.5 gap-y-1">
              {rounds.map(([round, rank]) => (
                <li key={round} className="text-[11.5px] text-slate-500">
                  {round}{" "}
                  <span className="font-medium tabular-nums text-slate-700">
                    {formatRank(rank)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Why this came up */}
      {predicted?.why && (
        <p className="mt-2 text-[12px] font-medium text-slate-700">{predicted.why}</p>
      )}

      {/* Fee text when there is no structured track to show */}
      {!fee && college.fees && (
        <p className="mt-2 text-[12px] text-slate-600">{college.fees}</p>
      )}

      {/* Provenance — always present, deliberately quiet */}
      <details className="group mt-2">
        <summary className="cursor-pointer list-none text-[11px] text-slate-400 hover:text-slate-600">
          Source &amp; details
        </summary>
        {body && <p className="mt-1 text-[11px] leading-relaxed text-slate-500">{body}</p>}
        {source && (
          <p className="mt-1 text-[11px] leading-relaxed text-slate-400">
            {predicted?.official_cutoff?.sourceUrl ? (
              <a
                href={predicted.official_cutoff.sourceUrl}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="underline decoration-slate-300 underline-offset-2 hover:text-slate-600"
              >
                {source}
              </a>
            ) : (
              source
            )}
          </p>
        )}
      </details>
    </article>
  );
}
