import React from 'react';
import { SlidersHorizontal, Plus } from 'lucide-react';

interface HeaderProps {
  onNewRoutine: () => void;
  onOpenSettings: () => void;
  totalCustomRoutines: number;
  totalPreparedPrograms: number;
  activeTab: string;
}

export const Header: React.FC<HeaderProps> = ({
  onNewRoutine,
  onOpenSettings,
  totalCustomRoutines,
  totalPreparedPrograms,
  activeTab,
}) => {
  return (
    <header
      className="sticky top-0 z-30 bg-[#060812]/95 backdrop-blur-md border-b border-white/[0.08] px-4 transition-all"
      style={{
        paddingTop: 'calc(var(--safe-top, env(safe-area-inset-top, 0px)) + 12px)',
        paddingBottom: '14px',
      }}
    >
      <div className="max-w-md mx-auto">
        {/* Top Branding Row */}
        <div className="flex items-center justify-between">
          {/* Logo & Vedic Branding */}
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-[#1E1735] to-[#111628] border border-amber-500/30 flex items-center justify-center overflow-hidden shadow-lg shadow-amber-500/10">
              {/* Sacred Om symbol with golden glow */}
              <span className="font-serif text-xl font-black text-amber-400 select-none drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]">
                ॐ
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-[18px] font-black tracking-tight text-white flex items-center gap-1">
                  PranaFlow
                </h1>
                <span className="font-mono text-[9px] font-bold text-amber-400 bg-amber-500/15 px-1.5 py-0.2 rounded border border-amber-500/30">
                  VEDIC
                </span>
              </div>
              <p className="font-mono text-[10px] font-bold tracking-widest text-amber-300/80 uppercase">
                YOG & PRANAYAMA SADHANA
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenSettings}
              className="w-9 h-9 rounded-xl bg-[#101424] border border-white/[0.08] flex items-center justify-center text-slate-400 hover:text-white hover:border-white/[0.18] transition-all active:scale-95"
              title="System Preferences"
              aria-label="Settings"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
            <button
              onClick={onNewRoutine}
              className="flex items-center gap-1.5 px-3 h-9 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs transition-all active:scale-95 shadow-sm shadow-amber-500/30"
              title="Create Custom Sadhana"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span className="font-mono font-bold">CUSTOM</span>
            </button>
          </div>
        </div>

        {/* Status Strip */}
        <div className="mt-3.5 flex items-center justify-between bg-[#0F1426] border border-white/[0.06] rounded-xl px-3.5 py-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="font-mono text-[11px] text-slate-300 font-medium tracking-wide">
              {activeTab === 'sadhana' ? 'Sadhana Library' : activeTab === 'routines' ? 'Personal Routines' : 'Sadhana Matrix'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              {activeTab === 'sadhana' 
                ? `${totalPreparedPrograms} PROGRAMS` 
                : `${totalCustomRoutines} SAVED`}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
