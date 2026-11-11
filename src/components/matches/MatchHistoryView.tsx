import React, { useState } from 'react';
import { Match, Season } from '../../types/career';
import { MatchFormModal } from './MatchFormModal';
import {
  Plus,
  Search,
  Filter,
  Calendar,
  Award,
  Edit2,
  Trash2,
  Table as TableIcon,
  LayoutGrid,
  TrendingUp,
  MapPin,
} from 'lucide-react';

interface MatchHistoryViewProps {
  matches: Match[];
  seasons: Season[];
  activeSeasonId: string;
  onSelectSeason: (id: string) => void;
  onAddMatch: (match: Omit<Match, 'id'>) => void;
  onUpdateMatch: (id: string, match: Partial<Match>) => void;
  onDeleteMatch: (id: string) => void;
  onPlaySimulatorClick: () => void;
}

export const MatchHistoryView: React.FC<MatchHistoryViewProps> = ({
  matches,
  seasons,
  activeSeasonId,
  onSelectSeason,
  onAddMatch,
  onUpdateMatch,
  onDeleteMatch,
  onPlaySimulatorClick,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [resultFilter, setResultFilter] = useState<'all' | 'W' | 'D' | 'L'>('all');
  const [venueFilter, setVenueFilter] = useState<'all' | 'Home' | 'Away' | 'Neutral'>('all');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);

  const filtered = matches.filter((m) => {
    if (resultFilter !== 'all' && m.result !== resultFilter) return false;
    if (venueFilter !== 'all' && m.venue !== venueFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return m.opponent.toLowerCase().includes(q) || m.competition.toLowerCase().includes(q);
    }
    return true;
  });

  const handleEdit = (m: Match) => {
    setEditingMatch(m);
    setIsFormOpen(true);
  };

  const handleAdd = () => {
    setEditingMatch(null);
    setIsFormOpen(true);
  };

  const getResultBadge = (res: 'W' | 'D' | 'L') => {
    switch (res) {
      case 'W':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'D':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'L':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black font-display text-white">Competitive Match History</h2>
          <p className="text-xs sm:text-sm text-slate-400">
            {filtered.length} match fixtures logged ({matches.filter((m) => m.result === 'W').length} Wins,{' '}
            {matches.filter((m) => m.result === 'D').length} Draws,{' '}
            {matches.filter((m) => m.result === 'L').length} Losses)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onPlaySimulatorClick}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-emerald-400 hover:text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Play Matchday
          </button>

          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Log Match Record
          </button>
        </div>
      </div>

      {/* Filter and View Toggles */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 p-3 bg-slate-900/60 border border-slate-800 rounded-2xl">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          {/* Season Filter Dropdown */}
          <select
            value={activeSeasonId}
            onChange={(e) => onSelectSeason(e.target.value)}
            className="bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400 font-semibold"
          >
            <option value="all">All Seasons (All-Time)</option>
            {seasons.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.club})
              </option>
            ))}
          </select>

          {/* Result Filter Tabs */}
          <div className="flex items-center gap-1 p-0.5 bg-slate-950 border border-slate-800 rounded-xl">
            {(['all', 'W', 'D', 'L'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setResultFilter(r)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
                  resultFilter === r
                    ? r === 'W'
                      ? 'bg-emerald-500 text-slate-950'
                      : r === 'D'
                      ? 'bg-amber-400 text-slate-950'
                      : r === 'L'
                      ? 'bg-rose-500 text-white'
                      : 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {r === 'all' ? 'All' : r}
              </button>
            ))}
          </div>

          {/* Venue Tabs */}
          <div className="flex items-center gap-1 p-0.5 bg-slate-950 border border-slate-800 rounded-xl">
            {(['all', 'Home', 'Away', 'Neutral'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setVenueFilter(v)}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors ${
                  venueFilter === v ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {v === 'all' ? 'All Venues' : v}
              </button>
            ))}
          </div>
        </div>

        {/* Search & Layout toggle */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-56">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search opponent / competition..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="flex items-center p-1 bg-slate-950 border border-slate-800 rounded-xl">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg ${
                viewMode === 'table' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Table View"
            >
              <TableIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-lg ${
                viewMode === 'cards' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Card Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Content Rendering: Table or Cards */}
      {viewMode === 'table' ? (
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/70 text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                  <th className="py-3 px-4">Result</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Opponent</th>
                  <th className="py-3 px-4">Competition</th>
                  <th className="py-3 px-4 text-center">Score</th>
                  <th className="py-3 px-4 text-center">Min</th>
                  <th className="py-3 px-4 text-center">G</th>
                  <th className="py-3 px-4 text-center">A</th>
                  <th className="py-3 px-4 text-center">Rating</th>
                  <th className="py-3 px-4 text-center">MOTM</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {filtered.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-800/40 transition-colors group">
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded font-display font-black text-xs border ${getResultBadge(
                          m.result
                        )}`}
                      >
                        {m.result}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-400 text-[11px] whitespace-nowrap">
                      {m.date}
                    </td>
                    <td className="py-3 px-4 font-bold text-white whitespace-nowrap">
                      {m.opponent}
                      <span className="text-[10px] text-slate-500 font-mono ml-1.5">
                        ({m.venue === 'Home' ? 'H' : m.venue === 'Away' ? 'A' : 'N'})
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-300 truncate max-w-[150px]">{m.competition}</td>
                    <td className="py-3 px-4 text-center font-display font-bold text-white tabular-nums">
                      {m.teamScore} - {m.opponentScore}
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-slate-400 tabular-nums">
                      {m.minutesPlayed}'
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-emerald-400 tabular-nums">
                      {m.goals > 0 ? m.goals : '-'}
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-amber-400 tabular-nums">
                      {m.assists > 0 ? m.assists : '-'}
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-purple-400 tabular-nums">
                      {m.matchRating.toFixed(1)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {m.manOfTheMatch ? (
                        <span title="Man of the Match">
                          <Award className="w-4 h-4 text-amber-400 mx-auto" />
                        </span>
                      ) : (
                        <span className="text-slate-600">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1 opacity-80 group-hover:opacity-100">
                        <button
                          onClick={() => handleEdit(m)}
                          className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
                          title="Edit Match"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete match against ${m.opponent}?`)) {
                              onDeleteMatch(m.id);
                            }
                          }}
                          className="p-1 text-slate-500 hover:text-rose-400 rounded hover:bg-slate-800 transition-colors"
                          title="Delete Match"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Cards View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((m) => (
            <div
              key={m.id}
              className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 hover:border-slate-700 transition-all space-y-3"
            >
              <div className="flex items-center justify-between">
                <span
                  className={`px-2 py-0.5 rounded font-display font-black text-xs border ${getResultBadge(
                    m.result
                  )}`}
                >
                  {m.result === 'W' ? 'Victory' : m.result === 'D' ? 'Draw' : 'Loss'}
                </span>
                <span className="text-[11px] font-mono text-slate-400">{m.date}</span>
              </div>

              <div className="flex items-center justify-between py-1">
                <div>
                  <h4 className="font-bold text-white text-base">{m.opponent}</h4>
                  <p className="text-xs text-slate-400">
                    {m.competition} · {m.venue}
                  </p>
                </div>
                <div className="text-xl font-black font-display text-white tabular-nums">
                  {m.teamScore} - {m.opponentScore}
                </div>
              </div>

              {/* Individual stats strip */}
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 flex items-center justify-around text-center text-xs">
                <div>
                  <span className="text-slate-500 text-[10px] block">Goals</span>
                  <span className="font-bold text-emerald-400 tabular-nums">{m.goals}</span>
                </div>
                <div className="w-px h-6 bg-slate-800" />
                <div>
                  <span className="text-slate-500 text-[10px] block">Assists</span>
                  <span className="font-bold text-amber-400 tabular-nums">{m.assists}</span>
                </div>
                <div className="w-px h-6 bg-slate-800" />
                <div>
                  <span className="text-slate-500 text-[10px] block">Rating</span>
                  <span className="font-bold text-purple-400 tabular-nums font-mono">
                    {m.matchRating.toFixed(1)}
                  </span>
                </div>
                <div className="w-px h-6 bg-slate-800" />
                <div>
                  <span className="text-slate-500 text-[10px] block">MOTM</span>
                  <span className="font-bold text-slate-300">
                    {m.manOfTheMatch ? <Award className="w-3.5 h-3.5 text-amber-400 mx-auto inline" /> : 'No'}
                  </span>
                </div>
              </div>

              {m.summary && (
                <p className="text-xs text-slate-400 italic line-clamp-2">"{m.summary}"</p>
              )}

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800/80">
                <button
                  onClick={() => handleEdit(m)}
                  className="px-2.5 py-1 text-xs text-slate-300 hover:text-white bg-slate-800 rounded-lg"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    if (window.confirm(`Delete match against ${m.opponent}?`)) {
                      onDeleteMatch(m.id);
                    }
                  }}
                  className="px-2.5 py-1 text-xs text-rose-400 hover:text-rose-300 bg-rose-500/10 rounded-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {filtered.length === 0 && (
        <div className="py-12 text-center border border-dashed border-slate-800 rounded-2xl">
          <Calendar className="w-10 h-10 text-slate-600 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-400">No match records found</p>
          <p className="text-xs text-slate-500 mt-1">Try adjusting the filter or record your first match!</p>
        </div>
      )}

      {/* Form Modal */}
      <MatchFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={(m) => {
          if (editingMatch) {
            onUpdateMatch(editingMatch.id, m);
          } else {
            onAddMatch(m);
          }
        }}
        initialMatch={editingMatch}
        seasons={seasons}
        defaultSeasonId={activeSeasonId === 'all' ? seasons[0]?.id : activeSeasonId}
      />
    </div>
  );
};
