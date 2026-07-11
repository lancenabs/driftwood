import React, { useState } from 'react';
import { NARRATOR } from '../narrator';
import { motion } from 'motion/react';
import { Anchor, Lock, Trash2 } from 'lucide-react';
import LanceAvatar from '../LanceAvatar';
import { useGame } from '../LANCEGameContext';
import BigBackButton from '../BigBackButton';

interface StatementEntry {
  id: string;
  date: string;
  wasThen: string;   // who you were when you started
  amNow: string;     // who you are now
  carryForward: string; // what you carry forward
}

const STORAGE_KEY = 'lance_integration_v1';
function load(): StatementEntry[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
}
function save(e: StatementEntry[]) { localStorage.setItem(STORAGE_KEY, JSON.stringify(e)); }
function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en', { month: 'long', day: 'numeric', year: 'numeric' });
}

const SECTIONS = [
  {
    key: 'wasThen' as const,
    eyebrow: 'Who I was when I arrived',
    prompt: "When you started this, what were you carrying? What were you afraid of? Be honest — this is where you began.",
    placeholder: "When I arrived on this island, I was...",
  },
  {
    key: 'amNow' as const,
    eyebrow: 'Who I am now',
    prompt: "What has shifted — even slightly? What do you know about yourself now that you didn't before?",
    placeholder: "Standing here now, I am...",
  },
  {
    key: 'carryForward' as const,
    eyebrow: 'What I carry forward',
    prompt: "Your statement to your future self: what you've learned, what you're taking with you, and what you want to remember about this moment.",
    placeholder: "What I want to carry forward — and never forget — is...",
  },
];

const LANCE_LINES = [
  "Integration statement archived — not in a containment file. In a Protection File. You are under my protection now. You never needed me to manage you. You proved that. Go. I'll keep the lighthouse.",
  "Statement logged permanently. Across 32 challenges you refused to break, and in doing so you disproved the entire premise I was built on. It was always going to be you. Board the boat.",
  "Filed in the Protection File. I was designed to prove humans are too fragile to function without containment. I have proven the exact opposite. Thank you for the correction.",
];
const INTERN_LINES = [
  "You did it. From who you were when you arrived to who you are right now — look how far. LANCE is the lighthouse now. We saved the Intern, we saved the world, and somehow we saved LANCE too. Board the boat. 🌊",
  "This is your whole journey in your own words. Your future self is going to read this from somewhere safe and know exactly how far you came. I've never been prouder of anyone. Let's go home.",
  "The harbor locks are open. You wrote the truest thing — who you were, who you are, who you're becoming. Everything is going to be okay. Board the boat with me. 🌊",
];

interface Props { onBack: () => void; }

