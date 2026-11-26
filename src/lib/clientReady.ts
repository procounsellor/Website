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
