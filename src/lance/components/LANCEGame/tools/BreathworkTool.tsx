import React, { useState, useEffect, useRef, useCallback } from 'react';
import { NARRATOR } from '../narrator';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Play, Square } from 'lucide-react';
import { useGame } from '../LANCEGameContext';
import { startAmbient, stopAmbient } from '../../../utils/ambientAudio';
import LanceAvatar from '../LanceAvatar';
import BigBackButton from '../BigBackButton';

type Phase = 'idle' | 'inhale' | 'hold_full' | 'exhale' | 'hold_empty';
type Pattern = '478' | 'box';

interface PatternConfig {
  label: string;
  description: string;
  inhale: number;
  holdFull: number;
  exhale: number;
  holdEmpty: number;
}

const PATTERNS: Record<Pattern, PatternConfig> = {
  '478': {
    label: '4-7-8 Breathing',
    description: 'Stimulates the vagus nerve and rapidly downregulates the nervous system.',
    inhale: 4,
    holdFull: 7,
    exhale: 8,
    holdEmpty: 0,
  },
  box: {
    label: 'Box Breathing',
    description: 'Used by Navy SEALs. Four equal sides. Builds stress resilience.',
    inhale: 4,
    holdFull: 4,
    exhale: 4,
    holdEmpty: 4,
  },
};

const PHASE_LABELS: Record<Phase, string> = {
  idle: 'Ready',
  inhale: 'Inhale',
  hold_full: 'Hold',
  exhale: 'Exhale',
  hold_empty: 'Hold',
};

const PHASE_COLORS: Record<Phase, string> = {
  idle: '#3ECFCF',
  inhale: '#3ECFCF',
  hold_full: '#7FD98C',
  exhale: '#8B5CF6',
  hold_empty: '#f97316',
};

const PHASE_SCALE: Record<Phase, number> = {
  idle: 1,
  inhale: 1.5,
  hold_full: 1.52,
  exhale: 1,
  hold_empty: 0.98,
};

const LANCE_BREATHWORK_LINES = [
  "Proceed. Your brainstem is awaiting instruction.",
  "Statistically, this is one of the most effective anxiety tools in existence. I'd have invented it myself but breathing is beneath me.",
  "Your vagus nerve is about to get activated. LANCE out.",
  "I'm timing this. Don't rush the exhale. Humans always rush the exhale.",
  "Cardiac coherence: incoming. You're welcome.",
];

interface Props {
  onBack: () => void;
  defaultPattern?: Pattern;
}

