import type { NormalizedMedia } from '../../types/media';
import type { AudioTrack } from '../../types/audio';

export type ServerId = 'vidsrc' | 'autoembed' | 'multiembed' | 'embed2' | 'smashystream' | 'vidsrcpm' | 'videasy' | 'vidsrcio';

export interface PlaybackOptions {
  season?: number;
  episode?: number;
  useImdb?: boolean;
  server?: ServerId;
  language?: string; // BCP-47 code, e.g. 'hi', 'en', 'ur', 'es'
  audioTrack?: AudioTrack;
}

export interface PlayerServer {
  id: ServerId;
  name: string;
  recommendedFor?: string[];
}

export const PLAYER_SERVERS: PlayerServer[] = [
  { id: 'vidsrc', name: 'Server 1 (VidSrc HD - Multi Audio)', recommendedFor: ['en', 'es', 'fr', 'de'] },
  { id: 'multiembed', name: 'Server 2 (MultiEmbed - Hindi & Dubbed VIP)', recommendedFor: ['hi', 'ur', 'ta', 'te'] },
  { id: 'smashystream', name: 'Server 3 (SmashyStream - Hindi & Asian Dubs)', recommendedFor: ['hi', 'ur'] },
  { id: 'autoembed', name: 'Server 4 (AutoEmbed - Dual Track)', recommendedFor: ['en', 'hi'] },
  { id: 'vidsrcpm', name: 'Server 5 (VidSrc PM - European Dubs)', recommendedFor: ['es', 'fr', 'de'] },
  { id: 'embed2', name: 'Server 6 (2Embed VIP - Multi Language)', recommendedFor: ['en'] },
  { id: 'videasy', name: 'Server 7 (Videasy - Multi Track)', recommendedFor: ['en'] },
  { id: 'vidsrcio', name: 'Server 8 (VidSrc IO - Global Stream)', recommendedFor: ['en'] },
];

export function getPlaybackUrl(media: NormalizedMedia, options?: PlaybackOptions): string {
  const { season = 1, episode = 1, server = 'vidsrc', language = 'en', audioTrack } = options || {};

  // If a custom stream source URL is set on the AudioTrack (e.g. from Admin or custom M3U8/MP4 stream), use it directly!
  if (audioTrack?.source && audioTrack.source.startsWith('http')) {
    return audioTrack.source;
  }

  const id = media.tmdbId || media.id;
  const langCode = audioTrack?.language || language || 'en';
  let rawUrl = '';

  // Smart server selection when switching audio languages
  let activeServer = server;
  if (langCode === 'hi' || langCode === 'ur') {
    if (server === 'vidsrc') activeServer = 'multiembed'; // Default to MultiEmbed for Hindi/Urdu dubs
  }

  // Server 1: VidSrc ME (vidsrc.me)
  if (activeServer === 'vidsrc') {
    if (media.type === 'tv') {
      rawUrl = `https://vidsrc.me/embed/tv?tmdb=${id}&season=${season}&episode=${episode}`;
    } else {
      rawUrl = `https://vidsrc.me/embed/movie?tmdb=${id}`;
    }
    if (langCode !== 'en' && langCode !== 'auto') {
      rawUrl += `&ds_lang=${langCode}`;
    }
  }
  // Server 2: MultiEmbed (multiembed.mov - Dedicated Hindi & Asian Dubbing)
  else if (activeServer === 'multiembed') {
    if (media.type === 'tv') {
      rawUrl = `https://multiembed.mov/?video_id=${id}&tmdb=1&s=${season}&e=${episode}`;
    } else {
      rawUrl = `https://multiembed.mov/?video_id=${id}&tmdb=1`;
    }
    if (langCode !== 'en') {
      rawUrl += `&lang=${langCode}`;
    }
  }
  // Server 3: SmashyStream (SmashyStream - Hindi / Urdu Dubbed)
  else if (activeServer === 'smashystream') {
    if (media.type === 'tv') {
      rawUrl = `https://embed.smashystream.com/playere.php?tmdb=${id}&season=${season}&episode=${episode}`;
    } else {
      rawUrl = `https://embed.smashystream.com/playere.php?tmdb=${id}`;
    }
    if (langCode !== 'en') {
      rawUrl += `&lang=${langCode}`;
    }
  }
  // Server 4: AutoEmbed (autoembed.co)
  else if (activeServer === 'autoembed') {
    if (media.type === 'tv') {
      rawUrl = `https://autoembed.co/tv/tmdb/${id}-${season}-${episode}`;
    } else {
      rawUrl = `https://autoembed.co/movie/tmdb/${id}`;
    }
    if (langCode !== 'en') {
      rawUrl += `?lang=${langCode}`;
    }
  }
  // Server 5: VidSrc PM (vidsrc.pm)
  else if (activeServer === 'vidsrcpm') {
    if (media.type === 'tv') {
      rawUrl = `https://vidsrc.pm/embed/tv/${id}/${season}/${episode}`;
    } else {
      rawUrl = `https://vidsrc.pm/embed/movie/${id}`;
    }
    if (langCode !== 'en') {
      rawUrl += `?ds_lang=${langCode}`;
    }
  }
  // Server 6: 2Embed VIP
  else if (activeServer === 'embed2') {
    if (media.type === 'tv') {
      rawUrl = `https://www.2embed.cc/embedtv/${id}?s=${season}&e=${episode}`;
    } else {
      rawUrl = `https://www.2embed.cc/embed/${id}`;
    }
  }
  // Server 7: Videasy
  else if (activeServer === 'videasy') {
    if (media.type === 'tv') {
      rawUrl = `https://player.videasy.net/tv/${id}/${season}/${episode}`;
    } else {
      rawUrl = `https://player.videasy.net/movie/${id}`;
    }
  }
  // Server 8: VidSrc IO
  else if (activeServer === 'vidsrcio') {
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
      'multiembed.mov',
      'streamingnow.mov',
    ];
    return allowedHosts.some((host) => parsed.hostname.toLowerCase().endsWith(host));
  } catch (e) {
    return false;
  }
}
