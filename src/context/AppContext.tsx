"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

// Types
export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  priority: "High" | "Medium" | "Low";
  status: "Todo" | "In Progress" | "Completed";
  deadline: string;
  estTime: number; // in hours
  category: string;
  subtasks: SubTask[];
  notes?: string;
}

export interface Habit {
  id: string;
  name: string;
  streak: number;
  longestStreak: number;
  completionHistory: string[]; // array of ISO dates "YYYY-MM-DD"
  category: string;
}

export interface Battle {
  id: string;
  opponentName: string;
  opponentLevel: number;
  opponentAvatar: string;
  challengeText: string;
  myProgress: number; // 0 to 100
  opponentProgress: number; // 0 to 100
  xpPrize: number;
  coinPrize: number;
  timeLeft: number; // in seconds
  status: "active" | "won" | "lost";
}

export interface AccessoryPlacement {
  id: string;
  x: number;
  y: number;
  scale: number;
}

export interface Pet {
  name: string;
  level: number;
  xp: number;
  type: "Flamelet" | "Aquasprite" | "Leafy";
  status: "Happy" | "Active" | "Sleepy";
  accessory: string | null;
  happiness: number;
  strength: number;
  equippedHead: AccessoryPlacement | null;
  equippedFace: AccessoryPlacement | null;
  equippedHand: AccessoryPlacement | null;
}

export interface Message {
  sender: "user" | "coach";
  text: string;
  timestamp: Date;
}

interface AppContextType {
  username: string;
  userEmail: string;
  isAuthenticated: boolean;
  level: number;
  xp: number;
  coins: number;
  streak: number;
  focusTime: number; // minutes
  focusScore: number; // 0 to 100
  tasks: Task[];
  habits: Habit[];
  battles: Battle[];
  pet: Pet;
  purchasedItems: string[];
  equippedTheme: string;
  chatHistory: Message[];
  dailyMissions: { id: string; text: string; xp: number; coins: number; completed: boolean }[];
  petMultiplier: number;
  
  // Live global stats
  globalLogins: number;
  globalBattles: number;
  globalFocusMinutes: number;
  userId: string | null;
  
  // Actions
  login: (email: string) => void;
  logout: () => void;
  addTask: (task: Omit<Task, "id">) => void;
  updateTaskStatus: (id: string, status: Task["status"]) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  addHabit: (name: string, category: string) => void;
  toggleHabit: (id: string, dateStr: string) => void;
  deleteHabit: (id: string) => void;
  startBattle: (challengeText: string) => void;
  progressBattle: (id: string, percent: number) => void;
  addXP: (amount: number) => void;
  addCoins: (amount: number) => void;
  addFocusMinutes: (minutes: number) => void;
  buyMarketplaceItem: (itemId: string, cost: number) => boolean;
  equipTheme: (themeName: string) => void;
  sendMessageToCoach: (text: string) => void;
  completeMission: (id: string) => void;
  renamePet: (name: string) => void;
  equipPetAccessory: (acc: string | null) => void;
  updatePetPlacement: (slot: "head" | "face" | "hand", placement: AccessoryPlacement | null) => void;
  petPet: () => void;
  incrementGlobalLogins: () => void;
  joinLiveMatchmakingQueue: (challengeText: string) => Promise<any>;
  triggerMockOpponentProgress: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("ProcrastinatorHero");
  const [userEmail, setUserEmail] = useState("");
  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(0);
  const [coins, setCoins] = useState(100);
  const [streak, setStreak] = useState(3);
  const [focusTime, setFocusTime] = useState(45); // start with 45 focus minutes
  const [focusScore, setFocusScore] = useState(72);
  const [userId, setUserId] = useState<string | null>(null);
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [battles, setBattles] = useState<Battle[]>([]);
  const [pet, setPet] = useState<Pet>({
    name: "Tago",
    level: 1,
    xp: 20,
    type: "Flamelet",
    status: "Active",
    accessory: null,
    happiness: 85,
    strength: 15,
    equippedHead: null,
    equippedFace: null,
    equippedHand: null
  });
  const [purchasedItems, setPurchasedItems] = useState<string[]>(["Default Theme"]);
  const [equippedTheme, setEquippedTheme] = useState("Default Theme");
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  
  const [dailyMissions, setDailyMissions] = useState([
    { id: "m1", text: "Complete 2 high-priority tasks", xp: 40, coins: 20, completed: false },
    { id: "m2", text: "Complete a 25-min Pomodoro session", xp: 30, coins: 15, completed: false },
    { id: "m3", text: "Check off 3 habits today", xp: 50, coins: 25, completed: false },
  ]);

  const [globalLogins, setGlobalLogins] = useState(0);
  const [globalBattles, setGlobalBattles] = useState(0);
  const [globalFocusMinutes, setGlobalFocusMinutes] = useState(0);

