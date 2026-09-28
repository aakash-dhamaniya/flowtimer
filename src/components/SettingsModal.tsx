import React, { useState, useEffect } from 'react';
import { X, Volume2, Check, Trash2, Play } from 'lucide-react';
import { UserSettings, ChimeType } from '../types/meditation';
import { speechService } from '../services/speechService';
import { soundService } from '../services/soundService';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onSave: (settings: UserSettings) => void;
  onResetDefaults: () => void;
}

interface ChimeOption {
  type: ChimeType;
  name: string;
  desc: string;
}

const CHIME_OPTIONS: ChimeOption[] = [
  { type: 'bell', name: 'Clear Bell', desc: 'Resonant bowl - 432 Hz' },
  { type: 'beep', name: 'Digital Beep', desc: 'Athletic dual-tone burst' },
  { type: 'chime', name: 'Warm Chime', desc: 'Soft acoustic marimba' },
  { type: 'gong', name: 'Deep Gong', desc: 'Sub-bass harmonic decay' },
  { type: 'none', name: 'Silent', desc: 'Tactile haptic impulses only' },
];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSave,
  onResetDefaults,
}) => {
  const [localSettings, setLocalSettings] = useState<UserSettings>(settings);
  const [selectedChime, setSelectedChime] = useState<ChimeType>('bell');

  useEffect(() => {
    if (isOpen) {
      setLocalSettings(settings);
    }
  }, [isOpen, settings]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(localSettings);
    onClose();
  };

  const handleTestChime = (type: ChimeType, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedChime(type);
    soundService.setVolume(localSettings.bellVolume);
    soundService.playSound(type);
  };

  const handleTestVoice = () => {
    speechService.setEnabled(true);
    speechService.setRate(localSettings.speechRate);
    speechService.setPitch(localSettings.speechPitch);
    speechService.speak("Starting Next Stage: Breath Focus");
  };

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to delete all saved routines? This cannot be undone.")) {
      onResetDefaults();
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#080A0F]/95 backdrop-blur-md flex flex-col justify-between overflow-y-auto"
      style={{
        paddingTop: 'calc(var(--safe-top, env(safe-area-inset-top, 0px)) + 12px)',
        paddingBottom: 'calc(var(--safe-bottom, env(safe-area-inset-bottom, 0px)) + 20px)',
      }}
    >
      <div className="max-w-md w-full mx-auto px-5 py-2 flex-1 flex flex-col justify-between space-y-5">
        {/* Header with Drag Handle & Close */}
        <div>
          <div className="w-10 h-1 rounded-full bg-white/[0.15] mx-auto mb-3" />
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Sound & Behavior
              </h2>
              <p className="font-mono text-[10px] font-bold text-amber-500 uppercase tracking-widest">
                SYSTEM PREFERENCES
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-[#111520] border border-white/[0.08] flex items-center justify-center text-slate-400 hover:text-white transition-all active:scale-95"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="space-y-5 flex-1">
          {/* Section 1: Alert Sound Chime Protocol */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                ALERT SOUND
              </span>
              <span className="font-mono text-[10px] font-bold text-amber-500 uppercase tracking-widest">
                CHIME PROTOCOL
              </span>
            </div>

            <div className="bg-[#111520] border border-white/[0.08] rounded-2xl overflow-hidden divide-y divide-white/[0.05]">
              {CHIME_OPTIONS.map((opt) => (
                <div
                  key={opt.type}
                  onClick={() => {
                    setSelectedChime(opt.type);
                    soundService.playSound(opt.type);
                  }}
                  className="flex items-center justify-between p-3.5 hover:bg-white/[0.03] transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                        selectedChime === opt.type
                          ? 'border-amber-500 bg-amber-500'
                          : 'border-white/[0.2] bg-transparent'
                      }`}
                    >
                      {selectedChime === opt.type && (
                        <Check className="w-3 h-3 text-black stroke-[3]" />
                      )}
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-white block">
                        {opt.name}
                      </span>
                      <span className="font-mono text-[11px] text-slate-400 block">
                        {opt.desc}
                      </span>
                    </div>
                  </div>

                  {opt.type !== 'none' && (
                    <button
                      type="button"
                      onClick={(e) => handleTestChime(opt.type, e)}
                      className="w-8 h-8 rounded-lg bg-[#192030] hover:bg-white/[0.08] flex items-center justify-center text-amber-400 active:scale-90 transition-all"
                      title={`Preview ${opt.name}`}
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Voice Announcements (TTS) */}
          <div className="bg-[#111520] border border-white/[0.08] rounded-2xl p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                VOICE ANNOUNCEMENTS (TTS)
              </span>
              <span className="font-mono text-[10px] font-bold text-amber-500 uppercase tracking-widest">
                NEURAL ENGINE
              </span>
            </div>

            {/* Toggle Row */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-semibold text-white block">
                  Speak Stage Titles Aloud
                </span>
                <span className="text-xs text-slate-400 block">
                  Announces stage transition cue via speaker
                </span>
              </div>
              <button
                type="button"
                onClick={() =>
                  setLocalSettings({
                    ...localSettings,
                    ttsEnabled: !localSettings.ttsEnabled,
                  })
                }
                className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                  localSettings.ttsEnabled ? 'bg-amber-500' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-black shadow-md transition-transform ${
                    localSettings.ttsEnabled ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Speech Rate Control */}
            {localSettings.ttsEnabled && (
              <div className="space-y-2 pt-2 border-t border-white/[0.06]">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>SPEECH RATE</span>
                  <span className="text-amber-400 font-bold">{localSettings.speechRate}x</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[0.8, 1.0, 1.2].map((rate) => (
                    <button
                      key={rate}
                      type="button"
                      onClick={() =>
                        setLocalSettings({ ...localSettings, speechRate: rate })
                      }
                      className={`py-2 rounded-xl font-mono text-xs font-bold transition-all ${
                        localSettings.speechRate === rate
                          ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                          : 'bg-[#192030] text-slate-300 hover:bg-white/[0.08]'
                      }`}
                    >
                      {rate}x
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleTestVoice}
                  className="w-full mt-2 py-2.5 rounded-xl bg-[#192030] hover:bg-white/[0.08] text-slate-300 hover:text-white font-mono text-xs font-medium flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <Play className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span>Test Voice: &quot;Starting Next Stage&quot;</span>
                </button>
              </div>
            )}
          </div>

          {/* Section 3: Display & System Hardware */}
          <div className="bg-[#111520] border border-white/[0.08] rounded-2xl p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                DISPLAY & SYSTEM
              </span>
              <span className="font-mono text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                DEVICE HARDWARE
              </span>
            </div>

            {/* Keep Screen Awake */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-semibold text-white block">
                  Keep Screen Awake
                </span>
                <span className="text-xs text-slate-400 block">
                  Prevents standby display sleep while timer runs
                </span>
              </div>
              <button
                type="button"
                onClick={() =>
                  setLocalSettings({
                    ...localSettings,
                    keepScreenAwake: !localSettings.keepScreenAwake,
                  })
                }
                className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                  localSettings.keepScreenAwake ? 'bg-amber-500' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-black shadow-md transition-transform ${
                    localSettings.keepScreenAwake ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Haptic Vibration */}
            <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
              <div>
                <span className="text-sm font-semibold text-white block">
                  Haptic Vibration
                </span>
                <span className="text-xs text-slate-400 block">
                  Milled tactile tap on each stage completion
                </span>
              </div>
              <button
                type="button"
                onClick={() =>
                  setLocalSettings({
                    ...localSettings,
                    enableHaptic: !localSettings.enableHaptic,
                  })
                }
                className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                  localSettings.enableHaptic ? 'bg-amber-500' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-black shadow-md transition-transform ${
                    localSettings.enableHaptic ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Danger Zone: Clear All Routines */}
          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={handleClearAll}
              className="text-xs font-mono text-rose-400/80 hover:text-rose-400 flex items-center justify-center gap-1.5 mx-auto py-2 px-3 rounded-lg hover:bg-rose-500/10 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All Saved Routines</span>
            </button>
            <p className="font-mono text-[9px] text-slate-600 mt-2 uppercase tracking-widest">
              FLOWTIMER ENGINE V3.1.2 • ZERO TELEMETRY
            </p>
          </div>
        </div>

        {/* Save Preferences Button */}
        <div className="pt-3">
          <button
            onClick={handleSave}
            className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 active:scale-[0.98] text-black font-bold text-sm tracking-wide shadow-xl shadow-amber-500/25 transition-all"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
};
