import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, RotateCcw, ChevronRight } from 'lucide-react';

type Phase = 'intro' | 'active' | 'rest' | 'complete';

const STAGES = [
  {
    id: 'psoas',
    label: 'Psoas Activation',
    duration: 90,
    color: '#FF9600',
    instructions: [
      'Stand or sit. Lift one knee toward your chest as far as comfortable.',
      'Hold — let a natural shake or tremor begin.',
      'If shaking starts, that\'s perfect. Neurogenic tremor is the goal.',
      'Switch legs after 30 seconds.',
      'If no shake, gently pulse the knee up and down to invite it.',
    ],
    science: 'The psoas is where trauma hides. TRE-style shaking releases stored tension from the hip flexors and lower back.',
  },
  {
    id: 'adductors',
    label: 'Inner Thigh Release',
    duration: 90,
    color: '#8B5CF6',
    instructions: [
      'Stand with feet wider than hip-width.',
      'Bend your knees slightly — keep weight even.',
      'Let your inner thighs begin to tremble.',
      'Don\'t force it — just stay with the position.',
      'If nothing happens, micro-bounce gently until the tremor finds you.',
    ],
    science: 'The adductors and inner groin store fight/flight charge. Releasing them signals the ANS that the threat is over.',
  },
  {
    id: 'spine',
    label: 'Spinal Wave',
    duration: 60,
    color: '#58CC02',
    instructions: [
      'Lie on your back if possible, or sit in a chair.',
      'Let your knees fall open slightly.',
      'Allow any spontaneous movement in your spine — undulation, rocking, or nothing.',
      'Don\'t direct the movement. Let your body lead.',
      'If movement doesn\'t arise, rock gently from side to side.',
    ],
    science: 'Spinal undulation completes the orienting response and regulates the sympathetic chain along the vertebrae.',
  },
  {
    id: 'integration',
    label: 'Grounding & Integration',
    duration: 60,
    color: '#1CB0F6',
    instructions: [
      'Lie still or sit quietly.',
      'Feel the weight of your body against the floor or chair.',
      'Take three slow, natural breaths.',
      'Notice what feels different — warmth, tingling, heaviness, calm.',
      'You are safe. The discharge is complete.',
    ],
    science: 'Integration time allows the autonomic nervous system to shift from discharge back to regulation.',
  },
];

function PacingRings({ active, color, progress }: { active: boolean; color: string; progress: number }) {
  return (
    <div className="relative flex items-center justify-center" style={{ width: 160, height: 160 }}>
      {/* Outer ambient ring */}
      <motion.div
        className="absolute rounded-full"
        style={{ width: 160, height: 160, border: `1px solid ${color}20` }}
        animate={active ? { scale: [1, 1.08, 1], opacity: [0.3, 0.15, 0.3] } : { scale: 1, opacity: 0.1 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Mid ring */}
      <motion.div
        className="absolute rounded-full"
        style={{ width: 120, height: 120, border: `2px solid ${color}35` }}
        animate={active ? { scale: [1, 1.06, 1], opacity: [0.4, 0.2, 0.4] } : { scale: 1, opacity: 0.15 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
      />
      {/* Progress ring */}
      <svg className="absolute" width={140} height={140} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={70} cy={70} r={60} fill="none" stroke={`${color}15`} strokeWidth={6} />
        <circle
          cx={70} cy={70} r={60}
          fill="none"
          stroke={color}
          strokeWidth={6}
          strokeLinecap="round"
          strokeDasharray={`${2 * Math.PI * 60}`}
          strokeDashoffset={`${2 * Math.PI * 60 * (1 - progress)}`}
          style={{ transition: 'stroke-dashoffset 1s linear' }}
        />
      </svg>
      {/* Inner tremor dots */}
      {active && Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{ width: 4, height: 4, background: color, opacity: 0.7 }}
          animate={{
            x: [0, (Math.random() - 0.5) * 20, 0],
            y: [0, (Math.random() - 0.5) * 20, 0],
            opacity: [0.7, 0.2, 0.7],
          }}
          transition={{
            duration: 0.2 + Math.random() * 0.3,
            repeat: Infinity,
            repeatType: 'mirror',
            delay: i * 0.08,
          }}
        />
      ))}
    </div>
  );
}

