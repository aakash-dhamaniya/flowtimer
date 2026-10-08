import React from 'react';
import { Sparkles, Layers, Sliders, Settings } from 'lucide-react';

export type TabType = 'sadhana' | 'routines' | 'builder' | 'system';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  routinesCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange, routinesCount }) => {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#060812]/95 backdrop-blur-md border-t border-white/[0.08] px-4 transition-all"
      style={{
        paddingBottom: 'calc(var(--safe-bottom, env(safe-area-inset-bottom, 0px)) + 8px)',
        paddingTop: '8px',
      }}
    >
      <div className="max-w-md mx-auto flex items-center justify-around">
        {/* Sadhana Catalog Tab */}
        <button
          onClick={() => onTabChange('sadhana')}
          className={`flex flex-col items-center gap-1 transition-all py-1 px-3 rounded-xl active:scale-95 ${
            activeTab === 'sadhana'
              ? 'text-amber-400 font-bold'
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <div className={`p-1 rounded-lg ${activeTab === 'sadhana' ? 'bg-amber-500/15 text-amber-400' : ''}`}>
            <Sparkles className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span className="font-mono text-[9px] tracking-wider uppercase">
            SADHANA
          </span>
        </button>

        {/* My Routines Tab */}
        <button
          onClick={() => onTabChange('routines')}
          className={`flex flex-col items-center gap-1 transition-all py-1 px-3 rounded-xl active:scale-95 relative ${
            activeTab === 'routines'
              ? 'text-amber-400 font-bold'
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <div className={`p-1 rounded-lg ${activeTab === 'routines' ? 'bg-amber-500/15 text-amber-400' : ''}`}>
            <Layers className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span className="font-mono text-[9px] tracking-wider uppercase">
            MY ROUTINES
          </span>
          {typeof routinesCount === 'number' && routinesCount > 0 && (
            <span className="absolute top-0 right-2 w-4 h-4 rounded-full bg-amber-500 text-black text-[9px] font-bold font-mono flex items-center justify-center">
              {routinesCount}
            </span>
          )}
        </button>

        {/* Builder Tab */}
        <button
          onClick={() => onTabChange('builder')}
          className={`flex flex-col items-center gap-1 transition-all py-1 px-3 rounded-xl active:scale-95 ${
            activeTab === 'builder'
              ? 'text-amber-400 font-bold'
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <div className={`p-1 rounded-lg ${activeTab === 'builder' ? 'bg-amber-500/15 text-amber-400' : ''}`}>
            <Sliders className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span className="font-mono text-[9px] tracking-wider uppercase">
            BUILDER
          </span>
        </button>

        {/* Settings Tab */}
        <button
          onClick={() => onTabChange('system')}
          className={`flex flex-col items-center gap-1 transition-all py-1 px-3 rounded-xl active:scale-95 ${
            activeTab === 'system'
              ? 'text-amber-400 font-bold'
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <div className={`p-1 rounded-lg ${activeTab === 'system' ? 'bg-amber-500/15 text-amber-400' : ''}`}>
            <Settings className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span className="font-mono text-[9px] tracking-wider uppercase">
            SETTINGS
          </span>
        </button>
      </div>
    </nav>
  );
};
