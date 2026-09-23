import type { NormalizedMedia, WatchProgress } from '../types/media';

const WATCHLIST_KEY = 'vyre_watchlist';
const WATCH_HISTORY_KEY = 'vyre_watch_history';
const SETTINGS_KEY = 'vyre_settings';

export interface AppSettings {
  autoplay: boolean;
  preferredQuality: string;
  language: string;
  subtitlesEnabled: boolean;
}

const DEFAULT_SETTINGS: AppSettings = {
  autoplay: true,
  preferredQuality: '1080p',
  language: 'en',
  subtitlesEnabled: true,
};

export function getWatchlist(): NormalizedMedia[] {
  try {
    const data = localStorage.getItem(WATCHLIST_KEY);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error('Error reading watchlist from localStorage:', err);
    return [];
  }
}

export function isInWatchlist(mediaId: string | number, type: 'movie' | 'tv'): boolean {
  const list = getWatchlist();
  return list.some((item) => String(item.id) === String(mediaId) && item.type === type);
}

export function toggleWatchlist(media: NormalizedMedia): boolean {
  const list = getWatchlist();
  const index = list.findIndex(
    (item) => String(item.id) === String(media.id) && item.type === media.type
  );

  if (index >= 0) {
    list.splice(index, 1);
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(list));
    return false;
  } else {
    list.unshift(media);
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(list));
    return true;
  }
}

export function getWatchHistory(): WatchProgress[] {
  try {
    const data = localStorage.getItem(WATCH_HISTORY_KEY);
    const history: WatchProgress[] = data ? JSON.parse(data) : [];
    return history.sort((a, b) => b.lastUpdated - a.lastUpdated);
  } catch (err) {
    console.error('Error reading watch history from localStorage:', err);
    return [];
  }
}

export function saveWatchProgress(progress: Omit<WatchProgress, 'lastUpdated'>): void {
  try {
    const history = getWatchHistory();
    const existingIndex = history.findIndex(
      (item) => String(item.mediaId) === String(progress.mediaId) && item.type === progress.type
    );

    const updatedItem: WatchProgress = {
      ...progress,
      lastUpdated: Date.now(),
    };

    if (existingIndex >= 0) {
      history[existingIndex] = updatedItem;
    } else {
      history.unshift(updatedItem);
    }

    localStorage.setItem(WATCH_HISTORY_KEY, JSON.stringify(history.slice(0, 30)));
  } catch (err) {
    console.error('Error saving watch progress to localStorage:', err);
  }
}

export function clearWatchHistory(): void {
  localStorage.removeItem(WATCH_HISTORY_KEY);
}

export function clearWatchlist(): void {
  localStorage.removeItem(WATCHLIST_KEY);
}

export function getSettings(): AppSettings {
  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
  } catch (err) {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: Partial<AppSettings>): AppSettings {
  const current = getSettings();
  const updated = { ...current, ...settings };
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
  return updated;
}
