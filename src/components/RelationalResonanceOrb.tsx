import React, { useState, useEffect, useRef } from 'react';
import { aiHeaders } from '../lib/aiKey';
import {
  Activity,
  Sparkles,
  Volume2, 
  VolumeX, 
  HelpCircle, 
  Heart, 
  ShieldCheck, 
  Sliders, 
  Wind, 
  Cpu, 
  ArrowRight, 
  Play, 
  Square,
  FileText,
  BookmarkCheck,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PartnerState {
  heartRate: number;
  tension: string;
  muscleTension: number; // 1-10
}

export default function RelationalResonanceOrb({ onClose }: { onClose?: () => void }) {
  // STATE MANAGEMENT
  const [partnerA, setPartnerA] = useState<PartnerState>({
    heartRate: 112,
    tension: "Anxious, rapid breathing, feeling invisible",
    muscleTension: 7
  });

  const [partnerB, setPartnerB] = useState<PartnerState>({
    heartRate: 85,
    tension: "Stonewalling, heavy shoulder tension, feeling overwhelmed",
    muscleTension: 8
  });

  const [vagalCoRegulation, setVagalCoRegulation] = useState<number>(38); // 0-100%
  const [conflictContext, setConflictContext] = useState<string>("Argument about division of household mental load");
  const [isSynthesizing, setIsSynthesizing] = useState<boolean>(false);
  const [blueprintResult, setBlueprintResult] = useState<string | null>(null);

  // BREATH PACER STATE
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [breathTimer, setBreathTimer] = useState<number>(4); // count down seconds
  const [isBreathingGuided, setIsBreathingGuided] = useState<boolean>(false);

  // SOUND SYNTHESIZER STATE
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscARef = useRef<OscillatorNode | null>(null);
  const oscBRef = useRef<OscillatorNode | null>(null);
  const gainARef = useRef<GainNode | null>(null);
  const gainBRef = useRef<GainNode | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);

  // CANVAS REFERENCE FOR DYNAMIC WAVEFORM RENDER
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);

  // BREATH PACER LOOP
  useEffect(() => {
    let interval: any;
    if (isBreathingGuided) {
      interval = setInterval(() => {
        setBreathTimer(prev => {
          if (prev <= 1) {
            // Transition phase
            if (breathPhase === 'Inhale') {
              setBreathPhase('Hold');
              return 2; // hold for 2s
            } else if (breathPhase === 'Hold') {
              setBreathPhase('Exhale');
              return 6; // exhale for 6s
            } else {
              setBreathPhase('Inhale');
              // Incrementally boost co-regulation as they complete breath cycles
              setVagalCoRegulation(c => Math.min(100, c + 12));
              // Gradually drop heart rates toward optimal levels
              setPartnerA(p => ({ ...p, heartRate: Math.max(68, p.heartRate - 5) }));
              setPartnerB(p => ({ ...p, heartRate: Math.max(62, p.heartRate - 4) }));
              return 4; // inhale for 4s
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isBreathingGuided, breathPhase]);

  // WEB AUDIO SYNTHESIZER LIFECYCLE
  useEffect(() => {
    if (soundEnabled) {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioCtx) return;
        
        const ctx = new AudioCtx();
        audioCtxRef.current = ctx;

        // Master Gain
        const masterGain = ctx.createGain();
        masterGain.gain.setValueAtTime(0.12, ctx.currentTime);
        masterGain.connect(ctx.destination);
        masterGainRef.current = masterGain;

        // Partner A Oscillator (Base pitch represents internal pressure)
        const oscA = ctx.createOscillator();
        const gainA = ctx.createGain();
        oscA.type = 'sine';
        oscA.frequency.setValueAtTime(150 + (partnerA.heartRate * 0.8), ctx.currentTime);
        gainA.gain.setValueAtTime(0.5, ctx.currentTime);
        oscA.connect(gainA);
        gainA.connect(masterGain);
        oscA.start();
        oscARef.current = oscA;
        gainARef.current = gainA;

        // Partner B Oscillator
        const oscB = ctx.createOscillator();
        const gainB = ctx.createGain();
        oscB.type = 'sine';
        // Frequencies create beating/friction when out of sync (not locked in ratios)
        const baseFreqB = 150 + (partnerB.heartRate * 0.8);
        oscB.frequency.setValueAtTime(baseFreqB, ctx.currentTime);
        gainB.gain.setValueAtTime(0.5, ctx.currentTime);
        oscB.connect(gainB);
        gainB.connect(masterGain);
        oscB.start();
        oscRefUpdate(baseFreqB);
        oscBRef.current = oscB;
        gainBRef.current = gainB;

      } catch (err) {
        console.warn("Web Audio compilation blocked or not supported", err);
      }
    } else {
      // Shutdown synth safely
      stopSynthesizer();
    }

    return () => stopSynthesizer();
  }, [soundEnabled]);

  // Adjust Synthesizer frequencies live based on sliders and co-regulation
  useEffect(() => {
    if (!soundEnabled || !audioCtxRef.current) return;
    
    const ctx = audioCtxRef.current;
    
    // Partner A base pitch
    const freqA = 180 + (partnerA.heartRate * 0.5);
    oscARef.current?.frequency.exponentialRampToValueAtTime(freqA, ctx.currentTime + 0.3);

    // If co-regulation coefficient is high, resolve B into a harmonious consonant ratio (Perfect fifth or Octave)
    let freqB;
    if (vagalCoRegulation >= 75) {
      // Perfect Fifth (1.5x) or octave (2.0x) representation of neural alignment
      freqB = freqA * 1.5;
    } else if (vagalCoRegulation >= 50) {
      // Perfect Fourth (1.33x)
      freqB = freqA * 1.333;
    } else {
      // High-tension friction (dissonance) based on B's heart rate
      freqB = 180 + (partnerB.heartRate * 0.5) + (10 - vagalCoRegulation * 0.1);
    }

    oscBRef.current?.frequency.exponentialRampToValueAtTime(freqB, ctx.currentTime + 0.3);

    // Master volume adjusts according to tension levels
    const targetVolume = 0.05 + ((partnerA.muscleTension + partnerB.muscleTension) / 20) * 0.12;
    masterGainRef.current?.gain.linearRampToValueAtTime(targetVolume, ctx.currentTime + 0.2);

  }, [partnerA.heartRate, partnerB.heartRate, partnerA.muscleTension, partnerB.muscleTension, vagalCoRegulation, soundEnabled]);

  const oscRefUpdate = (base: number) => {
    // helper placeholder
  };

  const stopSynthesizer = () => {
    try {
      oscARef.current?.stop();
      oscBRef.current?.stop();
      audioCtxRef.current?.close();
    } catch (e) {}
    oscARef.current = null;
    oscBRef.current = null;
    audioCtxRef.current = null;
  };

  // CANVAS GRAPHICS: DEEP NEURAL CO-REGULATION RENDERING
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let localPhase = 0;

    const draw = () => {
      if (!canvas || !ctx) return;
      const width = canvas.width = canvas.offsetWidth;
      const height = canvas.height = canvas.offsetHeight;
      
      ctx.clearRect(0, 0, width, height);

      // Background mesh styling based on co-regulation level
      const syncRatio = vagalCoRegulation / 100;

      // Base line representation of neutrality
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.1)';
      ctx.lineWidth = 1;
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();

      localPhase += 0.03 + (syncRatio * 0.02); // speed of wave movement

      // Generate Partner A's Wave (Sympathetic charge)
      ctx.beginPath();
      const ampA = 20 + partnerA.muscleTension * 3.5;
      const freqMultiplierA = 0.005 + (partnerA.heartRate * 0.0001);
      
      for (let x = 0; x < width; x++) {
        // If low sync, introduce erratic noise spikes to simulate adrenaline and cortisol surges
        const noise = (1 - syncRatio) * (Math.sin(x * 0.1 + localPhase * 5) * 4);
        
        const y = height / 2 + Math.sin(x * freqMultiplierA + localPhase) * ampA + noise;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      // Color-shift based on state (pure red for high tension, teal for regulated)
      const colorA = `hsla(${340 - syncRatio * 180}, 85%, 60%, 0.45)`;
      ctx.strokeStyle = colorA;
      ctx.lineWidth = 3 - syncRatio * 1;
      ctx.stroke();

      // Generate Partner B's Wave
      ctx.beginPath();
      const ampB = 20 + partnerB.muscleTension * 3.5;
      const freqMultiplierB = 0.005 + (partnerB.heartRate * 0.0001);

      for (let x = 0; x < width; x++) {
        // Shift phase to demonstrate attachment detachment or lock in
        const phaseShift = (1 - syncRatio) * Math.PI;
        const noise = (1 - syncRatio) * (Math.cos(x * 0.08 - localPhase * 4) * 3);
        
        const y = height / 2 + Math.sin(x * freqMultiplierB - localPhase + phaseShift) * ampB + noise;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      const colorB = `hsla(${200 + syncRatio * 100}, 80%, 55%, 0.45)`;
      ctx.strokeStyle = colorB;
      ctx.lineWidth = 3 - syncRatio * 1;
      ctx.stroke();

      // INTERACTIVE CO-REGULATED EMBRACING SPHERE (The glowing center core)
      const gradient = ctx.createRadialGradient(width / 2, height / 2, 5, width / 2, height / 2, 45 + syncRatio * 60);
      
      // Color scheme transitions from a friction red-violet core to an elegant expansive emerald-teal orb
      if (syncRatio < 0.4) {
        gradient.addColorStop(0, 'rgba(239, 68, 68, 0.4)');
        gradient.addColorStop(0.5, 'rgba(244, 63, 94, 0.15)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      } else if (syncRatio < 0.75) {
        gradient.addColorStop(0, 'rgba(168, 85, 247, 0.5)');
        gradient.addColorStop(0.5, 'rgba(99, 102, 241, 0.2)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      } else {
        gradient.addColorStop(0, 'rgba(16, 185, 129, 0.6)');
        gradient.addColorStop(0.3, 'rgba(20, 184, 166, 0.3)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      }

      ctx.beginPath();
      ctx.arc(width / 2, height / 2, 55 + syncRatio * 70, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Resonance Node intersections (Standing locking points)
      if (syncRatio > 0.8) {
        ctx.fillStyle = '#10B981';
        ctx.beginPath();
        ctx.arc(width / 2, height / 2, 6, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = '#34D399';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [partnerA.heartRate, partnerB.heartRate, partnerA.muscleTension, partnerB.muscleTension, vagalCoRegulation]);

  // CALL SERVER GEMINI API FOR CLINICAL SOMATIC BLUEPRINT
  const handleGenerateBlueprint = async () => {
    setIsSynthesizing(true);
    setBlueprintResult(null);
    try {
      const response = await fetch('/api/co-regulate-blueprint', {
        method: 'POST',
        headers: aiHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({
          partnerAState: { heartRate: partnerA.heartRate, tension: partnerA.tension },
          partnerBState: { heartRate: partnerB.heartRate, tension: partnerB.tension },
          coRegulationLevel: vagalCoRegulation,
          contextDescription: conflictContext
        })
      });

      const data = await response.json();
      if (data.blueprint) {
        setBlueprintResult(data.blueprint);
      } else {
        setBlueprintResult("Could not establish a telemetry blueprint connection at this moment.");
      }
    } catch (e) {
      setBlueprintResult("Network disruption. The neural blueprint synchronization engine timed out.");
    } finally {
      setIsSynthesizing(false);
    }
  };

  // Preset calibrations
  const applyPreset = (type: 'flooded' | 'stonewalling' | 'synchronized') => {
    if (type === 'flooded') {
      setPartnerA({ heartRate: 122, tension: "High fight-or-flight, sharp tones, highly activated", muscleTension: 9 });
      setPartnerB({ heartRate: 104, tension: "Defensive arguments, shallow breathing", muscleTension: 7 });
      setVagalCoRegulation(15);
    } else if (type === 'stonewalling') {
      setPartnerA({ heartRate: 108, tension: "Anxious protesting, demanding clarity", muscleTension: 8 });
      setPartnerB({ heartRate: 64, tension: "Dorsal Vagal shutdown, fully unresponsive, stone-faced", muscleTension: 9 });
      setVagalCoRegulation(22);
    } else {
      setPartnerA({ heartRate: 72, tension: "Deep, calm belly breaths, secure eye contact", muscleTension: 2 });
      setPartnerB({ heartRate: 68, tension: "Listening intently, relaxed shoulders, open stance", muscleTension: 2 });
      setVagalCoRegulation(92);
    }
  };

  return (
    <div className="flex flex-col gap-4 text-[#4B4B4B] select-none" id="relational-resonance-orb-interactive">
      
      {/* Dynamic Future Header */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-emerald-950 text-white p-5 rounded-[2.5rem] shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute left-1/3 bottom-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex justify-between items-start gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-emerald-400 flex items-center justify-center text-2xl shadow-lg shadow-indigo-950/40 relative">
              <span className="animate-pulse">🌀</span>
              <div className="absolute inset-0 rounded-2xl border border-white/20 animate-ping opacity-30"></div>
            </div>
            <div>
              <span className="text-[8px] font-black uppercase tracking-widest text-[#CE9FFC] flex items-center gap-1">
                <Cpu size={9} /> UNPRECEDENTED NEURO-COREGULATION CORE
              </span>
              <h3 className="font-display font-black text-sm text-white mt-0.5 leading-tight">
                The Relational Co-Regulation Orb
              </h3>
              <p className="text-[10.5px] text-slate-300 font-sans mt-0.5 max-w-[420px] leading-relaxed">
                A groundbreaking therapeutic interface simulating autonomic synchronization in real-time. Practice soothing physiological friction into standing resonance waves together.
              </p>
            </div>
          </div>

          <div className="flex gap-1.5 shrink-0">
            {/* Real-time sound trigger */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2.5 rounded-2xl transition-all cursor-pointer border flex items-center justify-center ${
                soundEnabled 
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md' 
                  : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10'
              }`}
              title={soundEnabled ? "Disable Somatic Tone Synthesizer" : "Unmute Somatic Tone Synthesizer"}
            >
              {soundEnabled ? <Volume2 size={14} className="animate-bounce" /> : <VolumeX size={14} />}
            </button>

            {onClose && (
              <button
                onClick={onClose}
                className="p-2 bg-white/5 border border-white/10 rounded-2xl text-slate-300 hover:text-white transition cursor-pointer"
              >
                ×
              </button>
            )}
          </div>
        </div>
      </div>

      {/* THREE PRESETS SELECTOR BAR */}
      <div className="bg-slate-100 rounded-2xl p-1.5 border border-slate-200 flex gap-2 justify-between items-center">
        <span className="text-[8.5px] font-black text-stone-500 uppercase tracking-widest pl-2">
          Diagnostic Presets:
        </span>
        <div className="flex gap-1">
          <button
            onClick={() => applyPreset('flooded')}
            className="text-[9px] font-black uppercase tracking-wider bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1.5 rounded-xl transition cursor-pointer border border-red-200"
          >
            🚨 Flooded (Sympathetic)
          </button>
          <button
            onClick={() => applyPreset('stonewalling')}
            className="text-[9px] font-black uppercase tracking-wider bg-amber-100 hover:bg-amber-200 text-amber-800 px-3 py-1.5 rounded-xl transition cursor-pointer border border-amber-200"
          >
            🧱 Stonewalling (Dorsal)
          </button>
          <button
            onClick={() => applyPreset('synchronized')}
            className="text-[9px] font-black uppercase tracking-wider bg-emerald-100 hover:bg-emerald-200 text-emerald-800 px-3 py-1.5 rounded-xl transition cursor-pointer border border-emerald-200"
          >
            🟢 Co-Regulated (Ventral)
          </button>
        </div>
      </div>

      {/* MAIN SANDBOX INTERFACE GRID */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        
        {/* LEFT: THE INTERACTIVE GRAPHICS CANVAS (7 Cols) */}
        <div className="md:col-span-7 bg-slate-950 rounded-[2.5rem] border-2 border-slate-800 p-5 flex flex-col justify-between min-h-[460px] relative overflow-hidden shadow-2xl">
          
          {/* Subtle canvas labels */}
          <div className="w-full flex justify-between items-start z-10">
            <div>
              <span className="text-[8px] font-mono text-indigo-400 font-bold uppercase tracking-wider">Telemetry Canvas</span>
              <h4 className="font-display font-black text-xs text-white uppercase tracking-tight mt-0.5">Somatic Waveform Overlay</h4>
            </div>

            <div className="flex flex-col items-end">
              <span className="text-[8px] font-mono text-emerald-400 font-bold uppercase tracking-wider">Sync Coeff</span>
              <span className="font-display font-black text-md text-emerald-400">{vagalCoRegulation}%</span>
            </div>
          </div>

          {/* DYNAMIC REAL-TIME GRAPHICS CANVAS */}
          <div className="relative w-full h-56 flex items-center justify-center my-4 rounded-3xl border border-white/5 bg-slate-950/40 overflow-hidden">
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
            
            {/* Coregulator Status Float Banner */}
            <div className="absolute bottom-3 left-3 bg-black/60 border border-white/10 rounded-full px-3 py-1 text-[8.5px] font-mono font-bold text-white tracking-wide z-20 backdrop-blur-xs">
              {vagalCoRegulation >= 75 ? (
                <span className="text-emerald-400 flex items-center gap-1.5">
                  ● SECURE STANDING RESONANCE (Ventral Vagal Lock)
                </span>
              ) : vagalCoRegulation >= 40 ? (
                <span className="text-purple-400 flex items-center gap-1.5">
                  ● COGNITIVE FLUIDITY ENGAGED (Transitional Safe State)
                </span>
              ) : (
                <span className="text-red-400 flex items-center gap-1.5 animate-pulse">
                  ● PHYSIOLOGICAL FLOODING (Sympathetic Overdrive)
                </span>
              )}
            </div>

            {/* Simulated Aura node centers */}
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-left opacity-30 select-none pointer-events-none z-10">
              <span className="text-[9px] font-mono text-white block">Partner A Aura Node</span>
              <span className="text-[7.5px] font-mono text-slate-400 block">{partnerA.heartRate} BPM • {partnerA.muscleTension}/10 Tension</span>
            </div>
            <div className="absolute right-6 top-1/2 -translate-y-1/2 text-right opacity-30 select-none pointer-events-none z-10">
              <span className="text-[9px] font-mono text-white block">Partner B Aura Node</span>
              <span className="text-[7.5px] font-mono text-slate-400 block">{partnerB.heartRate} BPM • {partnerB.muscleTension}/10 Tension</span>
            </div>
          </div>

          {/* SOMATIC FEEDBACK CONTROLLER CARD (Vagal Breath Pacer) */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-4.5 flex items-center justify-between gap-4 z-10">
            <div className="flex gap-3 items-center">
              <div className="w-10 h-10 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center relative shrink-0">
                <Wind size={16} className="text-indigo-400" />
                {isBreathingGuided && (
                  <span className="absolute inset-0 rounded-2xl border border-indigo-400 animate-ping opacity-40"></span>
                )}
              </div>
              <div>
                <h5 className="text-[10.5px] font-bold text-white">Vagal Resonant Breath Pacer</h5>
                <p className="text-[9px] text-slate-300 font-sans leading-normal mt-0.5">
                  Breathe in rhythm with the expanding mandala. Instant parasympathetic system cooling.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {/* Breath Mandala representation */}
              {isBreathingGuided && (
                <div className="flex flex-col items-center select-none">
                  <motion.div 
                    animate={{ 
                      scale: breathPhase === 'Inhale' ? 1.6 : breathPhase === 'Hold' ? 1.6 : 0.9,
                    }}
                    transition={{ duration: breathPhase === 'Inhale' ? 4 : breathPhase === 'Hold' ? 0.1 : 6, ease: 'easeInOut' }}
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[7px] font-black text-white ${
                      breathPhase === 'Inhale' ? 'bg-indigo-500' : breathPhase === 'Hold' ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                  >
                    {breathTimer}
                  </motion.div>
                  <span className="text-[7.5px] font-mono font-bold mt-1 text-slate-300 uppercase tracking-widest">{breathPhase}</span>
                </div>
              )}

              <button
                type="button"
                onClick={() => {
                  setIsBreathingGuided(!isBreathingGuided);
                  if(!isBreathingGuided) {
                    setBreathPhase('Inhale');
                    setBreathTimer(4);
                  }
                }}
                className={`text-[9px] font-display font-black uppercase tracking-wider py-2 px-3.5 rounded-xl border transition cursor-pointer ${
                  isBreathingGuided 
                    ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 border-amber-300' 
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-400'
                }`}
              >
                {isBreathingGuided ? 'Stop Pacer' : 'Engage Pacer'}
              </button>
            </div>
          </div>

        </div>

        {/* RIGHT: SOMATIC CONTROLS & AI BLUEPRINT BLUEPRINT (5 Cols) */}
        <div className="md:col-span-5 flex flex-col gap-4">
          
          {/* CONTROL SLIDERS PANEL */}
          <div className="bg-white p-5 rounded-[2.2rem] border-2 border-stone-200 shadow-sm flex flex-col gap-4">
            <h4 className="font-display font-black text-xs text-stone-800 uppercase tracking-tight flex items-center gap-1.5 border-b border-stone-100 pb-2">
              <Sliders size={13} className="text-indigo-600" /> Autonomic Tuning Deck
            </h4>

            {/* PARTNER A CONTROLS */}
            <div className="flex flex-col gap-2 bg-slate-50 p-3 rounded-2xl border border-stone-200">
              <span className="text-[9px] font-black text-stone-700 uppercase tracking-wider block">
                Partner A Autonomic Charge:
              </span>
              
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-[8px] font-mono text-stone-500 font-bold">
                  <span>HEART RATE: {partnerA.heartRate} BPM</span>
                  <span>MOBILIZED</span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="150"
                  value={partnerA.heartRate}
                  onChange={(e) => {
                    const hr = Number(e.target.value);
                    setPartnerA(p => ({ ...p, heartRate: hr }));
                    // Auto recalculate co-regulation dynamically to match sliders inverse relationship
                    setVagalCoRegulation(c => Math.max(0, Math.min(100, Math.round(100 - (Math.abs(hr - partnerB.heartRate) * 1.2) - (partnerA.muscleTension * 3)))));
                  }}
                  className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-[8px] font-mono text-stone-500 font-bold">
                  <span>MUSCLE TENSION: {partnerA.muscleTension}/10</span>
                  <span>MYOFASCIAL PRESSURE</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={partnerA.muscleTension}
                  onChange={(e) => {
                    const mt = Number(e.target.value);
                    setPartnerA(p => ({ ...p, muscleTension: mt }));
                    setVagalCoRegulation(c => Math.max(0, Math.min(100, Math.round(100 - (Math.abs(partnerA.heartRate - partnerB.heartRate) * 1.2) - (mt * 4)))));
                  }}
                  className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>
            </div>

            {/* PARTNER B CONTROLS */}
            <div className="flex flex-col gap-2 bg-slate-50 p-3 rounded-2xl border border-stone-200">
              <span className="text-[9px] font-black text-stone-700 uppercase tracking-wider block">
                Partner B Autonomic Charge:
              </span>
              
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-[8px] font-mono text-stone-500 font-bold">
                  <span>HEART RATE: {partnerB.heartRate} BPM</span>
                  <span>MOBILIZED</span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="150"
                  value={partnerB.heartRate}
                  onChange={(e) => {
                    const hr = Number(e.target.value);
                    setPartnerB(p => ({ ...p, heartRate: hr }));
                    setVagalCoRegulation(c => Math.max(0, Math.min(100, Math.round(100 - (Math.abs(partnerA.heartRate - hr) * 1.2) - (partnerB.muscleTension * 3)))));
                  }}
                  className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-[8px] font-mono text-stone-500 font-bold">
                  <span>MUSCLE TENSION: {partnerB.muscleTension}/10</span>
                  <span>MYOFASCIAL PRESSURE</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={partnerB.muscleTension}
                  onChange={(e) => {
                    const mt = Number(e.target.value);
                    setPartnerB(p => ({ ...p, muscleTension: mt }));
                    setVagalCoRegulation(c => Math.max(0, Math.min(100, Math.round(100 - (Math.abs(partnerA.heartRate - partnerB.heartRate) * 1.2) - (mt * 4)))));
                  }}
                  className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>
            </div>

            {/* MANUAL OVERRIDE VAGAL REGULATION */}
            <div className="flex flex-col gap-2 bg-indigo-50 p-3 rounded-2xl border border-indigo-100">
              <div className="flex justify-between items-center text-[9px] font-black text-indigo-950 uppercase tracking-wider">
                <span>Vagal Parasympathetic Override</span>
                <span>{vagalCoRegulation}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={vagalCoRegulation}
                onChange={(e) => {
                  setVagalCoRegulation(Number(e.target.value));
                  if (Number(e.target.value) >= 80) {
                    // Automatically relax heart rates slowly to reflect the sync!
                    setPartnerA(p => ({ ...p, heartRate: Math.max(72, p.heartRate - 2), muscleTension: Math.max(1, p.muscleTension - 1) }));
                    setPartnerB(p => ({ ...p, heartRate: Math.max(68, p.heartRate - 2), muscleTension: Math.max(1, p.muscleTension - 1) }));
                  }
                }}
                className="w-full h-2 bg-indigo-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>

          </div>

          {/* AI NEURO-SOMATIC COMPILER WORKSPACE */}
          <div className="bg-white p-5 rounded-[2.2rem] border-2 border-stone-200 shadow-sm flex flex-col gap-3.5">
            <h4 className="font-display font-black text-xs text-stone-800 uppercase tracking-tight flex items-center gap-1.5 border-b border-stone-100 pb-2">
              <Cpu size={13} className="text-emerald-600" /> Somatic Co-Regulation Synthesis
            </h4>

            <div className="flex flex-col gap-1.5">
              <label className="text-[8px] font-black uppercase text-stone-400 tracking-wider">Active Conflict/Stress Context:</label>
              <textarea
                value={conflictContext}
                onChange={(e) => setConflictContext(e.target.value)}
                placeholder="Briefly describe what sparked the sympathetic charge..."
                className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-[10px] text-stone-700 focus:outline-none focus:border-indigo-600 font-sans h-16 resize-none"
              />
            </div>

            {/* SYNTHESIZE TRIGGER BUTTON */}
            <button
              type="button"
              onClick={handleGenerateBlueprint}
              disabled={isSynthesizing}
              className={`w-full font-display font-black py-3 rounded-xl border-b-[4px] text-[10px] uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                isSynthesizing
                  ? 'bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed'
                  : 'bg-indigo-950 text-white border-indigo-900 active:translate-y-[2px] active:border-b-[2px] hover:brightness-110'
              }`}
            >
              <Sparkles size={11} className={isSynthesizing ? 'animate-spin' : ''} />
              <span>{isSynthesizing ? 'Synthesizing Neural Wave Blueprint...' : 'Compute Somatic Blueprint'}</span>
            </button>

            {/* BLUEPRINT DISCLOSURE VIEW */}
            <AnimatePresence mode="wait">
              {blueprintResult && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-4 flex flex-col gap-2.5 max-h-[220px] overflow-y-auto select-text"
                >
                  <div className="flex items-center gap-1.5 text-[8.5px] font-black text-indigo-900 uppercase tracking-widest border-b border-indigo-100 pb-1.5">
                    <BookmarkCheck size={11} /> POLYVAGAL NEURAL WAVE REPORT
                  </div>
                  <div className="text-[10px] text-stone-700 font-sans leading-relaxed whitespace-pre-wrap">
                    {blueprintResult}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

        </div>

      </div>

      {/* FOOTER DISCLAIMER */}
      <div className="bg-slate-50 border border-stone-200 p-4 rounded-2xl text-[9px] text-stone-500 font-sans leading-relaxed flex gap-2">
        <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
        <p>
          <strong>Polyvagal Self-Soothing Principle:</strong> Autonomic nervous system activation is contagion-driven; when one partner triggers into fight/flight, the other's system matches. Using resonant breathing to trigger Ventral Vagal activation breaks the threat loop, restoring cognitive clarity and positive sentiment before discussions begin.
        </p>
      </div>

    </div>
  );
}
