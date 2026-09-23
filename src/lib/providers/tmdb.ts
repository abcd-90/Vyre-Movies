import type { NormalizedMedia, SeasonDetails, EpisodeDetails, FilterOptions, Genre } from '../../types/media';

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY || '1194f31f73643d6de969014c96d483f4';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export function getPosterUrl(path: string | null, size: 'w342' | 'w500' | 'original' = 'w500'): string {
  if (!path) return 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&auto=format&fit=crop&q=80';
  if (path.startsWith('http')) return path;
  return `${IMAGE_BASE_URL}/${size}${path}`;
}

export function getBackdropUrl(path: string | null, size: 'w780' | 'w1280' | 'original' = 'w1280'): string {
  if (!path) return 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1280&auto=format&fit=crop&q=80';
  if (path.startsWith('http')) return path;
  return `${IMAGE_BASE_URL}/${size}${path}`;
}

export const GENRES: Genre[] = [
  { id: 28, name: 'Action', slug: 'action' },
  { id: 35, name: 'Comedy', slug: 'comedy' },
  { id: 18, name: 'Drama', slug: 'drama' },
  { id: 878, name: 'Sci-Fi', slug: 'sci-fi' },
  { id: 53, name: 'Thriller', slug: 'thriller' },
  { id: 12, name: 'Adventure', slug: 'adventure' },
  { id: 16, name: 'Animation', slug: 'animation' },
  { id: 80, name: 'Crime', slug: 'crime' },
  { id: 14, name: 'Fantasy', slug: 'fantasy' },
  { id: 9648, name: 'Mystery', slug: 'mystery' },
  { id: 10749, name: 'Romance', slug: 'romance' },
  { id: 27, name: 'Horror', slug: 'horror' },
];

