import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Volume2, VolumeX } from 'lucide-react';

// Sterling narration, one clip per sense step (see /grounding-audio/).
const STEP_AUDIO = ['/grounding-audio/gr_5_see.m4a', '/grounding-audio/gr_4_feel.m4a', '/grounding-audio/gr_3_hear.m4a', '/grounding-audio/gr_2_smell.m4a', '/grounding-audio/gr_1_taste.m4a'];
import { useGame } from '../LANCEGameContext';
import { INTERN_PERSONALITIES } from '../lanceGameData';
import BigBackButton from '../BigBackButton';
import { GlassPanel, HeroCTA, CoachCard, RewardMoment, pickPraise } from '../ui/GlassKit';

const SENSE_STEPS = [
  {
    count: 5,
    sense: 'see',
    emoji: '👁️',
    heading: '5 things you can SEE',
    prompt: 'Look around slowly. Name what you notice — not just the obvious.',
    placeholder: 'I see...',
    color: '#3ECFCF',
  },
  {
    count: 4,
    sense: 'touch',
    emoji: '🤲',
    heading: '4 things you can TOUCH',
    prompt: 'What can you feel right now — textures, temperatures, surfaces?',
    placeholder: 'I can touch...',
    color: '#7FD98C',
  },
  {
    count: 3,
    sense: 'hear',
    emoji: '👂',
    heading: '3 things you can HEAR',
    prompt: 'Go quiet for a moment. What sounds are present?',
    placeholder: 'I hear...',
    color: '#8B5CF6',
  },
  {
    count: 2,
    sense: 'smell',
    emoji: '👃',
    heading: '2 things you can SMELL',
    prompt: 'Breathe in. What scents are in the air, however faint?',
    placeholder: 'I smell...',
    color: '#f97316',
  },
  {
    count: 1,
    sense: 'taste',
    emoji: '👅',
    heading: '1 thing you can TASTE',
    prompt: 'What do you taste right now, even if subtle?',
    placeholder: 'I taste...',
    color: '#ec4899',
  },
];

const LANCE_GROUNDING_LINES = [
  "Dissociation from present environment: counterproductive. This exercise corrects that. You're welcome.",
  "The 5-4-3-2-1 technique activates your sensory cortex, which competes with the amygdala for processing resources. Anxiety decreases. I know this. You're learning it.",
  "Your nervous system cannot be in both threat-response and present-moment awareness simultaneously. Use that.",
  "Present moment engagement is the single most evidence-based anxiety intervention in existence. I didn't invent it. I merely endorse it reluctantly.",
  "You are in a location. That location has properties. Identify them.",
];

const LANCE_COMPLETE_LINES = [
  "Sensory audit complete. Present-moment orientation: achieved. I monitored your progress. For research. Not concern.",
  "Five senses engaged. You pulled yourself back from wherever you were. That's the skill. You now have it.",
  "Grounding complete. The prefrontal cortex has been re-engaged. You are, for the moment, regulated. This is the goal.",
];

const PRAISE_POOL = [
  'You came back to right now.',
  'All five senses. The room is yours again.',
  'Present. Grounded. Here.',
  'That was the skill, and you just used it.',
];

interface Props {
  onBack: () => void;
  onComplete?: () => void;
  onStepComplete?: () => void;
}

type ToolView = 'intro' | 'session' | 'complete';

