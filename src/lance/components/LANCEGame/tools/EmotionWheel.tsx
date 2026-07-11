import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check } from 'lucide-react';
import { useGame } from '../LANCEGameContext';
import LanceAvatar from '../LanceAvatar';
import BigBackButton from '../BigBackButton';
import { GlassPanel, CoachCard, RewardMoment, pickPraise } from '../ui/GlassKit';

// ─────────────────────────────────────────────────────────────────────────────
// Emotion Wheel — now an ACTUAL wheel. Eight petals bloom open from the center
// on entrance; picking one makes it pulse in its color while the others recede;
// the nuanced shades then bloom in beneath. Logging persists to localStorage
// (previously entries vanished on close).
// ─────────────────────────────────────────────────────────────────────────────

const EMOTION_WHEEL: Record<string, { color: string; emoji: string; shades: string[] }> = {
  Joy:      { color: '#f59e0b', emoji: '☀️', shades: ['Excited', 'Happy', 'Content', 'Playful', 'Proud', 'Grateful'] },
  Sadness:  { color: '#6366f1', emoji: '🌧️', shades: ['Lonely', 'Hopeless', 'Grief', 'Disappointed', 'Regretful', 'Empty'] },
  Fear:     { color: '#8B5CF6', emoji: '🌫️', shades: ['Anxious', 'Overwhelmed', 'Helpless', 'Terrified', 'Insecure', 'Threatened'] },
  Anger:    { color: '#ef4444', emoji: '🔥', shades: ['Frustrated', 'Irritated', 'Enraged', 'Resentful', 'Disgusted', 'Jealous'] },
  Disgust:  { color: '#10b981', emoji: '🌿', shades: ['Contemptuous', 'Avoidant', 'Repulsed', 'Judgmental', 'Revolted', 'Appalled'] },
  Surprise: { color: '#3ECFCF', emoji: '⚡', shades: ['Amazed', 'Confused', 'Shocked', 'Excited', 'Startled', 'Astonished'] },
  Shame:    { color: '#ec4899', emoji: '🌑', shades: ['Humiliated', 'Embarrassed', 'Exposed', 'Worthless', 'Guilty', 'Inadequate'] },
  Trust:    { color: '#7FD98C', emoji: '🌊', shades: ['Accepted', 'Secure', 'Open', 'Belonging', 'Respected', 'Safe'] },
};

const CORE_EMOTIONS = Object.keys(EMOTION_WHEEL);
const STORAGE_KEY = 'lance_emotion_wheel_v1';

interface EmotionEntry {
  ts: number;
  core: string;
  shade: string | null;
  intensity: number;
  note?: string;
}

