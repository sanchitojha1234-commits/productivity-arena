"use client";

import React, { useState } from "react";
import { useApp, AccessoryPlacement } from "@/context/AppContext";
import { Smile, Coins, Edit3, Award, MessageSquare, Sliders, Sparkles, Heart } from "lucide-react";

interface ClosetItem {
  id: string;
  name: string;
  slot: "head" | "face" | "hand";
  icon: string;
}

export default function ProductivityPet() {
  const {
    pet,
    coins,
    petMultiplier,
    addCoins,
    renamePet,
    updatePetPlacement,
    petPet
  } = useApp();

  const [activeTab, setActiveTab] = useState<"closet" | "feed" | "stats">("closet");
  
  // Naming states
  const [petNameInput, setPetNameInput] = useState(pet.name);
  const [isEditingName, setIsEditingName] = useState(false);
  const [feedSuccess, setFeedSuccess] = useState("");

  // Petting visual click state
  const [isPetting, setIsPetting] = useState(false);
  const [clickHearts, setClickHearts] = useState<{ id: number; x: number; y: number }[]>([]);

  // Closet Editor states
  const [activeSlot, setActiveSlot] = useState<"head" | "face" | "hand">("head");
  
  const closetItems: ClosetItem[] = [
    { id: "Golden Crown", name: "Golden Crown", slot: "head", icon: "👑" },
    { id: "Wizard Hat", name: "Wizard Hat", slot: "head", icon: "🧙‍♂️" },
    { id: "Ninja Mask", name: "Ninja Mask", slot: "face", icon: "🥷" },
    { id: "Sunglasses", name: "Sunglasses", slot: "face", icon: "🕶️" },
    { id: "Focus Sword", name: "Focus Sword", slot: "hand", icon: "⚔️" }
  ];

  // Sliders states for the current active slot configuration
  const getCurrentPlacement = (): AccessoryPlacement => {
    if (activeSlot === "head") return pet.equippedHead || { id: "", x: 0, y: 0, scale: 1 };
    if (activeSlot === "face") return pet.equippedFace || { id: "", x: 0, y: 0, scale: 1 };
    return pet.equippedHand || { id: "", x: 0, y: 0, scale: 1 };
  };

  const currentPlacement = getCurrentPlacement();

  const handleSliderChange = (field: "x" | "y" | "scale", value: number) => {
    if (!currentPlacement.id) return;
    const updated = {
      ...currentPlacement,
      [field]: value
    };
    updatePetPlacement(activeSlot, updated);
  };

  const handleEquipClosetItem = (item: ClosetItem) => {
    const defaultPlacement: AccessoryPlacement = {
      id: item.id,
      x: 0,
      y: 0,
      scale: 1
    };
    updatePetPlacement(item.slot, defaultPlacement);
  };

  const handleClearSlot = () => {
    updatePetPlacement(activeSlot, null);
  };

  const handleRenameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!petNameInput.trim()) return;
    renamePet(petNameInput.trim());
    setIsEditingName(false);
  };

  const handleFeedTreat = () => {
    if (coins < 15) {
      alert("Not enough coins! Complete tasks on the dashboard or battles room to earn coins.");
      return;
    }
    // Deduct coins and boost pet XP via petting/feeding simulation
    addCoins(-15);
    petPet(); // feeds pet and increases user/pet stats
    
    setFeedSuccess(`${pet.name} gobbled the cookie! Happiness and Strength increased. (+10 Pet XP, +10 User XP)`);
    setTimeout(() => setFeedSuccess(""), 4000);
  };

  // Pet pet click action
  const handlePetClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isPetting) return;
    
    setIsPetting(true);
    petPet(); // triggers state check in context

    // Spawn floating particle coordinates relative to click box
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newHeart = { id: Date.now(), x, y };
    setClickHearts([...clickHearts, newHeart]);

    setTimeout(() => {
      setIsPetting(false);
      setClickHearts(prev => prev.filter(h => h.id !== newHeart.id));
    }, 1000);
  };

  // SVGs rendering helpers
  const renderPetBody = () => {
    const isSleepy = pet.status === "Sleepy";
    const isHappy = pet.status === "Happy" || isPetting;
    
    let primaryColor = "#f59e0b"; // Orange Flamelet
    let eyeColor = "#0f172a";
    
    let bodyPath = (
      <path
        d="M50,15 C85,45 80,85 50,90 C20,85 15,45 50,15 Z"
        fill="url(#petGrad)"
      />
    );

    if (pet.type === "Leafy") {
      primaryColor = "#10b981"; // green Leafy
      bodyPath = (
        <path
          d="M50,10 C90,30 90,75 50,90 C10,75 10,30 50,10 Z"
          fill="url(#petGrad)"
        />
      );
    } else if (pet.type === "Aquasprite") {
      primaryColor = "#06b6d4"; // blue Aquasprite
      bodyPath = (
        <path
          d="M50,12 C80,45 80,80 50,88 C20,80 20,45 50,12 Z"
          fill="url(#petGrad)"
        />
      );
    }

    // Render face
    let faceSvg = null;
    if (isSleepy) {
      faceSvg = (
        <g>
          <path d="M35,50 Q40,55 45,50" stroke={eyeColor} strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M55,50 Q60,55 65,50" stroke={eyeColor} strokeWidth="3" fill="none" strokeLinecap="round" />
          <circle cx="50" cy="62" r="3" fill={eyeColor} />
        </g>
      );
    } else if (isHappy) {
      faceSvg = (
        <g>
          <path d="M35,46 Q40,40 45,46" stroke={eyeColor} strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M55,46 Q60,40 65,46" stroke={eyeColor} strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M42,60 Q50,68 58,60" stroke={eyeColor} strokeWidth="3.5" fill="none" strokeLinecap="round" />
          <ellipse cx="32" cy="56" rx="5" ry="3" fill="#f43f5e" opacity="0.6" />
          <ellipse cx="68" cy="56" rx="5" ry="3" fill="#f43f5e" opacity="0.6" />
        </g>
      );
    } else {
      faceSvg = (
        <g>
          <circle cx="40" cy="48" r="4.5" fill={eyeColor} className="animate-eye-blink" />
          <circle cx="60" cy="48" r="4.5" fill={eyeColor} className="animate-eye-blink" />
          <path d="M44,58 Q50,63 56,58" stroke={eyeColor} strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </g>
      );
    }

    // Accessory Renderers by Slot
    const renderHeadAccessory = () => {
      const placement = pet.equippedHead;
      if (!placement) return null;
      
      const transformStr = `translate(${50 + placement.x}, ${18 + placement.y}) scale(${placement.scale}) translate(-50, -18)`;
      
      if (placement.id === "Golden Crown") {
        return (
          <path
            d="M32,24 L38,12 L44,20 L50,10 L56,20 L62,12 L68,24 Z"
            fill="#f59e0b"
            stroke="#d97706"
            strokeWidth="1.5"
            transform={transformStr}
            className="animate-accessory-jiggle origin-bottom"
          />
        );
      }
      if (placement.id === "Wizard Hat") {
        return (
          <g transform={transformStr} className="animate-accessory-jiggle origin-bottom">
            <path d="M22,25 L50,-5 L78,25 Z" fill="#4338ca" />
            <ellipse cx="50" cy="24" rx="30" ry="4" fill="#312e81" />
            <polygon points="46,14 54,14 50,0" fill="#f59e0b" />
          </g>
        );
      }
      return null;
    };

    const renderFaceAccessory = () => {
      const placement = pet.equippedFace;
      if (!placement) return null;
      
      const transformStr = `translate(${50 + placement.x}, ${48 + placement.y}) scale(${placement.scale}) translate(-50, -48)`;
      
      if (placement.id === "Ninja Mask") {
        return (
          <g transform={transformStr} className="animate-accessory-jiggle origin-center">
            <rect x="25" y="42" width="50" height="12" fill="#1e1b4b" rx="2" />
            <rect x="33" y="44" width="34" height="8" fill="#f59e0b" rx="1" />
            <circle cx="40" cy="48" r="2.5" fill={eyeColor} />
            <circle cx="60" cy="48" r="2.5" fill={eyeColor} />
          </g>
        );
      }
      if (placement.id === "Sunglasses") {
        return (
          <g transform={transformStr} className="origin-center">
            <path d="M28,45 L72,45 L70,52 L62,54 L58,49 L50,49 L42,49 L38,54 L30,52 Z" fill="#020617" />
            <rect x="32" y="46" width="14" height="6" fill="#1e293b" opacity="0.9" rx="1" />
            <rect x="54" y="46" width="14" height="6" fill="#1e293b" opacity="0.9" rx="1" />
            <line x1="46" y1="47" x2="54" y2="47" stroke="#94a3b8" strokeWidth="1.5" />
          </g>
        );
      }
      return null;
    };

    const renderHandAccessory = () => {
      const placement = pet.equippedHand;
      if (!placement) return null;
      
      const transformStr = `translate(${78 + placement.x}, ${65 + placement.y}) scale(${placement.scale}) translate(-78, -65)`;
      
      if (placement.id === "Focus Sword") {
        return (
          <g transform={transformStr} className="animate-float origin-bottom">
            <rect x="76" y="72" width="8" height="3" fill="#64748b" rx="0.5" />
            <rect x="79" y="75" width="2" height="6" fill="#334155" />
            <rect x="78" y="32" width="4" height="40" fill="#06b6d4" rx="1" className="neon-glow-secondary animate-pulse" />
            <rect x="79.5" y="34" width="1" height="36" fill="#ecfeff" rx="0.5" />
          </g>
        );
      }
      return null;
    };

    return (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_10px_20px_rgba(139,92,246,0.3)]">
        <defs>
          <linearGradient id="petGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={primaryColor} />
            <stop offset="100%" stopColor="#1e1e2d" />
          </linearGradient>
        </defs>

        {/* Particles floaters background */}
        {isSleepy && (
          <g>
            <text x="68" y="24" fill="#a78bfa" className="animate-drift-up-z text-[10px] font-black" style={{ animationDelay: "0s" }}>Z</text>
            <text x="76" y="28" fill="#c084fc" className="animate-drift-up-z text-[8px] font-bold" style={{ animationDelay: "1s" }}>z</text>
            <text x="82" y="32" fill="#e9d5ff" className="animate-drift-up-z text-[6px] font-medium" style={{ animationDelay: "2s" }}>z</text>
          </g>
        )}
        {isHappy && (
          <g>
            <path d="M72,25 C70,22 66,22 64,25 C62,28 66,32 72,36 C78,32 82,28 80,25 C78,22 74,22 72,25 Z" fill="#f43f5e" className="animate-drift-up-heart" style={{ animationDelay: "0s" }} />
            <path d="M28,25 C26,22 22,22 20,25 C18,28 22,32 28,36 C34,32 38,28 36,25 C34,22 30,22 28,25 Z" fill="#f43f5e" className="animate-drift-up-heart" style={{ animationDelay: "1.2s" }} />
          </g>
        )}

        {/* Unified Pet Character Group */}
        <g className={isPetting ? "animate-pet-click" : isSleepy ? "animate-pet-sleepy origin-bottom" : isHappy ? "animate-pet-happy origin-bottom" : "animate-pet-breath origin-bottom"}>
          {bodyPath}
          {faceSvg}
          
          {/* Accessories layers */}
          {renderHeadAccessory()}
          {renderFaceAccessory()}
          {renderHandAccessory()}
        </g>
      </svg>
    );
  };

  const xpNeeded = pet.level * 100;
  const petXpPercent = Math.min(100, Math.round((pet.xp / xpNeeded) * 100));

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-100">Productivity Pet Closet</h2>
          <p className="text-xs sm:text-sm text-slate-400">Dress up, customize positions, feed, and tap your pet to triggers companion battle multipliers</p>
        </div>

        <div className="px-4 py-2 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center gap-2 font-black text-xs sm:text-sm">
          <Sparkles size={16} className="text-cyan-400" />
          <span>+{petMultiplier}% Passive XP Multiplier</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT PANEL: Pet Viewport ( Petting Canvas ) */}
        <div className="lg:col-span-5 glass-card p-6 sm:p-8 rounded-3xl flex flex-col items-center justify-center min-h-[460px] text-center relative overflow-hidden select-none">
          <div className="absolute inset-0 bg-gradient-to-tr from-violet-600/10 to-cyan-500/10 blur-[80px] pointer-events-none"></div>

          {/* Sparkle hearts on pet-click */}
          {clickHearts.map((heart) => (
            <div
              key={heart.id}
              className="absolute pointer-events-none text-rose-500 text-xl animate-ping"
              style={{ left: heart.x - 10, top: heart.y - 10 }}
            >
              ❤️
            </div>
          ))}

          {/* Stage tag */}
          <span className="px-3.5 py-1 rounded-full bg-violet-500/10 border border-violet-500/25 text-violet-400 text-[10px] font-black uppercase tracking-widest mb-4">
            {pet.type} companion (Lvl {pet.level})
          </span>

          {/* Pet name & edit */}
          {isEditingName ? (
            <form onSubmit={handleRenameSubmit} className="flex gap-2 mb-6 relative z-10">
              <input
                type="text"
                value={petNameInput}
                onChange={(e) => setPetNameInput(e.target.value)}
                className="px-3 py-1.5 text-xs glass-input"
                maxLength={12}
                required
              />
              <button
                type="submit"
                className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-xs font-bold text-white cursor-pointer"
              >
                Save
              </button>
            </form>
          ) : (
            <h3 className="text-xl sm:text-2xl font-black text-slate-150 mb-6 flex items-center justify-center gap-2 relative z-10">
              <span>{pet.name}</span>
              <button
                onClick={() => setIsEditingName(true)}
                className="text-slate-500 hover:text-slate-350 cursor-pointer"
                title="Rename companion"
              >
                <Edit3 size={14} />
              </button>
            </h3>
          )}

          {/* Interactive Petting canvas container */}
          <div
            onClick={handlePetClick}
            className="w-56 h-56 sm:w-64 sm:h-64 relative my-2 flex items-center justify-center cursor-pointer group active:scale-98 transition-transform"
            title="Click to pet!"
          >
            <div className="absolute inset-0 bg-transparent rounded-full border border-dashed border-slate-900 group-hover:border-violet-500/30 transition-colors pointer-events-none scale-105"></div>
            <div className="absolute bottom-2 text-[10px] font-black text-slate-650 opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest">Click to Pet</div>
            {renderPetBody()}
          </div>

          {/* Status markers */}
          <div className="mt-4 flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${
              pet.status === "Happy" || isPetting ? "bg-emerald-400 animate-ping" :
              pet.status === "Active" ? "bg-cyan-400" :
              "bg-indigo-400 animate-pulse"
            }`}></span>
            <span className="text-xs font-black uppercase text-slate-350 tracking-wider">
              {pet.name} is {isPetting ? "Giggling!" : pet.status}
            </span>
          </div>
        </div>

        {/* RIGHT PANEL: Control Console tabs */}
        <div className="lg:col-span-7 space-y-6">
          {/* Tabs */}
          <div className="flex p-1 rounded-xl bg-slate-950 border border-slate-900 text-xs font-bold self-start">
            <button
              onClick={() => setActiveTab("closet")}
              className={`px-4 py-2.5 rounded-lg transition-all cursor-pointer ${
                activeTab === "closet" ? "bg-slate-900 text-cyan-400" : "text-slate-450 hover:text-slate-200"
              }`}
            >
              👗 Closet Dress Room
            </button>
            <button
              onClick={() => setActiveTab("feed")}
              className={`px-4 py-2.5 rounded-lg transition-all cursor-pointer ${
                activeTab === "feed" ? "bg-slate-900 text-cyan-400" : "text-slate-450 hover:text-slate-200"
              }`}
            >
              🍪 Feed & Nurture
            </button>
            <button
              onClick={() => setActiveTab("stats")}
              className={`px-4 py-2.5 rounded-lg transition-all cursor-pointer ${
                activeTab === "stats" ? "bg-slate-900 text-cyan-400" : "text-slate-450 hover:text-slate-200"
              }`}
            >
              📊 Stats & Mults
            </button>
          </div>

          {/* TAB: CLOSET DRESS ROOM */}
          {activeTab === "closet" && (
            <div className="glass-card p-6 rounded-3xl space-y-6">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-150">Inventory Closet</h3>
                <p className="text-xs text-slate-450">Equip available accessories and position them on your pet.</p>
              </div>

              {/* Grid of items */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {closetItems.map((item) => {
                  const headId = pet.equippedHead?.id;
                  const faceId = pet.equippedFace?.id;
                  const handId = pet.equippedHand?.id;
                  const isEquipped = headId === item.id || faceId === item.id || handId === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleEquipClosetItem(item)}
                      className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                        isEquipped
                          ? "bg-violet-950/20 border-violet-500 text-violet-300"
                          : "bg-slate-950/40 border-slate-900 text-slate-400 hover:text-slate-250 hover:border-slate-800"
                      }`}
                    >
                      <span className="text-2xl">{item.icon}</span>
                      <span className="text-[10px] font-bold block truncate max-w-[80px]">{item.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Offset Sliders Panel */}
              <div className="border-t border-slate-900 pt-6 space-y-5">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-black uppercase text-slate-350 tracking-wider">Placement Tuner</h4>
                  
                  {/* Slot selection in tuner */}
                  <div className="flex p-0.5 rounded-lg bg-slate-950 border border-slate-900 text-[10px] font-bold">
                    {["head", "face", "hand"].map((slot) => (
                      <button
                        key={slot}
                        onClick={() => setActiveSlot(slot as any)}
                        className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                          activeSlot === slot ? "bg-slate-900 text-cyan-400" : "text-slate-450"
                        }`}
                      >
                        {slot.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {currentPlacement.id ? (
                  <div className="space-y-4">
                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-900 text-xs font-bold text-slate-300">
                      Active: <span className="text-cyan-400">{currentPlacement.id}</span> in {activeSlot.toUpperCase()} slot
                    </div>

                    {/* Slider X */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold text-slate-450">
                        <span>Offset X</span>
                        <span>{currentPlacement.x}px</span>
                      </div>
                      <input
                        type="range"
                        min="-30"
                        max="30"
                        value={currentPlacement.x}
                        onChange={(e) => handleSliderChange("x", Number(e.target.value))}
                        className="w-full accent-violet-500 h-1 bg-slate-900 rounded-lg cursor-pointer"
                      />
                    </div>

                    {/* Slider Y */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold text-slate-450">
                        <span>Offset Y</span>
                        <span>{currentPlacement.y}px</span>
                      </div>
                      <input
                        type="range"
                        min="-30"
                        max="30"
                        value={currentPlacement.y}
                        onChange={(e) => handleSliderChange("y", Number(e.target.value))}
                        className="w-full accent-violet-500 h-1 bg-slate-900 rounded-lg cursor-pointer"
                      />
                    </div>

                    {/* Slider Scale */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold text-slate-450">
                        <span>Scale size</span>
                        <span>{Math.round(currentPlacement.scale * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0.5"
                        max="1.8"
                        step="0.05"
                        value={currentPlacement.scale}
                        onChange={(e) => handleSliderChange("scale", Number(e.target.value))}
                        className="w-full accent-violet-500 h-1 bg-slate-900 rounded-lg cursor-pointer"
                      />
                    </div>

                    <button
                      onClick={handleClearSlot}
                      className="mt-2 py-2 px-4 rounded-xl bg-red-950/20 border border-red-500/20 hover:bg-red-500/10 text-red-400 text-xs font-black cursor-pointer"
                    >
                      Clear {activeSlot.toUpperCase()} slot
                    </button>
                  </div>
                ) : (
                  <div className="p-10 text-center rounded-2xl bg-slate-950/20 border border-slate-900/60 text-xs font-bold text-slate-500">
                    No item equipped in {activeSlot.toUpperCase()} slot. Select an item from the inventory list above.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: FEED & NURTURE */}
          {activeTab === "feed" && (
            <div className="glass-card p-6 rounded-3xl space-y-6">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-150">Feeding Cookies</h3>
                <p className="text-xs text-slate-450">Maintain pet stats to preserve companion battle advantages.</p>
              </div>

              {feedSuccess && (
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold">
                  {feedSuccess}
                </div>
              )}

              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Feed your pet treats. Snacks cost <strong>15 Coins</strong>. Feeding grants <strong>+10 Pet XP</strong>, <strong>+10 User XP</strong>, increases strength, and maxes out happiness!
              </p>

              <div className="flex justify-between items-center border-t border-slate-900 pt-5">
                <div className="text-xs font-bold text-slate-450 flex items-center gap-1.5">
                  Cost: <span className="text-yellow-400 font-extrabold flex items-center gap-0.5"><Coins size={14} /> 15 Coins</span>
                </div>
                <button
                  onClick={handleFeedTreat}
                  className="px-5 py-3 rounded-xl text-xs sm:text-sm font-extrabold bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white cursor-pointer shadow-lg"
                >
                  Buy & Feed Treat
                </button>
              </div>
            </div>
          )}

          {/* TAB: STATS & MULTIPLIERS */}
          {activeTab === "stats" && (
            <div className="glass-card p-6 rounded-3xl space-y-6">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-150">Companion Statistics</h3>
                <p className="text-xs text-slate-450">Active multipliers based on Tamagotchi levels</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Happiness */}
                <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-900 space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase font-black">Pet Happiness</span>
                  <span className="text-xl font-black text-slate-100 block">{pet.happiness || 85}%</span>
                  <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden mt-1.5">
                    <div className="h-full bg-emerald-500" style={{ width: `${pet.happiness || 85}%` }}></div>
                  </div>
                </div>

                {/* Strength */}
                <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-900 space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase font-black">Pet Strength</span>
                  <span className="text-xl font-black text-slate-100 block">{pet.strength || 15} STR</span>
                  <span className="text-[9px] text-slate-500 block leading-relaxed mt-1">Strengthened by level checks</span>
                </div>
              </div>

              {/* Growth progress bar */}
              <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-900 space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-350">
                  <span>Growth progress</span>
                  <span>{pet.xp} / {xpNeeded} Pet XP</span>
                </div>
                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-violet-500 to-cyan-400"
                    style={{ width: `${petXpPercent}%` }}
                  ></div>
                </div>
              </div>

              {/* passive multiplier explanation card */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#0c0c16] to-[#121226]/50 border border-violet-900/20 text-xs text-slate-400 leading-relaxed">
                <span className="block font-black text-slate-200 mb-1 flex items-center gap-1"><Award size={13} className="text-amber-400" /> Duel XP multiplier explanation:</span>
                Your pet's level and happiness grant passive battle boosts. XP gains from winning battles are multiplied by <strong>+{petMultiplier}%</strong>. Keep your pet fed and happy to maximize progression speed!
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
