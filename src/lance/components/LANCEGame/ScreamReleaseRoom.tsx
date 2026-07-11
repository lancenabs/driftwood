import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, MicOff, Wind, Edit3, RotateCcw, ChevronRight } from 'lucide-react';

type Phase = 'intro' | 'release' | 'journal' | 'integration';

const RELEASE_PROMPTS = [
  'What have you been holding back?',
  'What has no one let you say out loud?',
  'What would you scream into the ocean if no one could hear?',
  'What does your body want to push out right now?',
  'What are you finally allowed to feel?',
];

const SOUND_TYPES = [
  { id: 'scream', label: 'Full Scream', desc: 'Maximum discharge', emoji: '🔊', color: '#EC4899', intensity: 1.0 },
  { id: 'roar', label: 'Low Roar', desc: 'From the chest', emoji: '🦁', color: '#FF9600', intensity: 0.8 },
  { id: 'sigh', label: 'Cathartic Sigh', desc: 'Long and deep', emoji: '💨', color: '#1CB0F6', intensity: 0.5 },
  { id: 'hum', label: 'Tonal Hum', desc: 'Vocal cord vibration', emoji: '〰️', color: '#8B5CF6', intensity: 0.4 },
];

function SoundVisualizer({ active, intensity = 0.5, color = '#EC4899' }: { active: boolean; intensity?: number; color?: string }) {
  const bars = 20;
  return (
    <div className="flex items-center justify-center gap-1 h-16">
      {Array.from({ length: bars }).map((_, i) => (
        <motion.div
          key={i}
          className="rounded-full"
          style={{ width: 4, background: color, opacity: active ? 0.9 : 0.15 }}
          animate={active ? {
            height: [
              8,
              8 + Math.random() * 48 * intensity,
              8 + Math.random() * 32 * intensity,
              8 + Math.random() * 56 * intensity,
              8,
            ],
          } : { height: 8 }}
          transition={active ? {
            duration: 0.3 + Math.random() * 0.4,
            repeat: Infinity,
            repeatType: 'reverse',
            delay: i * 0.03,
            ease: 'easeInOut',
          } : { duration: 0.3 }}
        />
      ))}
    </div>
  );
}

