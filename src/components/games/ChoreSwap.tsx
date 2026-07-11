import React, { useState } from 'react';
import GameShell, { feedTogether, partnerName } from './GameShell';
import { activeCastaway } from '../../lib/castaways';

// ═════════════════════════════════════════════════════════════════════════════
//  THE CHORE SWAP CHALLENGE (kindling · roadmap #9). The invisible-labor game:
//  each partner names one task the other never sees them carry, then they TRADE
//  for the week. The lantern lights when the OTHER person's task gets done —
//  you can only win by carrying their load. Gottman's admiration research in a
//  work glove: nothing rebuilds "I see you" faster than doing the unseen thing.
//  The swap persists (driftwood_chore_swap_v1) so the week can check itself off.
// ═════════════════════════════════════════════════════════════════════════════

const NUDGES = [
  'the one nobody claps for',
  'the thing that only gets noticed when it DOESN\'T happen',
  'the task you do before anyone wakes up',
  'the errand that eats your lunch break',
  'the thing you\'d most love a week off from',
];

interface Swap { a: string; aTask: string; b: string; bTask: string; aDone: boolean; bDone: boolean; at: string }
const KEY = 'driftwood_chore_swap_v1';

function readSwap(): Swap | null {
  try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch { return null; }
}

export default function ChoreSwap({ onClose }: { onClose: () => void }) {
  const me = activeCastaway();
  const partner = partnerName();
  const existing = readSwap();
  const [phase, setPhase] = useState<'intro' | 'name' | 'sealed' | 'week'>(existing ? 'week' : 'intro');
  const [swap, setSwap] = useState<Swap | null>(existing);
  const [myTask, setMyTask] = useState('');
  const [theirTask, setTheirTask] = useState('');
  const [nudge] = useState(NUDGES[Math.floor(Math.random() * NUDGES.length)]);

  const seal = () => {
    const a = myTask.trim(), b = theirTask.trim();
    if (a.length < 3 || b.length < 3) return;
    const s: Swap = { a: me.name || 'You', aTask: a, b: partner, bTask: b, aDone: false, bDone: false, at: new Date().toISOString() };
    try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* the handshake still happened */ }
    setSwap(s);
    feedTogether('chore_swap', { sealed: true });
    setPhase('sealed');
  };

  const mark = (side: 'aDone' | 'bDone') => {
    if (!swap || swap[side]) return;
    const s = { ...swap, [side]: true };
    try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* the lantern is lit in the room */ }
    setSwap(s);
    feedTogether('chore_swap', { lantern: side, bothDone: s.aDone && s.bDone });
  };

  const newWeek = () => {
    try { localStorage.removeItem(KEY); } catch { /* fresh anyway */ }
    setSwap(null); setMyTask(''); setTheirTask(''); setPhase('intro');
  };

  return (
    <GameShell emoji="🧤" title="The Chore Swap" subtitle="trade one invisible task · the lantern lights for THEIR load"
      onClose={onClose} bg="linear-gradient(#1F3A33, #2A4A3E 60%, #3E5A44)">
      <div className="px-5 py-5 flex flex-col justify-center min-h-[70%]">
        {phase === 'intro' && (
          <div className="max-w-sm mx-auto w-full text-center flex flex-col gap-4">
            <div className="text-5xl">🧤🔁</div>
            <p className="text-white/90 text-sm font-bold">Every camp runs on chores nobody sees.</p>
            <p className="text-[11px] text-white/70 italic leading-relaxed">
              Each of you names ONE invisible task you carry — {nudge}. Then you trade for the week. Here's the trick: your lantern only lights when you do <b className="text-amber-300">their</b> task. You can't win this one for yourself.
            </p>
            <button onClick={() => setPhase('name')} className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black rounded-xl py-3 text-sm">Name the invisible work →</button>
          </div>
        )}
        {phase === 'name' && (
          <div className="max-w-sm mx-auto w-full flex flex-col gap-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-300 text-center">📱 pass the phone as you go</p>
            <div className="bg-white/95 rounded-2xl px-4 py-3 flex flex-col gap-2">
              <p className="text-[9px] font-black uppercase tracking-wide text-emerald-600">{me.name || 'You'} — your invisible task</p>
              <input value={myTask} onChange={e => setMyTask(e.target.value)} data-testid="cs-mine"
                placeholder="e.g. packing the lunches, the bills, bath-time…"
                className="text-sm rounded-xl px-3 py-2.5 bg-slate-100 text-slate-800 outline-none" />
            </div>
            <div className="bg-white/95 rounded-2xl px-4 py-3 flex flex-col gap-2">
              <p className="text-[9px] font-black uppercase tracking-wide text-teal-600">{partner} — your invisible task</p>
              <input value={theirTask} onChange={e => setTheirTask(e.target.value)} data-testid="cs-theirs"
                placeholder="the one they never see you carry…"
                className="text-sm rounded-xl px-3 py-2.5 bg-slate-100 text-slate-800 outline-none" />
            </div>
            <button onClick={seal} data-testid="cs-seal" className="bg-amber-500 text-white font-black rounded-xl py-3 text-sm">Shake on the swap 🤝</button>
          </div>
        )}
        {phase === 'sealed' && swap && (
          <div className="max-w-sm mx-auto w-full text-center flex flex-col gap-4">
            <div className="text-5xl">🤝</div>
            <p className="text-white text-lg font-black">The swap is sealed.</p>
            <div className="bg-white/95 rounded-2xl px-4 py-3 text-left text-[12px] text-slate-700 flex flex-col gap-1.5">
              <p><b className="text-emerald-600">{swap.a}</b> carries: <b>{swap.bTask}</b></p>
              <p><b className="text-teal-600">{swap.b}</b> carries: <b>{swap.aTask}</b></p>
            </div>
            <p className="text-[11px] text-white/70 italic">Come back any night this week and light the lantern when the other's task is done. Both lanterns lit = the fire feels it.</p>
            <button onClick={() => setPhase('week')} className="bg-amber-500 text-white font-black rounded-xl py-3 text-sm">To the week →</button>
          </div>
        )}
        {phase === 'week' && swap && (
          <div className="max-w-sm mx-auto w-full flex flex-col gap-3">
            <p className="text-center text-white/90 text-sm font-bold">This week's swap</p>
            <button onClick={() => mark('aDone')} data-testid="cs-lantern-a" disabled={swap.aDone}
              className={`text-left rounded-2xl px-4 py-3.5 transition-all ${swap.aDone ? 'bg-amber-400/95' : 'bg-white/95 hover:brightness-105'}`}>
              <p className="text-[9px] font-black uppercase tracking-wide text-emerald-700">{swap.a} carried {swap.b}'s load</p>
              <p className="text-slate-800 font-black text-sm">{swap.aDone ? '🏮 ' : '🕯 '}{swap.bTask}</p>
              {!swap.aDone && <p className="text-[10px] text-slate-500 mt-0.5">tap when it's done — the lantern lights</p>}
            </button>
            <button onClick={() => mark('bDone')} data-testid="cs-lantern-b" disabled={swap.bDone}
              className={`text-left rounded-2xl px-4 py-3.5 transition-all ${swap.bDone ? 'bg-amber-400/95' : 'bg-white/95 hover:brightness-105'}`}>
              <p className="text-[9px] font-black uppercase tracking-wide text-teal-700">{swap.b} carried {swap.a}'s load</p>
              <p className="text-slate-800 font-black text-sm">{swap.bDone ? '🏮 ' : '🕯 '}{swap.aTask}</p>
              {!swap.bDone && <p className="text-[10px] text-slate-500 mt-0.5">tap when it's done — the lantern lights</p>}
            </button>
            {swap.aDone && swap.bDone && (
              <div className="text-center flex flex-col gap-3 mt-1">
                <p className="text-white text-sm font-black">🏮🏮 Both lanterns lit — you carried each other's week.</p>
                <p className="text-[11px] text-white/70 italic">That's what "I see you" looks like with its sleeves rolled up.</p>
              </div>
            )}
            <div className="flex gap-2 mt-1">
              <button onClick={newWeek} className="flex-1 bg-white/15 border-2 border-white/25 text-white font-black rounded-xl py-2.5 text-sm">New swap</button>
              <button onClick={onClose} className="flex-1 bg-amber-500 text-white font-black rounded-xl py-2.5 text-sm">Back to the campfire</button>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
}
