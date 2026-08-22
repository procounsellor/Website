import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * The six URLs the AdSense review flagged were all the same failure: the Cloud
 * Run backend scales to zero, the first request 503s or hangs, and the page
 * collapsed to "College not found" / "Could not load this deadline" — a 200
 * response with no content, i.e. a soft 404.
 *
 * These tests run the real pages with the API forced to fail, and assert they
 * still render the college/deadline from the build-time snapshot in
 * public/data. If the fallback ever regresses, these fail.
 */

const FLAGGED_COLLEGES = [
  "CEP_PUNE",
  "SIBM_PUNE",
  "SPIT_MUMBAI",
  "VJTI_MUMBAI",
  "DJSCE_MUMBAI",
] as const;

const FLAGGED_DEADLINE = "aeee_2026_phase_2_examination";

const readStatic = (relativePath: string) =>
  JSON.parse(readFileSync(resolve(process.cwd(), "public", relativePath), "utf8"));

// Every API module used by these pages is forced into the failure mode that
// produced the review findings.
vi.mock("@/api/academic", () => ({
  academicApi: {
    getCollegeById: vi.fn(async () => {
      throw new Error("503 Service Unavailable (Cloud Run cold start)");
    }),
    getColleges: vi.fn(async () => {
      throw new Error("503 Service Unavailable (Cloud Run cold start)");
    }),
  },
}));

vi.mock("@/api/deadlines", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/api/deadlines")>();
  return {
    ...actual,
    getEventById: vi.fn(async () => {
      throw new Error("503 Service Unavailable (Cloud Run cold start)");
    }),
    getDeadlines: vi.fn(async () => {
      throw new Error("503 Service Unavailable (Cloud Run cold start)");
    }),
  };
});

// Counsellor lookups are irrelevant here and would otherwise hit the network.
vi.mock("@/hooks/useCounselors", () => ({
  useAllCounselors: () => ({ data: [], isLoading: false }),
  useCounselors: () => ({ data: [], isLoading: false }),
}));

/**
 * Serves public/data/** the way the CDN does, so `withStaticFallback` can reach
 * the snapshot. Anything else 404s — the page must not depend on it.
 */
function stubStaticCdn() {
  vi.stubGlobal(
    "fetch",
    vi.fn(async (input: RequestInfo | URL) => {
      const url = typeof input === "string" ? input : input.toString();
      if (url.startsWith("/data/")) {
        try {
          const body = readFileSync(resolve(process.cwd(), "public", url.slice(1)), "utf8");
          return new Response(body, { status: 200, headers: { "Content-Type": "application/json" } });
        } catch {
          return new Response("not found", { status: 404 });
        }
      }
      return new Response("blocked", { status: 503 });
    }),
  );
}

function renderAt(path: string, pattern: string, element: React.ReactNode) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });

  return render(
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={[path]}>
          <Routes>
            <Route path={pattern} element={element} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    </HelmetProvider>,
  );
}

beforeEach(() => stubStaticCdn());
afterEach(() => vi.unstubAllGlobals());

describe("college detail pages survive a dead API", () => {
  it.each(FLAGGED_COLLEGES)(
    "%s renders the real college instead of a soft 404",
    async (collegeId) => {
      const { default: CollegeDetailsPage } = await import("@/pages/CollegeDetailsPage");
      const snapshot = readStatic(`data/colleges/${collegeId}.json`);

      const { container } = renderAt(
        `/college-details/${collegeId}`,
        "/college-details/:id",
        <CollegeDetailsPage />,
      );

      await waitFor(() =>
        expect(screen.getAllByText(new RegExp(snapshot.collegeName, "i")).length).toBeGreaterThan(0),
      );

      expect(container.textContent).not.toContain("This college page is no longer available");
      expect(container.textContent).not.toContain("College not found");

      // One H1, and it names the college — not a generic placeholder.
      const h1s = container.querySelectorAll("h1");
      expect(h1s).toHaveLength(1);
      expect(h1s[0].textContent).toContain(snapshot.collegeName);
    },
  );

  it("still shows a real, noindex page for a college that genuinely does not exist", async () => {
    const { default: CollegeDetailsPage } = await import("@/pages/CollegeDetailsPage");

    const { container } = renderAt(
      "/college-details/DEFINITELY_NOT_A_COLLEGE",
      "/college-details/:id",
      <CollegeDetailsPage />,
    );

    await waitFor(() =>
      expect(container.textContent).toContain("This college page is no longer available"),
    );

    // A dead end is fine — an unnavigable dead end is not.
    expect(screen.getByText("Browse all colleges")).toBeInTheDocument();
    expect(screen.getByText("Talk to a counsellor")).toBeInTheDocument();
  });
});

describe("deadline detail pages survive a dead API", () => {
  it(`${FLAGGED_DEADLINE} renders the real deadline instead of an error`, async () => {
    const { default: DeadlineDetailPage } = await import("@/pages/Revamp/DeadlineDetailPage");
    const snapshot = readStatic(`data/deadlines/${FLAGGED_DEADLINE}.json`);

    const { container } = renderAt(
      `/admissions/deadlines/${FLAGGED_DEADLINE}`,
      "/admissions/deadlines/:id",
      <DeadlineDetailPage />,
    );

    await waitFor(() =>
      expect(screen.getAllByText(new RegExp(snapshot.title, "i")).length).toBeGreaterThan(0),
    );

    expect(container.textContent).not.toContain("Could not load this deadline");
  });

  it("renders the deadline title and badges exactly once, under a single <h1>", async () => {
    const { default: DeadlineDetailPage } = await import("@/pages/Revamp/DeadlineDetailPage");
    const snapshot = readStatic(`data/deadlines/${FLAGGED_DEADLINE}.json`);

    const { container } = renderAt(
      `/admissions/deadlines/${FLAGGED_DEADLINE}`,
      "/admissions/deadlines/:id",
      <DeadlineDetailPage />,
    );

    await waitFor(() => expect(container.querySelector("h1")).not.toBeNull());

    const h1s = container.querySelectorAll("h1");
    expect(h1s).toHaveLength(1);
    expect(h1s[0].textContent?.trim()).toBe(snapshot.title);

    // Scope to the hero block. The breadcrumb above it legitimately repeats the
    // title — that is a trail, not the mobile/desktop double-render this guards.
    const hero = h1s[0].closest("div.grid");
    expect(hero, "expected the deadline hero to be the responsive grid container").not.toBeNull();

    const leafText = (root: Element, needle: string) =>
      [...root.querySelectorAll("*")].filter(
        (el) => el.children.length === 0 && el.textContent?.trim() === needle,
      );

    // The title used to be rendered twice — a mobile <h1> and a desktop <h1>.
    expect(leafText(hero!, snapshot.title)).toHaveLength(1);

    // …and so did every badge.
    expect(leafText(hero!, snapshot.typeOfEvent.toLowerCase())).toHaveLength(1);
    for (const course of snapshot.associatedCourseId ?? []) {
      expect(leafText(hero!, course.replace(/_/g, " "))).toHaveLength(1);
    }
  });
});
