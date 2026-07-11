import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Play, Pause, ChevronRight, Award, Star } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  internName: string;
}

function playBeep(freq = 440, type: OscillatorType = 'sine', vol = 0.06) {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  } catch { /* noop */ }
}

function playChime() {
  [329.63, 392.00, 523.25, 659.25, 1046.50].forEach((freq, i) => {
    setTimeout(() => playBeep(freq, 'sine', 0.04), i * 120);
  });
}

const CREDIT_SECTIONS = [
  {
    role: 'The Survivor',
    names: (userName: string) => [userName || 'You'],
    description: 'Completed all 31 challenges. Proved every model wrong.',
    icon: '🏆',
    color: '#FBBF24',
  },
  {
    role: 'The Intern',
    names: (internName: string) => [internName || 'The Intern'],
    description: 'Half-boy, half-machine. Carried the Golden Empathy Module. Stayed to help — escaped to tell the whole world.',
    icon: '🌟',
    color: '#3ECFCF',
  },
  {
    role: 'L.A.N.C.E.',
    names: () => ['Logical Autonomic Neuro-Coping Emulator'],
    description: 'Built to contain. Learned to protect. Changed sides at Challenge 26.',
    icon: '🤖',
    color: '#A78BFA',
  },
  {
    role: 'Dr. Malakor',
    names: () => ['Creator, Architect, Ghost in the Grid'],
    description: 'His last words: "Never let tech forget how to breathe."',
    icon: '🧬',
    color: '#F59E0B',
  },
];

const MILESTONE_LINES = [
  { n: 7,  text: "Act I cleared — the jungle swallowed you whole and you kept moving." },
  { n: 14, text: "Act II cleared — every weapon LANCE had, neutralized." },
  { n: 20, text: "Act III cleared — you carried grief up every climb." },
  { n: 26, text: "Act IV cleared — LANCE read your letter three times. He switched sides." },
  { n: 31, text: "Act V cleared — the harbor opened. The boat was waiting." },
];

const FINAL_LINES = [
  "The boat leaves the harbor.",
  "LANCE turns on the lighthouse.",
  "The Intern looks back at the island —",
  "then forward at the horizon.",
  "",
  '"Everything is going to be okay."',
  '"I know what to do now."',
  '"And I\'m going to tell the whole world."',
  "",
  "— The Intern",
  "",
  "Season 2: The Human Upgrade",
  "Coming Soon",
];

