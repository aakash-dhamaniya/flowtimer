import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  X,
  Volume2,
  VolumeX,
  Sun,
  Repeat,
  CheckCircle2,
} from 'lucide-react';
import { Routine, Stage, UserSettings } from '../types/meditation';
import {
  formatTimeDigits,
  calculateTotalDuration,
  isRoutineUnlimited,
} from '../utils/timeUtils';
import { soundService } from '../services/soundService';
import { speechService } from '../services/speechService';
import { wakeLockService } from '../services/wakeLockService';
import { RoutineComplete } from './RoutineComplete';

interface ActivePlayerProps {
  routine: Routine;
  settings: UserSettings;
  onExit: () => void;
  onRoutineCompleted?: (updatedRoutine: Routine) => void;
}

export const ActivePlayer: React.FC<ActivePlayerProps> = ({
  routine,
  settings,
  onExit,
  onRoutineCompleted,
}) => {
  const [currentRoutine, setCurrentRoutine] = useState<Routine>(routine);
  // Top-level stage index in routine.stages
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  // Nested stage index if current stage is a Repeat Node
  const [nestedStageIndex, setNestedStageIndex] = useState(0);
  // Current cycle for repeat node (1-indexed)
  const [currentCycle, setCurrentCycle] = useState(1);
  // Total cycles completed across all repeat nodes in this session
  const [totalCyclesCompleted, setTotalCyclesCompleted] = useState(0);

  // Initial stage setup
  const getInitialSeconds = (): number => {
    const firstNode = routine.stages[0];
    if (!firstNode) return 0;
    if (firstNode.type === 'repeat' && firstNode.nestedStages?.length) {
      return firstNode.nestedStages[0].durationSeconds;
    }
    return firstNode.durationSeconds || 0;
  };

  const [secondsRemaining, setSecondsRemaining] = useState(getInitialSeconds);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPrep, setIsPrep] = useState(settings.prepCountdownSeconds > 0);
  const [prepSeconds, setPrepSeconds] = useState(settings.prepCountdownSeconds);
  const [isFinished, setIsFinished] = useState(false);
  const [totalElapsed, setTotalElapsed] = useState(0);
  const [ttsMuted, setTtsMuted] = useState(!settings.ttsEnabled);
  const [lastAnnouncedTitle, setLastAnnouncedTitle] = useState<string | null>(null);

  // References to prevent stale closures in interval
  const isTransitioningRef = useRef(false);
  const currentStageIndexRef = useRef(0);
  const nestedStageIndexRef = useRef(0);
  const currentCycleRef = useRef(1);
  const secondsRemainingRef = useRef(getInitialSeconds());
  const routineRef = useRef(routine);

  currentStageIndexRef.current = currentStageIndex;
  nestedStageIndexRef.current = nestedStageIndex;
  currentCycleRef.current = currentCycle;
  secondsRemainingRef.current = secondsRemaining;
  routineRef.current = routine;

  const currentTopNode: Stage | undefined = routine.stages[currentStageIndex];
  const isRepeatNode = currentTopNode?.type === 'repeat';
  const nestedList = currentTopNode?.nestedStages || [];

  // Active step being counted down right now
  const activeStep: Stage =
    isRepeatNode && nestedList.length > 0
      ? nestedList[Math.min(nestedStageIndex, nestedList.length - 1)]
      : currentTopNode || {
          id: 'done',
          title: 'Complete',
          durationSeconds: 0,
          chimeType: 'bell',
          speakTitle: false,
        };

  // Up Next step calculation
  const getNextStepInfo = (): { title: string; durationSeconds: number; subtitle?: string } | null => {
    if (isRepeatNode && nestedList.length > 0) {
      if (nestedStageIndex + 1 < nestedList.length) {
        // Next step within same cycle
        const nextInCycle = nestedList[nestedStageIndex + 1];
        return {
          title: nextInCycle.title,
          durationSeconds: nextInCycle.durationSeconds,
          subtitle: `Cycle ${currentCycle}`,
        };
      } else {
        // End of this cycle
        const isUnlimited = currentTopNode.repeatMode === 'unlimited';
        const targetCount = currentTopNode.repeatCount || 4;
        if (isUnlimited || currentCycle < targetCount) {
          return {
            title: nestedList[0].title,
            durationSeconds: nestedList[0].durationSeconds,
            subtitle: `Cycle ${currentCycle + 1}`,
          };
        } else {
          // Advancing to next top-level stage
          const nextTop = routine.stages[currentStageIndex + 1];
          if (nextTop) {
            return {
              title: nextTop.title,
              durationSeconds:
                nextTop.type === 'repeat' && nextTop.nestedStages?.length
                  ? nextTop.nestedStages[0].durationSeconds
                  : nextTop.durationSeconds,
              subtitle: 'Next Phase',
            };
          }
          return null;
        }
      }
    } else {
      const nextTop = routine.stages[currentStageIndex + 1];
      if (nextTop) {
        return {
          title: nextTop.title,
          durationSeconds:
            nextTop.type === 'repeat' && nextTop.nestedStages?.length
              ? nextTop.nestedStages[0].durationSeconds
              : nextTop.durationSeconds,
          subtitle: nextTop.type === 'repeat' ? 'Repeat Loop' : 'Next Stage',
        };
      }
      return null;
    }
  };

  const nextStep = getNextStepInfo();
  const totalRoutineSeconds = calculateTotalDuration(routine.stages);
  const isRoutineUnlimitedSession = isRoutineUnlimited(routine.stages);

  // Progress of current active step (0 to 1)
  const activeDuration = Math.max(1, activeStep.durationSeconds);
  const stageProgress = Math.min(1, Math.max(0, 1 - secondsRemaining / activeDuration));

  // Audio and TTS settings setup
  useEffect(() => {
    soundService.setVolume(settings.bellVolume);
    speechService.setEnabled(!ttsMuted);
    speechService.setRate(settings.speechRate);
    speechService.setPitch(settings.speechPitch);
    if (settings.voiceUri) {
      speechService.setVoice(settings.voiceUri);
    }

    if (settings.keepScreenAwake) {
      wakeLockService.request();
    }

    return () => {
      wakeLockService.release();
      speechService.stop();
    };
  }, [settings, ttsMuted]);

  // Step trigger: Plays chime & speaks title
  const triggerStepStart = useCallback(
    async (step: Stage) => {
      if (!step) return;

      // 1. Play alert chime
      if (step.chimeType && step.chimeType !== 'none') {
        soundService.playSound(step.chimeType);
      }

      // 2. Announce title via TTS
      if (step.speakTitle && !ttsMuted) {
        setLastAnnouncedTitle(step.title);
        // For short breathwork steps (<= 8s), speak immediately without delay
        const delay = step.durationSeconds <= 8 ? 120 : 1000;
        setTimeout(async () => {
          await speechService.speak(step.title);
        }, delay);
      }
    },
    [ttsMuted]
  );

  const finishRoutine = useCallback(() => {
    setIsPlaying(false);
    setIsFinished(true);
    soundService.playCompleteTone();
    if (!ttsMuted) {
      speechService.speak('Routine Complete');
    }
    isTransitioningRef.current = false;

    // Automatically increment completion count & record timestamp
    const updated: Routine = {
      ...routineRef.current,
      completionCount: (routineRef.current.completionCount || 0) + 1,
      lastCompletedAt: Date.now(),
    };
    routineRef.current = updated;
    setCurrentRoutine(updated);
    if (onRoutineCompleted) {
      onRoutineCompleted(updated);
    }
  }, [ttsMuted, onRoutineCompleted]);

  // Advance to next top-level stage
  const advanceTopNode = useCallback(
    (nextTopIdx: number) => {
      if (nextTopIdx < routineRef.current.stages.length) {
        setCurrentStageIndex(nextTopIdx);
        currentStageIndexRef.current = nextTopIdx;
        setNestedStageIndex(0);
        nestedStageIndexRef.current = 0;
        setCurrentCycle(1);
        currentCycleRef.current = 1;

        const nextNode = routineRef.current.stages[nextTopIdx];
        if (nextNode.type === 'repeat' && nextNode.nestedStages?.length) {
          const firstSub = nextNode.nestedStages[0];
          setSecondsRemaining(firstSub.durationSeconds);
          triggerStepStart(firstSub);
        } else {
          setSecondsRemaining(nextNode.durationSeconds);
          triggerStepStart(nextNode);
        }
      } else {
        finishRoutine();
      }
    },
    [finishRoutine, triggerStepStart]
  );

  // Initial countdown or immediate start
  useEffect(() => {
    if (isPrep && prepSeconds > 0) {
      const prepInterval = setInterval(() => {
        setPrepSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(prepInterval);
            setIsPrep(false);
            setIsPlaying(true);
            const firstNode = routineRef.current.stages[0];
            const firstStep =
              firstNode?.type === 'repeat' && firstNode.nestedStages?.length
                ? firstNode.nestedStages[0]
                : firstNode;
            if (firstStep) triggerStepStart(firstStep);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(prepInterval);
    } else if (!isPrep && !isPlaying && !isFinished) {
      setIsPlaying(true);
      const firstNode = routineRef.current.stages[0];
      const firstStep =
        firstNode?.type === 'repeat' && firstNode.nestedStages?.length
          ? firstNode.nestedStages[0]
          : firstNode;
      if (firstStep) triggerStepStart(firstStep);
    }
  }, [isPrep, prepSeconds, isFinished, triggerStepStart]);

  // Step advancement handler (called by timer or Skip button)
  const advanceToNextStep = useCallback(() => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;

    const topIdx = currentStageIndexRef.current;
    const nestedIdx = nestedStageIndexRef.current;
    const cycle = currentCycleRef.current;
    const topNode = routineRef.current.stages[topIdx];

    if (!topNode) {
      finishRoutine();
      return;
    }

    if (topNode.type === 'repeat' && topNode.nestedStages?.length) {
      const nextNested = nestedIdx + 1;
      if (nextNested < topNode.nestedStages.length) {
        // Step within same cycle
        setNestedStageIndex(nextNested);
        nestedStageIndexRef.current = nextNested;
        const nextSub = topNode.nestedStages[nextNested];
        setSecondsRemaining(nextSub.durationSeconds);
        triggerStepStart(nextSub);
      } else {
        // Finished 1 full cycle
        setTotalCyclesCompleted((prev) => prev + 1);
        const isUnlimited = topNode.repeatMode === 'unlimited';
        const targetCount = topNode.repeatCount || 4;

        if (isUnlimited || cycle < targetCount) {
          // Loop back to first step of cycle
          const nextCycle = cycle + 1;
          setCurrentCycle(nextCycle);
          currentCycleRef.current = nextCycle;
          setNestedStageIndex(0);
          nestedStageIndexRef.current = 0;
          const firstSub = topNode.nestedStages[0];
          setSecondsRemaining(firstSub.durationSeconds);
          triggerStepStart(firstSub);
        } else {
          // Finished repeat node! Advance to next top node
          advanceTopNode(topIdx + 1);
        }
      }
    } else {
      // Finished regular stage!
      advanceTopNode(topIdx + 1);
    }

    setTimeout(() => {
      isTransitioningRef.current = false;
    }, 400);
  }, [advanceTopNode, finishRoutine, triggerStepStart]);

  // Step regression handler (Previous button)
  const moveToPreviousStep = useCallback(() => {
    const topIdx = currentStageIndexRef.current;
    const nestedIdx = nestedStageIndexRef.current;
    const cycle = currentCycleRef.current;
    const topNode = routineRef.current.stages[topIdx];

    if (!topNode) return;

    if (topNode.type === 'repeat' && topNode.nestedStages?.length) {
      if (nestedIdx > 0) {
        // Move back to previous step in same cycle
        const prevNested = nestedIdx - 1;
        setNestedStageIndex(prevNested);
        nestedStageIndexRef.current = prevNested;
        const prevSub = topNode.nestedStages[prevNested];
        setSecondsRemaining(prevSub.durationSeconds);
        triggerStepStart(prevSub);
      } else if (cycle > 1) {
        // Move to last step of previous cycle
        const prevCycle = cycle - 1;
        const lastNested = topNode.nestedStages.length - 1;
        setCurrentCycle(prevCycle);
        currentCycleRef.current = prevCycle;
        setNestedStageIndex(lastNested);
        nestedStageIndexRef.current = lastNested;
        const prevSub = topNode.nestedStages[lastNested];
        setSecondsRemaining(prevSub.durationSeconds);
        triggerStepStart(prevSub);
      } else if (topIdx > 0) {
        // Move to previous top stage
        const prevTop = topIdx - 1;
        setCurrentStageIndex(prevTop);
        currentStageIndexRef.current = prevTop;
        const prevNode = routineRef.current.stages[prevTop];
        if (prevNode.type === 'repeat' && prevNode.nestedStages?.length) {
          const lastSubIdx = prevNode.nestedStages.length - 1;
          setNestedStageIndex(lastSubIdx);
          nestedStageIndexRef.current = lastSubIdx;
          const prevSub = prevNode.nestedStages[lastSubIdx];
          setSecondsRemaining(prevSub.durationSeconds);
          triggerStepStart(prevSub);
        } else {
          setSecondsRemaining(prevNode.durationSeconds);
          triggerStepStart(prevNode);
        }
      } else {
        // Reset current first step
        const firstSub = topNode.nestedStages[0];
        setSecondsRemaining(firstSub.durationSeconds);
        triggerStepStart(firstSub);
      }
    } else {
      if (topIdx > 0) {
        const prevTop = topIdx - 1;
        setCurrentStageIndex(prevTop);
        currentStageIndexRef.current = prevTop;
        const prevNode = routineRef.current.stages[prevTop];
        if (prevNode.type === 'repeat' && prevNode.nestedStages?.length) {
          const lastSubIdx = prevNode.nestedStages.length - 1;
          setNestedStageIndex(lastSubIdx);
          nestedStageIndexRef.current = lastSubIdx;
          const prevSub = prevNode.nestedStages[lastSubIdx];
          setSecondsRemaining(prevSub.durationSeconds);
          triggerStepStart(prevSub);
        } else {
          setSecondsRemaining(prevNode.durationSeconds);
          triggerStepStart(prevNode);
        }
      } else {
        // Reset current stage
        setSecondsRemaining(topNode.durationSeconds);
        triggerStepStart(topNode);
      }
    }
  }, [triggerStepStart]);

  // Main countdown timer loop
  useEffect(() => {
    if (!isPlaying || isPrep || isFinished) return;

    const interval = setInterval(() => {
      setTotalElapsed((prev) => prev + 1);

      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          advanceToNextStep();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, isPrep, isFinished, advanceToNextStep]);

  const handleTogglePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleRestartRoutine = () => {
    setIsFinished(false);
    setCurrentStageIndex(0);
    setNestedStageIndex(0);
    setCurrentCycle(1);
    setTotalCyclesCompleted(0);
    const initialSec = getInitialSeconds();
    setSecondsRemaining(initialSec);
    setTotalElapsed(0);
    setIsPlaying(true);
    const firstNode = routine.stages[0];
    const firstStep =
      firstNode?.type === 'repeat' && firstNode.nestedStages?.length
        ? firstNode.nestedStages[0]
        : firstNode;
    if (firstStep) triggerStepStart(firstStep);
  };

  const handleAdjustCompletion = (newCount: number) => {
    const updated: Routine = {
      ...currentRoutine,
      completionCount: Math.max(0, newCount),
    };
    setCurrentRoutine(updated);
    routineRef.current = updated;
    if (onRoutineCompleted) {
      onRoutineCompleted(updated);
    }
  };

  // Finished celebration screen
  if (isFinished) {
    return (
      <RoutineComplete
        routine={currentRoutine}
        totalElapsedSeconds={totalElapsed}
        totalCyclesCompleted={totalCyclesCompleted}
        onDone={onExit}
        onRepeat={handleRestartRoutine}
        onUpdateCompletionCount={handleAdjustCompletion}
      />
    );
  }

  // Circular gauge calculations
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - stageProgress * circumference;

  // Breathing pulse helper classes
  const isBreathHold = activeStep.title.toLowerCase().includes('hold');
  const isBreathInhale = activeStep.title.toLowerCase().includes('inhale');
  const isBreathExhale = activeStep.title.toLowerCase().includes('exhale');

  return (
    <div
      className="fixed inset-0 z-50 bg-[#080A0F] text-white flex flex-col justify-between overflow-hidden select-none"
      style={{
        paddingTop: 'calc(var(--safe-top, env(safe-area-inset-top, 0px)) + 12px)',
        paddingBottom: 'calc(var(--safe-bottom, env(safe-area-inset-bottom, 0px)) + 16px)',
      }}
    >
      <div className="max-w-md w-full mx-auto px-5 flex-1 flex flex-col justify-between">
        {/* Top App Bar & Quick Settings */}
        <div>
          <div className="flex items-center justify-between pb-2">
            {/* Exit Button */}
            <button
              onClick={() => {
                if (window.confirm('Exit this routine?')) {
                  onExit();
                }
              }}
              className="w-10 h-10 rounded-full bg-[#111520] border border-white/[0.08] flex items-center justify-center text-slate-400 hover:text-white transition-all active:scale-95"
              title="Exit Routine"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Routine Title Badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#111520] border border-white/[0.08] max-w-[200px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span className="font-mono text-xs font-bold text-slate-200 tracking-wider truncate uppercase">
                {routine.title}
              </span>
            </div>

            {/* Right: WakeLock badge + Mute Toggle */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#111520] border border-white/[0.08] text-amber-400 text-[10px] font-mono font-bold">
                <Sun className="w-3 h-3" />
                <span>AWAKE</span>
              </div>
              <button
                onClick={() => setTtsMuted((prev) => !prev)}
                className="w-10 h-10 rounded-full bg-[#111520] border border-white/[0.08] flex items-center justify-center text-slate-400 hover:text-white transition-all active:scale-95"
                title={ttsMuted ? 'Unmute Voice' : 'Mute Voice'}
              >
                {ttsMuted ? (
                  <VolumeX className="w-4 h-4 text-rose-400" />
                ) : (
                  <Volume2 className="w-4 h-4 text-amber-400" />
                )}
              </button>
            </div>
          </div>

          {/* Top Segmented Horizon Progress Track */}
          <div className="w-full h-1.5 rounded-full bg-[#192030] flex gap-1.5 overflow-hidden my-3">
            {routine.stages.map((st, idx) => {
              const isPast = idx < currentStageIndex;
              const isCurrent = idx === currentStageIndex;
              return (
                <div
                  key={st.id || idx}
                  className={`h-full flex-1 rounded-sm transition-all duration-300 ${
                    isPast
                      ? 'bg-emerald-400'
                      : isCurrent
                      ? 'bg-amber-500 shadow-sm shadow-amber-500/50'
                      : 'bg-[#192030]'
                  }`}
                />
              );
            })}
          </div>

          {/* Active Stage Header & Cycle Pill */}
          <div className="text-center pt-1">
            {isRepeatNode ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-mono text-[11px] font-bold uppercase tracking-wider mb-2">
                <Repeat className="w-3 h-3 animate-spin-slow" />
                <span>
                  {currentTopNode?.title || 'REPEAT LOOP'} • CYCLE {currentCycle}
                  {currentTopNode?.repeatMode === 'unlimited'
                    ? ' (∞ UNLIMITED)'
                    : ` OF ${currentTopNode?.repeatCount || 4}`}
                </span>
              </div>
            ) : (
              <span className="font-mono text-[11px] font-bold tracking-widest text-amber-400 uppercase bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 inline-block mb-2">
                STAGE {currentStageIndex + 1 < 10 ? `0${currentStageIndex + 1}` : currentStageIndex + 1} OF{' '}
                {routine.stages.length < 10 ? `0${routine.stages.length}` : routine.stages.length}
              </span>
            )}

            {currentRoutine.sanskritTitle && (
              <p className="font-serif text-sm font-semibold text-amber-300/90 tracking-wider mb-1">
                {currentRoutine.sanskritTitle}
              </p>
            )}

            <h2 className="text-3xl font-extrabold text-white tracking-tight leading-tight uppercase font-sans">
              {activeStep.title}
            </h2>

            {nextStep ? (
              <p className="font-mono text-xs text-slate-400 mt-1 flex items-center justify-center gap-1.5">
                <span>Next:</span>
                <span className="text-slate-200 font-bold">{nextStep.title}</span>
                <span className="text-amber-400 tabular-nums">
                  ({formatTimeDigits(nextStep.durationSeconds)})
                </span>
                {nextStep.subtitle && (
                  <span className="text-slate-500 font-normal">[{nextStep.subtitle}]</span>
                )}
                <span>➔</span>
              </p>
            ) : (
              <p className="font-mono text-xs text-emerald-400 mt-1 font-semibold">
                Final Step • Completion next
              </p>
            )}

            {/* Announcement Banner */}
            {lastAnnouncedTitle && (
              <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full bg-[#192030] border border-white/[0.08] text-slate-300 font-mono text-[11px]">
                <span className="text-amber-400">✦</span>
                <span className="text-slate-400">ANNOUNCED:</span>
                <span className="font-bold text-white">{lastAnnouncedTitle}</span>
              </div>
            )}
          </div>
        </div>

        {/* Center: Tactile Minimalist Chronometer Dial */}
        <div className="flex flex-col items-center justify-center my-3">
          <div className="relative w-[280px] h-[280px] flex items-center justify-center">
            {/* SVG Progress Dial */}
            <svg className="w-full h-full -rotate-90" viewBox="0 0 280 280">
              {/* Background track circle */}
              <circle
                cx="140"
                cy="140"
                r={radius}
                className="stroke-[#192030]"
                strokeWidth="10"
                fill="none"
              />
              {/* Outer tick marks circle */}
              <circle
                cx="140"
                cy="140"
                r={radius + 12}
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="2"
                strokeDasharray="3 6"
                fill="none"
              />
              {/* Active countdown arc */}
              <circle
                cx="140"
                cy="140"
                r={radius}
                className={`transition-all duration-1000 ease-linear ${
                  isBreathInhale
                    ? 'stroke-emerald-400 shadow-lg shadow-emerald-500/40'
                    : isBreathHold
                    ? 'stroke-cyan-400'
                    : isBreathExhale
                    ? 'stroke-amber-400'
                    : 'stroke-amber-500'
                }`}
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="none"
              />
            </svg>

            {/* Center Tabular Countdown Digits */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              {isPrep ? (
                <>
                  <span className="font-mono text-xs text-amber-400 font-bold uppercase tracking-widest mb-1 animate-pulse">
                    PREPARING
                  </span>
                  <span className="font-mono text-7xl font-bold tracking-tight text-white tabular-nums">
                    {prepSeconds}
                  </span>
                  <span className="text-xs text-slate-400 mt-2 font-mono">Get Ready...</span>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-1.5 text-amber-400 font-mono text-[11px] font-bold uppercase tracking-wider mb-1">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                    <span>{isPlaying ? 'ACTIVE' : 'PAUSED'}</span>
                  </div>

                  <span className="font-mono text-6xl font-extrabold tracking-tight text-white tabular-nums drop-shadow-md">
                    {formatTimeDigits(secondsRemaining)}
                  </span>

                  <span className="font-mono text-[10px] text-slate-500 uppercase tracking-widest mt-1">
                    REMAINING
                  </span>

                  {/* Step / Cycle Dots */}
                  {isRepeatNode ? (
                    <div className="flex items-center gap-1.5 mt-2.5">
                      {nestedList.map((_, i) => (
                        <span
                          key={i}
                          className={`h-1.5 rounded-sm transition-all ${
                            i < nestedStageIndex
                              ? 'bg-emerald-400 w-2'
                              : i === nestedStageIndex
                              ? 'bg-amber-400 w-4'
                              : 'bg-[#192030] w-2'
                          }`}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 mt-2.5">
                      {routine.stages.map((_, i) => (
                        <span
                          key={i}
                          className={`w-2 h-1.5 rounded-sm transition-all ${
                            i < currentStageIndex
                              ? 'bg-emerald-400'
                              : i === currentStageIndex
                              ? 'bg-amber-400 w-4'
                              : 'bg-[#192030]'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Bento Cards: Step Time / Up Next */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="bg-[#111520] border border-white/[0.08] rounded-xl p-3">
            <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
              STEP TIME
            </span>
            <span className="font-mono text-base font-bold text-white tabular-nums block">
              {formatTimeDigits(activeStep.durationSeconds)}
            </span>
            <span className="text-[11px] text-slate-400 block truncate">{activeStep.title}</span>
          </div>

          <div className="bg-[#111520] border border-white/[0.08] rounded-xl p-3">
            <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
              UP NEXT
            </span>
            <span className="font-mono text-base font-bold text-amber-400 tabular-nums block truncate">
              {nextStep ? formatTimeDigits(nextStep.durationSeconds) : 'COMPLETE'}
            </span>
            <span className="text-[11px] text-slate-400 block truncate">
              {nextStep ? nextStep.title : 'None'}
            </span>
          </div>
        </div>

        {/* Tactile Hardware Player Controls */}
        <div>
          <div className="flex items-center justify-center gap-4">
            {/* Previous Step */}
            <button
              onClick={moveToPreviousStep}
              className="w-12 h-12 rounded-full bg-[#111520] border border-white/[0.08] hover:border-white/[0.18] flex items-center justify-center text-slate-300 hover:text-white active:scale-95 transition-all"
              title="Previous Step"
            >
              <SkipBack className="w-5 h-5" />
            </button>

            {/* Giant Center Play/Pause Amber Button */}
            <button
              onClick={handleTogglePlayPause}
              className="w-18 h-18 rounded-full bg-amber-500 hover:bg-amber-400 text-black flex items-center justify-center shadow-2xl shadow-amber-500/30 active:scale-90 transition-all"
              title={isPlaying ? 'Pause Timer' : 'Resume Timer'}
            >
              {isPlaying ? (
                <Pause className="w-8 h-8 fill-black" />
              ) : (
                <Play className="w-8 h-8 fill-black ml-1" />
              )}
            </button>

            {/* Next / Skip Step */}
            <button
              onClick={advanceToNextStep}
              className="w-12 h-12 rounded-full bg-[#111520] border border-white/[0.08] hover:border-white/[0.18] flex items-center justify-center text-slate-300 hover:text-white active:scale-95 transition-all"
              title="Skip to Next Step"
            >
              <SkipForward className="w-5 h-5" />
            </button>

            {/* Stop / Finish Early Button (especially useful for unlimited loops) */}
            <button
              onClick={() => {
                if (window.confirm('Finish this session and view summary?')) {
                  finishRoutine();
                }
              }}
              className="w-12 h-12 rounded-full bg-emerald-500/15 border border-emerald-500/30 hover:bg-emerald-500/25 flex items-center justify-center text-emerald-400 hover:text-emerald-300 active:scale-95 transition-all"
              title="Finish & Save Session"
            >
              <CheckCircle2 className="w-5 h-5" />
            </button>
          </div>

          {/* Bottom Status Strip */}
          <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span className="text-[11px] uppercase">TOTAL ELAPSED:</span>
              <span className="font-bold text-white tabular-nums">
                {formatTimeDigits(totalElapsed)} /{' '}
                {isRoutineUnlimitedSession ? '∞' : formatTimeDigits(totalRoutineSeconds)}
              </span>
            </div>
            <div className="text-[11px] text-slate-500 uppercase">
              {ttsMuted ? 'Muted' : 'Voice On'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
