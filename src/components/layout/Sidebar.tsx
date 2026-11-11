import React from 'react';
import {
  LayoutDashboard,
  User,
  BarChart2,
  Calendar,
  Trophy,
  Flame,
  ArrowRightLeft,
  Award,
  Gamepad2,
  Database,
  Shield,
  Sparkles,
} from 'lucide-react';
import { PlayerProfile, Season } from '../../types/career';

export type NavTab =
  | 'dashboard'
  | 'profile'
  | 'statistics'
  | 'matches'
  | 'trophies'
  | 'records'
  | 'transfers'
  | 'achievements'
  | 'simulator'
  | 'data';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  player: PlayerProfile;
  activeSeason: Season | null;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  player,
  activeSeason,
  isOpenMobile,
  onCloseMobile,
}) => {
  const navItems: { id: NavTab; label: string; icon: React.ElementType; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'profile', label: 'Player Career Card', icon: User },
    { id: 'statistics', label: 'Statistics & Analysis', icon: BarChart2 },
    { id: 'matches', label: 'Match History', icon: Calendar },
    { id: 'trophies', label: 'Trophy Cabinet', icon: Trophy },
    { id: 'records', label: 'Career Records', icon: Flame },
    { id: 'transfers', label: 'Transfers & Clubs', icon: ArrowRightLeft },
    { id: 'achievements', label: 'Achievements', icon: Award },
    { id: 'simulator', label: 'Matchday Simulator', icon: Gamepad2, badge: 'LIVE' },
    { id: 'data', label: 'Data & Backup', icon: Database },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/80 z-40 lg:hidden backdrop-blur-sm"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-[#0a0d14] border-r border-slate-800/80 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Lockup */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 font-black text-sm shadow-[0_0_15px_rgba(245,158,11,0.35)]">
              ⚽
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-white font-display flex items-center gap-1.5">
                Apex Football
              </span>
              <span className="text-[10px] text-amber-400 font-mono font-semibold block -mt-0.5">
                CAREER STUDIO
              </span>
            </div>
          </div>
        </div>

        {/* Player Profile Quick Snippet in Sidebar */}
        <div
          onClick={() => {
            onSelectTab('profile');
            onCloseMobile();
          }}
          className="mx-3 mt-4 p-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 hover:border-amber-400/40 cursor-pointer transition-all flex items-center gap-3 group"
        >
          <div className="relative w-11 h-11 rounded-xl bg-slate-800 border border-slate-700 overflow-hidden shrink-0 flex items-center justify-center">
            {player.photoUrl ? (
              <img
                src={player.photoUrl}
                alt={player.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-top"
              />
            ) : (
              <Shield className="w-6 h-6 text-amber-400" />
            )}
            <div className="absolute top-0 right-0 px-1 bg-amber-400 text-slate-950 font-black text-[9px] rounded-bl font-mono">
              {player.overallRating}
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <div className="font-bold text-white text-xs truncate group-hover:text-amber-300 transition-colors">
              {player.displayName || player.name}
            </div>
            <div className="text-[10px] text-slate-400 truncate flex items-center gap-1 mt-0.5">
              <span>{player.preferredPosition}</span>
              <span aria-hidden="true">·</span>
              <span className="truncate">{player.currentClub}</span>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900/80'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-slate-950' : 'text-slate-400 group-hover:text-white'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`px-1.5 py-0.5 rounded text-[9px] font-black font-mono tracking-wider ${
                      isActive ? 'bg-slate-950 text-emerald-400' : 'bg-emerald-500/20 text-emerald-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer info */}
        <div className="p-4 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
          <span className="font-mono">Season: {activeSeason?.name || 'All-Time'}</span>
          <span className="text-amber-400 font-bold">EA FC Pro</span>
        </div>
      </aside>
    </>
  );
};
