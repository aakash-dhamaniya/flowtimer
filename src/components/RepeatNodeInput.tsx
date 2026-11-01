import React, { useState } from 'react';
import {
  Repeat,
  Trash2,
  ChevronUp,
  ChevronDown,
  GripVertical,
  Plus,
  Minus,
  Infinity as InfinityIcon,
  Wind,
} from 'lucide-react';
import { Stage } from '../types/meditation';
import { formatTimeDigits, formatDurationHuman } from '../utils/timeUtils';
import { TimePickerModal } from './TimePickerModal';

interface RepeatNodeInputProps {
  stage: Stage;
  index: number;
  totalStages: number;
  onChange: (updatedStage: Stage) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

const DEFAULT_CHILD_STAGE = (title = 'Inhale', durationSeconds = 4): Stage => ({
  id: 'step-' + Math.random().toString(36).substring(2, 9),
  title,
  durationSeconds,
  chimeType: 'bell',
  speakTitle: true,
});

export const RepeatNodeInput: React.FC<RepeatNodeInputProps> = ({
  stage,
  index,
  totalStages,
  onChange,
  onDelete,
  onMoveUp,
  onMoveDown,
}) => {
  const [pickerChildIdx, setPickerChildIdx] = useState<number | null>(null);

  const nestedStages = stage.nestedStages || [];
  const repeatMode = stage.repeatMode || 'count';
  const repeatCount = stage.repeatCount || 4;

  const cycleDuration = nestedStages.reduce(
    (sum, s) => sum + (s.durationSeconds || 0),
    0
  );
  const totalRepeatSeconds =
    repeatMode === 'unlimited' ? cycleDuration : cycleDuration * repeatCount;

  const handleUpdate = (patch: Partial<Stage>) => {
    onChange({
      ...stage,
      ...patch,
      durationSeconds: cycleDuration,
    });
  };

  const handleAddChildStage = (title = 'Inhale', durationSeconds = 4) => {
    const updated = [...nestedStages, DEFAULT_CHILD_STAGE(title, durationSeconds)];
    onChange({
      ...stage,
      nestedStages: updated,
      durationSeconds: updated.reduce((s, st) => s + st.durationSeconds, 0),
    });
  };

  const handleUpdateChildStage = (childIdx: number, updatedChild: Stage) => {
    const next = [...nestedStages];
    next[childIdx] = updatedChild;
    onChange({
      ...stage,
      nestedStages: next,
      durationSeconds: next.reduce((s, st) => s + st.durationSeconds, 0),
    });
  };

  const handleDeleteChildStage = (childIdx: number) => {
    if (nestedStages.length <= 1) return;
    const next = nestedStages.filter((_, i) => i !== childIdx);
    onChange({
      ...stage,
      nestedStages: next,
      durationSeconds: next.reduce((s, st) => s + st.durationSeconds, 0),
    });
  };

  const handleMoveChildStage = (fromIdx: number, toIdx: number) => {
    if (toIdx < 0 || toIdx >= nestedStages.length) return;
    const next = [...nestedStages];
    const [moved] = next.splice(fromIdx, 1);
    next.splice(toIdx, 0, moved);
    onChange({
      ...stage,
      nestedStages: next,
    });
  };

  const apply478Template = () => {
    const stages478: Stage[] = [
      DEFAULT_CHILD_STAGE('Inhale', 4),
      DEFAULT_CHILD_STAGE('Hold', 7),
      DEFAULT_CHILD_STAGE('Exhale', 8),
    ];
    onChange({
      ...stage,
      title: stage.title || '4-7-8 Breathing Loop',
      nestedStages: stages478,
      durationSeconds: 19,
      repeatMode: 'count',
      repeatCount: 4,
    });
  };

  const applyBoxBreathingTemplate = () => {
    const boxStages: Stage[] = [
      DEFAULT_CHILD_STAGE('Inhale', 4),
      DEFAULT_CHILD_STAGE('Hold', 4),
      DEFAULT_CHILD_STAGE('Exhale', 4),
      DEFAULT_CHILD_STAGE('Hold', 4),
    ];
    onChange({
      ...stage,
      title: stage.title || 'Box Breathing Loop',
      nestedStages: boxStages,
      durationSeconds: 16,
      repeatMode: 'unlimited',
    });
  };

  return (
    <div className="bg-[#121726] border-2 border-amber-500/40 rounded-2xl p-4 transition-all shadow-lg shadow-black/40 relative overflow-hidden">
      {/* Visual Accent Glow on left edge */}
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-amber-400 to-amber-600" />

      {/* Header Row */}
      <div className="flex items-center justify-between mb-3 pl-1">
        <div className="flex items-center gap-2">
          <GripVertical className="w-4 h-4 text-slate-500 cursor-grab" />
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono text-[11px] font-bold uppercase tracking-wider">
            <Repeat className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
            <span>REPEAT NODE (STAGE {index + 1})</span>
          </div>
        </div>

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
            title="Remove Repeat Node"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Repeat Node Title */}
      <div className="mb-3.5">
        <input
          type="text"
          value={stage.title}
          onChange={(e) => handleUpdate({ title: e.target.value })}
          placeholder="Repeat Node Name (e.g. 4-7-8 Breath Loop, Box Breathing)"
          className="w-full bg-[#192030] border border-amber-500/30 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-white placeholder-slate-500 outline-none transition-all"
        />
      </div>

      {/* Repeat Mode Switcher */}
      <div className="bg-[#192030]/80 border border-white/[0.08] rounded-xl p-2.5 mb-3.5">
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            LOOP REPETITION MODE
          </span>
          <span className="font-mono text-span text-[11px] font-bold text-amber-400">
            {repeatMode === 'unlimited' ? '∞ UNLIMITED' : `${repeatCount} CYCLES`}
          </span>
        </div>

        {/* Segmented Toggle */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-[#111520] rounded-lg border border-white/[0.06] mb-3">
          <button
            type="button"
            onClick={() => handleUpdate({ repeatMode: 'count' })}
            className={`py-2 px-3 rounded-md text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all ${
              repeatMode === 'count'
                ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>REPEAT COUNT</span>
          </button>

          <button
            type="button"
            onClick={() => handleUpdate({ repeatMode: 'unlimited' })}
            className={`py-2 px-3 rounded-md text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all ${
              repeatMode === 'unlimited'
                ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <InfinityIcon className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>UNLIMITED (UNTIL STOPPED)</span>
          </button>
        </div>

        {/* Count Stepper & Chips if repeatMode === 'count' */}
        {repeatMode === 'count' ? (
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-300">Number of cycles:</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleUpdate({ repeatCount: Math.max(1, repeatCount - 1) })}
                  className="w-8 h-8 rounded-lg bg-[#111520] border border-white/[0.1] hover:border-amber-500/40 text-slate-300 hover:text-white flex items-center justify-center active:scale-95"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>

                <span className="font-mono text-base font-extrabold text-white w-12 text-center tabular-nums">
                  {repeatCount}
                </span>

                <button
                  type="button"
                  onClick={() => handleUpdate({ repeatCount: Math.min(100, repeatCount + 1) })}
                  className="w-8 h-8 rounded-lg bg-[#111520] border border-white/[0.1] hover:border-amber-500/40 text-slate-300 hover:text-white flex items-center justify-center active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Quick Cycle Chips */}
            <div className="flex items-center gap-2 pt-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase">PRESET:</span>
              {[2, 4, 8, 10, 16].map((cnt) => (
                <button
                  key={cnt}
                  type="button"
                  onClick={() => handleUpdate({ repeatCount: cnt })}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-bold transition-all ${
                    repeatCount === cnt
                      ? 'bg-amber-500/25 border border-amber-400 text-amber-300'
                      : 'bg-[#111520] text-slate-400 hover:text-white border border-white/[0.06]'
                  }`}
                >
                  {cnt}x
                </button>
              ))}
            </div>

            <p className="text-[11px] text-slate-400 font-mono pt-1">
              Loops {repeatCount} times ({formatDurationHuman(totalRepeatSeconds)} total) then advances.
            </p>
          </div>
        ) : (
          <div className="flex items-center gap-2.5 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs">
            <InfinityIcon className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>
              Runs continuously until you tap <strong>Stop / Done</strong> in the player ({formatTimeDigits(cycleDuration)} per cycle).
            </span>
          </div>
        )}
      </div>

      {/* Nested Steps Section */}
      <div className="border-t border-white/[0.08] pt-3">
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <Wind className="w-3.5 h-3.5" />
            <span>STEPS IN THIS LOOP ({nestedStages.length})</span>
          </span>
          <span className="font-mono text-[11px] text-slate-400">
            1 cycle = <strong className="text-white">{formatTimeDigits(cycleDuration)}</strong>
          </span>
        </div>

        {/* Quick Breath Template Shortcuts */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          <button
            type="button"
            onClick={apply478Template}
            className="px-2.5 py-1 rounded bg-[#192030] hover:bg-amber-500/20 hover:text-amber-300 border border-white/[0.08] text-[10px] font-mono font-semibold text-slate-300 active:scale-95 transition-all"
          >
            ⚡ Apply 4-7-8 Breath
          </button>
          <button
            type="button"
            onClick={applyBoxBreathingTemplate}
            className="px-2.5 py-1 rounded bg-[#192030] hover:bg-emerald-500/20 hover:text-emerald-300 border border-white/[0.08] text-[10px] font-mono font-semibold text-slate-300 active:scale-95 transition-all"
          >
            ⚡ Apply Box Breath (4-4-4-4)
          </button>
        </div>

        {/* Nested Stages List */}
        <div className="space-y-2 mb-3">
          {nestedStages.map((child, cIdx) => (
            <div
              key={child.id || cIdx}
              className="bg-[#192030] border border-white/[0.08] rounded-xl p-2.5 flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap"
            >
              <div className="flex items-center gap-2 flex-1 min-w-[120px]">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-mono font-bold flex items-center justify-center shrink-0">
                  {cIdx + 1}
                </span>

                <input
                  type="text"
                  value={child.title}
                  onChange={(e) =>
                    handleUpdateChildStage(cIdx, { ...child, title: e.target.value })
                  }
                  placeholder="Step title (e.g. Inhale, Hold, Exhale)"
                  className="bg-transparent border-b border-transparent focus:border-amber-400/50 text-xs font-semibold text-white placeholder-slate-500 outline-none flex-1 min-w-0 py-0.5"
                />
              </div>

              {/* Step Duration Stepper & One-Tap chips */}
              <div className="flex flex-col items-end gap-1.5 shrink-0">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() =>
                      handleUpdateChildStage(cIdx, {
                        ...child,
                        durationSeconds: Math.max(1, child.durationSeconds - 1),
                      })
                    }
                    className="w-7 h-7 rounded bg-[#111520] hover:bg-white/[0.08] text-slate-300 hover:text-white flex items-center justify-center text-[10px] font-bold active:scale-95 transition-all"
                    title="Minus 1s"
                  >
                    -1s
                  </button>

                  <button
                    type="button"
                    onClick={() => setPickerChildIdx(cIdx)}
                    className="px-2.5 py-1 rounded bg-[#111520] border border-amber-500/30 text-amber-300 font-mono text-xs font-bold hover:bg-amber-500/20 active:scale-95 transition-all"
                    title="Tap to change duration"
                  >
                    {child.durationSeconds}s
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleUpdateChildStage(cIdx, {
                        ...child,
                        durationSeconds: child.durationSeconds + 1,
                      })
                    }
                    className="w-7 h-7 rounded bg-[#111520] hover:bg-white/[0.08] text-slate-300 hover:text-white flex items-center justify-center text-[10px] font-bold active:scale-95 transition-all"
                    title="Plus 1s"
                  >
                    +1s
                  </button>

                  {/* Move & Delete */}
                  <div className="flex items-center ml-1 border-l border-white/[0.08] pl-1">
                    {cIdx > 0 && (
                      <button
                        type="button"
                        onClick={() => handleMoveChildStage(cIdx, cIdx - 1)}
                        className="p-1 text-slate-500 hover:text-white"
                        title="Move Up"
                      >
                        <ChevronUp className="w-3 h-3" />
                      </button>
                    )}
                    {cIdx < nestedStages.length - 1 && (
                      <button
                        type="button"
                        onClick={() => handleMoveChildStage(cIdx, cIdx + 1)}
                        className="p-1 text-slate-500 hover:text-white"
                        title="Move Down"
                      >
                        <ChevronDown className="w-3 h-3" />
                      </button>
                    )}
                    {nestedStages.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleDeleteChildStage(cIdx)}
                        className="p-1 text-slate-500 hover:text-rose-400"
                        title="Delete Step"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Fast Breath Preset Chips: 4s, 7s, 8s, 16s */}
                <div className="flex items-center gap-1">
                  {[4, 7, 8, 16].map((sec) => (
                    <button
                      key={sec}
                      type="button"
                      onClick={() =>
                        handleUpdateChildStage(cIdx, {
                          ...child,
                          durationSeconds: sec,
                        })
                      }
                      className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold transition-all active:scale-95 ${
                        child.durationSeconds === sec
                          ? 'bg-amber-500 text-black shadow-sm'
                          : 'bg-[#111520] text-slate-400 hover:text-white border border-white/[0.06]'
                      }`}
                    >
                      {sec}s
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Step to Loop + Quick Steps */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => handleAddChildStage('Hold', 4)}
            className="py-1.5 px-3 rounded-lg border border-dashed border-amber-500/40 hover:border-amber-400 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-mono text-xs font-bold flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>ADD STEP</span>
          </button>

          <button
            type="button"
            onClick={() => handleAddChildStage('Inhale', 4)}
            className="py-1 px-2 rounded bg-[#192030] hover:bg-white/[0.08] text-slate-300 font-mono text-[11px] transition-all"
          >
            + Inhale 4s
          </button>
          <button
            type="button"
            onClick={() => handleAddChildStage('Hold', 7)}
            className="py-1 px-2 rounded bg-[#192030] hover:bg-white/[0.08] text-slate-300 font-mono text-[11px] transition-all"
          >
            + Hold 7s
          </button>
          <button
            type="button"
            onClick={() => handleAddChildStage('Exhale', 8)}
            className="py-1 px-2 rounded bg-[#192030] hover:bg-white/[0.08] text-slate-300 font-mono text-[11px] transition-all"
          >
            + Exhale 8s
          </button>
          <button
            type="button"
            onClick={() => handleAddChildStage('Hold', 4)}
            className="py-1 px-2 rounded bg-[#192030] hover:bg-white/[0.08] text-slate-300 font-mono text-[11px] transition-all"
          >
            + Hold 4s
          </button>
        </div>
      </div>

      {/* Child Step TimePickerModal */}
      {pickerChildIdx !== null && nestedStages[pickerChildIdx] && (
        <TimePickerModal
          isOpen={true}
          title={`Set Duration: ${nestedStages[pickerChildIdx].title || `Step ${pickerChildIdx + 1}`}`}
          initialSeconds={nestedStages[pickerChildIdx].durationSeconds}
          onSave={(newSecs) => {
            handleUpdateChildStage(pickerChildIdx, {
              ...nestedStages[pickerChildIdx],
              durationSeconds: newSecs,
            });
            setPickerChildIdx(null);
          }}
          onClose={() => setPickerChildIdx(null)}
        />
      )}
    </div>
  );
};
