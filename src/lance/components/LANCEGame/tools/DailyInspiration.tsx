import React, { useState, useEffect } from 'react';
import { NARRATOR } from '../narrator';
import { motion, AnimatePresence } from 'motion/react';
import { RefreshCw, Brain, Check } from 'lucide-react';
import { useGame } from '../LANCEGameContext';
import BigBackButton from '../BigBackButton';
import { LANCE_POSES } from '../GameCharacter';

interface Tip { title: string; text: string; actionApp?: string; actionLabel?: string; }

const ACTION_DESTINATIONS: Record<string, string> = {
  cranial_reset: 'cranial_nerve_gym',
  scream_room: 'scream_release_room',
  grief_space: 'grief_space',
  sound_bath: 'sound_bath',
  somatic_tremor: 'tremor_pacing_lab',
  anxiety_detox: 'prefrontal_detox',
  manifestation: 'ras_vision_board',
  daily_habits: 'habit_lab',
  self_talk: 'self_talk_mirror',
  quests: '__challenges__',
  inner_child: 'inner_child',
  mood_diary: 'mood_log',
};

const TIPS_BY_SCORE: Record<number, Tip[]> = {
  1: [
    { title: 'Nervous system redline', text: 'Your load is critical right now. Step away from complex tasks — three minutes in the Cranial Nerve Gym or a few slow, controlled breaths can bring you back down.', actionApp: 'cranial_reset', actionLabel: 'Open Cranial Nerve Gym' },
    { title: 'System overload', text: "Pushing through won't help right now. Try a physical shake-out, or let it out fully in the Scream Release Room.", actionApp: 'scream_room', actionLabel: 'Enter Scream Release Room' },
    { title: 'Emotional exhaustion', text: 'This is a boundary-enforcement moment. Decline what you can today — your job is rest and basic containment.', actionApp: 'grief_space', actionLabel: 'Open Grief Release Space' },
  ],
  2: [
    { title: 'Elevated but manageable', text: 'Try the Sound Bath to bring your system down to a quieter register. Low sensory input is the right call right now.', actionApp: 'sound_bath', actionLabel: 'Launch Sound Bath' },
    { title: 'A temporary dip', text: "This isn't your baseline, it's a fluctuation. Unclamp your jaw, drop your shoulders, and let it pass.", actionApp: 'somatic_tremor', actionLabel: 'Open Tremor Pacing Lab' },
    { title: 'Catch the bias', text: 'Write down your loudest anxious thought, then find two real flaws in it.', actionApp: 'anxiety_detox', actionLabel: 'Open Prefrontal Detox' },
  ],
  3: [
    { title: 'Steady middle ground', text: "Neither high nor low — a good moment to nudge things 1% forward. Check your RAS Vision Board.", actionApp: 'manifestation', actionLabel: 'Open RAS Vision Board' },
    { title: 'Quiet is a win too', text: "You don't need euphoria for a good day. Balanced neutrality counts. Keep your routine steady.", actionApp: 'daily_habits', actionLabel: 'Review Habits' },
    { title: 'A good calibration point', text: 'Try the Self-Talk Mirror — record one honest, non-judgmental observation about today.', actionApp: 'self_talk', actionLabel: 'Launch Self-Talk Mirror' },
  ],
  4: [
    { title: 'Good momentum', text: "You're running efficiently today. Worth tackling your hardest challenge or something expressive.", actionApp: 'quests', actionLabel: 'View Challenges' },
    { title: 'Lock in the trend', text: 'A quick habit check-in now helps this positive trajectory stick.', actionApp: 'daily_habits', actionLabel: 'Open Habits' },
    { title: 'Creative surplus', text: "You've got room for something exploratory today — the Inner Child Hub is a good fit.", actionApp: 'inner_child', actionLabel: 'Enter Inner Child Hub' },
  ],
  5: [
    { title: 'Peak state', text: 'Enjoy it. A great day to share this feeling with someone you trust.', actionApp: 'manifestation', actionLabel: 'Open RAS Vision Board' },
    { title: 'Strong balance', text: 'Capture this in your Mood Log with a quick note — it helps to see what led here.', actionApp: 'mood_diary', actionLabel: 'Log in Mood Log' },
    { title: 'Keep going', text: "Don't take a good baseline for granted — keep your routine running.", actionApp: 'quests', actionLabel: 'View Challenges' },
  ],
};

const DEFAULT_TIPS: Tip[] = [
  { title: 'No recent check-in', text: 'Log a quick mood check-in so this can give you something tailored instead of a generic nudge.', actionApp: 'mood_diary', actionLabel: 'Log a mood' },
  { title: 'Start here', text: 'Use the mood logger regularly — the more data, the more specific these directives get.', actionApp: 'mood_diary', actionLabel: 'Log a mood' },
];

interface Props { onBack: () => void; onOpenTool?: (toolId: string) => void; }

