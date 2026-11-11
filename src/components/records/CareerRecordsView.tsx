import React from 'react';
import { CareerRecordsData, Match, CareerStats, Season } from '../../types/career';
import { Flame, Trophy, Award, TrendingUp, Zap, Star, ShieldCheck, Flag, Sparkles } from 'lucide-react';

interface CareerRecordsViewProps {
  records: CareerRecordsData;
  allMatches: Match[];
  stats: CareerStats;
  seasons: Season[];
}

export const CareerRecordsView: React.FC<CareerRecordsViewProps> = ({
  records,
  allMatches,
  stats,
  seasons,
}) => {
  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-950 border border-amber-500/30 rounded-3xl p-6 relative overflow-hidden">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-400 flex items-center gap-1.5 mb-1">
          <Sparkles className="w-4 h-4" />
          Hall of Records
        </span>
        <h2 className="text-2xl sm:text-3xl font-black font-display text-white">
          All-Time Career Records & Milestones
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
          Historical peaks, scoring runs, peak season outputs, and legendary single-game masterclasses.
        </p>
      </div>

      {/* Primary Peak Records Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Highest Scoring Season */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 hover:border-amber-400/50 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Highest Scoring Season</span>
            <Flame className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black font-display text-emerald-400 tabular-nums">
            {records.highestScoringSeason.goals} <span className="text-base text-white font-medium">Goals</span>
          </div>
          <div className="text-xs text-slate-300 font-bold mt-2">
            Season: <span className="text-amber-400">{records.highestScoringSeason.seasonName}</span>
          </div>
        </div>

        {/* Most Assists Season */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 hover:border-amber-400/50 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Most Assists Season</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black font-display text-amber-400 tabular-nums">
            {records.mostAssistsSeason.assists} <span className="text-base text-white font-medium">Assists</span>
          </div>
          <div className="text-xs text-slate-300 font-bold mt-2">
            Season: <span className="text-amber-400">{records.mostAssistsSeason.seasonName}</span>
          </div>
        </div>

        {/* Most Appearances Season */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 hover:border-amber-400/50 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Most Appearances Season</span>
            <ShieldCheck className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-3xl font-black font-display text-blue-400 tabular-nums">
            {records.mostAppearancesSeason.appearances}{' '}
            <span className="text-base text-white font-medium">Games</span>
          </div>
          <div className="text-xs text-slate-300 font-bold mt-2">
            Season: <span className="text-amber-400">{records.mostAppearancesSeason.seasonName}</span>
          </div>
        </div>

        {/* Highest Match Rating */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 hover:border-amber-400/50 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Highest Match Rating</span>
            <Star className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-black font-display text-purple-400 tabular-nums">
            {records.highestMatchRating.rating.toFixed(1)}{' '}
            <span className="text-base text-slate-400 font-medium">/ 10</span>
          </div>
          <div className="text-xs text-slate-300 font-semibold mt-2 truncate">
            vs {records.highestMatchRating.opponent} ({records.highestMatchRating.date || 'Record'})
          </div>
        </div>
      </div>

      {/* Streaks & Masterclasses */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Longest Scoring Streak */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Longest Scoring Streak</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black font-display text-white tabular-nums">
            {records.longestScoringStreak}{' '}
            <span className="text-sm text-emerald-400 font-bold">Consecutive Matches</span>
          </div>
          <div className="text-[11px] text-slate-500 font-mono mt-2">
            Current streak: {records.currentScoringStreak} matches
          </div>
        </div>

        {/* Most Consecutive Wins */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Most Consecutive Wins</span>
            <Trophy className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black font-display text-white tabular-nums">
            {records.longestWinStreak}{' '}
            <span className="text-sm text-amber-400 font-bold">Straight Wins</span>
          </div>
          <div className="text-[11px] text-slate-500 font-mono mt-2">
            Current win streak: {records.currentWinStreak} wins
          </div>
        </div>

        {/* Most Hat-Tricks in a Season */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Most Hat-Tricks in a Season</span>
            <Award className="w-4 h-4 text-yellow-400" />
          </div>
          <div className="text-3xl font-black font-display text-white tabular-nums">
            {records.mostHatTricksInSeason.count}{' '}
            <span className="text-sm text-yellow-400 font-bold">Hat-Tricks</span>
          </div>
          <div className="text-xs text-slate-400 mt-2">
            Season: <span className="text-white font-bold">{records.mostHatTricksInSeason.seasonName}</span>
          </div>
        </div>

        {/* Biggest Victory */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Biggest Victory Margin</span>
            <Flag className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-black font-display text-cyan-400 tabular-nums">
            {records.biggestVictory.score}
          </div>
          <div className="text-xs text-slate-300 font-semibold mt-2 truncate">
            vs {records.biggestVictory.opponent} (+{records.biggestVictory.margin} goal margin)
          </div>
        </div>
      </div>

      {/* Historical Milestones Timeline */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-base font-bold text-white font-display mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          All-Time Career Milestones Reached
        </h3>

        <div className="space-y-3">
          <div className="flex items-start gap-4 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white">First Professional Career Goal</span>
                <span className="text-xs font-mono text-amber-400">Achieved</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Competitive debut scoreline that announced your arrival on the professional stage.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white">European Champions League Final Glory</span>
                <span className="text-xs font-mono text-amber-400">Achieved</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Brace in the Champions League final at Wembley Stadium to lift club football's greatest prize.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white">Flawless 10.0 Match Rating</span>
                <span className="text-xs font-mono text-amber-400">Achieved</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Delivered a flawless individual masterclass (hat-trick + assist) to seal the league crown.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white">Ballon d'Or World Supremacy</span>
                <span className="text-xs font-mono text-amber-400">Achieved</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Voted the finest player on planet earth at the Théâtre du Châtelet in Paris.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
