import React, { useState } from 'react';
import GameShell, { feedTogether, partnerName } from './GameShell';
import { activeCastaway } from '../../lib/castaways';

// ═════════════════════════════════════════════════════════════════════════════
//  THE LOVE-LANGUAGE SORT (kindling · the five love languages, gently). Each
//  person ranks the ways they most feel loved; then you GUESS each other's top
//  one before revealing. The gap is the gift — most couples are fluent in a
//  language their partner doesn't speak. Feeds TOGETHER; no score, just the
//  reveal. Pass-the-phone.
// ═════════════════════════════════════════════════════════════════════════════

const LANGS = [
  { id: 'words', emoji: '💬', label: 'Words', blurb: 'being told, out loud, that you matter' },
  { id: 'time', emoji: '⏳', label: 'Time', blurb: 'undivided hours, just the two of you' },
  { id: 'help', emoji: '🛠', label: 'Help', blurb: 'acts of service — the load lightened without asking' },
  { id: 'touch', emoji: '🤝', label: 'Touch', blurb: 'a hand, a hug, sitting close' },
  { id: 'gifts', emoji: '🎁', label: 'Small Gifts', blurb: 'the "I saw this and thought of you"' },
];

type Phase = 'setup' | 'sortA' | 'guessB' | 'revealB' | 'sortB' | 'guessA' | 'revealA' | 'done';

export default function LoveLanguageSort({ onClose }: { onClose: () => void }) {
  const me = activeCastaway();
  const a = me.name || 'You', bName = partnerName();
  const [phase, setPhase] = useState<Phase>('setup');
  const [topA, setTopA] = useState<string | null>(null);
  const [topB, setTopB] = useState<string | null>(null);
  const [guessA, setGuessA] = useState<string | null>(null);
  const [guessB, setGuessB] = useState<string | null>(null);

  const lang = (id: string | null) => LANGS.find(l => l.id === id);

  const Picker = ({ who, onPick, title }: { who: string; onPick: (id: string) => void; title: string }) => (
    <div className="max-w-sm mx-auto w-full flex flex-col gap-2.5">
      <p className="text-[10px] font-black uppercase tracking-widest text-amber-300 text-center">📱 {who} · {title}</p>
      {LANGS.map(l => (
        <button key={l.id} onClick={() => onPick(l.id)}
          className="text-left bg-white/95 rounded-2xl px-4 py-3 hover:bg-amber-50 flex items-center gap-3">
          <span className="text-2xl">{l.emoji}</span>
          <span className="flex-1"><span className="font-black text-slate-800 text-sm">{l.label}</span>
            <span className="block text-[11px] text-slate-500">{l.blurb}</span></span>
        </button>
      ))}
    </div>
  );

  const RevealCard = ({ guessed, actual, who }: { guessed: string | null; actual: string | null; who: string }) => {
    const hit = guessed === actual;
    return (
      <div className="max-w-sm mx-auto w-full text-center flex flex-col gap-4">
        <p className="text-white font-black text-base">{who} most feels loved through…</p>
        <div className="bg-white/95 rounded-3xl p-5">
          <div className="text-4xl">{lang(actual)?.emoji}</div>
          <p className="font-black text-slate-800 text-lg mt-1">{lang(actual)?.label}</p>
          <p className="text-[11px] text-slate-500">{lang(actual)?.blurb}</p>
        </div>
        <p className={`text-[12px] font-bold ${hit ? 'text-emerald-300' : 'text-amber-200'}`}>
          {hit ? "You knew it 💛 — you already speak their language." : `You guessed ${lang(guessed)?.label}. Now you know — that gap is worth closing.`}
        </p>
      </div>
    );
  };

  return (
    <GameShell emoji="💛" title="The Love-Language Sort" subtitle="how each of you most feels loved"
      onClose={onClose} bg="linear-gradient(#3A2447, #4A2A50 60%, #4A3A2A)">
      <div className="px-5 py-5 flex flex-col justify-center min-h-[70%]">
        {phase === 'setup' && (
          <div className="max-w-sm mx-auto w-full text-center flex flex-col gap-4">
            <p className="text-white/90 text-sm font-bold">Which fills your tank the most?</p>
            <p className="text-[11px] text-white/70 italic leading-relaxed">
              Each of you picks the one way you most feel loved — then guesses the other's before it's revealed. Most people love in the language THEY speak; this shows you your partner's. No score — just the map.
            </p>
            <button onClick={() => setPhase('sortA')} className="bg-gradient-to-r from-fuchsia-500 to-amber-500 text-white font-black rounded-xl py-3 text-sm">Start · {a} picks first →</button>
          </div>
        )}
        {phase === 'sortA' && <Picker who={a} title="pick YOUR top one (privately)" onPick={id => { setTopA(id); setPhase('guessB'); }} />}
        {phase === 'guessB' && <Picker who={a} title={`now guess ${bName}'s top one`} onPick={id => { setGuessB(id); setPhase('revealB'); }} />}
        {phase === 'revealB' && (
          <div className="flex flex-col gap-4">
            <div className="max-w-sm mx-auto w-full text-center"><p className="text-white/80 text-sm">Pass to {bName} — reveal your real top one:</p></div>
            <Picker who={bName} title="tap YOUR true top one" onPick={id => { setTopB(id); setPhase('sortB'); }} />
          </div>
        )}
        {phase === 'sortB' && <RevealAndNext guessed={guessB} actual={topB} who={bName} onNext={() => setPhase('guessA')} />}
        {phase === 'guessA' && <Picker who={bName} title={`now guess ${a}'s top one`} onPick={id => { setGuessA(id); setPhase('revealA'); }} />}
        {phase === 'revealA' && <RevealAndNext guessed={guessA} actual={topA} who={a} onNext={() => { feedTogether('love_language_sort', { topA, topB }); setPhase('done'); }} nextLabel="See you both →" />}
        {phase === 'done' && (
          <div className="max-w-sm mx-auto w-full text-center flex flex-col gap-4">
            <div className="flex justify-center gap-4 text-4xl">{lang(topA)?.emoji}{lang(topB)?.emoji}</div>
            <p className="text-white text-base font-black">{a}: {lang(topA)?.label} · {bName}: {lang(topB)?.label}</p>
            <p className="text-white/80 text-sm leading-relaxed">
              {topA === topB
                ? 'You share a language — speak it often and loud.'
                : `You speak different languages — and now you know the words. This week, try loving ${bName} in ${lang(topB)?.label.toLowerCase()}, and ${a} in ${lang(topA)?.label.toLowerCase()}.`}
            </p>
            <button onClick={onClose} className="bg-amber-500 text-white font-black rounded-xl py-3 text-sm">Back to the campfire</button>
          </div>
        )}
      </div>
    </GameShell>
  );

  // local helper: reveal then continue
  function RevealAndNext({ guessed, actual, who, onNext, nextLabel = 'Next →' }: { guessed: string | null; actual: string | null; who: string; onNext: () => void; nextLabel?: string }) {
    return (
      <div className="flex flex-col gap-5">
        <RevealCard guessed={guessed} actual={actual} who={who} />
        <div className="max-w-sm mx-auto w-full"><button onClick={onNext} className="w-full bg-amber-500 text-white font-black rounded-xl py-2.5 text-sm">{nextLabel}</button></div>
      </div>
    );
  }
}
