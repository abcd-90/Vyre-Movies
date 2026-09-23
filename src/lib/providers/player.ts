import type { NormalizedMedia } from '../../types/media';

const DEFAULT_BASE_URL = import.meta.env.VITE_PLAYER_BASE_URL || 'https://apiplayer.ru';

export interface PlaybackOptions {
  season?: number;
  episode?: number;
  useImdb?: boolean;
  server?: 'vidsrc' | 'embed2' | 'vidsrcpro' | 'apiplayer';
  language?: 'auto' | 'hi' | 'en' | 'ta' | 'te' | 'ml';
}

export interface PlayerServer {
  id: 'vidsrc' | 'embed2' | 'vidsrcpro' | 'apiplayer';
  name: string;
}

export const PLAYER_SERVERS: PlayerServer[] = [
  { id: 'vidsrc', name: 'Server 1 (VidSrc - HD Fast)' },
  { id: 'embed2', name: 'Server 2 (2Embed - Ultra)' },
  { id: 'vidsrcpro', name: 'Server 3 (VidSrc PRO)' },
  { id: 'apiplayer', name: 'Server 4 (APIPLAYER)' },
];

export interface AudioLanguage {
  id: 'auto' | 'hi' | 'en' | 'ta' | 'te' | 'ml';
  name: string;
  flag: string;
}

export const AUDIO_LANGUAGES: AudioLanguage[] = [
  { id: 'auto', name: 'Original / Auto', flag: '🌐' },
  { id: 'hi', name: 'Hindi Dubbed (हिंदी)', flag: '🇮🇳' },
  { id: 'en', name: 'English Dubbed', flag: '🇺🇸' },
  { id: 'ta', name: 'Tamil (தமிழ்)', flag: '🇮🇳' },
  { id: 'te', name: 'Telugu (తెలుగు)', flag: '🇮🇳' },
  { id: 'ml', name: 'Malayalam (മലയാളം)', flag: '🇮🇳' },
];

export function getPlaybackUrl(media: NormalizedMedia, options?: PlaybackOptions): string {
  const baseUrl = DEFAULT_BASE_URL.replace(/\/$/, '');
  const { season = 1, episode = 1, useImdb = false, server = 'vidsrc', language = 'auto' } = options || {};
  const id = media.tmdbId || media.id;
  const imdb = media.imdbId;
  const langSuffix = language !== 'auto' ? `&ds_lang=${language}&audio=${language}` : '';

  // Server 1: VidSrc (100% Working Global HD Stream)
  if (server === 'vidsrc') {
    if (media.type === 'tv') {
      return `https://vidsrc.me/embed/tv?tmdb=${id}&season=${season}&episode=${episode}${langSuffix}`;
    }
    return `https://vidsrc.me/embed/movie?tmdb=${id}${langSuffix}`;
  }

  // Server 2: 2Embed (100% Working Backup)
  if (server === 'embed2') {
    if (media.type === 'tv') {
      return `https://www.2embed.cc/embedtv/${id}&s=${season}&e=${episode}${langSuffix}`;
    }
    return `https://www.2embed.cc/embed/${id}${langSuffix}`;
  }

  // Server 3: VidSrc PRO
  if (server === 'vidsrcpro') {
    if (media.type === 'tv') {
      return `https://vidsrc.pro/embed/tv/${id}/${season}/${episode}${langSuffix ? `?ds_lang=${language}` : ''}`;
    }
    return `https://vidsrc.pro/embed/movie/${id}${langSuffix ? `?ds_lang=${language}` : ''}`;
  }

  // Server 4: APIPLAYER
  if (server === 'apiplayer') {
    if (media.type === 'tv') {
      if (useImdb && imdb) {
        return `${baseUrl}/embed/tv/${imdb}/${season}/${episode}${langSuffix}`;
      }
      return `${baseUrl}/embed/tv/${id}/${season}/${episode}${langSuffix}`;
    }
    if (useImdb && imdb) {
      return `${baseUrl}/embed/movie/${imdb}${langSuffix}`;
    }
    return `${baseUrl}/embed/movie/${id}${langSuffix}`;
  }

  // Default fallback to VidSrc
  if (media.type === 'tv') {
    return `https://vidsrc.me/embed/tv?tmdb=${id}&season=${season}&episode=${episode}${langSuffix}`;
  }
  return `https://vidsrc.me/embed/movie?tmdb=${id}${langSuffix}`;
}

export function isAllowedPlaybackUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    const allowedHosts = [
      'apiplayer.ru',
      'www.apiplayer.ru',
      'vidsrc.me',
      'vidsrc.to',
      'vidsrc.pro',
      'vidsrc.cc',
      '2embed.org',
      '2embed.cc',
      'www.2embed.cc',
    ];
    return allowedHosts.some((host) => parsed.hostname.toLowerCase().endsWith(host));
  } catch (e) {
    return false;
  }
}
