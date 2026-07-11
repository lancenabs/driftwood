import React, { useState } from 'react';
import GameShell, { feedTogether } from './GameShell';
import { activeCastaway, readCrew } from '../../lib/castaways';

// ═════════════════════════════════════════════════════════════════════════════
//  TWO HUTS OR ONE (steady flame · roadmap #15). Everyone places their sleeping
//  spot on the camp map — near the fire, in the treeline, on the far dune. The
//  honest closeness chart: no right answer, no shame in distance (Hollow sleeps
//  in the shell and is still crew). The talk after is the game: "what would
//  move your bedroll one step closer?" Placements persist per night
//  (driftwood_two_huts_v1) so the camp can watch itself drift and return.
// ═════════════════════════════════════════════════════════════════════════════

const SPOTS = [
  { id: 'fire',    label: 'right at the fire',   x: 50, y: 58, emoji: '🔥' },
  { id: 'lean',    label: 'the lean-to beside it', x: 34, y: 48, emoji: '🛖' },
  { id: 'tent',    label: 'the tent',             x: 66, y: 44, emoji: '⛺' },
  { id: 'logs',    label: 'by the driftwood logs', x: 24, y: 70, emoji: '🪵' },
  { id: 'tree',    label: 'the treeline',         x: 76, y: 22, emoji: '🌴' },
  { id: 'dune',    label: 'the far dune',         x: 16, y: 24, emoji: '🏜' },
  { id: 'boat',    label: 'in the rowboat',       x: 82, y: 72, emoji: '🛶' },
];

const KEY = 'driftwood_two_huts_v1';

export default function TwoHuts({ onClose }: { onClose: () => void }) {
  const me = activeCastaway();
  const crew = readCrew();
  const sleepers = crew.length >= 2 ? crew.map(c => c.name) : [me.name || 'You', 'Family'];
  const [phase, setPhase] = useState<'intro' | 'place' | 'chart'>('intro');
  const [idx, setIdx] = useState(0);
  const [placed, setPlaced] = useState<Record<string, string>>({});

  const sleeper = sleepers[idx];

  const place = (spotId: string) => {
    const next = { ...placed, [sleeper]: spotId };
    setPlaced(next);
    if (idx + 1 < sleepers.length) { setIdx(i => i + 1); return; }
    try {
      const nights = JSON.parse(localStorage.getItem(KEY) || '[]');
      nights.push({ placed: next, at: new Date().toISOString() });
      localStorage.setItem(KEY, JSON.stringify(nights.slice(-20)));
    } catch { /* tonight still counted */ }
    const spots = new Set(Object.values(next));
    feedTogether('two_huts', { sleepers: sleepers.length, spots: spots.size });
    setPhase('chart');
  };

  const spotOf = (id: string) => SPOTS.find(s => s.id === id)!;
  const byName: [string, string][] = Object.entries(placed);
  const distinct = new Set(Object.values(placed)).size;

  return (
    <GameShell emoji="🏕" title="Two Huts or One" subtitle="place your bedroll honestly · distance is data, not failure"
      onClose={onClose} bg="linear-gradient(#1A2740, #23364E 55%, #2E4A50)">
      <div className="px-5 py-5 flex flex-col justify-center min-h-[70%]">
        {phase === 'intro' && (
          <div className="max-w-sm mx-auto w-full text-center flex flex-col gap-4">
            <div className="text-5xl">🏕🌙</div>
            <p className="text-white/90 text-sm font-bold">Where does everyone actually sleep tonight?</p>
            <p className="text-[11px] text-white/70 italic leading-relaxed">
              Not where you SHOULD — where you honestly would, tonight, as things really are. Close is not winning and far is not failing; the shell is still the crew. The one question after: <b className="text-amber-300">"what would move your bedroll one step closer?"</b>
            </p>
            <button onClick={() => setPhase('place')} data-testid="th-start" className="bg-gradient-to-r from-indigo-500 to-cyan-600 text-white font-black rounded-xl py-3 text-sm">Place the bedrolls →</button>
          </div>
        )}
        {phase === 'place' && (
          <div className="max-w-sm mx-auto w-full flex flex-col gap-3">
            <p className="text-center text-[10px] font-black uppercase tracking-widest text-cyan-300">📱 {sleeper} — honestly, tonight</p>
            <div className="flex flex-col gap-1.5">
              {SPOTS.map(s => (
                <button key={s.id} onClick={() => place(s.id)} data-testid={`th-spot-${s.id}`}
                  className="text-left bg-white/90 hover:brightness-105 rounded-xl px-3 py-2.5 text-[12.5px] font-bold text-slate-700 flex items-center gap-2">
                  <span className="text-lg">{s.emoji}</span> {s.label}
                </button>
              ))}
            </div>
          </div>
        )}
        {phase === 'chart' && (
          <div className="max-w-sm mx-auto w-full text-center flex flex-col gap-4">
            <p className="text-cyan-300 text-[10px] font-black uppercase tracking-widest">tonight's camp, honestly</p>
            <div className="relative w-full rounded-2xl overflow-hidden" style={{ paddingBottom: '75%', background: 'radial-gradient(circle at 50% 60%, #3E3320 0%, #23364E 55%, #1A2740 100%)' }}>
              {SPOTS.map(s => (
                <span key={s.id} className="absolute text-xl" style={{ left: `${s.x}%`, top: `${s.y}%`, transform: 'translate(-50%,-50%)', opacity: 0.55 }}>{s.emoji}</span>
              ))}
              {byName.map(([name, spotId], i) => {
                const s = spotOf(spotId);
                const jitter = (i % 3 - 1) * 7;
                return (
                  <span key={name} className="absolute bg-amber-400 text-slate-900 text-[9px] font-black rounded-full px-2 py-0.5 shadow"
                    style={{ left: `${s.x + jitter}%`, top: `${s.y + 9}%`, transform: 'translate(-50%,-50%)' }}>
                    {name}
                  </span>
                );
              })}
            </div>
            <p className="text-white text-sm font-bold">
              {distinct === 1 ? 'One hut. The whole crew at one fire tonight.' : `${distinct} sleeping spots — that's tonight's true map.`}
            </p>
            <p className="text-[11px] text-white/70 italic">Now the only question, each in turn: what would move your bedroll one step closer? (One step. Not a promise. A step.)</p>
            <button onClick={onClose} data-testid="th-close" className="bg-amber-500 text-white font-black rounded-xl py-3 text-sm">Back to the campfire</button>
          </div>
        )}
      </div>
    </GameShell>
  );
}
