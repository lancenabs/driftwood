import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Apple, Flame, Users, Moon, LifeBuoy } from 'lucide-react';
import BigBackButton from '../lance/components/LANCEGame/BigBackButton';
import { GlassPanel } from '../lance/components/LANCEGame/ui/GlassKit';
import MateCard from './MateCard';

// ============================================================================
// HALT CHECK — the ten-second scan. Hungry · Angry · Lonely · Tired.
// Lance's "classic setup" (not much sleep, a dreaded Monday… suddenly alone)
// is almost always two or three of these stacked. Name the state, take the
// matched micro-action, and the craving loses its disguise.
// ============================================================================

interface HaltEntry {
  id: string;
  timestamp: string;
  flags: string[];
}

const STORAGE_KEY = 'rehabit_halt_v1';

function load(): HaltEntry[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
}
function save(entries: HaltEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

const STATES = [
  {
    id: 'hungry', label: 'Hungry', icon: Apple, color: '#F59E0B', bg: 'bg-amber-50', border: 'border-amber-200',
    question: 'When did you last eat something real?',
    action: 'Eat before you decide anything. Protein beats sugar — a craving on an empty stomach is twice its size.',
  },
  {
    id: 'angry', label: 'Angry', icon: Flame, color: '#EF4444', bg: 'bg-rose-50', border: 'border-rose-200',
    question: "What's sitting in your chest right now?",
    action: "Move it out of your body — walk hard, write it unsent, say it out loud in the car. Anger that isn't moved gets poured.",
  },
  {
    id: 'lonely', label: 'Lonely', icon: Users, color: '#8B5CF6', bg: 'bg-violet-50', border: 'border-violet-200',
    question: 'When did you last hear a voice that knows you?',
    action: "Text one person — the excuse list ('too late, too busy, too awkward') is the loneliness talking. Name the excuse, reach out anyway.",
  },
  {
    id: 'tired', label: 'Tired', icon: Moon, color: '#3B82F6', bg: 'bg-sky-50', border: 'border-sky-200',
    question: 'How much sleep did you actually get?',
    action: "Rest is a recovery tool, not a luxury. Twenty minutes down, or an honest early night — tired brains lose arguments with cravings.",
  },
];

export default function HALTCheck({ onBack }: { onBack: () => void }) {
  const [flags, setFlags] = useState<Set<string>>(new Set());
  const [logged, setLogged] = useState(false);
  const [entries, setEntries] = useState<HaltEntry[]>(load);

  const toggle = (id: string) => {
    setLogged(false);
    setFlags(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const logCheck = () => {
    const entry: HaltEntry = {
      id: `halt-${Date.now()}`,
      timestamp: new Date().toISOString(),
      flags: Array.from(flags),
    };
    const next = [entry, ...entries];
    setEntries(next);
    save(next);
    setLogged(true);
  };

  // Pattern counts across the log — which state shows up most.
  const counts: Record<string, number> = {};
  for (const e of entries) for (const f of e.flags) counts[f] = (counts[f] || 0) + 1;
  const topState = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];

  const stacked = flags.size >= 3;

  return (
    <div className="relative min-h-full p-4 md:p-6 pb-24" style={{ background: 'linear-gradient(180deg, #FFFBEB 0%, #F8FAFC 35%)' }}>
      <BigBackButton onBack={onBack} />

      <div className="max-w-xl mx-auto space-y-4 pt-2">
        <div className="text-center">
          <h1 className="text-xl font-black tracking-tight text-slate-800">HALT Check</h1>
          <p className="text-xs text-slate-500 mt-1">
            The ten-second scan. Most "cravings" are one of these four wearing a disguise.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {STATES.map(s => {
            const on = flags.has(s.id);
            const Icon = s.icon;
            return (
              <button
                key={s.id}
                onClick={() => toggle(s.id)}
                className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                  on ? `${s.bg} ${s.border} shadow-md` : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <Icon className="w-6 h-6 mb-1.5" style={{ color: on ? s.color : '#94A3B8' }} />
                <p className={`text-sm font-black ${on ? 'text-slate-800' : 'text-slate-500'}`}>{s.label}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{s.question}</p>
              </button>
            );
          })}
        </div>

        <AnimatePresence>
          {Array.from(flags).map(id => {
            const s = STATES.find(x => x.id === id)!;
            return (
              <motion.div key={id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }}>
                <div className={`p-3.5 rounded-2xl border ${s.bg} ${s.border}`}>
                  <p className="text-[10px] font-black uppercase tracking-wider mb-1" style={{ color: s.color }}>{s.label} → the move</p>
                  <p className="text-xs text-slate-700">{s.action}</p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {stacked && (
          <MateCard>
            Three or more stacked — that's the classic setup, not a character flaw. Handle the body first,
            then decide if anything else is still true. If it's loud right now, the lifebuoy is right below.
          </MateCard>
        )}

        {flags.size > 0 && !logged && (
          <button onClick={logCheck}
            className="w-full py-3.5 bg-amber-600 hover:bg-amber-500 text-white font-black rounded-2xl text-sm shadow-lg cursor-pointer transition-colors">
            Log the scan
          </button>
        )}
        {logged && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-xs font-bold text-amber-700">
            Logged. Now take the matched move — the scan only counts if the body gets what it asked for.
          </motion.p>
        )}

        {stacked && (
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('rehabit:sos'))}
            className="w-full py-2.5 bg-white border border-rose-200 text-rose-600 font-bold rounded-2xl text-xs cursor-pointer hover:bg-rose-50 transition-colors flex items-center justify-center gap-1.5">
            <LifeBuoy className="w-3.5 h-3.5" /> It's more than the body — open SOS
          </button>
        )}

        {entries.length > 2 && topState && (
          <GlassPanel className="p-4">
            <h3 className="text-xs font-black text-slate-700 mb-1">Your pattern</h3>
            <p className="text-[11px] text-slate-500">
              Across {entries.length} scans, <span className="font-black text-slate-700 capitalize">{topState[0]}</span> shows
              up most ({topState[1]}×). That's not a flaw — it's a chart marking. Plan for that water.
            </p>
          </GlassPanel>
        )}
      </div>
    </div>
  );
}
