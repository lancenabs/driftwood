import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { STORY_ACTS, CHALLENGE_ORDER } from './lanceGameData';

interface Props {
  completedChallenges: string[];
  currentChallengeId: string | null;
  internAvatar: string;
  internName: string;
  onActSelect?: (actNumber: number) => void;
}

// Island SVG path & 5 act checkpoint positions
const ISLAND_PATH = "M 12 76 Q 25 70, 38 52 T 52 24 T 78 40 T 85 82";

const ACT_CHECKPOINTS = [
  {
    act: 1,
    label: 'Island Arrival',
    cx: 15,
    cy: 76,
    color: '#3ECFCF',
    glowColor: 'rgba(62,207,207,0.4)',
    challenges: CHALLENGE_ORDER.slice(0, 7),
  },
  {
    act: 2,
    label: 'Whispering Jungle',
    cx: 38,
    cy: 52,
    color: '#22C55E',
    glowColor: 'rgba(34,197,94,0.4)',
    challenges: CHALLENGE_ORDER.slice(7, 15),
  },
  {
    act: 3,
    label: 'Shadow Ridgeline',
    cx: 52,
    cy: 24,
    color: '#A78BFA',
    glowColor: 'rgba(167,139,250,0.4)',
    challenges: CHALLENGE_ORDER.slice(15, 21),
  },
  {
    act: 4,
    label: 'Lost Outpost',
    cx: 78,
    cy: 40,
    color: '#F59E0B',
    glowColor: 'rgba(245,158,11,0.4)',
    challenges: CHALLENGE_ORDER.slice(21, 27),
  },
  {
    act: 5,
    label: 'Rescue Shore',
    cx: 85,
    cy: 82,
    color: '#EC4899',
    glowColor: 'rgba(236,72,153,0.4)',
    challenges: CHALLENGE_ORDER.slice(27),
  },
];

function getActStatus(completedChallenges: string[], checkpoint: typeof ACT_CHECKPOINTS[0]) {
  const done = checkpoint.challenges.filter(id => completedChallenges.includes(id)).length;
  const total = checkpoint.challenges.length;
  if (done === 0) return 'locked';
  if (done === total) return 'cleared';
  return 'active';
}

function getCurrentActNumber(currentChallengeId: string | null): number {
  if (!currentChallengeId) return 1;
  const idx = CHALLENGE_ORDER.indexOf(currentChallengeId);
  if (idx < 7) return 1;
  if (idx < 15) return 2;
  if (idx < 21) return 3;
  if (idx < 27) return 4;
  return 5;
}

// Interpolate a point along the bezier path at t=0..1 for a given act (0-based index)
function getAvatarPos(checkpoint: typeof ACT_CHECKPOINTS[0]) {
  return { x: checkpoint.cx, y: checkpoint.cy };
}

