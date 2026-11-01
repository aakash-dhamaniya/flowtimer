import React, { useState } from 'react';
import { Trash2, ChevronUp, ChevronDown, GripVertical, Bell, Plus, Minus, Clock } from 'lucide-react';
import { Stage } from '../types/meditation';
import { formatTimeDigits } from '../utils/timeUtils';
import { TimePickerModal } from './TimePickerModal';

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
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const handleStepSeconds = (delta: number) => {
    onChange({
      ...stage,
      durationSeconds: Math.max(1, stage.durationSeconds + delta),
    });
  };

  const ONE_TAP_PRESETS = [
    { label: '4s', sec: 4 },
    { label: '7s', sec: 7 },
    { label: '8s', sec: 8 },
    { label: '15s', sec: 15 },
    { label: '30s', sec: 30 },
    { label: '1m', sec: 60 },
    { label: '2m', sec: 120 },
    { label: '5m', sec: 300 },
  ];

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
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 mb-2.5">
        {/* Stage Name */}
        <div className="sm:col-span-3">
          <input
            type="text"
            value={stage.title}
            onChange={(e) => onChange({ ...stage, title: e.target.value })}
            placeholder="Stage name (e.g. Inhale, Warmup, Hold)"
            className="w-full bg-[#192030] border border-white/[0.08] focus:border-amber-500/50 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-all"
          />
        </div>

        {/* Tactile Duration Stepper & Time Pill */}
        <div className="sm:col-span-2 flex items-center justify-between bg-[#192030] border border-white/[0.08] hover:border-amber-500/30 rounded-xl p-1 gap-1 transition-all">
          {/* -1s button */}
          <button
            type="button"
            onClick={() => handleStepSeconds(-1)}
            className="w-8 h-8 rounded-lg bg-[#111520] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 hover:text-white flex items-center justify-center active:scale-95 transition-all text-xs"
            title="Decrease 1 second"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>

          {/* Time Display Button - Tap to open Full TimePicker */}
          <button
            type="button"
            onClick={() => setIsPickerOpen(true)}
            className="flex-1 flex items-center justify-center gap-1.5 py-1 px-2 rounded-lg bg-[#111520] hover:bg-amber-500/20 border border-amber-500/25 text-amber-300 font-mono text-sm font-bold tabular-nums active:scale-95 transition-all group"
            title="Tap to change duration"
          >
            <Clock className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
            <span>{formatTimeDigits(stage.durationSeconds)}</span>
          </button>

          {/* +1s button */}
          <button
            type="button"
            onClick={() => handleStepSeconds(1)}
            className="w-8 h-8 rounded-lg bg-[#111520] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 hover:text-white flex items-center justify-center active:scale-95 transition-all text-xs"
            title="Increase 1 second"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* One-Tap Quick Presets Row (Breathwork & Standard Times) */}
      <div className="space-y-2 pt-2 border-t border-white/[0.05]">
        <div className="flex items-center gap-1 flex-wrap">
          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase mr-1">
            ONE-TAP:
          </span>
          {ONE_TAP_PRESETS.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => onChange({ ...stage, durationSeconds: item.sec })}
              className={`px-2 py-1 rounded-md text-[11px] font-mono font-bold transition-all active:scale-95 ${
                stage.durationSeconds === item.sec
                  ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                  : 'bg-[#192030] text-slate-300 hover:text-white border border-white/[0.06] hover:border-amber-500/30'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Additional Increments & Cues */}
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-slate-500">ADD:</span>
            <button
              type="button"
              onClick={() => handleStepSeconds(5)}
              className="px-1.5 py-0.5 rounded bg-[#192030] hover:bg-white/[0.08] text-slate-300 text-[10px] font-semibold active:scale-95"
            >
              +5s
            </button>
            <button
              type="button"
              onClick={() => handleStepSeconds(15)}
              className="px-1.5 py-0.5 rounded bg-[#192030] hover:bg-white/[0.08] text-slate-300 text-[10px] font-semibold active:scale-95"
            >
              +15s
            </button>
            <button
              type="button"
              onClick={() => handleStepSeconds(60)}
              className="px-1.5 py-0.5 rounded bg-[#192030] hover:bg-white/[0.08] text-slate-300 text-[10px] font-semibold active:scale-95"
            >
              +1m
            </button>
          </div>

          <div className="flex items-center gap-1">
            <Bell className="w-3 h-3 text-amber-500" />
            <span>BELL + VOICE</span>
          </div>
        </div>
      </div>

      {/* Modal for full picker if user wants custom minutes / seconds */}
      <TimePickerModal
        isOpen={isPickerOpen}
        title={`Set Duration: ${stage.title || `Stage ${index + 1}`}`}
        initialSeconds={stage.durationSeconds}
        onSave={(newSecs) => onChange({ ...stage, durationSeconds: newSecs })}
        onClose={() => setIsPickerOpen(false)}
      />
    </div>
  );
};
