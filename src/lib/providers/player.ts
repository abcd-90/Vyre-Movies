import type { NormalizedMedia } from '../../types/media';

const DEFAULT_BASE_URL = import.meta.env.VITE_PLAYER_BASE_URL || 'https://apiplayer.ru';

export interface PlaybackOptions {
  season?: number;
  episode?: number;
  useImdb?: boolean;
  server?: 'vidsrc' | 'embed2' | 'vidsrcpro' | 'apiplayer' | 'vidlink' | 'autoembed';
  language?: 'auto' | 'hi' | 'en' | 'ta' | 'te' | 'ml';
}

export interface PlayerServer {
  id: 'vidsrc' | 'embed2' | 'vidsrcpro' | 'apiplayer' | 'vidlink' | 'autoembed';
  name: string;
}

export const PLAYER_SERVERS: PlayerServer[] = [
  { id: 'vidsrc', name: 'Server 1 (VidSrc - HD Fast)' },
  { id: 'embed2', name: 'Server 2 (2Embed - Ultra)' },
  { id: 'vidsrcpro', name: 'Server 3 (VidSrc PRO)' },
  { id: 'apiplayer', name: 'Server 4 (APIPLAYER)' },
  { id: 'vidlink', name: 'Server 5 (VidLink - Multi Audio)' },
  { id: 'autoembed', name: 'Server 6 (AutoEmbed)' },
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

  let rawUrl = '';

  // Server 1: VidSrc
  if (server === 'vidsrc') {
    if (media.type === 'tv') {
      rawUrl = `https://vidsrc.me/embed/tv?tmdb=${id}&season=${season}&episode=${episode}`;
    } else {
      rawUrl = `https://vidsrc.me/embed/movie?tmdb=${id}`;
    }
  }
  // Server 2: 2Embed
  else if (server === 'embed2') {
    if (media.type === 'tv') {
      rawUrl = `https://www.2embed.cc/embedtv/${id}?s=${season}&e=${episode}`;
    } else {
      rawUrl = `https://www.2embed.cc/embed/${id}`;
    }
  }
  // Server 3: VidSrc PRO
  else if (server === 'vidsrcpro') {
    if (media.type === 'tv') {
      rawUrl = `https://vidsrc.pro/embed/tv/${id}/${season}/${episode}`;
    } else {
      rawUrl = `https://vidsrc.pro/embed/movie/${id}`;
    }
  }
  // Server 4: APIPLAYER
  else if (server === 'apiplayer') {
    const mediaId = (useImdb && imdb) ? imdb : id;
    if (media.type === 'tv') {
      rawUrl = `${baseUrl}/embed/tv/${mediaId}/${season}/${episode}`;
    } else {
      rawUrl = `${baseUrl}/embed/movie/${mediaId}`;
    }
  }
  // Server 5: VidLink (Multi-Audio HD)
  else if (server === 'vidlink') {
    if (media.type === 'tv') {
      rawUrl = `https://vidlink.pro/tv/${id}/${season}/${episode}`;
    } else {
      rawUrl = `https://vidlink.pro/movie/${id}`;
    }
  }
  // Server 6: AutoEmbed
  else if (server === 'autoembed') {
    if (media.type === 'tv') {
      rawUrl = `https://player.autoembed.cc/embed/tv/${id}/${season}/${episode}`;
    } else {
      rawUrl = `https://player.autoembed.cc/embed/movie/${id}`;
    }
  }
  // Fallback
  else {
    if (media.type === 'tv') {
      rawUrl = `https://vidsrc.me/embed/tv?tmdb=${id}&season=${season}&episode=${episode}`;
    } else {
      rawUrl = `https://vidsrc.me/embed/movie?tmdb=${id}`;
    }
  }

  if (language !== 'auto') {
    const hasQuery = rawUrl.includes('?');
    const langParams = `ds_lang=${language}&audio=${language}&sub_lang=${language}&lang=${language}`;
    return `${rawUrl}${hasQuery ? '&' : '?'}${langParams}`;
  }

  return rawUrl;
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
      'vidlink.pro',
      'autoembed.cc',
      'player.autoembed.cc',
    ];
    return allowedHosts.some((host) => parsed.hostname.toLowerCase().endsWith(host));
  } catch (e) {
    return false;
  }
}

