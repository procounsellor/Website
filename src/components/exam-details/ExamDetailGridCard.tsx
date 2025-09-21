import { Badge } from "@/components/ui/badge";

type Props = {
  imageSrc: string;
  imageAlt: string;
  title: string;
  ctaLabel?: string;
  badge?: string;
  subtitle?: string;
  variant?: 'default' | 'compact'
};

export function ExamDetailGridCard({
  imageSrc,
  imageAlt,
  title,
  ctaLabel,
  badge,
  subtitle,
  variant = 'default',
}: Props) {
  return (
    <div className={`flex flex-col w-full p-2 bg-white border border-gray-200 rounded-2xl shadow-md transition-all duration-300 hover:shadow-xl`}>
      <div className={`relative w-full flex-shrink-0`}>
        <img
          src={imageSrc}
          alt={imageAlt}
          className={`w-full h-50 object-contain ${variant === 'compact' ? '-mt-4' : 'mt-0'}`}
        />
        {badge && (
          <Badge className="absolute top-2 right-2 bg-black/60 text-white border-none">
            {badge}
          </Badge>
        )}
      </div>

      <div className={`flex flex-col items-center text-center `}>
        <p className={`font-semibold text-[#242645] leading-tight text-xl`}>
          {title}
        </p>

        {ctaLabel && (
          <a href="#" className={`font-medium underline mt-2 text-[#718EBF] text-lg`}>
            {ctaLabel}
          </a>
        )}

        {subtitle && (
          <p className={`font-medium mt-1 text-sm text-[#242645]`}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}