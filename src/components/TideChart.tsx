import React, { useState } from 'react';
import { X, Waves, Users, Map, Activity, MapPin } from 'lucide-react';
import { MILESTONES, SEASONS } from '../data/milestones';
import { THE_SEVEN, readCrew } from '../lib/castaways';
import { lanternLit } from '../lib/world';

// ═════════════════════════════════════════════════════════════════════════════
//  THE TIDE CHART — Driftwood's Chart Room (THE_DRIFTWOOD_STORY_BIBLE.md).
//  Four boards, fair play: only what the family has already lived.
//    · TIDE-MARKS — every closed milestone's "first," the pattern forming
//    · THE FAMILY BOARD — the Seven, lanterns, compassion-framed
//    · THE ISLAND CHART — the five seasons pinned on the real island
//    · THE WEEK'S WATER — TOGETHER's real history as tides
// ═════════════════════════════════════════════════════════════════════════════

type Board = 'marks' | 'family' | 'island' | 'water';

function closedIds(): string[] {
  try {
    const s = JSON.parse(localStorage.getItem('driftwood_milestone_log_v1') || 'null');
    return Array.isArray(s?.closed) ? s.closed : [];
  } catch { return []; }
}

function readEvents(): { actor: string; action: string; at: string; payload?: Record<string, unknown> }[] {
  try {
    const e = JSON.parse(localStorage.getItem('driftwood_events_v1') || '[]');
    return Array.isArray(e) ? e : [];
  } catch { return []; }
}

// The seasons' spots on a stylized island (mirrors the 3D story circles).
const SEASON_SPOTS: Record<number, { x: number; y: number }> = {
  1: { x: 30, y: 72 }, 2: { x: 48, y: 55 }, 3: { x: 66, y: 66 }, 4: { x: 58, y: 32 }, 5: { x: 80, y: 45 },
};

