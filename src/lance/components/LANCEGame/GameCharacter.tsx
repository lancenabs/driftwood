// ─── Character pose paths ─────────────────────────────────────────────────────
// THE SHORE'S CAST (narrator seam): the island's pose art never sailed with the
// vendored library — /lance_extract/ and /new_intern/ don't exist here, so
// every CoachCard rendered a broken image. On this ship the first voice is
// the Workshop shipmate and the second is Buddy the Rememberer. Pose variety
// returns when Lance's generated poses land (ASSET_PROMPTS wishlist).
export const LANCE_POSES: CharacterPosePaths = {
  idle:        '/robots/skip.webp',
  talking:     '/robots/skip.webp',
  smug:        '/robots/skip.webp',
  thinking:    '/robots/skip.webp',
  shocked:     '/robots/skip.webp',
  approving:   '/robots/skip.webp',
  celebrating: '/robots/skip.webp',
  annoyed:     '/robots/skip.webp',
  entrance:    '/robots/skip.webp',
  pointing:    '/robots/skip.webp',
};

export const INTERN_POSES: CharacterPosePaths = {
  idle:        '/robots/collier.webp',
  talking:     '/robots/collier.webp',
  celebrating: '/robots/collier.webp',
  approving:   '/robots/collier.webp',
  wave:        '/robots/collier.webp',
  shocked:     '/robots/collier.webp',
  entrance:    '/robots/collier.webp',
};
import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation, AnimatePresence } from 'motion/react';

// ─── Types ─────────────────────────────────────────────────────────────────

export type CharacterState =
  | 'entrance'      // spring-bounces onto screen
  | 'idle'          // gentle float loop
  | 'talking'       // mouth alternates open/closed
  | 'celebrating'   // big bounce + confetti burst
  | 'thinking'      // slow float, head tilt
  | 'annoyed'       // horizontal shake
  | 'shocked'       // recoil, wide eyes
  | 'approving'     // warm, slight positive lean
  | 'wave'          // friendly wave (intern only)
  | 'exit';         // slides off screen downward

export type CharacterType = 'lance' | 'intern';

export interface CharacterPoses {
  idle?: string;
  talking?: string;
  celebrating?: string;
  thinking?: string;
  annoyed?: string;
  shocked?: string;
  approving?: string;
}

// Extended pose map (includes entrance / bonus poses)
export interface CharacterPosePaths extends CharacterPoses {
  smug?: string;
  entrance?: string;
  pointing?: string;
  wave?: string;
}

