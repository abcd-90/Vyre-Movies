import type { NormalizedMedia } from '../../types/media';

const DEFAULT_BASE_URL = import.meta.env.VITE_PLAYER_BASE_URL || 'https://apiplayer.ru';

export interface PlaybackOptions {
  season?: number;
  episode?: number;
  useImdb?: boolean;
  server?: 'vidsrc' | 'embed2' | 'vidsrcpro' | 'apiplayer';
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

export function getPlaybackUrl(media: NormalizedMedia, options?: PlaybackOptions): string {
  const baseUrl = DEFAULT_BASE_URL.replace(/\/$/, '');
  const { season = 1, episode = 1, useImdb = false, server = 'vidsrc' } = options || {};
  const id = media.tmdbId || media.id;
  const imdb = media.imdbId;

  // Server 1: VidSrc (100% Working Global HD Stream)
  if (server === 'vidsrc') {
    if (media.type === 'tv') {
      return `https://vidsrc.me/embed/tv?tmdb=${id}&season=${season}&episode=${episode}`;
    }
    return `https://vidsrc.me/embed/movie?tmdb=${id}`;
  }

  // Server 2: 2Embed (100% Working Backup)
  if (server === 'embed2') {
    if (media.type === 'tv') {
      return `https://www.2embed.cc/embedtv/${id}&s=${season}&e=${episode}`;
    }
    return `https://www.2embed.cc/embed/${id}`;
  }

  // Server 3: VidSrc PRO
  if (server === 'vidsrcpro') {
    if (media.type === 'tv') {
      return `https://vidsrc.pro/embed/tv/${id}/${season}/${episode}`;
    }
    return `https://vidsrc.pro/embed/movie/${id}`;
  }

  // Server 4: APIPLAYER
  if (server === 'apiplayer') {
    if (media.type === 'tv') {
      if (useImdb && imdb) {
        return `${baseUrl}/embed/tv/${imdb}/${season}/${episode}`;
      }
      return `${baseUrl}/embed/tv/${id}/${season}/${episode}`;
    }
    if (useImdb && imdb) {
      return `${baseUrl}/embed/movie/${imdb}`;
    }
    return `${baseUrl}/embed/movie/${id}`;
  }

  // Default fallback to VidSrc
  if (media.type === 'tv') {
    return `https://vidsrc.me/embed/tv?tmdb=${id}&season=${season}&episode=${episode}`;
  }
  return `https://vidsrc.me/embed/movie?tmdb=${id}`;
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
