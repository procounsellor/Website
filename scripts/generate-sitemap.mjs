import fs from "node:fs/promises";
import path from "node:path";

const SITE_URL = process.env.SITE_URL || "https://procounsel.co.in";
const OUTPUT_PATH = path.resolve(process.cwd(), "public", "sitemap.xml");

async function readApiBaseUrlFromEnvFiles() {
  const candidates = [
    path.resolve(process.cwd(), ".env"),
    path.resolve(process.cwd(), ".env.local"),
    path.resolve(process.cwd(), ".env.example"),
  ];

  for (const filePath of candidates) {
    try {
      const content = await fs.readFile(filePath, "utf8");
      const lines = content.split(/\r?\n/);
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const [key, ...rest] = trimmed.split("=");
        if (!key || rest.length === 0) continue;
        const value = rest.join("=").trim().replace(/^['\"]|['\"]$/g, "");
        if (key === "VITE_API_BASE_URL" && value) {
          return value;
        }
      }
    } catch {
      // Ignore missing env files
    }
  }

  return "";
}

const STATIC_ROUTES = [
  "/",
  "/admissions",
  "/admissions/blogs",
  "/admissions/blog-authors",
  "/admissions/blog-authors/aswini-verma",
  "/admissions/blog-authors/ashutosh-kumar",
  "/admissions/blog-authors/kiran-kudke",
  "/admissions/blog-authors/ananya",
  "/courses",
  "/courses/course-listing",
  "/courses/test-listing",
  "/courses/session-listing",
  "/revamp-courses",
  "/revamp-about",
  "/counsellor-listing",
  "/pro-buddies",
  "/pro-buddies/register",
  "/pro-buddies/listing",
  "/pro-buddies/college-listing",
  "/community",
  "/about",
  "/contact",
  "/privacy-policy",
  "/terms",
  "/cancellation-refund",
  "/shipping-exchange",
  "/sitemap",
  "/gurucool",
  "/promo",
  "/testSeries/pcsat",
  "/subscribe",
];

function toSlug(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function parseListPayload(json) {
  if (!json) return [];
  if (Array.isArray(json)) return json;
  if (typeof json !== "object") return [];

  const candidateKeys = ["data", "blogs", "items", "content", "result", "payload"];
  for (const key of candidateKeys) {
    const value = json[key];
    if (Array.isArray(value)) return value;
  }

  return [];
}

async function fetchBlogSlugs() {
  const apiBaseUrl =
    process.env.VITE_API_BASE_URL ||
    process.env.API_BASE_URL ||
    (await readApiBaseUrlFromEnvFiles());

  if (!apiBaseUrl) {
    console.warn("[sitemap] VITE_API_BASE_URL/API_BASE_URL not set; skipping dynamic blog slugs.");
    return [];
  }

  const endpoint = `${apiBaseUrl.replace(/\/$/, "")}/api/blogs/list`;

  try {
    const response = await fetch(endpoint, {
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      console.warn(`[sitemap] Could not fetch blog list (${response.status}).`);
      return [];
    }

    const json = await response.json();
    const rows = parseListPayload(json);

    const slugs = rows
      .map((item) => {
        const rawSlug = typeof item?.slug === "string" ? item.slug : "";
        if (rawSlug.trim()) return toSlug(rawSlug);
        const title = typeof item?.title === "string" ? item.title : "";
        return toSlug(title);
      })
      .filter(Boolean);

    return Array.from(new Set(slugs));
  } catch (error) {
    console.warn("[sitemap] Failed to fetch dynamic slugs:", error);
    return [];
  }
}

function routeToPriority(route) {
  if (route === "/") return "1.0";
  if (route.startsWith("/admissions/blogs/slug/")) return "0.7";
  if (route.startsWith("/admissions/blog-authors")) return "0.7";
  if (route === "/admissions" || route === "/courses") return "0.9";
  return "0.6";
}

function routeToChangeFreq(route) {
  if (route === "/" || route === "/admissions/blogs") return "daily";
  if (route.startsWith("/admissions/blogs/slug/")) return "weekly";
  if (route.startsWith("/admissions/blog-authors")) return "weekly";
  return "monthly";
}

function buildSitemapXml(routes) {
  const today = new Date().toISOString().slice(0, 10);

  const urls = routes
    .map((route) => {
      const cleanRoute = route.startsWith("/") ? route : `/${route}`;
      const loc = `${SITE_URL.replace(/\/$/, "")}${cleanRoute}`;
      const changefreq = routeToChangeFreq(cleanRoute);
      const priority = routeToPriority(cleanRoute);

      return [
        "  <url>",
        `    <loc>${loc}</loc>`,
        `    <lastmod>${today}</lastmod>`,
        `    <changefreq>${changefreq}</changefreq>`,
        `    <priority>${priority}</priority>`,
        "  </url>",
      ].join("\n");
    })
    .join("\n");

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urls,
    "</urlset>",
    "",
  ].join("\n");
}

async function main() {
  const dynamicSlugs = await fetchBlogSlugs();
  const dynamicRoutes = dynamicSlugs.map((slug) => `/admissions/blogs/slug/${slug}`);

  const allRoutes = Array.from(new Set([...STATIC_ROUTES, ...dynamicRoutes]));
  const xml = buildSitemapXml(allRoutes);

  await fs.writeFile(OUTPUT_PATH, xml, "utf8");
  console.log(`[sitemap] Generated ${allRoutes.length} URLs at ${OUTPUT_PATH}`);
}

main().catch((error) => {
  console.error("[sitemap] Generation failed:", error);
  process.exit(1);
});