export default function BreathworkTool({ onBack, defaultPattern = '478' }: Props) {
  const { intern, addXp } = useGame();
  const [selectedPattern, setSelectedPattern] = useState<Pattern>(defaultPattern);
  const [phase, setPhase] = useState<Phase>('idle');
  const [countdown, setCountdown] = useState(0);
  const [cycles, setCycles] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [xpAwarded, setXpAwarded] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const TARGET_CYCLES = 5;

  const [lanceLine] = useState(
    () => LANCE_BREATHWORK_LINES[Math.floor(Math.random() * LANCE_BREATHWORK_LINES.length)]
  );

  const pattern = PATTERNS[selectedPattern];
  const phaseColor = PHASE_COLORS[phase];
  const phaseScale = PHASE_SCALE[phase];

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const runPhase = useCallback(
    (currentPhase: Phase, cycleCount: number) => {
      if (currentPhase === 'idle') return;

      const durations: Record<Phase, number> = {
        idle: 0,
        inhale: pattern.inhale,
        hold_full: pattern.holdFull,
        exhale: pattern.exhale,
        hold_empty: pattern.holdEmpty,
      };

      const nextPhaseMap: Record<Phase, Phase> = {
        idle: 'inhale',
        inhale: 'hold_full',
        hold_full: 'exhale',
        exhale: pattern.holdEmpty > 0 ? 'hold_empty' : 'inhale',
        hold_empty: 'inhale',
      };

      const duration = durations[currentPhase];
      if (duration === 0) {
        // Skip this phase
        const next = nextPhaseMap[currentPhase];
        const nextCycles = next === 'inhale' ? cycleCount + 1 : cycleCount;
        if (nextCycles > TARGET_CYCLES) {
          setPhase('idle');
          setIsRunning(false);
          setCycles(TARGET_CYCLES);
          setSessionComplete(true);
          return;
        }
        setPhase(next);
        if (next === 'inhale') setCycles(nextCycles);
        runPhase(next, nextCycles);
        return;
      }

      setCountdown(duration);

      // Countdown ticker
      let remaining = duration;
      const tick = () => {
        remaining -= 1;
        setCountdown(remaining);
        if (remaining > 0) {
          timerRef.current = setTimeout(tick, 1000);
        } else {
          // Move to next phase
          const next = nextPhaseMap[currentPhase];
          const nextCycles = next === 'inhale' ? cycleCount + 1 : cycleCount;

          if (nextCycles > TARGET_CYCLES) {
            setPhase('idle');
            setIsRunning(false);
            setCycles(TARGET_CYCLES);
            setSessionComplete(true);
            return;
          }

          if (next === 'inhale') setCycles(nextCycles);
          setPhase(next);
          runPhase(next, nextCycles);
        }
      };

      timerRef.current = setTimeout(tick, 1000);
    },
    [pattern, TARGET_CYCLES]
  );

  const startSession = () => {
    setSessionComplete(false);
    setCycles(0);
    setIsRunning(true);
    setPhase('inhale');
    runPhase('inhale', 0);
    startAmbient('breathe');
  };

  const stopSession = () => {
    clearTimer();
    setIsRunning(false);
    setPhase('idle');
    setCountdown(0);
    stopAmbient();
  };

  // Stop ambient when component unmounts mid-session
  useEffect(() => () => stopAmbient(800), []);

  useEffect(() => {
    if (sessionComplete && !xpAwarded) {
      addXp(30);
      setXpAwarded(true);
    }
  }, [sessionComplete]);

  useEffect(() => {
    return clearTimer;
  }, []);

  if (sessionComplete) {
    return (
      <div className="flex flex-col h-full" style={{ background: '#F9FAFB', color: '#3C3C3C' }}>
        <div className="px-4 py-4 flex items-center gap-3" style={{ borderBottom: '1px solid rgba(62,207,207,0.1)' }}>
          <BigBackButton onBack={onBack} />
          <h2 className="text-sm font-black" style={{ color: '#3C3C3C' }}>Breathwork</h2>
        </div>

        <div className="flex-1 px-4 py-8 flex flex-col items-center gap-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="w-32 h-32 rounded-full flex items-center justify-center text-5xl"
            style={{
              background: 'radial-gradient(circle, #7FD98C22, #F9FAFB)',
              border: '2px solid #7FD98C',
              boxShadow: '0 0 40px #7FD98C44',
            }}
          >
            ✅
          </motion.div>

          <div className="text-center space-y-2">
            <h2 className="text-2xl font-black" style={{ color: '#3C3C3C' }}>Session Complete</h2>
            <p className="text-sm" style={{ color: '#9CA3AF' }}>
              {TARGET_CYCLES} cycles of {pattern.label}
            </p>
            <div className="text-sm font-black" style={{ color: '#7FD98C' }}>+30 XP earned</div>
          </div>

          {/* Intern */}
          <div
            className="w-full rounded-3xl p-4 border flex items-start gap-3"
            style={{ background: '#FFFFFF', borderColor: '#7FD98C33' }}
          >
            <span className="text-2xl shrink-0">{intern.avatar}</span>
            <div>
              <div className="text-[9px] font-black uppercase tracking-widest mb-1" style={{ color: '#7FD98C' }}>
                {intern.name}
              </div>
              <p className="text-xs font-medium" style={{ color: '#7FD98C' }}>
                That's {TARGET_CYCLES} complete breath cycles. Your vagus nerve is literally thanking you right now. You did that.
              </p>
            </div>
          </div>

          {/* LANCE */}
          <div
            className="w-full rounded-3xl p-4 border"
            style={{ background: '#FFFFFF', borderColor: '#F0F0F0' }}
          >
            <div className="flex items-center gap-2 mb-2">
              <LanceAvatar emotion="neutral" size="sm" />
              <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: '#18C8DC' }}>
                {NARRATOR.name}
              </span>
            </div>
            <p className="text-xs italic" style={{ color: '#9CA3AF' }}>
              "You completed {TARGET_CYCLES} respiratory cycles with correct timing. I've updated your autonomic profile. The Intern is going to say something about this. I cannot stop them."
            </p>
          </div>

          <div className="flex gap-3 w-full">
            <button
              onClick={() => { setSessionComplete(false); setXpAwarded(false); setCycles(0); }}
              className="flex-1 py-3 rounded-2xl font-black text-sm border"
              style={{ borderColor: '#3ECFCF44', color: '#3ECFCF', background: '#3ECFCF18' }}
            >
              Again
            </button>
            <button
              onClick={onBack}
              className="flex-1 py-3 rounded-2xl font-black text-sm"
              style={{ background: 'linear-gradient(135deg, #3ECFCF, #7FD98C)', color: '#F9FAFB' }}
            >
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto" style={{ background: '#F9FAFB', color: '#3C3C3C' }}>
      {/* Header */}
      <div
        className="sticky top-0 z-10 px-4 py-4 flex items-center gap-3"
        style={{ background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(62,207,207,0.1)' }}
      >
        <button onClick={isRunning ? stopSession : onBack} className="p-2 rounded-xl" style={{ color: '#9CA3AF' }}>
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <div className="text-[9px] font-black uppercase tracking-widest" style={{ color: '#3ECFCF' }}>Tier 2 Tool</div>
          <h2 className="text-sm font-black leading-none" style={{ color: '#3C3C3C' }}>Breathwork</h2>
        </div>
        {isRunning && (
          <div className="ml-auto text-xs font-black" style={{ color: '#9CA3AF' }}>
            {cycles} / {TARGET_CYCLES} cycles
          </div>
        )}
      </div>

      <div className="flex-1 px-4 py-4 space-y-5">
        {/* Pattern selector */}
        {!isRunning && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-2"
          >
            {(Object.keys(PATTERNS) as Pattern[]).map(p => (
              <button
                key={p}
                onClick={() => setSelectedPattern(p)}
                className="flex-1 py-3 px-3 rounded-2xl text-xs font-black border transition-all active:scale-95"
                style={{
                  background: selectedPattern === p ? '#3ECFCF22' : '#FFFFFF',
                  borderColor: selectedPattern === p ? '#3ECFCF' : '#9CA3AF',
                  color: selectedPattern === p ? '#3ECFCF' : '#9CA3AF',
                }}
              >
                <div>{PATTERNS[p].label}</div>
                <div className="text-[9px] mt-0.5 opacity-60 font-medium">
                  {p === '478' ? '4·7·8' : '4·4·4·4'}
                </div>
              </button>
            ))}
          </motion.div>
        )}

        {/* Pattern description */}
        {!isRunning && (
          <div className="text-xs font-medium px-1" style={{ color: '#9CA3AF' }}>
            {pattern.description}
          </div>
        )}

        {/* ── Main Breathing Circle ── */}
        <div className="flex flex-col items-center py-6 gap-6">
          {/* Outer guide ring */}
          <div className="relative flex items-center justify-center">
            <div
              className="absolute w-64 h-64 rounded-full border opacity-10"
              style={{ borderColor: phaseColor, borderWidth: 1 }}
            />
            <div
              className="absolute w-52 h-52 rounded-full border opacity-5"
              style={{ borderColor: phaseColor, borderWidth: 1 }}
            />

            {/* Main orb */}
            <motion.div
              className="w-44 h-44 rounded-full flex flex-col items-center justify-center cursor-pointer select-none"
              style={{
                background: `radial-gradient(circle at 40% 40%, ${phaseColor}44, ${phaseColor}11, #F9FAFB)`,
                border: `2px solid ${phaseColor}${isRunning ? '99' : '44'}`,
                boxShadow: isRunning ? `0 0 60px ${phaseColor}33, inset 0 0 40px ${phaseColor}11` : 'none',
              }}
              animate={{ scale: phaseScale }}
              transition={{
                duration:
                  phase === 'inhale' ? pattern.inhale
                  : phase === 'exhale' ? pattern.exhale
                  : 0.5,
                ease: 'easeInOut',
              }}
              onClick={!isRunning ? startSession : undefined}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={phase}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-1"
                >
                  <div
                    className="text-xl font-black"
                    style={{ color: phaseColor, textShadow: `0 0 20px ${phaseColor}` }}
                  >
                    {isRunning ? PHASE_LABELS[phase] : 'Tap to Begin'}
                  </div>
                  {isRunning && countdown > 0 && (
                    <div className="text-4xl font-black" style={{ color: phaseColor }}>
                      {countdown}
                    </div>
                  )}
                  {!isRunning && (
                    <div className="text-sm" style={{ color: `${phaseColor}77` }}>
                      {pattern.label}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Phase guide dots */}
          {isRunning && (
            <div className="flex items-center gap-3">
              {(['inhale', 'hold_full', 'exhale', ...(pattern.holdEmpty > 0 ? ['hold_empty'] : [])] as Phase[]).map(p => (
                <div key={p} className="flex flex-col items-center gap-1">
                  <div
                    className="w-2 h-2 rounded-full transition-all"
                    style={{ background: phase === p ? PHASE_COLORS[p] : `${PHASE_COLORS[p]}33` }}
                  />
                  <span className="text-[8px] font-bold" style={{ color: phase === p ? PHASE_COLORS[p] : '#9CA3AF' }}>
                    {PHASE_LABELS[p]}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Cycle progress */}
          {isRunning && (
            <div className="flex gap-2">
              {Array.from({ length: TARGET_CYCLES }).map((_, i) => (
                <div
                  key={i}
                  className="w-8 h-1.5 rounded-full transition-all"
                  style={{ background: i < cycles ? '#7FD98C' : '#9CA3AF' }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex gap-3">
          {!isRunning ? (
            <button
              onClick={startSession}
              className="flex-1 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #3ECFCF, #7FD98C)', color: '#F9FAFB' }}
            >
              <Play className="w-4 h-4" />
              Start Session
            </button>
          ) : (
            <button
              onClick={stopSession}
              className="flex-1 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 border"
              style={{ borderColor: '#3ECFCF44', color: '#3ECFCF', background: '#3ECFCF18' }}
            >
              <Square className="w-4 h-4" />
              Stop
            </button>
          )}
        </div>

        {/* LANCE commentary */}
        {!isRunning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="px-4 py-3 rounded-2xl text-xs italic"
            style={{ background: '#FFFFFF', color: '#9CA3AF', border: '1px solid #3ECFCF11' }}
          >
            LANCE notes: "{lanceLine}"
          </motion.div>
        )}
      </div>
    </div>
  );
}
