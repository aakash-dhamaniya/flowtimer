import { useState, useEffect } from 'react';
import { Plus, Clock, Search, Sparkles } from 'lucide-react';
import { Routine, Stage, UserSettings, PreparedProgram } from './types/meditation';
import { storageService } from './services/storageService';
import { Header } from './components/Header';
import { RoutineCard } from './components/RoutineCard';
import { RoutineModal } from './components/RoutineModal';
import { ActivePlayer } from './components/ActivePlayer';
import { SettingsModal } from './components/SettingsModal';
import { BottomNav, TabType } from './components/BottomNav';
import { ProgramCatalog } from './components/ProgramCatalog';
import { PREPARED_PROGRAMS } from './data/preparedPrograms';
import { formatDurationHuman, calculateTotalDuration } from './utils/timeUtils';

interface YogicQuickPreset {
  title: string;
  sanskritTitle?: string;
  stages: Stage[];
}

const YOGIC_QUICK_PRESETS: YogicQuickPreset[] = [
  {
    title: "4-7-8 Pranayama Loop",
    sanskritTitle: "प्रणायाम",
    stages: [
      {
        id: "preset-478-repeat",
        type: "repeat",
        title: "4-7-8 Parasympathetic Loop",
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
    title: "Box Breathing (Samavritti)",
    sanskritTitle: "समवृत्ति",
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
    title: "Kapalabhati Kriya",
    sanskritTitle: "कपालभाति",
    stages: [
      {
        id: "preset-kap-repeat",
        type: "repeat",
        title: "Kapalabhati Skull-Shining",
        durationSeconds: 45,
        chimeType: "bell",
        speakTitle: true,
        repeatMode: "count",
        repeatCount: 3,
        nestedStages: [
          { id: "kap-pmp", title: "Pumping Exhalations (30 Strokes)", durationSeconds: 30, chimeType: "bell", speakTitle: true },
          { id: "kap-hld", title: "Passive Re-centering Inhale", durationSeconds: 15, chimeType: "bell", speakTitle: true },
        ],
      },
    ],
  },
  {
    title: "Bhramari Humming",
    sanskritTitle: "भ्रामरी",
    stages: [
      {
        id: "preset-bhr-repeat",
        type: "repeat",
        title: "Bhramari Humming Bee",
        durationSeconds: 18,
        chimeType: "bell",
        speakTitle: true,
        repeatMode: "count",
        repeatCount: 6,
        nestedStages: [
          { id: "bhr-in", title: "Smooth Inhale", durationSeconds: 4, chimeType: "bell", speakTitle: true },
          { id: "bhr-hum", title: "Humming Bee Exhale", durationSeconds: 14, chimeType: "bell", speakTitle: true },
        ],
      },
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
  // Default to 'sadhana' so user lands directly on prepared programs catalog
  const [activeTab, setActiveTab] = useState<TabType>('sadhana');

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
    updateRoutines([]);
  };

  const handleStartPreparedProgram = (program: PreparedProgram) => {
    const routineFromProgram: Routine = {
      id: program.id,
      title: program.title,
      sanskritTitle: program.sanskritTitle,
      description: program.description,
      category: program.categoryLabel,
      stages: JSON.parse(JSON.stringify(program.stages)),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      completionCount: 0,
    };
    setActiveRoutine(routineFromProgram);
  };

  const handleCustomizePreparedProgram = (program: PreparedProgram) => {
    const cloned: Routine = {
      id: 'routine-' + Date.now().toString(36),
      title: `${program.title} (Custom)`,
      sanskritTitle: program.sanskritTitle,
      description: program.description,
      category: program.categoryLabel,
      stages: JSON.parse(JSON.stringify(program.stages)),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      completionCount: 0,
    };
    setEditingRoutine(cloned);
    setIsRoutineModalOpen(true);
  };

  const handleLoadQuickPreset = (preset: YogicQuickPreset) => {
    const newRoutine: Routine = {
      id: 'routine-' + Date.now().toString(36),
      title: preset.title,
      sanskritTitle: preset.sanskritTitle,
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
    if (tab === 'builder') {
      handleNewRoutine();
      return;
    }
    if (tab === 'system') {
      setIsSettingsOpen(true);
      return;
    }
    setActiveTab(tab);
  };

  // Filtered routines based on search
  const filteredRoutines = routines.filter((r) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesTitle = r.title.toLowerCase().includes(q);
      const matchesSanskrit = r.sanskritTitle?.toLowerCase().includes(q) || false;
      const matchesStage = r.stages.some(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.nestedStages?.some((ns) => ns.title.toLowerCase().includes(q))
      );
      return matchesTitle || matchesSanskrit || matchesStage;
    }
    return true;
  });

  // Calculate cumulative library time for custom routines
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
      className="min-h-screen bg-[#060812] text-slate-100 flex flex-col font-sans selection:bg-amber-500/20 selection:text-amber-300"
      style={{
        paddingBottom: 'calc(var(--safe-bottom, env(safe-area-inset-bottom, 0px)) + 84px)',
      }}
    >
      {/* Top Header */}
      <Header
        onNewRoutine={handleNewRoutine}
        onOpenSettings={() => setIsSettingsOpen(true)}
        totalCustomRoutines={routines.length}
        totalPreparedPrograms={PREPARED_PROGRAMS.length}
        activeTab={activeTab}
      />

      <div className="max-w-md mx-auto w-full px-4 py-4 space-y-5 flex-1">
        {/* Tab View 1: Prepared Programs Catalog (SADHANA) */}
        {activeTab === 'sadhana' && (
          <ProgramCatalog
            onStartProgram={handleStartPreparedProgram}
            onCustomizeProgram={handleCustomizePreparedProgram}
          />
        )}

        {/* Tab View 2: Personal / Custom Routines (MY ROUTINES) */}
        {activeTab === 'routines' && (
          <div className="space-y-5">
            {/* My Routines Header */}
            <div className="bg-[#0E1324] border border-white/[0.08] rounded-2xl p-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                  <span>My Sadhanas</span>
                  <span className="font-mono text-xs text-amber-400 font-semibold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    {routines.length}
                  </span>
                </h2>
                <p className="font-mono text-[11px] text-slate-400 mt-0.5">
                  Personal Sequences & Cloned Programs
                </p>
              </div>

              <div className="flex items-center gap-1 font-mono text-[11px] text-slate-400 bg-[#161D32] px-2.5 py-1 rounded-lg border border-white/[0.06]">
                <Clock className="w-3 h-3 text-slate-500" />
                <span>{formatDurationHuman(totalCumulativeSeconds)}</span>
              </div>
            </div>

            {/* Yogic Quick Presets Strip */}
            <div>
              <span className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2 px-1">
                QUICK KRIYA PRESETS
              </span>
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
                {YOGIC_QUICK_PRESETS.map((preset) => (
                  <button
                    key={preset.title}
                    onClick={() => handleLoadQuickPreset(preset)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0E1324] hover:bg-[#161D32] border border-white/[0.08] hover:border-amber-500/40 text-slate-300 hover:text-amber-300 font-mono text-xs font-semibold whitespace-nowrap transition-all active:scale-95 shrink-0"
                  >
                    <span className="text-amber-500 font-bold">+</span>
                    <span>{preset.title}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Search Bar for user routines (if > 2) */}
            {routines.length > 2 && (
              <div className="flex items-center bg-[#0E1324] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs">
                <Search className="w-4 h-4 text-slate-500 mr-2 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search your custom routines..."
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

            {/* Custom Routines List */}
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
                /* Empty State */
                <div className="text-center py-14 px-6 bg-[#0E1324]/60 rounded-3xl border border-dashed border-white/[0.1] my-2">
                  <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/10">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">No Custom Sadhanas Yet</h3>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto mb-5 leading-relaxed">
                    You can create your own custom pranayama routine, or copy any prepared program from the <span className="text-amber-400 font-bold">Sadhana Library</span> to customize it.
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => setActiveTab('sadhana')}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold uppercase tracking-wider active:scale-95 transition-all"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Browse Library</span>
                    </button>
                    <button
                      onClick={handleNewRoutine}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-mono font-bold uppercase tracking-wider active:scale-95 transition-all shadow-md shadow-amber-500/20"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Create Custom</span>
                    </button>
                  </div>
                </div>
              )}
            </main>
          </div>
        )}
      </div>

      {/* Routine Create/Edit Modal */}
      <RoutineModal
        isOpen={isRoutineModalOpen}
        onClose={() => {
          setIsRoutineModalOpen(false);
          setEditingRoutine(null);
        }}
        onSave={handleSaveRoutine}
        initialRoutine={editingRoutine}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSave={handleSaveSettings}
        onResetDefaults={handleResetDefaults}
      />

      {/* Persistent Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={handleTabChange}
        routinesCount={routines.length}
      />
    </div>
  );
}

export default App;