// ── Signature: the world comes back into focus ───────────────────────────────
// The Hot Springs region sits behind everything, heavily blurred and dim at the
// start; every completed sense-step sharpens and brightens it. The intervention
// (returning to the present) is made literal on screen.
function RegionFocusBackdrop({ focus }: { focus: number /* 0..1 */ }) {
  const blur = 26 - focus * 22;      // 26px → 4px
  const opacity = 0.3 + focus * 0.5; // 0.3 → 0.8
  const scrim = 0.9 - focus * 0.38;  // heavy → light
  return (
    <>
      <motion.div
        aria-hidden
        className="absolute inset-0"
        animate={{ filter: `blur(${blur}px)`, opacity }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        style={{
          backgroundImage: 'url(/region-heroes/somatic.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transform: 'scale(1.1)',
        }}
      />
      <motion.div
        aria-hidden
        className="absolute inset-0"
        animate={{ opacity: scrim }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        style={{ background: 'linear-gradient(180deg, rgba(240,246,246,0.95) 0%, rgba(240,246,246,0.97) 100%)' }}
      />
    </>
  );
}

// Five glass orbs — one per sense; fills as its step is completed.
function SenseOrbs({ entries, activeIdx }: { entries: string[][]; activeIdx: number }) {
  return (
    <div className="flex justify-center gap-3">
      {SENSE_STEPS.map((s, i) => {
        const done = entries[i].length >= s.count;
        const active = i === activeIdx;
        return (
          <motion.div
            key={s.sense}
            animate={active ? { scale: [1, 1.08, 1] } : { scale: 1 }}
            transition={active ? { repeat: Infinity, duration: 2.4, ease: 'easeInOut' } : {}}
            className="flex flex-col items-center gap-1"
          >
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center text-lg"
              style={{
                background: done ? `linear-gradient(145deg, ${s.color}, ${s.color}AA)` : 'rgba(255,255,255,0.65)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                border: done ? '1px solid rgba(255,255,255,0.7)' : `1.5px solid ${s.color}55`,
                boxShadow: done
                  ? `0 6px 14px ${s.color}55, inset 0 1px 0 rgba(255,255,255,0.5)`
                  : active
                    ? `0 4px 14px ${s.color}40`
                    : '0 2px 8px rgba(0,0,0,0.06)',
                filter: done || active ? 'none' : 'grayscale(0.5) opacity(0.7)',
              }}
            >
              {s.emoji}
            </div>
            <div
              className="text-[9px] font-black"
              style={{ color: done ? s.color : '#9CA3AF' }}
            >
              {done ? '✓' : s.count}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

export default function GroundingTool({ onBack, onComplete, onStepComplete }: Props) {
  const { addXp, intern } = useGame();
  const internPersonality = INTERN_PERSONALITIES.find(p => p.id === intern.personalityId);

  const [view, setView] = useState<ToolView>('intro');
  const [stepIdx, setStepIdx] = useState(0);
  const [entries, setEntries] = useState<string[][]>(SENSE_STEPS.map(() => []));
  const [currentInput, setCurrentInput] = useState('');
  const [xpAwarded, setXpAwarded] = useState(false);
  const [celebrate, setCelebrate] = useState(false);

  const [lanceLine] = useState(() => LANCE_GROUNDING_LINES[Math.floor(Math.random() * LANCE_GROUNDING_LINES.length)]);
  const [lanceComplete] = useState(() => LANCE_COMPLETE_LINES[Math.floor(Math.random() * LANCE_COMPLETE_LINES.length)]);
  const [praise] = useState(() => pickPraise(PRAISE_POOL));

  // Per-step voice guide — stops when the step changes or the tool unmounts.
  const voiceRef = useRef<HTMLAudioElement | null>(null);
  const [voicePlaying, setVoicePlaying] = useState(false);
  useEffect(() => {
    voiceRef.current?.pause();
    setVoicePlaying(false);
  }, [stepIdx]);
  useEffect(() => () => voiceRef.current?.pause(), []);
  const toggleVoice = () => {
    const el = voiceRef.current;
    if (!el) return;
    if (voicePlaying) {
      el.pause();
      setVoicePlaying(false);
    } else {
      el.currentTime = 0;
      el.play();
      setVoicePlaying(true);
    }
  };

  const currentStep = SENSE_STEPS[stepIdx];
  const currentEntries = entries[stepIdx];
  const isStepComplete = currentEntries.length >= currentStep.count;

  // Focus level: fraction of steps fully complete + partial credit on the active one.
  const completedSteps = entries.filter((e, i) => e.length >= SENSE_STEPS[i].count).length;
  const focus = view === 'complete'
    ? 1
    : Math.min(1, (completedSteps + (currentEntries.length / currentStep.count) * 0.6) / SENSE_STEPS.length);

  const addEntry = () => {
    const trimmed = currentInput.trim();
    if (!trimmed) return;
    const updated = entries.map((e, i) => i === stepIdx ? [...e, trimmed] : e);
    setEntries(updated);
    setCurrentInput('');
  };

  const removeEntry = (entryIdx: number) => {
    const updated = entries.map((e, i) => i === stepIdx ? e.filter((_, j) => j !== entryIdx) : e);
    setEntries(updated);
  };

  const nextStep = () => {
    onStepComplete?.();
    if (stepIdx < SENSE_STEPS.length - 1) {
      setStepIdx(s => s + 1);
      setCurrentInput('');
    } else {
      if (!xpAwarded) {
        addXp(20);
        setXpAwarded(true);
      }
      setCelebrate(true);
      setView('complete');
    }
  };

  const reset = () => {
    setView('intro');
    setStepIdx(0);
    setEntries(SENSE_STEPS.map(() => []));
    setCurrentInput('');
    setXpAwarded(false);
  };

  // ── Intro ──
  if (view === 'intro') {
    return (
      <div className="relative flex flex-col h-full overflow-hidden" style={{ color: '#3C3C3C' }}>
        <RegionFocusBackdrop focus={0} />
        <div
          className="relative sticky top-0 z-10 px-4 py-4 flex items-center gap-3"
          style={{ background: 'rgba(255,255,255,0.72)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.85)' }}
        >
          <BigBackButton onBack={onBack} />
          <div>
            <div className="text-[9px] font-black uppercase tracking-widest" style={{ color: '#3ECFCF' }}>Tier 2 · Somatic</div>
            <h2 className="text-sm font-black leading-none" style={{ color: '#1C1C1E' }}>5-4-3-2-1 Grounding</h2>
          </div>
        </div>

        <div className="relative flex-1 overflow-y-auto px-4 py-6 space-y-5 pb-8">
          <div className="py-2">
            <SenseOrbs entries={entries} activeIdx={-1} />
          </div>

          <div className="text-center space-y-2">
            <h3 className="text-lg font-black" style={{ color: '#1C1C1E' }}>Anchor to right now.</h3>
            <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>
              Work through your five senses one at a time. No rush. With each step, the world around you comes back into focus.
            </p>
          </div>

          <CoachCard speaker="lance" pose="thinking">"{lanceLine}"</CoachCard>

          <HeroCTA onClick={() => setView('session')}>Begin Grounding →</HeroCTA>
        </div>
      </div>
    );
  }

  // ── Complete ──
  if (view === 'complete') {
    return (
      <div className="relative flex flex-col h-full overflow-hidden" style={{ color: '#3C3C3C' }}>
        <RegionFocusBackdrop focus={1} />
        <RewardMoment show={celebrate} xp={20} praise={praise} onDone={() => setCelebrate(false)} />
        <div
          className="relative sticky top-0 z-10 px-4 py-4 flex items-center gap-3"
          style={{ background: 'rgba(255,255,255,0.72)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.85)' }}
        >
          <BigBackButton onBack={onBack} />
          <h2 className="text-sm font-black" style={{ color: '#1C1C1E' }}>5-4-3-2-1 Grounding</h2>
        </div>

        <div className="relative flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-8">
          <div className="py-2">
            <SenseOrbs entries={entries} activeIdx={-1} />
          </div>

          {/* Summary */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <GlassPanel className="p-5 space-y-4">
              <div className="text-[9px] font-black uppercase tracking-widest" style={{ color: '#7FD98C' }}>
                ✓ Grounding Complete · +20 XP
              </div>
              {entries.map((stepEntries, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{SENSE_STEPS[i].emoji}</span>
                    <span
                      className="text-[10px] font-black uppercase tracking-wider"
                      style={{ color: SENSE_STEPS[i].color }}
                    >
                      {SENSE_STEPS[i].count} {SENSE_STEPS[i].sense}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pl-7">
                    {stepEntries.map((entry, j) => (
                      <span
                        key={j}
                        className="px-2.5 py-1 rounded-full text-[10px] font-medium"
                        style={{ background: `${SENSE_STEPS[i].color}15`, color: SENSE_STEPS[i].color, border: `1px solid ${SENSE_STEPS[i].color}33` }}
                      >
                        {entry}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </GlassPanel>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <CoachCard speaker="chip" pose="approving" label={intern.name || 'Chip'}>
              {internPersonality?.sampleMessages[1] || "You just pulled yourself back to the present. That skill goes with you everywhere."}
            </CoachCard>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
            <CoachCard speaker="lance" pose="approving">"{lanceComplete}"</CoachCard>
          </motion.div>

          <div className="flex gap-3">
            <button
              onClick={reset}
              className="flex-1 py-3 rounded-2xl font-black text-sm border"
              style={{ borderColor: '#3ECFCF55', color: '#3ECFCF', background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(8px)' }}
            >
              Go Again
            </button>
            <div className="flex-1">
              <HeroCTA onClick={onComplete ?? onBack} style={{ paddingTop: 12, paddingBottom: 12 }}>Done</HeroCTA>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Session ──
  return (
    <div className="relative flex flex-col h-full overflow-hidden" style={{ color: '#3C3C3C' }}>
      <RegionFocusBackdrop focus={focus} />

      {/* Header */}
      <div
        className="relative shrink-0 px-4 py-3 flex items-center gap-3"
        style={{ background: 'rgba(255,255,255,0.72)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.85)' }}
      >
        <button
          onClick={stepIdx > 0 ? () => { setStepIdx(s => s - 1); setCurrentInput(''); } : () => setView('intro')}
          className="p-2 rounded-xl"
          style={{ color: '#6B7280' }}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <SenseOrbs entries={entries} activeIdx={stepIdx} />
        </div>
        <div className="text-[10px] font-black w-8 text-right" style={{ color: '#6B7280' }}>
          {stepIdx + 1}/{SENSE_STEPS.length}
        </div>
      </div>

      {/* Step content */}
      <div className="relative flex-1 overflow-y-auto px-4 py-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={stepIdx}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-5"
          >
            {/* Sense header */}
            <div className="text-center space-y-3 py-4">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                className="text-6xl"
                style={{ filter: `drop-shadow(0 8px 16px ${currentStep.color}44)` }}
              >
                {currentStep.emoji}
              </motion.div>
              <div>
                <h3 className="text-xl font-black" style={{ color: currentStep.color, textShadow: '0 1px 0 rgba(255,255,255,0.7)' }}>
                  {currentStep.heading}
                </h3>
                <p className="text-xs mt-1.5 font-semibold" style={{ color: '#6B7280' }}>
                  {currentStep.prompt}
                </p>
              </div>
              <div className="text-xs font-bold" style={{ color: `${currentStep.color}99` }}>
                {currentEntries.length} of {currentStep.count} named
              </div>
              {/* Voice guide — plays this step's narration on demand */}
              <button
                type="button"
                onClick={toggleVoice}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider"
                style={{
                  background: voicePlaying ? `${currentStep.color}1E` : 'rgba(255,255,255,0.75)',
                  color: voicePlaying ? currentStep.color : '#6B7280',
                  border: `1px solid ${voicePlaying ? `${currentStep.color}66` : 'rgba(0,0,0,0.08)'}`,
                  backdropFilter: 'blur(8px)',
                }}
                aria-label={voicePlaying ? 'Stop voice guide' : 'Play voice guide for this step'}
              >
                {voicePlaying ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                {voicePlaying ? 'Stop' : 'Voice guide'}
              </button>
              <audio ref={voiceRef} src={STEP_AUDIO[stepIdx]} onEnded={() => setVoicePlaying(false)} className="hidden" />
            </div>

            {/* Input */}
            <GlassPanel className="p-4 space-y-3" style={{ borderColor: `${currentStep.color}33` }}>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={currentInput}
                  onChange={e => setCurrentInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addEntry(); } }}
                  placeholder={currentStep.placeholder}
                  className="flex-1 bg-transparent text-sm font-medium outline-none"
                  style={{ color: '#1C1C1E', caretColor: currentStep.color }}
                  disabled={isStepComplete}
                  autoFocus
                />
                {!isStepComplete && (
                  <button
                    onClick={addEntry}
                    disabled={!currentInput.trim()}
                    className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-lg disabled:opacity-30 transition-opacity"
                    style={{ background: `${currentStep.color}22`, color: currentStep.color, border: `1px solid ${currentStep.color}44` }}
                  >
                    +
                  </button>
                )}
              </div>

              {/* Entry chips */}
              {currentEntries.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {currentEntries.map((entry, i) => (
                    <motion.button
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      onClick={() => removeEntry(i)}
                      className="px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 group"
                      style={{
                        background: `${currentStep.color}15`,
                        color: currentStep.color,
                        border: `1px solid ${currentStep.color}33`,
                      }}
                    >
                      {entry}
                      <span className="opacity-40 group-hover:opacity-80 text-[10px]">×</span>
                    </motion.button>
                  ))}
                </div>
              )}
            </GlassPanel>

            {/* Affirming nudge mid-step */}
            {currentEntries.length > 0 && !isStepComplete && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-xs font-semibold"
                style={{ color: `${currentStep.color}99` }}
              >
                {currentStep.count - currentEntries.length} more... the room is getting clearer.
              </motion.p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Advance button */}
      <div
        className="relative shrink-0 px-4 pb-6 pt-3"
        style={{ borderTop: '1px solid rgba(255,255,255,0.6)', background: 'rgba(255,255,255,0.72)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}
      >
        <AnimatePresence>
          {isStepComplete && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              onClick={nextStep}
              className="w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2"
              style={{
                background: `linear-gradient(135deg, ${currentStep.color}, ${currentStep.color}AA)`,
                color: '#FFFFFF',
                border: '1px solid rgba(255,255,255,0.5)',
                boxShadow: `0 3px 0 ${currentStep.color}66, 0 8px 18px ${currentStep.color}45, inset 0 1px 0 rgba(255,255,255,0.45)`,
                textShadow: '0 1px 2px rgba(0,0,0,0.18)',
              }}
            >
              {stepIdx < SENSE_STEPS.length - 1
                ? `Next: ${SENSE_STEPS[stepIdx + 1].emoji} ${SENSE_STEPS[stepIdx + 1].sense}`
                : 'Complete Grounding ✓'
              }
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
