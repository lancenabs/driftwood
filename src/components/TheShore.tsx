import React, { useEffect, useState } from 'react';
import { readNeeds, planksEarned, embersHeld, matchesHeld, rationsHeld, lanternLit, appendEvent } from '../lib/world';
import { THE_SEVEN, readCrew, aiCastaways, activeCastaway, setActiveCastaway } from '../lib/castaways';
// The island itself — its 3D world, its postMessage handling, its Campfire
// Games trigger — now lives entirely in the Island tab (ChallengesTab.tsx,
// island-only law, 2026-07-12). This scene just opens the door.
const enterIsland = () => window.dispatchEvent(new CustomEvent('driftwood:walk-island'));

// ═════════════════════════════════════════════════════════════════════════════
//  THE SHORE — the living scene at the top of the Driftwood tab.
//  Layered CSS (no engine, the VR-deck craft): sky painted by the real clock,
//  the sea, the tide line, the camp. Everything rendered is TRUE: the fire
//  burns as tall as TOGETHER is tended, planks stack as they're earned,
//  lanterns at the dock are lit by real week-work. The Jumble waves from the
//  rocks. No fake weather, no decay theatrics, no shame.
// ═════════════════════════════════════════════════════════════════════════════

function skyColors(): { top: string; bottom: string; sun: boolean; backdrop: string } {
  const h = new Date().getHours();
  // backdrop: the Foundry-cast painting for this hour (public/shore/beach_*.jpg,
  // delivered 2026-07-11). If the file is ever missing the painted CSS layers
  // beneath still carry the scene — the auto-light law, honest both ways.
  if (h >= 5 && h < 8)   return { top: '#F6D8C3', bottom: '#FBEAD9', sun: true,  backdrop: '/shore/beach_dawn.jpg' };
  if (h >= 8 && h < 17)  return { top: '#BEE3F0', bottom: '#EAF6FA', sun: true,  backdrop: '/shore/beach_day.jpg' };
  if (h >= 17 && h < 20) return { top: '#F4C7A1', bottom: '#F9E3C8', sun: true,  backdrop: '/shore/beach_dusk.jpg' };
  return { top: '#1E2A44', bottom: '#33415E', sun: false, backdrop: '/shore/beach_night.jpg' };
}

