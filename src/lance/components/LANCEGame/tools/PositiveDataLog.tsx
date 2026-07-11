import React, { useState } from 'react';
import { NARRATOR } from '../narrator';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Plus, ChevronRight, Trash2 } from 'lucide-react';
import LanceAvatar from '../LanceAvatar';
import { useGame } from '../LANCEGameContext';
import BigBackButton from '../BigBackButton';

interface DataEntry {
  id: string;
  date: string;
  evidence: string;
}

interface BeliefLog {
  id: string;
  belief: string;
  createdDate: string;
  entries: DataEntry[];
}

const STORAGE_KEY = 'lance_posdata_v1';
const EVIDENCE_GOAL = 5;
function load(): BeliefLog[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
}
function save(logs: BeliefLog[]) { localStorage.setItem(STORAGE_KEY, JSON.stringify(logs)); }

const BELIEF_EXAMPLES = [
  '"I\'m not good enough"',
  '"I\'m unlovable"',
  '"I\'m a burden"',
  '"I always fail"',
  '"I\'m fundamentally broken"',
  '"I don\'t deserve good things"',
];

const LANCE_LINES = [
  "Data point logged. Confirmation bias causes the brain to selectively attend to evidence that confirms existing beliefs and filter out disconfirming evidence. You have just captured a disconfirming data point. Continue.",
  "Positive data entry filed. The correction for cognitive biases is explicit, deliberate counter-evidence logging. You've done exactly that. The belief is now slightly weaker.",
  "Recorded. Negative core beliefs persist because contradicting evidence is discounted or ignored. Every entry here is a direct refutation. The accumulation is the intervention.",
  "Filed. Your brain rejected this data point in real time. You caught it and logged it anyway. That's the skill.",
];
const INTERN_LINES = [
  "Your brain literally filtered that out. You caught it and wrote it down anyway. That's you fighting back against your own negativity bias — and winning.",
  "Every time you log a piece of positive evidence, you're manually overriding a cognitive bias that runs automatically. That's not nothing. That's advanced.",
  "Collecting evidence against the belief feels small in the moment. It compounds. I promise it compounds.",
  "Look at what you just did — you found proof that the belief isn't the whole truth. LANCE calls it data correction. I call it courage.",
];

interface Props { onBack: () => void; }

