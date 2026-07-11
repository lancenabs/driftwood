import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CircleDot, Plus, X, Quote } from 'lucide-react';
import BigBackButton from '../lance/components/LANCEGame/BigBackButton';
import { GlassPanel } from '../lance/components/LANCEGame/ui/GlassKit';
import MateCard from './MateCard';

// ============================================================================
// THE HULA-HOOP — Lance's boundary teaching, verbatim from the curriculum:
// "Picture a hula-hoop around you — you decide what comes inside it. Do you
// let in anger? Toxic people? Past behaviors? Or supports?"
// Build the hoop item by item; give each OUTSIDE boundary a spoken script —
// the exact sentence you'll say when it tests the line.
// ============================================================================

interface HoopItem {
  id: string;
  text: string;
  side: 'inside' | 'outside';
  script?: string;   // outside items: the sentence that holds the line
}

const STORAGE_KEY = 'rehabit_hoop_v1';

function load(): HoopItem[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
}
function save(items: HoopItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

const INSIDE_IDEAS = ['My supports', 'Honesty, even when it costs', 'Feelings — felt, not fled', 'Love Glasses as the default', 'My morning routine'];
const OUTSIDE_IDEAS = ['People who are still using', 'The old bar / the old block', '"Just one" as an idea', 'Other people\'s chaos', 'Shame spirals at 2am'];

export default function BoundaryHoop({ onBack }: { onBack: () => void }) {
  const [items, setItems] = useState<HoopItem[]>(load);
  const [draft, setDraft] = useState('');
  const [side, setSide] = useState<'inside' | 'outside'>('inside');
  const [scriptFor, setScriptFor] = useState<string | null>(null);
  const [scriptDraft, setScriptDraft] = useState('');

  const inside = items.filter(i => i.side === 'inside');
  const outside = items.filter(i => i.side === 'outside');

  const add = (text: string, s: 'inside' | 'outside') => {
    const t = text.trim();
    if (!t) return;
    const next = [...items, { id: `hoop-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, text: t, side: s }];
    setItems(next); save(next); setDraft('');
  };

  const remove = (id: string) => {
    const next = items.filter(i => i.id !== id);
    setItems(next); save(next);
  };

  const saveScript = () => {
    if (!scriptFor) return;
    const next = items.map(i => i.id === scriptFor ? { ...i, script: scriptDraft.trim() || undefined } : i);
    setItems(next); save(next);
    setScriptFor(null); setScriptDraft('');
  };

  return (
    <div className="relative min-h-full p-4 md:p-6 pb-24" style={{ background: 'linear-gradient(180deg, #FDF2F8 0%, #F8FAFC 35%)' }}>
      <BigBackButton onBack={onBack} />

      <div className="max-w-xl mx-auto space-y-4 pt-2">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 text-pink-700">
            <CircleDot className="w-5 h-5" />
            <h1 className="text-xl font-black tracking-tight">The Hula-Hoop</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Picture a hula-hoop around you. You decide what comes inside it.
          </p>
        </div>

        {/* The hoop itself */}
        <div className="relative mx-auto" style={{ width: 280, height: 280 }}>
          <motion.div
            className="absolute rounded-full border-4 border-pink-300/70"
            style={{ inset: 40, boxShadow: '0 0 40px rgba(236,72,153,0.15), inset 0 0 30px rgba(236,72,153,0.08)' }}
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center px-16">
              <p className="text-[10px] font-black uppercase tracking-widest text-pink-400">Inside</p>
              <div className="flex flex-wrap gap-1 justify-center mt-1 max-h-24 overflow-hidden">
                {inside.slice(0, 5).map(i => (
                  <span key={i.id} className="px-2 py-0.5 bg-pink-50 border border-pink-200 rounded-full text-[9px] font-bold text-pink-700">{i.text}</span>
                ))}
                {inside.length === 0 && <span className="text-[9px] text-slate-300">empty — you choose</span>}
              </div>
            </div>
          </div>
          {/* Outside chips orbit the corners */}
          {outside.slice(0, 4).map((i, idx) => {
            const pos = [
              { top: 2, left: 8 }, { top: 2, right: 8 },
              { bottom: 2, left: 8 }, { bottom: 2, right: 8 },
            ][idx] as React.CSSProperties;
            return (
              <span key={i.id} className="absolute px-2 py-0.5 bg-slate-100 border border-slate-200 rounded-full text-[9px] font-bold text-slate-400 max-w-[110px] truncate" style={pos}>
                {i.text}
              </span>
            );
          })}
        </div>

        {/* Add to the hoop */}
        <GlassPanel className="p-4 space-y-2.5">
          <div className="flex gap-2">
            {(['inside', 'outside'] as const).map(s => (
              <button key={s} onClick={() => setSide(s)}
                className={`flex-1 py-2 rounded-xl text-[11px] font-black border-2 transition-all cursor-pointer ${
                  side === s
                    ? s === 'inside' ? 'bg-pink-600 border-pink-600 text-white' : 'bg-slate-700 border-slate-700 text-white'
                    : 'bg-white border-slate-200 text-slate-500'
                }`}>
                {s === 'inside' ? 'Comes inside' : 'Stays outside'}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input value={draft} onChange={e => setDraft(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && add(draft, side)}
              placeholder={side === 'inside' ? 'What do you let in?' : 'What stays out — no matter what?'}
              className="flex-1 p-2.5 bg-white/70 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-pink-400" />
            <button onClick={() => add(draft, side)}
              className="px-3 py-2 bg-pink-600 hover:bg-pink-500 text-white rounded-xl cursor-pointer transition-colors">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="flex flex-wrap gap-1">
            {(side === 'inside' ? INSIDE_IDEAS : OUTSIDE_IDEAS).map(idea => (
              <button key={idea} onClick={() => add(idea, side)}
                className="px-2 py-1 bg-slate-50 border border-dashed border-slate-200 rounded-full text-[9px] text-slate-400 hover:text-slate-600 cursor-pointer transition-colors">
                + {idea}
              </button>
            ))}
          </div>
        </GlassPanel>

        {/* The lists, with scripts for outside items */}
        {outside.length > 0 && (
          <GlassPanel className="p-4 space-y-2">
            <h3 className="text-xs font-black text-slate-700">Outside the hoop — and the words that hold the line</h3>
            {outside.map(i => (
              <div key={i.id} className="p-2.5 bg-white/70 border border-slate-100 rounded-xl space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold text-slate-700">{i.text}</span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button onClick={() => { setScriptFor(i.id); setScriptDraft(i.script || ''); }}
                      className="px-2 py-1 bg-pink-50 border border-pink-100 rounded-lg text-[9px] font-black text-pink-600 cursor-pointer hover:bg-pink-100 transition-colors">
                      {i.script ? 'Edit script' : '+ Script'}
                    </button>
                    <button onClick={() => remove(i.id)} className="text-slate-300 hover:text-slate-500 cursor-pointer" aria-label="Remove">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                {i.script && (
                  <p className="text-[10px] text-slate-500 italic flex items-start gap-1">
                    <Quote className="w-3 h-3 shrink-0 mt-0.5 text-pink-300" /> "{i.script}"
                  </p>
                )}
                <AnimatePresence>
                  {scriptFor === i.id && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="flex gap-2 pt-1">
                      <input value={scriptDraft} onChange={e => setScriptDraft(e.target.value)}
                        placeholder={'The exact sentence: "I\'m going to head out — early morning."'}
                        className="flex-1 p-2 bg-white border border-pink-200 rounded-lg text-[10px] focus:outline-none focus:ring-2 focus:ring-pink-400" />
                      <button onClick={saveScript}
                        className="px-2.5 py-1.5 bg-pink-600 text-white rounded-lg text-[10px] font-black cursor-pointer">Save</button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </GlassPanel>
        )}

        {inside.length > 0 && (
          <GlassPanel className="p-4 space-y-1.5">
            <h3 className="text-xs font-black text-slate-700">Inside the hoop</h3>
            <div className="flex flex-wrap gap-1.5">
              {inside.map(i => (
                <span key={i.id} className="inline-flex items-center gap-1 px-2.5 py-1 bg-pink-50 border border-pink-200 rounded-full text-[10px] font-bold text-pink-700">
                  {i.text}
                  <button onClick={() => remove(i.id)} className="text-pink-300 hover:text-pink-500 cursor-pointer" aria-label="Remove">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </GlassPanel>
        )}

        {items.length >= 4 && (
          <MateCard>
            A hoop with words on it is a boundary; a boundary without words is a wish. You've written
            {' '}{outside.filter(i => i.script).length} script{outside.filter(i => i.script).length === 1 ? '' : 's'} —
            rehearse them out loud once. The moment will come pre-decided.
          </MateCard>
        )}
      </div>
    </div>
  );
}
