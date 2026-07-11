import React, { useState } from 'react';
import FireQuiz from '../FireQuiz';
import TwoTruthsTide from './TwoTruthsTide';
import AppreciationVolley from './AppreciationVolley';
import LoveLanguageSort from './LoveLanguageSort';

// ═════════════════════════════════════════════════════════════════════════════
//  CAMPFIRE GAMES — the home for the reconnection mini-games (the 30-40, growing).
//  Each game is a self-contained overlay that feeds the fire/needs/lanterns via
//  the event law. New games register in GAMES below — that's the whole wiring.
//  Tiers (ice-breaker → deep) shown as chips; nothing is gated except by the
//  game's own warmth (the clinical dose lives inside each game).
// ═════════════════════════════════════════════════════════════════════════════

type GameDef = {
  id: string; name: string; emoji: string; tier: string; blurb: string;
  render: (onClose: () => void) => React.ReactNode;
};

const GAMES: GameDef[] = [
  { id: 'fire_quiz', name: 'The Fire Quiz', emoji: '🔥', tier: 'all tiers',
    blurb: 'Learn each other — every close guess lays a log on your shared fire.',
    render: (onClose) => <FireQuiz onClose={onClose} /> },
  { id: 'two_truths', name: 'Two Truths & a Tide', emoji: '🏮', tier: 'ice-breaker',
    blurb: "Two true things, one tall tide — guess the lie, light the dock.",
    render: (onClose) => <TwoTruthsTide onClose={onClose} /> },
  { id: 'appreciation_volley', name: 'The Appreciation Volley', emoji: '🏐', tier: 'ice-breaker',
    blurb: 'Rally specific appreciations across the fire — keep the ball up together.',
    render: (onClose) => <AppreciationVolley onClose={onClose} /> },
  { id: 'love_language_sort', name: 'The Love-Language Sort', emoji: '💛', tier: 'kindling',
    blurb: 'How each of you most feels loved — guess, reveal, close the gap.',
    render: (onClose) => <LoveLanguageSort onClose={onClose} /> },
  // → the roadmap (THE_RECONNECTION_LOOP.md) fills the rest: Bid & Turn, Weather
  //   Report, the Repair Rope, Naming the Undertow, … each a file + a line here.
];

export default function GamesMenu({ onClose }: { onClose: () => void }) {
  const [active, setActive] = useState<GameDef | null>(null);
  if (active) return <>{active.render(() => setActive(null))}</>;

  return (
    <div className="fixed inset-0 z-[65] flex flex-col" style={{ background: 'linear-gradient(#1E2A44, #33415E)' }}>
      <div className="flex items-center gap-2 px-3 py-2.5 bg-black/25">
        <span className="text-lg">🏕️</span>
        <div className="flex-1">
          <p className="text-[12px] font-black text-white">Campfire Games</p>
          <p className="text-[8px] text-white/70">play together · warm the family · beat the cold, never each other</p>
        </div>
        <button onClick={onClose} className="text-[10px] font-black uppercase rounded-full px-3 py-1.5 bg-white/85 text-slate-700">back</button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 max-w-md mx-auto w-full">
        {GAMES.map(g => (
          <button key={g.id} data-testid={`game-${g.id}`} onClick={() => setActive(g)}
            className="text-left bg-white/95 rounded-2xl p-4 shadow-lg hover:brightness-105 active:scale-[0.99] transition-all flex items-center gap-3">
            <span className="text-3xl shrink-0">{g.emoji}</span>
            <span className="flex-1 min-w-0">
              <span className="flex items-center gap-2">
                <span className="font-black text-slate-800 text-sm">{g.name}</span>
                <span className="text-[8px] font-black uppercase tracking-wide text-amber-600 bg-amber-100 rounded-full px-2 py-0.5">{g.tier}</span>
              </span>
              <span className="block text-[11px] text-slate-500 mt-0.5">{g.blurb}</span>
            </span>
            <span className="text-amber-500 text-lg shrink-0">→</span>
          </button>
        ))}
        <p className="text-center text-[10px] text-white/50 italic mt-2">More games arrive each week — ice-breakers first, the deeper ones as your fire grows warmer.</p>
      </div>
    </div>
  );
}
