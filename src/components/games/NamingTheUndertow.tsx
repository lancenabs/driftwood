import React, { useState } from 'react';
import GameShell, { feedTogether, partnerName } from './GameShell';
import { activeCastaway } from '../../lib/castaways';

// ═════════════════════════════════════════════════════════════════════════════
//  NAMING THE UNDERTOW (deep water · the Tier-4 CROWN · milestone 20 as a live
//  co-op game). The couple maps their cycle together on the current-chart: each
//  names their protective move, then the softer feeling UNDER it, and watches
//  the two moves feed each other in a circle — the undertow, drawn. Then they
//  NAME it (externalization: the cycle is the enemy, never the partner) so next
//  time one of them can say "it's got us again" instead of "you always."
//  EARNED, not given: opens at 18 logs of week-warmth (the Fire Quiz dosage
//  law). Persists driftwood_undertow_v1 — the chart hangs in the camp.
// ═════════════════════════════════════════════════════════════════════════════

const MOVES = [
  { id: 'pursue',  emoji: '🌊', label: 'I push harder — louder, more questions, follow them room to room' },
  { id: 'wall',    emoji: '🐚', label: 'I go quiet — shut down, one-word answers, wait for it to pass' },
  { id: 'fix',     emoji: '🔧', label: 'I jump to fixing — solutions before feelings, busy hands' },
  { id: 'leave',   emoji: '🚪', label: 'I leave — the room, the house, the conversation' },
  { id: 'score',   emoji: '🧾', label: 'I keep score — receipts, "and another thing," the whole list' },
  { id: 'joke',    emoji: '🎭', label: 'I make it a joke — deflect, change the channel, keep it light' },
];
const UNDERS = [
  { id: 'losing',  emoji: '🕳', label: "I'm afraid I'm losing you" },
  { id: 'enough',  emoji: '⚖️', label: "I'm afraid I'm not enough" },
  { id: 'matter',  emoji: '👻', label: "I'm afraid I don't matter here" },
  { id: 'trapped', emoji: '🕸', label: 'I feel cornered — like there is no move that works' },
  { id: 'failing', emoji: '🧯', label: "I'm afraid of failing the people I love" },
  { id: 'alone',   emoji: '🛶', label: "I'm afraid of ending up alone in this" },
];
const GATE = 18; // the Deep Water law — same sill as the Fire Quiz's deepest tier

const CARE =
  'This one goes under the surface — the moves you each make when it gets hard, and the softer thing underneath them. No blame lives here: the cycle is the enemy, never your partner. If tonight is not the night, close this and lay easier logs; the undertow will still be here when you are ready.';