export default function DailyInspiration({ onBack, onOpenTool }: Props) {
  const { moodLogs, addXp } = useGame();
  const [tipIndex, setTipIndex] = useState(0);
  const [isRecalibrating, setIsRecalibrating] = useState(false);
  const [isApplied, setIsApplied] = useState(false);

  const latestScore = (() => {
    if (!moodLogs || moodLogs.length === 0) return null;
    const sorted = [...moodLogs].sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return Math.round(sorted[0].mood);
  })();

  const pool = (latestScore !== null ? TIPS_BY_SCORE[latestScore] : null) || DEFAULT_TIPS;
  const tip = pool[tipIndex % pool.length];

  useEffect(() => { setIsApplied(false); }, [tipIndex, latestScore]);

  const recalibrate = () => {
    setIsRecalibrating(true);
    setTimeout(() => { setIsRecalibrating(false); setTipIndex(i => i + 1); }, 500);
  };

  const theme = latestScore === null
    ? { bg: '#F9FAFB', border: '#E5E7EB', accent: '#6B7280', badge: 'Awaiting data' }
    : latestScore <= 2
      ? { bg: '#FFF1F2', border: '#FECDD3', accent: '#E11D48', badge: `Low resilience (${latestScore}/5)` }
      : latestScore === 3
        ? { bg: '#FFFBEB', border: '#FDE68A', accent: '#B45309', badge: `Stable equilibrium (${latestScore}/5)` }
        : { bg: '#F0FDFA', border: '#99F6E4', accent: '#0F766E', badge: `Optimal coherence (${latestScore}/5)` };

  return (
    <div className="relative flex flex-col h-full overflow-y-auto" style={{ color: '#3C3C3C' }}>
      {/* Region backdrop */}
      <div aria-hidden className="absolute inset-0" style={{
        backgroundImage: 'url(/region-heroes/insight.webp)',
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
        <img src="/icons/daily_inspiration.webp" alt="" draggable={false}
          onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
          style={{ width: 34, height: 34, borderRadius: 10, boxShadow: '0 4px 10px rgba(180,83,9,0.3)' }} />
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-black truncate" style={{ color: '#1C1C1E' }}>Daily Inspiration</h2>
          <p className="text-[10px] truncate" style={{ color: '#9CA3AF' }}>Mood-matched daily directive</p>
        </div>
        <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shrink-0"
          style={{ background: 'rgba(255,255,255,0.75)', border: '1px solid #E5E7EB', color: '#6B7280' }}>
          {new Date().toLocaleDateString('en', { month: 'short', day: 'numeric' })}
        </span>
      </div>

      <div className="flex-1 px-4 py-4 space-y-4 max-w-xl mx-auto w-full">
        <div className="rounded-3xl p-5" style={{
          background: `linear-gradient(180deg, ${theme.bg}EE, rgba(255,255,255,0.82))`,
          backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
          border: `1.5px solid ${theme.border}`,
          boxShadow: `0 10px 30px ${theme.accent}22, 0 2px 8px rgba(0,0,0,0.04)`,
        }}>
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ background: '#FFFFFFAA', border: `1px solid ${theme.border}` }}>
              <Brain className="w-3.5 h-3.5" style={{ color: theme.accent }} />
              <span className="text-[10px] font-black tracking-wider font-mono" style={{ color: '#3C3C3C' }}>{NARRATOR.name} directive</span>
            </div>
            <span className="text-[8.5px] font-black uppercase px-2 py-0.5 rounded-md tracking-wider font-mono" style={{ color: theme.accent, background: '#FFFFFFAA' }}>
              {theme.badge}
            </span>
          </div>

          {/* LANCE himself delivers the briefing — pose tracks your state */}
          <div className="flex items-start gap-3">
            <motion.img
              key={latestScore ?? 'none'}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              src={(LANCE_POSES as Record<string, string>)[
                latestScore === null ? 'idle' : latestScore <= 2 ? 'thinking' : latestScore === 3 ? 'pointing' : 'approving'
              ] ?? (LANCE_POSES as Record<string, string>).idle}
              alt="" draggable={false}
              style={{ width: 72, height: 84, objectFit: 'contain', flexShrink: 0, filter: `drop-shadow(0 8px 14px ${theme.accent}33)` }}
            />
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5 mb-2" style={{ color: '#3C3C3C' }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: theme.accent }} />
                {tip.title}
              </h4>

              <div className="min-h-[3.2rem]">
                <AnimatePresence mode="wait">
                  {isRecalibrating ? (
                    <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="flex items-center gap-2.5 text-xs py-2 italic" style={{ color: '#9CA3AF' }}>
                      <RefreshCw className="w-4 h-4 animate-spin" style={{ color: theme.accent }} />
                      <span>Finding another angle...</span>
                    </motion.div>
                  ) : (
                    <motion.p key={tip.text} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                      className="text-sm leading-relaxed" style={{ color: '#4B5563' }}>
                      {tip.text}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-4">
            <button
              onClick={recalibrate} disabled={isRecalibrating}
              title="Get another angle"
              aria-label="Get another angle"
              className="p-3 rounded-xl transition cursor-pointer flex items-center justify-center border active:scale-90"
              style={{ background: '#FFFFFF', borderColor: theme.border, color: theme.accent }}
            >
              <RefreshCw className={`w-4 h-4 ${isRecalibrating ? 'animate-spin' : ''}`} />
            </button>

            {tip.actionApp && onOpenTool && (
              <button
                onClick={() => onOpenTool(ACTION_DESTINATIONS[tip.actionApp!] ?? 'mood_log')}
                className="flex-1 px-3 py-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition cursor-pointer text-white active:scale-95"
                style={{ background: theme.accent, boxShadow: `0 3px 0 ${theme.accent}88, 0 6px 14px ${theme.accent}44` }}
              >
                {tip.actionLabel ?? 'Open tool'}
              </button>
            )}

            <button
              onClick={() => { setIsApplied(true); addXp(10); }}
              disabled={isApplied}
              className="px-3 py-3 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 transition cursor-pointer border active:scale-95"
              style={isApplied ? { background: '#ECFDF5', borderColor: '#A7F3D0', color: '#059669' } : { background: '#FFFFFF', borderColor: theme.border, color: '#6B7280' }}
            >
              {isApplied ? (<><Check className="w-3.5 h-3.5" /><span>Noted +10 XP</span></>) : <span>Mark noted</span>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
