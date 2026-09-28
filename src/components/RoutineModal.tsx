import React, { useState, useEffect } from 'react';
import { Plus, AlertCircle, Edit3, Repeat, Trophy, Minus } from 'lucide-react';
import { Routine, Stage } from '../types/meditation';
import { StageItemInput } from './StageItemInput';
import { RepeatNodeInput } from './RepeatNodeInput';
import {
  calculateTotalDuration,
  formatDurationHuman,
  isRoutineUnlimited,
} from '../utils/timeUtils';

interface RoutineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (routine: Routine) => void;
  initialRoutine?: Routine | null;
}

const DEFAULT_NEW_STAGE = (title = '', durationSeconds = 300): Stage => ({
  id: 'stage-' + Math.random().toString(36).substring(2, 9),
  type: 'stage',
  title,
  durationSeconds,
  chimeType: 'bell',
  speakTitle: true,
});

const DEFAULT_NEW_REPEAT_NODE = (
  title = '4-7-8 Breathing Loop',
  mode: 'count' | 'unlimited' = 'count',
  count = 4,
  nestedStages?: Stage[]
): Stage => {
  const defaultSteps: Stage[] = nestedStages || [
    {
      id: 'step-1',
      title: 'Inhale',
      durationSeconds: 4,
      chimeType: 'bell',
      speakTitle: true,
    },
    {
      id: 'step-2',
      title: 'Hold',
      durationSeconds: 7,
      chimeType: 'bell',
      speakTitle: true,
    },
    {
      id: 'step-3',
      title: 'Exhale',
      durationSeconds: 8,
      chimeType: 'bell',
      speakTitle: true,
    },
  ];
  return {
    id: 'repeat-' + Math.random().toString(36).substring(2, 9),
    type: 'repeat',
    title,
    durationSeconds: defaultSteps.reduce((s, st) => s + st.durationSeconds, 0),
    chimeType: 'bell',
    speakTitle: true,
    repeatMode: mode,
    repeatCount: count,
    nestedStages: defaultSteps,
  };
};

const QUICK_INSERTS = [
  { name: 'WORK', duration: 45 },
  { name: 'REST', duration: 15 },
  { name: 'WARMUP', duration: 180 },
  { name: 'FOCUS', duration: 1500 },
  { name: 'CHANTING', duration: 300 },
  { name: 'STRETCH', duration: 300 },
];

