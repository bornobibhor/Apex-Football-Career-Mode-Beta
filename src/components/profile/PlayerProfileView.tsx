import React from 'react';
import { PlayerProfile, CareerStats } from '../../types/career';
import { PlayerCardPreview } from '../dashboard/PlayerCardPreview';
import { Edit3, User, Shield, Award, Calendar, Ruler, Weight, Compass, Sparkles } from 'lucide-react';

interface PlayerProfileViewProps {
  player: PlayerProfile;
  stats: CareerStats;
  onEditClick: () => void;
}

export const PlayerProfileView: React.FC<PlayerProfileViewProps> = ({ player, stats, onEditClick }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black font-display text-white">Player Career Profile</h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Personal bio, EA FC card specifications, physical metrics, and attributes breakdown
          </p>
        </div>

        <button
          onClick={onEditClick}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow-md transition-all self-start sm:self-auto cursor-pointer"
        >
          <Edit3 className="w-4 h-4" />
          Edit Profile & Attributes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: The EA FC Card (4 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <PlayerCardPreview player={player} onEditClick={onEditClick} />
        </div>

        {/* Right Column: In-depth Profile Details (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Personal Bio Card */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 font-display flex items-center gap-2">
              <User className="w-4 h-4" />
              Scouting Report & Player Biography
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed italic">
              "{player.bio || 'A world class professional football talent with exceptional work ethic and pedigree.'}"
            </p>

            <div className="pt-2 border-t border-slate-800 flex items-center gap-3">
              <span className="text-xs text-slate-400">Squad Status:</span>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                {player.playerStatus}
              </span>
            </div>
          </div>

          {/* Core Personal & Physical Bio Matrix */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 font-display">
              Physical & Tactical Characteristics
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">Nationality</span>
                <span className="text-sm font-bold text-white mt-0.5 block">{player.nationality}</span>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">Age / Date of Birth</span>
                <span className="text-sm font-bold text-white mt-0.5 block">
                  {player.age} yrs · <span className="font-mono text-xs text-slate-400">{player.dateOfBirth}</span>
                </span>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">Current Club</span>
                <span className="text-sm font-bold text-amber-400 mt-0.5 block truncate">
                  {player.currentClub}
                </span>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">Primary Position</span>
                <span className="text-sm font-black text-white mt-0.5 block">{player.preferredPosition}</span>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">Secondary Position</span>
                <span className="text-sm font-black text-slate-300 mt-0.5 block">
                  {player.secondaryPosition}
                </span>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">Preferred Foot</span>
                <span className="text-sm font-bold text-white mt-0.5 block">{player.dominantFoot}</span>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">Height</span>
                <span className="text-sm font-bold text-white mt-0.5 block font-mono">{player.height} cm</span>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">Weight</span>
                <span className="text-sm font-bold text-white mt-0.5 block font-mono">{player.weight} kg</span>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">Squad Kit #</span>
                <span className="text-sm font-black text-amber-400 mt-0.5 block font-mono">
                  #{player.squadNumber}
                </span>
              </div>
            </div>
          </div>

          {/* EA FC Rating & Potential Strip */}
          <div className="bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-950 border border-amber-500/30 rounded-2xl p-5 flex items-center justify-between">
            <div>
              <span className="text-xs text-amber-400 font-bold uppercase tracking-wider block">
                EA FC Rating Evaluation
              </span>
              <div className="flex items-center gap-4 mt-1">
                <div>
                  <span className="text-2xl font-black text-white font-display tabular-nums">
                    {player.overallRating}
                  </span>
                  <span className="text-xs text-slate-400 ml-1">OVR</span>
                </div>
                <div className="w-px h-6 bg-slate-800" />
                <div>
                  <span className="text-2xl font-black text-amber-400 font-display tabular-nums">
                    {player.potentialRating}
                  </span>
                  <span className="text-xs text-slate-400 ml-1">POT</span>
                </div>
              </div>
            </div>

            <button
              onClick={onEditClick}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 transition-colors"
            >
              Modify Ratings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
