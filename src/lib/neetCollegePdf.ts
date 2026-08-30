import {
  cheapestFee,
  formatRank,
  yearWiseRounds,
  type NEETCollege,
  type NEETPredictedCollege,
} from "@/api/neetCounselling";

/**
 * The downloadable medical-college list — a real table drawn from the API rows,
 * not a screenshot of the page.
 *
 * Same reasoning as the Mettle report (mettleReportPdf.ts): html2canvas cannot
 * render the oklch() colours Tailwind v4 emits, and a drawn table stays
 * selectable, searchable and a fraction of the size. Landscape A4 because eight
 * columns of college data do not fit a portrait page without shrinking the
 * names to nothing.
 *
 * In All-India mode the rows are grouped under a state band, so the file reads
 * as "every state, in order" rather than one 800-row wall.
 *
 * Each row carries a year-wise cutoff line underneath it — "2025 R1 3,164 Reference
 * · R2 7,370 Reference" — because a single closing rank hides both the round the
 * student would actually be admitted in and which figures came from an official
 * document rather than a scraped directory.
 */

type Pdf = import("jspdf").jsPDF;

export interface CollegeListPdfOptions {
  /** null = All India. */
  state: string | null;
  /**
   * "directory" is the browse list; "prediction" swaps the establishment year
   * for the chance verdict and titles the file as the student's own result.
   */
  mode?: "directory" | "prediction";
  /** Prediction only — printed under the title, e.g. "AIR 52,339 · General". */
  subtitle?: string;
  /** The directory's college-type filter, e.g. "All types" | "Government". */
  collegeType?: string;
  /** Search text that produced the list, if any. */
  query?: string;
  /** API total, which can exceed the rows fetched. */
  total?: number;
}

const INK = "#0E1629";
const BODY = "#334155";
const MUTED = "#7B8794";
const ACCENT = "#059669";
const DEEP = "#065f46";
const BAND = "#ecfdf5";
const RULE = "#e2e8f0";
const ZEBRA = "#f8fafc";

