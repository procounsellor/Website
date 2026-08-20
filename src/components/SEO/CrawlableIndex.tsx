import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";

export interface CrawlableLink {
  to: string;
  label: string;
}

/**
 * A plain list of internal links, collapsed behind a native <details> toggle.
 *
 * Every listing surface on this site hides most of its rows from a crawler for
 * a different reason: the counsellor grid paginates behind infinite scroll, the
 * deadlines page ships with a type filter pre-applied, and the colleges section
 * shows only the first four. Googlebot does not scroll, click, or clear filters,
 * so the rows it never sees are URLs with no inbound internal link — the
 * "Discovered - currently not indexed" state those pages sat in.
 *
 * Collapsed, NOT hidden. The markup is always in the DOM and any reader can
 * open it; it is simply closed by default so a long link list does not dominate
 * the page. That is an ordinary UI pattern Google is explicit about supporting.
 * Showing a crawler links that a reader cannot reach at all would be cloaking,
 * which risks a manual action — so do not "solve" the visual problem that way.
 */
export default function CrawlableIndex({
  title,
  links,
  ariaLabel,
  defaultOpen = false,
}: {
  title: string;
  links: CrawlableLink[];
  ariaLabel: string;
  /** Open on load. Leave false for long lists. */
  defaultOpen?: boolean;
}) {
  if (links.length === 0) return null;

  return (
    <nav
      aria-label={ariaLabel}
      className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 xl:px-12 py-6 border-t border-[#E3E8F4]"
    >
      <details open={defaultOpen} className="group">
        <summary className="flex cursor-pointer list-none items-center gap-2 text-[0.875rem] font-medium text-(--text-muted) hover:text-[#2F43F2] transition-colors [&::-webkit-details-marker]:hidden">
          <ChevronDown className="h-4 w-4 shrink-0 transition-transform group-open:rotate-180" />
          {title}
          <span className="text-[0.75rem] font-normal opacity-70">({links.length})</span>
        </summary>
        <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2">
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
      </details>
    </nav>
  );
}
