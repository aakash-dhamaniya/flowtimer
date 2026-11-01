import { Routine, Stage } from "../types/meditation";

/**
 * Formats seconds into MM:SS or HH:MM:SS format.
 */
export function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return "00:00";
  
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const pad = (n: number) => n.toString().padStart(2, "0");

  if (hrs > 0) {
    return `${hrs}:${pad(mins)}:${pad(secs)}`;
  }
  return `${pad(mins)}:${pad(secs)}`;
}

export const formatTimeDigits = formatTime;

/**
 * Formats duration in human-readable terms, e.g. "17 min" or "1 hr 15 min"
 */
export function formatDurationHuman(totalSeconds: number, isUnlimited?: boolean): string {
  if (isUnlimited) {
    return "∞ Unlimited";
  }
  if (!totalSeconds || totalSeconds <= 0) return "0 min";

  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  const parts: string[] = [];
  if (hrs > 0) parts.push(`${hrs} hr${hrs > 1 ? 's' : ''}`);
  if (mins > 0) parts.push(`${mins} min${mins > 1 ? 's' : ''}`);
  if (secs > 0 && hrs === 0 && mins < 5) parts.push(`${secs}s`);

  return parts.length > 0 ? parts.join(" ") : "< 1 min";
}

/**
 * Calculates duration info for a single stage or repeat node
 */
export function getNodeDuration(stage: Stage): { duration: number; isUnlimited: boolean; cycleDuration: number } {
  if (stage.type === 'repeat') {
    const cycleDuration = (stage.nestedStages || []).reduce(
      (sum, s) => sum + (s.durationSeconds || 0),
      0
    );
    const isUnlimited = stage.repeatMode === 'unlimited';
    const duration = isUnlimited
      ? cycleDuration
      : cycleDuration * (stage.repeatCount || 1);
    return { duration, isUnlimited, cycleDuration };
  }
  return {
    duration: stage.durationSeconds || 0,
    isUnlimited: false,
    cycleDuration: stage.durationSeconds || 0,
  };
}

/**
 * Inspects all stages to determine if any repeat node is set to unlimited
 */
export function isRoutineUnlimited(stages: Stage[]): boolean {
  return stages.some((s) => s.type === 'repeat' && s.repeatMode === 'unlimited');
}

/**
 * Calculates total seconds across all stages of a routine (including repeat counts)
 */
export function calculateTotalDuration(stages: Stage[]): number {
  return stages.reduce((acc, stage) => {
    const info = getNodeDuration(stage);
    return acc + info.duration;
  }, 0);
}

/**
 * Returns comprehensive duration info for a routine, taking whole-routine looping into account.
 */
export function getRoutineDurationInfo(routine: Routine): {
  displayDuration: string;
  totalSeconds: number;
  isUnlimited: boolean;
  isChainLoop: boolean;
  loopMode: 'none' | 'unlimited' | 'time_limit';
  baseCycleSeconds: number;
} {
  const baseCycleSeconds = calculateTotalDuration(routine.stages);
  const stageUnlimited = isRoutineUnlimited(routine.stages);
  const loopMode = routine.routineLoopMode || 'none';

  if (loopMode === 'unlimited' || stageUnlimited) {
    return {
      displayDuration: '∞ Unlimited',
      totalSeconds: baseCycleSeconds,
      isUnlimited: true,
      isChainLoop: loopMode === 'unlimited',
      loopMode: 'unlimited',
      baseCycleSeconds,
    };
  }

  if (loopMode === 'time_limit' && routine.routineLoopDurationSeconds) {
    return {
      displayDuration: formatDurationHuman(routine.routineLoopDurationSeconds),
      totalSeconds: routine.routineLoopDurationSeconds,
      isUnlimited: false,
      isChainLoop: true,
      loopMode: 'time_limit',
      baseCycleSeconds,
    };
  }

  return {
    displayDuration: formatDurationHuman(baseCycleSeconds),
    totalSeconds: baseCycleSeconds,
    isUnlimited: false,
    isChainLoop: false,
    loopMode: 'none',
    baseCycleSeconds,
  };
}

/**
 * Converts a total number of seconds into natural spoken text,
 * e.g., 300 -> "5 minutes", 90 -> "1 minute and 30 seconds"
 */
export function formatTimeForSpeech(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  if (mins > 0 && secs > 0) {
    return `${mins} minute${mins > 1 ? 's' : ''} and ${secs} second${secs > 1 ? 's' : ''}`;
  } else if (mins > 0) {
    return `${mins} minute${mins > 1 ? 's' : ''}`;
  } else {
    return `${secs} second${secs > 1 ? 's' : ''}`;
  }
}