const rgb = (hex: string): [number, number, number] => {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

const mix = (from: string, to: string, t: number): [number, number, number] => {
  const [r1, g1, b1] = rgb(from);
  const [r2, g2, b2] = rgb(to);
  return [
    Math.round(r1 + (r2 - r1) * t),
    Math.round(g1 + (g2 - g1) * t),
    Math.round(b1 + (b2 - b1) * t),
  ];
};

interface Column {
  key: string;
  label: string;
  width: number;
  align?: "left" | "right";
}

/** Content width of a landscape A4 at a 36pt margin. Every layout adds to this. */
const TOTAL_W = 770;
/** Comfortable width for one right-aligned rank plus its header label. */
const SLOT_W = 46;
/** Floors that keep the columns the cutoff grid borrows from readable. */
const COLLEGE_MIN = 168;
const FEES_MIN = 84;

/**
 * Column widths, sized around however many round columns the data needs.
 *
 * The cutoff grid is laid out first and the College and Fees columns give up the
 * width for it, down to their floors; only if that is still not enough do the
 * round slots themselves narrow. Six rounds (R1..R4 plus Mop-up and Stray — the
 * whole vocabulary the API uses) still fit on the page.
 */
function columnsFor(mode: "directory" | "prediction", slots: number): Column[] {
  const cutoffLabel = "Closing rank";
  // slots already counts the Final column ahead of the round columns.
  let cutoff = CUTOFF_PAD + Math.max(1, slots) * SLOT_W;

  const fixed: Column[] =
    mode === "prediction"
      ? [
          { key: "n", label: "#", width: 22, align: "right" },
          { key: "city", label: "City", width: 70 },
          { key: "type", label: "Type", width: 66 },
          { key: "seats", label: "Seats", width: 36, align: "right" },
          { key: "chance", label: "Your chance", width: 80 },
        ]
      : [
          { key: "n", label: "#", width: 22, align: "right" },
          { key: "city", label: "City", width: 74 },
          { key: "type", label: "Type", width: 64 },
          { key: "seats", label: "Seats", width: 34, align: "right" },
          { key: "est", label: "Est.", width: 32, align: "right" },
        ];

  let college = mode === "prediction" ? 200 : 230;
  let fees = mode === "prediction" ? 110 : 120;
  const fixedW = fixed.reduce((n, c) => n + c.width, 0);

  let over = fixedW + cutoff + college + fees - TOTAL_W;
  if (over > 0) {
    const take = Math.min(over, college - COLLEGE_MIN);
    college -= take;
    over -= take;
  }
  if (over > 0) {
    const take = Math.min(over, fees - FEES_MIN);
    fees -= take;
    over -= take;
  }
  // Last resort: narrow the slots themselves. The rank font shrinks to match.
  if (over > 0) cutoff -= over;

  // Any slack left over goes back to the college names.
  college += TOTAL_W - (fixedW + cutoff + college + fees);

  const byKey: Record<string, Column> = {
    ...Object.fromEntries(fixed.map((c) => [c.key, c])),
    name: { key: "name", label: "College", width: college },
    cutoffs: { key: "cutoffs", label: cutoffLabel, width: cutoff },
    // The full label stops fitting once the cutoff grid has taken its width.
    fees: {
      key: "fees",
      label: fees >= 108 ? "Fees (approx. total)" : "Fees (approx.)",
      width: fees,
    },
  };

  const order =
    mode === "prediction"
      ? ["n", "name", "city", "type", "seats", "cutoffs", "chance", "fees"]
      : ["n", "name", "city", "type", "seats", "est", "cutoffs", "fees"];

  return order.map((k) => byKey[k]);
}

/** Years printed per college. Three is already a lot for a table row. */
const MAX_YEARS = 3;
/**
 * Round columns the cutoff cell can hold. Six covers the API's whole label
 * vocabulary (R1..R4, Mop-up, Stray); anything past that is named in the footer
 * rather than dropped without a word.
 */
const MAX_SLOTS = 6;
/** Left gutter inside the cutoff column, holding the year. */
const YEAR_W = 26;
/** Cell padding plus the year gutter — the part of the column not slots. */
const CUTOFF_PAD = 12 + YEAR_W;
/** Baseline step between one year's line and the next. */
const YEAR_STEP = 10;

/** Numbered rounds first and in order, then Mop-up, Stray and anything else. */
function roundRank(label: string): [number, string] {
  const n = Number(label.replace(/[^0-9]/g, ""));
  return Number.isFinite(n) && n > 0 ? [n, label] : [999, label];
}

/**
 * The round columns for the whole document, in one fixed order.
 *
 * The round labels live in the table header rather than beside every rank —
 * repeating "R1" on 800 rows steals the width the ranks need, and a six-figure
 * rank next to "Mop-up" does not fit in a slot at all. One shared column order
 * also means R2 sits under R2 all the way down the page.
 */
function roundColumns(years: ReturnType<typeof yearWiseRounds>[]): string[] {
  const labels = new Set<string>();
  for (const perCollege of years) {
    for (const yr of perCollege) for (const r of yr.rounds) labels.add(r.round);
  }
  return [...labels].sort((a, b) => {
    const [an, al] = roundRank(a);
    const [bn, bl] = roundRank(b);
    return an - bn || al.localeCompare(bl);
  });
}

/**
 * "Official state cutoff" is a provenance marker the API puts in the type field
 * for its official-cutoff rows. Spelled out it just ellipsises in the column.
 */
const typeText = (type: string): string =>
  /^official/i.test(type) ? "State cutoff" : type || "—";

/** The fee a student actually pays first, falling back to the raw string. */
function feeText(c: NEETCollege): string {
  const track = cheapestFee(c);
  if (track?.formatted_total) {
    return track.label ? `${track.formatted_total} · ${track.label}` : track.formatted_total;
  }
  return c.fees || "—";
}

export function buildCollegeListPdf(
  pdf: Pdf,
  colleges: NEETCollege[],
  opts: CollegeListPdfOptions,
): Pdf {
  const W = pdf.internal.pageSize.getWidth();
  const H = pdf.internal.pageSize.getHeight();
  const M = 36;
  const CW = W - M * 2;
  const FOOT = 30;
  const MODE = opts.mode ?? "directory";
  // Read the round data up front — the column widths are sized around it.
  const yearsFor = new Map(colleges.map((c) => [c, yearWiseRounds(c).slice(0, MAX_YEARS)]));
  const ALL_ROUNDS = roundColumns([...yearsFor.values()]);
  const ROUND_COLUMNS = ALL_ROUNDS.slice(0, MAX_SLOTS);
  /** Named in the footer rather than dropped without a word. */
  const OMITTED_ROUNDS = ALL_ROUNDS.slice(MAX_SLOTS);
  /** True when some college has more years than a table row can carry. */
  const YEARS_TRIMMED = colleges.some((c) => yearWiseRounds(c).length > MAX_YEARS);
  /** Tighter type once the slots get narrow, so ranks cannot touch. */
  const RANK_SIZE = ROUND_COLUMNS.length >= 5 ? 7 : 7.8;
  const SLOT_LABEL_SIZE = ROUND_COLUMNS.length >= 5 ? 6.6 : 7.4;

  // +1 for the Final column, which every college with any cutoff data fills.
  const COLUMNS = columnsFor(MODE, ROUND_COLUMNS.length + 1);
  // Grouping by state only helps a browse list that spans states.
  const ALL_INDIA = !opts.state && MODE === "directory";

  const date = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  /** Vertical gradient, drawn as slices — jsPDF has none of its own. */
  const gradient = (
    x: number,
    top: number,
    w: number,
    h: number,
    from: string,
    to: string,
    steps = 60,
  ) => {
    const sh = h / steps;
    for (let i = 0; i < steps; i += 1) {
      const [r, g, b] = mix(from, to, i / (steps - 1));
      pdf.setFillColor(r, g, b).rect(x, top + i * sh, w, sh + 0.7, "F");
    }
  };

  /**
   * jsPDF's built-in Helvetica is WinAnsi-encoded and has no rupee glyph — the
   * sign silently renders as junk, which on a fees column is worse than useless.
   */
  const clean = (text: string): string =>
    (text || "")
      .replace(/[₹\u20A8]/g, "Rs ")
      .replace(/[\u2011\u2012\u2013]/g, "-")
      .replace(/\s+/g, " ")
      .trim();

  const line = (text: string, size: number, style: string, width: number): string[] => {
    pdf.setFont("helvetica", style).setFontSize(size);
    return pdf.splitTextToSize(clean(text), width) as string[];
  };

  /** One line, ellipsised — table cells must never wrap sideways into a neighbour. */
  const fit = (text: string, size: number, style: string, width: number): string => {
    const value = clean(text) || "—";
    pdf.setFont("helvetica", style).setFontSize(size);
    if (pdf.getTextWidth(value) <= width) return value;
    let lo = 0;
    let hi = value.length;
    while (lo < hi) {
      const mid = Math.ceil((lo + hi) / 2);
      if (pdf.getTextWidth(`${value.slice(0, mid).trim()}…`) <= width) lo = mid;
      else hi = mid - 1;
    }
    return `${value.slice(0, lo).trim()}…`;
  };

  /**
   * The round grid for one college, drawn inside the cutoff column.
   *
   * `slots` is document-wide, not per-college, so R1 sits under R1 all the way
   * down the page and a college with a single round does not drift to the right
   * edge of the column. Ranks parsed from an authority's own document are set in
   * the deep green; the rest are plain.
   */
  /**
   * The cutoff grid for one college.
   *
   * The Final column comes first and is the one column every college with any
   * cutoff data fills — 39% of the directory has a closing rank and no round
   * breakdown at all, and without a shared anchor those rows floated in the
   * middle of the grid looking like a mistake. Rounds trail off to the right,
   * which is how a table is supposed to run out of data.
   *
   * `columns` is document-wide, so R2 sits under R2 all the way down the page.
   * Ranks parsed from an authority's own document are set in the deep green.
   */
  const drawCutoffs = (
    x: number,
    top: number,
    width: number,
    college: NEETCollege,
    years: ReturnType<typeof yearWiseRounds>,
    columns: string[],
  ) => {
    const slotW = (width - YEAR_W) / (columns.length + 1);

    // Final is the answer most readers want, so it carries the weight; the round
    // breakdown beside it is supporting detail and is set lighter. That also
    // stops Final repeating the last round from reading as a duplicate.
    const cell = (slot: number, ly: number, rank: number | null, verified: boolean) => {
      const primary = slot === 0;
      pdf.setFont("helvetica", primary ? "bold" : "normal").setFontSize(RANK_SIZE);
      pdf.setTextColor(verified ? DEEP : primary ? INK : BODY);
      pdf.text(formatRank(rank), x + YEAR_W + (slot + 1) * slotW - 4, ly, { align: "right" });
    };

    const year = (text: string, ly: number) => {
      pdf.setFont("helvetica", "bold").setFontSize(7.6).setTextColor(DEEP);
      pdf.text(text, x, ly);
    };

    // No round breakdown — the Final column still gets filled, in the same place
    // it sits for every other row.
    if (!years.length) {
      if (college.closing_rank === null || college.closing_rank === undefined) {
        pdf.setFont("helvetica", "normal").setFontSize(7.8).setTextColor(MUTED);
        pdf.text("—", x, top);
        return;
      }
      year(String(college.cutoff_year ?? "—"), top);
      cell(0, top, college.closing_rank, false);
      return;
    }

    years.forEach((yr, i) => {
      const ly = top + i * YEAR_STEP;
      year(yr.year || "—", ly);

      // The last round of a year is that year's final closing rank.
      const last = yr.rounds[yr.rounds.length - 1];
      if (last) cell(0, ly, last.closingRank, last.verified);

      for (const r of yr.rounds) {
        const k = columns.indexOf(r.round);
        // A round outside the shared column set is named in the footer instead.
        if (k === -1) continue;
        cell(k + 1, ly, r.closingRank, r.verified);
      }
    });
  };

  let y = 0;

  // ── Masthead, page 1 only ────────────────────────────────────────────────
  const HEAD = 104;
  gradient(0, 0, W, HEAD, "#047857", "#10b981", 70);

  pdf.setFont("helvetica", "bold").setFontSize(8).setTextColor("#a7f3d0");
  pdf.text("P R O C O U N S E L", M, 30);

  pdf.setFont("helvetica", "bold").setFontSize(20).setTextColor("#ffffff");
  const title =
    MODE === "prediction"
      ? "Your NEET College Prediction"
      : opts.state
        ? `MBBS & BDS Colleges — ${opts.state}`
        : "MBBS & BDS Colleges — All India";
  pdf.text(title, M, 58);

  const filters = [
    opts.subtitle?.trim() || null,
    opts.collegeType && opts.collegeType !== "All types" ? opts.collegeType : "All college types",
    opts.query?.trim() ? `Search: “${opts.query.trim()}”` : null,
    `${opts.total ?? colleges.length} colleges`,
  ]
    .filter(Boolean)
    .join("  ·  ");

  pdf.setFont("helvetica", "normal").setFontSize(9.5).setTextColor("#d1fae5");
  pdf.text(clean(filters), M, 76);

  pdf.setFont("helvetica", "normal").setFontSize(9).setTextColor("#a7f3d0");
  pdf.text(date, W - M, 30, { align: "right" });
  pdf.setFont("helvetica", "bold").setFontSize(9).setTextColor("#ffffff");
  pdf.text("procounsel.co.in/neet-college-predictor", W - M, 76, { align: "right" });

  y = HEAD + 24;

  // ── Table plumbing ───────────────────────────────────────────────────────
  const HEADER_H = 30;

  const columnX = (): number[] => {
    const xs: number[] = [];
    let x = M;
    for (const col of COLUMNS) {
      xs.push(x);
      x += col.width;
    }
    return xs;
  };
  const XS = columnX();

  /**
   * Two tiers: the column names, and under the cutoff column the round labels
   * that its cells are keyed to. Everything else is baseline-aligned to the
   * lower tier so the header reads as one row, not two.
   */
  const drawHeaderRow = () => {
    pdf.setFillColor(...rgb(ACCENT)).rect(M, y, CW, HEADER_H, "F");

    COLUMNS.forEach((col, i) => {
      const cx = col.align === "right" ? XS[i] + col.width - 6 : XS[i] + 6;

      if (col.key === "cutoffs") {
        pdf.setFont("helvetica", "bold").setFontSize(8.2).setTextColor("#ffffff");
        pdf.text(fit(col.label, 8.2, "bold", col.width - 12), cx, y + 12);

        const inner = col.width - 12;
        const slotW = (inner - YEAR_W) / (ROUND_COLUMNS.length + 1);
        pdf.setFont("helvetica", "bold").setFontSize(SLOT_LABEL_SIZE).setTextColor("#ffffff");
        pdf.text("Year", cx, y + 24);
        ["Final", ...ROUND_COLUMNS].forEach((label: string, k: number) => {
          pdf.text(
            fit(label, SLOT_LABEL_SIZE, "bold", slotW - 3),
            cx + YEAR_W + (k + 1) * slotW - 4,
            y + 24,
            { align: "right" },
          );
        });
        return;
      }

      pdf.setFont("helvetica", "bold").setFontSize(8.2).setTextColor("#ffffff");
      pdf.text(fit(col.label, 8.2, "bold", col.width - 12), cx, y + 19, {
        align: col.align === "right" ? "right" : "left",
      });
    });

    y += HEADER_H;
  };

  const newPage = () => {
    pdf.addPage();
    y = M;
    drawHeaderRow();
  };

  const room = (needed: number) => {
    if (y + needed > H - FOOT) newPage();
  };

  // ── Rows ─────────────────────────────────────────────────────────────────
  // A prediction is already ordered by fit — resorting it would destroy the
  // one thing that makes it a prediction.
  const sorted =
    MODE === "prediction"
      ? colleges
      : [...colleges].sort((a, b) =>
          ALL_INDIA && (a.state || "") !== (b.state || "")
            ? (a.state || "").localeCompare(b.state || "")
            : (a.name || "").localeCompare(b.name || ""),
        );

  drawHeaderRow();

  let currentState = "";
  let index = 0;
  let zebra = false;

  for (const c of sorted) {
    // State band — only useful when the file spans more than one state.
    if (ALL_INDIA && (c.state || "—") !== currentState) {
      currentState = c.state || "—";
      const count = sorted.filter((x) => (x.state || "—") === currentState).length;
      room(30 + 26);
      y += 8;
      pdf.setFillColor(...rgb(BAND)).rect(M, y, CW, 20, "F");
      pdf.setFillColor(...rgb(ACCENT)).rect(M, y, 3, 20, "F");
      pdf.setFont("helvetica", "bold").setFontSize(9.5).setTextColor(DEEP);
      pdf.text(currentState, M + 12, y + 13.5);
      pdf.setFont("helvetica", "normal").setFontSize(8.5).setTextColor(MUTED);
      pdf.text(`${count} college${count === 1 ? "" : "s"}`, W - M - 6, y + 13.5, {
        align: "right",
      });
      y += 20;
      zebra = false;
    }

    index += 1;

    const nameCol = COLUMNS[1];
    const nameLines = line(c.name || "—", 8.6, "bold", nameCol.width - 12).slice(0, 2);
    const years = yearsFor.get(c) ?? [];

    const rowH = Math.max(
      20,
      8 + nameLines.length * 10.5,
      6 + Math.max(1, years.length) * YEAR_STEP,
    );

    room(rowH);

    if (zebra) pdf.setFillColor(...rgb(ZEBRA)).rect(M, y, CW, rowH, "F");
    zebra = !zebra;

    pdf.setDrawColor(...rgb(RULE)).setLineWidth(0.4);
    pdf.line(M, y + rowH, M + CW, y + rowH);

    const baseline = y + 13;
    const cells: Record<string, string> = {
      n: String(index),
      city: c.city || "—",
      type: typeText(c.type),
      seats: c.seats || "—",
      est: c.established || "—",
      chance: (c as NEETPredictedCollege).chance || "—",
      fees: feeText(c),
    };

    COLUMNS.forEach((col, i) => {
      const cx = col.align === "right" ? XS[i] + col.width - 6 : XS[i] + 6;
      const align = col.align === "right" ? "right" : "left";

      if (col.key === "name") {
        pdf.setFont("helvetica", "bold").setFontSize(8.6).setTextColor(INK);
        nameLines.forEach((l, k) => pdf.text(l, cx, baseline + k * 10.5));
        return;
      }

      if (col.key === "cutoffs") {
        drawCutoffs(XS[i] + 6, baseline, col.width - 12, c, years, ROUND_COLUMNS);
        return;
      }

      const bold = col.key === "chance";
      pdf.setFont("helvetica", bold ? "bold" : "normal").setFontSize(8.2);
      pdf.setTextColor(col.key === "n" ? MUTED : bold ? DEEP : BODY);
      pdf.text(fit(cells[col.key], 8.2, bold ? "bold" : "normal", col.width - 12), cx, baseline, {
        align,
      });
    });

    y += rowH;
  }

  if (!sorted.length) {
    pdf.setFont("helvetica", "normal").setFontSize(10).setTextColor(MUTED);
    pdf.text("No colleges matched these filters.", M + 6, y + 22);
  }

  // ── Footers, stamped once the page count is known ───────────────────────
  const pages = pdf.getNumberOfPages();
  for (let p = 1; p <= pages; p += 1) {
    pdf.setPage(p);
    pdf.setDrawColor(...rgb(RULE)).setLineWidth(0.5);
    pdf.line(M, H - FOOT + 6, W - M, H - FOOT + 6);
    pdf.setFont("helvetica", "normal").setFontSize(7.2).setTextColor(MUTED);
    // Reserve the right-hand strip for the page number so the two never collide.
    const note = line(
      [
        "Each figure is that year’s closing rank in that counselling round; ranks in green come from an official counselling document.",
        OMITTED_ROUNDS.length ? `Rounds not shown here: ${OMITTED_ROUNDS.join(", ")}.` : null,
        YEARS_TRIMMED ? `Showing the latest ${MAX_YEARS} years for each college.` : null,
        "Compiled by ProCounsel from public data — indicative only, verify with the authority before acting on it.",
      ]
        .filter(Boolean)
        .join(" "),
      7.2,
      "normal",
      CW - 80,
    ).slice(0, 2);
    note.forEach((l, k) => pdf.text(l, M, H - FOOT + 17 + k * 8.5));

    pdf.setFont("helvetica", "bold").setFontSize(7.4).setTextColor(DEEP);
    pdf.text(`Page ${p} of ${pages}`, W - M, H - FOOT + 17, { align: "right" });
  }

  return pdf;
}

/** File name that reads as a document, not a dump. */
export function collegeListFileName(state: string | null, collegeType?: string): string {
  const scope = (state || "All-India").replace(/\s+/g, "-");
  const type = collegeType && collegeType !== "All types" ? `-${collegeType}` : "";
  return `ProCounsel-MBBS-Colleges-${scope}${type}.pdf`;
}

/** File name for the student's own predicted list. */
export function predictionFileName(rankLabel: string, rank: number | null): string {
  const tag = rank ? `${rankLabel.replace(/\s+/g, "-")}-${rank}` : "result";
  return `ProCounsel-NEET-Prediction-${tag}.pdf`;
}