export const RoutineModal: React.FC<RoutineModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialRoutine,
}) => {
  const [title, setTitle] = useState('');
  const [stages, setStages] = useState<Stage[]>([]);
  const [completionCount, setCompletionCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (initialRoutine) {
        setTitle(initialRoutine.title);
        setStages(JSON.parse(JSON.stringify(initialRoutine.stages)));
        setCompletionCount(initialRoutine.completionCount || 0);
      } else {
        setTitle('');
        setStages([DEFAULT_NEW_STAGE('Stage 1', 300)]);
        setCompletionCount(0);
      }
      setError(null);
    }
  }, [isOpen, initialRoutine]);

  if (!isOpen) return null;

  const handleAddStage = (stageTitle = '', duration = 300) => {
    setStages((prev) => [...prev, DEFAULT_NEW_STAGE(stageTitle, duration)]);
  };

  const handleAddRepeatNode = (
    title = 'Breathing Loop',
    mode: 'count' | 'unlimited' = 'count',
    count = 4,
    nestedStages?: Stage[]
  ) => {
    setStages((prev) => [
      ...prev,
      DEFAULT_NEW_REPEAT_NODE(title, mode, count, nestedStages),
    ]);
  };

  const handleUpdateStage = (index: number, updated: Stage) => {
    setStages((prev) => {
      const next = [...prev];
      next[index] = updated;
      return next;
    });
  };

  const handleDeleteStage = (index: number) => {
    if (stages.length <= 1) {
      setError('A routine requires at least 1 stage.');
      return;
    }
    setStages((prev) => prev.filter((_, i) => i !== index));
    setError(null);
  };

  const handleMoveStage = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= stages.length) return;
    setStages((prev) => {
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  };

  const handleSave = () => {
    if (!title.trim()) {
      setError('Please provide a title for this routine.');
      return;
    }

    const invalidStages = stages.some((s) => !s.title.trim());
    if (invalidStages) {
      setError('All stages and repeat nodes must have a name.');
      return;
    }

    const routineToSave: Routine = {
      id: initialRoutine?.id || 'routine-' + Date.now().toString(36),
      title: title.trim(),
      stages: stages.map((s) => ({ ...s, title: s.title.trim() })),
      createdAt: initialRoutine?.createdAt || Date.now(),
      updatedAt: Date.now(),
      isFavorite: initialRoutine?.isFavorite || false,
      completionCount: Math.max(0, completionCount),
      lastCompletedAt: initialRoutine?.lastCompletedAt,
    };

    onSave(routineToSave);
    onClose();
  };

  const totalSeconds = calculateTotalDuration(stages);
  const isUnlimited = isRoutineUnlimited(stages);

  return (
    <div
      className="fixed inset-0 z-50 bg-[#080A0F]/95 backdrop-blur-md flex flex-col"
      style={{
        paddingTop: 'var(--safe-top, env(safe-area-inset-top, 0px))',
        paddingBottom: 'var(--safe-bottom, env(safe-area-inset-bottom, 0px))',
      }}
    >
      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.08] bg-[#080A0F] shrink-0">
        <button
          onClick={onClose}
          className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
        >
          Cancel
        </button>

        <h2 className="text-base font-bold text-white tracking-tight">
          {initialRoutine ? 'Edit Routine' : 'New Routine'}
        </h2>

        <button
          onClick={handleSave}
          className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 active:scale-95 text-black font-mono text-xs font-bold uppercase tracking-wider transition-all"
        >
          SAVE ROUTINE
        </button>
      </div>

      {/* Main Form Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-4 py-5 max-w-md w-full mx-auto space-y-5 pb-28">
        {/* Error Alert */}
        {error && (
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-medium">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Routine Title Field */}
        <div className="bg-[#111520] border border-white/[0.08] rounded-2xl p-4">
          <label className="block font-mono text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            ROUTINE TITLE
          </label>
          <div className="relative">
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError(null);
              }}
              placeholder="e.g., Morning Breathing & Core"
              className="w-full bg-[#192030] border border-white/[0.08] focus:border-amber-500/50 rounded-xl px-4 py-3 text-base font-semibold text-white placeholder-slate-500 outline-none transition-all pr-10"
              autoFocus={!initialRoutine}
            />
            <Edit3 className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Routine Completion Count Field */}
        <div className="bg-[#111520] border border-white/[0.08] rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <label className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>COMPLETION COUNT</span>
            </label>
            <span className="font-mono text-xs font-bold text-amber-400">
              {completionCount} {completionCount === 1 ? 'TIME' : 'TIMES'} COMPLETED
            </span>
          </div>

          <div className="flex items-center justify-between bg-[#192030] border border-white/[0.08] rounded-xl px-3 py-2">
            <span className="text-xs text-slate-400">
              Times completed:
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCompletionCount((c) => Math.max(0, c - 1))}
                className="w-8 h-8 rounded-lg bg-[#111520] hover:bg-white/[0.08] border border-white/[0.1] text-slate-200 hover:text-white flex items-center justify-center active:scale-95 transition-all"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>

              <input
                type="number"
                min="0"
                max="99999"
                value={completionCount}
                onChange={(e) => setCompletionCount(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-16 text-center bg-transparent font-mono text-base font-bold text-white outline-none tabular-nums"
              />

              <button
                type="button"
                onClick={() => setCompletionCount((c) => c + 1)}
                className="w-8 h-8 rounded-lg bg-[#111520] hover:bg-white/[0.08] border border-white/[0.1] text-slate-200 hover:text-white flex items-center justify-center active:scale-95 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 font-mono mt-2">
            Automatically increments when you complete this routine. You can also adjust it manually here.
          </p>
        </div>

        {/* Stages Sequence Section */}
        <div>
          <div className="flex items-center justify-between mb-1.5 px-1">
            <h3 className="text-sm font-bold text-white tracking-tight">
              Stages Sequence
            </h3>
            <span className="font-mono text-[10px] font-bold text-amber-400 uppercase tracking-widest bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              {stages.length} CONFIGURED
            </span>
          </div>
          <p className="text-xs text-slate-400 px-1 mb-3">
            Stages and repeat nodes run sequentially with automatic audio announcements.
          </p>

          {/* List of Stages & Repeat Nodes */}
          <div className="space-y-3">
            {stages.map((stage, idx) =>
              stage.type === 'repeat' ? (
                <RepeatNodeInput
                  key={stage.id}
                  stage={stage}
                  index={idx}
                  totalStages={stages.length}
                  onChange={(updated) => handleUpdateStage(idx, updated)}
                  onDelete={() => handleDeleteStage(idx)}
                  onMoveUp={() => handleMoveStage(idx, idx - 1)}
                  onMoveDown={() => handleMoveStage(idx, idx + 1)}
                />
              ) : (
                <StageItemInput
                  key={stage.id}
                  stage={stage}
                  index={idx}
                  totalStages={stages.length}
                  onChange={(updated) => handleUpdateStage(idx, updated)}
                  onDelete={() => handleDeleteStage(idx)}
                  onMoveUp={() => handleMoveStage(idx, idx - 1)}
                  onMoveDown={() => handleMoveStage(idx, idx + 1)}
                />
              )
            )}
          </div>

          {/* Add Next Stage or Repeat Node Buttons */}
          <div className="grid grid-cols-2 gap-2.5 mt-3.5">
            <button
              type="button"
              onClick={() => handleAddStage('', 300)}
              className="py-3.5 border-2 border-dashed border-white/[0.12] hover:border-white/[0.25] rounded-2xl flex items-center justify-center gap-2 text-slate-400 hover:text-white font-mono text-xs font-bold uppercase tracking-wider transition-all bg-[#111520]/40 hover:bg-[#111520]"
            >
              <Plus className="w-4 h-4" />
              <span>+ STAGE</span>
            </button>

            <button
              type="button"
              onClick={() => handleAddRepeatNode('Breathing Loop', 'count', 4)}
              className="py-3.5 border-2 border-dashed border-amber-500/40 hover:border-amber-400 rounded-2xl flex items-center justify-center gap-2 text-amber-400 hover:text-amber-300 font-mono text-xs font-bold uppercase tracking-wider transition-all bg-amber-500/10 hover:bg-amber-500/20 shadow-sm shadow-amber-500/10"
            >
              <Repeat className="w-4 h-4" />
              <span>+ REPEAT NODE</span>
            </button>
          </div>
        </div>

        {/* Quick Breathwork Loops Section */}
        <div className="bg-[#111520] border border-amber-500/25 rounded-2xl p-4">
          <label className="block font-mono text-[10px] font-bold text-amber-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <Repeat className="w-3.5 h-3.5" />
            <span>QUICK BREATHWORK LOOPS</span>
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() =>
                handleAddRepeatNode('4-7-8 Breathing', 'count', 4, [
                  { id: '478-in', title: 'Inhale', durationSeconds: 4, chimeType: 'bell', speakTitle: true },
                  { id: '478-hld', title: 'Hold', durationSeconds: 7, chimeType: 'bell', speakTitle: true },
                  { id: '478-exh', title: 'Exhale', durationSeconds: 8, chimeType: 'bell', speakTitle: true },
                ])
              }
              className="px-3 py-2 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 font-mono text-xs font-semibold transition-all active:scale-95 flex items-center gap-1.5"
            >
              <Repeat className="w-3 h-3" /> + 4-7-8 BREATH (4X)
            </button>

            <button
              type="button"
              onClick={() =>
                handleAddRepeatNode('Box Breathing', 'unlimited', 4, [
                  { id: 'box-in', title: 'Inhale', durationSeconds: 4, chimeType: 'bell', speakTitle: true },
                  { id: 'box-hld1', title: 'Hold', durationSeconds: 4, chimeType: 'bell', speakTitle: true },
                  { id: 'box-exh', title: 'Exhale', durationSeconds: 4, chimeType: 'bell', speakTitle: true },
                  { id: 'box-hld2', title: 'Hold', durationSeconds: 4, chimeType: 'bell', speakTitle: true },
                ])
              }
              className="px-3 py-2 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 font-mono text-xs font-semibold transition-all active:scale-95 flex items-center gap-1.5"
            >
              <Repeat className="w-3 h-3" /> + BOX BREATH (∞ UNLIMITED)
            </button>
          </div>
        </div>

        {/* Quick Insert Single Stage Chips */}
        <div className="bg-[#111520] border border-white/[0.08] rounded-2xl p-4">
          <label className="block font-mono text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
            QUICK INSERT SINGLE STAGE
          </label>
          <div className="flex flex-wrap gap-2">
            {QUICK_INSERTS.map((item) => (
              <button
                key={item.name}
                type="button"
                onClick={() => handleAddStage(item.name, item.duration)}
                className="px-3 py-1.5 rounded-lg bg-[#192030] hover:bg-amber-500/20 hover:text-amber-300 border border-white/[0.08] hover:border-amber-500/30 text-slate-300 font-mono text-xs font-semibold transition-all active:scale-95"
              >
                + {item.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky Bottom Duration Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#080A0F]/95 backdrop-blur-md border-t border-white/[0.08] px-5 py-3 flex items-center justify-between max-w-md mx-auto z-50">
        <div>
          <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider block">
            TOTAL DURATION
          </span>
          <span className="font-mono text-base font-bold text-amber-400 tabular-nums">
            {formatDurationHuman(totalSeconds, isUnlimited)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] text-slate-400 bg-[#192030] px-2.5 py-1 rounded-md border border-white/[0.08]">
            {stages.length} {stages.length === 1 ? 'NODE' : 'NODES'}
          </span>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs transition-all active:scale-95 shadow-md shadow-amber-500/20"
          >
            SAVE
          </button>
        </div>
      </div>
    </div>
  );
};
