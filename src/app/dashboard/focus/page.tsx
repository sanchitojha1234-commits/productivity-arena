"use client";

import React, { useState, useEffect, useRef } from "react";
import { useApp } from "@/context/AppContext";
import {
  Timer,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Maximize2,
  Minimize2,
  Shield,
  Smartphone,
  Info,
  CheckCircle,
  Coffee,
  AlertTriangle
} from "lucide-react";

// Web Audio API Synthesizer Helper
class FocusSoundSynthesizer {
  private ctx: AudioContext | null = null;
  private nodes: { [key: string]: AudioNode[] } = {};
  private activeSound: string | null = null;
  private volumeNode: GainNode | null = null;

  constructor() {}

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.volumeNode = this.ctx.createGain();
      this.volumeNode.gain.value = 0.5;
      this.volumeNode.connect(this.ctx.destination);
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  setVolume(volume: number) {
    this.init();
    if (this.volumeNode) {
      this.volumeNode.gain.value = volume;
    }
  }

  stop() {
    if (this.activeSound && this.nodes[this.activeSound]) {
      this.nodes[this.activeSound].forEach(n => {
        try {
          (n as any).stop();
        } catch(e) {}
      });
      delete this.nodes[this.activeSound];
    }
    this.activeSound = null;
  }

  playNoise(type: "white" | "rain" | "cafe" | "forest") {
    this.init();
    this.stop();
    if (!this.ctx || !this.volumeNode) return;

    this.activeSound = type;
    this.nodes[type] = [];

    // 1. Generate White Noise Buffer
    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    if (type === "white") {
      noiseSource.connect(this.volumeNode);
      noiseSource.start();
      this.nodes[type].push(noiseSource);
    } 
    else if (type === "rain") {
      // Filter white noise to create rain
      const lowpass = this.ctx.createBiquadFilter();
      lowpass.type = "lowpass";
      lowpass.frequency.value = 450;
      
      const bandpass = this.ctx.createBiquadFilter();
      bandpass.type = "bandpass";
      bandpass.frequency.value = 800;
      bandpass.Q.value = 1;

      noiseSource.connect(lowpass);
      lowpass.connect(bandpass);
      bandpass.connect(this.volumeNode);

      noiseSource.start();
      this.nodes[type].push(noiseSource, lowpass, bandpass);
    } 
    else if (type === "cafe") {
      // Low rumble simulator + filtered noise for background clanks
      const lowOsc1 = this.ctx.createOscillator();
      lowOsc1.type = "sine";
      lowOsc1.frequency.value = 75;

      const lowGain = this.ctx.createGain();
      lowGain.gain.value = 0.4;

      const bandpass = this.ctx.createBiquadFilter();
      bandpass.type = "bandpass";
      bandpass.frequency.value = 220;
      bandpass.Q.value = 1.5;

      noiseSource.connect(bandpass);
      bandpass.connect(this.volumeNode);
      
      lowOsc1.connect(lowGain);
      lowGain.connect(this.volumeNode);

      noiseSource.start();
      lowOsc1.start();
      
      this.nodes[type].push(noiseSource, bandpass, lowOsc1, lowGain);
    } 
    else if (type === "forest") {
      // Wind rumble (low frequency bandpassed noise) + simulated birds chirps
      const windPass = this.ctx.createBiquadFilter();
      windPass.type = "bandpass";
      windPass.frequency.value = 350;
      windPass.Q.value = 0.8;

      noiseSource.connect(windPass);
      windPass.connect(this.volumeNode);
      noiseSource.start();
      this.nodes[type].push(noiseSource, windPass);

      // Periodic chirp synth
      const playChirp = () => {
        if (this.activeSound !== "forest" || !this.ctx || !this.volumeNode) return;
        
        const osc = this.ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.setValueAtTime(800 + Math.random() * 600, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1600 + Math.random() * 600, this.ctx.currentTime + 0.15);

        const chirpGain = this.ctx.createGain();
        chirpGain.gain.setValueAtTime(0.08, this.ctx.currentTime);
        chirpGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);

        osc.connect(chirpGain);
        chirpGain.connect(this.volumeNode);
        
        osc.start();
        osc.stop(this.ctx.currentTime + 0.2);

        // Schedule next chirp
        setTimeout(playChirp, 2000 + Math.random() * 4000);
      };
      
      playChirp();
    }
  }
}

