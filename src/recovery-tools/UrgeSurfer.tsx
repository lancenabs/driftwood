import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Waves, LifeBuoy, Check } from 'lucide-react';
import BigBackButton from '../lance/components/LANCEGame/BigBackButton';
import { GlassPanel, pickPraise } from '../lance/components/LANCEGame/ui/GlassKit';
import MateCard from './MateCard';

// ============================================================================
// URGE SURFER — the wave timer. Lance's teaching, verbatim from the groups:
// cravings are weather; they peak and pass, usually inside 15–30 minutes.
// You don't fight the wave. You ride it, and you log the ride.
// Every completed surf feeds the wake: waves ridden never un-ride.
// ============================================================================

interface SurfEntry {
  id: string;
  startedAt: string;
  minutes: number;
  peakIntensity: number;   // 1-10 at the start
  endIntensity: number;    // 1-10 after the ride
  note: string;
}

const STORAGE_KEY = 'rehabit_urge_surfs_v1';

function load(): SurfEntry[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
}
function save(entries: SurfEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

// The First Mate's lines — honest, warm, no fake lived experience.
const RIDE_LINES = [
  "Cravings are weather. This one is already moving through — your only job is to stay on the board.",
  "The charts say most waves crest inside fifteen to thirty minutes. You're closer to the far side every breath.",
  "Notice it without obeying it. You're the captain; the wave is just water.",
  "Don't fight the wave — that's how you go under. Ride it. Loose knees, long breaths.",
  "This exact feeling has passed before. Your own log proves it. It will pass again.",
  "You reached for the board instead of the bottle. That decision is already in your wake — nothing un-decides it.",
];

const FINISH_LINES = [
  "Wave ridden. That's real water behind you now — it never un-crosses.",
  "You just proved the teaching with your own body: it peaked, and it passed.",
  "Logged. The next wave will meet a better surfer.",
  "That's one more surf in the wake. The sea doesn't get smaller — you get steadier.",
];

type Phase = 'name' | 'ride' | 'log' | 'done';

export default function UrgeSurfer({ onBack }: { onBack: () => void }) {
  const [phase, setPhase] = useState<Phase>('name');
  const [entries, setEntries] = useState<SurfEntry[]>(load);
  const [peakIntensity, setPeakIntensity] = useState(7);
  const [endIntensity, setEndIntensity] = useState(4);
  const [note, setNote] = useState('');
  const [seconds, setSeconds] = useState(0);
  const [lineIdx, setLineIdx] = useState(0);
  const [finishLine, setFinishLine] = useState('');
  const startRef = useRef<string>('');

  // The ride clock — one honest second at a time.
  useEffect(() => {
    if (phase !== 'ride') return;
    const t = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(t);
  }, [phase]);

  // Rotate the First Mate's lines every 45 seconds of the ride.
  useEffect(() => {
    if (phase !== 'ride') return;
    const t = setInterval(() => setLineIdx(i => (i + 1) % RIDE_LINES.length), 45000);
    return () => clearInterval(t);
  }, [phase]);

  const startRide = () => {
    startRef.current = new Date().toISOString();
    setSeconds(0);
    setLineIdx(0);
    setPhase('ride');
  };

  const endRide = () => {
    setEndIntensity(Math.min(peakIntensity, 4));
    setPhase('log');
  };

  const saveSurf = () => {
    const entry: SurfEntry = {
      id: `surf-${Date.now()}`,
      startedAt: startRef.current,
      minutes: Math.max(1, Math.round(seconds / 60)),
      peakIntensity,
      endIntensity,
      note: note.trim(),
    };
    const next = [entry, ...entries];
    setEntries(next);
    save(next);
    setFinishLine(pickPraise(FINISH_LINES));
    setPhase('done');
    setNote('');
  };

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  // The wave visual crests toward ~20 min then eases — the teaching, drawn.
  const crest = Math.min(1, seconds / (20 * 60));
  const waveHeight = phase === 'ride' ? 24 + Math.sin(crest * Math.PI) * 40 : 24;

  return (
    <div className="relative min-h-full p-4 md:p-6 pb-24" style={{ background: 'linear-gradient(180deg, #F0FDFA 0%, #F8FAFC 40%)' }}>
      <BigBackButton onBack={onBack} />

      <div className="max-w-xl mx-auto space-y-4 pt-2">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 text-teal-700">
            <Waves className="w-5 h-5" />
            <h1 className="text-xl font-black tracking-tight">Urge Surfer</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Cravings peak and pass — usually inside 15 to 30 minutes. Ride this one, on the clock.
          </p>
        </div>

        {/* The wave itself — always present, alive during the ride */}
        <div className="relative h-28 overflow-hidden rounded-2xl border border-teal-100 bg-gradient-to-b from-sky-50 to-teal-50">
          <motion.div
            className="absolute inset-x-0 bottom-0"
            animate={{ height: waveHeight }}
            transition={{ duration: 2, ease: 'easeInOut' }}
            style={{ background: 'linear-gradient(180deg, rgba(13,148,136,0.35), rgba(13,148,136,0.6))', borderRadius: '100% 100% 0 0 / 40% 40% 0 0' }}
          />
          <motion.div
            className="absolute inset-x-0 bottom-0"
            animate={{ height: waveHeight * 0.7, x: [0, 14, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            style={{ background: 'linear-gradient(180deg, rgba(56,189,248,0.25), rgba(13,148,136,0.4))', borderRadius: '100% 100% 0 0 / 55% 55% 0 0' }}
          />
          {phase === 'ride' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-black text-teal-900/80 tabular-nums">{mins}:{String(secs).padStart(2, '0')}</span>
            </div>
          )}
        </div>

        <AnimatePresence mode="wait">
          {phase === 'name' && (
            <motion.div key="name" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
              <GlassPanel className="p-4 space-y-3">
                <label className="text-xs font-black text-slate-700 block">How big is the wave right now?</label>
                <input type="range" min={1} max={10} value={peakIntensity}
                  onChange={e => setPeakIntensity(Number(e.target.value))}
                  className="w-full accent-teal-600" />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>ripple</span>
                  <span className="text-sm font-black text-teal-700">{peakIntensity}/10</span>
                  <span>breaker</span>
                </div>
              </GlassPanel>
              <button onClick={startRide}
                className="w-full py-3.5 bg-teal-700 hover:bg-teal-600 text-white font-black rounded-2xl text-sm shadow-lg shadow-teal-900/20 cursor-pointer transition-colors">
                Get on the board — start the ride
              </button>
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('rehabit:sos'))}
                className="w-full py-2.5 bg-white border border-rose-200 text-rose-600 font-bold rounded-2xl text-xs cursor-pointer hover:bg-rose-50 transition-colors flex items-center justify-center gap-1.5">
                <LifeBuoy className="w-3.5 h-3.5" /> This is more than a wave — open SOS
              </button>
            </motion.div>
          )}

          {phase === 'ride' && (
            <motion.div key="ride" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
              <MateCard>{RIDE_LINES[lineIdx]}</MateCard>
              <div className="grid grid-cols-3 gap-2 text-center">
                {[5, 15, 30].map(m => (
                  <div key={m} className={`p-2.5 rounded-xl border text-[10px] font-bold ${
                    mins >= m ? 'bg-teal-50 border-teal-200 text-teal-700' : 'bg-white border-slate-200 text-slate-400'
                  }`}>
                    {mins >= m ? <Check className="w-3 h-3 inline mr-1" /> : null}{m} min
                  </div>
                ))}
              </div>
              <button onClick={endRide}
                className="w-full py-3.5 bg-teal-700 hover:bg-teal-600 text-white font-black rounded-2xl text-sm shadow-lg cursor-pointer transition-colors">
                The wave has passed — log the surf
              </button>
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('rehabit:sos'))}
                className="w-full py-2.5 bg-white border border-rose-200 text-rose-600 font-bold rounded-2xl text-xs cursor-pointer hover:bg-rose-50 transition-colors flex items-center justify-center gap-1.5">
                <LifeBuoy className="w-3.5 h-3.5" /> I need more than the board — SOS
              </button>
            </motion.div>
          )}

          {phase === 'log' && (
            <motion.div key="log" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
              <GlassPanel className="p-4 space-y-3">
                <label className="text-xs font-black text-slate-700 block">And now — how big is it?</label>
                <input type="range" min={0} max={10} value={endIntensity}
                  onChange={e => setEndIntensity(Number(e.target.value))}
                  className="w-full accent-teal-600" />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>gone</span>
                  <span className="text-sm font-black text-teal-700">{endIntensity}/10</span>
                  <span>still up</span>
                </div>
                <textarea rows={2} value={note} onChange={e => setNote(e.target.value)}
                  placeholder="What did you notice? (optional — honest beats pretty)"
                  className="w-full p-3 bg-white/70 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-teal-400" />
              </GlassPanel>
              <button onClick={saveSurf}
                className="w-full py-3.5 bg-teal-700 hover:bg-teal-600 text-white font-black rounded-2xl text-sm shadow-lg cursor-pointer transition-colors">
                Add it to the wake
              </button>
            </motion.div>
          )}

          {phase === 'done' && (
            <motion.div key="done" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
              <GlassPanel className="p-5 text-center space-y-2">
                <Waves className="w-8 h-8 text-teal-600 mx-auto" />
                <p className="text-sm font-black text-slate-800">{finishLine}</p>
                <p className="text-[11px] text-slate-500">
                  Peak {peakIntensity}/10 → {endIntensity}/10 after {Math.max(1, mins)} min on the board.
                </p>
              </GlassPanel>
              <button onClick={() => setPhase('name')}
                className="w-full py-3 bg-white border border-slate-200 text-slate-600 font-bold rounded-2xl text-xs cursor-pointer hover:bg-slate-50 transition-colors">
                Another wave? Back to the board
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* THE WAKE — waves ridden never un-ride. This number only goes up. */}
        {entries.length > 0 && (
          <GlassPanel className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-black text-slate-700">The wake</h3>
              <span className="text-[10px] font-black text-teal-700 bg-teal-50 border border-teal-100 px-2 py-0.5 rounded-full">
                {entries.length} wave{entries.length === 1 ? '' : 's'} ridden — this never resets
              </span>
            </div>
            <div className="space-y-1.5 max-h-44 overflow-y-auto">
              {entries.slice(0, 12).map(e => (
                <div key={e.id} className="flex items-center justify-between text-[11px] p-2 bg-white/60 rounded-lg border border-slate-100">
                  <span className="text-slate-600">
                    {new Date(e.startedAt).toLocaleDateString()} · {e.peakIntensity}→{e.endIntensity} in {e.minutes} min
                  </span>
                  {e.note && <span className="text-slate-400 italic truncate max-w-[45%]">{e.note}</span>}
                </div>
              ))}
            </div>
          </GlassPanel>
        )}
      </div>
    </div>
  );
}
