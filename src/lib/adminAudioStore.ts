import type { MediaAudioConfig } from '../types/audio';

const ADMIN_AUDIO_STORE_KEY = 'vyre_admin_audio_configs';

// Seed demo audio configs for popular titles to demonstrate real multi-language audio switching
const DEFAULT_ADMIN_CONFIGS: Record<string, MediaAudioConfig> = {
  // Movie 157336: Interstellar
  'movie_157336': {
    mediaId: 157336,
    mediaType: 'movie',
    originalLanguage: 'en',
    audioTracks: [
      {
        id: 'en',
        language: 'en',
        label: 'English (Original 5.1)',
        flag: '🇺🇸',
        type: 'original',
        available: true,
        default: true,
        streamArchitecture: 'separate_streams',
        source: 'https://vidsrc.me/embed/movie?tmdb=157336&ds_lang=en',
      },
      {
        id: 'hi',
        language: 'hi',
        label: 'Hindi Dubbed (हिंदी)',
        flag: '🇮🇳',
        type: 'dub',
        available: true,
        streamArchitecture: 'dubbed_embed',
        source: 'https://multiembed.mov/?video_id=157336&tmdb=1&lang=hi',
      },
      {
        id: 'ur',
        language: 'ur',
        label: 'Urdu Dubbed (اردو)',
        flag: '🇵🇰',
        type: 'dub',
        available: true,
        streamArchitecture: 'dubbed_embed',
        source: 'https://embed.smashystream.com/playere.php?tmdb=157336&lang=ur',
      },
      {
        id: 'es',
        language: 'es',
        label: 'Spanish (Español Castellano)',
        flag: '🇪🇸',
        type: 'dub',
        available: true,
        streamArchitecture: 'separate_streams',
        source: 'https://vidsrc.pm/embed/movie/157336?ds_lang=es',
      },
      {
        id: 'ta',
        language: 'ta',
        label: 'Tamil Dubbed (தமிழ்)',
        flag: '🇮🇳',
        type: 'dub',
        available: true,
        streamArchitecture: 'dubbed_embed',
        source: 'https://multiembed.mov/?video_id=157336&tmdb=1&lang=ta',
      },
    ],
    subtitleTracks: [
      { id: 'en_sub', language: 'en', label: 'English (CC)', flag: '🇺🇸', available: true, default: true },
      { id: 'hi_sub', language: 'hi', label: 'Hindi (हिंदी)', flag: '🇮🇳', available: true },
      { id: 'ur_sub', language: 'ur', label: 'Urdu (اردو)', flag: '🇵🇰', available: true },
      { id: 'es_sub', language: 'es', label: 'Spanish (Español)', flag: '🇪🇸', available: true },
    ],
  },

  // Movie 27205: Inception
  'movie_27205': {
    mediaId: 27205,
    mediaType: 'movie',
    originalLanguage: 'en',
    audioTracks: [
      {
        id: 'en',
        language: 'en',
        label: 'English (Original HD)',
        flag: '🇺🇸',
        type: 'original',
        available: true,
        default: true,
        streamArchitecture: 'separate_streams',
        source: 'https://vidsrc.me/embed/movie?tmdb=27205&ds_lang=en',
      },
      {
        id: 'hi',
        language: 'hi',
        label: 'Hindi Dubbed (हिंदी HQ)',
        flag: '🇮🇳',
        type: 'dub',
        available: true,
        streamArchitecture: 'dubbed_embed',
        source: 'https://multiembed.mov/?video_id=27205&tmdb=1&lang=hi',
      },
      {
        id: 'ur',
        language: 'ur',
        label: 'Urdu Dubbed (اردو)',
        flag: '🇵🇰',
        type: 'dub',
        available: true,
        streamArchitecture: 'dubbed_embed',
        source: 'https://embed.smashystream.com/playere.php?tmdb=27205&lang=ur',
      },
      {
        id: 'te',
        language: 'te',
        label: 'Telugu Dubbed (తెలుగు)',
        flag: '🇮🇳',
        type: 'dub',
        available: true,
        streamArchitecture: 'dubbed_embed',
        source: 'https://autoembed.co/movie/tmdb/27205?lang=te',
      },
    ],
    subtitleTracks: [
      { id: 'en_sub', language: 'en', label: 'English (CC)', flag: '🇺🇸', available: true, default: true },
      { id: 'hi_sub', language: 'hi', label: 'Hindi (हिंदी)', flag: '🇮🇳', available: true },
      { id: 'ur_sub', language: 'ur', label: 'Urdu (اردو)', flag: '🇵🇰', available: true },
    ],
  },

  // Movie 872585: Oppenheimer
  'movie_872585': {
    mediaId: 872585,
    mediaType: 'movie',
    originalLanguage: 'en',
    audioTracks: [
      {
        id: 'en',
        language: 'en',
        label: 'English (Original theatrical)',
        flag: '🇺🇸',
        type: 'original',
        available: true,
        default: true,
        streamArchitecture: 'separate_streams',
        source: 'https://vidsrc.me/embed/movie?tmdb=872585&ds_lang=en',
      },
      {
        id: 'hi',
        language: 'hi',
        label: 'Hindi Dubbed (हिंदी)',
        flag: '🇮🇳',
        type: 'dub',
        available: true,
        streamArchitecture: 'dubbed_embed',
        source: 'https://multiembed.mov/?video_id=872585&tmdb=1&lang=hi',
      },
      {
        id: 'es',
        language: 'es',
        label: 'Spanish Dubbed (Español)',
        flag: '🇪🇸',
        type: 'dub',
        available: true,
        streamArchitecture: 'separate_streams',
        source: 'https://vidsrc.pm/embed/movie/872585?ds_lang=es',
      },
    ],
    subtitleTracks: [
      { id: 'en_sub', language: 'en', label: 'English (CC)', flag: '🇺🇸', available: true, default: true },
      { id: 'hi_sub', language: 'hi', label: 'Hindi (हिंदी)', flag: '🇮🇳', available: true },
    ],
  },

  // TV Show 94605 S1 E1: Arcane
  'tv_94605_1_1': {
    mediaId: 94605,
    mediaType: 'tv',
    seasonNumber: 1,
    episodeNumber: 1,
    originalLanguage: 'en',
    audioTracks: [
      {
        id: 'en',
        language: 'en',
        label: 'English (Original Atmos)',
        flag: '🇺🇸',
        type: 'original',
        available: true,
        default: true,
        streamArchitecture: 'separate_streams',
        source: 'https://vidsrc.me/embed/tv?tmdb=94605&season=1&episode=1&ds_lang=en',
      },
      {
        id: 'hi',
        language: 'hi',
        label: 'Hindi Dubbed (हिंदी Official)',
        flag: '🇮🇳',
        type: 'dub',
        available: true,
        streamArchitecture: 'dubbed_embed',
        source: 'https://multiembed.mov/?video_id=94605&tmdb=1&s=1&e=1&lang=hi',
      },
      {
        id: 'ja',
        language: 'ja',
        label: 'Japanese Dubbed (日本語 Anime Voice)',
        flag: '🇯🇵',
        type: 'dub',
        available: true,
        streamArchitecture: 'separate_streams',
        source: 'https://vidsrc.pm/embed/tv/94605/1/1?ds_lang=ja',
      },
    ],
    subtitleTracks: [
      { id: 'en_sub', language: 'en', label: 'English (CC)', flag: '🇺🇸', available: true, default: true },
      { id: 'hi_sub', language: 'hi', label: 'Hindi (हिंदी)', flag: '🇮🇳', available: true },
      { id: 'ja_sub', language: 'ja', label: 'Japanese (日本語)', flag: '🇯🇵', available: true },
    ],
  },
};

