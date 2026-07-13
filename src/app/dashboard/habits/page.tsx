"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import {
  CalendarDays,
  Plus,
  Flame,
  CheckCircle,
  Award,
  Trash2,
  PieChart,
  Grid
} from "lucide-react";

export default function HabitTracker() {
  const { habits, addHabit, toggleHabit, deleteHabit } = useApp();
  const [newHabitName, setNewHabitName] = useState("");
  const [newHabitCategory, setNewHabitCategory] = useState("Mind");

  // Today is simulated as Saturday, July 4, 2026
  const todayStr = "2026-07-04";

  // Heatmap helper: Generate dates for the last 20 weeks (140 days)
  const generateHeatmapDays = () => {
    const days = [];
    const today = new Date("2026-07-04");
    
    // We want to render a grid representing the last 20 weeks (140 days)
    // Starting from a Sunday 20 weeks ago
    const startDay = new Date(today);
    startDay.setDate(today.getDate() - 140);
    
    // Move to the nearest Sunday
    const startDayOfWeek = startDay.getDay();
    startDay.setDate(startDay.getDate() - startDayOfWeek);

    const current = new Date(startDay);
    while (current <= today) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return days;
  };

  const heatmapDays = generateHeatmapDays();

  // Helper to format Date object into YYYY-MM-DD
  const formatDateISO = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  // Count completions on a specific day
  const getCompletionsForDay = (dateStr: string) => {
    let count = 0;
    habits.forEach((h) => {
      if (h.completionHistory.includes(dateStr)) {
        count++;
      }
    });
    return count;
  };

  const handleCreateHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;

    addHabit(newHabitName.trim(), newHabitCategory);
    setNewHabitName("");
    setNewHabitCategory("Mind");
  };

  // Global metrics
  const totalCompletions = habits.reduce((acc, h) => acc + h.completionHistory.length, 0);
  const bestStreak = habits.length > 0 ? Math.max(...habits.map((h) => h.longestStreak)) : 0;

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Title block */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-100">Habit Tracker</h2>
        <p className="text-xs sm:text-sm text-slate-400">Lock in daily consistency, maintain streaks, and view your focus heatmap</p>
      </div>

      {/* Overview Analytics row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl">
          <span className="block text-xs font-bold text-slate-450 uppercase">Total Habits</span>
          <span className="block text-2xl font-black text-slate-100 mt-1">{habits.length} Active</span>
        </div>
        <div className="glass-card p-5 rounded-2xl">
          <span className="block text-xs font-bold text-slate-450 uppercase">Today Checked</span>
          <span className="block text-2xl font-black text-slate-100 mt-1">
            {habits.filter((h) => h.completionHistory.includes(todayStr)).length} / {habits.length}
          </span>
        </div>
        <div className="glass-card p-5 rounded-2xl">
          <span className="block text-xs font-bold text-slate-450 uppercase">All-time Checked</span>
          <span className="block text-2xl font-black text-slate-100 mt-1">{totalCompletions} Times</span>
        </div>
        <div className="glass-card p-5 rounded-2xl flex items-center justify-between">
          <div>
            <span className="block text-xs font-bold text-slate-450 uppercase">Best Habit Streak</span>
            <span className="block text-2xl font-black text-slate-150 mt-1">{bestStreak} Days</span>
          </div>
          <Flame size={20} className="text-orange-500 fill-orange-500/10" />
        </div>
      </div>

      {/* Heatmap Grid Calendar */}
      <div className="glass-card p-6 rounded-3xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="font-extrabold text-base sm:text-lg text-slate-150 flex items-center gap-2">
              <CalendarDays size={18} className="text-violet-400" /> Focus Heatmap
            </h3>
            <p className="text-xs text-slate-450">GitHub-style activity record of completed habits</p>
          </div>
          
          <div className="flex items-center gap-1.5 text-[10px] text-slate-450 font-bold uppercase tracking-wider">
            <span>Less</span>
            <span className="w-2.5 h-2.5 rounded bg-slate-900 border border-slate-850"></span>
            <span className="w-2.5 h-2.5 rounded bg-violet-950/40 border border-violet-900/60"></span>
            <span className="w-2.5 h-2.5 rounded bg-violet-800/50"></span>
            <span className="w-2.5 h-2.5 rounded bg-violet-500"></span>
            <span className="w-2.5 h-2.5 rounded bg-cyan-400"></span>
            <span>More</span>
          </div>
        </div>

        {/* Heatmap Scroll Container */}
        <div className="overflow-x-auto pb-2 scrollbar-thin">
          <div className="min-w-[640px] flex gap-1">
            
            {/* Day headers column */}
            <div className="flex flex-col justify-between text-[10px] font-black text-slate-500 uppercase h-28 pr-2 pt-1 pb-1">
              <span>Sun</span>
              <span>Tue</span>
              <span>Thu</span>
              <span>Sat</span>
            </div>

            {/* Weeks representation */}
            <div className="flex-1 grid grid-flow-col grid-rows-7 gap-1">
              {heatmapDays.map((day, idx) => {
                const dateStr = formatDateISO(day);
                const count = getCompletionsForDay(dateStr);
                
                // Color mapping
                let cellBg = "bg-slate-900/50 border border-slate-950";
                if (count === 1) cellBg = "bg-violet-950/40 border border-violet-900/50";
                else if (count === 2) cellBg = "bg-violet-800/40 border border-violet-750/30";
                else if (count === 3) cellBg = "bg-violet-600/70 border border-violet-500/30";
                else if (count >= 4) cellBg = "bg-cyan-500/80 border border-cyan-400/30";

                return (
                  <div
                    key={dateStr}
                    className={`w-3.5 h-3.5 rounded-sm ${cellBg} transition-all hover:scale-115 hover:border-cyan-400/50 cursor-pointer relative group`}
                  >
                    {/* Tooltip */}
                    <span className="absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-slate-950 border border-slate-800 px-2 py-1 rounded text-[9px] font-bold text-slate-100 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-20">
                      {dateStr}: {count} Checked
                    </span>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </div>

      {/* Main Habits List & Creator Grid */}
      <div className="grid lg:grid-cols-12 gap-6">
        
        {/* Habits Checklist */}
        <div className="lg:col-span-8 glass-card p-6 rounded-3xl">
          <h3 className="text-base sm:text-lg font-bold text-slate-150 mb-6">Daily Checklist</h3>

          {habits.length === 0 ? (
            <div className="py-16 text-center flex flex-col items-center justify-center">
              <CalendarDays size={36} className="text-slate-800 mb-2" />
              <p className="text-xs text-slate-500 font-bold">No habits registered. Create one to start tracking!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {habits.map((h) => {
                const isCheckedToday = h.completionHistory.includes(todayStr);
                return (
                  <div
                    key={h.id}
                    className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                      isCheckedToday
                        ? "bg-slate-950/20 border-slate-900 text-slate-400"
                        : "bg-slate-950/60 border-slate-900/60 hover:border-slate-800 text-slate-200"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <button
                        onClick={() => toggleHabit(h.id, todayStr)}
                        className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${
                          isCheckedToday
                            ? "bg-cyan-500/10 border-cyan-400 text-cyan-400"
                            : "border-slate-700 hover:border-violet-500"
                        }`}
                      >
                        {isCheckedToday && <CheckCircle size={14} className="fill-cyan-400/10" />}
                      </button>

                      <div>
                        <h4 className={`text-sm sm:text-base font-extrabold ${isCheckedToday ? "line-through" : ""}`}>
                          {h.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1 text-[10px] font-bold text-slate-500">
                          <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-850 uppercase text-[9px]">
                            {h.category}
                          </span>
                          <span className="flex items-center gap-0.5 text-orange-400/90">
                            <Flame size={12} /> {h.streak}d streak
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="hidden sm:block text-right">
                        <span className="block text-[9px] font-bold text-slate-500 uppercase">Longest Streak</span>
                        <span className="text-xs text-slate-350 font-bold">{h.longestStreak} days</span>
                      </div>
                      <button
                        onClick={() => deleteHabit(h.id)}
                        className="p-2 rounded-lg bg-red-950/10 border border-red-500/10 hover:border-red-500/30 text-red-400 transition-all cursor-pointer"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Creator panel */}
        <div className="lg:col-span-4 glass-card p-6 rounded-3xl">
          <h3 className="text-base sm:text-lg font-bold text-slate-150 mb-6">Create New Habit</h3>

          <form onSubmit={handleCreateHabit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-450 uppercase mb-1.5">Habit Name</label>
              <input
                type="text"
                required
                value={newHabitName}
                onChange={(e) => setNewHabitName(e.target.value)}
                placeholder="e.g. Read 15 Pages"
                className="w-full px-3 py-2.5 text-xs glass-input"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-450 uppercase mb-1.5">Category Class</label>
              <div className="grid grid-cols-3 gap-2">
                {["Mind", "Body", "Spirit"].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setNewHabitCategory(cat)}
                    className={`py-2 px-1 rounded-xl border text-[10px] font-bold tracking-wide transition-all cursor-pointer ${
                      newHabitCategory === cat
                        ? "bg-violet-950/20 border-violet-500 text-violet-300"
                        : "bg-slate-950/40 border-slate-900 text-slate-450 hover:text-slate-200"
                    }`}
                  >
                    {cat === "Mind" ? "🧠 Mind" : cat === "Body" ? "💪 Body" : "🌱 Spirit"}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl text-xs font-extrabold bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus size={14} /> Add Habit
            </button>
          </form>

          <div className="mt-6 p-4 rounded-2xl bg-slate-950/40 border border-slate-900/60 text-xs text-slate-450 leading-relaxed">
            <span className="block font-bold text-slate-350 mb-1.5 flex items-center gap-1"><Award size={13} className="text-amber-400" /> Streaks & XP:</span>
            Every habit check-in awards <strong>+20 XP</strong> and <strong>+5 Arena Coins</strong>. Completing 3 habits today clears the daily mission block!
          </div>
        </div>

      </div>
    </div>
  );
}
