/**
 * The site's existing section label (white chip, navy square, uppercase), used
 * by Counsellors, Deadlines, Stories, FAQ and the partner carousel — so the new
 * home sections look like part of the same page.
 */
export default function SectionLabel({ children, className = "" }: { children: string; className?: string }) {
  return (
    <div className={`flex items-center gap-2 bg-white px-3 py-1 rounded-md w-fit shrink-0 ${className}`}>
      <div className="w-4 h-4 bg-[#0E1629] shrink-0" aria-hidden="true" />
      <p className="font-[Poppins] font-semibold text-[12px] md:text-[14px] text-[#0E1629] uppercase tracking-[0.07em] leading-none md:leading-normal">
        {children}
      </p>
    </div>
  );
}
