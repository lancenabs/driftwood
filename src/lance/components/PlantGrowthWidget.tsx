import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sprout, Droplet, CheckCircle2, Circle, Sparkles, Heart, Info, 
  Flame, Leaf, Gift, Compass, HelpCircle, RefreshCw
} from 'lucide-react';
import { MoodLog } from '../types';

interface PlantGrowthWidgetProps {
  userName: string;
  moodLogs: MoodLog[];
}

interface SelfCareTask {
  id: string;
  label: string;
  detail: string;
  icon: string;
  completed: boolean;
  autoReason?: string; // If auto-completed by system logs
}

export default function PlantGrowthWidget({
  userName = 'Friend',
  moodLogs = []
}: PlantGrowthWidgetProps) {
  // 1. Storage date key formulation (so tasks reset daily or persist)
  const todayKey = useMemo(() => {
    // We lock to the active demo timeline '2026-06-14' or today's date if they use real time
    return '2026-06-14';
  }, []);

  // 2. Load custom task completions or defaults from localStorage
  const [taskState, setTaskState] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem(`therapy_plant_tasks_${todayKey}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return {
      water: false,
      mindful: false,
      gratitude: false,
      somatic: false,
      activity: false
    };
  });

  // Synced extra multiplier counters like "splash of water" count
  const [extraWaterCount, setExtraWaterCount] = useState<number>(() => {
    const saved = localStorage.getItem(`therapy_plant_extra_water_${todayKey}`);
    return saved ? parseInt(saved) : 0;
  });

  // Flow animation trigger for rain/droplet particle effects
  const [droplets, setDroplets] = useState<{ id: number; delay: number; x: number }[]>([]);
  const [showSparks, setShowSparks] = useState<boolean>(false);
  const [customNotification, setCustomNotification] = useState<string | null>(null);
  const [fertilizerBoost, setFertilizerBoost] = useState<number>(0);

  useEffect(() => {
    const boostVal = localStorage.getItem('therapy_quest_active_plant_boost') || '0';
    setFertilizerBoost(parseInt(boostVal));
    
    const triggered = localStorage.getItem('therapy_quest_spark_fertilizer_triggered') === 'true';
    if (triggered) {
      localStorage.setItem('therapy_quest_spark_fertilizer_triggered', 'false');
      setShowSparks(true);
      setCustomNotification("🌱 Magical NPK Booster Active! Sprout accelerated +15%!");
      setTimeout(() => {
        setShowSparks(false);
      }, 5000);
    }
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem(`therapy_plant_tasks_${todayKey}`, JSON.stringify(taskState));
  }, [taskState, todayKey]);

  useEffect(() => {
    localStorage.setItem(`therapy_plant_extra_water_${todayKey}`, extraWaterCount.toString());
  }, [extraWaterCount, todayKey]);

  // 3. Integrate automatic bridges to reflect other user actions in true high fidelity
  // Let's scan for factors completed today (e.g., mood log registered today, thoughts logged, etc.)
  const autoCompletions = useMemo(() => {
    const hasMoodToday = moodLogs.some(log => log.date === todayKey);
    
    // Check if the 4-squares have checkins in localStorage
    const thoughts = localStorage.getItem('checkin_thoughts') || '';
    const sensations = localStorage.getItem('checkin_sensations') || '[]';
    let hasSomaticCheckin = thoughts.trim().length > 0;
    try {
      const sensArr = JSON.parse(sensations);
      if (Array.isArray(sensArr) && sensArr.length > 0) {
        hasSomaticCheckin = true;
      }
    } catch { }

    // Also check standard gratitude entries today
    const gratitudeSaved = localStorage.getItem('therapy_gratitude_entries') || '[]';
    let hasGratitudeToday = false;
    try {
      const gratArr = JSON.parse(gratitudeSaved);
      if (Array.isArray(gratArr) && gratArr.some((g: any) => g.date === todayKey)) {
        hasGratitudeToday = true;
      }
    } catch {}

    // Check custom activities
    const logsSaved = localStorage.getItem('therapy_activity_logs') || '[]';
    let hasExerciseToday = false;
    try {
      const logsArr = JSON.parse(logsSaved);
      const todayLog = logsArr.find((l: any) => l.date === todayKey);
      if (todayLog && todayLog.exercise) {
        hasExerciseToday = true;
      }
    } catch {}

    return {
      mood: hasMoodToday,
      somatic: hasSomaticCheckin,
      gratitude: hasGratitudeToday,
      activity: hasExerciseToday
    };
  }, [moodLogs, todayKey]);

  // Compute final tasks array by blending manual states + automatic log triggers
  const dailyTasks = useMemo<SelfCareTask[]>(() => {
    return [
      {
        id: 'water',
        label: 'Daily Hydration Routine',
        detail: 'Intersperse 8 glasses of pure room-temperature spring water.',
        icon: '🥛',
        completed: taskState.water,
      },
      {
        id: 'mindful',
        label: 'Vagus Nerve Reset',
        detail: 'Pause for 5 cycles of diaphragmatic 4-7-8 deep breathing.',
        icon: '🌬️',
        completed: taskState.mindful,
      },
      {
        id: 'gratitude',
        label: 'Integrative Gratitude Reflex',
        detail: 'Record 3 things you are genuinely appreciative of.',
        icon: '🌸',
        completed: taskState.gratitude || autoCompletions.gratitude,
        autoReason: autoCompletions.gratitude ? "Log Linked" : undefined
      },
      {
        id: 'somatic',
        label: 'Somatic Check-In',
        detail: 'Map current feelings, physical sensations or today’s mood.',
        icon: '🧬',
        completed: taskState.somatic || autoCompletions.mood || autoCompletions.somatic,
        autoReason: (autoCompletions.mood || autoCompletions.somatic) ? "Check-in Sync" : undefined
      },
      {
        id: 'activity',
        label: 'Circadian Movement',
        detail: 'Engage in 20 minutes of mindful walking or restorative movement.',
        icon: '🏃‍♀️',
        completed: taskState.activity || autoCompletions.activity,
        autoReason: autoCompletions.activity ? "Workout Sync" : undefined
      }
    ];
  }, [taskState, autoCompletions]);

  // Compute total completed count and overall growth completion %
  const completedCount = useMemo(() => {
    return dailyTasks.filter(t => t.completed).length;
  }, [dailyTasks]);

  const rawPercentage = useMemo(() => {
    const base = dailyTasks.length;
    if (base === 0) return 0;
    
    // Each completed task is 20%. Each extra splash of water adds 5% (capped at 20% max bonus)
    const basePercent = (completedCount / base) * 100;
    const bonusPercent = Math.min(20, extraWaterCount * 5);
    // Add Zen Shop Fertilizer Boost!
    return Math.min(100, basePercent + bonusPercent + fertilizerBoost);
  }, [completedCount, dailyTasks.length, extraWaterCount, fertilizerBoost]);

  // Level of plant stage
  const growthStage = useMemo(() => {
    if (rawPercentage === 0) return 0; // State 0: Pot & seed sleeping
    if (rawPercentage <= 25) return 1; // State 1: Sprout poking out
    if (rawPercentage <= 50) return 2; // State 2: Sprout with dual leaves
    if (rawPercentage <= 75) return 3; // State 3: Growing taller stem with branches
    return 4; // State 4: Magnificent full bloom star flower with golden glow
  }, [rawPercentage]);

  // Toggle single item manual completion
  const handleToggleTask = (id: string, isAuto: boolean) => {
    if (isAuto) {
      // Direct notification explaining that this task is synced to biological logging!
      triggerSpeechBubble("⚡ Handled automatically based on today's clinical logs!");
      return;
    }

    const nextState = !taskState[id];
    setTaskState(prev => ({
      ...prev,
      [id]: nextState
    }));

    if (nextState) {
      // Trigger temporary high satisfaction water spray on completing task
      triggerWaterSplash();
      triggerSpeechBubble(getRandomPraise());
    }
  };

  // Trigger droplet splash physical system
  const triggerWaterSplash = () => {
    const list = Array.from({ length: 6 }).map((_, i) => ({
      id: Math.random() + i,
      x: 35 + Math.random() * 30, // Centered range in SVG
      delay: i * 0.12
    }));
    setDroplets(list);
    
    // Clear after animation runs out
    setTimeout(() => {
      setDroplets([]);
    }, 1800);
  };

  // Helper praises matching therapeutic motivation guidelines
  const getRandomPraise = () => {
    const praises = [
      "Watering consistent habits! 🌿",
      "Wonderful micro-action! Step by step.",
      "Self-care consistency creates neural bloom! 🌸",
      "Beautiful mindfulness effort today!",
      "Nurturing your somatic connection! 💧",
      "Every small choice is a seed of peace."
    ];
    return praises[Math.floor(Math.random() * praises.length)];
  };

  const triggerSpeechBubble = (msg: string) => {
    setCustomNotification(msg);
    if (rawPercentage >= 95) {
      setShowSparks(true);
    }
    setTimeout(() => {
      setCustomNotification(null);
      setShowSparks(false);
    }, 4500);
  };

  // Reset helper
  const handleResetExtraWater = () => {
    setExtraWaterCount(0);
    setTaskState({
      water: false,
      mindful: false,
      gratitude: false,
      somatic: false,
      activity: false
    });
    triggerSpeechBubble("New cycle initialized! 🔄 Happy tracking.");
  };

  // Explicit water splash button
  const handleWaterClick = () => {
    setExtraWaterCount(prev => Math.min(6, prev + 1));
    triggerWaterSplash();
    
    if (rawPercentage >= 98) {
      triggerSpeechBubble("Maximum Bloom! Your consistency garden is fully saturated! ✨🌸");
    } else {
      triggerSpeechBubble("Refreshing! Your self-care soil is rich with growth multipliers!");
    }
  };

  return (
    <div 
      id="self-care-plant-growth-widget" 
      className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-5 select-none relative overflow-hidden"
    >
      
      {/* Decorative floral watermark background */}
      <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 text-slate-50 pointer-events-none select-none opacity-40">
        <Leaf className="w-48 h-48 rotate-45" />
      </div>

      {/* Top Header Block */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 z-10 relative">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <span className="p-1 px-2.5 rounded-full bg-emerald-50 text-emerald-700 text-[8.5px] font-black uppercase tracking-widest font-mono">
              🌱 CONSISTENCY COMPANION
            </span>
            <span className="text-[9px] font-bold text-center bg-teal-50 text-teal-700 px-1.5 py-0.5 rounded-full border border-teal-100">
              Interactive Metaphor
            </span>
          </div>
          <h3 className="font-display text-base font-extrabold text-slate-800 tracking-tight flex items-center gap-1.5">
            <Sprout className="w-4.5 h-4.5 text-emerald-600" />
            <span>Nurture Your Self-Care Garden</span>
          </h3>
          <p className="text-[10.5px] text-gray-400 font-semibold leading-relaxed">
            Every daily self-care task completed waters your mental garden, causing your plants to physically sprout and bloom.
          </p>
        </div>

        {/* Real-time score milestone badges */}
        <div className="flex items-center gap-2">
          <button 
            onClick={handleResetExtraWater}
            title="Reset daily cycle data"
            className="p-2 border border-slate-100 rounded-xl bg-slate-50/50 hover:bg-slate-100/50 transition cursor-pointer text-slate-400 hover:text-slate-700 shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          
          <div className="bg-emerald-50 text-emerald-800 p-2 px-3 rounded-2xl border border-emerald-100/70 text-right flex items-center gap-2 shrink-0">
            <Flame className="w-4 h-4 text-emerald-600 animate-pulse" />
            <div className="text-left leading-none">
              <span className="text-[13px] font-black font-mono block">{completedCount}/5</span>
              <span className="text-[8px] font-bold uppercase tracking-wider text-emerald-700 block mt-0.5">Tasks Done</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dual Area: SVG Plant Model Left, Task Checklist Right */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch relative">
        
        {/* Plant Display Panel (svg canvas area) (Grid 5/12) */}
        <div 
          className="md:col-span-5 bg-gradient-to-b from-slate-50/30 to-slate-50/90 rounded-2xl border border-slate-100/80 p-4 flex flex-col justify-between items-center relative overflow-hidden min-h-[290px]"
        >
          {/* Growth percentage text tag */}
          <div className="absolute top-3 left-3 bg-white/95 px-2.5 py-1 rounded-xl shadow-3xs border border-slate-100/60 z-10 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-[10px] font-black text-slate-700 font-mono">{rawPercentage}% Grown</span>
          </div>

          {/* Assistant's bubble speech feedback */}
          <AnimatePresence>
            {customNotification && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute top-14 left-3 right-3 bg-white border border-slate-100/85 p-2.5 rounded-2xl shadow-sm text-[9.5px] text-teal-900 leading-normal font-semibold text-center z-10 flex items-center gap-1.5"
              >
                <span className="text-sm shrink-0">💬</span>
                <span className="text-left flex-1">{customNotification}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* SVG Plant Drawer Canvas */}
          <div className="w-full h-44 flex items-center justify-center relative select-none mt-4">
            
            {/* Real-time D3/SVG Physical simulation canvas */}
            <svg 
              className="w-40 h-40 overflow-visible" 
              viewBox="0 0 100 100" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Gradient for gold bloom */}
                <radialGradient id="glowingGold" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.85" />
                  <stop offset="50%" stopColor="#fbbf24" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
                </radialGradient>

                {/* Soil gradient */}
                <linearGradient id="soilLayer" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#78350f" />
                  <stop offset="100%" stopColor="#451a03" />
                </linearGradient>

                {/* Pot gradient */}
                <linearGradient id="potLayer" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#e2e8f0" />
                  <stop offset="100%" stopColor="#94a3b8" />
                </linearGradient>

                {/* Stem radial gradient for fresh life vibe */}
                <linearGradient id="freshStem" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#047857" />
                </linearGradient>
              </defs>

              {/* WATER DROPLET PARTICLES (Framer Motion driven) */}
              {droplets.map((drop) => (
                <motion.circle 
                  key={drop.id}
                  cx={drop.x}
                  cy="15"
                  r="1.8"
                  fill="#0284c7"
                  opacity={0.8}
                  initial={{ y: 0, opacity: 0.9 }}
                  animate={{ y: 65, opacity: [0.9, 0.9, 0.4] }}
                  transition={{ duration: 0.8, ease: "easeIn", delay: drop.delay }}
                />
              ))}

              {/* RIPPLE EFFECTS ON SOIL WHEN WATERED */}
              {droplets.length > 0 && (
                <motion.ellipse 
                  cx="50" 
                  cy="80" 
                  rx="15" 
                  ry="2" 
                  fill="none" 
                  stroke="#14b8a6" 
                  strokeWidth="0.8"
                  initial={{ scale: 0.3, opacity: 0.9 }}
                  animate={{ scale: 1.4, opacity: 0 }}
                  transition={{ duration: 1, repeat: 1 }}
                />
              )}

              {/* -------------------- STAGE RENDERING -------------------- */}
              
              {/* STAGE 0: Soil is clean, seed is tucked inside */}
              {growthStage === 0 && (
                <g>
                  {/* Subtle seed dot hidden inside compost */}
                  <motion.circle 
                    cx="50" 
                    cy="78" 
                    r="2.5" 
                    fill="#3f2711" 
                    stroke="#f59e0b" 
                    strokeWidth="1" 
                    strokeDasharray="2,2"
                    animate={{ scale: [0.95, 1.05, 0.95] }}
                    transition={{ repeat: Infinity, duration: 2.2 }}
                  />
                  {/* Soil layer */}
                  <ellipse cx="50" cy="80" rx="14" ry="3" fill="url(#soilLayer)" />
                  
                  {/* Floating seed question */}
                  <text x="50" y="65" textAnchor="middle" fill="#94a3b8" style={{ fontSize: '6px', fontWeight: 'bold' }}>
                    Seed Asleep (0%)
                  </text>
                </g>
              )}

              {/* STAGE 1: Tiny sprout poking up (1% to 25%) */}
              {growthStage === 1 && (
                <g>
                  {/* Soil layer */}
                  <ellipse cx="50" cy="80" rx="14" ry="3.2" fill="url(#soilLayer)" />
                  
                  {/* Growth stem curve */}
                  <motion.path 
                    d="M 50 80 Q 52 75, 51 72" 
                    stroke="url(#freshStem)" 
                    strokeWidth="2.5" 
                    strokeLinecap="round" 
                    fill="none"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5 }}
                  />
                  {/* One tiny baby bud leaf */}
                  <motion.path 
                    d="M 51 72 Q 47 70, 48 68 Q 52 70, 51 72" 
                    fill="#10b981" 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3 }}
                  />
                </g>
              )}

              {/* STAGE 2: Sprout with dual leaves (26% to 50%) */}
              {growthStage === 2 && (
                <g>
                  {/* Soil layer */}
                  <ellipse cx="50" cy="80" rx="14" ry="3.2" fill="url(#soilLayer)" />
                  
                  {/* Stem */}
                  <motion.path 
                    d="M 50 80 Q 48 72, 49 65" 
                    stroke="url(#freshStem)" 
                    strokeWidth="3" 
                    strokeLinecap="round" 
                    fill="none"
                    animate={{ d: "M 50 80 Q 48 72, 49 65" }}
                  />

                  {/* Left leaf */}
                  <motion.path 
                    d="M 49 71 Q 42 69, 41 66 Q 48 67, 49 71" 
                    fill="#059669" 
                    animate={{ rotate: [-2, 2, -2] }}
                    transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
                  />

                  {/* Right leaf */}
                  <motion.path 
                    d="M 49 67 Q 56 65, 57 61 Q 52 63, 49 67" 
                    fill="#10b981" 
                    animate={{ rotate: [2, -2, 2] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  />
                </g>
              )}

              {/* STAGE 3: Growing taller plant with healthy branches & tiny flower bud (51% to 75%) */}
              {growthStage === 3 && (
                <g>
                  {/* Soil layer */}
                  <ellipse cx="50" cy="80" rx="14" ry="3.2" fill="url(#soilLayer)" />
                  
                  {/* Main Stem */}
                  <path d="M 50 80 Q 51 68, 48 55" stroke="url(#freshStem)" strokeWidth="3.2" strokeLinecap="round" fill="none" />
                  
                  {/* Left branch & leaf */}
                  <path d="M 50 71 Q 42 69, 41 64 Q 48 66, 50 71" fill="#047857" />
                  <path d="M 49 62 Q 41 58, 42 53 Q 47 57, 49 62" fill="#059669" />

                  {/* Right branch & leaf */}
                  <path d="M 50 67 Q 57 65, 58 59 Q 52 62, 50 67" fill="#10b981" />
                  <path d="M 49 58 Q 57 54, 56 49 Q 51 52, 49 58" fill="#34d399" />

                  {/* Little orange/golden flower bud forming at peak */}
                  <motion.circle 
                    cx="48" 
                    cy="53" 
                    r="3.2" 
                    fill="#f59e0b" 
                    stroke="#ffffff" 
                    strokeWidth="0.8"
                    animate={{ scale: [0.9, 1.1, 0.9] }}
                    transition={{ repeat: Infinity, duration: 1.8 }}
                  />
                  <path d="M 48 55 Q 46 51, 48 49 Q 50 51, 48 55" fill="#f43f5e" />
                </g>
              )}

              {/* STAGE 4: Full bloom gorgeous star flower with golden glow particles! (76% to 100%) */}
              {growthStage === 4 && (
                <g>
                  {/* Ambient golden aura */}
                  <motion.circle 
                    cx="50" 
                    cy="45" 
                    r="19" 
                    fill="url(#glowingGold)" 
                    animate={{ scale: [0.93, 1.07, 0.93], opacity: [0.4, 0.8, 0.4] }}
                    transition={{ repeat: Infinity, duration: 3.2, ease: "easeInOut" }}
                  />

                  {/* Soil layer */}
                  <ellipse cx="50" cy="80" rx="14.5" ry="3.5" fill="url(#soilLayer)" />
                  
                  {/* Talle stem */}
                  <path d="M 50 80 Q 52 65, 50 48" stroke="url(#freshStem)" strokeWidth="3.8" strokeLinecap="round" fill="none" />

                  {/* Rich leaves */}
                  <path d="M 51 72 Q 41 71, 40 65 Q 48 67, 51 72" fill="#047857" />
                  <path d="M 51 64 Q 61 62, 60 56 Q 53 58, 51 64" fill="#059669" />
                  <path d="M 51 57 Q 40 55, 39 49 Q 47 51, 51 57" fill="#10b981" />
                  <path d="M 50 51 Q 59 47, 58 41 Q 52 44, 50 51" fill="#34d399" />

                  {/* The Golden Star Flower Bloom */}
                  <g transform="translate(50, 44)">
                    {/* Rotating star backdrop */}
                    <motion.g
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 35, ease: "linear" }}
                    >
                      {/* Petals */}
                      <path d="M 0 -8 Q -4 -3, -8 0 Q -3 4, 0 8 Q 3 4, 8 0 Q 4 -3, 0 -8" fill="#f43f5e" />
                      <path d="M -8 -8 Q -5 -0, 0 8 Q 5 0, 8 -8 Q 0 -5, -8 -8" fill="#e11d48" opacity="0.8" transform="rotate(45)" />
                      <circle cx="0" cy="0" r="4.2" fill="#fbbf24" stroke="#ffffff" strokeWidth="1" />
                      <circle cx="0" cy="0" r="1.8" fill="#f59e0b" />
                    </motion.g>

                    {/* Shimmer sparkle stars inside flower */}
                    <motion.circle cx="-3" cy="-3" r="0.6" fill="#ffffff" animate={{ opacity: [0.1, 1, 0.1] }} transition={{ repeat: Infinity, duration: 1.2 }} />
                    <motion.circle cx="3" cy="3" r="0.6" fill="#ffffff" animate={{ opacity: [1, 0.1, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} />
                  </g>

                  {/* Star particles floating upwards */}
                  <motion.circle cx="34" cy="40" r="0.9" fill="#fbbf24" animate={{ y: [-10, -25], opacity: [0, 0.9, 0] }} transition={{ repeat: Infinity, duration: 2.5, delay: 0.2 }} />
                  <motion.circle cx="62" cy="42" r="1.1" fill="#fbbf24" animate={{ y: [-5, -20], opacity: [0, 0.8, 0] }} transition={{ repeat: Infinity, duration: 3, delay: 0.8 }} />
                  <motion.circle cx="48" cy="24" r="0.8" fill="#ffffff" animate={{ y: [-2, -15], opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 2.2 }} />
                </g>
              )}

              {/* Decorative Glass Orchid Pot container */}
              <g id="orchid-pot">
                <path d="M 33 80 L 35 94 Q 50 97, 65 94 L 67 80 Z" fill="url(#potLayer)" stroke="#cbd5e1" strokeWidth="0.8" />
                <ellipse cx="50" cy="80" rx="17" ry="2" fill="#cbd5e1" opacity="0.5" />
                <ellipse cx="50" cy="80" rx="15" ry="1.2" fill="#64748b" />
                
                {/* Cute heart outline on pot */}
                <path d="M 50 89 C 48 86, 45 86, 45 88 C 45 90, 50 93, 50 93 C 50 93, 55 90, 55 88 C 55 86, 52 86, 50 89 Z" fill="#e11d48" opacity="0.25" />
              </g>
            </svg>

            {/* Sparkle overlay when fully bloomed */}
            {growthStage === 4 && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <Sparkles className="w-24 h-24 text-amber-400 opacity-20 animate-spin-slow" />
              </div>
            )}
          </div>

          {/* Plant Growth status feedback & watering triggers */}
          <div className="w-full space-y-2">
            <div className="text-center">
              <span className="text-[10px] uppercase font-black tracking-widest text-slate-500 block font-mono">
                {growthStage === 0 && "Cycle 0: Cocooning"}
                {growthStage === 1 && "Cycle 1: Emergence sprout"}
                {growthStage === 2 && "Cycle 2: Restorative stem"}
                {growthStage === 3 && "Cycle 3: Budding adaptation"}
                {growthStage === 4 && "Cycle 4: Self-Care Full Bloom! 🌻"}
              </span>
              <p className="text-[9.5px] italic text-slate-400 font-semibold leading-normal mt-0.5 px-2">
                {growthStage === 0 && "Plant a daily hope. Log at least one check-in or water the pot to sprout!"}
                {growthStage === 1 && "Beautiful beginning! Your consistency is establishing roots in active habit space."}
                {growthStage === 2 && "Perfect structural balance! Nourish daily routines to expand into vibrant flowers."}
                {growthStage === 3 && "So close to bloom! Gentle rest and deep breaths are preparing the flower buds."}
                {growthStage === 4 && "Stunning consistency! Sarah's self-care plant is healthy and fully alive."}
              </p>
            </div>

            {/* Water splash interactive activator button */}
            <button
              onClick={handleWaterClick}
              disabled={rawPercentage >= 100}
              className={`w-full py-2 px-3 rounded-2xl text-[9.5px] font-black uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer border ${
                rawPercentage >= 100
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-100/50 cursor-not-allowed'
                  : 'bg-teal-600 hover:bg-teal-700 text-white shadow-2xs hover:shadow-xs active:scale-97'
              }`}
            >
              <Droplet className="w-3.5 h-3.5 fill-current shrink-0 text-sky-200" />
              <span>
                {rawPercentage >= 100 
                  ? "Fully Saturated 💖" 
                  : `Splash Soil with Water (+5% growth)`
                }
              </span>
            </button>
            
            {/* Show water splash multiplier count */}
            {extraWaterCount > 0 && (
              <div className="text-center text-[8.5px] font-bold text-teal-650 flex items-center justify-center gap-1 font-mono">
                <span>💦 Extra waterings:</span>
                <span className="font-bold underline">{extraWaterCount}/4 times</span>
              </div>
            )}
          </div>

        </div>

        {/* Task Checklist Dashboard panel (Grid 7/12) */}
        <div className="md:col-span-7 flex flex-col justify-between space-y-4">
          
          <div className="space-y-2.5">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 font-mono text-left">
              Sarah's Daily Nourishment Garden list
            </h4>

            <div className="space-y-2 text-left">
              {dailyTasks.map((task) => {
                const isAuto = !!task.autoReason;
                return (
                  <div
                    key={task.id}
                    onClick={() => handleToggleTask(task.id, isAuto)}
                    className={`p-3 rounded-2xl border transition duration-200 cursor-pointer flex items-center gap-3 select-none ${
                      task.completed
                        ? 'bg-emerald-50/40 border-emerald-150/70 text-slate-800 hover:bg-emerald-50/60'
                        : 'bg-slate-50/30 border-slate-100 hover:bg-slate-100/50 hover:border-slate-200/70'
                    }`}
                  >
                    {/* Render customized icon index label */}
                    <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-base shadow-3xs border border-slate-100 text-slate-700 shrink-0 select-none">
                      {task.icon}
                    </div>

                    {/* Task text descriptors */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`text-[11px] font-bold tracking-tight leading-none ${task.completed ? 'text-slate-800 font-extrabold line-through decoration-emerald-200/90' : 'text-slate-750'}`}>
                          {task.label}
                        </span>
                        
                        {/* Sync label */}
                        {isAuto && (
                          <span className="text-[8px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-800 px-1 py-0.2 rounded font-mono leading-none">
                            {task.autoReason}
                          </span>
                        )}
                      </div>
                      <p className="text-[9.5px] text-slate-400 font-medium leading-relaxed mt-0.5">
                        {task.detail}
                      </p>
                    </div>

                    {/* Checkmark icon toggler */}
                    <div className="shrink-0">
                      {task.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300 hover:text-slate-500" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Clinical Insight Panel */}
          <div className="p-3.5 bg-gradient-to-br from-indigo-50/40 to-slate-50 border border-slate-100/80 rounded-2xl text-left space-y-1">
            <div className="flex items-center gap-1.5">
              <Gift className="w-3.5 h-3.5 text-indigo-500" />
              <span className="text-[9px] font-black uppercase tracking-wide text-indigo-950 font-sans">CLINICAL STABILITY BONUS</span>
            </div>
            <p className="text-[10px] text-slate-600 leading-normal font-semibold">
              Consistently keeping your self-care plant at <strong className="text-emerald-700">Level 4 (Bloom)</strong> strengthens emotional resilience by reinforcing positive agency. Completing checks activates reward center neural feedback, creating an automatic positive cognitive baseline.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
