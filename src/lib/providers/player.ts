import type { NormalizedMedia } from '../../types/media';

export type ServerId = 'vidsrc' | 'autoembed' | 'embed2' | 'smashystream' | 'vidsrcpm' | 'videasy' | 'vidsrcio';

export interface PlaybackOptions {
  season?: number;
  episode?: number;
  useImdb?: boolean;
  server?: ServerId;
  language?: 'auto' | 'hi' | 'en' | 'es' | 'fr' | 'ta' | 'te' | 'ml' | 'de';
}

export interface PlayerServer {
  id: ServerId;
  name: string;
}

export const PLAYER_SERVERS: PlayerServer[] = [
  { id: 'vidsrc', name: 'Server 1 (VidSrc HD - Fast Multi-Audio)' },
  { id: 'autoembed', name: 'Server 2 (AutoEmbed - Hindi/Dual Audio)' },
  { id: 'embed2', name: 'Server 3 (2Embed VIP - Multi Language)' },
  { id: 'smashystream', name: 'Server 4 (SmashyStream - Hindi & Dubbed)' },
  { id: 'vidsrcpm', name: 'Server 5 (VidSrc PM - Dubbed Stream)' },
  { id: 'videasy', name: 'Server 6 (Videasy - Multi Language)' },
  { id: 'vidsrcio', name: 'Server 7 (VidSrc IO - Multi Track)' },
];

export interface AudioLanguage {
  id: 'auto' | 'hi' | 'en' | 'es' | 'fr' | 'ta' | 'te' | 'ml' | 'de';
  name: string;
  flag: string;
}

export const AUDIO_LANGUAGES: AudioLanguage[] = [
  { id: 'auto', name: 'Original / Auto', flag: '🌐' },
  { id: 'hi', name: 'Hindi Dubbed (हिंदी)', flag: '🇮🇳' },
  { id: 'en', name: 'English Dubbed', flag: '🇺🇸' },
  { id: 'es', name: 'Spanish (Español)', flag: '🇪🇸' },
  { id: 'fr', name: 'French (Français)', flag: '🇫🇷' },
  { id: 'ta', name: 'Tamil (தமிழ்)', flag: '🇮🇳' },
  { id: 'te', name: 'Telugu (తెలుగు)', flag: '🇮🇳' },
  { id: 'ml', name: 'Malayalam (മലയാളം)', flag: '🇮🇳' },
  { id: 'de', name: 'German (Deutsch)', flag: '🇩🇪' },
];

export function getPlaybackUrl(media: NormalizedMedia, options?: PlaybackOptions): string {
  const { season = 1, episode = 1, server = 'vidsrc', language = 'auto' } = options || {};
  const id = media.tmdbId || media.id;

  let rawUrl = '';

  // Server 1: VidSrc ME (vidsrc.me - Fast HD)
  if (server === 'vidsrc') {
    if (media.type === 'tv') {
      rawUrl = `https://vidsrc.me/embed/tv?tmdb=${id}&season=${season}&episode=${episode}`;
    } else {
      rawUrl = `https://vidsrc.me/embed/movie?tmdb=${id}`;
    }
    if (language !== 'auto') {
      rawUrl += `&ds_lang=${language}`;
    }
  }
  // Server 2: AutoEmbed (autoembed.co)
  else if (server === 'autoembed') {
    if (media.type === 'tv') {
      rawUrl = `https://autoembed.co/tv/tmdb/${id}-${season}-${episode}`;
    } else {
      rawUrl = `https://autoembed.co/movie/tmdb/${id}`;
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
  // Server 4: SmashyStream (Dedicated Hindi & Dubbed)
  else if (server === 'smashystream') {
    if (media.type === 'tv') {
      rawUrl = `https://embed.smashystream.com/playere.php?tmdb=${id}&season=${season}&episode=${episode}`;
    } else {
      rawUrl = `https://embed.smashystream.com/playere.php?tmdb=${id}`;
    }
  }
  // Server 5: VidSrc PM (vidsrc.pm)
  else if (server === 'vidsrcpm') {
    if (media.type === 'tv') {
      rawUrl = `https://vidsrc.pm/embed/tv/${id}/${season}/${episode}`;
    } else {
      rawUrl = `https://vidsrc.pm/embed/movie/${id}`;
    }
    if (language !== 'auto') {
      rawUrl += `?ds_lang=${language}`;
    }
  }
  // Server 6: Videasy (videasy.net)
  else if (server === 'videasy') {
    if (media.type === 'tv') {
      rawUrl = `https://player.videasy.net/tv/${id}/${season}/${episode}`;
    } else {
      rawUrl = `https://player.videasy.net/movie/${id}`;
    }
  }
  // Server 7: VidSrc IO (vidsrc.io)
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
      rawUrl = `https://vidsrc.me/embed/tv?tmdb=${id}&season=${season}&episode=${episode}`;
    } else {
      rawUrl = `https://vidsrc.me/embed/movie?tmdb=${id}`;
    }
  }

  return rawUrl;
}

export function isAllowedPlaybackUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    const allowedHosts = [
      'vidsrc.me',
      'vidsrc.pm',
      'vidsrc.io',
      '2embed.cc',
      'www.2embed.cc',
      'autoembed.co',
      'player.autoembed.cc',
      'smashystream.com',
      'embed.smashystream.com',
      'videasy.net',
      'player.videasy.net',
    ];
    return allowedHosts.some((host) => parsed.hostname.toLowerCase().endsWith(host));
  } catch (e) {
    return false;
  }
}