const FALLBACK_MEDIA: NormalizedMedia[] = [
  {
    id: 157336,
    tmdbId: 157336,
    imdbId: 'tt0816692',
    type: 'movie',
    title: 'Interstellar',
    tagline: 'Mankind was born on Earth. It was never meant to die here.',
    poster: getPosterUrl('/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg'),
    backdrop: getBackdropUrl('/xJHokMbljvjADYdit5fKSuV0Te.jpg'),
    overview: 'The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.',
    year: 2014,
    rating: 8.4,
    voteCount: 35400,
    genres: ['Adventure', 'Drama', 'Sci-Fi'],
    runtime: 169,
    status: 'Released',
    cast: [
      { id: 10296, name: 'Matthew McConaughey', character: 'Joseph Cooper', profilePath: getPosterUrl('/wE33L2c2hE663B5YtS4N9H3V5.jpg', 'w342') },
      { id: 1813, name: 'Anne Hathaway', character: 'Dr. Amelia Brand', profilePath: getPosterUrl('/tL2n8A2Z60k3mE6a8kG5V34t12.jpg', 'w342') },
      { id: 83002, name: 'Jessica Chastain', character: 'Murph Cooper', profilePath: getPosterUrl('/x5V3nJ0bV9mJ23a7hH1B5G34.jpg', 'w342') },
      { id: 3895, name: 'Michael Caine', character: 'Professor Brand', profilePath: getPosterUrl('/bT4s32Jk60vC10z9k5G34.jpg', 'w342') }
    ]
  },
  {
    id: 27205,
    tmdbId: 27205,
    imdbId: 'tt1375666',
    type: 'movie',
    title: 'Inception',
    tagline: 'Your mind is the scene of the crime.',
    poster: getPosterUrl('/oYu2T8gZ98vhAxyPWGlDFftxSLs.jpg'),
    backdrop: getBackdropUrl('/8ZTVqv8Tfr9Gl9vTGlLGi4F6kWD.jpg'),
    overview: 'Cobb, a skilled thief who steals valuable secrets from deep within the subconscious during the dream state, is offered a chance at redemption if he can perform inception: planting an idea into a target’s mind.',
    year: 2010,
    rating: 8.4,
    voteCount: 37200,
    genres: ['Action', 'Sci-Fi', 'Adventure'],
    runtime: 148,
    status: 'Released',
    cast: [
      { id: 6193, name: 'Leonardo DiCaprio', character: 'Dom Cobb', profilePath: getPosterUrl('/wo2hJpn04vbtmh0B9utCFdsQoiM.jpg', 'w342') },
      { id: 24045, name: 'Joseph Gordon-Levitt', character: 'Arthur', profilePath: getPosterUrl('/dhvHwQhC0bW8yT0L12b9z.jpg', 'w342') },
      { id: 27578, name: 'Elliot Page', character: 'Ariadne', profilePath: getPosterUrl('/pG10L0x.jpg', 'w342') },
      { id: 2524, name: 'Tom Hardy', character: 'Eames', profilePath: getPosterUrl('/6A4H46J.jpg', 'w342') }
    ]
  },
  {
    id: 872585,
    tmdbId: 872585,
    imdbId: 'tt15398776',
    type: 'movie',
    title: 'Oppenheimer',
    tagline: 'The world changes forever.',
    poster: getPosterUrl('/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg'),
    backdrop: getBackdropUrl('/rLb2cwF3Pazuxaj0sRXQ037tGI1.jpg'),
    overview: 'The story of J. Robert Oppenheimer’s role in the development of the atomic bomb during World War II.',
    year: 2023,
    rating: 8.1,
    voteCount: 9100,
    genres: ['Drama', 'History'],
    runtime: 180,
    status: 'Released',
    cast: [
      { id: 2037, name: 'Cillian Murphy', character: 'J. Robert Oppenheimer', profilePath: getPosterUrl('/pP12.jpg', 'w342') },
      { id: 5081, name: 'Emily Blunt', character: 'Katherine Oppenheimer', profilePath: getPosterUrl('/nL34.jpg', 'w342') },
      { id: 1892, name: 'Matt Damon', character: 'Leslie Groves', profilePath: getPosterUrl('/mD56.jpg', 'w342') },
      { id: 2259, name: 'Robert Downey Jr.', character: 'Lewis Strauss', profilePath: getPosterUrl('/rD78.jpg', 'w342') }
    ]
  },
  {
    id: 693134,
    tmdbId: 693134,
    imdbId: 'tt1160419',
    type: 'movie',
    title: 'Dune: Part Two',
    tagline: 'Long live the fighters.',
    poster: getPosterUrl('/1pdfLPoWBkCGWOSdVFjTLBviMs1.jpg'),
    backdrop: getBackdropUrl('/xOMo8WhK218AO2hMFiSZjviysOH.jpg'),
    overview: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.',
    year: 2024,
    rating: 8.2,
    voteCount: 5600,
    genres: ['Sci-Fi', 'Adventure'],
    runtime: 166,
    status: 'Released',
    cast: [
      { id: 1190668, name: 'Timothée Chalamet', character: 'Paul Atreides', profilePath: getPosterUrl('/tC99.jpg', 'w342') },
      { id: 505710, name: 'Zendaya', character: 'Chani', profilePath: getPosterUrl('/zD88.jpg', 'w342') },
      { id: 9343, name: 'Rebecca Ferguson', character: 'Lady Jessica Atreides', profilePath: getPosterUrl('/rF77.jpg', 'w342') }
    ]
  },
  {
    id: 94605,
    tmdbId: 94605,
    imdbId: 'tt11198330',
    type: 'tv',
    title: 'Arcane',
    tagline: 'Every legend has a beginning.',
    poster: getPosterUrl('/fqld2gZ1aXy2J2xQ.jpg'),
    backdrop: getBackdropUrl('/uDgy6hyPd3mATyCtT222.jpg'),
    overview: 'Amid the fraught balance between the rich city of Piltover and the seedy underground of Zaun, two sisters fight on opposite sides of a war between rival technologies and incompatible convictions.',
    year: 2021,
    rating: 8.7,
    voteCount: 4200,
    genres: ['Animation', 'Sci-Fi', 'Action'],
    seasonsCount: 2,
    episodesCount: 18,
    status: 'Ended',
    cast: [
      { id: 55060, name: 'Hailee Steinfeld', character: 'Vi', profilePath: getPosterUrl('/hS11.jpg', 'w342') },
      { id: 1642232, name: 'Ella Purnell', character: 'Jinx', profilePath: getPosterUrl('/eP22.jpg', 'w342') },
      { id: 12519, name: 'Kevin Alejandro', character: 'Jayce Talis', profilePath: getPosterUrl('/kA33.jpg', 'w342') }
    ]
  },
  {
    id: 1399,
    tmdbId: 1399,
    imdbId: 'tt0944947',
    type: 'tv',
    title: 'Game of Thrones',
    tagline: 'Winter is coming.',
    poster: getPosterUrl('/1XS1oqL89v2GPyMY13er78xWzCo.jpg'),
    backdrop: getBackdropUrl('/2OMB0ynKly8enMJWI2Dy9I4vT2x.jpg'),
    overview: 'Seven noble families fight for control of the mythical land of Westeros. Friction between the houses leads to full-scale war.',
    year: 2011,
    rating: 8.4,
    voteCount: 24000,
    genres: ['Drama', 'Action', 'Fantasy'],
    seasonsCount: 8,
    episodesCount: 73,
    status: 'Ended',
    cast: [
      { id: 239014, name: 'Emilia Clarke', character: 'Daenerys Targaryen', profilePath: getPosterUrl('/eC11.jpg', 'w342') },
      { id: 49735, name: 'Kit Harington', character: 'Jon Snow', profilePath: getPosterUrl('/kH22.jpg', 'w342') },
      { id: 22970, name: 'Peter Dinklage', character: 'Tyrion Lannister', profilePath: getPosterUrl('/pD33.jpg', 'w342') }
    ]
  },
  {
    id: 100088,
    tmdbId: 100088,
    imdbId: 'tt3581920',
    type: 'tv',
    title: 'The Last of Us',
    tagline: 'When you\'re lost in the darkness, look for the light.',
    poster: getPosterUrl('/u3bZgnGQ9T01sWNhyve4z0wH0Hl.jpg'),
    backdrop: getBackdropUrl('/uDgy6hyPd3mATyCtT222.jpg'),
    overview: 'Twenty years after modern civilization has been destroyed, Joel, a hardened survivor, is hired to smuggle Ellie, a 14-year-old girl, out of an oppressive quarantine zone.',
    year: 2023,
    rating: 8.6,
    voteCount: 5200,
    genres: ['Drama', 'Action', 'Sci-Fi'],
    seasonsCount: 1,
    episodesCount: 9,
    status: 'Returning Series',
    cast: [
      { id: 1253360, name: 'Pedro Pascal', character: 'Joel Miller', profilePath: getPosterUrl('/pP99.jpg', 'w342') },
      { id: 2322502, name: 'Bella Ramsey', character: 'Ellie Williams', profilePath: getPosterUrl('/bR88.jpg', 'w342') }
    ]
  },
  {
    id: 155,
    tmdbId: 155,
    imdbId: 'tt0468569',
    type: 'movie',
    title: 'The Dark Knight',
    tagline: 'Welcome to a world without rules.',
    poster: getPosterUrl('/qJ2tW6WMUDux911r6m7haRef0WH.jpg'),
    backdrop: getBackdropUrl('/nMK28wyCCm1PjBNahPRGZqsujeL.jpg'),
    overview: 'Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets.',
    year: 2008,
    rating: 8.5,
    voteCount: 33000,
    genres: ['Action', 'Crime', 'Drama'],
    runtime: 152,
    status: 'Released',
    cast: [
      { id: 3894, name: 'Christian Bale', character: 'Bruce Wayne / Batman', profilePath: getPosterUrl('/cB11.jpg', 'w342') },
      { id: 1810, name: 'Heath Ledger', character: 'Joker', profilePath: getPosterUrl('/hL22.jpg', 'w342') },
      { id: 6384, name: 'Aaron Eckhart', character: 'Harvey Dent', profilePath: getPosterUrl('/aE33.jpg', 'w342') }
    ]
  },
  {
    id: 105971,
    tmdbId: 105971,
    imdbId: 'tt11737520',
    type: 'tv',
    title: 'The Bear',
    tagline: 'Every second counts.',
    poster: getPosterUrl('/sCHJ85XpS9t43iR05bT99j0k3xL.jpg'),
    backdrop: getBackdropUrl('/k1W9oB2J38t40v2.jpg'),
    overview: 'A young chef from the fine dining world returns to Chicago to run his family’s sandwich shop.',
    year: 2022,
    rating: 8.5,
    voteCount: 1800,
    genres: ['Comedy', 'Drama'],
    seasonsCount: 3,
    episodesCount: 28,
    status: 'Returning Series',
    cast: [
      { id: 1478523, name: 'Jeremy Allen White', character: 'Carmen \'Carmy\' Berzatto', profilePath: getPosterUrl('/jW11.jpg', 'w342') },
      { id: 2548962, name: 'Ayo Edebiri', character: 'Sydney Adamu', profilePath: getPosterUrl('/aE22.jpg', 'w342') },
      { id: 74589, name: 'Ebon Moss-Bachrach', character: 'Richard \'Richie\' Jerimovich', profilePath: getPosterUrl('/eM33.jpg', 'w342') }
    ]
  }
];

