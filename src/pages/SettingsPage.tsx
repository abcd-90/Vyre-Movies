import React, { useState } from 'react';
import { Settings, Trash2, Check, Shield, Monitor } from 'lucide-react';
import { getSettings, saveSettings, clearWatchHistory, clearWatchlist } from '../lib/storage';

export const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState(getSettings());
  const [savedMsg, setSavedMsg] = useState(false);
  const [clearedHistoryMsg, setClearedHistoryMsg] = useState(false);
  const [clearedListMsg, setClearedListMsg] = useState(false);

  const handleToggleAutoplay = () => {
    const updated = saveSettings({ autoplay: !settings.autoplay });
    setSettings(updated);
    showNotice();
  };

  const handleQualityChange = (quality: string) => {
    const updated = saveSettings({ preferredQuality: quality });
    setSettings(updated);
    showNotice();
  };

  const handleLanguageChange = (lang: string) => {
    const updated = saveSettings({ language: lang });
    setSettings(updated);
    showNotice();
  };

  const showNotice = () => {
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2000);
  };

  const handleClearHistory = () => {
    clearWatchHistory();
    setClearedHistoryMsg(true);
    setTimeout(() => setClearedHistoryMsg(false), 2000);
  };

  const handleClearWatchlist = () => {
    clearWatchlist();
    setClearedListMsg(true);
    setTimeout(() => setClearedListMsg(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 space-y-8">
      {/* Header */}
      <div className="border-b border-[#292F37] pb-6">
        <div className="flex items-center gap-2 text-xs font-bold text-[#D6FF3F] tracking-widest uppercase mb-1">
          <Settings className="w-4 h-4" /> PLATFORM PREFERENCES
        </div>
        <h1 className="text-3xl font-extrabold text-[#F4F5F7]">Settings & Preferences</h1>
        <p className="text-xs text-[#9BA3AE] mt-1">Configure playback options, theme defaults, and local data storage.</p>
      </div>

      {savedMsg && (
        <div className="p-3 bg-[#D6FF3F]/10 border border-[#D6FF3F] text-[#D6FF3F] text-xs font-bold rounded-xl flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4" /> Preferences saved successfully.
        </div>
      )}

      {/* Playback Settings */}
      <div className="bg-[#111419] border border-[#292F37] rounded-2xl p-6 space-y-6">
        <h3 className="text-sm font-extrabold text-[#F4F5F7] uppercase tracking-wider flex items-center gap-2">
          <Monitor className="w-4 h-4 text-[#D6FF3F]" /> Playback Preferences
        </h3>

        {/* Autoplay Next Episode */}
        <div className="flex items-center justify-between py-2 border-b border-[#292F37]">
          <div>
            <h4 className="text-sm font-semibold text-[#F4F5F7]">Autoplay Next Episode</h4>
            <p className="text-xs text-[#9BA3AE]">Automatically load the next episode when finished watching.</p>
          </div>
          <button
            onClick={handleToggleAutoplay}
            className={`w-12 h-6 rounded-full transition-colors relative ${
              settings.autoplay ? 'bg-[#D6FF3F]' : 'bg-[#292F37]'
            }`}
          >
            <span
              className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-[#0B0D10] transition-transform ${
                settings.autoplay ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Preferred Stream Resolution */}
        <div className="flex items-center justify-between py-2 border-b border-[#292F37]">
          <div>
            <h4 className="text-sm font-semibold text-[#F4F5F7]">Preferred Video Resolution</h4>
            <p className="text-xs text-[#9BA3AE]">Select default resolution for embed playback provider.</p>
          </div>
          <select
            value={settings.preferredQuality}
            onChange={(e) => handleQualityChange(e.target.value)}
            className="bg-[#171B21] border border-[#292F37] text-[#F4F5F7] text-xs font-bold px-3 py-2 rounded-xl focus:outline-none"
          >
            <option value="1080p">1080p Full HD</option>
            <option value="720p">720p HD</option>
            <option value="auto">Auto (Adaptive)</option>
          </select>
        </div>

        {/* Preferred Language */}
        <div className="flex items-center justify-between py-2">
          <div>
            <h4 className="text-sm font-semibold text-[#F4F5F7]">Interface Language</h4>
            <p className="text-xs text-[#9BA3AE]">Metadata display language for TMDB content.</p>
          </div>
          <select
            value={settings.language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="bg-[#171B21] border border-[#292F37] text-[#F4F5F7] text-xs font-bold px-3 py-2 rounded-xl focus:outline-none"
          >
            <option value="en">English (US)</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
          </select>
        </div>
      </div>

      {/* Data & Privacy Storage */}
      <div className="bg-[#111419] border border-[#292F37] rounded-2xl p-6 space-y-6">
        <h3 className="text-sm font-extrabold text-[#F4F5F7] uppercase tracking-wider flex items-center gap-2">
          <Shield className="w-4 h-4 text-[#D6FF3F]" /> Data & Privacy
        </h3>

        <div className="flex items-center justify-between py-2 border-b border-[#292F37]">
          <div>
            <h4 className="text-sm font-semibold text-[#F4F5F7]">Clear Continue Watching History</h4>
            <p className="text-xs text-[#9BA3AE]">Deletes local watch progress recorded in your browser.</p>
          </div>
          <button
            onClick={handleClearHistory}
            className="px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 font-bold text-xs rounded-xl flex items-center gap-2 transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear History
          </button>
        </div>
        {clearedHistoryMsg && <p className="text-xs text-red-400 font-semibold">Watch history cleared!</p>}

        <div className="flex items-center justify-between py-2">
          <div>
            <h4 className="text-sm font-semibold text-[#F4F5F7]">Clear Watchlist</h4>
            <p className="text-xs text-[#9BA3AE]">Removes all saved movies and TV shows from your watchlist.</p>
          </div>
          <button
            onClick={handleClearWatchlist}
            className="px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 font-bold text-xs rounded-xl flex items-center gap-2 transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear Watchlist
          </button>
        </div>
        {clearedListMsg && <p className="text-xs text-red-400 font-semibold">Watchlist cleared!</p>}
      </div>
    </div>
  );
};
