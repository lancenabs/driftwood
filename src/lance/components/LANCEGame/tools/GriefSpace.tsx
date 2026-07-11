import React, { useState } from 'react';
import { NARRATOR } from '../narrator';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft } from 'lucide-react';
import LanceAvatar from '../LanceAvatar';
import { useGame } from '../LANCEGameContext';
import BigBackButton from '../BigBackButton';
import StoryArtPanel from '../ui/StoryArtPanel';

interface GriefEntry {
  id: string;
  date: string;
  loss: string;
  stage: string;
  stageNote: string;
  letter: string;
  whatRemains: string;
}

const STORAGE_KEY = 'lance_grief_v1';
function load(): GriefEntry[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
}
function save(e: GriefEntry[]) { localStorage.setItem(STORAGE_KEY, JSON.stringify(e)); }

const STAGES = [
  { id: 'denial', label: 'Denial', emoji: '😶', desc: 'Not fully real yet. Going through the motions.', color: '#94a3b8' },
  { id: 'anger', label: 'Anger', emoji: '🔥', desc: 'Rage at the loss, at the unfairness, at anyone nearby.', color: '#ef4444' },
  { id: 'bargaining', label: 'Bargaining', emoji: '🤲', desc: '"If only I had..." / "What if..." / Replaying what could have been.', color: '#f59e0b' },
  { id: 'depression', label: 'Depression', emoji: '🌧️', desc: 'The weight of it. Emptiness. Withdrawal.', color: '#60a5fa' },
  { id: 'acceptance', label: 'Acceptance', emoji: '🌱', desc: 'Not "okay with it" — just learning to carry it.', color: '#7FD98C' },
  { id: 'between', label: 'Between stages', emoji: '🌀', desc: 'Moving through multiple at once, or none clearly.', color: '#a78bfa' },
];

