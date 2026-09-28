import React from 'react';
import { Layers, Sliders, Cpu } from 'lucide-react';

export type TabType = 'routines' | 'builder' | 'system';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#080A0F]/95 backdrop-blur-md border-t border-white/[0.08] px-6 transition-all"
      style={{
        paddingBottom: 'calc(var(--safe-bottom, env(safe-area-inset-bottom, 0px)) + 10px)',
        paddingTop: '10px',
      }}
    >
      <div className="max-w-md mx-auto flex items-center justify-around">
        {/* Routines Tab */}
        <button
          onClick={() => onTabChange('routines')}
          className={`flex flex-col items-center gap-1 transition-all py-1 px-4 rounded-lg active:scale-95 ${
            activeTab === 'routines'
              ? 'text-amber-500'
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <Layers className="w-5 h-5 stroke-[2.2]" />
          <span className="font-mono text-[10px] font-bold tracking-widest uppercase">
            ROUTINES
          </span>
        </button>

        {/* Builder Tab */}
        <button
          onClick={() => onTabChange('builder')}
          className={`flex flex-col items-center gap-1 transition-all py-1 px-4 rounded-lg active:scale-95 ${
            activeTab === 'builder'
              ? 'text-amber-500'
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <Sliders className="w-5 h-5 stroke-[2.2]" />
          <span className="font-mono text-[10px] font-bold tracking-widest uppercase">
            BUILDER
          </span>
        </button>

        {/* System Tab */}
        <button
          onClick={() => onTabChange('system')}
          className={`flex flex-col items-center gap-1 transition-all py-1 px-4 rounded-lg active:scale-95 ${
            activeTab === 'system'
              ? 'text-amber-500'
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <Cpu className="w-5 h-5 stroke-[2.2]" />
          <span className="font-mono text-[10px] font-bold tracking-widest uppercase">
            SYSTEM
          </span>
        </button>
      </div>
    </nav>
  );
};
