import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Leaf, Plus, Sparkles, Check, Trash2, Heart, RefreshCw, 
  Trophy, Sprout, Flame, Lock, Zap, Music, Cpu, Scissors, Palette
} from 'lucide-react';

interface Habit {
  id: string;
  name: string;
  category: 'Mind' | 'Somatic' | 'Nutrition' | 'Social' | 'Slept';
  completed: boolean;
  xpWorth: number;
}

const DEFAULT_HABITS: Habit[] = [
  { id: '1', name: 'Morning calming breathwork (3 min)', category: 'Somatic', completed: false, xpWorth: 15 },
  { id: '2', name: 'Reflected on my intentions for today', category: 'Mind', completed: false, xpWorth: 20 },
  { id: '3', name: 'Drank 1.5 liters of water', category: 'Nutrition', completed: false, xpWorth: 10 },
  { id: '4', name: 'Noted 3 things I\'m grateful for', category: 'Mind', completed: false, xpWorth: 15 },
  { id: '5', name: 'Stretched or went on an outdoor walk', category: 'Somatic', completed: false, xpWorth: 25 },
  { id: '6', name: 'Connected with a supportive person', category: 'Social', completed: false, xpWorth: 20 },
];

type ArtStyle = 'emerald' | 'cyberpunk' | 'sakura' | 'cosmic' | 'fibonacci';

interface FloatingText {
  id: number;
  text: string;
  x: number;
  y: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  color: string;
}