export default function IslandProgressMap({
  completedChallenges,
  currentChallengeId,
  internAvatar,
  internName,
  onActSelect,
}: Props) {
  const [selectedAct, setSelectedAct] = React.useState<number | null>(null);
  const currentAct = getCurrentActNumber(currentChallengeId);
  const avatarCheckpoint = ACT_CHECKPOINTS[currentAct - 1];
  const avatarPos = getAvatarPos(avatarCheckpoint);

  // Path length for dash animation (estimated for this path)
  const ESTIMATED_PATH_LEN = 160;

  const completedActCount = useMemo(() => {
    return ACT_CHECKPOINTS.filter(cp => getActStatus(completedChallenges, cp) === 'cleared').length;
  }, [completedChallenges]);

  const dashOffset = useMemo(() => {
    const progress = completedActCount / 5;
    return ESTIMATED_PATH_LEN * (1 - progress);
  }, [completedActCount]);

  const selected = selectedAct ? ACT_CHECKPOINTS.find(c => c.act === selectedAct) : null;
  const selectedStatus = selected ? getActStatus(completedChallenges, selected) : null;

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Map header */}
      <div className="flex items-center justify-between px-1">
        <span className="text-[10px] font-bold tracking-widest uppercase text-teal-400">
          Island Escape Progress
        </span>
        <span className="text-[10px] text-gray-400">
          Act {currentAct} of 5
        </span>
      </div>

      {/* SVG Island Map */}
      <div
        className="relative w-full rounded-2xl overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0a1628 0%, #0d2137 60%, #091520 100%)', paddingBottom: '52%' }}
      >
        <svg
          viewBox="0 0 100 90"
          className="absolute inset-0 w-full h-full"
          style={{ filter: 'drop-shadow(0 0 12px rgba(0,0,0,0.8))' }}
        >
          {/* Island terrain texture */}
          <defs>
            <radialGradient id="islandGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#1a3a2a" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#0a1628" stopOpacity="0" />
            </radialGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background island glow */}
          <ellipse cx="50" cy="55" rx="45" ry="32" fill="url(#islandGlow)" />

          {/* Faint ocean grid lines */}
          {[20, 40, 60, 80].map(x => (
            <line key={x} x1={x} y1="0" x2={x} y2="90" stroke="#1a3a5a" strokeWidth="0.2" strokeDasharray="1 3" />
          ))}
          {[20, 40, 60, 80].map(y => (
            <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="#1a3a5a" strokeWidth="0.2" strokeDasharray="1 3" />
          ))}

          {/* Base path (dim) */}
          <path
            d={ISLAND_PATH}
            fill="none"
            stroke="#1e3a4a"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Completed path (animated teal glow) */}
          <motion.path
            d={ISLAND_PATH}
            fill="none"
            stroke="#3ECFCF"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={ESTIMATED_PATH_LEN}
            initial={{ strokeDashoffset: ESTIMATED_PATH_LEN }}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            filter="url(#glow)"
          />

          {/* Act checkpoint nodes */}
          {ACT_CHECKPOINTS.map((cp) => {
            const status = getActStatus(completedChallenges, cp);
            const isActive = cp.act === currentAct;
            const isSelected = selectedAct === cp.act;
            const done = cp.challenges.filter(id => completedChallenges.includes(id)).length;
            const total = cp.challenges.length;

            return (
              <g
                key={cp.act}
                onClick={() => {
                  setSelectedAct(isSelected ? null : cp.act);
                  onActSelect?.(cp.act);
                }}
                style={{ cursor: 'pointer' }}
              >
                {/* Outer glow ring for active act */}
                {isActive && (
                  <motion.circle
                    cx={cp.cx}
                    cy={cp.cy}
                    r={6}
                    fill="none"
                    stroke={cp.color}
                    strokeWidth="1"
                    opacity={0.4}
                    animate={{ r: [5, 8, 5], opacity: [0.4, 0.1, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  />
                )}

                {/* Node circle */}
                <circle
                  cx={cp.cx}
                  cy={cp.cy}
                  r={status === 'locked' ? 3 : 3.5}
                  fill={status === 'locked' ? '#1e3a4a' : status === 'cleared' ? cp.color : cp.color}
                  opacity={status === 'locked' ? 0.4 : 1}
                  stroke={isSelected ? '#fff' : cp.color}
                  strokeWidth={isSelected ? 1 : 0.5}
                  filter={status !== 'locked' ? 'url(#glow)' : undefined}
                />

                {/* Progress arc for active acts */}
                {status === 'active' && (
                  <circle
                    cx={cp.cx}
                    cy={cp.cy}
                    r={5}
                    fill="none"
                    stroke={cp.color}
                    strokeWidth="1"
                    strokeDasharray={`${(done / total) * 31.4} 31.4`}
                    opacity={0.6}
                    transform={`rotate(-90 ${cp.cx} ${cp.cy})`}
                  />
                )}

                {/* Act number label */}
                <text
                  x={cp.cx}
                  y={cp.cy + 0.8}
                  textAnchor="middle"
                  fontSize="2.8"
                  fill={status === 'locked' ? '#4a6a7a' : '#fff'}
                  fontWeight="bold"
                >
                  {cp.act}
                </text>

                {/* Checkpoint label below */}
                <text
                  x={cp.cx}
                  y={cp.cy + 8}
                  textAnchor="middle"
                  fontSize="2.4"
                  fill={status === 'locked' ? '#2a4a5a' : cp.color}
                  opacity={0.9}
                >
                  {status === 'cleared' ? '✓ ' : ''}{cp.label}
                </text>
              </g>
            );
          })}

          {/* Intern avatar marker (floating at current position) */}
          <motion.g
            animate={{ y: [0, -1.5, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            {/* Shadow */}
            <ellipse
              cx={avatarPos.x}
              cy={avatarPos.y + 6}
              rx={2.5}
              ry={0.8}
              fill="rgba(0,0,0,0.4)"
            />
            {/* Avatar bubble */}
            <circle cx={avatarPos.x} cy={avatarPos.y - 4} r={4} fill="#0d2137" stroke="#3ECFCF" strokeWidth="0.8" />
            <text x={avatarPos.x} y={avatarPos.y - 2.5} textAnchor="middle" fontSize="4.5">
              {internAvatar}
            </text>
            {/* Name tag */}
            <rect
              x={avatarPos.x - 6}
              y={avatarPos.y - 10}
              width={12}
              height={4}
              rx={1.5}
              fill="#0d2137"
              stroke="#3ECFCF"
              strokeWidth="0.4"
            />
            <text x={avatarPos.x} y={avatarPos.y - 7.5} textAnchor="middle" fontSize="2.2" fill="#3ECFCF">
              {internName}
            </text>
          </motion.g>
        </svg>
      </div>

      {/* Selected act detail panel */}
      {selected && (
        <motion.div
          key={selected.act}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl p-3 border"
          style={{
            background: 'rgba(13,33,55,0.95)',
            borderColor: selected.color + '55',
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full"
                style={{ background: selected.color + '22', color: selected.color }}
              >
                Act {selected.act}
              </span>
              <span className="text-white text-sm font-semibold">
                {STORY_ACTS[selected.act]?.title}
              </span>
            </div>
            <span
              className="text-[10px] font-bold uppercase tracking-wider"
              style={{
                color: selectedStatus === 'cleared' ? '#22C55E' :
                  selectedStatus === 'active' ? selected.color : '#4a6a7a'
              }}
            >
              {selectedStatus === 'cleared' ? '✓ CLEARED' :
                selectedStatus === 'active' ? 'IN PROGRESS' : 'LOCKED'}
            </span>
          </div>

          <p className="text-gray-400 text-[11px] mb-2">
            {STORY_ACTS[selected.act]?.theme}
          </p>

          {/* Challenge progress dots */}
          <div className="flex flex-wrap gap-1">
            {selected.challenges.map((id) => {
              const done = completedChallenges.includes(id);
              const isCurrent = id === currentChallengeId;
              return (
                <div
                  key={id}
                  className="w-2.5 h-2.5 rounded-full border"
                  style={{
                    background: done ? selected.color : isCurrent ? selected.color + '44' : 'transparent',
                    borderColor: done ? selected.color : isCurrent ? selected.color : '#2a4a5a',
                  }}
                />
              );
            })}
            <span className="text-[10px] text-gray-500 ml-1 self-center">
              {selected.challenges.filter(id => completedChallenges.includes(id)).length}/{selected.challenges.length}
            </span>
          </div>

          {/* Act finale quote */}
          {selectedStatus === 'cleared' && (
            <div className="mt-2 p-2 rounded-lg" style={{ background: selected.color + '11' }}>
              <p className="text-[11px] italic" style={{ color: selected.color }}>
                "{STORY_ACTS[selected.act]?.finaleQuoteLance}"
              </p>
              <p className="text-[10px] text-gray-400 mt-1">
                — {STORY_ACTS[selected.act]?.nextActTeaser}
              </p>
            </div>
          )}
        </motion.div>
      )}

      {/* Act row summary (compact) */}
      <div className="flex gap-1.5">
        {ACT_CHECKPOINTS.map((cp) => {
          const status = getActStatus(completedChallenges, cp);
          const isActive = cp.act === currentAct;
          const done = cp.challenges.filter(id => completedChallenges.includes(id)).length;
          return (
            <button
              key={cp.act}
              onClick={() => setSelectedAct(selectedAct === cp.act ? null : cp.act)}
              className="flex-1 rounded-lg py-1.5 px-1 text-center transition-all"
              style={{
                background: isActive ? cp.color + '22' : 'rgba(13,33,55,0.6)',
                border: `1px solid ${isActive ? cp.color + '88' : '#1e3a4a'}`,
              }}
            >
              <div className="text-[10px] font-bold" style={{ color: status === 'locked' ? '#4a6a7a' : cp.color }}>
                {status === 'cleared' ? '✓' : `${done}/${cp.challenges.length}`}
              </div>
              <div className="text-[9px] text-gray-500 mt-0.5">Act {cp.act}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
