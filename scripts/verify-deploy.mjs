// Pre-promotion smoke test for a Hosting deploy.
//
// The `rewrites` block in firebase.json is scoped to real route prefixes so an
// unknown URL falls through to 404.html with a genuine 404 status instead of
// answering 200 with the home page (the soft-404 source Search Console kept
// reporting). The failure mode of getting that wrong is severe: a route left
// out of the list becomes a hard 404 for real users, including signed-in ones
// whose pages are never prerendered.
//
// So: never promote a Hosting change straight to live. Deploy to a preview
// channel, point this at the channel URL, and only promote on a clean run.
//
//   firebase hosting:channel:deploy verify --expires 7d
//   node scripts/verify-deploy.mjs https://<channel-url>
//   firebase deploy --only hosting        # only if the run above passed
//
// Usage: node scripts/verify-deploy.mjs <base-url> [--concurrency 8]

import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const args = process.argv.slice(2);
const BASE = (args.find((a) => a.startsWith("http")) || "").replace(/\/$/, "");
const CONCURRENCY = Number((args[args.indexOf("--concurrency") + 1] || "8")) || 8;

if (!BASE) {
  console.error("usage: node scripts/verify-deploy.mjs <base-url>");
  process.exit(2);
}

// Routes that are NOT prerendered — signed-in app pages, session-based test
// flows, dynamic detail pages. These only work via a rewrite, so they are the
// exact things a too-narrow rewrite list breaks. They must answer 200.
const APP_ROUTES = [
  "/mettle", "/profile", "/wallet", "/notifications", "/dashboard-student",
  "/counsellor-dashboard", "/counselor-dashboard/client-profile", "/create-test",
  "/live-sessions", "/promo", "/subscribe", "/add-college", "/sitemap",
  "/community/answer", "/community/my-activity", "/community/question/abc123",
  "/courses/detail/abc123/user", "/courses/test-group/abc123",
  "/courses/test-groups/abc123", "/test-group/abc123", "/test-groups/abc123",
  "/test-info/abc123", "/test-result/abc123", "/take-test/abc123",
  "/t/result/abc123", "/t/analysis/abc123/1", "/add-question/abc123",
  "/detail/abc123/user", "/counselor/test-groups/create",
  "/counselor/test-groups/abc123", "/counselor/test-groups/edit/abc123",
  "/counselor/test-groups/abc123/create-test",
  "/pro-buddies/dashboard", "/pro-buddies/register", "/pro-buddies/profile/abc123",
  "/pro-buddies/listing", "/pro-buddies/college-listing",
  "/admissions/blogs/abc123", "/admissions/blog-authors/ananya",
  "/counselling/mumbai", "/college-details/CEP_PUNE",
  "/counsellor-details/OTk4NzU2NDcwMg", "/admissions/deadlines/nest_niser__2026",
  "/testSeries/pcsat", "/predictors", "/neet-cutoffs", "/mbbs-colleges",
  "/revamp-about", "/revamp-courses", "/counsellor-listing-cards",
  "/privacy1", "/term1", "/gurucool", "/community", "/courses/session-listing",
];

// Junk that should NOT resolve. Once rewrites are scoped these return 404.
const SHOULD_404 = [
  "/this-page-does-not-exist",
  "/wp-admin",
  "/index.php",
  "/some/deep/nonsense/path",
  "/collegedetails/CEP_PUNE",
];

