import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/AuthStore';

/**
 * Option form filling banner.
 *
 * Deliberately NOT built on PredictorBanner: those are pale, near-white cards
 * for free tools, and a paid service styled the same way disappeared among
 * them. This one is dark with a warm accent so it reads as the offer it is.
 */
const OptionFormBanner = () => {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const toggleLogin = useAuthStore((s) => s.toggleLogin);

  // Log in first, then land on the page — so the form is always filled under
  // the account they signed in with.
  const path = '/mhtcet-option-form-filling';
  const go = () => {
    if (isAuthenticated) { navigate(path); return; }
    toggleLogin(() => navigate(path));
  };

  return (
    <div
      onClick={go}
      className="relative w-full max-w-[648px] h-[300px] md:h-[265px] rounded-[12px] md:rounded-2xl overflow-hidden shrink-0 cursor-pointer"
      style={{ background: 'linear-gradient(115deg, #17123A 0%, #2B1259 55%, #7A2B02 100%)' }}
    >
      {/* Warm bloom, so the card has depth rather than a flat fill */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-16 -right-10 w-64 h-64 rounded-full blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(250,102,15,0.55) 0%, rgba(250,102,15,0) 70%)' }}
      />

      {/* The ranked list, the thing we actually sell */}
      <div aria-hidden className="absolute right-5 bottom-5 hidden md:block w-[190px] opacity-95">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`flex items-center gap-2 rounded-lg px-2.5 py-2 ${i > 0 ? 'mt-2' : ''}`}
            style={{ background: i === 0 ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.09)' }}
          >
            <span
              className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] font-bold font-poppins tabular-nums"
              style={{
                background: i === 0 ? '#FA660F' : 'rgba(255,255,255,0.22)',
                color: i === 0 ? '#fff' : 'rgba(255,255,255,0.85)',
              }}
            >
              {i + 1}
            </span>
            <span
              className="h-1.5 rounded-full"
              style={{
                width: `${78 - i * 16}%`,
                background: i === 0 ? 'linear-gradient(90deg,#FA660F,#FFB489)' : 'rgba(255,255,255,0.28)',
              }}
            />
          </div>
        ))}
      </div>

      {/* Budgeted to the 265px card: chip 20 + title ~52 + line 18 + price 24 +
          button 38, plus gaps ≈ 190px. Anything more clips. */}
      <div className="relative z-10 flex h-full flex-col justify-center px-5 md:px-7 w-full md:w-[62%]">
        <span className="inline-flex w-fit items-center rounded-full bg-[#FA660F] px-2.5 py-[3px] text-[9.5px] font-bold font-poppins uppercase tracking-[0.12em] text-white">
          MHT-CET · CAP rounds
        </span>

        <h2 className="mt-2.5 font-poppins text-[18px] md:text-[21px] font-bold leading-[1.2] text-white">
          Option form filling by an expert
        </h2>

        <p className="mt-1.5 font-poppins text-[12px] md:text-[12.5px] leading-[1.45] text-white/65">
          Your choice list decides your college, not your percentile.
        </p>

        <div className="mt-2.5 flex flex-wrap items-baseline gap-x-2">
          <span className="font-poppins text-[12.5px] text-white/40 line-through">₹6,000</span>
          <span className="font-poppins text-[20px] font-bold text-white">₹1,999</span>
          <span className="font-poppins text-[10.5px] text-white/50">revision ₹1,499</span>
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); go(); }}
          type="button"
          className="mt-3 inline-flex w-fit items-center gap-2 rounded-[8px] bg-[#FA660F] px-4 py-2 font-poppins text-[12.5px] font-semibold text-white transition-colors hover:bg-[#e25a0b] cursor-pointer"
        >
          Book my option form
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default OptionFormBanner;
