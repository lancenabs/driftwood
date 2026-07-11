import React, { useMemo, useState } from 'react';
import GameShell, { feedTogether } from './GameShell';

// ═════════════════════════════════════════════════════════════════════════════
//  MEMORY MATCH (kindling · roadmap #10, the kid-magnet). Flip shells on the
//  sand; every matched pair is a MEMORY CATEGORY the finder retells out loud
//  ("a meal we all loved — go"). The board game is the excuse; the retelling is
//  the medicine — shared reminiscence is one of the strongest fast bonds a
//  family has. Co-op: the crew clears the beach together, no player-vs-player.
// ═════════════════════════════════════════════════════════════════════════════

const PAIRS = [
  { emoji: '🍝', prompt: 'a meal this family still talks about' },
  { emoji: '🚗', prompt: 'a car ride that became a story' },
  { emoji: '🎂', prompt: 'a birthday that surprised someone' },
  { emoji: '🌧', prompt: 'a plan the weather ruined (and what happened instead)' },
  { emoji: '🐟', prompt: 'a time something got lost — or caught' },
  { emoji: '🎶', prompt: 'a song that belongs to this family' },
  { emoji: '🛶', prompt: 'an adventure that almost went wrong' },
  { emoji: '😴', prompt: 'the sleepiest anyone has ever been' },
];

interface Shell { id: number; pair: number; emoji: string; up: boolean; gone: boolean }

function deal(): Shell[] {
  const picks = [...PAIRS].sort(() => Math.random() - 0.5).slice(0, 6);
  const cards = picks.flatMap((p, i) => [
    { id: i * 2, pair: i, emoji: p.emoji, up: false, gone: false },
    { id: i * 2 + 1, pair: i, emoji: p.emoji, up: false, gone: false },
  ]);
  return cards.sort(() => Math.random() - 0.5);
}

export default function MemoryMatch({ onClose }: { onClose: () => void }) {
  const [board, setBoard] = useState<Shell[]>(deal);
  const picked = useMemo(() => PAIRS.filter(p => board.some(s => s.emoji === p.emoji)), [board]);
  const [openIds, setOpenIds] = useState<number[]>([]);
  const [tell, setTell] = useState<string | null>(null);
  const [flips, setFlips] = useState(0);
  const matched = board.filter(s => s.gone).length / 2;
  const total = board.length / 2;

  const flip = (s: Shell) => {
    if (s.gone || s.up || openIds.length >= 2 || tell) return;
    const now = [...openIds, s.id];
    setBoard(b => b.map(x => x.id === s.id ? { ...x, up: true } : x));
    setOpenIds(now);
    setFlips(f => f + 1);
    if (now.length === 2) {
      const first = board.find(x => x.id === now[0])!;
      if (first.pair === s.pair) {
        setTimeout(() => {
          setBoard(b => b.map(x => x.pair === s.pair ? { ...x, gone: true, up: false } : x));
          setOpenIds([]);
          const p = picked.find(pp => pp.emoji === s.emoji);
          setTell(p ? p.prompt : null);
        }, 450);
      } else {
        setTimeout(() => {
          setBoard(b => b.map(x => (x.id === now[0] || x.id === now[1]) ? { ...x, up: false } : x));
          setOpenIds([]);
        }, 900);
      }
    }
  };

  const told = () => {
    setTell(null);
    if (matched === total) feedTogether('memory_match', { pairs: total, flips });
  };

  const again = () => { setBoard(deal()); setOpenIds([]); setTell(null); setFlips(0); };

  return (
    <GameShell emoji="🐚" title="Memory Match" subtitle="flip the shells together · every pair is a story you owe the fire"
      onClose={onClose} bg="linear-gradient(#1E3A4A, #2A4A5E 60%, #C9B08C)">
      <div className="px-5 py-5 flex flex-col justify-center min-h-[70%]">
        {tell ? (
          <div className="max-w-sm mx-auto w-full text-center flex flex-col gap-4">
            <div className="text-5xl">{board.length && '🐚✨'}</div>
            <p className="text-amber-300 text-[10px] font-black uppercase tracking-widest">a pair! whoever flipped it, tell it:</p>
            <p className="text-white text-lg font-black leading-snug">“{tell}”</p>
            <p className="text-[11px] text-white/70 italic">Out loud, to the circle — one minute, every detail you've got. The little ones can add the ending.</p>
            <button onClick={told} data-testid="mm-told" className="bg-amber-500 text-white font-black rounded-xl py-3 text-sm">
              {matched === total ? 'It was told 🏕' : 'It was told → keep flipping'}
            </button>
          </div>
        ) : matched === total ? (
          <div className="max-w-sm mx-auto w-full text-center flex flex-col gap-4">
            <div className="text-5xl">🏖✨</div>
            <p className="text-white text-lg font-black">{total} pairs · {total} stories retold.</p>
            <p className="text-white/80 text-sm leading-relaxed">The beach is clear and the fire heard everything. Shared remembering is the fastest warmth there is.</p>
            <div className="flex gap-2">
              <button onClick={again} className="flex-1 bg-white/15 border-2 border-white/25 text-white font-black rounded-xl py-2.5 text-sm">New beach</button>
              <button onClick={onClose} className="flex-1 bg-amber-500 text-white font-black rounded-xl py-2.5 text-sm">Back to the campfire</button>
            </div>
          </div>
        ) : (
          <div className="max-w-sm mx-auto w-full flex flex-col gap-3">
            <p className="text-center text-[10px] font-black uppercase tracking-widest text-amber-300">pass the phone each turn · {matched}/{total} pairs</p>
            <div className="grid grid-cols-4 gap-2">
              {board.map(s => (
                <button key={s.id} onClick={() => flip(s)} data-testid={`mm-shell-${s.id}`}
                  className={`aspect-square rounded-2xl text-3xl flex items-center justify-center transition-all ${
                    s.gone ? 'opacity-0 pointer-events-none' :
                    s.up ? 'bg-amber-100 scale-105' : 'bg-white/90 hover:brightness-105 active:scale-95'}`}>
                  {s.up ? s.emoji : '🐚'}
                </button>
              ))}
            </div>
            <p className="text-center text-[10px] text-white/60 italic">match a pair → the finder retells that memory to the circle</p>
          </div>
        )}
      </div>
    </GameShell>
  );
}
