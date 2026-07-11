import React, { useEffect, useRef, useState } from 'react';
import GameShell, { feedTogether, partnerName } from './GameShell';
import { activeCastaway } from '../../lib/castaways';

// ═════════════════════════════════════════════════════════════════════════════
//  SAND DRAWINGS (ice-breaker · roadmap #4). One partner describes a shared
//  memory in words ONLY; the other draws it in the sand with a finger. Then the
//  reveal — the gap between what was said and what was drawn is the laugh, and
//  the laugh is the medicine (shared humor is a Gottman repair in disguise).
//  No scoring, no judging: the tide takes every drawing anyway.
// ═════════════════════════════════════════════════════════════════════════════

const MEMORY_DEALS = [
  'the place we first met', 'our worst car trouble', 'the ugliest thing in our first home',
  'a meal one of us ruined', 'the pet (or the pet we almost got)', 'our most lost we have ever been',
  'the wedding moment nobody planned', 'the beach day that went sideways', 'what the kids did to the sofa',
  'the halloween costume disaster',
];

export default function SandDrawings({ onClose }: { onClose: () => void }) {
  const me = activeCastaway();
  const partner = partnerName();
  const [phase, setPhase] = useState<'intro' | 'draw' | 'reveal'>('intro');
  const [deal, setDeal] = useState('');
  const [teller, setTeller] = useState(me.name || 'You');
  const [rounds, setRounds] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);

  const dealOne = () => {
    setDeal(MEMORY_DEALS[Math.floor(Math.random() * MEMORY_DEALS.length)]);
    setPhase('draw');
  };

  useEffect(() => {
    if (phase !== 'draw') return;
    const c = canvasRef.current; if (!c) return;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const w = c.clientWidth, h = c.clientHeight;
    c.width = w * dpr; c.height = h * dpr;
    const x = c.getContext('2d')!;
    x.scale(dpr, dpr);
    // the sand
    x.fillStyle = '#E8C87E'; x.fillRect(0, 0, w, h);
    for (let i = 0; i < 420; i++) {
      x.fillStyle = `rgba(${150 + Math.random() * 60},${110 + Math.random() * 50},60,${0.12 + Math.random() * 0.1})`;
      x.beginPath(); x.arc(Math.random() * w, Math.random() * h, 0.8 + Math.random() * 1.4, 0, 7); x.fill();
    }
    // finger-in-sand strokes: dark groove + light kicked-up edge
    const pt = (e: PointerEvent) => {
      const r = c.getBoundingClientRect();
      return { px: e.clientX - r.left, py: e.clientY - r.top };
    };
    let last: { px: number; py: number } | null = null;
    const down = (e: PointerEvent) => { drawing.current = true; last = pt(e); c.setPointerCapture(e.pointerId); };
    const move = (e: PointerEvent) => {
      if (!drawing.current || !last) return;
      const p = pt(e);
      x.lineCap = 'round';
      x.strokeStyle = 'rgba(255,235,190,0.9)'; x.lineWidth = 9;
      x.beginPath(); x.moveTo(last.px, last.py + 1.5); x.lineTo(p.px, p.py + 1.5); x.stroke();
      x.strokeStyle = '#9A7B42'; x.lineWidth = 5.5;
      x.beginPath(); x.moveTo(last.px, last.py); x.lineTo(p.px, p.py); x.stroke();
      last = p;
    };
    const up = () => { drawing.current = false; last = null; };
    c.addEventListener('pointerdown', down);
    c.addEventListener('pointermove', move);
    c.addEventListener('pointerup', up);
    c.addEventListener('pointercancel', up);
    return () => {
      c.removeEventListener('pointerdown', down);
      c.removeEventListener('pointermove', move);
      c.removeEventListener('pointerup', up);
      c.removeEventListener('pointercancel', up);
    };
  }, [phase, deal]);

  const artist = teller === (me.name || 'You') ? partner : (me.name || 'You');

  const tideTakes = () => {
    setRounds(r => r + 1);
    feedTogether('sand_drawings', { round: rounds + 1 });
    setPhase('reveal');
  };

  const swapAndDeal = () => {
    setTeller(artist);
    dealOne();
  };

  return (
    <GameShell emoji="🖐" title="Sand Drawings" subtitle="one voice, one finger · the gap is the laugh"
      onClose={onClose} bg="linear-gradient(#1E3A4A, #2E4A50 55%, #B99B60)">
      <div className="px-5 py-5 flex flex-col justify-center min-h-[70%]">
        {phase === 'intro' && (
          <div className="max-w-sm mx-auto w-full text-center flex flex-col gap-4">
            <div className="text-5xl">🖐🏖</div>
            <p className="text-white/90 text-sm font-bold">One of you tells a memory. The other draws it in the sand.</p>
            <p className="text-[11px] text-white/70 italic leading-relaxed">
              Teller: words only — no pointing, no "no, not like that." Artist: draw what you HEAR. Then hold up the sand and compare it to what the teller had in their head. The gap between the two? That's where the laugh lives. The tide takes every masterpiece anyway.
            </p>
            <button onClick={dealOne} data-testid="sd-start" className="bg-gradient-to-r from-cyan-600 to-amber-600 text-white font-black rounded-xl py-3 text-sm">Deal a memory →</button>
          </div>
        )}
        {phase === 'draw' && (
          <div className="max-w-sm mx-auto w-full flex flex-col gap-3">
            <div className="bg-white/95 rounded-2xl px-4 py-3 text-center">
              <p className="text-[9px] font-black uppercase tracking-wide text-cyan-700">🗣 {teller} describes (words only!)</p>
              <p className="text-slate-800 font-black text-sm">{deal}</p>
            </div>
            <p className="text-center text-[10px] font-black uppercase tracking-widest text-amber-300">🖐 {artist} draws what they hear</p>
            <canvas ref={canvasRef} data-testid="sd-canvas"
              className="w-full h-64 rounded-2xl touch-none" style={{ touchAction: 'none' }} />
            <button onClick={tideTakes} data-testid="sd-done" className="bg-amber-500 text-white font-black rounded-xl py-3 text-sm">Hold it up — compare! →</button>
          </div>
        )}
        {phase === 'reveal' && (
          <div className="max-w-sm mx-auto w-full text-center flex flex-col gap-4">
            <div className="text-5xl">🌊😂</div>
            <p className="text-white text-lg font-black">Was it even close?</p>
            <p className="text-white/80 text-sm leading-relaxed">
              {teller}, say what was actually in your head. {artist}, defend your art. The difference between the telling and the drawing is the good part — that's two heads holding one memory, and the tide's already coming for it.
            </p>
            <div className="flex gap-2">
              <button onClick={swapAndDeal} data-testid="sd-swap" className="flex-1 bg-white/15 border-2 border-white/25 text-white font-black rounded-xl py-2.5 text-sm">Swap roles · new memory</button>
              <button onClick={onClose} className="flex-1 bg-amber-500 text-white font-black rounded-xl py-2.5 text-sm">Back to the campfire</button>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
}
