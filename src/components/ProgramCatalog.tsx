import React, { useState } from 'react';
import { Search, Sparkles, Flame, Brain, Moon, Zap, Clock, Play, ArrowRight } from 'lucide-react';
import { PreparedProgram, ProgramCategory } from '../types/meditation';
import { PREPARED_PROGRAMS } from '../data/preparedPrograms';
import { ProgramCard } from './ProgramCard';
import { ProgramDetailModal } from './ProgramDetailModal';
import { formatDurationHuman, calculateTotalDuration } from '../utils/timeUtils';

interface ProgramCatalogProps {
  onStartProgram: (program: PreparedProgram) => void;
  onCustomizeProgram: (program: PreparedProgram) => void;
}

export const ProgramCatalog: React.FC<ProgramCatalogProps> = ({
  onStartProgram,
  onCustomizeProgram,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ProgramCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProgramForDetails, setSelectedProgramForDetails] = useState<PreparedProgram | null>(null);

  const categories: { id: ProgramCategory; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'All Sadhanas', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { id: 'kundalini', label: 'Kundalini & Chakras', icon: <Flame className="w-3.5 h-3.5 text-amber-400" /> },
    { id: 'memory', label: 'Memory & Brain', icon: <Brain className="w-3.5 h-3.5 text-indigo-400" /> },
    { id: 'vitality', label: 'Prana & Energy', icon: <Zap className="w-3.5 h-3.5 text-emerald-400" /> },
    { id: 'sleep', label: 'Sleep & Shanti', icon: <Moon className="w-3.5 h-3.5 text-blue-400" /> },
    { id: 'quick', label: 'Quick Resets', icon: <Clock className="w-3.5 h-3.5 text-amber-300" /> },
  ];

  const filteredPrograms = PREPARED_PROGRAMS.filter((prog) => {
    const matchesCategory = selectedCategory === 'all' || prog.category === selectedCategory;
    if (!matchesCategory) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = prog.title.toLowerCase().includes(q);
      const matchSanskrit = prog.sanskritTitle?.toLowerCase().includes(q) || false;
      const matchDesc = prog.description.toLowerCase().includes(q);
      const matchBenefits = prog.benefits.some((b) => b.toLowerCase().includes(q));
      const matchStages = prog.stages.some(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.nestedStages?.some((ns) => ns.title.toLowerCase().includes(q))
      );
      return matchTitle || matchSanskrit || matchDesc || matchBenefits || matchStages;
    }

    return true;
  });

  // Spotlight program: Kundalini Jagran
  const spotlightProgram = PREPARED_PROGRAMS[0];

  return (
    <div className="space-y-6">
      {/* Featured Hero: Kundalini Jagran Sadhana */}
      {selectedCategory === 'all' && !searchQuery && spotlightProgram && (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1A1828] via-[#12111E] to-[#0A0D18] border border-amber-500/30 p-5 shadow-2xl shadow-amber-500/10">
          {/* Subtle Spiritual Mandala Glow */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                <Flame className="w-3 h-3 fill-amber-400" />
                <span>FEATURED CLASSICAL SADHANA</span>
              </span>
              <span className="font-mono text-[9px] text-slate-400 bg-white/[0.06] px-2 py-0.5 rounded-full">
                {spotlightProgram.difficulty}
              </span>
            </div>

            <p className="font-serif text-sm font-bold text-amber-300/90 tracking-wider">
              {spotlightProgram.sanskritTitle}
            </p>
            <h2 className="text-xl font-extrabold text-white tracking-tight mt-0.5">
              {spotlightProgram.title}
            </h2>
            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed max-w-sm">
              Awaken dormant bio-spiritual energy at Muladhara and channel it through the Sushumna Nadi to Sahasrara with Agnisar, Bhastrika, and Maha Bandha.
            </p>

            <div className="flex items-center gap-4 mt-3 text-xs font-mono text-slate-400">
              <span className="text-amber-400 font-bold flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {formatDurationHuman(calculateTotalDuration(spotlightProgram.stages))}
              </span>
              <span>{spotlightProgram.stages.length} Guided Steps</span>
              <span className="text-indigo-300 hidden sm:inline">Chakra: {spotlightProgram.chakra}</span>
            </div>

            {/* Quick Hero Actions */}
            <div className="flex items-center gap-2.5 mt-4">
              <button
                onClick={() => onStartProgram(spotlightProgram)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-mono font-bold text-xs uppercase tracking-wider transition-all active:scale-95 shadow-lg shadow-amber-500/30"
              >
                <Play className="w-3.5 h-3.5 fill-black" />
                <span>Begin Sadhana</span>
              </button>
              <button
                onClick={() => setSelectedProgramForDetails(spotlightProgram)}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-slate-200 text-xs font-mono font-semibold transition-colors"
              >
                <span>View Full Steps</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search Input Bar */}
      <div className="relative">
        <div className="flex items-center bg-[#111628] border border-white/[0.08] focus-within:border-amber-500/40 rounded-2xl px-3.5 py-2.5 text-xs transition-all shadow-inner">
          <Search className="w-4 h-4 text-slate-400 mr-2.5 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search programs by goal, Sanskrit name, kriya..."
            className="w-full bg-transparent text-white placeholder-slate-500 focus:outline-none font-sans"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-slate-400 hover:text-white text-xs px-1 font-mono"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Category Filter Chips */}
      <div>
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-bold tracking-wide whitespace-nowrap transition-all active:scale-95 shrink-0 border ${
                  isSelected
                    ? 'bg-amber-500 text-black border-amber-500 shadow-md shadow-amber-500/20'
                    : 'bg-[#111628] text-slate-300 border-white/[0.08] hover:border-amber-500/30 hover:text-white'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Program Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-400">
            {selectedCategory === 'all'
              ? `Prepared Yogic Programs (${filteredPrograms.length})`
              : `${categories.find((c) => c.id === selectedCategory)?.label} (${filteredPrograms.length})`}
          </span>
          <span className="font-mono text-[10px] text-amber-500">
            Step-by-Step Guided
          </span>
        </div>

        {filteredPrograms.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {filteredPrograms.map((program) => (
              <ProgramCard
                key={program.id}
                program={program}
                onStart={onStartProgram}
                onViewDetails={(p) => setSelectedProgramForDetails(p)}
                onCustomize={onCustomizeProgram}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 px-4 bg-[#101424] rounded-2xl border border-dashed border-white/[0.08]">
            <Brain className="w-8 h-8 text-slate-500 mx-auto mb-2" />
            <p className="text-sm font-semibold text-white">No Programs Found</p>
            <p className="text-xs text-slate-400 mt-1">
              Try searching with another keyword like "Kundalini", "Memory", "Kapalabhati", or "Brain".
            </p>
          </div>
        )}
      </div>

      {/* Program Detail Modal */}
      <ProgramDetailModal
        program={selectedProgramForDetails}
        isOpen={!!selectedProgramForDetails}
        onClose={() => setSelectedProgramForDetails(null)}
        onStartProgram={(p) => {
          setSelectedProgramForDetails(null);
          onStartProgram(p);
        }}
        onCopyToMyRoutines={(p) => {
          setSelectedProgramForDetails(null);
          onCustomizeProgram(p);
        }}
      />
    </div>
  );
};
