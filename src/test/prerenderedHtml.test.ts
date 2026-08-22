import { describe, it, expect } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * Asserts on dist/ — the exact HTML Firebase serves and the AdSense reviewer
 * fetches. Everything else in this suite tests components; this tests the
 * artefact.
 *
 * Requires a build (`npm run build`, which prerenders via react-snap). When
 * dist is absent the suite skips rather than failing, so `npm test` stays
 * usable without a full build.
 */

const DIST = resolve(process.cwd(), "dist");
const built = existsSync(DIST);

const REVIEWED_URLS = [
  "college-details/CEP_PUNE",
  "college-details/SIBM_PUNE",
  "college-details/SPIT_MUMBAI",
  "college-details/VJTI_MUMBAI",
  "college-details/DJSCE_MUMBAI",
  "admissions/deadlines/aeee_2026_phase_2_examination",
];

// A 200 that says any of these is a soft 404.
const EMPTY_STATE_STRINGS = [
  "College not found",
  "This college page is no longer available",
  "Could not load this deadline",
  "No courses found",
  "No tests found",
  "No colleges found",
  "No blogs yet",
];

const readPage = (route: string) => readFileSync(resolve(DIST, route, "index.html"), "utf8");

const bodyText = (html: string) =>
  html
    .slice(Math.max(0, html.indexOf("<body")))
    .replace(/<(script|style|noscript)[^>]*>[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const headOf = (html: string) => html.slice(0, html.indexOf("</head>"));

const countOccurrences = (haystack: string, needle: string) =>
  needle ? haystack.split(needle).length - 1 : 0;

describe.skipIf(!built)("prerendered HTML (dist/)", () => {
  describe.each(REVIEWED_URLS)("%s", (route) => {
    it("was prerendered", () => {
      expect(existsSync(resolve(DIST, route, "index.html"))).toBe(true);
    });

    it("has a title, description and canonical in the served HTML", () => {
      const head = headOf(readPage(route));
      expect(head).toMatch(/<title[^>]*>[^<]{20,}<\/title>/i);
      expect(head).toMatch(/name=["']description["']/i);
      expect(head).toMatch(/rel=["']canonical["']/i);
    });

    it("is indexable — no noindex left on a page we want ranked", () => {
      expect(headOf(readPage(route))).not.toMatch(/content=["'][^"']*noindex/i);
    });

    it("renders real content, not an empty state", () => {
      const html = readPage(route);
      for (const marker of EMPTY_STATE_STRINGS) {
        expect(html, `${route} contains "${marker}"`).not.toContain(marker);
      }
      expect(bodyText(html).split(" ").length).toBeGreaterThan(150);
    });

    it("has exactly one <h1>", () => {
      const h1s = readPage(route).match(/<h1[\s>]/gi) ?? [];
      expect(h1s).toHaveLength(1);
    });
  });

  describe("home page", () => {
    const html = () => readPage(".");

    it("does not repeat any testimonial", () => {
      const body = bodyText(html());
      // The three quotes rendered on the home page.
      const quotes = [
        "The course planning was clear and easy to follow",
        "Topic-wise lessons and regular doubt sessions made preparation smooth",
        "Math and Chemistry sessions were practical and exam-focused",
      ];
      for (const quote of quotes) {
        expect(countOccurrences(body, quote), `"${quote}" is duplicated`).toBeLessThanOrEqual(1);
      }
    });

    it("does not ship the retired shared testimonial headline", () => {
      expect(html()).not.toContain("It was a very good experience");
    });

    it("has no empty sections", () => {
      const body = bodyText(html());
      for (const marker of EMPTY_STATE_STRINGS) {
        expect(body, `home page contains "${marker}"`).not.toContain(marker);
      }
    });

    it("has exactly one <h1>", () => {
      expect(html().match(/<h1[\s>]/gi) ?? []).toHaveLength(1);
    });
  });

  describe("sitemap agrees with the pages it lists", () => {
    const sitemapUrls = () =>
      [...readFileSync(resolve(DIST, "sitemap.xml"), "utf8").matchAll(/<loc>([^<]+)<\/loc>/g)].map(
        (m) => m[1].trim(),
      );

    const routeOf = (url: string) => {
      const path = new URL(url).pathname;
      return path === "/" ? "" : path.replace(/^\//, "").replace(/\/$/, "");
    };

    it("lists only URLs that ship prerendered HTML", () => {
      const missing = sitemapUrls().filter(
        (u) => !existsSync(resolve(DIST, routeOf(u), "index.html")),
      );
      expect(missing, "these would serve the SPA shell instead of real content").toEqual([]);
    });

    it("lists no page that marks itself noindex", () => {
      const contradictions = sitemapUrls().filter((u) => {
        const html = readFileSync(resolve(DIST, routeOf(u), "index.html"), "utf8");
        return /content=["'][^"']*noindex/i.test(headOf(html));
      });
      expect(contradictions).toEqual([]);
    });

    it("lists no page whose canonical points somewhere else", () => {
      // A URL whose page disclaims it is an alias, not a document — Search
      // Console files these under "Alternative page with proper canonical tag".
      const mismatched = sitemapUrls().flatMap((u) => {
        const html = readFileSync(resolve(DIST, routeOf(u), "index.html"), "utf8");
        const href = headOf(html).match(/<link[^>]+rel=["']canonical["'][^>]*>/i)?.[0]
          ?.match(/href=["']([^"']+)["']/)?.[1];
        if (!href) return [];
        return href.replace(/\/$/, "") === u.replace(/\/$/, "") ? [] : [`${u} → canonical ${href}`];
      });
      expect(mismatched).toEqual([]);
    });

    it("lists no URL blocked by robots.txt", () => {
      const robots = readFileSync(resolve(DIST, "robots.txt"), "utf8");
      const disallowed = robots
        .split("\n")
        .filter((l) => l.trim().startsWith("Disallow:"))
        .map((l) => l.split(":")[1].trim())
        .filter(Boolean);

      // robots.txt is a literal prefix match — do not normalise the trailing
      // slash, or "/t/" would wrongly appear to block "/terms".
      const blocked = sitemapUrls().filter((u) =>
        disallowed.some((d) => new URL(u).pathname.startsWith(d)),
      );
      expect(blocked).toEqual([]);
    });
  });

  describe("site-wide", () => {
    it("serves the app-install copy once per page, not twice", () => {
      const routes = [".", "about", "admissions/blogs", "counsellor-listing"].filter((r) =>
        existsSync(resolve(DIST, r, "index.html")),
      );
      expect(routes.length).toBeGreaterThan(0);

      for (const route of routes) {
        const count = countOccurrences(bodyText(readPage(route)), "Experience the features on the app from anywhere");
        expect(count, `${route} repeats the app banner copy`).toBeLessThanOrEqual(1);
      }
    });

    it("does not mount the course and test lists twice on /courses", () => {
      if (!existsSync(resolve(DIST, "courses", "index.html"))) return;
      const body = bodyText(readPage("courses"));

      // Section headers are rendered once per mounted section.
      const heading = "Discover curated programs across mental wellness";
      expect(countOccurrences(body, heading)).toBeLessThanOrEqual(2);
    });
  });
});