export default function FocusMode() {
  const { addFocusMinutes } = useApp();
  
  // Timer States
  const [sessionLength, setSessionLength] = useState<25 | 50 | 90>(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Sound States
  const [activeSound, setActiveSound] = useState<"none" | "white" | "rain" | "cafe" | "forest">("none");
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  
  // Blocker Simulator States
  const [blockedSites, setBlockedSites] = useState<string[]>(["youtube.com", "facebook.com", "twitter.com"]);
  const [newSiteInput, setNewSiteInput] = useState("");
  const [showBlockerWarning, setShowBlockerWarning] = useState<string | null>(null);

  // Phone Reminder state
  const [phoneTrackingActive, setPhoneTrackingActive] = useState(false);
  const [phoneAlertTriggered, setPhoneAlertTriggered] = useState(false);

  const synthRef = useRef<FocusSoundSynthesizer | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Init synthesizer on mount
  useEffect(() => {
    synthRef.current = new FocusSoundSynthesizer();
    return () => {
      if (synthRef.current) {
        synthRef.current.stop();
      }
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);

  // Update volume
  useEffect(() => {
    if (synthRef.current) {
      synthRef.current.setVolume(isMuted ? 0 : volume / 100);
    }
  }, [volume, isMuted]);

  // Handle preset length change
  const handlePresetChange = (length: 25 | 50 | 90) => {
    setIsRunning(false);
    setIsBreak(false);
    setSessionLength(length);
    setTimeLeft(length * 60);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
  };

  // Timer Tick Logic
  const handleStartPause = () => {
    if (isRunning) {
      // Pause
      setIsRunning(false);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    } else {
      // Start
      setIsRunning(true);
      timerIntervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Timer Finished
            clearInterval(timerIntervalRef.current!);
            setIsRunning(false);
            
            if (!isBreak) {
              // Award XP/Coins based on actual study duration
              addFocusMinutes(sessionLength);
              alert(`Spectacular! You completed a ${sessionLength}-minute focus session. +${sessionLength * 2} XP!`);
              // Transition to break
              setIsBreak(true);
              setTimeLeft(5 * 60); // 5-minute break
            } else {
              // Break finished
              setIsBreak(false);
              setTimeLeft(sessionLength * 60);
              alert("Break's over! Let's get back into the arena.");
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsBreak(false);
    setTimeLeft(sessionLength * 60);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
  };

  // Ambient sound selector
  const handleSoundChange = (sound: typeof activeSound) => {
    setActiveSound(sound);
    if (!synthRef.current) return;
    if (sound === "none") {
      synthRef.current.stop();
    } else {
      synthRef.current.playNoise(sound);
    }
  };

  // Mock Blocker trigger
  const handleAddBlockedSite = () => {
    const cleanSite = newSiteInput.trim().toLowerCase();
    if (!cleanSite) return;
    if (blockedSites.includes(cleanSite)) {
      alert(`${cleanSite} is already on the blocker shield list!`);
      setNewSiteInput("");
      return;
    }
    setBlockedSites([...blockedSites, cleanSite]);
    setNewSiteInput("");
  };

  const handleRemoveBlockedSite = (site: string) => {
    setBlockedSites(blockedSites.filter((s) => s !== site));
  };

  // Mock phone sensor simulation
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (phoneTrackingActive && isRunning) {
      // Trigger a phone pick up warning randomly between 15 and 30 seconds for demo purposes
      const triggerTime = 15000 + Math.random() * 15000;
      timeout = setTimeout(() => {
        setPhoneAlertTriggered(true);
        // Play beep or visual alert
        const audio = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audio.createOscillator();
        const gain = audio.createGain();
        osc.frequency.value = 660;
        gain.gain.value = 0.08;
        osc.connect(gain);
        gain.connect(audio.destination);
        osc.start();
        osc.stop(audio.currentTime + 0.3);
      }, triggerTime);
    } else {
      setPhoneAlertTriggered(false);
    }
    return () => clearTimeout(timeout);
  }, [phoneTrackingActive, isRunning]);

  // Format MM:SS
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins < 10 ? "0" : ""}${mins}:${remainingSecs < 10 ? "0" : ""}${remainingSecs}`;
  };

  // Circular progress calculations
  const totalDuration = isBreak ? 5 * 60 : sessionLength * 60;
  const progressPercent = Math.min(100, Math.round(((totalDuration - timeLeft) / totalDuration) * 100));

  return (
    <div className={`space-y-6 ${isFullscreen ? "fixed inset-0 z-50 p-6 flex flex-col justify-center items-center focus-overlay" : ""}`}>
      
      {/* Title Bar - Hide in Fullscreen */}
      {!isFullscreen && (
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-100">Focus Mode</h2>
            <p className="text-xs sm:text-sm text-slate-400">Lock in your attention, block distractions, earn XP rewards</p>
          </div>
          <button
            onClick={() => setIsFullscreen(true)}
            className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer flex items-center gap-2 text-xs font-bold"
          >
            <Maximize2 size={14} /> Fullscreen
          </button>
        </div>
      )}

      {isFullscreen && (
        <button
          onClick={() => setIsFullscreen(false)}
          className="absolute top-6 right-6 p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold z-55"
        >
          <Minimize2 size={14} /> Exit Fullscreen
        </button>
      )}

      <div className={`grid ${isFullscreen ? "max-w-4xl w-full" : "lg:grid-cols-12"} gap-6`}>
        
        {/* TIMER COLUMN */}
        <div className={`${isFullscreen ? "lg:col-span-12" : "lg:col-span-8"} glass-card p-6 sm:p-8 rounded-3xl flex flex-col items-center justify-center text-center relative overflow-hidden min-h-[440px]`}>
          <div className="absolute top-[10%] left-[10%] w-[30%] h-[30%] rounded-full bg-violet-600/5 blur-[80px] pointer-events-none"></div>

          {/* Break state tag */}
          {isBreak && (
            <div className="mb-4 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-black tracking-widest uppercase flex items-center gap-1.5 animate-pulse">
              <Coffee size={14} /> BREAK PERIOD
            </div>
          )}

          {/* Time presets selection - Hide on Break */}
          {!isBreak && !isFullscreen && (
            <div className="flex gap-3 mb-8 bg-slate-950 p-1 border border-slate-900 rounded-xl text-xs font-bold relative z-10">
              {([25, 50, 90] as const).map((len) => (
                <button
                  key={len}
                  onClick={() => handlePresetChange(len)}
                  className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
                    sessionLength === len ? "bg-violet-600 text-white font-extrabold" : "text-slate-450 hover:text-slate-200"
                  }`}
                >
                  {len}m {len === 25 ? "Rookie" : len === 50 ? "Deep Work" : "Master"}
                </button>
              ))}
            </div>
          )}

          {/* Giant Countdown Clock */}
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center my-4">
            {/* SVG Progress Circle */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="50%"
                cy="50%"
                r="46%"
                className="stroke-slate-900 fill-transparent"
                strokeWidth="10"
              />
              <circle
                cx="50%"
                cy="50%"
                r="46%"
                className="stroke-violet-500 fill-transparent transition-all duration-300"
                strokeWidth="10"
                strokeDasharray="290"
                strokeDashoffset={290 - (290 * progressPercent) / 100}
                strokeLinecap="round"
              />
            </svg>

            {/* Glowing Center */}
            <div className="absolute inset-[15px] rounded-full bg-slate-950 flex flex-col justify-center items-center border border-slate-900 shadow-inner">
              <div className="text-4xl sm:text-5xl font-black text-slate-100 font-mono tracking-wider">
                {formatTime(timeLeft)}
              </div>
              <span className="text-[10px] text-slate-450 font-bold uppercase tracking-widest mt-2">
                {isBreak ? "Rest & Breathe" : isRunning ? "FOCUS ON GOALS" : "TIMER READY"}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-6 mt-6 relative z-10">
            <button
              onClick={handleReset}
              className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 transition-all cursor-pointer"
              title="Reset"
            >
              <RotateCcw size={18} />
            </button>
            <button
              onClick={handleStartPause}
              className={`w-16 h-16 rounded-full flex items-center justify-center text-white neon-glow-primary shadow-lg hover:scale-[1.03] active:scale-[0.97] transition-all cursor-pointer bg-gradient-to-r ${
                isRunning ? "from-red-600 to-orange-500" : "from-violet-600 to-cyan-500"
              }`}
            >
              {isRunning ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
            </button>
            <div className="w-[50px]"></div> {/* spacer for layout symmetry */}
          </div>
        </div>

        {/* SIDE PANELS - Hide in fullscreen unless they fit */}
        {!isFullscreen && (
          <div className="lg:col-span-4 space-y-6">
            
            {/* Audio Soundscape mixer */}
            <div className="glass-card p-6 rounded-3xl">
              <h3 className="text-base sm:text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
                <Volume2 size={18} className="text-violet-400" /> Focus Soundscape
              </h3>

              <div className="grid grid-cols-2 gap-3 mb-6">
                {[
                  { id: "none", label: "🔇 Silent" },
                  { id: "white", label: "📺 White Noise" },
                  { id: "rain", label: "🌧️ Rain" },
                  { id: "cafe", label: "☕ Cafe" },
                  { id: "forest", label: "🌲 Forest" }
                ].map((sound) => (
                  <button
                    key={sound.id}
                    onClick={() => handleSoundChange(sound.id as any)}
                    className={`py-3 px-2 rounded-xl border text-xs font-bold text-center transition-all cursor-pointer truncate ${
                      activeSound === sound.id
                        ? "bg-violet-950/20 border-violet-500 text-violet-300"
                        : "bg-slate-950/40 border-slate-900 text-slate-400 hover:text-slate-200 hover:border-slate-800"
                    }`}
                  >
                    {sound.label}
                  </button>
                ))}
              </div>

              {/* Volume Slider */}
              {activeSound !== "none" && (
                <div className="space-y-2 border-t border-slate-900 pt-4">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-400">
                    <span>Synthesizer Volume</span>
                    <span>{isMuted ? "Muted" : `${volume}%`}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="text-slate-450 hover:text-slate-200 cursor-pointer"
                    >
                      {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={volume}
                      onChange={(e) => setVolume(Number(e.target.value))}
                      className="flex-1 accent-violet-500 h-1 bg-slate-900 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Simulated website blocker */}
            <div className="glass-card p-6 rounded-3xl space-y-4">
              <h3 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
                <Shield size={18} className="text-cyan-400" /> Blocker Shield
              </h3>

              <p className="text-[11px] sm:text-xs text-slate-450 leading-relaxed">
                Add domain addresses that make you lose focus. Access is restricted during focus sessions.
              </p>

              {/* Add form */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSiteInput}
                  onChange={(e) => setNewSiteInput(e.target.value)}
                  placeholder="e.g. reddit.com"
                  className="flex-1 px-3 py-1.5 text-xs glass-input"
                  onKeyDown={(e) => e.key === "Enter" && handleAddBlockedSite()}
                />
                <button
                  onClick={handleAddBlockedSite}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 font-extrabold text-xs cursor-pointer"
                >
                  Block
                </button>
              </div>

              {/* Blocked sites list */}
              <div className="flex flex-wrap gap-2 pt-2">
                {blockedSites.map((site) => (
                  <span
                    key={site}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-red-950/20 border border-red-500/10 text-red-400 text-[10px] font-bold"
                  >
                    <span>{site}</span>
                    <button
                      onClick={() => handleRemoveBlockedSite(site)}
                      className="hover:text-red-300 font-black cursor-pointer ml-1"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              {/* Interactive Demo Test */}
              <div className="border-t border-slate-900/60 pt-4 text-xs font-semibold text-slate-500">
                <span className="block mb-2 text-[10px] font-bold uppercase text-slate-450">Demo Mock Test:</span>
                <div className="flex gap-2">
                  {blockedSites.slice(0, 2).map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        if (isRunning) {
                          setShowBlockerWarning(s);
                          setTimeout(() => setShowBlockerWarning(null), 4000);
                        } else {
                          alert("Start the timer first to see the blocker block access!");
                        }
                      }}
                      className="px-2 py-1 bg-slate-950 border border-slate-900 hover:border-slate-800 rounded text-[10px] text-slate-350 cursor-pointer"
                    >
                      Visit {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Phone reminder mode */}
            <div className="glass-card p-6 rounded-3xl space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
                  <Smartphone size={18} className="text-amber-400" /> Phone pick up sensor
                </h3>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={phoneTrackingActive}
                    onChange={() => setPhoneTrackingActive(!phoneTrackingActive)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-900 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-400 after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-violet-600 peer-checked:after:bg-white"></div>
                </label>
              </div>

              <p className="text-[11px] sm:text-xs text-slate-450 leading-relaxed">
                Utilizes simulated gyroscopes to detect when you unlock or pick up your phone. Dispatches an audio warning to break phone loop.
              </p>

              {phoneTrackingActive && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] font-semibold text-amber-400 flex items-start gap-2">
                  <Info size={14} className="shrink-0 mt-0.5" />
                  <span>Tracking active. Avoid picking up your phone. Simulated event will trigger shortly.</span>
                </div>
              )}

              {phoneAlertTriggered && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-[11px] font-semibold text-red-400 flex items-start gap-2 animate-bounce">
                  <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                  <span>WARNING: We detected a phone pick-up! Stay focused.</span>
                </div>
              )}
            </div>

          </div>
        )}

      </div>

      {/* POPUP WARNINGS */}
      {showBlockerWarning && (
        <div className="fixed bottom-6 right-6 z-55 p-4 rounded-xl bg-red-950/90 border border-red-500/40 text-red-300 shadow-2xl flex items-center gap-3 max-w-sm animate-bounce">
          <Shield size={24} className="text-red-400 shrink-0" />
          <div>
            <h4 className="text-xs font-black uppercase text-red-400">Website Restricted!</h4>
            <p className="text-[11px] leading-relaxed text-slate-300 mt-0.5">
              Access to <strong>{showBlockerWarning}</strong> is blocked during your focus period.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
