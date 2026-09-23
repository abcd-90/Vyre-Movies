import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Play, Bookmark, Star, Clock, Calendar } from 'lucide-react';
import { getMovieDetails, getRecommendations } from '../lib/providers/tmdb';
import type { NormalizedMedia } from '../types/media';
import { CastCard } from '../components/cards/CastCard';
import { MediaRail } from '../components/rails/MediaRail';
import { DetailSkeleton } from '../components/common/Skeletons';
import { isInWatchlist, toggleWatchlist } from '../lib/storage';

export const MovieDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<NormalizedMedia | null>(null);
  const [recommendations, setRecommendations] = useState<NormalizedMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [inWatchlist, setInWatchlist] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (!id) return;
      setLoading(true);
      try {
        const details = await getMovieDetails(id);
        setMovie(details);
        if (details) {
          setInWatchlist(isInWatchlist(details.id, 'movie'));
          const recs = await getRecommendations(details.id, 'movie');
          setRecommendations(recs);
        }
      } catch (err) {
        console.error('Error fetching movie details:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
    window.scrollTo(0, 0);
  }, [id]);

  const handleWatchlistToggle = () => {
    if (!movie) return;
    const updated = toggleWatchlist(movie);
    setInWatchlist(updated);
  };

  if (loading) return <DetailSkeleton />;
  if (!movie) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center">
        <h2 className="text-2xl font-bold text-[#F4F5F7]">Movie Not Found</h2>
        <Link to="/" className="text-xs font-bold text-[#D6FF3F] hover:underline mt-4 inline-block">
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-16">
      <div className="relative w-full min-h-[580px] bg-[#0B0D10] pt-28 pb-12 flex items-end">
        <div className="absolute inset-0">
          <img
            src={movie.backdrop || ''}
            alt={movie.title}
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D10] via-[#0B0D10]/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col md:flex-row gap-8 items-start">
          <div className="w-48 sm:w-64 aspect-[2/3] rounded-2xl overflow-hidden bg-[#171B21] border border-[#292F37] shadow-2xl flex-shrink-0">
            <img src={movie.poster || ''} alt={movie.title} className="w-full h-full object-cover" />
          </div>

          <div className="flex-1 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 bg-[#D6FF3F] text-[#0B0D10] text-[10px] font-extrabold uppercase rounded-md tracking-wider">
                MOVIE
              </span>
              {movie.rating > 0 && (
                <span className="flex items-center gap-1 text-xs font-bold text-[#F4F5F7] bg-[#171B21] border border-[#292F37] px-2.5 py-1 rounded-md">
                  <Star className="w-3.5 h-3.5 fill-[#D6FF3F] text-[#D6FF3F]" />
                  {movie.rating} / 10 ({movie.voteCount} votes)
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-[#F4F5F7] tracking-tight">
              {movie.title}
            </h1>

            {movie.tagline && (
              <p className="text-sm italic text-[#9BA3AE] font-serif">"{movie.tagline}"</p>
            )}

            <div className="flex flex-wrap items-center gap-4 text-xs text-[#9BA3AE]">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#D6FF3F]" /> {movie.year}
              </span>
              {movie.runtime && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#D6FF3F]" /> {movie.runtime} minutes
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {movie.genres.map((g, i) => (
                <span key={i} className="px-3 py-1 bg-[#171B21] border border-[#292F37] rounded-lg text-xs font-medium text-[#F4F5F7]">
                  {g}
                </span>
              ))}
            </div>

            <p className="text-sm text-[#9BA3AE] leading-relaxed max-w-3xl pt-2">
              {movie.overview}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                to={`/watch/movie/${movie.id}`}
                className="px-8 py-3.5 bg-[#D6FF3F] hover:bg-[#c6ef2f] text-[#0B0D10] font-extrabold text-sm rounded-xl flex items-center gap-2.5 shadow-lg shadow-[#D6FF3F]/20 transition-all hover:scale-105 active:scale-95"
              >
                <Play className="w-5 h-5 fill-current" />
                WATCH NOW
              </Link>

              <button
                onClick={handleWatchlistToggle}
                className={`px-6 py-3.5 rounded-xl border font-bold text-sm flex items-center gap-2 transition-all hover:scale-105 active:scale-95 ${
                  inWatchlist
                    ? 'bg-[#D6FF3F] text-[#0B0D10] border-[#D6FF3F]'
                    : 'bg-[#171B21] text-[#9BA3AE] hover:text-white border-[#292F37] hover:border-[#D6FF3F]/50'
                }`}
              >
                <Bookmark className="w-4 h-4 fill-current" />
                {inWatchlist ? 'IN WATCHLIST' : 'ADD TO WATCHLIST'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {movie.cast && movie.cast.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <h2 className="text-lg font-extrabold text-[#F4F5F7] tracking-tight uppercase">Top Cast</h2>
          <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pb-2">
            {movie.cast.map((actor) => (
              <CastCard key={actor.id} cast={actor} />
            ))}
          </div>
        </section>
      )}

      {recommendations.length > 0 && (
        <MediaRail title="You May Also Like" items={recommendations} />
      )}
    </div>
  );
};
