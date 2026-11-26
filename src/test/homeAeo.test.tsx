import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { admissionYear } from "@/lib/admissionYear";
import { MBA_PROFILE_FOR_COLLEGE, mbaProfilePathFor } from "@/lib/collegeProfileAlias.mjs";
import { COLLEGES_SNAPSHOT } from "@/data/contentSnapshot";
import { EXAM_DATES, UPCOMING_MBA_EXAMS } from "@/data/homeExams";
import { homeFaqs } from "@/components/SEO/homeSeoContent";
import { examEventSchemas, freeToolsSchema, homeFaqSchema } from "@/components/Revamp/home/homeJsonLd";
import ExamDates from "@/components/Revamp/home/ExamDates";

describe("admissionYear", () => {
  it("is this year until June, next year from July", () => {
    expect(admissionYear(new Date(2026, 5, 30))).toBe(2026);
    expect(admissionYear(new Date(2026, 6, 1))).toBe(2027);
    expect(admissionYear(new Date(2026, 10, 20))).toBe(2027);
  });
});

describe("college pages with an MBA profile", () => {
  it("only aliases colleges that exist in the directory snapshot", () => {
    const ids = new Set(COLLEGES_SNAPSHOT.map((c) => c.collegeId));
    expect(Object.keys(MBA_PROFILE_FOR_COLLEGE).filter((id) => !ids.has(id))).toEqual([]);
  });

  it("maps to the MBA profile path, or null", () => {
    expect(mbaProfilePathFor("SIBM_PUNE")).toBe("/mba-colleges/sibm-pune");
    expect(mbaProfilePathFor("CEP_PUNE")).toBeNull();
    expect(mbaProfilePathFor(undefined)).toBeNull();
  });
});

describe("home structured data", () => {
  it("FAQPage mirrors the visible FAQ list exactly", () => {
    const schema = homeFaqSchema();
    expect(schema.mainEntity.map((q) => q.name)).toEqual(homeFaqs.map((f) => f.question));
    expect(homeFaqs.some((f) => f.question === "When is CAT 2026?")).toBe(true);
    expect(homeFaqs.some((f) => /99 percentile/.test(f.question))).toBe(true);
  });

  it("emits Events only for confirmed, not-yet-past exams", () => {
    const before = examEventSchemas(new Date(2026, 10, 20)).map((e) => e.name);
    expect(before).toEqual(["CAT 2026", "SNAP 2026", "XAT 2027", "JEE Main 2027"]);
    const after = examEventSchemas(new Date(2026, 11, 1)).map((e) => e.name);
    expect(after).toEqual(["SNAP 2026", "XAT 2027", "JEE Main 2027"]);
  });

  it("lists free public tools once each, without the signed-in app", () => {
    const urls = freeToolsSchema().itemListElement.map((i) => i.url);
    expect(new Set(urls).size).toBe(urls.length);
    expect(urls.some((u) => u.includes("/mba/"))).toBe(false);
    expect(urls.some((u) => u.includes("/cat-college-predictor"))).toBe(true);
  });
});

describe("exam dates table", () => {
  it("shows every exam with its date and the last-checked note", () => {
    render(
      <MemoryRouter>
        <ExamDates />
      </MemoryRouter>,
    );
    const table = screen.getByRole("table");
    for (const e of EXAM_DATES) expect(within(table).getByRole("rowheader", { name: new RegExp(e.name) })).toBeTruthy();
    expect(within(table).getByText("Sunday, 29 November 2026")).toBeTruthy();
    expect(screen.getByText(/Last checked on/)).toBeTruthy();
  });

  it("feeds the hero card the same MBA dates", () => {
    expect(UPCOMING_MBA_EXAMS.map((e) => e.name)).toEqual(["CAT 2026", "NMAT", "SNAP 2026", "XAT 2027", "CMAT 2027"]);
  });
});
