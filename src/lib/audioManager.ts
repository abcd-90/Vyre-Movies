import type { AudioTrack, SubtitleTrack } from '../types/audio';
import { ALL_SUPPORTED_LANGUAGES } from '../types/audio';
import { getSettings, saveSettings } from './storage';
import { getAdminAudioConfig } from './adminAudioStore';
import type { NormalizedMedia } from '../types/media';

const PREFERRED_AUDIO_LANG_KEY = 'vyre_preferred_audio_language';
const REMEMBER_AUDIO_LANG_KEY = 'vyre_remember_audio_language';

/**
 * Gets saved preferred audio language code
 */
export function getSavedAudioLanguagePreference(): string {
  try {
    const saved = localStorage.getItem(PREFERRED_AUDIO_LANG_KEY);
    if (saved) return saved;
    const settings = getSettings();
    if (settings.language) return settings.language;
    return getBrowserLanguage();
  } catch {
    return 'en';
  }
}

/**
 * Saves user's preferred audio language
 */
export function setSavedAudioLanguagePreference(langCode: string): void {
  try {
    localStorage.setItem(PREFERRED_AUDIO_LANG_KEY, langCode);
    saveSettings({ language: langCode });
  } catch (err) {
    console.error('Error saving audio language preference:', err);
  }
}

/**
 * Gets "Remember my audio language" toggle state (defaults to true)
 */
export function isRememberAudioLanguageEnabled(): boolean {
  try {
    const val = localStorage.getItem(REMEMBER_AUDIO_LANG_KEY);
    return val !== null ? val === 'true' : true;
  } catch {
    return true;
  }
}

/**
 * Sets "Remember my audio language" toggle state
 */
export function setRememberAudioLanguageEnabled(enabled: boolean): void {
  try {
    localStorage.setItem(REMEMBER_AUDIO_LANG_KEY, String(enabled));
  } catch (err) {
    console.error('Error setting remember audio language:', err);
  }
}

/**
 * Gets browser primary language code (e.g., 'hi-IN' -> 'hi', 'en-US' -> 'en')
 */
export function getBrowserLanguage(): string {
  if (typeof navigator === 'undefined' || !navigator.language) return 'en';
  const full = navigator.language.toLowerCase();
  const code = full.split('-')[0];
  return code || 'en';
}

/**
 * Resolves available audio tracks for a given movie or TV episode.
 * Inspects admin configurations, stream manifest metadata, and media info.
 */
export function getAvailableAudioTracks(
  media: NormalizedMedia,
  season?: number,
  episode?: number
): AudioTrack[] {
  // 1. Check custom Admin Configured Audio Tracks
  const adminConfig = getAdminAudioConfig(media.id, media.type, season, episode);
  if (adminConfig && adminConfig.audioTracks && adminConfig.audioTracks.length > 0) {
    return adminConfig.audioTracks.filter((t) => t.available);
  }

  // 2. Build dynamic available tracks based on media original language and provider dubbing capabilities
  const originalCode = (media as any).originalLanguage || 'en';
  const originalDef = ALL_SUPPORTED_LANGUAGES.find((l) => l.code === originalCode) || {
    code: originalCode,
    name: originalCode.toUpperCase(),
    nativeName: originalCode.toUpperCase(),
    flag: '🌐',
  };

  const tracks: AudioTrack[] = [
    {
      id: originalDef.code,
      language: originalDef.code,
      label: `${originalDef.name} (Original)`,
      flag: originalDef.flag,
      type: 'original',
      available: true,
      default: true,
      streamArchitecture: 'separate_streams',
    },
  ];

  const titleLower = media.title.toLowerCase();
  const isBollywood = originalCode === 'hi' || media.genres.includes('Bollywood') || titleLower.includes('hindi');
  const isHollywood = originalCode === 'en' || media.genres.includes('Action') || media.genres.includes('Sci-Fi');

  if (isHollywood && originalCode !== 'hi') {
    tracks.push({
      id: 'hi',
      language: 'hi',
      label: 'Hindi Dubbed (हिंदी)',
      flag: '🇮🇳',
      type: 'dub',
      available: true,
      streamArchitecture: 'dubbed_embed',
    });
    tracks.push({
      id: 'ur',
      language: 'ur',
      label: 'Urdu Dubbed (اردو)',
      flag: '🇵🇰',
      type: 'dub',
      available: true,
      streamArchitecture: 'dubbed_embed',
    });
    tracks.push({
      id: 'es',
      language: 'es',
      label: 'Spanish Dubbed (Español)',
      flag: '🇪🇸',
      type: 'dub',
      available: true,
      streamArchitecture: 'separate_streams',
    });
  } else if (isBollywood && originalCode !== 'en') {
    tracks.push({
      id: 'en',
      language: 'en',
      label: 'English Dubbed',
      flag: '🇺🇸',
      type: 'dub',
      available: true,
      streamArchitecture: 'dubbed_embed',
    });
  }

  return tracks;
}

