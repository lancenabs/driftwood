export type AmbientMood = 'breathe' | 'calm' | 'focus' | 'transition' | 'ocean' | 'off';

interface AmbientState {
  ctx: AudioContext;
  nodes: AudioNode[];
}

let state: AmbientState | null = null;
let currentMood: AmbientMood = 'off';

function getCtx(): AudioContext {
  if (state?.ctx.state !== 'closed') return state!.ctx;
  return new (window.AudioContext || (window as any).webkitAudioContext)();
}

function stopAll() {
  if (!state) return;
  state.nodes.forEach(n => { try { (n as any).stop?.(); n.disconnect(); } catch {} });
  state.nodes = [];
  currentMood = 'off';
}

function makeNoise(ctx: AudioContext, duration = 2): AudioBuffer {
  const sampleRate = ctx.sampleRate;
  const buffer = ctx.createBuffer(2, sampleRate * duration, sampleRate);
  for (let c = 0; c < 2; c++) {
    const data = buffer.getChannelData(c);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < data.length; i++) {
      const white = Math.random() * 2 - 1;
      // Pink noise approximation (Paul Kellet)
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    }
  }
  return buffer;
}

// ─── Mood implementations ────────────────────────────────────────────────────

function startBreathe(ctx: AudioContext, masterGain: GainNode): AudioNode[] {
  const nodes: AudioNode[] = [masterGain];

  // Low drone base
  const osc1 = ctx.createOscillator();
  const g1 = ctx.createGain();
  osc1.type = 'sine';
  osc1.frequency.value = 80;
  g1.gain.value = 0.18;
  osc1.connect(g1); g1.connect(masterGain);
  osc1.start();

  // Octave harmonic
  const osc2 = ctx.createOscillator();
  const g2 = ctx.createGain();
  osc2.type = 'sine';
  osc2.frequency.value = 160;
  g2.gain.value = 0.08;
  osc2.connect(g2); g2.connect(masterGain);
  osc2.start();

  // Very slow LFO modulating the gain — creates breath-like pulse (8s per cycle)
  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  lfo.type = 'sine';
  lfo.frequency.value = 0.125;  // 8-second cycle
  lfoGain.gain.value = 0.07;
  lfo.connect(lfoGain); lfoGain.connect(g1.gain);
  lfo.start();

  // Soft pink noise layer (air texture)
  const noiseBuffer = makeNoise(ctx, 4);
  const noiseSource = ctx.createBufferSource();
  noiseSource.buffer = noiseBuffer;
  noiseSource.loop = true;
  const noiseFilter = ctx.createBiquadFilter();
  noiseFilter.type = 'lowpass';
  noiseFilter.frequency.value = 400;
  const noiseGain = ctx.createGain();
  noiseGain.gain.value = 0.04;
  noiseSource.connect(noiseFilter); noiseFilter.connect(noiseGain); noiseGain.connect(masterGain);
  noiseSource.start();

  return [...nodes, osc1, g1, osc2, g2, lfo, lfoGain, noiseSource, noiseFilter, noiseGain];
}

function startCalm(ctx: AudioContext, masterGain: GainNode): AudioNode[] {
  const nodes: AudioNode[] = [masterGain];

  // Gentle rain-like pink noise through LP filter
  const noiseBuffer = makeNoise(ctx, 4);
  const noiseSource = ctx.createBufferSource();
  noiseSource.buffer = noiseBuffer;
  noiseSource.loop = true;
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 600;
  filter.Q.value = 0.5;
  const nGain = ctx.createGain();
  nGain.gain.value = 0.12;
  noiseSource.connect(filter); filter.connect(nGain); nGain.connect(masterGain);
  noiseSource.start();

  // Sparse, quiet tones (like distant wind chimes)
  const tones = [220, 293.66, 329.63, 440];
  tones.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    g.gain.value = 0;
    osc.connect(g); g.connect(masterGain);
    osc.start();
    // Fade in each tone gently at different times
    const delay = i * 4 + 2;
    g.gain.setValueAtTime(0, ctx.currentTime + delay);
    g.gain.linearRampToValueAtTime(0.025, ctx.currentTime + delay + 1.5);
    g.gain.linearRampToValueAtTime(0, ctx.currentTime + delay + 4);
    nodes.push(osc, g);
  });

  return [...nodes, noiseSource, filter, nGain];
}