export default function ScreamReleaseRoom() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [selectedSound, setSelectedSound] = useState(SOUND_TYPES[0]);
  const [isReleasing, setIsReleasing] = useState(false);
  const [releaseCount, setReleaseCount] = useState(0);
  const [promptIdx, setPromptIdx] = useState(() => Math.floor(Math.random() * RELEASE_PROMPTS.length));
  const [journalText, setJournalText] = useState('');
  const [holdSeconds, setHoldSeconds] = useState(0);
  const holdTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const maxHoldTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pressStartRef = useRef<number>(0);

  const startRelease = (e?: React.PointerEvent) => {
    if (isReleasing) return;
    // Capture the pointer so a firm press/drag can't fire a premature pointerleave.
    try { if (e) e.currentTarget.setPointerCapture(e.pointerId); } catch { /* older browsers */ }
    setIsReleasing(true);
    pressStartRef.current = Date.now();
    holdTimerRef.current = setInterval(() => {
      setHoldSeconds(s => s + 1);
    }, 1000);
    // Safety net: auto-stop after 30s so a cancelled/lost touch can never leave
    // the button stuck in the "RELEASING" state.
    maxHoldTimerRef.current = setTimeout(() => endRelease(), 30_000);
  };

  const endRelease = () => {
    if (holdTimerRef.current) { clearInterval(holdTimerRef.current); holdTimerRef.current = null; }
    if (maxHoldTimerRef.current) { clearTimeout(maxHoldTimerRef.current); maxHoldTimerRef.current = null; }
    if (!pressStartRef.current) { setIsReleasing(false); setHoldSeconds(0); return; }
    setIsReleasing(false);
    const duration = (Date.now() - pressStartRef.current) / 1000;
    if (duration > 0.5) setReleaseCount(c => c + 1);
    pressStartRef.current = 0;
    setHoldSeconds(0);
  };

  useEffect(() => {
    return () => {
      if (holdTimerRef.current) clearInterval(holdTimerRef.current);
      if (maxHoldTimerRef.current) clearTimeout(maxHoldTimerRef.current);
    };
  }, []);

  return (
    <div
      className="flex flex-col min-h-full"
      style={{ background: '#F9FAFB' }}
    >
      {/* Header */}
      <div className="px-5 pt-6 pb-4">
        <div
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase mb-3"
          style={{ background: '#EC489918', border: '1px solid #EC489933', color: '#DB2777' }}
        >
          Scream Release Room
        </div>
        <h1 className="text-2xl font-black leading-tight" style={{ color: '#3C3C3C' }}>
          Somatic<br />
          <span style={{ color: '#EC4899' }}>Discharge Lab</span>
        </h1>
      </div>

      <AnimatePresence mode="wait">
        {/* INTRO */}
        {phase === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex-1 px-5 pb-8"
          >
            <div
              className="p-4 rounded-3xl mb-5 bg-white"
              style={{ boxShadow: '0 3px 14px rgba(0,0,0,0.05)', border: '1px solid #EC489933' }}
            >
              <p className="text-[12px] leading-relaxed" style={{ color: '#4B5563' }}>
                <span className="font-black" style={{ color: '#DB2777' }}>Primal discharge</span> is not anger — it's the nervous system completing an incomplete stress response. Animals do this naturally. We suppress it. This room is safe.
              </p>
            </div>

            <p className="text-[10px] font-black uppercase tracking-widest mb-3" style={{ color: '#9CA3AF' }}>Choose your release type</p>
            <div className="grid grid-cols-2 gap-2 mb-6">
              {SOUND_TYPES.map(s => (
                <button
                  key={s.id}
                  onClick={() => setSelectedSound(s)}
                  className="p-3 rounded-2xl text-left transition-all active:scale-95 bg-white"
                  style={{
                    boxShadow: '0 3px 14px rgba(0,0,0,0.05)',
                    background: selectedSound.id === s.id ? `${s.color}12` : '#FFFFFF',
                    border: selectedSound.id === s.id ? `2px solid ${s.color}` : '2px solid #F0F0F0',
                    minHeight: 44,
                  }}
                >
                  <div className="text-xl mb-1">{s.emoji}</div>
                  <div className="text-sm font-black" style={{ color: '#3C3C3C' }}>{s.label}</div>
                  <div className="text-[11px]" style={{ color: '#9CA3AF' }}>{s.desc}</div>
                </button>
              ))}
            </div>

            <div
              className="p-4 rounded-3xl mb-5 bg-white"
              style={{ boxShadow: '0 3px 14px rgba(0,0,0,0.05)' }}
            >
              <p className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: '#9CA3AF' }}>Your prompt</p>
              <p className="text-base font-bold italic" style={{ color: '#3C3C3C' }}>"{RELEASE_PROMPTS[promptIdx]}"</p>
              <button
                onClick={() => setPromptIdx(i => (i + 1) % RELEASE_PROMPTS.length)}
                className="mt-2 text-[11px] font-bold py-2"
                style={{ color: '#EC4899' }}
              >
                Different prompt →
              </button>
            </div>

            <motion.button
              whileTap={{ y: 3, boxShadow: 'none' }}
              onClick={() => setPhase('release')}
              className="w-full py-4 rounded-2xl text-sm font-black text-white"
              style={{ background: `linear-gradient(135deg,${selectedSound.color},#DB2777)`, boxShadow: '0 5px 0 #9D174D', minHeight: 48 }}
            >
              Enter the Room →
            </motion.button>
          </motion.div>
        )}

        {/* RELEASE */}
        {phase === 'release' && (
          <motion.div
            key="release"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center px-5 pb-8"
          >
            <div
              className="w-full p-4 rounded-3xl mb-5 text-center bg-white"
              style={{ boxShadow: '0 3px 14px rgba(0,0,0,0.05)' }}
            >
              <p className="text-sm italic" style={{ color: '#6B7280' }}>"{RELEASE_PROMPTS[promptIdx]}"</p>
            </div>

            <SoundVisualizer active={isReleasing} intensity={selectedSound.intensity} color={selectedSound.color} />

            <div className="text-center my-6">
              <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: '#9CA3AF' }}>
                {releaseCount} release{releaseCount !== 1 ? 's' : ''} complete
              </p>
              {isReleasing && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-2xl font-black"
                  style={{ color: selectedSound.color }}
                >
                  {holdSeconds}s — let it out
                </motion.p>
              )}
            </div>

            {/* Big hold button */}
            <motion.button
              onPointerDown={startRelease}
              onPointerUp={endRelease}
              onPointerCancel={endRelease}
              onPointerLeave={endRelease}
              whileTap={{ scale: 0.93 }}
              className="w-40 h-40 rounded-full flex flex-col items-center justify-center gap-2 select-none touch-none"
              style={{
                background: isReleasing
                  ? `radial-gradient(circle,${selectedSound.color}55,${selectedSound.color}20)`
                  : '#FFFFFF',
                border: isReleasing
                  ? `3px solid ${selectedSound.color}`
                  : '3px solid #F0F0F0',
                boxShadow: isReleasing ? `0 0 40px ${selectedSound.color}55` : '0 3px 14px rgba(0,0,0,0.05)',
                transition: 'all 0.15s ease',
              }}
            >
              <span className="text-3xl">{selectedSound.emoji}</span>
              <span className="text-[11px] font-black uppercase tracking-wider" style={{ color: isReleasing ? selectedSound.color : '#6B7280' }}>
                {isReleasing ? 'RELEASING' : 'HOLD TO RELEASE'}
              </span>
            </motion.button>

            <p className="text-[11px] text-center mt-4 max-w-xs" style={{ color: '#9CA3AF' }}>
              Press and hold. Make sound — aloud if possible. Your body knows what to do.
            </p>

            {releaseCount >= 1 && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => setPhase('journal')}
                className="mt-6 flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-black bg-white"
                style={{ color: '#3C3C3C', border: '1px solid #F0F0F0', boxShadow: '0 3px 14px rgba(0,0,0,0.05)', minHeight: 44 }}
              >
                <Edit3 className="w-4 h-4" /> Journal What Came Up <ChevronRight className="w-4 h-4" />
              </motion.button>
            )}

            <button
              onClick={() => setPhase('intro')}
              className="mt-4 text-[11px] font-bold py-2"
              style={{ color: '#9CA3AF' }}
            >
              ← Back
            </button>
          </motion.div>
        )}

        {/* JOURNAL */}
        {phase === 'journal' && (
          <motion.div
            key="journal"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex-1 px-5 pb-8 flex flex-col"
          >
            <div className="mb-4">
              <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: '#9CA3AF' }}>After the release</p>
              <h2 className="text-xl font-black" style={{ color: '#3C3C3C' }}>What came up?</h2>
              <p className="text-[12px] mt-1" style={{ color: '#6B7280' }}>Discharge without integration is incomplete. Write without filtering.</p>
            </div>

            <textarea
              value={journalText}
              onChange={e => setJournalText(e.target.value)}
              placeholder="What happened in your body? What thought or image came up? What do you notice now that it's out?..."
              className="flex-1 p-4 rounded-3xl text-sm leading-relaxed resize-none outline-none bg-white"
              style={{
                color: '#3C3C3C',
                border: '1px solid #F0F0F0',
                boxShadow: '0 3px 14px rgba(0,0,0,0.05)',
                minHeight: 180,
                caretColor: '#EC4899',
              }}
            />

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setPhase('release')}
                className="flex-1 py-3.5 rounded-2xl text-sm font-black bg-white"
                style={{ color: '#6B7280', border: '1px solid #F0F0F0', minHeight: 48 }}
              >
                ← More Release
              </button>
              <motion.button
                whileTap={{ y: 3, boxShadow: 'none' }}
                onClick={() => setPhase('integration')}
                className="flex-1 py-3.5 rounded-2xl text-sm font-black text-white"
                style={{ background: 'linear-gradient(135deg,#EC4899,#8B5CF6)', boxShadow: '0 5px 0 #9D174D', minHeight: 48 }}
              >
                Integrate →
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* INTEGRATION */}
        {phase === 'integration' && (
          <motion.div
            key="integration"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 px-5 pb-8"
          >
            <div className="py-6 text-center">
              <div className="text-5xl mb-3">🌊</div>
              <h2 className="text-2xl font-black" style={{ color: '#3C3C3C' }}>Session Complete</h2>
              <p className="text-[12px] mt-2" style={{ color: '#6B7280' }}>{releaseCount} discharge{releaseCount !== 1 ? 's' : ''} completed</p>
            </div>

            <div
              className="p-4 rounded-3xl mb-4 bg-white"
              style={{ boxShadow: '0 3px 14px rgba(0,0,0,0.05)', border: '1px solid #EC489933' }}
            >
              <p className="text-[12px] leading-relaxed" style={{ color: '#4B5563' }}>
                The nervous system doesn't distinguish between a real threat and an incomplete stress response from years ago. By discharging somatically, you completed the cycle your body started.
              </p>
            </div>

            {journalText.trim() && (
              <div
                className="p-4 rounded-3xl mb-4 bg-white"
                style={{ boxShadow: '0 3px 14px rgba(0,0,0,0.05)' }}
              >
                <p className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: '#9CA3AF' }}>Your words</p>
                <p className="text-sm leading-relaxed italic" style={{ color: '#4B5563' }}>{journalText}</p>
              </div>
            )}

            <div className="flex gap-3">
              <motion.button
                whileTap={{ y: 3, boxShadow: 'none' }}
                onClick={() => { setReleaseCount(0); setJournalText(''); setPhase('intro'); }}
                className="flex-1 py-3.5 rounded-2xl text-sm font-black text-white flex items-center justify-center gap-1.5"
                style={{ background: 'linear-gradient(135deg,#EC4899,#8B5CF6)', boxShadow: '0 5px 0 #9D174D', minHeight: 48 }}
              >
                <RotateCcw className="w-4 h-4" /> New Session
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
