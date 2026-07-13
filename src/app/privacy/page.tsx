"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Shield, Zap, Lock, Eye, Database } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#07070c] text-slate-300 font-sans antialiased relative selection:bg-violet-500/30 selection:text-white">
      {/* Background glow effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-violet-600/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none"></div>

      {/* Navigation Header */}
      <header className="max-w-5xl mx-auto px-6 py-8 flex justify-between items-center relative z-10">
        <Link href="/" className="flex items-center gap-2 group text-xs sm:text-sm font-extrabold text-slate-400 hover:text-white transition-colors">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </Link>
        <div className="flex items-center gap-1.5">
          <Zap size={16} className="text-cyan-400" />
          <span className="font-extrabold text-sm tracking-wider text-slate-200 uppercase">
            Prod<span className="text-cyan-400">Arena</span>
          </span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-6 pb-24 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex p-3.5 rounded-2xl bg-violet-500/10 border border-violet-500/20 text-violet-400 mb-4">
            <Shield size={32} />
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-100 mb-4 tracking-tight">Privacy Policy</h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">Last updated: July 5, 2026</p>
        </div>

        <div className="glass-card p-8 sm:p-12 rounded-[32px] border border-slate-900 bg-slate-950/40 space-y-10 leading-relaxed text-sm sm:text-base">
          
          {/* Section 1 */}
          <section className="space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-slate-100 flex items-center gap-2">
              <Eye size={18} className="text-cyan-400" /> 1. Information We Collect
            </h2>
            <p className="text-slate-400">
              To provide a fully synchronized, gamified productivity dashboard, we collect the minimum required information to identify you and save your progress:
            </p>
            <ul className="list-disc list-inside pl-2 space-y-2 text-slate-400">
              <li><strong>Account Credentials:</strong> Email address and username when creating an account via Supabase Auth OTP verification.</li>
              <li><strong>Gamified Stats:</strong> Experience points (XP), player levels, Arena Coins balance, daily focus streaks, and virtual pet statuses.</li>
              <li><strong>Dashboard Data:</strong> Tasks, subtasks, daily checklist items, habits history, and logged Pomodoro focus session minutes.</li>
              <li><strong>Multiplayer Data:</strong> Live dueling progress status during 1v1 Arena clashes and public leaderboard ranking details.</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-slate-100 flex items-center gap-2">
              <Database size={18} className="text-cyan-400" /> 2. How We Use and Store Your Data
            </h2>
            <p className="text-slate-400">
              Your data is stored securely using industry-standard cloud infrastructure:
            </p>
            <ul className="list-disc list-inside pl-2 space-y-2 text-slate-400">
              <li><strong>Data Hosting:</strong> All profile stats, tasks, and habits are stored securely in a <strong>Supabase PostgreSQL Database</strong>.</li>
              <li><strong>Offline Cache:</strong> Local browser storage (<code className="text-cyan-300 font-mono text-xs">localStorage</code>) is used to cache configurations and theme setups.</li>
              <li><strong>Data Usage:</strong> We use your data solely to calculate XP progressions, verify mission completions, match you in real-time battles, and display live leaderboard rankings. We never sell your data to third parties.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-slate-100 flex items-center gap-2">
              <Lock size={18} className="text-cyan-400" /> 3. Security of Your Information
            </h2>
            <p className="text-slate-400">
              We implement robust security measures to safeguard your account. Passwords and credentials are managed natively by Supabase Identity services, securing login attempts with cryptographic checks and secure verification codes. We do not store or see raw passwords.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-slate-100 flex items-center gap-2">
              <Shield size={18} className="text-cyan-400" /> 4. Transaction Security & Third Parties
            </h2>
            <p className="text-slate-400">
              Any financial operations (such as purchasing Premium upgrades) are handled strictly through our third-party payment processors (Stripe, Paddle, or Lemon Squeezy). Your billing card details never touch our servers and are processed securely under PCI-DSS Level 1 compliance rules.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-slate-100">5. Contact Us</h2>
            <p className="text-slate-400">
              If you have any questions, concerns, or requests regarding your personal information, feel free to contact our administration at <a href="mailto:support@productivityarena.com" className="text-cyan-400 hover:underline">support@productivityarena.com</a>.
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-950 bg-slate-950/30 py-8 text-center text-xs text-slate-600">
        &copy; 2026 Productivity Arena. All rights reserved.
      </footer>
    </div>
  );
}
