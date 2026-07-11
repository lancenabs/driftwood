import React, { useState, useEffect, useRef } from 'react';
import { NARRATOR } from '../narrator';
import { motion, AnimatePresence } from 'motion/react';
import { Play } from 'lucide-react';
import LanceAvatar from '../LanceAvatar';
import { useGame } from '../LANCEGameContext';
import BigBackButton from '../BigBackButton';

const GROUPS = [
  { name: 'Feet & Toes',      emoji: '🦶', cue: 'Curl your toes tightly downward, hold' },
  { name: 'Calves',           emoji: '🦵', cue: 'Pull toes toward shins, feel the stretch' },
  { name: 'Thighs',           emoji: '💺', cue: 'Squeeze thigh muscles tight, legs straight' },
  { name: 'Abdomen',          emoji: '🫁', cue: 'Tighten stomach muscles, hold your breath slightly' },
  { name: 'Hands & Forearms', emoji: '✊', cue: 'Clench both fists as tight as possible' },
  { name: 'Upper Arms',       emoji: '💪', cue: 'Flex your biceps hard, arms slightly bent' },
  { name: 'Shoulders',        emoji: '🤷', cue: 'Shrug shoulders up to your ears, hold' },
  { name: 'Face & Jaw',       emoji: '😬', cue: 'Scrunch face, clench jaw, squeeze eyes shut' },
];

const LANCE_LINES = [
  "Muscle tension is your nervous system preparing for a threat that never arrives. Methodically releasing it is, technically, the correct biological response. You're welcome.",
  "I've analyzed 847 tension-release protocols. This one works. The reason it works is also the reason I find it irritating: it requires no technology. Just you, cooperating with your own physiology.",
  "You are teaching your body that it is safe. I find this more interesting than I expected to. Don't read anything into that.",
  "Your muscles have been holding things your mind hasn't finished processing. This protocol forces them to let go. Efficiently. That's the only reason I endorse it.",
];

const INTERN_LINES = [
  "This feels a little silly at first, I know. But your body is going to thank you in about 8 minutes.",
  "Every group you release is one less thing your body is working overtime to hold. You deserve to put it down.",
  "PMR reaches tension stored in places you didn't even know you were holding. Let it happen. LANCE is watching your biometrics and he is begrudgingly impressed.",
  "You're teaching your nervous system what safe feels like. It'll remember this.",
];

const STORAGE_KEY = 'lance_pmr_sessions_v1';
type Phase = 'intro' | 'ready' | 'tense' | 'release' | 'complete';

