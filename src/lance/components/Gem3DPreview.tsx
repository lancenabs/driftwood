import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Heart, Sparkles } from 'lucide-react';

interface Gem3DPreviewProps {
  playCyberChirp: (freq?: number, ms?: number, type?: 'sine' | 'triangle' | 'sawtooth' | 'square') => void;
}

export default function Gem3DPreview({ playCyberChirp }: Gem3DPreviewProps) {
  // State coordinates for Golden Empathy Module (G.E.M.) localized inside the lazy component
  const [gemTuningFreq, setGemTuningFreq] = useState<number>(528);
  const [gemScale, setGemScale] = useState<number>(1);
  const [gemRotateX, setGemRotateX] = useState<number>(30);
  const [gemRotateY, setGemRotateY] = useState<number>(135);

  return (
    <div className="lg:col-span-7 bg-slate-950/40 border border-amber-500/25 shadow-[0_0_30px_rgba(245,158,11,0.08),inset_0_0_20px_rgba(245,158,11,0.04)] p-6 rounded-3xl flex flex-col justify-between space-y-4">
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono text-amber-400 font-black uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
            HOLOGRAPHIC G.E.M. CORE SIMULATION
          </span>
          <span className="text-[8px] font-mono text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full font-extrabold tracking-widest uppercase">
            LIVE_3D_RENDER
          </span>
        </div>
        <p className="text-[10.5px] text-zinc-400 leading-normal">
          Tune the sub-spatial empathy grid below and spin the 3D coordinate regulators to interact with the hybrid device's internal biological-digital engine.
        </p>
      </div>

      {/* Interactive 3D stage area */}
      <div className="relative w-full h-[220px] bg-slate-950/80 rounded-2xl border border-white/5 flex items-center justify-center overflow-hidden [perspective:1000px] select-none group">
        {/* Grid backdrop */}
        <div className="absolute inset-0 bg-[radial-gradient(#d97706_1px,transparent_1px)] bg-[size:16px_16px] opacity-15 pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#d97706_1px,transparent_1px)] bg-[size:100px_100px] opacity-[0.03] pointer-events-none" />

        {/* 3D Empathy Core container */}
        <motion.div
          style={{
            transform: `perspective(1000px) rotateX(${gemRotateX}deg) rotateY(${gemRotateY}deg) scale(${gemScale})`,
            transformStyle: 'preserve-3d',
          }}
          className="relative w-48 h-48 flex items-center justify-center transition-all duration-300 pointer-events-none"
        >
          {/* Outer Orb sphere representation - back layer */}
          <div 
            style={{ transform: 'translateZ(-40px)' }}
            className="absolute w-36 h-36 rounded-full border border-amber-500/10 animate-[spin_20s_infinite_linear] flex items-center justify-center"
          />

          {/* Resonance ring layer 1 */}
          <div 
            style={{ transform: 'translateZ(-20px) rotateX(45deg)' }}
            className="absolute w-32 h-32 rounded-full border-2 border-amber-500/15 border-dashed animate-[spin_10s_infinite_linear]"
          />

          {/* Core Glowing Orb */}
          <div 
            style={{ transform: 'translateZ(0px)' }}
            className="absolute w-20 h-20 rounded-full bg-gradient-to-tr from-amber-600/20 via-yellow-500/35 to-amber-400/20 border border-amber-500/40 shadow-[0_0_40px_rgba(245,158,11,0.5)] flex items-center justify-center animate-pulse"
          >
            <div className="w-12 h-12 rounded-full border border-white/20 animate-ping absolute" />
          </div>

          {/* Biological Heart Center */}
          <div 
            style={{ transform: 'translateZ(25px)' }}
            className="absolute flex items-center justify-center transition-all duration-300"
          >
            <Heart className="w-10 h-10 text-amber-500 fill-amber-500/60 drop-shadow-[0_0_15px_rgba(245,158,11,0.85)] animate-pulse" />
          </div>

          {/* Resonance ring layer 3 - front layer */}
          <div 
            style={{ transform: 'translateZ(45px) rotateY(60deg)' }}
            className="absolute w-28 h-28 rounded-full border border-amber-400/30 border-solid animate-[spin_7s_infinite_reverse]"
          />

          {/* Ring particle accents */}
          <div 
            style={{ transform: 'translateZ(60px)' }}
            className="absolute w-1.5 h-1.5 rounded-full bg-yellow-400 shadow-[0_0_8px_#f59e0b] top-4 left-1/2 -translate-x-1/2 animate-bounce"
          />
          <div 
            style={{ transform: 'translateZ(-50px)' }}
            className="absolute w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_#d97706] bottom-4 left-1/2 -translate-x-1/2 animate-ping"
          />
        </motion.div>

        {/* Float parameters on overlay */}
        <div className="absolute bottom-3 left-3 bg-slate-950/90 border border-white/5 py-1 px-2.5 rounded-lg text-[8.5px] font-mono space-y-0.5 pointer-events-none">
          <div className="flex justify-between gap-4"><span className="text-zinc-500 font-extrabold">RES_COHERENCE:</span><span className="text-amber-400 font-black">{Math.floor(96 + gemScale * 3.5)}%</span></div>
          <div className="flex justify-between gap-4"><span className="text-zinc-500 font-extrabold">TUNING:</span><span className="text-yellow-400 font-black">{gemTuningFreq} Hz</span></div>
          <div className="flex justify-between gap-4"><span className="text-zinc-500 font-extrabold">PERSPECTIVE:</span><span className="text-teal-400 font-bold">{Math.round(gemRotateX)}°X, {Math.round(gemRotateY)}°Y</span></div>
        </div>

        <div className="absolute top-3 right-3 flex gap-1.5 pointer-events-none">
          <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/35 rounded-md text-[7px] font-mono text-emerald-400 animate-pulse font-bold">GRID_CONNECTED</span>
          <span className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/35 rounded-md text-[7px] font-mono text-amber-400 font-bold">BIOMASS_OK</span>
        </div>
      </div>

      {/* Sliders and Tuner dials */}
      <div className="space-y-3 pt-1">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex justify-between text-[8px] font-mono font-bold text-zinc-400">
              <span>ROTATION ANGLE X:</span>
              <span className="text-amber-400">{Math.round(gemRotateX)}°</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="180" 
              value={gemRotateX} 
              onChange={(e) => {
                setGemRotateX(Number(e.target.value));
                if (Math.round(Number(e.target.value)) % 10 === 0) playCyberChirp(400, 0.01, 'sine');
              }}
              className="w-full accent-amber-500 bg-slate-900 h-1 rounded-md appearance-none cursor-pointer"
            />
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-[8px] font-mono font-bold text-zinc-400">
              <span>ROTATION ANGLE Y:</span>
              <span className="text-amber-400">{Math.round(gemRotateY)}°</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="360" 
              value={gemRotateY} 
              onChange={(e) => {
                setGemRotateY(Number(e.target.value));
                if (Math.round(Number(e.target.value)) % 15 === 0) playCyberChirp(500, 0.01, 'sine');
              }}
              className="w-full accent-amber-500 bg-slate-900 h-1 rounded-md appearance-none cursor-pointer"
            />
          </div>
        </div>

        {/* Harmonic Presets */}
        <div className="space-y-1.5">
          <span className="text-[8px] font-mono text-zinc-500 font-extrabold uppercase tracking-wider block">
            Empathy Symbiosis Harmonic Tuner Presets
          </span>
          <div className="grid grid-cols-4 gap-1.5">
            {[
              { f: 528, label: "528Hz Somatic", color: "border-amber-500/25 text-amber-400" },
              { f: 639, label: "639Hz Bond", color: "border-teal-500/25 text-teal-400" },
              { f: 888, label: "888Hz Hybrid", color: "border-cyan-500/25 text-cyan-400" },
              { f: 963, label: "963Hz OMNI", color: "border-amber-400/40 text-yellow-400" }
            ].map((item) => (
              <button
                key={item.f}
                type="button"
                onClick={() => {
                  setGemTuningFreq(item.f);
                  playCyberChirp(item.f, 0.25, 'triangle');
                  // Scale impulse animation
                  setGemScale(1.22);
                  setTimeout(() => setGemScale(1), 220);
                }}
                className={`text-[8.5px] font-mono py-1 rounded-lg border text-center transition cursor-pointer select-none active:scale-95 font-bold ${
                  gemTuningFreq === item.f 
                    ? "bg-amber-500/20 border-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.2)]" 
                    : "bg-slate-950/60 hover:bg-slate-900 " + item.color
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
