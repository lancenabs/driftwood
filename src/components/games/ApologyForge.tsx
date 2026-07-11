import React, { useState } from 'react';
import GameShell, { feedTogether } from './GameShell';
import { activeCastaway } from '../../lib/castaways';

// ═════════════════════════════════════════════════════════════════════════════
//  THE APOLOGY FORGE (deep water · roadmap #20). Walk one real repair through
//  the Collier's kintsugi forge: name the crack honestly, strike the FOUR
//  HAMMERS (I did · it cost you · no "but" · what I'll do differently), then
//  the gold — asking what would help, and accepting that the other person's
//  weather is theirs. A real apology is FORGED, not found. The mended seam
//  persists (driftwood_apology_forge_v1): the kintsugi law — the repair is
//  allowed to show, that's how you know it held.
// ═════════════════════════════════════════════════════════════════════════════

const HAMMERS = [
  { id: 'did',   emoji: '🔨', label: 'THE FIRST HAMMER — what I did', hint: 'Plain words, active voice. "I ___." Not "mistakes were made," not "you felt."', placeholder: 'I …' },
  { id: 'cost',  emoji: '🔨', label: 'THE SECOND HAMMER — what it cost you', hint: 'Their side of it. What it was like to be them when it landed.', placeholder: 'It cost you …' },
  { id: 'nobut', emoji: '🔨', label: 'THE THIRD HAMMER — the "but" stays in the fire', hint: 'Write the excuse you WANT to make… this one gets burned, not spoken. The forge takes it.', placeholder: 'The but I am not going to say: …' },
  { id: 'next',  emoji: '🔨', label: 'THE FOURTH HAMMER — what changes', hint: 'One concrete thing, small enough to actually do. Not "I\'ll be better."', placeholder: 'Next time I will …' },
];

const KEY = 'driftwood_apology_forge_v1';

export default function ApologyForge({ onClose }: { onClose: () => void }) {
  const me = activeCastaway();
  const [phase, setPhase] = useState<'intro' | 'forge' | 'gold'>('intro');
  const [hammerIdx, setHammerIdx] = useState(0);
  const [strikes, setStrikes] = useState<string[]>([]);
  const [text, setText] = useState('');

  const hammer = HAMMERS[hammerIdx];

  const strike = () => {
    const t = text.trim(); if (t.length < 3) return;
    const next = [...strikes, t];
    setStrikes(next); setText('');
    if (hammerIdx + 1 < HAMMERS.length) { setHammerIdx(i => i + 1); return; }
    // the seam: hammers 1, 2, 4 speak; hammer 3 (the but) burns in the forge
    try {
      const seams = JSON.parse(localStorage.getItem(KEY) || '[]');
      seams.push({ by: me.name || 'A castaway', did: next[0], cost: next[1], change: next[3], at: new Date().toISOString() });
      localStorage.setItem(KEY, JSON.stringify(seams.slice(-15)));
    } catch { /* the words still got forged */ }
    feedTogether('apology_forge', { forged: true });
    setPhase('gold');
  };

  return (
    <GameShell emoji="⚒️" title="The Apology Forge" subtitle="a real apology is forged, not found · the seam is allowed to show"
      onClose={onClose} bg="linear-gradient(#241A16, #38241C 55%, #52341E)">
      <div className="px-5 py-5 flex flex-col justify-center min-h-[70%]">
        {phase === 'intro' && (
          <div className="max-w-sm mx-auto w-full text-center flex flex-col gap-4">
            <div className="text-5xl">⚒️🏺</div>
            <p className="text-white/90 text-sm font-bold">Bring one real crack to the Collier's forge.</p>
            <p className="text-[11px] text-white/70 italic leading-relaxed">
              Something you actually did, to someone actually here. The forge has four hammers, struck in order — and the third one burns instead of speaks: <b className="text-amber-300">your "but" goes in the fire, not the apology.</b> What comes out is kintsugi: mended with gold, seam showing. That's how you know it held.
            </p>
            <button onClick={() => setPhase('forge')} data-testid="af-begin" className="bg-gradient-to-r from-orange-700 to-amber-600 text-white font-black rounded-xl py-3 text-sm">Light the forge →</button>
          </div>
        )}
        {phase === 'forge' && (
          <div className="max-w-sm mx-auto w-full flex flex-col gap-3">
            <div className="flex justify-center gap-1">
              {HAMMERS.map((h, i) => (
                <span key={h.id} className={`text-lg ${i < hammerIdx ? '' : i === hammerIdx ? 'animate-pulse' : 'opacity-25'}`}>🔨</span>
              ))}
            </div>
            <div className="bg-white/95 rounded-2xl px-4 py-3">
              <p className="text-[9px] font-black uppercase tracking-wide text-orange-700">{hammer.label}</p>
              <p className="text-[10.5px] text-slate-500 italic mt-1">{hammer.hint}</p>
            </div>
            <textarea value={text} onChange={e => setText(e.target.value)} rows={3} autoFocus data-testid="af-text"
              placeholder={hammer.placeholder}
              className="text-sm rounded-xl px-3 py-2.5 bg-white/95 text-slate-800 outline-none resize-none" />
            <button onClick={strike} data-testid="af-strike" disabled={text.trim().length < 3}
              className={`font-black rounded-xl py-3 text-sm ${text.trim().length >= 3 ? 'bg-amber-500 text-white' : 'bg-white/20 text-white/50'}`}>
              {hammer.id === 'nobut' ? 'Burn it 🔥' : 'Strike ⚒️'}
            </button>
          </div>
        )}
        {phase === 'gold' && (
          <div className="max-w-sm mx-auto w-full text-center flex flex-col gap-4">
            <div className="text-5xl">🏺✨</div>
            <p className="text-amber-300 text-[10px] font-black uppercase tracking-widest">the seam, mended with gold — now say it to their face</p>
            <div className="bg-white/95 rounded-2xl px-4 py-4 text-left text-[13px] text-slate-800 leading-relaxed flex flex-col gap-2">
              <p>{strikes[0]}</p>
              <p>{strikes[1]}</p>
              <p className="text-slate-400 text-[11px] italic">(the "but" burned in the forge — it does not ride along)</p>
              <p>{strikes[3]}</p>
              <p className="font-bold text-orange-800">What would help? …and it's okay if the answer is "time."</p>
            </div>
            <p className="text-[11px] text-white/70 italic">Their weather after you say it belongs to them — a forged apology is a gift, not a purchase. The seam stays in your camp's keeping.</p>
            <button onClick={onClose} className="bg-amber-500 text-white font-black rounded-xl py-3 text-sm">Back to the campfire</button>
          </div>
        )}
      </div>
    </GameShell>
  );
}
