import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Info, Star, Bookmark } from 'lucide-react';
import type { NormalizedMedia } from '../../types/media';
import { isInWatchlist, toggleWatchlist } from '../../lib/storage';

interface HeroProps {
  media: NormalizedMedia;
}

export const Hero: React.FC<HeroProps> = ({ media }) => {
  const [inWatchlist, setInWatchlist] = React.useState(() => isInWatchlist(media.id, media.type));

  const handleWatchlistToggle = () => {
    const updated = toggleWatchlist(media);
    setInWatchlist(updated);
  };

  const watchUrl = media.type === 'movie' ? `/watch/movie/${media.id}` : `/watch/tv/${media.id}/1/1`;
  const infoUrl = media.type === 'movie' ? `/movie/${media.id}` : `/tv/${media.id}`;

  return (
    <div className="relative w-full min-h-[520px] max-h-[720px] h-[70vh] bg-[#0B0D10] overflow-hidden flex items-end pb-12 sm:pb-16 pt-28">
      <div className="absolute inset-0">
        <img
          src={media.backdrop || ''}
          alt={media.title}
          className="w-full h-full object-cover object-center opacity-40 scale-105"
        />
        <div className="absolute inset-0 bg-[#0B0D10]/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D10] via-[#0B0D10]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0D10] via-[#0B0D10]/80 to-transparent w-full md:w-3/4" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-4">
        <div className="flex items-center gap-3">
          <span className="px-2.5 py-1 bg-[#D6FF3F] text-[#0B0D10] font-extrabold text-[10px] tracking-widest uppercase rounded-md shadow-sm">
            FEATURED {media.type.toUpperCase()}
          </span>
          {media.rating > 0 && (
            <span className="flex items-center gap-1 text-xs font-bold text-[#F4F5F7] bg-[#171B21]/90 border border-[#292F37] px-2.5 py-0.5 rounded-md backdrop-blur-md">
              <Star className="w-3.5 h-3.5 fill-[#D6FF3F] text-[#D6FF3F]" />
              {media.rating} / 10
            </span>
          )}
          <span className="text-xs text-[#9BA3AE] font-medium">{media.year}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#F4F5F7] max-w-3xl leading-tight font-sans">
          {media.title}
        </h1>

        <div className="flex flex-wrap items-center gap-2 text-xs text-[#9BA3AE] font-medium">
          {media.genres.map((genre, idx) => (
            <span key={idx} className="px-2 py-0.5 bg-[#171B21]/80 border border-[#292F37] rounded-md text-[#F4F5F7]">
              {genre}
            </span>
          ))}
          {media.runtime && (
            <span className="text-[#626A75]">• {media.runtime} mins</span>
          )}
          {media.seasonsCount && (
            <span className="text-[#626A75]">• {media.seasonsCount} Season{media.seasonsCount > 1 ? 's' : ''}</span>
          )}
        </div>

        <p className="text-sm sm:text-base text-[#9BA3AE] max-w-2xl line-clamp-3 leading-relaxed">
          {media.overview}
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Link
            to={watchUrl}
            className="px-6 py-3 bg-[#D6FF3F] hover:bg-[#c6ef2f] text-[#0B0D10] font-extrabold text-sm tracking-wide rounded-xl flex items-center gap-2.5 transition-all shadow-lg shadow-[#D6FF3F]/20 hover:scale-105 active:scale-95"
          >
            <Play className="w-4 h-4 fill-current" />
            WATCH NOW
          </Link>

          <Link
            to={infoUrl}
            className="px-6 py-3 bg-[#171B21]/90 hover:bg-[#1D2229] border border-[#292F37] hover:border-[#D6FF3F]/50 text-[#F4F5F7] font-bold text-sm rounded-xl flex items-center gap-2 backdrop-blur-md transition-all hover:scale-105 active:scale-95"
          >
            <Info className="w-4 h-4 text-[#9BA3AE]" />
            MORE INFO
          </Link>

          <button
            onClick={handleWatchlistToggle}
            className={`p-3 rounded-xl border transition-all hover:scale-105 active:scale-95 ${
              inWatchlist
                ? 'bg-[#D6FF3F] text-[#0B0D10] border-[#D6FF3F]'
                : 'bg-[#171B21]/90 text-[#9BA3AE] hover:text-white border-[#292F37] hover:border-[#D6FF3F]/50'
            }`}
            title={inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
          >
            <Bookmark className="w-4 h-4 fill-current" />
          </button>
        </div>
      </div>
    </div>
  );
};
