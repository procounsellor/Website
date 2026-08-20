import { Link } from "react-router-dom";

export interface CrawlableLink {
  to: string;
  label: string;
}

/**
 * A plain, always-rendered list of internal links.
 *
 * Every listing surface on this site hides most of its rows from a crawler for
 * a different reason: the counsellor grid paginates behind infinite scroll, the
 * deadlines page ships with a type filter pre-applied, and the colleges section
 * shows only the first four. Googlebot does not scroll, click, or clear
 * filters, so in each case the rows it never sees are URLs with no inbound
 * internal link — which is exactly the "Discovered - currently not indexed"
 * state those pages sat in.
 *
 * This renders from build-time snapshot data, so the links are present in the
 * prerendered HTML rather than appearing only after the API responds. Keep it
 * cheap: text links only, no images, no fetching.
 */
export default function CrawlableIndex({
  title,
  links,
  ariaLabel,
}: {
  title: string;
  links: CrawlableLink[];
  ariaLabel: string;
}) {
  if (links.length === 0) return null;

  return (
    <nav
      aria-label={ariaLabel}
      className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 xl:px-12 py-10 border-t border-[#E3E8F4]"
    >
      <h2 className="font-[Poppins] text-[1rem] font-semibold text-(--text-main) mb-4">
        {title}
      </h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2">
        {links.map((l) => (
          <li key={l.to}>
            <Link
              to={l.to}
              className="font-[Poppins] text-[0.8125rem] text-(--text-muted) hover:text-[#2F43F2] hover:underline"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
