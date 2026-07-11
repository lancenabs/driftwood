import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, Pause, Eye, Volume2, ShieldAlert, Sparkles, Sliders, Info, Check, RefreshCw
} from 'lucide-react';

export default function EmdrSimulator() {
  // Simulator state configurations
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(4); // speed scale 1 (slow) to 8 (fast)
  const [orbSize, setOrbSize] = useState<number>(24); // px
  const [trackStyle, setTrackStyle] = useState<'standard' | 'ripples' | 'breath_line'>('standard');
  const [audioClicksActive, setAudioClicksActive] = useState<boolean>(true);

  // CBT desensitization target thought
  const [targetThought, setTargetThought] = useState<string>('I am helpless under heavy deadlines.');
  const [userCustomThought, setUserCustomThought] = useState<string>('');

  // Assessment: Subjective Units of Distress (SUDs) score tracker
  const [sudsBefore, setSudsBefore] = useState<number>(7);
  const [sudsAfter, setSudsAfter] = useState<number>(3);
  const [sudsLogged, setSudsLogged] = useState<boolean>(false);
  const [savingTelemetry, setSavingTelemetry] = useState<boolean>(false);

  // Position coordinates state for the orb
  const [orbX, setOrbX] = useState<number>(50); // percentage (10 to 90)
  const directionRef = useRef<number>(1); // 1 = right, -1 = left

  // 1. Web Audio API binaural panner sound clicks
  const playStereoClick = (direction: 'left' | 'right') => {
    if (!audioClicksActive) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const panner = audioCtx.createStereoPanner ? audioCtx.createStereoPanner() : null;

      if (panner) {
        osc.connect(gain);
        gain.connect(panner);
        panner.connect(audioCtx.destination);
        // Pan: -1 completely left, 1 completely right
        panner.pan.setValueAtTime(direction === 'left' ? -0.85 : 0.85, audioCtx.currentTime);
      } else {
        osc.connect(gain);
        gain.connect(audioCtx.destination);
      }

      osc.type = 'triangle';
      // Low diagnostic percussion click tone
      osc.frequency.setValueAtTime(260, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.12);
    } catch (e) {
      console.log('Web Audio blocked or unsupported', e);
    }
  };

  // 2. Continuous Animation Interval mapping to horizontal sliding limits
  useEffect(() => {
    if (!isPlaying) return;

    // Tick interval based on selected speed
    const baseIntervalMs = 12; // 60fps equivalent
    const delta = (speed * 0.44); // velocity offset percentage per tick

    const interval = setInterval(() => {
      setOrbX((prevX) => {
        let nextX = prevX + directionRef.current * delta;

        // Boundaries checks: left limit at 10%, right limit at 90%
        if (nextX >= 90) {
          nextX = 90;
          directionRef.current = -1; // change dir left
          playStereoClick('right');
        } else if (nextX <= 10) {
          nextX = 10;
          directionRef.current = 1; // change dir right
          playStereoClick('left');
        }

        return nextX;
      });
    }, baseIntervalMs);

    return () => clearInterval(interval);
  }, [isPlaying, speed, audioClicksActive]);

  // Handle saving clinical desensitization logs
  const handleSaveSudsLog = () => {
    setSavingTelemetry(true);
    setTimeout(() => {
      setSavingTelemetry(false);
      setSudsLogged(true);

      const existingLogs = JSON.parse(localStorage.getItem('therapy_emdr_sessions') || '[]');
      const newSession = {
        id: String(Date.now()),
        date: new Date().toISOString().split('T')[0],
        targetThought: targetThought,
        sudsBefore: sudsBefore,
        sudsAfter: sudsAfter,
        delta: sudsBefore - sudsAfter
      };
      existingLogs.unshift(newSession);
      localStorage.setItem('therapy_emdr_sessions', JSON.stringify(existingLogs));
    }, 900);
  };

  return (
    <div
      id="emdr-bilateral-stimulator-card"
      className="bg-white border border-[#F0F0F0] rounded-3xl p-5 md:p-6 space-y-6 text-left"
      style={{ boxShadow: '0 3px 14px rgba(0,0,0,0.05)' }}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-[#0d9488] font-mono">
            <Eye className="w-4 h-4 text-[#0d9488]" />
            <span>Eye Movement Guide</span>
          </div>
          <h3 className="font-display text-base font-bold text-[#3C3C3C] tracking-tight">
            Interactive EMDR Bilateral Simulator
          </h3>
          <p className="text-[11.5px] text-[#6B7280] font-medium leading-relaxed">
            Eye Movement Desensitization and Reprocessing (EMDR) uses lateral visual and audio cycles to downregulate traumatic emotional records. Look centered, track only the glowing turquoise orb horizontally with your eyes, and notice target automatic thoughts dissolve.
          </p>
        </div>

        <span className="bg-slate-100 px-3 py-1 text-[10px] font-bold font-mono rounded-lg border border-slate-200 uppercase tracking-widest text-[#6B7280]">
          Guided Practice
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* LEFT COLUMN: THE DISTRACTION-FREE BLACK SCREEN CABINET (lg:span-7) */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-3">
          <div className="bg-[#0b0f14] border border-slate-900 rounded-2xl relative overflow-hidden h-[280px] p-4 flex flex-col justify-between items-stretch">
            
            {/* Top thought focal card */}
            <div className="text-center space-y-1.5 z-10 p-2 bg-black/40 backdrop-blur-xs rounded-xl border border-white/[0.04] max-w-[85%] mx-auto">
              <span className="text-[10px] text-teal-400 font-extrabold tracking-widest uppercase block">DESENSITIZATION COGNITIVE TARGET:</span>
              <p className="text-xs text-white leading-normal font-bold italic">
                "{targetThought}"
              </p>
            </div>

            {/* Radial background glow representation */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="w-56 h-56 bg-teal-500/5 rounded-full blur-3xl" />
            </div>

            {/* Center horizontal tracking guide track bar elements */}
            <div className="relative w-full h-8 flex items-center">
              {/* Lateral Guideline */}
              <div className="absolute left-[10%] right-[10%] h-[1.8px] bg-white/10 rounded" />

              {/* Expansion ripples layout background if active */}
              {trackStyle === 'ripples' && isPlaying && (
                <div className="absolute left-[10%] right-[10%] h-8 overflow-hidden pointer-events-none">
                  {/* Glowing dynamic background grid waves */}
                  <div className="w-full h-full bg-linear-to-r from-teal-500/2 to-indigo-500/2 opacity-60 flex justify-around items-center">
                    <span className="w-1 h-3 bg-teal-500/20 rounded animate-ping duration-1000" />
                    <span className="w-1 h-3 bg-teal-500/20 rounded animate-ping duration-700" />
                    <span className="w-1 h-3 bg-teal-500/20 rounded animate-ping duration-900" />
                  </div>
                </div>
              )}

              {/* Glowing turquoise tracking sphere */}
              <div 
                className="absolute transform -translate-x-1/2 rounded-full bg-linear-to-br from-cyan-400 to-teal-500 shadow-[0_0_15px_rgba(34,211,238,0.7)] flex items-center justify-center transition-all duration-75"
                style={{ 
                  left: `${orbX}%`, 
                  width: `${orbSize}px`, 
                  height: `${orbSize}px` 
                }}
              >
                {/* Simulated specular highlights inside orb */}
                <div className="w-2.5 h-2.5 rounded-full bg-white/40 absolute top-1 left-1.5" />
              </div>
            </div>

            {/* Bottom minimal play tools */}
            <div className="flex items-center justify-center gap-3 z-10">
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className={`px-5 py-3 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer select-none min-h-[40px] ${
                  isPlaying
                    ? 'bg-rose-600 text-white hover:bg-rose-700 shadow-md'
                    : 'bg-teal-500 text-[#0c1319] hover:bg-teal-400 shadow-teal-500/20 shadow-md'
                }`}
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5 fill-current" />
                    <span>Pause Eye Tracking</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Start Bilateral Guide</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="text-[11px] italic text-slate-400 leading-normal font-semibold bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-start gap-2">
            <Info className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
            <p>
              Tips: Secure your chin completely in place. Track the blue orb exclusively with your eyes sliding side-to-side. Audio clicks shift between ears (use headphones for full bilateral brain integration).
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: CALIBRATION WORKSPACE & SUDS LABELS (lg:span-5) */}
        <div className="lg:col-span-5 bg-slate-50/80 border border-slate-100 p-4.5 rounded-2xl flex flex-col justify-between space-y-4">
          
          {/* Section A: Simulator Controls */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Sliders className="w-3.5 h-3.5 text-slate-500" />
              <span>Simulator Parameters</span>
            </h4>

            {/* Slider 1: Speed */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-700 font-bold">
                <span>⚡ Orb Sweep Velocity:</span>
                <span className="font-mono font-black text-[#0d9488]">Level {speed}</span>
              </div>
              <input
                type="range"
                min="1"
                max="8"
                value={speed}
                onChange={(e) => setSpeed(parseInt(e.target.value, 10))}
                className="w-full accent-[#0d9488] bg-slate-200 h-1 rounded-full appearance-none cursor-pointer"
              />
            </div>

            {/* Slider 2: Size */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-700 font-bold">
                <span>⭕ Tracking Orb Size:</span>
                <span className="font-mono font-black text-[#0d9488]">{orbSize}px</span>
              </div>
              <input
                type="range"
                min="14"
                max="36"
                value={orbSize}
                onChange={(e) => setOrbSize(parseInt(e.target.value, 10))}
                className="w-full accent-[#0d9488] bg-slate-200 h-1 rounded-full appearance-none cursor-pointer"
              />
            </div>

            {/* Radio 3: Track Layout shape */}
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-black text-slate-500 block">Optic Field Waveform</span>
              <div className="grid grid-cols-3 gap-1.5 bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-[10px] font-bold">
                <button
                  type="button"
                  onClick={() => setTrackStyle('standard')}
                  className={`py-2 rounded cursor-pointer min-h-[36px] ${trackStyle === 'standard' ? 'bg-white text-slate-900 border border-slate-200 shadow-sm font-extrabold' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  Line Flat
                </button>
                <button
                  type="button"
                  onClick={() => setTrackStyle('ripples')}
                  className={`py-2 rounded cursor-pointer min-h-[36px] ${trackStyle === 'ripples' ? 'bg-white text-slate-900 border border-slate-200 shadow-sm font-extrabold' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  Ripples map
                </button>
                <button
                  type="button"
                  onClick={() => setTrackStyle('breath_line')}
                  className={`py-2 rounded cursor-pointer min-h-[36px] ${trackStyle === 'breath_line' ? 'bg-white text-slate-900 border border-slate-200 shadow-sm font-extrabold' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  Depth Halo
                </button>
              </div>
            </div>

            {/* Audio Toggle button */}
            <button
              type="button"
              onClick={() => setAudioClicksActive(!audioClicksActive)}
              className={`w-full py-2 border rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer select-none ${
                audioClicksActive 
                  ? 'bg-teal-50 border-teal-200 text-teal-800' 
                  : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50'
              }`}
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Stereo Sound Clicks: {audioClicksActive ? 'Enabled L/R' : 'Muted'}</span>
            </button>
          </div>

          {/* Section B: Distress SUDs Assessment Worksheets */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-3.5 shadow-sm">
            <h5 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block">Subjective Distress Monitor (SUDs)</h5>

            {/* Custom target thought input fields */}
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-extrabold text-slate-400 block">Current Distress Thought</span>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={userCustomThought}
                  onChange={(e) => setUserCustomThought(e.target.value)}
                  placeholder="Change core thought..."
                  className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none min-h-[36px]"
                />
                <button
                  type="button"
                  disabled={!userCustomThought.trim()}
                  onClick={() => {
                    setTargetThought(userCustomThought.trim());
                    setUserCustomThought('');
                  }}
                  className="btn-duo btn-duo-teal text-xs px-3 py-1.5 shrink-0"
                >
                  Apply
                </button>
              </div>
            </div>

            {/* Distress Levels comparative sliders */}
            <div className="grid grid-cols-2 gap-3.5 pt-1">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">SUDs Before (1-10)</span>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={sudsBefore}
                    onChange={(e) => setSudsBefore(parseInt(e.target.value, 10))}
                    className="flex-1 accent-indigo-500 cursor-pointer h-6"
                  />
                  <span className="text-xs font-black text-slate-700 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded">{sudsBefore}</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">SUDs After (1-10)</span>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={sudsAfter}
                    onChange={(e) => setSudsAfter(parseInt(e.target.value, 10))}
                    className="flex-1 accent-emerald-500 cursor-pointer h-6"
                  />
                  <span className="text-xs font-black text-slate-700 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded">{sudsAfter}</span>
                </div>
              </div>
            </div>

            {/* Submission triggers */}
            <div className="pt-1.5 border-t border-slate-100">
              {sudsLogged ? (
                <div className="p-2 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-200 text-[11px] font-semibold leading-relaxed flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>EMDR telemetry archived! Distress reduced by {sudsBefore - sudsAfter} points.</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleSaveSudsLog}
                  className="btn-duo btn-duo-green w-full text-xs py-2.5 flex items-center justify-center gap-1.5"
                >
                  {savingTelemetry ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <span>Archive Distress Log</span>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
