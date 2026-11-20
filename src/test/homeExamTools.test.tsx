import { describe, expect, it } from "vitest";
import { useState } from "react";
import { MotionGlobalConfig } from "framer-motion";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import ExamTools from "@/components/Revamp/home/ExamTools";
import HomeHero from "@/components/Revamp/home/HomeHero";
import {
  DAILY_QUESTIONS,
  EXAM_TOOLS,
  QUICK_LINKS,
  UPCOMING_MBA_EXAMS,
  daysUntil,
  dayIndex,
  formatExamDay,
  loadRecentTools,
  WHATSAPP_CHANNEL,
  whatsappHref,
  type ExamKey,
} from "@/data/homeExams";

// The exam panels cross-fade; skip the animation time so tab switches settle quickly.
MotionGlobalConfig.skipAnimations = true;

function Where() {
  const loc = useLocation();
  return <p data-testid="where">{loc.pathname + loc.search}</p>;
}

function Harness() {
  const [exam, setExam] = useState<ExamKey>("mba");
  return (
    <>
      <ExamTools exam={exam} onExamChange={setExam} />
      <Where />
    </>
  );
}

function renderTools() {
  return render(
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route path="*" element={<Harness />} />
      </Routes>
    </MemoryRouter>,
  );
}

const hrefs = () => Array.from(document.querySelectorAll("a[href]")).map((a) => a.getAttribute("href"));

describe("home: free tools for your exam", () => {
  it("shows every MBA tool by default (CAT season)", () => {
    renderTools();
    for (const t of EXAM_TOOLS.mba) expect(hrefs()).toContain(t.to);
    expect(screen.getByRole("tab", { name: /MBA/ })).toHaveAttribute("aria-selected", "true");
  });

  it("switches to NEET and JEE tools", async () => {
    renderTools();
    fireEvent.click(screen.getByRole("tab", { name: /NEET/ }));
    await waitFor(() => expect(hrefs()).toContain("/neet-college-predictor"));
    fireEvent.click(screen.getByRole("tab", { name: /JEE/ }));
    await waitFor(() => expect(hrefs()).toContain("/jee-college-predictor"));
    expect(hrefs()).toContain("/mhtcet-college-predictor");
  });

  it("moves between exams with the arrow keys", async () => {
    renderTools();
    const mba = screen.getByRole("tab", { name: /MBA/ });
    mba.focus();
    fireEvent.keyDown(mba, { key: "ArrowRight" });
    await waitFor(() => expect(screen.getByRole("tab", { name: /NEET/ })).toHaveAttribute("aria-selected", "true"));
    expect(document.activeElement).toBe(screen.getByRole("tab", { name: /NEET/ }));
    await waitFor(() => expect(screen.getByRole("tabpanel")).toHaveAttribute("aria-labelledby", "exam-tab-neet"));
  });

  it("hands the score to the predictor's existing URL prefill", () => {
    renderTools();
    fireEvent.change(screen.getByLabelText(/Your CAT percentile/), { target: { value: "92.4" } });
    fireEvent.click(screen.getByRole("button", { name: /Check my colleges/ }));
    expect(screen.getByTestId("where").textContent).toBe("/cat-college-predictor?percentile=92.4");
  });

  it("uses rank for NEET and rejects an out-of-range value", async () => {
    renderTools();
    fireEvent.click(screen.getByRole("tab", { name: /NEET/ }));
    const input = await screen.findByLabelText(/Your NEET rank/);
    fireEvent.change(input, { target: { value: "12.5" } });
    fireEvent.click(screen.getByRole("button", { name: /Check my colleges/ }));
    expect(screen.getByRole("alert")).toHaveTextContent(/whole number/);
    fireEvent.change(input, { target: { value: "18,500" } });
    fireEvent.click(screen.getByRole("button", { name: /Check my colleges/ }));
    expect(screen.getByTestId("where").textContent).toBe("/neet-college-predictor?rank=18500");
  });


  it("does not promote the option-form service on the home page", () => {
    const all = [...Object.values(EXAM_TOOLS).flat(), ...Object.values(QUICK_LINKS).flat()].map((t) => t.to);
    expect(all).not.toContain("/mhtcet-option-form-filling");
  });
});

describe("home exam data", () => {
  it("every daily question has a valid answer index", () => {
    for (const list of Object.values(DAILY_QUESTIONS)) {
      for (const q of list) {
        expect(q.answer).toBeGreaterThanOrEqual(0);
        expect(q.answer).toBeLessThan(q.options.length);
      }
    }
  });

  it("counts days to the exam on calendar days", () => {
    expect(daysUntil("2026-11-29", new Date(2026, 10, 19, 23, 30))).toBe(10);
    expect(daysUntil("2026-11-29", new Date(2026, 10, 29, 9, 0))).toBe(0);
    expect(daysUntil("2026-11-29", new Date(2026, 10, 30, 9, 0))).toBe(-1);
  });

  it("formats exam days the same everywhere (no locale differences)", () => {
    expect(formatExamDay("2026-11-29")).toBe("Sunday, 29 Nov");
    expect(formatExamDay("2027-01-03")).toBe("Sunday, 3 Jan");
  });

  it("only restores same-site paths from 'recent tools' storage", () => {
    window.localStorage.setItem(
      "home-recent-tools",
      JSON.stringify([
        { label: "Evil", to: "https://evil.example", exam: "mba" },
        { label: "Protocol-relative", to: "//evil.example", exam: "mba" },
        { label: "CAT predictor", to: "/cat-college-predictor", exam: "mba" },
      ]),
    );
    expect(loadRecentTools().map((t) => t.to)).toEqual(["/cat-college-predictor"]);
    window.localStorage.removeItem("home-recent-tools");
  });

  it("links every upcoming MBA exam to its exam page", () => {
    for (const e of UPCOMING_MBA_EXAMS) expect(e.to).toMatch(/^\/mba-entrance-exams\/[a-z-]+$/);
  });

  it("keeps WhatsApp buttons on the channel until a chat number is configured", () => {
    expect(whatsappHref("mba")).toBe(WHATSAPP_CHANNEL);
  });

  it("picks the same daily item all day", () => {
    const a = dayIndex(7, new Date(2026, 10, 19, 0, 5));
    const b = dayIndex(7, new Date(2026, 10, 19, 23, 55));
    expect(a).toBe(b);
  });
});

describe("home hero", () => {
  it("offers exam reminders through the call-back form", async () => {
    render(
      <MemoryRouter>
        <HomeHero />
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByRole("button", { name: /Remind me/ }));
    const dialog = await screen.findByRole("dialog", { name: "Get exam date reminders" });
    expect(dialog.querySelector('[data-form-id="home_hero_reminders"]')).not.toBeNull();
    fireEvent.keyDown(window, { key: "Escape" });
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  it("lists the upcoming MBA exams with links to their pages", () => {
    render(
      <MemoryRouter>
        <HomeHero />
      </MemoryRouter>,
    );
    for (const e of UPCOMING_MBA_EXAMS.slice(0, 3)) {
      expect(Array.from(document.querySelectorAll("a[href]")).some((a) => a.getAttribute("href") === e.to)).toBe(true);
    }
  });
});
