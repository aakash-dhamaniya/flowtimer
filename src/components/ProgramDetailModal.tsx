import React from 'react';
import { X, Play, Copy, Clock, Sparkles, AlertCircle, CheckCircle2, Flame, ArrowRight } from 'lucide-react';
import { PreparedProgram } from '../types/meditation';
import { calculateTotalDuration, formatDurationHuman } from '../utils/timeUtils';

interface ProgramDetailModalProps {
  program: PreparedProgram | null;
  isOpen: boolean;
  onClose: () => void;
  onStartProgram: (program: PreparedProgram) => void;
  onCopyToMyRoutines: (program: PreparedProgram) => void;
}

export const ProgramDetailModal: React.FC<ProgramDetailModalProps> = ({
  program,
  isOpen,
  onClose,
  onStartProgram,
  onCopyToMyRoutines,
}) => {
  if (!isOpen || !program) return null;

  const totalSeconds = calculateTotalDuration(program.stages);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-[#0A0D18] border border-amber-500/20 sm:rounded-3xl rounded-t-3xl max-h-[90vh] flex flex-col shadow-2xl shadow-amber-500/10 overflow-hidden"
        style={{
          paddingBottom: 'calc(var(--safe-bottom, env(safe-area-inset-bottom, 0px)) + 16px)',
        }}
      >
        {/* Header with Background Gradient */}
        <div className="relative p-5 pb-4 border-b border-white/[0.08] bg-gradient-to-b from-[#141A2E] to-[#0A0D18]">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400">
              {program.categoryLabel}
            </span>
            <span className="font-mono text-[10px] font-semibold text-slate-400 bg-white/[0.05] px-2 py-0.5 rounded-full">
              {program.difficulty}
            </span>
          </div>

          {program.sanskritTitle && (
            <h3 className="font-serif text-lg font-bold text-amber-300 tracking-wide mb-0.5">
              {program.sanskritTitle}
            </h3>
          )}
          <h2 className="text-xl font-extrabold text-white tracking-tight">
            {program.title}
          </h2>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            {program.subtitle}
          </p>

          {/* Quick Metrics Bar */}
          <div className="flex items-center gap-4 mt-3 text-xs font-mono text-slate-400 pt-2 border-t border-white/[0.05]">
            <div className="flex items-center gap-1.5 text-amber-400">
              <Clock className="w-3.5 h-3.5" />
              <span className="font-bold">{formatDurationHuman(totalSeconds)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{program.stages.length} Stages</span>
            </div>
            {program.chakra && (
              <div className="flex items-center gap-1.5 text-indigo-300 truncate">
                <span>Chakra: {program.chakra}</span>
              </div>
            )}
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 space-y-5 overflow-y-auto flex-1 text-slate-200 text-xs leading-relaxed custom-scrollbar">
          {/* Traditional Background & Context */}
          <div className="bg-[#101424] p-3.5 rounded-2xl border border-white/[0.06] space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-mono font-bold text-[11px] uppercase tracking-wider">
              <Flame className="w-3.5 h-3.5" />
              <span>Vedic Context & Purpose</span>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed">
              {program.description}
            </p>
            {program.bestTime && (
              <div className="pt-2 text-[11px] font-mono text-slate-400 flex items-center gap-1.5 border-t border-white/[0.04]">
                <span className="text-amber-400 font-bold">Best Time:</span>
                <span>{program.bestTime}</span>
              </div>
            )}
            {program.mudra && (
              <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                <span className="text-amber-400 font-bold">Recommended Mudra:</span>
                <span>{program.mudra}</span>
              </div>
            )}
          </div>

          {/* Key Benefits */}
          <div>
            <h4 className="font-mono text-[11px] font-bold uppercase tracking-wider text-amber-400 mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Traditional Benefits</span>
            </h4>
            <div className="grid grid-cols-1 gap-2">
              {program.benefits.map((benefit, i) => (
                <div key={i} className="flex items-start gap-2 bg-[#101424] p-2.5 rounded-xl border border-white/[0.04]">
                  <span className="text-amber-500 font-bold font-mono">0{i + 1}.</span>
                  <span className="text-slate-200 text-xs">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Step-by-Step Program Stages */}
          <div>
            <h4 className="font-mono text-[11px] font-bold uppercase tracking-wider text-amber-400 mb-2 flex items-center gap-1.5">
              <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
              <span>Step-by-Step Routine Sequence</span>
            </h4>
            <div className="space-y-2">
              {program.stages.map((stage, idx) => (
                <div 
                  key={stage.id} 
                  className={`p-3 rounded-xl border ${
                    stage.type === 'repeat'
                      ? 'bg-amber-500/[0.04] border-amber-500/20'
                      : 'bg-[#101424] border-white/[0.06]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-white/[0.08] text-amber-400 font-mono font-bold text-[10px] flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="font-semibold text-white text-xs">
                        {stage.title}
                      </span>
                    </div>
                    <span className="font-mono text-[11px] text-amber-400 font-bold">
                      {stage.type === 'repeat' 
                        ? `${stage.repeatCount || '∞'}x Loop` 
                        : formatDurationHuman(stage.durationSeconds)}
                    </span>
                  </div>

                  {stage.customAnnouncement && (
                    <p className="mt-1 text-[11px] text-slate-400 italic pl-7">
                      "{stage.customAnnouncement}"
                    </p>
                  )}

                  {/* Nested stages preview */}
                  {stage.type === 'repeat' && stage.nestedStages && (
                    <div className="mt-2 pl-7 space-y-1 pt-1.5 border-t border-amber-500/10">
                      {stage.nestedStages.map((nested) => (
                        <div key={nested.id} className="flex items-center justify-between text-[11px] text-slate-300">
                          <span className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500/60" />
                            {nested.title}
                          </span>
                          <span className="font-mono text-slate-400">
                            {formatDurationHuman(nested.durationSeconds)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Precautions (if any) */}
          {program.precautions && program.precautions.length > 0 && (
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-3 space-y-1.5">
              <div className="flex items-center gap-1.5 text-amber-400 font-mono text-[10px] font-bold uppercase tracking-wider">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Guidelines & Precautions</span>
              </div>
              <ul className="list-disc list-inside text-[11px] text-amber-200/90 space-y-1">
                {program.precautions.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Bottom Actions Bar */}
        <div className="p-4 bg-[#0A0D18] border-t border-white/[0.08] flex items-center gap-3">
          <button
            onClick={() => onCopyToMyRoutines(program)}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 text-xs font-mono font-bold tracking-wider uppercase transition-all active:scale-95 border border-white/[0.08]"
          >
            <Copy className="w-4 h-4 text-amber-400" />
            <span>Customize</span>
          </button>

          <button
            onClick={() => onStartProgram(program)}
            className="flex-[2] flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-black text-xs font-mono font-bold tracking-wider uppercase transition-all active:scale-95 shadow-lg shadow-amber-500/25"
          >
            <Play className="w-4 h-4 fill-black" />
            <span>Start Sadhana Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};
