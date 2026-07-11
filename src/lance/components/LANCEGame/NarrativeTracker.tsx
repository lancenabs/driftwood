import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Map, BookOpen, Radio } from 'lucide-react';
import { GAME_CHALLENGES, CHALLENGE_ORDER, STORY_ACTS } from './lanceGameData';
import type { MoodEntry } from './LANCEGameContext';

interface Props {
  completedChallenges: string[];
  currentChallengeId: string | null;
  internAvatar: string;
  internName: string;
  moodLogs: MoodEntry[];
  xp: number;
}

type Tab = 'map' | 'directives' | 'chronicles';

// Act node positions on the radar SVG (440×190 viewBox)
const ACT_NODES = [
  { act: 1, x: 50,  y: 155, label: 'Island',   color: '#3ECFCF' },
  { act: 2, x: 130, y: 80,  label: 'Jungle',   color: '#22C55E' },
  { act: 3, x: 230, y: 110, label: 'Ridge',    color: '#A78BFA' },
  { act: 4, x: 320, y: 70,  label: 'Outpost',  color: '#F59E0B' },
  { act: 5, x: 390, y: 140, label: 'Shore',    color: '#EC4899' },
];

const RADAR_PATH = "M 50 155 Q 85 100 130 80 Q 185 90 230 110 T 320 70 Q 360 100 390 140";

function getCurrentActNumber(currentChallengeId: string | null): number {
  if (!currentChallengeId) return 1;
  const idx = CHALLENGE_ORDER.indexOf(currentChallengeId);
  if (idx < 7) return 1;
  if (idx < 15) return 2;
  if (idx < 21) return 3;
  if (idx < 27) return 4;
  return 5;
}

function getActStatus(completedChallenges: string[], actNum: number) {
  const boundaries = [0, 7, 15, 21, 27, 31];
  const ids = CHALLENGE_ORDER.slice(boundaries[actNum - 1], boundaries[actNum]);
  const done = ids.filter(id => completedChallenges.includes(id)).length;
  if (done === 0) return 'locked';
  if (done === ids.length) return 'cleared';
  return 'active';
}

function getActProgress(completedChallenges: string[], actNum: number) {
  const boundaries = [0, 7, 15, 21, 27, 31];
  const ids = CHALLENGE_ORDER.slice(boundaries[actNum - 1], boundaries[actNum]);
  return { done: ids.filter(id => completedChallenges.includes(id)).length, total: ids.length };
}

// Interpolate location dot position between act nodes based on progress
function getLocationDot(completedChallenges: string[], currentChallengeId: string | null) {
  const actNum = getCurrentActNumber(currentChallengeId);
  const { done, total } = getActProgress(completedChallenges, actNum);
  const progress = total > 0 ? done / total : 0;

  const current = ACT_NODES[actNum - 1];
  const next = ACT_NODES[Math.min(actNum, 4)];

  return {
    x: current.x + (next.x - current.x) * progress * 0.5,
    y: current.y + (next.y - current.y) * progress * 0.5,
    color: current.color,
  };
}

// ── Radar Hub Tab ──────────────────────────────────────────────────────────

