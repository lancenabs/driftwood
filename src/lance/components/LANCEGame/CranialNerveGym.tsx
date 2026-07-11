import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, Wind, Waves, ChevronDown, ChevronRight, CheckCircle2, RotateCcw } from 'lucide-react';
import StoryArtPanel from './ui/StoryArtPanel';

const EXERCISES = [
  {
    id: 'eye_tracking',
    name: 'Soft Gaze Tracking',
    nerve: 'Cranial Nerve III / VI',
    icon: Eye,
    color: '#1CB0F6',
    gradient: 'linear-gradient(135deg,#1CB0F6,#0092CC)',
    duration: 60,
    description: 'Slow peripheral eye movements activate the oculomotor nerve and signal safety to the brainstem.',
    steps: [
      'Let your gaze go soft. Don\'t focus on anything specific.',
      'Slowly move your eyes as far left as comfortable — hold 3 seconds.',
      'Slowly move right — hold 3 seconds.',
      'Now up. Hold. Now down. Hold.',
      'Trace a slow figure-8 in the air with your eyes.',
      'Return center. Notice any yawn, sigh, or warmth — that\'s the vagus waking up.',
    ],
  },
  {
    id: 'swallowing',
    name: 'Vagal Swallowing',
    nerve: 'Vagus Nerve (CN X)',
    icon: Waves,
    color: '#58CC02',
    gradient: 'linear-gradient(135deg,#58CC02,#46A302)',
    duration: 45,
    description: 'Conscious swallowing directly activates the vagus nerve and drops heart rate within seconds.',
    steps: [
      'Sit tall. Relax your jaw completely.',
      'Let saliva pool gently. Take your time.',
      'Swallow slowly and consciously — feel the whole action.',
      'Pause 10 seconds. Notice your heartbeat.',
      'Swallow again, even more slowly.',
      'Repeat 3–5 times. Each swallow is a reset signal to your nervous system.',
    ],
  },
  {
    id: 'slow_sigh',
    name: 'Physiological Sigh',
    nerve: 'Phrenic + Vagus',
    icon: Wind,
    color: '#8B5CF6',
    gradient: 'linear-gradient(135deg,#8B5CF6,#7C3AED)',
    duration: 60,
    description: 'Double inhale fully inflates alveoli; long exhale is the fastest known way to lower heart rate.',
    steps: [
      'Breathe in through your nose — full inhale.',
      'At the top, take one quick sniff extra to top off your lungs.',
      'Now breathe out slowly through your mouth. Much longer than the inhale.',
      'Feel your shoulders drop. Feel your chest soften.',
      'Repeat twice more.',
      'After the third sigh, just breathe normally and notice the calm.',
    ],
  },
  {
    id: 'shoulder_drop',
    name: 'Shoulder & Neck Reset',
    nerve: 'Spinal Accessory (CN XI)',
    icon: ChevronDown,
    color: '#FF9600',
    gradient: 'linear-gradient(135deg,#FF9600,#CC7A00)',
    duration: 45,
    description: 'The trapezius holds trauma. Slow shoulder drops directly signal the spinal accessory nerve to release fight/flight tone.',
    steps: [
      'Roll your shoulders up toward your ears — hold 5 seconds.',
      'Let them fall. Don\'t place them — let gravity drop them.',
      'Turn your head slowly right. Pause at the edge. Breathe.',
      'Return center. Turn slowly left. Pause. Breathe.',
      'Gently nod yes three times — slowly.',
      'Final: chin to chest, hold 10 seconds, return. Feel the back of the neck lengthen.',
    ],
  },
];

type Phase = 'menu' | 'active' | 'complete';

interface CranialProps { onExerciseComplete?: () => void; }