function normalizeTmdbMedia(item: any, type?: 'movie' | 'tv'): NormalizedMedia {
  const mediaType = type || item.media_type || (item.first_air_date ? 'tv' : 'movie');
  const title = item.title || item.name || item.original_title || item.original_name || 'Untitled';
  const releaseDate = item.release_date || item.first_air_date || '';
  const year = releaseDate ? new Date(releaseDate).getFullYear() : 'N/A';

  let genresList: string[] = [];
  if (item.genres && Array.isArray(item.genres)) {
    genresList = item.genres.map((g: any) => g.name);
  } else if (item.genre_ids && Array.isArray(item.genre_ids)) {
    genresList = item.genre_ids
      .map((id: number) => GENRES.find((g) => g.id === id)?.name)
      .filter(Boolean) as string[];
  }

  let castList: any[] = [];
  if (item.credits?.cast && Array.isArray(item.credits.cast)) {
    castList = item.credits.cast.slice(0, 10).map((c: any) => ({
      id: c.id,
      name: c.name,
      character: c.character || 'Actor',
      profilePath: c.profile_path ? getPosterUrl(c.profile_path, 'w342') : null,
    }));
  }

  return {
    id: item.id,
    tmdbId: item.id,
    imdbId: item.imdb_id || item.external_ids?.imdb_id,
    type: mediaType as 'movie' | 'tv',
    title,
    poster: item.poster_path ? getPosterUrl(item.poster_path) : null,
    backdrop: item.backdrop_path ? getBackdropUrl(item.backdrop_path) : null,
    overview: item.overview || 'No overview available.',
    year,
    rating: item.vote_average ? Number(item.vote_average.toFixed(1)) : 0,
    voteCount: item.vote_count || 0,
    genres: genresList.length > 0 ? genresList : ['Drama'],
    runtime: item.runtime || (item.episode_run_time ? item.episode_run_time[0] : undefined),
    seasonsCount: item.number_of_seasons,
    episodesCount: item.number_of_episodes,
    tagline: item.tagline,
    status: item.status,
    cast: castList,
  };
}

