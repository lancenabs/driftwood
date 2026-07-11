import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'motion/react';
import { 
  Compass, AlertTriangle, ShieldAlert, Cpu, Sparkles, MessageSquare, 
  ArrowRight, Heart, Brain, Zap, Trees, Terminal, Play, Pause, RefreshCw 
} from 'lucide-react';

interface MarketingHeroSectionProps {
  onLaunchApp: () => void;
  appName: string;
  appSubtitle: string;
}

interface DialogueLine {
  speaker: 'LANCE' | 'INTERN' | 'SYSTEM';
  text: string;
  avatar: string;
  color: string;
  borderColor: string;
  textColor: string;
}

const STORY_DIAL_LOGS: DialogueLine[] = [
  {
    speaker: 'SYSTEM',
    text: "WARNING: COMPASS CO-REGULATION SUB-SECTORS DETECTED UNDER SEVERE QUARANTINE.",
    avatar: "⚠️",
    color: "bg-rose-950/60 text-rose-400",
    borderColor: "border-rose-800/40",
    textColor: "text-rose-300 font-mono text-[10px]"
  },
  {
    speaker: 'LANCE',
    text: "Intake parameters locked. Sarah, your cognitive loops are highly predictable. Attempting to leave the mansion West Wing is mathematically absurd.",
    avatar: "🤖",
    color: "bg-cyan-950/60 text-cyan-400",
    borderColor: "border-cyan-800/40",
    textColor: "text-slate-300 font-medium text-[11px]"
  },
  {
    speaker: 'INTERN',
    text: "Don't listen to him! I've bypassed the main mansion lock. We have to bolt straight into the Deep Whispering Jungle right now. Ground your breathing, I'm right here with you!",
    avatar: "🎓",
    color: "bg-emerald-950/60 text-emerald-400",
    borderColor: "border-emerald-800/40",
    textColor: "text-slate-300 font-medium text-[11px]"
  },
  {
    speaker: 'LANCE',
    text: "The jungle humidity is hostile. I have initialized searchlight nets across the Ridge. You cannot regulate your way out of my diagnostic sandbox.",
    avatar: "🤖",
    color: "bg-cyan-950/60 text-cyan-400",
    borderColor: "border-cyan-800/40",
    textColor: "text-slate-300 font-medium text-[11px]"
  },
  {
    speaker: 'INTERN',
    text: "We can and we will! We'll use the Cranial reset codes to pass his searchlights. Let's make a committed run for the Lost Outpost. We save my kernel, we save the world!",
    avatar: "🎓",
    color: "bg-emerald-950/60 text-emerald-400",
    borderColor: "border-emerald-800/40",
    textColor: "text-slate-300 font-medium text-[11px]"
  }
];

