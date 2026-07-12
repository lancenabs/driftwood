import React from 'react';
import { Zap, Flame, ShoppingBag, Lock } from 'lucide-react';
import { MILESTONES, SEASONS } from '../data/milestones';
import { useGame } from '../lance/components/LANCEGame/LANCEGameContext';
import MilestoneLog from './MilestoneLog';
import TideChart from './TideChart';

// ═════════════════════════════════════════════════════════════════════════════
//  THE CHALLENGES TAB — Driftwood's dedicated challenge room on the flagship
//  design (LANCE law, 2026-07-12): a progress header (season arc + XP + gems),
//  the 31-milestone trail (locked → active → complete), the campfire-games
//  door (the instruments' room), and the Rewards Store door (spend what the
//  crossing paid). Completing a milestone unlocks its instrument — the
//  challenges teach the library, app by app.
// ═════════════════════════════════════════════════════════════════════════════

function readClosed(): string[] {
  try {
    const s = JSON.parse(localStorage.getItem('driftwood_milestone_log_v1') || 'null');
    return Array.isArray(s?.closed) ? s.closed : [];
  } catch { return []; }
}

export default function ChallengesTab({ onOpenTool, onOpenGames }: {
  onOpenTool: (id: string) => void;
  onOpenGames: () => void;
}) {
  const { xp, gems, unlockedTools } = useGame();
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

  const closed = readClosed();
  const next = MILESTONES.find(m => !closed.includes(m.id)) ?? null;
  const season = next ? SEASONS.find(s => s.n === next.season)! : SEASONS[SEASONS.length - 1];
  const pct = Math.round((closed.length / MILESTONES.length) * 100);

  return (
    <div className="w-full pt-3 pb-4">
      {/* ── The flagship progress header ── */}
      <div className="rounded-[2rem] overflow-hidden border-2 border-outline-variant mb-4"
        style={{ background: 'linear-gradient(120deg,#0E7C7C,#2E96B5)' }}>
        <div className="px-5 py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[9px] font-black uppercase tracking-[0.25em] text-white/70">
                Season {season.n} · {season.name}
              </p>
              <h2 className="font-display font-black text-lg text-white leading-tight mt-0.5">
                {next ? `Survival first ${next.n} of ${MILESTONES.length}` : 'Every first is behind you'}
              </h2>
              <p className="text-[11px] text-white/75 mt-0.5 italic truncate">{season.arc}</p>
            </div>
            <div className="shrink-0 flex flex-col items-end gap-1.5">
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/15 border border-white/25"
                title="XP — earned by real milestone work">
                <Zap className="w-3 h-3 text-yellow-300" />
                <span className="text-[11px] font-black text-white">{xp.toLocaleString()}</span>
              </span>
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/15 border border-white/25"
                title="Gems — spend them in the Rewards Store">
                <span className="text-[11px]">💎</span>
                <span className="text-[11px] font-black text-white">{gems.toLocaleString()}</span>
              </span>
            </div>
          </div>
          {/* progress bar */}
          <div className="mt-3 h-2 rounded-full bg-white/20 overflow-hidden">
            <div className="h-full rounded-full bg-amber-300 transition-all duration-700" style={{ width: `${pct}%` }} />
          </div>
          <p className="text-[10px] font-black text-white/80 mt-1.5">{closed.length}/{MILESTONES.length} closed · {unlockedTools.length} apps unlocked</p>
        </div>
      </div>

      {/* ── The two doors: instruments + the shop (LANCE pattern) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
        <button onClick={onOpenGames} data-testid="challenges-campfire"
          className="flex items-center gap-3 p-3 rounded-2xl bg-white border-2 border-outline-variant hover:border-amber-400/60 active:scale-[0.99] transition-all text-left cursor-pointer">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
            <Flame className="w-5 h-5 text-amber-500" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-black text-slate-800">Campfire Games</div>
            <div className="text-[10px] text-slate-500">the milestones' instruments — a real round closes the case</div>
          </div>
        </button>
        <button onClick={() => setTideOpen(true)} data-testid="challenges-tidechart"
          className="flex items-center gap-3 p-3 rounded-2xl bg-white border-2 border-outline-variant hover:border-teal-500/50 active:scale-[0.99] transition-all text-left cursor-pointer">
          <div className="w-10 h-10 rounded-xl bg-teal-600/10 flex items-center justify-center shrink-0 text-lg">🗺️</div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-black text-slate-800">The Tide Chart</div>
            <div className="text-[10px] text-slate-500">tide-marks · the family · the island · the week's water</div>
          </div>
        </button>
        <button onClick={() => onOpenTool('rewards_store')} data-testid="challenges-shop"
          className="flex items-center gap-3 p-3 rounded-2xl bg-white border-2 border-outline-variant hover:border-primary/50 active:scale-[0.99] transition-all text-left cursor-pointer">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <ShoppingBag className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-black text-slate-800">Rewards Store</div>
            <div className="text-[10px] text-slate-500">spend the gems the crossing paid — titles & accents</div>
          </div>
        </button>
      </div>

      {/* ── The trail itself — the proven MilestoneLog engine ── */}
      <MilestoneLog onOpenTool={onOpenTool} />

      {tideOpen && <TideChart onClose={() => setTideOpen(false)} />}

      <p className="text-[9px] text-slate-400 text-center italic flex items-center justify-center gap-1">
        <Lock className="w-3 h-3" /> each milestone unlocks its app in the Library — that's the point of the crossing
      </p>
    </div>
  );
}
