import React from 'react';
import { appendEvent } from '../../lib/world';
import { activeCastaway } from '../../lib/castaways';

// ═════════════════════════════════════════════════════════════════════════════
//  GAME SHELL — the shared chrome every reconnection mini-game plugs into
//  (extracted once the Fire Quiz + Two Truths confirmed the pattern). Provides
//  the overlay, the header with the crisis-safe close, and feedTogether() — the
//  one honest way a game warms the family (fire_quiz_played → TOGETHER rises).
//  Games keep their OWN unique visual + phase logic; the shell removes the
//  boilerplate so game #3..#40 are short and consistent.
// ═════════════════════════════════════════════════════════════════════════════

export function feedTogether(game: string, payload: Record<string, unknown> = {}) {
  const me = activeCastaway();
  appendEvent(me.id, 'fire_quiz_played', { game, ...payload });
}
export function partnerName(fallback = 'Partner') {
  // the other claimed castaway, or a gentle default (couple mode, one device)
  try {
    const crew = JSON.parse(localStorage.getItem('driftwood_castaways_v1') || '[]');
    const me = activeCastaway();
    const other = crew.find((c: any) => c.slotId !== me.id);
    return other?.name || fallback;
  } catch { return fallback; }
}

export default function GameShell({ emoji, title, subtitle, onClose, bg, children }: {
  emoji: string; title: string; subtitle: string; onClose: () => void;
  bg?: string; children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-[70] flex flex-col" style={{ background: bg ?? 'linear-gradient(#1E2A44, #33415E)' }}>
      <div className="flex items-center gap-2 px-3 py-2.5 bg-black/25 shrink-0">
        <span className="text-lg">{emoji}</span>
        <div className="flex-1 min-w-0">
          <p className="text-[12px] font-black text-white truncate">{title}</p>
          <p className="text-[8px] text-white/70 truncate">{subtitle}</p>
        </div>
        <button onClick={onClose} className="text-[10px] font-black uppercase rounded-full px-3 py-1.5 bg-white/85 text-slate-700 shrink-0">leave</button>
      </div>
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}
