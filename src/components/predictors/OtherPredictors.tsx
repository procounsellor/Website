import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { PREDICTORS } from "./predictorList";

interface OtherPredictorsProps {
  /** Path of the current predictor, so it's excluded from the suggestions. */
  currentPath: string;
  /** Accent for the section heading marker. */
  accent?: string;
}

/**
 * "Explore other predictors" cross-link section shown at the bottom of every
 * predictor page so users can hop between rank/college tools for each exam.
 */
export default function OtherPredictors({ currentPath, accent = "#2F43F2" }: OtherPredictorsProps) {
  const navigate = useNavigate();
  const others = PREDICTORS.filter((p) => p.path !== currentPath);

  if (others.length === 0) return null;

  return (
    <section className="w-full">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center gap-2 mb-5">
          <span className="h-5 w-1 rounded-full" style={{ backgroundColor: accent }} />
          <h2 className="font-poppins font-bold text-[20px] md:text-[24px] text-[#0E1629]">
            Explore Other Predictors
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {others.map((p) => (
            <button
              key={p.path}
              type="button"
              onClick={() => navigate(p.path)}
              className="group text-left rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all p-5 cursor-pointer"
              style={{ background: p.tint }}
            >
              <div className="flex items-center justify-between">
                <div
                  className="flex items-center justify-center h-10 w-10 rounded-xl text-white"
                  style={{ backgroundColor: p.accent }}
                >
                  {p.icon}
                </div>
                <span
                  className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: `${p.accent}1A`, color: p.accent }}
                >
                  {p.exam}
                </span>
              </div>
              <h3 className="mt-3 text-[15px] font-bold text-gray-900 leading-snug">{p.title}</h3>
              <span
                className="mt-3 inline-flex items-center gap-1 text-[13px] font-semibold group-hover:gap-2 transition-all"
                style={{ color: p.accent }}
              >
                Open
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