export default function TremorPacingLab() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [stageIdx, setStageIdx] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [completedStages, setCompletedStages] = useState<string[]>([]);
  const [sessionNotes, setSessionNotes] = useState('');
  const [instrIdx, setInstrIdx] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentStage = STAGES[stageIdx];
  const progress = secondsLeft > 0 ? 1 - secondsLeft / currentStage.duration : 0;

  const startStage = useCallback(() => {
    setSecondsLeft(currentStage.duration);
    setIsRunning(true);
    setInstrIdx(0);
    setPhase('active');
  }, [currentStage.duration]);

  useEffect(() => {
    if (!isRunning) return;
    timerRef.current = setInterval(() => {
      setSecondsLeft(s => {
        if (s <= 1) {
          clearInterval(timerRef.current!);
          setIsRunning(false);
          setCompletedStages(prev => [...new Set([...prev, currentStage.id])]);
          setPhase('rest');
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current!);
  }, [isRunning, currentStage.id]);

  // Auto-advance instruction text
  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setInstrIdx(i => Math.min(i + 1, currentStage.instructions.length - 1));
    }, currentStage.duration * 1000 / currentStage.instructions.length);
    return () => clearInterval(interval);
  }, [isRunning, currentStage]);

  const handleNext = () => {
    if (stageIdx < STAGES.length - 1) {
      setStageIdx(i => i + 1);
      setPhase('intro');
    } else {
      setPhase('complete');
    }
  };

  const togglePause = () => {
    if (isRunning) {
      clearInterval(timerRef.current!);
      setIsRunning(false);
    } else {
      setIsRunning(true);
    }
  };

  const reset = () => {
    clearInterval(timerRef.current!);
    setStageIdx(0);
    setCompletedStages([]);
    setSessionNotes('');
    setIsRunning(false);
    setPhase('intro');
  };

  return (
    <div
      className="flex flex-col min-h-full"
      style={{ background: '#F9FAFB' }}
    >
      {/* Header */}
      <div className="px-5 pt-6 pb-4">
        <div
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase mb-3"
          style={{ background: '#FF960018', border: '1px solid #FF960033', color: '#CC7A00' }}
        >
          Tremor Pacing Lab
        </div>
        <h1 className="text-2xl font-black leading-tight" style={{ color: '#3C3C3C' }}>
          TRE-Style<br />
          <span style={{ color: '#FF9600' }}>Neurogenic Release</span>
        </h1>

        {/* Stage progress */}
        <div className="flex gap-1.5 mt-3">
          {STAGES.map((s, i) => (
            <div
              key={s.id}
              className="h-1.5 flex-1 rounded-full transition-all"
              style={{
                background: completedStages.includes(s.id)
                  ? s.color
                  : i === stageIdx && phase === 'active'
                    ? `${s.color}60`
                    : '#E5E7EB',
              }}
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* STAGE INTRO */}
        {phase === 'intro' && (
          <motion.div
            key={`intro-${stageIdx}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 px-5 pb-8"
          >
            <div
              className="p-4 rounded-3xl mb-4 bg-white"
              style={{ boxShadow: '0 3px 14px rgba(0,0,0,0.05)', border: `1px solid ${currentStage.color}33` }}
            >
              <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: currentStage.color }}>
                Stage {stageIdx + 1} of {STAGES.length}
              </p>
              <h2 className="text-xl font-black mb-2" style={{ color: '#3C3C3C' }}>{currentStage.label}</h2>
              <p className="text-[12px] leading-relaxed" style={{ color: '#6B7280' }}>{currentStage.science}</p>
            </div>

            <div className="space-y-2 mb-6">
              <p className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: '#9CA3AF' }}>Instructions</p>
              {currentStage.instructions.map((instr, i) => (
                <div
                  key={i}
                  className="flex gap-2.5 p-3 rounded-2xl bg-white"
                  style={{ boxShadow: '0 3px 14px rgba(0,0,0,0.05)' }}
                >
                  <span className="text-[11px] font-black shrink-0 mt-0.5" style={{ color: currentStage.color }}>
                    {i + 1}.
                  </span>
                  <p className="text-[12px] leading-relaxed" style={{ color: '#4B5563' }}>{instr}</p>
                </div>
              ))}
            </div>

            <motion.button
              whileTap={{ y: 3, boxShadow: 'none' }}
              onClick={startStage}
              className="w-full py-4 rounded-2xl font-black text-sm text-white flex items-center justify-center gap-2"
              style={{ background: `linear-gradient(135deg,${currentStage.color},${currentStage.color}CC)`, boxShadow: `0 5px 0 ${currentStage.color}99`, minHeight: 48 }}
            >
              <Play className="w-4 h-4" /> Begin Stage ({currentStage.duration}s)
            </motion.button>
          </motion.div>
        )}

        {/* ACTIVE */}
        {phase === 'active' && (
          <motion.div
            key="active"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center px-5 pb-8"
          >
            <div className="py-6 flex flex-col items-center">
              <PacingRings active={isRunning} color={currentStage.color} progress={progress} />
              <p className="text-3xl font-black mt-4" style={{ color: '#3C3C3C' }}>{secondsLeft}s</p>
              <p className="text-[11px] mt-1 font-bold" style={{ color: '#9CA3AF' }}>{currentStage.label}</p>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={instrIdx}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="w-full p-4 rounded-2xl mb-5 text-center bg-white"
                style={{ boxShadow: '0 3px 14px rgba(0,0,0,0.05)', border: '1px solid #F0F0F0' }}
              >
                <p className="text-sm font-bold leading-relaxed" style={{ color: '#3C3C3C' }}>
                  {currentStage.instructions[instrIdx]}
                </p>
              </motion.div>
            </AnimatePresence>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={togglePause}
              className="w-14 h-14 rounded-full flex items-center justify-center bg-white"
              style={{ boxShadow: '0 3px 14px rgba(0,0,0,0.08)', border: `1px solid ${currentStage.color}44` }}
            >
              {isRunning
                ? <Pause className="w-6 h-6" style={{ color: currentStage.color }} />
                : <Play className="w-6 h-6" style={{ color: currentStage.color }} />
              }
            </motion.button>
          </motion.div>
        )}

        {/* REST */}
        {phase === 'rest' && (
          <motion.div
            key="rest"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col items-center justify-center px-5 pb-8 text-center"
          >
            <div className="text-4xl mb-4">🌊</div>
            <h2 className="text-xl font-black mb-2" style={{ color: '#3C3C3C' }}>{currentStage.label} Complete</h2>
            <p className="text-[12px] mb-6 max-w-xs leading-relaxed" style={{ color: '#6B7280' }}>
              Rest for 30–60 seconds. Notice any tingling, warmth, or change in breath. The release is integrating.
            </p>

            <div
              className="w-full p-4 rounded-3xl mb-6 bg-white"
              style={{ boxShadow: '0 3px 14px rgba(0,0,0,0.05)', border: `1px solid ${currentStage.color}33` }}
            >
              <p className="text-[12px] leading-relaxed" style={{ color: '#4B5563' }}>{currentStage.science}</p>
            </div>

            <div className="flex gap-3 w-full">
              <button
                onClick={reset}
                className="flex items-center justify-center gap-1.5 px-4 py-3 rounded-2xl text-sm font-black bg-white"
                style={{ color: '#6B7280', border: '1px solid #F0F0F0', minWidth: 48, minHeight: 48 }}
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <motion.button
                whileTap={{ y: 3, boxShadow: 'none' }}
                onClick={handleNext}
                className="flex-1 py-3 rounded-2xl text-sm font-black text-white flex items-center justify-center gap-2"
                style={{ background: `linear-gradient(135deg,${currentStage.color},${STAGES[Math.min(stageIdx + 1, STAGES.length - 1)].color})`, boxShadow: `0 5px 0 ${currentStage.color}99`, minHeight: 48 }}
              >
                {stageIdx < STAGES.length - 1 ? 'Next Stage' : 'Complete Session'} <ChevronRight className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* COMPLETE */}
        {phase === 'complete' && (
          <motion.div
            key="complete"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 px-5 pb-8"
          >
            <div className="py-8 text-center">
              <div className="text-5xl mb-4">🌿</div>
              <h2 className="text-2xl font-black mb-2" style={{ color: '#3C3C3C' }}>Full TRE Session</h2>
              <p className="text-sm font-black" style={{ color: '#46A302' }}>All 4 stages complete</p>
            </div>

            <div
              className="p-4 rounded-3xl mb-4 bg-white"
              style={{ boxShadow: '0 3px 14px rgba(0,0,0,0.05)', border: '1px solid #58CC0233' }}
            >
              <p className="text-[12px] leading-relaxed" style={{ color: '#4B5563' }}>
                Trauma Release Exercises (TRE) allow the body to complete stress responses that were interrupted. You've completed a full neurogenic tremor cycle — your nervous system has been given permission to discharge and reorganize.
              </p>
            </div>

            <div className="mb-4">
              <p className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: '#9CA3AF' }}>Session notes (optional)</p>
              <textarea
                value={sessionNotes}
                onChange={e => setSessionNotes(e.target.value)}
                placeholder="What did you notice? Any areas of sensation, release, or emotion?..."
                className="w-full p-3 rounded-2xl text-sm outline-none resize-none bg-white"
                style={{
                  color: '#3C3C3C',
                  border: '1px solid #F0F0F0',
                  minHeight: 100,
                }}
              />
            </div>

            <motion.button
              whileTap={{ y: 3, boxShadow: 'none' }}
              onClick={reset}
              className="w-full py-4 rounded-2xl font-black text-sm text-white flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg,#FF9600,#58CC02)', boxShadow: '0 5px 0 #CC7A00', minHeight: 48 }}
            >
              <RotateCcw className="w-4 h-4" /> New Session
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
