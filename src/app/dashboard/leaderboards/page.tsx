"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { Trophy, Globe, Users, School, ArrowUp, Zap, Sparkles, Award } from "lucide-react";

type Scope = "global" | "university" | "friends";
type Timeline = "weekly" | "monthly" | "alltime";

interface LeaderboardUser {
  rank: number;
  name: string;
  level: number;
  xp: number;
  title: string;
  avatar: string;
  badge: string;
  isMe?: boolean;
}

export default function Leaderboards() {
  const { username, level, xp, userId } = useApp();
  const [scope, setScope] = useState<Scope>("global");
  const [timeline, setTimeline] = useState<Timeline>("weekly");

  const [realUsers, setRealUsers] = useState<LeaderboardUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setIsLoading(true);
      if (!isSupabaseConfigured || !supabase) {
        // Fallback: mock rankings if offline
        const defaultList: LeaderboardUser[] = [
          { rank: 1, name: "SpeedRunnerFocus", level: 84, xp: 8450, title: "Productivity Legend", avatar: "⚡", badge: "🥇" },
          { rank: 2, name: "DeepWorkKing", level: 72, xp: 7210, title: "Productivity Legend", avatar: "👑", badge: "🥈" },
          { rank: 3, name: "AntiProcrastinator", level: 65, xp: 6500, title: "Disciplined Warrior", avatar: "🛡️", badge: "🥉" },
          { rank: 4, name: "FocusDragon", level: 48, xp: 4850, title: "Deep Work Master", avatar: "🐉", badge: "🎗️" },
          { rank: 5, name: username, level: level, xp: xp, title: "Productivity Champion", avatar: "🥷", badge: "🎗️", isMe: true }
        ];
        setRealUsers(defaultList);
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("id, username, level, xp")
          .order("xp", { ascending: false })
          .limit(30);

        if (error) throw error;

        if (data) {
          const mappedList: LeaderboardUser[] = data.map((profile: any, index: number) => {
            const rankNum = index + 1;
            let badgeSymbol = "🎗️";
            if (rankNum === 1) badgeSymbol = "🥇";
            else if (rankNum === 2) badgeSymbol = "🥈";
            else if (rankNum === 3) badgeSymbol = "🥉";

            const isUserMe = profile.username === username || profile.id === userId;

            let userTitle = "Rookie Builder";
            if (profile.level >= 15) userTitle = "Productivity Legend";
            else if (profile.level >= 10) userTitle = "Deep Work Master";
            else if (profile.level >= 5) userTitle = "Disciplined Warrior";

            const avatarsList = ["🥷", "🧙‍♂️", "👩‍💻", "🤖", "🐉", "⚡", "👑", "🎒", "🐢", "🏛️"];
            const avatarChar = avatarsList[index % avatarsList.length];

            return {
              rank: rankNum,
              name: profile.username || "Anonymous Hero",
              level: profile.level || 1,
              xp: profile.xp || 0,
              title: userTitle,
              avatar: avatarChar,
              badge: badgeSymbol,
              isMe: isUserMe
            };
          });

          const meInList = mappedList.some(u => u.isMe);
          if (!meInList && username) {
            mappedList.push({
              rank: mappedList.length + 1,
              name: username,
              level: level,
              xp: xp,
              title: level >= 15 ? "Productivity Legend" : level >= 10 ? "Deep Work Master" : level >= 5 ? "Disciplined Warrior" : "Rookie Builder",
              avatar: "🥷",
              badge: "🎗️",
              isMe: true
            });
          }

          setRealUsers(mappedList);
        }
      } catch (err) {
        console.error("Error loading real leaderboard:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, [scope, timeline, username, level, xp, userId]);

  // Top 3 Podium Selection
  const podium = [
    realUsers.find((u) => u.rank === 2),
    realUsers.find((u) => u.rank === 1),
    realUsers.find((u) => u.rank === 3)
  ].filter(Boolean) as LeaderboardUser[];

  const runnersUp = realUsers.filter((u) => u.rank > 3);

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-100">Live Leaderboards</h2>
          <p className="text-xs sm:text-sm text-slate-400">Track your standing against the worldwide community and friends</p>
        </div>

        {/* Timeline Toggles */}
        <div className="flex p-1 rounded-xl bg-slate-950 border border-slate-900 text-xs font-bold w-full sm:w-auto">
          {([
            { id: "weekly", label: "Weekly" },
            { id: "monthly", label: "Monthly" },
            { id: "alltime", label: "All-Time" }
          ] as const).map((t) => (
            <button
              key={t.id}
              onClick={() => setTimeline(t.id)}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg transition-all cursor-pointer ${
                timeline === t.id ? "bg-slate-900 text-cyan-400" : "text-slate-450 hover:text-slate-200"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Scope Navigation Tabs */}
      <div className="flex border-b border-slate-900 pb-3 gap-6 text-sm font-semibold relative z-10">
        <button
          onClick={() => setScope("global")}
          className={`flex items-center gap-2 pb-3 relative cursor-pointer ${
            scope === "global" ? "text-cyan-400 font-extrabold" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Globe size={16} /> <span>Worldwide</span>
          {scope === "global" && <span className="absolute bottom-[-3px] inset-x-0 h-0.5 bg-cyan-400 rounded-full"></span>}
        </button>
        <button
          onClick={() => setScope("university")}
          className={`flex items-center gap-2 pb-3 relative cursor-pointer ${
            scope === "university" ? "text-cyan-400 font-extrabold" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <School size={16} /> <span>University Leagues</span>
          {scope === "university" && <span className="absolute bottom-[-3px] inset-x-0 h-0.5 bg-cyan-400 rounded-full"></span>}
        </button>
        <button
          onClick={() => setScope("friends")}
          className={`flex items-center gap-2 pb-3 relative cursor-pointer ${
            scope === "friends" ? "text-cyan-400 font-extrabold" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Users size={16} /> <span>Friends & rivals</span>
          {scope === "friends" && <span className="absolute bottom-[-3px] inset-x-0 h-0.5 bg-cyan-400 rounded-full"></span>}
        </button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <div className="w-10 h-10 rounded-full border-4 border-cyan-500/10 border-t-cyan-400 animate-spin"></div>
          <span className="text-xs font-bold text-slate-400 animate-pulse font-mono tracking-wider">Syncing live leaderboards...</span>
        </div>
      ) : realUsers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-500 border border-dashed border-slate-900/60 rounded-3xl">
          <Trophy size={48} className="text-slate-700 mb-3 animate-pulse" />
          <p className="text-xs font-bold text-slate-350">No competitors logged in the Arena yet.</p>
          <p className="text-[10px] text-slate-500 mt-1">Be the first to register and claim the #01 spot!</p>
        </div>
      ) : (
        <>
          {/* PODIUM DISPLAY */}
          {podium.length >= 3 && (
            <div className="grid grid-cols-3 gap-3 sm:gap-6 items-end max-w-2xl mx-auto pt-8 pb-4">
              
              {/* 2nd Place: Left Card */}
              <div className="flex flex-col items-center">
                <div className="relative mb-3 flex flex-col items-center">
                  <div className="w-14 h-14 sm:w-18 sm:h-18 rounded-full bg-slate-900 border-2 border-slate-400 flex items-center justify-center text-2xl sm:text-3xl shadow-lg relative">
                    {podium[0].avatar}
                    <span className="absolute bottom-[-5px] right-[-5px] px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-[8px] font-black text-slate-350">Lvl {podium[0].level}</span>
                  </div>
                  <span className="text-xs font-black text-slate-100 mt-3 truncate max-w-[80px] sm:max-w-[120px]">{podium[0].name}</span>
                  <span className="text-[9px] text-slate-450 font-bold mt-0.5 uppercase tracking-wider">{podium[0].xp} XP</span>
                </div>
                
                {/* Podium Block */}
                <div className="w-full h-24 bg-gradient-to-t from-slate-950 to-slate-900 border-t border-slate-800 rounded-t-2xl flex flex-col justify-center items-center relative shadow-inner">
                  <span className="text-2xl font-black text-slate-400">2</span>
                  <span className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-widest">SILVER</span>
                </div>
              </div>

              {/* 1st Place: Center Card */}
              <div className="flex flex-col items-center">
                <div className="relative mb-4 flex flex-col items-center">
                  {/* Crown badge */}
                  <div className="absolute top-[-22px] text-yellow-400 animate-bounce">
                    👑
                  </div>
                  <div className="w-18 h-18 sm:w-22 sm:h-22 rounded-full bg-gradient-to-tr from-yellow-500/20 to-orange-500/10 border-4 border-yellow-400 flex items-center justify-center text-3xl sm:text-4xl shadow-xl shadow-yellow-500/5 relative">
                    {podium[1].avatar}
                    <span className="absolute bottom-[-5px] right-[-5px] px-2 py-0.5 rounded bg-slate-900 border border-yellow-400/50 text-[9px] font-black text-yellow-400">Lvl {podium[1].level}</span>
                  </div>
                  <span className="text-sm font-black text-slate-100 mt-3 truncate max-w-[80px] sm:max-w-[120px]">{podium[1].name}</span>
                  <span className="text-[10px] text-yellow-400 font-extrabold mt-0.5 uppercase tracking-wider">{podium[1].xp} XP</span>
                </div>
                
                {/* Podium Block */}
                <div className="w-full h-32 bg-gradient-to-t from-slate-950 to-[#12121e]/90 border-t-2 border-yellow-400/40 rounded-t-2xl flex flex-col justify-center items-center relative shadow-xl">
                  <span className="text-3xl font-black text-yellow-400">1</span>
                  <span className="text-[10px] font-bold text-yellow-400/70 mt-1 uppercase tracking-widest">CHAMPION</span>
                </div>
              </div>

              {/* 3rd Place: Right Card */}
              <div className="flex flex-col items-center">
                <div className="relative mb-3 flex flex-col items-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-slate-900 border-2 border-amber-600/60 flex items-center justify-center text-xl sm:text-2xl shadow-lg relative">
                    {podium[2].avatar}
                    <span className="absolute bottom-[-5px] right-[-5px] px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-[8px] font-black text-slate-350">Lvl {podium[2].level}</span>
                  </div>
                  <span className="text-xs font-black text-slate-100 mt-3 truncate max-w-[80px] sm:max-w-[120px]">{podium[2].name}</span>
                  <span className="text-[9px] text-slate-450 font-bold mt-0.5 uppercase tracking-wider">{podium[2].xp} XP</span>
                </div>
                
                {/* Podium Block */}
                <div className="w-full h-20 bg-gradient-to-t from-slate-950 to-slate-900 border-t border-slate-800 rounded-t-2xl flex flex-col justify-center items-center relative shadow-inner">
                  <span className="text-xl font-black text-amber-600">3</span>
                  <span className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-widest">BRONZE</span>
                </div>
              </div>

            </div>
          )}

          {/* RUNNERS-UP TABLE */}
          <div className="glass-card p-4 sm:p-6 rounded-3xl overflow-hidden">
            <h3 className="text-base sm:text-lg font-bold text-slate-150 mb-6">Arena Rankings</h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-900/60 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                    <th className="pb-3 pl-4">Rank</th>
                    <th className="pb-3">User</th>
                    <th className="pb-3">Title Badge</th>
                    <th className="pb-3">Level</th>
                    <th className="pb-3 text-right pr-4">Total XP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900/40">
                  {runnersUp.map((u) => (
                    <tr
                      key={u.name}
                      className={`transition-colors ${
                        u.isMe
                          ? "bg-violet-950/20 text-cyan-300 font-extrabold border-y border-violet-500/20"
                          : "hover:bg-slate-950/30 text-slate-350"
                      }`}
                    >
                      <td className="py-4 pl-4 font-black">
                        {u.rank < 10 ? `#0${u.rank}` : `#${u.rank}`}
                      </td>
                      <td className="py-4 flex items-center gap-3">
                        <span className="text-lg">{u.avatar}</span>
                        <div>
                          <span className="font-bold text-slate-200">{u.name}</span>
                          {u.isMe && (
                            <span className="ml-2 px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 text-[8px] font-black uppercase">
                              YOU
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-violet-400 bg-violet-950/10 border border-violet-950/30 px-2.5 py-0.5 rounded-full">
                          <Award size={10} /> {u.title}
                        </span>
                      </td>
                      <td className="py-4 font-extrabold text-slate-300">Lvl {u.level}</td>
                      <td className="py-4 text-right pr-4 font-black text-cyan-400">{u.xp} XP</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
