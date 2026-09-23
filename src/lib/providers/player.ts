import type { NormalizedMedia } from '../../types/media';

export type ServerId = 'autoembed' | 'vidsrc' | 'embed2' | 'vidsrcin' | 'vidsrcpm' | 'vidsrcio';

export interface PlaybackOptions {
  season?: number;
  episode?: number;
  useImdb?: boolean;
  server?: ServerId;
  language?: 'auto' | 'hi' | 'en' | 'ta' | 'te' | 'ml';
}

export interface PlayerServer {
  id: ServerId;
  name: string;
}

export const PLAYER_SERVERS: PlayerServer[] = [
  { id: 'autoembed', name: 'Server 1 (AutoEmbed Ultra - Ad Free)' },
  { id: 'vidsrc', name: 'Server 2 (VidSrc HD - Multi Audio)' },
  { id: 'embed2', name: 'Server 3 (2Embed VIP - Dubbed)' },
  { id: 'vidsrcin', name: 'Server 4 (VidSrc IN - Hindi/Dual)' },
  { id: 'vidsrcpm', name: 'Server 5 (VidSrc PM - Fast)' },
  { id: 'vidsrcio', name: 'Server 6 (VidSrc IO - Backup)' },
];

export interface AudioLanguage {
  id: 'auto' | 'hi' | 'en' | 'ta' | 'te' | 'ml';
  name: string;
  flag: string;
}

export const AUDIO_LANGUAGES: AudioLanguage[] = [
  { id: 'auto', name: 'Original / Auto', flag: '🌐' },
  { id: 'hi', name: 'Hindi Dubbed (हिंदी)', flag: '🇮🇳' },
  { id: 'ta', name: 'Tamil (தமிழ்)', flag: '🇮🇳' },
  { id: 'te', name: 'Telugu (తెలుగు)', flag: '🇮🇳' },
  { id: 'ml', name: 'Malayalam (മലയാളം)', flag: '🇮🇳' },
  { id: 'en', name: 'English Dubbed', flag: '🇺🇸' },
];

export function getPlaybackUrl(media: NormalizedMedia, options?: PlaybackOptions): string {
  const { season = 1, episode = 1, server = 'autoembed', language = 'auto' } = options || {};
  const id = media.tmdbId || media.id;

  let rawUrl = '';

  // Server 1: AutoEmbed Ultra (autoembed.co - Cleanest, zero popups)
  if (server === 'autoembed') {
    if (media.type === 'tv') {
      rawUrl = `https://autoembed.co/tv/tmdb/${id}-${season}-${episode}`;
    } else {
      rawUrl = `https://autoembed.co/movie/tmdb/${id}`;
    }
  }
  // Server 2: VidSrc HD (vidsrc.me)
  else if (server === 'vidsrc') {
    if (media.type === 'tv') {
      rawUrl = `https://vidsrc.me/embed/tv?tmdb=${id}&season=${season}&episode=${episode}`;
    } else {
      rawUrl = `https://vidsrc.me/embed/movie?tmdb=${id}`;
    }
  }
  // Server 3: 2Embed VIP (2embed.cc)
  else if (server === 'embed2') {
    if (media.type === 'tv') {
      rawUrl = `https://www.2embed.cc/embedtv/${id}?s=${season}&e=${episode}`;
    } else {
      rawUrl = `https://www.2embed.cc/embed/${id}`;
    }
  }
  // Server 4: VidSrc IN (vidsrc.in - Hindi / Dual Audio)
  else if (server === 'vidsrcin') {
    if (media.type === 'tv') {
      rawUrl = `https://vidsrc.in/embed/tv?tmdb=${id}&season=${season}&episode=${episode}`;
    } else {
      rawUrl = `https://vidsrc.in/embed/movie?tmdb=${id}`;
    }
  }
  // Server 5: VidSrc PM (vidsrc.pm)
  else if (server === 'vidsrcpm') {
    if (media.type === 'tv') {
      rawUrl = `https://vidsrc.pm/embed/tv/${id}/${season}/${episode}`;
    } else {
      rawUrl = `https://vidsrc.pm/embed/movie/${id}`;
    }
  }
  // Server 6: VidSrc IO (vidsrc.io)
  else if (server === 'vidsrcio') {
    if (media.type === 'tv') {
      rawUrl = `https://vidsrc.io/embed/tv/${id}/${season}/${episode}`;
    } else {
      rawUrl = `https://vidsrc.io/embed/movie/${id}`;
    }
  }
  // Fallback
  else {
    if (media.type === 'tv') {
      rawUrl = `https://autoembed.co/tv/tmdb/${id}-${season}-${episode}`;
    } else {
      rawUrl = `https://autoembed.co/movie/tmdb/${id}`;
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
      'vidsrc.me',
      'vidsrc.in',
      'vidsrc.pm',
      'vidsrc.io',
      '2embed.cc',
      'www.2embed.cc',
      'autoembed.co',
      'player.autoembed.cc',
    ];
    return allowedHosts.some((host) => parsed.hostname.toLowerCase().endsWith(host));
  } catch (e) {
    return false;
  }
}
