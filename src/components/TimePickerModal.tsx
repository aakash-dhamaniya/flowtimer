import React, { useState, useEffect } from 'react';
import { X, Check, Clock, Wind } from 'lucide-react';
import { formatTimeDigits, formatDurationHuman } from '../utils/timeUtils';

interface TimePickerModalProps {
  isOpen: boolean;
  title?: string;
  initialSeconds: number;
  onSave: (seconds: number) => void;
  onClose: () => void;
}

export const TimePickerModal: React.FC<TimePickerModalProps> = ({
  isOpen,
  title = 'Set Duration',
  initialSeconds,
  onSave,
  onClose,
}) => {
  const [totalSeconds, setTotalSeconds] = useState(initialSeconds);
  const [minsStr, setMinsStr] = useState(Math.floor(initialSeconds / 60).toString());
  const [secsStr, setSecsStr] = useState((initialSeconds % 60).toString());

  useEffect(() => {
    if (isOpen) {
      const safe = Math.max(1, initialSeconds || 1);
      setTotalSeconds(safe);
      setMinsStr(Math.floor(safe / 60).toString());
      setSecsStr((safe % 60).toString());
    }
  }, [isOpen, initialSeconds]);

  if (!isOpen) return null;

  const handleUpdateFromTotal = (newTotal: number) => {
    const safe = Math.max(1, Math.min(10800, newTotal)); // 1s to 3 hours
    setTotalSeconds(safe);
    setMinsStr(Math.floor(safe / 60).toString());
    setSecsStr((safe % 60).toString());
  };

  const handleMinsChange = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    setMinsStr(cleaned);
    const m = parseInt(cleaned, 10) || 0;
    const s = parseInt(secsStr, 10) || 0;
    setTotalSeconds(Math.max(1, m * 60 + s));
  };

  const handleSecsChange = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    let num = parseInt(cleaned, 10);
    if (!isNaN(num) && num > 59) {
      num = 59;
    }
    const finalStr = isNaN(num) ? '' : num.toString();
    setSecsStr(finalStr);
    const m = parseInt(minsStr, 10) || 0;
    const s = isNaN(num) ? 0 : num;
    setTotalSeconds(Math.max(1, m * 60 + s));
  };

  const handleSave = () => {
    const m = parseInt(minsStr, 10) || 0;
    const s = parseInt(secsStr, 10) || 0;
    const finalSecs = Math.max(1, m * 60 + s);
    onSave(finalSecs);
    onClose();
  };

  const BREATHWORK_PRESETS = [
    { label: '4s', sec: 4, desc: 'Box/4-7-8 Inhale' },
    { label: '7s', sec: 7, desc: '4-7-8 Hold' },
    { label: '8s', sec: 8, desc: '4-7-8 Exhale' },
    { label: '16s', sec: 16, desc: 'Full Box Cycle' },
  ];

  const STANDARD_PRESETS = [
    { label: '10s', sec: 10 },
    { label: '15s', sec: 15 },
    { label: '30s', sec: 30 },
    { label: '45s', sec: 45 },
    { label: '1 min', sec: 60 },
    { label: '2 min', sec: 120 },
    { label: '3 min', sec: 180 },
    { label: '5 min', sec: 300 },
    { label: '10 min', sec: 600 },
    { label: '15 min', sec: 900 },
    { label: '20 min', sec: 1200 },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative bg-[#111520] border border-white/[0.14] rounded-3xl p-5 max-w-sm w-full shadow-2xl z-10 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white tracking-tight">
              {title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Big Digital Display */}
        <div className="text-center py-2 bg-[#192030] rounded-2xl border border-white/[0.08]">
          <span className="font-mono text-4xl font-extrabold text-amber-400 tabular-nums tracking-wide block">
            {formatTimeDigits(totalSeconds)}
          </span>
          <span className="text-xs font-mono text-slate-400 mt-1 block">
            {formatDurationHuman(totalSeconds)}
          </span>
        </div>

        {/* Quick Steppers: -1s, +1s, -15s, +15s, -1m, +1m */}
        <div>
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
            STEP ADJUSTMENT
          </span>
          <div className="grid grid-cols-6 gap-1">
            <button
              type="button"
              onClick={() => handleUpdateFromTotal(totalSeconds - 60)}
              className="py-1.5 rounded-lg bg-[#192030] hover:bg-white/[0.08] text-slate-300 font-mono text-xs font-bold active:scale-95 transition-all"
            >
              -1m
            </button>
            <button
              type="button"
              onClick={() => handleUpdateFromTotal(totalSeconds - 15)}
              className="py-1.5 rounded-lg bg-[#192030] hover:bg-white/[0.08] text-slate-300 font-mono text-xs font-bold active:scale-95 transition-all"
            >
              -15s
            </button>
            <button
              type="button"
              onClick={() => handleUpdateFromTotal(totalSeconds - 1)}
              className="py-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 font-mono text-xs font-bold active:scale-95 transition-all"
            >
              -1s
            </button>
            <button
              type="button"
              onClick={() => handleUpdateFromTotal(totalSeconds + 1)}
              className="py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 font-mono text-xs font-bold active:scale-95 transition-all"
            >
              +1s
            </button>
            <button
              type="button"
              onClick={() => handleUpdateFromTotal(totalSeconds + 15)}
              className="py-1.5 rounded-lg bg-[#192030] hover:bg-white/[0.08] text-slate-300 font-mono text-xs font-bold active:scale-95 transition-all"
            >
              +15s
            </button>
            <button
              type="button"
              onClick={() => handleUpdateFromTotal(totalSeconds + 60)}
              className="py-1.5 rounded-lg bg-[#192030] hover:bg-white/[0.08] text-slate-300 font-mono text-xs font-bold active:scale-95 transition-all"
            >
              +1m
            </button>
          </div>
        </div>

        {/* Clean Direct Numeric Typing Row */}
        <div>
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
            TYPE EXACT TIME
          </span>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-[#192030] border border-white/[0.08] rounded-xl p-2 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono">Minutes:</span>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={minsStr}
                onFocus={(e) => e.target.select()}
                onChange={(e) => handleMinsChange(e.target.value)}
                placeholder="0"
                className="w-14 text-right bg-transparent font-mono text-base font-bold text-white outline-none tabular-nums"
              />
            </div>

            <div className="bg-[#192030] border border-white/[0.08] rounded-xl p-2 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono">Seconds:</span>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={secsStr}
                onFocus={(e) => e.target.select()}
                onChange={(e) => handleSecsChange(e.target.value)}
                placeholder="0"
                className="w-14 text-right bg-transparent font-mono text-base font-bold text-amber-400 outline-none tabular-nums"
              />
            </div>
          </div>
        </div>

        {/* Breathwork Fast Presets (4s, 7s, 8s, 16s) */}
        <div>
          <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1 mb-1.5">
            <Wind className="w-3 h-3" />
            <span>BREATHWORK PRESETS (ONE-TAP)</span>
          </span>
          <div className="grid grid-cols-4 gap-1.5">
            {BREATHWORK_PRESETS.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => handleUpdateFromTotal(item.sec)}
                className={`py-2 px-1 rounded-xl text-xs font-mono font-bold transition-all active:scale-95 text-center ${
                  totalSeconds === item.sec
                    ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                    : 'bg-[#192030] text-slate-300 hover:text-white border border-white/[0.06] hover:border-amber-500/30'
                }`}
                title={item.desc}
              >
                <span className="block text-sm">{item.label}</span>
                <span className="text-[9px] font-normal opacity-70 block truncate">{item.desc.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Standard Presets */}
        <div>
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
            STANDARD INTERVALS
          </span>
          <div className="flex flex-wrap gap-1.5">
            {STANDARD_PRESETS.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => handleUpdateFromTotal(item.sec)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all active:scale-95 ${
                  totalSeconds === item.sec
                    ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                    : 'bg-[#192030] text-slate-400 hover:text-white border border-white/[0.06]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center gap-2 pt-2 border-t border-white/[0.08]">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 text-xs font-medium text-slate-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-mono text-xs font-bold uppercase tracking-wider active:scale-95 transition-all flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20"
          >
            <Check className="w-4 h-4 stroke-[2.5]" />
            <span>Apply Duration</span>
          </button>
        </div>
      </div>
    </div>
  );
};
