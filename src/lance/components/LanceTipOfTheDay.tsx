import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, RefreshCw, CheckCircle, Brain, Volume2, ShieldAlert, Check } from 'lucide-react';
import { MoodLog } from '../types';

interface LanceTipOfTheDayProps {
  moodLogs: MoodLog[];
  userName: string;
  onTriggerInteractionAlert: (title: string, message: string) => void;
}

// L.A.N.C.E.'s customized, witty, and encouraging clinical tips based on mood scores
const TIPS_BY_SCORE: Record<number, { title: string; text: string; actionApp?: string; actionLabel?: string }[]> = {
  1: [
    {
      title: "AMYGDALA REDLINE DETECTED",
      text: "Autonomic load is critical. Your prefrontal cortex is operating in emergency override. Directive: Disconnect from complex cognitive tasks immediately. Spend three minutes in the Cranial Nerve Gym or take deep, controlled breaths.",
      actionApp: "cranial_reset",
      actionLabel: "Launch Cranial Nerve Gym"
    },
    {
      title: "SYSTEM OVERLOAD OVERRIDE",
      text: "Warning: Cognitive battery cells depletion. Pushing through friction is mathematically inefficient. I suggest doing a 5-second physical shake-out or screaming into our virtual Scream Release Room. Let the bio-system discharge.",
      actionApp: "scream_room",
      actionLabel: "Enter Scream Release Room"
    },
    {
      title: "ERROR 503: EMOTIONAL EXHAUSTION",
      text: "High-priority boundary enforcement engaged. You are attempting to run on low fuel. Decline non-essential duties today. Your primary objective is basic somatic containment and high-hydration rest.",
      actionApp: "grief_space",
      actionLabel: "Open Grief Release Space"
    }
  ],
  2: [
    {
      title: "LIMBIC SYSTEM NOISE DECREASE",
      text: "Your neural telemetry indicates elevated stress resistance. I recommend launching the Sound Bath Sync to entrain your brainwaves to 4.5Hz. Quiet sensory input is highly logical right now.",
      actionApp: "sound_bath",
      actionLabel: "Launch Sound Bath"
    },
    {
      title: "NEURAL COHERENCE CALIBRATION",
      text: "Reframing protocol: This temporary emotional dip is merely a temporary fluctuation in your overall biometrics. It does not define your system baseline. Adjust your shoulders, unclamp your jaw, and let it pass.",
      actionApp: "somatic_tremor",
      actionLabel: "Open Tremor Pacing Lab"
    },
    {
      title: "COGNITIVE BIAS SHIELD",
      text: "Prefrontal cortex is experiencing moderate resistance. CBT experiment: Write down your loudest anxious thought right now, then find two logical flaws in it. Actively dismantle the bias.",
      actionApp: "anxiety_detox",
      actionLabel: "Open Prefrontal Detox"
    }
  ],
  3: [
    {
      title: "AUTONOMIC STABILITY STATUS",
      text: "Logged state: 3.0/5. Neither hyper-aroused nor fully optimized. Standard operations are stable, but let's prevent stagnation. Introduce a 1% positive shift: drink an extra glass of water or view your RAS Vision Board.",
      actionApp: "manifestation",
      actionLabel: "Open RAS Vision Board"
    },
    {
      title: "ADEQUATE RESILIENCE METRICS",
      text: "Remember: you do not need to feel extreme euphoria to have a successful cycle. Quiet, balanced neutrality is an elite biometric state. Conserve your energy and execute your standard survival routines.",
      actionApp: "daily_habits",
      actionLabel: "Review Daily Habits"
    },
    {
      title: "NEURAL EQUILIBRIUM TARGET",
      text: "You are hovering in the comfortable mid-frequencies. This is the perfect baseline to run a short cognitive calibration. Tap into your Self-Talk Mirror and record one honest, non-judgmental observation about your day.",
      actionApp: "self_talk",
      actionLabel: "Launch Self-Talk Mirror"
    }
  ],
  4: [
    {
      title: "COHERENCE BONUS ACTIVATED",
      text: "Prefrontal coherence is hovering at an efficient 82%. Your neuro-transmitters are performing with high speed. I highly suggest tackling your most challenging daily challenge or planning an expressive task.",
      actionApp: "quests",
      actionLabel: "View Quest Center"
    },
    {
      title: "BEHAVIORAL plastic TREND",
      text: "Telemetry shows a steady positive trajectory. To lock in this mental momentum, secure a 5-minute consistent habit check-in. Repetition is the ultimate algorithm for structural neural plasticity.",
      actionApp: "daily_habits",
      actionLabel: "Open Habits Sandbox"
    },
    {
      title: "NEURAL RECEPTOR SURPLUS",
      text: "L.A.N.C.E. core registers a high capacity for emotional creativity today. This is a brilliant opportunity to explore the Inner Child Hub or spend time in your Biophilic Garden. Maximize the surplus.",
      actionApp: "inner_child",
      actionLabel: "Enter Inner Child Hub"
    }
  ],
  5: [
    {
      title: "PEAK COGNITIVE VELOCITY",
      text: "Enjoy this 100% prefrontal coherence. Your neural networks are operating at peak bandwidth today! I suggest sharing this high-vibration state by expressing appreciation to a trusted companion.",
      actionApp: "manifestation",
      actionLabel: "Open RAS Vision Board"
    },
    {
      title: "TRIUMPHANT AUTONOMIC BALANCE",
      text: "Superb metrics. Your neural resilience is rock-solid. Capture this exact feeling in your Mood Diary with a quick note so we can reverse-engineer your formula for peak cognitive success.",
      actionApp: "mood_diary",
      actionLabel: "Log in Mood Diary"
    },
    {
      title: "L.A.N.C.E. CORE VALIDATED",
      text: "Absolute cognitive triumph registered. All neural subsystems report exceptional operational efficiency. Do not take this high baseline for granted—continue executing your active survival habits.",
      actionApp: "quests",
      actionLabel: "Navigate to Challenges"
    }
  ]
};

