import {
  Card,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type CatalogCardProps = {
  imageSrc: string;
  imageAlt: string;
  title: string;
  ctaLabel: string;
  badge?: string; // e.g., "UG", "PG"
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
  return (
    <Card 
      className={cn(
        "group flex flex-col cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:scale-[1.02] bg-white mx-auto",
        className
      )}
      style={{
        width: '100%',
        maxWidth: '320px', // Reduced from 380px
        height: 'auto',
        minHeight: '380px', // Reduced from 451px
        borderRadius: '21.51px',
        background: '#FFFFFF',
        boxShadow: '0px 0px 4px 0px #23232340',
        opacity: 1,
        boxSizing: 'border-box',
        padding: 0
      }}
    >
      {/* Image container with exact positioning */}
      <div 
        className="relative overflow-hidden px-4 sm:px-0"
        style={{
          width: '100%',
          maxWidth: '290px', // Reduced from 349px
          height: 'auto',
          aspectRatio: '290/240', // Adjusted aspect ratio
          borderRadius: '20px',
          opacity: 1,
          margin: '12px auto 0 auto', // Reduced top margin
          position: 'relative'
        }}
      >
        <img
          src={imageSrc || "/imageCounselor.jpg"}
          alt={imageAlt}
          className="w-full h-full object-cover"
          style={{
            borderRadius: '20px'
          }}
        />
        {badge && (
          <Badge 
            className="absolute right-6 top-2 sm:right-3 sm:top-3 bg-[#2C2C2C] hover:bg-[#E55A0E] text-white text-xs font-medium z-10"
          >
            {badge}
          </Badge>
        )}
      </div>

      {/* Content container */}
      <div 
        className="flex flex-col items-center text-center flex-1 justify-center"
        style={{ 
          padding: '20px 14px 14px 14px' // More space from image, equal sides and bottom
        }}
      >
        <h3 
          className="font-medium mb-2" 
          style={{
            fontFamily: 'Montserrat',
            fontSize: 'clamp(18px, 4vw, 24px)', // Reduced from 28px max
            fontWeight: '500',
            lineHeight: '125%',
            textAlign: 'center',
            margin: '0 0 8px 0', // Reduced margin
            color: '#343C6A'
          }}
        >
          {title}
        </h3>
        <a 
          href="#"
          className="hover:opacity-80 transition-all"
          style={{
            fontFamily: 'Montserrat',
            fontSize: 'clamp(16px, 3vw, 20px)', // Reduced from 24px max
            fontWeight: '400',
            textDecoration: 'underline',
            maxWidth: '120px', // Reduced from 151px
            height: '24px', // Reduced from 30px
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#718EBF'
          }}
        >
          {ctaLabel}
        </a>
      </div>
    </Card>
  );
}