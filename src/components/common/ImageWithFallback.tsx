import React, { useState, useEffect } from 'react';

const DEFAULT_POSTER_FALLBACK =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='500' height='750' viewBox='0 0 500 750'><defs><linearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'><stop offset='0%25' stop-color='%23171B21'/><stop offset='50%25' stop-color='%230B0D10'/><stop offset='100%25' stop-color='%231f242d'/></linearGradient></defs><rect width='100%25' height='100%25' fill='url(%23g)'/><rect x='20' y='20' width='460' height='710' rx='16' fill='none' stroke='%23292F37' stroke-width='3' stroke-dasharray='8 8'/><path d='M250 310 L285 380 L215 380 Z' fill='%23D6FF3F' opacity='0.8'/><circle cx='250' cy='345' r='50' fill='none' stroke='%23D6FF3F' stroke-width='4' opacity='0.6'/><text x='50%25' y='520' dominant-baseline='middle' text-anchor='middle' fill='%23F4F5F7' font-family='sans-serif' font-size='26' font-weight='800' letter-spacing='3'>VYRE</text><text x='50%25' y='555' dominant-baseline='middle' text-anchor='middle' fill='%23D6FF3F' font-family='sans-serif' font-size='14' font-weight='700' letter-spacing='2'>POSTER UNAVAILABLE</text></svg>";

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  fallbackSrc = DEFAULT_POSTER_FALLBACK,
  className = '',
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState<string>(src || fallbackSrc);

  useEffect(() => {
    setImgSrc(src || fallbackSrc);
  }, [src, fallbackSrc]);

  const handleError = () => {
    if (imgSrc !== fallbackSrc) {
      setImgSrc(fallbackSrc);
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt || ''}
      className={className}
      onError={handleError}
      {...props}
    />
  );
};