const DEFAULT_TIPS = [
  {
    title: "BIOMETRIC FEEDBACK FLATLINE",
    text: "Warning: No recent mood data registered in my telemetry logs. I cannot analyze your prefrontal balance without inputs. Register a quick check-in below to calibrate my clinical model.",
    actionApp: "mood_diary",
    actionLabel: "Log Recent Mood"
  },
  {
    title: "SYSTEM PRE-FLIGHT DIRECTIVE",
    text: "To optimize my daily tips, utilize the 1-Tap Mood logger on your dashboard regularly. This allows L.A.N.C.E. to calculate precise cognitive baselines and recommend optimal somatic exercises.",
    actionApp: "mood_diary",
    actionLabel: "Log Recent Mood"
  }
];

export default function LanceTipOfTheDay({
  moodLogs,
  userName,
  onTriggerInteractionAlert
}: LanceTipOfTheDayProps) {
  const [currentTip, setCurrentTip] = useState<{ title: string; text: string; actionApp?: string; actionLabel?: string } | null>(null);
  const [currentScore, setCurrentScore] = useState<number | null>(null);
  const [tipIndex, setTipIndex] = useState<number>(0);
  const [isRecalibrating, setIsRecalibrating] = useState(false);
  const [isApplied, setIsApplied] = useState(false);

  // Play micro chimes for interactions
  const playTactileChime = (freq: number = 520, duration: number = 0.08) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.03, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // Fail silent
    }
  };

  useEffect(() => {
    // Determine the latest mood log
    if (moodLogs && moodLogs.length > 0) {
      // Sort to find the absolute latest log
      const sortedLogs = [...moodLogs].sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
      const latest = sortedLogs[0];
      const score = Math.round(latest.score); // standard 1-5 integer key
      setCurrentScore(score);
      
      const pool = TIPS_BY_SCORE[score] || DEFAULT_TIPS;
      const idx = tipIndex % pool.length;
      setCurrentTip(pool[idx]);
    } else {
      setCurrentScore(null);
      const idx = tipIndex % DEFAULT_TIPS.length;
      setCurrentTip(DEFAULT_TIPS[idx]);
    }
  }, [moodLogs, tipIndex]);

  const handleRecalibrate = () => {
    playTactileChime(680, 0.1);
    setIsRecalibrating(true);
    setIsApplied(false);
    setTimeout(() => {
      setTipIndex((prev) => prev + 1);
      setIsRecalibrating(false);
      playTactileChime(880, 0.08);
    }, 600);
  };

  const handleApplyTip = () => {
    if (isApplied) return;
    playTactileChime(920, 0.15);
    setIsApplied(true);
    onTriggerInteractionAlert(
      "🔋 Daily Directive Anchored",
      `L.A.N.C.E. has registered your integration checkbox. Mental focus calibrated: "${currentTip?.title}". Maintain this cognitive focus throughout your cycle!`
    );
  };

  if (!currentTip) return null;

  // Choose colors based on score
  const getThemeColors = () => {
    if (currentScore === null) {
      return {
        border: "border-slate-800/80 bg-slate-900/30",
        text: "text-slate-400",
        glow: "bg-slate-500/5",
        badge: "bg-slate-500/10 text-slate-400 border-slate-700/50",
        badgeText: "SYSTEM CALIBRATION"
      };
    }
    if (currentScore <= 2) {
      return {
        border: "border-rose-500/30 bg-rose-950/5",
        text: "text-rose-400",
        glow: "bg-rose-500/5",
        badge: "bg-rose-500/10 text-rose-400 border-rose-900/30",
        badgeText: `CRITICAL RESILIENCE LOW (Score: ${currentScore}/5)`
      };
    }
    if (currentScore === 3) {
      return {
        border: "border-amber-500/25 bg-amber-950/5",
        text: "text-amber-400",
        glow: "bg-amber-550/4",
        badge: "bg-amber-500/10 text-amber-400 border-amber-900/30",
        badgeText: `STABLE EQUILIBRIUM (Score: ${currentScore}/5)`
      };
    }
    return {
      border: "border-teal-500/30 bg-teal-950/5",
      text: "text-teal-400",
      glow: "bg-teal-500/5",
      badge: "bg-teal-500/10 text-teal-400 border-teal-900/30",
      badgeText: `OPTIMAL COHERENCE (Score: ${currentScore}/5)`
    };
  };

  const currentTheme = getThemeColors();

  return (
    <div 
      id="lance-tip-of-the-day"
      className={`relative rounded-3xl border p-4 sm:p-5 shadow-lg overflow-hidden select-none transition-all duration-300 ${currentTheme.border}`}
    >
      {/* Decorative ambient subtle pulse glows */}
      <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-xl pointer-events-none ${currentTheme.glow}`} />
      
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 relative z-10 text-left">
        
        {/* Core text block */}
        <div className="space-y-2 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            {/* L.A.N.C.E. Mini Icon Identifier */}
            <div className="flex items-center gap-1.5 bg-slate-950/45 px-2.5 py-1 rounded-full border border-slate-800">
              <Brain className={`w-3.5 h-3.5 ${currentTheme.text}`} />
              <span className="text-[10px] font-black tracking-wider font-mono text-slate-300">L.A.N.C.E. DIRECTIVE</span>
            </div>
            
            {/* Context Badge */}
            <span className={`text-[8.5px] font-black uppercase px-2 py-0.5 rounded-md border tracking-wider font-mono ${currentTheme.badge}`}>
              {currentTheme.badgeText}
            </span>
          </div>

          <h4 className="text-xs font-black text-white uppercase tracking-wider font-mono flex items-center gap-1.5 pt-1">
            <span className={`w-1.5 h-1.5 rounded-full ${currentTheme.text} animate-pulse`} />
            {currentTip.title}
          </h4>

          <div className="relative min-h-[3.2rem]">
            <AnimatePresence mode="wait">
              {isRecalibrating ? (
                <motion.div
                  key="recalibrating-state"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="flex items-center gap-2.5 text-xs text-slate-450 font-mono py-2 italic"
                >
                  <RefreshCw className="w-4 h-4 text-teal-400 animate-spin shrink-0" />
                  <span>Calibrating custom cognitive advice arrays...</span>
                </motion.div>
              ) : (
                <motion.p
                  key={currentTip.text}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.2 }}
                  className="text-slate-350 text-[11px] leading-relaxed font-sans pr-1 sm:pr-4"
                >
                  {currentTip.text}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Action button cluster */}
        <div className="flex sm:flex-col items-center justify-end sm:justify-start gap-2 shrink-0 pt-1 sm:pt-0">
          
          {/* Recalibrate Tip */}
          <button
            onClick={handleRecalibrate}
            disabled={isRecalibrating}
            title="Request alternate calibration"
            className="p-2 bg-slate-950/50 hover:bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-xl active:scale-95 transition cursor-pointer flex items-center justify-center shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRecalibrating ? 'animate-spin text-teal-400' : ''}`} />
          </button>

          {/* Applied state checkbox */}
          <button
            onClick={handleApplyTip}
            disabled={isApplied}
            className={`px-3 py-1.8 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 transition active:scale-95 cursor-pointer border ${
              isApplied
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 cursor-default'
                : 'bg-slate-950/60 hover:bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            {isApplied ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>Anchored</span>
              </>
            ) : (
              <>
                <div className="w-3 h-3 rounded-md border border-slate-600 flex items-center justify-center shrink-0 bg-slate-900" />
                <span>Apply directive</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
