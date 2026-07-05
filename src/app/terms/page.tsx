"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, Zap, Gavel, Scale, AlertTriangle, ShieldCheck } from "lucide-react";

export default function TermsAndConditions() {
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
            <BookOpen size={32} />
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-100 mb-4 tracking-tight">Terms of Service</h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">Last updated: July 5, 2026</p>
        </div>

        <div className="glass-card p-8 sm:p-12 rounded-[32px] border border-slate-900 bg-slate-950/40 space-y-10 leading-relaxed text-sm sm:text-base">
          
          {/* Section 1 */}
          <section className="space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-slate-100 flex items-center gap-2">
              <Gavel size={18} className="text-cyan-400" /> 1. Agreement to Terms
            </h2>
            <p className="text-slate-400">
              By accessing or using Productivity Arena (our "Website"), you agree to be bound by these Terms of Service. If you do not agree to all of these terms, you are prohibited from using the site.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-slate-100 flex items-center gap-2">
              <ShieldCheck size={18} className="text-cyan-400" /> 2. Account Registration and Conduct
            </h2>
            <p className="text-slate-400">
              To log in and play, you must authenticate using your email address. You are responsible for all activities that occur under your account:
            </p>
            <ul className="list-disc list-inside pl-2 space-y-2 text-slate-400">
              <li><strong>Cheating Policy:</strong> Players must advance their active battle progress bars through genuine productivity actions (completing tasks, checking off habits, and focus session timer blocks). Any manipulation, scripts, or bots used to simulate progress to cheat duels will result in account suspension.</li>
              <li><strong>Username Guidelines:</strong> Usernames and custom pet names must remain respectful. The administration reserves the right to rename or delete accounts containing offensive language.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-slate-100 flex items-center gap-2">
              <Scale size={18} className="text-cyan-400" /> 3. Subscriptions, Payments & Refunds
            </h2>
            <p className="text-slate-400">
              We offer premium upgrade plans (monthly/yearly subscriptions) that unlock accessory packs and dashboard themes:
            </p>
            <ul className="list-disc list-inside pl-2 space-y-2 text-slate-400">
              <li><strong>Payments:</strong> All transactions are securely processed through third-party Merchant of Record gateways.</li>
              <li><strong>Refunds:</strong> Refund requests are managed in accordance with the payment processors' terms and conditions. Subscriptions can be canceled at any time from your account profile settings.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-slate-100 flex items-center gap-2">
              <AlertTriangle size={18} className="text-cyan-400" /> 4. Disclaimer of Liability
            </h2>
            <p className="text-slate-400">
              Productivity Arena and its virtual pet, coins, and levels are intended for gamified self-discipline, fun, and entertainment purposes only. Experience points (XP) and Arena Coins have zero real-world monetary value and cannot be exchanged for cash or physical goods. The focus mode site blockers are designed for voluntary discipline; we are not liable for accidental lockouts of third-party domains.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-slate-100">5. Modifications of Terms</h2>
            <p className="text-slate-400">
              We reserve the right to revise or modify these Terms of Service at any time. By continuing to use the Website, you agree to be bound by the then-current version of these Terms.
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
