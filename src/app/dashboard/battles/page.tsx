"use client";

import React, { useState, useEffect } from "react";
import { useApp, Battle } from "@/context/AppContext";
import {
  Swords,
  Users,
  Search,
  Trophy,
  Zap,
  Clock,
  Sparkles,
  UserPlus,
  Play,
  ArrowRight,
  TrendingUp,
  AlertTriangle
} from "lucide-react";

export default function Battles() {
  const { battles, level, startBattle, progressBattle, triggerMockOpponentProgress, pet, petMultiplier } = useApp();
  
  // Matchmaking simulation states
  const [isSearching, setIsSearching] = useState(false);
  const [searchStage, setSearchStage] = useState("");
  const [matchedOpponent, setMatchedOpponent] = useState<any>(null);

  // Form states for creating custom battles
  const [battleType, setBattleType] = useState<"1v1" | "team" | "tournament">("1v1");
  const [customChallenge, setCustomChallenge] = useState("Complete 3 study Pomodoros");
  const [privateFriendName, setPrivateFriendName] = useState("");
  const [battleCreatedMsg, setBattleCreatedMsg] = useState("");

  // Periodically progress opponents in active battles to simulate real-time competition
  useEffect(() => {
    const interval = setInterval(() => {
      triggerMockOpponentProgress();
    }, 8000); // every 8 seconds, opponents might gain progress
    return () => clearInterval(interval);
  }, []);

  // Matchmaking trigger
  const handleRandomMatchmake = () => {
    setIsSearching(true);
    setSearchStage("Connecting to Global Matchmaking server...");
    
    setTimeout(() => {
      setSearchStage("Matching based on level Lvl " + level + "...");
    }, 2000);

    setTimeout(() => {
      setSearchStage("Analyzing candidate productivity speeds...");
    }, 4000);

    setTimeout(() => {
      const candidates = [
        { name: "CodeCrusher99", level: level + 1, avatar: "🧙‍♂️", quote: "I write React while running." },
        { name: "FocusNinja", level: Math.max(1, level - 1), avatar: "🥷", quote: "No social media can catch me." },
        { name: "StudyMarathoner", level: level + 2, avatar: "👩‍💻", quote: "8 hours of deep focus incoming." }
      ];
      const selected = candidates[Math.floor(Math.random() * candidates.length)];
      setMatchedOpponent(selected);
      setSearchStage("Opponent Found! Ready to clash!");
    }, 6000);

    setTimeout(() => {
      // Add battle to list
      const targetText = [
        "Complete 3 tasks today",
        "Focus for 50 minutes in Focus Mode",
        "Log a study block & drink water"
      ][Math.floor(Math.random() * 3)];
      
      startBattle(targetText);
      setIsSearching(false);
      setMatchedOpponent(null);
    }, 8000);
  };

  const handleCreateCustomBattle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customChallenge.trim()) return;

    if (battleType === "1v1" && privateFriendName.trim()) {
      setBattleCreatedMsg(`Invitation sent to ${privateFriendName}! Battle will activate once they accept.`);
    } else {
      startBattle(customChallenge.trim());
      setBattleCreatedMsg("Public Battle published successfully! Matchmaking will fill open slots.");
    }
    setTimeout(() => setBattleCreatedMsg(""), 4000);
  };

  const activeBattles = battles.filter(b => b.status === "active");
  const finishedBattles = battles.filter(b => b.status !== "active");

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Top Title Bar */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-100">Productivity Battles</h2>
        <p className="text-xs sm:text-sm text-slate-400">Put your focus to the test. Race against other builders in real-time.</p>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Matchmaking & Custom Creator */}
        <div className="lg:col-span-4 space-y-6">
          {/* Matchmaking Radar Widget */}
          <div className="glass-card p-6 rounded-3xl relative overflow-hidden text-center flex flex-col items-center">
            <div className="absolute inset-0 bg-gradient-to-tr from-rose-900/10 to-violet-600/10 blur-[80px] pointer-events-none"></div>

            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-4 animate-pulse">
              <Swords size={28} />
            </div>

            <h3 className="text-lg font-black text-slate-150">Instant Matchmaking</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-[240px] mx-auto leading-relaxed">
              Match with an active developer or student online who shares your level range.
            </p>

            {isSearching ? (
              <div className="mt-8 w-full space-y-4">
                {/* Spinner */}
                <div className="flex justify-center items-center relative py-4">
                  <div className="w-16 h-16 rounded-full border-4 border-slate-900 border-t-rose-500 animate-spin"></div>
                  {matchedOpponent && (
                    <span className="absolute text-2xl animate-bounce">{matchedOpponent.avatar}</span>
                  )}
                </div>
                <div className="text-xs font-bold text-rose-400 uppercase tracking-widest">{searchStage}</div>
                {matchedOpponent && (
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-900 text-xs">
                    <span className="font-extrabold text-slate-200">{matchedOpponent.name}</span>
                    <span className="text-[10px] text-slate-500 block italic mt-1">"{matchedOpponent.quote}"</span>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={handleRandomMatchmake}
                className="w-full mt-8 py-3.5 rounded-xl text-sm font-extrabold bg-gradient-to-r from-rose-600 to-violet-600 hover:from-rose-500 hover:to-violet-500 text-white flex items-center justify-center gap-2 neon-glow-primary hover:scale-[1.01] active:scale-[0.98] transition-all cursor-pointer shadow-lg shadow-rose-950/20"
              >
                Find Productive Rival <ArrowRight size={16} />
              </button>
            )}
          </div>

          {/* Custom Challenge Creator */}
          <div className="glass-card p-6 rounded-3xl space-y-4">
            <h3 className="text-base sm:text-lg font-bold text-slate-150">Publish a Challenge</h3>
            
            {battleCreatedMsg && (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold">
                {battleCreatedMsg}
              </div>
            )}

            <form onSubmit={handleCreateCustomBattle} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-450 uppercase mb-1.5">Battle Scope</label>
                <div className="grid grid-cols-3 gap-2 p-1 rounded-xl bg-slate-950 border border-slate-900 text-[10px] font-black">
                  <button
                    type="button"
                    onClick={() => setBattleType("1v1")}
                    className={`py-2 rounded-lg transition-all cursor-pointer ${
                      battleType === "1v1" ? "bg-slate-900 text-cyan-400" : "text-slate-450 hover:text-slate-200"
                    }`}
                  >
                    1 VS 1
                  </button>
                  <button
                    type="button"
                    onClick={() => setBattleType("team")}
                    className={`py-2 rounded-lg transition-all cursor-pointer ${
                      battleType === "team" ? "bg-slate-900 text-cyan-400" : "text-slate-450 hover:text-slate-200"
                    }`}
                  >
                    TEAMS
                  </button>
                  <button
                    type="button"
                    onClick={() => setBattleType("tournament")}
                    className={`py-2 rounded-lg transition-all cursor-pointer ${
                      battleType === "tournament" ? "bg-slate-900 text-cyan-400" : "text-slate-450 hover:text-slate-200"
                    }`}
                  >
                    ARENA CUP
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-450 uppercase mb-1.5">Challenge Target Goal</label>
                <select
                  value={customChallenge}
                  onChange={(e) => setCustomChallenge(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs glass-input bg-[#0b0b12]"
                >
                  <option value="Complete 3 study Pomodoros">Complete 3 study Pomodoros</option>
                  <option value="Workout 45 minutes & stretch">Workout 45 minutes & stretch</option>
                  <option value="Write code for 2 hours">Write code for 2 hours</option>
                  <option value="No social media for 6 hours">No social media for 6 hours</option>
                  <option value="Read 30 pages of non-fiction">Read 30 pages of non-fiction</option>
                </select>
              </div>

              {battleType === "1v1" && (
                <div>
                  <label className="block text-xs font-bold text-slate-450 uppercase mb-1.5">Invite Friend (Username - optional)</label>
                  <div className="relative">
                    <UserPlus className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-3.5 h-3.5" />
                    <input
                      type="text"
                      value={privateFriendName}
                      onChange={(e) => setPrivateFriendName(e.target.value)}
                      placeholder="e.g. FocusMage44"
                      className="w-full pl-9 pr-4 py-2 text-xs glass-input"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl text-xs font-extrabold bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-250 hover:text-white transition-all cursor-pointer"
              >
                Launch Challenge
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: Active Battles & Finished Battles */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Active Battles List */}
          <div className="glass-card p-6 rounded-3xl">
            <h3 className="text-lg font-black text-slate-100 mb-6 flex items-center gap-2">
              <Swords size={20} className="text-rose-500" /> Active Battles ({activeBattles.length})
            </h3>

            {activeBattles.length === 0 ? (
              <div className="py-16 text-center flex flex-col items-center justify-center">
                <Swords size={40} className="text-slate-800 mb-3" />
                <p className="text-sm text-slate-500 font-extrabold">No battles are currently active</p>
                <p className="text-xs text-slate-600 mt-1 max-w-[260px]">
                  Match with a random rival or create a custom challenge to start competing.
                </p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {activeBattles.map((b) => (
                  <div
                    key={b.id}
                    className="p-5 rounded-2xl bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-900 relative overflow-hidden flex flex-col justify-between"
                  >
                    <div className="absolute top-[5%] right-[5%] w-[40%] h-[40%] rounded-full bg-rose-500/5 blur-[50px] pointer-events-none"></div>

                    <div>
                      {/* Duel Header */}
                      <div className="flex justify-between items-center mb-4">
                        <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[9px] font-black uppercase tracking-wider">
                          1v1 Focus Clash
                        </span>
                        <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold">
                          <Clock size={11} className="text-rose-400" />
                          <span>11h remaining</span>
                        </div>
                      </div>

                      {/* Goal Target */}
                      <div className="space-y-1 mb-6">
                        <span className="block text-[10px] font-bold text-slate-500 uppercase">Target Objective:</span>
                        <h4 className="text-xs sm:text-sm font-black text-slate-200 leading-snug">{b.challengeText}</h4>
                      </div>

                      {/* Progress representation */}
                      <div className="space-y-4">
                        {/* User progress bar */}
                        <div>
                          <div className="flex justify-between text-xs font-bold text-slate-350 mb-1">
                            <span className="flex items-center gap-1"><span>You</span> <span className="text-[9px] text-slate-500 font-normal">Lvl {level}</span></span>
                            <span className="text-cyan-400">{b.myProgress}%</span>
                          </div>
                          <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-900">
                            <div
                              className="h-full bg-gradient-to-r from-violet-500 to-cyan-400 transition-all duration-300"
                              style={{ width: `${b.myProgress}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Opponent progress bar */}
                        <div>
                          <div className="flex justify-between text-xs font-bold text-slate-350 mb-1">
                            <span className="flex items-center gap-1">
                              <span className="text-xs">{b.opponentAvatar}</span>
                              <span>{b.opponentName}</span>
                              <span className="text-[9px] text-slate-500 font-normal">Lvl {b.opponentLevel}</span>
                            </span>
                            <span className="text-rose-450">{b.opponentProgress}%</span>
                          </div>
                          <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-900">
                            <div
                              className="h-full bg-rose-500 transition-all duration-350"
                              style={{ width: `${b.opponentProgress}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Quick action simulation */}
                    <div className="mt-6 pt-4 border-t border-slate-900/60 flex items-center justify-between">
                      <div className="text-[10px] font-bold text-slate-500 space-y-0.5">
                        <div>Prize: <strong className="text-yellow-400">{b.coinPrize} Coins</strong> / <strong className="text-violet-400">{b.xpPrize} XP</strong></div>
                        <div className="text-cyan-400 font-extrabold text-[8px] flex items-center gap-0.5 uppercase tracking-wide">
                          ✨ +{petMultiplier}% {pet.name} Companion Boost
                        </div>
                      </div>
                      <button
                        onClick={() => progressBattle(b.id, 20)}
                        className="px-3.5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-extrabold transition-all cursor-pointer shadow-md shadow-violet-950/20"
                      >
                        Log Work (+20%)
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Finished / Log history */}
          <div className="glass-card p-6 rounded-3xl">
            <h3 className="text-base sm:text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
              <Trophy size={18} className="text-yellow-400" /> Clash History ({finishedBattles.length})
            </h3>

            {finishedBattles.length === 0 ? (
              <p className="text-xs text-slate-500 font-bold py-6 text-center">No finished matches logged yet.</p>
            ) : (
              <div className="space-y-2.5">
                {finishedBattles.map((b) => (
                  <div
                    key={b.id}
                    className="p-4 rounded-xl bg-slate-950/40 border border-slate-900 flex justify-between items-center text-xs"
                  >
                    <div>
                      <div className="font-extrabold text-slate-200">{b.challengeText}</div>
                      <div className="text-[10px] text-slate-500 mt-1">
                        Opponent: {b.opponentName} | End Progress: {b.myProgress}% (you) vs {b.opponentProgress}% (rival)
                      </div>
                    </div>

                    <div className="text-right">
                      {b.status === "won" ? (
                        <span className="px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-extrabold">
                          VICTORY (+{b.xpPrize} XP)
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded bg-red-500/10 border border-red-500/20 text-red-400 font-extrabold">
                          DEFEAT (-25 PTS)
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Weekly Tournaments widget */}
          <div className="glass-card p-6 rounded-3xl bg-gradient-to-r from-slate-950 to-violet-950/20 border border-violet-950/40 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-yellow-400 text-xs font-black uppercase tracking-wider">
                <Trophy size={14} className="fill-yellow-400/10" /> Arena Champions Cup
              </div>
              <h4 className="text-sm sm:text-base font-bold text-slate-200">Weekly Esports Style Tournament</h4>
              <p className="text-xs text-slate-450 leading-relaxed max-w-lg">
                Join a group of 8 warriors in a 3-day bracket showdown. Highest cumulative focus time secures the Arena Cup.
              </p>
            </div>
            <button
              onClick={() => alert("Tournament registrations open in 2 days. Complete tasks to qualify!")}
              className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:text-white font-extrabold text-xs transition-all cursor-pointer shrink-0"
            >
              Qualify Now
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
