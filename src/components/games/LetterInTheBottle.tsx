import React, { useState } from 'react';
import GameShell, { feedTogether } from './GameShell';
import { activeCastaway } from '../../lib/castaways';

// ═════════════════════════════════════════════════════════════════════════════
//  THE LETTER IN THE BOTTLE (deep water · roadmap #19). Write to this family
//  ONE YEAR from tonight — what you hope is true, what you want them to
//  remember about this exact season, the thing you're too shy to say at the
//  fire. Sealed means sealed: the bottle persists (driftwood_bottle_v1) with
//  an openAt date, and the app will not show the letter back until the tide
//  brings it in. Future-directed hope is one of the strongest predictors of a
//  family that makes it — this makes hope a physical object.
// ═════════════════════════════════════════════════════════════════════════════

const KEY = 'driftwood_bottle_v1';

interface Bottle { by: string; letter: string; sealedAt: string; openAt: string }

function readBottles(): Bottle[] {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; }
}

export default function LetterInTheBottle({ onClose }: { onClose: () => void }) {
  const me = activeCastaway();
  const bottles = readBottles();
  const now = new Date();
  const ready = bottles.filter(b => new Date(b.openAt) <= now);
  const waiting = bottles.filter(b => new Date(b.openAt) > now);
  const [phase, setPhase] = useState<'shore' | 'write' | 'sealed' | 'read'>('shore');
  const [letter, setLetter] = useState('');
  const [reading, setReading] = useState<Bottle | null>(null);

  const seal = () => {
    const t = letter.trim(); if (t.length < 10) return;
    const openAt = new Date(); openAt.setFullYear(openAt.getFullYear() + 1);
    const bottle: Bottle = { by: me.name || 'A castaway', letter: t, sealedAt: now.toISOString(), openAt: openAt.toISOString() };
    try { localStorage.setItem(KEY, JSON.stringify([...bottles, bottle].slice(-12))); } catch { /* hope was still written */ }
    feedTogether('letter_in_the_bottle', { sealed: true });
    setLetter('');
    setPhase('sealed');
  };

  const openBottle = (b: Bottle) => { setReading(b); setPhase('read'); };

  return (
    <GameShell emoji="🍾" title="The Letter in the Bottle" subtitle="write to this family, one year out · sealed means sealed"
      onClose={onClose} bg="linear-gradient(#16283E, #1E3A4A 55%, #2E4A50)">
      <div className="px-5 py-5 flex flex-col justify-center min-h-[70%]">
        {phase === 'shore' && (
          <div className="max-w-sm mx-auto w-full text-center flex flex-col gap-4">
            <div className="text-5xl">🍾🌊</div>
            <p className="text-white/90 text-sm font-bold">Write to this family, one year from tonight.</p>
            <p className="text-[11px] text-white/70 italic leading-relaxed">
              What do you hope is true by then? What should future-you remember about this exact season — the hard parts too? Say the thing you're too shy to say at the fire. The bottle seals for a full year; <b className="text-amber-300">nobody can read it early, including you.</b>
            </p>
            <button onClick={() => setPhase('write')} data-testid="lb-write" className="bg-gradient-to-r from-teal-600 to-cyan-700 text-white font-black rounded-xl py-3 text-sm">Write a letter →</button>
            {waiting.length > 0 && (
              <p className="text-[10px] text-white/50">🌊 {waiting.length} {waiting.length === 1 ? 'bottle rides' : 'bottles ride'} the tide — the first returns {new Date(waiting[0].openAt).toLocaleDateString()}</p>
            )}
            {ready.length > 0 && (
              <div className="flex flex-col gap-1.5">
                <p className="text-amber-300 text-[10px] font-black uppercase tracking-widest">the tide brought something in</p>
                {ready.map((b, i) => (
                  <button key={i} onClick={() => openBottle(b)} data-testid={`lb-open-${i}`}
                    className="bg-amber-400/95 rounded-xl px-3 py-2.5 text-[12px] font-black text-slate-900">
                    🍾 from {b.by} · sealed {new Date(b.sealedAt).toLocaleDateString()} — open it
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        {phase === 'write' && (
          <div className="max-w-sm mx-auto w-full flex flex-col gap-3">
            <p className="text-center text-[10px] font-black uppercase tracking-widest text-cyan-300">📜 {me.name || 'you'} → this family, {now.getFullYear() + 1}</p>
            <textarea value={letter} onChange={e => setLetter(e.target.value)} rows={7} autoFocus data-testid="lb-letter"
              placeholder={`Dear us, a year from now…`}
              className="text-sm rounded-2xl px-4 py-3 bg-white/95 text-slate-800 outline-none resize-none leading-relaxed" />
            <p className="text-[10px] text-white/50 italic text-center">it seals the moment you launch it — no edits, no early reads. that's what makes it true.</p>
            <button onClick={seal} data-testid="lb-seal" disabled={letter.trim().length < 10}
              className={`font-black rounded-xl py-3 text-sm ${letter.trim().length >= 10 ? 'bg-amber-500 text-white' : 'bg-white/20 text-white/50'}`}>
              Seal it · launch it 🌊
            </button>
          </div>
        )}
        {phase === 'sealed' && (
          <div className="max-w-sm mx-auto w-full text-center flex flex-col gap-4">
            <div className="text-5xl">🌊🍾</div>
            <p className="text-white text-lg font-black">The bottle is riding the tide.</p>
            <p className="text-white/80 text-sm leading-relaxed">
              It comes back {new Date(new Date().setFullYear(now.getFullYear() + 1)).toLocaleDateString()} — a year of Tuesdays from now. Whatever happens between here and there, tonight's hope is safe where the weather can't get it.
            </p>
            <div className="flex gap-2">
              <button onClick={() => setPhase('write')} className="flex-1 bg-white/15 border-2 border-white/25 text-white font-black rounded-xl py-2.5 text-sm">Another letter</button>
              <button onClick={onClose} className="flex-1 bg-amber-500 text-white font-black rounded-xl py-2.5 text-sm">Back to the campfire</button>
            </div>
          </div>
        )}
        {phase === 'read' && reading && (
          <div className="max-w-sm mx-auto w-full text-center flex flex-col gap-4">
            <div className="text-5xl">🍾✉️</div>
            <p className="text-amber-300 text-[10px] font-black uppercase tracking-widest">from {reading.by} · sealed {new Date(reading.sealedAt).toLocaleDateString()}</p>
            <div className="bg-white/95 rounded-2xl px-4 py-4 text-left text-[13px] text-slate-800 leading-relaxed whitespace-pre-wrap">{reading.letter}</div>
            <p className="text-[11px] text-white/70 italic">Read it out loud at the fire. Then talk about the distance between that night and this one.</p>
            <button onClick={onClose} className="bg-amber-500 text-white font-black rounded-xl py-3 text-sm">Back to the campfire</button>
          </div>
        )}
      </div>
    </GameShell>
  );
}
