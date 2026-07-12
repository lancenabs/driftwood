import React, { Suspense, useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Wind, Heart, Moon, Anchor, Smile, Activity, RefreshCw, Zap } from 'lucide-react';
import { useGame } from './LANCEGameContext';
import { NARRATOR, SECOND_VOICE } from './narrator';
import { useLANCEAI } from './useLANCEAI';
import { GAME_CHALLENGES } from './lanceGameData';
import type { MoodEntry } from './LANCEGameContext';

const DailyCheckIn    = React.lazy(() => import('./tools/DailyCheckIn'));
const BreathworkTool  = React.lazy(() => import('./tools/BreathworkTool'));
const GratitudeLog    = React.lazy(() => import('./tools/GratitudeLog'));
const SleepLog        = React.lazy(() => import('./tools/SleepLog'));
const GroundingTool   = React.lazy(() => import('./tools/GroundingTool'));
const EmotionWheel    = React.lazy(() => import('./tools/EmotionWheel'));
const BodyScan        = React.lazy(() => import('./tools/BodyScan'));

function ToolLoader() {
  return (
    <div className="h-full flex items-center justify-center bg-white">
      <div className="w-7 h-7 rounded-full border-2 animate-spin" style={{ borderColor: '#e5e7eb', borderTopColor: '#0E7C7C' }} />
    </div>
  );
}

const LANCE_FALLBACK_LINES = [
  "You came back! I KNEW you'd come back. Okay okay okay — how's the water today?",
  "I saved you a spot by the fire. Checking in counts as tending it, that's a REAL rule.",
  "One honest minute. That's the whole chore. I'll hold your stick.",
  "The Collier says a read barometer never sinks a ship. He says everything like that.",
  "However today actually went — bring it. The Jumble doesn't grade weather.",
];

const QUICK_TOOLS = [
  { id: 'breathwork', label: 'Breathwork', emoji: '🧘', icon: Wind,     color: '#1CB0F6', bg: '#E8F7FF' },
  { id: 'gratitude',  label: 'Gratitude',  emoji: '💖', icon: Heart,    color: '#FF4B4B', bg: '#FFF0F0' },
  { id: 'sleep',      label: 'Sleep Log',  emoji: '🌙', icon: Moon,     color: '#8B5CF6', bg: '#F3F0FF' },
  { id: 'grounding',  label: 'Grounding',  emoji: '⚓', icon: Anchor,   color: '#00CD9C', bg: '#E0FFF6' },
  { id: 'emotions',   label: 'Emotions',   emoji: '🌈', icon: Smile,    color: '#FF9600', bg: '#FFF4E0' },
  { id: 'body_scan',  label: 'Body Scan',  emoji: '🌊', icon: Activity, color: '#58CC02', bg: '#F0FFE4' },
];

type ActivTool = 'checkin' | 'breathwork' | 'gratitude' | 'sleep' | 'grounding' | 'emotions' | 'body_scan' | null;

interface Props {
  onOpenTool?: (toolId: string) => void;
}

const DAILY_TIPS = [
  "Even 2 minutes of breathwork can shift your nervous system from threat to calm.",
  "Naming an emotion out loud reduces its intensity. 'I feel anxious' is different from 'I am anxious.'",
  "Sleep is when emotional memory consolidates. Protecting sleep protects your resilience.",
  "The vagus nerve connects your gut and brain — a slow exhale activates the calm branch.",
  "Gratitude rewires the prefrontal cortex over time. It isn't toxic positivity — it's neuroscience.",
  "Grounding works because sensory input overrides the threat-detection system. Five things you see, right now.",
  "Movement completes the stress cycle. The body stores what the mind can't finish processing.",
  "Rumination feels like problem-solving but it isn't. Physical motion changes the chemistry.",
  "Your nervous system can't tell a real threat from an imagined one. Breathe first, evaluate second.",
  "Self-compassion activates the same neural pathways as receiving kindness from another person.",
  "Emotional regulation is a skill, not a personality trait. You're practicing it every time you check in.",
  "Chronic stress shrinks the hippocampus. Mindfulness practice actually reverses that.",
  "The pause between impulse and response is where freedom lives.",
  "Belonging needs don't diminish with age. Connection is medicine with no side effects.",
  "You don't have to earn rest. Recovery is part of the work, not a reward for finishing it.",
  "Anxiety and excitement are the same physiological state. You choose the label.",
  "A 4-second inhale, 7-second hold, 8-second exhale engages the parasympathetic system deeply.",
  "Social connection is as health-protective as regular exercise and adequate sleep.",
  "The body holds what the mind represses. Body-based work reaches what talk therapy can't always touch.",
  "30 seconds of cold water on your face triggers the diving reflex — a near-instant nervous system reset.",
  "You are not your thoughts. Thoughts are weather. You are the sky they pass through.",
];

