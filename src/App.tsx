import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { useEffect } from "react";
import AppRoutes from "./routes/AppRoutes";
import ScrollToTop from "./components/ui/ScrollToTop";
import NoInternet from "./components/common/NoInternet";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

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
        else source = "referral";
      } catch {
        source = "referral";
        detail = referrer;
      }
    }

    const utms = Object.fromEntries(new URLSearchParams(window.location.search));
    console.log("[ProCounsel] Visitor source:", source, detail ? `(${detail})` : "");
    console.log("[ProCounsel] Landing page:", window.location.pathname);

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
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </HelmetProvider>
  )
}