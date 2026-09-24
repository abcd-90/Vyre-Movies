import React, { useState, useEffect } from 'react';
import { ALL_SUPPORTED_LANGUAGES, type AudioTrack, type SubtitleTrack, type MediaAudioConfig } from '../types/audio';
import { getAdminAudioConfigs, saveAdminAudioConfig, buildConfigKey } from '../lib/adminAudioStore';
import { getMovieDetails, getTVDetails } from '../lib/providers/tmdb';
import type { NormalizedMedia } from '../types/media';
import { Save, Check, Volume2, Link as LinkIcon, Film, Tv, Shield } from 'lucide-react';

export const AdminPage: React.FC = () => {
  const [configs, setConfigs] = useState<Record<string, MediaAudioConfig>>({});
  const [selectedMediaId, setSelectedMediaId] = useState<string>('157336'); // Default to Interstellar
  const [selectedType, setSelectedType] = useState<'movie' | 'tv'>('movie');
  const [selectedSeason, setSelectedSeason] = useState<number>(1);
  const [selectedEpisode, setSelectedEpisode] = useState<number>(1);
  const [activeMedia, setActiveMedia] = useState<NormalizedMedia | null>(null);

  // Form State
  const [audioTracks, setAudioTracks] = useState<AudioTrack[]>([]);
  const [subtitleTracks, setSubtitleTracks] = useState<SubtitleTrack[]>([]);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);

  useEffect(() => {
    setConfigs(getAdminAudioConfigs());
  }, []);

  useEffect(() => {
    async function loadMediaDetails() {
      if (!selectedMediaId) return;
      if (selectedType === 'movie') {
        const details = await getMovieDetails(selectedMediaId);
        setActiveMedia(details);
      } else {
        const details = await getTVDetails(selectedMediaId);
        setActiveMedia(details);
      }
    }
    loadMediaDetails();
  }, [selectedMediaId, selectedType]);

  useEffect(() => {
    const key = buildConfigKey(selectedMediaId, selectedType, selectedSeason, selectedEpisode);
    const existing = configs[key];

    if (existing) {
      setAudioTracks(existing.audioTracks || []);
      setSubtitleTracks(existing.subtitleTracks || []);
    } else {
      // Default initial setup for selected item
      setAudioTracks([
        {
          id: 'en',
          language: 'en',
          label: 'English (Original)',
          flag: '🇺🇸',
          type: 'original',
          available: true,
          default: true,
        },
        {
          id: 'hi',
          language: 'hi',
          label: 'Hindi Dubbed (हिंदी)',
          flag: '🇮🇳',
          type: 'dub',
          available: true,
        },
        {
          id: 'ur',
          language: 'ur',
          label: 'Urdu Dubbed (اردو)',
          flag: '🇵🇰',
          type: 'dub',
          available: true,
        },
      ]);
      setSubtitleTracks([
        { id: 'en_sub', language: 'en', label: 'English (CC)', flag: '🇺🇸', available: true, default: true },
        { id: 'hi_sub', language: 'hi', label: 'Hindi (हिंदी)', flag: '🇮🇳', available: true },
      ]);
    }
  }, [selectedMediaId, selectedType, selectedSeason, selectedEpisode, configs]);

  const handleToggleLanguageAvailable = (code: string) => {
    const langDef = ALL_SUPPORTED_LANGUAGES.find((l) => l.code === code);
    if (!langDef) return;

    setAudioTracks((prev) => {
      const existsIndex = prev.findIndex((t) => t.id === code || t.language === code);
      if (existsIndex >= 0) {
        // Toggle available
        const updated = [...prev];
        updated[existsIndex] = { ...updated[existsIndex], available: !updated[existsIndex].available };
        return updated;
      } else {
        // Add new track
        return [
          ...prev,
          {
            id: code,
            language: code,
            label: `${langDef.name} (${langDef.nativeName})`,
            flag: langDef.flag,
            type: code === 'en' ? 'original' : 'dub',
            available: true,
          },
        ];
      }
    });
  };

  const handleUpdateTrackSource = (trackId: string, url: string) => {
    setAudioTracks((prev) =>
      prev.map((t) => (t.id === trackId ? { ...t, source: url } : t))
    );
  };

  const handleSetDefaultTrack = (trackId: string) => {
    setAudioTracks((prev) =>
      prev.map((t) => ({ ...t, default: t.id === trackId }))
    );
  };

  const handleSaveConfig = () => {
    const configToSave: MediaAudioConfig = {
      mediaId: selectedMediaId,
      mediaType: selectedType,
      seasonNumber: selectedType === 'tv' ? selectedSeason : undefined,
      episodeNumber: selectedType === 'tv' ? selectedEpisode : undefined,
      originalLanguage: 'en',
      audioTracks,
      subtitleTracks,
    };

    saveAdminAudioConfig(configToSave);
    setConfigs(getAdminAudioConfigs());

    setSaveSuccessMsg(true);
    setTimeout(() => setSaveSuccessMsg(false), 2500);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 space-y-8 select-none">
      {/* HEADER */}
      <div className="border-b border-[#292F37] pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#D6FF3F] tracking-widest uppercase mb-1">
            <Shield className="w-4 h-4" /> CONTENT MANAGEMENT SYSTEM
          </div>
          <h1 className="text-3xl font-extrabold text-[#F4F5F7]">Audio Languages & Dubbing Admin</h1>
          <p className="text-xs text-[#9BA3AE] mt-1">
            Configure multi-language audio renditions, dubbed streams, and subtitle tracks per title or episode.
          </p>
        </div>

        <button
          onClick={handleSaveConfig}
          className="px-6 py-3 bg-[#D6FF3F] hover:bg-[#c6ef2f] text-[#0B0D10] font-extrabold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-[#D6FF3F]/20 transition-all hover:scale-105"
        >
          <Save className="w-4 h-4" />
          SAVE AUDIO CONFIGURATION
        </button>
      </div>

      {saveSuccessMsg && (
        <div className="p-4 bg-[#D6FF3F]/10 border border-[#D6FF3F] text-[#D6FF3F] text-xs font-bold rounded-2xl flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4" /> Audio tracks and stream mappings saved successfully!
        </div>
      )}

      {/* SELECT MEDIA FORM */}
      <div className="bg-[#111419] border border-[#292F37] rounded-2xl p-6 space-y-6">
        <h3 className="text-sm font-extrabold text-[#F4F5F7] uppercase tracking-wider flex items-center gap-2 border-b border-[#292F37] pb-3">
          <Film className="w-4 h-4 text-[#D6FF3F]" /> Select Title to Configure
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#9BA3AE] mb-1.5 uppercase">Media Type</label>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedType('movie')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-2 ${
                  selectedType === 'movie'
                    ? 'bg-[#D6FF3F] text-[#0B0D10] border-[#D6FF3F]'
                    : 'bg-[#171B21] text-[#9BA3AE] border-[#292F37]'
                }`}
              >
                <Film className="w-3.5 h-3.5" /> Movie
              </button>
              <button
                onClick={() => setSelectedType('tv')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-2 ${
                  selectedType === 'tv'
                    ? 'bg-[#D6FF3F] text-[#0B0D10] border-[#D6FF3F]'
                    : 'bg-[#171B21] text-[#9BA3AE] border-[#292F37]'
                }`}
              >
                <Tv className="w-3.5 h-3.5" /> TV Show
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#9BA3AE] mb-1.5 uppercase">TMDB ID or Quick Selection</label>
            <select
              value={selectedMediaId}
              onChange={(e) => setSelectedMediaId(e.target.value)}
              className="w-full bg-[#171B21] border border-[#292F37] text-[#F4F5F7] text-xs font-bold p-2.5 rounded-xl focus:outline-none focus:border-[#D6FF3F]"
            >
              <option value="157336">Interstellar (157336)</option>
              <option value="27205">Inception (27205)</option>
              <option value="872585">Oppenheimer (872585)</option>
              <option value="693134">Dune: Part Two (693134)</option>
              <option value="155">The Dark Knight (155)</option>
              <option value="94605">Arcane (94605)</option>
              <option value="1399">Game of Thrones (1399)</option>
              <option value="100088">The Last of Us (100088)</option>
            </select>
          </div>

          {selectedType === 'tv' && (
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-xs font-bold text-[#9BA3AE] mb-1.5 uppercase">Season</label>
                <input
                  type="number"
                  min="1"
                  value={selectedSeason}
                  onChange={(e) => setSelectedSeason(parseInt(e.target.value, 10) || 1)}
                  className="w-full bg-[#171B21] border border-[#292F37] text-[#F4F5F7] text-xs font-bold p-2.5 rounded-xl"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-bold text-[#9BA3AE] mb-1.5 uppercase">Episode</label>
                <input
                  type="number"
                  min="1"
                  value={selectedEpisode}
                  onChange={(e) => setSelectedEpisode(parseInt(e.target.value, 10) || 1)}
                  className="w-full bg-[#171B21] border border-[#292F37] text-[#F4F5F7] text-xs font-bold p-2.5 rounded-xl"
                />
              </div>
            </div>
          )}
        </div>

        {activeMedia && (
          <div className="p-3 bg-[#171B21] border border-[#292F37] rounded-xl flex items-center gap-3">
            <img src={activeMedia.poster || ''} alt={activeMedia.title} className="w-10 h-14 object-cover rounded-lg" />
            <div>
              <h4 className="text-sm font-extrabold text-[#F4F5F7]">{activeMedia.title} ({activeMedia.year})</h4>
              <p className="text-xs text-[#9BA3AE]">Configuring Audio Languages for ID: {selectedMediaId}</p>
            </div>
          </div>
        )}
      </div>

      {/* AUDIO LANGUAGES TOGGLE GRID */}
      <div className="bg-[#111419] border border-[#292F37] rounded-2xl p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-[#292F37] pb-3">
          <h3 className="text-sm font-extrabold text-[#F4F5F7] uppercase tracking-wider flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-[#D6FF3F]" /> Available Audio Languages
          </h3>
          <span className="text-xs text-[#9BA3AE]">Check all available audio languages for this title</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {ALL_SUPPORTED_LANGUAGES.map((lang) => {
            const isChecked = audioTracks.some((t) => (t.id === lang.code || t.language === lang.code) && t.available);
            return (
              <button
                key={lang.code}
                onClick={() => handleToggleLanguageAvailable(lang.code)}
                className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                  isChecked
                    ? 'bg-[#171B21] border-[#D6FF3F] shadow-sm ring-1 ring-[#D6FF3F]'
                    : 'bg-[#0B0D10] border-[#292F37] opacity-60 hover:opacity-100'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-base">{lang.flag}</span>
                  <div className="truncate">
                    <p className={`text-xs font-bold ${isChecked ? 'text-[#D6FF3F]' : 'text-[#F4F5F7]'}`}>
                      {lang.name}
                    </p>
                    <p className="text-[10px] text-[#9BA3AE] truncate">{lang.nativeName}</p>
                  </div>
                </div>
                <div
                  className={`w-4 h-4 rounded border flex items-center justify-center ${
                    isChecked ? 'bg-[#D6FF3F] border-[#D6FF3F]' : 'border-[#292F37]'
                  }`}
                >
                  {isChecked && <Check className="w-3 h-3 text-[#0B0D10]" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* DETAILED STREAM MAPPING FOR AUDIO TRACKS */}
      <div className="bg-[#111419] border border-[#292F37] rounded-2xl p-6 space-y-6">
        <h3 className="text-sm font-extrabold text-[#F4F5F7] uppercase tracking-wider flex items-center gap-2 border-b border-[#292F37] pb-3">
          <LinkIcon className="w-4 h-4 text-[#D6FF3F]" /> Audio Track Stream Mappings & URLs
        </h3>

        <div className="space-y-3">
          {audioTracks.filter((t) => t.available).map((track) => (
            <div
              key={track.id}
              className="p-4 bg-[#171B21] border border-[#292F37] rounded-xl space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 font-bold text-xs text-[#F4F5F7]">
                  <span className="text-lg">{track.flag}</span>
                  <span>{track.label}</span>
                  <span className="px-2 py-0.5 bg-[#0B0D10] text-[#D6FF3F] text-[10px] font-mono rounded">
                    Code: {track.language}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1.5 text-xs text-[#9BA3AE] font-bold cursor-pointer">
                    <input
                      type="radio"
                      name="defaultTrack"
                      checked={!!track.default}
                      onChange={() => handleSetDefaultTrack(track.id)}
                      className="accent-[#D6FF3F]"
                    />
                    <span>Default Audio</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-extrabold text-[#9BA3AE] uppercase mb-1">
                  Stream URL / Embed URL (Leave blank to use provider default)
                </label>
                <input
                  type="text"
                  placeholder={`https://provider.com/stream-${track.language}.m3u8`}
                  value={track.source || ''}
                  onChange={(e) => handleUpdateTrackSource(track.id, e.target.value)}
                  className="w-full bg-[#0B0D10] border border-[#292F37] text-[#F4F5F7] text-xs font-mono p-2.5 rounded-xl focus:outline-none focus:border-[#D6FF3F]"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