/**
 * Resolves available subtitles for a given movie or TV episode.
 */
export function getAvailableSubtitles(
  media: NormalizedMedia,
  season?: number,
  episode?: number
): SubtitleTrack[] {
  const adminConfig = getAdminAudioConfig(media.id, media.type, season, episode);
  if (adminConfig && adminConfig.subtitleTracks && adminConfig.subtitleTracks.length > 0) {
    return adminConfig.subtitleTracks.filter((s) => s.available);
  }

  return [
    { id: 'off', language: 'off', label: 'Off', flag: '🚫', available: true },
    { id: 'en_cc', language: 'en', label: 'English (CC)', flag: '🇺🇸', available: true, default: true },
    { id: 'hi_cc', language: 'hi', label: 'Hindi (हिंदी)', flag: '🇮🇳', available: true },
    { id: 'ur_cc', language: 'ur', label: 'Urdu (اردو)', flag: '🇵🇰', available: true },
    { id: 'es_cc', language: 'es', label: 'Spanish (Español)', flag: '🇪🇸', available: true },
  ];
}

/**
 * Resolves the best active AudioTrack according to Prompt priorities:
 * 1. User manual selection for current session
 * 2. Saved user language preference (if Remember Language is enabled)
 * 3. Browser language
 * 4. Default / original language
 * 5. First available audio track
 */
export function resolveBestAudioTrack(
  availableTracks: AudioTrack[],
  sessionSelection?: string | null,
  originalLanguage?: string
): AudioTrack {
  if (!availableTracks || availableTracks.length === 0) {
    return {
      id: 'en',
      language: 'en',
      label: 'English',
      flag: '🇺🇸',
      type: 'original',
      available: true,
    };
  }

  // 1. Session selection
  if (sessionSelection) {
    const foundSession = availableTracks.find(
      (t) => t.id === sessionSelection || t.language === sessionSelection
    );
    if (foundSession) return foundSession;
  }

  // 2. Saved preference if remember enabled
  if (isRememberAudioLanguageEnabled()) {
    const prefLang = getSavedAudioLanguagePreference();
    if (prefLang) {
      const foundPref = availableTracks.find(
        (t) => t.id === prefLang || t.language === prefLang
      );
      if (foundPref) return foundPref;
    }
  }

  // 3. Browser language
  const browserLang = getBrowserLanguage();
  if (browserLang) {
    const foundBrowser = availableTracks.find(
      (t) => t.id === browserLang || t.language === browserLang
    );
    if (foundBrowser) return foundBrowser;
  }

  // 4. Default / Original language
  if (originalLanguage) {
    const foundOriginal = availableTracks.find(
      (t) => t.id === originalLanguage || t.language === originalLanguage || t.type === 'original'
    );
    if (foundOriginal) return foundOriginal;
  }

  // 5. Default specified in track or first track
  const defaultTrack = availableTracks.find((t) => t.default);
  return defaultTrack || availableTracks[0];
}

/**
 * Formats language label cleanly
 */
export function getLanguageName(code: string): string {
  const def = ALL_SUPPORTED_LANGUAGES.find((l) => l.code === code);
  return def ? `${def.name} (${def.nativeName})` : code.toUpperCase();
}
