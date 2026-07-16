import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Sparkles, KeyRound, Users, User, Heart, Baby, MapPin } from 'lucide-react';
import {
  CITY_REGIONS,
  CITY_PLACES,
  cityStats,
  type Audience,
  type CityPlace,
} from '../data/driftwoodCity';
import CityScene from './CityScene';

// ═════════════════════════════════════════════════════════════════════════════
//  DRIFTWOOD CITY — the wooden supersystem the Driftwood robots built, as a
//  place you can walk. A full-screen overlay in the warm client register (this
//  is a castaway-facing room, not a clinician one). Seven regions, twenty-seven
//  places, somewhere for everyone, and two caves that keep a little mystery.
//
//  It reads ONE source of truth — src/data/driftwoodCity.ts — the same file the
//  VR island and the board game read, so the city is identical everywhere.
//  Places that name a Driftwood tool open it through the app's normal treaty
//  (onOpenTool → driftwood:open-tool), so the city never becomes a dead map.
// ═════════════════════════════════════════════════════════════════════════════

const AUDIENCES: { id: Audience; label: string; icon: typeof Users }[] = [
  { id: 'everyone',  label: 'Everyone', icon: MapPin },
  { id: 'solo',      label: 'Solo',     icon: User },
  { id: 'couples',   label: 'Couples',  icon: Heart },
  { id: 'families',  label: 'Families', icon: Users },
  { id: 'kids',      label: 'Kids',     icon: Baby },
];

