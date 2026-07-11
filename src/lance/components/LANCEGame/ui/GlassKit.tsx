// ─────────────────────────────────────────────────────────────────────────────
//  Glass Interior kit — shared primitives for tool interiors.
//  See TOOL_INTERIOR_DESIGN_PLAN.md for the system this implements.
//
//  Design rules encoded here:
//  - Every tool sits INSIDE its category's region (blurred hero backdrop + scrim).
//  - One accent color per tool, derived from TOOL_GRADIENTS via ToolAccentContext —
//    children read it with useToolAccent() instead of hard-coding hexes.
//  - Crisis surfaces stay exempt from gamification pressure: RewardMoment is
//    opt-in per call site, never automatic.
// ─────────────────────────────────────────────────────────────────────────────
import React, { createContext, useContext, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GAME_TOOLS } from '../lanceGameData';
import { getToolIcon } from '../toolIcons';
import BigBackButton from '../BigBackButton';
import { INTERN_POSES, LANCE_POSES } from '../GameCharacter';
import { NARRATOR, SECOND_VOICE } from '../narrator';

// Category → region hero backdrop (public/region-heroes/<cat>.webp).
const REGION_CATEGORIES = new Set([
  'mood', 'breathing', 'cognitive', 'somatic', 'cbt', 'dbt', 'depth',
  'relational', 'habit', 'clinical', 'nutrition', 'theory', 'insight', 'gamification',
]);

export function regionHeroFor(toolId: string): string | null {
  const cat = GAME_TOOLS.find(t => t.id === toolId)?.category;
  return cat && REGION_CATEGORIES.has(cat) ? `/region-heroes/${cat}.webp` : null;
}

// ── Accent context ────────────────────────────────────────────────────────────
interface ToolAccent {
  color: string;    // primary hex, e.g. '#8B5CF6'
  gradient: string; // full CSS gradient string
}
const ToolAccentContext = createContext<ToolAccent>({
  color: '#3ECFCF',
  gradient: 'linear-gradient(135deg, #7FD98C, #3ECFCF)',
});
export const useToolAccent = () => useContext(ToolAccentContext);

// Gradients live in LibraryTab today; tools pass their own accent to ToolScaffold
// (or fall back to brand mint-teal). Kept as a prop so this file doesn't import
// the whole Library.

