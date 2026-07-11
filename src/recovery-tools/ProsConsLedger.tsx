import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Scale, BookOpen, ChevronRight } from 'lucide-react';
import BigBackButton from '../lance/components/LANCEGame/BigBackButton';
import { GlassPanel } from '../lance/components/LANCEGame/ui/GlassKit';
import MateCard from './MateCard';

// ============================================================================
// PROS & CONS LEDGER — DBT distress tolerance, straight from the curriculum:
// "Mindfully list the pros and cons of acting on the urge vs. not."
// The trick every clinician knows: fill it out when calm, read it when loud.
// Four quadrants, guided one at a time, saved as a ledger you can reopen
// in exactly the moment you won't want to think.
// ============================================================================

interface Ledger {
  id: string;
  createdAt: string;
  urge: string;
  actPros: string;
  actCons: string;
  rideOutPros: string;
  rideOutCons: string;
}

const STORAGE_KEY = 'rehabit_ledgers_v1';

function load(): Ledger[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
}
function save(ledgers: Ledger[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ledgers));
}

const QUADRANTS = [
  {
    key: 'actPros' as const, title: 'Acting on it — the pros', tone: 'honest',
    prompt: "Be real: what does the urge promise? Relief, escape, fun, quiet? If you skip this box, the ledger is propaganda and your brain knows it.",
  },
  {
    key: 'actCons' as const, title: 'Acting on it — the cons', tone: 'honest',
    prompt: 'And the bill: what does it actually cost? Tonight, tomorrow, the people, the streak, the way you meet the mirror.',
  },
  {
    key: 'rideOutPros' as const, title: 'Riding it out — the pros', tone: 'honest',
    prompt: 'What does not acting buy you? Not just "sobriety" — the specific, concrete stuff: the morning, the trust, the proof.',
  },
  {
    key: 'rideOutCons' as const, title: 'Riding it out — the cons', tone: 'honest',
    prompt: "Honesty again: riding it out costs something too — discomfort, boredom, a fight with your own head for an hour. Name the real price.",
  },
];

type Phase = 'urge' | 'quadrants' | 'grid' | 'shelf';

