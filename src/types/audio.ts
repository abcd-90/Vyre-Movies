export type StreamArchitecture = 'single_multitrack' | 'separate_streams' | 'dubbed_embed';

export interface AudioTrack {
  id: string; // BCP-47 code or unique identifier, e.g. 'hi', 'en', 'ur'
  language: string; // BCP-47 language code e.g. 'hi', 'en', 'ur', 'es'
  label: string; // Human readable name, e.g. 'Hindi (Dubbed)'
  flag: string; // Emoji flag, e.g. '🇮🇳', '🇺🇸', '🇵🇰'
  type: 'original' | 'dub' | 'commentary';
  source?: string; // Direct stream URL or server ID if separate
  available: boolean;
  default?: boolean;
  streamArchitecture?: StreamArchitecture;
}

export interface SubtitleTrack {
  id: string;
  language: string;
  label: string;
  flag: string;
  src?: string;
  available: boolean;
  default?: boolean;
}

export interface MediaAudioConfig {
  mediaId: string | number;
  mediaType: 'movie' | 'tv';
  seasonNumber?: number;
  episodeNumber?: number;
  originalLanguage: string;
  audioTracks: AudioTrack[];
  subtitleTracks: SubtitleTrack[];
}

export interface AudioLanguageDefinition {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export const ALL_SUPPORTED_LANGUAGES: AudioLanguageDefinition[] = [
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', flag: '🇵🇰' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇧🇩' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇦🇪' },
];
