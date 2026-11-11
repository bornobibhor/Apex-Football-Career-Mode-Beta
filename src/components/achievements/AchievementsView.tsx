import React, { useState } from 'react';
import { Achievement, AchievementTier } from '../../types/career';
import { Sparkles, Trophy, Lock, CheckCircle2, Award, Flame, Target, Star, Shield } from 'lucide-react';

interface AchievementsViewProps {
  achievements: Achievement[];
}

export const AchievementsView: React.FC<AchievementsViewProps> = ({ achievements }) => {
  const [selectedTier, setSelectedTier] = useState<'all' | AchievementTier>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unlocked' | 'locked'>('all');

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const completionPercent = Math.round((unlockedCount / achievements.length) * 100);

  const getTierBadge = (tier: AchievementTier) => {
    switch (tier) {
      case 'ultimate':
        return {
          label: 'Ultimate',
          className: 'bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-amber-300 text-slate-950 font-black',
          border: 'border-cyan-400/40 shadow-[0_0_20px_rgba(34,211,238,0.25)]',
          iconColor: 'text-cyan-300',
        };
      case 'legendary':
        return {
          label: 'Legendary',
          className: 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black',
          border: 'border-amber-400/40 shadow-[0_0_20px_rgba(245,158,11,0.2)]',
          iconColor: 'text-amber-400',
        };
      case 'epic':
        return {
          label: 'Epic',
          className: 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold',
          border: 'border-purple-500/40',
          iconColor: 'text-purple-400',
        };
      case 'rare':
        return {
          label: 'Rare',
          className: 'bg-gradient-to-r from-blue-500 to-sky-500 text-white font-bold',
          border: 'border-blue-500/40',
          iconColor: 'text-blue-400',
        };
      case 'common':
      default:
        return {
          label: 'Common',
          className: 'bg-slate-700 text-slate-200 font-medium',
          border: 'border-slate-800',
          iconColor: 'text-slate-400',
        };
    }
  };

  const filtered = achievements.filter((a) => {
    if (selectedTier !== 'all' && a.tier !== selectedTier) return false;
    if (statusFilter === 'unlocked' && !a.unlocked) return false;
    if (statusFilter === 'locked' && a.unlocked) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-950 border border-amber-500/30 rounded-3xl p-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400 flex items-center gap-1.5 mb-1">
              <Sparkles className="w-4 h-4" />
              Career Milestones & Mastery
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-display text-white">
              Career Achievements & Badges
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Unlock prestigious accolades across scoring feats, longevity milestones, and world football glory.
            </p>
          </div>

          {/* Progress gauge */}
          <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 min-w-[200px] text-center">
            <span className="text-xs text-slate-400 block font-medium">Career Completion</span>
            <div className="text-2xl font-black text-amber-400 font-display tabular-nums mt-0.5">
              {unlockedCount} / {achievements.length}{' '}
              <span className="text-sm text-slate-400 font-normal">({completionPercent}%)</span>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-2">
              <div
                style={{ width: `${completionPercent}%` }}
                className="bg-gradient-to-r from-amber-400 to-amber-500 h-full rounded-full transition-all duration-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Filter controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Tier filter */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl">
          {(['all', 'common', 'rare', 'epic', 'legendary', 'ultimate'] as const).map((tier) => (
            <button
              key={tier}
              onClick={() => setSelectedTier(tier)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-colors ${
                selectedTier === tier
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tier}
            </button>
          ))}
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl self-start sm:self-auto">
          {(['all', 'unlocked', 'locked'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 text-xs font-medium rounded-lg capitalize ${
                statusFilter === st ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((ach) => {
          const tierInfo = getTierBadge(ach.tier);
          const percent = Math.min(100, Math.round((ach.progress / ach.target) * 100));

          return (
            <div
              key={ach.id}
              className={`relative rounded-2xl p-5 border flex flex-col justify-between transition-all ${
                ach.unlocked
                  ? `bg-slate-900/80 ${tierInfo.border} hover:scale-[1.01]`
                  : 'bg-slate-950/40 border-slate-800/80 opacity-60'
              }`}
            >
              {/* Top Row: Rarity tag and Unlock status */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${tierInfo.className}`}
                  >
                    {tierInfo.label}
                  </span>

                  {ach.unlocked ? (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 font-mono">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Unlocked
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[11px] text-slate-500 font-mono">
                      <Lock className="w-3.5 h-3.5" />
                      Locked
                    </span>
                  )}
                </div>

                {/* Title & Description */}
                <h4 className="text-base font-bold text-white font-display mb-1 flex items-center gap-2">
                  <Award className={`w-4 h-4 ${tierInfo.iconColor}`} />
                  {ach.title}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">{ach.description}</p>
              </div>

              {/* Bottom: Progress Bar */}
              <div className="mt-4 pt-3 border-t border-slate-800/80">
                <div className="flex justify-between items-center text-xs font-mono mb-1.5">
                  <span className="text-slate-500">Progress</span>
                  <span className="font-bold text-slate-300 tabular-nums">
                    {ach.progress} / {ach.target} ({percent}%)
                  </span>
                </div>
                <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${percent}%` }}
                    className={`h-full rounded-full transition-all duration-500 ${
                      ach.unlocked ? 'bg-amber-400' : 'bg-slate-600'
                    }`}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