function loadEntries(): EmotionEntry[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
}
function saveEntry(entry: EmotionEntry) {
  const all = [entry, ...loadEntries()].slice(0, 60);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

const LANCE_LINES = [
  '"Fine" is not an emotion. Try again. I\'ll wait.',
  "Naming the emotion precisely is the first act of emotional intelligence. You're doing it now.",
  "The human emotional vocabulary contains over 34,000 words. 'Fine' and 'okay' are not among the useful ones.",
  "Emotional granularity: the ability to differentiate feelings precisely. Studies show it reduces distress duration. This is what we're building.",
];

const LANCE_COMPLETE_LINES = [
  "You identified the specific emotion rather than a placeholder. This is harder than it looks. I'm noting the precision.",
  "Specificity reduces reactivity. You've just done something neurologically meaningful. You're welcome.",
  "The emotional label you selected activates the prefrontal cortex, dampening the amygdala's alarm. Labeling is regulating.",
];

const PRAISE_POOL = [
  'Named. And naming is taming.',
  'One precise word beats a thousand vague ones.',
  'The bloom opened. So did you.',
  'That word is a handle on the feeling now.',
];

// ── The blooming wheel ────────────────────────────────────────────────────────
function PetalWheel({ selected, onSelect, tint }: {
  selected: string | null;
  onSelect: (e: string) => void;
  tint: string | null;
}) {
  const SIZE = 330;
  const C = SIZE / 2;
  const R = 102; // petal orbit radius
  const reduced = typeof window !== 'undefined'
    && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  return (
    <div className="relative mx-auto" style={{ width: SIZE, height: SIZE }}>
      {/* Center hub */}
      <motion.div
        initial={reduced ? {} : { scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 16 }}
        className="absolute rounded-full flex flex-col items-center justify-center text-center"
        style={{
          width: 96, height: 96, left: C - 48, top: C - 48,
          background: 'rgba(255,255,255,0.8)',
          backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
          border: `2px solid ${tint ?? 'rgba(255,255,255,0.95)'}`,
          boxShadow: tint ? `0 0 28px ${tint}55` : '0 6px 18px rgba(0,0,0,0.08)',
          zIndex: 2,
          transition: 'border-color 0.4s, box-shadow 0.4s',
        }}
      >
        {selected ? (
          <>
            <span className="text-2xl">{EMOTION_WHEEL[selected].emoji}</span>
            <span className="text-[10px] font-black" style={{ color: tint ?? '#3C3C3C' }}>{selected}</span>
          </>
        ) : (
          <span className="text-[10px] font-black px-3 leading-tight" style={{ color: '#6B7280' }}>
            Tap the petal closest to the feeling
          </span>
        )}
      </motion.div>
      {/* Petals */}
      {CORE_EMOTIONS.map((e, i) => {
        const { color, emoji } = EMOTION_WHEEL[e];
        const angle = (i / CORE_EMOTIONS.length) * Math.PI * 2 - Math.PI / 2;
        const x = C + R * Math.cos(angle);
        const y = C + R * Math.sin(angle);
        const isSel = selected === e;
        const dimmed = selected !== null && !isSel;
        return (
          <motion.button
            key={e}
            initial={reduced ? {} : { scale: 0, opacity: 0, x: C - x, y: C - y }}
            animate={{
              scale: isSel ? [1, 1.09, 1] : dimmed ? 0.82 : 1,
              opacity: dimmed ? 0.45 : 1,
              x: 0, y: 0,
            }}
            transition={
              isSel
                ? { scale: { duration: 1.6, repeat: Infinity, ease: 'easeInOut' } }
                : { type: 'spring', stiffness: 190, damping: 15, delay: reduced ? 0 : i * 0.06 }
            }
            whileTap={{ scale: 0.9 }}
            onClick={() => onSelect(e)}
            aria-label={e}
            aria-pressed={isSel}
            className="absolute flex flex-col items-center justify-center gap-0.5"
            style={{
              width: 78, height: 92,
              left: x - 39, top: y - 46,
              // petal: soft teardrop pointing outward from center
              borderRadius: '50% 50% 50% 50% / 62% 62% 42% 42%',
              background: isSel
                ? `linear-gradient(160deg, ${color}, ${color}CC)`
                : `linear-gradient(160deg, ${color}2E, ${color}55)`,
              border: `2px solid ${isSel ? '#FFFFFF' : `${color}66`}`,
              boxShadow: isSel
                ? `0 8px 24px ${color}77, inset 0 1px 0 rgba(255,255,255,0.5)`
                : `0 4px 12px ${color}33, inset 0 1px 0 rgba(255,255,255,0.6)`,
              filter: dimmed ? 'saturate(0.5)' : 'none',
            }}
          >
            <span className="text-lg" aria-hidden>{emoji}</span>
            <span className="text-[10px] font-black" style={{ color: isSel ? '#FFF' : color, textShadow: isSel ? '0 1px 2px rgba(0,0,0,0.25)' : 'none' }}>
              {e}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}

// Recent feelings shelf — the last few named emotions as colored petals.
function RecentPetals({ entries }: { entries: EmotionEntry[] }) {
  if (entries.length === 0) return null;
  const recent = entries.slice(0, 6);
  return (
    <GlassPanel className="p-4">
      <div className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: '#9CA3AF' }}>
        Recently named
      </div>
      <div className="flex flex-wrap gap-1.5">
        {recent.map((en, i) => {
          const c = EMOTION_WHEEL[en.core]?.color ?? '#3ECFCF';
          return (
            <span key={i} className="px-3 py-1.5 rounded-full text-[10px] font-black"
              style={{ background: `${c}1E`, border: `1px solid ${c}55`, color: c }}>
              {EMOTION_WHEEL[en.core]?.emoji} {en.shade ?? en.core} · {en.intensity}%
            </span>
          );
        })}
      </div>
    </GlassPanel>
  );
}

function MoodBackdrop({ tint }: { tint: string | null }) {
  return (
    <>
      <div aria-hidden className="absolute inset-0" style={{
        backgroundImage: 'url(/region-heroes/mood.webp)',
        backgroundSize: 'cover', backgroundPosition: 'center',
        filter: 'blur(20px)', transform: 'scale(1.1)', opacity: 0.38,
        zIndex: -1, pointerEvents: 'none',
      }} />
      <div aria-hidden className="absolute inset-0" style={{
        background: 'linear-gradient(180deg, rgba(247,248,250,0.88) 0%, rgba(247,248,250,0.93) 100%)',
        zIndex: -1, pointerEvents: 'none',
      }} />
      <div aria-hidden className="absolute inset-0 transition-all duration-700" style={{
        background: tint ? `radial-gradient(ellipse at 50% 30%, ${tint}30 0%, transparent 65%)` : 'none',
        zIndex: -1, pointerEvents: 'none',
      }} />
    </>
  );
}

export default function EmotionWheel({ onBack }: { onBack: () => void }) {
  const { addXp, intern } = useGame();
  const [coreEmotion, setCoreEmotion] = useState<string | null>(null);
  const [nuancedEmotion, setNuancedEmotion] = useState<string | null>(null);
  const [intensity, setIntensity] = useState(50);
  const [note, setNote] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [xpAwarded, setXpAwarded] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const [entries] = useState<EmotionEntry[]>(loadEntries);
  const [praise] = useState(() => pickPraise(PRAISE_POOL));

  const [lanceLine] = useState(() => LANCE_LINES[Math.floor(Math.random() * LANCE_LINES.length)]);
  const [lanceComplete] = useState(() => LANCE_COMPLETE_LINES[Math.floor(Math.random() * LANCE_COMPLETE_LINES.length)]);

  const selectedData = coreEmotion ? EMOTION_WHEEL[coreEmotion] : null;
  const tint = selectedData?.color ?? null;

  const handleSubmit = () => {
    saveEntry({ ts: Date.now(), core: coreEmotion!, shade: nuancedEmotion, intensity, note: note.trim() || undefined });
    if (!xpAwarded) {
      addXp(20);
      setXpAwarded(true);
    }
    setCelebrate(true);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="relative flex flex-col h-full overflow-hidden" style={{ background: 'transparent', color: '#3C3C3C' }}>
        <MoodBackdrop tint={tint} />
        <RewardMoment show={celebrate} xp={20} praise={praise} onDone={() => setCelebrate(false)} />
        <div className="relative px-4 py-4 flex items-center gap-3"
          style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.85)' }}>
          <BigBackButton onBack={onBack} />
          <h2 className="text-sm font-black">Emotion Wheel</h2>
        </div>

        <div className="relative flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <GlassPanel className="p-5 text-center space-y-3" style={{ border: `2px solid ${tint ?? '#3ECFCF'}55` }}>
              <motion.div
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 220, damping: 13 }}
                className="text-5xl"
              >
                {selectedData?.emoji}
              </motion.div>
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-black text-sm"
                style={{ background: `${tint ?? '#3ECFCF'}22`, color: tint ?? '#3ECFCF' }}
              >
                <Check className="w-4 h-4" />
                {nuancedEmotion ?? coreEmotion}
              </div>
              <p className="text-[10px] uppercase tracking-widest font-bold" style={{ color: '#9CA3AF' }}>
                Core: {coreEmotion} · Intensity: {intensity}%
              </p>
              {note && <p className="text-xs italic" style={{ color: '#9CA3AF' }}>"{note}"</p>}
              <div
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black"
                style={{ background: '#7FD98C22', color: '#4B9E63' }}
              >
                +20 XP — Emotion named
              </div>
            </GlassPanel>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <CoachCard speaker="chip" pose="approving" label={intern.name || 'Chip'}>
              Naming it exactly like that — "{nuancedEmotion ?? coreEmotion}" — gives your brain a handle on it. That's real emotional regulation.
            </CoachCard>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
            <CoachCard speaker="lance" pose="approving">"{lanceComplete}"</CoachCard>
          </motion.div>

          <RecentPetals entries={loadEntries()} />

          <button
            onClick={onBack}
            className="w-full py-4 rounded-2xl font-black text-sm"
            style={{
              background: `linear-gradient(135deg, ${tint ?? '#3ECFCF'}, #3ECFCF)`, color: '#FFF',
              boxShadow: `0 3px 0 ${tint ?? '#3ECFCF'}88, 0 8px 18px ${tint ?? '#3ECFCF'}45`,
              textShadow: '0 1px 2px rgba(0,0,0,0.18)',
            }}
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col h-full overflow-hidden" style={{ background: 'transparent', color: '#3C3C3C' }}>
      <MoodBackdrop tint={tint} />
      {/* Header */}
      <div
        className="relative sticky top-0 z-10 px-4 py-4 flex items-center gap-3"
        style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.85)' }}
      >
        <BigBackButton onBack={onBack} />
        <img src="/icons/emotion_wheel.webp" alt="" draggable={false}
          style={{ width: 34, height: 34, borderRadius: 10, boxShadow: `0 4px 10px ${tint ?? '#3ECFCF'}44` }} />
        <div className="min-w-0">
          <h2 className="text-sm font-black leading-none truncate">Emotion Wheel</h2>
          <div className="text-[10px] font-semibold mt-0.5 truncate" style={{ color: '#6B7280' }}>Tier 3 · Name it to tame it</div>
        </div>
      </div>

      <div className="relative flex-1 overflow-y-auto px-4 py-4 space-y-5 pb-8">
        <CoachCard speaker="lance" pose="pointing">{lanceLine}</CoachCard>

        {/* Step 1: the blooming wheel */}
        <PetalWheel
          selected={coreEmotion}
          onSelect={e => { setCoreEmotion(e); setNuancedEmotion(null); }}
          tint={tint}
        />

        {/* Step 2: nuanced shades bloom in */}
        <AnimatePresence>
          {coreEmotion && selectedData && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3 overflow-hidden"
            >
              <div className="text-[10px] font-black uppercase tracking-widest text-center" style={{ color: selectedData.color }}>
                Which shade of {coreEmotion.toLowerCase()}?
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {selectedData.shades.map((shade, i) => {
                  const selected = nuancedEmotion === shade;
                  return (
                    <motion.button
                      key={shade}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 260, damping: 16, delay: i * 0.05 }}
                      whileTap={{ scale: 0.92 }}
                      onClick={() => setNuancedEmotion(shade)}
                      className="rounded-full py-2.5 px-4 text-center text-[11px] font-bold transition-colors"
                      style={{
                        background: selected ? selectedData.color : `${selectedData.color}1A`,
                        border: `1.5px solid ${selected ? '#FFF' : `${selectedData.color}55`}`,
                        color: selected ? '#FFF' : selectedData.color,
                        boxShadow: selected ? `0 6px 16px ${selectedData.color}66` : 'none',
                        textShadow: selected ? '0 1px 2px rgba(0,0,0,0.2)' : 'none',
                      }}
                    >
                      {shade}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step 3: intensity + context */}
        <AnimatePresence>
          {nuancedEmotion && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3 overflow-hidden"
            >
              <GlassPanel className="p-4 space-y-3">
                <div className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#9CA3AF' }}>
                  How intense? <span style={{ color: selectedData?.color ?? '#3ECFCF' }}>{intensity}%</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={100}
                  step={5}
                  value={intensity}
                  onChange={e => setIntensity(Number(e.target.value))}
                  className="w-full"
                  style={{ accentColor: selectedData?.color ?? '#3ECFCF' }}
                  aria-label="Emotion intensity"
                />
                <div className="flex justify-between text-[9px] font-bold" style={{ color: '#9CA3AF' }}>
                  <span>Barely there</span><span>Overwhelming</span>
                </div>
              </GlassPanel>

              <GlassPanel className="p-4">
                <div className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: '#9CA3AF' }}>
                  Context <span style={{ color: '#C4C7D4' }}>(optional)</span>
                </div>
                <textarea
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  rows={2}
                  maxLength={200}
                  placeholder="What brought this on? What triggered it?"
                  aria-label="Context for this emotion"
                  className="w-full bg-transparent text-sm outline-none resize-none"
                  style={{ color: '#3C3C3C', caretColor: selectedData?.color ?? '#3ECFCF' }}
                />
              </GlassPanel>

              <button
                onClick={handleSubmit}
                className="w-full py-4 rounded-2xl font-black text-sm transition-all active:scale-95"
                style={{
                  background: `linear-gradient(135deg, ${selectedData?.color ?? '#3ECFCF'}, #3ECFCF)`, color: '#FFF',
                  border: '1px solid rgba(255,255,255,0.5)',
                  boxShadow: `0 3px 0 ${selectedData?.color ?? '#3ECFCF'}88, 0 8px 18px ${selectedData?.color ?? '#3ECFCF'}45, inset 0 1px 0 rgba(255,255,255,0.4)`,
                  textShadow: '0 1px 2px rgba(0,0,0,0.18)',
                }}
              >
                Log Emotion ✓
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <RecentPetals entries={entries} />
      </div>
    </div>
  );
}
