import React, { useState } from 'react';
import { Season, Match } from '../../types/career';
import { X, Plus, Calendar, Edit2, Trash2, CheckCircle2, Shield } from 'lucide-react';

interface ManageSeasonsModalProps {
  isOpen: boolean;
  onClose: () => void;
  seasons: Season[];
  matches: Match[];
  activeSeasonId: string;
  onSelectSeason: (id: string) => void;
  onAddSeason: (season: Omit<Season, 'id'>) => void;
  onUpdateSeason: (id: string, season: Partial<Season>) => void;
  onDeleteSeason: (id: string) => void;
}

export const ManageSeasonsModal: React.FC<ManageSeasonsModalProps> = ({
  isOpen,
  onClose,
  seasons,
  matches,
  activeSeasonId,
  onSelectSeason,
  onAddSeason,
  onUpdateSeason,
  onDeleteSeason,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [name, setName] = useState('2027/28');
  const [club, setClub] = useState(seasons[seasons.length - 1]?.club || 'Real Madrid');
  const [league, setLeague] = useState(seasons[seasons.length - 1]?.league || 'La Liga EA Sports');
  const [shirtNumber, setShirtNumber] = useState(seasons[seasons.length - 1]?.shirtNumber || 9);
  const [isCurrent, setIsCurrent] = useState(false);
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleStartAdd = () => {
    setIsAdding(true);
    setEditingId(null);
    setName(`202${seasons.length + 4}/2${seasons.length + 5}`);
    setNotes('');
  };

  const handleStartEdit = (s: Season) => {
    setEditingId(s.id);
    setIsAdding(false);
    setName(s.name);
    setClub(s.club);
    setLeague(s.league);
    setShirtNumber(s.shirtNumber);
    setIsCurrent(s.isCurrent);
    setNotes(s.notes || '');
  };

  const handleSaveSeason = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingId) {
      onUpdateSeason(editingId, {
        name,
        club,
        league,
        shirtNumber,
        isCurrent,
        notes,
      });
      setEditingId(null);
    } else {
      onAddSeason({
        name,
        club,
        league,
        shirtNumber,
        isCurrent,
        notes,
      });
      setIsAdding(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0b0f19] border border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="text-base font-bold text-white font-display">Season Management</h2>
              <p className="text-xs text-slate-400">
                Organize campaigns, clubs, shirt numbers, and performance periods
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Add / Edit Form */}
          {(isAdding || editingId) ? (
            <form onSubmit={handleSaveSeason} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  {editingId ? 'Edit Season Details' : 'Create New Season'}
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setIsAdding(false);
                    setEditingId(null);
                  }}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Season Name (e.g. 2027/28)</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-300 mb-1">Club Represented</label>
                  <input
                    type="text"
                    value={club}
                    onChange={(e) => setClub(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-300 mb-1">Domestic League</label>
                  <input
                    type="text"
                    value={league}
                    onChange={(e) => setLeague(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-300 mb-1">Shirt Number</label>
                  <input
                    type="number"
                    min="1"
                    max="99"
                    value={shirtNumber}
                    onChange={(e) => setShirtNumber(parseInt(e.target.value) || 9)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Season Objectives / Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Aiming for continental double, defending title..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isCurrentCheck"
                  checked={isCurrent}
                  onChange={(e) => setIsCurrent(e.target.checked)}
                  className="w-4 h-4 rounded accent-amber-400 cursor-pointer"
                />
                <label htmlFor="isCurrentCheck" className="text-xs font-semibold text-slate-300 cursor-pointer">
                  Mark as active current season
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold rounded-xl text-xs hover:from-amber-300 hover:to-amber-400 transition-all cursor-pointer"
                >
                  {editingId ? 'Save Updates' : 'Add Season'}
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={handleStartAdd}
              className="w-full py-3 bg-slate-900/90 hover:bg-slate-800 border border-dashed border-slate-700 hover:border-amber-400 text-amber-400 hover:text-amber-300 font-semibold rounded-2xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Create New Football Season
            </button>
          )}

          {/* List of existing seasons */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Recorded Seasons ({seasons.length})
            </h3>
            {seasons.map((s) => {
              const sMatches = matches.filter((m) => m.seasonId === s.id);
              const goals = sMatches.reduce((acc, m) => acc + (m.goals || 0), 0);
              const assists = sMatches.reduce((acc, m) => acc + (m.assists || 0), 0);
              const isSelected = activeSeasonId === s.id;

              return (
                <div
                  key={s.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isSelected
                      ? 'bg-amber-400/10 border-amber-400/40'
                      : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-display font-black text-amber-400 text-sm">
                        #{s.shirtNumber}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-white text-base">{s.name}</span>
                          {s.isCurrent && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                              Current Campaign
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-400">
                          {s.club} · {s.league}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          onSelectSeason(s.id);
                          onClose();
                        }}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all ${
                          isSelected
                            ? 'bg-amber-400 text-slate-950 border-amber-400'
                            : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
                        }`}
                      >
                        {isSelected ? 'Active View' : 'Select'}
                      </button>

                      <button
                        onClick={() => handleStartEdit(s)}
                        className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                        title="Edit Season"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      {seasons.length > 1 && (
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete season ${s.name}? This will also delete its logged matches.`)) {
                              onDeleteSeason(s.id);
                            }
                          }}
                          className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800"
                          title="Delete Season"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Quick Season Stats pill */}
                  <div className="flex items-center gap-4 mt-3 pt-2 border-t border-slate-800/80 text-xs font-mono text-slate-400">
                    <span>Matches: <b className="text-white">{sMatches.length}</b></span>
                    <span>Goals: <b className="text-emerald-400">{goals}</b></span>
                    <span>Assists: <b className="text-amber-400">{assists}</b></span>
                    {s.notes && <span className="text-slate-500 truncate max-w-xs italic">{s.notes}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
