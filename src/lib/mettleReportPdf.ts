/**
 * The saved Mettle career report, drawn from the report DATA rather than
 * screenshotting the page.
 *
 * Screenshotting was the obvious route and it does not work: html2canvas dates
 * from 2022 and throws on the `oklch()` colours Tailwind v4 emits, before it
 * ever reaches the upload. Drawing from data sidesteps CSS entirely, produces a
 * file a fraction of the size, keeps the text selectable and searchable, and
 * cannot break again the next time the stylesheet changes.
 */
export interface CareerPath { title: string; field: string; fitScore: number; description: string; whyYouFit: string; keySkills: string[]; steps: string[]; }
export interface Strength    { name: string; score: number; description: string; }
export interface DevArea     { name: string; tip: string; }
export interface Report      { personalityType: string; personalityTagline: string; overallProfile: string; topCareers: CareerPath[]; strengths: Strength[]; developmentAreas: DevArea[]; nextSteps: string[]; }

type Pdf = import("jspdf").jsPDF;

const INK    = "#1b1650";   // headings
const BODY   = "#454f63";   // paragraphs
const MUTED  = "#7a839a";   // captions
const ACCENT = "#4f46e5";   // indigo
const VIOLET = "#7c3aed";
const TINT   = "#f6f4ff";   // card fill
const RULE   = "#e7e3fa";

