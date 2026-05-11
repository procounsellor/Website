import { createRequire } from "node:module";
import { STATIC_ROUTES } from "./site-routes.mjs";

const require = createRequire(import.meta.url);
const { run } = require("react-snap");

async function main() {
  const routes = STATIC_ROUTES;

  await run({
    source: "dist",
    include: routes,
    crawl: true,
    publicPath: "/",
    skipThirdPartyRequests: true,
    waitFor: 2000,
  });

  console.log(`[react-snap] Prerendered ${routes.length} public routes`);
}

main().catch((error) => {
  console.error("[react-snap] Prerender failed:", error);
  process.exit(1);
});
