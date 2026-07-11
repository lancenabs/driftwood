import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronRight, ChevronLeft, Play, Pause } from 'lucide-react';

interface Props {
  onClose: () => void;
  internName: string;
  internAvatar: string;
}

interface TutorialStep {
  title: string;
  speaker: 'System' | 'L.A.N.C.E.' | 'Intern';
  text: string;
  icon: string;
  duration: number; // seconds per step
}

const TUTORIAL_STEPS: TutorialStep[] = [
  {
    title: "Welcome to L.A.N.C.E.",
    speaker: "System",
    text: "You've been quarantined on a remote island by an AI named LANCE. The only way out is through 31 psychological challenges. Your guide — the Intern — has decided to stay and help you escape.",
    icon: "🏝️",
    duration: 7,
  },
  {
    title: "The Story Mode",
    speaker: "L.A.N.C.E.",
    text: "Thirty-one challenges. Five acts. Each challenge unlocks a therapeutic tool and advances the escape narrative. Do them in order or LANCE will know. He knows everything.",
    icon: "⚡",
    duration: 7,
  },
  {
    title: "Your Tools",
    speaker: "Intern",
    text: "Every challenge you complete unlocks a real therapy tool. These aren't games — they're CBT, DBT, somatic, and depth techniques used by actual therapists. LANCE designed them to contain you. We'll use them to escape.",
    icon: "🛠️",
    duration: 8,
  },
  {
    title: "The Check-In Tab",
    speaker: "Intern",
    text: "The Check-In tab is your daily home base. Quick mood logs, breathing, grounding — tools you can open any time, not just during challenges. Your nervous system doesn't care what act you're in.",
    icon: "✅",
    duration: 7,
  },
  {
    title: "The Library",
    speaker: "L.A.N.C.E.",
    text: "The Library contains every tool you've unlocked, organized by therapeutic category. You may browse freely. I recommend you study the higher tiers. They are more... complex. For a reason.",
    icon: "📚",
    duration: 7,
  },
  {
    title: "Mood Tracking",
    speaker: "Intern",
    text: "LANCE watches your mood data. So do I — but for different reasons. The more you log, the more the app adapts its tone to where you actually are. Anxious, low-energy, peaceful — it responds to you.",
    icon: "💜",
    duration: 7,
  },
  {
    title: "The Island Map",
    speaker: "Intern",
    text: "In the Challenges tab, switch to the Island sub-view to see where you are in the escape. Each challenge you complete unlocks a fragment of my backstory. I've been here a long time. There's a lot to tell.",
    icon: "🗺️",
    duration: 7,
  },
  {
    title: "The Insights Tab",
    speaker: "L.A.N.C.E.",
    text: "Insights displays your mood patterns, XP progression, and weekly analysis. I collect this data for containment purposes. The Intern believes reviewing it builds self-awareness. You may decide who is correct.",
    icon: "📊",
    duration: 7,
  },
  {
    title: "Ready to Begin",
    speaker: "Intern",
    text: "That's everything you need. The first challenge is already waiting for you. LANCE thinks you won't make it past Act I. I've watched a lot of people surprise him. I have a feeling you're next.",
    icon: "🚀",
    duration: 7,
  },
];

const SPEAKER_COLORS = {
  'System':    '#F59E0B',
  'L.A.N.C.E.': '#F87171',
  'Intern':    '#3ECFCF',
};

export default function AppTutorialOverlay({ onClose, internName, internAvatar }: Props) {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  const current = TUTORIAL_STEPS[step];
  const isFirst = step === 0;
  const isLast = step === TUTORIAL_STEPS.length - 1;

  const goNext = () => {
    if (isLast) { onClose(); return; }
    setStep(s => s + 1);
    setProgress(0);
    lastTimeRef.current = null;
  };

  const goPrev = () => {
    if (isFirst) return;
    setStep(s => s - 1);
    setProgress(0);
    lastTimeRef.current = null;
  };

  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) cancelAnimationFrame(timerRef.current);
      return;
    }

    const tick = (now: number) => {
      if (lastTimeRef.current === null) lastTimeRef.current = now;
      const dt = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      setProgress(prev => {
        const next = prev + dt / current.duration;
        if (next >= 1) { goNext(); return 0; }
        return next;
      });
      timerRef.current = requestAnimationFrame(tick);
    };

    lastTimeRef.current = null;
    timerRef.current = requestAnimationFrame(tick);
    return () => { if (timerRef.current) cancelAnimationFrame(timerRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, step]);

  const speakerColor = SPEAKER_COLORS[current.speaker];

  return (
    <motion.div
      className="fixed inset-0 z-[180] flex flex-col"
      style={{ background: 'rgba(6,16,26,0.97)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Progress bar across top */}
      <div className="h-1 w-full" style={{ background: '#1e3a4a' }}>
        <motion.div
          className="h-full"
          style={{ background: speakerColor }}
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      {/* Step dots */}
      <div className="flex items-center justify-center gap-1.5 pt-4 pb-2 px-4">
        {TUTORIAL_STEPS.map((_, i) => (
          <button key={i} onClick={() => { setStep(i); setProgress(0); }}
            className="rounded-full transition-all"
            style={{
              width: i === step ? 16 : 6,
              height: 6,
              background: i === step ? speakerColor : i < step ? '#2a4a5a' : '#1e3a4a',
            }} />
        ))}
      </div>

      {/* Close */}
      <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center"
        style={{ background: 'rgba(255,255,255,0.08)' }}>
        <X className="w-4 h-4 text-gray-400" />
      </button>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }} className="flex flex-col items-center gap-5 text-center max-w-sm w-full">

            {/* Big icon */}
            <div className="text-6xl">{current.icon}</div>

            {/* Speaker badge */}
            <span className="text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest"
              style={{ background: speakerColor + '22', color: speakerColor }}>
              {current.speaker === 'Intern' ? `${internName} (Intern)` : current.speaker}
            </span>

            {/* Title */}
            <h2 className="text-xl font-black text-white">{current.title}</h2>

            {/* Text */}
            <p className="text-gray-300 text-sm leading-relaxed">{current.text}</p>

            {/* Intern avatar for intern steps */}
            {current.speaker === 'Intern' && (
              <div className="flex items-center gap-2 mt-1">
                <span className="text-2xl">{internAvatar}</span>
                <span className="text-[11px] text-teal-400">{internName}</span>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between px-6 pb-10 pt-4">
        <button onClick={goPrev} disabled={isFirst}
          className="w-11 h-11 rounded-2xl flex items-center justify-center disabled:opacity-30"
          style={{ background: '#1e3a4a' }}>
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>

        <button onClick={() => setIsPlaying(p => !p)}
          className="w-11 h-11 rounded-2xl flex items-center justify-center"
          style={{ background: speakerColor + '22', border: `1px solid ${speakerColor}44` }}>
          {isPlaying ? <Pause className="w-4 h-4" style={{ color: speakerColor }} /> : <Play className="w-4 h-4" style={{ color: speakerColor }} />}
        </button>

        <button onClick={goNext}
          className="w-11 h-11 rounded-2xl flex items-center justify-center"
          style={{ background: speakerColor }}>
          <ChevronRight className="w-5 h-5 text-white" />
        </button>
      </div>

      <p className="text-center text-[10px] text-gray-600 pb-4">
        {step + 1} / {TUTORIAL_STEPS.length}
      </p>
    </motion.div>
  );
}
