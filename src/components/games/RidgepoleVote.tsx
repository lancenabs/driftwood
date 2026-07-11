import React, { useState } from 'react';
import GameShell, { feedTogether } from './GameShell';
import { activeCastaway, readCrew } from '../../lib/castaways';

// ═════════════════════════════════════════════════════════════════════════════
//  THE RIDGEPOLE VOTE (steady flame · roadmap #12). A shelter needs one beam
//  everything else leans on. Each voice nominates family values; the ones that
//  MATCH become the ridgepole — values nobody voted against, discovered not
//  assigned. Family-values work (the therapy classic) disguised as carpentry.
//  The chosen beam persists (driftwood_ridgepole_v1) so the camp remembers
//  what it's built on.
// ═════════════════════════════════════════════════════════════════════════════

const TIMBER = [
  '🛡 We keep each other safe', '😂 We laugh, even on hard days', '🗣 We say the true thing kindly',
  '🤝 Nobody carries alone', '🌊 We repair after storms', '🎉 We celebrate small wins',
  '🚪 Everyone gets a door back in', '🧭 We try new things together', '🕯 We rest without earning it',
  '👂 We listen before we fix', '🌱 Mistakes grow us', '⏰ We show up on time for each other',
];

const KEY = 'driftwood_ridgepole_v1';

export default function RidgepoleVote({ onClose }: { onClose: () => void }) {
  const me = activeCastaway();
  const crew = readCrew();
  const voters = crew.length >= 2 ? crew.map(c => c.name) : [me.name || 'You', 'Family'];
  const [phase, setPhase] = useState<'intro' | 'vote' | 'reveal'>('intro');
  const [voterIdx, setVoterIdx] = useState(0);
  const [picks, setPicks] = useState<Record<string, string[]>>({});
  const [mine, setMine] = useState<string[]>([]);

  const voter = voters[voterIdx];

  const toggle = (v: string) =>
    setMine(m => m.includes(v) ? m.filter(x => x !== v) : m.length < 3 ? [...m, v] : m);

  const lockIn = () => {
    if (mine.length !== 3) return;
    const next = { ...picks, [voter]: mine };
    setPicks(next); setMine([]);
    if (voterIdx + 1 < voters.length) { setVoterIdx(i => i + 1); return; }
    // every voice is in — raise the beam
    const all: string[][] = Object.values(next);
    const shared = TIMBER.filter(t => all.every(list => list.includes(t)));
    const popular = TIMBER.filter(t => all.filter(list => list.includes(t)).length >= 2 && !shared.includes(t));
    try {
      localStorage.setItem(KEY, JSON.stringify({ shared, popular, voters: voters.length, at: new Date().toISOString() }));
    } catch { /* the beam is raised in the room */ }
    feedTogether('ridgepole_vote', { shared: shared.length, voters: voters.length });
    setPhase('reveal');
  };

  const result = (() => { try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch { return null; } })();

  return (
    <GameShell emoji="🏗" title="The Ridgepole Vote" subtitle="one beam everything leans on · found, not assigned"
      onClose={onClose} bg="linear-gradient(#2E2A20, #3E3828 60%, #52422A)">
      <div className="px-5 py-5 flex flex-col justify-center min-h-[70%]">
        {phase === 'intro' && (
          <div className="max-w-sm mx-auto w-full text-center flex flex-col gap-4">
            <div className="text-5xl">🏗🪵</div>
            <p className="text-white/90 text-sm font-bold">A shelter needs one beam everything else leans on.</p>
            <p className="text-[11px] text-white/70 italic leading-relaxed">
              Each of you secretly picks the <b className="text-amber-300">3 timbers</b> this family is really built on — not the ones that sound good, the ones that are true. The timbers you all pick become the ridgepole. You'll be surprised what matches.
            </p>
            <button onClick={() => setPhase('vote')} data-testid="rv-start" className="bg-gradient-to-r from-amber-600 to-yellow-600 text-white font-black rounded-xl py-3 text-sm">Pick the timbers →</button>
          </div>
        )}
        {phase === 'vote' && (
          <div className="max-w-sm mx-auto w-full flex flex-col gap-3">
            <p className="text-center text-[10px] font-black uppercase tracking-widest text-amber-300">📱 {voter} picks 3 — no peeking, pass after</p>
            <div className="flex flex-col gap-1.5 max-h-[380px] overflow-y-auto">
              {TIMBER.map(t => (
                <button key={t} onClick={() => toggle(t)}
                  className={`text-left rounded-xl px-3 py-2.5 text-[12.5px] font-bold transition-all ${mine.includes(t) ? 'bg-amber-400 text-slate-900' : 'bg-white/90 text-slate-700 hover:brightness-105'}`}>
                  {t}
                </button>
              ))}
            </div>
            <button onClick={lockIn} data-testid="rv-lock" disabled={mine.length !== 3}
              className={`font-black rounded-xl py-3 text-sm ${mine.length === 3 ? 'bg-amber-500 text-white' : 'bg-white/20 text-white/50'}`}>
              {mine.length}/3 · lock {voter}'s timbers
            </button>
          </div>
        )}
        {phase === 'reveal' && result && (
          <div className="max-w-sm mx-auto w-full text-center flex flex-col gap-4">
            <div className="text-5xl">🏗✨</div>
            {result.shared.length > 0 ? (
              <>
                <p className="text-amber-300 text-[10px] font-black uppercase tracking-widest">the ridgepole — every voice chose these</p>
                <div className="flex flex-col gap-1.5">
                  {result.shared.map((t: string) => (
                    <div key={t} className="bg-amber-400/95 rounded-xl px-3 py-2.5 text-[13px] font-black text-slate-900">{t}</div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-white text-sm font-bold">No perfect matches — that's honest data, not failure. Look at the near-misses below and talk about the gap.</p>
            )}
            {result.popular?.length > 0 && (
              <>
                <p className="text-white/60 text-[9px] font-black uppercase tracking-widest mt-1">leaning timbers (most, not all)</p>
                <div className="flex flex-col gap-1">
                  {result.popular.map((t: string) => (
                    <div key={t} className="bg-white/85 rounded-xl px-3 py-2 text-[12px] font-bold text-slate-600">{t}</div>
                  ))}
                </div>
              </>
            )}
            <p className="text-[11px] text-white/70 italic">The camp remembers its beam. When a hard week comes, this is what you rebuild from.</p>
            <button onClick={onClose} className="bg-amber-500 text-white font-black rounded-xl py-3 text-sm">Back to the campfire</button>
          </div>
        )}
      </div>
    </GameShell>
  );
}
