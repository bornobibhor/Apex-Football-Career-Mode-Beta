import React from 'react';
import { PlayerProfile, Season, Match, CareerStats, Trophy, CareerRecordsData, Achievement } from '../../types/career';
import { DashboardHero } from './DashboardHero';
import { CareerQuickOverview } from './CareerQuickOverview';
import { PlayerCardPreview } from './PlayerCardPreview';
import { RecentMatchesFeed } from './RecentMatchesFeed';
import { TrophyShowcaseStrip } from './TrophyShowcaseStrip';
import { SeasonProgressionChart } from './SeasonProgressionChart';
import { Flame, Star, Trophy as TrophyIconLucide, ChevronRight, Award } from 'lucide-react';
import { NavTab } from '../layout/Sidebar';

interface DashboardMainViewProps {
  player: PlayerProfile;
  activeSeason: Season | null;
  activeSeasonId: string;
  seasons: Season[];
  onSelectSeason: (id: string) => void;
  stats: CareerStats;
  filteredMatches: Match[];
  allMatches: Match[];
  trophies: Trophy[];
  records: CareerRecordsData;
  achievements: Achievement[];
  onSelectTab: (tab: NavTab) => void;
  onLogMatchClick: () => void;
  onPlaySimulatorClick: () => void;
  onManageSeasonsClick: () => void;
  onEditProfileClick: () => void;
  onMatchClick: (match: Match) => void;
  onTrophyClick: (trophy: Trophy) => void;
}

export const DashboardMainView: React.FC<DashboardMainViewProps> = ({
  player,
  activeSeason,
  activeSeasonId,
  seasons,
  onSelectSeason,
  stats,
  filteredMatches,
  allMatches,
  trophies,
  records,
  achievements,
  onSelectTab,
  onLogMatchClick,
  onPlaySimulatorClick,
  onManageSeasonsClick,
  onEditProfileClick,
  onMatchClick,
  onTrophyClick,
}) => {
  const unlockedTrophiesCount = trophies.filter((t) => t.isUnlocked).length;
  const unlockedAchievementsCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="space-y-6">
      {/* 1. Cinematic Stadium Hero Banner */}
      <DashboardHero
        player={player}
        activeSeason={activeSeason}
        activeSeasonId={activeSeasonId}
        seasons={seasons}
        onSelectSeason={onSelectSeason}
        stats={stats}
        onLogMatchClick={onLogMatchClick}
        onPlayMatchdayClick={onPlaySimulatorClick}
        onViewTrophiesClick={() => onSelectTab('trophies')}
        onManageSeasonsClick={onManageSeasonsClick}
      />

      {/* 2. High-Density Quick KPI Strip */}
      <CareerQuickOverview
        stats={stats}
        trophyCount={unlockedTrophiesCount}
        seasonLabel={activeSeason ? `${activeSeason.name} (${activeSeason.club})` : 'All-Time Career'}
      />

      {/* 3. Main 2-Column Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols): Progress Chart, Recent Matches, Trophy Showcase */}
        <div className="lg:col-span-8 space-y-6">
          <SeasonProgressionChart seasons={seasons} matches={allMatches} />

          <RecentMatchesFeed
            matches={filteredMatches}
            onViewAllClick={() => onSelectTab('matches')}
            onMatchClick={onMatchClick}
          />

          <TrophyShowcaseStrip
            trophies={trophies}
            onViewCabinetClick={() => onSelectTab('trophies')}
            onTrophyClick={onTrophyClick}
          />
        </div>

        {/* Right Column (4 cols): EA FC Player Card, Records Glance, Achievements Glance */}
        <div className="lg:col-span-4 space-y-6 flex flex-col items-center lg:items-stretch">
          {/* EA FC Ultimate / Career Holographic Card Preview */}
          <PlayerCardPreview player={player} onEditClick={onEditProfileClick} />

          {/* Quick Career Records Glance */}
          <div className="w-full bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <h3 className="text-sm font-bold text-white font-display flex items-center gap-2">
                <Flame className="w-4 h-4 text-emerald-400" />
                Records Snapshot
              </h3>
              <button
                onClick={() => onSelectTab('records')}
                className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-0.5"
              >
                View all
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-400">Highest Scoring Season</span>
                <span className="font-bold text-emerald-400 font-mono tabular-nums">
                  {records.highestScoringSeason.goals} Goals ({records.highestScoringSeason.seasonName})
                </span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-400">Peak Match Rating</span>
                <span className="font-bold text-purple-400 font-mono tabular-nums">
                  {records.highestMatchRating.rating.toFixed(1)} / 10
                </span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-400">Scoring Streak</span>
                <span className="font-bold text-white font-mono tabular-nums">
                  {records.longestScoringStreak} consecutive games
                </span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-400">Consecutive Wins</span>
                <span className="font-bold text-amber-400 font-mono tabular-nums">
                  {records.longestWinStreak} match win streak
                </span>
              </div>
            </div>
          </div>

          {/* Achievements Summary Glance */}
          <div className="w-full bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <h3 className="text-sm font-bold text-white font-display flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                Milestone Progress
              </h3>
              <button
                onClick={() => onSelectTab('achievements')}
                className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-0.5"
              >
                View hall
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Unlocked Badges</span>
              <span className="font-bold text-white font-mono tabular-nums">
                {unlockedAchievementsCount} / {achievements.length}
              </span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                style={{ width: `${(unlockedAchievementsCount / achievements.length) * 100}%` }}
                className="bg-gradient-to-r from-amber-400 to-amber-500 h-full rounded-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
