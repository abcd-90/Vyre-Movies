import React, { useState, useEffect } from 'react';

const DEFAULT_POSTER_FALLBACK =
  'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&auto=format&fit=crop&q=80';

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
  const [errorCount, setErrorCount] = useState<number>(0);

  useEffect(() => {
    setImgSrc(src || fallbackSrc);
    setErrorCount(0);
  }, [src, fallbackSrc]);

  const handleError = () => {
    if (errorCount === 0) {
      setErrorCount(1);
      // Try fallback Unsplash poster
      setImgSrc(fallbackSrc);
    } else if (errorCount === 1) {
      setErrorCount(2);
      // Data URI dark placeholder if secondary fails
      setImgSrc(
        "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='450' viewBox='0 0 300 450'><rect width='300' height='450' fill='%23171B21'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%239BA3AE' font-family='sans-serif' font-size='16' font-weight='bold'>VYRE CINEMA</text></svg>"
      );
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
