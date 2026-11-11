import { Match, CareerStats, CareerRecordsData, Trophy, Achievement } from '../types/career';

export function calculateStats(matches: Match[]): CareerStats {
  const appearances = matches.length;
  if (appearances === 0) {
    return {
      appearances: 0,
      goals: 0,
      assists: 0,
      goalContributions: 0,
      cleanSheets: 0,
      minutesPlayed: 0,
      yellowCards: 0,
      redCards: 0,
      penaltiesScored: 0,
      penaltiesMissed: 0,
      freeKickGoals: 0,
      hatTricks: 0,
      manOfTheMatch: 0,
      averageRating: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      winRate: 0,
      goalsPer90: 0,
      assistsPer90: 0,
      goalContributionsPer90: 0,
      minutesPerGoal: 0,
    };
  }

  let goals = 0;
  let assists = 0;
  let cleanSheets = 0;
  let minutesPlayed = 0;
  let yellowCards = 0;
  let redCards = 0;
  let penaltiesScored = 0;
  let penaltiesMissed = 0;
  let freeKickGoals = 0;
  let hatTricks = 0;
  let manOfTheMatch = 0;
  let totalRating = 0;
  let wins = 0;
  let draws = 0;
  let losses = 0;

  for (const m of matches) {
    goals += m.goals || 0;
    assists += m.assists || 0;
    if (m.cleanSheet) cleanSheets += 1;
    minutesPlayed += m.minutesPlayed || 0;
    yellowCards += m.yellowCards || 0;
    redCards += m.redCards || 0;
    penaltiesScored += m.penaltiesScored || 0;
    penaltiesMissed += m.penaltiesMissed || 0;
    freeKickGoals += m.freeKickGoals || 0;
    if ((m.goals || 0) >= 3 || m.hatTrick) hatTricks += 1;
    if (m.manOfTheMatch) manOfTheMatch += 1;
    totalRating += m.matchRating || 0;

    if (m.result === 'W') wins += 1;
    else if (m.result === 'D') draws += 1;
    else if (m.result === 'L') losses += 1;
  }

  const goalContributions = goals + assists;
  const averageRating = Number((totalRating / appearances).toFixed(2));
  const winRate = Number(((wins / appearances) * 100).toFixed(1));
  const effectiveNineties = minutesPlayed > 0 ? minutesPlayed / 90 : appearances;
  const goalsPer90 = effectiveNineties > 0 ? Number((goals / effectiveNineties).toFixed(2)) : 0;
  const assistsPer90 = effectiveNineties > 0 ? Number((assists / effectiveNineties).toFixed(2)) : 0;
  const goalContributionsPer90 = effectiveNineties > 0 ? Number((goalContributions / effectiveNineties).toFixed(2)) : 0;
  const minutesPerGoal = goals > 0 ? Math.round(minutesPlayed / goals) : 0;

  return {
    appearances,
    goals,
    assists,
    goalContributions,
    cleanSheets,
    minutesPlayed,
    yellowCards,
    redCards,
    penaltiesScored,
    penaltiesMissed,
    freeKickGoals,
    hatTricks,
    manOfTheMatch,
    averageRating,
    wins,
    draws,
    losses,
    winRate,
    goalsPer90,
    assistsPer90,
    goalContributionsPer90,
    minutesPerGoal,
  };
}

export function calculateRecords(matches: Match[], seasons: { id: string; name: string }[]): CareerRecordsData {
  if (matches.length === 0) {
    return {
      highestScoringSeason: { seasonName: 'N/A', goals: 0 },
      mostAssistsSeason: { seasonName: 'N/A', assists: 0 },
      mostAppearancesSeason: { seasonName: 'N/A', appearances: 0 },
      highestMatchRating: { rating: 0, opponent: 'N/A', date: 'N/A', season: 'N/A' },
      longestScoringStreak: 0,
      currentScoringStreak: 0,
      longestWinStreak: 0,
      currentWinStreak: 0,
      mostHatTricksInSeason: { seasonName: 'N/A', count: 0 },
      biggestVictory: { score: '0 - 0', opponent: 'N/A', date: 'N/A', margin: 0 },
    };
  }

  // Season groupings
  const seasonStatsMap: Record<string, { goals: number; assists: number; appearances: number; hatTricks: number }> = {};
  for (const s of seasons) {
    seasonStatsMap[s.id] = { goals: 0, assists: 0, appearances: 0, hatTricks: 0 };
  }

  // Sort matches chronologically for streaks
  const sortedMatches = [...matches].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  let highestRating = { rating: 0, opponent: 'None', date: '', season: '' };
  let biggestVic = { score: '0 - 0', opponent: 'None', date: '', margin: 0 };

  let maxScoringStreak = 0;
  let currentScoringStreak = 0;

  let maxWinStreak = 0;
  let currentWinStreak = 0;

  for (let i = 0; i < sortedMatches.length; i++) {
    const m = sortedMatches[i];
    const sId = m.seasonId;
    if (!seasonStatsMap[sId]) {
      seasonStatsMap[sId] = { goals: 0, assists: 0, appearances: 0, hatTricks: 0 };
    }
    seasonStatsMap[sId].appearances += 1;
    seasonStatsMap[sId].goals += m.goals || 0;
    seasonStatsMap[sId].assists += m.assists || 0;
    if ((m.goals || 0) >= 3 || m.hatTrick) {
      seasonStatsMap[sId].hatTricks += 1;
    }

    // Rating
    if ((m.matchRating || 0) > highestRating.rating) {
      const sName = seasons.find((s) => s.id === m.seasonId)?.name || 'Season';
      highestRating = {
        rating: m.matchRating,
        opponent: m.opponent,
        date: m.date,
        season: sName,
      };
    }

    // Victory margin
    if (m.result === 'W') {
      const margin = m.teamScore - m.opponentScore;
      if (margin > biggestVic.margin) {
        biggestVic = {
          score: `${m.teamScore} - ${m.opponentScore}`,
          opponent: m.opponent,
          date: m.date,
          margin,
        };
      }
    }

    // Scoring streak
    if ((m.goals || 0) > 0) {
      currentScoringStreak += 1;
      if (currentScoringStreak > maxScoringStreak) {
        maxScoringStreak = currentScoringStreak;
      }
    } else {
      currentScoringStreak = 0;
    }

    // Win streak
    if (m.result === 'W') {
      currentWinStreak += 1;
      if (currentWinStreak > maxWinStreak) {
        maxWinStreak = currentWinStreak;
      }
    } else {
      currentWinStreak = 0;
    }
  }

  // Find max season stats
  let highestScoringSeason = { seasonName: 'N/A', goals: 0 };
  let mostAssistsSeason = { seasonName: 'N/A', assists: 0 };
  let mostAppearancesSeason = { seasonName: 'N/A', appearances: 0 };
  let mostHatTricksInSeason = { seasonName: 'N/A', count: 0 };

  for (const [seasonId, st] of Object.entries(seasonStatsMap)) {
    const sName = seasons.find((s) => s.id === seasonId)?.name || seasonId;
    if (st.goals >= highestScoringSeason.goals) {
      highestScoringSeason = { seasonName: sName, goals: st.goals };
    }
    if (st.assists >= mostAssistsSeason.assists) {
      mostAssistsSeason = { seasonName: sName, assists: st.assists };
    }
    if (st.appearances >= mostAppearancesSeason.appearances) {
      mostAppearancesSeason = { seasonName: sName, appearances: st.appearances };
    }
    if (st.hatTricks >= mostHatTricksInSeason.count) {
      mostHatTricksInSeason = { seasonName: sName, count: st.hatTricks };
    }
  }

  return {
    highestScoringSeason,
    mostAssistsSeason,
    mostAppearancesSeason,
    highestMatchRating: highestRating,
    longestScoringStreak: maxScoringStreak,
    currentScoringStreak,
    longestWinStreak: maxWinStreak,
    currentWinStreak,
    mostHatTricksInSeason,
    biggestVictory: biggestVic,
  };
}

