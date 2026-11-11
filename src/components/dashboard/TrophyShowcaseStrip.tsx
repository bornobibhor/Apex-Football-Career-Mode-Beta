import React from 'react';
import { Trophy } from '../../types/career';
import { TrophyIcon } from '../common/TrophyIcon';
import { Trophy as TrophyIconLucide, ChevronRight } from 'lucide-react';

interface TrophyShowcaseStripProps {
  trophies: Trophy[];
  onViewCabinetClick: () => void;
  onTrophyClick: (trophy: Trophy) => void;
}

export const TrophyShowcaseStrip: React.FC<TrophyShowcaseStripProps> = ({
  trophies,
  onViewCabinetClick,
  onTrophyClick,
}) => {
  const unlocked = trophies.filter((t) => t.isUnlocked);

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
            <TrophyIconLucide className="w-4 h-4 text-amber-400" />
            Trophy Showcase
          </h3>
          <p className="text-xs text-slate-400">
            {unlocked.length} of {trophies.length} trophies unlocked in cabinet
          </p>
        </div>
        <button
          onClick={onViewCabinetClick}
          className="flex items-center gap-1 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
        >
          Open Cabinet
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {unlocked.length === 0 ? (
        <div className="py-6 text-center border border-dashed border-slate-800 rounded-xl">
          <p className="text-sm text-slate-400">Cabinet is currently empty</p>
          <p className="text-xs text-slate-500 mt-1">Unlock silverware from the Trophy Cabinet!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {unlocked.slice(0, 6).map((t) => (
            <div
              key={t.id}
              onClick={() => onTrophyClick(t)}
              className="bg-slate-950/70 hover:bg-slate-800/70 border border-amber-500/20 hover:border-amber-400/50 rounded-xl p-3 flex flex-col items-center text-center cursor-pointer transition-all group relative overflow-hidden"
            >
              {/* Subtle gold sheen */}
              <div className="absolute inset-0 bg-gradient-to-t from-amber-500/5 via-transparent to-transparent pointer-events-none" />

              {/* Count badge if won more than once */}
              {t.count > 1 && (
                <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/40 text-[10px] font-black text-amber-300 font-mono">
                  x{t.count}
                </div>
              )}

              <div className="w-14 h-14 flex items-center justify-center my-1 group-hover:scale-105 transition-transform">
                <TrophyIcon iconName={t.iconName} className="w-12 h-12" unlocked={true} />
              </div>

              <h4 className="text-xs font-bold text-white mt-1 line-clamp-1 group-hover:text-amber-300 transition-colors">
                {t.name}
              </h4>
              <p className="text-[10px] text-slate-400 truncate max-w-full font-mono mt-0.5">
                {t.seasonWon || 'Career'}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