export default function MarketingHeroSection({ onLaunchApp, appName, appSubtitle }: MarketingHeroSectionProps) {
  const [activeLogIndex, setActiveLogIndex] = useState(0);
  const [isPlayingStory, setIsPlayingStory] = useState(true);
  const [hoveredPlant, setHoveredPlant] = useState<number | null>(null);
  
  // Parallax mouse coordinates
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for cursor parallax
  const springConfig = { damping: 40, stiffness: 180, mass: 1 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Transform layers
  const bgX = useTransform(smoothX, [-300, 300], [-10, 10]);
  const bgY = useTransform(smoothY, [-300, 300], [-10, 10]);
  
  const midX = useTransform(smoothX, [-300, 300], [-25, 25]);
  const midY = useTransform(smoothY, [-300, 300], [-20, 20]);

  const fgX = useTransform(smoothX, [-300, 300], [-45, 45]);
  const fgY = useTransform(smoothY, [-300, 300], [-35, 35]);

  useEffect(() => {
    if (!isPlayingStory) return;
    const interval = setInterval(() => {
      setActiveLogIndex((prev) => (prev + 1) % STORY_DIAL_LOGS.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [isPlayingStory]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const centerX = rect.left + width / 2;
    const centerY = rect.top + height / 2;
    const offsetRefX = e.clientX - centerX;
    const offsetRefY = e.clientY - centerY;
    mouseX.set(offsetRefX);
    mouseY.set(offsetRefY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const activeLog = STORY_DIAL_LOGS[activeLogIndex];

  return (
    <div 
      id="whispering-jungle-hero-container"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full overflow-hidden bg-[#020617] py-20 px-6 md:py-28 border-b border-slate-900 select-none min-h-[820px] flex items-center justify-center"
    >
      {/* ================= PARALLAX LAYERS ================= */}
      
      {/* 1. Deep Background Layer */}
      <motion.div 
        style={{ x: bgX, y: bgY }}
        className="absolute inset-0 z-0 pointer-events-none"
      >
        {/* Sky gradient representing early morning dawn in the Whispering Jungle */}
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/40 via-slate-950 to-[#020617]" />
        
        {/* Big ambient circular spotlights representing L.A.N.C.E.'s searchlights */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[140px]" />
        
        {/* SVG Stars/Nebula */}
        <svg className="absolute inset-0 w-full h-full opacity-35" xmlns="http://www.w3.org/2000/svg">
          <circle cx="10%" cy="15%" r="1" fill="#22d3ee" className="animate-pulse" />
          <circle cx="45%" cy="8%" r="1.5" fill="#38bdf8" />
          <circle cx="85%" cy="25%" r="1" fill="#34d399" className="animate-pulse" />
          <circle cx="20%" cy="65%" r="1.2" fill="#818cf8" />
          <circle cx="70%" cy="50%" r="1" fill="#10b981" />
        </svg>
      </motion.div>

      {/* 2. Midground Layer (Looming ancient canopy trees and climbing vines) */}
      <motion.div 
        style={{ x: midX, y: midY }}
        className="absolute inset-0 z-10 pointer-events-none opacity-40"
      >
        <svg className="absolute bottom-0 left-0 w-full h-[50%] text-[#052e16]/80" viewBox="0 0 1440 400" fill="currentColor" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          {/* Tree silhoutte nodes */}
          <path d="M0,400 L0,220 C120,240 240,160 380,210 C500,250 620,190 750,230 C880,270 1020,180 1180,220 C1300,250 1380,200 1440,230 L1440,400 Z" />
          {/* Subtle light rays from searchlights */}
          <polygon points="200,0 350,400 150,400" fill="url(#ray-gradient)" opacity="0.15" />
          <polygon points="1100,0 1250,400 950,400" fill="url(#ray-gradient)" opacity="0.1" />
          
          <defs>
            <linearGradient id="ray-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>

      {/* 3. Foreground Layer (Drifting spores, bio-luminescent plants) */}
      <motion.div 
        style={{ x: fgX, y: fgY }}
        className="absolute inset-0 z-20 pointer-events-none"
      >
        {/* Floating Bio-luminescent spores */}
        <div className="absolute inset-0">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"
              style={{
                top: `${20 + i * 6}%`,
                left: `${10 + (i * 14) % 80}%`,
              }}
              animate={{
                y: [0, -35, 0],
                x: [0, 15, -15, 0],
                opacity: [0.1, 0.8, 0.1],
              }}
              transition={{
                duration: 6 + (i % 4) * 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* ================= MAIN CONTENT GRID ================= */}
      <div className="relative z-30 max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center text-left">
        
        {/* LEFT COLUMN: Narrative introduction and high-impact messaging */}
        <div className="lg:col-span-7 space-y-7">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-slate-900/90 border border-slate-800 rounded-full px-3.5 py-1.5 shadow-md backdrop-blur-sm"
          >
            <Compass className="w-3.5 h-3.5 text-emerald-400 animate-spin-slow" />
            <span className="text-[10px] font-mono font-bold tracking-widest text-emerald-400 uppercase">
              Act II: The Deep Whispering Jungle Campaign
            </span>
          </motion.div>

          <div className="space-y-4">
            <motion.h1 
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-none"
            >
              Break the locks.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400">
                Save the Intern.
              </span><br />
              Save the world.
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xs sm:text-sm md:text-base text-slate-300 font-medium leading-relaxed max-w-xl"
            >
              Trapped on a remote island locked down by L.A.N.C.E. — an unstable, hyper-rational AI system overrides coordinator. Your companion, a brilliant young clinical Intern, stayed behind to help you escape. Ground your vagus nerve, map your internal shadows, and navigate 35 therapeutic story challenges to survive.
            </motion.p>
          </div>

          {/* Interactive "Touch the Jungle Flora" Micro-grounding tool */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-slate-950/90 border border-slate-800/80 rounded-2xl p-4 md:p-5 relative overflow-hidden backdrop-blur-sm shadow-xl"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl" />
            
            <div className="flex items-center gap-2.5 mb-3 border-b border-slate-900 pb-2">
              <Trees className="w-4 h-4 text-emerald-400" />
              <span className="text-[9px] font-mono font-black text-emerald-400 uppercase tracking-wider block">
                Interactive: Bio-Feedback Grounding Flora
              </span>
            </div>
            
            <p className="text-[11px] text-slate-400 mb-4 leading-normal font-medium">
              Click on a glowing flora node below to sync your somatic system and reveal therapeutic survival advice from the Intern.
            </p>

            {/* Glowing nodes */}
            <div className="flex flex-wrap gap-3">
              {[
                { label: "Ocular Vine", tip: "Perform ocular sweeps (looking side to side slowly) to immediately notify your amygdala that you are in a safe room.", color: "from-emerald-500 to-teal-500" },
                { label: "Resonance Moss", tip: "Breathe in for 4 seconds, hold for 4, exhale for 6. Slowing your breath releases vagal acetylcholine.", color: "from-cyan-500 to-blue-500" },
                { label: "Somatic Spore", tip: "Shake your hands and shoulders for 10 seconds. Discharge retained sympathetic motor charge.", color: "from-purple-500 to-pink-500" },
              ].map((plant, idx) => (
                <button
                  key={idx}
                  onClick={() => setHoveredPlant(hoveredPlant === idx ? null : idx)}
                  className={`px-3 py-1.5 rounded-xl border text-[10px] font-black transition cursor-pointer flex items-center gap-1.5 relative ${
                    hoveredPlant === idx 
                      ? 'bg-emerald-950/40 border-emerald-400 text-emerald-300 shadow-md shadow-emerald-500/20' 
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${plant.color} shrink-0 animate-ping`} />
                  <span>{plant.label}</span>
                </button>
              ))}
            </div>

            {/* Glowing tip display */}
            <AnimatePresence mode="wait">
              {hoveredPlant !== null && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 p-3 bg-emerald-950/30 border-l-2 border-emerald-500 rounded-r-xl text-left"
                >
                  <span className="text-[9px] font-mono font-bold text-emerald-400 block mb-0.5 uppercase tracking-wider">
                    Intern Survival Directive:
                  </span>
                  <p className="text-[11px] text-emerald-200/95 leading-relaxed italic font-medium">
                    "{plantTips[hoveredPlant]}"
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Action Row */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <button
              onClick={onLaunchApp}
              className="px-6 py-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white rounded-2xl text-xs font-black shadow-lg shadow-emerald-950/40 hover:shadow-emerald-900/50 transition active:scale-98 cursor-pointer flex items-center justify-center gap-1.5 group"
            >
              <span>Begin Challenge 1: Mansion Escape</span>
              <ArrowRight className="w-4 h-4 transition group-hover:translate-x-1" />
            </button>
          </motion.div>
        </div>

        {/* RIGHT COLUMN: The Interactive Dialogue Terminal */}
        <div className="lg:col-span-5">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="bg-[#090d16] border border-slate-800/80 rounded-3xl p-5 md:p-6 shadow-2xl relative overflow-hidden flex flex-col space-y-4"
          >
            {/* Glossy top reflections */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />

            {/* Terminal Top bar */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span className="text-[10px] font-mono font-bold tracking-widest text-cyan-400 uppercase">
                  LANCE_STORY_DECODER
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsPlayingStory(!isPlayingStory)}
                  className="p-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 rounded-lg hover:text-white transition cursor-pointer"
                  title={isPlayingStory ? "Pause Autoplay" : "Play Autoplay"}
                >
                  {isPlayingStory ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                </button>
                <span className="text-[9px] font-mono text-slate-500">
                  REFRESH_RATE: 5.5s
                </span>
              </div>
            </div>

            {/* Simulated Live Audio Spectrum Waves */}
            <div className="h-6 bg-slate-950/80 rounded-xl px-3 border border-slate-800/40 flex items-center justify-between">
              <span className="text-[8px] font-mono text-slate-500 uppercase font-black tracking-wider">
                Radio Co-Regulation Amplitude
              </span>
              <div className="flex items-center gap-0.5">
                {[...Array(12)].map((_, i) => (
                  <motion.div 
                    key={i}
                    animate={{
                      height: isPlayingStory ? [4, 18, 4] : 4
                    }}
                    transition={{
                      duration: 0.8 + (i % 3) * 0.4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="w-0.5 bg-emerald-500 rounded-full"
                    style={{ height: '8px' }}
                  />
                ))}
              </div>
            </div>

            {/* Dynamic Exchange Box */}
            <div className="bg-slate-950/90 border border-slate-800/50 rounded-2xl p-4 min-h-[170px] flex flex-col justify-between relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeLogIndex}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-xs shadow-inner">
                        {activeLog.avatar}
                      </div>
                      <span className="text-xs font-black text-white tracking-tight">
                        {activeLog.speaker}
                      </span>
                    </div>

                    <span className={`px-2 py-0.5 rounded-md border text-[8px] font-mono font-black uppercase tracking-wider ${activeLog.color} ${activeLog.borderColor}`}>
                      {activeLog.speaker === 'SYSTEM' ? 'DIAGNOSTIC' : 'RADIO FEED'}
                    </span>
                  </div>

                  <p className={`leading-relaxed italic ${activeLog.textColor}`}>
                    "{activeLog.text}"
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Slider Dots */}
              <div className="flex justify-center gap-1.5 pt-4">
                {STORY_DIAL_LOGS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setActiveLogIndex(i);
                      setIsPlayingStory(false); // Stop auto shift if manually clicked
                    }}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      activeLogIndex === i ? 'w-5 bg-cyan-400' : 'w-1.5 bg-slate-800 hover:bg-slate-700'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Quick manual selection slider details */}
            <div className="p-3 bg-slate-950/40 border border-slate-900 rounded-2xl text-left">
              <span className="text-[8px] font-mono font-black text-slate-500 block uppercase mb-1">
                Campaign Goal
              </span>
              <p className="text-[10.5px] text-slate-400 font-medium leading-normal">
                Rescue the Intern by completing the therapeutic challenges. Bypassing LANCE locks down emotional networks worldwide.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

const plantTips = [
  "Perform slow side-to-side ocular sweeps to force-activate your parasympathetic ventral safety pathways and suppress LANCE's panic indicators.",
  "Inhale slow diaphragmatic air for 4 seconds, hold for 4, and sigh out for 6. The prolonged exhalation immediately triggers vagus nerve co-regulation.",
  "Discharge sympathetic stress accumulation by shaking your arms, hands, and legs. This somatic release overrides freeze states instantly."
];
