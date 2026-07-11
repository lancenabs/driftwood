import React, { useState, useRef } from 'react';
import { Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MoodLog } from '../../../types';
import ScreenMood from '../../ScreenMood';
import { useGame } from '../LANCEGameContext';
import BigBackButton from '../BigBackButton';

interface Props {
  onBack: () => void;
  onChallengeComplete?: () => void;
}

const STORAGE_KEY = 'therapy_mood_logs';

function loadLogs(): MoodLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

interface CheckItem {
  label: string;
  sublabel: string;
  done: boolean;
}

export default function MoodLogTool({ onBack, onChallengeComplete }: Props) {
  const { logMood } = useGame();
  const [moodLogs, setMoodLogs] = useState<MoodLog[]>(loadLogs);

  const isChallengeTool = !!onChallengeComplete;

  // Challenge checklist tracking
  const [quadrantDone, setQuadrantDone] = useState(false);
  const [bubblesDone, setBubblesDone] = useState(false);
  const [reflectionDone, setReflectionDone] = useState(false);
  const [savedDone, setSavedDone] = useState(false);
  const [plutchikDone, setPlutchikDone] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  // Tracks whether the in-progress check-in used Plutchik mode
  const lastModeWasPlutchik = useRef(false);

  const checklist: CheckItem[] = [
    { label: 'Pick energy quadrant', sublabel: 'Choose one of the four mood zones', done: quadrantDone },
    { label: 'Choose emotion bubbles', sublabel: 'Tap words from the bubble cloud', done: bubblesDone },
    { label: 'Write reflection note', sublabel: 'Add a note about your mood', done: reflectionDone },
    { label: 'Save your check-in', sublabel: 'Log this entry to history', done: savedDone },
    { label: 'Complete Plutchik Wheel', sublabel: 'Switch to Plutchik tab & save a log', done: plutchikDone },
  ];

  const doneCount = checklist.filter(c => c.done).length;
  const allDone = doneCount === checklist.length;

  const handleAddMoodLog = (log: MoodLog) => {
    const updated = [log, ...moodLogs.filter(l => l.date !== log.date)];
    setMoodLogs(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    logMood({ date: log.date, mood: log.score, energy: log.score, note: log.note });

    if (isChallengeTool) {
      setSavedDone(true);
      if (lastModeWasPlutchik.current) {
        setPlutchikDone(true);
        lastModeWasPlutchik.current = false;
      }
    }
  };

  const handleClearLogs = () => {
    setMoodLogs([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <div className="relative flex flex-col h-full overflow-hidden" style={{ isolation: 'isolate', background: '#F7F8FA' }}>
      {/* Tidepools region — the mood category's home, softly behind everything */}
      <div aria-hidden className="absolute inset-0" style={{
        backgroundImage: 'url(/region-heroes/mood.webp)',
        backgroundSize: 'cover', backgroundPosition: 'center',
        filter: 'blur(20px)', transform: 'scale(1.1)', opacity: 0.35,
        zIndex: -1, pointerEvents: 'none',
      }} />
      <div aria-hidden className="absolute inset-0" style={{
        background: 'linear-gradient(180deg, rgba(247,248,250,0.9) 0%, rgba(247,248,250,0.94) 100%)',
        zIndex: -1, pointerEvents: 'none',
      }} />

      {/* Header */}
      <div className="relative shrink-0 flex items-center gap-3 px-4 py-3 sticky top-0 z-20" style={{
        background: 'rgba(255,255,255,0.75)',
        backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255,255,255,0.85)',
      }}>
        <BigBackButton onBack={onBack} />
        <img src="/icons/mood_log.webp" alt="" draggable={false}
          style={{ width: 34, height: 34, borderRadius: 10, boxShadow: '0 4px 10px rgba(139,92,246,0.3)' }} />
        <div>
          <h2 className="text-sm font-black leading-none" style={{ color: '#1C1C1E' }}>Mood Log</h2>
          <div className="text-[10px] font-semibold mt-0.5" style={{ color: '#6B7280' }}>Daily tool · Mood &amp; Tracking</div>
        </div>
        {isChallengeTool && (
          <div className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black"
            style={{ background: allDone ? '#E8FFD0' : 'rgba(255,255,255,0.8)', color: allDone ? '#46A302' : '#7C3AED', border: '1px solid rgba(124,58,237,0.25)' }}>
            <span>{doneCount}/5</span>
            <span>{allDone ? '✓' : '●'}</span>
          </div>
        )}
      </div>

      {/* App content */}
      <div className="relative flex-1 overflow-y-auto">
        <ScreenMood
          moodLogs={moodLogs}
          onAddMoodLog={handleAddMoodLog}
          onClearLogs={handleClearLogs}
          onQuadrantSelected={isChallengeTool ? () => setQuadrantDone(true) : undefined}
          onBubblesProceeded={isChallengeTool ? () => setBubblesDone(true) : undefined}
          onReflectionTyped={isChallengeTool ? () => setReflectionDone(true) : undefined}
          onPlutchikProceeded={isChallengeTool ? () => { lastModeWasPlutchik.current = true; } : undefined}
        />

        {/* ── Floating challenge checklist ── */}
        {isChallengeTool && (
          <div className="absolute top-4 right-3 z-30" style={{ width: 196 }}>
            <AnimatePresence mode="wait">
              {collapsed ? (
                <motion.button
                  key="pill"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  onClick={() => setCollapsed(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-2xl shadow-lg border"
                  style={{
                    background: allDone ? '#F0FFF6' : 'white',
                    borderColor: allDone ? '#58CC02' : '#E5E7EB',
                  }}
                >
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black text-white"
                    style={{ background: allDone ? '#58CC02' : '#8B5CF6' }}
                  >
                    {doneCount}
                  </div>
                  <span className="text-[10px] font-black text-slate-600">{doneCount}/5 done</span>
                </motion.button>
              ) : (
                <motion.div
                  key="panel"
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="rounded-2xl overflow-hidden"
                  style={{
                    border: `1.5px solid ${allDone ? '#58CC02' : '#E5E7EB'}`,
                    boxShadow: allDone
                      ? '0 6px 28px rgba(88,204,2,0.22)'
                      : '0 6px 28px rgba(0,0,0,0.13)',
                    background: 'white',
                  }}
                >
                  {/* Panel header */}
                  <div
                    className="flex items-center justify-between px-3 py-2.5"
                    style={{ background: allDone ? '#58CC02' : '#7C3AED' }}
                  >
                    <div>
                      <div className="text-[8px] font-black uppercase tracking-widest text-white/70">
                        Challenge Tasks
                      </div>
                      <div className="text-[11px] font-black text-white">
                        {allDone ? 'All done! 🎉' : `${doneCount} of 5 complete`}
                      </div>
                    </div>
                    <button
                      onClick={() => setCollapsed(true)}
                      className="w-5 h-5 rounded-full flex items-center justify-center text-white/80 hover:text-white text-sm font-bold leading-none"
                      style={{ background: 'rgba(255,255,255,0.18)' }}
                    >
                      −
                    </button>
                  </div>

                  {/* Progress bar */}
                  <div className="h-1.5 bg-slate-100">
                    <motion.div
                      className="h-full"
                      style={{ background: allDone ? '#58CC02' : '#8B5CF6' }}
                      animate={{ width: `${(doneCount / 5) * 100}%` }}
                      transition={{ duration: 0.4, ease: 'easeOut' }}
                    />
                  </div>

                  {/* Checklist items */}
                  <div className="divide-y divide-slate-50 bg-white">
                    {checklist.map((item, i) => (
                      <motion.div
                        key={i}
                        className="flex items-start gap-2.5 px-3 py-2"
                        animate={{ opacity: item.done ? 0.75 : 1 }}
                      >
                        <div
                          className="shrink-0 mt-0.5 w-4 h-4 rounded-full flex items-center justify-center transition-all duration-300"
                          style={{
                            background: item.done ? '#58CC02' : 'transparent',
                            border: item.done ? 'none' : '1.5px solid #D1D5DB',
                          }}
                        >
                          {item.done && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3.5} />}
                        </div>
                        <div className="min-w-0">
                          <div
                            className="text-[10px] font-black leading-tight"
                            style={{
                              color: item.done ? '#6B7280' : '#1a1a1a',
                              textDecoration: item.done ? 'line-through' : 'none',
                            }}
                          >
                            {item.label}
                          </div>
                          {!item.done && (
                            <div className="text-[9px] text-slate-400 leading-snug mt-0.5">
                              {item.sublabel}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Complete button */}
                  <AnimatePresence>
                    {allDone && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="px-3 pb-3 pt-1"
                      >
                        <motion.button
                          whileTap={{ scale: 0.97, y: 2 }}
                          onClick={onChallengeComplete}
                          className="w-full py-2.5 rounded-xl font-black text-white text-[10px] uppercase tracking-wider"
                          style={{
                            background: '#58CC02',
                            boxShadow: '0 3px 0 #46A302',
                          }}
                        >
                          Challenge Complete →
                        </motion.button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
