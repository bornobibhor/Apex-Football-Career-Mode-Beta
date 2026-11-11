import React, { useState, useEffect } from 'react';
import { PlayerProfile, Season, Match, CompetitionCategory } from '../../types/career';
import { Play, RotateCcw, Save, ShieldAlert, Award, Sparkles, X, Activity } from 'lucide-react';

interface MatchdaySimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  player: PlayerProfile;
  currentSeason: Season | null;
  onSaveMatch: (match: Omit<Match, 'id'>) => void;
}

interface MatchEventDecision {
  minute: number;
  situation: string;
  choices: {
    label: string;
    attribute: keyof PlayerProfile['attributes'];
    bonusRating: number;
    goalChance: number;
    assistChance: number;
  }[];
}

const PRESET_OPPONENTS = [
  'FC Barcelona',
  'Manchester City',
  'Bayern Munich',
  'Paris Saint-Germain',
  'Liverpool FC',
  'Inter Milan',
  'Arsenal FC',
  'Juventus',
  'Atlético Madrid',
  'Borussia Dortmund',
];

export const MatchdaySimulatorModal: React.FC<MatchdaySimulatorModalProps> = ({
  isOpen,
  onClose,
  player,
  currentSeason,
  onSaveMatch,
}) => {
  const [opponent, setOpponent] = useState('FC Barcelona');
  const [competition, setCompetition] = useState('UEFA Champions League');
  const [competitionCategory, setCompetitionCategory] = useState<CompetitionCategory>('continental');
  const [venue, setVenue] = useState<'Home' | 'Away' | 'Neutral'>('Home');

  // Simulation state
  const [simState, setSimState] = useState<'setup' | 'playing' | 'decision' | 'finished'>('setup');
  const [currentMinute, setCurrentMinute] = useState(0);
  const [teamScore, setTeamScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [playerGoals, setPlayerGoals] = useState(0);
  const [playerAssists, setPlayerAssists] = useState(0);
  const [penaltiesScored, setPenaltiesScored] = useState(0);
  const [freeKickGoals, setFreeKickGoals] = useState(0);
  const [matchRating, setMatchRating] = useState(7.0);
  const [commentary, setCommentary] = useState<string[]>([]);
  const [currentDecision, setCurrentDecision] = useState<MatchEventDecision | null>(null);

  if (!isOpen) return null;

  const startSimulation = () => {
    setSimState('playing');
    setCurrentMinute(0);
    setTeamScore(0);
    setOpponentScore(0);
    setPlayerGoals(0);
    setPlayerAssists(0);
    setPenaltiesScored(0);
    setFreeKickGoals(0);
    setMatchRating(7.0);
    setCommentary([
      `Referee blows the whistle! Kickoff under the floodlights: ${player.currentClub} vs ${opponent} (${venue}).`,
    ]);
  };

  const handleDecision = (choice: MatchEventDecision['choices'][0]) => {
    const attrValue = player.attributes[choice.attribute] || 80;
    const roll = Math.random() * 100;
    const isSuccess = roll < (attrValue + choice.goalChance * 20);

    let eventLog = '';
    let newGoals = playerGoals;
    let newAssists = playerAssists;
    let newTeamScore = teamScore;
    let newRating = matchRating + choice.bonusRating;

    if (isSuccess) {
      if (choice.goalChance > 0) {
        newGoals += 1;
        newTeamScore += 1;
        newRating += 1.0;
        eventLog = `⚽ GOAAAL! ${player.name} executes brilliantly! ${choice.label} beats the keeper clean!`;
      } else if (choice.assistChance > 0) {
        newAssists += 1;
        newTeamScore += 1;
        newRating += 0.8;
        eventLog = `🎯 ASSIST! Superb vision from ${player.name}! Teammate taps it in!`;
      }
    } else {
      eventLog = `❌ DENIED! The goalkeeper pulls off an acrobatic save against ${player.name}!`;
      newRating -= 0.1;
    }

    setPlayerGoals(newGoals);
    setPlayerAssists(newAssists);
    setTeamScore(newTeamScore);
    setMatchRating(Number(Math.min(10.0, Math.max(5.0, newRating)).toFixed(1)));
    setCommentary((prev) => [eventLog, ...prev]);
    setCurrentDecision(null);
    setSimState('playing');
  };

  // Clock progression effect
  useEffect(() => {
    if (simState !== 'playing') return;

    if (currentMinute >= 90) {
      // Final Whistle
      const opponentGoals = Math.floor(Math.random() * 2);
      setOpponentScore(opponentGoals);
      setSimState('finished');
      setCommentary((prev) => [
        `FULL TIME! Final score: ${player.currentClub} ${teamScore} - ${opponentGoals} ${opponent}.`,
        ...prev,
      ]);
      return;
    }

    const timer = setTimeout(() => {
      const nextMin = currentMinute + 15;
      setCurrentMinute(nextMin);

      // Trigger interactive decision at minute 30 and 75
      if (nextMin === 30) {
        setSimState('decision');
        setCurrentDecision({
          minute: 30,
          situation: `30': Fast counter-attack! You find yourself one-on-one with the last defender on the edge of the box.`,
          choices: [
            {
              label: 'Curl finesse shot into top corner',
              attribute: 'shooting',
              bonusRating: 0.4,
              goalChance: 0.6,
              assistChance: 0,
            },
            {
              label: 'Stepover burst of speed and blast near post',
              attribute: 'pace',
              bonusRating: 0.3,
              goalChance: 0.55,
              assistChance: 0,
            },
            {
              label: 'Square pass across goal to open runner',
              attribute: 'passing',
              bonusRating: 0.3,
              goalChance: 0,
              assistChance: 0.7,
            },
          ],
        });
      } else if (nextMin === 75) {
        setSimState('decision');
        setCurrentDecision({
          minute: 75,
          situation: `75': Crucial late chance! Free kick / set-piece opportunity from 24 yards out.`,
          choices: [
            {
              label: 'Direct dipping free-kick over the wall',
              attribute: 'shooting',
              bonusRating: 0.5,
              goalChance: 0.5,
              assistChance: 0,
            },
            {
              label: 'Whip curling cross into the 6-yard box',
              attribute: 'passing',
              bonusRating: 0.3,
              goalChance: 0,
              assistChance: 0.65,
            },
          ],
        });
      } else {
        // Random background match incident
        const rand = Math.random();
        if (rand > 0.7) {
          setCommentary((prev) => [
            `${nextMin}': ${player.name} drops deep to link up play, testing the opposition midfield.`,
            ...prev,
          ]);
        }
      }
    }, 450);

    return () => clearTimeout(timer);
  }, [simState, currentMinute, teamScore, opponent, player, matchRating]);

  const handleSaveToCareer = () => {
    let result: 'W' | 'D' | 'L' = 'D';
    if (teamScore > opponentScore) result = 'W';
    else if (teamScore < opponentScore) result = 'L';

    const isMOTM = matchRating >= 8.5 && (playerGoals >= 1 || playerAssists >= 1);

    onSaveMatch({
      seasonId: currentSeason?.id || 'season_default',
      date: new Date().toISOString().slice(0, 10),
      opponent,
      competition,
      competitionCategory,
      venue,
      teamScore,
      opponentScore,
      result,
      minutesPlayed: 90,
      goals: playerGoals,
      assists: playerAssists,
      matchRating,
      cleanSheet: opponentScore === 0,
      yellowCards: 0,
      redCards: 0,
      penaltiesScored,
      penaltiesMissed: 0,
      freeKickGoals,
      hatTrick: playerGoals >= 3,
      manOfTheMatch: isMOTM,
      summary: `Simulated Matchday fixture: ${teamScore} - ${opponentScore} vs ${opponent}. Goals: ${playerGoals}, Assists: ${playerAssists}.`,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0b0f19] border border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
              <Play className="w-4 h-4 fill-current" />
            </span>
            <div>
              <h2 className="text-base font-bold text-white font-display">Matchday Live Simulator</h2>
              <p className="text-xs text-slate-400">Play out interactive fixtures and log performance into career</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {simState === 'setup' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Opponent Club</label>
                  <select
                    value={opponent}
                    onChange={(e) => setOpponent(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                  >
                    {PRESET_OPPONENTS.map((opp) => (
                      <option key={opp} value={opp}>
                        {opp}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Competition</label>
                  <select
                    value={competition}
                    onChange={(e) => {
                      setCompetition(e.target.value);
                      if (e.target.value.includes('Champions League')) setCompetitionCategory('continental');
                      else if (e.target.value.includes('League')) setCompetitionCategory('league');
                      else setCompetitionCategory('domestic_cup');
                    }}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="UEFA Champions League">UEFA Champions League</option>
                    <option value="Domestic League">Domestic League (League Fixture)</option>
                    <option value="Domestic Cup">Domestic Cup (Knockout Tie)</option>
                    <option value="UEFA Super Cup">UEFA Super Cup</option>
                    <option value="FIFA Club World Cup">FIFA Club World Cup</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Venue</label>
                  <div className="flex gap-2">
                    {(['Home', 'Away', 'Neutral'] as const).map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setVenue(v)}
                        className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all ${
                          venue === v
                            ? 'bg-amber-400 text-slate-950 border-amber-400'
                            : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white'
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Active Season</label>
                  <div className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-400">
                    {currentSeason?.name || 'Current Campaign'} ({player.currentClub})
                  </div>
                </div>
              </div>

              {/* Match preview banner */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex items-center justify-around text-center mt-4">
                <div>
                  <div className="text-xl font-black text-white">{player.currentClub}</div>
                  <div className="text-xs text-amber-400 font-semibold">{player.name} #{player.squadNumber}</div>
                </div>
                <div className="text-sm font-extrabold text-slate-500 font-display">VS</div>
                <div>
                  <div className="text-xl font-black text-white">{opponent}</div>
                  <div className="text-xs text-slate-400 font-semibold">{venue} Fixture</div>
                </div>
              </div>

              <button
                onClick={startSimulation}
                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-black rounded-xl text-sm shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all cursor-pointer"
              >
                Start Match Simulation
              </button>
            </div>
          )}

          {(simState === 'playing' || simState === 'decision' || simState === 'finished') && (
            <div className="space-y-4">
              {/* Scoreboard */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-center">
                <div className="text-xs text-amber-400 font-mono font-bold tracking-wider uppercase mb-1">
                  {competition} · {venue}
                </div>
                <div className="flex items-center justify-center gap-6">
                  <div className="text-right flex-1 truncate">
                    <span className="text-base sm:text-lg font-black text-white">{player.currentClub}</span>
                  </div>
                  <div className="px-4 py-2 bg-slate-900 rounded-xl border border-slate-800 flex items-center gap-3">
                    <span className="text-2xl sm:text-3xl font-black text-white tabular-nums">{teamScore}</span>
                    <span className="text-slate-500 font-bold">:</span>
                    <span className="text-2xl sm:text-3xl font-black text-white tabular-nums">{opponentScore}</span>
                  </div>
                  <div className="text-left flex-1 truncate">
                    <span className="text-base sm:text-lg font-black text-white">{opponent}</span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-4 text-xs text-slate-400 mt-2 font-mono">
                  <span>Minute: <b className="text-emerald-400">{currentMinute}'</b></span>
                  <span>·</span>
                  <span>Goals: <b className="text-amber-400">{playerGoals}</b></span>
                  <span>·</span>
                  <span>Assists: <b className="text-amber-400">{playerAssists}</b></span>
                  <span>·</span>
                  <span>Rating: <b className="text-purple-400">{matchRating}</b></span>
                </div>
              </div>

              {/* Tactical Decision Prompt */}
              {simState === 'decision' && currentDecision && (
                <div className="bg-gradient-to-br from-amber-500/10 via-slate-900 to-slate-950 border border-amber-500/40 rounded-2xl p-5 space-y-3 animate-in zoom-in-95 duration-200">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                    <Sparkles className="w-4 h-4" />
                    Key Decision Opportunity
                  </div>
                  <p className="text-sm font-semibold text-white">{currentDecision.situation}</p>
                  <div className="space-y-2 pt-1">
                    {currentDecision.choices.map((c, i) => (
                      <button
                        key={i}
                        onClick={() => handleDecision(c)}
                        className="w-full text-left p-3 rounded-xl bg-slate-900/90 hover:bg-amber-400 hover:text-slate-950 text-slate-200 border border-slate-800 transition-all font-semibold text-xs flex items-center justify-between group"
                      >
                        <span>{c.label}</span>
                        <span className="text-[10px] uppercase font-mono opacity-60 group-hover:opacity-100">
                          {c.attribute.toUpperCase()} ({player.attributes[c.attribute]})
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Live Commentary Feed */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 h-36 overflow-y-auto space-y-1.5 text-xs font-mono">
                {commentary.map((line, idx) => (
                  <div
                    key={idx}
                    className={`py-0.5 ${idx === 0 ? 'text-white font-bold' : 'text-slate-400'}`}
                  >
                    {line}
                  </div>
                ))}
              </div>

              {/* Match Finished Actions */}
              {simState === 'finished' && (
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={startSimulation}
                    className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold rounded-xl text-xs border border-slate-700 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Replay
                  </button>

                  <button
                    onClick={handleSaveToCareer}
                    className="flex-1 py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold rounded-xl text-sm shadow-[0_0_20px_rgba(245,158,11,0.3)] flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    Save to Career History
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