export default function CranialNerveGym({ onExerciseComplete }: CranialProps = {}) {
  const [phase, setPhase] = useState<Phase>('menu');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [stepIdx, setStepIdx] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const selected = EXERCISES.find(e => e.id === selectedId);

  const startExercise = (id: string) => {
    const ex = EXERCISES.find(e => e.id === id)!;
    setSelectedId(id);
    setStepIdx(0);
    setSecondsLeft(ex.duration);
    setPhase('active');
  };

  useEffect(() => {
    if (phase !== 'active') return;
    timerRef.current = setInterval(() => {
      setSecondsLeft(s => {
        if (s <= 1) {
          clearInterval(timerRef.current!);
          setCompletedIds(prev => {
            const next = [...new Set([...prev, selectedId!])];
            return next;
          });
          setPhase('complete');
          setTimeout(() => onExerciseComplete?.(), 0);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current!);
  }, [phase, selectedId, onExerciseComplete]);

  const totalDone = completedIds.length;
  const allDone = totalDone === EXERCISES.length;

  return (
    <div
      className="flex flex-col min-h-full"
      style={{ background: '#F9FAFB' }}
    >
      {/* Header */}
      <div className="px-5 pt-6 pb-4">
        <div
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase mb-3"
          style={{ background: '#14B8A618', border: '1px solid #14B8A633', color: '#0D9488' }}
        >
          Cranial Nerve Gym
        </div>
        <h1 className="text-2xl font-black leading-tight" style={{ color: '#3C3C3C' }}>
          Vagus Nerve<br />
          <span style={{ color: '#14B8A6' }}>Activation Protocol</span>
        </h1>
        <p className="text-[12px] mt-2 leading-relaxed" style={{ color: '#6B7280' }}>
          Four evidence-based exercises targeting specific cranial nerves. Each one sends direct "safe" signals to your brainstem — no breathing app required.
        </p>
        <div className="mt-3">
          <StoryArtPanel src="/story-art/cranial_eye_tracking.webp" aspect="16/7" rounded={18}
            eyebrow="Dr. Malakor's Protocol" caption="He designed these to be easy on the worst day of your life. That was the design requirement." />
        </div>
        {totalDone > 0 && (
          <div className="mt-3 flex items-center gap-2">
            <div className="h-1.5 flex-1 rounded-full" style={{ background: '#E5E7EB' }}>
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${(totalDone / EXERCISES.length) * 100}%`, background: 'linear-gradient(90deg,#14B8A6,#58CC02)' }}
              />
            </div>
            <span className="text-[11px] font-black" style={{ color: '#14B8A6' }}>{totalDone}/{EXERCISES.length}</span>
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {/* MENU */}
        {phase === 'menu' && (
          <motion.div
            key="menu"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="flex-1 px-4 pb-8 space-y-3"
          >
            {EXERCISES.map(ex => {
              const Icon = ex.icon;
              const done = completedIds.includes(ex.id);
              return (
                <motion.button
                  key={ex.id}
                  onClick={() => startExercise(ex.id)}
                  whileTap={{ scale: 0.98 }}
                  className="w-full text-left p-4 rounded-3xl transition-all bg-white"
                  style={{
                    boxShadow: '0 3px 14px rgba(0,0,0,0.05)',
                    border: done ? '1px solid #58CC0255' : '1px solid #F0F0F0',
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                      style={{ background: ex.gradient }}
                    >
                      {done ? <CheckCircle2 className="w-5 h-5 text-white" /> : <Icon className="w-5 h-5 text-white" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black" style={{ color: '#3C3C3C' }}>{ex.name}</span>
                        {done && <span className="text-[10px] font-black uppercase tracking-wider" style={{ color: '#46A302' }}>Done</span>}
                      </div>
                      <div className="text-[10px] font-bold mt-0.5" style={{ color: ex.color }}>{ex.nerve}</div>
                      <p className="text-[11px] mt-1 leading-relaxed" style={{ color: '#6B7280' }}>{ex.description}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 shrink-0 mt-3" style={{ color: '#D1D5DB' }} />
                  </div>
                </motion.button>
              );
            })}

            {allDone && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-5 rounded-3xl text-center bg-white"
                style={{ boxShadow: '0 8px 28px rgba(20,184,166,0.16)', border: '2px solid #14B8A633' }}
              >
                <div className="text-2xl mb-1">🧠</div>
                <p className="text-sm font-black" style={{ color: '#0D9488' }}>Full Vagal Reset Complete</p>
                <p className="text-[11px] mt-1" style={{ color: '#6B7280' }}>All four cranial nerve pathways activated. Your nervous system is listening.</p>
                <button
                  onClick={() => { setCompletedIds([]); setPhase('menu'); }}
                  className="mt-3 flex items-center gap-1.5 mx-auto text-[11px] font-bold px-3 py-2 rounded-full"
                  style={{ color: '#6B7280' }}
                >
                  <RotateCcw className="w-3 h-3" /> Reset session
                </button>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* ACTIVE */}
        {phase === 'active' && selected && (
          <motion.div
            key="active"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            className="flex-1 px-5 pb-8 flex flex-col"
          >
            {/* Timer ring */}
            <div className="flex flex-col items-center py-6">
              <div className="relative w-24 h-24">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 96 96">
                  <circle cx="48" cy="48" r="42" fill="none" stroke="#E5E7EB" strokeWidth="6" />
                  <circle
                    cx="48" cy="48" r="42"
                    fill="none"
                    stroke={selected.color}
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 42}`}
                    strokeDashoffset={`${2 * Math.PI * 42 * (1 - secondsLeft / selected.duration)}`}
                    style={{ transition: 'stroke-dashoffset 1s linear' }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-black" style={{ color: '#3C3C3C' }}>{secondsLeft}</span>
                </div>
              </div>
              <p className="text-[11px] mt-2 font-bold" style={{ color: '#9CA3AF' }}>{selected.nerve}</p>
            </div>

            {/* Steps */}
            <div className="space-y-2 flex-1">
              <p className="text-[10px] font-black uppercase tracking-widest mb-3" style={{ color: '#9CA3AF' }}>
                Step {stepIdx + 1} of {selected.steps.length}
              </p>
              <AnimatePresence mode="wait">
                <motion.div
                  key={stepIdx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-5 rounded-3xl bg-white"
                  style={{ boxShadow: '0 3px 14px rgba(0,0,0,0.05)', border: '1px solid #F0F0F0' }}
                >
                  <p className="text-base font-bold leading-relaxed" style={{ color: '#3C3C3C' }}>{selected.steps[stepIdx]}</p>
                </motion.div>
              </AnimatePresence>

              <div className="flex gap-2 mt-4">
                {stepIdx > 0 && (
                  <button
                    onClick={() => setStepIdx(i => i - 1)}
                    className="flex-1 py-3.5 rounded-2xl text-sm font-black bg-white"
                    style={{ color: '#6B7280', border: '1px solid #F0F0F0', minHeight: 44 }}
                  >
                    ← Back
                  </button>
                )}
                {stepIdx < selected.steps.length - 1 ? (
                  <motion.button
                    whileTap={{ y: 2, boxShadow: 'none' }}
                    onClick={() => setStepIdx(i => i + 1)}
                    className="flex-1 py-3.5 rounded-2xl text-sm font-black text-white"
                    style={{ background: selected.gradient, minHeight: 44 }}
                  >
                    Next Step →
                  </motion.button>
                ) : (
                  <motion.button
                    whileTap={{ y: 2, boxShadow: 'none' }}
                    onClick={() => {
                      clearInterval(timerRef.current!);
                      setCompletedIds(prev => [...new Set([...prev, selectedId!])]);
                      setPhase('complete');
                      onExerciseComplete?.();
                    }}
                    className="flex-1 py-3.5 rounded-2xl text-sm font-black text-white"
                    style={{ background: 'linear-gradient(135deg,#58CC02,#14B8A6)', minHeight: 44 }}
                  >
                    Complete ✓
                  </motion.button>
                )}
              </div>
            </div>

            <button
              onClick={() => { clearInterval(timerRef.current!); setPhase('menu'); }}
              className="mt-6 text-[11px] font-bold py-2 px-1"
              style={{ color: '#9CA3AF' }}
            >
              ← Back to exercises
            </button>
          </motion.div>
        )}

        {/* COMPLETE */}
        {phase === 'complete' && selected && (
          <motion.div
            key="complete"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col items-center justify-center px-5 pb-8 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
              className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mb-5"
              style={{ background: '#58CC0218', border: '2px solid #58CC0244' }}
            >
              🧠
            </motion.div>
            <h2 className="text-xl font-black mb-2" style={{ color: '#3C3C3C' }}>{selected.name}</h2>
            <p className="text-sm font-bold mb-4" style={{ color: '#46A302' }}>Cranial nerve activated.</p>
            <p className="text-[12px] leading-relaxed max-w-xs" style={{ color: '#6B7280' }}>
              {selected.nerve} pathway stimulated. Take 30 seconds to notice any changes — warmth, yawning, softening tension.
            </p>
            <div className="flex gap-3 mt-8 w-full max-w-xs">
              <button
                onClick={() => setPhase('menu')}
                className="flex-1 py-3.5 rounded-2xl text-sm font-black bg-white"
                style={{ color: '#6B7280', border: '1px solid #F0F0F0', minHeight: 44 }}
              >
                ← Menu
              </button>
              {completedIds.length < EXERCISES.length && (
                <motion.button
                  whileTap={{ y: 2, boxShadow: 'none' }}
                  onClick={() => {
                    const next = EXERCISES.find(e => !completedIds.includes(e.id));
                    if (next) startExercise(next.id);
                  }}
                  className="flex-1 py-3.5 rounded-2xl text-sm font-black text-white"
                  style={{ background: 'linear-gradient(135deg,#14B8A6,#58CC02)', boxShadow: '0 5px 0 #0D9488', minHeight: 44 }}
                >
                  Next →
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