  // Load from local storage
  useEffect(() => {
    const savedGlobalLogins = Number(localStorage.getItem("pa_global_logins")) || 0;
    const savedGlobalBattles = Number(localStorage.getItem("pa_global_battles")) || 0;
    const savedGlobalFocusMins = Number(localStorage.getItem("pa_global_focus_minutes")) || 0;
    setGlobalLogins(savedGlobalLogins);
    setGlobalBattles(savedGlobalBattles);
    setGlobalFocusMinutes(savedGlobalFocusMins);

    const savedAuth = localStorage.getItem("pa_auth");
    if (savedAuth) {
      setIsAuthenticated(true);
      setUsername(localStorage.getItem("pa_username") || "ProductiveNinja");
      setUserEmail(localStorage.getItem("pa_email") || "");
    }

    setLevel(Number(localStorage.getItem("pa_level")) || 1);
    setXp(Number(localStorage.getItem("pa_xp")) || 0);
    setCoins(Number(localStorage.getItem("pa_coins")) || 100);
    setStreak(Number(localStorage.getItem("pa_streak")) || 3);
    setFocusTime(Number(localStorage.getItem("pa_focustime")) || 45);
    setFocusScore(Number(localStorage.getItem("pa_focusscore")) || 72);
    setEquippedTheme(localStorage.getItem("pa_theme") || "Default Theme");
    
    const savedTasks = localStorage.getItem("pa_tasks");
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    } else {
      setTasks([
        { id: "1", title: "Complete landing page layout", priority: "High", status: "In Progress", deadline: "2026-07-05", estTime: 3, category: "Work", subtasks: [{ id: "s1", title: "Implement hero design", completed: true }, { id: "s2", title: "Add pricing tiers", completed: false }] },
        { id: "2", title: "Review marketing copy", priority: "Medium", status: "Todo", deadline: "2026-07-06", estTime: 1.5, category: "Marketing", subtasks: [] },
        { id: "3", title: "Meditate for 10 minutes", priority: "Low", status: "Completed", deadline: "2026-07-04", estTime: 0.2, category: "Health", subtasks: [] }
      ]);
    }
    
    const savedHabits = localStorage.getItem("pa_habits");
    if (savedHabits) {
      setHabits(JSON.parse(savedHabits));
    } else {
      setHabits([
        { id: "h1", name: "Read 15 Pages", streak: 5, longestStreak: 12, completionHistory: ["2026-07-03", "2026-07-02", "2026-07-01"], category: "Mind" },
        { id: "h2", name: "Drink 3L Water", streak: 2, longestStreak: 8, completionHistory: ["2026-07-03", "2026-07-02"], category: "Body" }
      ]);
    }
    
    const savedBattles = localStorage.getItem("pa_battles");
    if (savedBattles) {
      setBattles(JSON.parse(savedBattles));
    } else {
      setBattles([
        { id: "b1", opponentName: "FocusMaster99", opponentLevel: 8, opponentAvatar: "🧙‍♂️", challengeText: "Complete 3 study Pomodoros", myProgress: 33, opponentProgress: 66, xpPrize: 150, coinPrize: 50, timeLeft: 3600 * 3, status: "active" }
      ]);
    }
    
    const savedPet = localStorage.getItem("pa_pet");
    if (savedPet) setPet(JSON.parse(savedPet));

    const savedPurchases = localStorage.getItem("pa_purchases");
    if (savedPurchases) setPurchasedItems(JSON.parse(savedPurchases));

    const savedMissions = localStorage.getItem("pa_missions");
    if (savedMissions) setDailyMissions(JSON.parse(savedMissions));

    const savedChat = localStorage.getItem("pa_chat");
    if (savedChat) {
      const parsed = JSON.parse(savedChat);
      setChatHistory(parsed.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) })));
    } else {
      setChatHistory([
        {
          sender: "coach",
          text: "Hello! I am Arena Coach. I analyze your tasks, streaks, and focus metrics to help you crush procrastination. What's holding you back today?",
          timestamp: new Date()
        }
      ]);
    }
  }, []);

  // Supabase Auth session loader
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;
    
    const loadDbSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const uId = session.user.id;
        setUserId(uId);
        setIsAuthenticated(true);
        setUserEmail(session.user.email || "");

        try {
          // 1. Fetch profile
          const { data: profile } = await supabase.from('profiles').select('*').eq('id', uId).single();
          if (profile) {
            setUsername(profile.username || session.user.email?.split("@")[0] || "Player");
            setLevel(profile.level || 1);
            setXp(profile.xp || 0);
            setCoins(profile.coins || 0);
            setStreak(profile.streak || 0);
            setFocusTime(profile.focus_time || 0);
            setFocusScore(profile.focus_score || 70);
          }

          // 2. Fetch pet
          const { data: petData } = await supabase.from('pets').select('*').eq('user_id', uId).single();
          if (petData) {
            setPet({
              name: petData.name || "Tago",
              level: petData.level || 1,
              xp: petData.xp || 0,
              type: (petData.type || "Flamelet") as any,
              status: (petData.status || "Active") as any,
              equippedHead: petData.equipped_head,
              equippedFace: petData.equipped_face,
              equippedHand: petData.equipped_hand,
              happiness: 80,
              strength: 10,
              accessory: null
            });
          }

          // 3. Fetch tasks
          const { data: dbTasks } = await supabase.from('tasks').select('*').eq('user_id', uId);
          if (dbTasks && dbTasks.length > 0) {
            setTasks(dbTasks.map((t: any) => ({
              id: t.id,
              title: t.title,
              priority: t.priority,
              status: t.status,
              deadline: t.deadline || "",
              estTime: Number(t.est_time) || 0,
              category: t.category || "Work",
              subtasks: t.subtasks || []
            })));
          } else {
            setTasks([]);
          }

          // 4. Fetch habits
          const { data: dbHabits } = await supabase.from('habits').select('*').eq('user_id', uId);
          if (dbHabits && dbHabits.length > 0) {
            setHabits(dbHabits.map((h: any) => ({
              id: h.id,
              name: h.name,
              streak: h.streak,
              longestStreak: h.longest_streak,
              completionHistory: h.completion_history || [],
              category: h.category || "Mind"
            })));
          } else {
            setHabits([]);
          }

          // 5. Clear mock battles for real users
          setBattles([]);
        } catch (err) {
          console.error("Error auto-loading session from database:", err);
        }
      }
    };

    loadDbSession();
  }, [isAuthenticated]);

  // Supabase Auth state change listener
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUserId(session.user.id);
        if (!isAuthenticated) {
          await login(session.user.email || "");
        }
      } else {
        setUserId(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [isAuthenticated]);

  // Live real-time battles database listener
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase || !isAuthenticated) return;
    
    const battleChannel = supabase
      .channel("live-battles")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "battles" },
        (payload) => {
          const newRecord = payload.new as any;
          if (!newRecord) return;
          
          const isP1 = newRecord.player_1_username.toLowerCase() === username.toLowerCase();
          const isP2 = newRecord.player_2_username.toLowerCase() === username.toLowerCase();
          
          if (isP1 || isP2) {
            setBattles((prev) => {
              const oppName = isP1 ? newRecord.player_2_username : newRecord.player_1_username;
              const oppAvatar = isP1 ? newRecord.player_2_avatar : newRecord.player_1_avatar;
              const oppLevel = isP1 ? newRecord.player_2_level : newRecord.player_1_level;
              
              const myProg = isP1 ? newRecord.player_1_progress : newRecord.player_2_progress;
              const oppProg = isP1 ? newRecord.player_2_progress : newRecord.player_1_progress;
              
              let nextStatus: Battle["status"] = "active";
              if (newRecord.status === "p1_won") {
                nextStatus = isP1 ? "won" : "lost";
              } else if (newRecord.status === "p2_won") {
                nextStatus = isP1 ? "lost" : "won";
              }
              
              const mappedBattle: Battle = {
                id: newRecord.id,
                opponentName: oppName,
                opponentLevel: oppLevel,
                opponentAvatar: oppAvatar,
                challengeText: newRecord.challenge_text,
                myProgress: myProg,
                opponentProgress: oppProg,
                xpPrize: newRecord.xp_prize,
                coinPrize: newRecord.coin_prize,
                timeLeft: newRecord.time_left,
                status: nextStatus
              };
              
              const exists = prev.some(b => b.id === mappedBattle.id);
              if (exists) {
                return prev.map(b => b.id === mappedBattle.id ? mappedBattle : b);
              } else {
                return [mappedBattle, ...prev];
              }
            });
          }
        }
      )
      .subscribe();
      
    return () => {
      if (supabase) {
        supabase.removeChannel(battleChannel);
      }
    };
  }, [isAuthenticated, username]);

  // Save changes helper
  const saveToStorage = (key: string, value: any) => {
    localStorage.setItem(key, typeof value === "string" ? value : JSON.stringify(value));
  };

  // Helper to write profile changes to Supabase in real-time
  const updateProfileInDb = async (updates: any) => {
    if (!isSupabaseConfigured || !supabase) return;
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      await supabase.from('profiles').update(updates).eq('id', session.user.id);
    }
  };

  // Helper to write pet changes to Supabase
  const updatePetInDb = async (updates: any) => {
    if (!isSupabaseConfigured || !supabase) return;
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      await supabase.from('pets').update(updates).eq('user_id', session.user.id);
    }
  };

  const incrementGlobalLogins = () => {
    setGlobalLogins((prev) => {
      const next = prev + 1;
      localStorage.setItem("pa_global_logins", next.toString());
      return next;
    });
  };

  const login = async (email: string) => {
    let defaultUsername = email.split("@")[0];
    setIsAuthenticated(true);
    setUserEmail(email);
    saveToStorage("pa_auth", "true");
    saveToStorage("pa_email", email);

    if (isSupabaseConfigured && supabase) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const uId = session.user.id;
          setUserId(uId);

          const realName = session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.user_metadata?.username || defaultUsername;
          setUsername(realName);
          saveToStorage("pa_username", realName);

          // 1. Fetch or create profile
          let { data: profile } = await supabase.from('profiles').select('*').eq('id', uId).single();
          if (!profile) {
            // New user registration: their data starts at 0 (Level 1, XP 0, Coins 0, Streaks 0, Focus Time 0)
            const newProfile = {
              id: uId,
              username: realName,
              level: 1,
              xp: 0,
              coins: 0,
              streak: 0,
              focus_time: 0,
              focus_score: 70
            };
            await supabase.from('profiles').insert(newProfile);
            profile = newProfile;
          }

          // 2. Fetch or create pet
          let { data: petData } = await supabase.from('pets').select('*').eq('user_id', uId).single();
          if (!petData) {
            const newPet = {
              user_id: uId,
              name: "Tago",
              level: 1,
              xp: 0,
              type: "Flamelet",
              status: "Active",
              equipped_head: null,
              equipped_face: null,
              equipped_hand: null
            };
            await supabase.from('pets').insert(newPet);
            petData = newPet;
          }

          // 3. Load stats
          const dbLevel = profile.level || 1;
          const dbXp = profile.xp || 0;
          const dbCoins = profile.coins || 0;
          const dbStreak = profile.streak || 0;
          const dbFocusTime = profile.focus_time || 0;
          const dbFocusScore = profile.focus_score || 70;

          setLevel(dbLevel);
          setXp(dbXp);
          setCoins(dbCoins);
          setStreak(dbStreak);
          setFocusTime(dbFocusTime);
          setFocusScore(dbFocusScore);

          saveToStorage("pa_level", dbLevel.toString());
          saveToStorage("pa_xp", dbXp.toString());
          saveToStorage("pa_coins", dbCoins.toString());
          saveToStorage("pa_streak", dbStreak.toString());
          saveToStorage("pa_focustime", dbFocusTime.toString());
          saveToStorage("pa_focusscore", dbFocusScore.toString());

          const mappedPet = {
            name: petData.name || "Tago",
            level: petData.level || 1,
            xp: petData.xp || 0,
            type: (petData.type || "Flamelet") as any,
            status: (petData.status || "Active") as any,
            equippedHead: petData.equipped_head,
            equippedFace: petData.equipped_face,
            equippedHand: petData.equipped_hand,
            happiness: 80,
            strength: 10,
            accessory: null
          };
          setPet(mappedPet);
          saveToStorage("pa_pet", mappedPet);

          // 4. Fetch tasks
          const { data: dbTasks } = await supabase.from('tasks').select('*').eq('user_id', uId);
          if (dbTasks && dbTasks.length > 0) {
            const mappedTasks = dbTasks.map((t: any) => ({
              id: t.id,
              title: t.title,
              priority: t.priority,
              status: t.status,
              deadline: t.deadline || "",
              estTime: Number(t.est_time) || 0,
              category: t.category || "Work",
              subtasks: t.subtasks || []
            }));
            setTasks(mappedTasks);
            saveToStorage("pa_tasks", mappedTasks);
          } else {
            setTasks([]);
            saveToStorage("pa_tasks", []);
          }

          // 5. Fetch habits
          const { data: dbHabits } = await supabase.from('habits').select('*').eq('user_id', uId);
          if (dbHabits && dbHabits.length > 0) {
            const mappedHabits = dbHabits.map((h: any) => ({
              id: h.id,
              name: h.name,
              streak: h.streak,
              longestStreak: h.longest_streak,
              completionHistory: h.completion_history || [],
              category: h.category || "Mind"
            }));
            setHabits(mappedHabits);
            saveToStorage("pa_habits", mappedHabits);
          } else {
            setHabits([]);
            saveToStorage("pa_habits", []);
          }
        }
      } catch (err) {
        console.error("Error loading user data from database:", err);
      }
    } else {
      setLevel(Number(localStorage.getItem("pa_level")) || 1);
      setXp(Number(localStorage.getItem("pa_xp")) || 0);
      setCoins(Number(localStorage.getItem("pa_coins")) || 100);
      setStreak(Number(localStorage.getItem("pa_streak")) || 3);
      setFocusTime(Number(localStorage.getItem("pa_focustime")) || 45);
      setFocusScore(Number(localStorage.getItem("pa_focusscore")) || 72);
    }
    
    incrementGlobalLogins();
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserEmail("");
    setUserId(null);
    localStorage.removeItem("pa_auth");
    localStorage.removeItem("pa_email");

    setTasks([]);
    setHabits([]);
    setCoins(100);
    setLevel(1);
    setXp(0);
    setStreak(0);
    setFocusTime(0);
    setFocusScore(70);
  };

  // XP and Level Up progression
  const addXP = (amount: number) => {
    setXp((prevXp) => {
      const nextXp = prevXp + amount;
      const xpNeeded = level * 100;
      if (nextXp >= xpNeeded) {
        // Level up!
        setLevel((prevLevel) => {
          const nextLevel = prevLevel + 1;
          saveToStorage("pa_level", nextLevel.toString());
          updateProfileInDb({ level: nextLevel });
          
          // Evolve pet at lvl 5 and 15
          setPet((prevPet) => {
            let nextPetType = prevPet.type;
            if (nextLevel === 5) nextPetType = "Leafy";
            if (nextLevel === 15) nextPetType = "Aquasprite";
            const updatedPet = { ...prevPet, level: prevPet.level + 1, type: nextPetType };
            saveToStorage("pa_pet", updatedPet);
            updatePetInDb({ level: updatedPet.level, type: updatedPet.type });
            return updatedPet;
          });

          return nextLevel;
        });
        const remainder = nextXp - xpNeeded;
        saveToStorage("pa_xp", remainder.toString());
        updateProfileInDb({ xp: remainder });
        return remainder;
      }
      saveToStorage("pa_xp", nextXp.toString());
      updateProfileInDb({ xp: nextXp });
      return nextXp;
    });
  };

  const addCoins = (amount: number) => {
    setCoins((prev) => {
      const next = prev + amount;
      saveToStorage("pa_coins", next.toString());
      updateProfileInDb({ coins: next });
      return next;
    });
  };

  const addFocusMinutes = (minutes: number) => {
    setFocusTime((prev) => {
      const next = prev + minutes;
      saveToStorage("pa_focustime", next.toString());
      updateProfileInDb({ focus_time: next });
      return next;
    });

    setGlobalFocusMinutes((prev) => {
      const next = prev + minutes;
      localStorage.setItem("pa_global_focus_minutes", next.toString());
      return next;
    });

    // Award 2 XP per minute focused
    addXP(minutes * 2);
    // Award 0.5 Coins per minute focused
    addCoins(Math.round(minutes * 0.5));
    // Improve focus score
    setFocusScore((prev) => {
      const next = Math.min(100, prev + Math.ceil(minutes / 10));
      saveToStorage("pa_focusscore", next.toString());
      updateProfileInDb({ focus_score: next });
      return next;
    });

    // Update Pet state
    setPet((prev) => {
      const updated = {
        ...prev,
        xp: prev.xp + minutes,
        status: "Happy" as const
      };
      saveToStorage("pa_pet", updated);
      updatePetInDb({ xp: updated.xp, status: updated.status });
      return updated;
    });

    // Check mission completed
    if (minutes >= 25) {
      completeMission("m2");
    }

    // Progress active battles
    const activeBattle = battles.find(b => b.status === "active");
    if (activeBattle) {
      progressBattle(activeBattle.id, minutes * 3.3);
    }
  };

  // Task Actions
  const addTask = async (task: Omit<Task, "id">) => {
    const newTask: Task = {
      ...task,
      id: Math.random().toString(36).substring(2, 9)
    };
    setTasks((prev) => {
      const updated = [newTask, ...prev];
      saveToStorage("pa_tasks", updated);
      return updated;
    });

    if (isSupabaseConfigured && supabase) {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await supabase.from('tasks').insert({
          id: newTask.id,
          user_id: session.user.id,
          title: newTask.title,
          priority: newTask.priority,
          status: newTask.status,
          deadline: newTask.deadline || null,
          est_time: newTask.estTime,
          category: newTask.category,
          subtasks: newTask.subtasks
        });
      }
    }
  };

  const updateTaskStatus = async (id: string, status: Task["status"]) => {
    setTasks((prev) => {
      const updated = prev.map((t) => {
        if (t.id === id) {
          // If task completed, trigger gamified reward
          if (status === "Completed" && t.status !== "Completed") {
            addXP(50);
            addCoins(10);
            
            // Sync with Pet
            setPet(p => {
              const updatedPet = { ...p, status: "Happy" as const };
              saveToStorage("pa_pet", updatedPet);
              updatePetInDb({ status: "Happy" });
              return updatedPet;
            });

            // Check missions
            const highPriTasks = prev.filter(x => x.priority === "High" && x.status === "Completed");
            if (t.priority === "High" && highPriTasks.length >= 1) {
              completeMission("m1");
            }

            // Progress active battles
            const activeBattle = battles.find(b => b.status === "active");
            if (activeBattle) {
              progressBattle(activeBattle.id, 25);
            }
          }
          return { ...t, status };
        }
        return t;
      });
      saveToStorage("pa_tasks", updated);
      return updated;
    });

    if (isSupabaseConfigured && supabase) {
      await supabase.from('tasks').update({ status }).eq('id', id);
    }
  };

  const updateTask = async (updatedTask: Task) => {
    setTasks((prev) => {
      const updated = prev.map((t) => (t.id === updatedTask.id ? updatedTask : t));
      saveToStorage("pa_tasks", updated);
      return updated;
    });

    if (isSupabaseConfigured && supabase) {
      await supabase.from('tasks').update({
        title: updatedTask.title,
        priority: updatedTask.priority,
        status: updatedTask.status,
        deadline: updatedTask.deadline || null,
        est_time: updatedTask.estTime,
        category: updatedTask.category,
        subtasks: updatedTask.subtasks
      }).eq('id', updatedTask.id);
    }
  };

  const deleteTask = async (id: string) => {
    setTasks((prev) => {
      const updated = prev.filter((t) => t.id !== id);
      saveToStorage("pa_tasks", updated);
      return updated;
    });

    if (isSupabaseConfigured && supabase) {
      await supabase.from('tasks').delete().eq('id', id);
    }
  };

  // Habit Actions
  const addHabit = async (name: string, category: string) => {
    const newHabit: Habit = {
      id: Math.random().toString(36).substring(2, 9),
      name,
      streak: 0,
      longestStreak: 0,
      completionHistory: [],
      category
    };
    setHabits((prev) => {
      const updated = [...prev, newHabit];
      saveToStorage("pa_habits", updated);
      return updated;
    });

    if (isSupabaseConfigured && supabase) {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await supabase.from('habits').insert({
          id: newHabit.id,
          user_id: session.user.id,
          name: newHabit.name,
          streak: newHabit.streak,
          longest_streak: newHabit.longestStreak,
          completion_history: newHabit.completionHistory,
          category: newHabit.category
        });
      }
    }
  };

  const toggleHabit = async (id: string, dateStr: string) => {
    let streakCount = 0;
    let longest = 0;
    let history: string[] = [];

    setHabits((prev) => {
      const updated = prev.map((h) => {
        if (h.id === id) {
          const completed = h.completionHistory.includes(dateStr);
          history = [...h.completionHistory];
          streakCount = h.streak;
          
          if (completed) {
            history = history.filter((d) => d !== dateStr);
            streakCount = Math.max(0, streakCount - 1);
          } else {
            history.push(dateStr);
            streakCount += 1;
            // Award XP/Coins for habit completion
            addXP(20);
            addCoins(5);

            // Progress active battles
            const activeBattle = battles.find(b => b.status === "active");
            if (activeBattle) {
              progressBattle(activeBattle.id, 15);
            }
          }
          
          longest = Math.max(h.longestStreak, streakCount);
          return {
            ...h,
            completionHistory: history,
            streak: streakCount,
            longestStreak: longest
          };
        }
        return h;
      });
      saveToStorage("pa_habits", updated);
      
      // Daily mission check for 3 habits completed today
      const todayCount = updated.filter(h => h.completionHistory.includes(dateStr)).length;
      if (todayCount >= 3) {
        completeMission("m3");
      }
      return updated;
    });

    if (isSupabaseConfigured && supabase) {
      await supabase.from('habits').update({
        streak: streakCount,
        longest_streak: longest,
        completion_history: history
      }).eq('id', id);
    }
  };

  const deleteHabit = async (id: string) => {
    setHabits((prev) => {
      const updated = prev.filter((h) => h.id !== id);
      saveToStorage("pa_habits", updated);
      return updated;
    });

    if (isSupabaseConfigured && supabase) {
      await supabase.from('habits').delete().eq('id', id);
    }
  };

  // Battles Actions
  const startBattle = (challengeText: string) => {
    const opponents = [
      { name: "ProcrastinationSlayer", level: 4, avatar: "🧙‍♂️" },
      { name: "DeepWorkWarrior", level: 9, avatar: "🥷" },
      { name: "FlowStateFanatic", level: 12, avatar: "🤖" },
      { name: "FocusDragon", level: 25, avatar: "🐉" },
    ];
    const opp = opponents[Math.floor(Math.random() * opponents.length)];
    
    const newBattle: Battle = {
      id: Math.random().toString(36).substring(2, 9),
      opponentName: opp.name,
      opponentLevel: opp.level,
      opponentAvatar: opp.avatar,
      challengeText,
      myProgress: 0,
      opponentProgress: 0,
      xpPrize: 200,
      coinPrize: 75,
      timeLeft: 12 * 3600, // 12 hours
      status: "active"
    };

    setBattles((prev) => {
      const updated = [newBattle, ...prev];
      saveToStorage("pa_battles", updated);
      return updated;
    });

    setGlobalBattles((prev) => {
      const next = prev + 1;
      localStorage.setItem("pa_global_battles", next.toString());
      return next;
    });
  };

  const progressBattle = async (id: string, percent: number) => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: battleData, error } = await supabase
          .from("battles")
          .select("*")
          .eq("id", id)
          .single();
          
        if (error || !battleData) return;
        
        const isP1 = battleData.player_1_username.toLowerCase() === username.toLowerCase();
        const currentProg = isP1 ? battleData.player_1_progress : battleData.player_2_progress;
        const nextProg = Math.min(100, currentProg + percent);
        
        let updates: any = {};
        if (isP1) {
          updates.player_1_progress = nextProg;
          if (nextProg >= 100 && battleData.status === "active") {
            updates.status = "p1_won";
            addXP(battleData.xp_prize);
            addCoins(battleData.coin_prize);
          }
        } else {
          updates.player_2_progress = nextProg;
          if (nextProg >= 100 && battleData.status === "active") {
            updates.status = "p2_won";
            addXP(battleData.xp_prize);
            addCoins(battleData.coin_prize);
          }
        }
        
        await supabase.from("battles").update(updates).eq("id", id);
      } catch (err) {
        console.error("Error updating live battle progress:", err);
      }
    } else {
      setBattles((prev) => {
        const updated = prev.map((b) => {
          if (b.id === id && b.status === "active") {
            const nextProg = Math.min(100, b.myProgress + percent);
            let nextStatus: Battle["status"] = b.status;
            if (nextProg >= 100) {
              nextStatus = "won";
              addXP(b.xpPrize);
              addCoins(b.coinPrize);
            }
            return { ...b, myProgress: nextProg, status: nextStatus };
          }
          return b;
        });
        saveToStorage("pa_battles", updated);
        return updated;
      });
    }
  };

  const joinLiveMatchmakingQueue = async (challengeText: string): Promise<any> => {
    if (!isSupabaseConfigured || !supabase) {
      return null;
    }
    
    const myUid = userId || "guest_" + Math.random().toString(36).substring(2, 9);
    const myAvatar = pet.type === "Flamelet" ? "🔥" : pet.type === "Leafy" ? "🍃" : "💧";
    
    // 1. Join matchmaking queue
    await supabase.from("matchmaking_queue").insert({
      user_id: myUid,
      username,
      level,
      avatar: myAvatar
    });
    
    // 2. Scan queue for another player
    const { data: queueEntries, error: scanError } = await supabase
      .from("matchmaking_queue")
      .select("*")
      .neq("user_id", myUid)
      .order("created_at", { ascending: true })
      .limit(1);
       
    if (scanError) {
      console.error("Matchmaking scan error:", scanError);
      return null;
    }
    
    if (queueEntries && queueEntries.length > 0) {
      const rival = queueEntries[0];
      
      // Clean both from queue
      await supabase.from("matchmaking_queue").delete().eq("user_id", myUid);
      await supabase.from("matchmaking_queue").delete().eq("user_id", rival.user_id);
      
      // Create new battle record
      const newBattleId = Math.random().toString(36).substring(2, 9);
      
      const battleObj = {
        id: newBattleId,
        player_1_id: rival.user_id,
        player_1_username: rival.username,
        player_1_avatar: rival.avatar,
        player_1_level: rival.level,
        player_1_progress: 0,
        player_2_id: myUid,
        player_2_username: username,
        player_2_avatar: myAvatar,
        player_2_level: level,
        player_2_progress: 0,
        challenge_text: challengeText,
        xp_prize: 200,
        coin_prize: 75,
        time_left: 12 * 3600,
        status: "active"
      };
      
      const { error: insertError } = await supabase.from("battles").insert(battleObj);
      if (insertError) {
        console.error("Error creating live battle:", insertError);
        return null;
      }
      
      const mapped = {
        id: newBattleId,
        opponentName: rival.username,
        opponentLevel: rival.level,
        opponentAvatar: rival.avatar,
        challengeText,
        myProgress: 0,
        opponentProgress: 0,
        xpPrize: 200,
        coinPrize: 75,
        timeLeft: 12 * 3600,
        status: "active" as const
      };

      setBattles((prev) => [mapped, ...prev]);
      return mapped;
    }
    
    return "waiting";
  };

  const triggerMockOpponentProgress = () => {
    setBattles((prev) => {
      const updated = prev.map((b) => {
        if (b.status === "active") {
          const addVal = Math.floor(Math.random() * 15) + 5;
          const nextProg = Math.min(100, b.opponentProgress + addVal);
          let nextStatus: Battle["status"] = b.status;
          if (nextProg >= 100) {
            nextStatus = "lost";
          }
          return { ...b, opponentProgress: nextProg, status: nextStatus };
        }
        return b;
      });
      saveToStorage("pa_battles", updated);
      return updated;
    });
  };

  // Missions
  const completeMission = (id: string) => {
    setDailyMissions((prev) => {
      const updated = prev.map((m) => {
        if (m.id === id && !m.completed) {
          addXP(m.xp);
          addCoins(m.coins);
          return { ...m, completed: true };
        }
        return m;
      });
      saveToStorage("pa_missions", updated);
      return updated;
    });
  };

  // Pet Customization
  const renamePet = (name: string) => {
    setPet((prev) => {
      const updated = { ...prev, name };
      saveToStorage("pa_pet", updated);
      return updated;
    });
    updatePetInDb({ name });
  };

  const equipPetAccessory = (acc: string | null) => {
    setPet((prev) => {
      const updated = { ...prev, accessory: acc };
      saveToStorage("pa_pet", updated);
      return updated;
    });
  };

  const updatePetPlacement = (slot: "head" | "face" | "hand", placement: AccessoryPlacement | null) => {
    setPet((prev) => {
      const updated = { ...prev };
      if (slot === "head") updated.equippedHead = placement;
      if (slot === "face") updated.equippedFace = placement;
      if (slot === "hand") updated.equippedHand = placement;
      saveToStorage("pa_pet", updated);
      return updated;
    });
    
    if (slot === "head") updatePetInDb({ equipped_head: placement });
    else if (slot === "face") updatePetInDb({ equipped_face: placement });
    else if (slot === "hand") updatePetInDb({ equipped_hand: placement });
  };

  const petPet = () => {
    let newPetState: Pet | null = null;
    setPet((prev) => {
      const nextHappiness = Math.min(100, (prev.happiness || 80) + 5);
      const nextXp = prev.xp + 10;
      const petLvl = prev.level;
      const xpNeeded = petLvl * 100;
      
      let nextLvl = petLvl;
      let finalXp = nextXp;
      if (nextXp >= xpNeeded) {
        nextLvl += 1;
        finalXp = nextXp - xpNeeded;
      }
      
      const updated = {
        ...prev,
        happiness: nextHappiness,
        level: nextLvl,
        xp: finalXp,
        status: "Happy" as const,
        strength: Math.round(nextLvl * 1.5 + finalXp / 50)
      };
      saveToStorage("pa_pet", updated);
      newPetState = updated;
      return updated;
    });
    
    if (newPetState) {
      const p = newPetState as Pet;
      updatePetInDb({
        happiness: p.happiness,
        level: p.level,
        xp: p.xp,
        status: p.status,
        strength: p.strength
      });
    }
    // Give user 10 user XP
    addXP(10);
  };

  // Marketplace
  const buyMarketplaceItem = (itemId: string, cost: number): boolean => {
    if (coins >= cost && !purchasedItems.includes(itemId)) {
      setCoins((prev) => {
        const next = prev - cost;
        saveToStorage("pa_coins", next.toString());
        return next;
      });
      setPurchasedItems((prev) => {
        const updated = [...prev, itemId];
        saveToStorage("pa_purchases", updated);
        return updated;
      });
      return true;
    }
    return false;
  };

  const equipTheme = (themeName: string) => {
    if (purchasedItems.includes(themeName) || themeName === "Default Theme") {
      setEquippedTheme(themeName);
      saveToStorage("pa_theme", themeName);
    }
  };

  // AI Coach Chat Simulation
  const sendMessageToCoach = (text: string) => {
    const newMsg: Message = { sender: "user", text, timestamp: new Date() };
    
    // Quick coach simulation logic based on keywords
    let responseText = "That's interesting! Let's schedule a focus block to deal with that procrastination trigger.";
    
    const lcText = text.toLowerCase();
    const completedTasksCount = tasks.filter(t => t.status === "Completed").length;
    const pendingTasksCount = tasks.filter(t => t.status !== "Completed").length;
    
    if (lcText.includes("distracted") || lcText.includes("youtube") || lcText.includes("social media") || lcText.includes("phone")) {
      responseText = `I notice you struggle with distractions. Based on your stats, your focus score is ${focusScore}%. I recommend launching a 25-minute Pomodoro in Focus Mode with 'Cafe Ambient Noise' and enabling our Distraction Website Blocker. Let's make an agreement: no social media until you finish 1 high-priority task.`;
    } else if (lcText.includes("lazy") || lcText.includes("tired") || lcText.includes("start")) {
      responseText = `Getting started is always the hardest hurdle. Try the 5-Minute Rule: commit to focusing on "${tasks[0]?.title || 'your first task'}" for just 5 minutes. Usually, once you cross the friction point, momentum takes over. Launch the Pomodoro timer now!`;
    } else if (lcText.includes("streak") || lcText.includes("habit")) {
      responseText = `You currently have a ${streak}-day productivity streak! Keep it going. Complete your daily habits today to keep your Tamagotchi pet ${pet.name} active and happy. Procrastinating today will make ${pet.name} sleepy.`;
    } else if (lcText.includes("battle") || lcText.includes("compete")) {
      responseText = `Competition is highly motivating for your profile! You should challenge a productive rival in the 'Productivity Battles' room. Complete your current tasks to drive up your battle progress bar and claim that XP and Coins prize.`;
    } else if (lcText.includes("stats") || lcText.includes("progress") || lcText.includes("how am i doing")) {
      responseText = `Reviewing your logs: You have completed ${completedTasksCount} tasks, logged ${focusTime} focus minutes, and have ${pendingTasksCount} pending tasks. Your Focus Score stands at ${focusScore}%. You are level ${level} and need ${level * 100 - xp} XP to level up. You're doing solid, but let's clear out those pending tasks!`;
    } else if (lcText.includes("schedule") || lcText.includes("plan") || lcText.includes("todo")) {
      responseText = `Here is a custom plan for you: 
1. Move "${tasks.find(t => t.priority === "High")?.title || 'your highest priority task'}" to 'In Progress' and finish it first.
2. Log a 50-minute Pomodoro session with Forest soundscape.
3. Check off at least 2 habits.
This will secure you around 150 XP, 40 Coins, and boost your pet's happiness!`;
    }

    const coachMsg: Message = { sender: "coach", text: responseText, timestamp: new Date() };
    
    setChatHistory((prev) => {
      const updated = [...prev, newMsg, coachMsg];
      saveToStorage("pa_chat", updated);
      return updated;
    });
  };

  const petMultiplier = Math.round((pet.level || 1) * 2 + (pet.happiness || 80) / 10);

  return (
    <AppContext.Provider
      value={{
        username,
        userEmail,
        isAuthenticated,
        level,
        xp,
        coins,
        streak,
        focusTime,
        focusScore,
        tasks,
        habits,
        battles,
        pet,
        purchasedItems,
        equippedTheme,
        chatHistory,
        dailyMissions,
        petMultiplier,
        globalLogins,
        globalBattles,
        globalFocusMinutes,
        userId,
        login,
        logout,
        addTask,
        updateTaskStatus,
        updateTask,
        deleteTask,
        addHabit,
        toggleHabit,
        deleteHabit,
        startBattle,
        progressBattle,
        addXP,
        addCoins,
        addFocusMinutes,
        buyMarketplaceItem,
        equipTheme,
        sendMessageToCoach,
        completeMission,
        renamePet,
        equipPetAccessory,
        updatePetPlacement,
        petPet,
        incrementGlobalLogins,
        joinLiveMatchmakingQueue,
        triggerMockOpponentProgress
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
