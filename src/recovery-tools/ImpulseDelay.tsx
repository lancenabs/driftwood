import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Unlock, LifeBuoy, Waves } from 'lucide-react';
import BigBackButton from '../lance/components/LANCEGame/BigBackButton';
import { GlassPanel } from '../lance/components/LANCEGame/ui/GlassKit';
import MateCard from './MateCard';

// ============================================================================
// IMPULSE DELAY LOCK — urge delay, honestly framed. Not suppression: a bet.
// The bet is Lance's teaching — urges decay on their own if you give them
// minutes. Name it, lock it, live a little life meanwhile, then re-decide
// with a quieter brain. Wins land in the wake; "still want it" gets honest
// next doors (Urge Surfer, SOS), never a scolding.
// ============================================================================

interface DelayEntry {
  id: string;
  timestamp: string;
  impulse: string;
  minutes: number;
  outcome: 'faded' | 'weaker' | 'still-loud';
}

const STORAGE_KEY = 'rehabit_delays_v1';

function load(): DelayEntry[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
}
function save(entries: DelayEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

// While-you-wait moves, pulled from the curriculum's activity bank (§8).
const WAIT_MOVES = [
  'Drink a full glass of water', 'Step outside for two minutes', 'Put on one song and actually listen',
  'Ten slow breaths, out longer than in', 'Text your person — about anything', 'Wash your face with cold water',
  'Write the impulse a one-line reply', 'Do twenty of anything (steps, squats, dishes)',
];

type Phase = 'name' | 'locked' | 'decide' | 'done';

export default function ImpulseDelay({ onBack }: { onBack: () => void }) {
  const [phase, setPhase] = useState<Phase>('name');
  const [impulse, setImpulse] = useState('');
  const [minutes, setMinutes] = useState(10);
  const [remaining, setRemaining] = useState(0);
  const [entries, setEntries] = useState<DelayEntry[]>(load);
  const [moveIdx, setMoveIdx] = useState(0);
  const totalRef = useRef(0);

  useEffect(() => {
    if (phase !== 'locked') return;
    const t = setInterval(() => {
      setRemaining(r => {
        if (r <= 1) { setPhase('decide'); return 0; }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'locked') return;
    const t = setInterval(() => setMoveIdx(i => (i + 1) % WAIT_MOVES.length), 30000);
    return () => clearInterval(t);
  }, [phase]);

  const lock = () => {
    totalRef.current = minutes * 60;
    setRemaining(minutes * 60);
    setMoveIdx(Math.floor(Math.random() * WAIT_MOVES.length));
    setPhase('locked');
  };

  const recordOutcome = (outcome: DelayEntry['outcome']) => {
    const entry: DelayEntry = {
      id: `delay-${Date.now()}`,
      timestamp: new Date().toISOString(),
      impulse: impulse.trim(),
      minutes,
      outcome,
    };
    const next = [entry, ...entries];
    setEntries(next);
    save(next);
    setPhase('done');
  };

  const wins = entries.filter(e => e.outcome !== 'still-loud').length;
  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const progress = totalRef.current > 0 ? 1 - remaining / totalRef.current : 0;

  return (
    <div className="relative min-h-full p-4 md:p-6 pb-24" style={{ background: 'linear-gradient(180deg, #EEF2FF 0%, #F8FAFC 35%)' }}>
      <BigBackButton onBack={onBack} />

      <div className="max-w-xl mx-auto space-y-4 pt-2">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 text-indigo-700">
            <Lock className="w-5 h-5" />
            <h1 className="text-xl font-black tracking-tight">Impulse Delay Lock</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Not "no." Just "not for ten minutes." Urges decay — make them prove they're real.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {phase === 'name' && (
            <motion.div key="name" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
              <GlassPanel className="p-4 space-y-3">
                <label className="text-xs font-black text-slate-700 block">Name the impulse — plainly:</label>
                <input value={impulse} onChange={e => setImpulse(e.target.value)}
                  placeholder='"Drive to the store" · "Text him back" · "One drink"'
                  className="w-full p-3 bg-white/70 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                <label className="text-xs font-black text-slate-700 block pt-1">Lock it for:</label>
                <div className="grid grid-cols-3 gap-2">
                  {[10, 20, 30].map(m => (
                    <button key={m} onClick={() => setMinutes(m)}
                      className={`py-2.5 rounded-xl font-black text-sm border-2 transition-all cursor-pointer ${
                        minutes === m ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                      }`}>
                      {m} min
                    </button>
                  ))}
                </div>
              </GlassPanel>
              <button onClick={lock} disabled={!impulse.trim()}
                className="w-full py-3.5 bg-indigo-700 hover:bg-indigo-600 disabled:bg-slate-300 text-white font-black rounded-2xl text-sm shadow-lg cursor-pointer transition-colors flex items-center justify-center gap-2">
                <Lock className="w-4 h-4" /> Turn the key
              </button>
            </motion.div>
          )}

          {phase === 'locked' && (
            <motion.div key="locked" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
              <div className="relative flex flex-col items-center py-6">
                <svg width="140" height="140" viewBox="0 0 140 140">
                  <circle cx="70" cy="70" r="62" fill="none" stroke="#E2E8F0" strokeWidth="8" />
                  <motion.circle cx="70" cy="70" r="62" fill="none" stroke="#4F46E5" strokeWidth="8"
                    strokeLinecap="round" strokeDasharray={2 * Math.PI * 62}
                    animate={{ strokeDashoffset: 2 * Math.PI * 62 * (1 - progress) }}
                    transform="rotate(-90 70 70)" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <Lock className="w-5 h-5 text-indigo-500 mb-1" />
                  <span className="text-2xl font-black text-slate-800 tabular-nums">{mins}:{String(secs).padStart(2, '0')}</span>
                </div>
              </div>
              <GlassPanel className="p-4 text-center">
                <p className="text-[10px] font-black uppercase tracking-wider text-indigo-500 mb-1">Meanwhile — try this one</p>
                <p className="text-sm font-bold text-slate-700">{WAIT_MOVES[moveIdx]}</p>
              </GlassPanel>
              <MateCard>
                The impulse is locked, not fought. You're not white-knuckling — you're letting time do
                the heavy lifting. It's the oldest trick in the book because it works.
              </MateCard>
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('rehabit:sos'))}
                className="w-full py-2.5 bg-white border border-rose-200 text-rose-600 font-bold rounded-2xl text-xs cursor-pointer hover:bg-rose-50 transition-colors flex items-center justify-center gap-1.5">
                <LifeBuoy className="w-3.5 h-3.5" /> Can't hold the lock — open SOS
              </button>
            </motion.div>
          )}

          {phase === 'decide' && (
            <motion.div key="decide" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
              <div className="text-center py-2">
                <Unlock className="w-8 h-8 text-indigo-500 mx-auto mb-1" />
                <p className="text-sm font-black text-slate-800">The lock is open. Same question, quieter brain:</p>
                <p className="text-xs text-slate-500 italic mt-1">"{impulse}" — where is it now?</p>
              </div>
              <div className="space-y-2">
                <button onClick={() => recordOutcome('faded')}
                  className="w-full py-3 bg-teal-700 hover:bg-teal-600 text-white font-black rounded-2xl text-sm cursor-pointer transition-colors">
                  It faded — barely hear it now
                </button>
                <button onClick={() => recordOutcome('weaker')}
                  className="w-full py-3 bg-teal-600/80 hover:bg-teal-600 text-white font-black rounded-2xl text-sm cursor-pointer transition-colors">
                  Weaker, but still there
                </button>
                <button onClick={() => recordOutcome('still-loud')}
                  className="w-full py-3 bg-white border-2 border-slate-300 text-slate-700 font-black rounded-2xl text-sm cursor-pointer hover:bg-slate-50 transition-colors">
                  Still loud — I need the next tool
                </button>
              </div>
            </motion.div>
          )}

          {phase === 'done' && (
            <motion.div key="done" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
              {entries[0]?.outcome === 'still-loud' ? (
                <>
                  <MateCard>
                    Honest answer — and holding the lock for {entries[0].minutes} minutes still counts.
                    A loud urge after a delay is exactly what the surfboard is for. Or if it's bigger
                    than a wave, the lifebuoy. No shame in either door.
                  </MateCard>
                  <button
                    onClick={() => window.dispatchEvent(new CustomEvent('rehabit:sos'))}
                    className="w-full py-3 bg-rose-500 hover:bg-rose-600 text-white font-black rounded-2xl text-sm cursor-pointer transition-colors flex items-center justify-center gap-1.5">
                    <LifeBuoy className="w-4 h-4" /> Open SOS
                  </button>
                </>
              ) : (
                <MateCard>
                  You bet that the urge would decay, and you won. That's not willpower —
                  that's knowing how the machinery works. It's in the wake now.
                </MateCard>
              )}
              <button onClick={() => { setPhase('name'); setImpulse(''); }}
                className="w-full py-3 bg-white border border-slate-200 text-slate-600 font-bold rounded-2xl text-xs cursor-pointer hover:bg-slate-50 transition-colors">
                New lock
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {entries.length > 0 && (
          <GlassPanel className="p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-700 flex items-center gap-1.5">
                <Waves className="w-3.5 h-3.5 text-teal-600" /> The wake
              </h3>
              <span className="text-[10px] font-black text-teal-700 bg-teal-50 border border-teal-100 px-2 py-0.5 rounded-full">
                {wins} of {entries.length} locks outlasted the urge
              </span>
            </div>
          </GlassPanel>
        )}
      </div>
    </div>
  );
}
