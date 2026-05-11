import fs from "node:fs/promises";
import path from "node:path";
import { buildSitemapXml, getPublicRoutes } from "./site-routes.mjs";

const OUTPUT_PATH = path.resolve(process.cwd(), "public", "sitemap.xml");

async function main() {
  const routes = await getPublicRoutes();
  const xml = buildSitemapXml(routes);

  await fs.writeFile(OUTPUT_PATH, xml, "utf8");
  console.log(`[sitemap] Generated ${routes.length} URLs at ${OUTPUT_PATH}`);
}

main().catch((error) => {
  console.error("[sitemap] Generation failed:", error);
  process.exit(1);
});