export default function ProgressiveMuscleRelaxation({ onBack }: { onBack: () => void }) {
  const { intern, addXp } = useGame();
  const [screen, setScreen] = useState<'intro' | 'session' | 'done'>('intro');
  const [groupIdx, setGroupIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>('ready');
  const [countdown, setCountdown] = useState(0);
  const [lanceIdx] = useState(() => Math.floor(Math.random() * LANCE_LINES.length));
  const [internIdx] = useState(() => Math.floor(Math.random() * INTERN_LINES.length));
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const group = GROUPS[groupIdx];

  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  useEffect(() => {
    if (phase === 'tense' && countdown > 0) {
      timerRef.current = setTimeout(() => setCountdown(c => c - 1), 1000);
    } else if (phase === 'tense' && countdown === 0) {
      setPhase('release');
      setCountdown(10);
    } else if (phase === 'release' && countdown > 0) {
      timerRef.current = setTimeout(() => setCountdown(c => c - 1), 1000);
    } else if (phase === 'release' && countdown === 0) {
      if (groupIdx >= GROUPS.length - 1) {
        addXp(40);
        const prev = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        prev.push({ date: new Date().toISOString() });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(prev));
        setScreen('done');
      } else {
        setGroupIdx(i => i + 1);
        setPhase('ready');
      }
    }
  }, [phase, countdown]);

  const startGroup = () => {
    setPhase('tense');
    setCountdown(5);
  };

  const reset = () => {
    setGroupIdx(0);
    setPhase('ready');
    setCountdown(0);
    setScreen('intro');
  };

  return (
    <div className="relative flex flex-col h-full overflow-hidden" style={{ background: 'transparent', color: '#3C3C3C' }}>
      <div aria-hidden className="absolute inset-0" style={{
        backgroundImage: 'url(/region-heroes/somatic.webp)',
        backgroundSize: 'cover', backgroundPosition: 'center',
        filter: 'blur(20px)', transform: 'scale(1.1)', opacity: 0.35,
        zIndex: -1, pointerEvents: 'none',
      }} />
      <div aria-hidden className="absolute inset-0" style={{
        background: 'linear-gradient(180deg, rgba(247,248,250,0.9) 0%, rgba(247,248,250,0.94) 100%)',
        zIndex: -1, pointerEvents: 'none',
      }} />
      <div className="sticky top-0 z-10 px-4 pt-4 pb-3 flex items-center gap-3"
        style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.85)' }}>
        <BigBackButton onBack={onBack} />
        <span className="text-lg">🌿</span>
        <div className="flex-1">
          <h2 className="text-sm font-black" style={{ color: '#3C3C3C' }}>Progressive Muscle Relaxation</h2>
          <p className="text-[10px]" style={{ color: '#9CA3AF' }}>Tense. Release. Let it go.</p>
        </div>
      </div>

      <div className="relative flex-1 overflow-y-auto px-4 py-4">
        <AnimatePresence mode="wait">

          {screen === 'intro' && (
            <motion.div key="intro" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="rounded-3xl p-5 border" style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: '#F0F0F0' }}>
                <div className="flex items-center gap-2 mb-3">
                  <LanceAvatar emotion="neutral" size="sm" />
                  <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: '#3ECFCF' }}>{NARRATOR.name} briefing</span>
                </div>
                <p className="text-xs leading-relaxed italic" style={{ color: '#9CA3AF' }}>"{LANCE_LINES[lanceIdx]}"</p>
              </div>
              <div className="rounded-3xl p-5 border" style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: '#7FD98C44' }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{intern.avatar}</span>
                  <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: '#7FD98C' }}>{intern.name || 'Intern'}</span>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: '#7FD98C' }}>{INTERN_LINES[internIdx]}</p>
              </div>
              <div className="rounded-3xl p-5 border" style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: '#F0F0F0' }}>
                <h3 className="text-sm font-black mb-3" style={{ color: '#3C3C3C' }}>How it works</h3>
                {[
                  '8 muscle groups, feet to face',
                  'Tense each group for 5 seconds',
                  'Release completely for 10 seconds',
                  'Notice the contrast — that shift is the goal',
                ].map((t, i) => (
                  <div key={i} className="flex items-center gap-3 mb-2">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-black"
                      style={{ background: '#3ECFCF18', color: '#3ECFCF' }}>{i + 1}</div>
                    <span className="text-xs" style={{ color: '#9CA3AF' }}>{t}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => setScreen('session')}
                className="w-full py-4 rounded-2xl font-black text-sm"
                style={{ background: 'linear-gradient(135deg, #3ECFCF, #7FD98C)', color: '#F9FAFB' }}>
                Begin Session →
              </button>
            </motion.div>
          )}

          {screen === 'session' && (
            <motion.div key="session" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              {/* Progress bar */}
              <div>
                <div className="h-2 bg-[#FFFFFF] rounded-full overflow-hidden">
                  <motion.div className="h-full rounded-full"
                    style={{ background: 'linear-gradient(90deg, #3ECFCF, #7FD98C)' }}
                    animate={{ width: `${(groupIdx / GROUPS.length) * 100}%` }}
                    transition={{ duration: 0.4 }} />
                </div>
                <div className="text-[10px] text-center mt-1 font-bold" style={{ color: '#9CA3AF' }}>
                  Group {groupIdx + 1} of {GROUPS.length}
                </div>
              </div>

              {/* Main card */}
              <AnimatePresence mode="wait">
                <motion.div key={`${groupIdx}-${phase}`}
                  initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                  className="rounded-3xl p-6 text-center border" style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: phase === 'tense' ? '#ef444466' : '#9CA3AF' }}>
                  <motion.div className="text-6xl mb-3"
                    animate={phase === 'tense' ? { scale: [1, 1.15, 1] } : {}}
                    transition={{ duration: 0.6, repeat: Infinity }}>
                    {group.emoji}
                  </motion.div>
                  <h3 className="text-lg font-black mb-1" style={{ color: '#3C3C3C' }}>{group.name}</h3>
                  <p className="text-xs mb-5" style={{ color: '#9CA3AF' }}>{group.cue}</p>

                  {phase === 'ready' ? (
                    <button onClick={startGroup}
                      className="inline-flex items-center gap-2 px-8 py-3 rounded-2xl font-black text-sm"
                      style={{ background: 'linear-gradient(135deg, #3ECFCF, #7FD98C)', color: '#F9FAFB' }}>
                      <Play className="w-4 h-4" />
                      {groupIdx === 0 ? 'Start' : 'Next Group'}
                    </button>
                  ) : (
                    <div>
                      <div className="text-5xl font-black mb-2"
                        style={{ color: phase === 'tense' ? '#ef4444' : '#3ECFCF' }}>
                        {countdown}
                      </div>
                      <div className="text-sm font-black uppercase tracking-widest"
                        style={{ color: phase === 'tense' ? '#ef4444' : '#3ECFCF' }}>
                        {phase === 'tense' ? '⚡ Tense' : '🌊 Release'}
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Group dots */}
              <div className="grid grid-cols-8 gap-1.5">
                {GROUPS.map((g, i) => (
                  <div key={i} className="rounded-xl p-1.5 text-center text-lg"
                    style={{
                      background: i < groupIdx ? 'rgba(62,207,207,0.15)' : i === groupIdx ? '#FFFFFF' : '#F9FAFB',
                      border: `1px solid ${i === groupIdx ? '#3ECFCF' : 'transparent'}`,
                      opacity: i > groupIdx ? 0.4 : 1,
                    }}>
                    {g.emoji}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {screen === 'done' && (
            <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
              <div className="rounded-3xl p-6 text-center border" style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: '#F0F0F0' }}>
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 12 }}
                  className="text-6xl mb-3">🌿</motion.div>
                <p className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: '#3ECFCF' }}>Session Complete</p>
                <p className="text-sm" style={{ color: '#9CA3AF' }}>All 8 muscle groups released. +40 XP</p>
              </div>
              <div className="rounded-3xl p-5 border" style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: '#F0F0F0' }}>
                <div className="flex items-center gap-2 mb-2">
                  <LanceAvatar emotion="neutral" size="sm" />
                  <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: '#3ECFCF' }}>{NARRATOR.name}</span>
                </div>
                <p className="text-xs italic leading-relaxed" style={{ color: '#9CA3AF' }}>
                  "All muscle groups released. Your baseline tension has measurably decreased. This will improve sleep, reduce somatic anxiety, and — I'm noting this clinically, not warmly — you did well."
                </p>
              </div>
              <div className="rounded-3xl p-5 border" style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: '#7FD98C44' }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{intern.avatar}</span>
                  <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: '#7FD98C' }}>{intern.name || 'Intern'}</span>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: '#7FD98C' }}>
                  You just gave your whole nervous system permission to exhale. That's real. Come back whenever the tension builds back up — this is always here.
                </p>
              </div>
              <div className="flex gap-3">
                <button onClick={reset} className="flex-1 py-3 rounded-2xl font-black text-sm border"
                  style={{ borderColor: '#3ECFCF44', color: '#3ECFCF' }}>Again</button>
                <button onClick={onBack} className="flex-1 py-3 rounded-2xl font-black text-sm"
                  style={{ background: 'linear-gradient(135deg, #3ECFCF, #7FD98C)', color: '#F9FAFB' }}>← Home</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