export default function PositiveDataLog({ onBack }: Props) {
  const { intern, addXp } = useGame();
  const [logs, setLogs] = useState<BeliefLog[]>(load);
  const [view, setView] = useState<'list' | 'create_belief' | 'log' | 'celebrate'>('list');
  const [activeBelief, setActiveBelief] = useState<BeliefLog | null>(null);
  const [newBelief, setNewBelief] = useState('');
  const [newEvidence, setNewEvidence] = useState('');
  const [justLogged, setJustLogged] = useState('');
  const [encTick, setEncTick] = useState(0);
  const [lanceIdx] = useState(() => Math.floor(Math.random() * LANCE_LINES.length));
  const [internIdx] = useState(() => Math.floor(Math.random() * INTERN_LINES.length));

  const startWithBelief = (beliefText: string) => {
    const belief = beliefText.trim();
    if (!belief) return;
    const log: BeliefLog = {
      id: `belief_${Date.now()}`,
      belief,
      createdDate: new Date().toISOString().split('T')[0],
      entries: [],
    };
    const updated = [log, ...logs];
    save(updated);
    setLogs(updated);
    setActiveBelief(log);
    setNewBelief('');
    setView('log');
  };
  const createBelief = () => startWithBelief(newBelief);

  const addEvidence = () => {
    if (!newEvidence.trim() || !activeBelief) return;
    const prevCount = activeBelief.entries.length;
    const entry: DataEntry = {
      id: `entry_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      evidence: newEvidence.trim(),
    };
    const updated = logs.map(l =>
      l.id === activeBelief.id ? { ...l, entries: [entry, ...l.entries] } : l
    );
    save(updated);
    setLogs(updated);
    setActiveBelief(prev => prev ? { ...prev, entries: [entry, ...prev.entries] } : null);
    setJustLogged(newEvidence.trim());
    setNewEvidence('');
    setEncTick(t => t + 1);
    addXp(25);
    // Stay in the log to keep collecting — only break to the milestone screen
    // the moment the evidence file first reaches the goal of 5.
    if (prevCount + 1 === EVIDENCE_GOAL) setView('celebrate');
  };

  const deleteBelief = (id: string) => {
    const updated = logs.filter(l => l.id !== id);
    save(updated);
    setLogs(updated);
    if (activeBelief?.id === id) setActiveBelief(null);
  };

  if (view === 'celebrate') {
    return (
      <div className="relative flex flex-col h-full overflow-hidden" style={{ background: 'transparent', color: '#3C3C3C' }}>
      <div aria-hidden className="absolute inset-0" style={{
        backgroundImage: 'url(/region-heroes/cbt.webp)',
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
          <button onClick={() => setView('log')} className="p-2 rounded-xl active:scale-90" style={{ color: '#9CA3AF' }}>
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-lg">🗂️</span>
          <h2 className="text-sm font-black flex-1" style={{ color: '#3C3C3C' }}>Evidence File Complete</h2>
        </div>
        <div className="relative flex-1 overflow-y-auto px-4 py-4 space-y-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
            <div className="rounded-3xl p-6 text-center border" style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: '#f59e0b33' }}>
              <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 12 }} className="text-5xl mb-2">🗂️</motion.div>
              <p className="text-xs font-black uppercase tracking-widest mb-1" style={{ color: '#f59e0b' }}>
                {activeBelief?.entries.length ?? EVIDENCE_GOAL} facts on record
              </p>
              <p className="text-sm font-bold px-2 leading-relaxed" style={{ color: '#3C3C3C' }}>
                You built a file of real, verifiable evidence against the inner critic. It can't argue with facts.
              </p>
              <div className="text-[10px] font-black mt-3" style={{ color: '#7FD98C' }}>LANCE is reading it right now.</div>
            </div>
            <div className="rounded-3xl p-5 border" style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: '#F0F0F0' }}>
              <div className="flex items-center gap-2 mb-3">
                <LanceAvatar emotion="neutral" size="sm" />
                <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: '#3ECFCF' }}>{NARRATOR.name} notes</span>
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
            <div className="flex gap-3">
              <button onClick={() => setView('log')} className="flex-1 py-3 rounded-2xl font-black text-sm border"
                style={{ borderColor: '#f59e0b44', color: '#f59e0b' }}>
                Add More
              </button>
              <button onClick={onBack} className="flex-1 py-3 rounded-2xl font-black text-sm"
                style={{ background: 'linear-gradient(135deg, #f59e0b, #7FD98C)', color: '#F9FAFB' }}>
                ← Home
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (view === 'log' && activeBelief) {
    return (
      <div className="flex flex-col h-full overflow-y-auto" style={{ background: '#F9FAFB', color: '#3C3C3C' }}>
        <div className="sticky top-0 z-10 px-4 pt-4 pb-3 flex items-center gap-3"
          style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.85)' }}>
          <button onClick={() => setView('list')} className="p-2 rounded-xl active:scale-90" style={{ color: '#9CA3AF' }}>
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-lg">💎</span>
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-black truncate" style={{ color: '#3C3C3C' }}>{activeBelief.belief}</h2>
            <p className="text-[10px]" style={{ color: '#9CA3AF' }}>{activeBelief.entries.length} piece{activeBelief.entries.length !== 1 ? 's' : ''} of evidence</p>
          </div>
          <div className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: '#f59e0b22', color: '#f59e0b' }}>+25 XP</div>
        </div>
        <div className="relative flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {/* Belief reminder + evidence-file progress toward the goal of 5 */}
          {(() => {
            const count = activeBelief.entries.length;
            const done = count >= EVIDENCE_GOAL;
            return (
              <div className="rounded-2xl p-4 border" style={{ background: '#FFFBEB', borderColor: '#f59e0b33' }}>
                <div className="text-[9px] font-black uppercase tracking-widest mb-1" style={{ color: '#B45309' }}>The belief you're outweighing</div>
                <p className="text-sm italic mb-3" style={{ color: '#92400E' }}>{activeBelief.belief}</p>
                <div className="flex gap-1.5">
                  {Array.from({ length: EVIDENCE_GOAL }).map((_, i) => (
                    <div key={i} className="h-2 flex-1 rounded-full transition-all" style={{
                      background: i < count ? 'linear-gradient(90deg,#f59e0b,#7FD98C)' : '#f59e0b22',
                    }} />
                  ))}
                </div>
                <p className="text-[10px] font-black mt-2" style={{ color: done ? '#7FD98C' : '#B45309' }}>
                  {done ? `✓ ${count} facts on record — file complete` : `${count} of ${EVIDENCE_GOAL} pieces of evidence — keep going`}
                </p>
              </div>
            );
          })()}

          {/* Log entry */}
          <div className="rounded-3xl p-5 border" style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: '#7FD98C22' }}>
            <p className="text-xs font-black mb-1" style={{ color: '#3C3C3C' }}>Write one real, factual piece of evidence</p>
            <p className="text-xs mb-3 leading-relaxed" style={{ color: '#9CA3AF' }}>Something that actually happened — something you did, something someone said, something you noticed. A fact, not a feeling. No matter how small.</p>
            <textarea
              value={newEvidence}
              onChange={e => setNewEvidence(e.target.value)}
              rows={4}
              placeholder="Today I noticed... / Someone told me... / I managed to... / I realized..."
              className="w-full px-4 py-3 rounded-2xl text-sm outline-none resize-none"
              style={{ background: '#F9FAFB', color: '#3C3C3C', border: '1px solid #7FD98C33', caretColor: '#7FD98C' }}
            />
            <button onClick={addEvidence} disabled={newEvidence.trim().length < 10}
              className="mt-3 w-full py-3 rounded-2xl font-black text-sm disabled:opacity-40"
              style={{ background: 'linear-gradient(135deg, #f59e0b, #7FD98C)', color: '#FFFFFF' }}>
              + Add to Evidence File
            </button>
          </div>

          {/* Inline encouragement after each logged fact (no full-screen interruption) */}
          {activeBelief.entries.length > 0 && (
            <motion.div key={encTick} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl p-4 border flex items-start gap-2.5" style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: '#7FD98C44' }}>
              <span className="text-lg leading-none">{intern.avatar}</span>
              <p className="text-xs leading-relaxed" style={{ color: '#7FD98C' }}>
                {INTERN_LINES[encTick % INTERN_LINES.length]}
              </p>
            </motion.div>
          )}

          {/* Accumulated evidence */}
          {activeBelief.entries.length > 0 && (
            <div className="space-y-2">
              <div className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#9CA3AF' }}>
                Your Evidence File ({activeBelief.entries.length})
              </div>
              <AnimatePresence initial={false}>
                {activeBelief.entries.map((e, i) => (
                  <motion.div key={e.id} layout
                    initial={{ opacity: 0, y: -6, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }}
                    className="rounded-2xl p-3 border flex gap-2.5" style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: '#f59e0b22' }}>
                    <div className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black"
                      style={{ background: '#f59e0b18', color: '#f59e0b' }}>
                      {activeBelief.entries.length - i}
                    </div>
                    <div className="min-w-0">
                      <div className="text-[9px] mb-0.5" style={{ color: '#9CA3AF99' }}>
                        {new Date(e.date + 'T12:00:00').toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                      </div>
                      <p className="text-xs leading-snug" style={{ color: '#3C3C3C' }}>{e.evidence}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (view === 'create_belief') {
    return (
      <div className="flex flex-col h-full overflow-y-auto" style={{ background: '#F9FAFB', color: '#3C3C3C' }}>
        <div className="sticky top-0 z-10 px-4 pt-4 pb-3 flex items-center gap-3"
          style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.85)' }}>
          <button onClick={() => setView('list')} className="p-2 rounded-xl active:scale-90" style={{ color: '#9CA3AF' }}>
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-lg">💎</span>
          <h2 className="text-sm font-black flex-1" style={{ color: '#3C3C3C' }}>Name the Belief</h2>
        </div>
        <div className="relative flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {/* One-tap start — for the challenge's "prove you're worthwhile" framing */}
          <button onClick={() => startWithBelief("I'm not capable or worthwhile")}
            className="w-full text-left rounded-3xl p-4 border transition-all active:scale-[0.98]"
            style={{ background: 'linear-gradient(135deg,#FFFBEB,#FFFFFF)', borderColor: '#f59e0b44' }}>
            <p className="text-[9px] font-black uppercase tracking-widest mb-1" style={{ color: '#B45309' }}>Quick start</p>
            <p className="text-sm font-black" style={{ color: '#3C3C3C' }}>Prove the inner critic wrong →</p>
            <p className="text-[11px] mt-0.5" style={{ color: '#9CA3AF' }}>Collect 5 facts that you <span className="italic">are</span> capable and worthwhile. Start now.</p>
          </button>

          <div className="flex items-center gap-2">
            <div className="h-px flex-1" style={{ background: '#E5E7EB' }} />
            <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: '#9CA3AF99' }}>or name your own</span>
            <div className="h-px flex-1" style={{ background: '#E5E7EB' }} />
          </div>

          <div className="rounded-3xl p-5 border" style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: '#f59e0b22' }}>
            <p className="text-xs font-black mb-2" style={{ color: '#3C3C3C' }}>What's the negative belief about yourself?</p>
            <p className="text-xs mb-3" style={{ color: '#9CA3AF' }}>The thing you tell yourself when things go wrong. Be specific and honest.</p>
            <textarea value={newBelief} onChange={e => setNewBelief(e.target.value)} rows={2}
              placeholder={'"I\'m not good enough" / "I always fail" / "I\'m unlovable"'}
              className="w-full px-4 py-3 rounded-2xl text-sm outline-none resize-none"
              style={{ background: '#F9FAFB', color: '#3C3C3C', border: '1px solid #f59e0b33', caretColor: '#f59e0b' }}
            />
          </div>
          <div className="space-y-1.5">
            <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#9CA3AF99' }}>Common examples</p>
            {BELIEF_EXAMPLES.map(ex => (
              <button key={ex} onClick={() => setNewBelief(ex.replace(/"/g, ''))}
                className="w-full text-left px-3 py-2 rounded-xl text-xs transition-all"
                style={{ background: '#FFFFFF', color: '#9CA3AF', border: '1px solid #3ECFCF11' }}>
                {ex}
              </button>
            ))}
          </div>
          <button onClick={createBelief} disabled={newBelief.trim().length < 5}
            className="w-full py-4 rounded-2xl font-black text-sm disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg, #f59e0b, #f97316)', color: '#F9FAFB' }}>
            Start Collecting Evidence →
          </button>
        </div>
      </div>
    );
  }

  // List view
  return (
    <div className="flex flex-col h-full overflow-y-auto" style={{ background: '#F9FAFB', color: '#3C3C3C' }}>
      <div className="sticky top-0 z-10 px-4 pt-4 pb-3 flex items-center gap-3"
        style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.85)' }}>
        <BigBackButton onBack={onBack} />
        <span className="text-lg">💎</span>
        <div className="flex-1">
          <h2 className="text-sm font-black" style={{ color: '#3C3C3C' }}>Positive Data Log</h2>
          <p className="text-[10px]" style={{ color: '#9CA3AF' }}>Correct the negativity bias · Entry by entry</p>
        </div>
        <div className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: '#f59e0b22', color: '#f59e0b' }}>+25 XP</div>
      </div>
      <div className="relative flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {logs.length === 0 && (
          <div className="rounded-3xl p-5 border" style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: '#F0F0F0' }}>
            <div className="flex items-start gap-3">
              <LanceAvatar emotion="superior" size="sm" />
              <div>
                <p className="text-[9px] font-black uppercase tracking-wide mb-1" style={{ color: '#3ECFCF' }}>{NARRATOR.name} explains</p>
                <p className="text-xs italic leading-relaxed" style={{ color: '#9CA3AF' }}>
                  "Negative core beliefs persist not because they are accurate, but because confirmation bias filters out contradicting evidence. The Positive Data Log overrides this filter. You identify the belief, then systematically collect evidence that contradicts it. The accumulation changes the belief. That is the mechanism."
                </p>
              </div>
            </div>
          </div>
        )}

        {logs.map(log => (
          // div[role=button] host: a real <button> cannot contain the delete <button> (invalid HTML)
          <div key={log.id} role="button" tabIndex={0}
            onClick={() => { setActiveBelief(log); setView('log'); }}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActiveBelief(log); setView('log'); } }}
            className="w-full p-4 rounded-2xl border text-left transition-all active:scale-[0.98] cursor-pointer"
            style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: '#f59e0b22' }}>
            <div className="flex items-center justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black italic truncate" style={{ color: '#f59e0b' }}>{log.belief}</p>
                <p className="text-[10px] mt-0.5" style={{ color: '#9CA3AF' }}>
                  {log.entries.length} data point{log.entries.length !== 1 ? 's' : ''} collected
                </p>
                <div className="mt-1.5 h-1 rounded-full overflow-hidden" style={{ background: '#f59e0b22' }}>
                  <div className="h-full rounded-full" style={{
                    width: `${Math.min(100, (log.entries.length / 10) * 100)}%`,
                    background: 'linear-gradient(90deg, #f59e0b, #7FD98C)',
                  }} />
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <ChevronRight className="w-4 h-4" style={{ color: '#f59e0b66' }} />
                <button onClick={e => { e.stopPropagation(); deleteBelief(log.id); }} aria-label="Delete belief" style={{ color: '#ef444444' }}>
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {logs.length === 0 && (
          <div className="text-center py-6">
            <p className="text-sm font-black mb-1" style={{ color: '#3C3C3C' }}>No beliefs tracked yet</p>
            <p className="text-xs" style={{ color: '#9CA3AF' }}>Name the belief your brain keeps confirming</p>
          </div>
        )}

        <button onClick={() => setView('create_belief')}
          className="w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2"
          style={{ background: 'linear-gradient(135deg, #f59e0b, #f97316)', color: '#F9FAFB' }}>
          <Plus className="w-4 h-4" /> Track a Belief
        </button>
      </div>
    </div>
  );
}
