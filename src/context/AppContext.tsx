"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

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
  triggerMockOpponentProgress: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("ProcrastinatorHero");
  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(0);
  const [coins, setCoins] = useState(100);
  const [streak, setStreak] = useState(3);
  const [focusTime, setFocusTime] = useState(45); // start with 45 focus minutes
  const [focusScore, setFocusScore] = useState(72);
  
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
    const savedLogins = Number(localStorage.getItem("pa_global_logins")) || 0;
    const savedBattles = Number(localStorage.getItem("pa_global_battles")) || 0;
    const savedFocusMins = Number(localStorage.getItem("pa_global_focus_minutes")) || 0;
    setGlobalLogins(savedLogins);
    setGlobalBattles(savedBattles);
    setGlobalFocusMinutes(savedFocusMins);

    const savedAuth = localStorage.getItem("pa_auth");
    if (savedAuth) {
      setIsAuthenticated(true);
      setUsername(localStorage.getItem("pa_username") || "ProductiveNinja");
      setLevel(Number(localStorage.getItem("pa_level")) || 1);
      setXp(Number(localStorage.getItem("pa_xp")) || 0);
      setCoins(Number(localStorage.getItem("pa_coins")) || 100);
      setStreak(Number(localStorage.getItem("pa_streak")) || 3);
      setFocusTime(Number(localStorage.getItem("pa_focustime")) || 45);
      setFocusScore(Number(localStorage.getItem("pa_focusscore")) || 72);
      
      const savedTasks = localStorage.getItem("pa_tasks");
      if (savedTasks) setTasks(JSON.parse(savedTasks));
      
      const savedHabits = localStorage.getItem("pa_habits");
      if (savedHabits) setHabits(JSON.parse(savedHabits));
      
      const savedBattles = localStorage.getItem("pa_battles");
      if (savedBattles) setBattles(JSON.parse(savedBattles));
      
      const savedPet = localStorage.getItem("pa_pet");
      if (savedPet) setPet(JSON.parse(savedPet));

      const savedPurchases = localStorage.getItem("pa_purchases");
      if (savedPurchases) setPurchasedItems(JSON.parse(savedPurchases));

      const savedTheme = localStorage.getItem("pa_theme");
      if (savedTheme) setEquippedTheme(savedTheme);

      const savedMissions = localStorage.getItem("pa_missions");
      if (savedMissions) setDailyMissions(JSON.parse(savedMissions));

      const savedChat = localStorage.getItem("pa_chat");
      if (savedChat) {
        const parsed = JSON.parse(savedChat);
        setChatHistory(parsed.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) })));
      } else {
        // Default greeting
        setChatHistory([
          {
            sender: "coach",
            text: "Hello! I am Arena Coach. I analyze your tasks, streaks, and focus metrics to help you crush procrastination. What's holding you back today?",
            timestamp: new Date()
          }
        ]);
      }
    } else {
      // Mock seed tasks/habits for preview before login if they just want to explore
      setTasks([
        { id: "1", title: "Complete landing page layout", priority: "High", status: "In Progress", deadline: "2026-07-05", estTime: 3, category: "Work", subtasks: [{ id: "s1", title: "Implement hero design", completed: true }, { id: "s2", title: "Add pricing tiers", completed: false }] },
        { id: "2", title: "Review marketing copy", priority: "Medium", status: "Todo", deadline: "2026-07-06", estTime: 1.5, category: "Marketing", subtasks: [] },
        { id: "3", title: "Meditate for 10 minutes", priority: "Low", status: "Completed", deadline: "2026-07-04", estTime: 0.2, category: "Health", subtasks: [] }
      ]);
      setHabits([
        { id: "h1", name: "Read 15 Pages", streak: 5, longestStreak: 12, completionHistory: ["2026-07-03", "2026-07-02", "2026-07-01"], category: "Mind" },
        { id: "h2", name: "Drink 3L Water", streak: 2, longestStreak: 8, completionHistory: ["2026-07-03", "2026-07-02"], category: "Body" }
      ]);
      setBattles([
        { id: "b1", opponentName: "FocusMaster99", opponentLevel: 8, opponentAvatar: "🧙‍♂️", challengeText: "Complete 3 study Pomodoros", myProgress: 33, opponentProgress: 66, xpPrize: 150, coinPrize: 50, timeLeft: 3600 * 3, status: "active" }
      ]);
    }
  }, []);

  // Save changes helper
  const saveToStorage = (key: string, value: any) => {
    localStorage.setItem(key, typeof value === "string" ? value : JSON.stringify(value));
  };

  const incrementGlobalLogins = () => {
    setGlobalLogins((prev) => {
      const next = prev + 1;
      localStorage.setItem("pa_global_logins", next.toString());
      return next;
    });
  };

  const login = (email: string) => {
    const defaultUsername = email.split("@")[0];
    setIsAuthenticated(true);
    setUsername(defaultUsername);
    saveToStorage("pa_auth", "true");
    saveToStorage("pa_username", defaultUsername);
    saveToStorage("pa_level", level.toString());
    saveToStorage("pa_xp", xp.toString());
    saveToStorage("pa_coins", coins.toString());
    saveToStorage("pa_streak", streak.toString());
    saveToStorage("pa_focustime", focusTime.toString());
    saveToStorage("pa_focusscore", focusScore.toString());
    saveToStorage("pa_tasks", tasks);
    saveToStorage("pa_habits", habits);
    saveToStorage("pa_battles", battles);
    saveToStorage("pa_pet", pet);
    saveToStorage("pa_purchases", purchasedItems);
    saveToStorage("pa_theme", equippedTheme);
    saveToStorage("pa_missions", dailyMissions);
    saveToStorage("pa_chat", chatHistory);
    
    incrementGlobalLogins();
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("pa_auth");
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
          
          // Evolve pet at lvl 5 and 15
          setPet((prevPet) => {
            let nextPetType = prevPet.type;
            if (nextLevel === 5) nextPetType = "Leafy";
            if (nextLevel === 15) nextPetType = "Aquasprite";
            const updatedPet = { ...prevPet, level: prevPet.level + 1 };
            saveToStorage("pa_pet", updatedPet);
            return updatedPet;
          });

          return nextLevel;
        });
        const remainder = nextXp - xpNeeded;
        saveToStorage("pa_xp", remainder.toString());
        return remainder;
      }
      saveToStorage("pa_xp", nextXp.toString());
      return nextXp;
    });
  };

  const addCoins = (amount: number) => {
    setCoins((prev) => {
      const next = prev + amount;
      saveToStorage("pa_coins", next.toString());
      return next;
    });
  };

  const addFocusMinutes = (minutes: number) => {
    setFocusTime((prev) => {
      const next = prev + minutes;
      saveToStorage("pa_focustime", next.toString());
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
      return updated;
    });

    // Check mission completed
    if (minutes >= 25) {
      completeMission("m2");
    }
  };

  // Task Actions
  const addTask = (task: Omit<Task, "id">) => {
    const newTask: Task = {
      ...task,
      id: Math.random().toString(36).substring(2, 9)
    };
    setTasks((prev) => {
      const updated = [newTask, ...prev];
      saveToStorage("pa_tasks", updated);
      return updated;
    });
  };

  const updateTaskStatus = (id: string, status: Task["status"]) => {
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
              return updatedPet;
            });

            // Check missions
            const highPriTasks = prev.filter(x => x.priority === "High" && x.status === "Completed");
            if (t.priority === "High" && highPriTasks.length >= 1) {
              completeMission("m1");
            }
          }
          return { ...t, status };
        }
        return t;
      });
      saveToStorage("pa_tasks", updated);
      return updated;
    });
  };

  const updateTask = (updatedTask: Task) => {
    setTasks((prev) => {
      const updated = prev.map((t) => (t.id === updatedTask.id ? updatedTask : t));
      saveToStorage("pa_tasks", updated);
      return updated;
    });
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => {
      const updated = prev.filter((t) => t.id !== id);
      saveToStorage("pa_tasks", updated);
      return updated;
    });
  };

  // Habit Actions
  const addHabit = (name: string, category: string) => {
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
  };

  const toggleHabit = (id: string, dateStr: string) => {
    setHabits((prev) => {
      const updated = prev.map((h) => {
        if (h.id === id) {
          const completed = h.completionHistory.includes(dateStr);
          let history = [...h.completionHistory];
          let streakCount = h.streak;
          
          if (completed) {
            history = history.filter((d) => d !== dateStr);
            streakCount = Math.max(0, streakCount - 1);
          } else {
            history.push(dateStr);
            streakCount += 1;
            // Award XP/Coins for habit completion
            addXP(20);
            addCoins(5);
          }
          
          const longest = Math.max(h.longestStreak, streakCount);
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
  };

  const deleteHabit = (id: string) => {
    setHabits((prev) => {
      const updated = prev.filter((h) => h.id !== id);
      saveToStorage("pa_habits", updated);
      return updated;
    });
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

  const progressBattle = (id: string, percent: number) => {
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
  };

  const petPet = () => {
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
      return updated;
    });
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
