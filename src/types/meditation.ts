export type ChimeType = 'om' | 'bell' | 'chime' | 'beep' | 'gong' | 'singing-bowl' | 'crystal-bell' | 'none';

export type StageType = 'stage' | 'repeat';
export type RepeatMode = 'count' | 'unlimited';

export interface Stage {
  id: string;
  type?: StageType;
  title: string;
  durationSeconds: number; // Duration in seconds (or 1 cycle duration for repeat node)
  chimeType: ChimeType;
  speakTitle: boolean;
  customAnnouncement?: string;
  repeatMode?: RepeatMode; // 'count' or 'unlimited'
  repeatCount?: number; // e.g. 4 (when repeatMode is 'count')
  nestedStages?: Stage[]; // Child stages inside this loop node
}

export interface Routine {
  id: string;
  title: string;
  sanskritTitle?: string;
  description?: string;
  category?: string;
  stages: Stage[];
  createdAt: number;
  updatedAt: number;
  isFavorite?: boolean;
  completionCount?: number; // Total number of times completed
  lastCompletedAt?: number; // Timestamp of latest completion
}

export type ProgramCategory = 
  | 'all'
  | 'kundalini' 
  | 'memory' 
  | 'vitality' 
  | 'sleep' 
  | 'quick';

export interface PreparedProgram {
  id: string;
  title: string;
  sanskritTitle?: string;
  subtitle: string;
  description: string;
  category: ProgramCategory;
  categoryLabel: string;
  badge: string;
  accentColor: string; // 'amber' | 'purple' | 'emerald' | 'blue' | 'rose' | 'indigo'
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  bestTime: string;
  chakra?: string;
  mudra?: string;
  benefits: string[];
  precautions?: string[];
  stages: Stage[];
}

export interface UserSettings {
  ttsEnabled: boolean;
  speechRate: number; // 0.75 - 1.2
  speechPitch: number; // 0.8 - 1.2
  voiceUri?: string;
  bellVolume: number; // 0.0 - 1.0
  keepScreenAwake: boolean;
  prepCountdownSeconds: number; // 0, 3, 5, 10
  enableHaptic: boolean;
}

export type PlayerMode = 'idle' | 'prep' | 'running' | 'paused' | 'completed';