const MILESTONE_STREAKS = [3, 7, 30];

const MILESTONE_MESSAGES: Record<number, { title: string; sub: string }> = {
  3:  { title: '3-Day Streak! 🔥',  sub: 'Three days in a row. The little robots are counting along. It counts.' },
  7:  { title: 'One Full Week! 🌟',  sub: 'Seven consecutive check-ins. The whole Jumble is insufferably proud of you.' },
  30: { title: '30 Days Strong! 🏆', sub: 'A full month. You have proven something about yourself that no algorithm predicted. This is extraordinary.' },
};

function getWeekDots(moodLogs: MoodEntry[]) {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const dow = today.getDay();
  const mondayOffset = (dow + 6) % 7;
  const monday = new Date(today);
  monday.setDate(today.getDate() - mondayOffset);
  const checkedDates = new Set(moodLogs.map(l => l.date));
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    return {
      label: ['M', 'T', 'W', 'T', 'F', 'S', 'S'][i],
      dateStr,
      checked: checkedDates.has(dateStr),
      isToday: dateStr === todayStr,
      isFuture: dateStr > todayStr,
    };
  });
}

export default function CheckInTab({ onOpenTool }: Props) {
  const { userName, intern, streak, currentChallengeId, moodLogs } = useGame();
  const { lanceResponse, internResponse, loading: aiLoading, fetchResponses } = useLANCEAI();
  const [activeTool, setActiveTool] = useState<ActivTool>(null);
  const [lanceFallbackIdx] = useState(() => Math.floor(Math.random() * LANCE_FALLBACK_LINES.length));
  const [fetchAttempted, setFetchAttempted] = useState(false);
  const [showMilestone, setShowMilestone] = useState<number | null>(null);

  useEffect(() => {
    fetchResponses({ trigger: 'home' });
    setFetchAttempted(true);
  }, []);

  // Fire milestone celebration when streak hits 3, 7, or 30
  useEffect(() => {
    if (!MILESTONE_STREAKS.includes(streak)) return;
    const key = `lance_streak_milestone_${streak}`;
    if (localStorage.getItem(key)) return;
    localStorage.setItem(key, '1');
    setShowMilestone(streak);
    const t = setTimeout(() => setShowMilestone(null), 4500);
    return () => clearTimeout(t);
  }, [streak]);

  const weekDots = useMemo(() => getWeekDots(moodLogs), [moodLogs]);
  const todayTip = useMemo(() => {
    const dayIndex = Math.floor(Date.now() / 86400000);
    return DAILY_TIPS[dayIndex % DAILY_TIPS.length];
  }, []);

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  })();

  // DRIFTWOOD SEAM: the island's challenge arc doesn't sail here — the card
  // points at this world's own Milestone Log instead.
  const nextMilestone = (() => {
    try {
      const closed = (JSON.parse(localStorage.getItem('driftwood_milestone_log_v1') || '{}').closed ?? []) as string[];
      return { n: closed.length + 1, total: 31, closed: closed.length };
    } catch { return { n: 1, total: 31, closed: 0 }; }
  })();
  const currentChallenge = currentChallengeId
    ? GAME_CHALLENGES.find(c => c.id === currentChallengeId)
    : null;

  const closeTool = () => setActiveTool(null);

  return (
    <div className="flex flex-col h-full overflow-y-auto" style={{ background: '#F9FAFB' }}>

      {/* ── Header ── */}
      <div
        className="shrink-0 px-5 pt-safe-top pb-5"
        style={{ background: 'white', borderBottom: '1px solid #F3F4F6' }}
      >
        <div className="pt-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{today}</p>
          <h1 className="text-2xl font-black text-gray-900 mt-0.5">
            {greeting}{userName ? `, ${userName}` : ''}
          </h1>
          {/* Week streak row */}
          <div className="mt-3 flex items-center gap-2">
            <span className="text-sm mr-1" style={{ filter: weekDots.some(d => d.checked) ? 'none' : 'grayscale(1) opacity(0.35)' }}>🔥</span>
            <div className="flex gap-1.5">
              {weekDots.map((dot, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center transition-all"
                    style={{
                      background: dot.checked
                        ? 'linear-gradient(135deg,#FF9600,#FFCC00)'
                        : dot.isToday
                        ? 'rgba(255,150,0,0.12)'
                        : 'rgba(0,0,0,0.05)',
                      border: dot.isToday
                        ? '2px solid #FF9600'
                        : dot.checked
                        ? '2px solid transparent'
                        : '2px solid #E5E7EB',
                      boxShadow: dot.checked ? '0 2px 8px rgba(255,150,0,0.35)' : 'none',
                    }}
                  >
                    {dot.checked
                      ? <span className="text-[10px] text-white font-black">✓</span>
                      : dot.isFuture
                      ? null
                      : <span className="text-[10px] text-gray-300 font-bold">·</span>
                    }
                  </div>
                  <span
                    className="text-[9px] font-bold uppercase"
                    style={{ color: dot.isToday ? '#FF9600' : '#9CA3AF' }}
                  >
                    {dot.label}
                  </span>
                </div>
              ))}
            </div>
            {streak > 0 && (
              <span className="text-xs font-black text-orange-500 ml-1">{streak}d</span>
            )}
          </div>
        </div>
      </div>

      <div className="px-5 pt-5 pb-28 space-y-6 max-w-2xl mx-auto w-full">

        {/* ── LANCE Speech Bubble ── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-3"
        >
          <img src={NARRATOR.portrait} alt="" draggable={false}
            className="shrink-0 w-9 h-9 rounded-xl object-cover"
            onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          <div className="flex-1">
            <div
              className="text-[9px] font-black uppercase tracking-widest mb-1 flex items-center justify-between"
              style={{ color: '#0E7C7C88' }}
            >
              <span>{NARRATOR.name}</span>
              {!aiLoading && (
                <button
                  onClick={() => fetchResponses({ trigger: 'home' })}
                  className="flex items-center gap-1 opacity-60 hover:opacity-100 transition"
                >
                  <RefreshCw className="w-2.5 h-2.5" />
                  <span>refresh</span>
                </button>
              )}
            </div>
            <div
              className="px-4 py-3 rounded-2xl rounded-tl-sm text-xs font-medium leading-relaxed"
              style={{
                background: '#EAF7F6',
                border: '1px solid rgba(14,124,124,0.25)',
                color: aiLoading ? '#7FC8C4' : '#0E4F4F',
              }}
            >
              {aiLoading
                ? <span className="inline-flex gap-1">
                    <motion.span animate={{ opacity: [0.3,1,0.3] }} transition={{ duration: 1, repeat: Infinity, delay: 0 }}>●</motion.span>
                    <motion.span animate={{ opacity: [0.3,1,0.3] }} transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}>●</motion.span>
                    <motion.span animate={{ opacity: [0.3,1,0.3] }} transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}>●</motion.span>
                  </span>
                : `"${lanceResponse ?? LANCE_FALLBACK_LINES[lanceFallbackIdx]}"`
              }
            </div>
          </div>
        </motion.div>

        {/* ── Primary Check-In Card ── */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => setActiveTool('checkin')}
          className="w-full text-left rounded-3xl overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #3ECFCF 0%, #0E7C7C 100%)',
            boxShadow: '0 6px 24px rgba(14,124,124,0.28)',
          }}
        >
          <div className="px-6 py-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">📋</span>
              <span
                className="text-[10px] font-black uppercase tracking-[0.2em]"
                style={{ color: 'rgba(255,255,255,0.8)' }}
              >
                Daily Check-In
              </span>
            </div>
            <h2 className="text-xl font-black text-white leading-tight">
              How are you doing today?
            </h2>
            <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.75)' }}>
              Log your mood, energy, and what's on your mind.
            </p>
            <div
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full font-black text-sm"
              style={{ background: 'rgba(255,255,255,0.25)', color: 'white' }}
            >
              Start Check-In →
            </div>
          </div>
        </motion.button>

        {/* ── Today's Challenge Banner ── */}
        {nextMilestone.closed < nextMilestone.total && (
          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => window.dispatchEvent(new CustomEvent('driftwood:go-home'))}
            className="w-full text-left rounded-3xl overflow-hidden"
            style={{
              background: 'linear-gradient(100deg, #F59E0B 0%, #F2683A 100%)',
              boxShadow: '0 4px 18px rgba(242,104,58,0.3)',
            }}
          >
            <div className="px-5 py-4 flex items-center gap-4">
              <div
                className="shrink-0 w-11 h-11 rounded-2xl flex items-center justify-center"
                style={{ background: 'rgba(255,255,255,0.2)' }}
              >
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div
                  className="text-[9px] font-black uppercase tracking-[0.2em] mb-0.5"
                  style={{ color: 'rgba(255,255,255,0.8)' }}
                >
                  The Milestone Log
                </div>
                <div className="text-sm font-black text-white truncate">
                  Survival first {nextMilestone.n} of {nextMilestone.total} awaits
                </div>
                <div
                  className="text-[11px] mt-0.5 leading-snug line-clamp-1"
                  style={{ color: 'rgba(255,255,255,0.75)' }}
                >
                  Open the log on the shore — the crew is waiting at the next first.
                </div>
              </div>
              <div className="shrink-0 text-white opacity-70">›</div>
            </div>
          </motion.button>
        )}

        {/* ── Campfire pointer — the games live one tab over ── */}
        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.14 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => window.dispatchEvent(new CustomEvent('driftwood:open-campfire'))}
          data-testid="checkin-campfire"
          className="w-full text-left rounded-2xl bg-white border-2 border-outline-variant/50 hover:border-amber-400/60 transition-colors px-5 py-3.5 flex items-center gap-3 shadow-sm"
        >
          <span className="text-2xl shrink-0">🏕️</span>
          <span className="flex-1 min-w-0">
            <span className="block text-[13px] font-black text-slate-800">Campfire Games</span>
            <span className="block text-[11px] text-slate-500">twenty ways to warm the family — one round tonight counts</span>
          </span>
          <span className="text-amber-500 text-lg shrink-0">→</span>
        </motion.button>

        {/* ── Intern banter ── */}
        {intern?.name && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex items-start gap-3"
          >
            <img src={SECOND_VOICE.portrait} alt="" draggable={false} className="w-9 h-9 rounded-xl object-cover shrink-0 mt-0.5" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            <div className="flex-1">
              <div
                className="text-[9px] font-black uppercase tracking-widest mb-1"
                style={{ color: '#46A30288' }}
              >
                {SECOND_VOICE.name}
              </div>
              <div
                className="px-4 py-3 rounded-2xl rounded-tl-sm text-xs font-medium leading-relaxed"
                style={{
                  background: '#F0FFF7',
                  border: '1px solid rgba(80,200,120,0.25)',
                  color: aiLoading ? '#86EFAC' : '#1a5c38',
                }}
              >
                {aiLoading
                  ? <span className="inline-flex gap-1">
                      <motion.span animate={{ opacity: [0.3,1,0.3] }} transition={{ duration: 1, repeat: Infinity, delay: 0.1 }}>●</motion.span>
                      <motion.span animate={{ opacity: [0.3,1,0.3] }} transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}>●</motion.span>
                      <motion.span animate={{ opacity: [0.3,1,0.3] }} transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}>●</motion.span>
                    </span>
                  : internResponse
                    ?? `${userName ? `${userName}, ` : ''}I'm here whenever you need support!`
                }
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Quick Tools Grid ── */}
        <div>
          <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-3">
            Quick Tools
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {QUICK_TOOLS.map(tool => {
              const Icon = tool.icon;
              return (
                <motion.button
                  key={tool.id}
                  whileTap={{ scale: 0.93 }}
                  onClick={() => setActiveTool(tool.id as ActivTool)}
                  className="flex flex-col items-center gap-2 p-4 rounded-2xl text-center bg-white border-2 border-outline-variant/50 hover:border-primary/40 transition-colors shadow-sm"
                >
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center"
                    style={{ background: tool.bg }}
                  >
                    <Icon className="w-5 h-5" style={{ color: tool.color }} />
                  </div>
                  <span className="text-[11px] font-bold leading-tight text-slate-600">
                    {tool.label}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* ── Tip card ── */}
        <div
          className="rounded-3xl px-5 py-4"
          style={{ background: '#FFF8F0', border: '1px solid #FFD9A0' }}
        >
          <p className="text-xs font-black text-orange-600 uppercase tracking-wider mb-1">Today's Tip</p>
          <p className="text-sm text-orange-900 font-medium">{todayTip}</p>
        </div>
      </div>

      {/* ── Milestone celebration overlay ── */}
      <AnimatePresence>
        {showMilestone && MILESTONE_MESSAGES[showMilestone] && (
          <motion.div
            key={`milestone-${showMilestone}`}
            className="absolute inset-0 z-50 flex items-center justify-center px-6"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            onClick={() => setShowMilestone(null)}
          >
            <motion.div
              initial={{ scale: 0.7, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.85, y: -20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 22 }}
              className="w-full max-w-xs rounded-3xl p-6 text-center"
              style={{
                background: 'linear-gradient(135deg, #FF9600 0%, #FFCC00 100%)',
                boxShadow: '0 16px 64px rgba(255,150,0,0.5)',
              }}
            >
              <p className="text-3xl mb-2">🏅</p>
              <h3 className="text-xl font-black text-white mb-2">
                {MILESTONE_MESSAGES[showMilestone].title}
              </h3>
              <p className="text-sm text-white/85 leading-snug">
                {MILESTONE_MESSAGES[showMilestone].sub}
              </p>
              <p className="text-[10px] text-white/60 mt-4 font-bold uppercase tracking-wider">
                Tap to dismiss
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Tool overlays ── */}
      <AnimatePresence>
        {activeTool && (
          <motion.div
            key={activeTool}
            className="absolute inset-0 z-50 bg-white"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
          >
            <Suspense fallback={<ToolLoader />}>
              {activeTool === 'checkin'    && <DailyCheckIn   onBack={closeTool} />}
              {activeTool === 'breathwork' && <BreathworkTool onBack={closeTool} />}
              {activeTool === 'gratitude'  && <GratitudeLog   onBack={closeTool} />}
              {activeTool === 'sleep'      && <SleepLog        onBack={closeTool} />}
              {activeTool === 'grounding'  && <GroundingTool   onBack={closeTool} />}
              {activeTool === 'emotions'   && <EmotionWheel    onBack={closeTool} />}
              {activeTool === 'body_scan'  && <BodyScan        onBack={closeTool} />}
            </Suspense>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
