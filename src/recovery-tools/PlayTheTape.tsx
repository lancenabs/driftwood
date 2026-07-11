import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Film, ChevronRight, BookOpen } from 'lucide-react';
import BigBackButton from '../lance/components/LANCEGame/BigBackButton';
import { GlassPanel } from '../lance/components/LANCEGame/ui/GlassKit';
import MateCard from './MateCard';

// ============================================================================
// PLAY THE TAPE FORWARD — from Lance's curriculum, verbatim:
// "Have you played the tape forward — where does 'just one' actually lead?"
// The craving only ever shows the first scene. This tool makes you watch
// the whole movie — and then rewind and shoot the sober cut of the same night.
// Saved tapes become ammunition: the next craving meets a finished script.
// ============================================================================

interface TapeFrame {
  key: string;
  label: string;
  prompt: string;
}

const TAPE_FRAMES: TapeFrame[] = [
  { key: 'hour',     label: 'One hour in',       prompt: "Be honest — after the first one, what actually happens in the next hour? (Is it ever just one?)" },
  { key: 'tonight',  label: 'Tonight',           prompt: 'Where does the night actually end? Who are you with — and who are you avoiding texting back?' },
  { key: 'morning',  label: 'Tomorrow morning',  prompt: 'The alarm goes off. How does your body feel? What do you remember? What do you have to hide?' },
  { key: 'week',     label: 'Next week',         prompt: 'A week later — what did it cost? The money, the trust, the streak, the way you look at yourself.' },
];

const SOBER_FRAMES: TapeFrame[] = [
  { key: 'hour',     label: 'One hour in',       prompt: 'You rode it out instead. What are you doing an hour from now — water, a walk, a text to your person?' },
  { key: 'tonight',  label: 'Tonight',           prompt: 'How does the night end in this cut? Where do you fall asleep, and how?' },
  { key: 'morning',  label: 'Tomorrow morning',  prompt: 'The alarm goes off and there is nothing to piece together. How does that feel in your chest?' },
  { key: 'week',     label: 'Next week',         prompt: 'A week later, this night is part of your wake. What did staying the course buy you?' },
];

interface SavedTape {
  id: string;
  createdAt: string;
  thought: string;
  tape: Record<string, string>;
  soberTape: Record<string, string>;
}

const STORAGE_KEY = 'rehabit_tapes_v1';

function load(): SavedTape[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
}
function save(tapes: SavedTape[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tapes));
}

type Phase = 'thought' | 'forward' | 'rewind' | 'compare' | 'shelf';