function RadarHub({ completedChallenges, currentChallengeId }: Pick<Props, 'completedChallenges' | 'currentChallengeId'>) {
  const currentAct = getCurrentActNumber(currentChallengeId);
  const dot = getLocationDot(completedChallenges, currentChallengeId);
  const RADAR_LEN = 580; // estimated path length

  const completedActs = [1, 2, 3, 4, 5].filter(n => getActStatus(completedChallenges, n) === 'cleared').length;
  const dashOffset = RADAR_LEN * (1 - completedActs / 5);

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-xl overflow-hidden" style={{ background: '#06101a' }}>
        <svg viewBox="0 0 440 190" className="w-full">
          <defs>
            <filter id="radarGlow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Grid */}
          {[0, 110, 220, 330, 440].map(x => (
            <line key={x} x1={x} y1="0" x2={x} y2="190" stroke="#0f2030" strokeWidth="1" />
          ))}
          {[0, 48, 95, 143, 190].map(y => (
            <line key={y} x1="0" y1={y} x2="440" y2={y} stroke="#0f2030" strokeWidth="1" />
          ))}

          {/* Base dashed path */}
          <path
            d={RADAR_PATH}
            fill="none"
            stroke="#1e3a4a"
            strokeWidth="2"
            strokeDasharray="4 6"
            strokeLinecap="round"
          />

          {/* Completed path */}
          <motion.path
            d={RADAR_PATH}
            fill="none"
            stroke="#3ECFCF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={RADAR_LEN}
            initial={{ strokeDashoffset: RADAR_LEN }}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            filter="url(#radarGlow)"
          />

          {/* Act node circles */}
          {ACT_NODES.map((node) => {
            const status = getActStatus(completedChallenges, node.act);
            const isActive = node.act === currentAct;
            const { done, total } = getActProgress(completedChallenges, node.act);

            return (
              <g key={node.act}>
                {/* Outer pulse for active */}
                {isActive && (
                  <motion.circle
                    cx={node.x} cy={node.y} r={18}
                    fill="none"
                    stroke={node.color}
                    strokeWidth="1"
                    opacity={0.3}
                    animate={{ r: [14, 22, 14], opacity: [0.3, 0.05, 0.3] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                  />
                )}

                {/* Background circle */}
                <circle
                  cx={node.x} cy={node.y} r={14}
                  fill={status === 'locked' ? '#0a1a28' : '#0d2137'}
                  stroke={status === 'locked' ? '#1e3a4a' : node.color}
                  strokeWidth={isActive ? 2 : 1}
                  opacity={status === 'locked' ? 0.5 : 1}
                />

                {/* Progress arc */}
                {status !== 'locked' && total > 0 && (
                  <circle
                    cx={node.x} cy={node.y} r={11}
                    fill="none"
                    stroke={node.color}
                    strokeWidth="2.5"
                    strokeDasharray={`${(done / total) * 69.1} 69.1`}
                    strokeLinecap="round"
                    transform={`rotate(-90 ${node.x} ${node.y})`}
                    opacity={0.7}
                  />
                )}

                {/* Act label */}
                <text
                  x={node.x} y={node.y + 1}
                  textAnchor="middle" dominantBaseline="middle"
                  fontSize="9" fontWeight="bold"
                  fill={status === 'locked' ? '#2a4a5a' : node.color}
                >
                  {status === 'cleared' ? '✓' : node.act}
                </text>

                {/* Node name below */}
                <text
                  x={node.x} y={node.y + 20}
                  textAnchor="middle"
                  fontSize="8"
                  fill={status === 'locked' ? '#1e3a4a' : node.color}
                  opacity={0.85}
                >
                  {node.label}
                </text>

                {/* Progress fraction */}
                {status === 'active' && (
                  <text
                    x={node.x} y={node.y - 17}
                    textAnchor="middle"
                    fontSize="7"
                    fill={node.color}
                    opacity={0.7}
                  >
                    {done}/{total}
                  </text>
                )}
              </g>
            );
          })}

          {/* Location dot — pulsing teal marker */}
          <motion.circle
            cx={dot.x} cy={dot.y} r={6}
            fill={dot.color}
            filter="url(#radarGlow)"
            animate={{ r: [5, 7, 5], opacity: [1, 0.6, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <motion.circle
            cx={dot.x} cy={dot.y} r={3}
            fill="#fff"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </svg>
      </div>

      {/* Compact act status row */}
      <div className="grid grid-cols-5 gap-1">
        {ACT_NODES.map(node => {
          const status = getActStatus(completedChallenges, node.act);
          const { done, total } = getActProgress(completedChallenges, node.act);
          return (
            <div
              key={node.act}
              className="rounded-lg p-2 text-center"
              style={{
                background: node.act === currentAct ? node.color + '15' : '#0a1628',
                border: `1px solid ${node.act === currentAct ? node.color + '55' : '#1e3a4a'}`,
              }}
            >
              <div className="text-[9px] font-bold" style={{ color: status === 'locked' ? '#2a4a5a' : node.color }}>
                {status === 'cleared' ? '✓' : status === 'active' ? `${done}/${total}` : '—'}
              </div>
              <div className="text-[8px] text-gray-600 mt-0.5">{node.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Intern Directives Tab ─────────────────────────────────────────────────

function InternDirectives({
  currentChallengeId,
  completedChallenges,
  internAvatar,
  internName,
  moodLogs,
}: Pick<Props, 'currentChallengeId' | 'completedChallenges' | 'internAvatar' | 'internName' | 'moodLogs'>) {
  const challenge = useMemo(
    () => GAME_CHALLENGES.find(c => c.id === currentChallengeId),
    [currentChallengeId]
  );

  const moodAvg = useMemo(() => {
    if (!moodLogs.length) return null;
    const recent = moodLogs.slice(-7);
    return Math.round(recent.reduce((sum, e) => sum + e.mood, 0) / recent.length * 10) / 10;
  }, [moodLogs]);

  const internLine = useMemo(() => {
    if (!challenge?.internBanterLines?.length) return null;
    // Adaptive: pick line based on mood if available
    const idx = moodAvg !== null && moodAvg < 2.5 ? 0 : moodAvg !== null && moodAvg > 3.5 ? 2 : 1;
    return challenge.internBanterLines[Math.min(idx, challenge.internBanterLines.length - 1)];
  }, [challenge, moodAvg]);

  return (
    <div className="flex flex-col gap-3">
      {/* Intern avatar card */}
      <div
        className="rounded-xl p-4 flex items-start gap-3"
        style={{ background: 'linear-gradient(135deg, #0a1628, #0d2137)', border: '1px solid #3ECFCF33' }}
      >
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 text-2xl"
          style={{ background: '#0a2030', border: '2px solid #3ECFCF' }}
        >
          {internAvatar}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-teal-400 font-bold text-sm">{internName}</span>
            <span className="text-[10px] text-gray-500 bg-teal-900/30 px-2 py-0.5 rounded-full">Active Guide</span>
          </div>
          {internLine ? (
            <p className="text-gray-300 text-[12px] leading-relaxed">{internLine}</p>
          ) : (
            <p className="text-gray-500 text-[12px] italic">Complete your next challenge to hear from {internName}.</p>
          )}
        </div>
      </div>

      {/* Current mission */}
      {challenge && (
        <div className="rounded-xl p-3" style={{ background: '#0a1628', border: '1px solid #1e3a4a' }}>
          <div className="text-[10px] text-teal-400 font-bold uppercase tracking-widest mb-2">
            Current Mission
          </div>
          <div className="text-white font-semibold text-sm mb-1">{challenge.title}</div>
          <p className="text-gray-400 text-[11px] leading-relaxed">{challenge.taskDescription}</p>

          {/* Challenge steps */}
          <div className="mt-3 flex flex-col gap-1.5">
            {challenge.challengeSteps.map((step, i) => {
              const isCompleted = completedChallenges.includes(challenge.id);
              return (
                <div key={i} className="flex items-start gap-2">
                  <div
                    className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{
                      background: isCompleted ? '#22C55E22' : '#1e3a4a',
                      border: `1px solid ${isCompleted ? '#22C55E' : '#2a4a5a'}`,
                    }}
                  >
                    {isCompleted && <span className="text-[8px] text-green-400">✓</span>}
                  </div>
                  <p className="text-gray-400 text-[11px] leading-relaxed">{step}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Mood adaptive note */}
      {moodAvg !== null && (
        <div className="rounded-lg px-3 py-2" style={{ background: '#0a1628', border: '1px solid #1e3a4a' }}>
          <span className="text-[10px] text-gray-500">
            {internName}'s read on your recent energy: {' '}
            <span style={{ color: moodAvg < 2.5 ? '#F59E0B' : moodAvg > 3.5 ? '#22C55E' : '#3ECFCF' }}>
              {moodAvg < 2.5 ? 'Low — taking it steady is wise.' :
                moodAvg > 3.5 ? 'Strong — keep the momentum.' :
                  'Balanced — staying present is the move.'}
            </span>
          </span>
        </div>
      )}
    </div>
  );
}

// ── Escape Chronicles Tab ─────────────────────────────────────────────────

function EscapeChronicles({ completedChallenges, currentChallengeId }: Pick<Props, 'completedChallenges' | 'currentChallengeId'>) {
  const currentAct = getCurrentActNumber(currentChallengeId);

  const acts = [1, 2, 3, 4, 5] as const;

  return (
    <div className="flex flex-col gap-3">
      <div className="text-[10px] text-gray-500 uppercase tracking-widest px-1">
        Island Escape Journal
      </div>

      {acts.map(actNum => {
        const status = getActStatus(completedChallenges, actNum);
        const { done, total } = getActProgress(completedChallenges, actNum);
        const node = ACT_NODES[actNum - 1];
        const act = STORY_ACTS[actNum];
        const isCurrentAct = actNum === currentAct;

        return (
          <motion.div
            key={actNum}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: actNum * 0.08 }}
            className="rounded-xl overflow-hidden"
            style={{
              background: status === 'locked' ? '#080f1a' : '#0a1628',
              border: `1px solid ${status === 'locked' ? '#0f1e2e' : isCurrentAct ? node.color + '55' : node.color + '22'}`,
              opacity: status === 'locked' ? 0.5 : 1,
            }}
          >
            {/* Act header */}
            <div className="flex items-center justify-between px-3 py-2">
              <div className="flex items-center gap-2">
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{
                    background: node.color + (status === 'locked' ? '11' : '22'),
                    color: status === 'locked' ? '#2a4a5a' : node.color,
                  }}
                >
                  Act {actNum}
                </span>
                <span
                  className="font-bold text-sm"
                  style={{ color: status === 'locked' ? '#2a4a5a' : '#fff' }}
                >
                  {act.title}
                </span>
              </div>
              <span
                className="text-[10px] font-bold uppercase tracking-wider"
                style={{
                  color: status === 'cleared' ? '#22C55E' :
                    status === 'active' ? node.color : '#2a4a5a'
                }}
              >
                {status === 'cleared' ? '✓ CLEARED' :
                  status === 'active' ? 'ACTIVE' : 'LOCKED'}
              </span>
            </div>

            {/* Progress bar */}
            {status !== 'locked' && (
              <div className="px-3 pb-1">
                <div className="h-1 rounded-full w-full" style={{ background: '#1e3a4a' }}>
                  <motion.div
                    className="h-1 rounded-full"
                    style={{ background: node.color }}
                    initial={{ width: '0%' }}
                    animate={{ width: `${(done / total) * 100}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  />
                </div>
                <div className="text-[9px] text-gray-600 mt-0.5 text-right">
                  {done}/{total} challenges
                </div>
              </div>
            )}

            {/* Theme and finale quote for completed acts */}
            {status !== 'locked' && (
              <div className="px-3 pb-3">
                <p className="text-[11px] text-gray-500">{act.theme}</p>
                {status === 'cleared' && (
                  <div className="mt-2 p-2 rounded-lg" style={{ background: node.color + '0d' }}>
                    <p className="text-[11px] italic" style={{ color: node.color }}>
                      "{act.finaleQuoteLance}"
                    </p>
                    <p className="text-[10px] text-gray-500 mt-1 font-medium">
                      → {act.nextActTeaser}
                    </p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

// ── Main NarrativeTracker ──────────────────────────────────────────────────

export default function NarrativeTracker(props: Props) {
  const [tab, setTab] = useState<Tab>('map');

  const tabs: { id: Tab; label: string; Icon: React.ElementType }[] = [
    { id: 'map', label: 'Radar', Icon: Radio },
    { id: 'directives', label: 'Directives', Icon: BookOpen },
    { id: 'chronicles', label: 'Chronicles', Icon: Map },
  ];

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: '#06101a', border: '1px solid #1e3a4a' }}
    >
      {/* Tab bar */}
      <div className="flex" style={{ borderBottom: '1px solid #1e3a4a' }}>
        {tabs.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[11px] font-semibold transition-all"
            style={{
              color: tab === id ? '#3ECFCF' : '#4a6a7a',
              background: tab === id ? 'rgba(62,207,207,0.08)' : 'transparent',
              borderBottom: tab === id ? '2px solid #3ECFCF' : '2px solid transparent',
            }}
          >
            <Icon size={12} />
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="p-3">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
          >
            {tab === 'map' && (
              <RadarHub
                completedChallenges={props.completedChallenges}
                currentChallengeId={props.currentChallengeId}
              />
            )}
            {tab === 'directives' && (
              <InternDirectives
                currentChallengeId={props.currentChallengeId}
                completedChallenges={props.completedChallenges}
                internAvatar={props.internAvatar}
                internName={props.internName}
                moodLogs={props.moodLogs}
              />
            )}
            {tab === 'chronicles' && (
              <EscapeChronicles
                completedChallenges={props.completedChallenges}
                currentChallengeId={props.currentChallengeId}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
