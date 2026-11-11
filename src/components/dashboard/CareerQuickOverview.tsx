import React from 'react';
import { CareerStats } from '../../types/career';
import { Target, Zap, Clock, Award, TrendingUp, ShieldCheck, Flame, Star } from 'lucide-react';

interface CareerQuickOverviewProps {
  stats: CareerStats;
  trophyCount: number;
  seasonLabel: string;
}

export const CareerQuickOverview: React.FC<CareerQuickOverviewProps> = ({ stats, trophyCount, seasonLabel }) => {
  const metrics = [
    {
      label: 'Appearances',
      value: stats.appearances,
      icon: ShieldCheck,
      color: 'text-blue-400',
      sub: `${stats.wins}W · ${stats.draws}D · ${stats.losses}L`,
    },
    {
      label: 'Goals Scored',
      value: stats.goals,
      icon: Target,
      color: 'text-emerald-400',
      sub: `${stats.goalsPer90} per 90`,
    },
    {
      label: 'Assists',
      value: stats.assists,
      icon: Zap,
      color: 'text-amber-400',
      sub: `${stats.assistsPer90} per 90`,
    },
    {
      label: 'Total G/A',
      value: stats.goalContributions,
      icon: TrendingUp,
      color: 'text-yellow-400',
      sub: `${stats.goalContributionsPer90} per 90`,
    },
    {
      label: 'Avg Rating',
      value: stats.averageRating > 0 ? stats.averageRating.toFixed(2) : '0.00',
      icon: Star,
      color: 'text-purple-400',
      sub: 'Out of 10.0',
    },
    {
      label: 'Trophies Won',
      value: trophyCount,
      icon: Award,
      color: 'text-amber-300',
      sub: 'Silverware in Cabinet',
    },
    {
      label: 'Man of the Match',
      value: stats.manOfTheMatch,
      icon: Flame,
      color: 'text-orange-400',
      sub: `${stats.appearances > 0 ? ((stats.manOfTheMatch / stats.appearances) * 100).toFixed(0) : 0}% of games`,
    },
    {
      label: 'Minutes Played',
      value: stats.minutesPlayed.toLocaleString(),
      icon: Clock,
      color: 'text-cyan-400',
      sub: `${stats.minutesPerGoal > 0 ? `${stats.minutesPerGoal} min/goal` : '0 min/goal'}`,
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 font-display">Performance Metrics</h3>
          <span className="text-xs text-slate-500 font-mono">({seasonLabel})</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {metrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div
              key={idx}
              className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3.5 hover:border-slate-700/80 transition-all group"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium text-slate-400">{m.label}</span>
                <Icon className={`w-4 h-4 ${m.color} opacity-80 group-hover:opacity-100 transition-opacity`} />
              </div>
              <div className="text-2xl font-black text-white font-display tabular-nums tracking-tight">
                {m.value}
              </div>
              <div className="text-[11px] text-slate-500 mt-1 font-mono truncate">
                {m.sub}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
