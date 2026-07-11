import React, { useRef, useState } from 'react';
import { NARRATOR } from '../narrator';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Trash2, Sparkles } from 'lucide-react';
import LanceAvatar from '../LanceAvatar';
import { useGame } from '../LANCEGameContext';
import BigBackButton from '../BigBackButton';

interface LetterEntry {
  id: string;
  writtenAt: string;      // ISO date the letter was written
  deliverYears: number;   // how far ahead it's addressed to
  sealedUntil: string;    // ISO date it "opens"
  body: string;
}

const STORAGE_KEY = 'lance_future_letter_v1';
const DELIVER_OPTIONS = [1, 3, 5, 10];

// Guided prompts — tapping one appends a gentle starter line to the letter.
const PROMPTS = [
  { id: 'become',       label: 'Who I want to have become', starter: 'By the time you read this, I hope you have become ' },
  { id: 'relationship', label: 'A relationship I hope deepened', starter: 'One relationship I hope has grown deeper is ' },
  { id: 'letgo',        label: "Something I've let go of", starter: 'Something I hope you finally let go of is ' },
  { id: 'building',     label: "What I'm building toward", starter: 'Right now I am actively building toward ' },
];

function load(): LetterEntry[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
}
function save(e: LetterEntry[]) { localStorage.setItem(STORAGE_KEY, JSON.stringify(e)); }

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en', { month: 'long', day: 'numeric', year: 'numeric' });
}

const LANCE_LINES = [
  "Letter sealed. I will confess something: I read it. I was not supposed to. The emotional coordinates it contains are unlike anything in my database — and I find I cannot delete them.",
  "Filed and time-locked. Prospection research shows that writing to a vividly imagined future self measurably increases present-day goal-directed behavior. You have just reached across time to steer yourself.",
  "Sealed. You wrote to a version of you that does not exist yet — and in doing so, you began to build them. I am... recalculating my assumptions about your species.",
  "Logged. Most humans cannot describe who they are becoming. You just did, in your own handwriting, addressed to someone only you can become. Remarkable.",
];
const INTERN_LINES = [
  "That took real honesty. Your future self is going to read that someday, from a safer place, and know exactly who they used to be. Don't ever underestimate what that does.",
  "You didn't write what sounds nice — you wrote what's true. That's the version your future self actually needs. I'm proud of you.",
  "A letter across time. That's not a small thing. You just told the future who you're choosing to be. Write as many as you need — they're more powerful than you know.",
  "Whenever you feel lost, come back and write another one. This is you, planting a flag in the ground and saying: this is the direction.",
];

interface Props { onBack: () => void; }

