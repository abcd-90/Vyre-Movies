import React, { useEffect, useState } from 'react';
import { Hero } from '../components/home/Hero';
import { MediaRail } from '../components/rails/MediaRail';
import { HeroSkeleton } from '../components/common/Skeletons';
import {
  getTrending,
  getPopularMovies,
  getPopularTVShows,
  getRecentlyAdded,
  getTopRatedMovies,
  getBollywoodMovies,
  getPunjabiMovies,
  discoverMedia,
} from '../lib/providers/tmdb';
import type { NormalizedMedia, WatchProgress } from '../types/media';
import { getWatchHistory } from '../lib/storage';
import { Play, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HomePage: React.FC = () => {
  const [heroMedia, setHeroMedia] = useState<NormalizedMedia | null>(null);
  const [trending, setTrending] = useState<NormalizedMedia[]>([]);
  const [popularMovies, setPopularMovies] = useState<NormalizedMedia[]>([]);
  const [popularTV, setPopularTV] = useState<NormalizedMedia[]>([]);
  const [bollywoodMovies, setBollywoodMovies] = useState<NormalizedMedia[]>([]);
  const [punjabiMovies, setPunjabiMovies] = useState<NormalizedMedia[]>([]);
  const [recentlyAdded, setRecentlyAdded] = useState<NormalizedMedia[]>([]);
  const [topRated, setTopRated] = useState<NormalizedMedia[]>([]);
  const [actionMovies, setActionMovies] = useState<NormalizedMedia[]>([]);
  const [sciFiMovies, setSciFiMovies] = useState<NormalizedMedia[]>([]);
  const [comedyMovies, setComedyMovies] = useState<NormalizedMedia[]>([]);
  const [watchHistory, setWatchHistory] = useState<WatchProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [
          trendingData,
          popMoviesData,
          popTvData,
          bollyData,
          punjabiData,
          recentData,
          topRatedData,
          actionData,
          sciFiData,
          comedyData,
        ] = await Promise.all([
          getTrending('all', 'week'),
          getPopularMovies(),
          getPopularTVShows(),
          getBollywoodMovies(),
          getPunjabiMovies(),
          getRecentlyAdded(),
          getTopRatedMovies(),
          discoverMedia('movie', { genre: 'action' }),
          discoverMedia('movie', { genre: 'sci-fi' }),
          discoverMedia('movie', { genre: 'comedy' }),
        ]);

        setTrending(trendingData);
        setPopularMovies(popMoviesData);
        setPopularTV(popTvData);
        setBollywoodMovies(bollyData);
        setPunjabiMovies(punjabiData);
        setRecentlyAdded(recentData);
        setTopRated(topRatedData);
        setActionMovies(actionData);
        setSciFiMovies(sciFiData);
        setComedyMovies(comedyData);

        if (trendingData.length > 0) {
          setHeroMedia(trendingData[0]);
        }
      } catch (err) {
        console.error('Error loading homepage data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
    setWatchHistory(getWatchHistory());
  }, []);

  if (loading) {
    return <HeroSkeleton />;
  }

  return (
    <div className="space-y-6 pb-12">
      {heroMedia && <Hero media={heroMedia} />}

      {watchHistory.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 my-8">
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#F4F5F7] flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-[#D6FF3F]" /> Continue Watching
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {watchHistory.slice(0, 4).map((item) => {
              const watchLink =
                item.type === 'movie'
                  ? `/watch/movie/${item.mediaId}`
                  : `/watch/tv/${item.mediaId}/${item.season || 1}/${item.episode || 1}`;

              const percent = Math.min(
                100,
                Math.round((item.progressMinutes / (item.totalMinutes || 120)) * 100)
              );

              return (
                <Link
                  key={`${item.mediaId}-${item.season}-${item.episode}`}
                  to={watchLink}
                  className="group relative bg-[#171B21] border border-[#292F37] hover:border-[#D6FF3F]/50 rounded-xl overflow-hidden card-lift flex flex-col"
                >
                  <div className="relative aspect-video w-full bg-[#0B0D10]">
                    <img
                      src={item.backdrop || item.poster || ''}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-10 h-10 rounded-full bg-[#D6FF3F] text-[#0B0D10] flex items-center justify-center">
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      </div>
                    </div>
                  </div>

                  <div className="w-full h-1 bg-[#292F37]">
                    <div
                      className="h-full bg-[#D6FF3F] transition-all"
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  <div className="p-3">
                    <h4 className="text-xs font-bold text-[#F4F5F7] group-hover:text-[#D6FF3F] transition-colors truncate">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-[#9BA3AE] mt-0.5">
                      {item.type === 'tv'
                        ? `S${item.season} E${item.episode} — ${item.episodeTitle || 'Episode'}`
                        : `${percent}% Watched`}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <MediaRail title="Trending Now" subtitle="Most watched content this week" items={trending} viewAllLink="/trending" />
      <MediaRail title="Bollywood Blockbusters" subtitle="Popular Hindi Cinema" items={bollywoodMovies} viewAllLink="/movies" />
      <MediaRail title="Punjabi Hits & Cinema" subtitle="Top Punjabi Movies" items={punjabiMovies} viewAllLink="/movies" />
      <MediaRail title="Popular Movies" items={popularMovies} viewAllLink="/movies" />
      <MediaRail title="Popular TV Shows" items={popularTV} viewAllLink="/tv" />
      <MediaRail title="Recently Added" items={recentlyAdded} />
      <MediaRail title="Top Rated Classics" items={topRated} viewAllLink="/movies" />
      <MediaRail title="Action & Thrills" items={actionMovies} viewAllLink="/genre/action" />
      <MediaRail title="Sci-Fi & Fantasy" items={sciFiMovies} viewAllLink="/genre/sci-fi" />
      <MediaRail title="Comedy Blockbusters" items={comedyMovies} viewAllLink="/genre/comedy" />
    </div>
  );
};
