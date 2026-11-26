import { useEffect, useState } from "react";

/**
 * True while react-snap is rendering a page to static HTML (it sets this exact
 * user agent). Anything that changes the page *after* the first render (a
 * countdown from today's date, a value from localStorage) must not run then:
 * react-snap saves the DOM after effects have run, so the saved HTML would no
 * longer match the browser's first render and hydration would fail (#418),
 * throwing the prerendered page away.
 */
export const IS_PRERENDER = typeof navigator !== "undefined" && navigator.userAgent === "ReactSnap";

/**
 * false on the first render, true once the page has hydrated in a real browser.
 * Never true during prerender, so after-load content stays out of the saved HTML.
 */
export function useClientReady(): boolean {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!IS_PRERENDER) setReady(true);
  }, []);
  return ready;
}

/** The day this bundle was built (YYYY-MM-DD). */
export const BUILD_DATE: string =
  typeof __BUILD_DATE__ === "string" ? __BUILD_DATE__ : new Date().toISOString().slice(0, 10);

/**
 * "Today" as YYYY-MM-DD for date-dependent UI (open/closed, upcoming/past).
 * First render: the build day, identical in the prerender and the browser, so
 * the saved HTML hydrates. After mount, in a real browser: the visitor's date.
 */
export function useToday(): string {
  const [today, setToday] = useState(BUILD_DATE);
  useEffect(() => {
    if (!IS_PRERENDER) setToday(new Date().toISOString().slice(0, 10));
  }, []);
  return today;
}
