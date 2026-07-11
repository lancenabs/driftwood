import React, { useEffect, useRef, useState } from 'react';
import { gatheringState, sendPos, islandPositions, IslandPos } from '../lib/gathering';
import { activeCastaway, THE_SEVEN, readCrew } from '../lib/castaways';
import { appendEvent } from '../lib/world';

// ═════════════════════════════════════════════════════════════════════════════
//  ISLAND SEEK — run the island together (D3D-0.5 · the first moving avatars).
//  Milestone 15's spirit, "Game Night on the Sand," made real: while gathered,
//  each phone walks its own castaway around the island with a thumb-stick;
//  everyone sees everyone move, live. SEEK mode: hiders duck behind cover
//  (their avatar fades from other phones near cover), the seeker calls
//  "found you!" when they truly are.
//
//  Positions are PLAY, not history — the ephemeral channel, never persisted.
//  When a round ends, `sand_game_played` (a real conjoint act) feeds TOGETHER.
//  No-shame law: nobody's distance, speed, or score is measured. It's tag.
// ═════════════════════════════════════════════════════════════════════════════

// The island's cover spots (normalized 0..1 world) — behind these, hiders fade.
const COVER = [
  { x: 0.18, y: 0.55, r: 0.07, label: '🪨' },   // the rocks
  { x: 0.42, y: 0.30, r: 0.06, label: '🌴' },   // the leaning palm
  { x: 0.70, y: 0.22, r: 0.07, label: '🌿' },   // the jungle edge
  { x: 0.82, y: 0.62, r: 0.06, label: '🛶' },   // the beached rowboat
  { x: 0.30, y: 0.78, r: 0.06, label: '🪵' },   // the driftwood pile
  { x: 0.58, y: 0.72, r: 0.05, label: '⛺' },   // the camp tent
];
const CAMPFIRE = { x: 0.5, y: 0.5 };

function nearCover(x: number, y: number) {
  return COVER.some(c => (x - c.x) ** 2 + (y - c.y) ** 2 < c.r ** 2);
}

