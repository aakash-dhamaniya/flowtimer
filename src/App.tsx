import { useState, useEffect } from 'react';
import { Plus, Clock, Search, Layers, Zap } from 'lucide-react';
import { Routine, Stage, UserSettings } from './types/meditation';
import { storageService, DEFAULT_ROUTINES } from './services/storageService';
import { Header } from './components/Header';
import { RoutineCard } from './components/RoutineCard';
import { RoutineModal } from './components/RoutineModal';
import { ActivePlayer } from './components/ActivePlayer';
import { SettingsModal } from './components/SettingsModal';
import { BottomNav, TabType } from './components/BottomNav';
import { formatDurationHuman, calculateTotalDuration } from './utils/timeUtils';

interface TacticalPreset {
  title: string;
  stages: Stage[];
}

const TACTICAL_PRESETS: TacticalPreset[] = [
  {
    title: "4-7-8 Breathing",
    stages: [
      {
        id: "preset-478-repeat",
        type: "repeat",
        title: "4-7-8 Breathing Loop",
        durationSeconds: 19,
        chimeType: "bell",
        speakTitle: true,
        repeatMode: "count",
        repeatCount: 4,
        nestedStages: [
          { id: "478-in", title: "Inhale", durationSeconds: 4, chimeType: "bell", speakTitle: true },
          { id: "478-hld", title: "Hold", durationSeconds: 7, chimeType: "bell", speakTitle: true },
          { id: "478-exh", title: "Exhale", durationSeconds: 8, chimeType: "bell", speakTitle: true },
        ],
      },
    ],
  },
  {
    title: "Box Breathing",
    stages: [
      {
        id: "preset-box-repeat",
        type: "repeat",
        title: "Box Breathing (4-4-4-4)",
        durationSeconds: 16,
        chimeType: "bell",
        speakTitle: true,
        repeatMode: "unlimited",
        nestedStages: [
          { id: "box-in", title: "Inhale", durationSeconds: 4, chimeType: "bell", speakTitle: true },
          { id: "box-hld1", title: "Hold", durationSeconds: 4, chimeType: "bell", speakTitle: true },
          { id: "box-exh", title: "Exhale", durationSeconds: 4, chimeType: "bell", speakTitle: true },
          { id: "box-hld2", title: "Hold", durationSeconds: 4, chimeType: "bell", speakTitle: true },
        ],
      },
    ],
  },
  {
    title: "Quick HIIT",
    stages: [
      { id: "hiit-wup", title: "Warmup Jog", durationSeconds: 120, chimeType: "bell", speakTitle: true },
      {
        id: "hiit-loop",
        type: "repeat",
        title: "Sprint Interval Loop",
        durationSeconds: 75,
        chimeType: "bell",
        speakTitle: true,
        repeatMode: "count",
        repeatCount: 4,
        nestedStages: [
          { id: "hiit-spr", title: "All-Out Sprint", durationSeconds: 45, chimeType: "bell", speakTitle: true },
          { id: "hiit-rst", title: "Active Rest", durationSeconds: 30, chimeType: "bell", speakTitle: true },
        ],
      },
      { id: "hiit-cd", title: "Cool Down", durationSeconds: 120, chimeType: "bell", speakTitle: true },
    ],
  },
  {
    title: "Pomodoro Sprint",
    stages: [
      { id: "pomo-foc", title: "Deep Focus", durationSeconds: 1500, chimeType: "bell", speakTitle: true },
      { id: "pomo-rst", title: "Rest & Stretch", durationSeconds: 300, chimeType: "bell", speakTitle: true },
    ],
  },
];

