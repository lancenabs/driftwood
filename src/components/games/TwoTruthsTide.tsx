import React, { useState } from 'react';
import { appendEvent } from '../../lib/world';
import { activeCastaway, readCrew } from '../../lib/castaways';

// ═════════════════════════════════════════════════════════════════════════════
//  TWO TRUTHS & A TIDE — mini-game #2 (ice-breaker tier · the Fire Quiz pattern
//  cloned). Each person shares TWO true things and ONE false about their week;
//  the other guesses the lie. Every catch (or honest miss) lights a lantern on
//  the family dock — you're learning each other's week, which is the point.
//  No scorekeeping (the Undertow law); one shared lantern-count for the crew.
//  Finishing feeds TOGETHER, same as the Fire Quiz.
// ═════════════════════════════════════════════════════════════════════════════

type Phase = 'setup' | 'compose' | 'guess' | 'reveal' | 'done';

const PROMPTS = [
  'something that happened this week', 'a small win you had', 'a moment that annoyed you',
  'something you ate', 'a place you went', 'a thing you thought about', 'a person you talked to',
];

export default function TwoTruthsTide({ onClose }: { onClose: () => void }) {
  const me = activeCastaway();
  const crew = readCrew();
  const [names] = useState<[string, string]>([me.name || 'You', crew.find(c => c.slotId !== me.id)?.name || 'Partner']);
  const [phase, setPhase] = useState<Phase>('setup');
  const [composerIsA, setComposerIsA] = useState(true);
  const [statements, setStatements] = useState<string[]>(['', '', '']);
  const [lieIdx, setLieIdx] = useState(0);
  const [lanterns, setLanterns] = useState(0);
  const [round, setRound] = useState(1);

  const composer = composerIsA ? names[0] : names[1];
  const guesser = composerIsA ? names[1] : names[0];

  const reveal = (guessIdx: number) => {
    // catching the lie OR an honest reveal both light a lantern — you learned
    // two true things about their week either way
    setLanterns(l => l + (guessIdx === lieIdx ? 2 : 1));
    setPhase('reveal');
  };

  const nextRound = () => {
    if (round >= 4) { finish(); return; }
    setStatements(['', '', '']); setLieIdx(0);
    setComposerIsA(a => !a); setRound(r => r + 1); setPhase('compose');
  };

  const finish = () => {
    appendEvent(me.id, 'fire_quiz_played', { game: 'two_truths_tide', lanterns });
    if (lanterns >= 4) appendEvent(me.id, 'lantern_lit', { from: 'two_truths' });
    setPhase('done');
  };

  return (
    <div className="fixed inset-0 z-[70] flex flex-col" style={{ background: 'linear-gradient(#14243A, #1E3550 60%, #2A4A5E)' }}>
      <div className="flex items-center gap-2 px-3 py-2 bg-black/25">
        <span className="text-lg">🏮</span>
        <div className="flex-1">
          <p className="text-[12px] font-black text-white">Two Truths &amp; a Tide</p>
          <p className="text-[8px] text-white/70">learn each other's week · light the dock</p>
        </div>
        <button onClick={onClose} className="text-[10px] font-black uppercase rounded-full px-3 py-1.5 bg-white/85 text-slate-700">leave</button>
      </div>

      {/* the dock of lanterns — grows as you learn each other */}
      <div className="flex items-center justify-center gap-1 py-3 shrink-0 flex-wrap px-4">
        {Array.from({ length: Math.max(lanterns, 6) }).map((_, i) => (
          <span key={i} className="text-lg transition-all" style={{ filter: i < lanterns ? 'drop-shadow(0 0 6px rgba(255,196,110,0.9))' : 'grayscale(1) opacity(0.3)' }}>🏮</span>
        ))}
      </div>
      <p className="text-center text-[10px] font-black text-amber-200 shrink-0">{lanterns} lit · round {round} of 4</p>

      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col justify-center">
        {phase === 'setup' && (
          <div className="max-w-sm mx-auto w-full text-center flex flex-col gap-4">
            <p className="text-white/90 text-sm font-bold">Two truths, one tall tide.</p>
            <p className="text-[11px] text-white/70 italic leading-relaxed">
              Each of you shares two true things about your week and one that's made up. The other guesses the tide (the lie). You'll pass the phone. Every round lights the dock — because either way, you just learned two real things about each other's week.
            </p>
            <button onClick={() => setPhase('compose')} className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black rounded-xl py-3 text-sm">Start · {names[0]} goes first</button>
          </div>
        )}

        {phase === 'compose' && (
          <div className="max-w-sm mx-auto w-full flex flex-col gap-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-amber-300 text-center">📱 pass to {composer} — write privately</p>
            <p className="text-[11px] text-white/70 text-center">Two true, one false — {PROMPTS[Math.floor(Math.random() * PROMPTS.length)]}. Tap the one that's the tide (the lie).</p>
            {[0, 1, 2].map(i => (
              <div key={i} className="flex items-center gap-2">
                <button onClick={() => setLieIdx(i)} title="mark as the lie"
                  className={`w-8 h-8 rounded-full shrink-0 text-xs font-black ${lieIdx === i ? 'bg-orange-500 text-white' : 'bg-white/15 text-white/60'}`}>{lieIdx === i ? '🌊' : i + 1}</button>
                <input value={statements[i]} onChange={e => setStatements(s => s.map((x, j) => j === i ? e.target.value : x))}
                  placeholder={`statement ${i + 1}`} className="flex-1 text-sm rounded-xl px-3 py-2.5 bg-white/90 text-slate-700 outline-none" />
              </div>
            ))}
            <button disabled={statements.some(s => !s.trim())} onClick={() => setPhase('guess')}
              className="bg-amber-500 disabled:opacity-40 text-white font-black rounded-xl py-2.5 text-sm">Ready — pass to {guesser} →</button>
          </div>
        )}

        {phase === 'guess' && (
          <div className="max-w-sm mx-auto w-full flex flex-col gap-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-amber-300 text-center">📱 {guesser}, which is the tide?</p>
            {statements.map((s, i) => (
              <button key={i} onClick={() => reveal(i)}
                className="text-left bg-white/95 rounded-2xl px-4 py-3 text-slate-800 font-bold text-sm hover:bg-amber-50">
                <span className="text-amber-500 font-black mr-2">{i + 1}.</span>{s}
              </button>
            ))}
          </div>
        )}

        {phase === 'reveal' && (
          <div className="max-w-sm mx-auto w-full text-center flex flex-col gap-4">
            <p className="text-white text-base font-black">The tide was #{lieIdx + 1}:</p>
            <div className="bg-white/95 rounded-2xl px-4 py-3 text-slate-700 font-bold text-sm">"{statements[lieIdx]}"</div>
            <p className="text-[11px] text-amber-100/90 italic">The other two were true — now {guesser} knows two real things about {composer}'s week. That's the whole tide game.</p>
            <button onClick={nextRound} className="bg-amber-500 text-white font-black rounded-xl py-2.5 text-sm">{round >= 4 ? 'Carry the lanterns home →' : `Next — ${guesser} composes →`}</button>
          </div>
        )}

        {phase === 'done' && (
          <div className="max-w-sm mx-auto w-full text-center flex flex-col gap-4">
            <div className="text-5xl">🏮</div>
            <p className="text-white text-lg font-black">The dock is lit.</p>
            <p className="text-white/80 text-sm">{lanterns} lanterns — every one a true thing you learned about each other's week. The crew's warmer for it.</p>
            <button onClick={onClose} className="bg-amber-500 text-white font-black rounded-xl py-3 text-sm">Back to the campfire</button>
          </div>
        )}
      </div>
    </div>
  );
}
