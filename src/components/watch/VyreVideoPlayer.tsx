import React, { useState, useEffect, useRef } from 'react';
import type { AudioTrack, SubtitleTrack } from '../../types/audio';
import type { ServerId } from '../../lib/providers/player';
import { PLAYER_SERVERS } from '../../lib/providers/player';
import { setSavedAudioLanguagePreference, isRememberAudioLanguageEnabled } from '../../lib/audioManager';
import { Volume2, Settings, ShieldCheck, Check, RefreshCw, AlertTriangle, MessageSquare, Maximize, Layers } from 'lucide-react';

export interface VyreVideoPlayerProps {
  title: string;
  playerUrl: string;
  availableAudioTracks: AudioTrack[];
  activeAudioTrack: AudioTrack;
  availableSubtitles: SubtitleTrack[];
  activeSubtitle: SubtitleTrack;
  activeServer: ServerId;
  onSelectAudioTrack: (track: AudioTrack) => void;
  onSelectSubtitle: (sub: SubtitleTrack) => void;
  onSelectServer: (serverId: ServerId) => void;
  onPositionSaved?: (seconds: number) => void;
  initialTime?: number;
}

export const VyreVideoPlayer: React.FC<VyreVideoPlayerProps> = ({
  title,
  playerUrl,
  availableAudioTracks,
  activeAudioTrack,
  availableSubtitles,
  activeSubtitle,
  activeServer,
  onSelectAudioTrack,
  onSelectSubtitle,
  onSelectServer,
  onPositionSaved,
  initialTime = 0,
}) => {
  const [shieldActive, setShieldActive] = useState(true);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [activeTab, setActiveTab] = useState<'audio' | 'subtitles' | 'servers' | 'main'>('main');
  const [switchingToast, setSwitchingToast] = useState<string | null>(null);
  const [playerError, setPlayerError] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const currentTimeRef = useRef<number>(initialTime);

  useEffect(() => {
    const timer = setInterval(() => {
      currentTimeRef.current += 1;
      if (onPositionSaved) onPositionSaved(currentTimeRef.current);
    }, 1000);
    return () => clearInterval(timer);
  }, [onPositionSaved]);

  const handleShieldClick = () => {
    setShieldActive(false);
  };

  const handleAudioChange = (track: AudioTrack) => {
    if (track.id === activeAudioTrack.id) return;
    setSwitchingToast(`Switching audio to ${track.label}...`);
    
    if (isRememberAudioLanguageEnabled()) {
      setSavedAudioLanguagePreference(track.id);
    }

    onSelectAudioTrack(track);
    setShowSettingsMenu(false);

    setTimeout(() => {
      setSwitchingToast(`${track.label} Active`);
      setTimeout(() => setSwitchingToast(null), 3000);
    }, 800);
  };

  const handleSubtitleChange = (sub: SubtitleTrack) => {
    onSelectSubtitle(sub);
    setShowSettingsMenu(false);
  };

  const handleServerChange = (srvId: ServerId) => {
    onSelectServer(srvId);
    setShowSettingsMenu(false);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      containerRef.current.requestFullscreen().catch((err) => {
        console.error('Fullscreen request failed:', err);
      });
    }
  };

  return (
    <div className="space-y-3">
      {/* MAIN PLAYER WINDOW */}
      <div
        ref={containerRef}
        className="relative w-full aspect-video bg-black rounded-2xl border border-[#292F37] overflow-hidden shadow-2xl group/player select-none"
      >
        {/* AD-SHIELD PROTECTED OVERLAY */}
        {shieldActive && (
          <div
            onClick={handleShieldClick}
            className="absolute inset-0 z-30 bg-black/40 hover:bg-black/20 cursor-pointer flex flex-col items-center justify-center transition-all group/shield p-4 text-center"
            title="Click to enable player controls"
          >
            <div className="px-5 py-3 bg-[#0B0D10]/95 border border-[#D6FF3F]/60 backdrop-blur-md rounded-2xl text-xs font-extrabold text-[#D6FF3F] shadow-2xl flex items-center gap-3 group-hover/shield:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5 fill-[#D6FF3F]/20 text-[#D6FF3F]" />
              <div className="text-left space-y-0.5">
                <p className="tracking-wider uppercase text-[11px] font-black">AD-SHIELD ACTIVE (CLICK TO START)</p>
                <p className="text-[10px] text-[#9BA3AE] font-normal">Blocks annoying popups & enables instant audio controls</p>
              </div>
            </div>
          </div>
        )}

        {/* AUDIO SWITCHING TOAST NOTIFICATION */}
        {switchingToast && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 px-4 py-2 bg-[#0B0D10]/90 border border-[#D6FF3F] backdrop-blur-md text-[#D6FF3F] text-xs font-extrabold rounded-full shadow-2xl flex items-center gap-2 animate-bounce">
            <Volume2 className="w-4 h-4 animate-pulse" />
            <span>{switchingToast}</span>
          </div>
        )}

        {/* IFRAME / MEDIA STREAM CONTENT */}
        {playerError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#111419] p-6 text-center space-y-3 z-20">
            <AlertTriangle className="w-10 h-10 text-[#D6FF3F]" />
            <h3 className="text-base font-bold text-[#F4F5F7]">Playback Couldn't Be Loaded</h3>
            <p className="text-xs text-[#9BA3AE] max-w-sm">
              The current stream server may be temporarily down. Try switching server or audio track below.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-[#D6FF3F] text-[#0B0D10] font-bold text-xs rounded-xl flex items-center gap-2 hover:scale-105 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Retry Stream
            </button>
          </div>
        ) : (
          <iframe
            ref={iframeRef}
            key={`${playerUrl}-${activeAudioTrack.id}-${activeServer}`}
            src={playerUrl}
            title={title}
            className="w-full h-full border-0 bg-black"
            allowFullScreen
            allow="autoplay; fullscreen; encrypted-media; picture-in-picture; accelerometer; clipboard-write; gyroscope"
            referrerPolicy="no-referrer"
            onError={() => setPlayerError(true)}
          />
        )}

        {/* INTEGRATED OVERLAY CONTROL BAR FOR AUDIO & SUBTITLES */}
        <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-3 flex items-center justify-between opacity-90 group-hover/player:opacity-100 transition-opacity">
          {/* Active Audio & Subtitle Status Pills */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setActiveTab('audio');
                setShowSettingsMenu(true);
              }}
              className="px-3 py-1.5 bg-[#171B21]/90 border border-[#D6FF3F]/40 hover:border-[#D6FF3F] backdrop-blur-md rounded-xl text-xs font-bold text-[#D6FF3F] flex items-center gap-1.5 transition-all hover:scale-105"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>{activeAudioTrack.flag} {activeAudioTrack.label}</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('subtitles');
                setShowSettingsMenu(true);
              }}
              className="px-3 py-1.5 bg-[#171B21]/90 border border-[#292F37] hover:border-[#9BA3AE] backdrop-blur-md rounded-xl text-xs font-bold text-[#9BA3AE] hover:text-white flex items-center gap-1.5 transition-all"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#D6FF3F]" />
              <span>SUB: {activeSubtitle.label}</span>
            </button>
          </div>

          {/* Quick Player Settings & Fullscreen */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setActiveTab('main');
                setShowSettingsMenu(!showSettingsMenu);
              }}
              className="p-2 bg-[#171B21]/90 border border-[#292F37] hover:border-[#D6FF3F] backdrop-blur-md text-[#9BA3AE] hover:text-[#D6FF3F] rounded-xl transition-all"
              title="Player Audio & Subtitle Settings"
            >
              <Settings className="w-4 h-4" />
            </button>

            <button
              onClick={toggleFullscreen}
              className="p-2 bg-[#171B21]/90 border border-[#292F37] hover:border-[#D6FF3F] backdrop-blur-md text-[#9BA3AE] hover:text-white rounded-xl transition-all"
              title="Fullscreen"
            >
              <Maximize className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* MODAL SETTINGS & AUDIO TRACK MENU OVERLAY */}
        {showSettingsMenu && (
          <div className="absolute bottom-14 right-4 z-40 w-72 bg-[#111419]/95 border border-[#292F37] backdrop-blur-xl rounded-2xl shadow-2xl p-4 text-xs font-sans animate-in fade-in zoom-in-95 duration-150 space-y-3">
            {/* Header / Tabs */}
            <div className="flex items-center justify-between border-b border-[#292F37] pb-2">
              <span className="font-extrabold text-[#F4F5F7] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                {activeTab === 'audio' && <Volume2 className="w-3.5 h-3.5 text-[#D6FF3F]" />}
                {activeTab === 'subtitles' && <MessageSquare className="w-3.5 h-3.5 text-[#D6FF3F]" />}
                {activeTab === 'servers' && <Layers className="w-3.5 h-3.5 text-[#D6FF3F]" />}
                {activeTab === 'main' && <Settings className="w-3.5 h-3.5 text-[#D6FF3F]" />}
                <span>
                  {activeTab === 'audio' && 'Audio / Dubbing'}
                  {activeTab === 'subtitles' && 'Subtitles (CC)'}
                  {activeTab === 'servers' && 'Stream Servers'}
                  {activeTab === 'main' && 'Player Controls'}
                </span>
              </span>
              {activeTab !== 'main' && (
                <button
                  onClick={() => setActiveTab('main')}
                  className="text-[10px] font-bold text-[#D6FF3F] hover:underline"
                >
                  ← Back
                </button>
              )}
            </div>

            {/* MAIN MENU TAB */}
            {activeTab === 'main' && (
              <div className="space-y-1.5">
                <button
                  onClick={() => setActiveTab('audio')}
                  className="w-full text-left p-2.5 rounded-xl bg-[#171B21] border border-[#292F37] hover:border-[#D6FF3F] flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-2 text-[#F4F5F7]">
                    <Volume2 className="w-4 h-4 text-[#D6FF3F]" />
                    <span className="font-bold">Audio Language</span>
                  </div>
                  <span className="text-[11px] font-extrabold text-[#D6FF3F]">
                    {activeAudioTrack.flag} {activeAudioTrack.label} →
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('subtitles')}
                  className="w-full text-left p-2.5 rounded-xl bg-[#171B21] border border-[#292F37] hover:border-[#D6FF3F] flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-2 text-[#F4F5F7]">
                    <MessageSquare className="w-4 h-4 text-[#D6FF3F]" />
                    <span className="font-bold">Subtitles (CC)</span>
                  </div>
                  <span className="text-[11px] font-bold text-[#9BA3AE]">
                    {activeSubtitle.label} →
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('servers')}
                  className="w-full text-left p-2.5 rounded-xl bg-[#171B21] border border-[#292F37] hover:border-[#D6FF3F] flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-2 text-[#F4F5F7]">
                    <Layers className="w-4 h-4 text-[#D6FF3F]" />
                    <span className="font-bold">Stream Provider</span>
                  </div>
                  <span className="text-[11px] font-bold text-[#9BA3AE]">
                    {PLAYER_SERVERS.find((s) => s.id === activeServer)?.name.split('(')[0] || activeServer} →
                  </span>
                </button>
              </div>
            )}

            {/* AUDIO DUBBING SELECTOR TAB */}
            {activeTab === 'audio' && (
              <div className="space-y-1 max-h-60 overflow-y-auto pr-1">
                <p className="text-[10px] text-[#9BA3AE] mb-2 leading-tight">
                  Available audio languages for this title:
                </p>
                {availableAudioTracks.map((track) => {
                  const isActive = track.id === activeAudioTrack.id;
                  return (
                    <button
                      key={track.id}
                      onClick={() => handleAudioChange(track)}
                      className={`w-full text-left p-2 rounded-xl flex items-center justify-between transition-all ${
                        isActive
                          ? 'bg-[#D6FF3F] text-[#0B0D10] font-extrabold shadow-sm'
                          : 'bg-[#171B21] text-[#F4F5F7] hover:bg-[#1D2229] border border-[#292F37]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base">{track.flag}</span>
                        <span>{track.label}</span>
                      </div>
                      {isActive && <Check className="w-4 h-4 text-[#0B0D10]" />}
                    </button>
                  );
                })}
              </div>
            )}

            {/* SUBTITLES TAB */}
            {activeTab === 'subtitles' && (
              <div className="space-y-1 max-h-60 overflow-y-auto pr-1">
                {availableSubtitles.map((sub) => {
                  const isActive = sub.id === activeSubtitle.id;
                  return (
                    <button
                      key={sub.id}
                      onClick={() => handleSubtitleChange(sub)}
                      className={`w-full text-left p-2 rounded-xl flex items-center justify-between transition-all ${
                        isActive
                          ? 'bg-[#D6FF3F] text-[#0B0D10] font-extrabold'
                          : 'bg-[#171B21] text-[#F4F5F7] hover:bg-[#1D2229] border border-[#292F37]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{sub.flag}</span>
                        <span>{sub.label}</span>
                      </div>
                      {isActive && <Check className="w-4 h-4 text-[#0B0D10]" />}
                    </button>
                  );
                })}
              </div>
            )}

            {/* SERVERS TAB */}
            {activeTab === 'servers' && (
              <div className="space-y-1 max-h-60 overflow-y-auto pr-1">
                {PLAYER_SERVERS.map((srv) => {
                  const isActive = srv.id === activeServer;
                  return (
                    <button
                      key={srv.id}
                      onClick={() => handleServerChange(srv.id)}
                      className={`w-full text-left p-2 rounded-xl flex items-center justify-between transition-all ${
                        isActive
                          ? 'bg-[#D6FF3F] text-[#0B0D10] font-extrabold'
                          : 'bg-[#171B21] text-[#F4F5F7] hover:bg-[#1D2229] border border-[#292F37]'
                      }`}
                    >
                      <span>{srv.name}</span>
                      {isActive && <Check className="w-4 h-4 text-[#0B0D10]" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* DYNAMIC AUDIO TRACK SELECTOR BAR UNDER PLAYER */}
      <div className="bg-[#111419] border border-[#292F37] p-3.5 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-2 text-xs font-extrabold text-[#F4F5F7]">
          <Volume2 className="w-4 h-4 text-[#D6FF3F]" />
          <span>AUDIO / DUBBING TRACKS:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {availableAudioTracks.map((track) => {
            const isActive = track.id === activeAudioTrack.id;
            return (
              <button
                key={track.id}
                onClick={() => handleAudioChange(track)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  isActive
                    ? 'bg-[#D6FF3F] text-[#0B0D10] shadow-md ring-1 ring-[#D6FF3F] scale-105'
                    : 'bg-[#171B21] text-[#9BA3AE] hover:text-[#F4F5F7] border border-[#292F37] hover:border-[#D6FF3F]/40'
                }`}
              >
                <span>{track.flag}</span>
                <span>{track.label}</span>
                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#0B0D10] ml-1" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
