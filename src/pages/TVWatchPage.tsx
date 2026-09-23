import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getTVDetails, getTVSeasonDetails, getRecommendations } from '../lib/providers/tmdb';
import { getPlaybackUrl } from '../lib/providers/player';
import type { NormalizedMedia, SeasonDetails, EpisodeDetails } from '../types/media';
import { CustomSeasonSelect } from '../components/watch/CustomSeasonSelect';
import { Play, AlertTriangle, RefreshCw, ArrowLeft, Bookmark } from 'lucide-react';
import { MediaRail } from '../components/rails/MediaRail';
import { isInWatchlist, toggleWatchlist, saveWatchProgress } from '../lib/storage';

export const TVWatchPage: React.FC = () => {
  const { id, season = '1', episode = '1' } = useParams<{ id: string; season: string; episode: string }>();
  const navigate = useNavigate();

  const currentSeasonNum = parseInt(season, 10) || 1;
  const currentEpisodeNum = parseInt(episode, 10) || 1;

  const [show, setShow] = useState<NormalizedMedia | null>(null);
  const [seasonDetails, setSeasonDetails] = useState<SeasonDetails | null>(null);
  const [currentEpisodeObj, setCurrentEpisodeObj] = useState<EpisodeDetails | null>(null);
  const [recommendations, setRecommendations] = useState<NormalizedMedia[]>([]);
  const [playerUrl, setPlayerUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [playerError, setPlayerError] = useState(false);
  const [inWatchlist, setInWatchlist] = useState(false);

  useEffect(() => {
    async function loadTVWatch() {
      if (!id) return;
      setLoading(true);
      setPlayerError(false);
      try {
        const details = await getTVDetails(id);
        setShow(details);
        if (details) {
          setInWatchlist(isInWatchlist(details.id, 'tv'));

          const url = getPlaybackUrl(details, {
            season: currentSeasonNum,
            episode: currentEpisodeNum,
          });
          setPlayerUrl(url);

          const seasonData = await getTVSeasonDetails(details.id, currentSeasonNum);
          setSeasonDetails(seasonData);

          const activeEp = seasonData?.episodes.find((e) => e.episodeNumber === currentEpisodeNum);
          setCurrentEpisodeObj(
            activeEp || {
              episodeNumber: currentEpisodeNum,
              seasonNumber: currentSeasonNum,
              title: `Episode ${currentEpisodeNum}`,
              overview: 'Episode synopsis',
              stillPath: details.backdrop,
            }
          );

          saveWatchProgress({
            mediaId: details.id,
            type: 'tv',
            title: details.title,
            poster: details.poster,
            backdrop: details.backdrop,
            season: currentSeasonNum,
            episode: currentEpisodeNum,
            episodeTitle: activeEp?.title || `Episode ${currentEpisodeNum}`,
            progressMinutes: 15,
            totalMinutes: activeEp?.runtime || 45,
          });

          const recs = await getRecommendations(details.id, 'tv');
          setRecommendations(recs);
        }
      } catch (err) {
        console.error('Error setting up TV watch page:', err);
        setPlayerError(true);
      } finally {
        setLoading(false);
      }
    }

    loadTVWatch();
  }, [id, currentSeasonNum, currentEpisodeNum]);

  const handleSelectSeason = (newSeasonNum: number) => {
    if (!id) return;
    navigate(`/watch/tv/${id}/${newSeasonNum}/1`);
  };

  const handleSelectEpisode = (epNum: number) => {
    if (!id) return;
    navigate(`/watch/tv/${id}/${currentSeasonNum}/${epNum}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleWatchlistToggle = () => {
    if (!show) return;
    const updated = toggleWatchlist(show);
    setInWatchlist(updated);
  };

  if (loading) {
    return (
      <div className="pt-24 max-w-7xl mx-auto px-4 space-y-4">
        <div className="w-full aspect-video bg-[#171B21] rounded-2xl skeleton-shimmer" />
        <div className="w-1/3 h-8 rounded bg-[#171B21] skeleton-shimmer" />
      </div>
    );
  }

  if (!show) {
    return (
      <div className="pt-32 text-center max-w-7xl mx-auto px-4 space-y-4">
        <p className="text-[#F4F5F7]">TV show playback unavailable.</p>
        <Link to="/" className="text-xs font-bold text-[#D6FF3F] hover:underline">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="pt-20 sm:pt-24 pb-16 space-y-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to={`/tv/${show.id}`}
          className="inline-flex items-center gap-2 text-xs font-bold text-[#9BA3AE] hover:text-[#D6FF3F] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to show details
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
              title={`${show.title} S${currentSeasonNum} E${currentEpisodeNum}`}
              className="w-full h-full border-0"
              allowFullScreen
              allow="autoplay; encrypted-media; picture-in-picture"
              sandbox="allow-scripts allow-same-origin allow-forms allow-presentation"
            />
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#292F37] pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-extrabold text-[#D6FF3F]">
              <span>S{currentSeasonNum} : E{currentEpisodeNum}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F4F5F7]">
              {show.title} — <span className="text-[#9BA3AE] font-semibold">{currentEpisodeObj?.title}</span>
            </h1>
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
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-extrabold text-[#F4F5F7]">Season Episodes</h3>
            <CustomSeasonSelect
              totalSeasons={show.seasonsCount || 1}
              currentSeason={currentSeasonNum}
              onSelectSeason={handleSelectSeason}
            />
          </div>

          {seasonDetails?.episodes && seasonDetails.episodes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {seasonDetails.episodes.map((ep) => {
                const isActive = ep.episodeNumber === currentEpisodeNum;
                return (
                  <button
                    key={ep.episodeNumber}
                    onClick={() => handleSelectEpisode(ep.episodeNumber)}
                    className={`text-left p-2.5 rounded-xl border transition-all flex items-center gap-3 ${
                      isActive
                        ? 'bg-[#171B21] border-[#D6FF3F] shadow-md ring-1 ring-[#D6FF3F]'
                        : 'bg-[#111419] border-[#292F37] hover:border-[#D6FF3F]/40 hover:bg-[#171B21]'
                    }`}
                  >
                    <div className="relative w-16 h-12 rounded-lg bg-[#0B0D10] overflow-hidden flex-shrink-0">
                      <img
                        src={ep.stillPath || show.backdrop || ''}
                        alt={ep.title}
                        className="w-full h-full object-cover"
                      />
                      {isActive && (
                        <div className="absolute inset-0 bg-[#D6FF3F]/80 flex items-center justify-center">
                          <Play className="w-4 h-4 text-[#0B0D10] fill-current" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-extrabold text-[#D6FF3F] tracking-wider uppercase">
                        EPISODE {ep.episodeNumber}
                      </span>
                      <h4 className={`text-xs font-bold truncate ${isActive ? 'text-[#D6FF3F]' : 'text-[#F4F5F7]'}`}>
                        {ep.title}
                      </h4>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-[#9BA3AE]">No episode details available.</p>
          )}
        </div>

        {currentEpisodeObj?.overview && (
          <div className="p-4 bg-[#111419] border border-[#292F37] rounded-xl space-y-1">
            <h4 className="text-xs font-extrabold text-[#F4F5F7] uppercase tracking-wider">
              Episode {currentEpisodeNum} Overview
            </h4>
            <p className="text-xs text-[#9BA3AE] leading-relaxed">
              {currentEpisodeObj.overview}
            </p>
          </div>
        )}
      </div>

      {recommendations.length > 0 && (
        <MediaRail title="Recommended Series" items={recommendations} />
      )}
    </div>
  );
};
