import React, { useState } from 'react';
import GameShell, { feedTogether } from './GameShell';
import { activeCastaway, readCrew } from '../../lib/castaways';

// ═════════════════════════════════════════════════════════════════════════════
//  THE REPAIR ROPE (steady/deep · milestone 23 as a craft-game). You braid the
//  rope you throw DURING a storm, not after — the exact phrases that reach each
//  person mid-fight. Braided in calm water, kept where a wave can't wash them
//  off (saved to driftwood_repair_rope_v1). Each member adds their line; the
//  rope is the family's, kept forever. Feeds TOGETHER.
// ═════════════════════════════════════════════════════════════════════════════

const STARTERS = [
  "I'm getting loud — I need a minute, I'm not leaving.",
  'Can we start over?',
  'You matter more than this argument.',
  "I'm scared, not mad.",
  'I hear you. Let me try again.',
  "I need a hug more than I need to be right.",
];

interface Line { who: string; text: string }
const KEY = 'driftwood_repair_rope_v1';

export default function RepairRope({ onClose }: { onClose: () => void }) {
  const me = activeCastaway();
  const crew = readCrew();
  const authors = crew.length ? crew.map(c => c.name) : [me.name || 'You', 'Partner'];
  const [rope, setRope] = useState<Line[]>(() => { try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; } });
  const [authorIdx, setAuthorIdx] = useState(0);
  const [text, setText] = useState('');
  const [phase, setPhase] = useState<'setup' | 'braid' | 'done'>('setup');

  const author = authors[authorIdx % authors.length];

  const addLine = () => {
    const t = text.trim(); if (t.length < 4) return;
    const next = [...rope, { who: author, text: t }];
    setRope(next);
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* the rope still holds in memory */ }
    setText(''); setAuthorIdx(i => i + 1);
  };

  const finish = () => { feedTogether('repair_rope', { lines: rope.length }); setPhase('done'); };

  return (
    <GameShell emoji="🪢" title="The Repair Rope" subtitle="braid it in calm water · throw it in the storm"
      onClose={onClose} bg="linear-gradient(#2A2440, #3A3450 60%, #4A3A2A)">
      <div className="px-5 py-5 flex flex-col justify-center min-h-[70%]">
        {phase === 'setup' && (
          <div className="max-w-sm mx-auto w-full text-center flex flex-col gap-4">
            <div className="text-5xl">🪢</div>
            <p className="text-white/90 text-sm font-bold">The rope you throw DURING the storm.</p>
            <p className="text-[11px] text-white/70 italic leading-relaxed">
              A repair line only works if it was braided before the wave. Each of you writes the exact words that reach YOU mid-fight — "I'm getting loud, I need a minute, I'm not leaving." The rope gets kept, so next storm you already have it in your hand.
            </p>
            <button onClick={() => setPhase('braid')} className="bg-gradient-to-r from-indigo-500 to-amber-500 text-white font-black rounded-xl py-3 text-sm">Start braiding →</button>
          </div>
        )}
        {phase === 'braid' && (
          <div className="max-w-sm mx-auto w-full flex flex-col gap-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-amber-300 text-center">📱 {author} · add your line</p>
            <textarea value={text} onChange={e => setText(e.target.value)} rows={2}
              placeholder={`${author}: the words that reach you mid-storm…`}
              className="text-sm rounded-xl px-3 py-2.5 bg-white/95 text-slate-800 outline-none resize-none" />
            <div className="flex gap-1.5 flex-wrap">
              {STARTERS.slice(0, 3).map(s => <button key={s} onClick={() => setText(s)} className="text-[10px] bg-white/15 text-white/80 rounded-full px-2.5 py-1 border border-white/20">"{s.slice(0, 22)}…"</button>)}
            </div>
            <div className="flex gap-2">
              <button onClick={addLine} data-testid="rr-add" className="flex-1 bg-amber-500 text-white font-black rounded-xl py-2.5 text-sm">🪢 Braid it in</button>
              {rope.length >= 1 && <button onClick={finish} data-testid="rr-finish" className="bg-amber-700 text-white font-black rounded-xl px-4 text-xs">Keep the rope 🏕</button>}
            </div>
            {rope.length > 0 && (
              <div className="flex flex-col gap-1.5 mt-1">
                <p className="text-[9px] font-black uppercase text-white/50 tracking-wide">the rope so far</p>
                {rope.map((l, i) => (
                  <div key={i} className="bg-white/90 rounded-xl px-3 py-2 text-[12px]">
                    <span className="font-black text-indigo-600">{l.who}:</span> <span className="text-slate-700">"{l.text}"</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {phase === 'done' && (
          <div className="max-w-sm mx-auto w-full text-center flex flex-col gap-4">
            <div className="text-5xl">🪢🔥</div>
            <p className="text-white text-lg font-black">{rope.length}-strand rope, kept.</p>
            <p className="text-white/80 text-sm leading-relaxed">Your repair lines are saved to the island — next storm, they're already in your hand. Braided in calm water, thrown in rough. That's seamanship.</p>
            <button onClick={onClose} className="bg-amber-500 text-white font-black rounded-xl py-3 text-sm">Back to the campfire</button>
          </div>
        )}
      </div>
    </GameShell>
  );
}