export function evaluateAchievements(
  achievements: Achievement[],
  matches: Match[],
  trophies: Trophy[],
  records: CareerRecordsData
): { updatedAchievements: Achievement[]; newlyUnlocked: Achievement[] } {
  const stats = calculateStats(matches);
  const newlyUnlocked: Achievement[] = [];

  const updatedAchievements = achievements.map((ach) => {
    let progress = 0;
    let unlocked = ach.unlocked;

    switch (ach.id) {
      case 'first_goal':
        progress = stats.goals;
        break;
      case 'first_hat_trick':
        progress = stats.hatTricks;
        break;
      case 'fifty_goals':
        progress = stats.goals;
        break;
      case 'hundred_goals':
        progress = stats.goals;
        break;
      case 'two_hundred_goals':
        progress = stats.goals;
        break;
      case 'free_kick_specialist':
        progress = stats.freeKickGoals;
        break;
      case 'penalty_master':
        progress = stats.penaltiesScored;
        break;

      case 'debut':
        progress = stats.appearances;
        break;
      case 'fifty_apps':
        progress = stats.appearances;
        break;
      case 'hundred_apps':
        progress = stats.appearances;
        break;
      case 'five_hundred_apps':
        progress = stats.appearances;
        break;

      case 'first_assist':
        progress = stats.assists;
        break;
      case 'fifty_assists':
        progress = stats.assists;
        break;
      case 'motm_ten':
        progress = stats.manOfTheMatch;
        break;
      case 'perfect_rating':
        progress = records.highestMatchRating.rating >= 10.0 ? 1 : 0;
        break;
      case 'goal_streak_five':
        progress = records.longestScoringStreak;
        break;

      case 'first_trophy':
        progress = trophies.filter((t) => t.isUnlocked).length;
        break;
      case 'league_champion':
        progress = trophies.filter(
          (t) => t.isUnlocked && (t.id === 'premier_league' || t.id === 'la_liga' || t.id === 'bundesliga' || t.id === 'serie_a' || t.id === 'ligue_1')
        ).length;
        break;
      case 'champions_league_winner':
        progress = trophies.filter((t) => t.isUnlocked && t.id === 'uefa_champions_league').length;
        break;
      case 'ballon_dor_winner':
        progress = trophies.filter((t) => t.isUnlocked && t.id === 'ballon_dor').length;
        break;
      case 'world_cup_winner':
        progress = trophies.filter((t) => t.isUnlocked && t.id === 'fifa_world_cup').length;
        break;
      case 'golden_boot_trophy':
        progress = trophies.filter(
          (t) => t.isUnlocked && (t.id === 'european_golden_shoe' || t.id === 'league_golden_boot' || t.id === 'ucl_top_scorer')
        ).length;
        break;

      default:
        progress = ach.progress;
    }

    const isNowUnlocked = progress >= ach.target;

    if (!unlocked && isNowUnlocked) {
      newlyUnlocked.push({
        ...ach,
        unlocked: true,
        progress,
        unlockedAt: new Date().toISOString(),
      });
      return {
        ...ach,
        unlocked: true,
        progress,
        unlockedAt: new Date().toISOString(),
      };
    }

    return {
      ...ach,
      progress: Math.min(progress, ach.target),
      unlocked,
    };
  });

  return { updatedAchievements, newlyUnlocked };
}
