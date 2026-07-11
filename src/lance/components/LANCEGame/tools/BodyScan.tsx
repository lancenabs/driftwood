import React, { useState, useEffect, useRef } from 'react';
import { NARRATOR } from '../narrator';
import { motion, AnimatePresence } from 'motion/react';

import { Volume2, VolumeX } from 'lucide-react';
import LanceAvatar from '../LanceAvatar';
import { useGame } from '../LANCEGameContext';
import { startAmbient, stopAmbient } from '../../../utils/ambientAudio';
import BigBackButton from '../BigBackButton';

const ZONES = [
  {
    id: 'scalp',
    label: 'Scalp & Top of Head',
    instruction: 'Bring your attention to the very top of your head. Notice any tingling, tension, or pressure. You don\'t need to change anything — just notice.',
    release: 'Breathe in slowly. As you exhale, let whatever you found there soften, even slightly.',
    svgY: 8,
    audio: '/bodyscan-audio/scalp.m4a',
  },
  {
    id: 'face',
    label: 'Face & Jaw',
    instruction: 'Scan your forehead, eyes, cheeks, and jaw. The jaw especially — notice if your teeth are slightly clenched. Notice without fixing.',
    release: 'Let your jaw drop just a fraction on the exhale. Let your eyes soften in their sockets.',
    svgY: 18,
    audio: '/bodyscan-audio/face.m4a',
  },
  {
    id: 'neck',
    label: 'Neck & Shoulders',
    instruction: 'This is where most humans store the weight of the day. Notice the back of your neck, your traps, the line between your shoulders.',
    release: 'On the exhale, imagine the shoulders dropping just slightly — like setting something heavy down.',
    svgY: 28,
    audio: '/bodyscan-audio/neck.m4a',
  },
  {
    id: 'chest',
    label: 'Chest & Heart',
    instruction: 'Notice your chest as it rises and falls. Is there tightness? Heaviness? Expansion? Feel the breath move through it.',
    release: 'Breathe into your chest intentionally. Let the exhale take something with it.',
    svgY: 38,
    audio: '/bodyscan-audio/chest.m4a',
  },
  {
    id: 'belly',
    label: 'Belly & Core',
    instruction: 'Notice your abdomen. Is it held in? Braced? Or soft? The belly holds anxiety — notice without judgment.',
    release: 'Let your belly soften completely on the exhale. No holding. No bracing.',
    svgY: 48,
    audio: '/bodyscan-audio/belly.m4a',
  },
  {
    id: 'arms',
    label: 'Arms & Hands',
    instruction: 'Travel down both arms — upper arms, elbows, forearms, wrists, hands, each finger. Notice any tingling, heaviness, or tension.',
    release: 'On the exhale, let your hands become completely heavy. Let them drop, even just a little.',
    svgY: 42,
    audio: '/bodyscan-audio/arms.m4a',
  },
  {
    id: 'lower_back',
    label: 'Lower Back & Hips',
    instruction: 'Notice your lower back — where you sit on it, where it curves. Notice your hips and where they contact the surface beneath you.',
    release: 'Breathe into your lower back. Let the exhale release the compression there.',
    svgY: 56,
    audio: '/bodyscan-audio/lower_back.m4a',
  },
  {
    id: 'legs',
    label: 'Thighs & Knees',
    instruction: 'Bring awareness to your thighs — whether they\'re crossed, pressed together, soft. Notice your knee joints.',
    release: 'Let your thighs relax completely. Notice what it feels like when the effort stops.',
    svgY: 68,
    audio: '/bodyscan-audio/legs.m4a',
  },
  {
    id: 'calves',
    label: 'Calves & Ankles',
    instruction: 'Notice your calves. Whether they\'re tense or already soft. Notice your ankles and the position of your feet.',
    release: 'Breathe into your legs. Let the exhale release any holding there.',
    svgY: 78,
    audio: '/bodyscan-audio/calves.m4a',
  },
  {
    id: 'feet',
    label: 'Feet & Toes',
    instruction: 'Finally, your feet. Notice where they contact the floor, or each other. Notice each toe. The body ends here — you are whole.',
    release: 'Take a full breath. As you exhale, feel gravity holding every part of you — head, chest, belly, hands, feet. You\'re here. You made it to the end.',
    svgY: 88,
    audio: '/bodyscan-audio/feet.m4a',
  },
];

