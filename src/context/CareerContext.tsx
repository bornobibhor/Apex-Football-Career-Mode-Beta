import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  CareerDatabase,
  PlayerProfile,
  Season,
  Match,
  Trophy,
  TransferRecord,
  Achievement,
  CareerStats,
  CareerRecordsData,
} from '../types/career';
import { buildDefaultDatabase } from '../data/defaultCareer';
import { calculateStats, calculateRecords, evaluateAchievements } from '../utils/statisticsCalculator';

const STORAGE_KEY = 'apex_football_career_v1';

interface CareerContextType {
  database: CareerDatabase;
  player: PlayerProfile;
  seasons: Season[];
  activeSeasonId: string;
  setActiveSeasonId: (id: string) => void;
  activeSeason: Season | null;
  filteredMatches: Match[];
  allMatches: Match[];
  activeStats: CareerStats;
  allTimeStats: CareerStats;
  careerRecords: CareerRecordsData;
  trophies: Trophy[];
  transfers: TransferRecord[];
  achievements: Achievement[];
  recentUnlockedAchievement: Achievement | null;
  clearAchievementNotification: () => void;

  // Actions
  updatePlayer: (updates: Partial<PlayerProfile>) => void;
  addMatch: (match: Omit<Match, 'id'>) => void;
  updateMatch: (id: string, updates: Partial<Match>) => void;
  deleteMatch: (id: string) => void;
  addSeason: (season: Omit<Season, 'id'>) => void;
  updateSeason: (id: string, updates: Partial<Season>) => void;
  deleteSeason: (id: string) => void;
  unlockTrophy: (trophyId: string, seasonWon: string, dateWon: string, club: string) => void;
  updateTrophy: (trophyId: string, updates: Partial<Trophy>) => void;
  addCustomTrophy: (trophy: Omit<Trophy, 'id'>) => void;
  removeTrophy: (trophyId: string) => void;
  addTransfer: (transfer: Omit<TransferRecord, 'id'>) => void;
  updateTransfer: (id: string, updates: Partial<TransferRecord>) => void;
  deleteTransfer: (id: string) => void;

  // Data persistence & management
  exportBackupJson: () => void;
  importBackupJson: (jsonString: string) => { success: boolean; error?: string };
  resetToDemo: () => void;
  startFreshCareer: () => void;
}

const CareerContext = createContext<CareerContextType | null>(null);

