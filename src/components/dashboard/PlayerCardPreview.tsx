import React, { useState } from 'react';
import { PlayerProfile } from '../../types/career';
import { Sparkles, Edit3, Shield, Activity, Award } from 'lucide-react';

interface PlayerCardPreviewProps {
  player: PlayerProfile;
  onEditClick: () => void;
}

export const PlayerCardPreview: React.FC<PlayerCardPreviewProps> = ({ player, onEditClick }) => {
  const [viewMode, setViewMode] = useState<'card' | 'radar'>('card');
  const [imageError, setImageError] = useState(false);

  const getRarityTheme = () => {
    switch (player.cardStyle) {
      case 'toty':
        return {
          wrapper: 'from-[#0b1636] via-[#102254] to-[#080d1d] border-amber-400/60 shadow-[0_0_35px_rgba(234,179,8,0.25)]',
          badge: 'bg-gradient-to-r from-amber-400 to-amber-200 text-slate-950 font-bold',
          accent: 'text-amber-300',
          trim: 'border-amber-400/30',
        };
      case 'tots':
        return {
          wrapper: 'from-[#061e38] via-[#0b335c] to-[#041121] border-cyan-400/60 shadow-[0_0_35px_rgba(34,211,238,0.25)]',
          badge: 'bg-gradient-to-r from-cyan-400 to-blue-400 text-slate-950 font-bold',
          accent: 'text-cyan-300',
          trim: 'border-cyan-400/30',
        };
      case 'icon':
        return {
          wrapper: 'from-[#1c1a17] via-[#2d281e] to-[#12110e] border-amber-300 shadow-[0_0_35px_rgba(252,211,77,0.3)]',
          badge: 'bg-gradient-to-r from-amber-200 to-yellow-500 text-slate-950 font-bold',
          accent: 'text-amber-200',
          trim: 'border-amber-300/40',
        };
      case 'future_stars':
        return {
          wrapper: 'from-[#2a0845] via-[#481270] to-[#180429] border-fuchsia-400/60 shadow-[0_0_35px_rgba(232,121,249,0.25)]',
          badge: 'bg-gradient-to-r from-fuchsia-400 to-pink-500 text-slate-950 font-bold',
          accent: 'text-fuchsia-300',
          trim: 'border-fuchsia-400/30',
        };
      case 'gold':
      default:
        return {
          wrapper: 'from-[#1e1b13] via-[#2e2615] to-[#12100a] border-amber-500/50 shadow-[0_0_30px_rgba(245,158,11,0.2)]',
          badge: 'bg-gradient-to-r from-amber-400 to-yellow-600 text-slate-950 font-bold',
          accent: 'text-amber-400',
          trim: 'border-amber-500/30',
        };
    }
  };

  const theme = getRarityTheme();
  const attrs = player.attributes;

  // Radar chart points computation (SVG polygon)
  const size = 180;
  const center = size / 2;
  const radius = 65;
  const radarMetrics = [
    { label: 'PAC', value: attrs.pace },
    { label: 'SHO', value: attrs.shooting },
    { label: 'PAS', value: attrs.passing },
    { label: 'DRI', value: attrs.dribbling },
    { label: 'DEF', value: attrs.defending },
    { label: 'PHY', value: attrs.physical },
  ];

  const getCoordinates = (value: number, index: number, total: number) => {
    const angle = (Math.PI * 2 / total) * index - Math.PI / 2;
    const r = (value / 99) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  const polygonPoints = radarMetrics
    .map((m, i) => {
      const pt = getCoordinates(m.value, i, radarMetrics.length);
      return `${pt.x},${pt.y}`;
    })
    .join(' ');

  return (
    <div className="relative group flex flex-col items-center">
      {/* Top Floating Controls */}
      <div className="w-full flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 border border-slate-800 rounded-lg">
          <button
            onClick={() => setViewMode('card')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
              viewMode === 'card' ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            Card
          </button>
          <button
            onClick={() => setViewMode('radar')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
              viewMode === 'radar' ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            Attributes
          </button>
        </div>

        <button
          onClick={onEditClick}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900/90 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors"
          title="Edit Player Profile"
        >
          <Edit3 className="w-3.5 h-3.5 text-amber-400" />
          <span>Edit</span>
        </button>
      </div>

      {/* EA FC Ultimate / Career Card Shell */}
      <div
        className={`relative w-[300px] h-[460px] rounded-[24px] bg-gradient-to-b ${theme.wrapper} border p-4 flex flex-col justify-between overflow-hidden transition-all duration-300 hover:scale-[1.01]`}
      >
        {/* Subtle geometric pattern & holographic sheen */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-0 right-0 w-44 h-44 bg-gradient-to-bl from-amber-400/10 via-transparent to-transparent pointer-events-none" />

        {viewMode === 'card' ? (
          <>
            {/* Top Row: OVR Rating, Position, Nationality, Club Crest */}
            <div className="relative z-10 flex justify-between items-start pt-1">
              <div className="flex flex-col items-center">
                <span className="text-4xl font-black tracking-tight font-display text-white tabular-nums leading-none drop-shadow-md">
                  {player.overallRating}
                </span>
                <span className={`text-base font-extrabold uppercase mt-1 tracking-wider ${theme.accent}`}>
                  {player.preferredPosition}
                </span>
                <div className="w-6 h-0.5 bg-slate-700/60 my-2" />
                {/* Nation flag indicator */}
                <div className="w-7 h-5 rounded bg-slate-800 border border-slate-700/80 flex items-center justify-center overflow-hidden text-xs font-bold text-slate-300 shadow-sm" title={player.nationality}>
                  {player.countryCode ? player.countryCode.slice(-3).toUpperCase() : 'ENG'}
                </div>
                {/* Club indicator */}
                <div className="w-7 h-7 mt-2 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-sm shadow-sm" title={player.currentClub}>
                  {player.currentClubCrest || '⚽'}
                </div>
              </div>

              {/* Player Image Slot with Fallback */}
              <div className="relative w-44 h-52 flex items-end justify-center overflow-hidden rounded-xl">
                {!imageError && player.photoUrl ? (
                  <img
                    src={player.photoUrl}
                    alt={player.name}
                    referrerPolicy="no-referrer"
                    onError={() => setImageError(true)}
                    className="w-full h-full object-cover object-top drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)]"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-b from-slate-800 to-slate-950 flex flex-col items-center justify-center p-3 text-center border border-slate-700/50 rounded-xl">
                    <Shield className="w-12 h-12 text-amber-400/60 mb-2" />
                    <span className="text-xs font-semibold text-slate-300">{player.name}</span>
                    <span className="text-[10px] text-slate-500">{player.currentClub}</span>
                  </div>
                )}
                {/* Bottom shadow blend */}
                <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#0b1636] to-transparent pointer-events-none" />
              </div>
            </div>

            {/* Middle: Player Name */}
            <div className="relative z-10 text-center -mt-2">
              <h2 className="text-xl font-extrabold uppercase tracking-wider text-white font-display truncate drop-shadow-sm">
                {player.displayName || player.name}
              </h2>
              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 mt-0.5">
                <span>{player.currentClub}</span>
                <span aria-hidden="true">·</span>
                <span className="text-amber-400 font-medium">#{player.squadNumber}</span>
                <span aria-hidden="true">·</span>
                <span>{player.dominantFoot} Foot</span>
              </div>
            </div>

            {/* Bottom: EA FC 6 Card Attributes Grid */}
            <div className={`relative z-10 grid grid-cols-2 gap-x-6 gap-y-1 pt-3 pb-2 px-2 border-t ${theme.trim}`}>
              <div className="flex justify-between items-center text-xs">
                <span className="font-extrabold text-white tabular-nums text-sm">{attrs.pace}</span>
                <span className="font-semibold text-slate-400">PAC</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-extrabold text-white tabular-nums text-sm">{attrs.dribbling}</span>
                <span className="font-semibold text-slate-400">DRI</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-extrabold text-white tabular-nums text-sm">{attrs.shooting}</span>
                <span className="font-semibold text-slate-400">SHO</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-extrabold text-white tabular-nums text-sm">{attrs.defending}</span>
                <span className="font-semibold text-slate-400">DEF</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-extrabold text-white tabular-nums text-sm">{attrs.passing}</span>
                <span className="font-semibold text-slate-400">PAS</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-extrabold text-white tabular-nums text-sm">{attrs.physical}</span>
                <span className="font-semibold text-slate-400">PHY</span>
              </div>
            </div>
          </>
        ) : (
          /* Radar / Attributes Deep View */
          <div className="relative z-10 flex flex-col h-full justify-between py-2">
            <div className="text-center">
              <span className="text-xs uppercase font-extrabold tracking-wider text-amber-400">Attribute Distribution</span>
              <h3 className="text-base font-bold text-white mt-0.5">{player.name}</h3>
            </div>

            {/* Hexagon Radar SVG */}
            <div className="relative flex items-center justify-center my-1">
              <svg width={size} height={size} className="overflow-visible">
                {/* Background Concentric Webs */}
                {[0.25, 0.5, 0.75, 1].map((level, lIndex) => {
                  const webPoints = radarMetrics
                    .map((_, i) => {
                      const angle = (Math.PI * 2 / radarMetrics.length) * i - Math.PI / 2;
                      const r = radius * level;
                      return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
                    })
                    .join(' ');
                  return (
                    <polygon
                      key={lIndex}
                      points={webPoints}
                      fill="none"
                      stroke="#334155"
                      strokeWidth="1"
                      strokeDasharray={level < 1 ? '2,2' : undefined}
                    />
                  );
                })}

                {/* Axis lines */}
                {radarMetrics.map((_, i) => {
                  const angle = (Math.PI * 2 / radarMetrics.length) * i - Math.PI / 2;
                  const x = center + radius * Math.cos(angle);
                  const y = center + radius * Math.sin(angle);
                  return <line key={i} x1={center} y1={center} x2={x} y2={y} stroke="#334155" strokeWidth="1" />;
                })}

                {/* Filled Player Shape */}
                <polygon
                  points={polygonPoints}
                  fill="rgba(234, 179, 8, 0.35)"
                  stroke="#fbbf24"
                  strokeWidth="2"
                />

                {/* Point Dots and Labels */}
                {radarMetrics.map((m, i) => {
                  const pt = getCoordinates(m.value, i, radarMetrics.length);
                  const angle = (Math.PI * 2 / radarMetrics.length) * i - Math.PI / 2;
                  const labelDistance = radius + 18;
                  const lx = center + labelDistance * Math.cos(angle);
                  const ly = center + labelDistance * Math.sin(angle);

                  return (
                    <g key={i}>
                      <circle cx={pt.x} cy={pt.y} r="3" fill="#fef08a" />
                      <text
                        x={lx}
                        y={ly + 3}
                        textAnchor="middle"
                        fontSize="9"
                        fontWeight="700"
                        fill="#cbd5e1"
                      >
                        {m.label} {m.value}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Quick Summary Pill below */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-2.5 text-xs flex justify-around text-center">
              <div>
                <span className="text-slate-400 text-[10px] uppercase block">OVR Rating</span>
                <span className="text-white font-extrabold text-sm tabular-nums">{player.overallRating}</span>
              </div>
              <div className="w-px bg-slate-800" />
              <div>
                <span className="text-slate-400 text-[10px] uppercase block">Potential</span>
                <span className="text-amber-400 font-extrabold text-sm tabular-nums">{player.potentialRating}</span>
              </div>
              <div className="w-px bg-slate-800" />
              <div>
                <span className="text-slate-400 text-[10px] uppercase block">Status</span>
                <span className="text-slate-200 font-semibold text-xs truncate max-w-[90px] block">Star Player</span>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Card Footer Bar */}
        <div className="relative z-10 flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/80">
          <span className="uppercase font-semibold tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            EA FC Career
          </span>
          <span className="tabular-nums font-mono">POT: {player.potentialRating}</span>
        </div>
      </div>
    </div>
  );
};
