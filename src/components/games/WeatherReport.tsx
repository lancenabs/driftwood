import React, { useState } from 'react';
import GameShell, { feedTogether, partnerName } from './GameShell';
import { activeCastaway } from '../../lib/castaways';

// ═════════════════════════════════════════════════════════════════════════════
//  WEATHER REPORT (kindling · a shared inner-weather check-in). Each names their
//  day's inner weather, then guesses the other's. The reveal builds the habit of
//  ASKING before assuming — most storms start with a misread forecast. The shared
//  island sky reflects the crew's weather. Feeds TOGETHER. Pass-the-phone.
// ═════════════════════════════════════════════════════════════════════════════

const WEATHER = [
  { id: 'sunny', emoji: '☀️', label: 'Sunny', blurb: 'light, good, open' },
  { id: 'partly', emoji: '⛅', label: 'Partly cloudy', blurb: 'mostly okay, a few clouds' },
  { id: 'foggy', emoji: '🌫', label: 'Foggy', blurb: 'unclear, low, hard to see ahead' },
  { id: 'rainy', emoji: '🌧', label: 'Rainy', blurb: 'heavy, sad, tender' },
  { id: 'stormy', emoji: '⛈', label: 'Stormy', blurb: 'charged, tense, close to thunder' },
  { id: 'still', emoji: '🌊', label: 'Dead calm', blurb: 'flat, numb, running on empty' },
];

type Phase = 'setup' | 'meA' | 'guessB' | 'meB' | 'guessA' | 'done';

export default function WeatherReport({ onClose }: { onClose: () => void }) {
  const me = activeCastaway();
  const a = me.name || 'You', bName = partnerName();
  const [phase, setPhase] = useState<Phase>('setup');
  const [wA, setWA] = useState<string | null>(null);
  const [wB, setWB] = useState<string | null>(null);
  const [gA, setGA] = useState<string | null>(null);
  const [gB, setGB] = useState<string | null>(null);
  const w = (id: string | null) => WEATHER.find(x => x.id === id);

  const Grid = ({ who, prompt, onPick }: { who: string; prompt: string; onPick: (id: string) => void }) => (
    <div className="max-w-sm mx-auto w-full flex flex-col gap-3">
      <p className="text-[10px] font-black uppercase tracking-widest text-sky-200 text-center">📱 {who} · {prompt}</p>
      <div className="grid grid-cols-3 gap-2">
        {WEATHER.map(x => (
          <button key={x.id} onClick={() => onPick(x.id)} className="bg-white/92 rounded-2xl py-3 flex flex-col items-center hover:bg-sky-50">
            <span className="text-3xl">{x.emoji}</span>
            <span className="text-[10px] font-black text-slate-700 mt-1">{x.label}</span>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <GameShell emoji="🌦" title="Weather Report" subtitle="name your inner weather · ask, don't assume"
      onClose={onClose} bg="linear-gradient(#1A2E4A, #2A4468 60%, #3A4A5E)">
      <div className="px-5 py-5 flex flex-col justify-center min-h-[70%]">
        {phase === 'setup' && (
          <div className="max-w-sm mx-auto w-full text-center flex flex-col gap-4">
            <p className="text-white/90 text-sm font-bold">What's the weather inside you today?</p>
            <p className="text-[11px] text-white/70 italic leading-relaxed">
              Each of you names your inner weather, then guesses the other's. Most storms between people start with a misread forecast — "I thought you were mad" when it was really rain. This builds the habit of asking. The island sky will show the crew's weather.
            </p>
            <button onClick={() => setPhase('meA')} className="bg-gradient-to-r from-sky-500 to-amber-500 text-white font-black rounded-xl py-3 text-sm">Start · {a} reports first →</button>
          </div>
        )}
        {phase === 'meA' && <Grid who={a} prompt="your weather (privately)" onPick={id => { setWA(id); setPhase('guessB'); }} />}
        {phase === 'guessB' && <Grid who={a} prompt={`guess ${bName}'s weather`} onPick={id => { setGB(id); setPhase('meB'); }} />}
        {phase === 'meB' && (
          <div className="flex flex-col gap-3">
            <p className="text-center text-white/80 text-sm">Pass to {bName} — your real weather:</p>
            <Grid who={bName} prompt="your weather" onPick={id => { setWB(id); setPhase('guessA'); }} />
          </div>
        )}
        {phase === 'guessA' && <Grid who={bName} prompt={`guess ${a}'s weather`} onPick={id => { setGA(id); feedTogether('weather_report', { wA, wB }); setPhase('done'); }} />}
        {phase === 'done' && (
          <div className="max-w-sm mx-auto w-full text-center flex flex-col gap-4">
            <div className="flex justify-center items-center gap-6">
              <div><div className="text-4xl">{w(wA)?.emoji}</div><p className="text-[11px] font-black text-white mt-1">{a}</p><p className="text-[9px] text-white/60">{w(wA)?.blurb}</p></div>
              <div><div className="text-4xl">{w(wB)?.emoji}</div><p className="text-[11px] font-black text-white mt-1">{bName}</p><p className="text-[9px] text-white/60">{w(wB)?.blurb}</p></div>
            </div>
            <div className="text-[12px] text-sky-100 space-y-1">
              <p>{gB === wB ? `✓ ${a} read ${bName}'s sky right.` : `${a} guessed ${w(gB)?.label.toLowerCase()} — it was ${w(wB)?.label.toLowerCase()}. Worth asking about.`}</p>
              <p>{gA === wA ? `✓ ${bName} read ${a}'s sky right.` : `${bName} guessed ${w(gA)?.label.toLowerCase()} — it was ${w(wA)?.label.toLowerCase()}. Worth asking about.`}</p>
            </div>
            <p className="text-[11px] text-white/70 italic">Now you both know the real forecast. Sail accordingly — offer an umbrella, not an argument.</p>
            <button onClick={onClose} className="bg-amber-500 text-white font-black rounded-xl py-3 text-sm">Back to the campfire</button>
          </div>
        )}
      </div>
    </GameShell>
  );
}
