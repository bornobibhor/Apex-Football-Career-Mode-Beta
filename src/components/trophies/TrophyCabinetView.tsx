import React, { useState } from 'react';
import { Trophy, TrophyCategory, Season } from '../../types/career';
import { TrophyIcon } from '../common/TrophyIcon';
import { TrophyModal } from './TrophyModal';
import { Trophy as TrophyIconLucide, Plus, Search, Filter, Lock, CheckCircle2, Sparkles, Award, X } from 'lucide-react';

interface TrophyCabinetViewProps {
  trophies: Trophy[];
  seasons: Season[];
  onUnlockTrophy: (trophyId: string, seasonWon: string, dateWon: string, club: string) => void;
  onUpdateTrophy: (trophyId: string, updates: Partial<Trophy>) => void;
  onAddCustomTrophy: (trophy: Omit<Trophy, 'id'>) => void;
  onRemoveTrophy: (trophyId: string) => void;
}

export const TrophyCabinetView: React.FC<TrophyCabinetViewProps> = ({
  trophies,
  seasons,
  onUnlockTrophy,
  onUpdateTrophy,
  onAddCustomTrophy,
  onRemoveTrophy,
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | TrophyCategory>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTrophy, setSelectedTrophy] = useState<Trophy | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);

  // Custom Trophy Creation state
  const [customName, setCustomName] = useState('');
  const [customCompetition, setCustomCompetition] = useState('');
  const [customCategory, setCustomCategory] = useState<TrophyCategory>('domestic');
  const [customDescription, setCustomDescription] = useState('');
  const [customIcon, setCustomIcon] = useState('trophy-cup');

  const unlockedCount = trophies.filter((t) => t.isUnlocked).length;
  const internationalCount = trophies.filter((t) => t.isUnlocked && t.category === 'international').length;
  const continentalCount = trophies.filter((t) => t.isUnlocked && t.category === 'continental').length;
  const domesticCount = trophies.filter((t) => t.isUnlocked && t.category === 'domestic').length;
  const individualCount = trophies.filter((t) => t.isUnlocked && t.category === 'individual').length;

  const filteredTrophies = trophies.filter((t) => {
    if (activeCategory !== 'all' && t.category !== activeCategory) return false;
    if (statusFilter === 'unlocked' && !t.isUnlocked) return false;
    if (statusFilter === 'locked' && t.isUnlocked) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return t.name.toLowerCase().includes(q) || t.competition.toLowerCase().includes(q);
    }
    return true;
  });

  const handleOpenTrophy = (t: Trophy) => {
    setSelectedTrophy(t);
    setIsModalOpen(true);
  };

  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    onAddCustomTrophy({
      name: customName,
      competition: customCompetition || customName,
      category: customCategory,
      description: customDescription || 'Custom career silverware accolade.',
      isUnlocked: true,
      count: 1,
      seasonWon: seasons[0]?.name || '2026/27',
      dateWon: new Date().toISOString().slice(0, 10),
      club: seasons[0]?.club || 'Real Madrid',
      iconName: customIcon,
    });

    setIsCustomModalOpen(false);
    setCustomName('');
    setCustomCompetition('');
    setCustomDescription('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & KPI Strip */}
      <div className="bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-950 border border-amber-500/30 rounded-3xl p-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400 flex items-center gap-1.5 mb-1">
              <Sparkles className="w-4 h-4" />
              Silverware Hall of Fame
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-display text-white">
              Trophy Cabinet & Honors
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Document every championship, cup triumph, and prestigious individual accolade earned throughout your career.
            </p>
          </div>

          <button
            onClick={() => setIsCustomModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow-md transition-all self-start md:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Custom Trophy
          </button>
        </div>

        {/* Milestone metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6 pt-5 border-t border-slate-800">
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-400 block">Total Silverware</span>
            <span className="text-xl font-black text-amber-300 font-display tabular-nums">{unlockedCount}</span>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-400 block">International</span>
            <span className="text-xl font-black text-white font-display tabular-nums">{internationalCount}</span>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-400 block">Continental UCL</span>
            <span className="text-xl font-black text-white font-display tabular-nums">{continentalCount}</span>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-400 block">Domestic League & Cup</span>
            <span className="text-xl font-black text-white font-display tabular-nums">{domesticCount}</span>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-400 block">Individual MVP Honors</span>
            <span className="text-xl font-black text-amber-400 font-display tabular-nums">{individualCount}</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Category tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-900/90 border border-slate-800 rounded-xl">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeCategory === 'all' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            All Silverware
          </button>
          <button
            onClick={() => setActiveCategory('international')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeCategory === 'international' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            International
          </button>
          <button
            onClick={() => setActiveCategory('continental')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeCategory === 'continental' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Continental
          </button>
          <button
            onClick={() => setActiveCategory('domestic')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeCategory === 'domestic' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Domestic
          </button>
          <button
            onClick={() => setActiveCategory('individual')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeCategory === 'individual' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Individual Awards
          </button>
        </div>

        {/* Search & Status filters */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 md:w-64">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search trophies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg ${
                statusFilter === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter('unlocked')}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg ${
                statusFilter === 'unlocked' ? 'bg-amber-400/20 text-amber-300 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Unlocked
            </button>
            <button
              onClick={() => setStatusFilter('locked')}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg ${
                statusFilter === 'locked' ? 'bg-slate-800 text-slate-300' : 'text-slate-400 hover:text-white'
              }`}
            >
              Locked
            </button>
          </div>
        </div>
      </div>

      {/* Trophies Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredTrophies.map((t) => {
          return (
            <div
              key={t.id}
              onClick={() => handleOpenTrophy(t)}
              className={`relative rounded-2xl p-5 flex flex-col items-center text-center cursor-pointer transition-all group overflow-hidden border ${
                t.isUnlocked
                  ? 'bg-gradient-to-b from-[#161d2d] via-slate-900 to-[#0a0d14] border-amber-500/30 hover:border-amber-400 shadow-[0_0_25px_rgba(234,179,8,0.15)] hover:scale-[1.02]'
                  : 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700 opacity-60 hover:opacity-90'
              }`}
            >
              {/* Gold radiance for unlocked */}
              {t.isUnlocked && (
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/15 via-transparent to-transparent pointer-events-none" />
              )}

              {/* Status and count badge */}
              <div className="w-full flex justify-between items-center mb-2 z-10">
                <span className="text-[10px] uppercase font-mono font-semibold tracking-wider text-slate-400">
                  {t.category}
                </span>

                {t.isUnlocked ? (
                  <span className="px-2 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/40 text-[10px] font-black text-amber-300 font-mono flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-amber-400" />
                    {t.count > 1 ? `x${t.count}` : 'Won'}
                  </span>
                ) : (
                  <span className="text-slate-600">
                    <Lock className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>

              {/* Trophy SVG Centerpiece */}
              <div className="w-20 h-20 my-2 flex items-center justify-center transition-transform group-hover:scale-110">
                <TrophyIcon iconName={t.iconName} className="w-16 h-16" unlocked={t.isUnlocked} />
              </div>

              {/* Trophy Details */}
              <div className="z-10 mt-1 w-full">
                <h4
                  className={`text-sm font-bold font-display line-clamp-1 ${
                    t.isUnlocked ? 'text-white group-hover:text-amber-300' : 'text-slate-400'
                  }`}
                >
                  {t.name}
                </h4>

                <p className="text-[11px] text-slate-400 truncate mt-0.5">{t.competition}</p>

                {t.isUnlocked ? (
                  <div className="mt-2 pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 flex items-center justify-center gap-1.5 font-mono">
                    <span className="text-amber-400 font-semibold">{t.seasonWon || 'Career'}</span>
                    <span aria-hidden="true">·</span>
                    <span className="truncate max-w-[80px]">{t.club || 'Club'}</span>
                  </div>
                ) : (
                  <div className="mt-2 pt-2 border-t border-slate-800/80 text-[10px] text-slate-500 font-mono">
                    Click to unlock
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredTrophies.length === 0 && (
        <div className="py-12 text-center border border-dashed border-slate-800 rounded-2xl">
          <TrophyIconLucide className="w-10 h-10 text-slate-600 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-400">No trophies match your active filter</p>
          <p className="text-xs text-slate-500 mt-1">Try clearing the search or category filter</p>
        </div>
      )}

      {/* Trophy Edit / Unlock Modal */}
      <TrophyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        trophy={selectedTrophy}
        seasons={seasons}
        onSave={(updates) => selectedTrophy && onUpdateTrophy(selectedTrophy.id, updates)}
        onUnlock={(seasonWon, dateWon, club) =>
          selectedTrophy && onUnlockTrophy(selectedTrophy.id, seasonWon, dateWon, club)
        }
        onRemove={(id) => onRemoveTrophy(id)}
      />

      {/* Add Custom Trophy Modal */}
      {isCustomModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0b0f19] border border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white font-display">Add Custom Trophy</h3>
              <button
                onClick={() => setIsCustomModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCustom} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Trophy Name</label>
                <input
                  type="text"
                  placeholder="e.g. Copa Libertadores, Golden Boy..."
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Competition</label>
                <input
                  type="text"
                  placeholder="e.g. CONMEBOL, UEFA, Ligue 1..."
                  value={customCompetition}
                  onChange={(e) => setCustomCompetition(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value as TrophyCategory)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
                  >
                    <option value="international">International</option>
                    <option value="continental">Continental</option>
                    <option value="domestic">Domestic</option>
                    <option value="individual">Individual Award</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Icon Style</label>
                  <select
                    value={customIcon}
                    onChange={(e) => setCustomIcon(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
                  >
                    <option value="trophy-cup">Classic Cup</option>
                    <option value="trophy-chalice">Chalice</option>
                    <option value="trophy-shield">Shield Plaque</option>
                    <option value="trophy-star">Golden Star</option>
                    <option value="trophy-golden-boot">Golden Boot</option>
                    <option value="trophy-ballon-dor">Ballon d'Or Globe</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Brief history of the award..."
                  value={customDescription}
                  onChange={(e) => setCustomDescription(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCustomModalOpen(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold rounded-xl text-xs hover:from-amber-300 hover:to-amber-400 transition-all cursor-pointer"
                >
                  Create Trophy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