export default function NamingTheUndertow({ onClose }: { onClose: () => void }) {
  const me = activeCastaway();
  const partner = partnerName();
  const names = [me.name || 'You', partner];
  let warmth = 0;
  try {
    const evs = JSON.parse(localStorage.getItem('driftwood_events_v1') || '[]');
    warmth = evs.filter((e: any) => e && e.action === 'fire_quiz_played').length;
  } catch { /* cold counts as cold */ }
  const open = warmth >= GATE;

  const [phase, setPhase] = useState<'care' | 'moves' | 'unders' | 'chart' | 'named'>('care');
  const [who, setWho] = useState(0);
  const [moves, setMoves] = useState<(typeof MOVES[0])[]>([]);
  const [unders, setUnders] = useState<(typeof UNDERS[0])[]>([]);
  const [undertowName, setUndertowName] = useState('');

  const pickMove = (m: typeof MOVES[0]) => {
    const next = [...moves, m]; setMoves(next);
    if (who === 0) { setWho(1); return; }
    setWho(0); setPhase('unders');
  };
  const pickUnder = (u: typeof UNDERS[0]) => {
    const next = [...unders, u]; setUnders(next);
    if (who === 0) { setWho(1); return; }
    setPhase('chart');
  };
  const seal = () => {
    const chart = {
      a: { name: names[0], move: moves[0]?.id, under: unders[0]?.id },
      b: { name: names[1], move: moves[1]?.id, under: unders[1]?.id },
      undertow: undertowName.trim() || 'the Undertow',
      at: new Date().toISOString(),
    };
    try { localStorage.setItem('driftwood_undertow_v1', JSON.stringify(chart)); } catch { /* named out loud is named */ }
    feedTogether('naming_the_undertow', { named: true });
    setPhase('named');
  };

  if (!open) {
    return (
      <GameShell emoji="🌀" title="Naming the Undertow" subtitle="deep water · earned, not given"
        onClose={onClose} bg="linear-gradient(#101D2E, #16283E 60%, #1E3A4A)">
        <div className="px-5 py-5 flex flex-col justify-center min-h-[70%]">
          <div className="max-w-sm mx-auto w-full text-center flex flex-col gap-4">
            <div className="text-5xl">🌀🔒</div>
            <p className="text-white text-sm font-black">This is the deepest water on the island.</p>
            <p className="text-[11px] text-white/70 italic leading-relaxed">
              Your fire has <b className="text-amber-300">{warmth} {warmth === 1 ? 'log' : 'logs'}</b>. The undertow opens at <b className="text-amber-300">{GATE}</b> — not as a prize, but because mapping your worst nights takes the safety your easier fires build first. Play the ice-breakers; the water will wait.
            </p>
            <button onClick={onClose} data-testid="ut-locked-back" className="bg-amber-500 text-white font-black rounded-xl py-3 text-sm">Back to the campfire</button>
          </div>
        </div>
      </GameShell>
    );
  }

  return (
    <GameShell emoji="🌀" title="Naming the Undertow" subtitle="map the cycle together · the cycle is the enemy, never each other"
      onClose={onClose} bg="linear-gradient(#101D2E, #16283E 60%, #1E3A4A)">
      <div className="px-5 py-5 flex flex-col justify-center min-h-[70%]">
        {phase === 'care' && (
          <div className="max-w-sm mx-auto w-full text-center flex flex-col gap-4">
            <div className="text-5xl">🌀</div>
            <p className="text-white/90 text-sm font-bold">Every couple has a current that grabs them both.</p>
            <p className="text-[11px] text-amber-100/90 italic leading-relaxed bg-white/10 rounded-2xl p-3 border border-white/15">{CARE}</p>
            <button onClick={() => setPhase('moves')} data-testid="ut-begin" className="bg-gradient-to-r from-cyan-700 to-slate-600 text-white font-black rounded-xl py-3 text-sm">We're ready — map it →</button>
          </div>
        )}
        {phase === 'moves' && (
          <div className="max-w-sm mx-auto w-full flex flex-col gap-3">
            <p className="text-center text-[10px] font-black uppercase tracking-widest text-cyan-300">📱 {names[who]} — when it gets bad, what does your body DO?</p>
            <div className="flex flex-col gap-1.5">
              {MOVES.map(m => (
                <button key={m.id} onClick={() => pickMove(m)} data-testid={`ut-move-${m.id}`}
                  className="text-left bg-white/90 hover:brightness-105 rounded-xl px-3 py-2.5 text-[12px] font-bold text-slate-700 flex items-center gap-2">
                  <span className="text-lg">{m.emoji}</span> {m.label}
                </button>
              ))}
            </div>
            <p className="text-center text-[10px] text-white/50 italic">no wrong answers — these are protections, not crimes</p>
          </div>
        )}
        {phase === 'unders' && (
          <div className="max-w-sm mx-auto w-full flex flex-col gap-3">
            <p className="text-center text-[10px] font-black uppercase tracking-widest text-amber-300">📱 {names[who]} — and UNDER that move, the softer true thing?</p>
            <div className="flex flex-col gap-1.5">
              {UNDERS.map(u => (
                <button key={u.id} onClick={() => pickUnder(u)} data-testid={`ut-under-${u.id}`}
                  className="text-left bg-white/90 hover:brightness-105 rounded-xl px-3 py-2.5 text-[12px] font-bold text-slate-700 flex items-center gap-2">
                  <span className="text-lg">{u.emoji}</span> {u.label}
                </button>
              ))}
            </div>
          </div>
        )}
        {phase === 'chart' && (
          <div className="max-w-sm mx-auto w-full text-center flex flex-col gap-4">
            <p className="text-cyan-300 text-[10px] font-black uppercase tracking-widest">the current-chart — read it out loud, slowly</p>
            <div className="bg-white/95 rounded-2xl p-4 text-left flex flex-col gap-2">
              <p className="text-[12px] text-slate-700"><b className="text-cyan-700">{names[0]}</b> {moves[0]?.emoji} <i>{moves[0]?.label.toLowerCase()}</i></p>
              <p className="text-[11px] text-slate-500 pl-4">…because {unders[0]?.emoji} <b>{unders[0]?.label.toLowerCase()}</b></p>
              <p className="text-center text-slate-400 text-xs">⤹ which makes ⤵</p>
              <p className="text-[12px] text-slate-700"><b className="text-amber-700">{names[1]}</b> {moves[1]?.emoji} <i>{moves[1]?.label.toLowerCase()}</i></p>
              <p className="text-[11px] text-slate-500 pl-4">…because {unders[1]?.emoji} <b>{unders[1]?.label.toLowerCase()}</b></p>
              <p className="text-center text-slate-400 text-xs">⤹ which makes {names[0]} {moves[0]?.emoji} again — the circle</p>
            </div>
            <p className="text-white/85 text-[12px] font-bold">That circle is not you two. It's a third thing that grabs you both. Name it — silly names have the most power.</p>
            <input value={undertowName} onChange={e => setUndertowName(e.target.value)} data-testid="ut-name"
              placeholder="e.g. The Spin Cycle · Gary · the Riptide…"
              className="text-sm rounded-xl px-3 py-2.5 bg-white/95 text-slate-800 outline-none text-center font-bold" />
            <button onClick={seal} data-testid="ut-seal" className="bg-amber-500 text-white font-black rounded-xl py-3 text-sm">Name it — hang the chart 🌀</button>
          </div>
        )}
        {phase === 'named' && (
          <div className="max-w-sm mx-auto w-full text-center flex flex-col gap-4">
            <div className="text-5xl">🌀📜</div>
            <p className="text-white text-lg font-black">"{undertowName.trim() || 'the Undertow'}" is on the chart.</p>
            <p className="text-white/80 text-sm leading-relaxed">
              Next time you feel the pull, either of you can say <b className="text-amber-300">"{(undertowName.trim() || 'the Undertow')}'s got us"</b> — four words that turn opponents back into crewmates. The chart hangs in your camp now. You mapped your worst weather together; that's the bravest sailing there is.
            </p>
            <button onClick={onClose} className="bg-amber-500 text-white font-black rounded-xl py-3 text-sm">Back to the campfire</button>
          </div>
        )}
      </div>
    </GameShell>
  );
}
