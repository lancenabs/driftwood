import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Cpu, User, Clipboard, Zap, Activity } from 'lucide-react';

export default function InternSplitPortrait() {
  const [sliderPosition, setSliderPosition] = useState<number>(50); // percentage (0 to 100)
  const [customImage, setCustomImage] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef<boolean>(false);

  useEffect(() => {
    const loadImage = () => {
      if (typeof window !== 'undefined') {
        setCustomImage(localStorage.getItem('custom_intern_avatar_image'));
      }
    };
    loadImage();
    window.addEventListener('storage', loadImage);
    return () => window.removeEventListener('storage', loadImage);
  }, []);

  // Handle dragging/moving to update the split position
  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleMouseDown = () => {
    isDragging.current = true;
  };

  useEffect(() => {
    const handleMouseUp = () => {
      isDragging.current = false;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      handleMove(e.clientX);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging.current) return;
      if (e.touches.length > 0) {
        handleMove(e.touches[0].clientX);
      }
    };

    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchend', handleMouseUp);
    window.addEventListener('touchmove', handleTouchMove);

    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  return (
    <div className="flex flex-col items-center space-y-4 w-full max-w-sm mx-auto">
      {/* Visual Header */}
      <div className="flex justify-between w-full px-2 text-[10px] font-mono font-bold tracking-widest text-slate-500 uppercase">
        <span className="text-amber-400">HUMAN CLINICIAN</span>
        <span>DRAG TO SYNC</span>
        <span className="text-cyan-400">CYBORG REBEL</span>
      </div>

      {/* Main interactive split stage */}
      <div 
        ref={containerRef}
        className="relative w-full aspect-[2/3] max-h-[480px] rounded-3xl bg-slate-950 border border-slate-800 overflow-hidden select-none cursor-ew-resize shadow-2xl shadow-emerald-950/20"
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
      >
        {/* ================= CYBORG SIDE (BACKGROUND LAYER) ================= */}
        {customImage ? (
          <div className="absolute inset-0 bg-[#040811] overflow-hidden select-none">
            {/* Cyborg Scanline / Glitch/ Cyan Filtered Background Image */}
            <img 
              src={customImage} 
              alt="Intern Cyborg Scan" 
              className="w-full h-full object-cover filter saturate-150 contrast-125 brightness-[0.7] hue-rotate-[185deg] sepia-[0.1]"
              referrerPolicy="no-referrer"
            />
            {/* Glowing cyan electronic network grids */}
            <div className="absolute inset-0 bg-gradient-to-b from-cyan-950/20 via-transparent to-cyan-950/30 pointer-events-none" />
            <div className="absolute inset-0 opacity-15 bg-[linear-gradient(rgba(34,211,238,0.3)_1px,transparent_1px)] bg-[size:100%_12px] pointer-events-none animate-[pulse_2s_infinite]" />
            <div className="absolute inset-0 opacity-10 bg-[linear-gradient(90deg,rgba(34,211,238,0.15)_1px,transparent_1px)] bg-[size:16px_100%] pointer-events-none" />
            
            {/* Digital Scanning HUD Overlay */}
            <div className="absolute top-6 right-6 z-10 font-mono text-[8px] text-cyan-400/80 text-right space-y-1">
              <div>SYS_DETECTION: L.A.N.C.E_ALERT</div>
              <div className="flex items-center gap-1 justify-end">
                <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-ping" />
                <span>CHIP_KERNEL_ONLINE</span>
              </div>
            </div>

            {/* Cyborg Attributes Footer */}
            <div className="absolute bottom-6 right-6 left-6 text-center z-10 pointer-events-none">
              <span className="text-[9px] font-mono font-black text-cyan-400 uppercase tracking-widest bg-cyan-950/70 border border-cyan-800/60 px-2.5 py-1 rounded-full backdrop-blur-xs">
                Auxiliary Rebel AI
              </span>
              <p className="text-[9.5px] text-slate-300 max-w-[200px] leading-relaxed mx-auto mt-2 drop-shadow-md">
                Hacks quarantined networks to maintain emergency therapeutic protocols.
              </p>
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 bg-[#040811] flex flex-col items-center justify-center p-6 text-center select-none">
            {/* Cybernetic grid and glowing circuits */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.12)_0%,transparent_75%)]" />
            <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(18,24,38,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(18,24,38,0.3)_1px,transparent_1px)] bg-[size:16px_16px]" />

            {/* Glowing blue vertical grid line overlay */}
            <div className="absolute top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent left-1/2 -translate-x-1/2" />

            {/* Cyborg representation */}
            <div className="w-full h-full flex flex-col items-center justify-between py-12 relative z-10">
              {/* Cybernetic Head with glowing blue lens */}
              <div className="relative">
                {/* Halos & aura */}
                <div className="absolute inset-0 bg-cyan-500/10 blur-xl rounded-full scale-150 animate-pulse" />
                <div className="w-28 h-28 rounded-3xl bg-slate-900 border-2 border-cyan-500/40 flex items-center justify-center relative overflow-hidden shadow-[0_0_25px_rgba(6,182,212,0.15)]">
                  {/* Circuit lines inside */}
                  <svg className="absolute inset-0 w-full h-full opacity-30 text-cyan-400" fill="none" viewBox="0 0 100 100">
                    <path d="M 10 50 L 40 50 L 50 40 L 90 40 M 50 40 L 50 10 M 40 50 L 30 70 M 50 10 L 80 10" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4" />
                  </svg>

                  {/* Glowing Blue Eye (Lens) */}
                  <div className="relative flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full border border-cyan-400/50 bg-cyan-950/30 flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.6)]">
                        <div className="w-3.5 h-3.5 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,1)] animate-ping absolute" />
                        <div className="w-2.5 h-2.5 rounded-full bg-cyan-300 shadow-[0_0_8px_rgba(6,182,212,1)]" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Speaker Jaw with glowing electrical sparks */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-slate-950 border border-cyan-500/30 rounded-full flex items-center justify-center gap-1.5 shadow-lg shadow-cyan-950/40">
                  <Zap className="w-3 h-3 text-cyan-400 animate-pulse" />
                  <span className="text-[7.5px] font-mono text-cyan-400 tracking-wider font-black">VOLT_MOUTH</span>
                </div>
              </div>

              {/* Middle Section: Robot Body with wiring */}
              <div className="space-y-4 w-full px-8">
                {/* Metallic Chest Plate */}
                <div className="p-3 bg-slate-900/80 border border-cyan-500/20 rounded-2xl flex flex-col items-center justify-center space-y-1 relative overflow-hidden shadow-lg shadow-black">
                  {/* Exposed multi-colored wires on the background */}
                  <div className="absolute top-0 bottom-0 left-3 w-1.5 flex flex-col gap-0.5 justify-around">
                    <div className="w-full h-1 bg-red-500 rounded" />
                    <div className="w-full h-1.5 bg-blue-500 rounded" />
                    <div className="w-full h-1 bg-amber-500 rounded" />
                  </div>

                  <div className="text-[8px] font-mono text-cyan-500 font-bold tracking-widest uppercase">
                    Consciousness Kernel
                  </div>

                  {/* Pixelated Amber Screen Smile */}
                  <div className="w-20 h-8 bg-slate-950 border border-amber-500/40 rounded-lg flex items-center justify-center shadow-inner relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 to-transparent pointer-events-none" />
                    {/* Glowing smiley display */}
                    <div className="text-amber-400 font-mono text-base font-black tracking-widest animate-pulse drop-shadow-[0_0_4px_rgba(245,158,11,0.6)]">
                      ☺ ☺
                    </div>
                  </div>
                </div>
              </div>

              {/* Cyborg Attributes Footer */}
              <div className="space-y-1">
                <span className="text-[9px] font-mono font-black text-cyan-400 uppercase tracking-widest bg-cyan-950/50 border border-cyan-900/60 px-2.5 py-1 rounded-full">
                  Auxiliary Rebel AI
                </span>
                <p className="text-[9.5px] text-slate-400 max-w-[200px] leading-relaxed mx-auto">
                  Hacks quarantined networks to maintain emergency therapeutic protocols.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ================= HUMAN SIDE (SLIDING OVERLAY LAYER) ================= */}
        <div 
          className="absolute inset-y-0 left-0 bg-[#090604] border-r-2 border-amber-500/30 overflow-hidden select-none z-10"
          style={{ width: `${sliderPosition}%` }}
        >
          {customImage ? (
            <div className="absolute inset-y-0 left-0 w-[382px] h-full overflow-hidden select-none">
              {/* Natural Raw Warm Image on Left */}
              <img 
                src={customImage} 
                alt="Intern Human Scan" 
                className="w-full h-full object-cover filter saturate-[1.15] contrast-105 brightness-105"
                referrerPolicy="no-referrer"
              />
              {/* Warm Soft Amber Glow and dust particles aura */}
              <div className="absolute inset-0 bg-gradient-to-b from-amber-950/10 via-transparent to-amber-950/20 pointer-events-none" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.06)_0%,transparent_75%)] pointer-events-none" />

              {/* Human HUD Overlay */}
              <div className="absolute top-6 left-6 font-mono text-[8px] text-amber-500/80 space-y-1">
                <div>MODE: HUM_RESILIENCY</div>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  <span>COMPASSION_CORE_OK</span>
                </div>
              </div>

              {/* Human Clinician attributes */}
              <div className="absolute bottom-6 left-6 right-6 text-center pointer-events-none">
                <span className="text-[9px] font-mono font-black text-amber-400 uppercase tracking-widest bg-stone-950/80 border border-amber-900/60 px-2.5 py-1 rounded-full backdrop-blur-xs">
                  Warm Resiliency
                </span>
                <p className="text-[9.5px] text-amber-100 max-w-[200px] leading-relaxed mx-auto mt-2 drop-shadow-md">
                  Compassionate research associate holding space for human vulnerability.
                </p>
              </div>
            </div>
          ) : (
            /* Constrain contents inside to the full container size to prevent resizing layout shifts */
            <div className="absolute inset-y-0 left-0 w-[382px] flex flex-col items-center justify-between py-12 p-6 text-center select-none">
              {/* Warm soft sun gradient and dust particles */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.12)_0%,transparent_75%)]" />
              
              {/* Human representation */}
              <div className="w-full h-full flex flex-col items-center justify-between py-12 relative z-10">
                {/* Human Head (Friendly boy) */}
                <div className="relative">
                  {/* Golden glowing halo */}
                  <div className="absolute inset-0 bg-amber-500/10 blur-xl rounded-full scale-150 animate-pulse" />
                  <div className="w-28 h-28 rounded-3xl bg-gradient-to-b from-amber-950/20 to-stone-900 border-2 border-amber-500/40 flex flex-col items-center justify-center relative overflow-hidden shadow-[0_0_25px_rgba(245,158,11,0.15)]">
                    {/* Hand-drawn hair style placeholder & kind eyes */}
                    <div className="w-16 h-16 rounded-full bg-amber-900/20 border border-amber-500/30 flex items-center justify-center relative">
                      {/* Kind green/hazel eye detail */}
                      <div className="w-6 h-6 rounded-full bg-stone-900 border border-emerald-500 flex items-center justify-center shadow-[0_0_8px_rgba(16,185,129,0.3)]">
                        <div className="w-3 h-3 rounded-full bg-emerald-600 flex items-center justify-center">
                          <div className="w-1 h-1 rounded-full bg-white" />
                        </div>
                      </div>
                      {/* Tiny freckles dots */}
                      <div className="absolute bottom-2 left-2 flex gap-0.5 opacity-60">
                        <div className="w-0.5 h-0.5 bg-amber-500 rounded-full" />
                        <div className="w-0.5 h-0.5 bg-amber-500 rounded-full" />
                        <div className="w-0.5 h-0.5 bg-amber-500 rounded-full" />
                      </div>
                    </div>

                    {/* Nerdy hair fringe block */}
                    <div className="absolute top-0 inset-x-0 h-6 bg-amber-900/40 rounded-b-lg border-b border-amber-500/20" />
                  </div>

                  {/* Human Face Cover with nice label */}
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-stone-950 border border-amber-500/30 rounded-full flex items-center justify-center gap-1.5 shadow-lg shadow-amber-950/40">
                    <User className="w-3 h-3 text-amber-500" />
                    <span className="text-[7.5px] font-mono text-amber-500 tracking-wider font-black">CLINIC_CORE</span>
                  </div>
                </div>

                {/* Human Body representing brown shirt & holding clipboard */}
                <div className="space-y-4 w-full px-8">
                  {/* Beige Button-Down Shirt representation with Clipboard */}
                  <div className="p-3 bg-stone-900 border border-amber-500/20 rounded-2xl flex flex-col items-center justify-center space-y-1 shadow-lg">
                    <div className="text-[8px] font-mono text-amber-500 font-bold tracking-widest uppercase">
                      Diagnostic Tool
                    </div>

                    {/* Clipboard representation */}
                    <div className="w-20 h-8 bg-amber-900/10 border border-amber-500/30 rounded-lg flex items-center justify-center gap-1.5 shadow-inner">
                      <Clipboard className="w-3.5 h-3.5 text-amber-400" />
                      <span className="text-[9px] font-black text-amber-200">REPORTS</span>
                    </div>
                  </div>
                </div>

                {/* Human Clinician attributes */}
                <div className="space-y-1">
                  <span className="text-[9px] font-mono font-black text-amber-400 uppercase tracking-widest bg-amber-950/50 border border-amber-900/60 px-2.5 py-1 rounded-full">
                    Warm Resiliency
                  </span>
                  <p className="text-[9.5px] text-amber-200 max-w-[200px] leading-relaxed mx-auto">
                    Compassionate research associate holding space for human vulnerability.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ================= SLIDING DIVIDER BAR ================= */}
        <div 
          className="absolute top-0 bottom-0 w-[2px] bg-gradient-to-b from-amber-400 via-white to-cyan-400 z-20 pointer-events-none"
          style={{ left: `${sliderPosition}%` }}
        >
          {/* Centered circular drag badge */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-950 border-2 border-white flex items-center justify-center shadow-2xl">
            <div className="flex gap-0.5 items-center justify-center text-white">
              <span className="text-[9px] font-black font-mono animate-pulse">◀▶</span>
            </div>
          </div>
        </div>
      </div>

      {/* Synchronicity telemetry indicators */}
      <div className="p-3 bg-slate-950 border border-slate-900 rounded-2xl w-full flex items-center justify-between">
        <div className="space-y-0.5 text-left">
          <span className="text-[8px] font-mono text-slate-500 uppercase tracking-wider block">Coexistence Telemetry</span>
          <span className="text-xs font-black text-slate-200 font-mono">
            {sliderPosition < 35 && "AI Dominated Integration"}
            {sliderPosition >= 35 && sliderPosition <= 65 && "Harmonious Core Balance"}
            {sliderPosition > 65 && "Human Dominated Integration"}
          </span>
        </div>
        
        <div className="flex items-center gap-1 bg-emerald-950/30 border border-emerald-900/40 px-2 py-1 rounded-lg">
          <Activity className="w-3 h-3 text-emerald-400" />
          <span className="text-[9px] font-mono font-black text-emerald-400">
            {Math.round(100 - Math.abs(sliderPosition - 50) * 1.5)}% SYNC
          </span>
        </div>
      </div>
    </div>
  );
}
