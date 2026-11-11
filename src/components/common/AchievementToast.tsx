import React, { useEffect } from 'react';
import { Achievement } from '../../types/career';
import { Award, Sparkles, X } from 'lucide-react';

interface AchievementToastProps {
  achievement: Achievement | null;
  onClose: () => void;
}

export const AchievementToast: React.FC<AchievementToastProps> = ({ achievement, onClose }) => {
  useEffect(() => {
    if (!achievement) return;
    const timer = setTimeout(() => {
      onClose();
    }, 6000);
    return () => clearTimeout(timer);
  }, [achievement, onClose]);

  if (!achievement) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-300">
      <div className="bg-gradient-to-r from-[#1b170c] via-[#2a220e] to-[#120f06] border-2 border-amber-400/80 rounded-2xl p-4 shadow-[0_0_30px_rgba(245,158,11,0.4)] flex items-center gap-3.5 max-w-md">
        {/* Golden trophy badge */}
        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-slate-950 font-black shadow-lg shrink-0">
          <Award className="w-6 h-6 text-slate-950" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-amber-400">
            <Sparkles className="w-3 h-3" />
            Achievement Unlocked!
          </div>
          <h4 className="text-sm font-black text-white font-display truncate mt-0.5">
            {achievement.title}
          </h4>
          <p className="text-xs text-slate-300 line-clamp-1 mt-0.5">
            {achievement.description}
          </p>
        </div>

        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
