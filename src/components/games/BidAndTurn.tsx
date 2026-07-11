import React, { useEffect, useRef, useState } from 'react';
import GameShell, { feedTogether } from './GameShell';

// ═════════════════════════════════════════════════════════════════════════════
//  BID & TURN (ice-breaker · Gottman's #1 predictor, as a solo reflex trainer for
//  the async week). Bids drift up like embers — "look at this," "long day," a
//  sigh aimed at the room. TAP to turn toward before it fades. It trains the
//  reflex you'll use on a real person: notice the bid, answer it. No fail state —
//  a missed bid just drifts on; caught ones feed the fire. Warm, not scored.
// ═════════════════════════════════════════════════════════════════════════════

const BIDS = [
  'look at this sunset 🌅', 'ugh, long day', 'did you see this?', 'I miss you',
  'watch this!', 'I had a weird dream', 'this song…', "I'm a little tired",
  'come here for a sec', 'guess what happened', 'my back hurts', 'remember this place?',
  'I made your coffee', "can't stop thinking about it", 'help me with this?', 'you okay?',
];

interface Ember { id: number; text: string; x: number; y: number; caught: boolean; born: number }

export default function BidAndTurn({ onClose }: { onClose: () => void }) {
  const [phase, setPhase] = useState<'setup' | 'play' | 'done'>('setup');
  const [embers, setEmbers] = useState<Ember[]>([]);
  const [caught, setCaught] = useState(0);
  const [missed, setMissed] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);
  const nextId = useRef(0);

  useEffect(() => {
    if (phase !== 'play') return;
    const spawn = setInterval(() => {
      setEmbers(es => [...es, { id: nextId.current++, text: BIDS[Math.floor(Math.random() * BIDS.length)], x: 12 + Math.random() * 66, y: 100, caught: false, born: Date.now() }]);
    }, 1400);
    const rise = setInterval(() => {
      setEmbers(es => es.map(e => ({ ...e, y: e.y - 1.4 })).filter(e => {
        if (e.y < -10 && !e.caught) { setMissed(m => m + 1); return false; }
        return e.y > -10;
      }));
    }, 50);
    const clock = setInterval(() => setTimeLeft(t => { if (t <= 1) { setPhase('done'); } return t - 1; }), 1000);
    return () => { clearInterval(spawn); clearInterval(rise); clearInterval(clock); };
  }, [phase]);

  useEffect(() => {
    if (phase === 'done') feedTogether('bid_and_turn', { caught, missed });
  }, [phase]); // eslint-disable-line

  const turnToward = (id: number) => {
    setEmbers(es => es.map(e => e.id === id ? { ...e, caught: true } : e));
    setCaught(c => c + 1);
    setTimeout(() => setEmbers(es => es.filter(e => e.id !== id)), 400);
  };

  return (
    <GameShell emoji="🫧" title="Bid & Turn" subtitle="notice the reach · turn toward it · train the muscle"
      onClose={onClose} bg="linear-gradient(#14243A, #22344E 60%, #3A2E22)">
      {phase === 'setup' && (
        <div className="px-6 py-8 max-w-sm mx-auto text-center flex flex-col gap-4 h-full justify-center">
          <div className="text-5xl">🫧🔥</div>
          <p className="text-white/90 text-sm font-bold">The smallest, most important skill.</p>
          <p className="text-[11px] text-white/70 italic leading-relaxed">
            The people you love make little bids all day — "look at this," a sigh, "I'm tired." Turning toward them (even a nod) is the #1 thing that keeps love alive. Here they drift up like embers; tap to turn toward each one before it fades. Play it this week to train the reflex — then use it on a real person.
          </p>
          <button onClick={() => setPhase('play')} className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black rounded-xl py-3 text-sm">Start · 45 seconds</button>
        </div>
      )}

      {phase === 'play' && (
        <div className="relative h-full overflow-hidden">
          <div className="absolute top-2 left-0 right-0 flex justify-center gap-4 z-10 text-[11px] font-black">
            <span className="text-amber-200 bg-black/30 rounded-full px-3 py-1">🔥 {caught} turned toward</span>
            <span className="text-white/70 bg-black/30 rounded-full px-3 py-1">{timeLeft}s</span>
          </div>
          {embers.map(e => (
            <button key={e.id} onClick={() => turnToward(e.id)}
              className="absolute rounded-full px-3 py-2 text-[12px] font-bold shadow-lg transition-all"
              style={{
                left: `${e.x}%`, bottom: `${100 - e.y}%`,
                background: e.caught ? 'linear-gradient(#FFA64D,#FF7A3D)' : 'rgba(255,255,255,0.94)',
                color: e.caught ? '#fff' : '#334', transform: e.caught ? 'scale(1.2)' : 'scale(1)',
                opacity: e.caught ? 0 : 1,
              }}>
              {e.caught ? '💛 turned' : e.text}
            </button>
          ))}
          <div className="absolute bottom-3 left-0 right-0 text-center text-[10px] text-white/50 italic">tap each bid to turn toward it</div>
        </div>
      )}

      {phase === 'done' && (
        <div className="px-6 py-8 max-w-sm mx-auto text-center flex flex-col gap-4 h-full justify-center">
          <div className="text-5xl">🔥</div>
          <p className="text-white text-lg font-black">You turned toward {caught}.</p>
          <p className="text-white/80 text-sm leading-relaxed">
            That's {caught} moments you'd have met a real bid instead of missing it. {missed > 0 && `${missed} drifted past — that's okay, they always do; the muscle is in the noticing.`} Play it a few times this week, and it starts happening on its own with the people you love.
          </p>
          <button onClick={() => { setCaught(0); setMissed(0); setEmbers([]); setTimeLeft(45); setPhase('play'); }} className="bg-white/15 border-2 border-white/25 text-white font-black rounded-xl py-2.5 text-sm">Again</button>
          <button onClick={onClose} className="bg-amber-500 text-white font-black rounded-xl py-2.5 text-sm">Back to the campfire</button>
        </div>
      )}
    </GameShell>
  );
}
