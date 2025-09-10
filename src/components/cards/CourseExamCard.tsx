import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type CatalogCardProps = {
  imageSrc: string;
  imageAlt: string;
  title: string;
  ctaLabel: string;
  badge?: string;
  className?: string;
};

export function CatalogCard({
  imageSrc,
  imageAlt,
  title,
  ctaLabel,
  badge,
  className,
}: CatalogCardProps) {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <Card
      className={cn(
        "group flex h-full flex-col cursor-pointer p-4 transition-all duration-300 hover:shadow-md hover:-translate-y-1 bg-white",
        "w-full rounded-2xl border border-gray-200 shadow-sm",
        className
      )}
    >
      <div className="relative w-full">
        <div className="relative w-full aspect-[290/240] rounded-xl overflow-hidden">
          <img
            src={imageError ? "/discover-courses.jpg" : (imageSrc || "/discover-courses.jpg")}
            alt={imageAlt}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={handleImageError}
          />
          {badge && (
            <Badge
              className="absolute right-3 top-3 bg-[#2C2C2C] hover:bg-[#E55A0E] text-white text-xs font-medium z-10 px-2 py-1"
            >
              {badge}
            </Badge>
          )}
        </div>
      </div>

      <div className="flex flex-col items-center text-center flex-grow gap-2">
        <h3
          className="font-medium text-[#343C6A] leading-tight text-lg sm:text-xl h-16 flex items-center justify-center overflow-hidden"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            textOverflow: 'ellipsis'
          }}
          title={title}
        >
          {title}
        </h3>

        <a
          href="#"
          className="text-sm sm:text-base text-[#718EBF] underline hover:opacity-80 transition-all"
        >
          {ctaLabel}
        </a>
      </div>
    </Card>
  );
}