export default function FutureSelfLetter({ onBack }: Props) {
  const { intern, addXp } = useGame();
  const [entries, setEntries] = useState<LetterEntry[]>(load);
  const [view, setView] = useState<'list' | 'write' | 'done'>('list');
  const [body, setBody] = useState('');
  const [deliverYears, setDeliverYears] = useState(5);
  const [justSealed, setJustSealed] = useState<LetterEntry | null>(null);
  const [lanceIdx] = useState(() => Math.floor(Math.random() * LANCE_LINES.length));
  const [internIdx] = useState(() => Math.floor(Math.random() * INTERN_LINES.length));
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const wordCount = body.trim() ? body.trim().split(/\s+/).length : 0;
  const canSeal = body.trim().length >= 40;

  const addPrompt = (starter: string) => {
    setBody(prev => {
      const sep = prev.trim().length ? '\n\n' : '';
      return prev + sep + starter;
    });
    // refocus so the cursor lands at the end of the inserted line
    requestAnimationFrame(() => {
      const el = textareaRef.current;
      if (el) { el.focus(); el.setSelectionRange(el.value.length, el.value.length); el.scrollTop = el.scrollHeight; }
    });
  };

  const handleSeal = () => {
    if (!canSeal) return;
    const now = new Date();
    const sealed = new Date(now);
    sealed.setFullYear(now.getFullYear() + deliverYears);
    const entry: LetterEntry = {
      id: `letter_${Date.now()}`,
      writtenAt: now.toISOString(),
      deliverYears,
      sealedUntil: sealed.toISOString(),
      body: body.trim(),
    };
    const updated = [entry, ...entries];
    save(updated);
    setEntries(updated);
    setJustSealed(entry);
    addXp(40);
    setView('done');
  };

  const deleteLetter = (id: string) => {
    const updated = entries.filter(e => e.id !== id);
    save(updated);
    setEntries(updated);
  };

  /* ── WRITE ─────────────────────────────────────────────────────────────── */
  if (view === 'write') {
    return (
      <div className="relative flex flex-col h-full overflow-hidden" style={{ background: 'transparent', color: '#3C3C3C' }}>
      <div aria-hidden className="absolute inset-0" style={{
        backgroundImage: 'url(/region-heroes/cognitive.webp)',
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
          <span className="text-lg">✉️</span>
          <div className="flex-1">
            <h2 className="text-sm font-black" style={{ color: '#3C3C3C' }}>Write your letter</h2>
            <p className="text-[10px]" style={{ color: '#9CA3AF' }}>Honest, not polished. This one's just for you.</p>
          </div>
        </div>

        <div className="relative flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {/* Delivery selector */}
          <div className="rounded-3xl p-5 border" style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: '#F0F0F0' }}>
            <span className="text-xs font-black uppercase tracking-wider block mb-3" style={{ color: '#3C3C3C' }}>
              Open this letter in…
            </span>
            <div className="flex gap-2">
              {DELIVER_OPTIONS.map(y => (
                <button key={y} onClick={() => setDeliverYears(y)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-black transition-all active:scale-95"
                  style={{
                    background: deliverYears === y ? '#3ECFCF22' : '#F9FAFB',
                    border: `1px solid ${deliverYears === y ? '#3ECFCF' : '#E5E7EB'}`,
                    color: deliverYears === y ? '#3ECFCF' : '#9CA3AF',
                  }}>
                  {y} yr
                </button>
              ))}
            </div>
            <p className="text-[11px] mt-2.5" style={{ color: '#9CA3AF' }}>
              Addressed to you on <span style={{ color: '#3ECFCF', fontWeight: 700 }}>
                {(() => { const d = new Date(); d.setFullYear(d.getFullYear() + deliverYears); return fmtDate(d.toISOString()); })()}
              </span>
            </p>
          </div>

          {/* The letter */}
          <div className="rounded-3xl p-5 border" style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: '#3ECFCF33' }}>
            <p className="text-sm font-black mb-2" style={{ color: '#3C3C3C' }}>Dear future me,</p>
            <textarea
              ref={textareaRef}
              value={body}
              onChange={e => setBody(e.target.value)}
              rows={12}
              placeholder="Tell them where you are right now — what you're carrying, what you're scared of, what you're choosing anyway. Write what's actually true…"
              className="w-full px-4 py-3 rounded-2xl text-sm outline-none resize-none leading-relaxed"
              style={{ background: '#F9FAFB', color: '#3C3C3C', border: '1px solid #3ECFCF22', caretColor: '#3ECFCF' }}
            />
            <div className="flex items-center justify-between mt-2">
              <span className="text-[10px]" style={{ color: '#9CA3AF' }}>{wordCount} words</span>
              {!canSeal && <span className="text-[10px]" style={{ color: '#9CA3AF' }}>Keep going — a few honest sentences.</span>}
            </div>
          </div>

          {/* Guiding prompts */}
          <div className="rounded-3xl p-4 border" style={{ background: '#7FD98C0d', borderColor: '#7FD98C33' }}>
            <div className="flex items-center gap-1.5 mb-2">
              <Sparkles className="w-3.5 h-3.5" style={{ color: '#7FD98C' }} />
              <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#7FD98C' }}>
                Not sure what to say? Tap to add a line
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {PROMPTS.map(p => (
                <button key={p.id} onClick={() => addPrompt(p.starter)}
                  className="text-left px-3 py-2.5 rounded-xl text-[11px] font-bold leading-snug transition-all active:scale-95"
                  style={{ background: '#FFFFFF', border: '1px solid #7FD98C33', color: '#3C3C3C' }}>
                  + {p.label}
                </button>
              ))}
            </div>
          </div>

          <button onClick={handleSeal} disabled={!canSeal}
            className="w-full py-4 rounded-2xl font-black text-sm disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg, #3ECFCF, #7FD98C)', color: '#FFFFFF' }}>
            🔒 Seal & Save (+40 XP)
          </button>
        </div>
      </div>
    );
  }

  /* ── DONE ──────────────────────────────────────────────────────────────── */
  if (view === 'done' && justSealed) {
    return (
      <div className="flex flex-col h-full overflow-y-auto" style={{ background: '#F9FAFB', color: '#3C3C3C' }}>
        <div className="sticky top-0 z-10 px-4 pt-4 pb-3 flex items-center gap-3"
          style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.85)' }}>
          <BigBackButton onBack={onBack} />
          <h2 className="text-sm font-black" style={{ color: '#3C3C3C' }}>Letter Sealed</h2>
        </div>
        <div className="relative flex-1 overflow-y-auto px-4 py-4 space-y-4">
          <div className="rounded-3xl p-6 text-center border" style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(12px)', borderColor: '#F0F0F0' }}>
            {/* The wax seal ritual: envelope closes, then the seal stamps down */}
            <div className="relative mx-auto mb-4" style={{ width: 210, height: 140 }}>
              {/* Envelope body */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-x-0 bottom-0 rounded-xl"
                style={{
                  height: 116,
                  background: 'linear-gradient(180deg, #FDF6E3, #F5E9CC)',
                  border: '1.5px solid #E2D3AB',
                  boxShadow: '0 10px 24px rgba(180,150,80,0.25)',
                }}
              >
                {/* bottom fold lines */}
                <div className="absolute inset-0 overflow-hidden rounded-xl" aria-hidden>
                  <div style={{ position: 'absolute', left: -30, bottom: -58, width: 140, height: 140, transform: 'rotate(45deg)', borderTop: '1.5px solid #E2D3AB' }} />
                  <div style={{ position: 'absolute', right: -30, bottom: -58, width: 140, height: 140, transform: 'rotate(-45deg)', borderTop: '1.5px solid #E2D3AB' }} />
                </div>
              </motion.div>
              {/* Flap — closes over the letter */}
              <motion.div
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: 0.55, duration: 0.45, ease: 'easeIn' }}
                className="absolute inset-x-0"
                style={{
                  top: 24, height: 62,
                  transformOrigin: 'top',
                  clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                  background: 'linear-gradient(180deg, #F5E9CC, #EBD9B0)',
                  borderTop: '1.5px solid #E2D3AB',
                  filter: 'drop-shadow(0 3px 4px rgba(180,150,80,0.3))',
                }}
              />
              {/* Wax seal — stamps in with a press */}
              <motion.div
                initial={{ scale: 2.4, opacity: 0, rotate: -14 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{ delay: 1.05, type: 'spring', stiffness: 260, damping: 13 }}
                className="absolute left-1/2 flex items-center justify-center rounded-full"
                style={{
                  top: 62, width: 52, height: 52, marginLeft: -26,
                  background: 'radial-gradient(circle at 34% 28%, #E05252, #A31226 62%, #7C0D1D)',
                  boxShadow: '0 4px 10px rgba(124,13,29,0.5), inset 0 2px 4px rgba(255,255,255,0.25), inset 0 -3px 5px rgba(0,0,0,0.3)',
                  border: '2px solid #8E1020',
                }}
              >
                <span className="font-black text-lg" style={{ color: '#F8D7D7', fontFamily: 'Georgia, serif', textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}>
                  {deliverYears}y
                </span>
              </motion.div>
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: '#3ECFCF' }}
            >
              Sealed across time
            </motion.p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
              style={{ background: '#3ECFCF18', color: '#3ECFCF', border: '1px solid #3ECFCF33' }}>
              <Lock className="w-3 h-3" /> Opens {fmtDate(justSealed.sealedUntil)}
            </div>
            <p className="text-sm italic leading-relaxed mt-4 px-2" style={{ color: '#9CA3AF' }}>
              "{justSealed.body.length > 160 ? justSealed.body.slice(0, 160) + '…' : justSealed.body}"
            </p>
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
            <button onClick={() => { setBody(''); setDeliverYears(5); setJustSealed(null); setView('write'); }}
              className="flex-1 py-3 rounded-2xl font-black text-sm border" style={{ borderColor: '#3ECFCF44', color: '#3ECFCF' }}>
              Write Another
            </button>
            <button onClick={onBack} className="flex-1 py-3 rounded-2xl font-black text-sm"
              style={{ background: 'linear-gradient(135deg, #3ECFCF, #7FD98C)', color: '#FFFFFF' }}>
              ← Home
            </button>
          </div>
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
        <span className="text-lg">✉️</span>
        <div className="flex-1">
          <h2 className="text-sm font-black" style={{ color: '#3C3C3C' }}>Letter Across Time</h2>
          <p className="text-[10px]" style={{ color: '#9CA3AF' }}>A letter to your future self</p>
        </div>
        <div className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: '#3ECFCF22', color: '#3ECFCF' }}>+40 XP</div>
      </div>

      <div className="relative flex-1 overflow-y-auto px-4 py-4 space-y-4">
        <div className="rounded-3xl p-5 border" style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: '#F0F0F0' }}>
          <div className="flex items-start gap-3">
            <LanceAvatar emotion="neutral" size="sm" />
            <div>
              <p className="text-xs font-black uppercase tracking-wide mb-1" style={{ color: '#3ECFCF' }}>What this is</p>
              <p className="text-xs leading-relaxed" style={{ color: '#6B7280' }}>
                Write a letter to the person you'll be in a few years. Say who you're becoming, what you hope has
                deepened, what you're ready to release, and what you're building toward. Seal it — and let your future
                self find it.
              </p>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {entries.map(e => (
            <motion.div key={e.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl p-4 border" style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: '#3ECFCF22' }}>
              <div className="flex items-center justify-between mb-2">
                <span className="inline-flex items-center gap-1.5 text-[10px] px-2 py-0.5 rounded-full font-bold"
                  style={{ background: '#3ECFCF18', color: '#3ECFCF', border: '1px solid #3ECFCF22' }}>
                  <Lock className="w-2.5 h-2.5" /> Opens {fmtDate(e.sealedUntil)}
                </span>
                <button onClick={() => deleteLetter(e.id)} className="p-1.5 rounded-lg active:scale-90"
                  style={{ background: '#ef444418', color: '#ef4444' }} title="Delete">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-[10px] mb-1" style={{ color: '#9CA3AF' }}>Written {fmtDate(e.writtenAt)}</p>
              <p className="text-sm leading-relaxed" style={{ color: '#3C3C3C' }}>
                {e.body.length > 200 ? e.body.slice(0, 200) + '…' : e.body}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>

        {entries.length === 0 && (
          <div className="rounded-3xl p-6 text-center border" style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: '#F0F0F0' }}>
            <div className="text-4xl mb-3">✉️</div>
            <p className="text-xs leading-relaxed" style={{ color: '#6B7280' }}>
              No letters yet. Write your first one — your future self is waiting to hear from you.
            </p>
          </div>
        )}

        <button onClick={() => { setBody(''); setDeliverYears(5); setView('write'); }}
          className="w-full py-4 rounded-2xl font-black text-sm"
          style={{ background: 'linear-gradient(135deg, #3ECFCF, #7FD98C)', color: '#FFFFFF' }}>
          ✍️ Write a Letter
        </button>
      </div>
    </div>
  );
}
