import { Link } from "react-router-dom";
import { COUNSELLING_CATEGORIES } from "@/lib/counsellingCategories";

/**
 * "What do you need counselling for?" — the entry strip to the category landing
 * pages, on the home page and /admissions.
 *
 * These are the site's commercial-intent pages, and their only links used to be
 * in the pre-footer band, which is weak placement for the pages meant to
 * convert. Sitting directly under the hero it also works as an intent router:
 * a visitor picks their stream before scrolling through counsellors who may not
 * cover it.
 *
 * Follows the section language used by College/Deadlines/Blogs — tinted band,
 * white chip heading, white cards with the corner arrow motif.
 */
export default function CounsellingCategories() {
  return (
    <div className="bg-[#C6DDF040] w-full py-6 md:py-[60px]">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Chip heading — matches College.tsx / Deadlines */}
        <div className="flex items-center justify-start gap-[8px] md:gap-2 bg-white px-[12px] md:px-3 py-[4px] md:py-1 rounded-[4px] md:rounded-md mb-6 w-fit shrink-0">
          <div className="w-[16px] h-[16px] min-w-[16px] min-h-[16px] md:w-4 md:h-4 bg-[#0E1629] shrink-0" />
          <p className="font-[Poppins] font-semibold text-[12px] md:text-[14px] text-[#0E1629] uppercase tracking-[0.07em] md:tracking-wider leading-none md:leading-normal">
            COUNSELLING
          </p>
        </div>

        <p className="font-[Poppins] font-medium text-[12px] md:text-[24px] text-[#0E1629] max-w-[350px] md:max-w-[682px] leading-none md:leading-normal mb-6">
          What do you need counselling for? Talk to someone who works on your stream
          every day — not a generalist.
        </p>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
          {COUNSELLING_CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              to={`/${cat.slug}`}
              className="group relative overflow-hidden rounded-[12px] md:rounded-[16px] bg-white p-4 md:p-6 pr-10 md:pr-16 transition-shadow hover:shadow-md"
            >
              <h3 className="font-[Poppins] font-medium text-[14px] md:text-[20px] text-[#0E1629] leading-snug">
                {cat.name}
              </h3>
              <p className="mt-1.5 md:mt-2 font-[Poppins] text-[10px] md:text-[13px] text-[#6B7280] leading-snug line-clamp-2">
                {cat.exams.slice(0, 4).map((e) => e.name).join(" · ")}
              </p>

              {/* Corner arrow — the site's card motif */}
              <div className="absolute bottom-0 right-0 w-[36px] h-[33px] md:w-[52px] md:h-[48px] overflow-hidden">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 63 57"
                  preserveAspectRatio="none"
                  fill="none"
                  className="w-full h-full"
                >
                  <path
                    d="M5.22808 7.00026C5.73192 3.00014 9.13365 0 13.1654 0H54.9303C59.3486 0 62.9303 3.58172 62.9303 8V49C62.9303 53.4183 59.3486 57 54.9303 57H8.00116C3.18615 57 -0.537853 52.7775 0.0638728 48.0002L5.22808 7.00026Z"
                    className="fill-[#0E1629] transition-colors duration-300 group-hover:fill-[#2F43F2]"
                  />
                </svg>
                <img
                  loading="lazy"
                  decoding="async"
                  src="/arrow.svg"
                  alt=""
                  aria-hidden="true"
                  className="absolute top-1/2 left-1/2 w-[14px] h-[14px] md:w-[18px] md:h-[18px] -translate-x-1/2 -translate-y-1/2 transition-transform duration-300 group-hover:translate-x-[-30%]"
                  style={{ filter: "brightness(0) invert(1)" }}
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
