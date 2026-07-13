"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { MessageSquare, Send, Sparkles, AlertTriangle, ShieldCheck, Zap, TrendingDown } from "lucide-react";

export default function AICoach() {
  const { chatHistory, sendMessageToCoach, focusScore, tasks, habits } = useApp();
  const [chatInput, setChatInput] = useState("");

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    sendMessageToCoach(chatInput.trim());
    setChatInput("");
  };

  const handleQuickPromptClick = (text: string) => {
    sendMessageToCoach(text);
  };

  // Calculate statistics for diagnostics
  const completedCount = tasks.filter(t => t.status === "Completed").length;
  const totalCount = tasks.length;
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const quickPrompts = [
    "Analyze my dashboard stats.",
    "How do I deal with YouTube distractions?",
    "Give me a custom schedule for today.",
    "Give me a quick motivation boost!"
  ];

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Title */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-100">Anti-Procrastination AI Coach</h2>
        <p className="text-xs sm:text-sm text-slate-400">Behavioral analysis engine detecting distractions and scheduling peak deep work hours</p>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Diagnostic Analysis Dashboard */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card p-6 rounded-3xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-violet-600/10 to-indigo-900/10 blur-[60px] pointer-events-none"></div>

            <h3 className="text-base sm:text-lg font-bold text-slate-100 mb-6 flex items-center gap-2">
              <Sparkles size={18} className="text-violet-400" /> Behavioral Diagnostics
            </h3>

            {/* Metrics Checklist */}
            <div className="space-y-4 text-xs font-semibold text-slate-400">
              
              {/* Procrastination Drop */}
              <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-900 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-black">Worst Procrastination Hours</span>
                <div className="text-slate-200 font-extrabold flex items-center gap-1.5 mt-0.5">
                  <TrendingDown size={14} className="text-red-400" /> 2:00 PM - 4:15 PM
                </div>
                <span className="text-[9px] text-slate-500 block leading-relaxed mt-1">Focus drop detected. Schedule breaks or light administrative tasks.</span>
              </div>

              {/* Strongest Habit */}
              <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-900 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-black">Strong Habits</span>
                <div className="text-slate-200 font-extrabold flex items-center gap-1.5 mt-0.5">
                  <ShieldCheck size={14} className="text-emerald-400" /> Drink Water (100% Checked)
                </div>
                <span className="text-[9px] text-slate-500 block leading-relaxed mt-1">Consistency is perfect. You remain physically hydrated.</span>
              </div>

              {/* Weakest Routine */}
              <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-900 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-black">Weak Routine Routine</span>
                <div className="text-slate-200 font-extrabold flex items-center gap-1.5 mt-0.5">
                  <AlertTriangle size={14} className="text-amber-400" /> Wake up early (20% Checked)
                </div>
                <span className="text-[9px] text-slate-500 block leading-relaxed mt-1">Sleep cycle friction points. Try shifting screens off 30m prior to rest.</span>
              </div>

              {/* Peak Focus Threshold */}
              <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-900 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-black">Peak Focus Threshold</span>
                <div className="text-slate-200 font-extrabold flex items-center gap-1.5 mt-0.5">
                  <Zap size={14} className="text-cyan-400" /> 45 Minutes (Deep Work)
                </div>
                <span className="text-[9px] text-slate-500 block leading-relaxed mt-1">Log 50-minute Pomodoros. Rest cycles should align to maximum limit.</span>
              </div>

            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Chat Console */}
        <div className="lg:col-span-8 glass-card p-5 sm:p-6 rounded-3xl flex flex-col justify-between min-h-[500px]">
          <div>
            <h3 className="text-lg font-black text-slate-100 mb-4 flex items-center gap-2 border-b border-slate-900 pb-3">
              <MessageSquare size={18} className="text-cyan-400" /> Coach Chat Console
            </h3>

            {/* Chat Messages Log */}
            <div className="space-y-4 max-h-[340px] overflow-y-auto pr-1">
              {chatHistory.map((msg, idx) => {
                const isCoach = msg.sender === "coach";
                return (
                  <div
                    key={idx}
                    className={`flex items-start gap-3 ${
                      isCoach ? "justify-start" : "justify-end"
                    }`}
                  >
                    {isCoach && (
                      <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-sm shadow shrink-0">
                        🤖
                      </div>
                    )}
                    
                    <div
                      className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed max-w-[280px] sm:max-w-md ${
                        isCoach
                          ? "bg-slate-950/60 border border-slate-900 text-slate-300 rounded-tl-sm"
                          : "bg-violet-600 text-white rounded-tr-sm"
                      }`}
                    >
                      <p className="whitespace-pre-line">{msg.text}</p>
                    </div>

                    {!isCoach && (
                      <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-sm shadow shrink-0">
                        🥷
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom input area & suggestions */}
          <div className="mt-6 space-y-4 border-t border-slate-900 pt-4">
            {/* Quick action prompts bubbles */}
            <div className="flex flex-wrap gap-2">
              {quickPrompts.map((p) => (
                <button
                  key={p}
                  onClick={() => handleQuickPromptClick(p)}
                  className="py-1.5 px-3 rounded-xl bg-slate-950/80 border border-slate-900 hover:border-slate-800 text-[10px] sm:text-xs font-bold text-slate-400 hover:text-slate-200 transition-all cursor-pointer"
                >
                  {p}
                </button>
              ))}
            </div>

            {/* TextInput */}
            <form onSubmit={handleSendChat} className="flex gap-3 relative">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask coach for focus schedules or procrastination cures..."
                className="flex-1 pl-4 pr-12 py-3 text-xs sm:text-sm glass-input"
              />
              <button
                type="submit"
                className="px-4 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white flex items-center justify-center shadow transition-all cursor-pointer hover:scale-[1.02]"
              >
                <Send size={14} />
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
