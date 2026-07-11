import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  Play, Pause, Sliders, Volume2, Info, Compass, HelpCircle, 
  Wind, CloudRain, Flame, Music, Activity, HelpCircle as HelpIcon 
} from 'lucide-react';

interface Preset {
  name: string;
  description: string;
  rainVol: number;
  windVol: number;
  binauralVol: number;
  binauralFreq: number;
}

const PRESETS: Preset[] = [
  {
    name: "🧠 Deep Cognitive Focus",
    description: "Alpha waves (10Hz) blended with gentle wind for study and deep task concentration.",
    rainVol: 0,
    windVol: 0.4,
    binauralVol: 0.6,
    binauralFreq: 10,
  },
  {
    name: "🌌 Restorative REM Sleep",
    description: "Delta waves (3.5Hz) with a washing heavy rain backdrop to induce recovery-deep sleep.",
    rainVol: 0.6,
    windVol: 0.2,
    binauralVol: 0.7,
    binauralFreq: 3.5,
  },
  {
    name: "🧘 Creative Flow State",
    description: "Theta waves (6Hz) combined with rhythmic ocean waves for associative thinking.",
    rainVol: 0.4,
    windVol: 0.4,
    binauralVol: 0.5,
    binauralFreq: 6,
  },
  {
    name: "⚡ Nervous System Reset",
    description: "Schumann resonance (7.83Hz) to ground sympathetic flight of the emotional brain.",
    rainVol: 0.3,
    windVol: 0.3,
    binauralVol: 0.6,
    binauralFreq: 7.83,
  }
];

// `variant` distinguishes the two library entry points that share this audio engine:
//   'binaural'  → Binaural Focus Lab (focus/deep-rest beat entrainment)
//   'soundbath' → Sound Bath Studio  (ambient nature + Solfeggio restoration)
// Default preset per entry point:
//   'binaural'  → "Deep Cognitive Focus" (Alpha 10Hz beat-entrainment, matches Focus Lab)
//   'soundbath' → "Restorative REM Sleep" (Delta 3.5Hz + heavy ambient rain, matches Sound Bath Studio)
const BINAURAL_DEFAULT_PRESET = PRESETS[0]; // 🧠 Deep Cognitive Focus
const SOUNDBATH_DEFAULT_PRESET = PRESETS[1]; // 🌌 Restorative REM Sleep