const LANCE_COMPLETE = [
  "Body scan complete. Interoceptive awareness correlates with reduced anxiety, improved emotional regulation, and more accurate self-assessment. You've taken the reading. Good.",
  "Somatic data processed. The body stores what the mind bypasses. You attended to it. That's the correct sequence.",
  "Scan complete. Most humans operate entirely from the neck up. You just checked in with the whole system. I'll note the thoroughness.",
  "Filed. Completing a body scan requires sustained present-moment attention — which is the actual intervention. You didn't avoid it.",
];
const INTERN_COMPLETE = [
  "You just gave your whole body your full attention. That's not nothing — most of us spend years ignoring the signals our bodies send. You listened.",
  "From scalp to toes. You were with yourself the whole time. That's what a body scan is and you did it beautifully.",
  "Notice how you feel different than when you started? That's regulation happening in real time. Your nervous system is thanking you.",
  "I love watching people do body scans because you can almost see the tension leaving. You just did that for yourself. I'm proud of you.",
];

interface Props { onBack: () => void; onZoneComplete?: () => void; }

export default function BodyScan({ onBack, onZoneComplete }: Props) {
  const { intern, addXp } = useGame();
  const onZoneCompleteRef = useRef(onZoneComplete);
  useEffect(() => { onZoneCompleteRef.current = onZoneComplete; }, [onZoneComplete]);
  const [phase, setPhase] = useState<'intro' | 'scan' | 'done'>('intro');
  const [zoneIdx, setZoneIdx] = useState(0);
  const [scanStep, setScanStep] = useState<'notice' | 'release'>('notice');
  const [autoMode, setAutoMode] = useState(true);
  const [timeLeft, setTimeLeft] = useState(15);
  const [lanceIdx] = useState(() => Math.floor(Math.random() * LANCE_COMPLETE.length));
  const [internIdx] = useState(() => Math.floor(Math.random() * INTERN_COMPLETE.length));
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [voicePlaying, setVoicePlaying] = useState(false);

  const zone = ZONES[zoneIdx];
  const isLast = zoneIdx >= ZONES.length - 1;

  // Stop any playing narration whenever the zone changes or the tool exits
  useEffect(() => {
    audioRef.current?.pause();
    setVoicePlaying(false);
  }, [zoneIdx]);
  useEffect(() => () => audioRef.current?.pause(), []);

  const toggleVoice = () => {
    const el = audioRef.current;
    if (!el) return;
    if (voicePlaying) {
      el.pause();
      setVoicePlaying(false);
    } else {
      el.currentTime = 0;
      el.play();
      setVoicePlaying(true);
    }
  };

  // Ambient audio follows phase
  useEffect(() => {
    if (phase === 'scan') startAmbient('calm');
    else stopAmbient();
    return () => stopAmbient(800);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'scan' || !autoMode) return;
    setTimeLeft(scanStep === 'notice' ? 15 : 12);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          advanceAuto();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [zoneIdx, scanStep, phase, autoMode]);

  const advanceAuto = () => {
    if (scanStep === 'notice') {
      setScanStep('release');
    } else {
      setTimeout(() => onZoneCompleteRef.current?.(), 0);
      if (isLast) {
        addXp(30);
        setPhase('done');
      } else {
        setZoneIdx(i => i + 1);
        setScanStep('notice');
      }
    }
  };

  const advanceManual = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (scanStep === 'notice') {
      setScanStep('release');
    } else {
      onZoneCompleteRef.current?.();
      if (isLast) {
        addXp(30);
        setPhase('done');
      } else {
        setZoneIdx(i => i + 1);
        setScanStep('notice');
      }
    }
  };

  const progressPct = ((zoneIdx + (scanStep === 'release' ? 0.5 : 0)) / ZONES.length) * 100;

  return (
    <div className="relative flex flex-col h-full overflow-hidden" style={{ background: 'transparent', color: '#3C3C3C' }}>
      <div aria-hidden className="absolute inset-0" style={{
        backgroundImage: 'url(/region-heroes/somatic.webp)',
        backgroundSize: 'cover', backgroundPosition: 'center',
        filter: 'blur(20px)', transform: 'scale(1.1)', opacity: 0.35,
        zIndex: -1, pointerEvents: 'none',
      }} />
      <div aria-hidden className="absolute inset-0" style={{
        background: 'linear-gradient(180deg, rgba(247,248,250,0.9) 0%, rgba(247,248,250,0.94) 100%)',
        zIndex: -1, pointerEvents: 'none',
      }} />
      <div className="sticky top-0 z-10 px-4 pt-4 pb-3 flex items-center gap-3"
        style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.85)' }}>
        <BigBackButton onBack={onBack} />
        <img src="/icons/body_scan.webp" alt="" draggable={false}
          onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
          style={{ width: 34, height: 34, borderRadius: 10, boxShadow: '0 4px 10px rgba(6,182,212,0.4)' }} />
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-black truncate" style={{ color: '#3C3C3C' }}>Body Scan</h2>
          <p className="text-[10px] truncate" style={{ color: '#9CA3AF' }}>Crown to sole · Full somatic awareness</p>
        </div>
        <div className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: '#06b6d422', color: '#06b6d4' }}>+30 XP</div>
      </div>

      <div className="relative flex-1 overflow-y-auto px-4 py-4">
        <AnimatePresence mode="wait">

          {phase === 'intro' && (
            <motion.div key="intro" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="rounded-3xl p-5 border" style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: '#06b6d433' }}>
                <div className="flex items-start gap-3">
                  <LanceAvatar emotion="neutral" size="sm" />
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-wide mb-1" style={{ color: '#0891B2' }}>{NARRATOR.name} prepares you</p>
                    <p className="text-xs italic leading-relaxed" style={{ color: '#9CA3AF' }}>
                      "The body scan is a systematic somatic inventory. You will move attention through each region, notice what's present, and release tension with the breath. This takes approximately 5 minutes. No equipment required — only your attention."
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl p-5 border" style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: '#06b6d422' }}>
                <div className="text-4xl text-center mb-4">🌊</div>
                <p className="text-sm text-center leading-relaxed" style={{ color: '#9CA3AF' }}>
                  {ZONES.length} body zones · ~5 minutes · Sit comfortably or lie down
                </p>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black" style={{ color: '#3C3C3C' }}>Mode</span>
                    <div className="flex gap-2">
                      <button onClick={() => setAutoMode(true)}
                        className="px-3 py-1 rounded-full text-xs font-black transition-all"
                        style={{ background: autoMode ? '#06b6d422' : 'transparent', color: autoMode ? '#06b6d4' : '#9CA3AF', border: `1px solid ${autoMode ? '#06b6d4' : '#9CA3AF'}` }}>
                        Auto-advance
                      </button>
                      <button onClick={() => setAutoMode(false)}
                        className="px-3 py-1 rounded-full text-xs font-black transition-all"
                        style={{ background: !autoMode ? '#06b6d422' : 'transparent', color: !autoMode ? '#06b6d4' : '#9CA3AF', border: `1px solid ${!autoMode ? '#06b6d4' : '#9CA3AF'}` }}>
                        Manual tap
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <button onClick={() => setPhase('scan')} className="w-full py-4 rounded-2xl font-black text-sm"
                style={{ background: 'linear-gradient(135deg, #06b6d4, #0891b2)', color: '#fff' }}>
                Begin Scan →
              </button>
            </motion.div>
          )}

          {phase === 'scan' && (
            <motion.div key="scan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              {/* Progress */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px]" style={{ color: '#9CA3AF' }}>
                  <span>{zone.label}</span>
                  <span>{zoneIdx + 1}/{ZONES.length}</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#06b6d422' }}>
                  <motion.div className="h-full rounded-full" style={{ background: 'linear-gradient(90deg, #06b6d4, #3ECFCF)' }}
                    animate={{ width: `${progressPct}%` }} transition={{ duration: 0.4 }} />
                </div>
              </div>

              {/* Body silhouette — the traveling light band sweeps crown to sole,
                  leaving every zone it has visited softly lit */}
              <div className="flex justify-center">
                <svg viewBox="0 0 60 100" width="110" height="183" style={{ overflow: 'visible' }} aria-hidden>
                  <defs>
                    <linearGradient id="scanBand" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#06b6d4" stopOpacity="0" />
                      <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.45" />
                      <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                    </linearGradient>
                    <filter id="bandBlur" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="1.6" />
                    </filter>
                  </defs>
                  {/* Body outline — brighter now the light travels it */}
                  <ellipse cx="30" cy="10" rx="8" ry="9" fill="none" stroke="#0891B255" strokeWidth="1.5" />
                  <line x1="30" y1="19" x2="30" y2="55" stroke="#0891B255" strokeWidth="1.5" />
                  <line x1="30" y1="23" x2="15" y2="42" stroke="#0891B255" strokeWidth="1.5" />
                  <line x1="30" y1="23" x2="45" y2="42" stroke="#0891B255" strokeWidth="1.5" />
                  <line x1="30" y1="55" x2="20" y2="80" stroke="#0891B255" strokeWidth="1.5" />
                  <line x1="30" y1="55" x2="40" y2="80" stroke="#0891B255" strokeWidth="1.5" />
                  <line x1="20" y1="80" x2="18" y2="95" stroke="#0891B255" strokeWidth="1.5" />
                  <line x1="40" y1="80" x2="42" y2="95" stroke="#0891B255" strokeWidth="1.5" />
                  {/* Zones already visited stay softly lit */}
                  {ZONES.slice(0, zoneIdx).map(z => (
                    <circle key={z.id} cx="30" cy={z.svgY} r="3" fill="#7FD98C" opacity="0.55"
                      style={{ filter: 'drop-shadow(0 0 3px #7FD98C)' }} />
                  ))}
                  {/* The traveling light band */}
                  <motion.rect
                    x="4" width="52" height="14" rx="7"
                    fill="url(#scanBand)"
                    filter="url(#bandBlur)"
                    initial={false}
                    animate={{ y: zone.svgY - 7 }}
                    transition={{ type: 'spring', stiffness: 60, damping: 16 }}
                  />
                  {/* Current zone focus */}
                  <motion.circle
                    cx="30" cy={zone.svgY}
                    r={6}
                    fill="#06b6d444"
                    stroke="#06b6d4"
                    strokeWidth="1"
                    animate={{ r: [5, 7, 5], opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  />
                </svg>
              </div>

              {/* Zone instruction */}
              <AnimatePresence mode="wait">
                <motion.div key={`${zoneIdx}-${scanStep}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  className="rounded-3xl p-5 border"
                  style={{
                    background: scanStep === 'notice' ? '#ECFEFF' : '#FFFFFF',
                    borderColor: scanStep === 'notice' ? '#06b6d433' : '#7FD98C33',
                  }}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-[9px] font-black uppercase tracking-widest"
                      style={{ color: scanStep === 'notice' ? '#06b6d4' : '#7FD98C' }}>
                      {scanStep === 'notice' ? '👁 Notice' : '🌬 Release'}
                    </div>
                    <button
                      type="button"
                      onClick={toggleVoice}
                      className="flex items-center gap-1 px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-wider cursor-pointer"
                      style={{ background: voicePlaying ? '#06b6d422' : '#F3F4F6', color: voicePlaying ? '#06b6d4' : '#6B7280' }}
                    >
                      {voicePlaying ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                      {voicePlaying ? 'Stop' : 'Voice guide'}
                    </button>
                  </div>
                  <audio
                    ref={audioRef}
                    src={zone.audio}
                    onEnded={() => setVoicePlaying(false)}
                    className="hidden"
                  />
                  <p className="text-sm leading-relaxed" style={{ color: '#3C3C3C' }}>
                    {scanStep === 'notice' ? zone.instruction : zone.release}
                  </p>

                  {/* Auto timer bar */}
                  {autoMode && (
                    <div className="mt-4">
                      <div className="h-1 rounded-full overflow-hidden" style={{ background: '#9CA3AF' }}>
                        <motion.div className="h-full rounded-full"
                          style={{ background: scanStep === 'notice' ? '#06b6d4' : '#7FD98C' }}
                          animate={{ width: '0%' }}
                          initial={{ width: '100%' }}
                          transition={{ duration: scanStep === 'notice' ? 15 : 12, ease: 'linear' }}
                          key={`${zoneIdx}-${scanStep}`}
                        />
                      </div>
                      <div className="text-[9px] text-right mt-1 font-bold" style={{ color: '#9CA3AF99' }}>{timeLeft}s</div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {!autoMode && (
                <button onClick={advanceManual}
                  className="w-full py-4 rounded-2xl font-black text-sm"
                  style={{
                    background: isLast && scanStep === 'release'
                      ? 'linear-gradient(135deg, #06b6d4, #7FD98C)'
                      : `${scanStep === 'notice' ? '#06b6d4' : '#7FD98C'}22`,
                    color: isLast && scanStep === 'release' ? '#fff' : scanStep === 'notice' ? '#06b6d4' : '#7FD98C',
                    border: isLast && scanStep === 'release' ? 'none' : `1px solid ${scanStep === 'notice' ? '#06b6d444' : '#7FD98C44'}`,
                  }}>
                  {isLast && scanStep === 'release' ? 'Complete Scan ✓' : scanStep === 'notice' ? 'I noticed → Release' : 'Next Zone →'}
                </button>
              )}

              {autoMode && (
                <button onClick={advanceManual}
                  className="w-full py-2 text-xs font-bold"
                  style={{ color: '#9CA3AF99' }}>
                  Skip ahead →
                </button>
              )}
            </motion.div>
          )}

          {phase === 'done' && (
            <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
              <div className="rounded-3xl p-5 border text-center" style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: '#06b6d433' }}>
                <div className="text-5xl mb-2">🌊</div>
                <p className="text-xs font-black uppercase tracking-widest" style={{ color: '#06b6d4' }}>Body Scan Complete</p>
                <p className="text-xs mt-1" style={{ color: '#9CA3AF' }}>Crown to sole. You were present for all of it.</p>
                <div className="text-[10px] font-black mt-2" style={{ color: '#7FD98C' }}>+30 XP earned</div>
              </div>
              <div className="rounded-3xl p-5 border" style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: '#F0F0F0' }}>
                <div className="flex items-center gap-2 mb-3">
                  <LanceAvatar emotion="neutral" size="sm" />
                  <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: '#3ECFCF' }}>{NARRATOR.name} notes</span>
                </div>
                <p className="text-sm italic leading-relaxed" style={{ color: '#9CA3AF' }}>"{LANCE_COMPLETE[lanceIdx]}"</p>
              </div>
              <div className="rounded-3xl p-5 border" style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: '#7FD98C44' }}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">{intern.avatar}</span>
                  <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: '#7FD98C' }}>{intern.name || 'Intern'}</span>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: '#7FD98C' }}>{INTERN_COMPLETE[internIdx]}</p>
              </div>
              <button onClick={onBack} className="w-full py-4 rounded-2xl font-black text-sm"
                style={{ background: 'linear-gradient(135deg, #06b6d4, #7FD98C)', color: '#F9FAFB' }}>
                ← Back to Home
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