// source -> expected Location (path only)
const REDIRECTS = {
  "/colleges/BITSSM_MUMBAI": "/college-details/BITSSM_MUMBAI",
  "/counsellor/ODAxMDAxNjQxMA": "/counsellor-details/ODAxMDAxNjQxMA",
  "/admissions/blogs/slug/how-to-start-a-career-in-data-analytics":
    "/admissions/blogs/slug/career-in-data-analytics",
  "/admissions/blogs/slug/steps-to-plan-your-career-after-12th-dont-get-stuck-in-wrong-field":
    "/admissions/blogs/slug/steps-to-plan-career-after-12th",
  "/admissions/blogs/slug/future-career-options-students-should-know-high-demand-jobs-after-12th":
    "/admissions/blogs/slug/future-career-options-students",
  "/admissions/blogs/slug/confused-about-your-career-how-career-counseling-can-help-students-choose-the-right-path":
    "/admissions/blogs/slug/career-counseling-students-right-path",
  "/admissions/blogs/slug/how-learning-a-new-language-improves-brain-health-and-intelligence":
    "/admissions/blogs/slug/learning-language-brain-health-intelligence-benefits",
  "/admissions/deadlines/jee_advanced_2026_registration": "/admissions/deadlines",
  "/admissions/deadlines/jee_advanced_2026_exam": "/admissions/deadlines",
  "/favicon.ico": "/favicon.png",
};

const sitemapPaths = () => {
  const xml = readFileSync(resolve(process.cwd(), "dist", "sitemap.xml"), "utf8");
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
};

async function head(path, follow = false) {
  try {
    const res = await fetch(BASE + path, { redirect: follow ? "follow" : "manual" });
    return { status: res.status, location: res.headers.get("location") };
  } catch (error) {
    return { status: 0, error: String(error) };
  }
}

async function mapLimit(items, limit, fn) {
  const out = new Array(items.length);
  let i = 0;
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (i < items.length) {
        const idx = i++;
        out[idx] = await fn(items[idx]);
      }
    }),
  );
  return out;
}

const failures = [];
const record = (label, list) => {
  console.log(`${list.length ? "FAIL" : "ok  "}  ${label}${list.length ? ` (${list.length})` : ""}`);
  list.slice(0, 15).forEach((f) => console.log(`        ${f}`));
  if (list.length > 15) console.log(`        …+${list.length - 15}`);
  failures.push(...list.map((f) => `${label}: ${f}`));
};

console.log(`verifying ${BASE}\n`);

// 1. every indexable URL still resolves
const paths = sitemapPaths();
const sitemapBad = (await mapLimit(paths, CONCURRENCY, async (p) => {
  const { status } = await head(p, true);
  return status === 200 ? null : `${status} ${p}`;
})).filter(Boolean);
record(`sitemap URLs return 200 (${paths.length} checked)`, sitemapBad);

// 2. non-prerendered app routes still resolve — the rewrite-scoping blast radius
const appBad = (await mapLimit(APP_ROUTES, CONCURRENCY, async (p) => {
  const { status } = await head(p, true);
  return status === 200 ? null : `${status} ${p}`;
})).filter(Boolean);
record(`app routes return 200 (${APP_ROUTES.length} checked)`, appBad);

// 3. redirects land on the right target
const redirBad = (await mapLimit(Object.entries(REDIRECTS), CONCURRENCY, async ([from, to]) => {
  const { status, location } = await head(from);
  if (status !== 301) return `${status} (expected 301) ${from}`;
  const got = location ? new URL(location, BASE).pathname : "";
  return got === to ? null : `${from} -> ${got} (expected ${to})`;
})).filter(Boolean);
record(`301 redirects (${Object.keys(REDIRECTS).length} checked)`, redirBad);

// 4. junk 404s. Reported separately: while rewrites are still `**` these answer
//    200, which is a known-pending item rather than a regression.
const junk = await mapLimit(SHOULD_404, CONCURRENCY, async (p) => {
  const { status } = await head(p, true);
  return { p, status };
});
const junkBad = junk.filter((j) => j.status !== 404).map((j) => `${j.status} ${j.p}`);
console.log(`${junkBad.length ? "WARN" : "ok  "}  unknown URLs return 404${junkBad.length ? ` (${junkBad.length} still 200)` : ""}`);
junkBad.forEach((f) => console.log(`        ${f}`));

console.log(`\n${failures.length ? `FAILED — ${failures.length} problem(s). Do NOT promote.` : "PASSED — safe to promote."}`);
process.exit(failures.length ? 1 : 0);