function startFocus(ctx: AudioContext, masterGain: GainNode): AudioNode[] {
  const nodes: AudioNode[] = [masterGain];

  // Brown noise base (deeper than pink, very soothing for focus)
  const noiseBuffer = makeNoise(ctx, 4);
  const noiseSource = ctx.createBufferSource();
  noiseSource.buffer = noiseBuffer;
  noiseSource.loop = true;
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 300;
  filter.Q.value = 0.8;
  const nGain = ctx.createGain();
  nGain.gain.value = 0.15;
  noiseSource.connect(filter); filter.connect(nGain); nGain.connect(masterGain);
  noiseSource.start();

  // Binaural-inspired: two very close frequencies create a ~4Hz beat (theta)
  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const g1 = ctx.createGain();
  const g2 = ctx.createGain();
  const merger = ctx.createChannelMerger(2);
  osc1.type = 'sine'; osc1.frequency.value = 180;
  osc2.type = 'sine'; osc2.frequency.value = 184;
  g1.gain.value = 0.06; g2.gain.value = 0.06;
  osc1.connect(g1); osc1.start();
  osc2.connect(g2); osc2.start();
  // Route to separate channels
  g1.connect(merger, 0, 0);
  g2.connect(merger, 0, 1);
  merger.connect(masterGain);

  return [...nodes, noiseSource, filter, nGain, osc1, osc2, g1, g2, merger];
}

function startOcean(ctx: AudioContext, masterGain: GainNode): AudioNode[] {
  const nodes: AudioNode[] = [masterGain];

  // Rolling wave base: pink noise through resonant lowpass
  const noiseBuffer = makeNoise(ctx, 4);
  const noiseSource = ctx.createBufferSource();
  noiseSource.buffer = noiseBuffer;
  noiseSource.loop = true;
  const waveFilter = ctx.createBiquadFilter();
  waveFilter.type = 'lowpass';
  waveFilter.frequency.value = 520;
  waveFilter.Q.value = 0.4;
  const nGain = ctx.createGain();
  nGain.gain.value = 0.18;
  noiseSource.connect(waveFilter); waveFilter.connect(nGain); nGain.connect(masterGain);
  noiseSource.start();

  // Slow LFO modulates filter cutoff — waves rolling in (~17s cycle)
  const waveLFO = ctx.createOscillator();
  const waveLFOGain = ctx.createGain();
  waveLFO.type = 'sine';
  waveLFO.frequency.value = 0.06;
  waveLFOGain.gain.value = 280;
  waveLFO.connect(waveLFOGain); waveLFOGain.connect(waveFilter.frequency);
  waveLFO.start();

  // Slow amplitude swell (~25s cycle)
  const swellLFO = ctx.createOscillator();
  const swellLFOGain = ctx.createGain();
  swellLFO.type = 'sine';
  swellLFO.frequency.value = 0.04;
  swellLFOGain.gain.value = 0.055;
  swellLFO.connect(swellLFOGain); swellLFOGain.connect(nGain.gain);
  swellLFO.start();

  // High-pass shimmer layer (wave foam hiss)
  const shimmerBuffer = makeNoise(ctx, 4);
  const shimmerSource = ctx.createBufferSource();
  shimmerSource.buffer = shimmerBuffer;
  shimmerSource.loop = true;
  const shimmerFilter = ctx.createBiquadFilter();
  shimmerFilter.type = 'highpass';
  shimmerFilter.frequency.value = 3200;
  const shimmerGain = ctx.createGain();
  shimmerGain.gain.value = 0.025;
  shimmerSource.connect(shimmerFilter); shimmerFilter.connect(shimmerGain); shimmerGain.connect(masterGain);
  shimmerSource.start();

  // Deep ocean rumble
  const drone = ctx.createOscillator();
  const droneGain = ctx.createGain();
  drone.type = 'sine';
  drone.frequency.value = 52;
  droneGain.gain.value = 0.035;
  drone.connect(droneGain); droneGain.connect(masterGain);
  drone.start();

  // Tropical night tone (subtle, like distant crickets/frogs — sparse high sine)
  const cricketOsc = ctx.createOscillator();
  const cricketGain = ctx.createGain();
  cricketOsc.type = 'sine';
  cricketOsc.frequency.value = 3200;
  cricketGain.gain.value = 0;
  cricketOsc.connect(cricketGain); cricketGain.connect(masterGain);
  cricketOsc.start();
  // Pulse on/off like insects
  const now = ctx.currentTime;
  for (let i = 0; i < 20; i++) {
    const t = now + 3 + i * 1.4 + (i % 3) * 0.3;
    cricketGain.gain.setValueAtTime(0, t);
    cricketGain.gain.linearRampToValueAtTime(0.008, t + 0.05);
    cricketGain.gain.setValueAtTime(0.008, t + 0.12);
    cricketGain.gain.linearRampToValueAtTime(0, t + 0.18);
  }

  return [...nodes, noiseSource, waveFilter, nGain, waveLFO, waveLFOGain, swellLFO, swellLFOGain,
    shimmerSource, shimmerFilter, shimmerGain, drone, droneGain, cricketOsc, cricketGain];
}

