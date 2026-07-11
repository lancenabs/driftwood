import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Sparkles, 
  Heart, 
  Wind, 
  ShieldCheck, 
  Sliders, 
  Trash2, 
  RefreshCw,
  Info,
  ChevronRight,
  AlertTriangle,
  Play,
  Square,
  Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AnonymousStressLog {
  id: string;
  level: number;
  timestamp: Date;
  roleHint?: string; // e.g. "Family Member", "Partner"
}

export default function FamilyStressMeter() {
  // INITIAL SEED READINGS TO SIMULATE A LIVING HOUSEHOLD
  const [logs, setLogs] = useState<AnonymousStressLog[]>(() => {
    const saved = localStorage.getItem('driftwood_barometer_v1');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        }));
      } catch (e) {
        // Fallback to defaults
      }
    }
    return [
      { id: 'l1', level: 8, timestamp: new Date(Date.now() - 1000 * 60 * 45), roleHint: 'Anonymous Member' },
      { id: 'l2', level: 5, timestamp: new Date(Date.now() - 1000 * 60 * 120), roleHint: 'Anonymous Member' },
      { id: 'l3', level: 7, timestamp: new Date(Date.now() - 1000 * 60 * 240), roleHint: 'Anonymous Member' },
    ];
  });

  const [currentLevel, setCurrentLevel] = useState<number>(6);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // BREATH PACER STATE
  const [isBreathing, setIsBreathing] = useState<boolean>(false);
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold In' | 'Exhale' | 'Hold Out'>('Inhale');
  const [breathTimer, setBreathTimer] = useState<number>(4);
  const [completedCycles, setCompletedCycles] = useState<number>(0);

  // PERSIST STATE
  useEffect(() => {
    localStorage.setItem('driftwood_barometer_v1', JSON.stringify(logs));
  }, [logs]);

  // BREATH PACER CLOCK
  useEffect(() => {
    let interval: any = null;
    if (isBreathing) {
      interval = setInterval(() => {
        setBreathTimer((prev) => {
          if (prev <= 1) {
            // transition to next phase
            if (breathPhase === 'Inhale') {
              setBreathPhase('Hold In');
              return 4;
            } else if (breathPhase === 'Hold In') {
              setBreathPhase('Exhale');
              return 4;
            } else if (breathPhase === 'Exhale') {
              setBreathPhase('Hold Out');
              return 4;
            } else {
              setBreathPhase('Inhale');
              setCompletedCycles((c) => {
                const updated = c + 1;
                // If they complete a cycle, incrementally drop stress entries for simulation feedback!
                if (updated >= 3) {
                  // After 3 cycles, let's soothe the household stress!
                  setTimeout(() => {
                    handleSootheHousehold();
                  }, 1000);
                }
                return updated;
              });
              return 4;
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setBreathPhase('Inhale');
      setBreathTimer(4);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isBreathing, breathPhase]);

  // CLINICAL LABELS FOR SLIDER LEVELS
  const getStressDescription = (val: number) => {
    if (val <= 2) return { text: "Ventral Vagal — Calm, relaxed, and open", color: "text-emerald-500", bg: "bg-emerald-50", border: "border-emerald-200" };
    if (val <= 4) return { text: "Friction Mode — Busy mind, light somatic tension", color: "text-sky-500", bg: "bg-sky-50", border: "border-sky-200" };
    if (val <= 6) return { text: "Sympathetic Activation — Anxious, irritable, elevated heart rate", color: "text-orange-500", bg: "bg-orange-50", border: "border-orange-200" };
    if (val <= 8) return { text: "Defensive Alarm (Fight/Flight) — Angry, hyper-vigilant, highly defensive", color: "text-red-500", bg: "bg-red-50", border: "border-red-200" };
    return { text: "Dorsal Shutdown — Overwhelmed, numb, shut down, or stonewalling", color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-200" };
  };

  const stressInfo = getStressDescription(currentLevel);

  // LOG NEW READING ANONYMOUSLY
  const handleLogStress = () => {
    const newLog: AnonymousStressLog = {
      id: 'l_' + Date.now(),
      level: currentLevel,
      timestamp: new Date(),
      roleHint: 'Anonymous Member'
    };
    setLogs((prev) => [newLog, ...prev]);
    setSuccessMsg("Logged successfully! Your entry remains completely anonymous.");
    setTimeout(() => {
      setSuccessMsg(null);
    }, 4000);
  };

  // CALCULATE AGGREGATE (AVERAGE)
  const calculateAverage = () => {
    if (logs.length === 0) return 0;
    const total = logs.reduce((sum, log) => sum + log.level, 0);
    return Math.round((total / logs.length) * 10) / 10;
  };

  const averageStress = calculateAverage();
  const isHighStress = averageStress >= 7.0;

  // SOOTHE HOUSEHOLD (PULL STRESS DOWN)
  const handleSootheHousehold = () => {
    setLogs((prev) => 
      prev.map((log) => ({
        ...log,
        level: Math.max(2, log.level - 3) // ease down stress levels by 3 points
      }))
    );
    setIsBreathing(false);
    setCompletedCycles(0);
    setSuccessMsg("✨ Somatic co-regulation completed! Simulated family stress has de-escalated.");
    setTimeout(() => setSuccessMsg(null), 5000);
  };

  // CLEAR ALL LOGS FOR TESTING
  const handleClearLogs = () => {
    setLogs([]);
  };

  // RESET TO DEFAULT FOR CONVENIENCE
  const handleResetToDefaults = () => {
    setLogs([
      { id: 'l1', level: 8, timestamp: new Date(Date.now() - 1000 * 60 * 45), roleHint: 'Anonymous Member' },
      { id: 'l2', level: 5, timestamp: new Date(Date.now() - 1000 * 60 * 120), roleHint: 'Anonymous Member' },
      { id: 'l3', level: 7, timestamp: new Date(Date.now() - 1000 * 60 * 240), roleHint: 'Anonymous Member' },
    ]);
    setIsBreathing(false);
    setCompletedCycles(0);
  };

  return (
    <div className="bg-white border-2 border-outline-variant p-5 rounded-[2rem] shadow-3d-neutral flex flex-col gap-4 text-[#4B4B4B]" id="family-stress-meter-widget">
      
      {/* HEADER SECTION */}
      <div className="flex justify-between items-start border-b border-outline-variant pb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl shrink-0">🌡️</span>
          <div>
            <h3 className="font-display font-black text-xs uppercase tracking-wider text-[#4B4B4B]">
              Anonymous Family Stress Meter
            </h3>
            <p className="text-[10px] text-on-surface-variant/90 leading-tight">
              Anonymously log current stress to trace collective household tension safely.
            </p>
          </div>
        </div>
        <div className="flex gap-1.5 shrink-0">
          <button
            type="button"
            onClick={handleResetToDefaults}
            className="p-1 hover:bg-stone-100 rounded-lg text-stone-400 hover:text-stone-600 transition"
            title="Reset to Demo Levels"
          >
            <RefreshCw size={11} />
          </button>
          <button
            type="button"
            onClick={handleClearLogs}
            className="p-1 hover:bg-red-50 rounded-lg text-stone-400 hover:text-red-500 transition"
            title="Clear readings"
          >
            <Trash2 size={11} />
          </button>
        </div>
      </div>

      {/* CORE DISPLAY: AGGREGATE GAUGE */}
      <div className="bg-slate-50 border border-outline-variant/60 rounded-2xl p-4 flex flex-col md:flex-row items-center gap-4 justify-between">
        
        {/* Left side: Gauge Score */}
        <div className="flex flex-col items-center text-center">
          <span className="text-[8px] font-black uppercase text-stone-400 tracking-wider">
            Aggregate Household Stress
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className={`font-display font-black text-4xl leading-none ${
              averageStress >= 7 ? 'text-red-500 animate-pulse' : averageStress >= 5 ? 'text-orange-500' : 'text-emerald-500'
            }`}>
              {logs.length === 0 ? '0.0' : averageStress}
            </span>
            <span className="text-xs font-mono font-bold text-stone-400">/10</span>
          </div>
          <span className="text-[9px] font-sans font-bold text-stone-500 mt-1 flex items-center gap-1 bg-white border border-outline-variant/50 px-2 py-0.5 rounded-full">
            <Users size={10} className="text-stone-400" />
            {logs.length} anonymous {logs.length === 1 ? 'log' : 'logs'} active
          </span>
        </div>

        {/* Right side: Progress Bar Visualizer */}
        <div className="flex-1 w-full flex flex-col gap-1.5">
          <div className="flex justify-between text-[8px] font-mono font-bold text-stone-500">
            <span>VENTRAL (LOW)</span>
            <span>SYMPATHETIC (MED)</span>
            <span>DORSAL ALARM (HIGH)</span>
          </div>
          <div className="h-4 w-full bg-slate-200 rounded-full overflow-hidden flex border border-outline-variant/40 shadow-inner relative">
            
            {/* Color divisions */}
            <div className="h-full bg-emerald-500/20 w-[40%] border-r border-white/20" />
            <div className="h-full bg-orange-500/20 w-[30%] border-r border-white/20" />
            <div className="h-full bg-red-500/20 w-[30%]" />

            {/* Glowing marker indicator */}
            {logs.length > 0 && (
              <motion.div 
                animate={{ left: `${(averageStress / 10) * 100}%` }}
                transition={{ type: 'spring', stiffness: 80 }}
                className="absolute top-0 bottom-0 w-1.5 bg-neutral-800 border border-white -ml-0.75 shadow-lg flex items-center justify-center cursor-help"
                style={{ left: `${(averageStress / 10) * 100}%` }}
              >
                <div className="w-1 h-1 rounded-full bg-white" />
              </motion.div>
            )}
          </div>

          <div className="text-center md:text-left">
            <p className="font-sans text-[9px] leading-relaxed text-stone-600">
              {averageStress >= 7.0 
                ? "🚨 HIGH collective alarm triggers co-regulation suggestions."
                : averageStress >= 4.0 
                  ? "⚡ Elevated house friction. Engage proactive connection check-ins."
                  : "⚓ Stable social engagement. Family system feels co-regulated."
              }
            </p>
          </div>
        </div>
      </div>

      {/* FEEDBACK STATUS MESSAGE */}
      {successMsg && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-emerald-50 border border-emerald-300 p-3 rounded-xl text-[10px] text-emerald-800 font-bold flex items-center gap-2"
        >
          <span>✨</span>
          <p>{successMsg}</p>
        </motion.div>
      )}

      {/* ANONYMOUS SLIDER LOGGING INPUT */}
      <div className="bg-slate-50 border border-outline-variant/50 rounded-2xl p-4 flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <span className="text-[9px] font-black uppercase text-[#4B4B4B] tracking-wider flex items-center gap-1.5">
            <Sliders size={11} className="text-indigo-600" /> Log Your Stress (1 - 10)
          </span>
          <span className="text-[10px] font-mono font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
            Current: {currentLevel}
          </span>
        </div>

        {/* The Slider Input */}
        <div className="flex flex-col gap-1.5">
          <input
            type="range"
            min="1"
            max="10"
            step="1"
            value={currentLevel}
            onChange={(e) => setCurrentLevel(Number(e.target.value))}
            className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
          <div className="flex justify-between text-[7.5px] font-mono font-bold text-stone-400 px-0.5">
            <span>1 (Peaceful)</span>
            <span>3</span>
            <span>5 (Anxious)</span>
            <span>7</span>
            <span>9 (Shutdown)</span>
            <span>10 (Flooded)</span>
          </div>
        </div>

        {/* Visual Indicator of what selected level represents */}
        <div className={`p-2.5 rounded-xl border ${stressInfo.bg} ${stressInfo.border} transition-all`}>
          <p className={`font-sans text-[9.5px] font-bold ${stressInfo.color}`}>
            {stressInfo.text}
          </p>
        </div>

        <button
          type="button"
          onClick={handleLogStress}
          className="w-full bg-indigo-600 hover:brightness-105 active:translate-y-[1px] border-b-[3px] border-indigo-800 text-white font-display font-black py-2 rounded-xl text-[9.5px] uppercase tracking-wider cursor-pointer shadow-sm text-center transition-all"
        >
          Submit Anonymous Reading
        </button>
      </div>

      {/* CLINICAL BREATHING EXERCISE SUGGESTION POPUP (TRIGGERS ON AVERAGE >= 7) */}
      <AnimatePresence>
        {isHighStress && !isBreathing && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-rose-50 border-2 border-rose-200 rounded-2xl p-4 flex flex-col gap-3 relative overflow-hidden"
          >
            <div className="absolute right-3 top-3 opacity-10 text-4xl select-none pointer-events-none">
              🌪️
            </div>
            
            <div className="flex items-start gap-2.5">
              <span className="text-xl">⚠️</span>
              <div>
                <h4 className="font-display font-black text-xs text-rose-950 uppercase tracking-tight">
                  Collective Overflow Warning (Stress at {averageStress}/10)
                </h4>
                <p className="font-sans text-[10px] text-rose-800 leading-relaxed mt-0.5">
                  High household threat alarms are active. Fight, flight, or stonewalling patterns are physiologically imminent. Lower the threat levels instantly using a co-op de-escalation ritual.
                </p>
              </div>
            </div>

            <div className="bg-white/60 border border-rose-100 p-2.5 rounded-xl text-[9px] text-stone-700 leading-relaxed">
              <strong>💡 Polyvagal Remedy:</strong> Resonant Co-op Breathing coordinates both nervous systems onto a Ventral Vagal frequency, dropping somatic alarms via breathing locks.
            </div>

            <button
              type="button"
              onClick={() => {
                setCompletedCycles(0);
                setIsBreathing(true);
              }}
              className="w-full bg-gradient-to-r from-rose-500 to-rose-600 hover:brightness-105 text-white font-display font-black py-2.5 rounded-xl border-b-[4px] border-rose-800 active:translate-y-[2px] active:border-b-[2px] transition-all flex items-center justify-center gap-2 text-[9.5px] uppercase tracking-wider cursor-pointer shadow-sm"
            >
              <Wind className="w-3.5 h-3.5" />
              <span>Launch Co-op Synchronized Breath</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CO-OP BREATHING RITUAL PORTAL (ACTIVE BREATH PACER ENGINE) */}
      <AnimatePresence>
        {isBreathing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-indigo-950 text-white rounded-3xl p-5 flex flex-col gap-4 border border-indigo-800 overflow-hidden relative"
          >
            {/* Ambient visual background glow */}
            <div className="absolute inset-0 bg-radial-gradient from-indigo-500/10 to-transparent pointer-events-none" />

            <div className="flex justify-between items-center border-b border-indigo-800 pb-2 relative z-10">
              <div className="flex items-center gap-1.5">
                <span className="text-base">🌬️</span>
                <span className="font-display font-black text-[9.5px] text-indigo-300 uppercase tracking-widest">
                  Ventral Co-Regulation Engine
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsBreathing(false)}
                className="text-[8.5px] font-black uppercase text-indigo-300 hover:text-white"
              >
                Exit Session
              </button>
            </div>

            {/* PULSING ORB VISUAL ELEMENT */}
            <div className="flex flex-col items-center justify-center py-5 gap-3 relative z-10">
              
              {/* Dynamic Scaling Circle */}
              <div className="relative w-28 h-28 flex items-center justify-center">
                
                {/* Glow ring under */}
                <motion.div
                  animate={{
                    scale: 
                      breathPhase === 'Inhale' ? [1, 1.8] : 
                      breathPhase === 'Hold In' ? 1.8 : 
                      breathPhase === 'Exhale' ? [1.8, 1.0] : 1.0
                  }}
                  transition={{
                    duration: 4,
                    ease: "easeInOut",
                    repeat: breathPhase.startsWith('Hold') ? Infinity : 0,
                    repeatType: "reverse"
                  }}
                  className="absolute inset-0 rounded-full bg-rose-500/10 blur-xl pointer-events-none"
                />

                {/* Main breathing sphere */}
                <motion.div
                  animate={{
                    scale: 
                      breathPhase === 'Inhale' ? [1, 1.6] : 
                      breathPhase === 'Hold In' ? 1.6 : 
                      breathPhase === 'Exhale' ? [1.6, 1.0] : 1.0
                  }}
                  transition={{
                    duration: 4,
                    ease: "easeInOut"
                  }}
                  className="w-16 h-16 rounded-full bg-gradient-to-tr from-rose-500 to-indigo-500 flex items-center justify-center shadow-lg border-2 border-indigo-300/30 text-white font-display font-black text-center"
                >
                  <Wind className="w-6 h-6 text-white/90 animate-pulse" />
                </motion.div>
              </div>

              {/* Status information labels */}
              <div className="text-center mt-2">
                <h5 className="font-display font-black text-sm text-white uppercase tracking-wider">
                  {breathPhase === 'Inhale' && '🧘 Inhale Calmness'}
                  {breathPhase === 'Hold In' && '🔒 Hold the Center'}
                  {breathPhase === 'Exhale' && '🌬️ Exhale Tension'}
                  {breathPhase === 'Hold Out' && '⏸️ Pause and Rest'}
                </h5>
                <p className="font-mono text-xl font-bold text-rose-400 mt-1">
                  {breathTimer}s
                </p>
                <span className="text-[8.5px] font-sans font-bold text-indigo-300 bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-full mt-2 inline-block">
                  Cycle progress: {completedCycles} / 3 completed
                </span>
              </div>
            </div>

            {/* Instruction block inside */}
            <div className="bg-indigo-900/40 border border-indigo-800/80 rounded-xl p-3 text-[9px] leading-relaxed text-indigo-200 font-sans">
              <strong>Instructions:</strong> Match your breathing with the expanding and collapsing sphere. Synchronize your breathing with your partner or family members in the same room. Complete 3 full cycles to soothe the overall collective household stress index.
            </div>

            {/* Force soothe button */}
            <button
              type="button"
              onClick={handleSootheHousehold}
              className="w-full bg-white text-indigo-950 font-display font-black py-2 rounded-xl text-[9px] uppercase tracking-wider text-center"
            >
              Skip / Complete Breathing Ritual
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* METHODOLOGY INSIGHT FOOTER */}
      <div className="bg-slate-50 border border-outline-variant p-3.5 rounded-2xl text-[8.5px] text-stone-500 font-sans leading-relaxed flex gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <p>
          <strong>Clinical Insight:</strong> Collective emotional states are co-regulatory loops. If even one family member somaticizes calm, it provides a stable resonance hook for others to step out of high sympathetic alarms.
        </p>
      </div>

    </div>
  );
}
