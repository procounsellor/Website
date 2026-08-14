// Tags the prerendered SEO markup so the app can drop it at hydration.
//
// The problem
// -----------
// react-helmet-async@3 detects React 19 (`isReact19`) and stops injecting head
// tags itself: it renders <title>/<meta>/<link> as ordinary React elements and
// lets React 19's native metadata hoisting move them into <head>. React does
// not adopt the identical tags already sitting in the prerendered HTML, so
// after hydration every page carries two <title>s, two canonicals and two
// descriptions. The values match, so nothing is misrepresented — but a crawler
// reading the rendered DOM sees duplicated head tags, which is noise nobody
// wants in an AdSense or Search Console review.
//
// The fix
// -------
// Mark the prerendered SEO tags here; main.tsx removes them immediately before
// hydrating, leaving React's copies as the only ones. Crawlers that do not run
// JavaScript still read the full prerendered meta, because nothing is removed
// until the app boots.

import fs from "node:fs/promises";
import path from "node:path";

const DIST = path.resolve(process.cwd(), "dist");

/** Only the tags PageSEO renders — never touch anything hand-written in index.html. */
const PATTERNS = [
  /<title(?![^>]*data-prerendered-seo)([^>]*)>/i,
  /<meta(?![^>]*data-prerendered-seo)([^>]*\sname="(?:description|keywords|robots|twitter:[^"]+)"[^>]*)>/gi,
  /<meta(?![^>]*data-prerendered-seo)([^>]*\sproperty="og:[^"]+"[^>]*)>/gi,
  /<link(?![^>]*data-prerendered-seo)([^>]*\srel="canonical"[^>]*)>/gi,
  /<script(?![^>]*data-prerendered-seo)([^>]*\stype="application\/ld\+json"[^>]*)>/gi,
];

async function* htmlFiles(dir) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* htmlFiles(full);
    else if (entry.name.endsWith(".html")) yield full;
  }
}

async function main() {
  let files = 0;
  let stamped = 0;

  for await (const file of htmlFiles(DIST)) {
    const original = await fs.readFile(file, "utf8");
    let html = original;

    for (const pattern of PATTERNS) {
      html = html.replace(pattern, (match, attrs) => {
        stamped += 1;
        const tag = match.slice(1, match.indexOf(attrs) || match.length - 1).trim().split(/\s/)[0];
        return `<${tag} data-prerendered-seo=""${attrs}>`;
      });
    }

    if (html !== original) {
      await fs.writeFile(file, html, "utf8");
      files += 1;
    }
  }

  console.log(`[prerender-seo] Tagged ${stamped} prerendered SEO tags across ${files} prerendered pages.`);
}

main().catch((error) => {
  // Never fail the build for this: duplicated-but-identical head tags are
  // cosmetic, and a broken deploy is not.
  console.warn("[prerender-seo] Skipped:", error?.message || error);
});
