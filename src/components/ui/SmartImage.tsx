import React, { useEffect } from 'react';

type SmartImageProps = {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean; 
  onError?: React.ReactEventHandler<HTMLImageElement>;
  loading?: 'lazy' | 'eager';
  decoding?: 'async' | 'sync' | 'auto';
  style?: React.CSSProperties;
  srcSet?: string;
  sizes?: string;
};

export default function SmartImage({
  src,
  alt,
  className,
  width,
  height,
  priority = false,
  onError,
  loading,
  decoding = 'async',
  style,
  srcSet,
  sizes,
}: SmartImageProps) {
  useEffect(() => {
    if (!priority) return
    try {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
      return () => {
        document.head.removeChild(link);
      };
    } catch {
      // ignore
    }
  }, [priority, src]);

  const effectiveLoading = loading ? loading : priority ? 'eager' : 'lazy';

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={effectiveLoading}
      decoding={decoding}
      width={width}
      height={height}
      style={style}
      onError={onError}
      srcSet={srcSet}
      sizes={sizes}
    />
  );
}
