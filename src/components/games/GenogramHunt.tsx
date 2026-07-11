import React, { useState } from 'react';
import GameShell, { feedTogether } from './GameShell';
import { activeCastaway, readCrew } from '../../lib/castaways';

// ═════════════════════════════════════════════════════════════════════════════
//  THE GENOGRAM HUNT (steady flame · roadmap #11). Walk the family line finding
//  PATTERN STONES — the things that repeat across generations (the silence, the
//  overwork, the big laugh, the door-slam). For each stone the crew found, one
//  question: keep it, change it, or set it down? Bowen's family-systems work as
//  beachcombing: you can't choose your inheritance, but you CAN choose what
//  gets carried forward. The chosen stones persist (driftwood_genogram_v1).
// ═════════════════════════════════════════════════════════════════════════════

const STONES = [
  { id: 'silence',  emoji: '🤐', label: 'The Silence — hard things go unsaid until they get big' },
  { id: 'overwork', emoji: '⚙️', label: 'The Overwork — love shown by exhaustion, never by rest' },
  { id: 'doorslam', emoji: '🚪', label: 'The Door-Slam — anger leaves the room instead of speaking' },
  { id: 'biglaugh', emoji: '😂', label: 'The Big Laugh — the family that can crack up at a funeral' },
  { id: 'table',    emoji: '🍽', label: 'The Table — everything real gets said over food' },
  { id: 'stubborn', emoji: '🪨', label: 'The Stubborn Streak — nobody apologizes first' },
  { id: 'openhome', emoji: '🏠', label: 'The Open Door — there is always room for one more' },
  { id: 'worry',    emoji: '🌧', label: 'The Worry — love expressed as constant alarm' },
  { id: 'music',    emoji: '🎶', label: 'The Music — songs where the words cannot go' },
  { id: 'grudge',   emoji: '🧊', label: 'The Long Cold — grudges that outlive their reason' },
];

type Fate = 'keep' | 'change' | 'setdown';
const KEY = 'driftwood_genogram_v1';

