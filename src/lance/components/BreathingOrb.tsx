import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Wind, Heart, Sparkles, Check, Play, Square } from 'lucide-react';

interface BreathingOrbProps {
  breathActive: boolean;
  breathPhase: 'Inhale' | 'Hold (Full)' | 'Exhale' | 'Hold (Empty)';
  breathSeconds: number;
  breathPattern: 'box' | '478';
  glowColor: string;
  onToggle: () => void;
  audioPlaying: boolean;
  breathCycles: number;
}

export default function BreathingOrb({
  breathActive,
  breathPhase,
  breathSeconds,
  breathPattern,
  glowColor,
  onToggle,
  audioPlaying,
  breathCycles,
}: BreathingOrbProps) {
  // We want to calculate the current target scale based on the sub-phases of the cycle
  // For 4-7-8 and Box breathing:
  // Inhale: scales smoothly up to max scale
  // Hold: stays expanded with a slight calm heartbeat pulse
  // Exhale: scales smoothly down to minimum scale
  // Hold Empty / Rest: stays at minimum scale
  
  let targetScale = 1.0;
  let phaseColor = '#f1f5f9'; // fallback slate-100
  let ringBgColor = 'rgba(241, 245, 249, 0.1)';
  let duration = 1.0; // matching transition duration

  // Define colors & target scales carefully for an immersive feeling
  if (!breathActive) {
    targetScale = 1.0;
    phaseColor = '#94a3b8'; // slate dark
    ringBgColor = 'rgba(148, 163, 184, 0.1)';
    duration = 1.0;
  } else {
    switch (breathPhase) {
      case 'Inhale':
        targetScale = 1.9; // Expanded state
        phaseColor = '#38bdf8'; // Sky blue
        ringBgColor = 'rgba(56, 189, 248, 0.15)';
        duration = 4.0; // Full 4 seconds expansion
        break;
      case 'Hold (Full)':
        targetScale = 1.95; // Hold state at full with a tiny expand
        phaseColor = '#10b981'; // Emerald green
        ringBgColor = 'rgba(16, 185, 129, 0.15)';
        duration = breathPattern === '478' ? 7.0 : 4.0; // Hold for 7s or 4s
        break;
      case 'Exhale':
        targetScale = 1.0; // Back to base state
        phaseColor = '#6366f1'; // Indigo
        ringBgColor = 'rgba(99, 102, 241, 0.15)';
        duration = breathPattern === '478' ? 8.0 : 4.0; // Exhale for 8s or 4s
        break;
      case 'Hold (Empty)':
        targetScale = 0.85; // Empty hold goes slightly tight
        phaseColor = '#f59e0b'; // Amber
        ringBgColor = 'rgba(245, 158, 11, 0.15)';
        duration = 4.0; // Hold empty for 4s
        break;
    }
  }

  // Calculate percentage progress of current phase for a circular ring countdown
  const maxSecondsForPhase = !breathActive ? 4 : (
    breathPhase === 'Inhale' ? 4 :
    breathPhase === 'Hold (Full)' ? (breathPattern === '478' ? 7 : 4) :
    breathPhase === 'Exhale' ? (breathPattern === '478' ? 8 : 4) : 4
  );

  const rawPercentage = (breathSeconds / maxSecondsForPhase) * 100;
  // Progress goes from 360 to 0 (or 0 to 360 depending on direction)
  // Let's do a countdown progress
  const strokeDasharray = 2 * Math.PI * 80; // Radius of 80
  const strokeDashoffset = strokeDasharray - (strokeDasharray * rawPercentage) / 100;

  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      {/* Visual interactive Breathing Container representing a modern organic orb */}
      <div className="relative flex items-center justify-center w-64 h-64 select-none">
        
        {/* Animated Background Aura that pulses fluidly with state */}
        <AnimatePresence mode="popLayout">
          <motion.div
            key={`aura-${breathPhase}-${breathActive}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: breathActive ? [0.15, 0.35, 0.15] : 0.05, 
              scale: targetScale * 1.15,
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: breathActive ? duration : 2, 
              ease: "easeInOut",
              repeat: breathActive ? (breathPhase === 'Hold (Full)' ? Infinity : 0) : 0,
              repeatType: "reverse"
            }}
            style={{ 
              background: `radial-gradient(circle, ${phaseColor} 0%, transparent 70%)`,
            }}
            className="absolute inset-0 rounded-full filter blur-xl pointer-events-none"
          />
        </AnimatePresence>

        {/* Multi-layered orbital visual rings */}
        <div className="absolute inset-2 border border-dashed rounded-full border-slate-300/30 dark:border-white/10 animate-[spin_40s_linear_infinite]" />
        
        {/* Progress Arc Tracking Active Phase completion */}
        <svg className="absolute w-full h-full transform -rotate-90 pointer-events-none overflow-visible z-10" viewBox="0 0 200 200">
          <circle
            cx="100"
            cy="100"
            r="80"
            fill="none"
            stroke={audioPlaying ? "rgba(255, 255, 255, 0.08)" : "rgba(148, 163, 184, 0.15)"}
            strokeWidth="3.5"
          />
          {breathActive && (
            <motion.circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke={phaseColor}
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={strokeDasharray}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1, ease: "linear" }}
            />
          )}
        </svg>

        {/* Interactive Physical Pulsing Orb Body */}
        <motion.button
          onClick={onToggle}
          animate={{ 
            scale: targetScale,
            backgroundColor: breathActive ? ringBgColor : 'rgba(255, 255, 255, 0.45)',
            borderColor: phaseColor,
            boxShadow: breathActive 
              ? `0 0 35px ${phaseColor}35, inset 0 0 25px ${phaseColor}15` 
              : '0 4px 15px rgba(0, 0, 0, 0.05)'
          }}
          transition={{ 
            type: "spring", 
            stiffness: 45, 
            damping: 18,
            mass: 1.2
          }}
          className={`w-36 h-36 rounded-full border-2 flex flex-col items-center justify-center relative cursor-pointer z-10 group overflow-hidden transition-colors duration-300 backdrop-blur-md`}
          title={breathActive ? "Click to deactivate guide" : "Click to begin breathing guide"}
        >
          {/* Internal gradient layer */}
          <div 
            className="absolute inset-0 opacity-40 transition-colors duration-1000"
            style={{
              background: `radial-gradient(circle at center, ${phaseColor}15 0%, transparent 80%)`,
            }}
          />

          {/* Core expanding/contracting center nucleus */}
          <motion.div
            animate={{
              scale: breathActive ? (breathPhase === 'Inhale' ? [1.0, 1.15, 1.0] : [1.1, 1.2, 1.1]) : 1.0,
              backgroundColor: phaseColor,
            }}
            transition={{
              repeat: Infinity,
              duration: breathPhase === 'Hold (Full)' ? 3.5 : 4.5,
              ease: "easeInOut"
            }}
            className="absolute w-8 h-8 rounded-full opacity-20 filter blur-xs"
          />

          {/* Floating air ripples inside the nucleus during exhale */}
          {breathActive && breathPhase === 'Exhale' && (
            <motion.div 
              initial={{ scale: 0.6, opacity: 0.9 }}
              animate={{ scale: 1.8, opacity: 0 }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "easeOut" }}
              style={{ borderColor: phaseColor }}
              className="absolute inset-4 border rounded-full border-dashed"
            />
          )}

          {/* Visual Indicators Inside the Orb */}
          <div className="flex flex-col items-center justify-center text-center relative z-20 font-sans">
            <span className={`text-[10px] font-bold uppercase tracking-widest ${audioPlaying ? 'text-white/60' : 'text-slate-400'}`}>
              {breathActive ? breathPhase : 'Standby'}
            </span>
            <span className={`text-4xl font-extrabold font-mono tracking-tight my-1 ${audioPlaying ? 'text-white' : 'text-slate-800'}`}>
              {breathActive ? breathSeconds : '--'}
            </span>
            <span 
              className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full transition-colors duration-500"
              style={{ color: phaseColor }}
            >
              {!breathActive ? 'Start Care' : (
                breathPhase === 'Inhale' ? 'Breathe In' :
                breathPhase === 'Hold (Full)' ? 'Retain' :
                breathPhase === 'Exhale' ? 'Breathe Out' : 'Still'
              )}
            </span>
          </div>

          {/* Hover scaling guides */}
          <div className="absolute inset-0 bg-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        </motion.button>

        {/* Phase Guide Pointers on Outer Ring */}
        <div className="absolute w-full h-full pointer-events-none">
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
            <span className={`text-[8px] font-extrabold tracking-widest font-mono ${breathActive && breathPhase === 'Inhale' ? 'text-sky-400 font-bold scale-110' : 'text-slate-400/40'}`}>
              INHALE
            </span>
            <div className={`w-1 h-1 rounded-full mt-0.5 ${breathActive && breathPhase === 'Inhale' ? 'bg-sky-400 scale-125 shadow-xs' : 'bg-slate-300/30'}`} />
          </div>
          <div className="absolute right-1 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
            <div className={`w-1 h-1 rounded-full ${breathActive && breathPhase === 'Hold (Full)' ? 'bg-emerald-400 scale-125 shadow-xs' : 'bg-slate-300/30'}`} />
            <span className={`text-[8px] font-extrabold tracking-widest font-mono ${breathActive && breathPhase === 'Hold (Full)' ? 'text-emerald-400 font-bold scale-110' : 'text-slate-400/40'}`}>
              HOLD
            </span>
          </div>
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
            <div className={`w-1 h-1 rounded-full mb-0.5 ${breathActive && breathPhase === 'Exhale' ? 'bg-indigo-400 scale-125 shadow-xs' : 'bg-slate-300/30'}`} />
            <span className={`text-[8px] font-extrabold tracking-widest font-mono ${breathActive && breathPhase === 'Exhale' ? 'text-indigo-400 font-bold scale-110' : 'text-slate-400/40'}`}>
              EXHALE
            </span>
          </div>
          {breathPattern === 'box' && (
            <div className="absolute left-1 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
              <span className={`text-[8px] font-extrabold tracking-widest font-mono ${breathActive && breathPhase === 'Hold (Empty)' ? 'text-amber-400 font-bold scale-110' : 'text-slate-400/40'}`}>
                REST
              </span>
              <div className={`w-1 h-1 rounded-full ${breathActive && breathPhase === 'Hold (Empty)' ? 'bg-amber-400 scale-125 shadow-xs' : 'bg-slate-300/30'}`} />
            </div>
          )}
        </div>
      </div>

      {/* Interactive Helper Hint */}
      <div className="text-center space-y-1 max-w-xs px-2 pointer-events-none">
        <p className={`text-[10px] uppercase tracking-widest font-extrabold flex items-center justify-center gap-1 ${audioPlaying ? 'text-white/60' : 'text-slate-400'}`}>
          <Wind className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
          <span>RHYTHMIC SOMATIC TIDE</span>
        </p>
        <p className={`text-[11px] leading-relaxed transition-colors duration-300 ${audioPlaying ? 'text-slate-300' : 'text-slate-500'}`}>
          {!breathActive 
            ? 'Touch the core orb above to trigger the customized somatic breathing tide.' 
            : `${breathPhase} phase active. Stay relaxed and let the visual guide focus your intent.`}
        </p>
      </div>
    </div>
  );
}
