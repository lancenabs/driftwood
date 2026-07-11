import React, { useState } from 'react';
import GameShell, { feedTogether, partnerName } from './GameShell';
import { activeCastaway } from '../../lib/castaways';

// ═════════════════════════════════════════════════════════════════════════════
//  THE APPRECIATION VOLLEY (ice-breaker · milestone 14 as a live game). The
//  Gottman finding wearing driftwood: turning toward beats grand gestures. Rally
//  SPECIFIC appreciations across the fire — "I saw the exact thing you did," not
//  "thanks for everything." Keep the volley aloft; the rally length warms the
//  fire. No winner — you're keeping ONE ball up, together.
// ═════════════════════════════════════════════════════════════════════════════

const VAGUE = /^(thanks?( for)?( everything| stuff| it all)?|for everything|you'?re (great|nice|good|the best)|everything|nothing|idk|i dunno)\.?$/i;
const NUDGES = [
  'Specific lands deeper — what EXACT thing did they do?',
  'Name the moment: "when you ___" beats "you\'re nice."',
  '"Thanks for everything" bounces. "Thanks for the coffee you left" lands.',
];

export default function AppreciationVolley({ onClose }: { onClose: () => void }) {
  const me = activeCastaway();
  const a = me.name || 'You', bName = partnerName();
  const [started, setStarted] = useState(false);
  const [serverIsA, setServerIsA] = useState(true);
  const [text, setText] = useState('');
  const [rally, setRally] = useState(0);
  const [log, setLog] = useState<{ from: string; text: string }[]>([]);
  const [nudge, setNudge] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const server = serverIsA ? a : bName;
  const logs = Math.floor(rally / 3);   // every 3 volleys = a log on the fire

  const lob = () => {
    const t = text.trim();
    if (!t) return;
    if (VAGUE.test(t) || t.length < 6) { setNudge(NUDGES[rally % NUDGES.length]); return; }
    setLog(l => [{ from: server, text: t }, ...l].slice(0, 6));
    setRally(r => r + 1); setText(''); setNudge(null); setServerIsA(s => !s);
  };

  const finish = () => { feedTogether('appreciation_volley', { rally, logs }); setDone(true); };

  return (
    <GameShell emoji="🏐" title="The Appreciation Volley" subtitle="keep it specific · keep it aloft · warm the fire"
      onClose={onClose} bg="linear-gradient(#22304A, #3A4A38 70%, #4A3A2A)">
      {/* the rally + fire */}
      <div className="flex flex-col items-center pt-3 shrink-0">
        <div className="text-3xl" style={{ filter: `drop-shadow(0 0 ${8 + logs * 3}px #FFA64D)` }}>🔥</div>
        <p className="text-[11px] font-black text-amber-200 mt-1">rally: {rally} · {logs} {logs === 1 ? 'log' : 'logs'} laid</p>
      </div>

      <div className="px-5 py-4 flex flex-col justify-center min-h-[60%]">
        {!started && (
          <div className="max-w-sm mx-auto w-full text-center flex flex-col gap-4">
            <p className="text-white/90 text-sm font-bold">Keep one ball in the air — together.</p>
            <p className="text-[11px] text-white/70 italic leading-relaxed">
              Take turns lobbing a SPECIFIC appreciation across the fire — the exact thing they did, not "thanks for everything." Every three volleys lays a log. There's no winner; you're keeping the same ball up. Vague ones bounce — the game will nudge you kindly.
            </p>
            <button onClick={() => setStarted(true)} className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black rounded-xl py-3 text-sm">Serve first · {a} →</button>
          </div>
        )}

        {started && !done && (
          <div className="max-w-sm mx-auto w-full flex flex-col gap-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-amber-300 text-center">📱 {server}'s turn to lob</p>
            <input value={text} onChange={e => setText(e.target.value)} onKeyDown={e => e.key === 'Enter' && lob()}
              placeholder={`${server}: "I saw you ___"`} autoFocus
              className="text-sm rounded-xl px-3 py-3 bg-white/95 text-slate-800 outline-none" />
            {nudge && <p className="text-[11px] text-amber-200 italic bg-white/10 rounded-xl px-3 py-2">💛 {nudge}</p>}
            <div className="flex gap-2">
              <button onClick={lob} data-testid="av-lob" className="flex-1 bg-amber-500 text-white font-black rounded-xl py-2.5 text-sm">Lob it across 🏐</button>
              {rally >= 3 && <button onClick={finish} data-testid="av-finish" className="bg-amber-700 text-white font-black rounded-xl px-4 text-xs">Done 🏕</button>}
            </div>
            <div className="flex flex-col gap-1.5 mt-1">
              {log.map((l, i) => (
                <div key={i} className="bg-white/90 rounded-xl px-3 py-2 text-[12px]" style={{ opacity: 1 - i * 0.13 }}>
                  <span className="font-black text-amber-600">{l.from}:</span> <span className="text-slate-700">{l.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {done && (
          <div className="max-w-sm mx-auto w-full text-center flex flex-col gap-4">
            <div className="text-5xl">🏐🔥</div>
            <p className="text-white text-lg font-black">A {rally}-volley rally.</p>
            <p className="text-white/80 text-sm">You kept {rally} specific appreciations aloft and laid {logs} {logs === 1 ? 'log' : 'logs'}. That's the turning-toward muscle — small, specific, daily. It's the whole science.</p>
            <button onClick={onClose} className="bg-amber-500 text-white font-black rounded-xl py-3 text-sm">Back to the shore</button>
          </div>
        )}
      </div>
    </GameShell>
  );
}
