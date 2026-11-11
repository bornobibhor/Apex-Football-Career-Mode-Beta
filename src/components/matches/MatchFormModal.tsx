import React, { useState, useEffect } from 'react';
import { Match, Season, CompetitionCategory, MatchResult, VenueType } from '../../types/career';
import { X, Save, Calendar, Shield, Award } from 'lucide-react';

interface MatchFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (match: Omit<Match, 'id'>) => void;
  initialMatch?: Match | null;
  seasons: Season[];
  defaultSeasonId?: string;
}

export const MatchFormModal: React.FC<MatchFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialMatch,
  seasons,
  defaultSeasonId,
}) => {
  const [formData, setFormData] = useState<Omit<Match, 'id'>>({
    seasonId: defaultSeasonId || seasons[0]?.id || 'season_default',
    date: new Date().toISOString().slice(0, 10),
    opponent: '',
    competition: 'Premier League',
    competitionCategory: 'league',
    venue: 'Home',
    teamScore: 2,
    opponentScore: 1,
    result: 'W',
    minutesPlayed: 90,
    goals: 1,
    assists: 0,
    matchRating: 8.0,
    cleanSheet: false,
    yellowCards: 0,
    redCards: 0,
    penaltiesScored: 0,
    penaltiesMissed: 0,
    freeKickGoals: 0,
    hatTrick: false,
    manOfTheMatch: false,
    summary: '',
  });

  useEffect(() => {
    if (initialMatch) {
      const { id, ...rest } = initialMatch;
      setFormData(rest);
    } else {
      setFormData({
        seasonId: defaultSeasonId || seasons[0]?.id || 'season_default',
        date: new Date().toISOString().slice(0, 10),
        opponent: '',
        competition: 'Domestic League',
        competitionCategory: 'league',
        venue: 'Home',
        teamScore: 2,
        opponentScore: 1,
        result: 'W',
        minutesPlayed: 90,
        goals: 1,
        assists: 0,
        matchRating: 8.0,
        cleanSheet: false,
        yellowCards: 0,
        redCards: 0,
        penaltiesScored: 0,
        penaltiesMissed: 0,
        freeKickGoals: 0,
        hatTrick: false,
        manOfTheMatch: false,
        summary: '',
      });
    }
  }, [initialMatch, defaultSeasonId, seasons, isOpen]);

  if (!isOpen) return null;

  // Auto-calculate result when scores change
  const handleScoreChange = (team: number, opp: number) => {
    let res: MatchResult = 'D';
    if (team > opp) res = 'W';
    else if (team < opp) res = 'L';

    setFormData((prev) => ({
      ...prev,
      teamScore: team,
      opponentScore: opp,
      result: res,
      cleanSheet: opp === 0,
    }));
  };

  const handleGoalsChange = (g: number) => {
    setFormData((prev) => ({
      ...prev,
      goals: g,
      hatTrick: g >= 3,
      manOfTheMatch: g >= 2 || (g >= 1 && prev.assists >= 1) ? true : prev.manOfTheMatch,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.opponent.trim()) return;
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0b0f19] border border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="text-base font-bold text-white font-display">
                {initialMatch ? 'Edit Match Record' : 'Record New Match Performance'}
              </h2>
              <p className="text-xs text-slate-400">Log scoreline, individual output, minutes, and rating</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
          {/* Row 1: Season, Date, Venue */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Season</label>
              <select
                value={formData.seasonId}
                onChange={(e) => setFormData({ ...formData, seasonId: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
              >
                {seasons.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.club})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Match Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Venue</label>
              <div className="flex gap-1.5">
                {(['Home', 'Away', 'Neutral'] as VenueType[]).map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setFormData({ ...formData, venue: v })}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all ${
                      formData.venue === v
                        ? 'bg-amber-400 text-slate-950 border-amber-400'
                        : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Row 2: Opponent & Competition */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Opponent Club / Nation</label>
              <input
                type="text"
                placeholder="e.g. Manchester City, Barcelona, Chelsea..."
                value={formData.opponent}
                onChange={(e) => setFormData({ ...formData, opponent: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Competition</label>
              <input
                type="text"
                placeholder="e.g. UEFA Champions League, Premier League, FA Cup"
                value={formData.competition}
                onChange={(e) => {
                  const comp = e.target.value;
                  let cat: CompetitionCategory = 'league';
                  if (/champions|europa|conference|super cup/i.test(comp)) cat = 'continental';
                  else if (/fa cup|copa del rey|pokal|domestic cup/i.test(comp)) cat = 'domestic_cup';
                  else if (/world cup|euro|nations|copa america/i.test(comp)) cat = 'international';
                  else if (/friendly/i.test(comp)) cat = 'friendly';
                  setFormData({ ...formData, competition: comp, competitionCategory: cat });
                }}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                required
              />
            </div>
          </div>

          {/* Row 3: Scoreline */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <label className="block text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">
              Scoreline & Outcome
            </label>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="block text-xs text-slate-400 mb-1">Your Team Score</label>
                <input
                  type="number"
                  min="0"
                  max="20"
                  value={formData.teamScore}
                  onChange={(e) => handleScoreChange(parseInt(e.target.value) || 0, formData.opponentScore)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-base font-bold text-white text-center tabular-nums"
                />
              </div>

              <div className="text-xl font-bold text-slate-500 pt-5">:</div>

              <div className="flex-1">
                <label className="block text-xs text-slate-400 mb-1">Opponent Score</label>
                <input
                  type="number"
                  min="0"
                  max="20"
                  value={formData.opponentScore}
                  onChange={(e) => handleScoreChange(formData.teamScore, parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-base font-bold text-white text-center tabular-nums"
                />
              </div>

              <div className="w-28 pt-5">
                <div
                  className={`w-full py-2 rounded-xl text-center font-bold text-sm border ${
                    formData.result === 'W'
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                      : formData.result === 'D'
                      ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                      : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                  }`}
                >
                  {formData.result === 'W' ? 'Victory' : formData.result === 'D' ? 'Draw' : 'Defeat'}
                </div>
              </div>
            </div>
          </div>

          {/* Row 4: Individual Performance */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">
              Individual Player Performance
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs text-slate-300 mb-1">Minutes Played</label>
                <input
                  type="number"
                  min="1"
                  max="130"
                  value={formData.minutesPlayed}
                  onChange={(e) => setFormData({ ...formData, minutesPlayed: parseInt(e.target.value) || 90 })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white tabular-nums"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Goals Scored</label>
                <input
                  type="number"
                  min="0"
                  max="15"
                  value={formData.goals}
                  onChange={(e) => handleGoalsChange(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm font-bold text-emerald-400 tabular-nums"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Assists</label>
                <input
                  type="number"
                  min="0"
                  max="15"
                  value={formData.assists}
                  onChange={(e) => setFormData({ ...formData, assists: parseInt(e.target.value) || 0 })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm font-bold text-amber-400 tabular-nums"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Match Rating (1 - 10)</label>
                <input
                  type="number"
                  step="0.1"
                  min="1.0"
                  max="10.0"
                  value={formData.matchRating}
                  onChange={(e) => setFormData({ ...formData, matchRating: parseFloat(e.target.value) || 7.0 })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm font-bold text-purple-400 tabular-nums"
                />
              </div>
            </div>
          </div>

          {/* Row 5: Cards, Penalties, Free Kicks */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs text-slate-300 mb-1">Penalties Scored</label>
              <input
                type="number"
                min="0"
                max="5"
                value={formData.penaltiesScored}
                onChange={(e) => setFormData({ ...formData, penaltiesScored: parseInt(e.target.value) || 0 })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1">Free-Kick Goals</label>
              <input
                type="number"
                min="0"
                max="5"
                value={formData.freeKickGoals}
                onChange={(e) => setFormData({ ...formData, freeKickGoals: parseInt(e.target.value) || 0 })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1">Yellow Cards</label>
              <input
                type="number"
                min="0"
                max="2"
                value={formData.yellowCards}
                onChange={(e) => setFormData({ ...formData, yellowCards: parseInt(e.target.value) || 0 })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-yellow-400"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1">Red Cards</label>
              <input
                type="number"
                min="0"
                max="1"
                value={formData.redCards}
                onChange={(e) => setFormData({ ...formData, redCards: parseInt(e.target.value) || 0 })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-rose-500"
              />
            </div>
          </div>

          {/* MOTM & Clean Sheet Checkboxes */}
          <div className="flex flex-wrap items-center gap-6 pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-200">
              <input
                type="checkbox"
                checked={formData.manOfTheMatch}
                onChange={(e) => setFormData({ ...formData, manOfTheMatch: e.target.checked })}
                className="w-4 h-4 rounded accent-amber-400 cursor-pointer"
              />
              <span className="flex items-center gap-1">
                <Award className="w-4 h-4 text-amber-400" />
                Man of the Match Award
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-200">
              <input
                type="checkbox"
                checked={formData.cleanSheet}
                onChange={(e) => setFormData({ ...formData, cleanSheet: e.target.checked })}
                className="w-4 h-4 rounded accent-emerald-400 cursor-pointer"
              />
              <span>Team Kept Clean Sheet</span>
            </label>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Match Summary / Highlights</label>
            <input
              type="text"
              placeholder="e.g. Scored stoppage time winner, sensational curler into top right corner..."
              value={formData.summary || ''}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              {initialMatch ? 'Update Match' : 'Save Match'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
