import React, { useState } from 'react';
import { Season, Match } from '../../types/career';
import { BarChart3, TrendingUp } from 'lucide-react';

interface SeasonProgressionChartProps {
  seasons: Season[];
  matches: Match[];
}

export const SeasonProgressionChart: React.FC<SeasonProgressionChartProps> = ({ seasons, matches }) => {
  const [activeMetric, setActiveMetric] = useState<'goals' | 'assists' | 'rating'>('goals');

  // Compute stats per season
  const seasonData = seasons.map((season) => {
    const sMatches = matches.filter((m) => m.seasonId === season.id);
    const goals = sMatches.reduce((acc, m) => acc + (m.goals || 0), 0);
    const assists = sMatches.reduce((acc, m) => acc + (m.assists || 0), 0);
    const avgRating =
      sMatches.length > 0
        ? Number((sMatches.reduce((acc, m) => acc + (m.matchRating || 0), 0) / sMatches.length).toFixed(2))
        : 0;

    return {
      seasonName: season.name,
      club: season.club,
      matchesCount: sMatches.length,
      goals,
      assists,
      goalContributions: goals + assists,
      avgRating,
    };
  });

  const maxGoals = Math.max(...seasonData.map((d) => d.goals), 10);
  const maxAssists = Math.max(...seasonData.map((d) => d.assists), 10);

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-emerald-400" />
            Season Progression & Output
          </h3>
          <p className="text-xs text-slate-400">Progression across multiple career campaigns</p>
        </div>

        {/* Metric Selector Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-lg self-start sm:self-auto">
          <button
            onClick={() => setActiveMetric('goals')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
              activeMetric === 'goals' ? 'bg-emerald-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Goals
          </button>
          <button
            onClick={() => setActiveMetric('assists')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
              activeMetric === 'assists' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Assists
          </button>
          <button
            onClick={() => setActiveMetric('rating')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
              activeMetric === 'rating' ? 'bg-purple-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Avg Rating
          </button>
        </div>
      </div>

      {/* SVG Bar Chart Visualization */}
      <div className="pt-2 pb-4">
        <div className="grid grid-cols-4 gap-4 items-end h-44 border-b border-slate-800 pb-2">
          {seasonData.map((d, index) => {
            let heightPercent = 0;
            let displayVal = '0';
            let barColor = 'bg-emerald-500';

            if (activeMetric === 'goals') {
              heightPercent = Math.min(100, Math.round((d.goals / maxGoals) * 85) + 12);
              displayVal = `${d.goals} G`;
              barColor = 'bg-gradient-to-t from-emerald-600 to-emerald-400';
            } else if (activeMetric === 'assists') {
              heightPercent = Math.min(100, Math.round((d.assists / maxAssists) * 85) + 12);
              displayVal = `${d.assists} A`;
              barColor = 'bg-gradient-to-t from-amber-600 to-amber-400';
            } else {
              heightPercent = Math.min(100, Math.round((d.avgRating / 10) * 85) + 10);
              displayVal = `${d.avgRating}`;
              barColor = 'bg-gradient-to-t from-purple-600 to-purple-400';
            }

            return (
              <div key={index} className="flex flex-col items-center h-full justify-end group">
                <span className="text-xs font-bold text-slate-200 tabular-nums mb-1.5 opacity-90 group-hover:opacity-100 group-hover:text-amber-300 transition-colors">
                  {displayVal}
                </span>
                <div className="w-full max-w-[48px] bg-slate-800/80 rounded-t-lg h-full flex items-end overflow-hidden p-1">
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full ${barColor} rounded-t transition-all duration-500 group-hover:brightness-110 shadow-lg`}
                  />
                </div>
                <div className="text-center mt-2">
                  <div className="text-xs font-bold text-white">{d.seasonName}</div>
                  <div className="text-[10px] text-slate-400 truncate max-w-[80px]">{d.club}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
