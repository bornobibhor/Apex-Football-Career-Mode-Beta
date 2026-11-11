import React, { useState } from 'react';
import { TransferRecord, Season, Match, Trophy } from '../../types/career';
import { Plus, ArrowRight, DollarSign, Calendar, Shield, Trash2, Edit2, X, Save } from 'lucide-react';

interface TransfersViewProps {
  transfers: TransferRecord[];
  seasons: Season[];
  matches: Match[];
  trophies: Trophy[];
  onAddTransfer: (transfer: Omit<TransferRecord, 'id'>) => void;
  onUpdateTransfer: (id: string, transfer: Partial<TransferRecord>) => void;
  onDeleteTransfer: (id: string) => void;
}

export const TransfersView: React.FC<TransfersViewProps> = ({
  transfers,
  seasons,
  matches,
  trophies,
  onAddTransfer,
  onUpdateTransfer,
  onDeleteTransfer,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [season, setSeason] = useState(seasons[0]?.name || '2026/27');
  const [fromClub, setFromClub] = useState('Arsenal FC');
  const [toClub, setToClub] = useState('Real Madrid');
  const [fee, setFee] = useState('€100,000,000');
  const [shirtNumber, setShirtNumber] = useState(9);
  const [role, setRole] = useState('Franchise Player');
  const [notes, setNotes] = useState('');

  const sortedTransfers = [...transfers].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const handleOpenAdd = () => {
    setEditingId(null);
    setDate(new Date().toISOString().slice(0, 10));
    setFromClub('');
    setToClub('');
    setFee('Free Transfer');
    setShirtNumber(9);
    setRole('Crucial First Team');
    setNotes('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (t: TransferRecord) => {
    setEditingId(t.id);
    setDate(t.date);
    setSeason(t.season);
    setFromClub(t.fromClub);
    setToClub(t.toClub);
    setFee(t.fee);
    setShirtNumber(t.shirtNumber);
    setRole(t.role);
    setNotes(t.notes || '');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!toClub.trim()) return;

    if (editingId) {
      onUpdateTransfer(editingId, {
        date,
        season,
        fromClub,
        toClub,
        fee,
        shirtNumber,
        role,
        notes,
      });
    } else {
      onAddTransfer({
        date,
        season,
        fromClub: fromClub || 'Youth Academy',
        toClub,
        fee: fee || 'Free Transfer',
        shirtNumber,
        role: role || 'First Team',
        notes,
      });
    }

    setIsModalOpen(false);
  };

  // Helper to calculate statistics at each club
  const getClubStats = (clubName: string) => {
    const clubMatches = matches.filter((m) => {
      const s = seasons.find((sec) => sec.id === m.seasonId);
      return s?.club.toLowerCase() === clubName.toLowerCase();
    });
    const apps = clubMatches.length;
    const goals = clubMatches.reduce((acc, m) => acc + (m.goals || 0), 0);
    const assists = clubMatches.reduce((acc, m) => acc + (m.assists || 0), 0);
    const trophiesCount = trophies.filter(
      (t) => t.isUnlocked && t.club?.toLowerCase() === clubName.toLowerCase()
    ).length;

    return { apps, goals, assists, trophiesCount };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black font-display text-white">Club Career & Transfer History</h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Chronological log of clubs represented, transfer fees, squad numbers, and silverware won per tenure
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow-md transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Log Club Transfer
        </button>
      </div>

      {/* Transfer Timeline Cards */}
      <div className="space-y-4">
        {sortedTransfers.map((t, index) => {
          const statsAtNewClub = getClubStats(t.toClub);

          return (
            <div
              key={t.id}
              className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all space-y-4"
            >
              {/* Top row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span>Transfer Date: {t.date}</span>
                  <span aria-hidden="true">·</span>
                  <span>Season {t.season}</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-emerald-400 font-mono bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                    Fee: {t.fee}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(t)}
                      className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('Delete this transfer entry?')) {
                          onDeleteTransfer(t.id);
                        }
                      }}
                      className="p-1 text-slate-500 hover:text-rose-400 rounded hover:bg-slate-800"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Center Transfer Flow Banner */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-1">
                {/* Previous Club */}
                <div className="flex-1 bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase block font-semibold">From Club</span>
                  <span className="text-base font-bold text-slate-300 font-display">{t.fromClub}</span>
                </div>

                <div className="hidden md:flex items-center justify-center text-amber-400 shrink-0">
                  <ArrowRight className="w-6 h-6" />
                </div>

                {/* Destination Club */}
                <div className="flex-1 bg-slate-950 p-3.5 rounded-xl border border-amber-500/30">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-amber-400 uppercase block font-semibold">To Club (New Tenure)</span>
                    <span className="text-xs font-mono font-bold text-amber-400">Kit #{t.shirtNumber}</span>
                  </div>
                  <span className="text-lg font-black text-white font-display">{t.toClub}</span>
                  <span className="text-xs text-slate-400 block mt-0.5">{t.role}</span>
                </div>
              </div>

              {/* Statistics during this Club Tenure */}
              <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 block">Club Appearances</span>
                  <span className="font-bold text-white text-sm tabular-nums font-mono">{statsAtNewClub.apps}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Club Goals</span>
                  <span className="font-bold text-emerald-400 text-sm tabular-nums font-mono">
                    {statsAtNewClub.goals}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Club Assists</span>
                  <span className="font-bold text-amber-400 text-sm tabular-nums font-mono">
                    {statsAtNewClub.assists}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Trophies Lifted</span>
                  <span className="font-bold text-yellow-300 text-sm tabular-nums font-mono">
                    {statsAtNewClub.trophiesCount}
                  </span>
                </div>
              </div>

              {t.notes && <p className="text-xs text-slate-400 italic">"{t.notes}"</p>}
            </div>
          );
        })}
      </div>

      {transfers.length === 0 && (
        <div className="py-12 text-center border border-dashed border-slate-800 rounded-2xl">
          <Shield className="w-10 h-10 text-slate-600 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-400">No transfers recorded yet</p>
          <p className="text-xs text-slate-500 mt-1">Log your first club move to trace your career journey!</p>
        </div>
      )}

      {/* Add / Edit Transfer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0b0f19] border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white font-display">
                {editingId ? 'Edit Transfer Record' : 'Log New Club Transfer'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Transfer Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Season</label>
                  <select
                    value={season}
                    onChange={(e) => setSeason(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
                  >
                    {seasons.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">From Club</label>
                  <input
                    type="text"
                    value={fromClub}
                    onChange={(e) => setFromClub(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
                    placeholder="Previous club..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">To Club</label>
                  <input
                    type="text"
                    value={toClub}
                    onChange={(e) => setToClub(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
                    placeholder="New signing club..."
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Transfer Fee</label>
                  <input
                    type="text"
                    value={fee}
                    onChange={(e) => setFee(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
                    placeholder="e.g. €85,000,000, Free Transfer"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Squad Number</label>
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
                <label className="block text-xs font-semibold text-slate-300 mb-1">Squad Role</label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
                  placeholder="e.g. Galáctico Striker, Crucial Starter..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Notes / Story</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
                  placeholder="Press conference details, contract length..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold rounded-xl text-xs hover:from-amber-300 hover:to-amber-400 transition-all cursor-pointer"
                >
                  {editingId ? 'Save Changes' : 'Record Transfer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
