import fs from "node:fs/promises";
import path from "node:path";

const SITE_URL = process.env.SITE_URL || "https://www.procounsel.co.in";
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
  "/admissions/deadlines",
  "/courses",
  "/courses/course-listing",
  "/courses/test-listing",
  "/courses/session-listing",
  "/counsellor-listing",
  "/pro-buddies",
  "/pro-buddies/listing",
  "/pro-buddies/college-listing",
  "/community",
  "/jee-rank-predictor",
  "/jee-college-predictor",
  "/mhtcet-college-predictor",
  "/about",
  "/contact",
  "/privacy-policy",
  "/terms",
  "/cancellation-refund",
  "/shipping-exchange",
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

function encodeCounselorId(id) {
  if (!id) return "";
  const encoded = Buffer.from(id).toString("base64");
  return encoded.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

async function getApiBaseUrl() {
  return (
    process.env.VITE_API_BASE_URL ||
    process.env.API_BASE_URL ||
    (await readApiBaseUrlFromEnvFiles())
  );
}

async function fetchBlogSlugs() {
  const apiBaseUrl = await getApiBaseUrl();

  if (!apiBaseUrl) {
    console.warn("[sitemap] VITE_API_BASE_URL/API_BASE_URL not set; skipping dynamic blog slugs.");
    return [];
  }

  const endpoint = `${apiBaseUrl.replace(/\/$/, "")}/api/blogs/list`;

  try {
    const response = await fetch(endpoint, { headers: { Accept: "application/json" } });

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

async function fetchCounsellorIds() {
  const apiBaseUrl = await getApiBaseUrl();
  if (!apiBaseUrl) return [];

  try {
    const response = await fetch(
      `${apiBaseUrl.replace(/\/$/, "")}/api/shared/getAllCounsellors`,
      { headers: { Accept: "application/json" } }
    );
    if (!response.ok) {
      console.warn(`[sitemap] Could not fetch counsellors (${response.status}).`);
      return [];
    }
    const json = await response.json();
    const rows = parseListPayload(json);
    const ids = rows
      .map((item) => item?.counsellorId || item?.id || "")
      .filter(Boolean)
      .map(encodeCounselorId)
      .filter(Boolean);
    console.log(`[sitemap] Fetched ${ids.length} counsellor IDs.`);
    return Array.from(new Set(ids));
  } catch (error) {
    console.warn("[sitemap] Failed to fetch counsellors:", error);
    return [];
  }
}

async function fetchCollegeIds() {
  const apiBaseUrl = await getApiBaseUrl();
  if (!apiBaseUrl) return [];

  try {
    const response = await fetch(
      `${apiBaseUrl.replace(/\/$/, "")}/api/featured_colleges/all`,
      { headers: { Accept: "application/json" } }
    );
    if (!response.ok) {
      console.warn(`[sitemap] Could not fetch colleges (${response.status}).`);
      return [];
    }
    const json = await response.json();
    const rows = parseListPayload(json);
    const ids = rows
      .map((item) => item?.collegeId || item?.id || "")
      .filter(Boolean);
    console.log(`[sitemap] Fetched ${ids.length} college IDs.`);
    return Array.from(new Set(ids));
  } catch (error) {
    console.warn("[sitemap] Failed to fetch colleges:", error);
    return [];
  }
}

function routeToPriority(route) {
  if (route === "/") return "1.0";
  if (route === "/admissions" || route === "/courses") return "0.9";
  if (route === "/community" || route === "/counsellor-listing" || route === "/pro-buddies") return "0.85";
  if (route === "/jee-rank-predictor" || route === "/jee-college-predictor" || route === "/mhtcet-college-predictor") return "0.85";
  if (route === "/admissions/blogs" || route === "/admissions/deadlines") return "0.8";
  if (route.startsWith("/counsellor-details/") || route.startsWith("/counsellor/")) return "0.75";
  if (route.startsWith("/college-details/")) return "0.75";
  if (route.startsWith("/admissions/blogs/slug/")) return "0.7";
  if (route.startsWith("/admissions/blog-authors")) return "0.7";
  if (route === "/pro-buddies/listing" || route === "/pro-buddies/college-listing") return "0.75";
  if (route === "/courses/course-listing" || route === "/courses/test-listing") return "0.75";
  if (route === "/about" || route === "/contact") return "0.6";
  return "0.5";
}

function routeToChangeFreq(route) {
  if (route === "/" || route === "/admissions/blogs" || route === "/admissions/deadlines") return "daily";
  if (route === "/admissions" || route === "/community") return "weekly";
  if (route.startsWith("/admissions/blogs/slug/")) return "weekly";
  if (route.startsWith("/admissions/blog-authors")) return "weekly";
  if (route === "/counsellor-listing" || route === "/pro-buddies" || route === "/pro-buddies/listing") return "weekly";
  if (route.startsWith("/counsellor-details/") || route.startsWith("/counsellor/")) return "monthly";
  if (route.startsWith("/college-details/")) return "monthly";
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
  const [blogSlugs, counsellorIds, collegeIds] = await Promise.all([
    fetchBlogSlugs(),
    fetchCounsellorIds(),
    fetchCollegeIds(),
  ]);

  const dynamicRoutes = [
    ...blogSlugs.map((slug) => `/admissions/blogs/slug/${slug}`),
    ...counsellorIds.map((id) => `/counsellor-details/${id}`),
    ...collegeIds.map((id) => `/college-details/${id}`),
  ];

  const allRoutes = Array.from(new Set([...STATIC_ROUTES, ...dynamicRoutes]));
  const xml = buildSitemapXml(allRoutes);

  await fs.writeFile(OUTPUT_PATH, xml, "utf8");
  console.log(`[sitemap] Generated ${allRoutes.length} URLs at ${OUTPUT_PATH}`);
}

main().catch((error) => {
  console.error("[sitemap] Generation failed:", error);
  process.exit(1);
});
