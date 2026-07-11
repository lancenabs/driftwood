// ═════════════════════════════════════════════════════════════════════════════
//  THE SHIP'S THREE SOUNDS — and only three (dinner-theatre eval §5-7).
//  Candle-light, not casino: a bell when a case closes, a low creak when the
//  casebook opens, a match-strike spark when an instrument is commissioned.
//  All synthesized (no asset files, works offline), all silent in quiet mode.
// ═════════════════════════════════════════════════════════════════════════════


let ctx: AudioContext | null = null;
function audio(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try { if (localStorage.getItem('driftwood_quiet_v1') === '1') return null; } catch { /* sound on */ }
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return null;
  try {
    const AC = window.AudioContext || (window as any).webkitAudioContext;
    if (!AC) return null;
    if (!ctx) ctx = new AC();
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});
    return ctx;
  } catch { return null; }
}

/** The watch bell — one warm strike with a long brass decay. Case closed. */
export function driftBell() {
  const c = audio(); if (!c) return;
  const now = c.currentTime;
  // A bell is a fundamental plus slightly inharmonic partials.
  for (const [ratio, gain, decay] of [[1, 0.20, 2.2], [2.76, 0.08, 1.4], [5.4, 0.03, 0.8]] as const) {
    const o = c.createOscillator(); const g = c.createGain();
    o.type = 'sine'; o.frequency.value = 392 * ratio;        // G4 fundamental
    g.gain.setValueAtTime(gain, now);
    g.gain.exponentialRampToValueAtTime(0.0001, now + decay);
    o.connect(g).connect(c.destination);
    o.start(now); o.stop(now + decay);
  }
}

/** The hull's low creak — the casebook opening, the room leaning in. */
export function tideCreak() {
  const c = audio(); if (!c) return;
  const now = c.currentTime;
  const o = c.createOscillator(); const g = c.createGain(); const f = c.createBiquadFilter();
  o.type = 'sawtooth';
  o.frequency.setValueAtTime(68, now);
  o.frequency.linearRampToValueAtTime(52, now + 0.5);        // wood settling downward
  f.type = 'lowpass'; f.frequency.value = 220; f.Q.value = 6;
  g.gain.setValueAtTime(0.0001, now);
  g.gain.exponentialRampToValueAtTime(0.06, now + 0.12);
  g.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
  o.connect(f).connect(g).connect(c.destination);
  o.start(now); o.stop(now + 0.65);
}

/** The match-strike — a short bright scratch and a soft flame bloom. Commission. */
export function emberPop() {
  const c = audio(); if (!c) return;
  const now = c.currentTime;
  // the scratch: a burst of filtered noise
  const len = Math.floor(c.sampleRate * 0.09);
  const buf = c.createBuffer(1, len, c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
  const src = c.createBufferSource(); src.buffer = buf;
  const hp = c.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 1800;
  const ng = c.createGain(); ng.gain.value = 0.12;
  src.connect(hp).connect(ng).connect(c.destination);
  src.start(now);
  // the bloom: a warm tone swelling in behind it
  const o = c.createOscillator(); const g = c.createGain();
  o.type = 'triangle'; o.frequency.value = 523;              // C5, small and warm
  g.gain.setValueAtTime(0.0001, now + 0.06);
  g.gain.exponentialRampToValueAtTime(0.05, now + 0.16);
  g.gain.exponentialRampToValueAtTime(0.0001, now + 0.7);
  o.connect(g).connect(c.destination);
  o.start(now + 0.06); o.stop(now + 0.75);
}
