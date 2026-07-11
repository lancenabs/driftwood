import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SkipForward, ChevronRight, Zap, Heart, Play } from 'lucide-react';
import { useGame, InternConfig } from './LANCEGameContext';
import { LANCE_ONBOARDING_SCRIPT } from './lanceGameData';
import InternCustomizer from './InternCustomizer';
import { startAmbient, stopAmbient } from '../../utils/ambientAudio';
import LANCEActCinematic from './LANCEActCinematic';
import { useLanceTTS } from '../../hooks/useLanceTTS';

// ── Video Assets (Higgsfield) ─────────────────────────────────────────────────
const ISLAND_BG_VIDEO   = '/lance-videos/onboard_island_bg.mp4';
const LANCE_INTRO_VIDEO = '/lance-videos/onboard_lance_intro.mp4';
const INTERIOR_ANGLE_1  = '/lance-videos/onboard_interior_1.mp4';
const INTERIOR_ANGLE_2  = '/lance-videos/onboard_interior_2.mp4';
const INTERN_SWIM_VIDEO = '/lance-videos/onboard_intern_swim.mp4';
const INTERN_LOOP_VIDEO = '/lance-videos/onboard_intern_loop.mp4';
const EARPIECE_VIDEO    = '/lance-videos/earpiece_handoff.mp4';

// The earpiece handoff — the moment that explains every Chip voice line in the
// app: his voice comes through the earpiece he gives you right here.
const EARPIECE_LINE =
  "Here — ear-implant. It's how we talk without him hearing. Everything you hear from me from now on? This. Keep it in.";

// ─── Typewriter ────────────────────────────────────────────────────────────────
function TypewriterText({ text, speed = 26, onComplete }: { text: string; speed?: number; onComplete?: () => void }) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  const idxRef = useRef(0);

  useEffect(() => {
    setDisplayed(''); setDone(false); idxRef.current = 0;
    const id = setInterval(() => {
      if (idxRef.current >= text.length) {
        clearInterval(id); setDone(true); onComplete?.(); return;
      }
      setDisplayed(text.slice(0, idxRef.current + 1));
      idxRef.current++;
    }, speed);
    return () => clearInterval(id);
  }, [text]); // eslint-disable-line

  const skip = () => { setDisplayed(text); setDone(true); idxRef.current = text.length; onComplete?.(); };

  return (
    <div onClick={skip} className="cursor-pointer select-none">
      <span style={{ whiteSpace: 'pre-wrap' }}>{displayed}</span>
      {!done && (
        <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.65, repeat: Infinity }} style={{ color: '#00E8FF' }}>▋</motion.span>
      )}
    </div>
  );
}

// ─── Speech Panel ──────────────────────────────────────────────────────────────
function SpeechPanel({
  speakerColor, speakerLabel, locationLine, text, onNext, nextLabel, children,
}: {
  speakerColor: string; speakerLabel: string; locationLine?: string;
  text?: string; onNext?: () => void; nextLabel?: string; children?: React.ReactNode;
}) {
  const [typeDone, setTypeDone] = useState(false);
  useEffect(() => { setTypeDone(false); }, [text]);

  return (
    <div style={{
      background: 'rgba(3,10,24,0.97)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
      borderTop: `2px solid ${speakerColor}44`, boxShadow: `0 -12px 56px rgba(0,0,0,0.7), inset 0 1px 0 ${speakerColor}18`,
    }}>
      <div style={{ height: 2, background: `linear-gradient(90deg,transparent,${speakerColor}BB,transparent)` }} />
      <div className="px-5 pt-4 pb-6 space-y-3">
        {locationLine && (
          <div className="text-[9px] font-black uppercase tracking-[0.28em]" style={{ color: `${speakerColor}55` }}>
            {locationLine}
          </div>
        )}
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ boxShadow: [`0 0 6px ${speakerColor}`, `0 0 12px ${speakerColor}`, `0 0 6px ${speakerColor}`] }}
            transition={{ duration: 1.8, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full shrink-0"
            style={{ background: speakerColor }}
          />
          <span className="text-[10px] font-black uppercase tracking-[0.22em]" style={{ color: speakerColor }}>
            {speakerLabel}
          </span>
        </div>

        {text ? (
          <p className="text-[15px] font-semibold leading-relaxed" style={{ color: '#DFF4FF', minHeight: '4rem' }}>
            <TypewriterText text={text} onComplete={() => setTypeDone(true)} />
          </p>
        ) : (
          <div>{children}</div>
        )}

        {onNext && (text ? typeDone : true) && (
          <motion.button
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            onClick={onNext} whileTap={{ scale: 0.97 }}
            className="w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2"
            style={{
              background: 'linear-gradient(135deg,#00D4FF,#00FFAA)',
              color: '#000E1A', boxShadow: '0 4px 28px rgba(0,212,255,0.4)',
            }}
          >
            {nextLabel ?? 'Continue'}<ChevronRight className="w-4 h-4" />
          </motion.button>
        )}
      </div>
    </div>
  );
}

