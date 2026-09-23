export interface CastMember {
  id: number;
  name: string;
  character: string;
  profilePath: string | null;
}

export interface NormalizedMedia {
  id: string | number;
  tmdbId?: number;
  imdbId?: string;
  type: 'movie' | 'tv';
  title: string;
  poster: string | null;
  backdrop: string | null;
  overview: string;
  year: string | number;
  rating: number;
  genres: string[];
  runtime?: number;
  seasonsCount?: number;
  episodesCount?: number;
  tagline?: string;
  voteCount?: number;
  status?: string;
  cast?: CastMember[];
}

export interface EpisodeDetails {
  episodeNumber: number;
  seasonNumber: number;
  title: string;
  overview: string;
  stillPath: string | null;
  airDate?: string;
  runtime?: number;
  rating?: number;
}

export interface SeasonDetails {
  seasonNumber: number;
  name: string;
  overview: string;
  poster: string | null;
  episodes: EpisodeDetails[];
}

export interface WatchProgress {
  mediaId: string | number;
  type: 'movie' | 'tv';
  title: string;
  poster: string | null;
  backdrop: string | null;
  season?: number;
  episode?: number;
  episodeTitle?: string;
  progressMinutes: number;
  totalMinutes: number;
  lastUpdated: number;
}

export interface FilterOptions {
  category?: string;
  genre?: string;
  year?: string;
  minRating?: number;
  language?: string;
  sortBy?: string;
  query?: string;
  page?: number;
}

export interface Genre {
  id: number;
  name: string;
  slug: string;
}

export interface LanguageOption {
  code: string;
  name: string;
}

export const LANGUAGES: LanguageOption[] = [
  { code: 'hi', name: 'Bollywood (Hindi)' },
  { code: 'pa', name: 'Punjabi' },
  { code: 'en', name: 'Hollywood (English)' },
  { code: 'ko', name: 'Korean (K-Drama)' },
  { code: 'ja', name: 'Japanese (Anime)' },
  { code: 'ta', name: 'Tamil' },
  { code: 'te', name: 'Telugu' },
  { code: 'ur', name: 'Urdu' },
  { code: 'es', name: 'Spanish' },
];
