import React, { useState } from 'react';
import {
  Play,
  MoreVertical,
  Edit2,
  Copy,
  Trash2,
  Clock,
  Repeat,
  Trophy,
  Minus,
  Plus,
  RotateCcw,
  X,
  Check,
} from 'lucide-react';
import { Routine } from '../types/meditation';
import {
  formatTimeDigits,
  calculateTotalDuration,
  isRoutineUnlimited,
  getNodeDuration,
} from '../utils/timeUtils';

interface RoutineCardProps {
  routine: Routine;
  onStart: (routine: Routine) => void;
  onEdit: (routine: Routine) => void;
  onDuplicate: (routine: Routine) => void;
  onDelete: (routineId: string) => void;
  onToggleFavorite?: (routineId: string) => void;
  onUpdateCompletionCount?: (routineId: string, count: number) => void;
}

export const RoutineCard: React.FC<RoutineCardProps> = ({
  routine,
  onStart,
  onEdit,
  onDuplicate,
  onDelete,
  onUpdateCompletionCount,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isEditingCount, setIsEditingCount] = useState(false);
  const [tempCount, setTempCount] = useState(routine.completionCount || 0);

  const totalSeconds = calculateTotalDuration(routine.stages);
  const isUnlimited = isRoutineUnlimited(routine.stages);
  const repeatNodesCount = routine.stages.filter((s) => s.type === 'repeat').length;
  const completions = routine.completionCount || 0;

  const handleOpenEditCount = () => {
    setTempCount(routine.completionCount || 0);
    setIsEditingCount(true);
    setShowMenu(false);
  };

  const handleSaveCount = () => {
    if (onUpdateCompletionCount) {
      onUpdateCompletionCount(routine.id, Math.max(0, tempCount));
    }
    setIsEditingCount(false);
  };

  return (
    <div className="relative bg-[#111520] hover:bg-[#141926] border border-white/[0.08] hover:border-white/[0.16] rounded-2xl p-4 sm:p-5 transition-all duration-200 shadow-xl shadow-black/40">
      {/* Top Header Row: Status Badge & Execution Triggers */}
      <div className="flex items-start justify-between gap-3 mb-2.5">
        <div>
          {/* Status Badges Row: Ready + Completion Count */}
          <div className="flex flex-wrap items-center gap-1.5 mb-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>
                READY • {routine.stages.length} {routine.stages.length === 1 ? 'NODE' : 'NODES'}
                {repeatNodesCount > 0 ? ` (${repeatNodesCount} LOOP)` : ''}
              </span>
            </div>

            {/* Interactive Completion Count Badge */}
            <button
              type="button"
              onClick={handleOpenEditCount}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/25 hover:border-amber-500/50 text-amber-300 font-mono text-[10px] font-bold tracking-wider uppercase transition-all active:scale-95 group"
              title="Click to edit completion count"
            >
              <Trophy className="w-3 h-3 text-amber-400 group-hover:scale-110 transition-transform" />
              <span>{completions} {completions === 1 ? 'COMPLETED' : 'COMPLETED'}</span>
            </button>
          </div>

          {/* Title */}
          <h3 className="text-[19px] font-bold text-white tracking-tight leading-snug">
            {routine.title}
          </h3>
        </div>

        {/* Action Buttons: 3-dot options + Amber Play Button */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="w-9 h-9 rounded-full bg-[#192030] border border-white/[0.08] flex items-center justify-center text-slate-400 hover:text-white hover:border-white/[0.2] transition-colors active:scale-95"
              aria-label="Routine options"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 top-10 z-50 w-48 bg-[#192030] border border-white/[0.14] rounded-xl shadow-2xl py-1 text-xs backdrop-blur-md">
                  <button
                    onClick={() => {
                      onEdit(routine);
                      setShowMenu(false);
                    }}
                    className="w-full px-3.5 py-2.5 text-left text-slate-200 hover:bg-white/[0.08] flex items-center gap-2.5 font-medium transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-amber-400" />
                    Edit Routine
                  </button>
                  <button
                    onClick={handleOpenEditCount}
                    className="w-full px-3.5 py-2.5 text-left text-slate-200 hover:bg-white/[0.08] flex items-center gap-2.5 font-medium transition-colors"
                  >
                    <Trophy className="w-3.5 h-3.5 text-amber-400" />
                    Edit Completions ({completions})
                  </button>
                  <button
                    onClick={() => {
                      onDuplicate(routine);
                      setShowMenu(false);
                    }}
                    className="w-full px-3.5 py-2.5 text-left text-slate-200 hover:bg-white/[0.08] flex items-center gap-2.5 font-medium transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5 text-emerald-400" />
                    Duplicate
                  </button>
                  <div className="border-t border-white/[0.08] my-1" />
                  <button
                    onClick={() => {
                      onDelete(routine.id);
                      setShowMenu(false);
                    }}
                    className="w-full px-3.5 py-2.5 text-left text-rose-400 hover:bg-rose-950/40 flex items-center gap-2.5 font-medium transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Tactile Amber Play Button */}
          <button
            onClick={() => onStart(routine)}
            className="w-11 h-11 rounded-full bg-amber-500 hover:bg-amber-400 active:scale-90 text-black flex items-center justify-center shadow-lg shadow-amber-500/25 transition-all"
            title="Start Routine"
          >
            <Play className="w-5 h-5 fill-black ml-0.5" />
          </button>
        </div>
      </div>

      {/* Proportional Segmented Progress Track */}
      {routine.stages.length > 0 && (
        <div className="w-full h-1.5 rounded-full bg-[#192030] flex gap-1 overflow-hidden my-3.5">
          {routine.stages.map((stage, idx) => {
            const info = getNodeDuration(stage);
            const weight = totalSeconds > 0 ? (info.duration / totalSeconds) * 100 : 100;
            const opacity = Math.max(0.4, 1 - idx * 0.18);
            const isRepeat = stage.type === 'repeat';
            return (
              <div
                key={stage.id || idx}
                style={{
                  width: `${Math.max(8, weight)}%`,
                  backgroundColor: isRepeat ? '#F59E0B' : '#38BDF8',
                  opacity: opacity,
                }}
                className="h-full rounded-sm"
                title={`${stage.title}: ${formatTimeDigits(stage.durationSeconds)}`}
              />
            );
          })}
        </div>
      )}

      {/* Stage Sequence Chain Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-1 no-scrollbar mb-3 text-xs">
        {routine.stages.map((stage, idx) => (
          <React.Fragment key={stage.id || idx}>
            {stage.type === 'repeat' ? (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 shrink-0 font-mono text-[11px]">
                <Repeat className="w-3 h-3 text-amber-400" />
                <span className="font-sans font-medium text-white">
                  {idx + 1}. {stage.title}
                </span>
                <span className="text-amber-400 font-bold tabular-nums">
                  {stage.repeatMode === 'unlimited' ? '∞' : `${stage.repeatCount || 4}x`} ({formatTimeDigits(stage.durationSeconds)})
                </span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#192030] border border-white/[0.06] text-slate-300 shrink-0 font-mono text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                <span className="font-sans font-medium text-slate-200">
                  {idx + 1}. {stage.title}
                </span>
                <span className="text-amber-400 font-bold tabular-nums">
                  {formatTimeDigits(stage.durationSeconds)}
                </span>
              </div>
            )}
            {idx < routine.stages.length - 1 && (
              <span className="text-slate-600 font-mono text-xs px-0.5 shrink-0">›</span>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Card Footer: Total Duration */}
      <div className="flex items-center justify-between pt-2 border-t border-white/[0.06] text-xs">
        <span className="flex items-center gap-1.5 text-slate-400 font-mono text-[10px] tracking-wider uppercase">
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          TOTAL DURATION
        </span>
        <div className="font-mono text-[13px] font-bold text-white bg-[#080A0F] px-2.5 py-1 rounded border border-white/[0.08] tabular-nums tracking-wide">
          {isUnlimited ? '∞ UNLIMITED' : `${formatTimeDigits(totalSeconds)}.00`}
        </div>
      </div>

      {/* Quick Edit Completion Count Modal */}
      {isEditingCount && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className="fixed inset-0"
            onClick={() => setIsEditingCount(false)}
          />
          <div className="relative bg-[#111520] border border-white/[0.14] rounded-2xl p-5 max-w-xs w-full shadow-2xl z-10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                <h4 className="text-sm font-bold text-white tracking-tight">
                  Edit Completions
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setIsEditingCount(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/[0.06] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400 truncate">
              {routine.title}
            </p>

            {/* Stepper Control */}
            <div className="flex items-center justify-center gap-3 py-2 bg-[#192030] rounded-xl border border-white/[0.06]">
              <button
                type="button"
                onClick={() => setTempCount((c) => Math.max(0, c - 1))}
                className="w-10 h-10 rounded-lg bg-[#111520] hover:bg-white/[0.08] border border-white/[0.1] text-slate-200 hover:text-white flex items-center justify-center active:scale-95 transition-all"
              >
                <Minus className="w-4 h-4" />
              </button>

              <input
                type="number"
                min="0"
                max="99999"
                value={tempCount}
                onChange={(e) => setTempCount(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-20 text-center bg-transparent font-mono text-2xl font-extrabold text-white outline-none tabular-nums"
              />

              <button
                type="button"
                onClick={() => setTempCount((c) => c + 1)}
                className="w-10 h-10 rounded-lg bg-[#111520] hover:bg-white/[0.08] border border-white/[0.1] text-slate-200 hover:text-white flex items-center justify-center active:scale-95 transition-all"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Adjustment Chips */}
            <div className="flex items-center justify-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setTempCount((c) => c + 1)}
                className="px-2.5 py-1 rounded-md bg-[#192030] hover:bg-white/[0.08] text-slate-300 font-mono text-xs font-semibold border border-white/[0.06] active:scale-95"
              >
                +1
              </button>
              <button
                type="button"
                onClick={() => setTempCount((c) => c + 5)}
                className="px-2.5 py-1 rounded-md bg-[#192030] hover:bg-white/[0.08] text-slate-300 font-mono text-xs font-semibold border border-white/[0.06] active:scale-95"
              >
                +5
              </button>
              <button
                type="button"
                onClick={() => setTempCount(0)}
                className="px-2.5 py-1 rounded-md bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 font-mono text-xs font-semibold border border-rose-500/20 active:scale-95 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center gap-2 pt-2 border-t border-white/[0.08]">
              <button
                type="button"
                onClick={() => setIsEditingCount(false)}
                className="flex-1 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveCount}
                className="flex-1 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-mono text-xs font-bold uppercase tracking-wider active:scale-95 transition-all flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20"
              >
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Save</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
