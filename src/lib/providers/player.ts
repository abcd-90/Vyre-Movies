import type { NormalizedMedia } from '../../types/media';

export type ServerId = 'vidsrc' | 'vidlink' | 'smashy' | 'autoembed' | 'multiembed' | 'vidsrcicu';

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
  { id: 'vidsrc', name: 'Server 1 (VidSrc Fast HD)' },
  { id: 'vidlink', name: 'Server 2 (VidLink - Multi Audio Dub)' },
  { id: 'smashy', name: 'Server 3 (SmashyStream - Hindi/Dual Audio)' },
  { id: 'autoembed', name: 'Server 4 (AutoEmbed Fast)' },
  { id: 'multiembed', name: 'Server 5 (SuperEmbed - Multi Audio)' },
  { id: 'vidsrcicu', name: 'Server 6 (VidSrc ICU Ultra)' },
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
  const { season = 1, episode = 1, server = 'vidsrc', language = 'auto' } = options || {};
  const id = media.tmdbId || media.id;

  let rawUrl = '';

  // Server 1: VidSrc
  if (server === 'vidsrc') {
    if (media.type === 'tv') {
      rawUrl = `https://vidsrc.me/embed/tv?tmdb=${id}&season=${season}&episode=${episode}`;
    } else {
      rawUrl = `https://vidsrc.me/embed/movie?tmdb=${id}`;
    }
  }
  // Server 2: VidLink (Multi-Audio & Dubbed HD)
  else if (server === 'vidlink') {
    if (media.type === 'tv') {
      rawUrl = `https://vidlink.pro/tv/${id}/${season}/${episode}?primaryColor=d6ff3f&secondaryColor=171b21&iconColor=d6ff3f`;
    } else {
      rawUrl = `https://vidlink.pro/movie/${id}?primaryColor=d6ff3f&secondaryColor=171b21&iconColor=d6ff3f`;
    }
  }
  // Server 3: SmashyStream (Dual Audio / Hindi Dubbed)
  else if (server === 'smashy') {
    if (media.type === 'tv') {
      rawUrl = `https://embed.smashystream.com/playere.php?tmdb=${id}&season=${season}&episode=${episode}`;
    } else {
      rawUrl = `https://embed.smashystream.com/playere.php?tmdb=${id}`;
    }
  }
  // Server 4: AutoEmbed
  else if (server === 'autoembed') {
    if (media.type === 'tv') {
      rawUrl = `https://autoembed.co/tv/tmdb/${id}-${season}-${episode}`;
    } else {
      rawUrl = `https://autoembed.co/movie/tmdb/${id}`;
    }
  }
  // Server 5: MultiEmbed (SuperEmbed with built-in Audio selector)
  else if (server === 'multiembed') {
    if (media.type === 'tv') {
      rawUrl = `https://multiembed.mov/directstream.php?video_id=${id}&tmdb=1&s=${season}&e=${episode}`;
    } else {
      rawUrl = `https://multiembed.mov/directstream.php?video_id=${id}&tmdb=1`;
    }
  }
  // Server 6: VidSrc ICU
  else if (server === 'vidsrcicu') {
    if (media.type === 'tv') {
      rawUrl = `https://vidsrc.icu/embed/tv/${id}/${season}/${episode}`;
    } else {
      rawUrl = `https://vidsrc.icu/embed/movie/${id}`;
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
      'vidsrc.icu',
      '2embed.org',
      '2embed.cc',
      'www.2embed.cc',
      'vidlink.pro',
      'autoembed.cc',
      'autoembed.co',
      'player.autoembed.cc',
      'smashystream.com',
      'embed.smashystream.com',
      'multiembed.mov',
    ];
    return allowedHosts.some((host) => parsed.hostname.toLowerCase().endsWith(host));
  } catch (e) {
    return false;
  }
}