export default function PlayTheTape({ onBack }: { onBack: () => void }) {
  const [phase, setPhase] = useState<Phase>('thought');
  const [thought, setThought] = useState('');
  const [tape, setTape] = useState<Record<string, string>>({});
  const [soberTape, setSoberTape] = useState<Record<string, string>>({});
  const [frameIdx, setFrameIdx] = useState(0);
  const [tapes, setTapes] = useState<SavedTape[]>(load);

  const frames = phase === 'forward' ? TAPE_FRAMES : SOBER_FRAMES;
  const current = frames[frameIdx];
  const record = phase === 'forward' ? tape : soberTape;
  const setRecord = phase === 'forward' ? setTape : setSoberTape;

  const advance = () => {
    if (frameIdx < frames.length - 1) {
      setFrameIdx(frameIdx + 1);
    } else if (phase === 'forward') {
      setPhase('rewind');
      setFrameIdx(0);
    } else {
      setPhase('compare');
    }
  };

  const saveTape = () => {
    const entry: SavedTape = {
      id: `tape-${Date.now()}`,
      createdAt: new Date().toISOString(),
      thought: thought.trim(),
      tape,
      soberTape,
    };
    const next = [entry, ...tapes];
    setTapes(next);
    save(next);
    setPhase('shelf');
    setThought('');
    setTape({});
    setSoberTape({});
    setFrameIdx(0);
  };

  return (
    <div className="relative min-h-full p-4 md:p-6 pb-24" style={{ background: 'linear-gradient(180deg, #FDF4FF 0%, #F8FAFC 35%)' }}>
      <BigBackButton onBack={onBack} />

      <div className="max-w-xl mx-auto space-y-4 pt-2">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 text-fuchsia-700">
            <Film className="w-5 h-5" />
            <h1 className="text-xl font-black tracking-tight">Play the Tape Forward</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            The craving only shows you the first scene. Watch the whole movie.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {phase === 'thought' && (
            <motion.div key="thought" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
              <GlassPanel className="p-4 space-y-3">
                <label className="text-xs font-black text-slate-700 block">What's the thought? Write it the way it actually sounds:</label>
                <input
                  value={thought}
                  onChange={e => setThought(e.target.value)}
                  placeholder={'"Just one, it\'s been a good week…"'}
                  className="w-full p-3 bg-white/70 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
                />
              </GlassPanel>
              <button
                onClick={() => { if (thought.trim()) { setPhase('forward'); setFrameIdx(0); } }}
                disabled={!thought.trim()}
                className="w-full py-3.5 bg-fuchsia-700 hover:bg-fuchsia-600 disabled:bg-slate-300 text-white font-black rounded-2xl text-sm shadow-lg cursor-pointer transition-colors">
                Press play ▸
              </button>
              {tapes.length > 0 && (
                <button onClick={() => setPhase('shelf')}
                  className="w-full py-2.5 bg-white border border-slate-200 text-slate-600 font-bold rounded-2xl text-xs cursor-pointer hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" /> The shelf — {tapes.length} finished tape{tapes.length === 1 ? '' : 's'}
                </button>
              )}
            </motion.div>
          )}

          {(phase === 'forward' || phase === 'rewind') && current && (
            <motion.div key={`${phase}-${current.key}`} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} className="space-y-4">
              {phase === 'rewind' && frameIdx === 0 && (
                <MateCard>That's the honest ending — you wrote it yourself. Now rewind to the same moment, same night… and shoot the sober cut.</MateCard>
              )}
              <div className="flex items-center gap-2">
                {frames.map((f, i) => (
                  <div key={f.key} className={`h-1.5 flex-1 rounded-full ${i <= frameIdx ? (phase === 'forward' ? 'bg-fuchsia-500' : 'bg-teal-500') : 'bg-slate-200'}`} />
                ))}
              </div>
              <GlassPanel className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-black uppercase tracking-wider ${phase === 'forward' ? 'text-fuchsia-600' : 'text-teal-600'}`}>
                    {phase === 'forward' ? '▸ The tape' : '▸ The sober cut'} — {current.label}
                  </span>
                </div>
                <p className="text-xs text-slate-600">{current.prompt}</p>
                <textarea
                  rows={3}
                  value={record[current.key] || ''}
                  onChange={e => setRecord(prev => ({ ...prev, [current.key]: e.target.value }))}
                  placeholder="Honest beats pretty…"
                  className="w-full p-3 bg-white/70 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
                />
              </GlassPanel>
              <button
                onClick={advance}
                disabled={!(record[current.key] || '').trim()}
                className={`w-full py-3.5 text-white font-black rounded-2xl text-sm shadow-lg cursor-pointer transition-colors disabled:bg-slate-300 flex items-center justify-center gap-1 ${
                  phase === 'forward' ? 'bg-fuchsia-700 hover:bg-fuchsia-600' : 'bg-teal-700 hover:bg-teal-600'
                }`}>
                {frameIdx < frames.length - 1 ? 'Next scene' : phase === 'forward' ? 'Watch the ending — then rewind' : 'Roll credits'}
                <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {phase === 'compare' && (
            <motion.div key="compare" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
              <MateCard>Same night. Two endings. You wrote both — so the next time this thought shows its first scene, you already know where each cut leads.</MateCard>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-wider text-fuchsia-600 text-center">The tape</p>
                  {TAPE_FRAMES.map(f => (
                    <div key={f.key} className="p-2.5 bg-fuchsia-50/70 border border-fuchsia-100 rounded-xl">
                      <p className="text-[9px] font-black text-fuchsia-400 uppercase">{f.label}</p>
                      <p className="text-[11px] text-slate-700">{tape[f.key]}</p>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-wider text-teal-600 text-center">The sober cut</p>
                  {SOBER_FRAMES.map(f => (
                    <div key={f.key} className="p-2.5 bg-teal-50/70 border border-teal-100 rounded-xl">
                      <p className="text-[9px] font-black text-teal-500 uppercase">{f.label}</p>
                      <p className="text-[11px] text-slate-700">{soberTape[f.key]}</p>
                    </div>
                  ))}
                </div>
              </div>
              <button onClick={saveTape}
                className="w-full py-3.5 bg-teal-700 hover:bg-teal-600 text-white font-black rounded-2xl text-sm shadow-lg cursor-pointer transition-colors">
                Save both cuts to the shelf
              </button>
            </motion.div>
          )}

          {phase === 'shelf' && (
            <motion.div key="shelf" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
              <MateCard>Every finished tape is ammunition. When the thought comes back, don't argue with it — just re-watch the ending you already wrote.</MateCard>
              {tapes.map(t => (
                <GlassPanel key={t.id} className="p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-black text-slate-800 italic">"{t.thought}"</p>
                    <span className="text-[9px] text-slate-400">{new Date(t.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <p className="p-2 bg-fuchsia-50/70 border border-fuchsia-100 rounded-lg text-slate-600">
                      <span className="font-black text-fuchsia-500">Ends:</span> {t.tape.week}
                    </p>
                    <p className="p-2 bg-teal-50/70 border border-teal-100 rounded-lg text-slate-600">
                      <span className="font-black text-teal-600">Or:</span> {t.soberTape.week}
                    </p>
                  </div>
                </GlassPanel>
              ))}
              <button onClick={() => setPhase('thought')}
                className="w-full py-3 bg-white border border-slate-200 text-slate-600 font-bold rounded-2xl text-xs cursor-pointer hover:bg-slate-50 transition-colors">
                New tape
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
