import React from 'react';
import { PlayerProfile, Season, CareerStats } from '../../types/career';
import { PlusCircle, Gamepad2, Trophy, Flame, ChevronDown } from 'lucide-react';

interface DashboardHeroProps {
  player: PlayerProfile;
  activeSeason: Season | null;
  activeSeasonId: string;
  seasons: Season[];
  onSelectSeason: (id: string) => void;
  stats: CareerStats;
  onLogMatchClick: () => void;
  onPlayMatchdayClick: () => void;
  onViewTrophiesClick: () => void;
  onManageSeasonsClick: () => void;
}

export const DashboardHero: React.FC<DashboardHeroProps> = ({
  player,
  activeSeason,
  activeSeasonId,
  seasons,
  onSelectSeason,
  stats,
  onLogMatchClick,
  onPlayMatchdayClick,
  onViewTrophiesClick,
  onManageSeasonsClick,
}) => {
  return (
    <div className="relative rounded-3xl overflow-hidden border border-slate-800/80 bg-slate-950 p-6 md:p-8 shadow-2xl">
      {/* Stadium Floodlights Cinematic Background */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity filter blur-[0.5px]"
        style={{ backgroundImage: `url('/src/assets/images/stadium_night_hero_1794400815361.jpg')` }}
      />
      {/* Dark gradient scrim for legibility */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#080b11] via-[#080b11]/90 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#080b11] via-transparent to-transparent" />

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          {/* Metadata breadcrumbs */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-300">
            <span className="text-amber-400 font-bold">{player.currentClub}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>{player.league}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="flex items-center gap-1 text-emerald-400">
              <Flame className="w-3.5 h-3.5" />
              {player.playerStatus}
            </span>
          </div>

          {/* Player Name and Title */}
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-display tracking-tight text-white leading-none">
              {player.name}
            </h1>
            <p className="text-sm md:text-base text-slate-300 mt-2 line-clamp-2 max-w-xl">
              {player.bio || 'Professional football career profile and performance analytics.'}
            </p>
          </div>

          {/* Quick Season Filter Pill & Switcher */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <div className="relative inline-flex items-center">
              <select
                value={activeSeasonId}
                onChange={(e) => onSelectSeason(e.target.value)}
                className="appearance-none bg-slate-900/90 hover:bg-slate-800 text-white font-semibold text-xs py-2 pl-3 pr-8 rounded-xl border border-slate-700/80 focus:outline-none focus:border-amber-400 cursor-pointer shadow-sm transition-colors"
              >
                <option value="all">⭐ All Career (All-Time Stats)</option>
                {seasons.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.club}) {s.isCurrent ? '• Active' : ''}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 pointer-events-none" />
            </div>

            <button
              onClick={onManageSeasonsClick}
              className="text-xs text-slate-400 hover:text-white underline underline-offset-4 transition-colors"
            >
              + Create / Manage Seasons
            </button>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
          <button
            onClick={onLogMatchClick}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold text-sm shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all transform hover:-translate-y-0.5 whitespace-nowrap cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            Log Match Performance
          </button>

          <button
            onClick={onPlayMatchdayClick}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-emerald-500/40 text-emerald-300 hover:text-emerald-200 font-bold text-sm shadow-md transition-all transform hover:-translate-y-0.5 whitespace-nowrap cursor-pointer"
          >
            <Gamepad2 className="w-4 h-4 text-emerald-400" />
            Play Matchday Simulator
          </button>

          <button
            onClick={onViewTrophiesClick}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-700/60 text-slate-300 hover:text-white font-medium text-xs transition-colors whitespace-nowrap"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            View Silverware Cabinet
          </button>
        </div>
      </div>
    </div>
  );
};
