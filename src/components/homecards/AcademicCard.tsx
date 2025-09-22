import { Badge } from "@/components/ui/badge";

export type CatalogCardProps = {
  imageSrc: string;
  imageAlt: string;
  title: string;
  ctaLabel?: string;
  badge?: string;
  className?: string;
  city?: string;
  mh?:string,
  dh?:string
};

export function AcademicCard({
  imageSrc,
  imageAlt,
  title,
  ctaLabel,
  badge,
  city,
  mh,
  dh

}: CatalogCardProps) {
  return (
    <div
      className={`flex flex-col justify-start items-center w-[170px] lg:w-[282px] bg-white ${mh? mh : 'h-[222px]'}
      ${dh? dh :'lg:h-[353px]'}
      shadow-[0px_0px_4px_0px_#23232340] rounded-[12px] lg:rounded-[20px] transition-all duration-300 
      hover:shadow-lg p-[10px] gap-2 relative overflow-hidden`}
    >
      <div className={`relative w-[146px] lg:w-[262px] flex-shrink-0 ${mh ? 'h-[120px]' : 'h-[139px]'} lg:h-[248px]`}>
        <img
          src={imageSrc}
          alt={imageAlt}
          className="w-full h-full object-cover rounded-[10px]"
        />
        {badge && <Badge className="absolute top-1 right-1">{badge}</Badge>}
      </div>

      <div className="relative w-full text-center flex-1 flex flex-col justify-center">
        <p className="font-medium text-[14px] lg:text-[20px] text-[#242645] line-clamp-1">
          {title}
        </p>

        {ctaLabel && (
          <div className="font-medium text-[#718EBF] lg:text-[18px] text-xs underline mt-1">
            {ctaLabel}
          </div>
        )}

        {city && (
          <div className="text-[#242645] text-[12px] lg:text-[18px] mt-1">
            {city}
          </div>
        )}
      </div>
    </div>
  );
}