export function buildConfigKey(
  mediaId: string | number,
  mediaType: 'movie' | 'tv',
  season?: number,
  episode?: number
): string {
  if (mediaType === 'tv') {
    const s = season || 1;
    const e = episode || 1;
    return `tv_${mediaId}_${s}_${e}`;
  }
  return `movie_${mediaId}`;
}

export function getAdminAudioConfigs(): Record<string, MediaAudioConfig> {
  try {
    const stored = localStorage.getItem(ADMIN_AUDIO_STORE_KEY);
    if (!stored) {
      localStorage.setItem(ADMIN_AUDIO_STORE_KEY, JSON.stringify(DEFAULT_ADMIN_CONFIGS));
      return DEFAULT_ADMIN_CONFIGS;
    }
    const parsed = JSON.parse(stored);
    return { ...DEFAULT_ADMIN_CONFIGS, ...parsed };
  } catch (err) {
    console.error('Error parsing admin audio store:', err);
    return DEFAULT_ADMIN_CONFIGS;
  }
}

export function getAdminAudioConfig(
  mediaId: string | number,
  mediaType: 'movie' | 'tv',
  season?: number,
  episode?: number
): MediaAudioConfig | null {
  const configs = getAdminAudioConfigs();
  const key = buildConfigKey(mediaId, mediaType, season, episode);
  if (configs[key]) return configs[key];

  if (mediaType === 'tv') {
    const baseTvKey = `tv_${mediaId}`;
    if (configs[baseTvKey]) return configs[baseTvKey];
  }

  return null;
}

export function saveAdminAudioConfig(config: MediaAudioConfig): void {
  try {
    const current = getAdminAudioConfigs();
    const key = buildConfigKey(config.mediaId, config.mediaType, config.seasonNumber, config.episodeNumber);
    current[key] = config;
    localStorage.setItem(ADMIN_AUDIO_STORE_KEY, JSON.stringify(current));
  } catch (err) {
    console.error('Error saving admin audio config:', err);
  }
}

export function deleteAdminAudioConfig(
  mediaId: string | number,
  mediaType: 'movie' | 'tv',
  season?: number,
  episode?: number
): void {
  try {
    const current = getAdminAudioConfigs();
    const key = buildConfigKey(mediaId, mediaType, season, episode);
    delete current[key];
    localStorage.setItem(ADMIN_AUDIO_STORE_KEY, JSON.stringify(current));
  } catch (err) {
    console.error('Error deleting admin audio config:', err);
  }
}
