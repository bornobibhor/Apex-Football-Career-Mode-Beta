import React from 'react';
import { Menu, Plus, Calendar, Gamepad2, ChevronRight, User } from 'lucide-react';
import { Season, PlayerProfile } from '../../types/career';
import { NavTab } from './Sidebar';

interface HeaderProps {
  currentTab: NavTab;
  player: PlayerProfile;
  activeSeason: Season | null;
  activeSeasonId: string;
  seasons: Season[];
  onSelectSeason: (id: string) => void;
  onOpenMobileSidebar: () => void;
  onLogMatchClick: () => void;
  onPlaySimulatorClick: () => void;
  onManageSeasonsClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  player,
  activeSeason,
  activeSeasonId,
  seasons,
  onSelectSeason,
  onOpenMobileSidebar,
  onLogMatchClick,
  onPlaySimulatorClick,
  onManageSeasonsClick,
}) => {
  const getTabTitle = (tab: NavTab) => {
    switch (tab) {
      case 'dashboard':
        return 'Career Overview';
      case 'profile':
        return 'Player Profile & Card';
      case 'statistics':
        return 'Career Statistics';
      case 'matches':
        return 'Match History';
      case 'trophies':
        return 'Trophy Cabinet';
      case 'records':
        return 'Career Records';
      case 'transfers':
        return 'Club Transfers';
      case 'achievements':
        return 'Achievements & Badges';
      case 'simulator':
        return 'Matchday Simulator';
      case 'data':
        return 'Data & Backup';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-[#080b11]/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-8 py-3 flex items-center justify-between gap-4">
      {/* Left: Mobile hamburger & Context breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
          <span className="text-slate-300 font-bold hidden sm:inline">Career Studio</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600 hidden sm:inline" />
          <span className="text-white font-bold">{getTabTitle(currentTab)}</span>
        </div>
      </div>

      {/* Right Controls: Active Season Filter & Primary Actions */}
      <div className="flex items-center gap-2.5">
        {/* Season Selector */}
        <div className="hidden md:flex items-center gap-1.5 bg-slate-900 border border-slate-700/80 rounded-xl px-2.5 py-1 text-xs">
          <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <select
            value={activeSeasonId}
            onChange={(e) => onSelectSeason(e.target.value)}
            className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer pr-1 text-xs"
          >
            <option value="all">All-Time Career</option>
            {seasons.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.club})
              </option>
            ))}
          </select>
        </div>

        {/* Play Matchday Simulator CTA */}
        <button
          onClick={onPlaySimulatorClick}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-emerald-500/40 text-emerald-400 hover:text-emerald-300 text-xs font-bold transition-colors cursor-pointer"
        >
          <Gamepad2 className="w-3.5 h-3.5" />
          Play Matchday
        </button>

        {/* Primary Log Match Button */}
        <button
          onClick={onLogMatchClick}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-3.5 h-3.5" />
          Log Match
        </button>
      </div>
    </header>
  );
};
