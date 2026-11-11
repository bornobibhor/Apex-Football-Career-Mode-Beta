import React from 'react';
import { Match } from '../../types/career';
import { Award, ChevronRight, Calendar, MapPin } from 'lucide-react';

interface RecentMatchesFeedProps {
  matches: Match[];
  onViewAllClick: () => void;
  onMatchClick: (match: Match) => void;
}

export const RecentMatchesFeed: React.FC<RecentMatchesFeedProps> = ({ matches, onViewAllClick, onMatchClick }) => {
  const recent = matches.slice(0, 5);

  const getResultStyle = (res: 'W' | 'D' | 'L') => {
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
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-white font-display">Recent Match Day Results</h3>
          <p className="text-xs text-slate-400">Latest recorded competitive fixtures and individual ratings</p>
        </div>
        <button
          onClick={onViewAllClick}
          className="flex items-center gap-1 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
        >
          View all matches
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {recent.length === 0 ? (
        <div className="py-8 text-center border border-dashed border-slate-800 rounded-xl">
          <Calendar className="w-8 h-8 text-slate-600 mx-auto mb-2" />
          <p className="text-sm font-medium text-slate-400">No matches recorded yet</p>
          <p className="text-xs text-slate-500 mt-1">Log your first fixture or play a simulated matchday!</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {recent.map((m) => (
            <div
              key={m.id}
              onClick={() => onMatchClick(m)}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 hover:bg-slate-800/50 border border-slate-800/60 hover:border-slate-700/80 transition-all cursor-pointer group"
            >
              {/* Left: Result pill & Opponent info */}
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center font-display font-black text-xs border ${getResultStyle(
                    m.result
                  )} shrink-0`}
                >
                  {m.result}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm truncate">{m.opponent}</span>
                    <span className="text-[11px] font-mono text-slate-400">
                      ({m.venue === 'Home' ? 'H' : m.venue === 'Away' ? 'A' : 'N'})
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                    <span className="truncate max-w-[160px]">{m.competition}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono text-[11px]">{m.date}</span>
                  </div>
                </div>
              </div>

              {/* Center: Score */}
              <div className="px-3 text-center shrink-0">
                <span className="font-display font-extrabold text-base text-white tabular-nums tracking-wide">
                  {m.teamScore} - {m.opponentScore}
                </span>
                <div className="text-[10px] text-slate-500">{m.minutesPlayed}'</div>
              </div>

              {/* Right: Individual Stats & Rating */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <div className="flex items-center gap-1.5 justify-end">
                    {m.goals > 0 && (
                      <span className="text-xs font-bold text-emerald-400 tabular-nums">
                        {m.goals}G
                      </span>
                    )}
                    {m.assists > 0 && (
                      <span className="text-xs font-bold text-amber-400 tabular-nums">
                        {m.assists}A
                      </span>
                    )}
                    {m.goals === 0 && m.assists === 0 && (
                      <span className="text-xs text-slate-500 font-mono">-</span>
                    )}
                    {m.manOfTheMatch && (
                      <span title="Man of the Match">
                        <Award className="w-3.5 h-3.5 text-amber-400" />
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    Rating: <span className="font-bold text-slate-200">{m.matchRating.toFixed(1)}</span>
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-300 transition-colors" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
