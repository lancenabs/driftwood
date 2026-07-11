import React, { useState } from 'react';
import GameShell, { feedTogether, partnerName } from './GameShell';
import { activeCastaway } from '../../lib/castaways';

// ═════════════════════════════════════════════════════════════════════════════
//  THE LOAD TEST (deep water · roadmap #18). Rehearse the hard conversation in
//  the SHALLOWS before the open water: build a softened startup (Gottman — the
//  first three minutes predict the whole talk), test it against the reef rules,
//  say it out loud to the phone twice, THEN take it to the person. The scaffold
//  is the game; the conversation itself happens off-screen, where it belongs.
// ═════════════════════════════════════════════════════════════════════════════

const REEF = [
  { id: 'you', test: (s: string) => /\byou (always|never)\b/i.test(s), warn: '"you always / you never" — the reef. Try owning the feeling instead.' },
  { id: 'blame', test: (s: string) => /^\s*you\b/i.test(s), warn: 'It launches with "You…" — a harsh startup. Start from "I".' },
  { id: 'sarcasm', test: (s: string) => /\b(whatever|obviously|of course you)\b/i.test(s), warn: 'That word usually rides in with contempt. Leave it on the beach.' },
];

export default function LoadTest({ onClose }: { onClose: () => void }) {
  const me = activeCastaway();
  const partner = partnerName();
  const [phase, setPhase] = useState<'intro' | 'build' | 'rehearse' | 'live'>('intro');
  const [feel, setFeel] = useState('');
  const [about, setAbout] = useState('');
  const [need, setNeed] = useState('');
  const [saidCount, setSaidCount] = useState(0);

  const startup = `I feel ${feel.trim() || '…'} about ${about.trim() || '…'}, and what I need is ${need.trim() || '…'}.`;
  const warnings = REEF.filter(r => r.test(`${feel} ${about} ${need}`)).map(r => r.warn);
  const ready = feel.trim().length > 2 && about.trim().length > 2 && need.trim().length > 2 && warnings.length === 0;

  const rehearse = () => setPhase('rehearse');
  const saidIt = () => {
    const n = saidCount + 1;
    setSaidCount(n);
    if (n >= 2) {
      feedTogether('load_test', { rehearsed: true });
      setPhase('live');
    }
  };

  return (
    <GameShell emoji="🧗" title="The Load Test" subtitle="rehearse in the shallows · the first three minutes decide the swim"
      onClose={onClose} bg="linear-gradient(#14232E, #1E3440 55%, #2A4A50)">
      <div className="px-5 py-5 flex flex-col justify-center min-h-[70%]">
        {phase === 'intro' && (
          <div className="max-w-sm mx-auto w-full text-center flex flex-col gap-4">
            <div className="text-5xl">🧗🌊</div>
            <p className="text-white/90 text-sm font-bold">There's a conversation you've been carrying.</p>
            <p className="text-[11px] text-white/70 italic leading-relaxed">
              Don't take it into open water cold. Build the first sentence here — <b className="text-amber-300">I feel · about · I need</b> — test it against the reef, say it out loud twice to the phone. THEN go find {partner}. How a talk starts is how it ends; that's not a saying, it's the research.
            </p>
            <button onClick={() => setPhase('build')} data-testid="lt-begin" className="bg-gradient-to-r from-cyan-700 to-teal-600 text-white font-black rounded-xl py-3 text-sm">Build the startup →</button>
          </div>
        )}
        {phase === 'build' && (
          <div className="max-w-sm mx-auto w-full flex flex-col gap-3">
            <p className="text-center text-[10px] font-black uppercase tracking-widest text-cyan-300">{me.name || 'you'} — the softened startup</p>
            <div className="bg-white/95 rounded-2xl px-4 py-3 flex flex-col gap-2">
              <p className="text-[9px] font-black uppercase tracking-wide text-teal-700">I feel…</p>
              <input value={feel} onChange={e => setFeel(e.target.value)} data-testid="lt-feel" placeholder="worried · alone in it · stretched thin…"
                className="text-sm rounded-xl px-3 py-2.5 bg-slate-100 text-slate-800 outline-none" />
              <p className="text-[9px] font-black uppercase tracking-wide text-teal-700">about… (the situation, not the person)</p>
              <input value={about} onChange={e => setAbout(e.target.value)} data-testid="lt-about" placeholder="the money talk we keep not having…"
                className="text-sm rounded-xl px-3 py-2.5 bg-slate-100 text-slate-800 outline-none" />
              <p className="text-[9px] font-black uppercase tracking-wide text-teal-700">and what I need is…</p>
              <input value={need} onChange={e => setNeed(e.target.value)} data-testid="lt-need" placeholder="twenty minutes this week, no phones…"
                className="text-sm rounded-xl px-3 py-2.5 bg-slate-100 text-slate-800 outline-none" />
            </div>
            <div className="bg-black/25 rounded-2xl px-4 py-3">
              <p className="text-[9px] font-black uppercase tracking-wide text-white/50">it will sound like</p>
              <p className="text-white text-[13px] font-bold leading-relaxed">"{startup}"</p>
            </div>
            {warnings.map(w => (
              <p key={w} className="text-[11px] text-orange-300 font-bold bg-orange-900/30 rounded-xl px-3 py-2">⚠️ {w}</p>
            ))}
            <button onClick={rehearse} data-testid="lt-torehearse" disabled={!ready}
              className={`font-black rounded-xl py-3 text-sm ${ready ? 'bg-amber-500 text-white' : 'bg-white/20 text-white/50'}`}>
              {warnings.length ? 'Clear the reef first' : 'Into the shallows →'}
            </button>
          </div>
        )}
        {phase === 'rehearse' && (
          <div className="max-w-sm mx-auto w-full text-center flex flex-col gap-4">
            <div className="text-5xl">🗣🌊</div>
            <p className="text-cyan-300 text-[10px] font-black uppercase tracking-widest">the shallows — out loud, to the phone, like you mean it</p>
            <div className="bg-white/95 rounded-2xl px-4 py-4 text-[14px] font-bold text-slate-800 leading-relaxed">"{startup}"</div>
            <p className="text-[11px] text-white/70 italic">Twice. The second one always comes out truer — the first one is for the nerves.</p>
            <button onClick={saidIt} data-testid="lt-said" className="bg-amber-500 text-white font-black rounded-xl py-3 text-sm">
              I said it out loud {saidCount === 0 ? '(1 of 2)' : '(2 of 2)'} 🗣
            </button>
          </div>
        )}
        {phase === 'live' && (
          <div className="max-w-sm mx-auto w-full text-center flex flex-col gap-4">
            <div className="text-5xl">🧗✅</div>
            <p className="text-white text-lg font-black">The load holds. Time for open water.</p>
            <div className="bg-white/95 rounded-2xl px-4 py-3 text-left text-[12px] text-slate-700 flex flex-col gap-1.5">
              <p>🕐 Pick a calm hour — never mid-storm, never at the door.</p>
              <p>🗣 Lead with your rehearsed line, exactly as practiced.</p>
              <p>👂 Then STOP TALKING. Their first response is not the verdict.</p>
              <p>🌊 If it swamps: "I want to get this right — can we pause and come back at [time]?" A pause with a return time is not a retreat.</p>
            </div>
            <p className="text-[11px] text-white/70 italic">The phone's part is done. Go find {partner}. This part happens face to face — that's the whole point of the island.</p>
            <button onClick={onClose} className="bg-amber-500 text-white font-black rounded-xl py-3 text-sm">Back to the campfire</button>
          </div>
        )}
      </div>
    </GameShell>
  );
}
