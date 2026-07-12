import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { GAME_TOOLS, GAME_CHALLENGES, CHALLENGE_ORDER, LANCE_HOME_LINES } from './lanceGameData';
import { useStoryNarrator } from './useStoryNarrator';

export interface MoodEntry {
  date: string;
  mood: number;       // 1–5
  energy: number;     // 1–5
  note?: string;
}

export interface GoalAction {
  date: string;
  note: string;
}

export interface Goal {
  id: string;
  title: string;
  why: string;
  targetDate: string;
  createdDate: string;
  actions: GoalAction[];
  completed: boolean;
}

export interface InternConfig {
  name: string;
  personalityId: string;
  avatar: string;
}

export interface GameState {
  // Meta
  onboardingComplete: boolean;
  internSetupComplete: boolean;
  userName: string;
  // Intern
  intern: InternConfig;
  // Progress
  unlockedTools: string[];
  installedTools: string[];       // tools "Get"-ted to home screen
  completedChallenges: string[];
  currentChallengeId: string | null;
  activeChallengeStep: number;
  xp: number;
  streak: number;
  lastCheckinDate: string;
  // Rewards Store
  gems: number;
  purchasedRewards: string[];
  equippedTitle: string;
  equippedAccent: string;
  claimedMilestones: number[];
  // Data
  moodLogs: MoodEntry[];
  goals: Goal[];
  // Access
  hasPaidAccess: boolean;
  hasSeenOrigin: boolean;
  // UI
  currentLanceLine: string;
  currentInternLine: string;
  currentLanceAcronym: string;
  pendingActTransition: number | null;
  // Personalization
  enabledSubTabs: string[];
  quickCheckInApps: string[];
  primaryColorTheme: string;
}

interface GameActions {
  setUserName: (n: string) => void;
  setNarratorLines: (lance: string, intern: string, acronym: string) => void;
  completeOnboarding: () => void;
  completeInternSetup: (config: InternConfig) => void;
  startChallenge: (id: string) => void;
  completeChallenge: (id: string) => void;
  logMood: (entry: MoodEntry) => void;
  clearMoodLogs: () => void;
  addGoal: (goal: Omit<Goal, 'id' | 'createdDate' | 'actions' | 'completed'>) => void;
  logGoalAction: (goalId: string, note: string) => void;
  completeGoal: (goalId: string) => void;
  deleteGoal: (goalId: string) => void;
  addXp: (amount: number) => void;
  addGems: (amount: number) => void;
  // THE FLAGSHIP GATING LAW (Lance 2026-07-12): completing a story unit
  // (case/milestone) unlocks its instrument tool — the LANCE unlock model.
  unlockTool: (toolId: string) => void;
  purchaseReward: (id: string, cost: number) => boolean;
  equipReward: (category: 'title' | 'accent', id: string) => void;
  claimMilestoneGems: (milestoneCount: number, reward: number) => void;
  setPaidAccess: (val: boolean) => void;
  completeOrigin: () => void;
  refreshLanceLine: () => void;
  clearActTransition: () => void;
  resetGame: () => void;
  installTool: (id: string) => void;
  uninstallTool: (id: string) => void;
  setEnabledSubTabs: (tabs: string[]) => void;
  setQuickCheckInApps: (apps: string[]) => void;
  setPrimaryColorTheme: (theme: string) => void;
}

type GameContextType = GameState & GameActions;

const defaultState: GameState = {
  onboardingComplete: false,
  internSetupComplete: false,
  userName: '',
  intern: { name: 'Chip', personalityId: 'hype', avatar: '⚡' },
  unlockedTools: ['mood_checkin', 'goal_journal'],
  installedTools: [],
  completedChallenges: [],
  currentChallengeId: 'challenge_dailycheckin',
  activeChallengeStep: 0,
  xp: 0,
  streak: 0,
  lastCheckinDate: '',
  gems: 0,
  purchasedRewards: [],
  equippedTitle: '',
  equippedAccent: 'teal',
  claimedMilestones: [],
  moodLogs: [],
  goals: [],
  hasPaidAccess: false,
  hasSeenOrigin: false,
  currentLanceLine: LANCE_HOME_LINES[0],
  currentInternLine: '',
  currentLanceAcronym: 'Logical Autonomic Neuro-Coping Emulator',
  pendingActTransition: null,
  enabledSubTabs: ['overview', 'mood', 'habits', 'sleep', 'nutrition'],
  quickCheckInApps: ['mood_log', 'breathwork_478', 'grounding_54321', 'cbt_reframe', 'mood_checkin'],
  primaryColorTheme: 'lance_brand',
};

