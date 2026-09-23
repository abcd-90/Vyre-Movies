import type { NormalizedMedia } from '../../types/media';

const DEFAULT_BASE_URL = import.meta.env.VITE_PLAYER_BASE_URL || 'https://apiplayer.ru';

export interface PlaybackOptions {
  season?: number;
  episode?: number;
  useImdb?: boolean;
  server?: 'embedsu' | 'apiplayer' | 'vidsrc' | 'vidsrcpro' | 'autoembed' | 'embed2';
}

export interface PlayerServer {
  id: 'embedsu' | 'apiplayer' | 'vidsrc' | 'vidsrcpro' | 'autoembed' | 'embed2';
  name: string;
}

export const PLAYER_SERVERS: PlayerServer[] = [
  { id: 'embedsu', name: 'Server 1 (EmbedSU - Ultra Fast)' },
  { id: 'apiplayer', name: 'Server 2 (APIPLAYER - HD)' },
  { id: 'vidsrc', name: 'Server 3 (VidSrc - Multi)' },
  { id: 'vidsrcpro', name: 'Server 4 (VidSrc PRO)' },
  { id: 'autoembed', name: 'Server 5 (AutoEmbed)' },
  { id: 'embed2', name: 'Server 6 (2Embed)' },
];

export function getPlaybackUrl(media: NormalizedMedia, options?: PlaybackOptions): string {
  const baseUrl = DEFAULT_BASE_URL.replace(/\/$/, '');
  const { season = 1, episode = 1, useImdb = false, server = 'embedsu' } = options || {};
  const id = media.tmdbId || media.id;
  const imdb = media.imdbId;

  // Server 1: EmbedSU (Ultra Fast, smooth seek without redirects)
  if (server === 'embedsu') {
    if (media.type === 'tv') {
      return `https://embed.su/embed/tv/${id}/${season}/${episode}`;
    }
    return `https://embed.su/embed/movie/${id}`;
  }

  // Server 3: VidSrc
  if (server === 'vidsrc') {
    if (media.type === 'tv') {
      return `https://vidsrc.me/embed/tv?tmdb=${id}&season=${season}&episode=${episode}`;
    }
    return `https://vidsrc.me/embed/movie?tmdb=${id}`;
  }

  // Server 4: VidSrc PRO
  if (server === 'vidsrcpro') {
    if (media.type === 'tv') {
      return `https://vidsrc.pro/embed/tv/${id}/${season}/${episode}`;
    }
    return `https://vidsrc.pro/embed/movie/${id}`;
  }

  // Server 5: AutoEmbed
  if (server === 'autoembed') {
    if (media.type === 'tv') {
      return `https://player.autoembed.cc/embed/tv/${id}/${season}/${episode}`;
    }
    return `https://player.autoembed.cc/embed/movie/${id}`;
  }

  // Server 6: 2Embed
  if (server === 'embed2') {
    if (media.type === 'tv') {
      return `https://www.2embed.cc/embedtv/${id}&s=${season}&e=${episode}`;
    }
    return `https://www.2embed.cc/embed/${id}`;
  }

  // Server 2 (APIPLAYER)
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

export function isAllowedPlaybackUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    const allowedHosts = [
      'embed.su',
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
