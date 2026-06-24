import { useState } from "react";
import { ChevronDown, Plus, Minus } from "lucide-react";

export interface SeoSection {
  /** Rendered as an <h2> */
  heading?: string;
  /** Rendered as an <h3> under the heading */
  subheading?: string;
  /** Body paragraphs */
  paragraphs?: string[];
  /** Optional bullet list */
  bullets?: string[];
}

export interface SeoFaqItem {
  question: string;
  answer: string;
}

interface SeoArticleProps {
  /** Main section title (<h2>) */
  title: string;
  /** Optional lead paragraph shown under the title */
  intro?: string;
  sections?: SeoSection[];
  faqs?: SeoFaqItem[];
  /** Accent color for headings / markers */
  accent?: string;
  /** Small uppercase chip label above the title */
  eyebrow?: string;
  className?: string;
}

/**
 * Reusable long-form, SEO-friendly content block. Matches the site's section
 * language (max-w-7xl, chip heading, white cards) so it complements the rest
 * of the page. Renders real, crawlable text (headings, paragraphs, lists, FAQ);
 * collapsed behind a "Read more" toggle. All text stays in the DOM for crawlers.
 */
export default function SeoArticle({
  title,
  intro,
  sections = [],
  faqs = [],
  accent = "#2F43F2",
  eyebrow = "ProCounsel Guide",
  className = "",
}: SeoArticleProps) {
  const [expanded, setExpanded] = useState(false);
  const hasMore = sections.length > 2 || faqs.length > 0;

  return (
    <section className={`w-full bg-[#F6F8FE] ${className}`} aria-label={title}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
        {/* Chip heading — matches other sections */}
        <div className="inline-flex items-center gap-2 bg-white border border-gray-100 rounded-[6px] px-3 py-1 shadow-sm">
          <span className="w-4 h-4 shrink-0" style={{ backgroundColor: accent }} />
          <span className="font-poppins font-semibold text-[13px] md:text-[14px] tracking-[0.07em] text-[#0E1629] uppercase leading-none">
            {eyebrow}
          </span>
        </div>

        {/* Title + intro */}
        <h2 className="mt-5 font-poppins font-bold text-[24px] md:text-[34px] leading-[1.25] text-[#0E1629] max-w-4xl">
          {title}
        </h2>
        {intro && (
          <p className="mt-4 font-poppins text-[15px] md:text-[17px] leading-[1.85] text-[#4B5366] max-w-4xl">
            {intro}
          </p>
        )}

        {/* Collapsible body */}
        <div className="relative mt-9">
          <div
            className={`transition-all duration-500 ${
              expanded ? "max-h-none" : "max-h-[420px] overflow-hidden"
            }`}
          >
            {/* Section cards in a responsive grid to fill the width */}
            {sections.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-6 items-start">
                {sections.map((section, i) => (
                  <article
                    key={i}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 h-full"
                  >
                    {section.heading && (
                      <>
                        <span
                          className="block h-1 w-10 rounded-full mb-4"
                          style={{ backgroundColor: accent }}
                          aria-hidden
                        />
                        <h3 className="font-poppins font-bold text-[18px] md:text-[21px] leading-snug text-[#0E1629]">
                          {section.heading}
                        </h3>
                      </>
                    )}
                    {section.subheading && (
                      <h4
                        className="mt-3 font-poppins font-semibold text-[15px] md:text-[17px]"
                        style={{ color: accent }}
                      >
                        {section.subheading}
                      </h4>
                    )}
                    {section.paragraphs?.map((p, j) => (
                      <p
                        key={j}
                        className="mt-3 font-poppins text-[14.5px] md:text-[16px] leading-[1.8] text-[#4B5366]"
                      >
                        {p}
                      </p>
                    ))}
                    {section.bullets && section.bullets.length > 0 && (
                      <ul className="mt-4 space-y-2.5">
                        {section.bullets.map((b, k) => (
                          <li key={k} className="flex gap-3">
                            <span
                              className="mt-2 h-1.5 w-1.5 rounded-full shrink-0"
                              style={{ backgroundColor: accent }}
                              aria-hidden
                            />
                            <span className="font-poppins text-[14.5px] md:text-[16px] leading-[1.7] text-[#4B5366]">
                              {b}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </article>
                ))}
              </div>
            )}

            {/* FAQ — full-width accordion rows */}
            {faqs.length > 0 && (
              <div className="mt-10">
                <h3 className="font-poppins font-bold text-[20px] md:text-[26px] text-[#0E1629] mb-5">
                  Frequently Asked Questions
                </h3>
                <div className="space-y-3">
                  {faqs.map((faq, i) => (
                    <FaqRow key={i} faq={faq} accent={accent} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Fade overlay when collapsed */}
          {!expanded && hasMore && (
            <div
              className="pointer-events-none absolute bottom-0 left-0 right-0 h-32"
              style={{
                background: "linear-gradient(180deg, rgba(246,248,254,0) 0%, #F6F8FE 95%)",
              }}
              aria-hidden
            />
          )}
        </div>

        {/* Read more / less */}
        {hasMore && (
          <div className="mt-7 flex justify-center">
            <button
              type="button"
              onClick={() => setExpanded((e) => !e)}
              aria-expanded={expanded}
              className="inline-flex items-center gap-2 rounded-full px-7 py-3 font-poppins font-semibold text-[14px] text-white transition-opacity hover:opacity-90 cursor-pointer shadow-sm"
              style={{ backgroundColor: accent }}
            >
              {expanded ? (
                <>
                  Read less <Minus className="h-4 w-4" />
                </>
              ) : (
                <>
                  Read more <Plus className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

function FaqRow({ faq, accent }: { faq: SeoFaqItem; accent: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="rounded-xl border bg-white overflow-hidden transition-colors"
      style={{ borderColor: open ? accent : "#E5E7EB" }}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-3 px-4 sm:px-6 py-4 md:py-[18px] text-left cursor-pointer"
      >
        <span className="font-poppins font-medium text-[15px] md:text-[18px] text-[#0E1629]">
          {faq.question}
        </span>
        <ChevronDown
          className={`h-5 w-5 md:h-6 md:w-6 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
          style={{ color: accent }}
        />
      </button>
      {/* Answer stays in the DOM (crawlable); visually collapsed when closed */}
      <div
        className={`px-4 sm:px-6 transition-all duration-300 ${
          open ? "pb-4 md:pb-[18px] max-h-[1000px]" : "max-h-0 overflow-hidden"
        }`}
      >
        <p className="font-poppins text-[14px] md:text-[16px] leading-[1.75] text-[#6B7280]">
          {faq.answer}
        </p>
      </div>
    </div>
  );
}