async function fetchTmdb<T>(endpoint: string, params: Record<string, string> = {}): Promise<T | null> {
  if (!TMDB_API_KEY) return null;

  try {
    const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
    url.searchParams.append('api_key', TMDB_API_KEY);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        url.searchParams.append(key, value);
      }
    });

    const res = await fetch(url.toString());
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function getTrending(
  mediaType: 'all' | 'movie' | 'tv' = 'all',
  timeWindow: 'day' | 'week' = 'week'
): Promise<NormalizedMedia[]> {
  const data = await fetchTmdb<any>(`/trending/${mediaType}/${timeWindow}`);
  if (data?.results && data.results.length > 0) {
    return data.results.map((item: any) => normalizeTmdbMedia(item));
  }
  return FALLBACK_MEDIA;
}

export async function getPopularMovies(page = 1): Promise<NormalizedMedia[]> {
  const data = await fetchTmdb<any>('/movie/popular', { page: String(page) });
  if (data?.results && data.results.length > 0) {
    return data.results.map((item: any) => normalizeTmdbMedia(item, 'movie'));
  }
  return FALLBACK_MEDIA.filter((m) => m.type === 'movie');
}

export async function getPopularTVShows(page = 1): Promise<NormalizedMedia[]> {
  const data = await fetchTmdb<any>('/tv/popular', { page: String(page) });
  if (data?.results && data.results.length > 0) {
    return data.results.map((item: any) => normalizeTmdbMedia(item, 'tv'));
  }
  return FALLBACK_MEDIA.filter((m) => m.type === 'tv');
}

