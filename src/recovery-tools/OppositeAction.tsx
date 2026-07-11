import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RefreshCcw, Check } from 'lucide-react';
import BigBackButton from '../lance/components/LANCEGame/BigBackButton';
import { GlassPanel } from '../lance/components/LANCEGame/ui/GlassKit';
import MateCard from './MateCard';

// ============================================================================
// OPPOSITE ACTION WHEEL — from the curriculum's DBT emotion-regulation list:
// "Opposite action — do the opposite of what the emotion urges."
// Pick the emotion → see what it's telling you to do → flip it → commit to
// one concrete opposite move. Completed flips land in the log.
// ============================================================================

interface FlipEntry {
  id: string;
  timestamp: string;
  emotion: string;
  committedAction: string;
  done: boolean;
}

const STORAGE_KEY = 'rehabit_flips_v1';

function load(): FlipEntry[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
}
function save(entries: FlipEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

const EMOTIONS = [
  {
    id: 'anger', label: 'Anger', emoji: '🔥',
    urge: 'Attack — say the cruel thing, slam the door, burn it down.',
    opposite: 'Be gently kind, or gently leave. Lower the voice, unclench the hands, take the long way around the argument.',
    examples: ['Speak softer than you feel', 'Step away kindly, not slamming', 'Do one small kind thing for the person'],
  },
  {
    id: 'sadness', label: 'Sadness', emoji: '🌧',
    urge: 'Withdraw — cancel, curl up, go dark.',
    opposite: 'Get active and get near people. Not performing happiness — just moving toward life instead of away.',
    examples: ['Say yes to the invite you were about to decline', 'Walk where people are', 'Call instead of scrolling'],
  },
  {
    id: 'fear', label: 'Fear / Anxiety', emoji: '😨',
    urge: 'Avoid — dodge the call, skip the meeting, put it off again.',
    opposite: 'Approach, in the smallest possible dose. Do the feared thing badly rather than avoid it perfectly.',
    examples: ['Make the call with a two-line script', 'Show up for ten minutes', 'Do step one only'],
  },
  {
    id: 'shame', label: 'Shame', emoji: '🫥',
    urge: 'Hide — keep the secret, skip the meeting, tell no one.',
    opposite: "Share it with someone safe. Shame runs on secrecy; it can't survive being said out loud to the right person.",
    examples: ['Tell your person the thing', 'Say it in group', 'Write it and read it aloud to someone'],
  },
  {
    id: 'guilt', label: 'Guilt (earned)', emoji: '⚖️',
    urge: 'Punish yourself privately and change nothing.',
    opposite: 'Repair. Apologize once, properly; fix what can be fixed; then stop paying interest on a settled debt.',
    examples: ['Make the one honest apology', 'Fix the fixable part today', 'Set a do-differently rule for next time'],
  },
  {
    id: 'boredom', label: 'Boredom / the F’its', emoji: '🌫',
    urge: "Chase a spike — 'forget it, let's make something happen.'",
    opposite: 'Choose an absorbing, slow-burn activity on purpose. Boredom is withdrawal from cheap dopamine — feed the real kind.',
    examples: ['One hour of a real hobby', 'Cook something with steps', 'The balancing activity you already picked'],
  },
];

type Phase = 'pick' | 'flip' | 'done';

export default function OppositeAction({ onBack }: { onBack: () => void }) {
  const [phase, setPhase] = useState<Phase>('pick');
  const [picked, setPicked] = useState<typeof EMOTIONS[number] | null>(null);
  const [committed, setCommitted] = useState('');
  const [entries, setEntries] = useState<FlipEntry[]>(load);

  const commit = () => {
    if (!picked || !committed.trim()) return;
    const entry: FlipEntry = {
      id: `flip-${Date.now()}`,
      timestamp: new Date().toISOString(),
      emotion: picked.label,
      committedAction: committed.trim(),
      done: false,
    };
    const next = [entry, ...entries];
    setEntries(next);
    save(next);
    setPhase('done');
  };

  const markDone = (id: string) => {
    const next = entries.map(e => e.id === id ? { ...e, done: true } : e);
    setEntries(next);
    save(next);
  };

  const flipsDone = entries.filter(e => e.done).length;

  return (
    <div className="relative min-h-full p-4 md:p-6 pb-24" style={{ background: 'linear-gradient(180deg, #FFF7ED 0%, #F8FAFC 35%)' }}>
      <BigBackButton onBack={onBack} />

      <div className="max-w-xl mx-auto space-y-4 pt-2">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 text-orange-700">
            <RefreshCcw className="w-5 h-5" />
            <h1 className="text-xl font-black tracking-tight">Opposite Action</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Every emotion comes with an urge. When the urge makes things worse — flip it.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {phase === 'pick' && (
            <motion.div key="pick" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
              <div className="grid grid-cols-2 gap-2.5">
                {EMOTIONS.map(e => (
                  <button key={e.id} onClick={() => { setPicked(e); setPhase('flip'); setCommitted(''); }}
                    className="p-4 bg-white border-2 border-slate-200 rounded-2xl text-left hover:border-orange-300 hover:bg-orange-50/40 transition-all cursor-pointer">
                    <span className="text-2xl">{e.emoji}</span>
                    <p className="text-sm font-black text-slate-800 mt-1">{e.label}</p>
                  </button>
                ))}
              </div>
              {entries.length > 0 && (
                <GlassPanel className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black text-slate-700">Committed flips</h3>
                    <span className="text-[10px] font-black text-orange-700 bg-orange-50 border border-orange-100 px-2 py-0.5 rounded-full">
                      {flipsDone} done
                    </span>
                  </div>
                  {entries.slice(0, 5).map(e => (
                    <div key={e.id} className="flex items-center justify-between gap-2 p-2 bg-white/60 rounded-lg border border-slate-100">
                      <span className={`text-[11px] ${e.done ? 'text-slate-400 line-through' : 'text-slate-600'}`}>
                        <span className="font-bold">{e.emotion}:</span> {e.committedAction}
                      </span>
                      {!e.done && (
                        <button onClick={() => markDone(e.id)}
                          className="shrink-0 px-2 py-1 bg-teal-700 text-white text-[9px] font-black rounded-lg cursor-pointer hover:bg-teal-600">
                          Did it
                        </button>
                      )}
                    </div>
                  ))}
                </GlassPanel>
              )}
            </motion.div>
          )}

          {phase === 'flip' && picked && (
            <motion.div key="flip" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="space-y-4">
              <div className="p-4 bg-white border-2 border-slate-200 rounded-2xl">
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">{picked.emoji} {picked.label} is telling you to:</p>
                <p className="text-sm text-slate-700 font-semibold">{picked.urge}</p>
              </div>
              <div className="flex justify-center">
                <motion.div animate={{ rotate: 180 }} transition={{ duration: 0.6, delay: 0.2 }}>
                  <RefreshCcw className="w-6 h-6 text-orange-500" />
                </motion.div>
              </div>
              <div className="p-4 bg-orange-50 border-2 border-orange-200 rounded-2xl">
                <p className="text-[10px] font-black uppercase tracking-wider text-orange-500 mb-1">The flip:</p>
                <p className="text-sm text-slate-800 font-semibold">{picked.opposite}</p>
                <div className="mt-2 space-y-1">
                  {picked.examples.map(ex => (
                    <button key={ex} onClick={() => setCommitted(ex)}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-[11px] font-semibold border transition-colors cursor-pointer ${
                        committed === ex ? 'bg-orange-600 border-orange-600 text-white' : 'bg-white/70 border-orange-100 text-slate-600 hover:bg-white'
                      }`}>
                      {ex}
                    </button>
                  ))}
                </div>
              </div>
              <GlassPanel className="p-4 space-y-2">
                <label className="text-xs font-black text-slate-700 block">Your one concrete flip (pick above or write your own):</label>
                <input value={committed} onChange={e => setCommitted(e.target.value)}
                  placeholder="Specific enough to know when it's done…"
                  className="w-full p-3 bg-white/70 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-orange-400" />
              </GlassPanel>
              <button onClick={commit} disabled={!committed.trim()}
                className="w-full py-3.5 bg-orange-600 hover:bg-orange-500 disabled:bg-slate-300 text-white font-black rounded-2xl text-sm shadow-lg cursor-pointer transition-colors">
                Commit the flip
              </button>
            </motion.div>
          )}

          {phase === 'done' && (
            <motion.div key="done" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
              <MateCard>
                Committed. Opposite action feels wrong on purpose — you're steering against a current,
                and the emotion will complain the whole time. Do it anyway; mark it done when it's done.
              </MateCard>
              <button onClick={() => setPhase('pick')}
                className="w-full py-3 bg-white border border-slate-200 text-slate-600 font-bold rounded-2xl text-xs cursor-pointer hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5">
                <Check className="w-3.5 h-3.5" /> Back to the wheel
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