const GameContext = createContext<GameContextType | null>(null);

const STORAGE_KEY = 'lance_game_state_v1';

function loadState(): GameState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw);
    const merged = { ...defaultState, ...parsed };
    // Canon migration: the Intern is Chip — always was (states saved before the
    // story rewrite may carry a custom name; the name is not customizable).
    merged.intern = { ...merged.intern, name: 'Chip' };
    return merged;
  } catch {
    return defaultState;
  }
}

function saveState(state: GameState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// Every tool's own persisted data (gratitude entries, CBT reframes, safety plans, recovery
// logs, etc.) is stored under a key with one of these app-owned prefixes/names rather than
// under STORAGE_KEY. A prefix sweep (vs. a hardcoded key list) means new tools are covered
// automatically instead of the list silently drifting out of date. Explicitly excludes any
// third-party key (Firebase auth, Stripe, etc.) by only matching these known prefixes.
const APP_DATA_PREFIXES = [
  'lance_', 'therapy_', 'recovery_', 'couples_', 'psych_', 'character_', 'erikson_',
  'biophilic_', 'SURVIVAL_', 'circadian_', 'checkin_', 'calibrated_', 'LANCE_STORY_MAP_',
];
const APP_DATA_EXACT_KEYS = [
  'hasSeenPrologue', 'has_viewed_higgsfield_tutorials', 'last_seen_manifest_story_act',
  'favorite_materials_ids',
];

function clearAllAppData() {
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;
      if (APP_DATA_PREFIXES.some(p => key.startsWith(p)) || APP_DATA_EXACT_KEYS.includes(key)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(k => localStorage.removeItem(k));
  } catch {
    /* localStorage unavailable (private browsing, etc.) — nothing more we can do */
  }
}

export function LANCEGameProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GameState>(loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  // Consume challenges completed on the VR island (/vr/ queues them in
  // lance_vr_completions_v1). Routed through completeChallenge so tool
  // unlocks, next-challenge advance, and act transitions fire exactly as if
  // completed in-app. Runs once on mount, after actions are defined below —
  // hence the ref-based deferral.
  useEffect(() => {
    const t = setTimeout(() => {
      try {
        const KEY = 'lance_vr_completions_v1';
        const queue: string[] = JSON.parse(localStorage.getItem(KEY) || '[]');
        if (!queue.length) return;
        localStorage.removeItem(KEY);
        for (const id of queue) completeChallengeRef.current?.(id);
      } catch { /* queue stays for next launch */ }
    }, 800);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Pick a random LANCE line on mount + refresh
  const refreshLanceLine = useCallback(() => {
    const line = LANCE_HOME_LINES[Math.floor(Math.random() * LANCE_HOME_LINES.length)];
    setState(s => ({ ...s, currentLanceLine: line }));
  }, []);

  // Narrator: update all three speech fields from the branching system
  const setNarratorLines = useCallback((lance: string, intern: string, acronym: string) => {
    setState(s => ({
      ...s,
      currentLanceLine: lance || s.currentLanceLine,
      currentInternLine: intern,
      currentLanceAcronym: acronym,
    }));
  }, []);

  // Wire the mood-adaptive narrator hook — fires whenever completedChallenges changes
  useStoryNarrator(
    state.completedChallenges.length,
    (lance) => setState(s => ({ ...s, currentLanceLine: lance })),
    (intern) => setState(s => ({ ...s, currentInternLine: intern })),
    (acronym) => setState(s => ({ ...s, currentLanceAcronym: acronym })),
    state.moodLogs,
    state.intern.name || 'Intern'
  );

  const setUserName = useCallback((n: string) => {
    setState(s => ({ ...s, userName: n }));
  }, []);

  const completeOnboarding = useCallback(() => {
    setState(s => ({ ...s, onboardingComplete: true }));
  }, []);

  const completeInternSetup = useCallback((config: InternConfig) => {
    // He is Chip; only personality (and avatar accent) are configurable.
    setState(s => ({ ...s, intern: { ...config, name: 'Chip' }, internSetupComplete: true }));
  }, []);

  const startChallenge = useCallback((id: string) => {
    setState(s => ({ ...s, currentChallengeId: id, activeChallengeStep: 0 }));
  }, []);

  const completeChallengeRef = React.useRef<((id: string) => void) | null>(null);
  const completeChallenge = useCallback((id: string) => {
    setState(s => {
      if (s.completedChallenges.includes(id)) return s;
      const newCompleted = [...s.completedChallenges, id];
      // Unlock any tools gated on this challenge
      const challengeTools = GAME_TOOLS.filter(t => t.challengeToUnlock === id);
      const newUnlocked = [...s.unlockedTools, ...challengeTools.map(t => t.id)];
      // Use canonical arc order to pick the next challenge
      const nextChallenge = CHALLENGE_ORDER.find(cid => !newCompleted.includes(cid)) ?? null;
      // Detect act finale — check if this challenge is marked isActFinale
      const challengeData = GAME_CHALLENGES.find(c => c.id === id);
      const pendingActTransition = challengeData?.isActFinale ? challengeData.actNumber : null;
      return {
        ...s,
        completedChallenges: newCompleted,
        unlockedTools: newUnlocked,
        currentChallengeId: nextChallenge,
        pendingActTransition,
      };
    });
  }, []);
  completeChallengeRef.current = completeChallenge;

  const unlockTool = useCallback((toolId: string) => {
    setState(s => s.unlockedTools.includes(toolId) ? s : { ...s, unlockedTools: [...s.unlockedTools, toolId] });
  }, []);

  const logMood = useCallback((entry: MoodEntry) => {
    setState(s => {
      const today = new Date().toISOString().split('T')[0];
      const filtered = s.moodLogs.filter(l => l.date !== entry.date);
      const newLogs = [entry, ...filtered];
      // Streak logic
      let newStreak = s.streak;
      if (s.lastCheckinDate !== today) {
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        newStreak = s.lastCheckinDate === yesterday ? s.streak + 1 : 1;
      }
      return { ...s, moodLogs: newLogs, streak: newStreak, lastCheckinDate: today };
    });
  }, []);

  // Mood logs live inside the consolidated GameState (STORAGE_KEY), not a separate
  // localStorage key, so clearing them means resetting this field via setState —
  // there is no 'lance_mood_logs' key to remove.
  const clearMoodLogs = useCallback(() => {
    setState(s => ({ ...s, moodLogs: [], streak: 0, lastCheckinDate: '' }));
  }, []);

  const addGoal = useCallback((goal: Omit<Goal, 'id' | 'createdDate' | 'actions' | 'completed'>) => {
    const newGoal: Goal = {
      ...goal,
      id: `goal_${Date.now()}`,
      createdDate: new Date().toISOString().split('T')[0],
      actions: [],
      completed: false,
    };
    setState(s => ({ ...s, goals: [newGoal, ...s.goals] }));
  }, []);

  const logGoalAction = useCallback((goalId: string, note: string) => {
    const today = new Date().toISOString().split('T')[0];
    setState(s => ({
      ...s,
      xp: s.xp + 15,
      goals: s.goals.map(g =>
        g.id === goalId
          ? { ...g, actions: [{ date: today, note }, ...g.actions.filter(a => a.date !== today)] }
          : g
      ),
    }));
  }, []);

  const completeGoal = useCallback((goalId: string) => {
    setState(s => ({
      ...s,
      xp: s.xp + 100,
      goals: s.goals.map(g => g.id === goalId ? { ...g, completed: true } : g),
    }));
  }, []);

  const deleteGoal = useCallback((goalId: string) => {
    setState(s => ({ ...s, goals: s.goals.filter(g => g.id !== goalId) }));
  }, []);

  const addXp = useCallback((amount: number) => {
    setState(s => ({ ...s, xp: s.xp + amount }));
  }, []);

  const addGems = useCallback((amount: number) => {
    setState(s => ({ ...s, gems: s.gems + amount }));
  }, []);

  const purchaseReward = useCallback((id: string, cost: number): boolean => {
    let success = false;
    setState(s => {
      if (s.purchasedRewards.includes(id) || s.gems < cost) return s;
      success = true;
      return { ...s, gems: s.gems - cost, purchasedRewards: [...s.purchasedRewards, id] };
    });
    return success;
  }, []);

  const equipReward = useCallback((category: 'title' | 'accent', id: string) => {
    setState(s => category === 'title' ? { ...s, equippedTitle: id } : { ...s, equippedAccent: id });
  }, []);

  // One-time gem bonus per challenge-count milestone (1/5/10/15/20/25/31 challenges done) —
  // guarded by claimedMilestones so re-rendering or re-completing a challenge can't pay it twice.
  const claimMilestoneGems = useCallback((milestoneCount: number, reward: number) => {
    setState(s => {
      if (s.claimedMilestones.includes(milestoneCount)) return s;
      return { ...s, gems: s.gems + reward, claimedMilestones: [...s.claimedMilestones, milestoneCount] };
    });
  }, []);

  const setPaidAccess = useCallback((val: boolean) => {
    setState(s => ({ ...s, hasPaidAccess: val }));
  }, []);

  const completeOrigin = useCallback(() => {
    // Also claim the shell's one-time origin gate ('lance_origin_seen') —
    // the player just watched the full origin story, so the shell must never
    // replay LANCE's birth clip on top of it (the double-video bug).
    try { localStorage.setItem('lance_origin_seen', '1'); } catch { /* ignore */ }
    setState(s => ({ ...s, hasSeenOrigin: true }));
  }, []);

  const clearActTransition = useCallback(() => {
    setState(s => ({ ...s, pendingActTransition: null }));
  }, []);

  const resetGame = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    // Every individual tool (Gratitude Log, CBT, Crisis Safety Plan, Recovery Space, etc.)
    // persists its own entries under its own localStorage key rather than STORAGE_KEY —
    // "Factory Reset" promises to clear everything, so it must sweep those too, or a
    // client's private data (e.g. gratitude entries) silently survives a reset.
    clearAllAppData();
    setState(defaultState);
  }, []);

  const installTool = useCallback((id: string) => {
    setState(s => ({ ...s, installedTools: s.installedTools.includes(id) ? s.installedTools : [...s.installedTools, id] }));
  }, []);

  const uninstallTool = useCallback((id: string) => {
    setState(s => ({ ...s, installedTools: s.installedTools.filter(t => t !== id) }));
  }, []);

  const setEnabledSubTabs = useCallback((tabs: string[]) => {
    setState(s => ({ ...s, enabledSubTabs: tabs }));
  }, []);

  const setQuickCheckInApps = useCallback((apps: string[]) => {
    setState(s => ({ ...s, quickCheckInApps: apps }));
  }, []);

  const setPrimaryColorTheme = useCallback((theme: string) => {
    setState(s => ({ ...s, primaryColorTheme: theme }));
  }, []);

  const value: GameContextType = {
    ...state,
    setUserName,
    setNarratorLines,
    completeOnboarding,
    completeInternSetup,
    startChallenge,
    completeChallenge,
    logMood,
    clearMoodLogs,
    addGoal,
    logGoalAction,
    completeGoal,
    deleteGoal,
    addXp,
    addGems,
    unlockTool,
    purchaseReward,
    equipReward,
    claimMilestoneGems,
    setPaidAccess,
    completeOrigin,
    refreshLanceLine,
    clearActTransition,
    resetGame,
    installTool,
    uninstallTool,
    setEnabledSubTabs,
    setQuickCheckInApps,
    setPrimaryColorTheme,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame(): GameContextType {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used inside LANCEGameProvider');
  return ctx;
}

// Derived helpers
export function useLevel(xp: number) {
  const level = Math.floor(xp / 100) + 1;
  const progress = (xp % 100);
  return { level, progress };
}
