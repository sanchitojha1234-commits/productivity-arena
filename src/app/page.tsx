"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import {
  Zap,
  Flame,
  Swords,
  Timer,
  Smile,
  Shield,
  MessageSquare,
  ChevronDown,
  ArrowRight,
  TrendingUp,
  Award,
  Users
} from "lucide-react";

export default function LandingPage() {
  const { globalLogins, globalBattles, globalFocusMinutes, tasks } = useApp();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const completedTasks = tasks.filter((t) => t.status === "Completed").length;
  const totalTasks = tasks.length;
  const successRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const stats = [
    { value: `${globalFocusMinutes}`, label: "Focus Minutes Logged", icon: Timer, color: "text-violet-400" },
    { value: `${successRate}%`, label: "Task Success Rate", icon: TrendingUp, color: "text-cyan-400" },
    { value: `${globalBattles}`, label: "Productivity Battles Won", icon: Swords, color: "text-emerald-400" },
    { value: `${globalLogins}`, label: "Active Competitors", icon: Users, color: "text-amber-400" }
  ];

  const features = [
    {
      title: "Real-time Productivity Battles",
      desc: "Invite friends or get randomly matched in high-stakes study marathons. Complete tasks to increase your progress. Winner claims XP and trophies, loser drops rank.",
      icon: Swords,
      color: "from-red-500/20 to-violet-500/20",
      borderColor: "border-violet-500/30"
    },
    {
      title: "Pomodoro Soundscapes & Blocker",
      desc: "Immerse yourself in customizable focus periods with ambient mixes (Rain, Cafe, Forest). Block distracting websites automatically and get notified if your phone distracts you.",
      icon: Timer,
      color: "from-cyan-500/20 to-blue-500/20",
      borderColor: "border-cyan-500/30"
    },
    {
      title: "Tamagotchi Productivity Pets",
      desc: "Nurture your digital pet with work. Focus sessions make it grow and evolve. Slacking off or procrastinating will cause your pet to become sleepy and demand active efforts.",
      icon: Smile,
      color: "from-emerald-500/20 to-teal-500/20",
      borderColor: "border-emerald-500/30"
    },
    {
      title: "Anti-Procrastination AI Coach",
      desc: "An intelligent behavioral engine that identifies your lazy hours, weak routines, and distracted patterns. Receive personalized schedules, Pomodoro plans, and motivation.",
      icon: MessageSquare,
      color: "from-amber-500/20 to-orange-500/20",
      borderColor: "border-amber-500/30"
    }
  ];

  const pricingTiers = [
    {
      name: "Rookie",
      price: 0,
      desc: "Establish your basic anti-procrastination routines.",
      features: [
        "Create up to 10 active tasks",
        "Standard 25-min Pomodoro timer",
        "Flamelet starter virtual pet",
        "Join public battles (1 daily)",
        "Weekly local leaderboards"
      ],
      cta: "Get Started Free",
      popular: false,
      href: "/auth"
    },
    {
      name: "Disciplined Warrior",
      price: billingCycle === "monthly" ? 9 : 7,
      desc: "The ultimate tier for ambitious students and developers.",
      features: [
        "Unlimited tasks, Kanban & Calendar",
        "Custom Pomodoros & Soundscapes",
        "Full pet growth & marketplace skins",
        "Unlimited battles (1v1, Teams, Tourneys)",
        "Daily AI Coach behavioral suggestions",
        "Accountability partner photo validation"
      ],
      cta: "Start Winning Today",
      popular: true,
      href: "/auth"
    },
    {
      name: "Productivity Legend",
      price: billingCycle === "monthly" ? 19 : 15,
      desc: "Engineered for high-performing startup founders & teams.",
      features: [
        "Everything in Disciplined Warrior",
        "Pre-release access to AI schedule prediction",
        "Premium profile customization & badges",
        "Global esports style tournaments",
        "Advanced integrations (Notion, Google Cal)",
        "Priority feature voting rights"
      ],
      cta: "Claim Legend Status",
      popular: false,
      href: "/auth"
    }
  ];

  const faqs = [
    {
      q: "How does a Productivity Battle work?",
      a: "You challenge a friend or enter matchmaking. A set duration (e.g. 2 hours) is established. You gain progress by completing tasks, ticking habits, and logging focus blocks. The participant with the highest output wins. The system prevents cheating through optional photo/voice validations."
    },
    {
      q: "Can I use it alone without the competitive features?",
      a: "Absolutely! You can turn off public matchmaking and focus on single-player modes: building habits, logging Pomodoros, chatting with your AI coach, and taking care of your virtual pet."
    },
    {
      q: "How does the Tamagotchi Productivity Pet behave?",
      a: "Every session you log feeds your pet with XP. Over time, your pet evolves through three major visual stages. However, if you log no productive minutes for 36 hours, your pet goes to sleep, and you must log at least one 25-minute Pomodoro to wake it up."
    },
    {
      q: "Does the AI Coach share my data?",
      a: "No, your privacy is paramount. Your task lists, calendars, and focus times are completely private to your profile. The AI model processes your logs locally/securely to generate personalized schedules."
    }
  ];

  return (
    <div className="min-h-screen bg-[#050508] relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[60%] rounded-full bg-violet-900/15 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[60%] rounded-full bg-cyan-900/15 blur-[120px] pointer-events-none"></div>

      {/* Header / Navbar */}
      <header className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between border-b border-slate-900/50 relative z-20">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-cyan-500 flex items-center justify-center neon-glow-primary">
            <Zap className="text-white w-5 h-5 fill-white/10" />
          </div>
          <div>
            <h1 className="font-extrabold text-lg tracking-wider text-slate-100 uppercase">
              Prod<span className="text-cyan-400">Arena</span>
            </h1>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-300">
          <Link href="#features" className="hover:text-white transition-colors">Features</Link>
          <Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link>
          <Link href="#faq" className="hover:text-white transition-colors">FAQ</Link>
          <Link href="/dashboard" className="text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1">
            Demo Preview <ArrowRight size={14} />
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/auth"
            className="px-4 py-2 rounded-xl text-sm font-bold text-slate-300 hover:text-white transition-colors"
          >
            Login
          </Link>
          <Link
            href="/auth"
            className="px-5 py-2.5 rounded-xl text-sm font-extrabold bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white neon-glow-primary shadow-lg cursor-pointer transition-all duration-200 hover:scale-[1.03]"
          >
            Join the Arena
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-16 lg:pt-24 pb-20 relative z-10 grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 flex flex-col items-start text-left">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/25 text-violet-400 text-xs font-black tracking-widest uppercase mb-6 animate-pulse">
            <Flame size={14} className="fill-violet-400/10" /> #1 GAMIFIED PRODUCTIVITY HUB
          </div>
          
          <h2 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.08] text-slate-100 mb-6">
            Turn Beating Procrastination <br className="hidden sm:inline" />
            into a <span className="neon-text-gradient">Competitive Game</span>
          </h2>
          
          <p className="text-base sm:text-lg text-slate-400 leading-relaxed mb-8 max-w-xl">
            Procrastination thrives in isolation. Productivity Arena turns deep work, habits, and task completion into multiplayer challenges. Build streaks, grow virtual pets, and win battles.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
            <Link
              href="/auth"
              className="px-8 py-4 rounded-xl font-extrabold bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white text-center neon-glow-primary shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-250 cursor-pointer flex items-center justify-center gap-2"
            >
              Start Winning Against Procrastination <ArrowRight size={18} />
            </Link>
            <Link
              href="/dashboard"
              className="px-6 py-4 rounded-xl font-bold bg-slate-900/70 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-800 hover:border-slate-700 text-center transition-all duration-200 cursor-pointer"
            >
              Try Demo Arena
            </Link>
          </div>
        </div>

        {/* Hero Interactive Widget Graphic */}
        <div className="lg:col-span-5 relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-violet-600/20 to-cyan-500/20 blur-[60px] rounded-full pointer-events-none"></div>
          
          {/* Mock Battle Card */}
          <div className="relative glass-card p-6 rounded-3xl border border-slate-700/30 overflow-hidden animate-float">
            <div className="flex items-center justify-between border-b border-slate-800/60 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></div>
                <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">LIVE 1V1 DUEL</span>
              </div>
              <span className="text-xs font-bold text-slate-400">Time Left: 24m 18s</span>
            </div>

            {/* Match Stats */}
            <div className="space-y-4">
              {/* User Progress */}
              <div>
                <div className="flex justify-between items-center text-sm font-bold text-slate-200 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🥷</span>
                    <span>You (Lvl 3)</span>
                  </div>
                  <span className="text-cyan-400">75% Done</span>
                </div>
                <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-900">
                  <div className="h-full bg-gradient-to-r from-violet-500 to-cyan-400 rounded-full" style={{ width: "75%" }}></div>
                </div>
              </div>

              {/* VS Split */}
              <div className="flex justify-center my-1">
                <span className="px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[10px] font-black text-violet-400 tracking-wider">VS</span>
              </div>

              {/* Opponent Progress */}
              <div>
                <div className="flex justify-between items-center text-sm font-bold text-slate-200 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🧙‍♂️</span>
                    <span>FocusMage (Lvl 4)</span>
                  </div>
                  <span className="text-rose-400">55% Done</span>
                </div>
                <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-900">
                  <div className="h-full bg-rose-500 rounded-full" style={{ width: "55%" }}></div>
                </div>
              </div>
            </div>

            {/* Current Mission Overlay */}
            <div className="mt-5 p-3 rounded-xl bg-slate-950/40 border border-slate-900/60 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Timer size={14} className="text-violet-400" />
                <span className="text-slate-300 font-medium">Active session: 50m Focus block</span>
              </div>
              <span className="text-violet-400 font-extrabold">12m Left</span>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Strip */}
      <section className="border-y border-slate-900/80 bg-slate-950/30 backdrop-blur-sm relative z-10 py-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="flex flex-col items-center justify-center text-center">
                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 mb-3">
                  <Icon size={20} className={stat.color} />
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">{stat.value}</h3>
                <p className="text-xs sm:text-sm text-slate-400 font-semibold mt-1">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20 lg:py-28 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-100 mb-4">
            Gamified to the <span className="neon-text-gradient">Core</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            Standard todo lists put you to sleep. Productivity Arena integrates competitive game dynamics directly into daily work to trigger healthy dopamine.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className={`glass-card p-8 rounded-3xl border border-slate-800 bg-gradient-to-b ${feat.color} flex flex-col items-start hover:scale-[1.01]`}
              >
                <div className={`p-3 rounded-2xl bg-slate-950 border ${feat.borderColor} mb-6`}>
                  <Icon size={24} className="text-violet-400" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-100 mb-3">{feat.title}</h3>
                <p className="text-sm sm:text-base text-slate-400 leading-relaxed">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-slate-950/30 border-y border-slate-900/60 py-20 lg:py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-100 mb-3">
              Vouched by <span className="neon-text-gradient">Builders</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              See how students, freelancers, and engineers are conquering procrastination.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote: "I've tried every Pomodoro app. But nothing compares to the adrenaline of doing study battles against classmates. My daily focus minutes went from 30m to 3 hours.",
                author: "Sarah K.",
                role: "Computer Science Student",
                avatar: "👩‍💻"
              },
              {
                quote: "My virtual pet Flamelet has literally saved my freelancing schedule. If I start slacking off, it starts looking sad and sleepy. I work to keep my pet happy, and it earns me real money.",
                author: "Marcus L.",
                role: "Freelance Designer",
                avatar: "🎨"
              },
              {
                quote: "The AI coach is freakishly accurate. It detected that my worst focus drop occurs between 2 PM and 4 PM and shifted my Pomodoro breaks automatically. Complete game-changer.",
                author: "Devin R.",
                role: "Full-Stack Developer",
                avatar: "🚀"
              }
            ].map((testi, idx) => (
              <div key={idx} className="glass-card p-6 rounded-2xl border border-slate-850 flex flex-col justify-between">
                <p className="text-sm text-slate-300 italic leading-relaxed mb-6">"{testi.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-lg">{testi.avatar}</div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-100">{testi.author}</h4>
                    <p className="text-[11px] text-slate-400 font-semibold">{testi.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="max-w-7xl mx-auto px-6 py-20 lg:py-28 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-5xl font-black text-slate-100 mb-4">
            Fair Plans for <span className="neon-text-gradient">Every Budget</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mb-8">
            Upgrade your discipline. Choose the plan that suits your level of commitment.
          </p>

          {/* Pricing Toggle */}
          <div className="inline-flex items-center gap-2 p-1.5 rounded-xl bg-slate-950 border border-slate-900">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                billingCycle === "monthly" ? "bg-violet-600 text-white shadow-lg" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                billingCycle === "yearly" ? "bg-violet-600 text-white shadow-lg" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Yearly <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-black">SAVE 20%</span>
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-stretch max-w-5xl mx-auto">
          {pricingTiers.map((tier, idx) => (
            <div
              key={idx}
              className={`glass-card p-8 rounded-3xl flex flex-col justify-between border relative ${
                tier.popular
                  ? "border-violet-500 bg-gradient-to-b from-violet-950/20 to-[#0c0c16]/80 shadow-xl shadow-violet-950/15"
                  : "border-slate-800"
              }`}
            >
              {tier.popular && (
                <span className="absolute top-0 right-8 transform -translate-y-1/2 px-3 py-1 rounded-full bg-violet-600 text-white text-[10px] font-extrabold uppercase tracking-widest shadow-md">
                  Most Popular
                </span>
              )}

              <div>
                <h3 className="text-xl font-bold text-slate-100">{tier.name}</h3>
                <p className="text-xs text-slate-400 mt-1">{tier.desc}</p>
                
                <div className="my-6 flex items-baseline gap-1">
                  <span className="text-4xl font-black text-slate-100">${tier.price}</span>
                  <span className="text-xs text-slate-400">/ {billingCycle === "monthly" ? "month" : "month, billed annually"}</span>
                </div>

                <ul className="space-y-3.5 border-t border-slate-900 pt-6">
                  {tier.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-center gap-3 text-sm text-slate-300">
                      <Shield size={14} className="text-violet-400 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8">
                <Link
                  href={tier.href}
                  className={`w-full block text-center py-3.5 rounded-xl text-sm font-extrabold transition-all cursor-pointer ${
                    tier.popular
                      ? "bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white neon-glow-primary hover:scale-[1.01]"
                      : "bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800"
                  }`}
                >
                  {tier.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="max-w-4xl mx-auto px-6 py-20 lg:pb-28 relative z-10 border-t border-slate-900/60">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-100 mb-3">Frequently Asked Questions</h2>
          <p className="text-xs sm:text-sm text-slate-400">Clear doubts before joining the arena.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="glass-card rounded-2xl border border-slate-850 overflow-hidden">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full text-left p-6 flex justify-between items-center gap-4 text-slate-100 hover:text-white font-bold text-sm sm:text-base transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    size={18}
                    className={`text-slate-400 shrink-0 transition-transform duration-350 ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                <div
                  className={`transition-all duration-350 ease-in-out ${
                    isOpen ? "max-h-[300px] border-t border-slate-900/60" : "max-h-0"
                  } overflow-hidden`}
                >
                  <p className="p-6 text-sm text-slate-400 leading-relaxed bg-slate-950/20">{faq.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="max-w-7xl mx-auto px-6 pb-24 relative z-10">
        <div className="relative glass-card p-10 sm:p-16 rounded-[40px] border border-violet-950/50 bg-gradient-to-r from-slate-950/80 to-violet-950/30 text-center overflow-hidden flex flex-col items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-tr from-violet-600/10 to-cyan-500/10 blur-[80px] rounded-[40px] pointer-events-none"></div>
          
          <h2 className="text-3xl sm:text-5xl font-black text-slate-100 leading-tight mb-4 max-w-2xl">
            Stop Fighting Procrastination <br className="hidden sm:inline" />
            <span className="neon-text-gradient">By Yourself</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mb-8 max-w-xl">
            Join thousands of students, freelancers, and engineers leveling up their discipline. Build habits, study in focus modes, compete in arena battles, and crush goals.
          </p>

          <Link
            href="/auth"
            className="px-8 py-4 rounded-xl font-extrabold text-sm sm:text-base bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white neon-glow-primary shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer flex items-center gap-2"
          >
            Start Winning Against Procrastination <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-950 bg-slate-950/50 py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-cyan-500 flex items-center justify-center">
              <Zap className="text-white w-4.5 h-4.5" />
            </div>
            <span className="font-extrabold text-base tracking-wider text-slate-200 uppercase">
              Prod<span className="text-cyan-400">Arena</span>
            </span>
          </div>

          <p className="text-xs text-slate-500 font-medium">
            &copy; 2026 Productivity Arena. Built to conquer procrastination. All rights reserved.
          </p>

          <div className="flex items-center gap-4 text-xs font-semibold text-slate-400">
            <Link href="/privacy" className="hover:text-slate-250 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-slate-250 transition-colors">Terms</Link>
            <Link href="mailto:support@productivityarena.com" className="hover:text-slate-250 transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
