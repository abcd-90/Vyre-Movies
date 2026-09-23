import React, { useEffect, useState } from 'react';
import { MediaCard } from '../components/cards/MediaCard';
import { GridSkeleton } from '../components/common/Skeletons';
import { getTrending } from '../lib/providers/tmdb';
import type { NormalizedMedia } from '../types/media';
import { Flame } from 'lucide-react';

export const TrendingPage: React.FC = () => {
  const [items, setItems] = useState<NormalizedMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeWindow, setTimeWindow] = useState<'day' | 'week'>('week');
  const [mediaType, setMediaType] = useState<'all' | 'movie' | 'tv'>('all');

  useEffect(() => {
    async function loadTrending() {
      setLoading(true);
      try {
        const results = await getTrending(mediaType, timeWindow);
        setItems(results);
      } catch (e) {
        console.error('Error fetching trending data:', e);
      } finally {
        setLoading(false);
      }
    }

    loadTrending();
  }, [timeWindow, mediaType]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#292F37] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#D6FF3F] tracking-widest uppercase mb-1">
            <Flame className="w-4 h-4 fill-current" /> TOP SELECTIONS
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#F4F5F7]">Trending Right Now</h1>
          <p className="text-xs text-[#9BA3AE] mt-1">The most watched movies and shows globally today.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 bg-[#171B21] border border-[#292F37] p-1 rounded-xl">
            <button
              onClick={() => setTimeWindow('day')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                timeWindow === 'day' ? 'bg-[#D6FF3F] text-[#0B0D10]' : 'text-[#9BA3AE] hover:text-white'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setTimeWindow('week')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                timeWindow === 'week' ? 'bg-[#D6FF3F] text-[#0B0D10]' : 'text-[#9BA3AE] hover:text-white'
              }`}
            >
              This Week
            </button>
          </div>

          <div className="flex items-center gap-1 bg-[#171B21] border border-[#292F37] p-1 rounded-xl">
            {(['all', 'movie', 'tv'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setMediaType(type)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                  mediaType === type ? 'bg-[#D6FF3F] text-[#0B0D10]' : 'text-[#9BA3AE] hover:text-white'
                }`}
              >
                {type === 'all' ? 'All' : type === 'movie' ? 'Movies' : 'TV Shows'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <GridSkeleton count={12} />
      ) : items.length === 0 ? (
        <div className="text-center py-20 bg-[#111419] border border-[#292F37] rounded-2xl">
          <p className="text-[#F4F5F7] font-semibold">No trending content available.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          {items.map((item) => (
            <MediaCard key={`${item.type}-${item.id}`} media={item} />
          ))}
        </div>
      )}
    </div>
  );
};
