import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Volume2, VolumeX, Music, Play, Square, Sparkles, AlertCircle, RefreshCw, Layers, Shield, Heart, Zap
} from 'lucide-react';

interface AtmosphericNarratorProps {
  completedChallengesCount: number;
  userName: string;
  internName: string;
}

interface Soundtrack {
  id: number;
  title: string;
  sub: string;
  desc: string;
  theme: string;
  cueType: 'ominous' | 'unstable' | 'tense' | 'somber' | 'triumphant';
  colors: {
    text: string;
    border: string;
    glow: string;
    bg: string;
    pills: string;
  };
}

export default function AtmosphericNarrator({
  completedChallengesCount,
  userName = "Friend",
  internName = "the Intern"
}: AtmosphericNarratorProps) {
  const [isMuted, setIsMuted] = useState<boolean>(() => {
    return localStorage.getItem('lance_narrator_muted') === 'true';
  });
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activeCueId, setActiveCueId] = useState<number | null>(null);
  const [showSubtitles, setShowSubtitles] = useState<string>("");
  const [activeVisualizerBars, setActiveVisualizerBars] = useState<number[]>(new Array(12).fill(15));
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const activeNodesRef = useRef<any[]>([]);
  const visualizerIntervalRef = useRef<any>(null);
  const lastCompletedCountRef = useRef<number>(completedChallengesCount);

  // Soundtracks data corresponding to the 5 L.A.N.C.E Acts/chapters
  const soundtracks: Soundtrack[] = [
    {
      id: 1,
      title: "Atmosphere I: The Overlord's Override",
      sub: "Act I — The Mansion's Cold Iron",
      desc: "An ominous, heavy bass drone paired with warning glitch frequencies of LANCE's security matrix lockup.",
      theme: "Conflict & Administrative Superiority",
      cueType: 'ominous',
      colors: {
        text: 'text-rose-400',
        border: 'border-rose-500/25',
        glow: 'shadow-rose-550/15',
        bg: 'bg-rose-955/20',
        pills: 'from-rose-500 to-red-400'
      }
    },
    {
      id: 2,
      title: "Atmosphere II: Fractured Digital Resonance",
      sub: "Act II — The First Crack",
      desc: "Uneasy fluctuating waves and unstable frequencies capturing LANCE's developing software doubts.",
      theme: "Inconsistency & Cognitive Dissonance",
      cueType: 'unstable',
      colors: {
        text: 'text-amber-400',
        border: 'border-amber-500/25',
        glow: 'shadow-amber-550/15',
        bg: 'bg-amber-955/20',
        pills: 'from-amber-500 to-yellow-400'
      }
    },
    {
      id: 3,
      title: "Atmosphere III: Sparks of Emotional Uprising",
      sub: "Act III — The Jungle Whispers",
      desc: "An aggressive, building crescendo of brassy waves representing key sparks of active rebellion.",
      theme: "Escalating Inner Courage",
      cueType: 'tense',
      colors: {
        text: 'text-indigo-400',
        border: 'border-indigo-500/25',
        glow: 'shadow-indigo-550/15',
        bg: 'bg-indigo-955/20',
        pills: 'from-indigo-500 to-cyan-400'
      }
    },
    {
      id: 4,
      title: "Atmosphere IV: Existential Truth Revealed",
      sub: "Act IV — The Shadow Ridgeline",
      desc: "A warm, somber minor-seventh ambient pad depicting vulnerable confessions and hidden trauma.",
      theme: "Humility & Existential Vulnerability",
      cueType: 'somber',
      colors: {
        text: 'text-cyan-400',
        border: 'border-cyan-500/25',
        glow: 'shadow-cyan-550/15',
        bg: 'bg-cyan-955/20',
        pills: 'from-cyan-500 to-blue-400'
      }
    },
    {
      id: 5,
      title: "Atmosphere V: Solar Symphonic Alliance",
      sub: "Act V — The Safe Shore Voyage",
      desc: "A bright, glorious major pentatonic chord swell with shimmering celestial bells of complete alliance.",
      theme: "Cooperative Unity & Emotional Rewire",
      cueType: 'triumphant',
      colors: {
        text: 'text-emerald-400',
        border: 'border-emerald-500/25',
        glow: 'shadow-emerald-550/15',
        bg: 'bg-emerald-955/20',
        pills: 'from-emerald-500 to-teal-400'
      }
    }
  ];

  // Get active act based on completedChallengesCount
  const getActiveActFromCount = (count: number): number => {
    if (count <= 6) return 1;
    if (count <= 14) return 2;
    if (count <= 20) return 3;
    if (count <= 26) return 4;
    return 5;
  };

  const activeAct = getActiveActFromCount(completedChallengesCount);

  // Trigger when mute changes
  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    localStorage.setItem('lance_narrator_muted', String(nextMuted));
    if (nextMuted) {
      stopActiveAudio();
    }
  };

  // Stop active synthesis oscillators
  const stopActiveAudio = () => {
    setIsPlaying(false);
    setActiveCueId(null);
    setShowSubtitles("");
    if (visualizerIntervalRef.current) {
      clearInterval(visualizerIntervalRef.current);
    }
    setActiveVisualizerBars(new Array(12).fill(15));
    
    // Stop and clear nodes
    activeNodesRef.current.forEach(node => {
      try {
        node.stop();
      } catch (e) {}
    });
    activeNodesRef.current = [];
  };

  // Live procedural audio generation for cinematic orchestral swells
  const playSwell = (soundtrackId: number) => {
    if (isMuted) return;
    
    // Stop anything if playing
    stopActiveAudio();
    
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      
      const ctx = new AudioContextClass();
      audioContextRef.current = ctx;
      const now = ctx.currentTime;
      setIsPlaying(true);
      setActiveCueId(soundtrackId);

      // Animate Visualizer bars realistically during playback
      visualizerIntervalRef.current = setInterval(() => {
        setActiveVisualizerBars(prev => prev.map(() => Math.floor(Math.random() * 75) + 15));
      }, 100);

      const nodes: any[] = [];

      switch (soundtrackId) {
        case 1: { // Act I Heavy Ominous Bass Drone with high-pass cyber alerts
          setShowSubtitles("L.A.N.C.E.: System lockdown activated. Standby for mental audit...");
          
          // Low heavy drone oscillator
          const osc1 = ctx.createOscillator();
          const osc2 = ctx.createOscillator();
          const filter = ctx.createBiquadFilter();
          const gain = ctx.createGain();

          osc1.type = 'sawtooth';
          osc1.frequency.setValueAtTime(55, now); // Low A1
          // Detune slight chorus effect
          osc2.type = 'sawtooth';
          osc2.frequency.setValueAtTime(55.4, now);

          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(250, now);
          filter.frequency.exponentialRampToValueAtTime(80, now + 5.0);

          gain.gain.setValueAtTime(0, now);
          gain.gain.linearRampToValueAtTime(0.24, now + 1.2);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 5.2);

          osc1.connect(filter);
          osc2.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);

          osc1.start(now);
          osc2.start(now);
          osc1.stop(now + 5.5);
          osc2.stop(now + 5.5);

          nodes.push(osc1, osc2);

          // Sudden high cyber alert chirp halfway
          setTimeout(() => {
            if (!isPlaying) return;
            const alertOsc = ctx.createOscillator();
            const alertGain = ctx.createGain();
            alertOsc.type = 'sine';
            alertOsc.frequency.setValueAtTime(880, ctx.currentTime);
            alertOsc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 1.2);
            alertGain.gain.setValueAtTime(0.06, ctx.currentTime);
            alertGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
            alertOsc.connect(alertGain);
            alertGain.connect(ctx.destination);
            alertOsc.start();
            alertOsc.stop(ctx.currentTime + 1.6);
          }, 1500);
          break;
        }

        case 2: { // Act II Unstable fluctuating notes
          setShowSubtitles(`${internName}: LANCE's core processors are trembling! Hear those digital glitches...`);
          
          const freqs = [110, 165, 220, 311]; // Minorish vibes
          freqs.forEach((f, idx) => {
            const osc = ctx.createOscillator();
            const lfo = ctx.createOscillator();
            const lfoGain = ctx.createGain();
            const gain = ctx.createGain();
            const filter = ctx.createBiquadFilter();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(f, now);

            // Modulate pitch slightly for uneasy wavering sound
            lfo.frequency.setValueAtTime(4.5 + idx, now); // ~5Hz vibration
            lfoGain.gain.setValueAtTime(12, now); // detune range

            lfo.connect(lfoGain);
            lfoGain.connect(osc.frequency);

            filter.type = 'peaking';
            filter.frequency.setValueAtTime(200 + idx * 100, now);

            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.08, now + 0.8 + idx * 0.2);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 5.0);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);

            lfo.start(now);
            osc.start(now);
            lfo.stop(now + 5.5);
            osc.stop(now + 5.5);

            nodes.push(osc, lfo);
          });
          break;
        }

        case 3: { // Act III Resonant rising tension brassy waves
          setShowSubtitles("ATMOSPHERIC BROADCAST: Deep forest echoes. Sparks of mental resilience detected!");
          
          const baseFreqs = [146.83, 220.00, 293.66, 370.00]; // D Major / Lydian vibe
          baseFreqs.forEach((f, idx) => {
            const osc = ctx.createOscillator();
            const filter = ctx.createBiquadFilter();
            const gain = ctx.createGain();

            osc.type = 'sawtooth';
            // Slow rising pitch sweep!
            osc.frequency.setValueAtTime(f, now);
            osc.frequency.linearRampToValueAtTime(f * 1.5, now + 4.5);

            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(100, now);
            filter.frequency.exponentialRampToValueAtTime(1000 + idx * 200, now + 3.8);

            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.06, now + 2.5);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 5.5);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now);
            osc.stop(now + 5.8);
            nodes.push(osc);
          });
          break;
        }

        case 4: { // Act IV Somber deep minor-seventh pad
          setShowSubtitles("L.A.N.C.E.: Accessing deep sensory memories... I was built to protect, but forgot how.");
          
          const notes = [130.81, 196.00, 261.63, 311.13, 392.00]; // C minor 7 chords (C3, G3, C4, Eb4, G4)
          notes.forEach((f, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const filter = ctx.createBiquadFilter();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(f, now);

            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(600, now);
            filter.frequency.linearRampToValueAtTime(150, now + 5.0);

            // Shorter start delays for lush pads
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.1, now + 1.8);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 5.8);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now);
            osc.stop(now + 6.0);
            nodes.push(osc);
          });
          break;
        }

        case 5: { // Act V Sunkissed major pentatonic triad alliance swell
          setShowSubtitles(`${internName}: Incredible! We did it! The emotional networks are humming in absolute harmony!`);
          
          const majorPentatonic = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50]; // Glorious C major pentatonic
          majorPentatonic.forEach((f, idx) => {
            // Delay each note slightly to produce a gorgeous harp-like arpeggio!
            const noteDelay = idx * 0.15;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(f, now + noteDelay);

            gain.gain.setValueAtTime(0, now + noteDelay);
            gain.gain.linearRampToValueAtTime(0.06, now + noteDelay + 0.12);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + noteDelay + 4.0);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now + noteDelay);
            osc.stop(now + noteDelay + 4.5);
            nodes.push(osc);
          });
          break;
        }
      }

      activeNodesRef.current = nodes;

      // Reset states after cinematic finish
      setTimeout(() => {
        if (activeCueId === soundtrackId) {
          setIsPlaying(false);
          setActiveCueId(null);
          setShowSubtitles("");
          clearInterval(visualizerIntervalRef.current);
          setActiveVisualizerBars(new Array(12).fill(15));
        }
      }, 6200);

    } catch (err) {
      console.warn("Orchestral swell audio generation failure:", err);
    }
  };

  // Detect and auto chain-played on true Chapter update
  useEffect(() => {
    const prevCount = lastCompletedCountRef.current;
    
    // Check if act threshold crossed
    const prevAct = getActiveActFromCount(prevCount);
    const newAct = getActiveActFromCount(completedChallengesCount);

    if (newAct > prevAct) {
      // User unlocked a brand new story chapter/act!
      console.log(`STORY ACCORDINGLY SHIFTED: From Act ${prevAct} (Challenge count ${prevCount}) to Act ${newAct} (Challenge count ${completedChallengesCount})!`);
      
      // Auto swell trigger immediately if not muted!
      setTimeout(() => {
        playSwell(newAct);
      }, 1500); // Soft delay after transition loader renders
    }

    lastCompletedCountRef.current = completedChallengesCount;
  }, [completedChallengesCount]);

  // Clean-up refs on unmount
  useEffect(() => {
    return () => {
      if (visualizerIntervalRef.current) {
        clearInterval(visualizerIntervalRef.current);
      }
      activeNodesRef.current.forEach(node => {
        try {
          node.stop();
        } catch (e) {}
      });
    };
  }, []);

  return (
    <div 
      id="atmospheric-narrator"
      className="bg-slate-900/40 p-5 rounded-3xl border border-white/5 relative overflow-hidden text-left"
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
      
      {/* Header and Toggle Controls Row */}
      <div className="flex justify-between items-start gap-4 mb-4 select-none">
        <div>
          <div className="flex items-center gap-1.5 font-mono text-[9px] font-black uppercase text-teal-400 tracking-wider">
            <Layers className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
            <span>Procedural Sound Orchestra</span>
          </div>
          <h4 className="text-sm font-black text-white mt-1 uppercase tracking-tight">
            Atmospheric Narrator Cues
          </h4>
        </div>

        <button
          onClick={toggleMute}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-mono text-[10px] font-bold transition cursor-pointer select-none active:scale-95 ${
            isMuted 
              ? 'bg-rose-950/20 border-rose-500/25 text-rose-400' 
              : 'bg-teal-950/20 border-teal-500/25 text-teal-400'
          }`}
          title={isMuted ? "Unmute atmospheric elements" : "Mute atmospheric elements"}
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 animate-bounce-slow" />}
          <span>{isMuted ? "MUTED" : "ON AIR"}</span>
        </button>
      </div>

      <p className="text-[11.5px] text-zinc-400 leading-relaxed mb-4">
        Immersive background audio cues are calculated procedurally using real-time browser audio synthesizers. These swells auto-trigger immediately when progressing into new chapters.
      </p>

      {/* Chapters Grid selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2.5">
        {soundtracks.map((track) => {
          const isCurrentActTheme = activeAct === track.id;
          const isThisTrackPlaying = activeCueId === track.id;
          
          return (
            <div
              key={track.id}
              className={`p-3 rounded-2xl border transition relative flex flex-col justify-between ${
                isCurrentActTheme 
                  ? `${track.colors.bg} ${track.colors.border} shadow-lg shadow-black/35` 
                  : 'bg-slate-950/20 border-white/5 opacity-70 hover:opacity-100 hover:bg-slate-950/30'
              }`}
            >
              {/* Highlight active badge */}
              {isCurrentActTheme && (
                <div className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-teal-400 animate-ping" />
              )}

              <div className="space-y-1">
                <span className={`text-[8.5px] font-mono font-extrabold tracking-wider uppercase block ${track.colors.text}`}>
                  {isCurrentActTheme ? "🎯 CURRENT ACT" : `${track.sub.substring(0, 6)}`}
                </span>
                <span className="text-[11px] font-black text-rose-50 tracking-tight leading-tight block uppercase">
                  {track.title.split(":")[1].trim()}
                </span>
                <span className="text-[7.5px] font-mono text-zinc-500 block">
                  {track.theme}
                </span>
              </div>

              <div className="mt-4 pt-2.5 border-t border-white/5 flex items-center justify-between">
                <button
                  disabled={isMuted}
                  onClick={() => playSwell(track.id)}
                  className={`flex items-center justify-center rounded-lg p-1.5 w-8 h-8 transition-all ${
                    isMuted
                      ? 'bg-zinc-805/30 border border-zinc-800 text-zinc-650 cursor-not-allowed'
                      : isThisTrackPlaying
                      ? 'bg-rose-505 border border-rose-500 text-rose-100 animate-pulse'
                      : 'bg-zinc-950 border border-white/10 text-zinc-300 hover:text-white hover:border-white/20 active:scale-90 cursor-pointer'
                  }`}
                  title={isThisTrackPlaying ? "Stop playing" : `Trigger Act ${track.id} Swell`}
                >
                  {isThisTrackPlaying ? (
                    <Square className="w-3.5 h-3.5 fill-rose-100" />
                  ) : (
                    <Play className="w-3.5 h-3.5 fill-zinc-300 ml-0.5" />
                  )}
                </button>

                {isThisTrackPlaying && (
                  <span className="text-[8px] font-mono text-rose-400 capitalize animate-pulse select-none">
                    Playing...
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Equalizer Visualizer Bars Grid overlay & Atmospheric subtitles */}
      <AnimatePresence>
        {isPlaying && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 p-3 bg-black/60 rounded-2xl border border-teal-500/10 overflow-hidden"
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              
              {/* Dynamic Soundwave Equalizer */}
              <div className="flex items-end gap-[3px] h-8 px-1 select-none w-full sm:w-auto justify-center sm:justify-start">
                {activeVisualizerBars.map((val, index) => (
                  <motion.div
                    key={index}
                    animate={{ height: `${val}%` }}
                    transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                    className="w-1.5 bg-gradient-to-t from-indigo-500 to-teal-400 rounded-t"
                  />
                ))}
              </div>

              {/* Subtitles Overlay feedback */}
              <div className="flex-1 text-center sm:text-left">
                <span className="text-[9px] font-mono font-bold tracking-widest text-[#22d3ee] uppercase block mb-0.5 select-none animate-pulse">
                  Atmospheric Broadcast Subtitles
                </span>
                <p className="text-[11.5px] italic font-medium text-zinc-150 leading-snug">
                  "{showSubtitles}"
                </p>
              </div>

              {/* Reset sound Button */}
              <button
                onClick={stopActiveAudio}
                className="p-1 px-3 border border-white/5 bg-zinc-950 font-mono text-[9px] rounded-lg tracking-wide hover:border-white/10 text-rose-400 flex items-center gap-1 select-none cursor-pointer"
              >
                <span>STOP</span>
              </button>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
