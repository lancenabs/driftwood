import React, { useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Check, RotateCcw } from 'lucide-react';
import { useGame } from './LANCEGameContext';
import { GAME_CHALLENGES, GAME_TOOLS, CHALLENGE_ORDER } from './lanceGameData';
import GameCharacter, { LANCE_POSES } from './GameCharacter';

interface Props {
  // Called with no id to enter the active challenge, or with a challenge id to
  // replay a completed one (LANCEChallengeScreen awards reduced XP for replays).
  onStartChallenge: (replayChallengeId?: string) => void;
}

const ACT_CONFIG: Record<number, { primary: string; dark: string; light: string; name: string; art: string; place: string; video?: string }> = {
  1: { primary: '#58CC02', dark: '#46A302', light: '#E8FFD0', name: 'The Takeover', art: '/story-art/act1_mansion_shore.webp', place: 'The Mansion · Obsidian Shore', video: '/lance-videos/mansion_amb_01.mp4' },
  2: { primary: '#CE82FF', dark: '#9A42CC', light: '#F4E8FF', name: 'The Fracture', art: '/story-art/act2_whispering_jungle.webp', place: 'The Whispering Jungle', video: '/lance-videos/trail_act2.mp4' },
  3: { primary: '#1CB0F6', dark: '#0092CC', light: '#D8F0FF', name: 'The Rebellion', art: '/story-art/act3_harbor_volcano.webp', place: 'The Harbor · Volcano Coast', video: '/lance-videos/trail_act3.mp4' },
  4: { primary: '#FF9600', dark: '#CC7A00', light: '#FFF0D0', name: 'The Revelation', art: '/story-art/act4_lost_outpost.webp', place: 'The Lost Outpost · Reactor', video: '/lance-videos/trail_act4.mp4' },
  5: { primary: '#00CD9C', dark: '#009970', light: '#C8FFF0', name: 'The Transformation', art: '/story-art/act5_lantern_canyon.webp', place: 'The Lantern Canyon', video: '/lance-videos/trail_act5.mp4' },
};

// Zigzag x positions (% of container width for node center)
const TRAIL_X = [50, 62, 72, 62, 50, 38, 28, 38];

const NODE_SIZE = 60;
const ROW_H = 96;

