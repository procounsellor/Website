/**
 * Fade-and-rise as a section scrolls into view.
 *
 * Skipped when:
 * - react-snap is prerendering (the snapshot must show the content, not an
 *   opacity-0 start state);
 * - the page was served prerendered and is hydrating — the sections are
 *   already visible in the HTML, and starting them at opacity 0 would make
 *   them blink out and back in (and mismatch the server markup);
 * - the visitor asks for reduced motion.
 * So the effect only runs on client-side navigation to the home page.
 */
const isSnap = typeof navigator !== "undefined" && navigator.userAgent === "ReactSnap";
const prefersReduced =
  typeof window !== "undefined" && typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
// Evaluated when this module first loads. On a prerendered page the home
// sections are already in the DOM, so this is true.
const servedPrerendered = typeof document !== "undefined" && !!document.getElementById("daily-boost");

export const revealProps =
  isSnap || prefersReduced || servedPrerendered
    ? {}
    : {
        initial: { opacity: 0, y: 18 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.15 },
        transition: { duration: 0.45, ease: "easeOut" as const },
      };
