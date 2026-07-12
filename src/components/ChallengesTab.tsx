import React from 'react';
import { Map as MapIcon } from 'lucide-react';
import { MILESTONES, SEASONS } from '../data/milestones';
import { matchesHeld, rationsHeld } from '../lib/world';
import { useGame } from '../lance/components/LANCEGame/LANCEGameContext';
import MilestoneLog from './MilestoneLog';
import TideChart from './TideChart';

// ═════════════════════════════════════════════════════════════════════════════
//  THE ISLAND TAB — island-only law (2026-07-12): "the island IS the
//  challenge." This tab no longer lists milestones to tap open from a couch —
//  it IS the 3D island, full-bleed, the moment you land on it. Walking into a
//  season's story circle is the only way a milestone opens (MilestoneLog is
//  mounted invisibly — hideShelf — and surfaces its own overlay only once the
//  island actually triggers one). Campfire Games open the same way: walk to
//  the fire. A quiet Trail button stays for the read-only progress view
//  (that's "insight data," which the fleet's law explicitly allows off-island).
// ═════════════════════════════════════════════════════════════════════════════

function readClosed(): string[] {
  try {
    const s = JSON.parse(localStorage.getItem('driftwood_milestone_log_v1') || 'null');
    return Array.isArray(s?.closed) ? s.closed : [];
  } catch { return []; }
}

export default function ChallengesTab({ onOpenTool, onOpenGames, onLeaveIsland }: {
  onOpenTool: (id: string) => void;
  onOpenGames: () => void;
  onLeaveIsland: () => void;
}) {
  const { xp, gems } = useGame();
  const [tideOpen, setTideOpen] = React.useState(false);
  const [, force] = React.useState(0);

  React.useEffect(() => {
    const bump = () => force(x => x + 1);
    window.addEventListener('driftwood:world-event', bump);
    window.addEventListener('focus', bump);
    return () => {
      window.removeEventListener('driftwood:world-event', bump);
      window.removeEventListener('focus', bump);
    };
  }, []);

  // The 3D world talks to its host through postMessage — the same three
  // signals it always sent; only the host changed (this tab, not a modal).
  React.useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.data?.type === 'driftwood:leave-island') onLeaveIsland();
      if (e.data?.type === 'driftwood:open-games') onOpenGames();
      if (e.data?.type === 'driftwood:open-milestone' && e.data.id) {
        window.dispatchEvent(new CustomEvent('driftwood:open-milestone', { detail: { id: e.data.id } }));
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [onOpenGames, onLeaveIsland]);

  const closed = readClosed();
  const next = MILESTONES.find(m => !closed.includes(m.id)) ?? null;
  const season = next ? SEASONS.find(s => s.n === next.season)! : SEASONS[SEASONS.length - 1];
  const pct = Math.round((closed.length / MILESTONES.length) * 100);

  return (
    <div className="absolute inset-0 bg-[#BEE3F0]">
      <iframe src="/island3d/index.html" title="The Island in three dimensions" className="w-full h-full border-0" allow="fullscreen" />

      {/* Quiet progress pill — insight, not a shortcut; nothing here opens anything */}
      <div className="absolute left-3 z-10 flex items-center gap-2 rounded-full pointer-events-none"
        style={{ top: 'max(12px, env(safe-area-inset-top))', background: 'rgba(0,0,0,0.32)', backdropFilter: 'blur(6px)', padding: '6px 12px' }}>
        <span className="text-[10px] font-black text-white/90">Season {season.n} · {season.name}</span>
        <span className="text-[10px] font-black text-amber-300">{closed.length}/{MILESTONES.length}</span>
        <span className="text-[10px] font-black text-yellow-300">⚡ {xp.toLocaleString()}</span>
        <span className="text-[10px] font-black text-white/90">💎 {gems.toLocaleString()}</span>
        <span className="text-[10px] font-black text-orange-300" title="Matches — struck by checked steps">🔥 {matchesHeld()}</span>
        <span className="text-[10px] font-black text-amber-100" title="Rations — landed by checked steps">🍲 {rationsHeld()}</span>
      </div>

      {/* The Trail — a read-only progress view (insight data; allowed off the
          walking part of the island by the same law that allows Insights). */}
      <button onClick={() => setTideOpen(true)} data-testid="challenges-tidechart"
        className="absolute right-3 z-10 flex items-center gap-1.5 rounded-full text-white text-[10.5px] font-black uppercase tracking-wide cursor-pointer"
        style={{ top: 'max(12px, env(safe-area-inset-top))', background: 'rgba(0,0,0,0.32)', backdropFilter: 'blur(6px)', padding: '8px 14px' }}>
        <MapIcon className="w-3.5 h-3.5" /> Trail
      </button>

      {tideOpen && <TideChart onClose={() => setTideOpen(false)} />}

      {/* Invisible until the island actually triggers one — walking a story
          circle is the only door; this just answers when it opens. */}
      <MilestoneLog onOpenTool={onOpenTool} hideShelf />

      <p className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 text-[9px] font-bold text-white/70 text-center px-3 pointer-events-none" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.6)' }}>
        {pct}% of the crossing · walk to a glowing circle to open its first
      </p>
    </div>
  );
}
