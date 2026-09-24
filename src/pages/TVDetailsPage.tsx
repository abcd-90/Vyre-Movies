import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Play, Bookmark, Star, Calendar, Tv, Layers, Volume2, MessageSquare } from 'lucide-react';
import { getTVDetails, getTVSeasonDetails, getRecommendations } from '../lib/providers/tmdb';
import type { NormalizedMedia, SeasonDetails } from '../types/media';
import type { AudioTrack, SubtitleTrack } from '../types/audio';
import { getAvailableAudioTracks, getAvailableSubtitles } from '../lib/audioManager';
import { CastCard } from '../components/cards/CastCard';
import { MediaRail } from '../components/rails/MediaRail';
import { DetailSkeleton } from '../components/common/Skeletons';
import { CustomSeasonSelect } from '../components/watch/CustomSeasonSelect';
import { isInWatchlist, toggleWatchlist } from '../lib/storage';

export const TVDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [show, setShow] = useState<NormalizedMedia | null>(null);
  const [seasonDetails, setSeasonDetails] = useState<SeasonDetails | null>(null);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [recommendations, setRecommendations] = useState<NormalizedMedia[]>([]);
  const [availableAudio, setAvailableAudio] = useState<AudioTrack[]>([]);
  const [availableSubs, setAvailableSubs] = useState<SubtitleTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [inWatchlist, setInWatchlist] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (!id) return;
      setLoading(true);
      try {
        const details = await getTVDetails(id);
        setShow(details);
        if (details) {
          setInWatchlist(isInWatchlist(details.id, 'tv'));

          const audioTracks = getAvailableAudioTracks(details, 1, 1);
          const subTracks = getAvailableSubtitles(details, 1, 1);
          setAvailableAudio(audioTracks);
          setAvailableSubs(subTracks);

          const seasonData = await getTVSeasonDetails(details.id, 1);
          setSeasonDetails(seasonData);
          const recs = await getRecommendations(details.id, 'tv');
          setRecommendations(recs);
        }
      } catch (err) {
        console.error('Error loading TV details:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
    window.scrollTo(0, 0);
  }, [id]);

  const handleSeasonChange = async (seasonNum: number) => {
    if (!show) return;
    setSelectedSeason(seasonNum);
    const seasonData = await getTVSeasonDetails(show.id, seasonNum);
    setSeasonDetails(seasonData);

    // Refresh audio tracks for season
    const audioTracks = getAvailableAudioTracks(show, seasonNum, 1);
    setAvailableAudio(audioTracks);
  };

  const handleWatchlistToggle = () => {
    if (!show) return;
    const updated = toggleWatchlist(show);
    setInWatchlist(updated);
  };

  if (loading) return <DetailSkeleton />;
  if (!show) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center select-none">
        <h2 className="text-2xl font-bold text-[#F4F5F7]">TV Series Not Found</h2>
        <Link to="/" className="text-xs font-bold text-[#D6FF3F] hover:underline mt-4 inline-block">
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-16 select-none">
      <div className="relative w-full min-h-[580px] bg-[#0B0D10] pt-28 pb-12 flex items-end">
        <div className="absolute inset-0">
          <img
            src={show.backdrop || ''}
            alt={show.title}
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D10] via-[#0B0D10]/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col md:flex-row gap-8 items-start">
          <div className="w-48 sm:w-64 aspect-[2/3] rounded-2xl overflow-hidden bg-[#171B21] border border-[#292F37] shadow-2xl flex-shrink-0">
            <img src={show.poster || ''} alt={show.title} className="w-full h-full object-cover" />
          </div>

          <div className="flex-1 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 bg-[#D6FF3F] text-[#0B0D10] text-[10px] font-extrabold uppercase rounded-md tracking-wider flex items-center gap-1">
                <Tv className="w-3 h-3" /> TV SERIES
              </span>
              {show.rating > 0 && (
                <span className="flex items-center gap-1 text-xs font-bold text-[#F4F5F7] bg-[#171B21] border border-[#292F37] px-2.5 py-1 rounded-md">
                  <Star className="w-3.5 h-3.5 fill-[#D6FF3F] text-[#D6FF3F]" />
                  {show.rating} / 10
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-[#F4F5F7] tracking-tight">
              {show.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-[#9BA3AE]">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#D6FF3F]" /> First Aired: {show.year}
              </span>
              <span className="flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-[#D6FF3F]" /> {show.seasonsCount || 1} Season{show.seasonsCount && show.seasonsCount > 1 ? 's' : ''}
              </span>
            </div>

            {/* AUDIO & SUBTITLE METADATA DISPLAY */}
            <div className="space-y-3 pt-2">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs font-extrabold text-[#D6FF3F] uppercase tracking-wider flex items-center gap-1.5">
                  <Volume2 className="w-4 h-4" /> Series Audio:
                </span>
                <div className="flex flex-wrap items-center gap-1.5">
                  {availableAudio.map((track) => (
                    <span
                      key={track.id}
                      className="px-2.5 py-1 bg-[#171B21] border border-[#292F37] rounded-lg text-xs font-bold text-[#F4F5F7] flex items-center gap-1.5"
                    >
                      <span>🎧</span>
                      <span>{track.flag}</span>
                      <span>{track.label}</span>
                    </span>
                  ))}
                </div>
              </div>

              {availableSubs.length > 0 && (
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-xs font-extrabold text-[#9BA3AE] uppercase tracking-wider flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-[#D6FF3F]" /> Subtitles:
                  </span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {availableSubs.filter((s) => s.id !== 'off').map((sub) => (
                      <span
                        key={sub.id}
                        className="px-2.5 py-0.5 bg-[#171B21] border border-[#292F37] rounded-md text-[11px] font-semibold text-[#9BA3AE] flex items-center gap-1"
                      >
                        <span className="text-[#D6FF3F]">CC</span>
                        <span>{sub.label}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {show.genres.map((g, i) => (
                <span key={i} className="px-3 py-1 bg-[#171B21] border border-[#292F37] rounded-lg text-xs font-medium text-[#F4F5F7]">
                  {g}
                </span>
              ))}
            </div>

            <p className="text-sm text-[#9BA3AE] leading-relaxed max-w-3xl pt-2">
              {show.overview}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                to={`/watch/tv/${show.id}/1/1`}
                className="px-8 py-3.5 bg-[#D6FF3F] hover:bg-[#c6ef2f] text-[#0B0D10] font-extrabold text-sm rounded-xl flex items-center gap-2.5 shadow-lg shadow-[#D6FF3F]/20 transition-all hover:scale-105 active:scale-95"
              >
                <Play className="w-5 h-5 fill-current" />
                START S01 E01
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

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between border-b border-[#292F37] pb-4">
          <h2 className="text-xl font-extrabold text-[#F4F5F7]">Episodes</h2>
          <CustomSeasonSelect
            totalSeasons={show.seasonsCount || 1}
            currentSeason={selectedSeason}
            onSelectSeason={handleSeasonChange}
          />
        </div>

        {seasonDetails?.episodes && seasonDetails.episodes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {seasonDetails.episodes.map((ep) => (
              <Link
                key={ep.episodeNumber}
                to={`/watch/tv/${show.id}/${selectedSeason}/${ep.episodeNumber}`}
                className="group bg-[#171B21] border border-[#292F37] hover:border-[#D6FF3F]/60 rounded-xl overflow-hidden card-lift flex flex-col"
              >
                <div className="relative aspect-video bg-[#0B0D10]">
                  <img
                    src={ep.stillPath || show.backdrop || ''}
                    alt={ep.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-10 h-10 rounded-full bg-[#D6FF3F] text-[#0B0D10] flex items-center justify-center">
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    </div>
                  </div>
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-[#0B0D10]/80 backdrop-blur-md rounded text-[10px] font-extrabold text-[#D6FF3F]">
                    S{selectedSeason} E{ep.episodeNumber}
                  </span>
                </div>
                <div className="p-4 space-y-1">
                  <h4 className="text-sm font-bold text-[#F4F5F7] group-hover:text-[#D6FF3F] transition-colors truncate">
                    {ep.episodeNumber}. {ep.title}
                  </h4>
                  <p className="text-xs text-[#9BA3AE] line-clamp-2 leading-relaxed">
                    {ep.overview}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-xs text-[#9BA3AE]">No episodes available for this season.</p>
        )}
      </section>

      {show.cast && show.cast.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <h2 className="text-lg font-extrabold text-[#F4F5F7] tracking-tight uppercase">Series Cast</h2>
          <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pb-2">
            {show.cast.map((actor) => (
              <CastCard key={actor.id} cast={actor} />
            ))}
          </div>
        </section>
      )}

      {recommendations.length > 0 && (
        <MediaRail title="Similar TV Shows" items={recommendations} />
      )}
    </div>
  );
};