export default function SoundscapeAudioMixer({ variant = 'binaural' }: { variant?: 'binaural' | 'soundbath' }) {
  const defaultPreset =
    variant === 'soundbath' ? SOUNDBATH_DEFAULT_PRESET :
    variant === 'binaural' ? BINAURAL_DEFAULT_PRESET :
    null;

  const [isPlaying, setIsPlaying] = useState(false);
  const [rainVolume, setRainVolume] = useState(defaultPreset ? defaultPreset.rainVol : 0.3);
  const [windVolume, setWindVolume] = useState(defaultPreset ? defaultPreset.windVol : 0.2);
  const [binauralVolume, setBinauralVolume] = useState(defaultPreset ? defaultPreset.binauralVol : 0.4);
  const [binauralFreq, setBinauralFreq] = useState(defaultPreset ? defaultPreset.binauralFreq : 10); // Hz, beats difference
  const [showExplanation, setShowExplanation] = useState(false);
  
  // Real-time visual frequency pulse representation
  const [pulseScale, setPulseScale] = useState(1);

  // Web Audio Web nodes reference
  const audioCtxRef = useRef<AudioContext | null>(null);
  
  // Oscillators and Gain Nodes references for real-time adjusting
  const rainGainRef = useRef<GainNode | null>(null);
  const windGainRef = useRef<GainNode | null>(null);
  const binauralGainRef = useRef<GainNode | null>(null);
  const oscLeftRef = useRef<OscillatorNode | null>(null);
  const oscRightRef = useRef<OscillatorNode | null>(null);

  // Interval for LFO wave motions
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    // Continuous light pulsing visual based on current binaural Hz
    let angle = 0;
    const animate = () => {
      const freq = isPlaying ? binauralFreq : 0.5; // low pulsing if paused
      angle += freq * 0.05;
      const pulse = 1 + Math.sin(angle) * 0.08 * (isPlaying ? binauralVolume + 0.3 : 0.2);
      setPulseScale(pulse);
      animationRef.current = requestAnimationFrame(animate);
    };
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying, binauralFreq, binauralVolume]);

  const initAudio = () => {
    if (audioCtxRef.current) return;
    
    // Create AudioContext (fallback for older browsers)
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioContextClass();
    audioCtxRef.current = ctx;

    // --- rain Sound Node (Pink noise simulation) ---
    // Generate pinkish noise with random buffers
    const bufferSize = 2 * ctx.sampleRate;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    
    // Simple pink noise approximation filter variables
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      output[i] *= 0.11; // normalise scale
      b6 = white * 0.115926;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    // Filter rain noise to sound more organic
    const rainFilter = ctx.createBiquadFilter();
    rainFilter.type = 'lowpass';
    rainFilter.frequency.value = 800; // soft rain filter

    const rainGain = ctx.createGain();
    rainGain.gain.setValueAtTime(rainVolume * 0.35, ctx.currentTime);
    rainGainRef.current = rainGain;

    noiseSource.connect(rainFilter);
    rainFilter.connect(rainGain);
    rainGain.connect(ctx.destination);
    noiseSource.start(0);

    // --- wind Sound Node (White noise + sweep filter LFO) ---
    const windBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const windOutput = windBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      windOutput[i] = (Math.random() * 2 - 1) * 0.08;
    }
    const windSource = ctx.createBufferSource();
    windSource.buffer = windBuffer;
    windSource.loop = true;

    // Sweeping wind bandpass filter simulation
    const windFilter = ctx.createBiquadFilter();
    windFilter.type = 'bandpass';
    windFilter.Q.value = 2.5; // resonance
    windFilter.frequency.value = 400;

    // LFO osc to sweep wind density and pitch
    const windLFO = ctx.createOscillator();
    windLFO.frequency.value = 0.08; // slow rising wind waves
    const windLFOGain = ctx.createGain();
    windLFOGain.gain.value = 180; // sweep 180hz up and down

    const windGain = ctx.createGain();
    windGain.gain.setValueAtTime(windVolume * 0.3, ctx.currentTime);
    windGainRef.current = windGain;

    windLFO.connect(windLFOGain);
    windLFOGain.connect(windFilter.frequency);
    windSource.connect(windFilter);
    windFilter.connect(windGain);
    windGain.connect(ctx.destination);
    windSource.start(0);
    windLFO.start(0);

    // --- Binaural Beats Oscillators (Stereo Separated) ---
    const carrier = 180; // Stable low resonant 180Hz G3 tone
    const leftOsc = ctx.createOscillator();
    leftOsc.type = 'sine';
    leftOsc.frequency.value = carrier;

    const rightOsc = ctx.createOscillator();
    rightOsc.type = 'sine';
    rightOsc.frequency.value = carrier + binauralFreq;

    oscLeftRef.current = leftOsc;
    oscRightRef.current = rightOsc;

    // Use Stereo merger to split oscillators to Left/Right channels exclusively
    const merger = ctx.createChannelMerger(2);
    const leftGain0 = ctx.createGain();
    const rightGain0 = ctx.createGain();
    leftGain0.gain.value = 1.0;
    rightGain0.gain.value = 1.0;

    leftOsc.connect(leftGain0);
    rightOsc.connect(rightGain0);

    leftGain0.connect(merger, 0, 0); // connect to merge channel 0 (Left)
    rightGain0.connect(merger, 0, 1); // connect to merge channel 1 (Right)

    const binauralGain = ctx.createGain();
    binauralGain.gain.setValueAtTime(binauralVolume * 0.15, ctx.currentTime);
    binauralGainRef.current = binauralGain;

    merger.connect(binauralGain);
    binauralGain.connect(ctx.destination);

    leftOsc.start(0);
    rightOsc.start(0);
  };

  const startAudio = async () => {
    try {
      initAudio();
      if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
        await audioCtxRef.current.resume();
      }
      setIsPlaying(true);
    } catch (e) {
      console.error("Audio Context initiation error:", e);
    }
  };

  const stopAudio = async () => {
    if (audioCtxRef.current && audioCtxRef.current.state === 'running') {
      await audioCtxRef.current.suspend();
    }
    setIsPlaying(false);
  };

  const toggleSound = () => {
    if (isPlaying) {
      stopAudio();
    } else {
      startAudio();
    }
  };

  // Adjust volumes smoothly in real time
  useEffect(() => {
    if (rainGainRef.current && audioCtxRef.current) {
      rainGainRef.current.gain.linearRampToValueAtTime(
        rainVolume * 0.35,
        audioCtxRef.current.currentTime + 0.15
      );
    }
  }, [rainVolume]);

  useEffect(() => {
    if (windGainRef.current && audioCtxRef.current) {
      windGainRef.current.gain.linearRampToValueAtTime(
        windVolume * 0.3,
        audioCtxRef.current.currentTime + 0.15
      );
    }
  }, [windVolume]);

  useEffect(() => {
    if (binauralGainRef.current && audioCtxRef.current) {
      binauralGainRef.current.gain.linearRampToValueAtTime(
        binauralVolume * 0.15,
        audioCtxRef.current.currentTime + 0.15
      );
    }
  }, [binauralVolume]);

  // Adjust binaural beats offset frequency in real time
  useEffect(() => {
    if (oscRightRef.current && audioCtxRef.current) {
      const baseFreq = oscLeftRef.current ? oscLeftRef.current.frequency.value : 180;
      oscRightRef.current.frequency.setValueAtTime(
        baseFreq + binauralFreq,
        audioCtxRef.current.currentTime
      );
    }
  }, [binauralFreq]);

  const selectPreset = (p: Preset) => {
    setRainVolume(p.rainVol);
    setWindVolume(p.windVol);
    setBinauralVolume(p.binauralVol);
    setBinauralFreq(p.binauralFreq);
    if (!isPlaying) {
      startAudio();
    }
  };

  const getWaveRangeLabel = (hz: number) => {
    if (hz < 4) return "Delta waves (Deep Sleep & Rejuvenation)";
    if (hz < 8) return "Theta waves (Deep Meditation, Dreaming, Creativity)";
    if (hz < 13) return "Alpha waves (Peaceful alertness, mental focus, Flow)";
    return "Beta waves (Active focus, problem-solving, engagement)";
  };

  return (
    <div id="soundscape-mixer-root" className="bg-white text-[#3C3C3C] rounded-3xl p-6 shadow-xl border border-slate-200 max-w-3xl mx-auto overflow-hidden relative">
      {/* Dynamic Background Ring Pulsator */}
      <div 
        className="absolute w-72 h-72 rounded-full border border-teal-500/20 bg-teal-500/5 -top-10 -right-10 pointer-events-none transition-transform duration-100 ease-out z-0" 
        style={{ transform: `scale(${pulseScale})` }}
      />
      <div 
        className="absolute w-96 h-96 rounded-full border border-teal-500/10 -top-20 -right-20 pointer-events-none transition-transform duration-100 ease-out z-0" 
        style={{ transform: `scale(${pulseScale * 1.1})` }}
      />

      <div className="relative z-10 space-y-6">
        <div className="flex justify-between items-start gap-4">
          <div>
            <span className="text-[10px] uppercase font-black tracking-widest px-2.5 py-1 rounded-md bg-teal-50 text-teal-400 border border-teal-800/50">
              Neuro-Acoustic
            </span>
            <h3 className="text-xl font-bold mt-1.5 flex items-center gap-2">
              <Activity className="w-5 h-5 text-teal-400 animate-pulse" />
              Somatic Binaural Soundscape Mixer
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Top health apps use brainwave entrainment. Headphone wearing is recommended for maximum effect.
            </p>
          </div>
          <button 
            type="button"
            onClick={() => setShowExplanation(!showExplanation)}
            className="p-2.5 bg-white text-slate-500 hover:text-[#3C3C3C] rounded-xl border border-slate-200 cursor-pointer hover:bg-white shrink-0"
            title="How Binaural Beats work"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>

        {showExplanation && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 bg-white border border-slate-200 rounded-2xl text-xs text-slate-300 leading-relaxed space-y-2"
          >
            <p>
              <strong>Binaural beats</strong> occur when left and right ears hear slightly differing frequencies. 
              If the left speaker delivers 180Hz and the right speaker delivers 190Hz, your auditory cortex 
              perceives a third sub-frequency drone of exactly <strong>10Hz</strong> (the difference).
            </p>
            <p>
              Your neuro-oscillatory cycles naturally entrain or "lock-in" with this perceived pace, 
              shifting calm alertness (Alpha), creative processing (Theta), or repair and physical restoration (Delta).
            </p>
          </motion.div>
        )}

        {/* Master Play Control */}
        <div className="flex items-center justify-between p-5 bg-white rounded-2xl border border-slate-200">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSound}
              className={`w-14 h-14 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 ${
                isPlaying 
                  ? 'bg-rose-500 hover:bg-rose-600 ring-4 ring-rose-500/20 text-white' 
                  : 'bg-teal-500 hover:bg-teal-600 ring-4 ring-teal-500/20 text-white'
              }`}
            >
              {isPlaying ? <Pause className="w-6 h-6 fill-white" /> : <Play className="w-6 h-6 fill-white ml-0.5" />}
            </button>
            <div>
              <p className="text-sm font-bold">{isPlaying ? "Audio Stream Active" : "Stream Suspended"}</p>
              <p className="text-xs text-slate-400 mt-0.5">
                {isPlaying ? "Generating procedurally synthesized carrier channels" : "Audio synthesis asleep. Click play to start."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono bg-white px-3 py-1.5 rounded-lg border border-slate-200">
            <Volume2 className="w-3.5 h-3.5 text-teal-400" />
            Stereo Wave Synthesis
          </div>
        </div>

        {/* Level Sliders Grid */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Rain noise volume */}
            <div className="space-y-2.5 p-4 bg-white border border-slate-200 rounded-2xl">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold flex items-center gap-1.5 text-slate-300">
                  <CloudRain className="w-4 h-4 text-blue-400" />
                  Soft Storm Rain
                </span>
                <span className="font-mono text-slate-400">{Math.round(rainVolume * 100)}%</span>
              </div>
              <input 
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={rainVolume}
                onChange={(e) => setRainVolume(parseFloat(e.target.value))}
                className="w-full accent-teal-400 cursor-pointer"
              />
              <p className="text-[10px] text-slate-500">Low-frequency rumble filters sympathetic adrenaline.</p>
            </div>

            {/* Wind volume */}
            <div className="space-y-2.5 p-4 bg-white border border-slate-200 rounded-2xl">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold flex items-center gap-1.5 text-slate-300">
                  <Wind className="w-4 h-4 text-emerald-400" />
                  Sweeping Wind
                </span>
                <span className="font-mono text-slate-400">{Math.round(windVolume * 100)}%</span>
              </div>
              <input 
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={windVolume}
                onChange={(e) => setWindVolume(parseFloat(e.target.value))}
                className="w-full accent-teal-400 cursor-pointer"
              />
              <p className="text-[10px] text-slate-500">Procedurally sweeping bandpass sweep frequency mimicking ocean gusts.</p>
            </div>

            {/* Binaural Vol */}
            <div className="space-y-2.5 p-4 bg-white border border-slate-200 rounded-2xl">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold flex items-center gap-1.5 text-slate-300">
                  <Music className="w-4 h-4 text-purple-400" />
                  Binaural Coherence
                </span>
                <span className="font-mono text-slate-400">{Math.round(binauralVolume * 100)}%</span>
              </div>
              <input 
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={binauralVolume}
                onChange={(e) => setBinauralVolume(parseFloat(e.target.value))}
                className="w-full accent-teal-400 cursor-pointer"
              />
              <p className="text-[10px] text-slate-500">Modulates stereo carrier output power to prefrontal nodes.</p>
            </div>
          </div>

          {/* Binaural Beats Frequency Controller */}
          <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-300">Target Entrainment Frequency (Offset)</span>
              <span className="font-mono text-teal-400 text-sm font-black bg-teal-50 px-2 py-0.5 rounded border border-teal-900">{binauralFreq.toFixed(1)} Hz</span>
            </div>
            <input 
              type="range"
              min="1"
              max="20"
              step="0.1"
              value={binauralFreq}
              onChange={(e) => setBinauralFreq(parseFloat(e.target.value))}
              className="w-full accent-teal-400 cursor-pointer"
            />
            
            {/* Interactive Visual Wave State display */}
            <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between text-xs transition-all duration-350">
              <span className="text-slate-400 font-medium">Neuro Wave Classification:</span>
              <span className="font-bold text-teal-400 font-sans tracking-wide">
                {getWaveRangeLabel(binauralFreq)}
              </span>
            </div>
          </div>
        </div>

        {/* Quick presets list */}
        <div className="space-y-2.5">
          <p className="text-xs font-bold text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
            <Sliders className="w-3.5 h-3.5" />
            Sound Labs Clinical Presets
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PRESETS.map((p) => (
              <button
                key={p.name}
                type="button"
                onClick={() => selectPreset(p)}
                className="p-3 rounded-2xl text-left bg-white border border-slate-200 hover:border-teal-500/60 transition-all cursor-pointer group hover:bg-white"
              >
                <h4 className="text-xs font-bold text-slate-200 group-hover:text-teal-400 transition-colors">
                  {p.name}
                </h4>
                <p className="text-[10px] text-slate-400 mt-1 leading-normal">
                  {p.description}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