export default function IslandSeek({ onClose }: { onClose: () => void }) {
  const me = activeCastaway();
  const [, force] = useState(0);
  const [mode, setMode] = useState<'walking' | 'hiding'>('walking');
  const [found, setFound] = useState<string | null>(null); // a "found you!" toast
  const pos = useRef({ x: 0.5 + (Math.random() - 0.5) * 0.2, y: 0.62 + (Math.random() - 0.5) * 0.1 });
  const facing = useRef<'left' | 'right'>('right');
  const stick = useRef<{ active: boolean; dx: number; dy: number }>({ active: false, dx: 0, dy: 0 });
  const arena = useRef<HTMLDivElement>(null);
  const roundLogged = useRef(false);

  // the game loop: move by stick, broadcast ~5Hz, re-render at 30fps
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const step = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const s = stick.current;
      if (s.active && (s.dx || s.dy)) {
        const SPEED = 0.16; // island widths per second — a jog, not a sprint
        pos.current.x = Math.max(0.03, Math.min(0.97, pos.current.x + s.dx * SPEED * dt));
        pos.current.y = Math.max(0.10, Math.min(0.92, pos.current.y + s.dy * SPEED * dt));
        if (Math.abs(s.dx) > 0.1) facing.current = s.dx < 0 ? 'left' : 'right';
      }
      sendPos({ x: pos.current.x, y: pos.current.y, facing: facing.current, mode });
      force(f => f + 1);
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    const bump = () => force(f => f + 1);
    window.addEventListener('driftwood:island-pos', bump);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('driftwood:island-pos', bump); };
  }, [mode]);

  // thumb-stick: any touch/drag in the lower-left circle
  const stickBase = useRef<{ x: number; y: number } | null>(null);
  const onStick = (e: React.PointerEvent, phase: 'down' | 'move' | 'up') => {
    e.preventDefault();
    if (phase === 'down') {
      stickBase.current = { x: e.clientX, y: e.clientY };
      stick.current.active = true;
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    } else if (phase === 'move' && stick.current.active && stickBase.current) {
      const dx = (e.clientX - stickBase.current.x) / 40;
      const dy = (e.clientY - stickBase.current.y) / 40;
      const m = Math.hypot(dx, dy) || 1;
      stick.current.dx = Math.abs(dx) > 1 ? dx / m : dx;
      stick.current.dy = Math.abs(dy) > 1 ? dy / m : dy;
    } else if (phase === 'up') {
      stick.current = { active: false, dx: 0, dy: 0 };
      stickBase.current = null;
    }
  };

  // desktop keys too (the house rule: every surface works on the desk)
  useEffect(() => {
    const keys: Record<string, boolean> = {};
    const sync = () => {
      const dx = (keys['d'] || keys['arrowright'] ? 1 : 0) - (keys['a'] || keys['arrowleft'] ? 1 : 0);
      const dy = (keys['s'] || keys['arrowdown'] ? 1 : 0) - (keys['w'] || keys['arrowup'] ? 1 : 0);
      stick.current = { active: !!(dx || dy), dx, dy };
    };
    const dn = (e: KeyboardEvent) => { keys[e.key.toLowerCase()] = true; sync(); };
    const up = (e: KeyboardEvent) => { keys[e.key.toLowerCase()] = false; sync(); };
    addEventListener('keydown', dn); addEventListener('keyup', up);
    return () => { removeEventListener('keydown', dn); removeEventListener('keyup', up); };
  }, []);

  const g = gatheringState();
  const others = islandPositions().filter(p => p.actor !== me.id);
  const crew = readCrew();
  const emojiOf = (actor: string) => THE_SEVEN.find(s => s.id === actor)?.emoji ?? '🏝️';
  const iAmHidden = mode === 'hiding' && nearCover(pos.current.x, pos.current.y);

  const foundYou = (p: IslandPos) => {
    setFound(`You found ${p.name}! 🎉`);
    appendEvent(me.id, 'sand_game_played', { game: 'island_seek', found: p.actor });
    roundLogged.current = true;
    setTimeout(() => setFound(null), 3500);
  };

  const close = () => {
    if (!roundLogged.current && others.length > 0) {
      appendEvent(me.id, 'sand_game_played', { game: 'island_seek' }); // the playing counted, found or not
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex flex-col" style={{ background: 'linear-gradient(#BEE3F0, #EAF6FA 30%, #57B3C4 42%, #3E93A8 48%, #EBD9B4 55%, #D9C49A)' }}>
      {/* header — honest and small; the crisis strip stays above via the shell */}
      <div className="flex items-center gap-2 px-3 py-2 bg-black/20 backdrop-blur-sm">
        <span className="text-sm">🏃</span>
        <div className="flex-1">
          <p className="text-[11px] font-black text-white">Island Seek · camp {g.code}</p>
          <p className="text-[8px] text-white/80">walk with the stick (or WASD) · duck near {COVER.map(c => c.label).join(' ')} to hide · nothing is scored</p>
        </div>
        <button onClick={() => setMode(m => m === 'hiding' ? 'walking' : 'hiding')}
          className={`text-[10px] font-black uppercase rounded-full px-3 py-1.5 ${mode === 'hiding' ? 'bg-emerald-500 text-white' : 'bg-white/85 text-slate-700'}`}>
          {mode === 'hiding' ? (iAmHidden ? '🤫 hidden' : '🫣 hiding…') : '🚶 walking'}
        </button>
        <button onClick={close} className="text-[10px] font-black uppercase rounded-full px-3 py-1.5 bg-white/85 text-slate-700">back to camp</button>
      </div>

      {/* the island */}
      <div ref={arena} className="flex-1 relative overflow-hidden select-none touch-none">
        {/* cover spots */}
        {COVER.map((c, i) => (
          <div key={i} className="absolute text-3xl" style={{ left: `${c.x * 100}%`, top: `${c.y * 100}%`, transform: 'translate(-50%, -60%)', filter: 'drop-shadow(0 3px 3px rgba(0,0,0,0.25))' }}>
            {c.label}
          </div>
        ))}
        {/* the campfire — home base, always */}
        <div className="absolute text-2xl animate-pulse" style={{ left: `${CAMPFIRE.x * 100}%`, top: `${CAMPFIRE.y * 100}%`, transform: 'translate(-50%, -60%)', filter: 'drop-shadow(0 0 10px rgba(255,166,77,0.9))' }}>🔥</div>

        {/* the others — each family member's live avatar */}
        {others.map(p => {
          const hidden = p.mode === 'hiding' && nearCover(p.x, p.y);
          return (
            <button key={p.actor} onClick={() => !hidden && foundYou(p)} data-testid={`seek-avatar-${p.actor}`}
              className="absolute flex flex-col items-center transition-opacity duration-700"
              style={{ left: `${p.x * 100}%`, top: `${p.y * 100}%`, transform: `translate(-50%, -80%) scaleX(${p.facing === 'left' ? -1 : 1})`, opacity: hidden ? 0.06 : 1 }}>
              <span className="text-3xl" style={{ filter: 'drop-shadow(0 3px 2px rgba(0,0,0,0.3))' }}>{emojiOf(p.actor)}</span>
              <span className="text-[8px] font-black text-white bg-black/35 rounded-full px-1.5" style={{ transform: `scaleX(${p.facing === 'left' ? -1 : 1})` }}>{p.name}</span>
            </button>
          );
        })}

        {/* me — pointer-events-none so my own marker never eats a tap meant
            for a family member standing beside me */}
        <div className="absolute flex flex-col items-center pointer-events-none" style={{ left: `${pos.current.x * 100}%`, top: `${pos.current.y * 100}%`, transform: `translate(-50%, -80%) scaleX(${facing.current === 'left' ? -1 : 1})`, opacity: iAmHidden ? 0.45 : 1 }}>
          <span className="text-4xl" style={{ filter: 'drop-shadow(0 4px 3px rgba(0,0,0,0.35))' }}>{me.avatar}</span>
          <span className="text-[9px] font-black text-white bg-emerald-600/80 rounded-full px-2" style={{ transform: `scaleX(${facing.current === 'left' ? -1 : 1})` }}>{me.name} (you)</span>
        </div>

        {/* found toast */}
        {found && (
          <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-white rounded-2xl px-5 py-2.5 text-sm font-black text-amber-600 shadow-lg animate-bounce">{found}</div>
        )}
        {others.length === 0 && (
          <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-black/30 rounded-2xl px-4 py-2 text-[10px] font-bold text-white">
            the island is yours alone so far — family joins from the camp bar with code {g.code}
          </div>
        )}

        {/* the thumb-stick (touch) */}
        <div
          className="absolute bottom-6 left-6 w-28 h-28 rounded-full border-2 border-white/50 bg-white/15 backdrop-blur-sm"
          onPointerDown={e => onStick(e, 'down')} onPointerMove={e => onStick(e, 'move')} onPointerUp={e => onStick(e, 'up')} onPointerCancel={e => onStick(e, 'up')}>
          <div className="absolute rounded-full bg-white/70 w-12 h-12" style={{ left: `calc(50% + ${stick.current.dx * 24}px - 24px)`, top: `calc(50% + ${stick.current.dy * 24}px - 24px)` }} />
        </div>
      </div>
    </div>
  );
}
