import type { NormalizedMedia } from '../../types/media';

const DEFAULT_BASE_URL = import.meta.env.VITE_PLAYER_BASE_URL || 'https://apiplayer.ru';

export interface PlaybackOptions {
  season?: number;
  episode?: number;
  useImdb?: boolean;
}

export function getPlaybackUrl(media: NormalizedMedia, options?: PlaybackOptions): string {
  const baseUrl = DEFAULT_BASE_URL.replace(/\/$/, '');
  const { season = 1, episode = 1, useImdb = false } = options || {};

  if (media.type === 'tv') {
    if (useImdb && media.imdbId) {
      return `${baseUrl}/embed/tv/${media.imdbId}/${season}/${episode}`;
    }
    const id = media.tmdbId || media.id;
    return `${baseUrl}/embed/tv/${id}/${season}/${episode}`;
  }

  if (useImdb && media.imdbId) {
    return `${baseUrl}/embed/movie/${media.imdbId}`;
  }

  const id = media.tmdbId || media.id;
  return `${baseUrl}/embed/movie/${id}`;
}

export function isAllowedPlaybackUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    const allowedHosts = ['apiplayer.ru', 'www.apiplayer.ru', 'vidsrc.me', 'vidsrc.to', '2embed.org'];
    return allowedHosts.some(host => parsed.hostname.toLowerCase().endsWith(host));
  } catch (e) {
    return false;
  }
}