export const CareerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [database, setDatabase] = useState<CareerDatabase>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.player && parsed.matches && parsed.seasons) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load career from storage', e);
    }
    return buildDefaultDatabase();
  });

  const [activeSeasonId, setActiveSeasonId] = useState<string>('all');
  const [recentUnlockedAchievement, setRecentUnlockedAchievement] = useState<Achievement | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(database));
    } catch (e) {
      console.error('Failed to save career database', e);
    }
  }, [database]);

  // Derived state
  const player = database.player;
  const seasons = database.seasons;
  const allMatches = database.matches;
  const trophies = database.trophies;
  const transfers = database.transfers;

  const activeSeason = useMemo(() => {
    if (activeSeasonId === 'all') return null;
    return seasons.find((s) => s.id === activeSeasonId) || null;
  }, [seasons, activeSeasonId]);

  const filteredMatches = useMemo(() => {
    if (activeSeasonId === 'all') {
      return [...allMatches].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
    return allMatches
      .filter((m) => m.seasonId === activeSeasonId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [allMatches, activeSeasonId]);

  const activeStats = useMemo(() => calculateStats(filteredMatches), [filteredMatches]);
  const allTimeStats = useMemo(() => calculateStats(allMatches), [allMatches]);
  const careerRecords = useMemo(() => calculateRecords(allMatches, seasons), [allMatches, seasons]);

  // Trigger achievement evaluation on matches, trophies, or records update
  const syncAchievements = useCallback(
    (currentDb: CareerDatabase) => {
      const records = calculateRecords(currentDb.matches, currentDb.seasons);
      const { updatedAchievements, newlyUnlocked } = evaluateAchievements(
        currentDb.achievements,
        currentDb.matches,
        currentDb.trophies,
        records
      );

      if (newlyUnlocked.length > 0) {
        setRecentUnlockedAchievement(newlyUnlocked[0]);
      }

      return {
        ...currentDb,
        achievements: updatedAchievements,
        lastUpdated: new Date().toISOString(),
      };
    },
    []
  );

  const clearAchievementNotification = useCallback(() => {
    setRecentUnlockedAchievement(null);
  }, []);

  // Update Player Profile
  const updatePlayer = useCallback((updates: Partial<PlayerProfile>) => {
    setDatabase((prev) => ({
      ...prev,
      player: { ...prev.player, ...updates },
      lastUpdated: new Date().toISOString(),
    }));
  }, []);

  // Match Actions
  const addMatch = useCallback(
    (newMatchData: Omit<Match, 'id'>) => {
      const newMatch: Match = {
        ...newMatchData,
        id: `m_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      };
      setDatabase((prev) => {
        const updated = {
          ...prev,
          matches: [newMatch, ...prev.matches],
        };
        return syncAchievements(updated);
      });
    },
    [syncAchievements]
  );

  const updateMatch = useCallback(
    (id: string, updates: Partial<Match>) => {
      setDatabase((prev) => {
        const updated = {
          ...prev,
          matches: prev.matches.map((m) => (m.id === id ? { ...m, ...updates } : m)),
        };
        return syncAchievements(updated);
      });
    },
    [syncAchievements]
  );

  const deleteMatch = useCallback(
    (id: string) => {
      setDatabase((prev) => {
        const updated = {
          ...prev,
          matches: prev.matches.filter((m) => m.id !== id),
        };
        return syncAchievements(updated);
      });
    },
    [syncAchievements]
  );

  // Seasons
  const addSeason = useCallback((newSeasonData: Omit<Season, 'id'>) => {
    const newSeason: Season = {
      ...newSeasonData,
      id: `season_${Date.now()}`,
    };
    setDatabase((prev) => ({
      ...prev,
      seasons: [...prev.seasons, newSeason],
      lastUpdated: new Date().toISOString(),
    }));
  }, []);

  const updateSeason = useCallback((id: string, updates: Partial<Season>) => {
    setDatabase((prev) => ({
      ...prev,
      seasons: prev.seasons.map((s) => (s.id === id ? { ...s, ...updates } : s)),
      lastUpdated: new Date().toISOString(),
    }));
  }, []);

  const deleteSeason = useCallback((id: string) => {
    setDatabase((prev) => ({
      ...prev,
      seasons: prev.seasons.filter((s) => s.id !== id),
      // Also detach matches or keep them safe
      matches: prev.matches.filter((m) => m.seasonId !== id),
      lastUpdated: new Date().toISOString(),
    }));
  }, []);

  // Trophies
  const unlockTrophy = useCallback(
    (trophyId: string, seasonWon: string, dateWon: string, club: string) => {
      setDatabase((prev) => {
        const updatedTrophies = prev.trophies.map((t) => {
          if (t.id === trophyId) {
            return {
              ...t,
              isUnlocked: true,
              count: (t.count || 0) + 1,
              seasonWon,
              dateWon,
              club,
            };
          }
          return t;
        });
        const updated = {
          ...prev,
          trophies: updatedTrophies,
        };
        return syncAchievements(updated);
      });
    },
    [syncAchievements]
  );

  const updateTrophy = useCallback(
    (trophyId: string, updates: Partial<Trophy>) => {
      setDatabase((prev) => {
        const updatedTrophies = prev.trophies.map((t) => (t.id === trophyId ? { ...t, ...updates } : t));
        const updated = {
          ...prev,
          trophies: updatedTrophies,
        };
        return syncAchievements(updated);
      });
    },
    [syncAchievements]
  );

  const addCustomTrophy = useCallback(
    (newTrophyData: Omit<Trophy, 'id'>) => {
      const newTrophy: Trophy = {
        ...newTrophyData,
        id: `trophy_custom_${Date.now()}`,
      };
      setDatabase((prev) => {
        const updated = {
          ...prev,
          trophies: [newTrophy, ...prev.trophies],
        };
        return syncAchievements(updated);
      });
    },
    [syncAchievements]
  );

  const removeTrophy = useCallback(
    (trophyId: string) => {
      setDatabase((prev) => {
        const updated = {
          ...prev,
          trophies: prev.trophies.map((t) =>
            t.id === trophyId ? { ...t, isUnlocked: false, count: 0 } : t
          ),
        };
        return syncAchievements(updated);
      });
    },
    [syncAchievements]
  );

  // Transfers
  const addTransfer = useCallback((transferData: Omit<TransferRecord, 'id'>) => {
    const newTransfer: TransferRecord = {
      ...transferData,
      id: `transfer_${Date.now()}`,
    };
    setDatabase((prev) => ({
      ...prev,
      transfers: [...prev.transfers, newTransfer],
      lastUpdated: new Date().toISOString(),
    }));
  }, []);

  const updateTransfer = useCallback((id: string, updates: Partial<TransferRecord>) => {
    setDatabase((prev) => ({
      ...prev,
      transfers: prev.transfers.map((t) => (t.id === id ? { ...t, ...updates } : t)),
      lastUpdated: new Date().toISOString(),
    }));
  }, []);

  const deleteTransfer = useCallback((id: string) => {
    setDatabase((prev) => ({
      ...prev,
      transfers: prev.transfers.filter((t) => t.id !== id),
      lastUpdated: new Date().toISOString(),
    }));
  }, []);

  // Export JSON
  const exportBackupJson = useCallback(() => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(database, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    const fileName = `apex_football_career_${database.player.name.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.json`;
    downloadAnchor.setAttribute('download', fileName);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }, [database]);

  // Import JSON
  const importBackupJson = useCallback(
    (jsonString: string): { success: boolean; error?: string } => {
      try {
        const parsed = JSON.parse(jsonString);
        if (!parsed.player || !parsed.matches || !parsed.seasons) {
          return { success: false, error: 'Invalid career backup format. Missing core sections.' };
        }
        const synced = syncAchievements(parsed);
        setDatabase(synced);
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err?.message || 'Failed to parse JSON file' };
      }
    },
    [syncAchievements]
  );

  // Reset to Demo Career
  const resetToDemo = useCallback(() => {
    const demo = buildDefaultDatabase();
    const synced = syncAchievements(demo);
    setDatabase(synced);
    setActiveSeasonId('all');
  }, [syncAchievements]);

  // Start Fresh Blank Career
  const startFreshCareer = useCallback(() => {
    const freshPlayer: PlayerProfile = {
      id: `player_${Date.now()}`,
      name: 'New Player',
      displayName: 'Player',
      nationality: 'England',
      countryCode: 'GB-ENG',
      age: 18,
      dateOfBirth: '2008-01-01',
      preferredPosition: 'ST',
      secondaryPosition: 'CF',
      dominantFoot: 'Right',
      height: 182,
      weight: 75,
      currentClub: 'Academy FC',
      squadNumber: 19,
      league: 'Premier League',
      photoUrl: '/src/assets/images/player_striker_portrait_1794400814068.jpg',
      overallRating: 72,
      potentialRating: 88,
      playerStatus: 'Exciting Young Prospect',
      cardStyle: 'gold',
      attributes: {
        pace: 78,
        shooting: 74,
        passing: 68,
        dribbling: 75,
        defending: 35,
        physical: 70,
      },
      bio: 'Ready to write history from the ground up.',
    };

    const initialSeason: Season = {
      id: `season_${Date.now()}`,
      name: '2026/27',
      club: 'Academy FC',
      league: 'Premier League',
      shirtNumber: 19,
      isCurrent: true,
      notes: 'Debut rookie professional season.',
    };

    const freshDatabase: CareerDatabase = {
      version: 1,
      player: freshPlayer,
      seasons: [initialSeason],
      activeSeasonId: initialSeason.id,
      matches: [],
      trophies: buildDefaultDatabase().trophies.map((t) => ({ ...t, isUnlocked: false, count: 0 })),
      transfers: [],
      achievements: buildDefaultDatabase().achievements.map((a) => ({ ...a, unlocked: false, progress: 0 })),
      lastUpdated: new Date().toISOString(),
    };

    setDatabase(freshDatabase);
    setActiveSeasonId(initialSeason.id);
  }, []);

  return (
    <CareerContext.Provider
      value={{
        database,
        player,
        seasons,
        activeSeasonId,
        setActiveSeasonId,
        activeSeason,
        filteredMatches,
        allMatches,
        activeStats,
        allTimeStats,
        careerRecords,
        trophies: database.trophies,
        transfers: database.transfers,
        achievements: database.achievements,
        recentUnlockedAchievement,
        clearAchievementNotification,

        updatePlayer,
        addMatch,
        updateMatch,
        deleteMatch,
        addSeason,
        updateSeason,
        deleteSeason,
        unlockTrophy,
        updateTrophy,
        addCustomTrophy,
        removeTrophy,
        addTransfer,
        updateTransfer,
        deleteTransfer,

        exportBackupJson,
        importBackupJson,
        resetToDemo,
        startFreshCareer,
      }}
    >
      {children}
    </CareerContext.Provider>
  );
};

export function useCareer() {
  const context = useContext(CareerContext);
  if (!context) {
    throw new Error('useCareer must be used within a CareerProvider');
  }
  return context;
}
