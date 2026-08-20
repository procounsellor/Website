import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { COUNSELLING_CATEGORIES } from "@/lib/counsellingCategories";

/**
 * "What do you need counselling for?" — the entry strip to the category landing
 * pages, on the home page and /admissions.
 *
 * These are the site's commercial-intent pages, and until now the only links to
 * them were in the pre-footer band. That is weak placement for the pages meant
 * to convert: this puts them on the highest-authority page in the site, both as
 * a real user path and as a strong internal link signal.
 */
export default function CounsellingCategories() {
  return (
    <section className="w-full py-10 md:py-14">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 xl:px-12">
        <h2 className="font-[Poppins] text-[20px] md:text-[28px] font-semibold text-[#0E1629]">
          What do you need counselling for?
        </h2>
        <p className="mt-2 text-[14px] md:text-[15px] text-(--text-muted) max-w-2xl">
          Talk to a counsellor who works on your stream every day — not a generalist.
        </p>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {COUNSELLING_CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              to={`/${cat.slug}`}
              className="group flex items-start justify-between gap-3 rounded-2xl border border-[#E3E8F4] bg-white px-5 py-4 hover:border-[#2F43F2]/40 hover:shadow-md transition-all"
            >
              <span className="min-w-0">
                <span className="block font-[Poppins] font-semibold text-[15px] text-[#0E1629]">
                  {cat.name}
                </span>
                <span className="mt-1 block text-[12.5px] text-(--text-muted) truncate">
                  {cat.exams.slice(0, 4).map((e) => e.name).join(" · ")}
                </span>
              </span>
              <ArrowRight className="h-4 w-4 shrink-0 mt-1 text-gray-300 group-hover:text-[#2F43F2] group-hover:translate-x-0.5 transition-all" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
