import React from 'react';
import { Play, Clock, Sparkles, Info, Copy } from 'lucide-react';
import { PreparedProgram } from '../types/meditation';
import { calculateTotalDuration, formatDurationHuman } from '../utils/timeUtils';

interface ProgramCardProps {
  program: PreparedProgram;
  onStart: (program: PreparedProgram) => void;
  onViewDetails: (program: PreparedProgram) => void;
  onCustomize: (program: PreparedProgram) => void;
}

export const ProgramCard: React.FC<ProgramCardProps> = ({
  program,
  onStart,
  onViewDetails,
  onCustomize,
}) => {
  const totalSeconds = calculateTotalDuration(program.stages);

  return (
    <div className="relative group bg-[#0D1222] hover:bg-[#11172C] border border-white/[0.08] hover:border-amber-500/35 rounded-2xl p-4 transition-all duration-200 shadow-lg shadow-black/40 flex flex-col justify-between">
      {/* Top Tag Row */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-mono text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-400">
              {program.categoryLabel}
            </span>
            <span className="font-mono text-[9px] font-medium text-slate-400 bg-white/[0.05] px-1.5 py-0.5 rounded">
              {program.difficulty}
            </span>
          </div>

          <button
            onClick={() => onCustomize(program)}
            title="Copy & Customize Sadhana"
            className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.1] text-slate-400 hover:text-amber-400 transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Titles */}
        {program.sanskritTitle && (
          <p className="font-serif text-xs font-semibold text-amber-300/90 tracking-wide mb-0.5">
            {program.sanskritTitle}
          </p>
        )}
        <h3 className="text-base font-bold text-white tracking-tight leading-snug group-hover:text-amber-200 transition-colors">
          {program.title}
        </h3>
        <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
          {program.subtitle}
        </p>

        {/* Quick Stage Previews (Pills) */}
        <div className="my-3 flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {program.stages.slice(0, 4).map((stage, idx) => (
            <span
              key={stage.id}
              className={`inline-flex items-center gap-1 text-[10px] font-mono whitespace-nowrap px-2 py-1 rounded-md border ${
                stage.type === 'repeat'
                  ? 'bg-amber-500/10 border-amber-500/25 text-amber-300'
                  : 'bg-white/[0.04] border-white/[0.08] text-slate-300'
              }`}
            >
              <span>{idx + 1}.</span>
              <span className="truncate max-w-[90px]">{stage.title}</span>
              {stage.type === 'repeat' && (
                <span className="text-amber-400 font-bold">
                  ({stage.repeatCount || '∞'}x)
                </span>
              )}
            </span>
          ))}
          {program.stages.length > 4 && (
            <span className="text-[10px] font-mono text-slate-500 px-1 shrink-0">
              +{program.stages.length - 4} more
            </span>
          )}
        </div>
      </div>

      {/* Footer Info & Action Buttons */}
      <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 text-slate-400 font-mono text-[11px]">
          <div className="flex items-center gap-1 text-amber-400 font-bold">
            <Clock className="w-3.5 h-3.5" />
            <span>{formatDurationHuman(totalSeconds)}</span>
          </div>
          <div className="flex items-center gap-1 text-slate-400 hidden sm:flex">
            <Sparkles className="w-3 h-3 text-slate-500" />
            <span>{program.stages.length} steps</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onViewDetails(program)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-slate-300 hover:text-white text-xs font-mono font-medium transition-colors"
          >
            <Info className="w-3.5 h-3.5" />
            <span>Steps</span>
          </button>

          <button
            onClick={() => onStart(program)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-mono font-bold uppercase tracking-wider transition-all active:scale-95 shadow-md shadow-amber-500/20"
          >
            <Play className="w-3.5 h-3.5 fill-black" />
            <span>Start</span>
          </button>
        </div>
      </div>
    </div>
  );
};
