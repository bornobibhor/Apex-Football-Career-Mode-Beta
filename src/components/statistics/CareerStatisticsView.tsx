import React, { useState } from 'react';
import { Match, Season, CareerStats, CompetitionCategory } from '../../types/career';
import { calculateStats } from '../../utils/statisticsCalculator';
import {
  BarChart3,
  PieChart,
  Target,
  Zap,
  Award,
  Shield,
  Clock,
  Layers,
  ChevronDown,
} from 'lucide-react';

interface CareerStatisticsViewProps {
  allMatches: Match[];
  seasons: Season[];
  activeSeasonId: string;
  onSelectSeason: (id: string) => void;
}

export const CareerStatisticsView: React.FC<CareerStatisticsViewProps> = ({
  allMatches,
  seasons,
  activeSeasonId,
  onSelectSeason,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'competitions' | 'seasons' | 'clubs'>('overview');

  const matchesToAnalyze =
    activeSeasonId === 'all' ? allMatches : allMatches.filter((m) => m.seasonId === activeSeasonId);

  const stats = calculateStats(matchesToAnalyze);

  // Split by Competition Category
  const competitionCategories: { key: CompetitionCategory; label: string }[] = [
    { key: 'league', label: 'Domestic League' },
    { key: 'continental', label: 'UEFA Champions League / Continental' },
    { key: 'domestic_cup', label: 'Domestic Cups (FA Cup, Copa del Rey)' },
    { key: 'international', label: 'National Team & International' },
    { key: 'friendly', label: 'Pre-Season & Friendlies' },
  ];

  const competitionBreakdowns = competitionCategories.map(({ key, label }) => {
    const compMatches = matchesToAnalyze.filter((m) => m.competitionCategory === key);
    return {
      category: key,
      label,
      stats: calculateStats(compMatches),
    };
  });

  // Split by Clubs
  const clubSet = Array.from(new Set(allMatches.map((m) => {
    const s = seasons.find((sec) => sec.id === m.seasonId);
    return s?.club || 'Club';
  })));

  const clubBreakdowns = clubSet.map((clubName) => {
    const clubMatches = allMatches.filter((m) => {
      const s = seasons.find((sec) => sec.id === m.seasonId);
      return s?.club === clubName;
    });
    return {
      club: clubName,
      stats: calculateStats(clubMatches),
    };
  });

  return (
    <div className="space-y-6">
      {/* Header and Season Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black font-display text-white">Career Performance & Analytics</h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Multi-competition breakdowns, per 90 metrics, discipline, and historical season comparisons
          </p>
        </div>

        <div className="relative inline-flex items-center">
          <select
            value={activeSeasonId}
            onChange={(e) => onSelectSeason(e.target.value)}
            className="appearance-none bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 pr-9 text-xs text-white font-bold focus:outline-none focus:border-amber-400 cursor-pointer shadow-md"
          >
            <option value="all">All-Time Career Stats</option>
            {seasons.map((s) => (
              <option key={s.id} value={s.id}>
                Season: {s.name} ({s.club})
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 pointer-events-none" />
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-900/80 border border-slate-800 rounded-2xl w-fit">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors ${
            activeTab === 'overview' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          All Metrics
        </button>
        <button
          onClick={() => setActiveTab('competitions')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors ${
            activeTab === 'competitions' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          By Competition
        </button>
        <button
          onClick={() => setActiveTab('seasons')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors ${
            activeTab === 'seasons' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          Season Comparison
        </button>
        <button
          onClick={() => setActiveTab('clubs')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors ${
            activeTab === 'clubs' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          By Club Career
        </button>
      </div>

      {/* Tab 1: Comprehensive All Metrics */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Main Stat Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
              <span className="text-xs text-slate-400 font-medium block">Total Appearances</span>
              <span className="text-3xl font-black font-display text-white tabular-nums">
                {stats.appearances}
              </span>
              <div className="text-[11px] text-slate-500 font-mono mt-1">
                {stats.wins}W · {stats.draws}D · {stats.losses}L ({stats.winRate}% win rate)
              </div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
              <span className="text-xs text-slate-400 font-medium block">Total Goals</span>
              <span className="text-3xl font-black font-display text-emerald-400 tabular-nums">
                {stats.goals}
              </span>
              <div className="text-[11px] text-slate-500 font-mono mt-1">
                {stats.goalsPer90} goals per 90 mins
              </div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
              <span className="text-xs text-slate-400 font-medium block">Total Assists</span>
              <span className="text-3xl font-black font-display text-amber-400 tabular-nums">
                {stats.assists}
              </span>
              <div className="text-[11px] text-slate-500 font-mono mt-1">
                {stats.assistsPer90} assists per 90 mins
              </div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
              <span className="text-xs text-slate-400 font-medium block">Goal Contributions (G+A)</span>
              <span className="text-3xl font-black font-display text-yellow-300 tabular-nums">
                {stats.goalContributions}
              </span>
              <div className="text-[11px] text-slate-500 font-mono mt-1">
                {stats.goalContributionsPer90} G/A per 90 mins
              </div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
              <span className="text-xs text-slate-400 font-medium block">Average Match Rating</span>
              <span className="text-3xl font-black font-display text-purple-400 tabular-nums">
                {stats.averageRating > 0 ? stats.averageRating.toFixed(2) : '0.00'}
              </span>
              <div className="text-[11px] text-slate-500 font-mono mt-1">Performance index / 10.0</div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
              <span className="text-xs text-slate-400 font-medium block">Man of the Match</span>
              <span className="text-3xl font-black font-display text-orange-400 tabular-nums">
                {stats.manOfTheMatch}
              </span>
              <div className="text-[11px] text-slate-500 font-mono mt-1">
                {stats.appearances > 0 ? ((stats.manOfTheMatch / stats.appearances) * 100).toFixed(0) : 0}% of all games
              </div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
              <span className="text-xs text-slate-400 font-medium block">Hat-Tricks (3+ Goals)</span>
              <span className="text-3xl font-black font-display text-cyan-400 tabular-nums">
                {stats.hatTricks}
              </span>
              <div className="text-[11px] text-slate-500 font-mono mt-1">Single match masterclasses</div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
              <span className="text-xs text-slate-400 font-medium block">Minutes Played</span>
              <span className="text-3xl font-black font-display text-white tabular-nums">
                {stats.minutesPlayed.toLocaleString()}
              </span>
              <div className="text-[11px] text-slate-500 font-mono mt-1">
                {stats.minutesPerGoal > 0 ? `${stats.minutesPerGoal} min per goal` : 'N/A'}
              </div>
            </div>
          </div>

          {/* Secondary Specialized Metrics & Discipline */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 font-display">
                Specialized Scoring Details
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs py-1 border-b border-slate-800">
                  <span className="text-slate-400">Penalties Converted</span>
                  <span className="font-bold text-white font-mono tabular-nums">{stats.penaltiesScored}</span>
                </div>
                <div className="flex justify-between items-center text-xs py-1 border-b border-slate-800">
                  <span className="text-slate-400">Penalties Missed</span>
                  <span className="font-bold text-slate-400 font-mono tabular-nums">{stats.penaltiesMissed}</span>
                </div>
                <div className="flex justify-between items-center text-xs py-1 border-b border-slate-800">
                  <span className="text-slate-400">Direct Free-Kick Goals</span>
                  <span className="font-bold text-amber-400 font-mono tabular-nums">{stats.freeKickGoals}</span>
                </div>
                <div className="flex justify-between items-center text-xs py-1 border-b border-slate-800">
                  <span className="text-slate-400">Team Clean Sheets</span>
                  <span className="font-bold text-emerald-400 font-mono tabular-nums">{stats.cleanSheets}</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 font-display">
                Discipline & Match Outcomes
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs py-1 border-b border-slate-800">
                  <span className="text-slate-400">Yellow Cards</span>
                  <span className="font-bold text-yellow-400 font-mono tabular-nums">{stats.yellowCards}</span>
                </div>
                <div className="flex justify-between items-center text-xs py-1 border-b border-slate-800">
                  <span className="text-slate-400">Red Cards</span>
                  <span className="font-bold text-rose-500 font-mono tabular-nums">{stats.redCards}</span>
                </div>
                <div className="flex justify-between items-center text-xs py-1 border-b border-slate-800">
                  <span className="text-slate-400">Matches Won</span>
                  <span className="font-bold text-emerald-400 font-mono tabular-nums">
                    {stats.wins} ({stats.winRate}%)
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs py-1 border-b border-slate-800">
                  <span className="text-slate-400">Matches Drawn / Lost</span>
                  <span className="font-bold text-slate-300 font-mono tabular-nums">
                    {stats.draws} D / {stats.losses} L
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: By Competition */}
      {activeTab === 'competitions' && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/70 text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                  <th className="py-3 px-4">Competition Category</th>
                  <th className="py-3 px-4 text-center">Apps</th>
                  <th className="py-3 px-4 text-center">Goals</th>
                  <th className="py-3 px-4 text-center">Assists</th>
                  <th className="py-3 px-4 text-center">G+A</th>
                  <th className="py-3 px-4 text-center">G/90</th>
                  <th className="py-3 px-4 text-center">Rating</th>
                  <th className="py-3 px-4 text-center">MOTM</th>
                  <th className="py-3 px-4 text-center">W-D-L</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {competitionBreakdowns.map((b) => (
                  <tr key={b.category} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4 font-bold text-white">{b.label}</td>
                    <td className="py-3 px-4 text-center font-mono tabular-nums">{b.stats.appearances}</td>
                    <td className="py-3 px-4 text-center font-bold text-emerald-400 tabular-nums">
                      {b.stats.goals}
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-amber-400 tabular-nums">
                      {b.stats.assists}
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-yellow-300 tabular-nums">
                      {b.stats.goalContributions}
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-slate-300 tabular-nums">
                      {b.stats.goalsPer90}
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-purple-400 tabular-nums">
                      {b.stats.averageRating > 0 ? b.stats.averageRating.toFixed(2) : '-'}
                    </td>
                    <td className="py-3 px-4 text-center font-mono tabular-nums">{b.stats.manOfTheMatch}</td>
                    <td className="py-3 px-4 text-center font-mono text-slate-400 text-[11px]">
                      {b.stats.wins}-{b.stats.draws}-{b.stats.losses}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Season Comparison */}
      {activeTab === 'seasons' && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/70 text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                  <th className="py-3 px-4">Season</th>
                  <th className="py-3 px-4">Club</th>
                  <th className="py-3 px-4 text-center">Matches</th>
                  <th className="py-3 px-4 text-center">Goals</th>
                  <th className="py-3 px-4 text-center">Assists</th>
                  <th className="py-3 px-4 text-center">G+A</th>
                  <th className="py-3 px-4 text-center">G/90</th>
                  <th className="py-3 px-4 text-center">Rating</th>
                  <th className="py-3 px-4 text-center">MOTM</th>
                  <th className="py-3 px-4 text-center">Win Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {seasons.map((s) => {
                  const sMatches = allMatches.filter((m) => m.seasonId === s.id);
                  const sStats = calculateStats(sMatches);
                  return (
                    <tr key={s.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 px-4 font-bold text-white">
                        {s.name} {s.isCurrent && <span className="text-emerald-400 ml-1 text-[10px]">(Current)</span>}
                      </td>
                      <td className="py-3 px-4 text-slate-300">{s.club}</td>
                      <td className="py-3 px-4 text-center font-mono tabular-nums">{sStats.appearances}</td>
                      <td className="py-3 px-4 text-center font-bold text-emerald-400 tabular-nums">
                        {sStats.goals}
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-amber-400 tabular-nums">
                        {sStats.assists}
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-yellow-300 tabular-nums">
                        {sStats.goalContributions}
                      </td>
                      <td className="py-3 px-4 text-center font-mono text-slate-300 tabular-nums">
                        {sStats.goalsPer90}
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-bold text-purple-400 tabular-nums">
                        {sStats.averageRating > 0 ? sStats.averageRating.toFixed(2) : '-'}
                      </td>
                      <td className="py-3 px-4 text-center font-mono tabular-nums">{sStats.manOfTheMatch}</td>
                      <td className="py-3 px-4 text-center font-mono text-slate-300 tabular-nums">
                        {sStats.winRate}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Club Career Comparison */}
      {activeTab === 'clubs' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {clubBreakdowns.map((cb) => (
            <div key={cb.club} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h4 className="text-base font-bold text-white font-display">{cb.club}</h4>
                <span className="text-xs font-mono text-amber-400 font-semibold">
                  {cb.stats.appearances} Apps
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center pt-1">
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase block">Goals</span>
                  <span className="text-lg font-black text-emerald-400 tabular-nums">
                    {cb.stats.goals}
                  </span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase block">Assists</span>
                  <span className="text-lg font-black text-amber-400 tabular-nums">
                    {cb.stats.assists}
                  </span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase block">Avg Rating</span>
                  <span className="text-lg font-black text-purple-400 tabular-nums">
                    {cb.stats.averageRating > 0 ? cb.stats.averageRating.toFixed(2) : '-'}
                  </span>
                </div>
              </div>

              <div className="text-xs text-slate-400 flex justify-between font-mono pt-1">
                <span>Record: {cb.stats.wins}W / {cb.stats.draws}D / {cb.stats.losses}L</span>
                <span>Win Rate: {cb.stats.winRate}%</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