// ── ToolScaffold ─────────────────────────────────────────────────────────────
// The room every tool lives in: region backdrop, glass header, content column.
export function ToolScaffold({
  toolId, title, subtitle, onBack, accentColor, accentGradient, headerRight, immersive = false, children,
}: {
  toolId: string;
  title: string;
  subtitle?: string;
  onBack: () => void;
  accentColor?: string;
  accentGradient?: string;
  headerRight?: React.ReactNode;
  /** immersive: backdrop shown sharp and full-strength (EMDR, sound bath, breathwork). */
  immersive?: boolean;
  children: React.ReactNode;
}) {
  const hero = regionHeroFor(toolId);
  const icon = getToolIcon(toolId);
  const accent: ToolAccent = {
    color: accentColor ?? '#3ECFCF',
    gradient: accentGradient ?? `linear-gradient(135deg, ${accentColor ?? '#7FD98C'}, #3ECFCF)`,
  };

  return (
    <ToolAccentContext.Provider value={accent}>
      <div className="relative flex flex-col h-full overflow-hidden" style={{ background: '#EEF1F4' }}>
        {/* Region backdrop */}
        {hero && (
          <div aria-hidden style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url(${hero})`,
            backgroundSize: 'cover', backgroundPosition: 'center',
            filter: immersive ? 'none' : 'blur(22px) saturate(1.05)',
            transform: 'scale(1.12)',
            opacity: immersive ? 1 : 0.5,
          }} />
        )}
        {/* Legibility scrim */}
        {!immersive && (
          <div aria-hidden style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(180deg, rgba(238,241,244,0.82) 0%, rgba(238,241,244,0.9) 40%, rgba(238,241,244,0.94) 100%)',
          }} />
        )}

        {/* Glass header */}
        <div className="sticky top-0 z-20 flex items-center gap-3 px-4 py-3" style={{
          background: immersive ? 'rgba(10,14,20,0.55)' : 'rgba(255,255,255,0.72)',
          backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
          borderBottom: immersive ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(255,255,255,0.85)',
          boxShadow: immersive ? 'none' : '0 2px 12px rgba(0,0,0,0.05)',
        }}>
          <BigBackButton onBack={onBack} />
          {icon && (
            <img src={icon} alt="" draggable={false}
              style={{ width: 34, height: 34, borderRadius: 10, boxShadow: `0 4px 10px ${accent.color}40` }} />
          )}
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-black truncate" style={{ color: immersive ? '#FFFFFF' : '#1C1C1E' }}>{title}</h2>
            {subtitle && (
              <p className="text-[10px] font-semibold truncate" style={{ color: immersive ? 'rgba(255,255,255,0.7)' : '#6B7280' }}>{subtitle}</p>
            )}
          </div>
          {headerRight}
        </div>

        {/* Content */}
        <div className="relative flex-1 overflow-y-auto">{children}</div>
      </div>
    </ToolAccentContext.Provider>
  );
}

// ── GlassPanel ───────────────────────────────────────────────────────────────
export function GlassPanel({
  children, solid = false, className = '', style = {},
}: {
  children: React.ReactNode;
  /** solid: calmer, more opaque surface for text-heavy reading (worksheets). */
  solid?: boolean;
  className?: string;
  style?: React.CSSProperties;
  key?: React.Key;
}) {
  const { color } = useToolAccent();
  return (
    <div className={`rounded-3xl ${className}`} style={{
      background: solid ? 'rgba(255,255,255,0.94)' : 'rgba(255,255,255,0.75)',
      backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
      border: '1px solid rgba(255,255,255,0.95)',
      boxShadow: `0 6px 22px ${color}22, 0 2px 8px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.9)`,
      ...style,
    }}>
      {children}
    </div>
  );
}

// ── HeroCTA ──────────────────────────────────────────────────────────────────
export function HeroCTA({
  children, onClick, disabled = false, style = {},
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  style?: React.CSSProperties;
}) {
  const { color, gradient } = useToolAccent();
  return (
    <motion.button
      whileTap={disabled ? undefined : { scale: 0.97, y: 2 }}
      onClick={onClick}
      disabled={disabled}
      className="w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2"
      style={{
        background: disabled ? 'rgba(180,186,196,0.4)' : gradient,
        color: disabled ? '#9CA3AF' : '#FFFFFF',
        border: '1px solid rgba(255,255,255,0.5)',
        boxShadow: disabled ? 'none' : `0 3px 0 ${color}66, 0 8px 18px ${color}45, inset 0 1px 0 rgba(255,255,255,0.45)`,
        textShadow: disabled ? 'none' : '0 1px 2px rgba(0,0,0,0.18)',
        cursor: disabled ? 'default' : 'pointer',
        ...style,
      }}
    >
      {children}
    </motion.button>
  );
}

// ── CoachCard ────────────────────────────────────────────────────────────────
// Character commentary with the real pose art instead of tiny-avatar + italics.
export function CoachCard({
  speaker, pose, children, label,
}: {
  speaker: 'lance' | 'chip';
  pose?: string;
  children: React.ReactNode;
  label?: string;
}) {
  const { color } = useToolAccent();
  const poses = speaker === 'lance' ? LANCE_POSES : INTERN_POSES;
  const src = (poses as Record<string, string>)[pose ?? 'idle'] ?? (poses as Record<string, string>).idle;
  const name = label ?? (speaker === 'lance' ? NARRATOR.name : SECOND_VOICE.name);
  const nameColor = speaker === 'lance' ? '#B08D57' : '#7FD98C';
  return (
    <GlassPanel className="p-4">
      <div className="flex items-start gap-3">
        <img src={src} alt="" draggable={false}
          onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
          style={{ width: 64, height: 72, objectFit: 'contain', flexShrink: 0, filter: `drop-shadow(0 6px 10px ${color}33)` }} />
        <div className="flex-1 min-w-0">
          <div className="text-[9px] font-black uppercase tracking-widest mb-1" style={{ color: nameColor }}>{name}</div>
          <div className="text-xs leading-relaxed" style={{ color: speaker === 'lance' ? '#6B7280' : '#4B7B57', fontStyle: speaker === 'lance' ? 'italic' : 'normal' }}>
            {children}
          </div>
        </div>
      </div>
    </GlassPanel>
  );
}

// ── EmptyStateCoach ──────────────────────────────────────────────────────────
export function EmptyStateCoach({
  message, ctaLabel, onCta,
}: {
  message: string;
  ctaLabel?: string;
  onCta?: () => void;
}) {
  return (
    <div className="flex flex-col items-center text-center py-8 px-6 gap-4">
      <img src={INTERN_POSES.wave} alt="" draggable={false}
        style={{ width: 120, height: 140, objectFit: 'contain', filter: 'drop-shadow(0 10px 18px rgba(62,207,207,0.25))' }} />
      <p className="text-sm font-bold max-w-[260px]" style={{ color: '#4B5563' }}>{message}</p>
      {ctaLabel && onCta && (
        <div className="w-full max-w-[280px]"><HeroCTA onClick={onCta}>{ctaLabel}</HeroCTA></div>
      )}
    </div>
  );
}

// ── RewardMoment ─────────────────────────────────────────────────────────────
// Completion celebration: Chip celebrating pose + accent confetti + XP + praise.
// Opt-in per call site. NEVER wire into crisis surfaces.
export function RewardMoment({
  show, xp, praise, onDone,
}: {
  show: boolean;
  xp?: number;
  praise: string;
  onDone: () => void;
}) {
  const { color } = useToolAccent();
  const reduced = typeof window !== 'undefined'
    && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  // Therapist config: 'quiet' softens celebration to a brief praise line —
  // no confetti, no character spring — for clients where gamification is
  // contraindicated. XP still accrues silently (never punitive).
  let quiet = false;
  try {
    const st = JSON.parse(localStorage.getItem('lance_therapist_directives_v1') || 'null');
    if (st?.directives) {
      for (const d of st.directives) {
        if (d.type === 'config' && d.payload?.gamificationIntensity) {
          quiet = d.payload.gamificationIntensity === 'quiet';
        }
      }
    }
  } catch { /* default full */ }

  useEffect(() => {
    if (!show) return;
    const t = setTimeout(onDone, reduced ? 1200 : 2000);
    return () => clearTimeout(t);
  }, [show]);

  const confetti = reduced ? [] : Array.from({ length: 14 }, (_, i) => i);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center"
          style={{ background: 'rgba(255,255,255,0.55)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}
          onClick={onDone}
        >
          {!quiet && confetti.map(i => (
            <motion.div key={i}
              initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
              animate={{
                opacity: 0,
                x: (Math.random() - 0.5) * 320,
                y: 120 + Math.random() * 260,
                scale: 0.4,
                rotate: Math.random() * 360,
              }}
              transition={{ duration: 1.4 + Math.random() * 0.5, ease: 'easeOut' }}
              style={{
                position: 'absolute', top: '32%',
                width: 10, height: 10, borderRadius: i % 3 === 0 ? '50%' : 3,
                background: i % 2 === 0 ? color : '#7FD98C',
              }}
            />
          ))}
          {!quiet && <motion.img
            src={INTERN_POSES.celebrating} alt="" draggable={false}
            initial={reduced ? { scale: 1 } : { scale: 0.5, y: 40 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 16 }}
            style={{ width: 170, height: 200, objectFit: 'contain', filter: `drop-shadow(0 14px 26px ${color}44)` }}
          />}
          {typeof xp === 'number' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
              className="mt-2 px-4 py-1.5 rounded-full font-black text-sm"
              style={{ background: 'rgba(255,255,255,0.9)', color, border: `1px solid ${color}55`, boxShadow: `0 4px 14px ${color}33` }}
            >
              +{xp} XP
            </motion.div>
          )}
          <motion.p
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
            className="mt-2 text-sm font-black text-center max-w-[260px]"
            style={{ color: '#1C1C1E', textShadow: '0 1px 0 rgba(255,255,255,0.8)' }}
          >
            {praise}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Small helper: pick a random praise line (variable reward).
export function pickPraise(pool: string[]): string {
  return pool[Math.floor(Math.random() * pool.length)] ?? 'Done.';
}

// ── ProgressRing ─────────────────────────────────────────────────────────────
export function ProgressRing({
  progress, size = 72, stroke = 7, label,
}: {
  progress: number; // 0..1
  size?: number;
  stroke?: number;
  label?: React.ReactNode;
}) {
  const { color } = useToolAccent();
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={`${color}22`} strokeWidth={stroke} />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={color} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={c}
          animate={{ strokeDashoffset: c * (1 - Math.max(0, Math.min(1, progress))) }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </svg>
      {label && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {label}
        </div>
      )}
    </div>
  );
}
