import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMovieDetails, getRecommendations } from '../lib/providers/tmdb';
import { getPlaybackUrl, isAllowedPlaybackUrl } from '../lib/providers/player';
import type { NormalizedMedia } from '../types/media';
import { Star, Bookmark, Share2, AlertTriangle, RefreshCw, ArrowLeft } from 'lucide-react';
import { MediaRail } from '../components/rails/MediaRail';
import { isInWatchlist, toggleWatchlist, saveWatchProgress } from '../lib/storage';

export const MovieWatchPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<NormalizedMedia | null>(null);
  const [recommendations, setRecommendations] = useState<NormalizedMedia[]>([]);
  const [playerUrl, setPlayerUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [playerError, setPlayerError] = useState(false);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadMovieAndPlayer() {
      if (!id) return;
      setLoading(true);
      setPlayerError(false);
      try {
        const details = await getMovieDetails(id);
        setMovie(details);
        if (details) {
          setInWatchlist(isInWatchlist(details.id, 'movie'));
          const url = getPlaybackUrl(details);
          if (isAllowedPlaybackUrl(url)) {
            setPlayerUrl(url);
          } else {
            setPlayerUrl(url);
          }

          saveWatchProgress({
            mediaId: details.id,
            type: 'movie',
            title: details.title,
            poster: details.poster,
            backdrop: details.backdrop,
            progressMinutes: 10,
            totalMinutes: details.runtime || 120,
          });

          const recs = await getRecommendations(details.id, 'movie');
          setRecommendations(recs);
        }
      } catch (err) {
        console.error('Error setting up movie watch page:', err);
        setPlayerError(true);
      } finally {
        setLoading(false);
      }
    }

    loadMovieAndPlayer();
    window.scrollTo(0, 0);
  }, [id]);

  const handleWatchlistToggle = () => {
    if (!movie) return;
    const updated = toggleWatchlist(movie);
    setInWatchlist(updated);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="pt-24 max-w-7xl mx-auto px-4 space-y-4">
        <div className="w-full aspect-video bg-[#171B21] rounded-2xl skeleton-shimmer" />
        <div className="w-1/3 h-8 rounded bg-[#171B21] skeleton-shimmer" />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="pt-32 text-center max-w-7xl mx-auto px-4 space-y-4">
        <p className="text-[#F4F5F7]">Movie media unavailable.</p>
        <Link to="/" className="text-xs font-bold text-[#D6FF3F] hover:underline">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="pt-20 sm:pt-24 pb-16 space-y-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to={`/movie/${movie.id}`}
          className="inline-flex items-center gap-2 text-xs font-bold text-[#9BA3AE] hover:text-[#D6FF3F] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to details
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative w-full aspect-video bg-black rounded-2xl border border-[#292F37] overflow-hidden shadow-2xl">
          {playerError ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#111419] p-6 text-center space-y-3">
              <AlertTriangle className="w-10 h-10 text-[#D6FF3F]" />
              <h3 className="text-base font-bold text-[#F4F5F7]">Playback Couldn't Be Loaded</h3>
              <p className="text-xs text-[#9BA3AE] max-w-sm">
                The streaming server encountered a temporary connection issue.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-[#D6FF3F] text-[#0B0D10] font-bold text-xs rounded-xl flex items-center gap-2 hover:scale-105 transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Retry Playback
              </button>
            </div>
          ) : (
            <iframe
              src={playerUrl}
              title={movie.title}
              className="w-full h-full border-0"
              allowFullScreen
              allow="autoplay; encrypted-media; picture-in-picture"
              sandbox="allow-scripts allow-same-origin allow-forms allow-presentation"
            />
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#292F37] pb-6">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#F4F5F7] tracking-tight">
              {movie.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-xs text-[#9BA3AE]">
              <span>{movie.year}</span>
              <span>•</span>
              {movie.rating > 0 && (
                <span className="flex items-center gap-1 text-[#D6FF3F] font-bold">
                  <Star className="w-3.5 h-3.5 fill-current" /> {movie.rating}
                </span>
              )}
              {movie.runtime && (
                <>
                  <span>•</span>
                  <span>{movie.runtime} minutes</span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleWatchlistToggle}
              className={`px-4 py-2.5 rounded-xl border font-bold text-xs flex items-center gap-2 transition-all ${
                inWatchlist
                  ? 'bg-[#D6FF3F] text-[#0B0D10] border-[#D6FF3F]'
                  : 'bg-[#171B21] text-[#9BA3AE] hover:text-white border-[#292F37] hover:border-[#D6FF3F]/50'
              }`}
            >
              <Bookmark className="w-4 h-4 fill-current" />
              {inWatchlist ? 'IN WATCHLIST' : 'WATCHLIST'}
            </button>

            <button
              onClick={handleShare}
              className="p-2.5 bg-[#171B21] border border-[#292F37] hover:border-[#D6FF3F]/50 text-[#9BA3AE] hover:text-white rounded-xl transition-all relative"
              title="Share Title"
            >
              <Share2 className="w-4 h-4" />
              {copied && (
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-[#D6FF3F] text-[#0B0D10] text-[10px] font-bold rounded shadow-md whitespace-nowrap">
                  Copied Link!
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {movie.genres.map((g, i) => (
              <span key={i} className="px-2.5 py-1 bg-[#171B21] border border-[#292F37] rounded-lg text-xs text-[#F4F5F7]">
                {g}
              </span>
            ))}
          </div>
          <p className="text-sm text-[#9BA3AE] leading-relaxed max-w-4xl">
            {movie.overview}
          </p>
        </div>
      </div>

      {recommendations.length > 0 && (
        <MediaRail title="You May Also Like" items={recommendations} />
      )}
    </div>
  );
};
