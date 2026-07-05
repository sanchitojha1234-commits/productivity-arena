"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Sliders, Users, CreditCard, Activity, ShieldAlert, ToggleLeft, ToggleRight, Trash2, Lock } from "lucide-react";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  status: "Free" | "Premium" | "Admin";
  joinDate: string;
  xp: number;
}

interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

export default function AdminPanel() {
  const { username, login, globalLogins, globalBattles } = useApp();
  
  const isAdmin = username.toLowerCase() === "admin" || username.toLowerCase().includes("admin");

  const [usersList, setUsersList] = useState<AdminUser[]>([
    { id: "u1", name: "SpeedRunnerFocus", email: "speedy@gmail.com", status: "Premium", joinDate: "2026-05-12", xp: 8450 },
    { id: "u2", name: "MIT_Coder", email: "mitcoder@mit.edu", status: "Premium", joinDate: "2026-06-01", xp: 4500 },
    { id: "u3", name: "SlackerNoMore", email: "slacker@yahoo.com", status: "Free", joinDate: "2026-06-25", xp: 320 },
    { id: "u4", name: "MarcusL", email: "marcus@designer.co", status: "Premium", joinDate: "2026-05-20", xp: 8400 },
    { id: "u5", name: "AnonHustler", email: "anon@hustle.net", status: "Free", joinDate: "2026-07-02", xp: 40 }
  ]);

  const [featureFlags, setFeatureFlags] = useState<FeatureFlag[]>([
    { id: "ai_planner", name: "AI Study Planner Prediction", description: "Enables predictive calendar scheduling block based on habits history.", enabled: true },
    { id: "extension", name: "Browser Block extension", description: "Verifies browser extension sync locks for website blocking mode.", enabled: true },
    { id: "spotify", name: "Spotify Focus Mode playlist integration", description: "Allows streaming custom ambient sounds directly from Spotify api.", enabled: false },
    { id: "notion", name: "Notion database task import sync", description: "Allows importing active workspace pages as Pomodoro targets.", enabled: false },
    { id: "gcal", name: "Google Calendar bi-directional sync", description: "Syncs Pomodoro study blocks back to Google calendar schedules.", enabled: true }
  ]);

  const [reports, setReports] = useState([
    { id: "r1", user: "StudyWarlock", reporter: "MarcusL", reason: "Suspected AI typing spoof in battle check-in description", date: "4h ago" },
    { id: "r2", user: "CheaterNinja", reporter: "System Sensor", reason: "Continuous phone pickup alert triggers exceeded limit (15+)", date: "1d ago" }
  ]);

  const toggleFeature = (id: string) => {
    setFeatureFlags(featureFlags.map(f => f.id === id ? { ...f, enabled: !f.enabled } : f));
  };

  const handleSuspendUser = (id: string, name: string) => {
    alert(`Account for ${name} has been administrative suspended. Database locks applied.`);
    setUsersList(usersList.filter(u => u.id !== id));
  };

  const handleDismissReport = (id: string) => {
    setReports(reports.filter(r => r.id !== id));
  };

  if (!isAdmin) {
    return (
      <div className="min-h-[70vh] flex flex-col justify-center items-center text-center p-6 relative">
        <div className="absolute inset-0 bg-gradient-to-tr from-rose-950/15 to-violet-950/5 blur-[120px] pointer-events-none"></div>

        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/25 flex items-center justify-center text-rose-400 mb-6 neon-glow-error">
          <Lock size={28} className="animate-pulse" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-slate-100 mb-3">Access Denied</h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md leading-relaxed">
          The Admin Panel is reserved for system administrators. Your current account (<strong className="text-cyan-400">{username}</strong>) does not have superuser clearance.
        </p>
        <p className="text-[10px] text-slate-500 mt-4 italic">
          To access this panel, log out and sign in using the administrator email (e.g. <code>admin@productivity.net</code>).
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Title */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-100">Superuser Admin Panel</h2>
        <p className="text-xs sm:text-sm text-slate-400">System diagnostic center, feature switchboard, and database moderation console</p>
      </div>

      {/* Stats overview cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl flex items-center justify-between">
          <div>
            <span className="block text-xs font-bold text-slate-450 uppercase">Gross Revenue</span>
            <span className="block text-2xl font-black text-slate-100 mt-1">$0.00</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Live platform stats</span>
          </div>
          <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400">
            <CreditCard size={20} />
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl flex items-center justify-between">
          <div>
            <span className="block text-xs font-bold text-slate-450 uppercase">Total Active Users</span>
            <span className="block text-2xl font-black text-slate-100 mt-1">{globalLogins}</span>
            <span className="text-[10px] text-cyan-400 font-bold block mt-0.5">{globalBattles} battles logged today</span>
          </div>
          <div className="p-3 rounded-xl bg-violet-500/10 text-violet-400">
            <Users size={20} />
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl flex items-center justify-between">
          <div>
            <span className="block text-xs font-bold text-slate-450 uppercase">Conversion Rate</span>
            <span className="block text-2xl font-black text-slate-150 mt-1">0.0%</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Free to Premium tier</span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
            <Activity size={20} />
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl flex items-center justify-between">
          <div>
            <span className="block text-xs font-bold text-slate-450 uppercase">Open System Reports</span>
            <span className="block text-2xl font-black text-slate-100 mt-1">{reports.length} Alerts</span>
            <span className="text-[10px] text-red-400 font-bold block mt-0.5">Requires audit checks</span>
          </div>
          <div className="p-3 rounded-xl bg-red-500/10 text-red-400">
            <ShieldAlert size={20} />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        
        {/* User Management Panel */}
        <div className="lg:col-span-8 glass-card p-5 sm:p-6 rounded-3xl">
          <h3 className="text-base sm:text-lg font-bold text-slate-100 mb-6 flex items-center gap-2">
            <Users size={18} className="text-violet-400" /> Database Accounts Management
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-900/60 text-slate-500 font-bold uppercase tracking-wider text-[10px] pb-3">
                  <th className="pb-3 pl-2">User</th>
                  <th className="pb-3">Membership</th>
                  <th className="pb-3">Join Date</th>
                  <th className="pb-3">Rank XP</th>
                  <th className="pb-3 text-right pr-2">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900/40">
                {usersList.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-950/20 text-slate-350 transition-colors">
                    <td className="py-3.5 pl-2">
                      <span className="font-bold text-slate-200 block">{u.name}</span>
                      <span className="text-[10px] text-slate-500 block">{u.email}</span>
                    </td>
                    <td className="py-3.5">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                        u.status === "Admin" ? "bg-red-500/10 text-red-400 border border-red-500/20" :
                        u.status === "Premium" ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" :
                        "bg-slate-900 text-slate-500 border border-slate-800"
                      }`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-slate-450">{u.joinDate}</td>
                    <td className="py-3.5 font-bold text-slate-300">{u.xp} XP</td>
                    <td className="py-3.5 text-right pr-2">
                      <button
                        onClick={() => handleSuspendUser(u.id, u.name)}
                        className="px-2.5 py-1.5 rounded-lg bg-red-950/10 border border-red-500/10 hover:border-red-500/30 text-red-400 hover:text-red-300 text-xs font-bold transition-all cursor-pointer"
                      >
                        Suspend
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Feature switchboard */}
        <div className="lg:col-span-4 glass-card p-6 rounded-3xl flex flex-col justify-between">
          <div className="space-y-6">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
                <Sliders size={18} className="text-cyan-400" /> Feature Flags
              </h3>
              <p className="text-xs text-slate-450 mt-1">Deploy, activate, or roll-back system segments</p>
            </div>

            <div className="space-y-4">
              {featureFlags.map((flag) => (
                <div key={flag.id} className="flex items-start justify-between gap-4">
                  <div className="space-y-0.5">
                    <span className="text-xs font-black text-slate-200 block">{flag.name}</span>
                    <span className="text-[10px] text-slate-500 block leading-relaxed">{flag.description}</span>
                  </div>
                  <button
                    onClick={() => toggleFeature(flag.id)}
                    className="text-slate-400 hover:text-white cursor-pointer shrink-0 mt-0.5"
                  >
                    {flag.enabled ? (
                      <ToggleRight size={24} className="text-cyan-400" />
                    ) : (
                      <ToggleLeft size={24} className="text-slate-600" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Moderation queue */}
      <div className="glass-card p-6 rounded-3xl space-y-4">
        <h3 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
          <ShieldAlert size={18} className="text-red-400" /> Moderation reports queue
        </h3>

        {reports.length === 0 ? (
          <p className="text-xs text-slate-500 font-bold py-4 text-center">No reports in the system. Clean record!</p>
        ) : (
          <div className="space-y-3">
            {reports.map((rep) => (
              <div
                key={rep.id}
                className="p-4 rounded-xl bg-slate-950/40 border border-slate-900 flex justify-between items-center text-xs"
              >
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase">{rep.date}</span>
                  <div className="font-extrabold text-slate-200 mt-0.5">
                    User: <strong className="text-red-450 font-black">{rep.user}</strong> (flagged by {rep.reporter})
                  </div>
                  <p className="text-[11px] text-slate-450 mt-1 leading-relaxed">{rep.reason}</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      alert(`Warning flag dispatched to ${rep.user}. Penalty applied.`);
                      handleDismissReport(rep.id);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-red-950/20 border border-red-500/20 hover:bg-red-500/10 text-red-300 font-extrabold cursor-pointer"
                  >
                    Issue Warning
                  </button>
                  <button
                    onClick={() => handleDismissReport(rep.id)}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-850 text-slate-400 hover:text-slate-200 font-bold cursor-pointer"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
