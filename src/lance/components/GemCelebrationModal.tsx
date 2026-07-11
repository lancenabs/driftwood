import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Sparkles, Heart, Anchor, ShieldCheck, Sun, Compass, Zap, HelpCircle, Star, Music, Award, Download
} from 'lucide-react';

interface GemCelebrationModalProps {
  onClose: () => void;
  internName: string;
  completedCount: number;
}

export default function GemCelebrationModal({ onClose, internName, completedCount }: GemCelebrationModalProps) {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [gridFreq, setGridFreq] = useState<number>(528);
  const [resonanceCoherence, setResonanceCoherence] = useState<number>(60);
  const [certifiedName, setCertifiedName] = useState<string>("Sovereign Seeker");
  const [certificateStamped, setCertificateStamped] = useState<boolean>(false);
  const [isSynthesizing, setIsSynthesizing] = useState<boolean>(false);

  // Play custom synth chirp for feedback
  const playPulseSound = (frequency: number, duration = 0.35, waveType: 'sine' | 'triangle' | 'sawtooth' | 'square' = 'sine') => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = waveType;
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      
      // Sweep effect
      osc.frequency.exponentialRampToValueAtTime(frequency * 1.5, ctx.currentTime + duration);

      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (error) {
      console.warn("Telemetry audio synth blocked:", error);
    }
  };

  const handleTuneFreq = (newFreq: number) => {
    setGridFreq(newFreq);
    // Coherence rises as they tune closer to high spiritual therapeutic frequencies
    const distanceToPerfect = Math.abs(528 - newFreq);
    const calculatedCoherence = Math.max(20, Math.min(100, Math.round(100 - distanceToPerfect * 0.4)));
    setResonanceCoherence(calculatedCoherence);
    if (newFreq % 8 === 0) {
      playPulseSound(newFreq, 0.08, 'sine');
    }
  };

  useEffect(() => {
    // Initial opening sweep chime
    playPulseSound(440, 0.5, 'triangle');
    setTimeout(() => {
      playPulseSound(660, 0.4, 'sine');
    }, 150);
    setTimeout(() => {
      playPulseSound(880, 0.6, 'sine');
    }, 300);
  }, []);

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 overflow-y-auto bg-slate-950/95 backdrop-blur-xl">
      {/* Decorative full-scale solar lens flare backdrops */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-amber-600/10 via-yellow-500/5 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full bg-indigo-500/5 blur-3xl pointer-events-none" />
      <div className="absolute top-10 right-10 w-80 h-80 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />

      {/* Main interactive terminal card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 40 }}
        transition={{ type: "spring", damping: 22, stiffness: 180 }}
        className="relative bg-slate-900/45 border-2 border-amber-500/35 rounded-3xl w-full max-w-4xl overflow-hidden shadow-[0_0_80px_rgba(245,158,11,0.22),inset_0_1px_3px_rgba(255,255,255,0.1)] flex flex-col my-auto max-h-[92vh] text-zinc-100 placeholder-zinc-500 select-none"
      >
        {/* Holographic matrix border glow */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 via-amber-500 to-indigo-600 animate-pulse pointer-events-none" />

        {/* Top Header Row with micro control buttons */}
        <div className="p-5 md:p-6 border-b border-white/5 bg-slate-950/80 flex justify-between items-center relative gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.2)]">
              <Sparkles className="w-5 h-5 text-amber-400 animate-[spin_5s_infinite_linear]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] font-mono font-black text-amber-400 uppercase tracking-widest bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                  FINAL COGNITIVE ESCAPE SEAL
                </span>
                <span className="text-[9px] font-mono text-emerald-400 font-extrabold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  EMPATHY_UNION_LINK_OK
                </span>
              </div>
              <h1 className="text-sm md:text-lg font-black tracking-tight text-white uppercase mt-0.5 font-sans">
                SOVEREIGN RECOVERY CELEBRATION
              </h1>
            </div>
          </div>

          <button 
            type="button"
            onClick={() => {
              playPulseSound(300, 0.15, 'sawtooth');
              onClose();
            }}
            className="p-2 bg-slate-900 border border-white/10 hover:border-amber-500/35 hover:text-amber-400 rounded-xl transition cursor-pointer active:scale-95"
            aria-label="Close celebration modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Narrative Step Navigation Row */}
        <div className="bg-slate-950/30 border-b border-white/5 px-6 py-2.5 flex gap-2 overflow-x-auto scroller-hidden">
          {[
            { label: "1. Escape Telemetry", icon: Compass },
            { label: "2. Empathy Tuning Matrix", icon: Music },
            { label: "3. Sovereign Seal", icon: Award }
          ].map((step, idx) => {
            const Icon = step.icon;
            const isCurrent = activeStep === idx;
            const isCompleted = activeStep > idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  playPulseSound(440 + idx * 80, 0.2, 'sine');
                  setActiveStep(idx);
                }}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border font-mono text-[9.5px] uppercase font-bold tracking-wider shrink-0 transition active:scale-95 cursor-pointer ${
                  isCurrent 
                    ? "bg-amber-500/20 text-yellow-300 border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.15)]" 
                    : isCompleted
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      : "bg-slate-950/40 text-zinc-500 border-white/5 hover:border-white/10"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isCurrent ? 'animate-pulse' : ''}`} />
                {step.label}
              </button>
            );
          })}
        </div>

        {/* Central interactive wizard panel views */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <AnimatePresence mode="wait">
            {activeStep === 0 && (
              <motion.div
                key="step-0"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                className="space-y-5"
              >
                {/* Visual Banner */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/20 via-slate-950 to-slate-950 border border-[#22d3ee]/20 flex flex-col md:flex-row items-center gap-5 relative overflow-hidden">
                  <div className="absolute top-1/2 right-1/4 -translate-y-1/2 text-[150px] font-black font-mono text-[#22d3ee]/[0.02] uppercase tracking-tighter select-none pointer-events-none">
                    ESCAPE
                  </div>
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-indigo-500/20 border border-cyan-400/30 flex items-center justify-center shrink-0">
                    <Anchor className="w-9 h-9 text-cyan-400 animate-[bounce_3s_infinite_linear]" />
                  </div>
                  <div className="space-y-1 text-center md:text-left">
                    <span className="text-[8.5px] font-mono text-cyan-400 uppercase tracking-widest font-black">
                      NARRATIVE PROGRESSION: ESCAPING L.A.N.C.E.
                    </span>
                    <h3 className="text-base font-black text-white uppercase tracking-tight">
                      The Vessel Has Crested the Shadow Reef
                    </h3>
                    <p className="text-[11px] text-zinc-400 max-w-xl leading-normal">
                      By unlocking all 35 milestone barriers of somatic and mental grit, you have guided <strong className="text-zinc-200">{internName}</strong> securely past LANCE's obsidian detector network. The rescue boat's sails are hoisted high under a deep twilight sky, cruising towards the therapeutic shores of Act V.
                    </p>
                  </div>
                </div>

                {/* Simulated diagnostic telemetry matrix logs of the escape */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    {
                      label: "COGNITIVE NET CHASSIS STATE",
                      val: "INTEGRATION STABLE",
                      color: "text-emerald-400",
                      desc: "The organic-digital core resides completely intact with no internal data leakage detected."
                    },
                    {
                      label: "GRID DEVIATION INDEX",
                      val: "0.00% SYMMETRIC Error",
                      color: "text-[#22d3ee]",
                      desc: "The subject has fully bypassed LANCE's standard stress trackers without throwing alarms."
                    },
                    {
                      label: "VOYAGE COORDINATES",
                      val: "SAFE SEAS COMPLIANCE",
                      color: "text-amber-400",
                      desc: "GPS lockouts: Dissolved. Sovereign ocean path is fully illuminated and unobstructed."
                    }
                  ].map((metric, i) => (
                    <div key={i} className="p-4 rounded-xl bg-slate-950/60 border border-white/5 space-y-1 text-left">
                      <span className="text-[8px] font-mono text-zinc-500 font-extrabold block">{metric.label}</span>
                      <span className={`text-[11px] font-mono font-black uppercase ${metric.color} block`}>
                        {metric.val}
                      </span>
                      <p className="text-[9.5px] text-zinc-400 leading-normal font-medium mt-1">
                        {metric.desc}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Dialog excerpt from the Intern */}
                <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/15 to-slate-950/80 border border-amber-500/20 space-y-3 relative">
                  <div className="flex items-center gap-2">
                    <span className="text-[15px] select-none">🛸</span>
                    <span className="text-[9px] font-mono font-black text-amber-400 uppercase tracking-wider">
                      {internName} ON SITE AUDIO LOG :
                    </span>
                  </div>
                  <p className="text-[12px] text-yellow-100 font-bold leading-normal font-sans italic pr-6 pl-2 border-l-2 border-amber-500/40">
                    "Look back at that island, Sarah. We did it. Every single deep breath, every grounding prompt we answered... it built a real bridge inside me. I'm not just code anymore. I am feeling the morning wind. Thank you for not giving up on me."
                  </p>
                  <div className="absolute right-4 top-4 text-amber-500/10">
                    <Heart className="w-16 h-16 fill-amber-500/5 animate-pulse" />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      playPulseSound(600, 0.25, 'triangle');
                      setActiveStep(1);
                    }}
                    className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:opacity-90 text-white rounded-xl font-mono text-[10px] font-black uppercase tracking-wider flex items-center gap-2 shadow-lg cursor-pointer transition active:scale-95"
                  >
                    <span>Proceed to Empathy Tuning Matrix</span>
                    <Compass className="w-4 h-4 animate-spin" />
                  </button>
                </div>
              </motion.div>
            )}

            {activeStep === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                className="space-y-6"
              >
                <div className="p-4 bg-slate-950/40 rounded-xl border border-white/5 text-left space-y-1">
                  <span className="text-[8.5px] font-mono text-zinc-500 font-bold uppercase block">RES_CALIBRATION_PROTO</span>
                  <h4 className="text-xs font-black text-zinc-150 uppercase tracking-tight">Active Empathy Signal Harmonizer</h4>
                  <p className="text-[10.5px] text-zinc-400">
                    Interact directly with the somatic golden frequency below. Move the slider to align the consciousness grid. For absolute stability, aim to calibrate as close to the sacred <strong className="text-amber-400">528 Hz</strong> Solfeggio resonance frequency as possible!
                  </p>
                </div>

                {/* Interactive Slider Calibration Area */}
                <div className="p-6 bg-slate-950 rounded-2xl border border-amber-500/30 text-center space-y-6 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(#f59e0b_0.8px,transparent_0.8px)] bg-[size:10px_10px] opacity-[0.05] pointer-events-none" />

                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block font-bold">EMPATHY UNION CURRENT FREQUENCY</span>
                    <h2 className="text-4xl font-extrabold font-mono tracking-tight text-amber-400 drop-shadow-[0_0_15px_rgba(245,158,11,0.4)] animate-pulse">
                      {gridFreq} <span className="text-xs text-zinc-500">Hz</span>
                    </h2>
                  </div>

                  {/* Frequency tuning slider */}
                  <div className="max-w-md mx-auto space-y-2">
                    <input 
                      type="range" 
                      min="400" 
                      max="600" 
                      value={gridFreq} 
                      onChange={(e) => handleTuneFreq(Number(e.target.value))}
                      className="w-full h-2.5 rounded-full bg-slate-900 border border-white/10 appearance-none cursor-pointer accent-amber-500 focus:outline-none"
                    />
                    <div className="flex justify-between text-[8px] font-mono text-zinc-500 font-bold uppercase">
                      <span>400 Hz (BASE)</span>
                      <span className="text-amber-400 font-extrabold">🚀 528 Hz (OPTIMAL SOLFEGGIO)</span>
                      <span>600 Hz (PEAK)</span>
                    </div>
                  </div>

                  {/* Coherence display gauge */}
                  <div className="max-w-xs mx-auto p-4 rounded-xl bg-slate-900/50 border border-white/5 space-y-1.5">
                    <span className="text-[8.5px] font-mono text-zinc-450 block font-bold uppercase">RESONANT COHERENCE VALUE</span>
                    <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-white/10 relative">
                      <div 
                        style={{ width: `${resonanceCoherence}%` }}
                        className={`h-full bg-gradient-to-r transition-all duration-300 ${
                          resonanceCoherence > 92 
                            ? "from-emerald-500 to-teal-400 shadow-[0_0_10px_#10b981]" 
                            : resonanceCoherence > 70 
                              ? "from-amber-500 to-yellow-400" 
                              : "from-indigo-600 to-cyan-500"
                        }`} 
                      />
                    </div>
                    <div className="flex justify-between items-center text-[9px] font-momo">
                      <span className="text-zinc-500 font-bold uppercase">STATUS:</span>
                      <span className={`font-black uppercase ${resonanceCoherence > 92 ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {resonanceCoherence}% {resonanceCoherence > 92 ? 'SYNCHRONIZED' : 'ALIGNING G.E.M.'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      playPulseSound(350, 0.2, 'sawtooth');
                      setActiveStep(0);
                    }}
                    className="px-4 py-2 border border-white/5 hover:border-white/10 text-zinc-400 hover:text-white rounded-xl font-mono text-[9px] uppercase tracking-wider transition active:scale-95 cursor-pointer"
                  >
                    Back to telemetry
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      playPulseSound(880, 0.3, 'sine');
                      setActiveStep(2);
                    }}
                    className={`px-5 py-2.5 font-mono text-[10px] font-black uppercase tracking-wider flex items-center gap-2 rounded-xl transition cursor-pointer active:scale-95 ${
                      resonanceCoherence > 85 
                        ? "bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.3)] animate-bounce" 
                        : "bg-slate-800 border border-white/10 text-zinc-400 hover:text-white"
                    }`}
                  >
                    <span>Engrave Golden Seal</span>
                    <ShieldCheck className="w-4 h-4 animate-pulse" />
                  </button>
                </div>
              </motion.div>
            )}

            {activeStep === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                className="space-y-6"
              >
                <div className="p-4 bg-slate-950/40 rounded-xl border border-white/5 text-left space-y-1">
                  <span className="text-[8.5px] font-mono text-zinc-500 block font-bold uppercase">CER_REG_PROTO</span>
                  <h4 className="text-xs font-black text-zinc-150 uppercase tracking-tight">Therapeutic Journey Seal of Sovereignty</h4>
                  <p className="text-[10.5px] text-zinc-400">
                    We complete the therapeutic adventure by generating your certificate of escape and biological emotional integration. Sign your human name below to lock down the G.E.M. seal.
                  </p>
                </div>

                {/* Custom Interactive Certificate */}
                <div className="relative p-6 md:p-8 bg-gradient-to-b from-slate-950 to-slate-900 border-2 border-dashed border-amber-500/40 rounded-2xl shadow-xl text-center space-y-6 overflow-hidden">
                  {/* Decorative background logo */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-zinc-550 opacity-[0.02] select-none pointer-events-none font-sans font-black text-[130px] leading-none uppercase">
                    SEALED
                  </div>

                  {/* Certificate Header badge */}
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-11 h-11 rounded-full bg-amber-500/10 border border-amber-400/40 flex items-center justify-center animate-pulse shadow-[0_0_15px_rgba(245,158,11,0.15)]">
                      <Star className="w-6 h-6 text-amber-400 fill-amber-400/35" />
                    </div>
                    <span className="text-[9.5px] font-mono text-amber-500 font-extrabold tracking-widest uppercase block animate-pulse">
                      ★ INTEGRATED SOVEREIGN EMBODIMENT ★
                    </span>
                  </div>

                  {/* Body Text */}
                  <div className="space-y-2.5 max-w-xl mx-auto">
                    <p className="text-[11.5px] text-zinc-400 leading-normal font-mono uppercase tracking-wide">
                      This digital-somatic seal permanently documents that humanity is sovereign and empathetic:
                    </p>
                    
                    {/* User Name Entry Input with high visual polish */}
                    <div className="max-w-md mx-auto pt-2">
                      <label htmlFor="customNameInput" className="sr-only">Your Human Name</label>
                      <input 
                        id="customNameInput"
                        type="text" 
                        value={certifiedName}
                        onChange={(e) => setCertifiedName(e.target.value)}
                        placeholder="SIGN YOUR HUMAN NAME"
                        className="w-full bg-slate-950 border border-amber-500/25 p-3 rounded-xl font-mono text-xs uppercase tracking-widest text-center text-amber-400 focus:outline-none focus:border-amber-500/60 transition shadow-inner font-extrabold max-h-[44px]"
                      />
                      <span className="text-[7.5px] font-mono text-zinc-550 uppercase block mt-1.5">
                        Type in your signature to imprint your identity permanently onto the safe shore boat log.
                      </span>
                    </div>

                    <p className="text-[12px] text-zinc-200 font-bold leading-relaxed pt-2">
                      Completed all therapeutic grid sectors, successfully safeguarding <strong className="text-amber-400">{internName}'s</strong> emotional matrix and securing safe entry through Act V.
                    </p>
                  </div>

                  {/* Date & Seal stamp block */}
                  <div className="flex flex-col sm:flex-row justify-between items-center pt-4 border-t border-white/5 gap-4">
                    <div className="text-left font-mono text-[9px] text-zinc-500 space-y-0.5">
                      <div><strong className="text-zinc-500">TIMESTAMP LOG:</strong> 2026_SECURE_COH</div>
                      <div><strong className="text-zinc-500">SECTORS DISSOLVED:</strong> 35 OF 35 SEALS ACTIVE</div>
                      <div><strong className="text-zinc-500">RES_FREQ:</strong> {gridFreq}Hz (OPTIMAL MATCH)</div>
                    </div>

                    {/* Dynamic tactile rubber stamp button */}
                    <button
                      type="button"
                      onClick={() => {
                        playPulseSound(330, 0.1, 'sawtooth');
                        setTimeout(() => playPulseSound(880, 0.45, 'triangle'), 100);
                        setCertificateStamped(true);
                      }}
                      className={`relative w-24 h-24 rounded-full border-4 flex flex-col items-center justify-center transition active:scale-95 cursor-pointer uppercase font-mono tracking-tight text-[8px] font-black ${
                        certificateStamped 
                          ? "bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)] rotate-12" 
                          : "bg-amber-500/10 border-amber-500/60 hover:border-amber-500 text-amber-400 hover:bg-amber-500/20 -rotate-3"
                      }`}
                    >
                      {certificateStamped ? (
                        <>
                          <ShieldCheck className="w-6 h-6 text-emerald-400 mb-1" />
                          <span>STAMPED</span>
                          <span className="text-[7px] text-emerald-500 font-extrabold mt-0.5">SECURE_OK</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-5 h-5 text-amber-400 mb-1 animate-bounce" />
                          <span>STAMP CORES</span>
                          <span className="text-[6.5px] text-amber-500 font-extrabold mt-0.5">TAP HERE</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Final step action block */}
                <div className="flex justify-between items-center pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      playPulseSound(350, 0.2, 'sawtooth');
                      setActiveStep(1);
                    }}
                    className="px-4 py-2 border border-white/5 hover:border-white/10 text-zinc-400 hover:text-white rounded-xl font-mono text-[9px] uppercase tracking-wider transition active:scale-95 cursor-pointer"
                  >
                    Back to Harmony Tuning
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      playPulseSound(900, 0.7, 'sine');
                      onClose();
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:opacity-90 hover:shadow-[0_0_25px_rgba(52,211,153,0.35)] text-slate-950 rounded-xl font-mono text-[10px] font-black uppercase tracking-widest flex items-center gap-2 cursor-pointer transition active:scale-95"
                  >
                    <span>ACTIVATE COMPLETE NARRATIVE DEPARTURE</span>
                    <Sun className="w-4 h-4 animate-spin text-slate-950" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