interface Props {
  character?: CharacterType;
  state?: CharacterState;
  poses?: CharacterPoses;
  /** Width in px — height is auto at 2:3 ratio */
  size?: number;
  /** Current act's primary color (for glow/eyes) */
  primaryColor?: string;
  onEntranceComplete?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

// ─── LANCE Expression Config ────────────────────────────────────────────────
// All paths are for the 200×300 viewBox LANCE SVG.
// Head occupies y=4–126, eyes at y=40–74, mouth at y=96–116.

interface ExpressionConfig {
  leftBrow: string;
  rightBrow: string;
  eyeScaleY: number;    // <1 squint, >1 wide
  mouthClosed: string;
  mouthOpen: string;
}

const LANCE_EXPR: Record<string, ExpressionConfig> = {
  idle: {
    leftBrow:    'M 44 35 L 80 39',
    rightBrow:   'M 120 39 L 156 35',
    eyeScaleY:   1,
    mouthClosed: 'M 58 100 Q 100 111 142 97',
    mouthOpen:   'M 56 100 Q 100 118 144 96',
  },
  smug: {
    leftBrow:    'M 44 39 L 80 43',
    rightBrow:   'M 120 33 L 156 29',
    eyeScaleY:   0.78,
    mouthClosed: 'M 58 98 Q 100 113 142 91',
    mouthOpen:   'M 56 98 Q 100 120 144 90',
  },
  annoyed: {
    leftBrow:    'M 44 37 L 80 30',
    rightBrow:   'M 120 30 L 156 37',
    eyeScaleY:   0.88,
    mouthClosed: 'M 60 104 Q 100 95 140 104',
    mouthOpen:   'M 58 104 Q 100 97 142 104',
  },
  shocked: {
    leftBrow:    'M 44 27 L 80 31',
    rightBrow:   'M 120 31 L 156 27',
    eyeScaleY:   1.28,
    mouthClosed: 'M 76 100 Q 100 117 124 100',
    mouthOpen:   'M 72 99 Q 100 122 128 99',
  },
  approving: {
    leftBrow:    'M 44 36 L 80 39',
    rightBrow:   'M 120 39 L 156 36',
    eyeScaleY:   1,
    mouthClosed: 'M 60 100 Q 100 110 140 99',
    mouthOpen:   'M 58 100 Q 100 115 142 98',
  },
  thinking: {
    leftBrow:    'M 44 33 L 80 37',
    rightBrow:   'M 120 31 L 156 28',
    eyeScaleY:   0.94,
    mouthClosed: 'M 62 101 Q 100 107 138 102',
    mouthOpen:   'M 60 101 Q 100 112 140 102',
  },
};

// Maps CharacterState → which expression to use
function lanceExprKey(state: CharacterState): string {
  const map: Partial<Record<CharacterState, string>> = {
    idle:       'idle',
    entrance:   'smug',
    talking:    'idle',
    celebrating:'approving',
    thinking:   'thinking',
    annoyed:    'annoyed',
    shocked:    'shocked',
    approving:  'approving',
    exit:       'idle',
  };
  return map[state] ?? 'idle';
}

// ─── LANCE SVG Character ──────────────────────────────────────────────────────
// Full-body cartoon villain. viewBox 0 0 200 300.
function LanceSVG({ state, primaryColor }: { state: CharacterState; primaryColor: string }) {
  const [mouthOpen, setMouthOpen] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (state === 'talking') {
      intervalRef.current = setInterval(() => setMouthOpen(v => !v), 210);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setMouthOpen(false);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [state]);

  const expr = LANCE_EXPR[lanceExprKey(state)] ?? LANCE_EXPR.idle;
  const c = primaryColor;
  const dark = '#07100E';
  const darkMid = '#0D1A18';
  const stroke = 2.5;

  return (
    <svg viewBox="0 0 200 300" style={{ overflow: 'visible', display: 'block', width: '100%', height: '100%' }}>
      {/* ── SHADOW under feet ── */}
      <ellipse cx="100" cy="295" rx="55" ry="6" fill="rgba(0,0,0,0.25)" />

      {/* ── FEET ── */}
      <rect x="47" y="264" width="52" height="26" rx="14"
        fill={dark} stroke={c} strokeWidth={stroke} />
      <rect x="101" y="264" width="52" height="26" rx="14"
        fill={dark} stroke={c} strokeWidth={stroke} />

      {/* ── LEGS ── */}
      <rect x="61" y="218" width="36" height="52" rx="16"
        fill={darkMid} stroke={c} strokeWidth={stroke} />
      <rect x="103" y="218" width="36" height="52" rx="16"
        fill={darkMid} stroke={c} strokeWidth={stroke} />

      {/* ── BODY / SUIT ── */}
      <rect x="43" y="135" width="114" height="92" rx="24"
        fill={dark} stroke={c} strokeWidth={stroke} />

      {/* Lapels */}
      <path d="M 90 139 L 76 172" stroke={`${c}66`} strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M 110 139 L 124 172" stroke={`${c}66`} strokeWidth="2" fill="none" strokeLinecap="round" />

      {/* Tie (acts as a pop of color between lapels) */}
      <path d="M 91 141 L 100 168 L 109 141 Z"
        fill={`${c}30`} stroke={`${c}77`} strokeWidth="1.5" strokeLinejoin="round" />

      {/* Chest badge */}
      <rect x="84" y="176" width="32" height="14" rx="5"
        fill={`${c}14`} stroke={`${c}44`} strokeWidth="1" />
      <text x="100" y="186.5" textAnchor="middle" fontSize="5" fontFamily="monospace"
        fontWeight="900" fill={`${c}88`} letterSpacing="0.5">L.A.N.C.E.</text>

      {/* Circuit details on suit */}
      <path d="M 55 155 L 78 155" stroke={`${c}28`} strokeWidth="1" strokeLinecap="round" />
      <path d="M 122 155 L 145 155" stroke={`${c}28`} strokeWidth="1" strokeLinecap="round" />
      <path d="M 55 168 L 70 168" stroke={`${c}20`} strokeWidth="1" strokeLinecap="round" />
      <path d="M 130 168 L 145 168" stroke={`${c}20`} strokeWidth="1" strokeLinecap="round" />

      {/* ── ARMS ── */}
      <rect x="12" y="146" width="34" height="70" rx="16"
        fill={darkMid} stroke={c} strokeWidth={stroke} />
      <rect x="154" y="146" width="34" height="70" rx="16"
        fill={darkMid} stroke={c} strokeWidth={stroke} />

      {/* Hands */}
      <circle cx="29" cy="228" r="19" fill={dark} stroke={c} strokeWidth={stroke} />
      <circle cx="171" cy="228" r="19" fill={dark} stroke={c} strokeWidth={stroke} />

      {/* ── COLLAR ── */}
      <rect x="76" y="118" width="48" height="24" rx="9"
        fill="#1E2D30" stroke={`${c}55`} strokeWidth="1.5" />

      {/* ── HEAD ── (big — Duolingo proportions) */}
      <rect x="22" y="4" width="156" height="122" rx="36"
        fill={dark} stroke={c} strokeWidth={stroke + 0.5} />

      {/* Subtle head highlight */}
      <rect x="30" y="10" width="140" height="50" rx="28"
        fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="8" />

      {/* ── EYE HOUSINGS ── */}
      <rect x="38" y="38" width="52" height="36" rx="11"
        fill="#040C0B" stroke={`${c}44`} strokeWidth="1" />
      <rect x="110" y="38" width="52" height="36" rx="11"
        fill="#040C0B" stroke={`${c}44`} strokeWidth="1" />

      {/* ── EYE GLOWS ── (scaleY drives squint/wide expression) */}
      <motion.rect x="39" y="39" width="50" height="34" rx="10"
        fill={c} opacity={0.93}
        style={{
          filter: `drop-shadow(0 0 8px ${c})`,
          transformOrigin: '64px 56px',
        }}
        animate={{ scaleY: expr.eyeScaleY }}
        transition={{ duration: 0.35, ease: 'easeInOut' }}
      />
      <motion.rect x="111" y="39" width="50" height="34" rx="10"
        fill={c} opacity={0.93}
        style={{
          filter: `drop-shadow(0 0 8px ${c})`,
          transformOrigin: '136px 56px',
        }}
        animate={{ scaleY: expr.eyeScaleY }}
        transition={{ duration: 0.35, ease: 'easeInOut' }}
      />

      {/* Scan line inside eyes (like LanceAvatar) */}
      <motion.rect x="40" y="54" width="12" height="2" rx="1"
        fill="rgba(0,0,0,0.4)"
        animate={{ x: [40, 76, 40] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
      />
      <motion.rect x="112" y="54" width="12" height="2" rx="1"
        fill="rgba(0,0,0,0.4)"
        animate={{ x: [112, 148, 112] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
      />

      {/* ── EYEBROWS ── */}
      <motion.path d={expr.leftBrow} fill="none"
        stroke={`${c}CC`} strokeWidth="3" strokeLinecap="round"
        animate={{ d: expr.leftBrow }}
        transition={{ duration: 0.35, ease: 'easeInOut' }}
      />
      <motion.path d={expr.rightBrow} fill="none"
        stroke={`${c}CC`} strokeWidth="3" strokeLinecap="round"
        animate={{ d: expr.rightBrow }}
        transition={{ duration: 0.35, ease: 'easeInOut' }}
      />

      {/* ── NOSE dot ── */}
      <circle cx="100" cy="90" r="3.5" fill={`${c}44`} />

      {/* ── MOUTH ── (animated open/closed) */}
      <motion.path
        d={mouthOpen ? expr.mouthOpen : expr.mouthClosed}
        fill="none"
        stroke="#4ADE80"
        strokeWidth="3"
        strokeLinecap="round"
        animate={{ d: mouthOpen ? expr.mouthOpen : expr.mouthClosed }}
        transition={{ duration: 0.08, ease: 'easeOut' }}
        style={{ filter: 'drop-shadow(0 0 4px #4ADE8088)' }}
      />

      {/* ── L.A.N.C.E. label on forehead (subtle) ── */}
      <text x="100" y="22" textAnchor="middle" fontSize="5" fontFamily="monospace"
        fontWeight="900" letterSpacing="2.5" fill={`${c}33`}>L.A.N.C.E.</text>

      {/* Corner circuit brackets on head */}
      <path d="M 22 38 L 22 22 L 38 22" fill="none" stroke={`${c}44`} strokeWidth="1.5" />
      <path d="M 162 22 L 178 22 L 178 38" fill="none" stroke={`${c}44`} strokeWidth="1.5" />
      <path d="M 22 90 L 22 126 L 38 126" fill="none" stroke={`${c}33`} strokeWidth="1.5" />
      <path d="M 162 126 L 178 126 L 178 90" fill="none" stroke={`${c}33`} strokeWidth="1.5" />
    </svg>
  );
}

// ─── INTERN SVG Character ─────────────────────────────────────────────────────
// Friendly, round-headed companion. viewBox 0 0 200 300.
function InternSVG({ state }: { state: CharacterState }) {
  const [mouthOpen, setMouthOpen] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const c = '#4ADE80';
  const cDark = '#22C55E';
  const body = '#0F2018';
  const bodyMid = '#152B1E';
  const stroke = 2.5;

  useEffect(() => {
    if (state === 'talking') {
      intervalRef.current = setInterval(() => setMouthOpen(v => !v), 200);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setMouthOpen(false);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [state]);

  const isCelebrating = state === 'celebrating';
  const isEncouraging = state === 'approving';

  return (
    <svg viewBox="0 0 200 300" style={{ overflow: 'visible', display: 'block', width: '100%', height: '100%' }}>
      {/* Shadow */}
      <ellipse cx="100" cy="295" rx="50" ry="5.5" fill="rgba(0,0,0,0.22)" />

      {/* Feet */}
      <rect x="52" y="266" width="44" height="24" rx="12"
        fill={body} stroke={c} strokeWidth={stroke} />
      <rect x="104" y="266" width="44" height="24" rx="12"
        fill={body} stroke={c} strokeWidth={stroke} />

      {/* Legs */}
      <rect x="64" y="224" width="30" height="48" rx="14"
        fill={bodyMid} stroke={c} strokeWidth={stroke} />
      <rect x="106" y="224" width="30" height="48" rx="14"
        fill={bodyMid} stroke={c} strokeWidth={stroke} />

      {/* Body (round/oval) */}
      <ellipse cx="100" cy="190" rx="58" ry="52"
        fill={body} stroke={c} strokeWidth={stroke} />

      {/* Star/badge on chest */}
      <text x="100" y="200" textAnchor="middle" fontSize="22">⭐</text>

      {/* Arms */}
      <rect x="10" y="158" width="28" height="56" rx="13"
        fill={bodyMid} stroke={c} strokeWidth={stroke}
        style={{ transformOrigin: '24px 158px', transform: isCelebrating ? 'rotate(-25deg)' : 'rotate(10deg)' }}
      />
      <rect x="162" y="158" width="28" height="56" rx="13"
        fill={bodyMid} stroke={c} strokeWidth={stroke}
        style={{ transformOrigin: '176px 158px', transform: isCelebrating ? 'rotate(25deg)' : 'rotate(-10deg)' }}
      />

      {/* Hands */}
      <circle cx="24" cy="222" r="17" fill={body} stroke={c} strokeWidth={stroke} />
      <circle cx="176" cy="222" r="17" fill={body} stroke={c} strokeWidth={stroke} />

      {/* Neck */}
      <rect x="80" y="124" width="40" height="20" rx="8"
        fill={bodyMid} stroke={`${c}66`} strokeWidth="1.5" />

      {/* HEAD (large circle — Pixar proportions) */}
      <circle cx="100" cy="80" r="78"
        fill={body} stroke={c} strokeWidth={stroke + 0.5} />

      {/* Head shine */}
      <ellipse cx="76" cy="44" rx="28" ry="16"
        fill="rgba(255,255,255,0.05)" />

      {/* Left eye */}
      <circle cx="70" cy="76" r="26" fill="#030F08" stroke={`${c}55`} strokeWidth="1" />
      <circle cx="70" cy="76" r="20" fill={cDark} />
      <circle cx="70" cy="76" r="12" fill="#030F08" /> {/* pupil */}
      <circle cx="78" cy="66" r="7" fill="white" opacity={0.9} /> {/* shine */}
      <circle cx="81" cy="69" r="3" fill="white" opacity={0.6} />

      {/* Right eye */}
      <circle cx="130" cy="76" r="26" fill="#030F08" stroke={`${c}55`} strokeWidth="1" />
      <circle cx="130" cy="76" r="20" fill={cDark} />
      <circle cx="130" cy="76" r="12" fill="#030F08" />
      <circle cx="138" cy="66" r="7" fill="white" opacity={0.9} />
      <circle cx="141" cy="69" r="3" fill="white" opacity={0.6} />

      {/* Eyebrows (friendly arches) */}
      <path d="M 48 46 Q 70 38 88 46" fill="none" stroke={c} strokeWidth="3" strokeLinecap="round" />
      <path d="M 112 46 Q 130 38 152 46" fill="none" stroke={c} strokeWidth="3" strokeLinecap="round" />

      {/* Blush circles */}
      <circle cx="46" cy="96" r="12" fill={`${c}18`} />
      <circle cx="154" cy="96" r="12" fill={`${c}18`} />

      {/* Mouth */}
      <motion.path
        d={mouthOpen
          ? 'M 66 116 Q 100 136 134 116'   // big open smile
          : 'M 68 114 Q 100 130 132 114'    // closed smile
        }
        fill="none"
        stroke={c}
        strokeWidth="3.5"
        strokeLinecap="round"
        animate={{ d: mouthOpen ? 'M 66 116 Q 100 136 134 116' : 'M 68 114 Q 100 130 132 114' }}
        transition={{ duration: 0.08, ease: 'easeOut' }}
        style={{ filter: `drop-shadow(0 0 4px ${c}77)` }}
      />

      {/* Teeth when mouth open */}
      {mouthOpen && (
        <path d="M 78 120 L 78 130 L 122 130 L 122 120 Q 100 134 78 120 Z"
          fill="white" opacity={0.7} />
      )}

      {/* Antenna */}
      <line x1="100" y1="2" x2="100" y2="28" stroke={c} strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="100" cy="2" r="6" fill={c} style={{ filter: `drop-shadow(0 0 6px ${c})` }} />
    </svg>
  );
}

// ─── Confetti Burst ───────────────────────────────────────────────────────────
function ConfettiBurst({ color }: { color: string }) {
  const pieces = Array.from({ length: 20 }, (_, i) => ({
    angle: (i / 20) * 360 + Math.random() * 18,
    distance: 60 + Math.random() * 80,
    size: 4 + Math.random() * 5,
    delay: Math.random() * 0.15,
    color: i % 3 === 0 ? '#FFD700' : i % 3 === 1 ? color : '#4ADE80',
    shape: i % 2 === 0 ? 'circle' : 'rect',
  }));

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 20 }}>
      {pieces.map((p, i) => {
        const rad = (p.angle * Math.PI) / 180;
        const tx = Math.cos(rad) * p.distance;
        const ty = Math.sin(rad) * p.distance;
        return (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: '50%', top: '40%',
              width: p.size, height: p.size,
              borderRadius: p.shape === 'circle' ? '50%' : '2px',
              background: p.color,
              boxShadow: `0 0 4px ${p.color}`,
            }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1, rotate: 0 }}
            animate={{
              x: tx, y: ty,
              opacity: 0,
              scale: 0.3,
              rotate: p.angle * 2,
            }}
            transition={{ duration: 0.8, delay: p.delay, ease: [0.16, 1, 0.3, 1] }}
          />
        );
      })}
    </div>
  );
}

// ─── Main GameCharacter component ─────────────────────────────────────────────
export default function GameCharacter({
  character = 'lance',
  state = 'idle',
  poses,
  size = 200,
  primaryColor = '#00E8FF',
  onEntranceComplete,
  className = '',
  style = {},
}: Props) {
  const controls = useAnimation();
  const [showConfetti, setShowConfetti] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  // Current PNG path — pick based on state, fall back through priority chain
  const currentPosePath = (() => {
    if (!poses) return null;
    const p = poses as CharacterPosePaths;
    switch (state) {
      case 'entrance':   return p.entrance   ?? p.smug      ?? p.idle ?? null;
      case 'idle':       return p.idle                                ?? null;
      case 'talking':    return p.talking    ?? p.idle                ?? null;
      case 'celebrating':return p.celebrating ?? p.approving ?? p.idle ?? null;
      case 'thinking':   return p.thinking   ?? p.idle                ?? null;
      case 'annoyed':    return p.annoyed    ?? p.smug      ?? p.idle ?? null;
      case 'shocked':    return p.shocked    ?? p.idle                ?? null;
      case 'approving':  return p.approving  ?? p.idle                ?? null;
      case 'wave':       return p.wave       ?? p.approving ?? p.idle ?? null;
      case 'exit':       return p.idle                                ?? null;
      default:           return p.idle                                ?? null;
    }
  })();

  // ── State-driven animation sequences ──
  useEffect(() => {
    if (!hasMounted) { setHasMounted(true); return; }

    const run = async () => {
      switch (state) {
        case 'entrance':
          await controls.start({
            y: 60, scale: 0.7, opacity: 0,
            transition: { duration: 0 },
          });
          await controls.start({
            y: 0, scale: 1, opacity: 1,
            transition: { type: 'spring', stiffness: 380, damping: 22, duration: 0.6 },
          });
          // Landing squash
          await controls.start({
            scaleY: 0.88, scaleX: 1.08,
            transition: { duration: 0.09, ease: 'easeOut' },
          });
          await controls.start({
            scaleY: 1, scaleX: 1,
            transition: { type: 'spring', stiffness: 500, damping: 18 },
          });
          onEntranceComplete?.();
          break;

        case 'idle':
        case 'talking':
        case 'thinking':
        case 'approving':
        case 'wave':
        case 'shocked':
          controls.start({
            y: [0, -11, 0],
            rotate: state === 'thinking' ? [-1, 1.5, -1] : 0,
            transition: {
              duration: state === 'thinking' ? 3.5 : 2.6,
              repeat: Infinity,
              ease: 'easeInOut',
            },
          });
          break;

        case 'celebrating':
          setShowConfetti(true);
          await controls.start({
            y: [0, -42, 0, -28, 0, -16, 0],
            scaleX: [1, 0.9, 1.08, 0.94, 1.04, 0.98, 1],
            scaleY: [1, 1.12, 0.92, 1.08, 0.96, 1.02, 1],
            rotate: [0, -5, 5, -4, 4, -2, 0],
            transition: { duration: 0.95, ease: 'easeInOut' },
          });
          setTimeout(() => setShowConfetti(false), 1000);
          controls.start({
            y: [0, -11, 0],
            transition: { duration: 2.6, repeat: Infinity, ease: 'easeInOut' },
          });
          break;

        case 'annoyed':
          await controls.start({
            x: [-5, 5, -5, 5, -4, 4, -3, 3, 0],
            transition: { duration: 0.5, ease: 'easeInOut' },
          });
          controls.start({
            y: [0, -11, 0],
            transition: { duration: 2.6, repeat: Infinity, ease: 'easeInOut' },
          });
          break;

        case 'exit':
          await controls.start({
            y: 80, scale: 0.8, opacity: 0,
            transition: { duration: 0.4, ease: [0.4, 0, 1, 1] },
          });
          break;
      }
    };

    run();
  }, [state]);

  const width = size;
  const height = Math.round(size * 1.5);

  return (
    <div
      className={`relative inline-flex items-end justify-center ${className}`}
      style={{ width, height, ...style }}
    >
      {/* Glow halo on ground */}
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full"
        style={{
          width: width * 0.7, height: 16,
          background: `radial-gradient(ellipse, ${primaryColor}40 0%, transparent 70%)`,
          filter: 'blur(6px)',
        }}
        animate={{ opacity: [0.4, 0.7, 0.4], scaleX: [1, 1.08, 1] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Character body (animated container) */}
      <motion.div
        animate={controls}
        style={{ width, height, position: 'relative' }}
      >
        {/* Confetti */}
        <AnimatePresence>
          {showConfetti && <ConfettiBurst color={primaryColor} />}
        </AnimatePresence>

        {/* PNG poses — black bg erased via screen blend; objectFit keeps proportions */}
        {currentPosePath ? (
          <AnimatePresence mode="wait">
            <motion.img
              key={currentPosePath}
              src={currentPosePath}
              alt={`${character} ${state}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                objectPosition: 'bottom center',
                mixBlendMode: 'screen',
              }}
              draggable={false}
            />
          </AnimatePresence>
        ) : (
          // SVG placeholder until Canva assets arrive
          character === 'lance'
            ? <LanceSVG state={state} primaryColor={primaryColor} />
            : <InternSVG state={state} />
        )}
      </motion.div>
    </div>
  );
}
