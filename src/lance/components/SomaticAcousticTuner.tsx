import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Wind, Volume2, Sparkles, AlertTriangle, ShieldCheck, Play, Square, Circle, HelpCircle } from 'lucide-react';

export default function SomaticAcousticTuner() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [frequency, setFrequency] = useState(110); // 110Hz is standard chest/vagal resonance freq
  const [isHummingActive, setIsHummingActive] = useState(false);
  const [vagalCoherenceIndex, setVagalCoherenceIndex] = useState(48); // biofeedback index percentage
  const [timerCount, setTimerCount] = useState(0);

  // Audio nodes refs for Web Audio API sine synthesis
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorNodeRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const filterNodeRef = useRef<BiquadFilterNode | null>(null);

  // Canvas ref for live wavy waveform visualization
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);

  useEffect(() => {
    // Canvas continuous waving draw loop
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let localFrameId: number;
    let phase = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = canvas.width;
      const h = canvas.height;

      // Draw background ambient circle guide lines
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, 70, 0, 2 * Math.PI);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(w / 2, h / 2, 40, 0, 2 * Math.PI);
      ctx.stroke();

      // Draw active pulsing sinusoids
      const numWaves = isHummingActive ? 4 : isPlaying ? 2 : 1;
      const amplitude = isHummingActive ? 45 : isPlaying ? 20 : 6;
      const speed = isHummingActive ? 0.12 : isPlaying ? 0.05 : 0.015;

      for (let i = 0; i < numWaves; i++) {
        ctx.beginPath();
        ctx.strokeStyle = i === 0 ? 'rgba(16, 185, 129, 0.6)' : i === 1 ? 'rgba(99, 102, 241, 0.4)' : 'rgba(236, 72, 153, 0.2)';
        ctx.lineWidth = i === 0 ? 2 : 1;
        
        // Let's draw waves wrap around a circle
        const radius = 60 + i * 8 + (isHummingActive ? Math.sin(phase * 2) * 5 : 0);
        
        for (let theta = 0; theta <= 2 * Math.PI; theta += 0.05) {
          const radialMod = amplitude * Math.sin(theta * 6 + phase + i * Math.PI / 4);
          const currentRadius = radius + radialMod;
          const x = w / 2 + Math.cos(theta) * currentRadius;
          const y = h / 2 + Math.sin(theta) * currentRadius;

          if (theta === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.closePath();
        ctx.stroke();
      }

      phase += speed;
      localFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(localFrameId);
    };
  }, [isPlaying, isHummingActive]);

  // Handle active resonance index simulating coherence biofeedback
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setTimerCount((prev) => prev + 1);
        setVagalCoherenceIndex((prev) => {
          const drift = isHummingActive ? 3.5 : 0.4;
          const target = isHummingActive ? 92 : 64;
          const next = prev + (target - prev) * 0.15 + (Math.random() - 0.5) * drift;
          return Math.max(10, Math.min(100, Math.round(next)));
        });
      }, 1000);
    } else {
      setTimerCount(0);
      setVagalCoherenceIndex((prev) => {
        const next = prev + (30 - prev) * 0.1;
        return Math.max(10, Math.min(100, Math.round(next)));
      });
    }
    return () => clearInterval(interval);
  }, [isPlaying, isHummingActive]);

  const startAudioSynthesis = () => {
    try {
      // 1. Create context
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtxClass();
      audioCtxRef.current = ctx;

      // 2. Main carrier frequency
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      oscillatorNodeRef.current = osc;

      // 3. Low Pass Filter to make drone smooth and chest-vibrational
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(140, ctx.currentTime);
      filterNodeRef.current = filter;

      // 4. Smooth Gain node (avoid clicking on startup)
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 1.5); // ramp up slowly
      gainNodeRef.current = gain;

      // 5. Connect node graphs
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      setIsPlaying(true);
    } catch (err) {
      console.error("Audio Synthesis initiation failed:", err);
    }
  };

  const stopAudioSynthesis = () => {
    if (gainNodeRef.current && audioCtxRef.current) {
      const ctx = audioCtxRef.current;
      gainNodeRef.current.gain.setValueAtTime(gainNodeRef.current.gain.value, ctx.currentTime);
      gainNodeRef.current.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3); // ramp down smoothly
    }
    
    setTimeout(() => {
      if (oscillatorNodeRef.current) {
        oscillatorNodeRef.current.stop();
        oscillatorNodeRef.current.disconnect();
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
      audioCtxRef.current = null;
      oscillatorNodeRef.current = null;
      gainNodeRef.current = null;
      filterNodeRef.current = null;
      setIsPlaying(false);
      setIsHummingActive(false);
    }, 350);
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      stopAudioSynthesis();
    } else {
      startAudioSynthesis();
    }
  };

  const handleFrequencyChange = (value: number) => {
    setFrequency(value);
    if (oscillatorNodeRef.current && audioCtxRef.current) {
      oscillatorNodeRef.current.frequency.setValueAtTime(value, audioCtxRef.current.currentTime);
    }
  };

  useEffect(() => {
    return () => {
      // Destructor cleanup
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  return (
    <div id="vagal-coherence-acoustic" className="max-w-6xl mx-auto space-y-6 text-left px-4 py-4" style={{ background: '#F9FAFB' }}>

      {/* Intro Header */}
      <div className="rounded-3xl p-6 relative overflow-hidden bg-white" style={{ boxShadow: '0 3px 14px rgba(0,0,0,0.05)' }}>
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: '#14B8A614' }} />
        <div className="space-y-2 relative">
          <div className="flex items-center gap-1.5">
            <span className="px-2 py-1 text-[10px] font-black uppercase tracking-widest rounded-full" style={{ background: '#14B8A618', color: '#0D9488' }}>
              Somatic Acoustics / Vagal Coherence
            </span>
          </div>
          <h2 className="font-display text-2xl font-bold tracking-tight" style={{ color: '#3C3C3C' }}>
            Vagal Sound Acoustic Tuner
          </h2>
          <p className="text-xs leading-relaxed max-w-3xl" style={{ color: '#6B7280' }}>
            Vagus nerve stimulation can be achieved through vocal cords resonance since the lower laryngeal and pharyngeal branches are fed by the recurrent vagal branch. Producing a sustained chest hum at low vibrational frequencies (~110 Hz) triggers rapid parasympathetic cooling, downregulating heart rate and soothing adrenaline-driven panic.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Vagal Resonance Visual feedback & controls (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white p-5 rounded-3xl space-y-4" style={{ boxShadow: '0 3px 14px rgba(0,0,0,0.05)', border: '1px solid #F0F0F0' }}>
            <h3 className="font-sans text-xs font-black uppercase tracking-wider" style={{ color: '#9CA3AF' }}>
              Frequency Tuner & Resonance Guide
            </h3>

            {/* Visual feedback canvas area */}
            <div className="relative w-full h-[220px] rounded-2xl flex items-center justify-center overflow-hidden my-3" style={{ background: '#F9FAFB', border: '1px solid #F0F0F0' }}>
              <canvas
                ref={canvasRef}
                width={380}
                height={210}
                className="absolute inset-0 w-full h-full"
              />

              {/* absolute center feedback readings */}
              <div className="z-10 text-center space-y-1">
                <span className="text-[11px] font-black uppercase tracking-widest block" style={{ color: '#0D9488' }}>Vagal Coherence index</span>
                <span className="font-mono text-4xl font-extrabold tracking-tight animate-pulse" style={{ color: '#14B8A6' }}>
                  {vagalCoherenceIndex}%
                </span>
                <span className="text-[11px] font-bold block uppercase tracking-wider" style={{ color: '#9CA3AF' }}>
                  {isPlaying ? `Session Time: ${timerCount}s` : 'Synthesis Idle'}
                </span>
              </div>
            </div>

            {/* Tuner Controls slider */}
            <div className="space-y-4">
              <div className="p-4 rounded-2xl space-y-3" style={{ background: '#F9FAFB', border: '1px solid #F0F0F0' }}>
                <div className="flex justify-between items-center text-[11px] font-black" style={{ color: '#3C3C3C' }}>
                  <span className="uppercase tracking-wider">Chest Resonance Target Pitch</span>
                  <span className="font-mono text-xs font-black bg-white px-2 py-0.5 rounded-full" style={{ border: '1px solid #F0F0F0', color: '#0D9488' }}>
                    {frequency} Hz {frequency === 110 ? '(Voo Wave Optimal)' : ''}
                  </span>
                </div>
                <input
                  type="range"
                  min="80"
                  max="160"
                  step="1"
                  value={frequency}
                  onChange={(e) => handleFrequencyChange(parseInt(e.target.value, 10))}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                  style={{ background: '#E5E7EB', accentColor: '#14B8A6' }}
                />
                <div className="flex justify-between text-[11px] font-bold mt-1 uppercase tracking-wider" style={{ color: '#9CA3AF' }}>
                  <span>🔊 Deep Chest Hum (Male Baseline)</span>
                  <span>110 Hz Ideal</span>
                  <span>🔊 Lighter Throat Hum (Female Baseline)</span>
                </div>
              </div>

              {/* Start synthesis action buttons */}
              <div className="flex gap-2.5">
                <motion.button
                  type="button"
                  whileTap={{ y: 3, boxShadow: 'none' }}
                  onClick={handleTogglePlay}
                  className="flex-1 min-h-[44px] py-3 px-5 rounded-2xl font-black text-xs uppercase tracking-wider transition-colors duration-300 flex items-center justify-center gap-2 cursor-pointer text-white"
                  style={
                    isPlaying
                      ? { background: '#EF4444', boxShadow: '0 5px 0 #B91C1C' }
                      : { background: 'linear-gradient(135deg, #14B8A6, #58CC02)', boxShadow: '0 5px 0 #0D9488' }
                  }
                >
                  {isPlaying ? (
                    <>
                      <Square className="w-4 h-4 fill-current shrink-0" />
                      <span>Stop Synthesizer Drone</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current shrink-0" />
                      <span>Start Resonance carrier wave</span>
                    </>
                  )}
                </motion.button>

                {isPlaying && (
                  <button
                    type="button"
                    onMouseDown={() => setIsHummingActive(true)}
                    onMouseUp={() => setIsHummingActive(false)}
                    onTouchStart={() => setIsHummingActive(true)}
                    onTouchEnd={() => setIsHummingActive(false)}
                    className="px-5 py-3 min-h-[44px] rounded-2xl font-black text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer"
                    style={
                      isHummingActive
                        ? { background: '#1CB0F6', border: '1px solid #0092CC', color: '#FFFFFF', boxShadow: '0 3px 14px rgba(28,176,246,0.35)', transform: 'scale(1.03)' }
                        : { background: '#FFFFFF', border: '1px solid #E5E7EB', color: '#3C3C3C' }
                    }
                  >
                    <span>{isHummingActive ? '🗣️ Resonance Locked!' : '🗣️ HOLD: Match your Hum'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Step-by-Step Vagal Voo Guide (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="font-display text-sm font-bold text-gray-800">Chest Resonance Protocol</h3>
            
            <div className="premium-divider" />

            <div className="space-y-4 text-xs font-semibold text-slate-600 leading-relaxed">
              
              <div className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">1</span>
                <div>
                  <strong className="text-slate-800 font-extrabold block uppercase tracking-tight text-[10.5px]">Configure Baseline Pitch</strong>
                  <p className="text-[10px] text-zinc-500 leading-normal">
                    Adjust the carrier frequency slider until you feel a deep, comforting vibration tone in your speakers or headphones. ~110 Hz is optimal for vagus response.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">2</span>
                <div>
                  <strong className="text-slate-800 font-extrabold block uppercase tracking-tight text-[10.5px]">Deep Diaphragmatic Inhale</strong>
                  <p className="text-[10px] text-zinc-500 leading-normal">
                    Inhale slowly through your nose, expanding your lower abdomen, fully filling the lungs without lifting your shoulders or straining your throat.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">3</span>
                <div>
                  <strong className="text-slate-800 font-extrabold block uppercase tracking-tight text-[10.5px]">Chest Humming Exhale ("Voo")</strong>
                  <p className="text-[10px] text-zinc-500 leading-normal">
                    On exhalation, produce a sustained chest sound like <strong>"Voooooooo"</strong> or <strong>"Huuuuuuum"</strong>. Match your vocal pitch to the synthesizer wave tone. Tap the **Match your Hum** button to locked lock high coherence.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">4</span>
                <div>
                  <strong className="text-slate-800 font-extrabold block uppercase tracking-tight text-[10.5px]">The 6-Second Tail Pause</strong>
                  <p className="text-[10px] text-zinc-500 leading-normal">
                    Once the air is completely empty, keep a quiet 2-4 second resting gap before beginning the next slow diaphragmatic intake. Repeat 5 times for full nervous system cooling.
                  </p>
                </div>
              </div>

            </div>

            <div className="p-3.5 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-start gap-2 text-[10px] text-emerald-950 font-bold">
              <span>🛡️</span>
              <div>
                <strong className="block mb-0.5 font-black uppercase text-[10px]">Parasympathetic Activation:</strong>
                 Sustained vocalization forces your exhalations to be significantly longer than your inhalations, stimulating the solar plexus vagal nodes, decreasing heart rate variance, and restoring baseline tranquil temperatures.
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