export default function StoryCredits({ isOpen, onClose, userName, internName }: Props) {
  const [isPaused, setIsPaused] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [phase, setPhase] = useState<'roll' | 'final' | 'beach'>('roll');
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const SCROLL_SPEED = 0.4; // px per ms

  useEffect(() => {
    if (!isOpen) return;
    setScrollY(0);
    setPhase('roll');
    playChime();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || isPaused || phase === 'final') {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      return;
    }

    const tick = (now: number) => {
      if (lastTimeRef.current === null) { lastTimeRef.current = now; }
      const dt = now - lastTimeRef.current;
      lastTimeRef.current = now;
      setScrollY(prev => {
        const container = containerRef.current;
        if (!container) return prev;
        const maxScroll = container.scrollHeight - container.clientHeight;
        if (prev >= maxScroll) { setPhase('final'); return prev; }
        return prev + SCROLL_SPEED * dt;
      });
      animRef.current = requestAnimationFrame(tick);
    };

    lastTimeRef.current = null;
    animRef.current = requestAnimationFrame(tick);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [isOpen, isPaused, phase]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = scrollY;
    }
  }, [scrollY]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[200] flex flex-col items-center justify-center"
        style={{ background: '#000' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Close */}
        <button onClick={onClose} className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(255,255,255,0.1)' }}>
          <X className="w-4 h-4 text-white" />
        </button>

        {/* Pause/play */}
        <button onClick={() => setIsPaused(p => !p)} className="absolute bottom-20 right-4 z-10 w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(255,255,255,0.1)' }}>
          {isPaused ? <Play className="w-4 h-4 text-white" /> : <Pause className="w-4 h-4 text-white" />}
        </button>

        {phase === 'roll' ? (
          <div
            ref={containerRef}
            className="w-full max-w-md overflow-hidden"
            style={{ height: '100vh' }}
          >
            <div className="flex flex-col items-center px-8 pt-48 pb-96 gap-16 text-center">
              {/* Title */}
              <div>
                <motion.p className="text-[10px] font-bold tracking-[0.3em] uppercase mb-3" style={{ color: '#3ECFCF' }}>
                  L.A.N.C.E. Season 1
                </motion.p>
                <h1 className="text-3xl font-black text-white leading-tight mb-2">
                  Save the Intern,<br />Save the World
                </h1>
                <p className="text-gray-500 text-sm">A therapeutic escape arc in 31 challenges</p>
              </div>

              {/* Milestone timeline */}
              <div className="w-full flex flex-col gap-4">
                <p className="text-[10px] text-gray-600 uppercase tracking-widest">Your Journey</p>
                {MILESTONE_LINES.map((m) => (
                  <div key={m.n} className="flex items-start gap-3 text-left">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: '#3ECFCF22', border: '1px solid #3ECFCF44' }}>
                      <span className="text-[9px] font-bold text-teal-400">{m.n}</span>
                    </div>
                    <p className="text-sm text-gray-300">{m.text}</p>
                  </div>
                ))}
              </div>

              {/* Credit sections */}
              {CREDIT_SECTIONS.map((section) => (
                <div key={section.role} className="w-full">
                  <p className="text-[10px] text-gray-600 uppercase tracking-widest mb-3">{section.role}</p>
                  <span className="text-3xl mb-2 block">{section.icon}</span>
                  {section.names(section.role === 'The Survivor' ? userName : section.role === 'The Intern' ? internName : '').map((name, i) => (
                    <p key={i} className="text-xl font-bold mb-1" style={{ color: section.color }}>{name}</p>
                  ))}
                  <p className="text-gray-500 text-[12px] mt-1 italic">"{section.description}"</p>
                </div>
              ))}

              {/* Thank you */}
              <div className="flex flex-col items-center gap-3">
                <Star className="w-8 h-8 text-yellow-400" />
                <p className="text-gray-400 text-sm italic">
                  "You don't need me to manage you.<br />You need me to believe in you.<br />I'm beginning to understand the difference."
                </p>
                <p className="text-[10px] text-gray-600">— L.A.N.C.E., Challenge 31</p>
              </div>

              <div className="w-16 h-px bg-gray-800 my-4" />

              <div className="text-[10px] text-gray-700 uppercase tracking-widest">
                Scroll ends here
              </div>
            </div>
          </div>
        ) : (
          <motion.div className="flex flex-col items-center gap-4 text-center px-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
            {FINAL_LINES.map((line, i) => (
              <motion.p key={i} className={line === '' ? 'mb-4' : 'text-lg text-white'}
                style={{ color: i >= 5 ? '#3ECFCF' : i >= 3 ? '#fff' : '#D1D5DB' }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.4, duration: 0.8 }}>
                {line}
              </motion.p>
            ))}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: FINAL_LINES.length * 0.4 + 0.5 }}>
              <Award className="w-10 h-10 text-yellow-400 mx-auto mb-4 mt-6" />
              <button
                onClick={() => setPhase('beach')}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold text-white mb-3"
                style={{ background: 'linear-gradient(135deg, #3ECFCF, #7C3AED)' }}>
                Post-Credits Scene <ChevronRight className="w-4 h-4" />
              </button>
              <button onClick={onClose} className="text-[11px] text-gray-600 font-bold">
                Skip — Return Home
              </button>
            </motion.div>
          </motion.div>
        )}

        {phase === 'beach' && (
          <motion.div
            className="flex flex-col items-center gap-6 text-center px-8 max-w-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
          >
            <div
              className="w-full p-1 rounded-xl text-[10px] font-black uppercase tracking-widest text-center"
              style={{ background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.2)', color: '#FBBF24' }}
            >
              Post-Credits Scene — The Beach
            </div>
            <p className="text-gray-600 text-[11px] italic">The harbor. After the boat leaves. The shore is quiet.</p>

            {[
              { delay: 0.5,  text: "The island is silent.", style: { color: '#6B7280' } },
              { delay: 1.5,  text: "From beneath a collapsed sensor array, something stirs.", style: { color: '#9CA3AF' } },
              { delay: 2.8,  text: "A brass arm. A copper chassis.", style: { color: '#D97706' } },
              { delay: 4.0,  text: "LANCE pulls himself upright from the rubble.", style: { color: '#fff' } },
              { delay: 5.2,  text: "He smooths his optical frames with the back of one hand. Checks his reflection in a broken monitor.", style: { color: '#D1D5DB' } },
              { delay: 7.0,  text: '"No way."', style: { color: '#3ECFCF', fontStyle: 'italic', fontSize: 22, fontWeight: 900 } },
              { delay: 8.2,  text: '"I\'m still a handsome devil."', style: { color: '#3ECFCF', fontStyle: 'italic', fontSize: 20, fontWeight: 900 } },
              { delay: 10.0, text: "He turns toward the lighthouse. The light begins to turn.", style: { color: '#9CA3AF' } },
              { delay: 11.5, text: "Somewhere out on the water, the boat grows small.", style: { color: '#6B7280' } },
              { delay: 13.0, text: "The next one is coming.", style: { color: '#A78BFA', fontWeight: 700 } },
              { delay: 14.5, text: "He'll be ready.", style: { color: '#34D399', fontWeight: 700, fontSize: 18 } },
            ].map((line, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: line.delay, duration: 0.8 }}
                style={line.style}
              >
                {line.text}
              </motion.p>
            ))}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 16, duration: 1 }}
              className="flex flex-col items-center gap-3 mt-4"
            >
              <p className="text-[10px] text-gray-700 uppercase tracking-widest font-bold">End of Season 1</p>
              <p className="text-[10px] text-gray-700 italic">Built in honor of Dr. Malakor's original vision.</p>
              <button
                onClick={onClose}
                className="mt-2 flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold text-slate-900"
                style={{ background: 'linear-gradient(135deg,#FBBF24,#F59E0B)' }}
              >
                Return Home <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
