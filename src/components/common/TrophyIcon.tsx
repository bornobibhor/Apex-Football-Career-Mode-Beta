import React from 'react';

interface TrophyIconProps {
  iconName: string;
  className?: string;
  unlocked?: boolean;
}

export const TrophyIcon: React.FC<TrophyIconProps> = ({ iconName, className = 'w-12 h-12', unlocked = true }) => {
  const baseColor = unlocked ? 'text-amber-400' : 'text-slate-600';
  const fillAccent = unlocked ? 'url(#goldGradient)' : '#334155';
  const strokeColor = unlocked ? '#fef08a' : '#475569';

  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${className} ${baseColor}`}>
      <defs>
        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="30%" stopColor="#f59e0b" />
          <stop offset="70%" stopColor="#d97706" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
        <linearGradient id="silverGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f8fafc" />
          <stop offset="50%" stopColor="#cbd5e1" />
          <stop offset="100%" stopColor="#64748b" />
        </linearGradient>
      </defs>

      {/* UCL Big Ears Trophy */}
      {iconName === 'trophy-ucl' && (
        <g>
          {/* Base */}
          <path d="M22 56h20v4H22z" fill={fillAccent} stroke={strokeColor} strokeWidth="1.5" />
          <path d="M26 50h12v6H26z" fill={fillAccent} />
          {/* Stem */}
          <path d="M30 42h4v8h-4z" fill={fillAccent} />
          {/* Cup Body */}
          <path d="M20 18c0 14 6 24 12 24s12-10 12-24H20z" fill={fillAccent} stroke={strokeColor} strokeWidth="1.5" />
          {/* Distinctive UCL Large Handles */}
          <path
            d="M20 20c-8-2-12 6-12 14 0 9 7 14 12 14m24-28c8-2 12 6 12 14 0 9-7 14-12 14"
            stroke={strokeColor}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Rim crown */}
          <path d="M19 18h26" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
        </g>
      )}

      {/* Ballon d'Or Golden Ball */}
      {iconName === 'trophy-ballon-dor' && (
        <g>
          {/* Stand */}
          <rect x="24" y="52" width="16" height="8" rx="2" fill={fillAccent} stroke={strokeColor} strokeWidth="1.5" />
          <path d="M28 44h8v8h-8z" fill={fillAccent} />
          {/* Golden Football Globe */}
          <circle cx="32" cy="26" r="18" fill={fillAccent} stroke={strokeColor} strokeWidth="1.5" />
          {/* Pentagon seams */}
          <polygon points="32,20 37,24 35,30 29,30 27,24" fill={unlocked ? '#92400e' : '#1e293b'} />
          <path d="M32 20L32 12M37 24L44 23M35 30L40 37M29 30L24 37M27 24L20 23" stroke={strokeColor} strokeWidth="1.5" />
        </g>
      )}

      {/* FIFA World Cup Trophy */}
      {iconName === 'trophy-world' && (
        <g>
          {/* Base rings */}
          <rect x="22" y="54" width="20" height="6" rx="2" fill={fillAccent} stroke={strokeColor} strokeWidth="1.5" />
          <rect x="24" y="48" width="16" height="6" fill={fillAccent} />
          {/* Athletes holding globe */}
          <path d="M26 48c0-8 3-14 3-18m6 18c0-8-3-14-3-18" stroke={strokeColor} strokeWidth="2" />
          <path d="M25 36c2-4 7-6 7-6s5 2 7 6" stroke={strokeColor} strokeWidth="1.5" />
          {/* World sphere */}
          <circle cx="32" cy="18" r="10" fill={fillAccent} stroke={strokeColor} strokeWidth="1.5" />
          <path d="M24 18h16M32 10c-3 4-3 12 0 16" stroke={strokeColor} strokeWidth="1" />
        </g>
      )}

      {/* Golden Boot Shoe */}
      {iconName === 'trophy-golden-boot' && (
        <g>
          {/* Plinth */}
          <rect x="12" y="52" width="40" height="8" rx="2" fill={fillAccent} stroke={strokeColor} strokeWidth="1.5" />
          {/* Football Cleat silhouette */}
          <path
            d="M16 46c4-1 9-3 14-6l10-12c3-1 7 1 8 4l2 9c1 3-1 6-4 7l-26 2c-3 0-5-2-4-4z"
            fill={fillAccent}
            stroke={strokeColor}
            strokeWidth="1.5"
          />
          {/* Cleat Studs */}
          <rect x="20" y="48" width="3" height="4" fill={strokeColor} />
          <rect x="28" y="48" width="3" height="4" fill={strokeColor} />
          <rect x="36" y="48" width="3" height="4" fill={strokeColor} />
          <rect x="44" y="48" width="3" height="4" fill={strokeColor} />
          {/* Shoe laces */}
          <path d="M36 28l-3 3m2-5l-3 3" stroke={unlocked ? '#fff' : '#64748b'} strokeWidth="1.5" strokeLinecap="round" />
        </g>
      )}

      {/* Premier League Lion / Chalice */}
      {iconName === 'trophy-league-pl' && (
        <g>
          {/* Base */}
          <path d="M18 56h28v4H18z" fill={fillAccent} stroke={strokeColor} strokeWidth="1.5" />
          <path d="M22 50h20v6H22z" fill={fillAccent} />
          <path d="M28 42h8v8h-8z" fill={fillAccent} />
          {/* Chalice body */}
          <path d="M20 22h24l-3 20H23L20 22z" fill={fillAccent} stroke={strokeColor} strokeWidth="1.5" />
          {/* Crown on top */}
          <path d="M22 22l5-8 5 6 5-6 5 8H22z" fill={fillAccent} stroke={strokeColor} strokeWidth="1.5" />
          {/* Crown jewels */}
          <circle cx="27" cy="14" r="1.5" fill={unlocked ? '#ef4444' : '#64748b'} />
          <circle cx="32" cy="20" r="1.5" fill={unlocked ? '#3b82f6' : '#64748b'} />
          <circle cx="37" cy="14" r="1.5" fill={unlocked ? '#ef4444' : '#64748b'} />
          {/* Side handles */}
          <path d="M20 26c-5 0-7 6-7 11 0 4 3 7 7 7m24-18c5 0 7 6 7 11 0 4-3 7-7 7" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
        </g>
      )}

      {/* Shield / League Plaque */}
      {iconName === 'trophy-shield' && (
        <g>
          <path
            d="M32 8l18 8v16c0 14-8 22-18 26C22 54 14 46 14 32V16l18-8z"
            fill={fillAccent}
            stroke={strokeColor}
            strokeWidth="1.5"
          />
          <path
            d="M32 14l12 6v12c0 10-6 16-12 19-6-3-12-9-12-19V20l12-6z"
            fill={unlocked ? '#78350f' : '#1e293b'}
            stroke={strokeColor}
            strokeWidth="1"
          />
          <polygon points="32,24 35,32 43,32 37,37 39,45 32,40 25,45 27,37 21,32 29,32" fill={fillAccent} />
        </g>
      )}

      {/* Generic Cup / Chalice */}
      {(iconName === 'trophy-cup' || iconName === 'trophy-chalice' || iconName === 'trophy-league-es') && (
        <g>
          <path d="M22 56h20v4H22z" fill={fillAccent} stroke={strokeColor} strokeWidth="1.5" />
          <path d="M26 48h12v8H26z" fill={fillAccent} />
          <path d="M29 40h6v8h-6z" fill={fillAccent} />
          <path d="M20 16h24v14c0 8-5 13-12 13s-12-5-12-13V16z" fill={fillAccent} stroke={strokeColor} strokeWidth="1.5" />
          <path d="M20 20c-6 0-9 4-9 9s4 9 9 9m24-18c6 0 9 4 9 9s-4 9-9 9" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
          <ellipse cx="32" cy="16" rx="12" ry="3" fill={fillAccent} stroke={strokeColor} strokeWidth="1.5" />
        </g>
      )}

      {/* Star / MVP Trophy */}
      {(iconName === 'trophy-star' || iconName === 'trophy-the-best') && (
        <g>
          <rect x="22" y="52" width="20" height="8" rx="2" fill={fillAccent} stroke={strokeColor} strokeWidth="1.5" />
          <path d="M28 42h8v10h-8z" fill={fillAccent} />
          <polygon
            points="32,10 37,24 51,24 40,33 44,46 32,38 20,46 24,33 13,24 27,24"
            fill={fillAccent}
            stroke={strokeColor}
            strokeWidth="1.5"
          />
        </g>
      )}

      {/* Globe */}
      {iconName === 'trophy-globe' && (
        <g>
          <rect x="22" y="52" width="20" height="8" rx="2" fill={fillAccent} stroke={strokeColor} strokeWidth="1.5" />
          <path d="M28 40h8v12h-8z" fill={fillAccent} />
          <circle cx="32" cy="24" r="16" fill={fillAccent} stroke={strokeColor} strokeWidth="1.5" />
          <path d="M16 24h32M32 8c-6 6-6 26 0 32" stroke={strokeColor} strokeWidth="1.5" />
        </g>
      )}

      {/* Default ribbon/trophy */}
      {!['trophy-ucl', 'trophy-ballon-dor', 'trophy-world', 'trophy-golden-boot', 'trophy-league-pl', 'trophy-shield', 'trophy-cup', 'trophy-chalice', 'trophy-league-es', 'trophy-star', 'trophy-the-best', 'trophy-globe'].includes(iconName) && (
        <g>
          <path d="M22 54h20v6H22z" fill={fillAccent} stroke={strokeColor} strokeWidth="1.5" />
          <path d="M29 42h6v12h-6z" fill={fillAccent} />
          <path d="M20 18h24v12c0 8-5 14-12 14s-12-6-12-14V18z" fill={fillAccent} stroke={strokeColor} strokeWidth="1.5" />
          <path d="M20 22c-5 0-8 3-8 8s3 8 8 8m24-16c5 0 8 3 8 8s-3 8-8 8" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
        </g>
      )}
    </svg>
  );
};
