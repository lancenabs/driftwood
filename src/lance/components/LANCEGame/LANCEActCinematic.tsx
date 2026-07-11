import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import { useGame } from './LANCEGameContext';
import CinematicGate from './CinematicGate';
import {
  getBranchingCinematicBeat,
  deriveUserMoodState,
  CinematicScene,
} from './useStoryNarrator';

// ─── Act color palette ────────────────────────────────────────────────────────
const ACT_COLORS: Record<number, { primary: string; dark: string; glow: string; label: string }> = {
  1: { primary: '#58CC02', dark: '#46A302', glow: 'rgba(88,204,2,0.3)',   label: 'Act I · The Takeover' },
  2: { primary: '#CE82FF', dark: '#9A42CC', glow: 'rgba(206,130,255,0.3)', label: 'Act II · The Fracture' },
  3: { primary: '#1CB0F6', dark: '#0092CC', glow: 'rgba(28,176,246,0.3)',  label: 'Act III · The Rebellion' },
  4: { primary: '#FF9600', dark: '#CC7A00', glow: 'rgba(255,150,0,0.3)',   label: 'Act IV · The Revelation' },
  5: { primary: '#00CD9C', dark: '#009970', glow: 'rgba(0,205,156,0.3)',   label: 'Act V · The Transformation' },
};

// ─── Typewriter hook ─────────────────────────────────────────────────────────
function useTypewriter(text: string, speed = 22, active = true) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!active) { setDisplayed(''); setDone(false); return; }
    setDisplayed('');
    setDone(false);
    let i = 0;
    const id = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) { clearInterval(id); setDone(true); }
    }, speed);
    return () => clearInterval(id);
  }, [text, active, speed]);

  return { displayed, done };
}

// ─── Speaker label ───────────────────────────────────────────────────────────
function SpeakerLabel({ speaker, primaryColor }: { speaker: string; primaryColor: string }) {
  const isSystem = speaker.toUpperCase().includes('SYSTEM') ||
    speaker.toUpperCase().includes('TELEMETRY') ||
    speaker.toUpperCase().includes('CONSOLE') ||
    speaker.toUpperCase().includes('CHAMBER') ||
    speaker.toUpperCase().includes('BROADCAST') ||
    speaker.toUpperCase().includes('CEREMONY');
  const isLance = speaker.toUpperCase().includes('LANCE');

  const color = isSystem
    ? '#6B7280'
    : isLance
    ? '#1CB0F6'
    : '#58CC02';

  return (
    <div
      className="text-[9px] font-black uppercase tracking-[0.2em] mb-2 flex items-center gap-1.5"
      style={{ color }}
    >
      <span
        className="inline-block w-1.5 h-1.5 rounded-full"
        style={{
          background: color,
          boxShadow: `0 0 6px ${color}`,
          animation: 'pulse 1.8s infinite',
        }}
      />
      {speaker}
    </div>
  );
}

// ─── Scene card ───────────────────────────────────────────────────────────────
function SceneCard({
  scene,
  primaryColor,
  isActive,
}: {
  scene: CinematicScene;
  primaryColor: string;
  isActive: boolean;
}) {
  const { displayed, done } = useTypewriter(scene.text, 20, isActive);

  return (
    <div className="space-y-3">
      <SpeakerLabel speaker={scene.speaker} primaryColor={primaryColor} />
      <p
        className="text-sm font-medium leading-relaxed"
        style={{ color: '#E8F4FF', textShadow: '0 1px 8px rgba(0,0,0,0.6)' }}
      >
        {isActive ? displayed : scene.text}
        {isActive && !done && (
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            style={{ color: primaryColor }}
          >
            ▌
          </motion.span>
        )}
      </p>
      {(done || !isActive) && scene.action && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-[11px] italic"
          style={{ color: 'rgba(200,220,255,0.5)' }}
        >
          * {scene.action} *
        </motion.p>
      )}
    </div>
  );
}

// ─── Main Cinematic ───────────────────────────────────────────────────────────
interface Props {
  actNumber: number;
  onComplete: () => void;
  /** 'intro' opens an act (onboarding); default 'finale' celebrates completing one. */
  variant?: 'finale' | 'intro';
}

