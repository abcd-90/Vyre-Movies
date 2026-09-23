import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, Star, Bookmark } from 'lucide-react';
import type { NormalizedMedia } from '../../types/media';
import { isInWatchlist, toggleWatchlist } from '../../lib/storage';
import { ImageWithFallback } from '../common/ImageWithFallback';

interface MediaCardProps {
  media: NormalizedMedia;
  className?: string;
}

export const MediaCard: React.FC<MediaCardProps> = ({ media, className = '' }) => {
  const [inWatchlist, setInWatchlist] = useState(() => isInWatchlist(media.id, media.type));

  const handleWatchlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const updated = toggleWatchlist(media);
    setInWatchlist(updated);
  };

  const detailUrl = media.type === 'movie' ? `/movie/${media.id}` : `/tv/${media.id}`;
  const watchUrl = media.type === 'movie' ? `/watch/movie/${media.id}` : `/watch/tv/${media.id}/1/1`;

  return (
    <div className={`group relative flex flex-col ${className}`}>
      <Link to={detailUrl} className="block relative aspect-[2/3] rounded-xl overflow-hidden bg-[#171B21] border border-[#292F37] card-lift">
        <ImageWithFallback
          src={media.poster || ''}
          alt={media.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D10]/90 via-transparent to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
          <span className="px-2 py-0.5 bg-[#0B0D10]/80 backdrop-blur-md border border-[#292F37] rounded-md text-[10px] font-extrabold uppercase tracking-wider text-[#D6FF3F]">
            {media.type === 'movie' ? 'Movie' : 'TV'}
          </span>

          {media.rating > 0 && (
            <span className="px-2 py-0.5 bg-[#0B0D10]/80 backdrop-blur-md border border-[#292F37] rounded-md text-[10px] font-bold text-white flex items-center gap-1">
              <Star className="w-2.5 h-2.5 fill-[#D6FF3F] text-[#D6FF3F]" />
              {media.rating}
            </span>
          )}
        </div>

        <button
          onClick={handleWatchlistClick}
          className={`absolute top-2.5 right-2.5 p-1.5 rounded-lg border backdrop-blur-md transition-all duration-150 ${
            inWatchlist
              ? 'bg-[#D6FF3F] text-[#0B0D10] border-[#D6FF3F]'
              : 'bg-[#0B0D10]/70 text-[#9BA3AE] hover:text-white border-[#292F37] opacity-0 group-hover:opacity-100'
          }`}
          title={inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
        >
          <Bookmark className="w-3.5 h-3.5 fill-current" />
        </button>

        <Link
          to={watchUrl}
          className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-[#D6FF3F] text-[#0B0D10] flex items-center justify-center opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 shadow-xl shadow-[#D6FF3F]/20"
          title="Play Now"
        >
          <Play className="w-5 h-5 fill-current ml-0.5" />
        </Link>

        <div className="absolute bottom-0 left-0 right-0 p-3 space-y-1">
          <h3 className="text-sm font-bold text-[#F4F5F7] group-hover:text-[#D6FF3F] transition-colors truncate leading-tight">
            {media.title}
          </h3>
          <div className="flex items-center justify-between text-xs text-[#9BA3AE]">
            <span>{media.year}</span>
            {media.type === 'tv' && media.seasonsCount && (
              <span className="text-[11px] text-[#626A75] font-medium">{media.seasonsCount} Season{media.seasonsCount > 1 ? 's' : ''}</span>
            )}
            {media.type === 'movie' && media.runtime && (
              <span className="text-[11px] text-[#626A75] font-medium">{media.runtime}m</span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};
