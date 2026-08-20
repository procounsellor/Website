import CrawlableIndex from "./CrawlableIndex";
import { INDEXABLE_COUNSELLORS } from "@/hooks/useCounselors";

/** Crawl path to every indexable counsellor profile. See CrawlableIndex. */
export default function CounsellorIndexLinks() {
  const links = INDEXABLE_COUNSELLORS.map((c) => {
    const name = `${c.firstName ?? ""} ${c.lastName ?? ""}`.trim() || "Counsellor";
    return {
      to: `/counsellor-details/${c.encodedId}`,
      label: c.city ? `${name} — admission counsellor in ${c.city}` : name,
    };
  });

  return (
    <CrawlableIndex
      title="Browse all admission counsellors"
      ariaLabel="All admission counsellors"
      links={links}
    />
  );
}
