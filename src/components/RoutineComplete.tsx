import React, { useEffect } from 'react';
import {
  Check,
  CheckCircle2,
  RotateCcw,
  ArrowRight,
  Clock,
  Flag,
  Bell,
  Award,
  Repeat,
  Trophy,
  Minus,
  Plus,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Routine } from '../types/meditation';
import { formatTimeDigits, formatDurationHuman } from '../utils/timeUtils';

interface RoutineCompleteProps {
  routine: Routine;
  totalElapsedSeconds: number;
  totalCyclesCompleted?: number;
  onDone: () => void;
  onRepeat: () => void;
  onUpdateCompletionCount?: (newCount: number) => void;
}

export const RoutineComplete: React.FC<RoutineCompleteProps> = ({
  routine,
  totalElapsedSeconds,
  totalCyclesCompleted = 0,
  onDone,
  onRepeat,
  onUpdateCompletionCount,
}) => {
  useEffect(() => {
    // Fire celebratory confetti on mount
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#F59E0B', '#10B981', '#FBBF24', '#34D399'],
      });
    } catch {
      // Ignore if canvas is unavailable
    }
  }, []);

  const totalStages = routine.stages.length;
  const avgStageSeconds = totalStages > 0 ? Math.round(totalElapsedSeconds / totalStages) : 0;

  return (
    <div
      className="fixed inset-0 z-50 bg-[#080A0F] text-white flex flex-col justify-between overflow-y-auto"
      style={{
        paddingTop: 'calc(var(--safe-top, env(safe-area-inset-top, 0px)) + 16px)',
        paddingBottom: 'calc(var(--safe-bottom, env(safe-area-inset-bottom, 0px)) + 20px)',
      }}
    >
      <div className="max-w-md w-full mx-auto px-5 py-2 flex-1 flex flex-col justify-between space-y-6">
        {/* Top Header & Badge */}
        <div className="text-center pt-4">
          {/* Emerald Glowing Icon */}
          <div className="w-20 h-20 rounded-full bg-emerald-500/15 border-2 border-emerald-500/40 flex items-center justify-center mx-auto mb-4 shadow-xl shadow-emerald-500/20">
            <Check className="w-10 h-10 text-emerald-400 stroke-[3]" />
          </div>

          <span className="font-mono text-[11px] font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 inline-block mb-2">
            SESSION 100% CONCLUDED
          </span>

          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Routine Complete!
          </h1>

          <p className="text-sm text-slate-400 mt-1">
            Great job completing <span className="text-white font-semibold">{routine.title}</span>
          </p>

          {/* Fully Filled Green Progress Track */}
          <div className="w-full h-1.5 rounded-full bg-emerald-500 flex gap-1.5 overflow-hidden my-4 shadow-sm shadow-emerald-500/40">
            {routine.stages.map((_, i) => (
              <div key={i} className="h-full flex-1 bg-emerald-400" />
            ))}
          </div>
        </div>

        {/* Completion Count Celebration Banner */}
        <div className="bg-[#111520] border border-amber-500/30 rounded-2xl p-4 flex items-center justify-between shadow-lg shadow-black/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider block">
                TOTAL ROUTINE COMPLETIONS
              </span>
              <span className="text-sm sm:text-base font-bold text-white">
                Completed <strong className="text-amber-400 font-mono text-base">{routine.completionCount || 1}</strong> {routine.completionCount === 1 ? 'time' : 'times'}
              </span>
            </div>
          </div>

          {onUpdateCompletionCount && (
            <div className="flex items-center gap-1.5 bg-[#192030] rounded-xl p-1 border border-white/[0.08] shrink-0">
              <button
                type="button"
                onClick={() => onUpdateCompletionCount(Math.max(0, (routine.completionCount || 1) - 1))}
                className="w-7 h-7 rounded-lg bg-[#111520] hover:bg-white/[0.08] text-slate-300 hover:text-white flex items-center justify-center active:scale-95 text-xs transition-all"
                title="Decrease completions"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="font-mono text-xs font-bold text-white w-6 text-center tabular-nums">
                {routine.completionCount || 1}
              </span>
              <button
                type="button"
                onClick={() => onUpdateCompletionCount((routine.completionCount || 1) + 1)}
                className="w-7 h-7 rounded-lg bg-[#111520] hover:bg-white/[0.08] text-slate-300 hover:text-white flex items-center justify-center active:scale-95 text-xs transition-all"
                title="Increase completions"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        {/* 2x2 Bento Performance Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Tile 1: Total Time */}
          <div className="bg-[#111520] border border-white/[0.08] rounded-2xl p-4">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider">
                TOTAL TIME
              </span>
              <Clock className="w-3.5 h-3.5" />
            </div>
            <div className="font-mono text-xl font-extrabold text-white tabular-nums">
              {formatTimeDigits(totalElapsedSeconds)}
            </div>
            <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 mt-1">
              ✓ Target Met
            </span>
          </div>

          {/* Tile 2: Stages */}
          <div className="bg-[#111520] border border-white/[0.08] rounded-2xl p-4">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider">
                STAGES
              </span>
              <Flag className="w-3.5 h-3.5" />
            </div>
            <div className="font-mono text-xl font-extrabold text-white flex items-center gap-1.5">
              <span>{totalStages} of {totalStages}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </div>
            <span className="text-[10px] font-mono text-slate-400 block mt-1">
              Zero stages skipped
            </span>
          </div>

          {/* Tile 3: Cycles Completed or Avg Pace */}
          {totalCyclesCompleted > 0 ? (
            <div className="bg-[#111520] border border-amber-500/30 rounded-2xl p-4">
              <div className="flex items-center justify-between text-amber-400 mb-1">
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider">
                  CYCLES COMPLETED
                </span>
                <Repeat className="w-3.5 h-3.5" />
              </div>
              <div className="font-mono text-xl font-extrabold text-white tabular-nums">
                {totalCyclesCompleted} {totalCyclesCompleted === 1 ? 'Cycle' : 'Cycles'}
              </div>
              <span className="text-[10px] font-mono text-amber-400 block mt-1">
                Loop rhythm finished
              </span>
            </div>
          ) : (
            <div className="bg-[#111520] border border-white/[0.08] rounded-2xl p-4">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider">
                  AVG PACE
                </span>
                <Award className="w-3.5 h-3.5" />
              </div>
              <div className="font-mono text-xl font-extrabold text-white tabular-nums">
                {formatDurationHuman(avgStageSeconds)}
              </div>
              <span className="text-[10px] font-mono text-slate-400 block mt-1">
                Even pacing index
              </span>
            </div>
          )}

          {/* Tile 4: Audio Cues */}
          <div className="bg-[#111520] border border-white/[0.08] rounded-2xl p-4">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider">
                AUDIO CUES
              </span>
              <Bell className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="font-mono text-xl font-extrabold text-white">
              {totalStages} Cues
            </div>
            <span className="text-[10px] font-mono text-slate-400 block mt-1">
              Announcements done
            </span>
          </div>
        </div>

        {/* Stage Breakdown Card */}
        <div className="bg-[#111520] border border-white/[0.08] rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3 border-b border-white/[0.06] pb-2">
            <span className="font-mono text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              STAGE BREAKDOWN
            </span>
            <span className="font-mono text-[10px] font-bold text-amber-400 uppercase tracking-widest">
              ALL VERIFIED
            </span>
          </div>

          <div className="space-y-2">
            {routine.stages.map((stage, idx) => (
              <div key={stage.id || idx} className="flex items-center justify-between text-xs py-1">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="text-slate-200 font-medium">
                    {idx + 1}. {stage.title}
                  </span>
                </div>
                <span className="font-mono text-slate-400 tabular-nums">
                  {formatTimeDigits(stage.durationSeconds)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-2">
          <button
            onClick={onDone}
            className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 active:scale-[0.98] text-black font-bold text-sm tracking-wide flex items-center justify-center gap-2 shadow-xl shadow-amber-500/25 transition-all"
          >
            <span>Done & Return Home</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>

          <button
            onClick={onRepeat}
            className="w-full py-3.5 rounded-2xl bg-[#111520] hover:bg-[#192030] active:scale-[0.98] text-slate-300 hover:text-white border border-white/[0.08] font-medium text-xs flex items-center justify-center gap-2 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Run Routine Again</span>
          </button>
        </div>
      </div>
    </div>
  );
};
