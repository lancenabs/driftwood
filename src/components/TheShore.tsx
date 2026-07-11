import React, { useEffect, useState } from 'react';
import { readNeeds, planksEarned, embersHeld, lanternLit, appendEvent } from '../lib/world';
import { THE_SEVEN, readCrew, aiCastaways, activeCastaway, setActiveCastaway } from '../lib/castaways';
import GamesMenu from './games/GamesMenu';
// (the 2D seek map remains the Gathering bar's game; the shore door now opens
// the REAL island — public/island3d/, third person, the Horizon-mobile shape)

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
  const [walking, setWalking] = useState(false);   // 🏝 the one-click island door
  const [firing, setFiring] = useState(false);     // 🔥 the Fire Quiz
  useEffect(() => {
    const bump = () => force(x => x + 1);
    // the 3D island's "← the shore" button lands here; the campfire's
    // "gather round" opens the games right over the island
    const leave = (e: MessageEvent) => {
      if (e.data?.type === 'driftwood:leave-island') setWalking(false);
      if (e.data?.type === 'driftwood:open-games') setFiring(true);
    };
    // ANY door into the island (the shore button OR the Gathering bar) opens
    // the same 3D world — one island, no confusion.
    const enter = () => setWalking(true);
    window.addEventListener('driftwood:world-event', bump);
    window.addEventListener('driftwood:castaway-changed', bump);
    window.addEventListener('focus', bump);
    window.addEventListener('message', leave);
    window.addEventListener('driftwood:walk-island', enter);
    return () => {
      window.removeEventListener('driftwood:world-event', bump);
      window.removeEventListener('driftwood:castaway-changed', bump);
      window.removeEventListener('focus', bump);
      window.removeEventListener('message', leave);
      window.removeEventListener('driftwood:walk-island', enter);
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

      {/* 🏝 ENTER THE ISLAND — the unmissable door into the 3D world. Third
          person, your avatar, the Jumble at their posts. Solo works; the
          Gathering brings the family onto the same ground live. */}
      <button onClick={() => setWalking(true)} data-testid="walk-island"
        className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-[#3ECFCF] to-[#7FD98C] text-white font-black text-sm cursor-pointer hover:brightness-105 active:brightness-95 transition-all border-t-2 border-outline-variant">
        <span className="text-lg">🏝</span>
        <span className="uppercase tracking-wide">Enter the Island</span>
        <span className="text-[10px] font-bold opacity-90 normal-case">· walk it in 3D, meet the wood robots</span>
      </button>

      {/* 🏕️ CAMPFIRE GAMES — the reconnection mini-games. Build a shared fire by
          learning each other; every game warms the whole family's camp. */}
      <button onClick={() => setFiring(true)} data-testid="fire-quiz"
        className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-sm cursor-pointer hover:brightness-105 active:brightness-95 transition-all border-t-2 border-outline-variant">
        <span className="text-lg">🏕️</span>
        <span className="uppercase tracking-wide">Campfire Games</span>
        <span className="text-[10px] font-bold opacity-90 normal-case">· learn each other, warm the family, together</span>
      </button>

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
        <div className="flex items-center justify-center gap-4 mt-1.5 text-[9px] font-black text-slate-500">
          <span title="Planks — earned by milestones and real work; never lost">🪵 {planks} planks</span>
          <span title="Embers — the small currency; feed the fire, light lanterns">✨ {embers} embers</span>
          <span className="text-slate-300">·</span>
          <span className="text-slate-400 font-bold">{me.avatar} {me.name} · {me.roleText}</span>
        </div>
        {ai.length > 0 && crew.length > 0 && (
          <p className="text-[8px] text-slate-400 text-center mt-1">
            {ai.length} unclaimed {ai.length === 1 ? 'castaway keeps' : 'castaways keep'} camp as robot hands — honest AI, they never pretend to be family.
          </p>
        )}
      </div>

      {/* the campfire games menu — Fire Quiz, Two Truths, and the growing rest */}
      {firing && <GamesMenu onClose={() => setFiring(false)} />}

      {/* the island itself, one click deep — 3D, third person, same origin so
          your castaway, your fit, and the live camp all carry over */}
      {walking && (
        <div className="fixed inset-0 z-[60] bg-[#BEE3F0]">
          <iframe src="/island3d/index.html" title="The Island in three dimensions" className="w-full h-full border-0" allow="fullscreen" />
        </div>
      )}
    </div>
  );
}