export default function TideChart({ onClose }: { onClose: () => void }) {
  const [board, setBoard] = useState<Board>('marks');
  const closed = closedIds();
  const crew = readCrew();
  const events = readEvents();

  const BOARDS: { id: Board; icon: React.ElementType; label: string }[] = [
    { id: 'marks',  icon: Waves,    label: 'Tide-Marks' },
    { id: 'family', icon: Users,    label: 'The Family' },
    { id: 'island', icon: Map,      label: 'The Island' },
    { id: 'water',  icon: Activity, label: "The Water" },
  ];

  // The week's water: TOGETHER-feeding events bucketed by day, last 14 days.
  const days: { label: string; count: number }[] = [];
  for (let d = 13; d >= 0; d--) {
    const day = new Date(); day.setDate(day.getDate() - d); day.setHours(0, 0, 0, 0);
    const next = new Date(day); next.setDate(next.getDate() + 1);
    const count = events.filter(e => {
      const t = new Date(e.at).getTime();
      return t >= day.getTime() && t < next.getTime()
        && ['gathering_held', 'fire_quiz_played', 'sand_game_played', 'milestone_closed', 'tool_work'].includes(e.action);
    }).length;
    days.push({ label: day.toLocaleDateString(undefined, { weekday: 'narrow' }), count });
  }
  const maxCount = Math.max(1, ...days.map(d => d.count));

  return (
    <div className="fixed inset-0 z-[55] overflow-y-auto" style={{
      background: 'radial-gradient(ellipse 90% 60% at 50% 0%, #0F2E33 0%, #0B2126 55%, #071417 100%)',
    }}>
      <div className="w-full max-w-5xl mx-auto p-4 md:p-6 pb-24">
        <div className="flex items-center justify-between pt-2 mb-1">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-teal-200/60">The camp table · firelight</p>
            <h1 className="text-2xl font-black tracking-tight text-teal-50 font-display">The Tide Chart</h1>
          </div>
          <button onClick={onClose} aria-label="Back to the fire"
            className="p-2 bg-white/5 border border-teal-200/25 hover:bg-white/10 rounded-full text-teal-200/70 cursor-pointer shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[11px] text-teal-200/50 italic font-serif mb-4">
          Only what this family has already lived. The pattern shows itself to the patient.
        </p>

        <div className="flex gap-1.5 mb-5">
          {BOARDS.map(b => {
            const Icon = b.icon;
            const active = board === b.id;
            return (
              <button key={b.id} onClick={() => setBoard(b.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-2xl border text-[11px] font-black uppercase tracking-wide cursor-pointer transition-all ${
                  active ? 'bg-teal-400/15 border-teal-300/50 text-teal-200' : 'bg-white/5 border-teal-200/15 text-teal-200/50 hover:bg-white/10'
                }`}>
                <Icon className="w-3.5 h-3.5" /> {b.label}
              </button>
            );
          })}
        </div>

        {/* ══ TIDE-MARKS ══ */}
        {board === 'marks' && (
          <div className="space-y-2.5">
            {closed.length === 0 ? (
              <div className="p-6 bg-white/5 border border-teal-200/15 rounded-2xl text-center">
                <p className="text-sm font-black text-teal-50">No marks on the sand yet.</p>
                <p className="text-[11px] text-teal-200/60 mt-1">Close a milestone — every survival first leaves a tide-mark here, forever.</p>
              </div>
            ) : MILESTONES.filter(m => closed.includes(m.id)).map(m => (
              <div key={m.id} className="p-3.5 bg-teal-400/10 border-2 border-teal-300/30 rounded-2xl">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-teal-300 flex items-center gap-1.5">
                    <Waves className="w-3 h-3" /> TIDE-MARK № {m.n} — {m.title}
                  </p>
                  <span className="text-[9px] font-bold text-teal-200/50 uppercase shrink-0">Season {m.season}</span>
                </div>
                <p className="text-[12.5px] leading-relaxed text-teal-50 font-semibold">{m.first}</p>
              </div>
            ))}
          </div>
        )}

        {/* ══ THE FAMILY BOARD ══ */}
        {board === 'family' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {THE_SEVEN.map(slot => {
              const claimed = crew.find(c => c.slotId === slot.id);
              const lit = claimed ? lanternLit(slot.id) : false;
              return (
                <div key={slot.id} className="p-4 bg-white/5 border border-teal-200/20 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <span className="w-12 h-12 rounded-xl bg-black/30 border border-teal-200/20 flex items-center justify-center text-xl">{slot.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-black text-teal-50">{claimed ? claimed.name : `${slot.role} (robot hands)`}</p>
                      <p className="text-[10px] text-teal-200/60">{slot.role}</p>
                    </div>
                    {claimed && (
                      <span className="text-lg" title={lit ? 'Lantern lit — real work this week' : 'Lantern waiting'}
                        style={{ filter: lit ? 'drop-shadow(0 0 6px rgba(255,196,110,0.9))' : 'grayscale(1) opacity(0.4)' }}>🏮</span>
                    )}
                  </div>
                  <p className="text-[11px] text-teal-100/70 italic font-serif mt-2 leading-relaxed">{slot.blurb}</p>
                </div>
              );
            })}
          </div>
        )}

        {/* ══ THE ISLAND CHART ══ */}
        {board === 'island' && (
          <div>
            <div className="relative w-full rounded-2xl border-2 border-teal-200/25 overflow-hidden" style={{ aspectRatio: '16/9' }}>
              {/* a real aerial cove underneath the stylized map tint — texture
                  without losing the pins' legibility (2026-07-13 art pass) */}
              <img src="/ambient/cove-aerial.webp" alt="" aria-hidden loading="lazy"
                className="absolute inset-0 w-full h-full object-cover opacity-45"
                onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              <div className="absolute inset-0" style={{
                background: 'radial-gradient(ellipse 70% 80% at 50% 55%, #C9B182CC 0%, #A88F5FCC 38%, #2E7D6EDD 42%, #14424AEE 70%, #0B2A33F5 100%)',
              }} />
              {SEASONS.map(sn => {
                const spot = SEASON_SPOTS[sn.n];
                const done = MILESTONES.filter(m => m.season === sn.n).every(m => closed.includes(m.id));
                const started = MILESTONES.some(m => m.season === sn.n && closed.includes(m.id));
                return (
                  <div key={sn.n} className="absolute -translate-x-1/2 -translate-y-1/2 text-center" style={{ left: `${spot.x}%`, top: `${spot.y}%` }}>
                    <span className={`text-lg block ${done ? '' : started ? 'opacity-80' : 'grayscale opacity-40'}`}>{done ? '🔥' : started ? '⛺' : '🌫'}</span>
                    <span className={`text-[7px] font-black uppercase tracking-wider block ${done ? 'text-amber-200' : 'text-white/50'}`}>{sn.name}</span>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 space-y-1.5">
              {SEASONS.map(sn => {
                const seasonMs = MILESTONES.filter(m => m.season === sn.n);
                const n = seasonMs.filter(m => closed.includes(m.id)).length;
                return (
                  <div key={sn.n} className={`p-3 rounded-2xl border ${n > 0 ? 'bg-teal-400/10 border-teal-300/25' : 'bg-white/5 border-teal-200/10'}`}>
                    <p className={`text-[11px] font-black flex items-center gap-1.5 ${n > 0 ? 'text-teal-100' : 'text-white/40'}`}>
                      <MapPin className="w-3 h-3 shrink-0" /> Season {sn.n} · {sn.name}
                      <span className="ml-auto font-bold">{n}/{seasonMs.length}</span>
                    </p>
                    <p className="text-[10px] text-teal-200/60 italic font-serif mt-0.5">{sn.arc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ══ THE WEEK'S WATER ══ */}
        {board === 'water' && (
          <div className="space-y-3">
            <div className="p-4 bg-white/5 border border-teal-200/20 rounded-2xl">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-300 mb-3">The last fourteen tides — together-work per day</p>
              <div className="flex items-end gap-1.5 h-28">
                {days.map((d, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                    <div className="w-full rounded-t-lg transition-all"
                      style={{
                        height: `${Math.max(4, (d.count / maxCount) * 100)}%`,
                        background: d.count > 0 ? 'linear-gradient(180deg,#F2A65A,#0E7C7C)' : 'rgba(255,255,255,0.08)',
                      }} />
                    <span className="text-[8px] font-bold text-teal-200/50">{d.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-3 rounded-xl text-[11px] text-teal-200/60 italic font-serif" style={{ background: 'rgba(255,255,255,0.04)' }}>
              High water is fires lit together — games, gatherings, milestones, real tool work.
              Low water is not a verdict. It's the Undertow, visible. Name it, and light one fire.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
