import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Trash2, Play } from 'lucide-react';
import { getWatchlist, toggleWatchlist } from '../lib/storage';
import type { NormalizedMedia } from '../types/media';

export const WatchlistPage: React.FC = () => {
  const [list, setList] = useState<NormalizedMedia[]>([]);

  useEffect(() => {
    setList(getWatchlist());
  }, []);

  const handleRemove = (media: NormalizedMedia, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWatchlist(media);
    setList(getWatchlist());
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 space-y-8">
      <div className="flex items-center justify-between border-b border-[#292F37] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#D6FF3F] tracking-widest uppercase mb-1">
            <Bookmark className="w-4 h-4 fill-current" /> SAVED TITLES
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#F4F5F7]">My Watchlist</h1>
          <p className="text-xs text-[#9BA3AE] mt-1">Movies and shows saved for later playback.</p>
        </div>

        {list.length > 0 && (
          <span className="px-3 py-1 bg-[#171B21] border border-[#292F37] rounded-xl text-xs font-extrabold text-[#D6FF3F]">
            {list.length} Saved
          </span>
        )}
      </div>

      {list.length === 0 ? (
        <div className="text-center py-24 bg-[#111419] border border-[#292F37] rounded-2xl max-w-2xl mx-auto space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#171B21] border border-[#292F37] flex items-center justify-center text-[#9BA3AE]">
            <Bookmark className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-[#F4F5F7]">Your Watchlist is Empty</h3>
            <p className="text-xs text-[#9BA3AE] max-w-sm mx-auto">
              Explore trending movies and TV series and click the bookmark button to save them to your library.
            </p>
          </div>
          <Link
            to="/movies"
            className="px-6 py-3 bg-[#D6FF3F] text-[#0B0D10] font-extrabold text-xs rounded-xl inline-block hover:scale-105 transition-all shadow-md"
          >
            DISCOVER MOVIES
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          {list.map((item) => {
            const detailUrl = item.type === 'movie' ? `/movie/${item.id}` : `/tv/${item.id}`;
            const watchUrl = item.type === 'movie' ? `/watch/movie/${item.id}` : `/watch/tv/${item.id}/1/1`;

            return (
              <div key={`${item.type}-${item.id}`} className="group relative flex flex-col">
                <Link to={detailUrl} className="block relative aspect-[2/3] rounded-xl overflow-hidden bg-[#171B21] border border-[#292F37] card-lift">
                  <img
                    src={item.poster || ''}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D10]/90 via-transparent to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

                  <button
                    onClick={(e) => handleRemove(item, e)}
                    className="absolute top-2.5 right-2.5 p-1.5 bg-[#0B0D10]/80 hover:bg-red-500/80 text-white rounded-lg border border-[#292F37] transition-all"
                    title="Remove from Watchlist"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <Link
                    to={watchUrl}
                    className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-[#D6FF3F] text-[#0B0D10] flex items-center justify-center opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200"
                  >
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </Link>

                  <div className="absolute bottom-0 left-0 right-0 p-3 space-y-1">
                    <h3 className="text-sm font-bold text-[#F4F5F7] group-hover:text-[#D6FF3F] transition-colors truncate">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#9BA3AE]">{item.year} • {item.type.toUpperCase()}</p>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