export function App() {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [settings, setSettings] = useState<UserSettings>(storageService.getSettings());
  const [activeRoutine, setActiveRoutine] = useState<Routine | null>(null);
  const [isRoutineModalOpen, setIsRoutineModalOpen] = useState(false);
  const [editingRoutine, setEditingRoutine] = useState<Routine | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('routines');

  // Load saved routines and settings on start
  useEffect(() => {
    const loadedRoutines = storageService.getRoutines();
    setRoutines(loadedRoutines);
    const loadedSettings = storageService.getSettings();
    setSettings(loadedSettings);
  }, []);

  // Save changes to storage
  const updateRoutines = (newRoutines: Routine[]) => {
    setRoutines(newRoutines);
    storageService.saveRoutines(newRoutines);
  };

  const handleStartRoutine = (routine: Routine) => {
    setActiveRoutine(routine);
  };

  const handleExitActivePlayer = () => {
    setActiveRoutine(null);
  };

  const handleNewRoutine = () => {
    setEditingRoutine(null);
    setIsRoutineModalOpen(true);
  };

  const handleEditRoutine = (routine: Routine) => {
    setEditingRoutine(routine);
    setIsRoutineModalOpen(true);
  };

  const handleDuplicateRoutine = (routine: Routine) => {
    const duplicated: Routine = {
      ...JSON.parse(JSON.stringify(routine)),
      id: 'routine-' + Math.random().toString(36).substring(2, 9),
      title: `${routine.title} (Copy)`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isFavorite: false,
      completionCount: 0,
    };
    updateRoutines([duplicated, ...routines]);
  };

  const handleDeleteRoutine = (routineId: string) => {
    if (window.confirm("Are you sure you want to delete this routine?")) {
      updateRoutines(routines.filter((r) => r.id !== routineId));
    }
  };

  const handleUpdateCompletionCount = (routineId: string, count: number) => {
    updateRoutines(
      routines.map((r) =>
        r.id === routineId
          ? { ...r, completionCount: Math.max(0, count), updatedAt: Date.now() }
          : r
      )
    );
  };

  const handleSaveRoutine = (savedRoutine: Routine) => {
    const exists = routines.some((r) => r.id === savedRoutine.id);
    if (exists) {
      updateRoutines(
        routines.map((r) => (r.id === savedRoutine.id ? savedRoutine : r))
      );
    } else {
      updateRoutines([savedRoutine, ...routines]);
    }
  };

  const handleSaveSettings = (newSettings: UserSettings) => {
    setSettings(newSettings);
    storageService.saveSettings(newSettings);
  };

  const handleResetDefaults = () => {
    updateRoutines(DEFAULT_ROUTINES);
  };

  const handleLoadTacticalPreset = (preset: TacticalPreset) => {
    const newRoutine: Routine = {
      id: 'routine-' + Date.now().toString(36),
      title: preset.title,
      stages: JSON.parse(JSON.stringify(preset.stages)),
      completionCount: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setEditingRoutine(newRoutine);
    setIsRoutineModalOpen(true);
  };

  // Handle Tab navigation
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    if (tab === 'builder') {
      handleNewRoutine();
    } else if (tab === 'system') {
      setIsSettingsOpen(true);
    }
  };

  // Filtered routines based on search
  const filteredRoutines = routines.filter((r) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesTitle = r.title.toLowerCase().includes(q);
      const matchesStage = r.stages.some(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.nestedStages?.some((ns) => ns.title.toLowerCase().includes(q))
      );
      return matchesTitle || matchesStage;
    }
    return true;
  });

  // Calculate cumulative library time
  const totalCumulativeSeconds = routines.reduce(
    (acc, r) => acc + calculateTotalDuration(r.stages),
    0
  );

  // If in active routine, render fullscreen player
  if (activeRoutine) {
    return (
      <ActivePlayer
        routine={activeRoutine}
        settings={settings}
        onExit={handleExitActivePlayer}
        onRoutineCompleted={handleSaveRoutine}
      />
    );
  }

  return (
    <div
      className="min-h-screen bg-[#080A0F] text-slate-100 flex flex-col font-sans selection:bg-amber-500/20 selection:text-amber-300"
      style={{
        paddingBottom: 'calc(var(--safe-bottom, env(safe-area-inset-bottom, 0px)) + 84px)',
      }}
    >
      {/* Top Header */}
      <Header
        onNewRoutine={handleNewRoutine}
        onOpenSettings={() => setIsSettingsOpen(true)}
        totalRoutines={routines.length}
      />

      <div className="max-w-md mx-auto w-full px-4 py-4 space-y-5 flex-1">
        {/* "Your Routines" Header Section matching Stitch home.png */}
        <div className="bg-[#111520] border border-white/[0.08] rounded-2xl p-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Your Routines
            </h2>
            <p className="font-mono text-[11px] text-slate-400 mt-0.5">
              Sequence Matrix Chrono Sync
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
              {routines.length} PRESETS
            </span>
            <div className="flex items-center gap-1 font-mono text-[11px] text-slate-400 bg-[#192030] px-2.5 py-1 rounded-lg border border-white/[0.06]">
              <Clock className="w-3 h-3 text-slate-500" />
              <span>{formatDurationHuman(totalCumulativeSeconds)}</span>
            </div>
          </div>
        </div>

        {/* Tactical Presets Quick Strip matching Stitch home.png */}
        <div>
          <span className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2 px-1">
            TACTICAL PRESETS
          </span>
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
            {TACTICAL_PRESETS.map((preset) => (
              <button
                key={preset.title}
                onClick={() => handleLoadTacticalPreset(preset)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#111520] hover:bg-[#192030] border border-white/[0.08] hover:border-amber-500/40 text-slate-300 hover:text-amber-300 font-mono text-xs font-semibold whitespace-nowrap transition-all active:scale-95 shrink-0"
              >
                <span className="text-amber-500 font-bold">+</span>
                <span>{preset.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Search Bar (if there are routines) */}
        {routines.length > 2 && (
          <div className="flex items-center bg-[#111520] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs">
            <Search className="w-4 h-4 text-slate-500 mr-2 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search routines or stages..."
              className="w-full bg-transparent text-white placeholder-slate-500 focus:outline-none font-sans"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-slate-500 hover:text-slate-300 text-xs px-1 font-mono"
              >
                Clear
              </button>
            )}
          </div>
        )}

        {/* Main Routines List / Feed */}
        <main className="space-y-4">
          {filteredRoutines.length > 0 ? (
            filteredRoutines.map((routine) => (
              <RoutineCard
                key={routine.id}
                routine={routine}
                onStart={handleStartRoutine}
                onEdit={handleEditRoutine}
                onDuplicate={handleDuplicateRoutine}
                onDelete={handleDeleteRoutine}
                onUpdateCompletionCount={handleUpdateCompletionCount}
              />
            ))
          ) : (
            /* Clean Empty State */
            <div className="text-center py-16 px-6 bg-[#111520]/60 rounded-3xl border border-dashed border-white/[0.1] my-2">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/10">
                <Layers className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">No Routines Yet</h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto mb-6 leading-relaxed">
                Create your custom multi-stage routine for workouts, meditation, breathwork, or focus sprints.
              </p>
              <button
                onClick={handleNewRoutine}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-mono font-bold uppercase tracking-wider shadow-xl shadow-amber-500/25 active:scale-95 transition-all"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Create First Routine</span>
              </button>
            </div>
          )}
        </main>

        {/* Hardware Calibration Badge matching Stitch home.png footer */}
        <div className="bg-[#111520] border border-white/[0.06] rounded-xl p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#192030] flex items-center justify-center text-amber-500">
              <Zap className="w-4 h-4 fill-amber-500" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">
                Auto-Chrono Engine
              </span>
              <span className="font-mono text-[10px] text-slate-400 block">
                0.05ms hardware tick resolution
              </span>
            </div>
          </div>
          <span className="font-mono text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 uppercase tracking-wider">
            CALIBRATED
          </span>
        </div>
      </div>

      {/* Floating Action Button (FAB) anchored above BottomNav */}
      <button
        onClick={handleNewRoutine}
        className="fixed right-5 z-40 w-14 h-14 rounded-full bg-amber-500 hover:bg-amber-400 text-black shadow-2xl shadow-amber-500/40 flex items-center justify-center active:scale-90 transition-all"
        style={{
          bottom: 'calc(var(--safe-bottom, env(safe-area-inset-bottom, 0px)) + 80px)',
        }}
        title="Create New Routine"
        aria-label="Add Routine"
      >
        <Plus className="w-7 h-7 stroke-[2.5]" />
      </button>

      {/* Persistent Bottom Navigation Bar */}
      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Routine Builder Modal */}
      <RoutineModal
        isOpen={isRoutineModalOpen}
        onClose={() => {
          setIsRoutineModalOpen(false);
          setEditingRoutine(null);
          setActiveTab('routines');
        }}
        onSave={handleSaveRoutine}
        initialRoutine={editingRoutine}
      />

      {/* Settings / System Preferences Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => {
          setIsSettingsOpen(false);
          setActiveTab('routines');
        }}
        settings={settings}
        onSave={handleSaveSettings}
        onResetDefaults={handleResetDefaults}
      />
    </div>
  );
}

export default App;
