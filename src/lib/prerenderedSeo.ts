/**
 * Removes prerendered <head> SEO tags once React has rendered its own copy.
 *
 * Why this exists
 * ---------------
 * react-helmet-async@3 detects React 19 and stops injecting head tags itself:
 * it renders <title>/<meta>/<link> as ordinary elements and lets React 19's
 * native metadata hoisting move them into <head>. React does not adopt the
 * identical tags already present in react-snap's prerendered HTML, so every
 * page ended up with two titles, two canonicals and two descriptions.
 *
 * Why it waits instead of deleting up front
 * -----------------------------------------
 * Deleting the prerendered tags at hydration looks simpler and is wrong: pages
 * that render their SEO only after data arrives (blog articles fetch the post
 * first) are left with NO title, description or canonical until that request
 * lands — and with none at all if it fails. So each prerendered tag is removed
 * only at the moment a non-prerendered equivalent shows up. If React never
 * renders one, the prerendered tag stays and the page keeps its meta.
 */

const MARKER = "data-prerendered-seo";

/** Matches a prerendered tag to the selector that would find React's version. */
function selectorFor(el: Element): string | null {
  const tag = el.tagName.toLowerCase();
  if (tag === "title") return "title";
  if (tag === "link") return 'link[rel="canonical"]';
  if (tag === "script") return 'script[type="application/ld+json"]';
  if (tag === "meta") {
    const name = el.getAttribute("name");
    if (name) return `meta[name="${CSS.escape(name)}"]`;
    const property = el.getAttribute("property");
    if (property) return `meta[property="${CSS.escape(property)}"]`;
  }
  return null;
}

/** Drops every prerendered tag that React has already replaced. */
function sweep(): number {
  const prerendered = Array.from(document.head.querySelectorAll(`[${MARKER}]`));
  for (const el of prerendered) {
    const selector = selectorFor(el);
    if (!selector) continue;
    const replaced = Array.from(document.head.querySelectorAll(selector)).some(
      (other) => other !== el && !other.hasAttribute(MARKER),
    );
    if (replaced) el.remove();
  }
  return document.head.querySelectorAll(`[${MARKER}]`).length;
}

/**
 * Watches <head> until every prerendered tag has been replaced, then stops.
 * The timeout is a backstop so a page that legitimately never renders some of
 * its meta does not leave an observer running for the whole session.
 */
export function dropPrerenderedSeoWhenReplaced(timeoutMs = 15000): void {
  if (typeof document === "undefined") return;
  if (!document.head.querySelector(`[${MARKER}]`)) return;

  if (sweep() === 0) return;

  const observer = new MutationObserver(() => {
    if (sweep() === 0) observer.disconnect();
  });
  observer.observe(document.head, { childList: true });
  setTimeout(() => observer.disconnect(), timeoutMs);
}
