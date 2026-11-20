import { homeFaqs } from "@/components/SEO/homeSeoContent";
import { EXAM_DATES, EXAM_DATES_CHECKED, EXAM_KEYS, EXAM_TOOLS, daysUntil } from "@/data/homeExams";
import { absoluteUrl } from "@/lib/siteUrl.mjs";

/**
 * Structured data for the home page, built from the same data the page shows,
 * so the JSON-LD can never describe something a visitor cannot see.
 */

/** FAQPage from the visible home FAQ list. */
export function homeFaqSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: homeFaqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

/**
 * One Event per entrance exam with a confirmed date that has not passed yet.
 * Windows and "dates awaited" exams are left out: an Event needs a real start.
 */
export function examEventSchemas(now: Date = new Date()) {
  return EXAM_DATES.filter((e) => e.start && daysUntil(e.end ?? e.start, now) >= 0).map((e) => ({
    "@context": "https://schema.org",
    "@type": "Event",
    name: e.name,
    description: `${e.name} entrance exam: ${e.long}. Conducted by ${e.body}. Date last checked on ${EXAM_DATES_CHECKED.label} against the official website.`,
    startDate: e.start,
    endDate: e.end ?? e.start,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: "Test centres across India",
      address: { "@type": "PostalAddress", addressCountry: "IN" },
    },
    organizer: { "@type": "Organization", name: e.body, url: e.site },
    url: e.site,
    isAccessibleForFree: false,
  }));
}

/** The free tools on the home page, as an ItemList (same-site, public pages only). */
export function freeToolsSchema() {
  const seen = new Set<string>();
  const tools = EXAM_KEYS.flatMap((k) => EXAM_TOOLS[k]).filter((t) => {
    if (!t.free || t.mbaApp || seen.has(t.to)) return false;
    seen.add(t.to);
    return true;
  });
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Free admission tools on ProCounsel",
    description: "Free college predictors, rank predictors, cut-offs and exam guides for MBA (CAT), NEET and JEE students.",
    itemListElement: tools.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.label,
      description: t.desc,
      url: absoluteUrl(t.to),
    })),
  };
}
