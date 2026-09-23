import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { MediaCard } from '../cards/MediaCard';
import type { NormalizedMedia } from '../../types/media';

interface MediaRailProps {
  title: string;
  subtitle?: string;
  items: NormalizedMedia[];
  viewAllLink?: string;
}

export const MediaRail: React.FC<MediaRailProps> = ({ title, subtitle, items, viewAllLink }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!items || items.length === 0) return null;

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const distance = scrollRef.current.clientWidth * 0.75;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -distance : distance,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="space-y-4 my-8">
      <div className="flex items-end justify-between px-4 sm:px-6 lg:px-8">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#F4F5F7] flex items-center gap-2">
            {title}
          </h2>
          {subtitle && <p className="text-xs text-[#9BA3AE] mt-0.5">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-2">
          {viewAllLink && (
            <Link
              to={viewAllLink}
              className="text-xs font-bold text-[#D6FF3F] hover:underline flex items-center gap-1 mr-2 transition-all"
            >
              Explore All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}

          <button
            onClick={() => handleScroll('left')}
            className="p-2 bg-[#171B21] border border-[#292F37] hover:border-[#D6FF3F]/50 text-[#9BA3AE] hover:text-white rounded-lg transition-all"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleScroll('right')}
            className="p-2 bg-[#171B21] border border-[#292F37] hover:border-[#D6FF3F]/50 text-[#9BA3AE] hover:text-white rounded-lg transition-all"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex items-center gap-4 overflow-x-auto no-scrollbar px-4 sm:px-6 lg:px-8 pb-2 pt-1 scroll-smooth"
      >
        {items.map((item) => (
          <div key={`${item.type}-${item.id}`} className="w-[160px] sm:w-[180px] lg:w-[200px] flex-shrink-0">
            <MediaCard media={item} />
          </div>
        ))}
      </div>
    </section>
  );
};
