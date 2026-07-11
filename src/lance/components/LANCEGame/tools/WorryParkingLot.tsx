import React, { useState } from 'react';
import { NARRATOR } from '../narrator';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Trash2 } from 'lucide-react';
import { useGame } from '../LANCEGameContext';
import BigBackButton from '../BigBackButton';
import { GlassPanel, CoachCard } from '../ui/GlassKit';

// Observatory region (cbt) behind the lot.
function ObservatoryBackdrop() {
  return (
    <>
      <div aria-hidden className="absolute inset-0" style={{
        backgroundImage: 'url(/region-heroes/cbt.webp)',
        backgroundSize: 'cover', backgroundPosition: 'center',
        filter: 'blur(20px)', transform: 'scale(1.1)', opacity: 0.4,
      }} />
      <div aria-hidden className="absolute inset-0" style={{
        background: 'linear-gradient(180deg, rgba(245,247,250,0.9) 0%, rgba(245,247,250,0.94) 100%)',
      }} />
    </>
  );
}

interface WorryEntry {
  id: string;
  text: string;
  canControl: string;
  parkedAt: string;
  scheduledFor: string;
  resolved: boolean;
}

const STORAGE_KEY = 'lance_worries_v1';
const SCHEDULE_OPTIONS = [
  { id: 'tonight', label: 'Tonight at 8pm' },
  { id: 'tomorrow_morning', label: 'Tomorrow morning' },
  { id: 'tomorrow_evening', label: 'Tomorrow evening' },
  { id: 'weekend', label: 'This weekend' },
  { id: 'never', label: "Let it go — it's not worth it" },
];

