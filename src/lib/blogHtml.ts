// Heading hygiene for author-written blog bodies.
//
// Blog bodies come from the CMS as free-form HTML, and authors nearly always
// open a post by repeating its title as an <h1>. Rendered as-is that gave every
// blog page two <h1>s — the page heading and the body heading — and printed the
// same sentence twice, which is exactly the duplicate-content pattern the
// AdSense review flagged elsewhere on the site.
//
// Kept out of BlogDetailPage.tsx so the component file only exports a
// component (react-refresh) and so these stay unit-testable on their own.

/**
 * Demotes every <h1> in a body to <h2>, preserving attributes, so the rendered
 * post keeps exactly one top-level heading (the page's own).
 */
export function demoteBodyHeadings(html: string): string {
  return html
    .replace(/<h1(\s[^>]*)?>/gi, (_m, attrs) => `<h2${attrs ?? ""}>`)
    .replace(/<\/h1>/gi, "</h2>");
}

const normalizeHeading = (value: string) =>
  value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/[^a-z0-9 ]/gi, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

/**
 * Drops a leading heading in the post body when it just restates the post
 * title. Only the first heading is ever considered — repeated headings deeper
 * in the article are the author's structure and are left alone.
 */
export function dropRedundantLeadingHeading(html: string, title: string): string {
  const wantedTitle = normalizeHeading(title);
  if (!wantedTitle) return html;

  return html.replace(/^\s*<h([1-6])(?:\s[^>]*)?>([\s\S]*?)<\/h\1>\s*/i, (match, _level, inner) => {
    const heading = normalizeHeading(inner);
    if (!heading) return match;
    // Authors often extend the title with a subtitle ("… : A Complete Guide"),
    // so treat a prefix match in either direction as the same heading.
    const isSame = heading.startsWith(wantedTitle) || wantedTitle.startsWith(heading);
    return isSame ? "" : match;
  });
}
