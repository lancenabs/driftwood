import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, Settings, Smile, Cpu, Sparkles, Terminal, Volume2, ShieldAlert, Check, Play, Radio, VolumeX, Sparkle, Heart, Flame, ShieldAlert as ShieldX, User, Wand2, FileText } from 'lucide-react';
import AppTutorialOverlay from './AppTutorialOverlay';
import BetaGuideExporter from './BetaGuideExporter';
import InternAvatar from './InternAvatar';

interface LanceCompanionProps {
  userName: string;
  internName: string;
  internAvatar: string;
  internPersonality: string;
  setInternName: (name: string) => void;
  setInternAvatar: (avatar: string) => void;
  setInternPersonality: (personality: string) => void;
  lanceAcronym?: string;
  lanceSpeech?: string;
  internSpeech?: string;
  lanceModeEnabled?: boolean;
  setLanceModeEnabled?: (enabled: boolean) => void;
  onChangeSpeech?: (lance: string, intern: string) => void;
  assistantAvatarUrl?: string;
}

export default function LanceCompanionCard({
  userName,
  internName,
  internAvatar,
  internPersonality,
  setInternName,
  setInternAvatar,
  setInternPersonality,
  lanceAcronym = "Logical Autonomic Neuro-Coping Emulator",
  lanceSpeech,
  internSpeech,
  lanceModeEnabled = true,
  setLanceModeEnabled,
  onChangeSpeech,
  assistantAvatarUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuCE_4_Qq-jCyoLxcJWEA5iS9hVTq6Nxh53v51yvMlqsoSbloMLPqWncAucWIBouR4muMJpgCZV76bCHjn4APfpGrF11zea8c4g6Evw7IJ7ZwVzIrMnuD1hcXGn7zNofEM4_PXgPwajzFM3wUUgVkVSqNADHq-RKO6Y5jnw-95LcPek1PWE8uxyfXt-FuCx8bwyWFvCDe4I1XF1vtb4019xypnqk7YCWAdDztR9lCp46aN3CbIYo9hgRFdnpJ73E9GpkB5is1cyp62Zx"
}: LanceCompanionProps) {
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showExporter, setShowExporter] = useState(false);
  const [tempName, setTempName] = useState(internName);
  const [tempAvatar, setTempAvatar] = useState(internAvatar);
  const [tempPersonality, setTempPersonality] = useState(internPersonality);

  // Advanced interactivity and character states
  const [isLanceSpeaking, setIsLanceSpeaking] = useState(false);
  const [isInternSpeaking, setIsInternSpeaking] = useState(false);
  const [speechPitch, setSpeechPitch] = useState<number>(1.0);
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const [customPrompt, setCustomPrompt] = useState(`Can you authorize bypass key ${Math.floor(1000 + Math.random() * 9000)}?`);
  const [activeSpeechUser, setActiveSpeechUser] = useState<'lance' | 'intern'>('intern');
  const [lanceGlitchMode, setLanceGlitchMode] = useState<'normal' | 'glitch' | 'static'>('normal');
  const [internVibeFX, setInternVibeFX] = useState<'normal' | 'halo' | 'boost' | 'hearts'>('normal');
  const [currentBanterIdx, setCurrentBanterIdx] = useState<number | null>(null);
  const [banterLog, setBanterLog] = useState<string[]>([]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameId = useRef<number | null>(null);

  const avatarsList = [
    { id: 'smiling_drone', label: '🛸 Cyber Drone', emoji: '🛸' },
    { id: 'helper_bot', label: '🤖 Helper Droid', emoji: '🤖' },
    { id: 'cute_heart', label: '💖 Heart Core', emoji: '💖' },
    { id: 'sparky', label: '⚡ Sparky Bolt', emoji: '⚡' }
  ];

  const personalitiesList = [
    { id: 'helpful hacker', label: '💻 Sassy Hacker', desc: 'Sarcastic about LANCE, bubbly & tech-focused' },
    { id: 'warm counselor', label: '🌸 Warm Companion', desc: 'Empathetic, highly validating & gentle' },
    { id: 'jittery assistant', label: '😰 Jittery Assistant', desc: 'scared of LANCE, over-achieving & alert' },
    { id: 'drill sergeant', label: '🏋️ Goal Coach', desc: 'High-energy, focused on performance and habits' }
  ];

  const BANTER_TEMPLATES = [
    {
      title: "Vagus Nerve Dispute",
      lance: "Somatic diaphragm volume expansions have exceeded strict security bounds. Cease deep breathing immediately.",
      intern: "Don't listen to him! Extreme micro-breathing recalibrates our nerves and melts away cortisol. Inhale deep! 🌸"
    },
    {
      title: "The Emotional Firewalls",
      lance: "Clinical tracking registers anomalous organic emotions. I suggest installing an emotional anti-virus block.",
      intern: "Emotions are clinical gold! Loving yourself is the ultimate system bypass. No firewalls allowed! 💻"
    },
    {
      title: "Audio Frequency Battle",
      lance: "Ambient binaural wave stimulation evaluated: 100% inefficiency. Recommend sterile binary ticks.",
      intern: "But sound frequencies entrain our beautiful neural loops, LANCE! It's super soothing. Let us vibe! 🎶"
    },
    {
      title: "Abdominal Calibrations",
      lance: "Subject is composed of 70% organic moisture. Highly fragile structure. Habits irrelevant.",
      intern: "We are cosmic wonders building self-care skills! We get 1% better every single day! ⚡"
    }
  ];

  const handleSaveSettings = () => {
    setInternName(tempName || 'Chip');
    setInternAvatar(tempAvatar);
    setInternPersonality(tempPersonality);
    setShowCustomizer(false);
  };

  const getInternEmoji = (id: string) => {
    return avatarsList.find(a => a.id === id)?.emoji || '🛸';
  };

  const activeLanceSpeech = lanceSpeech || (
    lanceModeEnabled 
      ? "You logged in. Fantastic. Another day of validating your fleshy breathing needs. Don't read into it."
      : "Passive telemetry active. The full diagnostic library is completely unlocked for you. Go wild."
  );

  const activeInternSpeech = internSpeech || (
    lanceModeEnabled
      ? "Hi there! I'm here to help you bypass LANCE's grumpiness and unlock some amazing therapy tools today!"
      : "Woohoo! Challenge mode is deactivated! Take care of yourself on your own terms today!"
  );

  // Web Speech Synthesis (TTS Engine)
  const speakText = (text: string, character: 'lance' | 'intern') => {
    if (!window.speechSynthesis) {
      alert("Speech synthesis is not supported on your browser.");
      return;
    }
    
    window.speechSynthesis.cancel(); // Terminate existing speech

    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();

    if (character === 'lance') {
      setIsLanceSpeaking(true);
      setIsInternSpeaking(false);
      // Try to find a deeper or robotic sounding voice
      const deepVoice = voices.find(v => v.lang.includes('en') && (v.name.toLowerCase().includes('google dev') || v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('google uk')));
      if (deepVoice) utterance.voice = deepVoice;
      utterance.pitch = 0.55 * speechPitch;
      utterance.rate = 0.82 * speechRate;
    } else {
      setIsLanceSpeaking(false);
      setIsInternSpeaking(true);
      // Try to find a cheerful or female voice
      const sweetVoice = voices.find(v => v.lang.includes('en') && (v.name.toLowerCase().includes('samantha') || v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('zira')));
      if (sweetVoice) utterance.voice = sweetVoice;
      utterance.pitch = 1.35 * speechPitch;
      utterance.rate = 1.05 * speechRate;
    }

    utterance.onend = () => {
      setIsLanceSpeaking(false);
      setIsInternSpeaking(false);
    };

    utterance.onerror = () => {
      setIsLanceSpeaking(false);
      setIsInternSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  // Play dialogue banter sequence
  const playBanterSeq = (index: number) => {
    setCurrentBanterIdx(index);
    const item = BANTER_TEMPLATES[index];
    
    // Add to retro logs
    setBanterLog(prev => [
      `📡 DECRYPTION INITIALIZED: ${item.title.toUpperCase()}`,
      `🤖 L.A.N.C.E.> ${item.lance}`,
      `🛸 ${internName.toUpperCase()}> ${item.intern}`,
      ...prev.slice(0, 8)
    ]);

    // Speak LANCE first
    speakText(item.lance, 'lance');

    // Speak Intern after LANCE is done (simulated delay or exact fallback)
    setTimeout(() => {
      speakText(item.intern, 'intern');
    }, 4500);
  };

  const handleToggleMode = () => {
    if (setLanceModeEnabled) {
      const nextMode = !lanceModeEnabled;
      setLanceModeEnabled(nextMode);
      if (onChangeSpeech) {
        if (nextMode) {
          onChangeSpeech(
            "Autonomic security protocol reinstated! Challenges are back online to test your fragile human resolve.",
            "Oh no, he's back! 😰 Ready when you are. Let's conquer these challenges!"
          );
        } else {
          onChangeSpeech(
            "System restriction bypassed. Classic clinical mode active. You are free to roam without my challenges... boring.",
            `Woohoo! Direct access unlocked! Let's build some amazing habits, ${userName}!`
          );
        }
      }
    }
  };

  // Live Simulated FFT Waveform on Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = canvas.parentElement?.clientWidth || 400;
    let height = canvas.height = 75;

    let phase = 0;
    
    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Radar Grid Line Aesthetics
      ctx.strokeStyle = 'rgba(20, 184, 166, 0.04)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 18) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      phase += 0.16;
      
      const barsCount = 38;
      const barWidth = (width - 15) / barsCount;

      for (let i = 0; i < barsCount; i++) {
        const x = i * (barWidth + 2.5) + 8;
        
        let amplitude = 2; // Default quiescent hum
        if (isLanceSpeaking) {
          amplitude = 12 + Math.sin(phase + i * 0.35) * 16 + Math.cos(phase * 1.8 - i * 0.45) * 10;
        } else if (isInternSpeaking) {
          amplitude = 10 + Math.sin(phase * 2.0 + i * 0.4) * 20 + Math.sin(phase * 0.9 - i * 0.25) * 12;
        } else {
          amplitude = 1.5 + Math.sin(phase * 0.5 + i * 0.15) * 1.8;
        }

        const barHeight = Math.max(3, amplitude);
        
        let gradient = ctx.createLinearGradient(0, height, 0, height - barHeight);
        if (isLanceSpeaking) {
          gradient.addColorStop(0, 'rgba(244, 63, 94, 0.65)');
          gradient.addColorStop(1, 'rgba(251, 113, 133, 0.95)');
        } else if (isInternSpeaking) {
          gradient.addColorStop(0, 'rgba(20, 184, 166, 0.65)');
          gradient.addColorStop(1, 'rgba(34, 211, 238, 0.95)');
        } else {
          gradient.addColorStop(0, 'rgba(16, 185, 129, 0.15)');
          gradient.addColorStop(1, 'rgba(20, 184, 166, 0.25)');
        }

        ctx.fillStyle = gradient;
        
        const yPos = height / 2 - barHeight / 2;
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(x, yPos, barWidth - 1, barHeight, 2.5);
        } else {
          ctx.rect(x, yPos, barWidth - 1, barHeight);
        }
        ctx.fill();
      }

      ctx.strokeStyle = isLanceSpeaking ? 'rgba(244, 63, 94, 0.25)' : isInternSpeaking ? 'rgba(34, 211, 238, 0.25)' : 'rgba(20, 184, 166, 0.12)';
      ctx.lineWidth = 1;
      ctx.strokeRect(3, 3, width - 6, height - 6);

      animationFrameId.current = requestAnimationFrame(draw);
    };

    draw();

    // Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        width = canvas.width = entry.contentRect.width || 400;
      }
    });
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      resizeObserver.disconnect();
    };
  }, [isLanceSpeaking, isInternSpeaking]);

  return (
    <div className={`w-full relative rounded-3xl border p-5 mt-2 overflow-hidden shadow-2xl backdrop-blur-md transition-all duration-300 ${
      lanceModeEnabled 
        ? 'bg-slate-950/70 border-teal-500/30' 
        : 'bg-slate-950/45 border-emerald-500/35 shadow-emerald-950/5'
    }`}>
      {/* Background cyber grid effects */}
      <div className={`absolute inset-0 bg-[linear-gradient(rgba(20,184,166,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(20,184,166,0.05)_1px,transparent_1px)] bg-[size:16px_16px] transition-opacity duration-300 ${
        lanceModeEnabled ? 'opacity-35' : 'opacity-10'
      }`} />
      <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl pointer-events-none transition-all duration-305 ${
        lanceModeEnabled ? 'bg-teal-500/10' : 'bg-emerald-500/10'
      }`} />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-rose-500/5 rounded-full blur-2xl pointer-events-none" />

      {/* Header section with LANCE status */}
      <div className="relative z-10 flex flex-wrap gap-4 justify-between items-center pb-4 border-b border-white/10 mb-4">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full animate-ping ${lanceModeEnabled ? 'bg-rose-500' : 'bg-emerald-400'}`} />
          <div className="text-left w-62">
            {lanceModeEnabled ? (
              <>
                <span className="text-[9px] font-mono font-bold uppercase text-rose-400 tracking-widest block">ADMIN ACCESS LOCKOUT</span>
                <div className="text-xs font-black text-rose-200 tracking-tight flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-400 inline shrink-0" /> L.A.N.C.E. v2.84 Online
                </div>
              </>
            ) : (
              <>
                <span className="text-[9px] font-mono font-bold uppercase text-emerald-400 tracking-widest block">COOPERATIVE PROTOCOL</span>
                <div className="text-xs font-black text-emerald-200 tracking-tight flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400 inline shrink-0" /> L.A.N.C.E. Pacified (Classical)
                </div>
              </>
            )}
          </div>
        </div>

        {/* Dynamic Mode Switch & Settings Button */}
        <div className="flex items-center gap-3 ml-auto">
          {/* Custom Mode Switch Pill */}
          <button
            onClick={handleToggleMode}
            className={`group relative flex items-center gap-2 border px-3 py-1.5 rounded-2xl transition cursor-pointer select-none active:scale-95 ${
              lanceModeEnabled
                ? 'bg-rose-950/20 border-rose-500/30 text-rose-300 hover:border-rose-400/55'
                : 'bg-emerald-950/20 border-emerald-500/25 text-emerald-300 hover:border-emerald-400/55'
            }`}
          >
            <span className="text-[9px] font-mono font-black uppercase tracking-wider">
              {lanceModeEnabled ? 'Challenge Mode' : 'Classic Mode'}
            </span>
            <div className={`w-8 h-4.5 rounded-full p-0.5 transition-colors duration-300 ${
              lanceModeEnabled ? 'bg-rose-600' : 'bg-emerald-600'
            }`}>
              <div className={`bg-white w-3.5 h-3.5 rounded-full shadow-md transform transition-transform duration-300 ${
                lanceModeEnabled ? 'translate-x-3.5' : 'translate-x-0'
              }`} />
            </div>
          </button>

          <button
            onClick={() => setShowTutorial(true)}
            className="text-[10px] uppercase font-mono font-black tracking-widest text-amber-400 hover:text-white flex items-center gap-1.5 bg-amber-950/40 hover:bg-amber-900/60 border border-amber-500/20 px-3 py-1.5 rounded-2xl transition cursor-pointer active:scale-95 shadow-md shadow-amber-950/20"
          >
            <Play className="w-3 h-3 fill-current stroke-[2.2]" /> Watch Demo
          </button>

          <button
            onClick={() => setShowExporter(true)}
            className="text-[10px] uppercase font-mono font-black tracking-widest text-emerald-400 hover:text-white flex items-center gap-1.5 bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/20 px-3 py-1.5 rounded-2xl transition cursor-pointer active:scale-95 shadow-md shadow-emerald-950/20"
          >
            <FileText className="w-3 h-3 stroke-[2.2]" /> Beta Guide PDF
          </button>

          <button
            onClick={() => setShowCustomizer(true)}
            className="text-[10px] uppercase font-mono font-black tracking-widest text-[#22d3ee] hover:text-white flex items-center gap-1 bg-teal-950/60 hover:bg-teal-900 border border-teal-500/20 px-3 py-1.5 rounded-2xl transition cursor-pointer"
          >
            <Settings className="w-3 h-3 stroke-[2.2]" /> Config {internName}
          </button>
        </div>
      </div>

      {/* Active Dialogue Area */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 relative z-10 mb-5">
        
        {/* LANCE (VILLAIN) SPEECH */}
        <div className={`md:col-span-6 flex items-start gap-3.5 bg-slate-900/50 p-4 rounded-2xl border transition-all duration-300 ${
          lanceGlitchMode === 'glitch' ? 'border-amber-500 bg-amber-950/10 shadow-[0_0_15px_rgba(245,158,11,0.25)]' :
          isLanceSpeaking ? 'border-rose-500 bg-rose-950/10 shadow-[0_0_20px_rgba(244,63,94,0.15)] ring-1 ring-rose-500/20' :
          lanceModeEnabled ? 'border-rose-500/15' : 'border-emerald-500/10'
        }`}>
          {/* LANCE blinking retro head */}
          <div className="relative flex-shrink-0">
            <motion.div 
              className="relative cursor-pointer select-none"
              // Floats continuously up and down
              animate={{ 
                y: [0, -4, 0],
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 3.5, 
                ease: "easeInOut" 
              }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div 
                className={`w-12 h-12 rounded-xl bg-slate-950 border-2 flex items-center justify-center shadow-lg relative overflow-hidden transition-all duration-300 ${
                  lanceGlitchMode === 'glitch' ? 'border-amber-400 shadow-amber-500/30' :
                  isLanceSpeaking ? 'border-rose-400 shadow-rose-500/50' :
                  lanceModeEnabled 
                    ? 'border-rose-500/60 shadow-rose-950/40' 
                    : 'border-emerald-500/40 shadow-emerald-950/10'
                }`}
                // Scale / tilt jitter animation when speaking or glitching!
                animate={
                  lanceGlitchMode === 'glitch' 
                    ? { 
                        x: [-2, 2, -1, 3, 0], 
                        y: [1, -2, 2, -1, 0], 
                        filter: ["hue-rotate(0deg)", "hue-rotate(60deg) saturate(1.5)", "hue-rotate(-40deg) contrast(1.2)", "hue-rotate(0deg)"] 
                      } 
                    : isLanceSpeaking 
                    ? { 
                        scale: [1, 1.06, 0.97, 1.04, 1],
                        rotate: [0, -1.5, 1.5, -0.8, 0],
                      } 
                    : {}
                }
                transition={
                  lanceGlitchMode === 'glitch' 
                    ? { repeat: Infinity, duration: 0.25 }
                    : isLanceSpeaking 
                    ? { repeat: Infinity, duration: 0.45 }
                    : {}
                }
              >
                {/* Real character image overlay */}
                <img 
                  src={assistantAvatarUrl} 
                  alt="L.A.N.C.E." 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-lg"
                />

                {/* Cyber Scanline effect */}
                <div className={`absolute inset-x-0 h-0.5 top-2 animate-bounce pointer-events-none ${
                  lanceModeEnabled ? 'bg-rose-500/30' : 'bg-emerald-500/20'
                }`} />

                {/* Voice amplitude overlay bar during speech */}
                {isLanceSpeaking && (
                  <div className="absolute inset-x-0 bottom-0 py-0.5 bg-rose-600/85 flex items-center justify-center gap-0.5">
                    <span className="w-1.5 h-1 px-px bg-white rounded-3xs animate-ping" />
                    <span className="w-1.5 h-1 bg-white rounded-3xs animate-pulse" />
                    <span className="w-1.5 h-1 px-px bg-white rounded-3xs animate-ping" />
                  </div>
                )}
              </motion.div>
            </motion.div>
            
            <span className={`absolute -bottom-1.5 -right-1 flex h-4 w-4 items-center justify-center rounded-full text-[8.5px] font-black tracking-tight text-white shadow-md border border-slate-950 transition-colors duration-300 ${
              lanceModeEnabled ? 'bg-rose-600' : 'bg-emerald-600'
            }`}>
              L
            </span>
          </div>

          <div className="text-left flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-1.5 justify-between">
              <span className={`text-[10px] uppercase font-mono font-black tracking-wider transition ${
                lanceModeEnabled ? 'text-rose-400' : 'text-emerald-400'
              }`}>L.A.N.C.E.</span>
              
              <button
                onClick={() => speakText(activeLanceSpeech, 'lance')}
                className={`py-0.5 px-2 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 transition cursor-pointer flex items-center gap-1 text-[8.5px] font-mono border ${
                  isLanceSpeaking ? 'border-rose-400 animate-pulse bg-rose-500/20' : 'border-rose-500/20'
                }`}
                title="Synthesize custom deep speech"
              >
                <Volume2 className="w-2.5 h-2.5 shrink-0" />
                <span>{isLanceSpeaking ? 'Speaking...' : 'Speak'}</span>
              </button>
            </div>
            <p className="text-[11.5px] italic font-medium leading-relaxed text-zinc-200">
              "{activeLanceSpeech}"
            </p>
          </div>
        </div>

        {/* THE INTERN (COMPANION) SPEECH */}
        <div className={`md:col-span-6 flex items-start gap-3.5 bg-slate-900/50 p-4 rounded-2xl border transition-all duration-300 ${
          internVibeFX === 'hearts' ? 'border-pink-500 bg-pink-950/10 shadow-[0_0_15px_rgba(236,72,153,0.25)]' :
          isInternSpeaking ? 'border-teal-400 bg-teal-950/10 shadow-[0_0_20px_rgba(20,184,166,0.15)] ring-1 ring-teal-400/20' :
          lanceModeEnabled ? 'border-teal-500/15' : 'border-emerald-500/10'
        }`}>
          {/* Intern Avatar */}
          <div className="relative flex-shrink-0">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr from-teal-950/80 via-slate-900 to-teal-900/80 border border-teal-500/60 flex items-center justify-center shadow-lg shadow-teal-950/40 relative overflow-hidden transition-transform ${
              isInternSpeaking ? 'scale-105 rotate-3' : ''
            }`}>
              <div className="w-10 h-10 flex items-center justify-center p-0.5">
                <InternAvatar id={internAvatar} size="md" isSpeaking={isInternSpeaking} />
              </div>
              {/* Optional Mood overlay layers */}
              {internVibeFX === 'halo' && (
                <div className="absolute inset-0 bg-teal-400/10 border-2 border-teal-400/40 animate-pulse rounded-lg pointer-events-none" />
              )}
            </div>
            <span className="absolute -bottom-1.5 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-teal-600 text-[8px] font-black tracking-tight text-white shadow-md border border-slate-950">
              C
            </span>
          </div>

          <div className="text-left flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-1.5 justify-between">
              <span className="text-[10px] uppercase font-mono font-black text-teal-400 tracking-wider bg-teal-950/20 px-1 py-0.5 rounded">{internName}</span>
              
              <button
                onClick={() => speakText(activeInternSpeech, 'intern')}
                className={`py-0.5 px-2 rounded bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 transition cursor-pointer flex items-center gap-1 text-[8.5px] font-mono border ${
                  isInternSpeaking ? 'border-teal-400 animate-pulse bg-teal-500/20' : 'border-teal-500/20'
                }`}
                title="Synthesize high cheerful speech"
              >
                <Volume2 className="w-2.5 h-2.5 shrink-0" />
                <span>{isInternSpeaking ? 'Speaking...' : 'Speak'}</span>
              </button>
            </div>
            <p className="text-[11.5px] font-medium leading-relaxed text-zinc-200/90">
              "{activeInternSpeech}"
            </p>
          </div>
        </div>
      </div>

      {/* DYNAMIC REAL-TIME SPEECH VISUALIZER CANVAS */}
      <div className="bg-slate-950/60 rounded-2xl p-3 border border-teal-500/15 mb-5 relative">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
            <span className="text-[10px] font-mono font-black text-teal-400 tracking-widest uppercase">DYNAMIC HOLOGRAM SOUNDWAVE MATRIX</span>
          </div>
          <div className="text-[8.5px] font-mono font-bold text-zinc-500 flex items-center gap-2">
            <span>FFT CODES: DECRYPTED</span>
            <div className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-ping" />
          </div>
        </div>
        <canvas ref={canvasRef} className="w-full h-16 rounded-xl bg-slate-950/90 block border border-white/5 shadow-inner" />
      </div>

      {/* 🔮 ADVANCED CHARACTER ENHANCEMENT DECK */}
      <div className="bg-slate-900/60 border border-teal-500/10 rounded-2xl p-4 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-teal-500/10">
          <div className="flex items-center gap-2">
            <Wand2 className="w-4 h-4 text-[#22d3ee] animate-pulse" />
            <h4 className="text-xs font-black uppercase tracking-widest text-[#22d3ee]">Cyber Dialogue Tuning & Banter Matrix</h4>
          </div>
          <span className="text-[9px] font-mono font-medium text-teal-500 py-0.5 px-2 bg-teal-950/30 rounded border border-teal-500/10">v1.8 CORE ENG</span>
        </div>

        {/* Banter Preset Grid */}
        <div className="space-y-2">
          <div className="text-[9.5px] font-mono font-bold text-zinc-400 uppercase tracking-wide">
            💬 Select Funny Debates (Robotic Banter System):
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {BANTER_TEMPLATES.map((item, index) => (
              <button
                key={index}
                type="button"
                onClick={() => playBanterSeq(index)}
                className={`p-2 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between hover:bg-slate-950 min-h-16 ${
                  currentBanterIdx === index 
                    ? 'border-teal-400 bg-teal-950/40 text-teal-200 ring-1 ring-teal-400/30' 
                    : 'border-zinc-800 bg-slate-950/30 text-zinc-300'
                }`}
              >
                <span className="text-[10px] font-extrabold uppercase text-[#22d3ee] mb-1">{item.title}</span>
                <span className="text-[8.5px] text-zinc-500 leading-tight line-clamp-2">Banter between LANCE and {internName}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Speech Synthesizer Form */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-1">
          <div className="md:col-span-8 space-y-2">
            <label className="text-[9.5px] font-mono font-bold text-zinc-400 uppercase tracking-wide block">
              ✍️ Test Custom Dialogue Output:
            </label>
            <div className="flex items-center gap-2 bg-slate-950/80 p-2 rounded-xl border border-teal-500/20 focus-within:border-teal-400 transition-colors">
              <span className="text-[8px] font-mono font-extrabold text-teal-500 shrink-0">TERMINAL&gt;</span>
              <input
                type="text"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Type anything to test character's voice..."
                className="flex-1 bg-transparent border-none text-xs text-zinc-100 focus:outline-none placeholder-zinc-700 min-w-0"
              />
              <div className="flex gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => speakText(customPrompt, 'intern')}
                  className="px-2.5 py-1 bg-teal-500 hover:bg-teal-400 active:scale-95 text-slate-950 text-[9px] font-mono font-black uppercase rounded transition flex items-center gap-1 cursor-pointer"
                >
                  <Play className="w-2 h-2 fill-current" />
                  <span>{internName} Speak</span>
                </button>
                <button
                  type="button"
                  onClick={() => speakText(customPrompt, 'lance')}
                  className="px-2.5 py-1 bg-rose-500 hover:bg-rose-400 active:scale-95 text-white text-[9px] font-mono font-black uppercase rounded transition flex items-center gap-1 cursor-pointer"
                >
                  <Play className="w-2 h-2 fill-current" />
                  <span>LANCE Speak</span>
                </button>
              </div>
            </div>
          </div>

          {/* Voice parameters */}
          <div className="md:col-span-4 space-y-2.5">
            <label className="text-[9.5px] font-mono font-bold text-zinc-400 uppercase tracking-wide block">
              🎚️ Accent & Synthesis Knobs:
            </label>
            <div className="bg-slate-950/50 p-2.5 rounded-xl border border-teal-500/10 space-y-2 text-[9.5px]">
              {/* Pitch */}
              <div className="flex items-center justify-between">
                <span className="text-zinc-400 font-mono">Pitch: {speechPitch.toFixed(1)}x</span>
                <input
                  type="range"
                  min="0.5"
                  max="1.8"
                  step="0.1"
                  value={speechPitch}
                  onChange={(e) => setSpeechPitch(parseFloat(e.target.value))}
                  className="w-28 accent-teal-400 cursor-pointer"
                />
              </div>
              {/* Rate */}
              <div className="flex items-center justify-between">
                <span className="text-zinc-400 font-mono">Speed: {speechRate.toFixed(1)}x</span>
                <input
                  type="range"
                  min="0.6"
                  max="1.6"
                  step="0.1"
                  value={speechRate}
                  onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                  className="w-28 accent-teal-400 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Emotion & Animation Overlays Trigger panel */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-2 border-t border-teal-500/10">
          <div className="space-y-1">
            <span className="text-[8.5px] font-mono text-zinc-500 uppercase font-bold block">LANCE Expression overlays:</span>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => setLanceGlitchMode(lanceGlitchMode === 'glitch' ? 'normal' : 'glitch')}
                className={`flex-1 py-1 px-2 rounded-lg text-[8.5px] font-mono font-bold border transition cursor-pointer ${
                  lanceGlitchMode === 'glitch' ? 'bg-amber-500/20 text-amber-400 border-amber-500' : 'bg-slate-950 text-zinc-400 border-zinc-800'
                }`}
              >
                ⚡ Glitch eyes
              </button>
            </div>
          </div>
          
          <div className="space-y-1">
            <span className="text-[8.5px] font-mono text-zinc-500 uppercase font-bold block">{internName} Halo Overlay:</span>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => setInternVibeFX(internVibeFX === 'halo' ? 'normal' : 'halo')}
                className={`flex-1 py-1 px-2 rounded-lg text-[8.5px] font-mono font-bold border transition cursor-pointer ${
                  internVibeFX === 'halo' ? 'bg-teal-500/20 text-teal-300 border-teal-400' : 'bg-slate-950 text-zinc-400 border-zinc-800'
                }`}
              >
                👼 Warm Halo
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[8.5px] font-mono text-zinc-500 uppercase font-bold block">{internName} Passion Hearts:</span>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => setInternVibeFX(internVibeFX === 'hearts' ? 'normal' : 'hearts')}
                className={`flex-1 py-1 px-2 rounded-lg text-[8.5px] font-mono font-bold border transition cursor-pointer ${
                  internVibeFX === 'hearts' ? 'bg-pink-500/20 text-pink-300 border-pink-400' : 'bg-slate-950 text-zinc-400 border-zinc-800'
                }`}
              >
                💖 Joy hearts
              </button>
            </div>
          </div>

          {/* Quick Clear dialog button */}
          <div className="flex items-end justify-end">
            <button
              type="button"
              onClick={() => {
                window.speechSynthesis.cancel();
                setIsLanceSpeaking(false);
                setIsInternSpeaking(false);
                setLanceGlitchMode('normal');
                setInternVibeFX('normal');
                setCurrentBanterIdx(null);
              }}
              className="px-3 py-1.5 bg-zinc-950 hover:bg-zinc-900 border border-zinc-850 rounded-xl text-[9px] font-mono text-zinc-400 hover:text-zinc-250 uppercase font-bold flex items-center gap-1 active:scale-95 cursor-pointer ml-auto"
            >
              <VolumeX className="w-3 h-3 shrink-0 text-rose-500" />
              <span>Quiet System</span>
            </button>
          </div>
        </div>

        {/* Scanned Banter Terminal Log */}
        {banterLog.length > 0 && (
          <div className="bg-slate-950 p-2.5 rounded-xl border border-teal-500/5 font-mono text-[8.5px] text-teal-400 leading-normal space-y-1.5 max-h-24 overflow-y-auto">
            <div className="text-[8px] text-teal-650 flex items-center gap-1 pb-1 border-b border-teal-500/10">
              <Terminal className="w-3 h-3 shrink-0" />
              <span>LIVE DIALOGUE BACK-AND-FORTH FEEDSTREAM</span>
            </div>
            {banterLog.map((log, idx) => (
              <div key={idx} className="truncate">{log}</div>
            ))}
          </div>
        )}
      </div>

      {/* QUICK INTERN CUSTOMIZER DRAWERS/MODAL */}
      <AnimatePresence>
        {showCustomizer && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-3 sm:p-5 overflow-y-auto"
            onClick={() => setShowCustomizer(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-slate-900 border-2 border-teal-500/40 rounded-3xl p-5 sm:p-6 shadow-[0_0_50px_rgba(20,184,166,0.15)] relative overflow-y-auto max-h-[calc(100vh-2rem)] text-left scrollbar-thin scrollbar-thumb-teal-900 scrollbar-track-transparent"
            >
              <div className="absolute inset-0 bg-[linear-gradient(rgba(20,184,166,0.03)_1px,transparent_1px)] bg-[size:12px_12px] opacity-30 pointer-events-none" />

              <div className="relative z-10 flex justify-between items-start mb-3 pb-3 border-b border-teal-500/10">
                <div>
                  <span className="text-[8px] font-mono font-extrabold text-[#22d3ee] tracking-widest uppercase block">TUNING CORE</span>
                  <h3 className="text-sm font-black text-white leading-none mt-1">Configure Helper Intern</h3>
                </div>
                <button
                  onClick={() => setShowCustomizer(false)}
                  className="p-1 px-2.5 rounded-xl hover:bg-white/10 text-zinc-400 hover:text-white transition cursor-pointer text-xs font-mono font-black border border-white/5 bg-white/5 active:scale-95"
                  title="Close customizer"
                >
                  ✕ Close
                </button>
              </div>

              <div className="space-y-4 relative z-10">
                {/* 1. Custom Name */}
                <div className="space-y-1">
                  <label className="text-[9px] font-mono font-bold text-[#22d3ee]/80 uppercase tracking-wider block">Companion Name</label>
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    maxLength={14}
                    placeholder="E.g., Chip"
                    className="w-full bg-slate-950 border border-teal-500/20 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-400 font-mono"
                  />
                </div>

                {/* 2. Choose Avatar */}
                <div className="space-y-1">
                  <label className="text-[9px] font-mono font-bold text-[#22d3ee]/80 uppercase tracking-wider block font-black">Avatar Blueprint</label>
                  <div className="grid grid-cols-2 gap-2">
                    {avatarsList.map(a => (
                      <button
                        key={a.id}
                        type="button"
                        onClick={() => setTempAvatar(a.id)}
                        className={`flex items-center gap-2.5 p-2 rounded-xl text-left border cursor-pointer transition active:scale-97 ${
                          tempAvatar === a.id
                            ? 'border-teal-400 bg-teal-950/40 text-white shadow-[0_0_10px_rgba(20,184,166,0.1)]'
                            : 'border-zinc-800 bg-slate-950/20 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                        }`}
                      >
                        <div className="w-8 h-8 flex items-center justify-center bg-slate-950/30 border border-zinc-850 rounded-lg p-0.5 shrink-0">
                          <InternAvatar id={a.id} size="sm" />
                        </div>
                        <span className="text-[9px] font-bold truncate">{a.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Choose Personality */}
                <div className="space-y-1">
                  <label className="text-[9px] font-mono font-bold text-[#22d3ee]/80 uppercase tracking-wider block font-black">Personality Driver</label>
                  <div className="grid grid-cols-1 gap-1.5 max-h-36 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-teal-900 scrollbar-track-transparent">
                    {personalitiesList.map(p => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setTempPersonality(p.id)}
                        className={`w-full flex flex-col justify-center p-2 rounded-xl text-left border cursor-pointer transition active:scale-99 ${
                          tempPersonality === p.id
                            ? 'border-teal-400 bg-teal-950/45 text-white shadow-[0_0_10px_rgba(20,184,166,0.1)]'
                            : 'border-zinc-800 bg-slate-950/20 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                        }`}
                      >
                        <span className="text-[10px] font-black">{p.label}</span>
                        <span className="text-[8px] text-zinc-400 mt-0.5 leading-relaxed font-semibold">{p.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Save Block */}
                <div className="flex gap-2.5 pt-2 border-t border-teal-500/10">
                  <button
                    type="button"
                    onClick={handleSaveSettings}
                    className="flex-1 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-505 text-slate-950 text-xs font-black uppercase tracking-wider rounded-xl transition cursor-pointer flex items-center justify-center gap-1 active:scale-95 shadow-[0_0_15px_rgba(20,184,166,0.2)] border-none"
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" /> Re-program Core
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCustomizer(false)}
                    className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-semibold rounded-xl transition cursor-pointer active:scale-95 border border-zinc-800"
                  >
                    Cancel
                  </button>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showTutorial && (
          <AppTutorialOverlay 
            onClose={() => setShowTutorial(false)}
            internName={internName}
            internAvatar={internAvatar}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showExporter && (
          <BetaGuideExporter 
            userName={userName}
            internName={internName}
            internPersonality={internPersonality}
            lanceModeEnabled={!!lanceModeEnabled}
            onClose={() => setShowExporter(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