// ── The lantern ritual ───────────────────────────────────────────────────────
// Each completed entry lights a lantern that joins a persistent shore. Grief is
// exempt from gamification: no confetti, no celebration — a lantern, lit.
function Lantern({ size = 26, delay = 0, lit = true }: { size?: number; delay?: number; lit?: boolean; key?: React.Key }) {
  const reduced = typeof window !== 'undefined'
    && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  return (
    <motion.div
      animate={reduced ? {} : { y: [0, -3, 0] }}
      transition={{ duration: 3.5 + delay, repeat: Infinity, ease: 'easeInOut', delay }}
      className="relative flex flex-col items-center"
      style={{ width: size }}
      aria-hidden
    >
      {/* handle */}
      <div style={{ width: size * 0.35, height: size * 0.18, borderRadius: '50% 50% 0 0', border: '1.5px solid #B45309', borderBottom: 'none' }} />
      {/* body */}
      <motion.div
        animate={reduced || !lit ? {} : { boxShadow: [`0 0 ${size * 0.5}px rgba(251,191,36,0.5)`, `0 0 ${size * 0.9}px rgba(251,191,36,0.75)`, `0 0 ${size * 0.5}px rgba(251,191,36,0.5)`] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay }}
        className="rounded-md flex items-center justify-center"
        style={{
          width: size, height: size * 1.25,
          background: lit
            ? 'linear-gradient(180deg, rgba(253,230,138,0.95), rgba(245,158,11,0.9))'
            : 'rgba(148,163,184,0.35)',
          border: '1.5px solid #B45309',
          boxShadow: lit ? `0 0 ${size * 0.6}px rgba(251,191,36,0.6)` : 'none',
        }}
      >
        {lit && (
          <motion.span
            animate={reduced ? {} : { opacity: [0.7, 1, 0.8, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, delay }}
            style={{ fontSize: size * 0.5 }}
          >
            🔥
          </motion.span>
        )}
      </motion.div>
    </motion.div>
  );
}

function LanternShore({ count }: { count: number }) {
  if (count === 0) return null;
  const visible = Math.min(count, 10);
  return (
    <div className="rounded-3xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.6)', boxShadow: '0 8px 24px rgba(30,39,73,0.35)' }}>
      {/* The canyon of lanterns — every lantern below is one of these lights */}
      <StoryArtPanel src="/story-art/emdr_light_capsules.webp" aspect="16/8" rounded={0}
        eyebrow="The Lantern Canyon" caption="What you release doesn't disappear. It keeps burning, somewhere gentler." />
      <div className="relative px-4 pt-5 pb-2" style={{ background: 'linear-gradient(180deg, #1E2749 0%, #2A3356 78%, #38406B 100%)' }}>
        <div className="text-[9px] font-black uppercase tracking-widest mb-3 text-center" style={{ color: 'rgba(253,230,138,0.8)' }}>
          The shore · {count} lantern{count !== 1 ? 's' : ''} lit
        </div>
        <div className="flex items-end justify-center gap-3 flex-wrap pb-1">
          {Array.from({ length: visible }, (_, i) => (
            <Lantern key={i} size={22} delay={i * 0.4} />
          ))}
          {count > visible && (
            <span className="text-[10px] font-bold self-center" style={{ color: 'rgba(253,230,138,0.7)' }}>+{count - visible}</span>
          )}
        </div>
        {/* water reflection */}
        <div className="h-3 mt-1 rounded-full mx-6" style={{ background: 'linear-gradient(180deg, rgba(251,191,36,0.14), transparent)', filter: 'blur(2px)' }} />
      </div>
    </div>
  );
}

function DepthBackdrop() {
  return (
    <>
      <div aria-hidden className="absolute inset-0" style={{
        backgroundImage: 'url(/region-heroes/depth.webp)',
        backgroundSize: 'cover', backgroundPosition: 'center',
        filter: 'blur(20px)', transform: 'scale(1.1)', opacity: 0.35,
        zIndex: -1, pointerEvents: 'none',
      }} />
      <div aria-hidden className="absolute inset-0" style={{
        background: 'linear-gradient(180deg, rgba(247,248,250,0.9) 0%, rgba(247,248,250,0.94) 100%)',
        zIndex: -1, pointerEvents: 'none',
      }} />
    </>
  );
}

const LANCE_LINES = [
  "Documented. Grief is not a linear process and these stages are not checkboxes. They are common experiences — not a sequence you are required to complete in order. What you logged matters.",
  "Recorded. Grief research consistently shows that the absence of visible distress does not indicate the absence of grief. You are not behind. You are where you are.",
  "Filed. Continuing bonds theory suggests that maintaining an internal relationship with what was lost — rather than 'moving on' — is often healthier than the old model of detachment. The letter you wrote is part of that.",
  "Noted. Grief has no expiration date. The intensity typically changes over time, but the loss itself is permanent. What you wrote today is a real record of where you are.",
];

const INTERN_LINES = [
  "Grief takes so much energy — more than people realize. The fact that you showed up to name it and sit with it today is significant. You don't have to do anything with what you feel. Just let it be witnessed.",
  "Writing to someone or something you've lost is one of the most healing things humans do. You did something real today.",
  "There's no rush in grief. No timeline. You get to move through this at exactly your own pace — and it's okay if that pace surprises you.",
  "What you wrote today deserves to exist. Your loss is real. Your feelings about it are real. I'm glad you gave them a place to land.",
];

interface Props { onBack: () => void; }

export default function GriefSpace({ onBack }: Props) {
  const { intern, addXp } = useGame();
  const [entries, setEntries] = useState<GriefEntry[]>(load);
  const [view, setView] = useState<'list' | 'step1' | 'step2' | 'step3' | 'done'>('list');
  const [draft, setDraft] = useState<Partial<GriefEntry>>({});
  const [lanceIdx] = useState(() => Math.floor(Math.random() * LANCE_LINES.length));
  const [internIdx] = useState(() => Math.floor(Math.random() * INTERN_LINES.length));

  const handleSave = () => {
    const entry: GriefEntry = {
      id: `grief_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      loss: draft.loss ?? '',
      stage: draft.stage ?? '',
      stageNote: draft.stageNote ?? '',
      letter: draft.letter ?? '',
      whatRemains: draft.whatRemains ?? '',
    };
    const updated = [entry, ...entries];
    save(updated);
    setEntries(updated);
    addXp(35);
    setView('done');
  };

  const selectedStage = STAGES.find(s => s.id === draft.stage);

  if (view === 'step1') {
    return (
      <div className="relative flex flex-col h-full overflow-hidden" style={{ background: 'transparent', color: '#3C3C3C' }}>
      <div aria-hidden className="absolute inset-0" style={{
        backgroundImage: 'url(/region-heroes/depth.webp)',
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
          <button onClick={() => setView('list')} className="p-2 rounded-xl active:scale-90" style={{ color: '#9CA3AF' }}>
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-lg">🕊️</span>
          <div className="flex-1">
            <h2 className="text-sm font-black" style={{ color: '#3C3C3C' }}>What are you grieving?</h2>
            <p className="text-[10px]" style={{ color: '#9CA3AF' }}>Step 1 of 3</p>
          </div>
        </div>
        <div className="relative flex-1 overflow-y-auto px-4 py-4 space-y-4">
          <div className="rounded-3xl p-4 border" style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: '#F0F0F0' }}>
            <p className="text-xs leading-relaxed" style={{ color: '#9CA3AF' }}>
              Grief is not only for death. It applies to the end of a relationship, a version of yourself, a dream, a role, a way of life, a future you expected to have. Name what you are carrying.
            </p>
          </div>
          <textarea
            value={draft.loss ?? ''}
            onChange={e => setDraft(d => ({ ...d, loss: e.target.value }))}
            rows={4}
            placeholder="I am grieving..."
            className="w-full px-4 py-3 rounded-2xl text-sm outline-none resize-none"
            style={{ background: '#FFFFFF', color: '#3C3C3C', border: '1px solid #94a3b833', caretColor: '#94a3b8' }}
          />

          <div className="space-y-2">
            <p className="text-[9px] font-black uppercase tracking-widest" style={{ color: '#9CA3AF' }}>Where are you right now?</p>
            {STAGES.map(stage => (
              <button key={stage.id} onClick={() => setDraft(d => ({ ...d, stage: stage.id }))}
                className="w-full p-3 rounded-2xl border text-left transition-all"
                style={{ background: draft.stage === stage.id ? stage.color + '15' : '#FFFFFF', borderColor: draft.stage === stage.id ? stage.color : stage.color + '22' }}>
                <div className="flex items-start gap-3">
                  <span className="text-lg">{stage.emoji}</span>
                  <div>
                    <div className="text-xs font-black" style={{ color: draft.stage === stage.id ? stage.color : '#3C3C3C' }}>{stage.label}</div>
                    <div className="text-[10px] mt-0.5" style={{ color: '#9CA3AF' }}>{stage.desc}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {draft.stage && (
            <textarea
              value={draft.stageNote ?? ''}
              onChange={e => setDraft(d => ({ ...d, stageNote: e.target.value }))}
              rows={2}
              placeholder={`What does ${selectedStage?.label.toLowerCase()} look like for you right now?`}
              className="w-full px-4 py-3 rounded-2xl text-sm outline-none resize-none"
              style={{ background: '#FFFFFF', color: '#3C3C3C', border: `1px solid ${selectedStage?.color ?? '#94a3b8'}33`, caretColor: selectedStage?.color }}
            />
          )}

          <button onClick={() => setView('step2')}
            disabled={!draft.loss?.trim() || !draft.stage}
            className="w-full py-4 rounded-2xl font-black text-sm disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg, #475569, #94a3b8)', color: '#F9FAFB' }}>
            Continue →
          </button>
        </div>
      </div>
    );
  }

  if (view === 'step2') {
    return (
      <div className="relative flex flex-col h-full overflow-hidden" style={{ background: 'transparent', color: '#3C3C3C' }}>
        <DepthBackdrop />
        <div className="sticky top-0 z-10 px-4 pt-4 pb-3 flex items-center gap-3"
          style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.85)' }}>
          <button onClick={() => setView('step1')} className="p-2 rounded-xl active:scale-90" style={{ color: '#9CA3AF' }}>
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-lg">✉️</span>
          <div className="flex-1">
            <h2 className="text-sm font-black" style={{ color: '#3C3C3C' }}>Letter to what was lost</h2>
            <p className="text-[10px]" style={{ color: '#9CA3AF' }}>Step 2 of 3</p>
          </div>
        </div>
        <div className="relative flex-1 overflow-y-auto px-4 py-4 space-y-4">
          <div className="rounded-3xl p-4 border" style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: '#F0F0F0' }}>
            <p className="text-xs leading-relaxed" style={{ color: '#9CA3AF' }}>
              Write directly to what you lost. Not about them — to them. What do you want to say? What never got said? What do you miss most? There is no wrong way to write this letter.
            </p>
          </div>
          <textarea
            value={draft.letter ?? ''}
            onChange={e => setDraft(d => ({ ...d, letter: e.target.value }))}
            rows={12}
            placeholder="Dear..."
            className="w-full px-4 py-3 rounded-2xl text-sm outline-none resize-none"
            style={{ background: '#FFFFFF', color: '#3C3C3C', border: '1px solid #94a3b833', caretColor: '#94a3b8' }}
          />
          <button onClick={() => setView('step3')}
            disabled={!draft.letter || draft.letter.trim().length < 10}
            className="w-full py-4 rounded-2xl font-black text-sm disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg, #475569, #94a3b8)', color: '#F9FAFB' }}>
            Continue →
          </button>
        </div>
      </div>
    );
  }

  if (view === 'step3') {
    return (
      <div className="relative flex flex-col h-full overflow-hidden" style={{ background: 'transparent', color: '#3C3C3C' }}>
        <DepthBackdrop />
        <div className="sticky top-0 z-10 px-4 pt-4 pb-3 flex items-center gap-3"
          style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.85)' }}>
          <button onClick={() => setView('step2')} className="p-2 rounded-xl active:scale-90" style={{ color: '#9CA3AF' }}>
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-lg">🌱</span>
          <div className="flex-1">
            <h2 className="text-sm font-black" style={{ color: '#3C3C3C' }}>What still remains</h2>
            <p className="text-[10px]" style={{ color: '#9CA3AF' }}>Step 3 of 3</p>
          </div>
        </div>
        <div className="relative flex-1 overflow-y-auto px-4 py-4 space-y-4">
          <div className="rounded-3xl p-4 border" style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: '#7FD98C33' }}>
            <p className="text-xs leading-relaxed" style={{ color: '#9CA3AF' }}>
              Grief does not erase what was. What still remains — memories, lessons, love, parts of yourself that were shaped by this? What did the loss not take from you?
            </p>
          </div>
          <textarea
            value={draft.whatRemains ?? ''}
            onChange={e => setDraft(d => ({ ...d, whatRemains: e.target.value }))}
            rows={7}
            placeholder="What the loss did not take..."
            className="w-full px-4 py-3 rounded-2xl text-sm outline-none resize-none"
            style={{ background: '#FFFFFF', color: '#3C3C3C', border: '1px solid #7FD98C33', caretColor: '#7FD98C' }}
          />
          <button onClick={handleSave}
            disabled={!draft.whatRemains || draft.whatRemains.trim().length < 5}
            className="w-full py-4 rounded-2xl font-black text-sm disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg, #475569, #94a3b8)', color: '#F9FAFB' }}>
            Complete (+35 XP)
          </button>
        </div>
      </div>
    );
  }

  if (view === 'done') {
    return (
      <div className="relative flex flex-col h-full overflow-hidden" style={{ background: 'transparent', color: '#3C3C3C' }}>
        <DepthBackdrop />
        <div className="sticky top-0 z-10 px-4 pt-4 pb-3 flex items-center gap-3"
          style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.85)' }}>
          <BigBackButton onBack={onBack} />
          <h2 className="text-sm font-black" style={{ color: '#3C3C3C' }}>Grief Space</h2>
        </div>
        <div className="relative flex-1 overflow-y-auto px-4 py-4 space-y-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
            {/* The ritual: a lantern lights for what was named. Quiet by design. */}
            <div className="rounded-3xl p-6 text-center" style={{
              background: 'linear-gradient(180deg, #1E2749 0%, #2A3356 100%)',
              border: '1px solid rgba(255,255,255,0.5)',
              boxShadow: '0 10px 30px rgba(30,39,73,0.4)',
            }}>
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.6, ease: 'easeOut' }}
                className="flex justify-center mb-3"
              >
                <Lantern size={44} />
              </motion.div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.8 }}
                className="text-sm font-black"
                style={{ color: '#FDE68A' }}
              >
                A lantern is lit for what you named.
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.8, duration: 0.8 }}
                className="text-[11px] mt-1"
                style={{ color: 'rgba(253,230,138,0.7)' }}
              >
                It joins the shore, and it stays lit.
              </motion.p>
              <div className="text-[10px] font-black mt-3" style={{ color: 'rgba(127,217,140,0.85)' }}>Witnessed · +35 XP</div>
            </div>

            <LanternShore count={entries.length} />
            <div className="rounded-3xl p-5 border" style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: '#F0F0F0' }}>
              <div className="flex items-center gap-2 mb-3">
                <LanceAvatar emotion="neutral" size="sm" />
                <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: '#3ECFCF' }}>{NARRATOR.name}</span>
              </div>
              <p className="text-sm italic leading-relaxed" style={{ color: '#9CA3AF' }}>"{LANCE_LINES[lanceIdx]}"</p>
            </div>
            <div className="rounded-3xl p-5 border" style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: '#7FD98C44' }}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{intern.avatar}</span>
                <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: '#7FD98C' }}>{intern.name || 'Intern'}</span>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: '#7FD98C' }}>{INTERN_LINES[internIdx]}</p>
            </div>
            <button onClick={onBack} className="w-full py-4 rounded-2xl font-black text-sm"
              style={{ background: 'linear-gradient(135deg, #475569, #94a3b8)', color: '#F9FAFB' }}>
              ← Back to Home
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  // List view
  return (
    <div className="relative flex flex-col h-full overflow-hidden" style={{ background: 'transparent', color: '#3C3C3C' }}>
      <DepthBackdrop />
      <div className="sticky top-0 z-10 px-4 pt-4 pb-3 flex items-center gap-3"
        style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.85)' }}>
        <BigBackButton onBack={onBack} />
        <span className="text-lg">🕊️</span>
        <div className="flex-1">
          <h2 className="text-sm font-black" style={{ color: '#3C3C3C' }}>Grief Space</h2>
          <p className="text-[10px]" style={{ color: '#9CA3AF' }}>Hold what was lost · continuing bonds</p>
        </div>
        <div className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: '#94a3b822', color: '#94a3b8' }}>+35 XP</div>
      </div>
      <div className="relative flex-1 overflow-y-auto px-4 py-4 space-y-4">
        <LanternShore count={entries.length} />
        {entries.length > 0 && (
          <div className="space-y-2">
            {entries.slice(0, 5).map(e => {
              const stage = STAGES.find(s => s.id === e.stage);
              return (
                <div key={e.id} className="rounded-2xl p-4 border" style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: (stage?.color ?? '#94a3b8') + '22' }}>
                  <div className="flex items-center gap-2 mb-1">
                    <span>{stage?.emoji}</span>
                    <span className="text-[10px]" style={{ color: '#9CA3AF' }}>{new Date(e.date + 'T12:00:00').toLocaleDateString('en', { month: 'short', day: 'numeric' })}</span>
                    <span className="text-[10px] font-black" style={{ color: stage?.color }}>{stage?.label}</span>
                  </div>
                  <p className="text-xs font-black" style={{ color: '#3C3C3C' }}>{e.loss}</p>
                </div>
              );
            })}
          </div>
        )}

        {entries.length === 0 && (
          <div className="rounded-3xl p-5 border" style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: '#F0F0F0' }}>
            <LanceAvatar emotion="neutral" size="sm" />
            <p className="text-xs italic leading-relaxed mt-3" style={{ color: '#9CA3AF' }}>
              "Grief is not a problem to solve. It is a natural response to loss — and loss includes endings that were not deaths, transitions that were not chosen, and futures that will no longer happen. This space is for all of it."
            </p>
            <p className="text-[9px] mt-2 font-black uppercase tracking-widest" style={{ color: '#3ECFCF' }}>— {NARRATOR.name}</p>
          </div>
        )}

        <button onClick={() => { setView('step1'); setDraft({}); }}
          className="w-full py-4 rounded-2xl font-black text-sm"
          style={{ background: 'linear-gradient(135deg, #475569, #94a3b8)', color: '#F9FAFB' }}>
          🕊️ Open Grief Space
        </button>
      </div>
    </div>
  );
}
