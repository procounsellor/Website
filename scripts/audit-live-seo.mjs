// Live-site crawl audit for the AdSense / Search Console checklist.
//
// Fetches every URL in the sitemap (or a --base of your choosing) and reports
// exactly what a crawler sees in the served HTML:
//   - HTTP status, and soft-404s (200 that render an "unavailable" page)
//   - thin pages (too little body text to be worth indexing)
//   - the empty-state strings the AdSense reviewer flagged
//   - duplicate visible text within a page (the mobile/desktop double-render bug)
//   - missing <title> / meta description / canonical
//
// Usage:
//   node scripts/audit-live-seo.mjs
//   node scripts/audit-live-seo.mjs --base https://procounsel.co.in --json out.json
//   node scripts/audit-live-seo.mjs --limit 20

import fs from "node:fs/promises";

const args = process.argv.slice(2);
const getArg = (name, fallback) => {
  const i = args.indexOf(name);
  return i !== -1 && args[i + 1] ? args[i + 1] : fallback;
};

const BASE = getArg("--base", "https://procounsel.co.in").replace(/\/$/, "");
const LIMIT = Number(getArg("--limit", "0")) || Infinity;
const JSON_OUT = getArg("--json", "");
const CONCURRENCY = Number(getArg("--concurrency", "8"));

// Strings that mean "this page has nothing to show". A 200 response containing
// one of these is a soft 404 as far as Google is concerned.
const EMPTY_STATE_STRINGS = [
  "College not found",
  "This college page is no longer available",
  "Could not load this deadline",
  "No courses found",
  "No tests found",
  "No colleges found",
  "No blogs yet",
  "Page not found",
  "Something went wrong",
];

const MIN_WORDS = 120;

