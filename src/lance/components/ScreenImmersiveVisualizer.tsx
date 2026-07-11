import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, X, Activity, Moon, Zap, Play, Pause, Volume2, Heart, 
  Compass, Brain, Eye, Smile, Info, Layers, Sliders, RefreshCw, ChevronRight
} from 'lucide-react';

interface ScreenImmersiveVisualizerProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  quickCalmActive?: boolean;
}

type ModeTheme = 'hyper-saturation' | 'sunset-hologram' | 'cyber-cosmic';

export default function ScreenImmersiveVisualizer({ isOpen, onClose, userName, quickCalmActive = false }: ScreenImmersiveVisualizerProps) {
  const [activeTheme, setActiveTheme] = useState<ModeTheme>('hyper-saturation');
  const [activeTab, setActiveTab] = useState<'visualizer' | 'somatic-node' | 'metrics' | 'soundscapes'>('visualizer');
  
  // Interactive core state
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [breathCycleCount, setBreathCycleCount] = useState(0);
  const [seconds, setSeconds] = useState(4);
  const [coherence, setCoherence] = useState(88);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activeFrequency, setActiveFrequency] = useState(432); // Solfeggio frequency (432Hz)
  const [neuralState, setNeuralState] = useState('Deep Flow State');
  const [customVibeInput, setCustomVibeInput] = useState('');

  const [hapticsEnabled, setHapticsEnabled] = useState<boolean>(true);
  const [hapticsSupported, setHapticsSupported] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      setHapticsSupported(true);
    }
  }, []);
  
  // Custom neon particles/bubbles
  const [particles, setParticles] = useState<Array<{ id: number; word: string; x: number; y: number; size: number; color: string; vx: number; vy: number }>>([
    { id: 1, word: 'Euphoria', x: 25, y: 35, size: 75, color: '#ff007f', vx: 0.12, vy: -0.08 },
    { id: 2, word: 'Serenity', x: 75, y: 25, size: 85, color: '#00ffff', vx: -0.09, vy: 0.14 },
    { id: 3, word: 'Transcend', x: 50, y: 70, size: 90, color: '#bd00ff', vx: 0.07, vy: -0.11 },
    { id: 4, word: 'Lucidity', x: 20, y: 65, size: 70, color: '#39ff14', vx: -0.14, vy: -0.06 },
    { id: 5, word: 'Aether', x: 80, y: 75, size: 80, color: '#ffaa00', vx: 0.11, vy: 0.09 },
  ]);

  // Audio track titles
  const tracks = [
    { name: "Astral Coherence (432Hz)", description: "Harmonic Solfeggio wave for grounding", hz: 432, category: "Alpha" },
    { name: "Quantum Dreamwave (528Hz)", description: "Cellular renewal and emotional peace", hz: 528, category: "Theta" },
    { name: "Cosmic Biosphere (963Hz)", description: "High-saturation deep sensory repair", hz: 963, category: "Gamma" }
  ];
  const [selectedTrackIndex, setSelectedTrackIndex] = useState(0);

  // Update particles positions over time (drift effect)
  useEffect(() => {
    let animationFrameId: number;
    const updateMotion = () => {
      setParticles(prev => 
        prev.map(p => {
          let nx = p.x + p.vx;
          let ny = p.y + p.vy;
          let nvx = p.vx;
          let nvy = p.vy;

          // Bounce walls
          if (nx < 10 || nx > 90) nvx = -nvx;
          if (ny < 15 || ny > 85) nvy = -nvy;

          return { ...p, x: nx, y: ny, vx: nvx, vy: nvy };
        })
      );
      animationFrameId = requestAnimationFrame(updateMotion);
    };

    animationFrameId = requestAnimationFrame(updateMotion);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // Simulator breathing rhythm loop
  useEffect(() => {
    if (!isBreathing) return;
    
    const interval = setInterval(() => {
      setSeconds(prev => {
        if (prev <= 1) {
          if (breathPhase === 'Inhale') {
            setBreathPhase('Hold');
            return 4;
          } else if (breathPhase === 'Hold') {
            setBreathPhase('Exhale');
            return 4;
          } else {
            setBreathPhase('Inhale');
            setBreathCycleCount(c => c + 1);
            setCoherence(c => Math.min(99, Math.max(75, c + Math.floor(Math.random() * 5) - 1)));
            return 4;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isBreathing, breathPhase]);

  // Trigger haptic vibration patterns on immersive breathing simulation transitions
  useEffect(() => {
    if (!isBreathing || !hapticsEnabled) return;

    const triggerHaptic = (pattern: number | number[]) => {
      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        try {
          navigator.vibrate(pattern);
        } catch (e) {
          console.warn("Tactile portal feedback blocked:", e);
        }
      }
    };

    switch (breathPhase) {
      case 'Inhale':
        // Double soft flutter representing intake expand
        triggerHaptic([40, 50, 45]);
        break;
      case 'Hold':
        // Firm singular peak anchor pulse
        triggerHaptic(120);
        break;
      case 'Exhale':
        // Continuous release hum wave
        triggerHaptic([60, 110, 60]);
        break;
      default:
        break;
    }
  }, [breathPhase, isBreathing, hapticsEnabled]);

  // Simulated live fluctuating coherence stats
  useEffect(() => {
    const timer = setInterval(() => {
      if (isBreathing) {
        // High stability
        setCoherence(c => Math.min(100, Math.max(90, c + (Math.random() > 0.5 ? 0.3 : -0.3))));
      } else {
        // Natural fluctuations
        setCoherence(c => Math.min(96, Math.max(76, c + (Math.random() > 0.5 ? 0.6 : -0.6))));
      }
    }, 1500);
    return () => clearInterval(timer);
  }, [isBreathing]);

  if (!isOpen) return null;

  // Visual styling variants tailored to specific selected themes
  const getThemeStyles = () => {
    if (quickCalmActive) {
      return {
        bg: "from-[#f4f6fbf0] via-[#e2e8f0e0] to-[#cbd5e1d0] text-slate-800",
        gradientOrb1: "bg-emerald-200/20",
        gradientOrb2: "bg-teal-200/15",
        primaryGlow: "#0f766e",
        primaryAccent: "text-slate-800",
        accentBtn: "bg-gradient-to-r from-teal-600 via-teal-600 to-[#115e59] text-white font-extrabold",
        glassBorder: "border-slate-300/40",
        glowText: "shadow-slate-400/5"
      };
    }

    switch(activeTheme) {
      case 'sunset-hologram':
        return {
          bg: "from-[#fcf7f2] via-[#fef1e6] to-[#fce4d3] text-slate-800",
          gradientOrb1: "bg-orange-300",
          gradientOrb2: "bg-teal-300",
          primaryGlow: "#ff9f43",
          primaryAccent: "text-orange-700",
          accentBtn: "bg-gradient-to-r from-orange-400 to-amber-500 text-white font-black",
          glassBorder: "border-orange-300/40",
          glowText: "shadow-orange-400/10"
        };
      case 'cyber-cosmic':
        return {
          bg: "from-[#e6fcf8] via-[#cefbf2] to-[#bbf7ed] text-slate-800",
          gradientOrb1: "bg-[#14b8a6]",
          gradientOrb2: "bg-[#0ea5e9]",
          primaryGlow: "#14b8a6",
          primaryAccent: "text-teal-800",
          accentBtn: "bg-gradient-to-r from-teal-500 to-sky-500 text-white font-black",
          glassBorder: "border-teal-300/50",
          glowText: "shadow-teal-400/10"
        };
      case 'hyper-saturation':
      default:
        return {
          bg: "from-[#edfdfa] via-[#dafcf4] to-[#c8f9f0] text-slate-800",
          gradientOrb1: "bg-emerald-300",
          gradientOrb2: "bg-cyan-300",
          primaryGlow: "#0ea5e9",
          primaryAccent: "text-emerald-800",
          accentBtn: "bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white font-black",
          glassBorder: "border-emerald-300/50",
          glowText: "shadow-emerald-400/10"
        };
    }
  };

  const theme = getThemeStyles();

  // Handle particle explosion / tap interaction
  const handleParticleTap = (id: number, word: string) => {
    setNeuralState(`Harmonized with ${word}`);
    setCoherence(c => Math.min(100, c + 2));
    // Pop particle with velocity boost
    setParticles(prev => prev.map(p => {
      if (p.id === id) {
        return { 
          ...p, 
          vx: p.vx * 1.8, 
          vy: p.vy * 1.8,
          size: Math.min(110, p.size + 10)
        };
      }
      return p;
    }));
  };

  const handleCustomVibeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customVibeInput.trim()) return;
    const newParticle = {
      id: Date.now(),
      word: customVibeInput.trim().substring(0, 15),
      x: 30 + Math.random() * 40,
      y: 30 + Math.random() * 40,
      size: 70 + Math.floor(Math.random() * 20),
      color: activeTheme === 'sunset-hologram' ? '#ff9f43' : activeTheme === 'cyber-cosmic' ? '#06b6d4' : '#bd00ff',
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4
    };
    setParticles(prev => [newParticle, ...prev.slice(0, 6)]);
    setCustomVibeInput('');
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 flex justify-center items-center p-0 md:p-4 backdrop-blur-md"
        id="immersive-modal-container"
      >
        {/* Deep contrast neon background canvas */}
        <div className={`w-full max-w-[490px] h-full md:h-[820px] rounded-0 md:rounded-[40px] bg-gradient-to-b ${theme.bg} relative overflow-hidden flex flex-col border-0 md:border-4 border-teal-200/40 shadow-[0_30px_100px_rgba(13,148,136,0.1)] text-left`}>
          
          {/* VOLUMETRIC LIGHTING: Slowly moving ambient fluorescent blur orbs */}
          <motion.div 
            animate={{
              x: [100, -80, 50, 100],
              y: [50, 180, -30, 50],
            }}
            transition={{
              duration: quickCalmActive ? 80 : 25,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className={`absolute w-72 h-72 rounded-full ${theme.gradientOrb1} ${quickCalmActive ? 'opacity-10' : 'opacity-30'} blur-3xl pointer-events-none transition-all duration-1000`} 
          />
          <motion.div 
            animate={{
              x: [-120, 100, -30, -120],
              y: [120, -50, 200, 120],
            }}
            transition={{
              duration: quickCalmActive ? 100 : 32,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className={`absolute w-80 h-80 rounded-full ${theme.gradientOrb2} ${quickCalmActive ? 'opacity-8' : 'opacity-25'} blur-3xl pointer-events-none transition-all duration-1000`} 
          />

          {/* Holographic matrix subtle line grids */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(13,148,136,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(13,148,136,0.015)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

          {/* Premium UI Top Header */}
          <div className="z-10 p-5 pb-3 flex items-center justify-between bg-white/40 border-b border-teal-200/50 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-lg bg-teal-500/20 border border-teal-400/40 animate-pulse">
                <div className="w-1.5 h-1.5 rounded-full bg-teal-500" />
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-[9px] font-black tracking-widest text-[#0d9488] uppercase bg-teal-100/60 px-1.5 py-0.5 rounded-md border border-teal-200/50">AETHER LAB</span>
                  <span className="text-[9px] font-bold text-teal-800/60">v2026.1</span>
                </div>
                <h2 className="text-[13px] font-black text-teal-950 tracking-wide uppercase leading-none mt-1">Holographic Mindspace</h2>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-teal-100/70 border border-teal-200/60 text-teal-800 hover:text-teal-950 hover:bg-teal-200/60 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Secondary Subheader Controls - Theme Switcher */}
          <div className="z-10 px-5 py-2.5 bg-teal-50/40 flex items-center justify-between border-b border-teal-200/50 overflow-x-auto gap-3">
            <span className="text-[9px] font-black text-teal-800/80 uppercase tracking-widest flex items-center gap-1.5 shrink-0">
              <Sliders className="w-3 h-3 text-teal-600/60" /> Tone Spectrum:
            </span>
            <div className="flex gap-1.5">
              {(['hyper-saturation', 'sunset-hologram', 'cyber-cosmic'] as ModeTheme[]).map((themeName) => (
                <button
                  key={themeName}
                  onClick={() => {
                    setActiveTheme(themeName);
                    setCoherence(c => Math.min(100, c + 3));
                  }}
                  className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider transition border ${
                    activeTheme === themeName
                      ? 'bg-teal-600 border-teal-500 text-white shadow-xs'
                      : 'bg-white/70 border-teal-200 text-teal-700 hover:text-teal-900'
                  }`}
                >
                  {themeName.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* SCROLLABLE INTERACTIVE PLAYGROUND CANVAS AREA */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5 z-10 scrollbar-none pb-28">

            {quickCalmActive && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-3xl bg-emerald-50/90 border border-emerald-200 text-left flex items-start gap-3 shadow-3xs"
              >
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-700 mt-0.5">
                  <span className="text-sm">🌿</span>
                </div>
                <div className="space-y-1">
                  <h4 className="text-[10.5px] font-black text-emerald-950 uppercase tracking-widest">
                    Quick Calm Sanctuary Engaged
                  </h4>
                  <p className="text-[10px] font-semibold text-emerald-800/80 leading-relaxed">
                    This mindspace has automatically transitioned to custom slow-moving bioluminescent waves and reduced ambient opacity to shield your senses. Daily notification reminders are actively silenced during your grounding window.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Live volumetric Biofeedback banner */}
            <div className="relative overflow-hidden p-6 rounded-3xl bg-white/75 border border-teal-200/50 shadow-[0_8px_30px_rgba(13,148,136,0.03)] space-y-3">
              {/* Corner tech highlights */}
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-teal-400/40" />
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-teal-400/40" />
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-teal-400/40" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-teal-400/40" />

              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[8.5px] font-black uppercase text-teal-800/60 tracking-widest block">Quantum Bio-Marker</span>
                  <h3 className="font-sans text-lg font-black text-teal-950 tracking-tight mt-0.5">
                    Welcome{userName ? `, ${userName}` : ''}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-[8px] font-black uppercase text-teal-700 bg-teal-100/50 border border-teal-200/50 px-2 py-0.5 rounded-full">Active Sync</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-1">
                <div className="p-2.5 rounded-2xl bg-white/60 border border-teal-100/70 shadow-2xs">
                  <span className="text-[8px] font-bold text-teal-800/60 block uppercase">Signal Sync</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-sm font-black text-teal-950 font-mono">{coherence.toFixed(1)}%</span>
                  </div>
                </div>
                <div className="p-2.5 rounded-2xl bg-white/60 border border-teal-100/70 shadow-2xs">
                  <span className="text-[8px] font-bold text-teal-800/60 block uppercase">Resonance</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-sm font-black text-teal-950 font-mono">{activeFrequency} Hz</span>
                  </div>
                </div>
                <div className="p-2.5 rounded-2xl bg-white/60 border border-teal-100/70 shadow-2xs">
                  <span className="text-[8px] font-bold text-teal-800/60 block uppercase">Flow State</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-xs font-black text-teal-950 leading-tight break-words">{neuralState}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* NAVIGATION TABS WITH NEON SUB-PIXEL INDICATORS */}
            <div className="p-1 bg-teal-100/30 rounded-2xl border border-teal-200/40 flex">
              {(['visualizer', 'somatic-node', 'metrics', 'soundscapes'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-1.5 text-[10px] font-black uppercase tracking-wider transition rounded-xl relative ${
                    activeTab === tab 
                      ? 'text-teal-950 bg-white/90 shadow-2xs font-black' 
                      : 'text-teal-800/60 hover:text-teal-900'
                  }`}
                >
                  <span>{tab.replace('-', ' ')}</span>
                  {activeTab === tab && (
                    <motion.div 
                      layoutId="neonTabStrip"
                      className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-teal-400 to-emerald-500 rounded-full" 
                    />
                  )}
                </button>
              ))}
            </div>

            {/* TAB WINDOW 1: CORE VISUALIZER & BREATHING SYNC */}
            {activeTab === 'visualizer' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-5"
              >
                {/* INTERACTIVE NEUROMORPHIC BREATHING CIRCLE */}
                <div className="bg-white/70 border border-teal-200/50 rounded-[30px] p-6 text-center space-y-5 relative overflow-hidden shadow-xs backdrop-blur-xl">
                  {/* Outer glowing ring guide */}
                  <div className="text-center">
                    <div className="inline-flex items-center gap-1 bg-teal-50 border border-teal-100 px-2.5 py-1 rounded-full">
                      <Zap className={`w-3 h-3 text-amber-500 ${isBreathing ? 'animate-bounce' : ''}`} />
                      <span className="text-[9px] font-black tracking-widest text-[#d97706] uppercase">
                        {isBreathing ? `Syncing Phase: ${breathPhase}` : 'Static Calibration'}
                      </span>
                    </div>
                  </div>

                  {/* 2026 Core Vector breathing sync module */}
                  <div className="flex justify-center items-center py-5 relative h-56">
                    {/* Glowing volumetric portal behind */}
                    <div className="absolute w-36 h-36 rounded-full bg-teal-400/20 blur-xl pointer-events-none" />

                    {/* Continuous rhythmic breathing wave visual helper */}
                    {isBreathing && (
                      <motion.div
                        animate={{
                          scale: [1, 2.0],
                          opacity: [0.6, 0]
                        }}
                        transition={{
                          repeat: Infinity,
                          duration: 4.0,
                          ease: "easeOut"
                        }}
                        className="absolute w-28 h-28 rounded-full border-2 border-teal-500/40 pointer-events-none z-0"
                      />
                    )}

                    <motion.div
                      animate={{
                        scale: isBreathing
                          ? breathPhase === 'Inhale' ? 1.6 : breathPhase === 'Hold' ? 1.6 : 0.95
                          : 1.0,
                        rotate: isBreathing ? 360 : 0
                      }}
                      transition={{
                        duration: isBreathing ? 4 : 0.5,
                        ease: "easeInOut"
                      }}
                      style={{ originX: "50%", originY: "50%" }}
                      className="w-40 h-40 rounded-full border-2 border-teal-100 relative flex items-center justify-center bg-white shadow-md backdrop-blur-lg z-10"
                    >
                      {/* Secondary soft-shadow glass halo */}
                      <div className="absolute inset-2 rounded-full border border-dashed border-teal-300 animate-ping opacity-35" style={{ animationDuration: '6s' }} />

                      <svg className="absolute inset-0 w-full h-full p-2 overflow-visible select-none pointer-events-none" viewBox="0 0 100 100">
                        <defs>
                          <linearGradient id="neonGlowRing" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#0d9488" />
                            <stop offset="50%" stopColor="#22c55e" />
                            <stop offset="100%" stopColor="#0ea5e9" />
                          </linearGradient>
                          <radialGradient id="ringSpot" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
                          </radialGradient>
                        </defs>

                        {/* Volumetric spot circle */}
                        <circle cx="50" cy="50" r="38" fill="url(#ringSpot)" />

                        {/* Highly saturated neon stroke ring */}
                        <motion.circle
                          cx="50"
                          cy="50"
                          r="44"
                          fill="none"
                          stroke="url(#neonGlowRing)"
                          strokeWidth="2.5"
                          strokeDasharray="4 8"
                          animate={{ rotate: -360 }}
                          transition={{ repeat: Infinity, duration: 22, ease: "linear" }}
                        />
                      </svg>

                      {/* Central breathing telemetry read-out */}
                      <div className="flex flex-col items-center justify-center text-center z-10">
                        <span className="text-[10px] font-black uppercase text-teal-800 tracking-widest">
                          {isBreathing ? breathPhase : 'Ready'}
                        </span>
                        <div className="text-3xl font-black font-mono leading-none tracking-tight my-1 text-teal-950">
                          {isBreathing ? `${seconds}s` : 'INIT'}
                        </div>
                        <span className="text-[8px] font-bold text-teal-700/75 uppercase tracking-wider">
                          {isBreathing ? `${breathCycleCount} cycles` : 'Click below'}
                        </span>
                      </div>
                    </motion.div>
                  </div>

                  <p className="text-teal-900/75 text-[11px] font-semibold tracking-wide px-4">
                    {isBreathing 
                      ? "Keep your gaze softly focused on the glowing portal. Breathe in coordination with the expansion waves into standard deep physiological alignment."
                      : "Engage the tactile volumetric portal below to start your deep breathing cycle and watch your brain-heart-vibe coherence metrics harmonize."
                    }
                  </p>

                  <div className="pt-2">
                    <button
                      onClick={() => {
                        setIsBreathing(!isBreathing);
                        if (!isBreathing) {
                          setBreathPhase('Inhale');
                          setSeconds(4);
                        }
                      }}
                      className={`w-full py-3.5 px-6 rounded-2xl font-black text-xs uppercase tracking-widest transition duration-300 cursor-pointer shadow-lg hover:brightness-115 active:scale-98 ${theme.accentBtn}`}
                    >
                      {isBreathing ? '⏸ Deactivate Energy Sync' : '✨ Activate Somatic Breath Sync'}
                    </button>
                  </div>

                  {/* Integrated browser haptic feedback switch if supported */}
                  {hapticsSupported && isBreathing && (
                    <div className="flex justify-center pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setHapticsEnabled(!hapticsEnabled);
                          if (!hapticsEnabled) {
                            try {
                              navigator.vibrate(60);
                            } catch (e) {}
                          }
                        }}
                        className={`py-1.5 px-3 rounded-full text-[10px] font-black transition border outline-none cursor-pointer flex items-center justify-center gap-1 shrink-0 uppercase tracking-widest ${
                          hapticsEnabled
                            ? 'bg-teal-50 border-teal-200 text-teal-700 hover:bg-teal-100/55 shadow-xs'
                            : 'bg-slate-100/50 border-slate-200 text-slate-500 hover:bg-slate-200/55'
                        }`}
                        title={hapticsEnabled ? "Tactile vibration is ON" : "Tactile vibration is OFF"}
                      >
                        <span>{hapticsEnabled ? '📳 HAPTICS ON' : '🔕 HAPTICS OFF'}</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* REAL-TIME VECTOR FREQUENCY CHART */}
                <div className="bg-white/[0.02] border border-white/10 rounded-[30px] p-5 relative overflow-hidden shadow-xl backdrop-blur-md">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-1.5">
                      <Activity className="w-4 h-4 text-pink-500 animate-pulse" />
                      <span className="text-[10px] font-black text-white uppercase tracking-wider">Coherence Wave Sync Analyzer</span>
                    </div>
                    <span className="text-[8px] font-mono text-[#00ffff] bg-[#00ffff]/10 px-2 py-0.5 rounded border border-[#00ffff]/20">RT FREQ SPECTRUM</span>
                  </div>

                  {/* High Quality animated SVG path mapping */}
                  <div className="h-20 bg-white rounded-2xl flex items-center justify-center p-3 relative border border-white/5 overflow-hidden">
                    <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                      {/* Slow guiding sine waves */}
                      <path
                        d="M 0 20 Q 12 10, 25 20 T 50 20 T 75 20 T 100 20"
                        fill="none"
                        stroke="rgba(255, 255, 255, 0.08)"
                        strokeWidth="1.5"
                      />
                      {/* Interactive fluctuating signal trace mapping */}
                      <motion.path
                        animate={{
                          d: isBreathing 
                            ? "M 0 20 Q 12 8, 25 22 T 50 18 T 75 22 T 100 20"
                            : "M 0 18 Q 10 30, 20 12 T 40 28 T 60 10 T 80 25 T 100 22"
                        }}
                        transition={{
                          repeat: Infinity,
                          repeatType: "reverse",
                          duration: 3,
                          ease: "easeInOut"
                        }}
                        fill="none"
                        stroke="url(#chartGrad)"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                      <defs>
                        <linearGradient id="chartGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#ff007f" />
                          <stop offset="50%" stopColor="#bd00ff" />
                          <stop offset="100%" stopColor="#00ffff" />
                        </linearGradient>
                      </defs>
                    </svg>

                    <div className="absolute bottom-2 right-3 text-[7.5px] font-mono text-slate-500 uppercase tracking-widest">
                      Delta-Theta-Alpha Alignment Map
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB WINDOW 2: NEON FLOATING MOOD BUBBLES WALL */}
            {activeTab === 'somatic-node' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-5"
              >
                <div className="bg-white/[0.02] border border-white/10 rounded-[30px] p-5 space-y-4 relative overflow-hidden backdrop-blur-xl">
                  <div>
                    <span className="text-[8.5px] font-black uppercase text-[#bd00ff] tracking-widest block">Quantum Drift Wall</span>
                    <h3 className="font-sans text-base font-black text-white tracking-tight mt-0.5">Tactile Mindspace Nodes</h3>
                    <p className="text-[10.5px] text-slate-400 font-semibold leading-relaxed mt-1">
                      Tap the floating mood bubbles to integrate their resonance frequency and clear somatic tension. Enter custom intentions below to craft new bubbles.
                    </p>
                  </div>

                  {/* Immersive Drift Bounding Box with neon frame */}
                  <div className="w-full h-80 rounded-2xl bg-white border border-white/10 relative overflow-hidden shadow-inner-lg">
                    {/* Glowing coordinate lights */}
                    <div className="absolute top-2 left-2 text-[6.5px] font-mono text-slate-500 uppercase">SYS_GRID // A_NODE</div>
                    <div className="absolute bottom-2 left-2 text-[6.5px] font-mono text-slate-500 uppercase">DYN_DRIFT // ENABLED</div>
                    <div className="absolute bottom-2 right-2 text-[6.5px] font-mono text-slate-500 uppercase">PARTCOUNT: {particles.length}/7</div>

                    {/* Drifting state nodes */}
                    {particles.map((p) => {
                      return (
                        <button
                          key={p.id}
                          onClick={() => handleParticleTap(p.id, p.word)}
                          style={{
                            position: 'absolute',
                            left: `${p.x}%`,
                            top: `${p.y}%`,
                            width: `${p.size}px`,
                            height: `${p.size}px`,
                            transform: 'translate(-50%, -50%)',
                            boxShadow: `0 8px 32px rgba(0, 0, 0, 0.4), inset 0 2px 4px rgba(255,255,255,0.15), 0 0 15px ${p.color}30`,
                            borderColor: `${p.color}aa`,
                            background: `radial-gradient(circle at 30% 30%, ${p.color}25, ${p.color}05 70%)`
                          }}
                          className="rounded-full border backdrop-blur-xs flex flex-col items-center justify-center text-center p-2 text-white hover:brightness-125 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
                        >
                          <span className="text-[10px] font-black tracking-tight leading-none text-white drop-shadow-md">{p.word}</span>
                          <span className="text-[6.5px] font-black mt-1 uppercase opacity-65 tracking-wider font-mono text-slate-300">Resonant</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Float tag injector form */}
                  <form onSubmit={handleCustomVibeSubmit} className="flex gap-2">
                    <input
                      type="text"
                      className="flex-grow py-2 px-3.5 rounded-xl bg-white border border-white/10 text-xs font-semibold text-[#3C3C3C] focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                      placeholder="Insert your current mood impulse (e.g. Free, Calm, Quiet)..."
                      value={customVibeInput}
                      onChange={(e) => setCustomVibeInput(e.target.value)}
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-white text-black font-black text-[10.5px] uppercase tracking-wider hover:bg-slate-100 transition whitespace-nowrap active:scale-95 cursor-pointer"
                    >
                      + Float Vibe
                    </button>
                  </form>
                </div>
              </motion.div>
            )}

            {/* TAB WINDOW 3: PREMIUM CYBERMETRICS WIDGETS */}
            {activeTab === 'metrics' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 gap-4"
              >
                {/* CYBERNETIC SLEEP GRID DIAL */}
                <div className="bg-white/[0.02] border border-white/10 rounded-[30px] p-5 relative overflow-hidden backdrop-blur-xl space-y-4">
                  <div className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-white/5">
                    <div className="flex items-center gap-1.5">
                      <Moon className="w-4 h-4 text-indigo-400" />
                      <span className="text-[10px] font-black text-white uppercase tracking-wider">Volumetric Sleep Architecture</span>
                    </div>
                    <span className="text-[8.5px] font-mono text-slate-400">8h 12m SLEEP</span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-5">
                    {/* Cybernetic High-saturation radial segments */}
                    <div className="w-32 h-32 relative flex items-center justify-center shrink-0">
                      <svg className="w-full h-full" viewBox="0 0 100 100">
                        {/* Deep sleep track background */}
                        <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="6" />
                        
                        {/* High saturated cyan segment: Deep Sleep */}
                        <motion.circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="#00ffff"
                          strokeWidth="8"
                          strokeDasharray="251.2"
                          strokeDashoffset="120"
                          strokeLinecap="round"
                          className="drop-shadow-[0_0_8px_#00ffff40]"
                        />

                        {/* Magenta segment: REM */}
                        <motion.circle
                          cx="50"
                          cy="50"
                          r="32"
                          fill="none"
                          stroke="#ff00a0"
                          strokeWidth="8"
                          strokeDasharray="201.0"
                          strokeDashoffset="80"
                          className="drop-shadow-[0_0_8px_#ff00a040]"
                        />

                        {/* Yellow segment: Light Sleep */}
                        <motion.circle
                          cx="50"
                          cy="50"
                          r="24"
                          fill="none"
                          stroke="#ffb000"
                          strokeWidth="6"
                          strokeDasharray="150.7"
                          strokeDashoffset="30"
                        />
                      </svg>
                      {/* Central read-out details */}
                      <div className="absolute flex flex-col items-center">
                        <span className="text-[16px] font-black font-mono leading-none">94%</span>
                        <span className="text-[6.5px] font-bold text-emerald-400 uppercase mt-0.5 tracking-wider">Quality</span>
                      </div>
                    </div>

                    <div className="space-y-2 text-left flex-1">
                      <h4 className="text-xs font-black text-white uppercase tracking-wider">Stage Proportions</h4>
                      
                      <div className="space-y-1.5 text-[10px] font-semibold">
                        <div className="flex justify-between items-center p-1.5 bg-white rounded-md border-l-2 border-cyan-400 pl-2">
                          <span className="text-slate-400">Deep Sleep (High Recovery)</span>
                          <span className="font-mono text-white">48% // 3h 54m</span>
                        </div>
                        <div className="flex justify-between items-center p-1.5 bg-white rounded-md border-l-2 border-pink-500 pl-2">
                          <span className="text-slate-400">REM Restorative Sleep</span>
                          <span className="font-mono text-white">32% // 2h 37m</span>
                        </div>
                        <div className="flex justify-between items-center p-1.5 bg-white rounded-md border-l-2 border-amber-400 pl-2">
                          <span className="text-slate-400">Light Somatic Sleep</span>
                          <span className="font-mono text-white">20% // 1h 41m</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* HRV RESONANCE TELEMETRY */}
                <div className="bg-white/[0.02] border border-white/10 rounded-[30px] p-5 relative overflow-hidden backdrop-blur-xl text-left space-y-3">
                  <div className="flex items-center gap-1.5">
                    <Heart className="w-4 h-4 text-red-500 animate-pulse" />
                    <span className="text-[10px] font-black text-white uppercase tracking-wider">Vagal Tone HRV Alignment</span>
                  </div>
                  <p className="text-[10.5px] text-slate-400 leading-relaxed font-semibold">
                    Heart Rate Variability (HRV) is the biometric bridge to autonomic nervous state regulation. Increased coherence signals vagal brake relaxation.
                  </p>
                  <div className="p-3 bg-white rounded-2xl border border-white/5 grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-[7.5px] font-black uppercase text-slate-400">Tactile Vibe Quotient</span>
                      <span className="text-base font-black text-teal-400 font-mono block mt-0.5">82.4 RMSSD // Optimal</span>
                    </div>
                    <div>
                      <span className="text-[7.5px] font-black uppercase text-slate-400">Parasympathic Shift</span>
                      <span className="text-base font-black text-indigo-400 font-mono block mt-0.5">Active Restoration</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB WINDOW 4: AMBIENT SOUNDSCAPES DECK */}
            {activeTab === 'soundscapes' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="bg-white/[0.02] border border-white/10 rounded-[30px] p-5 relative overflow-hidden backdrop-blur-xl text-left space-y-4">
                  <div className="flex justify-between items-center p-2 border-b border-white/5">
                    <div className="flex items-center gap-1.5">
                      <Volume2 className="w-4 h-4 text-[#bd00ff]" />
                      <span className="text-[10px] font-black text-white uppercase tracking-wider">Interactive Binaural Waves</span>
                    </div>
                    <span className="text-[7.5px] font-black uppercase tracking-widest text-slate-400 font-mono">Stereo Grounding</span>
                  </div>

                  <p className="text-[10.5px] text-slate-400 leading-normal font-semibold">
                    Align your neural patterns. Choose a grounding soundscape mapped with precise Solfeggio frequencies below. High-saturation color themes shift dynamically to reflect the sonic frequency selected.
                  </p>

                  {/* Soundscape catalog table */}
                  <div className="space-y-2 pt-1">
                    {tracks.map((t, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSelectedTrackIndex(idx);
                          setActiveFrequency(t.hz);
                          setIsPlayingAudio(true);
                          if (idx === 0) {
                            setActiveTheme('hyper-saturation');
                            setNeuralState('Astral Flow');
                          } else if (idx === 1) {
                            setActiveTheme('sunset-hologram');
                            setNeuralState('Cellular Harmony');
                          } else {
                            setActiveTheme('cyber-cosmic');
                            setNeuralState('Gamma Synergy');
                          }
                        }}
                        className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition cursor-pointer ${
                          selectedTrackIndex === idx 
                            ? 'bg-white/10 border-white/20 text-white shadow-md' 
                            : 'bg-white border-white/5 text-slate-500 hover:text-slate-500'
                        }`}
                      >
                        <div className="space-y-1 pr-6 flex-1">
                          <div className="flex items-baseline gap-2">
                            <span className="text-xs font-black tracking-tight">{t.name}</span>
                            <span className="text-[7.5px] px-1.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300 font-mono tracking-widest uppercase">{t.category}</span>
                          </div>
                          <p className="text-[9.5px] opacity-75 font-medium leading-tight">{t.description}</p>
                        </div>

                        <div className="shrink-0">
                          {selectedTrackIndex === idx && isPlayingAudio ? (
                            <motion.div 
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ repeat: Infinity, duration: 1.5 }}
                              className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center shadow-md"
                            >
                              <Pause className="w-4 h-4 fill-black stroke-[3]" />
                            </motion.div>
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:bg-white/15 text-slate-300 flex items-center justify-center">
                              <Play className="w-4.5 h-4.5 ml-0.5 fill-current" />
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Tactile Frequency Generator feedback */}
                  <div className="bg-white p-4 rounded-xl border border-white/5 flex items-center justify-between text-slate-500 text-[10.5px]">
                    <div className="flex items-center gap-2">
                      <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isPlayingAudio ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }} />
                      <span className="font-semibold select-none">Live frequency modulation loop:</span>
                    </div>
                    <span className="font-mono text-white font-black">{isPlayingAudio ? `Active @ ${activeFrequency}Hz` : 'Idle'}</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* HIGH-RES DECORATIVE VECTOR GRAPH EMBEDDED FOOTER */}
            <div className="text-center pt-2">
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em] block">PRECISION ALIGNMENT ENGINE // 2026 EDITION</span>
              <p className="text-[8.5px] text-slate-500 leading-relaxed font-medium mt-1">
                Visual concepts rendered dynamically with sub-pixel hardware precision inside the unified AI Studio applet container. High-depth glassmorphic layering.
              </p>
            </div>

          </div>

          {/* Premium Bottom navigation bar mock segment for deep immersion */}
          <div className="z-10 p-4 bg-white backdrop-blur-md border-t border-white/5 flex justify-around items-center rounded-b-[36px] overflow-hidden shrink-0">
            <div className="flex items-center gap-1 text-[10.5px] font-semibold text-slate-400">
              <span className="w-2 h-2 rounded-full bg-[#bd00ff] inline-block shadow-md shadow-[#bd00ff]/50" />
              <span>Theme Matrix Calibration Ready / Active</span>
            </div>
            <button
              onClick={onClose}
              className="py-1 px-3 bg-white/5 border border-white/10 text-slate-300 hover:text-white rounded-lg text-[9.5px] font-black tracking-wider uppercase transition cursor-pointer active:scale-95"
            >
              Exit Spectrogram
            </button>
          </div>

        </div>
      </motion.div>
    </AnimatePresence>
  );
}
