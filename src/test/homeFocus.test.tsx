import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import RevampBannerSection from "@/components/Revamp/banners/RevampBannerSection";
import HomeHero from "@/components/Revamp/home/HomeHero";
import { homeFaqs } from "@/components/SEO/homeSeoContent";

function hrefs() {
  return Array.from(document.querySelectorAll("a[href]")).map((a) => a.getAttribute("href"));
}

describe("home page", () => {
  it("no longer promotes the option-form service in the partner carousel", () => {
    render(
      <MemoryRouter>
        <RevampBannerSection />
      </MemoryRouter>,
    );
    expect(hrefs()).not.toContain("/mhtcet-option-form-filling");
    expect(screen.queryByText(/option form/i)).not.toBeInTheDocument();
    expect(hrefs()).toContain("/mettle");
  });

  it("hero links MBA admissions, the CAT predictor, mocks and past papers — not the option form", () => {
    render(
      <MemoryRouter>
        <HomeHero />
      </MemoryRouter>,
    );
    const links = hrefs();
    for (const to of ["/mba-admission-2027", "/cat-college-predictor", "/free-cat-mock-test", "/cat-previous-year-papers"]) {
      expect(links).toContain(to);
    }
    expect(links).not.toContain("/mhtcet-option-form-filling");
    // "right college" and "for" must stay separate words in the prerendered HTML too (non-breaking space).
    expect(screen.getByRole("heading", { level: 1 }).textContent?.replace(/ /g, " ")).toMatch(/right college for your MBA/);
  });

  it("keeps the carousel for partners; the free exam tools moved to their own section", () => {
    render(
      <MemoryRouter>
        <RevampBannerSection />
      </MemoryRouter>,
    );
    expect(hrefs()[0]).toBe("/mettle");
    // Predictor slides are gone from the carousel (the pages are unchanged and
    // linked from the "Free tools for your exam" section instead).
    expect(hrefs()).not.toContain("/cat-college-predictor");
    expect(hrefs()).not.toContain("/neet-college-predictor");
  });

  it("hero keeps the old tile hero's links (colleges, study abroad, ProBuddies, deadlines)", () => {
    render(
      <MemoryRouter>
        <HomeHero />
      </MemoryRouter>,
    );
    for (const to of ["/colleges", "/study-abroad", "/pro-buddies", "/admissions/deadlines"]) expect(hrefs()).toContain(to);
  });

  it("the home page source no longer contains the old tile hero", () => {
    const source = readFileSync(resolve(__dirname, "../pages/Revamp/Admissions.tsx"), "utf8");
    expect(source).toContain("<HomeHero />");
    expect(source).not.toContain("splashPhase");
    expect(source).not.toContain("/mhtcet-option-form-filling");
  });

  it("states the no-login predictor policy in the FAQ", () => {
    const faq = homeFaqs.find((f) => /log in/i.test(f.question));
    expect(faq?.answer).toMatch(/without logging in/i);
  });
});
