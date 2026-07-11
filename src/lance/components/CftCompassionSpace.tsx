import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Send, Sparkles, RefreshCw, Volume2, Wind, Eye, Compass, HelpCircle, Sun, AlertCircle } from 'lucide-react';

interface CriticThought {
  id: string;
  text: string;
  isMelting: boolean;
}

const METTA_MANTRAS = [
  "May I be safe from internal and external harm.",
  "May my mind be peaceful, tranquil, and free from shame.",
  "May my body be healthy, grounded, and ease-filled.",
  "May I live with deep companionate ease each and every day."
];

export default function CftCompassionSpace() {
  const [criticInput, setCriticInput] = useState('');
  const [thoughts, setThoughts] = useState<CriticThought[]>([]);
  const [activeMantraIndex, setActiveMantraIndex] = useState(0);
  const [sootheLevel, setSootheLevel] = useState(50); // warm color slider
  const [showGuide, setShowGuide] = useState(false);
  const [mettaPulseCount, setMettaPulseCount] = useState(0);

  // Sound generator references (using Web Audio synthesizer)
  const [soothingNoisePlayed, setSoothingNoisePlayed] = useState(false);
  const audioCtxRef = React.useRef<AudioContext | null>(null);
  const noiseGainRef = React.useRef<GainNode | null>(null);

  const handleAddCriticThought = (e: React.FormEvent) => {
    e.preventDefault();
    if (!criticInput.trim()) return;

    const newThought: CriticThought = {
      id: Date.now().toString(),
      text: criticInput.trim(),
      isMelting: false
    };

    setThoughts(prev => [...prev, newThought]);
    setCriticInput('');
  };

  const triggerMelt = (id: string) => {
    setThoughts(prev => prev.map(t => hndlMelting(t, id)));
    
    // Play warm chime frequency procedurally
    playWarmChime();

    // Remove after melting animation completes
    setTimeout(() => {
      setThoughts(prev => prev.filter(t => t.id !== id));
      setMettaPulseCount(prev => prev + 1);
    }, 1800);
  };

  const hndlMelting = (thought: CriticThought, targetId: string) => {
    if (thought.id === targetId) {
      return { ...thought, isMelting: true };
    }
    return thought;
  };

  const playWarmChime = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(396, ctx.currentTime); // 396Hz solfeggio root chime
      osc.frequency.exponentialRampToValueAtTime(528, ctx.currentTime + 0.4); // Resolve to 528Hz transformation chime

      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.3);
    } catch (e) {
      console.warn("Audio chime prevented by browser sandbox state.");
    }
  };

  const toggleMettaSound = () => {
    try {
      if (soothingNoisePlayed) {
        if (audioCtxRef.current) audioCtxRef.current.suspend();
        setSoothingNoisePlayed(false);
        return;
      }

      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioContextClass();
        audioCtxRef.current = ctx;

        // Create pink noise block
        const bufferSize = 2 * ctx.sampleRate;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
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
          output[i] *= 0.08;
          b6 = white * 0.115926;
        }

        const source = ctx.createBufferSource();
        source.buffer = noiseBuffer;
        source.loop = true;

        const lowpass = ctx.createBiquadFilter();
        lowpass.type = 'lowpass';
        lowpass.frequency.value = 350; // extremely warm ocean drone

        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(0.35, ctx.currentTime);
        noiseGainRef.current = gainNode;

        source.connect(lowpass);
        lowpass.connect(gainNode);
        gainNode.connect(ctx.destination);
        source.start(0);
      } else {
        audioCtxRef.current.resume();
      }

      setSoothingNoisePlayed(true);
    } catch (e) {
      console.warn(e);
    }
  };

  // Adjust volume in real time based on soothing warmth level
  useEffect(() => {
    if (noiseGainRef.current && audioCtxRef.current) {
      noiseGainRef.current.gain.setValueAtTime(
        (sootheLevel / 100) * 0.45,
        audioCtxRef.current.currentTime
      );
    }
  }, [sootheLevel]);

  return (
    <div id="cft-compassion-root" className="bg-[#F9FAFB] text-slate-800 rounded-3xl p-4 sm:p-6 max-w-4xl mx-auto overflow-hidden relative">
      {/* Background Amber glow ring mimicking somatic warmth */}
      <div 
        className="absolute w-96 h-96 rounded-full bg-amber-400/[0.04] blur-3xl -top-20 -right-20 pointer-events-none transition-all duration-500"
        style={{ transform: `scale(${1 + sootheLevel * 0.005})` }}
      />

      <div className="space-y-6">
        <div className="flex justify-between items-start gap-4">
          <div>
            <span className="text-[10px] uppercase font-black tracking-widest px-2.5 py-1 rounded-md bg-amber-100 text-amber-800 border border-amber-200">
              Compassion-Focused Therapy (CFT)
            </span>
            <h3 className="text-xl font-bold mt-1.5 flex items-center gap-1.5 text-slate-800">
              <Heart className="w-5 h-5 text-rose-500 fill-rose-50" />
              Somatic Compassion Compass & Shame-Melter
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Top mental health practices utilize Compassion protocols (developed by Prof. Paul Gilbert) to shift the brain out of threat-focused vigilance (amygdala charge) into soothing social warmth.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowGuide(!showGuide)}
            className="w-10 h-10 flex items-center justify-center shrink-0 bg-white text-slate-400 hover:text-slate-600 rounded-xl border border-[#F0F0F0] shadow-xs cursor-pointer"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>

        {showGuide && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 bg-amber-50 border border-amber-100 rounded-2xl text-xs text-amber-900 leading-relaxed space-y-2"
          >
            <p>
              CFT maps three neuro-affective systems: <strong>Threat System</strong> (survival/anxiety), <strong>Drive System</strong> (goals/status), and the <strong>Soothe System</strong> (safety/bonding/oxytocin). Inner shame is an overactive threat system.
            </p>
            <p>
              By externalizing negative critic voices and procedurally "melting" them, we disrupt shame habit loops. Combining this with tactile warmth and expanding loving-kindness (Metta) circles stimulates vagus soothing.
            </p>
          </motion.div>
        )}

        {/* Dynamic visual grid Split */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* LEFT: Shredder/Burner of Critic thoughts */}
          <div className="bg-white border border-[#F0F0F0] rounded-2xl p-4.5 space-y-4 flex flex-col justify-between" style={{ boxShadow: '0 3px 14px rgba(0,0,0,0.05)' }}>
            <div>
              <h4 className="text-xs font-black text-rose-900 flex items-center gap-1 uppercase tracking-wider">
                <Sun className="w-4 h-4 text-amber-500" />
                Anti-Self-Critic Letter Melter
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">Type down your harsh inner self-critic talk, then watch it dissolve into harmless dust.</p>
            </div>

            <form onSubmit={handleAddCriticThought} className="flex gap-2 p-1 bg-slate-50 border border-[#F0F0F0] rounded-xl">
              <input
                type="text"
                placeholder="E.g., 'I always let people down'..."
                value={criticInput}
                onChange={(e) => setCriticInput(e.target.value)}
                className="flex-1 text-xs px-3 bg-transparent text-slate-700 outline-none min-h-10"
              />
              <button
                type="submit"
                className="w-10 h-10 shrink-0 flex items-center justify-center bg-rose-500 hover:bg-rose-600 text-white rounded-lg cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

            <div className="space-y-2 h-40 overflow-y-auto pr-1">
              <AnimatePresence>
                {thoughts.length === 0 ? (
                  <div className="h-full flex flex-col justify-center items-center text-center text-slate-400 italic text-xs py-10">
                    <Heart className="w-6 h-6 stroke-1 text-slate-300" />
                    No critic thoughts loaded. Write one to let it go.
                  </div>
                ) : (
                  thoughts.map((thought) => (
                    <motion.div
                      key={thought.id}
                      initial={{ opacity: 1, scale: 1 }}
                      animate={thought.isMelting
                        ? { opacity: 0, scale: [1, 1.05, 0], filter: 'blur(8px)', x: [0, 8, -8, 20] }
                        : { opacity: 1, scale: 1 }
                      }
                      transition={{ duration: 1.6 }}
                      className="p-3 bg-rose-50/50 border border-rose-100 rounded-xl flex justify-between items-center relative overflow-hidden gap-2"
                    >
                      <span className="text-xs text-rose-950 font-medium z-10 leading-snug">{thought.text}</span>
                      {!thought.isMelting ? (
                        <button
                          onClick={() => triggerMelt(thought.id)}
                          className="px-2.5 py-1.5 min-h-8 text-[11px] font-black uppercase text-rose-500 hover:text-white hover:bg-rose-500 border border-rose-300/60 rounded-lg cursor-pointer transition-all z-10 shrink-0"
                        >
                          Melt
                        </button>
                      ) : (
                        <span className="text-[11px] text-amber-500 font-mono animate-pulse shrink-0">Melting...</span>
                      )}
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* RIGHT: Expanding Loving-Kindness (Metta) compass and Somatic Soothe Room */}
          <div className="bg-white border border-[#F0F0F0] rounded-2xl p-4.5 space-y-4 flex flex-col justify-between" style={{ boxShadow: '0 3px 14px rgba(0,0,0,0.05)' }}>
            <div>
              <h4 className="text-xs font-black text-amber-900 flex items-center gap-1.5 uppercase tracking-wider">
                <Compass className="w-4 h-4 text-rose-500" />
                Ventral Metta Compass
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">Click to pulse active compassionate energy circles outward to self & others.</p>
            </div>

            {/* Concentric rings animation container representing the heart */}
            <div className="relative h-28 bg-slate-50 border border-slate-100 rounded-xl flex justify-center items-center overflow-hidden">
              <AnimatePresence>
                {mettaPulseCount > 0 && (
                  <motion.div
                    key={mettaPulseCount}
                    initial={{ scale: 0.1, opacity: 0.8 }}
                    animate={{ scale: 2.8, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 3.5 }}
                    className="absolute w-20 h-20 rounded-full border border-rose-400 bg-rose-100/10 pointer-events-none"
                  />
                )}
              </AnimatePresence>

              <button
                type="button"
                onClick={() => {
                  setMettaPulseCount(prev => prev + 1);
                  playWarmChime();
                }}
                className="w-16 h-16 rounded-full bg-rose-50 border-2 border-rose-300 hover:border-rose-400 flex items-center justify-center cursor-pointer transition-all hover:scale-105 shadow-sm active:scale-95"
              >
                <Heart className="w-7 h-7 text-rose-500 fill-rose-100" />
              </button>

              <div className="absolute bottom-2 font-mono text-[11px] text-slate-400 uppercase tracking-widest">
                Pulses Generated: {mettaPulseCount}
              </div>
            </div>

            <div className="p-3 bg-rose-50/60 border border-rose-100/60 rounded-xl space-y-2">
              <p className="text-xs text-rose-950 font-bold leading-relaxed text-center italic">
                "{METRA_CURR_MANTRA(activeMantraIndex)}"
              </p>
              <div className="flex justify-center">
                <button
                  onClick={() => {
                    setActiveMantraIndex(prev => (prev + 1) % METTA_MANTRAS.length);
                    playWarmChime();
                  }}
                  className="px-3 py-2 min-h-10 font-mono text-[11px] font-black uppercase text-rose-600 hover:text-white border border-rose-200 bg-white hover:bg-rose-500 rounded-lg cursor-pointer transition-all"
                >
                  Anchor Next Mantra
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Somatic haven customization sliders */}
        <div className="p-4 bg-white/70 border border-amber-100/60 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-[10px] font-mono uppercase font-black tracking-widest text-slate-400">Somatic haven builder</span>
            <p className="text-xs font-bold text-slate-800">Modulate Environmental Color & Warmth</p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto flex-1 max-w-sm justify-end">
            <span className="text-xs text-slate-400 shrink-0 font-bold">Thalamic Temp</span>
            <input 
              type="range"
              min="0"
              max="100"
              value={sootheLevel}
              onChange={(e) => setSootheLevel(parseInt(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <span className="text-xs font-mono font-bold text-amber-600 shrink-0">{sootheLevel}%</span>
          </div>

          <button
            onClick={toggleMettaSound}
            className={`px-4 py-2 text-xs rounded-xl border flex items-center gap-1.5 cursor-pointer font-bold transition-all ${
              soothingNoisePlayed 
                ? 'bg-amber-100 text-amber-900 border-amber-300' 
                : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            {soothingNoisePlayed ? "Mute Ocean Soothe" : "Play Somatic Ocean Drone"}
          </button>
        </div>
      </div>
    </div>
  );
}

function METRA_CURR_MANTRA(index: number) {
  return METTA_MANTRAS[index];
}
