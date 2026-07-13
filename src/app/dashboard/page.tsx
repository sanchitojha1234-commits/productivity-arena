"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import {
  Flame,
  Zap,
  Timer,
  Swords,
  CheckCircle2,
  Calendar,
  Sparkles,
  TrendingUp,
  Coins,
  ChevronRight,
  ArrowUpRight,
  CheckSquare
} from "lucide-react";

export default function Dashboard() {
  const {
    username,
    level,
    xp,
    coins,
    streak,
    focusTime,
    focusScore,
    tasks,
    battles,
    dailyMissions,
    updateTaskStatus,
    statsHistory
  } = useApp();

  const [activeTab, setActiveTab] = useState<"focus" | "tasks">("focus");

  const quotes = [
    "Procrastination is the thief of time. Collar him.",
    "Your future self is either thanking you or cursing you. Choose wisely.",
    "Do not wait. The time will never be 'just right'. Start where you stand.",
    "Focus is a muscle. The more you block distractions, the stronger it gets.",
    "Beating procrastination is not about willpower. It's about setting up the battlefield."
  ];
  const [motivationQuote] = useState(() => quotes[Math.floor(Math.random() * quotes.length)]);

  const xpNeeded = level * 100;
  const xpPercent = Math.min(100, Math.round((xp / xpNeeded) * 100));

  // Filter lists
  const pendingTasks = tasks.filter((t) => t.status !== "Completed").slice(0, 3);
  const activeBattles = battles.filter((b) => b.status === "active").slice(0, 2);

  // Dynamic Weekly Data from Stats History
  const weeklyData = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i)); // Past 6 days + today
    const dateStr = d.toISOString().split("T")[0];
    const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
    const stats = statsHistory[dateStr] || { focus: 0, completed: 0 };
    return {
      day: dayName,
      focus: stats.focus,
      completed: stats.completed
    };
  });

  const maxVal = Math.max(...weeklyData.map((d) => d.focus), 60);

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6 sm:p-8 rounded-3xl glass-panel relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 to-cyan-500/10 blur-[80px] pointer-events-none"></div>
        <div className="relative z-10">
          <div className="text-xs font-black tracking-widest text-cyan-400 uppercase mb-1">
            Command Center
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-100">
            Welcome back, <span className="neon-text-gradient">{username}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1.5 flex items-center gap-2">
            <Sparkles size={14} className="text-amber-400" />
            <span>"{motivationQuote}"</span>
          </p>
        </div>

        <div className="relative z-10 flex gap-4 w-full md:w-auto">
          <Link
            href="/dashboard/focus"
            className="flex-1 md:flex-none px-5 py-3 rounded-xl text-sm font-extrabold bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white text-center neon-glow-primary hover:scale-[1.01] transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
          >
            <Timer size={16} /> Enter Focus Mode
          </Link>
          <Link
            href="/dashboard/battles"
            className="flex-1 md:flex-none px-5 py-3 rounded-xl text-sm font-bold bg-slate-900 border border-slate-800 text-slate-200 hover:text-white text-center hover:bg-slate-800 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Swords size={16} className="text-rose-400" /> Fight a Battle
          </Link>
        </div>
      </div>

      {/* Grid: 4 Core Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Streak card */}
        <div className="glass-card p-5 rounded-2xl flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wide">Focus Streak</div>
            <div className="text-2xl sm:text-3xl font-black text-slate-100 mt-2 flex items-baseline gap-1">
              {streak} <span className="text-xs text-orange-400 font-bold">Days</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">Keep focusing to protect it</p>
          </div>
          <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400">
            <Flame size={22} className="fill-orange-400/10" />
          </div>
        </div>

        {/* Level card */}
        <div className="glass-card p-5 rounded-2xl flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wide">Current Level</div>
            <div className="text-2xl sm:text-3xl font-black text-slate-100 mt-2 flex items-baseline gap-1">
              Lvl {level}
            </div>
            <p className="text-[10px] text-slate-500 mt-1">{xpNeeded - xp} XP to next level</p>
          </div>
          <div className="p-3 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400">
            <Zap size={22} className="fill-violet-400/10" />
          </div>
        </div>

        {/* Focus Time card */}
        <div className="glass-card p-5 rounded-2xl flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wide">Focus logged</div>
            <div className="text-2xl sm:text-3xl font-black text-slate-100 mt-2 flex items-baseline gap-1">
              {focusTime} <span className="text-xs text-cyan-400 font-bold">Mins</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">Earned 2 XP per minute</p>
          </div>
          <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Timer size={22} />
          </div>
        </div>

        {/* Arena Coins card */}
        <div className="glass-card p-5 rounded-2xl flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wide">Arena Coins</div>
            <div className="text-2xl sm:text-3xl font-black text-slate-100 mt-2 flex items-baseline gap-1">
              {coins} <span className="text-xs text-yellow-400 font-bold">Coins</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">Spend in Pet Marketplace</p>
          </div>
          <div className="p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400">
            <Coins size={22} className="fill-yellow-400/10" />
          </div>
        </div>
      </div>

      {/* Analytics Chart & Daily Missions Row */}
      <div className="grid lg:grid-cols-12 gap-6">
        
        {/* Weekly Focus Chart */}
        <div className="lg:col-span-8 glass-card p-6 rounded-3xl flex flex-col justify-between min-h-[380px]">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-100">Weekly Focus Analytics</h3>
              <p className="text-xs text-slate-400">Deep study minutes compared per day</p>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300">
              <Calendar size={14} className="text-cyan-400" />
              <span>This Week</span>
            </div>
          </div>

          {/* Dynamic SVG Interactive Chart */}
          <div className="flex-1 w-full h-44 flex items-end justify-between px-2 pt-4 relative">
            {/* Guide lines */}
            <div className="absolute inset-x-0 bottom-8 border-b border-slate-900/60 pointer-events-none"></div>
            <div className="absolute inset-x-0 bottom-20 border-b border-slate-900/60 pointer-events-none"></div>
            <div className="absolute inset-x-0 bottom-32 border-b border-slate-900/60 pointer-events-none"></div>
            
            {weeklyData.map((d, i) => {
              const barHeight = Math.max(10, Math.round((d.focus / maxVal) * 120));
              return (
                <div key={i} className="flex-1 flex flex-col items-center group relative z-10">
                  {/* Tooltip */}
                  <div className="absolute bottom-[barHeight+45px] opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950 text-slate-150 border border-slate-850 px-2 py-1 rounded-md text-[10px] font-bold pointer-events-none whitespace-nowrap z-20">
                    {d.focus}m / {d.completed} Tasks
                  </div>
                  
                  {/* Interactive Bar */}
                  <div
                    className="w-8 sm:w-10 bg-gradient-to-t from-violet-600/40 to-cyan-500/80 rounded-t-lg group-hover:from-violet-500 group-hover:to-cyan-400 transition-all duration-300 cursor-pointer flex items-end justify-center pb-2 border-t border-cyan-400/20"
                    style={{ height: `${barHeight}px` }}
                  >
                    <span className="text-[10px] text-cyan-200 font-bold group-hover:scale-105 transition-transform">{d.completed}</span>
                  </div>
                  <span className="text-xs text-slate-500 font-bold mt-2">{d.day}</span>
                </div>
              );
            })}
          </div>

          <div className="border-t border-slate-900 pt-5 mt-4 flex items-center justify-between text-xs text-slate-400 font-semibold">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
              <span>Focus minutes</span>
            </div>
            <div className="flex items-center gap-4">
              <span>Best focus day: <strong className="text-slate-200">Saturday (90m)</strong></span>
              <span>Avg Session: <strong className="text-slate-200">45m</strong></span>
            </div>
          </div>
        </div>

        {/* Daily Missions */}
        <div className="lg:col-span-4 glass-card p-6 rounded-3xl flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-100">Daily Missions</h3>
                <p className="text-xs text-slate-400">Complete tasks to collect reward coins</p>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-black tracking-wider uppercase">
                Active
              </span>
            </div>

            <div className="space-y-3.5">
              {dailyMissions.map((mission) => (
                <div
                  key={mission.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    mission.completed
                      ? "bg-emerald-950/10 border-emerald-500/20 text-slate-400"
                      : "bg-slate-950/30 border-slate-900 text-slate-200 hover:border-slate-800"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      <CheckCircle2
                        size={16}
                        className={mission.completed ? "text-emerald-400" : "text-slate-600"}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-semibold leading-relaxed ${mission.completed ? "line-through" : ""}`}>
                        {mission.text}
                      </p>
                      
                      {/* Rewards */}
                      <div className="flex items-center gap-3 mt-2 text-[10px] font-bold">
                        <span className="text-violet-400">+{mission.xp} XP</span>
                        <span className="text-yellow-400 flex items-center gap-0.5">
                          <Coins size={10} /> +{mission.coins}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-900/60 pt-4 mt-6 text-center text-xs">
            <span className="text-slate-500 font-semibold">Missions reset in: 7 hours</span>
          </div>
        </div>

      </div>

      {/* Active Battles & Tasks Grid */}
      <div className="grid lg:grid-cols-12 gap-6">
        
        {/* Quick Task list */}
        <div className="lg:col-span-6 glass-card p-6 rounded-3xl">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-100">Tasks Queue</h3>
              <p className="text-xs text-slate-400">High priority targets for today</p>
            </div>
            <Link
              href="/dashboard/tasks"
              className="text-xs text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 hover:underline"
            >
              Open taskboard <ChevronRight size={14} />
            </Link>
          </div>

          {pendingTasks.length === 0 ? (
            <div className="py-10 text-center flex flex-col items-center justify-center">
              <CheckSquare size={36} className="text-slate-700 mb-2" />
              <p className="text-sm text-slate-500 font-bold">All tasks completed!</p>
              <Link
                href="/dashboard/tasks"
                className="text-xs text-cyan-400 hover:underline mt-1 font-semibold"
              >
                Add new task +
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingTasks.map((t) => (
                <div
                  key={t.id}
                  className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-900 flex items-center justify-between hover:border-slate-800 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateTaskStatus(t.id, "Completed")}
                      className="w-5 h-5 rounded-md border border-slate-700 hover:border-cyan-400 hover:bg-cyan-500/10 flex items-center justify-center transition-all cursor-pointer"
                    >
                      <div className="w-2.5 h-2.5 rounded-sm bg-transparent"></div>
                    </button>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-200 truncate max-w-[180px] sm:max-w-[240px]">
                        {t.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1 text-[10px] font-bold text-slate-500">
                        <span className={`px-1.5 py-0.5 rounded text-[9px] uppercase ${
                          t.priority === "High" ? "bg-red-500/10 text-red-400 border border-red-500/20" :
                          t.priority === "Medium" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                          "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                        }`}>
                          {t.priority}
                        </span>
                        <span>Est: {t.estTime}h</span>
                        <span>{t.category}</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold">{t.deadline}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Active Productivity Battles */}
        <div className="lg:col-span-6 glass-card p-6 rounded-3xl">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-100">Live Battles</h3>
              <p className="text-xs text-slate-400">Clash progress against competitors</p>
            </div>
            <Link
              href="/dashboard/battles"
              className="text-xs text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 hover:underline"
            >
              Enter battle arena <ChevronRight size={14} />
            </Link>
          </div>

          {activeBattles.length === 0 ? (
            <div className="py-10 text-center flex flex-col items-center justify-center">
              <Swords size={36} className="text-slate-700 mb-2" />
              <p className="text-sm text-slate-500 font-bold">No active battles currently</p>
              <Link
                href="/dashboard/battles"
                className="text-xs text-cyan-400 hover:underline mt-1 font-semibold"
              >
                Match with rival now
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {activeBattles.map((b) => (
                <div
                  key={b.id}
                  className="p-4 rounded-2xl bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-900 relative overflow-hidden"
                >
                  <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-2">
                    <span className="text-[10px] text-violet-400 uppercase tracking-widest font-black">1v1 Focus Duel</span>
                    <span className="text-[10px] text-slate-400">Prize: {b.xpPrize} XP</span>
                  </div>

                  <h4 className="text-xs font-black text-slate-200 mb-4">{b.challengeText}</h4>

                  {/* Competitors Progress Bars */}
                  <div className="space-y-2">
                    {/* Me */}
                    <div>
                      <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                        <span>You (Lvl {level})</span>
                        <span className="text-cyan-400">{b.myProgress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-900">
                        <div
                          className="h-full bg-gradient-to-r from-violet-500 to-cyan-400"
                          style={{ width: `${b.myProgress}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Opponent */}
                    <div>
                      <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                        <span>{b.opponentName} (Lvl {b.opponentLevel})</span>
                        <span className="text-rose-400">{b.opponentProgress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-900">
                        <div
                          className="h-full bg-rose-500"
                          style={{ width: `${b.opponentProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