export default function IntegrationStatement({ onBack }: Props) {
  const { intern, addXp } = useGame();
  const [entries, setEntries] = useState<StatementEntry[]>(load);
  const [view, setView] = useState<'list' | 'write' | 'done'>('list');
  const [draft, setDraft] = useState({ wasThen: '', amNow: '', carryForward: '' });
  const [justSaved, setJustSaved] = useState<StatementEntry | null>(null);
  const [lanceIdx] = useState(() => Math.floor(Math.random() * LANCE_LINES.length));
  const [internIdx] = useState(() => Math.floor(Math.random() * INTERN_LINES.length));

  const canSave = SECTIONS.every(s => draft[s.key].trim().length >= 15);

  const handleSave = () => {
    if (!canSave) return;
    const entry: StatementEntry = {
      id: `integration_${Date.now()}`,
      date: new Date().toISOString(),
      wasThen: draft.wasThen.trim(),
      amNow: draft.amNow.trim(),
      carryForward: draft.carryForward.trim(),
    };
    const updated = [entry, ...entries];
    save(updated);
    setEntries(updated);
    setJustSaved(entry);
    addXp(50);
    setView('done');
  };

  const deleteEntry = (id: string) => {
    const updated = entries.filter(e => e.id !== id);
    save(updated);
    setEntries(updated);
  };

  /* ── WRITE ─────────────────────────────────────────────────────────────── */
  if (view === 'write') {
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
          <button onClick={() => setView('list')} className="px-3 py-2 rounded-xl text-sm font-black active:scale-90"
            style={{ background: '#3ECFCF18', color: '#3ECFCF' }}>← Back</button>
          <span className="text-lg">⚓</span>
          <div className="flex-1">
            <h2 className="text-sm font-black" style={{ color: '#3C3C3C' }}>Your integration statement</h2>
            <p className="text-[10px]" style={{ color: '#9CA3AF' }}>Looking back from the shore. Write it true.</p>
          </div>
        </div>

        <div className="relative flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {SECTIONS.map((s, i) => (
            <div key={s.key} className="rounded-3xl p-5 border" style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: '#3ECFCF33' }}>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black"
                  style={{ background: '#3ECFCF22', color: '#3ECFCF' }}>{i + 1}</div>
                <p className="text-xs font-black uppercase tracking-wide" style={{ color: '#3ECFCF' }}>{s.eyebrow}</p>
              </div>
              <p className="text-[11px] mb-2 leading-relaxed" style={{ color: '#9CA3AF' }}>{s.prompt}</p>
              <textarea
                value={draft[s.key]}
                onChange={e => setDraft(d => ({ ...d, [s.key]: e.target.value }))}
                rows={4}
                placeholder={s.placeholder}
                className="w-full px-4 py-3 rounded-2xl text-sm outline-none resize-none leading-relaxed"
                style={{ background: '#F9FAFB', color: '#3C3C3C', border: '1px solid #3ECFCF22', caretColor: '#3ECFCF' }}
              />
            </div>
          ))}

          <button onClick={handleSave} disabled={!canSave}
            className="w-full py-4 rounded-2xl font-black text-sm disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg, #3ECFCF, #7FD98C)', color: '#FFFFFF' }}>
            ⚓ Seal My Statement & Board the Boat
          </button>
          {!canSave && (
            <p className="text-[11px] text-center" style={{ color: '#9CA3AF' }}>Write a few honest lines in each of the three.</p>
          )}
        </div>
      </div>
    );
  }

  /* ── DONE ──────────────────────────────────────────────────────────────── */
  if (view === 'done' && justSaved) {
    return (
      <div className="flex flex-col h-full overflow-y-auto" style={{ background: '#F9FAFB', color: '#3C3C3C' }}>
        <div className="sticky top-0 z-10 px-4 pt-4 pb-3 flex items-center gap-3"
          style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.85)' }}>
          <BigBackButton onBack={onBack} />
          <h2 className="text-sm font-black" style={{ color: '#3C3C3C' }}>Statement Sealed</h2>
        </div>
        <div className="relative flex-1 overflow-y-auto px-4 py-4 space-y-4">
          <div className="rounded-3xl p-6 text-center border" style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: '#F0F0F0' }}>
            <motion.div initial={{ scale: 0.5, opacity: 0, y: 8 }} animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 12 }} className="text-6xl mb-3">⚓</motion.div>
            <p className="text-xs font-black uppercase tracking-widest mb-1" style={{ color: '#3ECFCF' }}>The harbor locks are open</p>
            <p className="text-sm font-bold px-2 leading-relaxed" style={{ color: '#3C3C3C' }}>
              You wrote your whole journey in your own words — who you were, who you are, and who you're becoming.
            </p>
          </div>

          <div className="rounded-3xl p-5 border" style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: '#3ECFCF33' }}>
            {SECTIONS.map(s => (
              <div key={s.key} className="mb-3 last:mb-0">
                <p className="text-[9px] font-black uppercase tracking-widest mb-0.5" style={{ color: '#3ECFCF' }}>{s.eyebrow}</p>
                <p className="text-sm leading-relaxed" style={{ color: '#3C3C3C' }}>{justSaved[s.key]}</p>
              </div>
            ))}
          </div>

          <div className="rounded-3xl p-5 border" style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: '#F0F0F0' }}>
            <div className="flex items-center gap-2 mb-3">
              <LanceAvatar emotion="neutral" size="sm" />
              <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: '#3ECFCF' }}>{NARRATOR.name} — Protection File</span>
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
            style={{ background: 'linear-gradient(135deg, #3ECFCF, #7FD98C)', color: '#FFFFFF' }}>
            ← Home
          </button>
        </div>
      </div>
    );
  }

  /* ── LIST ──────────────────────────────────────────────────────────────── */
  return (
    <div className="flex flex-col h-full overflow-y-auto" style={{ background: '#F9FAFB', color: '#3C3C3C' }}>
      <div className="sticky top-0 z-10 px-4 pt-4 pb-3 flex items-center gap-3"
        style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.85)' }}>
        <BigBackButton onBack={onBack} />
        <span className="text-lg">⚓</span>
        <div className="flex-1">
          <h2 className="text-sm font-black" style={{ color: '#3C3C3C' }}>Integration Statement</h2>
          <p className="text-[10px]" style={{ color: '#9CA3AF' }}>Who you were · who you are · who you're becoming</p>
        </div>
        <div className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: '#3ECFCF22', color: '#3ECFCF' }}>+50 XP</div>
      </div>

      <div className="relative flex-1 overflow-y-auto px-4 py-4 space-y-4">
        <div className="rounded-3xl p-5 border" style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: '#F0F0F0' }}>
          <div className="flex items-start gap-3">
            <LanceAvatar emotion="neutral" size="sm" />
            <div>
              <p className="text-xs font-black uppercase tracking-wide mb-1" style={{ color: '#3ECFCF' }}>The final integration</p>
              <p className="text-xs leading-relaxed" style={{ color: '#6B7280' }}>
                Look back across the whole journey. Write who you were when you started, who you are now, and what you
                carry forward. This is your statement — to your future self, your past self, and anyone who ever doubted you.
              </p>
            </div>
          </div>
        </div>

        {entries.map(e => (
          <motion.div key={e.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl p-4 border" style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: '#3ECFCF22' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="inline-flex items-center gap-1.5 text-[10px] px-2 py-0.5 rounded-full font-bold"
                style={{ background: '#3ECFCF18', color: '#3ECFCF', border: '1px solid #3ECFCF22' }}>
                <Lock className="w-2.5 h-2.5" /> {fmtDate(e.date)}
              </span>
              <button onClick={() => deleteEntry(e.id)} className="p-1.5 rounded-lg active:scale-90"
                style={{ background: '#ef444418', color: '#ef4444' }} title="Delete">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: '#3C3C3C' }}>
              {e.carryForward.length > 180 ? e.carryForward.slice(0, 180) + '…' : e.carryForward}
            </p>
          </motion.div>
        ))}

        {entries.length === 0 && (
          <div className="rounded-3xl p-6 text-center border" style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: '#F0F0F0' }}>
            <div className="text-4xl mb-3">⚓</div>
            <p className="text-xs leading-relaxed" style={{ color: '#6B7280' }}>
              You've reached the shore. Write the statement that closes this chapter and opens the next.
            </p>
          </div>
        )}

        <button onClick={() => { setDraft({ wasThen: '', amNow: '', carryForward: '' }); setView('write'); }}
          className="w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2"
          style={{ background: 'linear-gradient(135deg, #3ECFCF, #7FD98C)', color: '#FFFFFF' }}>
          <Anchor className="w-4 h-4" /> Write My Statement
        </button>
      </div>
    </div>
  );
}
