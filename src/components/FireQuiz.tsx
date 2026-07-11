import React, { useState } from 'react';
import { appendEvent } from '../lib/world';
import { readCrew, activeCastaway } from '../lib/castaways';
import { FIRE_TIERS, questionsFor, QuizTier, QuizQuestion, DEEP_WATER_CARE } from '../data/fireQuiz';

// ═════════════════════════════════════════════════════════════════════════════
//  THE FIRE QUIZ — pass-the-phone (the conch): two people rebuild a fire by
//  learning each other. Every match lays a log; ONE warmth meter climbs for the
//  couple, never a scoreboard between them (the Undertow law). Tiers gate on
//  warmth — embers first (safe), deep water last (earned). Finishing feeds the
//  real camp fire (TOGETHER) so the kids see it burning.
//
//  Works on one device tonight (pass-and-play). v2 rides the Gathering so each
//  phone answers its own — the events were shaped for it.
// ═════════════════════════════════════════════════════════════════════════════

type Phase = 'setup' | 'tier-intro' | 'ask' | 'reveal' | 'round-done' | 'finished';

export default function FireQuiz({ onClose }: { onClose: () => void }) {
  const crew = readCrew();
  const me = activeCastaway();
  const [audience, setAudience] = useState<'couple' | 'family'>('couple');
  const [names, setNames] = useState<[string, string]>([me.name || 'You', crew.find(c => c.slotId !== me.id)?.name || 'Partner']);
  const [phase, setPhase] = useState<Phase>('setup');
  const [tierIdx, setTierIdx] = useState(0);
  const [logs, setLogs] = useState(0);          // the shared warmth — logs on the fire
  const [askerIsA, setAskerIsA] = useState(true); // A guesses about B, then swap
  const [qList, setQList] = useState<QuizQuestion[]>([]);
  const [qIdx, setQIdx] = useState(0);

  const tier = FIRE_TIERS[tierIdx];
  const asker = askerIsA ? names[0] : names[1];
  const answerer = askerIsA ? names[1] : names[0];

  const startTier = (idx: number) => {
    const t = FIRE_TIERS[idx];
    const qs = questionsFor(t.id as QuizTier, audience).sort(() => Math.random() - 0.5).slice(0, 5);
    setQList(qs); setQIdx(0); setTierIdx(idx); setAskerIsA(true);
    setPhase('tier-intro');
  };

  const layLog = (matched: boolean) => {
    if (matched) setLogs(l => l + 1);
    // move to next question, alternating who asks (the conch passes)
    if (qIdx + 1 < qList.length) {
      setQIdx(qIdx + 1); setAskerIsA(a => !a); setPhase('ask');
    } else {
      setPhase('round-done');
    }
  };

  const finish = () => {
    // the shared fire grows for the WHOLE crew — TOGETHER is fed, lanterns lit
    appendEvent(me.id, 'fire_quiz_played', { audience, logs, tier: tier.id });
    if (logs >= 4) appendEvent(me.id, 'ember_earned', { from: 'fire_quiz' });
    setPhase('finished');
  };

  // the fire's height/color from logs laid
  const fireScale = 0.6 + Math.min(logs, 24) / 24 * 1.1;
  const flameColor = FIRE_TIERS[Math.min(tierIdx, 3)].logColor;
  const nextTier = FIRE_TIERS[tierIdx + 1];
  const canAdvance = nextTier && logs >= nextTier.minWarmthToUnlock;

  return (
    <div className="fixed inset-0 z-[70] flex flex-col" style={{ background: 'linear-gradient(#1E2A44, #33415E 55%, #4A3A2A)' }}>
      {/* header */}
      <div className="flex items-center gap-2 px-3 py-2 bg-black/25">
        <span className="text-lg">🔥</span>
        <div className="flex-1">
          <p className="text-[12px] font-black text-white">The Fire Quiz</p>
          <p className="text-[8px] text-white/70">learn each other · lay a log · beat the cold together</p>
        </div>
        <button onClick={onClose} className="text-[10px] font-black uppercase rounded-full px-3 py-1.5 bg-white/85 text-slate-700">leave the fire</button>
      </div>

      {/* THE FIRE — grows with every log; always on screen */}
      <div className="flex flex-col items-center pt-4 pb-2 shrink-0">
        <div style={{ transform: `scale(${fireScale})`, transformOrigin: 'bottom center', filter: `drop-shadow(0 0 ${10 + logs * 2}px ${flameColor})` }} className="text-4xl leading-none transition-transform duration-700">🔥</div>
        <div className="flex gap-0.5 -mt-1">{Array.from({ length: Math.min(logs, 8) }).map((_, i) => <span key={i} className="text-[10px]">🪵</span>)}</div>
        <p className="text-[10px] font-black text-amber-200 mt-1">{logs} {logs === 1 ? 'log' : 'logs'} on the fire · {tier.label}</p>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-6 flex flex-col justify-center">
        {/* ── SETUP ── */}
        {phase === 'setup' && (
          <div className="max-w-sm mx-auto w-full flex flex-col gap-4 text-center">
            <p className="text-white/90 text-sm font-bold">Who's building the fire tonight?</p>
            <div className="flex gap-2 justify-center">
              {(['couple', 'family'] as const).map(a => (
                <button key={a} onClick={() => setAudience(a)}
                  className={`text-xs font-black uppercase rounded-full px-4 py-2 border-2 ${audience === a ? 'bg-amber-500 text-white border-amber-500' : 'bg-white/10 text-white/80 border-white/25'}`}>
                  {a === 'couple' ? '💑 A couple' : '👨‍👩‍👦 A family pair'}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              {[0, 1].map(i => (
                <input key={i} value={names[i]} onChange={e => setNames(n => (i === 0 ? [e.target.value, n[1]] : [n[0], e.target.value]))}
                  placeholder={i === 0 ? 'First name' : 'Their name'}
                  className="flex-1 text-center text-sm font-bold rounded-xl px-3 py-2.5 bg-white/90 text-slate-700 outline-none" />
              ))}
            </div>
            <p className="text-[10px] text-white/60 italic leading-relaxed">
              You'll pass the phone back and forth. One of you guesses something about the other, then they reveal. Every time you're close, a log goes on the fire — and nobody's keeping score against anybody. You're both against the cold.
            </p>
            <button onClick={() => startTier(0)} className="mt-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black rounded-xl py-3 text-sm">Light the first ember →</button>
          </div>
        )}

        {/* ── TIER INTRO ── */}
        {phase === 'tier-intro' && (
          <div className="max-w-sm mx-auto w-full text-center flex flex-col gap-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-amber-300">{tier.label}</p>
            <p className="text-white text-sm font-bold">{tier.blurb}</p>
            {tier.id === 'deep' && (
              <p className="text-[11px] text-amber-100/90 italic leading-relaxed bg-white/10 rounded-2xl p-3 border border-white/15">{DEEP_WATER_CARE}</p>
            )}
            <button onClick={() => setPhase('ask')} className="mt-2 bg-amber-500 text-white font-black rounded-xl py-2.5 text-sm">Begin — {qList.length} questions</button>
          </div>
        )}

        {/* ── ASK ── */}
        {phase === 'ask' && qList[qIdx] && (
          <div className="max-w-sm mx-auto w-full text-center flex flex-col gap-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-amber-300">📱 pass the phone to {asker}</p>
            <div className="bg-white/95 rounded-3xl p-5 shadow-lg">
              <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wide mb-2">{asker}, guess about {answerer}:</p>
              <p className="text-slate-800 font-black text-base leading-snug">{qList[qIdx].prompt}</p>
              {qList[qIdx].hint && <p className="text-[10px] text-slate-400 italic mt-2">{qList[qIdx].hint}</p>}
            </div>
            <p className="text-[11px] text-white/70">Say your guess out loud, then tap to see what {answerer} says.</p>
            <button data-testid="fq-reveal" onClick={() => setPhase('reveal')} className="bg-amber-500 text-white font-black rounded-xl py-2.5 text-sm">Reveal {answerer}'s answer →</button>
          </div>
        )}

        {/* ── REVEAL ── */}
        {phase === 'reveal' && qList[qIdx] && (
          <div className="max-w-sm mx-auto w-full text-center flex flex-col gap-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-amber-300">📱 {answerer}'s turn to answer</p>
            <div className="bg-white/95 rounded-3xl p-5 shadow-lg">
              <p className="text-slate-800 font-black text-base leading-snug">{qList[qIdx].prompt}</p>
              <p className="text-[11px] text-slate-500 mt-3">{answerer}, say your real answer. Did {asker}'s guess come close?</p>
            </div>
            <div className="flex gap-2">
              <button data-testid="fq-laylog" onClick={() => layLog(true)} className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black rounded-xl py-3 text-sm">🪵 Close! Lay a log</button>
              <button onClick={() => layLog(false)} className="flex-1 bg-white/15 border-2 border-white/25 text-white/85 font-black rounded-xl py-3 text-sm">Not quite — next</button>
            </div>
            <p className="text-[10px] text-white/55 italic">Even a miss is a gift — now you know something new. That's the whole game.</p>
          </div>
        )}

        {/* ── ROUND DONE ── */}
        {phase === 'round-done' && (
          <div className="max-w-sm mx-auto w-full text-center flex flex-col gap-4">
            <p className="text-white text-lg font-black">The {tier.label} round is done 🔥</p>
            <p className="text-white/80 text-sm">Your fire has {logs} {logs === 1 ? 'log' : 'logs'} on it now.</p>
            {canAdvance ? (
              <button onClick={() => startTier(tierIdx + 1)} className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black rounded-xl py-3 text-sm">
                Feed it deeper → {nextTier.label}
              </button>
            ) : nextTier ? (
              <p className="text-[11px] text-white/70 italic bg-white/10 rounded-2xl p-3">
                {nextTier.label} opens when the fire is warmer ({nextTier.minWarmthToUnlock} logs). Play another round, or carry this fire home to the family.
              </p>
            ) : (
              <p className="text-[11px] text-amber-100 italic">You reached the deepest water together. That's rare, and it counts.</p>
            )}
            <div className="flex gap-2">
              <button onClick={() => startTier(tierIdx)} className="flex-1 bg-white/15 border-2 border-white/25 text-white font-black rounded-xl py-2.5 text-xs">Another {tier.label} round</button>
              <button data-testid="fq-finish" onClick={finish} className="flex-1 bg-amber-600 text-white font-black rounded-xl py-2.5 text-xs">🏕 Carry it to the family →</button>
            </div>
          </div>
        )}

        {/* ── FINISHED ── */}
        {phase === 'finished' && (
          <div className="max-w-sm mx-auto w-full text-center flex flex-col gap-4">
            <div className="text-5xl">🏕️</div>
            <p className="text-white text-lg font-black">The fire is burning at the family camp.</p>
            <p className="text-white/80 text-sm leading-relaxed">
              You laid {logs} {logs === 1 ? 'log' : 'logs'} tonight — every one a thing you learned about each other. It's warming the whole crew now; anyone who opens the shore will see it lit.
            </p>
            <p className="text-[11px] text-amber-100/80 italic">TOGETHER rose. That's not a score — it's the temperature of the camp.</p>
            <button onClick={onClose} className="bg-amber-500 text-white font-black rounded-xl py-3 text-sm">Back to the campfire</button>
          </div>
        )}
      </div>
    </div>
  );
}
