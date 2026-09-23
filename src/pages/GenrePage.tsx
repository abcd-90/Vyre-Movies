import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MediaCard } from '../components/cards/MediaCard';
import { GridSkeleton } from '../components/common/Skeletons';
import { discoverMedia, GENRES } from '../lib/providers/tmdb';
import type { NormalizedMedia } from '../types/media';
import { Grid, Filter } from 'lucide-react';

export const GenrePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [mediaList, setMediaList] = useState<NormalizedMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [mediaType, setMediaType] = useState<'movie' | 'tv'>('movie');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [minRating, setMinRating] = useState<number>(0);

  const activeGenre = GENRES.find((g) => g.slug === slug || g.name.toLowerCase() === slug?.toLowerCase()) || GENRES[0];

  useEffect(() => {
    async function loadGenreMedia() {
      setLoading(true);
      try {
        const results = await discoverMedia(mediaType, {
          genre: activeGenre.slug,
          year: selectedYear,
          minRating: minRating > 0 ? minRating : undefined,
        });
        setMediaList(results);
      } catch (e) {
        console.error('Error loading genre items:', e);
      } finally {
        setLoading(false);
      }
    }

    loadGenreMedia();
  }, [slug, activeGenre.slug, mediaType, selectedYear, minRating]);

  const years = Array.from({ length: 15 }, (_, i) => String(2024 - i));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 space-y-8">
      <div className="space-y-6 border-b border-[#292F37] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#D6FF3F] tracking-widest uppercase mb-1">
            <Grid className="w-4 h-4" /> GENRE DISCOVERY
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#F4F5F7]">{activeGenre.name} Movies & TV</h1>
          <p className="text-xs text-[#9BA3AE] mt-1">Explore top picks and hidden gems in {activeGenre.name}.</p>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {GENRES.map((g) => (
            <Link
              key={g.id}
              to={`/genre/${g.slug}`}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                g.slug === activeGenre.slug
                  ? 'bg-[#D6FF3F] text-[#0B0D10] border-[#D6FF3F] shadow-sm'
                  : 'bg-[#171B21] text-[#9BA3AE] hover:text-[#F4F5F7] border-[#292F37]'
              }`}
            >
              {g.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 bg-[#111419] border border-[#292F37] p-4 rounded-2xl">
        <span className="text-xs font-bold text-[#9BA3AE] flex items-center gap-1.5 mr-1">
          <Filter className="w-3.5 h-3.5 text-[#D6FF3F]" /> TYPE & FILTERS:
        </span>

        <div className="flex items-center gap-1 bg-[#171B21] border border-[#292F37] p-1 rounded-xl">
          <button
            onClick={() => setMediaType('movie')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              mediaType === 'movie' ? 'bg-[#D6FF3F] text-[#0B0D10]' : 'text-[#9BA3AE] hover:text-white'
            }`}
          >
            Movies
          </button>
          <button
            onClick={() => setMediaType('tv')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              mediaType === 'tv' ? 'bg-[#D6FF3F] text-[#0B0D10]' : 'text-[#9BA3AE] hover:text-white'
            }`}
          >
            TV Shows
          </button>
        </div>

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
      </div>

      {loading ? (
        <GridSkeleton count={12} />
      ) : mediaList.length === 0 ? (
        <div className="text-center py-20 bg-[#111419] border border-[#292F37] rounded-2xl">
          <p className="text-[#F4F5F7] font-semibold">No titles found for {activeGenre.name}.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          {mediaList.map((item) => (
            <MediaCard key={item.id} media={item} />
          ))}
        </div>
      )}
    </div>
  );
};
