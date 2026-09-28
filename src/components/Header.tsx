import React from 'react';
import { SlidersHorizontal, Plus } from 'lucide-react';

interface HeaderProps {
  onNewRoutine: () => void;
  onOpenSettings: () => void;
  totalRoutines: number;
}

export const Header: React.FC<HeaderProps> = ({
  onNewRoutine,
  onOpenSettings,
  totalRoutines,
}) => {
  return (
    <header
      className="sticky top-0 z-30 bg-[#080A0F]/95 backdrop-blur-md border-b border-white/[0.08] px-4 transition-all"
      style={{
        paddingTop: 'calc(var(--safe-top, env(safe-area-inset-top, 0px)) + 12px)',
        paddingBottom: '14px',
      }}
    >
      <div className="max-w-md mx-auto">
        {/* Top Branding Row */}
        <div className="flex items-center justify-between">
          {/* Logo & Wordmark */}
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-xl bg-[#111520] border border-white/[0.12] flex items-center justify-center overflow-hidden shadow-inner">
              {/* Radial tick marks */}
              <svg className="w-6 h-6 text-amber-500" viewBox="0 0 36 36">
                <circle
                  cx="18"
                  cy="18"
                  r="13"
                  fill="none"
                  stroke="rgba(255,255,255,0.12)"
                  strokeWidth="2.5"
                  strokeDasharray="2 3"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="13"
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth="3"
                  strokeDasharray="25 60"
                  strokeLinecap="round"
                />
                <polygon points="15,12 24,18 15,24" fill="#F59E0B" />
              </svg>
            </div>
            <div>
              <h1 className="text-[17px] font-bold tracking-tight text-white flex items-center gap-2">
                FlowTimer
              </h1>
              <p className="font-mono text-[10px] font-bold tracking-widest text-amber-500 uppercase">
                ROUTINES LIBRARY
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenSettings}
              className="w-9 h-9 rounded-full bg-[#111520] border border-white/[0.08] flex items-center justify-center text-slate-400 hover:text-white hover:border-white/[0.18] transition-all active:scale-95"
              title="System Preferences"
              aria-label="Settings"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
            <button
              onClick={onNewRoutine}
              className="flex items-center gap-1.5 px-3 h-9 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs transition-all active:scale-95 shadow-sm shadow-amber-500/30"
              title="Create New Routine"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>NEW</span>
            </button>
          </div>
        </div>

        {/* Tactical Subheader / Status Strip */}
        <div className="mt-3.5 flex items-center justify-between bg-[#111520] border border-white/[0.06] rounded-xl px-3.5 py-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-[11px] text-slate-300 font-medium tracking-wide">
              Sequence Matrix
            </span>
            <span className="font-mono text-[9px] text-slate-500 uppercase tracking-widest hidden sm:inline">
              CHRONO SYNC
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              {totalRoutines} {totalRoutines === 1 ? 'PRESET' : 'PRESETS'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
