import { Badge } from "@/components/ui/badge";

export type CatalogCardProps = {
  imageSrc: string;
  imageAlt: string;
  title: string;
  ctaLabel?: string;
  badge?: string;
  className?: string;
  city?: string;
};

export function AcademicCard({
  imageSrc,
  imageAlt,
  title,
  ctaLabel,
  badge,
  city,
}: CatalogCardProps) {
  return (
    <div
      className="flex flex-col justify-start items-center w-[170px] lg:w-[380px] h-[222px] lg:h-[451px] bg-white
      shadow-[0px_0px_4px_0px_#23232340] rounded-[12px] lg:rounded-[22px] transition-all duration-300 hover:shadow-xl p-3 gap-3 relative overflow-hidden"
    >
      <div className="relative w-[146px] lg:w-[349px] h-[139px] lg:h-[299px] flex-shrink-0">
        <img
          src={imageSrc}
          alt={imageAlt}
          className="w-full h-full object-cover rounded-[4px] lg:rounded-[20px]"
        />
        {badge && <Badge className="absolute top-1 right-1">{badge}</Badge>}
      </div>

      <div className="relative w-full text-center">
        <p className="font-medium text-[14px] lg:text-[28px] text-[#343C6A] line-clamp-1">
          {title}
        </p>

        {/* <div className="absolute inset-0 bg-black bg-opacity-70 text-white flex items-center justify-center text-sm lg:text-2xl
                        text-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-2">
          {title}
        </div> */}
      </div>

      {ctaLabel && (
        <div className="font-medium text-[#718EBF] lg:text-[24px] text-xs underline">
          {ctaLabel}
        </div>
      )}

      {city && (
        <div className="hidden lg:block text-[#232323] text-2xl mb-1">
          {city}
        </div>
      )}
    </div>
  );
}
