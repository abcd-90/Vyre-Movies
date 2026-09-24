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
      {/* MAIN PLAYER CONTAINER */}
      <div
        ref={containerRef}
        className="relative w-full aspect-video bg-black rounded-2xl border border-[#292F37] overflow-hidden shadow-2xl group/player select-none"
      >
        {/* ONE-CLICK AD-SHIELD PROTECTED OVERLAY */}
        {shieldActive && (
          <div
            onClick={handleShieldClick}
            className="absolute inset-0 z-30 bg-black/50 hover:bg-black/30 cursor-pointer flex flex-col items-center justify-center transition-all group/shield p-4 text-center backdrop-blur-[2px]"
            title="Click once to start video player and unblock native player controls"
          >
            <div className="px-5 py-3 bg-[#0B0D10]/95 border border-[#D6FF3F]/60 backdrop-blur-md rounded-2xl text-xs font-extrabold text-[#D6FF3F] shadow-2xl flex items-center gap-3 group-hover/shield:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5 fill-[#D6FF3F]/20 text-[#D6FF3F]" />
              <div className="text-left space-y-0.5">
                <p className="tracking-wider uppercase text-[11px] font-black">CLICK ONCE TO UNBLOCK PLAYER & AD-REMOVE BUTTONS</p>
                <p className="text-[10px] text-[#9BA3AE] font-normal">Unblocks all player buttons, ad-close icons & timeline seek controls</p>
              </div>
            </div>
          </div>
        )}

        {/* AUDIO SWITCHING TOAST NOTIFICATION */}
        {switchingToast && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 px-4 py-2 bg-[#0B0D10]/95 border border-[#D6FF3F] backdrop-blur-md text-[#D6FF3F] text-xs font-extrabold rounded-full shadow-2xl flex items-center gap-2 animate-bounce">
            <Volume2 className="w-4 h-4 animate-pulse" />
            <span>{switchingToast}</span>
          </div>
        )}

        {/* IFRAME / MEDIA STREAM CONTENT - 100% CLEAN AND UNBLOCKED */}
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
      </div>

      {/* EXTERNAL PLAYER CONTROL BAR BELOW THE VIDEO WINDOW (OUTSIDE THE IFRAME AREA TO NOT BLOCK AD-REMOVE / PLAYER BUTTONS) */}
      <div className="bg-[#111419] border border-[#292F37] p-3 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-lg relative z-20">
        <div className="flex flex-wrap items-center gap-2">
          {/* Active Audio Selection Button */}
          <button
            onClick={() => {
              setActiveTab('audio');
              setShowSettingsMenu(!showSettingsMenu);
            }}
            className="px-3.5 py-2 bg-[#171B21] border border-[#D6FF3F]/60 hover:border-[#D6FF3F] rounded-xl text-xs font-extrabold text-[#D6FF3F] flex items-center gap-2 transition-all hover:scale-105 shadow-md"
          >
            <Volume2 className="w-4 h-4" />
            <span>AUDIO: {activeAudioTrack.flag} {activeAudioTrack.label}</span>
          </button>

          {/* Subtitles Button */}
          <button
            onClick={() => {
              setActiveTab('subtitles');
              setShowSettingsMenu(!showSettingsMenu);
            }}
            className="px-3.5 py-2 bg-[#171B21] border border-[#292F37] hover:border-[#9BA3AE] rounded-xl text-xs font-bold text-[#9BA3AE] hover:text-white flex items-center gap-2 transition-all shadow-md"
          >
            <MessageSquare className="w-4 h-4 text-[#D6FF3F]" />
            <span>SUB: {activeSubtitle.label}</span>
          </button>

          {/* Stream Server Selector */}
          <button
            onClick={() => {
              setActiveTab('servers');
              setShowSettingsMenu(!showSettingsMenu);
            }}
            className="px-3.5 py-2 bg-[#171B21] border border-[#292F37] hover:border-[#9BA3AE] rounded-xl text-xs font-bold text-[#9BA3AE] hover:text-white flex items-center gap-2 transition-all shadow-md"
          >
            <Layers className="w-4 h-4 text-[#D6FF3F]" />
            <span>SERVER: {PLAYER_SERVERS.find((s) => s.id === activeServer)?.name.split('(')[0] || activeServer}</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setActiveTab('main');
              setShowSettingsMenu(!showSettingsMenu);
            }}
            className="p-2.5 bg-[#171B21] border border-[#292F37] hover:border-[#D6FF3F] text-[#9BA3AE] hover:text-[#D6FF3F] rounded-xl transition-all shadow-md"
            title="Audio & Subtitle Preferences"
          >
            <Settings className="w-4 h-4" />
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-2.5 bg-[#171B21] border border-[#292F37] hover:border-[#D6FF3F] text-[#9BA3AE] hover:text-white rounded-xl transition-all shadow-md"
            title="Fullscreen"
          >
            <Maximize className="w-4 h-4" />
          </button>
        </div>

        {/* MODAL SETTINGS & AUDIO TRACK MENU DROPDOWN */}
        {showSettingsMenu && (
          <div className="w-full bg-[#171B21] border border-[#292F37] rounded-2xl p-4 text-xs font-sans space-y-3 animate-in fade-in duration-150 mt-2">
            <div className="flex items-center justify-between border-b border-[#292F37] pb-2">
              <span className="font-extrabold text-[#F4F5F7] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                {activeTab === 'audio' && <Volume2 className="w-3.5 h-3.5 text-[#D6FF3F]" />}
                {activeTab === 'subtitles' && <MessageSquare className="w-3.5 h-3.5 text-[#D6FF3F]" />}
                {activeTab === 'servers' && <Layers className="w-3.5 h-3.5 text-[#D6FF3F]" />}
                {activeTab === 'main' && <Settings className="w-3.5 h-3.5 text-[#D6FF3F]" />}
                <span>
                  {activeTab === 'audio' && 'Select Audio / Dubbing Language'}
                  {activeTab === 'subtitles' && 'Select Subtitles (CC)'}
                  {activeTab === 'servers' && 'Select Stream Provider'}
                  {activeTab === 'main' && 'Playback Controls & Options'}
                </span>
              </span>
              <button
                onClick={() => setShowSettingsMenu(false)}
                className="text-xs font-bold text-[#9BA3AE] hover:text-white"
              >
                ✕ Close
              </button>
            </div>

            {/* AUDIO DUBBING SELECTOR TAB */}
            {activeTab === 'audio' && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                {availableAudioTracks.map((track) => {
                  const isActive = track.id === activeAudioTrack.id;
                  return (
                    <button
                      key={track.id}
                      onClick={() => handleAudioChange(track)}
                      className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                        isActive
                          ? 'bg-[#D6FF3F] text-[#0B0D10] font-extrabold shadow-sm'
                          : 'bg-[#111419] text-[#F4F5F7] hover:bg-[#1D2229] border-[#292F37]'
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
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                {availableSubtitles.map((sub) => {
                  const isActive = sub.id === activeSubtitle.id;
                  return (
                    <button
                      key={sub.id}
                      onClick={() => handleSubtitleChange(sub)}
                      className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                        isActive
                          ? 'bg-[#D6FF3F] text-[#0B0D10] font-extrabold'
                          : 'bg-[#111419] text-[#F4F5F7] hover:bg-[#1D2229] border-[#292F37]'
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {PLAYER_SERVERS.map((srv) => {
                  const isActive = srv.id === activeServer;
                  return (
                    <button
                      key={srv.id}
                      onClick={() => handleServerChange(srv.id)}
                      className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                        isActive
                          ? 'bg-[#D6FF3F] text-[#0B0D10] font-extrabold'
                          : 'bg-[#111419] text-[#F4F5F7] hover:bg-[#1D2229] border-[#292F37]'
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

      {/* HINDI DUBBING SERVER HELPER NOTIFICATION */}
      {activeAudioTrack.id === 'hi' && (
        <div className="p-3.5 bg-[#111419] border border-[#D6FF3F]/70 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#F4F5F7] shadow-xl">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🇮🇳 🔊</span>
            <div>
              <p className="font-extrabold text-[#D6FF3F] uppercase tracking-wider text-[11px]">
                Hindi Dubbed Audio Active
              </p>
              <p className="text-[11px] text-[#9BA3AE]">
                If the video is still playing in English, switch to <span className="font-bold text-white">Server 2 (MultiEmbed)</span> or <span className="font-bold text-white">Server 3 (SmashyStream)</span> below!
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => handleServerChange('multiembed')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                activeServer === 'multiembed'
                  ? 'bg-[#D6FF3F] text-[#0B0D10] border-[#D6FF3F]'
                  : 'bg-[#171B21] text-[#F4F5F7] border-[#292F37] hover:border-[#D6FF3F]'
              }`}
            >
              Switch to Server 2 (Hindi Dub)
            </button>
            <button
              onClick={() => handleServerChange('smashystream')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                activeServer === 'smashystream'
                  ? 'bg-[#D6FF3F] text-[#0B0D10] border-[#D6FF3F]'
                  : 'bg-[#171B21] text-[#F4F5F7] border-[#292F37] hover:border-[#D6FF3F]'
              }`}
            >
              Switch to Server 3
            </button>
          </div>
        </div>
      )}

      {/* DYNAMIC AUDIO TRACK QUICK BUTTONS BAR */}
      <div className="bg-[#111419] border border-[#292F37] p-3.5 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-2 text-xs font-extrabold text-[#F4F5F7]">
          <Volume2 className="w-4 h-4 text-[#D6FF3F]" />
          <span>AVAILABLE AUDIO / DUBBING TRACKS:</span>
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