export default function TheShore({ onOpenTool }: { onOpenTool: (id: string) => void }) {
  const [, force] = useState(0);
  // When the Foundry's painting loads, the CSS-painted layers stand down —
  // one scene, never two fighting. Missing art = the painted layers hold.
  const [artLoaded, setArtLoaded] = useState(false);
  useEffect(() => {
    const bump = () => force(x => x + 1);
    window.addEventListener('driftwood:world-event', bump);
    window.addEventListener('driftwood:castaway-changed', bump);
    window.addEventListener('focus', bump);
    return () => {
      window.removeEventListener('driftwood:world-event', bump);
      window.removeEventListener('driftwood:castaway-changed', bump);
      window.removeEventListener('focus', bump);
    };
  }, []);

  const sky = skyColors();
  const needs = readNeeds();
  const together = needs.find(n => n.id === 'together')?.level ?? 0.15;
  const planks = planksEarned();
  const embers = embersHeld();
  const crew = readCrew();
  const ai = aiCastaways();
  const me = activeCastaway();
  const night = !sky.sun;

  // The fire burns as tall as the week was tended (bible law, literal).
  const fireScale = 0.5 + together * 0.9;

  return (
    <div className="rounded-[2rem] overflow-hidden border-2 border-outline-variant mb-4 select-none">
      {/* ── THE SCENE ── */}
      <div className="relative h-52" style={{ background: `linear-gradient(${sky.top}, ${sky.bottom})` }}>
        {/* the real painting; the living elements ride on top of it */}
        <img src={sky.backdrop} alt="" aria-hidden
          className="absolute inset-0 w-full h-full object-cover object-bottom"
          onLoad={() => setArtLoaded(true)}
          onError={e => { (e.target as HTMLImageElement).style.display = 'none'; setArtLoaded(false); }} />
        {/* a quiet foot of shadow so fire/planks/lanterns seat on any painting */}
        {artLoaded && <div className="absolute bottom-0 inset-x-0 h-14" style={{ background: 'linear-gradient(transparent, rgba(30,20,8,0.28))' }} />}
        {/* the CSS-painted scene — stands down when the real painting loads */}
        {!artLoaded && (<>
        {/* sun / moon */}
        <div className="absolute top-4 right-8 w-9 h-9 rounded-full"
          style={{ background: night ? '#E8E4D8' : '#FFD98A', boxShadow: night ? '0 0 18px #E8E4D877' : '0 0 26px #FFD98A99' }} />
        {night && <div className="absolute top-6 left-10 text-[8px] text-white/70">✦&nbsp;&nbsp;✦<br/>&nbsp;&nbsp;✦</div>}

        {/* the jungle behind (the connected island — LANCE's world rises back there) */}
        <div className="absolute bottom-16 left-0 right-0 h-14 opacity-60"
          style={{ background: `radial-gradient(60% 100% at 20% 100%, ${night ? '#17301F' : '#2F6B43'} 0%, transparent 70%), radial-gradient(50% 90% at 70% 100%, ${night ? '#14291B' : '#28603B'} 0%, transparent 70%)` }} />

        {/* the sea */}
        <div className="absolute bottom-10 left-0 right-0 h-12"
          style={{ background: `linear-gradient(${night ? '#22405C' : '#57B3C4'}, ${night ? '#1B3049' : '#3E93A8'})` }}>
          <div className="absolute inset-x-0 top-1 h-[2px] bg-white/25" />
          <div className="absolute inset-x-8 top-4 h-[1.5px] bg-white/15" />
        </div>

        {/* the beach */}
        <div className="absolute bottom-0 left-0 right-0 h-12"
          style={{ background: `linear-gradient(${night ? '#8C7A5E' : '#EBD9B4'}, ${night ? '#6E5F49' : '#D9C49A'})` }} />
        </>)}

        {/* THE FIRE — height = TOGETHER, the thesis rendered */}
        <div className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center" style={{ transform: `translateX(-50%) scale(${fireScale})`, transformOrigin: 'bottom center' }}>
          <div className="text-2xl leading-none" style={{ filter: `drop-shadow(0 0 ${8 + together * 14}px rgba(255,166,77,0.8))` }}>🔥</div>
          <div className="flex gap-0.5 -mt-0.5"><span className="text-[9px]">🪵</span><span className="text-[9px]">🪵</span></div>
        </div>

        {/* THE PLANK STACK — the wage in wood, keep-forever */}
        <div className="absolute bottom-2 left-4 flex flex-col-reverse items-start gap-[2px]" title={`${planks} planks — every one earned, none ever lost`}>
          {Array.from({ length: Math.min(planks, 8) }).map((_, i) => (
            <div key={i} className="h-[5px] rounded-sm" style={{ width: `${34 - (i % 3) * 4}px`, background: night ? '#7A6248' : '#A5805A', border: '1px solid rgba(0,0,0,0.15)' }} />
          ))}
          {planks > 8 && <span className="text-[8px] font-black text-white/80 bg-black/25 rounded px-1 mb-0.5">×{planks}</span>}
        </div>

        {/* THE JUMBLE — the little robots in the rocks (art lands later; they wave now) */}
        <button
          onClick={() => onOpenTool('ask_the_jumble')}
          className="absolute bottom-3 right-3 flex flex-col items-center cursor-pointer group"
          title="The Jumble — the little robots the sea brought in"
        >
          <div className="flex gap-0.5 text-sm group-hover:scale-110 transition-transform">🤖<span className="text-xs">🤖</span></div>
          <span className="text-[7px] font-black uppercase tracking-wider text-white bg-black/30 rounded-full px-1.5 mt-0.5">the Jumble</span>
        </button>

        {/* THE LANTERN DOCK — one per castaway; lit = real work this week */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 translate-x-10 flex items-end gap-1.5">
          {THE_SEVEN.map(slot => {
            const claimed = crew.find(c => c.slotId === slot.id);
            if (!claimed) return null;
            const lit = lanternLit(slot.id);
            return (
              <div key={slot.id} className="flex flex-col items-center" title={`${claimed.name} — ${slot.role}${lit ? ' · lantern lit this week' : ''}`}>
                <span className="text-[10px]" style={{ filter: lit ? 'drop-shadow(0 0 6px rgba(255,196,110,0.9))' : 'grayscale(1) opacity(0.45)' }}>🏮</span>
                <span className="text-[6px] font-bold text-white/80 bg-black/25 rounded px-0.5">{claimed.name.slice(0, 6)}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* THE ONE DOOR — the 2026-07-12 island law: every challenge, every
          game, lives ON the island now. This is the hero action of the whole
          app, not one of a row of equals — so it reads like one. */}
      <div className="bg-white p-3 border-t-2 border-outline-variant">
        {/* THE FIRST NUDGE (2026-07-16): until the family closes their first
            milestone, the door wears the boy's own boat and points the way —
            words + a bouncing arrow, gone forever after milestone one. */}
        {(() => {
          try {
            const s = JSON.parse(localStorage.getItem('driftwood_milestone_log_v1') || 'null');
            const closed = Array.isArray(s?.closed) ? s.closed.length : 0;
            if (closed > 0) return null;
          } catch { /* fresh shore — show the nudge */ }
          return (
            <button onClick={enterIsland}
              className="w-full relative overflow-hidden rounded-[1.75rem] mb-2 text-left cursor-pointer active:scale-[0.99] transition-all"
              style={{ height: 108 }}>
              <img src="/story/act0/p3_the_sail.jpg" alt="" aria-hidden
                className="absolute inset-0 w-full h-full object-cover story-kenburns"
                onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(7,33,31,0.82), rgba(7,33,31,0.25))' }} />
              <div className="absolute inset-0 flex items-center gap-3 px-4">
                <span className="text-2xl animate-bounce shrink-0">👇</span>
                <div>
                  <p className="text-[13px] font-display font-black text-white">Your first challenge is waiting on the island</p>
                  <p className="text-[10.5px] font-bold text-amber-200/90">walk to the glowing circle marked START HERE — the crew will meet you there</p>
                </div>
              </div>
            </button>
          );
        })()}
        <button onClick={enterIsland} data-testid="walk-island"
          className="w-full flex items-center gap-3 p-4 rounded-[1.75rem] text-left cursor-pointer active:scale-[0.99] transition-all"
          style={{ background: 'linear-gradient(120deg,#0E7C7C,#2E96B5)', boxShadow: '0 10px 28px rgba(14,124,124,0.35)' }}>
          <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-center text-2xl shrink-0">🏝</div>
          <div className="flex-1 min-w-0">
            <div className="text-base font-display font-black text-white">Enter the Island</div>
            <div className="text-[10.5px] font-bold text-white/80">every challenge, every game — walk to it, live</div>
          </div>
          {(() => { // the shell run rides the door — the family's treasure count
            try {
              const n = Object.keys(JSON.parse(localStorage.getItem('driftwood_shells_v1') || '{}')).length;
              return n > 0 ? <span data-testid="shell-count" className="shrink-0 text-[10px] font-black text-white bg-white/20 rounded-full px-2.5 py-1">🐚 {n}/40</span> : null;
            } catch { return null; }
          })()}
        </button>
        {/* Same island, alternate bodies — headset and mixed-reality doors stay
            one tap away, quiet and secondary; they are NOT a bypass. */}
        <div className="flex gap-2 mt-2">
          <a href="/vr/index.html" data-testid="vr-door"
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-outline-variant/60 bg-slate-50 hover:bg-slate-100 active:scale-[0.99] transition-all cursor-pointer">
            <span className="text-sm">🥽</span>
            <span className="text-[9.5px] font-black text-slate-600 uppercase tracking-wide">VR headset</span>
          </a>
          <a href="/mr/index.html" data-testid="mr-door"
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-outline-variant/60 bg-slate-50 hover:bg-slate-100 active:scale-[0.99] transition-all cursor-pointer">
            <span className="text-sm">🔥</span>
            <span className="text-[9.5px] font-black text-slate-600 uppercase tracking-wide">Mixed reality</span>
          </a>
        </div>
      </div>

      {/* ── THE FIVE NEEDS ── */}
      <div className="bg-white p-3 border-t-2 border-outline-variant">
        <div className="grid grid-cols-5 gap-1.5">
          {needs.map(n => (
            <div key={n.id} className="flex flex-col items-center gap-1" title={`${n.label} — fed by ${n.fedBy}`}>
              <span className="text-sm">{n.emoji}</span>
              <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${Math.round(n.level * 100)}%`, background: n.id === 'together' ? '#F59E0B' : '#57B3C4' }} />
              </div>
              <span className={`text-[7px] font-black uppercase tracking-wide ${n.id === 'together' ? 'text-amber-600' : 'text-slate-400'}`}>{n.label}</span>
            </div>
          ))}
        </div>
        <p className="text-[8px] text-slate-400 text-center mt-2 italic">
          TOGETHER refills only together — a low meter is an invitation, never a verdict. The camp never shrinks.
        </p>
        <div className="flex items-center justify-center gap-3 mt-1.5 text-[9px] font-black text-slate-500 flex-wrap">
          <span title="Planks — earned by milestones and real work; never lost">🪵 {planks} planks</span>
          <span title="Embers — the small currency; feed the fire, light lanterns">✨ {embers} embers</span>
          <span title="Matches — struck by checked steps on the trail; they feed Warmth">🔥 {matchesHeld()} matches</span>
          <span title="Rations — landed by checked steps on the trail; they feed Food">🍲 {rationsHeld()} rations</span>
          <span className="text-slate-300">·</span>
          <span className="text-slate-400 font-bold">{me.avatar} {me.name} · {me.roleText}</span>
        </div>
        {ai.length > 0 && crew.length > 0 && (
          <p className="text-[8px] text-slate-400 text-center mt-1">
            {ai.length} unclaimed {ai.length === 1 ? 'castaway keeps' : 'castaways keep'} camp as robot hands — honest AI, they never pretend to be family.
          </p>
        )}
      </div>

    </div>
  );
}