export default function DriftwoodCity({
  onClose,
  onOpenTool,
}: {
  onClose: () => void;
  onOpenTool?: (toolId: string) => void;
}) {
  const [filter, setFilter] = useState<Audience>('everyone');
  const [openMystery, setOpenMystery] = useState<string | null>(null);

  const visible = (p: CityPlace) =>
    filter === 'everyone' ? true : p.audience.includes(filter) || p.audience.includes('everyone');

  return (
    <div className="absolute inset-0 z-40 overflow-y-auto" style={{ background: '#f6efe3' }}>
      {/* wood-grain wash so the whole city feels carved, not printed */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            'radial-gradient(1200px 600px at 20% -10%, rgba(184,128,74,.16), transparent 60%),' +
            'radial-gradient(900px 500px at 100% 0%, rgba(99,179,74,.12), transparent 55%)',
        }}
      />

      <div className="relative mx-auto w-full max-w-5xl px-4 pb-16 pt-4">
        {/* ── The hero plate: the city DARK until the 31 light it (chapter 18 →
            milestone 31). The same storage signal the lamps use — no new law,
            just the reward made visible at the door. ── */}
        <CityHero />

        {/* ── The city sign ── */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🪵</span>
              <h1 className="font-display text-2xl font-black tracking-tight" style={{ color: '#7a4f22' }}>
                Driftwood City
              </h1>
            </div>
            <p className="mt-1 text-[13px] font-medium" style={{ color: '#9a7648' }}>
              A little wooden city the robots built — somewhere for just about anyone.
            </p>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 rounded-full p-2 transition-colors"
            style={{ background: '#efe3cf', color: '#7a4f22' }}
            aria-label="Leave the city"
            title="Back to the island"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* ── The little placard of counts ── */}
        <div className="mt-3 flex flex-wrap gap-2">
          <Placard n={cityStats.regions} label="regions" />
          <Placard n={cityStats.places} label="places to go" />
          <Placard n={cityStats.mysteries} label="caves with mysteries" icon />
        </div>

        {/* ── Who's visiting? (audience filter) ── */}
        <div className="mt-4 flex flex-wrap gap-2">
          {AUDIENCES.map(a => {
            const Icon = a.icon;
            const active = filter === a.id;
            return (
              <button
                key={a.id}
                onClick={() => setFilter(a.id)}
                className="flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12px] font-bold transition-all"
                style={
                  active
                    ? { background: '#7a4f22', color: '#fff', boxShadow: '0 2px 8px rgba(122,79,34,.35)' }
                    : { background: '#efe3cf', color: '#8a6a3f' }
                }
              >
                <Icon className="h-3.5 w-3.5" />
                {a.label}
              </button>
            );
          })}
        </div>

        {/* ── The regions ── */}
        <div className="mt-6 space-y-8">
          {CITY_REGIONS.map(region => {
            const places = CITY_PLACES.filter(p => p.region === region.id && visible(p));
            if (places.length === 0) return null;
            return (
              <section key={region.id}>
                <div className="mb-3 flex items-center gap-2.5">
                  <span
                    className="grid h-9 w-9 place-items-center rounded-xl text-lg shadow-sm"
                    style={{ background: '#fff', border: `2px solid ${region.color}` }}
                  >
                    {region.glyph}
                  </span>
                  <div>
                    <h2 className="font-display text-[17px] font-black leading-tight" style={{ color: region.color }}>
                      {region.name}
                    </h2>
                    <p className="text-[11px] font-medium italic" style={{ color: '#9a7648' }}>
                      {region.tagline}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {places.map((p, i) => (
                    <motion.article
                      key={p.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(i * 0.03, 0.25), duration: 0.3 }}
                      className="overflow-hidden rounded-2xl bg-white shadow-sm"
                      style={{ border: '1px solid rgba(122,79,34,.10)' }}
                    >
                      {/* Generative wooden scene — unique per place, tinted to the region */}
                      <CityScene placeId={p.id} region={p.region} glyph={p.glyph} height={84} />
                      <div className="flex items-start gap-3 p-3.5 pt-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <h3 className="truncate font-bold text-[14px]" style={{ color: '#4a3520' }}>
                              {p.name}
                            </h3>
                            {p.mystery && (
                              <span title="Hides a little mystery">
                                <Sparkles className="h-3.5 w-3.5" style={{ color: '#b8804a' }} />
                              </span>
                            )}
                          </div>
                          <p className="mt-0.5 text-[12px] font-semibold leading-snug" style={{ color: '#6b5638' }}>
                            {p.purpose}
                          </p>
                          <p className="mt-1 text-[11.5px] leading-snug italic" style={{ color: '#9a855f' }}>
                            {p.vibe}
                          </p>

                          {/* audience pips */}
                          <div className="mt-2 flex flex-wrap items-center gap-1.5">
                            {p.audience.map(aud => (
                              <span
                                key={aud}
                                className="rounded-full px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wide"
                                style={{ background: '#f1e7d5', color: '#9a7648' }}
                              >
                                {aud}
                              </span>
                            ))}
                          </div>

                          {/* the little mystery, folded away until you tap */}
                          {p.mystery && (
                            <div className="mt-2">
                              <button
                                onClick={() => setOpenMystery(openMystery === p.id ? null : p.id)}
                                className="flex items-center gap-1 text-[11px] font-bold"
                                style={{ color: '#b8804a' }}
                              >
                                <KeyRound className="h-3 w-3" />
                                {openMystery === p.id ? 'Close the mystery' : 'A little mystery…'}
                              </button>
                              {openMystery === p.id && (
                                <motion.p
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  className="mt-1.5 rounded-xl px-3 py-2 text-[11.5px] leading-snug"
                                  style={{ background: '#f4ecd8', color: '#6b5638' }}
                                >
                                  {p.mystery}
                                </motion.p>
                              )}
                            </div>
                          )}

                          {/* if the place opens a real Driftwood tool, let them walk in */}
                          {p.tool && onOpenTool && (
                            <button
                              onClick={() => onOpenTool(p.tool!)}
                              className="mt-2.5 rounded-full px-3 py-1.5 text-[11px] font-bold text-white transition-transform active:scale-95"
                              style={{ background: region.color }}
                            >
                              Step inside →
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        <p className="mt-10 text-center text-[11px] italic" style={{ color: '#a98d63' }}>
          Built plank by plank by the Driftwood robots · more places keep going up
        </p>
      </div>
    </div>
  );
}

// The door plate. Dark city until all 31 milestones close, then the night the
// whole thing comes on. Reads the same milestone log the lamps key to; if the
// commissioned plates are missing it renders nothing — the page stands alone.
function CityHero() {
  const [ok, setOk] = useState(true);
  const closed = (() => {
    try {
      const s = JSON.parse(localStorage.getItem('driftwood_milestone_log_v1') || 'null');
      return Array.isArray(s?.closed) ? s.closed.length : Array.isArray(s) ? s.length : 0;
    } catch { return 0; }
  })();
  const lit = closed >= 31;
  if (!ok) return null;
  return (
    <div className="relative mb-4 overflow-hidden rounded-2xl shadow-lg" style={{ height: 180 }}>
      <img
        src={lit ? '/city/_city-lit.jpg' : '/city/_city-dark.jpg'} alt=""
        className="story-kenburns h-full w-full object-cover"
        onError={() => setOk(false)}
      />
      {lit && (
        // the night the city came on, kept breathing — the lit hero's motion
        // twin plays when it exists; the still is its poster (2026-07-16)
        <video src="/city/_city-lit.mp4" autoPlay muted loop playsInline aria-hidden
          className="absolute inset-0 h-full w-full object-cover"
          style={{ opacity: 0.999 }}
          onError={e => { (e.target as HTMLVideoElement).style.display = 'none'; }} />
      )}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-4 pb-2.5 pt-8">
        <p className="text-[11px] font-black uppercase tracking-[0.18em] text-white/90">
          {lit
            ? 'Every lamp is burning — this family was never a storm'
            : `Hundreds of lamps that have never been lit · ${closed} of 31 places glowing`}
        </p>
      </div>
    </div>
  );
}

function Placard({ n, label, icon }: { n: number; label: string; icon?: boolean }) {
  return (
    <div
      className="flex items-center gap-1.5 rounded-xl px-3 py-1.5"
      style={{ background: '#fff', border: '1px solid rgba(122,79,34,.12)' }}
    >
      {icon && <Sparkles className="h-3.5 w-3.5" style={{ color: '#b8804a' }} />}
      <span className="text-[15px] font-black" style={{ color: '#7a4f22' }}>
        {n}
      </span>
      <span className="text-[11px] font-semibold" style={{ color: '#9a7648' }}>
        {label}
      </span>
    </div>
  );
}