function load(): WorryEntry[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
}
function save(entries: WorryEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

const LANCE_LINES = [
  "Parking the worry was the correct choice. Rumination reduces problem-solving capacity by 38%. I've updated your efficiency projections accordingly.",
  "Worry parked. Scheduling worry time is a demonstrably effective cognitive regulation strategy. You've successfully postponed an irrational spiral. Well done.",
  "Noted. The worry has been assigned a designated review window. Until then, it is not your problem. That is not avoidance — it is resource management.",
  "Filed. I will observe that most humans find 73% of parked worries to be irrelevant by their scheduled review time. I expect similar results here.",
];
const INTERN_LINES = [
  "That took courage to name and put down. Parking it isn't running from it — it's saying 'not right now' and meaning it.",
  "You didn't suppress the worry or spiral into it. You found the third path. I'm genuinely proud of you for that.",
  "This is exactly what worry time is for. You gave the worry a home so your brain can stop pinging you about it. Brilliant.",
  "Naming it and scheduling it is actually a really advanced skill. Most people don't learn that. You just did it.",
];

interface Props { onBack: () => void; }

export default function WorryParkingLot({ onBack }: Props) {
  const { intern, addXp } = useGame();
  const [entries, setEntries] = useState<WorryEntry[]>(load);
  const [worryText, setWorryText] = useState('');
  const [canControlText, setCanControlText] = useState('');
  const [selectedSchedule, setSelectedSchedule] = useState('');
  const [view, setView] = useState<'form' | 'parked' | 'success'>('form');
  const [justParked, setJustParked] = useState<WorryEntry | null>(null);
  const [lanceIdx] = useState(() => Math.floor(Math.random() * LANCE_LINES.length));
  const [internIdx] = useState(() => Math.floor(Math.random() * INTERN_LINES.length));
  const [showParking, setShowParking] = useState(false);

  const activeWorries = entries.filter(e => !e.resolved);
  const resolvedWorries = entries.filter(e => e.resolved);

  const handlePark = () => {
    if (!worryText.trim() || !selectedSchedule) return;
    setShowParking(true);
    setTimeout(() => {
      const now = new Date().toISOString();
      const entry: WorryEntry = {
        id: `worry_${Date.now()}`,
        text: worryText.trim(),
        canControl: canControlText.trim(),
        parkedAt: now,
        scheduledFor: SCHEDULE_OPTIONS.find(o => o.id === selectedSchedule)?.label ?? selectedSchedule,
        resolved: false,
      };
      const updated = [entry, ...entries];
      save(updated);
      setEntries(updated);
      setJustParked(entry);
      addXp(25);
      setShowParking(false);
      setView('success');
    }, 900);
  };

  const resolveWorry = (id: string) => {
    const updated = entries.map(e => e.id === id ? { ...e, resolved: true } : e);
    save(updated);
    setEntries(updated);
  };

  const deleteWorry = (id: string) => {
    const updated = entries.filter(e => e.id !== id);
    save(updated);
    setEntries(updated);
  };

  return (
    <div className="relative flex flex-col h-full overflow-hidden" style={{ color: '#3C3C3C' }}>
      <ObservatoryBackdrop />
      {/* Header */}
      <div
        className="relative sticky top-0 z-10 px-4 pt-4 pb-3 flex items-center gap-3"
        style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.85)' }}
      >
        <BigBackButton onBack={onBack} />
        <img src="/icons/worry_parking.webp" alt="" draggable={false}
          style={{ width: 34, height: 34, borderRadius: 10, boxShadow: '0 4px 10px rgba(14,165,233,0.3)' }} />
        <div className="flex-1">
          <h2 className="text-sm font-black" style={{ color: '#3C3C3C' }}>Worry Parking Lot</h2>
          <p className="text-[10px]" style={{ color: '#9CA3AF' }}>Not now. Scheduled.</p>
        </div>
        <div className="flex gap-1.5">
          <button
            onClick={() => setView('form')}
            className="text-[9px] px-2 py-1 rounded-full font-black"
            style={{
              background: view === 'form' ? '#3ECFCF22' : 'transparent',
              color: view === 'form' ? '#3ECFCF' : '#9CA3AF',
              border: `1px solid ${view === 'form' ? '#3ECFCF44' : 'transparent'}`,
            }}
          >
            + Park
          </button>
          <button
            onClick={() => setView('parked')}
            className="text-[9px] px-2 py-1 rounded-full font-black"
            style={{
              background: view === 'parked' ? '#3ECFCF22' : 'transparent',
              color: view === 'parked' ? '#3ECFCF' : '#9CA3AF',
              border: `1px solid ${view === 'parked' ? '#3ECFCF44' : 'transparent'}`,
            }}
          >
            Lot ({activeWorries.length})
          </button>
        </div>
      </div>

      <div className="relative flex-1 overflow-y-auto px-4 py-4">
        <AnimatePresence mode="wait">

          {/* ── SUCCESS STATE ── */}
          {view === 'success' && justParked && (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
              {/* Parking animation */}
              <div className="rounded-3xl p-6 text-center border" style={{ background: '#FFFFFF', borderColor: '#F0F0F0' }}>
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 12 }}
                  className="text-6xl mb-3"
                >
                  🅿️
                </motion.div>
                <p className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: '#3ECFCF' }}>Worry Parked</p>
                <p className="text-sm font-bold px-4 leading-relaxed" style={{ color: '#9CA3AF' }}>
                  "{justParked.text}"
                </p>
                <div className="mt-3 inline-block px-3 py-1.5 rounded-full text-xs font-bold"
                  style={{ background: '#3ECFCF18', color: '#3ECFCF', border: '1px solid #3ECFCF33' }}>
                  Scheduled: {justParked.scheduledFor}
                </div>
                {justParked.canControl && (
                  <div className="mt-4 text-left rounded-2xl p-3 border" style={{ background: '#7FD98C11', borderColor: '#7FD98C33' }}>
                    <p className="text-[9px] font-black uppercase tracking-widest mb-1" style={{ color: '#7FD98C' }}>What you can control</p>
                    <p className="text-sm font-medium leading-relaxed" style={{ color: '#3C3C3C' }}>{justParked.canControl}</p>
                  </div>
                )}
              </div>
              <CoachCard speaker="lance" pose="approving" label={`${NARRATOR.name} notes`}>"{LANCE_LINES[lanceIdx]}"</CoachCard>
              <CoachCard speaker="chip" pose="approving" label={intern.name || 'Chip'}>{INTERN_LINES[internIdx]}</CoachCard>
              <div className="flex gap-3">
                <button
                  onClick={() => { setWorryText(''); setCanControlText(''); setSelectedSchedule(''); setJustParked(null); setView('form'); }}
                  className="flex-1 py-3 rounded-2xl font-black text-sm border"
                  style={{ borderColor: '#3ECFCF44', color: '#3ECFCF' }}
                >
                  Park Another
                </button>
                <button onClick={onBack} className="flex-1 py-3 rounded-2xl font-black text-sm"
                  style={{ background: 'linear-gradient(135deg, #3ECFCF, #7FD98C)', color: '#F9FAFB' }}>
                  ← Home
                </button>
              </div>
            </motion.div>
          )}

          {/* ── PARKING LOT VIEW ── */}
          {view === 'parked' && (
            <motion.div key="lot" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              {activeWorries.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <div className="text-5xl">🅿️</div>
                  <p className="text-sm font-black" style={{ color: '#3C3C3C' }}>Lot is empty</p>
                  <p className="text-xs" style={{ color: '#9CA3AF' }}>Your parking lot is clear. Park a worry when you're ready.</p>
                  <button onClick={() => setView('form')} className="mt-4 px-6 py-2.5 rounded-full font-black text-sm"
                    style={{ background: '#3ECFCF18', color: '#3ECFCF', border: '1px solid #3ECFCF44' }}>
                    Park a worry
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-xs" style={{ color: '#9CA3AF' }}>
                    These worries have a scheduled review time. Until then — they're not your problem.
                  </p>
                  {activeWorries.map(w => (
                    <motion.div
                      key={w.id}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-2xl p-4 border"
                      style={{ background: '#FFFFFF', borderColor: '#F0F0F0' }}
                    >
                      <p className="text-sm font-medium leading-relaxed mb-2" style={{ color: '#3C3C3C' }}>
                        "{w.text}"
                      </p>
                      {w.canControl && (
                        <div className="mb-2 rounded-xl p-2.5 border" style={{ background: '#7FD98C11', borderColor: '#7FD98C33' }}>
                          <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: '#7FD98C' }}>I can control: </span>
                          <span className="text-xs" style={{ color: '#3C3C3C' }}>{w.canControl}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: '#3ECFCF18', color: '#3ECFCF', border: '1px solid #3ECFCF22' }}>
                          {w.scheduledFor}
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => resolveWorry(w.id)}
                            className="p-1.5 rounded-lg transition-all active:scale-90"
                            style={{ background: '#7FD98C22', color: '#7FD98C' }}
                            title="Resolved"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteWorry(w.id)}
                            className="p-1.5 rounded-lg transition-all active:scale-90"
                            style={{ background: '#ef444422', color: '#ef4444' }}
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  {resolvedWorries.length > 0 && (
                    <div className="pt-2">
                      <div className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: '#9CA3AF99' }}>
                        Resolved ({resolvedWorries.length})
                      </div>
                      {resolvedWorries.slice(0, 3).map(w => (
                        <div key={w.id} className="py-2 px-3 rounded-xl mb-1 opacity-40"
                          style={{ background: '#FFFFFF', border: '1px solid #3ECFCF11' }}>
                          <p className="text-xs line-through" style={{ color: '#9CA3AF' }}>"{w.text}"</p>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </motion.div>
          )}

          {/* ── FORM VIEW ── */}
          {view === 'form' && !showParking && (
            <motion.div key="form" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <CoachCard speaker="lance" pose="smug" label={`${NARRATOR.name} explains`}>
                "Rumination is cognitively expensive and statistically useless. Park the worry. Schedule a review. Until then, it does not exist. This is not avoidance — it is resource allocation."
              </CoachCard>

              {/* Worry input */}
              <div className="rounded-3xl p-5 border" style={{ background: '#FFFFFF', borderColor: '#F0F0F0' }}>
                <span className="text-xs font-black uppercase tracking-wider block mb-2" style={{ color: '#3C3C3C' }}>
                  What's the worry?
                </span>
                <textarea
                  value={worryText}
                  onChange={e => setWorryText(e.target.value)}
                  rows={3}
                  placeholder="Write it out completely. Name it so you can put it down..."
                  className="w-full px-4 py-3 rounded-2xl text-sm outline-none resize-none"
                  style={{ background: '#F9FAFB', color: '#3C3C3C', border: '1px solid #3ECFCF22', caretColor: '#3ECFCF' }}
                />
              </div>

              {/* Schedule */}
              <div className="rounded-3xl p-5 border" style={{ background: '#FFFFFF', borderColor: '#F0F0F0' }}>
                <span className="text-xs font-black uppercase tracking-wider block mb-3" style={{ color: '#3C3C3C' }}>
                  When will you address it?
                </span>
                <div className="space-y-2">
                  {SCHEDULE_OPTIONS.map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => setSelectedSchedule(opt.id)}
                      className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all active:scale-[0.98]"
                      style={{
                        background: selectedSchedule === opt.id ? '#3ECFCF22' : '#F9FAFB',
                        border: `1px solid ${selectedSchedule === opt.id ? '#3ECFCF' : '#9CA3AF'}`,
                        color: selectedSchedule === opt.id ? '#3ECFCF' : '#9CA3AF',
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* What you CAN control */}
              <div className="rounded-3xl p-5 border" style={{ background: '#FFFFFF', borderColor: '#7FD98C44' }}>
                <span className="text-xs font-black uppercase tracking-wider block mb-1" style={{ color: '#3C3C3C' }}>
                  What CAN you control here?
                </span>
                <p className="text-[11px] leading-relaxed mb-2" style={{ color: '#9CA3AF' }}>
                  Most worry is about the uncontrollable. Find the one actionable edge — the part that's actually yours — and focus only there.
                </p>
                <textarea
                  value={canControlText}
                  onChange={e => setCanControlText(e.target.value)}
                  rows={3}
                  placeholder="The part I can actually do something about is..."
                  className="w-full px-4 py-3 rounded-2xl text-sm outline-none resize-none"
                  style={{ background: '#F9FAFB', color: '#3C3C3C', border: '1px solid #7FD98C44', caretColor: '#7FD98C' }}
                />
              </div>

              {activeWorries.length > 0 && (
                <button onClick={() => setView('parked')} className="w-full py-2 text-xs font-bold"
                  style={{ color: '#9CA3AF' }}>
                  View lot ({activeWorries.length} parked) →
                </button>
              )}

              <button
                onClick={handlePark}
                disabled={!worryText.trim() || !selectedSchedule}
                className="w-full py-4 rounded-2xl font-black text-sm disabled:opacity-40"
                style={{ background: 'linear-gradient(135deg, #3ECFCF, #7FD98C)', color: '#F9FAFB' }}
              >
                🅿️ Park It
              </button>
            </motion.div>
          )}

          {/* ── PARKING ANIMATION — the worry folds into a note and files itself away ── */}
          {showParking && (
            <motion.div
              key="parking"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative flex flex-col items-center justify-center h-72 gap-4"
            >
              {/* The parking slot */}
              <div className="absolute bottom-10 w-40 h-16 rounded-xl" style={{
                border: '2px dashed #3ECFCF88',
                background: 'rgba(62,207,207,0.08)',
              }}>
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2 text-[10px] font-black rounded"
                  style={{ background: '#3ECFCF', color: 'white' }}>P</div>
              </div>
              {/* The worry, as a paper note, folding + gliding into the slot */}
              <motion.div
                initial={{ y: -60, rotate: 0, scale: 1, opacity: 1 }}
                animate={{ y: 128, rotate: -6, scale: 0.42, opacity: 0.9 }}
                transition={{ duration: 0.85, ease: [0.45, 0, 0.25, 1] }}
                className="px-4 py-3 rounded-xl max-w-[240px] text-center"
                style={{
                  background: '#FFFDF5',
                  border: '1px solid #E8E2CE',
                  boxShadow: '0 10px 24px rgba(0,0,0,0.15)',
                  color: '#6B7280',
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                "{worryText.trim().slice(0, 80)}{worryText.trim().length > 80 ? '…' : ''}"
              </motion.div>
              <div className="absolute bottom-2 text-sm font-black" style={{ color: '#3ECFCF' }}>Parked. Not your problem until it's time.</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
