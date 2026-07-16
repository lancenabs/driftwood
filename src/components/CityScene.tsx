import { useMemo, useState } from 'react';
import { CITY_REGIONS } from '../data/driftwoodCity';

// ═════════════════════════════════════════════════════════════════════════════
//  CITY SCENE — generative art for every Driftwood City place.
//  No two places share a picture and none of it is a stock asset: each scene is
//  drawn from scratch as layered SVG, seeded by the place id so it's unique but
//  stable (the Golf Park always looks like the Golf Park). The region decides
//  the world — a still lake for the Hollow, layered walls for the Canyon, peaks
//  for the Mountain, wooden rooftops for Timber Town, firefly dark for the
//  Wilds — and the region's colour tints the whole sky. Hand-built, warm, and
//  a little different every time: art everywhere, made in code.
//
//  A stopgap with soul until cinematic art is generated — and honestly, lovely
//  enough to keep.
// ═════════════════════════════════════════════════════════════════════════════

// mulberry32 — a tiny deterministic PRNG so each place is stable across renders.
function rng(seed: number) {
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

function lighten(hex: string, amt: number): string {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.min(255, ((n >> 16) & 255) + amt);
  const g = Math.min(255, ((n >> 8) & 255) + amt);
  const b = Math.min(255, (n & 255) + amt);
  return `rgb(${r},${g},${b})`;
}
function darken(hex: string, amt: number): string { return lighten(hex, -amt); }

export default function CityScene({
  placeId,
  region,
  glyph,
  className,
  height = 96,
}: {
  placeId: string;
  region: string;
  glyph?: string;
  className?: string;
  height?: number;
}) {
  const W = 320, H = 180;
  const reg = CITY_REGIONS.find(r => r.id === region) ?? CITY_REGIONS[0];
  const color = reg.color;

  // The commissioned still (2026-07-16 art run) is preferred; the generative
  // SVG below stays as the honest fallback if the file is missing. The still
  // rides the Ken Burns law — a slow zoom toward the scene's heart.
  const [artOk, setArtOk] = useState(true);

  const scene = useMemo(() => {
    const rand = rng(hash(placeId));
    const r = (a: number, b: number) => a + rand() * (b - a);
    const uid = placeId.replace(/[^a-z0-9]/gi, '');

    // Sky: dawn wash tinted toward the region colour.
    const skyTop = lighten(color, 96);
    const skyMid = lighten(color, 40);
    const sun = { x: r(60, 260), y: r(34, 62), rad: r(15, 24) };

    // The horizon sits near the vertical centre so that — in the wide, short
    // card banner, which slices to the middle — the horizon, the silhouette
    // just above it, and the wooden ground just below it are all always in view.
    const horizon = H * 0.52;
    // A base ground fill so everything below the horizon is solid (never white
    // through the crop), region details paint on top of it.
    const baseGround = `<rect x="0" y="${horizon}" width="${W}" height="${H - horizon}" fill="${darken(color, 46)}"/>`;

    // Region-specific back silhouette, drawn as one path string.
    let back = '';
    let mid = '';
    const silh = darken(color, 30);
    const silh2 = darken(color, 55);

    if (region === 'mountain') {
      const peaks = (base: number, n: number, tint: string) => {
        let d = `M0 ${horizon}`;
        for (let i = 0; i <= n; i++) {
          const x = (W / n) * i;
          const y = base - Math.abs(Math.sin(i * 1.3 + rand() * 2)) * r(40, 72);
          d += ` L${x.toFixed(0)} ${y.toFixed(0)}`;
        }
        d += ` L${W} ${horizon} Z`;
        return `<path d="${d}" fill="${tint}"/>`;
      };
      back = peaks(horizon - 8, 5, silh2);
      mid = peaks(horizon + 6, 6, silh);
    } else if (region === 'canyon') {
      // stacked mesas
      for (let i = 0; i < 4; i++) {
        const y = horizon - 70 + i * 20;
        const x0 = r(-20, 40) + i * 8, w = r(120, 240);
        back += `<rect x="${x0.toFixed(0)}" y="${y.toFixed(0)}" width="${w.toFixed(0)}" height="${(H - y).toFixed(0)}" rx="6" fill="${i % 2 ? silh : silh2}" opacity="${(0.6 + i * 0.1).toFixed(2)}"/>`;
      }
    } else if (region === 'hollow') {
      // gentle hills, a still lake with reflection band below horizon
      let d = `M0 ${horizon}`;
      for (let x = 0; x <= W; x += 40) d += ` Q${x + 20} ${horizon - r(10, 28)} ${x + 40} ${horizon}`;
      d += ` L${W} ${H} L0 ${H} Z`;
      back = `<path d="${d}" fill="${silh}"/>`;
      mid = `<rect x="0" y="${horizon}" width="${W}" height="${H - horizon}" fill="${lighten(color, 20)}" opacity="0.55"/>`;
    } else if (region === 'wilds') {
      // dense tree silhouettes + fireflies handled in foreground
      for (let i = 0; i < 9; i++) {
        const x = r(0, W), th = r(30, 70);
        back += `<polygon points="${x - 12},${horizon} ${x},${horizon - th} ${x + 12},${horizon}" fill="${i % 2 ? silh : silh2}"/>`;
      }
    } else if (region === 'timber') {
      // wooden rooftops
      for (let i = 0; i < 6; i++) {
        const x = r(10, W - 60), w = r(38, 66), h = r(24, 40);
        back += `<polygon points="${x},${horizon} ${(x + w / 2).toFixed(0)},${(horizon - h).toFixed(0)} ${x + w},${horizon}" fill="${i % 2 ? silh : silh2}"/>`;
        back += `<rect x="${x.toFixed(0)}" y="${horizon}" width="${w.toFixed(0)}" height="${(H - horizon).toFixed(0)}" fill="${darken(color, 40)}"/>`;
      }
    } else if (region === 'harbor') {
      // dock posts + a lighthouse
      mid = `<rect x="0" y="${horizon}" width="${W}" height="${H - horizon}" fill="${lighten(color, 10)}" opacity="0.6"/>`;
      const lx = r(40, 260);
      back = `<rect x="${(lx - 7).toFixed(0)}" y="${(horizon - 54).toFixed(0)}" width="14" height="54" fill="${silh}"/>` +
             `<circle cx="${lx.toFixed(0)}" cy="${(horizon - 58).toFixed(0)}" r="7" fill="${lighten(color, 70)}"/>`;
      for (let i = 0; i < 5; i++) { const x = r(0, W); back += `<rect x="${x.toFixed(0)}" y="${(horizon - 10).toFixed(0)}" width="4" height="26" fill="${silh2}"/>`; }
    } else {
      // green — rolling hills + a couple of round trees
      let d = `M0 ${horizon}`;
      for (let x = 0; x <= W; x += 60) d += ` Q${x + 30} ${horizon - r(14, 30)} ${x + 60} ${horizon}`;
      d += ` L${W} ${H} L0 ${H} Z`;
      back = `<path d="${d}" fill="${silh}"/>`;
      for (let i = 0; i < 4; i++) { const x = r(20, W - 20); back += `<circle cx="${x.toFixed(0)}" cy="${(horizon - 6).toFixed(0)}" r="${r(10, 18).toFixed(0)}" fill="${silh2}"/>`; }
    }

    // Foreground wooden plank band just below the horizon — the driftwood
    // signature — with vertical plank seams. Sits in the visible middle band.
    const bandTop = horizon + (H - horizon) * 0.42;
    const ground = `<rect x="0" y="${bandTop.toFixed(0)}" width="${W}" height="${(H - bandTop).toFixed(0)}" fill="${darken(color, 62)}"/>` +
      Array.from({ length: 12 }, (_, i) => `<rect x="${(i * (W / 12)).toFixed(0)}" y="${bandTop.toFixed(0)}" width="1.5" height="${(H - bandTop).toFixed(0)}" fill="${darken(color, 74)}" opacity="0.5"/>`).join('');

    // Fireflies for the Wilds; soft light motes near the horizon elsewhere.
    const motes = region === 'wilds'
      ? Array.from({ length: 14 }, () => `<circle cx="${r(6, W - 6).toFixed(0)}" cy="${r(horizon - 40, horizon + 10).toFixed(0)}" r="${r(1, 2.4).toFixed(1)}" fill="#ffe9a8"/>`).join('')
      : Array.from({ length: 6 }, () => `<circle cx="${r(6, W - 6).toFixed(0)}" cy="${r(horizon - 34, horizon - 4).toFixed(0)}" r="${r(1, 2).toFixed(1)}" fill="#ffffff" opacity="0.5"/>`).join('');

    return { skyTop, skyMid, sun, baseGround, back, mid, ground, motes, uid };
  }, [placeId, region, color]);

  if (artOk) {
    return (
      <div className={className} style={{ height, overflow: 'hidden', display: 'block', position: 'relative' }}>
        <img
          src={`/city/${placeId}.jpg`} alt=""
          className="story-kenburns"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          onError={() => setArtOk(false)}
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      height={height}
      preserveAspectRatio="xMidYMid slice"
      className={className}
      role="img"
      aria-label={`A wooden scene of this place in Driftwood City`}
      style={{ display: 'block' }}
    >
      <defs>
        <linearGradient id={`sky-${scene.uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={scene.skyTop} />
          <stop offset="100%" stopColor={scene.skyMid} />
        </linearGradient>
        <radialGradient id={`sun-${scene.uid}`}>
          <stop offset="0%" stopColor="#fff8e6" />
          <stop offset="100%" stopColor={lighten(color, 60)} stopOpacity="0.2" />
        </radialGradient>
      </defs>
      <rect x="0" y="0" width={W} height={H} fill={`url(#sky-${scene.uid})`} />
      <circle cx={scene.sun.x} cy={scene.sun.y} r={scene.sun.rad} fill={`url(#sun-${scene.uid})`} />
      <g dangerouslySetInnerHTML={{ __html: scene.baseGround + scene.back + scene.mid + scene.motes + scene.ground }} />
      {glyph && (
        <text x={W - 22} y={H - 30} fontSize="26" textAnchor="middle" opacity="0.92">{glyph}</text>
      )}
    </svg>
  );
}