const rgb = (hex: string): [number, number, number] => {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

/** Blends two hex colours; jsPDF has no gradients, so we fake them with slices. */
const mix = (from: string, to: string, t: number): [number, number, number] => {
  const [r1, g1, b1] = rgb(from);
  const [r2, g2, b2] = rgb(to);
  return [
    Math.round(r1 + (r2 - r1) * t),
    Math.round(g1 + (g2 - g1) * t),
    Math.round(b1 + (b2 - b1) * t),
  ];
};

export function buildReportPdf(pdf: Pdf, report: Report, studentName: string): Pdf {
  const W = pdf.internal.pageSize.getWidth();
  const H = pdf.internal.pageSize.getHeight();
  const M = 46;                 // page margin
  const CW = W - M * 2;         // content width
  const FOOT = 34;              // reserved footer strip
  let y = 0;

  const date = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

  /** Vertical gradient, drawn as thin slices. */
  const gradient = (x: number, top: number, w: number, h: number, from: string, to: string, steps = 90) => {
    const sh = h / steps;
    for (let i = 0; i < steps; i += 1) {
      const [r, g, b] = mix(from, to, i / (steps - 1));
      pdf.setFillColor(r, g, b).rect(x, top + i * sh, w, sh + 0.7, "F");
    }
  };

  const newPage = () => { pdf.addPage(); y = M + 12; };
  const room = (needed: number) => { if (y + needed > H - FOOT) newPage(); };

  const wrap = (body: string, size: number, style: string, width: number) => {
    pdf.setFont("helvetica", style).setFontSize(size);
    return pdf.splitTextToSize(body, width) as string[];
  };

  /** Flowing paragraph; every line is width-limited, so nothing can run off-page. */
  const text = (
    body: string,
    opts: { size?: number; color?: string; style?: string; lead?: number; indent?: number; width?: number } = {}
  ) => {
    const { size = 9.5, color = BODY, style = "normal", lead = 4.6, indent = 0 } = opts;
    const width = opts.width ?? CW - indent;
    const lines = wrap(body, size, style, width);
    pdf.setTextColor(color);
    for (const line of lines) {
      room(size + lead);
      pdf.setFont("helvetica", style).setFontSize(size).setTextColor(color);
      pdf.text(line, M + indent, y);
      y += size + lead;
    }
  };

  const heading = (label: string, sub?: string) => {
    room(72);
    y += 20;
    pdf.setFont("helvetica", "bold").setFontSize(12.5).setTextColor(INK);
    pdf.text(label, M, y);
    y += 10;
    gradient(M, y, 44, 2.6, ACCENT, VIOLET, 24);
    y += 20;
    if (sub) { text(sub, { size: 9, color: MUTED, lead: 4 }); y += 6; }
  };

  // ── Cover ───────────────────────────────────────────────────────────────
  // A masthead band rather than a full-page wash — the colour is the accent,
  // not the page.
  const BAND = 250;
  gradient(0, 0, W, BAND, "#211a5e", "#6d28d9", 120);

  pdf.setFont("helvetica", "bold").setFontSize(8).setTextColor("#c4b5fd");
  pdf.text("P R O C O U N S E L", M, 62);

  pdf.setFont("helvetica", "bold").setFontSize(28).setTextColor("#ffffff");
  pdf.text("Mettle", M, 120);
  pdf.setFont("helvetica", "normal").setFontSize(13).setTextColor("#ddd6fe");
  pdf.text("AI Career Report", M, 142);

  pdf.setFillColor(255, 255, 255).rect(M, 166, 40, 2, "F");

  pdf.setFont("helvetica", "bold").setFontSize(12).setTextColor("#ffffff");
  pdf.text(studentName || "Student", M, 202);
  pdf.setFont("helvetica", "normal").setFontSize(9).setTextColor("#c4b5fd");
  pdf.text(date, M, 219);
  // The one place the link appears in the whole document — parked in the band so
  // it can never collide with the text flowing below.
  pdf.text("procounsel.co.in/mettle", W - M, 219, { align: "right" });

  // Headline result, on the white below the band.
  if (report.personalityType) {
    const panelTop = BAND + 44;
    const typeLines = wrap(report.personalityType, 17, "bold", CW - 52);
    const tagLines = report.personalityTagline
      ? wrap(report.personalityTagline, 10, "normal", CW - 52)
      : [];
    const panelH = 46 + typeLines.length * 21 + tagLines.length * 14;

    pdf.setFillColor(...rgb(TINT)).roundedRect(M, panelTop, CW, panelH, 10, 10, "F");
    gradient(M, panelTop + 12, 3, panelH - 24, ACCENT, VIOLET, 20);

    pdf.setFont("helvetica", "bold").setFontSize(8).setTextColor(ACCENT);
    pdf.text("YOUR PROFILE", M + 20, panelTop + 26);

    let ty = panelTop + 50;
    for (const line of typeLines) {
      pdf.setFont("helvetica", "bold").setFontSize(17).setTextColor(INK);
      pdf.text(line, M + 20, ty);
      ty += 21;
    }
    for (const line of tagLines) {
      pdf.setFont("helvetica", "normal").setFontSize(10).setTextColor(BODY);
      pdf.text(line, M + 20, ty);
      ty += 14;
    }
    y = panelTop + panelH;
  } else {
    y = BAND + 44;
  }

  // ── Snapshot ────────────────────────────────────────────────────────────
  // Runs on under the cover rather than claiming a page of its own — the cover
  // was mostly empty white otherwise.
  if (report.overallProfile) {
    heading("Your profile");
    text(report.overallProfile, { size: 10.5, lead: 5.4 });
  }

  // ── Careers ─────────────────────────────────────────────────────────────
  if (report.topCareers?.length) {
    heading("Your top career matches", "Ranked by how closely each one fits your answers.");

    report.topCareers.forEach((c, i) => {
      // The title wraps inside a column that stops short of the fit pill, so a
      // long job title can no longer run underneath it.
      const PILL = 74;
      const titleLines = wrap(c.title, 13, "bold", CW - PILL - 44);
      const headH = 30 + titleLines.length * 16 + (c.field ? 13 : 0);

      room(headH + 40);

      pdf.setFillColor(...rgb(TINT)).roundedRect(M, y, CW, headH, 10, 10, "F");
      gradient(M, y + 10, 3.2, headH - 20, ACCENT, VIOLET, 20);

      let hy = y + 26;
      for (const line of titleLines) {
        pdf.setFont("helvetica", "bold").setFontSize(13).setTextColor(INK);
        pdf.text(line, M + 20, hy);
        hy += 16;
      }
      if (c.field) {
        pdf.setFont("helvetica", "normal").setFontSize(9).setTextColor(MUTED);
        pdf.text(c.field, M + 20, hy - 2);
      }

      // Fit pill, vertically centred on the card.
      const score = Math.max(0, Math.min(100, Math.round(c.fitScore)));
      const px = W - M - PILL - 14;
      const py = y + headH / 2 - 13;
      const [pr, pg, pb] = mix(ACCENT, VIOLET, score / 100);
      pdf.setFillColor(pr, pg, pb).roundedRect(px, py, PILL, 26, 13, 13, "F");
      pdf.setFont("helvetica", "bold").setFontSize(12).setTextColor("#ffffff");
      pdf.text(`${score}%`, px + PILL / 2, py + 14.5, { align: "center" });
      pdf.setFont("helvetica", "normal").setFontSize(6.5).setTextColor("#ffffff");
      pdf.text("FIT", px + PILL / 2, py + 21.5, { align: "center" });

      y += headH + 16;

      // Labels break to the next page WITH the line they introduce — a stranded
      // "Your roadmap" at the foot of a page reads like a mistake.
      const label = (t: string) => {
        room(32);
        text(t, { size: 8.5, color: ACCENT, style: "bold", lead: 3.5, indent: 20 });
      };

      if (c.description) text(c.description, { indent: 20, width: CW - 40 });
      if (c.whyYouFit) {
        y += 6;
        label("Why this fits you");
        text(c.whyYouFit, { indent: 20, width: CW - 40 });
      }
      if (c.keySkills?.length) {
        y += 6;
        label("Key skills");
        text(c.keySkills.join("  ·  "), { size: 9, indent: 20, width: CW - 40 });
      }
      if (c.steps?.length) {
        y += 8;
        label("Your roadmap");
        c.steps.forEach((s, n) => {
          room(16);
          const stepTop = y;
          const lines = wrap(s, 9, "normal", CW - 76);
          pdf.setFont("helvetica", "bold").setFontSize(9).setTextColor(ACCENT);
          pdf.text(`${n + 1}.`, M + 22, stepTop);
          pdf.setTextColor(BODY).setFont("helvetica", "normal");
          for (const line of lines) {
            room(13.6);
            pdf.setFont("helvetica", "normal").setFontSize(9).setTextColor(BODY);
            pdf.text(line, M + 40, y);
            y += 13.6;
          }
          y += 2;
        });
      }

      y += 14;
      if (i < report.topCareers.length - 1) {
        room(14);
        pdf.setDrawColor(...rgb(RULE)).setLineWidth(0.8);
        pdf.line(M + 20, y, W - M - 20, y);
        y += 18;
      }
    });
  }

  // ── Strengths ───────────────────────────────────────────────────────────
  if (report.strengths?.length) {
    heading("Your strengths, scored", "Each area is scored out of 100 from your responses.");
    report.strengths.forEach((s) => {
      const descLines = s.description ? wrap(s.description, 9, "normal", CW) : [];
      room(34 + descLines.length * 13.6);

      const score = Math.max(0, Math.min(100, Math.round(s.score)));
      pdf.setFont("helvetica", "bold").setFontSize(10).setTextColor(INK);
      pdf.text(s.name, M, y, { maxWidth: CW - 60 });
      pdf.setFont("helvetica", "bold").setFontSize(10).setTextColor(...mix(ACCENT, VIOLET, score / 100));
      pdf.text(String(score), W - M, y, { align: "right" });
      y += 10;

      pdf.setFillColor(...rgb("#ece9fb")).roundedRect(M, y, CW, 6, 3, 3, "F");
      if (score > 0) {
        const barW = Math.max(6, (CW * score) / 100);
        const [br, bg, bb] = mix(ACCENT, VIOLET, score / 100);
        pdf.setFillColor(br, bg, bb).roundedRect(M, y, barW, 6, 3, 3, "F");
      }
      y += 22;

      for (const line of descLines) {
        pdf.setFont("helvetica", "normal").setFontSize(9).setTextColor(BODY);
        pdf.text(line, M, y);
        y += 13.6;
      }
      y += 16;
    });
  }

  // ── Development areas ───────────────────────────────────────────────────
  if (report.developmentAreas?.length) {
    heading("Where to grow", "Nobody scores full marks everywhere — this is where the return is highest.");
    report.developmentAreas.forEach((d) => {
      const tipLines = d.tip ? wrap(d.tip, 9, "normal", CW - 52) : [];
      const boxH = 30 + tipLines.length * 13.6;
      room(boxH + 12);

      pdf.setFillColor(...rgb(TINT)).roundedRect(M, y, CW, boxH, 9, 9, "F");
      pdf.setFont("helvetica", "bold").setFontSize(10).setTextColor(INK);
      pdf.text(d.name, M + 18, y + 22, { maxWidth: CW - 36 });
      let ty = y + 38;
      for (const line of tipLines) {
        pdf.setFont("helvetica", "normal").setFontSize(9).setTextColor(BODY);
        pdf.text(line, M + 18, ty);
        ty += 13.6;
      }
      y += boxH + 12;
    });
  }

  // ── Next steps ──────────────────────────────────────────────────────────
  if (report.nextSteps?.length) {
    heading("Your next steps", "Start at the top — they are in the order we would do them.");
    report.nextSteps.forEach((s, i) => {
      const lines = wrap(s, 10, "normal", CW - 40);
      room(lines.length * 14.6 + 10);
      const top = y;
      pdf.setFillColor(...mix(ACCENT, VIOLET, i / Math.max(1, report.nextSteps.length - 1)))
        .circle(M + 8, top - 3.5, 8, "F");
      pdf.setFont("helvetica", "bold").setFontSize(9).setTextColor("#ffffff");
      pdf.text(String(i + 1), M + 8, top - 0.5, { align: "center" });
      for (const line of lines) {
        pdf.setFont("helvetica", "normal").setFontSize(10).setTextColor(BODY);
        pdf.text(line, M + 26, y);
        y += 14.6;
      }
      y += 8;
    });
  }

  // ── Footers ─────────────────────────────────────────────────────────────
  const pages = pdf.getNumberOfPages();
  for (let i = 1; i <= pages; i += 1) {
    pdf.setPage(i);
    pdf.setDrawColor(...rgb(RULE)).setLineWidth(0.8);
    pdf.line(M, H - 40, W - M, H - 40);
    pdf.setFont("helvetica", "normal").setFontSize(8).setTextColor(MUTED);
    pdf.text(`Mettle Career Report  ·  ${studentName || "Student"}`, M, H - 26);
    pdf.text(`${i} / ${pages}`, W - M, H - 26, { align: "right" });
  }
  return pdf;
}