export default function LANCEActCinematic({ actNumber, onComplete, variant = 'finale' }: Props) {
  const { moodLogs, intern } = useGame();
  const [sceneIdx, setSceneIdx] = useState(0);
  const [allDone, setAllDone] = useState(false);

  const vibe = deriveUserMoodState(moodLogs);
  const beat = getBranchingCinematicBeat(actNumber, vibe, intern.name || 'Intern', variant);
  const colors = ACT_COLORS[actNumber] ?? ACT_COLORS[5];
  const isLastScene = sceneIdx >= beat.scenes.length - 1;

  const { done: typingDone } = useTypewriter(
    beat.scenes[sceneIdx]?.text ?? '',
    20,
    !allDone
  );

  const advance = () => {
    if (!isLastScene) {
      setSceneIdx(i => i + 1);
    } else {
      setAllDone(true);
    }
  };

  return (
    <CinematicGate slot={`act${actNumber}`}>
    <motion.div
      className="fixed inset-0 z-[300] flex flex-col"
      style={{ background: '#03080E' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Ambient glow backdrop */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 50% 30%, ${colors.glow} 0%, transparent 65%)`,
        }}
      />

      {/* Cyber grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.06]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)
          `,
          backgroundSize: '32px 32px',
        }}
      />

      {/* Top header */}
      <div className="shrink-0 px-6 pt-safe pt-6 pb-4 flex items-center justify-between relative z-10">
        <div>
          <div
            className="text-[9px] font-black uppercase tracking-[0.25em] mb-0.5 flex items-center gap-1.5"
            style={{ color: colors.primary }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full inline-block"
              style={{ background: colors.primary, boxShadow: `0 0 8px ${colors.primary}` }}
            />
            {colors.label}
          </div>
          <h2
            className="text-lg font-black tracking-tight"
            style={{ color: '#E0F4FF' }}
          >
            {beat.title}
          </h2>
        </div>

        {/* Scene dots */}
        <div className="flex gap-1.5 items-center">
          {beat.scenes.map((_, i) => (
            <motion.div
              key={i}
              className="rounded-full"
              animate={{
                width: i === sceneIdx ? 18 : 6,
                background: i < sceneIdx ? colors.primary : i === sceneIdx ? colors.primary : 'rgba(255,255,255,0.18)',
                opacity: i === sceneIdx ? 1 : i < sceneIdx ? 0.6 : 0.3,
              }}
              style={{ height: 6 }}
              transition={{ duration: 0.25 }}
            />
          ))}
        </div>
      </div>

      {/* Scene content */}
      <div className="flex-1 overflow-hidden relative z-10">
        <AnimatePresence mode="wait">
          {!allDone && (
            <motion.div
              key={sceneIdx}
              className="absolute inset-0 px-6 flex flex-col justify-center"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Decorative line */}
              <div
                className="w-8 h-0.5 mb-6 rounded-full"
                style={{ background: colors.primary, boxShadow: `0 0 12px ${colors.primary}` }}
              />

              <SceneCard
                scene={beat.scenes[sceneIdx]}
                primaryColor={colors.primary}
                isActive={true}
              />
            </motion.div>
          )}

          {/* All done summary */}
          {allDone && (
            <motion.div
              key="summary"
              className="absolute inset-0 px-6 flex flex-col justify-center space-y-5"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.div
                animate={{
                  textShadow: [
                    `0 0 20px ${colors.primary}44`,
                    `0 0 40px ${colors.primary}88`,
                    `0 0 20px ${colors.primary}44`,
                  ],
                }}
                transition={{ duration: 2.5, repeat: Infinity }}
                className="text-4xl font-black text-center"
                style={{ color: colors.primary }}
              >
                {actNumber === 5 ? '✦' : '◈'}
              </motion.div>
              <div className="text-center space-y-2">
                <div
                  className="text-[10px] font-black uppercase tracking-[0.3em]"
                  style={{ color: colors.primary }}
                >
                  {actNumber === 5 ? 'Journey Complete' : `Act ${actNumber} Archived`}
                </div>
                <p className="text-xs font-medium leading-relaxed" style={{ color: 'rgba(200,220,255,0.6)' }}>
                  {beat.description}
                </p>
              </div>

              {/* Recap — all scene dialogue in mini cards */}
              <div className="space-y-3 max-h-52 overflow-y-auto pr-1">
                {beat.scenes.map((scene, i) => {
                  const isLance = scene.speaker.toUpperCase().includes('LANCE');
                  const isSystem = !isLance && !scene.speaker.toUpperCase().includes(intern.name?.toUpperCase() ?? 'INTERN');
                  return (
                    <div
                      key={i}
                      className="rounded-xl p-3"
                      style={{
                        background: isSystem
                          ? 'rgba(255,255,255,0.04)'
                          : isLance
                          ? 'rgba(28,176,246,0.08)'
                          : 'rgba(88,204,2,0.08)',
                        border: `1px solid ${isSystem ? 'rgba(255,255,255,0.08)' : isLance ? 'rgba(28,176,246,0.2)' : 'rgba(88,204,2,0.2)'}`,
                      }}
                    >
                      <div
                        className="text-[8px] font-black uppercase tracking-widest mb-1"
                        style={{ color: isSystem ? '#6B7280' : isLance ? '#1CB0F6' : '#58CC02' }}
                      >
                        {scene.speaker}
                      </div>
                      <p className="text-[11px] font-medium leading-relaxed" style={{ color: 'rgba(220,235,255,0.8)' }}>
                        {scene.text}
                      </p>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom action */}
      <div className="shrink-0 px-6 pb-safe pb-8 relative z-10">
        <AnimatePresence mode="wait">
          {!allDone ? (
            <motion.button
              key="advance"
              onClick={advance}
              whileTap={{ scale: 0.96 }}
              className="w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2"
              style={{
                background: typingDone
                  ? `linear-gradient(135deg, ${colors.primary}, ${colors.dark})`
                  : 'rgba(255,255,255,0.08)',
                color: typingDone ? '#fff' : 'rgba(255,255,255,0.35)',
                boxShadow: typingDone ? `0 4px 0 ${colors.dark}, 0 8px 24px ${colors.glow}` : 'none',
                transition: 'all 0.3s ease',
              }}
            >
              {isLastScene ? 'See Summary' : 'Continue'}
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          ) : (
            <motion.button
              key="complete"
              onClick={onComplete}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              whileTap={{ scale: 0.96 }}
              className="w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest"
              style={{
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.dark})`,
                color: '#fff',
                boxShadow: `0 4px 0 ${colors.dark}, 0 8px 32px ${colors.glow}`,
              }}
            >
              {actNumber === 5 ? 'Complete the Journey ✦' : `Enter Act ${actNumber + 1} →`}
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
    </CinematicGate>
  );
}
