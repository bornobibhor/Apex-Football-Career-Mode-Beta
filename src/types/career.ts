export type Position = 
  | 'ST' | 'CF' | 'LW' | 'RW' 
  | 'CAM' | 'CM' | 'CDM' | 'LM' | 'RM' 
  | 'CB' | 'LB' | 'RB' | 'LWB' | 'RWB' 
  | 'GK';

export type Foot = 'Right' | 'Left' | 'Both';

export type CardRarity = 'gold' | 'totw' | 'tots' | 'toty' | 'icon' | 'future_stars';

export interface PlayerAttributes {
  pace: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defending: number;
  physical: number;
}

export interface PlayerProfile {
  id: string;
  name: string;
  displayName: string;
  nationality: string;
  countryCode: string;
  age: number;
  dateOfBirth: string;
  preferredPosition: Position;
  secondaryPosition: Position;
  dominantFoot: Foot;
  height: number; // in cm
  weight: number; // in kg
  currentClub: string;
  currentClubCrest?: string;
  squadNumber: number;
  league: string;
  photoUrl: string;
  overallRating: number;
  potentialRating: number;
  playerStatus: string;
  cardStyle: CardRarity;
  attributes: PlayerAttributes;
  bio?: string;
}

export interface Season {
  id: string;
  name: string; // e.g. "2024/25"
  club: string;
  league: string;
  shirtNumber: number;
  isCurrent: boolean;
  notes?: string;
}

export type CompetitionCategory = 
  | 'league'
  | 'domestic_cup'
  | 'league_cup'
  | 'continental'
  | 'international'
  | 'friendly';

export interface CompetitionInfo {
  name: string;
  shortName: string;
  category: CompetitionCategory;
}

export type MatchResult = 'W' | 'D' | 'L';
export type VenueType = 'Home' | 'Away' | 'Neutral';

export interface Match {
  id: string;
  seasonId: string;
  date: string;
  opponent: string;
  competition: string;
  competitionCategory: CompetitionCategory;
  venue: VenueType;
  teamScore: number;
  opponentScore: number;
  result: MatchResult;
  minutesPlayed: number;
  goals: number;
  assists: number;
  matchRating: number; // 1.0 - 10.0
  cleanSheet: boolean;
  yellowCards: number;
  redCards: number;
  penaltiesScored: number;
  penaltiesMissed: number;
  freeKickGoals: number;
  hatTrick: boolean;
  manOfTheMatch: boolean;
  isNationalTeam?: boolean;
  summary?: string;
}

export type TrophyCategory = 'international' | 'continental' | 'domestic' | 'individual';

export interface Trophy {
  id: string;
  name: string;
  category: TrophyCategory;
  competition: string;
  seasonWon?: string;
  dateWon?: string;
  club?: string;
  description: string;
  isUnlocked: boolean;
  count: number;
  iconName: string;
  rarity?: 'bronze' | 'silver' | 'gold' | 'special';
}

export interface TransferRecord {
  id: string;
  date: string;
  season: string;
  fromClub: string;
  toClub: string;
  fee: string;
  shirtNumber: number;
  role: string;
  notes?: string;
}

export type AchievementTier = 'common' | 'rare' | 'epic' | 'legendary' | 'ultimate';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'scoring' | 'appearances' | 'trophies' | 'ratings' | 'milestones';
  tier: AchievementTier;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  target: number;
}

export interface CareerStats {
  appearances: number;
  goals: number;
  assists: number;
  goalContributions: number;
  cleanSheets: number;
  minutesPlayed: number;
  yellowCards: number;
  redCards: number;
  penaltiesScored: number;
  penaltiesMissed: number;
  freeKickGoals: number;
  hatTricks: number;
  manOfTheMatch: number;
  averageRating: number;
  wins: number;
  draws: number;
  losses: number;
  winRate: number;
  goalsPer90: number;
  assistsPer90: number;
  goalContributionsPer90: number;
  minutesPerGoal: number;
}

export interface CareerRecordsData {
  highestScoringSeason: { seasonName: string; goals: number };
  mostAssistsSeason: { seasonName: string; assists: number };
  mostAppearancesSeason: { seasonName: string; appearances: number };
  highestMatchRating: { rating: number; opponent: string; date: string; season: string };
  longestScoringStreak: number;
  currentScoringStreak: number;
  longestWinStreak: number;
  currentWinStreak: number;
  mostHatTricksInSeason: { seasonName: string; count: number };
  biggestVictory: { score: string; opponent: string; date: string; margin: number };
}

export interface CareerDatabase {
  version: number;
  player: PlayerProfile;
  seasons: Season[];
  activeSeasonId: string; // or 'all'
  matches: Match[];
  trophies: Trophy[];
  transfers: TransferRecord[];
  achievements: Achievement[];
  lastUpdated: string;
}
