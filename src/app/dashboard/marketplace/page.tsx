"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { ShoppingBag, Coins, Shield, Sparkles, Check, Crown } from "lucide-react";

interface ShopItem {
  id: string;
  name: string;
  category: "pet" | "avatar" | "theme";
  price: number;
  description: string;
  icon: string;
}

export default function Marketplace() {
  const { coins, purchasedItems, buyMarketplaceItem, equippedTheme, equipTheme, updatePetPlacement } = useApp();
  const [activeTab, setActiveTab] = useState<"all" | "pet" | "avatar" | "theme">("all");
  const [successMsg, setSuccessMsg] = useState("");

  const shopItems: ShopItem[] = [
    // Pet Accessories
    { id: "Golden Crown", name: "Golden Crown", category: "pet", price: 50, description: "A shiny regal crown fit for productivity kings.", icon: "👑" },
    { id: "Ninja Mask", name: "Ninja Mask", category: "pet", price: 30, description: "Conceal your pet's face to strike tasks in stealth.", icon: "🥷" },
    { id: "Wizard Hat", name: "Wizard Hat", category: "pet", price: 45, description: "Grant your pet magical focus abilities.", icon: "🧙‍♂️" },
    
    // Avatar Borders
    { id: "Neon Aura", name: "Neon Aura", category: "avatar", price: 80, description: "Surround your dashboard avatar in a glowing neon grid.", icon: "🌟" },
    { id: "Gold Frame", name: "Gold Frame", category: "avatar", price: 120, description: "An expensive gold frame that shouts prestige.", icon: "🖼️" },
    { id: "Dark Matter", name: "Dark Matter", category: "avatar", price: 150, description: "An animated black-hole style border.", icon: "🌀" },
    
    // UI Themes
    { id: "Default Theme", name: "Default Theme", category: "theme", price: 0, description: "Standard premium deep space dark mode styling.", icon: "🌌" },
    { id: "Emerald Meadow", name: "Emerald Meadow", category: "theme", price: 60, description: "Calming forest green styling accents across components.", icon: "🌿" },
    { id: "Cyberpunk Pink", name: "Cyberpunk Pink", category: "theme", price: 100, description: "Vibrant neon pink and violet accents for a cyberpunk feel.", icon: "🔮" }
  ];

  const handlePurchase = (item: ShopItem) => {
    if (purchasedItems.includes(item.id)) {
      // Already owned, just equip
      if (item.category === "theme") {
        equipTheme(item.id);
        setSuccessMsg(`Equipped UI Theme: "${item.name}"!`);
      } else if (item.category === "pet") {
        if (item.id === "Golden Crown") {
          updatePetPlacement("head", { id: item.id, x: 0, y: -35, scale: 1.0 });
        } else if (item.id === "Wizard Hat") {
          updatePetPlacement("head", { id: item.id, x: 0, y: -42, scale: 1.1 });
        } else if (item.id === "Ninja Mask") {
          updatePetPlacement("face", { id: item.id, x: 0, y: -5, scale: 0.95 });
        }
        setSuccessMsg(`Equipped "${item.name}" on your pet!`);
      }
      setTimeout(() => setSuccessMsg(""), 3000);
      return;
    }

    const success = buyMarketplaceItem(item.id, item.price);
    if (success) {
      setSuccessMsg(`Successfully purchased "${item.name}"!`);
      // Auto equip
      if (item.category === "theme") {
        equipTheme(item.id);
      } else if (item.category === "pet") {
        if (item.id === "Golden Crown") {
          updatePetPlacement("head", { id: item.id, x: 0, y: -35, scale: 1.0 });
        } else if (item.id === "Wizard Hat") {
          updatePetPlacement("head", { id: item.id, x: 0, y: -42, scale: 1.1 });
        } else if (item.id === "Ninja Mask") {
          updatePetPlacement("face", { id: item.id, x: 0, y: -5, scale: 0.95 });
        }
      }
      setTimeout(() => setSuccessMsg(""), 4000);
    } else {
      alert("Insufficient Arena Coins! Complete more tasks to earn coins.");
    }
  };

  const filteredItems = activeTab === "all"
    ? shopItems
    : shopItems.filter(item => item.category === activeTab);

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-100">Marketplace</h2>
          <p className="text-xs sm:text-sm text-slate-400">Spend your earned Arena Coins on profile customizing accessories and themes</p>
        </div>

        {/* Coins tracker */}
        <div className="px-4 py-2 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 flex items-center gap-2 font-black text-sm">
          <Coins size={16} className="fill-yellow-400/10" />
          <span>{coins} Coins Available</span>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold flex items-center gap-2 animate-bounce">
          <Check size={16} /> {successMsg}
        </div>
      )}

      {/* Tabs */}
      <div className="flex p-1 rounded-xl bg-slate-950 border border-slate-900 text-xs font-bold w-full sm:w-auto self-start inline-flex">
        {([
          { id: "all", label: "Shop All" },
          { id: "pet", label: "Pet Accessories" },
          { id: "avatar", label: "Avatar Borders" },
          { id: "theme", label: "UI Themes" }
        ] as const).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 rounded-lg transition-all cursor-pointer ${
              activeTab === tab.id ? "bg-slate-900 text-cyan-400" : "text-slate-450 hover:text-slate-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => {
          const isOwned = purchasedItems.includes(item.id);
          const isEquippedTheme = equippedTheme === item.id;
          
          return (
            <div
              key={item.id}
              className={`glass-card p-6 rounded-3xl border flex flex-col justify-between relative overflow-hidden ${
                isEquippedTheme ? "border-cyan-500 bg-cyan-950/5" : "border-slate-800"
              }`}
            >
              {isEquippedTheme && (
                <span className="absolute top-0 right-6 transform -translate-y-1/2 px-2.5 py-0.5 rounded-full bg-cyan-500 text-slate-950 text-[9px] font-black uppercase tracking-wider">
                  Equipped
                </span>
              )}

              <div>
                {/* Visual Icon Box */}
                <div className="w-14 h-14 rounded-2xl bg-slate-950/60 border border-slate-900/80 flex items-center justify-center text-3xl mb-4 shadow-inner">
                  {item.icon}
                </div>

                <h3 className="font-extrabold text-sm sm:text-base text-slate-150">{item.name}</h3>
                <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">{item.category}</span>
                
                <p className="text-xs text-slate-400 leading-relaxed mt-3.5">{item.description}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-900/60 flex items-center justify-between">
                {/* Price or Owned status */}
                <div>
                  {isOwned ? (
                    <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest flex items-center gap-1">
                      <Check size={12} /> Owned
                    </span>
                  ) : (
                    <span className="text-xs text-yellow-400 font-extrabold flex items-center gap-1">
                      <Coins size={13} /> {item.price} Coins
                    </span>
                  )}
                </div>

                {/* Buy / Equip Button */}
                <button
                  onClick={() => handlePurchase(item)}
                  disabled={isEquippedTheme}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    isEquippedTheme
                      ? "bg-slate-950 border border-slate-900 text-slate-500 cursor-not-allowed"
                      : isOwned
                      ? "bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/20"
                      : "bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800"
                  }`}
                >
                  {isEquippedTheme ? "Active" : isOwned ? "Equip" : "Buy Item"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