export default function ChallengeTrail({ onStartChallenge }: Props) {
  const { completedChallenges, currentChallengeId } = useGame();
  const activeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => {
      activeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 350);
  }, []);

  // Precompute every trail item
  const items = CHALLENGE_ORDER.map((id, idx) => {
    const ch = GAME_CHALLENGES.find(c => c.id === id)!;
    const tool = GAME_TOOLS.find(t => t.id === ch.unlocksToolId);
    const xPct = TRAIL_X[idx % TRAIL_X.length];
    const prevX = idx > 0 ? TRAIL_X[(idx - 1) % TRAIL_X.length] : xPct;
    const isCompleted = completedChallenges.includes(id);
    const isActive = currentChallengeId === id;
    const isLocked = !isCompleted && !isActive;
    const act = ACT_CONFIG[ch.actNumber];
    // Show act header on the first challenge of each act
    const prevCh = idx > 0 ? GAME_CHALLENGES.find(c => c.id === CHALLENGE_ORDER[idx - 1]) : null;
    const showActHeader = idx === 0 || (prevCh && prevCh.actNumber !== ch.actNumber);
    // Put LANCE on the left when node is right-leaning, right when left-leaning
    const lanceOnLeft = xPct >= 50;
    return { id, ch, tool, xPct, prevX, isCompleted, isActive, isLocked, act, showActHeader, lanceOnLeft, idx };
  });

  const completedCount = completedChallenges.length;
  const totalCount = CHALLENGE_ORDER.length;

  return (
    <div className="h-full overflow-y-auto bg-[#F9FAFB]">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white border-b border-[#F0F0F0] px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[9px] font-black uppercase tracking-widest text-[#AFAFAF]">
              Challenge Progress
            </div>
            <div className="text-sm font-black text-[#3C3C3C]">
              {completedCount} of {totalCount} Complete
            </div>
          </div>
          <div className="h-2 flex-1 mx-4 rounded-full bg-[#E5E5E5] overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-[#58CC02]"
              animate={{ width: `${(completedCount / totalCount) * 100}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </div>
          <span className="text-xs font-black text-[#58CC02]">
            {Math.round((completedCount / totalCount) * 100)}%
          </span>
        </div>
      </div>

      {/* Trail */}
      <div className="pb-20 pt-2">
        {items.map(({ id, ch, tool, xPct, prevX, isCompleted, isActive, isLocked, act, showActHeader, lanceOnLeft, idx }) => (
          <div key={id}>
            {/* Act section header */}
            {showActHeader && (
              <div className="px-3 py-3">
                {/* Illustrated chapter card — the island's own art, glass caption */}
                <div className="relative rounded-3xl overflow-hidden" style={{ aspectRatio: '16/7', boxShadow: `0 10px 30px ${act.primary}30` }}>
                  <img
                    src={act.art}
                    alt=""
                    draggable={false}
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={e => { (e.currentTarget.parentElement as HTMLElement).style.display = 'none'; }}
                  />
                  {act.video && (
                    <video
                      src={act.video}
                      poster={act.art}
                      className="absolute inset-0 w-full h-full object-cover"
                      autoPlay muted loop playsInline
                      onError={e => { (e.currentTarget as HTMLVideoElement).style.display = 'none'; }}
                    />
                  )}
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0) 30%, rgba(0,0,0,0.62) 100%)' }} />
                  <div className="absolute inset-x-0 bottom-0 px-4 py-3">
                    <div className="text-[8px] font-black uppercase tracking-[0.25em]" style={{ color: act.light, textShadow: '0 1px 6px rgba(0,0,0,0.7)' }}>
                      Act {ch.actNumber} · {act.place}
                    </div>
                    <div className="text-lg font-black text-white leading-tight" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>
                      {act.name}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Node row */}
            <div className="relative" style={{ height: ROW_H }}>
              {/* Connecting line (SVG) */}
              {idx > 0 && (
                <svg
                  className="absolute inset-0 w-full pointer-events-none"
                  style={{ height: ROW_H, zIndex: 0 }}
                  preserveAspectRatio="none"
                >
                  <line
                    x1={`${prevX}%`} y1="0"
                    x2={`${xPct}%`} y2={ROW_H}
                    stroke={isCompleted ? act.primary : '#E5E5E5'}
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeDasharray={isLocked ? '8 7' : undefined}
                    opacity={isLocked ? 0.5 : 1}
                  />
                </svg>
              )}

              {/* LANCE character next to active node */}
              {isActive && (
                <div
                  className="absolute z-20"
                  style={{
                    left: lanceOnLeft
                      ? `calc(${xPct}% - ${NODE_SIZE / 2 + 52}px)`
                      : `calc(${xPct}% + ${NODE_SIZE / 2 + 4}px)`,
                    top: '50%',
                    transform: 'translateY(-60%)',
                  }}
                >
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <GameCharacter
                      character="lance"
                      state="talking"
                      poses={LANCE_POSES}
                      primaryColor={act.primary}
                      size={44}
                    />
                  </motion.div>
                </div>
              )}

              {/* Node */}
              <div
                ref={isActive ? activeRef : undefined}
                className="absolute"
                style={{
                  left: `calc(${xPct}% - ${NODE_SIZE / 2}px)`,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 10,
                }}
              >
                {/* START label */}
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap"
                  >
                    <span
                      className="text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg shadow-md"
                      style={{ background: act.primary, color: '#fff' }}
                    >
                      START
                    </span>
                  </motion.div>
                )}

                {/* Node circle — completed nodes stay tappable so users can replay them (for reduced XP) */}
                <motion.button
                  onClick={isActive ? () => onStartChallenge() : isCompleted ? () => onStartChallenge(id) : undefined}
                  whileTap={isActive || isCompleted ? { scale: 0.88 } : {}}
                  whileHover={isCompleted ? { scale: 1.05 } : {}}
                  className="rounded-full flex items-center justify-center relative"
                  style={{
                    width: NODE_SIZE,
                    height: NODE_SIZE,
                    background: isCompleted
                      ? act.primary
                      : isActive
                      ? '#FFFFFF'
                      : '#E5E5E5',
                    border: isActive ? `3.5px solid ${act.primary}` : 'none',
                    boxShadow: isActive
                      ? `0 0 0 8px ${act.primary}25, 0 6px 16px rgba(0,0,0,0.13)`
                      : isCompleted
                      ? `0 3px 10px ${act.primary}40`
                      : '0 1px 4px rgba(0,0,0,0.08)',
                    cursor: isActive || isCompleted ? 'pointer' : 'default',
                  }}
                >
                  {isCompleted ? (
                    <>
                      <Check className="w-7 h-7 text-white" strokeWidth={3.5} />
                      {/* Replay badge — signals this completed challenge can be redone */}
                      <div
                        className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
                        style={{ background: '#FFFFFF', border: `2px solid ${act.primary}` }}
                      >
                        <RotateCcw className="w-2.5 h-2.5" style={{ color: act.primary }} strokeWidth={3} />
                      </div>
                    </>
                  ) : isActive ? (
                    <span className="text-2xl select-none">{tool?.emoji ?? '⚡'}</span>
                  ) : (
                    <span className="text-xl select-none" style={{ filter: 'grayscale(1)', opacity: 0.4 }}>
                      {tool?.emoji ?? '⚡'}
                    </span>
                  )}
                </motion.button>

                {/* Challenge name */}
                <div
                  className="text-center mt-1.5 px-0.5"
                  style={{ width: NODE_SIZE + 20, marginLeft: -10 }}
                >
                  <span
                    className="text-[9px] font-bold leading-tight block"
                    style={{
                      color: isCompleted ? act.primary : isActive ? act.dark : '#C8C8C8',
                    }}
                  >
                    {ch.title}
                  </span>
                  {isCompleted && (
                    <span
                      className="text-[7.5px] font-black uppercase tracking-wider block mt-0.5"
                      style={{ color: act.primary, opacity: 0.7 }}
                    >
                      Tap to replay
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Act finale milestone chest */}
            {ch.isActFinale && (
              <div className="flex flex-col items-center py-3 gap-1">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-sm"
                  style={{
                    background: isCompleted ? act.light : '#F0F0F0',
                    border: `2px solid ${isCompleted ? act.primary + '50' : '#E5E5E5'}`,
                  }}
                >
                  {isCompleted ? '🏆' : '🔒'}
                </div>
                <span
                  className="text-[8px] font-black uppercase tracking-widest"
                  style={{ color: isCompleted ? act.primary : '#AFAFAF' }}
                >
                  {isCompleted ? `Act ${ch.actNumber} Complete` : 'Locked'}
                </span>
              </div>
            )}
          </div>
        ))}

        {/* End of trail */}
        <div className="text-center pt-4 pb-8 px-6">
          <div className="text-5xl mb-3">🌅</div>
          <div className="text-sm font-black text-[#3C3C3C]">The Transformation</div>
          <div className="text-xs text-[#AFAFAF] mt-1">Season 2: The Human Upgrade — Coming Soon</div>
        </div>
      </div>
    </div>
  );
}
