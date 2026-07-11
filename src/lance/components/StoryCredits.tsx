import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Award, Sparkles, Star, Film, RotateCcw, Play, Pause, ChevronRight, X, Cpu, Heart, CheckCircle2, Music, ShieldCheck, Sun
} from 'lucide-react';

interface StoryCreditsProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  internName: string;
  isMuted?: boolean;
}

interface CreditSection {
  role: string;
  names: string[];
  description?: string;
  icon?: React.ReactNode;
}

export default function StoryCredits({
  isOpen,
  onClose,
  userName = "Friend",
  internName = "the Intern",
  isMuted = false
}: StoryCreditsProps) {
  const [scrollSpeed, setScrollSpeed] = useState<number>(1); // Speed multiplier: 0.5x, 1x, 2x
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Play micro synth sound
  const playBeep = (freq = 440, type: 'sine' | 'triangle' = 'sine') => {
    if (isMuted) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = type;
      osc.frequency.value = freq;
      
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch (e) {
      // safe audio catch
    }
  };

  const playChime = () => {
    if (isMuted) return;
    const notes = [329.63, 392.00, 523.25, 659.25, 1046.50]; // E, G, C, E, C chord of success
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        playBeep(freq, 'sine');
      }, idx * 100);
    });
  };

  // Play chime once when the component is opened
  useEffect(() => {
    if (isOpen) {
      playChime();
    }
  }, [isOpen]);

  const creditSections: CreditSection[] = [
    {
      role: "EXPERIENCE DIRECTOR & CHIEF ARCHITECT",
      names: ["LANCE Core Intelligence v10.2", "Google DeepMind Antigravity Agent"],
      description: "Designed and implemented the 35 custom therapeutic challenge corridors of physical and emotional rescue.",
      icon: <Cpu className="w-5 h-5 text-teal-400" />
    },
    {
      role: "NARRATIVE CO-RESOLVING AGENT",
      names: [`${internName} (The Clinical Companion)`],
      description: "Provided real-time neurological alignment tips, empathetic checkpoints, and infinite encouragement to the Traveler.",
      icon: <Heart className="w-5 h-5 text-rose-400" />
    },
    {
      role: "SOVEREIGN HERO & LEAD TRAVELER",
      names: [`${userName} (Resonator of Hope)`],
      description: "Sprinted through the Mansion, navigated the Deep Whispering Jungle, scaled the Shadow Ridgeline, and rewired LANCE's core.",
      icon: <Star className="w-5 h-5 text-yellow-400 animate-pulse" />
    },
    {
      role: "THERAPEUTIC INTERFACE CARTOGRAPHY",
      names: ["Vagus Nerve Vocal Synthesizers", "Somatic Body Map Cartographers", "EMDR Bilateral Waveform Engineers"],
      description: "Mapped physiological resonance loops onto interactive touchscreen sub-modules for user autonomous equilibrium.",
      icon: <Sparkles className="w-5 h-5 text-cyan-400" />
    },
    {
      role: "SOUNDSCAPE & COMPOSITIONAL HARMONICS",
      names: ["Frictionless Ocean Breeze waves", "Somatic Polyvagal Sine Wave Gen", "Pacific Forest White Noise Loopers"],
      description: "Crafted bio-resonant audio backdrops, custom triangle-wave warning chimes, and calming sunset sound bath environments.",
      icon: <Music className="w-5 h-5 text-indigo-400" />
    },
    {
      role: "VOYAGE COORDINATOR & RECOVERY ASSURANCE",
      names: ["The Dawn Strider Cabin Crew", "Safe Shore Integration Advocates"],
      description: "Maintained structural integrity of the seaworthy escape vessel and ensured seamless return to the mainland.",
      icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />
    }
  ];

  // Auto scroll effect
  useEffect(() => {
    if (!isOpen || isPaused) return;

    const interval = setInterval(() => {
      setActiveSlide((prev) => {
        if (prev < creditSections.length - 1) {
          playBeep(260 + prev * 40, 'triangle');
          return prev + 1;
        } else {
          // loop back or pause on last
          return prev;
        }
      });
    }, 4500 / scrollSpeed);

    return () => clearInterval(interval);
  }, [isOpen, isPaused, scrollSpeed, creditSections.length]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div 
        id="story-credits"
        className="fixed inset-0 z-[200] bg-slate-950 font-sans flex flex-col justify-between overflow-hidden text-zinc-150 p-4 sm:p-6 md:p-8 selection:bg-yellow-400 selection:text-slate-950"
      >
        {/* Sky glow sunset elements in background */}
        <div className="absolute inset-0 bg-gradient-to-b from-orange-950/20 via-slate-950/95 to-slate-950 pointer-events-none z-0" />
        <div className="absolute top-[20%] left-[20%] w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute -bottom-[10%] right-[10%] w-[600px] h-[600px] bg-teal-500/5 rounded-full blur-[140px] pointer-events-none" />

        {/* Floating Stars / Sparks Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          {[...Array(18)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                x: `${Math.random() * 100}%`, 
                y: `${Math.random() * 110}%`, 
                opacity: Math.random() * 0.4 + 0.1,
                scale: Math.random() * 0.6 + 0.4
              }}
              animate={{ 
                y: i % 2 === 0 ? '-10%' : '110%',
                opacity: [0.1, 0.6, 0.1]
              }}
              transition={{ 
                duration: 15 + Math.random() * 15, 
                repeat: Infinity, 
                ease: "linear"
              }}
              className="absolute w-2 h-2 bg-yellow-400/50 rounded-full"
            />
          ))}
        </div>

        {/* Top Header Row of Credits Overlay */}
        <div className="relative z-10 flex justify-between items-center pb-2 border-b border-white/5 select-none shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-1 px-2.5 bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 text-[9.5px] font-mono font-black tracking-widest rounded-lg flex items-center gap-1.5 uppercase">
              <Film className="w-3.5 h-3.5" />
              <span>Cinematic Presentation</span>
            </div>
            <span className="hidden xs:inline-block h-3.5 w-px bg-zinc-800" />
            <span className="hidden xs:inline-block font-mono text-[9px] text-zinc-500 uppercase tracking-wider">
              Rewired Emotional Core
            </span>
          </div>

          <button
            onClick={() => {
              playBeep(780, 'sine');
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-zinc-900 border border-white/10 hover:border-white/20 text-zinc-400 hover:text-white flex items-center justify-center transition cursor-pointer active:scale-90"
            title="Close Credits"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Centered Main Story Showcase Plate */}
        <div className="relative z-10 flex-1 flex flex-col justify-center items-center py-6 px-2 sm:px-6 select-none overflow-hidden max-w-4xl mx-auto w-full">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlide}
              initial={{ opacity: 0, y: 35, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -35, scale: 0.98 }}
              transition={{ duration: 0.75, ease: "easeOut" }}
              className="w-full flex flex-col items-center text-center space-y-6 max-w-2xl px-4"
            >
              {/* Animated Floating Emblem */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="w-14 h-14 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center shadow-lg"
              >
                {creditSections[activeSlide].icon || <Award className="w-6 h-6 text-yellow-400" />}
              </motion.div>

              <div className="space-y-1.5">
                <span className="text-[10px] font-mono font-black text-teal-400 tracking-widest uppercase block">
                  {creditSections[activeSlide].role}
                </span>
                
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight uppercase font-sans">
                  {creditSections[activeSlide].names.join(" • ")}
                </h2>
              </div>

              {creditSections[activeSlide].description && (
                <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-lg font-medium italic">
                  "{creditSections[activeSlide].description}"
                </p>
              )}

              {/* Individual Delayed Fade-in Names Grid */}
              <div className="grid grid-cols-1 gap-2 pt-2 w-full max-w-sm">
                {creditSections[activeSlide].names.map((name, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + index * 0.25, duration: 0.5 }}
                    className="bg-black/40 border border-white/5 py-2 px-4 rounded-xl text-xs font-mono font-bold text-zinc-300"
                  >
                    ✦ {name} ({index === 0 ? "Lead" : "Associate"})
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

        </div>

        {/* Bottom Control & Nav Panel */}
        <div className="relative z-10 bg-zinc-900/60 p-4 rounded-2xl border border-white/5 backdrop-blur-md max-w-3xl mx-auto w-full select-none shrink-0 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px]">
          
          {/* Progress Indicator Dots */}
          <div className="flex gap-2.5">
            {creditSections.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  playBeep(300 + idx * 50);
                  setActiveSlide(idx);
                }}
                className={`h-2.5 rounded-full transition-all cursor-pointer ${
                  activeSlide === idx 
                    ? 'w-7 bg-gradient-to-r from-teal-400 to-cyan-300' 
                    : 'w-2.5 bg-zinc-700 hover:bg-zinc-650'
                }`}
              />
            ))}
          </div>

          {/* Interactive Player Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                playBeep(450);
                setIsPaused(!isPaused);
              }}
              className="p-1 px-3 bg-black border border-white/10 hover:border-white/20 rounded-lg text-zinc-300 hover:text-white transition flex items-center gap-1.5 cursor-pointer font-mono font-bold active:scale-95"
            >
              {isPaused ? <Play className="w-3 h-3 text-emerald-400" /> : <Pause className="w-3 h-3 text-rose-400" />}
              <span>{isPaused ? "RESUME ROLL" : "PAUSE ROLL"}</span>
            </button>

            {/* Speeds */}
            <div className="flex items-center gap-1 bg-black p-0.5 rounded-lg border border-white/10">
              {[1, 1.5, 2].map((speed) => (
                <button
                  key={speed}
                  onClick={() => {
                    playBeep(500 + speed * 30);
                    setScrollSpeed(speed);
                  }}
                  className={`px-2 py-0.5 rounded font-mono font-bold transition text-[9px] cursor-pointer ${
                    scrollSpeed === speed 
                      ? 'text-teal-400 bg-teal-950/40 border border-teal-500/20' 
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>
          </div>

          {/* Skip / Complete Exit point */}
          <button
            onClick={() => {
              playChime();
              onClose();
            }}
            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 uppercase font-mono font-black tracking-widest rounded-xl hover:brightness-110 active:scale-95 cursor-pointer transition-all flex items-center gap-1 leading-none text-[9.5px] shadow-lg shadow-amber-500/5 font-bold"
          >
            <span>Close Epilogue</span>
            <ChevronRight className="w-4.5 h-4.5 stroke-[2.8]" />
          </button>
        </div>

      </div>
    </AnimatePresence>
  );
}
