import React, { useState } from 'react';
import FireQuiz from '../FireQuiz';
import TwoTruthsTide from './TwoTruthsTide';
import AppreciationVolley from './AppreciationVolley';
import LoveLanguageSort from './LoveLanguageSort';
import BidAndTurn from './BidAndTurn';
import WeatherReport from './WeatherReport';
import RepairRope from './RepairRope';
import StoryCircle from './StoryCircle';
import ChoreSwap from './ChoreSwap';
import MemoryMatch from './MemoryMatch';
import RidgepoleVote from './RidgepoleVote';
import SandDrawings from './SandDrawings';
import TwoHuts from './TwoHuts';
import RitualDesigner from './RitualDesigner';
import NamingTheUndertow from './NamingTheUndertow';
import GameShell from './GameShell';
import PerspectiveSwap from '../PerspectiveSwap';
import LetterInTheBottle from './LetterInTheBottle';
import ApologyForge from './ApologyForge';
import LoadTest from './LoadTest';
import GenogramHunt from './GenogramHunt';

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
  { id: 'bid_and_turn', name: 'Bid & Turn', emoji: '🫧', tier: 'solo · this week',
    blurb: "Train the #1 skill: notice the little reaches and turn toward them.",
    render: (onClose) => <BidAndTurn onClose={onClose} /> },
  { id: 'weather_report', name: 'Weather Report', emoji: '🌦', tier: 'kindling',
    blurb: "Name your inner weather, guess each other's — ask before assuming.",
    render: (onClose) => <WeatherReport onClose={onClose} /> },
  { id: 'repair_rope', name: 'The Repair Rope', emoji: '🪢', tier: 'steady flame',
    blurb: 'Braid the exact phrases that reach each other mid-storm — kept forever.',
    render: (onClose) => <RepairRope onClose={onClose} /> },
  { id: 'story_circle', name: 'The Story Circle', emoji: '📖', tier: 'family',
    blurb: 'The fire deals a prompt; each voice adds a chapter. The island remembers.',
    render: (onClose) => <StoryCircle onClose={onClose} /> },
  { id: 'chore_swap', name: 'The Chore Swap', emoji: '🧤', tier: 'kindling',
    blurb: "Trade one invisible task this week — your lantern only lights for THEIR load.",
    render: (onClose) => <ChoreSwap onClose={onClose} /> },
  { id: 'memory_match', name: 'Memory Match', emoji: '🐚', tier: 'family',
    blurb: 'Flip the shells together — every pair is a family memory to retell out loud.',
    render: (onClose) => <MemoryMatch onClose={onClose} /> },
  { id: 'ridgepole_vote', name: 'The Ridgepole Vote', emoji: '🏗', tier: 'steady flame',
    blurb: 'Each voice picks 3 timbers this family is built on — the matches raise the beam.',
    render: (onClose) => <RidgepoleVote onClose={onClose} /> },
  { id: 'sand_drawings', name: 'Sand Drawings', emoji: '🖐', tier: 'ice-breaker',
    blurb: 'One tells a memory, the other draws it in the sand — the gap is the laugh.',
    render: (onClose) => <SandDrawings onClose={onClose} /> },
  { id: 'two_huts', name: 'Two Huts or One', emoji: '🏕', tier: 'steady flame',
    blurb: "Place your bedroll on tonight's camp map, honestly — distance is data, not failure.",
    render: (onClose) => <TwoHuts onClose={onClose} /> },
  { id: 'ritual_designer', name: 'Ritual Designer', emoji: '🕯', tier: 'steady flame',
    blurb: 'Invent a ceremony only this family would understand — it enters the tide table for real.',
    render: (onClose) => <RitualDesigner onClose={onClose} /> },
  { id: 'naming_the_undertow', name: 'Naming the Undertow', emoji: '🌀', tier: 'deep water',
    blurb: 'Map the cycle that grabs you both, then name it — the cycle is the enemy, never each other.',
    render: (onClose) => <NamingTheUndertow onClose={onClose} /> },
  // #16 — the crown mechanic was already built as a shore tool; the campfire
  // simply gives it a seat (same component, same consent spine, zero forks)
  { id: 'perspective_swap', name: 'Walk a Day in Their Boots', emoji: '🔁', tier: 'deep water',
    blurb: 'The Perspective Swap — one written day as each other. Invited, bounded, debriefed.',
    render: (onClose) => (
      <GameShell emoji="🔁" title="Walk a Day in Their Boots" subtitle="the perspective swap · invited · bounded · debriefed"
        onClose={onClose} bg="linear-gradient(#1E2A44, #33415E)">
        <div className="px-5 py-6 max-w-md mx-auto w-full"><PerspectiveSwap /></div>
      </GameShell>
    ) },
  { id: 'letter_in_the_bottle', name: 'The Letter in the Bottle', emoji: '🍾', tier: 'deep water',
    blurb: 'Write to this family one year out and launch it — sealed means sealed, until the tide returns it.',
    render: (onClose) => <LetterInTheBottle onClose={onClose} /> },
  { id: 'apology_forge', name: 'The Apology Forge', emoji: '⚒️', tier: 'deep water',
    blurb: 'Walk one real repair through the four hammers — your "but" burns in the fire, not the apology.',
    render: (onClose) => <ApologyForge onClose={onClose} /> },
  { id: 'load_test', name: 'The Load Test', emoji: '🧗', tier: 'deep water',
    blurb: 'Rehearse the hard conversation in the shallows — build the startup, clear the reef, then go live.',
    render: (onClose) => <LoadTest onClose={onClose} /> },
  { id: 'genogram_hunt', name: 'The Genogram Hunt', emoji: '🗿', tier: 'steady flame',
    blurb: "Find the pattern stones your family carries, then choose each one's fate: keep, reforge, or set down.",
    render: (onClose) => <GenogramHunt onClose={onClose} /> },
  // → the roadmap (THE_RECONNECTION_LOOP.md) fills the rest: Ritual Designer,
  //   the Ridgepole Vote, Naming the Undertow, … each a file + a line here.
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