export default function BiophilicHabitGarden() {
  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem('biophilic_habits');
    return saved ? JSON.parse(saved) : DEFAULT_HABITS;
  });

  const [experience, setExperience] = useState<number>(() => {
    const saved = localStorage.getItem('biophilic_garden_xp');
    return saved ? parseInt(saved, 10) : 45; // Start with nice base to see growth
  });

  const [streakDays, setStreakDays] = useState<number>(() => {
    const saved = localStorage.getItem('biophilic_garden_streak');
    return saved ? parseInt(saved, 10) : 3; // Initial streak of 3 days
  });

  const [selectedArtStyle, setSelectedArtStyle] = useState<ArtStyle>(() => {
    return (localStorage.getItem('biophilic_art_style') as ArtStyle) || 'emerald';
  });

  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitCategory, setNewHabitCategory] = useState<'Mind' | 'Somatic' | 'Nutrition' | 'Social' | 'Slept'>('Mind');
  const [justLeveledUp, setJustLeveledUp] = useState(false);
  const [isPulsing, setIsPulsing] = useState(false);
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);

  // Auto-save progress
  useEffect(() => {
    localStorage.setItem('biophilic_habits', JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem('biophilic_garden_xp', experience.toString());
  }, [experience]);

  useEffect(() => {
    localStorage.setItem('biophilic_garden_streak', streakDays.toString());
  }, [streakDays]);

  useEffect(() => {
    localStorage.setItem('biophilic_art_style', selectedArtStyle);
  }, [selectedArtStyle]);

  // Generate beautiful drifting particles matching the current selected art style
  useEffect(() => {
    const particleColors: Record<ArtStyle, string[]> = {
      emerald: ['#10b981', '#34d399', '#6ee7b7', '#059669'],
      cyberpunk: ['#ec4899', '#06b6d4', '#a855f7', '#f43f5e'],
      sakura: ['#f472b6', '#fbcfe8', '#fda4af', '#f43f5e'],
      cosmic: ['#3b82f6', '#fbbf24', '#c084fc', '#6366f1'],
      fibonacci: ['#fbbf24', '#f59e0b', '#d97706', '#fef08a'],
    };

    const activeColors = particleColors[selectedArtStyle] || particleColors.emerald;
    
    const newParticles = Array.from({ length: 15 }).map((_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100 + 50, // center on the pot
      y: Math.random() * 100 + 40,
      size: Math.random() * 3.5 + 1.5,
      duration: Math.random() * 4 + 3,
      delay: Math.random() * 2,
      color: activeColors[Math.floor(Math.random() * activeColors.length)],
    }));
    
    setParticles(newParticles);
  }, [selectedArtStyle, experience]);

  // Safe synthesized audio (Web Audio API)
  const playSynthesizedChime = (type: 'check' | 'uncheck' | 'level' | 'style') => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      if (type === 'check') {
        // Double sweet note
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        osc1.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc2.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
        
        osc1.type = 'sine';
        osc2.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
        
        osc1.connect(gainNode);
        osc2.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        osc1.start();
        osc2.start(ctx.currentTime + 0.1);
        osc1.stop(ctx.currentTime + 0.4);
        osc2.stop(ctx.currentTime + 0.4);
      } else if (type === 'level') {
        // Glorious arpeggio
        const freqs = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        freqs.forEach((f, index) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.frequency.setValueAtTime(f, ctx.currentTime + index * 0.1);
          osc.type = 'triangle';
          gain.gain.setValueAtTime(0.06, ctx.currentTime + index * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + index * 0.1 + 0.5);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + index * 0.1);
          osc.stop(ctx.currentTime + index * 0.1 + 0.5);
        });
      } else if (type === 'style') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.35);
        osc.type = 'sine';
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      } else {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.setValueAtTime(330, ctx.currentTime); // E4
        osc.type = 'sine';
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      }
    } catch (e) {
      // safe fallback on browser restrictions
    }
  };

  const handleToggleHabit = (id: string, e: React.MouseEvent<HTMLButtonElement>) => {
    // Get click coords for floating XP bubble
    const rect = e.currentTarget.getBoundingClientRect();
    const xCoord = Math.min(250, rect.left + rect.width / 2 - 120);
    const yCoord = rect.top - 20;

    setHabits(prev => prev.map(h => {
      if (h.id === id) {
        const nextState = !h.completed;
        // Apply streak modifier: +5% XP multiplier per active streak day up to maximum +50%
        const streakBonusMultiplier = 1 + Math.min(10, streakDays) * 0.05;
        const baseXP = h.xpWorth;
        const calculatedXP = Math.round(baseXP * (nextState ? streakBonusMultiplier : -1));
        
        setExperience(currentXp => {
          const updated = Math.max(0, currentXp + calculatedXP);
          
          if (nextState) {
            playSynthesizedChime('check');
            // Check for level upgrades (each 100 XP is a level)
            const currentLevel = Math.floor(currentXp / 100) + 1;
            const nextLevel = Math.floor(updated / 100) + 1;
            if (nextLevel > currentLevel) {
              setJustLeveledUp(true);
              playSynthesizedChime('level');
              setTimeout(() => setJustLeveledUp(false), 4000);
            }
          } else {
            playSynthesizedChime('uncheck');
          }
          return updated;
        });

        if (nextState) {
          // Trigger physics surge ripple on tree
          setIsPulsing(true);
          setTimeout(() => setIsPulsing(false), 900);

          // Add clean floaty text bubble
          const newFloatId = Date.now();
          setFloatingTexts(p => [...p, {
            id: newFloatId,
            text: `+${Math.round(baseXP * streakBonusMultiplier)} XP 🍃`,
            x: xCoord,
            y: yCoord
          }]);
          setTimeout(() => {
            setFloatingTexts(p => p.filter(ft => ft.id !== newFloatId));
          }, 1800);
        }

        return { ...h, completed: nextState };
      }
      return h;
    }));
  };

  const handleAddHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;
    
    const newHabit: Habit = {
      id: Date.now().toString(),
      name: newHabitName.trim(),
      category: newHabitCategory,
      completed: false,
      xpWorth: 15,
    };

    setHabits(prev => [...prev, newHabit]);
    setNewHabitName('');
    playSynthesizedChime('style');
  };

  const handleDeleteHabit = (id: string) => {
    setHabits(prev => {
      const removedHabit = prev.find(h => h.id === id);
      if (removedHabit && removedHabit.completed) {
        setExperience(curr => Math.max(0, curr - Math.round(removedHabit.xpWorth * (1 + Math.min(10, streakDays) * 0.05))));
      }
      return prev.filter(h => h.id !== id);
    });
    playSynthesizedChime('uncheck');
  };

  const handleResetDay = () => {
    setHabits(prev => prev.map(h => ({ ...h, completed: false })));
    playSynthesizedChime('style');
  };

  // Habit metrics and levels
  const level = Math.floor(experience / 100) + 1;
  const progressInLevel = experience % 100;

  // Unlocking structure for theme styles
  const ART_STYLE_SPECS = [
    { id: 'emerald' as ArtStyle, name: 'Classic Emerald', minLevel: 1, colorName: 'emerald', desc: 'Natural organic leaves & grass' },
    { id: 'cyberpunk' as ArtStyle, name: 'Neon Cyberpunk', minLevel: 2, colorName: 'fuchsia', desc: 'Glowing matrix wireframes & energy grids' },
    { id: 'sakura' as ArtStyle, name: 'Sakura Zen Ink', minLevel: 3, colorName: 'pink', desc: 'Sparsest handpainted watercolor ink & cherry petal showers' },
    { id: 'cosmic' as ArtStyle, name: 'Cosmic Stardust', minLevel: 4, colorName: 'indigo', desc: 'Luminous starry constellations & galactic orbits' },
    { id: 'fibonacci' as ArtStyle, name: 'Sacred Fibonacci', minLevel: 5, colorName: 'amber', desc: 'Golden ratio logarithmic logarithmic curves & helices' },
  ];

  const handleSelectStyle = (styleId: ArtStyle, isLocked: boolean) => {
    if (isLocked) {
      playSynthesizedChime('uncheck');
      return; // prevent select locked
    }
    setSelectedArtStyle(styleId);
    playSynthesizedChime('style');
  };

  // Procedural geometry computations based on level/experience and active streak
  // More experience = taller trunk, more branches, denser leaves.
  // Higher streaks = wider foliage spread, thicker base stem!
  const trunkHeight = 150 - Math.min(65, (experience * 0.12) + (streakDays * 1.5));
  const branchSpread = Math.min(30, 10 + (experience * 0.04) + (streakDays * 0.8));
  const leavesCount = Math.min(12, 3 + Math.floor(experience / 40) + Math.floor(streakDays / 2));
  const thickness = Math.min(7, 2 + (experience / 110) + (streakDays * 0.25));

  return (
    <div id="biophilic-garden-root" className="bg-white rounded-3xl p-5 md:p-7 relative select-none max-w-5xl mx-auto text-[#3C3C3C] overflow-hidden" style={{ boxShadow: '0 3px 14px rgba(0,0,0,0.05)' }}>

      {/* Floating text emitters (+XP feedback) */}
      <div className="fixed inset-0 pointer-events-none z-[999]">
        <AnimatePresence>
          {floatingTexts.map(ft => (
            <motion.div
              key={ft.id}
              initial={{ opacity: 0, y: ft.y + 10, scale: 0.8 }}
              animate={{ opacity: 1, y: ft.y - 70, scale: 1.1 }}
              exit={{ opacity: 0, y: ft.y - 100, scale: 0.9 }}
              transition={{ duration: 1.4, ease: 'easeOut' }}
              className="absolute left-[380px] md:left-[45%] text-[#0D9488] font-mono font-extrabold text-sm px-3 py-1 bg-white rounded-full border border-[#58CC02]/30"
              style={{ left: `${ft.x}px`, top: `${ft.y}px`, boxShadow: '0 3px 14px rgba(0,0,0,0.10)' }}
            >
              {ft.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        
        {/* LEFT COMPONENT: The Spectacular Virtual Tree Physical growth simulator */}
        <div className="lg:col-span-5 rounded-2xl border border-[#F0F0F0] p-4 shrink-0 flex flex-col justify-between items-center relative overflow-hidden min-h-[460px]" style={{ background: 'linear-gradient(180deg, #F0FDF4, #FFFFFF)' }}>

          {/* Subtle nature grid background, coordinates mapping */}
          <div className="absolute inset-0 bg-[radial-gradient(#58CC02_0.3px,transparent_0.3px)] [background-size:16px_16px] opacity-[0.10] pointer-events-none" />

          {/* Level celebratory popup */}
          <AnimatePresence>
            {justLeveledUp && (
              <motion.div
                initial={{ opacity: 0, y: -25, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -25 }}
                className="absolute top-3 left-3 right-3 text-white font-black py-2.5 px-4 rounded-xl text-xs z-30 flex items-center justify-between"
                style={{ background: 'linear-gradient(135deg, #14B8A6, #58CC02)', boxShadow: '0 5px 0 #0D9488' }}
              >
                <span className="flex items-center gap-1.5 font-mono">
                  <Sparkles className="w-4 h-4 animate-spin text-yellow-300" />
                  GARDEN GREW TO LEVEL {level}! 🎉
                </span>
                <span className="text-[10px] bg-white/20 border border-white/30 px-2 py-0.5 rounded-md font-mono uppercase tracking-widest text-white">New art styles unlocked</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Top header HUD metrics */}
          <div className="w-full text-center space-y-1.5 z-10 select-none pb-2 border-b border-[#F0F0F0]">
            <div className="flex justify-between items-center">
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded" style={{ color: '#46A302', background: '#58CC0214' }}>
                LEVEL {level} • GARDEN
              </span>
              <div className="flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded" style={{ color: '#D97706', background: '#F59E0B14' }}>
                <Flame className="w-3.5 h-3.5 fill-[#F59E0B]/20 text-[#F59E0B] animate-pulse" />
                <span>STREAK: {streakDays}D (+{(Math.min(10, streakDays) * 5)}% bonus)</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-1.5 mt-2">
              <Sprout className="w-4 h-4 shrink-0" style={{ color: '#58CC02' }} />
              <h4 className="text-xs font-black mt-0.5 tracking-wide uppercase font-mono" style={{ color: '#3C3C3C' }}>
                {experience < 50 ? "Calm Seed" :
                 experience < 150 ? "Little Sprout" :
                 experience < 280 ? "Steady Growth Vine" :
                 experience < 450 ? "Flourishing Laurel" : "Full Bloom Tree"}
              </h4>
            </div>
          </div>

          {/* THE GROWING PROCEDURAL TREE SVG WORKSPACE */}
          <div className="relative w-full h-64 flex justify-center items-end my-2">
            
            {/* Dynamic style-specific graphic overlays */}
            {selectedArtStyle === 'cyberpunk' && (
              <div className="absolute inset-x-0 bottom-6 h-36 bg-linear-to-t from-fuchsia-950/15 via-transparent to-transparent pointer-events-none border-b border-fuchsia-500/30" />
            )}
            {selectedArtStyle === 'cosmic' && (
              <div className="absolute inset-0 bg-radial-gradient(ellipse_at_center,rgba(99,102,241,0.15),transparent_60%) pointer-events-none" />
            )}
            {selectedArtStyle === 'sakura' && (
              <div className="absolute inset-0 bg-linear-to-b from-sky-950/5 to-rose-950/5 pointer-events-none" />
            )}

            {/* Simulated floating ecosystem particles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
              {particles.map(p => (
                <motion.div
                  key={p.id}
                  animate={{
                    y: [p.y, p.y - 120],
                    x: [p.x, p.x + (Math.sin(p.id) * 20)],
                    opacity: [0, 0.8, 0],
                  }}
                  transition={{
                    duration: p.duration,
                    delay: p.delay,
                    repeat: Infinity,
                    ease: 'linear'
                  }}
                  className="absolute rounded-full"
                  style={{
                    left: `${p.x}%`,
                    top: `100%`,
                    width: `${p.size}px`,
                    height: `${p.size}px`,
                    backgroundColor: p.color,
                    boxShadow: selectedArtStyle === 'cyberpunk' || selectedArtStyle === 'cosmic' 
                      ? `0 0 10px ${p.color}` 
                      : 'none'
                  }}
                />
              ))}
            </div>

            <motion.svg 
              viewBox="0 0 200 200" 
              className="w-full h-full max-y-64 scale-y-105 select-none"
              animate={isPulsing ? { scale: [1, 1.04, 1] } : {}}
              transition={{ duration: 0.6 }}
            >
              {/* Dynamic Theme Color Codes */}
              {/* POT / ROOT SYSTEM DESIGN */}
              {selectedArtStyle === 'cyberpunk' ? (
                <g>
                  {/* Cyber wireframe pot */}
                  <line x1="60" y1="180" x2="140" y2="180" stroke="#06b6d4" strokeWidth="1" strokeDasharray="3,3" />
                  <polygon points="72,175 128,175 120,192 80,192" fill="#1e1b4b" stroke="#ec4899" strokeWidth="1.5" />
                  <rect x="68" y="170" width="64" height="5" rx="1" fill="#0f172a" stroke="#06b6d4" strokeWidth="1.5" />
                  {/* Neon sun grid in backdrop */}
                  <circle cx="100" cy="120" r="30" fill="none" stroke="#f43f5e" strokeWidth="1" strokeDasharray="4,4" className="opacity-30" />
                </g>
              ) : selectedArtStyle === 'sakura' ? (
                <g>
                  {/* Slate stone pot */}
                  <polygon points="74,175 126,175 122,192 78,192" fill="#334155" stroke="#475569" strokeWidth="1.5" />
                  <rect x="71" y="170" width="58" height="5" rx="3" fill="#1e293b" />
                  {/* Little zen rock representation */}
                  <ellipse cx="65" cy="172" rx="6" ry="3.5" fill="#64748b" />
                </g>
              ) : selectedArtStyle === 'cosmic' ? (
                <g>
                  {/* Glowing interstellar ring base */}
                  <ellipse cx="100" cy="180" rx="35" ry="4" fill="none" stroke="#6366f1" strokeWidth="1.5" className="animate-pulse" />
                  <circle cx="100" cy="180" r="1.5" fill="#facc15" />
                  <ellipse cx="100" cy="173" rx="28" ry="4" fill="#0f172a" stroke="#3b82f6" strokeWidth="1.2" />
                </g>
              ) : selectedArtStyle === 'fibonacci' ? (
                <g>
                  {/* Spiraled geometric bronze pot */}
                  <polygon points="72,175 128,175 120,192 80,192" fill="#78350f" stroke="#d97706" strokeWidth="1.5" />
                  <rect x="68" y="170" width="64" height="5" rx="1.5" fill="#451a03" stroke="#d97706" strokeWidth="1.2" />
                  {/* Golden proportion circle overlays */}
                  <circle cx="100" cy="172" r="16.18" fill="none" stroke="#d97706" strokeWidth="0.5" strokeDasharray="2,2" className="opacity-40" />
                </g>
              ) : (
                // Emerald base
                <g>
                  <ellipse cx="100" cy="184" rx="35" ry="5" fill="#1e293b" />
                  <polygon points="72,170 128,170 122,186 78,186" fill="#1b2e35" stroke="#14532d" strokeWidth="1.5" />
                  <rect x="70" y="165" width="60" height="5" rx="1.5" fill="#14532d" />
                  <ellipse cx="100" cy="166" rx="28" ry="2" fill="#022c22" />
                </g>
              )}

              {/* TREE PHYSICAL BODY GROWING GEOMETRY */}
              {experience >= 10 && (
                <g>
                  {/* TRUNK LINE - grows taller depending on level/experience */}
                  <motion.path 
                    d={`M100 170 Q101 135 100 ${trunkHeight}`} 
                    fill="none" 
                    stroke={
                      selectedArtStyle === 'cyberpunk' ? "#ec4899" :
                      selectedArtStyle === 'sakura' ? "#1e293b" :
                      selectedArtStyle === 'cosmic' ? "#818cf8" :
                      selectedArtStyle === 'fibonacci' ? "#d97706" : "#059669"
                    } 
                    strokeWidth={thickness} 
                    strokeLinecap="round" 
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.2 }}
                  />

                  {/* BRANCH LEFT: Unlocks at 50 XP */}
                  {experience >= 50 && (
                    <motion.path 
                      d={`M100 ${trunkHeight + 30} Q${100 - branchSpread / 2} ${trunkHeight + 15} ${100 - branchSpread} ${trunkHeight + 5}`}
                      fill="none" 
                      stroke={
                        selectedArtStyle === 'cyberpunk' ? "#a855f7" :
                        selectedArtStyle === 'sakura' ? "#334155" :
                        selectedArtStyle === 'cosmic' ? "#60a5fa" :
                        selectedArtStyle === 'fibonacci' ? "#f59e0b" : "#10b981"
                      }
                      strokeWidth={Math.max(1.5, thickness * 0.6)} 
                      strokeLinecap="round"
                    />
                  )}

                  {/* BRANCH RIGHT: Unlocks at 120 XP */}
                  {experience >= 120 && (
                    <motion.path 
                      d={`M100 ${trunkHeight + 15} Q${100 + branchSpread / 2} ${trunkHeight + 5} ${100 + branchSpread} ${trunkHeight - 5}`}
                      fill="none" 
                      stroke={
                        selectedArtStyle === 'cyberpunk' ? "#06b6d4" :
                        selectedArtStyle === 'sakura' ? "#334155" :
                        selectedArtStyle === 'cosmic' ? "#6366f1" :
                        selectedArtStyle === 'fibonacci' ? "#f97316" : "#10b981"
                      }
                      strokeWidth={Math.max(1.5, thickness * 0.5)} 
                      strokeLinecap="round"
                    />
                  )}

                  {/* CENTRAL CROWN FORWARD BRANCH: Unlocks at 220 XP */}
                  {experience >= 220 && (
                    <motion.path 
                      d={`M100 ${trunkHeight} Q95 ${trunkHeight - 15} 92 ${trunkHeight - 35}`}
                      fill="none" 
                      stroke={
                        selectedArtStyle === 'cyberpunk' ? "#f43f5e" :
                        selectedArtStyle === 'sakura' ? "#475569" :
                        selectedArtStyle === 'cosmic' ? "#fbbf24" :
                        selectedArtStyle === 'fibonacci' ? "#eab308" : "#047857"
                      }
                      strokeWidth={Math.max(1.2, thickness * 0.45)} 
                      strokeLinecap="round"
                    />
                  )}

                  {/* LEAF NODES AND THEME GRAPHICAL CLUSTERS */}
                  {Array.from({ length: leavesCount }).map((_, i) => {
                    // Spread coordinates along active growing branches
                    const angle = (i * Math.PI) / (leavesCount - 1 || 1);
                    const leafX = 100 + Math.cos(angle) * (branchSpread + (i * 2));
                    const leafY = trunkHeight + Math.sin(angle) * 30 - 15;

                    return (
                      <g key={i} className="transition-all duration-500">
                        {selectedArtStyle === 'cyberpunk' ? (
                          // Neon Holographic Cube leaf
                          <motion.rect
                            x={leafX - 3.5}
                            y={leafY - 3.5}
                            width="7"
                            height="7"
                            rx="1.5"
                            fill="#06b6d4"
                            stroke="#ec4899"
                            strokeWidth="1"
                            animate={{ scale: [1, 1.15, 1], rotate: [0, 45, 0] }}
                            transition={{ repeat: Infinity, duration: 2 + i * 0.3 }}
                          />
                        ) : selectedArtStyle === 'sakura' ? (
                          // Soft delicate cherry blossom petal
                          <motion.path
                            d={`M${leafX} ${leafY} C${leafX - 6} ${leafY - 8} ${leafX - 10} ${leafY + 2} ${leafX} ${leafY}`}
                            fill="#f472b6"
                            opacity="0.95"
                            animate={{ scale: [1, 1.12, 1] }}
                            transition={{ repeat: Infinity, duration: 3 + i * 0.4 }}
                          />
                        ) : selectedArtStyle === 'cosmic' ? (
                          // Interstellar starry nodes
                          <g>
                            <motion.polygon
                              points={`${leafX},${leafY - 5} ${leafX + 1.2},${leafY - 1.2} ${leafX + 5},${leafY} ${leafX + 1.2},${leafY + 1.2} ${leafX},${leafY + 5} ${leafX - 1.2},${leafY + 1.2} ${leafX - 5},${leafY} ${leafX - 1.2},${leafY - 1.2}`}
                              fill="#facc15"
                              animate={{ scale: [1, 1.4, 0.8, 1], opacity: [0.7, 1, 0.7] }}
                              transition={{ repeat: Infinity, duration: 1.5 + i * 0.2 }}
                            />
                            <circle cx={leafX} cy={leafY} r="1" fill="#ffffff" />
                          </g>
                        ) : selectedArtStyle === 'fibonacci' ? (
                          // Golden logarithmic ratio concentric circles
                          <circle 
                            cx={leafX} 
                            cy={leafY} 
                            r={Math.min(8, 2.5 + i * 0.618)} 
                            fill="none" 
                            stroke="#eab308" 
                            strokeWidth="0.8" 
                            strokeDasharray="1.618, 1.618"
                          />
                        ) : (
                          // Classic emerald fresh leaf
                          <motion.path 
                            d={`M${leafX} ${leafY} C${leafX - 8} ${leafY - 12} ${leafX - 14} ${leafY + 2} ${leafX} ${leafY}`} 
                            fill="#34d399" 
                            stroke="#047857"
                            strokeWidth="0.5"
                          />
                        )}
                      </g>
                    );
                  })}

                  {/* Level 5+ Sacred Lotus Flower */}
                  {level >= 5 && (
                    <g transform={`translate(100, ${trunkHeight - 12})`} className="animate-pulse">
                      {selectedArtStyle === 'cyberpunk' ? (
                        <polygon points="0,-10 -6,4 6,4" fill="#a855f7" stroke="#06b6d4" strokeWidth="1" />
                      ) : selectedArtStyle === 'sakura' ? (
                        <path d="M0 -12 C-10 2 -4 8 0 4 C4 8 10 2 0 -12 Z" fill="#ec4899" opacity="0.9" />
                      ) : selectedArtStyle === 'cosmic' ? (
                        <circle cx="0" cy="-6" r="6" fill="violet" className="animate-ping opacity-25" />
                      ) : (
                        <polygon points="0,-12 -8,2 8,2" fill="#fb7185" />
                      )}
                      <circle cx="0" cy="-3" r="2.5" fill="#fbbf24" />
                    </g>
                  )}
                </g>
              )}
            </motion.svg>
          </div>

          {/* Art style controller lock state check helper */}
          <div className="w-full text-center py-2 z-10 border-t border-slate-200 mt-2">
            <div className="flex justify-between items-center text-[9px] text-slate-400 font-mono mb-1">
              <span>Nutrient reservoir</span>
              <span>{experience} total N-XP</span>
            </div>
            <div className="w-full bg-white h-2 rounded-full overflow-hidden border border-slate-200">
              <div 
                className="bg-emerald-500 h-full transition-all duration-300" 
                style={{ width: `${progressInLevel}%` }}
              />
            </div>
            <div className="flex justify-between text-[7px] text-slate-500 uppercase tracking-widest font-mono mt-1">
              <span>Lvl {level}</span>
              <span>{100 - progressInLevel} XP to Level {level+1}</span>
            </div>
          </div>

          {/* STREAK ADJUSTER / STEPS DEV CONTROLLER (Highly convenient testing widget) */}
          <div className="w-full py-2 px-3 bg-white rounded-xl mt-1 border border-slate-200 flex justify-between items-center z-10 relative">
            <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wide">Change streak (Testing):</span>
            <div className="flex items-center gap-1.5">
              <button 
                type="button"
                onClick={() => {
                  setStreakDays(curr => Math.max(1, curr - 1));
                  playSynthesizedChime('uncheck');
                }}
                className="w-5 h-5 bg-white hover:bg-white text-slate-500 hover:text-[#3C3C3C] rounded flex items-center justify-center font-mono text-xs font-black transition cursor-pointer"
              >
                -
              </button>
              <span className="text-[10px] font-mono font-bold text-amber-400 px-1.5">{streakDays} Days</span>
              <button 
                type="button"
                onClick={() => {
                  setStreakDays(curr => Math.min(15, curr + 1));
                  playSynthesizedChime('check');
                }}
                className="w-5 h-5 bg-white hover:bg-white text-slate-500 hover:text-[#3C3C3C] rounded flex items-center justify-center font-mono text-xs font-black transition cursor-pointer"
              >
                +
              </button>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Interactive Habit Stack & Custom Art Style Unlock Board */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* THE ART STYLES SELECTOR PANEL */}
          <div className="space-y-3 bg-white p-4 rounded-2xl border border-slate-200">
            <h5 className="text-[11px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5 leading-none">
              <Palette className="w-4 h-4 text-emerald-400" /> Unlockable Vegetative Art Styles
            </h5>
            
            <div className="grid grid-cols-5 gap-2 pt-1">
              {ART_STYLE_SPECS.map(styleSpec => {
                const isLocked = level < styleSpec.minLevel;
                const isActive = selectedArtStyle === styleSpec.id;

                return (
                  <button
                    key={styleSpec.id}
                    onClick={() => handleSelectStyle(styleSpec.id, isLocked)}
                    className={`relative p-2.5 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-white border-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.2)] text-[#3C3C3C]' 
                        : isLocked 
                          ? 'bg-white border-slate-200 text-slate-600 opacity-60 cursor-not-allowed'
                          : 'bg-white border-slate-200 text-slate-600 hover:border-slate-200 hover:bg-white'
                    }`}
                    title={styleSpec.desc}
                  >
                    {isLocked ? (
                      <Lock className="w-4 h-4 text-slate-600" />
                    ) : (
                      <div className={`w-3 h-3 rounded-full bg-${styleSpec.colorName}-500 mb-1 shrink-0 ${styleSpec.id === 'cyberpunk' ? 'bg-fuchsia-500 shadow-[0_0_8px_#ec4899]' : styleSpec.id === 'cosmic' ? 'bg-indigo-400 shadow-[0_0_8px_#3b82f6]' : styleSpec.id === 'fibonacci' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                    )}

                    <span className="text-[9px] font-bold mt-1 tracking-tight truncate max-w-full text-center">
                      {styleSpec.name.split(' ')[1] || styleSpec.name}
                    </span>

                    <span className="text-[7.5px] font-mono text-zinc-500 mt-0.5 uppercase tracking-wide">
                      {isLocked ? `Lvl ${styleSpec.minLevel}` : 'ACTIVE'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* CHECKLIST CONTAINER */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-[#3C3C3C] flex items-center gap-1.5">
                  <Leaf className="w-4 h-4 text-emerald-400" />
                  Somatic & Prefrontal Habit Lab
                </h3>
                <p className="text-[10px] text-slate-400">Tick daily Micro-habits to synthesize essential cognitive nutrients.</p>
              </div>
              <button
                onClick={handleResetDay}
                className="flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-white text-slate-600 hover:text-[#3C3C3C] text-[10px] uppercase font-black tracking-wider border border-slate-200 rounded-xl cursor-pointer transition duration-150"
                title="Reset completion states"
              >
                <RefreshCw className="w-3 h-3" />
                New Day
              </button>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              <AnimatePresence>
                {habits.map((habit) => (
                  <motion.div
                    key={habit.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className={`flex justify-between items-center p-3 rounded-2xl border transition-all ${
                      habit.completed 
                        ? 'bg-white border-emerald-900/50 shadow-[0_2px_10px_rgba(16,185,129,0.06)]' 
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={(e) => handleToggleHabit(habit.id, e)}
                        className={`w-5.5 h-5.5 rounded-lg border flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                          habit.completed 
                            ? 'bg-emerald-500 border-emerald-500 text-slate-950' 
                            : 'border-slate-200 bg-white hover:border-emerald-500/80 hover:bg-emerald-50 text-slate-500 hover:text-[#3C3C3C]'
                        }`}
                      >
                        {habit.completed && <Check className="w-3.5 h-3.5 stroke-[3.5]" />}
                      </button>
                      
                      <div className="leading-tight">
                        <p className={`text-xs font-bold leading-normal ${
                          habit.completed ? 'text-slate-500 line-through' : 'text-[#3C3C3C]'
                        }`}>
                          {habit.name}
                        </p>
                        <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest mt-0.5 block font-medium">
                          Category: {habit.category} • Base +{habit.xpWorth} N-XP • Stack Modifier x{(1 + Math.min(10, streakDays) * 0.05).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteHabit(habit.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-50 rounded-lg cursor-pointer transition shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* QUICK ADD HABIT FORM */}
            <form onSubmit={handleAddHabit} className="flex gap-2 p-1 bg-white border border-slate-200 rounded-2xl">
              <input 
                type="text" 
                placeholder="Declare another micro-behavior habit stack..." 
                value={newHabitName}
                onChange={(e) => setNewHabitName(e.target.value)}
                className="flex-1 text-xs text-[#3C3C3C] bg-transparent px-3 outline-hidden"
              />
              
              <select
                value={newHabitCategory}
                onChange={(e) => setNewHabitCategory(e.target.value as any)}
                className="text-[11px] bg-white border border-slate-200 rounded-xl px-2.5 py-1 text-slate-500 outline-hidden tracking-wide"
              >
                <option value="Mind">🧠 Mind</option>
                <option value="Somatic">🧘 Somatic</option>
                <option value="Nutrition">🍏 Nutrition</option>
                <option value="Social">👩‍❤️‍👨 Social</option>
              </select>

              <button
                type="submit"
                className="p-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-xl cursor-pointer transition duration-150 shrink-0"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
              </button>
            </form>

            {/* Finch micro-rewards theory footer card */}
            <div className="p-3.5 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center gap-3">
              <Trophy className="w-7 h-7 text-indigo-400 shrink-0" />
              <div>
                <p className="text-[11px] font-black text-indigo-700 flex items-center gap-1.5 leading-none">
                  <span>Reinforcement Psychology Index</span>
                  <span className="text-[8px] bg-indigo-100 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">Finch Reinforcement Model</span>
                </p>
                <p className="text-[10px] text-slate-400 leading-relaxed mt-1.5">
                  Visualizing successive behavior achievements as progressive fractal changes (such as Sakura petal growth or golden spirals) activates reward receptors, converting hard wellness tasks into positive play loops.
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