export default function GenogramHunt({ onClose }: { onClose: () => void }) {
  const me = activeCastaway();
  const crew = readCrew();
  const [phase, setPhase] = useState<'intro' | 'hunt' | 'fates' | 'map'>('intro');
  const [found, setFound] = useState<typeof STONES>([]);
  const [fateIdx, setFateIdx] = useState(0);
  const [fates, setFates] = useState<Record<string, Fate>>({});

  const toggle = (s: typeof STONES[0]) =>
    setFound(f => f.some(x => x.id === s.id) ? f.filter(x => x.id !== s.id) : [...f, s]);

  const decide = (fate: Fate) => {
    const stone = found[fateIdx];
    const next = { ...fates, [stone.id]: fate };
    setFates(next);
    if (fateIdx + 1 < found.length) { setFateIdx(i => i + 1); return; }
    try {
      localStorage.setItem(KEY, JSON.stringify({
        stones: found.map(s => ({ id: s.id, fate: next[s.id] })),
        by: crew.length || 1, at: new Date().toISOString(),
      }));
    } catch { /* the naming already worked */ }
    feedTogether('genogram_hunt', { stones: found.length });
    setPhase('map');
  };

  const FATE_META: Record<Fate, { emoji: string; label: string }> = {
    keep: { emoji: '🏺', label: 'carried forward' },
    change: { emoji: '⚒️', label: 'reforged' },
    setdown: { emoji: '🌊', label: 'set down at the tide line' },
  };

  return (
    <GameShell emoji="🗿" title="The Genogram Hunt" subtitle="find the stones your family carries · choose what travels on"
      onClose={onClose} bg="linear-gradient(#232030, #2E2A3E 55%, #3E3A2E)">
      <div className="px-5 py-5 flex flex-col justify-center min-h-[70%]">
        {phase === 'intro' && (
          <div className="max-w-sm mx-auto w-full text-center flex flex-col gap-4">
            <div className="text-5xl">🗿🏖</div>
            <p className="text-white/90 text-sm font-bold">Every family carries stones it never chose to pick up.</p>
            <p className="text-[11px] text-white/70 italic leading-relaxed">
              Beachcomb the list together — out loud, with stories: <i>"that one's Grandpa's."</i> Take only the stones that are truly in YOUR family's pockets. Then the real game: for each one — does it travel on, get reforged, or get set down at the tide line? <b className="text-amber-300">You can't choose your inheritance. You can choose the cargo.</b>
            </p>
            <button onClick={() => setPhase('hunt')} data-testid="gh-start" className="bg-gradient-to-r from-slate-600 to-amber-700 text-white font-black rounded-xl py-3 text-sm">Walk the tide line →</button>
          </div>
        )}
        {phase === 'hunt' && (
          <div className="max-w-sm mx-auto w-full flex flex-col gap-3">
            <p className="text-center text-[10px] font-black uppercase tracking-widest text-amber-300">tap the stones your family actually carries — tell the story of each</p>
            <div className="flex flex-col gap-1.5 max-h-[380px] overflow-y-auto">
              {STONES.map(s => (
                <button key={s.id} onClick={() => toggle(s)} data-testid={`gh-stone-${s.id}`}
                  className={`text-left rounded-xl px-3 py-2.5 text-[12px] font-bold transition-all flex items-center gap-2 ${found.some(x => x.id === s.id) ? 'bg-amber-400 text-slate-900' : 'bg-white/90 text-slate-700 hover:brightness-105'}`}>
                  <span className="text-lg">{s.emoji}</span> {s.label}
                </button>
              ))}
            </div>
            <button onClick={() => { setFateIdx(0); setPhase('fates'); }} data-testid="gh-tofates" disabled={!found.length}
              className={`font-black rounded-xl py-3 text-sm ${found.length ? 'bg-amber-500 text-white' : 'bg-white/20 text-white/50'}`}>
              {found.length} in the pack · decide the cargo →
            </button>
          </div>
        )}
        {phase === 'fates' && found[fateIdx] && (
          <div className="max-w-sm mx-auto w-full text-center flex flex-col gap-4">
            <div className="text-5xl">{found[fateIdx].emoji}</div>
            <p className="text-white text-sm font-black">{found[fateIdx].label}</p>
            <p className="text-[10px] text-white/50 uppercase font-black tracking-widest">stone {fateIdx + 1} of {found.length} — decide together, out loud</p>
            <div className="flex flex-col gap-2">
              <button onClick={() => decide('keep')} data-testid="gh-keep" className="bg-white/90 rounded-xl px-3 py-3 text-[12.5px] font-black text-slate-800">🏺 Keep it — this one is treasure, it travels on</button>
              <button onClick={() => decide('change')} data-testid="gh-change" className="bg-white/90 rounded-xl px-3 py-3 text-[12.5px] font-black text-slate-800">⚒️ Reforge it — keep the metal, change the shape</button>
              <button onClick={() => decide('setdown')} data-testid="gh-setdown" className="bg-white/90 rounded-xl px-3 py-3 text-[12.5px] font-black text-slate-800">🌊 Set it down — it ends with this generation</button>
            </div>
          </div>
        )}
        {phase === 'map' && (
          <div className="max-w-sm mx-auto w-full text-center flex flex-col gap-4">
            <div className="text-5xl">🗿✨</div>
            <p className="text-amber-300 text-[10px] font-black uppercase tracking-widest">the family map — what travels on from here</p>
            <div className="flex flex-col gap-1.5 text-left">
              {found.map(s => (
                <div key={s.id} className="bg-white/90 rounded-xl px-3 py-2 text-[12px] font-bold text-slate-700 flex items-center gap-2">
                  <span>{s.emoji}</span>
                  <span className="flex-1">{s.label.split(' — ')[0]}</span>
                  <span className="text-[10px] font-black text-amber-700">{FATE_META[fates[s.id]]?.emoji} {FATE_META[fates[s.id]]?.label}</span>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-white/70 italic">Setting a stone down takes about a hundred small choices — this was the first one. The map stays in your camp's keeping.</p>
            <button onClick={onClose} className="bg-amber-500 text-white font-black rounded-xl py-3 text-sm">Back to the campfire</button>
          </div>
        )}
      </div>
    </GameShell>
  );
}
