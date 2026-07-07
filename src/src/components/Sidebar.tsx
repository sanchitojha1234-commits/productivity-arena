"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/context/AppContext";
import {
  LayoutDashboard,
  CheckSquare,
  Timer,
  Swords,
  Trophy,
  CalendarDays,
  Smile,
  MessageSquare,
  Users,
  ShoppingBag,
  Sliders,
  LogOut,
  Zap,
  Coins,
  Flame,
  Menu,
  X
} from "lucide-react";

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { username, level, xp, coins, streak, logout } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  // Don't show sidebar on landing page or auth page
  if (pathname === "/" || pathname === "/auth") {
    return null;
  }

  const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Tasks Kanban", href: "/dashboard/tasks", icon: CheckSquare },
    { name: "Focus Mode", href: "/dashboard/focus", icon: Timer },
    { name: "Productivity Battles", href: "/dashboard/battles", icon: Swords },
    { name: "Habit Tracker", href: "/dashboard/habits", icon: CalendarDays },
    { name: "Live Leaderboards", href: "/dashboard/leaderboards", icon: Trophy },
    { name: "Productivity Pet", href: "/dashboard/pet", icon: Smile },
    { name: "AI Coach", href: "/dashboard/coach", icon: MessageSquare },
    { name: "Accountability", href: "/dashboard/groups", icon: Users },
    { name: "Marketplace", href: "/dashboard/marketplace", icon: ShoppingBag },
    { name: "Admin Panel", href: "/dashboard/admin", icon: Sliders }
  ];

  const xpNeeded = level * 100;
  const xpPercent = Math.min(100, Math.round((xp / xpNeeded) * 100));

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 rounded-lg glass-panel text-slate-300 hover:text-white transition-all cursor-pointer"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 lg:w-68 glass-panel border-r border-slate-800/50 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Top Header */}
        <div className="p-6 border-b border-slate-900/60">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-cyan-500 flex items-center justify-center neon-glow-primary">
              <Zap className="text-white w-5 h-5 fill-white/10" />
            </div>
            <div>
              <h1 className="font-extrabold text-lg tracking-wider text-slate-100 uppercase">
                Prod<span className="text-cyan-400">Arena</span>
              </h1>
              <p className="text-[10px] text-slate-400 font-semibold tracking-widest uppercase">
                Beat Procrastination
              </p>
            </div>
          </Link>

          {/* User Gamified Profile Summary */}
          <div className="mt-6 p-4 rounded-xl bg-slate-950/50 border border-slate-900 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="text-sm font-bold text-slate-200 truncate max-w-[120px]">{username}</div>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-black">
                Lvl {level}
              </div>
            </div>

            {/* XP progress bar */}
            <div>
              <div className="flex justify-between text-[10px] text-slate-400 font-bold mb-1 uppercase tracking-wider">
                <span>XP Progress</span>
                <span>{xp}/{xpNeeded} XP</span>
              </div>
              <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-violet-500 to-cyan-400 transition-all duration-500 ease-out"
                  style={{ width: `${xpPercent}%` }}
                ></div>
              </div>
            </div>

            {/* Coins & Streaks */}
            <div className="flex items-center justify-between border-t border-slate-900/50 pt-2.5 text-xs">
              <div className="flex items-center gap-1 text-yellow-400 font-bold">
                <Coins size={14} className="fill-yellow-400/10" />
                <span>{coins}</span>
              </div>
              <div className="flex items-center gap-1 text-orange-400 font-bold">
                <Flame size={14} className="fill-orange-400/10" />
                <span>{streak} Days</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold tracking-wide transition-all duration-250 cursor-pointer ${
                  isActive
                    ? "bg-gradient-to-r from-violet-600/30 to-cyan-500/10 text-cyan-300 border-l-4 border-violet-500 font-bold"
                    : "text-slate-400 hover:bg-slate-900/40 hover:text-slate-100"
                }`}
              >
                <Icon size={18} className={isActive ? "text-cyan-300" : "text-slate-400"} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-slate-900/60">
          <button
            onClick={() => {
              logout();
              window.location.href = "/";
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold text-rose-400 hover:bg-rose-950/20 transition-all cursor-pointer"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div
          onClick={toggleSidebar}
          className="lg:hidden fixed inset-0 z-30 bg-black/60 backdrop-blur-sm"
        ></div>
      )}
    </>
  );
};
