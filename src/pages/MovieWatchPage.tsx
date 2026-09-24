import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMovieDetails, getRecommendations } from '../lib/providers/tmdb';
import { getPlaybackUrl, type ServerId } from '../lib/providers/player';
import type { NormalizedMedia } from '../types/media';
import type { AudioTrack, SubtitleTrack } from '../types/audio';
import { getAvailableAudioTracks, getAvailableSubtitles, resolveBestAudioTrack } from '../lib/audioManager';
import { VyreVideoPlayer } from '../components/watch/VyreVideoPlayer';
import { Star, Bookmark, Share2, ArrowLeft, ShieldCheck, Volume2 } from 'lucide-react';
import { MediaRail } from '../components/rails/MediaRail';
import { isInWatchlist, toggleWatchlist, saveWatchProgress } from '../lib/storage';
import { useAdBlocker } from '../lib/useAdBlocker';

export const MovieWatchPage: React.FC = () => {
  useAdBlocker();
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<NormalizedMedia | null>(null);
  const [recommendations, setRecommendations] = useState<NormalizedMedia[]>([]);
  const [activeServer, setActiveServer] = useState<ServerId>('vidsrc');

  // Audio & Subtitle Tracks State
  const [availableAudioTracks, setAvailableAudioTracks] = useState<AudioTrack[]>([]);
  const [activeAudioTrack, setActiveAudioTrack] = useState<AudioTrack>({
    id: 'en',
    language: 'en',
    label: 'English (Original)',
    flag: '🇺🇸',
    type: 'original',
    available: true,
  });

  const [availableSubtitles, setAvailableSubtitles] = useState<SubtitleTrack[]>([]);
  const [activeSubtitle, setActiveSubtitle] = useState<SubtitleTrack>({
    id: 'en_sub',
    language: 'en',
    label: 'English (CC)',
    flag: '🇺🇸',
    available: true,
  });

  const [playerUrl, setPlayerUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [copied, setCopied] = useState(false);

  const updatePlayerStream = (
    mediaObj: NormalizedMedia,
    srvId: ServerId,
    track: AudioTrack
  ) => {
    const url = getPlaybackUrl(mediaObj, {
      server: srvId,
      language: track.language,
      audioTrack: track,
    });
    setPlayerUrl(url);
  };

  useEffect(() => {
    async function loadMovieAndPlayer() {
      if (!id) return;
      setLoading(true);
      try {
        const details = await getMovieDetails(id);
        setMovie(details);
        if (details) {
          setInWatchlist(isInWatchlist(details.id, 'movie'));

          // Load audio and subtitle tracks
          const tracks = getAvailableAudioTracks(details);
          const subs = getAvailableSubtitles(details);
          setAvailableAudioTracks(tracks);
          setAvailableSubtitles(subs);

          // Resolve active audio track based on user preferences
          const resolvedAudio = resolveBestAudioTrack(tracks, null, (details as any).originalLanguage);
          setActiveAudioTrack(resolvedAudio);

          if (subs.length > 0) setActiveSubtitle(subs[0]);

          updatePlayerStream(details, activeServer, resolvedAudio);

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
      } finally {
        setLoading(false);
      }
    }

    loadMovieAndPlayer();
    window.scrollTo(0, 0);
  }, [id]);

  const handleServerChange = (serverId: ServerId) => {
    setActiveServer(serverId);
    if (movie) {
      updatePlayerStream(movie, serverId, activeAudioTrack);
    }
  };

  const handleAudioTrackChange = (track: AudioTrack) => {
    setActiveAudioTrack(track);
    if (movie) {
      updatePlayerStream(movie, activeServer, track);
    }
  };

  const handleSubtitleChange = (sub: SubtitleTrack) => {
    setActiveSubtitle(sub);
  };

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
      <div className="pt-24 max-w-7xl mx-auto px-4 space-y-4 select-none">
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
    <div className="pt-20 sm:pt-24 pb-16 space-y-6 select-none">
      {/* Top Header Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <Link
          to={`/movie/${movie.id}`}
          className="inline-flex items-center gap-2 text-xs font-bold text-[#9BA3AE] hover:text-[#D6FF3F] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to details
        </Link>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#171B21] border border-[#D6FF3F]/30 text-[#D6FF3F] rounded-full text-[10px] font-extrabold tracking-wider uppercase">
          <ShieldCheck className="w-3.5 h-3.5 fill-[#D6FF3F]/20" /> AD-SHIELD PROTECTED (NO POPUPS)
        </div>
      </div>

      {/* DYNAMIC PLAYER CONTAINER WITH AUDIO SELECTOR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <VyreVideoPlayer
          title={movie.title}
          playerUrl={playerUrl}
          availableAudioTracks={availableAudioTracks}
          activeAudioTrack={activeAudioTrack}
          availableSubtitles={availableSubtitles}
          activeSubtitle={activeSubtitle}
          activeServer={activeServer}
          onSelectAudioTrack={handleAudioTrackChange}
          onSelectSubtitle={handleSubtitleChange}
          onSelectServer={handleServerChange}
        />
      </div>

      {/* MOVIE METADATA UNDER PLAYER */}
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

        {/* AUDIO & SUBTITLE SUMMARY CARD */}
        <div className="p-4 bg-[#111419] border border-[#292F37] rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-xs font-extrabold text-[#D6FF3F] uppercase tracking-wider flex items-center gap-2">
              <Volume2 className="w-4 h-4" /> Available Audio & Dubbed Renditions
            </h4>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {availableAudioTracks.map((t) => (
                <span
                  key={t.id}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 ${
                    t.id === activeAudioTrack.id
                      ? 'bg-[#D6FF3F]/20 text-[#D6FF3F] border border-[#D6FF3F]/40'
                      : 'bg-[#171B21] text-[#9BA3AE] border border-[#292F37]'
                  }`}
                >
                  <span>{t.flag}</span>
                  <span>{t.label}</span>
                </span>
              ))}
            </div>
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

      {/* RELATED CONTENT */}
      {recommendations.length > 0 && (
        <MediaRail title="You May Also Like" items={recommendations} />
      )}
    </div>
  );
};