function stripToText(html) {
  const body = html.slice(Math.max(0, html.indexOf("<body")));
  return body
    .replace(/<(script|style|noscript)[^>]*>[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function visibleChunks(html) {
  const body = html
    .slice(Math.max(0, html.indexOf("<body")))
    .replace(/<(script|style|noscript)[^>]*>[\s\S]*?<\/\1>/gi, " ");
  return body
    .split(/<[^>]+>/)
    .map((c) => c.replace(/\s+/g, " ").trim())
    .filter((c) => c.length > 25);
}

function head(html) {
  return html.slice(0, Math.max(0, html.indexOf("</head>")) || 20000);
}

function auditHtml(html) {
  const h = head(html);
  const text = stripToText(html);
  const words = text.split(" ").filter(Boolean).length;

  const counts = new Map();
  for (const chunk of visibleChunks(html)) {
    counts.set(chunk, (counts.get(chunk) || 0) + 1);
  }
  const duplicates = [...counts.entries()]
    .filter(([, n]) => n > 1)
    .sort((a, b) => b[1] - a[1])
    .map(([t, n]) => ({ count: n, text: t.slice(0, 100) }));

  const titleMatch = h.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const h1s = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) =>
    m[1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim(),
  );

  return {
    title: titleMatch ? titleMatch[1].trim() : "",
    hasDescription: /<meta[^>]+name=["']description["']/i.test(h) || /name=["']description["']/i.test(h),
    hasCanonical: /rel=["']canonical["']/i.test(h),
    isNoIndex: /content=["'][^"']*noindex/i.test(h),
    h1Count: h1s.length,
    h1: h1s[0] || "",
    words,
    emptyStates: EMPTY_STATE_STRINGS.filter((s) => html.includes(s)),
    duplicates,
  };
}

async function fetchUrl(url) {
  try {
    const res = await fetch(url, {
      redirect: "follow",
      headers: {
        // Identify as a crawler-ish client; we want the same HTML Googlebot gets.
        "User-Agent": "ProCounselSeoAudit/1.0 (+https://procounsel.co.in)",
        Accept: "text/html",
      },
    });
    const html = await res.text();
    return { status: res.status, finalUrl: res.url, html };
  } catch (error) {
    return { status: 0, finalUrl: url, html: "", error: String(error) };
  }
}

async function getSitemapUrls() {
  const res = await fetch(`${BASE}/sitemap.xml`);
  if (!res.ok) throw new Error(`sitemap.xml returned ${res.status}`);
  const xml = await res.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
}

async function mapWithConcurrency(items, limit, fn) {
  const results = new Array(items.length);
  let cursor = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (cursor < items.length) {
      const index = cursor++;
      results[index] = await fn(items[index], index);
    }
  });
  await Promise.all(workers);
  return results;
}

async function main() {
  const urls = (await getSitemapUrls()).slice(0, LIMIT);
  console.log(`[audit] ${urls.length} URLs from ${BASE}/sitemap.xml\n`);

  let done = 0;
  const rows = await mapWithConcurrency(urls, CONCURRENCY, async (url) => {
    const { status, finalUrl, html, error } = await fetchUrl(url);
    done += 1;
    if (done % 25 === 0) console.log(`[audit] ${done}/${urls.length}…`);
    if (!html) return { url, status, error, ...auditHtml("") };
    return { url, status, finalUrl, ...auditHtml(html) };
  });

  const broken = rows.filter((r) => r.status !== 200);
  const softFour04 = rows.filter((r) => r.status === 200 && r.emptyStates.length);
  const thin = rows.filter((r) => r.status === 200 && r.words < MIN_WORDS);
  const noTitle = rows.filter((r) => r.status === 200 && !r.title);
  const noDesc = rows.filter((r) => r.status === 200 && !r.hasDescription);
  const noCanonical = rows.filter((r) => r.status === 200 && !r.hasCanonical);
  const badH1 = rows.filter((r) => r.status === 200 && r.h1Count !== 1);
  const dupes = rows.filter((r) => r.status === 200 && r.duplicates.length);

  const section = (label, list, render) => {
    console.log(`\n=== ${label}: ${list.length} ===`);
    for (const r of list.slice(0, 40)) console.log(`  ${render(r)}`);
    if (list.length > 40) console.log(`  …and ${list.length - 40} more`);
  };

  section("Non-200 (broken / must leave the sitemap)", broken, (r) => `${r.status} ${r.url} ${r.error || ""}`);
  section("Soft 404 (200 but empty-state text)", softFour04, (r) => `${r.url} → ${r.emptyStates.join(", ")}`);
  section(`Thin content (<${MIN_WORDS} words)`, thin, (r) => `${r.words}w ${r.url}`);
  section("Missing <title>", noTitle, (r) => r.url);
  section("Missing meta description", noDesc, (r) => r.url);
  section("Missing canonical", noCanonical, (r) => r.url);
  section("H1 count != 1", badH1, (r) => `h1=${r.h1Count} ${r.url}`);
  section("Duplicate visible text within page", dupes, (r) =>
    `${r.url} → ${r.duplicates.slice(0, 2).map((d) => `${d.count}x "${d.text.slice(0, 50)}"`).join(" | ")}`,
  );

  const failures =
    broken.length + softFour04.length + thin.length + noTitle.length + noDesc.length + noCanonical.length;

  console.log(`\n=== SUMMARY ===`);
  console.log(`  checked:                ${rows.length}`);
  console.log(`  broken (non-200):       ${broken.length}`);
  console.log(`  soft 404:               ${softFour04.length}`);
  console.log(`  thin (<${MIN_WORDS}w):          ${thin.length}`);
  console.log(`  missing title:          ${noTitle.length}`);
  console.log(`  missing description:    ${noDesc.length}`);
  console.log(`  missing canonical:      ${noCanonical.length}`);
  console.log(`  h1 != 1:                ${badH1.length}`);
  console.log(`  pages w/ dup text:      ${dupes.length}`);

  if (JSON_OUT) {
    await fs.writeFile(JSON_OUT, JSON.stringify(rows, null, 2), "utf8");
    console.log(`\n[audit] Full report written to ${JSON_OUT}`);
  }

  process.exit(failures > 0 ? 1 : 0);
}

main().catch((error) => {
  console.error("[audit] Failed:", error);
  process.exit(2);
});