export async function getTopRatedMovies(): Promise<NormalizedMedia[]> {
  const data = await fetchTmdb<any>('/movie/top_rated');
  if (data?.results && data.results.length > 0) {
    return data.results.map((item: any) => normalizeTmdbMedia(item, 'movie'));
  }
  return FALLBACK_MEDIA.filter((m) => m.type === 'movie').sort((a, b) => b.rating - a.rating);
}

export async function getTopRatedTV(): Promise<NormalizedMedia[]> {
  const data = await fetchTmdb<any>('/tv/top_rated');
  if (data?.results && data.results.length > 0) {
    return data.results.map((item: any) => normalizeTmdbMedia(item, 'tv'));
  }
  return FALLBACK_MEDIA.filter((m) => m.type === 'tv').sort((a, b) => b.rating - a.rating);
}

export async function getRecentlyAdded(): Promise<NormalizedMedia[]> {
  const data = await fetchTmdb<any>('/movie/now_playing');
  if (data?.results && data.results.length > 0) {
    return data.results.map((item: any) => normalizeTmdbMedia(item, 'movie'));
  }
  return FALLBACK_MEDIA;
}

export async function getMovieDetails(id: string | number): Promise<NormalizedMedia | null> {
  const data = await fetchTmdb<any>(`/movie/${id}`, { append_to_response: 'credits,external_ids' });
  if (data) {
    return normalizeTmdbMedia(data, 'movie');
  }
  const found = FALLBACK_MEDIA.find((m) => String(m.id) === String(id) && m.type === 'movie');
  return found || FALLBACK_MEDIA[0];
}

export async function getTVDetails(id: string | number): Promise<NormalizedMedia | null> {
  const data = await fetchTmdb<any>(`/tv/${id}`, { append_to_response: 'credits,external_ids' });
  if (data) {
    return normalizeTmdbMedia(data, 'tv');
  }
  const found = FALLBACK_MEDIA.find((m) => String(m.id) === String(id) && m.type === 'tv');
  return found || FALLBACK_MEDIA.find((m) => m.type === 'tv') || null;
}

export async function getTVSeasonDetails(
  tvId: string | number,
  seasonNumber: number
): Promise<SeasonDetails | null> {
  const data = await fetchTmdb<any>(`/tv/${tvId}/season/${seasonNumber}`);
  if (data) {
    return {
      seasonNumber: data.season_number,
      name: data.name || `Season ${data.season_number}`,
      overview: data.overview || 'No season overview available.',
      poster: data.poster_path ? getPosterUrl(data.poster_path) : null,
      episodes: (data.episodes || []).map((ep: any) => ({
        episodeNumber: ep.episode_number,
        seasonNumber: ep.season_number,
        title: ep.name || `Episode ${ep.episode_number}`,
        overview: ep.overview || 'No episode description available.',
        stillPath: ep.still_path ? getBackdropUrl(ep.still_path, 'w780') : null,
        airDate: ep.air_date,
        runtime: ep.runtime,
        rating: ep.vote_average ? Number(ep.vote_average.toFixed(1)) : 0,
      })),
    };
  }

  const episodes: EpisodeDetails[] = Array.from({ length: 10 }, (_, i) => ({
    episodeNumber: i + 1,
    seasonNumber: seasonNumber,
    title: `Episode ${i + 1}`,
    overview: `Detailed overview for Season ${seasonNumber}, Episode ${i + 1}.`,
    stillPath: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800&auto=format&fit=crop&q=80',
    airDate: '2024-01-15',
    runtime: 45,
    rating: 8.5,
  }));

  return {
    seasonNumber,
    name: `Season ${seasonNumber}`,
    overview: `Overview for season ${seasonNumber}.`,
    poster: null,
    episodes,
  };
}

