import React, { useEffect, useRef, useState } from 'react';
import { VolumeX, Trees, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface JungleAmbiencePlayerProps {
  enabled: boolean;
  activeTab: string;
  completedChallengesCount: number;
}

// Structural Act details for the procedural synthesis — pure function of progress,
// so it lives at module scope rather than being redefined on every render.
function getActParams(count: number) {
  if (count < 6) {
    return {
      id: 1,
      name: "Act I - Arrival & Lockdown",
      description: "Dense quarantined canopy. Tense retro humming, slow regulatory wind breaths.",
      bassFreq1: 52, // Low G#
      bassFreq2: 35, // Low Db
      windFrequency: 160,
      windQ: 3.5,
      windLfoSpeed: 0.05,
      cricketInterval: 6500,
      cricketPitch: 2200,
      enableRain: false,
      enableWaves: false,
      enableCrystals: false
    };
  } else if (count < 14) {
    return {
      id: 2,
      name: "Act II - The Great Escape",
      description: "Deep tropical moisture. Smooth pouring rainfall noise, warm low mud resonance.",
      bassFreq1: 65, // Low C
      bassFreq2: 43, // Sub F
      windFrequency: 220,
      windQ: 1.5,
      windLfoSpeed: 0.1,
      cricketInterval: 4000,
      cricketPitch: 1950,
      enableRain: true,
      enableWaves: false,
      enableCrystals: false
    };
  } else if (count < 20) {
    return {
      id: 3,
      name: "Act III - Evading the Patrols",
      description: "Subterranean mossy cavern. Damp resonant filters, cold hollow draft sweeps.",
      bassFreq1: 46, // Extremely low
      bassFreq2: 31,
      windFrequency: 130,
      windQ: 5.0, // Sharp cave resonance peaks
      windLfoSpeed: 0.03,
      cricketInterval: 7500,
      cricketPitch: 1600,
      enableRain: false,
      enableWaves: false,
      enableCrystals: false
    };
  } else if (count < 26) {
    return {
      id: 4,
      name: "Act IV - The Shadow Ridgeline",
      description: "Cold mountain heights. High winds, shivering resonances and vector tech pulses.",
      bassFreq1: 58,
      bassFreq2: 39,
      windFrequency: 380,
      windQ: 1.8,
      windLfoSpeed: 0.18,
      cricketInterval: 5000,
      cricketPitch: 2800, // sharp
      enableRain: false,
      enableWaves: false,
      enableCrystals: true
    };
  } else {
    return {
      id: 5,
      name: "Act V - Ocean Harbor Coherence",
      description: "Warm victorious escape. Calming breaking coastal waves and slow organic major drones.",
      bassFreq1: 65,
      bassFreq2: 49,
      windFrequency: 240,
      windQ: 1.0,
      windLfoSpeed: 0.07,
      cricketInterval: 4800,
      cricketPitch: 2000,
      enableRain: false,
      enableWaves: true,
      enableCrystals: false
    };
  }
}

export default function JungleAmbiencePlayer({
  enabled,
  activeTab,
  completedChallengesCount
}: JungleAmbiencePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showMetadata, setShowMetadata] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // This player is 100% local procedural Web Audio synthesis — no server call.
  // (An earlier version tried to fetch an AI-generated loop from
  // /api/therapy/generate-soundscape, but that route was never implemented
  // server-side, so it 404'd on every load. Removed rather than built out,
  // since the procedural synth already gives a complete, working ambience.)
  const [soundscapeMeta, setSoundscapeMeta] = useState<{
    actId: number;
    actName: string;
    themeDesc: string;
  }>(() => {
    const params = getActParams(completedChallengesCount);
    return { actId: params.id, actName: params.name, themeDesc: params.description };
  });

  useEffect(() => {
    const params = getActParams(completedChallengesCount);
    setSoundscapeMeta({ actId: params.id, actName: params.name, themeDesc: params.description });
  }, [completedChallengesCount]);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);

  // Synth subsegment nodes
  const rainGainRef = useRef<GainNode | null>(null);
  const waveGainRef = useRef<GainNode | null>(null);
  const windGainRef = useRef<GainNode | null>(null);
  const bassGainRef = useRef<GainNode | null>(null);
  const cricketGainRef = useRef<GainNode | null>(null);
  const crystalGainRef = useRef<GainNode | null>(null);

  // Active synth node arrays for deep cleanup
  const activeSynthOscillators = useRef<any[]>([]);
  const cricketTimerRef = useRef<any>(null);
  const waveTimerRef = useRef<any>(null);
  const crystalTimerRef = useRef<any>(null);

  // Determine if soundscape is allowed to run
  const shouldPlay = enabled && activeTab === 'checkin';

  // Handle active states (shouldPlay triggers or meta transitions)
  useEffect(() => {
    if (shouldPlay) {
      // Re-trigger playback or crossfade to updated stream
      startSoundscape();
    } else {
      stopSoundscape();
    }

    return () => {
      // Don't stop immediately if we are just updating milestones; we handle seamless transitions inside startSoundscape
    };
  }, [shouldPlay, completedChallengesCount]);

  // Clean-up hook on component unmount
  useEffect(() => {
    return () => {
      stopSoundscape();
    };
  }, []);

  const startSoundscape = async () => {
    try {
      // 1. Establish/Resume AudioContext
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtxClass) {
        setAudioError(true);
        return;
      }

      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtxClass();
      }

      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      // 2. Setup (or reuse) Master Gain for ultra-smooth crossfades
      let masterGain = masterGainRef.current;
      if (!masterGain) {
        masterGain = ctx.createGain();
        masterGain.gain.setValueAtTime(0, ctx.currentTime);
        masterGain.connect(ctx.destination);
        masterGainRef.current = masterGain;
      }

      // Fade master volume up gracefully
      masterGain.gain.linearRampToValueAtTime(0.40, ctx.currentTime + 1.5);

      // Clean up previous playing emitters to host the new style
      clearPlayingNodes();
      setupProceduralSynth(ctx, masterGain);

    } catch (err) {
      console.error("Failed to launch soundscape:", err);
      setAudioError(true);
    }
  };

  const setupProceduralSynth = (ctx: AudioContext, master: GainNode) => {
    setIsPlaying(true);
    const params = getActParams(completedChallengesCount);

    // Create a 2-second white noise buffer for continuous environmental static
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    // 1. Dynamic Wind / Breeze Swells
    const noiseNode = ctx.createBufferSource();
    noiseNode.buffer = noiseBuffer;
    noiseNode.loop = true;

    const bandpassFilter = ctx.createBiquadFilter();
    bandpassFilter.type = 'bandpass';
    bandpassFilter.Q.setValueAtTime(params.windQ, ctx.currentTime);
    bandpassFilter.frequency.setValueAtTime(params.windFrequency, ctx.currentTime);

    const windGain = ctx.createGain();
    windGain.gain.setValueAtTime(0.09, ctx.currentTime);

    // Wind LFO modulator
    const windLfo = ctx.createOscillator();
    windLfo.type = 'sine';
    windLfo.frequency.setValueAtTime(params.windLfoSpeed, ctx.currentTime);

    const windLfoGain = ctx.createGain();
    windLfoGain.gain.setValueAtTime(120, ctx.currentTime); // up to 120Hz amplitude

    windLfo.connect(windLfoGain);
    windLfoGain.connect(bandpassFilter.frequency);
    noiseNode.connect(bandpassFilter);
    bandpassFilter.connect(windGain);
    windGain.connect(master);

    noiseNode.start(0);
    windLfo.start(0);

    windGainRef.current = windGain;
    activeSynthOscillators.current.push(noiseNode, windLfo);

    // 2. Heavy Sub-Bass Earth Drone (Calms the parasympathetic brake)
    const baseOsc1 = ctx.createOscillator();
    baseOsc1.type = 'sine';
    baseOsc1.frequency.setValueAtTime(params.bassFreq1, ctx.currentTime);

    const baseOsc2 = ctx.createOscillator();
    baseOsc2.type = 'sine';
    baseOsc2.frequency.setValueAtTime(params.bassFreq2, ctx.currentTime);

    const bassGain = ctx.createGain();
    bassGain.gain.setValueAtTime(0.12, ctx.currentTime);

    baseOsc1.connect(bassGain);
    baseOsc2.connect(bassGain);
    bassGain.connect(master);

    baseOsc1.start(0);
    baseOsc2.start(0);

    bassGainRef.current = bassGain;
    activeSynthOscillators.current.push(baseOsc1, baseOsc2);

    // 3. Periodic Natural Critters / Insect Chirp Engine
    const cricketGain = ctx.createGain();
    cricketGain.gain.setValueAtTime(0.06, ctx.currentTime);
    cricketGain.connect(master);
    cricketGainRef.current = cricketGain;

    const playCricketChirp = () => {
      if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') return;
      const now = audioCtxRef.current.currentTime;

      const osc = audioCtxRef.current.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(params.cricketPitch, now);

      const mod = audioCtxRef.current.createOscillator();
      mod.type = 'sine';
      mod.frequency.setValueAtTime(62, now); // Vibrato

      const modGain = audioCtxRef.current.createGain();
      modGain.gain.setValueAtTime(250, now);

      mod.connect(modGain);
      modGain.connect(osc.frequency);

      const volume = audioCtxRef.current.createGain();
      volume.gain.setValueAtTime(0, now);

      // Pulse a rapid burst of 4 mini-chirps
      const pulses = 4;
      let schedule = now;
      for (let i = 0; i < pulses; i++) {
        volume.gain.exponentialRampToValueAtTime(0.016, schedule + 0.02);
        volume.gain.exponentialRampToValueAtTime(0.0001, schedule + 0.08);
        schedule += 0.14;
      }

      osc.connect(volume);
      volume.connect(cricketGain);

      mod.start(now);
      osc.start(now);

      mod.stop(schedule + 0.1);
      osc.stop(schedule + 0.1);

      cricketTimerRef.current = setTimeout(playCricketChirp, params.cricketInterval + Math.random() * 3000);
    };
    playCricketChirp();

    // 4. Act II Specialized Continuous Rainfall Setup
    if (params.enableRain) {
      const rainSource = ctx.createBufferSource();
      rainSource.buffer = noiseBuffer;
      rainSource.loop = true;

      const lowpass = ctx.createBiquadFilter();
      lowpass.type = 'lowpass';
      lowpass.frequency.setValueAtTime(750, ctx.currentTime); // Hiss of rainfall

      const rainGainNode = ctx.createGain();
      rainGainNode.gain.setValueAtTime(0.07, ctx.currentTime);

      rainSource.connect(lowpass);
      lowpass.connect(rainGainNode);
      rainGainNode.connect(master);

      rainSource.start(0);
      rainGainRef.current = rainGainNode;
      activeSynthOscillators.current.push(rainSource);
    }

    // 5. Act V Specialized Rolling Ocean Waves Setup
    if (params.enableWaves) {
      const wavesSource = ctx.createBufferSource();
      wavesSource.buffer = noiseBuffer;
      wavesSource.loop = true;

      const wavesFilter = ctx.createBiquadFilter();
      wavesFilter.type = 'lowpass';
      wavesFilter.frequency.setValueAtTime(220, ctx.currentTime); // Low surf rumble

      const waveGainNode = ctx.createGain();
      waveGainNode.gain.setValueAtTime(0, ctx.currentTime);

      wavesSource.connect(wavesFilter);
      wavesFilter.connect(waveGainNode);
      waveGainNode.connect(master);
      wavesSource.start(0);

      waveGainRef.current = waveGainNode;
      activeSynthOscillators.current.push(wavesSource);

      // Slowly swell wave volume up/down to replicate rolls
      let oceanState = true;
      const modulateOceanWaves = () => {
        if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') return;
        const now = audioCtxRef.current.currentTime;
        const targetVol = oceanState ? 0.08 : 0.005;
        const transitionSec = oceanState ? 4.5 : 3.5;
        
        waveGainNode.gain.linearRampToValueAtTime(targetVol, now + transitionSec);
        
        oceanState = !oceanState;
        waveTimerRef.current = setTimeout(modulateOceanWaves, transitionSec * 1000);
      };
      modulateOceanWaves();
    }

    // 6. Act IV Specialized Crystalline High Climbs
    if (params.enableCrystals) {
      const crystalGainNode = ctx.createGain();
      crystalGainNode.gain.setValueAtTime(0.04, ctx.currentTime);
      crystalGainNode.connect(master);
      crystalGainRef.current = crystalGainNode;

      const shootCrystalChime = () => {
        if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') return;
        const now = audioCtxRef.current.currentTime;

        const synth = audioCtxRef.current.createOscillator();
        const delay = audioCtxRef.current.createDelay();
        const delayGain = audioCtxRef.current.createGain();
        const synthGain = audioCtxRef.current.createGain();

        // Pentatonic sparkly notes
        const pitches = [1046.50, 1174.66, 1318.51, 1567.98, 1760.00]; // C6, D6, E6, G6, A6
        const selectedPitch = pitches[Math.floor(Math.random() * pitches.length)];

        synth.type = 'sine';
        synth.frequency.setValueAtTime(selectedPitch, now);

        synthGain.gain.setValueAtTime(0, now);
        synthGain.gain.linearRampToValueAtTime(0.12, now + 0.02);
        synthGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.5);

        // Echoplex module
        delay.delayTime.setValueAtTime(0.35, now);
        delayGain.gain.setValueAtTime(0.40, now);

        synth.connect(synthGain);
        synthGain.connect(crystalGainNode);

        // Feedback loop
        synthGain.connect(delay);
        delay.connect(delayGain);
        delayGain.connect(delay);
        delayGain.connect(crystalGainNode);

        synth.start(now);
        synth.stop(now + 2.0);

        crystalTimerRef.current = setTimeout(shootCrystalChime, 6000 + Math.random() * 5000);
      };
      
      shootCrystalChime();
    }
  };

  const clearPlayingNodes = () => {
    // Stop and clean up all synth oscillators
    activeSynthOscillators.current.forEach(osc => {
      try {
        osc.stop();
        osc.disconnect();
      } catch (err) {}
    });
    activeSynthOscillators.current = [];

    // Clear loops
    if (cricketTimerRef.current) clearTimeout(cricketTimerRef.current);
    if (waveTimerRef.current) clearTimeout(waveTimerRef.current);
    if (crystalTimerRef.current) clearTimeout(crystalTimerRef.current);
  };

  const stopSoundscape = () => {
    clearPlayingNodes();

    if (masterGainRef.current && audioCtxRef.current) {
      const mainGain = masterGainRef.current;
      const ctx = audioCtxRef.current;
      try {
        mainGain.gain.setValueAtTime(mainGain.gain.value, ctx.currentTime);
        mainGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.8);
        
        setTimeout(() => {
          if (ctx && ctx.state !== 'closed') {
            ctx.close();
            audioCtxRef.current = null;
            masterGainRef.current = null;
          }
        }, 900);
      } catch (err) {
        if (ctx && ctx.state !== 'closed') {
          ctx.close();
          audioCtxRef.current = null;
          masterGainRef.current = null;
        }
      }
    } else if (audioCtxRef.current) {
      try {
        audioCtxRef.current.close();
      } catch(e){}
      audioCtxRef.current = null;
    }
    setIsPlaying(false);
  };

  const handleManualToggle = () => {
    if (isPlaying) {
      stopSoundscape();
    } else {
      startSoundscape();
    }
  };

  if (!enabled || dismissed) return null;

  return (
    <div className="fixed bottom-[82px] right-3 z-40 select-none flex flex-col items-end gap-1.5 md:bottom-[88px] md:right-4">
      {/* Dynamic Soundscape Activity & Metadata View */}
      <AnimatePresence>
        {showMetadata && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="w-72 bg-zinc-950/95 border border-zinc-800/80 rounded-xl p-3 shadow-xl backdrop-blur-lg text-[11px] leading-relaxed text-zinc-300"
          >
            <div className="flex items-center justify-between border-b border-zinc-900 pb-1.5 mb-1.5">
              <span className="font-sans font-bold tracking-tight text-white flex items-center gap-1.5">
                <Trees className="w-3.5 h-3.5 text-emerald-500" />
                {soundscapeMeta.actName}
              </span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono capitalize bg-zinc-900 text-zinc-400">
                Ambient Synth
              </span>
            </div>
            
            <p className="text-zinc-400 text-[10px] italic mb-2">
              "{soundscapeMeta.themeDesc}"
            </p>

            <div className="grid grid-cols-2 gap-1.5 pt-1.5 border-t border-zinc-900 text-[9px] font-mono text-zinc-500">
              <div>
                Progress: <span className="text-zinc-300">{completedChallengesCount}/35</span>
              </div>
              <div>
                Status: <span className={isPlaying ? "text-emerald-400 animate-pulse" : "text-zinc-400"}>
                  {isPlaying ? "Active" : "Paused"}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeTab === 'checkin' && (
          <div className="flex items-center gap-1.5">
            {/* Info Toggle Button */}
            <motion.button
              type="button"
              onClick={() => setShowMetadata(!showMetadata)}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className={`p-2 rounded-full border shadow-md backdrop-blur-md transition-all duration-200 cursor-pointer ${
                showMetadata
                  ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                  : 'bg-zinc-900/80 border-zinc-800/50 text-zinc-400 hover:text-zinc-300'
              }`}
              title="Show soundscape details"
            >
              <Info className="w-3.5 h-3.5" />
            </motion.button>

            {/* Main Play/Pause Button */}
            <motion.button
              type="button"
              onClick={handleManualToggle}
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              className={`flex items-center gap-2 px-3 py-2 rounded-full border text-[10px] font-black tracking-wider uppercase backdrop-blur-lg shadow-lg active:scale-95 transition-all duration-300 cursor-pointer ${
                isPlaying
                  ? 'bg-emerald-950/85 border-emerald-500/40 text-emerald-300'
                  : 'bg-slate-900/90 border-zinc-700/50 text-zinc-400'
              }`}
            >
              {isPlaying ? (
                <>
                  <Trees className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  <span className="flex items-center gap-1.5">
                    Synth On
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  </span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Paused</span>
                </>
              )}
            </motion.button>

            {/* Dismiss button — large tap target for mobile */}
            <motion.button
              type="button"
              onClick={() => { stopSoundscape(); setDismissed(true); }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="w-8 h-8 rounded-full flex items-center justify-center border bg-zinc-900/80 border-zinc-800/50 text-zinc-400 active:scale-90 transition-all cursor-pointer"
              title="Dismiss ambience player"
            >
              <X className="w-3.5 h-3.5" />
            </motion.button>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
