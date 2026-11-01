import React from 'react';
import { Trash2, ChevronUp, ChevronDown, GripVertical, Bell, Plus } from 'lucide-react';
import { Stage } from '../types/meditation';

interface StageItemInputProps {
  stage: Stage;
  index: number;
  totalStages: number;
  onChange: (updatedStage: Stage) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

export const StageItemInput: React.FC<StageItemInputProps> = ({
  stage,
  index,
  totalStages,
  onChange,
  onDelete,
  onMoveUp,
  onMoveDown,
}) => {
  const minutes = Math.floor(stage.durationSeconds / 60);
  const seconds = stage.durationSeconds % 60;

  const handleAddDuration = (addedSecs: number) => {
    onChange({
      ...stage,
      durationSeconds: Math.max(1, stage.durationSeconds + addedSecs),
    });
  };

  const handleMinutesChange = (newMinutes: number) => {
    const validMins = Math.max(0, Math.min(180, isNaN(newMinutes) ? 0 : newMinutes));
    const total = validMins * 60 + seconds;
    onChange({
      ...stage,
      durationSeconds: Math.max(1, total),
    });
  };

  const handleSecondsChange = (newSecs: number) => {
    const validSecs = Math.max(0, Math.min(59, isNaN(newSecs) ? 0 : newSecs));
    const total = minutes * 60 + validSecs;
    onChange({
      ...stage,
      durationSeconds: Math.max(1, total),
    });
  };

  return (
    <div className="bg-[#111520] border border-white/[0.08] hover:border-white/[0.14] rounded-2xl p-4 transition-all">
      {/* Top Header of Stage Card */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <GripVertical className="w-4 h-4 text-slate-500 cursor-grab" />
          <span className="font-mono text-[11px] font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 uppercase">
            STAGE {index + 1}
          </span>
        </div>

        {/* Move up / down & Delete */}
        <div className="flex items-center gap-1">
          {index > 0 && (
            <button
              onClick={onMoveUp}
              className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/[0.06] transition-colors"
              title="Move Up"
            >
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
          )}
          {index < totalStages - 1 && (
            <button
              onClick={onMoveDown}
              className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/[0.06] transition-colors"
              title="Move Down"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={onDelete}
            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors ml-1"
            title="Remove Stage"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Stage Title and Duration Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-3">
        {/* Stage Name */}
        <div className="sm:col-span-2">
          <input
            type="text"
            value={stage.title}
            onChange={(e) => onChange({ ...stage, title: e.target.value })}
            placeholder="Stage name (e.g. Inhale, Warmup, Hold)"
            className="w-full bg-[#192030] border border-white/[0.08] focus:border-amber-500/50 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-all"
          />
        </div>

        {/* Duration Input / Stepper */}
        <div className="flex items-center gap-1.5 bg-[#192030] border border-white/[0.08] rounded-xl px-2.5 py-1.5">
          <div className="flex-1 flex items-center justify-center gap-1 font-mono text-sm">
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={minutes.toString()}
              onFocus={(e) => e.target.select()}
              onChange={(e) => {
                const num = parseInt(e.target.value.replace(/\D/g, ''), 10);
                handleMinutesChange(isNaN(num) ? 0 : num);
              }}
              className="w-8 bg-transparent text-center text-white font-bold outline-none tabular-nums"
              title="Minutes"
            />
            <span className="text-slate-500 font-bold">:</span>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={seconds.toString().padStart(2, '0')}
              onFocus={(e) => e.target.select()}
              onChange={(e) => {
                const num = parseInt(e.target.value.replace(/\D/g, ''), 10);
                handleSecondsChange(isNaN(num) ? 0 : num);
              }}
              className="w-8 bg-transparent text-center text-amber-300 font-bold outline-none tabular-nums"
              title="Seconds"
            />
          </div>
        </div>
      </div>

      {/* Quick Add Chips & Audio Cue info */}
      <div className="flex items-center justify-between pt-2 border-t border-white/[0.05] flex-wrap gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => handleAddDuration(5)}
            className="flex items-center gap-0.5 px-2 py-1 rounded bg-[#192030] hover:bg-white/[0.08] text-slate-300 font-mono text-[10px] font-semibold transition-all active:scale-95"
          >
            <Plus className="w-2.5 h-2.5" /> 5s
          </button>
          <button
            type="button"
            onClick={() => handleAddDuration(15)}
            className="flex items-center gap-0.5 px-2 py-1 rounded bg-[#192030] hover:bg-white/[0.08] text-slate-300 font-mono text-[10px] font-semibold transition-all active:scale-95"
          >
            <Plus className="w-2.5 h-2.5" /> 15s
          </button>
          <button
            type="button"
            onClick={() => handleAddDuration(30)}
            className="flex items-center gap-0.5 px-2 py-1 rounded bg-[#192030] hover:bg-white/[0.08] text-slate-300 font-mono text-[10px] font-semibold transition-all active:scale-95"
          >
            <Plus className="w-2.5 h-2.5" /> 30s
          </button>
          <button
            type="button"
            onClick={() => handleAddDuration(60)}
            className="flex items-center gap-0.5 px-2 py-1 rounded bg-[#192030] hover:bg-white/[0.08] text-slate-300 font-mono text-[10px] font-semibold transition-all active:scale-95"
          >
            <Plus className="w-2.5 h-2.5" /> 1m
          </button>
        </div>

        <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
          <Bell className="w-3 h-3 text-amber-500" />
          <span>BELL + VOICE</span>
        </div>
      </div>
    </div>
  );
};