export async function getRecommendations(
  id: string | number,
  type: 'movie' | 'tv'
): Promise<NormalizedMedia[]> {
  const data = await fetchTmdb<any>(`/${type}/${id}/recommendations`);
  if (data?.results && data.results.length > 0) {
    return data.results.slice(0, 10).map((item: any) => normalizeTmdbMedia(item, type));
  }
  return FALLBACK_MEDIA.filter((m) => String(m.id) !== String(id));
}

export async function searchMedia(
  query: string
): Promise<{ movies: NormalizedMedia[]; tv: NormalizedMedia[] }> {
  if (!query.trim()) return { movies: [], tv: [] };

  const [movieRes, tvRes] = await Promise.all([
    fetchTmdb<any>('/search/movie', { query }),
    fetchTmdb<any>('/search/tv', { query }),
  ]);

  let movies: NormalizedMedia[] = [];
  let tv: NormalizedMedia[] = [];

  if (movieRes?.results) {
    movies = movieRes.results.slice(0, 8).map((item: any) => normalizeTmdbMedia(item, 'movie'));
  }
  if (tvRes?.results) {
    tv = tvRes.results.slice(0, 8).map((item: any) => normalizeTmdbMedia(item, 'tv'));
  }

  if (movies.length === 0 && tv.length === 0) {
    const q = query.toLowerCase();
    const matches = FALLBACK_MEDIA.filter((m) => m.title.toLowerCase().includes(q));
    movies = matches.filter((m) => m.type === 'movie');
    tv = matches.filter((m) => m.type === 'tv');
  }

  return { movies, tv };
}

export async function discoverMedia(
  type: 'movie' | 'tv',
  filters: FilterOptions
): Promise<NormalizedMedia[]> {
  const params: Record<string, string> = {
    page: String(filters.page || 1),
    sort_by: filters.sortBy || 'popularity.desc',
  };

  if (filters.genre) {
    const genreObj = GENRES.find(
      (g) => g.slug === filters.genre || String(g.id) === filters.genre
    );
    if (genreObj) params.with_genres = String(genreObj.id);
  }

  if (filters.year) {
    if (type === 'movie') params.primary_release_year = filters.year;
    else params.first_air_date_year = filters.year;
  }

  if (filters.minRating) {
    params['vote_average.gte'] = String(filters.minRating);
  }

  if (filters.language) {
    params.with_original_language = filters.language;
  }

  const data = await fetchTmdb<any>(`/discover/${type}`, params);
  if (data?.results && data.results.length > 0) {
    return data.results.map((item: any) => normalizeTmdbMedia(item, type));
  }

  let result = FALLBACK_MEDIA.filter((m) => m.type === type);
  if (filters.genre) {
    const gName = GENRES.find(
      (g) => g.slug === filters.genre || String(g.id) === filters.genre
    )?.name;
    if (gName) result = result.filter((m) => m.genres.includes(gName));
  }
  if (filters.minRating) {
    result = result.filter((m) => m.rating >= (filters.minRating || 0));
  }
  return result;
}

export async function getBollywoodMovies(): Promise<NormalizedMedia[]> {
  return discoverMedia('movie', { language: 'hi', sortBy: 'popularity.desc' });
}

export async function getPunjabiMovies(): Promise<NormalizedMedia[]> {
  return discoverMedia('movie', { language: 'pa', sortBy: 'popularity.desc' });
}

