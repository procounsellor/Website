import { useState } from "react";
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
        "group flex flex-col cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:scale-[1.02] bg-white mx-auto",
        "w-full sm:w-[320px]", // Responsive on mobile, fixed 320px on desktop
        className
      )}
      style={{
        height: 'auto',
        minHeight: '380px',
        borderRadius: '24px',
        border: '1px solid #EFEFEF',
        boxShadow: '0px 0px 4px 0px #2323231F',
        background: '#FFFFFF',
        opacity: 1,
        boxSizing: 'border-box',
        padding: 0
      }}
    >
      <div 
        className="relative overflow-hidden px-4 sm:px-0"
        style={{
          width: '100%',
          maxWidth: '290px',
          height: 'auto',
          aspectRatio: '290/240',
          borderRadius: '20px',
          opacity: 1,
          margin: '12px auto 0 auto',
          position: 'relative'
        }}
      >
        <img
          src={imageError ? "/discover-courses.jpg" : (imageSrc || "/discover-courses.jpg")}
          alt={imageAlt}
          className="w-full h-full object-cover"
          style={{
            borderRadius: '20px'
          }}
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

      <div className="flex flex-col gap-3 flex-grow px-4 py-3">
        <div className="flex-1 flex flex-col justify-center text-center">
          <h3 
            className="font-medium text-[#343C6A] leading-tight" 
            style={{
              maxWidth: '200px',
              height: 'auto',
              minHeight: '28px',
              fontFamily: 'Montserrat',
              fontWeight: '500',
              fontSize: 'clamp(18px, 4vw, 24px)',
              lineHeight: '125%',
              textAlign: 'center',
              opacity: 1,
              margin: '0 auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {title}
          </h3>
        </div>
        
        <a 
          href="#"
          className="hover:opacity-80 transition-all text-center"
          style={{
            fontFamily: 'Montserrat',
            fontSize: 'clamp(14px, 2.5vw, 16px)',
            fontWeight: '400',
            textDecoration: 'underline',
            color: '#718EBF',
            display: 'block',
            textAlign: 'center'
          }}
        >
          {ctaLabel}
        </a>
      </div>
    </Card>
  );
}