import React, { useEffect, useState } from 'react';
import { MediaCard } from '../components/cards/MediaCard';
import { GridSkeleton } from '../components/common/Skeletons';
import { discoverMedia, GENRES } from '../lib/providers/tmdb';
import type { NormalizedMedia } from '../types/media';
import { LANGUAGES } from '../types/media';
import { Filter, Film } from 'lucide-react';

export const MoviesPage: React.FC = () => {
  const [movies, setMovies] = useState<NormalizedMedia[]>([]);
  const [loading, setLoading] = useState(true);

  const [category, setCategory] = useState<'popular' | 'top_rated' | 'latest'>('popular');
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [minRating, setMinRating] = useState<number>(0);

  useEffect(() => {
    async function loadMovies() {
      setLoading(true);
      try {
        const results = await discoverMedia('movie', {
          category,
          genre: selectedGenre,
          language: selectedLanguage,
          year: selectedYear,
          minRating: minRating > 0 ? minRating : undefined,
          sortBy: category === 'top_rated' ? 'vote_average.desc' : 'popularity.desc',
        });
        setMovies(results);
      } catch (e) {
        console.error('Error fetching movies:', e);
      } finally {
        setLoading(false);
      }
    }

    loadMovies();
  }, [category, selectedGenre, selectedLanguage, selectedYear, minRating]);

  const years = Array.from({ length: 15 }, (_, i) => String(2024 - i));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#292F37] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#D6FF3F] tracking-widest uppercase mb-1">
            <Film className="w-4 h-4" /> CATALOG
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#F4F5F7]">Explore Movies</h1>
          <p className="text-xs text-[#9BA3AE] mt-1">Discover Bollywood, Punjabi, Hollywood, and global cinema.</p>
        </div>

        <div className="flex items-center gap-1.5 bg-[#171B21] border border-[#292F37] p-1 rounded-xl self-start md:self-auto">
          {(['popular', 'top_rated', 'latest'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-lg text-xs font-bold capitalize transition-all ${
                category === cat
                  ? 'bg-[#D6FF3F] text-[#0B0D10] shadow-sm'
                  : 'text-[#9BA3AE] hover:text-[#F4F5F7]'
              }`}
            >
              {cat.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 bg-[#111419] border border-[#292F37] p-4 rounded-2xl">
        <span className="text-xs font-bold text-[#9BA3AE] flex items-center gap-1.5 mr-1">
          <Filter className="w-3.5 h-3.5 text-[#D6FF3F]" /> FILTERS:
        </span>

        {/* Language Filter */}
        <select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          className="bg-[#171B21] border border-[#292F37] text-[#D6FF3F] text-xs font-bold px-3 py-2 rounded-xl focus:outline-none focus:border-[#D6FF3F]"
        >
          <option value="">All Languages / Regions</option>
          {LANGUAGES.map((l) => (
            <option key={l.code} value={l.code}>
              {l.name}
            </option>
          ))}
        </select>

        {/* Genre Select */}
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

        {/* Year Select */}
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

        {/* Rating Filter */}
        <select
          value={minRating}
          onChange={(e) => setMinRating(Number(e.target.value))}
          className="bg-[#171B21] border border-[#292F37] text-[#F4F5F7] text-xs font-semibold px-3 py-2 rounded-xl focus:outline-none focus:border-[#D6FF3F]"
        >
          <option value={0}>All Ratings</option>
          <option value={7}>7.0+ Rating</option>
          <option value={8}>8.0+ Rating</option>
        </select>

        {(selectedGenre || selectedLanguage || selectedYear || minRating > 0) && (
          <button
            onClick={() => {
              setSelectedGenre('');
              setSelectedLanguage('');
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
      ) : movies.length === 0 ? (
        <div className="text-center py-20 bg-[#111419] border border-[#292F37] rounded-2xl">
          <p className="text-[#F4F5F7] font-semibold">No movies found matching these filters.</p>
          <p className="text-xs text-[#9BA3AE] mt-1">Try resetting or changing your language/region filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          {movies.map((movie) => (
            <MediaCard key={movie.id} media={movie} />
          ))}
        </div>
      )}
    </div>
  );
};
