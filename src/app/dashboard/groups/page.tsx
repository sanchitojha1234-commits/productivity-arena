"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import {
  Users,
  Mic,
  Image,
  Send,
  CheckCircle,
  ThumbsUp,
  MessageSquare,
  Volume2,
  Lock,
  UserPlus
} from "lucide-react";

interface FeedPost {
  id: string;
  user: string;
  avatar: string;
  group: string;
  text: string;
  proofType?: "voice" | "photo";
  timestamp: string;
  cheers: number;
  commentsCount: number;
}

export default function AccountabilityGroups() {
  const { username, addXP } = useApp();
  const [feed, setFeed] = useState<FeedPost[]>([
    { id: "f1", user: "StudyWarlock", avatar: "🧙‍♂️", group: "Developers Duel", text: "Logged 90 minutes of Next.js setup. Fully completed the routing structures!", proofType: "photo", timestamp: "12m ago", cheers: 4, commentsCount: 2 },
    { id: "f2", user: "MarcusL", avatar: "🎨", group: "Freelance Hustle", text: "Checked off my 'Drink 3L Water' and 'Workout' habits today. Feeling great.", timestamp: "45m ago", cheers: 2, commentsCount: 0 },
    { id: "f3", user: "SarahK", avatar: "👩‍💻", group: "Stanford CS Grind", text: "Completed 3 Pomodoro sessions with Rain Soundscape. Procrastination defeated!", proofType: "voice", timestamp: "1h ago", cheers: 7, commentsCount: 3 }
  ]);

  const [postInput, setPostInput] = useState("");
  
  // Daily Checkin form state
  const [checkedIn, setCheckedIn] = useState(false);
  const [voiceRecorded, setVoiceRecorded] = useState(false);
  const [photoUploaded, setPhotoUploaded] = useState<string | null>(null);

  // Group membership list
  const groups = [
    { name: "Developers Duel", activeMembers: 12, cumulativeXP: 14200, category: "Code" },
    { name: "Freelance Hustle", activeMembers: 8, cumulativeXP: 8400, category: "Biz" },
    { name: "Stanford CS Grind", activeMembers: 15, cumulativeXP: 18100, category: "Study" }
  ];

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postInput.trim()) return;

    const newPost: FeedPost = {
      id: Math.random().toString(36).substring(2, 9),
      user: username,
      avatar: "🥷",
      group: "Developers Duel",
      text: postInput.trim(),
      timestamp: "Just now",
      cheers: 0,
      commentsCount: 0
    };

    setFeed([newPost, ...feed]);
    setPostInput("");
  };

  const handleCheers = (id: string) => {
    setFeed(feed.map(p => p.id === id ? { ...p, cheers: p.cheers + 1 } : p));
  };

  // Mock audio recorder
  const handleRecordVoice = () => {
    setVoiceRecorded(true);
    alert("Voice check-in recorded! (Simulated microphone block capture). Ready to submit.");
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhotoUploaded(e.target.files[0].name);
    }
  };

  const handleDailyCheckInSubmit = () => {
    if (!checkedIn) {
      alert("Please mark the Check-in checkbox first.");
      return;
    }
    
    // Add checkin to feed
    const detailString = `Completed daily check-in! ${voiceRecorded ? "🎤 Voice attached" : ""} ${photoUploaded ? `📸 Proof: ${photoUploaded}` : ""}`;
    const newPost: FeedPost = {
      id: Math.random().toString(36).substring(2, 9),
      user: username,
      avatar: "🥷",
      group: "Developers Duel",
      text: detailString,
      proofType: voiceRecorded ? "voice" : photoUploaded ? "photo" : undefined,
      timestamp: "Just now",
      cheers: 0,
      commentsCount: 0
    };

    setFeed([newPost, ...feed]);
    addXP(30);
    alert("Daily check-in verified! +30 XP claimed.");
    
    // Reset checkin form
    setCheckedIn(false);
    setVoiceRecorded(false);
    setPhotoUploaded(null);
  };

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Title */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-100">Accountability Partner</h2>
        <p className="text-xs sm:text-sm text-slate-400">Join forces with peers, log daily verification proofs, and feed updates</p>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Daily Validation Desk & Joined Groups */}
        <div className="lg:col-span-4 space-y-6">
          {/* Daily Proof Desk */}
          <div className="glass-card p-6 rounded-3xl space-y-4">
            <h3 className="text-base sm:text-lg font-bold text-slate-150 flex items-center gap-2">
              <CheckCircle size={18} className="text-violet-400" /> Daily Check-in Desk
            </h3>

            <p className="text-xs text-slate-450 leading-relaxed">
              Verify your work to your group. Check-in, upload photo progress, or record a voice review.
            </p>

            <div className="space-y-3.5 pt-2">
              {/* Checkin toggle */}
              <label className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-950/60 border border-slate-900 text-xs font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={checkedIn}
                  onChange={() => setCheckedIn(!checkedIn)}
                  className="rounded border-slate-800 bg-slate-950 text-cyan-500 focus:ring-0 cursor-pointer"
                />
                <span className={checkedIn ? "text-slate-200" : "text-slate-450"}>Mark attendance check-in</span>
              </label>

              {/* Voice micro check-in */}
              <div className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-slate-950/60 border border-slate-900 text-xs font-semibold">
                <span className={voiceRecorded ? "text-emerald-400" : "text-slate-450"}>
                  {voiceRecorded ? "🎤 Voice proof recorded" : "Voice check-in"}
                </span>
                <button
                  onClick={handleRecordVoice}
                  className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-850 text-slate-300 hover:text-white transition-all cursor-pointer"
                >
                  <Mic size={14} />
                </button>
              </div>

              {/* Photo check-in */}
              <div className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-slate-950/60 border border-slate-900 text-xs font-semibold">
                <span className={photoUploaded ? "text-emerald-400 truncate max-w-[120px]" : "text-slate-450"}>
                  {photoUploaded ? `📸 ${photoUploaded}` : "Upload Photo Proof"}
                </span>
                <label className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-850 text-slate-300 hover:text-white transition-all cursor-pointer">
                  <Image size={14} />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <button
              onClick={handleDailyCheckInSubmit}
              className="w-full py-3 rounded-xl text-xs font-extrabold bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white cursor-pointer"
            >
              Verify Check-in
            </button>
          </div>

          {/* Joined Groups List */}
          <div className="glass-card p-6 rounded-3xl space-y-4">
            <h3 className="text-base sm:text-lg font-bold text-slate-150 flex items-center gap-2">
              <Users size={18} className="text-cyan-400" /> Joined Circles
            </h3>

            <div className="space-y-3.5">
              {groups.map((group) => (
                <div
                  key={group.name}
                  className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-900 flex items-center justify-between text-xs"
                >
                  <div>
                    <h4 className="font-extrabold text-slate-200">{group.name}</h4>
                    <span className="text-[10px] text-slate-500 mt-1 block">Members: {group.activeMembers} online</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-violet-500/10 text-violet-400 border border-violet-500/20 text-[9px] font-black uppercase">
                    {group.category}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => alert("Search leagues open shortly. You can also invite users via direct link.")}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
            >
              Find New Circle
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Feed */}
        <div className="lg:col-span-8 glass-card p-6 rounded-3xl space-y-6">
          <h3 className="text-lg font-black text-slate-100">Circle Feed</h3>

          {/* Post publisher */}
          <form onSubmit={handlePostSubmit} className="flex gap-3 bg-slate-950/60 p-3 rounded-2xl border border-slate-900 relative">
            <input
              type="text"
              value={postInput}
              onChange={(e) => setPostInput(e.target.value)}
              placeholder="Share your progress with the circle..."
              className="flex-1 bg-transparent border-0 outline-none text-xs sm:text-sm pl-2 pr-10 text-slate-200"
            />
            <button
              type="submit"
              className="p-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white cursor-pointer absolute right-3 top-1/2 transform -translate-y-1/2 shadow"
            >
              <Send size={14} />
            </button>
          </form>

          {/* Feed List */}
          <div className="space-y-4">
            {feed.map((post) => (
              <div
                key={post.id}
                className="p-5 rounded-2xl bg-slate-950/40 border border-slate-900/80 space-y-4"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-lg shadow-inner">
                      {post.avatar}
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-200">{post.user}</h4>
                      <span className="text-[10px] text-slate-500 font-bold block mt-0.5">{post.group} • {post.timestamp}</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-350 leading-relaxed">{post.text}</p>

                {/* Proof Badge Attachment */}
                {post.proofType && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-slate-950 border border-slate-900 text-[10px] font-bold text-slate-400">
                    {post.proofType === "voice" ? (
                      <>
                        <Volume2 size={12} className="text-violet-400 animate-pulse" />
                        <span>Verbal check-in check.wav</span>
                      </>
                    ) : (
                      <>
                        <Image size={12} className="text-cyan-400" />
                        <span>Screenshot proof.png</span>
                      </>
                    )}
                  </div>
                )}

                {/* Interactive Feedback Buttons */}
                <div className="flex gap-4 border-t border-slate-900/60 pt-3 text-xs font-semibold text-slate-500">
                  <button
                    onClick={() => handleCheers(post.id)}
                    className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors cursor-pointer"
                  >
                    <ThumbsUp size={14} />
                    <span>Cheers ({post.cheers})</span>
                  </button>
                  <button
                    onClick={() => alert("Comments panel: Enter your reply to " + post.user)}
                    className="flex items-center gap-1.5 hover:text-violet-400 transition-colors cursor-pointer"
                  >
                    <MessageSquare size={14} />
                    <span>Reply ({post.commentsCount})</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
