import type { NormalizedMedia } from '../../types/media';

const DEFAULT_BASE_URL = import.meta.env.VITE_PLAYER_BASE_URL || 'https://apiplayer.ru';

export interface PlaybackOptions {
  season?: number;
  episode?: number;
  useImdb?: boolean;
  server?: 'autoembed' | 'vidsrc' | 'apiplayer' | 'vidsrcpro' | 'embed2' | 'vidsrccc';
}

export interface PlayerServer {
  id: 'autoembed' | 'vidsrc' | 'apiplayer' | 'vidsrcpro' | 'embed2' | 'vidsrccc';
  name: string;
}

export const PLAYER_SERVERS: PlayerServer[] = [
  { id: 'autoembed', name: 'Server 1 (AutoEmbed - Super Fast)' },
  { id: 'vidsrc', name: 'Server 2 (VidSrc - HD Stream)' },
  { id: 'apiplayer', name: 'Server 3 (APIPLAYER - Multi)' },
  { id: 'vidsrcpro', name: 'Server 4 (VidSrc PRO)' },
  { id: 'embed2', name: 'Server 5 (2Embed)' },
  { id: 'vidsrccc', name: 'Server 6 (VidSrc CC)' },
];

export function getPlaybackUrl(media: NormalizedMedia, options?: PlaybackOptions): string {
  const baseUrl = DEFAULT_BASE_URL.replace(/\/$/, '');
  const { season = 1, episode = 1, useImdb = false, server = 'autoembed' } = options || {};
  const id = media.tmdbId || media.id;
  const imdb = media.imdbId;

  // Server 1: AutoEmbed (Primary Fast Global Player, excellent seeking)
  if (server === 'autoembed') {
    if (media.type === 'tv') {
      return `https://player.autoembed.cc/embed/tv/${id}/${season}/${episode}`;
    }
    return `https://player.autoembed.cc/embed/movie/${id}`;
  }

  // Server 2: VidSrc me
  if (server === 'vidsrc') {
    if (media.type === 'tv') {
      return `https://vidsrc.me/embed/tv?tmdb=${id}&season=${season}&episode=${episode}`;
    }
    return `https://vidsrc.me/embed/movie?tmdb=${id}`;
  }

  // Server 3: APIPLAYER
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

  // Server 4: VidSrc PRO
  if (server === 'vidsrcpro') {
    if (media.type === 'tv') {
      return `https://vidsrc.pro/embed/tv/${id}/${season}/${episode}`;
    }
    return `https://vidsrc.pro/embed/movie/${id}`;
  }

  // Server 5: 2Embed
  if (server === 'embed2') {
    if (media.type === 'tv') {
      return `https://www.2embed.cc/embedtv/${id}&s=${season}&e=${episode}`;
    }
    return `https://www.2embed.cc/embed/${id}`;
  }

  // Server 6: VidSrc CC
  if (server === 'vidsrccc') {
    if (media.type === 'tv') {
      return `https://vidsrc.cc/v2/embed/tv/${id}/${season}/${episode}`;
    }
    return `https://vidsrc.cc/v2/embed/movie/${id}`;
  }

  // Default fallback
  if (media.type === 'tv') {
    return `https://player.autoembed.cc/embed/tv/${id}/${season}/${episode}`;
  }
  return `https://player.autoembed.cc/embed/movie/${id}`;
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
      'autoembed.cc',
      'player.autoembed.cc',
    ];
    return allowedHosts.some((host) => parsed.hostname.toLowerCase().endsWith(host));
  } catch (e) {
    return false;
  }
}
