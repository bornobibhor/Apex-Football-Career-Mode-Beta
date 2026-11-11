import React, { useState, useEffect } from 'react';
import { Trophy, TrophyCategory, Season } from '../../types/career';
import { TrophyIcon } from '../common/TrophyIcon';
import { X, Save, Trophy as TrophyIconLucide, Trash2, CheckCircle2 } from 'lucide-react';

interface TrophyModalProps {
  isOpen: boolean;
  onClose: () => void;
  trophy: Trophy | null;
  seasons: Season[];
  onSave: (updates: Partial<Trophy>) => void;
  onUnlock: (seasonWon: string, dateWon: string, club: string) => void;
  onRemove: (trophyId: string) => void;
}

export const TrophyModal: React.FC<TrophyModalProps> = ({
  isOpen,
  onClose,
  trophy,
  seasons,
  onSave,
  onUnlock,
  onRemove,
}) => {
  const [seasonWon, setSeasonWon] = useState(seasons[0]?.name || '2025/26');
  const [dateWon, setDateWon] = useState(new Date().toISOString().slice(0, 10));
  const [club, setClub] = useState(seasons[0]?.club || 'Real Madrid');
  const [count, setCount] = useState(1);
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (trophy) {
      setSeasonWon(trophy.seasonWon || seasons[0]?.name || '2025/26');
      setDateWon(trophy.dateWon || new Date().toISOString().slice(0, 10));
      setClub(trophy.club || seasons[0]?.club || 'Real Madrid');
      setCount(trophy.count || 1);
      setDescription(trophy.description || '');
    }
  }, [trophy, seasons]);

  if (!isOpen || !trophy) return null;

  const handleUnlockOrSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (trophy.isUnlocked) {
      onSave({
        seasonWon,
        dateWon,
        club,
        count,
        description,
      });
    } else {
      onUnlock(seasonWon, dateWon, club);
    }
    onClose();
  };

  const handleLockTrophy = () => {
    onRemove(trophy.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0b0f19] border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-2">
            <TrophyIconLucide className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="text-base font-bold text-white font-display">{trophy.name}</h2>
              <p className="text-xs text-slate-400">{trophy.competition}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleUnlockOrSave} className="p-6 space-y-5">
          {/* Trophy Visual Showcase Centerpiece */}
          <div className="flex flex-col items-center justify-center p-6 bg-slate-950 rounded-2xl border border-slate-800 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-amber-500/10 via-transparent to-transparent pointer-events-none" />
            <TrophyIcon
              iconName={trophy.iconName}
              className="w-24 h-24 drop-shadow-[0_0_25px_rgba(234,179,8,0.35)]"
              unlocked={trophy.isUnlocked}
            />
            <div className="text-center mt-3">
              <span
                className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                  trophy.isUnlocked
                    ? 'bg-amber-400/20 text-amber-300 border-amber-400/30'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                {trophy.isUnlocked ? `Unlocked (${trophy.count || 1}x Won)` : 'Locked Trophy'}
              </span>
              <p className="text-xs text-slate-400 mt-2 max-w-sm">{trophy.description}</p>
            </div>
          </div>

          {/* Form fields */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Season Won</label>
                <select
                  value={seasonWon}
                  onChange={(e) => setSeasonWon(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
                >
                  {seasons.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Date Won</label>
                <input
                  type="date"
                  value={dateWon}
                  onChange={(e) => setDateWon(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Club / Team</label>
                <input
                  type="text"
                  value={club}
                  onChange={(e) => setClub(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Times Won (Count)</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={count}
                  onChange={(e) => setCount(parseInt(e.target.value) || 1)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Custom Notes / Story</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
                placeholder="Memorable moments from the final or campaign..."
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-800">
            {trophy.isUnlocked ? (
              <button
                type="button"
                onClick={handleLockTrophy}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Remove from Cabinet
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                {trophy.isUnlocked ? 'Update Silverware' : 'Unlock & Add to Cabinet'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
