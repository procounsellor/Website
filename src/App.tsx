import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { useEffect, lazy, Suspense } from "react";
import AppRoutes from "./routes/AppRoutes";
import ScrollToTop from "./components/ui/ScrollToTop";
import NoInternet from "./components/common/NoInternet";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { persistVisitSource } from "./lib/leadSource";

// Dev-only: loaded as a separate chunk in dev, never bundled into production.
const ReactQueryDevtools = import.meta.env.DEV
  ? lazy(() =>
      import("@tanstack/react-query-devtools").then((m) => ({ default: m.ReactQueryDevtools }))
    )
  : () => null;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,  // prevents re-fetch flash when switching tabs
      retry: 1,                     // one retry on failure (not 3)
      staleTime: 60_000,            // 1-min default stale time
    },
  },
});

const ANALYTICS_API = "https://college-search-api.vercel.app";

// Hostnames whose traffic is real. Anything else — localhost, a LAN IP from
// `vite --host`, a *.vercel.app preview — is us, not a visitor.
const TRACKED_HOSTS = ["procounsel.co.in", "www.procounsel.co.in"];

/**
 * Should this page view reach the referrer analytics?
 *
 * Three ways the numbers used to be inflated, all of them by us:
 *   - `npm run dev` / `npm run preview`, every reload counting as a visit;
 *   - Vercel preview deployments on *.vercel.app;
 *   - the build-time prerender, which loads all ~240 pages in a headless
 *     Chrome (react-snap blocks third-party requests today, so this one is
 *     belt-and-braces — but it would come straight back if that flag changed).
 *
 * Local first-touch attribution still runs everywhere: it only writes to this
 * browser's storage, so it cannot skew a dashboard, and keeping it on means the
 * lead-source flow is testable in dev.
 */
function isRealVisit(): boolean {
  if (!import.meta.env.PROD) return false;
  if (typeof window === "undefined" || typeof navigator === "undefined") return false;
  if (!TRACKED_HOSTS.includes(window.location.hostname)) return false;
  // Puppeteer (react-snap) and other automation set this.
  if (navigator.webdriver) return false;
  if (/HeadlessChrome|ReactSnap|Prerender/i.test(navigator.userAgent)) return false;
  return true;
}

function useVisitorTracking() {
  useEffect(() => {
    const referrer = document.referrer;
    let source = "direct";
    let detail = "";

    if (referrer) {
      try {
        const url = new URL(referrer);
        const host = url.hostname.toLowerCase();
        detail = host;

        if (/google\./i.test(host)) source = "google";
        else if (/bing\./i.test(host)) source = "bing";
        else if (/yahoo\./i.test(host)) source = "yahoo";
        else if (/facebook\.|fb\./i.test(host)) source = "facebook";
        else if (/instagram\./i.test(host)) source = "instagram";
        else if (/twitter\.|x\.com/i.test(host)) source = "twitter/x";
        else if (/linkedin\./i.test(host)) source = "linkedin";
        else if (/youtube\./i.test(host)) source = "youtube";
        else if (/whatsapp\./i.test(host)) source = "whatsapp";
        else if (/quora\./i.test(host)) source = "quora";
        else if (/reddit\./i.test(host)) source = "reddit";
        else if (/telegram\.|t\.me/i.test(host)) source = "telegram";
        else source = "referral";
      } catch {
        source = "referral";
        detail = referrer;
      }
    }

    const utms = Object.fromEntries(new URLSearchParams(window.location.search));

    // Persist first-touch source so captureLead can use it after login.
    // Local-only, so it runs on every environment.
    persistVisitSource(source, utms["utm_source"] || "", window.location.pathname);

    if (!isRealVisit()) {
      if (import.meta.env.DEV) {
        console.log(
          "[ProCounsel] Visitor source:",
          source,
          detail ? `(${detail})` : "",
          "— not reported (development)",
        );
      }
      return;
    }

    // Fire-and-forget — never blocks the page
    fetch(`${ANALYTICS_API}/track-referrer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source,
        referrerUrl: referrer || "",
        landingPage: window.location.pathname,
        utmSource:   utms["utm_source"]   || "",
        utmMedium:   utms["utm_medium"]   || "",
        utmCampaign: utms["utm_campaign"] || "",
      }),
    }).catch(() => {}); // silently ignore network errors
  }, []);
}

export default function App(){
  useVisitorTracking();
  return(
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <NoInternet />
        <BrowserRouter>
          <ScrollToTop />
          <AppRoutes/>
        </BrowserRouter>
        {import.meta.env.DEV && (
          <Suspense fallback={null}>
            <ReactQueryDevtools initialIsOpen={false} />
          </Suspense>
        )}
      </QueryClientProvider>
    </HelmetProvider>
  )
}