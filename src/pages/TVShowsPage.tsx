import React, { useEffect, useState } from 'react';
import { MediaCard } from '../components/cards/MediaCard';
import { GridSkeleton } from '../components/common/Skeletons';
import { discoverMedia, GENRES } from '../lib/providers/tmdb';
import type { NormalizedMedia } from '../types/media';
import { Filter, Tv } from 'lucide-react';

export const TVShowsPage: React.FC = () => {
  const [shows, setShows] = useState<NormalizedMedia[]>([]);
  const [loading, setLoading] = useState(true);

  const [category, setCategory] = useState<'popular' | 'top_rated' | 'airing_today' | 'on_the_air'>('popular');
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [minRating, setMinRating] = useState<number>(0);

  useEffect(() => {
    async function loadTV() {
      setLoading(true);
      try {
        const results = await discoverMedia('tv', {
          category,
          genre: selectedGenre,
          year: selectedYear,
          minRating: minRating > 0 ? minRating : undefined,
          sortBy: category === 'top_rated' ? 'vote_average.desc' : 'popularity.desc',
        });
        setShows(results);
      } catch (e) {
        console.error('Error fetching TV shows:', e);
      } finally {
        setLoading(false);
      }
    }

    loadTV();
  }, [category, selectedGenre, selectedYear, minRating]);

  const years = Array.from({ length: 15 }, (_, i) => String(2024 - i));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#292F37] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#D6FF3F] tracking-widest uppercase mb-1">
            <Tv className="w-4 h-4" /> TELEVISION
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#F4F5F7]">Explore TV Series</h1>
          <p className="text-xs text-[#9BA3AE] mt-1">Binge-worthy series, limited series, and trending television.</p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 bg-[#171B21] border border-[#292F37] p-1 rounded-xl self-start md:self-auto">
          {(['popular', 'top_rated', 'airing_today', 'on_the_air'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold capitalize transition-all ${
                category === cat
                  ? 'bg-[#D6FF3F] text-[#0B0D10] shadow-sm'
                  : 'text-[#9BA3AE] hover:text-[#F4F5F7]'
              }`}
            >
              {cat.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 bg-[#111419] border border-[#292F37] p-4 rounded-2xl">
        <span className="text-xs font-bold text-[#9BA3AE] flex items-center gap-1.5 mr-1">
          <Filter className="w-3.5 h-3.5 text-[#D6FF3F]" /> FILTERS:
        </span>

        <select
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
          className="bg-[#171B21] border border-[#292F37] text-[#F4F5F7] text-xs font-semibold px-3 py-2 rounded-xl focus:outline-none focus:border-[#D6FF3F]"
        >
          <option value="">All Genres</option>
          {GENRES.map((g) => (
            <option key={g.id} value={g.slug}>
              {g.name}
            </option>
          ))}
        </select>

        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="bg-[#171B21] border border-[#292F37] text-[#F4F5F7] text-xs font-semibold px-3 py-2 rounded-xl focus:outline-none focus:border-[#D6FF3F]"
        >
          <option value="">All Years</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>

        <select
          value={minRating}
          onChange={(e) => setMinRating(Number(e.target.value))}
          className="bg-[#171B21] border border-[#292F37] text-[#F4F5F7] text-xs font-semibold px-3 py-2 rounded-xl focus:outline-none focus:border-[#D6FF3F]"
        >
          <option value={0}>All Ratings</option>
          <option value={7}>7.0+ Rating</option>
          <option value={8}>8.0+ Rating</option>
        </select>

        {(selectedGenre || selectedYear || minRating > 0) && (
          <button
            onClick={() => {
              setSelectedGenre('');
              setSelectedYear('');
              setMinRating(0);
            }}
            className="text-xs font-bold text-[#D6FF3F] hover:underline ml-auto"
          >
            Reset Filters
          </button>
        )}
      </div>

      {loading ? (
        <GridSkeleton count={12} />
      ) : shows.length === 0 ? (
        <div className="text-center py-20 bg-[#111419] border border-[#292F37] rounded-2xl">
          <p className="text-[#F4F5F7] font-semibold">No TV shows found matching these filters.</p>
          <p className="text-xs text-[#9BA3AE] mt-1">Try resetting or loosening your filter criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          {shows.map((show) => (
            <MediaCard key={show.id} media={show} />
          ))}
        </div>
      )}
    </div>
  );
};