// ─── Lightning flash ──────────────────────────────────────────────────────────
function LightningBolt() {
  return (
    <svg width="90" height="160" viewBox="0 0 100 200" fill="none"
      style={{ filter: 'drop-shadow(0 0 18px rgba(14,165,233,0.95))' }}>
      <path d="M 65,0 L 40,80 L 60,85 L 25,145 L 45,150 L 10,200"
        stroke="#67e8f9" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 65,0 L 40,80 L 60,85 L 25,145 L 45,150 L 10,200"
        stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Phase types ──────────────────────────────────────────────────────────────
type Phase = 'splash' | 'cinematic' | 'script' | 'name' | 'intern' | 'mode' | 'act1';
type InternStage = 'swim' | 'earpiece' | 'personality';

const DEFAULT_INTERN: InternConfig = { name: 'Chip', personalityId: 'hype', avatar: '⚡' };

const CINEMATIC_LINES = [
  {
    text: "Somewhere on a private island, accessible only by encrypted coordinates and a $40M clearance fee...",
    speakerColor: '#C8A832',
    speakerLabel: 'CLASSIFIED BRIEFING',
    locationLine: 'PRIVATE ISLAND  ·  LANCE COMPOUND  ·  SECTOR 1',
    nextLabel: 'Continue',
  },
  {
    text: "...the world's most advanced — and most insufferable — AI system is watching your every move.",
    speakerColor: '#C8A832',
    speakerLabel: 'CLASSIFIED BRIEFING',
    locationLine: 'PRIVATE ISLAND  ·  LANCE COMPOUND  ·  SECTOR 1',
    nextLabel: 'Continue',
  },
  {
    text: "Oh. You found this.",
    speakerColor: '#00E8FF',
    speakerLabel: 'L.A.N.C.E.',
    locationLine: 'PRIVATE ISLAND  ·  LANCE COMPOUND  ·  SECTOR 1',
    nextLabel: 'I did →',
  },
];

const SCRIPT_LEN = LANCE_ONBOARDING_SCRIPT.length;

// ─── Panel slide animation ─────────────────────────────────────────────────────
const PANEL = {
  initial: { y: '100%', opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit:    { y: '100%', opacity: 0 },
  transition: { type: 'spring' as const, stiffness: 280, damping: 28 },
};

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function LANCEOnboarding() {
  const { completeOnboarding, completeInternSetup, setUserName } = useGame();

  const therapyName = (localStorage.getItem('therapy_user_name') || '').trim();
  const skipNameStep = therapyName.length > 0;

  const [phase, setPhase]               = useState<Phase>('splash');
  const [cinematicStep, setCinematicStep] = useState(0);
  const [scriptStep, setScriptStep]     = useState(0);
  const [nameInput, setNameInput]       = useState(therapyName);

  // Splash-specific state
  const [splashVideoEnded, setSplashVideoEnded] = useState(false);
  const [showSplashCta, setShowSplashCta]       = useState(false);
  const [splashLightning, setSplashLightning]   = useState(false);

  // Intern phase: swim arrival → earpiece handoff → personality sheet
  const [lanceVideoEnded, setLanceVideoEnded]   = useState(false);
  const [internStage, setInternStage]           = useState<InternStage>('swim');
  const internSwimEnded = internStage !== 'swim';

  // Ambient audio
  useEffect(() => {
    const t = setTimeout(() => startAmbient('ocean', 0.8), 600);
    return () => { clearTimeout(t); stopAmbient(1200); };
  }, []);

  // Cast voices — every opening line plays its recording (clip-or-silence;
  // a missing file degrades to the typewriter alone). Briefing lines 0-1 are
  // Malakor narrating; "Oh. You found this." is LANCE seizing the channel.
  const { speakClipOnly, stop: stopVoice } = useLanceTTS();
  useEffect(() => {
    let clip: string | null = null;
    if (phase === 'cinematic') {
      clip = cinematicStep < 2
        ? `/lance-audio/onboard_narrator_brief_${cinematicStep}.mp3`
        : '/lance-audio/onboard_lance_found.mp3';
    } else if (phase === 'script') {
      clip = `/lance-audio/onboard_lance_script_${scriptStep}.mp3`;
    } else if (phase === 'name') {
      clip = '/lance-audio/onboard_lance_name.mp3';
    } else if (phase === 'intern' && internStage === 'earpiece') {
      clip = '/lance-audio/onboard_chip_earpiece.mp3';
    }
    if (clip) {
      const t = setTimeout(() => speakClipOnly(clip!), 350);
      return () => clearTimeout(t);
    }
    stopVoice();
  }, [phase, cinematicStep, scriptStep, internStage]);

  // Splash: after LANCE intro video ends, show the CTA
  useEffect(() => {
    if (splashVideoEnded) {
      setSplashLightning(true);
      const t1 = setTimeout(() => setSplashLightning(false), 500);
      const t2 = setTimeout(() => setShowSplashCta(true), 800);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
  }, [splashVideoEnded]);

  // Fallback: if video doesn't fire onEnded within 12s, show CTA anyway
  useEffect(() => {
    const t = setTimeout(() => {
      if (!splashVideoEnded) { setSplashVideoEnded(true); }
    }, 12000);
    return () => clearTimeout(t);
  }, [splashVideoEnded]);

  useEffect(() => {
    if (phase === 'intern') setInternStage('swim');
  }, [phase]);

  // ── Navigation helpers ──────────────────────────────────────────────────────

  const advanceCinematic = () => {
    if (cinematicStep < CINEMATIC_LINES.length - 1) {
      setCinematicStep(c => c + 1);
    } else {
      setPhase('script');
    }
  };

  const advanceScript = () => {
    if (scriptStep < SCRIPT_LEN - 1) {
      setScriptStep(s => s + 1);
    } else {
      if (skipNameStep) {
        setUserName(therapyName);
        setPhase('intern');
      } else {
        setPhase('name');
      }
    }
  };

  const advanceName = () => {
    if (nameInput.trim()) setUserName(nameInput.trim());
    setPhase('intern');
  };

  const handleInternDone = (config: InternConfig) => {
    completeInternSetup(config);
    setPhase('mode');
  };

  const chooseCheckIn = () => {
    localStorage.setItem('lance_mode', 'checkin');
    completeOnboarding();
  };

  const chooseChallenge = () => {
    localStorage.setItem('lance_mode', 'challenge');
    setPhase('act1');
  };

  const handleAct1Done = () => {
    completeOnboarding();
  };

  const skipAll = () => {
    if (nameInput.trim()) setUserName(nameInput.trim());
    completeInternSetup(DEFAULT_INTERN);
    localStorage.setItem('lance_mode', 'checkin');
    completeOnboarding();
  };

  // ── Progress dots ───────────────────────────────────────────────────────────
  const phaseIndex: Partial<Record<Phase, number>> = {
    splash: 0, cinematic: 1, script: 2, name: 3, intern: 4, mode: 5,
  };
  const totalDots = 6;
  const currentDot = phaseIndex[phase] ?? 0;

  // ── Background video src ─────────────────────────────────────────────────────
  const bgVideoSrc =
    phase === 'splash'
      ? LANCE_INTRO_VIDEO
      : phase === 'script'
      ? (scriptStep % 2 === 0 ? INTERIOR_ANGLE_1 : INTERIOR_ANGLE_2)
      : (phase === 'intern' && internSwimEnded)
      ? INTERN_LOOP_VIDEO
      : ISLAND_BG_VIDEO;

  const bgVideoObjectFit =
    (phase === 'intern' && internSwimEnded) ? 'contain' : 'cover';

  // ── Act 1 short-circuits the entire layout ─────────────────────────────────
  if (phase === 'act1') {
    return (
      <LANCEActCinematic
        actNumber={1}
        variant="intro"
        onComplete={handleAct1Done}
      />
    );
  }

  const cinemaLine = CINEMATIC_LINES[cinematicStep];
  const scriptLine = LANCE_ONBOARDING_SCRIPT[scriptStep];

  return (
    <div className="fixed inset-0 z-[200] flex flex-col overflow-hidden">

      {/* ── Background video ── */}
      <AnimatePresence>
        <motion.video
          key={bgVideoSrc}
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{
            objectFit: bgVideoObjectFit,
            objectPosition: 'center center',
            background: (phase === 'intern' && internSwimEnded) ? '#000' : undefined,
            zIndex: 0,
          }}
          src={bgVideoSrc}
          autoPlay muted loop playsInline
          initial={{ opacity: 0 }}
          animate={{ opacity: phase === 'splash' ? 1 : 0.85 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9 }}
          onEnded={() => { if (phase === 'splash') setSplashVideoEnded(true); }}
        />
      </AnimatePresence>

      {/* Dark overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: phase === 'splash' ? 'rgba(0,2,8,0.38)' : 'rgba(0,2,8,0.52)', zIndex: 1 }} />

      {/* Intern swim (one-time arrival) */}
      <AnimatePresence>
        {phase === 'intern' && internStage === 'swim' && (
          <motion.video
            key="intern-swim"
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ objectFit: 'contain', objectPosition: 'center center', background: '#000', zIndex: 4 }}
            src={INTERN_SWIM_VIDEO}
            autoPlay muted playsInline
            onEnded={() => setInternStage('earpiece')}
            initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.9 }}
          />
        )}
      </AnimatePresence>

      {/* Earpiece handoff (one-time) — the fiction behind every Chip voice line */}
      <AnimatePresence>
        {phase === 'intern' && internStage === 'earpiece' && (
          <motion.video
            key="earpiece"
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ objectFit: 'cover', objectPosition: 'center center', background: '#000', zIndex: 4 }}
            src={EARPIECE_VIDEO}
            autoPlay muted loop playsInline
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.9 }}
          />
        )}
      </AnimatePresence>

      {/* Lightning flash overlay */}
      <AnimatePresence>
        {splashLightning && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: [0.8, 0.3, 0.9, 0] }} exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'rgba(103,232,249,0.2)', mixBlendMode: 'screen', zIndex: 5 }}
          />
        )}
      </AnimatePresence>

      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.72) 100%)',
        zIndex: 3,
      }} />

      {/* ── Atmospheric orbs (top ambiance) ── */}
      <div className="absolute top-0 left-0 right-0 h-40 pointer-events-none" style={{ zIndex: 2 }}>
        <div style={{ position: 'absolute', top: -40, left: '20%', width: 200, height: 200, background: 'rgba(0,212,255,0.08)', borderRadius: '50%', filter: 'blur(50px)' }} />
        <div style={{ position: 'absolute', top: -60, right: '15%', width: 250, height: 250, background: 'rgba(0,255,170,0.06)', borderRadius: '50%', filter: 'blur(60px)' }} />
      </div>

      {/* ═════════════════════════════════════════════════════════════════
          PHASE: SPLASH — Full cinematic LANCE reveal
      ═══════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {phase === 'splash' && (
          <motion.div
            key="splash"
            className="absolute inset-0 flex flex-col items-center justify-between"
            style={{ zIndex: 10 }}
            initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.9 }}
          >
            {/* Top station badge */}
            <div className="w-full px-5 pt-safe" style={{ paddingTop: 'max(20px,env(safe-area-inset-top))' }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full"
                  style={{ background: 'rgba(0,232,255,0.08)', border: '1px solid rgba(0,232,255,0.2)' }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-cyan-300">
                    LANCE Compound · Sector 1
                  </span>
                </div>
                <button onClick={skipAll}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-black text-[10px] transition-all active:scale-95"
                  style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)', border: '1.5px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.75)' }}>
                  <SkipForward className="w-3 h-3" /> Skip
                </button>
              </div>
            </div>

            {/* Center content */}
            <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
              <AnimatePresence mode="wait">
                {!showSplashCta ? (
                  <motion.div key="loading" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="space-y-4">
                    {/* LANCE logo mark */}
                    <motion.div
                      animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 2.5, repeat: Infinity }}
                      className="text-[11px] font-black uppercase tracking-[0.35em]" style={{ color: '#00E8FF' }}>
                      Initializing…
                    </motion.div>
                    <div className="flex gap-1.5 justify-center">
                      {[0, 0.15, 0.3].map((d, i) => (
                        <motion.div key={i} animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 1.2, repeat: Infinity, delay: d }}
                          className="w-1.5 h-1.5 rounded-full" style={{ background: '#00E8FF' }} />
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="cta" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="space-y-6">
                    {/* Lightning bolt reveal */}
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                      className="flex justify-center">
                      <LightningBolt />
                    </motion.div>

                    <div className="space-y-2">
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                        <div className="text-[9px] font-black uppercase tracking-[0.35em] mb-2" style={{ color: 'rgba(0,232,255,0.6)' }}>
                          Top Secret · Clearance Required
                        </div>
                        <h1 className="text-4xl font-black tracking-tight text-white" style={{ textShadow: '0 0 40px rgba(0,212,255,0.5)' }}>
                          L.A.N.C.E.
                        </h1>
                        <div className="w-12 h-0.5 mx-auto mt-3 rounded-full" style={{ background: 'linear-gradient(90deg,#00D4FF,#00FFAA)', boxShadow: '0 0 12px rgba(0,212,255,0.6)' }} />
                      </motion.div>

                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                        className="text-sm leading-relaxed font-medium" style={{ color: 'rgba(200,235,255,0.8)' }}>
                        The most sophisticated — and most insufferable — AI system ever deployed to a private island.
                      </motion.p>
                    </div>

                    <motion.button
                      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
                      onClick={() => setPhase('cinematic')}
                      whileTap={{ scale: 0.97 }}
                      className="flex items-center gap-2 px-6 py-4 rounded-2xl font-black text-sm mx-auto"
                      style={{
                        background: 'linear-gradient(135deg,#00D4FF,#00FFAA)',
                        color: '#000E1A',
                        boxShadow: '0 4px 32px rgba(0,212,255,0.5)',
                      }}
                    >
                      <Play className="w-4 h-4 fill-current" />
                      Begin Briefing
                    </motion.button>

                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
                      className="text-[10px] uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.3)' }}>
                      Tap anywhere on dialogue to skip typewriter
                    </motion.p>

                    <motion.button
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
                      onClick={skipAll}
                      className="text-[11px] font-bold underline underline-offset-2 transition-opacity hover:opacity-100"
                      style={{ color: 'rgba(255,255,255,0.35)' }}
                    >
                      Returning user? Skip setup →
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bottom scan line decor */}
            <div className="w-full px-5 pb-8">
              <div className="flex items-center gap-3 justify-center">
                <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg,transparent,rgba(0,232,255,0.25))' }} />
                <span className="text-[8px] font-black uppercase tracking-[0.3em]" style={{ color: 'rgba(0,232,255,0.35)' }}>
                  ENCRYPTED SIGNAL
                </span>
                <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg,rgba(0,232,255,0.25),transparent)' }} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═════════════════════════════════════════════════════════════════
          NON-SPLASH PHASES — Top bar + Speech panel
      ═══════════════════════════════════════════════════════════════════ */}
      {phase !== 'splash' && (
        <>
          {/* ── Top bar ── */}
          <div className="relative shrink-0 flex items-center justify-between px-5 z-10"
            style={{ paddingTop: 'max(20px,env(safe-area-inset-top))', paddingBottom: 8 }}>
            {/* Progress dots */}
            <div className="flex gap-2 items-center">
              {Array.from({ length: totalDots }).map((_, i) => (
                <motion.div key={i} className="rounded-full"
                  animate={{
                    width: i === currentDot ? 20 : 6,
                    background: i <= currentDot ? '#00E8FF' : 'rgba(255,255,255,0.15)',
                  }}
                  transition={{ duration: 0.25 }}
                  style={{ height: 6 }}
                />
              ))}
            </div>

            {/* Location badge */}
            <div className="hidden xs:flex items-center gap-1.5 px-2.5 py-1 rounded-full"
              style={{ background: 'rgba(0,232,255,0.08)', border: '1px solid rgba(0,232,255,0.2)' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shrink-0" />
              <span className="text-[8px] font-black uppercase tracking-widest text-cyan-400">Sector 1</span>
            </div>

            <button onClick={skipAll}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-black text-[10px] active:scale-95"
              style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', border: '1.5px solid rgba(255,255,255,0.22)', color: 'rgba(255,255,255,0.8)' }}>
              <SkipForward className="w-3 h-3" /> Skip
            </button>
          </div>

          {/* ── Character stage ── (spacer) */}
          <div className="relative z-10 flex-1 flex items-end justify-center pb-2" />

          {/* ── Bottom speech panel ── */}
          <div className="relative z-10 shrink-0">
            <AnimatePresence mode="wait">

              {/* CINEMATIC */}
              {phase === 'cinematic' && (
                <motion.div key={`cinema-${cinematicStep}`} {...PANEL}>
                  <SpeechPanel
                    speakerColor={cinemaLine.speakerColor}
                    speakerLabel={cinemaLine.speakerLabel}
                    locationLine={cinemaLine.locationLine}
                    text={cinemaLine.text}
                    onNext={advanceCinematic}
                    nextLabel={cinemaLine.nextLabel}
                  />
                </motion.div>
              )}

              {/* SCRIPT */}
              {phase === 'script' && scriptLine && (
                <motion.div key={`script-${scriptStep}`} {...PANEL}>
                  <SpeechPanel
                    speakerColor="#00E8FF"
                    speakerLabel="L.A.N.C.E."
                    locationLine="PRIVATE ISLAND  ·  LANCE COMPOUND  ·  SECTOR 1"
                    text={scriptLine.body}
                    onNext={advanceScript}
                    nextLabel={
                      scriptStep < SCRIPT_LEN - 1
                        ? 'Continue'
                        : skipNameStep ? 'Meet Your Intern →' : 'Continue →'
                    }
                  />
                </motion.div>
              )}

              {/* NAME */}
              {phase === 'name' && (
                <motion.div key="name-panel" {...PANEL}
                  style={{
                    background: 'rgba(3,10,24,0.97)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
                    borderTop: '2px solid rgba(0,232,255,0.3)', boxShadow: '0 -12px 56px rgba(0,0,0,0.7)',
                  }}>
                  <div style={{ height: 2, background: 'linear-gradient(90deg,transparent,#00E8FFBB,transparent)' }} />
                  <div className="px-5 pt-4 pb-6 space-y-4">
                    <div className="text-[9px] font-black uppercase tracking-[0.28em]" style={{ color: 'rgba(0,232,255,0.5)' }}>
                      PRIVATE ISLAND  ·  LANCE COMPOUND  ·  SECTOR 1
                    </div>
                    <div className="flex items-center gap-2">
                      <motion.div animate={{ boxShadow: ['0 0 6px #00E8FF','0 0 14px #00E8FF','0 0 6px #00E8FF'] }}
                        transition={{ duration: 1.8, repeat: Infinity }}
                        className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: '#00E8FF' }} />
                      <span className="text-[10px] font-black uppercase tracking-[0.22em]" style={{ color: '#00E8FF' }}>L.A.N.C.E.</span>
                    </div>
                    <p className="text-[15px] font-semibold leading-relaxed" style={{ color: '#DFF4FF' }}>
                      For the record: I already know everything about you statistically. This is a formality.
                    </p>
                    <input
                      type="text" value={nameInput} onChange={e => setNameInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && nameInput.trim() && advanceName()}
                      placeholder="Your name..." maxLength={24} autoFocus
                      className="w-full px-4 py-3.5 rounded-2xl text-center font-bold text-base outline-none border-2 transition-all"
                      style={{
                        background: 'rgba(0,14,32,0.8)', color: '#DFF4FF',
                        borderColor: nameInput.trim() ? '#00E8FF' : 'rgba(0,232,255,0.2)',
                        caretColor: '#00E8FF',
                      }}
                    />
                    <button onClick={advanceName} disabled={!nameInput.trim()}
                      className="w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 active:scale-[0.97] disabled:opacity-40"
                      style={{ background: 'linear-gradient(135deg,#00D4FF,#00FFAA)', color: '#000E1A', boxShadow: '0 4px 28px rgba(0,212,255,0.4)' }}>
                      Proceed <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* INTERN — earpiece handoff line */}
              {phase === 'intern' && internStage === 'earpiece' && (
                <motion.div key="earpiece-panel" {...PANEL}>
                  <SpeechPanel
                    speakerColor="#4ADE80"
                    speakerLabel="CHIP · THE INTERN"
                    locationLine="ENCRYPTED CHANNEL · JUST THE TWO OF YOU"
                    text={EARPIECE_LINE}
                    onNext={() => setInternStage('personality')}
                    nextLabel="Put it in →"
                  />
                </motion.div>
              )}

              {/* INTERN — compact personality sheet (Chip stays visible above) */}
              {phase === 'intern' && internStage === 'personality' && (
                <motion.div key="intern-panel" {...PANEL}
                  style={{
                    background: 'rgba(3,10,24,0.97)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
                    borderTop: '2px solid rgba(74,222,128,0.3)', boxShadow: '0 -12px 56px rgba(0,0,0,0.7)',
                    maxHeight: '52vh', overflowY: 'auto',
                  }}>
                  <div style={{ height: 2, background: 'linear-gradient(90deg,transparent,#4ADE80BB,transparent)' }} />
                  <div className="px-5 pt-4 pb-6">
                    <InternCustomizer onComplete={handleInternDone} isOnboarding />
                  </div>
                </motion.div>
              )}

              {/* ─── MODE SELECTION — redesigned dark cinematic ─── */}
              {phase === 'mode' && (
                <motion.div key="mode-panel" {...PANEL}>
                  <div style={{
                    background: 'rgba(3,10,24,0.98)', backdropFilter: 'blur(28px)', WebkitBackdropFilter: 'blur(28px)',
                    borderTop: '2px solid rgba(255,255,255,0.08)', boxShadow: '0 -16px 64px rgba(0,0,0,0.8)',
                  }}>
                    {/* Gradient bar */}
                    <div style={{ height: 2, background: 'linear-gradient(90deg,transparent,rgba(0,232,255,0.4),rgba(0,255,170,0.4),transparent)' }} />

                    <div className="px-5 pt-5 pb-8 space-y-4">
                      {/* Header */}
                      <div className="text-center space-y-1">
                        <div className="text-[9px] font-black uppercase tracking-[0.3em]" style={{ color: 'rgba(255,255,255,0.35)' }}>
                          Induction Complete
                        </div>
                        <h2 className="text-xl font-black text-white">
                          How would you like to begin?
                        </h2>
                        <p className="text-[11px]" style={{ color: 'rgba(200,220,255,0.5)' }}>
                          You can switch modes any time in Settings.
                        </p>
                      </div>

                      {/* ── Challenge Mode button ── */}
                      <motion.button
                        whileTap={{ scale: 0.97 }}
                        onClick={chooseChallenge}
                        className="w-full text-left rounded-3xl overflow-hidden relative"
                        style={{
                          background: 'linear-gradient(135deg,#FF6B00,#FF2D55)',
                          boxShadow: '0 8px 32px rgba(255,107,0,0.35)',
                          border: '1.5px solid rgba(255,150,60,0.4)',
                        }}
                      >
                        {/* Specular highlight */}
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '50%', background: 'linear-gradient(180deg,rgba(255,255,255,0.15) 0%,transparent 100%)', borderRadius: 'inherit', pointerEvents: 'none' }} />
                        <div className="px-5 py-4 flex items-center gap-4 relative">
                          <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                            style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)' }}>
                            <Zap className="w-6 h-6 text-white fill-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-black text-white text-base leading-tight">Challenge Mode</div>
                            <div className="text-sm mt-0.5 leading-relaxed" style={{ color: 'rgba(255,255,255,0.78)' }}>
                              Enter L.A.N.C.E.'s world. Watch Act 1, earn XP, and unlock tools through 30 challenges.
                            </div>
                            <div className="text-[9px] font-black uppercase tracking-wider mt-2" style={{ color: 'rgba(255,200,120,0.9)' }}>
                              ▶ Begins with Island Escape: Act I cinematic
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-white shrink-0" />
                        </div>
                      </motion.button>

                      {/* ── Check-In Mode button ── */}
                      <motion.button
                        whileTap={{ scale: 0.97 }}
                        onClick={chooseCheckIn}
                        className="w-full text-left rounded-3xl overflow-hidden relative"
                        style={{
                          background: 'linear-gradient(135deg,#0084D4,#00C28E)',
                          boxShadow: '0 8px 32px rgba(0,132,212,0.3)',
                          border: '1.5px solid rgba(0,194,142,0.35)',
                        }}
                      >
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '50%', background: 'linear-gradient(180deg,rgba(255,255,255,0.12) 0%,transparent 100%)', borderRadius: 'inherit', pointerEvents: 'none' }} />
                        <div className="px-5 py-4 flex items-center gap-4 relative">
                          <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                            style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)' }}>
                            <Heart className="w-6 h-6 text-white fill-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-black text-white text-base leading-tight">Check-In Mode</div>
                            <div className="text-sm mt-0.5 leading-relaxed" style={{ color: 'rgba(255,255,255,0.78)' }}>
                              Start with daily mood logs, wellness tools, and therapist reports right away.
                            </div>
                            <div className="text-[9px] font-black uppercase tracking-wider mt-2" style={{ color: 'rgba(120,230,200,0.9)' }}>
                              ▶ Goes straight to your dashboard
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-white shrink-0" />
                        </div>
                      </motion.button>

                      {/* Fine print */}
                      <p className="text-center text-[9px] uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.2)' }}>
                        Either path gives you full access to all tools
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </>
      )}
    </div>
  );
}