function startTransition(ctx: AudioContext, masterGain: GainNode): AudioNode[] {
  const nodes: AudioNode[] = [masterGain];

  // Cinematic swell — rising fifths
  const swellFreqs = [130.81, 196, 261.63, 392];
  swellFreqs.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    g.gain.value = 0;
    osc.connect(g); g.connect(masterGain);
    osc.start();
    const start = i * 0.4;
    g.gain.setValueAtTime(0, ctx.currentTime + start);
    g.gain.linearRampToValueAtTime(0.07, ctx.currentTime + start + 2);
    nodes.push(osc, g);
  });

  // Shimmer on top
  const shimmer = ctx.createOscillator();
  const sg = ctx.createGain();
  shimmer.type = 'sine';
  shimmer.frequency.value = 880;
  sg.gain.value = 0;
  shimmer.connect(sg); sg.connect(masterGain);
  shimmer.start();
  sg.gain.setValueAtTime(0, ctx.currentTime + 2);
  sg.gain.linearRampToValueAtTime(0.03, ctx.currentTime + 3.5);
  sg.gain.linearRampToValueAtTime(0, ctx.currentTime + 7);
  nodes.push(shimmer, sg);

  // Fade out everything after 8s (transition is brief)
  setTimeout(() => fadeOut(masterGain, ctx, 2), 7000);

  return nodes;
}

function fadeOut(gainNode: GainNode, ctx: AudioContext, duration = 1.5) {
  const now = ctx.currentTime;
  gainNode.gain.setValueAtTime(gainNode.gain.value, now);
  gainNode.gain.linearRampToValueAtTime(0, now + duration);
}

// ─── Public API ──────────────────────────────────────────────────────────────

export function startAmbient(mood: AmbientMood, volumeScale = 1.0): void {
  if (mood === 'off') { stopAmbient(); return; }
  if (currentMood === mood) return;

  const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  stopAll();

  const masterGain = ctx.createGain();
  masterGain.gain.value = 0;
  masterGain.connect(ctx.destination);

  let nodes: AudioNode[] = [];
  if (mood === 'breathe') nodes = startBreathe(ctx, masterGain);
  else if (mood === 'calm') nodes = startCalm(ctx, masterGain);
  else if (mood === 'focus') nodes = startFocus(ctx, masterGain);
  else if (mood === 'ocean') nodes = startOcean(ctx, masterGain);
  else if (mood === 'transition') nodes = startTransition(ctx, masterGain);

  state = { ctx, nodes };
  currentMood = mood;

  // Fade in
  masterGain.gain.setValueAtTime(0, ctx.currentTime);
  masterGain.gain.linearRampToValueAtTime(0.6 * volumeScale, ctx.currentTime + 1.5);
}

export function stopAmbient(fadeMs = 1500): void {
  if (!state) return;
  const { ctx, nodes } = state;
  const masterGain = nodes[0] as GainNode;
  const fadeSec = fadeMs / 1000;
  masterGain.gain.setValueAtTime(masterGain.gain.value, ctx.currentTime);
  masterGain.gain.linearRampToValueAtTime(0, ctx.currentTime + fadeSec);
  const captured = state;
  setTimeout(() => {
    captured.nodes.forEach(n => { try { (n as any).stop?.(); n.disconnect(); } catch {} });
    captured.ctx.close().catch(() => {});
  }, fadeMs + 200);
  state = null;
  currentMood = 'off';
}

export function getCurrentMood(): AmbientMood {
  return currentMood;
}