export default function ProsConsLedger({ onBack }: { onBack: () => void }) {
  const [phase, setPhase] = useState<Phase>('urge');
  const [urge, setUrge] = useState('');
  const [values, setValues] = useState<Record<string, string>>({});
  const [qIdx, setQIdx] = useState(0);
  const [ledgers, setLedgers] = useState<Ledger[]>(load);
  const [openLedger, setOpenLedger] = useState<Ledger | null>(null);

  const q = QUADRANTS[qIdx];

  const advance = () => {
    if (qIdx < QUADRANTS.length - 1) setQIdx(qIdx + 1);
    else setPhase('grid');
  };

  const saveLedger = () => {
    const entry: Ledger = {
      id: `ledger-${Date.now()}`,
      createdAt: new Date().toISOString(),
      urge: urge.trim(),
      actPros: values.actPros || '',
      actCons: values.actCons || '',
      rideOutPros: values.rideOutPros || '',
      rideOutCons: values.rideOutCons || '',
    };
    const next = [entry, ...ledgers];
    setLedgers(next);
    save(next);
    setPhase('shelf');
    setUrge(''); setValues({}); setQIdx(0);
  };

  const GridView = ({ l }: { l: Pick<Ledger, 'actPros' | 'actCons' | 'rideOutPros' | 'rideOutCons'> }) => (
    <div className="grid grid-cols-2 gap-2">
      <div className="p-3 bg-rose-50/70 border border-rose-100 rounded-xl">
        <p className="text-[9px] font-black uppercase text-rose-400 mb-1">Acting — pros</p>
        <p className="text-[11px] text-slate-700 whitespace-pre-wrap">{l.actPros}</p>
      </div>
      <div className="p-3 bg-rose-100/70 border border-rose-200 rounded-xl">
        <p className="text-[9px] font-black uppercase text-rose-500 mb-1">Acting — cons</p>
        <p className="text-[11px] text-slate-700 whitespace-pre-wrap">{l.actCons}</p>
      </div>
      <div className="p-3 bg-teal-50/70 border border-teal-100 rounded-xl">
        <p className="text-[9px] font-black uppercase text-teal-500 mb-1">Riding out — pros</p>
        <p className="text-[11px] text-slate-700 whitespace-pre-wrap">{l.rideOutPros}</p>
      </div>
      <div className="p-3 bg-teal-100/60 border border-teal-200 rounded-xl">
        <p className="text-[9px] font-black uppercase text-teal-600 mb-1">Riding out — cons</p>
        <p className="text-[11px] text-slate-700 whitespace-pre-wrap">{l.rideOutCons}</p>
      </div>
    </div>
  );

  return (
    <div className="relative min-h-full p-4 md:p-6 pb-24" style={{ background: 'linear-gradient(180deg, #F0FDF4 0%, #F8FAFC 35%)' }}>
      <BigBackButton onBack={onBack} />

      <div className="max-w-xl mx-auto space-y-4 pt-2">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 text-emerald-700">
            <Scale className="w-5 h-5" />
            <h1 className="text-xl font-black tracking-tight">Pros & Cons Ledger</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Fill it out when calm. Read it when it's loud. That's the whole trick.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {phase === 'urge' && (
            <motion.div key="urge" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
              <GlassPanel className="p-4 space-y-3">
                <label className="text-xs font-black text-slate-700 block">The urge this ledger is about:</label>
                <input value={urge} onChange={e => setUrge(e.target.value)}
                  placeholder='"Drinking at the work dinner" · "Calling my old dealer"'
                  className="w-full p-3 bg-white/70 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400" />
              </GlassPanel>
              <button onClick={() => { if (urge.trim()) setPhase('quadrants'); }} disabled={!urge.trim()}
                className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-600 disabled:bg-slate-300 text-white font-black rounded-2xl text-sm shadow-lg cursor-pointer transition-colors">
                Open the ledger
              </button>
              {ledgers.length > 0 && (
                <button onClick={() => setPhase('shelf')}
                  className="w-full py-2.5 bg-white border border-slate-200 text-slate-600 font-bold rounded-2xl text-xs cursor-pointer hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" /> My ledgers ({ledgers.length})
                </button>
              )}
            </motion.div>
          )}

          {phase === 'quadrants' && (
            <motion.div key={q.key} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} className="space-y-4">
              <div className="flex items-center gap-2">
                {QUADRANTS.map((x, i) => (
                  <div key={x.key} className={`h-1.5 flex-1 rounded-full ${i <= qIdx ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                ))}
              </div>
              <GlassPanel className="p-4 space-y-3">
                <p className="text-xs font-black text-slate-800">{q.title}</p>
                <p className="text-[11px] text-slate-500">{q.prompt}</p>
                <textarea rows={4} value={values[q.key] || ''}
                  onChange={e => setValues(prev => ({ ...prev, [q.key]: e.target.value }))}
                  placeholder="One per line is fine…"
                  className="w-full p-3 bg-white/70 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400" />
              </GlassPanel>
              <button onClick={advance} disabled={!(values[q.key] || '').trim()}
                className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-600 disabled:bg-slate-300 text-white font-black rounded-2xl text-sm shadow-lg cursor-pointer transition-colors flex items-center justify-center gap-1">
                {qIdx < QUADRANTS.length - 1 ? 'Next column' : 'See the whole ledger'} <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {phase === 'grid' && (
            <motion.div key="grid" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
              <MateCard>
                All four columns, honestly filled — including what the urge promises. Now the ledger
                has authority: when it gets loud, you don't have to out-argue it. Just read your own math.
              </MateCard>
              <GridView l={values as any} />
              <button onClick={saveLedger}
                className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-600 text-white font-black rounded-2xl text-sm shadow-lg cursor-pointer transition-colors">
                Save to my ledgers
              </button>
            </motion.div>
          )}

          {phase === 'shelf' && (
            <motion.div key="shelf" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
              {openLedger ? (
                <>
                  <p className="text-xs font-black text-slate-800 text-center italic">"{openLedger.urge}"</p>
                  <GridView l={openLedger} />
                  <button onClick={() => setOpenLedger(null)}
                    className="w-full py-2.5 bg-white border border-slate-200 text-slate-600 font-bold rounded-2xl text-xs cursor-pointer hover:bg-slate-50 transition-colors">
                    Back to the shelf
                  </button>
                </>
              ) : (
                <>
                  {ledgers.map(l => (
                    <button key={l.id} onClick={() => setOpenLedger(l)}
                      className="w-full p-3.5 bg-white border border-slate-200 rounded-2xl text-left hover:bg-slate-50 transition-colors cursor-pointer flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700 italic truncate">"{l.urge}"</span>
                      <span className="text-[9px] text-slate-400 shrink-0 ml-2">{new Date(l.createdAt).toLocaleDateString()}</span>
                    </button>
                  ))}
                  <button onClick={() => setPhase('urge')}
                    className="w-full py-3 bg-emerald-700 hover:bg-emerald-600 text-white font-black rounded-2xl text-xs cursor-pointer transition-colors">
                    New ledger
                  </button>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
