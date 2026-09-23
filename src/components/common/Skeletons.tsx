import React from 'react';

export const HeroSkeleton: React.FC = () => {
  return (
    <div className="relative w-full h-[65vh] min-h-[480px] max-h-[720px] bg-[#111419] border-b border-[#292F37] overflow-hidden">
      <div className="absolute inset-0 skeleton-shimmer" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-end pb-12 space-y-4">
        <div className="w-32 h-6 rounded-md bg-[#171B21] skeleton-shimmer" />
        <div className="w-2/3 max-w-xl h-12 rounded-lg bg-[#171B21] skeleton-shimmer" />
        <div className="w-full max-w-lg h-16 rounded-md bg-[#171B21] skeleton-shimmer" />
        <div className="flex gap-4 pt-2">
          <div className="w-36 h-12 rounded-xl bg-[#171B21] skeleton-shimmer" />
          <div className="w-32 h-12 rounded-xl bg-[#171B21] skeleton-shimmer" />
        </div>
      </div>
    </div>
  );
};

export const PosterSkeleton: React.FC = () => {
  return (
    <div className="aspect-[2/3] w-full rounded-xl bg-[#171B21] border border-[#292F37] skeleton-shimmer" />
  );
};

export const GridSkeleton: React.FC<{ count?: number }> = ({ count = 10 }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <PosterSkeleton key={i} />
      ))}
    </div>
  );
};

export const DetailSkeleton: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 space-y-8">
      <div className="w-full h-80 rounded-2xl bg-[#171B21] skeleton-shimmer" />
      <div className="space-y-4">
        <div className="w-1/3 h-10 rounded-lg bg-[#171B21] skeleton-shimmer" />
        <div className="w-full h-20 rounded-lg bg-[#171B21] skeleton-shimmer" />
      </div>
    </div>
  );
};
